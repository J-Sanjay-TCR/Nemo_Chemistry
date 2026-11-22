"use strict";
const fs = require("fs");
const path = require("path");
const { GoogleGenAI, ThinkingLevel } = require("@google/genai");

// Load .env file if present
try {
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq > 0) {
        const k = trimmed.slice(0, eq).trim();
        const v = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
        if (k && !process.env[k]) process.env[k] = v;
      }
    }
  }
} catch (_) {}

const DEPRECATED_MODEL_RE = /(?:^|\/)gemini-(?:1\.5|2\.0|pro\b)/i;
function normalizeModelName(raw, fallback = "gemini-4-hydrogen") {
  const m = String(raw || "").trim().replace(/^models\//i, "");
  if (!m || DEPRECATED_MODEL_RE.test(m)) return fallback;
  return m;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "no-store");

  const send = (code, obj) => {
    if (res.headersSent) return;
    if (typeof res.status === "function") {
      res.status(code).json(obj);
    } else {
      res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      res.end(JSON.stringify(obj));
    }
  };

  if (req.method === "OPTIONS") {
    if (typeof res.status === "function") return res.status(200).end();
    res.writeHead(200); return res.end();
  }

  const GEMINI_KEY = String(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();
  const ANTHROPIC_KEY = String(process.env.ANTHROPIC_API_KEY || "").trim();
  const hasKey = Boolean(GEMINI_KEY || ANTHROPIC_KEY);
  const primary = normalizeModelName(process.env.GEMINI_MODEL || "gemini-4-hydrogen", "gemini-4-hydrogen");
  const candidates = [...new Set([primary, "gemini-3.1-flash-lite", "gemini-4-hydrogen"])];

  const cooldownMap = globalThis.__nemoModelCooldowns instanceof Map ? globalThis.__nemoModelCooldowns : new Map();
  const transientMap = globalThis.__nemoTransientCooldowns instanceof Map ? globalThis.__nemoTransientCooldowns : new Map();
  const now = Date.now();
  const cooling = [];
  for (const m of candidates) {
    const qUntil = cooldownMap.get(m);
    const tUntil = transientMap.get(m);
    if (qUntil && qUntil > now) cooling.push(m);
    else {
      if (qUntil) cooldownMap.delete(m);
      if (tUntil && tUntil > now) cooling.push(m);
      else if (tUntil) transientMap.delete(m);
    }
  }
  const activeModel = candidates.find((m) => !cooling.includes(m)) || primary;
  const allCooling = cooling.length >= candidates.length;

  const basePayload = {
    ai: hasKey,
    status: !hasKey ? "standby" : (allCooling ? "degraded" : "live"),
    tts: Boolean(GEMINI_KEY),
    provider: "gemini",
    model: activeModel,
    primaryModel: primary,
    models: candidates,
    cooldowns: cooling,
    engine: "Google Gemini 4 Hydrogen Adaptive Intelligence",
    accelerated: true,
    architect: "J.Sanjay"
  };

  const wantsVerify = /[?&]verify=(?:1|true)\b/i.test(String(req.url || ""));
  if (!wantsVerify) {
    return send(200, basePayload);
  }

  if (!GEMINI_KEY) {
    return send(200, {
      ...basePayload,
      verified: false,
      code: "NO_API_KEY",
      error: "GEMINI_API_KEY is not set on the server."
    });
  }

  const ai = new GoogleGenAI({
    apiKey: GEMINI_KEY,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } }
  });

  const runProbe = async (model) => {
    const t0 = Date.now();
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    let timer = null;
    try {
      const cfg = {
        ...(ctrl ? { abortSignal: ctrl.signal } : {}),
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      };
      const p = ai.models.generateContent({
        model,
        contents: "Reply with only the chemical symbol of gold.",
        config: cfg
      });
      p.catch(() => {});
      const timeout = new Promise((_, rej) => {
        timer = setTimeout(() => {
          if (ctrl && !ctrl.signal.aborted) ctrl.abort();
          rej(new Error("Probe timed out after 10000ms"));
        }, 10000);
      });
      const r = await Promise.race([p, timeout]);
      clearTimeout(timer);
      const ans = String((r && r.text) || "").trim();
      return {
        model,
        ok: Boolean(ans),
        latencyMs: Date.now() - t0,
        sample: ans.slice(0, 40)
      };
    } catch (e) {
      clearTimeout(timer);
      return {
        model,
        ok: false,
        latencyMs: Date.now() - t0,
        error: String((e && e.message) || e || "").slice(0, 220)
      };
    }
  };

  const probeResults = await Promise.all(candidates.map((m) => runProbe(m)));

  const anyOk = probeResults.some((x) => x.ok);
  const firstOk = probeResults.find((x) => x.ok);
  return send(200, {
    ...basePayload,
    verified: anyOk,
    model: (firstOk && firstOk.model) || basePayload.model,
    probes: probeResults
  });
};

