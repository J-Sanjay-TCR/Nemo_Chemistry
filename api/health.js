"use strict";

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
  const wanted = (process.env.NEMO_PROVIDER || "").toLowerCase();
  const PROVIDER = wanted === "anthropic" && ANTHROPIC_KEY ? "anthropic" : wanted === "gemini" && GEMINI_KEY ? "gemini" : GEMINI_KEY ? "gemini" : ANTHROPIC_KEY ? "anthropic" : null;
  const MODEL = PROVIDER === "gemini" ? (process.env.GEMINI_MODEL || "gemini-3.8-flash") : PROVIDER === "anthropic" ? (process.env.NEMO_MODEL || "claude-sonnet-5-5") : "gemini-3.8-flash";

  return send(200, {
    ai: Boolean(GEMINI_KEY || ANTHROPIC_KEY),
    provider: PROVIDER || "gemini",
    model: MODEL,
    engine: "Google Gemini 3.8 Flash Live Intelligence",
    architect: "J.Sanjay"
  });
};
