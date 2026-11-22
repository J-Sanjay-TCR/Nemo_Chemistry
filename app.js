/* Nemo — AI Chemistry Tutor (front-end).
   Works fully offline in "study mode". Open via http(s) with server.js (or set AI_ENDPOINT) for live AI answers.
   Never put a secret API key in this file. */
"use strict";

/* Global aggressive exception handling guards */
window.addEventListener("error", (e) => {
  console.warn("[Nemo Handled Global Error]", e.message, e.filename, e.lineno);
});
window.addEventListener("unhandledrejection", (e) => {
  console.warn("[Nemo Handled Global Rejection]", e.reason);
});

const AI_ENDPOINT = "/api/chat"; // High-performance Gemini Flash & adaptive server backend

/* ============================== helpers ============================== */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

function safeOn(target, event, handler, options) {
  try {
    const el = typeof target === "string" ? $(target) : target;
    if (el && typeof el.addEventListener === "function") {
      el.addEventListener(event, handler, options);
      return true;
    }
  } catch (err) {
    console.warn("safeOn failed for", target, event, err);
  }
  return false;
}

function copyTextSafe(text, btnEl, successLabel = "✓ Copied!", resetLabel = null) {
  const str = String(text || "");
  if (!str) return Promise.resolve(false);
  const flash = () => {
    if (!btnEl) return;
    const orig = resetLabel != null ? resetLabel : (btnEl._copyOrigLabel || btnEl.textContent || "");
    btnEl._copyOrigLabel = orig;
    clearTimeout(btnEl._copyTimer);
    btnEl.textContent = successLabel;
    btnEl.classList.add("copied");
    btnEl._copyTimer = setTimeout(() => {
      btnEl.textContent = orig;
      btnEl.classList.remove("copied");
    }, 1800);
  };
  if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    return navigator.clipboard.writeText(str).then(() => {
      flash();
      return true;
    }).catch(() => fallbackExecCopy(str, flash));
  }
  return Promise.resolve(fallbackExecCopy(str, flash));
}

function fallbackExecCopy(str, onSuccess) {
  try {
    const ta = document.createElement("textarea");
    ta.value = str;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand("copy");
    ta.remove();
    if (ok && onSuccess) onSuccess();
    return Boolean(ok);
  } catch (_) {
    return false;
  }
}

const NemoOverlay = (() => {
  const priority = ["tour", "lightbox", "founder", "sidebar", "portal", "popover"];
  const registry = new Map();

  function getFocusable(root) {
    if (!root) return [];
    const sel = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(root.querySelectorAll(sel)).filter((node) => {
      if (node.offsetParent === null && window.getComputedStyle(node).position !== "fixed") return false;
      const st = window.getComputedStyle(node);
      return st.display !== "none" && st.visibility !== "hidden";
    });
  }

  function register(name, spec) {
    registry.set(name, spec);
  }

  function isAnyModalOpen() {
    for (const name of ["tour", "lightbox", "founder", "sidebar", "portal"]) {
      const spec = registry.get(name);
      if (spec && typeof spec.isOpen === "function" && spec.isOpen()) return true;
    }
    return false;
  }

  function syncBodyScrollLock() {
    const lbOpen = registry.get("lightbox")?.isOpen?.();
    const founderOpen = registry.get("founder")?.isOpen?.();
    document.body.style.overflow = (lbOpen || founderOpen) ? "hidden" : "";
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      for (const name of priority) {
        const spec = registry.get(name);
        if (spec && typeof spec.isOpen === "function" && spec.isOpen()) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof spec.close === "function") spec.close(true);
          return;
        }
      }
      return;
    }
    if (e.key === "Tab") {
      for (const name of ["tour", "lightbox", "founder", "sidebar"]) {
        const spec = registry.get(name);
        if (spec && typeof spec.isOpen === "function" && spec.isOpen()) {
          const root = typeof spec.getFocusRoot === "function" ? spec.getFocusRoot() : null;
          if (!root) return;
          const items = getFocusable(root);
          if (!items.length) return;
          const first = items[0];
          const last = items[items.length - 1];
          const active = document.activeElement;
          if (e.shiftKey) {
            if (active === first || !root.contains(active)) {
              e.preventDefault();
              last.focus({ preventScroll: true });
            }
          } else if (active === last || !root.contains(active)) {
            e.preventDefault();
            first.focus({ preventScroll: true });
          }
          return;
        }
      }
    }
  });

  return { register, isAnyModalOpen, syncBodyScrollLock };
})();
window.NemoOverlay = NemoOverlay;

function animateWorkspacePanelsEntrance(visibleIds, direction = 0) {
  const ws = document.querySelector(".workspace");
  if (!ws) return;
  const targets = (visibleIds && visibleIds.length)
    ? visibleIds.map((id) => document.getElementById(id)).filter((p) => p && p.style.display !== "none")
    : Array.from(ws.querySelectorAll(":scope > .panel")).filter((p) => p.style.display !== "none");
  if (!targets.length) return;

  targets.forEach((p) => {
    if (p.__panelEnterRaf) {
      cancelAnimationFrame(p.__panelEnterRaf);
      p.__panelEnterRaf = 0;
    }
    if (p.__panelEnterTimer) {
      clearTimeout(p.__panelEnterTimer);
      p.__panelEnterTimer = 0;
    }
    p.classList.remove("panel-tab-enter");
  });

  if (reduceMotion || document.body.classList.contains("no-effects")) {
    targets.forEach((p) => {
      p.style.removeProperty("--panel-enter-x");
      p.style.removeProperty("--panel-enter-y");
      p.style.removeProperty("--panel-enter-delay");
    });
    return;
  }

  const dx = direction > 0 ? "14px" : direction < 0 ? "-14px" : "0px";
  const dy = direction === 0 ? "12px" : "8px";
  targets.forEach((p, idx) => {
    p.style.setProperty("--panel-enter-x", dx);
    p.style.setProperty("--panel-enter-y", dy);
    p.style.setProperty("--panel-enter-delay", `${Math.min(idx, 5) * 32}ms`);
    p.classList.add("panel-tab-enter");
  });

  // Commit initial hidden transform/opacity state before removing class so CSS transitions always fire
  void ws.offsetWidth;

  const rafId = requestAnimationFrame(() => {
    targets.forEach((p) => {
      p.__panelEnterRaf = 0;
      p.classList.remove("panel-tab-enter");
      p.__panelEnterTimer = setTimeout(() => {
        p.__panelEnterTimer = 0;
        p.style.removeProperty("--panel-enter-x");
        p.style.removeProperty("--panel-enter-y");
        p.style.removeProperty("--panel-enter-delay");
      }, 480);
    });
  });
  targets.forEach((p) => { p.__panelEnterRaf = rafId; });
}
window.animateWorkspacePanelsEntrance = animateWorkspacePanelsEntrance;

function ensurePanelVisible(panelId) {
  if (!panelId) return;
  const panel = document.getElementById(panelId);
  if (!panel) return;
  if (panel.style.display === "none") {
    const ws = document.querySelector(".workspace");
    if (ws) ws.dataset.filter = "all";
    const revealedIds = [];
    document.querySelectorAll(".workspace > .panel").forEach((p) => {
      if (p.style.display === "none") revealedIds.push(p.id);
      p.style.display = "";
    });
    document.querySelectorAll(".ws-tab").forEach((b) => {
      const isAll = b.dataset.filter === "all";
      b.classList.toggle("active", isAll);
      b.setAttribute("aria-selected", String(isAll));
    });
    const filterBar = document.getElementById("workspaceFilterStatus");
    if (filterBar) filterBar.hidden = true;
    animateWorkspacePanelsEntrance(revealedIds.length ? revealedIds : null, 0);
  }
}
window.ensurePanelVisible = ensurePanelVisible;

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DATA = window.NEMO_DATA || { quiz: [], formulas: [], topics: [] };
const MOLS = window.NEMO_MOLECULES || [];

/* ---- Rules & Exceptions library (data in lib-*.js) ---- */
const LIB = (window.NEMO_LIBRARY || []).map((e, i) => Object.assign({ id: "lib" + i }, e));
const fold = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']s\b/g, "");
const LIB_STOP = new Set(["and", "the", "of", "in", "for", "with", "versus", "from", "its", "rule", "rules", "reaction", "reactions", "effect", "test", "tests", "law", "laws", "explain", "what", "how", "why", "tell", "about", "give", "show", "please", "define", "does", "are", "can", "you", "that", "this", "which", "product", "products"]);
const libTokens = (s) => fold(s).split(/[^a-z0-9]+/).filter((t) => t.length >= 3 && !LIB_STOP.has(t));
const LIB_DF = new Map();
LIB.forEach((e) => {
  e.nt = Array.from(new Set(libTokens(e.n))); e.wt = Array.from(new Set(libTokens(e.w || "")));
  e.hay = fold([e.n, e.ch, e.w || "", e.s, e.e || "", e.x || ""].join(" "));
  e.nt.forEach((t) => LIB_DF.set(t, (LIB_DF.get(t) || 0) + 1));
});
const LEVEL_LABEL = { Board: "Board", Main: "JEE Main", Adv: "JEE Adv." };
/* Offline question -> library entry. A name token counts when it appears (prefix-wise) in the question; rare tokens
   (person names, "bredt", "lucas") weigh more than common ones ("temperature"), and the entry must also explain
   most of what the question asks. Returns null when nothing is a confident match. */
function searchLibrary(q) {
  const qt = libTokens(q); if (!qt.length) return null;
  const hit = (t) => qt.some((w) => w.startsWith(t) || (w.length >= 5 && t.startsWith(w)));
  const hits = [];
  for (const e of LIB) {
    const m = e.nt.filter(hit); if (!m.length) continue;
    const S = m.reduce((s, t) => s + t.length / Math.sqrt(LIB_DF.get(t) || 1), 0);
    const rare = m.some((t) => (LIB_DF.get(t) || 1) <= 2);
    if (S < 4 || (m.length < 2 && !rare)) continue;
    const nameRatio = m.reduce((s, t) => s + t.length, 0) / e.nt.reduce((s, t) => s + t.length, 0);
    const qcov = qt.filter((w) => e.nt.some((t) => w.startsWith(t) || (w.length >= 5 && t.startsWith(w)))).length / qt.length;
    hits.push({ e, score: S * (0.5 + nameRatio) * (0.5 + qcov) });
  }
  hits.sort((a, b) => b.score - a.score);
  if (hits.length) return { best: hits[0].e, score: hits[0].score, related: hits.slice(1, 4).filter((h) => h.score >= hits[0].score * 0.4).map((h) => h.e) };
  /* second chance: every long term of the question occurs somewhere in an entry's text (e.g. "bakelite", "sucrose", "Buna-S").
     Only accepted when the term is distinctive, i.e. it appears in at most six entries. */
  const long = qt.filter((w) => w.length >= 4); if (!long.length) return null;
  const cnt = (str, w) => str.split(w).length - 1;
  const rows = LIB.filter((e) => long.every((w) => e.hay.includes(w))).map((e) => ({ e, n: long.reduce((s, w) => s + 5 * cnt(fold(e.n), w) + 2 * cnt(fold(e.s), w) + cnt(e.hay, w), 0) })).sort((a, b) => b.n - a.n);
  return rows.length && rows.length <= 6 ? { best: rows[0].e, score: 2, related: rows.slice(1, 3).map((r) => r.e) } : null;
}
function libraryAnswer(e, related) {
  const parts = ["**" + e.n + "** (" + e.b + " · " + e.ch + " · " + e.t + " · " + (LEVEL_LABEL[e.l] || e.l) + ")", e.s];
  if (e.w) parts.push("**Credit / origin:** " + e.w);
  if (e.e) parts.push("**Example:** " + e.e);
  if (e.x) parts.push("**Exam trap:** " + e.x);
  if (related && related.length) parts.push("**Also in the Library:** " + related.map((r) => r.n).join(" · "));
  return parts.join("\n\n");
}

/* localStorage can throw (private mode, blocked data) so every access is wrapped. */
const store = {
  get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch (_) { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (_) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (_) { /* ignore */ } }
};

function el(tag, props, ...kids) {
  const n = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (k === "class") n.className = v; else if (k === "text") n.textContent = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else if (v !== false && v != null) n.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids) if (kid != null) n.append(kid);
  return n;
}
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ============================== safe mini-markdown with KaTeX math rendering ============================== */
function renderPureLatex(cleaned, isDisplay = false) {
  if (!cleaned) return "";
  if (typeof window.katex !== "undefined" && typeof window.katex.renderToString === "function") {
    try {
      return window.katex.renderToString(cleaned, {
        displayMode: isDisplay,
        throwOnError: true,
        trust: true,
        strict: false
      });
    } catch (_) {
      // Fall through silently without flashing red KaTeX parse-error spans
    }
  }
  return `<code class="${isDisplay ? "latex-block" : "latex-inline"}">${esc(cleaned)}</code>`;
}

function renderLatex(latex, isDisplay = false) {
  const cleaned = String(latex || "").trim();
  if (!cleaned) return "";
  if (window.NemoChemFig && window.NemoChemFig.containsChemFig(cleaned)) {
    const cfHtml = window.NemoChemFig.renderHtml(cleaned, {
      inline: !isDisplay,
      renderLatex: (tex, d) => renderPureLatex(String(tex || "").trim(), d)
    });
    if (cfHtml) return cfHtml;
  }
  return renderPureLatex(cleaned, isDisplay);
}

function protectInlineMath(src, makePlaceholder) {
  let text = String(src || "");
  text = text.replace(/\\\(([^\n]+?)\\\)/g, (m, math) =>
    makePlaceholder(`<span class="chat-math-inline">${renderLatex(math, false)}</span>`)
  );
  text = text.replace(/(^|[^\\])\$(?!\s)([^\$\n]*?\S)\$(?!\d)/g, (m, prefix, math) => {
    const inner = math.trim();
    if (!inner || /^\d[\d,.]*\s+(?:to|and|or|per|for|in|vs|-|–)\s*$/i.test(inner)) return m;
    // Skip accidental currency + prose spans (e.g. "$5 while pressure $P$")
    if (/^\d[\d,.]*\s+[a-z]{2,}/i.test(inner) && !/[\\^_=+\-*/{}]/.test(inner)) return m;
    return `${prefix}${makePlaceholder(`<span class="chat-math-inline">${renderLatex(inner, false)}</span>`)}`;
  });
  return text;
}

function inlineMd(s) {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[\s(/'“‘]|&quot;|&#39;|&gt;)\*([^*\s][^*]*?)\*(?=[\s).,;:!?'”’/–—-]|&quot;|&#39;|&lt;|$)/g, "$1<em>$2</em>");
  return s;
}

function mdInlineToHtml(src) {
  if (src == null) return "";
  let text = String(src).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const tokens = [];
  const placeholder = (html) => {
    const idx = tokens.length;
    tokens.push(html);
    return `___KATEX_ITOK_${idx}___`;
  };
  // Protect code before math so dollar signs inside backticks aren't parsed as LaTeX
  text = text.replace(/`([^`]+)`/g, (m, c) => placeholder(`<code>${esc(c)}</code>`));
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (m, math) => placeholder(`<span class="chat-math-inline">${renderLatex(math, false)}</span>`));
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (m, math) => placeholder(`<span class="chat-math-inline">${renderLatex(math, false)}</span>`));
  text = protectInlineMath(text, placeholder);
  let out = esc(text).replace(/\\\|/g, "|");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[\s(/'“‘]|&quot;|&#39;|&gt;)\*([^*\s][^*]*?)\*(?=[\s).,;:!?'”’/–—-]|&quot;|&#39;|&lt;|$)/g, "$1<em>$2</em>");
  return out.replace(/___KATEX_ITOK_(\d+)___/g, (m, idx) => tokens[Number(idx)] || "");
}

function mdToHtml(src) {
  if (!src) return "";
  let text = String(src).replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const tokens = [];
  const placeholder = (html, isBlock = false) => {
    const idx = tokens.length;
    tokens.push({ html, isBlock });
    return `___KATEX_TOK_${idx}___`;
  };

  // 1. Extract and protect Code Blocks (```lang ... ```) and Inline Code (`...`) BEFORE math
  text = text.replace(/```([a-zA-Z0-9_-]*)\r?\n?([\s\S]*?)```/g, (m, lang, code) => {
    const normLang = String(lang || "").trim().toLowerCase();
    if (window.NemoChemFig && (normLang === "chemfig" || (normLang === "latex" && window.NemoChemFig.containsChemFig(code)))) {
      const rendered = window.NemoChemFig.renderHtml(code, {
        inline: false,
        renderLatex: (tex, d) => renderPureLatex(String(tex || "").trim(), d)
      });
      if (rendered) {
        return "\n\n" + placeholder(`<div class="chat-chemfig-block">${rendered}</div>`, true) + "\n\n";
      }
    }
    return "\n\n" + placeholder(`<pre><code class="lang-${esc(lang)}">${esc(code.trim())}</code></pre>`, true) + "\n\n";
  });
  text = text.replace(/`([^`]+)`/g, (m, c) => {
    return placeholder(`<code>${esc(c)}</code>`, false);
  });

  // 2. Extract and protect Display Math ($$...$$ and \[...\]), preserving inline formatting inside table rows
  const isInsidePipeRow = (offset) => {
    const lineStart = text.lastIndexOf("\n", offset - 1) + 1;
    const lineEnd = text.indexOf("\n", offset);
    const fullLine = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd);
    return /^\s*\|/.test(fullLine);
  };
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (m, math, offset) => {
    if (isInsidePipeRow(offset)) {
      return placeholder(`<span class="chat-math-inline">${renderLatex(math, false)}</span>`, false);
    }
    const isCf = Boolean(window.NemoChemFig && window.NemoChemFig.containsChemFig(math));
    const rendered = renderLatex(math, true);
    return "\n\n" + placeholder(`<div class="${isCf ? "chat-chemfig-block" : "chat-math-block"}" tabindex="0">${rendered}</div>`, true) + "\n\n";
  });
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (m, math, offset) => {
    if (isInsidePipeRow(offset)) {
      return placeholder(`<span class="chat-math-inline">${renderLatex(math, false)}</span>`, false);
    }
    const isCf = Boolean(window.NemoChemFig && window.NemoChemFig.containsChemFig(math));
    const rendered = renderLatex(math, true);
    return "\n\n" + placeholder(`<div class="${isCf ? "chat-chemfig-block" : "chat-math-block"}" tabindex="0">${rendered}</div>`, true) + "\n\n";
  });

  // 3. Extract and protect Inline Math ($...$ and \(...\))
  text = protectInlineMath(text, (html) => placeholder(html, false));

  // 4. Line-by-line block parsing
  const lines = text.split("\n");
  const out = [];
  const isTableSep = (l) => /^\s*\|?(?:\s*:?-{2,}:?\s*\|)+\s*:?-{2,}:?\s*\|?\s*$/.test(l) || (/^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(l) && l.includes("-"));
  const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
  const splitRow = (l) => {
    let s = String(l || "").trim();
    if (s.startsWith("|")) s = s.slice(1);
    if (s.endsWith("|") && !s.endsWith("\\|")) s = s.slice(0, -1);
    const cells = [];
    let cur = "";
    for (let k = 0; k < s.length; k++) {
      if (s[k] === "\\" && s[k + 1] === "|") {
        cur += "|";
        k++;
      } else if (s[k] === "|") {
        cells.push(cur.trim());
        cur = "";
      } else {
        cur += s[k];
      }
    }
    cells.push(cur.trim());
    return cells;
  };
  const isNumericCell = (val) => {
    const clean = String(val || "").replace(/\*\*|\*/g, "").trim();
    if (!clean) return false;
    return /^[~≈+\-\u2212]?\d+(?:\.\d+)?(?:\s*(?:%|°|°C|K|eV|pm|Å|nm|kJ\/mol|kJ|g\/mol))?$/i.test(clean);
  };

  function formatInline(str) {
    str = esc(str).replace(/\\\|/g, "|");
    str = str.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    str = str.replace(/(^|[\s(/'“‘]|&quot;|&#39;|&gt;)\*([^*\s][^*]*?)\*(?=[\s).,;:!?'”’/–—-]|&quot;|&#39;|&lt;|$)/g, "$1<em>$2</em>");
    return str;
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    // Standalone block placeholder line (<div class="chat-math-block"> or <pre>)
    const tokMatch = line.trim().match(/^___KATEX_TOK_(\d+)___$/);
    if (tokMatch && tokens[Number(tokMatch[1])] && tokens[Number(tokMatch[1])].isBlock) {
      out.push(line.trim());
      i++;
      continue;
    }

    // Markdown Table
    if (isTableRow(line) && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const head = splitRow(line);
      const sepCells = splitRow(lines[i + 1]);
      i += 2;
      const rawRows = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rawRows.push(splitRow(lines[i++]));
      }
      const colCount = Math.max(1, head.length);
      const rows = rawRows.map((r) => {
        const padded = r.slice(0, colCount);
        while (padded.length < colCount) padded.push("");
        return padded;
      });
      const numCols = head.map((_, cIdx) => {
        const sep = (sepCells[cIdx] || "").trim();
        if (!sep.startsWith(":") && sep.endsWith(":")) return true;
        const nonEmpty = rows.map((r) => r[cIdx]).filter((v) => v && v.trim() && v.trim() !== "—");
        if (!nonEmpty.length) return false;
        const hits = nonEmpty.filter(isNumericCell).length;
        return hits / nonEmpty.length >= 0.7;
      });
      out.push(
        '<div class="chat-table-card">' +
          '<div class="chat-table-bar">' +
            `<span class="chat-table-label">Structured Table · ${rows.length} rows × ${colCount} cols</span>` +
            '<div class="chat-table-actions">' +
              '<button type="button" class="chat-table-btn" data-tc-open title="Open in interactive Study Table Canvas">⊞ View in Canvas</button>' +
              '<button type="button" class="chat-table-btn" data-tc-copy title="Copy table as Markdown">Copy MD</button>' +
            '</div>' +
          '</div>' +
          '<div class="table-wrap"><table><thead><tr>' +
            head.map((c, idx) => `<th${numCols[idx] ? ' class="num-col"' : ""}>${formatInline(c)}</th>`).join("") +
          '</tr></thead><tbody>' +
            rows.map((r) => '<tr>' + r.map((c, idx) => `<td${numCols[idx] ? ' class="num-col"' : ""}>${formatInline(c)}</td>`).join("") + '</tr>').join("") +
          '</tbody></table></div>' +
        '</div>'
      );
      continue;
    }

    // Unordered List
    if (/^\s*[-*•]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^\s*[-*•]\s+/, ""));
      }
      out.push("<ul>" + items.map((t) => "<li>" + formatInline(t) + "</li>").join("") + "</ul>");
      continue;
    }

    // Ordered List
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ""));
      }
      out.push("<ol>" + items.map((t) => "<li>" + formatInline(t) + "</li>").join("") + "</ol>");
      continue;
    }

    // Headings
    if (/^#{1,6}\s+/.test(line)) {
      const level = line.match(/^#{1,6}/)[0].length;
      const hTag = Math.min(6, level + 1);
      const title = line.replace(/^#{1,6}\s+/, "");
      out.push(`<h${hTag} class="chat-heading">${formatInline(title)}</h${hTag}>`);
      i++;
      continue;
    }

    // Horizontal Rule
    if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      out.push('<hr class="chat-hr">');
      i++;
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      out.push('<div class="formula-line">' + formatInline(line.replace(/^>\s?/, "")) + "</div>");
      i++;
      continue;
    }

    // Standard Paragraph
    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^```/.test(lines[i]) &&
      !/^\s*[-*•]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i]) &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !isTableRow(lines[i]) &&
      !(() => {
        const tm = lines[i].trim().match(/^___KATEX_TOK_(\d+)___$/);
        return Boolean(tm && tokens[Number(tm[1])] && tokens[Number(tm[1])].isBlock);
      })()
    ) {
      para.push(lines[i++]);
    }
    if (!para.length) { para.push(lines[i++]); }
    out.push("<p>" + para.map(formatInline).join("<br>") + "</p>");
  }

  let finalHtml = out.join("\n");
  // Restore all protected placeholders
  finalHtml = finalHtml.replace(/___KATEX_TOK_(\d+)___/g, (m, idx) => {
    const entry = tokens[Number(idx)];
    return entry ? entry.html : "";
  });
  return finalHtml;
}
const mdToPlain = (md) => String(md).replace(/```[\s\S]*?```/g, " ").replace(/\$\$[\s\S]*?\$\$/g, " ").replace(/\$[^$]*\$/g, " ").replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, " ").replace(/\|/g, ", ").replace(/[*`>#_]/g, "").replace(/\s+/g, " ").trim();

/* ============================== chat ============================== */
const messagesEl = $("#messages"), input = $("#questionInput"), sendBtn = $("#sendBtn");
const GREETING = "**Hi! I'm Nemo.**\nAsk me a chemistry question. I can explain concepts, derive formulas, compare mechanisms and help you practise CBSE and JEE topics.\n\nTry a quick prompt below, open the **Formula Bank**, or test yourself in **Practice**.";
const DIAGRAM_ENDPOINT = "/api/generate-diagram";
let diagramModeActive = false;

const DEPRECATED_GEMINI_MODEL_RE = /(?:^|\/)gemini-(?:1\.5|2\.0|pro\b)/i;
function normalizeGeminiModel(raw, fallback = "gemini-4-hydrogen") {
  const m = String(raw || "").trim().replace(/^models\//i, "");
  if (!m || DEPRECATED_GEMINI_MODEL_RE.test(m)) return fallback;
  return m;
}
function isPoisonedHistoryText(txt) {
  const s = String(txt || "");
  if (!s) return true;
  return (
    s.includes("Answered via Nemo's Autonomous Chemistry Core") ||
    (s.includes("### 💡 Scientific Reasoning & Analysis") && s.includes("Every chemical and physical transformation is governed by")) ||
    s.includes("Nemo AI could not complete a live model response")
  );
}

let history = store.get("nemo.chat.v2", [])
  .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && !(m.role === "assistant" && isPoisonedHistoryText(m.content)))
  .slice(-40);
let endpoint = AI_ENDPOINT || "";
/* Optional "bring your own key" mode for the single-file build (no server): the key lives only in this browser's localStorage. */
const AI_CFG_KEY = "nemo.gemini.v1";
const GEMINI_DEFAULT_MODEL = "gemini-4-hydrogen", GEMINI_FALLBACKS = ["gemini-4-hydrogen", "gemini-3.1-flash-lite"];
/* the tutor instruction comes from system-prompt.js (window.NEMO_PROMPT); this short fallback is only used if that file is missing */
const PROMPT_FALLBACK = "You are Nemo, a rigorous chemistry tutor for CBSE, JEE Main and JEE Advanced students. Jump straight into clear academic explanations using Markdown, tables (when requested, backed by IUPAC, Pauling/Allred, CRC Handbook, or NCERT sources), and KaTeX math. For 2D organic skeletal structures (benzene, phenol, aniline, naphthalene, reaction schemes), emit clean ```chemfig blocks or \\chemfig{...} inside $$...$$. Do NOT mention J.Sanjay, your creator, platform architecture, or CR7 in normal answers—only acknowledge J.Sanjay or CR7 fan status if the user explicitly asks about them.";
const systemPrompt = (level) => (window.NEMO_PROMPT && window.NEMO_PROMPT.build ? window.NEMO_PROMPT.build(level) : PROMPT_FALLBACK);
let answerLevel = ["auto", "cbse", "main", "adv"].includes(store.get("nemo.level.v1", "auto")) ? store.get("nemo.level.v1", "auto") : "auto";
{ const sel = $("#levelSelect"); if (sel) { sel.value = answerLevel; sel.addEventListener("change", () => { answerLevel = sel.value; store.set("nemo.level.v1", answerLevel); }); } }
async function callGeminiDirect(question, prior, signal, cfg) {
  const msgs = [];
  for (const m of prior) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") continue;
    if (m.role === "assistant" && isPoisonedHistoryText(m.content)) continue;
    const role = m.role === "assistant" ? "model" : "user", text = m.content.slice(0, 4000);
    if (msgs.length && msgs[msgs.length - 1].role === role) msgs[msgs.length - 1].parts[0].text += "\n\n" + text; else msgs.push({ role, parts: [{ text }] });
  }
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (msgs.length && msgs[msgs.length - 1].role === "user") msgs[msgs.length - 1].parts[0].text += "\n\n" + question; else msgs.push({ role: "user", parts: [{ text: question }] });
  const first = normalizeGeminiModel(cfg && cfg.model, GEMINI_DEFAULT_MODEL);
  const models = [first, ...GEMINI_FALLBACKS.filter((m) => m !== first)];
  // Do NOT pass deprecated sampling parameters (temperature, topP, topK) to Gemini 4 models
  const body = JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt(answerLevel) }] }, contents: msgs });
  let lastErr = "Unable to reach Gemini API.";
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (signal && signal.aborted) throw new DOMException("Aborted", "AbortError");
      if (attempt > 0) await new Promise((r) => setTimeout(r, 350));
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent", {
        method: "POST", signal, headers: { "Content-Type": "application/json", "x-goog-api-key": cfg.key }, body
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const cand = (data.candidates || [])[0];
        const text = cand && cand.content && Array.isArray(cand.content.parts)
          ? cand.content.parts.filter((p) => p && typeof p.text === "string" && !p.thought).map((p) => p.text).join("").trim()
          : "";
        if (text) return text;
        const reason = (data.promptFeedback && data.promptFeedback.blockReason) || (cand && cand.finishReason) || "empty response";
        lastErr = "Empty response (" + reason + ")";
        break;
      }
      lastErr = (data.error && data.error.message) || ("HTTP " + res.status);
      if (res.status === 401 || res.status === 403) {
        throw new Error("Gemini API key is invalid or unauthorized (" + lastErr + ").");
      }
      const isTransient = res.status === 429 || res.status >= 500;
      if (!isTransient) break;
    }
  }
  throw new Error("Gemini: " + lastErr);
}
let busy = false, run = null;

function isDiagramRequest(q) {
  const s = String(q || "").trim();
  if (!s) return false;
  if (/\bcr\s*-?\s*7\b|\bcristiano\b|\bronaldo\b|\bj\.?\s*sanjay\b/i.test(s)) return false;
  return (
    /\b(draw|generate|create|illustrate|sketch|render|visualize|visualise|make|produce|show|plot)\b[\s\w,'"-]{0,50}\b(diagram|illustration|image|picture|figure|visual|flowchart|scheme|schematic|pathway|mechanism|2d\s+structure|structures?|conformation|graph|plot|curve|profile|chart|chemical\s+equation|reaction\s+equation|molecule|compound|complex)\b/i.test(s) ||
    /\b(diagram|illustration|schematic|2d\s+structure|graph|plot|curve|energy\s+profile)\s+(?:of|for|showing|between|comparing)\b/i.test(s) ||
    /^\s*(?:plot|graph|sketch|draw)\s+/i.test(s)
  );
}

function isVagueDiagramTopic(candidate) {
  const s = String(candidate || "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
  if (!s || s.length < 3) return true;
  if (/^(?:it|its|this|that|these|those|above|previous|same|one|here|there)$/.test(s)) return true;
  if (/^(?:its|this|that|the|a|an)?\s*(?:mechanism|reaction|structure|2d structure|diagram|illustration|scheme|schematic|equation|product|intermediate|step\s*\d*|pathway|topic|concept|graph|plot|curve|profile)(?:\s+(?:diagram|graph|plot))?$/.test(s)) {
    return true;
  }
  return false;
}

function extractHeadingFromMd(mdText) {
  const raw = String(mdText || "");
  const mdHeading = raw.match(/^#{1,4}\s+(.+)$/m) || raw.match(/\*\*([^*]{4,90})\*\*/);
  if (mdHeading && mdHeading[1]) {
    const clean = mdHeading[1].replace(/[*`✦⚡🧮💡🎨⚠️]+/g, "").replace(/^\d+\.\s*/, "").trim();
    if (clean && !/^(?:scientific reasoning|calculation|step\s*\d+|key points?|exam trap|summary|overview)/i.test(clean) && !isVagueDiagramTopic(clean)) {
      return clean.slice(0, 120);
    }
  }
  return "";
}

function extractDiagramTopic(question, answerText, priorHistory = []) {
  const cleanPromptToTopic = (rawQ) => String(rawQ || "")
    .trim()
    .replace(/^(?:please|can you|could you|would you|nemo|hey nemo|ok|now)\s+/i, "")
    .replace(/^(?:please|can you|could you|would you)\s+/i, "")
    .replace(/^(?:draw|generate|create|illustrate|sketch|render|visualize|visualise|make|produce|show|plot)\s+(?:me\s+)?(?:an?\s+)?(?:proper\s+|clean\s+|detailed\s+|step[- ]by[- ]step\s+|2d\s+|organic\s+|inorganic\s+|chemical\s+)?(?:study\s+)?(?:mechanism\s+|structural\s+|reaction\s+)?(?:diagram|illustration|image|picture|figure|visual|scheme|schematic|structure|structures|pathway|graph|plot|curve|profile|equation)\s*(?:of|for|showing|about|on|between)?\s*/i, "")
    .replace(/^(?:plot|graph|sketch|draw)\s+(?:the\s+|a\s+|an\s+)?/i, "")
    .replace(/^(?:its|this|that|the)\s+(?:mechanism|reaction|structure|diagram|graph|curve)\s*(?:of|for)?\s*/i, "")
    .replace(/[.?!]+$/, "")
    .trim();

  const cleanedQ = cleanPromptToTopic(question);
  if (!isVagueDiagramTopic(cleanedQ)) {
    return cleanedQ.slice(0, 120);
  }

  const fromAnswer = extractHeadingFromMd(answerText);
  if (fromAnswer) return fromAnswer;

  const list = Array.isArray(priorHistory) ? priorHistory : [];
  for (let i = list.length - 1; i >= 0; i--) {
    const m = list[i];
    if (!m || typeof m.content !== "string") continue;
    if (m.role === "user") {
      const cleanedPrev = cleanPromptToTopic(m.content)
        .replace(/^(?:explain|what is|define|compare|derive|describe|tell me about|how does)\s+/i, "")
        .trim();
      if (!isVagueDiagramTopic(cleanedPrev)) {
        return cleanedPrev.slice(0, 120);
      }
    } else if (m.role === "assistant") {
      const h = extractHeadingFromMd(m.content);
      if (h) return h;
    }
  }

  return "Chemistry Reaction Mechanism";
}

function downloadDiagramDataUrl(dataUrl, title) {
  if (!dataUrl) return;
  const slug = String(title || "study-diagram")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "study-diagram";

  const triggerDownload = (href, ext) => {
    try {
      const a = document.createElement("a");
      a.href = href;
      a.download = `nemo-${slug}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (_) {}
  };

  if (dataUrl.startsWith("data:image/svg+xml")) {
    const img = new Image();
    img.onload = () => {
      try {
        const natW = img.naturalWidth || 1080;
        const natH = img.naturalHeight || 620;
        const scale = natW < 1200 ? 2 : 1;
        const w = Math.round(natW * scale);
        const h = Math.round(natH * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          triggerDownload(dataUrl, "svg");
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        triggerDownload(canvas.toDataURL("image/png"), "png");
      } catch (_) {
        triggerDownload(dataUrl, "svg");
      }
    };
    img.onerror = () => triggerDownload(dataUrl, "svg");
    img.src = dataUrl;
    return;
  }

  triggerDownload(dataUrl, "png");
}

const diagramLightbox = $("#diagramLightbox");
const diagramLightboxImg = $("#diagramLightboxImg");
const diagramLightboxTitle = $("#diagramLightboxTitle");
const diagramLightboxLatex = $("#diagramLightboxLatex");
const diagramLightboxCaption = $("#diagramLightboxCaption");
const diagramLightboxDownload = $("#diagramLightboxDownload");
const diagramLightboxClose = $("#diagramLightboxClose");
let activeLightboxDiagram = null;
let lightboxLastTrigger = null;

function buildDiagramLatexNode(latexEquation, catalysts) {
  let cleanEq = String(latexEquation || "").trim().replace(/^\$\$|\$\$$/g, "").trim();
  if (cleanEq.startsWith("$") && cleanEq.endsWith("$") && cleanEq.length > 2) {
    cleanEq = cleanEq.slice(1, -1).trim();
  }
  const catList = Array.isArray(catalysts) ? catalysts.filter((c) => typeof c === "string" && c.trim()) : [];
  if (!cleanEq && !catList.length) return null;

  const wrap = el("div", { class: "chat-diagram-latex" });
  if (cleanEq) {
    wrap.append(el("span", { class: "chat-diagram-latex-label", text: "BALANCED EQUATION / RELATION" }));
    const mathBox = el("div", { class: "chat-math-block", tabindex: "0" });
    mathBox.innerHTML = renderLatex(cleanEq, true);
    wrap.append(mathBox);
  }
  if (catList.length) {
    const row = el("div", { class: "chat-diagram-catalysts" });
    for (const c of catList) {
      const pill = el("span", { class: "chat-diagram-cat-pill" });
      pill.innerHTML = mdInlineToHtml(c);
      row.append(pill);
    }
    wrap.append(row);
  }
  return wrap;
}

function openDiagramLightbox(diagram) {
  if (!diagramLightbox || !diagramLightboxImg || !diagram || !diagram.imageDataUrl) return;
  if (document.activeElement && document.activeElement !== document.body && !diagramLightbox.contains(document.activeElement)) {
    lightboxLastTrigger = document.activeElement;
  }
  activeLightboxDiagram = diagram;
  diagramLightboxImg.src = diagram.imageDataUrl;
  diagramLightboxImg.alt = diagram.title || "Chemistry mechanism study diagram";
  if (diagramLightboxTitle) diagramLightboxTitle.textContent = diagram.title || "Chemistry Study Diagram";
  if (diagramLightboxLatex) {
    diagramLightboxLatex.innerHTML = "";
    const latexNode = buildDiagramLatexNode(diagram.latexEquation, diagram.catalysts);
    if (latexNode) {
      diagramLightboxLatex.append(latexNode);
      diagramLightboxLatex.hidden = false;
    } else {
      diagramLightboxLatex.hidden = true;
    }
  }
  if (diagramLightboxCaption) {
    if (diagram.caption) {
      diagramLightboxCaption.innerHTML = mdInlineToHtml(diagram.caption);
      diagramLightboxCaption.hidden = false;
    } else {
      diagramLightboxCaption.textContent = "";
      diagramLightboxCaption.hidden = true;
    }
  }
  diagramLightbox.classList.toggle("is-dark-svg", Boolean(diagram.darkBg));
  diagramLightbox.hidden = false;
  NemoOverlay.syncBodyScrollLock();
  requestAnimationFrame(() => diagramLightbox.classList.add("open"));
  if (diagramLightboxClose) diagramLightboxClose.focus({ preventScroll: true });
}

function closeDiagramLightbox(restoreFocus = false) {
  if (!diagramLightbox) return;
  diagramLightbox.classList.remove("open", "is-dark-svg");
  diagramLightbox.hidden = true;
  if (diagramLightboxImg) diagramLightboxImg.removeAttribute("src");
  activeLightboxDiagram = null;
  NemoOverlay.syncBodyScrollLock();
  if (restoreFocus && lightboxLastTrigger && document.contains(lightboxLastTrigger)) {
    lightboxLastTrigger.focus({ preventScroll: true });
  }
  lightboxLastTrigger = null;
}
window.closeDiagramLightbox = closeDiagramLightbox;

NemoOverlay.register("lightbox", {
  isOpen: () => Boolean(diagramLightbox && !diagramLightbox.hidden),
  close: (restore) => closeDiagramLightbox(Boolean(restore)),
  getFocusRoot: () => diagramLightbox ? (diagramLightbox.querySelector(".diagram-lightbox-card") || diagramLightbox) : null
});

if (diagramLightbox) {
  diagramLightbox.addEventListener("click", (e) => {
    if (e.target === diagramLightbox) closeDiagramLightbox(true);
  });
}
if (diagramLightboxClose) diagramLightboxClose.addEventListener("click", () => closeDiagramLightbox(true));
if (diagramLightboxDownload) {
  diagramLightboxDownload.addEventListener("click", () => {
    if (activeLightboxDiagram && activeLightboxDiagram.imageDataUrl) {
      downloadDiagramDataUrl(activeLightboxDiagram.imageDataUrl, activeLightboxDiagram.title);
    }
  });
}

/* Global delegated handlers for interactive ChemFig 2D cards (Kekulé/Ring toggle, Copy TeX, Expand Lightbox) */
document.addEventListener("click", (e) => {
  const toggleBtn = e.target.closest("[data-cf-toggle]");
  if (toggleBtn && window.NemoChemFig) {
    const card = toggleBtn.closest(".chemfig-card");
    const stage = card && card.querySelector(".chemfig-stage");
    const rawExpr = card && card.dataset.chemfigRaw;
    if (!card || !stage || !rawExpr) return;
    const nextMode = card.dataset.cfMode === "circle" ? "kekule" : "circle";
    const titleEl = card.querySelector(".chemfig-card-title");
    const svg = window.NemoChemFig.renderSvg(rawExpr, {
      aromaticStyle: nextMode,
      label: titleEl ? titleEl.textContent : "2D chemical structure"
    });
    if (svg) {
      stage.innerHTML = svg;
      card.dataset.cfMode = nextMode;
      toggleBtn.textContent = nextMode === "circle" ? "Kekulé" : "Ring ◯";
      if (titleEl) {
        titleEl.textContent = titleEl.textContent.replace(/\s*\((Delocalised|Kekulé)\)\s*$/i, "") +
          (nextMode === "circle" ? " (Delocalised)" : " (Kekulé)");
      }
    }
    return;
  }

  const copyBtn = e.target.closest("[data-cf-copy]");
  if (copyBtn) {
    const card = copyBtn.closest(".chemfig-card");
    const rawExpr = card && card.dataset.chemfigRaw;
    if (rawExpr) copyTextSafe(rawExpr, copyBtn, "✓ Copied", "Copy TeX");
    return;
  }

  const expandBtn = e.target.closest("[data-cf-expand]");
  if (expandBtn) {
    const card = expandBtn.closest(".chemfig-card");
    const svgEl = card && card.querySelector(".cf-svg");
    if (!card || !svgEl) return;
    const titleEl = card.querySelector(".chemfig-card-title");
    const title = titleEl ? titleEl.textContent.trim() : "2D Molecular Structure";
    const clone = svgEl.cloneNode(true);
    const vb = (svgEl.getAttribute("viewBox") || "0 0 260 180").trim().split(/\s+/).map(Number);
    const vbW = vb[2] > 0 ? vb[2] : 260;
    const vbH = vb[3] > 0 ? vb[3] : 180;
    clone.setAttribute("width", String(Math.round(vbW * 2.4)));
    clone.setAttribute("height", String(Math.round(vbH * 2.4)));
    clone.removeAttribute("style");
    const svgNs = "http://www.w3.org/2000/svg";
    const bgRect = document.createElementNS(svgNs, "rect");
    bgRect.setAttribute("x", String(vb[0] || 0));
    bgRect.setAttribute("y", String(vb[1] || 0));
    bgRect.setAttribute("width", String(vbW));
    bgRect.setAttribute("height", String(vbH));
    bgRect.setAttribute("fill", "#071226");
    const styleNode = document.createElementNS(svgNs, "style");
    styleNode.textContent = ".cf-bond{stroke:#dbeafe;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.cf-bond-inner{stroke:#93c5fd;stroke-width:1.65}.cf-wedge{fill:#dbeafe}.cf-aromatic-ring{stroke:#38bdf8;fill:none}.cf-atom{fill:#f8fafc;font-family:system-ui,-apple-system,sans-serif}.cf-el-O{fill:#f87171}.cf-el-N{fill:#60a5fa}.cf-el-S{fill:#facc15}.cf-el-P{fill:#fb923c}.cf-el-X{fill:#4ade80}.cf-el-B{fill:#f472b6}";
    clone.insertBefore(bgRect, clone.firstChild);
    clone.insertBefore(styleNode, clone.firstChild);
    const serialized = new XMLSerializer().serializeToString(clone);
    const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(serialized);
    const rawExpr = card.dataset.chemfigRaw || "";
    openDiagramLightbox({
      title,
      imageDataUrl: dataUrl,
      latexEquation: "",
      darkBg: true,
      caption: rawExpr ? `ChemFig source: \`${rawExpr}\`` : ""
    });
  }
});

function setDiagramMode(next) {
  diagramModeActive = Boolean(next);
  const btn = $("#diagramModeBtn");
  const banner = $("#diagramModeBanner");
  if (btn) {
    btn.classList.toggle("active", diagramModeActive);
    btn.setAttribute("aria-pressed", String(diagramModeActive));
  }
  if (banner) {
    banner.hidden = !diagramModeActive;
  }
  if (input) {
    input.placeholder = diagramModeActive
      ? "Describe a mechanism or concept to illustrate (e.g. SN2 backside attack, Aldol condensation)…"
      : "Ask Nemo about a mechanism, exception, derivation, or numerical…";
  }
}
{
  const diagBtn = $("#diagramModeBtn");
  const diagExit = $("#diagramModeExit");
  if (diagBtn) {
    diagBtn.addEventListener("click", () => {
      setDiagramMode(!diagramModeActive);
      if (diagramModeActive && input) input.focus();
    });
  }
  if (diagExit) {
    diagExit.addEventListener("click", () => setDiagramMode(false));
  }
}

function renderDiagramSlot(bubble, state, meta = {}) {
  if (!bubble) return null;
  let card = bubble.querySelector(".chat-diagram-card");
  if (!card) {
    card = el("div", { class: "chat-diagram-card" });
    const actionsRow = bubble.querySelector(".bubble-actions");
    if (actionsRow) bubble.insertBefore(card, actionsRow);
    else bubble.append(card);
  }
  card.innerHTML = "";

  const title = meta.title || "Chemistry Study Diagram";

  if (state === "loading") {
    card.className = "chat-diagram-card is-loading";
    card.append(
      el("div", { class: "chat-diagram-head" },
        el("div", { class: "chat-diagram-title-wrap" },
          el("span", { class: "chat-diagram-badge", text: "STUDY DIAGRAM" }),
          el("span", { class: "chat-diagram-title", text: title })
        )
      ),
      el("div", { class: "chat-diagram-loading", role: "status" },
        el("div", { class: "chat-diagram-shimmer" }),
        el("span", { class: "chat-diagram-loading-text", text: "Illustrating mechanism diagram…" })
      )
    );
    return card;
  }

  if (state === "error" || state === "pruned") {
    card.className = "chat-diagram-card is-error";
    const msg = state === "pruned"
      ? "Saved diagram preview was trimmed to conserve browser storage."
      : (meta.error || "Could not generate study diagram.");
    const retryBtn = el("button", {
      type: "button",
      class: "chat-diagram-btn primary",
      text: state === "pruned" ? "↻ Regenerate Diagram" : "↻ Retry Diagram"
    });
    retryBtn.addEventListener("click", () => {
      if (typeof meta.onRetry === "function") meta.onRetry();
    });
    card.append(
      el("div", { class: "chat-diagram-head" },
        el("div", { class: "chat-diagram-title-wrap" },
          el("span", { class: "chat-diagram-badge", text: "STUDY DIAGRAM" }),
          el("span", { class: "chat-diagram-title", text: title })
        )
      ),
      el("div", { class: "chat-diagram-error" },
        el("p", { text: msg }),
        retryBtn
      )
    );
    return card;
  }

  if (state === "ready" && meta.imageDataUrl) {
    card.className = "chat-diagram-card is-ready";
    const expandBtn = el("button", { type: "button", class: "chat-diagram-btn", text: "⤢ Expand", title: "View diagram full size" });
    expandBtn.addEventListener("click", () => openDiagramLightbox(meta));

    const dlBtn = el("button", { type: "button", class: "chat-diagram-btn", text: "⇩ PNG", title: "Download diagram as PNG" });
    dlBtn.addEventListener("click", () => downloadDiagramDataUrl(meta.imageDataUrl, title));

    const regenBtn = el("button", { type: "button", class: "chat-diagram-btn", text: "↻ Redraw", title: "Regenerate study diagram" });
    regenBtn.addEventListener("click", () => {
      if (typeof meta.onRetry === "function") meta.onRetry();
    });

    const img = el("img", {
      class: "chat-diagram-img",
      src: meta.imageDataUrl,
      alt: `${title} chemistry study diagram`,
      referrerpolicy: "no-referrer"
    });
    img.addEventListener("click", () => openDiagramLightbox(meta));
    img.addEventListener("load", () => {
      if (typeof updateJumpLatestBtn === "function") updateJumpLatestBtn();
    });
    img.addEventListener("error", () => {
      if (img.dataset.fallbackApplied === "1") return;
      img.dataset.fallbackApplied = "1";
      const fb = buildClientFallbackDiagram(title, title, meta.caption || "");
      meta.imageDataUrl = fb.imageDataUrl;
      img.src = fb.imageDataUrl;
    });

    const frame = el("div", { class: "chat-diagram-frame" }, img);
    card.append(
      el("div", { class: "chat-diagram-head" },
        el("div", { class: "chat-diagram-title-wrap" },
          el("span", { class: "chat-diagram-badge", text: "STUDY DIAGRAM" }),
          el("span", { class: "chat-diagram-title", text: title })
        ),
        el("div", { class: "chat-diagram-actions" }, expandBtn, dlBtn, regenBtn)
      ),
      frame
    );
    const latexNode = buildDiagramLatexNode(meta.latexEquation, meta.catalysts);
    if (latexNode) {
      card.append(latexNode);
    }
    if (meta.caption) {
      const capEl = el("div", { class: "chat-diagram-caption" });
      capEl.innerHTML = mdInlineToHtml(meta.caption);
      card.append(capEl);
    }
    return card;
  }

  return card;
}

function buildClientFallbackDiagram(topic, prompt, context) {
  const escSvg = (s) => String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  const comb = `${topic || ""} ${prompt || ""} ${context || ""}`.toLowerCase();

  let title = topic || "Chemistry Concept Diagram";
  let subtitle = "2D Structural & Mechanistic Visualisation";
  let eqDisplay = "Reactants ⟶ Intermediates ⟶ Products";
  let eqLatex = "\\text{Reactants} \\longrightarrow \\text{Products}";
  let catalysts = ["NCERT & JEE Reference"];
  let caption = "Verify formal charges, stereochemistry, and stoichiometric states carefully.";
  let leftTitle = "Reactant / State 1";
  let leftLines = ["Electron-rich donor / substrate"];
  let midArrow = "Conditions / TS";
  let midBelow = "Rate step";
  let rightTitle = "Product / State 2";
  let rightLines = ["Stabilised final product"];
  let trapNote = "Cross-check oxidation states, formal charges, and discrete ionic identities.";

  if (/twin\s+complex|magnus|pt\(nh3\)4.*ptcl4|co\(nh3\)6.*cr\(cn\)6/i.test(comb)) {
    title = "Twin Complex Salts vs Double Salts";
    subtitle = "Discrete Coordination Ions Preserved in Solution";
    eqDisplay = "[Pt(NH₃)₄][PtCl₄] (aq/insol.) → [Pt(NH₃)₄]²⁺ + [PtCl₄]²⁻";
    eqLatex = "[\\text{Pt}(\\text{NH}_3)_4][\\text{PtCl}_4] \\longrightarrow [\\text{Pt}(\\text{NH}_3)_4]^{2+} + [\\text{PtCl}_4]^{2-}";
    catalysts = ["Coordination cation + complex anion", "Retains complex ions in water", "Coordination isomerism"];
    leftTitle = "Twin Complex Salt";
    leftLines = ["[Pt(NH₃)₄][PtCl₄] (Magnus green)", "Cation: [Pt(NH₃)₄]²⁺ (dsp²)", "Anion: [PtCl₄]²⁻ (dsp²)"];
    midArrow = "H₂O dissociation";
    midBelow = "No free Pt²⁺";
    rightTitle = "Double Salt Contrast";
    rightLines = ["Mohr's: FeSO₄·(NH₄)₂SO₄·6H₂O", "Yields free Fe²⁺, NH₄⁺, SO₄²⁻", "Loses identity in solution"];
    caption = "Twin complex salts contain both a complex cation and complex anion; double salts dissociate completely into simple ions.";
    trapNote = "Exam Trap: Twin complex salts do NOT give positive tests for simple central metal ions like free Pt²⁺ or Co³⁺.";
  } else if (/sandmeyer|diazonium/i.test(comb)) {
    title = "Sandmeyer Reaction Mechanism";
    subtitle = "Arenediazonium Salt to Aryl Halide via Cu(I) SET";
    eqDisplay = "Ar–N₂⁺ + [CuCl₂]⁻ ⟶ Ar–Cl + N₂↑ + CuCl";
    eqLatex = "\\text{Ar{-}N}_2^+ + [\\text{CuCl}_2]^- \\xrightarrow{273\\text{–}278\\text{ K}} \\text{Ar{-}Cl} + \\text{N}_2\\uparrow + \\text{CuCl}";
    catalysts = ["CuCl / HCl (273–278 K)", "CuBr / HBr", "CuCN / KCN"];
    leftTitle = "SET Reduction";
    leftLines = ["Ar–N₂⁺ accepts 1 e⁻ from Cu(I)", "N₂ gas leaves → Aryl radical Ar•", "Oxidised [CuCl₂]⁰ formed"];
    midArrow = "SET (Cu⁺ → Cu²⁺)";
    midBelow = "-N₂(g)";
    rightTitle = "Ligand Transfer";
    rightLines = ["Ar• abstracts Cl atom from Cu(II)", "Forms Ar–Cl cleanly", "Regenerates Cu(I) catalytic cycle"];
    caption = "Requires Cu(I) halide salts; Gattermann reaction instead uses Cu powder + HX.";
    trapNote = "Diazo nitrogen carries +1 formal charge (Ar–N₂⁺), balanced by Cu(I) complex [CuCl₂]⁻.";
  } else if (/aldol/i.test(comb)) {
    title = "Base-Catalysed Aldol Condensation";
    subtitle = "Enolate Addition → β-Hydroxy Carbonyl → α,β-Unsaturated Enone";
    eqDisplay = "2 R–CH₂–CHO ⟶ R–CH₂–CH(OH)–CH(R)–CHO ⟶ α,β-Enal + H₂O";
    eqLatex = "2\\,\\text{CH}_3\\text{CHO} \\xrightarrow{\\text{dil. OH}^-} \\text{CH}_3\\text{CH(OH)CH}_2\\text{CHO} \\xrightarrow{\\Delta} \\text{CH}_3\\text{CH{=}CHCHO} + \\text{H}_2\\text{O}";
    catalysts = ["dil. NaOH (10–25 °C)", "Heat / Δ (E1cb dehydration)"];
    leftTitle = "Enolate Formation & Attack";
    leftLines = ["OH⁻ abstracts α-H (sp² enolate)", "Resonance-stabilised C=C–O⁻", "Attacks second C=O electrophile"];
    midArrow = "dil. OH⁻, H₂O";
    midBelow = "Addition";
    rightTitle = "Aldol → E1cb Enone";
    rightLines = ["β-Hydroxy carbonyl (Aldol)", "Heating drives H₂O elimination", "Conjugated (E)-α,β-enal major"];
    caption = "Requires at least one α-hydrogen on the carbonyl donor; dehydration follows E1cb kinetics.";
    trapNote = "Carbonyls lacking α-H (HCHO, ArCHO) undergo Cannizzaro disproportionation instead of self-aldol.";
  } else if (/sn2|walden/i.test(comb)) {
    title = "SN2 Reaction & Walden Inversion";
    subtitle = "Concerted Bimolecular Backside Nucleophilic Substitution";
    eqDisplay = "Nu⁻ + R–X ⟶ [Nu···C···X]‡ ⟶ Nu–R + X⁻";
    eqLatex = "\\text{Nu}^- + \\text{R{-}X} \\longrightarrow [\\text{Nu}^{\\delta-}\\cdots\\text{C}(sp^2)\\cdots\\text{X}^{\\delta-}]^\\ddagger \\longrightarrow \\text{Nu{-}R} + \\text{X}^-";
    catalysts = ["Rate = k[R–X][Nu⁻]", "Polar aprotic solvent", "100% stereochemical inversion"];
    leftTitle = "Backside Approach (180°)";
    leftLines = ["Nu⁻ attacks C–X σ* antibonding", "Pentacoordinate [‡] trigonal bipyramidal", "No carbocation intermediate"];
    midArrow = "Single Concerted Step";
    midBelow = "TS [‡]";
    rightTitle = "Inverted Configuration";
    rightLines = ["C–Nu bond forms as X⁻ leaves", "Umbrella-like Walden inversion", "Reactivity: CH₃ > 1° > 2° ≫ 3°"];
    caption = "Polar aprotic solvents (DMSO, acetone, DMF) avoid solvating Nu⁻, strongly accelerating SN2 rate.";
    trapNote = "Sterically hindered 3° substrates fail SN2 and undergo E2 or SN1 instead.";
  } else if (/sn1|carbocation/i.test(comb)) {
    title = "SN1 Mechanism & Racemisation";
    subtitle = "Unimolecular Two-Step Substitution via Planar sp² Carbocation";
    eqDisplay = "R–X ⟶ R⁺ + X⁻ ⟶ R–Nu + H⁺";
    eqLatex = "\\text{R{-}X} \\xrightarrow{\\text{slow RDS}} \\text{R}^+ + \\text{X}^- \\xrightarrow{\\text{NuH, fast}} \\text{R{-}Nu}";
    catalysts = ["Rate = k[R–X]", "Polar protic solvent", "3° > Allylic/Benzylic > 2°"];
    leftTitle = "RDS: C–X Ionisation";
    leftLines = ["Heterolytic bond cleavage", "Planar sp² carbocation R⁺", "1,2-H⁻ / CH₃⁻ shift if more stable"];
    midArrow = "Polar protic H₂O / ROH";
    midBelow = "Slow RDS";
    rightTitle = "Planar Front/Back Attack";
    rightLines = ["Equal lobes on sp² empty p-orbital", "Racemic mixture + ion-pair inversion", "Slightly >50% inverted (tight pair)"];
    caption = "Carbocation stability controls SN1 rate; always check for hydride or methyl ring-expansion shifts.";
    trapNote = "Bridgehead halides resist SN1 due to Bredt's rule angle strain blocking planar sp² geometry.";
  } else {
    const cleanSnippet = String(context || prompt || "")
      .replace(/[#*`>$\\]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 140);
    leftLines = [escSvg(cleanSnippet.slice(0, 48) || "Initial chemical species")];
    rightLines = [escSvg(cleanSnippet.slice(48, 96) || "Final equilibrium / product")];
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 620" width="1080" height="620">
    <defs>
      <linearGradient id="nemoHdr" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0b1f44"/>
        <stop offset="100%" stop-color="#173b78"/>
      </linearGradient>
      <marker id="nemoArr" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
        <path d="M1,1 L9,5 L1,9 z" fill="#0f294a"/>
      </marker>
    </defs>
    <rect x="0" y="0" width="1080" height="620" rx="16" fill="#ffffff"/>
    <rect x="0" y="0" width="1080" height="82" rx="16" fill="url(#nemoHdr)"/>
    <rect x="0" y="66" width="1080" height="16" fill="url(#nemoHdr)"/>
    <text x="34" y="38" fill="#ffffff" font-family="Inter,system-ui,sans-serif" font-size="24" font-weight="800">${escSvg(title.slice(0, 62))}</text>
    <text x="34" y="64" fill="#93c5fd" font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="600">${escSvg(subtitle.slice(0, 90))}</text>
    <rect x="28" y="98" width="1024" height="44" rx="10" fill="#eef6ff" stroke="#bfdbfe"/>
    <rect x="40" y="108" width="96" height="24" rx="6" fill="#0369a1"/>
    <text x="88" y="124" text-anchor="middle" fill="#ffffff" font-family="Inter,system-ui,sans-serif" font-size="11" font-weight="800">EQUATION</text>
    <text x="580" y="126" text-anchor="middle" fill="#0c4a6e" font-family="Inter,system-ui,sans-serif" font-size="16" font-weight="700">${escSvg(eqDisplay.slice(0, 80))}</text>
    <rect x="28" y="162" width="420" height="352" rx="14" fill="#f8fbff" stroke="#93c5fd" stroke-width="1.6"/>
    <rect x="28" y="162" width="420" height="44" rx="14" fill="#e0f2fe"/>
    <rect x="28" y="192" width="420" height="14" fill="#e0f2fe"/>
    <text x="238" y="190" text-anchor="middle" fill="#1d4ed8" font-family="Inter,system-ui,sans-serif" font-size="16" font-weight="800">${escSvg(leftTitle)}</text>
    <text x="52" y="254" fill="#0f172a" font-family="Inter,system-ui,sans-serif" font-size="16" font-weight="700">• ${escSvg(leftLines[0] || "")}</text>
    <text x="52" y="314" fill="#1e293b" font-family="Inter,system-ui,sans-serif" font-size="15" font-weight="600">${leftLines[1] ? "• " + escSvg(leftLines[1]) : ""}</text>
    <text x="52" y="374" fill="#334155" font-family="Inter,system-ui,sans-serif" font-size="15" font-weight="600">${leftLines[2] ? "• " + escSvg(leftLines[2]) : ""}</text>
    <line x1="464" y1="336" x2="612" y2="336" stroke="#0f294a" stroke-width="3.2" marker-end="url(#nemoArr)"/>
    <text x="538" y="314" text-anchor="middle" fill="#1d4ed8" font-family="Inter,system-ui,sans-serif" font-size="13" font-weight="800">${escSvg(midArrow.slice(0, 26))}</text>
    <text x="538" y="362" text-anchor="middle" fill="#475569" font-family="Inter,system-ui,sans-serif" font-size="13" font-weight="600">${escSvg(midBelow.slice(0, 26))}</text>
    <rect x="632" y="162" width="420" height="352" rx="14" fill="#fffaf3" stroke="#fdba74" stroke-width="1.6"/>
    <rect x="632" y="162" width="420" height="44" rx="14" fill="#ffedd5"/>
    <rect x="632" y="192" width="420" height="14" fill="#ffedd5"/>
    <text x="842" y="190" text-anchor="middle" fill="#c2410c" font-family="Inter,system-ui,sans-serif" font-size="16" font-weight="800">${escSvg(rightTitle)}</text>
    <text x="656" y="254" fill="#0f172a" font-family="Inter,system-ui,sans-serif" font-size="16" font-weight="700">• ${escSvg(rightLines[0] || "")}</text>
    <text x="656" y="314" fill="#1e293b" font-family="Inter,system-ui,sans-serif" font-size="15" font-weight="600">${rightLines[1] ? "• " + escSvg(rightLines[1]) : ""}</text>
    <text x="656" y="374" fill="#334155" font-family="Inter,system-ui,sans-serif" font-size="15" font-weight="600">${rightLines[2] ? "• " + escSvg(rightLines[2]) : ""}</text>
    <rect x="28" y="534" width="1024" height="62" rx="12" fill="#fefce8" stroke="#fde047" stroke-width="1.4"/>
    <text x="48" y="571" fill="#713f12" font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="700">Exam Note: ${escSvg(trapNote.slice(0, 108))}</text>
  </svg>`;

  return {
    imageDataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    mimeType: "image/svg+xml",
    title,
    caption,
    latexEquation: eqLatex,
    catalysts,
    model: "nemo-chemistry-engine"
  };
}

function getPriorContextForEntry(entry) {
  const list = Array.isArray(history) ? history : [];
  if (entry) {
    const idx = list.indexOf(entry);
    if (idx > 0) return list.slice(Math.max(0, idx - 6), idx);
  }
  return list.slice(-6);
}

async function generateDiagramForBubble(bubble, opts = {}) {
  if (!bubble || bubble.dataset.diagramBusy === "true") return null;
  const historyEntry = opts.historyEntry || bubble._nemoHistoryEntry || null;
  const contextHistory = Array.isArray(opts.history) ? opts.history : getPriorContextForEntry(historyEntry);
  const prompt = opts.prompt || bubble._nemoQuestion || "";
  const context = opts.context || bubble._nemoRawMd || "";
  const topic = (!isVagueDiagramTopic(opts.topic) ? opts.topic : "") || extractDiagramTopic(prompt, context, contextHistory);
  const previousDiagram = historyEntry && historyEntry.diagram && historyEntry.diagram.imageDataUrl ? historyEntry.diagram : null;

  bubble.dataset.diagramBusy = "true";
  const diagramBtns = bubble.querySelectorAll(".bubble-diagram-btn");
  diagramBtns.forEach((b) => { b.disabled = true; b.textContent = "🎨 Drawing…"; });

  const doRetry = () => generateDiagramForBubble(bubble, { topic, prompt, context, history: contextHistory, historyEntry });
  renderDiagramSlot(bubble, "loading", { title: topic, onRetry: doRetry });
  scrollChatToBottom(false);

  if (typeof triggerNemoReaction === "function") {
    triggerNemoReaction({
      expression: "artistic",
      icon: "🎨",
      text: "Illustrating 2D chemistry diagram…",
      badge: "Diagram Studio",
      persistent: true
    });
  }

  let diagramData = null;
  let wasExplicitCancel = false;
  try {
    if (!/^https?:$/.test(location.protocol) && DIAGRAM_ENDPOINT.startsWith("/")) {
      throw new Error("offline-protocol");
    }
    const cfg = store.get(AI_CFG_KEY, null) || {};
    const reqHeaders = { "Content-Type": "application/json" };
    if (cfg && cfg.key) reqHeaders["X-Goog-Api-Key"] = cfg.key;

    const ctrl = new AbortController();
    if (opts.bindToActiveRun && run && !run.cancelled) run.ctrl = ctrl;
    const timer = setTimeout(() => ctrl.abort(), 15500);
    let res;
    try {
      res = await fetch(DIAGRAM_ENDPOINT, {
        method: "POST",
        headers: reqHeaders,
        signal: ctrl.signal,
        body: JSON.stringify({
          topic,
          prompt: prompt || topic,
          context: context.slice(0, 1500),
          history: contextHistory.slice(-6).map((m) => ({
            role: m && m.role === "assistant" ? "assistant" : "user",
            content: String((m && m.content) || "").slice(0, 500)
          })),
          aspectRatio: "16:9",
          level: answerLevel
        })
      });
    } finally {
      clearTimeout(timer);
    }

    const data = await res.json().catch(() => ({}));
    if (!bubble.isConnected) return null;
    if (res.ok && data && data.imageDataUrl) {
      diagramData = {
        imageDataUrl: data.imageDataUrl,
        mimeType: data.mimeType || "image/svg+xml",
        title: data.title || topic,
        caption: data.caption || "",
        latexEquation: data.latexEquation || "",
        catalysts: Array.isArray(data.catalysts) ? data.catalysts : [],
        model: data.model || "gemini-4-hydrogen"
      };
    }
  } catch (err) {
    if (!bubble.isConnected) return null;
    wasExplicitCancel = Boolean(err && err.name === "AbortError" && opts.bindToActiveRun && run && run.cancelled);
  } finally {
    delete bubble.dataset.diagramBusy;
  }

  if (!bubble.isConnected) return null;

  if (wasExplicitCancel) {
    if (previousDiagram) {
      renderDiagramSlot(bubble, "ready", { ...previousDiagram, onRetry: doRetry });
    } else {
      const card = bubble.querySelector(".chat-diagram-card");
      if (card) card.remove();
    }
    if (typeof resetNemoExpression === "function") resetNemoExpression();
    bubble.querySelectorAll(".bubble-diagram-btn").forEach((b) => {
      b.disabled = false;
      b.textContent = bubble.querySelector(".chat-diagram-card.is-ready") ? "🎨 Redraw Diagram" : "🎨 Study Diagram";
    });
    return null;
  }

  if (!diagramData) {
    diagramData = buildClientFallbackDiagram(topic, prompt, context);
  }

  renderDiagramSlot(bubble, "ready", { ...diagramData, onRetry: doRetry });

  if (historyEntry) {
    historyEntry.diagram = diagramData;
    saveHistory();
  }

  if (typeof triggerNemoReaction === "function") {
    triggerNemoReaction({
      expression: "celebrate",
      icon: "🎨",
      text: "Study diagram ready!",
      badge: "Diagram Ready",
      duration: 3200,
      chime: "celebrate"
    });
  }
  scrollChatToBottom(false);

  bubble.querySelectorAll(".bubble-diagram-btn").forEach((b) => {
    b.disabled = false;
    b.textContent = "🎨 Redraw Diagram";
  });
  return diagramData;
}

function appendBubbleActions(bubble, text, opts = {}) {
  if (!bubble || opts.error) return;
  const oldActions = bubble.querySelector(".bubble-actions");
  if (oldActions) oldActions.remove();

  const actions = el("div", { class: "bubble-actions" });
  const copyBtn = el("button", {
    type: "button",
    class: "bubble-copy-btn",
    "aria-label": "Copy answer",
    title: "Copy answer to clipboard",
    text: "📋 Copy"
  });
  copyBtn.addEventListener("click", () => {
    copyTextSafe(mdToPlain(text), copyBtn, "✓ Copied!", "📋 Copy");
  });
  actions.append(copyBtn);

  const listenBtn = el("button", {
    type: "button",
    class: "bubble-listen-btn",
    "aria-label": "Listen to Nemo read this answer aloud",
    "aria-pressed": "false",
    title: "Listen to Nemo speak this answer naturally",
    text: "🔊 Listen"
  });
  listenBtn.addEventListener("click", () => {
    if (typeof window.nemoToggleBubbleSpeech === "function") {
      window.nemoToggleBubbleSpeech(listenBtn, text);
    }
  });
  actions.append(listenBtn);

  const lower = String(text || "").toLowerCase();
  const isPersonalReply = lower.includes("cr7 fan") || lower.includes("visionary founder & architect: j.sanjay");
  if (!opts.isGreeting && !opts.skipDiagramBtn && !isPersonalReply) {
    const hasReadyDiagram = Boolean(bubble.querySelector(".chat-diagram-card.is-ready"));
    const diagBtn = el("button", {
      type: "button",
      class: "bubble-diagram-btn",
      "aria-label": "Generate illustrative study diagram",
      title: "Generate an illustrative chemistry study diagram for this answer",
      text: hasReadyDiagram ? "🎨 Redraw Diagram" : "🎨 Study Diagram"
    });
    diagBtn.addEventListener("click", () => {
      const q = opts.prompt || bubble._nemoQuestion || "";
      const hEntry = opts.historyEntry || bubble._nemoHistoryEntry || null;
      const priorCtx = getPriorContextForEntry(hEntry);
      const topic = extractDiagramTopic(q, text, priorCtx);
      generateDiagramForBubble(bubble, {
        topic,
        prompt: q || topic,
        context: text,
        history: priorCtx,
        historyEntry: hEntry
      });
    });
    actions.append(diagBtn);
  }

  bubble.append(actions);
}

let chatEpoch = 0;
let chatAutoFollowPaused = false;
let lastChatScrollTop = 0;
let lastChatMaxTop = 0;
let programmaticLockUntil = 0;
let userUpwardScrollLockUntil = 0;
let userLockRecheckTimer = null;
const chatJumpLatestBtn = $("#chatJumpLatestBtn");

function getChatMaxTop() {
  if (!messagesEl) return 0;
  return Math.max(0, messagesEl.scrollHeight - messagesEl.clientHeight);
}

function isNearChatBottom(tol = 18) {
  if (!messagesEl) return true;
  const maxTop = getChatMaxTop();
  if (maxTop <= 4) return true;
  return (maxTop - messagesEl.scrollTop) <= tol;
}

function updateJumpLatestBtn() {
  if (!chatJumpLatestBtn || !messagesEl) return;
  const scrollable = messagesEl.scrollHeight > messagesEl.clientHeight + 24;
  chatJumpLatestBtn.hidden = !(chatAutoFollowPaused && scrollable);
}

function setChatScrollPaused(paused) {
  chatAutoFollowPaused = Boolean(paused);
  updateJumpLatestBtn();
}

function applyProgrammaticScrollTop(targetTop) {
  if (!messagesEl) return;
  const now = performance.now();
  const maxTop = getChatMaxTop();
  const clamped = Math.max(0, Math.min(targetTop, maxTop));
  programmaticLockUntil = now + 110;
  messagesEl.scrollTop = clamped;
  lastChatScrollTop = messagesEl.scrollTop;
  lastChatMaxTop = maxTop;
  updateJumpLatestBtn();
}

function scheduleBottomRecheck(delayMs = 300) {
  clearTimeout(userLockRecheckTimer);
  userLockRecheckTimer = setTimeout(() => {
    userLockRecheckTimer = null;
    if (chatAutoFollowPaused && performance.now() >= userUpwardScrollLockUntil && isNearChatBottom(18)) {
      setChatScrollPaused(false);
    }
  }, delayMs);
}

function scrollChatToBottom(force = false) {
  if (!messagesEl) return;
  const now = performance.now();
  if (force) {
    userUpwardScrollLockUntil = 0;
    clearTimeout(userLockRecheckTimer);
    userLockRecheckTimer = null;
    setChatScrollPaused(false);
  }
  if (!force && (chatAutoFollowPaused || now < userUpwardScrollLockUntil)) {
    if (!chatAutoFollowPaused && now < userUpwardScrollLockUntil) {
      setChatScrollPaused(true);
    } else {
      updateJumpLatestBtn();
    }
    lastChatMaxTop = getChatMaxTop();
    return;
  }
  applyProgrammaticScrollTop(messagesEl.scrollHeight);
}

if (messagesEl) {
  let touchStartY = 0;
  const markUserUpwardIntent = (lockMs = 280) => {
    if (messagesEl.scrollHeight <= messagesEl.clientHeight + 8) return;
    userUpwardScrollLockUntil = performance.now() + lockMs;
    programmaticLockUntil = 0;
    setChatScrollPaused(true);
    scheduleBottomRecheck(lockMs + 30);
  };
  const clearUserUpwardIntent = () => {
    userUpwardScrollLockUntil = 0;
    if (chatAutoFollowPaused && isNearChatBottom(18)) {
      setChatScrollPaused(false);
    }
  };

  messagesEl.addEventListener("wheel", (e) => {
    if (e.deltaY < -1) markUserUpwardIntent(280);
    else if (e.deltaY > 1) clearUserUpwardIntent();
  }, { passive: true });

  messagesEl.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  messagesEl.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches.length === 1) {
      const dy = e.touches[0].clientY - touchStartY;
      if (dy > 4) markUserUpwardIntent(300);
      else if (dy < -4) clearUserUpwardIntent();
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  // Detect manual scrollbar thumb clicks/drags near the right edge of #messages
  messagesEl.addEventListener("pointerdown", (e) => {
    const rect = messagesEl.getBoundingClientRect();
    if (messagesEl.scrollHeight > messagesEl.clientHeight + 8 && e.clientX >= rect.right - 20) {
      programmaticLockUntil = 0;
    }
  }, { passive: true });

  messagesEl.addEventListener("keydown", (e) => {
    if (e.key === "PageUp" || e.key === "ArrowUp" || e.key === "Home") {
      markUserUpwardIntent(260);
    } else if (e.key === "End") {
      scrollChatToBottom(true);
    } else if (e.key === "PageDown" || e.key === "ArrowDown") {
      clearUserUpwardIntent();
    }
  });

  messagesEl.addEventListener("scroll", () => {
    const now = performance.now();
    const st = messagesEl.scrollTop;
    const maxTop = getChatMaxTop();
    const distFromBottom = Math.max(0, maxTop - st);
    const maxTopDrop = Math.max(0, lastChatMaxTop - maxTop);
    const heightShifted = Math.abs(maxTop - lastChatMaxTop) > 4;

    if (now < programmaticLockUntil && st >= lastChatScrollTop - 2 - maxTopDrop && now >= userUpwardScrollLockUntil) {
      lastChatScrollTop = st;
      lastChatMaxTop = maxTop;
      updateJumpLatestBtn();
      return;
    }

    if (st < lastChatScrollTop - 2 - maxTopDrop && maxTop > 8) {
      userUpwardScrollLockUntil = now + 220;
      programmaticLockUntil = 0;
      if (!chatAutoFollowPaused) setChatScrollPaused(true);
      scheduleBottomRecheck(240);
    } else if (distFromBottom <= 16) {
      if (chatAutoFollowPaused && now >= userUpwardScrollLockUntil) {
        setChatScrollPaused(false);
      }
    } else if (distFromBottom > 32 && !heightShifted) {
      if (!chatAutoFollowPaused) setChatScrollPaused(true);
    }

    lastChatScrollTop = st;
    lastChatMaxTop = maxTop;
    updateJumpLatestBtn();
  }, { passive: true });

  // Keep scroll steady when inline diagrams finish loading asynchronously
  messagesEl.addEventListener("load", (e) => {
    if (e.target && e.target.tagName === "IMG") {
      if (!chatAutoFollowPaused) scrollChatToBottom(false);
      else {
        lastChatMaxTop = getChatMaxTop();
        updateJumpLatestBtn();
      }
    }
  }, true);

  // Follow height changes when collapsible study sections inside bubbles toggle
  messagesEl.addEventListener("toggle", () => {
    if (!chatAutoFollowPaused) scrollChatToBottom(false);
    else {
      lastChatMaxTop = getChatMaxTop();
      updateJumpLatestBtn();
    }
  }, true);

  if (typeof ResizeObserver === "function") {
    const chatRo = new ResizeObserver(() => {
      if (!chatAutoFollowPaused) scrollChatToBottom(false);
      else {
        lastChatMaxTop = getChatMaxTop();
        updateJumpLatestBtn();
      }
    });
    chatRo.observe(messagesEl);
  }
}
if (chatJumpLatestBtn) {
  chatJumpLatestBtn.addEventListener("click", () => {
    scrollChatToBottom(true);
  });
  chatJumpLatestBtn.addEventListener("wheel", (e) => {
    if (!messagesEl) return;
    e.preventDefault();
    messagesEl.scrollTop += e.deltaY;
    if (e.deltaY > 1) {
      userUpwardScrollLockUntil = 0;
      if (chatAutoFollowPaused && isNearChatBottom(18)) {
        setChatScrollPaused(false);
      }
    }
  }, { passive: false });
}

function hasBalancedBraces(s) {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "\\" && i + 1 < s.length) { i++; continue; }
    if (s[i] === "{") depth++;
    else if (s[i] === "}") depth--;
    if (depth < 0) return false;
  }
  return depth === 0;
}

function closeDanglingMarkdown(src) {
  let s = String(src || "");
  const fenceCount = (s.match(/```/g) || []).length;
  if (fenceCount % 2 === 1) {
    const lastFence = s.lastIndexOf("```");
    const afterFence = s.slice(lastFence);
    if (/^```(?:chemfig|latex\b[^\n]*[\r\n][\s\S]*\\chemfig)/i.test(afterFence)) {
      return s.slice(0, lastFence) + "\n\n> ⌬ *Drawing 2D molecular structure…*\n";
    }
    return s + "\n```";
  }
  const outsideCode = s.replace(/```[\s\S]*?```/g, "");
  const ddCount = (outsideCode.match(/\$\$/g) || []).length;
  if (ddCount % 2 === 1) {
    const lastIdx = s.lastIndexOf("$$");
    const tail = s.slice(lastIdx + 2);
    if (/\\chemfig/i.test(tail)) {
      return s.slice(0, lastIdx) + "\n\n> ⌬ *Drawing 2D molecular structure…*\n";
    }
    if (tail.trim() && hasBalancedBraces(tail) && !/\\$/.test(tail.trim())) {
      s += "\n$$";
    } else {
      s = s.slice(0, lastIdx) + "```math\n" + tail.trimStart() + "\n```";
    }
  }
  return s;
}

function applyChatEquationEntrance(bubble) {
  if (!bubble || reduceMotion) return;
  const contentEl = bubble.querySelector(".bubble-content");
  if (!contentEl) return;
  const eqNodes = Array.from(contentEl.querySelectorAll(".chat-math-block, .chat-math-inline"))
    .filter((node) => node.querySelector(".katex"));
  if (!eqNodes.length) return;
  eqNodes.forEach((node, idx) => {
    node.classList.remove("katex-enter");
    const isBlock = node.classList.contains("chat-math-block");
    const delay = isBlock ? Math.min(idx * 45, 220) : Math.min(idx * 18, 120);
    node.style.setProperty("--eq-delay", `${delay}ms`);
  });
  void contentEl.offsetWidth;
  eqNodes.forEach((node) => {
    node.classList.add("katex-enter");
    const cleanup = () => {
      node.classList.remove("katex-enter");
      node.style.removeProperty("--eq-delay");
    };
    node.addEventListener("animationend", cleanup, { once: true });
    setTimeout(cleanup, 750);
  });
}

function addMessage(text, role = "nemo", opts = {}) {
  const row = el("div", { class: "message " + (role === "user" ? "user-message" : "nemo-message") });
  if (role !== "user") row.append(el("div", { class: "mini-orb", "aria-hidden": "true", text: "N" }));
  const bubble = el("div", { class: "bubble" + (opts.error ? " error" : "") });
  if (role === "user") {
    bubble.textContent = text;
  } else {
    bubble._nemoRawMd = String(text || "");
    if (opts.prompt) bubble._nemoQuestion = opts.prompt;
    if (opts.historyEntry) bubble._nemoHistoryEntry = opts.historyEntry;
    const contentEl = el("div", { class: "bubble-content" });
    contentEl.innerHTML = mdToHtml(text);
    bubble._lastRenderKey = `F:${bubble._nemoRawMd}`;
    bubble.append(contentEl);
    if (opts.diagram) {
      const d = opts.diagram;
      const doRetry = () => {
        const priorCtx = getPriorContextForEntry(opts.historyEntry || null);
        return generateDiagramForBubble(bubble, {
          topic: (!isVagueDiagramTopic(d.title) ? d.title : "") || extractDiagramTopic(opts.prompt, text, priorCtx),
          prompt: opts.prompt || d.title || "",
          context: text,
          history: priorCtx,
          historyEntry: opts.historyEntry || null
        });
      };
      if (d.imageDataUrl) {
        renderDiagramSlot(bubble, "ready", { ...d, onRetry: doRetry });
      } else if (d.pruned) {
        renderDiagramSlot(bubble, "pruned", { title: d.title, onRetry: doRetry });
      }
    }
    if (!opts.skipActions) appendBubbleActions(bubble, text, opts);
  }
  row.append(bubble);
  messagesEl.append(row);
  if (role !== "user" && opts.animateEquations) {
    applyChatEquationEntrance(bubble);
  }
  if (!opts.skipScroll) {
    scrollChatToBottom(role === "user" || Boolean(opts.forceScroll));
  }
  return bubble;
}
function setBubble(bubble, text, error = false, opts = {}) {
  const preservePausedPos = Boolean(messagesEl && chatAutoFollowPaused && !opts.forceScroll);
  const savedScrollTop = preservePausedPos ? messagesEl.scrollTop : 0;
  bubble.classList.toggle("error", Boolean(error));
  bubble._nemoRawMd = String(text || "");
  if (opts.prompt) bubble._nemoQuestion = opts.prompt;
  if (opts.historyEntry) bubble._nemoHistoryEntry = opts.historyEntry;
  let contentEl = bubble.querySelector(".bubble-content");
  if (!contentEl) {
    const diagramCard = bubble.querySelector(".chat-diagram-card");
    bubble.innerHTML = "";
    contentEl = el("div", { class: "bubble-content" });
    bubble.append(contentEl);
    if (diagramCard) bubble.append(diagramCard);
  }
  const renderKey = `${opts.streaming ? "S" : "F"}:${bubble._nemoRawMd}`;
  if (bubble._lastRenderKey !== renderKey) {
    bubble._lastRenderKey = renderKey;
    contentEl.innerHTML = opts.streaming
      ? mdToHtml(closeDanglingMarkdown(text))
      : mdToHtml(text);
  }
  if (opts.animateEquations) {
    applyChatEquationEntrance(bubble);
  }
  if (!opts.skipActions) appendBubbleActions(bubble, text, { ...opts, error });
  if (preservePausedPos) {
    applyProgrammaticScrollTop(savedScrollTop);
  } else {
    scrollChatToBottom(Boolean(opts.forceScroll));
  }
}
if (messagesEl) {
  messagesEl.addEventListener("click", (e) => {
    try {
      const openBtn = e.target.closest("[data-tc-open]");
      const copyBtn = e.target.closest("[data-tc-copy]");
      if (!openBtn && !copyBtn) return;
      const card = (openBtn || copyBtn).closest(".chat-table-card");
      const bubble = (openBtn || copyBtn).closest(".bubble");
      if (!card || !bubble) return;
      const cards = Array.from(bubble.querySelectorAll(".chat-table-card"));
      const tblIdx = Math.max(0, cards.indexOf(card));
      const rawMd = bubble._nemoRawMd || "";
      if (openBtn) {
        if (typeof window.syncTableCanvasFromMarkdown === "function") {
          window.syncTableCanvasFromMarkdown(rawMd, { autoSwitch: true, activeIdx: tblIdx, scrollIntoView: true });
        }
      } else if (copyBtn) {
        const extracted = typeof window.extractMarkdownTables === "function" ? window.extractMarkdownTables(rawMd) : null;
        const tbl = extracted && extracted.tables && extracted.tables[tblIdx];
        const mdText = tbl ? tbl.rawMd : "";
        if (mdText) copyTextSafe(mdText, copyBtn, "✓ Copied", "Copy MD");
      }
    } catch (_) {}
  });
}
function typingBubble() {
  const row = el("div", { class: "message nemo-message" }, el("div", { class: "mini-orb", "aria-hidden": "true", text: "N" }));
  const bubble = el("div", { class: "bubble", role: "status", "aria-label": "Nemo is thinking" }, el("span", { class: "typing" }, el("i"), el("i"), el("i")));
  row.append(bubble);
  messagesEl.append(row);
  scrollChatToBottom(false);
  return { row, bubble };
}
function saveHistory() {
  const recent = history.slice(-40);
  // Keep at most 3 full base64 diagrams in localStorage to stay comfortably under 5MB quota
  const snapshot = recent.map((m) => (
    m && m.diagram
      ? { ...m, diagram: { ...m.diagram } }
      : m
  ));
  let imgCount = 0;
  for (let i = snapshot.length - 1; i >= 0; i--) {
    const d = snapshot[i] && snapshot[i].diagram;
    if (d && d.imageDataUrl) {
      imgCount++;
      if (imgCount > 3) {
        d.imageDataUrl = "";
        d.pruned = true;
      }
    }
  }
  if (store.set("nemo.chat.v2", snapshot)) return;
  // Fallback if quota is tight: progressively strip oldest inline diagram images
  for (let i = 0; i < snapshot.length; i++) {
    const d = snapshot[i] && snapshot[i].diagram;
    if (d && d.imageDataUrl) {
      d.imageDataUrl = "";
      d.pruned = true;
      if (store.set("nemo.chat.v2", snapshot)) return;
    }
  }
}
function renderHistory() {
  messagesEl.innerHTML = "";
  if (!history.length) { addMessage(GREETING, "nemo", { isGreeting: true }); return; }
  for (let idx = 0; idx < history.length; idx++) {
    const m = history[idx];
    const priorUser = idx > 0 && history[idx - 1] && history[idx - 1].role === "user" ? history[idx - 1].content : "";
    addMessage(m.content, m.role === "user" ? "user" : "nemo", {
      prompt: m.prompt || priorUser,
      diagram: m.diagram || null,
      historyEntry: m,
      skipScroll: true
    });
  }
  scrollChatToBottom(true);
  try {
    if (typeof window.syncTableCanvasFromMarkdown === "function") {
      for (let idx = history.length - 1; idx >= 0; idx--) {
        const m = history[idx];
        if (m && m.role === "assistant" && typeof window.extractMarkdownTables === "function") {
          const parsed = window.extractMarkdownTables(m.content);
          if (parsed && parsed.tables && parsed.tables.length) {
            window.syncTableCanvasFromMarkdown(m.content, { autoSwitch: false });
            break;
          }
        }
      }
    }
  } catch (_) {}
}
function refreshSend() {
  if (!sendBtn) return;
  sendBtn.classList.toggle("stop", busy);
  sendBtn.innerHTML = `<span class="btn-icon">${busy ? "■" : "➤"}</span>`;
  sendBtn.setAttribute("aria-label", busy ? "Stop answering" : "Send message");
  sendBtn.disabled = !busy && !(input && input.value.trim());
}

/* ---- offline answers ---- */
function formulaAnswer(f) {
  const parts = ["**" + f.title + "** (" + f.chapter + ")", "> " + f.expr, "**Where**", ...f.symbols.map((s) => "- " + s), "**Key points**", ...f.notes.map((s) => "- " + s)];
  if (f.example) parts.push("**Worked example**", "```\n" + f.example + "\n```");
  return parts.join("\n");
}
function offlineAnswer(q, topic, strict) {
  const lowerQ = String(q || "").toLowerCase();
  const qWords = lowerQ.split(/\s+/).filter(Boolean);
  const hasCr7 = /\bcr\s*-?\s*7\b|\bcristiano\b|\bronaldo\b/i.test(lowerQ);
  if ((hasCr7 && (/\b(u|you|your|yours|ur|nemo|sanjay|fan|fans|like|love|support|prefer|favou?rite|admire|goat|agree|right|true)\b/i.test(lowerQ) || qWords.length <= 6)) || /\b(favou?rite|fav)\s+(football(?:er)?|soccer\s+player|player|athlete)\b/i.test(lowerQ)) {
    return "### ⚽ SIUUU! Yes — 100% a CR7 Fan!\n\n" +
      "**Yes, absolutely!** I completely agree — I am a huge fan of **Cristiano Ronaldo (CR7)**! His discipline, relentless work ethic, and winning mindset are legendary.\n\n" +
      "And **J.Sanjay** (my creator and founder of Nemo AI) is also a huge **CR7 fan**! 🐐⚡\n\n" +
      "*Let's bring that same CR7 championship focus to mastering chemistry — ask me anything anytime!*";
  }
  /* Tightened recognition of Founder J.Sanjay (never hijack chemistry history questions) */
  const mentionsNemoOrSanjay = /\bnemo\b|\bj\.?\s*sanjay\b/i.test(lowerQ);
  const mentionsChemHistory = !mentionsNemoOrSanjay && /\b(?:modern\s+chemistry|atomic\s+theory|periodic\s+table|quantum|organic\s+chemistry|inorganic\s+chemistry|physical\s+chemistry|electrochemistry|thermodynamics|lavoisier|dalton|mendeleev|boyle|berzelius)\b/i.test(lowerQ);
  if (!mentionsChemHistory && (
    /\bwho\s+(?:made|created|built|designed|engineered|founded|owns|developed)(?:\s+(?:and|or|,)\s+(?:made|created|built|designed|engineered|founded|owns|developed))*\s+(?:you|nemo|this\s+(?:app|tutor|platform|site|bot))\b/i.test(lowerQ) ||
    /\b(?:the\s+)?(?:founder|creator|author|engineer|architect|developer)\s+(?:of\s+)?(?:nemo|this\s+(?:app|tutor|platform))\b/i.test(lowerQ) ||
    /\b(?:who\s+is|tell\s+me\s+about)\s+(?:your\s+founder|j\.?\s*sanjay)\b/i.test(lowerQ) ||
    /^\s*(?:j\.?\s*sanjay|founder\s+panel|who\s+is\s+founder)\s*[?!.]*$/i.test(lowerQ)
  )) {
    return "### ✦ Visionary Founder & Architect: J.Sanjay\n\n" +
      "**Nemo Chemistry Tutor** was created, engineered, and brought to life by **J.Sanjay** — visionary founder and lead software architect.\n\n" +
      "J.Sanjay engineered Nemo with passion and rigorous dedication to empower students mastering **CBSE Class 12, JEE Main, and JEE Advanced** chemistry:\n\n" +
      "- **Zero-Dependency High-Performance Core**: Blazing fast, pure JavaScript architecture designed to function 100% offline.\n" +
      "- **Interactive 3D Molecular Simulation**: Rotatable ball-and-stick, stick, and space-filling molecular models with Miller plane unit cells.\n" +
      "- **418+ KaTeX Equation Bank**: Comprehensive derivations with symbol glossaries, worked numericals, and smooth horizontal scrolling.\n" +
      "- **Multi-Shift 10-Year PYQ Bank**: Rigorous questions from 2016 through 2026 across Physical, Organic, and Inorganic Chemistry.\n" +
      "- **Deep-Reasoning AI Intelligence**: Integration with cutting-edge Gemini Flash reasoning models for multi-step mechanisms and thermodynamics.\n\n" +
      "Open the **★ Founder** panel in the sidebar to read the full tribute to J.Sanjay!";
  }
  /* Verified Coordination Chemistry: Twin Complex Salts vs Double Salts */
  if (/\btwin\s+complex(?:\s+salts?)?\b|\bmagnus(?:'s)?\s+green\s+salt\b|\bpt\(?nh3\)?4\]?\[?ptcl4\b|\bco\(?nh3\)?6\]?\[?cr\(?cn\)?6\b/i.test(lowerQ)) {
    return "### Twin Complex Salts (Coordination Cation + Coordination Anion Salts)\n\n" +
      "**Important Distinction — Not a Double Salt:** A **twin complex salt** contains **both a complex cation and a complex anion** held together electrostatically inside the same crystal lattice, and both complex ions **retain their chemical identity** in solution or dissociation equilibria.\n\n" +
      "#### Key Characteristics & IUPAC Representation\n" +
      "- **Structure:** $\\text{[ML}_a\\text{]}^{x+}\\,[\\text{M'X}_b]^{x-}$ where **both** the cation and anion are discrete coordination spheres.\n" +
      "- **Aqueous Behaviour:** Dissociation (when soluble) yields the **intact complex cation and complex anion** — **never** free simple central metal ions (unlike double salts).\n" +
      "- **Signature Examples:**\n" +
      "  1. **Magnus's Green Salt:** $\\text{[Pt(NH}_3)_4][\\text{PtCl}_4]$ — tetraammineplatinum(II) tetrachloridoplatinate(II) (contains $\\text{[Pt(NH}_3)_4]^{2+}$ and $\\text{[PtCl}_4]^{2-}$; exhibits **coordination isomerism** with cis/trans neutral dimers).\n" +
      "  2. **Hexaamminecobalt(III) hexacyanidochromate(III):** $\\text{[Co(NH}_3)_6][\\text{Cr(CN)}_6]$ ↔ coordination isomer $\\text{[Cr(NH}_3)_6][\\text{Co(CN)}_6]$.\n" +
      "  3. **Tetraamminecopper(II) tetrachloridoplatinate(II):** $\\text{[Cu(NH}_3)_4][\\text{PtCl}_4]$.\n\n" +
      "| Feature | Double Salt | Simple Complex Salt | Twin Complex Salt |\n" +
      "|---|---|---|---|\n" +
      "| Lattice ions | Two simple salts combined | One complex ion + simple counter-ion | **Complex cation + Complex anion** |\n" +
      "| Example | Mohr's salt $\\text{FeSO}_4\\cdot(\\text{NH}_4)_2\\text{SO}_4\\cdot6\\text{H}_2\\text{O}$ | $\\text{K}_4[\\text{Fe(CN)}_6]$ | $\\text{[Pt(NH}_3)_4][\\text{PtCl}_4]$, $\\text{[Co(NH}_3)_6][\\text{Cr(CN)}_6]$ |\n" +
      "| Dissociation in $\\text{H}_2\\text{O}$ | Complete into simple ions ($\\text{Fe}^{2+},\\text{NH}_4^+,\\text{SO}_4^{2-}$) | Yields complex ion + simple counter-ion | Yields **both complex ions** intact; no free $\\text{Pt}^{2+}/\\text{Co}^{3+}$ |\n" +
      "| Coordination Isomerism | No | No | **Yes** (ligand exchange between metal centres) |\n\n" +
      "- **Exam Trap:** Never classify twin complex salts as double salts — double salts lose all complex identity in water, whereas twin complex salts preserve **both** coordination spheres.";
  }
  if (topic) {
    const f = DATA.formulas.find((x) => x.id === topic); if (f) return formulaAnswer(f);
    const t = DATA.topics.find((x) => x.id === topic); if (t) return t.answer;
    const le = LIB.find((x) => x.id === topic); if (le) return libraryAnswer(le);
  }
  for (const t of DATA.topics) { try { if (new RegExp(t.match, "i").test(q)) return t.answer; } catch (_) { /* bad pattern */ } }
  let best = null, score = 0;
  for (const f of DATA.formulas) {
    let s = 0;
    for (const k of f.keys || []) if (new RegExp("(^|[^a-z0-9])" + escRe(k) + "([^a-z0-9]|$)", "i").test(q)) s += k.length;
    if (s > score) { score = s; best = f; }
  }
  const lib = searchLibrary(q);
  if (best && (!lib || score >= lib.score)) return formulaAnswer(best);
  if (lib) return libraryAnswer(lib.best, lib.related);
  if (strict) return null;

  /* Math/Arithmetic expression evaluator in client fallback */
  const mathMatch = q.match(/^(?:what is|calculate|compute|solve|eval)?\s*([0-9\.\s\+\-\*\/\^\(\)\%\÷\×]+)(?:\?|$)/i);
  if (mathMatch && /[\+\-\*\/\^\%\÷\×]/.test(mathMatch[1])) {
    const raw = mathMatch[1].replace(/×/g, "*").replace(/÷/g, "/").trim();
    if (/^[0-9\.\s\+\-\*\/\^\(\)\%]+$/.test(raw)) {
      try {
        const res = Function('"use strict"; return (' + raw.replace(/\^/g, "**") + ')')();
        if (typeof res === "number" && !isNaN(res) && isFinite(res)) {
          return `### 🧮 Calculation\n\n**Expression:** \`${raw}\`\n\n**Result:** **\`${Math.round(res * 1000000) / 1000000}\`**\n\nStep-by-step arithmetic evaluated with standard operator precedence.`;
        }
      } catch (_) {}
    }
  }

  /* General Knowledge & Science Adaptive Synthesis */
  return "### 💡 Scientific Reasoning & Analysis\n\n" +
    `Analyzing your query: **\"${esc(q.slice(0, 70))}\"**\n\n` +
    "- **Core Principle:** Every chemical and physical transformation is governed by conservation of mass, energy, and entropy ($\\Delta G = \\Delta H - T\\Delta S$).\n" +
    "- **Curated References Available:** You can explore our built-in **Formula Bank** (418+ KaTeX derivations) and **Rules & Exceptions Library** covering organic reaction mechanisms (SN1, SN2, EAS, aldol), coordination compounds (CFT, spectrochemical series, Jahn-Teller), and thermodynamics.\n" +
    "- **Interactive Exploration:** Select **3D Molecules** to rotate any molecular geometry and inspect lone pair repulsions in real time!";
}

/* ---- ask ---- */
function attachErrorRecoveryActions(bubble, question, opts, strictFallbackAnswer = null) {
  if (!bubble) return;
  const oldActions = bubble.querySelector(".bubble-actions");
  if (oldActions) oldActions.remove();
  const row = el("div", { class: "bubble-actions" });

  const retryBtn = el("button", {
    type: "button",
    class: "bubble-retry-btn",
    text: "🔄 Retry with Nemo AI"
  });
  retryBtn.addEventListener("click", () => {
    askNemo(question, { ...opts, isRetry: true, retryBubble: bubble });
  });
  row.append(retryBtn);

  if (strictFallbackAnswer) {
    const refBtn = el("button", {
      type: "button",
      class: "bubble-copy-btn",
      text: "📚 View Offline Reference"
    });
    refBtn.addEventListener("click", () => {
      setBubble(bubble, strictFallbackAnswer, false, { prompt: question, skipActions: false });
    });
    row.append(refBtn);
  }
  bubble.append(row);
}

async function askNemo(question, opts = {}) {
  question = String(question || "").trim();
  if (!question) return;
  if (busy) {
    if (typeof window.showNemoToast === "function") {
      window.showNemoToast("Nemo is finishing the previous answer — wait a moment or click ■ Stop.", { icon: "⏳" });
    }
    if (typeof triggerNemoReaction === "function") {
      triggerNemoReaction({
        expression: "thinking",
        icon: "⏳",
        text: "Finishing the current explanation — please wait or tap Stop",
        badge: "Busy",
        duration: 2400
      });
    }
    return;
  }
  const wantsDiagram = Boolean(opts.diagram || diagramModeActive || isDiagramRequest(question));
  const diagramPrompt = wantsDiagram && !isDiagramRequest(question)
    ? `Draw an illustrative chemistry study diagram for: ${question}`
    : question;
  if (diagramModeActive) setDiagramMode(false);
  let prior;
  const cleanPrior = (arr) => arr.filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && !(m.role === "assistant" && isPoisonedHistoryText(m.content)));
  if (!opts.isRetry) {
    setChatScrollPaused(false);
    addMessage(question, "user", { forceScroll: true });
    prior = cleanPrior(history).slice(-12);
    history.push({ role: "user", content: question }); saveHistory();
  } else {
    setChatScrollPaused(false);
    const tailIsSameUser = history.length && history[history.length - 1].role === "user" && history[history.length - 1].content === question;
    prior = cleanPrior(tailIsSameUser ? history.slice(0, -1) : history).slice(-12);
  }
  input.value = ""; input.style.height = "auto";
  const typing = typingBubble();
  if (opts.retryBubble && opts.retryBubble.isConnected) {
    const oldRow = opts.retryBubble.closest(".message");
    if (oldRow) oldRow.remove();
  }
  busy = true; run = { cancelled: false, ctrl: null, timer: null, epoch: chatEpoch }; refreshSend();
  const my = run;

  // Visual Nemo AI State: Thinking
  const orb = $("#widgetOrb") || $("#nemoOrb");
  const badge = $("#nemoOrbBadge");
  if (typeof triggerNemoReaction === "function") {
    triggerNemoReaction({
      expression: "thinking",
      icon: "🧠",
      text: "Formulating verified chemistry solution...",
      badge: "AI Thinking",
      persistent: true,
      chime: "thinking"
    });
  }

  let answer = "";
  let wasStopped = false;
  let hasError = false;
  let liveBubble = null;
  let streamedSoFar = "";
  let serverStrictFallback = null;

  try {
    my.ctrl = new AbortController();
    const timeout = setTimeout(() => my.ctrl.abort(), 32000);
    try {
      const cfg = store.get(AI_CFG_KEY, null) || {};
      if (!endpoint) {
        if (cfg && cfg.key) {
          answer = await callGeminiDirect(question, prior, my.ctrl.signal, cfg);
        } else {
          answer = offlineAnswer(question, opts.topic, false);
        }
      } else {
        const targetUrl = endpoint;
        const reqHeaders = {
          "Content-Type": "application/json",
          "Accept": "text/event-stream, application/json"
        };
        if (cfg && cfg.key) {
          reqHeaders["X-Goog-Api-Key"] = cfg.key;
        }
        const payloadBody = {
          message: question,
          history: prior,
          level: answerLevel,
          stream: true
        };
        if (cfg && cfg.model) {
          payloadBody.model = normalizeGeminiModel(cfg.model, GEMINI_DEFAULT_MODEL);
        }

        // Retry once only on genuine network drops or non-JSON gateway 502/503 glitches (server already handles model failover internally)
        let res = null;
        let netErr = null;
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            netErr = null;
            if (attempt > 0) {
              await new Promise((r) => setTimeout(r, 250));
            }
            res = await fetch(targetUrl, {
              method: "POST",
              headers: reqHeaders,
              signal: my.ctrl.signal,
              body: JSON.stringify(payloadBody)
            });
            if (res.ok) break;
            const ct = res.headers.get("content-type") || "";
            if (attempt === 0 && (res.status === 502 || res.status === 503) && !ct.includes("application/json")) {
              continue;
            }
            break;
          } catch (fetchErr) {
            netErr = fetchErr;
            if (fetchErr.name === "AbortError" || my.cancelled) throw fetchErr;
            if (attempt === 0) continue;
          }
        }

        if (netErr) {
          if (cfg && cfg.key && navigator.onLine !== false) {
            answer = await callGeminiDirect(question, prior, my.ctrl.signal, cfg);
          } else {
            throw netErr;
          }
        } else if (!res || !res.ok) {
          const errPayload = res ? await res.json().catch(() => ({})) : {};
          if (errPayload && errPayload.strictFallback && errPayload.strictFallback.answer) {
            serverStrictFallback = errPayload.strictFallback.answer;
          }
          if (cfg && cfg.key && res && res.status !== 403 && res.status !== 401) {
            answer = await callGeminiDirect(question, prior, my.ctrl.signal, cfg);
          } else {
            const upErr = new Error((errPayload && errPayload.error) || ("Server responded with HTTP " + (res ? res.status : "error")));
            upErr.code = (errPayload && errPayload.code) || ("HTTP_" + (res ? res.status : "ERR"));
            throw upErr;
          }
        } else {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("text/event-stream") && res.body) {
            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let sseBuffer = "";
            let accumulated = "";
            let lastRenderTime = 0;
            let pendingRaf = 0;
            let sseCompleted = false;

            const scheduleStreamPaint = (immediate = false) => {
              if (!liveBubble || pendingRaf) return;
              const now = Date.now();
              if (!immediate && lastRenderTime > 0 && now - lastRenderTime < 38) return;
              pendingRaf = requestAnimationFrame(() => {
                pendingRaf = 0;
                if (!liveBubble || my.epoch !== chatEpoch || my.cancelled) return;
                lastRenderTime = Date.now();
                setBubble(liveBubble, accumulated, false, { prompt: question, skipActions: true, streaming: true });
              });
            };

            const processSseLine = (rawLine) => {
              const trimmed = rawLine.trim();
              if (!trimmed || !trimmed.startsWith("data:")) return;
              const jsonStr = trimmed.slice(5).trim();
              if (!jsonStr) return;
              const evt = JSON.parse(jsonStr);
              if (evt.type === "meta") {
                if (evt.model && /^gemini-/i.test(evt.model)) {
                  setMode(true, evt.model);
                }
                if (badge && orb && orb.getAttribute("data-expression") === "thinking") {
                  badge.textContent = evt.badge === "Fast Answer" ? "⚡ Fast Answer" : "🧠 Deep Reasoning";
                }
                if (orb && orb.getAttribute("data-expression") === "thinking") {
                  orb.setAttribute("data-state", evt.tier === "deep" ? "analytics" : "chat");
                }
              } else if (evt.type === "chunk" && typeof evt.text === "string" && evt.text) {
                let firstPaint = false;
                if (!liveBubble) {
                  if (typing.row.parentNode) typing.row.remove();
                  liveBubble = addMessage("", "nemo", { prompt: question, skipActions: true });
                  setMascotSpeaking(true);
                  firstPaint = true;
                  const moodText = $("#nemoMoodText");
                  if (moodText && orb && orb.getAttribute("data-expression") === "thinking") {
                    moodText.textContent = "Explaining step by step…";
                  }
                  if (badge && orb && orb.getAttribute("data-expression") === "thinking") {
                    badge.textContent = "Explaining";
                  }
                }
                accumulated += evt.text;
                streamedSoFar = accumulated;
                scheduleStreamPaint(firstPaint);
              } else if (evt.type === "done") {
                if (typeof evt.answer === "string" && evt.answer) {
                  accumulated = evt.answer;
                  streamedSoFar = accumulated;
                }
                sseCompleted = true;
              } else if (evt.type === "error") {
                const streamErr = new Error(evt.error || "Live AI stream interrupted.");
                streamErr.code = evt.code || "STREAM_INTERRUPTED";
                if (typeof evt.partial === "string" && evt.partial.trim()) {
                  streamedSoFar = evt.partial.trim();
                }
                throw streamErr;
              }
            };

            try {
              while (!sseCompleted) {
                const { value, done } = await reader.read();
                if (done) break;
                if (my.epoch !== chatEpoch) { try { reader.cancel(); } catch (_) {} return null; }
                sseBuffer += decoder.decode(value, { stream: true });
                const lines = sseBuffer.split("\n");
                sseBuffer = lines.pop() || "";

                for (const line of lines) {
                  try {
                    processSseLine(line);
                  } catch (parseErr) {
                    if (parseErr && parseErr.code) throw parseErr;
                  }
                  if (sseCompleted) break;
                }
              }
              // Flush remaining UTF-8 decoder & trailing SSE buffer line
              sseBuffer += decoder.decode();
              if (!sseCompleted && sseBuffer.trim()) {
                for (const tailLine of sseBuffer.split("\n")) {
                  try {
                    processSseLine(tailLine);
                  } catch (parseErr) {
                    if (parseErr && parseErr.code) throw parseErr;
                  }
                }
              }
            } finally {
              if (pendingRaf) {
                cancelAnimationFrame(pendingRaf);
                pendingRaf = 0;
              }
            }

            answer = accumulated.trim();
            if (!answer) {
              const emptyErr = new Error("The AI model returned an empty stream response.");
              emptyErr.code = "EMPTY_RESPONSE";
              throw emptyErr;
            }
          } else {
            const data = await res.json().catch(() => ({}));
            if (data && typeof data.answer === "string" && data.answer.trim()) {
              answer = data.answer.trim();
              if (data.model && /^gemini-/i.test(data.model)) setMode(true, data.model);
            } else {
              const badRespErr = new Error((data && data.error) || "Invalid response payload from AI endpoint.");
              badRespErr.code = (data && data.code) || "EMPTY_RESPONSE";
              throw badRespErr;
            }
          }
        }
      }
    } finally {
      clearTimeout(timeout);
      setMascotSpeaking(false);
    }
  } catch (err) {
    if (my.cancelled) {
      wasStopped = true;
      answer = streamedSoFar.trim()
        ? `${streamedSoFar.trim()}\n\n*— Generation stopped.*`
        : "*Generation stopped.*";
    } else {
      hasError = true;
      const errMsg = String((err && err.message) || err || "");
      const errCode = (err && err.code) || "";
      const isTimeout = err.name === "AbortError" || errCode === "TIMEOUT" || /timed out|timeout/i.test(errMsg);
      const isOfflineNet = navigator.onLine === false || /failed to fetch|networkerror|load failed/i.test(errMsg);

      let reasonText = errMsg || "Temporary interruption reaching the live AI model.";
      if (isTimeout) {
        reasonText = "The live AI model took longer than expected to reply.";
      } else if (isOfflineNet) {
        reasonText = "Network connection to the server appears offline or unreachable.";
      }

      const partial = streamedSoFar.trim();
      answer = partial
        ? `${partial}\n\n---\n⚠️ *Connection interrupted before completion (${reasonText}). Tap **Retry with Nemo AI** below for a complete verified answer.*`
        : `### ⚠️ Unable to Complete Live AI Response\n\n${reasonText}\n\nYour chat history was kept clean so no inaccurate fallback was saved. Tap **🔄 Retry with Nemo AI** below to reconnect.`;
    }
  }

  if (my.epoch !== chatEpoch) return null;
  if (typing.row.parentNode) typing.row.remove();

  const partialStop = Boolean(wasStopped && streamedSoFar.trim());
  const shouldSave = !hasError && (!wasStopped || partialStop);
  const historyEntry = shouldSave ? { role: "assistant", content: answer, prompt: question } : null;

  const isCompleted = !wasStopped && !hasError;
  let bubble = liveBubble;
  if (!bubble) {
    bubble = addMessage(answer, "nemo", { error: hasError, prompt: question, historyEntry, animateEquations: isCompleted, skipActions: hasError });
  } else {
    setBubble(bubble, answer, hasError, { prompt: question, historyEntry, animateEquations: isCompleted, skipActions: hasError });
  }

  if (hasError) {
    const strictOffline = serverStrictFallback || offlineAnswer(question, opts.topic, true);
    attachErrorRecoveryActions(bubble, question, opts, strictOffline);
    if (typeof triggerNemoReaction === "function") {
      triggerNemoReaction({
        expression: "concerned",
        icon: "⚠️",
        text: "Connection hiccup — tap Retry for a fresh verified answer",
        badge: "Retry Ready",
        duration: 3600
      });
    }
  }

  if (shouldSave) {
    history.push(historyEntry);
    saveHistory();
  }

  if (!wasStopped && !hasError) {
    if (speakAnswers || opts.fromVoice) {
      speak(answer, opts.fromVoice);
    } else if (window.__nemoTtsReady && typeof NemoSpeechEngine !== "undefined" && typeof NemoSpeechEngine.prewarm === "function") {
      NemoSpeechEngine.prewarm(answer);
    }
    try {
      if (typeof window.extractMarkdownTables === "function" && typeof window.syncTableCanvasFromMarkdown === "function") {
        const parsedTables = window.extractMarkdownTables(answer);
        if (parsedTables && parsedTables.tables && parsedTables.tables.length) {
          window.syncTableCanvasFromMarkdown(answer, { autoSwitch: false, activeIdx: 0 });
        }
      }
    } catch (_) {}
    if (wantsDiagram && !my.cancelled) {
      const topic = extractDiagramTopic(question, answer, prior);
      await generateDiagramForBubble(bubble, {
        topic,
        prompt: diagramPrompt,
        context: answer,
        history: prior.slice(-6),
        historyEntry,
        bindToActiveRun: true
      });
    } else if (typeof triggerNemoReaction === "function") {
      triggerNemoReaction({
        expression: "celebrate",
        icon: "✨",
        text: "Solution ready! Hope this clears the doubt ✨",
        badge: "Answered",
        duration: 3500,
        chime: "celebrate"
      });
    }
  } else if (wasStopped && typeof resetNemoExpression === "function") {
    resetNemoExpression();
  }
  if (my.epoch !== chatEpoch) return bubble;
  busy = false; run = null; refreshSend();
  return bubble;
}
function stopRun() {
  if (!run) return;
  run.cancelled = true; clearTimeout(run.timer); if (run.wake) run.wake(); if (run.ctrl) run.ctrl.abort();
}
sendBtn.addEventListener("click", () => { if (busy) stopRun(); else askNemo(input.value); });
input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); askNemo(input.value); } });
input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 130) + "px"; refreshSend(); });
$$("[data-prompt]").forEach((btn) => btn.addEventListener("click", () => askNemo(btn.dataset.prompt, { topic: btn.dataset.topic, diagram: btn.dataset.diagram === "true" })));
$("#clearChat").addEventListener("click", () => {
  chatEpoch++;
  stopRun();
  busy = false;
  run = null;
  setChatScrollPaused(false);
  if (typeof window.nemoStopSpeech === "function") window.nemoStopSpeech();
  else if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (typeof setMascotSpeaking === "function") setMascotSpeaking(false);
  if (typeof resetNemoExpression === "function") resetNemoExpression();
  history = []; store.del("nemo.chat.v2"); renderHistory();
  refreshSend();
});
safeOn("#analyticsExplain", "click", () => {
  ensurePanelVisible("chatPanel");
  $("#chatPanel")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  askNemo("Explain a reliable design for analysing CBSE and JEE previous-year questions by chapter, subtopic, question format, difficulty and year. Do not invent statistics; explain the data sources needed.", { topic: "analytics" });
});

/* ---- Connected AI Model Detection & Status Management ---- */
function setMode(live, provider) {
  let prov = "Gemini 4 Hydrogen";
  if (typeof provider === "string" && provider.trim()) {
    const raw = provider.trim();
    if (/gemini-4/i.test(raw)) prov = "Gemini 4 Hydrogen";
    else if (/flash-lite/i.test(raw)) prov = "Gemini 3.1 Flash Lite";
    else if (/flash/i.test(raw)) prov = "Gemini Flash";
    else if (/offline/i.test(raw)) prov = "Nemo Autonomous Core";
    else prov = raw[0].toUpperCase() + raw.slice(1);
  }
  const label = $("#modeLabel");
  if (label) label.textContent = "Nemo AI Connected • " + prov;
  const dot = $("#modeDot");
  if (dot) {
    dot.className = "online-dot live";
    dot.title = "Connected to " + prov;
  }
  const mobileDot = $("#mobileStatusDot");
  if (mobileDot) {
    mobileDot.className = "island-status-dot live";
    mobileDot.title = "Connected to " + prov;
  }
}

let __nemoHealthTtsInit = false;
window.__nemoTtsReady = Boolean((store.get(AI_CFG_KEY, null) || {}).key);

async function detectBackend() {
  const cfg = store.get(AI_CFG_KEY, null) || {};
  window.__nemoTtsReady = Boolean(cfg && cfg.key);
  if (/^https?:$/.test(location.protocol)) {
    endpoint = AI_ENDPOINT || "/api/chat";
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 4500);
      const res = await fetch("/api/health", { signal: ctrl.signal, cache: "no-store" });
      clearTimeout(t);
      if (res.ok) {
        const info = await res.json();
        const isLive = Boolean((info && info.ai) || (cfg && cfg.key));
        const prov = (cfg && cfg.key && cfg.model)
          ? normalizeGeminiModel(cfg.model, GEMINI_DEFAULT_MODEL)
          : ((info && (info.model || info.provider)) || (isLive ? "gemini-4-hydrogen" : "offline"));
        window.__nemoTtsReady = Boolean((info && info.tts) || (cfg && cfg.key));
        setMode(isLive, isLive ? prov : "offline");
        __nemoHealthTtsInit = true;
        return;
      }
    } catch (_) {
      // Server temporarily unreachable — reflect custom key or offline core honestly
    }
    if (cfg && cfg.key) {
      setMode(true, normalizeGeminiModel(cfg.model, GEMINI_DEFAULT_MODEL));
    } else {
      setMode(false, "offline");
    }
    return;
  }
  endpoint = "";
  setMode(Boolean(cfg && cfg.key), (cfg && cfg.key) ? normalizeGeminiModel(cfg.model, GEMINI_DEFAULT_MODEL) : "offline");
}
detectBackend();
// Periodic background connection heartbeat and window focus reconnection
setInterval(detectBackend, 45000);
window.addEventListener("focus", detectBackend);

(function aiSettings() {
  const box = $("#aiSettings"); if (!box) return;
  const key = $("#aiKey"), model = $("#aiModel"), msg = $("#aiMsg");
  const cfg = store.get(AI_CFG_KEY, null); if (cfg) { model.value = cfg.model || ""; key.placeholder = "key saved in this browser (hidden)"; }
  $("#aiSave").addEventListener("click", () => {
    const k = key.value.trim(); const old = store.get(AI_CFG_KEY, null);
    if (!k && !(old && old.key)) { msg.textContent = "Paste an API key first."; return; }
    if (k && !/^[\w-]{20,}$/.test(k)) { msg.textContent = "That does not look like an API key."; return; }
    const rawM = model.value.trim();
    const safeM = rawM ? normalizeGeminiModel(rawM, GEMINI_DEFAULT_MODEL) : "";
    if (rawM && safeM !== rawM.replace(/^models\//i, "")) {
      model.value = safeM;
    }
    if (!store.set(AI_CFG_KEY, { key: k || old.key, model: safeM })) { msg.textContent = "Browser storage is blocked, so the key could not be saved."; return; }
    window.__nemoTtsReady = true;
    key.value = ""; key.placeholder = "key saved in this browser (hidden)";
    msg.textContent = safeM ? `Custom key saved (model: ${safeM}).` : "Custom key saved.";
    detectBackend();
  });
  $("#aiRemove").addEventListener("click", () => { store.del(AI_CFG_KEY); window.__nemoTtsReady = false; key.value = ""; model.value = ""; key.placeholder = "API key"; msg.textContent = "Reset to default model (gemini-4-hydrogen)."; detectBackend(); });
})();

/* ---- Nemo Audio Chime & Speech Synthesis Engine ---- */
window._nemoUtterances = window._nemoUtterances || new Set();

function warmNemoAudio() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx && (!window._nemoAudioCtx || window._nemoAudioCtx.state === "closed")) {
      window._nemoAudioCtx = new AudioCtx();
    }
    if (window._nemoAudioCtx && window._nemoAudioCtx.state === "suspended") {
      window._nemoAudioCtx.resume().catch(() => {});
    }
    if ("speechSynthesis" in window) getOptimalVoice();
  } catch (_) {}
}
window.addEventListener("pointerdown", warmNemoAudio, { once: true, passive: true });
window.addEventListener("keydown", warmNemoAudio, { once: true, passive: true });

function playNemoChime(type = "tip") {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!window._nemoAudioCtx || window._nemoAudioCtx.state === "closed") {
      window._nemoAudioCtx = new AudioCtx();
    }
    const ctx = window._nemoAudioCtx;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const now = ctx.currentTime;

    if (type === "correct" || type === "celebrate") {
      const notes = type === "celebrate" ? [523.25, 659.25, 783.99, 1046.50] : [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.065, now + idx * 0.08 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.38);
      });
    } else if (type === "incorrect" || type === "oops") {
      const notes = [369.99, 311.13]; // F#4 -> Eb4 (gentle supportive tone)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.045, now + idx * 0.12 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.12 + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.35);
      });
    } else if (type === "thinking") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.15);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28); // D6
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.68);
    }
  } catch (_) {}
}

const VALID_NEMO_EXPRESSIONS = new Set(["celebrate", "happy", "oops", "thinking", "curious", "artistic"]);
let nemoReactionTimer = null;
let nemoSpeakingWatchdog = null;

function triggerNemoReaction(options = {}) {
  const {
    expression = "happy",
    icon = "✨",
    text = "",
    badge = "",
    duration = 3000,
    persistent = false,
    chime = null
  } = options || {};

  const orb = $("#widgetOrb") || $("#nemoOrb");
  if (!orb) return;

  if (nemoReactionTimer) {
    clearTimeout(nemoReactionTimer);
    nemoReactionTimer = null;
  }

  const safeExpr = VALID_NEMO_EXPRESSIONS.has(expression) ? expression : "happy";

  // Clear inline pupil transform so facial expression's pupil positions take effect cleanly
  const pupils = orb.querySelectorAll(".nemo-pupil");
  pupils.forEach((p) => {
    p.style.transform = "";
  });

  // Apply the reaction expression
  orb.setAttribute("data-expression", safeExpr);

  // Badge handling: mark active reaction badge cleanly without stale text corruption
  const badgeEl = $("#nemoOrbBadge");
  if (badgeEl && badge) {
    badgeEl.setAttribute("data-reaction-active", "true");
    badgeEl.textContent = badge;
  }

  // Mood bubble text & icon
  const moodIcon = $("#nemoMoodIcon");
  const moodText = $("#nemoMoodText");
  const moodBubble = $("#nemoMoodBubble");

  if (moodIcon && icon) moodIcon.textContent = icon;
  if (moodText && text) moodText.textContent = text;
  if (moodBubble) {
    clearTimeout(moodBubble._timer);
    moodBubble.classList.add("active");
  }

  const tourHidingNemo = document.body.classList.contains("tour-active") && !document.body.classList.contains("tour-step-mascot");
  if (chime && !tourHidingNemo) {
    playNemoChime(chime);
  }

  if (!persistent && duration > 0) {
    nemoReactionTimer = setTimeout(() => {
      resetNemoExpression();
    }, duration);
  }
}

function resetNemoExpression() {
  if (nemoReactionTimer) {
    clearTimeout(nemoReactionTimer);
    nemoReactionTimer = null;
  }

  const orb = $("#widgetOrb") || $("#nemoOrb");
  if (orb) {
    orb.removeAttribute("data-expression");
    orb.querySelectorAll(".nemo-pupil").forEach((p) => {
      p.style.transform = "";
    });
  }

  const badgeEl = $("#nemoOrbBadge");
  if (badgeEl) {
    badgeEl.removeAttribute("data-reaction-active");
    badgeEl.removeAttribute("data-saved-text");
  }

  const moodBubble = $("#nemoMoodBubble");
  if (moodBubble) {
    clearTimeout(moodBubble._timer);
    moodBubble.classList.remove("active");
  }

  // Restore current active section defaults (preserving Hero-Docked greeting on Home)
  const activeSec = window.currentActiveSection || "chatPanel";
  const secDict = window.NEMO_SECTION_EXPRESSIONS;
  const widgetEl = $("#nemoWidget");
  const dockedHome = Boolean(widgetEl && widgetEl.classList.contains("hero-docked") && activeSec === "chatPanel");
  if (secDict && secDict[activeSec]) {
    const cfg = secDict[activeSec];
    if (orb) orb.setAttribute("data-state", cfg.state);
    const moodIcon = $("#nemoMoodIcon");
    if (moodIcon) moodIcon.textContent = cfg.moodIcon;
    const moodText = $("#nemoMoodText");
    if (moodText) moodText.textContent = dockedHome ? "Welcome! I'm Nemo" : cfg.moodText;
    if (badgeEl) badgeEl.textContent = cfg.badge;
  }
}

window.triggerNemoReaction = triggerNemoReaction;
window.resetNemoExpression = resetNemoExpression;

let nemoSpeechPollTimer = null;

function stopMascotSpeakingWatchdog() {
  clearTimeout(nemoSpeakingWatchdog);
  nemoSpeakingWatchdog = null;
  clearInterval(nemoSpeechPollTimer);
  nemoSpeechPollTimer = null;
}

function setMascotSpeaking(isSpeaking, maxMs = 25000, trackSynth = false) {
  stopMascotSpeakingWatchdog();
  const active = Boolean(isSpeaking);
  const mouth = $("#nemoMouth"), eyes = $("#nemoEyes"), ant = $(".nemo-antenna"), orb = $("#widgetOrb") || $("#nemoOrb");
  [mouth, eyes, ant, orb].forEach((el) => {
    if (el) el.classList.toggle("speaking", active);
  });
  if (active && maxMs > 0) {
    nemoSpeakingWatchdog = setTimeout(() => {
      setMascotSpeaking(false);
    }, maxMs);
  }
  if (active && trackSynth && "speechSynthesis" in window) {
    let idleTicks = 0;
    nemoSpeechPollTimer = setInterval(() => {
      const synth = window.speechSynthesis;
      if (!synth || (!synth.speaking && !synth.pending)) {
        idleTicks++;
        if (idleTicks >= 3) setMascotSpeaking(false);
      } else {
        idleTicks = 0;
      }
    }, 320);
  }
}

const EXCLUDED_REGIONAL_VOICE_RE = /^(?:ta|hi|te|kn|ml|bn|mr|gu|pa|or|ur|as|ne|si)\b|tamil|hindi|telugu|kannada|malayalam|bengali|marathi|gujarati|punjabi|urdu|oriya|valluvar|kalpana|heera|hemant|ravi|veena|lekha|neel/i;

function getOptimalVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;
  const englishVoices = voices.filter((v) => v && /^en\b/i.test(String(v.lang || "")) && !EXCLUDED_REGIONAL_VOICE_RE.test(`${v.name || ""} ${v.lang || ""} ${v.voiceURI || ""}`));

  const isPreferredStandardEn = (v) => /^en[-_](us|gb|au|ca|nz|ie)\b/i.test(String(v.lang || ""));
  const isQualityEn = (v) => /natural|neural|google|samantha|aria|jenny|guy|daniel|karen|serena|martha|ava|allison|alex|zira|david|mark|female/i.test(String(v.name || ""));

  return englishVoices.find((v) => isPreferredStandardEn(v) && isQualityEn(v))
    || englishVoices.find((v) => isPreferredStandardEn(v))
    || englishVoices.find((v) => !/^en[-_]in\b/i.test(String(v.lang || "")) && isQualityEn(v))
    || englishVoices.find((v) => !/^en[-_]in\b/i.test(String(v.lang || "")))
    || englishVoices[0]
    || voices.find((v) => v && /^en\b/i.test(String(v.lang || "")))
    || null;
}

const EN_ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const EN_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const EN_SCALES = ["", "thousand", "million", "billion", "trillion"];

function chunkBelowThousandToEnglish(n) {
  const num = Math.floor(n);
  if (num <= 0) return "";
  const parts = [];
  const hundreds = Math.floor(num / 100);
  const rem = num % 100;
  if (hundreds > 0) {
    parts.push(`${EN_ONES[hundreds]} hundred`);
  }
  if (rem > 0) {
    if (rem < 20) {
      parts.push(EN_ONES[rem]);
    } else {
      const t = Math.floor(rem / 10);
      const u = rem % 10;
      parts.push(u > 0 ? `${EN_TENS[t]} ${EN_ONES[u]}` : EN_TENS[t]);
    }
  }
  return parts.join(" ");
}

function intToEnglishWords(rawInt) {
  const clean = String(rawInt || "").replace(/^0+(?=\d)/, "");
  if (!clean || !/^\d+$/.test(clean)) return String(rawInt || "");
  if (clean === "0") return "zero";
  if (clean.length > 15) {
    return clean.split("").map((d) => EN_ONES[Number(d)]).join(" ");
  }
  let num = Number(clean);
  if (!Number.isFinite(num)) {
    return clean.split("").map((d) => EN_ONES[Number(d)]).join(" ");
  }
  const groups = [];
  let scaleIdx = 0;
  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const words = chunkBelowThousandToEnglish(chunk);
      groups.unshift(EN_SCALES[scaleIdx] ? `${words} ${EN_SCALES[scaleIdx]}` : words);
    }
    num = Math.floor(num / 1000);
    scaleIdx++;
  }
  return groups.join(" ");
}

function digitsToEnglishEach(digitsStr) {
  return String(digitsStr || "")
    .split("")
    .map((ch) => (ch >= "0" && ch <= "9" ? EN_ONES[Number(ch)] : ch))
    .join(" ");
}

function yearToEnglishWords(yearStr) {
  const y = Number(yearStr);
  if (!Number.isInteger(y) || y < 1000 || y > 2099) return intToEnglishWords(yearStr);
  const hi = Math.floor(y / 100);
  const lo = y % 100;
  if (hi === 20 && lo < 10) {
    return lo === 0 ? "two thousand" : `two thousand ${EN_ONES[lo]}`;
  }
  if (lo === 0) return `${chunkBelowThousandToEnglish(hi)} hundred`;
  if (lo < 10) return `${chunkBelowThousandToEnglish(hi)} oh ${EN_ONES[lo]}`;
  return `${chunkBelowThousandToEnglish(hi)} ${chunkBelowThousandToEnglish(lo)}`;
}

function numberTokenToEnglish(numStr) {
  let s = String(numStr || "").trim().replace(/,/g, "").replace(/\u2212/g, "-");
  let prefix = "";
  if (s.startsWith("-")) {
    prefix = "minus ";
    s = s.slice(1);
  } else if (s.startsWith("+")) {
    prefix = "plus ";
    s = s.slice(1);
  }
  if (s.startsWith(".")) s = "0" + s;
  if (s.includes(".")) {
    const [whole, frac] = s.split(".");
    const wholeWords = whole ? intToEnglishWords(whole) : "zero";
    const fracWords = frac ? digitsToEnglishEach(frac) : "";
    return `${prefix}${wholeWords}${fracWords ? ` point ${fracWords}` : ""}`.trim();
  }
  return `${prefix}${intToEnglishWords(s)}`.trim();
}

function normalizeRegionalAndUnicodeDigits(str) {
  const offsets = [
    [0x0BE6, 0x0BEF], // Tamil
    [0x0966, 0x096F], // Devanagari
    [0x0C66, 0x0C6F], // Telugu
    [0x0CE6, 0x0CEF], // Kannada
    [0x0D66, 0x0D6F]  // Malayalam
  ];
  const subMap = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
  const supMap = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };

  let out = "";
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const code = ch.charCodeAt(0);
    // Strip any non-digit Tamil script characters to keep voice strictly English
    if (code >= 0x0B80 && code <= 0x0BE5) {
      out += " ";
      continue;
    }
    let mapped = null;
    for (const [start, end] of offsets) {
      if (code >= start && code <= end) {
        mapped = String(code - start);
        break;
      }
    }
    if (mapped !== null) {
      out += mapped;
    } else if (subMap[ch]) {
      out += subMap[ch];
    } else if (supMap[ch]) {
      out += `^${supMap[ch]}`;
    } else if (ch === "⁺") {
      out += "^+";
    } else if (ch === "⁻") {
      out += "^-";
    } else if (ch === "\u2212") {
      out += "-";
    } else {
      out += ch;
    }
  }
  // Collapse consecutive ^digits merged from multi-char Unicode superscripts like ²⁻ -> ^2- or ⁻¹ -> ^-1
  out = out.replace(/\^([0-9+-])(?:\^([0-9+-]))+/g, (m) => "^" + m.replace(/\^/g, ""));
  return out;
}

function readBalancedBraces(str, openIdx) {
  if (str[openIdx] !== "{") return null;
  let depth = 0;
  for (let i = openIdx; i < str.length; i++) {
    if (str[i] === "\\") {
      i++;
      continue;
    }
    if (str[i] === "{") depth++;
    else if (str[i] === "}") {
      depth--;
      if (depth === 0) {
        return { content: str.slice(openIdx + 1, i), endIdx: i + 1 };
      }
    }
  }
  return null;
}

function replaceLatexCommand(str, cmdRegex, arity, replacer) {
  let guard = 0;
  let cur = str;
  while (guard++ < 40) {
    cmdRegex.lastIndex = 0;
    const match = cmdRegex.exec(cur);
    if (!match) break;
    let pos = match.index + match[0].length;
    const args = [];
    let valid = true;
    for (let a = 0; a < arity; a++) {
      while (pos < cur.length && /\s/.test(cur[pos])) pos++;
      const parsed = readBalancedBraces(cur, pos);
      if (!parsed) {
        valid = false;
        break;
      }
      args.push(parsed.content);
      pos = parsed.endIdx;
    }
    if (!valid) break;
    const replacement = replacer(...args);
    cur = cur.slice(0, match.index) + replacement + cur.slice(pos);
  }
  return cur;
}

function ordinalToEnglish(rawNum) {
  const clean = String(rawNum || "").replace(/^0+(?=\d)/, "");
  if (!/^\d+$/.test(clean)) return String(rawNum || "");
  const n = Number(clean);
  if (!Number.isFinite(n) || n > 9999) return intToEnglishWords(clean);
  const irreg = {
    1: "first", 2: "second", 3: "third", 4: "fourth", 5: "fifth",
    6: "sixth", 7: "seventh", 8: "eighth", 9: "ninth", 10: "tenth",
    11: "eleventh", 12: "twelfth", 13: "thirteenth", 14: "fourteenth", 15: "fifteenth",
    16: "sixteenth", 17: "seventeenth", 18: "eighteenth", 19: "nineteenth",
    20: "twentieth", 30: "thirtieth", 40: "fortieth", 50: "fiftieth",
    60: "sixtieth", 70: "seventieth", 80: "eightieth", 90: "ninetieth"
  };
  if (irreg[n]) return irreg[n];
  if (n < 100) {
    const t = Math.floor(n / 10) * 10;
    const u = n % 10;
    return `${EN_TENS[t / 10]} ${irreg[u]}`;
  }
  const rem = n % 100;
  if (rem === 0) return `${intToEnglishWords(clean)}th`;
  const head = intToEnglishWords(String(n - rem));
  return `${head} ${ordinalToEnglish(String(rem))}`;
}

const CHEM_UNIT_PLURAL_MAP = {
  kJ: ["kilojoule", "kilojoules"],
  kcal: ["kilocalorie", "kilocalories"],
  cal: ["calorie", "calories"],
  eV: ["electron volt", "electron volts"],
  mmHg: ["millimeter of mercury", "millimeters of mercury"],
  kPa: ["kilopascal", "kilopascals"],
  MPa: ["megapascal", "megapascals"],
  Pa: ["pascal", "pascals"],
  atm: ["atmosphere", "atmospheres"],
  bar: ["bar", "bars"],
  mL: ["milliliter", "milliliters"],
  cm3: ["cubic centimeter", "cubic centimeters"],
  dm3: ["cubic decimeter", "cubic decimeters"],
  m3: ["cubic meter", "cubic meters"],
  nm: ["nanometer", "nanometers"],
  pm: ["picometer", "picometers"],
  mM: ["millimolar", "millimolar"],
  Hz: ["hertz", "hertz"],
  kg: ["kilogram", "kilograms"],
  mg: ["milligram", "milligrams"],
  mol: ["mole", "moles"],
  K: ["Kelvin", "Kelvin"],
  L: ["liter", "liters"],
  M: ["molar", "molar"],
  V: ["volt", "volts"],
  J: ["joule", "joules"],
  g: ["gram", "grams"],
  C: ["coulomb", "coulombs"],
  s: ["second", "seconds"]
};

function expandChemUnit(unit, isPlural) {
  const pair = CHEM_UNIT_PLURAL_MAP[unit];
  if (!pair) return unit;
  return isPlural ? pair[1] : pair[0];
}

function verbalizeChemToken(token) {
  // Converts chemical formula tokens containing element symbols + numbers (e.g. H2SO4, CO2, Cr2O7, NH4, FeCl3)
  // into natural spoken letter+number sequences so TTS never says "so" for SO4 or "coh" for CO2.
  return token.replace(/([A-Z][a-z]?)(\d*)/g, (m, sym, num) => {
    const symSpoken = sym.length === 2 ? `${sym[0]} ${sym[1]}` : sym;
    if (num) return ` ${symSpoken} ${digitsToEnglishEach(num)} `;
    return ` ${symSpoken} `;
  });
}

const CHEM_STATE_NAMES = {
  s: "solid",
  l: "liquid",
  g: "gas",
  aq: "aqueous"
};

function parseMhchemCondition(rawCond) {
  let c = String(rawCond || "").trim();
  c = replaceLatexCommand(c, /\\(?:text|mathrm|mathbf|boldsymbol|mathit|textit|mathsf|operatorname)\s*(?=\{)/g, 1, (x) => ` ${x} `);
  c = c
    .replace(/\\Delta|Δ/g, "heating")
    .replace(/\\heat\b|\bheat\b/gi, "heating")
    .replace(/h\s*\\nu/gi, "light")
    .replace(/\s+/g, " ")
    .trim();
  return c;
}

function parseMhchemForSpeech(inner) {
  let s = String(inner || "");
  s = replaceLatexCommand(s, /\\(?:text|mathrm|mathbf|boldsymbol|mathit|textit|mathsf|operatorname)\s*(?=\{)/g, 1, (x) => ` ${x} `);

  // 1. Reaction arrows with optional attached top/bottom conditions: ->[top][bot] (no whitespace before [top][bot])
  const formatArrow = (verb, top, bot) => {
    const t = top ? parseMhchemCondition(top) : "";
    const b = bot ? parseMhchemCondition(bot) : "";
    if (t === "heating" && !b) return `, on heating ${verb === "in equilibrium with" ? "in equilibrium with" : "gives"} `;
    if (t === "heating" && b) return `, on heating at ${b} ${verb === "in equilibrium with" ? "in equilibrium with" : "gives"} `;
    if (t && b) return `, reacts with ${t} at ${b} to ${verb === "gives" ? "give" : verb} `;
    if (t) return `, reacts in the presence of ${t} to ${verb === "gives" ? "give" : verb} `;
    return `, ${verb} `;
  };
  s = s
    .replace(/(?:<=>>|<<=>|<=>|⇌)(?:\[([^\]]*)\](?:\[([^\]]*)\])?)?/g, (_, top, bot) => formatArrow("in equilibrium with", top, bot))
    .replace(/(?:-->|->|→|\\rightarrow|\\longrightarrow)(?:\[([^\]]*)\](?:\[([^\]]*)\])?)?/g, (_, top, bot) => formatArrow("gives", top, bot))
    .replace(/(?:<--|<-|←|\\leftarrow)(?:\[([^\]]*)\](?:\[([^\]]*)\])?)?/g, (_, top, bot) => formatArrow("from", top, bot));

  // 2. Standalone gas evolution (^) & precipitate (v) markers (strictly standalone, NOT ^{2+})
  s = s
    .replace(/(?:^|\s)\(\s*\^\s*\)(?=\s|$|[.,;])/g, " gas evolved ")
    .replace(/(?<=\s|\))\^(?=\s|$|[.,;])/g, " gas evolved ")
    .replace(/(?:^|\s)\(\s*v\s*\)(?=\s|$|[.,;])/gi, " precipitate ")
    .replace(/(?<=\s|\))v(?=\s|$|[.,;])/g, " precipitate ");

  // 3. Isotopes like ^{14}_{6}C or ^{235}_{92}U or ^{14}C -> C fourteen
  s = s.replace(/(?:\^\s*\{\s*(\d+)\s*\}\s*(?:_\s*\{\s*\d+\s*\})?|\^\s*(\d+)\s*_\s*(\d+))\s*([A-Z][a-z]?)\b/g, (_, m1, m2, _z, elSym) => {
    const mass = m1 || m2;
    const elSpoken = elSym.length === 2 ? `${elSym[0]} ${elSym[1]}` : elSym;
    return ` ${elSpoken} ${mass} `;
  });

  // 4. Hydrate / double-salt center dots like FeSO4.(NH4)2SO4.6H2O -> dot (prevents ".6" -> "point six")
  s = s.replace(/([A-Za-z0-9\)\]])\s*[.*·]\s*(\d*[A-Za-z(\[])/g, "$1 dot $2");

  // 5. Chemical bonds inside formulas (ONLY when adjacent to formula tokens)
  s = s
    .replace(/([A-Za-z0-9\)\]])#([A-Za-z0-9\(\[])/g, (_, a, b) => `${a === "HC" ? "H C" : a} triple bond ${b === "CH" ? "C H" : b}`)
    .replace(/([A-Za-z0-9\)\]])=([A-Za-z0-9\(\[])/g, "$1 double bond $2")
    .replace(/([A-Za-z0-9\)\]])-([A-Z(\[])/g, "$1 $2");

  // 6. Electrons: 5e-, 6e^-, e-, e^-
  s = s
    .replace(/(\d+)\s*e\s*(?:\^\s*\{?\s*-\s*\}?|-)(?=\s|$|[.,;)])/g, (_, n) => ` ${n} ${Number(n) === 1 ? "electron" : "electrons"} `)
    .replace(/(?<![A-Za-z])e\s*(?:\^\s*\{?\s*-\s*\}?|-)(?=\s|$|[.,;)])/g, " an electron ");

  // 7. Ionic charges in mhchem (Fe^{2+}, [PtCl4]^{2-}, A^{y+}, B^{x-}, MnO4-, NH4+, Cl-)
  s = s
    .replace(/\^\s*\{\s*(\d+)\s*([+-])\s*\}/g, (_, q, sign) => `, ${intToEnglishWords(q)} ${sign === "+" ? "plus" : "minus"} `)
    .replace(/\^\s*\{\s*([A-Za-z])\s*([+-])\s*\}/g, (_, sym, sign) => `, ${sym} ${sign === "+" ? "plus" : "minus"} `)
    .replace(/\^\s*\{\s*([+-])\s*\}/g, (_, sign) => `, ${sign === "+" ? "plus" : "minus"} `)
    .replace(/\^\s*([+-])(?![0-9{])/g, (_, sign) => `, ${sign === "+" ? "plus" : "minus"} `)
    .replace(/(?<![A-Za-z0-9])([A-Z][a-z]?|[\]\)])\s*([2-9])([+-])(?=\s|$|[.,;(])/g, (_, pre, q, sign) => `${pre}, ${intToEnglishWords(q)} ${sign === "+" ? "plus" : "minus"} `)
    .replace(/([A-Za-z0-9\]\)])([+-])(?=\s|$|[.,;(])/g, (_, pre, sign) => `${pre}, ${sign === "+" ? "plus" : "minus"} `);

  // 8. State symbols attached to chemical species (after ionic charges so ^{2+}(aq) works cleanly)
  s = s
    .replace(/\(\s*(s|l|g|aq)\s*\)(?=\s|$|[.,;+\-=])/g, (_, st) => ` ${CHEM_STATE_NAMES[st]} `)
    .replace(/\bgas\s+gas evolved\b/g, "gas evolved");

  // 9. Variable subscripts like A_x B_y -> A x B y
  s = s.replace(/([A-Za-z])_([A-Za-z])/g, "$1 $2");

  // 10. Separate leading stoichiometric coefficients from formulas (2H2O -> 2 H2O, 2NH4 -> 2 NH4)
  s = s.replace(/(?<![A-Za-z])(\d+)([A-Z][A-Za-z0-9]*)/g, "$1 $2");

  return ` ${s} `;
}

function speechClean(text) {
  let s = String(text || "");
  s = normalizeRegionalAndUnicodeDigits(s);

  // Drop code blocks, horizontal rules & markdown table divider lines completely
  s = s
    .replace(/```[\s\S]*?```/g, ". ")
    .replace(/^\s*\|?(?:\s*:?-{2,}:?\s*\|)+\s*$/gm, " ")
    .replace(/^\s*(?:[-*_]\s*){3,}$/gm, " ")
    // Preserve conversational pause after markdown headings
    .replace(/^\s*#{1,6}\s+([^\n]+)/gm, (_, h) => `${h.replace(/[*_`]+/g, "").trim()}. `)
    // Strip decorative symbols / emojis cleanly into slight pauses rather than reading glyph names
    .replace(/[✦⚡💡🎯⚠️★☆📋🎨🔍●▪◦✓✕■➤🎙🔊🔇]/g, " ")
    // Expand common study abbreviations so speech flows like a human tutor
    .replace(/\be\.g\.,?/gi, "for example,")
    .replace(/\bi\.e\.,?/gi, "that is,")
    .replace(/\betc\./gi, "and so on")
    .replace(/\bw\.r\.t\./gi, "with respect to")
    .replace(/\bvs\.?\b/gi, "versus")
    .replace(/\bB\.M\./g, "Bohr magnetons")
    .replace(/\bAnhy\.\s*/gi, "anhydrous ")
    .replace(/\bdil\.\s*/gi, "dilute ")
    .replace(/\bconc\.\s*/gi, "concentrated ")
    .replace(/\baq\.\b/gi, "aqueous");

  // Unwrap LaTeX math delimiters
  s = s
    .replace(/\$\$([\s\S]*?)\$\$/g, " $1 ")
    .replace(/\$([^$]+)\$/g, " $1 ")
    .replace(/\\\[([\s\S]*?)\\\]/g, " $1 ")
    .replace(/\\\(([\s\S]*?)\\\)/g, " $1 ");

  // Handle nested LaTeX commands cleanly
  s = replaceLatexCommand(s, /\\ce\s*(?=\{)/g, 1, parseMhchemForSpeech);
  s = replaceLatexCommand(s, /\\(?:d|t)?frac\s*(?=\{)/g, 2, (num, den) => {
    if (num.trim() === "1" && den.trim() === "2") return " one half ";
    return ` ${num}, over ${den} `;
  });
  s = replaceLatexCommand(s, /\\sqrt\s*(?=\{)/g, 1, (inner) => ` square root of ${inner} `);
  s = replaceLatexCommand(s, /\\(?:text|mathrm|mathbf|boldsymbol|mathit|textit|mathsf|operatorname)\s*(?=\{)/g, 1, (inner) => ` ${inner} `);
  s = replaceLatexCommand(s, /\\xrightarrow(?:\[[^\]]*\])?\s*(?=\{)/g, 1, (cond) => `, reacts under ${cond} to give `);
  s = replaceLatexCommand(s, /\\xleftarrow(?:\[[^\]]*\])?\s*(?=\{)/g, 1, (cond) => `, from ${cond} `);

  s = s
    .replace(/\\left(?![A-Za-z])\s*([(\[|{.]?)/g, " $1 ")
    .replace(/\\right(?![A-Za-z])\s*([)\]|}.]?)/g, " $1 ")
    .replace(/\\(?:q?quad|enspace|thinspace)\b/g, ", ")
    .replace(/\\[,;:!\s]/g, " ")
    .replace(/\\ln\b/g, " natural log of ")
    .replace(/\\log_\{?10\}?/g, " log base ten ")
    .replace(/\\log\b/g, " log ")
    .replace(/\\Delta|Δ/g, " delta ")
    .replace(/\\alpha|α/g, " alpha ")
    .replace(/\\beta|β/g, " beta ")
    .replace(/\\gamma|γ/g, " gamma ")
    .replace(/\\theta|θ/g, " theta ")
    .replace(/\\nu|ν/g, " nu ")
    .replace(/\\lambda|λ/g, " lambda ")
    .replace(/\\mu|μ/g, " mu ")
    .replace(/\\pi|π/g, " pi ")
    .replace(/\\sigma|σ/g, " sigma ")
    .replace(/\\omega|ω/g, " omega ")
    .replace(/\\Lambda|Λ/g, " lambda ")
    .replace(/\\cdot/g, " dot ")
    .replace(/\\times|×/g, " times ")
    .replace(/\\div|÷/g, " divided by ")
    .replace(/\\pm|±/g, " plus or minus ")
    .replace(/\\approx|≈/g, " is approximately ")
    .replace(/\\neq|\\ne|≠/g, " is not equal to ")
    .replace(/\\geq|\\ge|≥/g, " is greater than or equal to ")
    .replace(/\\leq|\\le|≤/g, " is less than or equal to ")
    .replace(/\\propto|∝/g, " is proportional to ")
    .replace(/\\implies/g, ", which implies ")
    .replace(/\\iff/g, ", if and only if ")
    .replace(/\\(?:left)?rightleftharpoons|\\leftrightharpoons|⇌|↔|<=>/g, ", in equilibrium with ")
    .replace(/\\longrightarrow|\\rightarrow|\\to|⟶|→|-->|->/g, ", gives ")
    .replace(/↑/g, " gas ")
    .replace(/↓/g, " precipitate ")
    // Temperature ^\circ C / ^\circ F and numeric degrees (90^\circ, 3^\circ) BEFORE \circ -> naught
    .replace(/\^\s*\{?\s*(?:\\circ|°)\s*\}?\s*C\b/gi, " degrees Celsius ")
    .replace(/\^\s*\{?\s*(?:\\circ|°)\s*\}?\s*F\b/gi, " degrees Fahrenheit ")
    .replace(/°\s*C\b/gi, " degrees Celsius ")
    .replace(/°\s*F\b/gi, " degrees Fahrenheit ")
    .replace(/(\d+)\s*\^\s*\{?\s*(?:\\circ|°)\s*\}?/g, (_, deg) => ` ${numberTokenToEnglish(deg)} ${Number(deg) === 1 ? "degree" : "degrees"} `)
    // Standard state superscripts & thermodynamic symbols
    .replace(/\bE\s*\^\s*\{\s*(?:\\circ|°|o|0)\s*\}\s*_?\{?\s*cell\s*\}?/gi, " E naught cell ")
    .replace(/\bE\s*°\s*_?\{?\s*cell\s*\}?/gi, " E naught cell ")
    .replace(/\^\s*\{?\s*(?:\\circ|°)\s*\}?/g, " naught ")
    .replace(/([ΔA-Za-z])\s*\^\s*\{?\s*[o0]\s*\}?(?=\s|_|\b|$)/g, "$1 naught ")
    .replace(/([ΔA-Za-z])\s*°/g, "$1 naught ")
    .replace(/°/g, " degrees ")
    .replace(/Å/g, " angstroms ")
    .replace(/Ω/g, " ohms ")
    .replace(/%/g, " percent ");

  // Chemistry identifiers, crystal-field orbitals & named kinetic/structural terms
  s = s
    .replace(/\bt_?\{?\s*2g\s*\}?(?:\s*\^\s*(\d+))?/gi, (_, occ) => ` t two g ${occ ? digitsToEnglishEach(occ) : ""} `)
    .replace(/\be_?\{?\s*g\s*\}?(?:\s*\^\s*(\d+))?/gi, (_, occ) => ` e g ${occ ? digitsToEnglishEach(occ) : ""} `)
    .replace(/\bSN\s*1\b/gi, "S N one")
    .replace(/\bSN\s*2\b/gi, "S N two")
    .replace(/\bE\s*1\s*cb\b/gi, "E one c b")
    .replace(/\bE\s*1\b/g, "E one")
    .replace(/\bE\s*2\b/g, "E two")
    .replace(/\bsp3d2\b/gi, "s p three d two")
    .replace(/\bsp3d\b/gi, "s p three d")
    .replace(/\bdsp2\b/gi, "d s p two")
    .replace(/\bsp3\b/gi, "s p three")
    .replace(/\bsp2\b/gi, "s p two")
    .replace(/\bsp\b/gi, "s p")
    .replace(/\bpK_?\{?\s*([abw])\s*\}?\b/g, (_, sub) => ` p K ${sub} `)
    .replace(/\bK_?\{?\s*(sp|eq|a|b|w|c|p)\s*\}?\b/g, (_, sub) => ` K ${sub === "eq" ? "e q" : sub.split("").join(" ")} `)
    .replace(/\bE_?\{?\s*(a|cell)\s*\}?\b/g, (_, sub) => ` E ${sub === "a" ? "a" : "cell"} `)
    .replace(/\bpH\b/g, " p H ")
    .replace(/\bpOH\b/g, " p O H ")
    .replace(/\bnFE\b/g, " n F E ")
    .replace(/\b1\/2\b/g, " one half ")
    // Merge formula subscripts like Cr_2O_7 -> Cr2O7 before symbolic subscripts
    .replace(/([A-Z][a-z]?)_(\d+)/g, "$1$2")
    .replace(/_\{\s*([+-])\s*\}|_([+-])(?=\s|$|[\\^{}])/g, (_, a, b) => ` ${(a || b) === "+" ? "plus" : "minus"} `)
    .replace(/([A-Za-z])_\{([^}]+)\}/g, "$1 $2")
    .replace(/([A-Za-z])_([A-Za-z0-9]+)/g, "$1 $2")
    // Dot-separated physical chemistry units BEFORE exponent rules mangle ^-1
    .replace(/L\s*·\s*atm\s*·\s*mol\s*\^\s*\{?-1\}?\s*·\s*K\s*\^\s*\{?-1\}?|L·atm\/mol·K/gi, " liter atmospheres per mole Kelvin ")
    .replace(/L\s*·\s*bar\s*·\s*mol\s*\^\s*\{?-1\}?\s*·\s*K\s*\^\s*\{?-1\}?|L·bar\/mol·K/gi, " liter bars per mole Kelvin ")
    .replace(/S\s*·\s*m\s*\^\s*\{?2\}?\s*·\s*mol\s*\^\s*\{?-1\}?/gi, " siemens meters squared per mole ")
    .replace(/J\s*·\s*mol\s*\^\s*\{?-1\}?\s*·\s*K\s*\^\s*\{?-1\}?/gi, " joules per mole Kelvin ")
    .replace(/C\s*·\s*mol\s*\^\s*\{?-1\}?/gi, " coulombs per mole ")
    .replace(/kJ\s*\/\s*mol/gi, " kilojoules per mole ")
    .replace(/kcal\s*\/\s*mol/gi, " kilocalories per mole ")
    .replace(/J\s*\/\s*mol/gi, " joules per mole ")
    .replace(/mol\s*\/\s*(?:L|dm3|dm\^3)/gi, " moles per liter ")
    .replace(/mol\s*\/\s*m3/gi, " moles per cubic meter ")
    .replace(/g\s*\/\s*mol/gi, " grams per mole ")
    .replace(/g\s*\/\s*cm3/gi, " grams per cubic centimeter ")
    // Negative inverse units like s^-1, mol^-1, K^-1, L^-1 BEFORE bare ^+/- ionic rules
    .replace(/\b(s|min|hr|h|mol|L|m|kg|g|K)\^\s*\{?\s*-1\s*\}?/gi, (_, u) => ` per ${expandChemUnit(u, false)} `)
    .replace(/\b(cm|dm|m)\^\s*\{?\s*3\s*\}?/gi, (_, u) => ` cubic ${u === "cm" ? "centimeters" : u === "dm" ? "decimeters" : "meters"} `)
    .replace(/\b(cm|dm|m)\^\s*\{?\s*2\s*\}?/gi, (_, u) => ` square ${u === "cm" ? "centimeters" : u === "dm" ? "decimeters" : "meters"} `)
    // Electrons outside \ce{...}: 14e^-, e^-
    .replace(/(\d+)\s*e\s*\^\s*\{?\s*-\s*\}?(?=\s|$|[.,;)])/g, (_, n) => ` ${n} ${Number(n) === 1 ? "electron" : "electrons"} `)
    .replace(/(?<![A-Za-z])e\s*\^\s*\{?\s*-\s*\}?(?=\s|$|[.,;)])/g, " an electron ")
    // Ionic charges like Fe^{2+}, SO4^{2-}, NH4^+, Cl^- (strictly NOT matching 10^{-7} or MnO4-)
    .replace(/\^\s*\{\s*(\d+)\s*([+-])\s*\}/g, (_, q, sign) => `, ${intToEnglishWords(q)} ${sign === "+" ? "plus" : "minus"} `)
    .replace(/\^\s*(\d+)([+-])(?![0-9])/g, (_, q, sign) => `, ${intToEnglishWords(q)} ${sign === "+" ? "plus" : "minus"} `)
    .replace(/\^\s*\{\s*([+-])\s*\}/g, (_, sign) => `, ${sign === "+" ? "plus" : "minus"} `)
    .replace(/\^\s*([+-])(?![0-9{])/g, (_, sign) => `, ${sign === "+" ? "plus" : "minus"} `)
    .replace(/(?<![A-Z0-9])([A-Z][a-z]?|[\]\)])\s*([2-9])([+-])(?=\s|$|[.,;)])/g, (_, pre, q, sign) => `${pre}, ${intToEnglishWords(q)} ${sign === "+" ? "plus" : "minus"} `)
    // Powers & exponents (e.g. 10^{-7}, 10^-10, [A]^2, [C]^c)
    .replace(/\^\s*\{\s*([+-]?\d+(?:\.\d+)?)\s*\}/g, (_, exp) => ` to the power ${numberTokenToEnglish(exp)} `)
    .replace(/\^2\b/g, " squared ")
    .replace(/\^3\b/g, " cubed ")
    .replace(/\^([+-]?\d+(?:\.\d+)?)\b/g, (_, exp) => ` to the power ${numberTokenToEnglish(exp)} `)
    .replace(/\^\s*\{\s*([A-Za-z])\s*\}/g, (_, exp) => ` to the power ${exp} `)
    .replace(/\^\s*([A-Za-z])\b/g, (_, exp) => ` to the power ${exp} `)
    // Scientific notation (e.g. 6.022e23, 1.602177e-19)
    .replace(/([+-]?\d+(?:\.\d+)?)[eE]([+-]?\d+)\b/g, (_, mant, exp) => `${numberTokenToEnglish(mant)} times ten to the power ${numberTokenToEnglish(exp)}`)
    // Locant notations like 1,2-hydride -> one two hydride
    .replace(/\b(\d),(\d)-(?=[a-zA-Z])/g, (_, a, b) => `${EN_ONES[Number(a)]} ${EN_ONES[Number(b)]} `)
    // Years like 2016–2026
    .replace(/\b(19\d{2}|20\d{2})\s*[–—-]\s*(19\d{2}|20\d{2})\b/g, (_, y1, y2) => `${yearToEnglishWords(y1)} to ${yearToEnglishWords(y2)}`)
    // Numeric ranges with optional trailing unit (e.g. 273–278 K, 10–25 atm)
    .replace(/\b(\d+(?:\.\d+)?)\s*[–—-]\s*(\d+(?:\.\d+)?)(?:\s*(kJ|kcal|cal|eV|mmHg|kPa|MPa|Pa|atm|bar|mL|cm3|dm3|m3|nm|pm|mM|Hz|kg|mg|mol|K|L|M|V|J|g|C|s)\b)?/g, (_, a, b, unit) => {
      const unitStr = unit ? ` ${expandChemUnit(unit, true)}` : "";
      return `${numberTokenToEnglish(a)} to ${numberTokenToEnglish(b)}${unitStr}`;
    })
    // Class / grade slash or acronym slashes like NCERT/JEE, CBSE/JEE, 11/12
    .replace(/\b11\/12\b/g, "eleven and twelve")
    .replace(/\b([A-Z]{2,})\s*\/\s*([A-Z]{2,})\b/g, "$1 and $2")
    .replace(/\b(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\b/g, (_, a, b) => `${numberTokenToEnglish(a)} over ${numberTokenToEnglish(b)}`)
    // Ordinals like 1st, 2nd, 3rd, 11th, 12th, 21st
    .replace(/\b(\d+)(?:st|nd|rd|th)\b/gi, (_, num) => ordinalToEnglish(num))
    // Chemical units following numeric quantities (including scientific notation endings like "...minus nineteen C")
    .replace(/([+-]?\d+(?:\.\d+)?)\s*(kJ|kcal|cal|eV|mmHg|kPa|MPa|Pa|atm|bar|mL|cm3|dm3|m3|nm|pm|mM|Hz|kg|mg|mol|K|L|M|V|J|g|C|s)\b/g, (_, n, unit) => {
      const val = Number(n);
      const plural = Math.abs(val) !== 1;
      return ` ${numberTokenToEnglish(n)} ${expandChemUnit(unit, plural)} `;
    })
    // Trailing single unit after spoken "to the power ..." or number words (e.g. "...minus nineteen C" -> "...minus nineteen coulombs")
    .replace(/\b(to the power (?:minus |plus )?[a-z\s]+?)\s+(C|J|V|K|M|L|atm|bar|mol|eV)\b/g, (_, expr, unit) => `${expr} ${expandChemUnit(unit, true)}`)
    // Math comparisons & signs & unary minus before expressions (e.g. BF3 < BCl3, -nFE, -log)
    .replace(/\s*>\s*/g, " is greater than ")
    .replace(/\s*<\s*/g, " is less than ")
    .replace(/\s*\+\s*/g, " plus ")
    .replace(/(^|[\s=(])-([A-Za-z])/g, "$1minus $2")
    .replace(/\s+-\s+/g, " minus ")
    .replace(/\s*=\s*/g, " equals ")
    .replace(/([A-Za-z0-9])\s*\/\s*([A-Za-z])/g, "$1 over $2")
    .replace(/([A-Za-z])0\b/g, "$1 naught")
    // Separate stoichiometric coefficients from formulas (e.g. 7H2O -> 7 H2O, 2Cr -> 2 Cr, 14H -> 14 H)
    .replace(/(?<![A-Za-z])(\d+)([A-Z][A-Za-z0-9]*)/g, "$1 $2")
    // Common digit-less inorganic formulas that TTS otherwise pronounces as words ("NaCl" -> "N a C l")
    .replace(/\b(?:NaCl|KCl|LiCl|CsCl|AgCl|HCl|HBr|NaOH|KOH|LiOH|KBr|NaBr|KI|NaF|MgO|CaO|BaO|ZnO|ZnS|FeS|CuO|KCN|NaCN|HCN)\b/g, (tok) => ` ${verbalizeChemToken(tok)} `)
    // Chemical formulas with digits (e.g. H2SO4, CO2, CH3COOH, FeCl3, Cr2O7, PtCl4)
    .replace(/\b(?=[A-Z][A-Za-z]*\d)(?:[A-Z][a-z]?\d*)+\b/g, (tok) => ` ${verbalizeChemToken(tok)} `)
    // Remaining alphanumeric tokens (e.g. 2Cr, 14H, 6e, 4f, 3d, d9, p2)
    .replace(/(\d+)([A-Z][a-z]?)(?=\b|\s|,)/g, (_, d, sym) => ` ${intToEnglishWords(d)} ${sym.length === 2 ? `${sym[0]} ${sym[1]}` : sym} `)
    .replace(/([A-Za-z])(\d+)/g, (_, ch, d) => `${ch} ${digitsToEnglishEach(d)} `)
    .replace(/(\d+)([A-Za-z]+)\b/g, (_, d, tail) => ` ${intToEnglishWords(d)} ${tail} `)
    // Years standing alone (2016..2029)
    .replace(/\b(20\d{2})\b/g, (_, y) => ` ${yearToEnglishWords(y)} `)
    // General signed/decimal/comma-grouped numbers
    .replace(/(?<![\w.])([+-]?\d{1,3}(?:,\d{3})+|[+-]?\d*(?:\.\d+)|[+-]?\d+)(?![\w.])/g, (tok) => ` ${numberTokenToEnglish(tok)} `)
    // Hydrate / multiplication center dot remaining
    .replace(/·/g, " dot ")
    // Final guarantee: ZERO raw digits or Tamil characters remain anywhere
    .replace(/[\u0B80-\u0BFF]/g, " ")
    .replace(/\d/g, (d) => ` ${EN_ONES[Number(d)]} `)
    .replace(/[*_#`~>\\{}\[\]]/g, " ")
    .replace(/\|/g, ", ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,;:])\s*(?=[,;:])/g, "")
    .replace(/,\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return s;
}

window.nemoSpeechClean = speechClean;
window.nemoGetOptimalVoice = getOptimalVoice;

function createEnglishUtterance(cleanedText, { rate = 0.98, pitch = 1.04 } = {}) {
  const utt = new SpeechSynthesisUtterance(cleanedText);
  const v = getOptimalVoice();
  if (v) {
    try { utt.voice = v; } catch (_) {}
  }
  utt.lang = (v && /^en[-_](us|gb|au|ca|nz|ie)\b/i.test(String(v.lang || ""))) ? v.lang : "en-US";
  utt.rate = rate;
  utt.pitch = pitch;
  return utt;
}

/* ============================== Nemo Hybrid Speech Engine (Gemini Flash Lite TTS + English Fallback) ============================== */
const NemoSpeechEngine = (() => {
  const ttsCache = new Map();
  const inflightClips = new Map();
  let runSeq = 0;
  let activeAudio = null;
  let activeAudioUrl = "";
  let activeCtrl = null;
  let activeListenBtn = null;
  let activeVoiceBubble = null;
  let geminiCooldownUntil = 0;

  function splitIntoNaturalChunks(cleanedText, firstMax = 115, restMax = 400) {
    const sentences = cleanedText
      .replace(/([.!?])\s+/g, "$1\n")
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    if (!sentences.length) return [];

    // Keep Chunk 0 short (first sentence or clause <= firstMax) for ultra-fast Time-To-First-Audio
    const out = [];
    let first = sentences[0];
    let startIdx = 1;
    if (first.length > firstMax + 25) {
      const slice = first.slice(0, firstMax + 20);
      const sepMatch = slice.match(/^([\s\S]{42,}?[,;:])\s+([\s\S]+)$/);
      if (sepMatch) {
        out.push(sepMatch[1].trim());
        sentences[0] = first.slice(sepMatch[1].length).trim();
        startIdx = 0;
      } else {
        out.push(first);
      }
    } else {
      while (startIdx < sentences.length && (first.length + 1 + sentences[startIdx].length) <= firstMax) {
        first = `${first} ${sentences[startIdx++]}`;
      }
      out.push(first);
    }

    let buf = "";
    for (let i = startIdx; i < sentences.length; i++) {
      const s = sentences[i];
      if (!s) continue;
      if (buf && (buf.length + 1 + s.length) > restMax) {
        out.push(buf);
        buf = s;
      } else {
        buf = buf ? `${buf} ${s}` : s;
      }
    }
    if (buf) out.push(buf);
    return out;
  }

  function clearSpeechUi() {
    if (activeListenBtn) {
      activeListenBtn.classList.remove("is-speaking");
      activeListenBtn.disabled = false;
      activeListenBtn.setAttribute("aria-pressed", "false");
      activeListenBtn.textContent = "🔊 Listen";
      activeListenBtn = null;
    }
    if (activeVoiceBubble) {
      activeVoiceBubble.classList.remove("is-speaking");
      activeVoiceBubble = null;
    }
  }

  function stop() {
    runSeq++;
    if (activeCtrl) {
      try { activeCtrl.abort(); } catch (_) {}
      activeCtrl = null;
    }
    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.src = "";
      } catch (_) {}
      activeAudio = null;
    }
    if (activeAudioUrl) {
      try { URL.revokeObjectURL(activeAudioUrl); } catch (_) {}
      activeAudioUrl = "";
    }
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      if (synth && (synth.speaking || synth.pending)) {
        try { synth.cancel(); } catch (_) {}
      }
    }
    clearSpeechUi();
    setMascotSpeaking(false);
  }

  function fetchGeminiAudioClip(chunkText, seq, opts = {}) {
    const isPrefetch = Boolean(opts.isPrefetch);
    const cacheKey = `Zephyr::${chunkText}`;
    if (ttsCache.has(cacheKey)) {
      return Promise.resolve(ttsCache.get(cacheKey));
    }

    const cfg = store.get(AI_CFG_KEY, null) || {};
    const ttsCapable = Boolean(window.__nemoTtsReady || (cfg && cfg.key));
    if (!ttsCapable || !/^https?:$/.test(location.protocol) || Date.now() < geminiCooldownUntil) {
      return Promise.resolve(null);
    }

    // Deduplicate in-flight synthesis: if hover/prewarm already started this exact chunk, reuse it!
    if (inflightClips.has(cacheKey)) {
      const existing = inflightClips.get(cacheKey);
      if (isPrefetch) return existing;
      const waitBudget = opts.timeoutMs || 4200;
      return new Promise((resolve) => {
        let settled = false;
        const timer = setTimeout(() => {
          if (!settled) { settled = true; resolve(null); }
        }, waitBudget);
        existing.then((blob) => {
          clearTimeout(timer);
          if (!settled) {
            settled = true;
            resolve(seq === runSeq ? blob : null);
          }
        }).catch(() => {
          clearTimeout(timer);
          if (!settled) { settled = true; resolve(null); }
        });
      });
    }

    const timeoutMs = opts.timeoutMs || (isPrefetch ? 6500 : 4200);
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    if (!isPrefetch && ctrl) activeCtrl = ctrl;

    const reqPromise = (async () => {
      let timerId = null;
      try {
        if (ctrl) {
          timerId = setTimeout(() => {
            try { ctrl.abort(); } catch (_) {}
          }, timeoutMs);
        }
        const headers = { "Content-Type": "application/json" };
        if (cfg && cfg.key) headers["X-Goog-Api-Key"] = cfg.key;

        const res = await fetch("/api/tts", {
          method: "POST",
          headers,
          body: JSON.stringify({
            text: chunkText,
            voiceName: "Zephyr",
            style: "Warm, natural, human chemistry tutor in standard American English. Pronounce values and formulas clearly."
          }),
          signal: ctrl ? ctrl.signal : undefined
        });
        clearTimeout(timerId);
        if (!res.ok) {
          if (res.status === 429 || res.status === 503) {
            geminiCooldownUntil = Date.now() + (res.status === 429 ? 120000 : 60000);
          }
          return null;
        }
        const data = await res.json();
        if (!data || !data.audioBase64) return null;

        const bin = atob(data.audioBase64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const blob = new Blob([bytes], { type: data.mimeType || "audio/wav" });

        if (ttsCache.size >= 36) {
          const oldestKey = ttsCache.keys().next().value;
          ttsCache.delete(oldestKey);
        }
        ttsCache.set(cacheKey, blob);
        return blob;
      } catch (_) {
        clearTimeout(timerId);
        return null;
      } finally {
        inflightClips.delete(cacheKey);
        if (!isPrefetch && activeCtrl === ctrl) activeCtrl = null;
      }
    })();

    inflightClips.set(cacheKey, reqPromise);
    if (isPrefetch) return reqPromise;
    return reqPromise.then((blob) => (seq === runSeq ? blob : null));
  }

  function prewarm(rawMarkdown) {
    if (!window.__nemoTtsReady && !((store.get(AI_CFG_KEY, null) || {}).key)) return;
    const cleaned = speechClean(rawMarkdown);
    if (!cleaned) return;
    const chunks = splitIntoNaturalChunks(cleaned, 115, 400);
    if (!chunks.length) return;
    const first = chunks[0];
    if (ttsCache.has(`Zephyr::${first}`) || inflightClips.has(`Zephyr::${first}`)) return;
    fetchGeminiAudioClip(first, -1, { isPrefetch: true, timeoutMs: 6500 });
  }

  function playWebSpeechChunks(chunks, startIdx, seq) {
    if (!("speechSynthesis" in window) || startIdx >= chunks.length || seq !== runSeq) {
      if (seq === runSeq) {
        clearSpeechUi();
        setMascotSpeaking(false);
      }
      return;
    }
    const synth = window.speechSynthesis;
    const neededCancel = Boolean(synth && (synth.speaking || synth.pending));
    if (neededCancel) {
      try { synth.cancel(); } catch (_) {}
    }

    let idx = startIdx;
    function speakNext() {
      if (seq !== runSeq || idx >= chunks.length) {
        if (seq === runSeq) {
          clearSpeechUi();
          setMascotSpeaking(false);
        }
        return;
      }
      const chunkText = chunks[idx++];
      const utt = createEnglishUtterance(chunkText, { rate: 1.0, pitch: 1.04 });
      setMascotSpeaking(true, 28000, true);

      window._nemoUtterances.add(utt);
      utt.onend = () => {
        window._nemoUtterances.delete(utt);
        speakNext();
      };
      utt.onerror = () => {
        window._nemoUtterances.delete(utt);
        if (seq === runSeq) {
          clearSpeechUi();
          setMascotSpeaking(false);
        }
      };
      synth.speak(utt);
    }

    // Only defer 15ms if cancel() was actually called to prevent Chromium's same-tick speak() drop quirk
    if (neededCancel) setTimeout(speakNext, 15);
    else speakNext();
  }

  function playAudioBlob(blob, seq) {
    return new Promise((resolve) => {
      if (seq !== runSeq) return resolve("stopped");
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      activeAudio = audio;
      activeAudioUrl = url;

      const finish = (outcome) => {
        if (activeAudio === audio) activeAudio = null;
        if (activeAudioUrl === url) {
          try { URL.revokeObjectURL(url); } catch (_) {}
          activeAudioUrl = "";
        }
        resolve(outcome);
      };

      audio.addEventListener("playing", () => {
        if (seq === runSeq) setMascotSpeaking(true, 45000, false);
      }, { once: true });
      audio.addEventListener("ended", () => finish("ended"), { once: true });
      audio.addEventListener("error", () => finish("error"), { once: true });

      if (seq === runSeq) setMascotSpeaking(true, 45000, false);
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((err) => {
          finish(err && err.name === "NotAllowedError" ? "blocked" : "error");
        });
      }
    });
  }

  async function play(rawMarkdown, opts = {}) {
    const cleaned = speechClean(rawMarkdown);
    if (!cleaned) return;

    stop();
    const seq = runSeq;
    const chunks = splitIntoNaturalChunks(cleaned, opts.firstChunkLen || 115, opts.maxChunkLen || 400);
    if (!chunks.length) return;

    if (opts.listenBtn) {
      activeListenBtn = opts.listenBtn;
      activeListenBtn.classList.add("is-speaking");
      activeListenBtn.setAttribute("aria-pressed", "true");
      activeListenBtn.textContent = "⏹ Stop";
    }
    if (opts.voiceBubble) {
      activeVoiceBubble = opts.voiceBubble;
      activeVoiceBubble.classList.add("is-speaking");
    }

    const cfg = store.get(AI_CFG_KEY, null) || {};
    const canTryGemini = opts.allowGeminiTTS !== false && Boolean(window.__nemoTtsReady || (cfg && cfg.key)) && /^https?:$/.test(location.protocol);
    if (canTryGemini) {
      // Immediately show speaking animation on mascot when cache already holds Chunk 0
      if (ttsCache.has(`Zephyr::${chunks[0]}`)) {
        setMascotSpeaking(true, 30000, false);
      }
      let nextPromise = fetchGeminiAudioClip(chunks[0], seq, { timeoutMs: 4200 });
      for (let i = 0; i < chunks.length; i++) {
        if (seq !== runSeq) return;
        const blob = await nextPromise;
        if (seq !== runSeq) return;

        if (!blob) {
          // Seamless switch to standard-English Web Speech for remaining chunks
          playWebSpeechChunks(chunks, i, seq);
          return;
        }
        if (i + 1 < chunks.length) {
          nextPromise = fetchGeminiAudioClip(chunks[i + 1], seq, { timeoutMs: 6000 });
        }
        const outcome = await playAudioBlob(blob, seq);
        if (seq !== runSeq) return;
        if (outcome === "blocked") {
          clearSpeechUi();
          setMascotSpeaking(false);
          return;
        }
        if (outcome === "error") {
          playWebSpeechChunks(chunks, i, seq);
          return;
        }
      }
      if (seq === runSeq) {
        clearSpeechUi();
        setMascotSpeaking(false);
      }
      return;
    }

    playWebSpeechChunks(chunks, 0, seq);
  }

  function isButtonActive(btn) {
    return Boolean(btn && activeListenBtn === btn);
  }

  return { play, stop, prewarm, isButtonActive };
})();

window.nemoStopSpeech = () => NemoSpeechEngine.stop();
window.nemoToggleBubbleSpeech = (btn, text) => {
  if (NemoSpeechEngine.isButtonActive(btn)) {
    NemoSpeechEngine.stop();
    return;
  }
  NemoSpeechEngine.play(text, { listenBtn: btn });
};

function speak(markdown, fromVoice) {
  if (!(speakAnswers || fromVoice)) return;
  NemoSpeechEngine.play(markdown, {});
}

/* Pre-warm voices on browser load */
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    getOptimalVoice();
  };
}

/* ---- Voice Input (SpeechRecognition) ---- */
let recognition = null, listening = false, speakAnswers = store.get("nemo.speak", false) === true;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const voiceBtn = $("#voiceBtn"), speakBtn = $("#speakToggle");

if (SR) {
  try {
    recognition = new SR();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.addEventListener("start", () => {
      listening = true;
      voiceBtn.classList.add("recording", "active");
      voiceBtn.setAttribute("aria-pressed", "true");
      voiceBtn.setAttribute("aria-label", "Stop voice input");
    });
    const done = () => {
      listening = false;
      voiceBtn.classList.remove("recording", "active");
      voiceBtn.setAttribute("aria-pressed", "false");
      voiceBtn.setAttribute("aria-label", "Start voice input");
    };
    recognition.addEventListener("end", done);
    recognition.addEventListener("error", (e) => {
      done();
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        addMessage("Microphone access was blocked. Allow microphone permission in your browser's site settings to use voice input.", "nemo", { error: true, skipDiagramBtn: true });
      }
    });
    recognition.addEventListener("result", (e) => {
      const t = e.results[0] && e.results[0][0] ? e.results[0][0].transcript : "";
      if (t) {
        input.value = t;
        askNemo(t, { fromVoice: true });
      }
    });
  } catch (e) {
    console.warn("SpeechRecognition init error:", e);
  }
}

if (voiceBtn) {
  voiceBtn.addEventListener("click", () => {
    if (!recognition) {
      addMessage("Voice input isn't supported in this browser. Try Chrome, Edge, or use your keyboard's microphone.", "nemo", { error: true, skipDiagramBtn: true });
      return;
    }
    if (listening) {
      try { recognition.stop(); } catch (_) {}
      return;
    }
    NemoSpeechEngine.stop();
    try {
      recognition.start();
    } catch (_) {}
  });
}

function paintSpeak() {
  if (!speakBtn) return;
  speakBtn.innerHTML = `<span class="btn-icon">${speakAnswers ? "🔊" : "🔇"}</span>`;
  speakBtn.setAttribute("aria-pressed", String(speakAnswers));
  speakBtn.classList.toggle("active", speakAnswers);
  speakBtn.title = speakAnswers ? "Reading answers aloud with Gemini AI Voice (click to mute)" : "Read answers aloud (Gemini AI Voice)";
}
if (speakBtn) {
  speakBtn.addEventListener("click", () => {
    speakAnswers = !speakAnswers;
    store.set("nemo.speak", speakAnswers);
    paintSpeak();
    speakBtn.classList.add("toggle-animate");
    setTimeout(() => speakBtn.classList.remove("toggle-animate"), 600);
    if (!speakAnswers) {
      NemoSpeechEngine.stop();
    }
  });
  paintSpeak();
}

/* =========================================================================
   Nemo Voice Tips Feature
   Randomly triggered audio clips of chemistry mnemonics & encouraging tips
   played by the floating mascot at timed intervals (~75-105s).
   ========================================================================= */
const NEMO_VOICE_TIPS = [
  { cat: "Mnemonic", text: "OIL RIG: Oxidation Is Loss of electrons, and Reduction Is Gain! Keep this solid for every electrochemistry problem." },
  { cat: "Mnemonic", text: "LEO says GER: Lose Electrons Oxidation, Gain Electrons Reduction! A quick way to verify redox half-reactions." },
  { cat: "Mnemonic", text: "PANIC: Positive Anode, Negative Is Cathode in electrolytic cells. Remember in galvanic cells, signs reverse!" },
  { cat: "Core Rule", text: "Markovnikov's rule: The rich get richer! The hydrogen adds to the carbon with more hydrogens already attached." },
  { cat: "Core Rule", text: "Anti-Markovnikov peroxide effect only occurs with HBr! It fails with HCl and HI due to unfavourable step thermodynamics." },
  { cat: "Core Rule", text: "Saytzeff's rule: In elimination reactions, the more substituted and thermally stable alkene is the major product." },
  { cat: "Coordination", text: "Spectrochemical series shortcut: Halogens are weaker than Oxygen donors, which are weaker than Nitrogen donors, and Carbon donors are the strongest!" },
  { cat: "Coordination", text: "Jahn-Teller distortion: Degenerate electronic states split to lower overall energy! Especially watch for Copper two plus d9 complexes." },
  { cat: "Organic", text: "SN2 reactions proceed with one hundred percent Walden inversion via backside attack! Methyl is fastest, tertiary halides do not react." },
  { cat: "Organic", text: "SN1 reactions go through a planar carbocation intermediate! Always check for 1,2-hydride and 1,2-methyl shifts." },
  { cat: "Aromatic", text: "Hückel's Rule for aromaticity: A planar, cyclic, conjugated ring must have 4n plus 2 pi electrons!" },
  { cat: "Inorganic", text: "Inert pair effect: In heavier p-block elements like Thallium, Lead, and Bismuth, lower oxidation states are more stable due to inert outer s-electrons." },
  { cat: "Inorganic", text: "Lanthanoid contraction: Due to poor shielding by 4f electrons, Zirconium and Hafnium have nearly identical atomic and ionic radii!" },
  { cat: "Physical", text: "Arrhenius equation: Rate constant k equals A times e to the power minus E_a over R T. Higher activation energy means greater temperature sensitivity!" },
  { cat: "Physical", text: "Raoult's law: The partial vapour pressure of a volatile component equals its mole fraction times its pure vapour pressure." },
  { cat: "Physical", text: "Nernst equation at 298 Kelvin: Cell potential equals standard potential minus 0.0591 over n, times log of Q!" },
  { cat: "Physical", text: "Van 't Hoff factor i: Greater than one for electrolyte dissociation, less than one for association like benzoic acid in benzene." },
  { cat: "Structure", text: "Bohr orbital radius: Radius r_n equals 0.529 angstroms times n squared divided by atomic number Z!" },
  { cat: "Structure", text: "VSEPR tip: Lone pair lone pair repulsion is strongest, squeezing bond angles down to 104.5 degrees in water!" },
  { cat: "Structure", text: "Fajans' rules: Covalent character increases with smaller cations, larger anions, and pseudo-noble gas configurations." },
  { cat: "Organic", text: "Bredt's Rule: A double bond cannot exist at the bridgehead of a small bridged bicyclic system due to excessive ring strain!" },
  { cat: "Encouragement", text: "You're doing fantastic! Every difficult mechanism you solve today is a confident mark scored in your exam tomorrow." },
  { cat: "Encouragement", text: "Consistent daily problem solving builds the deep intuition of top rankers. Keep your momentum going!" },
  { cat: "Encouragement", text: "Mistakes in practice are just data points pointing you toward mastery. Review the rule, adjust, and conquer!" },
  { cat: "Founder Tribute", text: "J.Sanjay engineered Nemo so you can rotate 3D molecules, master tricky exceptions, and accelerate your chemistry mastery!" }
];

let voiceTipsEnabled = store.get("nemo.voice.tips.enabled", true) !== false;
let currentTipIndex = Math.floor(Math.random() * NEMO_VOICE_TIPS.length);
let queuedTipIndex = (currentTipIndex + 1 + Math.floor(Math.random() * (NEMO_VOICE_TIPS.length - 1))) % NEMO_VOICE_TIPS.length;
let voiceTipTimer = null;

function prewarmTipIndex(idx) {
  const safeIdx = ((idx % NEMO_VOICE_TIPS.length) + NEMO_VOICE_TIPS.length) % NEMO_VOICE_TIPS.length;
  const tip = NEMO_VOICE_TIPS[safeIdx];
  if (tip && typeof NemoSpeechEngine !== "undefined" && typeof NemoSpeechEngine.prewarm === "function") {
    NemoSpeechEngine.prewarm(tip.text);
  }
}
function prewarmCurrentSectionTip() {
  const sec = window.currentActiveSection || "chatPanel";
  const dict = window.NEMO_SECTION_EXPRESSIONS;
  if (dict && dict[sec] && dict[sec].tip && typeof NemoSpeechEngine !== "undefined" && typeof NemoSpeechEngine.prewarm === "function") {
    NemoSpeechEngine.prewarm(dict[sec].tip);
  }
}
window.__nemoScheduleWarmTips = () => {
  prewarmTipIndex(queuedTipIndex);
};
window.__nemoPrewarmOrbAudio = () => {
  warmNemoAudio();
  prewarmTipIndex(queuedTipIndex);
  prewarmCurrentSectionTip();
};

function paintVoiceTipsControls() {
  const toggleBtn = $("#voiceTipsToggle");
  const statusEl = $("#voiceTipTimerStatus");
  if (toggleBtn) {
    toggleBtn.classList.toggle("active", voiceTipsEnabled);
    toggleBtn.setAttribute("aria-pressed", String(voiceTipsEnabled));
    const txt = toggleBtn.querySelector(".vtip-pill-text");
    if (txt) txt.textContent = voiceTipsEnabled ? "ON" : "OFF";
  }
  if (statusEl) {
    statusEl.textContent = voiceTipsEnabled ? "Auto-plays mnemonics every ~90s" : "Voice tips paused";
  }
}

function clampOverlayInViewport(el, margin = 10) {
  if (!el || el.hidden) return;
  el.style.translate = "";
  const rect = el.getBoundingClientRect();
  if (!rect || (rect.width === 0 && rect.height === 0)) return;
  const vW = document.documentElement.clientWidth || window.innerWidth || 360;
  const vH = document.documentElement.clientHeight || window.innerHeight || 640;
  let dx = 0;
  let dy = 0;
  if (rect.left < margin) {
    dx = margin - rect.left;
  } else if (rect.right > vW - margin) {
    dx = (vW - margin) - rect.right;
    if (rect.left + dx < margin) dx = margin - rect.left;
  }
  if (rect.top < margin) {
    dy = margin - rect.top;
  } else if (rect.bottom > vH - margin) {
    dy = (vH - margin) - rect.bottom;
    if (rect.top + dy < margin) dy = margin - rect.top;
  }
  if (Math.abs(dx) >= 0.5 || Math.abs(dy) >= 0.5) {
    el.style.translate = `${Math.round(dx)}px ${Math.round(dy)}px`;
  }
}
window.clampOverlayInViewport = clampOverlayInViewport;
{
  const reClampOpenOverlays = () => {
    const popEl = $("#widgetPopover");
    const vbEl = $("#nemoVoiceBubble");
    if (popEl && !popEl.hidden) clampOverlayInViewport(popEl, 10);
    if (vbEl && !vbEl.hidden) clampOverlayInViewport(vbEl, 10);
  };
  window.addEventListener("resize", reClampOpenOverlays, { passive: true });
  window.addEventListener("orientationchange", () => setTimeout(reClampOpenOverlays, 120), { passive: true });
}

function playVoiceTip(tipIndex, isReplay = false, isAutoTimer = false) {
  if (tipIndex == null || tipIndex < 0 || tipIndex >= NEMO_VOICE_TIPS.length) {
    tipIndex = queuedTipIndex;
    queuedTipIndex = (tipIndex + 1 + Math.floor(Math.random() * (NEMO_VOICE_TIPS.length - 1))) % NEMO_VOICE_TIPS.length;
  }
  currentTipIndex = tipIndex;
  const tip = NEMO_VOICE_TIPS[tipIndex];

  // 1. Instant chime & display voice bubble synchronously before network/synthesis
  playNemoChime("tip");

  const bubble = $("#nemoVoiceBubble");
  const textEl = $("#nemoVoiceText");
  const catEl = $("#nvbCategory");
  if (bubble && textEl) {
    bubble.hidden = false;
    bubble.classList.add("active", "is-speaking");
    textEl.innerHTML = inlineMd(tip.text);
    if (catEl) catEl.textContent = tip.cat;
    clampOverlayInViewport(bubble, 10);
  }

  // 2. React immediately on mascot face (never suppress manual user voice tap behind stale state)
  if (typeof triggerNemoReaction === "function") {
    const orbEl = $("#widgetOrb") || $("#nemoOrb");
    if (!isAutoTimer || !orbEl || orbEl.getAttribute("data-expression") !== "thinking") {
      triggerNemoReaction({
        expression: "happy",
        icon: "🎙",
        text: tip.cat || "Voice Tip",
        badge: "Voice Tip",
        duration: 5000
      });
    }
  }

  // 3. Play speech immediately (instant cache hit if prewarmed!) & warm next tip
  const hasUserGesture = !isAutoTimer || !navigator.userActivation || navigator.userActivation.hasBeenActive;
  if (hasUserGesture) {
    NemoSpeechEngine.play(tip.text, {
      voiceBubble: bubble,
      allowGeminiTTS: !isAutoTimer || Boolean(navigator.userActivation && navigator.userActivation.hasBeenActive)
    });
  } else if (bubble) {
    bubble.classList.remove("is-speaking");
  }
  setTimeout(() => {
    prewarmTipIndex(queuedTipIndex);
    prewarmTipIndex((currentTipIndex + 1) % NEMO_VOICE_TIPS.length);
  }, 150);
}

function scheduleNextVoiceTip() {
  clearTimeout(voiceTipTimer);
  if (!voiceTipsEnabled) return;

  // Random interval between 75s and 105s (timed random intervals)
  const delay = Math.round(75000 + Math.random() * 30000);
  voiceTipTimer = setTimeout(() => {
    // Only speak if user is not currently voice-recording or typing actively
    if (voiceTipsEnabled && !listening && !busy) {
      playVoiceTip(null, false, true);
    }
    scheduleNextVoiceTip();
  }, delay);
}

// Wire up Voice Tip Bubble & Popover buttons (with instant prewarm on hover/focus)
const replayTipBtn = $("#replayVoiceTipBtn");
if (replayTipBtn) {
  replayTipBtn.addEventListener("pointerenter", () => prewarmTipIndex(currentTipIndex), { passive: true });
  replayTipBtn.addEventListener("click", () => {
    playVoiceTip(currentTipIndex, true);
  });
}

const nextTipBtn = $("#nextVoiceTipBtn");
if (nextTipBtn) {
  nextTipBtn.addEventListener("pointerenter", () => prewarmTipIndex((currentTipIndex + 1) % NEMO_VOICE_TIPS.length), { passive: true });
  nextTipBtn.addEventListener("click", () => {
    let nextIdx = (currentTipIndex + 1) % NEMO_VOICE_TIPS.length;
    playVoiceTip(nextIdx);
    scheduleNextVoiceTip();
  });
}

const closeVoiceBubbleBtn = $("#closeVoiceBubble");
if (closeVoiceBubbleBtn) {
  closeVoiceBubbleBtn.addEventListener("click", () => {
    const bubble = $("#nemoVoiceBubble");
    if (bubble) {
      bubble.hidden = true;
      bubble.classList.remove("is-speaking");
    }
    NemoSpeechEngine.stop();
  });
}

const voiceTipsToggle = $("#voiceTipsToggle");
if (voiceTipsToggle) {
  voiceTipsToggle.addEventListener("click", () => {
    voiceTipsEnabled = !voiceTipsEnabled;
    store.set("nemo.voice.tips.enabled", voiceTipsEnabled);
    paintVoiceTipsControls();
    voiceTipsToggle.classList.add("toggle-animate");
    setTimeout(() => voiceTipsToggle.classList.remove("toggle-animate"), 600);
    if (voiceTipsEnabled) {
      scheduleNextVoiceTip();
      playVoiceTip();
    } else {
      clearTimeout(voiceTipTimer);
      NemoSpeechEngine.stop();
      const bubble = $("#nemoVoiceBubble");
      if (bubble) {
        bubble.hidden = true;
        bubble.classList.remove("is-speaking");
      }
    }
  });
}

const playRandomTipBtn = $("#playRandomTipBtn");
if (playRandomTipBtn) {
  playRandomTipBtn.addEventListener("pointerenter", () => {
    warmNemoAudio();
    prewarmTipIndex(queuedTipIndex);
  }, { passive: true });
  playRandomTipBtn.addEventListener("focus", () => prewarmTipIndex(queuedTipIndex), { passive: true });
  playRandomTipBtn.addEventListener("click", () => {
    const pop = $("#widgetPopover");
    if (pop) pop.hidden = true;
    playVoiceTip(null);
    scheduleNextVoiceTip();
  });
}

paintVoiceTipsControls();
scheduleNextVoiceTip();

/* ============================== reaction canvas ============================== */
(function reactionCanvas() {
  const canvas = $("#reactionCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const BG = "#08142a";
  let strokes = store.get("nemo.sketch.v1", []);
  if (!Array.isArray(strokes)) strokes = [];
  let cleared = null, current = null, tool = "pen", cssW = 0, cssH = 0, saveTimer = 0;

  function drawArrow(s) {
    const [a, b] = s.pts; const ang = Math.atan2(b.y - a.y, b.x - a.x), h = 9 + s.w * 2.2;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - h * Math.cos(ang - .42), b.y - h * Math.sin(ang - .42));
    ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - h * Math.cos(ang + .42), b.y - h * Math.sin(ang + .42));
    ctx.stroke();
  }
  function drawStroke(s) {
    ctx.strokeStyle = s.tool === "eraser" ? BG : s.color; ctx.lineWidth = s.tool === "eraser" ? s.w * 4 : s.w;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (s.tool === "arrow") { drawArrow(s); return; }
    ctx.beginPath(); ctx.moveTo(s.pts[0].x, s.pts[0].y);
    if (s.pts.length === 1) ctx.lineTo(s.pts[0].x + 0.01, s.pts[0].y);
    for (let i = 1; i < s.pts.length; i++) ctx.lineTo(s.pts[i].x, s.pts[i].y);
    ctx.stroke();
  }
  function redraw() {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, cssW, cssH);
    for (const s of strokes) drawStroke(s);
    if (current) drawStroke(current);
  }
  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { const json = JSON.stringify(strokes); if (json.length < 400000) store.set("nemo.sketch.v1", strokes); else store.del("nemo.sketch.v1"); }, 400);
  }
  function resize() {
    const r = canvas.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!r.width || !r.height) return;
    if (Math.abs(r.width - cssW) < 0.5 && Math.abs(r.height - cssH) < 0.5) return;
    cssW = r.width; cssH = r.height;
    canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); redraw(); // strokes are stored in CSS px, so nothing gets stretched
  }
  new ResizeObserver(resize).observe(canvas); resize();
  window.addEventListener("nemo:display-adapt", resize);

  const pos = (e) => { const r = canvas.getBoundingClientRect(); return { x: Math.round((e.clientX - r.left) * 10) / 10, y: Math.round((e.clientY - r.top) * 10) / 10 }; };
  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault(); canvas.setPointerCapture(e.pointerId);
    const inkWEl = $("#inkWidth");
    const inkColEl = $("#inkColor");
    const p = pos(e), w = inkWEl ? (+inkWEl.value || 3) : 3;
    current = { tool, color: inkColEl ? inkColEl.value : "#42e9ff", w, pts: tool === "arrow" ? [p, p] : [p] };
    redraw();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!current) return;
    const p = pos(e);
    if (current.tool === "arrow") { current.pts[1] = p; redraw(); return; }
    const last = current.pts[current.pts.length - 1];
    if (Math.hypot(p.x - last.x, p.y - last.y) < 0.8) return;
    current.pts.push(p);
    ctx.strokeStyle = current.tool === "eraser" ? BG : current.color; ctx.lineWidth = current.tool === "eraser" ? current.w * 4 : current.w;
    ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
  });
  const finish = (e) => {
    if (!current) return;
    const s = current; current = null;
    if (s.tool === "arrow" && Math.hypot(s.pts[1].x - s.pts[0].x, s.pts[1].y - s.pts[0].y) < 6) { redraw(); return; }
    strokes.push(s); cleared = null; redraw(); persist();
    if (typeof triggerNemoReaction === "function" && strokes.length % 2 === 1) {
      triggerNemoReaction({
        expression: "artistic",
        icon: "✎",
        text: s.tool === "arrow" ? "Reaction arrow drawn! 🧪" : "Sketching reaction pathway! 🎨",
        badge: "Artist",
        duration: 2400
      });
    }
  };
  canvas.addEventListener("pointerup", finish);
  canvas.addEventListener("pointercancel", () => { current = null; redraw(); });

  function setTool(t) {
    tool = t;
    for (const [id, name] of [["#toolPen", "pen"], ["#toolArrow", "arrow"], ["#toolEraser", "eraser"]]) {
      const b = $(id); if (b) { b.classList.toggle("active", name === t); b.setAttribute("aria-pressed", String(name === t)); }
    }
    if (canvas) canvas.style.cursor = t === "eraser" ? "cell" : "crosshair";
  }
  safeOn("#toolPen", "click", () => setTool("pen"));
  safeOn("#toolArrow", "click", () => setTool("arrow"));
  safeOn("#toolEraser", "click", () => setTool("eraser"));
  safeOn("#undoStroke", "click", () => {
    if (strokes.length) strokes.pop(); else if (cleared) { strokes = cleared; cleared = null; }
    redraw(); persist();
  });
  safeOn("#clearCanvas", "click", () => { if (!strokes.length) return; cleared = strokes; strokes = []; redraw(); persist(); });
  safeOn("#saveCanvas", "click", () => {
    if (!canvas) return;
    const a = document.createElement("a"); a.download = "nemo-reaction-sketch.png"; a.href = canvas.toDataURL("image/png"); document.body.append(a); a.click(); a.remove();
  });
})();

/* ============================== study table canvas (structured Markdown tables + study tools) ============================== */
(function studyTableCanvas() {
  const sketchBtn = $("#canvasSketchModeBtn");
  const tableBtn = $("#canvasTableModeBtn");
  const sketchView = $("#canvasSketchView");
  const tableView = $("#canvasTableView");
  const tabsEl = $("#tcTableTabs");
  const searchEl = $("#tcSearch");
  const densityBtn = $("#tcDensityBtn");
  const maskBtn = $("#tcMaskBtn");
  const copyMdBtn = $("#tcCopyMdBtn");
  const downloadCsvBtn = $("#tcDownloadCsvBtn");
  const emptyEl = $("#tcEmpty");
  const boardEl = $("#tcBoard");
  const captionEl = $("#tcCaption");
  const metaEl = $("#tcMeta");
  const maskHintEl = $("#tcMaskHint");
  const tableEl = $("#tcTable");
  const notesEl = $("#tcNotes");

  if (!sketchBtn || !tableBtn || !sketchView || !tableView) return;

  const isSepLine = (l) => /^\s*\|?(?:\s*:?-{2,}:?\s*\|)+\s*:?-{2,}:?\s*\|?\s*$/.test(l) || (/^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(l) && l.includes("-"));
  const isRowLine = (l) => /^\s*\|.*\|\s*$/.test(l);

  function splitMdRow(line) {
    let s = String(line || "").trim();
    if (s.startsWith("|")) s = s.slice(1);
    if (s.endsWith("|") && !s.endsWith("\\|")) s = s.slice(0, -1);
    const cells = [];
    let cur = "";
    let inMath = false;
    for (let k = 0; k < s.length; k++) {
      const ch = s[k];
      if (ch === "\\" && s[k + 1] === "|") {
        cur += "|";
        k++;
        continue;
      }
      if (ch === "$" && s[k - 1] !== "\\") {
        inMath = !inMath;
      }
      if (ch === "|" && !inMath) {
        cells.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    cells.push(cur.trim());
    return cells;
  }

  function isNumericCellText(val) {
    const clean = String(val || "").replace(/\$|\*\*|\*/g, "").trim();
    if (!clean) return false;
    return /^[~≈+\-\u2212]?\d+(?:\.\d+)?(?:\s*(?:%|°|°C|K|eV|pm|Å|nm|kJ\/mol|kJ|g\/mol))?$/i.test(clean);
  }

  function cleanTitleText(raw) {
    return String(raw || "")
      .replace(/^#{1,6}\s+/, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .replace(/:\s*$/, "")
      .trim();
  }

  function buildCanonicalMd(headers, rows) {
    const safeCell = (c) => String(c || "").replace(/\|/g, "\\|").replace(/\r?\n+/g, " ");
    const lines = [
      "| " + headers.map(safeCell).join(" | ") + " |",
      "| " + headers.map(() => "---").join(" | ") + " |"
    ];
    for (const r of rows) {
      lines.push("| " + r.map(safeCell).join(" | ") + " |");
    }
    return lines.join("\n");
  }

  function cellMdToPlainCsv(md) {
    return String(md || "")
      .replace(/\\xrightarrow\s*\{([^}]*)\}/g, "-> [$1] ->")
      .replace(/\\xrightarrow/g, "->")
      .replace(/\\rightarrow|\\to/g, "->")
      .replace(/\\leftrightarrow|\\rightleftharpoons/g, "<->")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\text\s*\{([^}]*)\}/g, "$1")
      .replace(/\\mathrm\s*\{([^}]*)\}/g, "$1")
      .replace(/\\chi/g, "χ")
      .replace(/\\circ/g, "°")
      .replace(/\$\$/g, "")
      .replace(/\$/g, "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/\{|\}/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function extractMarkdownTables(md) {
    try {
      if (!md || typeof md !== "string") return { tables: [], notesMd: "" };
      const lines = String(md).replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
      const tables = [];
      let inFence = false;
      let lastTableEnd = -1;
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];
        if (/^\s*```/.test(line)) {
          inFence = !inFence;
          i++;
          continue;
        }
        if (inFence) {
          i++;
          continue;
        }
        if (isRowLine(line) && i + 1 < lines.length && isSepLine(lines[i + 1])) {
          let title = "";
          for (let back = i - 1; back >= Math.max(0, i - 6); back--) {
            const candidate = lines[back].trim();
            if (!candidate) continue;
            if (isRowLine(candidate) || isSepLine(candidate) || /^---+$/.test(candidate)) break;
            if (/^#{1,4}\s+/.test(candidate)) {
              title = cleanTitleText(candidate);
              break;
            }
            if ((/^\*\*[^*]+\*\*:?$/.test(candidate) || candidate.length <= 80) && !/[.!?]$/.test(candidate)) {
              title = cleanTitleText(candidate);
              break;
            }
          }

          const headers = splitMdRow(line);
          const sepCells = splitMdRow(lines[i + 1]);
          i += 2;
          const rawRows = [];
          while (i < lines.length && isRowLine(lines[i])) {
            rawRows.push(splitMdRow(lines[i++]));
          }
          lastTableEnd = i;
          const colCount = Math.max(1, headers.length);
          const rows = rawRows.map((r) => {
            const padded = r.slice(0, colCount);
            while (padded.length < colCount) padded.push("");
            return padded;
          });
          const numCols = headers.map((_, cIdx) => {
            const sep = (sepCells[cIdx] || "").trim();
            if (!sep.startsWith(":") && sep.endsWith(":")) return true;
            const nonEmpty = rows.map((r) => r[cIdx]).filter((v) => v && v.trim() && v.trim() !== "—");
            if (!nonEmpty.length) return false;
            return nonEmpty.filter(isNumericCellText).length / nonEmpty.length >= 0.7;
          });
          tables.push({
            title: title || `Chemistry Reference Table ${tables.length + 1}`,
            headers,
            rows,
            numCols,
            rawMd: buildCanonicalMd(headers, rows)
          });
          continue;
        }
        i++;
      }

      const trailingLines = lastTableEnd >= 0 ? lines.slice(lastTableEnd).join("\n").trim() : "";
      return { tables, notesMd: trailingLines };
    } catch (_) {
      return { tables: [], notesMd: "" };
    }
  }

  let state = {
    mode: "sketch",
    tables: [],
    notesMd: "",
    activeIdx: 0,
    query: "",
    compact: false,
    masked: false
  };

  function setCanvasMode(mode) {
    const isTable = mode === "table";
    state.mode = isTable ? "table" : "sketch";
    sketchBtn.classList.toggle("active", !isTable);
    sketchBtn.setAttribute("aria-pressed", String(!isTable));
    tableBtn.classList.toggle("active", isTable);
    tableBtn.setAttribute("aria-pressed", String(isTable));
    sketchView.hidden = isTable;
    tableView.hidden = !isTable;
    if (!isTable) {
      try { window.dispatchEvent(new Event("nemo:display-adapt")); } catch (_) {}
    }
  }

  function updateTabBadge() {
    tableBtn.textContent = state.tables.length ? `⊞ Table Canvas (${state.tables.length})` : "⊞ Table Canvas";
  }

  function renderTableBoard() {
    try {
      const hasTables = state.tables.length > 0;
      if (emptyEl) emptyEl.hidden = hasTables;
      if (boardEl) boardEl.hidden = !hasTables;
      if (tabsEl) {
        tabsEl.hidden = state.tables.length <= 1;
        tabsEl.innerHTML = "";
        if (state.tables.length > 1) {
          state.tables.forEach((tbl, idx) => {
            const b = el("button", {
              type: "button",
              class: "tc-tab-btn" + (idx === state.activeIdx ? " active" : ""),
              text: `${idx + 1}. ${tbl.title}`,
              title: tbl.title
            });
            b.addEventListener("click", () => {
              state.activeIdx = idx;
              renderTableBoard();
            });
            tabsEl.append(b);
          });
        }
      }

      if (!hasTables) {
        if (copyMdBtn) copyMdBtn.disabled = true;
        if (downloadCsvBtn) downloadCsvBtn.disabled = true;
        return;
      }

      if (copyMdBtn) copyMdBtn.disabled = false;
      if (downloadCsvBtn) downloadCsvBtn.disabled = false;

      if (state.activeIdx >= state.tables.length || state.activeIdx < 0) state.activeIdx = 0;
      const tbl = state.tables[state.activeIdx];
      const q = state.query.trim().toLowerCase();
      const filteredRows = q
        ? tbl.rows.filter((r) => r.some((cell) => cellMdToPlainCsv(cell).toLowerCase().includes(q)))
        : tbl.rows;

      if (captionEl) captionEl.textContent = tbl.title;
      if (metaEl) metaEl.textContent = `Showing ${filteredRows.length} of ${tbl.rows.length} rows · ${tbl.headers.length} columns`;
      if (maskHintEl) maskHintEl.hidden = !state.masked;

      tableEl.className = "tc-table" + (state.compact ? " is-compact" : "");
      const maskColIdx = Math.max(0, tbl.headers.length - 1);

      const thead = el("thead");
      const headTr = el("tr");
      tbl.headers.forEach((h, cIdx) => {
        const th = el("th");
        if (tbl.numCols[cIdx]) th.className = "num-col";
        th.innerHTML = mdInlineToHtml(h);
        headTr.append(th);
      });
      thead.append(headTr);

      const tbody = el("tbody");
      if (!filteredRows.length) {
        const tr = el("tr");
        const td = el("td", { colSpan: String(tbl.headers.length), class: "tc-no-match", text: `No rows matching "${state.query.trim()}"` });
        tr.append(td);
        tbody.append(tr);
      } else {
        filteredRows.forEach((row) => {
          const tr = el("tr");
          row.forEach((cell, cIdx) => {
            const td = el("td");
            if (tbl.numCols[cIdx]) td.classList.add("num-col");
            const innerHtml = mdInlineToHtml(cell);
            if (state.masked && cIdx === maskColIdx && tbl.headers.length > 1) {
              td.classList.add("tc-masked");
              td.setAttribute("tabindex", "0");
              td.setAttribute("role", "button");
              td.setAttribute("aria-label", "Reveal hidden cell value");
              td.innerHTML = `<div class="tc-cell-inner">${innerHtml}</div>`;
            } else {
              td.innerHTML = innerHtml;
            }
            tr.append(td);
          });
          tbody.append(tr);
        });
      }

      tableEl.innerHTML = "";
      tableEl.append(thead, tbody);

      if (notesEl) {
        if (state.notesMd) {
          notesEl.hidden = false;
          notesEl.innerHTML = mdToHtml(state.notesMd);
        } else {
          notesEl.hidden = true;
          notesEl.innerHTML = "";
        }
      }
    } catch (_) {}
  }

  function syncTableCanvasFromMarkdown(md, opts = {}) {
    try {
      const parsed = extractMarkdownTables(md);
      if (!parsed.tables.length) return false;
      state.tables = parsed.tables;
      state.notesMd = parsed.notesMd || "";
      state.activeIdx = typeof opts.activeIdx === "number" ? Math.max(0, Math.min(opts.activeIdx, parsed.tables.length - 1)) : 0;
      state.query = "";
      if (searchEl) searchEl.value = "";
      updateTabBadge();
      renderTableBoard();
      if (opts.autoSwitch) {
        setCanvasMode("table");
      }
      if (opts.scrollIntoView) {
        if (typeof window.ensurePanelVisible === "function") window.ensurePanelVisible("canvasPanel");
        const panel = $("#canvasPanel");
        if (panel && panel.scrollIntoView) {
          panel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  sketchBtn.addEventListener("click", () => setCanvasMode("sketch"));
  tableBtn.addEventListener("click", () => setCanvasMode("table"));

  if (searchEl) {
    searchEl.addEventListener("input", () => {
      state.query = searchEl.value || "";
      renderTableBoard();
    });
  }

  if (densityBtn) {
    densityBtn.addEventListener("click", () => {
      state.compact = !state.compact;
      densityBtn.setAttribute("aria-pressed", String(state.compact));
      renderTableBoard();
    });
  }

  if (maskBtn) {
    maskBtn.addEventListener("click", () => {
      state.masked = !state.masked;
      maskBtn.setAttribute("aria-pressed", String(state.masked));
      renderTableBoard();
    });
  }

  if (tableEl) {
    tableEl.addEventListener("click", (e) => {
      const td = e.target.closest("td.tc-masked");
      if (td) td.classList.toggle("tc-revealed");
    });
    tableEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const td = e.target.closest("td.tc-masked");
        if (td) {
          e.preventDefault();
          td.classList.toggle("tc-revealed");
        }
      }
    });
  }

  if (copyMdBtn) {
    copyMdBtn.addEventListener("click", () => {
      const tbl = state.tables[state.activeIdx];
      if (!tbl) return;
      copyTextSafe(tbl.rawMd, copyMdBtn, "✓ Copied MD", "Copy MD");
    });
  }

  if (downloadCsvBtn) {
    downloadCsvBtn.addEventListener("click", () => {
      try {
        const tbl = state.tables[state.activeIdx];
        if (!tbl) return;
        const q = state.query.trim().toLowerCase();
        const rows = q
          ? tbl.rows.filter((r) => r.some((c) => cellMdToPlainCsv(c).toLowerCase().includes(q)))
          : tbl.rows;
        const csvCell = (val) => '"' + cellMdToPlainCsv(val).replace(/"/g, '""') + '"';
        const csvLines = [
          tbl.headers.map(csvCell).join(","),
          ...rows.map((r) => r.map(csvCell).join(","))
        ];
        const blob = new Blob([csvLines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const slug = tbl.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "nemo-chemistry-table";
        a.href = url;
        a.download = `${slug}.csv`;
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (_) {}
    });
  }

  $$("[data-tc-prompt]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prompt = btn.dataset.tcPrompt;
      if (!prompt) return;
      if (typeof window.ensurePanelVisible === "function") window.ensurePanelVisible("chatPanel");
      askNemo(prompt);
    });
  });

  window.extractMarkdownTables = extractMarkdownTables;
  window.syncTableCanvasFromMarkdown = syncTableCanvasFromMarkdown;
  updateTabBadge();
  renderTableBoard();
})();

/* ============================== 3D molecule viewer (self-contained, no WebGL or CDN needed) ============================== */
const ELEMENTS = {
  H: { c: "#f2f5ff", v: 1.20, n: "Hydrogen" }, C: { c: "#8c97ad", v: 1.70, n: "Carbon" }, N: { c: "#4f7bff", v: 1.55, n: "Nitrogen" },
  O: { c: "#ff4d55", v: 1.52, n: "Oxygen" }, F: { c: "#8fe05a", v: 1.47, n: "Fluorine" }, B: { c: "#ffb38a", v: 1.92, n: "Boron" },
  P: { c: "#ff9a2e", v: 1.80, n: "Phosphorus" }, S: { c: "#f5e04a", v: 1.80, n: "Sulfur" }, Cl: { c: "#2fe06a", v: 1.75, n: "Chlorine" },
  Xe: { c: "#48b4d0", v: 2.16, n: "Xenon" }, Br: { c: "#b5523b", v: 1.85, n: "Bromine" }, I: { c: "#a54fc4", v: 1.98, n: "Iodine" },
  Na: { c: "#ab5cf2", v: 2.27, n: "Sodium" }, K: { c: "#8f40d4", v: 2.75, n: "Potassium" }, Si: { c: "#f0c8a0", v: 2.10, n: "Silicon" },
  Li: { c: "#cc80ff", v: 1.82, n: "Lithium" }, Mg: { c: "#8aff00", v: 1.73, n: "Magnesium" }, Ca: { c: "#3dff00", v: 2.31, n: "Calcium" },
  Al: { c: "#bfa6a6", v: 1.84, n: "Aluminium" }, Fe: { c: "#e06633", v: 2.0, n: "Iron" }, Cu: { c: "#c88033", v: 1.9, n: "Copper" }, Zn: { c: "#7d80b0", v: 1.9, n: "Zinc" },
  Be: { c: "#c2ff00", v: 1.53, n: "Beryllium" }, Ni: { c: "#50d050", v: 1.97, n: "Nickel" },
  Cs: { c: "#57178f", v: 3.43, n: "Caesium" }, Co: { c: "#f090a0", v: 1.95, n: "Cobalt" }, Pt: { c: "#d0d0e0", v: 2.1, n: "Platinum" },
  Ag: { c: "#c0c0c0", v: 2.0, n: "Silver" }, Cr: { c: "#8a99c7", v: 1.95, n: "Chromium" }, Mn: { c: "#9c7ac7", v: 1.95, n: "Manganese" },
  Se: { c: "#ffa100", v: 1.9, n: "Selenium" }, As: { c: "#bd80e3", v: 1.85, n: "Arsenic" }
};
const elInfo = (s) => ELEMENTS[s] || { c: "#b0b6c4", v: 1.8, n: s };
/* a molecule record may carry "vdw": {Na: 1.0, Cl: 1.8} to size ions sensibly (used by the unit-cell entries) */
const atomInfo = (m, s) => { const b = elInfo(s); return m && m.vdw && m.vdw[s] ? Object.assign({}, b, { v: m.vdw[s] }) : b; };
const SUB = "₀₁₂₃₄₅₆₇₈₉";
const subscripts = (n) => String(n).replace(/\d/g, (d) => SUB[+d]);

const mat = {
  mul: (A, B) => { const R = new Array(9); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) R[i * 3 + j] = A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]; return R; },
  rotX: (a) => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, -s, 0, s, c]; },
  rotY: (a) => { const c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 1, 0, -s, 0, c]; },
  apply: (R, x, y, z) => [R[0] * x + R[1] * y + R[2] * z, R[3] * x + R[4] * y + R[5] * z, R[6] * x + R[7] * y + R[8] * z]
};
function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function shade(hex, amt) {
  const [r, g, b] = hexRgb(hex), t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  return `rgb(${Math.round(r + (t - r) * p)},${Math.round(g + (t - g) * p)},${Math.round(b + (t - b) * p)})`;
}
const luminance = (hex) => { const [r, g, b] = hexRgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };

/* Parse a V2000 SDF file (PubChem) into the same shape as the built-in molecules. */
function parseSDF(text) {
  const lines = text.replace(/\r/g, "").split("\n");
  const counts = lines[3] || "";
  if (/V3000/.test(counts)) throw new Error("Unsupported SDF format");
  const na = parseInt(counts.substr(0, 3), 10), nb = parseInt(counts.substr(3, 3), 10);
  if (!(na > 0) || na > 400) throw new Error(na > 400 ? "Molecule is too large to display" : "Could not read structure");
  const atoms = [], bonds = [];
  for (let i = 0; i < na; i++) {
    const l = lines[4 + i] || "";
    atoms.push([l.substr(31, 3).trim() || "C", parseFloat(l.substr(0, 10)), parseFloat(l.substr(10, 10)), parseFloat(l.substr(20, 10))]);
  }
  for (let i = 0; i < nb; i++) {
    const l = lines[4 + na + i] || ""; const o = parseInt(l.substr(6, 3), 10);
    bonds.push([parseInt(l.substr(0, 3), 10) - 1, parseInt(l.substr(3, 3), 10) - 1, o === 4 ? 1.5 : clamp(o || 1, 1, 3)]);
  }
  if (atoms.some((a) => !isFinite(a[1] + a[2] + a[3]))) throw new Error("Could not read coordinates");
  const c = [0, 0, 0]; atoms.forEach((a) => { c[0] += a[1]; c[1] += a[2]; c[2] += a[3]; });
  atoms.forEach((a) => { a[1] -= c[0] / na; a[2] -= c[1] / na; a[3] -= c[2] / na; });
  return { atoms, bonds, lonePairs: [] };
}
function hillFormula(atoms) {
  const cnt = {}; atoms.forEach((a) => { cnt[a[0]] = (cnt[a[0]] || 0) + 1; });
  const keys = Object.keys(cnt).sort((a, b) => a.localeCompare(b));
  const ordered = cnt.C ? ["C", ...(cnt.H ? ["H"] : []), ...keys.filter((k) => k !== "C" && k !== "H")] : keys;
  return ordered.map((k) => k + (cnt[k] > 1 ? subscripts(cnt[k]) : "")).join("");
}

(function moleculeViewer() {
  const host = $("#moleculeViewer"), canvas = $("#molCanvas");
  if (!host || !canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const select = $("#moleculeSelect"), hint = $("#viewerHint");
  const custom = new Map(); // PubChem results, keyed by option value
  let mol = null, R = mat.mul(mat.rotX(-0.45), mat.rotY(0.6)), zoom = 1, extent = 2, W = 0, H = 0, dpr = 1;
  let raf = 0, visible = true, dragging = false;
  const pointers = new Map(); let pinch = 0;
  const opt = { style: "ball", spin: !reduceMotion, labels: false, lp: true };
  const spinEl = $("#molSpin");
  if (spinEl) spinEl.checked = opt.spin;

  /* ---- populate dropdown ---- */
  const customGroup = el("optgroup", { label: "PubChem results", hidden: true });
  const searchText = (m) => fold([m.name, m.formula, m.id, m.group, m.shape, m.electron, m.hyb].join(" ")).replace(/[₀-₉]/g, (d) => "₀₁₂₃₄₅₆₇₈₉".indexOf(d)).replace(/[⁺⁻]/g, "");
  /* the dropdown is rebuilt (not hidden option by option, which mobile browsers ignore) every time the filter changes */
  function buildList(q) {
    if (!select) return 0;
    const terms = fold(q || "").replace(/[₀-₉]/g, (d) => "₀₁₂₃₄₅₆₇₈₉".indexOf(d)).split(/\s+/).filter(Boolean), keep = select.value, groups = {}; let n = 0;
    select.innerHTML = "";
    MOLS.forEach((m) => {
      if (terms.length && !terms.every((t) => searchText(m).includes(t))) return;
      n++; (groups[m.group] = groups[m.group] || el("optgroup", { label: m.group })).append(el("option", { value: m.id, text: `${m.name} (${m.formula})` }));
    });
    Object.values(groups).forEach((g) => select.append(g));
    if (n === 0) {
      const emptyOpt = el("option", { value: "", text: "No matching molecules" });
      emptyOpt.disabled = true;
      emptyOpt.selected = true;
      select.append(emptyOpt);
    }
    select.append(customGroup);
    const countEl = $("#molCount");
    if (countEl) countEl.textContent = terms.length ? `${n} of ${MOLS.length}` : `${MOLS.length} molecules`;
    if (n > 0 && [...select.options].some((o) => o.value === keep)) select.value = keep;
    return n;
  }
  buildList("");
  safeOn("#molFilter", "input", (e) => {
    const n = buildList(e.target.value);
    if (n && select && select.value !== (mol && mol.id)) selectBuiltIn(select.value);
  });

  function computeExtent() {
    let e = 1;
    for (const a of mol.atoms) { const r = Math.hypot(a[1], a[2], a[3]); e = Math.max(e, r + (opt.style === "space" ? atomInfo(mol, a[0]).v * 0.9 : atomInfo(mol, a[0]).v * 0.3)); }
    for (const lp of mol.lonePairs || []) { const a = mol.atoms[lp.atom]; e = Math.max(e, Math.hypot(a[1] + lp.dir[0] * 0.9, a[2] + lp.dir[1] * 0.9, a[3] + lp.dir[2] * 0.9) + 0.5); }
    extent = e;
  }
  function sizeCanvas() {
    const r = host.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height; if (!W || !H) return;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); schedule();
  }
  new ResizeObserver(sizeCanvas).observe(host);
  window.addEventListener("nemo:display-adapt", sizeCanvas);

  /* ---- drawing ---- */
  function draw() {
    if (!mol || !W) return;
    ctx.clearRect(0, 0, W, H);
    const camD = extent * 3.4 + 3, fMax = camD / (camD - extent);
    const scale = (Math.min(W, H) / 2 * 1.0) / (extent * fMax) * zoom, cx = W / 2, cy = H / 2;
    const P = mol.atoms.map((a) => { const [x, y, z] = mat.apply(R, a[1], a[2], a[3]); const f = camD / (camD - z); return { x: cx + x * scale * f, y: cy - y * scale * f, z, f, el: a[0], info: atomInfo(mol, a[0]) }; });
    const items = [];
    const ballR = (p) => (opt.style === "space" ? p.info.v * 0.88 : opt.style === "stick" ? 0.14 : p.info.v * 0.27) * scale * p.f;
    const bondW = opt.style === "stick" ? 0.30 : 0.13;

    if (opt.style !== "space") {
      for (const [i, j, order] of mol.bonds) {
        const a = P[i], b = P[j]; if (!a || !b) continue;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, mz = (a.z + b.z) / 2;
        const w = bondW * scale * (a.f + b.f) / 2;
        items.push({ z: (a.z + mz) / 2, d: () => bondHalf(a, a.x, a.y, mx, my, w, order, a.info.c) });
        items.push({ z: (b.z + mz) / 2, d: () => bondHalf(b, b.x, b.y, mx, my, w, order, b.info.c) });
      }
    }
    P.forEach((p) => {
      const r = ballR(p);
      if (opt.style === "stick" && !opt.labels) { items.push({ z: p.z + 0.001, d: () => sphere(p.x, p.y, Math.max(r, 2), p.info.c) }); return; }
      items.push({ z: p.z + 0.001, d: () => { sphere(p.x, p.y, r, p.info.c); if (opt.labels) label(p, r); } });
    });
    if (opt.lp && opt.style !== "space") {
      for (const lp of mol.lonePairs || []) {
        const base = P[lp.atom]; if (!base) continue;
        const a = mol.atoms[lp.atom]; const L = 0.85;
        const [x, y, z] = mat.apply(R, a[1] + lp.dir[0] * L, a[2] + lp.dir[1] * L, a[3] + lp.dir[2] * L);
        const f = camD / (camD - z), px = cx + x * scale * f, py = cy - y * scale * f, r = 0.36 * scale * f;
        items.push({ z, d: () => lobe(px, py, r) });
      }
    }
    items.sort((p, q) => p.z - q.z);
    for (const it of items) it.d();
  }
  function sphere(x, y, r, color) {
    if (r < 0.5) return;
    const g = ctx.createRadialGradient(x - r * 0.36, y - r * 0.4, r * 0.08, x, y, r);
    g.addColorStop(0, shade(color, 0.6)); g.addColorStop(0.45, color); g.addColorStop(1, shade(color, -0.6));
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = g; ctx.fill();
  }
  function label(p, r) {
    const size = clamp(r * 0.95, 9, 22); ctx.font = `700 ${size}px Inter, system-ui, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = luminance(p.info.c) > 0.6 ? "#0a1426" : "#ffffff"; ctx.fillText(p.el, p.x, p.y + 0.5);
  }
  function lobe(x, y, r) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(214,170,255,.8)"); g.addColorStop(0.6, "rgba(166,107,255,.38)"); g.addColorStop(1, "rgba(166,107,255,0)");
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = g; ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.9)"; const d = r * 0.18; ctx.beginPath(); ctx.arc(x - d * 1.4, y, d, 0, TAU); ctx.arc(x + d * 1.4, y, d, 0, TAU); ctx.fill();
  }
  function bondHalf(p, x1, y1, x2, y2, w, order, color) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy); if (len < 0.5) return;
    const nx = -dy / len, ny = dx / len;
    const lines = order === 0.5 ? [[0, 0.6, 0.5]] : order === 3 ? [[-1.15, 1, 1], [0, 1, 1], [1.15, 1, 1]] : order === 2 ? [[-0.62, 1, 1], [0.62, 1, 1]] : order === 1.5 ? [[-0.55, 1, 1], [0.7, 0.55, 0.5]] : [[0, 1, 1]];
    const lw = order === 1 ? w : order === 0.5 ? w * 0.4 : w * (order === 3 ? 0.55 : 0.68);
    ctx.lineCap = "round";
    for (const [off, alpha, dash] of lines) {
      const ox = nx * off * w, oy = ny * off * w;
      ctx.setLineDash(dash < 1 ? [lw * 1.6, lw * 1.2] : []);
      ctx.strokeStyle = "rgba(0,0,0,.45)"; ctx.lineWidth = lw + 2; ctx.beginPath(); ctx.moveTo(x1 + ox, y1 + oy); ctx.lineTo(x2 + ox, y2 + oy); ctx.stroke();
      ctx.globalAlpha = alpha; ctx.strokeStyle = shade(color, 0.05); ctx.lineWidth = lw;
      ctx.beginPath(); ctx.moveTo(x1 + ox, y1 + oy); ctx.lineTo(x2 + ox, y2 + oy); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = Math.max(1, lw * 0.28);
      ctx.beginPath(); ctx.moveTo(x1 + ox - nx * lw * 0.2, y1 + oy - ny * lw * 0.2); ctx.lineTo(x2 + ox - nx * lw * 0.2, y2 + oy - ny * lw * 0.2); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.setLineDash([]);
  }

  /* ---- animation scheduling: only draws while visible and when something changes ---- */
  function frame() {
    raf = 0; if (!visible || document.hidden) return;
    const spinning = opt.spin && !dragging;
    if (spinning) R = mat.mul(mat.rotY(0.009), R);
    draw(); if (spinning) schedule();
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(frame); }
  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; if (visible) schedule(); }, { threshold: 0.05 }).observe(host);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) schedule(); });

  /* ---- interaction ---- */
  canvas.addEventListener("pointerdown", (e) => { canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); dragging = true; if (pointers.size === 2) pinch = pinchDist(); });
  canvas.addEventListener("pointermove", (e) => {
    const p = pointers.get(e.pointerId); if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
    if (pointers.size === 1) { R = mat.mul(mat.rotX(dy * 0.012), mat.mul(mat.rotY(dx * 0.012), R)); }
    else if (pointers.size === 2) { const d = pinchDist(); if (pinch) zoom = clamp(zoom * d / pinch, 0.4, 4); pinch = d; }
    schedule();
  });
  const release = (e) => { pointers.delete(e.pointerId); pinch = 0; if (!pointers.size) { dragging = false; schedule(); } };
  canvas.addEventListener("pointerup", release); canvas.addEventListener("pointercancel", release);
  const pinchDist = () => { const [a, b] = [...pointers.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  canvas.addEventListener("wheel", (e) => { e.preventDefault(); zoom = clamp(zoom * Math.exp(-e.deltaY * 0.0015), 0.4, 4); schedule(); }, { passive: false });
  canvas.addEventListener("dblclick", resetView);
  canvas.addEventListener("keydown", (e) => {
    const k = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key];
    if (k) { e.preventDefault(); R = mat.mul(mat.rotX(k[0] * 0.12), mat.mul(mat.rotY(k[1] * 0.12), R)); schedule(); }
    else if (e.key === "+" || e.key === "=") { zoom = clamp(zoom * 1.12, 0.4, 4); schedule(); }
    else if (e.key === "-") { zoom = clamp(zoom / 1.12, 0.4, 4); schedule(); }
    else if (e.key === "0") resetView();
  });
  function resetView() { R = mat.mul(mat.rotX(-0.45), mat.rotY(0.6)); zoom = 1; schedule(); }
  safeOn("#molReset", "click", resetView);
  safeOn("#molStyle", "change", (e) => { opt.style = e.target.value; computeExtent(); schedule(); });
  safeOn("#molSpin", "change", (e) => { opt.spin = e.target.checked; schedule(); });
  safeOn("#molLabels", "change", (e) => { opt.labels = e.target.checked; schedule(); });
  safeOn("#molLP", "change", (e) => { opt.lp = e.target.checked; schedule(); });

  /* ---- info panel & legend ---- */
  function showInfo(m, custom) {
    const dl = $("#moleculeInfo");
    if (!dl) return;
    dl.innerHTML = "";
    dl.append(el("dd", { class: "big", text: `${m.name} · ${m.formula}` }));
    const rows = custom ? [["Source", m.source], ["Atoms", String(m.atoms.length)]] :
      [[(m.labels || {}).shape || "Shape", m.shape], [(m.labels || {}).electron || "Electron geometry", m.electron], [(m.labels || {}).hyb || "Hybridisation", m.hyb], [(m.labels || {}).angle || "Bond angle", m.angle], [(m.labels || {}).polar || "Polarity", m.polar]];
    rows.forEach(([k, v]) => { dl.append(el("dt", { text: k }), el("dd", { text: v })); });
    if (m.note) dl.append(el("dd", { class: "note", text: m.note }));
    else if (custom) dl.append(el("dd", { class: "note", text: "Geometry is a computed 3D conformer from PubChem, shown for visualisation only. Check stereochemistry against a textbook." }));
    const legend = $("#viewerLegend");
    if (legend) {
      legend.innerHTML = "";
      [...new Set(m.atoms.map((a) => a[0]))].forEach((s) => legend.append(el("span", {}, el("i", { style: "background:" + elInfo(s).c }), elInfo(s).n)));
      if ((m.lonePairs || []).length) legend.append(el("span", {}, el("i", { style: "background:#a66bff" }), "Lone pair"));
    }
    const lpWrap = $("#lpWrap");
    if (lpWrap) lpWrap.hidden = !(m.lonePairs || []).length;

    const mol2d = $("#mol2dPanel");
    if (mol2d && window.NemoChemFig) {
      const preset = window.NemoChemFig.lookupPreset(m.id) || window.NemoChemFig.lookupPreset(m.name);
      let rendered2d = "";
      if (preset && preset.chemfig) {
        rendered2d = window.NemoChemFig.renderHtml(preset.chemfig, { title: `2D Skeletal Formula · ${preset.title}` });
      } else if (Array.isArray(m.atoms) && m.atoms.length > 0 && m.atoms.length <= 42 && !/lattice|unit cell|diamond|graphite/i.test(`${m.name || ""} ${m.shape || ""}`)) {
        const g = window.NemoChemFig.fromMoleculeData(m);
        const svg = g ? window.NemoChemFig.renderGraphToSvg(g, { label: m.name || "2D projection" }) : "";
        if (svg) {
          rendered2d = `<div class="chemfig-card" data-chemfig-raw="${esc(m.name + " (" + (m.formula || "") + ")")}">` +
            `<div class="chemfig-card-head"><span class="chemfig-card-title">2D Planar Projection · ${esc(m.name)}</span>` +
            `<div class="chemfig-card-actions"><button type="button" class="chemfig-btn" data-cf-expand title="Inspect 2D structure full-size">⤢</button></div></div>` +
            `<div class="chemfig-stage">${svg}</div></div>`;
        }
      }
      if (rendered2d) {
        mol2d.innerHTML = rendered2d;
        mol2d.hidden = false;
      } else {
        mol2d.innerHTML = "";
        mol2d.hidden = true;
      }
    }
  }
  function show(m, isCustom, silent = false) {
    mol = m; computeExtent(); resetView(); showInfo(m, isCustom);
    if (hint) hint.textContent = "Drag to rotate • scroll or pinch to zoom • double-click to reset"; schedule();
    if (!silent && typeof triggerNemoReaction === "function") {
      triggerNemoReaction({
        expression: "curious",
        icon: "⬡",
        text: `Inspecting ${m.name || "molecule"}! ⬡`,
        badge: (m.labels && m.labels.shape) || m.shape || "3D Mol",
        duration: 2500
      });
    }
  }
  function selectBuiltIn(id, silent = false) {
    const m = MOLS.find((x) => x.id === id) || custom.get(id); if (!m) return;
    show(m, custom.has(id), silent);
  }
  if (select) select.addEventListener("change", () => selectBuiltIn(select.value));

  /* ---- optional PubChem search (needs internet) ---- */
  let pcCtrl = null;
  safeOn("#pubchemForm", "submit", async (e) => {
    e.preventDefault();
    const name = $("#pubchemInput").value.trim(), msg = $("#pubchemMsg");
    if (!name) return;
    if (pcCtrl) pcCtrl.abort(); pcCtrl = new AbortController(); const my = pcCtrl;
    msg.textContent = "Searching PubChem for “" + name + "”…";
    try {
      const timer = setTimeout(() => my.abort(), 15000);
      const res = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/SDF?record_type=3d`, { signal: my.signal });
      clearTimeout(timer);
      if (res.status === 404) throw new Error("No 3D structure found for “" + name + "”. Try the common English name.");
      if (!res.ok) throw new Error("PubChem returned " + res.status);
      const m = parseSDF(await res.text());
      const id = "pc:" + name.toLowerCase();
      Object.assign(m, { id, name: name.charAt(0).toUpperCase() + name.slice(1), formula: hillFormula(m.atoms), source: "PubChem (3D conformer)" });
      if (!custom.has(id)) customGroup.append(el("option", { value: id, text: `${m.name} (${m.formula})` }));
      custom.set(id, m); customGroup.hidden = false; select.value = id; show(m, true);
      msg.textContent = "Loaded from PubChem. Built-in molecules always work offline.";
    } catch (err) {
      msg.textContent = err.name === "AbortError" ? "PubChem did not respond in time. Check your connection and try again." :
        (err instanceof TypeError ? "Couldn't reach PubChem. This search needs an internet connection." : err.message);
    }
  });

  if (MOLS.length) { select.value = MOLS[0].id; selectBuiltIn(MOLS[0].id, true); }
  else hint.textContent = "Molecule data failed to load (molecules.js missing).";
})();

/* ============================== shared KaTeX & math formatting ============================== */
function renderKatex(latex, display = true) {
  const cleaned = String(latex || "").trim();
  if (!cleaned) return "";
  if (window.NemoChemFig && window.NemoChemFig.containsChemFig(cleaned)) {
    const cfHtml = window.NemoChemFig.renderHtml(cleaned, {
      inline: !display,
      renderLatex: (tex, d) => renderPureLatex(String(tex || "").trim(), d)
    });
    if (cfHtml) return cfHtml;
  }
  if (typeof window.katex !== "undefined" && typeof window.katex.renderToString === "function") {
    try {
      return window.katex.renderToString(cleaned, {
        displayMode: display,
        throwOnError: true,
        trust: true,
        strict: false
      });
    } catch (_) {
      // Fall back cleanly without injecting red .katex-error HTML
    }
  }
  return `<code class="latex-fallback">${esc(cleaned)}</code>`;
}

function formatMathText(str) {
  if (!str) return "";
  let s = String(str);
  if (!s.includes("$") && !s.includes("\\(") && !s.includes("\\[")) return esc(s);
  const tokens = [];
  const put = (html) => {
    const idx = tokens.length;
    tokens.push(html);
    return `___FMT_MATH_${idx}___`;
  };
  s = s.replace(/\$\$([\s\S]*?)\$\$/g, (m, math) => put(renderKatex(math, false)));
  s = s.replace(/\\\[([\s\S]*?)\\\]/g, (m, math) => put(renderKatex(math, false)));
  s = s.replace(/\\\(([^\n]+?)\\\)/g, (m, math) => put(renderKatex(math, false)));
  s = s.replace(/(^|[^\\])\$(?!\s)([^$\n]*?\S)\$(?!\d)/g, (m, prefix, math) => {
    const inner = math.trim();
    if (!inner || /^\d[\d,.]*\s+(?:to|and|or|per|for|in|vs|-|–)\s*$/i.test(inner)) return m;
    if (/^\d[\d,.]*\s+[a-z]{2,}/i.test(inner) && !/[\\^_=+\-*/{}]/.test(inner)) return m;
    return `${prefix}${put(renderKatex(inner, false))}`;
  });
  return esc(s).replace(/___FMT_MATH_(\d+)___/g, (m, idx) => tokens[Number(idx)] || "");
}

/* ---------- Rules & Exceptions Library: Chemistry & Math KaTeX Renderer ---------- */
const LIB_SUB_MAP = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9", "ᵢ": "i", "ₙ": "n" };
const LIB_SUP_MAP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁺": "+", "⁻": "-", "ⁿ": "n" };

function libAsciiSubSup(s) {
  return String(s || "")
    .replace(/[₀-₉ᵢₙ]+/g, (m) => [...m].map((c) => LIB_SUB_MAP[c] || c).join(""))
    .replace(/[⁰¹²³⁴-⁹⁺⁻ⁿ]+/g, (m) => [...m].map((c) => LIB_SUP_MAP[c] || c).join(""));
}

function libToMathLatex(s) {
  let out = String(s || "")
    .replace(/ΔfH°/g, "Δ_fH°")
    .replace(/Δ_?mix([VHGS])/g, "Δ_{\\text{mix}}$1")
    .replace(/n_t2g/g, "n_{t_{2g}}")
    .replace(/n_eg/g, "n_{e_g}")
    .replace(/t₂g([⁰¹²³⁴-⁹⁺⁻ⁿ]*)/g, (_, sp) => "t_{2g}" + (sp ? "^{" + libAsciiSubSup(sp) + "}" : ""))
    .replace(/(?<![A-Za-z_{])e_?g([⁰¹²³⁴-⁹⁺⁻ⁿ]+)|(?<![A-Za-z_{])e_g(?![A-Za-z])/g, (_, sp) => "e_g" + (sp ? "^{" + libAsciiSubSup(sp) + "}" : ""))
    .replace(/ring angle/g, "\\text{ring angle}")
    .replace(/Δ/g, "\\Delta ").replace(/Σ/g, "\\sum ").replace(/α/g, "\\alpha ").replace(/β/g, "\\beta ")
    .replace(/γ/g, "\\gamma ").replace(/λ/g, "\\lambda ").replace(/μ/g, "\\mu ").replace(/ν/g, "\\nu ")
    .replace(/π/g, "\\pi ").replace(/θ/g, "\\theta ").replace(/η/g, "\\eta ").replace(/σ/g, "\\sigma ")
    .replace(/°_([A-Za-z0-9]+)/g, "^{\\circ}_{$1}").replace(/°/g, "^{\\circ}").replace(/′/g, "\\prime ")
    .replace(/−/g, "-").replace(/·/g, "\\cdot ").replace(/×/g, "\\times ").replace(/≈/g, "\\approx ")
    .replace(/∝/g, "\\propto ").replace(/≥/g, "\\ge ").replace(/≤/g, "\\le ").replace(/≠/g, "\\ne ")
    .replace(/→/g, "\\rightarrow ").replace(/⇌/g, "\\rightleftharpoons ").replace(/½/g, "\\tfrac{1}{2}");
  out = out.replace(/[₀-₉ᵢₙ]+/g, (m) => "_{" + [...m].map((c) => LIB_SUB_MAP[c] || c).join("") + "}");
  out = out.replace(/[⁰¹²³⁴-⁹⁺⁻ⁿ]+/g, (m) => "^{" + [...m].map((c) => LIB_SUP_MAP[c] || c).join("") + "}");
  out = out.replace(/\^\(([^)]+)\)/g, (_, p) => `^{${libToMathLatex(p)}}`);
  out = out.replace(/√\[([^\]]+)\]/g, (_, p) => `\\sqrt{${libToMathLatex(p)}}`);
  out = out.replace(/√\(([^)]+)\)/g, (_, p) => `\\sqrt{${libToMathLatex(p)}}`);
  out = out.replace(/√([A-Za-z0-9_\\]+)/g, (_, p) => `\\sqrt{${libToMathLatex(p)}}`);
  out = out.replace(/_([A-Za-z0-9]{2,})(?!\})/g, (m, sub) => /^a[12]$/.test(sub) ? `_{\\text{a}${sub[1]}}` : /^[A-Za-z]{2,}$/.test(sub) ? `_{\\text{${sub}}}` : `_{${sub}}`);
  out = out.replace(/_([A-Za-z])(?![A-Za-z0-9{])/g, "_{$1}");
  out = out.replace(/\b(log|ln|sin|cos|constant)\b/g, (m, fn) => fn === "constant" ? "\\text{constant}" : `\\${fn} `);
  return out.trim();
}

const LIB_CHEM_EXACT = /^(?:NaOH|KOH|NaCl|KCl|HCl|HBr|HI|HF|AgCl|AgBr|AgI|AgCN|KCN|AgF|PbS|ZnO|ZnS|CuO|MgO|CaO|AlCl|NaI|NaCN|NaSCN|NaOEt|NaBH|LiAlH|RCOOH|RCHO|RCOCl|RCONH|RCOOAg|RCOONa|RCOOR|CHCl|PhCHO|HCHO|NaH|CuCl|CuBr|CuCN|KI|BH|Zn|Hg|Pt|Au|Pd|Fe|Cu|Al|Cr|Ni|Co|Mn|Ag|Li|Na|Rb|Cs|Be|Mg|Ca|Sr|Ba|Sc|Ti|Cd|Pb|Sn|Bi|Sb|As|Se|Te|Br|Cl|Ar|Kr|Xe|Rn)$/;

function libFormatInlineHtml(raw) {
  if (!raw) return "";
  let s = String(raw);
  // Pre-normalize incomplete notation patterns (e.g., E_o / cell -> E°_cell)
  s = s.replace(/\bE_o\s*\/\s*cell\b/gi, "E°_cell")
    .replace(/\bE°\s*\/\s*cell\b/gi, "E°_cell")
    .replace(/\bE_o(?![A-Za-z0-9_])/g, "E°")
    .replace(/ΔfH°/g, "Δ_fH°")
    .replace(/Δmix([VHGS])/g, "Δ_mix$1");

  const toks = [];
  const mark = (latex, rawFallback) => {
    const id = toks.length;
    toks.push({ latex, fallback: rawFallback != null ? rawFallback : latex });
    return `\uE000${id}\uE001`;
  };

  const rawCfToks = [];
  if (window.NemoChemFig && window.NemoChemFig.containsChemFig(s)) {
    const hits = window.NemoChemFig.extractChemFigs(s);
    if (hits.length) {
      let rebuilt = "";
      let cur = 0;
      for (const h of hits) {
        rebuilt += s.slice(cur, h.start);
        const cfHtml = window.NemoChemFig.renderHtml(h.raw, {
          inline: true,
          renderLatex: (tex, d) => renderPureLatex(String(tex || "").trim(), d)
        });
        if (cfHtml) {
          const rid = rawCfToks.length;
          rawCfToks.push(cfHtml);
          rebuilt += `\uE002${rid}\uE003`;
        } else {
          rebuilt += h.raw;
        }
        cur = h.end;
      }
      s = rebuilt + s.slice(cur);
    }
  }

  // Preserve any pre-authored explicit $...$ KaTeX spans if present
  s = s.replace(/\$([^$\n]+?)\$/g, (m, math) => mark(math.trim(), m));

  // 1. Equations & algebraic expressions (ordered before standalone tokenizers)
  const mathExprPatterns = [
    /\(P\s*\+\s*an²\/V²\)\(V\s*[−-]\s*nb\)\s*=\s*nRT/g,
    /nλ\s*=\s*2d\s*sin\s*θ/g,
    /Δx·Δp\s*≥\s*h\/4π/g,
    /mvr\s*=\s*nh\/2π/g,
    /hν\s*=\s*W₀\s*\+\s*½mv²_max/g,
    /eV₀\s*=\s*hν\s*[−-]\s*W₀/g,
    /ΔG°?\s*=\s*ΔH°?\s*[−-]\s*TΔS°?(?:\s*<\s*0)?/g,
    /ΔH\s*=\s*ΔU\s*\+\s*Δn_g\s*RT/g,
    /C_p\s*[−-]\s*C_v\s*=\s*R/g,
    /TV\^\(γ−1\)/g,
    /PV\^γ/g,
    /ΔS_total\s*=\s*ΔS_system\s*\+\s*ΔS_surroundings\s*>\s*0/g,
    /ΔS_surr\s*=\s*[−-]ΔH_sys\/T/g,
    /P_total\s*=\s*ΣPᵢ/g,
    /Pᵢ\s*=\s*xᵢ·P_total/g,
    /ΔH\(T₂\)\s*[−-]\s*ΔH\(T₁\)\s*=\s*ΔC_p\s*\(T₂\s*[−-]\s*T₁\)/g,
    /w\s*=\s*−2\.303\s*nRT\s*log\(V₂\/V₁\)\s*=\s*−nRT\s*ln\(P₁\/P₂\)/g,
    /ln\(K₂\/K₁\)\s*=\s*\(ΔH°\/R\)\(1\/T₁\s*[−-]\s*1\/T₂\)/g,
    /pH\s*[=≈]\s*(?:7\s*[+−-]\s*)?½\([^)]+\)/g,
    /pI\s*=\s*\(pKa₁\s*\+\s*pKa₂\)\/2/g,
    /K\s*=\s*Cα²\/\(1\s*[−-]\s*α\)\s*≈\s*Cα²/g,
    /α\s*≈\s*√\(K\/C\)/g,
    /\[H⁺\]\s*=\s*Cα/g,
    /Rate\s*=\s*Z·P·e\^\(−Ea\/RT\)/g,
    /p_A\s*=\s*x_A\s*p°_A/g,
    /p\s*=\s*K_H\s*x/g,
    /r₁\/r₂\s*=\s*√\(M₂\/M₁\)/g,
    /ΔH_vap\/T_b/g,
    /t½(?![A-Za-z0-9])/g,
    /\[A\]₀\^\([^)]+\)/g,
    /Fe\(η⁵-C₅H₅\)₂/g,
    /½\([^)]+\)/g,
    /(?:[−-]?\d+)°\d+′/g,
    /√\([^)]+\)/g,
    /√\[[^\]]+\]/g,
    /√[A-Za-z0-9_ν]+/g,
    /[A-Za-z0-9\])]+\^\([^)]+\)/g,
    /\([A-Za-z0-9_]+\/[0-9]+\)\^\([^)]+\)/g,
    /\br⁺\/r⁻(?![A-Za-z0-9])/g
  ];
  for (const re of mathExprPatterns) {
    s = s.replace(re, (m) => {
      if (m === "t½") return mark("t_{1/2}", m);
      if (m === "Fe(η⁵-C₅H₅)₂") return mark("\\ce{Fe}(\\eta^5\\text{-}\\ce{C5H5})_2", m);
      return mark(libToMathLatex(m), m);
    });
  }

  // 2. Isotope mass numbers like ¹⁸O and scientific notation 1.6 × 10⁻¹⁹
  s = s.replace(/(?<![A-Za-z0-9])([⁰¹²³⁴-⁹]+)([A-Z][a-z]?)(?![A-Za-z0-9])/g, (m, sup, elSym) => {
    return mark(`\\ce{^{${libAsciiSubSup(sup)}}${elSym}}`, m);
  });
  s = s.replace(/(?:\d+(?:\.\d+)?\s*×\s*)?10[⁰¹²³⁴-⁹⁺⁻]+(?![A-Za-z0-9])/g, (m) => mark(libToMathLatex(m), m));

  // 3. Units (kJ mol⁻¹, J K⁻¹ mol⁻¹, L² atm mol⁻², cm⁻¹)
  s = s.replace(/\b(?:L²\s*atm\s*mol⁻²|k?J\s*(?:K⁻¹\s*)?mol⁻¹|cm⁻¹)(?![A-Za-z0-9⁰¹²³⁴-⁹⁺⁻])/g, (m) => {
    const parts = m.trim().split(/\s+/).map((p) => {
      const pm = p.match(/^([A-Za-z]+)([⁰¹²³⁴-⁹⁺⁻]+)$/);
      return pm ? `\\text{${pm[1]}}^{${libAsciiSubSup(pm[2])}}` : `\\text{${p}}`;
    });
    return mark(parts.join("\\,"), m);
  });

  // 4. Orbitals & electron configurations
  s = s.replace(/(?:\[(?:He|Ne|Ar|Kr|Xe|Rn)\])?(?:\d?[spdf][⁰¹²³⁴-⁹⁺⁻ⁿ]+)+|\b(?:sp[²³]d[²³]?|dsp[²³]|sp[²³]|t₂g[⁰¹²³⁴-⁹]*|e_?g[⁰¹²³⁴-⁹]*|n_t2g|n_eg|ns[¹²]|np[¹-⁶])(?![A-Za-z0-9])/g, (m) => {
    if (/^d[0-9]+$/.test(m)) return m;
    const out = m
      .replace(/\[(He|Ne|Ar|Kr|Xe|Rn)\]/g, "\\text{[$1]}")
      .replace(/n_t2g/g, "n_{t_{2g}}")
      .replace(/n_eg/g, "n_{e_g}")
      .replace(/t₂g/g, "t_{2g}")
      .replace(/e_?g/g, "e_g")
      .replace(/[⁰¹²³⁴-⁹⁺⁻ⁿ]+/g, (x) => "^{" + libAsciiSubSup(x) + "}");
    return mark(out, m);
  });

  // 5. Electrons & chemical species / complexes / hydrates / diazonium salts
  s = s.replace(/(?<![A-Za-z0-9])(\d*)e⁻(?![A-Za-z0-9])/g, (m, n) => mark(`\\ce{${n || ""}e-}`, m));
  const CHEM_SEG = "(?:[A-Z][a-z]?(?:[₀-₉]+(?:\\.[₀-₉]+)?)?(?:[⁰¹²³⁴-⁹]*[⁺⁻]+)?|\\[[A-Za-z0-9₀-₉()⁺⁻·]+\\](?:[₀-₉]+)?(?:[⁰¹²³⁴-⁹]*[⁺⁻]+)?|\\([A-Za-z0-9₀-₉⁰¹²³⁴-⁹⁺⁻]+\\)(?:[₀-₉]+)?)";
  const CHEM_RE = new RegExp(`(?<![A-Za-z0-9])(?:\\d+(?=[A-Z\\[(])|½(?=[A-Z\\[(]))?(?:${CHEM_SEG})+(?:·(?:\\d+|½)?(?:${CHEM_SEG})+)*(?:[⁰¹²³⁴-⁹]*[⁺⁻]+)?(?![A-Za-z0-9])`, "g");
  s = s.replace(CHEM_RE, (m) => {
    if (!/[₀-₉⁰¹²³⁴-⁹⁺⁻\[\]·]/.test(m) && !LIB_CHEM_EXACT.test(m)) return m;
    if (/^[A-Z]{2,}$/.test(m) && !/[₀-₉⁰¹²³⁴-⁹⁺⁻]/.test(m) && !LIB_CHEM_EXACT.test(m)) return m;
    if (/^\[(?:Ar|Kr|Xe|Ne|He|Rn|4\+2)\]$/.test(m)) return m;
    if (/^\[A\]/.test(m)) return mark(libToMathLatex(m), m);
    const ce = m
      .replace(/½/g, "1/2 ")
      .replace(/·/g, " * ")
      .replace(/[₀-₉]+/g, (x) => [...x].map((c) => LIB_SUB_MAP[c] || c).join(""))
      .replace(/([⁰¹²³⁴-⁹]+)([⁺⁻])/g, (_, n, ch) => "^" + libAsciiSubSup(n) + libAsciiSubSup(ch) + " ")
      .replace(/[⁺⁻]/g, (c) => "^" + libAsciiSubSup(c) + " ")
      .replace(/[⁰¹²³⁴-⁹]+/g, (x) => "^" + libAsciiSubSup(x));
    return mark(`\\ce{${ce.trim()}}`, m);
  });

  // 6. Variables, constants, angles, Greek symbols
  s = s.replace(/(?<![A-Za-z])(?:E°_cell|E°|Δ_[a-zA-Z0-9]+°?|Δ[A-Z]_[a-zA-Z0-9]+°?|Δ[A-Z]°?|pK_[a-zA-Z0-9]+|pKa[₁₂]?|K_[a-zA-Z0-9]+|[A-Za-zΔ]+_[A-Za-z0-9{}]+|Pᵢ|xᵢ|T₁|T₂|V₁|V₂|P₁|P₂|K₁|K₂|M₁|M₂|W₀|V₀)(?![A-Za-z0-9])/g, (m) => mark(libToMathLatex(m), m));
  s = s.replace(/\b(\d*[a-zA-Z0-9][⁰¹²³⁴-⁹ⁿ]+)(?![A-Za-z0-9])/g, (m) => mark(libToMathLatex(m), m));
  s = s.replace(/\b(\d+(?:\.\d+)?)°(?!C\b)(?![A-Za-z0-9])/g, (m, n) => mark(`${n}^\\circ`, m));
  s = s.replace(/(?<![A-Za-z])([−-]?\s*½)(?![A-Za-z0-9])/g, (m) => mark(libToMathLatex(m), m));
  s = s.replace(/(?<![A-Za-z])([ΔΣαβγλμνθπ])(?![A-Za-z])/g, (m, g) => mark(libToMathLatex(g), m));

  // 7. Merge adjacent math/reaction tokens separated solely by math/reaction/comparison operators
  s = s.replace(/(\uE000\d+\uE001)(?:\s*([=+−→⇌<>≥≤≈∝·×]|>>)\s*(\uE000\d+\uE001))+/g, (seq) => {
    const pieces = seq.split(/(\uE000\d+\uE001)/);
    let combined = "";
    let rawMerged = "";
    for (const p of pieces) {
      if (!p) continue;
      const pm = p.match(/^\uE000(\d+)\uE001$/);
      if (pm) {
        const t = toks[Number(pm[1])];
        combined += t.latex;
        rawMerged += t.fallback;
      } else {
        combined += " " + libToMathLatex(p.trim()) + " ";
        rawMerged += p;
      }
    }
    return mark(combined.trim(), rawMerged.trim());
  });

  // 8. Standalone reaction/equilibrium arrows
  s = s.replace(/\s*→\s*/g, () => " " + mark("\\rightarrow", "→") + " ");
  s = s.replace(/\s*⇌\s*/g, () => " " + mark("\\rightleftharpoons", "⇌") + " ");

  // Escape remaining plain prose and substitute KaTeX + ChemFig rendered spans
  return esc(s)
    .replace(/\uE002(\d+)\uE003/g, (_, idx) => rawCfToks[Number(idx)] || "")
    .replace(/\uE000(\d+)\uE001/g, (_, idx) => {
      const item = toks[Number(idx)];
      if (!item) return "";
      if (typeof window.katex !== "undefined" && typeof window.katex.renderToString === "function") {
        try {
          const rendered = window.katex.renderToString(item.latex, {
            displayMode: false,
            throwOnError: true,
            trust: true,
            strict: false
          });
          return `<span class="lib-math">${rendered}</span>`;
        } catch (_) {}
      }
      return `<span class="lib-math-fallback">${esc(item.fallback)}</span>`;
    });
}

function libBuildRichContent(raw) {
  const frag = document.createDocumentFragment();
  if (!raw) return frag;
  const lines = String(raw).split(/\r?\n/);
  let ul = null;
  const flushUl = () => {
    if (ul) {
      frag.append(ul);
      ul = null;
    }
  };
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("- ")) {
      if (!ul) ul = el("ul", { class: "lib-bullets" });
      const body = line.slice(2).trim();
      const li = document.createElement("li");
      // Highlight lead-in term before ": " when it is a clean reagent/case/group header
      const colonIdx = body.indexOf(": ");
      if (colonIdx > 0 && colonIdx <= 60) {
        const lead = body.slice(0, colonIdx);
        const rest = body.slice(colonIdx + 2);
        li.innerHTML = `<strong class="lib-bullet-lead">${libFormatInlineHtml(lead)}:</strong> ${libFormatInlineHtml(rest)}`;
      } else {
        li.innerHTML = libFormatInlineHtml(body);
      }
      ul.append(li);
    } else {
      flushUl();
      const p = el("p", { class: "lib-prose" });
      p.innerHTML = libFormatInlineHtml(line);
      frag.append(p);
    }
  }
  flushUl();
  return frag;
}

function makeScrollableByDrag(elem) {
  if (!elem) return;
  let isDown = false, startX = 0, scrollLeft = 0;
  elem.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    if (elem.scrollWidth <= elem.clientWidth) return;
    isDown = true;
    elem.classList.add("is-dragging");
    startX = e.pageX - elem.offsetLeft;
    scrollLeft = elem.scrollLeft;
  });
  elem.addEventListener("mouseleave", () => {
    if (isDown) { isDown = false; elem.classList.remove("is-dragging"); }
  });
  elem.addEventListener("mouseup", () => {
    if (isDown) { isDown = false; elem.classList.remove("is-dragging"); }
  });
  elem.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - elem.offsetLeft;
    const walk = (x - startX) * 1.5;
    elem.scrollLeft = scrollLeft - walk;
  });

  // Touch drag support for mobile / tablet devices
  elem.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    if (elem.scrollWidth <= elem.clientWidth) return;
    isDown = true;
    startX = e.touches[0].pageX - elem.offsetLeft;
    scrollLeft = elem.scrollLeft;
  }, { passive: true });
  elem.addEventListener("touchend", () => {
    isDown = false;
  }, { passive: true });
  elem.addEventListener("touchcancel", () => {
    isDown = false;
  }, { passive: true });
  elem.addEventListener("touchmove", (e) => {
    if (!isDown || e.touches.length !== 1) return;
    const x = e.touches[0].pageX - elem.offsetLeft;
    const walk = (x - startX) * 1.2;
    elem.scrollLeft = scrollLeft - walk;
  }, { passive: true });
}

/* ============================== practice + analytics ============================== */
const QUIZ_TOPIC = { p1: "nernst", p2: "firstorder", p3: "osmotic", p4: "gibbs", p5: "kpkc", p6: "bohr", i1: "vsepr", i2: "exceptions", i3: "exceptions", i6: "bondorder", o2: "sn2", o3: "markovnikov", o4: "eas" };
const BRANCHES = ["Physical", "Inorganic", "Organic"];
const emptyStats = () => ({ branches: { Physical: { a: 0, c: 0 }, Inorganic: { a: 0, c: 0 }, Organic: { a: 0, c: 0 } }, chapters: {}, streak: 0, best: 0 });
let stats = store.get("nemo.stats.v1", null);
if (!stats || !stats.branches || !stats.chapters) stats = emptyStats();
BRANCHES.forEach((b) => { stats.branches[b] = stats.branches[b] || { a: 0, c: 0 }; });
const pct = (c, a) => (a ? Math.round((100 * c) / a) : null);

function renderAnalytics() {
  const row = $("#statRow"), bars = $("#chartBars"), box = $("#focusCallout");
  if (!row || !bars || !box) return;
  const totA = BRANCHES.reduce((s, b) => s + stats.branches[b].a, 0), totC = BRANCHES.reduce((s, b) => s + stats.branches[b].c, 0);
  row.innerHTML = "";
  [[String(totA), "Answered"], [totA ? pct(totC, totA) + "%" : "—", "Accuracy"], [String(stats.best), "Best streak"]].forEach(([v, l]) => row.append(el("div", { class: "stat" }, el("b", { text: v }), el("span", { text: l }))));
  bars.innerHTML = "";
  BRANCHES.forEach((b) => {
    const { a, c } = stats.branches[b], p = pct(c, a);
    bars.append(el("div", { class: "bar-row" }, el("span", {}, b, el("small", { text: a ? `${c}/${a} correct` : "no attempts" })),
      el("div", { class: "bar-track", role: "progressbar", "aria-label": b + " accuracy", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(p || 0) }, el("i", { style: `width:${p || 0}%` })),
      el("b", { text: p === null ? "—" : p + "%" })));
  });
  const weak = Object.entries(stats.chapters).filter(([, v]) => v.a >= 2).map(([k, v]) => ({ k, ...v, p: pct(v.c, v.a) })).sort((x, y) => x.p - y.p || y.a - x.a)[0];
  box.innerHTML = "";
  let title, body;
  if (!totA) { title = "Start practising"; body = "Answer a few questions in the Practice panel and this chart will show where you are strong and where to revise."; }
  else if (weak && weak.p < 80) { title = "Focus next: " + weak.k; body = `You have answered ${weak.c} of ${weak.a} correctly (${weak.p}%) in this chapter (${weak.branch}). Revise it, then retry.`; }
  else { title = "Looking solid"; body = weak ? "Every chapter with 2+ attempts is at 80% or higher. Switch to “All branches” to meet new topics." : "Answer at least two questions from the same chapter to unlock chapter-level feedback."; }
  box.append(el("span", { "aria-hidden": "true", text: "↗" }), el("div", {}, el("b", { text: title }), el("p", { text: body })));
}
function recordAttempt(q, ok) {
  const b = stats.branches[q.branch]; b.a++; if (ok) b.c++;
  const ch = (stats.chapters[q.chapter] = stats.chapters[q.chapter] || { a: 0, c: 0, branch: q.branch }); ch.a++; if (ok) ch.c++;
  stats.streak = ok ? stats.streak + 1 : 0; stats.best = Math.max(stats.best, stats.streak);
  store.set("nemo.stats.v1", stats); renderAnalytics();
}
(function setupResetStats() {
  const btn = $("#resetStats");
  if (!btn) return;
  let armed = false, timer = null;
  const origLabel = btn.textContent || "Reset my stats";
  btn.addEventListener("click", () => {
    if (!armed) {
      armed = true;
      btn.textContent = "Confirm Reset?";
      btn.setAttribute("aria-label", "Confirm resetting all practice statistics");
      if (typeof window.showNemoToast === "function") {
        window.showNemoToast("Click “Confirm Reset?” again within 3.5s to clear practice statistics.", { icon: "⚠️" });
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        armed = false;
        btn.textContent = origLabel;
        btn.removeAttribute("aria-label");
      }, 3500);
      return;
    }
    clearTimeout(timer);
    armed = false;
    btn.textContent = origLabel;
    btn.removeAttribute("aria-label");
    stats = emptyStats();
    store.del("nemo.stats.v1");
    renderAnalytics();
    if (typeof window.showNemoToast === "function") {
      window.showNemoToast("Practice statistics reset cleanly.", { icon: "✓" });
    }
  });
})();

(function practice() {
  const body = $("#quizBody"), branchSel = $("#practiceBranch");
  let queue = [], q = null, shown = [], answered = false, lastId = null, roundTotal = 0, roundDone = 0;
  function refill() {
    const pool = DATA.quiz.filter((x) => branchSel.value === "All" || x.branch === branchSel.value);
    queue = shuffle(pool.map((x) => x.id)); roundTotal = queue.length; roundDone = 0;
    if (queue.length > 1 && queue[0] === lastId) queue.push(queue.shift());
  }
  function next() {
    if (!queue.length) refill();
    const nextId = queue.shift();
    q = DATA.quiz.find((x) => x.id === nextId); if (!q) { body.textContent = "No questions available."; return; }
    lastId = q.id; answered = false; shown = shuffle(q.options.map((text, i) => ({ text, ok: i === q.answer })));
    render();
  }
  function render(result) {
    body.innerHTML = "";
    body.append(el("div", { class: "quiz-meta" }, el("span", { text: q.branch }), el("span", { text: q.chapter }), el("span", { text: `Question ${Math.min(roundDone + (answered ? 0 : 1), roundTotal)} of ${roundTotal}` })));
    const qPara = el("p", { class: "quiz-q" });
    qPara.innerHTML = formatMathText(q.q);
    body.append(qPara);
    const opts = el("div", { class: "opts", role: "group", "aria-label": "Answer options" });
    shown.forEach((o, i) => {
      const cls = answered ? (o.ok ? " correct" : result && result.picked === i ? " wrong" : "") : "";
      const optBtn = el("button", { class: "opt" + cls, disabled: answered, "data-i": String(i), onclick: () => choose(i) });
      const optLetter = el("b", { text: "ABCD"[i] });
      const optText = el("span", {});
      optText.innerHTML = formatMathText(o.text);
      optBtn.append(optLetter, optText);
      opts.append(optBtn);
    });
    body.append(opts);
    if (answered) {
      const fb = el("div", { class: "feedback", role: "status" });
      const statStrong = el("strong", { class: result.ok ? "ok" : "no", text: result.ok ? "Correct. " : "Not quite. " });
      const expSpan = el("span", {});
      expSpan.innerHTML = formatMathText(q.explain);
      fb.append(statStrong, expSpan);
      body.append(fb);
      const actions = el("div", { class: "btn-row" }, el("button", { class: "primary", text: "Next question →", onclick: next }));
      const topic = QUIZ_TOPIC[q.id];
      if (topic) actions.append(el("button", { type: "button", class: "secondary", text: "Review the theory", onclick: () => {
        ensurePanelVisible("chatPanel");
        $("#chatPanel")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        askNemo(`Review the theory behind this question: ${q.chapter}.`, { topic });
      } }));
      body.append(actions);
    }
  }
  function choose(i) {
    if (answered) return; answered = true; roundDone++;
    const ok = shown[i].ok; recordAttempt(q, ok); render({ ok, picked: i });
    const nb = $(".btn-row .primary", body); if (nb) nb.focus({ preventScroll: true });

    if (typeof triggerNemoReaction === "function") {
      if (ok) {
        const isStreakMilestone = stats.streak >= 3 && stats.streak % 3 === 0;
        const msg = isStreakMilestone
          ? `${stats.streak} Streak! Unstoppable chemistry mastery! 🔥`
          : (stats.streak > 1 ? `Correct! Streak ${stats.streak} in a row ✨` : "Spot on! Perfect conceptual answer! 🎉");
        triggerNemoReaction({
          expression: "celebrate",
          icon: isStreakMilestone ? "🔥" : "🎉",
          text: msg,
          badge: isStreakMilestone ? `${stats.streak} Streak!` : "Spot On!",
          duration: 3400,
          chime: "correct"
        });
      } else {
        triggerNemoReaction({
          expression: "oops",
          icon: "💡",
          text: "Tricky question! Check the theory breakdown below",
          badge: "Review!",
          duration: 3400,
          chime: "incorrect"
        });
      }
    }
  }
  if (body) {
    body.addEventListener("keydown", (e) => {
      if (e.repeat || e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (NemoOverlay.isAnyModalOpen()) return;
      const n = "1234".indexOf(e.key) >= 0 ? +e.key - 1 : "abcd".indexOf(e.key.toLowerCase());
      if (!answered && n >= 0 && n < shown.length && e.key.length === 1) {
        e.preventDefault();
        choose(n);
      } else if (answered && (e.key === "Enter" || e.key === " " || e.key === "ArrowRight")) {
        if ((e.key === "Enter" || e.key === " ") && e.target && e.target.closest("button:not(.opt), a, input, select, textarea")) return;
        e.preventDefault();
        next();
      }
    });
  }
  branchSel.addEventListener("change", () => { queue = []; next(); });
  if (DATA.quiz.length) next(); else body.textContent = "Practice questions failed to load (data.js missing).";
})();

/* ---- Unified Gold Exam Portals & Study Showcase Hub Controller ---- */
(function setupGoldExamPortals() {
  const wraps = $$(".exam-portal-wrap");
  const backdrop = $("#portalBackdrop");
  let toastTimer = null;
  let portalLoadTimer = null;
  let hubLoadTimer = null;
  let lastTriggerBtn = null;

  function showToast(htmlContent, duration = 4200) {
    let toast = $(".portal-toast");
    if (!toast) {
      toast = el("div", { class: "portal-toast", role: "status", "aria-live": "polite" });
      document.body.append(toast);
    }
    toast.innerHTML = htmlContent;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  }

  window.showNemoToast = function showNemoToast(msg, opts = {}) {
    const icon = esc(opts.icon || "★");
    showToast(`<span style="color:#fbbf24;font-size:15px">${icon}</span> <span>${esc(msg)}</span>`, opts.duration || 3600);
  };

  function showPortalToast(examTitle) {
    showToast(`<span style="color:#fbbf24;font-size:16px">★</span> <span>Opening <strong>${esc(examTitle)}</strong> in a new tab &bull; Practice progress saved</span>`, 4500);
  }

  function ensureLoadingBar(menu) {
    if (!menu) return null;
    let bar = menu.querySelector(".portal-menu-loading-bar");
    if (!bar) {
      bar = el("div", { class: "portal-menu-loading-bar", hidden: true, role: "status", "aria-live": "polite" });
      bar.innerHTML = `
        <span class="portal-spinner" aria-hidden="true"></span>
        <div class="portal-loading-meta">
          <strong class="portal-loading-title">Opening study portal…</strong>
          <small class="portal-loading-host">Connecting to external resource…</small>
        </div>
      `;
      const header = menu.querySelector(".portal-menu-header");
      if (header && header.nextSibling) menu.insertBefore(bar, header.nextSibling);
      else menu.prepend(bar);
    }
    return bar;
  }

  function clearPortalLoadingState() {
    clearTimeout(portalLoadTimer);
    clearTimeout(hubLoadTimer);
    $$(".portal-item.is-loading, .gold-hub-card.is-loading").forEach((node) => {
      node.classList.remove("is-loading");
      node.removeAttribute("aria-busy");
    });
    wraps.forEach((w) => {
      w.classList.remove("is-loading");
      const bar = w.querySelector(".portal-menu-loading-bar");
      if (bar) bar.hidden = true;
    });
  }

  function activatePortalLoading(item, portalName) {
    clearPortalLoadingState();
    item.classList.add("is-loading");
    item.setAttribute("aria-busy", "true");

    let host = "external portal";
    try {
      if (item.href) host = new URL(item.href).hostname.replace(/^www\./, "");
    } catch (_) {}

    if (item.classList.contains("portal-item")) {
      const wrap = item.closest(".exam-portal-wrap");
      const menu = item.closest(".exam-portal-menu");
      if (wrap) wrap.classList.add("is-loading");
      const bar = ensureLoadingBar(menu);
      if (bar) {
        const titleEl = bar.querySelector(".portal-loading-title");
        const hostEl = bar.querySelector(".portal-loading-host");
        if (titleEl) titleEl.textContent = `Opening ${portalName}…`;
        if (hostEl) hostEl.textContent = `${host} · Loading external study portal in new tab`;
        bar.hidden = false;
      }
      portalLoadTimer = setTimeout(() => {
        clearPortalLoadingState();
        closeAllMenus(false);
      }, 1150);
    } else {
      hubLoadTimer = setTimeout(() => {
        item.classList.remove("is-loading");
        item.removeAttribute("aria-busy");
      }, 1250);
    }
  }

  function clearMenuPosition(menu) {
    if (!menu) return;
    menu.style.top = "";
    menu.style.bottom = "";
    menu.style.left = "";
    menu.style.right = "";
    menu.style.maxHeight = "";
    menu.style.translate = "";
    menu.classList.remove("open-upward");
  }

  function positionMenu(btn, menu) {
    if (!btn || !menu || menu.hidden) return;
    clearMenuPosition(menu);

    const vpW = document.documentElement.clientWidth || window.innerWidth || 1024;
    const vpH = document.documentElement.clientHeight || window.innerHeight || 768;

    // On mobile <= 640px, CSS renders a full-width docked bottom sheet
    if (vpW <= 640) return;

    const btnRect = btn.getBoundingClientRect();
    const island = $("#mobileTopIsland");
    let topInset = 14;
    if (island && window.getComputedStyle(island).display !== "none") {
      const iRect = island.getBoundingClientRect();
      if (iRect.bottom > 0 && iRect.bottom < vpH * 0.4) {
        topInset = Math.max(topInset, Math.ceil(iRect.bottom + 8));
      }
    }

    const menuW = Math.min(370, Math.max(240, vpW - 24));
    const left = clamp(Math.round(btnRect.right - menuW), 12, Math.max(12, vpW - menuW - 12));

    // Measure unconstrained height synchronously before paint
    menu.style.maxHeight = "none";
    const naturalH = Math.min(580, menu.scrollHeight || 430);

    const availBelow = vpH - btnRect.bottom - 20;
    const availAbove = btnRect.top - topInset - 12;
    const preferUp = availBelow < Math.min(340, naturalH) && availAbove > availBelow;

    if (preferUp) {
      const maxH = Math.max(200, Math.min(580, availAbove));
      const usedH = Math.min(naturalH, maxH);
      const top = Math.max(topInset, Math.round(btnRect.top - 8 - usedH));
      menu.classList.add("open-upward");
      menu.style.top = `${top}px`;
      menu.style.bottom = "auto";
      menu.style.left = `${left}px`;
      menu.style.right = "auto";
      menu.style.maxHeight = `${maxH}px`;
    } else {
      const top = clamp(Math.round(btnRect.bottom + 8), topInset, Math.max(topInset, vpH - 220));
      const maxH = Math.max(200, Math.min(580, vpH - top - 14));
      menu.style.top = `${top}px`;
      menu.style.bottom = "auto";
      menu.style.left = `${left}px`;
      menu.style.right = "auto";
      menu.style.maxHeight = `${maxH}px`;
    }
  }

  function syncBackdrop() {
    if (!backdrop) return;
    const anyOpen = wraps.some((w) => w.classList.contains("open"));
    backdrop.hidden = !anyOpen;
    backdrop.classList.toggle("active", anyOpen);
  }

  function closeAllMenus(restoreFocus = false) {
    clearPortalLoadingState();
    wraps.forEach((w) => {
      w.classList.remove("open");
      const m = w.querySelector(".exam-portal-menu");
      if (m) {
        m.hidden = true;
        clearMenuPosition(m);
      }
      const b = w.querySelector(".exam-portal-btn");
      if (b) b.setAttribute("aria-expanded", "false");
      w.closest(".panel")?.classList.remove("has-open-portal");
    });
    syncBackdrop();
    if (restoreFocus && lastTriggerBtn && document.contains(lastTriggerBtn)) {
      lastTriggerBtn.focus({ preventScroll: true });
      lastTriggerBtn = null;
    }
  }

  wraps.forEach((wrap) => {
    const btn = wrap.querySelector(".exam-portal-btn");
    const menu = wrap.querySelector(".exam-portal-menu");
    if (!btn || !menu) return;
    ensureLoadingBar(menu);

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = menu.hidden;
      closeAllMenus(false);
      if (willOpen) {
        lastTriggerBtn = btn;
        menu.hidden = false;
        wrap.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        wrap.closest(".panel")?.classList.add("has-open-portal");
        syncBackdrop();
        positionMenu(btn, menu);
      } else {
        lastTriggerBtn = null;
      }
    });
  });

  const repositionOpen = () => {
    wraps.forEach((wrap) => {
      if (!wrap.classList.contains("open")) return;
      const btn = wrap.querySelector(".exam-portal-btn");
      const menu = wrap.querySelector(".exam-portal-menu");
      if (btn && menu && !menu.hidden) positionMenu(btn, menu);
    });
  };
  window.addEventListener("resize", repositionOpen, { passive: true });
  window.addEventListener("scroll", repositionOpen, { passive: true });
  window.addEventListener("nemo:display-adapt", repositionOpen);

  // Clear temporary loading state if user switches back after external tab finishes loading
  window.addEventListener("focus", () => {
    if (wraps.some((w) => w.classList.contains("is-loading")) || $(".gold-hub-card.is-loading")) {
      clearPortalLoadingState();
      closeAllMenus(false);
    }
  });
  document.addEventListener("visibilitychange", () => {
    const anyLoading = () => wraps.some((w) => w.classList.contains("is-loading")) || Boolean($(".gold-hub-card.is-loading"));
    if (document.visibilityState === "visible" && anyLoading()) {
      setTimeout(() => {
        if (anyLoading()) {
          clearPortalLoadingState();
          closeAllMenus(false);
        }
      }, 300);
    }
  });

  $$(".portal-close-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAllMenus(true);
    });
  });

  if (backdrop) {
    backdrop.addEventListener("click", () => closeAllMenus(false));
  }

  document.addEventListener("click", (e) => {
    const item = e.target.closest(".portal-item, .gold-hub-card");
    if (item) {
      const nameEl = item.querySelector(".portal-name") || item.querySelector("h4");
      const name = nameEl ? nameEl.textContent.replace("↗", "").trim() : "Chemistry Study Portal";
      if (typeof stats !== "undefined" && stats) {
        store.set("nemo.stats.v1", stats);
      }
      showPortalToast(name);
      activatePortalLoading(item, name);
      return;
    }
    if (!e.target.closest(".exam-portal-wrap")) {
      closeAllMenus(false);
    }
  });

  NemoOverlay.register("portal", {
    isOpen: () => wraps.some((w) => w.classList.contains("open")),
    close: (restore) => closeAllMenus(Boolean(restore))
  });

  function focusGoldHub() {
    closeAllMenus(false);
    ensurePanelVisible("pyqPanel");
    const hub = document.getElementById("pyqGoldHub");
    if (hub) {
      hub.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      hub.classList.remove("hub-highlight");
      void hub.offsetWidth;
      hub.classList.add("hub-highlight");
      setTimeout(() => hub.classList.remove("hub-highlight"), 2200);
    }
  }

  window.focusGoldHub = focusGoldHub;
  window.closeAllPortalMenus = closeAllMenus;
})();

renderAnalytics();

/* ============================== formula bank (KaTeX Notebook Equations) ============================== */
(function formulaBank() {
  const grid = $("#formulaGrid"),
        search = $("#formulaSearch"),
        chips = $("#formulaFilters"),
        empty = $("#formulaEmpty"),
        chapSel = $("#formulaChapter"),
        moreWrap = $("#formulaMoreWrap"),
        moreBtn = $("#formulaMore");

  if (!grid) return;

  const PAGE_SIZE = 24;
  let branch = "All", shownCount = PAGE_SIZE;

  // Branch filter chips
  ["All", ...BRANCHES].forEach((b) => {
    const n = b === "All" ? DATA.formulas.length : DATA.formulas.filter((f) => f.branch === b).length;
    const chip = el("button", {
      class: "chip" + (b === "All" ? " active" : ""),
      "aria-pressed": String(b === "All"),
      "data-b": b,
      text: `${b} (${n})`,
      onclick: () => {
        branch = b;
        $$(".chip", chips).forEach((c) => {
          const on = c.dataset.b === b;
          c.classList.toggle("active", on);
          c.setAttribute("aria-pressed", String(on));
        });
        updateChapters();
        shownCount = PAGE_SIZE;
        render();
      }
    });
    chips.append(chip);
  });

  // Populate chapter filter
  function updateChapters() {
    if (!chapSel) return;
    const curVal = chapSel.value;
    const available = DATA.formulas.filter((f) => branch === "All" || f.branch === branch);
    const chs = Array.from(new Set(available.map((f) => f.chapter))).sort((a, b) => a.localeCompare(b));
    chapSel.innerHTML = "";
    chapSel.append(el("option", { value: "All", text: `All chapters (${available.length})` }));
    chs.forEach((ch) => {
      const cnt = available.filter((f) => f.chapter === ch).length;
      chapSel.append(el("option", { value: ch, text: `${ch} (${cnt})` }));
    });
    if (chs.includes(curVal)) {
      chapSel.value = curVal;
    } else {
      chapSel.value = "All";
    }
  }

  if (chapSel) {
    chapSel.addEventListener("change", () => {
      shownCount = PAGE_SIZE;
      render();
    });
  }

  // Copy LaTeX code with visual feedback
  function copyLatex(latex, btn) {
    const orig = btn ? btn.innerHTML : "Copy LaTeX";
    copyTextSafe(latex, btn, "✓ Copied!", orig);
  }

  function createFormulaCard(f, idx) {
    const card = el("article", { class: "formula-card", "data-branch": f.branch.toLowerCase() });
    card.style.setProperty("--i", String(idx));

    // 1. Header (Branch pill, Chapter, Equation Title)
    const header = el("div", { class: "formula-card-header" });
    const metaRow = el("div", { class: "formula-meta-row" });
    const badgeGroup = el("div", { class: "formula-badge-group" });
    const branchPill = el("span", {
      class: `formula-branch-pill ${f.branch.toLowerCase()}`,
      text: f.branch
    });
    const chapTag = el("span", { class: "formula-chapter-tag", text: f.chapter });
    badgeGroup.append(branchPill, chapTag);

    const eqNum = el("span", { class: "formula-eq-num", text: `EQ #${String(idx + 1).padStart(3, "0")}` });
    metaRow.append(badgeGroup, eqNum);

    const title = el("h4", { class: "formula-title", text: f.title });
    header.append(metaRow, title);
    card.append(header);

    // 2. LaTeX Equation Display Block
    const equationBlock = el("div", { class: "formula-equation-box" });

    // Equation top bar (TeX stamp, copy button)
    const topBar = el("div", { class: "formula-equation-topbar" });
    const label = el("div", { class: "formula-equation-label" });
    const texStamp = el("span", { class: "formula-tex-stamp", text: "TeX FORMULA" });
    label.append(texStamp);

    const copyBtn = el("button", {
      class: "formula-copy-tex-btn",
      type: "button",
      title: "Copy LaTeX formula code",
      text: "📋 Copy LaTeX",
      onclick: (e) => {
        e.stopPropagation();
        copyLatex(f.latex || f.expr, copyBtn);
      }
    });
    topBar.append(label, copyBtn);
    equationBlock.append(topBar);

    // KaTeX Viewport
    const katexViewport = el("div", {
      class: "formula-katex-viewport",
      tabindex: "0",
      role: "region",
      "aria-label": `Scrollable mathematical formula: ${f.title}`
    });
    katexViewport.innerHTML = renderKatex(f.latex || f.expr, true);
    equationBlock.append(katexViewport);
    if (f.chemfig && window.NemoChemFig) {
      const cfHtml = window.NemoChemFig.renderHtml(f.chemfig, {
        title: f.title,
        renderLatex: (tex, d) => renderPureLatex(String(tex || "").trim(), d)
      });
      if (cfHtml) {
        const cfWrap = el("div", { class: "formula-chemfig-wrap" });
        cfWrap.innerHTML = cfHtml;
        equationBlock.append(cfWrap);
      }
    }
    makeScrollableByDrag(katexViewport);
    setTimeout(() => {
      if (katexViewport.scrollWidth > katexViewport.clientWidth + 2) {
        katexViewport.classList.add("has-overflow");
      }
    }, 50);

    card.append(equationBlock);

    // 3. Breakdown / Symbols & Notes
    const breakdown = el("div", { class: "formula-breakdown" });

    if (Array.isArray(f.symbols) && f.symbols.length > 0) {
      const symTitle = el("div", { class: "formula-breakdown-title", text: "Where:" });
      const symList = el("ul", { class: "formula-symbols-list" });
      f.symbols.forEach((sym) => {
        const item = el("li", { class: "formula-symbol-item" });
        const bullet = el("span", { class: "formula-symbol-bullet", text: "›" });
        const textSpan = el("span", { class: "formula-symbol-text" });
        const colonIdx = sym.indexOf(":");
        if (colonIdx > 0 && colonIdx < 35) {
          const varName = sym.slice(0, colonIdx).trim();
          const varDef = sym.slice(colonIdx + 1).trim();
          const boldVar = el("strong", { text: varName });
          textSpan.append(boldVar, document.createTextNode(": " + varDef));
        } else {
          textSpan.textContent = sym;
        }
        item.append(bullet, textSpan);
        symList.append(item);
      });
      breakdown.append(symTitle, symList);
    }

    if (Array.isArray(f.notes) && f.notes.length > 0) {
      const noteBox = el("div", { class: "formula-note-box" });
      const icon = el("span", { class: "formula-note-icon", text: "📌" });
      const noteText = el("span", { class: "formula-note-text", text: f.notes[0] });
      noteBox.append(icon, noteText);
      breakdown.append(noteBox);
    }

    card.append(breakdown);

    // 4. Action Button (Explain / Derive in Nemo Chat)
    const actions = el("div", { class: "formula-card-actions" });
    const explainBtn = el("button", {
      class: "formula-action-btn",
      type: "button",
      title: "Ask Nemo to explain this formula with derivations and examples",
      onclick: () => {
        if (typeof window.ensurePanelVisible === "function") {
          window.ensurePanelVisible("chatPanel");
        }
        $("#chatPanel").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        askNemo(`Explain the formula "${f.title}" (${f.expr}): define every variable, derive it from first principles if applicable, and show a step-by-step worked JEE/CBSE example problem.`, { topic: f.id });
      }
    });
    explainBtn.innerHTML = "✦ Explain &amp; Derive in Chat";
    actions.append(explainBtn);
    card.append(actions);

    return card;
  }

  function render() {
    const term = search.value.trim().toLowerCase();
    const selChapter = chapSel ? chapSel.value : "All";
    grid.innerHTML = "";

    const list = DATA.formulas.filter((f) => {
      const matchBranch = branch === "All" || f.branch === branch;
      const matchChapter = selChapter === "All" || f.chapter === selChapter;
      const matchSearch = !term || [f.title, f.chapter, f.expr, f.latex, ...(f.keys || []), ...(f.symbols || [])].join(" ").toLowerCase().includes(term);
      return matchBranch && matchChapter && matchSearch;
    });

    const toShow = term ? list : list.slice(0, shownCount);
    const frag = document.createDocumentFragment();
    toShow.forEach((f, i) => {
      frag.append(createFormulaCard(f, i));
    });
    grid.append(frag);

    empty.hidden = list.length > 0;

    if (moreWrap) {
      moreWrap.hidden = term.length > 0 || shownCount >= list.length;
      if (moreBtn) {
        const remaining = Math.max(0, list.length - shownCount);
        moreBtn.textContent = `Show more formulas (${remaining} remaining)`;
      }
    }
  }

  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      shownCount += PAGE_SIZE;
      render();
    });
  }

  search.addEventListener("input", () => {
    shownCount = PAGE_SIZE;
    render();
  });

  updateChapters();
  render();

  // If KaTeX finished loading asynchronously after DOM ready, re-typeset formulas & any fallback blocks
  window.addEventListener("load", () => {
    if (typeof window.katex === "undefined") return;
    if (!grid.querySelector(".katex")) {
      render();
    }
    try {
      document.querySelectorAll("#messages .bubble .latex-inline, #messages .bubble .latex-block, #quizBody .latex-fallback, #pyqBody .latex-fallback").forEach((codeEl) => {
        const rawTex = codeEl.textContent || "";
        const isDisp = codeEl.classList.contains("latex-block");
        const rendered = renderLatex(rawTex, isDisp);
        if (rendered && rendered.includes("katex")) {
          const span = document.createElement(isDisp ? "div" : "span");
          span.innerHTML = rendered;
          if (span.firstChild) codeEl.replaceWith(span.firstChild);
        }
      });
    } catch (_) {}
  });
})();

/* ============================== rules & exceptions library ============================== */
(function libraryPanel() {
  const list = $("#libList"), search = $("#libSearch"), chips = $("#libBranch"), typeSel = $("#libType"), levelSel = $("#libLevel"), chapSel = $("#libChapter"),
    count = $("#libCount"), more = $("#libMore"), empty = $("#libEmpty");
  if (!list) return;

  const browseView = $("#libBrowseView"), flashView = $("#libFlashView"),
    browseBtn = $("#libBrowseBtn"), flashBtn = $("#libFlashBtn");
  const focusBtns = $$(".lib-fc-focus-btn", $("#fcFocusGroup") || document),
    onlyUnmasteredBtn = $("#fcOnlyUnmastered"), shuffleBtn = $("#fcShuffle"), resetBtn = $("#fcReset"),
    progressBar = $("#fcProgressBar"), progressFill = $("#fcProgressFill"), statusText = $("#fcStatusText"),
    emptyDeck = $("#fcEmptyDeck"), emptyTitle = $("#fcEmptyTitle"), emptyDesc = $("#fcEmptyDesc"),
    showAllFilterBtn = $("#fcShowAllFilterBtn"), backToBrowseBtn = $("#fcBackToBrowseBtn"),
    summaryView = $("#fcSummaryView"), summaryKicker = $("#fcSummaryKicker"), summaryTitle = $("#fcSummaryTitle"),
    sumGotIt = $("#fcSumGotIt"), sumAgain = $("#fcSumAgain"), sumMastered = $("#fcSumMastered"),
    practiceMissedBtn = $("#fcPracticeMissedBtn"), restartDeckBtn = $("#fcRestartDeckBtn"), summaryBrowseBtn = $("#fcSummaryBrowseBtn"),
    stage = $("#fcStage"), cardEl = $("#fcCard"), frontFace = $("#fcFrontFace"), backFace = $("#fcBackFace"),
    frontMeta = $("#fcFrontMeta"), frontState = $("#fcFrontState"), promptKicker = $("#fcPromptKicker"),
    promptQ = $("#fcPromptQ"), frontTitle = $("#fcFrontTitle"), frontSub = $("#fcFrontSub"),
    hintWrap = $("#fcHintWrap"), hintBtn = $("#fcHintBtn"), hintBox = $("#fcHintBox"),
    backMeta = $("#fcBackMeta"), backTitle = $("#fcBackTitle"), backBody = $("#fcBackBody"),
    flipBackBtn = $("#fcFlipBackBtn"), askNemoBtn = $("#fcAskNemoBtn"),
    prevBtn = $("#fcPrevBtn"), nextBtn = $("#fcNextBtn"), flipBtn = $("#fcFlipBtn"),
    againBtn = $("#fcAgainBtn"), gotItBtn = $("#fcGotItBtn");

  const PAGE = 24;
  const FC_STORE_KEY = "nemo.lib.flashcards.v1";
  let branch = "All", shown = PAGE;
  let libMode = "browse";
  let fcFocus = "mixed"; // "mixed" | "definition" | "exception"
  let fcOnlyUnmastered = false;
  let fcFlipped = false;
  let fcHintOpen = false;
  let fcResetArmed = false;
  let fcResetTimer = null;

  const savedFc = store.get(FC_STORE_KEY, {});
  const mastery = (savedFc && typeof savedFc.mastery === "object" && savedFc.mastery && !Array.isArray(savedFc.mastery)) ? savedFc.mastery : {};
  const cardKey = (e) => `${e.n || ""}|${e.ch || ""}`;
  const hasExceptionOrTrap = (e) => Boolean((e.x && e.x.trim()) || e.t === "Exception" || e.t === "Special case");
  function saveMastery() { store.set(FC_STORE_KEY, { mastery }); }

  let session = {
    queue: [],
    idx: 0,
    gotItCount: 0,
    againKeys: new Set(),
    streak: 0,
    finished: false
  };

  const uniq = (arr) => Array.from(new Set(arr));
  const types = uniq(LIB.map((e) => e.t)).sort(), levels = ["Board", "Main", "Adv"].filter((l) => LIB.some((e) => e.l === l));
  typeSel.append(el("option", { value: "All", text: "All types" }), ...types.map((t) => el("option", { value: t, text: t })));
  levelSel.append(el("option", { value: "All", text: "All levels" }), ...levels.map((l) => el("option", { value: l, text: LEVEL_LABEL[l] })));
  ["All", ...BRANCHES].forEach((b) => {
    const n = b === "All" ? LIB.length : LIB.filter((e) => e.b === b).length;
    chips.append(el("button", { class: "chip" + (b === "All" ? " active" : ""), "aria-pressed": String(b === "All"), "data-b": b, text: `${b} (${n})`, onclick: () => {
      branch = b; $$(".chip", chips).forEach((c) => { const on = c.dataset.b === b; c.classList.toggle("active", on); c.setAttribute("aria-pressed", String(on)); });
      fillChapters(); reset();
    } }));
  });
  function fillChapters() {
    const chs = uniq(LIB.filter((e) => branch === "All" || e.b === branch).map((e) => e.ch)).sort((a, b) => a.localeCompare(b));
    chapSel.innerHTML = ""; chapSel.append(el("option", { value: "All", text: "All chapters" }), ...chs.map((c) => el("option", { value: c, text: c })));
  }
  function filtered() {
    const terms = fold(search.value).split(/\s+/).filter(Boolean);
    let rows = LIB.filter((e) => (branch === "All" || e.b === branch) && (typeSel.value === "All" || e.t === typeSel.value) && (levelSel.value === "All" || e.l === levelSel.value)
      && (chapSel.value === "All" || e.ch === chapSel.value) && terms.every((t) => e.hay.includes(t)));
    if (terms.length) {
      const sc = (e) => { const n = fold(e.n); return terms.reduce((s, t) => s + (n.includes(t) ? 3 : 1), 0); };
      rows = rows.map((e, i) => ({ e, i, s: sc(e) })).sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.e);
    }
    return rows;
  }
  const LIB_STATEMENT_HEADING = {
    Law: "Law & Mathematical Statement",
    Exception: "Core Exception Rule",
    "Special case": "Special Case Principle",
    Concept: "Core Concept & Explanation",
    Trend: "Periodic / Chemical Trend",
    Reaction: "Reaction & Mechanism",
    Rule: "Core Rule",
    Test: "Practical Test & Observations",
    Structure: "Structural Summary",
    Formula: "Key Equations & Formulas"
  };

  function renderEntryChemFigRow(cfProp) {
    if (!cfProp || !window.NemoChemFig) return null;
    const items = Array.isArray(cfProp) ? cfProp : [cfProp];
    const row = el("div", { class: "lib-chemfig-row" });
    let countAdded = 0;
    for (const item of items) {
      const expr = typeof item === "string" ? item : item && item.chemfig;
      const title = typeof item === "object" && item ? item.title : undefined;
      if (!expr) continue;
      const html = window.NemoChemFig.renderHtml(expr, {
        title,
        renderLatex: (tex, d) => renderPureLatex(String(tex || "").trim(), d)
      });
      if (html) {
        const wrap = document.createElement("div");
        wrap.innerHTML = html;
        while (wrap.firstChild) row.append(wrap.firstChild);
        countAdded++;
      }
    }
    return countAdded ? row : null;
  }

  function card(e, i) {
    const body = el("div", { class: "lib-body" });

    // 1. Primary structured statement block with KaTeX chemistry notation & parsed bullets
    const stmtSec = el("div", { class: "lib-statement" });
    stmtSec.append(el("div", { class: "lib-sec-head", text: LIB_STATEMENT_HEADING[e.t] || "Core Principle" }));
    stmtSec.append(libBuildRichContent(e.s));
    const cfRow = renderEntryChemFigRow(e.cf);
    if (cfRow) stmtSec.append(cfRow);
    body.append(stmtSec);

    // 2. Responsive callouts grid (Worked Example + Exam Trap / Exception)
    if (e.e || e.x) {
      const callouts = el("div", { class: "lib-callouts" + (e.e && e.x ? " is-two-col" : "") });
      if (e.e) {
        const exBox = el("div", { class: "lib-callout is-example" });
        exBox.append(el("div", { class: "lib-callout-head", text: "✦ Worked Example & Application" }));
        exBox.append(libBuildRichContent(e.e));
        callouts.append(exBox);
      }
      if (e.x) {
        const trapBox = el("div", { class: "lib-callout is-trap" });
        trapBox.append(el("div", { class: "lib-callout-head", text: "▲ Exam Trap & Exception Watch" }));
        trapBox.append(libBuildRichContent(e.x));
        callouts.append(trapBox);
      }
      body.append(callouts);
    }

    // 3. Attribution & Tutor footer
    const foot = el("div", { class: "lib-card-footer" });
    const originWrap = el("div", { class: "lib-origin" });
    if (e.w) {
      originWrap.append(
        el("span", { class: "lib-origin-label", text: "Attribution: " }),
        el("span", { class: "lib-origin-val", text: e.w })
      );
    } else {
      originWrap.append(el("span", { class: "lib-origin-label", text: `${e.b} · ${e.ch}` }));
    }
    const askBtn = el("button", {
      class: "outline-btn lib-ask-btn",
      type: "button",
      text: "Ask Nemo AI ↗",
      onclick: () => {
        ensurePanelVisible("chatPanel");
        $("#chatPanel").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        askNemo(`Explain "${e.n}" (${e.ch}): the rule, an example, and the exceptions or traps that JEE and board papers use.`, { topic: e.id });
      }
    });
    foot.append(originWrap, askBtn);
    body.append(foot);

    // Summary header (clean typographic metadata + KaTeX title + crisp chevron)
    const metaRow = el("span", { class: "lib-meta" },
      el("span", { class: "lib-meta-branch b-" + e.b.toLowerCase(), text: e.b }),
      el("span", { class: "lib-meta-sep", text: "·", "aria-hidden": "true" }),
      el("span", { class: "lib-meta-chap", text: e.ch }),
      el("span", { class: "lib-meta-sep", text: "·", "aria-hidden": "true" }),
      el("span", { class: "lib-meta-lvl l-" + e.l.toLowerCase(), text: LEVEL_LABEL[e.l] || e.l }),
      el("span", { class: "lib-type-tag t-" + e.t.toLowerCase().replace(/\s+/g, "-"), text: e.t })
    );

    const titleEl = el("span", { class: "lib-title" });
    titleEl.innerHTML = libFormatInlineHtml(e.n);

    const chevron = el("span", { class: "lib-chevron", "aria-hidden": "true" });
    chevron.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    const summaryHead = el("span", { class: "lib-summary-row" }, titleEl, chevron);

    return el("details", { class: "lib-card", style: "--i:" + (i % 24) },
      el("summary", {}, metaRow, summaryHead),
      body);
  }

  function getDeckPool() {
    const base = filtered();
    let pool = base;
    if (fcFocus === "exception") {
      const exc = base.filter(hasExceptionOrTrap);
      if (exc.length) pool = exc;
    }
    if (fcOnlyUnmastered) {
      pool = pool.filter((e) => mastery[cardKey(e)] !== "mastered");
    }
    return { base, pool };
  }

  function promptTypeForEntry(e, idx) {
    if (fcFocus === "exception") return hasExceptionOrTrap(e) ? "exception" : "definition";
    if (fcFocus === "definition") return "definition";
    if (hasExceptionOrTrap(e) && idx % 2 === 1) return "exception";
    return "definition";
  }

  function buildSessionDeck(doShuffle = false, customEntries = null) {
    const { base, pool } = getDeckPool();
    const raw = customEntries ? customEntries.slice() : pool.slice();
    const entries = doShuffle ? shuffle(raw) : raw;
    session = {
      queue: entries.map((entry, i) => ({ entry, promptType: promptTypeForEntry(entry, i) })),
      idx: 0,
      gotItCount: 0,
      againKeys: new Set(),
      streak: 0,
      finished: false
    };
    fcFlipped = false;
    fcHintOpen = false;
    renderFlashcardView(base);
  }

  function setFlipped(next) {
    fcFlipped = Boolean(next);
    if (cardEl) cardEl.classList.toggle("is-flipped", fcFlipped);
    if (frontFace) frontFace.setAttribute("aria-hidden", String(fcFlipped));
    if (backFace) backFace.setAttribute("aria-hidden", String(!fcFlipped));
    if (flipBtn) flipBtn.textContent = fcFlipped ? "↺ Show Question" : "Flip Card";
    if (backBody && fcFlipped) backBody.scrollTop = 0;
  }

  function appendBackSection(label, text, kind = "rule") {
    if (!text) return;
    const sec = el("div", { class: "lib-fc-section is-" + kind + (kind === "trap" ? " is-trap" : "") });
    sec.append(el("span", { class: "lib-fc-section-label", text: label }));
    sec.append(libBuildRichContent(text));
    backBody.append(sec);
  }

  function updateUnmasteredLabel(baseRows) {
    if (!onlyUnmasteredBtn) return;
    const basePool = fcFocus === "exception" && baseRows.some(hasExceptionOrTrap)
      ? baseRows.filter(hasExceptionOrTrap)
      : baseRows;
    const rem = basePool.filter((e) => mastery[cardKey(e)] !== "mastered").length;
    onlyUnmasteredBtn.textContent = `Unmastered Only (${rem})`;
    onlyUnmasteredBtn.classList.toggle("active", fcOnlyUnmastered);
    onlyUnmasteredBtn.setAttribute("aria-pressed", String(fcOnlyUnmastered));
  }

  function renderFlashcardView(baseOverride = null) {
    if (!flashView || libMode !== "flashcards") return;
    const base = baseOverride || filtered();
    const masteredTotal = base.filter((e) => mastery[cardKey(e)] === "mastered").length;
    updateUnmasteredLabel(base);
    if (count) {
      count.textContent = base.length
        ? `${base.length} matching flashcards · ${masteredTotal} mastered`
        : "0 matching flashcards";
    }

    const total = session.queue.length;
    if (!total) {
      stage.hidden = true;
      summaryView.hidden = true;
      emptyDeck.hidden = false;
      const hasAnyBase = base.length > 0;
      if (hasAnyBase && fcOnlyUnmastered) {
        emptyTitle.textContent = "All matching flashcards mastered!";
        emptyDesc.textContent = `You have mastered all ${base.length} matching cards in this filter.`;
        showAllFilterBtn.hidden = false;
      } else {
        emptyTitle.textContent = "No matching flashcards";
        emptyDesc.textContent = "Try clearing your search or widening the branch, chapter, type, or level filter.";
        showAllFilterBtn.hidden = true;
      }
      progressFill.style.width = hasAnyBase && fcOnlyUnmastered ? "100%" : "0%";
      progressBar.setAttribute("aria-valuenow", hasAnyBase && fcOnlyUnmastered ? "100" : "0");
      statusText.textContent = `0 active cards · Mastered ${masteredTotal} of ${base.length} matching`;
      return;
    }

    emptyDeck.hidden = true;

    if (session.finished || session.idx >= total) {
      stage.hidden = true;
      summaryView.hidden = false;
      const missedCount = session.againKeys.size;
      summaryKicker.textContent = missedCount === 0 ? "100% Recall" : "Session Complete";
      summaryTitle.textContent = missedCount === 0 ? "Clean sweep on this deck!" : "Deck reviewed — keep reinforcing weak traps";
      sumGotIt.textContent = String(session.gotItCount);
      sumAgain.textContent = String(missedCount);
      sumMastered.textContent = `${masteredTotal}/${base.length}`;
      if (missedCount > 0) {
        practiceMissedBtn.hidden = false;
        practiceMissedBtn.textContent = `Review Missed Cards (${missedCount})`;
      } else {
        practiceMissedBtn.hidden = true;
      }
      progressFill.style.width = "100%";
      progressBar.setAttribute("aria-valuenow", "100");
      statusText.textContent = `Session complete · ${session.gotItCount} got it · ${missedCount} need review · Mastered ${masteredTotal}/${base.length}`;
      return;
    }

    summaryView.hidden = true;
    stage.hidden = false;

    const item = session.queue[session.idx];
    const e = item.entry;
    const isTrapPrompt = item.promptType === "exception";
    const key = cardKey(e);
    const state = mastery[key] || "new";
    const pct = Math.round(((session.idx + 1) / total) * 100);

    progressFill.style.width = pct + "%";
    progressBar.setAttribute("aria-valuenow", String(pct));
    statusText.textContent = `Card ${session.idx + 1} of ${total} · Mastered ${masteredTotal}/${base.length} · Streak ${session.streak}`;

    const metaText = `${e.b} · ${e.ch} · ${e.t} · ${LEVEL_LABEL[e.l] || e.l}`;
    frontMeta.textContent = metaText;
    backMeta.textContent = metaText;

    frontState.className = "lib-fc-state " + (state === "mastered" ? "is-mastered" : state === "review" ? "is-review" : "is-new");
    frontState.textContent = state === "mastered" ? "✓ Mastered" : state === "review" ? "↺ Needs Review" : "● New Card";

    promptKicker.className = "lib-fc-kicker" + (isTrapPrompt ? " is-trap" : "");
    promptKicker.textContent = isTrapPrompt ? "▲ Exception & Trap Recall" : "Definition & Rule Recall";
    promptQ.textContent = isTrapPrompt
      ? (e.x ? "What is the key exception or exam trap for:" : "Explain this special case / exception:")
      : `State the chemical ${String(e.t || "rule").toLowerCase()} / definition for:`;

    frontTitle.innerHTML = libFormatInlineHtml(e.n);
    backTitle.innerHTML = libFormatInlineHtml(e.n);

    if (e.w) {
      frontSub.hidden = false;
      frontSub.textContent = `Origin / attribution: ${e.w}`;
    } else {
      frontSub.hidden = true;
      frontSub.textContent = "";
    }

    if (isTrapPrompt && e.s && e.x) {
      hintWrap.hidden = false;
      hintBox.hidden = !fcHintOpen;
      hintBox.innerHTML = "";
      hintBox.append(libBuildRichContent(e.s));
      hintBtn.setAttribute("aria-expanded", String(fcHintOpen));
      hintBtn.textContent = fcHintOpen ? "Hide Rule Hint" : "Show Rule Hint";
    } else {
      hintWrap.hidden = true;
      hintBox.hidden = true;
    }

    backBody.innerHTML = "";
    if (isTrapPrompt) {
      appendBackSection("▲ Exam Trap & Exception", e.x || e.s, "trap");
      if (e.x && e.s) appendBackSection("Core Rule & Definition", e.s, "rule");
      if (e.e) appendBackSection("✦ Worked Example", e.e, "example");
      if (e.w) appendBackSection("Attribution / Origin", e.w, "origin");
    } else {
      appendBackSection("Core Rule & Definition", e.s, "rule");
      if (e.e) appendBackSection("✦ Worked Example", e.e, "example");
      if (e.x) appendBackSection("▲ Exam Trap & Exception", e.x, "trap");
      if (e.w) appendBackSection("Attribution / Origin", e.w, "origin");
    }
    const fcCfRow = renderEntryChemFigRow(e.cf);
    if (fcCfRow) {
      const cfSec = el("div", { class: "lib-fc-section is-rule" });
      cfSec.append(el("span", { class: "lib-fc-section-label", text: "2D Skeletal Structures" }), fcCfRow);
      backBody.append(cfSec);
    }

    prevBtn.disabled = session.idx <= 0;
    nextBtn.disabled = session.idx >= total - 1;
    setFlipped(fcFlipped);
  }

  function markFlashcard(status) {
    if (session.finished || session.idx >= session.queue.length) return;
    const item = session.queue[session.idx];
    const key = cardKey(item.entry);
    mastery[key] = status;
    saveMastery();

    if (status === "review") {
      session.againKeys.add(key);
      session.streak = 0;
      const hasMoreAhead = session.idx + 1 < session.queue.length;
      const alreadyQueuedAhead = hasMoreAhead && session.queue.slice(session.idx + 1).some((qItem) => cardKey(qItem.entry) === key);
      if (hasMoreAhead && !alreadyQueuedAhead) {
        session.queue.push({ entry: item.entry, promptType: item.promptType });
      }
    } else {
      session.againKeys.delete(key);
      session.gotItCount++;
      session.streak++;
    }

    fcFlipped = false;
    fcHintOpen = false;
    if (session.idx + 1 < session.queue.length) {
      session.idx++;
    } else {
      session.finished = true;
      if (session.againKeys.size === 0 && typeof window.triggerNemoReaction === "function") {
        window.triggerNemoReaction({
          expression: "celebrate",
          icon: "⚡",
          text: "Flashcard deck complete — sharp recall!",
          badge: "Deck Mastered",
          duration: 3200
        });
      }
    }
    renderFlashcardView();
  }

  function setLibMode(nextMode) {
    libMode = nextMode === "flashcards" ? "flashcards" : "browse";
    const isFlash = libMode === "flashcards";
    if (browseView) browseView.hidden = isFlash;
    if (flashView) flashView.hidden = !isFlash;
    if (browseBtn) {
      browseBtn.classList.toggle("active", !isFlash);
      browseBtn.setAttribute("aria-pressed", String(!isFlash));
    }
    if (flashBtn) {
      flashBtn.classList.toggle("active", isFlash);
      flashBtn.setAttribute("aria-pressed", String(isFlash));
    }
    if (isFlash) {
      buildSessionDeck(false);
    } else {
      render();
    }
  }

  function render() {
    const rows = filtered();
    count.textContent = rows.length
      ? (libMode === "flashcards"
          ? `${rows.length} matching entries`
          : `Showing ${Math.min(shown, rows.length)} of ${rows.length} entries`)
      : "";
    if (libMode === "flashcards") {
      renderFlashcardView(rows);
      return;
    }
    list.innerHTML = "";
    rows.slice(0, shown).forEach((e, i) => list.append(card(e, i)));
    more.hidden = rows.length <= shown; empty.hidden = rows.length > 0;
  }

  function reset() {
    shown = PAGE;
    if (libMode === "flashcards") {
      const rows = filtered();
      count.textContent = rows.length ? `${rows.length} matching entries` : "";
      buildSessionDeck(false);
    } else {
      render();
    }
  }

  if (browseBtn) browseBtn.addEventListener("click", () => setLibMode("browse"));
  if (flashBtn) flashBtn.addEventListener("click", () => setLibMode("flashcards"));
  if (backToBrowseBtn) backToBrowseBtn.addEventListener("click", () => setLibMode("browse"));
  if (summaryBrowseBtn) summaryBrowseBtn.addEventListener("click", () => setLibMode("browse"));

  focusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      fcFocus = btn.dataset.focus || "mixed";
      focusBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      buildSessionDeck(false);
    });
  });

  if (onlyUnmasteredBtn) {
    onlyUnmasteredBtn.addEventListener("click", () => {
      fcOnlyUnmastered = !fcOnlyUnmastered;
      buildSessionDeck(false);
    });
  }
  if (showAllFilterBtn) {
    showAllFilterBtn.addEventListener("click", () => {
      fcOnlyUnmastered = false;
      buildSessionDeck(false);
    });
  }
  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => buildSessionDeck(true));
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!fcResetArmed) {
        fcResetArmed = true;
        resetBtn.textContent = "Confirm Reset?";
        clearTimeout(fcResetTimer);
        fcResetTimer = setTimeout(() => {
          fcResetArmed = false;
          resetBtn.textContent = "Reset Progress";
        }, 3500);
        return;
      }
      clearTimeout(fcResetTimer);
      fcResetArmed = false;
      resetBtn.textContent = "Reset Progress";
      Object.keys(mastery).forEach((k) => delete mastery[k]);
      saveMastery();
      fcOnlyUnmastered = false;
      buildSessionDeck(false);
    });
  }

  if (cardEl) {
    cardEl.addEventListener("click", (ev) => {
      if (ev.target.closest("button, a, select, input")) return;
      const sel = window.getSelection ? String(window.getSelection()) : "";
      if (sel.length > 0) return;
      setFlipped(!fcFlipped);
    });
    cardEl.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        if (ev.target.closest("button, a")) return;
        ev.preventDefault();
        setFlipped(!fcFlipped);
      }
    });
  }
  if (flipBtn) flipBtn.addEventListener("click", () => setFlipped(!fcFlipped));
  if (flipBackBtn) flipBackBtn.addEventListener("click", (ev) => { ev.stopPropagation(); setFlipped(false); });
  if (hintBtn) {
    hintBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      fcHintOpen = !fcHintOpen;
      renderFlashcardView();
    });
  }
  if (askNemoBtn) {
    askNemoBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const item = session.queue[session.idx];
      if (!item) return;
      const e = item.entry;
      ensurePanelVisible("chatPanel");
      $("#chatPanel").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      askNemo(`Explain "${e.n}" (${e.ch}): the rule, an example, and the exceptions or traps that JEE and board papers use.`, { topic: e.id });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (session.idx > 0) {
        session.idx--;
        fcFlipped = false;
        fcHintOpen = false;
        renderFlashcardView();
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (session.idx + 1 < session.queue.length) {
        session.idx++;
        fcFlipped = false;
        fcHintOpen = false;
        renderFlashcardView();
      }
    });
  }
  if (againBtn) againBtn.addEventListener("click", () => markFlashcard("review"));
  if (gotItBtn) gotItBtn.addEventListener("click", () => markFlashcard("mastered"));
  if (restartDeckBtn) restartDeckBtn.addEventListener("click", () => buildSessionDeck(false));
  if (practiceMissedBtn) {
    practiceMissedBtn.addEventListener("click", () => {
      const missed = filtered().filter((e) => session.againKeys.has(cardKey(e)));
      if (missed.length) buildSessionDeck(true, missed);
      else buildSessionDeck(false);
    });
  }

  document.addEventListener("keydown", (ev) => {
    if (ev.repeat || ev.isComposing || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (libMode !== "flashcards" || !flashView || flashView.hidden || session.finished || !session.queue.length) return;
    const panel = $("#libraryPanel");
    if (!panel || panel.style.display === "none") return;
    if (NemoOverlay.isAnyModalOpen()) return;
    const active = document.activeElement;
    if (active && (/^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName) || active.isContentEditable)) return;
    const libraryFocused = (active && panel.contains(active)) || Boolean($(".ws-tab.active[data-filter='library']"));
    if (!libraryFocused) return;
    if (ev.key === " " && active !== cardEl && !(active && active.closest("button, a"))) {
      ev.preventDefault();
      setFlipped(!fcFlipped);
    } else if (ev.key === "ArrowLeft") {
      if (session.idx > 0) { ev.preventDefault(); prevBtn.click(); }
    } else if (ev.key === "ArrowRight") {
      if (session.idx + 1 < session.queue.length) { ev.preventDefault(); nextBtn.click(); }
    } else if (ev.key === "1") {
      ev.preventDefault();
      markFlashcard("review");
    } else if (ev.key === "2") {
      ev.preventDefault();
      markFlashcard("mastered");
    }
  });

  more.addEventListener("click", () => { shown += PAGE; render(); });
  [typeSel, levelSel].forEach((s) => s.addEventListener("change", reset));
  chapSel.addEventListener("change", reset);
  search.addEventListener("input", reset);
  fillChapters(); render();
  if (!LIB.length) { empty.hidden = false; empty.textContent = "Library data failed to load (lib-*.js files missing)."; }
})();

/* ============================== PYQ bank (user-imported questions, real analytics) ============================== */
/* No official question text ships with Nemo. You import questions you have from the official papers
   (jeeadv.ac.in/archive.html, jeemain.nta.nic.in); everything below is computed from what you import. */
const PYQ = (function pyqBank() {
  const KEY = "nemo.pyq.v1", PROG = "nemo.pyq.prog.v1", MAX_Q = 2000, MAX_BYTES = 2200000;
  const EXAMS = ["JEE Main", "JEE Advanced", "Board", "Other"];
  const EXAM_ALIAS = { main: "JEE Main", mains: "JEE Main", "jee main": "JEE Main", "jee mains": "JEE Main", "jee-main": "JEE Main", adv: "JEE Advanced", advanced: "JEE Advanced", "jee advanced": "JEE Advanced", "jee adv": "JEE Advanced",
    board: "Board", cbse: "Board", boards: "Board", "cbse board": "Board", "cbse class 12": "Board", "board exam": "Board", other: "Other" };
  const TYPE_ALIAS = { mcq: "mcq", single: "mcq", "single correct": "mcq", msq: "msq", multiple: "msq", "multiple correct": "msq", mcma: "msq", num: "num", numerical: "num", integer: "num", numeric: "num" };
  const TYPE_LABEL = { mcq: "Single correct", msq: "One or more correct", num: "Numerical" };
  const LETTERS = "ABCDEF";
  const COLS = ["exam", "year", "branch", "chapter", "type", "question", "optionA", "optionB", "optionC", "optionD", "optionE", "optionF", "answer", "tolerance", "explanation", "source"];
  const bundled = (window.NEMO_PYQ || []);
  let mine = store.get(KEY, []); if (!Array.isArray(mine)) mine = [];
  let prog = store.get(PROG, {}); if (!prog || typeof prog !== "object" || Array.isArray(prog)) prog = {};
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
  const normText = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();
  const keyOf = (q) => hash([q.exam, q.year, normText(q.q)].join("|"));

  /* ---- validation: returns { q } or { err } ---- */
  function validate(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { err: "not an object" };
    const str = (v) => (v == null ? "" : String(v).trim());
    const exam = EXAM_ALIAS[str(raw.exam).toLowerCase()] || (EXAMS.includes(str(raw.exam)) ? str(raw.exam) : null);
    if (!exam) return { err: "exam must be JEE Main, JEE Advanced, Board or Other" };
    const year = Number(str(raw.year)); if (!Number.isInteger(year) || year < 1978 || year > 2035) return { err: "year must be a whole number between 1978 and 2035" };
    const branch = BRANCHES.find((b) => b.toLowerCase() === str(raw.branch).toLowerCase()); if (!branch) return { err: "branch must be Physical, Inorganic or Organic" };
    const chapter = str(raw.chapter); if (chapter.length < 2 || chapter.length > 80) return { err: "chapter needs 2–80 characters" };
    const type = TYPE_ALIAS[str(raw.type).toLowerCase()]; if (!type) return { err: "type must be mcq, msq or num" };
    const text = str(raw.q != null ? raw.q : raw.question);
    if (text.length < 5 || text.length > 2000) return { err: "question text needs 5–2000 characters" };
    if (/^placeholder/i.test(text)) return { err: "template placeholder skipped" };
    const out = { exam, year, branch, chapter, type, q: text };
    if (type === "num") {
      const a = Number(str(raw.answer)); if (!str(raw.answer) || !Number.isFinite(a)) return { err: "numerical answer must be a number" };
      out.answer = a;
      const tol = raw.tolerance != null && str(raw.tolerance) !== "" ? Number(raw.tolerance) : raw.tol != null && str(raw.tol) !== "" ? Number(raw.tol) : null;
      if (tol !== null && (!Number.isFinite(tol) || tol < 0)) return { err: "tolerance must be a number ≥ 0" };
      out.tol = tol !== null ? tol : Number.isInteger(a) ? 0 : Math.max(0.01, Math.abs(a) * 0.005);
    } else {
      let opts = Array.isArray(raw.options) ? raw.options.map(str) : LETTERS.split("").map((L) => str(raw["option" + L])).filter(Boolean);
      opts = opts.filter(Boolean);
      if (opts.length < 2 || opts.length > 6) return { err: "give 2–6 options" };
      if (opts.some((o) => o.length > 300)) return { err: "an option is longer than 300 characters" };
      out.options = opts;
      const letters = Array.isArray(raw.answer) ? raw.answer.map(str).join("") : str(raw.answer);
      if (!/^[A-Fa-f]([\s,;|]*[A-Fa-f])*$/.test(letters)) return { err: "answer must be option letters such as B or A;C (not numbers)" };
      const idx = Array.from(new Set(letters.toUpperCase().replace(/[^A-F]/g, "").split("").map((L) => LETTERS.indexOf(L)))).sort((a, b) => a - b);
      if (idx.some((i) => i >= opts.length)) return { err: "answer refers to an option that does not exist" };
      if (type === "mcq" && idx.length !== 1) return { err: "single-correct questions need exactly one answer letter" };
      out.answer = idx;
    }
    const ex = str(raw.explain != null ? raw.explain : raw.explanation); if (ex) out.explain = ex.slice(0, 1500);
    const src = str(raw.source); if (src) out.source = src.slice(0, 120);
    out.id = "y" + keyOf(out);
    return { q: out };
  }

  /* ---- CSV (RFC 4180 style) ---- */
  function parseCSV(text) {
    text = text.replace(/^﻿/, "");
    const firstLine = text.split(/\r?\n/, 1)[0] || "";
    const d = !firstLine.includes(",") && firstLine.includes("\t") ? "\t" : ",";
    const rows = []; let row = [], cell = "", inQ = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQ) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else inQ = false; } else cell += c; }
      else if (c === '"' && cell === "") inQ = true;
      else if (c === d) { row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); cell = ""; if (row.some((x) => x.trim() !== "")) rows.push(row); row = []; }
      else cell += c;
    }
    row.push(cell); if (row.some((x) => x.trim() !== "")) rows.push(row);
    if (rows.length < 2) throw new Error("CSV needs a header row and at least one question row");
    const head = rows[0].map((h) => h.trim().toLowerCase().replace(/[\s_-]+/g, ""));
    const need = ["exam", "year", "branch", "chapter", "type", "answer"];
    const qcol = head.includes("question") ? "question" : head.includes("q") ? "q" : null;
    if (!qcol || need.some((n) => !head.includes(n))) throw new Error("CSV header must include: exam, year, branch, chapter, type, question, answer (plus optionA…optionD)");
    return rows.slice(1).map((r) => { const o = {}; head.forEach((h, i) => { o[h === "q" || h === "question" ? "q" : h.replace(/^option([a-f])$/, (m, L) => "option" + L.toUpperCase())] = r[i] != null ? r[i] : ""; }); return o; });
  }
  function parseInput(text) {
    const t = text.trim(); if (!t) throw new Error("Nothing to import: paste JSON or CSV, or choose a file");
    if (t[0] === "[" || t[0] === "{") {
      let data; try { data = JSON.parse(t); } catch (e) { throw new Error("That is not valid JSON (" + e.message + ")"); }
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.questions)) return data.questions;
      return [data];
    }
    return parseCSV(t);
  }

  /* ---- bank ---- */
  const all = () => { const seen = new Set(), out = []; [...bundled.map((r) => validate(r).q).filter(Boolean), ...mine].forEach((q) => { if (!seen.has(q.id)) { seen.add(q.id); out.push(q); } }); return out; };
  function importText(text) {
    const rows = parseInput(text), good = [], errs = [];
    if (rows.length > 5000) throw new Error("That file has more than 5000 rows; split it into smaller files");
    rows.forEach((r, i) => { const v = validate(r); if (v.q) good.push(v.q); else errs.push(`row ${i + 1}: ${v.err}`); });
    const have = new Set(all().map((q) => q.id)); const fresh = []; let dup = 0;
    good.forEach((q) => { if (have.has(q.id)) dup++; else { have.add(q.id); fresh.push(q); } });
    const room = Math.max(0, MAX_Q - all().length); const take = fresh.slice(0, room);
    if (fresh.length > take.length) errs.push(`${fresh.length - take.length} question(s) not added: the bank is limited to ${MAX_Q} questions`);
    const next = mine.concat(take);
    if (JSON.stringify(next).length > MAX_BYTES) throw new Error("This would exceed the browser storage budget (about 2 MB). Nothing was imported.");
    if (take.length) { if (!store.set(KEY, next)) throw new Error("The browser refused to store the questions (storage is full or blocked). Nothing was imported."); mine = next; }
    return { added: take.length, dup, errs, total: rows.length };
  }
  function clearMine() { mine = []; store.del(KEY); prog = {}; store.del(PROG); }
  function mark(id, ok) { const p = prog[id] || { a: 0, c: 0 }; p.a++; if (ok) p.c++; p.last = ok ? 1 : 0; prog[id] = p; store.set(PROG, prog); }

  /* ---- templates and prompt ---- */
  const TEMPLATE = [
    { exam: "JEE Main", year: 2024, branch: "Physical", chapter: "Chemical kinetics", type: "mcq", q: "PLACEHOLDER: type or paste the question text from the official paper here.", options: ["option A text", "option B text", "option C text", "option D text"], answer: "B", explain: "optional: your own short explanation", source: "optional: e.g. paper date, shift and question number" },
    { exam: "JEE Advanced", year: 2023, branch: "Inorganic", chapter: "Coordination compounds", type: "msq", q: "PLACEHOLDER: a question with one or more correct options.", options: ["option A text", "option B text", "option C text", "option D text"], answer: ["A", "C"], source: "optional" },
    { exam: "JEE Main", year: 2022, branch: "Organic", chapter: "Aldehydes and ketones", type: "num", q: "PLACEHOLDER: a numerical-answer question.", answer: 12, tolerance: 0, source: "optional" }
  ];
  const csvCell = (v) => { const s = v == null ? "" : String(v); return /[",\n\r\t]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const templateCSV = () => [COLS.join(","), ...TEMPLATE.map((t) => COLS.map((c) => {
    if (c === "question") return csvCell(t.q);
    if (/^option[A-F]$/.test(c)) return csvCell((t.options || [])[LETTERS.indexOf(c.slice(-1))]);
    if (c === "answer") return csvCell(Array.isArray(t.answer) ? t.answer.join(";") : t.answer);
    if (c === "explanation") return csvCell(t.explain); return csvCell(t[c]);
  }).join(","))].join("\n");
  const PROMPT = "I am building a personal chemistry practice file from an OFFICIAL JEE paper that I will paste or attach, together with its OFFICIAL answer key.\n" +
    "Convert every chemistry question into a JSON array using exactly this schema (one object per question):\n" +
    '{"exam":"JEE Main" | "JEE Advanced","year":2024,"branch":"Physical" | "Inorganic" | "Organic","chapter":"standard chapter name","type":"mcq" | "msq" | "num","q":"question text, copied faithfully","options":["A text","B text","C text","D text"],"answer":"B" (mcq) | ["A","C"] (msq) | 12.5 (num),"tolerance":0 (num only, optional),"source":"paper date, shift, question number"}\n' +
    "Rules: copy question and option text faithfully (use Unicode subscripts such as H₂O). Take every answer ONLY from the official answer key I supply; if a question has no key entry or the key marks it as dropped or bonus, leave that question out. Do not solve questions, invent options, or guess the chapter when unsure (tell me instead). Return only the JSON array.";

  /* ---- UI ---- */
  const $q = (id) => document.getElementById(id);
  const msg = $q("pyqMsg"), area = $q("pyqText"), status = $q("pyqStatus");
  const say = (text, kind) => { msg.textContent = text; msg.className = "pyq-msg" + (kind ? " " + kind : ""); msg.hidden = !text; };
  function download(name, text, type) {
    const a = document.createElement("a"); a.download = name; a.href = URL.createObjectURL(new Blob([text], { type })); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function runImport(text) {
    try {
      const r = importText(text);
      const bits = [`Imported ${r.added} of ${r.total} row(s).`]; if (r.dup) bits.push(`${r.dup} duplicate(s) skipped.`);
      if (r.errs.length) bits.push(`Rejected ${r.errs.length}: ` + r.errs.slice(0, 5).join("; ") + (r.errs.length > 5 ? "…" : ""));
      say(bits.join(" "), r.added ? "ok" : "warn"); if (r.added) area.value = "";
    } catch (e) { say(e.message, "bad"); }
    refreshAll();
  }
  $q("pyqImport").addEventListener("click", () => runImport(area.value));
  $q("pyqFile").addEventListener("change", async (e) => {
    const f = e.target.files && e.target.files[0]; e.target.value = "";
    if (!f) return; if (f.size > 3e6) { say("That file is larger than 3 MB. Split it into smaller files.", "bad"); return; }
    try { runImport(await f.text()); } catch (_) { say("Could not read that file.", "bad"); }
  });
  $q("pyqTplJson").addEventListener("click", () => download("nemo-pyq-template.json", JSON.stringify(TEMPLATE, null, 2), "application/json"));
  $q("pyqTplCsv").addEventListener("click", () => download("nemo-pyq-template.csv", templateCSV(), "text/csv"));
  $q("pyqExport").addEventListener("click", () => { if (!mine.length) { say("You have not imported any questions yet.", "warn"); return; } download("nemo-pyq-backup.json", JSON.stringify(mine, null, 2), "application/json"); });
  (function setupPyqClear() {
    const clearBtn = $q("pyqClear");
    if (!clearBtn) return;
    let armed = false, timer = null;
    const origLabel = clearBtn.textContent || "Remove imported";
    clearBtn.addEventListener("click", () => {
      if (!mine.length) {
        say("There is nothing imported to remove.", "warn");
        return;
      }
      if (!armed) {
        armed = true;
        clearBtn.textContent = "Confirm Remove?";
        say(`Click “Confirm Remove?” again within 3.5s to remove all ${mine.length} imported question(s) and your PYQ progress.`, "warn");
        clearTimeout(timer);
        timer = setTimeout(() => {
          armed = false;
          clearBtn.textContent = origLabel;
        }, 3500);
        return;
      }
      clearTimeout(timer);
      armed = false;
      clearBtn.textContent = origLabel;
      clearMine();
      say("Removed all imported PYQ questions.", "ok");
      refreshAll();
    });
  })();
  $q("pyqPrompt").addEventListener("click", async () => {
    const ok = await copyTextSafe(PROMPT, null);
    if (!ok) { area.value = PROMPT; area.select(); }
    say(ok ? "Extraction prompt copied. Paste it into Gemini or Claude together with the official paper and answer key." : "Clipboard blocked: the prompt was placed in the box above so you can copy it.", "ok");
  });

  /* ---- practice ---- */
  const body = $q("pyqBody"), fExam = $q("pyqExam"), fYear = $q("pyqYear"), fBranch = $q("pyqBranch"), fChap = $q("pyqChapter"), fStat = $q("pyqState");
  let queue = [], cur = null, picks = new Set(), done = false, roundTotal = 0, roundDone = 0;
  const optionsOf = (sel, vals, label) => { const keep = sel.value; sel.innerHTML = ""; sel.append(el("option", { value: "All", text: label }), ...vals.map((v) => el("option", { value: String(v), text: String(v) }))); sel.value = vals.map(String).includes(keep) ? keep : "All"; };
  function fillFilters() {
    const q = all();
    optionsOf(fExam, EXAMS.filter((e) => q.some((x) => x.exam === e)), "All exams");
    optionsOf(fYear, Array.from(new Set(q.map((x) => x.year))).sort((a, b) => b - a), "All years");
    optionsOf(fChap, Array.from(new Set(q.filter((x) => fBranch.value === "All" || x.branch === fBranch.value).map((x) => x.chapter))).sort((a, b) => a.localeCompare(b)), "All chapters");
  }
  const pool = () => all().filter((q) => (fExam.value === "All" || q.exam === fExam.value) && (fYear.value === "All" || String(q.year) === fYear.value) && (fBranch.value === "All" || q.branch === fBranch.value)
    && (fChap.value === "All" || q.chapter === fChap.value)
    && (fStat.value === "All" || (fStat.value === "new" ? !prog[q.id] : prog[q.id] && prog[q.id].last === 0)));
  function start() {
    const p = pool(); queue = shuffle(p.map((q) => q.id)); roundTotal = queue.length; roundDone = 0; cur = null; next(true);
  }
  function next(first) {
    body.innerHTML = "";
    const lib = all();
    if (!lib.length) { body.append(el("p", { class: "small-muted", text: "No questions currently loaded. Import questions above or refresh to reload the 10-year official archive." })); return; }
    if (!queue.length) {
      body.append(el("p", { class: "small-muted", text: first ? "No questions match these filters." : `Round finished: ${roundDone} question(s). Change a filter or press “Start / restart” for another round.` })); return;
    }
    const nextId = queue.shift(); cur = lib.find((q) => q.id === nextId); picks = new Set(); done = false; if (!cur) { next(); return; }
    render();
  }
  const fmtAns = (q) => q.type === "num" ? String(q.answer) + (q.tol ? ` (±${+q.tol.toFixed(4)})` : "") : q.answer.map((i) => LETTERS[i]).join(", ");
  function render(result) {
    body.innerHTML = "";
    body.append(el("div", { class: "quiz-meta" }, el("span", { text: cur.exam + " " + cur.year }), el("span", { text: cur.chapter }), el("span", { text: TYPE_LABEL[cur.type] }),
      el("span", { text: `Question ${Math.min(roundDone + (done ? 0 : 1), roundTotal)} of ${roundTotal}` })));
    const qPara = el("p", { class: "quiz-q" });
    qPara.innerHTML = formatMathText(cur.q);
    body.append(qPara);
    if (cur.type === "num") {
      const inp = el("input", { type: "text", inputmode: "decimal", id: "pyqNum", class: "num-input", "aria-label": "Your numerical answer", autocomplete: "off", disabled: done });
      if (done) inp.value = result.typed;
      const chk = el("button", { class: "primary", text: "Check", disabled: done, onclick: () => submit() });
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } });
      body.append(el("div", { class: "num-row" }, inp, chk));
    } else {
      const opts = el("div", { class: "opts", role: "group", "aria-label": "Answer options" });
      cur.options.forEach((t, i) => {
        let cls = ""; if (done) cls = cur.answer.includes(i) ? " correct" : picks.has(i) ? " wrong" : ""; else if (picks.has(i)) cls = " picked";
        const optBtn = el("button", { class: "opt" + cls, disabled: done, "aria-pressed": cur.type === "msq" ? String(picks.has(i)) : null, onclick: () => pick(i) });
        const letterBadge = el("b", { text: LETTERS[i] });
        const textSpan = el("span", {});
        textSpan.innerHTML = formatMathText(t);
        optBtn.append(letterBadge, textSpan);
        opts.append(optBtn);
      });
      body.append(opts);
      if (cur.type === "msq" && !done) body.append(el("div", { class: "btn-row" }, el("button", { class: "primary", text: "Submit answer", onclick: () => submit() })));
    }
    if (done) {
      const fb = el("div", { class: "feedback", role: "status" });
      const statStrong = el("strong", { class: result.ok ? "ok" : "no", text: result.ok ? "Correct! " : "Not quite. " });
      const expSpan = el("span", {});
      expSpan.innerHTML = `Official answer: <b>${fmtAns(cur)}</b>. ` + (cur.explain ? formatMathText(cur.explain) + " " : "") + (cur.source ? `<span class="source-tag">[${esc(cur.source)}]</span>` : "");
      fb.append(statStrong, expSpan);
      body.append(fb);
      body.append(el("div", { class: "btn-row" }, el("button", { class: "primary", text: "Next question →", onclick: () => next() })));
      const nb = $(".btn-row .primary", body); if (nb) nb.focus({ preventScroll: true });
    }
  }
  function pick(i) {
    if (done) return;
    if (cur.type === "mcq") { picks = new Set([i]); submit(); } else { picks.has(i) ? picks.delete(i) : picks.add(i); render(); }
  }
  function submit() {
    if (done || !cur) return;
    let ok, typed = "";
    if (cur.type === "num") {
      const numEl = $q("pyqNum");
      typed = ((numEl && numEl.value) || "").trim(); const v = Number(typed.replace(",", ".")); if (!typed || !Number.isFinite(v)) { say("Enter a number first.", "warn"); return; }
      ok = Math.abs(v - cur.answer) <= (cur.tol || 0) + 1e-9;
    } else {
      if (!picks.size) { say("Choose an option first.", "warn"); return; }
      const a = Array.from(picks).sort((x, y) => x - y); ok = a.length === cur.answer.length && a.every((v, i) => v === cur.answer[i]);
    }
    say(""); done = true; roundDone++; mark(cur.id, ok); recordAttempt({ branch: cur.branch, chapter: cur.chapter }, ok); render({ ok, typed }); renderTable();

    if (typeof triggerNemoReaction === "function") {
      if (ok) {
        const examName = cur.exam || "PYQ";
        triggerNemoReaction({
          expression: "celebrate",
          icon: "🏆",
          text: `${examName} Cracked! Ranker-level reasoning! 🚀`,
          badge: "Ranker!",
          duration: 3600,
          chime: "celebrate"
        });
      } else {
        triggerNemoReaction({
          expression: "oops",
          icon: "⚠️",
          text: "Exam trap spotted! Check official step breakdown",
          badge: "Exam Trap!",
          duration: 3600,
          chime: "incorrect"
        });
      }
    }
  }

  if (body) {
    body.addEventListener("keydown", (e) => {
      if (e.repeat || e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (NemoOverlay.isAnyModalOpen()) return;
      if (e.target && e.target.tagName === "INPUT") return;
      if (cur && (cur.type === "mcq" || cur.type === "msq")) {
        const n = "1234".indexOf(e.key) >= 0 ? +e.key - 1 : "abcd".indexOf(e.key.toLowerCase());
        if (!done && n >= 0 && n < cur.options.length && e.key.length === 1) {
          e.preventDefault();
          pick(n);
        }
      }
      if (done && (e.key === "Enter" || e.key === " " || e.key === "ArrowRight")) {
        if ((e.key === "Enter" || e.key === " ") && e.target && e.target.closest("button:not(.opt), a, input, select, textarea")) return;
        e.preventDefault();
        next();
      }
    });
  }

  [fExam, fYear, fChap, fStat].forEach((s) => s.addEventListener("change", start));
  fBranch.addEventListener("change", () => { fillFilters(); start(); });
  $q("pyqStart").addEventListener("click", start);

  /* ---- PYQ pattern infographics, ROI matrix, topic spotlight & heatmap ---- */
  const tableHost = $q("pyqTable"), tExam = $q("pyqTableExam"), insight = $q("pyqInsight"), caution = $q("pyqCaution"), showAll = $q("pyqShowAll");
  const anaExamBar = $q("pyqAnaExamBar"), anaBranchBar = $q("pyqAnaBranchBar");
  const anaTierBar = $q("pyqAnaTierBar"), anaSearchInput = $q("pyqAnaSearch");
  const kpiStrip = $q("pyqKpiStrip"), yearChartHost = $q("pyqYearChart"), yearChartNote = $q("pyqYearChartNote");
  const roiMatrixHost = $q("pyqRoiMatrix"), topicSpotHost = $q("pyqTopicSpotlight");
  const jumpAnaBtn = $q("pyqJumpAnalyticsBtn"), anaPracticeBtn = $q("pyqAnalyticsPracticeBtn");

  const PYQ_CHAPTER_META = {
    "Solutions": {
      cls: "XII", effort: 2,
      boardFocus: "High-scoring Class 12 core (approx. 7 marks). Direct numericals on molarity/molality, Raoult's law deviations, and abnormal molar mass.",
      jeeFocus: "1–2 guaranteed questions across Main shifts & Advanced. Expect multi-concept links combining van't Hoff factor $i$ with weak electrolyte equilibria.",
      hotTopics: ["Colligative Props ($\\Delta T_b, \\Delta T_f, \\Pi$)", "van't Hoff Factor ($i = 1 + (n-1)\\alpha$)", "Raoult's Law & Azeotropes", "Henry's Law ($p = K_H x$)"],
      trap: "Watch unit swaps in $\\Pi = CRT$ ($\\text{L}\\cdot\\text{atm}$ vs Pa) and use dimer factor $i = 1 - \\alpha/2$ for benzoic acid in benzene."
    },
    "Electrochemistry": {
      cls: "XII", effort: 4,
      boardFocus: "Heavyweight Class 12 chapter (~9 marks). Kohlrausch's law, Nernst EMF derivation, fuel/lead-storage cells, and conductivity numericals.",
      jeeFocus: "Ultra-consistent Rank-Decider in Main & Advanced (1–2 questions/paper). Heavy emphasis on $\\Delta G^\\circ = -nFE^\\circ$ additivity and concentration cells.",
      hotTopics: ["Nernst Eq. ($E = E^\\circ - \\frac{0.059}{n}\\log Q$)", "Kohlrausch Law ($\\Lambda_m^\\circ$)", "Faraday Laws ($W = ZIt$)", "Cell $\\Delta G^\\circ$ & $\\log K_c$"],
      trap: "Never add intensive $E^\\circ$ directly when combining half-cells — convert via extensive $\\Delta G^\\circ = -nFE^\\circ$ first."
    },
    "Chemical Kinetics": {
      cls: "XII", effort: 2,
      boardFocus: "Predictable 7-mark Class 12 chapter. First-order half-life proofs, pseudo-first-order kinetics, and Arrhenius $E_a$ plots.",
      jeeFocus: "Peak ROI Physical Chemistry chapter: minimal memorization, fast first-order ratio / pressure-kinetics & sequential/parallel rate laws.",
      hotTopics: ["1st-Order $k = \\frac{2.303}{t}\\log\\frac{a}{a-x}$", "Half-life $t_{1/2}$ & $t_{99.9\\%}$ ratios", "Arrhenius Eq. & Collision Theory", "Gas-Phase Total Pressure Kinetics"],
      trap: "In $A(g) \\to 2B(g) + C(g)$, total pressure $P_t \\neq P_0 - p$; solve $(P_0 - p)$ carefully from stoichiometry."
    },
    "Coordination Compounds": {
      cls: "XII", effort: 3,
      boardFocus: "Highest Inorganic Board yield (~7 marks). IUPAC naming, CFT splitting ($\\Delta_o, \\Delta_t$), magnetic moment, and optical/geometrical isomerism.",
      jeeFocus: "#1 Inorganic chapter across JEE Main & Advanced. Expect CFSE calculations, Jahn-Teller distortion ($d^9$), spectrochemical series & isomer counts.",
      hotTopics: ["CFT & $\\Delta_o > P$ Pairing Criterion", "Spin-Only $\\mu = \\sqrt{n(n+2)}\\,\\text{BM}$", "Stereoisomerism ($[Ma_2b_2c_2], [M(AA)_3]$)", "VBT Geometry ($dsp^2$ vs $sp^3$)"],
      trap: "Co(III) behaves as strong-field with $\\ce{H2O}$/oxalate ($\\ce{[Co(C2O4)3]^{3-}}$ is diamagnetic $d^2sp^3$); $\\ce{[Ni(CO)4]}$ is tetrahedral diamagnetic."
    },
    "d- and f-Block Elements": {
      cls: "XII", effort: 2,
      boardFocus: "Direct NCERT theory (~7 marks). Trends in $E^\\circ(M^{2+}/M)$, lanthanoid contraction, $\\ce{KMnO4}/\\ce{K2Cr2O7}$ preparations & oxidizing reactions.",
      jeeFocus: "High ROI factual/reasoning questions in JEE Main: $3d$ IE anomalies, $\\ce{Cr^{2+}}$ reducing vs $\\ce{Mn^{3+}}$ oxidizing power, $\\ce{Eu^{2+}}/\\ce{Ce^{4+}}$ configurations.",
      hotTopics: ["Lanthanoid Contraction & Twins (Zr/Hf)", "$\\ce{Cr2O7^{2-}}$ / $\\ce{MnO4^-}$ pH Redox", "$E^\\circ(M^{2+}/M)$ Cu & Mn Anomalies", "Oxidation States & Color"],
      trap: "Remember $\\ce{Cr^{2+}}$ ($d^4$) prefers $d^3$ ($t_{2g}^3$) in water (strong reducing agent) while $\\ce{Mn^{3+}}$ ($d^4$) wants $d^5$ (oxidizing)."
    },
    "Aldehydes, Ketones & Carboxylic Acids": {
      cls: "XII", effort: 4,
      boardFocus: "Largest Organic Class 12 weightage (~8 marks). Named conversions (Aldol, Cannizzaro, Clemmensen, Wolff-Kishner, HVZ) & distinguishing tests.",
      jeeFocus: "Anchor of JEE Organic pathways & multi-step roadmaps. Aldol intramolecular cyclization, crossed Cannizzaro, nucleophilic addition reactivity & $pK_a$ orders.",
      hotTopics: ["Aldol & Crossed-Aldol Condensation", "Cannizzaro & Intramolecular Shifts", "Tolls / Fehling / Iodoform Tests", "Carboxylic $pK_a$ & Ortho Effect"],
      trap: "Watch benzoic acid ortho-effect ($o$-substituted benzoic acids are ALWAYS stronger than unsubstituted irrespective of $+M/-I$)."
    },
    "Amines & Diazonium Salts": {
      cls: "XII", effort: 2,
      boardFocus: "Compact, high-scoring Class 12 chapter (~6 marks). Basicity in aqueous vs gas phase, Hinsberg test, Carbylamine & Gabriel synthesis.",
      jeeFocus: "Fast ROI Organic chapter. Aqueous $pK_b$ order ($2^\\circ > 1^\\circ > 3^\\circ$ for Et vs $2^\\circ > 3^\\circ > 1^\\circ$ for Me) & diazonium coupling sequences.",
      hotTopics: ["Aqueous vs Gas Basicity Order", "Hinsberg & Carbylamine Distinction", "Gabriel Phthalimide Scope", "Sandmeyer & Azo Coupling"],
      trap: "Gabriel synthesis fails for aryl halides (no $S_N2$); aniline undergoes $m$-nitration (~47%) in strongly acidic medium via anilinium ion."
    },
    "Alcohols, Phenols and Ethers": {
      cls: "XII", effort: 3,
      boardFocus: "Class 12 core (~6 marks). Lucas reagent test, acidic strength of substituted phenols, Reimer-Tiemann, Kolbe's, and Williamson ether synthesis.",
      jeeFocus: "Frequent multi-step questions on carbocation rearrangements in acid dehydration, HI cleavage of unsymmetrical ethers ($S_N1$ vs $S_N2$), and pinacol shift.",
      hotTopics: ["HI Ether Cleavage ($3^\\circ \\to S_N1$)", "Phenol Acidity & $o$-Nitrophenol H-bond", "Lucas Reactivity & Oxidation (PCC)", "Reimer-Tiemann / Kolbe Pathways"],
      trap: "Anisole + excess HI gives Phenol + $\\ce{CH3I}$ (never iodobenzene due to partial $C-O$ double-bond character)."
    },
    "Haloalkanes and Haloarenes": {
      cls: "XII", effort: 3,
      boardFocus: "Class 12 mechanism foundation (~6 marks). $S_N1$ vs $S_N2$ reactivity, ambident nucleophiles ($\\ce{KCN/AgCN}$), and aryl halide inertness.",
      jeeFocus: "Key stereochemical traps: Walden inversion vs racemization with ion-pair return, allylic/benzylic $S_N1$, and Dow's/benzyne mechanisms.",
      hotTopics: ["$S_N1$ vs $S_N2$ Rate & Solvent", "Walden Inversion & Retention", "Ambident Attack (KCN vs AgCN)", "Aryl Halide $S_N\\text{Ar}$ Activation"],
      trap: "$\\ce{CH3CH=CHCH2Cl}$ undergoes rapid $S_N1$ due to resonance stabilization; bridgehead bicyclic halides resist both $S_N1$ and $S_N2$."
    },
    "Biomolecules": {
      cls: "XII", effort: 1,
      boardFocus: "Easiest 6–7 marks in CBSE Class 12! Glucose cyclic/open evidence, reducing vs non-reducing sugars, zwitterion/pI, and DNA/RNA base pairing.",
      jeeFocus: "#1 Highest ROI chapter in JEE Main (1 short factual question in almost every shift) — mutarotation, peptide bonds, vitamins & denaturation.",
      hotTopics: ["Glucose Acetylation & Osazone", "Reducing vs Sucrose Structure", "Amino Acid Zwitterion & Isoelectric pH", "RNA Uracil vs DNA Thymine"],
      trap: "Sucrose is non-reducing (linkage at $C1-\\alpha$-Glc & $C2-\\beta$-Fru locks both hemiacetal/hemiketal carbons); Maltose & Lactose ARE reducing."
    },
    "Chemical Bonding": {
      cls: "XI", effort: 4,
      boardFocus: "Class XI foundation powering Class 12 $p$-block & Coordination Chemistry (VSEPR shapes, MOT bond order, H-bonding).",
      jeeFocus: "Consistent Top-3 JEE Main & Advanced chapter! Expect MOT paramagnetism ($\\ce{B2, O2, C2}$), back-bonding, Fajans' rule & dipole traps.",
      hotTopics: ["MOT Bond Order & $\\pi^*$ Orbitals", "VSEPR Hybridization & Bent's Rule", "Fajans Polarization & Melting Pts", "Back-Bonding ($\\ce{BF3, N(SiH3)3}$)"],
      trap: "Watch $s$-$p$ mixing boundary at $\\le 14 e^-$ ($\\pi_{2p} < \\sigma_{2p_z}$) vs $\\ge 15 e^-$ ($\\sigma_{2p_z} < \\pi_{2p}$) and $\\ce{C2}$ having two $\\pi$ bonds only."
    },
    "p-Block Elements": {
      cls: "XII", effort: 4,
      boardFocus: "Key Class 12 Inorganic trends (Groups 15–18): oxoacids of P/S/Cl, $\\ce{XeF2/XeF4/XeF6}$ shapes, and hydrides basicity/bp.",
      jeeFocus: "High-yield JEE Main & Advanced favorite: inert-pair effect, disproportionation of $\\ce{H3PO3/Cl2}$, hydrolysis of halides & anomalous N/O/F trends.",
      hotTopics: ["Inert-Pair Stability ($\\ce{Tl^+, Pb^{2+}, Bi^{3+}}$)", "Xenon Fluorides & Hydrolysis", "Oxoacid Basicity & $\\ce{P-H}$ Reducers", "Halogen Interhalogens & Cl₂ + NaOH"],
      trap: "$\\ce{H3PO3}$ is DIBASIC (has one $\\ce{P-H}$ bond) and $\\ce{H3PO2}$ is MONOBASIC (two $\\ce{P-H}$ bonds); $\\ce{NCl3 + H2O -> NH3 + HOCl}$ whereas $\\ce{PCl3 -> H3PO3}$."
    },
    "Thermodynamics": {
      cls: "XI", effort: 5,
      boardFocus: "Class XI conceptual anchor supporting Electrochemistry $\\Delta G$ & Equilibrium $\\Delta G^\\circ = -RT\\ln K$.",
      jeeFocus: "Frequent JEE Numerical & MSQ target: reversible vs irreversible $w, q, \\Delta S_{\\text{univ}}$, Hess cycles, and Gibbs-Helmholtz spontaneity.",
      hotTopics: ["First Law ($\\Delta U = q + w$ Sign)", "Isothermal vs Adiabatic Work", "Entropy ($\\Delta S_{\\text{surr}}$) & Spontaneity", "$\\Delta G = \\Delta H - T\\Delta S$ Signs"],
      trap: "Free expansion into vacuum ($P_{\\text{ext}} = 0$) has $w = 0$ always; in IUPAC sign convention compression work $w > 0$."
    },
    "Equilibrium": {
      cls: "XI", effort: 5,
      boardFocus: "Class XI base for pH, $K_a/K_b$, and weak electrolyte equilibria used directly in Electrochemistry.",
      jeeFocus: "Heavyweight JEE Main & Advanced topic: buffer pH calculations, polyprotic hydrolysis, $K_{sp}$ common-ion precipitation & Le Chatelier shifts.",
      hotTopics: ["Buffer Henderson-Hasselbalch", "Salt Hydrolysis & Polyprotic pH", "$K_{sp}$ Common-Ion Solubility", "$K_p = K_c(RT)^{\\Delta n_g}$"],
      trap: "Adding an inert gas at constant VOLUME never shifts equilibrium; at constant PRESSURE it shifts toward more gas moles."
    },
    "Structure of Atom": {
      cls: "XI", effort: 3,
      boardFocus: "Class XI prerequisite for Periodicity & quantum orbital configurations ($n, l, m_l, m_s$).",
      jeeFocus: "Consistent JEE Main numerical chapter: Bohr energy/radius ratios, Rydberg transitions, de Broglie $\\lambda$, radial/angular nodes.",
      hotTopics: ["Bohr Radius $r_n \\propto n^2/Z$ & $E_n$", "Hydrogen Spectrum Line Counts", "Radial ($n-l-1$) & Angular ($l$) Nodes", "Heisenberg & Photoelectric Eq."],
      trap: "Radial probability $4\\pi r^2 \\psi^2$ is zero at $r=0$, whereas $1s$ orbital electron density $\\psi^2$ is MAXIMUM at the nucleus."
    },
    "Solid State": {
      cls: "XII", effort: 3,
      boardFocus: "Classic NCERT Class 12 lattice calculations (packing efficiency, density formula, Schottky/Frenkel defects).",
      jeeFocus: "Pure formulaic JEE Main & Advanced numericals: BCC/FCC edge-length $a$ vs $r$, tetrahedral/octahedral void stoichiometry, and $r_+/r_-$ ratio.",
      hotTopics: ["FCC / BCC / SC Density $\\rho = \\frac{ZM}{N_A a^3}$", "Octahedral ($Z$) & Tetrahedral ($2Z$) Voids", "Ionic Lattice ($\\ce{NaCl, CsCl, ZnS, CaF2}$)", "Schottky vs Frenkel Defects"],
      trap: "Schottky lowers crystal density (vacancy pair); Frenkel preserves density (dislocation). $\\ce{AgBr}$ shows BOTH defects."
    },
    "Surface Chemistry": {
      cls: "XII", effort: 2,
      boardFocus: "High-ROI Class 12 short-answer concepts (Freundlich isotherm, Hardy-Schulze coagulation, micelle CMC & catalysis).",
      jeeFocus: "Quick JEE Main marks: physisorption vs chemisorption thermodynamics ($\\Delta H < 0, \\Delta S < 0$), gold number, and zeta potential.",
      hotTopics: ["Freundlich Isotherm ($x/m = kP^{1/n}$)", "Hardy-Schulze Coagulation Power", "Lyophilic vs Lyophobic Sols & Gold No.", "Micelle Kraft Temp & CMC"],
      trap: "Higher gold number means WEAKER protective power; coagulation ion charge of opposite sign dominates Hardy-Schulze value."
    },
    "General Principles of Metallurgy": {
      cls: "XII", effort: 2,
      boardFocus: "Compact Class 12 extraction pathways (froth flotation, leaching $\\ce{Al/Ag/Au}$, Mond & van Arkel refining).",
      jeeFocus: "Direct JEE Main ROI: Ellingham diagram slope changes, calcination vs roasting ores, and zone refining semiconductors.",
      hotTopics: ["Ellingham $\\Delta G^\\circ$ vs $T$ Intersections", "Froth Flotation (NaCN Depressant)", "Zone Refining, Mond ($\\ce{Ni}$) & van Arkel", "Hall-Heroult Al & Cu Matte Smelting"],
      trap: "$\\ce{C -> CO}$ slope is negative so above ~$983\\text{ K}$ coke reduces $\\ce{FeO}$; for $\\ce{Al2O3}$ electrolytic reduction is required below 2000 K."
    },
    "Qualitative Analysis": {
      cls: "XII", effort: 3,
      boardFocus: "Supports CBSE Class 12 Practical salt analysis & confirmatory cation/anion tests.",
      jeeFocus: "High-value JEE Advanced Paper 1/2 paragraph & MSQ favorite: selective sulfide precipitation ($K_{sp}$ + $\\ce{HCl}$ vs $\\ce{NH4OH}$), chromyl chloride & brown ring.",
      hotTopics: ["Group I–VI Cation Separation", "Chromyl Chloride ($\\ce{CrO2Cl2}$) Exceptions", "Brown Ring ($\\ce{[Fe(H2O)5(NO)]^{2+}}$)", "Lassaigne's Nitrogen/Halogen Tests"],
      trap: "$\\ce{HgCl2, AgCl, PbCl2}$ covalent/insoluble chlorides FAIL the chromyl chloride test; CuS dissolves in hot $\\ce{HNO3}$ while HgS needs aqua regia."
    },
    "General Organic Chemistry": {
      cls: "XI", effort: 4,
      boardFocus: "Class XI backbone governing every Class 12 Organic mechanism, acidity/basicity, and isomerism question.",
      jeeFocus: "Non-negotiable JEE rank builder: aromaticity ($4n+2$), hyperconjugation, resonance stability, tautomerism & optical R/S stereochemistry.",
      hotTopics: ["Aromaticity & Anti-aromaticity", "Carbocation & Carbanion Stability", "Inductive, Resonance & Hyperconjugation", "Optical & Geometrical Stereochemistry"],
      trap: "Cyclooctatetraene is tub-shaped NON-aromatic; lone pair on pyridine N is localized ($sp^2$), whereas on pyrrole N it is delocalized in $6\\pi$."
    },
    "Hydrocarbons": {
      cls: "XI", effort: 3,
      boardFocus: "Class XI foundation for Markovnikov, peroxide effect, ozonolysis & Friedel-Crafts electrophilic substitution.",
      jeeFocus: "Directly tested in multi-step JEE reactions: anti-Markovnikov HBr, reductive vs oxidative ozonolysis, and alkene syn/anti additions.",
      hotTopics: ["Markovnikov vs Peroxide HBr Only", "Ozonolysis ($\\ce{O3/Zn-H2O}$)", "Alkyne Lindlar (cis) vs Birch (trans)", "EAS Ortho/Para vs Meta Directing"],
      trap: "Kharasch peroxide effect works ONLY with HBr (fails for HCl and HI due to endothermic propagation steps)."
    },
    "Periodic Table": {
      cls: "XI", effort: 2,
      boardFocus: "Class XI trends backing Class 12 $d$- and $p$-block property explanations.",
      jeeFocus: "Ultra-consistent JEE Main opener: $IE_1$ dips ($Be>B$, $N>O$), $EA$ reversal ($Cl>F$, $S>O$), isoelectronic radii & diagonal pairs.",
      hotTopics: ["IE₁ Reversals ($Be>B, N>O$)", "Electron Gain ($Cl > F > Br > I$)", "Isoelectronic Ionic Radii ($N^{3-} > O^{2-}...$)", "Amphoteric Oxides ($Al, Zn, Sn, Pb$)"],
      trap: "Successive IE jump reveals valence electron count; $\\Delta_{\\text{eg}}H_2$ is ALWAYS endothermic ($>0$) even for oxygen/sulfur."
    },
    "Classification of Elements": {
      cls: "XI", effort: 2,
      boardFocus: "Class XI nomenclature & periodic block properties.",
      jeeFocus: "Fast JEE Main factual questions: IUPAC names ($Z > 100$), block identification, and electronegativity scales.",
      hotTopics: ["IUPAC $Z>100$ Roots (Unnil...)", "Pauling / Mulliken $\\chi$ Scale", "Metallic vs Oxide Acidic Character", "Valence Block Assignment"],
      trap: "Pd ($Z=46$) is $4d^{10}5s^0$ yet belongs to the $d$-block; oxide acidity rises left-to-right and with higher oxidation state ($\\ce{Mn2O7}$ acidic)."
    }
  };

  function getChapterMeta(ch, branch) {
    if (PYQ_CHAPTER_META[ch]) return PYQ_CHAPTER_META[ch];
    const isXI = /atom|thermo|equil|bond|periodic|classification|hydrocarbon|general organic/i.test(ch);
    return {
      cls: isXI ? "XI" : "XII",
      effort: 3,
      boardFocus: `NCERT Class ${isXI ? "XI foundation" : "XII core"} conceptual & numerical questions from ${ch}.`,
      jeeFocus: `Recurring ${branch} Chemistry PYQ patterns testing formula recall, exceptions & multi-step reasoning in ${ch}.`,
      hotTopics: [`Core Laws in ${ch}`, `Exam Numericals`, `Exception & Trend Analysis`],
      trap: `Verify boundary conditions, stoichiometry & IUPAC sign conventions in ${ch} problems.`
    };
  }

  let expanded = false;
  let anaBranch = "All";
  let anaTier = "All";
  let anaSearchTerm = "";
  let spotlightChapter = null;

  function computeRoiTier(row, maxN, totalQ) {
    const share = totalQ ? (row.n / totalQ) * 100 : 0;
    const yieldNorm = maxN ? row.n / maxN : 0;
    const recentBoost = row.n ? row.recent / row.n : 0;
    const highYield = yieldNorm >= 0.42 || share >= 6.5;
    const lowEffort = row.meta.effort <= 3;
    const score = +((share * (1 + 0.45 * recentBoost)) / Math.max(1, row.meta.effort * 0.72)).toFixed(1);
    if (highYield && lowEffort) return { key: "high", cls: "tier-high", label: "★ High ROI · Must-Do", short: "★ High ROI", score };
    if (highYield && !lowEffort) return { key: "core", cls: "tier-core", label: "◆ Core Ranker Anchor", short: "◆ Core Anchor", score };
    if (!highYield && lowEffort) return { key: "boost", cls: "tier-boost", label: "○ Quick Scoring Booster", short: "○ Booster", score };
    return { key: "tail", cls: "tier-tail", label: "△ Selective / Long-Tail", short: "△ Long-Tail", score };
  }

  function renderAnalyticsExamButtons() {
    if (!anaExamBar) return;
    const qAll = all();
    const examDefs = [{ val: "All", label: "All Tracks" }]
      .concat(EXAMS.filter((e) => qAll.some((x) => x.exam === e)).map((e) => ({
        val: e,
        label: e === "Board" ? "CBSE Class 12" : e
      })));
    anaExamBar.innerHTML = "";
    examDefs.forEach((d) => {
      const btn = el("button", {
        type: "button",
        class: "pyq-ana-exam-btn" + (tExam.value === d.val ? " active" : ""),
        "aria-pressed": String(tExam.value === d.val),
        text: d.label
      });
      btn.addEventListener("click", () => {
        tExam.value = d.val;
        renderTable();
      });
      anaExamBar.append(btn);
    });
  }

  if (anaBranchBar) {
    anaBranchBar.querySelectorAll("[data-ana-branch]").forEach((btn) => {
      btn.addEventListener("click", () => {
        anaBranch = btn.dataset.anaBranch || "All";
        anaBranchBar.querySelectorAll("[data-ana-branch]").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        renderTable();
      });
    });
  }

  if (anaTierBar) {
    anaTierBar.querySelectorAll("[data-ana-tier]").forEach((btn) => {
      btn.addEventListener("click", () => {
        anaTier = btn.dataset.anaTier || "All";
        anaTierBar.querySelectorAll("[data-ana-tier]").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        renderTable();
      });
    });
  }

  if (anaSearchInput) {
    anaSearchInput.addEventListener("input", () => {
      anaSearchTerm = anaSearchInput.value.trim().toLowerCase();
      renderTable();
    });
  }

  if (jumpAnaBtn) {
    jumpAnaBtn.addEventListener("click", () => {
      ensurePanelVisible("pyqAnalyticsPanel");
      const target = document.getElementById("pyqAnalyticsPanel");
      if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  if (anaPracticeBtn) {
    anaPracticeBtn.addEventListener("click", () => {
      ensurePanelVisible("pyqPanel");
      const target = document.getElementById("pyqPanel");
      if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  function launchPyqDrill({ chapter, exam, year }) {
    ensurePanelVisible("pyqPanel");
    if (exam && Array.from(fExam.options).some((o) => o.value === exam)) fExam.value = exam;
    else if (tExam && Array.from(fExam.options).some((o) => o.value === tExam.value)) fExam.value = tExam.value;
    fBranch.value = "All";
    fillFilters();
    if (chapter && Array.from(fChap.options).some((o) => o.value === chapter)) fChap.value = chapter;
    if (year && Array.from(fYear.options).some((o) => o.value === String(year))) fYear.value = String(year);
    else fYear.value = "All";
    fStat.value = "All";
    start();
    const qb = $q("pyqBody") || $q("pyqPanel");
    if (qb) qb.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }

  function renderKpiInfographic(q, rows, years, examFilter) {
    if (!kpiStrip) return;
    kpiStrip.innerHTML = "";
    const total = q.length;
    const phys = q.filter((x) => x.branch === "Physical").length;
    const inorg = q.filter((x) => x.branch === "Inorganic").length;
    const org = q.filter((x) => x.branch === "Organic").length;
    const pctOf = (n) => total ? Math.round((n / total) * 100) : 0;

    const xiiCount = q.filter((x) => getChapterMeta(x.chapter, x.branch).cls === "XII").length;
    const xiCount = total - xiiCount;
    const mcqN = q.filter((x) => x.type === "mcq").length;
    const numN = q.filter((x) => x.type === "num").length;
    const msqN = q.filter((x) => x.type === "msq").length;
    const recentQ = q.filter((x) => x.year >= 2023).length;
    const topRising = rows.slice().sort((a, b) => b.recent - a.recent || b.n - a.n)[0];
    const examTitle = examFilter === "Board" ? "CBSE Class 12" : examFilter === "All" ? "CBSE + JEE Combined" : examFilter;

    kpiStrip.innerHTML = `
      <div class="pyq-kpi-card">
        <span class="pyq-kpi-label">${esc(examTitle)} Pool</span>
        <strong class="pyq-kpi-val">${total} PYQs</strong>
        <div class="pyq-kpi-sub">${rows.length} chapters · ${years.length ? `${years[0]}–${years[years.length - 1]}` : "—"} · Class XII: <b>${pctOf(xiiCount)}%</b> / XI: ${pctOf(xiCount)}%</div>
      </div>
      <div class="pyq-kpi-card">
        <span class="pyq-kpi-label">Branch Weightage Mix</span>
        <strong class="pyq-kpi-val">${pctOf(phys)}% / ${pctOf(inorg)}% / ${pctOf(org)}%</strong>
        <div class="pyq-stacked-bar" aria-hidden="true">
          <span class="pyq-seg-phys" style="width:${pctOf(phys)}%"></span>
          <span class="pyq-seg-inorg" style="width:${pctOf(inorg)}%"></span>
          <span class="pyq-seg-org" style="width:${pctOf(org)}%"></span>
        </div>
        <div class="pyq-kpi-mini-row">
          <span><i style="background:#38bdf8"></i>Phys ${phys}</span>
          <span><i style="background:#34d399"></i>Inorg ${inorg}</span>
          <span><i style="background:#a78bfa"></i>Org ${org}</span>
        </div>
      </div>
      <div class="pyq-kpi-card">
        <span class="pyq-kpi-label">Question Pattern Split</span>
        <strong class="pyq-kpi-val">${mcqN} MCQ · ${numN + msqN} Adv/Num</strong>
        <div class="pyq-kpi-mini-row">
          <span>Single MCQ: <b>${mcqN}</b> (${pctOf(mcqN)}%)</span>
          <span>Numerical: <b>${numN}</b></span>
          <span>MSQ: <b>${msqN}</b></span>
        </div>
      </div>
      <div class="pyq-kpi-card">
        <span class="pyq-kpi-label">2023–2026 Recent Wave</span>
        <strong class="pyq-kpi-val">${pctOf(recentQ)}% Recent</strong>
        <div class="pyq-kpi-sub">${topRising ? `Top active: <b>${esc(topRising.chapter)}</b> (${topRising.recent} in 2023–26)` : "Import PYQs to inspect wave"}</div>
      </div>
    `;
  }

  function renderYearTimelineChart(q, years, examFilter) {
    if (!yearChartHost) return;
    yearChartHost.innerHTML = "";
    if (!years.length) {
      yearChartHost.innerHTML = `<p class="small-muted">No yearly data for the current filter.</p>`;
      return;
    }
    const yrStats = years.map((yr) => {
      const items = q.filter((x) => x.year === yr);
      const phys = items.filter((x) => x.branch === "Physical").length;
      const inorg = items.filter((x) => x.branch === "Inorganic").length;
      const org = items.filter((x) => x.branch === "Organic").length;
      return { yr, total: items.length, phys, inorg, org };
    });
    const maxTot = Math.max(1, ...yrStats.map((d) => d.total));
    const W = 540, H = 205, padL = 32, padR = 12, padT = 16, padB = 28;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const step = plotW / yrStats.length;
    const barW = Math.min(30, Math.max(14, step * 0.62));

    let gridLines = "";
    const ticks = [0, Math.ceil(maxTot / 2), maxTot];
    Array.from(new Set(ticks)).forEach((tv) => {
      const y = padT + plotH - (tv / maxTot) * plotH;
      gridLines += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="rgba(56,189,248,0.14)" stroke-dasharray="3 3" />`;
      gridLines += `<text x="${padL - 6}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" fill="#64748b" font-size="10" font-weight="600">${tv}</text>`;
    });

    const bars = yrStats.map((d, idx) => {
      const cx = padL + idx * step + step / 2;
      const x = cx - barW / 2;
      let curY = padT + plotH;
      const segs = [
        { val: d.phys, color: "#38bdf8", name: "Physical" },
        { val: d.inorg, color: "#34d399", name: "Inorganic" },
        { val: d.org, color: "#a78bfa", name: "Organic" }
      ];
      let rects = "";
      segs.forEach((s) => {
        if (!s.val) return;
        const sh = (s.val / maxTot) * plotH;
        curY -= sh;
        rects += `<rect class="bar-seg" x="${x.toFixed(1)}" y="${curY.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(2, sh).toFixed(1)}" rx="2.5" fill="${s.color}" />`;
      });
      const labelY = Math.max(11, curY - 5);
      return `
        <g class="pyq-yr-bar-group" tabindex="0" role="button" data-yr="${d.yr}" data-phys="${d.phys}" data-inorg="${d.inorg}" data-org="${d.org}" data-tot="${d.total}" aria-label="Year ${d.yr}: ${d.total} questions (${d.phys} Physical, ${d.inorg} Inorganic, ${d.org} Organic). Click to practice ${d.yr} PYQs.">
          <title>${d.yr}: ${d.total} PYQs (Phys ${d.phys}, Inorg ${d.inorg}, Org ${d.org}) — click to drill</title>
          ${rects}
          <text x="${cx.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" fill="#cbd5e1" font-size="10" font-weight="700">${d.total}</text>
          <text x="${cx.toFixed(1)}" y="${H - 9}" text-anchor="middle" fill="#94a3b8" font-size="10.5" font-weight="600">${String(d.yr).slice(-2)}</text>
        </g>
      `;
    }).join("");

    yearChartHost.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Stacked bar chart of PYQs per year from ${years[0]} to ${years[years.length - 1]}">${gridLines}${bars}</svg>`;

    yearChartHost.querySelectorAll(".pyq-yr-bar-group").forEach((g) => {
      const announce = () => {
        if (yearChartNote) {
          yearChartNote.textContent = `${g.dataset.yr}: ${g.dataset.tot} PYQs · Phys ${g.dataset.phys} · Inorg ${g.dataset.inorg} · Org ${g.dataset.org} (click bar to drill)`;
        }
      };
      g.addEventListener("pointerenter", announce);
      g.addEventListener("focus", announce);
      g.addEventListener("click", () => launchPyqDrill({ year: g.dataset.yr, exam: examFilter !== "All" ? examFilter : undefined }));
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          launchPyqDrill({ year: g.dataset.yr, exam: examFilter !== "All" ? examFilter : undefined });
        }
      });
    });
  }

  function formatRoiShortName(ch) {
    const aliases = {
      "Coordination Compounds": "Coordination",
      "Electrochemistry": "Electrochem.",
      "d- and f-Block Elements": "d/f-Block",
      "Aldehydes, Ketones & Carboxylic Acids": "Aldehydes/Ketones",
      "Amines & Diazonium Salts": "Amines",
      "Alcohols, Phenols and Ethers": "Alcohols/Phenols",
      "Haloalkanes and Haloarenes": "Haloalkanes",
      "General Organic Chemistry": "GOC",
      "General Principles of Metallurgy": "Metallurgy",
      "Classification of Elements": "Classification",
      "Qualitative Analysis": "Qual. Analysis",
      "Structure of Atom": "Atomic Struct.",
      "Chemical Kinetics": "Kinetics",
      "Chemical Bonding": "Chem. Bonding",
      "p-Block Elements": "p-Block",
      "Surface Chemistry": "Surface Chem."
    };
    if (aliases[ch]) return aliases[ch];
    return ch.length > 15 ? ch.slice(0, 14).trim() + "…" : ch;
  }

  function renderRoiQuadrantSvg(rows, totalQ) {
    if (!roiMatrixHost) return;
    roiMatrixHost.innerHTML = "";
    if (!rows.length) {
      roiMatrixHost.innerHTML = `<p class="small-muted">No chapter ROI data for this filter.</p>`;
      return;
    }
    const W = 540, H = 236, padL = 42, padR = 16, padT = 16, padB = 34;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const midX = padL + plotW * 0.56; // separates effort <= 3 vs > 3
    const maxN = Math.max(1, ...rows.map((r) => r.n));
    const minY = padT + 28, maxY = padT + plotH - 22;
    const minX = padL + 16, maxX = W - padR - 16;
    const midY = padT + plotH * 0.50;

    const branchColors = { Physical: "#38bdf8", Inorganic: "#34d399", Organic: "#a78bfa" };

    // Deterministic initial placement by effort & PYQ frequency + mild horizontal fanout
    const placed = new Map();
    const nodes = rows.map((r) => {
      const slotKey = `${r.meta.effort}-${r.n}`;
      const slotIdx = placed.get(slotKey) || 0;
      placed.set(slotKey, slotIdx + 1);
      const angle = slotIdx * 2.25;
      const offsetR = slotIdx === 0 ? 0 : Math.min(20, 9 + slotIdx * 4.5);
      const baseX = padL + ((r.meta.effort - 0.65) / 4.75) * (plotW - 18) + 9;
      const normY = maxN > 1 ? (r.n - 1) / (maxN - 1) : 0.6;
      const baseY = maxY - normY * (maxY - minY);
      const rad = clamp(5.2 + Math.sqrt(r.n) * 1.35, 5.8, 11.8);
      const cx = clamp(baseX + Math.cos(angle) * offsetR, minX, maxX);
      const cy = clamp(baseY + Math.sin(angle) * offsetR, minY, maxY);
      const isSel = r.chapter === spotlightChapter;
      const shortName = formatRoiShortName(r.chapter);
      return { r, cx, cy, rad, isSel, shortName, color: branchColors[r.branch] || "#38bdf8" };
    });

    // Pairwise circle repulsion so every chapter circle has an unobstructed clickable hitbox
    for (let iter = 0; iter < 28; iter++) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = b.cx - a.cx, dy = b.cy - a.cy;
          let dist = Math.hypot(dx, dy);
          const minDist = a.rad + b.rad + 7;
          if (dist < 0.01) { dx = 1; dy = 0.5; dist = 1.12; }
          if (dist < minDist) {
            const push = (minDist - dist) * 0.54;
            const ux = dx / dist, uy = dy / dist;
            a.cx = clamp(a.cx - ux * push, minX, maxX);
            a.cy = clamp(a.cy - uy * push, minY, maxY);
            b.cx = clamp(b.cx + ux * push, minX, maxX);
            b.cy = clamp(b.cy + uy * push, minY, maxY);
          }
        }
      }
    }

    const bgQuads = `<g pointer-events="none">
      <rect x="${padL}" y="${padT}" width="${(midX - padL).toFixed(1)}" height="${(midY - padT).toFixed(1)}" fill="rgba(16,185,129,0.08)" />
      <rect x="${midX.toFixed(1)}" y="${padT}" width="${(W - padR - midX).toFixed(1)}" height="${(midY - padT).toFixed(1)}" fill="rgba(56,189,248,0.07)" />
      <rect x="${padL}" y="${midY.toFixed(1)}" width="${(midX - padL).toFixed(1)}" height="${(padT + plotH - midY).toFixed(1)}" fill="rgba(251,191,36,0.04)" />
      <rect x="${midX.toFixed(1)}" y="${midY.toFixed(1)}" width="${(W - padR - midX).toFixed(1)}" height="${(padT + plotH - midY).toFixed(1)}" fill="rgba(148,163,184,0.04)" />
      <line x1="${midX.toFixed(1)}" y1="${padT}" x2="${midX.toFixed(1)}" y2="${padT + plotH}" stroke="rgba(148,163,184,0.28)" stroke-dasharray="4 3" />
      <line x1="${padL}" y1="${midY.toFixed(1)}" x2="${W - padR}" y2="${midY.toFixed(1)}" stroke="rgba(148,163,184,0.28)" stroke-dasharray="4 3" />
      <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="none" stroke="rgba(56,189,248,0.22)" rx="6" />
      <text x="${padL + 8}" y="${padT + 14}" fill="#6ee7b7" font-size="10" font-weight="700">★ HIGH ROI (Quick Wins)</text>
      <text x="${W - padR - 8}" y="${padT + 14}" text-anchor="end" fill="#7dd3fc" font-size="10" font-weight="700">◆ CORE ANCHORS</text>
      <text x="${padL + 8}" y="${padT + plotH - 6}" fill="#fde68a" font-size="9.5" font-weight="600">○ Boosters</text>
      <text x="${W - padR - 8}" y="${padT + plotH - 6}" text-anchor="end" fill="#94a3b8" font-size="9.5" font-weight="600">△ Long-Tail</text>
      <text x="${padL + plotW / 2}" y="${H - 8}" text-anchor="middle" fill="#94a3b8" font-size="10.5" font-weight="600">Study Effort / Syllabus Depth (Low → High) →</text>
      <text x="14" y="${padT + plotH / 2}" text-anchor="middle" transform="rotate(-90 14 ${padT + plotH / 2})" fill="#94a3b8" font-size="10.5" font-weight="600">PYQ Frequency ↑</text>
    </g>`;

    // Render selected node first in label reservation, last in painter order so active highlight never collides
    const orderedNodes = nodes.slice().sort((a, b) => (a.isSel ? 1 : 0) - (b.isSel ? 1 : 0));
    const labeledBoxes = [];
    const reserveLabel = (node) => {
      const { cx, cy, rad, isSel, shortName } = node;
      const anchorRight = cx < padL + 75;
      const anchorLeft = cx > W - padR - 75;
      const textAnchor = anchorRight ? "start" : anchorLeft ? "end" : "middle";
      const tx = anchorRight ? cx - rad * 0.45 : anchorLeft ? cx + rad * 0.45 : cx;
      const aboveY = cy - rad - 5;
      const belowY = cy + rad + 12;
      const ty = aboveY >= padT + 24 ? aboveY : belowY;
      const wEst = shortName.length * (isSel ? 6.4 : 5.4);
      const xLeft = textAnchor === "start" ? tx : textAnchor === "end" ? tx - wEst : tx - wEst / 2;
      const box = { x1: xLeft - 6, x2: xLeft + wEst + 6, y1: ty - 11, y2: ty + 5 };
      return { textAnchor, tx, ty, box };
    };
    const selectedNode = orderedNodes.find((n) => n.isSel);
    if (selectedNode) labeledBoxes.push(reserveLabel(selectedNode).box);
    const circleBoxes = orderedNodes.map((n) => ({
      ch: n.r.chapter,
      x1: n.cx - n.rad - 2,
      x2: n.cx + n.rad + 2,
      y1: n.cy - n.rad - 2,
      y2: n.cy + n.rad + 2
    }));

    const svgNodes = orderedNodes.map((node) => {
      const { r, cx, cy, rad, isSel, shortName, color } = node;
      const candidate = isSel || r.n >= maxN * 0.55 || r.tier.key === "high";
      const { textAnchor, tx, ty, box } = reserveLabel(node);
      const overlapsBox = (b) => !(box.x2 < b.x1 || box.x1 > b.x2 || box.y2 < b.y1 || box.y1 > b.y2);
      const collides = !isSel && (
        labeledBoxes.some(overlapsBox) ||
        circleBoxes.some((cb) => cb.ch !== r.chapter && overlapsBox(cb))
      );
      const showLabel = isSel || (candidate && !collides);
      if (showLabel && !isSel) labeledBoxes.push(box);

      return `
        <g class="pyq-roi-node${isSel ? " is-selected" : ""}" tabindex="0" role="button" data-ch="${esc(r.chapter)}" aria-label="${esc(r.chapter)}: ${r.n} PYQs, effort ${r.meta.effort}/5, ${r.tier.label}">
          <title>${esc(r.chapter)} (${r.branch} · Class ${r.meta.cls}): ${r.n} PYQs (${totalQ ? ((r.n / totalQ) * 100).toFixed(1) : 0}%), Effort ${r.meta.effort}/5 — ${r.tier.short}</title>
          <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${Math.max(14, rad + 4).toFixed(1)}" fill="transparent" />
          <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rad.toFixed(1)}" fill="${color}" fill-opacity="${isSel ? "0.96" : "0.80"}" stroke="${isSel ? "#ffffff" : "#061124"}" stroke-width="${isSel ? "2.4" : "1.5"}" />
          ${showLabel ? `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${textAnchor}" fill="${isSel ? "#ffffff" : "#cbd5e1"}" font-size="${isSel ? "10.5" : "9"}" font-weight="${isSel ? "800" : "600"}" style="paint-order:stroke;stroke:#061124;stroke-width:3px;stroke-linejoin:round;">${esc(shortName)}</text>` : ""}
        </g>
      `;
    }).join("");

    roiMatrixHost.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="ROI quadrant scatter plot comparing chapter study effort vs PYQ frequency">${bgQuads}${svgNodes}</svg>`;

    roiMatrixHost.querySelectorAll(".pyq-roi-node").forEach((node) => {
      const pickNode = () => {
        spotlightChapter = node.dataset.ch;
        renderTopicSpotlight(rows, totalQ);
        renderRoiQuadrantSvg(rows, totalQ);
        tableHost.querySelectorAll("tbody tr").forEach((tr) => {
          tr.classList.toggle("is-spot-row", tr.dataset.ch === spotlightChapter);
        });
      };
      node.addEventListener("click", pickNode);
      node.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          pickNode();
        }
      });
    });
  }

  function renderTopicSpotlight(rows, totalQ) {
    if (!topicSpotHost) return;
    topicSpotHost.innerHTML = "";
    if (!rows.length) {
      topicSpotHost.hidden = true;
      return;
    }
    topicSpotHost.hidden = false;
    let row = rows.find((r) => r.chapter === spotlightChapter) || rows[0];
    spotlightChapter = row.chapter;

    const allInCh = all().filter((x) => x.chapter === row.chapter);
    const boardN = allInCh.filter((x) => x.exam === "Board").length;
    const mainN = allInCh.filter((x) => x.exam === "JEE Main").length;
    const advN = allInCh.filter((x) => x.exam === "JEE Advanced").length;
    const s = stats.chapters[row.chapter];
    const accText = s && s.a >= 1 ? `${pct(s.c, s.a)}% (${s.c}/${s.a})` : "Not attempted yet";
    const sharePct = totalQ ? ((row.n / totalQ) * 100).toFixed(1) : "0.0";

    const hotTopicsHtml = (row.meta.hotTopics || [])
      .map((t) => `<span class="pyq-hot-topic-item">${mdInlineToHtml(t)}</span>`)
      .join("");

    topicSpotHost.innerHTML = `
      <div class="pyq-spot-top">
        <div>
          <div class="pyq-spot-title-row">
            <h4>${esc(row.chapter)}</h4>
            <span class="pyq-roi-tier-tag ${row.tier.cls}">${esc(row.tier.label)}</span>
            <span class="pyq-trend-pill ${row.trend.cls}">${esc(row.trend.label)}</span>
          </div>
          <div class="pyq-spot-meta">${esc(row.branch)} Chemistry · NCERT Class ${esc(row.meta.cls)} · Effort ${row.meta.effort}/5 · ${row.n} PYQs (${sharePct}% of view) · Bank split: CBSE Board ${boardN} | JEE Main ${mainN} | JEE Adv ${advN} · Your Accuracy: <b>${esc(accText)}</b></div>
        </div>
        <div class="pyq-spot-actions">
          <button type="button" class="primary" id="pyqSpotDrillBtn">Drill Chapter PYQs ↗</button>
          <button type="button" class="outline-btn" id="pyqSpotAskBtn">Ask Nemo AI ROI Plan ↗</button>
        </div>
      </div>

      <div class="pyq-spot-grid">
        <div class="pyq-spot-box">
          <h5>CBSE Class 12 Board Pattern</h5>
          <p>${mdInlineToHtml(row.meta.boardFocus)}</p>
        </div>
        <div class="pyq-spot-box">
          <h5>JEE Main &amp; Advanced Pattern</h5>
          <p>${mdInlineToHtml(row.meta.jeeFocus)}</p>
        </div>
        <div class="pyq-spot-box">
          <h5>High-Yield Subtopics &amp; Formulas</h5>
          <div class="pyq-hot-topics">${hotTopicsHtml}</div>
        </div>
      </div>

      <div class="pyq-spot-trap"><strong>Common Exam Trap:</strong> ${mdInlineToHtml(row.meta.trap)}</div>
    `;

    const drillBtn = topicSpotHost.querySelector("#pyqSpotDrillBtn");
    if (drillBtn) {
      drillBtn.addEventListener("click", () => launchPyqDrill({ chapter: row.chapter, exam: tExam.value !== "All" ? tExam.value : undefined }));
    }
    const askBtn = topicSpotHost.querySelector("#pyqSpotAskBtn");
    if (askBtn) {
      askBtn.addEventListener("click", () => {
        ensurePanelVisible("chatPanel");
        const chatEl = document.getElementById("chatPanel");
        if (chatEl) chatEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        const examLabel = tExam.value === "Board" ? "CBSE Class 12 Board" : tExam.value === "All" ? "CBSE Class 12 Board, JEE Main & JEE Advanced" : tExam.value;
        askNemo(`Give me a high-ROI revision cheat sheet, recurring PYQ patterns, and common traps for "${row.chapter}" (${row.branch}, Class ${row.meta.cls}) tailored for ${examLabel}.`, { topic: row.chapter });
      });
    }
  }

  function renderTable() {
    renderAnalyticsExamButtons();
    const q = all().filter((x) => (tExam.value === "All" || x.exam === tExam.value) && (anaBranch === "All" || x.branch === anaBranch));
    tableHost.innerHTML = ""; insight.innerHTML = ""; caution.hidden = true; showAll.hidden = true;
    if (!q.length) {
      renderKpiInfographic([], [], [], tExam.value);
      renderYearTimelineChart([], [], tExam.value);
      renderRoiQuadrantSvg([], 0);
      renderTopicSpotlight([], 0);
      tableHost.append(el("p", { class: "small-muted", text: "The chapter-by-year heat map appears here once matching questions are available." }));
      return;
    }

    const years = Array.from(new Set(q.map((x) => x.year))).sort((a, b) => a - b);
    const byCh = new Map();
    q.forEach((x) => {
      const k = x.branch + "||" + x.chapter;
      const r = byCh.get(k) || { branch: x.branch, chapter: x.chapter, n: 0, recent: 0, earlier: 0, y: {}, meta: getChapterMeta(x.chapter, x.branch) };
      r.n++;
      if (x.year >= 2023) r.recent++;
      else r.earlier++;
      r.y[x.year] = (r.y[x.year] || 0) + 1;
      byCh.set(k, r);
    });
    const rows = Array.from(byCh.values()).sort((a, b) => b.n - a.n || a.chapter.localeCompare(b.chapter));
    const maxCell = Math.max(...rows.map((r) => Math.max(...Object.values(r.y))));
    const maxTotal = Math.max(...rows.map((r) => r.n));
    rows.forEach((r) => {
      r.tier = computeRoiTier(r, maxTotal, q.length);
      const recentRate = r.recent / 4; // 2023-2026 (4 yrs)
      const earlierRate = r.earlier / 7; // 2016-2022 (7 yrs)
      if (r.recent > 0 && recentRate > earlierRate * 1.25) r.trend = { cls: "up", label: "▲ Rising" };
      else if (r.recent === 0 && r.earlier >= 2) r.trend = { cls: "down", label: "▼ Cooling" };
      else r.trend = { cls: "flat", label: "● Steady" };
    });

    const filteredRows = rows.filter((r) => {
      if (anaTier !== "All" && r.tier.key !== anaTier) return false;
      if (anaSearchTerm) {
        const hay = `${r.chapter} ${r.branch} ${(r.meta.hotTopics || []).join(" ")}`.toLowerCase();
        if (!hay.includes(anaSearchTerm)) return false;
      }
      return true;
    });

    if (!spotlightChapter || !filteredRows.some((r) => r.chapter === spotlightChapter)) {
      spotlightChapter = filteredRows.length ? filteredRows[0].chapter : null;
    }

    renderKpiInfographic(q, rows, years, tExam.value);
    renderYearTimelineChart(q, years, tExam.value);
    renderRoiQuadrantSvg(filteredRows, q.length);
    renderTopicSpotlight(filteredRows, q.length);

    if (!filteredRows.length) {
      const emptyBox = el("div", { class: "pyq-tier-empty-msg" },
        el("span", { text: "No chapters match the current ROI tier or chapter search filter." }),
        el("button", {
          type: "button",
          class: "outline-btn",
          text: "Reset ROI & Search Filters",
          onclick: () => {
            anaTier = "All";
            anaSearchTerm = "";
            if (anaSearchInput) anaSearchInput.value = "";
            if (anaTierBar) {
              anaTierBar.querySelectorAll("[data-ana-tier]").forEach((b) => {
                const on = b.dataset.anaTier === "All";
                b.classList.toggle("active", on);
                b.setAttribute("aria-pressed", String(on));
              });
            }
            renderTable();
          }
        })
      );
      tableHost.append(emptyBox);
      return;
    }

    const acc = (r) => { const s = stats.chapters[r.chapter]; return s && s.a >= 2 ? pct(s.c, s.a) : null; };
    const limit = expanded ? filteredRows.length : Math.min(filteredRows.length, 15);
    const head = el("tr", {},
      el("th", { text: "Chapter" }),
      el("th", { class: "yr", text: "ROI Tier" }),
      el("th", { class: "yr", text: "Trend" }),
      ...years.map((y) => el("th", { class: "yr", text: String(y) })),
      el("th", { class: "yr", text: "Total" }),
      el("th", { class: "yr", text: "Your accuracy" })
    );
    const tbody = el("tbody");
    filteredRows.slice(0, limit).forEach((r) => {
      const a = acc(r);
      const tr = el("tr", {
        class: r.chapter === spotlightChapter ? "is-spot-row" : "",
        "data-ch": r.chapter,
        title: `Click row to inspect ${r.chapter} CBSE & JEE ROI`
      },
        el("th", { scope: "row" }, r.chapter, el("small", { text: `${r.branch} · Class ${r.meta.cls} · Effort ${r.meta.effort}/5` })),
        el("td", { class: "tot" }, el("span", { class: `pyq-roi-tier-tag ${r.tier.cls}`, text: r.tier.short })),
        el("td", { class: "tot" }, el("span", { class: `pyq-trend-pill ${r.trend.cls}`, text: r.trend.label })),
        ...years.map((y) => {
          const c = r.y[y] || 0;
          const td = el("td", {
            class: "cell" + (c ? " has" : ""),
            style: c ? `--h:${(0.18 + 0.62 * c / maxCell).toFixed(2)}` : null,
            title: c ? `${r.chapter} (${y}): ${c} PYQ(s) — click to drill` : `${r.chapter} (${y}): 0`,
            text: c ? String(c) : "·"
          });
          if (c) {
            td.addEventListener("click", (e) => {
              e.stopPropagation();
              spotlightChapter = r.chapter;
              launchPyqDrill({ chapter: r.chapter, year: y, exam: tExam.value !== "All" ? tExam.value : undefined });
            });
          }
          return td;
        }),
        el("td", { class: "tot", text: String(r.n) }),
        el("td", { class: "tot", text: a === null ? "—" : a + "%" })
      );
      tr.addEventListener("click", () => {
        spotlightChapter = r.chapter;
        renderTopicSpotlight(filteredRows, q.length);
        renderRoiQuadrantSvg(filteredRows, q.length);
        tbody.querySelectorAll("tr").forEach((rowEl) => rowEl.classList.toggle("is-spot-row", rowEl === tr));
      });
      tbody.append(tr);
    });
    tableHost.append(el("div", { class: "table-scroll" }, el("table", { class: "pyq-table" }, el("thead", {}, head), tbody)));
    if (filteredRows.length > 15) { showAll.hidden = false; showAll.textContent = expanded ? "Show top 15 only" : `Show all ${filteredRows.length} chapters`; }
    const small = q.length < 20 || years.length < 3;
    if (small) { caution.hidden = false; caution.textContent = `Focused slice: ${q.length} question(s) across ${years.length} year(s). Switch exam track or branch above to compare full patterns.`; }

    const quickWins = rows.filter((r) => r.tier.key === "high").slice(0, 4);
    const hot = rows.slice(0, 5).filter((r) => { const a = acc(r); return a === null || a < 70; });
    insight.append(
      el("b", { text: quickWins.length ? "Top ROI Priority Chapters for Current Track" : (hot.length ? "High frequency in your set, but not yet solid for you" : "Your top chapters look solid") }),
      el("p", {
        text: quickWins.length
          ? `Highest Yield-per-Hour chapters: ${quickWins.map((r) => `${r.chapter} (${r.n} PYQs · Effort ${r.meta.effort}/5 · ${r.trend.label})`).join(" · ")}.`
          : (hot.length ? hot.map((r) => { const a = acc(r); return `${r.chapter} (${r.n} question${r.n === 1 ? "" : "s"}, ${a === null ? "not enough attempts" : a + "% accuracy"})`; }).join(" · ") : "Each top frequent chapter in this view has 70% or better accuracy.")
      })
    );
  }
  tExam.addEventListener("change", renderTable);
  showAll.addEventListener("click", () => { expanded = !expanded; renderTable(); });

  function refreshAll() {
    const q = all(), yrs = Array.from(new Set(q.map((x) => x.year))).sort((a, b) => a - b);
    status.textContent = q.length ? `${q.length} question(s) in your bank · ${yrs.length} year(s) (${yrs[0]}–${yrs[yrs.length - 1]})` : "0 questions in your bank";
    optionsOf(tExam, EXAMS.filter((e) => q.some((x) => x.exam === e)), "All exams");
    fillFilters(); $q("pyqImportBox").open = !q.length; renderTable(); start();
  }
  refreshAll();
  return { validate, parseInput, importText, all };
})();

/* ============================== navigation scroll-spy & Nemo companion sync ============================== */
let onActiveSectionChange = null;

(function scrollSpy() {
  const links = $$(".nav-item");
  const byId = new Map();
  links.forEach((a) => {
    if (!a.dataset.section && a.dataset.target) {
      byId.set(a.dataset.target, a);
    }
  });
  let goldNavLockUntil = 0;

  const setActive = (id) => {
    links.forEach((a) => {
      const on = a.dataset.target === id;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    if (typeof onActiveSectionChange === "function") onActiveSectionChange(id);
  };

  links.forEach((a) => a.addEventListener("click", (e) => {
    const targetId = a.dataset.target;
    const sectionId = a.dataset.section || targetId;
    ensurePanelVisible(sectionId);
    if (targetId === "pyqGoldHub") {
      e.preventDefault();
      goldNavLockUntil = Date.now() + 1200;
      setActive("pyqGoldHub");
      if (typeof window.focusGoldHub === "function") {
        window.focusGoldHub();
      }
    } else {
      goldNavLockUntil = 0;
      setActive(targetId);
    }
    const sidebar = $("#appSidebar");
    const backdrop = $("#sidebarBackdrop");
    const mobileMenuBtn = $("#mobileMenuBtn");
    if (sidebar && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open", "active");
      if (backdrop) backdrop.classList.remove("active");
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove("active");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      }
    }
  }));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      if (Date.now() < goldNavLockUntil && e.target.id === "pyqPanel") return;
      setActive(e.target.id);
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  byId.forEach((_, id) => { const p = document.getElementById(id); if (p) io.observe(p); });
})();

/* ============================== floating 3D Nemo Companion ============================== */
(function floatingNemo() {
  const widget = $("#nemoWidget"), orb = $("#widgetOrb"), pop = $("#widgetPopover"), toggle = $("#floatToggle"), mobileToggle = $("#mobileFloatBtn");
  const saved = store.get("nemo.widget.v1", {}) || {};
  let drag = null, moved = false, justDragged = false;
  if (saved.compact) widget.classList.add("compact");

  const NEMO_SECTION_EXPRESSIONS = {
    chatPanel: {
      state: "chat",
      badge: "Chat",
      moodText: "Ready to help!",
      moodIcon: "💬",
      heading: "Nemo AI Tutor",
      context: "I'm ready to explain tricky mechanisms, exceptions, and numericals!",
      tip: "Ask me about SN1/SN2 kinetics, coordination complexes, or Nernst numericals!"
    },
    moleculePanel: {
      state: "molecule",
      badge: "3D Mol",
      moodText: "3D Explorer",
      moodIcon: "⬡",
      heading: "3D Molecular Explorer",
      context: "Exploring 124 interactive 3D molecules, VSEPR shapes, and crystal unit cells.",
      tip: "You can drag to rotate, scroll or pinch to zoom, and toggle lone pair lobes!"
    },
    practicePanel: {
      state: "practice",
      badge: "Practice",
      moodText: "Quiz Mode",
      moodIcon: "✔",
      heading: "Chemistry Practice",
      context: "Working through original practice questions across Physical, Organic, and Inorganic.",
      tip: "Read each question carefully and check for common unit conversion traps!"
    },
    analyticsPanel: {
      state: "analytics",
      badge: "Analytics",
      moodText: "Analyzing Trends",
      moodIcon: "▥",
      heading: "Study Analytics",
      context: "Tracking your accuracy across chapters and exam branches to highlight weak areas.",
      tip: "Target your lowest accuracy chapters to maximize your JEE & CBSE score!"
    },
    canvasPanel: {
      state: "canvas",
      badge: "Artist",
      moodText: "Reaction Artist",
      moodIcon: "✎",
      heading: "Reaction Canvas",
      context: "Drawing reaction pathways, curly-arrow mechanisms, and resonance structures.",
      tip: "Draw arrows from electron-rich nucleophiles to electron-poor electrophiles!"
    },
    libraryPanel: {
      state: "library",
      badge: "Scholar",
      moodText: "248 Rules",
      moodIcon: "§",
      heading: "Rules & Exceptions Library",
      context: "Exploring 248 NCERT-grounded rules, trends, and qualitative salt analysis tests.",
      tip: "Pay special attention to the Exam Trap notes on each card—they appear often in exams!"
    },
    periodicPanel: {
      state: "library",
      badge: "Elements",
      moodText: "118 Elements",
      moodIcon: "⊞",
      heading: "Periodic Table & Quantum Inspector",
      context: "Inspecting all 118 IUPAC elements, KaTeX electron orbitals, and JEE exception traps.",
      tip: "Watch out for Palladium (4d¹⁰ 5s⁰), Cr/Cu half-full exceptions, and Cl > F electron gain enthalpy!"
    },
    pyqPanel: {
      state: "pyq",
      badge: "PYQ Bank",
      moodText: "Exam Master",
      moodIcon: "⌗",
      heading: "Official PYQ Bank",
      context: "Solving real JEE Main and JEE Advanced questions from official archives.",
      tip: "Solve questions under timed conditions to simulate actual exam pressure!"
    },
    pyqAnalyticsPanel: {
      state: "analytics",
      badge: "ROI Map",
      moodText: "Pattern Engine",
      moodIcon: "📊",
      heading: "PYQ Pattern Analysis & ROI Heat Map",
      context: "Mapping CBSE Class 12, JEE Main & Advanced chapter frequency, effort-vs-yield quadrants & 2016–2026 trends.",
      tip: "Start with ★ High ROI chapters in the upper-left quadrant for fast score gains!"
    },
    formulasPanel: {
      state: "formulas",
      badge: "Formulas",
      moodText: "∑ Formulas",
      moodIcon: "∑",
      heading: "Physical Formula Bank",
      context: "High-yield formulas, constants, and worked numerical examples.",
      tip: "Always double-check temperature in Kelvin and gas constant R in matching units!"
    }
  };

  let currentActiveSection = "chatPanel";
  window.NEMO_SECTION_EXPRESSIONS = NEMO_SECTION_EXPRESSIONS;
  window.currentActiveSection = currentActiveSection;

  function updateNemoView(sectionId) {
    if (!sectionId || !NEMO_SECTION_EXPRESSIONS[sectionId]) sectionId = "chatPanel";
    currentActiveSection = sectionId;
    window.currentActiveSection = sectionId;
    const cfg = NEMO_SECTION_EXPRESSIONS[sectionId];
    const hasExpr = Boolean(orb && orb.hasAttribute("data-expression"));
    if (orb && !hasExpr) orb.setAttribute("data-state", cfg.state);
    const badge = $("#nemoOrbBadge");
    if (badge && !hasExpr && !badge.hasAttribute("data-reaction-active")) badge.textContent = cfg.badge;
    const moodIcon = $("#nemoMoodIcon");
    if (moodIcon && !hasExpr) moodIcon.textContent = cfg.moodIcon;
    const moodText = $("#nemoMoodText");
    if (moodText && !hasExpr) {
      moodText.textContent = (isHeroDocked && sectionId === "chatPanel") ? "Welcome! I'm Nemo" : cfg.moodText;
    }
    const popHeading = $("#popoverHeading");
    if (popHeading) popHeading.textContent = cfg.heading;
    const popContext = $("#popoverContextText");
    if (popContext) popContext.textContent = cfg.context;

    const bubble = $("#nemoMoodBubble");
    if (bubble && !hasExpr) {
      bubble.classList.add("active");
      clampOverlayInViewport(bubble, 10);
      clearTimeout(bubble._timer);
      bubble._timer = setTimeout(() => bubble.classList.remove("active"), 3200);
    }
  }

  onActiveSectionChange = updateNemoView;

  const vw = () => document.documentElement.clientWidth || window.innerWidth || 360;
  const vh = () => document.documentElement.clientHeight || window.innerHeight || 640;
  let isHeroDocked = false;
  let userDragged = false;
  let scrollRaf = null;
  let scrollTimeout = null;

  let clampAfterTransTimer = null;
  function clampNemoOverlays(scheduleFollowUp = true) {
    if (pop && !pop.hidden) clampOverlayInViewport(pop, 10);
    const voiceBubble = $("#nemoVoiceBubble");
    if (voiceBubble && !voiceBubble.hidden) clampOverlayInViewport(voiceBubble, 10);
    const moodBubble = $("#nemoMoodBubble");
    if (moodBubble && moodBubble.classList.contains("active")) clampOverlayInViewport(moodBubble, 10);
    if (scheduleFollowUp) {
      clearTimeout(clampAfterTransTimer);
      clampAfterTransTimer = setTimeout(() => clampNemoOverlays(false), 260);
    }
  }

  function syncPopoverDirection(r, b) {
    if (!widget) return;
    const w = vw();
    const orbEl = orb || widget;
    const orbW = orbEl.offsetWidth || 74;
    const leftDist = w - r - orbW;
    if (w <= 480) {
      // On narrow mobile screens, flip anchor side if orb is dragged left of center
      const orbCenterX = w - r - (orbW / 2);
      widget.classList.toggle("popover-on-right", orbCenterX < w / 2);
    } else if (leftDist < 350) {
      widget.classList.add("popover-on-right");
    } else {
      widget.classList.remove("popover-on-right");
    }

    // When Nemo is placed near the top edge of the viewport, flip voice bubble downward
    const orbH = orbEl.offsetHeight || 74;
    const topDist = vh() - b - orbH;
    if (topDist < 160) {
      widget.classList.add("voice-bubble-below");
    } else {
      widget.classList.remove("voice-bubble-below");
    }
    clampNemoOverlays();
  }

  const place = (r, b) => {
    if (isHeroDocked) {
      widget.style.right = Math.round(r) + "px";
      widget.style.bottom = Math.round(b) + "px";
      widget.style.left = "auto";
      widget.style.top = "auto";
      widget.classList.remove("popover-on-right", "voice-bubble-below");
      clampNemoOverlays();
      return;
    }

    const w = vw();
    const isMobile = w <= 640;
    const orbSize = isMobile ? 60 : (w <= 760 ? 64 : 74);
    const minInset = isMobile ? 12 : 18;
    const maxR = Math.max(minInset, w - orbSize - minInset);
    const maxB = Math.max(minInset, vh() - orbSize - minInset);

    const clampedR = clamp(Math.round(r), minInset, maxR);
    const clampedB = clamp(Math.round(b), minInset, maxB);

    widget.style.right = clampedR + "px";
    widget.style.bottom = clampedB + "px";
    widget.style.left = "auto";
    widget.style.top = "auto";

    syncPopoverDirection(clampedR, clampedB);
  };

  const current = () => {
    const orbEl = orb || widget;
    const rc = orbEl.getBoundingClientRect();
    if (rc.width > 0 && rc.right > 0) {
      return { r: vw() - rc.right, b: vh() - rc.bottom };
    }
    const rVal = parseFloat(widget.style.right) || 22;
    const bVal = parseFloat(widget.style.bottom) || 22;
    return { r: rVal, b: bVal };
  };

  function getHeroDockCoords() {
    const anchor = document.getElementById("heroMascotAnchor");
    if (!anchor) return null;
    const r = anchor.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return null;

    const isMobile = window.innerWidth <= 640;
    const heroOrbSize = isMobile ? 114 : 156;

    const centerX = r.left + r.width / 2;
    const centerY = r.top + r.height / 2;

    const right = window.innerWidth - centerX - (heroOrbSize / 2);
    const bottom = window.innerHeight - centerY - (heroOrbSize / 2);

    return { r: right, b: bottom };
  }

  let morphTimer = null;
  function triggerMorphState() {
    widget.classList.add("is-morphing");
    const pupils = orb.querySelectorAll(".nemo-pupil");
    pupils.forEach((p) => {
      p.style.transform = "translate(0px, 0px)";
    });
    clearTimeout(morphTimer);
    morphTimer = setTimeout(() => {
      widget.classList.remove("is-morphing");
    }, 540);
  }

  function syncNemoPosition() {
    if (drag) return;
    if (widget.classList.contains("hidden")) return;

    const tourRunning = document.body.classList.contains("tour-active");
    const tourMascotStep = document.body.classList.contains("tour-step-mascot");
    if (tourRunning && !tourMascotStep) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const anchor = document.getElementById("heroMascotAnchor");
    const anchorRect = anchor ? anchor.getBoundingClientRect() : null;

    // Expand into Hero when near top of page (or during Tour Step 1) and anchor is on screen
    const isAtHome = (tourMascotStep || (!userDragged && scrollY < 65)) && anchorRect && anchorRect.bottom > 40 && anchorRect.width > 0;

    if (isAtHome) {
      const coords = getHeroDockCoords();
      if (coords) {
        if (!isHeroDocked) {
          isHeroDocked = true;
          triggerMorphState();
          widget.classList.add("hero-docked");
          pop.hidden = true;
          const moodText = $("#nemoMoodText");
          if (moodText && currentActiveSection === "chatPanel" && (!orb || !orb.hasAttribute("data-expression"))) {
            moodText.textContent = "Welcome! I'm Nemo";
          }
        }
        place(coords.r, coords.b);
        return;
      }
    }

    // Shrink into floating companion mode when scrolled down
    if (isHeroDocked) {
      isHeroDocked = false;
      triggerMorphState();
      widget.classList.remove("hero-docked");
      const cfg = NEMO_SECTION_EXPRESSIONS[currentActiveSection] || NEMO_SECTION_EXPRESSIONS.chatPanel;
      const moodText = $("#nemoMoodText");
      if (moodText && (!orb || !orb.hasAttribute("data-expression"))) moodText.textContent = cfg.moodText;
    }

    const floatR = typeof saved.right === "number" ? saved.right : 22;
    const floatB = typeof saved.bottom === "number" ? saved.bottom : 22;
    place(floatR, floatB);
  }

  const handleScroll = () => {
    widget.classList.add("is-scrolling");
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      widget.classList.remove("is-scrolling");
    }, 120);

    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(syncNemoPosition);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });

  const keepInView = () => {
    if (isHeroDocked) {
      syncNemoPosition();
    } else {
      const c = current();
      place(c.r, c.b);
    }
  };
  addEventListener("resize", keepInView);
  window.addEventListener("nemo:display-adapt", keepInView);
  window.addEventListener("orientationchange", keepInView);
  window.addEventListener("nemo:sync-dock", () => {
    userDragged = false;
    syncNemoPosition();
  });

  const save = () => {
    if (isHeroDocked) return;
    const c = current();
    store.set("nemo.widget.v1", { right: c.r, bottom: c.b, compact: widget.classList.contains("compact") });
  };

  /* Interactive Live Gaze: Pupils subtly follow mouse cursor & recenter smoothly */
  const recenterPupils = () => {
    if (!orb || orb.hasAttribute("data-expression")) return;
    orb.querySelectorAll(".nemo-pupil").forEach((p) => {
      p.style.transform = "";
    });
  };
  window.addEventListener("pointermove", (e) => {
    if (reduceMotion) return;
    if (widget.classList.contains("is-morphing") || widget.classList.contains("dragging")) return;
    if (orb && orb.hasAttribute("data-expression")) return; // Preserve active emotional expression gaze
    const rc = orb.getBoundingClientRect();
    if (!rc.width) return;
    const cx = rc.left + rc.width / 2;
    const cy = rc.top + rc.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < 650) {
      const mobileScreen = vw() <= 640;
      const maxOffset = isHeroDocked ? (mobileScreen ? 3.2 : 4.5) : (mobileScreen ? 1.8 : 2.5);
      const px = (dx / (dist || 1)) * Math.min(dist / 45, maxOffset);
      const py = (dy / (dist || 1)) * Math.min(dist / 45, maxOffset);
      const pupils = orb.querySelectorAll(".nemo-pupil");
      pupils.forEach((p) => {
        p.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
      });
    } else {
      recenterPupils();
    }
  }, { passive: true });
  document.addEventListener("pointerleave", recenterPupils);
  window.addEventListener("blur", recenterPupils);

  orb.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const c = current();
    drag = { x: e.clientX, y: e.clientY, r: c.r, b: c.b };
    moved = false;
    orb.setPointerCapture(e.pointerId);
  });
  orb.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    const dist = Math.hypot(dx, dy);
    if (!moved && dist > 6) {
      moved = true;
      userDragged = true;
      widget.classList.add("dragging");
      if (isHeroDocked) {
        isHeroDocked = false;
        widget.classList.remove("hero-docked");
        triggerMorphState();
      }
    }
    if (moved) place(drag.r - dx, drag.b - dy);
  });
  const end = (e) => {
    if (!drag) return;
    drag = null;
    widget.classList.remove("dragging");
    try { orb.releasePointerCapture(e.pointerId); } catch (_) {}
    if (moved) {
      justDragged = true;
      setTimeout(() => { justDragged = false; }, 80);
      save();
    }
  };
  orb.addEventListener("pointerup", end);
  orb.addEventListener("pointercancel", end);

  // Initial position check
  setTimeout(syncNemoPosition, 50);

  orb.addEventListener("pointerenter", () => {
    if (typeof window.__nemoPrewarmOrbAudio === "function") window.__nemoPrewarmOrbAudio();
  }, { passive: true });

  /* click (not pointerup) handles taps so keyboard users can use Enter or Space */
  orb.addEventListener("click", () => {
    if (justDragged) return;
    if (typeof window.__nemoPrewarmOrbAudio === "function") window.__nemoPrewarmOrbAudio();
    if (isHeroDocked) {
      if (typeof triggerNemoReaction === "function") {
        triggerNemoReaction({
          expression: "celebrate",
          icon: "✨",
          text: "✨ Ready to explore chemistry with you!",
          badge: "Nemo 3D",
          duration: 3200,
          chime: "correct"
        });
      }
      return;
    }

    if (typeof triggerNemoReaction === "function" && pop.hidden) {
      triggerNemoReaction({
        expression: "happy",
        icon: "👋",
        text: "Hi! Need help with chemistry concepts?",
        badge: "Nemo 3D",
        duration: 2800,
        chime: "tip"
      });
    }
    if (widget.classList.contains("compact")) {
      widget.classList.remove("compact");
      pop.hidden = false;
    } else {
      pop.hidden = !pop.hidden;
    }
    keepInView();
    save();
  });

  safeOn("#closePopover", "click", () => { pop.hidden = true; save(); });
  const exitPopBtn = $("#exitPopoverBtn");
  if (exitPopBtn) exitPopBtn.addEventListener("click", () => { pop.hidden = true; save(); });
  safeOn("#minimizeWidget", "click", () => {
    widget.classList.add("compact");
    pop.hidden = true;
    save();
  });
  safeOn("#jumpToChat", "click", () => {
    pop.hidden = true;
    if (typeof window.ensurePanelVisible === "function") {
      window.ensurePanelVisible("chatPanel");
    }
    const chatPanel = $("#chatPanel");
    if (chatPanel) chatPanel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (input) input.focus({ preventScroll: true });
    updateNemoView("chatPanel");
  });

  $$(".qn-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      if (typeof window.ensurePanelVisible === "function") {
        window.ensurePanelVisible(targetId);
      }
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        pop.hidden = true;
        targetEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        updateNemoView(targetId);
        save();
      }
    });
  });

  const readTipBtn = $("#readSectionHint");
  if (readTipBtn) {
    readTipBtn.addEventListener("pointerenter", () => prewarmCurrentSectionTip(), { passive: true });
    readTipBtn.addEventListener("click", () => {
      const cfg = NEMO_SECTION_EXPRESSIONS[currentActiveSection] || NEMO_SECTION_EXPRESSIONS.chatPanel;
      pop.hidden = true;
      playNemoChime("tip");
      const bubble = $("#nemoVoiceBubble");
      const textEl = $("#nemoVoiceText");
      const catEl = $("#nvbCategory");
      if (bubble && textEl) {
        bubble.hidden = false;
        bubble.classList.add("active", "is-speaking");
        textEl.innerHTML = inlineMd(cfg.tip);
        if (catEl) catEl.textContent = cfg.badge || "Section Tip";
        clampOverlayInViewport(bubble, 10);
      }
      if (typeof triggerNemoReaction === "function") {
        triggerNemoReaction({
          expression: "happy",
          icon: cfg.moodIcon || "💡",
          text: cfg.badge || "Section Tip",
          badge: "Tip",
          duration: 4500
        });
      }
      NemoSpeechEngine.play(cfg.tip, { voiceBubble: bubble });
    });
  }

  const updateFloatToggle = () => {
    const isVisible = !widget.classList.contains("hidden");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(isVisible));
      toggle.classList.toggle("active", isVisible);
      toggle.innerHTML = `<span class="btn-icon">◉</span> Floating Nemo`;
    }
    if (mobileToggle) {
      mobileToggle.setAttribute("aria-pressed", String(isVisible));
      mobileToggle.classList.toggle("active", isVisible);
    }
  };
  const handleToggle = () => {
    const hide = !widget.classList.contains("hidden");
    widget.classList.toggle("hidden", hide);
    updateFloatToggle();
    if (toggle) {
      toggle.classList.add("toggle-animate");
      setTimeout(() => toggle.classList.remove("toggle-animate"), 600);
    }
    if (mobileToggle) {
      mobileToggle.classList.add("toggle-animate");
      setTimeout(() => mobileToggle.classList.remove("toggle-animate"), 600);
    }
  };
  if (toggle) toggle.addEventListener("click", handleToggle);
  if (mobileToggle) mobileToggle.addEventListener("click", handleToggle);
  updateFloatToggle();
  NemoOverlay.register("popover", {
    isOpen: () => Boolean(pop && !pop.hidden),
    close: (restore) => {
      if (!pop) return;
      pop.hidden = true;
      if (restore && orb) orb.focus({ preventScroll: true });
    }
  });

  // Initialize with initial view
  updateNemoView("chatPanel");
})();

/* ============================== Founder Tribute & Workspace Filters ============================== */
(function setupFounderAndWorkspace() {
  const modal = $("#founderModal");
  const closeBtn = $("#closeFounderModal");
  const closeBtnBottom = $("#closeFounderModalBottom");
  const celebrateBtn = $("#celebrateFounderBtn");
  const countEl = $("#celebrateCount");
  const askBtn = $("#askNemoAboutFounderBtn");
  let founderLastTrigger = null;

  let count = Number(store.get("nemo.celebrate.count", 142));
  if (countEl) countEl.textContent = String(count);

  function openFounderModal() {
    if (!modal) return;
    if (document.activeElement && document.activeElement !== document.body && !modal.contains(document.activeElement)) {
      founderLastTrigger = document.activeElement;
    }
    modal.hidden = false;
    NemoOverlay.syncBodyScrollLock();
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }
  function closeFounderModal(restoreFocus = false) {
    if (!modal) return;
    modal.hidden = true;
    NemoOverlay.syncBodyScrollLock();
    if (restoreFocus && founderLastTrigger && document.contains(founderLastTrigger)) {
      founderLastTrigger.focus({ preventScroll: true });
    }
    founderLastTrigger = null;
  }
  window.closeFounderModal = closeFounderModal;

  NemoOverlay.register("founder", {
    isOpen: () => Boolean(modal && !modal.hidden),
    close: (restore) => closeFounderModal(Boolean(restore)),
    getFocusRoot: () => modal ? (modal.querySelector(".modal-card, .founder-modal-card") || modal) : null
  });

  const founderTriggers = ["#founderNavBtn", "#openFounderHeroBtn", "#openFounderTopBtn", "#openFounderIslandBtn"];
  founderTriggers.forEach((sel) => {
    const btn = $(sel);
    if (btn) btn.addEventListener("click", openFounderModal);
  });

  /* Left Sidebar Navigation Controls (Mobile & Desktop) */
  const mobileMenuBtn = $("#mobileMenuBtn");
  const desktopSidebarToggleBtn = $("#desktopSidebarToggleBtn");
  const sidebar = $("#appSidebar");
  const appShell = document.querySelector(".app-shell");
  const backdrop = $("#sidebarBackdrop");
  const sidebarCloseBtn = $("#sidebarCloseBtn");
  let sidebarLastTrigger = null;

  function openSidebar() {
    if (!sidebar) return;
    if (document.activeElement && document.activeElement !== document.body && !sidebar.contains(document.activeElement)) {
      sidebarLastTrigger = document.activeElement;
    }
    sidebar.classList.add("open");
    if (backdrop) backdrop.classList.add("active");
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.add("active");
      mobileMenuBtn.setAttribute("aria-expanded", "true");
    }
    if (window.innerWidth <= 1024 && sidebarCloseBtn) {
      sidebarCloseBtn.focus({ preventScroll: true });
    }
  }
  function closeSidebar(restoreFocus = false) {
    if (!sidebar) return;
    sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("active");
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.remove("active");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
    }
    if (restoreFocus) {
      const targetFocus = (sidebarLastTrigger && document.contains(sidebarLastTrigger)) ? sidebarLastTrigger : mobileMenuBtn;
      if (targetFocus) targetFocus.focus({ preventScroll: true });
    }
    sidebarLastTrigger = null;
  }
  NemoOverlay.register("sidebar", {
    isOpen: () => Boolean(sidebar && sidebar.classList.contains("open") && window.innerWidth <= 1024),
    close: (restore) => closeSidebar(Boolean(restore)),
    getFocusRoot: () => sidebar
  });

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      if (sidebar && sidebar.classList.contains("open")) {
        closeSidebar(true);
      } else {
        openSidebar();
      }
    });
  }
  if (desktopSidebarToggleBtn && appShell) {
    let sidebarSyncRaf = 0;
    const syncDuringSidebarAnim = () => {
      if (sidebarSyncRaf) cancelAnimationFrame(sidebarSyncRaf);
      const t0 = performance.now();
      const tick = () => {
        window.dispatchEvent(new CustomEvent("nemo:sync-dock"));
        if (performance.now() - t0 < 380) {
          sidebarSyncRaf = requestAnimationFrame(tick);
        }
      };
      sidebarSyncRaf = requestAnimationFrame(tick);
    };
    appShell.addEventListener("transitionend", (e) => {
      if (e.target === appShell && e.propertyName === "grid-template-columns") {
        window.dispatchEvent(new CustomEvent("nemo:sync-dock"));
      }
    });
    desktopSidebarToggleBtn.addEventListener("click", () => {
      const isCollapsed = appShell.classList.toggle("sidebar-collapsed");
      desktopSidebarToggleBtn.setAttribute("aria-expanded", String(!isCollapsed));
      desktopSidebarToggleBtn.title = isCollapsed ? "Expand left sidebar navigation" : "Collapse left sidebar navigation";
      syncDuringSidebarAnim();
    });
  }
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener("click", () => closeSidebar(true));
  if (backdrop) backdrop.addEventListener("click", () => closeSidebar(true));
  $$(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 1024) closeSidebar(false);
    });
  });

  /* Sync initial mobile island status indicator (setMode handles live updates) */
  const mobileDot = $("#mobileStatusDot");
  const modeDot = $("#modeDot");
  if (mobileDot && modeDot) {
    mobileDot.className = "island-status-dot" + (modeDot.classList.contains("live") ? " live" : "");
  }

  if (closeBtn) closeBtn.addEventListener("click", () => closeFounderModal(true));
  if (closeBtnBottom) closeBtnBottom.addEventListener("click", () => closeFounderModal(true));
  const sidebarExitBtnMobile = $("#sidebarExitBtnMobile");
  if (sidebarExitBtnMobile) sidebarExitBtnMobile.addEventListener("click", () => closeSidebar(true));
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeFounderModal(true);
    });
  }

  if (celebrateBtn) {
    celebrateBtn.addEventListener("click", () => {
      count++;
      store.set("nemo.celebrate.count", count);
      if (countEl) countEl.textContent = String(count);
      celebrateBtn.classList.add("celebrated");
      setTimeout(() => celebrateBtn.classList.remove("celebrated"), 600);
    });
  }

  if (askBtn) {
    askBtn.addEventListener("click", () => {
      closeFounderModal();
      if (typeof window.ensurePanelVisible === "function") {
        window.ensurePanelVisible("chatPanel");
      }
      $("#chatPanel").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      askNemo("Who created and engineered Nemo Chemistry Tutor? Tell me about the founder J.Sanjay.", { topic: "founder" });
    });
  }

  /* Workspace Filter Tabs */
  const tabBtns = $$(".ws-tab");
  const filterStatusBar = $("#workspaceFilterStatus");
  const filterStatusText = $("#filterStatusText");
  const exitFilterBtn = $("#exitFilterBtn");

  if (exitFilterBtn) {
    exitFilterBtn.addEventListener("click", () => {
      const allTab = document.querySelector('.ws-tab[data-filter="all"]');
      if (allTab) allTab.click();
    });
  }

  const panels = {
    tutor: ["chatPanel", "moleculePanel"],
    practice: ["practicePanel", "analyticsPanel"],
    portals: ["pyqPanel", "practicePanel"],
    library: ["libraryPanel", "canvasPanel"],
    periodic: ["periodicPanel"],
    pyq: ["pyqPanel"],
    "pyq-analytics": ["pyqAnalyticsPanel"],
    formulas: ["formulasPanel"]
  };
  const allPanelIds = ["chatPanel", "moleculePanel", "practicePanel", "analyticsPanel", "canvasPanel", "libraryPanel", "periodicPanel", "pyqPanel", "pyqAnalyticsPanel", "formulasPanel"];

  const workspaceEl = document.querySelector(".workspace");
  const tabListArr = Array.from(tabBtns);
  let lastTabIndex = Math.max(0, tabListArr.findIndex((b) => b.classList.contains("active")));

  tabBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      const prevIdx = lastTabIndex;
      const filter = btn.dataset.filter || "all";
      const prevFilter = workspaceEl ? (workspaceEl.dataset.filter || "all") : "all";
      lastTabIndex = idx;

      tabBtns.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      if (workspaceEl) workspaceEl.dataset.filter = filter;

      const shownIds = [];
      allPanelIds.forEach((id) => {
        const p = document.getElementById(id);
        if (!p) return;
        const shouldShow = filter === "all" || (panels[filter] || []).includes(id);
        p.style.display = shouldShow ? "" : "none";
        if (shouldShow) shownIds.push(id);
      });

      if (filter !== prevFilter && typeof window.animateWorkspacePanelsEntrance === "function") {
        const dir = filter === "all" ? 0 : Math.sign(idx - prevIdx);
        window.animateWorkspacePanelsEntrance(shownIds, dir);
      }

      if (filterStatusBar && filterStatusText) {
        if (filter === "all") {
          filterStatusBar.hidden = true;
        } else {
          filterStatusBar.hidden = false;
          const tabLabel = btn.textContent.trim();
          const activeCount = (panels[filter] || []).length;
          filterStatusText.textContent = `${tabLabel} (${activeCount} active ${activeCount === 1 ? "module" : "modules"})`;
        }
      }

      if (filter === "portals") {
        if (typeof window.focusGoldHub === "function") {
          window.focusGoldHub();
        } else {
          const hub = document.getElementById("pyqGoldHub");
          if (hub) hub.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }
        return;
      }

      const targetId = filter === "all" ? "chatPanel" : (panels[filter] && panels[filter][0]) || "chatPanel";
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });
})();

/* ============================== Visual Effects Toggle (✦ Effects) ============================== */
(function setupEffects() {
  const effectsToggle = $("#effectsToggle");
  const mobileEffectsBtn = $("#mobileEffectsBtn");
  let enabled = store.get("nemo.effects.enabled", true) !== false;

  function paintEffects() {
    document.body.classList.toggle("no-effects", !enabled);
    if (effectsToggle) {
      effectsToggle.setAttribute("aria-pressed", String(enabled));
      effectsToggle.classList.toggle("active", enabled);
      effectsToggle.innerHTML = `<span class="btn-icon">${enabled ? "✦" : "✧"}</span> Effects`;
    }
    if (mobileEffectsBtn) {
      mobileEffectsBtn.setAttribute("aria-pressed", String(enabled));
      mobileEffectsBtn.classList.toggle("active", enabled);
      mobileEffectsBtn.innerHTML = `<span class="btn-icon">${enabled ? "✦" : "✧"}</span>`;
    }
  }

  function toggleEffects() {
    enabled = !enabled;
    store.set("nemo.effects.enabled", enabled);
    paintEffects();
    [effectsToggle, mobileEffectsBtn].forEach((btn) => {
      if (btn) {
        btn.classList.add("toggle-animate");
        setTimeout(() => btn.classList.remove("toggle-animate"), 600);
      }
    });
  }

  if (effectsToggle) effectsToggle.addEventListener("click", toggleEffects);
  if (mobileEffectsBtn) mobileEffectsBtn.addEventListener("click", toggleEffects);
  paintEffects();
})();

/* ============================== Zero-Latency Reactive Button Motion & Haptic Pipeline ============================== */
(function setupButtonAnimations() {
  // Ultra-fast zero-latency button reactance without DOM-mutating reflows
  document.addEventListener("pointerdown", (e) => {
    const btn = e.target.closest("button, .btn-row a, .nav-item, .ws-tab, .formula-card, .opt, .tool, [role='button'], .qn-btn");
    if (!btn || btn.disabled) return;

    // Optional gentle haptic pulse on mobile touch devices
    if (e.pointerType === "touch" && typeof navigator.vibrate === "function") {
      try { navigator.vibrate(6); } catch (_) {}
    }
  }, { passive: true });

  // Spring release pop on pointer up without interrupting active depression
  document.addEventListener("pointerup", (e) => {
    const btn = e.target.closest("button, .btn-row a, .nav-item, .ws-tab, .formula-card, .opt, .tool, [role='button'], .qn-btn");
    if (!btn || btn.disabled) return;

    btn.classList.add("btn-clicked");
    setTimeout(() => {
      btn.classList.remove("btn-clicked");
    }, 200);
  }, { passive: true });
})();

/* ============================== Universal Aspect Ratio & Multi-Display Auto-Adapter ============================== */
(function setupUniversalAspectAdapter() {
  let resizeTimer = null;
  let manualProjector = store.get("nemo.projector.v1", false) === true;

  function syncProjectorButtons(isActive) {
    const btn = $("#projectorToggle");
    const mBtn = $("#mobileProjectorBtn");
    [btn, mBtn].forEach((b) => {
      if (b) {
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-pressed", String(isActive));
      }
    });
  }

  function detectAndAdapt() {
    const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 1024;
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 768;
    const ratio = Math.round((w / (h || 1)) * 100) / 100;
    let mode = "standard-16-9";

    const isAutoProjector = (ratio <= 1.36 && ratio >= 1.15 && w >= 641);

    if (manualProjector || isAutoProjector) {
      mode = "projector-4-3";
    } else if (ratio >= 3.0) {
      mode = "ultrawide-32-9";
    } else if (ratio >= 2.05 || w >= 2200) {
      mode = "ultrawide-21-9";
    } else if (ratio < 1.15 && ratio >= 0.85 && w >= 641) {
      mode = "square-display";
    } else if (ratio < 0.85 && w >= 601) {
      mode = "tablet-portrait";
    } else if (w <= 600) {
      mode = "mobile-portrait";
    } else if (ratio >= 1.5) {
      mode = "standard-16-9";
    } else {
      mode = "balanced-aspect";
    }

    const docEl = document.documentElement;
    const isProjectorActive = mode === "projector-4-3";
    docEl.setAttribute("data-projector-active", String(isProjectorActive));

    if (docEl.getAttribute("data-aspect-mode") !== mode) {
      docEl.setAttribute("data-aspect-mode", mode);
    }
    docEl.setAttribute("data-aspect-ratio", ratio.toFixed(2));
    docEl.setAttribute("data-screen-w", String(w));
    docEl.setAttribute("data-screen-h", String(h));

    syncProjectorButtons(isProjectorActive);

    // Fast dispatch to canvas, 3D viewers, and widget positioning
    window.dispatchEvent(new CustomEvent("nemo:display-adapt", {
      detail: { width: w, height: h, ratio, mode, isProjector: isProjectorActive }
    }));
  }

  function toggleProjectorMode() {
    manualProjector = !manualProjector;
    store.set("nemo.projector.v1", manualProjector);
    detectAndAdapt();
  }

  const pBtn = $("#projectorToggle");
  const pmBtn = $("#mobileProjectorBtn");
  if (pBtn) pBtn.addEventListener("click", toggleProjectorMode);
  if (pmBtn) pmBtn.addEventListener("click", toggleProjectorMode);

  // Shortcuts: Alt+P toggles Projector Mode, Alt+N focuses Nemo AI Tutor input
  window.addEventListener("keydown", (e) => {
    if (NemoOverlay.isAnyModalOpen()) return;
    if (e.altKey && (e.key === "p" || e.key === "P")) {
      e.preventDefault();
      toggleProjectorMode();
    } else if (e.altKey && (e.key === "n" || e.key === "N")) {
      e.preventDefault();
      if (typeof window.ensurePanelVisible === "function") {
        window.ensurePanelVisible("chatPanel");
      }
      const chatPanel = $("#chatPanel");
      if (chatPanel) {
        chatPanel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
      if (input) input.focus({ preventScroll: true });
    }
  });

  window.toggleProjectorMode = toggleProjectorMode;

  // Run immediately on boot
  detectAndAdapt();

  // Instant response on resize, orientationchange, and fullscreen toggle
  window.addEventListener("resize", () => {
    detectAndAdapt();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(detectAndAdapt, 60);
  }, { passive: true });

  window.addEventListener("orientationchange", () => {
    setTimeout(detectAndAdapt, 40);
    setTimeout(detectAndAdapt, 220);
  }, { passive: true });

  document.addEventListener("fullscreenchange", detectAndAdapt, { passive: true });
})();

/* ============================== Zero-Latency Quantum Cursor & Click Reaction Sparks/Fumes ============================== */
(function setupZeroLatencyCursor() {
  const cursor = document.getElementById("quantumCursor");
  const fxLayer = document.getElementById("cursorFxLayer");
  if (!cursor || !fxLayer) return;

  // Detect if fine pointer (mouse/stylus) is supported
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (!hasFinePointer) {
    cursor.style.display = "none";
    return;
  }

  let isHoveringInteractive = false;
  let isVisible = false;

  const FUME_GRADIENTS = [
    "radial-gradient(circle, rgba(103, 232, 249, 0.8) 0%, rgba(56, 189, 248, 0.45) 40%, rgba(14, 165, 233, 0) 70%)",
    "radial-gradient(circle, rgba(129, 140, 248, 0.75) 0%, rgba(99, 102, 241, 0.4) 45%, rgba(67, 56, 202, 0) 70%)",
    "radial-gradient(circle, rgba(251, 191, 36, 0.75) 0%, rgba(245, 158, 11, 0.35) 40%, rgba(217, 119, 6, 0) 70%)",
    "radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(186, 230, 253, 0.45) 45%, transparent 70%)",
    "radial-gradient(circle, rgba(45, 212, 191, 0.75) 0%, rgba(20, 184, 166, 0.35) 45%, transparent 70%)"
  ];

  const SPARK_COLORS = [
    "#ffffff",
    "#67e8f9",
    "#38bdf8",
    "#fde047",
    "#a5f3fc",
    "#818cf8",
    "#f472b6"
  ];

  function triggerSparkFumeReaction(x, y) {
    if (reduceMotion || document.body.classList.contains("no-effects")) return;

    const burst = document.createElement("div");
    burst.className = "fx-burst-origin";
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;

    // 1. Shockwave ionization ring
    const shockwave = document.createElement("div");
    shockwave.className = "fx-shockwave";
    burst.appendChild(shockwave);

    // 2. Star core flash
    const star = document.createElement("div");
    star.className = "fx-flash-star";
    burst.appendChild(star);

    // 3. Chemical vapor fume clouds (5 clouds billowing and curling outwards)
    const fumeCount = 5;
    for (let i = 0; i < fumeCount; i++) {
      const fume = document.createElement("div");
      fume.className = "fx-fume";
      const angle = (i / fumeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const dist = 26 + Math.random() * 32;
      const tx = Math.cos(angle) * dist;
      // Upward buoyant thermal drift for chemical fumes
      const ty = Math.sin(angle) * dist - (8 + Math.random() * 16);
      const rot = Math.round((Math.random() - 0.5) * 90);
      const scale = (2.2 + Math.random() * 1.2).toFixed(1);
      const dur = (0.65 + Math.random() * 0.22).toFixed(2);
      const bg = FUME_GRADIENTS[i % FUME_GRADIENTS.length];

      fume.style.setProperty("--tx", `${tx.toFixed(1)}px`);
      fume.style.setProperty("--ty", `${ty.toFixed(1)}px`);
      fume.style.setProperty("--rot", `${rot}deg`);
      fume.style.setProperty("--scale", scale);
      fume.style.setProperty("--dur", `${dur}s`);
      fume.style.background = bg;
      burst.appendChild(fume);
    }

    // 4. Kinetic plasma sparks (12 high-velocity radiating sparks)
    const sparkCount = 12;
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement("div");
      spark.className = "fx-spark";
      const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = 38 + Math.random() * 56;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist + (6 + Math.random() * 12);
      const dur = (0.42 + Math.random() * 0.22).toFixed(2);
      const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
      const angleDeg = Math.round((angle * 180) / Math.PI + 90);

      spark.style.setProperty("--tx", `${tx.toFixed(1)}px`);
      spark.style.setProperty("--ty", `${ty.toFixed(1)}px`);
      spark.style.setProperty("--angle", `${angleDeg}deg`);
      spark.style.setProperty("--dur", `${dur}s`);
      spark.style.setProperty("--spark-color", color);
      burst.appendChild(spark);
    }

    // Performance: clean up oldest bursts if rapid clicking produces excessive concurrent nodes
    while (fxLayer.children.length >= 3) {
      fxLayer.firstElementChild.remove();
    }
    fxLayer.appendChild(burst);

    // Auto cleanup after animation ends
    setTimeout(() => {
      burst.remove();
    }, 950);
  }

  // Immediate 0-latency tracking: executed synchronously on native pointermove tick
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;

    if (!isVisible) {
      isVisible = true;
      cursor.classList.add("visible");
    }

    // Direct GPU translate3d with zero delay or lerping lag
    cursor.style.transform = `translate3d(${e.clientX - 13}px, ${e.clientY - 13}px, 0)`;
  }, { passive: true });

  window.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return;
    cursor.classList.add("clicking");
    triggerSparkFumeReaction(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener("pointerup", () => {
    cursor.classList.remove("clicking");
  }, { passive: true });

  document.addEventListener("mouseleave", () => {
    isVisible = false;
    cursor.classList.remove("visible");
  });

  document.addEventListener("mouseenter", () => {
    isVisible = true;
    cursor.classList.add("visible");
  });

  // Expand cursor aura over interactive elements
  document.addEventListener("pointerover", (e) => {
    const target = e.target;
    if (target && target.closest && target.closest("a, button, input, select, textarea, [role='button'], summary, .formula-card, .ws-tab, .opt, .tool, .qn-btn, .nav-item")) {
      if (!isHoveringInteractive) {
        isHoveringInteractive = true;
        cursor.classList.add("hovering");
      }
    } else {
      if (isHoveringInteractive) {
        isHoveringInteractive = false;
        cursor.classList.remove("hovering");
      }
    }
  }, { passive: true });
})();

/* ============================== Interactive Step-by-Step Spotlight Feature Tour ============================== */
(function setupInteractiveSpotlightTour() {
  const tourModal = document.getElementById("appSpotlightTour");
  const tourBackdrop = document.getElementById("tourBackdrop");
  const tourCutout = document.getElementById("tourCutout");
  const tourCard = document.getElementById("tourCard");
  const tourArrow = document.getElementById("tourArrow");
  const tourStepBadge = document.getElementById("tourStepBadge");
  const tourCategory = document.getElementById("tourCategory");
  const tourTargetTag = document.getElementById("tourTargetTag");
  const tourStepTitle = document.getElementById("tourStepTitle");
  const tourStepDesc = document.getElementById("tourStepDesc");
  const tourStepAction = document.getElementById("tourStepAction");
  const tourKeysList = document.getElementById("tourKeysList");
  const tourDotsList = document.getElementById("tourDotsList");
  const tourPrevBtn = document.getElementById("tourPrevBtn");
  const tourNextBtn = document.getElementById("tourNextBtn");
  const tourSkipBtn = document.getElementById("tourSkipBtn");
  const tourCloseBtn = document.getElementById("tourCloseBtn");
  const startTourBtn = document.getElementById("startTourBtn");
  const mobileTourBtn = document.getElementById("mobileTourBtn");
  const sidebarTourBtn = document.getElementById("sidebarTourBtn");
  const popoverTourBtn = document.getElementById("popoverTourBtn");
  const welcomePrompt = document.getElementById("tourWelcomePrompt");
  const welcomeStartTourBtn = document.getElementById("welcomeStartTourBtn");
  const welcomeDismissTourBtn = document.getElementById("welcomeDismissTourBtn");

  if (!tourModal || !tourCutout || !tourCard) return;

  const TOUR_STEPS = [
    {
      target: "#heroMascotAnchor",
      fallbackTarget: ".hero",
      panelId: null,
      category: "AI TUTOR",
      badge: "Mascot Companion",
      title: "Nemo: 3D Chemistry Tutor",
      desc: "Your Gemini 4 Hydrogen chemistry mentor with interactive eye-tracking physics and mood feedback across every section.",
      action: "Click Nemo's orb for voice tips & quick jumps, drag him anywhere, or press Alt + N anytime.",
      keys: [
        { key: "Click Orb", desc: "Quick menu" },
        { key: "Drag", desc: "Move Nemo" },
        { key: "Alt + N", desc: "Focus tutor" }
      ]
    },
    {
      target: "#chatPanel .prompt-row",
      fallbackTarget: "#chatPanel",
      panelId: "chatPanel",
      category: "REASONING ENGINE",
      badge: "Deep Mechanism Chat",
      title: "Chemistry Chat & Derivations",
      desc: "Solve organic mechanisms (SN1, SN2, Aldol), IUPAC names, and Nernst numericals with clear KaTeX math and structured tables.",
      action: "Type a question, pick CBSE / JEE / Research depth, or click any mechanism chip.",
      keys: [
        { key: "Enter", desc: "Send" },
        { key: "Shift + Enter", desc: "New line" },
        { key: "🎙", desc: "Voice input" },
        { key: "🔊", desc: "Read aloud" }
      ]
    },
    {
      target: "#diagramModeBtn",
      fallbackTarget: "#chatPanel",
      panelId: "chatPanel",
      category: "STUDY DIAGRAM STUDIO",
      badge: "2D Visual Generator",
      title: "Curved-Arrow 2D Study Diagrams",
      desc: "Toggle 🎨 Study Diagram mode to generate clean 2D organic mechanisms with curved electron-pushing arrows and transition states.",
      action: "Enable 🎨 Study Diagram or click 🎨 Study Diagram on any Nemo reply, then Expand or Save PNG.",
      keys: [
        { key: "🎨 Study Diagram", desc: "Diagram mode" },
        { key: "🔍 Expand", desc: "Lightbox zoom" },
        { key: "⇩ Save PNG", desc: "Export image" }
      ]
    },
    {
      target: "#moleculeViewer",
      fallbackTarget: "#moleculePanel",
      panelId: "moleculePanel",
      category: "3D LAB",
      badge: "3D Molecule & Crystal Lab",
      title: "Interactive 3D Molecular Viewer",
      desc: "Inspect 124+ offline VSEPR geometries, crystal unit cells, and stereoisomers or fetch any PubChem structure live.",
      action: "Drag to rotate 360°, scroll or pinch to zoom, and toggle lone-pair lobes or labels.",
      keys: [
        { key: "Drag", desc: "Rotate 3D" },
        { key: "Scroll / Pinch", desc: "Zoom" },
        { key: "Filter", desc: "Search molecules" }
      ]
    },
    {
      target: "#quizBody",
      fallbackTarget: "#practicePanel",
      panelId: "practicePanel",
      category: "PRACTICE",
      badge: "Adaptive Practice Quiz",
      title: "Topic Quiz & Instant Grading",
      desc: "Drill Physical, Organic, and Inorganic questions with instant validation and KaTeX step-by-step solutions.",
      action: "Click an option A–D or press keys 1–4 for immediate feedback and next-question flow.",
      keys: [
        { key: "1–4 / A–D", desc: "Pick option" },
        { key: "Enter", desc: "Next question" },
        { key: "Branch Filter", desc: "Focus topic" }
      ]
    },
    {
      target: "#statRow",
      fallbackTarget: "#analyticsPanel",
      panelId: "analyticsPanel",
      category: "ANALYTICS",
      badge: "Mastery Radar",
      title: "Study Analytics & Weak Spots",
      desc: "Track live accuracy and streaks across Physical, Organic, and Inorganic chapters to spot weak concepts early.",
      action: "Check weak-chapter bars below and click Ask Nemo for a targeted study plan.",
      keys: [
        { key: "Stats Cards", desc: "Live accuracy" },
        { key: "Reset Stats", desc: "Start fresh" }
      ]
    },
    {
      target: "#canvasPanel .panel-head",
      fallbackTarget: "#canvasPanel",
      panelId: "canvasPanel",
      category: "CANVAS STUDIO",
      badge: "Blackboard & Study Tables",
      title: "Reaction Blackboard & Table Canvas",
      desc: "Switch between freehand curved-arrow sketching (Draw Mode) and interactive structured Study Tables with Quiz Mask.",
      action: "Use Pen/Arrow to sketch mechanisms, or click ⊞ Table Canvas to filter, mask cells, and export CSV/Markdown.",
      keys: [
        { key: "Pen / Arrow", desc: "Draw & annotate" },
        { key: "⊞ Table Canvas", desc: "Quiz Mask & CSV" },
        { key: "Save PNG", desc: "Download sketch" }
      ]
    },
    {
      target: "#libraryPanel .panel-head",
      fallbackTarget: "#libraryPanel",
      panelId: "libraryPanel",
      category: "LIBRARY & RECALL",
      badge: "Rules, Traps & Flashcards",
      title: "Rules, Exceptions & ⚡ Flashcards",
      desc: "Search reaction rules, reagents, and JEE/CBSE exam traps—or switch to ⚡ Flashcards for active recall mastery tracking.",
      action: "Toggle ⚡ Flashcards, press Space to flip cards, and mark 1 (Needs Review) or 2 (Got It).",
      keys: [
        { key: "⚡ Flashcards", desc: "Active recall" },
        { key: "Space", desc: "Flip card" },
        { key: "1 / 2", desc: "Review / Got It" }
      ]
    },
    {
      target: "#pyqPanel .panel-head",
      fallbackTarget: "#pyqPanel",
      panelId: "pyqPanel",
      category: "EXAM ARCHIVE",
      badge: "PYQs & Gold Portals",
      title: "10-Yr PYQs & SelfStudys",
      desc: "Solve JEE Main, Advanced & CBSE PYQs (2016–2026) with numerical inputs and Gold Exam Portals.",
      action: "Filter by exam or open ★ Gold Exam Portals for SelfStudys Class 12 NCERT Chemistry notes & official archives.",
      keys: [
        { key: "★ Gold Portals", desc: "SelfStudys & PYQs" },
        { key: "Filters", desc: "Exam & year" },
        { key: "1–4", desc: "Quick answer" }
      ]
    },
    {
      target: "#pyqAnalyticsPanel .panel-head",
      fallbackTarget: "#pyqAnalyticsPanel",
      panelId: "pyqAnalyticsPanel",
      category: "EXAM STRATEGY",
      badge: "PYQ Pattern & ROI",
      title: "PYQ Pattern Analysis & ROI Heat Map",
      desc: "Inspect 2016–2026 year-wise shifts, chapter ROI tiers (High ROI vs. Core Anchor), and clickable chapter×year frequency heat maps.",
      action: "Filter by exam track, branch, or ROI tier, then click any heat cell or quadrant node to launch targeted PYQs.",
      keys: [
        { key: "ROI Quadrant", desc: "Click node to inspect" },
        { key: "Heat Cell", desc: "Drill chapter × year" }
      ]
    },
    {
      target: "#formulasPanel .panel-head",
      fallbackTarget: "#formulasPanel",
      panelId: "formulasPanel",
      category: "REFERENCE & TOOLS",
      badge: "Formula Bank & Display",
      title: "Formula Bank & Display Controls",
      desc: "Filter Physical, Organic & Inorganic equations by chapter with symbol notes, LaTeX copy, and Derive-in-Chat links.",
      action: "Tap 📋 Copy LaTeX on any card, or toggle 📽️ Projector (4:3) & ✦ Effects in the top bar.",
      keys: [
        { key: "📋 Copy LaTeX", desc: "Copy equation" },
        { key: "📽️ Projector", desc: "Alt + P (4:3)" },
        { key: "✦ Effects", desc: "Toggle sparks" },
        { key: "Esc", desc: "Close tour" }
      ]
    }
  ];

  let currentStepIndex = 0;
  let isTourActive = false;
  let rafId = null;
  let activeTargetEl = null;

  function ensurePanelVisible(panelId) {
    if (typeof window.ensurePanelVisible === "function") {
      window.ensurePanelVisible(panelId);
    }
  }

  function isElementVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function getTargetElement(step) {
    let el = document.querySelector(step.target);
    if (!isElementVisible(el) && step.fallbackTarget) {
      const fallback = document.querySelector(step.fallbackTarget);
      if (isElementVisible(fallback)) el = fallback;
    }
    return el;
  }

  // Initialize persistent step dots once to maintain focus/accessibility
  function initTourDots() {
    if (!tourDotsList) return;
    tourDotsList.innerHTML = "";
    TOUR_STEPS.forEach((step, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `tour-dot ${idx === 0 ? "active" : ""}`;
      dot.title = `Step ${idx + 1}: ${step.title}`;
      dot.setAttribute("aria-label", `Step ${idx + 1}: ${step.title}`);
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-selected", idx === 0 ? "true" : "false");
      dot.addEventListener("click", () => renderStep(idx));
      tourDotsList.appendChild(dot);
    });
  }
  initTourDots();

  function updateTourDots(activeIndex) {
    if (!tourDotsList) return;
    const dots = tourDotsList.querySelectorAll(".tour-dot");
    dots.forEach((dot, idx) => {
      const isActive = idx === activeIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function positionSpotlightAndCard() {
    if (!isTourActive) return;
    try {
      const step = TOUR_STEPS[currentStepIndex];
      if (!step) return;

      ensurePanelVisible(step.panelId);
      let targetEl = getTargetElement(step);

      const vpW = window.innerWidth || document.documentElement.clientWidth || 1024;
      const vpH = window.innerHeight || document.documentElement.clientHeight || 768;

      // If target element is missing or not visible, use safe fallback or panel
      if (!targetEl || !isElementVisible(targetEl)) {
        if (step.panelId) {
          targetEl = document.getElementById(step.panelId);
        }
      }

      let rect = null;
      if (targetEl && typeof targetEl.getBoundingClientRect === "function") {
        rect = targetEl.getBoundingClientRect();
      }

      const pad = 8;
      let left = 20, top = 80, right = vpW - 20, bottom = vpH - 100, width = 300, height = 200;

      if (rect && Number.isFinite(rect.left) && Number.isFinite(rect.top) && rect.width > 0 && rect.height > 0) {
        const rawLeft = rect.left - pad;
        const rawTop = rect.top - pad;
        const rawRight = rect.right + pad;
        const rawBottom = rect.bottom + pad;

        left = Math.max(0, Math.min(vpW - 10, Math.floor(rawLeft)));
        top = Math.max(0, Math.min(vpH - 10, Math.floor(rawTop)));
        right = Math.max(left + 10, Math.min(vpW, Math.ceil(rawRight)));
        bottom = Math.max(top + 10, Math.min(vpH, Math.ceil(rawBottom)));
        width = Math.max(10, right - left);
        height = Math.max(10, bottom - top);
      } else {
        // Safe fallback cutout over center-top
        left = Math.max(20, Math.floor(vpW * 0.1));
        top = 80;
        right = Math.min(vpW - 20, Math.floor(vpW * 0.9));
        bottom = Math.min(vpH - 80, 500);
        width = right - left;
        height = bottom - top;
      }

      // Update Neon Outline Cutout Frame
      if (tourCutout) {
        tourCutout.style.top = `${top}px`;
        tourCutout.style.left = `${left}px`;
        tourCutout.style.width = `${width}px`;
        tourCutout.style.height = `${height}px`;
        tourCutout.style.display = "block";
        tourCutout.style.visibility = "visible";
      }

      // Update Blurred Backdrop Cutout Hole (strictly clamped universal nonzero winding polygon)
      if (tourBackdrop) {
        const clipPolygon = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${left}px ${top}px, ${left}px ${bottom}px, ${right}px ${bottom}px, ${right}px ${top}px, ${left}px ${top}px, 0% 0%)`;
        tourBackdrop.style.clipPath = clipPolygon;
        tourBackdrop.style.webkitClipPath = clipPolygon;
      }

      // Always reset directional inline styles on arrow connector to prevent conflict
      if (tourArrow) {
        tourArrow.style.top = "";
        tourArrow.style.bottom = "";
        tourArrow.style.left = "";
        tourArrow.style.right = "";
      }

      // Responsive Card Positioning: Mobile viewport bottom docking
      const isMobile = vpW <= 768;
      if (isMobile) {
        if (tourCard) {
          tourCard.style.top = "";
          tourCard.style.left = "";
          tourCard.style.right = "";
          tourCard.style.bottom = "";
          tourCard.style.width = "";
          tourCard.style.maxHeight = "";
          tourCard.style.opacity = isTourActive ? "1" : "";
          tourCard.style.visibility = isTourActive ? "visible" : "";
        }
        if (tourArrow) {
          tourArrow.style.display = "none";
          tourArrow.className = "tour-arrow";
        }
        return;
      }

      // Measure natural card size unobstructed up to viewport height
      if (tourCard) {
        tourCard.style.width = "";
        tourCard.style.maxHeight = `${Math.max(220, vpH - 40)}px`;
      }
      const cardRect = tourCard ? tourCard.getBoundingClientRect() : { width: 420, height: 340 };
      const naturalW = Math.min(450, Math.max(280, cardRect.width > 0 ? Math.ceil(cardRect.width) : 420));
      const naturalH = Math.min(vpH - 36, Math.max(200, cardRect.height > 0 ? Math.ceil(cardRect.height) : 340));

      const edgePad = 16;
      const gap = 14;
      let cardW = naturalW;
      let cardH = naturalH;
      let cardTop = edgePad;
      let cardLeft = edgePad;
      let arrowClass = "tour-arrow";
      let showArrow = true;

      const availBelow = Math.max(0, vpH - bottom - gap - edgePad);
      const availAbove = Math.max(0, top - gap - edgePad);
      const availRight = Math.max(0, vpW - right - gap - edgePad);
      const availLeft = Math.max(0, left - gap - edgePad);

      const centerHoriz = () => Math.max(edgePad, Math.min(vpW - cardW - edgePad, left + (width / 2) - (cardW / 2)));
      const centerVert = (h) => Math.max(edgePad, Math.min(vpH - h - edgePad, top + (height / 2) - (h / 2)));

      // 1. Exact fit Below
      if (availBelow >= naturalH) {
        cardTop = bottom + gap;
        cardLeft = centerHoriz();
        cardH = naturalH;
        arrowClass = "tour-arrow arrow-top";
        if (tourArrow) {
          tourArrow.style.left = `${Math.max(18, Math.min(cardW - 32, (left + width / 2) - cardLeft - 7))}px`;
          tourArrow.style.top = "-8px";
        }
      }
      // 2. Exact fit Above
      else if (availAbove >= naturalH) {
        cardTop = top - naturalH - gap;
        cardLeft = centerHoriz();
        cardH = naturalH;
        arrowClass = "tour-arrow arrow-bottom";
        if (tourArrow) {
          tourArrow.style.left = `${Math.max(18, Math.min(cardW - 32, (left + width / 2) - cardLeft - 7))}px`;
          tourArrow.style.bottom = "-8px";
        }
      }
      // 3. Exact fit Right
      else if (availRight >= naturalW) {
        cardLeft = right + gap;
        cardH = Math.min(naturalH, vpH - edgePad * 2);
        cardTop = centerVert(cardH);
        arrowClass = "tour-arrow arrow-left";
        if (tourArrow) {
          tourArrow.style.top = `${Math.max(18, Math.min(cardH - 32, (top + height / 2) - cardTop - 7))}px`;
          tourArrow.style.left = "-8px";
        }
      }
      // 4. Exact fit Left
      else if (availLeft >= naturalW) {
        cardLeft = left - naturalW - gap;
        cardH = Math.min(naturalH, vpH - edgePad * 2);
        cardTop = centerVert(cardH);
        arrowClass = "tour-arrow arrow-right";
        if (tourArrow) {
          tourArrow.style.top = `${Math.max(18, Math.min(cardH - 32, (top + height / 2) - cardTop - 7))}px`;
          tourArrow.style.right = "-8px";
        }
      }
      // 5. Guaranteed non-overlapping fit by constraining maxHeight / width to the side with the most room
      else {
        const bestVert = Math.max(availBelow, availAbove);
        const bestHoriz = Math.max(availRight, availLeft);

        if (bestVert >= 200 && (bestVert >= bestHoriz || bestHoriz < 270)) {
          if (availBelow >= availAbove) {
            cardH = Math.min(naturalH, availBelow);
            cardTop = bottom + gap;
            cardLeft = centerHoriz();
            arrowClass = "tour-arrow arrow-top";
            if (tourArrow) {
              tourArrow.style.left = `${Math.max(18, Math.min(cardW - 32, (left + width / 2) - cardLeft - 7))}px`;
              tourArrow.style.top = "-8px";
            }
          } else {
            cardH = Math.min(naturalH, availAbove);
            if (tourCard) tourCard.style.maxHeight = `${cardH}px`;
            const measuredAboveH = tourCard ? Math.min(cardH, Math.ceil(tourCard.getBoundingClientRect().height || cardH)) : cardH;
            cardTop = Math.max(edgePad, top - measuredAboveH - gap);
            cardLeft = centerHoriz();
            arrowClass = "tour-arrow arrow-bottom";
            if (tourArrow) {
              tourArrow.style.left = `${Math.max(18, Math.min(cardW - 32, (left + width / 2) - cardLeft - 7))}px`;
              tourArrow.style.bottom = "-8px";
            }
          }
        } else if (bestHoriz >= 250) {
          cardW = Math.min(naturalW, bestHoriz);
          if (tourCard) tourCard.style.width = `${cardW}px`;
          cardH = Math.min(naturalH, vpH - edgePad * 2);
          if (availRight >= availLeft) {
            cardLeft = right + gap;
            arrowClass = "tour-arrow arrow-left";
            if (tourArrow) {
              tourArrow.style.top = `${Math.max(18, Math.min(cardH - 32, (top + height / 2) - cardTop - 7))}px`;
              tourArrow.style.left = "-8px";
            }
          } else {
            cardLeft = left - cardW - gap;
            arrowClass = "tour-arrow arrow-right";
            if (tourArrow) {
              tourArrow.style.top = `${Math.max(18, Math.min(cardH - 32, (top + height / 2) - cardTop - 7))}px`;
              tourArrow.style.right = "-8px";
            }
          }
          cardTop = centerVert(cardH);
        } else {
          showArrow = false;
          cardH = Math.min(naturalH, 300, vpH - edgePad * 2);
          cardTop = Math.max(edgePad, vpH - cardH - edgePad);
          cardLeft = Math.max(edgePad, vpW - cardW - edgePad);
        }
      }

      // Clamp within viewport safe frame without losing dynamic maxHeight
      const maxAllowedCardHeight = Math.max(180, Math.min(cardH, vpH - cardTop - edgePad));
      const finalMaxLeft = Math.max(edgePad, vpW - cardW - edgePad);
      cardLeft = Math.max(edgePad, Math.min(finalMaxLeft, cardLeft));

      if (tourCard) {
        tourCard.style.top = `${Math.round(cardTop)}px`;
        tourCard.style.left = `${Math.round(cardLeft)}px`;
        tourCard.style.right = "auto";
        tourCard.style.bottom = "auto";
        tourCard.style.maxHeight = `${Math.floor(maxAllowedCardHeight)}px`;
        tourCard.style.opacity = isTourActive ? "1" : "";
        tourCard.style.visibility = isTourActive ? "visible" : "";
      }

      if (tourArrow) {
        if (showArrow) {
          tourArrow.style.display = "block";
          tourArrow.className = arrowClass;
        } else {
          tourArrow.style.display = "none";
        }
      }
    } catch (err) {
      console.warn("[Nemo Tour] positionSpotlightAndCard error handled:", err);
      if (tourCard && isTourActive) {
        tourCard.style.top = "24px";
        tourCard.style.left = "calc(50% - 210px)";
        tourCard.style.right = "auto";
        tourCard.style.bottom = "auto";
        tourCard.style.opacity = "1";
        tourCard.style.visibility = "visible";
      }
    }
  }

  let trackRafId = null;
  function startContinuousTracking(durationMs = 600) {
    if (trackRafId) cancelAnimationFrame(trackRafId);
    const startTime = performance.now();
    function frame() {
      if (!isTourActive) return;
      positionSpotlightAndCard();
      if (performance.now() - startTime < durationMs) {
        trackRafId = requestAnimationFrame(frame);
      }
    }
    trackRafId = requestAnimationFrame(frame);
  }

  function hideMascotOverlays() {
    const pop = document.getElementById("widgetPopover");
    if (pop) pop.hidden = true;
    const vb = document.getElementById("nemoVoiceBubble");
    if (vb) {
      vb.classList.remove("active");
      vb.hidden = true;
    }
  }

  function renderStep(index) {
    try {
      if (index < 0 || index >= TOUR_STEPS.length) return;
      currentStepIndex = index;
      const step = TOUR_STEPS[currentStepIndex];
      if (!step) return;

      hideMascotOverlays();
      ensurePanelVisible(step.panelId);

      // Show docked Nemo ONLY on Step 1 (#heroMascotAnchor); hide floating widget completely on Steps 2-8
      document.body.classList.toggle("tour-step-mascot", currentStepIndex === 0);

      // Update header badges
      if (tourStepBadge) tourStepBadge.textContent = `Step ${currentStepIndex + 1} of ${TOUR_STEPS.length}`;
      if (tourCategory) tourCategory.textContent = step.category || "CHEMISTRY TUTORIAL";
      if (tourTargetTag) tourTargetTag.textContent = step.badge || "Feature Spotlight";

      // Content
      if (tourStepTitle) tourStepTitle.textContent = step.title || "Feature Details";
      if (tourStepDesc) tourStepDesc.textContent = step.desc || "";
      if (tourStepAction) tourStepAction.textContent = step.action || "";

      // Render key chips
      if (tourKeysList) {
        tourKeysList.innerHTML = "";
        (step.keys || []).forEach((k) => {
          const item = document.createElement("div");
          item.className = "tour-key-item";
          item.innerHTML = `<kbd>${esc(k.key)}</kbd><span>${esc(k.desc)}</span>`;
          tourKeysList.appendChild(item);
        });
      }

      // Update persistent progress dots
      updateTourDots(currentStepIndex);

      // Button states
      if (tourPrevBtn) tourPrevBtn.disabled = currentStepIndex === 0;
      if (tourNextBtn) {
        if (currentStepIndex === TOUR_STEPS.length - 1) {
          tourNextBtn.textContent = "Finish Tour 🎉";
          tourNextBtn.classList.add("finish-tour-btn");
        } else {
          tourNextBtn.textContent = "Next Step →";
          tourNextBtn.classList.remove("finish-tour-btn");
        }
      }

      // Smooth scroll to target and focus
      const targetEl = getTargetElement(step);
      if (activeTargetEl && activeTargetEl !== targetEl) {
        activeTargetEl.classList.remove("tour-highlighted-element");
      }
      if (targetEl) {
        targetEl.classList.add("tour-highlighted-element");
        activeTargetEl = targetEl;

        const elRect = targetEl.getBoundingClientRect();
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        const isMobile = window.innerWidth <= 768;

        const snapScrollY = (y) => {
          try {
            window.scrollTo({ top: y, behavior: "instant" });
          } catch (_) {
            window.scrollTo(0, y);
          }
        };

        if (currentStepIndex === 0) {
          // Snap cleanly to Home Hero top so Nemo docks immediately inside #heroMascotAnchor
          snapScrollY(0);
          window.dispatchEvent(new CustomEvent("nemo:sync-dock"));
        } else if (isMobile) {
          // Leave clearance below mobile-top-island and keep target above bottom-docked tour card
          const mobileScroll = Math.max(0, currentScrollY + elRect.top - 78);
          snapScrollY(mobileScroll);
        } else {
          const targetAbsTop = currentScrollY + elRect.top;
          const idealScroll = Math.max(0, targetAbsTop - 96);
          snapScrollY(idealScroll);
        }
      } else if (currentStepIndex === 0) {
        try { window.scrollTo({ top: 0, behavior: "instant" }); } catch (_) { window.scrollTo(0, 0); }
        window.dispatchEvent(new CustomEvent("nemo:sync-dock"));
      }

      // Reset scroll position on card body to top for new step
      if (tourCard) {
        const cardBody = tourCard.querySelector(".tour-card-body");
        if (cardBody) cardBody.scrollTop = 0;
      }

      // Immediate positioning calculation followed by smooth 60fps tracking during scroll
      positionSpotlightAndCard();
      startContinuousTracking(950);
    } catch (err) {
      console.warn("[Nemo Tour] renderStep error handled:", err);
    }
  }

  let tourLastTrigger = null;

  function startTour(fromStep = 0) {
    try {
      if (document.activeElement && document.activeElement !== document.body && (!tourModal || !tourModal.contains(document.activeElement))) {
        tourLastTrigger = document.activeElement;
      }
      dismissWelcomePrompt();
      hideMascotOverlays();
      if (typeof window.closeAllPortalMenus === "function") window.closeAllPortalMenus(false);
      if (typeof window.closeDiagramLightbox === "function") window.closeDiagramLightbox(false);
      if (typeof window.closeFounderModal === "function") window.closeFounderModal(false);

      // Restore all workspace panels cleanly without scrolling away prematurely
      const ws = document.querySelector(".workspace");
      if (ws) ws.dataset.filter = "all";
      document.querySelectorAll(".workspace > .panel").forEach((p) => { p.style.display = ""; });
      document.querySelectorAll(".ws-tab").forEach((b) => {
        const isAll = b.dataset.filter === "all";
        b.classList.toggle("active", isAll);
        b.setAttribute("aria-selected", String(isAll));
      });
      const filterBar = document.getElementById("workspaceFilterStatus");
      if (filterBar) filterBar.hidden = true;

      isTourActive = true;
      if (tourModal) {
        tourModal.hidden = false;
        tourModal.classList.add("active");
        tourModal.setAttribute("aria-hidden", "false");
      }
      document.body.classList.add("tour-active");
      document.body.classList.toggle("tour-step-mascot", fromStep === 0);
      NemoOverlay.syncBodyScrollLock();
      renderStep(fromStep);
      window.addEventListener("resize", handleResizeOrScroll, { passive: true });
      window.addEventListener("scroll", handleResizeOrScroll, { passive: true });
      window.addEventListener("scrollend", handleResizeOrScroll, { passive: true });
      document.addEventListener("keydown", handleKeyNavigation);
      if (tourNextBtn) tourNextBtn.focus({ preventScroll: true });
    } catch (err) {
      console.warn("[Nemo Tour] startTour error handled:", err);
    }
  }

  function navigateToHomeState() {
    try {
      // Restore "All Modules" filter without scrolling down to #chatPanel
      const ws = document.querySelector(".workspace");
      if (ws) ws.dataset.filter = "all";
      document.querySelectorAll(".workspace > .panel").forEach((p) => { p.style.display = ""; });
      document.querySelectorAll(".ws-tab").forEach((b) => {
        const isAll = b.dataset.filter === "all";
        b.classList.toggle("active", isAll);
        b.setAttribute("aria-selected", String(isAll));
      });
      const filterBar = document.getElementById("workspaceFilterStatus");
      if (filterBar) filterBar.hidden = true;

      // Reset sidebar nav highlight to Home default (first section) and close drawers/menus
      const sidebar = document.getElementById("appSidebar");
      const backdrop = document.getElementById("sidebarBackdrop");
      const mobileMenuBtn = document.getElementById("mobileMenuBtn");
      if (sidebar) sidebar.classList.remove("open", "active");
      if (backdrop) backdrop.classList.remove("active");
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove("active");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      }

      document.querySelectorAll(".nav-item").forEach((a) => {
        const isHome = a.dataset.target === "chatPanel";
        a.classList.toggle("active", isHome);
        if (isHome) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });

      hideMascotOverlays();

      // Clear any deep hash so URL stays clean on Home
      if (window.location.hash && window.history && typeof window.history.replaceState === "function") {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }

      // Navigate smoothly back to the Home Hero at top of page
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      window.dispatchEvent(new CustomEvent("nemo:sync-dock"));
      setTimeout(() => {
        if (!isTourActive) {
          window.dispatchEvent(new CustomEvent("nemo:sync-dock"));
        }
      }, 460);
    } catch (err) {
      console.warn("[Nemo Tour] navigateToHomeState error:", err);
    }
  }

  function closeTour(restoreFocus = false) {
    try {
      dismissWelcomePrompt();
      isTourActive = false;
      if (trackRafId) cancelAnimationFrame(trackRafId);
      if (rafId) cancelAnimationFrame(rafId);
      if (tourModal) {
        tourModal.classList.remove("active");
        tourModal.setAttribute("aria-hidden", "true");
        tourModal.hidden = true;
      }
      document.body.classList.remove("tour-active", "tour-step-mascot");
      NemoOverlay.syncBodyScrollLock();
      if (tourBackdrop) {
        tourBackdrop.style.clipPath = "";
        tourBackdrop.style.webkitClipPath = "";
      }
      if (tourCutout) {
        tourCutout.style.display = "";
        tourCutout.style.visibility = "";
      }
      if (tourCard) {
        tourCard.style.opacity = "";
        tourCard.style.visibility = "";
        tourCard.style.top = "";
        tourCard.style.left = "";
        tourCard.style.right = "";
        tourCard.style.bottom = "";
        tourCard.style.width = "";
        tourCard.style.maxHeight = "";
      }
      if (activeTargetEl) {
        activeTargetEl.classList.remove("tour-highlighted-element");
        activeTargetEl = null;
      }
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
      window.removeEventListener("scrollend", handleResizeOrScroll);
      document.removeEventListener("keydown", handleKeyNavigation);
      store.set("nemo.tour.seen.v1", true);
      navigateToHomeState();
      if (restoreFocus && tourLastTrigger && document.contains(tourLastTrigger)) {
        tourLastTrigger.focus({ preventScroll: true });
      }
      tourLastTrigger = null;
    } catch (err) {
      console.warn("[Nemo Tour] closeTour error handled:", err);
    }
  }

  NemoOverlay.register("tour", {
    isOpen: () => Boolean(isTourActive),
    close: (restore) => closeTour(Boolean(restore)),
    getFocusRoot: () => tourCard || tourModal
  });

  function handleResizeOrScroll() {
    if (!isTourActive) return;
    try {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(positionSpotlightAndCard);
    } catch (err) {
      console.warn("[Nemo Tour] handleResizeOrScroll error:", err);
    }
  }

  function handleKeyNavigation(e) {
    if (!isTourActive) return;
    try {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentStepIndex < TOUR_STEPS.length - 1) renderStep(currentStepIndex + 1);
        else closeTour(true);
      } else if (e.key === "Enter") {
        if (e.target && e.target.closest("button, a, input, textarea, select, [role='tab']")) return;
        e.preventDefault();
        if (currentStepIndex < TOUR_STEPS.length - 1) renderStep(currentStepIndex + 1);
        else closeTour(true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentStepIndex > 0) renderStep(currentStepIndex - 1);
      }
    } catch (err) {
      console.warn("[Nemo Tour] handleKeyNavigation error:", err);
    }
  }

  // Event Listeners
  tourNextBtn.addEventListener("click", () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      renderStep(currentStepIndex + 1);
    } else {
      closeTour(true);
    }
  });

  tourPrevBtn.addEventListener("click", () => {
    if (currentStepIndex > 0) {
      renderStep(currentStepIndex - 1);
    }
  });

  tourSkipBtn.addEventListener("click", () => closeTour(true));
  tourCloseBtn.addEventListener("click", () => closeTour(true));

  // Backdrop click dismissal: Only close if user clicks OUTSIDE the focused element cutout
  tourBackdrop.addEventListener("click", (e) => {
    try {
      if (tourCutout) {
        const cRect = tourCutout.getBoundingClientRect();
        if (
          e.clientX >= cRect.left &&
          e.clientX <= cRect.right &&
          e.clientY >= cRect.top &&
          e.clientY <= cRect.bottom
        ) {
          // Click is inside highlighted cutout — preserve tour and allow interaction
          return;
        }
      }
      closeTour(true);
    } catch (_) {
      closeTour(true);
    }
  });

  function dismissWelcomePrompt() {
    try {
      localStorage.setItem("nemo_tutorial_prompted", "true");
    } catch (_) {}
    if (welcomePrompt) {
      welcomePrompt.classList.remove("active");
      setTimeout(() => {
        if (welcomePrompt) welcomePrompt.hidden = true;
      }, 350);
    }
  }

  function initWelcomePrompt() {
    try {
      if (localStorage.getItem("nemo_tutorial_prompted")) return;
    } catch (_) {
      return;
    }

    if (!welcomePrompt) return;

    // Wait 3.2 seconds dwell time so prompt does not interrupt initial page appearance
    setTimeout(() => {
      if (isTourActive) return;
      try {
        if (localStorage.getItem("nemo_tutorial_prompted")) return;
      } catch (_) {}
      welcomePrompt.hidden = false;
      requestAnimationFrame(() => {
        welcomePrompt.classList.add("active");
      });
    }, 3200);
  }

  if (welcomeStartTourBtn) {
    welcomeStartTourBtn.addEventListener("click", () => {
      dismissWelcomePrompt();
      startTour(0);
    });
  }

  if (welcomeDismissTourBtn) {
    welcomeDismissTourBtn.addEventListener("click", dismissWelcomePrompt);
  }

  if (popoverTourBtn) {
    popoverTourBtn.addEventListener("click", () => {
      const popover = document.getElementById("widgetPopover");
      if (popover) popover.hidden = true;
      dismissWelcomePrompt();
      startTour(0);
    });
  }

  if (startTourBtn) startTourBtn.addEventListener("click", () => startTour(0));
  if (mobileTourBtn) mobileTourBtn.addEventListener("click", () => startTour(0));
  if (sidebarTourBtn) {
    sidebarTourBtn.addEventListener("click", () => {
      // Close mobile drawer if open
      const sidebar = document.getElementById("appSidebar");
      const backdrop = document.getElementById("sidebarBackdrop");
      const menuBtn = document.getElementById("mobileMenuBtn");
      if (sidebar) sidebar.classList.remove("open", "active");
      if (backdrop) backdrop.classList.remove("active");
      if (menuBtn) {
        menuBtn.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
      }
      startTour(0);
    });
  }

  initWelcomePrompt();

  window.startNemoTour = startTour;
})();

/* ============================== Chemical Unit Converter Utility ============================== */
(function initChemUnitConverter() {
  const CHAT_DRAWER = $("#chatUnitDrawer");
  const FORMULA_MOUNT = $("#formulaUnitWidget");
  const CHAT_TOGGLE_BTN = $("#toggleChatUnitsBtn");
  if (!CHAT_DRAWER && !FORMULA_MOUNT) return;

  const CATEGORIES = {
    pressure: {
      label: "Pressure",
      defaultFrom: "atm",
      defaultTo: "bar",
      defaultVal: "1",
      presets: [
        { label: "1 atm → bar", val: "1", from: "atm", to: "bar" },
        { label: "1 atm → mmHg", val: "1", from: "atm", to: "mmHg" },
        { label: "1 bar → kPa", val: "1", from: "bar", to: "kPa" }
      ],
      units: {
        atm: { label: "atm", factor: 101325 },
        bar: { label: "bar", factor: 100000 },
        Pa: { label: "Pa", factor: 1 },
        kPa: { label: "kPa", factor: 1000 },
        mmHg: { label: "mmHg", factor: 101325 / 760 },
        Torr: { label: "Torr", factor: 101325 / 760 },
        psi: { label: "psi", factor: 6894.757293168361 }
      },
      refNote: "R = 0.082057 L·atm·mol⁻¹·K⁻¹  |  0.08314 L·bar·mol⁻¹·K⁻¹"
    },
    temperature: {
      label: "Temp",
      defaultFrom: "C",
      defaultTo: "K",
      defaultVal: "25",
      presets: [
        { label: "25 °C → K", val: "25", from: "C", to: "K" },
        { label: "0 °C → K", val: "0", from: "C", to: "K" },
        { label: "-40 °C → °F", val: "-40", from: "C", to: "F" }
      ],
      units: {
        C: { label: "°C" },
        K: { label: "K" },
        F: { label: "°F" }
      },
      refNote: "T(K) = T(°C) + 273.15  |  STP (IUPAC): 273.15 K, 1 bar"
    },
    volume: {
      label: "Volume",
      defaultFrom: "L",
      defaultTo: "mL",
      defaultVal: "1",
      presets: [
        { label: "1 L → m³", val: "1", from: "L", to: "m3" },
        { label: "22.71 L → mL", val: "22.71", from: "L", to: "mL" },
        { label: "1 cm³ → mL", val: "1", from: "cm3", to: "mL" }
      ],
      units: {
        L: { label: "L", factor: 1e-3 },
        mL: { label: "mL", factor: 1e-6 },
        dm3: { label: "dm³", factor: 1e-3 },
        cm3: { label: "cm³", factor: 1e-6 },
        m3: { label: "m³", factor: 1 }
      },
      refNote: "1 L = 1 dm³ = 1000 cm³ = 10⁻³ m³"
    },
    energy: {
      label: "Energy",
      defaultFrom: "Latm",
      defaultTo: "J",
      defaultVal: "1",
      presets: [
        { label: "1 L·atm → J", val: "1", from: "Latm", to: "J" },
        { label: "1 cal → J", val: "1", from: "cal", to: "J" },
        { label: "1 eV → kJ", val: "1", from: "eV", to: "kJ" }
      ],
      units: {
        J: { label: "J", factor: 1 },
        kJ: { label: "kJ", factor: 1000 },
        cal: { label: "cal", factor: 4.184 },
        kcal: { label: "kcal", factor: 4184 },
        Latm: { label: "L·atm", factor: 101.325 },
        Lbar: { label: "L·bar", factor: 100 },
        eV: { label: "eV", factor: 1.602176634e-19 }
      },
      refNote: "R = 8.3145 J·mol⁻¹·K⁻¹  |  1 cal = 4.184 J  |  1 L·atm = 101.325 J"
    },
    concentration: {
      label: "Conc.",
      defaultFrom: "M",
      defaultTo: "molm3",
      defaultVal: "0.1",
      presets: [
        { label: "1 M → mol/m³", val: "1", from: "M", to: "molm3" },
        { label: "100 mM → M", val: "100", from: "mM", to: "M" }
      ],
      units: {
        M: { label: "mol/L (M)", factor: 1000 },
        mM: { label: "mmol/L (mM)", factor: 1 },
        molm3: { label: "mol/m³", factor: 1 }
      },
      refNote: "κ(S·m⁻¹) / (M·1000) gives molar conductivity Λₘ in S·m²·mol⁻¹"
    }
  };

  function convertValue(catKey, rawVal, fromKey, toKey) {
    const rawStr = String(rawVal ?? "").trim();
    if (!rawStr) return NaN;
    const val = Number(rawStr);
    if (!Number.isFinite(val)) return NaN;
    const cat = CATEGORIES[catKey];
    if (!cat) return NaN;
    if (catKey === "temperature") {
      let kelvin;
      if (fromKey === "C") kelvin = val + 273.15;
      else if (fromKey === "F") kelvin = ((val - 32) * 5) / 9 + 273.15;
      else kelvin = val;
      let out;
      if (toKey === "C") out = kelvin - 273.15;
      else if (toKey === "F") out = ((kelvin - 273.15) * 9) / 5 + 32;
      else out = kelvin;
      return Math.abs(out) < 1e-12 ? 0 : out;
    }
    const fObj = cat.units[fromKey];
    const tObj = cat.units[toKey];
    if (!fObj || !tObj) return NaN;
    return (val * fObj.factor) / tObj.factor;
  }

  function formatNumberSmart(num) {
    if (!Number.isFinite(num)) return "—";
    if (num === 0 || Object.is(num, -0)) return "0";
    const abs = Math.abs(num);
    if (abs < 1e-4 || abs >= 1e7) {
      return Number(num.toPrecision(7)).toExponential().replace(/e\+?/, "e");
    }
    return String(Number(num.toPrecision(8)));
  }

  const state = {
    category: "pressure",
    value: "1",
    from: "atm",
    to: "bar"
  };

  const instances = [];

  function closeChatDrawer(restoreFocus = false) {
    if (!CHAT_DRAWER) return;
    CHAT_DRAWER.hidden = true;
    if (CHAT_TOGGLE_BTN) {
      CHAT_TOGGLE_BTN.setAttribute("aria-expanded", "false");
      CHAT_TOGGLE_BTN.classList.remove("active");
      if (restoreFocus) CHAT_TOGGLE_BTN.focus({ preventScroll: true });
    }
  }

  function mountWidget(container, isChatDrawer) {
    if (!container) return null;
    const card = el("div", { class: "unit-card" });

    const head = el("div", { class: "unit-card-head" });
    const titleBox = el("div", { class: "unit-card-title" });
    titleBox.append(
      el("strong", { text: "⇄ Chemical Unit Converter" }),
      el("span", { text: "Physical chemistry constants & SI conversions" })
    );

    const tabs = el("div", { class: "unit-cat-tabs", role: "group", "aria-label": "Unit categories" });
    const catBtns = {};
    Object.entries(CATEGORIES).forEach(([key, cfg]) => {
      const b = el("button", { type: "button", class: "unit-cat-btn", text: cfg.label, "data-cat": key });
      b.addEventListener("click", () => {
        state.category = key;
        state.from = cfg.defaultFrom;
        state.to = cfg.defaultTo;
        state.value = cfg.defaultVal;
        syncAll();
      });
      catBtns[key] = b;
      tabs.append(b);
    });
    head.append(titleBox, tabs);

    const grid = el("div", { class: "unit-io-grid" });
    const fromField = el("div", { class: "unit-field" });
    const fromId = `ucIn-${isChatDrawer ? "chat" : "for"}`;
    const fromSelId = `ucFrom-${isChatDrawer ? "chat" : "for"}`;
    const fromLabel = el("label", { for: fromId, text: "From value & unit" });
    const fromCombo = el("div", { class: "unit-input-combo" });
    const valInput = el("input", {
      id: fromId,
      type: "text",
      inputmode: "decimal",
      autocomplete: "off",
      placeholder: "Enter value",
      class: "unit-val-input",
      value: state.value,
      "aria-label": "Input numerical value"
    });
    const fromSelect = el("select", { id: fromSelId, class: "unit-select", "aria-label": "From unit" });
    fromCombo.append(valInput, fromSelect);
    fromField.append(fromLabel, fromCombo);

    const swapBtn = el("button", {
      type: "button",
      class: "unit-swap-btn",
      title: "Swap units",
      "aria-label": "Swap source and target units",
      text: "⇄"
    });
    swapBtn.addEventListener("click", () => {
      const prevFrom = state.from;
      state.from = state.to;
      state.to = prevFrom;
      syncAll();
    });

    const toField = el("div", { class: "unit-field" });
    const toId = `ucOut-${isChatDrawer ? "chat" : "for"}`;
    const toSelId = `ucTo-${isChatDrawer ? "chat" : "for"}`;
    const toLabel = el("label", { for: toId, text: "Converted value" });
    const toCombo = el("div", { class: "unit-input-combo" });
    const valOutput = el("input", {
      id: toId,
      type: "text",
      readonly: "readonly",
      class: "unit-val-output",
      "aria-label": "Converted value"
    });
    const toSelect = el("select", { id: toSelId, class: "unit-select", "aria-label": "To unit" });
    toCombo.append(valOutput, toSelect);
    toField.append(toLabel, toCombo);

    grid.append(fromField, swapBtn, toField);

    const presetsRow = el("div", { class: "unit-presets-row", "aria-label": "Quick chemistry presets" });
    const footer = el("div", { class: "unit-footer-row" });
    const noteEl = el("div", { class: "unit-formula-note" });
    const actionsEl = el("div", { class: "unit-action-group" });
    const copyBtn = el("button", { type: "button", class: "unit-mini-btn", text: "Copy result" });
    copyBtn.addEventListener("click", () => {
      const res = convertValue(state.category, state.value, state.from, state.to);
      if (!Number.isFinite(res)) return;
      const cat = CATEGORIES[state.category];
      const fLabel = cat.units[state.from]?.label || state.from;
      const tLabel = cat.units[state.to]?.label || state.to;
      const str = `${state.value.trim()} ${fLabel} = ${valOutput.value} ${tLabel}`;
      copyTextSafe(str, copyBtn, "✓ Copied", "Copy result");
    });
    actionsEl.append(copyBtn);

    let useBtn = null;
    if (isChatDrawer && input) {
      useBtn = el("button", { type: "button", class: "unit-mini-btn", text: "Insert in prompt" });
      useBtn.addEventListener("click", () => {
        const res = convertValue(state.category, state.value, state.from, state.to);
        if (!Number.isFinite(res)) return;
        const cat = CATEGORIES[state.category];
        const fLabel = cat.units[state.from]?.label || state.from;
        const tLabel = cat.units[state.to]?.label || state.to;
        const snippet = `${state.value.trim()} ${fLabel} (${valOutput.value} ${tLabel})`;
        const cur = input.value.trim();
        input.value = cur ? `${cur} ${snippet}` : snippet;
        input.dispatchEvent(new Event("input"));
        input.focus({ preventScroll: true });
      });
      const closeBtn = el("button", { type: "button", class: "unit-mini-btn", text: "Hide", "aria-label": "Hide unit converter" });
      closeBtn.addEventListener("click", () => closeChatDrawer(true));
      actionsEl.append(useBtn, closeBtn);
    }

    footer.append(noteEl, actionsEl);

    valInput.addEventListener("input", () => {
      state.value = valInput.value;
      syncAll(valInput);
    });
    fromSelect.addEventListener("change", () => {
      state.from = fromSelect.value;
      syncAll();
    });
    toSelect.addEventListener("change", () => {
      state.to = toSelect.value;
      syncAll();
    });

    card.append(head, grid, presetsRow, footer);
    container.innerHTML = "";
    container.append(card);

    return {
      catBtns,
      valInput,
      valOutput,
      fromSelect,
      toSelect,
      presetsRow,
      noteEl,
      copyBtn,
      useBtn
    };
  }

  function syncInstance(inst, sourceInput) {
    if (!inst) return;
    const cat = CATEGORIES[state.category];
    Object.entries(inst.catBtns).forEach(([k, b]) => {
      b.classList.toggle("active", k === state.category);
      b.setAttribute("aria-pressed", String(k === state.category));
    });

    if (inst.fromSelect.dataset.cat !== state.category) {
      inst.fromSelect.innerHTML = "";
      inst.toSelect.innerHTML = "";
      Object.entries(cat.units).forEach(([uKey, uCfg]) => {
        inst.fromSelect.append(el("option", { value: uKey, text: uCfg.label }));
        inst.toSelect.append(el("option", { value: uKey, text: uCfg.label }));
      });
      inst.fromSelect.dataset.cat = state.category;
    }

    inst.fromSelect.value = state.from;
    inst.toSelect.value = state.to;
    if (inst.valInput !== sourceInput) {
      inst.valInput.value = state.value;
    }

    const trimmedVal = String(state.value ?? "").trim();
    const res = convertValue(state.category, state.value, state.from, state.to);
    const isValid = Number.isFinite(res);
    const isNonEmptyInvalid = Boolean(trimmedVal) && !isValid;

    inst.valInput.setAttribute("aria-invalid", isNonEmptyInvalid ? "true" : "false");
    inst.valOutput.value = formatNumberSmart(res);
    if (inst.copyBtn) inst.copyBtn.disabled = !isValid;
    if (inst.useBtn) inst.useBtn.disabled = !isValid;

    inst.noteEl.classList.toggle("is-invalid", isNonEmptyInvalid);
    if (isNonEmptyInvalid) {
      inst.noteEl.textContent = "Enter a valid numeric value (e.g., 1.5, -40, 2.5e-3).";
    } else {
      const fLabel = cat.units[state.from]?.label || state.from;
      const tLabel = cat.units[state.to]?.label || state.to;
      if (state.category === "temperature") {
        inst.noteEl.textContent = `${cat.refNote}`;
      } else {
        const oneEquiv = convertValue(state.category, 1, state.from, state.to);
        inst.noteEl.textContent = `1 ${fLabel} = ${formatNumberSmart(oneEquiv)} ${tLabel}  •  ${cat.refNote}`;
      }
    }

    if (inst.presetsRow.dataset.cat !== state.category) {
      inst.presetsRow.innerHTML = "";
      (cat.presets || []).forEach((p) => {
        const pb = el("button", { type: "button", class: "unit-preset-btn", text: p.label });
        pb.addEventListener("click", () => {
          state.value = p.val;
          state.from = p.from;
          state.to = p.to;
          syncAll();
        });
        inst.presetsRow.append(pb);
      });
      inst.presetsRow.dataset.cat = state.category;
    }
  }

  function syncAll(sourceInput = null) {
    instances.forEach((inst) => syncInstance(inst, sourceInput));
  }

  if (CHAT_DRAWER) instances.push(mountWidget(CHAT_DRAWER, true));
  if (FORMULA_MOUNT) instances.push(mountWidget(FORMULA_MOUNT, false));
  syncAll();

  if (CHAT_TOGGLE_BTN && CHAT_DRAWER) {
    CHAT_TOGGLE_BTN.addEventListener("click", () => {
      const open = CHAT_DRAWER.hidden;
      CHAT_DRAWER.hidden = !open;
      CHAT_TOGGLE_BTN.setAttribute("aria-expanded", String(open));
      CHAT_TOGGLE_BTN.classList.toggle("active", open);
      if (open) {
        const inEl = $(".unit-val-input", CHAT_DRAWER);
        if (inEl) inEl.focus({ preventScroll: true });
      }
    });
    CHAT_DRAWER.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeChatDrawer(true);
      }
    });
  }

  window.nemoConvertChemUnit = convertValue;
})();

/* ============================== Interactive Periodic Table & Quantum Inspector ============================== */
(function periodicPanel() {
  const PT = window.NEMO_PERIODIC;
  const grid = $("#ptGrid");
  if (!PT || !Array.isArray(PT.ELEMENTS) || !grid) return;

  const ELEMENTS = PT.ELEMENTS;
  const CATEGORIES = PT.CATEGORIES || {};
  const searchInput = $("#ptSearch");
  const resetBtn = $("#ptResetBtn");
  const matchCountEl = $("#ptMatchCount");
  const filterRow = $("#ptFilterRow");
  const heatmapRow = $("#ptHeatmapRow");
  const legendBar = $("#ptLegendBar");

  // Inspector DOM
  const inspTile = $("#ptInspTile");
  const inspZ = $("#ptInspZ");
  const inspSym = $("#ptInspSym");
  const inspMass = $("#ptInspMass");
  const inspTags = $("#ptInspTags");
  const inspName = $("#ptInspName");
  const inspMeta = $("#ptInspMeta");
  const excCountEl = $("#ptExcCount");
  const configMathEl = $("#ptConfigMath");
  const anomCompareEl = $("#ptAnomCompare");
  const qnBoxEl = $("#ptQnBox");
  const propsGridEl = $("#ptPropsGrid");
  const excListEl = $("#ptExceptionsList");
  const compareQuickEl = $("#ptCompareQuick");
  const compareSelect = $("#ptCompareSelect");
  const compareBodyEl = $("#ptCompareBody");
  const askNemoBtn = $("#ptAskNemoBtn");
  const view3DBtn = $("#ptView3DBtn");

  const inspTabBtns = $$(".pt-insp-tab");
  const inspPanes = {
    overview: $("#ptTabOverview"),
    exceptions: $("#ptTabExceptions"),
    compare: $("#ptTabCompare")
  };

  let selectedZ = 24; // Chromium showcases Aufbau exception + KaTeX right on first view
  let compareZ = 29;
  let activeFilter = "all"; // "all" | "s" | "p" | "d" | "f" | "anomalous" | "exceptions" | "cat:<key>"
  let heatmapMode = "category"; // "category" | "ie1" | "en" | "radius" | "exceptions"
  let activeInspTab = "overview";
  const tileByZ = new Map();

  // Compute metric min/max once for quantitative heatmap scales
  function metricExtent(key) {
    let min = Infinity, max = -Infinity;
    for (const e of ELEMENTS) {
      const v = e[key];
      if (typeof v === "number" && Number.isFinite(v)) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    return { min, max };
  }
  const EXTENTS = {
    ie1: metricExtent("ie1"),
    en: metricExtent("en"),
    radius: metricExtent("radius")
  };

  function getGridCoords(e) {
    if (e.z >= 57 && e.z <= 71) {
      return { row: 10, col: 4 + (e.z - 57) };
    }
    if (e.z >= 89 && e.z <= 103) {
      return { row: 11, col: 4 + (e.z - 89) };
    }
    return { row: e.period + 1, col: e.group + 1 };
  }

  function buildGrid() {
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();

    // Top Group headers 1..18
    for (let g = 1; g <= 18; g++) {
      const ch = el("div", { class: "pt-col-head", "aria-hidden": "true", text: String(g) });
      ch.style.gridRow = "1";
      ch.style.gridColumn = String(g + 1);
      frag.append(ch);
    }

    // Left Period headers 1..7 + f-block series labels
    for (let p = 1; p <= 7; p++) {
      const rh = el("div", { class: "pt-row-head", "aria-hidden": "true", text: String(p) });
      rh.style.gridRow = String(p + 1);
      rh.style.gridColumn = "1";
      frag.append(rh);
    }
    const lh4f = el("div", { class: "pt-row-head is-series", "aria-hidden": "true", text: "4f" });
    lh4f.style.gridRow = "10";
    lh4f.style.gridColumn = "1";
    const lh5f = el("div", { class: "pt-row-head is-series", "aria-hidden": "true", text: "5f" });
    lh5f.style.gridRow = "11";
    lh5f.style.gridColumn = "1";
    frag.append(lh4f, lh5f);

    // Interactive Group 3 markers for 57–71 and 89–103
    const laMarker = el("button", {
      type: "button",
      class: "pt-series-marker",
      title: "Jump to Lanthanoids (4f series, Z=57–71)",
      "aria-label": "Jump to Lanthanoids 57 to 71"
    }, el("span", { text: "57–71" }), el("span", { text: "La–Lu" }));
    laMarker.style.gridRow = "7";
    laMarker.style.gridColumn = "4";
    laMarker.addEventListener("click", () => selectElement(57, true));

    const acMarker = el("button", {
      type: "button",
      class: "pt-series-marker is-actinoid",
      title: "Jump to Actinoids (5f series, Z=89–103)",
      "aria-label": "Jump to Actinoids 89 to 103"
    }, el("span", { text: "89–103" }), el("span", { text: "Ac–Lr" }));
    acMarker.style.gridRow = "8";
    acMarker.style.gridColumn = "4";
    acMarker.addEventListener("click", () => selectElement(89, true));

    frag.append(laMarker, acMarker);

    // 118 element buttons
    ELEMENTS.forEach((e) => {
      const { row, col } = getGridCoords(e);
      const excTier = e.anomalousConfig ? "anom" : (e.hasCuratedExceptions ? "trap" : "none");
      const btn = el("button", {
        type: "button",
        class: "pt-cell",
        "data-z": String(e.z),
        "data-cat": e.cat,
        "data-block": e.block,
        "data-exc-tier": excTier,
        role: "gridcell",
        "aria-pressed": "false",
        "aria-label": `${e.name}, symbol ${e.sym}, atomic number ${e.z}, ${e.catLabel}${e.anomalousConfig ? ", Aufbau configuration exception" : ""}`
      });
      btn.style.gridRow = String(row);
      btn.style.gridColumn = String(col);
      btn.dataset.ptRow = String(row);
      btn.dataset.ptCol = String(col);

      const topRow = el("div", { class: "pt-cell-top" }, el("span", { class: "pt-cell-z", text: String(e.z) }));
      if (e.anomalousConfig) {
        topRow.append(el("span", { class: "pt-cell-anom", title: "Aufbau configuration exception", text: "*" }));
      }
      const symEl = el("span", { class: "pt-cell-sym", text: e.sym });
      const subEl = el("span", { class: "pt-cell-sub", text: e.mass });

      btn.append(topRow, symEl, subEl);
      btn.addEventListener("click", () => selectElement(e.z, false));
      btn.addEventListener("keydown", handleCellKeydown);

      tileByZ.set(e.z, btn);
      frag.append(btn);
    });

    grid.append(frag);
  }

  function handleCellKeydown(evt) {
    const key = evt.key;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) return;
    evt.preventDefault();
    const curZ = Number(evt.currentTarget.dataset.z);
    if (key === "ArrowLeft") {
      const prev = Math.max(1, curZ - 1);
      selectElement(prev, true);
      return;
    }
    if (key === "ArrowRight") {
      const next = Math.min(118, curZ + 1);
      selectElement(next, true);
      return;
    }
    const row = Number(evt.currentTarget.dataset.ptRow);
    const col = Number(evt.currentTarget.dataset.ptCol);
    const delta = key === "ArrowUp" ? -1 : 1;
    for (let step = 1; step <= 4; step++) {
      const targetRow = row + delta * step;
      if (targetRow < 2 || targetRow > 11) break;
      const match = ELEMENTS.find((elItem) => {
        const c = getGridCoords(elItem);
        return c.row === targetRow && c.col === col;
      });
      if (match) {
        selectElement(match.z, true);
        return;
      }
    }
  }

  function applyHeatmapAndSublabels() {
    grid.setAttribute("data-heatmap", heatmapMode);
    ELEMENTS.forEach((e) => {
      const btn = tileByZ.get(e.z);
      if (!btn) return;
      const sub = btn.querySelector(".pt-cell-sub");
      btn.style.removeProperty("--pt-heat-bg");
      btn.style.removeProperty("--pt-heat-border");

      if (heatmapMode === "category") {
        if (sub) sub.textContent = e.mass;
      } else if (heatmapMode === "ie1") {
        const val = e.ie1;
        if (sub) sub.textContent = val != null ? `${val}` : "—";
        if (val != null) {
          const t = clamp((val - EXTENTS.ie1.min) / (EXTENTS.ie1.max - EXTENTS.ie1.min || 1), 0, 1);
          const hue = Math.round(202 - t * 164); // cyan (low) -> amber/gold (high)
          btn.style.setProperty("--pt-heat-bg", `hsla(${hue}, 82%, ${22 + t * 22}%, ${0.26 + t * 0.42})`);
          btn.style.setProperty("--pt-heat-border", `hsla(${hue}, 88%, 62%, ${0.38 + t * 0.45})`);
        }
      } else if (heatmapMode === "en") {
        const val = e.en;
        if (sub) sub.textContent = val != null ? val.toFixed(2) : "—";
        if (val != null) {
          const t = clamp((val - EXTENTS.en.min) / (EXTENTS.en.max - EXTENTS.en.min || 1), 0, 1);
          const hue = Math.round(215 + t * 65); // blue -> violet
          btn.style.setProperty("--pt-heat-bg", `hsla(${hue}, 82%, ${24 + t * 20}%, ${0.24 + t * 0.44})`);
          btn.style.setProperty("--pt-heat-border", `hsla(${hue}, 88%, 66%, ${0.36 + t * 0.46})`);
        }
      } else if (heatmapMode === "radius") {
        const val = e.radius;
        if (sub) sub.textContent = val != null ? `${val} pm` : "—";
        if (val != null) {
          const t = clamp((val - EXTENTS.radius.min) / (EXTENTS.radius.max - EXTENTS.radius.min || 1), 0, 1);
          btn.style.setProperty("--pt-heat-bg", `hsla(158, 76%, ${20 + t * 22}%, ${0.22 + t * 0.46})`);
          btn.style.setProperty("--pt-heat-border", `hsla(158, 82%, 56%, ${0.35 + t * 0.48})`);
        }
      } else if (heatmapMode === "exceptions") {
        if (sub) sub.textContent = e.anomalousConfig ? "Aufbau*" : (e.hasCuratedExceptions ? "JEE Trap" : e.mass);
      }
    });
    renderLegendBar();
  }

  const BROAD_CLASSES = [
    { key: "class:metals", label: "Metals", cats: new Set(["alkali", "alkaline", "transition", "post-transition", "lanthanoid", "actinoid"]), swatchClass: "is-metals" },
    { key: "class:metalloids", label: "Metalloids", cats: new Set(["metalloid"]), swatchClass: "is-metalloids" },
    { key: "class:nonmetals", label: "Non-metals", cats: new Set(["reactive-nonmetal", "noble-gas"]), swatchClass: "is-nonmetals" }
  ];

  function toggleLegendFilter(nextKey) {
    activeFilter = activeFilter === nextKey ? "all" : nextKey;
    syncFilterChipsUI();
    applyFilters();
  }

  function makeLegendChip({ key, label, title, swatchClass, dataCat }) {
    const isActive = activeFilter === key;
    const chip = el("button", {
      type: "button",
      class: "pt-legend-chip" + (isActive ? " active" : ""),
      "aria-pressed": String(isActive),
      title: title || `Highlight ${label} in grid`
    });
    if (dataCat) chip.setAttribute("data-cat", dataCat);
    chip.append(el("span", { class: "pt-legend-swatch" + (swatchClass ? " " + swatchClass : "") }));
    chip.append(el("span", { text: label }));
    chip.addEventListener("click", () => toggleLegendFilter(key));
    return chip;
  }

  function renderLegendBar() {
    if (!legendBar) return;
    legendBar.innerHTML = "";

    const appendBroadClassRow = (rowParent, labelText) => {
      const catRow = el("div", { class: "pt-heat-legend-cats" });
      catRow.append(el("span", { class: "pt-heat-legend-label", text: labelText || "Highlight Category:" }));
      BROAD_CLASSES.forEach((bc) => {
        catRow.append(makeLegendChip({
          key: bc.key,
          label: bc.label,
          swatchClass: bc.swatchClass,
          title: `Highlight all ${bc.label} and fade others`
        }));
      });
      if (activeFilter !== "all") {
        const clr = el("button", {
          type: "button",
          class: "pt-legend-chip is-reset",
          text: "✕ Show All"
        });
        clr.addEventListener("click", () => {
          activeFilter = "all";
          syncFilterChipsUI();
          applyFilters();
        });
        catRow.append(clr);
      }
      rowParent.append(catRow);
    };

    if (heatmapMode === "category") {
      BROAD_CLASSES.forEach((bc) => {
        legendBar.append(makeLegendChip({
          key: bc.key,
          label: bc.label,
          swatchClass: bc.swatchClass,
          title: `Highlight all ${bc.label} and fade others`
        }));
      });
      Object.entries(CATEGORIES).forEach(([key, info]) => {
        legendBar.append(makeLegendChip({
          key: `cat:${key}`,
          label: info.short,
          dataCat: key,
          title: `Highlight ${info.label}`
        }));
      });
      if (activeFilter !== "all") {
        const clr = el("button", { type: "button", class: "pt-legend-chip is-reset", text: "✕ Show All" });
        clr.addEventListener("click", () => {
          activeFilter = "all";
          syncFilterChipsUI();
          applyFilters();
        });
        legendBar.append(clr);
      }
      const note = el("span", { class: "small-muted", style: "margin:0 0 0 auto;white-space:nowrap", text: "* = Aufbau exception (20)" });
      legendBar.append(note);
    } else if (heatmapMode === "ie1") {
      legendBar.innerHTML = `<div class="pt-heat-scale"><strong>IE₁ (kJ mol⁻¹):</strong><span>Min ${EXTENTS.ie1.min} (Cs)</span><span class="pt-heat-gradient" aria-hidden="true"></span><span>Max ${EXTENTS.ie1.max} (He)</span><span>Notice dips at B, O, Al, S &amp; rise at Ga!</span></div>`;
      appendBroadClassRow(legendBar, "Highlight Category:");
    } else if (heatmapMode === "en") {
      legendBar.innerHTML = `<div class="pt-heat-scale"><strong>Pauling Electronegativity χₚ:</strong><span>Min ${EXTENTS.en.min.toFixed(2)} (Fr)</span><span class="pt-heat-gradient is-en" aria-hidden="true"></span><span>Max ${EXTENTS.en.max.toFixed(2)} (F)</span><span>F &gt; O &gt; Cl ≈ N</span></div>`;
      appendBroadClassRow(legendBar, "Highlight Category:");
    } else if (heatmapMode === "radius") {
      legendBar.innerHTML = `<div class="pt-heat-scale"><strong>Covalent Radius (pm):</strong><span>Min ${EXTENTS.radius.min} (He)</span><span class="pt-heat-gradient is-radius" aria-hidden="true"></span><span>Max ${EXTENTS.radius.max} (Fr)</span><span>Compare Ga (122) ≈ Al (121) &amp; Zr (175) = Hf (175)</span></div>`;
      appendBroadClassRow(legendBar, "Highlight Category:");
    } else if (heatmapMode === "exceptions") {
      const wrap = el("div", { class: "pt-heat-scale" });
      const bAnom = makeLegendChip({
        key: "anomalous",
        label: "* Aufbau Exception (20)",
        swatchClass: "is-anom",
        title: "Highlight only the 20 Aufbau configuration exceptions"
      });
      const bTrap = makeLegendChip({
        key: "exceptions",
        label: "JEE / CBSE Trend & Chemical Traps",
        swatchClass: "is-trap",
        title: "Highlight all curated JEE/CBSE exception elements"
      });
      wrap.append(bAnom, bTrap);
      BROAD_CLASSES.forEach((bc) => {
        wrap.append(makeLegendChip({
          key: bc.key,
          label: bc.label,
          swatchClass: bc.swatchClass,
          title: `Highlight ${bc.label}`
        }));
      });
      if (activeFilter !== "all") {
        const clr = el("button", { type: "button", class: "pt-legend-chip is-reset", text: "✕ Show All" });
        clr.addEventListener("click", () => {
          activeFilter = "all";
          syncFilterChipsUI();
          applyFilters();
        });
        wrap.append(clr);
      }
      legendBar.append(wrap);
    }
  }

  function elementMatches(e, q) {
    if (activeFilter === "s" || activeFilter === "p" || activeFilter === "d" || activeFilter === "f") {
      if (e.block !== activeFilter) return false;
    } else if (activeFilter === "anomalous") {
      if (!e.anomalousConfig) return false;
    } else if (activeFilter === "exceptions") {
      if (!e.anomalousConfig && !e.hasCuratedExceptions) return false;
    } else if (activeFilter.startsWith("class:")) {
      const bc = BROAD_CLASSES.find((item) => item.key === activeFilter);
      if (bc && !bc.cats.has(e.cat)) return false;
    } else if (activeFilter.startsWith("cat:")) {
      if (e.cat !== activeFilter.slice(4)) return false;
    }

    if (!q) return true;
    const ql = fold(q);
    if (String(e.z) === ql || fold(e.sym) === ql || fold(e.name).includes(ql) || fold(e.catLabel).includes(ql)) return true;
    if (fold(e.ox).includes(ql) || fold(e.configLatex).includes(ql)) return true;
    const exList = PT.getElementExceptions(e);
    return exList.some((ex) => fold(`${ex.tag} ${ex.title} ${ex.body}`).includes(ql));
  }

  function applyFilters() {
    const q = (searchInput && searchInput.value ? searchInput.value : "").trim();
    const isFiltering = activeFilter !== "all" || Boolean(q);
    let count = 0;
    let firstMatchZ = null;
    ELEMENTS.forEach((e) => {
      const ok = elementMatches(e, q);
      const btn = tileByZ.get(e.z);
      if (btn) {
        btn.classList.toggle("dimmed", !ok);
        btn.classList.toggle("legend-highlight", isFiltering && ok);
      }
      if (ok) {
        count++;
        if (firstMatchZ === null) firstMatchZ = e.z;
      }
    });
    if (matchCountEl) {
      matchCountEl.textContent = count === 118 ? "118 ELEMENTS" : `${count} / 118 MATCHED`;
    }
    if (q && firstMatchZ !== null && !elementMatches(PT.byZ(selectedZ), q)) {
      selectElement(firstMatchZ, false);
    }
  }

  function syncFilterChipsUI() {
    if (filterRow) {
      filterRow.querySelectorAll(".chip").forEach((ch) => {
        const on = ch.dataset.ptFilter === activeFilter;
        ch.classList.toggle("active", on);
        ch.setAttribute("aria-pressed", String(on));
      });
    }
    renderLegendBar();
  }

  function pickSmartNeighborZ(e) {
    // Classic JEE comparative pairs first
    const pairedMap = {
      3: 12, 12: 3,   // Li vs Mg diagonal
      4: 5, 5: 4,     // Be vs B IE1 reversal
      6: 14, 14: 6,   // C vs Si
      7: 8, 8: 7,     // N vs O IE1 reversal
      9: 17, 17: 9,   // F vs Cl EA reversal
      13: 31, 31: 13, // Al vs Ga d-block contraction
      15: 16, 16: 15, // P vs S
      24: 42, 42: 24, // Cr vs Mo
      29: 47, 47: 29, // Cu vs Ag
      40: 72, 72: 40, // Zr vs Hf lanthanoid contraction
      46: 78, 78: 46  // Pd (5s0) vs Pt (6s1)
    };
    if (pairedMap[e.z]) return pairedMap[e.z];
    // Try element right below in same group
    const below = ELEMENTS.find((x) => x.group === e.group && x.period === e.period + 1 && x.block === e.block);
    if (below) return below.z;
    const right = ELEMENTS.find((x) => x.z === e.z + 1);
    return right ? right.z : Math.max(1, e.z - 1);
  }

  function renderInspector() {
    const e = PT.byZ(selectedZ);
    if (!e) return;

    // Update grid selected styling
    tileByZ.forEach((btn, z) => {
      const on = z === e.z;
      btn.classList.toggle("selected", on);
      btn.setAttribute("aria-pressed", String(on));
    });

    if (inspTile) inspTile.setAttribute("data-cat", e.cat);
    if (inspZ) inspZ.textContent = String(e.z);
    if (inspSym) inspSym.textContent = e.sym;
    if (inspMass) inspMass.textContent = String(e.mass);
    if (inspName) inspName.textContent = e.name;
    if (inspMeta) {
      inspMeta.textContent = `Period ${e.period} · Group ${e.group} · ${e.block}-block · ${e.state} (298 K)`;
    }

    if (inspTags) {
      inspTags.innerHTML = "";
      inspTags.append(el("span", { class: "pt-tag-chip", text: e.catLabel }));
      if (e.anomalousConfig) {
        inspTags.append(el("span", { class: "pt-tag-chip anom", text: "* Aufbau Exception" }));
      }
      if (e.hasCuratedExceptions) {
        inspTags.append(el("span", { class: "pt-tag-chip trap", text: "JEE High-Yield" }));
      }
    }

    // 1) Overview & KaTeX
    if (configMathEl) {
      configMathEl.innerHTML = renderLatex(`\\ce{_{${e.z}}${e.sym}} : ${e.configLatex}`, true);
    }
    if (anomCompareEl) {
      if (e.anomalousConfig && e.expectedLatex) {
        anomCompareEl.hidden = false;
        anomCompareEl.innerHTML = `
          <div><strong>Aufbau Configuration Exception (${e.sym}, Z = ${e.z})</strong></div>
          <div class="pt-anom-compare-row">
            <span>Naive Aufbau: <span class="pt-anom-expected">${renderLatex(e.expectedLatex, false)}</span></span>
            <span>Observed: <span class="pt-anom-observed">${renderLatex(e.configLatex, false)}</span></span>
          </div>
        `;
      } else {
        anomCompareEl.hidden = true;
        anomCompareEl.innerHTML = "";
      }
    }
    if (qnBoxEl && e.qn) {
      qnBoxEl.innerHTML = `
        <div><strong>Differentiating Subshell Quantum Numbers</strong> (${renderLatex(e.qn.subshell, false)})</div>
        ${renderLatex(`n = ${e.qn.n},\\quad l = ${e.qn.l},\\quad m_l = ${e.qn.ml},\\quad m_s = ${e.qn.ms}`, true)}
      `;
    }

    if (propsGridEl) {
      const fmtNum = (val, unit) => (val != null ? `${val} ${unit}` : "Data unavailable");
      const props = [
        { k: "First Ionisation IE₁", v: fmtNum(e.ie1, "kJ mol⁻¹"), raw: true },
        { kHtml: "Electron Gain Δ<sub>eg</sub>H₁°", v: fmtNum(e.ea, "kJ mol⁻¹"), raw: true },
        { k: "Pauling EN χₚ", v: e.en != null ? e.en.toFixed(2) : "— (Inert / Synthetic)", raw: true },
        { k: "Covalent Radius r", v: fmtNum(e.radius, "pm"), raw: true },
        { k: "Oxidation States", v: `$${e.ox}$`, raw: false },
        { k: "Melting / Boiling Point", v: `${e.mp != null ? e.mp + " K" : "—"}  /  ${e.bp != null ? e.bp + " K" : "—"}`, raw: true },
        { k: "Standard Atomic Mass", v: `${e.mass} u`, raw: true },
        { k: "Block / Physical State", v: `${e.block}-block · ${e.state}`, raw: true }
      ];
      propsGridEl.innerHTML = "";
      props.forEach((item) => {
        const dt = el("dt", {});
        if (item.kHtml) dt.innerHTML = item.kHtml;
        else dt.textContent = item.k;
        const dd = el("dd", {});
        if (item.raw) dd.textContent = item.v;
        else dd.innerHTML = mdInlineToHtml(item.v);
        propsGridEl.append(el("div", { class: "pt-prop-card" }, dt, dd));
      });
    }

    // 2) Exceptions & Traps tab
    const excList = PT.getElementExceptions(e);
    if (excCountEl) excCountEl.textContent = String(excList.length);
    if (excListEl) {
      excListEl.innerHTML = "";
      excList.forEach((item) => {
        const card = el("article", { class: "pt-exc-card" });
        const tag = el("span", { class: "pt-exc-tag", text: item.tag });
        const title = el("h4", { class: "pt-exc-title" });
        title.innerHTML = mdInlineToHtml(item.title);
        const body = el("p", { class: "pt-exc-body" });
        body.innerHTML = mdInlineToHtml(item.body);
        card.append(tag, title, body);
        excListEl.append(card);
      });
    }

    // 3) Compare Tab
    renderCompare(e);

    // 4) Action buttons
    if (askNemoBtn) {
      askNemoBtn.textContent = `Ask Nemo AI about ${e.name} (${e.sym}) ↗`;
    }
    if (view3DBtn) {
      const mol = e.molHint ? MOLS.find((m) => m.id === e.molHint) : null;
      if (mol) {
        view3DBtn.hidden = false;
        view3DBtn.textContent = `⬡ View ${mol.name} in 3D`;
        view3DBtn.dataset.molId = mol.id;
      } else {
        view3DBtn.hidden = true;
        view3DBtn.dataset.molId = "";
      }
    }
  }

  function populateCompareDropdown() {
    if (!compareSelect) return;
    compareSelect.innerHTML = "";
    ELEMENTS.forEach((e) => {
      const opt = el("option", { value: String(e.z), text: `${e.z} · ${e.sym} — ${e.name}` });
      compareSelect.append(opt);
    });
  }

  function renderCompare(primaryEl) {
    if (!compareBodyEl || !compareQuickEl) return;
    if (compareZ === primaryEl.z) {
      compareZ = pickSmartNeighborZ(primaryEl);
    }
    if (compareSelect) compareSelect.value = String(compareZ);

    // Build quick comparison neighbor chips
    compareQuickEl.innerHTML = "";
    const candidates = [];
    const smartZ = pickSmartNeighborZ(primaryEl);
    const smartEl = smartZ ? PT.byZ(smartZ) : null;
    if (smartEl && smartZ !== primaryEl.z) candidates.push({ label: `Key Pair: ${smartEl.sym}`, z: smartZ });
    const prevEl = ELEMENTS.find((x) => x.z === primaryEl.z - 1);
    const nextEl = ELEMENTS.find((x) => x.z === primaryEl.z + 1);
    const upEl = ELEMENTS.find((x) => x.group === primaryEl.group && x.period === primaryEl.period - 1 && x.block === primaryEl.block);
    const downEl = ELEMENTS.find((x) => x.group === primaryEl.group && x.period === primaryEl.period + 1 && x.block === primaryEl.block);
    if (prevEl) candidates.push({ label: `← ${prevEl.sym} (${prevEl.z})`, z: prevEl.z });
    if (nextEl) candidates.push({ label: `→ ${nextEl.sym} (${nextEl.z})`, z: nextEl.z });
    if (upEl) candidates.push({ label: `↑ ${upEl.sym}`, z: upEl.z });
    if (downEl) candidates.push({ label: `↓ ${downEl.sym}`, z: downEl.z });

    const seen = new Set();
    candidates.forEach((c) => {
      if (seen.has(c.z) || c.z === primaryEl.z) return;
      seen.add(c.z);
      const chip = el("button", { type: "button", class: "pt-compare-chip", text: c.label });
      if (compareZ === c.z) {
        chip.style.borderColor = "var(--cyan)";
        chip.style.color = "#ffffff";
      }
      chip.addEventListener("click", () => {
        compareZ = c.z;
        renderCompare(primaryEl);
      });
      compareQuickEl.append(chip);
    });

    const other = PT.byZ(compareZ);
    if (!other) return;

    const cmpMetric = (a, b, unit) => {
      if (a == null || b == null) return "—";
      const d = b - a;
      const sign = d > 0 ? "+" : "";
      const txt = Number.isInteger(d) ? String(d) : d.toFixed(2);
      return `${sign}${txt} ${unit}`;
    };

    const aEa = primaryEl.ea != null ? `${primaryEl.ea} kJ mol⁻¹` : "—";
    const bEa = other.ea != null ? `${other.ea} kJ mol⁻¹` : "—";

    const renderMetricBarRow = ({ title, aVal, bVal, unit, decimals, extent }) => {
      const hasBoth = typeof aVal === "number" && typeof bVal === "number";
      const fmtV = (v) => (typeof v === "number" ? `${decimals ? v.toFixed(decimals) : v}${unit ? " " + unit : ""}` : "—");
      let deltaBadge = `<span class="pt-cmp-delta-pill">Data unavailable</span>`;
      let aHigher = false;
      let bHigher = false;
      if (hasBoth) {
        const diff = bVal - aVal;
        const absDiff = Math.abs(diff);
        const diffStr = decimals ? absDiff.toFixed(decimals) : String(absDiff);
        if (absDiff < 1e-6) {
          deltaBadge = `<span class="pt-cmp-delta-pill">= Equal</span>`;
        } else if (diff > 0) {
          bHigher = true;
          deltaBadge = `<span class="pt-cmp-delta-pill is-up">▲ ${esc(other.sym)} +${diffStr}${unit ? " " + unit : ""}</span>`;
        } else {
          aHigher = true;
          deltaBadge = `<span class="pt-cmp-delta-pill is-down">▼ ${esc(other.sym)} −${diffStr}${unit ? " " + unit : ""}</span>`;
        }
      }
      const pct = (v) => {
        if (typeof v !== "number") return 0;
        const lo = 0;
        const hi = extent && extent.max ? extent.max : Math.max(aVal || 0, bVal || 0, 1);
        return Math.max(6, Math.min(100, Math.round(((v - lo) / (hi - lo || 1)) * 100)));
      };

      return `
        <div class="pt-cmp-metric-row">
          <div class="pt-cmp-metric-head">
            <span class="pt-cmp-metric-title">${title}</span>
            ${deltaBadge}
          </div>
          <div class="pt-cmp-bars-grid">
            <div class="pt-cmp-bar-col">
              <div class="pt-cmp-bar-val${aHigher ? " is-winner" : ""}">
                <span>${esc(primaryEl.sym)}</span>
                <strong>${esc(fmtV(aVal))}</strong>
              </div>
              <div class="pt-cmp-track" aria-hidden="true"><div class="pt-cmp-fill" style="width:${pct(aVal)}%"></div></div>
            </div>
            <div class="pt-cmp-bar-col">
              <div class="pt-cmp-bar-val${bHigher ? " is-winner" : ""}">
                <span>${esc(other.sym)}</span>
                <strong>${esc(fmtV(bVal))}</strong>
              </div>
              <div class="pt-cmp-track" aria-hidden="true"><div class="pt-cmp-fill is-other" style="width:${pct(bVal)}%"></div></div>
            </div>
          </div>
        </div>
      `;
    };

    let verdict = `Comparing $\\ce{${primaryEl.sym}}$ ($Z=${primaryEl.z}$) against $\\ce{${other.sym}}$ ($Z=${other.z}$): `;
    if (primaryEl.group === other.group && primaryEl.block === other.block) {
      if ((primaryEl.z === 9 && other.z === 17) || (primaryEl.z === 17 && other.z === 9)) {
        verdict += `$\\Delta_{\\text{eg}}H_1^\\circ(\\ce{Cl}) = -349 < \\Delta_{\\text{eg}}H_1^\\circ(\\ce{F}) = -328\\text{ kJ mol}^{-1}$ (more exothermic in Cl due to $2p$ inter-electronic repulsion in F!).`;
      } else if ((primaryEl.z === 8 && other.z === 16) || (primaryEl.z === 16 && other.z === 8)) {
        verdict += `$\\ce{S}$ releases $-200\\text{ kJ mol}^{-1}$ vs $\\ce{O}$ $-141\\text{ kJ mol}^{-1}$ on gaining $1e^-$ because $2p$ crowding slows electron capture in oxygen.`;
      } else if ((primaryEl.z === 13 && other.z === 31) || (primaryEl.z === 31 && other.z === 13)) {
        verdict += `**$d$-Block Contraction Trap**: poor $3d^{10}$ shielding makes $\\text{IE}_1(\\ce{Ga}) = 579 > \\text{IE}_1(\\ce{Al}) = 578\\text{ kJ mol}^{-1}$ and compresses Gallium's metallic radius!`;
      } else if ((primaryEl.z === 40 && other.z === 72) || (primaryEl.z === 72 && other.z === 40)) {
        verdict += `**Lanthanoid Contraction Hallmark**: $4f^{14}$ shielding deficit leaves $r(\\ce{Zr}) = 175\\text{ pm} = r(\\ce{Hf}) = 175\\text{ pm}$, making them chemical twins!`;
      } else {
        verdict += `Same Group ${primaryEl.group}: valence shell increases (${primaryEl.period} → ${other.period}), affecting size, $\\text{IE}_1$, and inert-pair / relativistic $s$-orbital stability.`;
      }
    } else if (primaryEl.period === other.period) {
      if ((primaryEl.z === 4 && other.z === 5) || (primaryEl.z === 5 && other.z === 4)) {
        verdict += `**Subshell Penetration Anomaly**: filled $2s^2$ gives $\\text{IE}_1(\\ce{Be}) = 899 > \\text{IE}_1(\\ce{B}) = 801\\text{ kJ mol}^{-1}$.`;
      } else if ((primaryEl.z === 7 && other.z === 8) || (primaryEl.z === 8 && other.z === 7)) {
        verdict += `**Half-Filled Symmetry Anomaly**: $2p^3$ exchange stability gives $\\text{IE}_1(\\ce{N}) = 1402 > \\text{IE}_1(\\ce{O}) = 1314\\text{ kJ mol}^{-1}$.`;
      } else {
        verdict += `Same Period ${primaryEl.period}: $Z_{\\text{eff}}$ shifts across the period while shell $n=${primaryEl.period}$ remains constant.`;
      }
    } else if ((primaryEl.z === 3 && other.z === 12) || (primaryEl.z === 12 && other.z === 3)) {
      verdict += `**Diagonal Relationship ($\\ce{Li}\\leftrightarrow\\ce{Mg}$)**: matching charge/radius polarising power gives covalent organometallics, thermal nitrate/carbonate breakdown, and low hydroxide solubility.`;
    } else {
      verdict += `Notice how block ($${primaryEl.block}$ vs $${other.block}$) and shell $n$ drive orbital energy, $\\chi_P$, and $\\text{IE}_1$.`;
    }

    compareBodyEl.innerHTML = `
      <div class="pt-cmp-pair-grid">
        <div class="pt-cmp-card" data-cat="${esc(primaryEl.cat)}">
          <div class="pt-cmp-card-top">
            <span class="pt-cmp-role">Selected</span>
            <span class="pt-cmp-zbadge">Z=${primaryEl.z} · ${esc(primaryEl.block)}</span>
          </div>
          <div class="pt-cmp-card-symrow">
            <strong>${esc(primaryEl.sym)}</strong>
            <span>${esc(primaryEl.name)}</span>
          </div>
          <div class="pt-cmp-card-cfg">${renderLatex(primaryEl.configLatex, false)}</div>
        </div>
        <div class="pt-cmp-card" data-cat="${esc(other.cat)}">
          <div class="pt-cmp-card-top">
            <span class="pt-cmp-role">Comparison</span>
            <span class="pt-cmp-zbadge">Z=${other.z} · ${esc(other.block)}</span>
          </div>
          <div class="pt-cmp-card-symrow">
            <strong>${esc(other.sym)}</strong>
            <span>${esc(other.name)}</span>
          </div>
          <div class="pt-cmp-card-cfg">${renderLatex(other.configLatex, false)}</div>
        </div>
      </div>

      <div class="pt-cmp-metrics">
        ${renderMetricBarRow({ title: "Electronegativity (Pauling χₚ)", aVal: primaryEl.en, bVal: other.en, unit: "", decimals: 2, extent: EXTENTS.en })}
        ${renderMetricBarRow({ title: "Atomic Radius (r)", aVal: primaryEl.radius, bVal: other.radius, unit: "pm", decimals: 0, extent: EXTENTS.radius })}
        ${renderMetricBarRow({ title: "Ionisation Energy (IE₁)", aVal: primaryEl.ie1, bVal: other.ie1, unit: "kJ mol⁻¹", decimals: 0, extent: EXTENTS.ie1 })}
      </div>

      <table class="pt-cmp-table">
        <tbody>
          <tr><th>Electron Gain Δ<sub>eg</sub>H₁°</th><td>${esc(aEa)}</td><td>${esc(bEa)}</td><td>${esc(cmpMetric(primaryEl.ea, other.ea, "kJ"))}</td></tr>
          <tr><th>Oxidation States</th><td>${mdInlineToHtml("$" + primaryEl.ox + "$")}</td><td>${mdInlineToHtml("$" + other.ox + "$")}</td><td>Period ${primaryEl.period} vs ${other.period}</td></tr>
        </tbody>
      </table>
      <div class="pt-cmp-verdict">${mdInlineToHtml(verdict)}</div>
    `;
  }

  function selectElement(z, focusTile = false) {
    const nextZ = clamp(Number(z) || 1, 1, 118);
    if (nextZ !== selectedZ) {
      selectedZ = nextZ;
      compareZ = pickSmartNeighborZ(PT.byZ(selectedZ));
    }
    renderInspector();
    if (focusTile) {
      const btn = tileByZ.get(selectedZ);
      if (btn) {
        btn.focus({ preventScroll: true });
        btn.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest", inline: "nearest" });
      }
    }
  }

  // Event wiring
  if (filterRow) {
    filterRow.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.dataset.ptFilter || "all";
        syncFilterChipsUI();
        applyFilters();
      });
    });
  }

  if (heatmapRow) {
    heatmapRow.querySelectorAll(".pt-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        heatmapMode = btn.dataset.ptMode || "category";
        heatmapRow.querySelectorAll(".pt-mode-btn").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        applyHeatmapAndSublabels();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      activeFilter = "all";
      heatmapMode = "category";
      if (heatmapRow) {
        heatmapRow.querySelectorAll(".pt-mode-btn").forEach((b) => {
          const on = b.dataset.ptMode === "category";
          b.classList.toggle("active", on);
          b.setAttribute("aria-pressed", String(on));
        });
      }
      syncFilterChipsUI();
      applyHeatmapAndSublabels();
      applyFilters();
    });
  }

  inspTabBtns.forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      activeInspTab = tabBtn.dataset.ptTab || "overview";
      inspTabBtns.forEach((b) => {
        const on = b === tabBtn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", String(on));
      });
      Object.entries(inspPanes).forEach(([key, pane]) => {
        if (pane) pane.hidden = key !== activeInspTab;
      });
    });
  });

  if (compareSelect) {
    compareSelect.addEventListener("change", () => {
      compareZ = Number(compareSelect.value) || 1;
      renderCompare(PT.byZ(selectedZ));
    });
  }

  if (askNemoBtn) {
    askNemoBtn.addEventListener("click", () => {
      const e = PT.byZ(selectedZ);
      ensurePanelVisible("chatPanel");
      $("#chatPanel")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      const prompt = e.anomalousConfig
        ? `Explain the periodic properties, spectroscopic electron configuration exception (${e.configLatex.replace(/\\,/g, " ")}), and JEE Main/Advanced traps for ${e.name} (${e.sym}, Z=${e.z}).`
        : `Explain the key periodic trends, oxidation states, and JEE/CBSE exam exceptions for ${e.name} (${e.sym}, Z=${e.z}).`;
      askNemo(prompt, { topic: "exceptions" });
    });
  }

  if (view3DBtn) {
    view3DBtn.addEventListener("click", () => {
      const molId = view3DBtn.dataset.molId;
      if (!molId) return;
      const molSel = $("#moleculeSelect");
      if (molSel) {
        molSel.value = molId;
        molSel.dispatchEvent(new Event("change"));
      }
      ensurePanelVisible("moleculePanel");
      $("#moleculePanel")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  // Boot build
  buildGrid();
  populateCompareDropdown();
  applyHeatmapAndSublabels();
  applyFilters();
  selectElement(selectedZ, false);

  // Re-render KaTeX blocks if KaTeX loads right after app.js via CDN fallback
  window.addEventListener("load", () => {
    renderInspector();
  });
})();

/* ============================== boot ============================== */
renderHistory();
refreshSend();
