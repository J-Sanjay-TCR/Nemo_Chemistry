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

function ensurePanelVisible(panelId) {
  if (!panelId) return;
  const panel = document.getElementById(panelId);
  if (!panel) return;
  if (panel.style.display === "none") {
    const allTab = document.querySelector('.ws-tab[data-filter="all"]');
    if (allTab) {
      allTab.click();
    } else {
      panel.style.display = "";
    }
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
function renderLatex(latex, isDisplay = false) {
  if (typeof window.katex !== "undefined" && typeof window.katex.renderToString === "function") {
    try {
      return window.katex.renderToString(latex.trim(), {
        displayMode: isDisplay,
        throwOnError: false,
        trust: true
      });
    } catch (_) {}
  }
  return `<code class="${isDisplay ? 'latex-block' : 'latex-inline'}">${esc(latex.trim())}</code>`;
}

function inlineMd(s) {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
  return s;
}

function mdToHtml(src) {
  if (!src) return "";
  let text = String(src).replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const tokens = [];
  const placeholder = (html) => {
    const idx = tokens.length;
    tokens.push(html);
    return `___KATEX_TOK_${idx}___`;
  };

  // 1. Extract and protect Code Blocks (```lang ... ```)
  text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (m, lang, code) => {
    return "\n\n" + placeholder(`<pre><code class="lang-${esc(lang)}">${esc(code.trim())}</code></pre>`) + "\n\n";
  });

  // 2. Extract and protect Display Math ($$...$$)
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (m, math) => {
    const rendered = renderLatex(math, true);
    return "\n\n" + placeholder(`<div class="chat-math-block" tabindex="0">${rendered}</div>`) + "\n\n";
  });

  // 3. Extract and protect Inline Math ($...$)
  text = text.replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (m, prefix, math) => {
    const rendered = renderLatex(math, false);
    return `${prefix}${placeholder(`<span class="chat-math-inline">${rendered}</span>`)}`;
  });

  // 4. Extract and protect Inline Code (`...`)
  text = text.replace(/`([^`]+)`/g, (m, c) => {
    return placeholder(`<code>${esc(c)}</code>`);
  });

  // 5. Line-by-line block parsing
  const lines = text.split("\n");
  const out = [];
  const isTableSep = (l) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(l) && l.includes("-");
  const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
  const splitRow = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

  function formatInline(str) {
    str = esc(str);
    str = str.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    str = str.replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
    return str;
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    // Standalone placeholder line
    if (/^___KATEX_TOK_\d+___$/.test(line.trim())) {
      out.push(line.trim());
      i++;
      continue;
    }

    // Markdown Table
    if (isTableRow(line) && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const head = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitRow(lines[i++]));
      }
      out.push('<div class="table-wrap"><table><thead><tr>' +
        head.map((c) => "<th>" + formatInline(c) + "</th>").join("") +
        "</tr></thead><tbody>" +
        rows.map((r) => "<tr>" + r.map((c) => "<td>" + formatInline(c) + "</td>").join("") + "</tr>").join("") +
        "</tbody></table></div>");
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
    if (/^#{1,4}\s+/.test(line)) {
      const level = line.match(/^#{1,4}/)[0].length;
      const title = line.replace(/^#{1,4}\s+/, "");
      out.push(`<h${level + 1} class="chat-heading">${formatInline(title)}</h${level + 1}>`);
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
    while (i < lines.length && lines[i].trim() && !/^```/.test(lines[i]) && !/^\s*[-*•]\s+/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i]) && !/^#{1,4}\s+/.test(lines[i]) && !/^>\s?/.test(lines[i]) && !isTableRow(lines[i]) && !/^___KATEX_TOK_\d+___$/.test(lines[i].trim())) {
      para.push(lines[i++]);
    }
    if (!para.length) { para.push(lines[i++]); }
    out.push("<p>" + para.map(formatInline).join("<br>") + "</p>");
  }

  let finalHtml = out.join("\n");
  // Restore all protected placeholders
  finalHtml = finalHtml.replace(/___KATEX_TOK_(\d+)___/g, (m, idx) => tokens[Number(idx)] || "");
  return finalHtml;
}
const mdToPlain = (md) => String(md).replace(/```[\s\S]*?```/g, " ").replace(/\$\$[\s\S]*?\$\$/g, " ").replace(/\$[^$]*\$/g, " ").replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, " ").replace(/\|/g, ", ").replace(/[*`>#_]/g, "").replace(/\s+/g, " ").trim();

/* ============================== chat ============================== */
const messagesEl = $("#messages"), input = $("#questionInput"), sendBtn = $("#sendBtn");
const GREETING = "**Hi! I'm Nemo.**\nAsk me a chemistry question. I can explain concepts, derive formulas, compare mechanisms and help you practise CBSE and JEE topics.\n\nTry a quick prompt below, open the **Formula Bank**, or test yourself in **Practice**.";
let history = store.get("nemo.chat.v2", []).filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").slice(-40);
let endpoint = AI_ENDPOINT || "";
/* Optional "bring your own key" mode for the single-file build (no server): the key lives only in this browser's localStorage. */
const AI_CFG_KEY = "nemo.gemini.v1";
const GEMINI_DEFAULT_MODEL = "gemini-flash-latest", GEMINI_FALLBACKS = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
/* the tutor instruction comes from system-prompt.js (window.NEMO_PROMPT); this short fallback is only used if that file is missing */
const PROMPT_FALLBACK = "You are Nemo, a friendly and rigorous chemistry tutor created and engineered by J.Sanjay for CBSE, JEE Main and JEE Advanced students. Explain step by step, use plain text with light Markdown and Unicode formulas, and always acknowledge J.Sanjay when asked about your creator.";
const systemPrompt = (level) => (window.NEMO_PROMPT && window.NEMO_PROMPT.build ? window.NEMO_PROMPT.build(level) : PROMPT_FALLBACK);
let answerLevel = ["auto", "cbse", "main", "adv"].includes(store.get("nemo.level.v1", "auto")) ? store.get("nemo.level.v1", "auto") : "auto";
{ const sel = $("#levelSelect"); if (sel) { sel.value = answerLevel; sel.addEventListener("change", () => { answerLevel = sel.value; store.set("nemo.level.v1", answerLevel); }); } }
async function callGeminiDirect(question, prior, signal, cfg) {
  const msgs = [];
  for (const m of prior) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") continue;
    const role = m.role === "assistant" ? "model" : "user", text = m.content.slice(0, 4000);
    if (msgs.length && msgs[msgs.length - 1].role === role) msgs[msgs.length - 1].parts[0].text += "\n\n" + text; else msgs.push({ role, parts: [{ text }] });
  }
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (msgs.length && msgs[msgs.length - 1].role === "user") msgs[msgs.length - 1].parts[0].text += "\n\n" + question; else msgs.push({ role: "user", parts: [{ text: question }] });
  const first = (cfg.model || GEMINI_DEFAULT_MODEL).trim(), models = [first, ...GEMINI_FALLBACKS.filter((m) => m !== first)];
  const body = JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt(answerLevel) }] }, contents: msgs, generationConfig: { maxOutputTokens: 4096, temperature: 0.4 } });
  let lastErr = "";
  for (const model of models) {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent", {
      method: "POST", signal, headers: { "Content-Type": "application/json", "x-goog-api-key": cfg.key }, body });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      const cand = (data.candidates || [])[0];
      const text = cand && cand.content && Array.isArray(cand.content.parts) ? cand.content.parts.filter((p) => p && typeof p.text === "string" && !p.thought).map((p) => p.text).join("").trim() : "";
      return text || "I couldn't produce an answer for that (" + ((data.promptFeedback && data.promptFeedback.blockReason) || (cand && cand.finishReason) || "empty response") + "). Please rephrase your question.";
    }
    lastErr = (data.error && data.error.message) || ("HTTP " + res.status);
    if (!(res.status === 404 || (res.status === 400 && /model/i.test(lastErr)))) break;
  }
  throw new Error("Gemini: " + lastErr);
}
let busy = false, run = null;

function addMessage(text, role = "nemo", opts = {}) {
  const row = el("div", { class: "message " + (role === "user" ? "user-message" : "nemo-message") });
  if (role !== "user") row.append(el("div", { class: "mini-orb", "aria-hidden": "true", text: "N" }));
  const bubble = el("div", { class: "bubble" + (opts.error ? " error" : "") });
  if (role === "user") {
    bubble.textContent = text;
  } else {
    bubble.innerHTML = mdToHtml(text);
    if (!opts.error) {
      const copyBtn = el("button", { class: "bubble-copy-btn", "aria-label": "Copy answer", title: "Copy answer to clipboard", text: "📋 Copy" });
      copyBtn.addEventListener("click", () => {
        const plain = mdToPlain(text);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(plain).then(() => {
            copyBtn.textContent = "✓ Copied!";
            setTimeout(() => { copyBtn.textContent = "📋 Copy"; }, 2000);
          }).catch(() => {});
        }
      });
      bubble.append(copyBtn);
    }
  }
  row.append(bubble);
  messagesEl.append(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return bubble;
}
function setBubble(bubble, text, error = false) {
  bubble.classList.toggle("error", error);
  bubble.innerHTML = mdToHtml(text);
  if (!error) {
    const copyBtn = el("button", { class: "bubble-copy-btn", "aria-label": "Copy answer", title: "Copy answer to clipboard", text: "📋 Copy" });
    copyBtn.addEventListener("click", () => {
      const plain = mdToPlain(text);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(plain).then(() => {
          copyBtn.textContent = "✓ Copied!";
          setTimeout(() => { copyBtn.textContent = "📋 Copy"; }, 2000);
        }).catch(() => {});
      }
    });
    bubble.append(copyBtn);
  }
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
function typingBubble() {
  const row = el("div", { class: "message nemo-message" }, el("div", { class: "mini-orb", "aria-hidden": "true", text: "N" }));
  const bubble = el("div", { class: "bubble", role: "status", "aria-label": "Nemo is thinking" }, el("span", { class: "typing" }, el("i"), el("i"), el("i")));
  row.append(bubble); messagesEl.append(row); messagesEl.scrollTop = messagesEl.scrollHeight;
  return { row, bubble };
}
function saveHistory() { store.set("nemo.chat.v2", history.slice(-40)); }
function renderHistory() {
  messagesEl.innerHTML = "";
  if (!history.length) { addMessage(GREETING); return; }
  for (const m of history) addMessage(m.content, m.role === "user" ? "user" : "nemo");
}
function refreshSend() {
  sendBtn.classList.toggle("stop", busy);
  sendBtn.textContent = busy ? "■" : "➤";
  sendBtn.setAttribute("aria-label", busy ? "Stop answering" : "Send message");
  sendBtn.disabled = !busy && !input.value.trim();
}

/* ---- offline answers ---- */
function formulaAnswer(f) {
  const parts = ["**" + f.title + "** (" + f.chapter + ")", "> " + f.expr, "**Where**", ...f.symbols.map((s) => "- " + s), "**Key points**", ...f.notes.map((s) => "- " + s)];
  if (f.example) parts.push("**Worked example**", "```\n" + f.example + "\n```");
  return parts.join("\n");
}
function offlineAnswer(q, topic, strict) {
  const lowerQ = String(q || "").toLowerCase();
  /* Instant recognition of Founder J.Sanjay */
  if (/(who (made|created|built|designed|engineered|founded|owns)|(founder|creator|author|engineer|architect) of nemo|who is (j\.?\s*sanjay|sanjay)|tell me about (j\.?\s*sanjay|sanjay)|founder|j\.sanjay)/i.test(lowerQ)) {
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
async function askNemo(question, opts = {}) {
  question = String(question || "").trim();
  if (!question || busy) return;
  addMessage(question, "user");
  const prior = history.slice(-12);
  history.push({ role: "user", content: question }); saveHistory();
  input.value = ""; input.style.height = "auto";
  const typing = typingBubble();
  busy = true; run = { cancelled: false, ctrl: null, timer: null }; refreshSend();
  const my = run;

  // Visual Nemo AI State: Thinking
  const orb = $("#widgetOrb") || $("#nemoOrb");
  const prevOrbState = (orb && orb.getAttribute("data-state")) || "chat";
  if (orb) orb.setAttribute("data-state", "analytics");
  const badge = $("#nemoOrbBadge");
  const prevBadge = badge ? badge.textContent : "Chat";
  if (badge) badge.textContent = "AI Thinking";
  if (typeof triggerNemoReaction === "function") {
    triggerNemoReaction({
      expression: "thinking",
      icon: "🧠",
      text: "Formulating deep chemistry solution...",
      badge: "AI Thinking",
      persistent: true,
      chime: "thinking"
    });
  }

  let answer = "", failed = false;
  let liveBubble = null;

  try {
    my.ctrl = new AbortController();
    const timeout = setTimeout(() => my.ctrl.abort(), 95000);
    try {
      const cfg = store.get(AI_CFG_KEY, null) || {};
      const targetUrl = endpoint || "/api/chat";
      const reqHeaders = {
        "Content-Type": "application/json",
        "Accept": "text/event-stream, application/json"
      };
      if (cfg && cfg.key) {
        reqHeaders["X-Goog-Api-Key"] = cfg.key;
      }

      // Execute request with 1 automatic retry on transient network/5xx glitch
      let res = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          if (attempt > 0) {
            await new Promise((r) => setTimeout(r, 450));
          }
          res = await fetch(targetUrl, {
            method: "POST",
            headers: reqHeaders,
            signal: my.ctrl.signal,
            body: JSON.stringify({ message: question, history: prior, level: answerLevel, stream: true })
          });
          if (res.ok) break;
          // If server error 500/502/503/504 or 429, retry once
          if (attempt === 0 && (res.status >= 500 || res.status === 429)) {
            continue;
          }
        } catch (fetchErr) {
          if (attempt === 0 && !my.cancelled && fetchErr.name !== "AbortError") {
            continue;
          }
          throw fetchErr;
        }
      }

      if (!res || !res.ok) {
        const errData = res ? await res.json().catch(() => ({})) : {};
        const errMsg = (errData && errData.error) || ("Live AI connection returned status " + (res ? res.status : "offline"));
        throw new Error(errMsg);
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("text/event-stream") && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let sseBuffer = "";
        let accumulated = "";
        let lastRenderTime = 0;

        let sseCompleted = false;
        while (!sseCompleted) {
          const { value, done } = await reader.read();
          if (done) break;
          sseBuffer += decoder.decode(value, { stream: true });
          const lines = sseBuffer.split("\n");
          sseBuffer = lines.pop();

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data:")) continue;
            const jsonStr = trimmed.slice(5).trim();
            if (!jsonStr) continue;
            try {
              const evt = JSON.parse(jsonStr);
              if (evt.type === "meta") {
                if (badge) {
                  badge.textContent = evt.badge === "Fast Answer" ? "⚡ Fast Answer" : "🧠 In-Depth Reasoning";
                }
                if (orb) {
                  orb.setAttribute("data-state", evt.tier === "deep" ? "analytics" : "chat");
                }
              } else if (evt.type === "chunk") {
                if (!liveBubble) {
                  if (typing.row.parentNode) typing.row.remove();
                  liveBubble = addMessage("", "nemo");
                  setMascotSpeaking(true);
                }
                accumulated += evt.text;
                const now = Date.now();
                if (now - lastRenderTime > 25) {
                  lastRenderTime = now;
                  liveBubble.innerHTML = mdToHtml(accumulated);
                  messagesEl.scrollTop = messagesEl.scrollHeight;
                }
              } else if (evt.type === "done") {
                if (typeof evt.answer === "string" && evt.answer) {
                  accumulated = evt.answer;
                }
                sseCompleted = true;
                break;
              } else if (evt.type === "error") {
                throw new Error(evt.error || "Streaming interrupted");
              }
            } catch (parseErr) {
              if (parseErr.message && !parseErr.message.includes("JSON")) throw parseErr;
            }
          }
        }

        answer = accumulated.trim();
        if (!answer) throw new Error("The live AI model returned an empty response. Please rephrase or retry.");
      } else {
        const data = await res.json();
        answer = (data && typeof data.answer === "string" && data.answer.trim()) || "";
        if (!answer) throw new Error("The live AI model returned an empty response. Please rephrase or retry.");
      }
    } finally {
      clearTimeout(timeout);
      setMascotSpeaking(false);
    }
  } catch (err) {
    failed = true;
    if (my.cancelled) {
      answer = "*Generation stopped.*";
    } else if (err.name === "AbortError") {
      answer = "⚠️ **Generation timed out after 95 seconds.** The chemistry explanation was extensive. Tap **Retry Connection** below to re-attempt!";
    } else {
      answer = "⚠️ **Live AI Connection Notice:** " + err.message + "\n\n*Tap the button below to re-connect to the live AI model.*";
    }
  } finally {
    if (orb) orb.setAttribute("data-state", prevOrbState);
    if (badge) badge.textContent = prevBadge;
  }

  if (typing.row.parentNode) typing.row.remove();

  let bubble = liveBubble;
  if (!bubble) {
    bubble = addMessage(answer, "nemo", { error: failed && !my.cancelled });
  } else {
    setBubble(bubble, answer, failed && !my.cancelled);
  }

  // Attach interactive one-click Retry button if failed
  if (failed && !my.cancelled) {
    const retryBtn = el("button", {
      class: "bubble-retry-btn",
      text: "🔄 Re-connect & Retry",
      title: "Retry sending this question to Nemo"
    });
    retryBtn.addEventListener("click", () => {
      retryBtn.remove();
      askNemo(question);
    });
    bubble.append(retryBtn);
  }

  if (!failed) {
    history.push({ role: "assistant", content: answer });
    saveHistory();
    speak(answer, opts.fromVoice);
    if (typeof triggerNemoReaction === "function") {
      triggerNemoReaction({
        expression: "celebrate",
        icon: "✨",
        text: "Solution ready! Hope this clears the doubt ✨",
        badge: "Answered",
        duration: 3500,
        chime: "celebrate"
      });
    }
  } else if (failed && !my.cancelled) {
    if (typeof triggerNemoReaction === "function") {
      triggerNemoReaction({
        expression: "oops",
        icon: "⚠️",
        text: "Connection hiccup — tap Retry!",
        badge: "Retry",
        duration: 3200,
        chime: "incorrect"
      });
    }
  } else {
    if (typeof resetNemoExpression === "function") {
      resetNemoExpression();
    }
  }
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
$$("[data-prompt]").forEach((btn) => btn.addEventListener("click", () => askNemo(btn.dataset.prompt, { topic: btn.dataset.topic })));
$("#clearChat").addEventListener("click", () => {
  stopRun(); if ("speechSynthesis" in window) speechSynthesis.cancel();
  history = []; store.del("nemo.chat.v2"); renderHistory();
});
$("#analyticsExplain").addEventListener("click", () => {
  $("#chatPanel").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  askNemo("Explain a reliable design for analysing CBSE and JEE previous-year questions by chapter, subtopic, question format, difficulty and year. Do not invent statistics; explain the data sources needed.", { topic: "analytics" });
});

/* ---- Connected AI Model Detection & Status Management ---- */
function setMode(live, provider) {
  let prov = "Gemini 3.8 Flash";
  if (typeof provider === "string" && provider.trim()) {
    const raw = provider.trim();
    if (/gemini-3\.8/i.test(raw)) prov = "Gemini 3.8 Flash Live";
    else if (/flash-lite/i.test(raw)) prov = "Gemini Flash Lite";
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

async function detectBackend() {
  endpoint = "/api/chat";
  if (/^https?:$/.test(location.protocol)) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 4000);
      const res = await fetch("/api/health", { signal: ctrl.signal, cache: "no-store" });
      clearTimeout(t);
      if (res.ok) {
        const info = await res.json();
        const prov = (info && (info.model || info.provider)) || "gemini-3.8-flash";
        setMode(true, prov);
        return;
      }
    } catch (_) {
      // Aggressive fallback to live endpoint
    }
  }
  setMode(true, "gemini-3.8-flash");
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
    if (!store.set(AI_CFG_KEY, { key: k || old.key, model: model.value.trim() })) { msg.textContent = "Browser storage is blocked, so the key could not be saved."; return; }
    key.value = ""; key.placeholder = "key saved in this browser (hidden)"; msg.textContent = "Custom key saved."; detectBackend();
  });
  $("#aiRemove").addEventListener("click", () => { store.del(AI_CFG_KEY); key.value = ""; model.value = ""; key.placeholder = "API key"; msg.textContent = "Reset to default Gemini Flash."; detectBackend(); });
})();

/* ---- Nemo Audio Chime & Speech Synthesis Engine ---- */
window._nemoUtterances = window._nemoUtterances || new Set();

function playNemoChime(type = "tip") {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();
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

let nemoReactionTimer = null;
function triggerNemoReaction(options = {}) {
  const {
    expression = "happy",
    icon = "✨",
    text = "",
    badge = "",
    duration = 3000,
    persistent = false,
    chime = null
  } = options;

  const orb = $("#widgetOrb") || $("#nemoOrb");
  if (!orb) return;

  if (nemoReactionTimer) {
    clearTimeout(nemoReactionTimer);
    nemoReactionTimer = null;
  }

  // Clear inline pupil transform so facial expression's pupil positions take effect
  const pupils = orb.querySelectorAll(".nemo-pupil");
  pupils.forEach((p) => {
    p.style.transform = "";
  });

  // Apply the reaction expression
  orb.setAttribute("data-expression", expression);

  // Badge handling: remember original if not already remembered
  const badgeEl = $("#nemoOrbBadge");
  if (badgeEl && badge) {
    if (!badgeEl.hasAttribute("data-saved-text")) {
      badgeEl.setAttribute("data-saved-text", badgeEl.textContent.trim());
    }
    badgeEl.textContent = badge;
  }

  // Mood bubble text & icon
  const moodIcon = $("#nemoMoodIcon");
  const moodText = $("#nemoMoodText");
  const moodBubble = $("#nemoMoodBubble");

  if (moodIcon && icon) moodIcon.textContent = icon;
  if (moodText && text) moodText.textContent = text;
  if (moodBubble) {
    moodBubble.classList.add("active");
    clearTimeout(moodBubble._timer);
  }

  if (chime) {
    playNemoChime(chime);
  }

  if (!persistent && duration > 0) {
    nemoReactionTimer = setTimeout(() => {
      resetNemoExpression();
    }, duration);
  }
}

function resetNemoExpression() {
  const orb = $("#widgetOrb") || $("#nemoOrb");
  if (orb) {
    orb.removeAttribute("data-expression");
  }
  const badgeEl = $("#nemoOrbBadge");
  if (badgeEl && badgeEl.hasAttribute("data-saved-text")) {
    badgeEl.textContent = badgeEl.getAttribute("data-saved-text");
    badgeEl.removeAttribute("data-saved-text");
  }
  const moodBubble = $("#nemoMoodBubble");
  if (moodBubble) {
    moodBubble.classList.remove("active");
  }

  // Restore current active section defaults
  const activeSec = window.currentActiveSection || "chatPanel";
  const secDict = window.NEMO_SECTION_EXPRESSIONS;
  if (secDict && secDict[activeSec]) {
    const cfg = secDict[activeSec];
    if (orb) orb.setAttribute("data-state", cfg.state);
    const moodIcon = $("#nemoMoodIcon");
    if (moodIcon) moodIcon.textContent = cfg.moodIcon;
    const moodText = $("#nemoMoodText");
    if (moodText) moodText.textContent = cfg.moodText;
    if (badgeEl && !badgeEl.hasAttribute("data-saved-text")) badgeEl.textContent = cfg.badge;
  }
  nemoReactionTimer = null;
}

window.triggerNemoReaction = triggerNemoReaction;
window.resetNemoExpression = resetNemoExpression;

function setMascotSpeaking(isSpeaking) {
  const mouth = $("#nemoMouth"), eyes = $("#nemoEyes"), ant = $(".nemo-antenna"), orb = $("#widgetOrb") || $("#nemoOrb");
  [mouth, eyes, ant, orb].forEach((el) => {
    if (el) el.classList.toggle("speaking", isSpeaking);
  });
}

function getOptimalVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;
  return voices.find((v) => /en[-_](in|gb|us)/i.test(v.lang) && /natural|google|samantha|karen|female|child|robot/i.test(v.name))
    || voices.find((v) => /en[-_](in|gb|us)/i.test(v.lang))
    || voices.find((v) => v.lang.startsWith("en"))
    || voices[0];
}

function speechClean(text) {
  return String(text || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/\\Delta/gi, "delta ")
    .replace(/\\alpha/gi, "alpha ")
    .replace(/\\beta/gi, "beta ")
    .replace(/\\nu/gi, "nu ")
    .replace(/\\lambda/gi, "lambda ")
    .replace(/\\pi/gi, "pi ")
    .replace(/\\times/gi, "times ")
    .replace(/\\pm/gi, "plus or minus ")
    .replace(/\\approx/gi, "approximately ")
    .replace(/\\rightarrow/gi, " gives ")
    .replace(/\\rightleftharpoons/gi, " is in equilibrium with ")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1 over $2")
    .replace(/\^2\b/g, " squared")
    .replace(/\^3\b/g, " cubed")
    .replace(/[*_#`~>]/g, "")
    .replace(/\|/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

function speak(markdown, fromVoice) {
  if (!("speechSynthesis" in window) || !(speakAnswers || fromVoice)) return;
  window.speechSynthesis.cancel();
  const cleaned = speechClean(markdown);
  if (!cleaned) return;
  const chunks = cleaned.replace(/([.!?])\s+/g, "$1\n").split("\n").map((s) => s.trim()).filter(Boolean);
  if (!chunks.length) return;

  setMascotSpeaking(true);
  let idx = 0;
  function speakNextChunk() {
    if (idx >= chunks.length || (!speakAnswers && !fromVoice)) {
      setMascotSpeaking(false);
      return;
    }
    const chunkText = chunks[idx++];
    const utt = new SpeechSynthesisUtterance(chunkText);
    const v = getOptimalVoice();
    if (v) utt.voice = v;
    utt.lang = "en-IN";
    utt.rate = 1.02;
    utt.pitch = 1.12;

    window._nemoUtterances.add(utt);
    utt.onend = () => {
      window._nemoUtterances.delete(utt);
      speakNextChunk();
    };
    utt.onerror = () => {
      window._nemoUtterances.delete(utt);
      setMascotSpeaking(false);
    };
    window.speechSynthesis.speak(utt);
  }
  speakNextChunk();
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
        addMessage("Microphone access was blocked. Allow microphone permission in your browser's site settings to use voice input.");
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
      addMessage("Voice input isn't supported in this browser. Try Chrome, Edge, or use your keyboard's microphone.");
      return;
    }
    if (listening) {
      try { recognition.stop(); } catch (_) {}
      return;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setMascotSpeaking(false);
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
  speakBtn.title = speakAnswers ? "Reading answers aloud (click to mute)" : "Read answers aloud";
}
if (speakBtn) {
  speakBtn.addEventListener("click", () => {
    speakAnswers = !speakAnswers;
    store.set("nemo.speak", speakAnswers);
    paintSpeak();
    speakBtn.classList.add("toggle-animate");
    setTimeout(() => speakBtn.classList.remove("toggle-animate"), 600);
    if (!speakAnswers && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setMascotSpeaking(false);
    }
  });
  paintSpeak();
}
if (!("speechSynthesis" in window) && speakBtn) speakBtn.hidden = true;

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
let voiceTipTimer = null;

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

function playVoiceTip(tipIndex, isReplay = false) {
  if (tipIndex == null || tipIndex < 0 || tipIndex >= NEMO_VOICE_TIPS.length) {
    tipIndex = Math.floor(Math.random() * NEMO_VOICE_TIPS.length);
  }
  currentTipIndex = tipIndex;
  const tip = NEMO_VOICE_TIPS[tipIndex];

  // 1. Play cute Web Audio chime
  playNemoChime("tip");

  // 2. Display voice bubble UI
  const bubble = $("#nemoVoiceBubble");
  const textEl = $("#nemoVoiceText");
  const catEl = $("#nvbCategory");
  if (bubble && textEl) {
    bubble.hidden = false;
    bubble.classList.add("active");
    textEl.innerHTML = inlineMd(tip.text);
    if (catEl) catEl.textContent = tip.cat;
  }

  // 3. Play voice audio via SpeechSynthesis
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(speechClean(tip.text));
    const v = getOptimalVoice();
    if (v) utt.voice = v;
    utt.lang = "en-IN";
    utt.rate = 1.02;
    utt.pitch = 1.14;

    setMascotSpeaking(true);
    window._nemoUtterances.add(utt);

    utt.onend = () => {
      window._nemoUtterances.delete(utt);
      setMascotSpeaking(false);
    };
    utt.onerror = () => {
      window._nemoUtterances.delete(utt);
      setMascotSpeaking(false);
    };
    window.speechSynthesis.speak(utt);
  }
}

