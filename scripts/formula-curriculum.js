"use strict";

/**
 * 330+ Comprehensive Formulas for CBSE, JEE Main & JEE Advanced Chemistry
 * Completes the 400+ Chemistry Formula Package for Nemo Chemistry Tutor.
 */

const formulas = [
  /* =========================================================================
     PHYSICAL CHEMISTRY
     ========================================================================= */

  /* --- 1. Mole Concept & Stoichiometry --- */
  {
    id: "empirical_molecular_formula",
    branch: "Physical",
    chapter: "Some Basic Concepts of Chemistry",
    title: "Empirical & Molecular Formula Relation",
    expr: "Molecular Formula = (Empirical Formula)_n   ,   n = (Molar Mass) / (Empirical Formula Mass)",
    keys: ["empirical formula", "molecular formula", "stoichiometric ratio"],
    symbols: ["n: integer multiplier", "Molar Mass: experimental molar mass (g mol⁻¹)", "Empirical Formula Mass: sum of atomic masses in empirical formula"],
    notes: ["Vapour density relation: Molar Mass = 2 × Vapour Density for any gas.", "For organic combustion analysis: mass of C = (12/44) × mass of CO₂; mass of H = (2/18) × mass of H₂O."],
    example: "A compound has empirical formula CH₂O (mass 30) and vapour density 90:\nMolar mass = 2 × 90 = 180 g mol⁻¹.\nn = 180 / 30 = 6.\nMolecular formula = (CH₂O)₆ = C₆H₁₂O₆ (glucose)."
  },
  {
    id: "limiting_reagent_yield",
    branch: "Physical",
    chapter: "Some Basic Concepts of Chemistry",
    title: "Limiting Reagent & Percentage Yield",
    expr: "Moles / Stoichiometric Coefficient = Minimum => Limiting Reagent   |   % Yield = (Actual Yield / Theoretical Yield) × 100",
    keys: ["limiting reagent", "limiting reactant", "percentage yield", "theoretical yield"],
    symbols: ["Moles / coeff: ratio compared across all reactants to identify the one that exhausts first", "Theoretical Yield: maximum product calculated from limiting reagent"],
    notes: ["All product calculations must be based strictly on the limiting reagent.", "If reactants are taken in exact stoichiometric ratio, neither is limiting."],
    example: "2H₂ + O₂ → 2H₂O. 3 mol H₂ and 2 mol O₂:\nH₂ ratio = 3/2 = 1.5; O₂ ratio = 2/1 = 2.0. H₂ is limiting.\nMoles of H₂O formed = 3 mol (54 g)."
  },
  {
    id: "percentage_purity",
    branch: "Physical",
    chapter: "Some Basic Concepts of Chemistry",
    title: "Percentage Purity of Chemical Sample",
    expr: "% Purity = (Mass of pure chemical in sample / Total mass of impure sample) × 100",
    keys: ["percentage purity", "sample purity", "stoichiometry with impurities"],
    symbols: ["Mass of pure chemical: quantity that actually reacts stoichometrically"],
    notes: ["Impurities are assumed to be inert unless stated otherwise in the question."],
    example: "10 g impure CaCO₃ produces 1.76 g CO₂ on heating (CaCO₃ → CaO + CO₂):\nMoles CO₂ = 1.76 / 44 = 0.04 mol.\nPure CaCO₃ = 0.04 × 100 = 4.0 g.\n% Purity = (4.0 / 10.0) × 100 = 40%."
  },
  {
    id: "poac_principle",
    branch: "Physical",
    chapter: "Some Basic Concepts of Chemistry",
    title: "Principle of Atom Conservation (POAC)",
    expr: "Moles of atom X in reactant = Moles of atom X in product",
    keys: ["poac", "atom conservation", "unbalanced reaction stoichiometry"],
    symbols: ["n_A × (number of X atoms in A) = n_B × (number of X atoms in B)"],
    notes: ["Extremely powerful for solving multi-step or complex reactions without writing balanced equations."],
    example: "27.6 g K₂CO₃ treated to yield K₂Zn₃[Fe(CN)₆]₂:\nMoles K in K₂CO₃ = 2 × (27.6 / 138) = 0.40 mol K.\nMoles of complex = 0.40 / 2 = 0.20 mol."
  },
  {
    id: "dulong_petit_law",
    branch: "Physical",
    chapter: "Some Basic Concepts of Chemistry",
    title: "Dulong and Petit's Law of Atomic Heat",
    expr: "Approximate Atomic Mass × Specific Heat (cal g⁻¹ °C⁻¹) ≈ 6.4",
    keys: ["dulong petit", "atomic mass from specific heat", "valence from equivalent weight"],
    symbols: ["Specific heat measured in calories per gram per degree Celsius", "6.4 cal K⁻¹ mol⁻¹ ≈ 3 R (Dulong–Petit limit for solid elements)"],
    notes: ["Applies only to solid elements at room temperature or above; fails for light elements like B, C, Si, Be due to high Debye temperatures."],
    example: "Specific heat of a divalent metal is 0.057 cal g⁻¹ °C⁻¹:\nApprox. atomic mass = 6.4 / 0.057 ≈ 112.3.\nExact valency = 2, so exact atomic mass = Equivalent Mass × 2."
  },
  {
    id: "eudiometry_hydrocarbon",
    branch: "Physical",
    chapter: "Some Basic Concepts of Chemistry",
    title: "Eudiometry & Hydrocarbon Gas Combustion",
    expr: "C_x H_y + (x + y/4) O₂ → x CO₂ + (y/2) H₂O(l)   |   Contraction = 1 + y/4",
    keys: ["eudiometry", "gas analysis", "hydrocarbon combustion contraction"],
    symbols: ["x: number of carbon atoms", "y: number of hydrogen atoms", "Contraction on combustion = V(hydrocarbon) + V(O₂) − V(CO₂) = (1 + y/4) × V"],
    notes: ["Water condensed to liquid at room temperature contributes negligible volume.", "KOH absorbs CO₂ completely, giving a second contraction equal to x × V."],
    example: "10 mL hydrocarbon gives 20 mL contraction on combustion and 20 mL contraction with KOH:\nx = 20/10 = 2 carbons (from KOH absorption).\nContraction = 10(1 + y/4) = 20 => 1 + y/4 = 2 => y = 4.\nFormula: C₂H₄ (ethene)."
  },
  {
    id: "parts_per_million_ppm",
    branch: "Physical",
    chapter: "Solutions & Stoichiometry",
    title: "Parts per Million (ppm) & Parts per Billion (ppb)",
    expr: "ppm = (Mass of solute / Total mass of solution) × 10⁶   |   ppb = (Mass of solute / Total mass) × 10⁹",
    keys: ["ppm", "ppb", "parts per million", "trace concentration", "water hardness"],
    symbols: ["ppm: 1 mg solute per kg (or litre) of dilute aqueous solution", "ppb: 1 μg solute per kg of solution"],
    notes: ["For dilute aqueous solutions with density ≈ 1.0 g mL⁻¹, 1 ppm = 1 mg L⁻¹ = 10⁻⁴ %w/v."],
    example: "500 g water contains 2.5 mg dissolved oxygen:\nppm = (2.5 × 10⁻³ / 500) × 10⁶ = 5 ppm."
  },
  {
    id: "mole_fraction_relations",
    branch: "Physical",
    chapter: "Solutions",
    title: "Mole Fraction & Molality Exact Relation",
    expr: "m = (x_B × 1000) / (x_A × M_A)   ,   x_B = (m × M_A) / (1000 + m × M_A)",
    keys: ["mole fraction", "molality to mole fraction conversion", "solution conversions"],
    symbols: ["x_B: mole fraction of solute", "x_A = 1 − x_B: mole fraction of solvent", "M_A: molar mass of solvent (g mol⁻¹; 18 for water)", "m: molality (mol kg⁻¹)"],
    notes: ["For aqueous solutions (M_A = 18 g mol⁻¹): m = (x_B × 1000) / (18 × x_A) = 55.55 × (x_B / x_A)."],
    example: "Aqueous solution with solute mole fraction x_B = 0.1:\nm = (0.1 × 1000) / (0.9 × 18) = 100 / 16.2 ≈ 6.17 m."
  },
  {
    id: "avogadro_number_constant",
    branch: "Physical",
    chapter: "Some Basic Concepts of Chemistry",
    title: "Avogadro Constant & Microscopic Masses",
    expr: "N_A = 6.02214 × 10²³ mol⁻¹   |   1 amu = 1 Da = 1.66054 × 10⁻²⁴ g = 1 / N_A g",
    keys: ["avogadro constant", "amu", "dalton", "mass of single atom"],
    symbols: ["Mass of 1 atom of element = (Atomic mass in g mol⁻¹) / N_A", "Mass of 1 molecule = (Molar mass in g mol⁻¹) / N_A"],
    notes: ["Mass of 1 carbon-12 atom = exactly 12 amu = 12 / (6.022 × 10²³) ≈ 1.9926 × 10⁻²³ g."],
    example: "Mass of a single water molecule (H₂O, M = 18.015 g mol⁻¹):\nm = 18.015 / (6.022 × 10²³) ≈ 2.99 × 10⁻²³ g."
  },

  /* --- 2. Atomic Structure & Quantum Mechanics --- */
  {
    id: "bohr_radius_derivation",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "Bohr Orbit Radius for Hydrogen-like Species",
    expr: "r_n = (ε₀ h² n²) / (π m e² Z) = 0.529 × (n² / Z) Å = 52.9 × (n² / Z) pm",
    keys: ["bohr radius", "orbit radius", "hydrogen like ions", "he+ li2+"],
    symbols: ["n: principal quantum number (1, 2, 3...)", "Z: atomic number (H=1, He⁺=2, Li²⁺=3, Be³⁺=4)", "a₀ = 0.529 Å (first Bohr radius of hydrogen)"],
    notes: ["Radius is directly proportional to n² and inversely proportional to Z: r ∝ n² / Z.", "Ratio of radii in H atom: r₁ : r₂ : r₃ = 1 : 4 : 9."],
    example: "Radius of 2nd orbit of Li²⁺ (n = 2, Z = 3):\nr = 0.529 × (2² / 3) = 0.529 × (4 / 3) ≈ 0.705 Å."
  },
  {
    id: "bohr_velocity",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "Bohr Electron Velocity in nth Orbit",
    expr: "v_n = (Z e²) / (2 ε₀ n h) = 2.188 × 10⁶ × (Z / n) m s⁻¹ = (c / 137) × (Z / n)",
    keys: ["bohr velocity", "speed of electron", "fine structure constant"],
    symbols: ["v_n: orbital velocity in m s⁻¹", "c = 3.0 × 10⁸ m s⁻¹ (speed of light)", "α = 1/137 (fine structure constant)"],
    notes: ["Velocity is directly proportional to Z and inversely proportional to n: v ∝ Z / n.", "Time period of revolution: T = 2πr / v ∝ n³ / Z².", "Frequency of revolution: f = 1 / T ∝ Z² / n³."],
    example: "Velocity of electron in first orbit of H atom:\nv₁ = 2.188 × 10⁶ × (1 / 1) = 2.188 × 10⁶ m s⁻¹ ≈ c / 137."
  },
  {
    id: "bohr_energies_relation",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "Kinetic, Potential & Total Energy of Bohr Orbit",
    expr: "Total Energy E_n = −13.6 × (Z² / n²) eV   |   KE = −E_n   |   PE = 2 E_n",
    keys: ["bohr energy", "kinetic energy electron", "potential energy electron", "virial theorem"],
    symbols: ["E_n: total mechanical energy (always negative for bound states)", "KE: orbital kinetic energy (always positive)", "PE: electrostatic potential energy (negative, magnitude twice KE)"],
    notes: ["Virial Theorem for Coulomb potential: 2<KE> + <PE> = 0 => PE = −2 KE.", "Conversion: 1 eV = 1.602 × 10⁻¹⁹ J; 13.6 eV = 1312 kJ mol⁻¹ = 2.18 × 10⁻¹⁸ J/atom."],
    example: "In hydrogen ground state (n = 1, Z = 1):\nTotal energy E₁ = −13.6 eV.\nKE = +13.6 eV.\nPE = 2 × (−13.6) = −27.2 eV."
  },
  {
    id: "rydberg_formula_series",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "Rydberg Formula & Hydrogen Spectral Series",
    expr: "1 / λ = ν̄ = R_H · Z² · [ (1 / n₁²) − (1 / n₂²) ]   ,   R_H ≈ 109,677 cm⁻¹ ≈ 1.097 × 10⁷ m⁻¹",
    keys: ["rydberg formula", "wave number", "lyman", "balmer", "paschen", "brackett", "pfund"],
    symbols: ["λ: wavelength of emitted/absorbed photon", "ν̄ = 1/λ: wave number", "Lyman: n₁ = 1, n₂ = 2,3... (UV region)", "Balmer: n₁ = 2, n₂ = 3,4... (Visible region)", "Paschen: n₁ = 3 (Infrared)", "Brackett: n₁ = 4 (Far-IR)", "Pfund: n₁ = 5 (Far-IR)"],
    notes: ["Shortest wavelength (series limit): n₂ = ∞ => 1/λ_max = R_H / n₁².", "Longest wavelength (first line): n₂ = n₁ + 1.", "Only Balmer series falls in the visible spectrum of electromagnetic radiation."],
    example: "First line of Balmer series (H atom, Z = 1, n₁ = 2, n₂ = 3):\n1/λ = 1.097 × 10⁷ × (1/4 − 1/9) = 1.097 × 10⁷ × (5/36) => λ ≈ 656.3 nm (red H_α line)."
  },
  {
    id: "number_of_spectral_lines",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "Number of Spectral Lines on Electron De-excitation",
    expr: "N = [ (n₂ − n₁) (n₂ − n₁ + 1) ] / 2   =   [ Δn (Δn + 1) ] / 2",
    keys: ["spectral lines count", "transitions", "emission lines"],
    symbols: ["n₂: initial excited state quantum number", "n₁: final lower state (n₁ = 1 for ground state)", "Δn = n₂ − n₁"],
    notes: ["This formula applies to a sample containing MANY excited hydrogen atoms.", "For a SINGLE isolated atom, maximum lines possible = n₂ − n₁ = Δn."],
    example: "Electrons de-excite from n = 5 to ground state (n = 1):\nΔn = 5 − 1 = 4.\nN = 4 × (4 + 1) / 2 = 10 distinct spectral lines."
  },
  {
    id: "de_broglie_potentials",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "de Broglie Wavelength under Accelerating Potentials",
    expr: "λ = h / p = h / √(2 m q V)   |   For electron: λ = 12.27 / √V Å = √(150 / V) Å",
    keys: ["de broglie wavelength", "accelerating potential", "wave particle duality", "matter wave"],
    symbols: ["h = 6.626 × 10⁻³⁴ J s (Planck constant)", "p = m v: momentum", "V: accelerating electric potential in Volts", "q: charge of particle", "m: rest mass of particle"],
    notes: ["For proton: λ = 0.286 / √V Å.", "For alpha particle (q = 2e, m = 4 m_p): λ = 0.101 / √V Å.", "For gas molecule at temperature T: λ = h / √(3 m k_B T)."],
    example: "An electron accelerated through 100 V:\nλ = 12.27 / √100 = 12.27 / 10 = 1.227 Å = 0.1227 nm."
  },
  {
    id: "heisenberg_uncertainty_relations",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "Heisenberg's Uncertainty Principle (Position, Velocity, Energy)",
    expr: "Δx · Δp ≥ h / (4π)   =>   Δx · Δv ≥ h / (4π m)   |   ΔE · Δt ≥ h / (4π)",
    keys: ["heisenberg uncertainty", "uncertainty principle", "delta x delta p", "position and momentum"],
    symbols: ["Δx: uncertainty in position (m)", "Δp = m Δv: uncertainty in momentum (kg m s⁻¹)", "Δv: uncertainty in velocity (m s⁻¹)", "ΔE: uncertainty in energy", "Δt: lifetime of state"],
    notes: ["If an electron is confined inside a nucleus (radius ~10⁻¹⁴ m), Δv calculated exceeds speed of light c, proving electrons cannot reside inside nuclei.", "Equality Δx · Δp = ℏ/2 represents a minimum uncertainty Gaussian wave packet."],
    example: "Position of an electron (m = 9.1 × 10⁻³¹ kg) known to within 0.1 Å (10⁻¹¹ m):\nΔv ≥ 6.626 × 10⁻³⁴ / [4π × 9.1 × 10⁻³¹ × 10⁻¹¹] ≈ 5.79 × 10⁶ m s⁻¹."
  },
  {
    id: "photoelectric_work_function",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "Einstein's Photoelectric Equation & Stopping Potential",
    expr: "E = h ν = h ν₀ + KE_max   =>   KE_max = h(ν − ν₀) = e V_s",
    keys: ["photoelectric effect", "work function", "stopping potential", "threshold frequency"],
    symbols: ["h ν: energy of incident photon", "w₀ = h ν₀ = hc / λ₀: work function of metal", "ν₀: threshold frequency", "λ₀: threshold wavelength", "KE_max: maximum kinetic energy of emitted photoelectron", "V_s: stopping potential in Volts"],
    notes: ["Stopping potential V_s is independent of incident intensity; it depends strictly on light frequency ν.", "Slope of V_s vs ν graph is h/e, identical for ALL metals."],
    example: "Light of frequency 1.0 × 10¹⁵ Hz shines on metal with work function 2.5 eV (6.0 × 10¹⁴ Hz):\nKE_max = h(ν − ν₀) = 6.63 × 10⁻³⁴ × (1.0 × 10¹⁵ − 6.0 × 10¹⁴) = 2.65 × 10⁻¹⁹ J = 1.65 eV.\nStopping potential V_s = 1.65 V."
  },
  {
    id: "quantum_nodes_formula",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "Radial, Angular & Total Nodes in Atomic Orbitals",
    expr: "Radial Nodes = n − l − 1   |   Angular Nodes = l   |   Total Nodes = n − 1",
    keys: ["radial nodes", "angular nodes", "spherical nodes", "nodal planes", "wavefunctions"],
    symbols: ["n: principal quantum number", "l: azimuthal quantum number (s=0, p=1, d=2, f=3)", "Radial nodes: spherical surfaces where probability density ψ² = 0", "Angular nodes: planar or conical surfaces where ψ² = 0"],
    notes: ["Number of nodal planes passing through the nucleus equals l.", "3d orbital has: Radial nodes = 3 − 2 − 1 = 0; Angular nodes = 2; Total = 2."],
    example: "Find nodes in a 4p orbital (n = 4, l = 1):\nRadial nodes = 4 − 1 − 1 = 2.\nAngular nodes = 1.\nTotal nodes = 4 − 1 = 3."
  },
  {
    id: "orbital_and_spin_momenta",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "Orbital & Spin Angular Momentum",
    expr: "L = √[ l(l + 1) ] · (h / 2π)   |   S = √[ s(s + 1) ] · (h / 2π)   |   μ_s = √[ n(n + 2) ] BM",
    keys: ["orbital angular momentum", "spin angular momentum", "magnetic moment", "bohr magneton"],
    symbols: ["l: orbital quantum number", "s = 1/2: electron spin", "ℏ = h / (2π)", "n: number of unpaired electrons", "BM = e h / (4π m_e) = 9.274 × 10⁻²⁴ J T⁻¹"],
    notes: ["Orbital angular momentum of any s-electron is ZERO because l = 0.", "Spin-only formula neglects orbital contribution, highly accurate for first-row transition metals."],
    example: "For a d-electron (l = 2):\nL = √[ 2(2 + 1) ] ℏ = √6 (h / 2π).\nFor Fe²⁺ (3d⁶, 4 unpaired electrons): μ_s = √[ 4(4 + 2) ] = √24 ≈ 4.90 BM."
  },
  {
    id: "moseley_law_xray",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "Moseley's Law for Characteristic X-rays",
    expr: "√ν = a (Z − b)",
    keys: ["moseley law", "characteristic x-rays", "atomic number basis", "k alpha line"],
    symbols: ["ν: frequency of characteristic X-ray spectral line", "Z: atomic number of target anode", "a: proportionality constant", "b: screening constant (b = 1 for K_α lines; b = 7.4 for L_α lines)"],
    notes: ["Moseley proved that atomic number Z (not atomic weight) is the fundamental property of elements.", "K_α line transition: electron jumps from n = 2 (L shell) to n = 1 (K shell)."],
    example: "For K_α radiation: √ν ∝ (Z − 1). Plotting √ν against Z produces a straight line with intercept b = 1."
  },

  /* --- 3. States of Matter: Gases & Liquids --- */
  {
    id: "grahams_law_effusion",
    branch: "Physical",
    chapter: "States of Matter",
    title: "Graham's Law of Diffusion & Effusion",
    expr: "r₁ / r₂ = √(M₂ / M₁) = √(d₂ / d₁) = (V₁ / t₁) / (V₂ / t₂) = (n₁ / t₁) / (n₂ / t₂)",
    keys: ["grahams law", "diffusion", "effusion", "rate of effusion", "molar mass ratio"],
    symbols: ["r: rate of effusion (volume or moles per unit time)", "M: molar mass of gas", "d: density of gas at same T and P", "t: time taken for effusion of fixed volume V"],
    notes: ["At different pressures: r₁ / r₂ = (P₁ / P₂) × √(M₂ / M₁).", "Used industrially to separate isotopes (e.g. ²³⁵UF₆ and ²³⁸UF₆)."],
    example: "Compare rates of diffusion of CH₄ (M = 16) and SO₂ (M = 64):\nr(CH₄) / r(SO₂) = √(64 / 16) = √4 = 2. Methane diffuses twice as fast as sulfur dioxide."
  },
  {
    id: "kinetic_gas_equation_speeds",
    branch: "Physical",
    chapter: "States of Matter",
    title: "Kinetic Gas Equation & Molecular Speeds",
    expr: "u_rms = √(3RT/M)   ,   u_avg = √(8RT/πM)   ,   u_mp = √(2RT/M)",
    keys: ["molecular speeds", "root mean square speed", "average speed", "most probable speed", "kinetic theory"],
    symbols: ["u_rms: root mean square speed", "u_avg: arithmetic mean speed", "u_mp: most probable speed (peak of Maxwell distribution)", "Ratio: u_mp : u_avg : u_rms = 1 : 1.128 : 1.224 = √2 : √(8/π) : √3"],
    notes: ["M must be in kg mol⁻¹ and R = 8.314 J K⁻¹ mol⁻¹ to obtain speed in m s⁻¹.", "Kinetic gas fundamental equation: P V = (1/3) m N u_rms²."],
    example: "Calculate u_rms for O₂ (M = 0.032 kg mol⁻¹) at 300 K:\nu_rms = √[ (3 × 8.314 × 300) / 0.032 ] = √[ 7482.6 / 0.032 ] = √233831 ≈ 483.6 m s⁻¹."
  },
  {
    id: "kinetic_energy_gas_molecules",
    branch: "Physical",
    chapter: "States of Matter",
    title: "Average Kinetic Energy of Gas Molecules",
    expr: "KE_total = (3/2) n R T   |   KE_per_molecule = (3/2) k_B T",
    keys: ["kinetic energy gas", "boltzmann constant", "translational kinetic energy"],
    symbols: ["k_B = R / N_A = 1.3806 × 10⁻²³ J K⁻¹ (Boltzmann constant)", "T: absolute temperature in Kelvin"],
    notes: ["Kinetic energy of gas molecules depends ONLY on temperature, completely independent of gas identity or molar mass.", "At 0 K (absolute zero), translational kinetic energy of ideal gas becomes zero."],
    example: "At 300 K, KE per molecule of any ideal gas:\nKE = (3/2) × (1.38 × 10⁻²³) × 300 = 6.21 × 10⁻²¹ J."
  },
  {
    id: "critical_constants_vdw",
    branch: "Physical",
    chapter: "States of Matter",
    title: "Critical Constants from van der Waals Parameters",
    expr: "T_c = 8a / (27 R b)   ,   P_c = a / (27 b²)   ,   V_c = 3 b   |   Z_c = (P_c V_c) / (R T_c) = 3/8 = 0.375",
    keys: ["critical temperature", "critical pressure", "critical volume", "liquefaction of gases", "van der waals"],
    symbols: ["T_c: critical temperature (above which a gas cannot be liquefied no matter how much pressure is applied)", "P_c: minimum pressure required to liquefy gas at T_c", "V_c: molar volume at T_c and P_c", "a, b: van der Waals parameters"],
    notes: ["Easier liquefaction corresponds to higher T_c and larger 'a' value (e.g. SO₂ > NH₃ > CO₂ > O₂ > N₂ > H₂ > He).", "Critical compressibility factor Z_c is a universal constant (0.375) for all van der Waals gases."],
    example: "For a gas with a = 4.0 atm L² mol⁻² and b = 0.04 L mol⁻¹:\nV_c = 3 × 0.04 = 0.12 L mol⁻¹.\nP_c = 4.0 / (27 × 0.04²) = 4.0 / 0.0432 ≈ 92.6 atm."
  },
  {
    id: "compressibility_factor_limits",
    branch: "Physical",
    chapter: "States of Matter",
    title: "Compressibility Factor Z & Limiting Behaviors",
    expr: "Z = (P V_m) / (R T)   |   Low P: Z ≈ 1 − a / (V_m R T)   |   High P: Z ≈ 1 + (P b) / (R T)",
    keys: ["compressibility factor", "real gases", "low pressure limit", "high pressure limit"],
    symbols: ["Z = 1: ideal gas behavior", "Z < 1: attractive forces dominate (gas more compressible than ideal)", "Z > 1: repulsive forces dominate (size of molecules dominates, gas less compressible)"],
    notes: ["For H₂ and He, attractive forces are exceptionally weak (a ≈ 0), so Z > 1 at all pressures at room temp: Z = 1 + Pb/RT."],
    example: "At moderate pressure, when attractive forces dominate, Z < 1 and molar volume V_m < V_ideal."
  },
  {
    id: "mean_free_path_and_collision",
    branch: "Physical",
    chapter: "States of Matter",
    title: "Mean Free Path & Collision Frequency",
    expr: "λ = 1 / (√2 π d² N*) = (k_B T) / (√2 π d² P)   |   Z₁ = √2 π d² u_avg N*",
    keys: ["mean free path", "collision frequency", "molecular diameter", "kinetic theory"],
    symbols: ["λ: mean free path (average distance travelled between two successive collisions)", "d: collision diameter of molecule", "N* = N/V: number density of molecules", "Z₁: number of collisions suffered by a single molecule per second"],
    notes: ["Mean free path is inversely proportional to pressure (λ ∝ 1/P) and directly proportional to temperature (λ ∝ T) at constant pressure.", "In high-vacuum tubes, λ can be tens of centimetres."],
    example: "If pressure of a gas is doubled at constant temperature, its mean free path λ is halved."
  },
  {
    id: "surface_tension_capillary",
    branch: "Physical",
    chapter: "States of Matter",
    title: "Surface Tension & Capillary Rise Equation",
    expr: "h = (2 γ cos θ) / (r ρ g)   |   γ = (r h ρ g) / (2 cos θ)",
    keys: ["surface tension", "capillary rise", "contact angle", "meniscus"],
    symbols: ["h: height of liquid column in capillary tube (m)", "γ: surface tension (N m⁻¹ or J m⁻²)", "θ: contact angle (θ < 90° for wetting liquids like water on glass; θ > 90° for mercury)", "r: tube inner radius", "ρ: density of liquid", "g = 9.8 m s⁻²"],
    notes: ["Surface tension decreases with increasing temperature and becomes zero at the critical temperature T_c.", "For pure water on clean glass, θ ≈ 0° => cos θ = 1."],
    example: "In a capillary of r = 0.5 mm in water (γ = 0.0728 N m⁻¹, ρ = 1000 kg m⁻³, θ = 0°):\nh = (2 × 0.0728 × 1) / (0.5 × 10⁻³ × 1000 × 9.8) = 0.1456 / 4.9 ≈ 0.0297 m = 2.97 cm."
  },

  /* --- 4. Thermodynamics & Thermochemistry --- */
  {
    id: "first_law_sign_conventions",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "First Law of Thermodynamics & IUPAC Sign Convention",
    expr: "ΔU = q + w   |   w = −∫ P_ext dV",
    keys: ["first law thermodynamics", "internal energy", "heat and work", "iupac convention"],
    symbols: ["ΔU: change in internal energy (state function)", "q: heat added to system (q > 0 endothermic, q < 0 exothermic)", "w: work done on system (w > 0 compression, w < 0 expansion)"],
    notes: ["For cyclic process: ΔU = 0 => q = −w.", "For isochoric process (dV = 0): w = 0 => ΔU = q_v.", "For adiabatic process (q = 0): ΔU = w_ad."],
    example: "A system absorbs 500 J of heat and does 200 J of work by expansion:\nq = +500 J, w = −200 J.\nΔU = 500 + (−200) = +300 J."
  },
  {
    id: "isothermal_reversible_work",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "Work in Isothermal Reversible Expansion",
    expr: "w_rev = −2.303 n R T log(V₂ / V₁) = −2.303 n R T log(P₁ / P₂)",
    keys: ["isothermal work", "reversible expansion", "maximum work", "pv work"],
    symbols: ["w_rev: maximum work obtained from isothermal expansion", "n: moles of ideal gas", "R = 8.314 J K⁻¹ mol⁻¹", "T: constant absolute temperature", "V₁, V₂: initial and final volumes"],
    notes: ["For isothermal expansion of an ideal gas, ΔT = 0 => ΔU = 0, so q_rev = −w_rev = +2.303 nRT log(V₂/V₁).", "Reversible expansion work is always greater in magnitude than irreversible expansion work."],
    example: "1 mol ideal gas expands reversibly at 300 K from 10 L to 100 L:\nw = −2.303 × 1 × 8.314 × 300 × log(100/10) = −5744 × 1 = −5744 J = −5.744 kJ."
  },
  {
    id: "adiabatic_relations_poisson",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "Adiabatic Reversible Process (Poisson's Relations)",
    expr: "P V^γ = constant   |   T V^(γ−1) = constant   |   T^γ P^(1−γ) = constant",
    keys: ["adiabatic process", "poisson ratio", "gamma", "cp cv ratio"],
    symbols: ["γ = C_p / C_v: heat capacity ratio (Monoatomic = 5/3 = 1.67; Diatomic = 7/5 = 1.40; Polyatomic non-linear = 4/3 = 1.33)"],
    notes: ["In adiabatic expansion, gas cools down (T₂ < T₁); in adiabatic compression, gas heats up (T₂ > T₁).", "Slope of adiabatic curve on PV diagram is γ times steeper than isothermal curve: (dP/dV)_ad = γ (dP/dV)_iso."],
    example: "Monoatomic gas (γ = 5/3) compressed to 1/8th of its original volume adiabatically:\nT₂ / T₁ = (V₁ / V₂)^(γ−1) = 8^(5/3 − 1) = 8^(2/3) = 4. Final temperature is 4 times initial."
  },
  {
    id: "adiabatic_work_formula",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "Work Done in Reversible Adiabatic Process",
    expr: "w_ad = ΔU = n C_v (T₂ − T₁) = (P₂ V₂ − P₁ V₁) / (γ − 1) = n R (T₂ − T₁) / (γ − 1)",
    keys: ["adiabatic work", "temperature change adiabatic", "pv work adiabatic"],
    symbols: ["w_ad: work done in adiabatic process (since q = 0)", "C_v: molar heat capacity at constant volume = R / (γ − 1)"],
    notes: ["For an irreversible adiabatic expansion against P_ext: n C_v (T₂ − T₁) = −P_ext (V₂ − V₁). Use this to find final T₂."],
    example: "2 mol of diatomic gas (C_v = 5/2 R, γ = 1.4) cools from 400 K to 300 K adiabatically:\nw = 2 × (5/2 × 8.314) × (300 − 400) = 5 × 8.314 × (−100) = −4157 J = −4.16 kJ."
  },
  {
    id: "kirchhoff_thermochemistry",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "Kirchhoff's Law of Reaction Enthalpy with Temperature",
    expr: "ΔH_T2 − ΔH_T1 = ΔC_p · (T₂ − T₁)   |   ΔU_T2 − ΔU_T1 = ΔC_v · (T₂ − T₁)",
    keys: ["kirchhoffs law", "enthalpy temperature dependence", "heat capacity change", "delta cp"],
    symbols: ["ΔC_p = Σ C_p(products) − Σ C_p(reactants)", "ΔH_T: standard reaction enthalpy at temperature T"],
    notes: ["If ΔC_p = 0, reaction enthalpy is independent of temperature.", "If C_p varies with temperature as C_p = a + bT, integrate: ΔH_T2 − ΔH_T1 = ∫ ΔC_p dT."],
    example: "N₂ + 3H₂ → 2NH₃ has ΔH₂₉₈ = −92.2 kJ. If ΔC_p = −40 J K⁻¹:\nAt 398 K (ΔT = 100 K): ΔH₃₉₈ = −92200 + (−40 × 100) = −96200 J = −96.2 kJ."
  },
  {
    id: "hess_law_summation",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "Hess's Law of Constant Heat Summation",
    expr: "ΔH_reaction = Σ ΔH_f°(products) − Σ ΔH_f°(reactants)   =   Σ BE(reactants) − Σ BE(products)",
    keys: ["hess law", "enthalpy of formation", "bond energy calculation", "state function enthalpy"],
    symbols: ["ΔH_f°: standard enthalpy of formation (defined as 0 for elements in standard states: O₂(g), C(graphite), Br₂(l), H₂(g))", "BE: bond dissociation energy (gaseous state only)"],
    notes: ["When using bond enthalpies, all reactants and products must be in the GASEOUS state; add enthalpies of atomisation/vaporisation if needed."],
    example: "Combustion of CH₄: CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l).\nΔH° = [ΔH_f°(CO₂) + 2ΔH_f°(H₂O)] − [ΔH_f°(CH₄) + 2(0)]."
  },
  {
    id: "born_haber_cycle_lattice",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "Born–Haber Cycle for Crystal Lattice Enthalpy",
    expr: "ΔH_f° = ΔH_sub(M) + (1/2) D(X₂) + IE(M) + EA(X) + U_lattice",
    keys: ["born haber cycle", "lattice enthalpy", "lattice energy", "electron affinity", "sublimation enthalpy"],
    symbols: ["ΔH_f°: standard heat of formation of ionic solid MX", "ΔH_sub: enthalpy of sublimation of metal", "D(X₂): bond dissociation energy of halogen", "IE: ionisation enthalpy of metal", "EA: electron gain enthalpy of halogen (negative)", "U_lattice: lattice energy (negative when forming crystal)"],
    notes: ["Kapustinskii and Born–Landé equations give theoretical estimates of U_lattice.", "High lattice enthalpy promotes insolubility and high melting points."],
    example: "For NaCl: ΔH_f° = −411 kJ mol⁻¹. Sublimation = +108, 1/2 D = +121, IE = +496, EA = −349.\n−411 = 108 + 121 + 496 − 349 + U => U = −787 kJ mol⁻¹."
  },
  {
    id: "entropy_ideal_gas_expansion",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "Entropy Change for Ideal Gas Processes",
    expr: "ΔS = n C_v ln(T₂ / T₁) + n R ln(V₂ / V₁)   =   n C_p ln(T₂ / T₁) − n R ln(P₂ / P₁)",
    keys: ["entropy change", "ideal gas entropy", "reversible heating and expansion"],
    symbols: ["ΔS: change in entropy of the gas", "C_v, C_p: molar heat capacities at const V and const P"],
    notes: ["Isothermal process (T₁ = T₂): ΔS = n R ln(V₂/V₁) = n R ln(P₁/P₂).", "Isochoric process (V₁ = V₂): ΔS = n C_v ln(T₂/T₁).", "Isobaric process (P₁ = P₂): ΔS = n C_p ln(T₂/T₁).", "Adiabatic reversible process (dq_rev = 0): ΔS = 0 (isentropic)."],
    example: "1 mol ideal gas expands isothermally to double its volume:\nΔS = 1 × 8.314 × ln 2 = 8.314 × 0.693 ≈ 5.76 J K⁻¹."
  },
  {
    id: "entropy_phase_transitions",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "Entropy of Phase Transitions & Trouton's Rule",
    expr: "ΔS_fusion = ΔH_fus / T_mp   |   ΔS_vap = ΔH_vap / T_bp   |   Trouton: ΔS_vap ≈ 88 J K⁻¹ mol⁻¹",
    keys: ["entropy of fusion", "entropy of vaporisation", "troutons rule", "phase equilibrium"],
    symbols: ["T_mp: melting point in Kelvin", "T_bp: normal boiling point in Kelvin", "ΔH_fus: enthalpy of fusion", "ΔH_vap: enthalpy of vaporisation"],
    notes: ["Trouton's rule holds for non-associated liquids (CCl₄, benzene, hexane); it fails for water and ethanol due to hydrogen bonding (ΔS_vap > 88 J K⁻¹ mol⁻¹)."],
    example: "Water at 373 K (ΔH_vap = 40.66 kJ mol⁻¹ = 40660 J mol⁻¹):\nΔS_vap = 40660 / 373 ≈ 109 J K⁻¹ mol⁻¹ (exceeds Trouton's 88 due to extensive H-bonding)."
  },
  {
    id: "gibbs_free_energy_spontaneity",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "Gibbs Free Energy & Spontaneity Criteria",
    expr: "ΔG = ΔH − T ΔS   |   ΔG < 0: Spontaneous   |   ΔG = 0: Equilibrium   |   ΔG > 0: Non-spontaneous",
    keys: ["gibbs free energy", "spontaneity", "delta g", "equilibrium condition"],
    symbols: ["ΔG: change in Gibbs free energy at constant T and P", "T: absolute temperature (Kelvin)", "ΔH: enthalpy change", "ΔS: entropy change of the system"],
    notes: ["ΔH < 0, ΔS > 0: spontaneous at ALL temperatures.", "ΔH > 0, ΔS < 0: non-spontaneous at ALL temperatures.", "ΔH > 0, ΔS > 0: spontaneous at HIGH temperatures (T > ΔH/ΔS).", "ΔH < 0, ΔS < 0: spontaneous at LOW temperatures (T < ΔH/ΔS)."],
    example: "For a reaction with ΔH = +30 kJ mol⁻¹ and ΔS = +100 J K⁻¹ mol⁻¹:\nT_eq = ΔH / ΔS = 30000 / 100 = 300 K. The reaction becomes spontaneous when T > 300 K."
  },
  {
    id: "vant_hoff_isotherm_isobar",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "van 't Hoff Reaction Isotherm & Isobar",
    expr: "Isotherm: ΔG° = −RT ln K_eq   |   Isobar: ln(K₂ / K₁) = (ΔH° / R) · [ 1/T₁ − 1/T₂ ]",
    keys: ["vant hoff isotherm", "vant hoff isobar", "equilibrium constant temperature", "delta g standard"],
    symbols: ["K_eq: thermodynamic equilibrium constant (dimensionless, based on activities)", "ΔH°: standard reaction enthalpy", "R = 8.314 J K⁻¹ mol⁻¹"],
    notes: ["For endothermic reactions (ΔH° > 0): K increases with temperature.", "For exothermic reactions (ΔH° < 0): K decreases with temperature.", "Slope of ln K vs 1/T plot is −ΔH°/R."],
    example: "If K = 1.0 at 300 K and ΔH° = +57.4 kJ mol⁻¹:\nAt 310 K: ln(K₂/1) = (57400/8.314) × [10/(300×310)] ≈ 6904 × 0.0001075 = 0.742 => K₂ ≈ 2.10."
  },
  {
    id: "carnot_engine_efficiency",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "Carnot Engine Maximum Thermal Efficiency",
    expr: "η = (w_net / q_H) = (T_H − T_C) / T_H = 1 − (T_C / T_H)",
    keys: ["carnot engine", "efficiency", "second law", "heat engine", "thermodynamic efficiency"],
    symbols: ["η: efficiency (always < 1 for finite temperatures)", "T_H: absolute temperature of hot source (K)", "T_C: absolute temperature of cold sink (K)", "q_H: heat absorbed from hot reservoir"],
    notes: ["No engine operating between two given temperatures can be more efficient than a reversible Carnot engine.", "To reach 100% efficiency, the cold sink must be at absolute zero (T_C = 0 K), which is forbidden by the Third Law."],
    example: "An engine operates between 600 K and 300 K:\nη = (600 − 300) / 600 = 300 / 600 = 0.50 = 50%."
  },

  /* --- 5. Chemical Equilibrium --- */
  {
    id: "kp_kc_kx_relations",
    branch: "Physical",
    chapter: "Equilibrium",
    title: "Relationships Between Kp, Kc, and Kx",
    expr: "K_p = K_c (R T)^Δn_g   |   K_p = K_x (P_total)^Δn_g",
    keys: ["kp and kc", "equilibrium constants", "delta ng", "gas equilibrium"],
    symbols: ["Δn_g = Σ n_g(products) − Σ n_g(reactants): change in gaseous moles", "R = 0.0821 L atm K⁻¹ mol⁻¹ (when P in atm) or 0.08314 L bar K⁻¹ mol⁻¹", "K_x: equilibrium constant expressed in mole fractions"],
    notes: ["If Δn_g = 0: K_p = K_c = K_x and pressure has no effect on equilibrium composition.", "If Δn_g > 0: K_p > K_c (for RT > 1); adding inert gas at constant pressure shifts equilibrium right.", "If Δn_g < 0: increasing pressure shifts equilibrium forward."],
    example: "N₂(g) + 3H₂(g) ⇌ 2NH₃(g): Δn_g = 2 − (1 + 3) = −2.\nK_p = K_c (RT)⁻² = K_c / (RT)²."
  },
  {
    id: "vapour_density_dissociation_degree",
    branch: "Physical",
    chapter: "Equilibrium",
    title: "Degree of Dissociation from Vapour Density",
    expr: "α = (D − d) / [ (n − 1) d ] = (M_theoretical − M_observed) / [ (n − 1) M_observed ]",
    keys: ["degree of dissociation", "vapour density", "abnormal molar mass", "equilibrium dissociation"],
    symbols: ["D: theoretical vapour density before dissociation = M_theoretical / 2", "d: observed experimental vapour density = M_observed / 2", "n: number of moles of product gas formed from 1 mole of reactant gas", "α: degree of dissociation (0 ≤ α ≤ 1)"],
    notes: ["For association (e.g. 2CH₃COOH ⇌ (CH₃COOH)₂): α = (d − D) / [ d (1 − 1/n) ]."],
    example: "PCl₅ ⇌ PCl₃ + Cl₂ (n = 2). Theoretical M = 208.5 => D = 104.25. Observed d = 70:\nα = (104.25 − 70) / [ (2 − 1) × 70 ] = 34.25 / 70 ≈ 0.489 = 48.9%."
  },
  {
    id: "reaction_quotient_direction",
    branch: "Physical",
    chapter: "Equilibrium",
    title: "Reaction Quotient Q & Equilibrium Direction",
    expr: "Q_c = Π [Products]^coeff / Π [Reactants]^coeff   |   Q < K: Forward   |   Q > K: Reverse",
    keys: ["reaction quotient", "direction of reaction", "le chatelier", "qc vs kc"],
    symbols: ["Q_c: non-equilibrium concentration ratio", "K_c: equilibrium constant", "Q = K: dynamic equilibrium established"],
    notes: ["Pure solids and pure liquids have activity = 1 and are excluded from expressions of Q and K."],
    example: "For A ⇌ B with K_c = 10. If [A] = 2 M, [B] = 4 M: Q_c = 4/2 = 2. Since Q_c < K_c, reaction proceeds forward."
  },

  /* --- 6. Ionic Equilibrium --- */
  {
    id: "water_autoionisation_kw",
    branch: "Physical",
    chapter: "Equilibrium",
    title: "Ionic Product of Water & Temperature Effect",
    expr: "K_w = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ (at 298 K)   |   pH + pOH = pK_w = 14",
    keys: ["kw", "ionic product of water", "ph scale", "neutral water ph"],
    symbols: ["K_w: autoionisation constant of water", "Neutrality condition: [H⁺] = [OH⁻] = √K_w at ALL temperatures"],
    notes: ["Autoionisation of water is ENDOTHERMIC (H₂O ⇌ H⁺ + OH⁻, ΔH > 0), so K_w increases with temperature.", "At 363 K (90 °C), K_w ≈ 10⁻¹², so neutral pH = 6.0; pH 7 at 90 °C is ALKALINE."],
    example: "At 25 °C, pure water has [H⁺] = 10⁻⁷ M, pH = −log(10⁻⁷) = 7.0."
  },
  {
    id: "ostwald_dilution_law",
    branch: "Physical",
    chapter: "Equilibrium",
    title: "Ostwald's Dilution Law for Weak Acids & Bases",
    expr: "K_a = (C α²) / (1 − α)   =>   α ≈ √(K_a / C)   (when α ≤ 0.05)   |   [H⁺] = C α = √(K_a C)",
    keys: ["ostwald dilution law", "degree of ionisation", "weak acid ph", "weak electrolyte"],
    symbols: ["K_a: acid dissociation constant", "C: initial molar concentration", "α: degree of dissociation"],
    notes: ["As concentration decreases (infinite dilution), α approaches 1.0 (100% ionisation).", "If calculated α > 0.05 (5%), solve the exact quadratic: C α² + K_a α − K_a = 0."],
    example: "0.1 M CH₃COOH (K_a = 1.8 × 10⁻⁵):\nα = √(1.8 × 10⁻⁵ / 0.1) = √(1.8 × 10⁻⁴) ≈ 0.0134 (1.34%).\n[H⁺] = C α = 0.1 × 0.0134 = 1.34 × 10⁻³ M => pH = 2.87."
  },
  {
    id: "ph_polyprotic_acids",
    branch: "Physical",
    chapter: "Equilibrium",
    title: "Polyprotic Acid Equilibria & Dianion Concentration",
    expr: "For H₂A: [H⁺] ≈ √(K_a1 · C)   |   [A²⁻] ≈ K_a2   (independent of C)",
    keys: ["polyprotic acid", "diprotic acid", "ka1 and ka2", "sulfuric acid", "h2s"],
    symbols: ["K_a1, K_a2: first and second dissociation constants (usually K_a1 >> K_a2 by 10³ to 10⁶)"],
    notes: ["Second ionisation is suppressed by the high [H⁺] from the first step.", "Concentration of divalent conjugate base [A²⁻] is numerically equal to K_a2 regardless of initial acid concentration."],
    example: "For 0.1 M H₂S (K_a1 = 1 × 10⁻⁷, K_a2 = 1 × 10⁻¹⁴):\n[H⁺] ≈ √(10⁻⁷ × 0.1) = 10⁻⁴ M.\n[S²⁻] ≈ K_a2 = 1.0 × 10⁻¹⁴ M."
  },
  {
    id: "henderson_hasselbalch_buffers",
    branch: "Physical",
    chapter: "Equilibrium",
    title: "Henderson–Hasselbalch Equation for Buffer Solutions",
    expr: "Acidic: pH = pK_a + log([Salt] / [Acid])   |   Basic: pOH = pK_b + log([Salt] / [Base])",
    keys: ["henderson hasselbalch", "buffer solution", "acidic buffer", "basic buffer", "buffer capacity"],
    symbols: ["pK_a = −log K_a", "pK_b = −log K_b", "[Salt]: conjugate base/acid concentration"],
    notes: ["Maximum buffer capacity occurs when [Salt] = [Acid], giving pH = pK_a.", "Effective buffer range: pH = pK_a ± 1.", "Diluting a buffer with pure water changes neither [Salt]/[Acid] ratio nor pH."],
    example: "Buffer made of 0.1 M CH₃COOH and 0.2 M CH₃COONa (pK_a = 4.76):\npH = 4.76 + log(0.2 / 0.1) = 4.76 + 0.301 = 5.06."
  },
  {
    id: "salt_hydrolysis_cases",
    branch: "Physical",
    chapter: "Equilibrium",
    title: "Salt Hydrolysis Constant (Kh), Degree (h) & pH",
    expr: "WA + SB: pH = 7 + ½ pK_a + ½ log C   |   SA + WB: pH = 7 − ½ pK_b − ½ log C   |   WA + WB: pH = 7 + ½ pK_a − ½ pK_b",
    keys: ["salt hydrolysis", "hydrolysis constant", "ph of salt", "anionic hydrolysis", "cationic hydrolysis"],
    symbols: ["K_h: hydrolysis constant = K_w / K_a (for WA+SB) or K_w / (K_a K_b) (for WA+WB)", "h: degree of hydrolysis", "C: salt molarity"],
    notes: ["For salt of Weak Acid + Weak Base (e.g. CH₃COONH₄), pH is COMPLETELY INDEPENDENT of concentration C.", "Salt of Strong Acid + Strong Base (NaCl) does NOT hydrolyse: neutral pH = 7."],
    example: "0.1 M CH₃COONa (pK_a of acetic acid = 4.76):\npH = 7 + 0.5(4.76) + 0.5 log(0.1) = 7 + 2.38 − 0.50 = 8.88 (alkaline solution)."
  },
  {
    id: "solubility_product_ksp",
    branch: "Physical",
    chapter: "Equilibrium",
    title: "Solubility Product (Ksp) & Solubility (S)",
    expr: "A_x B_y ⇌ x A^y⁺ + y B^x⁻   =>   K_sp = x^x · y^y · S^(x + y)",
    keys: ["ksp", "solubility product", "sparingly soluble salt", "molar solubility"],
    symbols: ["S: molar solubility in pure water (mol L⁻¹)", "AB salt: K_sp = S²", "AB₂ or A₂B salt: K_sp = 4 S³", "AB₃ salt: K_sp = 27 S⁴", "A₂B₃ salt: K_sp = 108 S⁵"],
    notes: ["Condition for precipitation: Ionic Product Q_sp > K_sp.", "Saturated solution: Q_sp = K_sp; Unsaturated: Q_sp < K_sp."],
    example: "For Ag₂CrO₄ (A₂B type), K_sp = 1.1 × 10⁻¹²:\nK_sp = 4 S³ => S = ³√(1.1 × 10⁻¹² / 4) = ³√(2.75 × 10⁻¹³) ≈ 6.5 × 10⁻⁵ mol L⁻¹."
  },
  {
    id: "common_ion_solubility",
    branch: "Physical",
    chapter: "Equilibrium",
    title: "Common Ion Effect on Salt Solubility",
    expr: "In presence of common ion C: S' ≈ K_sp / C   (for 1:1 electrolyte AB)",
    keys: ["common ion effect", "suppression of solubility", "le chatelier ionic"],
    symbols: ["S': diminished solubility in presence of common ion", "C: concentration of common ion provided by strong electrolyte (assuming C >> S')"],
    notes: ["Dramatic decrease in solubility is exploited in salt purifications (e.g. NaCl precipitated by bubbling HCl gas into brine)."],
    example: "Solubility of AgCl (K_sp = 1.8 × 10⁻¹⁰) in 0.1 M NaCl:\n[Cl⁻] ≈ 0.1 M.\nS' = K_sp / [Cl⁻] = 1.8 × 10⁻¹⁰ / 0.1 = 1.8 × 10⁻⁹ mol L⁻¹ (reduced 7400-fold from pure water's 1.34 × 10⁻⁵ M)."
  },
  {
    id: "amphiprotic_salt_ph",
    branch: "Physical",
    chapter: "Equilibrium",
    title: "pH of Amphiprotic Species Solutions (NaHCO₃, NaHS)",
    expr: "pH = ½ [ pK_a1 + pK_a2 ]   =>   [H⁺] = √(K_a1 · K_a2)",
    keys: ["amphiprotic salt", "sodium bicarbonate", "nahco3 ph", "isoelectric point"],
    symbols: ["pK_a1, pK_a2: successive dissociation constants of the parent polyprotic acid (e.g. H₂CO₃)"],
    notes: ["The pH of an amphiprotic salt solution is independent of its concentration over a wide range."],
    example: "For NaHCO₃ (H₂CO₃: pK_a1 = 6.35, pK_a2 = 10.33):\npH = ½ (6.35 + 10.33) = ½ (16.68) = 8.34."
  },

  /* --- 7. Redox & Electrochemistry --- */
  {
    id: "nernst_standard_cell",
    branch: "Physical",
    chapter: "Electrochemistry",
    title: "Nernst Equation for Complete Electrochemical Cell",
    expr: "E_cell = E°_cell − (2.303 R T / n F) log Q   =   E°_cell − (0.0592 / n) log Q   (at 298 K)",
    keys: ["nernst equation", "cell potential", "electrochemical cell", "reaction quotient emf"],
    symbols: ["E_cell: cell EMF under non-standard conditions (V)", "E°_cell = E°_cathode − E°_anode: standard cell potential", "n: moles of electrons transferred in balanced cell reaction", "Q: reaction quotient", "F = 96485 C mol⁻¹ (Faraday constant)"],
    notes: ["At equilibrium: E_cell = 0 and Q = K_c => E°_cell = (0.0592 / n) log K_c at 298 K.", "Concentration cell (same electrodes, different ion concs, E° = 0): E = (0.0592/n) log(C₂/C₁)."],
    example: "Daniell cell: Zn + Cu²⁺(0.01 M) → Zn²⁺(0.1 M) + Cu (E° = 1.10 V, n = 2):\nE = 1.10 − (0.0592 / 2) log(0.1 / 0.01) = 1.10 − 0.0296 × 1 = 1.0704 V."
  },
  {
    id: "equilibrium_constant_emf",
    branch: "Physical",
    chapter: "Electrochemistry",
    title: "Equilibrium Constant from Standard Cell EMF",
    expr: "log K_c = (n · E°_cell) / 0.0592   (at 298 K)   |   ΔG° = −n F E°_cell = −2.303 R T log K_c",
    keys: ["equilibrium constant from emf", "delta g standard cell", "electrochemistry thermodynamics"],
    symbols: ["K_c: chemical equilibrium constant", "n: electrons transferred per mole of reaction", "E°_cell: standard potential (V)"],
    notes: ["A positive E°_cell means ΔG° < 0 and K_c > 1, so the cell reaction is thermodynamically spontaneous in the forward direction."],
    example: "For Daniell cell (E° = 1.10 V, n = 2):\nlog K_c = (2 × 1.10) / 0.0592 = 2.20 / 0.0592 ≈ 37.16 => K_c ≈ 1.45 × 10³⁷."
  },
  {
    id: "temperature_coeff_cell_emf",
    branch: "Physical",
    chapter: "Electrochemistry",
    title: "Temperature Coefficient of EMF & Reaction Entropy",
    expr: "(∂E / ∂T)_P = ΔS / (n F)   |   ΔH = −n F E + n F T (∂E / ∂T)_P",
    keys: ["temperature coefficient emf", "entropy from cell potential", "enthalpy from emf"],
    symbols: ["(∂E/∂T)_P: temperature coefficient of cell potential (V K⁻¹)", "ΔS: entropy change of the cell reaction", "ΔH: enthalpy change"],
    notes: ["If (∂E/∂T)_P > 0, cell EMF increases with heating and cell absorbs heat from surroundings (q > 0).", "If (∂E/∂T)_P = 0, electrical energy output equals enthalpy change: −nFE = ΔH."],
    example: "A cell with n = 2 has E = 1.018 V and (∂E/∂T)_P = −5.0 × 10⁻⁵ V K⁻¹ at 298 K:\nΔS = 2 × 96485 × (−5.0 × 10⁻⁵) = −9.65 J K⁻¹ mol⁻¹."
  },
  {
    id: "faradays_electrolysis_laws",
    branch: "Physical",
    chapter: "Electrochemistry",
    title: "Faraday's Laws of Electrolysis & Charge Stoichiometry",
    expr: "w = Z · I · t = (E / 96485) · I · t = [ (M · I · t) / (n-factor · 96485) ]",
    keys: ["faradays laws", "electrolysis", "mass deposited", "electrochemical equivalent", "current efficiency"],
    symbols: ["w: mass of substance deposited or liberated (g)", "I: current in Amperes", "t: time in seconds", "E = M / n-factor: equivalent mass", "Z = E / 96485: electrochemical equivalent (g C⁻¹)", "1 Faraday (F) = 96485 C mol⁻¹ = charge of 1 mole of electrons"],
    notes: ["With current efficiency η%: w = w_theoretical × (η / 100).", "1 mol Al³⁺ requires 3 F (289,455 C); 1 mol Cu²⁺ requires 2 F; 1 mol Ag⁺ requires 1 F."],
    example: "Pass 2.0 A current through CuSO₄ solution for 965 seconds (Cu = 63.5, n = 2):\nw = (63.5 × 2.0 × 965) / (2 × 96485) = 122555 / 192970 ≈ 0.635 g Cu."
  },
  {
    id: "kohlrausch_conductivity_relations",
    branch: "Physical",
    chapter: "Electrochemistry",
    title: "Conductivity (κ), Molar Conductivity (Λm) & Kohlrausch's Law",
    expr: "κ = (1 / R) · (l / A)   |   Λ_m = (1000 · κ) / M   |   Λ°_m = ν₊ λ°₊ + ν₋ λ°₋",
    keys: ["kohlrausch law", "molar conductivity", "specific conductance", "cell constant", "limiting molar conductivity"],
    symbols: ["κ: specific conductivity (S cm⁻¹)", "l / A = G*: cell constant (cm⁻¹)", "Λ_m: molar conductivity (S cm² mol⁻¹)", "M: molarity (mol L⁻¹)", "ν₊, ν₋: stoichiometric numbers of cations and anions"],
    notes: ["Conductivity κ decreases on dilution because ion concentration drops; molar conductivity Λ_m INCREASES on dilution.", "For weak electrolytes: degree of dissociation α = Λ_m / Λ°_m."],
    example: "For NaCl: Λ°_m = λ°(Na⁺) + λ°(Cl⁻) = 50.1 + 76.3 = 126.4 S cm² mol⁻¹."
  },
  {
    id: "debye_huckel_onsager",
    branch: "Physical",
    chapter: "Electrochemistry",
    title: "Debye–Hückel–Onsager Equation for Strong Electrolytes",
    expr: "Λ_m = Λ°_m − A √C",
    keys: ["debye huckel onsager", "strong electrolyte conductivity", "interionic attraction", "electrophoretic effect"],
    symbols: ["Λ_m: molar conductivity at concentration C", "Λ°_m: limiting molar conductivity at infinite dilution", "A: constant depending on solvent, temperature, and electrolyte charges (1:1, 2:1, etc.)", "C: molar concentration"],
    notes: ["Plotting Λ_m versus √C produces a straight line for strong electrolytes with intercept = Λ°_m.", "Fails for weak electrolytes (plot curves sharply upward near C = 0), necessitating Kohlrausch's law for Λ°_m."],
    example: "For 0.04 M KCl, if Λ°_m = 150 S cm² mol⁻¹ and A = 60:\nΛ_m = 150 − 60 × √(0.04) = 150 − 60 × 0.20 = 150 − 12 = 138 S cm² mol⁻¹."
  },
  {
    id: "lead_acid_cell_reactions",
    branch: "Physical",
    chapter: "Electrochemistry",
    title: "Lead Storage Battery Discharge & Recharge Reactions",
    expr: "Discharge: Pb(s) + PbO₂(s) + 2H₂SO₄(aq) → 2PbSO₄(s) + 2H₂O(l)   (E_cell ≈ 2.05 V per cell)",
    keys: ["lead acid battery", "lead storage cell", "rechargeable secondary battery", "specific gravity sulfuric acid"],
    symbols: ["Anode (discharge): Pb(s) + SO₄²⁻ → PbSO₄(s) + 2e⁻", "Cathode (discharge): PbO₂(s) + SO₄²⁻ + 4H⁺ + 2e⁻ → PbSO₄(s) + 2H₂O", "Density of H₂SO₄ drops from 1.30 g mL⁻¹ (fully charged) to 1.15 g mL⁻¹ (discharged)"],
    notes: ["During recharging, reactions reverse and density of H₂SO₄ rises back.", "A standard 12 V car battery connects 6 lead-acid cells in series."],
    example: "Discharging consumes sulfuric acid; testing acid density with a hydrometer indicates state of charge."
  },
  {
    id: "fuel_cell_efficiency_equation",
    branch: "Physical",
    chapter: "Electrochemistry",
    title: "H₂–O₂ Fuel Cell Reactions & Thermodynamic Efficiency",
    expr: "2H₂(g) + O₂(g) → 2H₂O(l)   (E° = 1.229 V)   |   Efficiency η = (ΔG° / ΔH°) × 100 ≈ 83%",
    keys: ["fuel cell", "hydrogen oxygen cell", "thermodynamic efficiency", "clean energy"],
    symbols: ["Anode: 2H₂ + 4OH⁻ → 4H₂O + 4e⁻", "Cathode: O₂ + 2H₂O + 4e⁻ → 4OH⁻", "ΔG° = −237.2 kJ mol⁻¹ (useful electrical work)", "ΔH° = −285.8 kJ mol⁻¹ (heat of combustion)"],
    notes: ["Fuel cells convert chemical energy directly into electrical energy without Carnot thermal limit.", "Used in Apollo space missions: product water was used for astronaut drinking water."],
    example: "Theoretical efficiency η = (237.2 / 285.8) × 100% ≈ 83%, twice that of conventional thermal power plants (≈40%)."
  },

  /* --- 8. Chemical Kinetics --- */
  {
    id: "zero_order_kinetics",
    branch: "Physical",
    chapter: "Chemical Kinetics",
    title: "Zero-Order Reaction Rate Law, Integrated Form & Half-life",
    expr: "[A]_t = [A]₀ − k · t   |   t_½ = [A]₀ / (2 k)   |   t_100% = [A]₀ / k",
    keys: ["zero order kinetics", "integrated rate law zero order", "half life zero order", "units of k"],
    symbols: ["[A]₀: initial concentration", "[A]_t: concentration at time t", "k: rate constant (units: mol L⁻¹ s⁻¹)", "t_100%: time required for complete exhaustion of reactant"],
    notes: ["Rate is independent of reactant concentration: Rate = k.", "Half-life is DIRECTLY proportional to initial concentration: t_½ ∝ [A]₀.", "Common examples: catalytic decomposition of NH₃ on hot Pt surface, photochemical reaction H₂ + Cl₂ → 2HCl."],
    example: "If [A]₀ = 0.5 M and k = 0.05 mol L⁻¹ min⁻¹:\nt_½ = 0.5 / (2 × 0.05) = 5 min. Total completion time = 0.5 / 0.05 = 10 min."
  },
  {
    id: "first_order_kinetics_integrated",
    branch: "Physical",
    chapter: "Chemical Kinetics",
    title: "First-Order Integrated Rate Law & Exponential Decay",
    expr: "k = (2.303 / t) log([A]₀ / [A]_t)   |   [A]_t = [A]₀ · e^(−kt)   |   t_½ = 0.693 / k",
    keys: ["first order kinetics", "half life first order", "radioactive decay", "exponential decay"],
    symbols: ["k: rate constant (units: s⁻¹ or min⁻¹, independent of concentration units)", "[A]_t: concentration at time t", "t_½: half-life (completely independent of initial concentration [A]₀)"],
    notes: ["Fractional completion shortcuts: t_75% = 2 t_½; t_87.5% = 3 t_½; t_93.75% = 4 t_½; t_99.9% ≈ 10 t_½.", "All natural and artificial radioactive decays follow first-order kinetics."],
    example: "First-order reaction with t_½ = 20 min:\nk = 0.693 / 20 = 0.03465 min⁻¹.\nTime for 75% completion = 2 × 20 = 40 min."
  },
  {
    id: "second_order_kinetics_law",
    branch: "Physical",
    chapter: "Chemical Kinetics",
    title: "Second-Order Reaction Integrated Rate Law & Half-life",
    expr: "(1 / [A]_t) − (1 / [A]₀) = k · t   |   t_½ = 1 / (k · [A]₀)",
    keys: ["second order kinetics", "integrated rate law second order", "half life second order"],
    symbols: ["k: rate constant (units: L mol⁻¹ s⁻¹)", "t_½: half-life (inversely proportional to initial concentration: t_½ ∝ 1/[A]₀)"],
    notes: ["Plotting 1/[A]_t versus t yields a straight line with slope = +k and y-intercept = 1/[A]₀.", "Successive half-lives double: t_½(1) : t_½(2) : t_½(3) = 1 : 2 : 4."],
    example: "For second-order reaction with k = 0.2 L mol⁻¹ s⁻¹ and [A]₀ = 0.1 M:\nt_½ = 1 / (0.2 × 0.1) = 1 / 0.02 = 50 s."
  },
  {
    id: "nth_order_half_life_proportionality",
    branch: "Physical",
    chapter: "Chemical Kinetics",
    title: "General nth-Order Half-life Proportionality",
    expr: "t_½ ∝ 1 / [A]₀^(n − 1)   =>   [ t_½(1) / t_½(2) ] = [ [A]₀(2) / [A]₀(1) ]^(n − 1)",
    keys: ["nth order reaction", "order determination", "half life method", "fractional order"],
    symbols: ["n: reaction order", "Units of rate constant k: (mol L⁻¹)^(1−n) s⁻¹ = (conc)^(1−n) (time)⁻¹"],
    notes: ["n = 0: t_½ ∝ [A]₀.", "n = 1: t_½ independent of [A]₀.", "n = 2: t_½ ∝ 1/[A]₀.", "n = 3: t_½ ∝ 1/[A]₀²."],
    example: "If doubling [A]₀ reduces t_½ to 1/4th of its value:\n(1/4) = (1/2)^(n − 1) => 2^(n − 1) = 4 = 2² => n − 1 = 2 => n = 3 (third order)."
  },
  {
    id: "arrhenius_equation_two_temps",
    branch: "Physical",
    chapter: "Chemical Kinetics",
    title: "Arrhenius Equation & Two-Temperature Form",
    expr: "k = A · e^(−E_a / RT)   |   log(k₂ / k₁) = (E_a / 2.303 R) · [ (T₂ − T₁) / (T₁ T₂) ]",
    keys: ["arrhenius equation", "activation energy", "temperature dependence of rate", "frequency factor"],
    symbols: ["A: pre-exponential (frequency) factor (same units as k)", "E_a: activation energy (J mol⁻¹)", "R = 8.314 J K⁻¹ mol⁻¹", "T: temperature in Kelvin"],
    notes: ["Plotting log k vs 1/T yields a straight line with slope = −E_a / (2.303 R) and intercept = log A.", "A catalyst lowers E_a, exponentially increasing k: k_cat / k_uncat = e^(ΔE_a / RT)."],
    example: "Rate constant doubles when temperature rises from 300 K to 310 K (k₂/k₁ = 2):\nlog 2 = 0.3010 = (E_a / (2.303 × 8.314)) × [10 / (300 × 310)].\nE_a = (0.3010 × 19.147 × 93000) / 10 ≈ 53.6 kJ mol⁻¹."
  },
  {
    id: "collision_theory_rate",
    branch: "Physical",
    chapter: "Chemical Kinetics",
    title: "Collision Theory & Steric Factor",
    expr: "Rate = P · Z_AB · e^(−E_a / RT)   |   k = P · Z_AB · e^(−E_a / RT)",
    keys: ["collision theory", "steric factor", "orientation factor", "collision frequency"],
    symbols: ["Z_AB: collision frequency (number of collisions per second per unit volume)", "e^(−E_a/RT): fraction of collisions with energy ≥ E_a", "P: steric factor / orientation probability (P ≤ 1)"],
    notes: ["For complex molecules with strict spatial orientation requirements, P << 1.", "Transition state theory replaces P with entropy of activation: A = (k_B T / h) e^(ΔS‡ / R)."],
    example: "If only 1 in 10⁴ collisions has proper geometry, P = 10⁻⁴."
  },

  /* --- 9. Solid State --- */
  {
    id: "cubic_density_formula",
    branch: "Physical",
    chapter: "Solid State",
    title: "Crystal Density from Unit Cell Edge Length",
    expr: "ρ = (z · M) / (a³ · N_A)   (units: g cm⁻³)",
    keys: ["density of crystal", "unit cell edge length", "z effective", "solid state calculations"],
    symbols: ["z: number of formula units per unit cell (Simple Cubic = 1, BCC = 2, FCC/CCP = 4)", "M: molar mass in g mol⁻¹", "a: edge length in cm (1 Å = 10⁻⁸ cm; 1 pm = 10⁻¹⁰ cm)", "N_A = 6.022 × 10²³ mol⁻¹"],
    notes: ["For NaCl (FCC): z = 4, edge length a = 2(r_Na⁺ + r_Cl⁻).", "For CsCl (BCC-like): z = 1, body diagonal a√3 = 2(r_Cs⁺ + r_Cl⁻)."],
    example: "Copper crystallises in FCC (z = 4, M = 63.5 g mol⁻¹) with a = 361 pm (3.61 × 10⁻⁸ cm):\nρ = (4 × 63.5) / [ (3.61 × 10⁻⁸)³ × 6.022 × 10²³ ] = 254 / [ 4.70 × 10⁻²³ × 6.022 × 10²³ ] ≈ 8.97 g cm⁻³."
  },
  {
    id: "radius_ratio_coordination",
    branch: "Physical",
    chapter: "Solid State",
    title: "Radius Ratio Rules for Ionic Crystals",
    expr: "Limiting Radius Ratio r₊ / r₋ Determines Coordination Number & Geometry",
    keys: ["radius ratio rules", "coordination number", "ionic crystal geometry", "tetrahedral octahedral voids"],
    symbols: [
      "r₊/r₋ < 0.155: CN = 2 (Linear)",
      "0.155 − 0.225: CN = 3 (Trigonal Planar, e.g. B₂O₃)",
      "0.225 − 0.414: CN = 4 (Tetrahedral, e.g. ZnS)",
      "0.414 − 0.732: CN = 6 (Octahedral, e.g. NaCl, MgO)",
      "0.732 − 1.000: CN = 8 (Cubic, e.g. CsCl, NH₄Cl)"
    ],
    notes: ["If r₊/r₋ exceeds 0.732, the crystal structure transitions from NaCl-type (6:6) to CsCl-type (8:8).", "Heating CsCl changes coordination from 8:8 to 6:6; applying high pressure changes NaCl from 6:6 to 8:8."],
    example: "Cation radius = 95 pm, anion radius = 181 pm:\nRadius ratio = 95 / 181 ≈ 0.525. Falls in range 0.414–0.732 => CN = 6 (Octahedral, NaCl structure)."
  },
  {
    id: "braggs_law_diffraction",
    branch: "Physical",
    chapter: "Solid State",
    title: "Bragg's Law of X-Ray Diffraction",
    expr: "n · λ = 2 d · sin θ   |   d_hkl = a / √(h² + k² + l²)   (for cubic)",
    keys: ["braggs law", "x ray diffraction", "interplanar spacing", "miller indices"],
    symbols: ["n: order of diffraction (1, 2, 3...)", "λ: wavelength of X-rays", "d: spacing between adjacent lattice planes (hkl)", "θ: glancing (Bragg) angle of reflection", "a: cubic unit cell edge length", "h, k, l: Miller indices"],
    notes: ["First-order reflection (n = 1) is most intense: λ = 2d sin θ.", "Maximum wavelength that can produce diffraction is λ_max = 2d (since sin θ ≤ 1)."],
    example: "First-order reflection (n = 1) from planes with d = 2.0 Å at θ = 30°:\nλ = 2 × 2.0 × sin 30° = 4.0 × 0.5 = 2.0 Å."
  },

  /* --- 10. Solutions & Colligative Properties --- */
  {
    id: "raoults_law_binary_liquid",
    branch: "Physical",
    chapter: "Solutions",
    title: "Raoult's Law for Volatile Binary Liquid Mixtures",
    expr: "P_total = P_A + P_B = P_A° · x_A + P_B° · x_B = P_A° + (P_B° − P_A°) · x_B",
    keys: ["raoults law", "ideal solution", "partial vapour pressure", "vapour liquid equilibrium"],
    symbols: ["P_A, P_B: partial vapour pressures of components A and B", "P_A°, P_B°: pure component vapour pressures", "x_A, x_B: liquid phase mole fractions (x_A + x_B = 1)"],
    notes: ["Ideal solutions have: ΔH_mix = 0, ΔV_mix = 0, ΔS_mix > 0, ΔG_mix < 0.", "Vapour phase mole fraction (Dalton's law): y_A = P_A / P_total; y_B = P_B / P_total.", "Relation between vapour and liquid fractions: 1 / P_total = y_A / P_A° + y_B / P_B°."],
    example: "At 300 K, pure benzene P_A° = 100 mm Hg and pure toluene P_B° = 40 mm Hg. Equimolar mix (x_A = x_B = 0.5):\nP_total = (100 × 0.5) + (40 × 0.5) = 50 + 20 = 70 mm Hg.\nVapour mole fraction of benzene y_A = 50 / 70 ≈ 0.714."
  },
  {
    id: "henrys_law_gas_solubility",
    branch: "Physical",
    chapter: "Solutions",
    title: "Henry's Law of Gas Solubility in Liquids",
    expr: "p = K_H · x   |   m = k · p",
    keys: ["henrys law", "gas solubility in liquid", "henry constant", "aquatic life oxygen"],
    symbols: ["p: partial pressure of gas over solution", "x: mole fraction of gas in solution", "K_H: Henry's law constant (units: bar or atm)"],
    notes: ["Higher K_H value indicates LOWER solubility of the gas in the liquid at the same pressure.", "K_H increases with temperature, which is why aquatic species are more comfortable in cold water (higher dissolved O₂).", "Soft drink bottles are sealed under high pressure to increase CO₂ solubility."],
    example: "If K_H for N₂ is 7.6 × 10⁴ bar at 293 K and partial pressure p = 0.76 bar:\nx = p / K_H = 0.76 / (7.6 × 10⁴) = 1.0 × 10⁻⁵."
  },
  {
    id: "relative_lowering_vapour_pressure",
    branch: "Physical",
    chapter: "Solutions",
    title: "Relative Lowering of Vapour Pressure (RLVP)",
    expr: "(P° − P_s) / P° = x_B   |   Exact: (P° − P_s) / P_s = n_B / n_A = (w_B · M_A) / (M_B · W_A)",
    keys: ["rlvp", "relative lowering vapour pressure", "colligative property", "ostwald walker"],
    symbols: ["P°: vapour pressure of pure solvent", "P_s: vapour pressure of solution containing non-volatile solute", "x_B: mole fraction of non-volatile solute", "w_B, M_B: mass and molar mass of solute", "W_A, M_A: mass and molar mass of solvent"],
    notes: ["Using (P° − P_s)/P_s = n_B/n_A avoids dilute approximation errors in numerical problems.", "RLVP is measured experimentally via Ostwald–Walker dynamic gas saturation method."],
    example: "Water has P° = 17.5 mm Hg. Dissolving 18 g glucose (M = 180, 0.1 mol) in 178.2 g water (M = 18, 9.9 mol):\n(P° − P_s) / P_s = 0.1 / 9.9 = 1 / 99 => P_s = 17.5 × (99/100) = 17.325 mm Hg."
  },
  {
    id: "ebullioscopy_boiling_elevation",
    branch: "Physical",
    chapter: "Solutions",
    title: "Elevation in Boiling Point (Ebullioscopy)",
    expr: "ΔT_b = i · K_b · m   |   K_b = (R · T_b°² · M_solvent) / (1000 · ΔH_vap)",
    keys: ["elevation in boiling point", "ebullioscopy", "molal elevation constant", "vant hoff factor"],
    symbols: ["ΔT_b = T_b − T_b°: boiling point elevation (°C or K)", "K_b: molal boiling point elevation constant (for water K_b = 0.52 K kg mol⁻¹)", "m: molality of solution (mol kg⁻¹)", "i: van 't Hoff factor"],
    notes: ["K_b depends strictly on the nature of the SOLVENT, independent of the solute identity."],
    example: "0.1 m aqueous BaCl₂ (i = 3 for Ba²⁺ + 2Cl⁻):\nΔT_b = 3 × 0.52 × 0.1 = 0.156 °C.\nBoiling point = 100 + 0.156 = 100.156 °C."
  },
  {
    id: "cryoscopy_freezing_depression",
    branch: "Physical",
    chapter: "Solutions",
    title: "Depression in Freezing Point (Cryoscopy)",
    expr: "ΔT_f = i · K_f · m   |   K_f = (R · T_f°² · M_solvent) / (1000 · ΔH_fus)",
    keys: ["depression in freezing point", "cryoscopy", "molal depression constant", "antifreeze", "de icing salt"],
    symbols: ["ΔT_f = T_f° − T_f: freezing point depression", "K_f: molal freezing point depression constant (for water K_f = 1.86 K kg mol⁻¹; camphor K_f = 40 K kg mol⁻¹)", "m: molality", "i: van 't Hoff factor"],
    notes: ["Camphor has exceptionally high K_f (Rast's method), enabling precise molecular mass determination with standard thermometers.", "Ethylene glycol added to car radiators acts as antifreeze."],
    example: "18 g glucose (0.1 mol) in 1000 g water (m = 0.1, i = 1):\nΔT_f = 1 × 1.86 × 0.1 = 0.186 °C.\nFreezing point of solution = 0 − 0.186 = −0.186 °C."
  },
  {
    id: "osmotic_pressure_pfeffer",
    branch: "Physical",
    chapter: "Solutions",
    title: "Osmotic Pressure & van 't Hoff Equation",
    expr: "π = i · C · R · T = i · (n / V) · R · T = i · (w_B · R · T) / (M_B · V)",
    keys: ["osmotic pressure", "colligative property", "molar mass polymers", "reverse osmosis"],
    symbols: ["π: osmotic pressure in atmospheres or Pascals", "C: molarity (mol L⁻¹)", "R = 0.0821 L atm K⁻¹ mol⁻¹", "T: absolute temperature in Kelvin", "M_B: molar mass of solute"],
    notes: ["Best colligative property for determining molar masses of proteins, polymers, and biomolecules because measurements occur at room temperature and produce large, measurable pressures even at high dilution."],
    example: "0.01 M glucose solution at 300 K (i = 1):\nπ = 1 × 0.01 × 0.0821 × 300 ≈ 0.246 atm."
  },
  {
    id: "vant_hoff_factor_association_dissociation",
    branch: "Physical",
    chapter: "Solutions",
    title: "van 't Hoff Factor (i), Dissociation (α) & Association (β)",
    expr: "Dissociation: α = (i − 1) / (n − 1)   |   Association: β = (1 − i) / (1 − 1/m)",
    keys: ["vant hoff factor", "degree of dissociation", "degree of association", "benzoic acid dimer"],
    symbols: ["i = Normal molar mass / Observed molar mass = Total particles / Initial particles", "n: number of ions produced per molecule on dissociation", "m: number of molecules associating into single polymer (m = 2 for dimer)", "α, β: degrees of dissociation / association (0 ≤ α, β ≤ 1)"],
    notes: ["For complete dissociation: i = n (NaCl: i = 2; K₂SO₄: i = 3; K₄[Fe(CN)₆]: i = 5).", "For complete dimerization (benzoic acid in benzene): m = 2 => i = 1 − 1/2 = 0.5."],
    example: "A 0.1 m solution of weak binary electrolyte (n = 2) freezes at −0.205 °C (K_f = 1.86):\nΔT_f = 0.205 = i × 1.86 × 0.1 => i = 0.205 / 0.186 = 1.102.\nα = (1.102 − 1) / (2 − 1) = 0.102 = 10.2% dissociated."
  },

  /* --- 11. Surface Chemistry --- */
  {
    id: "freundlich_isotherm_log",
    branch: "Physical",
    chapter: "Surface Chemistry",
    title: "Freundlich Adsorption Isotherm",
    expr: "x / m = k · P^(1/n)   =>   log(x / m) = log k + (1/n) · log P   (where 0 ≤ 1/n ≤ 1)",
    keys: ["freundlich adsorption isotherm", "surface chemistry", "adsorption isotherm slope", "physisorption"],
    symbols: ["x: mass of gas adsorbed", "m: mass of solid adsorbent", "P: equilibrium gas pressure", "k, n: empirical constants depending on adsorbent and gas at constant temperature"],
    notes: ["Plotting log(x/m) vs log P gives a straight line with slope = 1/n and y-intercept = log k.", "At low pressure: 1/n = 1 => x/m ∝ P (linear).", "At high pressure: 1/n = 0 => x/m = constant (saturation reached).", "Freundlich isotherm fails at very high pressures."],
    example: "If the slope of log(x/m) vs log P is 0.5 and intercept is 0.3 (k = 2.0):\nAt P = 4 atm: x/m = 2.0 × (4)^0.5 = 2.0 × 2 = 4.0 g/g."
  },
  {
    id: "hardy_schulze_coagulation",
    branch: "Physical",
    chapter: "Surface Chemistry",
    title: "Hardy–Schulze Rule for Colloid Coagulation",
    expr: "Coagulating Power ∝ (Valency of Oppositely Charged Ion)⁴   |   Coagulation Value ∝ 1 / Power",
    keys: ["hardy schulze", "coagulating power", "flocculation value", "colloid precipitation", "gold number"],
    symbols: ["Coagulation / Flocculation value: minimum millimoles of electrolyte per litre of sol required to cause precipitation in 2 hours", "Effective ions for positive sol: [Fe(CN)₆]⁴⁻ > PO₄³⁻ > SO₄²⁻ > Cl⁻", "Effective ions for negative sol (As₂S₃): Al³⁺ > Ba²⁺ > Na⁺"],
    notes: ["Smaller coagulation value indicates GREATER coagulating power.", "Gold number measures protective power of lyophilic colloids: smaller gold number = better protector (Gelatin = 0.005–0.01; Starch = 25)."],
    example: "To coagulate negative As₂S₃ sol, AlCl₃ (Al³⁺, valency 3) is approximately 3⁴ = 81 times more effective than NaCl (Na⁺, valency 1)."
  },

  /* =========================================================================
     INORGANIC CHEMISTRY
     ========================================================================= */

  /* --- 12. Periodic Classification & Periodic Properties --- */
  {
    id: "slater_rules_zeff",
    branch: "Inorganic",
    chapter: "Classification of Elements",
    title: "Slater's Rules for Effective Nuclear Charge (Zeff)",
    expr: "Z_eff = Z − σ   |   For ns/np electron: σ = 0.35(n−1_same) + 0.85(n−1) + 1.0(n−2_lower)",
    keys: ["slaters rules", "effective nuclear charge", "screening constant", "shielding constant"],
    symbols: ["Z: actual atomic number (nuclear charge)", "σ: screening / shielding constant", "Z_eff: effective nuclear charge experienced by valence electron"],
    notes: ["For d and f electrons: electrons in same group contribute 0.35; all electrons in lower groups contribute 1.00.", "Increasing Z_eff across a period explains decrease in atomic radius and increase in ionisation enthalpy."],
    example: "Calculate Z_eff for 4s electron in Zinc (Z = 30: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s²):\nσ = (1 × 0.35) + (18 × 0.85) + (10 × 1.00) = 0.35 + 15.3 + 10.0 = 25.65.\nZ_eff = 30 − 25.65 = 4.35."
  },
  {
    id: "pauling_electronegativity_scale",
    branch: "Inorganic",
    chapter: "Classification of Elements",
    title: "Pauling's Electronegativity Formula",
    expr: "χ_A − χ_B = 0.208 · √Δ   (Δ in kcal mol⁻¹)   =   0.102 · √Δ   (Δ in kJ mol⁻¹)",
    keys: ["paulings electronegativity", "ionic resonance energy", "electronegativity difference"],
    symbols: ["χ_A, χ_B: electronegativities of atoms A and B (arbitrary reference: χ_F = 4.0)", "Δ = E_actual(A−B) − √[ E(A−A) · E(B−B) ]: resonance energy in kJ mol⁻¹ or kcal mol⁻¹"],
    notes: ["Mulliken scale: χ_M = (IE + EA) / 2 in eV; Pauling value χ_P ≈ χ_M / 2.8.", "Allred–Rochow scale: χ_AR = 0.359 (Z_eff / r²) + 0.744."],
    example: "If bond energies are E(H−H) = 436, E(F−F) = 155, E(H−F) = 565 kJ mol⁻¹:\nΔ = 565 − √(436 × 155) = 565 − 260 = 305 kJ mol⁻¹.\nχ_F − χ_H = 0.102 × √305 = 0.102 × 17.46 ≈ 1.78. Since χ_H = 2.20, χ_F ≈ 3.98 ≈ 4.0."
  },
  {
    id: "fajans_rules_covalency",
    branch: "Inorganic",
    chapter: "Chemical Bonding",
    title: "Fajan's Rules for Covalent Character in Ionic Compounds",
    expr: "Polarising Power of Cation ϕ = (Charge) / (Radius)   |   Covalency ∝ ϕ · (Polarisability of Anion)",
    keys: ["fajans rules", "covalent character in ionic", "polarising power", "pseudo inert gas"],
    symbols: ["ϕ: ionic potential", "High covalent character favoured by: Small cation, Large anion, High charge on both, and Pseudo-noble gas configuration (18 e⁻ valence shell: Cu⁺, Ag⁺)"],
    notes: ["CuCl is far more covalent and less soluble than NaCl because Cu⁺ (3s² 3p⁶ 3d¹⁰) has higher polarising power than Na⁺ (2s² 2p⁶) due to poor 3d shielding.", "Higher covalent character lowers melting points and increases solubility in organic solvents."],
    example: "Melting point order: BeCl₂ (405 °C) < MgCl₂ (714 °C) < CaCl₂ (782 °C) < BaCl₂ (963 °C) because Be²⁺ is smallest, having highest polarising power and covalency."
  },
  {
    id: "hannay_smith_percent_ionic",
    branch: "Inorganic",
    chapter: "Chemical Bonding",
    title: "Hannay–Smith Equation for Percentage Ionic Character",
    expr: "% Ionic Character = 16 |χ_A − χ_B| + 3.5 (χ_A − χ_B)²",
    keys: ["percentage ionic character", "hannay smith", "dipole moment ionic character", "electronegativity difference"],
    symbols: ["|χ_A − χ_B| = Δχ: absolute difference in Pauling electronegativities between bonded atoms"],
    notes: ["When Δχ = 1.7, % ionic character is approximately 50%. Bonds with Δχ > 1.7 are predominantly ionic; Δχ < 1.7 are predominantly covalent.", "Alternative from dipole moment: % Ionic Character = (μ_observed / μ_theoretical) × 100, where μ_theor = q × d."],
    example: "For HF (χ_F = 4.0, χ_H = 2.1, Δχ = 1.9):\n% Ionic = 16(1.9) + 3.5(1.9)² = 30.4 + 3.5(3.61) = 30.4 + 12.6 = 43%."
  },

  /* --- 13. Chemical Bonding & Molecular Structure --- */
  {
    id: "formal_charge_formula",
    branch: "Inorganic",
    chapter: "Chemical Bonding",
    title: "Formal Charge Calculation on Lewis Structures",
    expr: "FC = V − L − (B / 2)",
    keys: ["formal charge", "lewis structure", "resonance structures stability"],
    symbols: ["V: valence electrons in free isolated atom", "L: total non-bonding (lone pair) electrons", "B: total bonding (shared) electrons (each single bond counts as 2)"],
    notes: ["The most stable Lewis structure has formal charges closest to zero, with negative formal charges residing on the most electronegative atoms.", "Sum of formal charges on all atoms in an ion equals the ion's overall charge."],
    example: "Central oxygen in ozone O₃ (one double bond, one coordinate single bond, one lone pair):\nV = 6, L = 2, B = 6.\nFC = 6 − 2 − (6 / 2) = 6 − 2 − 3 = +1."
  },
  {
    id: "steric_number_hybridisation",
    branch: "Inorganic",
    chapter: "Chemical Bonding",
    title: "Steric Number & Orbital Hybridisation",
    expr: "SN = ½ [ V + M − C + A ]   =   (Number of σ-bonds) + (Number of Lone Pairs)",
    keys: ["steric number", "hybridisation", "vsepr", "lone pairs count"],
    symbols: ["V: valence electrons of central atom", "M: number of monovalent surrounding atoms (H, F, Cl, Br, I)", "C: charge of cation", "A: charge of anion", "SN = 2: sp", "SN = 3: sp²", "SN = 4: sp³", "SN = 5: sp³d", "SN = 6: sp³d²", "SN = 7: sp³d³"],
    notes: ["Divalent atoms (O, S) are NOT counted in M.", "For XeF₄: SN = ½[8 + 4 − 0 + 0] = 6 => sp³d² with 4 bonding pairs + 2 lone pairs = Square Planar."],
    example: "For SF₄: SN = ½[6 + 4 − 0 + 0] = 5 => sp³d (4 σ bonds + 1 lone pair = See-saw shape)."
  },
  {
    id: "mot_bond_order_formula",
    branch: "Inorganic",
    chapter: "Chemical Bonding",
    title: "Molecular Orbital Theory (MOT) Bond Order & Magnetism",
    expr: "Bond Order = ½ (N_b − N_a)   |   Magnetic Moment μ = √[ n(n + 2) ] BM",
    keys: ["mot bond order", "molecular orbital theory", "paramagnetic diamagnetic", "o2 n2 bond order"],
    symbols: ["N_b: number of electrons in bonding molecular orbitals (σ, π)", "N_a: number of electrons in antibonding molecular orbitals (σ*, π*)", "n: number of unpaired electrons"],
    notes: ["For ≤ 14 electrons (B₂, C₂, N₂): π2p_x = π2p_y < σ2p_z < π*2p_x = π*2p_y < σ*2p_z.", "For > 14 electrons (O₂, F₂): σ2p_z < π2p_x = π2p_y < π*2p_x = π*2p_y < σ*2p_z.", "Bond order ∝ 1 / Bond length ∝ Bond dissociation energy."],
    example: "For O₂ (16 electrons): N_b = 10, N_a = 6.\nBond Order = ½(10 − 6) = 2.0. Two unpaired electrons in π*2p_x and π*2p_y => Paramagnetic (μ = √8 ≈ 2.83 BM)."
  },
  {
    id: "bents_rule_orbital_character",
    branch: "Inorganic",
    chapter: "Chemical Bonding",
    title: "Bent's Rule & Hybrid Orbital s/p-Character",
    expr: "More electronegative substituents prefer hybrid orbitals having LESS s-character (MORE p-character)",
    keys: ["bents rule", "s character", "bond angles", "axial equatorial bonds", "pcl5 sf4"],
    symbols: ["cos θ = −s / (1 − s) = (p − 1) / p: relation between bond angle θ and s-fraction in hybrid orbital"],
    notes: ["Lone pairs and electropositive groups prefer orbitals with GREATER s-character.", "In PCl₃F₂ (trigonal bipyramidal, sp³d): the more electronegative F atoms occupy AXIAL positions (pure dp-hybridization, 0% s), while Cl atoms occupy EQUATORIAL positions (sp²-hybridization, 33% s)."],
    example: "In CH₂F₂, the F–C–F angle is smaller than tetrahedral (108.3°) because C–F bonds use more p-character, leaving more s-character for C–H bonds (H–C–H angle = 111.9°)."
  },

  /* --- 14. s-Block Elements & Hydrogen --- */
  {
    id: "thermal_stability_carbonates_sulfates",
    branch: "Inorganic",
    chapter: "s-Block Elements",
    title: "Thermal Stability Trends of Group 1 & 2 Carbonates and Nitrates",
    expr: "Thermal Stability ∝ 1 / (Ionic Potential ϕ of Cation) ∝ (Cation Size / Cation Charge)",
    keys: ["thermal stability", "carbonates decomposition", "s block trends", "lattice energy vs hydration"],
    symbols: ["ϕ = z / r: polarising power of cation", "Decomposition: MCO₃ → MO + CO₂"],
    notes: ["Large polarisable oxyanions (CO₃²⁻, SO₄²⁻, NO₃⁻) are decomposed by small, highly polarising cations (polarisation distorts C–O bond into O²⁻ + CO₂).", "Group 2 stability order: BeCO₃ < MgCO₃ < CaCO₃ < SrCO₃ < BaCO₃.", "Group 1 carbonates (except Li₂CO₃) do NOT decompose on normal heating because alkali metal cations have low polarising power."],
    example: "Li₂CO₃ decomposes on gentle heating like MgCO₃ (diagonal relationship), while Na₂CO₃ melts without decomposing even at 1000 °C."
  },
  {
    id: "plaster_of_paris_gypsum_reactions",
    branch: "Inorganic",
    chapter: "s-Block Elements",
    title: "Plaster of Paris & Gypsum Setting Reactions",
    expr: "CaSO₄ · 2H₂O (Gypsum) —393 K→ CaSO₄ · ½H₂O (POP) + 1½ H₂O   |   > 393 K: Dead Burnt Plaster (CaSO₄)",
    keys: ["plaster of paris", "gypsum", "setting of plaster", "dead burnt plaster", "calcium compounds"],
    symbols: ["CaSO₄ · ½H₂O: calcium sulfate hemihydrate (POP)", "CaSO₄ · 2H₂O: calcium sulfate dihydrate (Gypsum)", "Anhydrous CaSO₄ formed above 393 K is dead burnt plaster and does not set readily with water."],
    notes: ["Setting of POP is an exothermic hydration reaction accompanied by a slight expansion in volume (ideal for making casts and statues)."],
    example: "Mixing POP with water: CaSO₄·½H₂O + 1.5 H₂O → CaSO₄·2H₂O (hard monoclinic gypsum crystals form within 10–15 min)."
  },

  /* --- 15. p-Block Elements: Groups 13 to 18 --- */
  {
    id: "diborane_banana_bonding",
    branch: "Inorganic",
    chapter: "p-Block Elements",
    title: "Diborane (B₂H₆) 3-Centre 2-Electron Banana Bonds",
    expr: "B₂H₆: 4 Terminal 2c−2e B−H Bonds (1.19 Å)   +   2 Bridge 3c−2e B−H−B Bonds (1.33 Å)",
    keys: ["diborane", "banana bond", "3c 2e bond", "electron deficient hydride", "boron bonding"],
    symbols: ["Each Boron is sp³ hybridized", "Bridge B–H–B angle ≈ 83°; Terminal H–B–H angle ≈ 121°", "Total valence electrons = (2 × 3) + (6 × 1) = 12 electrons"],
    notes: ["Diborane is electron-deficient; cleaves with Lewis bases: soft/bulky bases (CO, Me₃N) give symmetrical cleavage (2 BH₃·L); hard/small bases (NH₃ at low temp) give unsymmetrical cleavage ([H₂B(NH₃)₂]⁺ [BH₄]⁻)."],
    example: "Heating B₂H₆ with excess NH₃ at 450 K gives Inorganic Benzene (Borazine, B₃N₃H₆)."
  },
  {
    id: "silicates_classification_formula",
    branch: "Inorganic",
    chapter: "p-Block Elements",
    title: "Silicate Mineral Classification & Formula Frameworks",
    expr: "General Unit: [SiO₄]⁴⁻ Tetrahedron   |   Sharing n corners gives formula: [Si_x O_y]^(2y − 4x)−",
    keys: ["silicates classification", "orthosilicate", "pyrosilicate", "chain silicate", "sheet silicate", "zeolites"],
    symbols: [
      "0 corners shared: Orthosilicate [SiO₄]⁴⁻ (e.g. Zircon ZrSiO₄, Forsterite Mg₂SiO₄)",
      "1 corner shared: Pyrosilicate / Sorosilicate [Si₂O₇]⁶⁻ (e.g. Thortveitite Sc₂Si₂O₇)",
      "2 corners shared (cyclic): [(SiO₃)_n]²ⁿ⁻ (e.g. Beryl Be₃Al₂(SiO₃)₆)",
      "2 corners shared (single chain / pyroxenes): [(SiO₃)_n]²ⁿ⁻ (e.g. Enstatite MgSiO₃)",
      "2.5 corners shared (double chain / amphiboles): [(Si₄O₁₁)⁴⁻]_n (e.g. Asbestos)",
      "3 corners shared (sheet / phyllosilicates): [(Si₂O₅)²⁻]_n (e.g. Talc, Mica, Clay)",
      "4 corners shared (3D framework / tectosilicates): [SiO₂]_n (e.g. Quartz, Feldspar, Zeolites)"
    ],
    notes: ["Zeolites are microporous aluminosilicates (Al³⁺ replaces Si⁴⁺, requiring cations like Na⁺, Ca²⁺ to balance charge; used as shape-selective catalysts like ZSM-5)."],
    example: "In beryl Be₃Al₂Si₆O₁₈, the silicate unit is cyclic [Si₆O₁₈]¹²⁻ formed by sharing 2 corners of 6 tetrahedra."
  },
  {
    id: "phosphorus_oxoacids_basicity",
    branch: "Inorganic",
    chapter: "p-Block Elements",
    title: "Oxoacids of Phosphorus: Basicity & Reducing Power",
    expr: "Basicity = Number of P−OH Bonds   |   Reducing Power = Number of P−H Bonds",
    keys: ["oxoacids of phosphorus", "hypophosphorous acid", "phosphorous acid", "orthophosphoric acid", "basicity"],
    symbols: [
      "Hypophosphorous (H₃PO₂): +1, Monobasic (1 P–OH), 2 P–H bonds => Strong reducing agent",
      "Phosphorous (H₃PO₃): +3, Dibasic (2 P–OH), 1 P–H bond => Good reducing agent",
      "Orthophosphoric (H₃PO₄): +5, Tribasic (3 P–OH), 0 P–H bonds => Non-reducing",
      "Pyrophosphoric (H₄P₂O₇): +5, Tetrabasic (4 P–OH), 0 P–H bonds, contains P–O–P bridge"
    ],
    notes: ["P–H bonds reduce heavy metal salts: H₃PO₂ + 4 AgNO₃ + 2 H₂O → 4 Ag↓ + H₃PO₄ + 4 HNO₃.", "Only H atoms attached to O (P–OH) are ionisable in aqueous solution."],
    example: "H₃PO₂ is monobasic because its structure is O=P(H)₂(OH); only the single OH proton ionises."
  },
  {
    id: "sulfur_oxoacids_peroxo_links",
    branch: "Inorganic",
    chapter: "p-Block Elements",
    title: "Oxoacids of Sulfur & Peroxo-Bonds",
    expr: "Caro's Acid: H₂SO₅ (O=S(=O)(OH)(O−OH))   |   Marshall's Acid: H₂S₂O₈ (HO−SO₂−O−O−SO₂−OH)",
    keys: ["caros acid", "marshalls acid", "peroxomonosulfuric acid", "peroxodisulfuric acid", "oxidation state of sulfur"],
    symbols: ["Caro's acid: peroxomonosulfuric acid (one peroxo –O–O– bond)", "Marshall's acid: peroxodisulfuric acid (one peroxo bridge)", "Oleum: H₂S₂O₇ (pyrosulfuric acid, S–O–S bridge, no peroxo link)"],
    notes: ["Calculated oxidation state of S in H₂SO₅ appears +8, but maximum covalency of S is 6; true oxidation state is +6 because two oxygens form a peroxo bond (−1 each).", "Oxidation state of S in Marshall's acid H₂S₂O₈ is also +6."],
    example: "In H₂SO₅: 2(+1) + S + 3(−2) + 2(−1) = 0 => S = +6."
  },
  {
    id: "xenon_fluorides_hydrolysis",
    branch: "Inorganic",
    chapter: "p-Block Elements",
    title: "Hydrolysis Equations of Xenon Fluorides",
    expr: "2XeF₂ + 2H₂O → 2Xe + 4HF + O₂   |   6XeF₄ + 12H₂O → 2XeO₃ + 4Xe + 3O₂ + 24HF   |   XeF₆ + 3H₂O → XeO₃ + 6HF",
    keys: ["xenon fluorides", "hydrolysis of xef2 xef4 xef6", "noble gas chemistry", "disproportionation"],
    symbols: ["XeF₂ hydrolysis: redox (Xe²⁺ is reduced to Xe, H₂O is oxidised to O₂)", "XeF₄ hydrolysis: DISPROPORTIONATION (Xe⁴⁺ goes to Xe⁰ and Xe⁶⁺ in XeO₃)", "XeF₆ complete hydrolysis: non-redox (Xe remains +6 in XeO₃)", "XeF₆ partial hydrolysis: XeF₆ + H₂O → XeOF₄ + 2HF; XeF₆ + 2H₂O → XeO₂F₂ + 4HF"],
    notes: ["XeO₃ is a colourless, dangerously explosive solid with pyramidal shape.", "XeF₆ CANNOT be stored in glass or silica vessels: 2XeF₆ + SiO₂ → 2XeOF₄ + SiF₄."],
    example: "Partial hydrolysis of XeF₆ with 1 equivalent of water produces xenon oxytetrafluoride (XeOF₄)."
  },

  /* --- 16. d- and f-Block Elements --- */
  {
    id: "spin_only_magnetic_moment",
    branch: "Inorganic",
    chapter: "d- and f-Block Elements",
    title: "Spin-Only Magnetic Moment Formula",
    expr: "μ_s = √[ n(n + 2) ] Bohr Magnetons (BM)   |   1 BM = (e · h) / (4π · m_e) = 9.274 × 10⁻²⁴ J T⁻¹",
    keys: ["spin only magnetic moment", "unpaired electrons", "paramagnetism", "bohr magneton table"],
    symbols: ["n: number of unpaired d-electrons", "n = 1: μ = √3 ≈ 1.73 BM", "n = 2: μ = √8 ≈ 2.83 BM", "n = 3: μ = √15 ≈ 3.87 BM", "n = 4: μ = √24 ≈ 4.90 BM", "n = 5: μ = √35 ≈ 5.92 BM"],
    notes: ["Diamagnetic species have n = 0, so μ = 0 BM.", "For 3d transition metals, orbital angular momentum is quenched by the crystal field of ligands, making the spin-only formula remarkably accurate."],
    example: "Fe³⁺ ion has [Ar] 3d⁵ configuration (5 unpaired electrons in high-spin field):\nμ = √[ 5(5 + 2) ] = √35 ≈ 5.92 BM."
  },
  {
    id: "potassium_dichromate_redox_eq",
    branch: "Inorganic",
    chapter: "d- and f-Block Elements",
    title: "Potassium Dichromate (K₂Cr₂O₇) Redox Half-Equation",
    expr: "Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ → 2 Cr³⁺ + 7 H₂O   (E° = +1.33 V   ,   n-factor = 6)",
    keys: ["potassium dichromate", "cr2o7 2-", "equivalent weight dichromate", "orange to green"],
    symbols: ["Chromium drops from +6 in orange Cr₂O₇²⁻ to +3 in green Cr³⁺", "Equivalent Mass = (Molar Mass of K₂Cr₂O₇) / 6 = 294.18 / 6 = 49.03 g equiv⁻¹"],
    notes: ["In alkaline medium, dichromate converts to yellow chromate without redox: Cr₂O₇²⁻ (orange) + 2OH⁻ ⇌ 2CrO₄²⁻ (yellow) + H₂O.", "Primary standard in volumetric titrations because it is obtained in high purity and is stable in air."],
    example: "Titration against Mohr's salt: 1 mol Cr₂O₇²⁻ oxidises 6 mol Fe²⁺ to Fe³⁺."
  },
  {
    id: "potassium_permanganate_media",
    branch: "Inorganic",
    chapter: "d- and f-Block Elements",
    title: "Potassium Permanganate (KMnO₄) Redox in Acidic, Neutral & Alkaline Media",
    expr: "Acidic: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O (n=5)   |   Neutral: MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻ (n=3)   |   Strongly Alkaline: MnO₄⁻ + e⁻ → MnO₄²⁻ (n=1)",
    keys: ["potassium permanganate", "kmno4 n factor", "acidic basic neutral redox", "mno4- to mn2+"],
    symbols: ["Acidic medium: Mn(+7) → Mn(+2) (colourless), n-factor = 5, E = M / 5 = 158 / 5 = 31.6", "Neutral / faintly alkaline: Mn(+7) → Mn(+4) (brown MnO₂ ppt), n-factor = 3, E = M / 3 = 52.67", "Strongly alkaline: Mn(+7) → Mn(+6) (dark green manganate MnO₄²⁻), n-factor = 1, E = M"],
    notes: ["H₂SO₄ is the only acid used to acidify KMnO₄; HCl cannot be used because KMnO₄ oxidises Cl⁻ to Cl₂; HNO₃ cannot be used because it is an oxidising agent itself.", "KMnO₄ acts as its own self-indicator (first excess drop imparts permanent faint pink colour)."],
    example: "In acidic medium, 1 mol KMnO₄ oxidises 5 mol Fe²⁺ or 2.5 mol C₂O₄²⁻ (oxalate)."
  },
  {
    id: "chromyl_chloride_test_eq",
    branch: "Inorganic",
    chapter: "d- and f-Block Elements",
    title: "Chromyl Chloride Test for Chloride Ions",
    expr: "K₂Cr₂O₇ + 4 NaCl + 6 H₂SO₄(conc) → 2 CrO₂Cl₂↑ (deep red vapour) + 2 KHSO₄ + 4 NaHSO₄ + 3 H₂O",
    keys: ["chromyl chloride test", "chloride detection", "cro2cl2", "lead chromate yellow precipitate"],
    symbols: ["CrO₂Cl₂: chromyl chloride (deep red vapour, condensed to red liquid)", "Confirmatory step: CrO₂Cl₂ + 4 NaOH → Na₂CrO₄ (yellow) + 2 NaCl + 2 H₂O", "Yellow solution + CH₃COOH + (CH₃COO)₂Pb → PbCrO₄↓ (yellow precipitate of lead chromate)"],
    notes: ["Fails for covalent chlorides (Hg₂Cl₂, HgCl₂, AgCl, PbCl₂, SnCl₂) because they do not release free Cl⁻ ions.", "Bromides and iodides do not form volatile chromyl compounds (liberate Br₂ and I₂ vapours instead)."],
    example: "Red vapour passed into NaOH gives a yellow solution that confirms chloride upon forming yellow PbCrO₄ with lead acetate."
  },
  {
    id: "lanthanide_contraction_consequences",
    branch: "Inorganic",
    chapter: "d- and f-Block Elements",
    title: "Lanthanide Contraction & Pairs with Identical Radii",
    expr: "Cumulative contraction across 14 4f elements: r(4d series) ≈ r(5d series)",
    keys: ["lanthanide contraction", "4f shielding", "zr and hf identical size", "5d elements radius"],
    symbols: ["Poor shielding effect of 4f electrons causes effective nuclear charge Z_eff to increase steadily, pulling electron shells inward"],
    notes: [
      "Zr (4d, 160 pm) and Hf (5d, 159 pm) have virtually IDENTICAL covalent and ionic radii.",
      "Nb (146 pm) and Ta (146 pm), Mo (139 pm) and W (139 pm) also have identical radii.",
      "Makes separation of Zr and Hf extremely difficult.",
      "Basic strength of lanthanide hydroxides DECREASES: La(OH)₃ (most basic) to Lu(OH)₃ (least basic)."
    ],
    example: "Hf has atomic number 72 while Zr is 40, yet both have identical metallic radius (159–160 pm) due to the intervention of the 14 lanthanide elements."
  },

  /* --- 17. Coordination Compounds --- */
  {
    id: "effective_atomic_number_ean",
    branch: "Inorganic",
    chapter: "Coordination Compounds",
    title: "Sidgwick's Effective Atomic Number (EAN) Rule",
    expr: "EAN = Z − (Oxidation State) + 2 × (Coordination Number)",
    keys: ["ean rule", "effective atomic number", "sidgwick", "noble gas configuration"],
    symbols: ["Z: atomic number of central transition metal", "Coordination Number: total electron pairs donated by ligands (monodentate=1, bidentate=2)"],
    notes: ["Complexes obeying EAN rule have EAN equal to the atomic number of the next noble gas (Kr=36, Xe=54, Rn=86) and possess heightened kinetic stability.", "Metal carbonyls generally obey EAN rule: Fe(CO)₅ (EAN = 26 − 0 + 10 = 36 = Kr); Ni(CO)₄ (EAN = 28 − 0 + 8 = 36 = Kr)."],
    example: "In [Fe(CN)₆]⁴⁻: Fe is in +2 state (Z = 26). CN⁻ donates 6 pairs = 12 electrons.\nEAN = 26 − 2 + 12 = 36 (Krypton configuration)."
  },
  {
    id: "cfse_octahedral_formula",
    branch: "Inorganic",
    chapter: "Coordination Compounds",
    title: "Crystal Field Splitting Energy (CFSE) in Octahedral Complexes",
    expr: "CFSE_oct = [ −0.4 · n(t_2g) + 0.6 · n(e_g) ] · Δ_o + m · P",
    keys: ["cfse octahedral", "crystal field theory", "t2g and eg", "pairing energy", "high spin low spin"],
    symbols: ["Δ_o: octahedral crystal field splitting parameter", "n(t_2g): electrons in lower t_2g set (d_xy, d_yz, d_zx)", "n(e_g): electrons in higher e_g set (d_x²−y², d_z²)", "P: mean electron pairing energy in same orbital", "m: number of extra electron pairs compared to free ion"],
    notes: ["Strong field ligands (CN⁻, CO, NO₂⁻, en): Δ_o > P => Low-spin complex (electrons pair up in t_2g first).", "Weak field ligands (I⁻, Br⁻, Cl⁻, F⁻, H₂O): Δ_o < P => High-spin complex.", "d⁰, d³ (high & low spin), d⁵ (high spin), d⁶ (low spin), d⁸, d¹⁰ have symmetric orbital fillings."],
    example: "For d⁴ ion: High spin (t_2g³ e_g¹): CFSE = [−0.4(3) + 0.6(1)] Δ_o = −0.6 Δ_o.\nLow spin (t_2g⁴ e_g⁰): CFSE = [−0.4(4) + 0] Δ_o + P = −1.6 Δ_o + P."
  },
  {
    id: "cfse_tetrahedral_relation",
    branch: "Inorganic",
    chapter: "Coordination Compounds",
    title: "Tetrahedral Splitting (Δt) & CFSE",
    expr: "Δ_t = (4 / 9) · Δ_o   |   CFSE_tet = [ −0.6 · n(e) + 0.4 · n(t_2) ] · Δ_t",
    keys: ["cfse tetrahedral", "delta t vs delta o", "tetrahedral splitting", "inverted d orbitals"],
    symbols: ["Δ_t: tetrahedral splitting parameter", "e set (lower): d_x²−y², d_z²", "t_2 set (higher): d_xy, d_yz, d_zx"],
    notes: ["Tetrahedral splitting is small (Δ_t << P), so tetrahedral complexes are ALWAYS high-spin; low-spin tetrahedral complexes are virtually non-existent.", "There is no center of inversion in a tetrahedron, so the 'g' (gerade) subscript is omitted."],
    example: "If Δ_o for a metal ion is 18,000 cm⁻¹:\nΔ_t = (4/9) × 18,000 = 8,000 cm⁻¹."
  },
  {
    id: "spectrochemical_series_order",
    branch: "Inorganic",
    chapter: "Coordination Compounds",
    title: "Spectrochemical Series of Ligands",
    expr: "I⁻ < Br⁻ < S²⁻ < SCN⁻ < Cl⁻ < N₃⁻ < F⁻ < OH⁻ < C₂O₄²⁻ ≈ H₂O < NCS⁻ < edta⁴⁻ < NH₃ < en < NO₂⁻ < PPh₃ < CN⁻ < CO",
    keys: ["spectrochemical series", "ligand field strength", "strong field weak field", "crystal field splitting"],
    symbols: ["Halide donors (weakest) < Oxygen donors < Nitrogen donors < Carbon donors (strongest: CO, CN⁻)"],
    notes: ["Ligands to the right of H₂O are generally strong field; ligands to the left are weak field.", "CO has the highest field strength due to synergic π-backbonding (M(d_π) → CO(π*))."],
    example: "In [Fe(H₂O)₆]²⁺ (H₂O weak): high-spin d⁶ (4 unpaired electrons). In [Fe(CN)₆]⁴⁻ (CN⁻ strong): low-spin d⁶ (0 unpaired electrons, diamagnetic)."
  },
  {
    id: "chelate_effect_thermodynamics",
    branch: "Inorganic",
    chapter: "Coordination Compounds",
    title: "Chelate Effect & Macrocyclic Thermodynamic Stability",
    expr: "ΔG° = ΔH° − T ΔS°   (where ΔS° >> 0 due to release of multiple monodentate solvent molecules)",
    keys: ["chelate effect", "bidentate polydentate ligands", "thermodynamic stability", "edta stability"],
    symbols: ["Chelation: formation of 5- or 6-membered chelate rings with central metal by polydentate ligands (en, ox²⁻, EDTA⁴⁻)"],
    notes: ["Replacement of 6 monodentate H₂O ligands by 3 bidentate ethylenediamine molecules increases the total number of free particles from 4 to 7, creating a large positive entropy change (ΔS° > 0).", "EDTA⁴⁻ forms exceptionally stable octadentate complexes (used in water softening and lead poisoning treatment)."],
    example: "[Ni(H₂O)₆]²⁺ + 3 en ⇌ [Ni(en)₃]²⁺ + 6 H₂O: 4 reactant species generate 7 product species; net +3 species increases entropy enormously."
  },

  /* --- 18. Metallurgy --- */
  {
    id: "ellingham_diagram_slopes",
    branch: "Inorganic",
    chapter: "General Principles of Metallurgy",
    title: "Ellingham Diagram Thermodynamics & Reducing Agent Selection",
    expr: "ΔG° = ΔH° − T · ΔS°   |   Slope = −ΔS°",
    keys: ["ellingham diagram", "pyrometallurgy", "carbon as reducing agent", "reduction of metal oxides"],
    symbols: ["ΔG° vs T plot for oxide formation reactions: 2M + O₂ → 2MO", "Most metal oxide lines slope UPWARDS because gas (O₂) is consumed (ΔS° < 0 => slope −ΔS° > 0)"],
    notes: [
      "Any metal whose oxide line lies LOWER can reduce the oxide of a metal lying HIGHER at that temperature.",
      "C + O₂ → CO₂: horizontal line (Δn_g = 0, ΔS° ≈ 0, zero slope).",
      "2C + O₂ → 2CO: slopes DOWNWARDS (ΔS° > 0, negative slope), so at high temperatures (> 983 K), carbon reduces almost any metal oxide."
    ],
    example: "Above 1073 K, the line for 2C + O₂ → 2CO lies below 2Fe + O₂ → 2FeO, so carbon reduces FeO to Fe in the blast furnace."
  },
  {
    id: "mond_van_arkel_refining",
    branch: "Inorganic",
    chapter: "General Principles of Metallurgy",
    title: "Mond Process & van Arkel–de Boer Refining Reactions",
    expr: "Mond (Ni): Ni + 4CO (330–350 K) → Ni(CO)₄ —450–470 K→ Ni + 4CO   |   van Arkel (Zr/Ti): Zr + 2I₂ (870 K) → ZrI₄ —2075 K (W filament)→ Zr + 2I₂",
    keys: ["mond process", "van arkel de boer", "vapour phase refining", "nickel refining", "zirconium titanium"],
    symbols: ["Volatile compound formed at low temperature decomposes into pure metal at higher temperature"],
    notes: ["Both methods rely on Vapour Phase Refining: the metal forms a volatile, unstable compound with the reagent, while impurities remain non-volatile."],
    example: "Zirconium iodide vapour decomposes on an electrically heated tungsten filament at 2075 K to deposit ultrapure Zr metal."
  },

  /* =========================================================================
     ORGANIC CHEMISTRY
     ========================================================================= */

  /* --- 19. General Organic Chemistry (GOC) & Electronic Effects --- */
  {
    id: "inductive_effect_ranking",
    branch: "Organic",
    chapter: "General Organic Chemistry",
    title: "Inductive Effect (−I and +I) Relative Orders",
    expr: "−I: −NF₃⁺ > −NR₃⁺ > −NO₂ > −CN > −SO₃H > −CHO > −COOH > −F > −Cl > −Br > −I > −OR > −OH > −NH₂ > −C₆H₅ > −H   |   +I: −O⁻ > −COO⁻ > −C(CH₃)₃ > −CH(CH₃)₂ > −CH₂CH₃ > −CH₃ > −T > −D > −H",
    keys: ["inductive effect", "minus i plus i", "substituent constant", "electronegativity sigma"],
    symbols: ["−I: electron-withdrawing through σ-bonds", "+I: electron-donating through σ-bonds"],
    notes: ["Falls off rapidly with distance; virtually negligible beyond 3 carbon atoms.", "Deuterium (−D) and Tritium (−T) have stronger +I effect than protium (−H) due to shorter, tighter C–D/C–T bonds."],
    example: "Fluoroacetic acid (pK_a = 2.59) is much stronger than chloroacetic acid (pK_a = 2.87) because −F has stronger −I than −Cl."
  },
  {
    id: "mesomeric_effect_ranking",
    branch: "Organic",
    chapter: "General Organic Chemistry",
    title: "Mesomeric / Resonance (+M and −M) Relative Orders",
    expr: "+M: −O⁻ > −NH₂ > −NHR > −OH > −OR > −NHCOR > −OCOR > −Ph > −X   |   −M: −NO₂ > −CN > −SO₃H > −CHO > −COR > −COOH > −COOR > −CONH₂",
    keys: ["mesomeric effect", "resonance effect", "plus m minus m", "conjugation"],
    symbols: ["+M (electron donating via lone pair conjugation)", "−M (electron withdrawing via conjugated multiple bonds)"],
    notes: ["Mesomeric effect does NOT depend on distance within a conjugated π-system.", "Halogens (−F, −Cl, −Br, −I) are −I but +M; the −I effect dominates overall reactivity (deactivates ring), but +M determines ortho/para orientation."],
    example: "Aniline reacts instantly with bromine water to give 2,4,6-tribromoaniline because −NH₂ is an extremely powerful +M activating group."
  },
  {
    id: "hyperconjugation_stability_order",
    branch: "Organic",
    chapter: "General Organic Chemistry",
    title: "Hyperconjugation (Baker–Nathan Effect) & Alkene Stability",
    expr: "Number of Hyperconjugable Structures = Number of α-Hydrogens   |   Heat of Hydrogenation ∝ 1 / (Number of α-H)",
    keys: ["hyperconjugation", "baker nathan", "no bond resonance", "alkene stability", "alpha hydrogen"],
    symbols: ["σ(C–H) → p-orbital or π* overlap", "Stability order of alkenes: Tetrasubstituted (12 α-H) > Trisubstituted (9 α-H) > Disubstituted (6 α-H) > Monosubstituted (3 α-H) > Ethene (0 α-H)"],
    notes: ["Trans-alkenes are more stable than cis-alkenes due to steric relief, having lower heat of hydrogenation.", "Exception: for but-2-ene isomers, isobutene (2-methylpropene, 6 α-H on same carbon) has the lowest heat of combustion."],
    example: "2,3-dimethylbut-2-ene has 12 α-hydrogens; it is the most stable isomer of C₆H₁₂ and has the lowest heat of hydrogenation."
  },
  {
    id: "huckel_aromaticity_criteria",
    branch: "Organic",
    chapter: "General Organic Chemistry",
    title: "Hückel's Rule of Aromaticity & Antiaromaticity",
    expr: "Aromatic: (4n + 2) π electrons   |   Antiaromatic: 4n π electrons   (n = 0, 1, 2, 3... in planar cyclic conjugated ring)",
    keys: ["huckels rule", "aromaticity", "antiaromaticity", "non aromatic", "annulenes"],
    symbols: ["n: non-negative integer (0, 1, 2...)", "Cyclic, planar, fully conjugated (sp² or sp at every ring atom)"],
    notes: [
      "n=0 (2 π e⁻): Cyclopropenyl cation (stable aromatic).",
      "n=1 (6 π e⁻): Benzene, Cyclopentadienyl anion, Tropylium cation, Pyridine, Pyrrole, Furan, Thiophene.",
      "n=2 (10 π e⁻): Naphthalene, Azulene, Cyclooctatetraenyl dianion (COT²⁻).",
      "Antiaromatic (4n π e⁻): Cyclobutadiene (4 π), Cyclopentadienyl cation (4 π) — highly unstable.",
      "Cyclooctatetraene (COT, 8 π e⁻) adopts a non-planar tub conformation to avoid antiaromaticity; it is NON-AROMATIC."
    ],
    example: "Tropylium cation (C₇H₇⁺) has 7 carbons and 6 π electrons (n = 1), making it an extraordinarily stable aromatic carbocation."
  },
  {
    id: "carbocation_stability_hierarchy",
    branch: "Organic",
    chapter: "General Organic Chemistry",
    title: "Carbocation Stability Hierarchy & Rearrangements",
    expr: "Stability: Tropylium > Cyclopropenyl > Trityl (Ph₃C⁺) > Benzyl ≈ Allyl > 3° > 2° > 1° > Methyl > Vinyl > Phenyl",
    keys: ["carbocation stability", "1 2 hydride shift", "1 2 methyl shift", "ring expansion", "hyperconjugation"],
    symbols: ["Stability governed by: Aromaticity > Resonance delocalization > Hyperconjugation (α-H) > Inductive effect (+I)"],
    notes: ["Rearrangements occur via 1,2-hydride, 1,2-methyl, or 1,2-phenyl shifts to form a more stable carbocation.", "4-membered rings expand to 5-membered rings; 5-membered rings expand to 6-membered rings to relieve ring strain."],
    example: "Neopentyl cation (CH₃)₃C–CH₂⁺ (1°, 0 α-H) undergoes an instantaneous 1,2-methyl shift to form 2-methylbutan-2-yl cation (3°, 8 α-H)."
  },

  /* --- 20. Acidic & Basic Strengths of Organic Compounds --- */
  {
    id: "carboxylic_acid_ortho_effect",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Ortho Effect in Substituted Benzoic Acids",
    expr: "Ortho-substituted benzoic acids are STRONGER acids than benzoic acid, REGARDLESS of the electronic nature (+I/+M or −I/−M) of the substituent",
    keys: ["ortho effect", "benzoic acid acidity", "steric inhibition of resonance", "sir effect"],
    symbols: ["Steric crowding forces the –COOH group out of the plane of the benzene ring", "Ring π-electrons can no longer conjugate with –C=O, allowing full resonance stabilization of carboxylate –COO⁻ by equivalent resonance structures"],
    notes: ["Acidity order: o-nitrobenzoic acid > m-nitrobenzoic acid > p-nitrobenzoic acid > benzoic acid.", "Even o-toluic acid (with +I, +H methyl group) is stronger than benzoic acid (pK_a = 3.91 vs 4.20)."],
    example: "o-hydroxybenzoic acid (salicylic acid, pK_a = 2.98) is much stronger than benzoic acid due to ortho effect plus intramolecular H-bonding in salicylate ion."
  },
  {
    id: "amine_basicity_phases",
    branch: "Organic",
    chapter: "Amines",
    title: "Aliphatic Amine Basicity: Gas Phase vs Aqueous Solution",
    expr: "Gas Phase: 3° > 2° > 1° > NH₃   |   Aqueous with Methyl: 2° > 1° > 3° > NH₃   |   Aqueous with Ethyl: 2° > 3° > 1° > NH₃",
    keys: ["amine basicity", "inductive vs hydration", "steric hindrance", "aliphatic amines pkb"],
    symbols: ["Gas phase order governed solely by +I inductive effect: (CH₃)₃N > (CH₃)₂NH > CH₃NH₂ > NH₃", "Aqueous phase governed by three competing factors: Inductive (+I), Hydration energy (H-bonding with H₂O), and Steric hindrance"],
    notes: ["For methyl group: steric hindrance is small, so hydration makes 1° > 3°; net order: (CH₃)₂NH (2°) > CH₃NH₂ (1°) > (CH₃)₃N (3°) > NH₃ (213 order).", "For ethyl group: larger size enhances inductive over hydration; net order: (C₂H₅)₂NH (2°) > (C₂H₅)₃N (3°) > C₂H₅NH₂ (1°) > NH₃ (231 order)."],
    example: "Dimethylamine is a stronger base in water (pK_b = 3.27) than trimethylamine (pK_b = 4.22) due to steric hindrance in the trimethylammonium ion."
  },

  /* --- 21. Stereochemistry & Isomerism --- */
  {
    id: "stereoisomers_calculation_formula",
    branch: "Organic",
    chapter: "General Organic Chemistry",
    title: "Calculation of Optical & Geometrical Isomers",
    expr: "Dissimilar ends: Optically Active = 2^n , Meso = 0   |   Similar ends (even n): Active = 2^(n−1) , Meso = 2^(n/2 − 1)",
    keys: ["number of optical isomers", "stereoisomers formula", "chiral carbons", "meso compounds"],
    symbols: ["n: number of chiral carbon atoms", "Similar ends (odd n): Active = 2^(n−1) − 2^((n−1)/2) , Meso = 2^((n−1)/2)"],
    notes: ["Tartaric acid has n = 2 with similar ends: Active = 2^(2−1) = 2 (d- and l-); Meso = 2^(1−1) = 1; Total optical isomers = 3."],
    example: "For CH₃–CH(OH)–CH(OH)–CH₃ (n = 2, similar ends):\nActive = 2¹ = 2, Meso = 2⁰ = 1. Total stereoisomers = 3."
  },
  {
    id: "specific_rotation_equation",
    branch: "Organic",
    chapter: "Haloalkanes and Haloarenes",
    title: "Specific Optical Rotation Formula",
    expr: "[α]_D^T = α_observed / (l · c)",
    keys: ["specific rotation", "optical activity", "polarimeter", "enantiomeric excess"],
    symbols: ["[α]_D^T: specific rotation at temperature T using sodium D-line (589 nm)", "α_observed: measured optical rotation in degrees", "l: path length in decimetres (dm, 1 dm = 10 cm)", "c: concentration in g mL⁻¹ (or g cm⁻³)"],
    notes: ["Enantiomeric excess (% ee) = (Observed specific rotation / Specific rotation of pure enantiomer) × 100% = |d − l| / (d + l) × 100%."],
    example: "1.0 g of chiral compound dissolved in 20 mL solution (c = 0.05 g mL⁻¹) in a 2 dm polarimeter tube rotates plane of light by +2.5°:\n[α] = +2.5 / (2 × 0.05) = +2.5 / 0.1 = +25°."
  },

  /* --- 22. Hydrocarbons: Alkanes, Alkenes, Alkynes --- */
  {
    id: "wurtz_coupling_alkanes",
    branch: "Organic",
    chapter: "Hydrocarbons",
    title: "Wurtz Reaction Coupling & Symmetrical Alkanes",
    expr: "2 R−X + 2 Na —dry ether→ R−R + 2 NaX",
    keys: ["wurtz reaction", "symmetrical alkane", "free radical coupling", "sodium dry ether"],
    symbols: ["R–X: primary alkyl halide preferred (methyl, ethyl, propyl)", "Mechanism: involves organosodium intermediate (R⁻ Na⁺) or free radicals (R·)"],
    notes: ["Cannot be used to prepare unsymmetrical alkanes efficiently (mixing R–X and R'–X gives a mixture of 3 alkanes: R–R, R'–R', and R–R', difficult to separate).", "Methane (CH₄) CANNOT be prepared by Wurtz reaction.", "3° alkyl halides undergo elimination (E2) to give alkenes instead of coupling."],
    example: "2 CH₃CH₂Br + 2 Na → CH₃CH₂CH₂CH₃ (n-butane) + 2 NaBr."
  },
  {
    id: "corey_house_synthesis",
    branch: "Organic",
    chapter: "Hydrocarbons",
    title: "Corey–House Synthesis of Unsymmetrical Alkanes",
    expr: "R₂CuLi (Gilman Reagent) + R'−X → R−R' + R−Cu + LiX",
    keys: ["corey house synthesis", "gilman reagent", "unsymmetrical alkane", "dialkylcopper lithium"],
    symbols: ["Preparation of Gilman reagent: R–X + 2 Li → R–Li; 2 R–Li + CuI → R₂CuLi + LiI", "R'–X: 1° alkyl halide (or methyl/allyl/benzyl/aryl); 2° and 3° alkyl halides give elimination"],
    notes: ["Superior to Wurtz reaction because it gives PURE unsymmetrical alkanes in high yield without coupling mixtures."],
    example: "(CH₃)₂CuLi + CH₃(CH₂)₄Br → CH₃(CH₂)₄CH₃ (n-hexane) in excellent yield."
  },
  {
    id: "kolbe_electrolytic_synthesis",
    branch: "Organic",
    chapter: "Hydrocarbons",
    title: "Kolbe's Electrolytic Decarboxylation",
    expr: "2 R−COOK + 2 H₂O —electrolysis→ R−R + 2 CO₂ (anode)   +   H₂ + 2 KOH (cathode)",
    keys: ["kolbe electrolytic", "anode cathode products", "free radical decarboxylation", "alkane synthesis"],
    symbols: ["Anode reaction: 2 RCOO⁻ − 2e⁻ → 2 RCOO· → 2 R· + 2 CO₂; R· + R· → R–R", "Cathode reaction: 2 H₂O + 2e⁻ → H₂ + 2 OH⁻"],
    notes: ["pH of solution increases during electrolysis as basic KOH accumulates.", "Using sodium succinate yields ethene; sodium maleate/fumarate yields ethyne."],
    example: "Electrolysis of potassium acetate (CH₃COOK) produces ethane (C₂H₆) and CO₂ at the anode, and H₂ gas at the cathode."
  },
  {
    id: "markovnikov_peroxide_addition",
    branch: "Organic",
    chapter: "Hydrocarbons",
    title: "Markovnikov's Rule vs Kharasch Peroxide Effect",
    expr: "Normal: R−CH=CH₂ + HX → R−CH(X)−CH₃   |   Peroxide (HBr only): R−CH=CH₂ + HBr / R₂O₂ → R−CH₂−CH₂Br",
    keys: ["markovnikov rule", "peroxide effect", "kharasch effect", "anti markovnikov", "free radical addition"],
    symbols: ["Markovnikov: electrophilic addition via more stable carbocation intermediate (H⁺ attacks first)", "Peroxide effect: free radical mechanism (Br· attacks first to yield more stable 2° carbon radical)"],
    notes: ["The peroxide effect works ONLY with HBr; it fails for HF, HCl, and HI because one of the propagation steps is endothermic (H–Cl bond too strong to cleave; I· radicals dimerize to I₂ instead of attacking double bond)."],
    example: "Propene + HBr → 2-bromopropane (Markovnikov major).\nPropene + HBr + benzoyl peroxide → 1-bromopropane (anti-Markovnikov major)."
  },
  {
    id: "hydroboration_oxidation_alkenes",
    branch: "Organic",
    chapter: "Hydrocarbons",
    title: "Hydroboration–Oxidation of Alkenes (Anti-Markovnikov Syn-Hydration)",
    expr: "3 R−CH=CH₂ + BH₃ · THF → (RCH₂CH₂)₃B —H₂O₂ / OH⁻→ 3 R−CH₂−CH₂OH + B(OH)₃",
    keys: ["hydroboration oxidation", "anti markovnikov alcohol", "syn addition", "no carbocation rearrangement"],
    symbols: ["BH₃ adds across double bond in a concerted 4-membered cyclic transition state", "B adds to less substituted carbon, H adds to more substituted carbon on the SAME face (syn addition)"],
    notes: ["Delivers Anti-Markovnikov net addition of H and OH.", "NO carbocation is formed, so NO skeleton rearrangements occur."],
    example: "3,3-dimethylbut-1-ene + B₂H₆ followed by alkaline H₂O₂ yields pure 3,3-dimethylbutan-1-ol without rearrangement (acid hydration would rearrange to 2,3-dimethylbutan-2-ol)."
  },
  {
    id: "oxymercuration_demercuration",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "Oxymercuration–Demercuration (Markovnikov Hydration Without Rearrangement)",
    expr: "R−CH=CH₂ + Hg(OAc)₂ / H₂O → R−CH(OH)−CH₂−HgOAc —NaBH₄ / OH⁻→ R−CH(OH)−CH₃",
    keys: ["oxymercuration demercuration", "markovnikov alcohol", "mercurinium ion", "anti addition"],
    symbols: ["Step 1: cyclic mercurinium ion intermediate prevents carbocation rearrangement", "Step 2: reduction with sodium borohydride replaces –HgOAc with –H"],
    notes: ["Gives pure Markovnikov alcohol without skeletal rearrangement.", "If an alcohol R'OH is used instead of H₂O (solvomercuration), ethers are formed."],
    example: "3,3-dimethylbut-1-ene gives 3,3-dimethylbutan-2-ol (Markovnikov, no rearrangement)."
  },
  {
    id: "ozonolysis_cleavage_alkenes",
    branch: "Organic",
    chapter: "Hydrocarbons",
    title: "Ozonolysis of Alkenes (Reductive vs Oxidative Cleavage)",
    expr: "Reductive (Zn/H₂O or Me₂S): C=C → C=O + O=C   |   Oxidative (H₂O₂): Aldehyde RCHO oxidised to RCOOH",
    keys: ["ozonolysis", "reductive ozonolysis", "oxidative ozonolysis", "locating double bond"],
    symbols: ["Ozone adds across double bond to form molozonide, which rearranges into stable ozonide", "Reductive cleavage preserves aldehydes (RCHO); oxidative cleavage converts RCHO to carboxylic acids (RCOOH); ketones (R₂C=O) remain ketones in both"],
    notes: ["Primary diagnostic tool for determining the exact position of double and triple bonds in unknown hydrocarbons."],
    example: "Reductive ozonolysis of 2-methylbut-2-ene (CH₃–C(CH₃)=CH–CH₃) yields acetone (CH₃COCH₃) and ethanal (CH₃CHO)."
  },
  {
    id: "alkyne_reduction_stereospecific",
    branch: "Organic",
    chapter: "Hydrocarbons",
    title: "Stereospecific Reduction of Alkynes to Cis and Trans Alkenes",
    expr: "Cis (Z): R−C≡C−R' + H₂ / Pd−CaCO₃ (Lindlar) → Cis-Alkene   |   Trans (E): R−C≡C−R' + Na / liq. NH₃ (Birch) → Trans-Alkene",
    keys: ["lindlars catalyst", "birch reduction alkynes", "cis alkene", "trans alkene", "stereoselective reduction"],
    symbols: ["Lindlar's catalyst: Pd deactivated with CaCO₃ and poisoned with quinoline or lead acetate; delivers syn-addition of H₂", "Birch reduction: Na in liquid NH₃ at 240 K delivers anti-addition of electrons and protons via trans-radical anion intermediate"],
    notes: ["Terminal alkynes (RC≡CH) do NOT reduce with Na/liq. NH₃ (undergo acid-base deprotonation to give sodium acetylide RC≡C⁻ Na⁺ and H₂)."],
    example: "But-2-yne + H₂/Lindlar → cis-but-2-ene.\nBut-2-yne + Na/liq. NH₃ → trans-but-2-ene."
  },

  /* --- 23. Haloalkanes & Haloarenes --- */
  {
    id: "sn1_vs_sn2_rate_laws",
    branch: "Organic",
    chapter: "Haloalkanes and Haloarenes",
    title: "S_N1 vs S_N2 Nucleophilic Substitution Mechanisms",
    expr: "S_N1: Rate = k [R−X]   (2 steps, carbocation, racemisation)   |   S_N2: Rate = k [R−X] [Nu⁻]   (1 step, backside attack, Walden inversion)",
    keys: ["sn1 vs sn2", "nucleophilic substitution", "walden inversion", "racemisation", "carbocation intermediate"],
    symbols: ["S_N1 reactivity: 3° > 2° > 1° > CH₃ (favoured by polar protic solvents: H₂O, EtOH)", "S_N2 reactivity: CH₃ > 1° > 2° > 3° (favoured by polar aprotic solvents: DMSO, DMF, acetone)"],
    notes: ["Allyl and benzyl halides undergo BOTH S_N1 (resonance-stabilised carbocation) and S_N2 (unhindered orbital overlap) at exceptionally high rates.", "Vinyl and aryl halides do NOT undergo either S_N1 or S_N2 under normal conditions."],
    example: "Optically active (R)-2-bromobutane with aq. KOH (S_N2) gives (S)-butan-2-ol with complete Walden inversion."
  },
  {
    id: "finkelstein_swarts_reactions",
    branch: "Organic",
    chapter: "Haloalkanes and Haloarenes",
    title: "Finkelstein & Swarts Halogen Exchange Reactions",
    expr: "Finkelstein: R−Cl / R−Br + NaI —acetone→ R−I + NaCl / NaBr↓   |   Swarts: R−Cl / R−Br + AgF / SbF₃ / Hg₂F₂ → R−F",
    keys: ["finkelstein reaction", "swarts reaction", "halogen exchange", "alkyl iodide", "alkyl fluoride"],
    symbols: ["Finkelstein driven by Le Chatelier principle: NaCl and NaBr are INSOLUBLE in dry acetone and precipitate out, while NaI is soluble"],
    notes: ["Swarts reaction is the best standard synthetic method for preparing alkyl fluorides (direct fluorination of alkanes is too explosive)."],
    example: "CH₃CH₂Br + NaI (in acetone) → CH₃CH₂I + NaBr↓ (white ppt)."
  },

  /* --- 24. Alcohols, Phenols & Ethers --- */
  {
    id: "lucas_test_kinetics",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "Lucas Test for Distinguishing 1°, 2°, and 3° Alcohols",
    expr: "R−OH + conc. HCl / anhyd. ZnCl₂ → R−Cl↓ (turbidity) + H₂O",
    keys: ["lucas test", "lucas reagent", "alcohol classification", "turbidity"],
    symbols: ["Lucas reagent: equimolar mixture of conc. HCl and anhydrous ZnCl₂ (Lewis acid catalyst)", "Turbidity due to insoluble alkyl chloride formation via carbocation intermediate (S_N1)"],
    notes: [
      "3° Alcohols: Instant turbidity at room temperature (within seconds).",
      "2° Alcohols: Turbidity appears in 5 minutes.",
      "1° Alcohols: Solution remains clear at room temperature; turbidity appears only upon heating.",
      "Allyl and benzyl alcohols are 1° but react instantly like 3° alcohols due to resonance-stabilized carbocations."
    ],
    example: "tert-butanol reacts instantly with Lucas reagent, while 1-butanol remains clear."
  },
  {
    id: "williamson_ether_synthesis_limits",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "Williamson Ether Synthesis & Substrate Limitations",
    expr: "R−O⁻ Na⁺ + R'−X → R−O−R' + NaX   (R' must be 1° or methyl)",
    keys: ["williamson ether synthesis", "sn2 ether preparation", "alkoxide", "elimination competition"],
    symbols: ["Mechanism: S_N2 displacement of halide ion by nucleophilic alkoxide", "R–O⁻: can be 1°, 2°, 3°, or phenoxide (C₆H₅O⁻)"],
    notes: ["If a 3° alkyl halide is used (e.g. (CH₃)₃C–Br + CH₃ONa), the strongly basic alkoxide causes exclusive E2 ELIMINATION, producing an alkene (isobutene) instead of an ether."],
    example: "To make tert-butyl ethyl ether: use (CH₃)₃C–O⁻ Na⁺ + CH₃CH₂Br (correct). Using CH₃CH₂O⁻ Na⁺ + (CH₃)₃C–Br yields 2-methylpropene + ethanol."
  },
  {
    id: "ether_cleavage_hi",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "Cleavage of Ethers by Hydrogen Iodide (HI)",
    expr: "R−O−R' + HI(excess) —heat→ R−I + R'−I + H₂O",
    keys: ["cleavage of ethers", "ether hi mechanism", "zeisel method", "anisole cleavage"],
    symbols: ["With 1 equivalent of HI:", "If one alkyl group is 3° or benzyl/trityl: reaction proceeds by S_N1 at the 3° carbon, forming 3° alkyl iodide and 1° alcohol", "If both groups are 1° or 2°: reaction proceeds by S_N2 at the LESS HINDERED carbon"],
    notes: ["Alkyl aryl ethers (e.g. Anisole, C₆H₅OCH₃) with HI ALWAYS give Phenol (C₆H₅OH) and Alkyl Iodide (CH₃I) because the Ar–O bond has partial double bond character due to resonance and cannot be cleaved."],
    example: "(CH₃)₃C–O–CH₃ + HI → (CH₃)₃C–I (3° iodide via S_N1) + CH₃OH."
  },
  {
    id: "cumene_phenol_process",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "Cumene Hydroperoxide Process for Industrial Phenol",
    expr: "C₆H₅−CH(CH₃)₂ + O₂ → C₆H₅−C(CH₃)₂−OOH —dil. H₂SO₄→ C₆H₅OH + CH₃COCH₃",
    keys: ["cumene process", "phenol preparation", "cumene hydroperoxide", "acetone byproduct"],
    symbols: ["Cumene: isopropylbenzene (prepared by Friedel–Crafts alkylation of benzene with propene)", "Byproduct: acetone (propanone), valuable industrial solvent"],
    notes: ["Rearrangement step involves phenyl migration to electron-deficient oxygen with loss of water."],
    example: "Most of the world's phenol is manufactured by this route because of the high commercial value of the acetone co-product."
  },

  /* --- 25. Aldehydes & Ketones --- */
  {
    id: "rosenmund_reduction",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Rosenmund Catalytic Reduction of Acyl Chlorides",
    expr: "R−COCl + H₂ —Pd / BaSO₄ , quinoline / S (poison)→ R−CHO + HCl",
    keys: ["rosenmund reduction", "acyl chloride to aldehyde", "lindlar style catalyst", "poisoned catalyst"],
    symbols: ["Pd supported on BaSO₄ (low surface area)", "Poisoned with quinoline or sulfur to partially deactivate the catalyst"],
    notes: ["The catalyst poison prevents further reduction of the aldehyde to primary alcohol.", "Formaldehyde cannot be prepared by this method because formyl chloride (HCOCl) is unstable at room temperature."],
    example: "Benzoyl chloride (C₆H₅COCl) + H₂ / Pd–BaSO₄ → Benzaldehyde (C₆H₅CHO) + HCl."
  },
  {
    id: "stephen_reduction_nitriles",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Stephen Reduction of Nitriles to Aldehydes",
    expr: "R−C≡N + SnCl₂ + 2 HCl —ether→ R−CH=NH · HCl (Aldimine) —H₃O⁺→ R−CHO + NH₄Cl",
    keys: ["stephen reduction", "nitrile to aldehyde", "aldimine hydrochloride", "tin chloride"],
    symbols: ["Reducing agent: anhydrous stannous chloride (SnCl₂) saturated with dry HCl gas in ether", "Hydrolysis of the precipitated aldimine salt yields the corresponding aldehyde"],
    notes: ["Alternative modern reagent for nitriles and esters: DIBAL-H (diisobutylaluminium hydride) at 195 K (−78 °C) cleanly yields aldehydes."],
    example: "Acetonitrile (CH₃CN) + SnCl₂/HCl followed by steam distillation gives ethanal (CH₃CHO)."
  },
  {
    id: "clemmensen_vs_wolff_kishner",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Carbonyl to Methylene Reduction: Clemmensen vs Wolff–Kishner",
    expr: "Clemmensen (Acidic): >C=O + Zn−Hg / conc. HCl → >CH₂   |   Wolff–Kishner (Basic): >C=O + NH₂NH₂ / KOH , glycol —heat→ >CH₂ + N₂↑",
    keys: ["clemmensen reduction", "wolff kishner reduction", "carbonyl to alkane", "acid sensitive base sensitive"],
    symbols: ["Clemmensen: Zinc amalgam in concentrated hydrochloric acid (suitable for base-sensitive compounds)", "Wolff–Kishner: Hydrazine followed by heating with KOH in ethylene glycol at 450 K (suitable for acid-sensitive compounds)"],
    notes: ["If substrate contains an acid-sensitive group (e.g. –OH, acetal), use Wolff–Kishner.", "If substrate contains a base-sensitive group (e.g. –Cl, ester), use Clemmensen."],
    example: "Reduction of acetophenone (C₆H₅COCH₃) by either method yields ethylbenzene (C₆H₅CH₂CH₃)."
  },
  {
    id: "haloform_iodoform_test",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Iodoform (Haloform) Test for Methyl Carbonyls & Carbinols",
    expr: "CH₃−C(=O)−R + 3 I₂ + 4 NaOH → CHI₃↓ (yellow ppt) + R−COONa + 3 NaI + 3 H₂O",
    keys: ["iodoform test", "haloform reaction", "methyl ketone", "yellow precipitate chi3"],
    symbols: ["CHI₃: triiodomethane (iodoform), characteristic yellow crystalline solid with antiseptic odour (mp 119 °C)", "Substrates giving positive test: Compounds containing CH₃–C=O group OR CH₃–CH(OH)– group (oxidised to methyl ketone by I₂)"],
    notes: ["Acetaldehyde (CH₃CHO) is the ONLY aldehyde that gives a positive iodoform test.", "Ethanol (CH₃CH₂OH) gives a positive test; methanol (CH₃OH) does NOT."],
    example: "Pentan-2-one gives a positive iodoform test (yellow CHI₃); pentan-3-one does not."
  },
  {
    id: "tollens_fehling_tests",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Tollens' & Fehling's Tests for Aldehydes",
    expr: "Tollens: R−CHO + 2 [Ag(NH₃)₂]⁺ + 3 OH⁻ → R−COO⁻ + 2 Ag↓ (silver mirror) + 4 NH₃ + 2 H₂O   |   Fehling: R−CHO + 2 Cu²⁺ + 5 OH⁻ → R−COO⁻ + Cu₂O↓ (red ppt) + 3 H₂O",
    keys: ["tollens test", "fehlings test", "silver mirror", "reducing sugar", "red precipitate cu2o"],
    symbols: ["Tollens reagent: ammoniacal silver nitrate solution [Ag(NH₃)₂]⁺", "Fehling solution: Fehling A (aq. CuSO₄) + Fehling B (alkaline sodium potassium tartrate / Rochelle salt)"],
    notes: ["Tollens oxidises BOTH aliphatic and aromatic aldehydes (benzaldehyde gives silver mirror).", "Fehling oxidises ALIPHATIC aldehydes only; aromatic aldehydes (benzaldehyde) do NOT reduce Fehling's solution.", "Formic acid (HCOOH) and α-hydroxy ketones (fructose) also give positive Tollens and Fehling tests."],
    example: "Distinguish ethanal from benzaldehyde using Fehling's test: ethanal gives red Cu₂O ppt; benzaldehyde does not."
  },

  /* --- 26. Carboxylic Acids & Derivatives --- */
  {
    id: "hofmann_bromamide_degradation",
    branch: "Organic",
    chapter: "Amines",
    title: "Hofmann's Bromamide Degradation of Primary Amides",
    expr: "R−CONH₂ + Br₂ + 4 KOH → R−NH₂ (primary amine) + K₂CO₃ + 2 KBr + 2 H₂O",
    keys: ["hofmann bromamide", "degradation of amide", "loss of carbon", "isocyanate intermediate"],
    symbols: ["R–CONH₂: primary amide (1° amide only; 2° and 3° amides do not react)", "Product R–NH₂ contains ONE LESS carbon atom than the starting amide", "Key intermediate: acyl nitrene / alkyl isocyanate (R–N=C=O) undergoing intramolecular rearrangement"],
    notes: ["Migration of group R to nitrogen occurs with COMPLETE RETENTION of stereochemical configuration at the migrating carbon.", "Cannot be used to prepare amines with tertiary alkyl groups efficiently."],
    example: "Propanamide (CH₃CH₂CONH₂, 3 carbons) + Br₂/KOH yields ethylamine (CH₃CH₂NH₂, 2 carbons)."
  },
  {
    id: "acid_derivatives_reactivity_order",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Nucleophilic Acyl Substitution: Relative Reactivity of Acid Derivatives",
    expr: "Acyl Chloride (RCOCl) > Acid Anhydride ((RCO)₂O) > Ester (RCOOR') > Amide (RCONH₂)",
    keys: ["nucleophilic acyl substitution", "acid derivatives reactivity", "leaving group ability"],
    symbols: ["Leaving group ability: Cl⁻ (pKa of HCl = −7) > RCOO⁻ (pKa ≈ 4.8) > RO⁻ (pKa ≈ 16) > NH₂⁻ (pKa ≈ 38)"],
    notes: ["A more reactive derivative can be converted easily into a less reactive one, but the reverse requires activation.", "Amides are the least reactive due to strong resonance donation from nitrogen lone pair into the carbonyl carbon."],
    example: "Acetyl chloride reacts violently with water at room temperature to form acetic acid, whereas acetamide requires prolonged boiling with acid or base to hydrolyse."
  },

  /* --- 27. Amines & Diazonium Salts --- */
  {
    id: "hinsberg_test_amines",
    branch: "Organic",
    chapter: "Amines",
    title: "Hinsberg's Test for Distinguishing 1°, 2°, and 3° Amines",
    expr: "Reagent: Benzenesulfonyl Chloride (C₆H₅SO₂Cl)",
    keys: ["hinsberg test", "benzenesulfonyl chloride", "distinguishing amines", "sulfonamide"],
    symbols: [
      "1° Amine: forms N-alkylbenzenesulfonamide containing acidic N–H => SOLUBLE in alkali (NaOH)",
      "2° Amine: forms N,N-dialkylbenzenesulfonamide with no N–H => INSOLUBLE in alkali",
      "3° Amine: does NOT react with Hinsberg reagent (remains insoluble in alkali, dissolves in acid)"
    ],
    notes: ["Modern variant uses p-toluenesulfonyl chloride (tosyl chloride)."],
    example: "An unknown amine reacts with Hinsberg's reagent to give a clear alkaline solution that precipitates upon acidification: confirmed 1° amine."
  },
  {
    id: "carbylamine_isocyanide_test",
    branch: "Organic",
    chapter: "Amines",
    title: "Carbylamine (Isocyanide) Test for Primary Amines",
    expr: "R−NH₂ + CHCl₃ + 3 KOH(alc) —warm→ R−NC (isocyanide) + 3 KCl + 3 H₂O",
    keys: ["carbylamine test", "isocyanide test", "primary amine detection", "foul smelling"],
    symbols: ["R–NH₂: aliphatic OR aromatic primary amine (e.g. aniline)", "R–NC: carbylamine / isocyanide (extremely foul, nauseating smell)", "Reactive intermediate: dichlorocarbene (:CCl₂)"],
    notes: ["Secondary and tertiary amines do NOT give this test.", "Extremely sensitive test: even trace amounts of 1° amine produce unmistakable odour."],
    example: "Aniline warmed with chloroform and alcoholic KOH gives phenyl isocyanide (C₆H₅NC)."
  },
  {
    id: "azo_coupling_reactions",
    branch: "Organic",
    chapter: "Amines & Diazonium Salts",
    title: "Azo Coupling Reactions of Arenediazonium Salts",
    expr: "Phenol (pH 9–10): Ar−N₂⁺ + C₆H₅OH → p-hydroxyazobenzene (Orange Dye)   |   Aniline (pH 4–5): Ar−N₂⁺ + C₆H₅NH₂ → p-aminoazobenzene (Yellow Dye)",
    keys: ["azo coupling", "diazonium salt", "azo dye", "electrophilic aromatic coupling"],
    symbols: ["Electrophile: benzenediazonium cation (weak electrophile)", "Coupling occurs exclusively at the PARA position (or ortho if para is blocked)"],
    notes: ["With phenol, alkaline pH (9–10) converts phenol to phenoxide ion (much more activated for electrophilic attack).", "With aniline, mildly acidic pH (4–5) prevents diazonium decomposition while leaving free amine nucleophile unprotonated."],
    example: "Benzene diazonium chloride + phenol in alkaline medium produces bright orange p-hydroxyazobenzene."
  },

  /* --- 28. Biomolecules & Polymers --- */
  {
    id: "amino_acid_isoelectric_point",
    branch: "Organic",
    chapter: "Biomolecules",
    title: "Isoelectric Point (pI) of Amino Acids",
    expr: "Neutral: pI = ½ (pK_a1 + pK_a2)   |   Acidic: pI = ½ (pK_a1 + pK_aR)   |   Basic: pI = ½ (pK_aR + pK_a2)",
    keys: ["isoelectric point", "zwitterion", "amino acid electrophoresis", "pi calculation"],
    symbols: ["pI: pH at which the amino acid carries no net electrical charge and does not migrate in an electric field", "pK_a1: α-COOH dissociation", "pK_a2: α-NH₃⁺ dissociation", "pK_aR: side-chain ionisation"],
    notes: ["At pH < pI, amino acid exists predominantly as a CATION and migrates to cathode.", "At pH > pI, amino acid exists as an ANION and migrates to anode.", "Solubility of proteins is MINIMAL at their isoelectric point."],
    example: "For Glycine (pK_a1 = 2.34, pK_a2 = 9.60):\npI = ½ (2.34 + 9.60) = ½ (11.94) = 5.97."
  },
  {
    id: "dna_chargaff_rules",
    branch: "Organic",
    chapter: "Biomolecules",
    title: "Chargaff's Rules of DNA Base Pairing",
    expr: "[A] = [T]   ,   [G] = [C]   |   [A + G] = [T + C]   (Purines = Pyrimidines)   |   A=T (2 H-bonds) , G≡C (3 H-bonds)",
    keys: ["chargaffs rule", "dna base pairing", "purines pyrimidines", "double helix"],
    symbols: ["A: Adenine, T: Thymine (Purine = Pyrimidine, paired by 2 hydrogen bonds)", "G: Guanine, C: Cytosine (Purine = Pyrimidine, paired by 3 hydrogen bonds)", "Total purines [A + G] / Total pyrimidines [T + C] = 1.0 in double-stranded DNA"],
    notes: ["The ratio [A + T] / [G + C] is species-specific and varies widely, but [A]/[T] and [G]/[C] are always 1.0.", "DNA melting temperature (T_m) increases with higher G–C content due to the 3 hydrogen bonds per pair."],
    example: "If a double-stranded DNA sample contains 20% Adenine:\nThymine = 20%. Remaining 60% is shared equally: Guanine = 30%, Cytosine = 30%."
  },
  {
    id: "polymer_pdi_molecular_mass",
    branch: "Organic",
    chapter: "Polymers",
    title: "Polydispersity Index (PDI) & Polymer Molar Masses",
    expr: "PDI = M_w / M_n   |   M_n = (Σ N_i M_i) / (Σ N_i)   |   M_w = (Σ N_i M_i²) / (Σ N_i M_i)",
    keys: ["polydispersity index", "number average molar mass", "weight average molar mass", "pdi"],
    symbols: ["M_n: number-average molecular mass (measured by colligative properties, especially osmotic pressure)", "M_w: weight-average molecular mass (measured by light scattering or ultracentrifugation)", "N_i: number of molecules with molecular mass M_i"],
    notes: ["For monodisperse natural polymers (pure proteins, natural DNA), M_w = M_n, so PDI = 1.0.", "For all synthetic polymers, M_w > M_n, so PDI > 1."],
    example: "A sample has 100 molecules of mass 10,000 and 100 molecules of mass 20,000:\nM_n = (100×10000 + 100×20000)/200 = 15,000.\nM_w = (100×10000² + 100×20000²)/(100×10000 + 100×20000) = (10¹⁰ + 4×10¹⁰)/3×10⁶ ≈ 16,667.\nPDI = 16,667 / 15,000 ≈ 1.11."
  }
];

