# Using Nemo with Google AI Studio (Build mode)

Nemo is a **dependency-free vanilla JavaScript app** plus a tiny Node server (`server.js`, no npm packages).
That matches AI Studio Build's runtime (a browser front end plus a server-side Node.js container), and the Gemini key stays on the server.

> **What I could and could not test.** Tested here: the server against a mock Gemini endpoint (key header, role mapping, model fallback, error paths), the whole front end in headless Chromium, the single-file build, and the optional own-key mode against a mocked endpoint.
> **Not tested:** the actual AI Studio import and preview (no access to it from my sandbox) and live calls to Google's servers. If something fails there, use the "fix" prompt below and paste the exact error.

---

## Route A: import from GitHub (recommended)

1. Create a GitHub repository and upload **the contents of this folder** (the repo root must contain `package.json`, `server.js`, `index.html`).
   `.gitignore` already keeps `.env` out. Never commit a key.
2. In AI Studio open **Build**, click the **+** (Add files) menu in the prompt box and choose **Import from GitHub**, then pick the repo.
3. `GEMINI_API_KEY` is provided to the app's server-side environment by AI Studio (check the **Secrets** panel). Nothing to paste into code.
4. Run the preview. The sidebar should say **"Nemo AI connected (Gemini)"**. If it says "Offline study mode", the app still works (Library, PYQ bank, formulas, molecules, practice); only AI chat is off.
5. Deploy from AI Studio (Cloud Run) or sync back to GitHub from **Settings > GitHub**.

### Prompt A1 — first message after import (keeps the imported app intact)

```
This project is a dependency-free vanilla JavaScript app, NOT React. Please keep it that way:
do not convert it to React/Vite, do not add a bundler, do not move or rename files.

- Entry point: `npm start` runs `node server.js` (Node 18+, zero npm dependencies).
- server.js must listen on process.env.PORT (default 3000) on 0.0.0.0, serve the static files listed in its FILES table,
  and expose GET /api/health and POST /api/chat {message, history} -> {answer}.
- The Gemini API key must be read ONLY from process.env.GEMINI_API_KEY on the server and must never appear in any
  file served to the browser. Keep the GEMINI_MODEL env override and the fallback model list in server.js,
  because model ids are renamed over time.
- The front end (index.html, style.css, app.js, data.js, molecules.js, lib-*.js, pyq.js) works offline without the server.

Task: run the app, check the browser console and the server log, and fix only what is broken.
Report what you changed. Do not rewrite working code.
```

### Prompt A2 — "fix any build or runtime issue"

```
The preview fails or the chat shows an error. Here is the exact error text / console output:
<paste it here>

Find the root cause and fix it with the smallest possible change. Constraints: keep the app vanilla JS with no new
dependencies unless strictly necessary, keep the server-side-only GEMINI_API_KEY, keep the /api/chat contract
({message, history} -> {answer}), and do not delete data files (data.js, molecules.js, lib-*.js, pyq.js).
```

### Prompt A3 — switch the server to the official SDK (optional)

```
In server.js replace the raw fetch call to the Gemini REST endpoint (function callGemini) with the official
@google/genai SDK (add it to package.json dependencies). Keep: the system prompt, the history mapping
(assistant -> "model"), the 40 s timeout, the 20 requests/minute/IP limit, the model fallback list and the
GEMINI_MODEL env override, and the JSON shapes of /api/health and /api/chat.
```

### Prompt A4 — content extension (original text only)

```
Add 20 more entries to lib-organic2.js in exactly the same schema (b, ch, t, l, n, w, s, e, x), covering <chapter>.
Write them in your own words from NCERT / IUPAC / standard textbook knowledge. Do not copy coaching-institute
modules or exam papers. Prefer exceptions, special cases and numerical traps. Then run `node --check lib-organic2.js`
and make sure no two entries share the same branch and title.
```

---

## Route B: one file, no GitHub

`dist/nemo-single-file.html` is the whole app in one file (≈420 KB: CSS, data, 248 library entries, 124 molecules, the PYQ bank).

* **On any phone or PC:** just open it. Everything except AI chat works offline.
* **Inside an AI Studio project:** open the **Code** tab and replace `index.html` with this file's contents. The page needs no build step. For AI chat without a server, open the sidebar's **"Use my own Gemini key"** box and paste a key. It is stored only in that browser and is sent only to Google; use a restricted key and never on a shared computer. The server-side route (A) is safer and is what to use for anything you share.

Rebuild it after editing any source file: `npm run build:single` (writes `dist/nemo-single-file.html` and `dist/system-instruction.txt`).

**System instruction for AI Studio.** The tutor's instruction lives in `system-prompt.js` and is sent automatically by `server.js` and by own-key mode, with the **Level** selector choosing the depth. If you instead build a chat inside AI Studio's own prompt UI, paste the contents of `dist/system-instruction.txt` into its **System instructions** box.

---

## Loading real PYQs (the part Nemo cannot ship)

Nemo contains **no official question text**, so everything in the PYQ Bank comes from you:

1. Download the papers and **answer keys** from the official sources: JEE Advanced archive (jeeadv.ac.in/archive.html) and JEE Main / NTA (jeemain.nta.nic.in).
2. In **PYQ Bank > Import questions** press **Copy extraction prompt**, paste it into Gemini (AI Studio chat) together with the paper text and its answer key, and ask it to return the JSON array.
3. Paste the JSON into the import box (or save as `.json` and use **Choose file**). Rows that fail validation are listed and skipped; template placeholders are never imported.
4. **Spot-check** several imported questions against the official paper. An AI extraction can mis-copy a symbol or an option.

The chapter-by-year table and "high frequency but not yet solid for you" hint are computed only from what you import, with a small-sample warning.
