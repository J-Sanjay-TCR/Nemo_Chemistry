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
const indexFile = path.join(out, "index.html"); fs.writeFileSync(indexFile, html);

/* Copy vendor assets to dist/vendor so standalone static hosting of dist/ has all KaTeX fonts */
const vendorSrc = path.join(root, "vendor");
const vendorDest = path.join(out, "vendor");
if (fs.existsSync(vendorSrc)) {
  fs.cpSync(vendorSrc, vendorDest, { recursive: true });
}

/* Copy standalone frontend scripts and assets so dist can serve either bundled or multi-file */
const staticFiles = [
  "style.css", "app.js", "data.js", "molecules.js", "pyq.js",
  "lib-physical.js", "lib-inorganic.js", "lib-organic.js", "lib-organic2.js", "lib-practical.js",
  "system-prompt.js", "pyq_template.json", "metadata.json"
];
for (const sf of staticFiles) {
  const srcPath = path.join(root, sf);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(out, sf));
  }
}

/* the tutor instruction as plain text, for pasting into the "System instructions" box in Google AI Studio */
const P = require(path.join(root, "system-prompt.js"));
fs.writeFileSync(path.join(out, "system-instruction.txt"), P.SYSTEM + "\n\n(Optional: add one of these lines at the end to fix the answer level.)\n" + Object.values(P.TIERS).filter(Boolean).join("\n") + "\n");
console.log("wrote " + path.relative(process.cwd(), file) + " and dist/index.html (" + Math.round(html.length / 1024) + " KB, " + scripts.length + " scripts inlined)");
