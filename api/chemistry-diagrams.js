"use strict";

/**
 * 2D Organic, Inorganic & Physical Chemistry Vector Engine (1080x620)
 * Polymorphic compiler supporting:
 *   1. "mechanism" / "equation": Multi-stage 2D structures (benzene, arenium, halobenzenes,
 *      carbonyls, alkenes, tetrahedral, planar sp2 carbocations, [‡] transition states,
 *      chairs, pentagons, VSEPR & inorganic coordination complexes), curved electron-pushing
 *      arrows, frosted catalyst/condition reaction arrows, and collision-safe auto-fitting.
 *   2. "structure": Showcase 1-3 organic/inorganic molecular architectures with lone pairs,
 *      bond angles, coordination brackets, and charge/resonance annotations.
 *   3. "graph": Cartesian 2D scientific plots (activation energy profiles with catalysis,
 *      Arrhenius/kinetics plots, acid-base titration curves, Maxwell-Boltzmann distributions)
 *      with smooth cubic splines, dimension brackets, callout badges, and right-hand data panel.
 */

const WIDTH = 1080;
const HEIGHT = 620;

const SUB_MAP = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
  "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉"
};
const SUP_MAP = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻"
};

function escXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toSub(digits) {
  return String(digits).replace(/[0-9]/g, (d) => SUB_MAP[d] || d);
}

function toSup(chars) {
  return String(chars).replace(/[0-9+-]/g, (c) => SUP_MAP[c] || c);
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function cleanLatexMarkup(raw) {
  let s = String(raw || "").trim();
  if (!s) return "";
  s = s.replace(/^\$\$|\$\$$/g, "").replace(/\$([^$]+)\$/g, "$1");
  // Handle \xrightarrow[below]{above} and \xrightarrow{above}
  s = s.replace(/\\xrightarrow\s*\[([^\]]*)\]\s*\{([^}]*)\}/g, (_, b, a) => ` ⟶ (${a}; ${b}) `);
  s = s.replace(/\\xrightarrow\s*\{([^}]*)\}/g, (_, a) => ` ⟶ (${a}) `);
  s = s.replace(/\\overset\s*\{([^}]*)\}\s*\{([^}]*)\}/g, (_, a, base) => `${base} (${a})`);
  // Strip outer \ce{...} while converting inner arrows cleanly
  for (let pass = 0; pass < 3; pass++) {
    s = s.replace(/\\ce\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (_, inner) => inner);
  }
  s = s.replace(/\\(?:text|mathrm|mathbf|mathit|mathsf|boldsymbol)\s*\{([^}]*)\}/g, "$1");
  s = s
    .replace(/\\rightleftharpoons/g, " ⇌ ")
    .replace(/\\longrightarrow|\\rightarrow|\\to\b/g, " ⟶ ")
    .replace(/\\leftrightarrow/g, " ↔ ")
    .replace(/\\Delta\b/g, "Δ")
    .replace(/\\ddagger/g, "‡")
    .replace(/\\degree|\^\\circ/g, "°")
    .replace(/\\delta\s*\^\{?\+\}?/g, "δ⁺")
    .replace(/\\delta\s*\^\{?[-−]\}?/g, "δ⁻")
    .replace(/\\delta\b/g, "δ")
    .replace(/\\alpha\b/g, "α")
    .replace(/\\beta\b/g, "β")
    .replace(/\\gamma\b/g, "γ")
    .replace(/\\lambda\b/g, "λ")
    .replace(/\\pi\b/g, "π")
    .replace(/\\sigma\b/g, "σ")
    .replace(/\\chi\b/g, "χ")
    .replace(/\\cdot/g, "·")
    .replace(/\\times/g, "×")
    .replace(/\\approx/g, "≈")
    .replace(/\\leq|\\le\b/g, "≤")
    .replace(/\\geq|\\ge\b/g, "≥")
    .replace(/\\neq|\\ne\b/g, "≠")
    .replace(/\\quad|\\qquad|\\,/g, " ")
    .replace(/\\([%&#_{}])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return s;
}

/**
 * Formats plain ASCII chemistry strings (e.g. CH3CH2OH, H2SO4, [Fe(CN)6]4-, C6H5Cl)
 * into clean Unicode chemical notation while protecting mechanism/orbital terms (SN2, E2, sp3d2).
 */
function formatChemText(input) {
  let s = cleanLatexMarkup(input);
  if (!s) return "";

  const protectedTokens = [];
  const hold = (val) => {
    const idx = protectedTokens.length;
    protectedTokens.push(val);
    return `@@CHEMTOK_${idx}@@`;
  };

  // Fix common model/ASCII chemistry charge typos before general subscripting
  s = s
    .replace(/\b(Ar|Ph|C6H5|C₆H₅|R)?\s*([-–—]?)\s*N\^\{?2\+\}?/g, (_, pfx, dash) => `${pfx || ""}${dash || ""}N₂⁺`)
    .replace(/\b(Ar|Ph|C6H5|C₆H₅)\s*([-–—]?)\s*N₂²⁺/g, (_, pfx, dash) => `${pfx}${dash || "–"}N₂⁺`)
    .replace(/(?:\[)?CuCl(?:₂|2)?\^?\{?2-\}?\]?|\[?CuCl₂²⁻\]?/g, "[CuCl₂]⁻")
    .replace(/(?:\[)?CuBr(?:₂|2)?\^?\{?2-\}?\]?|\[?CuBr₂²⁻\]?/g, "[CuBr₂]⁻")
    .replace(/(?:\[)?Cu\(CN\)(?:₂|2)?\^?\{?2-\}?\]?/g, "[Cu(CN)₂]⁻");

  // Protect hybridisation, mechanisms, orbital symbols & oxidation/step markers before subscripting
  s = s
    .replace(/\bsp3d2\b/gi, (m) => hold(m.slice(0, 2) + "³d²"))
    .replace(/\bsp3d\b/gi, (m) => hold(m.slice(0, 2) + "³d"))
    .replace(/\bd2sp3\b/gi, () => hold("d²sp³"))
    .replace(/\bdsp2\b/gi, () => hold("dsp²"))
    .replace(/\bsp([123])\b/gi, (_, n) => hold(`sp${toSup(n)}`))
    .replace(/\bS_?N([12i])\b/g, (_, n) => hold(`SN${n}`))
    .replace(/\bE([12])(?:cb)?\b/g, (m) => hold(m))
    .replace(/\b([1-6])p([xyz1-6])?\b/g, (m) => hold(m))
    .replace(/\b(18|14|13|15|17|2)O\b/g, (_, iso) => hold(`${toSup(iso)}O`))
    .replace(/\b([123])°/g, (m) => hold(m));

  s = s
    .replace(/\s*<->\s*|\s*<=>\s*/g, " ⇌ ")
    .replace(/\s*-->\s*|\s*->\s*/g, " ⟶ ")
    .replace(/([A-Za-z0-9)\]])#([A-Za-z0-9(\[])/g, "$1≡$2")
    .replace(/\^\{([^}]+)\}/g, (_, inner) => toSup(inner))
    .replace(/_\{([^}]+)\}/g, (_, inner) => toSub(inner))
    .replace(/\^([0-9]*[+-])/g, (_, inner) => toSup(inner))
    // Trailing complex bracket charges like [Fe(CN)6]4- or [CuCl2]-
    .replace(/([)\]])([0-9]*(?:\+(?=\s|$|[,;.)\]]|[A-Z])|-(?=\s|$|[,;.)\]])))/g, (_, br, ch) => `${br}${toSup(ch)}`)
    // Distinguish standalone multivalent metal cations (Fe3+, Cu2+, Al3+, Zn2+) from polyatomic ions (Ar-N2+, CuCl2-, NO2+, NH4+, SO42-)
    .replace(/([A-Za-z0-9()\[\]≡=–-]*?)([A-Za-z])([0-9]+)(\+(?=\s|$|[,;.)\]]|[A-Z])|-(?=\s|$|[,;.)\]]))/g, (_, prefix, lastCh, digits, sign) => {
      const baseTok = (prefix + lastCh).replace(/^[+-]/, "");
      if (digits.length >= 2) {
        return `${prefix}${lastCh}${toSub(digits.slice(0, -1))}${toSup(digits.slice(-1) + sign)}`;
      }
      if (/^(?:Fe|Cu|Zn|Mg|Ca|Ba|Sr|Be|Al|Ga|In|Cr|Mn|Co|Ni|Pb|Sn|Hg|Cd|Ti|V|Bi|Pt|Pd|Au|Ce|La|Sc|Y)$/.test(baseTok)) {
        return `${prefix}${lastCh}${toSup(digits + sign)}`;
      }
      return `${prefix}${lastCh}${toSub(digits)}${toSup(sign)}`;
    })
    .replace(/([A-Za-z)\]])([0-9]+)/g, (_, left, num) => `${left}${toSub(num)}`)
    // Trailing attached charges without preceding digit (e.g. N≡N+, H₃O+, Cl-, OH-, Na+, e-)
    .replace(/(^|[\s(,[{\/–—-]|[⁺⁻])([A-Za-z0-9()\[\]≡=δ₀-₉-]*?(?:[A-Z][a-z]?|[₀-₉)\]]|\be|δ))(\+(?=\s|$|[,;.)\]]|[A-Z])|-(?=\s|$|[,;.)\]]))/g, (_, lead, core, sign) => `${lead}${core}${toSup(sign)}`);

  s = s.replace(/@@CHEMTOK_(\d+)@@/g, (_, idx) => protectedTokens[Number(idx)] || "");
  return s;
}

function wrapLines(text, maxChars = 34, maxLines = 3) {
  const words = String(text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length <= maxChars) {
      cur = (cur + " " + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
      if (lines.length >= maxLines) break;
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  return lines;
}

function estimateTextW(text, fontSize = 13) {
  return String(text || "").length * (fontSize * 0.56);
}

const SVG_DEFS = `
  <defs>
    <marker id="arrow-rxn" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 1 1.5 L 9 5 L 1 8.5 z" fill="#0f172a"/>
    </marker>
    <marker id="arrow-eq-r" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M 1 2 L 9 5 L 1 5 z" fill="#0f172a"/>
    </marker>
    <marker id="arrow-eq-l" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M 9 5 L 1 5 L 9 8 z" fill="#0f172a"/>
    </marker>
    <marker id="arrow-res" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 1 1.5 L 9 5 L 1 8.5 z" fill="#4f46e5"/>
    </marker>
    <marker id="arrow-curved-nuc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M 1 1.5 L 9 5 L 1 8.5 z" fill="#dc2626"/>
    </marker>
    <marker id="arrow-curved-lg" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M 1 1.5 L 9 5 L 1 8.5 z" fill="#0284c7"/>
    </marker>
    <marker id="arrow-curved-neutral" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M 1 1.5 L 9 5 L 1 8.5 z" fill="#0f172a"/>
    </marker>
    <marker id="arrow-coord" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.8" markerHeight="5.8" orient="auto">
      <path d="M 1 2 L 9 5 L 1 8 z" fill="#0284c7"/>
    </marker>
    <marker id="arrow-axis" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M 1 1.5 L 9 5 L 1 8.5 z" fill="#0f172a"/>
    </marker>
    <marker id="arrow-dim-red" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
      <path d="M 1 2 L 9 5 L 1 8 z" fill="#dc2626"/>
    </marker>
    <marker id="arrow-dim-blue" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
      <path d="M 1 2 L 9 5 L 1 8 z" fill="#1d4ed8"/>
    </marker>
    <marker id="arrow-dim-green" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
      <path d="M 1 2 L 9 5 L 1 8 z" fill="#047857"/>
    </marker>
    <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="hdr-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0b1730"/>
      <stop offset="100%" stop-color="#132a52"/>
    </linearGradient>
  </defs>
`;

const TONES = {
  blue: { fg: "#1d4ed8", bg: "#eff6ff", border: "#93c5fd" },
  orange: { fg: "#c2410c", bg: "#fff7ed", border: "#fdba74" },
  purple: { fg: "#6d28d9", bg: "#f5f3ff", border: "#c4b5fd" },
  green: { fg: "#047857", bg: "#ecfdf5", border: "#6ee7b7" },
  red: { fg: "#b91c1c", bg: "#fef2f2", border: "#fca5a5" },
  teal: { fg: "#0f766e", bg: "#f0fdfa", border: "#5eead4" },
  slate: { fg: "#334155", bg: "#f1f5f9", border: "#cbd5e1" }
};

function wrapCanvas(title, subtitle, equation, body, examTrap) {
  const cleanTitle = formatChemText(title || "Chemistry Study Diagram");
  const cleanSub = formatChemText(subtitle || "2D Molecular Structures · Reaction Pathway");
  const cleanEq = formatChemText(equation || "");
  const cleanTrap = formatChemText(examTrap || "Verify stoichiometry, stereochemistry, catalyst conditions, and electron-pair flow.");

  let eqBanner = "";
  if (cleanEq) {
    const eqFontSize = cleanEq.length > 86 ? 12.2 : cleanEq.length > 70 ? 13 : 14;
    const eqDisplay = cleanEq.length > 106 ? cleanEq.slice(0, 103) + "…" : cleanEq;
    eqBanner = `
      <rect x="28" y="84" width="1024" height="36" rx="8" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1.2"/>
      <rect x="34" y="90" width="84" height="24" rx="5" fill="#0369a1"/>
      <text x="76" y="106" text-anchor="middle" font-size="10.5" font-weight="800" fill="#ffffff" letter-spacing="0.4">EQUATION</text>
      <text x="580" y="107" text-anchor="middle" font-size="${eqFontSize}" font-weight="800" fill="#0c4a6e">${escXml(eqDisplay)}</text>
    `;
  }

  const trapLines = wrapLines(cleanTrap, 124, 2);
  const trapSvg = trapLines.length > 1
    ? `<text x="44" y="576" font-size="12" font-weight="600" fill="#1e293b">${escXml(trapLines[0])}</text>
       <text x="44" y="594" font-size="12" font-weight="600" fill="#1e293b">${escXml(trapLines[1])}</text>`
    : `<text x="44" y="585" font-size="12.5" font-weight="600" fill="#1e293b">${escXml(trapLines[0] || "")}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" font-family="Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif">
  ${SVG_DEFS}
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#bg-grad)"/>
  <rect x="14" y="12" width="${WIDTH - 28}" height="${HEIGHT - 24}" rx="15" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <rect x="14" y="12" width="${WIDTH - 28}" height="64" rx="15" fill="url(#hdr-grad)"/>
  <rect x="14" y="54" width="${WIDTH - 28}" height="22" fill="url(#hdr-grad)"/>
  <text x="34" y="40" font-size="19.5" font-weight="800" fill="#ffffff">${escXml(cleanTitle.slice(0, 82))}</text>
  <text x="34" y="61" font-size="12.2" font-weight="500" fill="#93c5fd">${escXml(cleanSub.slice(0, 118))}</text>
  ${eqBanner}
  ${body}
  <rect x="28" y="554" width="${WIDTH - 56}" height="50" rx="10" fill="#fffbeb" stroke="#fcd34d" stroke-width="1.2"/>
  ${trapSvg}
</svg>`;
}

/* ==================== 2D ORGANIC & INORGANIC VECTOR PRIMITIVES ==================== */

function hexVertices(cx, cy, r) {
  // Vertices: 0: top (-90°), 1: topRight (-30°), 2: bottomRight (30°), 3: bottom (90°), 4: bottomLeft (150°), 5: topLeft (210°)
  const angles = [-90, -30, 30, 90, 150, 210];
  return angles.map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  });
}

function shrinkSegment(p1, p2, inset) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy) || 1;
  return [
    [p1[0] + (dx * inset) / len, p1[1] + (dy * inset) / len],
    [p2[0] - (dx * inset) / len, p2[1] - (dy * inset) / len]
  ];
}

function drawDoubleBondLine(p1, p2, towardPt, offset = 5, stroke = "#0f172a", width = 2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  const mx = (p1[0] + p2[0]) / 2;
  const my = (p1[1] + p2[1]) / 2;
  if (nx * (towardPt[0] - mx) + ny * (towardPt[1] - my) < 0) {
    nx = -nx;
    ny = -ny;
  }
  const [a, b] = shrinkSegment(
    [p1[0] + nx * offset, p1[1] + ny * offset],
    [p2[0] + nx * offset, p2[1] + ny * offset],
    4.5
  );
  return `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
}

function drawLonePairPair(cx, cy, angleDeg, dist = 12, color = "#dc2626") {
  const rad = (angleDeg * Math.PI) / 180;
  const px = -Math.sin(rad) * 3.4;
  const py = Math.cos(rad) * 3.4;
  const bx = cx + dist * Math.cos(rad);
  const by = cy + dist * Math.sin(rad);
  return `<circle cx="${(bx + px).toFixed(1)}" cy="${(by + py).toFixed(1)}" r="2" fill="${color}"/>` +
         `<circle cx="${(bx - px).toFixed(1)}" cy="${(by - py).toFixed(1)}" r="2" fill="${color}"/>`;
}

/**
 * Draws a precision 2D Benzene / Chlorobenzene / Substituted Phenyl / Arenium Ion / Cyclohexane ring.
 */
function drawBenzene(cx, cy, opts = {}) {
  const r = opts.r || 32;
  const verts = hexVertices(cx, cy, r);
  const pts = verts.map((v) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`).join(" ");
  const mode = opts.aromatic || "kekule"; // "kekule" | "circle" | "arenium" | "cyclohexane"
  const stroke = opts.stroke || "#0f172a";

  let inner = "";
  if (mode === "kekule") {
    const pairs = opts.altPhase ? [[1, 2], [3, 4], [5, 0]] : [[0, 1], [2, 3], [4, 5]];
    inner = pairs.map(([i, j]) => drawDoubleBondLine(verts[i], verts[j], [cx, cy], Math.max(4.5, r * 0.16), stroke, 2.1)).join("");
  } else if (mode === "circle") {
    inner = `<circle cx="${cx}" cy="${cy}" r="${(r * 0.54).toFixed(1)}" fill="none" stroke="${stroke}" stroke-width="1.9" stroke-dasharray="3.5,2.5"/>`;
  } else if (mode === "arenium") {
    inner = `<path d="M ${(cx - r * 0.42).toFixed(1)} ${(cy - r * 0.24).toFixed(1)} A ${(r * 0.52).toFixed(1)} ${(r * 0.52).toFixed(1)} 0 1 0 ${(cx + r * 0.42).toFixed(1)} ${(cy - r * 0.24).toFixed(1)}" fill="none" stroke="#c2410c" stroke-width="2.1" stroke-dasharray="4,2.5"/>
             <circle cx="${cx}" cy="${cy + 3}" r="9.5" fill="#fff7ed" stroke="#ea580c" stroke-width="1.5"/>
             <text x="${cx}" y="${cy + 7.5}" text-anchor="middle" font-size="13" font-weight="800" fill="#c2410c">+</text>`;
  }

  const slotIdx = {
    top: 0, C1: 0, paraTop: 0,
    topRight: 1, ortho: 1, orthoR: 1, C2: 1,
    bottomRight: 2, metaR: 2, C3: 2,
    bottom: 3, para: 3, C4: 3,
    bottomLeft: 4, metaL: 4, C5: 4,
    topLeft: 5, orthoL: 5, C6: 5
  };

  let subsSvg = "";
  const subs = opts.subs || {};
  const stemLen = opts.stemLen || Math.max(16, Math.round(r * 0.54));
  const lonePairSlots = Array.isArray(opts.lonePairs) ? opts.lonePairs : [];

  for (const [slot, val] of Object.entries(subs)) {
    if (!val) continue;
    if (slot === "gemTop" && Array.isArray(val)) {
      const [vx, vy] = verts[0];
      const [g1, g2] = val;
      subsSvg += `<line x1="${vx.toFixed(1)}" y1="${vy.toFixed(1)}" x2="${(vx - 15).toFixed(1)}" y2="${(vy - 18).toFixed(1)}" stroke="${stroke}" stroke-width="2.1"/>`;
      subsSvg += `<text x="${(vx - 18).toFixed(1)}" y="${(vy - 21).toFixed(1)}" text-anchor="end" font-size="13" font-weight="800" fill="#0f172a">${escXml(formatChemText(g1))}</text>`;
      subsSvg += `<line x1="${vx.toFixed(1)}" y1="${vy.toFixed(1)}" x2="${(vx + 15).toFixed(1)}" y2="${(vy - 18).toFixed(1)}" stroke="#dc2626" stroke-width="2.1"/>`;
      subsSvg += `<text x="${(vx + 18).toFixed(1)}" y="${(vy - 21).toFixed(1)}" text-anchor="start" font-size="13" font-weight="800" fill="#dc2626">${escXml(formatChemText(g2))}</text>`;
      continue;
    }
    const idx = slotIdx[slot];
    if (idx === undefined) continue;
    const [vx, vy] = verts[idx];
    const angDeg = -90 + idx * 60;
    const ang = (angDeg * Math.PI) / 180;
    const tx = vx + stemLen * Math.cos(ang);
    const ty = vy + stemLen * Math.sin(ang);
    const lblX = vx + (stemLen + 6) * Math.cos(ang);
    const lblY = vy + (stemLen + 7) * Math.sin(ang);
    const cosA = Math.cos(ang);
    const sinA = Math.sin(ang);
    const anchor = Math.abs(cosA) < 0.25 ? "middle" : cosA > 0 ? "start" : "end";
    const dy = Math.abs(sinA) < 0.25 ? 4.5 : sinA > 0 ? 12 : -2;
    const labelStr = typeof val === "string" ? val : (val.label || "");
    const trimmedLabel = String(labelStr || "").trim();
    const isRadicalDot = /^(?:[•·*]|radical)$/i.test(trimmedLabel);
    const labelColor = (typeof val === "object" && val.color) ||
      (/^(Cl|Br|F|I)$/i.test(trimmedLabel) ? "#047857" :
        /(NO2|CHO|COOH|N2|OH|OCH3|NH2|N≡N|N#N)/i.test(trimmedLabel) ? "#0f172a" : "#1e293b");
    const isDouble = typeof val === "object" && val.bond === "double";

    if (isDouble) {
      const px = -Math.sin(ang) * 2.5;
      const py = Math.cos(ang) * 2.5;
      subsSvg += `<line x1="${(vx + px).toFixed(1)}" y1="${(vy + py).toFixed(1)}" x2="${(tx + px).toFixed(1)}" y2="${(ty + py).toFixed(1)}" stroke="${stroke}" stroke-width="1.9"/>`;
      subsSvg += `<line x1="${(vx - px).toFixed(1)}" y1="${(vy - py).toFixed(1)}" x2="${(tx - px).toFixed(1)}" y2="${(ty - py).toFixed(1)}" stroke="${stroke}" stroke-width="1.9"/>`;
    } else {
      subsSvg += `<line x1="${vx.toFixed(1)}" y1="${vy.toFixed(1)}" x2="${tx.toFixed(1)}" y2="${ty.toFixed(1)}" stroke="${stroke}" stroke-width="2.1" stroke-linecap="round"/>`;
    }
    if (isRadicalDot) {
      const dotX = tx + 6 * cosA;
      const dotY = ty + 6 * sinA;
      subsSvg += `<circle cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="7" fill="#fef2f2" stroke="#fca5a5" stroke-width="1"/>`;
      subsSvg += `<circle cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="3.6" fill="#dc2626"/>`;
      subsSvg += `<text x="${(dotX + 11).toFixed(1)}" y="${(dotY + 4).toFixed(1)}" text-anchor="start" font-size="11.5" font-weight="800" fill="#dc2626">Ar•</text>`;
    } else {
      subsSvg += `<text x="${lblX.toFixed(1)}" y="${(lblY + dy).toFixed(1)}" text-anchor="${anchor}" font-size="13.5" font-weight="800" fill="${labelColor}">${escXml(formatChemText(labelStr))}</text>`;
    }

    if (lonePairSlots.includes(slot) || (opts.showLonePairs && /^(Cl|Br|F|I|OH|O⁻|NH2|NH₂)$/i.test(trimmedLabel))) {
      // Place clean lone pairs symmetrically outside the atom symbol
      const symCx = lblX + (anchor === "start" ? 8 : anchor === "end" ? -8 : 0);
      const symCy = lblY + dy - 4.5;
      if (idx === 0) {
        subsSvg += drawLonePairPair(symCx, symCy, -90, 12, "#047857");
        subsSvg += drawLonePairPair(symCx, symCy, 0, 15, "#047857");
        subsSvg += drawLonePairPair(symCx, symCy, 180, 15, "#047857");
      } else {
        subsSvg += drawLonePairPair(symCx, symCy, angDeg, 13, "#047857");
      }
    }
  }

  // Optional ring vertex partial charges (skip redundant formal charge badge if top substituent already bears a formal charge)
  let chargesSvg = "";
  const topLabelStr = formatChemText(typeof subs.top === "string" ? subs.top : ((subs.top && subs.top.label) || ""));
  const topHasFormalCharge = /[⁺⁻+-]$/.test(topLabelStr.trim());
  if (opts.charges && typeof opts.charges === "object") {
    for (const [slot, cText] of Object.entries(opts.charges)) {
      const idx = slotIdx[slot];
      if (idx === undefined || !cText) continue;
      const fmtCharge = formatChemText(cText);
      if (idx === 1 && topHasFormalCharge && /^[123]?[⁺+]$/.test(fmtCharge.trim())) continue;
      const [vx, vy] = verts[idx];
      const ang = ((-90 + idx * 60) * Math.PI) / 180;
      const qx = vx + 15 * Math.cos(ang);
      const qy = vy + 15 * Math.sin(ang);
      chargesSvg += `<circle cx="${qx.toFixed(1)}" cy="${qy.toFixed(1)}" r="9" fill="#eff6ff" stroke="#3b82f6" stroke-width="1"/>`;
      chargesSvg += `<text x="${qx.toFixed(1)}" y="${(qy + 3.5).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="800" fill="#1d4ed8">${escXml(fmtCharge)}</text>`;
    }
  }

  let ringLabel = "";
  if (opts.ringName) {
    const extraBot = subs.bottom || subs.para || subs.C4 ? 44 : 26;
    ringLabel = `<text x="${cx}" y="${cy + r + extraBot}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">${escXml(formatChemText(opts.ringName))}</text>`;
  }

  return `<g class="chem-benzene">
    <polygon points="${pts}" fill="${opts.fill || "#ffffff"}" stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round"/>
    ${inner}
    ${subsSvg}
    ${chargesSvg}
    ${ringLabel}
  </g>`;
}

/**
 * Draws a 5-membered ring (e.g. molozonide / cyclopentane / phthalimide core).
 */
function drawPentagon(cx, cy, opts = {}) {
  const r = opts.r || 28;
  const stroke = opts.stroke || "#0f172a";
  const verts = [-90, -18, 54, 126, 198].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  });
  const pts = verts.map((v) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`).join(" ");
  let labels = "";
  if (Array.isArray(opts.vertexAtoms)) {
    opts.vertexAtoms.forEach((atom, i) => {
      if (!atom) return;
      const [vx, vy] = verts[i];
      labels += `<circle cx="${vx.toFixed(1)}" cy="${vy.toFixed(1)}" r="10" fill="#ffffff"/>`;
      labels += `<text x="${vx.toFixed(1)}" y="${(vy + 4.5).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="800" fill="#dc2626">${escXml(formatChemText(atom))}</text>`;
    });
  }
  return `<g>
    <polygon points="${pts}" fill="#ffffff" stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round"/>
    ${labels}
    ${opts.caption ? `<text x="${cx}" y="${cy + r + 20}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569">${escXml(formatChemText(opts.caption))}</text>` : ""}
  </g>`;
}

