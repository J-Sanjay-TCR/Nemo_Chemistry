"use strict";

const katex = require("katex");
try { require("../vendor/katex/contrib/mhchem.min.js"); } catch (e) {}

global.window = {};
require("../data.js");
const formulas = global.window.NEMO_DATA.formulas;

console.log("Analyzing", formulas.length, "formulas...");

const issuesList = [];

formulas.forEach((f, idx) => {
  const issues = [];
  const lat = f.latex || "";
  const expr = f.expr || "";

  // 1. KaTeX strict render test
  try {
    katex.renderToString(lat, { displayMode: true, throwOnError: true });
  } catch (err) {
    issues.push(`KaTeX Error: ${err.message}`);
  }

  // 2. Double backslashes (like \\alpha or \\pi or \\Big)
  if (/\\\\[a-zA-Z]/.test(lat)) {
    issues.push("Double backslash before command: " + lat.match(/\\\\[a-zA-Z]+/g).join(", "));
  }

  // 3. Broken \sqrt [ ... ]
  if (/\\sqrt\s*\[/.test(lat)) {
    issues.push("Broken \\sqrt[...] syntax");
  }

  // 4. Raw unicode characters that should be converted or LaTeX commands
  const unhandledUnicode = lat.match(/[\u007F-\uFFFF]/g);
  if (unhandledUnicode) {
    const badChars = unhandledUnicode.filter(c => !["Å", "°"].includes(c));
    if (badChars.length > 0) {
      issues.push("Raw unicode characters: " + [...new Set(badChars)].join(" "));
    }
  }

  // 5. Check for merged words or multi-letter words in math mode not wrapped in \text{} or \ce{} or \mathrm{}
  // We can strip all \text{...}, \ce{...}, \mathrm{...}, \operatorname{...}, \left, \right, standard latex commands
  let stripped = lat
    .replace(/\\text\{[^}]*\}/g, "")
    .replace(/\\mathrm\{[^}]*\}/g, "")
    .replace(/\\ce\{[^}]*\}/g, "")
    .replace(/\\operatorname\{[^}]*\}/g, "")
    .replace(/\\[a-zA-Z]+/g, ""); // remove all \cmd

  // Now find words with length >= 4 that are just running letters
  const words = stripped.match(/[a-zA-Z]{4,}/g);
  if (words) {
    const suspicious = words.filter(w => !["const", "sqrt", "times", "Delta", "alpha", "beta"].includes(w));
    if (suspicious.length > 0) {
      issues.push("Unwrapped multi-letter words (renders as merged italic product): " + [...new Set(suspicious)].join(", "));
    }
  }

  // 6. Check for unformatted slash expressions like ` / (` or `/ [` or `) /`
  if (/\/\s*\(/.test(lat) || /\/\s*\[/.test(lat) || /\)\s*\//.test(lat) || /\]\s*\//.test(lat)) {
    issues.push("Raw slash fraction in math mode: " + lat);
  }

  // 7. Check for raw reaction arrows or words like "heat", "dil", "conc" in reactions
  if (lat.includes("->") || lat.includes("=>") || lat.includes("—")) {
    issues.push("Raw arrow/dash in formula: " + lat);
  }

  if (issues.length > 0) {
    issuesList.push({
      id: f.id,
      title: f.title,
      branch: f.branch,
      chapter: f.chapter,
      expr: f.expr,
      latex: f.latex,
      issues
    });
  }
});

console.log(`Found issues in ${issuesList.length} of ${formulas.length} formulas.`);
console.log("\nSample problematic formulas (first 25):");
issuesList.slice(0, 25).forEach((item, i) => {
  console.log(`\n#${i + 1} [${item.id}] [${item.branch} - ${item.chapter}] ${item.title}`);
  console.log("   expr :", item.expr);
  console.log("   latex:", item.latex);
  console.log("   issues:", item.issues.join(" | "));
});

// Category breakdowns
const byType = {};
issuesList.forEach(item => {
  item.issues.forEach(iss => {
    const key = iss.split(":")[0];
    byType[key] = (byType[key] || 0) + 1;
  });
});
console.log("\nIssue counts by category:", JSON.stringify(byType, null, 2));
