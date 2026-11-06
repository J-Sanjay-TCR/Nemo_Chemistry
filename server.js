#!/usr/bin/env node
/* Nemo backend — zero dependencies (Node 18+). Gemini or Anthropic, key stays on the server.
 *
 *   GEMINI_API_KEY=...        node server.js     (Google AI Studio / Gemini API)
 *   ANTHROPIC_API_KEY=sk-ant-... node server.js  (Claude API)
 *   then open http://localhost:3000
 *
 * - Serves the front-end files (a whitelist, so nothing else on disk is exposed).
 * - POST /api/chat  {message, history[], level?: auto|cbse|main|adv} -> {answer}   (the key is never sent to the browser)
 * - GET  /api/health                      -> {ai: true|false, provider: "gemini"|"anthropic"|null, model}
 * Without a key the app stays in offline study mode (Library, PYQ bank, formulas, 3D molecules, practice all still work).
 *
 * Environment
 *   PORT (3000)   HOST (127.0.0.1 locally; 0.0.0.0 when PORT is provided by a host such as Cloud Run)
 *   NEMO_PROVIDER   gemini | anthropic   (default: whichever key is present; Gemini wins if both)
 *   GEMINI_API_KEY (or GOOGLE_API_KEY)   GEMINI_MODEL (default gemini-flash-latest)   GEMINI_BASE_URL (override for tests)
 *   ANTHROPIC_API_KEY                    NEMO_MODEL (default claude-sonnet-5-5)       ANTHROPIC_BASE_URL (override for tests)
 */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";
const GEMINI_BASE = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/+$/, "");
const ANTHROPIC_BASE = (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/+$/, "");
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
/* Gemini 3.8 Flash reasoning models with approved fallbacks */
const GEMINI_FALLBACKS = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
const ANTHROPIC_MODEL = process.env.NEMO_MODEL || "claude-sonnet-5-5";
const wanted = (process.env.NEMO_PROVIDER || "").toLowerCase();
const PROVIDER = wanted === "anthropic" && ANTHROPIC_KEY ? "anthropic" : wanted === "gemini" && GEMINI_KEY ? "gemini" : GEMINI_KEY ? "gemini" : ANTHROPIC_KEY ? "anthropic" : null;
const MODEL = PROVIDER === "gemini" ? GEMINI_MODEL : PROVIDER === "anthropic" ? ANTHROPIC_MODEL : null;

const ROOT = __dirname;
const JS = "text/javascript; charset=utf-8";
const FILES = {
  "/": ["index.html", "text/html; charset=utf-8"], "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/style.css": ["style.css", "text/css; charset=utf-8"], "/app.js": ["app.js", JS],
  "/data.js": ["data.js", JS], "/molecules.js": ["molecules.js", JS], "/pyq.js": ["pyq.js", JS],
  "/lib-physical.js": ["lib-physical.js", JS], "/lib-inorganic.js": ["lib-inorganic.js", JS],
  "/lib-organic.js": ["lib-organic.js", JS], "/lib-organic2.js": ["lib-organic2.js", JS],
  "/system-prompt.js": ["system-prompt.js", JS], "/lib-practical.js": ["lib-practical.js", JS],
  "/pyq_template.json": ["pyq_template.json", "application/json; charset=utf-8"]
};
const chatHandler = require("./api/chat.js");
const healthHandler = require("./api/health.js");
/* the tutor instruction lives in system-prompt.js (shared with the browser build); body.level picks the exam tier */
const PROMPT = require("./system-prompt.js");

/* very small in-memory rate limit: 20 requests per minute per IP */
const hits = new Map();
function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < 60000)) hits.delete(k);
  return arr.length > 20;
}
const send = (res, code, obj) => { const b = JSON.stringify(obj); res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }); res.end(b); };

/* Normalised conversation: alternating user/assistant turns that start and end with the user. */
function buildMessages(message, history) {
  const msgs = [];
  for (const m of Array.isArray(history) ? history.slice(-12) : []) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") continue;
    const content = m.content.slice(0, 4000);
    if (msgs.length && msgs[msgs.length - 1].role === m.role) msgs[msgs.length - 1].content += "\n\n" + content; else msgs.push({ role: m.role, content });
  }
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (msgs.length && msgs[msgs.length - 1].role === "user") msgs[msgs.length - 1].content += "\n\n" + message; else msgs.push({ role: "user", content: message });
  return msgs;
}

class ProviderError extends Error { constructor(status, message) { super(message); this.status = status; } }

