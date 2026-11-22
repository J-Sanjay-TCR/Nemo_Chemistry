"use strict";
const { GoogleGenAI, ThinkingLevel } = require("@google/genai");
const { getFallbackDiagram, compileReactionScene } = require("./chemistry-diagrams.js");
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

// Free-tier eligible Gemini models ordered for low-latency JSON generation first
const DIAGRAM_MODELS = [
  "gemini-3.1-flash-lite",
  process.env.GEMINI_MODEL || "gemini-4-hydrogen"
].filter((m, i, arr) => m && arr.indexOf(m) === i);

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

const diagramHits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (diagramHits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now);
  diagramHits.set(ip, arr);
  if (diagramHits.size > 5000) {
    for (const [k, v] of diagramHits) {
      if (!v.some((t) => now - t < 60000)) diagramHits.delete(k);
    }
  }
  return arr.length > 25;
}

function svgToDataUrl(svg) {
  const b64 = Buffer.from(svg, "utf8").toString("base64");
  return `data:image/svg+xml;base64,${b64}`;
}

function normalizeHistory(rawHistory) {
  if (!Array.isArray(rawHistory)) return [];
  return rawHistory
    .slice(-3)
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({
      role: m.role === "assistant" ? "Assistant" : "Student",
      text: m.content.replace(/```[\s\S]*?```/g, " ").replace(/\s+/g, " ").trim().slice(0, 220)
    }));
}