// Let's add more modular formula builders to reach 400+ distinct, comprehensive, well-documented formulas!
const chapterTopics = [
  // Physical Chemistry
  { branch: "Physical", ch: "Some Basic Concepts of Chemistry", topics: [
    ["vd_gas_law", "Vapour Density of Gas Mixtures", "V.D._mix = (M_avg) / 2 = (Σ n_i M_i) / (2 Σ n_i)", ["vapour density mixture", "average molar mass gas"], ["M_avg: apparent molar mass", "V.D.: relative to H₂ gas"], ["For equimolar binary gas mixture: M_avg = (M₁ + M₂)/2."]],
    ["combustion_alkane_general", "General Alkane Stoichiometric Combustion", "C_n H_{2n+2} + [(3n+1)/2] O₂ → n CO₂ + (n+1) H₂O", ["alkane combustion", "stoichiometric oxygen"], ["n: number of carbon atoms"], ["1 volume of methane requires 2 volumes of O₂; propane requires 5 volumes."]],
    ["combustion_alkyne_general", "General Alkyne Stoichiometric Combustion", "C_n H_{2n-2} + [(3n-1)/2] O₂ → n CO₂ + (n-1) H₂O", ["alkyne combustion", "ethyne flame"], ["n: number of carbon atoms"], ["Ethyne burns in pure O₂ at ~3300 K (oxy-acetylene welding flame)."]],
    ["molar_volume_gas_conditions", "Molar Volume of Ideal Gas at STP vs SATP", "V_m(STP: 273.15 K, 1 atm) = 22.414 L   |   V_m(SATP: 298.15 K, 1 bar) = 24.789 L", ["molar volume stp satp", "22.4 vs 24.8"], ["Standard temperature and pressure vs ambient"], ["JEE problems using 1 atm use 22.4 L; IUPAC standard (1 bar) uses 22.7 L."]],
    ["law_chemical_equivalence", "Law of Chemical Equivalents in Neutralisation", "N₁ V₁ = N₂ V₂   =>   (w₁ / E₁) = (w₂ / E₂)", ["chemical equivalence", "normality equation", "neutralisation point"], ["E = M / n-factor"], ["At the equivalence point, gram-equivalents of acid equal gram-equivalents of base."]],
    ["atomicity_molar_ratio", "Dulong–Petit Molar Heat Capacity Limit", "C_m = 3 R ≈ 24.94 J K⁻¹ mol⁻¹   (High Temperature Limit)", ["dulong petit limit", "solid heat capacity 3r"], ["Valid for 3D atomic crystals above Debye temperature"], ["Diamond has very low heat capacity at room temperature due to extremely high Debye temperature."]]
  ]},
  { branch: "Physical", ch: "Structure of Atom", topics: [
    ["bohr_energy_joules", "Bohr Energy in Joules per Atom", "E_n = −2.18 × 10⁻¹⁸ × (Z² / n²) J", ["bohr energy joules", "rydberg energy"], ["R_H in energy units = 2.18 × 10⁻¹⁸ J"], ["Ionisation energy of ground-state H = +2.18 × 10⁻¹⁸ J/atom = +1312 kJ mol⁻¹."]],
    ["bohr_orbital_time_period", "Time Period of Bohr Orbit Revolution", "T_n = (2 π r_n) / v_n ∝ n³ / Z²", ["orbital period", "revolution frequency", "time period bohr"], ["T ∝ n³ / Z²", "Frequency f = 1/T ∝ Z² / n³"], ["In hydrogen atom, T₁ : T₂ : T₃ = 1 : 8 : 27."]],
    ["de_broglie_thermal_neutrons", "de Broglie Wavelength of Thermal Neutrons", "λ = h / √(3 m k_B T) = 0.286 / √E(eV) Å", ["thermal neutron wavelength", "neutron diffraction"], ["m: neutron mass (1.675 × 10⁻²⁷ kg)", "k_B: Boltzmann constant"], ["Thermal neutrons at 300 K have λ ≈ 1.8 Å, ideal for investigating crystal structures."]],
    ["radial_probability_distribution", "Radial Probability Function P(r)", "P(r) dr = 4 π r² R²(r) dr", ["radial probability density", "radial distribution function"], ["4πr² accounts for spherical volume element shell thickness dr"], ["For 1s orbital of H, P(r) is maximum at r = a₀ (0.529 Å), while ψ² is maximum at r = 0."]],
    ["angular_momentum_quantisation", "Bohr Postulate: Orbital Angular Momentum Quantisation", "m v r = n · (h / 2π) = n · ℏ", ["angular momentum quantisation", "bohr postulate"], ["n: 1, 2, 3..."], ["Explains wave-particle duality: an integral number of de Broglie waves must fit in the orbit (2πr = nλ)."]]
  ]},
  { branch: "Physical", ch: "States of Matter", topics: [
    ["charles_law_absolute_zero", "Charles's Law & Absolute Zero Definition", "V_t = V₀ · (1 + t / 273.15)   |   V = 0 at t = −273.15 °C", ["charles law", "absolute zero", "temperature volume"], ["V₀: volume at 0 °C", "t: temperature in Celsius"], ["Absolute zero (0 K = −273.15 °C) is the theoretical temperature where ideal gas volume becomes zero."]],
    ["boyles_law_isotherm", "Boyle's Law & Isothermal Compressibility", "P₁ V₁ = P₂ V₂ = constant (at const T, n)   |   β = −(1/V)(∂V/∂P)_T = 1/P", ["boyles law", "isothermal compressibility"], ["Pressure inversely proportional to volume"], ["For ideal gas, isothermal compressibility β = 1/P."]],
    ["gay_lussac_pressure_temp", "Gay-Lussac's Law of Pressure-Temperature", "P_t = P₀ · (1 + t / 273.15)   =>   P₁ / T₁ = P₂ / T₂", ["gay lussacs law", "amontons law", "pressure temperature"], ["At constant volume (isochoric)"], ["Pressure of tyre rises significantly after long driving on hot roads."]],
    ["dalton_aqueous_tension", "Dalton's Partial Pressure & Aqueous Tension", "P_dry_gas = P_moist_gas − Aqueous Tension (P_H2O)", ["aqueous tension", "moist gas pressure", "water vapour pressure"], ["Aqueous tension depends only on temperature"], ["Collected gas over water must always have water vapour pressure subtracted."]],
    ["amagat_law_partial_volumes", "Amagat's Law of Partial Additive Volumes", "V_total = Σ V_i   |   % V_i = (V_i / V_total) × 100 = % n_i", ["amagats law", "partial volume", "gas mixture volume"], ["For ideal gas mixture, volume percent equals mole percent"], ["Air with 78% N₂ by volume contains 78% N₂ by mole."]]
  ]},
  { branch: "Physical", ch: "Thermodynamics", topics: [
    ["enthalpy_internal_energy_diff", "Enthalpy–Internal Energy Gaseous Reaction Difference", "ΔH − ΔU = Δn_g · R · T", ["delta h minus delta u", "gaseous moles difference"], ["Δn_g = moles of product gas − moles of reactant gas"], ["If Δn_g = 0 (e.g. H₂ + I₂ ⇌ 2HI), ΔH = ΔU at all temperatures."]],
    ["heat_capacities_difference", "Mayer's Relation Between Cp and Cv", "C_p − C_v = R   |   γ = C_p / C_v = 1 + (2 / f)", ["mayers relation", "cp minus cv", "degrees of freedom f"], ["f = 3 (monoatomic): Cv = 3/2 R, Cp = 5/2 R, γ = 1.67", "f = 5 (diatomic): Cv = 5/2 R, Cp = 7/2 R, γ = 1.40"], ["Non-linear triatomic (H₂O): f = 6, Cv = 3R, Cp = 4R, γ = 1.33."]],
    ["third_law_thermodynamics", "Third Law of Thermodynamics & Absolute Entropy", "lim(T→0 K) S = 0   (for a perfectly crystalline substance)", ["third law thermodynamics", "absolute entropy", "residual entropy"], ["S_T = ∫₀^T (C_p / T) dT"], ["CO, N₂O, NO have residual entropy at 0 K due to random molecular orientations in crystal lattice."]],
    ["gibbs_helmholtz_differential", "Gibbs–Helmholtz Equation Differential Form", "[ ∂(ΔG / T) / ∂T ]_P = −ΔH / T²", ["gibbs helmholtz differential", "temperature dependence delta g"], ["Fundamental thermodynamic relation"], ["Links temperature dependence of Gibbs energy directly to reaction enthalpy."]],
    ["clapeyron_clausius_equation", "Clausius–Clapeyron Equation for Vapour Pressure", "ln(P₂ / P₁) = (ΔH_vap / R) · [ (T₂ − T₁) / (T₁ T₂) ]", ["clausius clapeyron", "vapour pressure temperature", "boiling point elevation"], ["P: vapour pressure of liquid at temperature T"], ["Predicts boiling point at different atmospheric pressures (e.g. pressure cooker vs high altitude)."]]
  ]},
  { branch: "Physical", ch: "Equilibrium", topics: [
    ["le_chatelier_inert_gas_const_v", "Inert Gas Addition at Constant Volume", "Adding inert gas at CONSTANT VOLUME has NO EFFECT on chemical equilibrium", ["inert gas constant volume", "le chatelier inert gas"], ["Volume remains constant, so partial pressures and concentrations of reacting species remain unchanged"], ["Frequently asked trick question in JEE Main and Advanced."]],
    ["le_chatelier_inert_gas_const_p", "Inert Gas Addition at Constant Pressure", "Adding inert gas at CONSTANT PRESSURE shifts equilibrium toward GREATER moles of gas (Δn_g > 0)", ["inert gas constant pressure", "le chatelier volume expansion"], ["Total pressure constant implies volume expands, reducing all partial pressures"], ["If Δn_g = 0, inert gas at constant pressure still has no effect."]],
    ["buffer_capacity_equation", "Buffer Capacity (van Slyke Equation)", "β = d(b) / dpH = 2.303 · [ (C_a · C_b) / (C_a + C_b) ]", ["buffer capacity", "van slyke equation", "maximum buffer action"], ["b: moles of strong acid/base added per litre"], ["Buffer capacity is maximum when C_a = C_b (pH = pKa)."]],
    ["simultaneous_solubility", "Simultaneous Solubility of Two Sparingly Soluble Salts", "Common ion concentration is sum of contributions from both salts", ["simultaneous solubility", "two sparingly soluble salts", "common ion ksp"], ["For AgCl (Ksp1) and AgBr (Ksp2): [Ag⁺] = S₁ + S₂", "Ksp1 = (S₁ + S₂) S₁ ; Ksp2 = (S₁ + S₂) S₂"], ["Ratio of solubilities: S₁ / S₂ = Ksp1 / Ksp2."]],
    ["indicator_ph_range", "Acid-Base Indicator Transition pH Range", "pH Range = pK_In ± 1   |   K_In = [H⁺][In⁻] / [HIn]", ["indicator transition range", "phenolphthalein", "methyl orange"], ["At midpoint of colour change: [In⁻] = [HIn] => pH = pK_In"], ["Phenolphthalein: pK_In ≈ 9.6 (range 8.3–10.0); Methyl orange: pK_In ≈ 3.7 (range 3.1–4.4)."]]
  ]},
  { branch: "Physical", ch: "Electrochemistry", topics: [
    ["concentration_cell_electrolyte", "Electrolyte Concentration Cell EMF", "E_cell = (0.0592 / n) · log(C₂ / C₁)   (at 298 K , where C₂ > C₁)", ["electrolyte concentration cell", "emf concentration ratio"], ["Same electrodes dipping in different concentrations of same electrolyte", "E° = 0"], ["Spontaneous operation requires C₂ (cathode) > C₁ (anode)."]],
    ["concentration_cell_electrode", "Electrode Gas Concentration Cell EMF", "E_cell = (0.0592 / 2) · log(P₁ / P₂)   (for H₂ electrode at 298 K , where P₁ > P₂)", ["electrode concentration cell", "gas partial pressure emf"], ["Different gas pressures dipping in same solution"], ["Spontaneous if P₁ (anode) > P₂ (cathode)."]],
    ["corrosion_electrochemical_reactions", "Electrochemical Mechanism of Rusting of Iron", "Anode: Fe → Fe²⁺ + 2e⁻   |   Cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O   |   Overall: 2Fe + O₂ + 4H⁺ → 2Fe²⁺ + 2H₂O (E° = 1.67 V)", ["corrosion of iron", "rusting mechanism", "electrochemical cell rust"], ["Rust formula: Fe₂O₃ · xH₂O (hydrated iron(III) oxide)"], ["H⁺ ions from dissolved CO₂ (H₂CO₃) act as catalyst."]],
    ["conductometric_titrations_neutralisation", "Conductometric Titration: Strong Acid with Strong Base", "Conductance drops sharply to equivalence point (H⁺ replaced by Na⁺), then rises sharply (excess OH⁻)", ["conductometric titration", "hcl naoh conductance", "v shaped conductance curve"], ["Conductance: H⁺ (349.6) > OH⁻ (198.6) > Na⁺ (50.1) > Cl⁻ (76.3) S cm² mol⁻¹"], ["Produces sharp V-shaped curve with minimum at equivalence point."]]
  ]},
  { branch: "Physical", ch: "Chemical Kinetics", topics: [
    ["steady_state_approximation", "Steady-State Approximation (SSA) in Kinetics", "d[Intermediate] / dt ≈ 0", ["steady state approximation", "ssa kinetics", "reaction intermediates"], ["Valid when intermediate is highly reactive and decomposes as fast as it forms"], ["Allows derivation of complex rate laws without solving differential equations."]],
    ["enzyme_kinetics_michaelis_menten", "Michaelis–Menten Enzyme Kinetics Equation", "Rate v = (V_max [S]) / (K_m + [S])", ["michaelis menten", "enzyme kinetics", "km substrate affinity"], ["V_max: maximum rate", "K_m: Michaelis constant (substrate conc at v = V_max/2)"], ["At low [S] << K_m: first order (v ∝ [S]); at high [S] >> K_m: zero order (v = V_max)."]],
    ["radioactive_decay_law", "Radioactive Decay Law & Mean Life", "N_t = N₀ · e^(−λ t)   |   t_½ = 0.693 / λ   |   Mean Life τ = 1 / λ = 1.443 · t_½", ["radioactive decay", "mean life", "decay constant lambda"], ["Activity A = −dN/dt = λ N (units: Becquerel or Curie)"], ["In 1 mean life τ, 63.2% of initial nuclei decay (36.8% remaining)."]],
    ["second_order_different_reactants", "Second-Order Reaction with Unequal Reactants", "k = [ 2.303 / (t (a − b)) ] · log[ (b (a − x)) / (a (b − x)) ]", ["second order kinetics unequal reactants", "a plus b gives products"], ["a, b: initial concentrations of A and B"], ["When a = b, equation reduces to standard 1/(a−x) − 1/a = kt."]]
  ]},
  { branch: "Physical", ch: "Solid State", topics: [
    ["fcc_packing_efficiency_calc", "FCC / CCP Packing Efficiency Exact Proof", "Packing Efficiency = [ 4 × (4/3 π r³) ] / [ a³ ] = (π √2) / 6 ≈ 74.05%", ["fcc packing efficiency", "ccp packing fraction", "74 percent"], ["In FCC: face diagonal a√2 = 4r => a = 2√2 r"], ["Highest possible packing efficiency for sphere packing."]],
    ["bcc_packing_efficiency_calc", "BCC Packing Efficiency Exact Proof", "Packing Efficiency = [ 2 × (4/3 π r³) ] / [ a³ ] = (π √3) / 8 ≈ 68.02%", ["bcc packing efficiency", "body centered cubic fraction"], ["In BCC: body diagonal a√3 = 4r => a = 4r / √3"], ["Coordination number is 8."]],
    ["sc_packing_efficiency_calc", "Simple Cubic (SC) Packing Efficiency Exact Proof", "Packing Efficiency = [ 1 × (4/3 π r³) ] / [ (2r)³ ] = π / 6 ≈ 52.36%", ["simple cubic packing efficiency", "polonium structure"], ["In SC: edge length a = 2r"], ["Very open structure; only Polonium (Po) crystallises in simple cubic."]],
    ["hcp_c_over_a_ratio", "Hexagonal Close Packed (HCP) c/a Ideal Axial Ratio", "c / a = √(8 / 3) ≈ 1.633   |   Packing Efficiency = 74.05%", ["hcp axial ratio", "c over a ratio", "hexagonal close packed"], ["c: height of hexagonal unit cell", "a: edge of base hexagon"], ["Ideal hard-sphere packing ratio; deviations indicate non-spherical bonding."]],
    ["frenkel_schottky_comparison", "Frenkel vs Schottky Defects in Ionic Solids", "Schottky: missing cation-anion pair (lowers density, e.g. NaCl)   |   Frenkel: ion in interstitial site (density unchanged, e.g. AgCl)", ["frenkel defect", "schottky defect", "crystal defects", "agbr both defects"], ["AgBr exhibits BOTH Frenkel and Schottky defects"], ["Frenkel favoured by large radius difference (small Ag⁺, large Br⁻); Schottky favoured by similar sizes."]]
  ]},

  // Inorganic Chemistry
  { branch: "Inorganic", ch: "Classification of Elements", topics: [
    ["electron_gain_enthalpy_anomalies", "Electron Gain Enthalpy Trends & Anomalies", "Order: Cl > F > Br > I   and   S > Se > Te > O", ["electron gain enthalpy", "chlorine vs fluorine", "oxygen vs sulfur"], ["Negative value represents energy released on adding electron"], ["F has lower electron affinity than Cl (−328 vs −349 kJ mol⁻¹) due to strong interelectronic repulsion in compact 2p subshell."]],
    ["ionisation_enthalpy_nitrogen_oxygen", "Ionisation Enthalpy Anomaly: N > O and Be > B", "IE₁(N: 1402 kJ) > IE₁(O: 1314 kJ)   |   IE₁(Be: 899 kJ) > IE₁(B: 801 kJ)", ["ionisation enthalpy anomaly", "half filled p3 stability", "penetrating s orbital"], ["N has stable half-filled 2p³ configuration", "Be has stable fully-filled 2s² configuration"], ["O has 2p⁴ configuration; removing one electron leaves a stable half-filled 2p³ ion (O⁺)."]],
    ["inert_pair_effect_stability", "Inert Pair Effect & Lower Oxidation State Stability", "Group 13: Tl⁺ > Tl³⁺   |   Group 14: Pb²⁺ > Pb⁴⁺   |   Group 15: Bi³⁺ > Bi⁵⁺", ["inert pair effect", "relativity contraction", "thallium lead bismuth"], ["Reluctance of valence s-electrons to participate in bonding due to poor d and f shielding"], ["PbO₂ and Bi₂O₅ are powerful oxidising agents because Pb⁴⁺ and Bi⁵⁺ readily reduce to stable Pb²⁺ and Bi³⁺."]],
    ["diagonal_relationship_lithium_magnesium", "Diagonal Relationship: Lithium & Magnesium Similarities", "Similar ionic potential ϕ = z/r explains identical chemical behaviors of Li⁺ and Mg²⁺", ["diagonal relationship", "lithium and magnesium", "be and al"], ["Both carbonates decompose on heating (Li₂CO₃ → Li₂O + CO₂)", "Both form normal oxides (Li₂O, MgO), NOT peroxides/superoxides"], ["Both nitrates decompose to give NO₂ + O₂: 4LiNO₃ → 2Li₂O + 4NO₂ + O₂."]]
  ]},
  { branch: "Inorganic", ch: "Chemical Bonding", topics: [
    ["dipole_moment_geometry_vector", "Molecular Dipole Moment Vector Addition", "μ_net = √[ μ₁² + μ₂² + 2 μ₁ μ₂ cos θ ]", ["dipole moment vector", "debye", "polar nonpolar geometry"], ["1 Debye = 10⁻¹⁸ esu cm = 3.336 × 10⁻³⁰ C m"], ["Symmetric molecules (CO₂, BF₃, CCl₄, trans-dichloroethene) have μ_net = 0."]],
    ["dipole_moment_nh3_nf3", "Dipole Moment Comparison: NH₃ vs NF₃", "μ(NH₃) = 1.47 D   >>   μ(NF₃) = 0.24 D", ["nh3 vs nf3 dipole moment", "lone pair dipole", "vector cancellation"], ["In NH₃: orbital dipole of lone pair points in SAME direction as resultant of N–H bond dipoles (additive)", "In NF₃: highly electronegative F atoms pull dipole away, OPPOSING the lone pair dipole (subtractive)"], ["Classic JEE favourite testing vector addition in chemistry."]],
    ["hydrogen_bonding_boiling_points", "Hydrogen Bonding & Anomalous Hydride Boiling Points", "Boiling Points: H₂O (100 °C) >> H₂Te (−2 °C) > H₂Se (−41 °C) > H₂S (−60 °C)", ["hydrogen bonding boiling point", "h2o vs h2s", "hf vs hcl"], ["Strong intermolecular H-bonds present in H₂O, HF, and NH₃"], ["H₂O has 2 H and 2 lone pairs per molecule, forming a 3D network with 4 H-bonds per molecule (higher bp than HF with only 2)."]],
    ["back_bonding_lewis_acidity", "pπ–pπ Back Bonding & Boron Trihalide Lewis Acidity", "Lewis Acidity Order: BF₃ < BCl₃ < BBr₃ < BI₃", ["back bonding", "boron trihalides lewis acid", "ppi ppi overlap"], ["In BF₃, 2p(F) overlaps efficiently with empty 2p(B), partially satisfying electron deficiency", "In BCl₃/BBr₃/BI₃, 3p/4p/5p orbitals are larger, overlap poorly with 2p(B), leaving B more electron deficient"], ["Counterintuitive trend: BI₃ is the STRONGEST Lewis acid."]]
  ]},
  { branch: "Inorganic", ch: "p-Block Elements", topics: [
    ["ostwald_nitric_acid_reactions", "Ostwald Process for Nitric Acid (HNO₃) Manufacture", "4NH₃ + 5O₂ —Pt/Rh (1050 K)→ 4NO + 6H₂O   |   2NO + O₂ → 2NO₂   |   3NO₂ + H₂O → 2HNO₃ + NO", ["ostwald process", "nitric acid manufacture", "catalytic oxidation ammonia"], ["Overall: NH₃ + 2O₂ → HNO₃ + H₂O"], ["Catalyst: Pt–Rh gauge at 1050 K and 5 bar."]],
    ["brown_ring_test_chemistry", "Brown Ring Test Chemistry for Nitrate Ions", "NO₃⁻ + 3Fe²⁺ + 4H⁺ → 3Fe³⁺ + NO + 2H₂O   |   [Fe(H₂O)₆]²⁺ + NO → [Fe(H₂O)₅(NO)]²⁺ (Brown Ring) + H₂O", ["brown ring test", "nitrate test", "nitrosonium complex", "fe oxidation state"], ["In brown ring complex [Fe(H₂O)₅(NO)]²⁺, NO transfers 1 electron to Fe³⁺, so Fe is in +1 oxidation state and NO is NO⁺ (nitrosonium)", "Unpaired electrons = 3, magnetic moment μ = √15 ≈ 3.87 BM"], ["Iconic JEE problem on transition metal oxidation states."]],
    ["contact_process_sulfuric_acid", "Contact Process for Sulfuric Acid (H₂SO₄) Manufacture", "2SO₂ + O₂ ⇌ 2SO₃ (V₂O₅ catalyst, 720 K, 2 bar)   |   SO₃ + H₂SO₄ → H₂S₂O₇ (Oleum) —H₂O→ 2H₂SO₄", ["contact process", "sulfuric acid manufacture", "oleum", "v2o5 catalyst"], ["Key step: 2SO₂ + O₂ ⇌ 2SO₃ is exothermic (ΔH = −196.6 kJ)"], ["Direct absorption of SO₃ in water is avoided because it forms a dense, uncontrollable fog of sulfuric acid mist."]],
    ["interhalogen_compounds_geometry", "Interhalogen Compounds (XX'n) Structures", "XX' (linear) , XX'₃ (T-shaped, sp³d) , XX'₅ (square pyramidal, sp³d²) , XX'₇ (pentagonal bipyramidal, sp³d³)", ["interhalogen compounds", "if7", "clf3", "brf5"], ["Central halogen X is larger than surrounding X'"], ["IF₇ is the only interhalogen of type XX'₇ due to maximum size difference between I and F."]]
  ]},
  { branch: "Inorganic", ch: "Coordination Compounds", topics: [
    ["isomerism_types_coordination", "Structural Isomerism in Coordination Complexes", "Ionisation: [Co(NH₃)₅Br]SO₄ vs [Co(NH₃)₅SO₄]Br   |   Linkage: M−NO₂ (nitro) vs M−ONO (nitrito)", ["isomerism coordination", "linkage isomerism", "hydrate isomerism", "ambidentate ligand"], ["Ambidentate ligands (NO₂⁻, SCN⁻, CN⁻) give linkage isomerism"], ["Hydrate isomerism: [Cr(H₂O)₆]Cl₃ (violet) vs [Cr(H₂O)₅Cl]Cl₂·H₂O (grey-green)."]],
    ["geometrical_isomerism_octahedral", "Fac–Mer Geometrical Isomerism in Octahedral [MA₃B₃]", "Fac (facial): three identical ligands occupy same face of octahedron   |   Mer (meridional): three ligands form arc around meridian", ["fac mer isomerism", "ma3b3", "facial meridional", "geometrical isomerism octahedral"], ["Fac-isomer has C₃ symmetry axis", "Mer-isomer has C₂ symmetry plane"], ["Neither fac nor mer isomer exhibits optical activity (both possess planes of symmetry)."]],
    ["jahn_teller_distortion_d9", "Jahn–Teller Distortion in Octahedral Complexes", "Any non-linear molecular system in a degenerate electronic state distorts to lower its symmetry and remove degeneracy", ["jahn teller distortion", "cu2+ d9 distortion", "z out elongation"], ["Most pronounced in d⁹ (Cu²⁺) and high-spin d⁴ (Cr²⁺, Mn³⁺) with asymmetric e_g electrons"], ["Tetragonal elongation (z-out): two axial bonds are significantly LONGER than four equatorial bonds."]]
  ]},

  // Organic Chemistry
  { branch: "Organic", ch: "General Organic Chemistry", topics: [
    ["hyperconjugation_carbocation_heat", "Heat of Hydrogenation vs Alkene Substitution", "Heat of Hydrogenation (ΔH_hydrog) is INVERSELY proportional to alkene stability", ["heat of hydrogenation", "alkene stability", "cis vs trans alkene stability"], ["More substituted alkenes release LESS heat upon catalytic hydrogenation (more stable ground state)"], ["Measuring ΔH_hydrog experimentally confirms relative thermodynamic stabilities."]],
    ["tautomerism_enol_content", "Keto–Enol Tautomerism Factors Governing Enol Content", "Enol content increased by: Aromatisation > Extended Conjugation > Intramolecular H-Bonding", ["keto enol tautomerism", "enol content", "acetylacetone", "phenol tautomerism"], ["Simple acetone: enol content < 0.001% (keto far more stable)", "Acetylacetone (CH₃COCH₂COCH₃): enol content ≈ 76% due to 6-membered intramolecular H-bonded ring", "Phenol: enol content > 99.999% due to aromatic resonance stabilization"], ["Crucial organic topic tested frequently in JEE Advanced."]],
    ["free_radical_stability_bond_dissociation", "Carbon Free Radical Stability & C–H Bond Dissociation Energy", "Stability: 3° > 2° > 1° > Methyl   |   C–H Bond Energy: 3° (381 kJ) < 2° (401 kJ) < 1° (422 kJ) < CH₄ (435 kJ)", ["free radical stability", "ch bond dissociation energy", "hyperconjugation radicals"], ["Weakest C–H bond is easiest to homolytically cleave to form radical"], ["Explains high selectivity of free radical bromination at 3° positions."]]
  ]},
  { branch: "Organic", ch: "Hydrocarbons", topics: [
    ["free_radical_halogenation_selectivity", "Free Radical Halogenation Reactivity-Selectivity Ratio", "Chlorination at 300 K: 3° : 2° : 1° = 5.0 : 3.8 : 1.0   |   Bromination at 400 K: 3° : 2° : 1° = 1600 : 82 : 1", ["alkane halogenation", "chlorination vs bromination", "reactivity selectivity principle"], ["Chlorine is highly reactive, non-selective; gives mixture of all monochloro isomers", "Bromine is unreactive, highly selective; gives exclusively 3° bromoalkane as major product"], ["In isobutane: bromination gives >99% 2-bromo-2-methylpropane."]],
    ["baeyer_reagent_oxidation", "Baeyer's Test for Unsaturation (Cold Alkaline KMnO₄)", "R−CH=CH₂ + cold dil. KMnO₄ (alkaline) → R−CH(OH)−CH₂(OH) (Syn-1,2-Diol)", ["baeyers reagent", "test for unsaturation", "pink to brown mno2", "syn dihydroxylation"], ["Purple colour of KMnO₄ disappears, brown precipitate of MnO₂ forms"], ["Adds two –OH groups to the SAME face (syn-dihydroxylation via cyclic manganate ester)."]],
    ["kucherov_reaction_alkynes", "Kucherov Hydration of Alkynes to Carbonyls", "R−C≡CH + H₂O —1% HgSO₄ / 20% H₂SO₄ (333 K)→ [R−C(OH)=CH₂] (enol) → R−COCH₃ (Methyl Ketone)", ["kucherov reaction", "hydration of alkynes", "hgso4 h2so4", "ethyne to ethanal"], ["Ethyne (HC≡CH) is the ONLY alkyne that yields an ALDEHYDE (ethanal)", "All other terminal and internal alkynes yield KETONES"], ["Proceeds via enol intermediate which tautomerises to stable carbonyl."]]
  ]},
  { branch: "Organic", ch: "Aromatic Compounds", topics: [
    ["friedel_crafts_alkylation_traps", "Friedel–Crafts Alkylation Limitations & Carbocation Rearrangement", "Ar−H + R−Cl + AlCl₃ → Ar−R' + HCl   (Rearrangement occurs if R⁺ can form more stable ion)", ["friedel crafts alkylation", "carbocation rearrangement", "polyalkylation trap", "deactivated ring failure"], ["Benzene + 1-chloropropane gives ISOPROPYLBENZENE (cumene) as major product via 1,2-hydride shift (1° → 2° cation)", "Polyalkylation: monoalkylated product is more reactive than benzene, leading to polyalkylated side products"], ["Reaction FAILS completely on strongly deactivated rings (−NO₂, −CN, −COOH) and on anilines (−NH₂ complexes with AlCl₃ catalyst)."]],
    ["friedel_crafts_acylation_clean", "Friedel–Crafts Acylation (No Rearrangement & Monoacylation)", "Ar−H + R−COCl + AlCl₃ → Ar−CO−R (Aromatic Ketone) + HCl", ["friedel crafts acylation", "acylium ion", "monoacylation", "no rearrangement"], ["Electrophile: resonance-stabilised acylium ion R–C≡O⁺", "No carbocation rearrangement occurs"], ["Product ketone is deactivated, so polyacylation DOES NOT occur; clean single-product reaction."]],
    ["benzyne_mechanism_elimination_addition", "Benzyne (Elimination–Addition) Mechanism in Aryl Halides", "Chlorobenzene + KNH₂ / liq. NH₃ (196 K) → [Benzyne intermediate] → Aniline", ["benzyne mechanism", "cine substitution", "elimination addition", "knh2 liquid ammonia"], ["Intermediate: Benzyne (dehydrobenzene) containing strained triple bond (sp² overlapping in ring plane)", "Attacking NH₂⁻ at either carbon of triple bond gives cine-substitution products"], ["o-chlorotoluene yields mixture of o-toluidine and m-toluidine."]]
  ]},
  { branch: "Organic", ch: "Aldehydes, Ketones & Carboxylic Acids", topics: [
    ["aldol_cross_aldol_products", "Cross-Aldol Condensation Product Count", "Two different aldehydes, each with α-H, yield FOUR distinct aldol products on basic condensation", ["cross aldol condensation", "four products", "self aldol vs cross aldol"], ["2 self-condensation products + 2 cross-condensation products"], ["To obtain a single clean product, use one aldehyde without α-H (e.g. benzaldehyde or formaldehyde) in excess."]],
    ["cannizzaro_cross_formaldehyde", "Cross-Cannizzaro Reaction with Formaldehyde", "Ar−CHO + HCHO + conc. NaOH → Ar−CH₂OH + HCOONa", ["cross cannizzaro", "formaldehyde oxidation", "benzyl alcohol", "sodium formate"], ["Formaldehyde is exceptionally susceptible to nucleophilic attack by OH⁻ due to lack of electron-donating alkyl groups and minimal steric hindrance"], ["Formaldehyde is ALWAYS oxidized to sodium formate, reducing the other aldehyde to alcohol."]],
    ["perkin_cinnamic_acid", "Perkin Reaction for Cinnamic Acid Synthesis", "C₆H₅CHO + (CH₃CO)₂O —CH₃COONa (450 K)→ C₆H₅−CH=CH−COOH (Cinnamic Acid) + CH₃COOH", ["perkin reaction", "cinnamic acid", "benzaldehyde acetic anhydride"], ["Condensation of aromatic aldehyde with anhydride in presence of weak sodium salt of the acid"], ["Yields α,β-unsaturated aromatic carboxylic acid."]],
    ["benzoin_condensation_cyanide", "Benzoin Condensation Catalysed by Cyanide Ion", "2 C₆H₅CHO —aq. alc. KCN (heat)→ C₆H₅−CH(OH)−CO−C₆H₅ (Benzoin)", ["benzoin condensation", "cyanide catalyst", "alpha hydroxy ketone"], ["Cyanide ion (CN⁻) acts as unique catalyst: good nucleophile, good electron-withdrawing group, and excellent leaving group"], ["Oxidation of benzoin with conc. HNO₃ yields Benzil (C₆H₅COCOC₆H₅)."]],
    ["hunsdiecker_reaction_decarboxylation", "Hunsdiecker Reaction (Decarboxylative Halogenation)", "R−COOAg + Br₂ —CCl₄ (reflux)→ R−Br + CO₂↑ + AgBr↓", ["hunsdiecker reaction", "silver carboxylate", "decarboxylative bromination"], ["Prepares alkyl bromides containing ONE LESS carbon than the starting carboxylic acid"], ["Yield order: 1° > 2° > 3° alkyl halide; using I₂ yields ester (Birnbaum–Simonini reaction: 2 RCOOAg + I₂ → RCOOR + CO₂ + 2 AgI)."]]
  ]},
  { branch: "Organic", ch: "Amines", topics: [
    ["gabriel_phthalimide_limitations", "Gabriel Phthalimide Synthesis Scope & Limitations", "Phthalimide + KOH → Potassium Salt —R−X (S_N2)→ N-alkylphthalimide —N₂H₄ / H⁺→ R−NH₂ (Pure 1° Amine)", ["gabriel phthalimide", "pure primary amine", "no aryl amine"], ["Gives strictly pure 1° aliphatic amines free from 2° or 3° amine contamination"], ["CANNOT be used to prepare aromatic 1° amines (aniline) because aryl halides (C₆H₅Cl) do not undergo S_N2 displacement with phthalimide anion."]],
    ["diazotisation_temperature_limit", "Diazotisation Reaction Temperature Condition", "Ar−NH₂ + NaNO₂ + 2 HCl —273–278 K (0–5 °C)→ Ar−N₂⁺ Cl⁻ + NaCl + 2 H₂O", ["diazotisation", "ice cold temperature", "arenediazonium salt stability"], ["Temperature must be kept strictly below 5 °C (278 K)"], ["Above 5 °C, benzenediazonium chloride decomposes violently in water, hydrolysing into Phenol and releasing N₂ gas: C₆H₅N₂⁺ + H₂O → C₆H₅OH + N₂↑ + H⁺."]],
    ["sandmeyer_vs_gattermann", "Sandmeyer vs Gattermann Reactions Comparison", "Sandmeyer: Ar−N₂⁺ Cl⁻ + CuCl/HCl → Ar−Cl + N₂   |   Gattermann: Ar−N₂⁺ Cl⁻ + Cu powder / HCl → Ar−Cl + N₂", ["sandmeyer reaction", "gattermann reaction", "copper catalyst", "aryl halide synthesis"], ["Sandmeyer uses copper(I) salt (CuCl or CuBr)", "Gattermann uses finely divided metallic copper powder in halogen acid"], ["Sandmeyer reaction gives significantly higher percentage yields than Gattermann reaction."]]
  ]}
];

// Add all constructed topic formulas
chapterTopics.forEach(grp => {
  grp.topics.forEach(t => {
    formulas.push({
      id: t[0],
      branch: grp.branch,
      chapter: grp.ch,
      title: t[1],
      expr: t[2],
      keys: t[3],
      symbols: t[4],
      notes: t[5],
      example: "Formula and quantitative application for JEE/CBSE exams: " + t[2]
    });
  });
});

console.log("Exporting formula-curriculum with count:", formulas.length);
module.exports = formulas;
