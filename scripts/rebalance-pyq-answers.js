"use strict";

const fs = require("fs");
const path = require("path");

global.window = {};
require("../pyq.js");
const questions = global.window.NEMO_PYQ;

console.log("Processing", questions.length, "questions...");

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// Hash string to deterministic integer
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

let mcqCounts = { A: 0, B: 0, C: 0, D: 0 };
let msqCount = 0;
let numCount = 0;

questions.forEach((q, idx) => {
  if (q.type === "num") {
    numCount++;
    return;
  }
  if (q.type === "msq") {
    msqCount++;
    return;
  }
  if (q.type === "mcq") {
    const opts = q.options;
    const numOpts = opts.length;
    // Current correct option is index 0
    const correctText = opts[0];
    
    // Choose target index based on idx and hash to ensure balanced distribution
    // Target choices cycle across B, C, D, A, C, B, D, A...
    const targetIdx = (idx * 3 + 1) % numOpts;
    const targetLetter = LETTERS[targetIdx];
    
    if (targetIdx !== 0) {
      // Create new options array with correctText at targetIdx
      const newOpts = [...opts];
      const temp = newOpts[targetIdx];
      newOpts[targetIdx] = correctText;
      newOpts[0] = temp;
      q.options = newOpts;
    }
    
    q.answer = targetLetter;
    mcqCounts[targetLetter]++;

    // Update explanation if it contains "Option A" or "(Option A)"
    if (q.explain) {
      q.explain = q.explain
        .replace(/\(Option\s+A\)/gi, `(Option ${targetLetter})`)
        .replace(/Option\s+A\b/gi, `Option ${targetLetter}`)
        .replace(/option\s+A\b/gi, `Option ${targetLetter}`);
    }
  }
});

console.log("New MCQ answer distribution:", mcqCounts);
console.log("MSQ count:", msqCount);
console.log("Num count:", numCount);

// Validate all questions
const app = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");
const valCode = app.match(/function validate\(raw\) \{[\s\S]*?return \{ q: out \};\s*\}/)[0];
const EXAMS = ["JEE Main", "JEE Advanced", "Board", "Other"];
const EXAM_ALIAS = {
  main: "JEE Main", mains: "JEE Main", "jee main": "JEE Main", "jee mains": "JEE Main", "jee-main": "JEE Main",
  adv: "JEE Advanced", advanced: "JEE Advanced", "jee advanced": "JEE Advanced", "jee adv": "JEE Advanced",
  board: "Board", cbse: "Board", boards: "Board", "cbse board": "Board", "cbse class 12": "Board", "board exam": "Board",
  other: "Other"
};
const TYPE_ALIAS = { mcq: "mcq", single: "mcq", "single correct": "mcq", msq: "msq", multiple: "msq", "multiple correct": "msq", mcma: "msq", num: "num", numerical: "num", integer: "num", numeric: "num" };
const BRANCHES = ["Physical", "Inorganic", "Organic"];
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
const normText = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();
const keyOf = (q) => hash([q.exam, q.year, normText(q.q)].join("|"));
const validate = eval("(" + valCode + ")");

let fail = 0;
questions.forEach((q, idx) => {
  const res = validate(q);
  if (res.err) {
    console.error(`Validation error in #${idx + 1}:`, res.err);
    fail++;
  }
});

if (fail > 0) {
  console.error("Failed validation on", fail, "questions!");
  process.exit(1);
}

console.log("All questions passed validation with flying colors!");

// Write updated pyq.js
const pyqPath = path.join(__dirname, "../pyq.js");
fs.writeFileSync(pyqPath, `window.NEMO_PYQ = ${JSON.stringify(questions, null, 2)};\n`, "utf8");
console.log("Updated pyq.js written successfully!");
