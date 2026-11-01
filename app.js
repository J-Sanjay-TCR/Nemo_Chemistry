/* Nemo — AI Chemistry Tutor (front-end).
   Works fully offline in "study mode". Open via http(s) with server.js (or set AI_ENDPOINT) for live AI answers.
   Never put a secret API key in this file. */
"use strict";

const AI_ENDPOINT = ""; // e.g. "https://your-server.example/api/chat". Leave empty to auto-detect /api/chat from server.js.

/* ============================== helpers ============================== */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
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

/* ============================== safe mini-markdown ============================== */
/* Everything is HTML-escaped first; only a fixed set of tags is ever produced. */
function inlineMd(s) {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
  return s;
}
function mdToHtml(src) {
  const lines = String(src).replace(/\r/g, "").split("\n");
  const out = [];
  const isTableSep = (l) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(l) && l.includes("-");
  const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
  const splitRow = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
  const special = (l) => /^```/.test(l) || /^\s*[-*•]\s+/.test(l) || /^\s*\d+[.)]\s+/.test(l) || /^#{1,4}\s+/.test(l) || /^>\s?/.test(l) || (isTableRow(l));
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (/^```/.test(line)) {
      const code = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++; out.push("<pre><code>" + esc(code.join("\n")) + "</code></pre>"); continue;
    }
    if (isTableRow(line) && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const head = splitRow(line); i += 2; const rows = [];
      while (i < lines.length && isTableRow(lines[i])) rows.push(splitRow(lines[i++]));
      out.push('<div class="table-wrap"><table><thead><tr>' + head.map((c) => "<th>" + inlineMd(c) + "</th>").join("") + "</tr></thead><tbody>" +
        rows.map((r) => "<tr>" + r.map((c) => "<td>" + inlineMd(c) + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>");
      continue;
    }
    if (/^\s*[-*•]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*•]\s+/, ""));
      out.push("<ul>" + items.map((t) => "<li>" + inlineMd(t) + "</li>").join("") + "</ul>"); continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ""));
      out.push("<ol>" + items.map((t) => "<li>" + inlineMd(t) + "</li>").join("") + "</ol>"); continue;
    }
    if (/^#{1,4}\s+/.test(line)) { out.push("<p><strong>" + inlineMd(line.replace(/^#{1,4}\s+/, "")) + "</strong></p>"); i++; continue; }
    if (/^>\s?/.test(line)) { out.push('<span class="formula-line">' + inlineMd(line.replace(/^>\s?/, "")) + "</span>"); i++; continue; }
    const para = [];
    while (i < lines.length && lines[i].trim() && !special(lines[i])) para.push(lines[i++]);
    if (!para.length) { para.push(lines[i++]); }
    out.push("<p>" + para.map(inlineMd).join("<br>") + "</p>");
  }
  return out.join("");
}
const mdToPlain = (md) => String(md).replace(/```[\s\S]*?```/g, " ").replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, " ").replace(/\|/g, ", ").replace(/[*`>#_]/g, "").replace(/\s+/g, " ").trim();

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
  return "I'm in **offline study mode**, so I can answer these built-in topics:\n" +
    DATA.topics.map((t) => "- " + t.title).join("\n") +
    "\n- Any of the " + DATA.formulas.length + " formulas in the **Formula Bank**\n- Any of the " + LIB.length + " rules, exceptions and name reactions in the **Rules & Exceptions Library** (try a name such as \"Hofmann bromamide\" or \"Bredt's rule\")\n\n" +
    "For open-ended questions Nemo needs a connected AI model. Run `node server.js` with your API key (see README) and reload. Until then, try the **Practice** panel or ask one of the topics above.";
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
  let answer = "", failed = false;
  try {
    if (!endpoint) {
      await new Promise((res) => { my.timer = setTimeout(res, 350); my.wake = res; });
      if (my.cancelled) throw new DOMException("cancelled", "AbortError");
      answer = offlineAnswer(question, opts.topic);
    } else if (endpoint === "direct") {
      my.ctrl = new AbortController();
      const timeout = setTimeout(() => my.ctrl.abort(), 85000);
      try { answer = await callGeminiDirect(question, prior, my.ctrl.signal, store.get(AI_CFG_KEY, {}) || {}); } finally { clearTimeout(timeout); }
    } else {
      my.ctrl = new AbortController();
      const timeout = setTimeout(() => my.ctrl.abort(), 85000);
      try {
        const res = await fetch(endpoint, {
          method: "POST", headers: { "Content-Type": "application/json" }, signal: my.ctrl.signal,
          body: JSON.stringify({ message: question, history: prior, level: answerLevel })
        });
        if (!res.ok) throw new Error("AI service returned " + res.status);
        const data = await res.json();
        answer = (data && typeof data.answer === "string" && data.answer.trim()) || "";
        if (!answer) throw new Error("The AI service returned no answer");
      } finally { clearTimeout(timeout); }
    }
  } catch (err) {
    failed = true;
    if (my.cancelled) answer = "*Stopped.*";
    else if (err.name === "AbortError") answer = "That took longer than 85 seconds, so I stopped waiting. Please ask a more focused sub-question (e.g., break down the mechanism or numerical derivation)!";
    else answer = "I couldn't reach the AI service. Check your connection and backend configuration. (" + err.message + ")";
    if (!my.cancelled) { const fb = offlineAnswer(question, opts.topic, true); if (fb) answer += "\n\n**Meanwhile, from the built-in notes:**\n\n" + fb; }
  }
  typing.row.remove();
  const bubble = addMessage(answer, "nemo", { error: failed && !my.cancelled });
  if (!failed) { history.push({ role: "assistant", content: answer }); saveHistory(); speak(answer, opts.fromVoice); }
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

/* ---- auto-detect the optional backend (server.js) ---- */
function setMode(live, provider) {
  $("#modeLabel").textContent = live ? "Nemo AI connected" + (provider ? " (" + provider[0].toUpperCase() + provider.slice(1) + ")" : "") : "Offline study mode";
  $("#modeDot").classList.toggle("live", live);
}
const directReady = () => { const c = store.get(AI_CFG_KEY, null); return Boolean(c && typeof c.key === "string" && c.key.length > 10); };
async function detectBackend() {
  if (endpoint && endpoint !== "direct") { setMode(true); return; }
  endpoint = "";
  if (/^https?:$/.test(location.protocol)) {
   try {
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch("/api/health", { signal: ctrl.signal, cache: "no-store" }); clearTimeout(t);
    const info = res.ok ? await res.json() : null;
    if (info && info.ai === true) { endpoint = "/api/chat"; setMode(true, typeof info.provider === "string" ? info.provider : ""); return; }
   } catch (_) { /* no backend: try the user's own key, else stay offline */ }
  }
  if (directReady()) { endpoint = "direct"; setMode(true, "gemini · your key"); } else setMode(false);
}
detectBackend();
(function aiSettings() {
  const box = $("#aiSettings"); if (!box) return;
  const key = $("#aiKey"), model = $("#aiModel"), msg = $("#aiMsg");
  const cfg = store.get(AI_CFG_KEY, null); if (cfg) { model.value = cfg.model || ""; key.placeholder = "key saved in this browser (hidden)"; }
  $("#aiSave").addEventListener("click", () => {
    const k = key.value.trim(); const old = store.get(AI_CFG_KEY, null);
    if (!k && !(old && old.key)) { msg.textContent = "Paste a Gemini API key first."; return; }
    if (k && !/^[\w-]{20,}$/.test(k)) { msg.textContent = "That does not look like an API key."; return; }
    if (!store.set(AI_CFG_KEY, { key: k || old.key, model: model.value.trim() })) { msg.textContent = "Browser storage is blocked, so the key could not be saved."; return; }
    key.value = ""; key.placeholder = "key saved in this browser (hidden)"; msg.textContent = "Saved. Used only when no server backend is available."; detectBackend();
  });
  $("#aiRemove").addEventListener("click", () => { store.del(AI_CFG_KEY); key.value = ""; model.value = ""; key.placeholder = "Gemini API key"; msg.textContent = "Key removed from this browser."; detectBackend(); });
})();

/* ---- voice ---- */
let recognition = null, listening = false, speakAnswers = store.get("nemo.speak", false) === true;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const voiceBtn = $("#voiceBtn"), speakBtn = $("#speakToggle");
if (SR) {
  recognition = new SR(); recognition.lang = "en-IN"; recognition.interimResults = false; recognition.maxAlternatives = 1;
  recognition.addEventListener("start", () => { listening = true; voiceBtn.classList.add("recording"); voiceBtn.setAttribute("aria-label", "Stop voice input"); });
  const done = () => { listening = false; voiceBtn.classList.remove("recording"); voiceBtn.setAttribute("aria-label", "Start voice input"); };
  recognition.addEventListener("end", done);
  recognition.addEventListener("error", (e) => {
    done();
    if (e.error === "not-allowed" || e.error === "service-not-allowed") addMessage("Microphone access was blocked. Allow it in your browser's site settings to use voice input.");
  });
  recognition.addEventListener("result", (e) => {
    const t = e.results[0] && e.results[0][0] ? e.results[0][0].transcript : "";
    if (t) { input.value = t; askNemo(t, { fromVoice: true }); }
  });
}
voiceBtn.addEventListener("click", () => {
  if (!recognition) { addMessage("Voice input isn't supported in this browser. Try Chrome or Edge, or use your keyboard's microphone."); return; }
  if (listening) { recognition.stop(); return; }
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  try { recognition.start(); } catch (_) { /* already starting */ }
});
function paintSpeak() {
  speakBtn.textContent = speakAnswers ? "🔊" : "🔇";
  speakBtn.setAttribute("aria-pressed", String(speakAnswers));
  speakBtn.title = speakAnswers ? "Reading answers aloud (click to mute)" : "Read answers aloud";
}
speakBtn.addEventListener("click", () => {
  speakAnswers = !speakAnswers; store.set("nemo.speak", speakAnswers); paintSpeak();
  if (!speakAnswers && "speechSynthesis" in window) speechSynthesis.cancel();
});
paintSpeak();
if (!("speechSynthesis" in window)) speakBtn.hidden = true;
function speak(markdown, fromVoice) {
  if (!("speechSynthesis" in window) || !(speakAnswers || fromVoice)) return;
  speechSynthesis.cancel();
  const chunks = mdToPlain(markdown).replace(/([.!?])\s+/g, "$1\n").split("\n").map((s) => s.trim()).filter(Boolean);
  let acc = "";
  const flush = () => { if (acc) { const u = new SpeechSynthesisUtterance(acc); u.lang = "en-IN"; speechSynthesis.speak(u); acc = ""; } };
  for (const c of chunks) { if ((acc + " " + c).length > 220) flush(); acc += (acc ? " " : "") + c; }
  flush();
}

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
  };
  canvas.addEventListener("pointerup", finish);
  canvas.addEventListener("pointercancel", () => { current = null; redraw(); });

  function setTool(t) {
    tool = t;
    for (const [id, name] of [["#toolPen", "pen"], ["#toolArrow", "arrow"], ["#toolEraser", "eraser"]]) {
      const b = $(id); b.classList.toggle("active", name === t); b.setAttribute("aria-pressed", String(name === t));
    }
    canvas.style.cursor = t === "eraser" ? "cell" : "crosshair";
  }
  $("#toolPen").addEventListener("click", () => setTool("pen"));
  $("#toolArrow").addEventListener("click", () => setTool("arrow"));
  $("#toolEraser").addEventListener("click", () => setTool("eraser"));
  $("#undoStroke").addEventListener("click", () => {
    if (strokes.length) strokes.pop(); else if (cleared) { strokes = cleared; cleared = null; }
    redraw(); persist();
  });
  $("#clearCanvas").addEventListener("click", () => { if (!strokes.length) return; cleared = strokes; strokes = []; redraw(); persist(); });
  $("#saveCanvas").addEventListener("click", () => {
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
  $("#molReset").addEventListener("click", resetView);
  $("#molStyle").addEventListener("change", (e) => { opt.style = e.target.value; computeExtent(); schedule(); });
  $("#molSpin").addEventListener("change", (e) => { opt.spin = e.target.checked; schedule(); });
  $("#molLabels").addEventListener("change", (e) => { opt.labels = e.target.checked; schedule(); });
  $("#molLP").addEventListener("change", (e) => { opt.lp = e.target.checked; schedule(); });

  /* ---- info panel & legend ---- */
  function showInfo(m, custom) {
    const dl = $("#moleculeInfo"); dl.innerHTML = "";
    dl.append(el("dd", { class: "big", text: `${m.name} · ${m.formula}` }));
    const rows = custom ? [["Source", m.source], ["Atoms", String(m.atoms.length)]] :
      [[(m.labels || {}).shape || "Shape", m.shape], [(m.labels || {}).electron || "Electron geometry", m.electron], [(m.labels || {}).hyb || "Hybridisation", m.hyb], [(m.labels || {}).angle || "Bond angle", m.angle], [(m.labels || {}).polar || "Polarity", m.polar]];
    rows.forEach(([k, v]) => { dl.append(el("dt", { text: k }), el("dd", { text: v })); });
    if (m.note) dl.append(el("dd", { class: "note", text: m.note }));
    else if (custom) dl.append(el("dd", { class: "note", text: "Geometry is a computed 3D conformer from PubChem, shown for visualisation only. Check stereochemistry against a textbook." }));
    const legend = $("#viewerLegend"); legend.innerHTML = "";
    [...new Set(m.atoms.map((a) => a[0]))].forEach((s) => legend.append(el("span", {}, el("i", { style: "background:" + elInfo(s).c }), elInfo(s).n)));
    if ((m.lonePairs || []).length) legend.append(el("span", {}, el("i", { style: "background:#a66bff" }), "Lone pair"));
    $("#lpWrap").hidden = !(m.lonePairs || []).length;
  }
  function show(m, isCustom) {
    mol = m; computeExtent(); resetView(); showInfo(m, isCustom);
    hint.textContent = "Drag to rotate • scroll or pinch to zoom • double-click to reset"; schedule();
  }
  function selectBuiltIn(id) {
    const m = MOLS.find((x) => x.id === id) || custom.get(id); if (!m) return;
    show(m, custom.has(id));
  }
  select.addEventListener("change", () => selectBuiltIn(select.value));

  /* ---- optional PubChem search (needs internet) ---- */
  let pcCtrl = null;
  $("#pubchemForm").addEventListener("submit", async (e) => {
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
$("#resetStats").addEventListener("click", () => { if (confirm("Reset all of your practice statistics on this device?")) { stats = emptyStats(); store.del("nemo.stats.v1"); renderAnalytics(); } });

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
  }
  body.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const n = "1234".indexOf(e.key) >= 0 ? +e.key - 1 : "abcd".indexOf(e.key.toLowerCase());
    if (!answered && n >= 0 && n < shown.length && e.key.length === 1) { e.preventDefault(); choose(n); }
  });
  branchSel.addEventListener("change", () => { queue = []; next(); });
  if (DATA.quiz.length) next(); else body.textContent = "Practice questions failed to load (data.js missing).";
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
  links.forEach((a) => a.addEventListener("click", () => setActive(a.dataset.target)));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: "-30% 0px -60% 0px" });
  byId.forEach((_, id) => { const p = document.getElementById(id); if (p) io.observe(p); });
})();

/* ============================== floating 3D Nemo Companion ============================== */
(function floatingNemo() {
  const widget = $("#nemoWidget"), orb = $("#widgetOrb"), pop = $("#widgetPopover"), toggle = $("#floatToggle");
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
  function updateNemoView(sectionId) {
    if (!sectionId || !NEMO_SECTION_EXPRESSIONS[sectionId]) sectionId = "chatPanel";
    currentActiveSection = sectionId;
    const cfg = NEMO_SECTION_EXPRESSIONS[sectionId];
    if (orb) orb.setAttribute("data-state", cfg.state);
    const badge = $("#nemoOrbBadge");
    if (badge) badge.textContent = cfg.badge;
    const moodIcon = $("#nemoMoodIcon");
    if (moodIcon) moodIcon.textContent = cfg.moodIcon;
    const moodText = $("#nemoMoodText");
    if (moodText) moodText.textContent = cfg.moodText;
    const popHeading = $("#popoverHeading");
    if (popHeading) popHeading.textContent = cfg.heading;
    const popContext = $("#popoverContextText");
    if (popContext) popContext.textContent = cfg.context;

    const bubble = $("#nemoMoodBubble");
    if (bubble) {
      bubble.classList.add("active");
      clearTimeout(bubble._timer);
      bubble._timer = setTimeout(() => bubble.classList.remove("active"), 3200);
    }
  }

  onActiveSectionChange = updateNemoView;

  const vw = () => document.documentElement.clientWidth, vh = () => document.documentElement.clientHeight;
  const place = (r, b) => {
    const maxR = Math.max(0, vw() - widget.offsetWidth), maxB = Math.max(0, vh() - widget.offsetHeight);
    widget.style.right = clamp(r, 0, maxR) + "px";
    widget.style.bottom = clamp(b, 0, maxB) + "px";
    widget.style.left = "auto";
    widget.style.top = "auto";
  };
  const current = () => {
    const rc = widget.getBoundingClientRect();
    return { r: vw() - rc.right, b: vh() - rc.bottom };
  };
  if (typeof saved.right === "number" && typeof saved.bottom === "number") place(saved.right, saved.bottom);
  const keepInView = () => { const c = current(); place(c.r, c.b); };
  addEventListener("resize", keepInView);
  const save = () => {
    const c = current();
    store.set("nemo.widget.v1", { right: c.r, bottom: c.b, compact: widget.classList.contains("compact") });
  };

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
    if (!moved && Math.abs(dx) + Math.abs(dy) > 5) moved = true;
    if (moved) place(drag.r - dx, drag.b - dy);
  });
  const end = (e) => {
    if (!drag) return;
    drag = null;
    try { orb.releasePointerCapture(e.pointerId); } catch (_) {}
    if (moved) {
      justDragged = true;
      setTimeout(() => { justDragged = false; }, 40);
      save();
    }
  };
  orb.addEventListener("pointerup", end);
  orb.addEventListener("pointercancel", end);

  /* click (not pointerup) handles taps so keyboard users can use Enter or Space */
  orb.addEventListener("click", () => {
    if (justDragged) return;
    if (widget.classList.contains("compact")) {
      widget.classList.remove("compact");
      pop.hidden = false;
    } else {
      pop.hidden = !pop.hidden;
    }
    keepInView();
    save();
  });

  $("#closePopover").addEventListener("click", () => { pop.hidden = true; save(); });
  $("#minimizeWidget").addEventListener("click", () => {
    widget.classList.add("compact");
    pop.hidden = true;
    save();
  });
  $("#jumpToChat").addEventListener("click", () => {
    pop.hidden = true;
    $("#chatPanel").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    input.focus({ preventScroll: true });
    updateNemoView("chatPanel");
  });

  $$(".qn-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
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
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(cfg.tip);
      u.rate = 1.05;
      u.pitch = 1.15;
      window.speechSynthesis.speak(u);
    });
  }

  toggle.addEventListener("click", () => {
    const hide = !widget.classList.contains("hidden");
    widget.classList.toggle("hidden", hide);
    toggle.setAttribute("aria-pressed", String(!hide));
  });
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

  const founderTriggers = ["#founderNavBtn", "#openFounderHeroBtn", "#openFounderTopBtn"];
  founderTriggers.forEach((sel) => {
    const btn = $(sel);
    if (btn) btn.addEventListener("click", openFounderModal);
  });

  if (closeBtn) closeBtn.addEventListener("click", closeFounderModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeFounderModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) {
      closeFounderModal();
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
  const panels = {
    tutor: ["chatPanel", "moleculePanel"],
    practice: ["practicePanel", "analyticsPanel"],
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

      const targetId = filter === "all" ? "chatPanel" : (panels[filter] && panels[filter][0]) || "chatPanel";
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });
})();

/* ============================== boot ============================== */
renderHistory();
refreshSend();
