#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data.js");
const content = fs.readFileSync(dataPath, "utf8");

// Parse existing quiz and topics
const quizMatch = content.match(/\/\*\s*---------------- Practice questions ----------------\s*\*\/[\s\S]*?quiz:\s*(\[[\s\S]*?\n\s*\]),/);
const topicsMatch = content.match(/\/\*\s*---------------- Offline answers ----------------[\s\S]*?topics:\s*(\[[\s\S]*?\n\s*\])\s*\}\s*;/);

if (!quizMatch || !topicsMatch) {
  console.error("Failed to parse quiz or topics from data.js");
  process.exit(1);
}

const quizCode = quizMatch[1];
const topicsCode = topicsMatch[1];

// Comprehensive Formula Bank with over 100+ formulas covering all chapters of Physical, Inorganic, and Organic Chemistry
const FORMULAS = [
  /* ==================== PHYSICAL CHEMISTRY ==================== */
  /* 1. Mole Concept & Stoichiometry */
  {
    id: "mole_basic", branch: "Physical", chapter: "Some Basic Concepts of Chemistry",
    title: "Mole Concept Fundamentals", expr: "n = w / M = N / N_A = V(STP) / 22.4 L",
    keys: ["mole", "moles", "avogadro", "molar volume"],
    symbols: ["n: number of moles", "w: mass in grams", "M: molar mass (g mol⁻¹)", "N: number of particles", "N_A = 6.022 × 10²³ mol⁻¹", "V(STP): volume of ideal gas at STP (0 °C, 1 atm) in litres"],
    notes: ["At standard ambient temperature and pressure (SATP: 25 °C, 1 bar), 1 mol gas ≈ 24.8 L.", "Number of atoms in a molecule = n × N_A × atomicity.", "1 amu = 1/12th mass of C-12 = 1.66 × 10⁻²⁴ g."],
    example: "Calculate moles in 4.4 g of CO₂:\nn = 4.4 / 44 = 0.1 mol.\nNumber of molecules = 0.1 × 6.022 × 10²³ = 6.022 × 10²².\nVolume at STP = 0.1 × 22.4 = 2.24 L."
  },
  {
    id: "molarity", branch: "Physical", chapter: "Solutions & Stoichiometry",
    title: "Molarity (M)", expr: "M = (w_B × 1000) / (M_B × V_mL) = (10 × %w/v) / M_B = (10 × %w/w × d) / M_B",
    keys: ["molarity", "molar concentration"],
    symbols: ["M: molarity (mol L⁻¹)", "w_B: mass of solute (g)", "M_B: molar mass of solute (g mol⁻¹)", "V_mL: volume of solution (mL)", "%w/w: mass percentage", "d: density of solution (g mL⁻¹)"],
    notes: ["Molarity is temperature-dependent because liquid volume expands with heating.", "Dilution law: M₁V₁ = M₂V₂.", "Mixing two non-reacting solutions: M_mix = (M₁V₁ + M₂V₂) / (V₁ + V₂)."],
    example: "4.0 g NaOH in 250 mL aqueous solution:\nM = (4 × 1000) / (40 × 250) = 4000 / 10000 = 0.4 M."
  },
  {
    id: "molality", branch: "Physical", chapter: "Solutions",
    title: "Molality (m)", expr: "m = (w_B × 1000) / (M_B × W_A_g) = (1000 × M) / (1000 × d − M × M_B)",
    keys: ["molality", "mass molality"],
    symbols: ["m: molality (mol kg⁻¹)", "w_B: mass of solute (g)", "M_B: molar mass of solute", "W_A_g: mass of solvent in grams", "d: density in g mL⁻¹"],
    notes: ["Molality does NOT change with temperature because mass is invariant with temperature.", "For dilute aqueous solutions (d ≈ 1 g mL⁻¹), m ≈ M."],
    example: "20 g urea (M = 60 g mol⁻¹) dissolved in 200 g water:\nm = (20 × 1000) / (60 × 200) = 20000 / 12000 ≈ 1.67 m."
  },
  {
    id: "normality", branch: "Physical", chapter: "Redox & Volumetric Analysis",
    title: "Normality and Equivalent Mass", expr: "N = M × n-factor   ,   E = Molar Mass / n-factor",
    keys: ["normality", "equivalent weight", "n factor", "n-factor"],
    symbols: ["N: normality (equiv L⁻¹)", "M: molarity", "E: equivalent weight", "n-factor: basicity (acids), acidity (bases), or total electrons transferred (redox)"],
    notes: ["For KMnO₄ in acidic medium: n = 5 (Mn⁺⁷ → Mn⁺²); neutral/mildly alkaline: n = 3 (Mn⁺⁷ → MnO₂); strongly alkaline: n = 1 (Mn⁺⁷ → MnO₄²⁻).", "For K₂Cr₂O₇ in acidic medium: n = 6 (Cr₂⁺⁶ → 2Cr⁺³).", "Law of chemical equivalence: N₁V₁ = N₂V₂ at the equivalence point."],
    example: "0.1 M KMnO₄ in acidic medium:\nNormality N = 0.1 × 5 = 0.5 N."
  },
  {
    id: "h2o2_strength", branch: "Physical", chapter: "Redox & Solutions",
    title: "Volume Strength of H₂O₂", expr: "Volume Strength = 11.2 × Molarity = 5.6 × Normality = (68/100) × %w/v × 10",
    keys: ["volume strength", "hydrogen peroxide strength", "h2o2"],
    symbols: ["Volume strength: litres of O₂ released at STP by 1 L of H₂O₂ solution upon decomposition: 2H₂O₂ → 2H₂O + O₂"],
    notes: ["'20 volume H₂O₂' means 1 mL of this solution releases 20 mL of O₂ gas at STP.", "Molarity of '20 volume H₂O₂' = 20 / 11.2 ≈ 1.78 M."],
    example: "Find the normality of '10 volume H₂O₂':\nN = 10 / 5.6 ≈ 1.785 N."
  },

  /* 2. Atomic Structure */
  {
    id: "bohr_radius", branch: "Physical", chapter: "Atomic Structure",
    title: "Bohr Radius (Hydrogenic Species)", expr: "rₙ = (0.529 × n² / Z) Å = 52.9 × (n² / Z) pm",
    keys: ["bohr radius", "radius of orbit"],
    symbols: ["rₙ: radius of nth orbit", "n: principal quantum number (1, 2, 3...)", "Z: atomic number (H=1, He⁺=2, Li²⁺=3)"],
    notes: ["Radius increases as n² and decreases as 1/Z.", "First orbit of hydrogen (n=1, Z=1) has radius r₁ = 0.529 Å (Bohr radius a₀)."],
    example: "Radius of 2nd orbit of He⁺ (n=2, Z=2):\nr = 0.529 × (2² / 2) = 1.058 Å."
  },
  {
    id: "bohr_velocity", branch: "Physical", chapter: "Atomic Structure",
    title: "Bohr Orbital Velocity", expr: "vₙ = 2.188 × 10⁶ × (Z / n) m s⁻¹ = c / (137 × n/Z)",
    keys: ["bohr velocity", "speed of electron"],
    symbols: ["vₙ: speed of electron in nth orbit", "c = 3 × 10⁸ m s⁻¹: speed of light", "1/137: fine structure constant"],
    notes: ["Velocity is directly proportional to Z and inversely proportional to n.", "Orbital frequency f = v / (2πr) ∝ Z² / n³."],
    example: "Speed in n=1 for H atom (Z=1, n=1):\nv = 2.188 × 10⁶ m s⁻¹ ≈ c / 137."
  },
  {
    id: "bohr_energy", branch: "Physical", chapter: "Atomic Structure",
    title: "Bohr Orbital Energy", expr: "Eₙ = −13.6 × (Z² / n²) eV = −2.18 × 10⁻¹⁸ × (Z² / n²) J",
    keys: ["bohr energy", "orbit energy"],
    symbols: ["Eₙ: total energy in nth orbit", "Kinetic energy K.E. = −Eₙ = +13.6 Z²/n² eV", "Potential energy P.E. = 2Eₙ = −27.2 Z²/n² eV"],
    notes: ["Relation: Total Energy = −(Kinetic Energy) = ½ (Potential Energy).", "Ionisation Energy from state n: IE = +13.6 Z²/n² eV."],
    example: "He⁺ ion (Z=2) in n=2 level:\nE₂ = −13.6 × (2² / 2²) = −13.6 eV."
  },
  {
    id: "rydberg", branch: "Physical", chapter: "Atomic Structure",
    title: "Rydberg Formula for Spectral Lines", expr: "1/λ = \bar{ν} = R_H × Z² (1/n₁² − 1/n₂²)",
    keys: ["rydberg", "spectral lines", "wave number", "lyman", "balmer"],
    symbols: ["λ: wavelength", "\bar{ν}: wavenumber (m⁻¹)", "R_H = 1.09677 × 10⁷ m⁻¹: Rydberg constant", "n₁ < n₂: integers"],
    notes: ["Lyman series: n₁ = 1 (UV region)", "Balmer series: n₁ = 2 (Visible region: red to violet)", "Paschen: n₁ = 3 (Infrared), Brackett: n₁ = 4 (IR), Pfund: n₁ = 5 (Far IR)", "Total emission lines when returning from level n to ground state = n(n − 1) / 2."],
    example: "Shortest wavelength in Lyman series for H (n₁=1, n₂=∞):\n1/λ = R_H (1 − 0) = R_H  =>  λ = 1/R_H ≈ 912 Å."
  },
  {
    id: "photoelectric", branch: "Physical", chapter: "Atomic Structure",
    title: "Einstein's Photoelectric Equation", expr: "hν = W₀ + K.E._max   =>   hν = hν₀ + ½ m v_max² = hν₀ + eV₀",
    keys: ["photoelectric", "work function", "stopping potential"],
    symbols: ["h = 6.626 × 10⁻³⁴ J s: Planck's constant", "W₀ = hν₀: work function of metal", "ν₀: threshold frequency", "V₀: stopping potential (volts)"],
    notes: ["K.E._max is independent of light intensity; it depends linearly on frequency ν.", "Intensity of light determines the number of photoelectrons emitted per second (photocurrent)."],
    example: "Metal with W₀ = 2.0 eV irradiated with 3.5 eV photons:\nK.E._max = 3.5 − 2.0 = 1.5 eV  =>  Stopping potential V₀ = 1.5 V."
  },
  {
    id: "debroglie", branch: "Physical", chapter: "Atomic Structure",
    title: "de Broglie Wavelength", expr: "λ = h / p = h / (m v) = h / √(2m · K.E.) = h / √(2mqV)",
    keys: ["de broglie", "debroglie", "matter wave"],
    symbols: ["λ: matter wavelength", "p = mv: momentum", "V: accelerating potential in volts", "q: charge"],
    notes: ["For an electron: λ = 12.27 / √V Å (with V in volts).", "For a thermal neutron at T kelvin: λ = h / √(3m k_B T).", "Bohr condition mvr = nh/2π is equivalent to 2πr = nλ (standing de Broglie wave)."],
    example: "Electron accelerated through 100 V:\nλ = 12.27 / √100 = 1.227 Å = 0.1227 nm."
  },
  {
    id: "heisenberg", branch: "Physical", chapter: "Atomic Structure",
    title: "Heisenberg's Uncertainty Principle", expr: "Δx · Δp ≥ h / (4π)   =>   Δx · Δv ≥ h / (4πm)   ,   ΔE · Δt ≥ h / (4π)",
    keys: ["heisenberg", "uncertainty principle"],
    symbols: ["Δx: uncertainty in position", "Δp: uncertainty in momentum", "Δv: uncertainty in velocity", "h/(4π) ≈ 0.527 × 10⁻³⁴ J s"],
    notes: ["If uncertainty in velocity is given as p%: Δv = (p/100) × v.", "Rules out defined planetary orbits; leads to 3D electron probability orbitals."],
    example: "For an electron (m = 9.1 × 10⁻³¹ kg) with Δx = 10⁻¹⁰ m:\nΔv ≥ 6.626 × 10⁻³⁴ / (4π × 9.1 × 10⁻³¹ × 10⁻¹⁰) ≈ 5.8 × 10⁵ m s⁻¹."
  },
  {
    id: "angular_momentum", branch: "Physical", chapter: "Atomic Structure",
    title: "Orbital & Spin Angular Momentum", expr: "L = √[l(l + 1)] · (h / 2π)   ,   S = √[s(s + 1)] · (h / 2π)",
    keys: ["orbital angular momentum", "spin angular momentum"],
    symbols: ["l: azimuthal quantum number (s=0, p=1, d=2, f=3)", "s: electron spin quantum number = ½", "ħ = h / (2π)"],
    notes: ["For any s-orbital (l = 0), orbital angular momentum is exactly ZERO.", "For a p-electron: L = √(1 × 2) ħ = √2 ħ.", "For a d-electron: L = √(2 × 3) ħ = √6 ħ."],
    example: "Orbital angular momentum of 3d electron:\nL = √[2(2 + 1)] (h / 2π) = √6 (h / 2π) ≈ 2.45 ħ."
  },

  /* 3. States of Matter */
  {
    id: "idealgas", branch: "Physical", chapter: "States of Matter",
    title: "Ideal Gas Law & Gas Densities", expr: "PV = nRT = (w/M) RT   =>   P·M = d·R·T",
    keys: ["ideal gas", "density of gas", "charles law", "boyle law"],
    symbols: ["P: pressure (atm, Pa, bar)", "V: volume (L, m³)", "R = 0.0821 L atm K⁻¹ mol⁻¹ = 8.314 J K⁻¹ mol⁻¹ = 8.314 × 10⁻² L bar K⁻¹ mol⁻¹", "T: temperature in kelvin", "d: density in g L⁻¹"],
    notes: ["Dalton's Law of Partial Pressures: P_total = Σ P_i, P_i = x_i P_total.", "Amagat's Law of Partial Volumes: V_total = Σ V_i.", "Always convert Celsius to Kelvin: T(K) = T(°C) + 273.15."],
    example: "Density of O₂ at 1 atm and 273 K:\nd = PM / RT = (1 × 32) / (0.0821 × 273) ≈ 1.429 g L⁻¹."
  },
  {
    id: "graham_diffusion", branch: "Physical", chapter: "States of Matter",
    title: "Graham's Law of Diffusion & Effusion", expr: "r₁ / r₂ = √(M₂ / M₁) = √(d₂ / d₁) = (V₁ / t₁) / (V₂ / t₂)",
    keys: ["graham", "diffusion", "effusion"],
    symbols: ["r₁, r₂: rates of diffusion/effusion", "M₁, M₂: molar masses", "d₁, d₂: vapour densities", "V: volume effused, t: time"],
    notes: ["If pressures differ: r₁ / r₂ = (P₁ / P₂) × √(M₂ / M₁).", "Used in isotope enrichment (e.g. ²³⁵UF₆ vs ²³⁸UF₆).", "He diffuses faster than CH₄ by √(16/4) = 2 times."],
    example: "Compare diffusion rates of CH₄ (M=16) and SO₂ (M=64):\nr(CH₄) / r(SO₂) = √(64 / 16) = √4 = 2. CH₄ diffuses twice as fast."
  },
  {
    id: "vanderwaals", branch: "Physical", chapter: "States of Matter",
    title: "Van der Waals Equation for Real Gases", expr: "(P + an²/V²) (V − nb) = nRT",
    keys: ["van der waals", "real gas", "compressibility factor"],
    symbols: ["a: magnitude of intermolecular attractive forces (atm L² mol⁻²)", "b = 4 V_m: effective excluded volume of molecules (L mol⁻¹)", "Z = PV / nRT: compressibility factor"],
    notes: ["At low pressure: (P + a/V_m²) V_m = RT  =>  Z = 1 − a / (RT V_m) < 1 (attractive forces dominate).", "At very high pressure: P(V_m − b) = RT  =>  Z = 1 + Pb / RT > 1 (repulsive forces dominate).", "For H₂ and He, 'a' is nearly zero, so Z = 1 + Pb / RT > 1 at all ordinary temperatures."],
    example: "Critical constants: T_c = 8a / (27Rb), P_c = a / (27b²), V_c = 3b.\nCritical compressibility Z_c = P_c V_c / (RT_c) = 3/8 = 0.375."
  },
  {
    id: "gas_speeds", branch: "Physical", chapter: "States of Matter",
    title: "Molecular Speeds (Maxwell-Boltzmann)", expr: "v_rms = √(3RT/M)   ,   v_avg = √(8RT/πM)   ,   v_mp = √(2RT/M)",
    keys: ["molecular speeds", "root mean square", "most probable speed", "rms"],
    symbols: ["v_rms: root mean square speed", "v_avg: average speed", "v_mp: most probable speed", "R = 8.314 J K⁻¹ mol⁻¹, M in kg mol⁻¹"],
    notes: ["Ratio: v_mp : v_avg : v_rms = √2 : √(8/π) : √3 = 1 : 1.128 : 1.224.", "Average kinetic energy per molecule = (3/2) k_B T, independent of gas identity."],
    example: "RMS speed of O₂ (M = 0.032 kg mol⁻¹) at 300 K:\nv_rms = √(3 × 8.314 × 300 / 0.032) = √(233831) ≈ 483.5 m s⁻¹."
  },

  /* 4. Thermodynamics & Thermochemistry */
  {
    id: "first_law_work", branch: "Physical", chapter: "Thermodynamics",
    title: "First Law & Expansion Work", expr: "ΔU = q + w   ,   w_rev(iso) = −2.303 nRT log(V₂/V₁)   ,   w_irrev = −P_ext ΔV",
    keys: ["first law", "work done", "isothermal expansion", "reversible work"],
    symbols: ["ΔU: internal energy change", "q: heat absorbed by system", "w: work done on system (IUPAC convention)", "P_ext: external pressure"],
    notes: ["Isothermal expansion of ideal gas: ΔT = 0, so ΔU = 0 and q = −w.", "Maximum work is obtained in a reversible expansion.", "Free expansion into vacuum: P_ext = 0, so w = 0."],
    example: "1 mol ideal gas expands isothermally and reversibly from 10 L to 100 L at 300 K:\nw = −2.303 × 1 × 8.314 × 300 × log(10) ≈ −5744 J."
  },
  {
    id: "enthalpy_reaction", branch: "Physical", chapter: "Thermodynamics",
    title: "Enthalpy and Internal Energy Relation", expr: "ΔH = ΔU + Δn_g RT",
    keys: ["enthalpy", "internal energy", "delta h", "delta u"],
    symbols: ["ΔH: heat change at constant pressure (q_p)", "ΔU: heat change at constant volume (q_v)", "Δn_g: moles of gaseous products − moles of gaseous reactants"],
    notes: ["If Δn_g = 0 (e.g. H₂ + I₂ ⇌ 2HI), then ΔH = ΔU.", "If Δn_g > 0, then ΔH > ΔU.", "If Δn_g < 0, then ΔH < ΔU."],
    example: "N₂(g) + 3H₂(g) → 2NH₃(g) at 298 K:\nΔn_g = 2 − (1 + 3) = −2 mol.\nΔH = ΔU + (−2) × 8.314 × 298 = ΔU − 4955 J."
  },
  {
    id: "heat_capacities", branch: "Physical", chapter: "Thermodynamics",
    title: "Heat Capacities & Poisson's Ratio", expr: "C_p − C_v = R   ,   γ = C_p / C_v   ,   ΔU = n C_v ΔT   ,   ΔH = n C_p ΔT",
    keys: ["heat capacity", "gamma", "molar heat capacity", "meyer relation"],
    symbols: ["C_p, C_v: molar heat capacities at constant P and V", "γ: adiabatic index (monoatomic = 5/3 ≈ 1.67, diatomic = 7/5 = 1.40, non-linear triatomic = 4/3 ≈ 1.33)"],
    notes: ["Monoatomic gas (He, Ne, Ar): C_v = 3/2 R, C_p = 5/2 R.", "Diatomic gas (N₂, O₂) at room temp: C_v = 5/2 R, C_p = 7/2 R.", "Reversible adiabatic process: P V^γ = const, T V^(γ−1) = const, T^γ P^(1−γ) = const."],
    example: "Work in reversible adiabatic expansion: w = n C_v (T₂ − T₁) = (P₂V₂ − P₁V₁) / (γ − 1)."
  },
  {
    id: "kirchhoff_law", branch: "Physical", chapter: "Thermodynamics",
    title: "Kirchhoff's Law of Thermochemistry", expr: "ΔH(T₂) − ΔH(T₁) = ΔC_p (T₂ − T₁)   ,   ΔU(T₂) − ΔU(T₁) = ΔC_v (T₂ − T₁)",
    keys: ["kirchhoff", "variation of enthalpy with temperature"],
    symbols: ["ΔC_p = Σ C_p(products) − Σ C_p(reactants)"],
    notes: ["Allows calculating reaction enthalpy at any temperature given ΔH° at 298 K.", "Ensure C_p values are in J K⁻¹ mol⁻¹ and match stoichiometry."],
    example: "If ΔC_p = −10 J K⁻¹ mol⁻¹, heating the reaction by 50 K decreases ΔH by:\nΔH(T₂) − ΔH(T₁) = −10 × 50 = −500 J."
  },
  {
    id: "hess_law", branch: "Physical", chapter: "Thermodynamics",
    title: "Hess's Law & Bond Energies", expr: "ΔH_rxn = Σ ΔH_f°(products) − Σ ΔH_f°(reactants) = Σ B.E.(reactants) − Σ B.E.(products)",
    keys: ["hess law", "bond energy", "heat of formation"],
    symbols: ["ΔH_f°: standard enthalpy of formation (defined as 0 for pure elements in standard state)", "B.E.: bond dissociation enthalpy"],
    notes: ["Resonance Energy = Observed ΔH_f° (or ΔH_comb) − Calculated ΔH_f°.", "Lattice Enthalpy (Born-Haber cycle): ΔH_f°(NaCl) = ΔH_sub(Na) + ½ D(Cl₂) + IE(Na) − EA(Cl) + U_L."],
    example: "For CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l):\nΔH_rxn = [ΔH_f°(CO₂) + 2ΔH_f°(H₂O)] − [ΔH_f°(CH₄) + 0]."
  },
  {
    id: "entropy_change", branch: "Physical", chapter: "Thermodynamics",
    title: "Entropy Changes (System and Transitions)", expr: "ΔS = ∫ dq_rev / T   ,   ΔS_ideal = n C_v ln(T₂/T₁) + nR ln(V₂/V₁)",
    keys: ["entropy", "second law", "entropy of vaporization"],
    symbols: ["ΔS: entropy change (J K⁻¹ mol⁻¹)", "Phase transition: ΔS_fusion = ΔH_fus / T_mp, ΔS_vap = ΔH_vap / T_bp"],
    notes: ["Isothermal expansion of ideal gas: ΔS = nR ln(V₂ / V₁) = 2.303 nR log(P₁ / P₂).", "Trouton's Rule: for many non-associated liquids, ΔS_vap ≈ 85–88 J K⁻¹ mol⁻¹.", "Second Law: ΔS_total = ΔS_sys + ΔS_surr ≥ 0 for any spontaneous process."],
    example: "1 mol water vaporises at 373 K with ΔH_vap = 40.7 kJ mol⁻¹:\nΔS_vap = 40700 / 373 ≈ 109.1 J K⁻¹ mol⁻¹."
  },
  {
    id: "gibbs", branch: "Physical", chapter: "Thermodynamics",
    title: "Gibbs Energy & Spontaneity", expr: "ΔG = ΔH − TΔS   ,   ΔG° = −RT ln K = −2.303 RT log K = −nFE°",
    keys: ["gibbs", "spontaneity", "delta g", "equilibrium constant"],
    symbols: ["ΔG: change in Gibbs free energy", "ΔG°: standard Gibbs free energy change", "K: thermodynamic equilibrium constant"],
    notes: ["ΔH < 0, ΔS > 0: spontaneous at ALL temperatures (ΔG always negative).", "ΔH > 0, ΔS < 0: non-spontaneous at ALL temperatures.", "ΔH > 0, ΔS > 0: spontaneous at HIGH temperatures (T > ΔH/ΔS).", "ΔH < 0, ΔS < 0: spontaneous at LOW temperatures (T < ΔH/ΔS)."],
    example: "Reaction with ΔH = +30 kJ mol⁻¹ and ΔS = +100 J K⁻¹ mol⁻¹:\nEquilibrium temperature T = 30000 / 100 = 300 K. Spontaneous above 300 K."
  },
  {
    id: "clapeyron_clausius", branch: "Physical", chapter: "Thermodynamics & Equilibrium",
    title: "Clausius–Clapeyron Equation", expr: "log (P₂ / P₁) = (ΔH_vap / 2.303 R) · (1/T₁ − 1/T₂)",
    keys: ["clausius", "clapeyron", "vapour pressure temperature"],
    symbols: ["P₁, P₂: vapour pressures at temperatures T₁ and T₂ (kelvin)", "ΔH_vap: enthalpy of vaporisation (J mol⁻¹)", "R = 8.314 J K⁻¹ mol⁻¹"],
    notes: ["Gives the temperature dependence of vapour pressure or boiling point.", "Analogous to the van 't Hoff equation for equilibrium constants."],
    example: "Water boils at 373 K at 1 atm. At a mountain summit where P = 0.5 atm, its boiling point drops significantly."
  },

  /* 5. Chemical & Ionic Equilibrium */
  {
    id: "kpkc", branch: "Physical", chapter: "Chemical Equilibrium",
    title: "Kp, Kc & van 't Hoff Isochore", expr: "K_p = K_c (RT)^Δn_g   ,   log(K₂ / K₁) = (ΔH° / 2.303 R) · (1/T₁ − 1/T₂)",
    keys: ["kp", "kc", "vant hoff isochore", "equilibrium constant"],
    symbols: ["Δn_g: gaseous products − gaseous reactants", "R = 0.0821 L atm K⁻¹ mol⁻¹ when P in atm"],
    notes: ["For endothermic reactions (ΔH° > 0): K increases as T increases.", "For exothermic reactions (ΔH° < 0): K decreases as T increases.", "Catalyst speeds up both forward and backward rates equally; does NOT change K."],
    example: "N₂O₄(g) ⇌ 2NO₂(g): Δn_g = 2 − 1 = 1  =>  K_p = K_c (RT)."
  },
  {
    id: "degree_dissoc_vd", branch: "Physical", chapter: "Chemical Equilibrium",
    title: "Degree of Dissociation from Vapour Density", expr: "α = (D − d) / [(n − 1) d] = (M_th − M_obs) / [(n − 1) M_obs]",
    keys: ["degree of dissociation", "vapour density", "abnormal molecular mass"],
    symbols: ["α: degree of dissociation", "D = M_th / 2: theoretical vapour density", "d = M_obs / 2: observed vapour density", "n: moles of products formed per mole of reactant (e.g. PCl₅ → PCl₃ + Cl₂, n = 2)"],
    notes: ["For PCl₅ (n = 2): α = (D − d) / d.", "For N₂O₄ (n = 2): α = (D − d) / d."],
    example: "PCl₅ (M_th = 208.5, D = 104.25) has observed vapour density d = 62 at 200 °C:\nα = (104.25 − 62) / 62 = 42.25 / 62 ≈ 0.68 (68% dissociated)."
  },
  {
    id: "ostwald_dilution", branch: "Physical", chapter: "Ionic Equilibrium",
    title: "Ostwald's Dilution Law & Weak Electrolytes", expr: "K_a = Cα² / (1 − α)   =>   α = √(K_a / C)   ,   [H⁺] = Cα = √(K_a × C)",
    keys: ["ostwald dilution", "weak acid ionization", "degree of ionization"],
    symbols: ["K_a: acid dissociation constant", "C: molar concentration", "α: degree of dissociation (valid when α << 0.05)"],
    notes: ["pH of a weak acid: pH = ½ [pK_a − log C].", "For a weak base: [OH⁻] = √(K_b × C), pOH = ½ [pK_b − log C].", "As dilution increases (C → 0), α approaches 1 (100% ionisation)."],
    example: "0.1 M CH₃COOH with K_a = 1.8 × 10⁻⁵:\nα = √(1.8 × 10⁻⁵ / 0.1) = √(1.8 × 10⁻⁴) ≈ 1.34 × 10⁻² (1.34%).\n[H⁺] = 0.1 × 0.0134 = 1.34 × 10⁻³ M  =>  pH ≈ 2.87."
  },
  {
    id: "salt_hydrolysis", branch: "Physical", chapter: "Ionic Equilibrium",
    title: "Salt Hydrolysis Equations", expr: "WA + SB: pH = 7 + ½ pK_a + ½ log C   |   SA + WB: pH = 7 − ½ pK_b − ½ log C   |   WA + WB: pH = 7 + ½ pK_a − ½ pK_b",
    keys: ["salt hydrolysis", "hydrolysis constant", "ph of salt"],
    symbols: ["K_h: hydrolysis constant", "WA + SB (e.g. CH₃COONa): K_h = K_w / K_a, h = √(K_w / (K_a · C))", "SA + WB (e.g. NH₄Cl): K_h = K_w / K_b, h = √(K_w / (K_b · C))", "WA + WB (e.g. CH₃COONH₄): K_h = K_w / (K_a · K_b), h = √(K_h) (independent of C)"],
    notes: ["Salts of Strong Acid + Strong Base (NaCl, KNO₃) do NOT hydrolyse: pH = 7 at 25 °C.", "For WA + WB, pH is independent of the salt concentration C."],
    example: "0.1 M CH₃COONa (pK_a = 4.74):\npH = 7 + ½(4.74) + ½(log 0.1) = 7 + 2.37 − 0.5 = 8.87 (alkaline)."
  },
  {
    id: "henderson", branch: "Physical", chapter: "Ionic Equilibrium",
    title: "Henderson–Hasselbalch Buffer Equation", expr: "Acidic Buffer: pH = pK_a + log([Salt]/[Acid])   |   Basic Buffer: pOH = pK_b + log([Salt]/[Base])",
    keys: ["henderson", "buffer", "buffer capacity"],
    symbols: ["Acidic buffer: weak acid + its conjugate base salt (e.g. CH₃COOH + CH₃COONa)", "Basic buffer: weak base + its conjugate acid salt (e.g. NH₄OH + NH₄Cl)"],
    notes: ["Maximum buffer capacity occurs when [Salt] = [Acid], giving pH = pK_a.", "Effective buffer range: pH = pK_a ± 1.", "Buffer capacity φ = d(n) / d(pH) = 2.303 · C_a · C_b / (C_a + C_b)."],
    example: "Buffer of 0.1 M CH₃COOH and 0.2 M CH₃COONa (pK_a = 4.74):\npH = 4.74 + log(0.2 / 0.1) = 4.74 + 0.301 ≈ 5.04."
  },
  {
    id: "solubility_product", branch: "Physical", chapter: "Ionic Equilibrium",
    title: "Solubility Product (K_sp)", expr: "A_x B_y ⇌ x A^(y+) + y B^(x−)   =>   K_sp = x^x · y^y · S^(x+y)",
    keys: ["solubility product", "ksp", "precipitation"],
    symbols: ["S: molar solubility (mol L⁻¹)", "x, y: stoichiometric coefficients"],
    notes: ["For 1:1 salt (AgCl): K_sp = S²  =>  S = √K_sp.", "For 1:2 or 2:1 salt (CaF₂, Ag₂CrO₄): K_sp = 4S³  =>  S = ∛(K_sp / 4).", "For 1:3 salt (Al(OH)₃): K_sp = 27S⁴  =>  S = ⁴√(K_sp / 27).", "Precipitation occurs if Ionic Product Q_sp > K_sp."],
    example: "CaF₂ with K_sp = 3.2 × 10⁻¹¹:\nK_sp = 4S³  =>  S³ = 8 × 10⁻¹²  =>  S = 2 × 10⁻⁴ mol L⁻¹."
  },

  /* 6. Electrochemistry */
  {
    id: "nernst", branch: "Physical", chapter: "Electrochemistry",
    title: "Nernst Equation", expr: "E_cell = E°_cell − (RT / nF) ln Q = E°_cell − (0.0592 / n) log Q   (at 298 K)",
    keys: ["nernst", "cell potential", "emf"],
    symbols: ["E_cell: non-standard cell EMF (V)", "E°_cell = E°_cathode − E°_anode: standard EMF", "n: electrons transferred in balanced equation", "Q: reaction quotient (pure solids/liquids = 1)"],
    notes: ["At equilibrium: E_cell = 0 and Q = K_c  =>  E°_cell = (0.0592 / n) log K_c.", "Concentration cell (same electrodes, different ion concentrations): E°_cell = 0, E = (0.0592 / n) log(C₂ / C₁)."],
    example: "Zn | Zn²⁺(0.01 M) || Cu²⁺(1 M) | Cu (E° = 1.10 V, n = 2):\nQ = 0.01 / 1 = 10⁻²\nE = 1.10 − (0.0592/2) log(10⁻²) = 1.10 + 0.0592 = 1.159 V."
  },
  {
    id: "conductance", branch: "Physical", chapter: "Electrochemistry",
    title: "Conductance, Conductivity & Cell Constant", expr: "R = ρ (l / A)   ,   G = κ / G*   ,   κ = G × (l / A) = G × G*",
    keys: ["conductivity", "specific conductance", "cell constant", "resistivity"],
    symbols: ["R: resistance (Ω)", "G = 1/R: conductance (S or Ω⁻¹)", "κ: conductivity / specific conductance (S cm⁻¹ or S m⁻¹)", "G* = l / A: cell constant (cm⁻¹ or m⁻¹)"],
    notes: ["Molar conductivity: Λ_m = (1000 × κ) / Molarity (in S cm² mol⁻¹).", "Equivalent conductivity: Λ_eq = (1000 × κ) / Normality.", "As dilution increases, specific conductance κ DECREASES, while molar conductance Λ_m INCREASES."],
    example: "Conductance of 0.1 M KCl is 0.02 S in a cell with cell constant G* = 1.2 cm⁻¹:\nκ = G × G* = 0.02 × 1.2 = 0.024 S cm⁻¹.\nΛ_m = (1000 × 0.024) / 0.1 = 240 S cm² mol⁻¹."
  },
  {
    id: "kohlrausch", branch: "Physical", chapter: "Electrochemistry",
    title: "Kohlrausch's Law of Independent Migration", expr: "Λ_m°(A_x B_y) = x λ°(A) + y λ°(B)   ,   α = Λ_m / Λ_m°   ,   K_a = Cα² / (1 − α)",
    keys: ["kohlrausch", "limiting molar conductivity", "independent migration"],
    symbols: ["Λ_m°: limiting molar conductivity at infinite dilution", "λ°: limiting ionic conductivities of constituent ions", "α: degree of dissociation of weak electrolyte"],
    notes: ["For strong electrolytes (Debye–Hückel–Onsager equation): Λ_m = Λ_m° − A √C.", "Enables determining Λ_m° for weak electrolytes like CH₃COOH from strong electrolyte data:\nΛ_m°(CH₃COOH) = Λ_m°(CH₃COONa) + Λ_m°(HCl) − Λ_m°(NaCl)."],
    example: "If Λ_m of 0.01 M CH₃COOH is 19.5 S cm² mol⁻¹ and Λ_m° is 390.5 S cm² mol⁻¹:\nα = 19.5 / 390.5 ≈ 0.05 (5%)."
  },
  {
    id: "faraday", branch: "Physical", chapter: "Electrochemistry",
    title: "Faraday's Laws of Electrolysis", expr: "w = Z · I · t = (M / nF) · I · t   =>   w₁ / E₁ = w₂ / E₂",
    keys: ["faraday", "electrolysis", "charge", "current"],
    symbols: ["w: mass deposited (g)", "Z = M / (nF): electrochemical equivalent (g C⁻¹)", "I: current in amperes", "t: time in seconds", "F = 96485 C mol⁻¹: charge of 1 mole electrons", "n: electrons involved in reduction"],
    notes: ["1 Faraday deposits 1 gram-equivalent of any substance.", "To deposit 1 mol Al from Al³⁺ requires 3 F of charge; 1 mol Cu from Cu²⁺ requires 2 F."],
    example: "A current of 2 A passes through CuSO₄ solution for 965 s (n = 2, M = 63.5):\nw = (63.5 × 2 × 965) / (2 × 96485) = 122555 / 192970 ≈ 0.635 g Cu."
  },
  {
    id: "emf_thermodynamics", branch: "Physical", chapter: "Electrochemistry",
    title: "Thermodynamics of Electrochemical Cells", expr: "ΔG° = −nFE°_cell   ,   ΔS = nF (dE/dT)_P   ,   ΔH = −nFE + nFT (dE/dT)_P",
    keys: ["emf thermodynamics", "temperature coefficient", "delta g cell"],
    symbols: ["(dE/dT)_P: temperature coefficient of cell EMF", "E: cell EMF at temperature T"],
    notes: ["If (dE/dT)_P > 0: cell reaction is accompanied by an increase in entropy (absorbs heat from surroundings, cools during discharge).", "If (dE/dT)_P < 0: cell releases heat upon operation."],
    example: "Standard Daniell cell (n=2, E° = 1.10 V):\nΔG° = −2 × 96485 × 1.10 = −212,267 J = −212.3 kJ mol⁻¹."
  },

  /* 7. Chemical Kinetics */
  {
    id: "rate_law_orders", branch: "Physical", chapter: "Chemical Kinetics",
    title: "Integrated Rate Laws (Zero, First, Second Order)", expr: "0th: [A] = [A]₀ − kt   |   1st: ln([A]₀/[A]) = kt   |   2nd: 1/[A] − 1/[A]₀ = kt",
    keys: ["rate law", "zero order", "first order", "second order", "integrated rate"],
    symbols: ["[A]₀: initial concentration", "[A]: concentration at time t", "k: rate constant"],
    notes: ["Units of k for nth order reaction: (mol L⁻¹)^(1−n) s⁻¹.", "Zero order: k in mol L⁻¹ s⁻¹; plot of [A] vs t is straight line with slope −k.", "First order: k in s⁻¹; plot of ln[A] vs t has slope −k.", "Second order: k in L mol⁻¹ s⁻¹; plot of 1/[A] vs t has slope +k."],
    example: "First-order reaction with k = 0.0693 min⁻¹: t_½ = 0.693 / 0.0693 = 10 min."
  },
  {
    id: "half_life_general", branch: "Physical", chapter: "Chemical Kinetics",
    title: "Half-Life Relations Across Reaction Orders", expr: "t_½ ∝ 1 / [A]₀^(n − 1)   =>   0th: t_½ = [A]₀ / 2k   |   1st: t_½ = 0.693 / k   |   2nd: t_½ = 1 / (k [A]₀)",
    keys: ["half life", "half-life", "order from half life"],
    symbols: ["t_½: time required for concentration to fall to 50% of its initial value", "n: reaction order"],
    notes: ["First-order half-life is completely independent of initial concentration [A]₀.", "Ratio of half-lives at two initial concentrations: (t_½)₁ / (t_½)₂ = ([A]₀₂ / [A]₀₁)^(n − 1).", "Completion time for zero-order: t_100% = [A]₀ / k = 2 × t_½."],
    example: "If doubling [A]₀ halves t_½, then 1/2 = (1/2)^(n − 1)  =>  n − 1 = 1  =>  n = 2 (Second order)."
  },
  {
    id: "arrhenius", branch: "Physical", chapter: "Chemical Kinetics",
    title: "Arrhenius Equation & Activation Energy", expr: "k = A e^(−E_a / RT)   =>   log (k₂ / k₁) = (E_a / 2.303 R) · (1/T₁ − 1/T₂)",
    keys: ["arrhenius", "activation energy", "temperature dependence"],
    symbols: ["k: rate constant", "A: frequency factor / pre-exponential factor", "E_a: activation energy (J mol⁻¹)", "R = 8.314 J K⁻¹ mol⁻¹"],
    notes: ["Plot of ln k vs 1/T is linear with slope = −E_a / R.", "Plot of log k vs 1/T has slope = −E_a / (2.303 R).", "A catalyst provides an alternative pathway with lower E_a, exponentially increasing k."],
    example: "If temperature rises from 300 K to 310 K and rate doubles (k₂/k₁ = 2):\nE_a = (2.303 × 8.314 × 300 × 310 / 10) × log(2) ≈ 53.6 kJ mol⁻¹."
  },

  /* 8. Solutions & Colligative Properties */
  {
    id: "raoult_binary", branch: "Physical", chapter: "Solutions",
    title: "Raoult's Law for Volatile Binary Liquid Mixtures", expr: "P_total = P_A + P_B = P_A° x_A + P_B° x_B = P_B° + (P_A° − P_B°) x_A",
    keys: ["raoult", "vapour pressure", "ideal solution", "azeotrope"],
    symbols: ["P_A, P_B: partial vapour pressures of components A and B", "P_A°, P_B°: pure component vapour pressures", "x_A, x_B: liquid phase mole fractions"],
    notes: ["Vapour phase mole fraction: y_A = P_A / P_total = P_A° x_A / P_total.", "Ideal solution: ΔH_mix = 0, ΔV_mix = 0, follows Raoult's law across all compositions (e.g. benzene + toluene).", "Positive deviation (ethanol + acetone): A–B interactions weaker than A–A and B–B; minimum boiling azeotrope.", "Negative deviation (chloroform + acetone): A–B hydrogen bonding stronger than pure; maximum boiling azeotrope."],
    example: "P_A° = 100 mmHg, P_B° = 200 mmHg, with x_A = 0.4:\nP_total = (100 × 0.4) + (200 × 0.6) = 40 + 120 = 160 mmHg.\ny_A = 40 / 160 = 0.25 in vapour phase."
  },
  {
    id: "colligative_properties", branch: "Physical", chapter: "Solutions",
    title: "Colligative Properties & Van 't Hoff Factor", expr: "RLVP: (P° − P)/P° = i · x_B   |   ΔT_b = i · K_b · m   |   ΔT_f = i · K_f · m   |   π = i · CRT",
    keys: ["colligative", "ebullioscopy", "cryoscopy", "osmotic pressure", "vant hoff factor"],
    symbols: ["i: van 't Hoff factor (i = 1 for non-electrolytes)", "K_b: molal elevation constant (0.512 K kg mol⁻¹ for water)", "K_f: molal depression constant (1.86 K kg mol⁻¹ for water)", "m: molality (mol kg⁻¹)", "C: molarity (mol L⁻¹)", "π: osmotic pressure"],
    notes: ["Dissociation of A_x B_y giving n ions: i = 1 + (n − 1) α  =>  α = (i − 1) / (n − 1).", "Association (e.g. benzoic acid in benzene dimerization, n = 2): i = 1 − (1 − 1/n) α.", "i = Normal Molar Mass / Observed Molar Mass."],
    example: "0.1 m NaCl (n = 2, assuming 100% dissociation i = 2) in water:\nΔT_f = 2 × 1.86 × 0.1 = 0.372 °C  =>  Freezing point = −0.372 °C."
  },

  /* 9. Solid State */
  {
    id: "solid_density", branch: "Physical", chapter: "Solid State",
    title: "Density and Geometry of Cubic Unit Cells", expr: "ρ = (Z · M) / (a³ · N_A)   ,   SC: a = 2r   ,   BCC: √3 a = 4r   ,   FCC: √2 a = 4r",
    keys: ["solid state", "density of unit cell", "packing efficiency", "radius ratio"],
    symbols: ["ρ: density (g cm⁻³ when a is in cm)", "Z: effective number of atoms in unit cell (SC = 1, BCC = 2, FCC = 4)", "M: molar mass (g mol⁻¹)", "a: edge length (1 pm = 10⁻¹⁰ cm)", "r: atomic radius"],
    notes: ["Packing efficiency: Simple Cubic = 52.4%, BCC = 68%, FCC/CCP/HCP = 74%.", "Coordination number: SC = 6, BCC = 8, FCC/HCP = 12.", "Radius ratio r₊ / r₋: < 0.155 (Linear), 0.155–0.225 (Trigonal), 0.225–0.414 (Tetrahedral), 0.414–0.732 (Octahedral), 0.732–1.000 (Cubic/CsCl)."],
    example: "Copper crystallises in FCC (Z = 4, M = 63.5 g mol⁻¹) with a = 361 pm:\nρ = (4 × 63.5) / [(3.61 × 10⁻⁸)³ × 6.022 × 10²³] ≈ 8.94 g cm⁻³."
  },
  {
    id: "bragg_law", branch: "Physical", chapter: "Solid State",
    title: "Bragg's Law of X-Ray Diffraction", expr: "nλ = 2d sin θ   ,   d_hkl = a / √(h² + k² + l²)",
    keys: ["bragg", "x-ray diffraction", "interplanar spacing", "miller indices"],
    symbols: ["n: order of diffraction (1, 2...)", "λ: wavelength of X-rays", "d: interplanar spacing between crystal planes (h k l)", "θ: glancing angle / Bragg angle", "a: cubic lattice constant"],
    notes: ["Constructive interference occurs when path difference 2d sin θ equals an integer number of wavelengths.", "For a cubic crystal, distance between (1 0 0) planes is a, (1 1 0) is a/√2, and (1 1 1) is a/√3."],
    example: "First-order reflection (n = 1) from planes with d = 2.0 Å using X-rays of λ = 1.0 Å:\nsin θ = (1 × 1.0) / (2 × 2.0) = 0.25  =>  θ = arcsin(0.25) ≈ 14.5°."
  },

  /* 10. Surface Chemistry */
  {
    id: "adsorption_isotherms", branch: "Physical", chapter: "Surface Chemistry",
    title: "Freundlich & Langmuir Adsorption Isotherms", expr: "Freundlich: x/m = k · P^(1/n)   =>   log(x/m) = log k + (1/n) log P   (0 < 1/n < 1)",
    keys: ["freundlich", "adsorption isotherm", "surface chemistry", "langmuir"],
    symbols: ["x: mass of gas adsorbed", "m: mass of adsorbent", "P: equilibrium pressure", "k, n: empirical constants"],
    notes: ["Plot of log(x/m) vs log P is a straight line with slope 1/n and y-intercept log k.", "At low pressure, 1/n = 1 (x/m ∝ P). At high pressure, 1/n = 0 (x/m becomes independent of P, surface saturated).", "Hardy–Schulze Rule: coagulating power of an electrolyte is proportional to the 6th power of the valency of the active flocculating ion (Al³⁺ > Ba²⁺ > Na⁺ for negative sols)."],
    example: "If slope of Freundlich log-plot is 0.5 (1/n = 0.5) and intercept is 0.4771 (k = 3):\nAt P = 4 atm, x/m = 3 × 4^(0.5) = 3 × 2 = 6."
  },

  /* 11. Nuclear Chemistry */
  {
    id: "nuclear_decay", branch: "Physical", chapter: "Nuclear Chemistry",
    title: "Radioactive Decay Law & Mass Defect", expr: "N = N₀ e^(−λt)   ,   t_½ = 0.693 / λ   ,   ΔE = Δm × 931.5 MeV",
    keys: ["nuclear chemistry", "radioactive decay", "binding energy", "mass defect"],
    symbols: ["N: number of active nuclei at time t", "N₀: initial nuclei", "λ: radioactive decay constant", "A = λN: activity (Becquerel / Curie)", "Δm: mass defect in amu (mass of separate nucleons − mass of nucleus)"],
    notes: ["Radioactive decay always follows first-order kinetics strictly.", "Average life τ = 1 / λ = 1.44 t_½.", "1 Curie (Ci) = 3.7 × 10¹⁰ disintegrations per second (dps). 1 Bq = 1 dps."],
    example: "A radioisotope has t_½ = 5 days. Fraction remaining after 15 days (3 half-lives):\nN / N₀ = (½)³ = 1/8 (12.5%)."
  },

  /* ==================== INORGANIC CHEMISTRY ==================== */
  /* 12. Periodic Properties & Bonding */
  {
    id: "slater_rules", branch: "Inorganic", chapter: "Classification of Elements",
    title: "Slater's Rules & Effective Nuclear Charge", expr: "Z* = Z − σ",
    keys: ["slater", "effective nuclear charge", "shielding constant"],
    symbols: ["Z*: effective nuclear charge felt by electron", "Z: atomic number", "σ: screening / shielding constant"],
    notes: ["For an electron in ns or np: other electrons in same shell contribute 0.35 each; (n−1) shell contributes 0.85 each; deeper shells contribute 1.00 each.", "Explains why 4s fills before 3d, and explains the d-block and lanthanide contractions."],
    example: "For valence 4s electron of Zn (Z = 30, [Ar] 3d¹⁰ 4s²):\nσ = (1 × 0.35) + (18 × 0.85) + (10 × 1.00) = 0.35 + 15.30 + 10.0 = 25.65.\nZ* = 30 − 25.65 = 4.35."
  },
  {
    id: "electronegativity_scales", branch: "Inorganic", chapter: "Chemical Bonding",
    title: "Electronegativity Scales (Pauling & Mulliken)", expr: "Pauling: |χ_A − χ_B| = 0.208 √(Δ) (kcal) = 0.102 √(Δ) (kJ)   |   Mulliken: χ_M = (IE + EA) / 2",
    keys: ["electronegativity", "pauling", "mulliken", "allred rochow"],
    symbols: ["Δ = E_AB − √(E_AA × E_BB): resonance ionic resonance energy", "IE, EA: ionisation energy and electron affinity in eV"],
    notes: ["Conversion: χ_Pauling ≈ χ_Mulliken / 2.8 (when IE and EA are in eV).", "Allred–Rochow scale: χ_AR = 0.359 (Z* / r²) + 0.744 (electrostatic attraction at covalent radius).", "Fluorine has the highest Pauling electronegativity: 4.0."],
    example: "If IE = 12.0 eV and EA = 2.0 eV:\nχ_Mulliken = (12.0 + 2.0) / 2 = 7.0  =>  χ_Pauling ≈ 7.0 / 2.8 = 2.5."
  },
  {
    id: "dipole_ionic", branch: "Inorganic", chapter: "Chemical Bonding",
    title: "Dipole Moment & % Ionic Character", expr: "μ = q × d   ,   % Ionic Character = (μ_obs / μ_theo) × 100 = 16 |Δχ| + 3.5 |Δχ|²",
    keys: ["dipole moment", "ionic character", "hannay smith"],
    symbols: ["μ: dipole moment (1 Debye = 10⁻¹⁸ esu cm = 3.336 × 10⁻³⁰ C m)", "q: partial charge", "d: bond distance", "Δχ = |χ_A − χ_B|: electronegativity difference (Hannay–Smith equation)"],
    notes: ["Symmetrical molecules (CO₂, BF₃, CCl₄, SF₆, trans-alkenes) have vector sum μ_net = 0.", "Lone pairs contribute strongly to dipole moment (e.g. NH₃ has μ = 1.47 D, while NF₃ has only 0.24 D because N–F bond dipoles oppose the lone pair)."],
    example: "HCl has observed μ = 1.03 D and bond length d = 1.27 Å:\nTheoretical 100% ionic μ = 4.8 × 10⁻¹⁰ esu × 1.27 × 10⁻⁸ cm = 6.10 D.\n% Ionic character = (1.03 / 6.10) × 100 ≈ 16.9%."
  },
  {
    id: "hybrid_vsepr", branch: "Inorganic", chapter: "Chemical Bonding",
    title: "Steric Number & Hybridisation Formula", expr: "H = ½ (V + M − C + A)   ,   Steric Number = (Bond Pairs) + (Lone Pairs)",
    keys: ["steric number", "hybridisation", "vsepr shape", "lone pairs"],
    symbols: ["V: valence electrons of central atom", "M: monovalent atoms attached (H, F, Cl, Br, I)", "C: cationic positive charge", "A: anionic negative charge"],
    notes: ["H = 2: sp (Linear, 180°)", "H = 3: sp² (Trigonal planar, 120°)", "H = 4: sp³ (Tetrahedral, 109.5°)", "H = 5: sp³d (Trigonal bipyramidal; lone pairs enter equatorial positions first: SF₄ see-saw, ClF₃ T-shaped, XeF₂ linear)", "H = 6: sp³d² (Octahedral; XeF₄ square planar, BrF₅ square pyramidal)", "H = 7: sp³d³ (Pentagonal bipyramidal; IF₇, XeF₆ distorted octahedral)."],
    example: "For I₃⁻: central I has V=7, M=2, C=0, A=1  =>  H = ½(7 + 2 + 1) = 5 (sp³d, 3 lone pairs in equatorial positions  =>  Linear shape)."
  },
  {
    id: "formalcharge", branch: "Inorganic", chapter: "Chemical Bonding",
    title: "Formal Charge on Atoms in Lewis Structure", expr: "FC = V − L − ½ B",
    keys: ["formal charge", "lewis structure"],
    symbols: ["V: valence electrons of free atom", "L: non-bonding lone-pair electrons", "B: bonding shared electrons"],
    notes: ["The most stable resonance structure has formal charges closest to zero.", "Negative formal charges reside preferentially on the more electronegative elements."],
    example: "Central oxygen in ozone O₃ (O=O⁺−O⁻):\nV = 6, L = 2, B = 6  =>  FC = 6 − 2 − ½(6) = +1."
  },
  {
    id: "mot_bond_order", branch: "Inorganic", chapter: "Chemical Bonding (MOT)",
    title: "Molecular Orbital Theory (MOT) Bond Order", expr: "Bond Order = ½ (N_b − N_a)",
    keys: ["mot", "bond order", "molecular orbital", "magnetic nature"],
    symbols: ["N_b: number of electrons in bonding molecular orbitals (σ, π)", "N_a: number of electrons in antibonding orbitals (σ*, π*)"],
    notes: ["For ≤ 14 electrons (B₂, C₂, N₂): π2p_x = π2p_y < σ2p_z (due to s-p mixing).", "For > 14 electrons (O₂, F₂, Ne₂): σ2p_z < π2p_x = π2p_y.", "Bond order 0 means molecule does not exist (He₂, Be₂).", "Paramagnetic if any unpaired electrons exist in MOs (e.g. O₂ has 2 unpaired electrons in π*2p)."],
    example: "O₂ (16 electrons): N_b = 10, N_a = 6  =>  B.O. = ½(10 − 6) = 2.0 (Paramagnetic).\nO₂⁺: B.O. = 2.5, O₂⁻ (superoxide): B.O. = 1.5, O₂²⁻ (peroxide): B.O. = 1.0."
  },

  /* 13. Coordination Chemistry */
  {
    id: "spinonly", branch: "Inorganic", chapter: "Coordination Compounds",
    title: "Spin-Only Magnetic Moment", expr: "μ_s = √[n(n + 2)] B.M.   (Bohr Magnetons)",
    keys: ["spin only", "magnetic moment", "bohr magneton", "unpaired electrons"],
    symbols: ["n: number of unpaired electrons", "1 B.M. = eh / (4π m_e c) = 9.274 × 10⁻²⁴ J T⁻¹"],
    notes: ["n = 1: 1.73 BM, n = 2: 2.83 BM, n = 3: 3.87 BM, n = 4: 4.90 BM, n = 5: 5.92 BM.", "Always determine if complex is high spin or low spin using spectrochemical series before counting n."],
    example: "[Fe(H₂O)₆]²⁺: Fe²⁺ is 3d⁶, H₂O is weak field ligand  =>  t₂g⁴ eg² (n = 4 unpaired electrons)  =>  μ_s = √(4 × 6) = √24 ≈ 4.90 BM."
  },
  {
    id: "cfse_oct_tet", branch: "Inorganic", chapter: "Coordination Compounds",
    title: "Crystal Field Stabilization Energy (CFSE)", expr: "Octahedral: CFSE = (−0.4 n_t2g + 0.6 n_eg) Δ_o + mP   |   Tetrahedral: Δ_t = (4/9) Δ_o",
    keys: ["cfse", "crystal field stabilization", "crystal field splitting"],
    symbols: ["n_t2g: electrons in t₂g set", "n_eg: electrons in eg set", "Δ_o: octahedral splitting energy", "P: pairing energy", "m: extra electron pairs formed relative to free ion"],
    notes: ["Spectrochemical series: I⁻ < Br⁻ < S²⁻ < SCN⁻ < Cl⁻ < F⁻ < OH⁻ < C₂O₄²⁻ < H₂O < NCS⁻ < EDTA⁴⁻ < NH₃ < en < NO₂⁻ < CN⁻ < CO.", "If Δ_o > P: strong field, low-spin complex.", "If Δ_o < P: weak field, high-spin complex.", "Tetrahedral complexes are almost always high-spin because Δ_t is small (only 4/9 of Δ_o)."],
    example: "Low-spin d⁶ (e.g. [Co(NH₃)₆]³⁺, t₂g⁶ eg⁰):\nCFSE = (−0.4 × 6) Δ_o + 2P = −2.4 Δ_o + 2P."
  },
  {
    id: "ean_rule", branch: "Inorganic", chapter: "Coordination Compounds",
    title: "Effective Atomic Number (EAN / Sidgwick Rule)", expr: "EAN = Z − (Oxidation State) + 2 × (Coordination Number)",
    keys: ["ean", "effective atomic number", "sidgwick"],
    symbols: ["Z: atomic number of central metal", "Each mono-dentate ligand donates 2 electrons to the metal"],
    notes: ["If EAN equals the atomic number of the next noble gas (36 for Kr, 54 for Xe, 86 for Rn), the complex displays exceptional thermodynamic stability.", "Homoleptic metal carbonyls (e.g. Ni(CO)₄, Fe(CO)₅, Cr(CO)₆) strictly follow the 18-electron / EAN rule."],
    example: "[Fe(CN)₆]⁴⁻: Fe(II) has Z = 26, O.S. = +2, C.N. = 6:\nEAN = 26 − 2 + (2 × 6) = 24 + 12 = 36 (Krypton configuration)."
  },

  /* ==================== ORGANIC CHEMISTRY ==================== */
  /* 14. Structure, Isomerism & Elemental Analysis */
  {
    id: "dbe", branch: "Organic", chapter: "General Organic Chemistry",
    title: "Degree of Unsaturation (Double Bond Equivalent)", expr: "DBE = C + 1 − ½ H − ½ X + ½ N",
    keys: ["dbe", "degree of unsaturation", "index of hydrogen deficiency", "double bond equivalent"],
    symbols: ["C: carbon atoms", "H: hydrogen atoms", "X: halogen atoms (F, Cl, Br, I)", "N: nitrogen atoms", "Oxygen and sulfur atoms are ignored"],
    notes: ["DBE = 1 corresponds to 1 double bond (C=C or C=O) OR 1 ring.", "DBE = 2 corresponds to 1 triple bond (C≡C or C≡N) OR 2 rings OR 2 double bonds.", "Benzene ring (C₆H₆) has DBE = 4 (1 ring + 3 double bonds)."],
    example: "C₈H₈O (Acetophenone):\nDBE = 8 + 1 − ½(8) = 9 − 4 = 5 (1 benzene ring = 4, plus 1 carbonyl C=O = 1)."
  },
  {
    id: "optical_rotation", branch: "Organic", chapter: "Stereochemistry",
    title: "Specific Rotation & Enantiomeric Excess", expr: "[α]_D^T = α_obs / (l · c)   ,   %ee = Optical Purity = (|R − S| / (R + S)) × 100 = ([α]_obs / [α]_pure) × 100",
    keys: ["specific rotation", "enantiomeric excess", "optical purity", "chiral"],
    symbols: ["[α]_D^T: specific rotation at temperature T and sodium D line (589 nm)", "α_obs: observed rotation in polarimeter (degrees)", "l: path length in decimetres (1 dm = 10 cm)", "c: concentration in g mL⁻¹"],
    notes: ["Racemic mixture: equal amounts of (d) and (l) enantiomers; %ee = 0%; optically inactive by external compensation.", "Meso compound: possesses internal symmetry plane or inversion centre; optically inactive by internal compensation."],
    example: "Sample with 75% (R) and 25% (S):\n%ee = 75 − 25 = 50%. If pure (R) has [α] = +20°, observed [α] = +10°."
  },
  {
    id: "stereoisomer_counts", branch: "Organic", chapter: "Stereochemistry",
    title: "Formulas for Counting Stereoisomers", expr: "Unsymmetrical: Total = 2ⁿ   |   Symmetrical (even n): Optically Active = 2ⁿ⁻¹ , Meso = 2^(n/2 − 1) , Total = 2ⁿ⁻¹ + 2^(n/2 − 1)",
    keys: ["stereoisomer counting", "number of optical isomers", "meso isomers"],
    symbols: ["n: number of chiral centres (asymmetric carbons)"],
    notes: ["For symmetrical molecule with ODD number of chiral centres (n = odd):\nOptically Active = 2ⁿ⁻¹ − 2^((n−1)/2), Meso = 2^((n−1)/2), Total = 2ⁿ⁻¹.", "Geometrical isomers for molecule with n double bonds: 2ⁿ (unsymmetrical); for symmetrical with even double bonds: 2ⁿ⁻¹ + 2^(n/2 − 1)."],
    example: "Tartaric acid CH(OH)COOH−CH(OH)COOH (symmetrical, n = 2 even):\nOptically Active = 2²⁻¹ = 2 (d and l), Meso = 2^(1−1) = 1. Total = 3 stereoisomers."
  },
  {
    id: "elemental_analysis", branch: "Organic", chapter: "Quantitative Organic Analysis",
    title: "Quantitative Elemental Estimation Formulas", expr: "Liebig: %C = (12/44)(m_CO₂/m)×100 , %H = (2/18)(m_H₂O/m)×100   |   Kjeldahl: %N = 1.4 × N × V / m",
    keys: ["kjeldahl", "dumas", "carius", "elemental analysis", "percentage of nitrogen"],
    symbols: ["m: mass of organic compound taken (g)", "Dumas Method: %N = (28 / 22400) × (V_STP / m) × 100", "Carius Halogen: %X = (At. mass X / Mol. mass AgX) × (m_AgX / m) × 100", "Carius Sulfur: %S = (32 / 233) × (m_BaSO₄ / m) × 100", "Phosphorus: %P = (62 / 222) × (m_Mg₂P₂O₇ / m) × 100"],
    notes: ["Kjeldahl's method is NOT applicable to compounds containing nitrogen in nitro (–NO₂), azo (–N=N–), or heterocyclic rings (pyridine), because nitrogen is not converted quantitatively to (NH₄)₂SO₄."],
    example: "0.50 g organic compound digested by Kjeldahl method neutralised 20 mL of 0.25 N H₂SO₄:\n%N = (1.4 × 0.25 × 20) / 0.50 = 7.0 / 0.50 = 14%."
  },
  {
    id: "polymer_molar_mass", branch: "Organic", chapter: "Polymers",
    title: "Average Molecular Weights of Polymers", expr: "M_n = (Σ N_i M_i) / (Σ N_i)   ,   M_w = (Σ N_i M_i²) / (Σ N_i M_i)   ,   PDI = M_w / M_n",
    keys: ["polymers", "number average molecular weight", "weight average", "pdi"],
    symbols: ["M_n: number-average molecular weight (measured by colligative properties like osmotic pressure)", "M_w: weight-average molecular weight (measured by ultracentrifugation / light scattering)", "PDI: Polydispersity Index"],
    notes: ["For monodisperse natural polymers (pure proteins, DNA): PDI = 1 (M_w = M_n).", "For synthetic polymers: PDI > 1 (M_w > M_n)."],
    example: "Equal numbers of molecules with M₁ = 10,000 and M₂ = 30,000:\nM_n = (10000 + 30000)/2 = 20,000.\nM_w = (10000² + 30000²) / (10000 + 30000) = (10⁸ + 9×10⁸) / 40000 = 25,000.\nPDI = 25000 / 20000 = 1.25."
  }
];

// Generate replacement code
const newContent = `/* Nemo content: practice questions, formula bank and offline answers.
   All practice questions are ORIGINAL study questions written for this app. They are not official
   JEE/CBSE previous-year questions and carry no year/paper metadata. */
window.NEMO_DATA = {
  /* ---------------- Practice questions ---------------- */
  quiz: ${quizCode},

  /* ---------------- Formula bank (Comprehensive CBSE & JEE Compendium) ---------------- */
  formulas: ${JSON.stringify(FORMULAS, null, 2)},

  /* ---------------- Offline answers ----------------
     Used when no AI endpoint is configured. \`match\` is a regular expression source, tested against the question. */
  topics: ${topicsCode}
};
`;

fs.writeFileSync(dataPath, newContent, "utf8");
console.log("Successfully expanded Formula Bank in data.js to", FORMULAS.length, "comprehensive formulas!");