/**
 * Draws a 2D Carbonyl R1-C(=O)-R2 (or alkoxide / protonated carbonyl).
 */
function drawCarbonyl(cx, cy, opts = {}) {
  const left = formatChemText(opts.left || "R");
  const right = formatChemText(opts.right || "H");
  const topAtom = formatChemText(opts.top || "O");
  const singleTop = Boolean(opts.singleTop);
  const deltaC = opts.deltaC || "";
  const deltaO = opts.deltaO || "";
  const stroke = opts.stroke || "#0f172a";

  const leftLine = left ? `<line x1="${cx - 11}" y1="${cy}" x2="${cx - 38}" y2="${cy}" stroke="${stroke}" stroke-width="2.1"/>
    <text x="${cx - 42}" y="${cy + 5}" text-anchor="end" font-size="13.5" font-weight="800" fill="#0f172a">${escXml(left)}</text>` : "";
  const rightLine = right ? `<line x1="${cx + 11}" y1="${cy}" x2="${cx + 38}" y2="${cy}" stroke="${stroke}" stroke-width="2.1"/>
    <text x="${cx + 42}" y="${cy + 5}" text-anchor="start" font-size="13.5" font-weight="800" fill="#0f172a">${escXml(right)}</text>` : "";

  const topBond = singleTop
    ? `<line x1="${cx}" y1="${cy - 12}" x2="${cx}" y2="${cy - 38}" stroke="${stroke}" stroke-width="2.1"/>`
    : `<line x1="${cx - 3.2}" y1="${cy - 12}" x2="${cx - 3.2}" y2="${cy - 38}" stroke="${stroke}" stroke-width="2"/>
       <line x1="${cx + 3.2}" y1="${cy - 12}" x2="${cx + 3.2}" y2="${cy - 38}" stroke="${stroke}" stroke-width="2"/>`;

  const topColor = /O⁻|O-/.test(topAtom) ? "#dc2626" : "#0284c7";

  return `<g>
    ${leftLine}
    ${rightLine}
    ${topBond}
    <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="17" font-weight="800" fill="#0f172a">C</text>
    <text x="${cx}" y="${cy - 43}" text-anchor="middle" font-size="14.5" font-weight="800" fill="${topColor}">${escXml(topAtom)}</text>
    ${deltaC ? `<text x="${cx + 13}" y="${cy + 19}" font-size="11.5" font-weight="800" fill="#dc2626">${escXml(deltaC)}</text>` : ""}
    ${deltaO ? `<text x="${cx + 18}" y="${cy - 44}" font-size="11.5" font-weight="800" fill="#0284c7">${escXml(deltaO)}</text>` : ""}
    ${opts.caption ? `<text x="${cx}" y="${cy + 34}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569">${escXml(formatChemText(opts.caption))}</text>` : ""}
  </g>`;
}

/**
 * Draws a 2D Alkene R1R2C=CR3R4 at proper 120° trigonal geometry.
 */
function drawAlkene(cx, cy, opts = {}) {
  const tl = formatChemText(opts.tl || "R");
  const bl = formatChemText(opts.bl || "H");
  const tr = formatChemText(opts.tr || "H");
  const br = formatChemText(opts.br || "H");
  const lc = cx - 20;
  const rc = cx + 20;
  const stroke = "#0f172a";
  return `<g>
    <line x1="${lc + 8}" y1="${cy - 3}" x2="${rc - 8}" y2="${cy - 3}" stroke="${stroke}" stroke-width="2.1"/>
    <line x1="${lc + 8}" y1="${cy + 3}" x2="${rc - 8}" y2="${cy + 3}" stroke="${stroke}" stroke-width="2.1"/>
    <text x="${lc}" y="${cy + 5.5}" text-anchor="middle" font-size="16" font-weight="800" fill="#0f172a">C</text>
    <text x="${rc}" y="${cy + 5.5}" text-anchor="middle" font-size="16" font-weight="800" fill="#0f172a">C</text>

    <line x1="${lc - 7}" y1="${cy - 9}" x2="${lc - 24}" y2="${cy - 26}" stroke="${stroke}" stroke-width="2"/>
    <text x="${lc - 27}" y="${cy - 29}" text-anchor="end" font-size="13" font-weight="800" fill="#0f172a">${escXml(tl)}</text>

    <line x1="${lc - 7}" y1="${cy + 10}" x2="${lc - 24}" y2="${cy + 27}" stroke="${stroke}" stroke-width="2"/>
    <text x="${lc - 27}" y="${cy + 37}" text-anchor="end" font-size="13" font-weight="800" fill="#0f172a">${escXml(bl)}</text>

    <line x1="${rc + 7}" y1="${cy - 9}" x2="${rc + 24}" y2="${cy - 26}" stroke="${stroke}" stroke-width="2"/>
    <text x="${rc + 27}" y="${cy - 29}" text-anchor="start" font-size="13" font-weight="800" fill="#0f172a">${escXml(tr)}</text>

    <line x1="${rc + 7}" y1="${cy + 10}" x2="${rc + 24}" y2="${cy + 27}" stroke="${stroke}" stroke-width="2"/>
    <text x="${rc + 27}" y="${cy + 37}" text-anchor="start" font-size="13" font-weight="800" fill="#0f172a">${escXml(br)}</text>
    ${opts.caption ? `<text x="${cx}" y="${cy + 54}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569">${escXml(formatChemText(opts.caption))}</text>` : ""}
  </g>`;
}

/**
 * Draws a 3D-projected Tetrahedral Carbon (top bond + solid wedge + hashed dash + right/left group).
 */
function drawTetrahedral(cx, cy, opts = {}) {
  const top = formatChemText(opts.top || "H");
  const wedge = formatChemText(opts.wedge || "R₁");
  const dash = formatChemText(opts.dash || "R₂");
  const right = opts.right ? formatChemText(opts.right) : "";
  const left = opts.left ? formatChemText(opts.left) : "";
  const dir = opts.invertUmbrella ? 1 : -1;

  return `<g>
    <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="18.5" font-weight="800" fill="#0f172a">C</text>
    <line x1="${cx}" y1="${cy - 12}" x2="${cx}" y2="${cy - 42}" stroke="#0f172a" stroke-width="2.2"/>
    <text x="${cx}" y="${cy - 47}" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">${escXml(top)}</text>
    <polygon points="${cx + dir * 4},${cy + 10} ${cx + dir * 30},${cy + 40} ${cx + dir * 22},${cy + 45}" fill="#0f172a"/>
    <text x="${cx + dir * 33}" y="${cy + 54}" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">${escXml(wedge)}</text>
    <line x1="${cx - dir * 5}" y1="${cy + 11}" x2="${cx - dir * 19}" y2="${cy + 40}" stroke="#0f172a" stroke-width="2.2" stroke-dasharray="4,3"/>
    <text x="${cx - dir * 23}" y="${cy + 54}" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">${escXml(dash)}</text>
    ${right ? `<line x1="${cx + 12}" y1="${cy}" x2="${cx + 42}" y2="${cy}" stroke="#0f172a" stroke-width="2.2"/>
      <text x="${cx + 47}" y="${cy + 5}" text-anchor="start" font-size="14.5" font-weight="800" fill="${opts.rightColor || "#0284c7"}">${escXml(right)}</text>` : ""}
    ${left ? `<line x1="${cx - 12}" y1="${cy}" x2="${cx - 42}" y2="${cy}" stroke="#0f172a" stroke-width="2.2"/>
      <text x="${cx - 47}" y="${cy + 5}" text-anchor="end" font-size="14.5" font-weight="800" fill="${opts.leftColor || "#dc2626"}">${escXml(left)}</text>` : ""}
    ${opts.delta ? `<text x="${cx + dir * 12}" y="${cy - 10}" font-size="11.5" font-weight="800" fill="#dc2626">${escXml(opts.delta)}</text>` : ""}
  </g>`;
}

/**
 * Draws a planar sp2 Carbocation with vertical unhybridised 2p orbital lobe.
 */
function drawPlanarCation(cx, cy, opts = {}) {
  const top = formatChemText(opts.top || "R₁");
  const bl = formatChemText(opts.bl || "R₂");
  const br = formatChemText(opts.br || "R₃");
  return `<g>
    <ellipse cx="${cx}" cy="${cy}" rx="15" ry="38" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="18.5" font-weight="800" fill="#0f172a">C</text>
    <circle cx="${cx + 16}" cy="${cy - 14}" r="8.5" fill="#fef2f2" stroke="#dc2626" stroke-width="1.3"/>
    <text x="${cx + 16}" y="${cy - 10}" text-anchor="middle" font-size="12.5" font-weight="800" fill="#dc2626">+</text>
    <line x1="${cx}" y1="${cy - 12}" x2="${cx}" y2="${cy - 44}" stroke="#0f172a" stroke-width="2.1"/>
    <text x="${cx}" y="${cy - 49}" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">${escXml(top)}</text>
    <line x1="${cx - 10}" y1="${cy + 8}" x2="${cx - 35}" y2="${cy + 28}" stroke="#0f172a" stroke-width="2.1"/>
    <text x="${cx - 38}" y="${cy + 38}" text-anchor="end" font-size="13" font-weight="800" fill="#0f172a">${escXml(bl)}</text>
    <line x1="${cx + 10}" y1="${cy + 8}" x2="${cx + 35}" y2="${cy + 28}" stroke="#0f172a" stroke-width="2.1"/>
    <text x="${cx + 38}" y="${cy + 38}" text-anchor="start" font-size="13" font-weight="800" fill="#0f172a">${escXml(br)}</text>
    <text x="${cx}" y="${cy + 56}" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c">sp² planar (empty 2p)</text>
  </g>`;
}

/**
 * Draws a Pentacoordinate Transition State [Nu---C---X]‡.
 */
function drawTransitionState(cx, cy, opts = {}) {
  const nu = formatChemText(opts.nu || "Nu");
  const lg = formatChemText(opts.lg || "X");
  const top = formatChemText(opts.top || "H");
  const r1 = formatChemText(opts.r1 || "R₁");
  const r2 = formatChemText(opts.r2 || "R₂");
  return `<g>
    <path d="M ${cx - 76} ${cy - 60} L ${cx - 88} ${cy - 60} L ${cx - 88} ${cy + 60} L ${cx - 76} ${cy + 60}" fill="none" stroke="#c2410c" stroke-width="2.3"/>
    <path d="M ${cx + 76} ${cy - 60} L ${cx + 88} ${cy - 60} L ${cx + 88} ${cy + 60} L ${cx + 76} ${cy + 60}" fill="none" stroke="#c2410c" stroke-width="2.3"/>
    <text x="${cx + 95}" y="${cy - 50}" font-size="17" font-weight="800" fill="#c2410c">‡</text>

    <text x="${cx - 60}" y="${cy + 5}" text-anchor="middle" font-size="14.5" font-weight="800" fill="#dc2626">${escXml(nu)}</text>
    <text x="${cx - 60}" y="${cy - 13}" text-anchor="middle" font-size="11" font-weight="800" fill="#dc2626">δ−</text>
    <line x1="${cx - 44}" y1="${cy}" x2="${cx - 12}" y2="${cy}" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4,3"/>

    <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="18.5" font-weight="800" fill="#0f172a">C</text>
    <line x1="${cx}" y1="${cy - 12}" x2="${cx}" y2="${cy - 40}" stroke="#0f172a" stroke-width="2.1"/>
    <text x="${cx}" y="${cy - 45}" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">${escXml(top)}</text>
    <polygon points="${cx - 4},${cy + 10} ${cx - 22},${cy + 39} ${cx - 14},${cy + 43}" fill="#0f172a"/>
    <text x="${cx - 22}" y="${cy + 54}" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0f172a">${escXml(r1)}</text>
    <line x1="${cx + 5}" y1="${cy + 10}" x2="${cx + 20}" y2="${cy + 39}" stroke="#0f172a" stroke-width="2.1" stroke-dasharray="3.5,2.5"/>
    <text x="${cx + 24}" y="${cy + 54}" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0f172a">${escXml(r2)}</text>

    <line x1="${cx + 12}" y1="${cy}" x2="${cx + 44}" y2="${cy}" stroke="#0284c7" stroke-width="2.2" stroke-dasharray="4,3"/>
    <text x="${cx + 60}" y="${cy + 5}" text-anchor="middle" font-size="14.5" font-weight="800" fill="#0284c7">${escXml(lg)}</text>
    <text x="${cx + 60}" y="${cy - 13}" text-anchor="middle" font-size="11" font-weight="800" fill="#0284c7">δ−</text>
  </g>`;
}

/**
 * Draws a Chair Cyclohexane conformation with optional axial/equatorial groups.
 */
function drawChair(cx, cy, opts = {}) {
  const x0 = cx - 44;
  const pts = [
    [x0, cy + 6],
    [x0 + 28, cy - 16],
    [x0 + 62, cy - 8],
    [x0 + 88, cy - 26],
    [x0 + 60, cy + 16],
    [x0 + 26, cy + 8]
  ];
  const poly = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  let extras = "";
  if (opts.axialTopRight) {
    const [x, y] = pts[3];
    extras += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 24}" stroke="#0284c7" stroke-width="2.1"/>
      <text x="${x}" y="${y - 29}" text-anchor="middle" font-size="13" font-weight="800" fill="#0284c7">${escXml(formatChemText(opts.axialTopRight))}</text>`;
  }
  if (opts.eqTopRight) {
    const [x, y] = pts[3];
    extras += `<line x1="${x}" y1="${y}" x2="${x + 22}" y2="${y + 8}" stroke="#dc2626" stroke-width="2.1"/>
      <text x="${x + 26}" y="${y + 13}" text-anchor="start" font-size="13" font-weight="800" fill="#dc2626">${escXml(formatChemText(opts.eqTopRight))}</text>`;
  }
  return `<g>
    <polygon points="${poly}" fill="#ffffff" stroke="#0f172a" stroke-width="2.3" stroke-linejoin="round"/>
    ${extras}
    ${opts.caption ? `<text x="${cx}" y="${cy + 38}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569">${escXml(formatChemText(opts.caption))}</text>` : ""}
  </g>`;
}

/**
 * Draws an Inorganic Coordination Complex [M(L)n]^q with dative coordinate arrows and brackets.
 */
function drawCoordinationComplex(cx, cy, opts = {}) {
  const metal = formatChemText(opts.metal || opts.center || "Fe²⁺");
  const charge = formatChemText(opts.charge || "");
  const geom = String(opts.geometry || "octahedral").toLowerCase();
  const ligs = Array.isArray(opts.ligands) && opts.ligands.length
    ? opts.ligands.map(formatChemText)
    : ["CN⁻", "CN⁻", "CN⁻", "CN⁻", "CN⁻", "CN⁻"];

  let bondsSvg = "";
  const isOct = geom.includes("octa") || ligs.length >= 6;
  const isTet = geom.includes("tetra") && !isOct;
  const rxSpan = isOct ? 86 : 74;
  const rySpan = isOct ? 70 : 62;

  if (isOct) {
    // 6-coordinate octahedral: top, bottom, and 4 planar diagonal vertices
    const dirs = [
      [0, -54, 0, -1],
      [0, 54, 0, 1],
      [-52, -24, -1, -0.4],
      [52, -24, 1, -0.4],
      [-52, 24, -1, 0.4],
      [52, 24, 1, 0.4]
    ];
    dirs.forEach(([dx, dy, ux, uy], idx) => {
      const lbl = ligs[idx % ligs.length] || "L";
      const lx = cx + dx;
      const ly = cy + dy;
      const sx = cx + ux * 16;
      const sy = cy + uy * 16;
      bondsSvg += `<line x1="${(lx - ux * 10).toFixed(1)}" y1="${(ly - (Math.abs(dy) > 35 ? Math.sign(dy) * 11 : uy * 10)).toFixed(1)}" x2="${sx.toFixed(1)}" y2="${sy.toFixed(1)}" stroke="#0284c7" stroke-width="1.9" marker-end="url(#arrow-coord)"/>`;
      const anchor = dx < -15 ? "end" : dx > 15 ? "start" : "middle";
      const ty = dy < -30 ? ly - 5 : dy > 30 ? ly + 13 : ly + 4.5;
      bondsSvg += `<text x="${lx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" font-size="12" font-weight="800" fill="#1d4ed8">${escXml(lbl)}</text>`;
    });
  } else if (isTet) {
    const dirs = [
      [0, -50, 0, -1],
      [-48, 28, -1, 0.5],
      [48, 28, 1, 0.5],
      [34, -22, 0.8, -0.4]
    ];
    dirs.forEach(([dx, dy, ux, uy], idx) => {
      const lbl = ligs[idx % ligs.length] || "L";
      const lx = cx + dx;
      const ly = cy + dy;
      bondsSvg += `<line x1="${(lx * 0.78 + cx * 0.22).toFixed(1)}" y1="${(ly * 0.78 + cy * 0.22).toFixed(1)}" x2="${(cx + ux * 15).toFixed(1)}" y2="${(cy + uy * 15).toFixed(1)}" stroke="#0284c7" stroke-width="2" marker-end="url(#arrow-coord)"/>`;
      const anchor = dx < -15 ? "end" : dx > 15 ? "start" : "middle";
      const ty = dy < -20 ? ly - 4 : ly + 10;
      bondsSvg += `<text x="${lx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" font-size="12.5" font-weight="800" fill="#1d4ed8">${escXml(lbl)}</text>`;
    });
  } else {
    // Square planar / trigonal planar
    const dirs = [
      [-52, -32, -1, -0.6],
      [52, -32, 1, -0.6],
      [52, 32, 1, 0.6],
      [-52, 32, -1, 0.6]
    ];
    dirs.forEach(([dx, dy, ux, uy], idx) => {
      const lbl = ligs[idx % ligs.length] || "L";
      const lx = cx + dx;
      const ly = cy + dy;
      bondsSvg += `<line x1="${(cx + dx * 0.76).toFixed(1)}" y1="${(cy + dy * 0.76).toFixed(1)}" x2="${(cx + ux * 15).toFixed(1)}" y2="${(cy + uy * 15).toFixed(1)}" stroke="#0284c7" stroke-width="2" marker-end="url(#arrow-coord)"/>`;
      const anchor = dx < 0 ? "end" : "start";
      bondsSvg += `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="${anchor}" font-size="12.5" font-weight="800" fill="#1d4ed8">${escXml(lbl)}</text>`;
    });
  }

  return `<g>
    <path d="M ${cx - rxSpan + 12} ${cy - rySpan} L ${cx - rxSpan} ${cy - rySpan} L ${cx - rxSpan} ${cy + rySpan} L ${cx - rxSpan + 12} ${cy + rySpan}" fill="none" stroke="#0f172a" stroke-width="2.3"/>
    <path d="M ${cx + rxSpan - 12} ${cy - rySpan} L ${cx + rxSpan} ${cy - rySpan} L ${cx + rxSpan} ${cy + rySpan} L ${cx + rxSpan - 12} ${cy + rySpan}" fill="none" stroke="#0f172a" stroke-width="2.3"/>
    ${charge ? `<text x="${cx + rxSpan + 6}" y="${cy - rySpan + 6}" font-size="14" font-weight="800" fill="#dc2626">${escXml(charge)}</text>` : ""}
    ${bondsSvg}
    <circle cx="${cx}" cy="${cy}" r="18" fill="#fef3c7" stroke="#d97706" stroke-width="1.8"/>
    <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="13.5" font-weight="800" fill="#92400e">${escXml(metal)}</text>
    ${opts.caption ? `<text x="${cx}" y="${cy + rySpan + 18}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569">${escXml(formatChemText(opts.caption))}</text>` : ""}
  </g>`;
}

/**
 * Draws an Inorganic VSEPR Shape (Linear, Trigonal Planar, Bent, Trigonal Pyramidal, TBP, Octahedral).
 */
function drawVSEPR(cx, cy, opts = {}) {
  const center = formatChemText(opts.center || opts.metal || "S");
  const geom = String(opts.geometry || "octahedral").toLowerCase();
  const ligs = Array.isArray(opts.ligands) && opts.ligands.length
    ? opts.ligands.map(formatChemText)
    : ["F", "F", "F", "F", "F", "F"];
  const lpCount = Number(opts.lonePairCount || 0);
  const angleLabel = formatChemText(opts.angleLabel || "");
  let svg = "";

  const drawBond = (dx, dy, label, isWedge = false, isDash = false, color = "#0f172a") => {
    const lx = cx + dx;
    const ly = cy + dy;
    const len = Math.hypot(dx, dy) || 1;
    const sx = cx + (dx / len) * 14;
    const sy = cy + (dy / len) * 14;
    const ex = lx - (dx / len) * 12;
    const ey = ly - (dy / len) * 12;
    if (isWedge) {
      const px = (-dy / len) * 4.5;
      const py = (dx / len) * 4.5;
      svg += `<polygon points="${sx.toFixed(1)},${sy.toFixed(1)} ${(ex + px).toFixed(1)},${(ey + py).toFixed(1)} ${(ex - px).toFixed(1)},${(ey - py).toFixed(1)}" fill="#0f172a"/>`;
    } else if (isDash) {
      svg += `<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#0f172a" stroke-width="2.2" stroke-dasharray="4,3"/>`;
    } else {
      svg += `<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#0f172a" stroke-width="2.1"/>`;
    }
    const anchor = dx < -14 ? "end" : dx > 14 ? "start" : "middle";
    const ty = dy < -18 ? ly - 2 : dy > 18 ? ly + 9 : ly + 4.5;
    svg += `<text x="${lx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" font-size="13.5" font-weight="800" fill="${color}">${escXml(label)}</text>`;
  };

  if (geom.includes("octa") || geom.includes("square_pyramidal") || geom.includes("square_planar")) {
    drawBond(0, -56, ligs[0] || "F");
    drawBond(0, 56, ligs[1] || "F");
    drawBond(-50, -24, ligs[2] || "F", false, true);
    drawBond(50, -24, ligs[3] || "F", false, true);
    drawBond(-50, 24, ligs[4] || "F", true, false);
    drawBond(50, 24, ligs[5] || "F", true, false);
  } else if (geom.includes("bipyramidal") || geom.includes("tbp") || geom.includes("seesaw") || geom.includes("t_shaped")) {
    drawBond(0, -56, ligs[0] || "Cl");
    drawBond(0, 56, ligs[1] || "Cl");
    drawBond(54, 0, ligs[2] || "Cl");
    drawBond(-46, -24, ligs[3] || "Cl", false, true);
    drawBond(-46, 24, ligs[4] || "Cl", true, false);
  } else if (geom.includes("linear")) {
    drawBond(-58, 0, ligs[0] || "X");
    drawBond(58, 0, ligs[1] || "X");
  } else if (geom.includes("trigonal_planar")) {
    drawBond(0, -50, ligs[0] || "F");
    drawBond(-44, 30, ligs[1] || "F");
    drawBond(44, 30, ligs[2] || "F");
  } else if (geom.includes("bent") || geom.includes("pyramidal")) {
    if (lpCount > 0) {
      svg += `<ellipse cx="${cx}" cy="${cy - 30}" rx="12" ry="18" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.4"/>`;
      svg += `<circle cx="${cx - 3.5}" cy="${cy - 34}" r="2.2" fill="#dc2626"/><circle cx="${cx + 3.5}" cy="${cy - 34}" r="2.2" fill="#dc2626"/>`;
    }
    drawBond(-42, 32, ligs[0] || "H", true, false);
    drawBond(42, 32, ligs[1] || "H", true, false);
    if (ligs[2]) drawBond(0, 44, ligs[2], false, true);
  } else {
    drawBond(0, -50, ligs[0] || "H");
    drawBond(-44, 34, ligs[1] || "H", true, false);
    drawBond(44, 34, ligs[2] || "H", false, true);
    drawBond(48, -10, ligs[3] || "H");
  }

  return `<g>
    ${svg}
    <circle cx="${cx}" cy="${cy}" r="14" fill="#eff6ff" stroke="#2563eb" stroke-width="1.6"/>
    <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="#1e3a8a">${escXml(center)}</text>
    ${angleLabel ? `<text x="${cx + 36}" y="${cy - 34}" font-size="11.5" font-weight="800" fill="#dc2626">${escXml(angleLabel)}</text>` : ""}
    ${opts.caption ? `<text x="${cx}" y="${cy + 74}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569">${escXml(formatChemText(opts.caption))}</text>` : ""}
  </g>`;
}