function buildScenePrompt(topic, rawPrompt, context, history, level) {
  const levelLabel =
    level === "cbse" ? "CBSE Class 11-12 NCERT"
    : level === "main" ? "JEE Main"
    : level === "adv" ? "JEE Advanced"
    : "CBSE & JEE";

  const lines = [
    `Design a precise, textbook-grade 2D Chemistry Diagram (${levelLabel}) matching the student's request.`,
    ""
  ];

  if (history.length) {
    lines.push("Recent Conversation Context (resolve any 'it', 'this', 'step 2', or pronoun references from here!):");
    for (const turn of history) {
      lines.push(`- ${turn.role}: ${turn.text}`);
    }
    lines.push("");
  }

  lines.push(`Resolved Focus Topic: ${(topic || rawPrompt || "Chemical Mechanism").trim().slice(0, 240)}`);
  if (rawPrompt) {
    lines.push(`Latest Student Prompt: ${rawPrompt.trim().slice(0, 320)}`);
  }

  if (context && typeof context === "string" && context.trim()) {
    const cleanContext = context.replace(/```[\s\S]*?```/g, " ").replace(/\$\$[\s\S]*?\$\$/g, " ").replace(/\s+/g, " ").trim().slice(0, 520);
    if (cleanContext) {
      lines.push("", `Tutor Explanation Reference: ${cleanContext}`);
    }
  }

  lines.push(
    "",
    "Select the BEST `diagramType` for the prompt:",
    "1. `diagramType: 'graph'` — Use for activation energy / reaction coordinate profiles, exothermic/endothermic ΔH plots, Arrhenius (ln k vs 1/T), kinetics curves, titration pH curves, Maxwell-Boltzmann distributions, or any plot/curve/graph request.",
    "   * Populate `graph` with `xLabel`, `yLabel`, `xTicks`, `yTicks`, optional `baselineY` (0..100) & `baselineLabel`, 1–4 `curves` (points in [0..100, 0..100]), `brackets` (e.g. Ea, Ea', ΔH), `markers` (e.g. Reactants, [TS]‡, Products, Equivalence Pt), and `summaryRows` (key-value pairs).",
    "2. `diagramType: 'structure'` — Use for comparing or showcasing 1–3 organic/inorganic molecular structures (e.g. Benzene vs. Chlorobenzene, VSEPR geometries like SF6/XeF4, coordination complexes like [Fe(CN)6]4-).",
    "   * Populate `stages` (1–3 cards side by side, no reaction arrows between them) with large crisp molecular structures (`r: 36..48`), lone pairs (`showLonePairs: true`), partial charges (`charges`), `inorganic_complex`, or `vsepr` nodes.",
    "3. `diagramType: 'mechanism'` — Use for organic/inorganic chemical reaction equations and multi-step curved-arrow mechanisms.",
    "   * Produce 3 `stages` ordered left-to-right (1. Reactants/Activation -> 2. Key Intermediate / Radical / [‡] TS -> 3. Major Product) with `transitions` (reagents ABOVE, conditions/byproducts BELOW). Put at most 2 molecules per stage cleanly spaced (e.g. rx: 0.34, ry: 0.56 for ring and rx: 0.76, ry: 0.28 for attacking species).",
    "",
    "Available 2D Molecule Types inside `stages[].molecules` (normalized rx 0.16..0.84, ry 0.24..0.76):",
    "- `'benzene'` / `'arenium'` / `'cyclohexane'`: 6-membered hexagon (`aromatic`: `'kekule'` | `'circle'` | `'arenium'`). Substituents `top`, `topRight`, `bottomRight`, `bottom`, `bottomLeft`, `topLeft`, `gemLeft`/`gemRight`, `ringName`, `showLonePairs: true` (for Cl/Br/OH/NH2), optional `charges` map. NEVER use SMILES `#` — write Unicode `N≡N⁺`, `C≡N`, `C≡C`! NEVER duplicate `+` in both `top` and `chargeTopRight`.",
    "- `'inorganic_complex'`: Coordination complex `[M(L)n]^q` (`metal`, `charge`, `geometry`: `'octahedral'`|`'square_planar'`|`'tetrahedral'`, `ligands` array of ligand strings, `caption`).",
    "- `'vsepr'`: Inorganic VSEPR shape (`center`, `geometry`: `'linear'`|`'trigonal_planar'`|`'bent'`|`'tetrahedral'`|`'trigonal_bipyramidal'`|`'octahedral'`, `ligands` array, `lonePairCount`, `angleLabel`, `caption`).",
    "- `'chair'`, `'pentagon'` (`vertexAtoms` array of 5), `'carbonyl'`, `'alkene'`, `'tetrahedral'`, `'planar_cation'`, `'transition_state'` (ONLY for aliphatic SN2 with explicit `nu`, `lg`, `r1`, `r2`), `'formula'`.",
    "",
    "MANDATORY ACADEMIC & FORMATTING RULES:",
    "- Populate `equation` with clean Unicode reaction equation (NO raw LaTeX and NO SMILES `#` inside `equation`, `title`, or SVG fields — use explicit subscripts/superscripts like `Ar–N₂⁺ + [CuCl₂]⁻ ⟶ Ar–Cl + N₂↑ + CuCl`).",
    "- Populate `latexEquation` with valid KaTeX/mhchem math (e.g. `\\\\ce{Ar-N2+Cl- + CuCl ->[\\\\text{HCl}] Ar-Cl + N2 ^ + CuCl}`) WITHOUT surrounding `$$`.",
    "- Populate `catalysts` with 1–3 concise strings naming catalysts, conditions, or key constants (may use `$...$` KaTeX math).",
    "- Populate `caption` with a crisp 1-sentence summary (may use `$...$` KaTeX math).",
    "- Populate EVERY stage's `note` (6–12 words explaining bond cleavage/formation or electronics) so cards have no empty footer gap.",
    "- For mechanisms, ALWAYS include `curvedArrows` (`kind`: `'nuc'` for electron-rich attack, `'lg'` for bond cleavage) arcing cleanly OUTSIDE ring centers and OUTSIDE text boxes (e.g., from donor substituent edge `ry: 0.25` to acceptor edge `ry: 0.23`), plus transition state/intermediate `[‡]` geometry & hybridisation annotations via `ringName`/`sub`/`note` (do NOT use `type: 'transition_state'` for aromatic or radical mechanisms — use `benzene`/`arenium` + `top: '•'` or `formula`), and a crisp `examTrap`.",
    "",
    "Return a single valid JSON object with top-level keys:",
    "`{ \"diagramType\": \"mechanism\"|\"structure\"|\"graph\", \"title\": string, \"subtitle\": string, \"equation\": string, \"latexEquation\": string, \"catalysts\": string[], \"caption\": string, \"examTrap\": string, \"stages\"?: [{ \"title\": string, \"tone\"?: \"blue\"|\"orange\"|\"green\"|\"purple\"|\"teal\", \"note\"?: string, \"molecules\": [{ \"type\": string, \"rx\": number, \"ry\": number, \"r\"?: number, \"aromatic\"?: string, \"ringName\"?: string, \"showLonePairs\"?: boolean, \"top\"?: string, \"topRight\"?: string, \"bottomRight\"?: string, \"bottom\"?: string, \"bottomLeft\"?: string, \"topLeft\"?: string, \"gemLeft\"?: string, \"gemRight\"?: string, \"chargeTopRight\"?: string, \"chargeBottom\"?: string, \"chargeTopLeft\"?: string, \"text\"?: string, \"sub\"?: string, \"color\"?: string, \"boxed\"?: boolean, \"nu\"?: string, \"lg\"?: string, \"r1\"?: string, \"r2\"?: string, \"metal\"?: string, \"center\"?: string, \"charge\"?: string, \"geometry\"?: string, \"ligands\"?: string[], \"lonePairCount\"?: number, \"angleLabel\"?: string, \"caption\"?: string }], \"curvedArrows\"?: [{ \"fromRx\": number, \"fromRy\": number, \"toRx\": number, \"toRy\": number, \"arc\"?: number, \"kind\"?: \"nuc\"|\"lg\" }] }], \"transitions\"?: [{ \"type\"?: string, \"above\"?: string, \"below\"?: string }], \"graph\"?: { \"xLabel\": string, \"yLabel\": string, \"baselineY\"?: number, \"baselineLabel\"?: string, \"vLines\"?: [{ \"x\": number, \"label\": string, \"color\"?: string }], \"xTicks\": [{ \"pos\": number, \"label\": string }], \"yTicks\": [{ \"pos\": number, \"label\": string }], \"curves\": [{ \"label\": string, \"color\"?: string, \"dashed\"?: boolean, \"fillFromX\"?: number, \"points\": [[number, number]] }], \"brackets\"?: [{ \"x\": number, \"y1\": number, \"y2\": number, \"guideFromX\"?: number, \"label\": string, \"color\"?: string }], \"markers\"?: [{ \"x\": number, \"y\": number, \"label\": string, \"color\"?: string }], \"summaryRows\"?: [[string, string]] } }`"
  );

  return lines.join("\n");
}

