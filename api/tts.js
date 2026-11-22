"use strict";
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

// Load .env file if present in project root
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

// Non-paid Gemini 3.8 TTS models (primary: Flash Lite TTS, fallback: Flash TTS)
const TTS_MODELS = ["gemini-3.8-flash-lite-tts", "gemini-3.8-flash-tts"];
const ALLOWED_VOICES = new Set(["Zephyr", "Puck", "Kore", "Charon", "Fenrir"]);

const modelCooldowns = (globalThis.__nemoModelCooldowns = globalThis.__nemoModelCooldowns || new Map());
function isModelCoolingDown(model) {
  const until = modelCooldowns.get(model);
  if (!until) return false;
  if (Date.now() >= until) {
    modelCooldowns.delete(model);
    return false;
  }
  return true;
}
function markModelQuotaCooldown(model, errMsg) {
  const isDaily = /PerDay|daily|GenerateRequestsPerDay|limit:\s*20\b/i.test(String(errMsg || ""));
  const ms = isDaily ? 30 * 60 * 1000 : 45 * 1000;
  modelCooldowns.set(model, Date.now() + ms);
}

let aiClient = null;
let cachedKey = "";
function getGenAI(customKey = "") {
  const key = customKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
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

const ttsHits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (ttsHits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now);
  ttsHits.set(ip, arr);
  if (ttsHits.size > 5000) {
    for (const [k, v] of ttsHits) {
      if (!v.some((t) => now - t < 60000)) ttsHits.delete(k);
    }
  }
  return arr.length > 60;
}

