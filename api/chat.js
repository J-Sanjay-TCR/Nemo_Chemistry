"use strict";
const { GoogleGenAI, ThinkingLevel } = require("@google/genai");
const PROMPT = require("../system-prompt.js");
const { generateChemistryFallback } = require("./chemistry-fallback.js");
const fs = require("fs");
const path = require("path");

// Load .env file if present in project or root
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

const DEPRECATED_MODEL_RE = /(?:^|\/)gemini-(?:1\.5|2\.0|pro\b)/i;
function normalizeModelName(raw, fallback = "gemini-4-hydrogen") {
  const m = String(raw || "").trim().replace(/^models\//i, "");
  if (!m || DEPRECATED_MODEL_RE.test(m)) return fallback;
  return m;
}

function getGenAI(customKey = "") {
  const key = String(customKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();
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
  return arr.length > 45;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const modelCooldowns = (globalThis.__nemoModelCooldowns = globalThis.__nemoModelCooldowns || new Map());
const transientCooldowns = (globalThis.__nemoTransientCooldowns = globalThis.__nemoTransientCooldowns || new Map());
function isModelCoolingDown(model) {
  const now = Date.now();
  const qUntil = modelCooldowns.get(model);
  if (qUntil) {
    if (now < qUntil) return true;
    modelCooldowns.delete(model);
  }
  const tUntil = transientCooldowns.get(model);
  if (tUntil) {
    if (now < tUntil) return true;
    transientCooldowns.delete(model);
  }
  return false;
}
function isQuotaCoolingDown(model) {
  const qUntil = modelCooldowns.get(model);
  if (!qUntil) return false;
  if (Date.now() < qUntil) return true;
  modelCooldowns.delete(model);
  return false;
}
function markModelQuotaCooldown(model, errMsg) {
  const isDaily = /PerDay|daily|GenerateRequestsPerDay|limit:\s*20\b/i.test(String(errMsg || ""));
  const ms = isDaily ? 20 * 60 * 1000 : 45 * 1000;
  modelCooldowns.set(model, Date.now() + ms);
}
function markModelTransientCooldown(model, ms = 35000) {
  transientCooldowns.set(model, Date.now() + ms);
}

function extractTextFromResponse(obj) {
  if (!obj) return "";
  try {
    const cands = obj.candidates;
    if (Array.isArray(cands) && cands.length) {
      const parts = cands[0] && cands[0].content && Array.isArray(cands[0].content.parts)
        ? cands[0].content.parts
        : null;
      if (parts) {
        const joined = parts
          .filter((p) => p && !p.thought && typeof p.text === "string")
          .map((p) => p.text)
          .join("");
        if (joined) return joined;
      }
    }
    if (typeof obj.text === "string" && obj.text) return obj.text;
  } catch (_) {}
  return "";
}

function extractBlockOrFinishReason(obj) {
  if (!obj) return "";
  try {
    if (obj.promptFeedback && obj.promptFeedback.blockReason) {
      return String(obj.promptFeedback.blockReason);
    }
    const cand = Array.isArray(obj.candidates) && obj.candidates[0];
    if (cand && cand.finishReason && cand.finishReason !== "STOP") {
      return String(cand.finishReason);
    }
  } catch (_) {}
  return "";
}

function isPoisonedStubHistoryText(txt) {
  const s = String(txt || "");
  if (!s) return true;
  return (
    s.includes("Answered via Nemo's Autonomous Chemistry Core") ||
    (s.includes("### 💡 Scientific Reasoning & Analysis") && s.includes("Every chemical and physical transformation is governed by")) ||
    s.includes("Nemo AI could not complete a live model response")
  );
}

function getSafeThinkingLevel(model, tier, isTrivialGreeting) {
  if (/flash-lite/i.test(model)) {
    if (isTrivialGreeting) return ThinkingLevel.MINIMAL;
    return tier === "deep" ? ThinkingLevel.MEDIUM : ThinkingLevel.LOW;
  }
  if (/^gemini-[34]/i.test(model)) {
    // Gemini 4 models reject ThinkingLevel.MINIMAL with HTTP 400; use LOW/MEDIUM
    return tier === "deep" ? ThinkingLevel.MEDIUM : ThinkingLevel.LOW;
  }
  return null;
}

function classifyUpstreamError(err, finishHint = "") {
  const msg = String((err && err.message) || err || "");
  const statusNum = Number(err && (err.status || err.statusCode || (err.error && err.error.code))) || 0;

  if (/401|403|PERMISSION_DENIED|API_KEY_INVALID|API key not valid/i.test(msg) || statusNum === 401 || statusNum === 403) {
    return {
      status: 403,
      code: "AUTH_ERROR",
      retryable: false,
      isQuota: false,
      isTransient: false,
      userMessage: "Gemini API key is invalid or unauthorized. Please verify GEMINI_API_KEY in Settings > Secrets."
    };
  }
  if (/429|RESOURCE_EXHAUSTED|quota|rate limit/i.test(msg) || statusNum === 429) {
    return {
      status: 429,
      code: "QUOTA_EXCEEDED",
      retryable: true,
      isQuota: true,
      isTransient: false,
      userMessage: "AI model quota is temporarily exhausted. Please wait a few seconds or switch to a billing-enabled API key in Settings > Secrets."
    };
  }
  if (/NOT_FOUND|404|model.*not.*found|is not found/i.test(msg) || statusNum === 404) {
    return {
      status: 502,
      code: "MODEL_NOT_FOUND",
      retryable: false,
      isQuota: false,
      isTransient: false,
      userMessage: "Configured AI model was unavailable on the endpoint; tried fallback models."
    };
  }
  if (/timed out|exceeded \d+ms|abort/i.test(msg)) {
    return {
      status: 504,
      code: "TIMEOUT",
      retryable: true,
      isQuota: false,
      isTransient: false,
      userMessage: "The AI model took too long to respond. Please tap Retry for a fresh attempt."
    };
  }
  if (/SAFETY|PROHIBITED|BLOCK/i.test(finishHint) || /SAFETY|PROHIBITED|blocked/i.test(msg)) {
    return {
      status: 422,
      code: "BLOCKED",
      retryable: false,
      isQuota: false,
      isTransient: false,
      userMessage: "The response was blocked by safety filters. Please rephrase your chemistry question."
    };
  }
  const isTransient = statusNum >= 500 || /500|502|503|504|UNAVAILABLE|INTERNAL|econnreset|etimedout|enotfound|fetch failed|socket|network|empty/i.test(msg);
  return {
    status: 502,
    code: "UPSTREAM_ERROR",
    retryable: true,
    isQuota: false,
    isTransient,
    userMessage: "Temporary connection glitch with the Gemini AI service. Please tap Retry."
  };
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Goog-Api-Key, Authorization");
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

  if (req.method !== "POST") {
    return send(405, { error: "Method not allowed. Use POST.", code: "METHOD_NOT_ALLOWED", retryable: false });
  }

  const ip = (req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"])) || (req.socket && req.socket.remoteAddress) || "?";
  const isRateLimited = limited(ip);

  // Parse request body safely
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
          if (raw.length > 80000) {
            clearTimeout(timer);
            req.destroy();
            reject(new Error("Request payload too large"));
          }
        });
        req.on("end", () => {
          clearTimeout(timer);
          if (!raw.trim()) return resolve({});
          try {
            resolve(JSON.parse(raw));
          } catch (_) {
            reject(new Error("Invalid JSON"));
          }
        });
        req.on("error", (e) => {
          clearTimeout(timer);
          reject(e);
        });
      });
    } catch (e) {
      return send(400, { error: e.message || "Invalid JSON body.", code: "BAD_JSON", retryable: false });
    }
  } else if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { return send(400, { error: "Invalid JSON body.", code: "BAD_JSON", retryable: false }); }
  }

  body = body || {};
  const rawInput = typeof body.message === "string"
    ? body.message
    : (typeof body.question === "string" ? body.question : (typeof body.prompt === "string" ? body.prompt : ""));
  const message = rawInput.trim().slice(0, 4000);
  if (!message) return send(400, { error: "Missing message.", code: "MISSING_MESSAGE", retryable: false });

  const wantsStream = body.stream !== false && (!req.headers.accept || req.headers.accept.includes("text/event-stream") || req.headers.accept.includes("*/*"));
  const lowerQ = message.toLowerCase();
  const msgWords = message.split(/\s+/).filter(Boolean);

  /* 1. Instant check for CR7 Fandom (only when asking about CR7 / favourite footballer, not unrelated science) */
  const hasCr7Entity = /\bcr\s*-?\s*7\b|\bcristiano\b|\bronaldo\b/i.test(lowerQ);
  const isCr7FanQuery =
    (hasCr7Entity && (/\b(u|you|your|yours|ur|nemo|sanjay|fan|fans|like|love|support|prefer|favou?rite|admire|goat|agree|right|true)\b/i.test(lowerQ) || msgWords.length <= 6)) ||
    /\b(favou?rite|fav)\s+(football(?:er)?|soccer\s+player|player|athlete)\b/i.test(lowerQ);

  if (isCr7FanQuery) {
    const cr7Answer = "### ⚽ SIUUU! Yes — 100% a CR7 Fan!\n\n" +
      "**Yes, absolutely!** I completely agree — I am a huge fan of **Cristiano Ronaldo (CR7)**! His discipline, relentless work ethic, and winning mindset are legendary.\n\n" +
      "And **J.Sanjay** (my creator and founder of Nemo AI) is also a huge **CR7 fan**! 🐐⚡\n\n" +
      "*Let's bring that same CR7 championship focus to mastering chemistry — ask me anything anytime!*";

    if (wantsStream) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"
      });
      res.write(`data: ${JSON.stringify({ type: "meta", tier: "simple", badge: "Fast Answer", model: "system", status: "connected" })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "chunk", text: cr7Answer })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "done", answer: cr7Answer, tier: "simple", model: "system" })}\n\n`);
      return res.end();
    }
    return send(200, {
      answer: cr7Answer,
      model: "system",
      tier: "simple",
      badge: "Fast Answer"
    });
  }

  /* 2. Tightened Instant Check for Founder J.Sanjay Tribute (never hijack "founder of modern chemistry", etc.) */
  const mentionsNemoOrSanjay = /\bnemo\b|\bj\.?\s*sanjay\b/i.test(lowerQ);
  const mentionsChemHistory = !mentionsNemoOrSanjay && /\b(?:modern\s+chemistry|atomic\s+theory|periodic\s+table|quantum|organic\s+chemistry|inorganic\s+chemistry|physical\s+chemistry|electrochemistry|thermodynamics|lavoisier|dalton|mendeleev|boyle|berzelius)\b/i.test(lowerQ);
  const isNemoFounderQuery = !mentionsChemHistory && (
    /\bwho\s+(?:made|created|built|designed|engineered|founded|owns|developed)(?:\s+(?:and|or|,)\s+(?:made|created|built|designed|engineered|founded|owns|developed))*\s+(?:you|nemo|this\s+(?:app|tutor|platform|site|bot))\b/i.test(lowerQ) ||
    /\b(?:the\s+)?(?:founder|creator|author|engineer|architect|developer)\s+(?:of\s+)?(?:nemo|this\s+(?:app|tutor|platform))\b/i.test(lowerQ) ||
    /\b(?:who\s+is|tell\s+me\s+about)\s+(?:your\s+founder|j\.?\s*sanjay)\b/i.test(lowerQ) ||
    /^\s*(?:j\.?\s*sanjay|founder\s+panel|who\s+is\s+founder)\s*[?!.]*$/i.test(lowerQ)
  );

  if (isNemoFounderQuery) {
    const founderAnswer = "### ✦ Visionary Founder & Architect: J.Sanjay\n\n" +
      "**Nemo AI Chemistry Tutor** was conceived, architected, and engineered from the ground up by **J.Sanjay** — visionary founder and lead software engineer.\n\n" +
      "J.Sanjay engineered Nemo to revolutionize science education with blistering speed, complete offline resilience, rotatable 3D molecular simulation, a 418+ KaTeX equation bank, and verified 10-year PYQ intelligence spanning 2016 through 2026.\n\n" +
      "You can click on the **J.Sanjay (Founder)** badge in the navigation bar to explore the full tribute!";

    if (wantsStream) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"
      });
      res.write(`data: ${JSON.stringify({ type: "meta", tier: "simple", badge: "Fast Answer", model: "system", status: "connected" })}\n\n`);
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

  /* 3. API Key Extraction */
  const customKey = (req.headers && req.headers["x-goog-api-key"]) ||
                    (req.headers && req.headers["authorization"] && req.headers["authorization"].replace(/^Bearer\s+/i, "")) ||
                    (body && body.apiKey) || "";
  const ai = getGenAI(customKey);

  /* 4. Query Complexity Classifier */
  const words = message.split(/\s+/).filter(Boolean);
  const inDepthPatterns = [
    /\b(mechanism|mechanisms|curved arrow|electron pushing)\b/i,
    /\b(derive|derivation|deduce|mathematical proof|proof of)\b/i,
    /\b(step[- ]by[- ]step|detailed explanation|explain in detail|elaborate|comprehensive|in[- ]depth)\b/i,
    /\b(thermodynamics?|kinetics?|rate law|integrated rate|activation energy|arrhenius|enthalpy|entropy|gibbs|osmotic|colligative|raoult|henry|van'?t hoff)\b/i,
    /\b(synthesis|synthetic route|retrosynthesis|reaction pathway)\b/i,
    /\b(stereochem|stereochemistry|enantiomer|diastereomer|optical activity|racemic|chiral|meso|newman|fischer)\b/i,
    /\b(coordination|cft|crystal field|spectrochemical|jahn[- ]teller|twin\s+complex|double\s+salt|complex\s+salt|(?:coordination|linkage|ioni[sz]ation|hydrate|geometrical|optical|stereoisomer)\s*isomer(?:ism)?|isomerism|werner'?s?\s+theory|magnetic\s+moment|unpaired\s+electrons|spin[- ]only|low[- ]spin|high[- ]spin)\b/i,
    /\b(hybridi[sz]ation|vsepr|molecular\s+orbital|mot|bond\s+order|acidic\s+strength|basic\s+strength|basicity|stability\s+order|reactivity\s+order|dipole\s+moment|anomal(?:y|ies)|exception|fajan|lattice|ionisation|ionization|electron\s+affinity)\b/i,
    /\b(numerical|calculate|compute|find the concentration|molality|molarity|normality|ph of|poh of|emf of|cell potential|oxidation state|oxidation number|iupac|empirical formula|limiting reagent|stoichiometr|packing efficiency|bragg|bohr|rydberg|de\s*broglie|quantum)\b/i,
    /\b(pyq|jee advanced|previous year|past year question|multi[- ]step|lewis acid|lewis base|aromaticit|huckel|bredt|drago|bent'?s rule|back[- ]bonding|inert pair|ortho effect|equilibrium|solubility|ksp|buffer|henderson|electrode potential|n[-\s]?factor|equivalent weight|disproportionation|redox)\b/i,
    /\b(compare|distinguish|differ(?:ence)?\s+between|versus|vs\.?|what\s+(?:is|are)\s+(?:twin|double|complex)\s+salts?|explain\s+(?:with\s+examples|why|how)|why\s+(?:is|does|do|are))\b/i,
    /\b(aldol|cannizzaro|reimer[- ]tiemann|kolbe|clemmensen|wolff[- ]kishner|gabriel|hoff?mann|sandmeyer|gattermann|wittig|perkin|hvz|beckmann|pinacol|ozonolysis|friedel[- ]crafts|grignard|brown\s+ring|lassaigne|chromyl\s+chloride|lucas|iodoform|tollens|fehling|wurtz|finkelstein|swarts)\b/i,
    /\b(option|options|assertion|reason|which of the following|correct statement|incorrect statement)\b|\([a-d]\)/i
  ];
  const hasInDepthTrigger = inDepthPatterns.some((rgx) => rgx.test(lowerQ));
  const isTableQuery = /\b(table|tabular|tabulate|compare|comparison|differences?|versus|vs\.?|distinguish|electronegativity|reagents?|summary chart|periodic trend)\b/i.test(lowerQ);
  const isDiagramQuery =
    /\b(draw|generate|create|illustrate|sketch|render|visualize|visualise|make|produce|show|plot)\b[\s\w,'"-]{0,50}\b(diagram|illustration|image|picture|figure|visual|flowchart|scheme|schematic|pathway|mechanism|2d\s+structure|structures?|conformation|graph|plot|curve|profile|chart|chemical\s+equation|reaction\s+equation|molecule|compound|complex)\b/i.test(lowerQ) ||
    /\b(diagram|illustration|schematic|2d\s+structure|graph|plot|curve|energy\s+profile)\s+(?:of|for|showing|between|comparing)\b/i.test(lowerQ) ||
    /^\s*(?:plot|graph|sketch|draw)\s+/i.test(lowerQ);
  const isAdv = body.level === "adv";
  const isTrivialGreeting = /^(?:hi|hello|hey|thanks|thank you|ok|okay|bye|who are you|help)[!.?\s]*$/i.test(lowerQ);
  const isHeavyCalcOrMech = /\b(mechanism|calculate|compute|numerical|find the|derive|derivation|synthesis|retrosynthesis|stoichiometr|ph of|emf of|equilibrium|ksp|buffer|option|assertion)\b/i.test(lowerQ);
  const isInDepth = isHeavyCalcOrMech || isDiagramQuery || words.length >= 14 || (hasInDepthTrigger && (words.length >= 6 || isAdv));

  const tableGuidance = isTableQuery
    ? "\n\n[TABULAR FORMAT & SOURCE ACCURACY]\nThe user requested structured tabular/comparative data. Include a clean, complete GitHub-Flavored Markdown table (`| Col | ... |` and `| --- | --- |`) with uniform column counts per row and NO unescaped `|` inside cells. Cite authoritative sources (IUPAC, Pauling/Allred scale, CRC Handbook, NCERT Class XI/XII) and note key chemical exceptions."
    : "";
  const diagramGuidance = isDiagramQuery
    ? "\n\n[COMPANION STUDY DIAGRAM ACTIVE]\nNemo's Diagram Studio is generating and attaching the 2D illustrative study diagram/graph directly inside this chat bubble. Do NOT state that you cannot draw/generate images and do NOT output ASCII art. Format ALL balanced chemical equations, catalysts above arrows (e.g. `\\ce{C6H6 + Cl2 ->[\\text{Anhy. FeCl3}] C6H5Cl + HCl}`), and quantitative laws inside standalone display LaTeX boxes (`$$ ... $$`), and provide a crisp structured walkthrough covering reagents, catalysts, **detailed reaction arrow pushing (curved arrows)**, **transition state geometry annotation** ([‡] structure, hybridisation & bond angles), or graph axes/slopes & key exam traps."
    : "";

  const factCheckGuidance = "\n\n[MANDATORY CROSS-VERIFICATION & ANTI-HALLUCINATION PROTOCOL]\n1. Premise & Interpretation Audit: Verify exact species, phase/solvent, and conditions; if the user's premise contains a misconception or false claim, state and correct it immediately in the first sentence.\n2. Quantitative, Logic & Electronic Check: Recompute all arithmetic/logarithms/stoichiometric ratios twice before stating a final number; cross-verify atom/charge balance, oxidation states (watch peroxide linkages), d^n/spin states (4d/5d always low-spin), unpaired electrons n, IUPAC thermodynamic signs, intensive E° (convert via ΔG°=-nFE°), water auto-ionisation floor (10^-7 M), and stereochemistry. For MCQs, explicitly verify each choice before picking the final option.\n3. Zero Hallucination: Never invent constants, catalysts, yields, or nonexistent rules. State standard assumptions explicitly when underspecified.";

  const classification = isInDepth ? {
    tier: "deep",
    badge: "Deep Reasoning",
    guidance: "\n\n[QUERY PROFILE: CORE-DEPTH REASONING]\nReason rigorously from chemical first principles. State exact definitions (contrasting commonly confused terms), cross-verify every derivation, arithmetic step, electronic state, and exception via NCERT/IUPAC standards, and present clean KaTeX formatting ($$...$$ and $...$)." + factCheckGuidance + tableGuidance + diagramGuidance
  } : {
    tier: "simple",
    badge: isTrivialGreeting ? "Fast Answer" : "Verified Answer",
    guidance: "\n\n[QUERY PROFILE: CONCISE & CROSS-VERIFIED]\nAnswer directly and concisely without fluff, while strictly cross-verifying the premise, stoichiometry/charge math, exceptions, and IUPAC definitions first. State the verified answer clearly in the opening sentence and note any critical exam trap." + factCheckGuidance + tableGuidance + diagramGuidance
  };

  const emitErrorResponse = (status, errInfo, strictFb = null) => {
    const payload = {
      error: errInfo.userMessage || "Unable to complete AI response.",
      code: errInfo.code || "UPSTREAM_ERROR",
      retryable: Boolean(errInfo.retryable),
      tier: classification.tier,
      strictFallback: strictFb && strictFb.matched ? {
        answer: strictFb.answer,
        badge: strictFb.badge,
        title: strictFb.title
      } : null
    };
    return send(status, payload);
  };

  if (isRateLimited) {
    return emitErrorResponse(429, {
      code: "RATE_LIMITED",
      retryable: true,
      userMessage: "Too many rapid requests from this connection. Please wait a few seconds and tap Retry."
    });
  }

  if (!ai) {
    const fb = generateChemistryFallback(message);
    if (fb && fb.matched) {
      if (wantsStream) {
        res.writeHead(200, {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
          "X-Accel-Buffering": "no"
        });
        res.write(`data: ${JSON.stringify({ type: "meta", tier: classification.tier, badge: fb.badge, model: "offline-core", status: "standby" })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: "chunk", text: fb.answer })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: "done", answer: fb.answer, tier: classification.tier, badge: fb.badge, model: "offline-core" })}\n\n`);
        return res.end();
      }
      return send(200, {
        answer: fb.answer,
        model: "offline-core",
        tier: classification.tier,
        badge: fb.badge,
        provider: "offline"
      });
    }
    return emitErrorResponse(503, {
      code: "NO_API_KEY",
      retryable: false,
      userMessage: "Live Gemini AI is not configured on this server (GEMINI_API_KEY is missing in Settings > Secrets)."
    });
  }

  const system = PROMPT.build(typeof body.level === "string" ? body.level : "auto");
  const configuredPrimary = normalizeModelName(process.env.GEMINI_MODEL || "gemini-4-hydrogen", "gemini-4-hydrogen");
  const requestedClientModel = typeof body.model === "string" && body.model.trim()
    ? normalizeModelName(body.model, configuredPrimary)
    : "";
  const primaryModel = (requestedClientModel && /^(?:gemini-4-hydrogen|gemini-3\.1-flash-lite)$/i.test(requestedClientModel))
    ? requestedClientModel
    : configuredPrimary;

  // Primary: gemini-4-hydrogen (full reasoning accuracy) -> Fast Backup: gemini-3.1-flash-lite
  const rawModels = [...new Set([primaryModel, "gemini-3.1-flash-lite", "gemini-4-hydrogen"])];
  let uniqueModels = rawModels.filter((m) => !isModelCoolingDown(m));
  if (!uniqueModels.length) {
    // If only transient overload cooldowns hid models (not 429 daily quota), clear transient flags and race all non-quota models
    transientCooldowns.clear();
    uniqueModels = rawModels.filter((m) => !isQuotaCoolingDown(m));
  }

  if (!uniqueModels.length) {
    const fb = generateChemistryFallback(message);
    return emitErrorResponse(429, {
      code: "QUOTA_EXCEEDED",
      retryable: true,
      userMessage: "All Gemini AI models are temporarily in quota cooldown. Please wait ~45 seconds and tap Retry, or select a paid API key in Settings > Secrets."
    }, fb);
  }

  // Build clean alternating conversation turns, stripping poisoned offline-stub turns
  const rawTurns = [];
  if (Array.isArray(body.history)) {
    for (const m of body.history.slice(-10)) {
      if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") continue;
      const text = m.content.slice(0, 3000).trim();
      if (!text) continue;
      if (m.role === "assistant" && isPoisonedStubHistoryText(text)) continue;
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
      if (turn.role === "model") continue;
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

  const TOTAL_DEADLINE_MS = 26000;
  const HEDGE_DELAY_MS = isTrivialGreeting ? 2500 : (classification.tier === "simple" ? 3500 : 4500);
  const requestStart = Date.now();
  const remainingBudget = () => TOTAL_DEADLINE_MS - (Date.now() - requestStart);

  let clientClosed = false;
  if (typeof res.on === "function") {
    res.on("close", () => {
      if (!res.writableEnded) clientClosed = true;
    });
  }

  const attemptModelOnce = async (model, parentSignal, budgetMs) => {
    const attemptStart = Date.now();
    let skipThinkingConfig = false;

    for (let thinkTry = 0; thinkTry < 2; thinkTry++) {
      const localCtrl = typeof AbortController !== "undefined" ? new AbortController() : null;
      const onParentAbort = () => {
        if (localCtrl && !localCtrl.signal.aborted) localCtrl.abort();
      };
      if (parentSignal) {
        if (parentSignal.aborted) onParentAbort();
        else parentSignal.addEventListener("abort", onParentAbort, { once: true });
      }

      let timerId = null;
      try {
        const config = {
          systemInstruction: system + classification.guidance
        };
        if (localCtrl) config.abortSignal = localCtrl.signal;

        if (!skipThinkingConfig) {
          const tl = getSafeThinkingLevel(model, classification.tier, isTrivialGreeting);
          if (tl) config.thinkingConfig = { thinkingLevel: tl };
        }

        const timeLeft = Math.max(2000, budgetMs - (Date.now() - attemptStart));

        if (wantsStream) {
          const makePhaseTimer = (ms, label) => new Promise((_, reject) => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
              if (localCtrl && !localCtrl.signal.aborted) localCtrl.abort();
              reject(new Error(`Model ${model} ${label} exceeded ${ms}ms`));
            }, ms);
          });

          const streamPromise = ai.models.generateContentStream({
            model,
            contents,
            config
          });
          streamPromise.catch(() => {});

          const stream = await Promise.race([
            streamPromise,
            makePhaseTimer(timeLeft, "connect")
          ]);
          const iterator = stream[Symbol.asyncIterator]();

          let firstText = "";
          let streamEndedEarly = false;
          let lastBlockOrFinish = "";

          while (true) {
            const stepLeft = timeLeft - (Date.now() - attemptStart);
            if (stepLeft <= 300) {
              if (localCtrl && !localCtrl.signal.aborted) localCtrl.abort();
              throw new Error(`Model ${model} first-token exceeded ${timeLeft}ms`);
            }
            const step = await Promise.race([
              iterator.next(),
              makePhaseTimer(stepLeft, "first-token")
            ]);
            if (!step || step.done) {
              streamEndedEarly = true;
              break;
            }
            const reason = extractBlockOrFinishReason(step.value);
            if (reason) lastBlockOrFinish = reason;
            const txt = extractTextFromResponse(step.value);
            if (txt && txt.length > 0) {
              firstText = txt;
              break;
            }
          }
          clearTimeout(timerId);

          if (!firstText) {
            const err = new Error(`Model ${model} returned empty stream${lastBlockOrFinish ? ` (${lastBlockOrFinish})` : ""}`);
            err._finishHint = lastBlockOrFinish;
            throw err;
          }

          return {
            ok: true,
            mode: "stream",
            model,
            firstText,
            iterator,
            streamEndedEarly,
            controller: localCtrl,
            detachParent: () => { if (parentSignal) parentSignal.removeEventListener("abort", onParentAbort); }
          };
        } else {
          const genPromise = ai.models.generateContent({
            model,
            contents,
            config
          });
          genPromise.catch(() => {});

          const timeoutPromise = new Promise((_, reject) => {
            timerId = setTimeout(() => {
              if (localCtrl && !localCtrl.signal.aborted) localCtrl.abort();
              reject(new Error(`Model ${model} timed out after ${timeLeft}ms`));
            }, timeLeft);
          });

          const response = await Promise.race([genPromise, timeoutPromise]);
          clearTimeout(timerId);

          const text = extractTextFromResponse(response).trim();
          if (!text) {
            const finishHint = extractBlockOrFinishReason(response);
            const emptyErr = new Error(`Model ${model} returned empty text${finishHint ? ` (${finishHint})` : ""}`);
            emptyErr._finishHint = finishHint;
            throw emptyErr;
          }

          return {
            ok: true,
            mode: "json",
            model,
            text,
            detachParent: () => { if (parentSignal) parentSignal.removeEventListener("abort", onParentAbort); }
          };
        }
      } catch (err) {
        clearTimeout(timerId);
        if (parentSignal) parentSignal.removeEventListener("abort", onParentAbort);

        const errMsg = String((err && err.message) || err || "");
        const finishHint = (err && err._finishHint) || "";
        const info = classifyUpstreamError(err, finishHint);

        if (thinkTry === 0 && !skipThinkingConfig && /400|INVALID_ARGUMENT/i.test(errMsg) && /thinking/i.test(errMsg)) {
          skipThinkingConfig = true;
          console.warn(`[Nemo AI] Retrying ${model} without thinkingConfig after 400:`, errMsg.slice(0, 180));
          continue;
        }

        if (info.isQuota) {
          markModelQuotaCooldown(model, errMsg);
        } else if (info.code === "TIMEOUT" || info.isTransient) {
          markModelTransientCooldown(model, 35000);
        }

        if (!(parentSignal && parentSignal.aborted)) {
          console.warn(`[Nemo AI] ${info.code} on ${model} (${Date.now() - attemptStart}ms):`, errMsg.slice(0, 180));
        }

        return {
          ok: false,
          model,
          info,
          errMsg,
          elapsedMs: Date.now() - attemptStart
        };
      }
    }
    return {
      ok: false,
      model,
      info: { status: 502, code: "UPSTREAM_ERROR", retryable: true, isTransient: true, userMessage: "Model failed before responding." },
      elapsedMs: Date.now() - attemptStart
    };
  };

  // Run staggered parallel hedge across primary + backup model so stalled primary never wastes 11s
  const runHedgedRace = (modelsList, phaseBudgetMs) => new Promise((resolve) => {
    const controllers = modelsList.map(() => (typeof AbortController !== "undefined" ? new AbortController() : null));
    let settled = false;
    let hedgeTimer = null;
    let deadlineTimer = null;
    let startedBackup = false;
    let finishedCount = 0;
    let lastFailure = null;
    const totalCount = modelsList.length;

    const finishWinner = (winner, winnerIdx) => {
      if (settled) {
        if (winner && winner.controller && !winner.controller.signal.aborted) winner.controller.abort();
        if (winner && winner.detachParent) winner.detachParent();
        return;
      }
      settled = true;
      clearTimeout(hedgeTimer);
      clearTimeout(deadlineTimer);
      controllers.forEach((ctrl, idx) => {
        if (idx !== winnerIdx && ctrl && !ctrl.signal.aborted) ctrl.abort();
      });
      resolve({ winner, failure: null });
    };

    const finishAllFailed = () => {
      if (settled) return;
      settled = true;
      clearTimeout(hedgeTimer);
      clearTimeout(deadlineTimer);
      controllers.forEach((ctrl) => {
        if (ctrl && !ctrl.signal.aborted) ctrl.abort();
      });
      resolve({ winner: null, failure: lastFailure });
    };

    const launchIndex = (idx) => {
      const m = modelsList[idx];
      const ctrl = controllers[idx];
      const rem = Math.max(2500, phaseBudgetMs - (Date.now() - requestStart));
      attemptModelOnce(m, ctrl ? ctrl.signal : null, rem).then((resObj) => {
        if (settled) {
          if (resObj && resObj.ok && resObj.controller && !resObj.controller.signal.aborted) resObj.controller.abort();
          if (resObj && resObj.detachParent) resObj.detachParent();
          return;
        }
        if (resObj && resObj.ok) {
          return finishWinner(resObj, idx);
        }
        finishedCount += 1;
        lastFailure = resObj;
        // Stop immediately on hard AUTH_ERROR (403)
        if (resObj && resObj.info && resObj.info.code === "AUTH_ERROR") {
          return finishAllFailed();
        }
        // If primary failed fast before hedge timer fired, launch backup immediately!
        if (idx === 0 && totalCount > 1 && !startedBackup) {
          startedBackup = true;
          clearTimeout(hedgeTimer);
          launchIndex(1);
          return;
        }
        if (finishedCount >= totalCount) {
          finishAllFailed();
        }
      });
    };

    deadlineTimer = setTimeout(() => {
      lastFailure = lastFailure || {
        ok: false,
        info: {
          status: 504,
          code: "TIMEOUT",
          retryable: true,
          isTransient: true,
          userMessage: "The AI model took too long to respond. Please tap Retry for a fresh attempt."
        }
      };
      finishAllFailed();
    }, phaseBudgetMs);

    if (totalCount > 1) {
      hedgeTimer = setTimeout(() => {
        if (!settled && !startedBackup) {
          startedBackup = true;
          launchIndex(1);
        }
      }, Math.min(HEDGE_DELAY_MS, Math.max(1500, phaseBudgetMs - 4000)));
    }

    launchIndex(0);
  });

  // Pass 1: Staggered hedged race across up to 2 healthy models
  const raceModels = uniqueModels.slice(0, 2);
  let outcome = await runHedgedRace(raceModels, remainingBudget());

  // Pass 2: One quick retry if all failed due to transient 503 burst and sufficient budget remains
  if (
    !outcome.winner &&
    !clientClosed &&
    outcome.failure &&
    outcome.failure.info &&
    outcome.failure.info.code !== "AUTH_ERROR" &&
    outcome.failure.info.code !== "BLOCKED" &&
    (outcome.failure.info.isTransient || outcome.failure.info.code === "QUOTA_EXCEEDED") &&
    remainingBudget() >= 5500
  ) {
    const retryCandidates = rawModels.filter((m) => !isQuotaCoolingDown(m));
    const retryModel = retryCandidates.find((m) => /flash-lite/i.test(m)) || retryCandidates[0];
    if (retryModel) {
      await sleep(320);
      if (!clientClosed && remainingBudget() >= 4500) {
        outcome = await runHedgedRace([retryModel], remainingBudget());
      }
    }
  }

  if (clientClosed) {
    if (outcome.winner && outcome.winner.controller && !outcome.winner.controller.signal.aborted) {
      outcome.winner.controller.abort();
    }
    if (outcome.winner && outcome.winner.detachParent) outcome.winner.detachParent();
    return;
  }

  if (outcome.winner) {
    const w = outcome.winner;
    if (w.detachParent) w.detachParent();

    if (w.mode === "json") {
      return send(200, {
        answer: w.text,
        model: w.model,
        tier: classification.tier,
        badge: classification.badge,
        provider: "gemini"
      });
    }

    // Winner already produced firstText -> commit SSE headers safely!
    if (!res.headersSent) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"
      });
    }

    res.write(`data: ${JSON.stringify({ type: "meta", tier: classification.tier, badge: classification.badge, model: w.model, status: "connected" })}\n\n`);
    let fullText = w.firstText;
    res.write(`data: ${JSON.stringify({ type: "chunk", text: w.firstText })}\n\n`);

    if (!w.streamEndedEarly) {
      const hardLeft = Math.max(2000, remainingBudget() + 8000);
      let hardTimerId = null;
      let idleTimerId = null;

      hardTimerId = setTimeout(() => {
        if (w.controller && !w.controller.signal.aborted) w.controller.abort();
      }, hardLeft);

      const resetIdle = () => {
        clearTimeout(idleTimerId);
        idleTimerId = setTimeout(() => {
          if (w.controller && !w.controller.signal.aborted) w.controller.abort();
        }, 14000);
      };

      try {
        resetIdle();
        while (!clientClosed) {
          const nextStep = await w.iterator.next();
          if (!nextStep || nextStep.done) break;
          resetIdle();
          const txt = extractTextFromResponse(nextStep.value);
          if (txt) {
            fullText += txt;
            res.write(`data: ${JSON.stringify({ type: "chunk", text: txt })}\n\n`);
          }
        }
      } catch (streamErr) {
        clearTimeout(hardTimerId);
        clearTimeout(idleTimerId);
        const partial = fullText.trim();
        const sInfo = classifyUpstreamError(streamErr);
        res.write(`data: ${JSON.stringify({
          type: "error",
          code: "STREAM_INTERRUPTED",
          error: sInfo.userMessage,
          partial,
          retryable: true
        })}\n\n`);
        return res.end();
      } finally {
        clearTimeout(hardTimerId);
        clearTimeout(idleTimerId);
      }
    }

    res.write(`data: ${JSON.stringify({ type: "done", answer: fullText, tier: classification.tier, badge: classification.badge, model: w.model })}\n\n`);
    return res.end();
  }

  const lastErrInfo = (outcome.failure && outcome.failure.info) || {
    status: 503,
    code: "UPSTREAM_ERROR",
    retryable: true,
    userMessage: "Unable to reach Gemini AI models right now. Please tap Retry."
  };
  const strictFb = generateChemistryFallback(message);
  return emitErrorResponse(lastErrInfo.status || 503, lastErrInfo, strictFb);
};

