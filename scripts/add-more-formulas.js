#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data.js");
const dataContent = fs.readFileSync(dataPath, "utf8");

global.window = {};
eval(dataContent);
const existingFormulas = global.window.NEMO_DATA.formulas;

const additionalFormulas = [
  /* Additional Physical Chemistry */
  {
    id: "dilution_and_mix", branch: "Physical", chapter: "Solutions & Stoichiometry",
    title: "Dilution Law & Solution Mixtures", expr: "M₁ V₁ = M₂ V₂   ,   M_mix = (M₁V₁ + M₂V₂ + ...) / (V₁ + V₂ + ...)",
    keys: ["dilution law", "mixture of solutions", "molarity of mixture"],
    symbols: ["M₁, M₂: initial and final molarities", "V₁, V₂: initial and final volumes", "M_mix: molarity of combined solution"],
    notes: ["Normality dilution follows the identical formula: N₁ V₁ = N₂ V₂.", "When equal volumes of two solutions of molarity M₁ and M₂ are mixed, M_mix = (M₁ + M₂)/2.", "If a reaction occurs between mixing solutes (acid + base), calculate limiting reactant first."],
    example: "100 mL of 0.2 M HCl mixed with 200 mL of 0.5 M HCl:\nM_mix = [(100 × 0.2) + (200 × 0.5)] / (100 + 200) = (20 + 100) / 300 = 120 / 300 = 0.4 M."
  },
  {
    id: "dalton_amagat", branch: "Physical", chapter: "States of Matter",
    title: "Dalton & Amagat Laws of Partial Quantities", expr: "P_i = x_i · P_total   ,   V_i = x_i · V_total",
    keys: ["dalton partial pressure", "amagat partial volume", "mole fraction gas"],
    symbols: ["P_i: partial pressure of ith gas", "x_i = n_i / n_total: mole fraction", "P_total: total pressure of mixture", "V_i: partial volume of ith gas"],
    notes: ["Dalton's law holds for non-reacting gas mixtures at moderate conditions.", "Dry gas pressure: P_dry = P_moist − Aqueous Tension (vapour pressure of water).", "Volume percent of gas i in an ideal gas mixture equals its mole percent: %V_i = %n_i."],
    example: "Air containing 80 mol% N₂ and 20 mol% O₂ at 1.0 atm total pressure:\nP(N₂) = 0.80 × 1.0 = 0.80 atm, P(O₂) = 0.20 × 1.0 = 0.20 atm."
  },
  {
    id: "boyle_inversion_temp", branch: "Physical", chapter: "States of Matter",
    title: "Boyle & Inversion Temperatures of Real Gases", expr: "T_B = a / (R b)   ,   T_i = 2a / (R b) = 2 T_B",
    keys: ["boyle temperature", "inversion temperature", "joule thomson effect"],
    symbols: ["T_B: Boyle temperature (Z ≈ 1 over a wide pressure range)", "T_i: inversion temperature for Joule–Thomson expansion", "a, b: van der Waals parameters", "R: gas constant"],
    notes: ["At T = T_B, attractive and repulsive van der Waals forces balance, so the gas obeys ideal gas law over an extended pressure range.", "Below T_i, adiabatic expansion through a porous plug causes COOLING (Joule–Thomson cooling).", "Above T_i, expansion causes HEATING (for H₂ and He, T_i is very low: 193 K and 40 K, so they heat up at room temp)."],
    example: "For a gas with a = 3.6 atm L² mol⁻² and b = 0.04 L mol⁻¹:\nT_B = 3.6 / (0.0821 × 0.04) ≈ 1096 K.\nT_i = 2 × 1096 = 2192 K."
  },
  {
    id: "lead_fuel_cells", branch: "Physical", chapter: "Electrochemistry",
    title: "Lead-Acid Battery & H₂–O₂ Fuel Cell Equations", expr: "Lead-Acid: Pb + PbO₂ + 2H₂SO₄ ⇌ 2PbSO₄ + 2H₂O   |   Fuel Cell: 2H₂ + O₂ → 2H₂O (E° = 1.23 V)",
    keys: ["lead acid battery", "fuel cell", "commercial cells", "efficiency"],
    symbols: ["Lead storage discharge: Anode: Pb + SO₄²⁻ → PbSO₄ + 2e⁻; Cathode: PbO₂ + SO₄²⁻ + 4H⁺ + 2e⁻ → PbSO₄ + 2H₂O", "H₂–O₂ Fuel cell: Anode: 2H₂ + 4OH⁻ → 4H₂O + 4e⁻; Cathode: O₂ + 2H₂O + 4e⁻ → 4OH⁻"],
    notes: ["Lead storage battery: cell EMF ≈ 2.0 V per cell; a 12 V car battery contains 6 cells in series. During recharge, reactions reverse and density of H₂SO₄ rises back to 1.30 g mL⁻¹.", "Theoretical efficiency of fuel cell: η = (ΔG° / ΔH°) × 100 ≈ (237.2 / 285.8) × 100 ≈ 83%, compared to ~40% for thermal power plants."],
    example: "A fuel cell consumes 2 mol H₂ (4 Faradays = 385,940 C) at E° = 1.229 V:\nElectrical work w_max = −ΔG° = nFE° = 4 × 96485 × 1.229 ≈ 474.3 kJ."
  },
  {
    id: "parallel_consecutive_kinetics", branch: "Physical", chapter: "Chemical Kinetics",
    title: "Parallel & Consecutive First-Order Reactions", expr: "Parallel: k_total = k₁ + k₂ , %B = k₁/(k₁+k₂)·100   |   Consecutive: t_max(B) = [ln(k₁/k₂)] / (k₁ − k₂)",
    keys: ["parallel reaction", "consecutive reaction", "kinetics", "maximum concentration"],
    symbols: ["Parallel: A → B (rate k₁) and A → C (rate k₂)", "Consecutive: A −k₁→ B −k₂→ C", "t_max(B): time when intermediate B reaches maximum concentration"],
    notes: ["In parallel reactions, ratio of products is fixed at all times: [B]/[C] = k₁ / k₂.", "In radioactive decay chains (A → B → C), secular equilibrium occurs when t_½(parent) >> t_½(daughter), giving λ_A N_A = λ_B N_B."],
    example: "If k₁ = 0.02 min⁻¹ and k₂ = 0.01 min⁻¹ in parallel decay of A:\nk_total = 0.03 min⁻¹. Yield of B = 0.02 / 0.03 = 66.7%."
  },
  {
    id: "fcc_tetrahedral_octahedral", branch: "Physical", chapter: "Solid State",
    title: "Tetrahedral & Octahedral Voids in FCC/CCP", expr: "N atoms in CCP: Octahedral Voids = N   ,   Tetrahedral Voids = 2N   ,   Total = 3N",
    keys: ["octahedral voids", "tetrahedral voids", "voids in ccp", "fcc voids"],
    symbols: ["N: number of lattice atoms in close packing (for FCC unit cell, N = 4 atoms)", "Octahedral voids in FCC: 1 at body centre + 12 on edge centres (each shared by 4) = 1 + 3 = 4", "Tetrahedral voids in FCC: 2 on each of 4 body diagonals = 8"],
    notes: ["Radius of octahedral void: r_oct = 0.414 R_atom.", "Radius of tetrahedral void: r_tet = 0.225 R_atom.", "In NaCl structure: Cl⁻ form FCC lattice, Na⁺ occupy ALL octahedral voids (Coordination 6:6).", "In ZnS (zinc blende): S²⁻ form FCC, Zn²⁺ occupy ALTERNATE tetrahedral voids (Coordination 4:4).", "In CaF₂ (fluorite): Ca²⁺ form FCC, F⁻ occupy ALL tetrahedral voids (Coordination 8:4)."],
    example: "If element B forms CCP lattice and element A occupies 2/3 of tetrahedral voids:\nFormula: B = 1, A = (2/3) × 2 = 4/3  =>  A₄B₃."
  },
  {
    id: "radiocarbon_dating", branch: "Physical", chapter: "Nuclear Chemistry",
    title: "Radiocarbon Dating Formula", expr: "t = (2.303 / λ) log (A₀ / A) = (t_½ / 0.693) · 2.303 log (A₀ / A)",
    keys: ["radiocarbon dating", "carbon 14", "half life carbon", "archeological dating"],
    symbols: ["t: age of fossil / wooden artifact", "A₀: specific activity of ¹⁴C in living organism (≈ 15.3 dpm per gram carbon)", "A: measured activity in fossil", "t_½(¹⁴C) = 5730 years  =>  λ = 1.21 × 10⁻⁴ yr⁻¹"],
    notes: ["¹⁴C is formed in upper atmosphere: ¹⁴N + n → ¹⁴C + p.", "Upon death, carbon intake stops and ¹⁴C decays by β⁻ emission: ¹⁴C → ¹⁴N + β⁻ + ν̄.", "Applicable to organic samples up to ~50,000 years old."],
    example: "A sample shows activity 25% of modern wood (A/A₀ = 1/4 = (½)²):\nTwo half-lives have elapsed: t = 2 × 5730 = 11,460 years."
  },

  /* Additional Inorganic Chemistry */
  {
    id: "born_lande", branch: "Inorganic", chapter: "Chemical Bonding",
    title: "Born–Landé Lattice Energy Equation", expr: "U₀ = − (N_A · M · z₊ · z₋ · e²) / (4πε₀ r₀) · (1 − 1/n)",
    keys: ["born lande", "lattice energy", "madelung constant", "born-lande"],
    symbols: ["U₀: lattice energy of ionic crystal (negative means exothermic lattice formation)", "N_A: Avogadro constant", "M: Madelung constant (depends on crystal geometry: 1.748 for NaCl, 1.763 for CsCl)", "z₊, z₋: charges on ions", "r₀ = r₊ + r₋: interionic equilibrium distance", "n: Born exponent (typically 7–10)"],
    notes: ["Kapustinskii equation (no crystal geometry needed): U₀ = − (1202.5 · ν · z₊ · z₋) / (r₊ + r₋) · [1 − 34.5 / (r₊ + r₋)] kJ mol⁻¹.", "Lattice energy increases directly with ionic charges (z₊ z₋) and inversely with ion size (r₊ + r₋)."],
    example: "Lattice energy order: MgO (z₊z₋ = 4) >> NaCl (z₊z₋ = 1). MgO has much higher melting point (2852 °C vs 801 °C)."
  },
  {
    id: "trans_effect_series", branch: "Inorganic", chapter: "Coordination Compounds",
    title: "Trans Effect in Square Planar Complexes", expr: "CN⁻ ≈ CO ≈ C₂H₄ > PR₃ ≈ H⁻ > CH₃⁻ > NO₂⁻ ≈ I⁻ ≈ SCN⁻ > Br⁻ > Cl⁻ > py > NH₃ > OH⁻ > H₂O",
    keys: ["trans effect", "square planar substitution", "cisplatin synthesis"],
    symbols: ["Trans effect: ability of a coordinated ligand to direct an incoming substituent to the position trans to itself in square planar Pt(II) complexes"],
    notes: ["Operates via two mechanisms: trans-influence (ground state thermodynamic weakening of trans bond via σ-donation) and trans-effect (transition state kinetic stabilisation via π-acceptance).", "Crucial for synthesizing cis-diamminedichloroplatinum(II) [Cisplatin] vs trans-isomer."],
    example: "To synthesize Cisplatin: react [PtCl₄]²⁻ with NH₃ (Cl⁻ has stronger trans effect than NH₃, directing second NH₃ cis to first).\n[Pt(NH₃)₄]²⁺ + 2Cl⁻ yields the trans-isomer."
  },
  {
    id: "pi_acid_synergy", branch: "Inorganic", chapter: "Coordination Compounds",
    title: "Metal–Carbonyl Synergic Bonding", expr: "Synergic Bond = (Ligand σ-donation L → M) + (Metal d-orbital π-backdonation M → L π*)",
    keys: ["synergic bonding", "pi acid ligands", "metal carbonyl", "infrared frequency"],
    symbols: ["L: CO, NO⁺, CN⁻, C₂H₄", "M: low-oxidation-state transition metal with filled d-orbitals"],
    notes: ["Electron donation from filled metal d-orbital into vacant π* antibonding orbital of CO weakens the C–O triple bond and strengthens the M–C bond.", "As negative charge on metal complex increases (e.g. [V(CO)₆]⁻ vs [Cr(CO)₆] vs [Mn(CO)₆]⁺), π-backbonding INCREASES: M–C bond shortens, and C–O stretching frequency ν_CO in IR DECREASES."],
    example: "C–O IR stretching frequency order: Free CO (2143 cm⁻¹) > [Mn(CO)₆]⁺ (2090 cm⁻¹) > [Cr(CO)₆] (2000 cm⁻¹) > [V(CO)₆]⁻ (1860 cm⁻¹)."
  },
  {
    id: "ellingham_thermo", branch: "Inorganic", chapter: "General Principles of Metallurgy",
    title: "Ellingham Diagram Thermodynamics", expr: "ΔG° = ΔH° − TΔS°   =>   Slope = −ΔS°",
    keys: ["ellingham diagram", "metallurgy", "reduction of oxides", "carbon reduction"],
    symbols: ["Plot: standard Gibbs free energy of formation of metal oxides (ΔG° per mole of O₂) against absolute temperature T (K)"],
    notes: ["Most metal oxidation curves have positive slope because 2M(s) + O₂(g) → 2MO(s) consumes gas (ΔS° < 0  =>  slope = −ΔS° > 0).", "Abrupt slope increase marks phase change (melting or boiling of metal) due to larger negative ΔS°.", "Any metal will reduce the oxide of other metals lying ABOVE it on the diagram (e.g. Al reduces Cr₂O₃ in thermite).", "The curve 2C(s) + O₂(g) → 2CO(g) slopes DOWNWARD because ΔS° > 0; above ~983 K, carbon becomes a more powerful reducing agent than CO."],
    example: "At blast furnace temperatures (> 1000 K), line for 2C + O₂ → 2CO lies below Fe/FeO, so C reduces FeO to Fe spontaneously."
  },

  /* Additional Organic Chemistry */
  {
    id: "huckel_aromaticity", branch: "Organic", chapter: "Hydrocarbons & GOC",
    title: "Hückel's Rule of Aromaticity", expr: "Aromatic: (4n + 2) π electrons   |   Anti-Aromatic: 4n π electrons   (n = 0, 1, 2, 3...)",
    keys: ["huckel rule", "aromaticity", "antiaromatic", "cyclooctatetraene"],
    symbols: ["Conditions: 1. Cyclic, 2. Planar, 3. Complete conjugation (delocalised π system), 4. Hückel electron count"],
    notes: ["Aromatic (exceptionally stable): 2 (n=0: cyclopropenyl cation), 6 (n=1: benzene, cyclopentadienyl anion, tropylium cation, pyridine, pyrrole), 10 (n=2: naphthalene, azulene), 14 (n=3: anthracene, phenanthrene).", "Anti-aromatic (exceptionally unstable): 4 (cyclobutadiene), 8 (cyclooctatetraene escapes planarity by adopting a tub shape to become non-aromatic).", "Stability order: Aromatic >> Non-aromatic >> Anti-aromatic."],
    example: "Cyclopentadiene is unusually acidic (pKa ≈ 16) because deprotonation produces the 6 π-electron aromatic cyclopentadienyl anion."
  },
  {
    id: "markovnikov_peroxide", branch: "Organic", chapter: "Hydrocarbons",
    title: "Markovnikov & Anti-Markovnikov (Kharasch Effect)", expr: "Ionic: CH₃CH=CH₂ + HX → CH₃CH(X)CH₃   |   Peroxide (HBr only): CH₃CH=CH₂ + HBr → CH₃CH₂CH₂Br",
    keys: ["markovnikov", "anti markovnikov", "peroxide effect", "kharasch effect"],
    symbols: ["Markovnikov: electrophilic addition via more stable carbocation intermediate (3° > 2° > 1°)", "Anti-Markovnikov (Kharasch): free radical addition via more stable carbon radical (3° > 2° > 1°)"],
    notes: ["The peroxide effect works ONLY with HBr. For HCl, the H–Cl bond is too strong (step 1 endothermic). For HI, I–I formation is preferred over radical addition (step 2 endothermic).", "Carbocation rearrangements (hydride/methyl shifts) can occur in Markovnikov addition but NEVER in free radical addition."],
    example: "3,3-Dimethylbut-1-ene + HBr (no peroxide) gives 2-bromo-2,3-dimethylbutane as major product via carbocation rearrangement."
  },
  {
    id: "saytzeff_hofmann", branch: "Organic", chapter: "Haloalkanes & Elimination",
    title: "Saytzeff vs Hofmann Elimination Regiochemistry", expr: "Saytzeff (Zaitsev): More substituted alkene   |   Hofmann: Less substituted alkene",
    keys: ["saytzeff", "zaitsev", "hofmann elimination", "regiochemistry"],
    symbols: ["Saytzeff: favoured by unhindered bases (alc. KOH, EtO⁻) and good leaving groups (Br⁻, I⁻, OTs⁻)", "Hofmann: favoured by bulky hindered bases (t-BuO⁻K⁺, LDA) OR poor leaving groups (–N⁺Me₃, –S⁺Me₂, –F)"],
    notes: ["Saytzeff product is thermodynamically more stable due to greater hyperconjugation and alkyl substitution.", "Hofmann product forms because bulky base preferentially abstracts the more accessible, less sterically hindered acidic proton."],
    example: "2-Bromobutane + alcoholic KOH → But-2-ene (major, 81%, Saytzeff) + But-1-ene (minor, 19%).\nWith potassium tert-butoxide (t-BuOK), But-1-ene becomes the major product (Hofmann)."
  },
  {
    id: "sn1_sn2_summary", branch: "Organic", chapter: "Haloalkanes and Haloarenes",
    title: "S_N1 vs S_N2 Kinetic Rate Laws & Stereochemistry", expr: "S_N1: Rate = k [R−X] (Racemisation)   |   S_N2: Rate = k [R−X][Nu⁻] (Walden Inversion)",
    keys: ["sn1", "sn2", "nucleophilic substitution", "walden inversion"],
    symbols: ["S_N1: two-step mechanism via planar carbocation; favored by 3° > 2° alkyl halides and polar protic solvents (H₂O, EtOH)", "S_N2: one-step concerted backside attack; favored by methyl > 1° > 2° alkyl halides, polar aprotic solvents (acetone, DMF, DMSO), and strong nucleophiles"],
    notes: ["Neopentyl halide (CH₃)₃C–CH₂–X is 1° but essentially unreactive by S_N2 due to massive steric crowding.", "Allylic and benzylic halides react very rapidly by BOTH S_N1 (resonance-stabilised carbocation) and S_N2 (conjugation in transition state).", "Vinyl and aryl halides (CH₂=CH–Cl, Ph–Cl) are completely inert to both S_N1 and S_N2 under normal conditions."],
    example: "(R)-2-Bromobutane + aqueous NaOH gives racemic butan-2-ol via S_N1; with NaSH in acetone it gives (S)-butan-2-thiol via S_N2."
  },
  {
    id: "distinguishing_tests", branch: "Organic", chapter: "Practical Organic Chemistry",
    title: "Diagnostic Organic Functional Group Tests", expr: "Lucas: 3° (fast), 2° (5 min), 1° (heat)   |   Carbylamine: 1° R-NH₂ + CHCl₃ + KOH → R-NC foul odour",
    keys: ["lucas test", "carbylamine test", "hinsberg test", "tollens test", "iodoform test"],
    symbols: ["Lucas reagent: conc. HCl + anhydrous ZnCl₂ (tests alcohols)", "Hinsberg reagent: C₆H₅SO₂Cl (distinguishes 1°, 2°, 3° amines)", "Tollens reagent: ammoniacal AgNO₃ (silver mirror for aldehydes)", "Iodoform: I₂ + NaOH gives yellow CHI₃ precipitate for CH₃CO– and CH₃CH(OH)– groups"],
    notes: ["Fehling's solution oxidises aliphatic aldehydes but does NOT oxidise benzaldehyde.", "1° amines dissolve in Hinsberg alkali test because N–H proton is acidic; 2° amines form insoluble precipitate without acidic proton; 3° amines do not react."],
    example: "Propan-2-ol gives a positive iodoform test (yellow precipitate of CHI₃, m.p. 119 °C); propan-1-ol does not."
  },
  {
    id: "aldol_cannizzaro", branch: "Organic", chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Aldol & Cannizzaro Reaction Principles", expr: "Aldol (with α-H): Carbonyl + dil. base → β-hydroxy carbonyl → α,β-unsaturated carbonyl   |   Cannizzaro (no α-H): 2 RCHO + 50% KOH → RCH₂OH + RCOOK",
    keys: ["aldol", "cannizzaro", "alpha hydrogen", "disproportionation"],
    symbols: ["Aldol: needs at least one α-hydrogen atom (e.g. CH₃CHO, CH₃COCH₃)", "Cannizzaro: requires NO α-hydrogen (e.g. HCHO, PhCHO, (CH₃)₃CCHO)"],
    notes: ["Cross-Aldol between two different aldehydes with α-H gives a mixture of 4 products.", "Cross-Cannizzaro: HCHO is preferentially oxidised to formate HCOO⁻, reducing the other aldehyde to alcohol.", "Intramolecular aldol of 1,4- and 1,6-diketones forms stable 5-membered rings; 1,5- and 1,7-diketones form 6-membered rings."],
    example: "Benzaldehyde + conc. NaOH → Benzyl alcohol + Sodium benzoate (Cannizzaro disproportionation)."
  },
  {
    id: "clemmensen_wolff", branch: "Organic", chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Carbonyl Reductions to Hydrocarbons", expr: "Clemmensen: >C=O + Zn-Hg / conc. HCl → >CH₂   |   Wolff–Kishner: >C=O + NH₂NH₂ / KOH / glycol → >CH₂",
    keys: ["clemmensen", "wolff kishner", "carbonyl reduction"],
    symbols: ["Clemmensen: acidic condition; ideal for base-sensitive compounds", "Wolff–Kishner: basic condition; ideal for acid-sensitive compounds"],
    notes: ["Avoid Clemmensen if molecule contains acid-sensitive groups (–OH, –OR, C=C).", "Avoid Wolff–Kishner if molecule contains base-sensitive groups (halides, esters).", "Mozingo reduction: >C=O + HS(CH₂)₂SH / Raney Ni (neutral condition)."],
    example: "Acetophenone PhCOCH₃ + Zn-Hg/conc. HCl → Ethylbenzene PhCH₂CH₃."
  },
  {
    id: "diazotisation_sandmeyer", branch: "Organic", chapter: "Amines & Diazonium Salts",
    title: "Diazotisation & Sandmeyer Reactions", expr: "Ar–NH₂ + NaNO₂ + 2HCl (0–5 °C) → Ar–N₂⁺ Cl⁻   =>   Sandmeyer: CuCl/CuBr/CuCN → Ar–Cl/Ar–Br/Ar–CN",
    keys: ["diazotisation", "sandmeyer", "diazonium salt", "gattermann"],
    symbols: ["Ar: aromatic ring", "In situ nitrous acid generation: NaNO₂ + HCl → HNO₂ + NaCl (temperature maintained at 273–278 K)"],
    notes: ["Gattermann reaction uses Cu powder/HX instead of CuX.", "KI directly gives Ar–I without copper catalyst.", "HBF₄ followed by heating gives Ar–F (Balz–Schiemann reaction).", "H₃PO₂ (hypophosphorous acid) or ethanol reduces Ar–N₂⁺ to arene Ar–H."],
    example: "Aniline diazotised at 0–5 °C followed by CuCN/KCN yields benzonitrile Ph–CN."
  }
];

