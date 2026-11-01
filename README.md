# Nemo Chemistry Tutor v3

Offline-first chemistry study app for CBSE, JEE Main and JEE Advanced. Vanilla HTML/CSS/JS, no build step, no dependencies.

## Run it

* **Just open `index.html`** (or `dist/nemo-single-file.html`). All features work offline except AI chat.
* **With AI chat (Gemini or Claude), key kept on the server:**
  `GEMINI_API_KEY=... node server.js`  or  `ANTHROPIC_API_KEY=... node server.js`, then open http://localhost:3000.
  Optional: `GEMINI_MODEL` (default `gemini-flash-latest`; stable ids are tried automatically if it is rejected), `NEMO_PROVIDER`, `PORT`, `HOST`.
* **Google AI Studio:** see [AI_STUDIO_PROMPTS.md](AI_STUDIO_PROMPTS.md).

## What is inside

| Panel | What it does |
|---|---|
| Chat | Offline answers from the library, formula bank and 7 deep-dive topics; live AI when a key is configured. A **Level** selector (Auto / CBSE / JEE Main / JEE Advanced) sets how deep live answers go; the choice is saved in this browser. If the AI call fails, built-in notes are shown as a fallback. |
| 3D Molecules | **124** hand-built, geometry-checked entries with a filter box: VSEPR shapes (incl. interhalogens, XeF₂/XeOF₄/XeO₄, I₃⁻), oxoacids and oxoanions (HNO₃, H₂SO₄, SO₄²⁻, Cr₂O₇²⁻, MnO₄⁻…), reactive intermediates (carbocation, carbanion, radical, t-Bu⁺), conformers (butane anti/gauche/eclipsed, chair/boat, axial vs equatorial), enantiomers (R/S CHBrClF), aromatics (toluene, phenol, aniline, nitrobenzene, naphthalene), cages (cubane, C₆₀), coordination compounds (cis/trans-Pt, Δ/Λ-[Co(en)₃]³⁺, Ni(CO)₄, ferrocene…) and **9 solid-state unit cells** (sc, bcc, fcc, hcp, NaCl, CsCl, ZnS, CaF₂, diamond). Ball, stick and space-fill, lone-pair lobes, labels, pinch zoom, optional PubChem search (online). |
| Rules & Exceptions Library | 248 original entries: laws, rules, special cases, exceptions, trends, name reactions and tests across Physical (57), Inorganic (74) and Organic (117), including practical organic chemistry (Lassaigne, Victor Meyer, Lucas, Hinsberg, Tollens/Fehling, phenol and iodoform tests) and inorganic salt analysis (borax bead, flame, brown ring, chromyl chloride, nitroprusside). Search, filter by branch, chapter, type and level; each card has the exam trap and an "Ask Nemo" button. |
| PYQ Bank | **Import your own** questions (JSON or CSV; MCQ, multi-correct, numerical). Practice with filters (exam, year, branch, chapter, not attempted, missed), plus a chapter × year frequency table and a "frequent but weak" hint computed from your own data. |
| Practice and Study Analytics | 18 original questions; accuracy by branch and chapter from your real answers (PYQ answers count too). |
| Reaction Canvas | Pen, arrow, eraser, undo, PNG export. |
| Formula Bank | 25 formulas with symbols, tips and worked examples. |

## Visual effects (the "✦ Effects" button, top right)

Pure CSS plus a few lines of JS, no libraries. Everything is transform/opacity-based so it stays smooth, and it switches itself off where it would hurt.

* Slow aurora background; panels fade and rise in as you scroll to them.
* Panel borders draw a spinning gradient ring on hover or focus (uses `@property`); a soft spotlight follows the mouse over panels and formula cards.
* Gradient shimmer on the headline, breathing logo, pulsing "online" dot, sheen on the active menu item and on buttons, springy press feedback.
* Chat bubbles pop in; the typing dots wave; correct answers pulse green, wrong answers shake; analytics bars grow.
* Library cards stagger in and expand with a smooth height animation (browsers that support `interpolate-size`; others just open instantly).
* Scanning HUD corners on the 3D viewer.

The **✦ Effects** button turns it all off (saved in this browser). It is also off automatically with `prefers-reduced-motion`, and the heavy parts (spotlight, ring) are skipped on touch screens and in print. To remove it for good, delete the block at the bottom of `style.css` and the `effects()` function at the end of `app.js`.

## Honest limits

* **No coaching-institute material was used or copied.** The library is original writing from NCERT, IUPAC and standard textbook knowledge. Check entries against your NCERT and class notes.
* **No official PYQ text is bundled.** It cannot be verified from here and the papers are the exam bodies' material. Import what you have from the official archives and verify it.
* Gemini and AI Studio paths were tested only against mocks (see AI_STUDIO_PROMPTS.md). AI answers can be wrong: check against textbooks and answer keys.
* Data stays in your browser's localStorage (about 5 MB; the PYQ bank is capped near 2 MB or 2000 questions).

## Data formats

* Library entry (`lib-*.js`): `{ b: branch, ch: chapter, t: type, l: "Board"|"Main"|"Adv", n: title, w: scientist, s: statement, e: example, x: exam trap }`.
* PYQ import: see `pyq_template.json` or use the in-app template buttons. Answers are option letters (`B`, `["A","C"]`) or a number; `tolerance` is optional for numericals.

## Files

`index.html` `style.css` `app.js` · `data.js` (quiz, formulas, topics) · `molecules.js` (generated) · `lib-*.js` (library) · `system-prompt.js` (tutor instruction shared by the server and own-key mode) · `pyq.js` (optional preloaded PYQ array, empty) · `server.js` (optional backend) · `scripts/build-single.js` · `metadata.json` · `package.json`.

## Changelog

* **v3.3** Added the ChemMaster-style tutor instruction as one shared module (`system-prompt.js`): the server (Gemini and Claude) and the browser's own-key mode now send the same instruction, with a per-level depth line from the new Level selector. 23 new library entries (now 248): practical organic chemistry, salt analysis, and gaps such as neighbouring-group participation, carbonium vs carbenium ions, kinetic vs thermodynamic control, the Reformatsky reaction, acetoacetic ester synthesis, Gilman reagents and projection formulas. `npm run build:single` also writes `dist/system-instruction.txt` to paste into the System Instructions box in AI Studio. Library statements now keep their line breaks. Facts in the supplied instruction were checked while writing and a few were corrected, for example nitro compounds do give the Lassaigne nitrogen test, and the FeCl₃ complex equation was rewritten.
* **v3.2** 3D Molecules grew from 36 to 124 (see the table), with a filter box on the molecule list, per-molecule ion sizes and dashed cell edges in the viewer, and crystal-specific info labels for unit cells.
* **v3.1** Advanced CSS effects layer with an on/off toggle (see Visual effects). No data changes.
* **v3** Rules & Exceptions Library (225 at the time), PYQ Bank with import and real analytics, 36 molecules, Gemini and Claude server providers, single-file build, own-key mode, AI Studio package, safer offline routing.
* **v2** Fixed arrow tool, canvas scaling, widget logic, viewer leaks, voice, fake analytics and layout; offline-first 3D viewer; real practice analytics.