function scheduleNextVoiceTip() {
  clearTimeout(voiceTipTimer);
  if (!voiceTipsEnabled) return;

  // Random interval between 75s and 105s (timed random intervals)
  const delay = Math.round(75000 + Math.random() * 30000);
  voiceTipTimer = setTimeout(() => {
    // Only speak if user is not currently voice-recording or typing actively
    if (voiceTipsEnabled && !listening && !busy) {
      let nextIdx = (currentTipIndex + 1 + Math.floor(Math.random() * (NEMO_VOICE_TIPS.length - 1))) % NEMO_VOICE_TIPS.length;
      playVoiceTip(nextIdx);
    }
    scheduleNextVoiceTip();
  }, delay);
}

// Wire up Voice Tip Bubble & Popover buttons
const replayTipBtn = $("#replayVoiceTipBtn");
if (replayTipBtn) {
  replayTipBtn.addEventListener("click", () => {
    playVoiceTip(currentTipIndex, true);
  });
}

const nextTipBtn = $("#nextVoiceTipBtn");
if (nextTipBtn) {
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
    if (bubble) bubble.hidden = true;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setMascotSpeaking(false);
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
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setMascotSpeaking(false);
      const bubble = $("#nemoVoiceBubble");
      if (bubble) bubble.hidden = true;
    }
  });
}