/**
 * Draws a standalone formula pill / ion badge with automatic line-wrapping and lone pair dots.
 */
function drawFormula(cx, cy, opts = {}, maxBoxW = 240) {
  const txt = formatChemText(opts.text || opts.label || "");
  if (!txt) return "";
  const color = opts.color || "#0f172a";
  const fontSize = opts.size || 14.5;
  const maxCharsPerLine = Math.max(12, Math.floor((maxBoxW - 18) / (fontSize * 0.56)));
  const lines = opts.boxed && txt.length > maxCharsPerLine ? wrapLines(txt, maxCharsPerLine, 2) : [txt];
  const longestLen = Math.max(...lines.map((l) => l.length));
  const approxW = clamp(longestLen * (fontSize * 0.58) + 22, 46, maxBoxW);
  const boxH = lines.length > 1 ? 46 : 30;
  const boxTop = cy - boxH / 2 - 2;

  let box = "";
  if (opts.boxed) {
    box = `<rect x="${(cx - approxW / 2).toFixed(1)}" y="${boxTop.toFixed(1)}" width="${approxW.toFixed(1)}" height="${boxH}" rx="7" fill="${opts.bg || "#f8fafc"}" stroke="${opts.border || "#cbd5e1"}" stroke-width="1.3"/>`;
  }
  let dots = "";
  if (opts.lonePair === "right") {
    dots = `<circle cx="${(cx + approxW / 2 - 4).toFixed(1)}" cy="${cy - 4}" r="2" fill="${color}"/><circle cx="${(cx + approxW / 2 - 4).toFixed(1)}" cy="${cy + 3}" r="2" fill="${color}"/>`;
  } else if (opts.lonePair === "top") {
    dots = `<circle cx="${cx - 4}" cy="${cy - 18}" r="2.1" fill="${color}"/><circle cx="${cx + 4}" cy="${cy - 18}" r="2.1" fill="${color}"/>`;
  }
  const textSvg = lines.length > 1
    ? `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="${Math.max(12, fontSize - 1.5)}" font-weight="800" fill="${color}">${escXml(lines[0])}</text>
       <text x="${cx}" y="${cy + 13}" text-anchor="middle" font-size="${Math.max(12, fontSize - 1.5)}" font-weight="800" fill="${color}">${escXml(lines[1])}</text>`
    : `<text x="${cx}" y="${cy + 4.5}" text-anchor="middle" font-size="${fontSize}" font-weight="800" fill="${color}">${escXml(lines[0])}</text>`;

  return `<g>
    ${box}
    ${textSvg}
    ${dots}
    ${opts.sub ? `<text x="${cx}" y="${(boxTop + boxH + 15).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#475569">${escXml(formatChemText(opts.sub))}</text>` : ""}
  </g>`;
}

function drawCurvedArrow(x1, y1, x2, y2, arc = -28, kind = "nuc") {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const clampedArc = clamp(arc, -48, 48);
  const qx = mx + nx * clampedArc;
  const qy = my + ny * clampedArc;
  const color = kind === "lg" ? "#0284c7" : kind === "neutral" ? "#0f172a" : "#dc2626";
  const marker = kind === "lg" ? "arrow-curved-lg" : kind === "neutral" ? "arrow-curved-neutral" : "arrow-curved-nuc";
  return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${qx.toFixed(1)} ${qy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" marker-end="url(#${marker})"/>`;
}

function drawReactionArrow(x1, x2, y, opts = {}) {
  const above = formatChemText(opts.above || "");
  const below = formatChemText(opts.below || "");
  const type = opts.type || "forward";
  const mx = (x1 + x2) / 2;
  const gap = Math.max(36, x2 - x1);
  let lineSvg = "";
  if (type === "eq") {
    lineSvg = `
      <line x1="${x1}" y1="${y - 3}" x2="${x2}" y2="${y - 3}" stroke="#0f172a" stroke-width="2" marker-end="url(#arrow-eq-r)"/>
      <line x1="${x2}" y1="${y + 4}" x2="${x1}" y2="${y + 4}" stroke="#0f172a" stroke-width="2" marker-end="url(#arrow-eq-l)"/>
    `;
  } else if (type === "res") {
    lineSvg = `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#4f46e5" stroke-width="2.2" marker-start="url(#arrow-res)" marker-end="url(#arrow-res)"/>`;
  } else {
    lineSvg = `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#0f172a" stroke-width="2.4" marker-end="url(#arrow-rxn)"/>`;
  }

  const maxChars = gap < 56 ? 12 : gap < 84 ? 15 : 18;
  const aboveLines = wrapLines(above, maxChars, 2);
  const belowLines = wrapLines(below, maxChars, 2);

  let pillBg = "";
  if (aboveLines.length) {
    const w = Math.min(gap + 22, Math.max(...aboveLines.map((l) => estimateTextW(l, 10.5))) + 10);
    const h = aboveLines.length * 13 + 4;
    pillBg += `<rect x="${(mx - w / 2).toFixed(1)}" y="${(y - 9 - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="4" fill="#ffffff" fill-opacity="0.92"/>`;
  }
  if (belowLines.length) {
    const w = Math.min(gap + 22, Math.max(...belowLines.map((l) => estimateTextW(l, 10))) + 10);
    const h = belowLines.length * 13 + 4;
    pillBg += `<rect x="${(mx - w / 2).toFixed(1)}" y="${(y + 8).toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="4" fill="#ffffff" fill-opacity="0.92"/>`;
  }

  const aboveSvg = aboveLines
    .map((ln, i) => `<text x="${mx}" y="${y - 13 - (aboveLines.length - 1 - i) * 13}" text-anchor="middle" font-size="10.5" font-weight="800" fill="#1d4ed8">${escXml(ln)}</text>`)
    .join("");
  const belowSvg = belowLines
    .map((ln, i) => `<text x="${mx}" y="${y + 20 + i * 13}" text-anchor="middle" font-size="10" font-weight="700" fill="#475569">${escXml(ln)}</text>`)
    .join("");

  return `<g>${lineSvg}${pillBg}${aboveSvg}${belowSvg}</g>`;
}

/**
 * Estimates node spatial footprint (relative to cx, cy) to guarantee zero stage clipping or overlap.
 */
function getNodeExtent(node) {
  const t = String(node.type || "formula").toLowerCase();
  if (t === "benzene" || t === "phenyl" || t === "aromatic" || t === "cyclohexane" || t === "arenium") {
    const r = node.r || 32;
    const subs = node.subs || {};
    const stem = node.stemLen || Math.max(16, Math.round(r * 0.54));
    const hasLeft = Boolean(subs.topLeft || subs.bottomLeft || subs.orthoL || subs.metaL);
    const hasRight = Boolean(subs.topRight || subs.bottomRight || subs.ortho || subs.orthoR || subs.metaR);
    const hasTop = Boolean(subs.top || subs.C1 || subs.paraTop || subs.gemTop);
    const hasBot = Boolean(subs.bottom || subs.para || subs.C4 || node.ringName);
    const leftTextW = Math.max(
      subs.topLeft ? estimateTextW(formatChemText(typeof subs.topLeft === "string" ? subs.topLeft : subs.topLeft.label), 13.5) : 0,
      subs.bottomLeft ? estimateTextW(formatChemText(typeof subs.bottomLeft === "string" ? subs.bottomLeft : subs.bottomLeft.label), 13.5) : 0
    );
    const rightTextW = Math.max(
      subs.topRight ? estimateTextW(formatChemText(typeof subs.topRight === "string" ? subs.topRight : subs.topRight.label), 13.5) : 0,
      subs.bottomRight ? estimateTextW(formatChemText(typeof subs.bottomRight === "string" ? subs.bottomRight : subs.bottomRight.label), 13.5) : 0
    );
    return {
      left: r * 0.87 + (hasLeft ? stem + leftTextW + 10 : 12),
      right: r * 0.87 + (hasRight ? stem + rightTextW + 10 : 12),
      top: r + (hasTop ? stem + 26 : 12),
      bottom: r + (hasBot ? 46 : 12)
    };
  }
  if (t === "transition_state" || t === "pentacoordinate_ts" || t === "ts") {
    return { left: 96, right: 112, top: 68, bottom: 68 };
  }
  if (t === "tetrahedral") {
    return { left: node.left ? 88 : 52, right: node.right ? 88 : 52, top: 64, bottom: 66 };
  }
  if (t === "planar_cation" || t === "carbocation") {
    return { left: 68, right: 68, top: 64, bottom: 66 };
  }
  if (t === "carbonyl") {
    return {
      left: 48 + estimateTextW(formatChemText(node.left || "R"), 13.5),
      right: 48 + estimateTextW(formatChemText(node.right || "H"), 13.5),
      top: 60,
      bottom: node.caption ? 46 : 26
    };
  }
  if (t === "alkene") {
    return {
      left: 52 + Math.max(estimateTextW(formatChemText(node.tl || "R"), 13), estimateTextW(formatChemText(node.bl || "H"), 13)),
      right: 52 + Math.max(estimateTextW(formatChemText(node.tr || "H"), 13), estimateTextW(formatChemText(node.br || "H"), 13)),
      top: 46,
      bottom: node.caption ? 62 : 46
    };
  }
  if (t === "inorganic_complex" || t === "coordination") {
    return { left: 102, right: 116, top: 82, bottom: node.caption ? 94 : 78 };
  }
  if (t === "vsepr") {
    return { left: 82, right: 82, top: 72, bottom: node.caption ? 86 : 70 };
  }
  if (t === "chair") {
    return { left: 54, right: 86, top: 62, bottom: 48 };
  }
  if (t === "pentagon" || t === "molozonide") {
    const r = node.r || 28;
    return { left: r + 18, right: r + 18, top: r + 16, bottom: r + 30 };
  }
  // Formula pill
  const txt = formatChemText(node.text || node.label || "");
  const w = clamp(estimateTextW(txt, node.size || 14.5) + 22, 46, 220);
  return { left: w / 2, right: w / 2, top: 20, bottom: node.sub ? 36 : 22 };
}

function renderMoleculeNode(node, boxX, boxY, boxW, boxH, overridePos = null) {
  const ext = getNodeExtent(node);
  const fullW = ext.left + ext.right;
  const fullH = ext.top + ext.bottom;
  const scale = clamp(Math.min((boxW - 10) / Math.max(1, fullW), (boxH - 10) / Math.max(1, fullH)), 0.56, 1.0);

  const rawCx = overridePos ? overridePos.cx : boxX + ((typeof node.rx === "number" ? node.rx : 0.5) * boxW);
  const rawCy = overridePos ? overridePos.cy : boxY + ((typeof node.ry === "number" ? node.ry : 0.5) * boxH);

  const sL = ext.left * scale;
  const sR = ext.right * scale;
  const sT = ext.top * scale;
  const sB = ext.bottom * scale;

  const minCx = boxX + sL + 4;
  const maxCx = boxX + boxW - sR - 4;
  const cx = minCx <= maxCx ? clamp(rawCx, minCx, maxCx) : boxX + boxW / 2;

  const minCy = boxY + sT + 4;
  const maxCy = boxY + boxH - sB - 4;
  const cy = minCy <= maxCy ? clamp(rawCy, minCy, maxCy) : boxY + boxH / 2;

  const t = String(node.type || "formula").toLowerCase();
  let inner = "";

  switch (t) {
    case "benzene":
    case "phenyl":
    case "aromatic":
      inner = drawBenzene(cx, cy, node);
      break;
    case "cyclohexane":
      inner = drawBenzene(cx, cy, { ...node, aromatic: "cyclohexane" });
      break;
    case "arenium":
      inner = drawBenzene(cx, cy, { ...node, aromatic: "arenium" });
      break;
    case "pentagon":
    case "molozonide":
      inner = drawPentagon(cx, cy, node);
      break;
    case "chair":
      inner = drawChair(cx, cy, node);
      break;
    case "carbonyl":
      inner = drawCarbonyl(cx, cy, node);
      break;
    case "alkene":
      inner = drawAlkene(cx, cy, node);
      break;
    case "tetrahedral":
      inner = drawTetrahedral(cx, cy, node);
      break;
    case "planar_cation":
    case "carbocation":
      inner = drawPlanarCation(cx, cy, node);
      break;
    case "transition_state":
    case "pentacoordinate_ts":
    case "ts":
      inner = drawTransitionState(cx, cy, node);
      break;
    case "inorganic_complex":
    case "coordination":
      inner = drawCoordinationComplex(cx, cy, node);
      break;
    case "vsepr":
      inner = drawVSEPR(cx, cy, node);
      break;
    default:
      inner = drawFormula(cx, cy, node, Math.max(120, boxW - 14));
      break;
  }

  if (scale < 0.98) {
    return `<g transform="translate(${cx.toFixed(1)}, ${cy.toFixed(1)}) scale(${scale.toFixed(3)}) translate(${(-cx).toFixed(1)}, ${(-cy).toFixed(1)})">${inner}</g>`;
  }
  return inner;
}

/* ==================== POLYMORPHIC SCENE COMPILERS ==================== */

/**
 * Catmull-Rom spline converted cleanly to smooth SVG cubic Bézier segments.
 */
function smoothSplinePath(pts) {
  if (!pts.length) return "";
  if (pts.length === 1) return `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  if (pts.length === 2) {
    return `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} L ${pts[1][0].toFixed(1)} ${pts[1][1].toFixed(1)}`;
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/**
 * 2D Cartesian Scientific Graph & Energy Profile Compiler (1080x620).
 */
function compileGraphScene(spec) {
  const s = spec || {};
  const g = s.graph || {};
  const topOffset = s.equation ? 132 : 96;
  const totalH = s.equation ? 406 : 442;

  const panelW = 282;
  const panelX = WIDTH - 28 - panelW;
  const plotX = 112;
  const plotY = topOffset + 18;
  const plotW = panelX - 24 - plotX; // ~636px
  const plotH = totalH - 68;         // ~338px

  const toPxX = (nx) => plotX + (clamp(Number(nx) || 0, 0, 100) / 100) * plotW;
  const toPxY = (ny) => plotY + plotH - (clamp(Number(ny) || 0, 0, 100) / 100) * plotH;

  let gridSvg = "";
  for (let i = 1; i <= 4; i++) {
    const gx = plotX + (plotW * i) / 5;
    const gy = plotY + (plotH * i) / 5;
    gridSvg += `<line x1="${gx.toFixed(1)}" y1="${plotY}" x2="${gx.toFixed(1)}" y2="${plotY + plotH}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,4"/>`;
    gridSvg += `<line x1="${plotX}" y1="${gy.toFixed(1)}" x2="${plotX + plotW}" y2="${gy.toFixed(1)}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,4"/>`;
  }

  // Optional baseline reference line (e.g. Reactant Enthalpy HR or pH 7)
  let baseSvg = "";
  if (typeof g.baselineY === "number") {
    const by = toPxY(g.baselineY);
    baseSvg += `<line x1="${plotX}" y1="${by.toFixed(1)}" x2="${plotX + plotW}" y2="${by.toFixed(1)}" stroke="#94a3b8" stroke-width="1.3" stroke-dasharray="6,4"/>`;
    if (g.baselineLabel) {
      baseSvg += `<text x="${plotX + plotW - 6}" y="${(by - 5).toFixed(1)}" text-anchor="end" font-size="10.5" font-weight="700" fill="#64748b">${escXml(formatChemText(g.baselineLabel))}</text>`;
    }
  }

  // Optional vertical threshold lines (e.g. Ea, Ea', equivalence volume Veq)
  if (Array.isArray(g.vLines)) {
    g.vLines.slice(0, 6).forEach((vl, idx) => {
      const vx = toPxX(vl.x ?? 50);
      const vColor = vl.color || "#dc2626";
      const labelY = plotY + 14 + (idx % 2) * 16;
      baseSvg += `<line x1="${vx.toFixed(1)}" y1="${plotY}" x2="${vx.toFixed(1)}" y2="${plotY + plotH}" stroke="${vColor}" stroke-width="1.6" stroke-dasharray="5,4"/>`;
      if (vl.label) {
        const vText = formatChemText(vl.label);
        const vw = clamp(estimateTextW(vText, 10.5) + 12, 44, 150);
        const rx = clamp(vx - vw / 2, plotX + 4, plotX + plotW - vw - 4);
        baseSvg += `<rect x="${rx.toFixed(1)}" y="${(labelY - 11).toFixed(1)}" width="${vw.toFixed(1)}" height="17" rx="4" fill="#ffffff" fill-opacity="0.94" stroke="${vColor}" stroke-width="1"/>`;
        baseSvg += `<text x="${(rx + vw / 2).toFixed(1)}" y="${(labelY + 1).toFixed(1)}" text-anchor="middle" font-size="10.2" font-weight="800" fill="${vColor}">${escXml(vText)}</text>`;
      }
    });
  }

  // Ticks on X and Y axes
  let ticksSvg = "";
  const xTicks = Array.isArray(g.xTicks) ? g.xTicks.slice(0, 8) : [];
  xTicks.forEach((tk) => {
    const tx = toPxX(tk.pos);
    ticksSvg += `<line x1="${tx.toFixed(1)}" y1="${plotY + plotH}" x2="${tx.toFixed(1)}" y2="${plotY + plotH + 5}" stroke="#475569" stroke-width="1.5"/>`;
    ticksSvg += `<text x="${tx.toFixed(1)}" y="${plotY + plotH + 18}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#475569">${escXml(formatChemText(tk.label))}</text>`;
  });
  const yTicks = Array.isArray(g.yTicks) ? g.yTicks.slice(0, 8) : [];
  yTicks.forEach((tk) => {
    const ty = toPxY(tk.pos);
    ticksSvg += `<line x1="${plotX - 5}" y1="${ty.toFixed(1)}" x2="${plotX}" y2="${ty.toFixed(1)}" stroke="#475569" stroke-width="1.5"/>`;
    ticksSvg += `<text x="${plotX - 9}" y="${(ty + 4).toFixed(1)}" text-anchor="end" font-size="10.5" font-weight="700" fill="#475569">${escXml(formatChemText(tk.label))}</text>`;
  });

  // Shaded area under curve if requested (e.g. Maxwell-Boltzmann E >= Ea)
  const PALETTE = ["#1d4ed8", "#dc2626", "#047857", "#7c3aed", "#c2410c"];
  const curves = (Array.isArray(g.curves) ? g.curves : []).slice(0, 5);
  let curvesSvg = "";
  let legendSvg = "";

  curves.forEach((cv, idx) => {
    const color = cv.color || PALETTE[idx % PALETTE.length];
    const ptsRaw = Array.isArray(cv.points) ? cv.points : [];
    const pts = ptsRaw
      .filter((p) => Array.isArray(p) && typeof p[0] === "number" && typeof p[1] === "number")
      .map((p) => [toPxX(p[0]), toPxY(p[1])]);
    if (pts.length < 2) return;

    const pathD = smoothSplinePath(pts);
    if (cv.fillFromX !== undefined && pts.length >= 2) {
      const fx = toPxX(cv.fillFromX);
      const subPts = pts.filter((p) => p[0] >= fx - 2);
      if (subPts.length >= 2) {
        const subD = smoothSplinePath(subPts);
        const areaD = `${subD} L ${subPts[subPts.length - 1][0].toFixed(1)} ${(plotY + plotH).toFixed(1)} L ${subPts[0][0].toFixed(1)} ${(plotY + plotH).toFixed(1)} Z`;
        curvesSvg += `<path d="${areaD}" fill="${color}" fill-opacity="0.16"/>`;
      }
    }

    curvesSvg += `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="${cv.dashed ? 2.6 : 3.2}" ${cv.dashed ? 'stroke-dasharray="7,5"' : ""} stroke-linecap="round" stroke-linejoin="round"/>`;

    // Legend row inside right panel
    const ly = topOffset + 48 + idx * 24;
    const lblText = formatChemText(cv.label || `Curve ${idx + 1}`).slice(0, 34);
    legendSvg += `
      <line x1="${panelX + 14}" y1="${ly}" x2="${panelX + 42}" y2="${ly}" stroke="${color}" stroke-width="3" ${cv.dashed ? 'stroke-dasharray="6,3"' : ""} stroke-linecap="round"/>
      <text x="${panelX + 50}" y="${ly + 4}" font-size="11.5" font-weight="700" fill="#0f172a">${escXml(lblText)}</text>
    `;
  });

  // Dimension brackets (Ea, Ea', ΔH, etc.)
  let bracketsSvg = "";
  const brackets = (Array.isArray(g.brackets) ? g.brackets : []).slice(0, 5);
  brackets.forEach((br, idx) => {
    const bx = toPxX(br.x ?? (20 + idx * 14));
    const y1 = toPxY(br.y1 ?? 25);
    const y2 = toPxY(br.y2 ?? 80);
    const topY = Math.min(y1, y2);
    const botY = Math.max(y1, y2);
    const midY = (topY + botY) / 2;
    const color = br.color || "#dc2626";
    const markerId = color === "#047857" ? "arrow-dim-green" : color === "#1d4ed8" ? "arrow-dim-blue" : "arrow-dim-red";
    const bLabel = formatChemText(br.label || "");

    if (br.guideFromX !== undefined) {
      const gx = toPxX(br.guideFromX);
      bracketsSvg += `<line x1="${gx.toFixed(1)}" y1="${topY.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${topY.toFixed(1)}" stroke="${color}" stroke-width="1.2" stroke-dasharray="3,3"/>`;
    }
    bracketsSvg += `<line x1="${bx.toFixed(1)}" y1="${(botY - 3).toFixed(1)}" x2="${bx.toFixed(1)}" y2="${(topY + 3).toFixed(1)}" stroke="${color}" stroke-width="2" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>`;
    if (bLabel) {
      const pw = Math.min(138, estimateTextW(bLabel, 11) + 14);
      const placeRight = bx + pw + 10 < plotX + plotW;
      const px = placeRight ? bx + 6 : bx - pw - 6;
      bracketsSvg += `<rect x="${px.toFixed(1)}" y="${(midY - 10).toFixed(1)}" width="${pw.toFixed(1)}" height="20" rx="5" fill="#ffffff" stroke="${color}" stroke-width="1"/>`;
      bracketsSvg += `<text x="${(px + pw / 2).toFixed(1)}" y="${(midY + 3.5).toFixed(1)}" text-anchor="middle" font-size="10.8" font-weight="800" fill="${color}">${escXml(bLabel)}</text>`;
    }
  });

  // Markers & anti-collision callouts
  let markersSvg = "";
  const placedLabels = [];
  const markers = (Array.isArray(g.markers) ? g.markers : []).slice(0, 7);
  markers.forEach((mk) => {
    const mx = toPxX(mk.x);
    const my = toPxY(mk.y);
    const color = mk.color || "#0f172a";
    const lbl = formatChemText(mk.label || "");
    markersSvg += `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="6" fill="#ffffff" stroke="${color}" stroke-width="2.5"/>`;
    if (lbl) {
      const pw = clamp(estimateTextW(lbl, 11) + 14, 48, 175);
      let lx = clamp(mx - pw / 2, plotX + 6, plotX + plotW - pw - 6);
      let ly = my - 28 < plotY + 6 ? my + 12 : my - 28;
      // Nudge vertically if overlapping prior marker pill
      for (let attempt = 0; attempt < 3; attempt++) {
        const overlaps = placedLabels.some((p) => !(lx + pw < p.x || lx > p.x + p.w || ly + 20 < p.y || ly > p.y + 20));
        if (!overlaps) break;
        ly = clamp(ly + (ly < plotY + plotH / 2 ? 23 : -23), plotY + 4, plotY + plotH - 22);
      }
      placedLabels.push({ x: lx, y: ly, w: pw });
      markersSvg += `<rect x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" width="${pw.toFixed(1)}" height="20" rx="5" fill="#ffffff" fill-opacity="0.94" stroke="${color}" stroke-width="1.2"/>`;
      markersSvg += `<text x="${(lx + pw / 2).toFixed(1)}" y="${(ly + 13.5).toFixed(1)}" text-anchor="middle" font-size="10.8" font-weight="800" fill="${color}">${escXml(lbl)}</text>`;
    }
  });

  // Summary Parameters Panel (right side)
  const summaryRows = (Array.isArray(g.summaryRows) ? g.summaryRows : []).slice(0, 6);
  const summaryStartY = topOffset + 48 + Math.max(1, curves.length) * 24 + 18;
  let summarySvg = "";
  if (summaryRows.length) {
    summarySvg += `<line x1="${panelX + 12}" y1="${summaryStartY - 10}" x2="${panelX + panelW - 12}" y2="${summaryStartY - 10}" stroke="#e2e8f0" stroke-width="1.2"/>`;
    summarySvg += `<text x="${panelX + 14}" y="${summaryStartY + 6}" font-size="11" font-weight="800" fill="#1d4ed8" letter-spacing="0.4">KEY PARAMETERS &amp; LAWS</text>`;
    summaryRows.forEach((row, idx) => {
      const ry = summaryStartY + 26 + idx * 38;
      if (ry + 28 > topOffset + totalH) return;
      const k = formatChemText(Array.isArray(row) ? row[0] : (row.key || "")).slice(0, 26);
      const v = formatChemText(Array.isArray(row) ? row[1] : (row.value || "")).slice(0, 36);
      summarySvg += `
        <rect x="${panelX + 12}" y="${ry}" width="${panelW - 24}" height="32" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
        <text x="${panelX + 20}" y="${ry + 12}" font-size="10" font-weight="700" fill="#64748b">${escXml(k)}</text>
        <text x="${panelX + 20}" y="${ry + 26}" font-size="11.5" font-weight="800" fill="#0f172a">${escXml(v)}</text>
      `;
    });
  }

  const xLabel = formatChemText(g.xLabel || "Reaction Coordinate / Extent of Reaction →");
  const yLabel = formatChemText(g.yLabel || "Potential Energy (kJ/mol)");

  const body = `
    <rect x="28" y="${topOffset}" width="${panelX - 36}" height="${totalH}" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.4"/>
    <rect x="${plotX}" y="${plotY}" width="${plotW}" height="${plotH}" fill="#fcfdff"/>
    ${gridSvg}
    ${baseSvg}
    ${ticksSvg}
    <line x1="${plotX}" y1="${plotY + plotH}" x2="${plotX + plotW + 10}" y2="${plotY + plotH}" stroke="#0f172a" stroke-width="2.2" marker-end="url(#arrow-axis)"/>
    <line x1="${plotX}" y1="${plotY + plotH}" x2="${plotX}" y2="${plotY - 10}" stroke="#0f172a" stroke-width="2.2" marker-end="url(#arrow-axis)"/>
    <text x="${plotX + plotW / 2}" y="${topOffset + totalH - 12}" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0f172a">${escXml(xLabel)}</text>
    <text x="48" y="${plotY + plotH / 2}" transform="rotate(-90 48 ${plotY + plotH / 2})" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0f172a">${escXml(yLabel)}</text>
    ${curvesSvg}
    ${bracketsSvg}
    ${markersSvg}

    <rect x="${panelX}" y="${topOffset}" width="${panelW}" height="${totalH}" rx="12" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"/>
    <rect x="${panelX}" y="${topOffset}" width="${panelW}" height="32" rx="12" fill="#eff6ff"/>
    <rect x="${panelX}" y="${topOffset + 20}" width="${panelW}" height="12" fill="#eff6ff"/>
    <text x="${panelX + panelW / 2}" y="${topOffset + 21}" text-anchor="middle" font-size="11.5" font-weight="800" fill="#1d4ed8">PLOT LEGEND &amp; ANALYSIS</text>
    ${legendSvg}
    ${summarySvg}
  `;

  return wrapCanvas(
    s.title || "Chemistry Scientific Graph",
    s.subtitle || "Quantitative Curve · Key Parameters · Reaction Analysis",
    s.equation || "",
    body,
    s.examTrap || "Verify axes units, slopes, intercepts, and catalyst vs temperature effects on rate vs equilibrium."
  );
}