async function callGemini(msgs, signal, system) {
  const models = [GEMINI_MODEL, ...GEMINI_FALLBACKS.filter((m) => m !== GEMINI_MODEL)];
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: msgs.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: 4096, temperature: 0.4 }
  });
  let last = null;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const perModelCtrl = new AbortController();
    const perModelTimer = setTimeout(() => perModelCtrl.abort(), 25000);
    const onAbort = () => perModelCtrl.abort();
    if (signal) signal.addEventListener("abort", onAbort);
    try {
      if (signal && signal.aborted) throw new DOMException("aborted", "AbortError");
      const r = await fetch(`${GEMINI_BASE}/models/${encodeURIComponent(model)}:generateContent`, {
        method: "POST", signal: perModelCtrl.signal, headers: { "content-type": "application/json", "x-goog-api-key": GEMINI_KEY }, body
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok) {
        const cand = (data.candidates || [])[0];
        const text = cand && cand.content && Array.isArray(cand.content.parts) ? cand.content.parts.filter((p) => p && typeof p.text === "string" && !p.thought).map((p) => p.text).join("").trim() : "";
        if (text) return text;
        const why = (data.promptFeedback && data.promptFeedback.blockReason) || (cand && cand.finishReason) || "empty response";
        return "I couldn't produce an answer for that (" + why + "). Please rephrase your question.";
      }
      last = new ProviderError(r.status, (data.error && data.error.message) || "error");
      console.error("Gemini API error", r.status, model, last.message);
      if (r.status === 503 || r.status === 500 || r.status === 429 || r.status === 404 || (r.status === 400 && /model/i.test(last.message))) {
        continue;
      }
      break;
    } catch (e) {
      if (signal && signal.aborted) throw e;
      console.warn("Gemini attempt error on", model, e.name, e.message);
      last = e;
      continue;
    } finally {
      clearTimeout(perModelTimer);
      if (signal) signal.removeEventListener("abort", onAbort);
    }
  }
  throw last;
}

async function callAnthropic(msgs, signal, system) {
  const r = await fetch(ANTHROPIC_BASE + "/v1/messages", {
    method: "POST", signal,
    headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: ANTHROPIC_MODEL, max_tokens: 1600, system, messages: msgs })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { console.error("Anthropic API error", r.status, data && data.error && data.error.message); throw new ProviderError(r.status, "error"); }
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
}

const server = http.createServer((req, res) => {
  const url = (req.url || "/").split("?")[0];
  if (url === "/favicon.ico") { res.writeHead(204); return res.end(); }
  if (url === "/api/health") return healthHandler(req, res);
  if (url === "/api/chat") {
    return chatHandler(req, res).catch((e) => {
      console.error("server.js chatHandler error:", e);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Server error." }));
      }
    });
  }
  if (req.method === "GET" && url.startsWith("/vendor/")) {
    const safeRel = path.normalize(url.replace(/^\/+/, "")).replace(/^(\.\.[\/\\])+/, "");
    const fullPath = path.join(ROOT, safeRel);
    if (fullPath.startsWith(path.join(ROOT, "vendor"))) {
      const ext = path.extname(fullPath).toLowerCase();
      const mimes = {
        ".css": "text/css; charset=utf-8",
        ".js": JS,
        ".woff2": "font/woff2",
        ".woff": "font/woff",
        ".ttf": "font/ttf",
        ".map": "application/json"
      };
      return fs.readFile(fullPath, (err, buf) => {
        if (err) {
          const isJs = ext === ".js";
          res.writeHead(404, { "Content-Type": isJs ? JS : "text/plain; charset=utf-8" });
          return res.end(isJs ? "/* vendor script not found */" : "Not found");
        }
        res.writeHead(200, { "Content-Type": mimes[ext] || "application/octet-stream", "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff" });
        res.end(buf);
      });
    }
  }
  if (req.method === "GET" && FILES[url]) {
    const [file, type] = FILES[url];
    return fs.readFile(path.join(ROOT, file), (err, buf) => {
      if (err) {
        const isJs = type === JS;
        res.writeHead(404, { "Content-Type": isJs ? JS : "text/plain; charset=utf-8" });
        return res.end(isJs ? "/* script not found */" : "Not found");
      }
      res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff" });
      res.end(buf);
    });
  }
  const isJs = url.endsWith(".js");
  res.writeHead(404, { "Content-Type": isJs ? JS : "text/plain; charset=utf-8" });
  res.end(isJs ? "/* 404: not found */" : "Not found");
});
server.listen(PORT, HOST, () => console.log(`Nemo running at http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}  (AI enabled: ${PROVIDER || "gemini-flash adaptive intelligence"}, model: ${MODEL || "gemini-2.5-flash"})`));