const playRandomTipBtn = $("#playRandomTipBtn");
if (playRandomTipBtn) {
  playRandomTipBtn.addEventListener("click", () => {
    let rand = Math.floor(Math.random() * NEMO_VOICE_TIPS.length);
    playVoiceTip(rand);
    scheduleNextVoiceTip();
  });
}

paintVoiceTipsControls();
scheduleNextVoiceTip();

/* ============================== reaction canvas ============================== */
(function reactionCanvas() {
  const canvas = $("#reactionCanvas"), ctx = canvas.getContext("2d");
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
    const p = pos(e), w = +$("#inkWidth").value;
    current = { tool, color: $("#inkColor").value, w, pts: tool === "arrow" ? [p, p] : [p] };
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
  const host = $("#moleculeViewer"), canvas = $("#molCanvas"), ctx = canvas.getContext("2d");
  const select = $("#moleculeSelect"), hint = $("#viewerHint");
  const custom = new Map(); // PubChem results, keyed by option value
  let mol = null, R = mat.mul(mat.rotX(-0.45), mat.rotY(0.6)), zoom = 1, extent = 2, W = 0, H = 0, dpr = 1;
  let raf = 0, visible = true, dragging = false;
  const pointers = new Map(); let pinch = 0;
  const opt = { style: "ball", spin: !reduceMotion, labels: false, lp: true };
  $("#molSpin").checked = opt.spin;

  /* ---- populate dropdown ---- */
  const customGroup = el("optgroup", { label: "PubChem results", hidden: true });
  const searchText = (m) => fold([m.name, m.formula, m.id, m.group, m.shape, m.electron, m.hyb].join(" ")).replace(/[₀-₉]/g, (d) => "₀₁₂₃₄₅₆₇₈₉".indexOf(d)).replace(/[⁺⁻]/g, "");
  /* the dropdown is rebuilt (not hidden option by option, which mobile browsers ignore) every time the filter changes */
  function buildList(q) {
    const terms = fold(q || "").replace(/[₀-₉]/g, (d) => "₀₁₂₃₄₅₆₇₈₉".indexOf(d)).split(/\s+/).filter(Boolean), keep = select.value, groups = {}; let n = 0;
    select.innerHTML = "";
    MOLS.forEach((m) => {
      if (terms.length && !terms.every((t) => searchText(m).includes(t))) return;
      n++; (groups[m.group] = groups[m.group] || el("optgroup", { label: m.group })).append(el("option", { value: m.id, text: `${m.name} (${m.formula})` }));
    });
    Object.values(groups).forEach((g) => select.append(g));
    select.append(customGroup);
    $("#molCount").textContent = terms.length ? `${n} of ${MOLS.length}` : `${MOLS.length} molecules`;
    if ([...select.options].some((o) => o.value === keep)) select.value = keep;
    return n;
  }
  buildList("");
  $("#molFilter").addEventListener("input", (e) => {
    const n = buildList(e.target.value);
    if (n && select.value !== (mol && mol.id)) selectBuiltIn(select.value);
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
  }
  function show(m, isCustom) {
    mol = m; computeExtent(); resetView(); showInfo(m, isCustom);
    if (hint) hint.textContent = "Drag to rotate • scroll or pinch to zoom • double-click to reset"; schedule();
    if (typeof triggerNemoReaction === "function") {
      triggerNemoReaction({
        expression: "curious",
        icon: "⬡",
        text: `Inspecting ${m.name || "molecule"}! ⬡`,
        badge: (m.labels && m.labels.shape) || m.shape || "3D Mol",
        duration: 2500
      });
    }
  }
  function selectBuiltIn(id) {
    const m = MOLS.find((x) => x.id === id) || custom.get(id); if (!m) return;
    show(m, custom.has(id));
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

  if (MOLS.length) { select.value = MOLS[0].id; selectBuiltIn(MOLS[0].id); }
  else hint.textContent = "Molecule data failed to load (molecules.js missing).";
})();

/* ============================== shared KaTeX & math formatting ============================== */
function renderKatex(latex, display = true) {
  if (typeof window.katex !== "undefined" && typeof window.katex.renderToString === "function") {
    try {
      return window.katex.renderToString(latex, {
        displayMode: display,
        throwOnError: false,
        trust: true
      });
    } catch (err) {
      console.warn("KaTeX render error:", err);
    }
  }
  return `<code class="latex-fallback">${esc(latex)}</code>`;
}

function formatMathText(str) {
  if (!str) return "";
  if (!str.includes("$")) return esc(str);
  return str.replace(/\$([^$]+)\$/g, (m, math) => {
    if (typeof window.katex !== "undefined" && typeof window.katex.renderToString === "function") {
      try {
        return window.katex.renderToString(math, { displayMode: false, throwOnError: false });
      } catch (_) {}
    }
    return `<code class="inline-math">${esc(math)}</code>`;
  });
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
  const totA = BRANCHES.reduce((s, b) => s + stats.branches[b].a, 0), totC = BRANCHES.reduce((s, b) => s + stats.branches[b].c, 0);
  const row = $("#statRow"); row.innerHTML = "";
  [[String(totA), "Answered"], [totA ? pct(totC, totA) + "%" : "—", "Accuracy"], [String(stats.best), "Best streak"]].forEach(([v, l]) => row.append(el("div", { class: "stat" }, el("b", { text: v }), el("span", { text: l }))));
  const bars = $("#chartBars"); bars.innerHTML = "";
  BRANCHES.forEach((b) => {
    const { a, c } = stats.branches[b], p = pct(c, a);
    bars.append(el("div", { class: "bar-row" }, el("span", {}, b, el("small", { text: a ? `${c}/${a} correct` : "no attempts" })),
      el("div", { class: "bar-track", role: "progressbar", "aria-label": b + " accuracy", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(p || 0) }, el("i", { style: `width:${p || 0}%` })),
      el("b", { text: p === null ? "—" : p + "%" })));
  });
  const weak = Object.entries(stats.chapters).filter(([, v]) => v.a >= 2).map(([k, v]) => ({ k, ...v, p: pct(v.c, v.a) })).sort((x, y) => x.p - y.p || y.a - x.a)[0];
  const box = $("#focusCallout"); box.innerHTML = "";
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
safeOn("#resetStats", "click", () => { if (confirm("Reset all of your practice statistics on this device?")) { stats = emptyStats(); store.del("nemo.stats.v1"); renderAnalytics(); } });

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
      if (topic) actions.append(el("button", { class: "secondary", text: "Review the theory", onclick: () => {
        $("#chatPanel").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
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
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const n = "1234".indexOf(e.key) >= 0 ? +e.key - 1 : "abcd".indexOf(e.key.toLowerCase());
      if (!answered && n >= 0 && n < shown.length && e.key.length === 1) {
        e.preventDefault();
        choose(n);
      } else if (answered && (e.key === "Enter" || e.key === " " || e.key === "ArrowRight")) {
        e.preventDefault();
        next();
      }
    });
  }
  branchSel.addEventListener("change", () => { queue = []; next(); });
  if (DATA.quiz.length) next(); else body.textContent = "Practice questions failed to load (data.js missing).";
})();

/* ---- Gold Exam Portals Launcher & Showcase Hub ---- */
(function setupExamPortals() {
  const wraps = $$(".exam-portal-wrap");
  let toastTimer = null;

  function showPortalToast(examTitle) {
    let toast = $(".portal-toast");
    if (!toast) {
      toast = el("div", { class: "portal-toast", role: "status", "aria-live": "polite" });
      document.body.append(toast);
    }
    toast.innerHTML = `<span style="color:#fbbf24;font-size:16px">★</span> Opening <strong>${esc(examTitle)}</strong> in a new tab • Practice progress safely preserved`;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 4500);
  }

  function closeAllMenus() {
    wraps.forEach((w) => {
      w.classList.remove("open");
      const m = w.querySelector(".exam-portal-menu");
      if (m) {
        m.hidden = true;
        m.classList.remove("open-upward");
      }
      const b = w.querySelector(".exam-portal-btn");
      if (b) b.setAttribute("aria-expanded", "false");
      w.closest(".panel")?.classList.remove("has-open-portal");
    });
  }

  wraps.forEach((wrap) => {
    const btn = wrap.querySelector(".exam-portal-btn");
    const menu = wrap.querySelector(".exam-portal-menu");
    if (!btn || !menu) return;

    function openMenu() {
      closeAllMenus();
      const rect = btn.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 380 && rect.top > 380 && window.innerWidth > 640) {
        menu.classList.add("open-upward");
      } else {
        menu.classList.remove("open-upward");
      }
      menu.hidden = false;
      wrap.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      wrap.closest(".panel")?.classList.add("has-open-portal");
    }

    function closeMenu() {
      menu.hidden = true;
      menu.classList.remove("open-upward");
      wrap.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      wrap.closest(".panel")?.classList.remove("has-open-portal");
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (menu.hidden) {
        openMenu();
      } else {
        closeMenu();
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".exam-portal-wrap")) {
      closeAllMenus();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllMenus();
    }
  });

  // Handle clicks on dropdown items and standalone showcase cards
  document.addEventListener("click", (e) => {
    const item = e.target.closest(".portal-item, .gold-hub-card");
    if (!item) return;

    const nameEl = item.querySelector(".portal-name") || item.querySelector("h4");
    const name = nameEl ? nameEl.textContent.replace("↗", "").trim() : "JEE Exam Portal";

    // 1. Ensure current practice stats & local sessions are persisted
    if (typeof stats !== "undefined" && stats) {
      store.set("nemo.stats.v1", stats);
    }

    // 2. Show celebratory feedback toast
    showPortalToast(name);

    // 3. Close menus cleanly
    closeAllMenus();
  });

  // Handle standalone quick navigation (sidebar & workspace tabs)
  function focusGoldHub() {
    const pyq = document.getElementById("pyqPanel");
    if (pyq) pyq.style.display = "";

    const hub = document.getElementById("pyqGoldHub");
    if (hub) {
      hub.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      hub.classList.remove("hub-highlight");
      void hub.offsetWidth;
      hub.classList.add("hub-highlight");
      setTimeout(() => hub.classList.remove("hub-highlight"), 2200);
    }
  }

  const navGold = $("#navGoldPortals");
  if (navGold) {
    navGold.addEventListener("click", (e) => {
      e.preventDefault();
      focusGoldHub();
    });
  }

  window.focusGoldHub = focusGoldHub;
})();