// Merge uniquely by id
const combined = [...existingFormulas];
for (const f of additionalFormulas) {
  const idx = combined.findIndex(x => x.id === f.id);
  if (idx >= 0) combined[idx] = f;
  else combined.push(f);
}

// Write back to data.js
global.window.NEMO_DATA.formulas = combined;

const newFileContent = `/* Nemo content: practice questions, formula bank and offline answers.
   All practice questions are ORIGINAL study questions written for this app. They are not official
   JEE/CBSE previous-year questions and carry no year/paper metadata. */
window.NEMO_DATA = {
  /* ---------------- Practice questions ---------------- */
  quiz: ${JSON.stringify(global.window.NEMO_DATA.quiz, null, 2)},

  /* ---------------- Formula bank (Comprehensive CBSE & JEE Compendium) ---------------- */
  formulas: ${JSON.stringify(global.window.NEMO_DATA.formulas, null, 2)},

  /* ---------------- Offline answers ----------------
     Used when no AI endpoint is configured. \`match\` is a regular expression source, tested against the question. */
  topics: ${JSON.stringify(global.window.NEMO_DATA.topics, null, 2)}
};
`;

fs.writeFileSync(dataPath, newFileContent, "utf8");
console.log("Successfully updated data.js! Total formulas now:", combined.length);