/**
 * Deterministic Polymorphic 2D Scene Graph Compiler.
 * Routes "graph" specs to compileGraphScene, and lays out 1-4 molecular/mechanism
 * stages across 1080x620 with collision detection and strict bounds clamping.
 */
function compileReactionScene(spec) {
  const s = spec || {};
  if (s.diagramType === "graph" || (s.graph && Array.isArray(s.graph.curves) && s.graph.curves.length)) {
    return compileGraphScene(s);
  }

  const stages = Array.isArray(s.stages) && s.stages.length ? s.stages.slice(0, 4) : [];
  const transitions = Array.isArray(s.transitions) ? s.transitions : [];

  if (!stages.length) {
    return buildStructuredDiagramSvg(s.title, s.subtitle || "", s.equation || "");
  }

  const count = stages.length;
  const marginX = 28;
  const usableW = WIDTH - marginX * 2; // 1024
  const gapW = count === 1 ? 0 : count === 2 ? (s.diagramType === "structure" ? 36 : 146) : count === 3 ? 96 : 68;
  const stageW = Math.floor((usableW - gapW * (count - 1)) / count);
  const stageTop = s.equation ? 132 : 96;
  const stageH = s.equation ? 406 : 442;
  const arrowY = stageTop + 178;

  let body = "";
  stages.forEach((st, idx) => {
    const sx = marginX + idx * (stageW + gapW);
    const tone = TONES[st.tone] || TONES[idx === 0 ? "blue" : idx === count - 1 ? "green" : "orange"];
    const badgeTitle = formatChemText(st.title || `Stage ${idx + 1}`).slice(0, count >= 4 ? 26 : 42);

    const noteMaxChars = count >= 4 ? 26 : count === 3 ? 34 : count === 2 ? 54 : 110;
    const noteLines = wrapLines(formatChemText(st.note || ""), noteMaxChars, 2);
    const hasNote = noteLines.length > 0;
    const footerReserve = hasNote ? 56 : 14;

    const drawX = sx + 10;
    const drawY = stageTop + 42;
    const drawW = stageW - 20;
    const drawH = stageH - 46 - footerReserve;

    const rawMolecules = Array.isArray(st.molecules) ? st.molecules : [];
    // Proportionally enlarge small rings in spacious 1-2 stage layouts so cards look well-balanced
    const molecules = rawMolecules.map((m) => {
      if (count <= 2 && rawMolecules.length <= 2 && /^(?:benzene|phenyl|aromatic|cyclohexane|arenium)$/i.test(String(m.type || ""))) {
        const baseR = typeof m.r === "number" ? m.r : 32;
        if (baseR < 38) return { ...m, r: Math.min(40, Math.round(baseR * 1.18)) };
      }
      return m;
    });

    // Compute initial pixel positions and run pairwise anti-overlap nudging
    const placements = molecules.map((m) => {
      const ext = getNodeExtent(m);
      return {
        node: m,
        ext,
        cx: drawX + ((typeof m.rx === "number" ? m.rx : 0.5) * drawW),
        cy: drawY + ((typeof m.ry === "number" ? m.ry : 0.5) * drawH)
      };
    });

    for (let pass = 0; pass < 3 && placements.length > 1; pass++) {
      for (let a = 0; a < placements.length; a++) {
        for (let b = a + 1; b < placements.length; b++) {
          const p1 = placements[a];
          const p2 = placements[b];
          const overlapX = (p1.ext.right + p2.ext.left + 8) - Math.abs(p1.cx - p2.cx);
          const overlapY = (p1.ext.bottom + p2.ext.top + 6) - Math.abs(p1.cy - p2.cy);
          const minDx = (p1.cx <= p2.cx ? p1.ext.right + p2.ext.left : p2.ext.right + p1.ext.left) + 8;
          const minDy = (p1.cy <= p2.cy ? p1.ext.bottom + p2.ext.top : p2.ext.bottom + p1.ext.top) + 6;
          const dx = p2.cx - p1.cx;
          const dy = p2.cy - p1.cy;
          if (Math.abs(dx) < minDx && Math.abs(dy) < minDy && (overlapX > 0 || overlapY > 0)) {
            if (minDx - Math.abs(dx) < minDy - Math.abs(dy)) {
              const push = (minDx - Math.abs(dx)) * 0.45 * (dx >= 0 ? 1 : -1);
              p1.cx = clamp(p1.cx - push, drawX + 36, drawX + drawW - 36);
              p2.cx = clamp(p2.cx + push, drawX + 36, drawX + drawW - 36);
            } else {
              const push = (minDy - Math.abs(dy)) * 0.45 * (dy >= 0 ? 1 : -1);
              p1.cy = clamp(p1.cy - push, drawY + 34, drawY + drawH - 34);
              p2.cy = clamp(p2.cy + push, drawY + 34, drawY + drawH - 34);
            }
          }
        }
      }
    }

    // Build obstacle footprints matching final clamped positions so curved arrows never strike through rings or labels
    const obstacles = placements.map((p) => {
      const t = String(p.node.type || "formula").toLowerCase();
      const sL = p.ext.left;
      const sR = p.ext.right;
      const minCx = drawX + sL + 4;
      const maxCx = drawX + drawW - sR - 4;
      const cx = minCx <= maxCx ? clamp(p.cx, minCx, maxCx) : drawX + drawW / 2;
      const sT = p.ext.top;
      const sB = p.ext.bottom;
      const minCy = drawY + sT + 4;
      const maxCy = drawY + drawH - sB - 4;
      const cy = minCy <= maxCy ? clamp(p.cy, minCy, maxCy) : drawY + drawH / 2;
      const isRing = ["benzene", "phenyl", "aromatic", "cyclohexane", "arenium", "pentagon", "molozonide"].includes(t);
      return {
        cx,
        cy,
        isRing,
        ringR: isRing ? (p.node.r || 32) : 0,
        halfW: isRing ? (p.node.r || 32) * 0.96 : Math.max(24, p.ext.left),
        halfH: isRing ? (p.node.r || 32) * 0.96 : 16
      };
    });

    const projectOutOfObstacle = (px, py, towardX, towardY) => {
      let x = px;
      let y = py;
      for (const ob of obstacles) {
        if (!ob.isRing) {
          if (Math.abs(x - ob.cx) < ob.halfW - 2 && Math.abs(y - ob.cy) < ob.halfH - 1) {
            const vx = towardX - ob.cx;
            const vy = towardY - ob.cy;
            if (Math.abs(vx) >= Math.abs(vy)) {
              x = ob.cx + (vx >= 0 ? 1 : -1) * (ob.halfW + 6);
              y = clamp(y, ob.cy - ob.halfH * 0.5, ob.cy + ob.halfH * 0.5);
            } else {
              y = ob.cy + (vy >= 0 ? 1 : -1) * (ob.halfH + 6);
            }
          }
        } else {
          const dist = Math.hypot(x - ob.cx, y - ob.cy);
          if (dist < ob.ringR * 0.65) {
            const ang = Math.atan2(towardY - ob.cy, towardX - ob.cx);
            x = ob.cx + (ob.ringR * 0.94) * Math.cos(ang);
            y = ob.cy + (ob.ringR * 0.94) * Math.sin(ang);
          }
        }
      }
      return [clamp(x, drawX + 8, drawX + drawW - 8), clamp(y, drawY + 8, drawY + drawH - 8)];
    };

    let molsSvg = "";
    for (const p of placements) {
      molsSvg += renderMoleculeNode(p.node, drawX, drawY, drawW, drawH, { cx: p.cx, cy: p.cy });
    }

    let arrowsSvg = "";
    const curved = Array.isArray(st.curvedArrows) ? st.curvedArrows : [];
    for (const ca of curved) {
      const rawFx = clamp(drawX + ((ca.fromRx ?? 0.3) * drawW), drawX + 8, drawX + drawW - 8);
      const rawFy = clamp(drawY + ((ca.fromRy ?? 0.5) * drawH), drawY + 8, drawY + drawH - 8);
      const rawTx = clamp(drawX + ((ca.toRx ?? 0.7) * drawW), drawX + 8, drawX + drawW - 8);
      const rawTy = clamp(drawY + ((ca.toRy ?? 0.5) * drawH), drawY + 8, drawY + drawH - 8);
      const [fx, fy] = projectOutOfObstacle(rawFx, rawFy, rawTx, rawTy);
      const [tx, ty] = projectOutOfObstacle(rawTx, rawTy, fx, fy);

      // Pick arc polarity (- vs +) that maximizes minimum clearance from obstacle centers along the quadratic curve
      const rawArc = typeof ca.arc === "number" ? ca.arc : -28;
      const mag = Math.max(24, Math.min(54, Math.abs(rawArc) || 28));
      const scoreArc = (arcVal) => {
        const mx = (fx + tx) / 2;
        const my = (fy + ty) / 2;
        const ddx = tx - fx;
        const ddy = ty - fy;
        const len = Math.hypot(ddx, ddy) || 1;
        const qx = mx + (-ddy / len) * arcVal;
        const qy = my + (ddx / len) * arcVal;
        if (qy < drawY + 4 || qy > drawY + drawH - 4) return -999;
        let minClear = 999;
        for (const tVal of [0.25, 0.5, 0.75]) {
          const mt = 1 - tVal;
          const px = mt * mt * fx + 2 * mt * tVal * qx + tVal * tVal * tx;
          const py = mt * mt * fy + 2 * mt * tVal * qy + tVal * tVal * ty;
          for (const ob of obstacles) {
            const d = Math.hypot(px - ob.cx, py - ob.cy) - (ob.isRing ? ob.ringR : Math.max(ob.halfW, ob.halfH));
            if (d < minClear) minClear = d;
          }
        }
        // Slight preference (+1.5) for arching upward cleanly above species
        return minClear + (qy < my ? 1.5 : 0);
      };
      const bestArc = scoreArc(-mag) >= scoreArc(mag) ? -mag : mag;
      arrowsSvg += drawCurvedArrow(fx, fy, tx, ty, bestArc, ca.kind || "nuc");
    }

    const noteSvg = hasNote
      ? `<line x1="${sx + 14}" y1="${stageTop + stageH - 54}" x2="${sx + stageW - 14}" y2="${stageTop + stageH - 54}" stroke="#e2e8f0" stroke-width="1"/>` +
        noteLines.map((ln, li) =>
          `<text x="${sx + stageW / 2}" y="${stageTop + stageH - 34 + li * 16}" text-anchor="middle" font-size="11.5" font-weight="600" fill="#334155">${escXml(ln)}</text>`
        ).join("")
      : "";

    const rxnArrow = (idx < count - 1 && s.diagramType !== "structure")
      ? drawReactionArrow(sx + stageW + 6, sx + stageW + gapW - 6, arrowY, transitions[idx] || {})
      : "";

    body += `
      <rect x="${sx}" y="${stageTop}" width="${stageW}" height="${stageH}" rx="12" fill="#ffffff" stroke="${tone.border}" stroke-width="1.6"/>
      <rect x="${sx}" y="${stageTop}" width="${stageW}" height="34" rx="12" fill="${tone.bg}"/>
      <rect x="${sx}" y="${stageTop + 22}" width="${stageW}" height="12" fill="${tone.bg}"/>
      <text x="${sx + stageW / 2}" y="${stageTop + 22}" text-anchor="middle" font-size="11.8" font-weight="800" fill="${tone.fg}">${escXml(badgeTitle)}</text>
      ${molsSvg}
      ${arrowsSvg}
      ${noteSvg}
      ${rxnArrow}
    `;
  });

  return wrapCanvas(
    s.title || "Chemistry Study Diagram",
    s.subtitle || "2D Molecular Structures · Curved Electron Arrows · Reaction Pathway",
    s.equation || "",
    body,
    s.examTrap || "Follow curved arrows from nucleophiles/π-bonds to electrophiles and verify stereochemistry."
  );
}

/* ==================== CURATED HIGH-PRECISION PRESETS ==================== */