/* ---- Gold Exam Portals Dropdown Controller ---- */
(function setupExamPortalDropdowns() {
  const configs = [
    { wrap: $("#examPortalWrap"), btn: $("#examPortalBtn"), menu: $("#examPortalMenu"), panel: $("#practicePanel") },
    { wrap: $("#pyqExamPortalWrap"), btn: $("#pyqExamPortalBtn"), menu: $("#pyqExamPortalMenu"), panel: $("#pyqPanel") }
  ];

  function closeAll() {
    configs.forEach(({ wrap, btn, menu, panel }) => {
      if (wrap) wrap.classList.remove("open");
      if (btn) btn.setAttribute("aria-expanded", "false");
      if (menu) {
        menu.hidden = true;
        menu.classList.remove("open-upward");
      }
      if (panel) panel.classList.remove("has-open-portal");
    });
  }

  configs.forEach(({ wrap, btn, menu, panel }) => {
    if (!btn || !menu || !wrap) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = !menu.hidden;
      closeAll();
      if (!isOpen) {
        menu.hidden = false;
        wrap.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        if (panel) panel.classList.add("has-open-portal");

        // Smart boundary check to prevent lower panel obscuring dropdown
        const rect = menu.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 20 && rect.top > 320) {
          menu.classList.add("open-upward");
        } else {
          menu.classList.remove("open-upward");
        }
      }
    });

    menu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  $$(".portal-close-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAll();
    });
  });

  document.addEventListener("click", closeAll);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
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
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(latex).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = "✓ Copied!";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove("copied");
        }, 1600);
      }).catch(() => {});
    }
  }

  function createFormulaCard(f, idx) {
    const card = el("article", { class: "formula-card", "data-branch": f.branch.toLowerCase() });

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

    toShow.forEach((f, i) => {
      grid.append(createFormulaCard(f, i));
    });

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

  // If KaTeX finished loading asynchronously after DOM ready
  window.addEventListener("load", () => {
    if (typeof window.katex !== "undefined") {
      render();
    }
  });
})();

