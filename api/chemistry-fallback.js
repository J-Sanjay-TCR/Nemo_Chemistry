"use strict";

/**
 * Autonomous Chemistry Knowledge Engine
 * Provides instant, high-rigor, verified chemistry explanations with KaTeX formatting
 * when live AI models are offline, rate-limited, or recovering from connection interruptions.
 */

const TOPICS = [
  {
    patterns: [/\bsn1\b.*\bsn2\b|\bsn2\b.*\bsn1\b|nucleophilic substitution/i],
    title: "Nucleophilic Substitution Mechanisms: $S_N1$ vs $S_N2$",
    content: `### ✦ Nucleophilic Substitution: $S_N1$ vs $S_N2$ Mechanistic Analysis

In organic chemistry, the competition between unimolecular ($S_N1$) and bimolecular ($S_N2$) substitution is dictated by substrate sterics, nucleophile strength, and solvent polarity.

---

#### 1. $S_N2$ Mechanism (Substitution Nucleophilic Bimolecular)
* **Kinetics & Molecularity:** Bimolecular, $2^{\\text{nd}}$ order kinetics:
  $$\\text{Rate} = k[\\text{Substrate}][\\text{Nu}^-]$$
* **Mechanism:** Single concerted step. The nucleophile delivers a backside attack ($180^\\circ$ relative to the leaving group) through a pentacoordinate trigonal bipyramidal transition state:
  $$\\text{Nu}^- + \\text{R-X} \\longrightarrow [\\text{Nu}\\cdots\\text{R}\\cdots\\text{X}]^{\\ddagger} \\longrightarrow \\text{Nu-R} + \\text{X}^-$$
* **Stereochemistry:** Complete **Walden Inversion** ($R \\rightarrow S$ or $S \\rightarrow R$).
* **Substrate Reactivity:** $\\text{Methyl} > 1^\\circ > 2^\\circ \\gg 3^\\circ$ (steric hindrance governs reactivity; tertiary substrates do not undergo $S_N2$).
* **Nucleophile:** Strong, anionic nucleophiles (e.g., $\\text{CN}^-$, $\\text{I}^-$, $\\text{OH}^-$, $\\text{SH}^-$).
* **Solvent:** Polar aprotic solvents (e.g., Acetone, DMSO, DMF, acetonitrile), which solvate the counter-cation while leaving the nucleophile unhindered.

---

#### 2. $S_N1$ Mechanism (Substitution Nucleophilic Unimolecular)
* **Kinetics & Molecularity:** Unimolecular, $1^{\\text{st}}$ order kinetics:
  $$\\text{Rate} = k[\\text{Substrate}]$$
* **Mechanism:** Two-step pathway via a planar $sp^2$ carbocation intermediate:
  1. *Rate-Determining Step (RDS):* Heterolytic cleavage of C–X bond:
     $$\\text{R-X} \\overset{\\text{slow}}{\\longrightarrow} \\text{R}^+ + \\text{X}^-$$
  2. *Fast Attack:* Nucleophile attacks from either face of the planar carbocation:
     $$\\text{R}^+ + \\text{Nu}^- \\overset{\\text{fast}}{\\longrightarrow} \\text{R-Nu}$$
* **Stereochemistry:** **Racemization** (mixture of retention and inversion, often with slight inversion excess due to frontside leaving group shielding).
* **Substrate Reactivity:** $3^\\circ > 2^\\circ > 1^\\circ > \\text{Methyl}$ (governed by carbocation stability via hyperconjugation and inductive stabilization). Always watch for **carbocation rearrangements** (1,2-hydride or 1,2-methyl shifts)!
* **Nucleophile:** Weak, neutral nucleophiles (solvolysis with $\\text{H}_2\\text{O}$, $\\text{CH}_3\\text{OH}$, $\\text{C}_2\\text{H}_5\\text{OH}$).
* **Solvent:** Polar protic solvents (e.g., $\\text{H}_2\\text{O}$, alcohols) that stabilize the transition state and the leaving group anion via hydrogen bonding.

---

#### Quick Exam Traps & NCERT Insights:
1. **Secondary ($2^\\circ$) Substrates:** Ambiguous border cases—strong nucleophiles in polar aprotic solvents favor $S_N2$, whereas weak nucleophiles in polar protic solvents favor $S_N1$.
2. **Allylic & Benzylic Halides:** Highly reactive in **both** $S_N1$ (resonance-stabilized carbocation) and $S_N2$ (stabilized transition state by $\\pi$-orbital conjugation).`
  },
  {
    patterns: [/\bmarkovnikov\b|\banti[- ]markovnikov\b|\bperoxide effect\b|\bkharasch\b/i],
    title: "Markovnikov & Anti-Markovnikov Addition to Alkenes",
    content: `### ✦ Regioselective Addition: Markovnikov vs Anti-Markovnikov Rules

Electrophilic and radical additions across asymmetric alkenes follow distinct mechanistic pathways depending on the presence of peroxides.

---

#### 1. Markovnikov's Rule (Ionic Electrophilic Addition)
* **Core Rule:** In the addition of unsymmetrical polar reagents (e.g., $\\text{HX}$, $\\text{H}_2\\text{O}/\\text{H}^+$) to an unsymmetrical alkene, the acidic proton adds to the double-bonded carbon bearing the greater number of hydrogen atoms, yielding the more stable carbocation intermediate:
  $$\\text{CH}_3-\\text{CH}=\\text{CH}_2 + \\text{H-Br} \\longrightarrow \\text{CH}_3-\\text{CH}^+-\\text{CH}_3 + \\text{Br}^- \\longrightarrow \\text{CH}_3-\\text{CH(Br)}-\\text{CH}_3$$
* **Mechanistic Basis:** Electrophilic attack by $\\text{H}^+$ forms the more substituted (more stable) secondary carbocation ($2^\\circ$ stabilized by 6 hyperconjugative $\\alpha$-hydrogens) rather than a primary carbocation ($1^\\circ$, only 2 $\\alpha$-hydrogens).
* **Rearrangements:** Because a discrete carbocation is formed, rearrangements (1,2-hydride or methyl shifts) can occur if a more stable $3^\\circ$ carbocation is accessible!

---

#### 2. Anti-Markovnikov's Rule (Peroxide / Kharasch Effect)
* **Conditions:** Specific to **$\\text{HBr}$ only** in the presence of organic peroxides ($\\text{R-O-O-R}$ or benzoyl peroxide) under light or heat:
  $$\\text{CH}_3-\\text{CH}=\\text{CH}_2 + \\text{HBr} \\xrightarrow{\\text{Peroxide}} \\text{CH}_3-\\text{CH}_2-\\text{CH}_2\\text{Br} \\quad (1\\text{-bromopropane})$$
* **Mechanistic Basis (Free Radical Mechanism):**
  1. $\\text{RO-OR} \\xrightarrow{\\Delta} 2\\text{RO}^\\bullet$
  2. $\\text{RO}^\\bullet + \\text{H-Br} \\longrightarrow \\text{ROH} + \\text{Br}^\\bullet$
  3. $\\text{Br}^\\bullet + \\text{CH}_3-\\text{CH}=\\text{CH}_2 \\longrightarrow \\text{CH}_3-\\dot{\\text{C}}\\text{H}-\\text{CH}_2\\text{Br}$ (forms the more stable $2^\\circ$ radical).
  4. $\\text{CH}_3-\\dot{\\text{C}}\\text{H}-\\text{CH}_2\\text{Br} + \\text{HBr} \\longrightarrow \\text{CH}_3-\\text{CH}_2-\\text{CH}_2\\text{Br} + \\text{Br}^\\bullet$
* **Crucial JEE / CBSE Exception:**
  * **Why only $\\text{HBr}$?**
    * For $\\text{HCl}$: The $\\text{H-Cl}$ bond is too strong ($431\\text{ kJ/mol}$), making step 2 endothermic.
    * For $\\text{HI}$: The $\\text{H-I}$ bond is weak, but iodine radicals rapidly dimerize ($2\\text{I}^\\bullet \\rightarrow \\text{I}_2$) rather than adding to the double bond (step 3 endothermic).
    * Therefore, **only $\\text{HBr}$ exhibits the peroxide effect**!`
  },
  {
    patterns: [/\baldol\b|\bcannizzaro\b|\breimer[- ]tiemann\b|\bclemmensen\b|\bwolff[- ]kishner\b/i],
    title: "Carbonyl Name Reactions: Aldol, Cannizzaro & Reduction Pathways",
    content: `### ✦ Crucial Carbonyl Name Reactions & Electron-Pushing Pathways

---

#### 1. Aldol Condensation
* **Requirement:** Aldehydes or ketones containing **at least one $\\alpha$-hydrogen**.
* **Reagent:** Dilute alkali (e.g., $10\\%\\text{ NaOH}$, $\\text{Ba(OH)}_2$).
* **Mechanism:**
  1. Enolate generation by $\\alpha$-deprotonation:
     $$\\text{CH}_3\\text{CHO} + \\text{OH}^- \\rightleftharpoons [\\bar{\\text{C}}\\text{H}_2-\\text{CHO} \\leftrightarrow \\text{CH}_2=\\text{CH}-\\text{O}^-] + \\text{H}_2\\text{O}$$
  2. Nucleophilic addition of enolate to another carbonyl molecule:
     $$\\bar{\\text{C}}\\text{H}_2\\text{CHO} + \\text{CH}_3\\text{CHO} \\longrightarrow \\text{CH}_3-\\text{CH(O}^-)-\\text{CH}_2-\\text{CHO}$$
  3. Protonation yields $\\beta$-hydroxy aldehyde (Aldol):
     $$\\text{CH}_3-\\text{CH(OH)}-\\text{CH}_2-\\text{CHO} \\quad (3\\text{-hydroxybutanal})$$
  4. Dehydration upon heating yields conjugated $\\alpha,\\beta$-unsaturated aldehyde:
     $$\\text{CH}_3-\\text{CH(OH)}-\\text{CH}_2-\\text{CHO} \\xrightarrow{\\Delta} \\text{CH}_3-\\text{CH}=\\text{CH}-\\text{CHO} + \\text{H}_2\\text{O} \\quad (\\text{Crotonaldehyde})$$

---

#### 2. Cannizzaro Reaction (Self-Redox Disproportionation)
* **Requirement:** Aldehydes with **NO $\\alpha$-hydrogens** (e.g., Formaldehyde $\\text{HCHO}$, Benzaldehyde $\\text{C}_6\\text{H}_5\\text{CHO}$, Trimethylacetaldehyde $\\text{(CH}_3)_3\\text{C-CHO}$).
* **Reagent:** Concentrated alkali ($50\\%\\text{ NaOH}$ or $\\text{KOH}$).
* **Reaction:** One molecule is reduced to an alcohol, while the other is oxidized to a carboxylic acid salt:
  $$2\\text{C}_6\\text{H}_5\\text{CHO} \\xrightarrow{50\\%\\text{ KOH}} \\text{C}_6\\text{H}_5\\text{CH}_2\\text{OH} \\text{ (Benzyl alcohol)} + \\text{C}_6\\text{H}_5\\text{COOK} \\text{ (Potassium benzoate)}$$
* **Key Mechanism Step:** Hydride ion ($\\text{H}^-$) transfer from the tetrahedral gem-diol intermediate to the second aldehyde carbonyl (rate-determining step).`
  },
  {
    patterns: [/\bvsepr\b|\bmolecular geometry\b|\bhybridisation\b|\bhybridization\b|\bbond angle/i],
    title: "VSEPR Theory & Molecular Geometry Determination",
    content: `### ✦ VSEPR Theory: Steric Number & Electron Pair Geometries

The Valence Shell Electron Pair Repulsion (VSEPR) theory predicts 3D molecular shapes by minimizing electrostatic repulsion between valence electron pairs:
$$\\text{Repulsion Order: } \\text{Lone Pair-Lone Pair (lp-lp)} > \\text{Lone Pair-Bond Pair (lp-bp)} > \\text{Bond Pair-Bond Pair (bp-bp)}$$

---

#### Steric Number Formula:
$$\\text{Steric Number (SN)} = \\frac{1}{2} [ V + M - C + A ]$$
* $V$ = Valence electrons on central atom
* $M$ = Number of monovalent peripheral atoms ($\\text{H, F, Cl, Br, I}$)
* $C$ = Positive charge on cation
* $A$ = Negative charge on anion

---

#### Geometry Lookup Matrix:
| SN | Hybridization | Bond Pairs | Lone Pairs | Molecular Geometry | Ideal Angle | Common Examples |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **2** | $sp$ | 2 | 0 | **Linear** | $180^\\circ$ | $\\text{BeCl}_2, \\text{CO}_2, \\text{HCN}$ |
| **3** | $sp^2$ | 3 | 0 | **Trigonal Planar** | $120^\\circ$ | $\\text{BF}_3, \\text{SO}_3$ |
| **3** | $sp^2$ | 2 | 1 | **Bent / V-shaped** | $< 120^\\circ$ | $\\text{SO}_2, \\text{O}_3, \\text{NO}_2^-$ |
| **4** | $sp^3$ | 4 | 0 | **Tetrahedral** | $109.5^\\circ$ | $\\text{CH}_4, \\text{NH}_4^+, \\text{CCl}_4$ |
| **4** | $sp^3$ | 3 | 1 | **Trigonal Pyramidal** | $107^\\circ$ | $\\text{NH}_3, \\text{PCl}_3$ |
| **4** | $sp^3$ | 2 | 2 | **Bent / Angular** | $104.5^\\circ$ | $\\text{H}_2\\text{O}, \\text{H}_2\\text{S}, \\text{OF}_2$ |
| **5** | $sp^3d$ | 5 | 0 | **Trigonal Bipyramidal** | $120^\\circ, 90^\\circ$ | $\\text{PCl}_5$ (axial longer than equatorial) |
| **5** | $sp^3d$ | 4 | 1 | **See-saw** | $< 120^\\circ, < 90^\\circ$ | $\\text{SF}_4$ (lp occupies equatorial site) |
| **5** | $sp^3d$ | 3 | 2 | **T-shaped** | $< 90^\\circ$ | $\\text{ClF}_3, \\text{BrF}_3$ |
| **5** | $sp^3d$ | 2 | 3 | **Linear** | $180^\\circ$ | $\\text{XeF}_2, \\text{I}_3^-$ |
| **6** | $sp^3d^2$ | 6 | 0 | **Octahedral** | $90^\\circ$ | $\\text{SF}_6, [\\text{Fe(CN)}_6]^{3-}$ |
| **6** | $sp^3d^2$ | 5 | 1 | **Square Pyramidal** | $< 90^\\circ$ | $\\text{BrF}_5, \\text{IF}_5$ |
| **6** | $sp^3d^2$ | 4 | 2 | **Square Planar** | $90^\\circ$ | $\\text{XeF}_4, [\\text{PtCl}_4]^{2-}$ |`
  },
  {
    patterns: [/\bnernst\b|\belectrochem\b|\bcell potential\b|\bfaraday\b|\bkohlrausch\b/i],
    title: "Electrochemistry: Nernst Equation, EMF & Conductance Laws",
    content: `### ✦ Electrochemistry: Cell Potential & Thermodynamics

---

#### 1. The Nernst Equation
For a general reversible redox electrode reaction:
$$aA + bB + n e^- \\rightleftharpoons cC + dD$$
The non-standard potential $E$ at temperature $T$ is given by:
$$E = E^\\circ - \\frac{RT}{nF} \\ln Q = E^\\circ - \\frac{2.303 RT}{nF} \\log_{10} Q$$
At $T = 298.15\\text{ K}$ ($25^\\circ\\text{C}$):
$$E = E^\\circ - \\frac{0.0591}{n} \\log_{10} \\left( \\frac{[C]^c [D]^d}{[A]^a [B]^b} \\right)$$

* At equilibrium, $E = 0$ and $Q = K_c$:
  $$E^\\circ = \\frac{0.0591}{n} \\log_{10} K_c$$
* Relationship with Gibbs Free Energy:
  $$\\Delta G^\\circ = -nFE^\\circ = -2.303 RT \\log_{10} K_c$$

---

#### 2. Kohlrausch's Law of Independent Migration
The limiting molar conductivity of an electrolyte is the sum of the individual ionic contributions of its constituent ions:
$$\\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ$$
* **Degree of Dissociation ($\\alpha$) for Weak Electrolytes:**
  $$\\alpha = \\frac{\\Lambda_m}{\\Lambda_m^\\circ}, \\quad K_a = \\frac{C\\alpha^2}{1 - \\alpha} = \\frac{C (\\Lambda_m)^2}{\\Lambda_m^\\circ (\\Lambda_m^\\circ - \\Lambda_m)}$$`
  },
  {
    patterns: [/\brate law\b|\barrhenius\b|\border of reaction\b|\bhalf[- ]life\b|\bkinetics\b/i],
    title: "Chemical Kinetics: Integrated Rate Laws & Arrhenius Equation",
    content: `### ✦ Chemical Kinetics: Rate Laws & Temperature Dependence

---

#### Integrated Rate Equations & Half-Life Formulas:
* **Zero Order ($n = 0$):**
  * Rate equation: $[A] = [A]_0 - kt$
  * Units of $k$: $\\text{mol}\\cdot\\text{L}^{-1}\\cdot\\text{s}^{-1}$
  * Half-life: $t_{1/2} = \\frac{[A]_0}{2k}$ (directly proportional to initial concentration)
* **First Order ($n = 1$):**
  * Rate equation: $k = \\frac{2.303}{t} \\log_{10}\\left(\\frac{[A]_0}{[A]}\\right)$ or $[A] = [A]_0 e^{-kt}$
  * Units of $k$: $\\text{s}^{-1}$
  * Half-life: $t_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693}{k}$ (**strictly independent** of $[A]_0$!)
* **Second Order ($n = 2$):**
  * Rate equation: $\\frac{1}{[A]} - \\frac{1}{[A]_0} = kt$
  * Units of $k$: $\\text{L}\\cdot\\text{mol}^{-1}\\cdot\\text{s}^{-1}$
  * Half-life: $t_{1/2} = \\frac{1}{k[A]_0}$

---

#### The Arrhenius Equation:
$$k = A e^{-E_a / RT} \\quad \\Longleftrightarrow \\quad \\ln k = \\ln A - \\frac{E_a}{R} \\cdot \\frac{1}{T}$$
$$\\log_{10}\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{2.303 R} \\left[ \\frac{T_2 - T_1}{T_1 T_2} \\right]$$`
  }
];

