#!/usr/bin/env node
/* Builds dist/nemo-single-file.html: index.html with style.css and every local <script src> inlined.
   Zero dependencies. The result runs by double-clicking it (offline study mode, Library, PYQ bank, 3D molecules, practice),
   and can be pasted over index.html in an AI Studio / Vite project. */
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
let html = read("index.html");
const scripts = [];
html = html.replace(/\s*<script\s+src="([^"]+)"[^>]*>\s*<\/script>/g, (m, src) => {
  if (/^https?:/.test(src)) return m; // keep external scripts as they are
  scripts.push(read(src)); return "";
});
html = html.replace(/<link\s+rel="stylesheet"\s+href="style\.css">/, () => "<style>\n" + read("style.css") + "\n</style>");
const safe = (js) => js.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
const inline = scripts.map((js) => "<script>\n" + safe(js) + "\n</script>").join("\n");
if (!/<\/body>/.test(html)) throw new Error("index.html has no </body>");
html = html.replace("</body>", () => inline + "\n</body>");
const out = path.join(root, "dist"); fs.mkdirSync(out, { recursive: true });
const file = path.join(out, "nemo-single-file.html"); fs.writeFileSync(file, html);
/* the tutor instruction as plain text, for pasting into the "System instructions" box in Google AI Studio */
const P = require(path.join(root, "system-prompt.js"));
fs.writeFileSync(path.join(out, "system-instruction.txt"), P.SYSTEM + "\n\n(Optional: add one of these lines at the end to fix the answer level.)\n" + Object.values(P.TIERS).filter(Boolean).join("\n") + "\n");
console.log("wrote " + path.relative(process.cwd(), file) + " (" + Math.round(html.length / 1024) + " KB, " + scripts.length + " scripts inlined)");