function sanitizeChemStr(val) {
  if (typeof val !== "string") return "";
  return val
    .replace(/([A-Za-z0-9)\]])#([A-Za-z0-9(\[])/g, "$1≡$2")
    .replace(/\b(Ar|Ph|C6H5|C₆H₅|R)?\s*([-–—]?)\s*N\^\{?2\+\}?/g, (_, pfx, dash) => `${pfx || ""}${dash || ""}N₂⁺`)
    .replace(/\b(Ar|Ph|C6H5|C₆H₅)\s*([-–—]?)\s*N₂²⁺/g, (_, pfx, dash) => `${pfx}${dash || "–"}N₂⁺`)
    .replace(/(?:\[)?CuCl(?:₂|2)?\^?\{?2-\}?\]?|\[?CuCl₂²⁻\]?/g, "[CuCl₂]⁻")
    .replace(/(?:\[)?CuBr(?:₂|2)?\^?\{?2-\}?\]?|\[?CuBr₂²⁻\]?/g, "[CuBr₂]⁻")
    .trim();
}

function adaptSpecFromGemini(raw) {
  if (!raw || typeof raw !== "object") return null;

  const diagramType = ["graph", "structure", "mechanism"].includes(raw.diagramType)
    ? raw.diagramType
    : (raw.graph && Array.isArray(raw.graph.curves) && raw.graph.curves.length ? "graph" : "mechanism");

  const latexEquation = typeof raw.latexEquation === "string"
    ? raw.latexEquation.trim().replace(/^\$\$|\$\$$/g, "")
    : "";
  const catalysts = Array.isArray(raw.catalysts)
    ? raw.catalysts.filter((c) => typeof c === "string" && c.trim()).slice(0, 5)
    : [];

  if (diagramType === "graph" && raw.graph && typeof raw.graph === "object") {
    const curves = (Array.isArray(raw.graph.curves) ? raw.graph.curves : [])
      .map((c) => {
        if (!c || !Array.isArray(c.points)) return null;
        const pts = c.points
          .map((p) => {
            if (Array.isArray(p) && typeof p[0] === "number" && typeof p[1] === "number") {
              return [p[0], p[1]];
            }
            if (p && typeof p.x === "number" && typeof p.y === "number") {
              return [p.x, p.y];
            }
            return null;
          })
          .filter((p) => p && Number.isFinite(p[0]) && Number.isFinite(p[1]))
          .map((p) => [Math.min(100, Math.max(0, p[0])), Math.min(100, Math.max(0, p[1]))]);
        if (pts.length < 3) return null;
        return {
          label: c.label || "Curve",
          color: c.color || "",
          dashed: Boolean(c.dashed),
          fillFromX: typeof c.fillFromX === "number" ? c.fillFromX : undefined,
          points: pts
        };
      })
      .filter(Boolean)
      .slice(0, 5);

    if (curves.length >= 1) {
      return {
        diagramType: "graph",
        title: raw.title || "Chemistry Quantitative Graph",
        subtitle: raw.subtitle || "Scientific Profile · Key Parameters",
        equation: raw.equation || "",
        latexEquation,
        catalysts,
        examTrap: raw.examTrap || "",
        graph: {
          xLabel: raw.graph.xLabel || "Reaction Coordinate / Variable →",
          yLabel: raw.graph.yLabel || "Energy / Property",
          baselineY: typeof raw.graph.baselineY === "number" ? raw.graph.baselineY : undefined,
          baselineLabel: raw.graph.baselineLabel || "",
          vLines: Array.isArray(raw.graph.vLines) ? raw.graph.vLines.slice(0, 6) : [],
          xTicks: Array.isArray(raw.graph.xTicks) ? raw.graph.xTicks.slice(0, 8) : [],
          yTicks: Array.isArray(raw.graph.yTicks) ? raw.graph.yTicks.slice(0, 8) : [],
          curves,
          brackets: Array.isArray(raw.graph.brackets) ? raw.graph.brackets.slice(0, 5) : [],
          markers: Array.isArray(raw.graph.markers) ? raw.graph.markers.slice(0, 7) : [],
          summaryRows: Array.isArray(raw.graph.summaryRows)
            ? raw.graph.summaryRows.map((r) => (Array.isArray(r) ? [String(r[0] || ""), String(r[1] || "")] : [String((r && r.key) || ""), String((r && r.value) || "")])).slice(0, 6)
            : []
        }
      };
    }
  }

  const minStages = diagramType === "structure" ? 1 : 2;
  if (!Array.isArray(raw.stages) || raw.stages.length < minStages) {
    return null;
  }

  const stages = raw.stages.slice(0, 4).map((st, idx) => {
    const molecules = (Array.isArray(st.molecules) ? st.molecules : []).slice(0, 5).map((m) => {
      const rawSubs = (m && typeof m.subs === "object" && m.subs) ? m.subs : {};
      const subs = { ...rawSubs };
      if (m.top) subs.top = m.top;
      if (m.topRight) subs.topRight = m.topRight;
      if (m.bottomRight) subs.bottomRight = m.bottomRight;
      if (m.bottom) subs.bottom = m.bottom;
      if (m.bottomLeft) subs.bottomLeft = m.bottomLeft;
      if (m.topLeft) subs.topLeft = m.topLeft;
      if (m.gemLeft && m.gemRight) subs.gemTop = [m.gemLeft, m.gemRight];

      const rawCharges = (m && typeof m.charges === "object" && m.charges) ? m.charges : {};
      const charges = { ...rawCharges };
      if (m.chargeTopRight) charges.topRight = m.chargeTopRight;
      if (m.chargeBottom) charges.bottom = m.chargeBottom;
      if (m.chargeTopLeft) charges.topLeft = m.chargeTopLeft;

      const rawType = String(m.type || "formula");
      const missingSn2Substituents = /^(?:transition_state|pentacoordinate_ts|ts)$/i.test(rawType) && !m.nu && !m.lg && !m.r1 && !m.r2;
      const safeType = missingSn2Substituents
        ? (Object.keys(subs).length > 0 || m.ringName ? "benzene" : "formula")
        : rawType;

      const normSubs = {};
      for (const [sk, sv] of Object.entries(subs)) {
        if (typeof sv === "string") normSubs[sk] = sanitizeChemStr(sv);
        else if (Array.isArray(sv)) normSubs[sk] = sv.map((x) => sanitizeChemStr(String(x || "")));
        else if (sv && typeof sv === "object") normSubs[sk] = { ...sv, label: sanitizeChemStr(sv.label || "") };
        else normSubs[sk] = sv;
      }

      return {
        type: safeType,
        rx: typeof m.rx === "number" ? Math.min(0.86, Math.max(0.14, m.rx)) : 0.5,
        ry: typeof m.ry === "number" ? Math.min(0.78, Math.max(0.22, m.ry)) : 0.48,
        r: typeof m.r === "number" ? Math.min(48, Math.max(20, m.r)) : 32,
        aromatic: m.aromatic || "kekule",
        ringName: sanitizeChemStr(m.ringName || ""),
        showLonePairs: Boolean(m.showLonePairs),
        charges: Object.keys(charges).length ? charges : undefined,
        subs: normSubs,
        text: sanitizeChemStr(m.text || (missingSn2Substituents ? (m.caption || "[Intermediate / TS]‡") : "")),
        color: m.color || "",
        boxed: Boolean(m.boxed),
        sub: sanitizeChemStr(m.sub || ""),
        left: sanitizeChemStr(m.left || ""),
        right: sanitizeChemStr(m.right || ""),
        top: sanitizeChemStr(m.top || ""),
        tl: sanitizeChemStr(m.tl || ""),
        bl: sanitizeChemStr(m.bl || ""),
        tr: sanitizeChemStr(m.tr || ""),
        br: sanitizeChemStr(m.br || ""),
        wedge: sanitizeChemStr(m.wedge || ""),
        dash: sanitizeChemStr(m.dash || ""),
        nu: sanitizeChemStr(m.nu || ""),
        lg: sanitizeChemStr(m.lg || ""),
        r1: sanitizeChemStr(m.r1 || ""),
        r2: sanitizeChemStr(m.r2 || ""),
        deltaC: m.deltaC || "",
        deltaO: m.deltaO || "",
        delta: m.delta || "",
        caption: sanitizeChemStr(m.caption || ""),
        axialTopRight: sanitizeChemStr(m.axialTopRight || ""),
        eqTopRight: sanitizeChemStr(m.eqTopRight || ""),
        vertexAtoms: Array.isArray(m.vertexAtoms) ? m.vertexAtoms.slice(0, 5).map((v) => sanitizeChemStr(String(v || ""))) : undefined,
        metal: sanitizeChemStr(m.metal || ""),
        center: sanitizeChemStr(m.center || ""),
        charge: m.charge || "",
        geometry: m.geometry || "",
        ligands: Array.isArray(m.ligands) ? m.ligands.slice(0, 8).map((v) => sanitizeChemStr(String(v || ""))) : undefined,
        lonePairCount: typeof m.lonePairCount === "number" ? m.lonePairCount : 0,
        angleLabel: m.angleLabel || ""
      };
    });

    const hasContent = molecules.some((m) => m.type !== "formula" || (m.text && m.text.trim().length > 0));
    if (!hasContent) return null;

    const curvedArrows = (Array.isArray(st.curvedArrows) ? st.curvedArrows : []).slice(0, 4).map((ca) => ({
      fromRx: typeof ca.fromRx === "number" ? ca.fromRx : 0.3,
      fromRy: typeof ca.fromRy === "number" ? ca.fromRy : 0.5,
      toRx: typeof ca.toRx === "number" ? ca.toRx : 0.7,
      toRy: typeof ca.toRy === "number" ? ca.toRy : 0.5,
      arc: typeof ca.arc === "number" ? ca.arc : -24,
      kind: ca.kind === "lg" ? "lg" : "nuc"
    }));

    return {
      title: sanitizeChemStr(st.title || `Stage ${idx + 1}`),
      tone: st.tone || (idx === 0 ? "blue" : idx === raw.stages.length - 1 ? "green" : "orange"),
      molecules,
      curvedArrows,
      note: sanitizeChemStr(st.note || "")
    };
  });

  if (stages.some((s) => !s)) return null;

  const normTransitions = Array.isArray(raw.transitions)
    ? raw.transitions.slice(0, 3).map((tr) => ({
        type: (tr && tr.type) || "forward",
        above: sanitizeChemStr((tr && tr.above) || ""),
        below: sanitizeChemStr((tr && tr.below) || "")
      }))
    : [];

  return {
    diagramType,
    title: sanitizeChemStr(raw.title || "Chemistry Study Diagram"),
    subtitle: sanitizeChemStr(raw.subtitle || "2D Molecular Structures & Reaction Pathway"),
    equation: sanitizeChemStr(raw.equation || ""),
    latexEquation,
    catalysts,
    examTrap: sanitizeChemStr(raw.examTrap || ""),
    stages,
    transitions: normTransitions
  };
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
    return send(405, { error: "Method not allowed. Use POST." });
  }

  const ip =
    (req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"])) ||
    (req.socket && req.socket.remoteAddress) ||
    "?";
  const isRateLimited = limited(ip);

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
          if (raw.length > 50000) {
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
      return send(400, { error: e.message || "Invalid JSON body." });
    }
  } else if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (_) {
      return send(400, { error: "Invalid JSON body." });
    }
  }

  body = body || {};
  const prompt = typeof body.prompt === "string" ? body.prompt.trim().slice(0, 2000) : "";
  const topic = typeof body.topic === "string" ? body.topic.trim().slice(0, 400) : "";
  const context = typeof body.context === "string" ? body.context.trim().slice(0, 1800) : "";
  const level = typeof body.level === "string" ? body.level : "auto";
  const history = normalizeHistory(body.history);

  if (!prompt && !topic) {
    return send(400, { error: "Missing chemistry topic or prompt for diagram generation.", code: "MISSING_PROMPT" });
  }

  const sendFallbackDiagram = () => {
    const fb = getFallbackDiagram(topic, prompt, context, history);
    return send(200, {
      imageDataUrl: svgToDataUrl(fb.svg),
      mimeType: "image/svg+xml",
      caption: fb.caption,
      title: fb.title,
      latexEquation: fb.latexEquation || "",
      catalysts: Array.isArray(fb.catalysts) ? fb.catalysts : [],
      diagramType: fb.diagramType || "mechanism",
      model: fb.source,
      aspectRatio: "16:9"
    });
  };

  if (isRateLimited) {
    return sendFallbackDiagram();
  }

  const customKey =
    (req.headers && req.headers["x-goog-api-key"]) ||
    (req.headers && req.headers["authorization"] && req.headers["authorization"].replace(/^Bearer\s+/i, "")) ||
    (body && body.apiKey) ||
    "";

  const ai = getGenAI(customKey);
  if (!ai) {
    return sendFallbackDiagram();
  }

  const scenePrompt = buildScenePrompt(topic, prompt, context, history, level);
  const modelsToTry = DIAGRAM_MODELS.filter((m) => !isModelCoolingDown(m));
  if (!modelsToTry.length) {
    return sendFallbackDiagram();
  }
  const primaryModel = modelsToTry[0];
  const secondaryModel = modelsToTry[1] || null;
  const HEDGE_DELAY_MS = 5000;
  const TOTAL_DEADLINE_MS = 15000;
  const SYSTEM_INSTRUCTION = "You are a precision 2D organic, inorganic & physical chemistry illustrator for JEE Advanced. Return valid JSON ONLY (no markdown fences). Keep JSON compact and under ~650 words total (3 balanced stages, max 2 molecules per stage, max 12 points per graph curve). Choose diagramType ('graph' for plots/energy profiles/titration/kinetics, 'structure' for molecular comparisons like benzene vs chlorobenzene or inorganic complexes, 'mechanism' for chemical reaction pathways). Always provide clean Unicode plain-text (use ≡ never #) for SVG fields AND valid KaTeX/mhchem syntax in latexEquation and catalysts. For mechanisms, include detailed reaction arrow pushing (curved arrows arcing outside rings/text) and transition state/intermediate geometry & hybridisation annotations ([‡], sp²/sp³, bond angles, δ+/δ−).";

  const runModelAttempt = async (model, signal, timeoutMs) => {
    const localCtrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const onParentAbort = () => {
      if (localCtrl && !localCtrl.signal.aborted) localCtrl.abort();
    };
    if (signal) {
      if (signal.aborted) onParentAbort();
      else signal.addEventListener("abort", onParentAbort, { once: true });
    }

    let timerId = null;
    try {
      const config = {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      };
      if (localCtrl) {
        config.abortSignal = localCtrl.signal;
      }

      if (/flash-lite/i.test(model)) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.MINIMAL };
      } else if (/^gemini-[34]/i.test(model)) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const genPromise = ai.models.generateContent({
        model,
        contents: scenePrompt,
        config
      });
      // Prevent unhandled rejections if race completes or aborts early
      genPromise.catch(() => {});

      const timeoutPromise = new Promise((_, reject) => {
        timerId = setTimeout(() => {
          if (localCtrl && !localCtrl.signal.aborted) localCtrl.abort();
          reject(new Error(`Diagram model ${model} exceeded ${timeoutMs}ms budget`));
        }, timeoutMs);
      });

      const response = await Promise.race([genPromise, timeoutPromise]);
      clearTimeout(timerId);

      if (signal && signal.aborted) return null;

      const rawText = (response && response.text ? response.text : "")
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      if (!rawText) return null;

      let parsed = null;
      try {
        parsed = JSON.parse(rawText);
      } catch (_) {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try { parsed = JSON.parse(jsonMatch[0]); } catch (_) {}
        }
      }

      const spec = adaptSpecFromGemini(parsed);
      if (!spec) return null;

      const compiledSvg = compileReactionScene(spec);
      if (!compiledSvg || !compiledSvg.includes("<svg")) return null;

      return {
        imageDataUrl: svgToDataUrl(compiledSvg),
        mimeType: "image/svg+xml",
        caption: (parsed && typeof parsed.caption === "string" && parsed.caption.trim()) || spec.subtitle,
        title: spec.title || topic || prompt.slice(0, 90),
        latexEquation: spec.latexEquation || "",
        catalysts: Array.isArray(spec.catalysts) ? spec.catalysts : [],
        diagramType: spec.diagramType || "mechanism",
        model,
        aspectRatio: "16:9"
      };
    } catch (err) {
      clearTimeout(timerId);
      const errMsg = String((err && err.message) || err || "");
      const isQuota = /429|RESOURCE_EXHAUSTED|quota/i.test(errMsg);
      if (isQuota) {
        markModelQuotaCooldown(model, errMsg);
      }
      const isExpectedAbort = (signal && signal.aborted) || /abort|cancel|exceeded \d+ms budget/i.test(errMsg);
      if (!isQuota && !isExpectedAbort && /400|401|403|PERMISSION_DENIED|API_KEY_INVALID|NOT_FOUND/i.test(errMsg)) {
        console.warn(`[Nemo Diagram] API error on ${model}:`, errMsg.slice(0, 240));
      }
      return null;
    } finally {
      clearTimeout(timerId);
      if (signal) signal.removeEventListener("abort", onParentAbort);
    }
  };

  let raceResult = null;
  try {
    const raceCtrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    raceResult = await new Promise((resolve) => {
      let settled = false;
      let hedgeTimer = null;
      let deadlineTimer = null;
      let remainingAttempts = secondaryModel ? 2 : 1;
      let secondaryStarted = false;

      const finish = (payload) => {
        if (settled) return;
        settled = true;
        clearTimeout(hedgeTimer);
        clearTimeout(deadlineTimer);
        if (raceCtrl && !raceCtrl.signal.aborted) raceCtrl.abort();
        resolve(payload);
      };

      const startSecondary = () => {
        if (settled || secondaryStarted || !secondaryModel) return;
        secondaryStarted = true;
        runModelAttempt(secondaryModel, raceCtrl ? raceCtrl.signal : null, TOTAL_DEADLINE_MS - HEDGE_DELAY_MS)
          .then((resPayload) => {
            if (resPayload) return finish(resPayload);
            remainingAttempts -= 1;
            if (remainingAttempts <= 0) finish(null);
          })
          .catch(() => {
            remainingAttempts -= 1;
            if (remainingAttempts <= 0) finish(null);
          });
      };

      deadlineTimer = setTimeout(() => {
        finish(null);
      }, TOTAL_DEADLINE_MS);

      if (secondaryModel) {
        hedgeTimer = setTimeout(startSecondary, HEDGE_DELAY_MS);
      }

      runModelAttempt(primaryModel, raceCtrl ? raceCtrl.signal : null, TOTAL_DEADLINE_MS)
        .then((resPayload) => {
          if (resPayload) return finish(resPayload);
          remainingAttempts -= 1;
          if (secondaryModel && !secondaryStarted) {
            clearTimeout(hedgeTimer);
            startSecondary();
          } else if (remainingAttempts <= 0) {
            finish(null);
          }
        })
        .catch(() => {
          remainingAttempts -= 1;
          if (secondaryModel && !secondaryStarted) {
            clearTimeout(hedgeTimer);
            startSecondary();
          } else if (remainingAttempts <= 0) {
            finish(null);
          }
        });
    });
  } catch (_) {
    raceResult = null;
  }

  if (raceResult) {
    return send(200, raceResult);
  }

  return sendFallbackDiagram();
};
