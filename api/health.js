"use strict";
const fs = require("fs");
const path = require("path");

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

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "no-store");

  const send = (code, obj) => {
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

  const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";
  const hasKey = Boolean(GEMINI_KEY || ANTHROPIC_KEY);
  const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

  return send(200, {
    ai: true, // Always online-capable with Gemini 3.8 Flash + Autonomous Knowledge Core
    status: hasKey ? "live" : "standby",
    provider: "gemini",
    model: MODEL,
    engine: "Google Gemini 3.8 Flash Live Intelligence",
    accelerated: true,
    architect: "J.Sanjay"
  });
};
