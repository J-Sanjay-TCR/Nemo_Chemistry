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
  const isGetOrHead = req.method === "GET" || req.method === "HEAD";
  if (isGetOrHead && url.startsWith("/vendor/")) {
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
          return res.end(req.method === "HEAD" ? undefined : (isJs ? "/* vendor script not found */" : "Not found"));
        }
        res.writeHead(200, { "Content-Type": mimes[ext] || "application/octet-stream", "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff" });
        if (req.method === "HEAD") return res.end();
        res.end(buf);
      });
    }
  }
  if (isGetOrHead && FILES[url]) {
    const [file, type] = FILES[url];
    return fs.readFile(path.join(ROOT, file), (err, buf) => {
      if (err) {
        const isJs = type === JS;
        res.writeHead(404, { "Content-Type": isJs ? JS : "text/plain; charset=utf-8" });
        return res.end(req.method === "HEAD" ? undefined : (isJs ? "/* script not found */" : "Not found"));
      }
      res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff" });
      if (req.method === "HEAD") return res.end();
      res.end(buf);
    });
  }
  const isJs = url.endsWith(".js");
  res.writeHead(404, { "Content-Type": isJs ? JS : "text/plain; charset=utf-8" });
  res.end(isJs ? "/* 404: not found */" : "Not found");
});
server.listen(PORT, HOST, () => console.log(`Nemo running at http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}  (AI enabled: ${PROVIDER || "gemini-flash adaptive intelligence"}, model: ${MODEL || "gemini-2.5-flash"})`));
