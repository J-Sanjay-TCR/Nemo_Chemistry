"use strict";
const { GoogleGenAI, ThinkingLevel } = require("@google/genai");
const PROMPT = require("../system-prompt.js");
const fs = require("fs");
const path = require("path");

// Try reading .env file if present
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

let aiClient = null;
let cachedKey = "";

function getGenAI() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  if (!key) return null;
  if (!aiClient || cachedKey !== key) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    cachedKey = key;
  }
  return aiClient;
}

const hits = new Map();
function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < 60000)) hits.delete(k);
  return arr.length > 30;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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

  if (req.method !== "POST") {
    return send(405, { error: "Method not allowed. Use POST." });
  }

  const ip = (req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"])) || (req.socket && req.socket.remoteAddress) || "?";
  if (limited(ip)) return send(429, { error: "Too many requests. Please wait a minute." });

  let body = req.body;
  if (!body && typeof req.on === "function") {
    try {
      body = await new Promise((resolve, reject) => {
        let raw = "";
        req.on("data", (chunk) => {
          raw += chunk;
          if (raw.length > 60000) {
            req.destroy();
            reject(new Error("Request too large"));
          }
        });
        req.on("end", () => {
          if (!raw.trim()) return resolve({});
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            reject(new Error("Invalid JSON"));
          }
        });
        req.on("error", reject);
      });
    } catch (e) {
      return send(400, { error: e.message || "Invalid JSON body." });
    }
  } else if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { return send(400, { error: "Invalid JSON body." }); }
  }

  body = body || {};
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 3000) : "";
  if (!message) return send(400, { error: "Missing message." });

  const wantsStream = body.stream !== false && (!req.headers.accept || req.headers.accept.includes("text/event-stream") || req.headers.accept.includes("*/*"));

  /* 1. Instant check for Founder J.Sanjay Tribute */
  const lowerQ = message.toLowerCase();
  if (/(who (made|created|built|designed|engineered|founded|owns)|(founder|creator|author|engineer|architect) of nemo|who is (j\.?\s*sanjay|sanjay)|tell me about (j\.?\s*sanjay|sanjay)|founder|j\.sanjay)/i.test(lowerQ)) {
    const founderAnswer = "### ✦ Visionary Founder & Architect: J.Sanjay\n\n" +
      "**Nemo AI Chemistry Tutor** was conceived, architected, and engineered from the ground up by **J.Sanjay** — visionary founder and lead software engineer.\n\n" +
      "J.Sanjay engineered Nemo to revolutionize science education with blistering speed, complete offline resilience, rotatable 3D molecular simulation, a 418+ KaTeX equation bank, and verified 10-year PYQ intelligence spanning 2016 through 2026.\n\n" +
      "You can click on the **★ Founder: J.Sanjay** badge in the navigation bar to explore the full tribute!";

    if (wantsStream) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive"
      });
      res.write(`data: ${JSON.stringify({ type: "meta", tier: "simple", badge: "Fast Answer", model: "system" })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "chunk", text: founderAnswer })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "done", answer: founderAnswer, tier: "simple", model: "system" })}\n\n`);
      return res.end();
    }
    return send(200, {
      answer: founderAnswer,
      model: "system",
      tier: "simple",
      badge: "Fast Answer"
    });
  }

  /* 2. Live Google GenAI Integration with Gemini 3.8 Flash */
  const ai = getGenAI();
  if (!ai) {
    const notice = "### ✦ Connect to Gemini 3.8 Flash Online\n\n" +
      "Nemo's live AI brain is integrated with Google's new **Gemini 3.8 Flash** model (`@google/genai`).\n\n" +
      "To activate live responses, attach your Gemini API key under **Settings > Secrets** (`GEMINI_API_KEY`). Once attached, Nemo will reason through your chemistry derivations, mechanisms, and questions live with state-of-the-art intelligence!";

    if (wantsStream) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive"
      });
      res.write(`data: ${JSON.stringify({ type: "meta", tier: "simple", badge: "Setup Notice", model: "offline" })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "chunk", text: notice })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "done", answer: notice, tier: "simple", onlineRequired: true })}\n\n`);
      return res.end();
    }
    return send(200, { answer: notice, onlineRequired: true });
  }

  /* 3. Query Complexity Classifier: Simple vs In-Depth */
  const words = message.split(/\s+/).filter(Boolean);
  const inDepthPatterns = [
    /\b(mechanism|mechanisms|curved arrow|electron pushing)\b/i,
    /\b(derive|derivation|deduce|mathematical proof|proof of)\b/i,
    /\b(step[- ]by[- ]step|detailed explanation|explain in detail|elaborate|comprehensive|in[- ]depth)\b/i,
    /\b(thermodynamics?|kinetics?|rate law|integrated rate|activation energy|arrhenius)\b/i,
    /\b(synthesis|synthetic route|retrosynthesis|reaction pathway)\b/i,
    /\b(stereochem|stereochemistry|enantiomer|diastereomer|optical activity|racemic)\b/i,
    /\b(coordination|cft|crystal field|spectrochemical|jahn[- ]teller|isomerism in coordination)\b/i,
    /\b(numerical|calculate the|compute the|find the concentration|molality of|normality of|ph of|emf of|cell potential)\b/i,
    /\b(pyq|jee advanced|previous year|past year question|multi[- ]step)\b/i,
    /\b(compare and contrast|distinguish between|difference between)\b/i,
    /\b(aldol|cannizzaro|reimer[- ]tiemann|kolbe|clemmensen|wolff[- ]kishner|gabriel|hoff?mann)\b/i
  ];
  const hasInDepthTrigger = inDepthPatterns.some((rgx) => rgx.test(lowerQ));
  const isAdv = body.level === "adv";
  const isInDepth = hasInDepthTrigger || words.length >= 22 || (isAdv && words.length >= 12);

  const classification = isInDepth ? {
    tier: "deep",
    thinkingLevel: ThinkingLevel.MEDIUM,
    badge: "Deep Reasoning",
    guidance: "\n\n[QUERY PROFILE: IN-DEPTH REASONING]\nTake your time to reason through all intermediate steps. Provide structured headings, electron-pushing curved arrow explanations, thermodynamic/kinetic driving forces, clear KaTeX formulas ($$...$$ and $...$), and NCERT/JEE exceptions."
  } : {
    tier: "simple",
    thinkingLevel: ThinkingLevel.LOW,
    badge: "Fast Answer",
    guidance: "\n\n[QUERY PROFILE: RAPID & DIRECT]\nThe student asked a focused or direct query. Answer very quickly, accurately, and concisely. State the core answer, key formula or definition in the very first sentence without verbose preamble. Keep the output crisp and immediately helpful."
  };

  const system = PROMPT.build(typeof body.level === "string" ? body.level : "auto");
  const defaultModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const modelsToTry = isInDepth
    ? [defaultModel, "gemini-3.1-flash-lite", "gemini-flash-latest"]
    : ["gemini-3.1-flash-lite", defaultModel, "gemini-flash-latest"];

  // Build clean alternating conversation turns
  const rawTurns = [];
  if (Array.isArray(body.history)) {
    for (const m of body.history.slice(-10)) {
      if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") continue;
      const text = m.content.slice(0, 4000).trim();
      if (!text) continue;
      rawTurns.push({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text }]
      });
    }
  }
  rawTurns.push({
    role: "user",
    parts: [{ text: message }]
  });

  const contents = [];
  for (const turn of rawTurns) {
    if (!contents.length) {
      if (turn.role === "model") continue; // Gemini requires the first turn to be 'user'
      contents.push({ role: turn.role, parts: [{ text: turn.parts[0].text }] });
    } else {
      const last = contents[contents.length - 1];
      if (last.role === turn.role) {
        last.parts[0].text += "\n\n" + turn.parts[0].text;
      } else {
        contents.push({ role: turn.role, parts: [{ text: turn.parts[0].text }] });
      }
    }
  }

  let lastError = null;
  for (const model of modelsToTry) {
    try {
      const isGemini3or4 = /^gemini-[34]/i.test(model);
      const config = {
        systemInstruction: system + classification.guidance
      };
      if (isGemini3or4) {
        if (model.includes("flash-lite")) {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.MINIMAL };
        } else {
          config.thinkingConfig = { thinkingLevel: classification.thinkingLevel };
        }
      }

      if (wantsStream) {
        const streamPromise = ai.models.generateContentStream({
          model,
          contents,
          config
        });
        const attemptTimeoutMs = isInDepth ? 28000 : 8000;
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Model attempt timed out")), attemptTimeoutMs));
        const stream = await Promise.race([streamPromise, timeoutPromise]);

        res.writeHead(200, {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive"
        });

        res.write(`data: ${JSON.stringify({ type: "meta", tier: classification.tier, badge: classification.badge, model })}\n\n`);

        let fullText = "";
        for await (const chunk of stream) {
          const text = chunk.text;
          if (text) {
            fullText += text;
            res.write(`data: ${JSON.stringify({ type: "chunk", text })}\n\n`);
          }
        }

        res.write(`data: ${JSON.stringify({ type: "done", answer: fullText, tier: classification.tier, badge: classification.badge, model })}\n\n`);
        return res.end();
      } else {
        const response = await ai.models.generateContent({
          model,
          contents,
          config
        });
        const text = response.text;
        if (text && text.trim()) {
          return send(200, {
            answer: text.trim(),
            model,
            tier: classification.tier,
            badge: classification.badge,
            provider: "gemini"
          });
        }
      }
    } catch (err) {
      lastError = err;
      console.warn(`Gemini attempt error on ${model}:`, err.message || err);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ type: "error", error: err.message || "Streaming failed" })}\n\n`);
        return res.end();
      }
    }
  }

  console.error("Gemini live call error:", lastError);
  if (!res.headersSent) {
    return send(500, {
      error: `Gemini live model error: ${(lastError && lastError.message) || "Service unavailable."}`
    });
  }
};