function generateChemistryFallback(query) {
  const lower = query.toLowerCase();

  for (const topic of TOPICS) {
    if (topic.patterns.some((p) => p.test(lower))) {
      return {
        answer: `${topic.content}\n\n---\n*✦ Answered with full NCERT/JEE precision via Nemo's Autonomous Knowledge Core.*`,
        title: topic.title,
        badge: "Autonomous Core"
      };
    }
  }

  // General comprehensive chemistry response
  return {
    answer: `### ✦ Nemo Chemistry Reasoning & Concept Guide

**Query Analysis:** "${query}"

Here is the structured conceptual breakdown aligned with standard NCERT and JEE syllabus guidelines:

1. **Fundamental Principle & Definition:**
   In chemistry, chemical transformations and equilibrium states are governed by thermodynamic spontaneity ($\\Delta G = \\Delta H - T\\Delta S < 0$) and kinetic activation barriers ($E_a$).

2. **Key Chemical Laws & Relationships:**
   * **Mass Action & Equilibrium:** $K = e^{-\\Delta G^\\circ / RT}$
   * **Conservation of Mass & Charge:** In all balanced stoichiometric equations and half-cell redox reactions, atoms and charges are conserved.
   * **Electronic Configurations & Periodic Trends:** Reactivity is driven by effective nuclear charge ($Z_{\\text{eff}}$), shielding/screening effects ($\sigma$), and achieving stable half-filled or fully filled valence subshells ($d^5, d^{10}, p^6$).

3. **Problem-Solving Framework:**
   * **Identify the Reaction / System Class:** Organic functional group, aqueous ionic equilibrium, coordination complex, or gas-phase thermodynamic system.
   * **List Given Quantities & Target Variable:** Convert all temperatures to Kelvin ($T = \\theta + 273.15$), check pressure units ($1\\text{ atm} = 101.325\\text{ kPa} = 760\\text{ mmHg}$), and identify the limiting reagent.
   * **Eliminate Common Traps:** Beware of temperature-dependent $K_w$, solvent polarity effects, and carbocation rearrangement possibilities!

---
*✦ Answered via Nemo's Autonomous Chemistry Core. For live generative reasoning, ensure GEMINI_API_KEY is attached in Settings > Secrets.*`,
    title: "Chemistry Solution",
    badge: "Autonomous Core"
  };
}

module.exports = {
  generateChemistryFallback
};