// Defensive server-side safeguard ensuring zero Tamil/regional numerals reach TTS
const DIGIT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
function sanitizeTextForEnglishTTS(raw) {
  let s = String(raw || "");
  // Convert Tamil, Devanagari, Telugu, Kannada, Malayalam digits to ASCII
  const offsets = [
    [0x0BE6, 0x0BEF],
    [0x0966, 0x096F],
    [0x0C66, 0x0C6F],
    [0x0CE6, 0x0CEF],
    [0x0D66, 0x0D6F]
  ];
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    let mapped = null;
    for (const [start, end] of offsets) {
      if (code >= start && code <= end) {
        mapped = String(code - start);
        break;
      }
    }
    out += mapped !== null ? mapped : s[i];
  }
  // Strip any Tamil script block to prevent regional engine switching, and spell out remaining raw digits
  out = out
    .replace(/[\u0B80-\u0BFF]+/g, " ")
    .replace(/\u2212/g, " minus ")
    .replace(/\d/g, (d) => ` ${DIGIT_WORDS[Number(d)]} `)
    .replace(/\s+/g, " ")
    .trim();
  return out;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Goog-Api-Key, Authorization");
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
    res.writeHead(200);
    return res.end();
  }

  if (req.method !== "POST") {
    return send(405, { error: "Method not allowed. Use POST.", code: "METHOD_NOT_ALLOWED" });
  }

  const ip =
    (req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"])) ||
    (req.socket && req.socket.remoteAddress) ||
    "?";
  if (limited(ip)) {
    return send(429, { error: "Too many speech requests. Please wait a moment.", code: "RATE_LIMITED" });
  }

  let body = req.body;
  if (!body && typeof req.on === "function") {
    try {
      body = await new Promise((resolve, reject) => {
        let raw = "";
        const timer = setTimeout(() => {
          req.destroy();
          reject(new Error("Request body reading timed out"));
        }, 8000);
        req.on("data", (chunk) => {
          raw += chunk;
          if (raw.length > 30000) {
            clearTimeout(timer);
            req.destroy();
            reject(new Error("Request payload too large"));
          }
        });
        req.on("end", () => {
          clearTimeout(timer);
          if (!raw.trim()) return resolve({});
          try { resolve(JSON.parse(raw)); } catch (_) { reject(new Error("Invalid JSON")); }
        });
        req.on("error", (e) => { clearTimeout(timer); reject(e); });
      });
    } catch (e) {
      return send(400, { error: e.message || "Invalid JSON body.", code: "BAD_JSON" });
    }
  } else if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { return send(400, { error: "Invalid JSON body.", code: "BAD_JSON" }); }
  }

  body = body || {};
  const rawText = typeof body.text === "string" ? body.text.trim().slice(0, 2200) : "";
  if (!rawText) {
    return send(400, { error: "Missing text to synthesize.", code: "MISSING_TEXT" });
  }

  const spokenText = sanitizeTextForEnglishTTS(rawText);
  if (!spokenText) {
    return send(400, { error: "No speakable English content found.", code: "EMPTY_TEXT" });
  }

  const requestedVoice = typeof body.voiceName === "string" ? body.voiceName.trim() : "";
  const voiceName = ALLOWED_VOICES.has(requestedVoice) ? requestedVoice : "Zephyr";

  const customKey =
    (req.headers && req.headers["x-goog-api-key"]) ||
    (req.headers && req.headers["authorization"] && req.headers["authorization"].replace(/^Bearer\s+/i, "")) ||
    (body && body.apiKey) ||
    "";
  const ai = getGenAI(customKey);
  if (!ai) {
    return send(503, { error: "Gemini TTS requires a configured GEMINI_API_KEY on the server.", code: "NO_API_KEY" });
  }

  const modelsToTry = TTS_MODELS.filter((m) => !isModelCoolingDown(m));
  if (!modelsToTry.length) {
    return send(429, { error: "Gemini TTS quota cooldown active.", code: "QUOTA_EXCEEDED" });
  }

  const stylePrompt = typeof body.style === "string" && body.style.trim()
    ? body.style.trim().slice(0, 260)
    : "Warm, natural, human chemistry tutor in standard American English. Pronounce values and formulas clearly.";

  let lastStatus = 502;
  let lastCode = "TTS_UPSTREAM_ERROR";
  let lastError = "Unable to generate speech audio.";
  const ttsStart = Date.now();
  const TOTAL_TTS_BUDGET_MS = 9500;

  for (const model of modelsToTry) {
    const remaining = TOTAL_TTS_BUDGET_MS - (Date.now() - ttsStart);
    if (remaining < 1800) break;
    const perModelTimeout = Math.min(remaining, spokenText.length <= 220 ? 5200 : 7500);
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    let timerId = null;
    try {
      const genPromise = ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: spokenText,
                speechMetadata: {
                  style: stylePrompt
                }
              }
            ]
          }
        ],
        config: {
          ...(controller ? { abortSignal: controller.signal } : {}),
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName }
            }
          }
        }
      });
      genPromise.catch(() => {});

      const timeoutPromise = new Promise((_, reject) => {
        timerId = setTimeout(() => {
          if (controller && !controller.signal.aborted) controller.abort();
          reject(new Error(`Gemini TTS model ${model} timed out`));
        }, perModelTimeout);
      });

      const response = await Promise.race([genPromise, timeoutPromise]);
      clearTimeout(timerId);

      const parts = response?.candidates?.[0]?.content?.parts || [];
      const audioPart = parts.find((p) => p && p.inlineData && p.inlineData.data);
      if (audioPart && audioPart.inlineData && audioPart.inlineData.data) {
        return send(200, {
          audioBase64: audioPart.inlineData.data,
          mimeType: audioPart.inlineData.mimeType || "audio/wav",
          model,
          voiceName,
          spokenText
        });
      }
      lastStatus = 502;
      lastCode = "EMPTY_AUDIO";
      lastError = "TTS model returned no audio data.";
    } catch (err) {
      clearTimeout(timerId);
      const errMsg = String((err && err.message) || err || "");
      if (/429|RESOURCE_EXHAUSTED|quota/i.test(errMsg)) {
        markModelQuotaCooldown(model, errMsg);
        lastStatus = 429;
        lastCode = "QUOTA_EXCEEDED";
        lastError = "Gemini TTS quota exceeded.";
      } else if (/401|403|PERMISSION_DENIED|API_KEY_INVALID/i.test(errMsg)) {
        lastStatus = 403;
        lastCode = "AUTH_ERROR";
        lastError = "Invalid or unauthorized Gemini API key for TTS.";
        break;
      } else if (/timed out|abort/i.test(errMsg)) {
        lastStatus = 504;
        lastCode = "TIMEOUT";
        lastError = "Gemini TTS request timed out.";
      } else {
        lastStatus = 502;
        lastCode = "TTS_UPSTREAM_ERROR";
        lastError = errMsg.slice(0, 180) || "Gemini TTS error.";
      }
    }
  }

  return send(lastStatus, { error: lastError, code: lastCode });
};

module.exports.sanitizeTextForEnglishTTS = sanitizeTextForEnglishTTS;
