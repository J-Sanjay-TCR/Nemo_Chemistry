/* Nemo 2D ChemFig LaTeX Parser & Vector Skeletal Renderer
 * Zero-dependency browser & Node.js engine for \chemfig{...} structures,
 * fused/heterocyclic rings, stereochemical wedges, charges, and reaction schemes. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.NemoChemFig = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  /* -------------------- Canonical Organic & Chemical ChemFig Presets -------------------- */
  const PRESETS = {
    benzene: { title: "Benzene (C₆H₆)", chemfig: "\\chemfig{*6(=-=-=-)}" },
    benzene_ring: { title: "Benzene (Delocalised)", chemfig: "\\chemfig{**6(------)}" },
    toluene: { title: "Toluene (Methylbenzene)", chemfig: "\\chemfig{*6(=-=-(-CH_3)=-)}" },
    phenol: { title: "Phenol (C₆H₅OH)", chemfig: "\\chemfig{*6(=-=-(-OH)=-)}" },
    aniline: { title: "Aniline (C₆H₅NH₂)", chemfig: "\\chemfig{*6(=-=-(-NH_2)=-)}" },
    nitrobenzene: { title: "Nitrobenzene (C₆H₅NO₂)", chemfig: "\\chemfig{*6(=-=-(-NO_2)=-)}" },
    chlorobenzene: { title: "Chlorobenzene (C₆H₅Cl)", chemfig: "\\chemfig{*6(=-=-(-Cl)=-)}" },
    bromobenzene: { title: "Bromobenzene (C₆H₅Br)", chemfig: "\\chemfig{*6(=-=-(-Br)=-)}" },
    benzaldehyde: { title: "Benzaldehyde (C₆H₅CHO)", chemfig: "\\chemfig{*6(=-=-(-CHO)=-)}" },
    benzoic_acid: { title: "Benzoic Acid (C₆H₅COOH)", chemfig: "\\chemfig{*6(=-=-(-COOH)=-)}" },
    acetophenone: { title: "Acetophenone", chemfig: "\\chemfig{*6(=-=-(-C(=[2]O)-CH_3)=-)}" },
    anisole: { title: "Anisole (Methoxybenzene)", chemfig: "\\chemfig{*6(=-=-(-OCH_3)=-)}" },
    styrene: { title: "Styrene (Phenylethene)", chemfig: "\\chemfig{*6(=-=-(-CH=CH_2)=-)}" },
    cumene: { title: "Cumene (Isopropylbenzene)", chemfig: "\\chemfig{*6(=-=-(-CH(-[1]CH_3)(-[7]CH_3))=-)}" },
    salicylaldehyde: { title: "Salicylaldehyde (o-Hydroxybenzaldehyde)", chemfig: "\\chemfig{*6(=-=(-OH)-(-CHO)=-)}" },
    salicylic_acid: { title: "Salicylic Acid", chemfig: "\\chemfig{*6(=-=(-OH)-(-COOH)=-)}" },
    picric_acid: { title: "Picric Acid (2,4,6-Trinitrophenol)", chemfig: "\\chemfig{*6(=(-NO_2)-=(-NO_2)-(-OH)=(-NO_2)-)}" },
    aspirin: { title: "Aspirin (Acetylsalicylic Acid)", chemfig: "\\chemfig{*6(=-=(-O-C(=[2]O)-CH_3)-(-COOH)=-)}" },
    naphthalene: { title: "Naphthalene (C₁₀H₈)", chemfig: "\\chemfig{*6(=-*6(-=-=-)=-=)}" },
    anthracene: { title: "Anthracene (C₁₄H₁₀)", chemfig: "\\chemfig{*6(=-*6(=-*6(-=-=-)=-)=-=)}" },
    pyridine: { title: "Pyridine (C₅H₅N)", chemfig: "\\chemfig{*6(=-N=-=)}" },
    pyrrole: { title: "Pyrrole (C₄H₅N)", chemfig: "\\chemfig{*5(-NH-=-=)}" },
    furan: { title: "Furan (C₄H₄O)", chemfig: "\\chemfig{*5(-O-=-=)}" },
    thiophene: { title: "Thiophene (C₄H₄S)", chemfig: "\\chemfig{*5(-S-=-=)}" },
    cyclohexane: { title: "Cyclohexane (C₆H₁₂)", chemfig: "\\chemfig{*6(------)}" },
    cyclohexene: { title: "Cyclohexene (C₆H₁₀)", chemfig: "\\chemfig{*6(=-----)}" },
    cyclopentane: { title: "Cyclopentane (C₅H₁₀)", chemfig: "\\chemfig{*5(-----)}" },
    cyclobutane: { title: "Cyclobutane (C₄H₈)", chemfig: "\\chemfig{*4(----)}" },
    cyclopropane: { title: "Cyclopropane (C₃H₆)", chemfig: "\\chemfig{*3(---)}" },
    ethanol: { title: "Ethanol (C₂H₅OH)", chemfig: "\\chemfig{H_3C-[1]CH_2-[7]OH}" },
    acetone: { title: "Acetone ((CH₃)₂CO)", chemfig: "\\chemfig{H_3C-C(=[2]O)-CH_3}" },
    ethene: { title: "Ethene (C₂H₄)", chemfig: "\\chemfig{CH_2=CH_2}" },
    ethyne: { title: "Ethyne (C₂H₂)", chemfig: "\\chemfig{HC~CH}" },
    hcho: { title: "Formaldehyde (HCHO)", chemfig: "\\chemfig{H-C(=[2]O)-H}" },
    acetaldehyde: { title: "Acetaldehyde (CH₃CHO)", chemfig: "\\chemfig{H_3C-C(=[2]O)-H}" },
    acetic_acid: { title: "Acetic Acid (CH₃COOH)", chemfig: "\\chemfig{H_3C-C(=[2]O)-OH}" },
    ethane_s: { title: "Ethane (C₂H₆)", chemfig: "\\chemfig{H_3C-CH_3}" },
    ethane_e: { title: "Ethane (C₂H₆)", chemfig: "\\chemfig{H_3C-CH_3}" },
    methane: { title: "Methane (CH₄)", chemfig: "\\chemfig{H-C(-[2]H)(-[6]H)-H}" },
    cis2butene: { title: "cis-2-Butene (Z)", chemfig: "\\chemfig{H_3C-[7]CH=CH-[1]CH_3}" },
    trans2butene: { title: "trans-2-Butene (E)", chemfig: "\\chemfig{H_3C-[7]CH=CH-[7]CH_3}" },
    allene: { title: "Allene (Propadiene)", chemfig: "\\chemfig{H_2C=C=CH_2}" },
    propene: { title: "Propene (C₃H₆)", chemfig: "\\chemfig{H_3C-[1]CH=CH_2}" },
    isobutane: { title: "Isobutane", chemfig: "\\chemfig{H_3C-CH(-[2]CH_3)-CH_3}" },
    tert_butanol: { title: "tert-Butyl Alcohol", chemfig: "\\chemfig{H_3C-C(-[2]CH_3)(-[6]CH_3)-OH}" },
    water: { title: "Water (H₂O)", chemfig: "\\chemfig{H-[1]O-[7]H}" },
    ammonia: { title: "Ammonia (NH₃)", chemfig: "\\chemfig{H-N(-[6]H)-H}" },
    co2: { title: "Carbon Dioxide (CO₂)", chemfig: "\\chemfig{O=C=O}" },
    hcn: { title: "Hydrogen Cyanide (HCN)", chemfig: "\\chemfig{H-C~N}" },
    h2o2: { title: "Hydrogen Peroxide (H₂O₂)", chemfig: "\\chemfig{H-[1]O-[7]O-[1]H}" },
    o3: { title: "Ozone (O₃)", chemfig: "\\chemfig{O=[1]O^+-[7]O^-}" },
    so2: { title: "Sulfur Dioxide (SO₂)", chemfig: "\\chemfig{O=[1]S=[7]O}" },
    so3: { title: "Sulfur Trioxide (SO₃)", chemfig: "\\chemfig{O=S(=[2]O)=O}" },
    hno3: { title: "Nitric Acid (HNO₃)", chemfig: "\\chemfig{HO-N^+(=[2]O)-O^-}" },
    h2so4: { title: "Sulfuric Acid (H₂SO₄)", chemfig: "\\chemfig{HO-S(=[2]O)(=[6]O)-OH}" },
    h3po4: { title: "Orthophosphoric Acid (H₃PO₄)", chemfig: "\\chemfig{HO-P(=[2]O)(-[6]OH)-OH}" },
    h3po3: { title: "Phosphorous Acid (H₃PO₃)", chemfig: "\\chemfig{HO-P(=[2]O)(-[6]H)-OH}" },
    h3po2: { title: "Hypophosphorous Acid (H₃PO₂)", chemfig: "\\chemfig{HO-P(=[2]O)(-[6]H)-H}" },
    h3bo3: { title: "Boric Acid (B(OH)₃)", chemfig: "\\chemfig{HO-[1]B(-[2]OH)-[7]OH}" },
    bcl3: { title: "Boron Trichloride (BCl₃)", chemfig: "\\chemfig{Cl-[1]B(-[2]Cl)-[7]Cl}" },
    bf3: { title: "Boron Trifluoride (BF₃)", chemfig: "\\chemfig{F-[1]B(-[2]F)-[7]F}" },
    ccl4: { title: "Carbon Tetrachloride (CCl₄)", chemfig: "\\chemfig{Cl-C(-[2]Cl)(-[6]Cl)-Cl}" },
    pcl3: { title: "Phosphorus Trichloride (PCl₃)", chemfig: "\\chemfig{Cl-[7]P(-[6]Cl)-[1]Cl}" },
    hcl: { title: "Hydrogen Chloride (HCl)", chemfig: "\\chemfig{H-Cl}" },
    urea: { title: "Urea (NH₂CONH₂)", chemfig: "\\chemfig{H_2N-C(=[2]O)-NH_2}" },
    crotonaldehyde: { title: "Crotonaldehyde", chemfig: "\\chemfig{H_3C-[1]CH=[7]CH-[1]C(=[2]O)-[7]H}" },
    cinnamaldehyde: { title: "Cinnamaldehyde", chemfig: "\\chemfig{*6(=-=-(-CH=[7]CH-[1]CHO)=-)}" }
  };

  /* Lookup alias table for fast normalization */
  const ALIASES = {
    "benz": "benzene",
    "c6h6": "benzene",
    "methylbenzene": "toluene",
    "c6h5ch3": "toluene",
    "hydroxybenzene": "phenol",
    "c6h5oh": "phenol",
    "aminobenzene": "aniline",
    "c6h5nh2": "aniline",
    "benzoic acid": "benzoic_acid",
    "salicylic acid": "salicylic_acid",
    "picric acid": "picric_acid",
    "acetic acid": "acetic_acid",
    "ethanoic acid": "acetic_acid",
    "formaldehyde": "hcho",
    "methanal": "hcho",
    "ethanal": "acetaldehyde",
    "propanone": "acetone",
    "ethylene": "ethene",
    "acetylene": "ethyne",
    "ethane": "ethane_s",
    "cis-2-butene": "cis2butene",
    "trans-2-butene": "trans2butene",
    "propadiene": "allene",
    "tert-butanol": "tert_butanol",
    "nitric acid": "hno3",
    "sulfuric acid": "h2so4",
    "orthophosphoric acid": "h3po4",
    "phosphoric acid": "h3po4",
    "phosphorous acid": "h3po3",
    "hypophosphorous acid": "h3po2",
    "boric acid": "h3bo3",
    "carbon dioxide": "co2",
    "water": "water",
    "ammonia": "ammonia",
    "hydrogen cyanide": "hcn",
    "hydrogen peroxide": "h2o2",
    "ozone": "o3",
    "sulfur dioxide": "so2",
    "sulfur trioxide": "so3",
    "boron trichloride": "bcl3",
    "boron trifluoride": "bf3",
    "carbon tetrachloride": "ccl4",
    "phosphorus trichloride": "pcl3"
  };

  const REV_TERMINAL = {
    "OH": "HO",
    "O-H": "H-O",
    "CH_3": "H_3C",
    "CH3": "H_3C",
    "CH_2": "H_2C",
    "CH2": "H_2C",
    "NH_2": "H_2N",
    "NH2": "H_2N",
    "NH": "HN",
    "NO_2": "O_2N",
    "NO2": "O_2N",
    "COOH": "HOOC",
    "CO_2H": "HO_2C",
    "CO2H": "HO_2C",
    "CHO": "OHC",
    "OCH_3": "H_3CO",
    "OCH3": "H_3CO",
    "OC_2H_5": "H_5C_2O",
    "C_2H_5": "H_5C_2",
    "C2H5": "H_5C_2",
    "CN": "NC",
    "NC": "CN",
    "SH": "HS",
    "SO_3H": "HO_3S",
    "SO3H": "HO_3S",
    "NH_3^+": "^+H_3N",
    "NH3^+": "^+H_3N",
    "O^-": "^-O",
    "COO^-": "^-OOC",
    "N_2^+": "^+N_2"
  };

  const DEG2RAD = Math.PI / 180;
  const RAD2DEG = 180 / Math.PI;
  const BOND_LEN = 38;

  function escHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* Normalize canonical formula lookup */
  function normalizeLookupKey(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/[\u2080-\u2089]/g, (c) => String("₀₁₂₃₄₅₆₇₈₉".indexOf(c)))
      .replace(/\s+/g, "_");
  }

  function lookupPreset(idOrName) {
    if (!idOrName) return null;
    const raw = String(idOrName).trim().toLowerCase();
    const norm = normalizeLookupKey(raw);
    if (PRESETS[raw]) return PRESETS[raw];
    if (PRESETS[norm]) return PRESETS[norm];
    if (ALIASES[raw] && PRESETS[ALIASES[raw]]) return PRESETS[ALIASES[raw]];
    if (ALIASES[norm] && PRESETS[ALIASES[norm]]) return PRESETS[ALIASES[norm]];
    const stripped = raw.replace(/\s*\([^)]*\)\s*$/g, "").trim();
    const normStripped = normalizeLookupKey(stripped);
    if (PRESETS[normStripped]) return PRESETS[normStripped];
    if (ALIASES[stripped] && PRESETS[ALIASES[stripped]]) return PRESETS[ALIASES[stripped]];
    return null;
  }

  /* Match canonical preset title from a rendered \chemfig{...} string */
  function inferTitleFromExpr(chemfigStr) {
    const clean = String(chemfigStr || "").replace(/^\\chemfig(?:\[[^\]]*\])?\{|\}$/g, "").replace(/\s+/g, "");
    for (const key of Object.keys(PRESETS)) {
      const pClean = PRESETS[key].chemfig.replace(/^\\chemfig(?:\[[^\]]*\])?\{|\}$/g, "").replace(/\s+/g, "");
      if (pClean === clean) return PRESETS[key].title;
    }
    if (/\*\*6\(------\)/.test(clean) || /\*6\(=-=-=-|-\=-=\-=/.test(clean)) {
      if (clean.includes("NH_2")) return "Aniline derivative";
      if (clean.includes("NO_2")) return "Nitroarene";
      if (clean.includes("COOH")) return "Benzoic acid";
      if (clean.includes("CHO")) return "Benzaldehyde";
      if (clean.includes("OH")) return "Phenol derivative";
      if (clean.includes("CH_3")) return "Toluene derivative";
      if (clean.includes("*6(=-*6")) return "Naphthalene";
      return "Benzene / Aromatic Ring";
    }
    return "2D Skeletal Structure";
  }

  /* Find balanced closing brace index starting at openIdx ('{') */
  function findMatchingBrace(str, openIdx) {
    if (!str || str[openIdx] !== "{") return -1;
    let depth = 0;
    for (let i = openIdx; i < str.length; i++) {
      const ch = str[i];
      if (ch === "\\" && i + 1 < str.length) {
        i++;
        continue;
      }
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  /* Find balanced closing parenthesis ')' or bracket ']' */
  function findMatchingDelim(str, openIdx, openChar, closeChar) {
    if (!str || str[openIdx] !== openChar) return -1;
    let depth = 0;
    let braceDepth = 0;
    for (let i = openIdx; i < str.length; i++) {
      const ch = str[i];
      if (ch === "\\" && i + 1 < str.length) {
        i++;
        continue;
      }
      if (ch === "{") { braceDepth++; continue; }
      if (ch === "}") { if (braceDepth > 0) braceDepth--; continue; }
      if (braceDepth > 0) continue;
      if (ch === openChar) depth++;
      else if (ch === closeChar) {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  function unwrapChemfigCommand(raw) {
    if (raw && typeof raw === "object" && raw.chemfig) raw = raw.chemfig;
    let s = String(raw || "").trim();
    if (!s) return "";
    // Remove leading/trailing $ or \[ \] if passed raw
    s = s.replace(/^\$\$|\$\$$/g, "").replace(/^\\\[|\\\]$/g, "").replace(/^\\\(|\\\)$/g, "").replace(/^\$|\$$/g, "").trim();
    const m = s.match(/^\\chemfig(?:\s*\[[^\]]*\])?\s*\{/);
    if (m) {
      const openIdx = s.indexOf("{", m[0].length - 1);
      const closeIdx = findMatchingBrace(s, openIdx);
      if (closeIdx !== -1) {
        return s.slice(openIdx + 1, closeIdx).trim();
      }
      return s.slice(openIdx + 1).trim();
    }
    return s;
  }

  /* -------------------- Clean & Parse Atom Text -------------------- */
  function stripTeXWrappers(raw) {
    let s = String(raw || "").trim();
    if (!s) return "";
    // Handle \charge{pos=sym,...}{Atom}
    s = s.replace(/\\charge\s*\{([^}]*)\}\s*\{([^}]*)\}/g, (_, charges, atom) => {
      let extra = "";
      if (/\\bullet|\./.test(charges)) extra += "^{\\bullet}";
      if (/\+/.test(charges)) extra += "^{+}";
      else if (/-/.test(charges)) extra += "^{-}";
      return atom + extra;
    });
    // Handle \chemabove{Atom}{top} / \chembelow{Atom}{bot}
    s = s.replace(/\\(?:chemabove|chembelow)\s*\{([^}]*)\}\s*\{([^}]*)\}/g, "$1$2");
    // Handle \ce{...}, \text{...}, \mathrm{...}, \mathbf{...}
    for (let pass = 0; pass < 3; pass++) {
      s = s.replace(/\\(?:ce|text|mathrm|mathbf|mathsf|mathit)\s*\{([^{}]*)\}/g, "$1");
    }
    s = s.replace(/\\oplus/g, "⊕").replace(/\\ominus/g, "⊖").replace(/\\bullet/g, "•").replace(/\\cdot/g, "·");
    s = s.replace(/\\delta\s*\+/g, "δ+").replace(/\\delta\s*-/g, "δ-").replace(/\\delta/g, "δ");
    // Unwrap pure outer braces `{NH_2}` -> `NH_2`
    if (s.startsWith("{") && s.endsWith("}") && findMatchingBrace(s, 0) === s.length - 1) {
      s = s.slice(1, -1);
    }
    return s.trim();
  }

  /* Convert ChemFig atom string to structured spans [{ text, type: 'normal'|'sub'|'sup' }] */
  function parseAtomSpans(rawLabel) {
    let s = stripTeXWrappers(rawLabel);
    if (!s) return [];
    // Normalize unicode sub/sups to ASCII _ and ^ so spans render uniformly
    s = s.replace(/[₀₁₂₃₄₅₆₇₈₉]+/g, (m) => "_{" + [...m].map((c) => "₀₁₂₃₄₅₆₇₈₉".indexOf(c)).join("") + "}");
    // Normalize bare digits inside common organic groups if user wrote `CH3`, `NH2`, `NO2`, `SO3H`
    if (!s.includes("_") && !s.includes("^")) {
      s = s.replace(/([A-Za-z)])(\d+)/g, "$1_{$2}");
    }
    const spans = [];
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (ch === "_" || ch === "^") {
        const type = ch === "_" ? "sub" : "sup";
        i++;
        let val = "";
        if (s[i] === "{") {
          const end = findMatchingBrace(s, i);
          if (end !== -1) {
            val = s.slice(i + 1, end);
            i = end + 1;
          } else {
            val = s.slice(i + 1);
            i = s.length;
          }
        } else if (i < s.length) {
          val = s[i++];
          // Handle e.g. 2+ or 3- without braces in sup if trailing + or -
          if (type === "sup" && /^\d$/.test(val) && (s[i] === "+" || s[i] === "-")) {
            val += s[i++];
          }
        }
        val = val.replace(/[{}]/g, "");
        if (val) spans.push({ text: val, type });
      } else if (ch === "{" || ch === "}") {
        i++;
      } else if (ch === "|") {
        i++;
      } else {
        let plain = "";
        while (i < s.length && s[i] !== "_" && s[i] !== "^" && s[i] !== "{" && s[i] !== "}" && s[i] !== "|") {
          plain += s[i++];
        }
        if (plain) spans.push({ text: plain, type: "normal" });
      }
    }
    return spans;
  }

  function estimateAtomBox(rawLabel, fontSize = 13.5) {
    const spans = parseAtomSpans(rawLabel);
    if (!spans.length) return { hw: 0, hh: 0, spans: [] };
    let wUnits = 0;
    let hasSub = false;
    let hasSup = false;
    for (const sp of spans) {
      const mult = sp.type === "normal" ? 1 : 0.72;
      if (sp.type === "sub") hasSub = true;
      if (sp.type === "sup") hasSup = true;
      for (const ch of sp.text) {
        if ("iIl1|·•".includes(ch)) wUnits += 0.36 * mult;
        else if ("MWm@".includes(ch)) wUnits += 0.88 * mult;
        else wUnits += 0.64 * mult;
      }
    }
    const w = Math.max(fontSize * 0.85, wUnits * fontSize) + 4;
    const h = fontSize + (hasSub ? 3.5 : 0) + (hasSup ? 3.5 : 0) + 2;
    return { hw: w / 2, hh: h / 2, spans };
  }

  function atomElementClass(rawLabel) {
    const clean = stripTeXWrappers(rawLabel).replace(/[_^{}\d+\-•\s]/g, "");
    if (!clean) return "cf-el-C";
    if (/^(?:OH|HO|O|OCH|OCH3|H3CO|CHO|OHC|COOH|HOOC|O2N|NO2)$/i.test(clean)) {
      if (clean === "O" || clean === "OH" || clean === "HO") return "cf-el-O";
      if (/^NO|^O2N|^NH|^H2N|^N|^NC|^CN$/.test(clean)) return "cf-el-N";
      return "cf-el-C";
    }
    if (clean.startsWith("Cl") || clean.startsWith("F") || clean.startsWith("Br") || clean === "I") return "cf-el-X";
    if (clean.startsWith("N") || clean === "HN" || clean === "H2N" || clean === "NH" || clean === "NH2") return "cf-el-N";
    if (clean.startsWith("O") || clean === "HO") return "cf-el-O";
    if (clean.startsWith("S") || clean === "HS") return "cf-el-S";
    if (clean.startsWith("P")) return "cf-el-P";
    if (clean.startsWith("B") && !clean.startsWith("Br")) return "cf-el-B";
    return "cf-el-C";
  }

  function maybeReverseTerminalLabel(label, toNeighborDx, toNeighborDy) {
    if (!label) return label;
    // Neighbor is to the RIGHT (+X) of this terminal atom, so bond enters from the right -> flip OH -> HO
    if (toNeighborDx > 0.32 * Math.hypot(toNeighborDx, toNeighborDy)) {
      const stripped = stripTeXWrappers(label).replace(/\s+/g, "");
      if (REV_TERMINAL[stripped]) return REV_TERMINAL[stripped];
      const noBraces = stripped.replace(/[{}]/g, "");
      if (REV_TERMINAL[noBraces]) return REV_TERMINAL[noBraces];
    }
    return label;
  }

  /* -------------------- Bond Angle & Spec Parser -------------------- */
  function parseBondSpec(str, startIdx, prevAngleDeg) {
    // Expects str[startIdx] === '['
    const endIdx = findMatchingDelim(str, startIdx, "[", "]");
    if (endIdx === -1) return { nextIdx: startIdx + 1, angle: prevAngleDeg, lenScale: 1, explicitAngle: false };
    const inside = str.slice(startIdx + 1, endIdx);
    const parts = inside.split(",");
    let angle = prevAngleDeg;
    let explicitAngle = false;
    let lenScale = 1;

    const aStr = (parts[0] || "").trim();
    if (aStr) {
      if (aStr.startsWith("::")) {
        const delta = parseFloat(aStr.slice(2));
        if (Number.isFinite(delta)) {
          angle = (prevAngleDeg || 0) + delta;
          explicitAngle = true;
        }
      } else if (aStr.startsWith(":")) {
        const abs = parseFloat(aStr.slice(1));
        if (Number.isFinite(abs)) {
          angle = abs;
          explicitAngle = true;
        }
      } else {
        const unit = parseFloat(aStr);
        if (Number.isFinite(unit)) {
          angle = unit * 45;
          explicitAngle = true;
        }
      }
    }
    if (parts[1] && parts[1].trim()) {
      const sc = parseFloat(parts[1].trim());
      if (Number.isFinite(sc) && sc > 0.25 && sc < 3.5) {
        lenScale = sc;
      }
    }
    return { nextIdx: endIdx + 1, angle, lenScale, explicitAngle };
  }

  const BOND_CHARS = new Set(["-", "=", "~", ">", "<"]);

  function readBondAt(str, i, prevAngleDeg) {
    const ch = str[i];
    if (!BOND_CHARS.has(ch)) return null;
    let type = "single";
    let next = i + 1;
    if (ch === "-") {
      if (str[next] === ".") { type = "dashed"; next++; }
      else type = "single";
    } else if (ch === "=") {
      type = "double";
    } else if (ch === "~") {
      if (str[next] === ">") { type = "dashed"; next++; }
      else type = "triple";
    } else if (ch === ">") {
      if (str[next] === ":") { type = "dashWedge"; next++; }
      else type = "wedge";
    } else if (ch === "<") {
      if (str[next] === ":") { type = "revDashWedge"; next++; }
      else type = "revWedge";
    }
    // Optional whitespace before [...]
    let look = next;
    while (look < str.length && str[look] === " ") look++;
    let angle = prevAngleDeg;
    let lenScale = 1;
    let explicitAngle = false;
    if (str[look] === "[") {
      const spec = parseBondSpec(str, look, prevAngleDeg);
      next = spec.nextIdx;
      angle = spec.angle;
      lenScale = spec.lenScale;
      explicitAngle = spec.explicitAngle;
    }
    return { type, nextIdx: next, angle, lenScale, explicitAngle };
  }

  /* -------------------- Graph Builder (Chains, Branches & Rings) -------------------- */
  function createGraph() {
    return {
      nodes: [],   // { id, x, y, label, isRing }
      bonds: [],   // { a, b, type, ringId }
      rings: [],   // { id, n, aromatic, vertices, cx, cy }
      steps: 0
    };
  }

  function addNode(g, x, y, label = "") {
    // Snap very close coordinates (e.g. closing fused rings) cleanly
    const id = g.nodes.length;
    g.nodes.push({ id, x, y, label, deg: 0, neighbors: [] });
    return id;
  }

  function findCoincidentNode(g, x, y, tol = 4) {
    for (let i = g.nodes.length - 1; i >= 0; i--) {
      const n = g.nodes[i];
      if (Math.hypot(n.x - x, n.y - y) <= tol) return n.id;
    }
    return -1;
  }

  function addBond(g, a, b, type, ringId = -1) {
    if (a === b) return;
    // Prevent duplicate bond between identical pair (e.g. fused ring shared bond)
    const existing = g.bonds.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
    if (existing) {
      // If outer ring draws double bond along shared bond, upgrade order cleanly
      if (existing.type === "single" && type !== "single") existing.type = type;
      if (ringId >= 0 && existing.ringIds.indexOf(ringId) === -1) existing.ringIds.push(ringId);
      return;
    }
    g.bonds.push({ a, b, type, ringIds: ringId >= 0 ? [ringId] : [] });
    g.nodes[a].deg++;
    g.nodes[b].deg++;
    g.nodes[a].neighbors.push(b);
    g.nodes[b].neighbors.push(a);
  }

  function stepXY(x, y, angleDeg, len = BOND_LEN) {
    const r = angleDeg * DEG2RAD;
    return [x + len * Math.cos(r), y - len * Math.sin(r)];
  }

  /* Parse chain inside string str from current vertex vId */
  function parseChain(g, str, startNodeId, opts = {}, depth = 0) {
    if (depth > 16) return startNodeId;
    let curId = startNodeId;
    let prevAngle = opts.baseAngle != null ? opts.baseAngle : 0;
    let i = 0;
    let branchCountAtCur = 0;
    let hasIncomingBond = Boolean(opts.hasIncomingBond);

    const readAtomRun = () => {
      let buf = "";
      let braceDepth = 0;
      while (i < str.length) {
        const ch = str[i];
        if (ch === "\\" && i + 1 < str.length) {
          // Stop if \chemabove etc.? No, consume LaTeX macro + its braced args
          let macro = "\\";
          i++;
          while (i < str.length && /[A-Za-z]/.test(str[i])) macro += str[i++];
          buf += macro;
          while (i < str.length && str[i] === "{") {
            const end = findMatchingBrace(str, i);
            if (end === -1) break;
            buf += str.slice(i, end + 1);
            i = end + 1;
          }
          continue;
        }
        if (ch === "{") {
          const end = findMatchingBrace(str, i);
          if (end !== -1) {
            buf += str.slice(i, end + 1);
            i = end + 1;
            continue;
          }
          braceDepth++;
          buf += str[i++];
          continue;
        }
        if (ch === "}") {
          if (braceDepth > 0) braceDepth--;
          buf += str[i++];
          continue;
        }
        if (braceDepth === 0) {
          if (ch === "(" || ch === ")" || ch === "*" || BOND_CHARS.has(ch)) break;
        }
        buf += str[i++];
      }
      return buf.trim();
    };

    const parseRingCallAt = (anchorId, anchorCtx) => {
      let aromatic = false;
      if (str.slice(i, i + 2) === "**") { aromatic = true; i += 2; }
      else { i += 1; }
      // Optional angle `[...]` right after `*` before digit e.g. `*[30]6(...)`
      let customStartAngle = null;
      if (str[i] === "[") {
        const sp = parseBondSpec(str, i, prevAngle);
        i = sp.nextIdx;
        if (sp.explicitAngle) customStartAngle = sp.angle;
      }
      let numStr = "";
      while (i < str.length && /\d/.test(str[i])) numStr += str[i++];
      const nSides = Math.max(3, Math.min(12, parseInt(numStr || "6", 10) || 6));
      while (i < str.length && str[i] === " ") i++;
      if (str[i] !== "(") return anchorId;
      const closeIdx = findMatchingDelim(str, i, "(", ")");
      const body = closeIdx === -1 ? str.slice(i + 1) : str.slice(i + 1, closeIdx);
      i = closeIdx === -1 ? str.length : closeIdx + 1;

      buildRing(g, anchorId, nSides, aromatic, body, {
        ...anchorCtx,
        customStartAngle
      }, depth + 1);
      return anchorId;
    };

    while (i < str.length && g.steps < 2000) {
      g.steps++;
      while (i < str.length && /\s/.test(str[i])) i++;
      if (i >= str.length) break;

      const ch = str[i];

      // 1. Ring syntax `*6(...)` or `**6(...)` attached at curId
      if (ch === "*") {
        parseRingCallAt(curId, {
          inAngle: hasIncomingBond ? prevAngle : null,
          isRoot: !hasIncomingBond && g.nodes.length <= 1
        });
        branchCountAtCur++;
        continue;
      }

      // 2. Branch `(...)` attached at curId
      if (ch === "(") {
        const closeIdx = findMatchingDelim(str, i, "(", ")");
        const branchStr = closeIdx === -1 ? str.slice(i + 1) : str.slice(i + 1, closeIdx);
        i = closeIdx === -1 ? str.length : closeIdx + 1;
        // Determine smart default outward angle if branch's first bond has no [angle]
        let defAngle = opts.outwardAngle != null ? opts.outwardAngle : null;
        if (defAngle == null) {
          if (branchCountAtCur === 0) defAngle = prevAngle + 90;
          else if (branchCountAtCur === 1) defAngle = prevAngle - 90;
          else defAngle = prevAngle + 45 * branchCountAtCur;
        } else if (branchCountAtCur > 0) {
          defAngle += branchCountAtCur % 2 === 1 ? -26 : 26;
        }
        parseChain(g, branchStr, curId, {
          baseAngle: defAngle,
          defaultFirstAngle: defAngle,
          hasIncomingBond: true
        }, depth + 1);
        branchCountAtCur++;
        continue;
      }

      // 3. Bond `-`, `=`, `~`, `>`, `<`
      if (BOND_CHARS.has(ch)) {
        const b = readBondAt(str, i, prevAngle);
        i = b.nextIdx;
        // Determine bond angle (explicit spec > branch default > continue chain)
        let useAngle = b.angle;
        if (!b.explicitAngle) {
          if (curId === startNodeId && opts.defaultFirstAngle != null) {
            useAngle = opts.defaultFirstAngle;
          } else {
            useAngle = prevAngle;
          }
        }
        const [nx, ny] = stepXY(g.nodes[curId].x, g.nodes[curId].y, useAngle, BOND_LEN * b.lenScale);

        // Read optional atom label after the bond
        while (i < str.length && str[i] === " ") i++;
        let nextLabel = "";
        if (i < str.length && str[i] !== "*" && str[i] !== "(" && !BOND_CHARS.has(str[i])) {
          nextLabel = readAtomRun();
        }
        const nextId = addNode(g, nx, ny, nextLabel);
        addBond(g, curId, nextId, b.type);
        curId = nextId;
        prevAngle = useAngle;
        hasIncomingBond = true;
        branchCountAtCur = 0;
        continue;
      }

      // 4. Atom text at current node (e.g. start of expression `CH_3-...`)
      const atomLabel = readAtomRun();
      if (atomLabel) {
        if (!g.nodes[curId].label) {
          g.nodes[curId].label = atomLabel;
        } else if (curId === startNodeId) {
          g.nodes[curId].label += atomLabel;
        }
      } else {
        i++;
      }
    }
    return curId;
  }

  /* Split ring body `*n(...)` into vertex steps: each step is { label, branches[], fusedRings[], outBond } */
  function tokenizeRingBody(body) {
    const steps = [];
    let cur = { label: "", attachments: [], outBond: null };
    let i = 0;
    const len = body.length;

    while (i < len) {
      while (i < len && /\s/.test(body[i])) i++;
      if (i >= len) break;
      const ch = body[i];

      if (ch === "*") {
        // Fused ring inside this ring!
        const start = i;
        i += body[i + 1] === "*" ? 2 : 1;
        if (body[i] === "[") i = parseBondSpec(body, i, 0).nextIdx;
        while (i < len && /\d/.test(body[i])) i++;
        while (i < len && body[i] === " ") i++;
        if (body[i] === "(") {
          const end = findMatchingDelim(body, i, "(", ")");
          i = end === -1 ? len : end + 1;
        }
        cur.attachments.push({ kind: "ring", raw: body.slice(start, i) });
        continue;
      }

      if (ch === "(") {
        const end = findMatchingDelim(body, i, "(", ")");
        const inner = end === -1 ? body.slice(i + 1) : body.slice(i + 1, end);
        i = end === -1 ? len : end + 1;
        cur.attachments.push({ kind: "branch", raw: inner });
        continue;
      }

      if (BOND_CHARS.has(ch)) {
        const b = readBondAt(body, i, 0);
        i = b.nextIdx;
        cur.outBond = b;
        steps.push(cur);
        cur = { label: "", attachments: [], outBond: null };
        continue;
      }

      // Atom text
      let buf = "";
      while (i < len) {
        const c = body[i];
        if (c === "\\" && i + 1 < len) {
          buf += body[i++];
          while (i < len && /[A-Za-z]/.test(body[i])) buf += body[i++];
          while (i < len && body[i] === "{") {
            const end = findMatchingBrace(body, i);
            if (end === -1) break;
            buf += body.slice(i, end + 1);
            i = end + 1;
          }
          continue;
        }
        if (c === "{") {
          const end = findMatchingBrace(body, i);
          if (end !== -1) {
            buf += body.slice(i, end + 1);
            i = end + 1;
            continue;
          }
        }
        if (c === "(" || c === "*" || BOND_CHARS.has(c)) break;
        buf += body[i++];
      }
      cur.label += buf.trim();
    }
    if (cur.label || cur.attachments.length || cur.outBond) {
      steps.push(cur);
    }
    return steps;
  }

  function buildRing(g, startNodeId, nSides, aromatic, body, ctx = {}, depth = 0) {
    if (depth > 16 || g.steps > 2000) return;
    const stepAngle = 360 / nSides;
    let firstEdgeAngle;

    if (ctx.customStartAngle != null) {
      firstEdgeAngle = ctx.customStartAngle;
    } else if (ctx.fusedEdgeAngle != null) {
      // Fused on the exterior (right-hand side) of parent ring's edge `fusedEdgeAngle`:
      firstEdgeAngle = ctx.fusedEdgeAngle - (180 - stepAngle);
    } else if (ctx.inAngle != null) {
      // Attached to an incoming chain bond at `inAngle`: extend straight collinearly forward!
      firstEdgeAngle = ctx.inAngle - (90 - stepAngle / 2);
    } else {
      // Root ring: vertical sides for 6-gon (`-30°`), apex-down for 5-gon (`-36°`), square (`-45°`)
      firstEdgeAngle = -180 / nSides;
    }

    const parsedSteps = tokenizeRingBody(body);
    const vIds = [startNodeId];
    let cx = g.nodes[startNodeId].x;
    let cy = g.nodes[startNodeId].y;

    // Pre-place all nSides vertices using regular polygon geometry
    for (let k = 0; k < nSides; k++) {
      const ang = firstEdgeAngle + k * stepAngle;
      const curId = vIds[k];
      if (k < nSides - 1) {
        const [nx, ny] = stepXY(g.nodes[curId].x, g.nodes[curId].y, ang, BOND_LEN);
        // Check if this vertex coincides with an already-existing node (closing a fused ring!)
        const hit = ctx.fusedEndNodeId != null && Math.hypot(nx - g.nodes[ctx.fusedEndNodeId].x, ny - g.nodes[ctx.fusedEndNodeId].y) <= 5
          ? ctx.fusedEndNodeId
          : findCoincidentNode(g, nx, ny, 4.5);
        const nid = hit !== -1 ? hit : addNode(g, nx, ny, "");
        vIds.push(nid);
        cx += g.nodes[nid].x;
        cy += g.nodes[nid].y;
      }
    }
    cx /= nSides;
    cy /= nSides;

    const ringId = g.rings.length;
    g.rings.push({ id: ringId, n: nSides, aromatic, vertices: vIds.slice(), cx, cy });

    // Apply atom labels, ring bonds, and queue branches/fused rings
    const deferredBranches = [];
    for (let k = 0; k < nSides; k++) {
      const st = parsedSteps[k];
      const vId = vIds[k];
      const nextVId = vIds[(k + 1) % nSides];

      if (st && st.label && !g.nodes[vId].label) {
        g.nodes[vId].label = st.label;
      }

      const bondType = (st && st.outBond) ? st.outBond.type : "single";
      addBond(g, vId, nextVId, bondType, ringId);

      if (st && st.attachments.length) {
        const edgeAng = firstEdgeAngle + k * stepAngle;
        const vNode = g.nodes[vId];
        const outAngle = Math.atan2(cy - vNode.y, vNode.x - cx) * RAD2DEG;
        for (const att of st.attachments) {
          if (att.kind === "ring") {
            // Fused ring shares vertex vId -> nextVId
            const m = att.raw.match(/^(\*{1,2})(?:\[[^\]]*\])?(\d*)\s*\(([\s\S]*)\)$/);
            if (m) {
              const fAromatic = m[1] === "**";
              const fSides = Math.max(3, Math.min(12, parseInt(m[2] || "6", 10) || 6));
              buildRing(g, vId, fSides, fAromatic, m[3], {
                fusedEdgeAngle: edgeAng,
                fusedEndNodeId: nextVId
              }, depth + 1);
            }
          } else if (att.kind === "branch") {
            deferredBranches.push({ vId, outAngle, raw: att.raw });
          }
        }
      }
    }

    // Build branches after ring skeleton & fused rings are locked in
    const countPerVertex = new Map();
    for (const br of deferredBranches) {
      const idx = countPerVertex.get(br.vId) || 0;
      countPerVertex.set(br.vId, idx + 1);
      const spreadAngle = idx === 0 ? br.outAngle : br.outAngle + (idx % 2 === 1 ? -22 : 22);
      parseChain(g, br.raw, br.vId, {
        baseAngle: spreadAngle,
        defaultFirstAngle: spreadAngle,
        outwardAngle: br.outAngle,
        hasIncomingBond: true
      }, depth + 1);
    }
  }

  function parse(chemfigExpr) {
    const body = unwrapChemfigCommand(chemfigExpr);
    const g = createGraph();
    if (!body) return g;
    const rootId = addNode(g, 0, 0, "");
    parseChain(g, body, rootId, { baseAngle: 0, hasIncomingBond: false }, 0);
    return g;
  }

  /* -------------------- Automatic 2D Projection Fallback From 3D Atoms/Bonds -------------------- */
  function fromMoleculeData(mol) {
    if (!mol || !Array.isArray(mol.atoms) || !mol.atoms.length) return null;
    const g = createGraph();
    // Pick best planar view (drop axis with smallest variance)
    let sx = 0, sy = 0, sz = 0;
    const coords = mol.atoms.map((a) => [Number(a[1]) || 0, Number(a[2]) || 0, Number(a[3]) || 0]);
    const mx = coords.reduce((s, c) => s + c[0], 0) / coords.length;
    const my = coords.reduce((s, c) => s + c[1], 0) / coords.length;
    const mz = coords.reduce((s, c) => s + c[2], 0) / coords.length;
    for (const c of coords) {
      sx += (c[0] - mx) ** 2;
      sy += (c[1] - my) ** 2;
      sz += (c[2] - mz) ** 2;
    }
    // Project onto the two highest-variance coordinate axes
    let proj = ([x, y]) => [x, -y];
    if (sx < sy && sx < sz) proj = ([_, y, z]) => [y, -z];
    else if (sy < sx && sy < sz) proj = ([x, _, z]) => [x, -z];

    // Estimate average bond length in Angstroms so we scale nicely to BOND_LEN
    let bSum = 0, bCnt = 0;
    const bonds = Array.isArray(mol.bonds) ? mol.bonds : [];
    for (const [ia, ib] of bonds) {
      const a = coords[ia], b = coords[ib];
      if (!a || !b) continue;
      const [x1, y1] = proj(a), [x2, y2] = proj(b);
      const d = Math.hypot(x2 - x1, y2 - y1);
      if (d > 0.25) { bSum += d; bCnt++; }
    }
    const scale = bCnt ? (BOND_LEN / (bSum / bCnt)) : 26;

    // Count non-H bonds on each atom for organic skeletal C-H collapsing
    const degNonH = new Array(mol.atoms.length).fill(0);
    const attachedH = new Array(mol.atoms.length).fill(0);
    for (const [ia, ib] of bonds) {
      const eA = mol.atoms[ia]?.[0], eB = mol.atoms[ib]?.[0];
      if (eB === "H") attachedH[ia]++;
      else degNonH[ia]++;
      if (eA === "H") attachedH[ib]++;
      else degNonH[ib]++;
    }
    const hasManyCarbons = mol.atoms.filter((a) => a[0] === "C").length >= 3;
    const keepIdx = new Map();
    mol.atoms.forEach((a, idx) => {
      if (hasManyCarbons && a[0] === "H") {
        // Skip implicit H attached to C in organic skeletons
        const bondedToNonC = bonds.some(([ia, ib]) => (ia === idx && mol.atoms[ib]?.[0] !== "C") || (ib === idx && mol.atoms[ia]?.[0] !== "C"));
        if (!bondedToNonC) return;
      }
      const [px, py] = proj(coords[idx]);
      let lbl = a[0];
      if (hasManyCarbons && lbl === "C") {
        lbl = degNonH[idx] <= 1 && attachedH[idx] > 0 ? `CH_${attachedH[idx]}` : "";
        if (lbl === "CH_1") lbl = "CH";
      } else if (hasManyCarbons && lbl !== "C" && lbl !== "H" && attachedH[idx] > 0) {
        // Fold explicit OH/NH2 onto heteroatom
        lbl = attachedH[idx] === 1 ? `${lbl}H` : `${lbl}H_${attachedH[idx]}`;
      }
      keepIdx.set(idx, addNode(g, px * scale, py * scale, lbl));
    });

    for (const [ia, ib, ord] of bonds) {
      const a = keepIdx.get(ia), b = keepIdx.get(ib);
      if (a == null || b == null) continue;
      // If collapsing heteroatom H, skip that H bond too
      const elA = mol.atoms[ia]?.[0], elB = mol.atoms[ib]?.[0];
      if (hasManyCarbons && ((elA === "H" && elB !== "C") || (elB === "H" && elA !== "C"))) continue;
      const type = ord === 2 ? "double" : ord === 3 ? "triple" : ord === 1.5 ? "dashed" : "single";
      addBond(g, a, b, type);
    }
    return g;
  }

  /* -------------------- SVG Renderer -------------------- */
  function clipPointFromBox(px, py, ux, uy, box) {
    if (!box || (!box.hw && !box.hh)) return [px, py];
    const tx = Math.abs(ux) > 1e-4 ? (box.hw + 2.5) / Math.abs(ux) : 1e9;
    const ty = Math.abs(uy) > 1e-4 ? (box.hh + 2.5) / Math.abs(uy) : 1e9;
    const t = Math.min(tx, ty);
    return [px + ux * t, py + uy * t];
  }

  function buildAtomTextSvg(x, y, label, fontSize = 13.5) {
    const spans = parseAtomSpans(label);
    if (!spans.length) return "";
    const cls = atomElementClass(label);
    const baselineY = y + fontSize * 0.35;
    let inner = "";
    let prevShift = 0;
    for (const sp of spans) {
      const shift = sp.type === "sub" ? 3.8 : sp.type === "sup" ? -4.8 : 0;
      const dy = shift - prevShift;
      prevShift = shift;
      const fSizeAttr = sp.type === "normal" ? "" : ` font-size="${(fontSize * 0.72).toFixed(1)}"`;
      const dyAttr = Math.abs(dy) > 0.05 ? ` dy="${dy.toFixed(1)}"` : "";
      inner += `<tspan${dyAttr}${fSizeAttr}>${escHtml(sp.text)}</tspan>`;
    }
    return `<text x="${x.toFixed(2)}" y="${baselineY.toFixed(2)}" class="cf-atom ${cls}" font-size="${fontSize}" font-weight="700" font-family="Plus Jakarta Sans,Inter,system-ui,sans-serif" text-anchor="middle" pointer-events="none">${inner}</text>`;
  }

  function renderGraphToSvg(g, opts = {}) {
    if (!g || !g.nodes.length) return "";
    const fontSize = opts.fontSize || 13.5;
    const aromaticStyle = opts.aromaticStyle || "auto"; // "auto" | "kekule" | "circle"

    // Resolve terminal label reversals & bounding boxes
    const resolvedLabels = g.nodes.map((n) => {
      if (!n.label) return "";
      if (n.deg === 1 && n.neighbors.length === 1) {
        const nb = g.nodes[n.neighbors[0]];
        if (nb) {
          return maybeReverseTerminalLabel(n.label, nb.x - n.x, nb.y - n.y);
        }
      }
      return n.label;
    });
    const boxes = resolvedLabels.map((lbl) => estimateAtomBox(lbl, fontSize));

    // Compute dynamic viewBox enclosing ALL nodes & ALL atom boxes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    g.nodes.forEach((n, idx) => {
      const b = boxes[idx];
      const hw = Math.max(6, b.hw + 2);
      const hh = Math.max(6, b.hh + 2);
      if (n.x - hw < minX) minX = n.x - hw;
      if (n.x + hw > maxX) maxX = n.x + hw;
      if (n.y - hh < minY) minY = n.y - hh;
      if (n.y + hh > maxY) maxY = n.y + hh;
    });
    if (!Number.isFinite(minX)) return "";

    const pad = opts.inline ? 12 : 16;
    minX -= pad;
    minY -= pad;
    maxX += pad;
    maxY += pad;

    // Ensure minimum frame size so 2-atom molecules look proportionate rather than giant
    const rawW = maxX - minX;
    const rawH = maxY - minY;
    const minFrameW = opts.inline ? 64 : 108;
    const minFrameH = opts.inline ? 44 : 68;
    if (rawW < minFrameW) {
      const extra = (minFrameW - rawW) / 2;
      minX -= extra;
      maxX += extra;
    }
    if (rawH < minFrameH) {
      const extra = (minFrameH - rawH) / 2;
      minY -= extra;
      maxY += extra;
    }

    const vbW = +(maxX - minX).toFixed(2);
    const vbH = +(maxY - minY).toFixed(2);
    const lines = [];

    // Aromatic circles for **n rings (or toggled benzene circles)
    for (const ring of g.rings) {
      let ringDblCount = 0;
      for (let k = 0; k < ring.vertices.length; k++) {
        const vid = ring.vertices[k];
        const nid = ring.vertices[(k + 1) % ring.vertices.length];
        const b = g.bonds.find((e) => (e.a === vid && e.b === nid) || (e.a === nid && e.b === vid));
        if (b && b.type === "double") ringDblCount++;
      }
      const drawCircle = aromaticStyle === "circle"
        ? (ring.aromatic || (ring.n === 6 && ringDblCount >= 3))
        : (aromaticStyle === "kekule" ? false : ring.aromatic);

      if (drawCircle) {
        const apothem = (BOND_LEN / 2) / Math.tan(Math.PI / ring.n);
        const rInner = apothem * 0.64;
        lines.push(`<circle cx="${ring.cx.toFixed(2)}" cy="${ring.cy.toFixed(2)}" r="${rInner.toFixed(2)}" class="cf-aromatic-ring" fill="none" stroke-width="1.65" stroke-dasharray="4 2.4" />`);
      }
    }

    // Bonds
    for (const bond of g.bonds) {
      const n1 = g.nodes[bond.a], n2 = g.nodes[bond.b];
      if (!n1 || !n2) continue;
      const dx = n2.x - n1.x, dy = n2.y - n1.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) continue;
      const ux = dx / dist, uy = dy / dist;
      const [sx, sy] = clipPointFromBox(n1.x, n1.y, ux, uy, boxes[bond.a]);
      const [ex, ey] = clipPointFromBox(n2.x, n2.y, -ux, -uy, boxes[bond.b]);
      if (Math.hypot(ex - sx, ey - sy) < 2) continue;
      const nx = -uy, ny = ux;

      // Determine effective bond type (handle Kekulé vs Circle toggle on 6-membered rings)
      let bType = bond.type;
      if (bond.ringIds.length) {
        const parentRing = g.rings[bond.ringIds[0]];
        if (parentRing) {
          if (aromaticStyle === "circle" && parentRing.n === 6 && bType === "double") {
            bType = "single";
          } else if (aromaticStyle === "kekule" && parentRing.aromatic && parentRing.n === 6) {
            const idxA = parentRing.vertices.indexOf(bond.a);
            if (idxA >= 0 && idxA % 2 === 0) bType = "double";
          }
        }
      }

      if (bType === "single") {
        lines.push(`<line x1="${sx.toFixed(2)}" y1="${sy.toFixed(2)}" x2="${ex.toFixed(2)}" y2="${ey.toFixed(2)}" class="cf-bond" />`);
      } else if (bType === "dashed") {
        lines.push(`<line x1="${sx.toFixed(2)}" y1="${sy.toFixed(2)}" x2="${ex.toFixed(2)}" y2="${ey.toFixed(2)}" class="cf-bond" stroke-dasharray="4 3" />`);
      } else if (bType === "double") {
        if (bond.ringIds.length) {
          // Outer bond on polygon edge; inner bond offset strictly toward primary ring centroid
          lines.push(`<line x1="${sx.toFixed(2)}" y1="${sy.toFixed(2)}" x2="${ex.toFixed(2)}" y2="${ey.toFixed(2)}" class="cf-bond" />`);
          const rObj = g.rings[bond.ringIds[0]];
          const mx = (sx + ex) / 2, my = (sy + ey) / 2;
          const dot = (rObj.cx - mx) * nx + (rObj.cy - my) * ny;
          const sign = dot >= 0 ? 1 : -1;
          const off = 4.6 * sign;
          const trim = 0.14;
          const isx = sx + (ex - sx) * trim + nx * off;
          const isy = sy + (ey - sy) * trim + ny * off;
          const iex = ex - (ex - sx) * trim + nx * off;
          const iey = ey - (ey - sy) * trim + ny * off;
          lines.push(`<line x1="${isx.toFixed(2)}" y1="${isy.toFixed(2)}" x2="${iex.toFixed(2)}" y2="${iey.toFixed(2)}" class="cf-bond cf-bond-inner" />`);
        } else {
          // Acyclic double bond: symmetric parallel offset
          const off = 2.4;
          lines.push(`<line x1="${(sx + nx * off).toFixed(2)}" y1="${(sy + ny * off).toFixed(2)}" x2="${(ex + nx * off).toFixed(2)}" y2="${(ey + ny * off).toFixed(2)}" class="cf-bond" />`);
          lines.push(`<line x1="${(sx - nx * off).toFixed(2)}" y1="${(sy - ny * off).toFixed(2)}" x2="${(ex - nx * off).toFixed(2)}" y2="${(ey - ny * off).toFixed(2)}" class="cf-bond" />`);
        }
      } else if (bType === "triple") {
        const off = 3.5;
        lines.push(`<line x1="${sx.toFixed(2)}" y1="${sy.toFixed(2)}" x2="${ex.toFixed(2)}" y2="${ey.toFixed(2)}" class="cf-bond" />`);
        lines.push(`<line x1="${(sx + nx * off).toFixed(2)}" y1="${(sy + ny * off).toFixed(2)}" x2="${(ex + nx * off).toFixed(2)}" y2="${(ey + ny * off).toFixed(2)}" class="cf-bond" />`);
        lines.push(`<line x1="${(sx - nx * off).toFixed(2)}" y1="${(sy - ny * off).toFixed(2)}" x2="${(ex - nx * off).toFixed(2)}" y2="${(ey - ny * off).toFixed(2)}" class="cf-bond" />`);
      } else if (bType === "wedge" || bType === "revWedge") {
        const [pStartX, pStartY, pEndX, pEndY] = bType === "wedge" ? [sx, sy, ex, ey] : [ex, ey, sx, sy];
        const tipW = 0.8, wideW = 4.6;
        const pts = [
          `${(pStartX + nx * tipW).toFixed(2)},${(pStartY + ny * tipW).toFixed(2)}`,
          `${(pEndX + nx * wideW).toFixed(2)},${(pEndY + ny * wideW).toFixed(2)}`,
          `${(pEndX - nx * wideW).toFixed(2)},${(pEndY - ny * wideW).toFixed(2)}`,
          `${(pStartX - nx * tipW).toFixed(2)},${(pStartY - ny * tipW).toFixed(2)}`
        ].join(" ");
        lines.push(`<polygon points="${pts}" class="cf-wedge" />`);
      } else if (bType === "dashWedge" || bType === "revDashWedge") {
        const [pStartX, pStartY, pEndX, pEndY] = bType === "dashWedge" ? [sx, sy, ex, ey] : [ex, ey, sx, sy];
        const steps = 5;
        for (let sIdx = 1; sIdx <= steps; sIdx++) {
          const t = sIdx / (steps + 0.3);
          const cxBar = pStartX + (pEndX - pStartX) * t;
          const cyBar = pStartY + (pEndY - pStartY) * t;
          const wBar = 1.0 + t * 3.6;
          lines.push(`<line x1="${(cxBar + nx * wBar).toFixed(2)}" y1="${(cyBar + ny * wBar).toFixed(2)}" x2="${(cxBar - nx * wBar).toFixed(2)}" y2="${(cyBar - ny * wBar).toFixed(2)}" class="cf-bond" />`);
        }
      }
    }

    // Atom Labels on top
    for (let idx = 0; idx < g.nodes.length; idx++) {
      if (!resolvedLabels[idx]) continue;
      lines.push(buildAtomTextSvg(g.nodes[idx].x, g.nodes[idx].y, resolvedLabels[idx], fontSize));
    }

    const cls = opts.inline ? "cf-svg cf-svg-inline" : "cf-svg";
    const styleAttr = opts.inline
      ? ` style="width:${Math.round(vbW * 0.92)}px;height:${Math.round(vbH * 0.92)}px;max-height:72px;max-width:100%"`
      : ` style="max-width:${Math.max(180, Math.round(vbW * 1.45))}px"`;
    return `<svg class="${cls}" viewBox="${minX.toFixed(2)} ${minY.toFixed(2)} ${vbW} ${vbH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escHtml(opts.label || "2D chemical structure")}"${styleAttr}>${lines.join("")}</svg>`;
  }

  function renderSvg(chemfigExpr, opts = {}) {
    try {
      const g = parse(chemfigExpr);
      if (!g.nodes.length) return "";
      // Check if an aromatic toggle button makes sense
      return renderGraphToSvg(g, opts);
    } catch (_) {
      return "";
    }
  }

  function hasToggleableBenzene(chemfigExpr) {
    try {
      const g = parse(chemfigExpr);
      return g.rings.some((ring) => {
        if (ring.n !== 6) return false;
        if (ring.aromatic) return true;
        let dbl = 0;
        for (let k = 0; k < 6; k++) {
          const a = ring.vertices[k], b = ring.vertices[(k + 1) % 6];
          const bond = g.bonds.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
          if (bond && bond.type === "double") dbl++;
        }
        return dbl >= 3;
      });
    } catch (_) {
      return false;
    }
  }

  function toggleAromaticExpr(chemfigExpr) {
    const clean = unwrapChemfigCommand(chemfigExpr);
    if (/\*\*6\(\s*------\s*\)/.test(clean)) {
      return `\\chemfig{${clean.replace(/\*\*6\(\s*------\s*\)/g, "*6(=-=-=-)")}}`;
    }
    return `\\chemfig{${clean.replace(/\*6\(\s*(?:=-){3}\s*\)|\*6\(\s*(?:-=){3}\s*\)/g, "**6(------)")}}`;
  }

  /* -------------------- Rich Card & Mixed Equation / Scheme Renderers -------------------- */
  function containsChemFig(text) {
    return /\\chemfig(?:\s*\[[^\]]*\])?\s*\{/.test(String(text || ""));
  }

  /* Extract all \chemfig[...]{...} segments from any LaTeX / markdown snippet */
  function extractChemFigs(text) {
    const src = String(text || "");
    const results = [];
    const re = /\\chemfig(?:\s*\[[^\]]*\])?\s*\{/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      const openIdx = src.indexOf("{", m.index);
      const closeIdx = findMatchingBrace(src, openIdx);
      if (closeIdx === -1) continue;
      results.push({
        start: m.index,
        end: closeIdx + 1,
        raw: src.slice(m.index, closeIdx + 1),
        body: src.slice(openIdx + 1, closeIdx)
      });
      re.lastIndex = closeIdx + 1;
    }
    return results;
  }

  /* Normalize chemfig arrows inside reaction schemes into standard KaTeX syntax */
  function normalizeSchemeArrowSegment(seg) {
    let s = String(seg || "").trim();
    if (!s) return "";
    // \arrow{->[top][bot]} -> \xrightarrow[bot]{top}
    s = s.replace(/\\arrow\s*\{([^}]*)\}/g, (_, spec) => {
      const m = spec.match(/^\s*(?:->|=>|<=>)\s*(?:\[([^\]]*)\])?(?:\[([^\]]*)\])?/);
      if (!m) return "\\longrightarrow";
      const top = (m[1] || "").trim();
      const bot = (m[2] || "").trim();
      if (top && bot) return `\\xrightarrow[${bot}]{${top}}`;
      if (top) return `\\xrightarrow{${top}}`;
      return "\\longrightarrow";
    });
    s = s.replace(/->\[([^\]]*)\]\[([^\]]*)\]/g, "\\xrightarrow[$2]{$1}");
    s = s.replace(/->\[([^\]]*)\]/g, "\\xrightarrow{$1}");
    s = s.replace(/(^|\s)->($|\s)/g, "$1\\longrightarrow$2");
    s = s.replace(/<=>/g, "\\rightleftharpoons");
    return s.trim();
  }

  function renderLatexHelper(tex, isDisplay, fallbackFn) {
    if (typeof fallbackFn === "function") return fallbackFn(tex, isDisplay);
    if (typeof root !== "undefined" && root.katex && typeof root.katex.renderToString === "function") {
      try {
        return root.katex.renderToString(tex, { displayMode: isDisplay, throwOnError: true, trust: true, strict: false });
      } catch (_) {}
    }
    return `<code class="latex-inline">${escHtml(tex)}</code>`;
  }

  /* Renders a single \chemfig{...} OR a mixed reaction scheme containing \chemfig{...} + \ce{...} */
  function renderHtml(rawExpr, opts = {}) {
    const src = String(rawExpr || "").trim()
      .replace(/^```chemfig\s*\r?\n?/i, "")
      .replace(/```$/i, "")
      .replace(/^\$\$|\$\$$/g, "")
      .replace(/^\\\[|\\\]$/g, "")
      .replace(/^\\\(|\\\)$/g, "")
      .replace(/^\$|\$$/g, "")
      .replace(/\\schemestart|\\schemestop/g, "")
      .trim();

    if (!src) return "";
    const hits = extractChemFigs(src);

    // If raw fenced chemfig block omitted `\chemfig{...}` wrapper (e.g. ```chemfig\n*6(=-=-=-)\n```)
    if (!hits.length) {
      const wrapped = `\\chemfig{${src}}`;
      const svg = renderSvg(wrapped, opts);
      if (!svg) return "";
      if (opts.inline) {
        return `<span class="chemfig-inline-wrap" title="${escHtml(wrapped)}">${svg}</span>`;
      }
      return buildCardHtml(wrapped, svg, opts);
    }

    // Single pure \chemfig{...} command
    const beforeFirst = src.slice(0, hits[0].start).trim();
    const afterLast = src.slice(hits[hits.length - 1].end).trim();
    if (hits.length === 1 && !beforeFirst && !afterLast) {
      const svg = renderSvg(hits[0].raw, opts);
      if (!svg) return "";
      if (opts.inline) {
        return `<span class="chemfig-inline-wrap" title="${escHtml(hits[0].raw)}">${svg}</span>`;
      }
      return buildCardHtml(hits[0].raw, svg, opts);
    }

    // Molecule gallery without reaction operators (e.g. \chemfig{A} \qquad \chemfig{B})
    if (!opts.inline && hits.length > 1) {
      const gapRe = /^(?:\\q?quad|\\,|\\;|\\:|\\!|\\ |[\s,;])*$/;
      let isGalleryOnly = gapRe.test(beforeFirst) && gapRe.test(afterLast);
      for (let i = 1; i < hits.length && isGalleryOnly; i++) {
        if (!gapRe.test(src.slice(hits[i - 1].end, hits[i].start))) isGalleryOnly = false;
      }
      if (isGalleryOnly) {
        const cards = hits
          .map((h) => {
            const svg = renderSvg(h.raw, opts);
            return svg ? buildCardHtml(h.raw, svg, opts) : "";
          })
          .filter(Boolean)
          .join("");
        if (cards) return `<div class="chemfig-gallery">${cards}</div>`;
      }
    }

    // Mixed reaction scheme (e.g. \chemfig{...} + \ce{Cl2} \xrightarrow{FeCl3} \chemfig{...})
    const pieces = [];
    let cursor = 0;
    for (const h of hits) {
      const between = src.slice(cursor, h.start);
      if (between.trim()) {
        const norm = normalizeSchemeArrowSegment(between);
        if (norm) pieces.push(`<span class="chemfig-scheme-op">${renderLatexHelper(norm, false, opts.renderLatex)}</span>`);
      }
      const svg = renderSvg(h.raw, { inline: true, label: inferTitleFromExpr(h.raw) });
      if (svg) pieces.push(`<span class="chemfig-scheme-mol" data-chemfig="${escHtml(h.raw)}">${svg}</span>`);
      cursor = h.end;
    }
    const tail = src.slice(cursor);
    if (tail.trim()) {
      const norm = normalizeSchemeArrowSegment(tail);
      if (norm) pieces.push(`<span class="chemfig-scheme-op">${renderLatexHelper(norm, false, opts.renderLatex)}</span>`);
    }

    if (opts.inline) {
      return `<span class="chemfig-inline-scheme">${pieces.join("")}</span>`;
    }

    return `<div class="chemfig-card chemfig-scheme-card" data-chemfig-raw="${escHtml(src)}">` +
      `<div class="chemfig-card-head">` +
        `<span class="chemfig-card-title">2D Reaction Scheme</span>` +
        `<div class="chemfig-card-actions">` +
          `<button type="button" class="chemfig-btn" data-cf-copy title="Copy LaTeX / ChemFig source">Copy TeX</button>` +
        `</div>` +
      `</div>` +
      `<div class="chemfig-scheme-row">${pieces.join("")}</div>` +
    `</div>`;
  }

  function buildCardHtml(rawCmd, svg, opts = {}) {
    const title = opts.title || inferTitleFromExpr(rawCmd);
    const canToggle = hasToggleableBenzene(rawCmd);
    const isCircle = /\*\*6\(------\)/.test(rawCmd.replace(/\s+/g, ""));
    return `<div class="chemfig-card" data-chemfig-raw="${escHtml(rawCmd)}" data-cf-mode="${isCircle ? "circle" : "kekule"}">` +
      `<div class="chemfig-card-head">` +
        `<span class="chemfig-card-title">${escHtml(title)}</span>` +
        `<div class="chemfig-card-actions">` +
          (canToggle ? `<button type="button" class="chemfig-btn" data-cf-toggle title="Switch between Kekulé alternating bonds and delocalised aromatic ring">${isCircle ? "Kekulé" : "Ring ◯"}</button>` : "") +
          `<button type="button" class="chemfig-btn" data-cf-copy title="Copy ChemFig LaTeX code">Copy TeX</button>` +
          `<button type="button" class="chemfig-btn" data-cf-expand title="Inspect structure full-size">⤢</button>` +
        `</div>` +
      `</div>` +
      `<div class="chemfig-stage">${svg}</div>` +
    `</div>`;
  }

  return {
    PRESETS,
    parse,
    renderSvg,
    renderGraphToSvg,
    renderHtml,
    fromMoleculeData,
    extractChemFigs,
    containsChemFig,
    lookupPreset,
    toggleAromaticExpr,
    hasToggleableBenzene,
    inferTitleFromExpr,
    findMatchingBrace
  };
});
