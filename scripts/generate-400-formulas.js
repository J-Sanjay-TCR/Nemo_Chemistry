#!/usr/bin/env node
"use strict";
/**
 * Generates and validates the full 400+ Chemistry Formula Package for Nemo Chemistry Tutor.
 * Covers all CBSE, JEE Main, and JEE Advanced Physical, Inorganic, and Organic Chemistry topics.
 */
const fs = require("fs");
const path = require("path");

const pristineDataPath = path.join(__dirname, "..", "public", "nemo", "data.js");
const targetDataPath = path.join(__dirname, "..", "data.js");
const dataContent = fs.readFileSync(pristineDataPath, "utf8");

// Load base pristine formulas from public/nemo/data.js
global.window = {};
eval(dataContent);
const existingFormulas = global.window.NEMO_DATA.formulas || [];
console.log("Existing formulas loaded:", existingFormulas.length);

// Extract existing quiz and topics
const quizMatch = dataContent.match(/quiz:\s*(\[[\s\S]*?\n\s*\]),/);
const topicsMatch = dataContent.match(/topics:\s*(\[[\s\S]*?\n\s*\])\s*\}\s*;/);

if (!quizMatch || !topicsMatch) {
  console.error("Failed to parse quiz or topics from data.js");
  process.exit(1);
}

const quizCode = quizMatch[1];
const topicsCode = topicsMatch[1];

// Helper to sanitize formula objects
const formulaMap = new Map();
existingFormulas.forEach((f) => formulaMap.set(f.id, f));

function addFormula(f) {
  if (!f.id || !f.branch || !f.chapter || !f.title || !f.expr || !f.symbols || !f.notes) {
    throw new Error("Invalid formula schema: " + JSON.stringify(f));
  }
  if (!formulaMap.has(f.id)) {
    formulaMap.set(f.id, f);
  }
}

// Read more formulas from scripts/expand-formulas.js, add-more-formulas.js, add-advanced-formulas.js if present
["expand-formulas.js", "add-more-formulas.js", "add-advanced-formulas.js"].forEach(file => {
  const p = path.join(__dirname, file);
  if (fs.existsSync(p)) {
    try {
      const src = fs.readFileSync(p, "utf8");
      // Extract formulas from array
      const match = src.match(/(?:FORMULAS|additionalFormulas|advancedFormulas)\s*=\s*(\[[\s\S]*?\]);/);
      if (match) {
        const arr = eval(match[1]);
        if (Array.isArray(arr)) {
          arr.forEach(f => addFormula(f));
          console.log(`Loaded formulas from ${file}: current total = ${formulaMap.size}`);
        }
      }
    } catch (e) {
      console.warn(`Could not parse ${file}:`, e.message);
    }
  }
});

console.log("Formulas before bulk expansion:", formulaMap.size);

// Define full curriculum bulk formulas
[
  require("./formula-curriculum.js"),
  require("./formula-curriculum-part2.js"),
  require("./formula-curriculum-part3.js"),
  require("./formula-curriculum-part4.js"),
  require("./formula-curriculum-part5.js")
].forEach(part => part.forEach(f => addFormula(f)));

console.log("Formulas after bulk curriculum integration:", formulaMap.size);

const finalFormulas = Array.from(formulaMap.values());

// Sort logically: Physical, then Inorganic, then Organic
const branchOrder = { "Physical": 1, "Inorganic": 2, "Organic": 3 };
finalFormulas.sort((a, b) => {
  const bo = (branchOrder[a.branch] || 99) - (branchOrder[b.branch] || 99);
  if (bo !== 0) return bo;
  if (a.chapter !== b.chapter) return a.chapter.localeCompare(b.chapter);
  return a.title.localeCompare(b.title);
});

console.log("Total final formulas count:", finalFormulas.length);

const outData = `/* Nemo content: practice questions, formula bank and offline answers.
   All practice questions are ORIGINAL study questions written for this app. They are not official
   JEE/CBSE previous-year questions and carry no year/paper metadata. */
window.NEMO_DATA = {
  /* ---------------- Practice questions ---------------- */
  quiz: ${quizCode},

  /* ---------------- Comprehensive Formula Bank (400+ Formulas) ---------------- */
  formulas: ${JSON.stringify(finalFormulas, null, 2)},

  /* ---------------- Offline answers ---------------- */
  topics: ${topicsCode}
};
`;

fs.writeFileSync(targetDataPath, outData, "utf8");
console.log("Successfully wrote updated data.js with " + finalFormulas.length + " formulas!");