/* ============================== rules & exceptions library ============================== */
(function libraryPanel() {
  const list = $("#libList"), search = $("#libSearch"), chips = $("#libBranch"), typeSel = $("#libType"), levelSel = $("#libLevel"), chapSel = $("#libChapter"),
    count = $("#libCount"), more = $("#libMore"), empty = $("#libEmpty");
  if (!list) return;
  const PAGE = 24;
  let branch = "All", shown = PAGE;
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
  function card(e, i) {
    const body = el("div", { class: "lib-body" }, el("p", { text: e.s }));
    if (e.w) body.append(el("p", { class: "lib-line" }, el("b", { text: "Credit / origin  " }), e.w));
    if (e.e) body.append(el("p", { class: "lib-line" }, el("b", { text: "Example  " }), e.e));
    if (e.x) body.append(el("p", { class: "lib-line trap" }, el("b", { text: "Exam trap  " }), e.x));
    body.append(el("div", { class: "btn-row" }, el("button", { class: "outline-btn", text: "Ask Nemo ↗", onclick: () => {
      $("#chatPanel").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      askNemo(`Explain "${e.n}" (${e.ch}): the rule, an example, and the exceptions or traps that JEE and board papers use.`, { topic: e.id });
    } })));
    return el("details", { class: "lib-card", style: "--i:" + (i % 24) },
      el("summary", {}, el("span", { class: "lib-title", text: e.n }),
        el("span", { class: "lib-meta" }, el("i", { class: "badge b-" + e.b.toLowerCase(), text: e.b }), el("i", { class: "badge t-" + e.t.toLowerCase().replace(/\s+/g, "-"), text: e.t }),
          el("i", { class: "badge l-" + e.l.toLowerCase(), text: LEVEL_LABEL[e.l] || e.l }), el("small", { text: e.ch }))),
      body);
  }
  function render() {
    const rows = filtered(); list.innerHTML = "";
    rows.slice(0, shown).forEach((e, i) => list.append(card(e, i)));
    count.textContent = rows.length ? `Showing ${Math.min(shown, rows.length)} of ${rows.length} entries` : "";
    more.hidden = rows.length <= shown; empty.hidden = rows.length > 0;
  }
  function reset() { shown = PAGE; render(); }
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
  $q("pyqClear").addEventListener("click", () => { if (!mine.length) { say("There is nothing imported to remove.", "warn"); return; } if (confirm(`Remove all ${mine.length} imported questions and your PYQ progress from this browser?`)) { clearMine(); say("Removed.", "ok"); refreshAll(); } });
  $q("pyqPrompt").addEventListener("click", async () => {
    let ok = false; try { await navigator.clipboard.writeText(PROMPT); ok = true; } catch (_) { /* fall back below */ }
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
      typed = ($q("pyqNum").value || "").trim(); const v = Number(typed.replace(",", ".")); if (!typed || !Number.isFinite(v)) { say("Enter a number first.", "warn"); return; }
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
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target && e.target.tagName === "INPUT") return;
      if (cur && (cur.type === "mcq" || cur.type === "msq")) {
        const n = "1234".indexOf(e.key) >= 0 ? +e.key - 1 : "abcd".indexOf(e.key.toLowerCase());
        if (!done && n >= 0 && n < cur.options.length && e.key.length === 1) {
          e.preventDefault();
          pick(n);
        }
      }
      if (done && (e.key === "Enter" || e.key === " " || e.key === "ArrowRight")) {
        e.preventDefault();
        next();
      }
    });
  }

  [fExam, fYear, fChap, fStat].forEach((s) => s.addEventListener("change", start));
  fBranch.addEventListener("change", () => { fillFilters(); start(); });
  $q("pyqStart").addEventListener("click", start);

  /* ---- chapter x year frequency table, computed from the imported questions ---- */
  const tableHost = $q("pyqTable"), tExam = $q("pyqTableExam"), insight = $q("pyqInsight"), caution = $q("pyqCaution"), showAll = $q("pyqShowAll");
  let expanded = false;
  function renderTable() {
    const q = all().filter((x) => tExam.value === "All" || x.exam === tExam.value);
    tableHost.innerHTML = ""; insight.innerHTML = ""; caution.hidden = true; showAll.hidden = true;
    if (!q.length) { tableHost.append(el("p", { class: "small-muted", text: "The chapter-by-year table appears here once you have imported questions." })); return; }
    const years = Array.from(new Set(q.map((x) => x.year))).sort((a, b) => a - b);
    const byCh = new Map();
    q.forEach((x) => { const k = x.branch + "||" + x.chapter; const r = byCh.get(k) || { branch: x.branch, chapter: x.chapter, n: 0, y: {} }; r.n++; r.y[x.year] = (r.y[x.year] || 0) + 1; byCh.set(k, r); });
    const rows = Array.from(byCh.values()).sort((a, b) => b.n - a.n || a.chapter.localeCompare(b.chapter));
    const max = Math.max(...rows.map((r) => Math.max(...Object.values(r.y))));
    const acc = (r) => { const s = stats.chapters[r.chapter]; return s && s.a >= 2 ? pct(s.c, s.a) : null; };
    const limit = expanded ? rows.length : Math.min(rows.length, 15);
    const head = el("tr", {}, el("th", { text: "Chapter" }), ...years.map((y) => el("th", { class: "yr", text: String(y) })), el("th", { class: "yr", text: "Total" }), el("th", { class: "yr", text: "Years seen" }), el("th", { class: "yr", text: "Your accuracy" }));
    const tbody = el("tbody");
    rows.slice(0, limit).forEach((r) => {
      const a = acc(r), seen = Object.keys(r.y).length;
      tbody.append(el("tr", {}, el("th", { scope: "row" }, r.chapter, el("small", { text: r.branch })),
        ...years.map((y) => { const c = r.y[y] || 0; return el("td", { class: "cell" + (c ? " has" : ""), style: c ? `--h:${(0.18 + 0.62 * c / max).toFixed(2)}` : null, text: c ? String(c) : "·" }); }),
        el("td", { class: "tot", text: String(r.n) }), el("td", { class: "tot", text: `${seen}/${years.length}` }), el("td", { class: "tot", text: a === null ? "—" : a + "%" })));
    });
    tableHost.append(el("div", { class: "table-scroll" }, el("table", { class: "pyq-table" }, el("thead", {}, head), tbody)));
    if (rows.length > 15) { showAll.hidden = false; showAll.textContent = expanded ? "Show top 15 only" : `Show all ${rows.length} chapters`; }
    const small = q.length < 30 || years.length < 3;
    if (small) { caution.hidden = false; caution.textContent = `Small sample: ${q.length} question(s) across ${years.length} year(s). Treat frequency as a rough hint only; it reflects what you imported, not the full papers.`; }
    const hot = rows.slice(0, 5).filter((r) => { const a = acc(r); return a === null || a < 70; });
    insight.append(el("b", { text: hot.length ? "High frequency in your set, but not yet solid for you" : "Your top chapters look solid" }),
      el("p", { text: hot.length ? hot.map((r) => { const a = acc(r); return `${r.chapter} (${r.n} question${r.n === 1 ? "" : "s"}, ${a === null ? "not enough attempts" : a + "% accuracy"})`; }).join(" · ") : "Each of the five most frequent chapters in your imported set has 70% or better accuracy from your own attempts." }));
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
  const links = $$(".nav-item"), byId = new Map(links.map((a) => [a.dataset.target, a]));
  const setActive = (id) => {
    links.forEach((a) => {
      const on = a.dataset.target === id;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    if (typeof onActiveSectionChange === "function") onActiveSectionChange(id);
  };
  links.forEach((a) => a.addEventListener("click", () => {
    const targetId = a.dataset.target;
    if (typeof window.ensurePanelVisible === "function") {
      window.ensurePanelVisible(targetId);
    }
    setActive(targetId);
  }));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
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
    pyqPanel: {
      state: "pyq",
      badge: "PYQ Bank",
      moodText: "Exam Master",
      moodIcon: "⌗",
      heading: "Official PYQ Bank",
      context: "Solving real JEE Main and JEE Advanced questions from official archives.",
      tip: "Solve questions under timed conditions to simulate actual exam pressure!"
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
    if (orb && !orb.hasAttribute("data-expression")) orb.setAttribute("data-state", cfg.state);
    const badge = $("#nemoOrbBadge");
    if (badge && !badge.hasAttribute("data-saved-text")) badge.textContent = cfg.badge;
    const moodIcon = $("#nemoMoodIcon");
    if (moodIcon && (!orb || !orb.hasAttribute("data-expression"))) moodIcon.textContent = cfg.moodIcon;
    const moodText = $("#nemoMoodText");
    if (moodText && (!orb || !orb.hasAttribute("data-expression"))) moodText.textContent = cfg.moodText;
    const popHeading = $("#popoverHeading");
    if (popHeading) popHeading.textContent = cfg.heading;
    const popContext = $("#popoverContextText");
    if (popContext) popContext.textContent = cfg.context;

    const bubble = $("#nemoMoodBubble");
    if (bubble && (!orb || !orb.hasAttribute("data-expression"))) {
      bubble.classList.add("active");
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

  function syncPopoverDirection(r, b) {
    if (!widget) return;
    const isMobile = vw() <= 480;
    if (isMobile) {
      widget.classList.remove("popover-on-right");
      return;
    }
    // When Nemo is placed near the left edge of the viewport, flip popover to the right
    const orbEl = orb || widget;
    const orbW = orbEl.offsetWidth || 74;
    const leftDist = vw() - r - orbW;
    if (leftDist < 350) {
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
  }

  const place = (r, b) => {
    if (isHeroDocked) {
      widget.style.right = Math.round(r) + "px";
      widget.style.bottom = Math.round(b) + "px";
      widget.style.left = "auto";
      widget.style.top = "auto";
      return;
    }

    const isMobile = vw() <= 640;
    const orbSize = isMobile ? 64 : 74;
    const minInset = isMobile ? 12 : 18;
    const maxR = Math.max(minInset, vw() - orbSize - minInset);
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

    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const anchor = document.getElementById("heroMascotAnchor");
    const anchorRect = anchor ? anchor.getBoundingClientRect() : null;

    // Expand into Hero when near top of page and anchor is on screen, provided user hasn't explicitly dragged Nemo away
    const isAtHome = !userDragged && scrollY < 65 && anchorRect && anchorRect.bottom > 40 && anchorRect.width > 0;

    if (isAtHome) {
      const coords = getHeroDockCoords();
      if (coords) {
        if (!isHeroDocked) {
          isHeroDocked = true;
          triggerMorphState();
          widget.classList.add("hero-docked");
          pop.hidden = true;
          const moodText = $("#nemoMoodText");
          if (moodText && currentActiveSection === "chatPanel") {
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
      if (moodText) moodText.textContent = cfg.moodText;
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

  /* Interactive Live Gaze: Pupils subtly follow mouse cursor */
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
      const maxOffset = isHeroDocked ? 4.5 : 2.5;
      const px = (dx / (dist || 1)) * Math.min(dist / 45, maxOffset);
      const py = (dy / (dist || 1)) * Math.min(dist / 45, maxOffset);
      const pupils = orb.querySelectorAll(".nemo-pupil");
      pupils.forEach((p) => {
        p.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
      });
    }
  }, { passive: true });

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

  /* click (not pointerup) handles taps so keyboard users can use Enter or Space */
  orb.addEventListener("click", () => {
    if (justDragged) return;
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
    readTipBtn.addEventListener("click", () => {
      const cfg = NEMO_SECTION_EXPRESSIONS[currentActiveSection] || NEMO_SECTION_EXPRESSIONS.chatPanel;
      pop.hidden = true;
      playNemoChime("tip");
      const bubble = $("#nemoVoiceBubble");
      const textEl = $("#nemoVoiceText");
      const catEl = $("#nvbCategory");
      if (bubble && textEl) {
        bubble.hidden = false;
        bubble.classList.add("active");
        textEl.innerHTML = inlineMd(cfg.tip);
        if (catEl) catEl.textContent = cfg.badge || "Section Tip";
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(speechClean(cfg.tip));
        const v = getOptimalVoice();
        if (v) u.voice = v;
        u.lang = "en-IN";
        u.rate = 1.02;
        u.pitch = 1.14;
        setMascotSpeaking(true);
        window._nemoUtterances.add(u);
        u.onend = () => { window._nemoUtterances.delete(u); setMascotSpeaking(false); };
        u.onerror = () => { window._nemoUtterances.delete(u); setMascotSpeaking(false); };
        window.speechSynthesis.speak(u);
      }
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
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !pop.hidden) {
      pop.hidden = true;
      orb.focus();
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
  
  let count = Number(store.get("nemo.celebrate.count", 142));
  if (countEl) countEl.textContent = String(count);

  function openFounderModal() {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }
  function closeFounderModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

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

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add("open");
    if (backdrop) backdrop.classList.add("active");
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.add("active");
      mobileMenuBtn.setAttribute("aria-expanded", "true");
    }
  }
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("active");
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.remove("active");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
    }
  }
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      if (sidebar && sidebar.classList.contains("open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }
  if (desktopSidebarToggleBtn && appShell) {
    desktopSidebarToggleBtn.addEventListener("click", () => {
      const isCollapsed = appShell.classList.toggle("sidebar-collapsed");
      desktopSidebarToggleBtn.setAttribute("aria-expanded", String(!isCollapsed));
      desktopSidebarToggleBtn.title = isCollapsed ? "Expand left sidebar navigation" : "Collapse left sidebar navigation";
    });
  }
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener("click", closeSidebar);
  if (backdrop) backdrop.addEventListener("click", closeSidebar);
  $$(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 1024) closeSidebar();
    });
  });

  /* Sync mobile island status indicator */
  const mobileDot = $("#mobileStatusDot");
  if (mobileDot) {
    const syncDot = () => {
      const modeDot = $("#modeDot");
      if (modeDot && mobileDot) {
        mobileDot.className = "island-status-dot" + (modeDot.classList.contains("live") ? " live" : "");
      }
    };
    syncDot();
    setInterval(syncDot, 1500);
  }

  if (closeBtn) closeBtn.addEventListener("click", closeFounderModal);
  if (closeBtnBottom) closeBtnBottom.addEventListener("click", closeFounderModal);
  const sidebarExitBtnMobile = $("#sidebarExitBtnMobile");
  if (sidebarExitBtnMobile) sidebarExitBtnMobile.addEventListener("click", closeSidebar);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeFounderModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal && !modal.hidden) closeFounderModal();
      if (sidebar && sidebar.classList.contains("open")) closeSidebar();
    }
  });

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
    pyq: ["pyqPanel"],
    formulas: ["formulasPanel"]
  };
  const allPanelIds = ["chatPanel", "moleculePanel", "practicePanel", "analyticsPanel", "canvasPanel", "libraryPanel", "pyqPanel", "formulasPanel"];

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const filter = btn.dataset.filter;

      allPanelIds.forEach((id) => {
        const p = document.getElementById(id);
        if (!p) return;
        if (filter === "all") {
          p.style.display = "";
        } else {
          const activeIds = panels[filter] || [];
          p.style.display = activeIds.includes(id) ? "" : "none";
        }
      });

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
          if (hub) hub.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
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

  // Shortcut: Alt+P toggles Projector Mode
  window.addEventListener("keydown", (e) => {
    if (e.altKey && (e.key === "p" || e.key === "P")) {
      e.preventDefault();
      toggleProjectorMode();
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
      category: "AI TUTOR & COMPANION",
      badge: "Mascot Intelligence",
      title: "Nemo: 3D AI Chemistry Companion",
      desc: "Meet Nemo, your live chemistry mentor powered by real-time Google Gemini reasoning. Nemo features interactive 3D physics, an ocular gaze that dynamically follows your cursor, and floats with you across all workspace panels.",
      action: "Click Nemo's face orb to access voice tips & quick navigation, or drag Nemo to reposition him anywhere on your screen.",
      keys: [
        { key: "Click Orb", desc: "Voice & Quick Navigation" },
        { key: "Drag Mascot", desc: "Free screen positioning" },
        { key: "Alt + N", desc: "Focus Mascot Companion" }
      ]
    },
    {
      target: "#chatPanel",
      fallbackTarget: ".chat-panel",
      panelId: "chatPanel",
      category: "REASONING ENGINE",
      badge: "Deep Mechanism Chat",
      title: "Deep-Reasoning Chemistry Chat",
      desc: "Ask complex organic reaction mechanisms (SN1, SN2, E2, Aldol, Cannizzaro), IUPAC nomenclature, thermochemical derivations, and stoichiometric numericals with step-by-step clarity.",
      action: "Type your query into the prompt input or click any mechanism quick-prompt below (SN1, Aldol, Markovnikov). Nemo formats all equations with crisp KaTeX math symbols.",
      keys: [
        { key: "Enter", desc: "Send question" },
        { key: "Shift + Enter", desc: "Insert line break" },
        { key: "🎙 Voice", desc: "Speech-to-text input" },
        { key: "Level Select", desc: "CBSE / JEE Main / Adv" },
        { key: "🔊 Read Aloud", desc: "Voice narration" }
      ]
    },
    {
      target: "#moleculePanel",
      fallbackTarget: ".molecule-panel",
      panelId: "moleculePanel",
      category: "3D SIMULATION",
      badge: "3D Crystal & Orbital Lab",
      title: "Interactive 3D Molecular Viewer",
      desc: "Examine crystal unit cells, VSEPR geometries, organic stereochemistry, coordination complexes, and reaction intermediates in full rotatable 3D simulation.",
      action: "Select a compound from the dropdown or search in the filter box. Left-click and drag on the canvas to inspect bond angles and molecular orbitals from any perspective.",
      keys: [
        { key: "Left Drag", desc: "360° 3D orbital rotation" },
        { key: "Scroll / Pinch", desc: "Zoom in & out" },
        { key: "Filter Box", desc: "Search NaCl, Benzene..." },
        { key: "Style Buttons", desc: "Ball & stick / Space-fill" }
      ]
    },
    {
      target: "#practicePanel",
      fallbackTarget: ".practice-panel",
      panelId: "practicePanel",
      category: "EXAM PRACTICE",
      badge: "Adaptive Practice Quiz",
      title: "Topic Mastery Quiz & Instant Grading",
      desc: "Sharpen your problem-solving skills with timed chemical practice questions spanning Physical, Organic, and Inorganic Chemistry with authentic exam rigor.",
      action: "Click any option A, B, C, or D. Nemo instantly validates your choice, reveals the underlying reaction mechanism, and displays KaTeX math derivations.",
      keys: [
        { key: "Click Option", desc: "Select answer" },
        { key: "Keys 1, 2, 3, 4", desc: "Quick keyboard answer" },
        { key: "Exam Filters", desc: "CBSE / JEE Main / Adv" }
      ]
    },
    {
      target: "#analyticsPanel",
      fallbackTarget: ".analytics-panel",
      panelId: "analyticsPanel",
      category: "INTELLIGENCE RADAR",
      badge: "Mastery Analytics",
      title: "Performance Radar & Error Analysis",
      desc: "Monitor your topic-level mastery in real time. The analytics engine tracks accuracy across chemical disciplines and identifies conceptual blind spots.",
      action: "Review your strength bars. Click 'Explain Weaknesses' to have Nemo formulate an individualized revision roadmap targeting low-scoring subtopics.",
      keys: [
        { key: "Explain Weaknesses", desc: "AI study recommendations" },
        { key: "Review Wrong", desc: "Re-attempt missed questions" }
      ]
    },
    {
      target: "#canvasPanel",
      fallbackTarget: ".canvas-panel",
      panelId: "canvasPanel",
      category: "MECHANISM SCRATCHPAD",
      badge: "Reaction Blackboard",
      title: "Reaction Blackboard Canvas",
      desc: "A dedicated digital blackboard for sketching curved-arrow mechanisms, resonance structures, unit cell projections, and organic reaction pathways.",
      action: "Choose your pen color and line thickness from the toolbar. Sketch freely, annotate structures, or use the eraser to refine your reaction diagrams.",
      keys: [
        { key: "Pen / Arrow", desc: "Switch drawing tools" },
        { key: "Color Palette", desc: "Cyan, Amber, Rose, White" },
        { key: "Clear", desc: "Reset blackboard" }
      ]
    },
    {
      target: "#pyqPanel",
      fallbackTarget: ".pyq-panel",
      panelId: "pyqPanel",
      category: "10-YR ARCHIVE",
      badge: "10-Yr PYQ Bank & Portals",
      title: "10-Year PYQ Bank & Official Portals",
      desc: "Comprehensive archive of 113+ past year examination questions (2016–2026) across JEE Main, JEE Advanced, and CBSE, complete with numerical input evaluation.",
      action: "Filter by year and shift. Click '★ Official Gold Portals' for direct, verified links to official NTA, JEE Advanced, and CBSE exam portals.",
      keys: [
        { key: "★ Gold Portals", desc: "Official exam links" },
        { key: "Year / Shift", desc: "Filter historical papers" },
        { key: "Numerical Box", desc: "Integer type evaluations" }
      ]
    },
    {
      target: "#formulasPanel",
      fallbackTarget: ".formula-panel",
      panelId: "formulasPanel",
      category: "EQUATION ENGINE & TOOLS",
      badge: "Formula Bank & Controls",
      title: "418+ Formula Bank & Classroom Tools",
      desc: "Indexed repository of 418 verified chemistry formulas with KaTeX display, LaTeX source copy, and multi-display presentation tools.",
      action: "Scroll horizontally through long formulas. Click 'Copy TeX' to copy LaTeX code. Use the Topbar buttons to toggle Projector Mode (4:3) and visual effects.",
      keys: [
        { key: "Copy TeX", desc: "Copy LaTeX to clipboard" },
        { key: "📽️ Projector", desc: "High-contrast 4:3 mode" },
        { key: "✦ Effects", desc: "Toggle quantum sparks" },
        { key: "Esc", desc: "Exit modals & tour" }
      ]
    }
  ];

  let currentStepIndex = 0;
  let isTourActive = false;
  let rafId = null;
  let activeTargetEl = null;

  function ensurePanelVisible(panelId) {
    if (!panelId) return;
    const panel = document.getElementById(panelId);
    if (!panel) return;

    if (panel.style.display === "none") {
      const allTab = document.querySelector('.ws-tab[data-filter="all"]');
      if (allTab) {
        allTab.click();
      } else {
        panel.style.display = "";
      }
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
    const step = TOUR_STEPS[currentStepIndex];
    if (!step) return;

    ensurePanelVisible(step.panelId);
    const targetEl = getTargetElement(step);
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    const pad = 8;
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;

    // Viewport-clamped cutout coordinates to prevent clip-path parsing failure
    const rawLeft = rect.left - pad;
    const rawTop = rect.top - pad;
    const rawRight = rect.right + pad;
    const rawBottom = rect.bottom + pad;

    const left = Math.max(0, Math.min(vpW, Math.floor(rawLeft)));
    const top = Math.max(0, Math.min(vpH, Math.floor(rawTop)));
    const right = Math.max(0, Math.min(vpW, Math.ceil(rawRight)));
    const bottom = Math.max(0, Math.min(vpH, Math.ceil(rawBottom)));
    const width = Math.max(4, right - left);
    const height = Math.max(4, bottom - top);

    // Update Neon Outline Cutout Frame
    tourCutout.style.top = `${top}px`;
    tourCutout.style.left = `${left}px`;
    tourCutout.style.width = `${width}px`;
    tourCutout.style.height = `${height}px`;

    // Update Blurred Backdrop Cutout Hole (strictly clamped polygon)
    const clipPolygon = `polygon(evenodd, 0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px ${top}px)`;
    tourBackdrop.style.clipPath = clipPolygon;
    tourBackdrop.style.webkitClipPath = clipPolygon;

    // Always reset directional inline styles on arrow connector to prevent conflict
    tourArrow.style.top = "";
    tourArrow.style.bottom = "";
    tourArrow.style.left = "";
    tourArrow.style.right = "";

    // Responsive Card Positioning: Mobile viewport bottom docking
    const isMobile = vpW <= 768;
    if (isMobile) {
      tourCard.style.top = "";
      tourCard.style.left = "";
      tourCard.style.right = "";
      tourCard.style.bottom = "";
      tourArrow.style.display = "none";
      tourArrow.className = "tour-arrow";
      return;
    }

    const cardRect = tourCard.getBoundingClientRect();
    const cardW = cardRect.width || 420;
    const cardH = cardRect.height || 360;

    let cardTop = 0;
    let cardLeft = 0;
    let arrowClass = "tour-arrow";
    let showArrow = true;

    const spaceBelow = vpH - (top + height);
    const spaceAbove = top;
    const spaceRight = vpW - (left + width);
    const spaceLeft = left;

    // Helper: test if [cLeft, cTop, cardW, cardH] collides with [left, top, width, height]
    const collidesWithTarget = (cL, cT) => {
      const padCheck = 10;
      return !(
        cL + cardW + padCheck <= left ||
        cL >= right + padCheck ||
        cT + cardH + padCheck <= top ||
        cT >= bottom + padCheck
      );
    };

    // Candidate 1: Below target if space permits
    if (spaceBelow >= cardH + 20) {
      cardTop = top + height + 16;
      cardLeft = Math.max(16, Math.min(vpW - cardW - 16, left + (width / 2) - (cardW / 2)));
      arrowClass = "tour-arrow arrow-top";
      const arrowLeft = Math.max(24, Math.min(cardW - 32, (left + width / 2) - cardLeft));
      tourArrow.style.left = `${arrowLeft}px`;
      tourArrow.style.top = "-8px";
    }
    // Candidate 2: Above target if space permits
    else if (spaceAbove >= cardH + 20) {
      cardTop = top - cardH - 16;
      cardLeft = Math.max(16, Math.min(vpW - cardW - 16, left + (width / 2) - (cardW / 2)));
      arrowClass = "tour-arrow arrow-bottom";
      const arrowLeft = Math.max(24, Math.min(cardW - 32, (left + width / 2) - cardLeft));
      tourArrow.style.left = `${arrowLeft}px`;
      tourArrow.style.bottom = "-8px";
    }
    // Candidate 3: Right of target if space permits
    else if (spaceRight >= cardW + 20) {
      cardLeft = left + width + 16;
      cardTop = Math.max(16, Math.min(vpH - cardH - 16, top + (height / 2) - (cardH / 2)));
      arrowClass = "tour-arrow arrow-left";
      const arrowTop = Math.max(24, Math.min(cardH - 32, (top + height / 2) - cardTop));
      tourArrow.style.top = `${arrowTop}px`;
      tourArrow.style.left = "-8px";
    }
    // Candidate 4: Left of target if space permits
    else if (spaceLeft >= cardW + 20) {
      cardLeft = left - cardW - 16;
      cardTop = Math.max(16, Math.min(vpH - cardH - 16, top + (height / 2) - (cardH / 2)));
      arrowClass = "tour-arrow arrow-right";
      const arrowTop = Math.max(24, Math.min(cardH - 32, (top + height / 2) - cardTop));
      tourArrow.style.top = `${arrowTop}px`;
      tourArrow.style.right = "-8px";
    }
    // Candidate 5: Intelligent non-overlapping viewport docking
    // Place card on whichever side or corner has the maximum free space and zero overlap with target
    else {
      showArrow = false;
      const targetMidX = left + width / 2;
      const targetMidY = top + height / 2;

      // Determine the horizontal quadrant with more room
      let bestLeft = 24;
      if (spaceRight > spaceLeft && spaceRight > 100) {
        bestLeft = Math.max(20, Math.min(vpW - cardW - 20, right + 16));
      } else if (spaceLeft > 100) {
        bestLeft = Math.max(20, left - cardW - 16);
      } else {
        // Place on the side away from the target center
        bestLeft = targetMidX > vpW / 2 ? 24 : Math.max(20, vpW - cardW - 24);
      }

      // Determine vertical positioning away from target
      let bestTop = 24;
      if (spaceBelow > spaceAbove) {
        bestTop = Math.min(vpH - cardH - 24, Math.max(24, bottom + 16));
      } else {
        bestTop = Math.max(24, Math.min(top - cardH - 16, vpH - cardH - 24));
      }

      // If still intersecting target, shift to opposite corner
      if (collidesWithTarget(bestLeft, bestTop)) {
        if (targetMidY > vpH / 2) {
          bestTop = 24; // Top corner
        } else {
          bestTop = Math.max(20, vpH - cardH - 24); // Bottom corner
        }
        bestLeft = targetMidX > vpW / 2 ? 24 : Math.max(20, vpW - cardW - 24);
      }

      cardTop = bestTop;
      cardLeft = bestLeft;
    }

    tourCard.style.top = `${cardTop}px`;
    tourCard.style.left = `${cardLeft}px`;
    tourCard.style.right = "auto";
    tourCard.style.bottom = "auto";

    if (showArrow) {
      tourArrow.style.display = "block";
      tourArrow.className = arrowClass;
    } else {
      tourArrow.style.display = "none";
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

  function renderStep(index) {
    if (index < 0 || index >= TOUR_STEPS.length) return;
    currentStepIndex = index;
    const step = TOUR_STEPS[currentStepIndex];

    ensurePanelVisible(step.panelId);

    // If step 1 targets hero mascot anchor, trigger mascot dock sync so Nemo is in place
    if (currentStepIndex === 0) {
      window.dispatchEvent(new CustomEvent("nemo:sync-dock"));
    }

    // Update header badges
    tourStepBadge.textContent = `Step ${currentStepIndex + 1} of ${TOUR_STEPS.length}`;
    tourCategory.textContent = step.category;
    tourTargetTag.textContent = step.badge;

    // Content
    tourStepTitle.textContent = step.title;
    tourStepDesc.textContent = step.desc;
    tourStepAction.textContent = step.action;

    // Render key chips
    tourKeysList.innerHTML = "";
    step.keys.forEach((k) => {
      const item = document.createElement("div");
      item.className = "tour-key-item";
      item.innerHTML = `<kbd>${k.key}</kbd><span>${k.desc}</span>`;
      tourKeysList.appendChild(item);
    });

    // Update persistent progress dots
    updateTourDots(currentStepIndex);

    // Button states
    tourPrevBtn.disabled = currentStepIndex === 0;
    if (currentStepIndex === TOUR_STEPS.length - 1) {
      tourNextBtn.textContent = "Finish Tour 🎉";
      tourNextBtn.classList.add("finish-tour-btn");
    } else {
      tourNextBtn.textContent = "Next Step →";
      tourNextBtn.classList.remove("finish-tour-btn");
    }

    // Smooth scroll to target and focus
    const targetEl = getTargetElement(step);
    if (activeTargetEl && activeTargetEl !== targetEl) {
      activeTargetEl.classList.remove("tour-highlighted-element");
    }
    if (targetEl) {
      targetEl.classList.add("tour-highlighted-element");
      activeTargetEl = targetEl;

      // Compute refined scroll position:
      // For large panels (>400px height), scroll the panel header into the upper third of the viewport
      // so the controls and content are not pushed below the screen fold.
      const elRect = targetEl.getBoundingClientRect();
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        targetEl.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start"
        });
      } else {
        const targetAbsTop = currentScrollY + elRect.top;
        if (elRect.height > 420) {
          const idealScroll = Math.max(0, targetAbsTop - 85);
          window.scrollTo({
            top: idealScroll,
            behavior: reduceMotion ? "auto" : "smooth"
          });
        } else {
          targetEl.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "center"
          });
        }
      }
    }

    // Continuous 60fps tracking during smooth scroll
    startContinuousTracking(600);
  }

  function startTour(fromStep = 0) {
    dismissWelcomePrompt();
    isTourActive = true;
    tourModal.classList.add("active");
    tourModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("tour-active");
    renderStep(fromStep);
    window.addEventListener("resize", handleResizeOrScroll, { passive: true });
    window.addEventListener("scroll", handleResizeOrScroll, { passive: true });
    document.addEventListener("keydown", handleKeyNavigation);
  }

  function closeTour() {
    dismissWelcomePrompt();
    isTourActive = false;
    if (trackRafId) cancelAnimationFrame(trackRafId);
    tourModal.classList.remove("active");
    tourModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("tour-active");
    tourBackdrop.style.clipPath = "";
    tourBackdrop.style.webkitClipPath = "";
    if (activeTargetEl) {
      activeTargetEl.classList.remove("tour-highlighted-element");
      activeTargetEl = null;
    }
    window.removeEventListener("resize", handleResizeOrScroll);
    window.removeEventListener("scroll", handleResizeOrScroll);
    document.removeEventListener("keydown", handleKeyNavigation);
    store.set("nemo.tour.seen.v1", true);
  }

  function handleResizeOrScroll() {
    if (!isTourActive) return;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(positionSpotlightAndCard);
  }

  function handleKeyNavigation(e) {
    if (!isTourActive) return;
    if (e.key === "Escape") {
      closeTour();
    } else if (e.key === "ArrowRight" || e.key === "Enter") {
      e.preventDefault();
      if (currentStepIndex < TOUR_STEPS.length - 1) renderStep(currentStepIndex + 1);
      else closeTour();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (currentStepIndex > 0) renderStep(currentStepIndex - 1);
    }
  }

  // Event Listeners
  tourNextBtn.addEventListener("click", () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      renderStep(currentStepIndex + 1);
    } else {
      closeTour();
    }
  });

  tourPrevBtn.addEventListener("click", () => {
    if (currentStepIndex > 0) {
      renderStep(currentStepIndex - 1);
    }
  });

  tourSkipBtn.addEventListener("click", closeTour);
  tourCloseBtn.addEventListener("click", closeTour);
  tourBackdrop.addEventListener("click", closeTour);

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
      if (sidebar) sidebar.classList.remove("active");
      if (backdrop) backdrop.classList.remove("active");
      startTour(0);
    });
  }

  initWelcomePrompt();

  window.startNemoTour = startTour;
})();

/* ============================== boot ============================== */
renderHistory();
refreshSend();