const PRESETS = [
  {
    id: "benzene-chlorobenzene-synthesis",
    match: /(?:convert|prepar|synthes|from|chlorination|halogenation|electrophilic)\b[^.\n]{0,45}\b(benzene\b[^.\n]{0,45}\bchlorobenzene|chlorobenzene\b[^.\n]{0,45}\bbenzene|benzene\s+with\s+cl2)|\bbenzene\s*(?:->|⟶|→|to|into)\s*chlorobenzene\b|\bchlorination\s+of\s+benzene\b/i,
    title: "Conversion of Benzene to Chlorobenzene (Electrophilic Chlorination)",
    caption: "Benzene undergoes electrophilic aromatic substitution with $\\ce{Cl2}$ using anhydrous $\\ce{FeCl3}$ / $\\ce{AlCl3}$ catalyst via an $sp^3$ arenium $\\sigma$-complex: $\\ce{C6H6 + Cl2 ->[\\text{Anhy. FeCl3}] C6H5Cl + HCl}$.",
    latexEquation: "\\ce{C6H6 + Cl2 ->[\\text{Anhy. FeCl3 / AlCl3}][310\\text{–}320\\text{ K, dark}] C6H5Cl + HCl}",
    catalysts: ["Anhy. $\\text{FeCl}_3$ / $\\text{AlCl}_3$ (Lewis acid)", "310–320 K (Dark, no UV)", "Electrophile: $\\text{Cl}^+\\text{FeCl}_4^-$"],
    build() {
      return compileReactionScene({
        title: "Benzene → Chlorobenzene (Electrophilic Aromatic Chlorination)",
        subtitle: "Lewis Acid Catalyst FeCl₃/AlCl₃ · Polarised Cl₂ Attack · Wheland Arenium [σ-Complex]⁺",
        equation: "C₆H₆ + Cl₂  ⟶ (Anhy. FeCl₃, 310–320 K, dark)  C₆H₅–Cl (Chlorobenzene) + HCl",
        stages: [
          {
            title: "1. Catalyst Activation & π-Attack",
            tone: "blue",
            molecules: [
              { type: "benzene", rx: 0.34, ry: 0.50, r: 34, aromatic: "kekule", ringName: "Benzene (C₆H₆)" },
              { type: "formula", rx: 0.78, ry: 0.30, text: "δ⁺Cl–Clδ⁻···FeCl₃", color: "#dc2626", size: 12.5, boxed: true, bg: "#fef2f2", border: "#fca5a5" }
            ],
            curvedArrows: [
              { fromRx: 0.45, fromRy: 0.38, toRx: 0.68, toRy: 0.31, arc: -24, kind: "nuc" }
            ],
            note: "FeCl₃ polarises Cl–Cl generating active Cl⁺ electrophile"
          },
          {
            title: "2. Arenium σ-Complex [‡] Pathway",
            tone: "orange",
            molecules: [
              { type: "arenium", rx: 0.44, ry: 0.54, r: 34, subs: { gemTop: ["H", "Cl"] }, ringName: "sp³ tetrahedral C1" },
              { type: "formula", rx: 0.80, ry: 0.28, text: "FeCl₄⁻", color: "#0284c7", size: 14, boxed: true, bg: "#f0f9ff", border: "#7dd3fc" }
            ],
            curvedArrows: [
              { fromRx: 0.72, fromRy: 0.25, toRx: 0.37, toRy: 0.21, arc: -20, kind: "nuc" }
            ],
            note: "Slow RDS: Aromaticity broken · +ve charge on o/p carbons"
          },
          {
            title: "3. Chlorobenzene + Catalyst Regenerated",
            tone: "green",
            molecules: [
              { type: "benzene", rx: 0.40, ry: 0.52, r: 34, aromatic: "circle", subs: { top: { label: "Cl", color: "#047857" } }, showLonePairs: true, ringName: "Chlorobenzene" },
              { type: "formula", rx: 0.80, ry: 0.48, text: "+ HCl + FeCl₃", color: "#475569", size: 13 }
            ],
            note: "Fast deprotonation restores 6π aromaticity · C–Cl 1.69 Å"
          }
        ],
        transitions: [
          { type: "forward", above: "Cl₂ / FeCl₃", below: "Slow (RDS)" },
          { type: "forward", above: "− H⁺", below: "Fast" }
        ],
        examTrap: "Exam Trap: In sunlight (hν) without FeCl₃, Cl₂ adds across benzene rings via free radicals to give BHC (C₆H₆Cl₆), NOT chlorobenzene!"
      });
    }
  },
  {
    id: "benzene-vs-chlorobenzene-structure",
    match: /\b(benzene|c6h6)\b[\s\S]{0,40}\b(chlorobenzene|c6h5cl|haloarene)\b|\b(chlorobenzene|c6h5cl)\b[\s\S]{0,40}\b(benzene|c6h6)\b/i,
    title: "Benzene vs. Chlorobenzene: 2D Structures, Resonance & Reactivity",
    caption: "Structural comparison of Benzene ($\\ce{C6H6}$, $D_{6h}$ symmetric, $\\mu = 0\\text{ D}$) and Chlorobenzene ($\\ce{C6H5Cl}$, $+M$ lone-pair delocalisation gives partial $\\text{C=Cl}$ double-bond character, $1.69\\text{ Å}$ vs $1.77\\text{ Å}$ in $\\ce{CH3Cl}$).",
    latexEquation: "\\ce{C6H6} \\; (\\text{sp}^2,\\; \\mu = 0\\text{ D}) \\quad \\text{vs.} \\quad \\ce{C6H5-Cl} \\; (\\text{C–Cl partial } \\pi\\text{-bond},\\; +M > -I \\text{ for orientation})",
    catalysts: ["Benzene: $120^\\circ$ planar $sp^2$ hexagon", "Chlorobenzene: $-I$ deactivates rate, $+M$ directs $o/p$", "Conversion: $\\ce{Cl2 / Anhy. FeCl3}$ (dark)"],
    build() {
      return compileReactionScene({
        diagramType: "structure",
        title: "2D Molecular Structures: Benzene (C₆H₆) vs. Chlorobenzene (C₆H₅Cl)",
        subtitle: "6π Aromatic Delocalisation · Chlorine +M Resonance vs −I Inductive Effect · Bond Parameters",
        equation: "C₆H₆  +  Cl₂   ⟶ (Anhy. FeCl₃ / AlCl₃, 310 K, dark)   C₆H₅–Cl  +  HCl",
        stages: [
          {
            title: "1. Benzene (C₆H₆) — D₆ₕ Symmetric",
            tone: "blue",
            molecules: [
              {
                type: "benzene", rx: 0.50, ry: 0.44, r: 46, aromatic: "kekule",
                ringName: "All 6 C–C bonds equal (1.39 Å)",
                subs: { top: "H", topRight: "H", bottomRight: "H", bottom: "H", bottomLeft: "H", topLeft: "H" }
              },
              {
                type: "formula", rx: 0.50, ry: 0.85,
                text: "sp² planar (120°) · 6 π e⁻ · Dipole μ = 0 D",
                color: "#1d4ed8", size: 12.5, boxed: true, bg: "#eff6ff", border: "#93c5fd"
              }
            ],
            note: "Equally reactive at all 6 carbons toward electrophiles (E⁺)"
          },
          {
            title: "2. Chlorobenzene (C₆H₅Cl) — +M & −I",
            tone: "teal",
            molecules: [
              {
                type: "benzene", rx: 0.50, ry: 0.44, r: 46, aromatic: "circle",
                showLonePairs: true,
                subs: {
                  top: { label: "Cl", color: "#047857" },
                  topRight: "H", bottomRight: "H", bottom: "H", bottomLeft: "H", topLeft: "H"
                },
                charges: { topRight: "δ⁻", bottom: "δ⁻", topLeft: "δ⁻" },
                ringName: "C–Cl = 1.69 Å (Partial double bond)"
              },
              {
                type: "formula", rx: 0.50, ry: 0.85,
                text: "μ = 1.69 D · Resists SN1/SN2 · o/p-Directing Deactivator",
                color: "#0f766e", size: 12.5, boxed: true, bg: "#f0fdfa", border: "#5eead4"
              }
            ],
            curvedArrows: [
              { fromRx: 0.47, fromRy: 0.16, toRx: 0.48, toRy: 0.30, arc: -16, kind: "nuc" }
            ],
            note: "3p lone pair donates (+M) into ortho/para positions"
          }
        ],
        examTrap: "Exam Trap: Halogens are the ONLY common o/p-directing substituents that DEACTIVATE benzene overall (−I > +M for reactivity; +M controls o/p orientation) and resist SN2."
      });
    }
  },
  {
    id: "chlorobenzene-only",
    match: /\bchlorobenzene\b|\bhaloarene\b|\baryl halide\b/i,
    title: "Chlorobenzene (C₆H₅Cl): Structure, Resonance & Dow's Hydrolysis",
    caption: "Chlorobenzene features a strengthened $sp^2\\text{ C–Cl}$ bond ($1.69\\text{ Å}$) from $+M$ lone-pair delocalisation, resisting mild nucleophilic attack until harsh Dow's conditions ($623\\text{ K}, 300\\text{ atm}$).",
    latexEquation: "\\ce{C6H5-Cl + NaOH ->[623\\text{ K},\\; 300\\text{ atm}][\\text{then } H^+] C6H5-OH + NaCl}",
    catalysts: ["Dow's Process: $623\\text{ K},\\; 300\\text{ atm}$ aq. $\\text{NaOH}$", "Partial $\\text{C=Cl}$ double-bond character ($1.69\\text{ Å}$)"],
    build() {
      return compileReactionScene({
        title: "Chlorobenzene (C₆H₅Cl) Structure, Resonance & Dow's Process",
        subtitle: "sp² C–Cl Partial Double Bond · Electron Density at Ortho/Para · Harsh Nucleophilic Substitution",
        equation: "C₆H₅–Cl + 2 NaOH  ⟶ (623 K, 300 atm)  C₆H₅O⁻Na⁺  ⟶ (H₃O⁺)  C₆H₅OH + NaCl",
        stages: [
          {
            title: "1. Chlorobenzene (Ground State)",
            tone: "blue",
            molecules: [
              {
                type: "benzene", rx: 0.50, ry: 0.48, r: 34, aromatic: "kekule",
                showLonePairs: true, subs: { top: { label: "Cl", color: "#047857" } },
                ringName: "C(sp²)–Cl (1.69 Å)"
              }
            ],
            curvedArrows: [
              { fromRx: 0.47, fromRy: 0.24, toRx: 0.49, toRy: 0.36, arc: -16, kind: "nuc" }
            ],
            note: "Shorter & stronger than CH₃–Cl (1.77 Å)"
          },
          {
            title: "2. +M Resonance Canonical (+Cl=C)",
            tone: "orange",
            molecules: [
              {
                type: "benzene", rx: 0.50, ry: 0.50, r: 34, aromatic: "circle",
                subs: { top: { label: "Cl⁺", color: "#c2410c", bond: "double" } },
                charges: { topRight: "−", bottom: "δ−", topLeft: "δ−" },
                ringName: "Ortho/Para Rich"
              }
            ],
            note: "Why Cl is o/p-directing in EAS & unreactive to aq. NaOH"
          },
          {
            title: "3. Dow's Process → Phenol",
            tone: "green",
            molecules: [
              {
                type: "benzene", rx: 0.46, ry: 0.50, r: 34, aromatic: "circle",
                subs: { top: { label: "OH", color: "#047857" } },
                ringName: "Phenol (C₆H₅OH)"
              }
            ],
            note: "o/p-NO₂ groups stabilise Meisenheimer complex & speed SNAr"
          }
        ],
        transitions: [
          { type: "res", above: "Resonance", below: "+M / −I" },
          { type: "forward", above: "NaOH, 623K", below: "300 atm; H⁺" }
        ],
        examTrap: "Exam Trap: 2,4,6-Trinitrochlorobenzene (picryl chloride) hydrolyses smoothly in warm H₂O alone due to three −M NO₂ groups stabilising the anionic intermediate."
      });
    }
  },
  {
    id: "activation-energy-graph",
    match: /\b(activation energy|energy profile|reaction coordinate|potential energy diagram|exothermic|endothermic|catalys(?:ed|is).*graph|graph.*cataly)\b/i,
    title: "Reaction Coordinate Energy Profile: Uncatalysed vs. Catalysed Pathway",
    caption: "Potential energy diagram comparing uncatalysed activation barrier $E_a$ with a catalysed pathway $E_a'$ ($E_a' < E_a$) while enthalpy change $\\Delta H = H_P - H_R$ stays strictly unchanged.",
    latexEquation: "E_a^{\\text{cat}} < E_a^{\\text{uncat}}, \\qquad \\Delta H = E_{a,f} - E_{a,b} \\; (<0\\text{ exothermic})",
    catalysts: ["Catalyst lowers $E_a$ via alternative TS $[\\ddagger]_{\\text{cat}}$", "$\\Delta H$ and $K_{\\text{eq}}$ remain strictly invariant"],
    build() {
      return compileGraphScene({
        title: "Potential Energy Profile: Uncatalysed vs. Catalysed Reaction",
        subtitle: "Activation Barrier Ea vs Ea' · Transition State [‡] · Invariant Reaction Enthalpy (ΔH)",
        equation: "Reactants (R)  ⟶  [Transition State]‡ (Ea)  ⟶  Products (P)   [ΔH = Ea,f − Ea,b < 0]",
        graph: {
          xLabel: "Reaction Coordinate (Progress of Reaction) →",
          yLabel: "Potential Energy H (kJ mol⁻¹)",
          baselineY: 42,
          baselineLabel: "Reactant Enthalpy Level (H_R)",
          xTicks: [
            { pos: 14, label: "Reactants" },
            { pos: 48, label: "TS [‡]" },
            { pos: 86, label: "Products" }
          ],
          yTicks: [
            { pos: 18, label: "H_P" },
            { pos: 42, label: "H_R" },
            { pos: 64, label: "TS'‡" },
            { pos: 88, label: "TS‡" }
          ],
          curves: [
            {
              label: "Uncatalysed Pathway (Higher Ea)",
              color: "#dc2626",
              dashed: false,
              points: [[6, 42], [18, 42], [32, 56], [48, 88], [64, 52], [78, 20], [94, 18]]
            },
            {
              label: "Catalysed Pathway (Lower Ea')",
              color: "#047857",
              dashed: true,
              points: [[6, 42], [18, 42], [34, 51], [48, 64], [64, 42], [78, 20], [94, 18]]
            }
          ],
          brackets: [
            { x: 34, y1: 42, y2: 88, guideFromX: 48, label: "Ea (Uncat)", color: "#dc2626" },
            { x: 58, y1: 42, y2: 64, guideFromX: 48, label: "Ea' (Cat)", color: "#047857" },
            { x: 84, y1: 18, y2: 42, label: "ΔH < 0", color: "#1d4ed8" }
          ],
          markers: [
            { x: 14, y: 42, label: "Reactants (R)", color: "#1d4ed8" },
            { x: 48, y: 88, label: "Uncatalysed [TS]‡", color: "#dc2626" },
            { x: 48, y: 64, label: "Catalysed [TS']‡", color: "#047857" },
            { x: 86, y: 18, label: "Products (P)", color: "#047857" }
          ],
          summaryRows: [
            ["Uncatalysed Barrier", "Ea = E(TS‡) − H_R"],
            ["Catalysed Effect", "Lowers Ea → Raises k"],
            ["Enthalpy Change", "ΔH = Ea,f − Ea,b (Invariant)"],
            ["Equilibrium Keq", "Unchanged (Both kf, kb ↑)"]
          ]
        },
        examTrap: "Exam Trap: A catalyst lowers both forward Ea,f and backward Ea,b by the exact same amount ΔEa, leaving ΔH, ΔG°, and Keq completely unchanged."
      });
    }
  },
  {
    id: "arrhenius-kinetics-graph",
    match: /\b(arrhenius|ln\s*k\s*vs\s*1\/t|log\s*k\s*vs\s*1\/t|first[- ]order\s+kinetics\s+(?:graph|plot|curve)|kinetics\s+graph)\b/i,
    title: "Arrhenius Kinetics Plot (ln k vs. 1/T) & Rate Constant Slope",
    caption: "Linearised Arrhenius plot $\\ln k = \\ln A - \\frac{E_a}{R}\\left(\\frac{1}{T}\\right)$ with slope $-E_a/R$ showing steeper negative slope for high-$E_a$ reactions.",
    latexEquation: "k = A e^{-E_a / RT} \\quad \\Longrightarrow \\quad \\ln k = \\ln A - \\left(\\frac{E_a}{R}\\right)\\frac{1}{T}",
    catalysts: ["Slope $= -E_a / R$ (or $-E_a / 2.303R$ in $\\log_{10} k$)", "Intercept on $y$-axis $= \\ln A$ (frequency factor)"],
    build() {
      return compileGraphScene({
        title: "Arrhenius Equation Plot: ln k vs. (1 / T) & Activation Energy Slope",
        subtitle: "Linearised Chemical Kinetics · Slope = −Ea / R · Y-Intercept = ln A",
        equation: "ln k = ln A − (Ea / R) · (1 / T)     |     ln(k₂ / k₁) = (Ea / R) · [1/T₁ − 1/T₂]",
        graph: {
          xLabel: "Reciprocal Temperature  1 / T (K⁻¹) →",
          yLabel: "ln k  (Rate Constant Logarithm)",
          xTicks: [
            { pos: 15, label: "High T" },
            { pos: 50, label: "1/T₁" },
            { pos: 82, label: "Low T (1/T₂)" }
          ],
          yTicks: [
            { pos: 25, label: "ln k₂" },
            { pos: 60, label: "ln k₁" },
            { pos: 88, label: "ln A" }
          ],
          curves: [
            {
              label: "Uncatalysed (Steep slope = −Ea/R)",
              color: "#dc2626",
              dashed: false,
              points: [[4, 88], [30, 68], [60, 44], [92, 18]]
            },
            {
              label: "Catalysed (Shallower slope = −Ea'/R)",
              color: "#047857",
              dashed: true,
              points: [[4, 88], [30, 77], [60, 64], [92, 51]]
            }
          ],
          brackets: [
            { x: 60, y1: 44, y2: 64, label: "Δ(ln k) ↑", color: "#047857" }
          ],
          markers: [
            { x: 4, y: 88, label: "Intercept = ln A", color: "#1d4ed8" },
            { x: 50, y: 52, label: "Slope = −Ea/R", color: "#dc2626" },
            { x: 82, y: 55, label: "Faster with Catalyst", color: "#047857" }
          ],
          summaryRows: [
            ["Arrhenius Form", "k = A · exp(−Ea / RT)"],
            ["ln k vs 1/T Slope", "−Ea / R  (log₁₀ k: −Ea / 2.303R)"],
            ["Y-Intercept (1/T→0)", "ln A  (Pre-exponential factor)"],
            ["Maxwell Fraction", "f = exp(−Ea / RT) active molecules"]
          ]
        },
        examTrap: "Exam Trap: Watch units closely — in log₁₀ k vs 1/T plots, slope is −Ea/(2.303 R), whereas in ln k vs 1/T plots, slope is −Ea/R!"
      });
    }
  },
  {
    id: "maxwell-boltzmann-graph",
    match: /\bmaxwell[- ]?boltzmann\b|fraction of molecules.*(?:kinetic|threshold) energy|\bboltzmann\s+distribution\b/i,
    title: "Maxwell–Boltzmann Kinetic Energy Distribution (T₁ vs. T₂ & Catalyst Ea')",
    caption: "As temperature increases ($T_2 > T_1$), the curve broadens and shifts right with a lower peak ($E_{\\text{mp}}$ increases), doubling/tripling the shaded fraction of molecules with $E \\ge E_a$. A catalyst shifts the threshold left to $E_a'$.",
    latexEquation: "\\frac{\\Delta N}{N} = f(E)\\,\\Delta E \\propto e^{-E_a / RT}, \\qquad E_{\\text{mp}} \\text{ shifts right as } T_2 > T_1 \\text{ (area under curve stays } 1\\text{)}",
    catalysts: ["Higher $T_2 > T_1$ expands shaded $E \\ge E_a$ tail", "Catalyst shifts threshold left to $E_a' < E_a$"],
    build() {
      return compileGraphScene({
        title: "Maxwell–Boltzmann Energy Distribution: Effect of Temperature & Catalyst",
        subtitle: "Fraction of Molecules (dN/N) vs. Kinetic Energy (E) · Shaded Reactive Tail (E ≥ Ea)",
        equation: "T₂ > T₁  ⇒  Peak Shifts Right & Drops (Area Constant)   |   Catalyst: Threshold Moves Left (Ea → Ea')",
        graph: {
          xLabel: "Kinetic Energy  E  (kJ mol⁻¹) →",
          yLabel: "Fraction of Molecules  (dN / N dE)",
          xTicks: [
            { pos: 26, label: "Emp(T₁)" },
            { pos: 38, label: "Emp(T₂)" },
            { pos: 50, label: "Ea' (Cat)" },
            { pos: 64, label: "Ea (Uncat)" }
          ],
          yTicks: [
            { pos: 0, label: "0" },
            { pos: 52, label: "Peak T₂" },
            { pos: 78, label: "Peak T₁" }
          ],
          vLines: [
            { x: 50, label: "Ea' (Catalysed)", color: "#047857" },
            { x: 64, label: "Ea (Uncatalysed)", color: "#dc2626" }
          ],
          curves: [
            {
              label: "Lower Temp T₁ (Higher peak)",
              color: "#1d4ed8",
              dashed: false,
              fillFromX: 64,
              points: [[0, 0], [8, 22], [16, 56], [26, 78], [36, 62], [46, 36], [56, 18], [64, 10], [74, 4.5], [86, 1.5], [96, 0.5]]
            },
            {
              label: "Higher Temp T₂ > T₁ (Shifted right)",
              color: "#dc2626",
              dashed: false,
              fillFromX: 64,
              points: [[0, 0], [10, 12], [22, 34], [38, 52], [50, 44], [60, 31], [64, 26], [74, 15], [86, 6], [96, 2.2]]
            }
          ],
          markers: [
            { x: 26, y: 78, label: "Most Probable E_mp (T₁)", color: "#1d4ed8" },
            { x: 38, y: 52, label: "Flatter Peak (T₂ > T₁)", color: "#dc2626" },
            { x: 74, y: 15, label: "Reactive Fraction E ≥ Ea", color: "#047857" }
          ],
          summaryRows: [
            ["Total Curve Area", "Constant (= 1, total molecules N)"],
            ["Effect of T₂ > T₁", "Peak drops & shifts right; tail ↑↑"],
            ["Catalyst Effect", "Lowers threshold Ea → Ea' (left)"],
            ["NCERT Rule (+10 K)", "Reactive tail ~2× → rate doubles"]
          ]
        },
        examTrap: "Exam Trap: Increasing temperature flattens the peak height because total area (total molecules) must stay constant; a catalyst NEVER changes the curve itself, only shifts the Ea line left!"
      });
    }
  },
  {
    id: "titration-curve-graph",
    match: /\b(titration\s+(?:curve|graph|plot)|ph\s+(?:curve|titration)|equivalence point.*(?:curve|graph)|weak acid.*strong base.*(?:curve|graph))\b/i,
    title: "Acid–Base Titration pH Curve (Weak Acid vs. Strong Base)",
    caption: "Titration profile of $\\ce{CH3COOH}$ ($25\\text{ mL}, 0.1\\text{ M}$) against $0.1\\text{ M NaOH}$ showing the buffer plateau ($\\text{pH} = \\text{p}K_a = 4.76$ at $V_{1/2}$) and alkaline equivalence point ($\\text{pH} \\approx 8.72$).",
    latexEquation: "\\text{At } V = \\tfrac{1}{2}V_{\\text{eq}}: \\; \\text{pH} = \\text{p}K_a \\qquad | \\qquad \\text{At } V = V_{\\text{eq}}: \\; \\text{pH} = 7 + \\tfrac{1}{2}(\\text{p}K_a + \\log C) > 7",
    catalysts: ["Indicator: Phenolphthalein ($\\text{pH } 8.2\\text{–}10.0$)", "Methyl Orange fails (colour turns too early in buffer zone)"],
    build() {
      return compileGraphScene({
        title: "Acid–Base Titration Curve: Weak Acid (CH₃COOH) vs. Strong Base (NaOH)",
        subtitle: "Buffer Zone (Henderson–Hasselbalch) · Equivalence Point (pH > 7) · Indicator Selection",
        equation: "CH₃COOH(aq) + OH⁻(aq)  ⟶  CH₃COO⁻(aq) + H₂O   [Equivalence Hydrolysis gives Basic pH > 7]",
        graph: {
          xLabel: "Volume of Strong Base (NaOH) Added (mL) →",
          yLabel: "Solution pH (0 to 14)",
          baselineY: 50,
          baselineLabel: "Neutral pH = 7.0",
          xTicks: [
            { pos: 25, label: "½ V_eq" },
            { pos: 52, label: "V_eq (25 mL)" },
            { pos: 85, label: "Excess OH⁻" }
          ],
          yTicks: [
            { pos: 20, label: "pH 2.9" },
            { pos: 34, label: "pKa 4.76" },
            { pos: 50, label: "pH 7.0" },
            { pos: 62, label: "pH 8.7" },
            { pos: 88, label: "pH 12.5" }
          ],
          curves: [
            {
              label: "Weak Acid + Strong Base (Equiv pH 8.7)",
              color: "#1d4ed8",
              dashed: false,
              points: [[4, 21], [12, 30], [25, 34], [38, 38], [48, 46], [52, 62], [56, 79], [70, 86], [94, 90]]
            },
            {
              label: "Strong Acid + Strong Base (Equiv pH 7.0)",
              color: "#94a3b8",
              dashed: true,
              points: [[4, 8], [25, 13], [46, 22], [52, 50], [58, 79], [70, 86], [94, 90]]
            }
          ],
          brackets: [
            { x: 52, y1: 42, y2: 80, label: "Steep pH Jump", color: "#dc2626" }
          ],
          markers: [
            { x: 25, y: 34, label: "Half-Equiv (pH = pKa)", color: "#047857" },
            { x: 52, y: 62, label: "Equiv Pt (pH 8.7 > 7)", color: "#dc2626" }
          ],
          summaryRows: [
            ["Initial pH", "½(pKa − log C) ≈ 2.88"],
            ["Buffer Region", "pH = pKa + log([A⁻]/[HA])"],
            ["Equivalence pH", "8.72 (Salt hydrolysis > 7)"],
            ["Best Indicator", "Phenolphthalein (8.2–10.0)"]
          ]
        },
        examTrap: "Exam Trap: Never use Methyl Orange (3.1–4.4) for weak acid + strong base titrations — it lies inside the buffer zone far before equivalence!"
      });
    }
  },
  {
    id: "inorganic-complex-vsepr",
    match: /\[(?:fe\(cn\)6|ni\(co\)4|ptcl4)\]|\b(coordination complex|crystal field|octahedral complex|square planar complex|vsepr|sf6|pcl5|xef4)\b/i,
    title: "Inorganic Coordination & VSEPR Geometry Architecture",
    caption: "Side-by-side 2D inorganic coordinate bonding & VSEPR geometry comparing low-spin octahedral $[\\ce{Fe(CN)6}]^{4-}$ ($d^2sp^3$) and hypervalent octahedral $\\ce{SF6}$ ($sp^3d^2$, $90^\\circ$).",
    latexEquation: "[\\ce{Fe(CN)6}]^{4-} \\; (d^2sp^3,\\; \\mu = 0\\text{ BM}) \\qquad \\text{and} \\qquad \\ce{SF6} \\; (sp^3d^2,\\; \\text{Octahedral } 90^\\circ)",
    catalysts: ["Strong-field $\\text{CN}^-$ pairs $3d^6$ electrons ($t_{2g}^6 e_g^0$)", "Dative coordinate bonds $\\text{L:} \\rightarrow \\text{M}^{n+}$"],
    build() {
      return compileReactionScene({
        diagramType: "structure",
        title: "Inorganic Geometries: Coordination Complex vs. VSEPR Octahedron",
        subtitle: "Dative Ligand-to-Metal Coordinate Bonds [M(L)₆]ⁿ± · Hybridisation & Magnetic Moment",
        equation: "Fe²⁺ (3d⁶) + 6 :CN⁻ (strong field)  ⟶  [Fe(CN)₆]⁴⁻ (d²sp³, diamagnetic, t₂g⁶ eg⁰)",
        stages: [
          {
            title: "1. Hexacyanoferrate(II) Complex",
            tone: "blue",
            molecules: [
              {
                type: "inorganic_complex", rx: 0.50, ry: 0.45,
                metal: "Fe²⁺", charge: "4−", geometry: "octahedral",
                ligands: ["CN⁻", "CN⁻", "NC⁻", "CN⁻", "NC⁻", "CN⁻"],
                caption: "d²sp³ inner-orbital · Diamagnetic (n = 0)"
              }
            ],
            note: "6 coordinate bonds (L → M) · CFSE = −2.4 Δₒ + 2P"
          },
          {
            title: "2. VSEPR Octahedral SF₆ (AX₆E₀)",
            tone: "purple",
            molecules: [
              {
                type: "vsepr", rx: 0.50, ry: 0.45,
                center: "S", geometry: "octahedral",
                ligands: ["F", "F", "F", "F", "F", "F"],
                angleLabel: "90°",
                caption: "sp³d² hybridised · Symmetrical (μ = 0 D)"
              }
            ],
            note: "All 6 S–F bond lengths equal (1.56 Å) · Inert to hydrolysis"
          }
        ],
        examTrap: "Exam Trap: [Fe(CN)₆]⁴⁻ is diamagnetic (d²sp³ low-spin), whereas [FeF₆]³⁻ and [Fe(H₂O)₆]²⁺ are high-spin paramagnetic (sp³d²) due to weak-field ligands."
      });
    }
  },
  {
    id: "sn2",
    match: /\bsn\s*2\b|bimolecular nucleophilic substitution|walden inversion/i,
    title: "SN2 Reaction Mechanism (Bimolecular Nucleophilic Substitution)",
    caption: "Concerted $180^\\circ$ backside attack through a pentacoordinate trigonal bipyramidal transition state $[\\text{Nu}\\cdots\\text{C}\\cdots\\text{X}]^{\\ddagger}$, yielding $100\\%$ Walden inversion.",
    latexEquation: "\\ce{Nu^- + H-C(R1R2)-X -> [Nu\\cdots C(R1R2H)\\cdots X]^{\\ddagger} -> Nu-C(R1R2H) + X^-}",
    catalysts: ["Polar aprotic solvent (DMSO, DMF, Acetone)", "Rate $= k[\\text{R-X}][\\text{Nu}^-]$ (2nd order)"],
    build() {
      return compileReactionScene({
        title: "SN2 Reaction Mechanism (Bimolecular Nucleophilic Substitution)",
        subtitle: "One-step concerted backside attack · 100% Walden inversion · Rate = k[R–X][Nu⁻]",
        equation: "Nu:⁻ + H–C(R₁R₂)–X  ⟶  [Nu···C(R₁R₂H)···X]‡  ⟶  Nu–C(R₁R₂H) + X⁻",
        stages: [
          {
            title: "1. Backside Attack (180° to C–X)",
            tone: "blue",
            molecules: [
              { type: "formula", rx: 0.14, ry: 0.48, text: "Nu:⁻", color: "#dc2626", size: 17, lonePair: "right" },
              { type: "tetrahedral", rx: 0.58, ry: 0.48, top: "H", wedge: "R₁", dash: "R₂", right: "X", delta: "δ+" }
            ],
            curvedArrows: [
              { fromRx: 0.24, fromRy: 0.42, toRx: 0.50, toRy: 0.45, arc: -26, kind: "nuc" },
              { fromRx: 0.67, fromRy: 0.45, toRx: 0.80, toRy: 0.43, arc: -22, kind: "lg" }
            ],
            note: "Polar aprotic solvents (DMSO, DMF, acetone) enhance Nu⁻"
          },
          {
            title: "2. Pentacoordinate TS [‡]",
            tone: "orange",
            molecules: [
              { type: "transition_state", rx: 0.49, ry: 0.46, nu: "Nu", lg: "X", top: "H", r1: "R₁", r2: "R₂" }
            ],
            note: "sp² planar central carbon · No carbocation intermediate"
          },
          {
            title: "3. Inverted Product (Walden)",
            tone: "green",
            molecules: [
              { type: "tetrahedral", rx: 0.44, ry: 0.48, invertUmbrella: true, top: "H", wedge: "R₁", dash: "R₂", left: "Nu", leftColor: "#dc2626" },
              { type: "formula", rx: 0.84, ry: 0.48, text: "+ X⁻", color: "#0284c7", size: 15.5 }
            ],
            note: "Reactivity: CH₃X > 1° > 2° >> 3° · I⁻ > Br⁻ > Cl⁻ >> F⁻"
          }
        ],
        transitions: [
          { type: "forward", above: "slow (RDS)", below: "concerted" },
          { type: "forward", above: "fast", below: "− X⁻" }
        ],
        examTrap: "Exam Trap: Configuration inverts like an umbrella; bridgehead & neopentyl halides fail SN2 due to steric hindrance."
      });
    }
  },
  {
    id: "sn1",
    match: /\bsn\s*1\b|unimolecular nucleophilic substitution|carbocation rearrangement/i,
    title: "SN1 Reaction Mechanism (Unimolecular Substitution)",
    caption: "Two-step $\\text{C–X}$ ionisation to a planar $sp^2$ carbocation intermediate followed by front/back nucleophilic capture.",
    latexEquation: "\\ce{R3C-X ->[\\text{slow}] R3C+ + X- ->[\\text{Nu}^-\\; (\\text{fast})] R3C-Nu \\; (dl\\text{-mixture})}",
    catalysts: ["Polar protic solvent ($\\text{H}_2\\text{O}, \\text{ROH}$)", "Rate $= k[\\text{R-X}]$ (1st order)"],
    build() {
      return compileReactionScene({
        title: "SN1 Reaction Mechanism (Unimolecular Nucleophilic Substitution)",
        subtitle: "Two-step ionisation · Planar sp² carbocation · Racemisation & 1,2-shifts",
        equation: "R₃C–X  ⟶  R₃C⁺ (planar sp²) + X⁻  ⟶  R₃C–Nu (dl / racemic mixture)",
        stages: [
          {
            title: "1. Slow C–X Ionisation (RDS)",
            tone: "red",
            molecules: [
              { type: "tetrahedral", rx: 0.46, ry: 0.48, top: "R₁", wedge: "R₂", dash: "R₃", right: "X" }
            ],
            curvedArrows: [
              { fromRx: 0.56, fromRy: 0.45, toRx: 0.72, toRy: 0.42, arc: -24, kind: "lg" }
            ],
            note: "Rate = k[R–X] · Polar protic solvents (H₂O, ROH, AcOH)"
          },
          {
            title: "2. Planar sp² Carbocation",
            tone: "orange",
            molecules: [
              { type: "planar_cation", rx: 0.36, ry: 0.48, top: "R₁", bl: "R₂", br: "R₃" },
              { type: "formula", rx: 0.80, ry: 0.46, text: "Nu:", color: "#dc2626", size: 16.5 }
            ],
            curvedArrows: [
              { fromRx: 0.72, fromRy: 0.38, toRx: 0.45, toRy: 0.38, arc: -22, kind: "nuc" },
              { fromRx: 0.72, fromRy: 0.56, toRx: 0.45, toRy: 0.56, arc: 22, kind: "nuc" }
            ],
            note: "1,2-H⁻/CH₃⁻ shift possible if a more stable C⁺ forms"
          },
          {
            title: "3. Racemic Products (~50:50)",
            tone: "green",
            molecules: [
              { type: "tetrahedral", rx: 0.25, ry: 0.46, invertUmbrella: true, top: "R₁", wedge: "R₂", dash: "R₃", left: "Nu", leftColor: "#047857" },
              { type: "formula", rx: 0.51, ry: 0.46, text: "+", color: "#475569", size: 17 },
              { type: "tetrahedral", rx: 0.76, ry: 0.46, top: "R₁", wedge: "R₂", dash: "R₃", right: "Nu", rightColor: "#1d4ed8" }
            ],
            note: "Inversion slightly exceeds retention via ion-pair shielding"
          }
        ],
        transitions: [
          { type: "forward", above: "Slow (RDS)", below: "− X⁻" },
          { type: "forward", above: "Fast", below: "front & back" }
        ],
        examTrap: "Exam Trap: Stability order Benzylic/Allylic > 3° > 2° >> 1°; bridgehead halides fail SN1 (Bredt's Rule)."
      });
    }
  },
  {
    id: "e2",
    match: /\be\s*2\b|anti[- ]?periplanar|zaitsev|saytzeff|dehydrohalogenation/i,
    title: "E2 Elimination Mechanism (Bimolecular β-Elimination)",
    caption: "Concerted anti-periplanar ($180^\\circ$) abstraction of $\\beta\\text{-H}$ and $\\text{C–X}$ departure forming the Zaitsev alkene.",
    latexEquation: "\\ce{B:- + H-C_{\\beta}(R2)-C_{\\alpha}(R2)-X ->[\\text{alc. KOH, } \\Delta] R2C=CR2 + BH + X-}",
    catalysts: ["Strong base: alc. $\\text{KOH},\\; \\Delta$ (Zaitsev)", "Bulky base: $t\\text{-BuO}^-\\text{K}^+$ (Hofmann)"],
    build() {
      return compileReactionScene({
        title: "E2 Reaction Mechanism (Bimolecular β-Elimination)",
        subtitle: "Single-step concerted anti-periplanar (180°) geometry · Rate = k[R–X][Base]",
        equation: "B:⁻ + H–Cβ(R₂)–Cα(R₂)–X  ⟶  R₂C=CR₂ (Zaitsev alkene) + BH + X⁻",
        stages: [
          {
            title: "1. Anti-Periplanar β-H Attack",
            tone: "blue",
            molecules: [
              { type: "formula", rx: 0.16, ry: 0.25, text: "RO:⁻", color: "#dc2626", size: 15, lonePair: "right" },
              { type: "formula", rx: 0.56, ry: 0.24, text: "H", color: "#0f172a", size: 15 },
              { type: "formula", rx: 0.56, ry: 0.48, text: "Cβ – Cα", color: "#0f172a", size: 15.5 },
              { type: "formula", rx: 0.74, ry: 0.72, text: "X", color: "#0284c7", size: 15.5 }
            ],
            curvedArrows: [
              { fromRx: 0.25, fromRy: 0.23, toRx: 0.49, toRy: 0.23, arc: -18, kind: "nuc" },
              { fromRx: 0.56, fromRy: 0.30, toRx: 0.56, toRy: 0.43, arc: 18, kind: "nuc" },
              { fromRx: 0.64, fromRy: 0.53, toRx: 0.72, toRy: 0.65, arc: -16, kind: "lg" }
            ],
            note: "Cβ–H and Cα–X must lie anti (180°) in the same plane"
          },
          {
            title: "2. Alkene-like Transition State [‡]",
            tone: "orange",
            molecules: [
              { type: "formula", rx: 0.50, ry: 0.34, text: "[ B···H···Cβ === Cα···X ]‡", color: "#c2410c", size: 13.5, boxed: true, bg: "#fff7ed", border: "#fdba74" },
              { type: "formula", rx: 0.50, ry: 0.62, text: "δ− on Base & Leaving X", color: "#64748b", size: 12 }
            ],
            note: "2nd order kinetics · Primary deuterium isotope effect kH/kD > 1"
          },
          {
            title: "3. Major Alkene Product",
            tone: "green",
            molecules: [
              { type: "alkene", rx: 0.42, ry: 0.46, tl: "R₁", bl: "H", tr: "R₂", br: "H" },
              { type: "formula", rx: 0.84, ry: 0.48, text: "+ BH + X⁻", color: "#475569", size: 12.5 }
            ],
            note: "Alc. KOH → Zaitsev alkene · t-BuO⁻K⁺ → Hofmann alkene"
          }
        ],
        transitions: [
          { type: "forward", above: "Alc. KOH / Δ", below: "anti-180°" },
          { type: "forward", above: "− BH, − X⁻", below: "π-bond forms" }
        ],
        examTrap: "Exam Trap: Bulky bases (t-BuO⁻K⁺) or poor leaving groups (F⁻) favour the less substituted Hofmann alkene over Zaitsev."
      });
    }
  },
  {
    id: "aldol",
    match: /\baldol\b/i,
    title: "Aldol Condensation Mechanism (Dilute Base)",
    caption: "$\\alpha$-proton abstraction forms a resonance-stabilised enolate that attacks a second carbonyl, followed by $E1_{\\text{cb}}$ dehydration to crotonaldehyde.",
    latexEquation: "\\ce{2 CH3CHO ->[\\text{dil. NaOH}] CH3-CH(OH)-CH2-CHO ->[\\Delta,\\; -\\ce{H2O}] CH3-CH=CH-CHO}",
    catalysts: ["Dilute alkali: $10\\%\\text{ NaOH}$ / $\\text{Ba(OH)}_2$", "Heat ($\\Delta$) drives $E1_{\\text{cb}}$ dehydration"],
    build() {
      return compileReactionScene({
        title: "Aldol Condensation Mechanism (Dilute NaOH / Δ)",
        subtitle: "Requires ≥ 1 acidic α-H · Enolate nucleophile · β-Hydroxy carbonyl → α,β-Unsaturated enal",
        equation: "2 CH₃–CH=O  ⟶ (dil. NaOH)  CH₃–CH(OH)–CH₂–CHO  ⟶ (Δ, −H₂O)  CH₃–CH=CH–CHO (Crotonaldehyde)",
        stages: [
          {
            title: "1. α-H Abstraction → Enolate",
            tone: "blue",
            molecules: [
              { type: "formula", rx: 0.20, ry: 0.26, text: "HO:⁻", color: "#dc2626", size: 14 },
              { type: "carbonyl", rx: 0.64, ry: 0.32, left: "H–CH₂", right: "H", top: "O" },
              { type: "formula", rx: 0.50, ry: 0.72, text: "⁻CH₂–CH=O  ⇌  CH₂=CH–O⁻", color: "#1d4ed8", size: 13, boxed: true, bg: "#eff6ff", border: "#93c5fd" }
            ],
            curvedArrows: [
              { fromRx: 0.27, fromRy: 0.22, toRx: 0.35, toRy: 0.27, arc: -18, kind: "nuc" }
            ],
            note: "Resonance-stabilised enolate carbanion (pKa ≈ 17)"
          },
          {
            title: "2. Attack on 2nd Carbonyl",
            tone: "orange",
            molecules: [
              { type: "carbonyl", rx: 0.36, ry: 0.34, left: "CH₃", right: "H", top: "O", deltaC: "δ+" },
              { type: "formula", rx: 0.78, ry: 0.40, text: "⁻CH₂–CHO", color: "#dc2626", size: 13 },
              { type: "formula", rx: 0.50, ry: 0.74, text: "CH₃–CH(O⁻)–CH₂–CHO", color: "#c2410c", size: 13, boxed: true, bg: "#fff7ed", border: "#fdba74" }
            ],
            curvedArrows: [
              { fromRx: 0.67, fromRy: 0.44, toRx: 0.42, toRy: 0.38, arc: 22, kind: "nuc" },
              { fromRx: 0.36, fromRy: 0.22, toRx: 0.36, toRy: 0.14, arc: 16, kind: "lg" }
            ],
            note: "New C–C σ-bond forms → Protonation gives Aldol"
          },
          {
            title: "3. Δ Dehydration (E1cb)",
            tone: "green",
            molecules: [
              { type: "formula", rx: 0.50, ry: 0.24, text: "CH₃–CH(OH)–CH₂–CHO", color: "#1d4ed8", size: 13, boxed: true },
              { type: "alkene", rx: 0.50, ry: 0.62, tl: "CH₃", bl: "H", tr: "CHO", br: "H", caption: "α,β-Unsaturated Enal (major)" }
            ],
            note: "Conjugated π-system drives irreversible loss of H₂O"
          }
        ],
        transitions: [
          { type: "eq", above: "dil. NaOH", below: "− H₂O" },
          { type: "forward", above: "H₂O / Δ", below: "− OH⁻ (E1cb)" }
        ],
        examTrap: "Exam Trap: Aldehydes without α-H (HCHO, ArCHO, Me₃C–CHO) do NOT give Aldol; with conc. NaOH they undergo Cannizzaro reaction."
      });
    }
  },
  {
    id: "cannizzaro",
    match: /\bcannizzaro\b/i,
    title: "Cannizzaro Reaction (Base-Induced Disproportionation)",
    caption: "Non-enolisable aldehydes (no $\\alpha\\text{-H}$) undergo nucleophilic $\\text{OH}^-$ addition and rate-determining hydride ($\\text{H}^-$) transfer in conc. $\\text{NaOH}$.",
    latexEquation: "\\ce{2 Ar-CHO + conc. NaOH -> Ar-CH2OH + Ar-COO^-Na^+}",
    catalysts: ["$50\\%$ conc. $\\text{NaOH}$ or $\\text{KOH}$", "RDS: Intermolecular hydride ($\\text{H}^-$) shift"],
    build() {
      return compileReactionScene({
        title: "Cannizzaro Reaction (Aldehydes Lacking α-Hydrogen)",
        subtitle: "Concentrated alkali (50% NaOH) · Hydride transfer (RDS) · Self oxidation & reduction",
        equation: "2 Ar–CHO + conc. NaOH  ⟶  Ar–CH₂OH (Alcohol, reduced) + Ar–COO⁻Na⁺ (Carboxylate, oxidised)",
        stages: [
          {
            title: "1. OH⁻ Attack on Ar–CHO",
            tone: "blue",
            molecules: [
              { type: "benzene", rx: 0.34, ry: 0.48, r: 28, aromatic: "circle", subs: { topRight: "CH=O" } },
              { type: "formula", rx: 0.80, ry: 0.34, text: "HO:⁻", color: "#dc2626", size: 15.5 }
            ],
            curvedArrows: [
              { fromRx: 0.72, fromRy: 0.30, toRx: 0.56, toRy: 0.34, arc: -20, kind: "nuc" }
            ],
            note: "No α-H present → Enolate cannot form"
          },
          {
            title: "2. Direct Hydride (H:⁻) Shift",
            tone: "orange",
            molecules: [
              { type: "benzene", rx: 0.30, ry: 0.54, r: 24, aromatic: "circle", subs: { topRight: "CH(O⁻)OH" } },
              { type: "formula", rx: 0.50, ry: 0.22, text: "H:⁻ shift (RDS)", color: "#dc2626", size: 12, boxed: true, bg: "#fef2f2", border: "#fca5a5" },
              { type: "carbonyl", rx: 0.76, ry: 0.56, left: "Ar", right: "H", top: "O", deltaC: "δ+" }
            ],
            curvedArrows: [
              { fromRx: 0.48, fromRy: 0.30, toRx: 0.72, toRy: 0.50, arc: -22, kind: "nuc" }
            ],
            note: "Slow intermolecular hydride transfer (no free H⁻ in soln)"
          },
          {
            title: "3. Rapid Proton Exchange",
            tone: "green",
            molecules: [
              { type: "benzene", rx: 0.28, ry: 0.48, r: 25, aromatic: "circle", subs: { top: "CH₂OH" }, ringName: "Alcohol" },
              { type: "formula", rx: 0.50, ry: 0.48, text: "+", color: "#475569", size: 17 },
              { type: "benzene", rx: 0.72, ry: 0.48, r: 25, aromatic: "circle", subs: { top: "COO⁻Na⁺" }, ringName: "Carboxylate" }
            ],
            note: "Acidification converts R–COO⁻ → R–COOH"
          }
        ],
        transitions: [
          { type: "forward", above: "50% NaOH", below: "tetrahedral" },
          { type: "forward", above: "H⁺ shift", below: "fast" }
        ],
        examTrap: "Exam Trap: In Crossed Cannizzaro between HCHO and PhCHO, HCHO is preferentially oxidised to HCOO⁻ while PhCHO reduces to PhCH₂OH."
      });
    }
  },
  {
    id: "eas",
    match: /\belectrophilic aromatic\b|\bnitration\b|\bfriedel[- ]?crafts\b|\bsulphonation\b|\bbromination of benzene\b|\barene\b|\barenium\b/i,
    title: "Electrophilic Aromatic Substitution (EAS) on Benzene",
    caption: "Aromatic $\\pi$-electrons attack electrophile $\\text{E}^+$ (e.g. $\\ce{NO2+}$ / $\\ce{RCO+}$) via an $sp^3$-hybridised arenium $\\sigma$-complex, then base restores aromaticity.",
    latexEquation: "\\ce{C6H6 + E+ ->[\\text{Slow (RDS)}] [C6H6E]+ ->[\\text{Base } (:B^-)] C6H5-E + B-H}",
    catalysts: ["Nitration: conc. $\\ce{HNO3 + H2SO4}$", "Friedel–Crafts: $\\text{R-X} / \\text{Anhy. AlCl}_3$"],
    build() {
      return compileReactionScene({
        title: "Electrophilic Aromatic Substitution (Nitration / Friedel–Crafts / Halogenation)",
        subtitle: "Stepwise Arenium Ion (Wheland σ-complex) Mechanism · Aromaticity Restored",
        equation: "C₆H₆ + E⁺ (e.g. NO₂⁺, RCO⁺, Cl⁺) + B:⁻  ⟶  [C₆H₆E]⁺ (σ-complex)  ⟶  C₆H₅–E + B–H",
        stages: [
          {
            title: "1. π-Bond Attack on E⁺ (RDS)",
            tone: "blue",
            molecules: [
              { type: "benzene", rx: 0.40, ry: 0.48, r: 34, aromatic: "kekule" },
              { type: "formula", rx: 0.80, ry: 0.28, text: "E⁺", color: "#dc2626", size: 17, boxed: true, bg: "#fef2f2", border: "#fca5a5" },
              { type: "formula", rx: 0.78, ry: 0.64, text: "(NO₂⁺ / RCO⁺)", color: "#64748b", size: 11.5 }
            ],
            curvedArrows: [
              { fromRx: 0.48, fromRy: 0.34, toRx: 0.73, toRy: 0.28, arc: -24, kind: "nuc" }
            ],
            note: "Aromaticity temporarily lost in slow C–E bond formation"
          },
          {
            title: "2. Arenium σ-Complex (Resonance)",
            tone: "orange",
            molecules: [
              { type: "arenium", rx: 0.46, ry: 0.54, r: 34, subs: { gemTop: ["H", "E"] } },
              { type: "formula", rx: 0.80, ry: 0.28, text: ":B⁻", color: "#0284c7", size: 15 }
            ],
            curvedArrows: [
              { fromRx: 0.74, fromRy: 0.24, toRx: 0.38, toRy: 0.22, arc: -20, kind: "nuc" }
            ],
            note: "Positive charge delocalised across ortho & para ring carbons"
          },
          {
            title: "3. Deprotonation → Substituted Ring",
            tone: "green",
            molecules: [
              { type: "benzene", rx: 0.45, ry: 0.52, r: 34, aromatic: "circle", subs: { top: { label: "E", color: "#dc2626" } }, ringName: "C₆H₅–E (Aromatic)" },
              { type: "formula", rx: 0.82, ry: 0.48, text: "+ B–H", color: "#475569", size: 14 }
            ],
            note: "Fast rearomatisation · Kinetic isotope effect generally absent"
          }
        ],
        transitions: [
          { type: "forward", above: "Slow (RDS)", below: "HNO₃/H₂SO₄" },
          { type: "forward", above: "Fast (−H⁺)", below: "HSO₄⁻ / AlCl₄⁻" }
        ],
        examTrap: "Exam Trap: –OH, –NH₂, –OR, –R are o/p-directing activators; –NO₂, –CHO, –COOH, –CN are meta-directing deactivators; Halogens (–Cl/–Br) are o/p-directing DEACTIVATORS."
      });
    }
  },
  {
    id: "reimer-tiemann",
    match: /\breimer[- ]?tiemann\b|salicylaldehyde|dichlorocarbene/i,
    title: "Reimer–Tiemann Reaction (Formylation of Phenol)",
    caption: "Phenol treated with $\\ce{CHCl3}$ and aq. $\\ce{NaOH}$ generates electrophilic $\\ce{:CCl2}$ carbene, yielding salicylaldehyde ($o$-hydroxybenzaldehyde).",
    latexEquation: "\\ce{C6H5OH + CHCl3 + 3 NaOH ->[340\\text{ K}][\\text{then } H3O^+] o\\text{-}HO-C6H4-CHO + 3 NaCl + 2 H2O}",
    catalysts: ["Reagent: $\\ce{CHCl3 + aq. NaOH}$ ($340\\text{ K}$)", "Electrophile: Neutral singlet carbene $\\ce{:CCl2}$"],
    build() {
      return compileReactionScene({
        title: "Reimer–Tiemann Reaction (Electrophile = :CCl₂ Carbene)",
        subtitle: "Phenol + CHCl₃ / aq. NaOH (340 K) → Salicylaldehyde (major ortho isomer)",
        equation: "C₆H₅OH + CHCl₃ + 3 NaOH  ⟶ (H₃O⁺)  o-HO–C₆H₄–CHO (Salicylaldehyde) + 3 NaCl + 2 H₂O",
        stages: [
          {
            title: "1. Phenoxide + :CCl₂ Carbene",
            tone: "blue",
            molecules: [
              { type: "benzene", rx: 0.36, ry: 0.52, r: 30, aromatic: "kekule", subs: { top: { label: "O⁻Na⁺", color: "#dc2626" } } },
              { type: "formula", rx: 0.80, ry: 0.30, text: ":CCl₂", color: "#dc2626", size: 15.5, boxed: true, bg: "#fef2f2", border: "#fca5a5" },
              { type: "formula", rx: 0.80, ry: 0.52, text: "(neutral E⁺)", color: "#64748b", size: 11 }
            ],
            curvedArrows: [
              { fromRx: 0.53, fromRy: 0.38, toRx: 0.72, toRy: 0.30, arc: -20, kind: "nuc" }
            ],
            note: "CHCl₃ + OH⁻ → ⁻CCl₃ → :CCl₂ (6 e⁻ neutral electrophile)"
          },
          {
            title: "2. Benzal Chloride Intermediate",
            tone: "orange",
            molecules: [
              { type: "benzene", rx: 0.45, ry: 0.54, r: 30, aromatic: "circle", subs: { top: "O⁻Na⁺", topRight: "CHCl₂" } }
            ],
            note: "Rearomatisation then SN2 hydrolysis replaces both Cl atoms"
          },
          {
            title: "3. Salicylaldehyde (Acid Workup)",
            tone: "green",
            molecules: [
              { type: "benzene", rx: 0.45, ry: 0.52, r: 31, aromatic: "circle", subs: { top: { label: "OH", color: "#047857" }, topRight: { label: "CHO", color: "#1d4ed8" } }, ringName: "2-Hydroxybenzaldehyde" }
            ],
            note: "Intramolecular H-bond stabilises ortho isomer as major"
          }
        ],
        transitions: [
          { type: "forward", above: "CHCl₃ / NaOH", below: "340 K" },
          { type: "forward", above: "2 OH⁻, H₃O⁺", below: "hydrolysis" }
        ],
        examTrap: "Exam Trap: Replacing CHCl₃ with CCl₄ in Reimer–Tiemann yields Salicylic Acid (–COOH) instead of Salicylaldehyde (–CHO)."
      });
    }
  },
  {
    id: "kolbe",
    match: /\bkolbe\b(?!['’]?s?\s+electrolys)|kolbe[- ]?schmitt|salicylic acid/i,
    title: "Kolbe's Reaction (Carboxylation of Phenoxide)",
    caption: "Sodium phenoxide reacts with weak electrophile $\\ce{CO2}$ under heat & pressure ($400\\text{ K}, 4\\text{–}7\\text{ atm}$) followed by $\\text{H}^+$ to form salicylic acid.",
    latexEquation: "\\ce{C6H5O^-Na^+ + CO2 ->[400\\text{ K},\\; 4\\text{–}7\\text{ atm}] ->[H3O^+] o\\text{-}HO-C6H4-COOH}",
    catalysts: ["Reagent: $\\ce{CO2}$ ($400\\text{ K},\\; 4\\text{–}7\\text{ atm}$), then $\\ce{H3O+}$"],
    build() {
      return compileReactionScene({
        title: "Kolbe–Schmitt Reaction (Phenol → Salicylic Acid)",
        subtitle: "Sodium phenoxide activates ring toward weak CO₂ electrophile",
        equation: "C₆H₅OH  ⟶ (NaOH)  C₆H₅O⁻Na⁺  ⟶ (CO₂, 400K / H⁺)  o-HO–C₆H₄–COOH (Salicylic Acid)",
        stages: [
          {
            title: "1. Sodium Phenoxide Formation",
            tone: "blue",
            molecules: [
              { type: "benzene", rx: 0.46, ry: 0.52, r: 30, aromatic: "kekule", subs: { top: { label: "O⁻Na⁺", color: "#dc2626" } } },
              { type: "formula", rx: 0.84, ry: 0.32, text: "O=C=O", color: "#0284c7", size: 13 }
            ],
            curvedArrows: [
              { fromRx: 0.62, fromRy: 0.40, toRx: 0.78, toRy: 0.34, arc: -20, kind: "nuc" }
            ],
            note: "Phenoxide (–O⁻) is far more activating than neutral phenol"
          },
          {
            title: "2. Ortho Carboxylate Intermediate",
            tone: "orange",
            molecules: [
              { type: "benzene", rx: 0.46, ry: 0.52, r: 30, aromatic: "circle", subs: { top: "OH", topRight: "COO⁻Na⁺" } }
            ],
            note: "Na⁺ chelates ortho carboxylate and phenoxide oxygens"
          },
          {
            title: "3. Salicylic Acid (H₃O⁺ Workup)",
            tone: "green",
            molecules: [
              { type: "benzene", rx: 0.46, ry: 0.52, r: 30, aromatic: "circle", subs: { top: { label: "OH", color: "#047857" }, topRight: { label: "COOH", color: "#1d4ed8" } }, ringName: "2-Hydroxybenzoic Acid" }
            ],
            note: "Acetylation with (CH₃CO)₂O produces Aspirin"
          }
        ],
        transitions: [
          { type: "forward", above: "CO₂, 400 K", below: "4–7 atm" },
          { type: "forward", above: "H₃O⁺", below: "acidify" }
        ],
        examTrap: "Exam Trap: With K⁺ salt (KOH) at higher temperature, the less sterically hindered para-hydroxybenzoic acid becomes major."
      });
    }
  },
  {
    id: "williamson",
    match: /\bwilliamson\b|ether synthesis/i,
    title: "Williamson Ether Synthesis (SN2 Alkoxide Pathway)",
    caption: "Nucleophilic $S_N2$ attack of sodium alkoxide ($\\ce{R-O^-}$) on an unhindered primary alkyl halide ($\\ce{R'-X}$) yielding $\\ce{R-O-R'}$.",
    latexEquation: "\\ce{R-O^-Na^+ + R'-CH2-X ->[S_N2] R-O-CH2-R' + NaX}",
    catalysts: ["Use $3^\\circ$ alkoxide $+$ $1^\\circ$ halide", "Never $3^\\circ$ halide (undergoes E2 alkene)"],
    build() {
      return compileReactionScene({
        title: "Williamson Ether Synthesis (SN2 Alkoxide + 1° Halide)",
        subtitle: "Use 3° alkoxide + 1° halide for unsymmetrical ethers · Avoid 3° halides (give E2 alkene)",
        equation: "R–O⁻Na⁺ + R'–CH₂–X (1° halide)  ⟶  R–O–CH₂–R' (Ether) + NaX",
        stages: [
          {
            title: "1. Alkoxide Nucleophile + 1° R'–X",
            tone: "blue",
            molecules: [
              { type: "formula", rx: 0.20, ry: 0.48, text: "R–O:⁻", color: "#dc2626", size: 16, lonePair: "right" },
              { type: "tetrahedral", rx: 0.64, ry: 0.48, top: "R'", wedge: "H", dash: "H", right: "X", delta: "δ+" }
            ],
            curvedArrows: [
              { fromRx: 0.31, fromRy: 0.42, toRx: 0.57, toRy: 0.44, arc: -26, kind: "nuc" },
              { fromRx: 0.72, fromRy: 0.45, toRx: 0.85, toRy: 0.42, arc: -20, kind: "lg" }
            ],
            note: "Unhindered backside approach on primary Cα"
          },
          {
            title: "2. Symmetrical / Mixed Ether",
            tone: "green",
            molecules: [
              { type: "formula", rx: 0.46, ry: 0.36, text: "(CH₃)₃C – O – CH₃", color: "#047857", size: 16.5, boxed: true, bg: "#ecfdf5", border: "#6ee7b7" },
              { type: "formula", rx: 0.46, ry: 0.64, text: "From: (CH₃)₃C–O⁻Na⁺  +  CH₃–Br", color: "#1d4ed8", size: 12.5 }
            ],
            note: "Works cleanly with Phenoxide (ArO⁻ + R–X → Ar–O–R)"
          },
          {
            title: "3. Contrast Trap (3° Halide = E2!)",
            tone: "red",
            molecules: [
              { type: "formula", rx: 0.50, ry: 0.24, text: "CH₃O⁻Na⁺ + (CH₃)₃C–Br", color: "#b91c1c", size: 13 },
              { type: "alkene", rx: 0.50, ry: 0.62, tl: "CH₃", bl: "CH₃", tr: "H", br: "H", caption: "Isobutylene (Major E2 Alkene!)" }
            ],
            note: "3° halide undergoes E2 elimination instead of SN2 ether"
          }
        ],
        transitions: [
          { type: "forward", above: "SN2", below: "− NaX" },
          { type: "forward", above: "vs 3° R–X", below: "E2 trap" }
        ],
        examTrap: "Exam Trap: Aryl halides (Ph–Cl) have partial C–X double-bond character and do NOT undergo Williamson synthesis with R–O⁻Na⁺."
      });
    }
  },
  {
    id: "hoffmann",
    match: /\bhoff?mann\b|bromamide/i,
    title: "Hoffmann Bromamide Degradation Reaction",
    caption: "Primary amide reacts with $\\ce{Br2}$ and $4\\text{ mol NaOH}$ via an isocyanate ($\\ce{R-N=C=O}$) to yield a $1^\\circ$ amine with one fewer carbon atom.",
    latexEquation: "\\ce{R-CONH2 + Br2 + 4 NaOH -> R-NH2 + Na2CO3 + 2 NaBr + 2 H2O}",
    catalysts: ["Reagent: $\\ce{Br2 + 4 NaOH}$ (or alc. $\\text{KOH}$)", "Key step: Concerted $[1,2]\\text{-R}$ shift with retention"],
    build() {
      return compileReactionScene({
        title: "Hoffmann Bromamide Degradation (1-Carbon Step-Down)",
        subtitle: "Concerted intramolecular [1,2]-alkyl shift · Complete retention of migrating chiral R*",
        equation: "R–CONH₂ + Br₂ + 4 NaOH  ⟶  R–NH₂ (1° Amine) + Na₂CO₃ + 2 NaBr + 2 H₂O",
        stages: [
          {
            title: "1. N-Bromoamide Anion",
            tone: "blue",
            molecules: [
              { type: "carbonyl", rx: 0.46, ry: 0.46, left: "R", right: "NH₂", top: "O" },
              { type: "formula", rx: 0.50, ry: 0.80, text: "⟶  R–C(=O)–N⁻–Br", color: "#1d4ed8", size: 13 }
            ],
            note: "Base removes N–H, then Br₂ forms N–Br intermediate"
          },
          {
            title: "2. Concerted [1,2]-R Shift → Isocyanate",
            tone: "orange",
            molecules: [
              { type: "formula", rx: 0.50, ry: 0.34, text: "R – N = C = O", color: "#c2410c", size: 16, boxed: true, bg: "#fff7ed", border: "#fdba74" },
              { type: "formula", rx: 0.50, ry: 0.64, text: "Isocyanate (No free nitrene)", color: "#475569", size: 12 }
            ],
            note: "R migrates with its e⁻ pair as Br⁻ departs simultaneously"
          },
          {
            title: "3. Hydrolysis & −CO₂ → 1° Amine",
            tone: "green",
            molecules: [
              { type: "formula", rx: 0.50, ry: 0.38, text: "R – NH₂", color: "#047857", size: 17.5, boxed: true, bg: "#ecfdf5", border: "#6ee7b7" },
              { type: "formula", rx: 0.50, ry: 0.68, text: "+ CO₃²⁻ + 2 Br⁻", color: "#64748b", size: 13 }
            ],
            note: "Works cleanly for both alkyl & aryl (PhCONH₂ → PhNH₂)"
          }
        ],
        transitions: [
          { type: "forward", above: "Br₂ / OH⁻", below: "− H₂O" },
          { type: "forward", above: "2 OH⁻ / Δ", below: "− CO₃²⁻" }
        ],
        examTrap: "Exam Trap: Chiral R* group migrates with 100% RETENTION of configuration; carbonyl C is lost as CO₃²⁻ (1 carbon less)."
      });
    }
  },
  {
    id: "sandmeyer",
    match: /\bsandmeyer\b|\bgattermann\b/i,
    title: "Sandmeyer Reaction Mechanism: Arenediazonium Salt → Aryl Halide",
    caption: "Cu(I)-catalysed Single Electron Transfer (SET) reduces $\\ce{Ar-N2+}$ releasing $\\ce{N2(g)}$ to form an aryl radical $\\ce{Ar^\\bullet}$, followed by halide ligand transfer from $\\ce{[CuX2]}$: $\\ce{Ar-N2+X- ->[\\ce{Cu2X2 / HX}] Ar-X + N2 ^}$.",
    latexEquation: "\\ce{Ar-N2+Cl- + CuCl ->[\\text{HCl}] Ar-Cl + N2 ^ + CuCl}",
    catalysts: ["Catalyst: $\\ce{CuCl/HCl}$, $\\ce{CuBr/HBr}$, or $\\ce{CuCN/KCN}$", "Intermediate: Aryl free radical $\\text{Ar}^\\bullet$ (via Cu(I) SET)"],
    build() {
      return compileReactionScene({
        title: "Sandmeyer Reaction Mechanism (Cu(I) SET Pathway)",
        subtitle: "Single Electron Transfer from [CuCl₂]⁻ · N₂(g) Loss · Aryl Radical Ligand Transfer",
        equation: "Ar–N₂⁺Cl⁻  ⟶ (CuCl / HCl, 273–298 K)  Ar–Cl + N₂(g)↑ + CuCl",
        stages: [
          {
            title: "1. Diazonium Salt + [CuCl₂]⁻ (SET)",
            tone: "blue",
            molecules: [
              { type: "benzene", rx: 0.34, ry: 0.56, r: 34, aromatic: "circle", subs: { top: { label: "N≡N⁺", color: "#dc2626" } }, ringName: "Arenediazonium" },
              { type: "formula", rx: 0.77, ry: 0.28, text: "[CuCl₂]⁻", color: "#1d4ed8", size: 13.5, boxed: true, bg: "#eff6ff", border: "#93c5fd", sub: "e⁻ donor" }
            ],
            curvedArrows: [
              { fromRx: 0.66, fromRy: 0.25, toRx: 0.44, toRy: 0.23, arc: -24, kind: "nuc" }
            ],
            note: "Cu(I) transfers 1e⁻ into π* of −N≡N⁺, expelling N₂(g)"
          },
          {
            title: "2. Aryl Radical Ar• + Cu(II)Cl₂",
            tone: "orange",
            molecules: [
              { type: "benzene", rx: 0.34, ry: 0.56, r: 34, aromatic: "circle", subs: { top: "•" }, ringName: "sp² σ-radical" },
              { type: "formula", rx: 0.76, ry: 0.28, text: "CuᴵᴵCl₂", color: "#c2410c", size: 13.5, boxed: true, bg: "#fff7ed", border: "#fdba74", sub: "Cl• transfer" }
            ],
            curvedArrows: [
              { fromRx: 0.43, fromRy: 0.22, toRx: 0.66, toRy: 0.26, arc: -22, kind: "lg" }
            ],
            note: "Ar• abstracts Cl ligand from CuCl₂ · Cu(I) regenerated"
          },
          {
            title: "3. Aryl Halide Product + N₂↑",
            tone: "green",
            molecules: [
              { type: "benzene", rx: 0.36, ry: 0.54, r: 34, aromatic: "circle", showLonePairs: true, subs: { top: { label: "Cl", color: "#047857" } }, ringName: "Chlorobenzene" },
              { type: "formula", rx: 0.78, ry: 0.50, text: "+ N₂(g)↑", color: "#475569", size: 13, sub: "CuCl catalyst" }
            ],
            note: "Fast radical coupling gives Ar–Cl/Br/CN (F uses Balz–Schiemann)"
          }
        ],
        transitions: [
          { type: "forward", above: "− N₂(g)↑", below: "Cu(I) → Cu(II)" },
          { type: "forward", above: "Cl• transfer", below: "− CuCl" }
        ],
        examTrap: "Exam Trap: Sandmeyer uses Cu(I) salts (CuCl/HCl, CuBr/HBr, CuCN/KCN); Gattermann uses Cu powder/HX (lower yield). Ar–I uses KI directly without Cu(I)."
      });
    }
  },
  {
    id: "diazotisation",
    match: /\bdiazot|azo coupling|diazonium/i,
    title: "Diazotisation & Sandmeyer / Azo Coupling Pathway",
    caption: "Aniline with $\\ce{NaNO2 + HCl}$ at $273\\text{–}278\\text{ K}$ yields benzene diazonium chloride, enabling Sandmeyer halogenation or electrophilic azo dye coupling.",
    latexEquation: "\\ce{C6H5-NH2 + NaNO2 + 2 HCl ->[273\\text{–}278\\text{ K}] C6H5-N2+Cl- ->[\\ce{Cu2X2 / HX}] C6H5-X + N2 ^}",
    catalysts: ["Diazotisation: $\\ce{NaNO2 + HCl}$ at $0\\text{–}5^\\circ\\text{C}$", "Sandmeyer: $\\ce{Cu2Cl2/HCl}$ or $\\ce{Cu2Br2/HBr}$"],
    build() {
      return compileReactionScene({
        title: "Diazotisation of Aniline & Sandmeyer / Azo Coupling",
        subtitle: "Cold Nitrous Acid (NaNO₂ + 2 HCl, 0–5 °C) · Versatile Arenediazonium Synthons",
        equation: "C₆H₅–NH₂ + NaNO₂ + 2 HCl  ⟶ (0–5 °C)  C₆H₅–N₂⁺Cl⁻ + NaCl + 2 H₂O",
        stages: [
          {
            title: "1. Cold Diazotisation (0–5 °C)",
            tone: "blue",
            molecules: [
              { type: "benzene", rx: 0.48, ry: 0.52, r: 31, aromatic: "circle", subs: { top: { label: "NH₂", color: "#1d4ed8" } }, ringName: "Aniline" }
            ],
            note: "Must stay 273–278 K (>5 °C hydrolyses diazonium → phenol)"
          },
          {
            title: "2. Benzene Diazonium Chloride",
            tone: "orange",
            molecules: [
              { type: "benzene", rx: 0.48, ry: 0.54, r: 31, aromatic: "circle", subs: { top: { label: "N≡N⁺Cl⁻", color: "#dc2626" } }, ringName: "Coupling E⁺ / Synthons" }
            ],
            note: "Excellent N₂ leaving group (N≡N gas drives reactions)"
          },
          {
            title: "3. Sandmeyer & Azo Dye Coupling",
            tone: "green",
            molecules: [
              { type: "benzene", rx: 0.28, ry: 0.50, r: 25, aromatic: "circle", subs: { top: { label: "Cl / Br", color: "#047857" } }, ringName: "Cu₂X₂/HX" },
              { type: "benzene", rx: 0.72, ry: 0.50, r: 25, aromatic: "circle", subs: { top: "N=N–Ar", bottom: "OH" }, ringName: "Orange Azo Dye" }
            ],
            note: "Couples at para-position of Phenol (pH 9–10) / Aniline (pH 4–5)"
          }
        ],
        transitions: [
          { type: "forward", above: "NaNO₂ + HCl", below: "273–278 K" },
          { type: "forward", above: "Cu₂X₂ or", below: "Phenol/OH⁻" }
        ],
        examTrap: "Exam Trap: Aliphatic primary amines (R–NH₂) form unstable R–N₂⁺ that immediately release N₂ + carbocation → alcohols/rearranged alkenes."
      });
    }
  },
  {
    id: "grignard",
    match: /\bgrignard\b|\brmgx\b|organomagnesium/i,
    title: "Grignard Reagent Nucleophilic Addition to Carbonyls",
    caption: "Polarised $\\text{R}^{\\delta-}\\text{–MgX}^{\\delta+}$ attacks carbonyl carbon $\\text{C}^{\\delta+}=\\text{O}^{\\delta-}$ to form an alkoxide adduct, which protonates on acidic workup ($\\ce{H3O+}$) to an alcohol.",
    latexEquation: "\\ce{R'-MgX + R^1R^2C=O ->[\\text{Dry Ether}] R^1R^2(R')C-O^-Mg^{2+}X ->[H3O^+] R^1R^2(R')C-OH}",
    catalysts: ["Solvent: Strictly anhydrous dry ether", "Workup: Dilute aqueous $\\ce{H3O+}$"],
    build() {
      return compileReactionScene({
        title: "Grignard Addition to Aldehydes & Ketones (Dry Ether)",
        subtitle: "R–MgX acts as carbanion source (Rδ⁻) · Strictly anhydrous conditions",
        equation: "R'–MgX + R¹R²C=O  ⟶ (dry ether)  R¹R²(R')C–O⁻Mg²⁺X  ⟶ (H₃O⁺)  R¹R²(R')C–OH",
        stages: [
          {
            title: "1. Carbanion Attack (Rδ⁻ → Cδ+)",
            tone: "blue",
            molecules: [
              { type: "formula", rx: 0.22, ry: 0.56, text: "R'δ⁻–MgXδ⁺", color: "#dc2626", size: 13.5 },
              { type: "carbonyl", rx: 0.70, ry: 0.48, left: "R¹", right: "R²", top: "O", deltaC: "δ+", deltaO: "δ−" }
            ],
            curvedArrows: [
              { fromRx: 0.34, fromRy: 0.50, toRx: 0.63, toRy: 0.48, arc: -26, kind: "nuc" },
              { fromRx: 0.70, fromRy: 0.36, toRx: 0.70, toRy: 0.25, arc: 18, kind: "lg" }
            ],
            note: "HCHO → 1° alcohol · RCHO → 2° · RCOR → 3°"
          },
          {
            title: "2. Magnesium Alkoxide Adduct",
            tone: "orange",
            molecules: [
              { type: "tetrahedral", rx: 0.46, ry: 0.52, top: "O⁻MgX⁺", wedge: "R¹", dash: "R²", right: "R'", rightColor: "#dc2626" }
            ],
            note: "New C–C bond formed · Quenched with dilute aqueous acid"
          },
          {
            title: "3. Alcohol Product (H₃O⁺)",
            tone: "green",
            molecules: [
              { type: "tetrahedral", rx: 0.42, ry: 0.52, top: "OH", wedge: "R¹", dash: "R²", right: "R'", rightColor: "#047857" },
              { type: "formula", rx: 0.84, ry: 0.50, text: "+ Mg(OH)X", color: "#64748b", size: 12 }
            ],
            note: "Esters & acyl chlorides consume 2 eq. RMgX → 3° alcohol"
          }
        ],
        transitions: [
          { type: "forward", above: "Dry Ether", below: "anhydrous" },
          { type: "forward", above: "H₃O⁺", below: "hydrolysis" }
        ],
        examTrap: "Exam Trap: Active H donors (H₂O, ROH, RCOOH, NH₃, RC≡CH) destroy RMgX via acid-base reaction yielding alkane R'–H!"
      });
    }
  },
  {
    id: "esterification",
    match: /\besterification\b|\bfischer\b/i,
    title: "Fischer Esterification (Acid-Catalysed)",
    caption: "Protonation of carboxylic acid carbonyl enables nucleophilic alcohol attack via a tetrahedral intermediate; $\\text{O–H}$ bond of alcohol stays intact ($^{18}\\text{O}$ stays in ester).",
    latexEquation: "\\ce{R-COOH + R'-^{18}OH <=>[\\text{conc. } H2SO4] R-COO^{18}R' + H2O}",
    catalysts: ["Catalyst: Conc. $\\ce{H2SO4}$ or dry $\\ce{HCl}$ gas"],
    build() {
      return compileReactionScene({
        title: "Fischer Esterification Mechanism (Reversible H⁺ Catalysis)",
        subtitle: "Acyl C–O cleavage · Isotopic ¹⁸O tracing confirms ester –OR' comes from Alcohol",
        equation: "R–COOH + R'–¹⁸OH  ⇌ (conc. H₂SO₄)  R–COO¹⁸R' + H₂O",
        stages: [
          {
            title: "1. Carbonyl Activation & R'OH Attack",
            tone: "blue",
            molecules: [
              { type: "carbonyl", rx: 0.42, ry: 0.42, left: "R", right: "OH", top: "OH⁺", deltaC: "δ+" },
              { type: "formula", rx: 0.80, ry: 0.62, text: "R'–¹⁸OH", color: "#dc2626", size: 14 }
            ],
            curvedArrows: [
              { fromRx: 0.72, fromRy: 0.56, toRx: 0.48, toRy: 0.42, arc: 22, kind: "nuc" }
            ],
            note: "Protonation boosts electrophilicity of carbonyl carbon"
          },
          {
            title: "2. Tetrahedral Intermediate",
            tone: "orange",
            molecules: [
              { type: "tetrahedral", rx: 0.46, ry: 0.52, top: "OH", wedge: "OH₂⁺", dash: "¹⁸OR'", right: "R" }
            ],
            note: "Proton transfer converts one –OH into –OH₂⁺ leaving group"
          },
          {
            title: "3. Ester + H₂O Eliminated",
            tone: "green",
            molecules: [
              { type: "carbonyl", rx: 0.42, ry: 0.48, left: "R", right: "¹⁸OR'", top: "O" },
              { type: "formula", rx: 0.84, ry: 0.48, text: "+ H₂O", color: "#0284c7", size: 14 }
            ],
            note: "Reversible: excess alcohol or H₂O removal drives yield right"
          }
        ],
        transitions: [
          { type: "eq", above: "conc. H₂SO₄", below: "protonation" },
          { type: "eq", above: "− H₂O", below: "− H⁺" }
        ],
        examTrap: "Exam Trap: Alcohol Reactivity Order: CH₃OH > 1° > 2° > 3° (steric control); Acid order: HCOOH > CH₃COOH > RCH₂COOH > R₃CCOOH."
      });
    }
  },
  {
    id: "markovnikov",
    match: /\bmarkovnikov\b|\bkharasch\b|\bperoxide effect\b|anti[- ]?markovnikov/i,
    title: "Markovnikov Addition vs. Peroxide (Kharasch) Effect",
    caption: "Ionic $\\ce{HBr}$ addition proceeds via the more stable $2^\\circ$ carbocation; peroxide ($\\ce{ROOR}$) switches $\\ce{HBr}$ to a free-radical chain giving the anti-Markovnikov bromide.",
    latexEquation: "\\ce{CH3-CH=CH2 + HBr -> CH3-CH(Br)-CH3} \\quad | \\quad \\ce{+ HBr ->[\\text{ROOR}] CH3-CH2-CH2-Br}",
    catalysts: ["Ionic: No peroxide ($2^\\circ$ carbocation)", "Peroxide (Kharasch): ONLY with $\\ce{HBr + ROOR}$"],
    build() {
      return compileReactionScene({
        title: "Markovnikov vs Anti-Markovnikov (Peroxide Effect)",
        subtitle: "Ionic Carbocation Route vs Free-Radical Chain Route (Only for HBr + ROOR)",
        equation: "CH₃–CH=CH₂ + HBr ⟶ CH₃–CH(Br)–CH₃ (Major)  |  + HBr/ROOR ⟶ CH₃–CH₂–CH₂–Br",
        stages: [
          {
            title: "1. Substrate: Propene (π-Bond)",
            tone: "blue",
            molecules: [
              { type: "alkene", rx: 0.48, ry: 0.48, tl: "CH₃", bl: "H", tr: "H", br: "H", caption: "Unsymmetrical Alkene" }
            ],
            note: "π-bond acts as nucleophile toward H⁺ or radical trap for Br•"
          },
          {
            title: "2A. Ionic → 2° C⁺ vs 2B. Radical → 2° C•",
            tone: "orange",
            molecules: [
              { type: "formula", rx: 0.50, ry: 0.28, text: "CH₃–C⁺H–CH₃  (2° Carbocation)", color: "#dc2626", size: 13, boxed: true, bg: "#fff7ed", border: "#fdba74" },
              { type: "formula", rx: 0.50, ry: 0.66, text: "CH₃–C•H–CH₂Br  (2° Free Radical)", color: "#6d28d9", size: 13, boxed: true, bg: "#f5f3ff", border: "#c4b5fd" }
            ],
            note: "Both pathways maximise stability of intermediate on C2"
          },
          {
            title: "3. Regioselective Products",
            tone: "green",
            molecules: [
              { type: "formula", rx: 0.50, ry: 0.28, text: "2-Bromopropane (Markovnikov)", color: "#047857", size: 13, boxed: true, bg: "#ecfdf5", border: "#6ee7b7" },
              { type: "formula", rx: 0.50, ry: 0.66, text: "1-Bromopropane (Peroxide / Kharasch)", color: "#1d4ed8", size: 13, boxed: true, bg: "#eff6ff", border: "#93c5fd" }
            ],
            note: "No rearrangement in radical route; rearrangement possible in ionic"
          }
        ],
        transitions: [
          { type: "forward", above: "HBr / ROOR", below: "fork" },
          { type: "forward", above: "Br⁻ / HBr", below: "fast" }
        ],
        examTrap: "Exam Trap: Peroxide (Kharasch) effect works ONLY with HBr — NEVER with HCl or HI (propagation steps are endothermic for HCl/HI)."
      });
    }
  },
  {
    id: "ozonolysis",
    match: /\bozonolysis\b|\bozonide\b/i,
    title: "Reductive Ozonolysis of Alkenes (O₃, Zn / H₂O)",
    caption: "Cycloaddition of $\\ce{O3}$ across $\\ce{C=C}$ gives molozonide $\\rightarrow$ ozonide trioxolane, cleaved by $\\ce{Zn/H2O}$ into aldehydes and ketones.",
    latexEquation: "\\ce{R^1R^2C=CR^3R^4 + O3 ->[\\ce{CH2Cl2},\\; 196\\text{ K}] \\text{Ozonide} ->[\\ce{Zn / H2O}] R^1R^2C=O + O=CR^3R^4}",
    catalysts: ["Step 1: $\\ce{O3 / CH2Cl2}$ ($-78^\\circ\\text{C}$)", "Step 2: Reductive $\\ce{Zn/H2O}$ or $\\ce{Me2S}$"],
    build() {
      return compileReactionScene({
        title: "Reductive Ozonolysis of Alkenes (C=C → Two Carbonyls)",
        subtitle: "1,3-Dipolar cycloaddition · Reductive workup prevents aldehyde oxidation",
        equation: "R¹R²C=CR³R⁴ + O₃  ⟶ (CH₂Cl₂, −78°C)  Ozonide  ⟶ (Zn / H₂O)  R¹R²C=O + O=CR³R⁴",
        stages: [
          {
            title: "1. Alkene + Ozone (O₃)",
            tone: "blue",
            molecules: [
              { type: "alkene", rx: 0.46, ry: 0.48, tl: "R¹", bl: "R²", tr: "R³", br: "R⁴" },
              { type: "formula", rx: 0.80, ry: 0.22, text: "O=O⁺–O⁻", color: "#0284c7", size: 13 }
            ],
            note: "Syn 1,3-dipolar addition across the double bond"
          },
          {
            title: "2. Ozonide (1,2,4-Trioxolane)",
            tone: "orange",
            molecules: [
              { type: "pentagon", rx: 0.50, ry: 0.50, r: 30, vertexAtoms: ["O", "C", "O", "O", "C"], caption: "C–C bond completely broken" }
            ],
            note: "Rearranges from unstable primary molozonide"
          },
          {
            title: "3. Reductive Cleavage (Zn / H₂O)",
            tone: "green",
            molecules: [
              { type: "carbonyl", rx: 0.28, ry: 0.48, left: "R¹", right: "R²", top: "O" },
              { type: "formula", rx: 0.52, ry: 0.48, text: "+", color: "#475569", size: 17 },
              { type: "carbonyl", rx: 0.76, ry: 0.48, left: "R³", right: "R⁴", top: "O" }
            ],
            note: "Shortcut: Split C=C and cap each C with =O"
          }
        ],
        transitions: [
          { type: "forward", above: "O₃ / CH₂Cl₂", below: "196 K" },
          { type: "forward", above: "Zn / H₂O", below: "or Me₂S" }
        ],
        examTrap: "Exam Trap: Oxidative workup (H₂O₂ without Zn) oxidises aldehyde products further into carboxylic acids (RCOOH) and converts =CH₂ into CO₂."
      });
    }
  },
  {
    id: "clemmensen-wolff",
    match: /\bclemmensen\b|\bwolff[- ]?kishner\b/i,
    title: "Clemmensen vs. Wolff–Kishner Carbonyl Reduction",
    caption: "Both reduce $\\ce{C=O -> -CH2-}$, selected according to acid- or base-sensitivity of neighbouring functional groups.",
    latexEquation: "\\ce{R^1-C(=O)-R^2 ->[\\text{Zn-Hg / conc. HCl} \\;\\text{OR}\\; \\ce{N2H4, KOH / Glycol}] R^1-CH2-R^2 + H2O}",
    catalysts: ["Clemmensen: $\\ce{Zn-Hg / conc. HCl}$ (acidic)", "Wolff–Kishner: $\\ce{N2H4, KOH}$ in ethylene glycol (basic)"],
    build() {
      return compileReactionScene({
        title: "Clemmensen (Acidic) vs Wolff–Kishner (Basic) Reduction",
        subtitle: "Deoxygenation of Aldehydes & Ketones (C=O → CH₂) · Selectivity by Functional Group",
        equation: "R–C(=O)–R'  ⟶ (Zn-Hg/HCl OR N₂H₄/KOH, Δ)  R–CH₂–R' + H₂O",
        stages: [
          {
            title: "1. Carbonyl Starting Material",
            tone: "blue",
            molecules: [
              { type: "carbonyl", rx: 0.50, ry: 0.48, left: "R¹", right: "R²", top: "O", caption: "Aldehyde / Ketone" }
            ],
            note: "Used when molecule contains acid- or base-sensitive groups"
          },
          {
            title: "2. Reagent Selection Gate",
            tone: "orange",
            molecules: [
              { type: "formula", rx: 0.50, ry: 0.30, text: "Clemmensen: Zn–Hg / conc. HCl", color: "#b91c1c", size: 12.5, boxed: true, bg: "#fef2f2", border: "#fca5a5", sub: "Avoid if –OH / alkene (acid-sensitive)" },
              { type: "formula", rx: 0.50, ry: 0.68, text: "Wolff–Kishner: N₂H₄, KOH / Glycol", color: "#1d4ed8", size: 12.5, boxed: true, bg: "#eff6ff", border: "#93c5fd", sub: "Avoid if –X / ester (base-sensitive)" }
            ],
            note: "Both stop cleanly at alkane without reducing benzene ring"
          },
          {
            title: "3. Deoxygenated Alkane (–CH₂–)",
            tone: "green",
            molecules: [
              { type: "formula", rx: 0.50, ry: 0.44, text: "R¹ – CH₂ – R²", color: "#047857", size: 17, boxed: true, bg: "#ecfdf5", border: "#6ee7b7" },
              { type: "formula", rx: 0.50, ry: 0.70, text: "+ H₂O (or N₂ + H₂O in WK)", color: "#64748b", size: 12 }
            ],
            note: "Use neutral Raney-Ni / HSCH₂CH₂SH if sensitive to BOTH"
          }
        ],
        transitions: [
          { type: "forward", above: "Choose pH", below: "route" },
          { type: "forward", above: "4[H]", below: "− H₂O" }
        ],
        examTrap: "Exam Trap: In acid (Clemmensen), an alcohol –OH converts to –Cl or dehydrates; in base (Wolff–Kishner), a β-halide undergoes E2 elimination!"
      });
    }
  },
  {
    id: "gabriel",
    match: /\bgabriel\b|\bphthalimide\b/i,
    title: "Gabriel Phthalimide Synthesis (Pure 1° Alkyl Amines)",
    caption: "$\\ce{KOH}$ converts phthalimide to potassium phthalimide, which undergoes clean $S_N2$ alkylation and hydrolysis to pure $1^\\circ$ alkyl amine.",
    latexEquation: "\\ce{Phthalimide + KOH + R-X (1^{\\circ}) -> N-Alkylphthalimide ->[\\ce{aq. NaOH}] R-NH2 + Phthalate^{2-}}",
    catalysts: ["Step 1: $\\text{alc. KOH} + 1^\\circ\\text{ R–X}$ ($S_N2$)", "Fails for Aryl Halides ($\text{C}_6\\text{H}_5\\text{Cl}$)"],
    build() {
      return compileReactionScene({
        title: "Gabriel Phthalimide Synthesis of Pure 1° Aliphatic Amines",
        subtitle: "Avoids 2°/3° amine & quaternary ammonium mixtures · Fails for Aryl Halides",
        equation: "Phthalimide + KOH + R–X (1°)  ⟶  N-Alkylphthalimide  ⟶ (aq. NaOH / N₂H₄)  R–NH₂ (Pure 1° Amine)",
        stages: [
          {
            title: "1. Potassium Phthalimide Formation",
            tone: "blue",
            molecules: [
              { type: "benzene", rx: 0.34, ry: 0.50, r: 27, aromatic: "circle", subs: { topRight: "C(=O)N⁻K⁺", bottomRight: "C(=O)" } },
              { type: "formula", rx: 0.80, ry: 0.38, text: "R–X (1°)", color: "#dc2626", size: 14 }
            ],
            curvedArrows: [
              { fromRx: 0.66, fromRy: 0.36, toRx: 0.78, toRy: 0.36, arc: -18, kind: "nuc" }
            ],
            note: "KOH removes acidic imide proton (pKa ≈ 8.3)"
          },
          {
            title: "2. N-Alkylphthalimide (SN2)",
            tone: "orange",
            molecules: [
              { type: "benzene", rx: 0.38, ry: 0.50, r: 27, aromatic: "circle", subs: { topRight: "C(=O)N–R", bottomRight: "C(=O)" }, ringName: "SN2 Alkylation Product" }
            ],
            note: "3° halides undergo E2; Ar–X cannot do SN2!"
          },
          {
            title: "3. Pure 1° Aliphatic Amine",
            tone: "green",
            molecules: [
              { type: "formula", rx: 0.50, ry: 0.34, text: "R – NH₂  (Pure 1° Amine)", color: "#047857", size: 15, boxed: true, bg: "#ecfdf5", border: "#6ee7b7" },
              { type: "benzene", rx: 0.45, ry: 0.70, r: 21, aromatic: "circle", subs: { topRight: "COO⁻", bottomRight: "COO⁻" } }
            ],
            note: "No contamination by 2°, 3° amines or R₄N⁺X⁻"
          }
        ],
        transitions: [
          { type: "forward", above: "1° R–X", below: "SN2 (−KX)" },
          { type: "forward", above: "aq. NaOH", below: "or N₂H₄" }
        ],
        examTrap: "Exam Trap: Aniline (Ph–NH₂) CANNOT be prepared by Gabriel synthesis because aryl halides do not undergo nucleophilic SN2 substitution under these conditions."
      });
    }
  },
  {
    id: "galvanic",
    match: /\bgalvanic\b|\bdaniell\b|\belectrochemical cell\b|\bsalt bridge\b/i,
    title: "Galvanic (Daniell) Electrochemical Cell Diagram",
    caption: "Spontaneous redox setup ($\\ce{Zn | Zn^{2+} || Cu^{2+} | Cu}$, $E^\\circ_{\\text{cell}} = +1.10\\text{ V}$) showing anode oxidation, cathode reduction, electron flow, and salt bridge migration.",
    latexEquation: "\\ce{Zn(s) + Cu^{2+}(aq) <=> Zn^{2+}(aq) + Cu(s)} \\qquad [E^\\circ_{\\text{cell}} = +1.10\\text{ V}]",
    catalysts: ["Salt bridge: $\\ce{KCl}$ / $\\ce{KNO3}$ in Agar-Agar", "LOAN Rule: Left · Oxidation · Anode · Negative"],
    build() {
      const body = `
        <path d="M 215 190 L 215 138 L 865 138 L 865 190" fill="none" stroke="#0f172a" stroke-width="3"/>
        <circle cx="540" cy="138" r="24" fill="#ffffff" stroke="#0284c7" stroke-width="2.5"/>
        <text x="540" y="143" text-anchor="middle" font-size="13" font-weight="800" fill="#0284c7">1.10 V</text>
        <line x1="275" y1="127" x2="415" y2="127" stroke="#dc2626" stroke-width="2.4" marker-end="url(#arrow-curved-nuc)"/>
        <text x="345" y="120" text-anchor="middle" font-size="12" font-weight="800" fill="#dc2626">e⁻ flow (Anode → Cathode)</text>

        <rect x="92" y="232" width="260" height="190" rx="10" fill="#f0f9ff" stroke="#38bdf8" stroke-width="2"/>
        <rect x="94" y="280" width="256" height="140" rx="8" fill="#e0f2fe"/>
        <rect x="192" y="190" width="46" height="196" rx="4" fill="#64748b" stroke="#334155" stroke-width="2"/>
        <text x="215" y="178" text-anchor="middle" font-size="13.5" font-weight="800" fill="#b91c1c">ANODE (−) Zn</text>
        <text x="148" y="330" font-size="14" font-weight="700" fill="#0369a1">Zn²⁺</text>
        <text x="256" y="362" font-size="14" font-weight="700" fill="#0369a1">SO₄²⁻</text>
        <text x="222" y="452" text-anchor="middle" font-size="13.5" font-weight="800" fill="#b91c1c">Oxidation: Zn(s) → Zn²⁺(aq) + 2e⁻</text>
        <text x="222" y="472" text-anchor="middle" font-size="12" fill="#475569">E°(Zn²⁺/Zn) = −0.76 V · Electrode loses mass</text>

        <rect x="728" y="232" width="260" height="190" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
        <rect x="730" y="280" width="256" height="140" rx="8" fill="#bfdbfe"/>
        <rect x="842" y="190" width="46" height="196" rx="4" fill="#c2410c" stroke="#7c2d12" stroke-width="2"/>
        <text x="865" y="178" text-anchor="middle" font-size="13.5" font-weight="800" fill="#047857">CATHODE (+) Cu</text>
        <text x="780" y="330" font-size="14" font-weight="700" fill="#1d4ed8">Cu²⁺</text>
        <text x="908" y="362" font-size="14" font-weight="700" fill="#1d4ed8">SO₄²⁻</text>
        <text x="858" y="452" text-anchor="middle" font-size="13.5" font-weight="800" fill="#047857">Reduction: Cu²⁺(aq) + 2e⁻ → Cu(s)</text>
        <text x="858" y="472" text-anchor="middle" font-size="12" fill="#475569">E°(Cu²⁺/Cu) = +0.34 V · Electrode gains mass</text>

        <path d="M 308 320 L 308 208 Q 308 180 336 180 L 744 180 Q 772 180 772 208 L 772 320" fill="none" stroke="#cbd5e1" stroke-width="28" stroke-linecap="round"/>
        <path d="M 308 320 L 308 208 Q 308 180 336 180 L 744 180 Q 772 180 772 208 L 772 320" fill="none" stroke="#f8fafc" stroke-width="22" stroke-linecap="round"/>
        <text x="540" y="185" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0f172a">Salt Bridge (KCl / KNO₃ in Agar)</text>
        <text x="415" y="218" text-anchor="middle" font-size="12" font-weight="700" fill="#dc2626">← Cl⁻ / NO₃⁻ anions</text>
        <text x="665" y="218" text-anchor="middle" font-size="12" font-weight="700" fill="#0284c7">K⁺ cations →</text>

        <rect x="385" y="255" width="310" height="136" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.4"/>
        <text x="540" y="284" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">IUPAC Cell Notation</text>
        <text x="540" y="312" text-anchor="middle" font-size="14.5" font-weight="800" fill="#1d4ed8">Zn(s) | Zn²⁺(1M) || Cu²⁺(1M) | Cu(s)</text>
        <text x="540" y="340" text-anchor="middle" font-size="12.5" font-weight="700" fill="#047857">E°cell = E°cathode − E°anode = +1.10 V</text>
        <text x="540" y="366" text-anchor="middle" font-size="12" fill="#475569">ΔG° = −nFE°cell &lt; 0 (Spontaneous)</text>
      `;
      return wrapCanvas(
        "Galvanic / Daniell Electrochemical Cell",
        "LOAN Rule: Left · Oxidation · Anode · Negative · Current (I) flows Cathode → Anode",
        "Zn(s) + Cu²⁺(aq)  ⇌  Zn²⁺(aq) + Cu(s)   [E°cell = +1.10 V]",
        body,
        "Exam Trap: Salt bridge maintains electrical neutrality and eliminates liquid junction potential; removing it drops cell EMF to 0 V."
      );
    }
  }
];

/* ==================== CONTEXT-AWARE STRUCTURAL SYNTHESIS FALLBACK ==================== */

function inferMoleculeFromText(snippet) {
  const s = String(snippet || "").toLowerCase();
  if (/\bsalicylaldehyde\b/.test(s)) return { type: "benzene", r: 30, aromatic: "circle", subs: { top: "OH", topRight: "CHO" }, ringName: "Salicylaldehyde" };
  if (/\bsalicylic\s+acid\b/.test(s)) return { type: "benzene", r: 30, aromatic: "circle", subs: { top: "OH", topRight: "COOH" }, ringName: "Salicylic Acid" };
  if (/\bphenol\b|\bc6h5oh\b/.test(s)) return { type: "benzene", r: 30, aromatic: "kekule", subs: { top: "OH" }, showLonePairs: true, ringName: "Phenol" };
  if (/\bphenoxide\b/.test(s)) return { type: "benzene", r: 30, aromatic: "kekule", subs: { top: { label: "O⁻Na⁺", color: "#dc2626" } }, ringName: "Phenoxide" };
  if (/\baniline\b|\bc6h5nh2\b/.test(s)) return { type: "benzene", r: 30, aromatic: "circle", subs: { top: "NH₂" }, showLonePairs: true, ringName: "Aniline" };
  if (/\banisole\b|\bch3oc6h5\b/.test(s)) return { type: "benzene", r: 30, aromatic: "circle", subs: { top: "OCH₃" }, ringName: "Anisole" };
  if (/\bnitrobenzene\b|\bc6h5no2\b/.test(s)) return { type: "benzene", r: 30, aromatic: "circle", subs: { top: "NO₂" }, ringName: "Nitrobenzene" };
  if (/\bbenzaldehyde\b|\bphcho\b|\bc6h5cho\b/.test(s)) return { type: "benzene", r: 30, aromatic: "circle", subs: { top: "CHO" }, ringName: "Benzaldehyde" };
  if (/\bbenzoic\s+acid\b|\bphcooh\b/.test(s)) return { type: "benzene", r: 30, aromatic: "circle", subs: { top: "COOH" }, ringName: "Benzoic Acid" };
  if (/\bacetophenone\b/.test(s)) return { type: "benzene", r: 30, aromatic: "circle", subs: { top: "COCH₃" }, ringName: "Acetophenone" };
  if (/\bchlorobenzene\b|\bbromobenzene\b|\bhaloarene\b|\bc6h5cl\b/.test(s)) return { type: "benzene", r: 30, aromatic: "circle", showLonePairs: true, subs: { top: /\bbromo/.test(s) ? "Br" : "Cl" }, ringName: /\bbromo/.test(s) ? "Bromobenzene" : "Chlorobenzene" };
  if (/\btoluene\b|\bmethylbenzene\b/.test(s)) return { type: "benzene", r: 30, aromatic: "circle", subs: { top: "CH₃" }, ringName: "Toluene" };
  if (/\bbenzene\b|\barenium\b|\bphenyl\b|\baromatic\b|\bc6h6\b/.test(s)) return { type: "benzene", r: 30, aromatic: "kekule", ringName: "Benzene Ring" };
  if (/\bchair\b|\bcyclohexane\b/.test(s)) return { type: "chair", axialTopRight: "R", caption: "Chair Conformation" };
  if (/\bcarbocation\b|\bplanar\b/.test(s)) return { type: "planar_cation", top: "R₁", bl: "R₂", br: "R₃" };
  if (/\balkene\b|\bdouble bond\b|\bpropene\b|\bethene\b/.test(s)) return { type: "alkene", tl: "R₁", bl: "H", tr: "R₂", br: "H" };
  if (/\bcarbonyl\b|\baldehyde\b|\bketone\b|\bacetone\b|\bformaldehyde\b|\bc=o\b/.test(s)) return { type: "carbonyl", left: "R₁", right: "R₂", top: "O", deltaC: "δ+", deltaO: "δ−" };
  if (/\btransition state\b|\[‡\]/.test(s)) return { type: "transition_state", nu: "Nu", lg: "X", top: "H", r1: "R₁", r2: "R₂" };
  if (/\boctahedral\b|\bsf6\b|\b\[.*\]/.test(s)) return { type: "vsepr", center: "M", geometry: "octahedral", ligands: ["L", "L", "L", "L", "L", "L"], angleLabel: "90°", caption: "Octahedral Geometry" };
  return null;
}

function buildStructuredDiagramSvg(topic, rawPrompt, context, history = []) {
  const historyText = Array.isArray(history)
    ? history.slice(-6).map((m) => (m && (m.content || m.text)) || "").join(" \n ")
    : "";
  const isGenericTitle = /^(?:chemistry|chemical)\s+(?:reaction\s+)?(?:mechanism|study\s+diagram|diagram|graph)$/i.test(String(topic || "").trim());
  const rawTitle = isGenericTitle ? "" : String(topic || "").trim();
  const inferredTitleFromHist = (!rawTitle && historyText)
    ? (historyText.replace(/```[\s\S]*?```/g, " ").split(/[.\n]/).find((s) => s && s.trim().length > 6) || "")
        .replace(/^(?:explain|what is|define|compare|derive|describe|tell me about|how does|write about)\s+/i, "")
        .trim()
    : "";
  const title = (rawTitle || inferredTitleFromHist || rawPrompt || "Chemical Mechanism Study Diagram").trim().slice(0, 78);
  const combined = `${topic || ""} \n ${rawPrompt || ""} \n ${context || ""} \n ${historyText}`;

  // Graph fallback if request clearly asks for a plot/curve/graph
  if (/\b(graph|plot|curve|distribution|isotherm|profile)\b/i.test(combined)) {
    const svg = compileGraphScene({
      title,
      subtitle: "Scientific Profile · Axis Relations · Quantitative Summary",
      equation: "",
      graph: {
        xLabel: /\bt\b|time/i.test(combined) ? "Time (t) →" : /\btemp|1\/t|kelvin/i.test(combined) ? "Temperature / Parameter (x) →" : "Reaction / System Variable (x) →",
        yLabel: /\benergy|enthalpy/i.test(combined) ? "Energy / Enthalpy" : /\bconc|rate/i.test(combined) ? "Concentration / Rate" : "Measured Property (y)",
        xTicks: [{ pos: 15, label: "Initial" }, { pos: 50, label: "Mid" }, { pos: 88, label: "Final" }],
        yTicks: [{ pos: 20, label: "Low" }, { pos: 55, label: "Mid" }, { pos: 85, label: "Peak" }],
        curves: [
          {
            label: title.slice(0, 30),
            color: "#1d4ed8",
            dashed: false,
            points: [[6, 30], [22, 46], [48, 84], [74, 40], [94, 22]]
          }
        ],
        markers: [
          { x: 48, y: 84, label: "Peak / Critical Point", color: "#dc2626" }
        ],
        summaryRows: [
          ["Focus", title.slice(0, 30)],
          ["Analysis", "Inspect slope, intercept & extrema"]
        ]
      },
      examTrap: "Verify independent (X) vs dependent (Y) axes, slope physical meaning, and asymptotic limits."
    });
    return {
      title,
      caption: `2D quantitative graph for **${title}**.`,
      latexEquation: "",
      catalysts: [],
      svg
    };
  }

  const cleanCtx = String(context || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$+/g, "")
    .replace(/[*`#]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const eqMatch = `${context || ""}\n${historyText}`.match(/([A-Za-z0-9()\[\]₀-₉⁺⁻–—−+=\s]+(?:⟶|->|→|⇌|<->)[A-Za-z0-9()\[\]₀-₉⁺⁻–—−+=\s]+)/);
  const extractedEq = eqMatch ? formatChemText(eqMatch[1].trim().slice(0, 92)) : "";

  const rawSteps = cleanCtx
    .split(/(?:\n+|\.\s+|(?:\bStep\s*\d+\s*[:.)]))/i)
    .map((s) => s.trim())
    .filter((s) => s.length >= 16 && s.length <= 210);

  const s1Text = rawSteps[0] || `Reactant activation / substrate setup for ${title}`;
  const s2Text = rawSteps[1] || "Electron-pushing intermediate or transition state [‡]";
  const s3Text = rawSteps[2] || "Final product formation, regio- & stereoselectivity";

  const m1 = inferMoleculeFromText(`${title} ${s1Text}`) || { type: "formula", text: title.slice(0, 28), color: "#1d4ed8", size: 15, boxed: true, bg: "#eff6ff", border: "#93c5fd" };
  const m2 = inferMoleculeFromText(s2Text) || (m1.type === "benzene" ? { type: "arenium", r: 30, subs: { gemTop: ["H", "E"] } } : { type: "formula", text: "[ Intermediate / TS ]‡", color: "#c2410c", size: 13.5, boxed: true, bg: "#fff7ed", border: "#fdba74" });
  const m3 = inferMoleculeFromText(`${s3Text} ${title}`) || (m1.type === "benzene" ? { type: "benzene", r: 30, aromatic: "circle", subs: { top: "Y" } } : { type: "formula", text: "Major Product", color: "#047857", size: 15, boxed: true, bg: "#ecfdf5", border: "#6ee7b7" });

  const svg = compileReactionScene({
    title,
    subtitle: "2D Structure · Electron Pushing · Reaction Pathway",
    equation: extractedEq,
    stages: [
      {
        title: "1. Reactant Activation",
        tone: "blue",
        molecules: [{ ...m1, rx: 0.48, ry: 0.46 }],
        curvedArrows: [{ fromRx: 0.26, fromRy: 0.65, toRx: 0.56, toRy: 0.48, arc: -24, kind: "nuc" }],
        note: s1Text.slice(0, 72)
      },
      {
        title: "2. Key Intermediate / TS [‡]",
        tone: "orange",
        molecules: [{ ...m2, rx: 0.50, ry: 0.48 }],
        note: s2Text.slice(0, 72)
      },
      {
        title: "3. Major Product",
        tone: "green",
        molecules: [{ ...m3, rx: 0.50, ry: 0.48 }],
        note: s3Text.slice(0, 72)
      }
    ],
    transitions: [
      { type: "forward", above: "Step 1", below: "reagent" },
      { type: "forward", above: "Step 2", below: "workup" }
    ],
    examTrap: rawSteps[3] || "Trace curved arrows from nucleophiles/π-bonds to electrophiles; check stoichiometry, regioselectivity & NCERT exceptions."
  });

  return {
    title,
    caption: `2D structural study diagram for **${title}**.`,
    latexEquation: extractedEq ? `\\text{${extractedEq}}` : "",
    catalysts: [],
    svg
  };
}

function getFallbackDiagram(topic, rawPrompt, context, history = []) {
  const histStr = Array.isArray(history)
    ? history.slice(-6).map((m) => (m && (m.content || m.text)) || "").join(" ")
    : "";
  // Prioritise active topic & prompt before older history so changing topics doesn't stick to an old preset
  const primary = `${topic || ""} ${rawPrompt || ""}`.trim();
  const combined = `${primary} ${context || ""} ${histStr}`;

  for (const preset of PRESETS) {
    if (preset.match.test(primary)) {
      return {
        title: preset.title,
        caption: preset.caption,
        latexEquation: preset.latexEquation || "",
        catalysts: preset.catalysts || [],
        svg: preset.build(),
        source: "curated-2d-vector"
      };
    }
  }
  for (const preset of PRESETS) {
    if (preset.match.test(combined)) {
      return {
        title: preset.title,
        caption: preset.caption,
        latexEquation: preset.latexEquation || "",
        catalysts: preset.catalysts || [],
        svg: preset.build(),
        source: "curated-2d-vector"
      };
    }
  }
  const built = buildStructuredDiagramSvg(topic, rawPrompt, context, history);
  return {
    title: built.title,
    caption: built.caption,
    latexEquation: built.latexEquation || "",
    catalysts: built.catalysts || [],
    svg: built.svg,
    source: "synthesized-2d-vector"
  };
}

module.exports = {
  getFallbackDiagram,
  compileReactionScene,
  compileGraphScene,
  buildStructuredDiagramSvg,
  formatChemText
};
