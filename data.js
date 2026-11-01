/* Nemo content: practice questions, formula bank and offline answers.
   All practice questions are ORIGINAL study questions written for this app. They are not official
   JEE/CBSE previous-year questions and carry no year/paper metadata. */
window.NEMO_DATA = {
  /* ---------------- Practice questions ---------------- */
  quiz: [
    { id: "p1", branch: "Physical", chapter: "Electrochemistry",
      q: "The standard EMF of the Daniell cell Zn | Zn²⁺ || Cu²⁺ | Cu is 1.10 V. At 298 K with [Zn²⁺] = 0.01 M and [Cu²⁺] = 1 M, the EMF is closest to:",
      options: ["1.04 V", "1.10 V", "1.16 V", "1.22 V"], answer: 2,
      explain: "Q = [Zn²⁺]/[Cu²⁺] = 0.01 and n = 2. E = 1.10 − (0.0592/2) log 0.01 = 1.10 − 0.0296 × (−2) = 1.10 + 0.059 ≈ 1.16 V. Lower product concentration makes the cell more spontaneous, so E rises above E°." },
    { id: "p2", branch: "Physical", chapter: "Chemical kinetics",
      q: "A first-order reaction is 75% complete in 30 minutes. Its half-life is:",
      options: ["7.5 min", "15 min", "30 min", "60 min"], answer: 1,
      explain: "75% completion means two half-lives have passed (100 → 50 → 25% left). So 2 t½ = 30 min and t½ = 15 min. Check: k = (2.303/30) log 4 = 0.0462 min⁻¹ and 0.693/0.0462 = 15 min." },
    { id: "p3", branch: "Physical", chapter: "Solutions",
      q: "Which 0.1 M aqueous solution has the highest osmotic pressure at the same temperature (assume complete dissociation of electrolytes)?",
      options: ["Glucose", "NaCl", "CaCl₂", "Urea"], answer: 2,
      explain: "π = iCRT. Glucose and urea do not dissociate (i = 1), NaCl gives 2 ions (i = 2) and CaCl₂ gives 3 ions (i = 3). Equal molarity means the largest i wins: CaCl₂." },
    { id: "p4", branch: "Physical", chapter: "Thermodynamics",
      q: "For a reaction with ΔH = +40 kJ mol⁻¹ and ΔS = +100 J K⁻¹ mol⁻¹, the reaction becomes spontaneous above approximately:",
      options: ["300 K", "400 K", "500 K", "4000 K"], answer: 1,
      explain: "ΔG = ΔH − TΔS < 0 needs T > ΔH/ΔS. Convert units first: 40 000 J ÷ 100 J K⁻¹ = 400 K. The classic trap is forgetting that ΔH is in kJ while ΔS is in J." },
    { id: "p5", branch: "Physical", chapter: "Chemical equilibrium",
      q: "For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), the relation between Kp and Kc is:",
      options: ["Kp = Kc", "Kp = Kc (RT)²", "Kp = Kc (RT)⁻²", "Kp = Kc (RT)⁻¹"], answer: 2,
      explain: "Kp = Kc (RT)^Δn, where Δn = moles of gaseous products − moles of gaseous reactants = 2 − 4 = −2. Hence Kp = Kc (RT)⁻²." },
    { id: "p6", branch: "Physical", chapter: "Atomic structure",
      q: "The energy of the electron in the n = 2 level of He⁺ is:",
      options: ["−13.6 eV", "−27.2 eV", "−54.4 eV", "−3.4 eV"], answer: 0,
      explain: "Eₙ = −13.6 Z²/n² eV. For He⁺, Z = 2 and n = 2, so E = −13.6 × 4/4 = −13.6 eV (the same as hydrogen's ground state)." },

    { id: "i1", branch: "Inorganic", chapter: "Chemical bonding",
      q: "Which of the following species is square planar?",
      options: ["SF₄", "XeF₄", "ClF₃", "PCl₅"], answer: 1,
      explain: "XeF₄ has 6 electron pairs (4 bond pairs + 2 lone pairs, sp³d²). The lone pairs sit opposite each other, leaving a square-planar molecule. SF₄ is see-saw, ClF₃ is T-shaped, PCl₅ is trigonal bipyramidal." },
    { id: "i2", branch: "Inorganic", chapter: "Coordination compounds",
      q: "The number of unpaired electrons in [Fe(CN)₆]³⁻ is:",
      options: ["0", "1", "3", "5"], answer: 1,
      explain: "Fe³⁺ is d⁵. CN⁻ is a strong-field ligand, so the complex is low spin (t₂g⁵ eg⁰), leaving 1 unpaired electron (d²sp³). With a weak-field ligand such as F⁻ the same ion would have 5." },
    { id: "i3", branch: "Inorganic", chapter: "Coordination compounds",
      q: "Which of the following complexes is diamagnetic?",
      options: ["[NiCl₄]²⁻", "[Ni(CN)₄]²⁻", "[CoF₆]³⁻", "[Fe(H₂O)₆]³⁺"], answer: 1,
      explain: "Ni²⁺ is d⁸. Strong-field CN⁻ pairs all the electrons and gives a square-planar (dsp²) diamagnetic complex. [NiCl₄]²⁻ is tetrahedral with 2 unpaired electrons, [CoF₆]³⁻ is high-spin d⁶ (4 unpaired) and [Fe(H₂O)₆]³⁺ is d⁵ (5 unpaired)." },
    { id: "i4", branch: "Inorganic", chapter: "Periodic properties",
      q: "In which pair is the first ionisation enthalpy of the first element HIGHER than that of the second, even though the second has the larger nuclear charge?",
      options: ["Li, Be", "Mg, Al", "Na, Mg", "B, C"], answer: 1,
      explain: "Mg (3s²) has a fully filled s-subshell, while Al (3s²3p¹) loses a higher-energy, better-shielded 3p electron, so IE₁(Mg) ≈ 738 > IE₁(Al) ≈ 578 kJ mol⁻¹. In the other pairs IE₁ rises normally across the period." },
    { id: "i5", branch: "Inorganic", chapter: "p-block elements",
      q: "Which of the following oxides is amphoteric?",
      options: ["CO₂", "Al₂O₃", "Na₂O", "SO₃"], answer: 1,
      explain: "Al₂O₃ reacts with both acids (giving Al³⁺ salts) and bases (giving aluminates). CO₂ and SO₃ are acidic, and Na₂O is basic." },
    { id: "i6", branch: "Inorganic", chapter: "Chemical bonding (MOT)",
      q: "The bond order of O₂⁺ is:",
      options: ["1.5", "2", "2.5", "3"], answer: 2,
      explain: "O₂ has bond order 2 (Nb = 10, Na = 6 using all electrons). Removing one electron from an antibonding π* orbital gives O₂⁺ with Nb = 10, Na = 5, so bond order = (10 − 5)/2 = 2.5." },

    { id: "o1", branch: "Organic", chapter: "General organic chemistry",
      q: "Which carbocation is the most stable?",
      options: ["CH₃⁺", "CH₃CH₂⁺", "(CH₃)₂CH⁺", "(CH₃)₃C⁺"], answer: 3,
      explain: "Stability rises with the number of alkyl groups because of +I effect and hyperconjugation (nine C–H bonds in (CH₃)₃C⁺). Order: 3° > 2° > 1° > methyl." },
    { id: "o2", branch: "Organic", chapter: "Haloalkanes",
      q: "Which substrate reacts fastest with I⁻ in acetone by the SN2 mechanism?",
      options: ["CH₃Br", "CH₃CH₂Br", "(CH₃)₂CHBr", "(CH₃)₃CBr"], answer: 0,
      explain: "SN2 needs backside attack, so steric hindrance controls the rate: methyl > 1° > 2° >> 3°. The tertiary halide essentially does not react by SN2." },
    { id: "o3", branch: "Organic", chapter: "Hydrocarbons",
      q: "Propene reacts with HBr (no peroxide) to give mainly:",
      options: ["1-Bromopropane", "2-Bromopropane", "1,2-Dibromopropane", "Allyl bromide"], answer: 1,
      explain: "Markovnikov addition: H⁺ adds to the carbon with more hydrogens, giving the more stable secondary carbocation CH₃–CH⁺–CH₃, which is attacked by Br⁻ to give 2-bromopropane. 1-Bromopropane would form only with peroxide (free-radical) conditions." },
    { id: "o4", branch: "Organic", chapter: "Aromatic compounds",
      q: "In the nitration of benzene with conc. HNO₃ + conc. H₂SO₄, the attacking electrophile is:",
      options: ["NO₃⁻", "NO₂⁺", "NO⁺", "HNO₃"], answer: 1,
      explain: "H₂SO₄ protonates HNO₃, which loses water to give the nitronium ion NO₂⁺: HNO₃ + 2H₂SO₄ → NO₂⁺ + H₃O⁺ + 2HSO₄⁻. NO₂⁺ is the electrophile that attacks the ring." },
    { id: "o5", branch: "Organic", chapter: "Stereochemistry",
      q: "How many stereoisomers does butane-2,3-diol, CH₃CH(OH)CH(OH)CH₃, have?",
      options: ["2", "3", "4", "1"], answer: 1,
      explain: "It has two stereocentres but the molecule is symmetric, so one isomer (R,S) is a meso compound. Total = (R,R) + (S,S) + meso = 3 stereoisomers, not 2² = 4." },
    { id: "o6", branch: "Organic", chapter: "Alcohols and carbonyls",
      q: "Which of the following gives a positive iodoform test?",
      options: ["Ethanol", "Propan-1-ol", "Methanol", "Benzaldehyde"], answer: 0,
      explain: "The iodoform test needs a CH₃–CO– group or a CH₃–CH(OH)– group (which NaOI oxidises to CH₃CO–). Ethanol qualifies. Propan-1-ol, methanol and benzaldehyde have neither." }
  ],

  /* ---------------- Comprehensive Formula Bank with KaTeX LaTeX (400+ Formulas) ---------------- */
  formulas: [
  {
    "id": "bohr",
    "branch": "Physical",
    "chapter": "Atomic structure",
    "title": "Bohr energy and radius (one-electron species)",
    "expr": "Eₙ = −13.6 Z²/n² eV   ,   rₙ = 52.9 n²/Z pm",
    "keys": [
      "bohr"
    ],
    "symbols": [
      "n: principal quantum number of the orbit",
      "Z: atomic number (H = 1, He⁺ = 2, Li²⁺ = 3)"
    ],
    "notes": [
      "Valid only for hydrogen-like (single-electron) species.",
      "Energy is negative because the electron is bound; larger n is less negative.",
      "Ionisation energy from level n is +13.6 Z²/n² eV."
    ],
    "latex": "E_n = -13.6 \\,\\frac{Z^2}{n^2}\\,\\text{eV}, \\quad r_n = 52.9 \\,\\frac{n^2}{Z}\\,\\text{pm}"
  },
  {
    "id": "debroglie",
    "branch": "Physical",
    "chapter": "Atomic structure",
    "title": "de Broglie wavelength",
    "expr": "λ = h/mv = h/p",
    "keys": [
      "de broglie",
      "debroglie"
    ],
    "symbols": [
      "h = 6.626 × 10⁻³⁴ J s",
      "m: mass in kg",
      "v: speed in m s⁻¹"
    ],
    "notes": [
      "Matter waves are noticeable only for tiny masses such as electrons.",
      "For a charged particle accelerated through V volts: λ = h/√(2mqV)."
    ],
    "latex": "\\lambda = \\frac{h}{m v} = \\frac{h}{p} = \\frac{h}{\\sqrt{2 m K}}"
  },
  {
    "id": "rydberg",
    "branch": "Physical",
    "chapter": "Atomic structure",
    "title": "Rydberg formula",
    "expr": "1/λ = R_H Z² (1/n₁² − 1/n₂²)",
    "keys": [
      "rydberg",
      "spectral line",
      "hydrogen spectrum"
    ],
    "symbols": [
      "R_H = 1.097 × 10⁷ m⁻¹",
      "n₂ > n₁ for emission",
      "Z: atomic number of the one-electron species"
    ],
    "notes": [
      "Lyman n₁ = 1 (UV), Balmer n₁ = 2 (visible), Paschen n₁ = 3 (IR).",
      "Maximum number of lines emitted by atoms excited to level n (all transitions to lower levels): n(n − 1)/2."
    ],
    "latex": "\\frac{1}{\\lambda} = \\bar{\\nu} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right)"
  },
  {
    "id": "bohr_energy",
    "branch": "Physical",
    "chapter": "Atomic Structure",
    "title": "Bohr Orbital Energy",
    "expr": "Eₙ = −13.6 × (Z² / n²) eV = −2.18 × 10⁻¹⁸ × (Z² / n²) J",
    "keys": [
      "bohr energy",
      "orbit energy"
    ],
    "symbols": [
      "Eₙ: total energy in nth orbit",
      "Kinetic energy K.E. = −Eₙ = +13.6 Z²/n² eV",
      "Potential energy P.E. = 2Eₙ = −27.2 Z²/n² eV"
    ],
    "notes": [
      "Relation: Total Energy = −(Kinetic Energy) = ½ (Potential Energy).",
      "Ionisation Energy from state n: IE = +13.6 Z²/n² eV."
    ],
    "example": "He⁺ ion (Z=2) in n=2 level:\nE₂ = −13.6 × (2² / 2²) = −13.6 eV.",
    "latex": "E_n = -13.6 \\,\\frac{Z^2}{n^2}\\,\\text{eV} = -2.18 \\times 10^{-18} \\,\\frac{Z^2}{n^2}\\,\\text{J}"
  },
  {
    "id": "bohr_velocity",
    "branch": "Physical",
    "chapter": "Atomic Structure",
    "title": "Bohr Orbital Velocity",
    "expr": "vₙ = 2.188 × 10⁶ × (Z / n) m s⁻¹ = c / (137 × n/Z)",
    "keys": [
      "bohr velocity",
      "speed of electron"
    ],
    "symbols": [
      "vₙ: speed of electron in nth orbit",
      "c = 3 × 10⁸ m s⁻¹: speed of light",
      "1/137: fine structure constant"
    ],
    "notes": [
      "Velocity is directly proportional to Z and inversely proportional to n.",
      "Orbital frequency f = v / (2πr) ∝ Z² / n³."
    ],
    "example": "Speed in n=1 for H atom (Z=1, n=1):\nv = 2.188 × 10⁶ m s⁻¹ ≈ c / 137.",
    "latex": "v_n = 2.18 \\times 10^6 \\,\\frac{Z}{n}\\,\\text{m s}^{-1} = \\frac{c}{137} \\cdot \\frac{Z}{n}"
  },
  {
    "id": "bohr_radius",
    "branch": "Physical",
    "chapter": "Atomic Structure",
    "title": "Bohr Radius (Hydrogenic Species)",
    "expr": "rₙ = (0.529 × n² / Z) Å = 52.9 × (n² / Z) pm",
    "keys": [
      "bohr radius",
      "radius of orbit"
    ],
    "symbols": [
      "rₙ: radius of nth orbit",
      "n: principal quantum number (1, 2, 3...)",
      "Z: atomic number (H=1, He⁺=2, Li²⁺=3)"
    ],
    "notes": [
      "Radius increases as n² and decreases as 1/Z.",
      "First orbit of hydrogen (n=1, Z=1) has radius r₁ = 0.529 Å (Bohr radius a₀)."
    ],
    "example": "Radius of 2nd orbit of He⁺ (n=2, Z=2):\nr = 0.529 × (2² / 2) = 1.058 Å.",
    "latex": "r_n = 0.529 \\,\\frac{n^2}{Z}\\,\\text{\\AA} = 52.9 \\,\\frac{n^2}{Z}\\,\\text{pm}"
  },
  {
    "id": "photoelectric",
    "branch": "Physical",
    "chapter": "Atomic Structure",
    "title": "Einstein's Photoelectric Equation",
    "expr": "hν = W₀ + K.E._max   =>   hν = hν₀ + ½ m v_max² = hν₀ + eV₀",
    "keys": [
      "photoelectric",
      "work function",
      "stopping potential"
    ],
    "symbols": [
      "h = 6.626 × 10⁻³⁴ J s: Planck's constant",
      "W₀ = hν₀: work function of metal",
      "ν₀: threshold frequency",
      "V₀: stopping potential (volts)"
    ],
    "notes": [
      "K.E._max is independent of light intensity; it depends linearly on frequency ν.",
      "Intensity of light determines the number of photoelectrons emitted per second (photocurrent)."
    ],
    "example": "Metal with W₀ = 2.0 eV irradiated with 3.5 eV photons:\nK.E._max = 3.5 − 2.0 = 1.5 eV  =>  Stopping potential V₀ = 1.5 V.",
    "latex": "h\\nu = h\\nu_0 + K_{\\max} = W_0 + e V_0"
  },
  {
    "id": "heisenberg",
    "branch": "Physical",
    "chapter": "Atomic Structure",
    "title": "Heisenberg's Uncertainty Principle",
    "expr": "Δx · Δp ≥ h / (4π)   =>   Δx · Δv ≥ h / (4πm)   ,   ΔE · Δt ≥ h / (4π)",
    "keys": [
      "heisenberg",
      "uncertainty principle"
    ],
    "symbols": [
      "Δx: uncertainty in position",
      "Δp: uncertainty in momentum",
      "Δv: uncertainty in velocity",
      "h/(4π) ≈ 0.527 × 10⁻³⁴ J s"
    ],
    "notes": [
      "If uncertainty in velocity is given as p%: Δv = (p/100) × v.",
      "Rules out defined planetary orbits; leads to 3D electron probability orbitals."
    ],
    "example": "For an electron (m = 9.1 × 10⁻³¹ kg) with Δx = 10⁻¹⁰ m:\nΔv ≥ 6.626 × 10⁻³⁴ / (4π × 9.1 × 10⁻³¹ × 10⁻¹⁰) ≈ 5.8 × 10⁵ m s⁻¹.",
    "latex": "\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi} = \\frac{\\hbar}{2}"
  },
  {
    "id": "angular_momentum",
    "branch": "Physical",
    "chapter": "Atomic Structure",
    "title": "Orbital & Spin Angular Momentum",
    "expr": "L = √[l(l + 1)] · (h / 2π)   ,   S = √[s(s + 1)] · (h / 2π)",
    "keys": [
      "orbital angular momentum",
      "spin angular momentum"
    ],
    "symbols": [
      "l: azimuthal quantum number (s=0, p=1, d=2, f=3)",
      "s: electron spin quantum number = ½",
      "ħ = h / (2π)"
    ],
    "notes": [
      "For any s-orbital (l = 0), orbital angular momentum is exactly ZERO.",
      "For a p-electron: L = √(1 × 2) ħ = √2 ħ.",
      "For a d-electron: L = √(2 × 3) ħ = √6 ħ."
    ],
    "example": "Orbital angular momentum of 3d electron:\nL = √[2(2 + 1)] (h / 2π) = √6 (h / 2π) ≈ 2.45 ħ.",
    "latex": "L = \\sqrt{l(l + 1)}\\,\\frac{h}{2\\pi}, \\quad S = \\sqrt{s(s + 1)}\\,\\frac{h}{2\\pi}"
  },
  {
    "id": "kpkc",
    "branch": "Physical",
    "chapter": "Chemical equilibrium",
    "title": "Kp and Kc",
    "expr": "Kp = Kc (RT)^Δn",
    "keys": [
      "kp",
      "kc"
    ],
    "symbols": [
      "Δn: moles of gaseous products − moles of gaseous reactants",
      "R = 0.0821 L atm K⁻¹ mol⁻¹ when pressures are in atm",
      "T in kelvin"
    ],
    "notes": [
      "If Δn = 0 then Kp = Kc.",
      "Only gases are counted in Δn.",
      "Example: N₂ + 3H₂ ⇌ 2NH₃ has Δn = −2, so Kp = Kc (RT)⁻²."
    ],
    "latex": "K_p = K_c (R T)^{\\Delta n_g}"
  },
  {
    "id": "degree_dissoc_vd",
    "branch": "Physical",
    "chapter": "Chemical Equilibrium",
    "title": "Degree of Dissociation from Vapour Density",
    "expr": "α = (D − d) / [(n − 1) d] = (M_th − M_obs) / [(n − 1) M_obs]",
    "keys": [
      "degree of dissociation",
      "vapour density",
      "abnormal molecular mass"
    ],
    "symbols": [
      "α: degree of dissociation",
      "D = M_th / 2: theoretical vapour density",
      "d = M_obs / 2: observed vapour density",
      "n: moles of products formed per mole of reactant (e.g. PCl₅ → PCl₃ + Cl₂, n = 2)"
    ],
    "notes": [
      "For PCl₅ (n = 2): α = (D − d) / d.",
      "For N₂O₄ (n = 2): α = (D − d) / d."
    ],
    "example": "PCl₅ (M_th = 208.5, D = 104.25) has observed vapour density d = 62 at 200 °C:\nα = (104.25 − 62) / 62 = 42.25 / 62 ≈ 0.68 (68% dissociated).",
    "latex": "\\alpha = \\frac{D - d}{(n - 1) d} = \\frac{M_{\\text{th}} - M_{\\text{obs}}}{(n - 1) M_{\\text{obs}}}"
  },
  {
    "id": "arrhenius",
    "branch": "Physical",
    "chapter": "Chemical kinetics",
    "title": "Arrhenius equation (two-temperature form)",
    "expr": "log (k₂/k₁) = (Ea/2.303R)(1/T₁ − 1/T₂)",
    "keys": [
      "arrhenius",
      "activation energy"
    ],
    "symbols": [
      "k₁, k₂: rate constants at T₁ and T₂ (kelvin)",
      "Ea: activation energy (J mol⁻¹ when R = 8.314)",
      "R = 8.314 J K⁻¹ mol⁻¹"
    ],
    "notes": [
      "Original form: k = A e^(−Ea/RT).",
      "Convert Ea from kJ to J before substituting.",
      "A higher Ea means a stronger temperature dependence of k."
    ],
    "latex": "\\log_{10}\\left( \\frac{k_2}{k_1} \\right) = \\frac{E_a}{2.303 R}\\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)"
  },
  {
    "id": "firstorder",
    "branch": "Physical",
    "chapter": "Chemical kinetics",
    "title": "First-order integrated rate law",
    "expr": "k = (2.303/t) log [a/(a − x)]",
    "keys": [
      "first order",
      "first-order",
      "integrated rate"
    ],
    "symbols": [
      "k: rate constant (time⁻¹)",
      "t: time elapsed",
      "a: initial concentration",
      "a − x: concentration remaining at time t"
    ],
    "notes": [
      "t½ = 0.693/k and does not depend on the initial concentration.",
      "A plot of ln[A] against t is a straight line with slope −k.",
      "Equivalent form: [A] = [A]₀ e^(−kt)."
    ],
    "example": "A reaction is 75% complete in 30 min.\nk = (2.303/30) log (100/25) = (2.303/30)(0.602) ≈ 4.6 × 10⁻² min⁻¹\nt½ = 0.693/0.0462 = 15 min (75% done = two half-lives).",
    "latex": "k = \\frac{2.303}{t} \\log_{10}\\left( \\frac{a}{a - x} \\right)"
  },
  {
    "id": "arrhenius_equation_two_temps",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Arrhenius Equation & Two-Temperature Form",
    "expr": "k = A · e^(−E_a / RT)   |   log(k₂ / k₁) = (E_a / 2.303 R) · [ (T₂ − T₁) / (T₁ T₂) ]",
    "keys": [
      "arrhenius equation",
      "activation energy",
      "temperature dependence of rate",
      "frequency factor"
    ],
    "symbols": [
      "A: pre-exponential (frequency) factor (same units as k)",
      "E_a: activation energy (J mol⁻¹)",
      "R = 8.314 J K⁻¹ mol⁻¹",
      "T: temperature in Kelvin"
    ],
    "notes": [
      "Plotting log k vs 1/T yields a straight line with slope = −E_a / (2.303 R) and intercept = log A.",
      "A catalyst lowers E_a, exponentially increasing k: k_cat / k_uncat = e^(ΔE_a / RT)."
    ],
    "example": "Rate constant doubles when temperature rises from 300 K to 310 K (k₂/k₁ = 2):\nlog 2 = 0.3010 = (E_a / (2.303 × 8.314)) × [10 / (300 × 310)].\nE_a = (0.3010 × 19.147 × 93000) / 10 ≈ 53.6 kJ mol⁻¹.",
    "latex": "k = A \\, e^{-\\frac{E_a}{R T}} \\quad \\Big| \\quad \\log_{10}\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{2.303 R}\\left[ \\frac{T_2 - T_1}{T_1 T_2} \\right]"
  },
  {
    "id": "collision_theory_rate",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Collision Theory & Steric Factor",
    "expr": "Rate = P · Z_AB · e^(−E_a / RT)   |   k = P · Z_AB · e^(−E_a / RT)",
    "keys": [
      "collision theory",
      "steric factor",
      "orientation factor",
      "collision frequency"
    ],
    "symbols": [
      "Z_AB: collision frequency (number of collisions per second per unit volume)",
      "e^(−E_a/RT): fraction of collisions with energy ≥ E_a",
      "P: steric factor / orientation probability (P ≤ 1)"
    ],
    "notes": [
      "For complex molecules with strict spatial orientation requirements, P << 1.",
      "Transition state theory replaces P with entropy of activation: A = (k_B T / h) e^(ΔS‡ / R)."
    ],
    "example": "If only 1 in 10⁴ collisions has proper geometry, P = 10⁻⁴.",
    "latex": "\\text{Rate} = P \\cdot Z_{\\text{AB}} \\cdot e^{-\\frac{E_a}{R T}} \\quad \\Big| \\quad k = P \\cdot Z_{\\text{AB}} \\cdot e^{-\\frac{E_a}{R T}}"
  },
  {
    "id": "eyring_transition_state_theory",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Eyring Equation (Transition State Theory)",
    "expr": "k = (k_B · T / h) · e^(ΔS‡ / R) · e^(−ΔH‡ / RT)",
    "keys": [
      "eyring equation",
      "transition state theory",
      "entropy of activation",
      "enthalpy of activation"
    ],
    "symbols": [
      "k_B = 1.38 × 10⁻²³ J K⁻¹ (Boltzmann constant)",
      "h = 6.626 × 10⁻³⁴ J s (Planck constant)",
      "k_B T / h: universal frequency factor (≈ 6.2 × 10¹² s⁻¹ at 298 K)",
      "ΔS‡: standard entropy of activation",
      "ΔH‡: standard enthalpy of activation = E_a − R T (for liquid solutions)"
    ],
    "notes": [
      "A large negative ΔS‡ indicates an associative, highly ordered transition state (like S_N2 or Diels–Alder).",
      "A positive ΔS‡ indicates a dissociative transition state (like S_N1)."
    ],
    "example": "Comparing Arrhenius and Eyring parameters shows frequency factor A is directly proportional to e^(ΔS‡/R).",
    "latex": "k = \\left( \\frac{k_B T}{h} \\right) e^{\\frac{\\Delta S^\\ddagger}{R}} e^{-\\frac{\\Delta H^\\ddagger}{R T}}"
  },
  {
    "id": "first_order_kinetics_integrated",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "First-Order Integrated Rate Law & Exponential Decay",
    "expr": "k = (2.303 / t) log([A]₀ / [A]_t)   |   [A]_t = [A]₀ · e^(−kt)   |   t_½ = 0.693 / k",
    "keys": [
      "first order kinetics",
      "half life first order",
      "radioactive decay",
      "exponential decay"
    ],
    "symbols": [
      "k: rate constant (units: s⁻¹ or min⁻¹, independent of concentration units)",
      "[A]_t: concentration at time t",
      "t_½: half-life (completely independent of initial concentration [A]₀)"
    ],
    "notes": [
      "Fractional completion shortcuts: t_75% = 2 t_½; t_87.5% = 3 t_½; t_93.75% = 4 t_½; t_99.9% ≈ 10 t_½.",
      "All natural and artificial radioactive decays follow first-order kinetics."
    ],
    "example": "First-order reaction with t_½ = 20 min:\nk = 0.693 / 20 = 0.03465 min⁻¹.\nTime for 75% completion = 2 × 20 = 40 min.",
    "latex": "k = \\frac{2.303}{t} \\log_{10}\\left(\\frac{[A]_0}{[A]_t}\\right) \\quad \\Big| \\quad [A]_t = [A]_0 \\, e^{-kt} \\quad \\Big| \\quad t_{1/2} = \\frac{0.693}{k}"
  },
  {
    "id": "nth_order_half_life_proportionality",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "General nth-Order Half-life Proportionality",
    "expr": "t_½ ∝ 1 / [A]₀^(n − 1)   =>   [ t_½(1) / t_½(2) ] = [ [A]₀(2) / [A]₀(1) ]^(n − 1)",
    "keys": [
      "nth order reaction",
      "order determination",
      "half life method",
      "fractional order"
    ],
    "symbols": [
      "n: reaction order",
      "Units of rate constant k: (mol L⁻¹)^(1−n) s⁻¹ = (conc)^(1−n) (time)⁻¹"
    ],
    "notes": [
      "n = 0: t_½ ∝ [A]₀.",
      "n = 1: t_½ independent of [A]₀.",
      "n = 2: t_½ ∝ 1/[A]₀.",
      "n = 3: t_½ ∝ 1/[A]₀²."
    ],
    "example": "If doubling [A]₀ reduces t_½ to 1/4th of its value:\n(1/4) = (1/2)^(n − 1) => 2^(n − 1) = 4 = 2² => n − 1 = 2 => n = 3 (third order).",
    "latex": "t_{1/2} \\propto \\frac{1}{[A]_0^{n - 1}} \\implies \\frac{t_{1/2}(1)}{t_{1/2}(2)} = \\left( \\frac{[A]_0(2)}{[A]_0(1)} \\right)^{n - 1}"
  },
  {
    "id": "half_life_general",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Half-Life Relations Across Reaction Orders",
    "expr": "t_½ ∝ 1 / [A]₀^(n − 1)   =>   0th: t_½ = [A]₀ / 2k   |   1st: t_½ = 0.693 / k   |   2nd: t_½ = 1 / (k [A]₀)",
    "keys": [
      "half life",
      "half-life",
      "order from half life"
    ],
    "symbols": [
      "t_½: time required for concentration to fall to 50% of its initial value",
      "n: reaction order"
    ],
    "notes": [
      "First-order half-life is completely independent of initial concentration [A]₀.",
      "Ratio of half-lives at two initial concentrations: (t_½)₁ / (t_½)₂ = ([A]₀₂ / [A]₀₁)^(n − 1).",
      "Completion time for zero-order: t_100% = [A]₀ / k = 2 × t_½."
    ],
    "example": "If doubling [A]₀ halves t_½, then 1/2 = (1/2)^(n − 1)  =>  n − 1 = 1  =>  n = 2 (Second order).",
    "latex": "t_{1/2} \\propto \\frac{1}{[A]_0^{n - 1}} \\implies \\text{0th: } t_{1/2} = \\frac{[A]_0}{2k} \\quad \\Big| \\quad \\text{1st: } t_{1/2} = \\frac{0.693}{k} \\quad \\Big| \\quad \\text{2nd: } t_{1/2} = \\frac{1}{k [A]_0}"
  },
  {
    "id": "rate_law_orders",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Integrated Rate Laws (Zero, First, Second Order)",
    "expr": "0th: [A] = [A]₀ − kt   |   1st: ln([A]₀/[A]) = kt   |   2nd: 1/[A] − 1/[A]₀ = kt",
    "keys": [
      "rate law",
      "zero order",
      "first order",
      "second order",
      "integrated rate"
    ],
    "symbols": [
      "[A]₀: initial concentration",
      "[A]: concentration at time t",
      "k: rate constant"
    ],
    "notes": [
      "Units of k for nth order reaction: (mol L⁻¹)^(1−n) s⁻¹.",
      "Zero order: k in mol L⁻¹ s⁻¹; plot of [A] vs t is straight line with slope −k.",
      "First order: k in s⁻¹; plot of ln[A] vs t has slope −k.",
      "Second order: k in L mol⁻¹ s⁻¹; plot of 1/[A] vs t has slope +k."
    ],
    "example": "First-order reaction with k = 0.0693 min⁻¹: t_½ = 0.693 / 0.0693 = 10 min.",
    "latex": "\\textbf{0}^{\\text{th}}\\text{: } [A] = [A]_0 - kt \\quad \\Big| \\quad \\textbf{1}^{\\text{st}}\\text{: } \\ln\\left(\\frac{[A]_0}{[A]}\\right) = kt \\quad \\Big| \\quad \\textbf{2}^{\\text{nd}}\\text{: } \\frac{1}{[A]} - \\frac{1}{[A]_0} = kt"
  },
  {
    "id": "lindemann_unimolecular_kinetics",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Lindemann–Hinshelwood Unimolecular Reaction Mechanism",
    "expr": "Rate = (k₁ k₂ [A]²) / (k₋₁ [A] + k₂)   |   High P: Rate = (k₁ k₂ / k₋₁) [A] (1st order)   |   Low P: Rate = k₁ [A]² (2nd order)",
    "keys": [
      "lindemann mechanism",
      "unimolecular gas reaction",
      "pressure transition order",
      "apparent rate constant"
    ],
    "symbols": [
      "A + A ⇌ A* + A (activation rate k₁, deactivation k₋₁ via collision)",
      "A* → Products (reaction rate k₂ via internal vibration)"
    ],
    "notes": [
      "Explains how a unimolecular reaction can be energised by bimolecular collisions yet exhibit overall first-order kinetics at normal pressures."
    ],
    "example": "Thermal isomerisation of cyclopropane to propene is 1st order at normal pressure but transitions to 2nd order at very low pressures.",
    "latex": "\\text{Rate} = \\frac{k_1 k_2 [\\ce{A}]^2}{k_{-1}[\\ce{A}] + k_2} \\quad \\Big| \\quad \\text{High } P: \\text{Rate} = \\frac{k_1 k_2}{k_{-1}}[\\ce{A}] \\quad \\Big| \\quad \\text{Low } P: \\text{Rate} = k_1 [\\ce{A}]^2"
  },
  {
    "id": "enzyme_kinetics_michaelis_menten",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Michaelis–Menten Enzyme Kinetics Equation",
    "expr": "Rate v = (V_max [S]) / (K_m + [S])",
    "keys": [
      "michaelis menten",
      "enzyme kinetics",
      "km substrate affinity"
    ],
    "symbols": [
      "V_max: maximum rate",
      "K_m: Michaelis constant (substrate conc at v = V_max/2)"
    ],
    "notes": [
      "At low [S] << K_m: first order (v ∝ [S]); at high [S] >> K_m: zero order (v = V_max)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Rate v = (V_max [S]) / (K_m + [S])",
    "latex": "v = \\frac{V_{\\max} [S]}{K_m + [S]} \\quad \\Big| \\quad [S] = K_m \\implies v = \\frac{V_{\\max}}{2}"
  },
  {
    "id": "parallel_consecutive_kinetics",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Parallel & Consecutive First-Order Reactions",
    "expr": "Parallel: k_total = k₁ + k₂ , %B = k₁/(k₁+k₂)·100   |   Consecutive: t_max(B) = [ln(k₁/k₂)] / (k₁ − k₂)",
    "keys": [
      "parallel reaction",
      "consecutive reaction",
      "kinetics",
      "maximum concentration"
    ],
    "symbols": [
      "Parallel: A → B (rate k₁) and A → C (rate k₂)",
      "Consecutive: A −k₁→ B −k₂→ C",
      "t_max(B): time when intermediate B reaches maximum concentration"
    ],
    "notes": [
      "In parallel reactions, ratio of products is fixed at all times: [B]/[C] = k₁ / k₂.",
      "In radioactive decay chains (A → B → C), secular equilibrium occurs when t_½(parent) >> t_½(daughter), giving λ_A N_A = λ_B N_B."
    ],
    "example": "If k₁ = 0.02 min⁻¹ and k₂ = 0.01 min⁻¹ in parallel decay of A:\nk_total = 0.03 min⁻¹. Yield of B = 0.02 / 0.03 = 66.7%.",
    "latex": "k_{\\text{total}} = k_1 + k_2, \\quad \\%B = \\frac{k_1}{k_1 + k_2} \\times 100\\%, \\quad t_{\\max}(B) = \\frac{\\ln\\left(\\frac{k_1}{k_2}\\right)}{k_1 - k_2}"
  },
  {
    "id": "radioactive_decay_law",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Radioactive Decay Law & Mean Life",
    "expr": "N_t = N₀ · e^(−λ t)   |   t_½ = 0.693 / λ   |   Mean Life τ = 1 / λ = 1.443 · t_½",
    "keys": [
      "radioactive decay",
      "mean life",
      "decay constant lambda"
    ],
    "symbols": [
      "Activity A = −dN/dt = λ N (units: Becquerel or Curie)"
    ],
    "notes": [
      "In 1 mean life τ, 63.2% of initial nuclei decay (36.8% remaining)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: N_t = N₀ · e^(−λ t)   |   t_½ = 0.693 / λ   |   Mean Life τ = 1 / λ = 1.443 · t_½",
    "latex": "N_t = N_0 \\, e^{-\\lambda t} \\quad \\Big| \\quad t_{1/2} = \\frac{0.693}{\\lambda} \\quad \\Big| \\quad \\tau = \\frac{1}{\\lambda} = 1.443 \\, t_{1/2}"
  },
  {
    "id": "radioactive_decay_constant",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Radioactive Decay Law & Specific Activity",
    "expr": "A = λ · N = (0.693 / t_½) · N   |   1 Curie (Ci) = 3.7 × 10¹⁰ Bq (disintegrations s⁻¹)",
    "keys": [
      "radioactivity",
      "decay constant",
      "activity becquerel curie",
      "specific activity"
    ],
    "symbols": [
      "A: activity (rate of disintegration −dN/dt in Bq)",
      "N: number of radioactive nuclei present",
      "t_½: half-life in seconds",
      "1 Becquerel (Bq) = 1 disintegration per second"
    ],
    "notes": [
      "Radioactive decay rate is completely independent of temperature, pressure, chemical state, and external catalysts.",
      "Carbon-14 dating: t_½ = 5730 years; age t = (2.303/λ) log(A₀/A_t)."
    ],
    "example": "1 gram of Radium-226 (t_½ = 1600 years) has activity of exactly 1.0 Curie = 3.7 × 10¹⁰ Bq.",
    "latex": "A = \\lambda N = \\frac{0.693}{t_{1/2}} N \\quad \\Big| \\quad 1\\text{ Ci} = 3.7 \\times 10^{10}\\text{ Bq}"
  },
  {
    "id": "second_order_kinetics_law",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Second-Order Reaction Integrated Rate Law & Half-life",
    "expr": "(1 / [A]_t) − (1 / [A]₀) = k · t   |   t_½ = 1 / (k · [A]₀)",
    "keys": [
      "second order kinetics",
      "integrated rate law second order",
      "half life second order"
    ],
    "symbols": [
      "k: rate constant (units: L mol⁻¹ s⁻¹)",
      "t_½: half-life (inversely proportional to initial concentration: t_½ ∝ 1/[A]₀)"
    ],
    "notes": [
      "Plotting 1/[A]_t versus t yields a straight line with slope = +k and y-intercept = 1/[A]₀.",
      "Successive half-lives double: t_½(1) : t_½(2) : t_½(3) = 1 : 2 : 4."
    ],
    "example": "For second-order reaction with k = 0.2 L mol⁻¹ s⁻¹ and [A]₀ = 0.1 M:\nt_½ = 1 / (0.2 × 0.1) = 1 / 0.02 = 50 s.",
    "latex": "\\frac{1}{[A]_t} - \\frac{1}{[A]_0} = k t \\quad \\Big| \\quad t_{1/2} = \\frac{1}{k [A]_0}"
  },
  {
    "id": "second_order_different_reactants",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Second-Order Reaction with Unequal Reactants",
    "expr": "k = [ 2.303 / (t (a − b)) ] · log[ (b (a − x)) / (a (b − x)) ]",
    "keys": [
      "second order kinetics unequal reactants",
      "a plus b gives products"
    ],
    "symbols": [
      "a, b: initial concentrations of A and B"
    ],
    "notes": [
      "When a = b, equation reduces to standard 1/(a−x) − 1/a = kt."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: k = [ 2.303 / (t (a − b)) ] · log[ (b (a − x)) / (a (b − x)) ]",
    "latex": "k = \\frac{2.303}{t(a - b)} \\log_{10}\\left[ \\frac{b(a - x)}{a(b - x)} \\right]"
  },
  {
    "id": "steady_state_approximation",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Steady-State Approximation (SSA) in Kinetics",
    "expr": "d[Intermediate] / dt ≈ 0",
    "keys": [
      "steady state approximation",
      "ssa kinetics",
      "reaction intermediates"
    ],
    "symbols": [
      "Valid when intermediate is highly reactive and decomposes as fast as it forms"
    ],
    "notes": [
      "Allows derivation of complex rate laws without solving differential equations."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: d[Intermediate] / dt ≈ 0",
    "latex": "\\frac{d[\\text{Intermediate}]}{dt} \\approx 0"
  },
  {
    "id": "zero_order_kinetics",
    "branch": "Physical",
    "chapter": "Chemical Kinetics",
    "title": "Zero-Order Reaction Rate Law, Integrated Form & Half-life",
    "expr": "[A]_t = [A]₀ − k · t   |   t_½ = [A]₀ / (2 k)   |   t_100% = [A]₀ / k",
    "keys": [
      "zero order kinetics",
      "integrated rate law zero order",
      "half life zero order",
      "units of k"
    ],
    "symbols": [
      "[A]₀: initial concentration",
      "[A]_t: concentration at time t",
      "k: rate constant (units: mol L⁻¹ s⁻¹)",
      "t_100%: time required for complete exhaustion of reactant"
    ],
    "notes": [
      "Rate is independent of reactant concentration: Rate = k.",
      "Half-life is DIRECTLY proportional to initial concentration: t_½ ∝ [A]₀.",
      "Common examples: catalytic decomposition of NH₃ on hot Pt surface, photochemical reaction H₂ + Cl₂ → 2HCl."
    ],
    "example": "If [A]₀ = 0.5 M and k = 0.05 mol L⁻¹ min⁻¹:\nt_½ = 0.5 / (2 × 0.05) = 5 min. Total completion time = 0.5 / 0.05 = 10 min.",
    "latex": "[A]_t = [A]_0 - k t \\quad \\Big| \\quad t_{1/2} = \\frac{[A]_0}{2 k} \\quad \\Big| \\quad t_{100\\%} = \\frac{[A]_0}{k}"
  },
  {
    "id": "conductance",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Conductance, Conductivity & Cell Constant",
    "expr": "R = ρ (l / A)   ,   G = κ / G*   ,   κ = G × (l / A) = G × G*",
    "keys": [
      "conductivity",
      "specific conductance",
      "cell constant",
      "resistivity"
    ],
    "symbols": [
      "R: resistance (Ω)",
      "G = 1/R: conductance (S or Ω⁻¹)",
      "κ: conductivity / specific conductance (S cm⁻¹ or S m⁻¹)",
      "G* = l / A: cell constant (cm⁻¹ or m⁻¹)"
    ],
    "notes": [
      "Molar conductivity: Λ_m = (1000 × κ) / Molarity (in S cm² mol⁻¹).",
      "Equivalent conductivity: Λ_eq = (1000 × κ) / Normality.",
      "As dilution increases, specific conductance κ DECREASES, while molar conductance Λ_m INCREASES."
    ],
    "example": "Conductance of 0.1 M KCl is 0.02 S in a cell with cell constant G* = 1.2 cm⁻¹:\nκ = G × G* = 0.02 × 1.2 = 0.024 S cm⁻¹.\nΛ_m = (1000 × 0.024) / 0.1 = 240 S cm² mol⁻¹.",
    "latex": "R = \\rho \\left( \\frac{l}{A} \\right), \\quad G = \\frac{\\kappa}{G^*}, \\quad \\kappa = G \\left( \\frac{l}{A} \\right) = G \\cdot G^*"
  },
  {
    "id": "kohlrausch_conductivity_relations",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Conductivity (κ), Molar Conductivity (Λm) & Kohlrausch's Law",
    "expr": "κ = (1 / R) · (l / A)   |   Λ_m = (1000 · κ) / M   |   Λ°_m = ν₊ λ°₊ + ν₋ λ°₋",
    "keys": [
      "kohlrausch law",
      "molar conductivity",
      "specific conductance",
      "cell constant",
      "limiting molar conductivity"
    ],
    "symbols": [
      "κ: specific conductivity (S cm⁻¹)",
      "l / A = G*: cell constant (cm⁻¹)",
      "Λ_m: molar conductivity (S cm² mol⁻¹)",
      "M: molarity (mol L⁻¹)",
      "ν₊, ν₋: stoichiometric numbers of cations and anions"
    ],
    "notes": [
      "Conductivity κ decreases on dilution because ion concentration drops; molar conductivity Λ_m INCREASES on dilution.",
      "For weak electrolytes: degree of dissociation α = Λ_m / Λ°_m."
    ],
    "example": "For NaCl: Λ°_m = λ°(Na⁺) + λ°(Cl⁻) = 50.1 + 76.3 = 126.4 S cm² mol⁻¹.",
    "latex": "\\kappa = \\left(\\frac{1}{R}\\right)\\left(\\frac{l}{A}\\right) \\quad \\Big| \\quad \\Lambda_m = \\frac{1000 \\cdot \\kappa}{M} \\quad \\Big| \\quad \\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ"
  },
  {
    "id": "conductometric_titrations_neutralisation",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Conductometric Titration: Strong Acid with Strong Base",
    "expr": "Conductance drops sharply to equivalence point (H⁺ replaced by Na⁺), then rises sharply (excess OH⁻)",
    "keys": [
      "conductometric titration",
      "hcl naoh conductance",
      "v shaped conductance curve"
    ],
    "symbols": [
      "Conductance: H⁺ (349.6) > OH⁻ (198.6) > Na⁺ (50.1) > Cl⁻ (76.3) S cm² mol⁻¹"
    ],
    "notes": [
      "Produces sharp V-shaped curve with minimum at equivalence point."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Conductance drops sharply to equivalence point (H⁺ replaced by Na⁺), then rises sharply (excess OH⁻)",
    "latex": "\\text{Conductance drops to eq. point (}\\ce{H+} \\to \\ce{Na+}\\text{), then rises sharply (excess } \\ce{OH-}\\text{)}"
  },
  {
    "id": "debye_huckel_onsager",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Debye–Hückel–Onsager Equation for Strong Electrolytes",
    "expr": "Λ_m = Λ°_m − A √C",
    "keys": [
      "debye huckel onsager",
      "strong electrolyte conductivity",
      "interionic attraction",
      "electrophoretic effect"
    ],
    "symbols": [
      "Λ_m: molar conductivity at concentration C",
      "Λ°_m: limiting molar conductivity at infinite dilution",
      "A: constant depending on solvent, temperature, and electrolyte charges (1:1, 2:1, etc.)",
      "C: molar concentration"
    ],
    "notes": [
      "Plotting Λ_m versus √C produces a straight line for strong electrolytes with intercept = Λ°_m.",
      "Fails for weak electrolytes (plot curves sharply upward near C = 0), necessitating Kohlrausch's law for Λ°_m."
    ],
    "example": "For 0.04 M KCl, if Λ°_m = 150 S cm² mol⁻¹ and A = 60:\nΛ_m = 150 − 60 × √(0.04) = 150 − 60 × 0.20 = 150 − 12 = 138 S cm² mol⁻¹.",
    "latex": "\\Lambda_m = \\Lambda_m^\\circ - (A + B\\Lambda_m^\\circ)\\sqrt{C} = \\Lambda_m^\\circ - A'\\sqrt{C}"
  },
  {
    "id": "electrochemical_series_trends",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Electrochemical Activity Series (Standard Reduction Potentials)",
    "expr": "Li⁺ (−3.05 V) < K⁺ (−2.93) < Ba²⁺ (−2.90) < Ca²⁺ (−2.87) < Na⁺ (−2.71) < Mg²⁺ (−2.37) < Al³⁺ (−1.66) < Zn²⁺ (−0.76) < Fe²⁺ (−0.44) < H⁺ (0.00 V) < Cu²⁺ (+0.34) < I₂ (+0.54) < Ag⁺ (+0.80) < Br₂ (+1.08) < Cr₂O₇²⁻ (+1.33) < Cl₂ (+1.36) < MnO₄⁻ (+1.51) < F₂ (+2.87 V)",
    "keys": [
      "electrochemical series",
      "reducing agent strength",
      "metal displacement",
      "standard reduction potential table"
    ],
    "symbols": [
      "Most negative reduction potential (Li): STRONGEST reducing agent in aqueous solution",
      "Most positive reduction potential (F₂): STRONGEST oxidising agent"
    ],
    "notes": [
      "Lithium is the strongest reducing agent in water due to its enormously high hydration enthalpy (tiny Li⁺ ion), despite not having the lowest ionisation energy (Cs has lower IE).",
      "Any metal lying ABOVE hydrogen in reduction series (E° < 0) displaces H₂ gas from dilute non-oxidising acids (HCl, dil. H₂SO₄)."
    ],
    "example": "Zinc displaces copper from CuSO₄ solution because E°(Zn²⁺/Zn) = −0.76 V is more negative than E°(Cu²⁺/Cu) = +0.34 V.",
    "latex": "\\ce{Li+ < K+ < Ba^2+ < Ca^2+ < Na+ < Mg^2+ < Al^3+ < Zn^2+ < Fe^2+ < H+ (0.00 V) < Cu^2+ < I2 < Ag+ < Br2 < Cr2O7^2- < Cl2 < MnO4- < F2}"
  },
  {
    "id": "corrosion_electrochemical_reactions",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Electrochemical Mechanism of Rusting of Iron",
    "expr": "Anode: Fe → Fe²⁺ + 2e⁻   |   Cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O   |   Overall: 2Fe + O₂ + 4H⁺ → 2Fe²⁺ + 2H₂O (E° = 1.67 V)",
    "keys": [
      "corrosion of iron",
      "rusting mechanism",
      "electrochemical cell rust"
    ],
    "symbols": [
      "Rust formula: Fe₂O₃ · xH₂O (hydrated iron(III) oxide)"
    ],
    "notes": [
      "H⁺ ions from dissolved CO₂ (H₂CO₃) act as catalyst."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Anode: Fe → Fe²⁺ + 2e⁻   |   Cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O   |   Overall: 2Fe + O₂ + 4H⁺ → 2Fe²⁺ + 2H₂O (E° = 1.67 V)",
    "latex": "\\text{Anode: } \\ce{Fe -> Fe^2+ + 2e-} \\quad \\Big| \\quad \\text{Cathode: } \\ce{O2 + 4H+ + 4e- -> 2H2O} \\quad \\Big| \\quad E^\\circ = 1.67\\text{ V}"
  },
  {
    "id": "concentration_cell_electrode",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Electrode Gas Concentration Cell EMF",
    "expr": "E_cell = (0.0592 / 2) · log(P₁ / P₂)   (for H₂ electrode at 298 K , where P₁ > P₂)",
    "keys": [
      "electrode concentration cell",
      "gas partial pressure emf"
    ],
    "symbols": [
      "Different gas pressures dipping in same solution"
    ],
    "notes": [
      "Spontaneous if P₁ (anode) > P₂ (cathode)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: E_cell = (0.0592 / 2) · log(P₁ / P₂)   (for H₂ electrode at 298 K , where P₁ > P₂)",
    "latex": "E_{\\text{cell}} = \\frac{0.0591}{2} \\log_{10}\\left(\\frac{P_1}{P_2}\\right) \\quad (\\text{for } \\ce{H2} \\text{ electrode at 298 K, where } P_1 > P_2)"
  },
  {
    "id": "concentration_cell_electrolyte",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Electrolyte Concentration Cell EMF",
    "expr": "E_cell = (0.0592 / n) · log(C₂ / C₁)   (at 298 K , where C₂ > C₁)",
    "keys": [
      "electrolyte concentration cell",
      "emf concentration ratio"
    ],
    "symbols": [
      "Same electrodes dipping in different concentrations of same electrolyte",
      "E° = 0"
    ],
    "notes": [
      "Spontaneous operation requires C₂ (cathode) > C₁ (anode)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: E_cell = (0.0592 / n) · log(C₂ / C₁)   (at 298 K , where C₂ > C₁)",
    "latex": "E_{\\text{cell}} = \\frac{0.0591}{n} \\log_{10}\\left(\\frac{C_2}{C_1}\\right) \\quad (\\text{at 298 K, where } C_2 > C_1)"
  },
  {
    "id": "equilibrium_constant_emf",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Equilibrium Constant from Standard Cell EMF",
    "expr": "log K_c = (n · E°_cell) / 0.0592   (at 298 K)   |   ΔG° = −n F E°_cell = −2.303 R T log K_c",
    "keys": [
      "equilibrium constant from emf",
      "delta g standard cell",
      "electrochemistry thermodynamics"
    ],
    "symbols": [
      "K_c: chemical equilibrium constant",
      "n: electrons transferred per mole of reaction",
      "E°_cell: standard potential (V)"
    ],
    "notes": [
      "A positive E°_cell means ΔG° < 0 and K_c > 1, so the cell reaction is thermodynamically spontaneous in the forward direction."
    ],
    "example": "For Daniell cell (E° = 1.10 V, n = 2):\nlog K_c = (2 × 1.10) / 0.0592 = 2.20 / 0.0592 ≈ 37.16 => K_c ≈ 1.45 × 10³⁷.",
    "latex": "\\log_{10} K_c = \\frac{n \\cdot E^\\circ_{\\text{cell}}}{0.0591} \\; (298\\text{ K}) \\quad \\Big| \\quad \\Delta G^\\circ = -n F E^\\circ_{\\text{cell}} = -2.303 R T \\log_{10} K_c"
  },
  {
    "id": "faraday",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Faraday's law of electrolysis",
    "expr": "m = M·I·t / (n·F)",
    "keys": [
      "faraday",
      "electrolysis"
    ],
    "symbols": [
      "m: mass deposited (g)",
      "M: molar mass (g mol⁻¹)",
      "I: current (A), t: time (s)",
      "n: electrons per ion, F = 96 485 C mol⁻¹"
    ],
    "notes": [
      "Charge Q = I·t.",
      "The same charge deposits masses in the ratio of the equivalent weights (second law)."
    ],
    "latex": "m = \\frac{M \\cdot I \\cdot t}{n F}"
  },
  {
    "id": "faradays_electrolysis_laws",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Faraday's Laws of Electrolysis & Charge Stoichiometry",
    "expr": "w = Z · I · t = (E / 96485) · I · t = [ (M · I · t) / (n-factor · 96485) ]",
    "keys": [
      "faradays laws",
      "electrolysis",
      "mass deposited",
      "electrochemical equivalent",
      "current efficiency"
    ],
    "symbols": [
      "w: mass of substance deposited or liberated (g)",
      "I: current in Amperes",
      "t: time in seconds",
      "E = M / n-factor: equivalent mass",
      "Z = E / 96485: electrochemical equivalent (g C⁻¹)",
      "1 Faraday (F) = 96485 C mol⁻¹ = charge of 1 mole of electrons"
    ],
    "notes": [
      "With current efficiency η%: w = w_theoretical × (η / 100).",
      "1 mol Al³⁺ requires 3 F (289,455 C); 1 mol Cu²⁺ requires 2 F; 1 mol Ag⁺ requires 1 F."
    ],
    "example": "Pass 2.0 A current through CuSO₄ solution for 965 seconds (Cu = 63.5, n = 2):\nw = (63.5 × 2.0 × 965) / (2 × 96485) = 122555 / 192970 ≈ 0.635 g Cu.",
    "latex": "w = Z \\cdot I \\cdot t = \\frac{E}{96485} \\cdot I \\cdot t = \\frac{M \\cdot I \\cdot t}{n\\text{-factor} \\cdot 96485}"
  },
  {
    "id": "fuel_cell_efficiency_equation",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "H₂–O₂ Fuel Cell Reactions & Thermodynamic Efficiency",
    "expr": "2H₂(g) + O₂(g) → 2H₂O(l)   (E° = 1.229 V)   |   Efficiency η = (ΔG° / ΔH°) × 100 ≈ 83%",
    "keys": [
      "fuel cell",
      "hydrogen oxygen cell",
      "thermodynamic efficiency",
      "clean energy"
    ],
    "symbols": [
      "Anode: 2H₂ + 4OH⁻ → 4H₂O + 4e⁻",
      "Cathode: O₂ + 2H₂O + 4e⁻ → 4OH⁻",
      "ΔG° = −237.2 kJ mol⁻¹ (useful electrical work)",
      "ΔH° = −285.8 kJ mol⁻¹ (heat of combustion)"
    ],
    "notes": [
      "Fuel cells convert chemical energy directly into electrical energy without Carnot thermal limit.",
      "Used in Apollo space missions: product water was used for astronaut drinking water."
    ],
    "example": "Theoretical efficiency η = (237.2 / 285.8) × 100% ≈ 83%, twice that of conventional thermal power plants (≈40%).",
    "latex": "\\ce{2H2(g) + O2(g) -> 2H2O(l)}, \\quad \\eta = \\frac{\\Delta G^\\circ}{\\Delta H^\\circ} \\times 100\\% \\approx 83\\%"
  },
  {
    "id": "kohlrausch",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Kohlrausch's laws",
    "expr": "Λm = Λm° − A√c   ,   Λm°(AₓB_y) = xλ°₊ + yλ°₋",
    "keys": [
      "kohlrausch",
      "conductivity",
      "molar conductivity"
    ],
    "symbols": [
      "Λm: molar conductivity at concentration c",
      "Λm°: limiting molar conductivity (c → 0)",
      "λ°₊, λ°₋: limiting ionic conductivities"
    ],
    "notes": [
      "The linear Λm vs √c relation applies to strong electrolytes.",
      "Weak electrolytes need the independent-migration law to find Λm°, and α = Λm/Λm°."
    ],
    "latex": "\\Lambda_m = \\Lambda_m^\\circ - A\\sqrt{c}, \\quad \\Lambda_m^\\circ(\\ce{A_x B_y}) = x \\lambda_+^\\circ + y \\lambda_-^\\circ"
  },
  {
    "id": "lead_acid_cell_reactions",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Lead Storage Battery Discharge & Recharge Reactions",
    "expr": "Discharge: Pb(s) + PbO₂(s) + 2H₂SO₄(aq) → 2PbSO₄(s) + 2H₂O(l)   (E_cell ≈ 2.05 V per cell)",
    "keys": [
      "lead acid battery",
      "lead storage cell",
      "rechargeable secondary battery",
      "specific gravity sulfuric acid"
    ],
    "symbols": [
      "Anode (discharge): Pb(s) + SO₄²⁻ → PbSO₄(s) + 2e⁻",
      "Cathode (discharge): PbO₂(s) + SO₄²⁻ + 4H⁺ + 2e⁻ → PbSO₄(s) + 2H₂O",
      "Density of H₂SO₄ drops from 1.30 g mL⁻¹ (fully charged) to 1.15 g mL⁻¹ (discharged)"
    ],
    "notes": [
      "During recharging, reactions reverse and density of H₂SO₄ rises back.",
      "A standard 12 V car battery connects 6 lead-acid cells in series."
    ],
    "example": "Discharging consumes sulfuric acid; testing acid density with a hydrometer indicates state of charge.",
    "latex": "\\textbf{Discharge: } \\ce{Pb(s) + PbO2(s) + 2H2SO4(aq) -> 2PbSO4(s) + 2H2O(l)} \\quad (E_{\\text{cell}} \\approx 2.05\\text{ V per cell})"
  },
  {
    "id": "lead_fuel_cells",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Lead-Acid Battery & H₂–O₂ Fuel Cell Equations",
    "expr": "Lead-Acid: Pb + PbO₂ + 2H₂SO₄ ⇌ 2PbSO₄ + 2H₂O   |   Fuel Cell: 2H₂ + O₂ → 2H₂O (E° = 1.23 V)",
    "keys": [
      "lead acid battery",
      "fuel cell",
      "commercial cells",
      "efficiency"
    ],
    "symbols": [
      "Lead storage discharge: Anode: Pb + SO₄²⁻ → PbSO₄ + 2e⁻; Cathode: PbO₂ + SO₄²⁻ + 4H⁺ + 2e⁻ → PbSO₄ + 2H₂O",
      "H₂–O₂ Fuel cell: Anode: 2H₂ + 4OH⁻ → 4H₂O + 4e⁻; Cathode: O₂ + 2H₂O + 4e⁻ → 4OH⁻"
    ],
    "notes": [
      "Lead storage battery: cell EMF ≈ 2.0 V per cell; a 12 V car battery contains 6 cells in series. During recharge, reactions reverse and density of H₂SO₄ rises back to 1.30 g mL⁻¹.",
      "Theoretical efficiency of fuel cell: η = (ΔG° / ΔH°) × 100 ≈ (237.2 / 285.8) × 100 ≈ 83%, compared to ~40% for thermal power plants."
    ],
    "example": "A fuel cell consumes 2 mol H₂ (4 Faradays = 385,940 C) at E° = 1.229 V:\nElectrical work w_max = −ΔG° = nFE° = 4 × 96485 × 1.229 ≈ 474.3 kJ.",
    "latex": "\\textbf{Lead-Acid: } \\ce{Pb + PbO2 + 2H2SO4 <=> 2PbSO4 + 2H2O} \\quad \\Big| \\quad \\textbf{Fuel Cell: } \\ce{2H2 + O2 -> 2H2O} \\; (E^\\circ = 1.23\\text{ V})"
  },
  {
    "id": "nernst",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Nernst equation",
    "expr": "E = E° − (RT/nF) ln Q",
    "keys": [
      "nernst"
    ],
    "symbols": [
      "E: cell potential under the given conditions (V)",
      "E°: standard cell potential (V)",
      "R = 8.314 J K⁻¹ mol⁻¹, T in kelvin",
      "n: electrons transferred in the balanced equation",
      "F = 96 485 C mol⁻¹",
      "Q: reaction quotient (pure solids/liquids omitted)"
    ],
    "notes": [
      "At 298 K with base-10 logs: E = E° − (0.0592/n) log Q.",
      "At equilibrium E = 0 and Q = K, so E° = (0.0592/n) log K.",
      "Write the balanced redox equation first; n must match it."
    ],
    "example": "Zn | Zn²⁺ (0.01 M) || Cu²⁺ (1 M) | Cu, E° = 1.10 V, n = 2.\nQ = 0.01/1 = 0.01\nE = 1.10 − (0.0592/2)(−2) = 1.10 + 0.059 ≈ 1.16 V",
    "latex": "E = E^\\circ - \\frac{R T}{n F} \\ln Q = E^\\circ - \\frac{0.0591}{n} \\log_{10} Q \\; (298\\text{ K})"
  },
  {
    "id": "nernst_standard_cell",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Nernst Equation for Complete Electrochemical Cell",
    "expr": "E_cell = E°_cell − (2.303 R T / n F) log Q   =   E°_cell − (0.0592 / n) log Q   (at 298 K)",
    "keys": [
      "nernst equation",
      "cell potential",
      "electrochemical cell",
      "reaction quotient emf"
    ],
    "symbols": [
      "E_cell: cell EMF under non-standard conditions (V)",
      "E°_cell = E°_cathode − E°_anode: standard cell potential",
      "n: moles of electrons transferred in balanced cell reaction",
      "Q: reaction quotient",
      "F = 96485 C mol⁻¹ (Faraday constant)"
    ],
    "notes": [
      "At equilibrium: E_cell = 0 and Q = K_c => E°_cell = (0.0592 / n) log K_c at 298 K.",
      "Concentration cell (same electrodes, different ion concs, E° = 0): E = (0.0592/n) log(C₂/C₁)."
    ],
    "example": "Daniell cell: Zn + Cu²⁺(0.01 M) → Zn²⁺(0.1 M) + Cu (E° = 1.10 V, n = 2):\nE = 1.10 − (0.0592 / 2) log(0.1 / 0.01) = 1.10 − 0.0296 × 1 = 1.0704 V.",
    "latex": "E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{2.303 R T}{n F}\\log_{10} Q = E^\\circ_{\\text{cell}} - \\frac{0.0592}{n}\\log_{10} Q \\; (298\\text{ K})"
  },
  {
    "id": "temperature_coeff_cell_emf",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Temperature Coefficient of EMF & Reaction Entropy",
    "expr": "(∂E / ∂T)_P = ΔS / (n F)   |   ΔH = −n F E + n F T (∂E / ∂T)_P",
    "keys": [
      "temperature coefficient emf",
      "entropy from cell potential",
      "enthalpy from emf"
    ],
    "symbols": [
      "(∂E/∂T)_P: temperature coefficient of cell potential (V K⁻¹)",
      "ΔS: entropy change of the cell reaction",
      "ΔH: enthalpy change"
    ],
    "notes": [
      "If (∂E/∂T)_P > 0, cell EMF increases with heating and cell absorbs heat from surroundings (q > 0).",
      "If (∂E/∂T)_P = 0, electrical energy output equals enthalpy change: −nFE = ΔH."
    ],
    "example": "A cell with n = 2 has E = 1.018 V and (∂E/∂T)_P = −5.0 × 10⁻⁵ V K⁻¹ at 298 K:\nΔS = 2 × 96485 × (−5.0 × 10⁻⁵) = −9.65 J K⁻¹ mol⁻¹.",
    "latex": "\\left( \\frac{\\partial E}{\\partial T} \\right)_P = \\frac{\\Delta S}{n F} \\quad \\Big| \\quad \\Delta H = -n F E + n F T \\left( \\frac{\\partial E}{\\partial T} \\right)_P"
  },
  {
    "id": "pourbaix_water_stability_limits",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Thermodynamic Stability Window of Liquid Water",
    "expr": "Upper (O₂ Evolution): E = 1.23 − 0.0592 · pH (V)   |   Lower (H₂ Evolution): E = −0.0592 · pH (V)",
    "keys": [
      "water stability window",
      "pourbaix diagram",
      "electrolysis of water",
      "overpotential"
    ],
    "symbols": [
      "At pH 0: water is oxidised to O₂ at E > 1.23 V; water is reduced to H₂ at E < 0.00 V",
      "At pH 7: upper limit E = 0.816 V; lower limit E = −0.414 V",
      "Stability window voltage = 1.229 V at all pH values"
    ],
    "notes": [
      "Species with redox potentials outside this window are thermodynamically capable of decomposing water into H₂ or O₂.",
      "Overpotential (kinetic overvoltage on electrodes) expands the practical operating window beyond 1.23 V."
    ],
    "example": "At standard conditions, decomposing pure water into H₂ and O₂ requires a minimum theoretical EMF of 1.23 V.",
    "latex": "\\text{O}_2 \\text{ Evolution: } E = 1.23 - 0.0592 \\cdot \\text{pH} \\quad \\Big| \\quad \\ce{H2} \\text{ Evolution: } E = -0.0592 \\cdot \\text{pH} \\quad (\\text{V at 298 K})"
  },
  {
    "id": "emf_thermodynamics",
    "branch": "Physical",
    "chapter": "Electrochemistry",
    "title": "Thermodynamics of Electrochemical Cells",
    "expr": "ΔG° = −nFE°_cell   ,   ΔS = nF (dE/dT)_P   ,   ΔH = −nFE + nFT (dE/dT)_P",
    "keys": [
      "emf thermodynamics",
      "temperature coefficient",
      "delta g cell"
    ],
    "symbols": [
      "(dE/dT)_P: temperature coefficient of cell EMF",
      "E: cell EMF at temperature T"
    ],
    "notes": [
      "If (dE/dT)_P > 0: cell reaction is accompanied by an increase in entropy (absorbs heat from surroundings, cools during discharge).",
      "If (dE/dT)_P < 0: cell releases heat upon operation."
    ],
    "example": "Standard Daniell cell (n=2, E° = 1.10 V):\nΔG° = −2 × 96485 × 1.10 = −212,267 J = −212.3 kJ mol⁻¹.",
    "latex": "\\Delta G^\\circ = -n F E^\\circ_{\\text{cell}}, \\quad \\Delta S = n F \\left(\\frac{\\partial E}{\\partial T}\\right)_P, \\quad \\Delta H = -n F E + n F T \\left(\\frac{\\partial E}{\\partial T}\\right)_P"
  },
  {
    "id": "bod_cod_pollution",
    "branch": "Physical",
    "chapter": "Environmental Chemistry",
    "title": "Biochemical & Chemical Oxygen Demand (BOD / COD)",
    "expr": "BOD = (DO_initial − DO_5days) in mg L⁻¹ (ppm)   ,   COD > BOD (K₂Cr₂O₇ digestion)",
    "keys": [
      "bod",
      "cod",
      "dissolved oxygen",
      "water pollution"
    ],
    "symbols": [
      "DO: Dissolved Oxygen in water",
      "BOD: amount of oxygen consumed by aerobic microorganisms to decompose biodegradable organic matter in 5 days at 20 °C",
      "COD: total oxygen required to oxidise all organic matter chemically by acidic K₂Cr₂O₇"
    ],
    "notes": [
      "Clean drinking water has BOD < 5 ppm (5 mg L⁻¹).",
      "Severely polluted river water has BOD ≥ 17 ppm.",
      "COD is always greater than BOD because K₂Cr₂O₇ oxidises both biodegradable AND non-biodegradable organic substances."
    ],
    "example": "Sample with initial DO = 9.0 ppm and DO after 5 days = 3.0 ppm:\nBOD = 9.0 − 3.0 = 6.0 ppm (moderate organic pollution).",
    "latex": "\\text{BOD} = \\text{DO}_{\\text{initial}} - \\text{DO}_{\\text{5 days}} \\; (\\text{mg L}^{-1}), \\quad \\text{COD} > \\text{BOD} \\; (\\ce{K2Cr2O7} \\text{ digestion})"
  },
  {
    "id": "biochemical_oxygen_demand_bod",
    "branch": "Physical",
    "chapter": "Environmental Chemistry",
    "title": "Biochemical Oxygen Demand (BOD) & Water Quality",
    "expr": "BOD = (DO_initial − DO_after 5 days at 20 °C) in mg L⁻¹ (ppm)",
    "keys": [
      "bod",
      "biochemical oxygen demand",
      "clean water",
      "water pollution"
    ],
    "symbols": [
      "DO: dissolved oxygen (pure water at 20 °C has DO ≈ 9 ppm)",
      "Clean drinking water: BOD < 5 ppm",
      "Highly polluted water: BOD > 17 ppm"
    ],
    "notes": [
      "Chemical Oxygen Demand (COD) measures total chemical oxidisability using K₂Cr₂O₇ in acid; COD is ALWAYS greater than BOD because it oxidises non-biodegradable matter as well."
    ],
    "example": "Domestic sewage has BOD of 100–400 ppm; industrial wastewater can exceed 1000 ppm.",
    "latex": "\\text{BOD} = \\text{DO}_{\\text{initial}} - \\text{DO}_{\\text{after 5 days at } 20^\\circ\\text{C}} \\; (\\text{ppm})"
  },
  {
    "id": "indicator_ph_range",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Acid-Base Indicator Transition pH Range",
    "expr": "pH Range = pK_In ± 1   |   K_In = [H⁺][In⁻] / [HIn]",
    "keys": [
      "indicator transition range",
      "phenolphthalein",
      "methyl orange"
    ],
    "symbols": [
      "At midpoint of colour change: [In⁻] = [HIn] => pH = pK_In"
    ],
    "notes": [
      "Phenolphthalein: pK_In ≈ 9.6 (range 8.3–10.0); Methyl orange: pK_In ≈ 3.7 (range 3.1–4.4)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: pH Range = pK_In ± 1   |   K_In = [H⁺][In⁻] / [HIn]",
    "latex": "\\text{pH Range} = \\text{p}K_{\\text{In}} \\pm 1, \\quad K_{\\text{In}} = \\frac{[\\ce{H+}][\\ce{In-}]}{[\\ce{HIn}]}"
  },
  {
    "id": "buffer_capacity_equation",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Buffer Capacity (van Slyke Equation)",
    "expr": "β = d(b) / dpH = 2.303 · [ (C_a · C_b) / (C_a + C_b) ]",
    "keys": [
      "buffer capacity",
      "van slyke equation",
      "maximum buffer action"
    ],
    "symbols": [
      "b: moles of strong acid/base added per litre"
    ],
    "notes": [
      "Buffer capacity is maximum when C_a = C_b (pH = pKa)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: β = d(b) / dpH = 2.303 · [ (C_a · C_b) / (C_a + C_b) ]",
    "latex": "\\beta = \\frac{db}{d(\\text{pH})} = 2.303 \\left[ \\frac{C_a \\cdot C_b}{C_a + C_b} \\right]"
  },
  {
    "id": "common_ion_solubility",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Common Ion Effect on Salt Solubility",
    "expr": "In presence of common ion C: S' ≈ K_sp / C   (for 1:1 electrolyte AB)",
    "keys": [
      "common ion effect",
      "suppression of solubility",
      "le chatelier ionic"
    ],
    "symbols": [
      "S': diminished solubility in presence of common ion",
      "C: concentration of common ion provided by strong electrolyte (assuming C >> S')"
    ],
    "notes": [
      "Dramatic decrease in solubility is exploited in salt purifications (e.g. NaCl precipitated by bubbling HCl gas into brine)."
    ],
    "example": "Solubility of AgCl (K_sp = 1.8 × 10⁻¹⁰) in 0.1 M NaCl:\n[Cl⁻] ≈ 0.1 M.\nS' = K_sp / [Cl⁻] = 1.8 × 10⁻¹⁰ / 0.1 = 1.8 × 10⁻⁹ mol L⁻¹ (reduced 7400-fold from pure water's 1.34 × 10⁻⁵ M).",
    "latex": "\\text{In presence of common ion } [\\ce{C+}]: \\; S' \\approx \\frac{K_{\\text{sp}}}{[\\ce{C+}]} \\quad (\\text{for 1:1 electrolyte } \\ce{AB})"
  },
  {
    "id": "vapour_density_dissociation_degree",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Degree of Dissociation from Vapour Density",
    "expr": "α = (D − d) / [ (n − 1) d ] = (M_theoretical − M_observed) / [ (n − 1) M_observed ]",
    "keys": [
      "degree of dissociation",
      "vapour density",
      "abnormal molar mass",
      "equilibrium dissociation"
    ],
    "symbols": [
      "D: theoretical vapour density before dissociation = M_theoretical / 2",
      "d: observed experimental vapour density = M_observed / 2",
      "n: number of moles of product gas formed from 1 mole of reactant gas",
      "α: degree of dissociation (0 ≤ α ≤ 1)"
    ],
    "notes": [
      "For association (e.g. 2CH₃COOH ⇌ (CH₃COOH)₂): α = (d − D) / [ d (1 − 1/n) ]."
    ],
    "example": "PCl₅ ⇌ PCl₃ + Cl₂ (n = 2). Theoretical M = 208.5 => D = 104.25. Observed d = 70:\nα = (104.25 − 70) / [ (2 − 1) × 70 ] = 34.25 / 70 ≈ 0.489 = 48.9%.",
    "latex": "\\alpha = \\frac{D - d}{(n - 1) d} = \\frac{M_{\\text{theoretical}} - M_{\\text{observed}}}{(n - 1) M_{\\text{observed}}}"
  },
  {
    "id": "henderson_hasselbalch_buffers",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Henderson–Hasselbalch Equation for Buffer Solutions",
    "expr": "Acidic: pH = pK_a + log([Salt] / [Acid])   |   Basic: pOH = pK_b + log([Salt] / [Base])",
    "keys": [
      "henderson hasselbalch",
      "buffer solution",
      "acidic buffer",
      "basic buffer",
      "buffer capacity"
    ],
    "symbols": [
      "pK_a = −log K_a",
      "pK_b = −log K_b",
      "[Salt]: conjugate base/acid concentration"
    ],
    "notes": [
      "Maximum buffer capacity occurs when [Salt] = [Acid], giving pH = pK_a.",
      "Effective buffer range: pH = pK_a ± 1.",
      "Diluting a buffer with pure water changes neither [Salt]/[Acid] ratio nor pH."
    ],
    "example": "Buffer made of 0.1 M CH₃COOH and 0.2 M CH₃COONa (pK_a = 4.76):\npH = 4.76 + log(0.2 / 0.1) = 4.76 + 0.301 = 5.06.",
    "latex": "\\text{Acidic: } \\text{pH} = \\text{p}K_a + \\log_{10}\\left(\\frac{[\\text{Salt}]}{[\\text{Acid}]}\\right) \\quad \\Big| \\quad \\text{Basic: } \\text{pOH} = \\text{p}K_b + \\log_{10}\\left(\\frac{[\\text{Salt}]}{[\\text{Base}]}\\right)"
  },
  {
    "id": "le_chatelier_inert_gas_const_p",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Inert Gas Addition at Constant Pressure",
    "expr": "Adding inert gas at CONSTANT PRESSURE shifts equilibrium toward GREATER moles of gas (Δn_g > 0)",
    "keys": [
      "inert gas constant pressure",
      "le chatelier volume expansion"
    ],
    "symbols": [
      "Total pressure constant implies volume expands, reducing all partial pressures"
    ],
    "notes": [
      "If Δn_g = 0, inert gas at constant pressure still has no effect."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Adding inert gas at CONSTANT PRESSURE shifts equilibrium toward GREATER moles of gas (Δn_g > 0)",
    "latex": "\\text{At const. } P: \\; \\text{Inert gas shifts equilibrium toward side with GREATER moles of gas } (\\Delta n_g > 0)"
  },
  {
    "id": "le_chatelier_inert_gas_const_v",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Inert Gas Addition at Constant Volume",
    "expr": "Adding inert gas at CONSTANT VOLUME has NO EFFECT on chemical equilibrium",
    "keys": [
      "inert gas constant volume",
      "le chatelier inert gas"
    ],
    "symbols": [
      "Volume remains constant, so partial pressures and concentrations of reacting species remain unchanged"
    ],
    "notes": [
      "Frequently asked trick question in JEE Main and Advanced."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Adding inert gas at CONSTANT VOLUME has NO EFFECT on chemical equilibrium",
    "latex": "\\text{At const. } V: \\; \\text{Addition of inert gas has NO EFFECT on chemical equilibrium } (\\Delta[C] = 0)"
  },
  {
    "id": "water_autoionisation_kw",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Ionic Product of Water & Temperature Effect",
    "expr": "K_w = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ (at 298 K)   |   pH + pOH = pK_w = 14",
    "keys": [
      "kw",
      "ionic product of water",
      "ph scale",
      "neutral water ph"
    ],
    "symbols": [
      "K_w: autoionisation constant of water",
      "Neutrality condition: [H⁺] = [OH⁻] = √K_w at ALL temperatures"
    ],
    "notes": [
      "Autoionisation of water is ENDOTHERMIC (H₂O ⇌ H⁺ + OH⁻, ΔH > 0), so K_w increases with temperature.",
      "At 363 K (90 °C), K_w ≈ 10⁻¹², so neutral pH = 6.0; pH 7 at 90 °C is ALKALINE."
    ],
    "example": "At 25 °C, pure water has [H⁺] = 10⁻⁷ M, pH = −log(10⁻⁷) = 7.0.",
    "latex": "K_w = [\\ce{H+}][\\ce{OH-}] = 1.0 \\times 10^{-14} \\; (298\\text{ K}), \\quad \\text{pH} + \\text{pOH} = \\text{p}K_w = 14"
  },
  {
    "id": "ostwald_dilution_law",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Ostwald's Dilution Law for Weak Acids & Bases",
    "expr": "K_a = (C α²) / (1 − α)   =>   α ≈ √(K_a / C)   (when α ≤ 0.05)   |   [H⁺] = C α = √(K_a C)",
    "keys": [
      "ostwald dilution law",
      "degree of ionisation",
      "weak acid ph",
      "weak electrolyte"
    ],
    "symbols": [
      "K_a: acid dissociation constant",
      "C: initial molar concentration",
      "α: degree of dissociation"
    ],
    "notes": [
      "As concentration decreases (infinite dilution), α approaches 1.0 (100% ionisation).",
      "If calculated α > 0.05 (5%), solve the exact quadratic: C α² + K_a α − K_a = 0."
    ],
    "example": "0.1 M CH₃COOH (K_a = 1.8 × 10⁻⁵):\nα = √(1.8 × 10⁻⁵ / 0.1) = √(1.8 × 10⁻⁴) ≈ 0.0134 (1.34%).\n[H⁺] = C α = 0.1 × 0.0134 = 1.34 × 10⁻³ M => pH = 2.87.",
    "latex": "K_a = \\frac{C \\alpha^2}{1 - \\alpha} \\implies \\alpha \\approx \\sqrt{\\frac{K_a}{C}} \\; (\\alpha \\le 0.05) \\quad \\Big| \\quad [\\ce{H+}] = C \\alpha = \\sqrt{K_a C}"
  },
  {
    "id": "amphiprotic_salt_ph",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "pH of Amphiprotic Species Solutions (NaHCO₃, NaHS)",
    "expr": "pH = ½ [ pK_a1 + pK_a2 ]   =>   [H⁺] = √(K_a1 · K_a2)",
    "keys": [
      "amphiprotic salt",
      "sodium bicarbonate",
      "nahco3 ph",
      "isoelectric point"
    ],
    "symbols": [
      "pK_a1, pK_a2: successive dissociation constants of the parent polyprotic acid (e.g. H₂CO₃)"
    ],
    "notes": [
      "The pH of an amphiprotic salt solution is independent of its concentration over a wide range."
    ],
    "example": "For NaHCO₃ (H₂CO₃: pK_a1 = 6.35, pK_a2 = 10.33):\npH = ½ (6.35 + 10.33) = ½ (16.68) = 8.34.",
    "latex": "\\text{pH} = \\frac{\\text{p}K_{a1} + \\text{p}K_{a2}}{2} \\implies [\\ce{H+}] = \\sqrt{K_{a1} \\cdot K_{a2}}"
  },
  {
    "id": "ph_polyprotic_acids",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Polyprotic Acid Equilibria & Dianion Concentration",
    "expr": "For H₂A: [H⁺] ≈ √(K_a1 · C)   |   [A²⁻] ≈ K_a2   (independent of C)",
    "keys": [
      "polyprotic acid",
      "diprotic acid",
      "ka1 and ka2",
      "sulfuric acid",
      "h2s"
    ],
    "symbols": [
      "K_a1, K_a2: first and second dissociation constants (usually K_a1 >> K_a2 by 10³ to 10⁶)"
    ],
    "notes": [
      "Second ionisation is suppressed by the high [H⁺] from the first step.",
      "Concentration of divalent conjugate base [A²⁻] is numerically equal to K_a2 regardless of initial acid concentration."
    ],
    "example": "For 0.1 M H₂S (K_a1 = 1 × 10⁻⁷, K_a2 = 1 × 10⁻¹⁴):\n[H⁺] ≈ √(10⁻⁷ × 0.1) = 10⁻⁴ M.\n[S²⁻] ≈ K_a2 = 1.0 × 10⁻¹⁴ M.",
    "latex": "\\text{For } \\ce{H2A}: \\; [\\ce{H+}] \\approx \\sqrt{K_{a1} \\cdot C} \\quad \\Big| \\quad [\\ce{A^2-}] \\approx K_{a2}"
  },
  {
    "id": "reaction_quotient_direction",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Reaction Quotient Q & Equilibrium Direction",
    "expr": "Q_c = Π [Products]^coeff / Π [Reactants]^coeff   |   Q < K: Forward   |   Q > K: Reverse",
    "keys": [
      "reaction quotient",
      "direction of reaction",
      "le chatelier",
      "qc vs kc"
    ],
    "symbols": [
      "Q_c: non-equilibrium concentration ratio",
      "K_c: equilibrium constant",
      "Q = K: dynamic equilibrium established"
    ],
    "notes": [
      "Pure solids and pure liquids have activity = 1 and are excluded from expressions of Q and K."
    ],
    "example": "For A ⇌ B with K_c = 10. If [A] = 2 M, [B] = 4 M: Q_c = 4/2 = 2. Since Q_c < K_c, reaction proceeds forward.",
    "latex": "Q_c = \\frac{\\prod [\\text{Products}]^{\\nu_i}}{\\prod [\\text{Reactants}]^{\\nu_j}} \\quad \\Big| \\quad Q < K \\implies \\text{Forward} \\quad \\Big| \\quad Q > K \\implies \\text{Reverse}"
  },
  {
    "id": "kp_kc_kx_relations",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Relationships Between Kp, Kc, and Kx",
    "expr": "K_p = K_c (R T)^Δn_g   |   K_p = K_x (P_total)^Δn_g",
    "keys": [
      "kp and kc",
      "equilibrium constants",
      "delta ng",
      "gas equilibrium"
    ],
    "symbols": [
      "Δn_g = Σ n_g(products) − Σ n_g(reactants): change in gaseous moles",
      "R = 0.0821 L atm K⁻¹ mol⁻¹ (when P in atm) or 0.08314 L bar K⁻¹ mol⁻¹",
      "K_x: equilibrium constant expressed in mole fractions"
    ],
    "notes": [
      "If Δn_g = 0: K_p = K_c = K_x and pressure has no effect on equilibrium composition.",
      "If Δn_g > 0: K_p > K_c (for RT > 1); adding inert gas at constant pressure shifts equilibrium right.",
      "If Δn_g < 0: increasing pressure shifts equilibrium forward."
    ],
    "example": "N₂(g) + 3H₂(g) ⇌ 2NH₃(g): Δn_g = 2 − (1 + 3) = −2.\nK_p = K_c (RT)⁻² = K_c / (RT)².",
    "latex": "K_p = K_c (R T)^{\\Delta n_g} = K_x (P_{\\text{total}})^{\\Delta n_g}"
  },
  {
    "id": "salt_hydrolysis_cases",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Salt Hydrolysis Constant (Kh), Degree (h) & pH",
    "expr": "WA + SB: pH = 7 + ½ pK_a + ½ log C   |   SA + WB: pH = 7 − ½ pK_b − ½ log C   |   WA + WB: pH = 7 + ½ pK_a − ½ pK_b",
    "keys": [
      "salt hydrolysis",
      "hydrolysis constant",
      "ph of salt",
      "anionic hydrolysis",
      "cationic hydrolysis"
    ],
    "symbols": [
      "K_h: hydrolysis constant = K_w / K_a (for WA+SB) or K_w / (K_a K_b) (for WA+WB)",
      "h: degree of hydrolysis",
      "C: salt molarity"
    ],
    "notes": [
      "For salt of Weak Acid + Weak Base (e.g. CH₃COONH₄), pH is COMPLETELY INDEPENDENT of concentration C.",
      "Salt of Strong Acid + Strong Base (NaCl) does NOT hydrolyse: neutral pH = 7."
    ],
    "example": "0.1 M CH₃COONa (pK_a of acetic acid = 4.76):\npH = 7 + 0.5(4.76) + 0.5 log(0.1) = 7 + 2.38 − 0.50 = 8.88 (alkaline solution).",
    "latex": "\\text{WA-SB: } \\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a + \\log_{10} C) \\quad \\Big| \\quad \\text{SA-WB: } \\text{pH} = 7 - \\frac{1}{2}(\\text{p}K_b + \\log_{10} C) \\quad \\Big| \\quad \\text{WA-WB: } \\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a - \\text{p}K_b)"
  },
  {
    "id": "simultaneous_solubility",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Simultaneous Solubility of Two Sparingly Soluble Salts",
    "expr": "Common ion concentration is sum of contributions from both salts",
    "keys": [
      "simultaneous solubility",
      "two sparingly soluble salts",
      "common ion ksp"
    ],
    "symbols": [
      "For AgCl (Ksp1) and AgBr (Ksp2): [Ag⁺] = S₁ + S₂",
      "Ksp1 = (S₁ + S₂) S₁ ; Ksp2 = (S₁ + S₂) S₂"
    ],
    "notes": [
      "Ratio of solubilities: S₁ / S₂ = Ksp1 / Ksp2."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Common ion concentration is sum of contributions from both salts",
    "latex": "\\text{Simultaneous Solubility: } [\\ce{A+}]_{\\text{total}} = [\\ce{A+}]_1 + [\\ce{A+}]_2 \\quad (\\text{Sum of common ion contributions})"
  },
  {
    "id": "solubility_product_ksp",
    "branch": "Physical",
    "chapter": "Equilibrium",
    "title": "Solubility Product (Ksp) & Solubility (S)",
    "expr": "A_x B_y ⇌ x A^y⁺ + y B^x⁻   =>   K_sp = x^x · y^y · S^(x + y)",
    "keys": [
      "ksp",
      "solubility product",
      "sparingly soluble salt",
      "molar solubility"
    ],
    "symbols": [
      "S: molar solubility in pure water (mol L⁻¹)",
      "AB salt: K_sp = S²",
      "AB₂ or A₂B salt: K_sp = 4 S³",
      "AB₃ salt: K_sp = 27 S⁴",
      "A₂B₃ salt: K_sp = 108 S⁵"
    ],
    "notes": [
      "Condition for precipitation: Ionic Product Q_sp > K_sp.",
      "Saturated solution: Q_sp = K_sp; Unsaturated: Q_sp < K_sp."
    ],
    "example": "For Ag₂CrO₄ (A₂B type), K_sp = 1.1 × 10⁻¹²:\nK_sp = 4 S³ => S = ³√(1.1 × 10⁻¹² / 4) = ³√(2.75 × 10⁻¹³) ≈ 6.5 × 10⁻⁵ mol L⁻¹.",
    "latex": "\\ce{A}_x\\ce{B}_y \\rightleftharpoons x\\ce{A}^{y+} + y\\ce{B}^{x-}, \\quad K_{\\text{sp}} = x^x y^y S^{x + y}"
  },
  {
    "id": "hardness_of_water_calculation",
    "branch": "Physical",
    "chapter": "Hydrogen",
    "title": "Total Hardness of Water in ppm CaCO₃ Equivalent",
    "expr": "Hardness (ppm) = [ (Mass of hardness causing salt in mg) / (Molar mass of salt) ] × 100 × (10³ / V_water in L)",
    "keys": [
      "hardness of water",
      "temporary hardness",
      "permanent hardness",
      "ppm caco3"
    ],
    "symbols": [
      "Temporary hardness: caused by Ca(HCO₃)₂ and Mg(HCO₃)₂, removed by boiling or Clark's process (lime Ca(OH)₂)",
      "Permanent hardness: caused by CaCl₂, MgCl₂, CaSO₄, MgSO₄, removed by washing soda, permutit (zeolite), or Calgon"
    ],
    "notes": [
      "Calgon: Sodium hexametaphosphate Na₆P₆O₁₈ (or Na₂[Na₄(PO₃)₆]), forms soluble complex [Na₂Ca₂(PO₃)₆]²⁻ keeping Ca²⁺ in solution."
    ],
    "example": "Water containing 16.2 mg Ca(HCO₃)₂ (M = 162) per litre has hardness = (16.2/162) × 100 = 10 ppm CaCO₃.",
    "latex": "\\text{Hardness (ppm)} = \\left[ \\frac{\\text{Mass of hardness-causing salt (mg)}}{\\text{Molar mass of salt}} \\right] \\times 100 \\times \\left( \\frac{10^3}{V_{\\text{water}} \\text{ (L)}} \\right)"
  },
  {
    "id": "henderson",
    "branch": "Physical",
    "chapter": "Ionic equilibrium",
    "title": "Henderson–Hasselbalch equation",
    "expr": "pH = pKa + log ([A⁻]/[HA])",
    "keys": [
      "henderson",
      "buffer"
    ],
    "symbols": [
      "pKa = −log Ka of the weak acid",
      "[A⁻]: conjugate-base (salt) concentration",
      "[HA]: weak-acid concentration"
    ],
    "notes": [
      "Basic buffer: pOH = pKb + log ([BH⁺]/[B]).",
      "When [A⁻] = [HA], pH = pKa.",
      "Buffer capacity is best within about pKa ± 1."
    ],
    "latex": "\\text{pH} = \\text{p}K_a + \\log_{10}\\left( \\frac{[\\ce{A-}]}{[\\ce{HA}]} \\right)"
  },
  {
    "id": "ostwald_dilution",
    "branch": "Physical",
    "chapter": "Ionic Equilibrium",
    "title": "Ostwald's Dilution Law & Weak Electrolytes",
    "expr": "K_a = Cα² / (1 − α)   =>   α = √(K_a / C)   ,   [H⁺] = Cα = √(K_a × C)",
    "keys": [
      "ostwald dilution",
      "weak acid ionization",
      "degree of ionization"
    ],
    "symbols": [
      "K_a: acid dissociation constant",
      "C: molar concentration",
      "α: degree of dissociation (valid when α << 0.05)"
    ],
    "notes": [
      "pH of a weak acid: pH = ½ [pK_a − log C].",
      "For a weak base: [OH⁻] = √(K_b × C), pOH = ½ [pK_b − log C].",
      "As dilution increases (C → 0), α approaches 1 (100% ionisation)."
    ],
    "example": "0.1 M CH₃COOH with K_a = 1.8 × 10⁻⁵:\nα = √(1.8 × 10⁻⁵ / 0.1) = √(1.8 × 10⁻⁴) ≈ 1.34 × 10⁻² (1.34%).\n[H⁺] = 0.1 × 0.0134 = 1.34 × 10⁻³ M  =>  pH ≈ 2.87.",
    "latex": "K_a = \\frac{C \\alpha^2}{1 - \\alpha} \\approx C \\alpha^2, \\quad \\alpha = \\sqrt{\\frac{K_a}{C}} = \\frac{\\Lambda_m}{\\Lambda_m^\\circ}"
  },
  {
    "id": "salt_hydrolysis",
    "branch": "Physical",
    "chapter": "Ionic Equilibrium",
    "title": "Salt Hydrolysis Equations",
    "expr": "WA + SB: pH = 7 + ½ pK_a + ½ log C   |   SA + WB: pH = 7 − ½ pK_b − ½ log C   |   WA + WB: pH = 7 + ½ pK_a − ½ pK_b",
    "keys": [
      "salt hydrolysis",
      "hydrolysis constant",
      "ph of salt"
    ],
    "symbols": [
      "K_h: hydrolysis constant",
      "WA + SB (e.g. CH₃COONa): K_h = K_w / K_a, h = √(K_w / (K_a · C))",
      "SA + WB (e.g. NH₄Cl): K_h = K_w / K_b, h = √(K_w / (K_b · C))",
      "WA + WB (e.g. CH₃COONH₄): K_h = K_w / (K_a · K_b), h = √(K_h) (independent of C)"
    ],
    "notes": [
      "Salts of Strong Acid + Strong Base (NaCl, KNO₃) do NOT hydrolyse: pH = 7 at 25 °C.",
      "For WA + WB, pH is independent of the salt concentration C."
    ],
    "example": "0.1 M CH₃COONa (pK_a = 4.74):\npH = 7 + ½(4.74) + ½(log 0.1) = 7 + 2.37 − 0.5 = 8.87 (alkaline).",
    "latex": "\\text{WA-SB: } \\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a + \\log_{10} C) \\quad \\Big| \\quad \\text{SA-WB: } \\text{pH} = 7 - \\frac{1}{2}(\\text{p}K_b + \\log_{10} C) \\quad \\Big| \\quad \\text{WA-WB: } \\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a - \\text{p}K_b)"
  },
  {
    "id": "solubility_product",
    "branch": "Physical",
    "chapter": "Ionic Equilibrium",
    "title": "Solubility Product (K_sp)",
    "expr": "A_x B_y ⇌ x A^(y+) + y B^(x−)   =>   K_sp = x^x · y^y · S^(x+y)",
    "keys": [
      "solubility product",
      "ksp",
      "precipitation"
    ],
    "symbols": [
      "S: molar solubility (mol L⁻¹)",
      "x, y: stoichiometric coefficients"
    ],
    "notes": [
      "For 1:1 salt (AgCl): K_sp = S²  =>  S = √K_sp.",
      "For 1:2 or 2:1 salt (CaF₂, Ag₂CrO₄): K_sp = 4S³  =>  S = ∛(K_sp / 4).",
      "For 1:3 salt (Al(OH)₃): K_sp = 27S⁴  =>  S = ⁴√(K_sp / 27).",
      "Precipitation occurs if Ionic Product Q_sp > K_sp."
    ],
    "example": "CaF₂ with K_sp = 3.2 × 10⁻¹¹:\nK_sp = 4S³  =>  S³ = 8 × 10⁻¹²  =>  S = 2 × 10⁻⁴ mol L⁻¹.",
    "latex": "\\ce{A}_x\\ce{B}_y \\rightleftharpoons x\\ce{A}^{y+} + y\\ce{B}^{x-} \\implies K_{\\text{sp}} = x^x y^y S^{x + y}"
  },
  {
    "id": "nuclear_decay",
    "branch": "Physical",
    "chapter": "Nuclear Chemistry",
    "title": "Radioactive Decay Law & Mass Defect",
    "expr": "N = N₀ e^(−λt)   ,   t_½ = 0.693 / λ   ,   ΔE = Δm × 931.5 MeV",
    "keys": [
      "nuclear chemistry",
      "radioactive decay",
      "binding energy",
      "mass defect"
    ],
    "symbols": [
      "N: number of active nuclei at time t",
      "N₀: initial nuclei",
      "λ: radioactive decay constant",
      "A = λN: activity (Becquerel / Curie)",
      "Δm: mass defect in amu (mass of separate nucleons − mass of nucleus)"
    ],
    "notes": [
      "Radioactive decay always follows first-order kinetics strictly.",
      "Average life τ = 1 / λ = 1.44 t_½.",
      "1 Curie (Ci) = 3.7 × 10¹⁰ disintegrations per second (dps). 1 Bq = 1 dps."
    ],
    "example": "A radioisotope has t_½ = 5 days. Fraction remaining after 15 days (3 half-lives):\nN / N₀ = (½)³ = 1/8 (12.5%).",
    "latex": "N_t = N_0 \\, e^{-\\lambda t}, \\quad t_{1/2} = \\frac{0.693}{\\lambda}, \\quad \\Delta E = \\Delta m \\times 931.5\\,\\text{MeV}"
  },
  {
    "id": "radiocarbon_dating",
    "branch": "Physical",
    "chapter": "Nuclear Chemistry",
    "title": "Radiocarbon Dating Formula",
    "expr": "t = (2.303 / λ) log (A₀ / A) = (t_½ / 0.693) · 2.303 log (A₀ / A)",
    "keys": [
      "radiocarbon dating",
      "carbon 14",
      "half life carbon",
      "archeological dating"
    ],
    "symbols": [
      "t: age of fossil / wooden artifact",
      "A₀: specific activity of ¹⁴C in living organism (≈ 15.3 dpm per gram carbon)",
      "A: measured activity in fossil",
      "t_½(¹⁴C) = 5730 years  =>  λ = 1.21 × 10⁻⁴ yr⁻¹"
    ],
    "notes": [
      "¹⁴C is formed in upper atmosphere: ¹⁴N + n → ¹⁴C + p.",
      "Upon death, carbon intake stops and ¹⁴C decays by β⁻ emission: ¹⁴C → ¹⁴N + β⁻ + ν̄.",
      "Applicable to organic samples up to ~50,000 years old."
    ],
    "example": "A sample shows activity 25% of modern wood (A/A₀ = 1/4 = (½)²):\nTwo half-lives have elapsed: t = 2 × 5730 = 11,460 years.",
    "latex": "t = \\frac{2.303}{\\lambda}\\log_{10}\\left(\\frac{A_0}{A}\\right) = \\frac{t_{1/2}}{0.693} \\cdot 2.303\\log_{10}\\left(\\frac{A_0}{A}\\right)"
  },
  {
    "id": "h2o2_strength",
    "branch": "Physical",
    "chapter": "Redox & Solutions",
    "title": "Volume Strength of H₂O₂",
    "expr": "Volume Strength = 11.2 × Molarity = 5.6 × Normality = (68/100) × %w/v × 10",
    "keys": [
      "volume strength",
      "hydrogen peroxide strength",
      "h2o2"
    ],
    "symbols": [
      "Volume strength: litres of O₂ released at STP by 1 L of H₂O₂ solution upon decomposition: 2H₂O₂ → 2H₂O + O₂"
    ],
    "notes": [
      "'20 volume H₂O₂' means 1 mL of this solution releases 20 mL of O₂ gas at STP.",
      "Molarity of '20 volume H₂O₂' = 20 / 11.2 ≈ 1.78 M."
    ],
    "example": "Find the normality of '10 volume H₂O₂':\nN = 10 / 5.6 ≈ 1.785 N.",
    "latex": "\\text{Volume Strength} = 11.2 \\times M = 5.6 \\times N = \\frac{68}{100} \\times \\text{\\% (w/v)} \\times 10"
  },
  {
    "id": "titration_iodometry_thiosulfate",
    "branch": "Physical",
    "chapter": "Redox & Volumetric Analysis",
    "title": "Iodometric Titration with Sodium Thiosulfate",
    "expr": "2 Cu²⁺ + 4 I⁻ → 2 CuI↓ (white ppt) + I₂   |   I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻ (Tetrathionate)",
    "keys": [
      "iodometry",
      "sodium thiosulfate",
      "hypo",
      "starch indicator",
      "tetrathionate"
    ],
    "symbols": [
      "Iodometry: indirect titration of liberated iodine using sodium thiosulfate (Na₂S₂O₃·5H₂O / Hypo)",
      "n-factor of hypo = 1 (2S₂⁺² → S₄⁺²·⁵ + 2e⁻)",
      "n-factor of I₂ = 2"
    ],
    "notes": [
      "Freshly prepared starch solution is added near the end point (when straw-yellow iodine colour fades) to form an intense dark blue complex; end point is sharp disappearance of blue colour."
    ],
    "example": "1 mole of I₂ reacts with exactly 2 moles of Na₂S₂O₃.",
    "latex": "\\ce{2Cu^2+ + 4I- -> 2CuI v + I2}, \\quad \\ce{I2 + 2S2O3^2- -> 2I- + S4O6^2-}"
  },
  {
    "id": "normality",
    "branch": "Physical",
    "chapter": "Redox & Volumetric Analysis",
    "title": "Normality and Equivalent Mass",
    "expr": "N = M × n-factor   ,   E = Molar Mass / n-factor",
    "keys": [
      "normality",
      "equivalent weight",
      "n factor",
      "n-factor"
    ],
    "symbols": [
      "N: normality (equiv L⁻¹)",
      "M: molarity",
      "E: equivalent weight",
      "n-factor: basicity (acids), acidity (bases), or total electrons transferred (redox)"
    ],
    "notes": [
      "For KMnO₄ in acidic medium: n = 5 (Mn⁺⁷ → Mn⁺²); neutral/mildly alkaline: n = 3 (Mn⁺⁷ → MnO₂); strongly alkaline: n = 1 (Mn⁺⁷ → MnO₄²⁻).",
      "For K₂Cr₂O₇ in acidic medium: n = 6 (Cr₂⁺⁶ → 2Cr⁺³).",
      "Law of chemical equivalence: N₁V₁ = N₂V₂ at the equivalence point."
    ],
    "example": "0.1 M KMnO₄ in acidic medium:\nNormality N = 0.1 × 5 = 0.5 N.",
    "latex": "N = M \\times n\\text{-factor} = \\frac{\\text{Gram equivalents}}{V(\\text{L})}"
  },
  {
    "id": "titration_redox_oxalate_permanganate",
    "branch": "Physical",
    "chapter": "Redox & Volumetric Analysis",
    "title": "Oxalate–Permanganate Redox Titration Reaction",
    "expr": "2 MnO₄⁻ + 5 C₂O₄²⁻ + 16 H⁺ → 2 Mn²⁺ + 10 CO₂↑ + 8 H₂O   (at 333–343 K)",
    "keys": [
      "oxalate permanganate titration",
      "autocatalysis",
      "mn2+ catalyst",
      "oxalic acid"
    ],
    "symbols": [
      "n-factor of KMnO₄ = 5",
      "n-factor of C₂O₄²⁻ (oxalate) = 2 (each carbon: +3 → +4)",
      "Equivalence: 2 mol KMnO₄ = 5 mol H₂C₂O₄"
    ],
    "notes": [
      "Reaction is slow initially; heated to 60–70 °C (333–343 K).",
      "Mn²⁺ formed acts as an AUTOCATALYST, speeding up subsequent decolorization of KMnO₄."
    ],
    "example": "20 mL of 0.02 M KMnO₄ reacts with 20 mL of 0.05 M oxalic acid.",
    "latex": "\\ce{2MnO4- + 5C2O4^2- + 16H+ -> 2Mn^2+ + 10CO2 ^ + 8H2O} \\; (333\\text{--}343\\text{ K})"
  },
  {
    "id": "density",
    "branch": "Physical",
    "chapter": "Solid state",
    "title": "Density of a unit cell",
    "expr": "ρ = Z·M / (a³·N_A)",
    "keys": [
      "unit cell",
      "density of"
    ],
    "symbols": [
      "Z: atoms per unit cell (simple cubic 1, bcc 2, fcc 4)",
      "M: molar mass (g mol⁻¹)",
      "a: edge length in cm (1 pm = 10⁻¹⁰ cm)",
      "N_A = 6.022 × 10²³ mol⁻¹"
    ],
    "notes": [
      "The result is in g cm⁻³ when a is in cm.",
      "Packing efficiency: sc 52.4%, bcc 68%, fcc/hcp 74%."
    ],
    "latex": "\\rho = \\frac{Z \\cdot M}{a^3 \\cdot N_{\\text{A}}}"
  },
  {
    "id": "bcc_packing_efficiency_calc",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "BCC Packing Efficiency Exact Proof",
    "expr": "Packing Efficiency = [ 2 × (4/3 π r³) ] / [ a³ ] = (π √3) / 8 ≈ 68.02%",
    "keys": [
      "bcc packing efficiency",
      "body centered cubic fraction"
    ],
    "symbols": [
      "In BCC: body diagonal a√3 = 4r => a = 4r / √3"
    ],
    "notes": [
      "Coordination number is 8."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Packing Efficiency = [ 2 × (4/3 π r³) ] / [ a³ ] = (π √3) / 8 ≈ 68.02%",
    "latex": "\\text{P.E. (BCC)} = \\frac{2 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\sqrt{3}\\pi}{8} \\approx 68.02\\%"
  },
  {
    "id": "bragg_law",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "Bragg's Law of X-Ray Diffraction",
    "expr": "nλ = 2d sin θ   ,   d_hkl = a / √(h² + k² + l²)",
    "keys": [
      "bragg",
      "x-ray diffraction",
      "interplanar spacing",
      "miller indices"
    ],
    "symbols": [
      "n: order of diffraction (1, 2...)",
      "λ: wavelength of X-rays",
      "d: interplanar spacing between crystal planes (h k l)",
      "θ: glancing angle / Bragg angle",
      "a: cubic lattice constant"
    ],
    "notes": [
      "Constructive interference occurs when path difference 2d sin θ equals an integer number of wavelengths.",
      "For a cubic crystal, distance between (1 0 0) planes is a, (1 1 0) is a/√2, and (1 1 1) is a/√3."
    ],
    "example": "First-order reflection (n = 1) from planes with d = 2.0 Å using X-rays of λ = 1.0 Å:\nsin θ = (1 × 1.0) / (2 × 2.0) = 0.25  =>  θ = arcsin(0.25) ≈ 14.5°.",
    "latex": "n \\lambda = 2 d \\sin\\theta \\quad \\Big| \\quad d_{hkl} = \\frac{a}{\\sqrt{h^2 + k^2 + l^2}}"
  },
  {
    "id": "braggs_law_diffraction",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "Bragg's Law of X-Ray Diffraction",
    "expr": "n · λ = 2 d · sin θ   |   d_hkl = a / √(h² + k² + l²)   (for cubic)",
    "keys": [
      "braggs law",
      "x ray diffraction",
      "interplanar spacing",
      "miller indices"
    ],
    "symbols": [
      "n: order of diffraction (1, 2, 3...)",
      "λ: wavelength of X-rays",
      "d: spacing between adjacent lattice planes (hkl)",
      "θ: glancing (Bragg) angle of reflection",
      "a: cubic unit cell edge length",
      "h, k, l: Miller indices"
    ],
    "notes": [
      "First-order reflection (n = 1) is most intense: λ = 2d sin θ.",
      "Maximum wavelength that can produce diffraction is λ_max = 2d (since sin θ ≤ 1)."
    ],
    "example": "First-order reflection (n = 1) from planes with d = 2.0 Å at θ = 30°:\nλ = 2 × 2.0 × sin 30° = 4.0 × 0.5 = 2.0 Å.",
    "latex": "n \\lambda = 2 d \\sin\\theta \\quad \\Big| \\quad d_{hkl} = \\frac{a}{\\sqrt{h^2 + k^2 + l^2}} \\quad (\\text{for cubic})"
  },
  {
    "id": "cubic_density_formula",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "Crystal Density from Unit Cell Edge Length",
    "expr": "ρ = (z · M) / (a³ · N_A)   (units: g cm⁻³)",
    "keys": [
      "density of crystal",
      "unit cell edge length",
      "z effective",
      "solid state calculations"
    ],
    "symbols": [
      "z: number of formula units per unit cell (Simple Cubic = 1, BCC = 2, FCC/CCP = 4)",
      "M: molar mass in g mol⁻¹",
      "a: edge length in cm (1 Å = 10⁻⁸ cm; 1 pm = 10⁻¹⁰ cm)",
      "N_A = 6.022 × 10²³ mol⁻¹"
    ],
    "notes": [
      "For NaCl (FCC): z = 4, edge length a = 2(r_Na⁺ + r_Cl⁻).",
      "For CsCl (BCC-like): z = 1, body diagonal a√3 = 2(r_Cs⁺ + r_Cl⁻)."
    ],
    "example": "Copper crystallises in FCC (z = 4, M = 63.5 g mol⁻¹) with a = 361 pm (3.61 × 10⁻⁸ cm):\nρ = (4 × 63.5) / [ (3.61 × 10⁻⁸)³ × 6.022 × 10²³ ] = 254 / [ 4.70 × 10⁻²³ × 6.022 × 10²³ ] ≈ 8.97 g cm⁻³.",
    "latex": "\\rho = \\frac{z \\cdot M}{a^3 \\cdot N_A} \\quad (\\text{g cm}^{-3})"
  },
  {
    "id": "solid_density",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "Density and Geometry of Cubic Unit Cells",
    "expr": "ρ = (Z · M) / (a³ · N_A)   ,   SC: a = 2r   ,   BCC: √3 a = 4r   ,   FCC: √2 a = 4r",
    "keys": [
      "solid state",
      "density of unit cell",
      "packing efficiency",
      "radius ratio"
    ],
    "symbols": [
      "ρ: density (g cm⁻³ when a is in cm)",
      "Z: effective number of atoms in unit cell (SC = 1, BCC = 2, FCC = 4)",
      "M: molar mass (g mol⁻¹)",
      "a: edge length (1 pm = 10⁻¹⁰ cm)",
      "r: atomic radius"
    ],
    "notes": [
      "Packing efficiency: Simple Cubic = 52.4%, BCC = 68%, FCC/CCP/HCP = 74%.",
      "Coordination number: SC = 6, BCC = 8, FCC/HCP = 12.",
      "Radius ratio r₊ / r₋: < 0.155 (Linear), 0.155–0.225 (Trigonal), 0.225–0.414 (Tetrahedral), 0.414–0.732 (Octahedral), 0.732–1.000 (Cubic/CsCl)."
    ],
    "example": "Copper crystallises in FCC (Z = 4, M = 63.5 g mol⁻¹) with a = 361 pm:\nρ = (4 × 63.5) / [(3.61 × 10⁻⁸)³ × 6.022 × 10²³] ≈ 8.94 g cm⁻³.",
    "latex": "\\rho = \\frac{Z \\cdot M}{a^3 \\cdot N_{\\text{A}}}, \\quad \\text{SC: } a = 2r, \\quad \\text{BCC: } \\sqrt{3} a = 4r, \\quad \\text{FCC: } \\sqrt{2} a = 4r"
  },
  {
    "id": "semiconductors_n_type_p_type",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "Extrinsic Semiconductors: n-Type vs p-Type Doping",
    "expr": "n-Type (Group 14 + Group 15, e.g. Si + P/As): Extra Free Electrons   |   p-Type (Group 14 + Group 13, e.g. Si + B/Al/Ga): Electron Holes",
    "keys": [
      "semiconductors",
      "n type doping",
      "p type doping",
      "electron holes",
      "intrinsic extrinsic"
    ],
    "symbols": [
      "Silicon/Germanium (Group 14) doped with 5-valence-electron atom (P, As, Sb): 5th electron is delocalised and conducts electricity (n-type)",
      "Doped with 3-valence-electron atom (B, Al, In): 4th bond lacks an electron, creating an electron hole that moves as a positive charge (p-type)"
    ],
    "notes": [
      "Both n-type and p-type semiconductors remain electrically NEUTRAL overall."
    ],
    "example": "Doping pure silicon with phosphorus produces an n-type semiconductor with high electronic conductivity.",
    "latex": "n\\text{-Type (Si + P/As): Extra Free } e^- \\quad \\Big| \\quad p\\text{-Type (Si + B/Al): Positive Holes}"
  },
  {
    "id": "f_centers_non_stoichiometric_colour",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "F-Centres (Farbe Centres) & Non-Stoichiometric Crystal Colours",
    "expr": "Anion Vacancy occupied by Trapped Electron = F-Centre (Farbe Centre)",
    "keys": [
      "f centres",
      "colour of crystals",
      "metal excess defect",
      "anion vacancy electron"
    ],
    "symbols": [
      "NaCl heated in Na vapour: Yellow (due to trapped electrons in Cl⁻ vacancies)",
      "KCl heated in K vapour: Violet / Lilac",
      "LiCl heated in Li vapour: Pink",
      "ZnO heated: White when cold, Yellow when hot (Zn²⁺ and electrons occupy interstitial sites: ZnO —heat→ Zn²⁺ + ½ O₂ + 2e⁻)"
    ],
    "notes": [
      "F-centres impart paramagnetism and electrical conductivity alongside intense visible color."
    ],
    "example": "Yellow color of non-stoichiometric NaCl crystals is directly caused by excitation of electrons trapped in anion vacancies.",
    "latex": "\\text{Anion Vacancy occupied by Trapped } e^- = \\text{F-Centre (Farbe Centre)} \\implies \\text{Imparts colour to crystal}"
  },
  {
    "id": "fcc_packing_efficiency_calc",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "FCC / CCP Packing Efficiency Exact Proof",
    "expr": "Packing Efficiency = [ 4 × (4/3 π r³) ] / [ a³ ] = (π √2) / 6 ≈ 74.05%",
    "keys": [
      "fcc packing efficiency",
      "ccp packing fraction",
      "74 percent"
    ],
    "symbols": [
      "In FCC: face diagonal a√2 = 4r => a = 2√2 r"
    ],
    "notes": [
      "Highest possible packing efficiency for sphere packing."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Packing Efficiency = [ 4 × (4/3 π r³) ] / [ a³ ] = (π √2) / 6 ≈ 74.05%",
    "latex": "\\text{P.E. (FCC)} = \\frac{4 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\sqrt{2}\\pi}{6} \\approx 74.05\\%"
  },
  {
    "id": "frenkel_schottky_comparison",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "Frenkel vs Schottky Defects in Ionic Solids",
    "expr": "Schottky: missing cation-anion pair (lowers density, e.g. NaCl)   |   Frenkel: ion in interstitial site (density unchanged, e.g. AgCl)",
    "keys": [
      "frenkel defect",
      "schottky defect",
      "crystal defects",
      "agbr both defects"
    ],
    "symbols": [
      "AgBr exhibits BOTH Frenkel and Schottky defects"
    ],
    "notes": [
      "Frenkel favoured by large radius difference (small Ag⁺, large Br⁻); Schottky favoured by similar sizes."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Schottky: missing cation-anion pair (lowers density, e.g. NaCl)   |   Frenkel: ion in interstitial site (density unchanged, e.g. AgCl)",
    "latex": "\\text{Schottky: Missing cation-anion pair } (\\rho \\downarrow, \\text{e.g. NaCl}) \\quad \\Big| \\quad \\text{Frenkel: Interstitial cation } (\\rho \\text{ const}, \\text{e.g. AgCl})"
  },
  {
    "id": "hcp_c_over_a_ratio",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "Hexagonal Close Packed (HCP) c/a Ideal Axial Ratio",
    "expr": "c / a = √(8 / 3) ≈ 1.633   |   Packing Efficiency = 74.05%",
    "keys": [
      "hcp axial ratio",
      "c over a ratio",
      "hexagonal close packed"
    ],
    "symbols": [
      "c: height of hexagonal unit cell",
      "a: edge of base hexagon"
    ],
    "notes": [
      "Ideal hard-sphere packing ratio; deviations indicate non-spherical bonding."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: c / a = √(8 / 3) ≈ 1.633   |   Packing Efficiency = 74.05%",
    "latex": "\\frac{c}{a} = \\sqrt{\\frac{8}{3}} \\approx 1.633, \\quad \\text{P.E. (HCP)} = 74.05\\%"
  },
  {
    "id": "ferromagnetism_curie_weiss",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "Magnetic Behaviors: Ferromagnetism, Antiferromagnetism & Ferrimagnetism",
    "expr": "Ferromagnetic: Domains aligned parallel (Fe, Co, Ni, CrO₂)   |   Antiferromagnetic: Domains antiparallel, cancel (MnO)   |   Ferrimagnetic: Unequal opposing domains (Fe₃O₄, MgFe₂O₄)",
    "keys": [
      "magnetic properties",
      "curie temperature",
      "ferromagnetism",
      "antiferromagnetism",
      "ferrimagnetism"
    ],
    "symbols": [
      "Curie Temperature T_C: temperature above which ferromagnetic or ferrimagnetic material becomes paramagnetic",
      "Néel Temperature T_N: temperature above which antiferromagnetic becomes paramagnetic"
    ],
    "notes": [
      "CrO₂ is ferromagnetic and used extensively in magnetic audio/video recording tapes.",
      "Ferrimagnetic Fe₃O₄ loses permanent magnetism on heating to 850 K and becomes paramagnetic."
    ],
    "example": "Magnetite Fe₃O₄ has net magnetic moment from unequal opposing magnetic domains.",
    "latex": "\\text{Ferromagnetic: Domains parallel } (\\ce{Fe, Co, Ni}) \\quad \\Big| \\quad \\text{Antiferro: Domains cancel } (\\ce{MnO}) \\quad \\Big| \\quad \\text{Ferrimagnetic: } \\ce{Fe3O4}"
  },
  {
    "id": "piezoelectricity_pyroelectricity",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "Piezoelectricity & Ferroelectricity in Crystals",
    "expr": "Piezoelectric: Mechanical Stress ⇄ Electric Voltage (Quartz, Rochelle Salt)   |   Ferroelectric: Permanent spontaneous dipole moments (BaTiO₃)",
    "keys": [
      "piezoelectricity",
      "ferroelectricity",
      "pyroelectricity",
      "quartz crystal",
      "barium titanate"
    ],
    "symbols": [
      "Piezoelectricity arises in crystals lacking a centre of inversion symmetry (polar crystals)"
    ],
    "notes": [
      "Pyroelectricity: electricity produced on heating a polar crystal.",
      "Ferroelectric crystals have spontaneous domain polarization that can be reversed by an external electric field; heating above Curie point converts them to paraelectric."
    ],
    "example": "Quartz crystals in watches oscillate at precise frequencies when an alternating voltage is applied (piezoelectric resonance).",
    "latex": "\\text{Piezoelectric: Mechanical Stress} \\rightleftharpoons \\text{Electric Voltage (Quartz)} \\quad \\Big| \\quad \\text{Ferroelectric: Permanent dipoles } (\\ce{BaTiO3})"
  },
  {
    "id": "radius_ratio_coordination",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "Radius Ratio Rules for Ionic Crystals",
    "expr": "Limiting Radius Ratio r₊ / r₋ Determines Coordination Number & Geometry",
    "keys": [
      "radius ratio rules",
      "coordination number",
      "ionic crystal geometry",
      "tetrahedral octahedral voids"
    ],
    "symbols": [
      "r₊/r₋ < 0.155: CN = 2 (Linear)",
      "0.155 − 0.225: CN = 3 (Trigonal Planar, e.g. B₂O₃)",
      "0.225 − 0.414: CN = 4 (Tetrahedral, e.g. ZnS)",
      "0.414 − 0.732: CN = 6 (Octahedral, e.g. NaCl, MgO)",
      "0.732 − 1.000: CN = 8 (Cubic, e.g. CsCl, NH₄Cl)"
    ],
    "notes": [
      "If r₊/r₋ exceeds 0.732, the crystal structure transitions from NaCl-type (6:6) to CsCl-type (8:8).",
      "Heating CsCl changes coordination from 8:8 to 6:6; applying high pressure changes NaCl from 6:6 to 8:8."
    ],
    "example": "Cation radius = 95 pm, anion radius = 181 pm:\nRadius ratio = 95 / 181 ≈ 0.525. Falls in range 0.414–0.732 => CN = 6 (Octahedral, NaCl structure).",
    "latex": "\\frac{r_+}{r_-}: \\; 0.155\\text{--}0.225 \\; (3, \\text{planar}), \\; 0.225\\text{--}0.414 \\; (4, T_d), \\; 0.414\\text{--}0.732 \\; (6, O_h), \\; 0.732\\text{--}1.0 \\; (8, \\text{bcc})"
  },
  {
    "id": "sc_packing_efficiency_calc",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "Simple Cubic (SC) Packing Efficiency Exact Proof",
    "expr": "Packing Efficiency = [ 1 × (4/3 π r³) ] / [ (2r)³ ] = π / 6 ≈ 52.36%",
    "keys": [
      "simple cubic packing efficiency",
      "polonium structure"
    ],
    "symbols": [
      "In SC: edge length a = 2r"
    ],
    "notes": [
      "Very open structure; only Polonium (Po) crystallises in simple cubic."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Packing Efficiency = [ 1 × (4/3 π r³) ] / [ (2r)³ ] = π / 6 ≈ 52.36%",
    "latex": "\\text{P.E. (SC)} = \\frac{1 \\times \\frac{4}{3}\\pi r^3}{(2r)^3} = \\frac{\\pi}{6} \\approx 52.36\\%"
  },
  {
    "id": "fcc_tetrahedral_octahedral",
    "branch": "Physical",
    "chapter": "Solid State",
    "title": "Tetrahedral & Octahedral Voids in FCC/CCP",
    "expr": "N atoms in CCP: Octahedral Voids = N   ,   Tetrahedral Voids = 2N   ,   Total = 3N",
    "keys": [
      "octahedral voids",
      "tetrahedral voids",
      "voids in ccp",
      "fcc voids"
    ],
    "symbols": [
      "N: number of lattice atoms in close packing (for FCC unit cell, N = 4 atoms)",
      "Octahedral voids in FCC: 1 at body centre + 12 on edge centres (each shared by 4) = 1 + 3 = 4",
      "Tetrahedral voids in FCC: 2 on each of 4 body diagonals = 8"
    ],
    "notes": [
      "Radius of octahedral void: r_oct = 0.414 R_atom.",
      "Radius of tetrahedral void: r_tet = 0.225 R_atom.",
      "In NaCl structure: Cl⁻ form FCC lattice, Na⁺ occupy ALL octahedral voids (Coordination 6:6).",
      "In ZnS (zinc blende): S²⁻ form FCC, Zn²⁺ occupy ALTERNATE tetrahedral voids (Coordination 4:4).",
      "In CaF₂ (fluorite): Ca²⁺ form FCC, F⁻ occupy ALL tetrahedral voids (Coordination 8:4)."
    ],
    "example": "If element B forms CCP lattice and element A occupies 2/3 of tetrahedral voids:\nFormula: B = 1, A = (2/3) × 2 = 4/3  =>  A₄B₃.",
    "latex": "\\text{In CCP/FCC } (N \\text{ atoms}): \\quad \\text{Octahedral Voids} = N, \\quad \\text{Tetrahedral Voids} = 2N, \\quad \\text{Total} = 3N"
  },
  {
    "id": "azeotrope_types",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Azeotropic Binary Mixtures (Minimum vs Maximum Boiling)",
    "expr": "Min-Boiling (Large +ve Deviation from Raoult): T_bp(azeo) < T_bp(pure)   |   Max-Boiling (Large −ve Deviation): T_bp(azeo) > T_bp(pure)",
    "keys": [
      "azeotropes",
      "minimum boiling azeotrope",
      "maximum boiling azeotrope",
      "ethanol water azeotrope",
      "nitric acid azeotrope"
    ],
    "symbols": [
      "Azeotrope: constant boiling liquid mixture where vapour composition equals liquid composition (y_A = x_A)",
      "Cannot be separated into pure components by fractional distillation"
    ],
    "notes": [
      "Minimum boiling azeotrope: Ethanol (95.6% by mass) + Water (4.4%), boils at 351.15 K (lower than pure ethanol 351.3 K and water 373.15 K).",
      "Maximum boiling azeotrope: Nitric acid (68% by mass) + Water (32%), boils at 393.5 K (higher than water 373.15 K and pure HNO₃ 359 K).",
      "Separated by azeotropic distillation (adding a third entrainer like benzene) or pressure-swing distillation."
    ],
    "example": "Standard distillation of fermented wash stops at 95.6% ethanol because the azeotrope boils as a single substance.",
    "latex": "\\text{Min-Boiling (+ve dev): } T_{\\text{bp}}(\\text{azeo}) < T_{\\text{bp}}(\\text{pure}) \\quad \\Big| \\quad \\text{Max-Boiling (-ve dev): } T_{\\text{bp}}(\\text{azeo}) > T_{\\text{bp}}(\\text{pure})"
  },
  {
    "id": "colligative",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Boiling-point elevation and freezing-point depression",
    "expr": "ΔTb = i·Kb·m   ,   ΔTf = i·Kf·m",
    "keys": [
      "colligative",
      "elevation",
      "freezing point",
      "boiling point"
    ],
    "symbols": [
      "m: molality (mol per kg of solvent)",
      "Kb, Kf: ebullioscopic / cryoscopic constants of the solvent",
      "i: van't Hoff factor"
    ],
    "notes": [
      "For water: Kb = 0.512 K kg mol⁻¹ and Kf = 1.86 K kg mol⁻¹.",
      "Molality, unlike molarity, does not change with temperature.",
      "Association gives i < 1, dissociation gives i > 1."
    ],
    "latex": "\\Delta T_b = i \\cdot K_b \\cdot m, \\quad \\Delta T_f = i \\cdot K_f \\cdot m"
  },
  {
    "id": "colligative_properties",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Colligative Properties & Van 't Hoff Factor",
    "expr": "RLVP: (P° − P)/P° = i · x_B   |   ΔT_b = i · K_b · m   |   ΔT_f = i · K_f · m   |   π = i · CRT",
    "keys": [
      "colligative",
      "ebullioscopy",
      "cryoscopy",
      "osmotic pressure",
      "vant hoff factor"
    ],
    "symbols": [
      "i: van 't Hoff factor (i = 1 for non-electrolytes)",
      "K_b: molal elevation constant (0.512 K kg mol⁻¹ for water)",
      "K_f: molal depression constant (1.86 K kg mol⁻¹ for water)",
      "m: molality (mol kg⁻¹)",
      "C: molarity (mol L⁻¹)",
      "π: osmotic pressure"
    ],
    "notes": [
      "Dissociation of A_x B_y giving n ions: i = 1 + (n − 1) α  =>  α = (i − 1) / (n − 1).",
      "Association (e.g. benzoic acid in benzene dimerization, n = 2): i = 1 − (1 − 1/n) α.",
      "i = Normal Molar Mass / Observed Molar Mass."
    ],
    "example": "0.1 m NaCl (n = 2, assuming 100% dissociation i = 2) in water:\nΔT_f = 2 × 1.86 × 0.1 = 0.372 °C  =>  Freezing point = −0.372 °C.",
    "latex": "\\text{RLVP: } \\frac{P^\\circ - P}{P^\\circ} = i \\cdot x_B \\quad \\Big| \\quad \\Delta T_b = i K_b m \\quad \\Big| \\quad \\Delta T_f = i K_f m \\quad \\Big| \\quad \\Pi = i C R T"
  },
  {
    "id": "cryoscopy_freezing_depression",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Depression in Freezing Point (Cryoscopy)",
    "expr": "ΔT_f = i · K_f · m   |   K_f = (R · T_f°² · M_solvent) / (1000 · ΔH_fus)",
    "keys": [
      "depression in freezing point",
      "cryoscopy",
      "molal depression constant",
      "antifreeze",
      "de icing salt"
    ],
    "symbols": [
      "ΔT_f = T_f° − T_f: freezing point depression",
      "K_f: molal freezing point depression constant (for water K_f = 1.86 K kg mol⁻¹; camphor K_f = 40 K kg mol⁻¹)",
      "m: molality",
      "i: van 't Hoff factor"
    ],
    "notes": [
      "Camphor has exceptionally high K_f (Rast's method), enabling precise molecular mass determination with standard thermometers.",
      "Ethylene glycol added to car radiators acts as antifreeze."
    ],
    "example": "18 g glucose (0.1 mol) in 1000 g water (m = 0.1, i = 1):\nΔT_f = 1 × 1.86 × 0.1 = 0.186 °C.\nFreezing point of solution = 0 − 0.186 = −0.186 °C.",
    "latex": "\\Delta T_f = i \\cdot K_f \\cdot m \\quad \\Big| \\quad K_f = \\frac{R T_f^{\\circ 2} M_{\\text{solvent}}}{1000 \\Delta H_{\\text{fus}}}"
  },
  {
    "id": "ebullioscopy_boiling_elevation",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Elevation in Boiling Point (Ebullioscopy)",
    "expr": "ΔT_b = i · K_b · m   |   K_b = (R · T_b°² · M_solvent) / (1000 · ΔH_vap)",
    "keys": [
      "elevation in boiling point",
      "ebullioscopy",
      "molal elevation constant",
      "vant hoff factor"
    ],
    "symbols": [
      "ΔT_b = T_b − T_b°: boiling point elevation (°C or K)",
      "K_b: molal boiling point elevation constant (for water K_b = 0.52 K kg mol⁻¹)",
      "m: molality of solution (mol kg⁻¹)",
      "i: van 't Hoff factor"
    ],
    "notes": [
      "K_b depends strictly on the nature of the SOLVENT, independent of the solute identity."
    ],
    "example": "0.1 m aqueous BaCl₂ (i = 3 for Ba²⁺ + 2Cl⁻):\nΔT_b = 3 × 0.52 × 0.1 = 0.156 °C.\nBoiling point = 100 + 0.156 = 100.156 °C.",
    "latex": "\\Delta T_b = i \\cdot K_b \\cdot m \\quad \\Big| \\quad K_b = \\frac{R T_b^{\\circ 2} M_{\\text{solvent}}}{1000 \\Delta H_{\\text{vap}}}"
  },
  {
    "id": "henrys_law_gas_solubility",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Henry's Law of Gas Solubility in Liquids",
    "expr": "p = K_H · x   |   m = k · p",
    "keys": [
      "henrys law",
      "gas solubility in liquid",
      "henry constant",
      "aquatic life oxygen"
    ],
    "symbols": [
      "p: partial pressure of gas over solution",
      "x: mole fraction of gas in solution",
      "K_H: Henry's law constant (units: bar or atm)"
    ],
    "notes": [
      "Higher K_H value indicates LOWER solubility of the gas in the liquid at the same pressure.",
      "K_H increases with temperature, which is why aquatic species are more comfortable in cold water (higher dissolved O₂).",
      "Soft drink bottles are sealed under high pressure to increase CO₂ solubility."
    ],
    "example": "If K_H for N₂ is 7.6 × 10⁴ bar at 293 K and partial pressure p = 0.76 bar:\nx = p / K_H = 0.76 / (7.6 × 10⁴) = 1.0 × 10⁻⁵.",
    "latex": "P = K_{\\text{H}} \\cdot x \\quad \\Big| \\quad m = k \\cdot P"
  },
  {
    "id": "landsberger_cottrell_ebullioscopy",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Landsberger & Cottrell Ebullioscopic Methods",
    "expr": "M_B = (1000 · K_b · w_B) / (ΔT_b · W_A)   |   Beckmann Thermometer Precision = 0.01 °C",
    "keys": [
      "landsberger method",
      "cottrell ebullioscope",
      "beckmann thermometer",
      "boiling elevation"
    ],
    "symbols": [
      "Cottrell's ebullioscope pumps boiling liquid-vapour mixture over thermometer bulb to avoid superheating errors",
      "Beckmann differential thermometer has a 5–6 °C range graduated to 0.01 °C"
    ],
    "notes": [
      "Superheating is the primary source of error in boiling point measurements; Cottrell's apparatus eliminates it by ensuring the bulb is bathed in equilibrium boiling spray."
    ],
    "example": "Cottrell's apparatus measures boiling elevation without superheating errors.",
    "latex": "M_B = \\frac{1000 K_b w_B}{\\Delta T_b W_A} \\quad \\Big| \\quad \\text{Beckmann Thermometer Precision} = 0.01^\\circ\\text{C}"
  },
  {
    "id": "molality",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Molality (m)",
    "expr": "m = (w_B × 1000) / (M_B × W_A_g) = (1000 × M) / (1000 × d − M × M_B)",
    "keys": [
      "molality",
      "mass molality"
    ],
    "symbols": [
      "m: molality (mol kg⁻¹)",
      "w_B: mass of solute (g)",
      "M_B: molar mass of solute",
      "W_A_g: mass of solvent in grams",
      "d: density in g mL⁻¹"
    ],
    "notes": [
      "Molality does NOT change with temperature because mass is invariant with temperature.",
      "For dilute aqueous solutions (d ≈ 1 g mL⁻¹), m ≈ M."
    ],
    "example": "20 g urea (M = 60 g mol⁻¹) dissolved in 200 g water:\nm = (20 × 1000) / (60 × 200) = 20000 / 12000 ≈ 1.67 m.",
    "latex": "m = \\frac{w_B \\times 1000}{M_B \\times w_A(\\text{g})} = \\frac{1000 \\times M}{1000 d - M \\times M_B}"
  },
  {
    "id": "mole_fraction_relations",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Mole Fraction & Molality Exact Relation",
    "expr": "m = (x_B × 1000) / (x_A × M_A)   ,   x_B = (m × M_A) / (1000 + m × M_A)",
    "keys": [
      "mole fraction",
      "molality to mole fraction conversion",
      "solution conversions"
    ],
    "symbols": [
      "x_B: mole fraction of solute",
      "x_A = 1 − x_B: mole fraction of solvent",
      "M_A: molar mass of solvent (g mol⁻¹; 18 for water)",
      "m: molality (mol kg⁻¹)"
    ],
    "notes": [
      "For aqueous solutions (M_A = 18 g mol⁻¹): m = (x_B × 1000) / (18 × x_A) = 55.55 × (x_B / x_A)."
    ],
    "example": "Aqueous solution with solute mole fraction x_B = 0.1:\nm = (0.1 × 1000) / (0.9 × 18) = 100 / 16.2 ≈ 6.17 m.",
    "latex": "m = \\frac{x_B \\times 1000}{x_A \\times M_A}, \\quad x_B = \\frac{m \\times M_A}{1000 + m \\times M_A}"
  },
  {
    "id": "nernst_distribution_law",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Nernst Distribution / Partition Law",
    "expr": "K_D = C₁ / C₂ = constant   (at constant temperature for same molecular species in both immiscible solvents)",
    "keys": [
      "nernst distribution law",
      "partition coefficient",
      "solvent extraction",
      "distribution coefficient"
    ],
    "symbols": [
      "C₁, C₂: equilibrium concentrations of solute in immiscible solvent 1 and solvent 2",
      "K_D: partition / distribution coefficient"
    ],
    "notes": [
      "If solute associates in solvent 2 into n-mers: K_D = C₁ / (ⁿ√C₂).",
      "If solute dissociates in solvent 1: K_D = C₁(1 − α) / C₂.",
      "Multi-step extractions with smaller solvent volumes are far more efficient than a single extraction with the entire volume."
    ],
    "example": "Iodine distributing between water and CCl₄ has K_D = C(CCl₄)/C(H₂O) ≈ 85, so shaking aqueous I₂ with CCl₄ extracts over 98% of iodine into the organic layer.",
    "latex": "K_D = \\frac{C_1}{C_2} = \\text{const} \\quad (\\text{Distribution between two immiscible solvents at const } T)"
  },
  {
    "id": "osmotic",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Osmotic pressure",
    "expr": "π = CRT",
    "keys": [
      "osmotic",
      "osmosis"
    ],
    "symbols": [
      "π: osmotic pressure (atm)",
      "C = n/V: molarity (mol L⁻¹)",
      "R = 0.0821 L atm K⁻¹ mol⁻¹",
      "T: temperature in kelvin"
    ],
    "notes": [
      "For electrolytes use π = iCRT (i = van't Hoff factor).",
      "Isotonic solutions have equal osmotic pressure at the same temperature.",
      "Measured osmotic pressure is used to find molar masses of polymers and proteins."
    ],
    "example": "1.8 g glucose (M = 180 g mol⁻¹) in 500 mL at 300 K.\nn = 0.01 mol, C = 0.02 M\nπ = 0.02 × 0.0821 × 300 ≈ 0.49 atm",
    "latex": "\\pi = i \\cdot C R T = i \\left( \\frac{n_B}{V} \\right) R T"
  },
  {
    "id": "osmotic_pressure_pfeffer",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Osmotic Pressure & van 't Hoff Equation",
    "expr": "π = i · C · R · T = i · (n / V) · R · T = i · (w_B · R · T) / (M_B · V)",
    "keys": [
      "osmotic pressure",
      "colligative property",
      "molar mass polymers",
      "reverse osmosis"
    ],
    "symbols": [
      "π: osmotic pressure in atmospheres or Pascals",
      "C: molarity (mol L⁻¹)",
      "R = 0.0821 L atm K⁻¹ mol⁻¹",
      "T: absolute temperature in Kelvin",
      "M_B: molar mass of solute"
    ],
    "notes": [
      "Best colligative property for determining molar masses of proteins, polymers, and biomolecules because measurements occur at room temperature and produce large, measurable pressures even at high dilution."
    ],
    "example": "0.01 M glucose solution at 300 K (i = 1):\nπ = 1 × 0.01 × 0.0821 × 300 ≈ 0.246 atm.",
    "latex": "\\Pi = i \\cdot C R T = i \\left( \\frac{n_B}{V} \\right) R T = \\frac{i \\cdot w_B \\cdot R \\cdot T}{M_B \\cdot V}"
  },
  {
    "id": "raoult_binary",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Raoult's Law for Volatile Binary Liquid Mixtures",
    "expr": "P_total = P_A + P_B = P_A° x_A + P_B° x_B = P_B° + (P_A° − P_B°) x_A",
    "keys": [
      "raoult",
      "vapour pressure",
      "ideal solution",
      "azeotrope"
    ],
    "symbols": [
      "P_A, P_B: partial vapour pressures of components A and B",
      "P_A°, P_B°: pure component vapour pressures",
      "x_A, x_B: liquid phase mole fractions"
    ],
    "notes": [
      "Vapour phase mole fraction: y_A = P_A / P_total = P_A° x_A / P_total.",
      "Ideal solution: ΔH_mix = 0, ΔV_mix = 0, follows Raoult's law across all compositions (e.g. benzene + toluene).",
      "Positive deviation (ethanol + acetone): A–B interactions weaker than A–A and B–B; minimum boiling azeotrope.",
      "Negative deviation (chloroform + acetone): A–B hydrogen bonding stronger than pure; maximum boiling azeotrope."
    ],
    "example": "P_A° = 100 mmHg, P_B° = 200 mmHg, with x_A = 0.4:\nP_total = (100 × 0.4) + (200 × 0.6) = 40 + 120 = 160 mmHg.\ny_A = 40 / 160 = 0.25 in vapour phase.",
    "latex": "P_{\\text{total}} = P_A + P_B = P_A^\\circ x_A + P_B^\\circ x_B = P_B^\\circ + (P_A^\\circ - P_B^\\circ) x_A"
  },
  {
    "id": "raoults_law_binary_liquid",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Raoult's Law for Volatile Binary Liquid Mixtures",
    "expr": "P_total = P_A + P_B = P_A° · x_A + P_B° · x_B = P_A° + (P_B° − P_A°) · x_B",
    "keys": [
      "raoults law",
      "ideal solution",
      "partial vapour pressure",
      "vapour liquid equilibrium"
    ],
    "symbols": [
      "P_A, P_B: partial vapour pressures of components A and B",
      "P_A°, P_B°: pure component vapour pressures",
      "x_A, x_B: liquid phase mole fractions (x_A + x_B = 1)"
    ],
    "notes": [
      "Ideal solutions have: ΔH_mix = 0, ΔV_mix = 0, ΔS_mix > 0, ΔG_mix < 0.",
      "Vapour phase mole fraction (Dalton's law): y_A = P_A / P_total; y_B = P_B / P_total.",
      "Relation between vapour and liquid fractions: 1 / P_total = y_A / P_A° + y_B / P_B°."
    ],
    "example": "At 300 K, pure benzene P_A° = 100 mm Hg and pure toluene P_B° = 40 mm Hg. Equimolar mix (x_A = x_B = 0.5):\nP_total = (100 × 0.5) + (40 × 0.5) = 50 + 20 = 70 mm Hg.\nVapour mole fraction of benzene y_A = 50 / 70 ≈ 0.714.",
    "latex": "P_{\\text{total}} = P_A + P_B = P_A^\\circ x_A + P_B^\\circ x_B = P_A^\\circ + (P_B^\\circ - P_A^\\circ) x_B"
  },
  {
    "id": "rasts_method_camphor",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Rast's Camphor Method for High-Precision Cryoscopy",
    "expr": "M_B = (1000 · K_f · w_B) / (ΔT_f · W_A)   (for Camphor: K_f = 40.0 K kg mol⁻¹)",
    "keys": [
      "rasts method",
      "camphor kf",
      "cryoscopic constant camphor",
      "molecular mass"
    ],
    "symbols": [
      "Camphor has an extraordinarily large molal depression constant (K_f = 40.0 K kg mol⁻¹, compared to water's 1.86)",
      "Melting point of pure camphor = 178 °C"
    ],
    "notes": [
      "Because K_f is so large, dissolving even a small amount of solute produces a huge depression (several degrees), measurable accurately with ordinary laboratory thermometers."
    ],
    "example": "0.1 molal solution in camphor produces a 4.0 °C depression, whereas in water it produces only 0.186 °C.",
    "latex": "M_B = \\frac{1000 K_f w_B}{\\Delta T_f W_A} \\quad (\\text{Camphor: } K_f = 40.0\\text{ K kg mol}^{-1})"
  },
  {
    "id": "raoult",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Relative lowering of vapour pressure",
    "expr": "(p° − p)/p° = x₂",
    "keys": [
      "raoult",
      "vapour pressure",
      "vapor pressure"
    ],
    "symbols": [
      "p°: vapour pressure of pure solvent",
      "p: vapour pressure of the solution",
      "x₂: mole fraction of the non-volatile solute"
    ],
    "notes": [
      "Raoult's law for volatile components: p_A = x_A p°_A.",
      "Ideal binary solution: p_total = x_A p°_A + x_B p°_B.",
      "Positive deviation (weaker A–B interactions) gives ΔmixV > 0 and ΔmixH > 0."
    ],
    "latex": "\\frac{P^\\circ - P}{P^\\circ} = x_B"
  },
  {
    "id": "relative_lowering_vapour_pressure",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Relative Lowering of Vapour Pressure (RLVP)",
    "expr": "(P° − P_s) / P° = x_B   |   Exact: (P° − P_s) / P_s = n_B / n_A = (w_B · M_A) / (M_B · W_A)",
    "keys": [
      "rlvp",
      "relative lowering vapour pressure",
      "colligative property",
      "ostwald walker"
    ],
    "symbols": [
      "P°: vapour pressure of pure solvent",
      "P_s: vapour pressure of solution containing non-volatile solute",
      "x_B: mole fraction of non-volatile solute",
      "w_B, M_B: mass and molar mass of solute",
      "W_A, M_A: mass and molar mass of solvent"
    ],
    "notes": [
      "Using (P° − P_s)/P_s = n_B/n_A avoids dilute approximation errors in numerical problems.",
      "RLVP is measured experimentally via Ostwald–Walker dynamic gas saturation method."
    ],
    "example": "Water has P° = 17.5 mm Hg. Dissolving 18 g glucose (M = 180, 0.1 mol) in 178.2 g water (M = 18, 9.9 mol):\n(P° − P_s) / P_s = 0.1 / 9.9 = 1 / 99 => P_s = 17.5 × (99/100) = 17.325 mm Hg.",
    "latex": "\\frac{P^\\circ - P_s}{P^\\circ} = x_B \\quad \\Big| \\quad \\text{Exact: } \\frac{P^\\circ - P_s}{P_s} = \\frac{n_B}{n_A} = \\frac{w_B M_A}{M_B W_A}"
  },
  {
    "id": "steam_distillation_formula",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "Steam Distillation Law for Immiscible Liquids",
    "expr": "(w_organic / w_water) = (P_organic° · M_organic) / (P_water° · M_water)",
    "keys": [
      "steam distillation",
      "immiscible liquids",
      "purification of aniline",
      "vapour pressure organic"
    ],
    "symbols": [
      "w_organic, w_water: masses of organic compound and water collected in distillate receiver",
      "P_organic°, P_water°: partial vapour pressures at distillation temperature",
      "M_organic, M_water (18): respective molar masses"
    ],
    "notes": [
      "Total pressure = P_organic° + P_water° = P_atm; mixture boils BELOW the normal boiling point of either water or the organic liquid.",
      "Allows purification of high-boiling, temperature-sensitive organic liquids (like aniline, bp 184 °C) below 100 °C without decomposition."
    ],
    "example": "At 98 °C, aniline (P° = 43 mm Hg, M = 93) co-distils with water (P° = 717 mm Hg):\nw(aniline)/w(water) = (43 × 93) / (717 × 18) = 3999 / 12906 ≈ 0.31 g aniline per g water.",
    "latex": "\\frac{w_{\\text{organic}}}{w_{\\text{water}}} = \\frac{P_{\\text{organic}}^\\circ \\cdot M_{\\text{organic}}}{P_{\\text{water}}^\\circ \\cdot M_{\\text{water}}}"
  },
  {
    "id": "vant_hoff_factor_association_dissociation",
    "branch": "Physical",
    "chapter": "Solutions",
    "title": "van 't Hoff Factor (i), Dissociation (α) & Association (β)",
    "expr": "Dissociation: α = (i − 1) / (n − 1)   |   Association: β = (1 − i) / (1 − 1/m)",
    "keys": [
      "vant hoff factor",
      "degree of dissociation",
      "degree of association",
      "benzoic acid dimer"
    ],
    "symbols": [
      "i = Normal molar mass / Observed molar mass = Total particles / Initial particles",
      "n: number of ions produced per molecule on dissociation",
      "m: number of molecules associating into single polymer (m = 2 for dimer)",
      "α, β: degrees of dissociation / association (0 ≤ α, β ≤ 1)"
    ],
    "notes": [
      "For complete dissociation: i = n (NaCl: i = 2; K₂SO₄: i = 3; K₄[Fe(CN)₆]: i = 5).",
      "For complete dimerization (benzoic acid in benzene): m = 2 => i = 1 − 1/2 = 0.5."
    ],
    "example": "A 0.1 m solution of weak binary electrolyte (n = 2) freezes at −0.205 °C (K_f = 1.86):\nΔT_f = 0.205 = i × 1.86 × 0.1 => i = 0.205 / 0.186 = 1.102.\nα = (1.102 − 1) / (2 − 1) = 0.102 = 10.2% dissociated.",
    "latex": "\\text{Dissociation: } \\alpha = \\frac{i - 1}{n - 1} \\quad \\Big| \\quad \\text{Association: } \\beta = \\frac{1 - i}{1 - \\frac{1}{m}} = \\frac{m(1 - i)}{m - 1}"
  },
  {
    "id": "dilution_and_mix",
    "branch": "Physical",
    "chapter": "Solutions & Stoichiometry",
    "title": "Dilution Law & Solution Mixtures",
    "expr": "M₁ V₁ = M₂ V₂   ,   M_mix = (M₁V₁ + M₂V₂ + ...) / (V₁ + V₂ + ...)",
    "keys": [
      "dilution law",
      "mixture of solutions",
      "molarity of mixture"
    ],
    "symbols": [
      "M₁, M₂: initial and final molarities",
      "V₁, V₂: initial and final volumes",
      "M_mix: molarity of combined solution"
    ],
    "notes": [
      "Normality dilution follows the identical formula: N₁ V₁ = N₂ V₂.",
      "When equal volumes of two solutions of molarity M₁ and M₂ are mixed, M_mix = (M₁ + M₂)/2.",
      "If a reaction occurs between mixing solutes (acid + base), calculate limiting reactant first."
    ],
    "example": "100 mL of 0.2 M HCl mixed with 200 mL of 0.5 M HCl:\nM_mix = [(100 × 0.2) + (200 × 0.5)] / (100 + 200) = (20 + 100) / 300 = 120 / 300 = 0.4 M.",
    "latex": "M_1 V_1 = M_2 V_2, \\quad M_{\\text{mix}} = \\frac{\\sum M_i V_i}{\\sum V_i} = \\frac{M_1 V_1 + M_2 V_2}{V_1 + V_2}"
  },
  {
    "id": "molarity",
    "branch": "Physical",
    "chapter": "Solutions & Stoichiometry",
    "title": "Molarity (M)",
    "expr": "M = (w_B × 1000) / (M_B × V_mL) = (10 × %w/v) / M_B = (10 × %w/w × d) / M_B",
    "keys": [
      "molarity",
      "molar concentration"
    ],
    "symbols": [
      "M: molarity (mol L⁻¹)",
      "w_B: mass of solute (g)",
      "M_B: molar mass of solute (g mol⁻¹)",
      "V_mL: volume of solution (mL)",
      "%w/w: mass percentage",
      "d: density of solution (g mL⁻¹)"
    ],
    "notes": [
      "Molarity is temperature-dependent because liquid volume expands with heating.",
      "Dilution law: M₁V₁ = M₂V₂.",
      "Mixing two non-reacting solutions: M_mix = (M₁V₁ + M₂V₂) / (V₁ + V₂)."
    ],
    "example": "4.0 g NaOH in 250 mL aqueous solution:\nM = (4 × 1000) / (40 × 250) = 4000 / 10000 = 0.4 M.",
    "latex": "M = \\frac{w_B \\times 1000}{M_B \\times V_{\\text{mL}}} = \\frac{10 \\times \\text{\\% (w/v)}}{M_B} = \\frac{10 \\times \\text{\\% (w/w)} \\times d}{M_B}"
  },
  {
    "id": "parts_per_million_ppm",
    "branch": "Physical",
    "chapter": "Solutions & Stoichiometry",
    "title": "Parts per Million (ppm) & Parts per Billion (ppb)",
    "expr": "ppm = (Mass of solute / Total mass of solution) × 10⁶   |   ppb = (Mass of solute / Total mass) × 10⁹",
    "keys": [
      "ppm",
      "ppb",
      "parts per million",
      "trace concentration",
      "water hardness"
    ],
    "symbols": [
      "ppm: 1 mg solute per kg (or litre) of dilute aqueous solution",
      "ppb: 1 μg solute per kg of solution"
    ],
    "notes": [
      "For dilute aqueous solutions with density ≈ 1.0 g mL⁻¹, 1 ppm = 1 mg L⁻¹ = 10⁻⁴ %w/v."
    ],
    "example": "500 g water contains 2.5 mg dissolved oxygen:\nppm = (2.5 × 10⁻³ / 500) × 10⁶ = 5 ppm.",
    "latex": "\\text{ppm} = \\frac{\\text{Mass of Solute}}{\\text{Total Mass of Solution}} \\times 10^6 \\quad \\Big| \\quad \\text{ppb} = \\frac{\\text{Mass of Solute}}{\\text{Total Mass}} \\times 10^9"
  },
  {
    "id": "avogadro_number_constant",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Avogadro Constant & Microscopic Masses",
    "expr": "N_A = 6.02214 × 10²³ mol⁻¹   |   1 amu = 1 Da = 1.66054 × 10⁻²⁴ g = 1 / N_A g",
    "keys": [
      "avogadro constant",
      "amu",
      "dalton",
      "mass of single atom"
    ],
    "symbols": [
      "Mass of 1 atom of element = (Atomic mass in g mol⁻¹) / N_A",
      "Mass of 1 molecule = (Molar mass in g mol⁻¹) / N_A"
    ],
    "notes": [
      "Mass of 1 carbon-12 atom = exactly 12 amu = 12 / (6.022 × 10²³) ≈ 1.9926 × 10⁻²³ g."
    ],
    "example": "Mass of a single water molecule (H₂O, M = 18.015 g mol⁻¹):\nm = 18.015 / (6.022 × 10²³) ≈ 2.99 × 10⁻²³ g.",
    "latex": "N_A = 6.02214 \\times 10^{23}\\text{ mol}^{-1}, \\quad 1\\text{ amu} = 1.66054 \\times 10^{-24}\\text{ g} = \\frac{1}{N_A}\\text{ g}"
  },
  {
    "id": "dulong_petit_law",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Dulong and Petit's Law of Atomic Heat",
    "expr": "Approximate Atomic Mass × Specific Heat (cal g⁻¹ °C⁻¹) ≈ 6.4",
    "keys": [
      "dulong petit",
      "atomic mass from specific heat",
      "valence from equivalent weight"
    ],
    "symbols": [
      "Specific heat measured in calories per gram per degree Celsius",
      "6.4 cal K⁻¹ mol⁻¹ ≈ 3 R (Dulong–Petit limit for solid elements)"
    ],
    "notes": [
      "Applies only to solid elements at room temperature or above; fails for light elements like B, C, Si, Be due to high Debye temperatures."
    ],
    "example": "Specific heat of a divalent metal is 0.057 cal g⁻¹ °C⁻¹:\nApprox. atomic mass = 6.4 / 0.057 ≈ 112.3.\nExact valency = 2, so exact atomic mass = Equivalent Mass × 2.",
    "latex": "\\text{Atomic Mass} \\times \\text{Specific Heat (cal g}^{-1}\\,^\\circ\\text{C}^{-1}) \\approx 6.4"
  },
  {
    "id": "atomicity_molar_ratio",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Dulong–Petit Molar Heat Capacity Limit",
    "expr": "C_m = 3 R ≈ 24.94 J K⁻¹ mol⁻¹   (High Temperature Limit)",
    "keys": [
      "dulong petit limit",
      "solid heat capacity 3r"
    ],
    "symbols": [
      "Valid for 3D atomic crystals above Debye temperature"
    ],
    "notes": [
      "Diamond has very low heat capacity at room temperature due to extremely high Debye temperature."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: C_m = 3 R ≈ 24.94 J K⁻¹ mol⁻¹   (High Temperature Limit)",
    "latex": "C_m = 3 R \\approx 24.94\\text{ J K}^{-1}\\text{ mol}^{-1} \\quad (\\text{Dulong--Petit High Temperature Limit})"
  },
  {
    "id": "empirical_molecular_formula",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Empirical & Molecular Formula Relation",
    "expr": "Molecular Formula = (Empirical Formula)_n   ,   n = (Molar Mass) / (Empirical Formula Mass)",
    "keys": [
      "empirical formula",
      "molecular formula",
      "stoichiometric ratio"
    ],
    "symbols": [
      "n: integer multiplier",
      "Molar Mass: experimental molar mass (g mol⁻¹)",
      "Empirical Formula Mass: sum of atomic masses in empirical formula"
    ],
    "notes": [
      "Vapour density relation: Molar Mass = 2 × Vapour Density for any gas.",
      "For organic combustion analysis: mass of C = (12/44) × mass of CO₂; mass of H = (2/18) × mass of H₂O."
    ],
    "example": "A compound has empirical formula CH₂O (mass 30) and vapour density 90:\nMolar mass = 2 × 90 = 180 g mol⁻¹.\nn = 180 / 30 = 6.\nMolecular formula = (CH₂O)₆ = C₆H₁₂O₆ (glucose).",
    "latex": "\\text{Molecular Formula} = (\\text{Empirical Formula})_n, \\quad n = \\frac{\\text{Molar Mass}}{\\text{Empirical Formula Mass}}"
  },
  {
    "id": "eudiometry_hydrocarbon",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Eudiometry & Hydrocarbon Gas Combustion",
    "expr": "C_x H_y + (x + y/4) O₂ → x CO₂ + (y/2) H₂O(l)   |   Contraction = 1 + y/4",
    "keys": [
      "eudiometry",
      "gas analysis",
      "hydrocarbon combustion contraction"
    ],
    "symbols": [
      "x: number of carbon atoms",
      "y: number of hydrogen atoms",
      "Contraction on combustion = V(hydrocarbon) + V(O₂) − V(CO₂) = (1 + y/4) × V"
    ],
    "notes": [
      "Water condensed to liquid at room temperature contributes negligible volume.",
      "KOH absorbs CO₂ completely, giving a second contraction equal to x × V."
    ],
    "example": "10 mL hydrocarbon gives 20 mL contraction on combustion and 20 mL contraction with KOH:\nx = 20/10 = 2 carbons (from KOH absorption).\nContraction = 10(1 + y/4) = 20 => 1 + y/4 = 2 => y = 4.\nFormula: C₂H₄ (ethene).",
    "latex": "\\ce{C_x H_y + \\left(x + \\frac{y}{4}\\right) O2 -> x CO2 + \\frac{y}{2} H2O(l)}, \\quad \\text{Contraction} = 1 + \\frac{y}{4}"
  },
  {
    "id": "combustion_alkane_general",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "General Alkane Stoichiometric Combustion",
    "expr": "C_n H_{2n+2} + [(3n+1)/2] O₂ → n CO₂ + (n+1) H₂O",
    "keys": [
      "alkane combustion",
      "stoichiometric oxygen"
    ],
    "symbols": [
      "n: number of carbon atoms"
    ],
    "notes": [
      "1 volume of methane requires 2 volumes of O₂; propane requires 5 volumes."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: C_n H_{2n+2} + [(3n+1)/2] O₂ → n CO₂ + (n+1) H₂O",
    "latex": "\\ce{C_n H_{2n+2} + \\frac{3n+1}{2} O2 -> n CO2 + (n+1) H2O}"
  },
  {
    "id": "combustion_alkyne_general",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "General Alkyne Stoichiometric Combustion",
    "expr": "C_n H_{2n-2} + [(3n-1)/2] O₂ → n CO₂ + (n-1) H₂O",
    "keys": [
      "alkyne combustion",
      "ethyne flame"
    ],
    "symbols": [
      "n: number of carbon atoms"
    ],
    "notes": [
      "Ethyne burns in pure O₂ at ~3300 K (oxy-acetylene welding flame)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: C_n H_{2n-2} + [(3n-1)/2] O₂ → n CO₂ + (n-1) H₂O",
    "latex": "\\ce{C_n H_{2n-2} + \\frac{3n-1}{2} O2 -> n CO2 + (n-1) H2O}"
  },
  {
    "id": "law_chemical_equivalence",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Law of Chemical Equivalents in Neutralisation",
    "expr": "N₁ V₁ = N₂ V₂   =>   (w₁ / E₁) = (w₂ / E₂)",
    "keys": [
      "chemical equivalence",
      "normality equation",
      "neutralisation point"
    ],
    "symbols": [
      "E = M / n-factor"
    ],
    "notes": [
      "At the equivalence point, gram-equivalents of acid equal gram-equivalents of base."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: N₁ V₁ = N₂ V₂   =>   (w₁ / E₁) = (w₂ / E₂)",
    "latex": "N_1 V_1 = N_2 V_2 \\implies \\frac{w_1}{E_1} = \\frac{w_2}{E_2}"
  },
  {
    "id": "limiting_reagent_yield",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Limiting Reagent & Percentage Yield",
    "expr": "Moles / Stoichiometric Coefficient = Minimum => Limiting Reagent   |   % Yield = (Actual Yield / Theoretical Yield) × 100",
    "keys": [
      "limiting reagent",
      "limiting reactant",
      "percentage yield",
      "theoretical yield"
    ],
    "symbols": [
      "Moles / coeff: ratio compared across all reactants to identify the one that exhausts first",
      "Theoretical Yield: maximum product calculated from limiting reagent"
    ],
    "notes": [
      "All product calculations must be based strictly on the limiting reagent.",
      "If reactants are taken in exact stoichiometric ratio, neither is limiting."
    ],
    "example": "2H₂ + O₂ → 2H₂O. 3 mol H₂ and 2 mol O₂:\nH₂ ratio = 3/2 = 1.5; O₂ ratio = 2/1 = 2.0. H₂ is limiting.\nMoles of H₂O formed = 3 mol (54 g).",
    "latex": "\\frac{\\text{Moles}}{\\text{Stoichiometric Coeff.}} = \\text{Minimum} \\implies \\text{LR}, \\quad \\text{\\% Yield} = \\frac{\\text{Actual Yield}}{\\text{Theoretical Yield}} \\times 100\\%"
  },
  {
    "id": "molar_volume_gas_conditions",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Molar Volume of Ideal Gas at STP vs SATP",
    "expr": "V_m(STP: 273.15 K, 1 atm) = 22.414 L   |   V_m(SATP: 298.15 K, 1 bar) = 24.789 L",
    "keys": [
      "molar volume stp satp",
      "22.4 vs 24.8"
    ],
    "symbols": [
      "Standard temperature and pressure vs ambient"
    ],
    "notes": [
      "JEE problems using 1 atm use 22.4 L; IUPAC standard (1 bar) uses 22.7 L."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: V_m(STP: 273.15 K, 1 atm) = 22.414 L   |   V_m(SATP: 298.15 K, 1 bar) = 24.789 L",
    "latex": "V_m(\\text{STP: } 273.15\\text{ K}, 1\\text{ atm}) = 22.414\\text{ L} \\quad \\Big| \\quad V_m(\\text{SATP: } 298.15\\text{ K}, 1\\text{ bar}) = 24.789\\text{ L}"
  },
  {
    "id": "mole_basic",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Mole Concept Fundamentals",
    "expr": "n = w / M = N / N_A = V(STP) / 22.4 L",
    "keys": [
      "mole",
      "moles",
      "avogadro",
      "molar volume"
    ],
    "symbols": [
      "n: number of moles",
      "w: mass in grams",
      "M: molar mass (g mol⁻¹)",
      "N: number of particles",
      "N_A = 6.022 × 10²³ mol⁻¹",
      "V(STP): volume of ideal gas at STP (0 °C, 1 atm) in litres"
    ],
    "notes": [
      "At standard ambient temperature and pressure (SATP: 25 °C, 1 bar), 1 mol gas ≈ 24.8 L.",
      "Number of atoms in a molecule = n × N_A × atomicity.",
      "1 amu = 1/12th mass of C-12 = 1.66 × 10⁻²⁴ g."
    ],
    "example": "Calculate moles in 4.4 g of CO₂:\nn = 4.4 / 44 = 0.1 mol.\nNumber of molecules = 0.1 × 6.022 × 10²³ = 6.022 × 10²².\nVolume at STP = 0.1 × 22.4 = 2.24 L.",
    "latex": "n = \\frac{w}{M} = \\frac{N}{N_A} = \\frac{V(\\text{STP})}{22.4\\text{ L}}"
  },
  {
    "id": "percentage_purity",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Percentage Purity of Chemical Sample",
    "expr": "% Purity = (Mass of pure chemical in sample / Total mass of impure sample) × 100",
    "keys": [
      "percentage purity",
      "sample purity",
      "stoichiometry with impurities"
    ],
    "symbols": [
      "Mass of pure chemical: quantity that actually reacts stoichometrically"
    ],
    "notes": [
      "Impurities are assumed to be inert unless stated otherwise in the question."
    ],
    "example": "10 g impure CaCO₃ produces 1.76 g CO₂ on heating (CaCO₃ → CaO + CO₂):\nMoles CO₂ = 1.76 / 44 = 0.04 mol.\nPure CaCO₃ = 0.04 × 100 = 4.0 g.\n% Purity = (4.0 / 10.0) × 100 = 40%.",
    "latex": "\\text{\\% Purity} = \\frac{\\text{Mass of pure substance}}{\\text{Total mass of sample}} \\times 100\\%"
  },
  {
    "id": "poac_principle",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Principle of Atom Conservation (POAC)",
    "expr": "Moles of atom X in reactant = Moles of atom X in product",
    "keys": [
      "poac",
      "atom conservation",
      "unbalanced reaction stoichiometry"
    ],
    "symbols": [
      "n_A × (number of X atoms in A) = n_B × (number of X atoms in B)"
    ],
    "notes": [
      "Extremely powerful for solving multi-step or complex reactions without writing balanced equations."
    ],
    "example": "27.6 g K₂CO₃ treated to yield K₂Zn₃[Fe(CN)₆]₂:\nMoles K in K₂CO₃ = 2 × (27.6 / 138) = 0.40 mol K.\nMoles of complex = 0.40 / 2 = 0.20 mol.",
    "latex": "\\text{POAC: } n_{\\text{reactant}} \\times (\\text{Atoms of X in Reactant}) = n_{\\text{product}} \\times (\\text{Atoms of X in Product})"
  },
  {
    "id": "vd_gas_law",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Vapour Density of Gas Mixtures",
    "expr": "V.D._mix = (M_avg) / 2 = (Σ n_i M_i) / (2 Σ n_i)",
    "keys": [
      "vapour density mixture",
      "average molar mass gas"
    ],
    "symbols": [
      "M_avg: apparent molar mass",
      "V.D.: relative to H₂ gas"
    ],
    "notes": [
      "For equimolar binary gas mixture: M_avg = (M₁ + M₂)/2."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: V.D._mix = (M_avg) / 2 = (Σ n_i M_i) / (2 Σ n_i)",
    "latex": "\\text{V.D.}_{\\text{mix}} = \\frac{M_{\\text{avg}}}{2} = \\frac{\\sum n_i M_i}{2 \\sum n_i}"
  },
  {
    "id": "victor_meyer_vapour_density_method",
    "branch": "Physical",
    "chapter": "Some Basic Concepts of Chemistry",
    "title": "Victor Meyer Method for Volatile Liquid Molar Mass",
    "expr": "Molar Mass = (w · 22400) / V(STP)   |   V(STP) = [ (P − p) · V · 273 ] / [ 760 · (273 + t) ]",
    "keys": [
      "victor meyer method",
      "volatile liquid molar mass",
      "air displacement"
    ],
    "symbols": [
      "w: mass of volatile liquid vaporised (g)",
      "V: volume of air displaced collected over water in graduated tube (mL)",
      "P: barometric atmospheric pressure (mm Hg)",
      "p: aqueous tension at room temperature t (°C)"
    ],
    "notes": [
      "Classic analytical method based on the principle that the volume of air displaced equals the volume of vapor formed at that temperature."
    ],
    "example": "0.20 g volatile substance displaces 50 mL dry air at STP: M = (0.20 × 22400) / 50 = 89.6 g mol⁻¹.",
    "latex": "M = \\frac{w \\times 22400}{V(\\text{STP})}, \\quad V(\\text{STP}) = \\frac{(P - p) \\cdot V \\cdot 273}{760 \\cdot (273 + t)}"
  },
  {
    "id": "idealgas",
    "branch": "Physical",
    "chapter": "States of matter",
    "title": "Ideal gas equation",
    "expr": "PV = nRT",
    "keys": [
      "ideal gas",
      "gas equation"
    ],
    "symbols": [
      "P: pressure, V: volume, n: moles, T: kelvin",
      "R = 0.0821 L atm K⁻¹ mol⁻¹ = 8.314 J K⁻¹ mol⁻¹ = 62.4 L Torr K⁻¹ mol⁻¹"
    ],
    "notes": [
      "Combined gas law: P₁V₁/T₁ = P₂V₂/T₂ for a fixed amount of gas.",
      "Density: d = PM/RT.",
      "Pick the R value that matches your pressure and volume units."
    ],
    "latex": "P V = n R T = \\frac{w}{M} R T = \\frac{\\rho}{M} R T"
  },
  {
    "id": "amagat_law_partial_volumes",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Amagat's Law of Partial Additive Volumes",
    "expr": "V_total = Σ V_i   |   % V_i = (V_i / V_total) × 100 = % n_i",
    "keys": [
      "amagats law",
      "partial volume",
      "gas mixture volume"
    ],
    "symbols": [
      "For ideal gas mixture, volume percent equals mole percent"
    ],
    "notes": [
      "Air with 78% N₂ by volume contains 78% N₂ by mole."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: V_total = Σ V_i   |   % V_i = (V_i / V_total) × 100 = % n_i",
    "latex": "V_{\\text{total}} = \\sum V_i, \\quad \\% V_i = \\frac{V_i}{V_{\\text{total}}} \\times 100\\% = \\% n_i"
  },
  {
    "id": "kinetic_energy_gas_molecules",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Average Kinetic Energy of Gas Molecules",
    "expr": "KE_total = (3/2) n R T   |   KE_per_molecule = (3/2) k_B T",
    "keys": [
      "kinetic energy gas",
      "boltzmann constant",
      "translational kinetic energy"
    ],
    "symbols": [
      "k_B = R / N_A = 1.3806 × 10⁻²³ J K⁻¹ (Boltzmann constant)",
      "T: absolute temperature in Kelvin"
    ],
    "notes": [
      "Kinetic energy of gas molecules depends ONLY on temperature, completely independent of gas identity or molar mass.",
      "At 0 K (absolute zero), translational kinetic energy of ideal gas becomes zero."
    ],
    "example": "At 300 K, KE per molecule of any ideal gas:\nKE = (3/2) × (1.38 × 10⁻²³) × 300 = 6.21 × 10⁻²¹ J.",
    "latex": "K_{\\text{total}} = \\frac{3}{2} n R T, \\quad K_{\\text{molecule}} = \\frac{3}{2} k_B T = \\frac{3}{2} \\left( \\frac{R}{N_A} \\right) T"
  },
  {
    "id": "boyle_inversion_temp",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Boyle & Inversion Temperatures of Real Gases",
    "expr": "T_B = a / (R b)   ,   T_i = 2a / (R b) = 2 T_B",
    "keys": [
      "boyle temperature",
      "inversion temperature",
      "joule thomson effect"
    ],
    "symbols": [
      "T_B: Boyle temperature (Z ≈ 1 over a wide pressure range)",
      "T_i: inversion temperature for Joule–Thomson expansion",
      "a, b: van der Waals parameters",
      "R: gas constant"
    ],
    "notes": [
      "At T = T_B, attractive and repulsive van der Waals forces balance, so the gas obeys ideal gas law over an extended pressure range.",
      "Below T_i, adiabatic expansion through a porous plug causes COOLING (Joule–Thomson cooling).",
      "Above T_i, expansion causes HEATING (for H₂ and He, T_i is very low: 193 K and 40 K, so they heat up at room temp)."
    ],
    "example": "For a gas with a = 3.6 atm L² mol⁻² and b = 0.04 L mol⁻¹:\nT_B = 3.6 / (0.0821 × 0.04) ≈ 1096 K.\nT_i = 2 × 1096 = 2192 K.",
    "latex": "T_B = \\frac{a}{R b}, \\quad T_i = \\frac{2a}{R b} = 2 T_B"
  },
  {
    "id": "boyles_law_isotherm",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Boyle's Law & Isothermal Compressibility",
    "expr": "P₁ V₁ = P₂ V₂ = constant (at const T, n)   |   β = −(1/V)(∂V/∂P)_T = 1/P",
    "keys": [
      "boyles law",
      "isothermal compressibility"
    ],
    "symbols": [
      "Pressure inversely proportional to volume"
    ],
    "notes": [
      "For ideal gas, isothermal compressibility β = 1/P."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: P₁ V₁ = P₂ V₂ = constant (at const T, n)   |   β = −(1/V)(∂V/∂P)_T = 1/P",
    "latex": "P_1 V_1 = P_2 V_2 = \\text{const} \\; (T, n \\text{ const}) \\quad \\Big| \\quad \\beta = -\\frac{1}{V}\\left( \\frac{\\partial V}{\\partial P} \\right)_T = \\frac{1}{P}"
  },
  {
    "id": "charles_law_absolute_zero",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Charles's Law & Absolute Zero Definition",
    "expr": "V_t = V₀ · (1 + t / 273.15)   |   V = 0 at t = −273.15 °C",
    "keys": [
      "charles law",
      "absolute zero",
      "temperature volume"
    ],
    "symbols": [
      "V₀: volume at 0 °C",
      "t: temperature in Celsius"
    ],
    "notes": [
      "Absolute zero (0 K = −273.15 °C) is the theoretical temperature where ideal gas volume becomes zero."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: V_t = V₀ · (1 + t / 273.15)   |   V = 0 at t = −273.15 °C",
    "latex": "V_t = V_0 \\left( 1 + \\frac{t}{273.15} \\right) \\quad \\Big| \\quad V = 0 \\text{ at } t = -273.15^\\circ\\text{C} \\; (0\\text{ K})"
  },
  {
    "id": "compressibility_factor_limits",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Compressibility Factor Z & Limiting Behaviors",
    "expr": "Z = (P V_m) / (R T)   |   Low P: Z ≈ 1 − a / (V_m R T)   |   High P: Z ≈ 1 + (P b) / (R T)",
    "keys": [
      "compressibility factor",
      "real gases",
      "low pressure limit",
      "high pressure limit"
    ],
    "symbols": [
      "Z = 1: ideal gas behavior",
      "Z < 1: attractive forces dominate (gas more compressible than ideal)",
      "Z > 1: repulsive forces dominate (size of molecules dominates, gas less compressible)"
    ],
    "notes": [
      "For H₂ and He, attractive forces are exceptionally weak (a ≈ 0), so Z > 1 at all pressures at room temp: Z = 1 + Pb/RT."
    ],
    "example": "At moderate pressure, when attractive forces dominate, Z < 1 and molar volume V_m < V_ideal.",
    "latex": "Z = \\frac{P V_m}{R T} \\quad \\Big| \\quad \\text{Low } P: Z \\approx 1 - \\frac{a}{V_m R T} \\quad \\Big| \\quad \\text{High } P: Z \\approx 1 + \\frac{P b}{R T}"
  },
  {
    "id": "critical_constants_vdw",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Critical Constants from van der Waals Parameters",
    "expr": "T_c = 8a / (27 R b)   ,   P_c = a / (27 b²)   ,   V_c = 3 b   |   Z_c = (P_c V_c) / (R T_c) = 3/8 = 0.375",
    "keys": [
      "critical temperature",
      "critical pressure",
      "critical volume",
      "liquefaction of gases",
      "van der waals"
    ],
    "symbols": [
      "T_c: critical temperature (above which a gas cannot be liquefied no matter how much pressure is applied)",
      "P_c: minimum pressure required to liquefy gas at T_c",
      "V_c: molar volume at T_c and P_c",
      "a, b: van der Waals parameters"
    ],
    "notes": [
      "Easier liquefaction corresponds to higher T_c and larger 'a' value (e.g. SO₂ > NH₃ > CO₂ > O₂ > N₂ > H₂ > He).",
      "Critical compressibility factor Z_c is a universal constant (0.375) for all van der Waals gases."
    ],
    "example": "For a gas with a = 4.0 atm L² mol⁻² and b = 0.04 L mol⁻¹:\nV_c = 3 × 0.04 = 0.12 L mol⁻¹.\nP_c = 4.0 / (27 × 0.04²) = 4.0 / 0.0432 ≈ 92.6 atm.",
    "latex": "T_c = \\frac{8a}{27 R b}, \\quad P_c = \\frac{a}{27 b^2}, \\quad V_c = 3b \\quad \\Big| \\quad Z_c = \\frac{P_c V_c}{R T_c} = \\frac{3}{8} = 0.375"
  },
  {
    "id": "dalton_amagat",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Dalton & Amagat Laws of Partial Quantities",
    "expr": "P_i = x_i · P_total   ,   V_i = x_i · V_total",
    "keys": [
      "dalton partial pressure",
      "amagat partial volume",
      "mole fraction gas"
    ],
    "symbols": [
      "P_i: partial pressure of ith gas",
      "x_i = n_i / n_total: mole fraction",
      "P_total: total pressure of mixture",
      "V_i: partial volume of ith gas"
    ],
    "notes": [
      "Dalton's law holds for non-reacting gas mixtures at moderate conditions.",
      "Dry gas pressure: P_dry = P_moist − Aqueous Tension (vapour pressure of water).",
      "Volume percent of gas i in an ideal gas mixture equals its mole percent: %V_i = %n_i."
    ],
    "example": "Air containing 80 mol% N₂ and 20 mol% O₂ at 1.0 atm total pressure:\nP(N₂) = 0.80 × 1.0 = 0.80 atm, P(O₂) = 0.20 × 1.0 = 0.20 atm.",
    "latex": "P_i = x_i \\cdot P_{\\text{total}}, \\quad V_i = x_i \\cdot V_{\\text{total}}"
  },
  {
    "id": "dalton_aqueous_tension",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Dalton's Partial Pressure & Aqueous Tension",
    "expr": "P_dry_gas = P_moist_gas − Aqueous Tension (P_H2O)",
    "keys": [
      "aqueous tension",
      "moist gas pressure",
      "water vapour pressure"
    ],
    "symbols": [
      "Aqueous tension depends only on temperature"
    ],
    "notes": [
      "Collected gas over water must always have water vapour pressure subtracted."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: P_dry_gas = P_moist_gas − Aqueous Tension (P_H2O)",
    "latex": "P_{\\text{dry gas}} = P_{\\text{moist gas}} - P_{\\ce{H2O}} \\text{ (Aqueous Tension)}"
  },
  {
    "id": "gay_lussac_pressure_temp",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Gay-Lussac's Law of Pressure-Temperature",
    "expr": "P_t = P₀ · (1 + t / 273.15)   =>   P₁ / T₁ = P₂ / T₂",
    "keys": [
      "gay lussacs law",
      "amontons law",
      "pressure temperature"
    ],
    "symbols": [
      "At constant volume (isochoric)"
    ],
    "notes": [
      "Pressure of tyre rises significantly after long driving on hot roads."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: P_t = P₀ · (1 + t / 273.15)   =>   P₁ / T₁ = P₂ / T₂",
    "latex": "P_t = P_0 \\left( 1 + \\frac{t}{273.15} \\right) \\implies \\frac{P_1}{T_1} = \\frac{P_2}{T_2} \\; (V \\text{ const})"
  },
  {
    "id": "graham_diffusion",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Graham's Law of Diffusion & Effusion",
    "expr": "r₁ / r₂ = √(M₂ / M₁) = √(d₂ / d₁) = (V₁ / t₁) / (V₂ / t₂)",
    "keys": [
      "graham",
      "diffusion",
      "effusion"
    ],
    "symbols": [
      "r₁, r₂: rates of diffusion/effusion",
      "M₁, M₂: molar masses",
      "d₁, d₂: vapour densities",
      "V: volume effused, t: time"
    ],
    "notes": [
      "If pressures differ: r₁ / r₂ = (P₁ / P₂) × √(M₂ / M₁).",
      "Used in isotope enrichment (e.g. ²³⁵UF₆ vs ²³⁸UF₆).",
      "He diffuses faster than CH₄ by √(16/4) = 2 times."
    ],
    "example": "Compare diffusion rates of CH₄ (M=16) and SO₂ (M=64):\nr(CH₄) / r(SO₂) = √(64 / 16) = √4 = 2. CH₄ diffuses twice as fast.",
    "latex": "\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}} = \\sqrt{\\frac{d_2}{d_1}} = \\frac{V_1/t_1}{V_2/t_2}"
  },
  {
    "id": "grahams_law_effusion",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Graham's Law of Diffusion & Effusion",
    "expr": "r₁ / r₂ = √(M₂ / M₁) = √(d₂ / d₁) = (V₁ / t₁) / (V₂ / t₂) = (n₁ / t₁) / (n₂ / t₂)",
    "keys": [
      "grahams law",
      "diffusion",
      "effusion",
      "rate of effusion",
      "molar mass ratio"
    ],
    "symbols": [
      "r: rate of effusion (volume or moles per unit time)",
      "M: molar mass of gas",
      "d: density of gas at same T and P",
      "t: time taken for effusion of fixed volume V"
    ],
    "notes": [
      "At different pressures: r₁ / r₂ = (P₁ / P₂) × √(M₂ / M₁).",
      "Used industrially to separate isotopes (e.g. ²³⁵UF₆ and ²³⁸UF₆)."
    ],
    "example": "Compare rates of diffusion of CH₄ (M = 16) and SO₂ (M = 64):\nr(CH₄) / r(SO₂) = √(64 / 16) = √4 = 2. Methane diffuses twice as fast as sulfur dioxide.",
    "latex": "\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}} = \\sqrt{\\frac{d_2}{d_1}} = \\frac{V_1 / t_1}{V_2 / t_2} = \\frac{n_1 / t_1}{n_2 / t_2}"
  },
  {
    "id": "kinetic_gas_equation_speeds",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Kinetic Gas Equation & Molecular Speeds",
    "expr": "u_rms = √(3RT/M)   ,   u_avg = √(8RT/πM)   ,   u_mp = √(2RT/M)",
    "keys": [
      "molecular speeds",
      "root mean square speed",
      "average speed",
      "most probable speed",
      "kinetic theory"
    ],
    "symbols": [
      "u_rms: root mean square speed",
      "u_avg: arithmetic mean speed",
      "u_mp: most probable speed (peak of Maxwell distribution)",
      "Ratio: u_mp : u_avg : u_rms = 1 : 1.128 : 1.224 = √2 : √(8/π) : √3"
    ],
    "notes": [
      "M must be in kg mol⁻¹ and R = 8.314 J K⁻¹ mol⁻¹ to obtain speed in m s⁻¹.",
      "Kinetic gas fundamental equation: P V = (1/3) m N u_rms²."
    ],
    "example": "Calculate u_rms for O₂ (M = 0.032 kg mol⁻¹) at 300 K:\nu_rms = √[ (3 × 8.314 × 300) / 0.032 ] = √[ 7482.6 / 0.032 ] = √233831 ≈ 483.6 m s⁻¹.",
    "latex": "P V = \\frac{1}{3} m N u_{\\text{rms}}^2, \\quad u_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}, \\quad u_{\\text{avg}} = \\sqrt{\\frac{8 R T}{\\pi M}}, \\quad u_{\\text{mp}} = \\sqrt{\\frac{2 R T}{M}}"
  },
  {
    "id": "van_der_waals_reduced_eq",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Law of Corresponding States & Reduced Equation",
    "expr": "[ P_r + (3 / V_r²) ] · [ 3 V_r − 1 ] = 8 T_r",
    "keys": [
      "law of corresponding states",
      "reduced equation of state",
      "reduced pressure temperature volume"
    ],
    "symbols": [
      "P_r = P / P_c: reduced pressure",
      "T_r = T / T_c: reduced temperature",
      "V_r = V / V_c: reduced volume"
    ],
    "notes": [
      "Equation contains NO specific constants 'a' or 'b', making it universal for all real gases."
    ],
    "example": "Any two gases at the same reduced temperature and reduced pressure possess identical reduced volume.",
    "latex": "\\left( P_r + \\frac{3}{V_r^2} \\right) (3 V_r - 1) = 8 T_r"
  },
  {
    "id": "mean_free_path_and_collision",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Mean Free Path & Collision Frequency",
    "expr": "λ = 1 / (√2 π d² N*) = (k_B T) / (√2 π d² P)   |   Z₁ = √2 π d² u_avg N*",
    "keys": [
      "mean free path",
      "collision frequency",
      "molecular diameter",
      "kinetic theory"
    ],
    "symbols": [
      "λ: mean free path (average distance travelled between two successive collisions)",
      "d: collision diameter of molecule",
      "N* = N/V: number density of molecules",
      "Z₁: number of collisions suffered by a single molecule per second"
    ],
    "notes": [
      "Mean free path is inversely proportional to pressure (λ ∝ 1/P) and directly proportional to temperature (λ ∝ T) at constant pressure.",
      "In high-vacuum tubes, λ can be tens of centimetres."
    ],
    "example": "If pressure of a gas is doubled at constant temperature, its mean free path λ is halved.",
    "latex": "\\lambda = \\frac{1}{\\sqrt{2}\\pi d^2 N^*} = \\frac{k_B T}{\\sqrt{2}\\pi d^2 P}, \\quad Z_1 = \\sqrt{2}\\pi d^2 u_{\\text{avg}} N^*"
  },
  {
    "id": "gas_speeds",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Molecular Speeds (Maxwell-Boltzmann)",
    "expr": "v_rms = √(3RT/M)   ,   v_avg = √(8RT/πM)   ,   v_mp = √(2RT/M)",
    "keys": [
      "molecular speeds",
      "root mean square",
      "most probable speed",
      "rms"
    ],
    "symbols": [
      "v_rms: root mean square speed",
      "v_avg: average speed",
      "v_mp: most probable speed",
      "R = 8.314 J K⁻¹ mol⁻¹, M in kg mol⁻¹"
    ],
    "notes": [
      "Ratio: v_mp : v_avg : v_rms = √2 : √(8/π) : √3 = 1 : 1.128 : 1.224.",
      "Average kinetic energy per molecule = (3/2) k_B T, independent of gas identity."
    ],
    "example": "RMS speed of O₂ (M = 0.032 kg mol⁻¹) at 300 K:\nv_rms = √(3 × 8.314 × 300 / 0.032) = √(233831) ≈ 483.5 m s⁻¹.",
    "latex": "v_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}, \\quad v_{\\text{avg}} = \\sqrt{\\frac{8 R T}{\\pi M}}, \\quad v_{\\text{mp}} = \\sqrt{\\frac{2 R T}{M}}"
  },
  {
    "id": "surface_tension_capillary",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Surface Tension & Capillary Rise Equation",
    "expr": "h = (2 γ cos θ) / (r ρ g)   |   γ = (r h ρ g) / (2 cos θ)",
    "keys": [
      "surface tension",
      "capillary rise",
      "contact angle",
      "meniscus"
    ],
    "symbols": [
      "h: height of liquid column in capillary tube (m)",
      "γ: surface tension (N m⁻¹ or J m⁻²)",
      "θ: contact angle (θ < 90° for wetting liquids like water on glass; θ > 90° for mercury)",
      "r: tube inner radius",
      "ρ: density of liquid",
      "g = 9.8 m s⁻²"
    ],
    "notes": [
      "Surface tension decreases with increasing temperature and becomes zero at the critical temperature T_c.",
      "For pure water on clean glass, θ ≈ 0° => cos θ = 1."
    ],
    "example": "In a capillary of r = 0.5 mm in water (γ = 0.0728 N m⁻¹, ρ = 1000 kg m⁻³, θ = 0°):\nh = (2 × 0.0728 × 1) / (0.5 × 10⁻³ × 1000 × 9.8) = 0.1456 / 4.9 ≈ 0.0297 m = 2.97 cm.",
    "latex": "h = \\frac{2 \\gamma \\cos\\theta}{r \\rho g} \\quad \\Big| \\quad \\gamma = \\frac{r h \\rho g}{2 \\cos\\theta}"
  },
  {
    "id": "vanderwaals",
    "branch": "Physical",
    "chapter": "States of Matter",
    "title": "Van der Waals Equation for Real Gases",
    "expr": "(P + an²/V²) (V − nb) = nRT",
    "keys": [
      "van der waals",
      "real gas",
      "compressibility factor"
    ],
    "symbols": [
      "a: magnitude of intermolecular attractive forces (atm L² mol⁻²)",
      "b = 4 V_m: effective excluded volume of molecules (L mol⁻¹)",
      "Z = PV / nRT: compressibility factor"
    ],
    "notes": [
      "At low pressure: (P + a/V_m²) V_m = RT  =>  Z = 1 − a / (RT V_m) < 1 (attractive forces dominate).",
      "At very high pressure: P(V_m − b) = RT  =>  Z = 1 + Pb / RT > 1 (repulsive forces dominate).",
      "For H₂ and He, 'a' is nearly zero, so Z = 1 + Pb / RT > 1 at all ordinary temperatures."
    ],
    "example": "Critical constants: T_c = 8a / (27Rb), P_c = a / (27b²), V_c = 3b.\nCritical compressibility Z_c = P_c V_c / (RT_c) = 3/8 = 0.375.",
    "latex": "\\left( P + \\frac{a n^2}{V^2} \\right) (V - n b) = n R T"
  },
  {
    "id": "bohr_energy_joules",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Bohr Energy in Joules per Atom",
    "expr": "E_n = −2.18 × 10⁻¹⁸ × (Z² / n²) J",
    "keys": [
      "bohr energy joules",
      "rydberg energy"
    ],
    "symbols": [
      "R_H in energy units = 2.18 × 10⁻¹⁸ J"
    ],
    "notes": [
      "Ionisation energy of ground-state H = +2.18 × 10⁻¹⁸ J/atom = +1312 kJ mol⁻¹."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: E_n = −2.18 × 10⁻¹⁸ × (Z² / n²) J",
    "latex": "E_n = -2.18 \\times 10^{-18} \\times \\frac{Z^2}{n^2}\\,\\text{J}"
  },
  {
    "id": "bohr_radius_derivation",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Bohr Orbit Radius for Hydrogen-like Species",
    "expr": "r_n = (ε₀ h² n²) / (π m e² Z) = 0.529 × (n² / Z) Å = 52.9 × (n² / Z) pm",
    "keys": [
      "bohr radius",
      "orbit radius",
      "hydrogen like ions",
      "he+ li2+"
    ],
    "symbols": [
      "n: principal quantum number (1, 2, 3...)",
      "Z: atomic number (H=1, He⁺=2, Li²⁺=3, Be³⁺=4)",
      "a₀ = 0.529 Å (first Bohr radius of hydrogen)"
    ],
    "notes": [
      "Radius is directly proportional to n² and inversely proportional to Z: r ∝ n² / Z.",
      "Ratio of radii in H atom: r₁ : r₂ : r₃ = 1 : 4 : 9."
    ],
    "example": "Radius of 2nd orbit of Li²⁺ (n = 2, Z = 3):\nr = 0.529 × (2² / 3) = 0.529 × (4 / 3) ≈ 0.705 Å.",
    "latex": "r_n = \\frac{\\varepsilon_0 h^2 n^2}{\\pi m e^2 Z} = 0.529 \\,\\frac{n^2}{Z}\\,\\text{\\AA} = 52.9 \\,\\frac{n^2}{Z}\\,\\text{pm}"
  },
  {
    "id": "angular_momentum_quantisation",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Bohr Postulate: Orbital Angular Momentum Quantisation",
    "expr": "m v r = n · (h / 2π) = n · ℏ",
    "keys": [
      "angular momentum quantisation",
      "bohr postulate"
    ],
    "symbols": [
      "n: 1, 2, 3..."
    ],
    "notes": [
      "Explains wave-particle duality: an integral number of de Broglie waves must fit in the orbit (2πr = nλ)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: m v r = n · (h / 2π) = n · ℏ",
    "latex": "m v r = n \\left( \\frac{h}{2\\pi} \\right) = n \\hbar"
  },
  {
    "id": "de_broglie_thermal_neutrons",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "de Broglie Wavelength of Thermal Neutrons",
    "expr": "λ = h / √(3 m k_B T) = 0.286 / √E(eV) Å",
    "keys": [
      "thermal neutron wavelength",
      "neutron diffraction"
    ],
    "symbols": [
      "m: neutron mass (1.675 × 10⁻²⁷ kg)",
      "k_B: Boltzmann constant"
    ],
    "notes": [
      "Thermal neutrons at 300 K have λ ≈ 1.8 Å, ideal for investigating crystal structures."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: λ = h / √(3 m k_B T) = 0.286 / √E(eV) Å",
    "latex": "\\lambda = \\frac{h}{\\sqrt{3 m k_B T}} = \\frac{0.286}{\\sqrt{E_{\\text{eV}}}}\\,\\text{\\AA}"
  },
  {
    "id": "de_broglie_potentials",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "de Broglie Wavelength under Accelerating Potentials",
    "expr": "λ = h / p = h / √(2 m q V)   |   For electron: λ = 12.27 / √V Å = √(150 / V) Å",
    "keys": [
      "de broglie wavelength",
      "accelerating potential",
      "wave particle duality",
      "matter wave"
    ],
    "symbols": [
      "h = 6.626 × 10⁻³⁴ J s (Planck constant)",
      "p = m v: momentum",
      "V: accelerating electric potential in Volts",
      "q: charge of particle",
      "m: rest mass of particle"
    ],
    "notes": [
      "For proton: λ = 0.286 / √V Å.",
      "For alpha particle (q = 2e, m = 4 m_p): λ = 0.101 / √V Å.",
      "For gas molecule at temperature T: λ = h / √(3 m k_B T)."
    ],
    "example": "An electron accelerated through 100 V:\nλ = 12.27 / √100 = 12.27 / 10 = 1.227 Å = 0.1227 nm.",
    "latex": "\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2 m q V}} \\quad \\Big| \\quad \\text{For } e^-: \\; \\lambda = \\frac{12.27}{\\sqrt{V}}\\,\\text{\\AA} = \\sqrt{\\frac{150}{V}}\\,\\text{\\AA}"
  },
  {
    "id": "photoelectric_work_function",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Einstein's Photoelectric Equation & Stopping Potential",
    "expr": "E = h ν = h ν₀ + KE_max   =>   KE_max = h(ν − ν₀) = e V_s",
    "keys": [
      "photoelectric effect",
      "work function",
      "stopping potential",
      "threshold frequency"
    ],
    "symbols": [
      "h ν: energy of incident photon",
      "w₀ = h ν₀ = hc / λ₀: work function of metal",
      "ν₀: threshold frequency",
      "λ₀: threshold wavelength",
      "KE_max: maximum kinetic energy of emitted photoelectron",
      "V_s: stopping potential in Volts"
    ],
    "notes": [
      "Stopping potential V_s is independent of incident intensity; it depends strictly on light frequency ν.",
      "Slope of V_s vs ν graph is h/e, identical for ALL metals."
    ],
    "example": "Light of frequency 1.0 × 10¹⁵ Hz shines on metal with work function 2.5 eV (6.0 × 10¹⁴ Hz):\nKE_max = h(ν − ν₀) = 6.63 × 10⁻³⁴ × (1.0 × 10¹⁵ − 6.0 × 10¹⁴) = 2.65 × 10⁻¹⁹ J = 1.65 eV.\nStopping potential V_s = 1.65 V.",
    "latex": "E = h\\nu = h\\nu_0 + K_{\\max} \\implies K_{\\max} = h(\\nu - \\nu_0) = e V_s"
  },
  {
    "id": "heisenberg_uncertainty_relations",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Heisenberg's Uncertainty Principle (Position, Velocity, Energy)",
    "expr": "Δx · Δp ≥ h / (4π)   =>   Δx · Δv ≥ h / (4π m)   |   ΔE · Δt ≥ h / (4π)",
    "keys": [
      "heisenberg uncertainty",
      "uncertainty principle",
      "delta x delta p",
      "position and momentum"
    ],
    "symbols": [
      "Δx: uncertainty in position (m)",
      "Δp = m Δv: uncertainty in momentum (kg m s⁻¹)",
      "Δv: uncertainty in velocity (m s⁻¹)",
      "ΔE: uncertainty in energy",
      "Δt: lifetime of state"
    ],
    "notes": [
      "If an electron is confined inside a nucleus (radius ~10⁻¹⁴ m), Δv calculated exceeds speed of light c, proving electrons cannot reside inside nuclei.",
      "Equality Δx · Δp = ℏ/2 represents a minimum uncertainty Gaussian wave packet."
    ],
    "example": "Position of an electron (m = 9.1 × 10⁻³¹ kg) known to within 0.1 Å (10⁻¹¹ m):\nΔv ≥ 6.626 × 10⁻³⁴ / [4π × 9.1 × 10⁻³¹ × 10⁻¹¹] ≈ 5.79 × 10⁶ m s⁻¹.",
    "latex": "\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi} \\implies \\Delta x \\cdot \\Delta v \\ge \\frac{h}{4\\pi m}, \\quad \\Delta E \\cdot \\Delta t \\ge \\frac{h}{4\\pi}"
  },
  {
    "id": "bohr_energies_relation",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Kinetic, Potential & Total Energy of Bohr Orbit",
    "expr": "Total Energy E_n = −13.6 × (Z² / n²) eV   |   KE = −E_n   |   PE = 2 E_n",
    "keys": [
      "bohr energy",
      "kinetic energy electron",
      "potential energy electron",
      "virial theorem"
    ],
    "symbols": [
      "E_n: total mechanical energy (always negative for bound states)",
      "KE: orbital kinetic energy (always positive)",
      "PE: electrostatic potential energy (negative, magnitude twice KE)"
    ],
    "notes": [
      "Virial Theorem for Coulomb potential: 2<KE> + <PE> = 0 => PE = −2 KE.",
      "Conversion: 1 eV = 1.602 × 10⁻¹⁹ J; 13.6 eV = 1312 kJ mol⁻¹ = 2.18 × 10⁻¹⁸ J/atom."
    ],
    "example": "In hydrogen ground state (n = 1, Z = 1):\nTotal energy E₁ = −13.6 eV.\nKE = +13.6 eV.\nPE = 2 × (−13.6) = −27.2 eV.",
    "latex": "E_n = -13.6 \\times \\frac{Z^2}{n^2}\\,\\text{eV} \\quad \\Big| \\quad K = -E_n \\quad \\Big| \\quad U = 2 E_n"
  },
  {
    "id": "packing_fraction_mass_defect",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Mass Defect & Nuclear Binding Energy",
    "expr": "Δm = [ Z · m_p + (A − Z) · m_n ] − M_nucleus   |   BE = Δm · c² = Δm(amu) × 931.5 MeV",
    "keys": [
      "mass defect",
      "binding energy",
      "einstein mass energy",
      "nuclear stability"
    ],
    "symbols": [
      "Δm: mass defect (lost mass converted into nuclear binding energy)",
      "m_p = 1.00728 amu, m_n = 1.00867 amu",
      "BE / A: binding energy per nucleon (maximum near ⁵⁶Fe ≈ 8.8 MeV/nucleon, representing maximum nuclear stability)"
    ],
    "notes": [
      "Nuclei with low BE/A undergo nuclear fusion (light nuclei) or nuclear fission (heavy nuclei like ²³⁵U) to move toward the stable iron peak."
    ],
    "example": "For alpha particle (⁴₂He, mass = 4.0015 amu): Δm = 2(1.00728) + 2(1.00867) − 4.0015 = 0.0304 amu.\nBE = 0.0304 × 931.5 ≈ 28.3 MeV (7.07 MeV/nucleon).",
    "latex": "\\Delta m = [Z m_p + (A - Z) m_n] - M_{\\text{nucleus}} \\quad \\Big| \\quad \\text{BE} = \\Delta m \\cdot c^2 = \\Delta m(\\text{amu}) \\times 931.5\\,\\text{MeV}"
  },
  {
    "id": "moseley_law_xray",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Moseley's Law for Characteristic X-rays",
    "expr": "√ν = a (Z − b)",
    "keys": [
      "moseley law",
      "characteristic x-rays",
      "atomic number basis",
      "k alpha line"
    ],
    "symbols": [
      "ν: frequency of characteristic X-ray spectral line",
      "Z: atomic number of target anode",
      "a: proportionality constant",
      "b: screening constant (b = 1 for K_α lines; b = 7.4 for L_α lines)"
    ],
    "notes": [
      "Moseley proved that atomic number Z (not atomic weight) is the fundamental property of elements.",
      "K_α line transition: electron jumps from n = 2 (L shell) to n = 1 (K shell)."
    ],
    "example": "For K_α radiation: √ν ∝ (Z − 1). Plotting √ν against Z produces a straight line with intercept b = 1.",
    "latex": "\\sqrt{\\nu} = a(Z - b)"
  },
  {
    "id": "number_of_spectral_lines",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Number of Spectral Lines on Electron De-excitation",
    "expr": "N = [ (n₂ − n₁) (n₂ − n₁ + 1) ] / 2   =   [ Δn (Δn + 1) ] / 2",
    "keys": [
      "spectral lines count",
      "transitions",
      "emission lines"
    ],
    "symbols": [
      "n₂: initial excited state quantum number",
      "n₁: final lower state (n₁ = 1 for ground state)",
      "Δn = n₂ − n₁"
    ],
    "notes": [
      "This formula applies to a sample containing MANY excited hydrogen atoms.",
      "For a SINGLE isolated atom, maximum lines possible = n₂ − n₁ = Δn."
    ],
    "example": "Electrons de-excite from n = 5 to ground state (n = 1):\nΔn = 5 − 1 = 4.\nN = 4 × (4 + 1) / 2 = 10 distinct spectral lines.",
    "latex": "N = \\frac{(n_2 - n_1)(n_2 - n_1 + 1)}{2} = \\frac{\\Delta n(\\Delta n + 1)}{2}"
  },
  {
    "id": "orbital_and_spin_momenta",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Orbital & Spin Angular Momentum",
    "expr": "L = √[ l(l + 1) ] · (h / 2π)   |   S = √[ s(s + 1) ] · (h / 2π)   |   μ_s = √[ n(n + 2) ] BM",
    "keys": [
      "orbital angular momentum",
      "spin angular momentum",
      "magnetic moment",
      "bohr magneton"
    ],
    "symbols": [
      "l: orbital quantum number",
      "s = 1/2: electron spin",
      "ℏ = h / (2π)",
      "n: number of unpaired electrons",
      "BM = e h / (4π m_e) = 9.274 × 10⁻²⁴ J T⁻¹"
    ],
    "notes": [
      "Orbital angular momentum of any s-electron is ZERO because l = 0.",
      "Spin-only formula neglects orbital contribution, highly accurate for first-row transition metals."
    ],
    "example": "For a d-electron (l = 2):\nL = √[ 2(2 + 1) ] ℏ = √6 (h / 2π).\nFor Fe²⁺ (3d⁶, 4 unpaired electrons): μ_s = √[ 4(4 + 2) ] = √24 ≈ 4.90 BM.",
    "latex": "L = \\sqrt{l(l + 1)}\\,\\frac{h}{2\\pi}, \\quad S = \\sqrt{s(s + 1)}\\,\\frac{h}{2\\pi}, \\quad \\mu_s = \\sqrt{n(n + 2)}\\,\\mu_B"
  },
  {
    "id": "radial_probability_distribution",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Radial Probability Function P(r)",
    "expr": "P(r) dr = 4 π r² R²(r) dr",
    "keys": [
      "radial probability density",
      "radial distribution function"
    ],
    "symbols": [
      "4πr² accounts for spherical volume element shell thickness dr"
    ],
    "notes": [
      "For 1s orbital of H, P(r) is maximum at r = a₀ (0.529 Å), while ψ² is maximum at r = 0."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: P(r) dr = 4 π r² R²(r) dr",
    "latex": "P(r)\\,dr = 4 \\pi r^2 R^2(r)\\,dr"
  },
  {
    "id": "quantum_nodes_formula",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Radial, Angular & Total Nodes in Atomic Orbitals",
    "expr": "Radial Nodes = n − l − 1   |   Angular Nodes = l   |   Total Nodes = n − 1",
    "keys": [
      "radial nodes",
      "angular nodes",
      "spherical nodes",
      "nodal planes",
      "wavefunctions"
    ],
    "symbols": [
      "n: principal quantum number",
      "l: azimuthal quantum number (s=0, p=1, d=2, f=3)",
      "Radial nodes: spherical surfaces where probability density ψ² = 0",
      "Angular nodes: planar or conical surfaces where ψ² = 0"
    ],
    "notes": [
      "Number of nodal planes passing through the nucleus equals l.",
      "3d orbital has: Radial nodes = 3 − 2 − 1 = 0; Angular nodes = 2; Total = 2."
    ],
    "example": "Find nodes in a 4p orbital (n = 4, l = 1):\nRadial nodes = 4 − 1 − 1 = 2.\nAngular nodes = 1.\nTotal nodes = 4 − 1 = 3.",
    "latex": "\\text{Radial Nodes} = n - l - 1 \\quad \\Big| \\quad \\text{Angular Nodes} = l \\quad \\Big| \\quad \\text{Total Nodes} = n - 1"
  },
  {
    "id": "rydberg_formula_series",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Rydberg Formula & Hydrogen Spectral Series",
    "expr": "1 / λ = ν̄ = R_H · Z² · [ (1 / n₁²) − (1 / n₂²) ]   ,   R_H ≈ 109,677 cm⁻¹ ≈ 1.097 × 10⁷ m⁻¹",
    "keys": [
      "rydberg formula",
      "wave number",
      "lyman",
      "balmer",
      "paschen",
      "brackett",
      "pfund"
    ],
    "symbols": [
      "λ: wavelength of emitted/absorbed photon",
      "ν̄ = 1/λ: wave number",
      "Lyman: n₁ = 1, n₂ = 2,3... (UV region)",
      "Balmer: n₁ = 2, n₂ = 3,4... (Visible region)",
      "Paschen: n₁ = 3 (Infrared)",
      "Brackett: n₁ = 4 (Far-IR)",
      "Pfund: n₁ = 5 (Far-IR)"
    ],
    "notes": [
      "Shortest wavelength (series limit): n₂ = ∞ => 1/λ_max = R_H / n₁².",
      "Longest wavelength (first line): n₂ = n₁ + 1.",
      "Only Balmer series falls in the visible spectrum of electromagnetic radiation."
    ],
    "example": "First line of Balmer series (H atom, Z = 1, n₁ = 2, n₂ = 3):\n1/λ = 1.097 × 10⁷ × (1/4 − 1/9) = 1.097 × 10⁷ × (5/36) => λ ≈ 656.3 nm (red H_α line).",
    "latex": "\\frac{1}{\\lambda} = \\bar{\\nu} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right), \\quad R_H \\approx 1.097 \\times 10^7\\,\\text{m}^{-1}"
  },
  {
    "id": "group_displacement_soddy_fajans",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Soddy–Fajans Group Displacement Law",
    "expr": "α-emission: (Z−2, A−4)   |   β⁻-emission: (Z+1, A)   |   γ-emission: (Z, A) unchanged",
    "keys": [
      "group displacement law",
      "soddy fajans",
      "alpha decay",
      "beta decay"
    ],
    "symbols": [
      "α-particle: ⁴₂He nucleus (mass drops by 4, atomic number drops by 2 => shifts 2 groups left in periodic table)",
      "β⁻-particle: electron (mass unchanged, atomic number increases by 1 => shifts 1 group right)",
      "Positron emission (β⁺): atomic number drops by 1"
    ],
    "notes": [
      "Parent and daughter after β-decay are ISOBARS (same mass number A).",
      "After emitting one α and two β⁻ particles, the product is an ISOTOPE of the original parent element."
    ],
    "example": "²³⁸₉₂U emits an α-particle to become ²³⁴₉₀Th (shifts from Group 6 to Group 4).",
    "latex": "\\alpha\\text{-emission: } (Z - 2, A - 4) \\quad \\Big| \\quad \\beta^-\\text{-emission: } (Z + 1, A) \\quad \\Big| \\quad \\gamma\\text{-emission: } (Z, A) \\text{ unchanged}"
  },
  {
    "id": "bohr_orbital_time_period",
    "branch": "Physical",
    "chapter": "Structure of Atom",
    "title": "Time Period of Bohr Orbit Revolution",
    "expr": "T_n = (2 π r_n) / v_n ∝ n³ / Z²",
    "keys": [
      "orbital period",
      "revolution frequency",
      "time period bohr"
    ],
    "symbols": [
      "T ∝ n³ / Z²",
      "Frequency f = 1/T ∝ Z² / n³"
    ],
    "notes": [
      "In hydrogen atom, T₁ : T₂ : T₃ = 1 : 8 : 27."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: T_n = (2 π r_n) / v_n ∝ n³ / Z²",
    "latex": "T_n = \\frac{2 \\pi r_n}{v_n} \\propto \\frac{n^3}{Z^2}, \\quad f_n \\propto \\frac{Z^2}{n^3}"
  },
  {
    "id": "cmc_kraft_temperature",
    "branch": "Physical",
    "chapter": "Surface Chemistry",
    "title": "Critical Micelle Concentration (CMC) & Kraft Temperature",
    "expr": "Micelle Formation occurs ONLY when: T ≥ T_k (Kraft Temperature)   and   Concentration ≥ CMC",
    "keys": [
      "cmc",
      "critical micelle concentration",
      "kraft temperature",
      "surfactant"
    ],
    "symbols": [
      "T_k: minimum temperature required for micelle formation",
      "CMC: minimum concentration above which surfactant molecules aggregate into micelles"
    ],
    "notes": [
      "For sodium dodecyl sulfate (SDS): CMC ≈ 8 × 10⁻³ M.",
      "Above CMC, physical properties like surface tension and equivalent conductivity level off abruptly."
    ],
    "example": "Soap functions as an effective detergent only above its CMC and Kraft temperature.",
    "latex": "\\text{Micelle Formation occurs only when: } T \\ge T_k \\text{ (Kraft Temp)} \\quad \\text{and} \\quad \\text{Concentration} \\ge \\text{CMC}"
  },
  {
    "id": "adsorption_isotherms",
    "branch": "Physical",
    "chapter": "Surface Chemistry",
    "title": "Freundlich & Langmuir Adsorption Isotherms",
    "expr": "Freundlich: x/m = k · P^(1/n)   =>   log(x/m) = log k + (1/n) log P   (0 < 1/n < 1)",
    "keys": [
      "freundlich",
      "adsorption isotherm",
      "surface chemistry",
      "langmuir"
    ],
    "symbols": [
      "x: mass of gas adsorbed",
      "m: mass of adsorbent",
      "P: equilibrium pressure",
      "k, n: empirical constants"
    ],
    "notes": [
      "Plot of log(x/m) vs log P is a straight line with slope 1/n and y-intercept log k.",
      "At low pressure, 1/n = 1 (x/m ∝ P). At high pressure, 1/n = 0 (x/m becomes independent of P, surface saturated).",
      "Hardy–Schulze Rule: coagulating power of an electrolyte is proportional to the 6th power of the valency of the active flocculating ion (Al³⁺ > Ba²⁺ > Na⁺ for negative sols)."
    ],
    "example": "If slope of Freundlich log-plot is 0.5 (1/n = 0.5) and intercept is 0.4771 (k = 3):\nAt P = 4 atm, x/m = 3 × 4^(0.5) = 3 × 2 = 6.",
    "latex": "\\text{Freundlich: } \\frac{x}{m} = k \\cdot P^{1/n} \\implies \\log_{10}\\left( \\frac{x}{m} \\right) = \\log_{10} k + \\frac{1}{n}\\log_{10} P \\; (0 < \\frac{1}{n} < 1)"
  },
  {
    "id": "freundlich_isotherm_log",
    "branch": "Physical",
    "chapter": "Surface Chemistry",
    "title": "Freundlich Adsorption Isotherm",
    "expr": "x / m = k · P^(1/n)   =>   log(x / m) = log k + (1/n) · log P   (where 0 ≤ 1/n ≤ 1)",
    "keys": [
      "freundlich adsorption isotherm",
      "surface chemistry",
      "adsorption isotherm slope",
      "physisorption"
    ],
    "symbols": [
      "x: mass of gas adsorbed",
      "m: mass of solid adsorbent",
      "P: equilibrium gas pressure",
      "k, n: empirical constants depending on adsorbent and gas at constant temperature"
    ],
    "notes": [
      "Plotting log(x/m) vs log P gives a straight line with slope = 1/n and y-intercept = log k.",
      "At low pressure: 1/n = 1 => x/m ∝ P (linear).",
      "At high pressure: 1/n = 0 => x/m = constant (saturation reached).",
      "Freundlich isotherm fails at very high pressures."
    ],
    "example": "If the slope of log(x/m) vs log P is 0.5 and intercept is 0.3 (k = 2.0):\nAt P = 4 atm: x/m = 2.0 × (4)^0.5 = 2.0 × 2 = 4.0 g/g.",
    "latex": "\\frac{x}{m} = k \\cdot P^{1/n} \\implies \\log_{10}\\left( \\frac{x}{m} \\right) = \\log_{10} k + \\frac{1}{n}\\log_{10} P \\; (0 \\le \\frac{1}{n} \\le 1)"
  },
  {
    "id": "hardy_schulze_coagulation",
    "branch": "Physical",
    "chapter": "Surface Chemistry",
    "title": "Hardy–Schulze Rule for Colloid Coagulation",
    "expr": "Coagulating Power ∝ (Valency of Oppositely Charged Ion)⁴   |   Coagulation Value ∝ 1 / Power",
    "keys": [
      "hardy schulze",
      "coagulating power",
      "flocculation value",
      "colloid precipitation",
      "gold number"
    ],
    "symbols": [
      "Coagulation / Flocculation value: minimum millimoles of electrolyte per litre of sol required to cause precipitation in 2 hours",
      "Effective ions for positive sol: [Fe(CN)₆]⁴⁻ > PO₄³⁻ > SO₄²⁻ > Cl⁻",
      "Effective ions for negative sol (As₂S₃): Al³⁺ > Ba²⁺ > Na⁺"
    ],
    "notes": [
      "Smaller coagulation value indicates GREATER coagulating power.",
      "Gold number measures protective power of lyophilic colloids: smaller gold number = better protector (Gelatin = 0.005–0.01; Starch = 25)."
    ],
    "example": "To coagulate negative As₂S₃ sol, AlCl₃ (Al³⁺, valency 3) is approximately 3⁴ = 81 times more effective than NaCl (Na⁺, valency 1).",
    "latex": "\\text{Coagulating Power} \\propto z^4 \\quad \\Big| \\quad \\text{Coagulation Value} \\propto \\frac{1}{\\text{Coagulating Power}}"
  },
  {
    "id": "langmuir_isotherm_linear",
    "branch": "Physical",
    "chapter": "Surface Chemistry",
    "title": "Langmuir Adsorption Isotherm Linear Form",
    "expr": "(P / (x/m)) = (1 / (a · b)) + (P / a)",
    "keys": [
      "langmuir isotherm",
      "monolayer adsorption",
      "surface coverage"
    ],
    "symbols": [
      "a, b: constants",
      "Monolayer capacity = a"
    ],
    "notes": [
      "Assumes uniform monolayer adsorption on identical independent surface sites with no lateral interactions."
    ],
    "example": "Plot of P/(x/m) vs P gives straight line with slope = 1/a and intercept = 1/(ab).",
    "latex": "\\frac{P}{x/m} = \\frac{1}{a \\cdot b} + \\frac{P}{a}"
  },
  {
    "id": "zeta_potential_helmholtz",
    "branch": "Physical",
    "chapter": "Surface Chemistry",
    "title": "Zeta Potential (Helmholtz–Smoluchowski Equation)",
    "expr": "ζ = (4 π η u) / ε",
    "keys": [
      "zeta potential",
      "electrokinetic potential",
      "colloid stability",
      "electrophoresis"
    ],
    "symbols": [
      "ζ: zeta potential at slipping plane (mV)",
      "η: viscosity of medium",
      "u: electrophoretic mobility",
      "ε: dielectric constant"
    ],
    "notes": [
      "Colloidal suspensions with |ζ| > 30 mV are electrostatically stable against coagulation."
    ],
    "example": "High zeta potential prevents milk particles or ink suspensions from coagulating.",
    "latex": "\\zeta = \\frac{4 \\pi \\eta u}{\\varepsilon}"
  },
  {
    "id": "adiabatic_relations_poisson",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Adiabatic Reversible Process (Poisson's Relations)",
    "expr": "P V^γ = constant   |   T V^(γ−1) = constant   |   T^γ P^(1−γ) = constant",
    "keys": [
      "adiabatic process",
      "poisson ratio",
      "gamma",
      "cp cv ratio"
    ],
    "symbols": [
      "γ = C_p / C_v: heat capacity ratio (Monoatomic = 5/3 = 1.67; Diatomic = 7/5 = 1.40; Polyatomic non-linear = 4/3 = 1.33)"
    ],
    "notes": [
      "In adiabatic expansion, gas cools down (T₂ < T₁); in adiabatic compression, gas heats up (T₂ > T₁).",
      "Slope of adiabatic curve on PV diagram is γ times steeper than isothermal curve: (dP/dV)_ad = γ (dP/dV)_iso."
    ],
    "example": "Monoatomic gas (γ = 5/3) compressed to 1/8th of its original volume adiabatically:\nT₂ / T₁ = (V₁ / V₂)^(γ−1) = 8^(5/3 − 1) = 8^(2/3) = 4. Final temperature is 4 times initial.",
    "latex": "P V^\\gamma = \\text{const}, \\quad T V^{\\gamma - 1} = \\text{const}, \\quad T^\\gamma P^{1 - \\gamma} = \\text{const}"
  },
  {
    "id": "born_haber_cycle_lattice",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Born–Haber Cycle for Crystal Lattice Enthalpy",
    "expr": "ΔH_f° = ΔH_sub(M) + (1/2) D(X₂) + IE(M) + EA(X) + U_lattice",
    "keys": [
      "born haber cycle",
      "lattice enthalpy",
      "lattice energy",
      "electron affinity",
      "sublimation enthalpy"
    ],
    "symbols": [
      "ΔH_f°: standard heat of formation of ionic solid MX",
      "ΔH_sub: enthalpy of sublimation of metal",
      "D(X₂): bond dissociation energy of halogen",
      "IE: ionisation enthalpy of metal",
      "EA: electron gain enthalpy of halogen (negative)",
      "U_lattice: lattice energy (negative when forming crystal)"
    ],
    "notes": [
      "Kapustinskii and Born–Landé equations give theoretical estimates of U_lattice.",
      "High lattice enthalpy promotes insolubility and high melting points."
    ],
    "example": "For NaCl: ΔH_f° = −411 kJ mol⁻¹. Sublimation = +108, 1/2 D = +121, IE = +496, EA = −349.\n−411 = 108 + 121 + 496 − 349 + U => U = −787 kJ mol⁻¹.",
    "latex": "\\Delta H_f^\\circ = \\Delta H_{\\text{sub}}(\\ce{M}) + \\frac{1}{2}D(\\ce{X2}) + \\text{IE}(\\ce{M}) + \\text{EA}(\\ce{X}) + U_{\\text{lattice}}"
  },
  {
    "id": "carnot_engine_efficiency",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Carnot Engine Maximum Thermal Efficiency",
    "expr": "η = (w_net / q_H) = (T_H − T_C) / T_H = 1 − (T_C / T_H)",
    "keys": [
      "carnot engine",
      "efficiency",
      "second law",
      "heat engine",
      "thermodynamic efficiency"
    ],
    "symbols": [
      "η: efficiency (always < 1 for finite temperatures)",
      "T_H: absolute temperature of hot source (K)",
      "T_C: absolute temperature of cold sink (K)",
      "q_H: heat absorbed from hot reservoir"
    ],
    "notes": [
      "No engine operating between two given temperatures can be more efficient than a reversible Carnot engine.",
      "To reach 100% efficiency, the cold sink must be at absolute zero (T_C = 0 K), which is forbidden by the Third Law."
    ],
    "example": "An engine operates between 600 K and 300 K:\nη = (600 − 300) / 600 = 300 / 600 = 0.50 = 50%.",
    "latex": "\\eta = \\frac{w_{\\text{net}}}{q_H} = \\frac{T_H - T_C}{T_H} = 1 - \\frac{T_C}{T_H}"
  },
  {
    "id": "chemical_potential_definition",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Chemical Potential (μ) & Partial Molar Gibbs Energy",
    "expr": "μ_i = (∂G / ∂n_i)_{T, P, n_j} = μ_i° + R · T · ln a_i",
    "keys": [
      "chemical potential",
      "partial molar gibbs energy",
      "phase equilibrium condition",
      "activity"
    ],
    "symbols": [
      "μ_i: chemical potential of component i",
      "a_i: activity of component i"
    ],
    "notes": [
      "Matter flows spontaneously from regions of HIGHER chemical potential to regions of LOWER chemical potential until chemical potential is uniform throughout (phase equilibrium condition)."
    ],
    "example": "Water flows across a semipermeable membrane until chemical potential of water on both sides is equal.",
    "latex": "\\mu_i = \\left( \\frac{\\partial G}{\\partial n_i} \\right)_{T, P, n_j} = \\mu_i^\\circ + R T \\ln a_i"
  },
  {
    "id": "clapeyron_clausius_equation",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Clausius–Clapeyron Equation for Vapour Pressure",
    "expr": "ln(P₂ / P₁) = (ΔH_vap / R) · [ (T₂ − T₁) / (T₁ T₂) ]",
    "keys": [
      "clausius clapeyron",
      "vapour pressure temperature",
      "boiling point elevation"
    ],
    "symbols": [
      "P: vapour pressure of liquid at temperature T"
    ],
    "notes": [
      "Predicts boiling point at different atmospheric pressures (e.g. pressure cooker vs high altitude)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: ln(P₂ / P₁) = (ΔH_vap / R) · [ (T₂ − T₁) / (T₁ T₂) ]",
    "latex": "\\frac{dP}{dT} = \\frac{\\Delta H}{T \\Delta V}, \\quad \\ln\\frac{P_2}{P_1} = \\frac{\\Delta H_{\\text{vap}}}{R} \\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)"
  },
  {
    "id": "heat_capacity_crystals_einstein_debye",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Debye T³ Law for Low-Temperature Heat Capacity",
    "expr": "C_v = a · T³   (as T → 0 K for non-magnetic non-metallic crystalline solids)",
    "keys": [
      "debye t3 law",
      "low temperature heat capacity",
      "phonon heat capacity"
    ],
    "symbols": [
      "a: constant proportional to (1/Debye temperature)³",
      "T: absolute temperature in Kelvin"
    ],
    "notes": [
      "Explains why atomic heat capacities vanish at absolute zero, obeying Third Law of Thermodynamics."
    ],
    "example": "At 10 K, diamond has negligible heat capacity following the T³ relation.",
    "latex": "C_v = a \\cdot T^3 \\quad (T \\to 0\\text{ K for non-magnetic crystalline solids})"
  },
  {
    "id": "enthalpy_reaction",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Enthalpy and Internal Energy Relation",
    "expr": "ΔH = ΔU + Δn_g RT",
    "keys": [
      "enthalpy",
      "internal energy",
      "delta h",
      "delta u"
    ],
    "symbols": [
      "ΔH: heat change at constant pressure (q_p)",
      "ΔU: heat change at constant volume (q_v)",
      "Δn_g: moles of gaseous products − moles of gaseous reactants"
    ],
    "notes": [
      "If Δn_g = 0 (e.g. H₂ + I₂ ⇌ 2HI), then ΔH = ΔU.",
      "If Δn_g > 0, then ΔH > ΔU.",
      "If Δn_g < 0, then ΔH < ΔU."
    ],
    "example": "N₂(g) + 3H₂(g) → 2NH₃(g) at 298 K:\nΔn_g = 2 − (1 + 3) = −2 mol.\nΔH = ΔU + (−2) × 8.314 × 298 = ΔU − 4955 J.",
    "latex": "\\Delta H = \\Delta U + \\Delta n_g R T"
  },
  {
    "id": "enthalpy_internal_energy_diff",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Enthalpy–Internal Energy Gaseous Reaction Difference",
    "expr": "ΔH − ΔU = Δn_g · R · T",
    "keys": [
      "delta h minus delta u",
      "gaseous moles difference"
    ],
    "symbols": [
      "Δn_g = moles of product gas − moles of reactant gas"
    ],
    "notes": [
      "If Δn_g = 0 (e.g. H₂ + I₂ ⇌ 2HI), ΔH = ΔU at all temperatures."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: ΔH − ΔU = Δn_g · R · T",
    "latex": "\\Delta H - \\Delta U = \\Delta n_g R T"
  },
  {
    "id": "entropy_ideal_gas_expansion",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Entropy Change for Ideal Gas Processes",
    "expr": "ΔS = n C_v ln(T₂ / T₁) + n R ln(V₂ / V₁)   =   n C_p ln(T₂ / T₁) − n R ln(P₂ / P₁)",
    "keys": [
      "entropy change",
      "ideal gas entropy",
      "reversible heating and expansion"
    ],
    "symbols": [
      "ΔS: change in entropy of the gas",
      "C_v, C_p: molar heat capacities at const V and const P"
    ],
    "notes": [
      "Isothermal process (T₁ = T₂): ΔS = n R ln(V₂/V₁) = n R ln(P₁/P₂).",
      "Isochoric process (V₁ = V₂): ΔS = n C_v ln(T₂/T₁).",
      "Isobaric process (P₁ = P₂): ΔS = n C_p ln(T₂/T₁).",
      "Adiabatic reversible process (dq_rev = 0): ΔS = 0 (isentropic)."
    ],
    "example": "1 mol ideal gas expands isothermally to double its volume:\nΔS = 1 × 8.314 × ln 2 = 8.314 × 0.693 ≈ 5.76 J K⁻¹.",
    "latex": "\\Delta S = n C_v \\ln\\left(\\frac{T_2}{T_1}\\right) + n R \\ln\\left(\\frac{V_2}{V_1}\\right) = n C_p \\ln\\left(\\frac{T_2}{T_1}\\right) - n R \\ln\\left(\\frac{P_2}{P_1}\\right)"
  },
  {
    "id": "entropy_change",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Entropy Changes (System and Transitions)",
    "expr": "ΔS = ∫ dq_rev / T   ,   ΔS_ideal = n C_v ln(T₂/T₁) + nR ln(V₂/V₁)",
    "keys": [
      "entropy",
      "second law",
      "entropy of vaporization"
    ],
    "symbols": [
      "ΔS: entropy change (J K⁻¹ mol⁻¹)",
      "Phase transition: ΔS_fusion = ΔH_fus / T_mp, ΔS_vap = ΔH_vap / T_bp"
    ],
    "notes": [
      "Isothermal expansion of ideal gas: ΔS = nR ln(V₂ / V₁) = 2.303 nR log(P₁ / P₂).",
      "Trouton's Rule: for many non-associated liquids, ΔS_vap ≈ 85–88 J K⁻¹ mol⁻¹.",
      "Second Law: ΔS_total = ΔS_sys + ΔS_surr ≥ 0 for any spontaneous process."
    ],
    "example": "1 mol water vaporises at 373 K with ΔH_vap = 40.7 kJ mol⁻¹:\nΔS_vap = 40700 / 373 ≈ 109.1 J K⁻¹ mol⁻¹.",
    "latex": "\\Delta S = \\int \\frac{dq_{\\text{rev}}}{T}, \\quad \\Delta S_{\\text{sys}} = n C_v \\ln\\frac{T_2}{T_1} + n R \\ln\\frac{V_2}{V_1}"
  },
  {
    "id": "entropy_phase_transitions",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Entropy of Phase Transitions & Trouton's Rule",
    "expr": "ΔS_fusion = ΔH_fus / T_mp   |   ΔS_vap = ΔH_vap / T_bp   |   Trouton: ΔS_vap ≈ 88 J K⁻¹ mol⁻¹",
    "keys": [
      "entropy of fusion",
      "entropy of vaporisation",
      "troutons rule",
      "phase equilibrium"
    ],
    "symbols": [
      "T_mp: melting point in Kelvin",
      "T_bp: normal boiling point in Kelvin",
      "ΔH_fus: enthalpy of fusion",
      "ΔH_vap: enthalpy of vaporisation"
    ],
    "notes": [
      "Trouton's rule holds for non-associated liquids (CCl₄, benzene, hexane); it fails for water and ethanol due to hydrogen bonding (ΔS_vap > 88 J K⁻¹ mol⁻¹)."
    ],
    "example": "Water at 373 K (ΔH_vap = 40.66 kJ mol⁻¹ = 40660 J mol⁻¹):\nΔS_vap = 40660 / 373 ≈ 109 J K⁻¹ mol⁻¹ (exceeds Trouton's 88 due to extensive H-bonding).",
    "latex": "\\Delta S_{\\text{fus}} = \\frac{\\Delta H_{\\text{fus}}}{T_{\\text{mp}}} \\quad \\Big| \\quad \\Delta S_{\\text{vap}} = \\frac{\\Delta H_{\\text{vap}}}{T_{\\text{bp}}} \\quad \\Big| \\quad \\text{Trouton: } \\Delta S_{\\text{vap}} \\approx 88\\,\\text{J K}^{-1}\\text{ mol}^{-1}"
  },
  {
    "id": "first_law_work",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "First Law & Expansion Work",
    "expr": "ΔU = q + w   ,   w_rev(iso) = −2.303 nRT log(V₂/V₁)   ,   w_irrev = −P_ext ΔV",
    "keys": [
      "first law",
      "work done",
      "isothermal expansion",
      "reversible work"
    ],
    "symbols": [
      "ΔU: internal energy change",
      "q: heat absorbed by system",
      "w: work done on system (IUPAC convention)",
      "P_ext: external pressure"
    ],
    "notes": [
      "Isothermal expansion of ideal gas: ΔT = 0, so ΔU = 0 and q = −w.",
      "Maximum work is obtained in a reversible expansion.",
      "Free expansion into vacuum: P_ext = 0, so w = 0."
    ],
    "example": "1 mol ideal gas expands isothermally and reversibly from 10 L to 100 L at 300 K:\nw = −2.303 × 1 × 8.314 × 300 × log(10) ≈ −5744 J.",
    "latex": "\\Delta U = q + w, \\quad w_{\\text{rev(iso)}} = -2.303 n R T \\log_{10}\\left(\\frac{V_2}{V_1}\\right), \\quad w_{\\text{irrev}} = -P_{\\text{ext}} \\Delta V"
  },
  {
    "id": "first_law_sign_conventions",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "First Law of Thermodynamics & IUPAC Sign Convention",
    "expr": "ΔU = q + w   |   w = −∫ P_ext dV",
    "keys": [
      "first law thermodynamics",
      "internal energy",
      "heat and work",
      "iupac convention"
    ],
    "symbols": [
      "ΔU: change in internal energy (state function)",
      "q: heat added to system (q > 0 endothermic, q < 0 exothermic)",
      "w: work done on system (w > 0 compression, w < 0 expansion)"
    ],
    "notes": [
      "For cyclic process: ΔU = 0 => q = −w.",
      "For isochoric process (dV = 0): w = 0 => ΔU = q_v.",
      "For adiabatic process (q = 0): ΔU = w_ad."
    ],
    "example": "A system absorbs 500 J of heat and does 200 J of work by expansion:\nq = +500 J, w = −200 J.\nΔU = 500 + (−200) = +300 J.",
    "latex": "\\Delta U = q + w \\quad \\Big| \\quad w = -\\int P_{\\text{ext}} \\, dV"
  },
  {
    "id": "gibbs",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Gibbs energy and spontaneity",
    "expr": "ΔG = ΔH − TΔS",
    "keys": [
      "gibbs",
      "spontaneity",
      "spontaneous"
    ],
    "symbols": [
      "ΔG: change in Gibbs energy (negative means spontaneous)",
      "ΔH: enthalpy change",
      "T: temperature in kelvin",
      "ΔS: entropy change (convert J to kJ, or kJ to J, before combining)"
    ],
    "notes": [
      "ΔH − and ΔS +: spontaneous at all temperatures.",
      "ΔH + and ΔS −: non-spontaneous at all temperatures.",
      "ΔH − and ΔS −: spontaneous at low T.   ΔH + and ΔS +: spontaneous at high T.",
      "At equilibrium ΔG = 0, so T = ΔH/ΔS."
    ],
    "example": "ΔH = +30 kJ mol⁻¹, ΔS = +100 J K⁻¹ mol⁻¹.\nT > ΔH/ΔS = 30 000/100 = 300 K, so it is spontaneous above 300 K.",
    "latex": "\\Delta G = \\Delta H - T \\Delta S"
  },
  {
    "id": "gibbs_free_energy_spontaneity",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Gibbs Free Energy & Spontaneity Criteria",
    "expr": "ΔG = ΔH − T ΔS   |   ΔG < 0: Spontaneous   |   ΔG = 0: Equilibrium   |   ΔG > 0: Non-spontaneous",
    "keys": [
      "gibbs free energy",
      "spontaneity",
      "delta g",
      "equilibrium condition"
    ],
    "symbols": [
      "ΔG: change in Gibbs free energy at constant T and P",
      "T: absolute temperature (Kelvin)",
      "ΔH: enthalpy change",
      "ΔS: entropy change of the system"
    ],
    "notes": [
      "ΔH < 0, ΔS > 0: spontaneous at ALL temperatures.",
      "ΔH > 0, ΔS < 0: non-spontaneous at ALL temperatures.",
      "ΔH > 0, ΔS > 0: spontaneous at HIGH temperatures (T > ΔH/ΔS).",
      "ΔH < 0, ΔS < 0: spontaneous at LOW temperatures (T < ΔH/ΔS)."
    ],
    "example": "For a reaction with ΔH = +30 kJ mol⁻¹ and ΔS = +100 J K⁻¹ mol⁻¹:\nT_eq = ΔH / ΔS = 30000 / 100 = 300 K. The reaction becomes spontaneous when T > 300 K.",
    "latex": "\\Delta G = \\Delta H - T \\Delta S \\quad \\Big| \\quad \\Delta G < 0 \\; (\\text{spontaneous}) \\quad \\Big| \\quad \\Delta G = 0 \\; (\\text{equilibrium}) \\quad \\Big| \\quad \\Delta G > 0 \\; (\\text{non-spontaneous})"
  },
  {
    "id": "gibbs_duhem_equation",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Gibbs–Duhem Fundamental Equation",
    "expr": "Σ n_i · dμ_i = 0   (at constant T and P)   =>   x_A · dμ_A + x_B · dμ_B = 0",
    "keys": [
      "gibbs duhem equation",
      "chemical potential relation",
      "binary mixture thermodynamics"
    ],
    "symbols": [
      "n_i: moles of component i",
      "dμ_i: change in chemical potential",
      "x_A, x_B: mole fractions in binary solution"
    ],
    "notes": [
      "Proves that the chemical potentials of components in a mixture cannot vary independently; if μ_A increases, μ_B must decrease."
    ],
    "example": "Provides theoretical basis for consistency checks in vapour-liquid equilibrium data.",
    "latex": "\\sum n_i \\, d\\mu_i = 0 \\; (T, P \\text{ const}) \\implies x_A \\, d\\mu_A + x_B \\, d\\mu_B = 0"
  },
  {
    "id": "gibbs_helmholtz_differential",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Gibbs–Helmholtz Equation Differential Form",
    "expr": "[ ∂(ΔG / T) / ∂T ]_P = −ΔH / T²",
    "keys": [
      "gibbs helmholtz differential",
      "temperature dependence delta g"
    ],
    "symbols": [
      "Fundamental thermodynamic relation"
    ],
    "notes": [
      "Links temperature dependence of Gibbs energy directly to reaction enthalpy."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: [ ∂(ΔG / T) / ∂T ]_P = −ΔH / T²",
    "latex": "\\left[ \\frac{\\partial(\\Delta G / T)}{\\partial T} \\right]_P = -\\frac{\\Delta H}{T^2}"
  },
  {
    "id": "heat_capacities",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Heat Capacities & Poisson's Ratio",
    "expr": "C_p − C_v = R   ,   γ = C_p / C_v   ,   ΔU = n C_v ΔT   ,   ΔH = n C_p ΔT",
    "keys": [
      "heat capacity",
      "gamma",
      "molar heat capacity",
      "meyer relation"
    ],
    "symbols": [
      "C_p, C_v: molar heat capacities at constant P and V",
      "γ: adiabatic index (monoatomic = 5/3 ≈ 1.67, diatomic = 7/5 = 1.40, non-linear triatomic = 4/3 ≈ 1.33)"
    ],
    "notes": [
      "Monoatomic gas (He, Ne, Ar): C_v = 3/2 R, C_p = 5/2 R.",
      "Diatomic gas (N₂, O₂) at room temp: C_v = 5/2 R, C_p = 7/2 R.",
      "Reversible adiabatic process: P V^γ = const, T V^(γ−1) = const, T^γ P^(1−γ) = const."
    ],
    "example": "Work in reversible adiabatic expansion: w = n C_v (T₂ − T₁) = (P₂V₂ − P₁V₁) / (γ − 1).",
    "latex": "C_p - C_v = R, \\quad \\gamma = \\frac{C_p}{C_v}, \\quad \\Delta U = n C_v \\Delta T, \\quad \\Delta H = n C_p \\Delta T"
  },
  {
    "id": "hess_law",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Hess's Law & Bond Energies",
    "expr": "ΔH_rxn = Σ ΔH_f°(products) − Σ ΔH_f°(reactants) = Σ B.E.(reactants) − Σ B.E.(products)",
    "keys": [
      "hess law",
      "bond energy",
      "heat of formation"
    ],
    "symbols": [
      "ΔH_f°: standard enthalpy of formation (defined as 0 for pure elements in standard state)",
      "B.E.: bond dissociation enthalpy"
    ],
    "notes": [
      "Resonance Energy = Observed ΔH_f° (or ΔH_comb) − Calculated ΔH_f°.",
      "Lattice Enthalpy (Born-Haber cycle): ΔH_f°(NaCl) = ΔH_sub(Na) + ½ D(Cl₂) + IE(Na) − EA(Cl) + U_L."
    ],
    "example": "For CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l):\nΔH_rxn = [ΔH_f°(CO₂) + 2ΔH_f°(H₂O)] − [ΔH_f°(CH₄) + 0].",
    "latex": "\\Delta H_{\\text{rxn}} = \\sum \\Delta H_f^\\circ(\\text{products}) - \\sum \\Delta H_f^\\circ(\\text{reactants}) = \\sum \\text{B.E.}(\\text{reactants}) - \\sum \\text{B.E.}(\\text{products})"
  },
  {
    "id": "hess_law_summation",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Hess's Law of Constant Heat Summation",
    "expr": "ΔH_reaction = Σ ΔH_f°(products) − Σ ΔH_f°(reactants)   =   Σ BE(reactants) − Σ BE(products)",
    "keys": [
      "hess law",
      "enthalpy of formation",
      "bond energy calculation",
      "state function enthalpy"
    ],
    "symbols": [
      "ΔH_f°: standard enthalpy of formation (defined as 0 for elements in standard states: O₂(g), C(graphite), Br₂(l), H₂(g))",
      "BE: bond dissociation energy (gaseous state only)"
    ],
    "notes": [
      "When using bond enthalpies, all reactants and products must be in the GASEOUS state; add enthalpies of atomisation/vaporisation if needed."
    ],
    "example": "Combustion of CH₄: CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l).\nΔH° = [ΔH_f°(CO₂) + 2ΔH_f°(H₂O)] − [ΔH_f°(CH₄) + 2(0)].",
    "latex": "\\Delta H_{\\text{reaction}} = \\sum \\Delta H_f^\\circ(\\text{products}) - \\sum \\Delta H_f^\\circ(\\text{reactants}) = \\sum \\text{BE}(\\text{reactants}) - \\sum \\text{BE}(\\text{products})"
  },
  {
    "id": "joule_thomson_coefficient",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Joule–Thomson Coefficient & Isenthalpic Expansion",
    "expr": "μ_JT = (∂T / ∂P)_H = (1 / C_p) · [ T · (∂V / ∂T)_P − V ]   |   Ideal gas: μ_JT = 0",
    "keys": [
      "joule thomson coefficient",
      "isenthalpic process",
      "throttling process",
      "inversion temperature"
    ],
    "symbols": [
      "μ_JT > 0: gas cools upon expansion (P drops, T drops)",
      "μ_JT < 0: gas heats upon expansion",
      "μ_JT = 0: inversion temperature T_i = 2a / (Rb)"
    ],
    "notes": [
      "For an ideal gas, T(∂V/∂T)_P − V = 0, so μ_JT = 0 (no temperature change on expansion).",
      "H₂ and He have very low T_i (193 K and 40 K); at room temperature, they warm up on expansion through a throttle."
    ],
    "example": "Linde process liquefies air by repeated Joule–Thomson expansions below its inversion temperature.",
    "latex": "\\mu_{\\text{JT}} = \\left( \\frac{\\partial T}{\\partial P} \\right)_H = \\frac{1}{C_p} \\left[ T \\left( \\frac{\\partial V}{\\partial T} \\right)_P - V \\right]"
  },
  {
    "id": "kirchhoff_thermochemistry",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Kirchhoff's Law of Reaction Enthalpy with Temperature",
    "expr": "ΔH_T2 − ΔH_T1 = ΔC_p · (T₂ − T₁)   |   ΔU_T2 − ΔU_T1 = ΔC_v · (T₂ − T₁)",
    "keys": [
      "kirchhoffs law",
      "enthalpy temperature dependence",
      "heat capacity change",
      "delta cp"
    ],
    "symbols": [
      "ΔC_p = Σ C_p(products) − Σ C_p(reactants)",
      "ΔH_T: standard reaction enthalpy at temperature T"
    ],
    "notes": [
      "If ΔC_p = 0, reaction enthalpy is independent of temperature.",
      "If C_p varies with temperature as C_p = a + bT, integrate: ΔH_T2 − ΔH_T1 = ∫ ΔC_p dT."
    ],
    "example": "N₂ + 3H₂ → 2NH₃ has ΔH₂₉₈ = −92.2 kJ. If ΔC_p = −40 J K⁻¹:\nAt 398 K (ΔT = 100 K): ΔH₃₉₈ = −92200 + (−40 × 100) = −96200 J = −96.2 kJ.",
    "latex": "\\Delta H_{T_2} - \\Delta H_{T_1} = \\Delta C_p (T_2 - T_1) \\quad \\Big| \\quad \\Delta U_{T_2} - \\Delta U_{T_1} = \\Delta C_v (T_2 - T_1)"
  },
  {
    "id": "kirchhoff_law",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Kirchhoff's Law of Thermochemistry",
    "expr": "ΔH(T₂) − ΔH(T₁) = ΔC_p (T₂ − T₁)   ,   ΔU(T₂) − ΔU(T₁) = ΔC_v (T₂ − T₁)",
    "keys": [
      "kirchhoff",
      "variation of enthalpy with temperature"
    ],
    "symbols": [
      "ΔC_p = Σ C_p(products) − Σ C_p(reactants)"
    ],
    "notes": [
      "Allows calculating reaction enthalpy at any temperature given ΔH° at 298 K.",
      "Ensure C_p values are in J K⁻¹ mol⁻¹ and match stoichiometry."
    ],
    "example": "If ΔC_p = −10 J K⁻¹ mol⁻¹, heating the reaction by 50 K decreases ΔH by:\nΔH(T₂) − ΔH(T₁) = −10 × 50 = −500 J.",
    "latex": "\\Delta H(T_2) - \\Delta H(T_1) = \\Delta C_p (T_2 - T_1), \\quad \\Delta U(T_2) - \\Delta U(T_1) = \\Delta C_v (T_2 - T_1)"
  },
  {
    "id": "maxwell_thermodynamic_relations",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Maxwell's Fundamental Thermodynamic Relations",
    "expr": "(∂T/∂V)_S = −(∂P/∂S)_V   |   (∂T/∂P)_S = (∂V/∂S)_P   |   (∂S/∂V)_T = (∂P/∂T)_V   |   (∂S/∂P)_T = −(∂V/∂T)_P",
    "keys": [
      "maxwell relations",
      "thermodynamic potentials",
      "state functions partial derivatives"
    ],
    "symbols": [
      "Derived from exact differentials of thermodynamic potentials:",
      "dU = T dS − P dV",
      "dH = T dS + V dP",
      "dA = −S dT − P dV (Helmholtz)",
      "dG = −S dT + V dP (Gibbs)"
    ],
    "notes": [
      "Allows unmeasurable quantities like (∂S/∂P)_T to be calculated from easily measurable equation-of-state variables like thermal expansion (∂V/∂T)_P."
    ],
    "example": "From dG: (∂G/∂P)_T = V and (∂G/∂T)_P = −S. Taking cross-derivatives proves (∂S/∂P)_T = −(∂V/∂T)_P.",
    "latex": "\\left(\\frac{\\partial T}{\\partial V}\\right)_S = -\\left(\\frac{\\partial P}{\\partial S}\\right)_V \\quad \\Big| \\quad \\left(\\frac{\\partial T}{\\partial P}\\right)_S = \\left(\\frac{\\partial V}{\\partial S}\\right)_P \\quad \\Big| \\quad \\left(\\frac{\\partial S}{\\partial V}\\right)_T = \\left(\\frac{\\partial P}{\\partial T}\\right)_V \\quad \\Big| \\quad \\left(\\frac{\\partial S}{\\partial P}\\right)_T = -\\left(\\frac{\\partial V}{\\partial T}\\right)_P"
  },
  {
    "id": "heat_capacities_difference",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Mayer's Relation Between Cp and Cv",
    "expr": "C_p − C_v = R   |   γ = C_p / C_v = 1 + (2 / f)",
    "keys": [
      "mayers relation",
      "cp minus cv",
      "degrees of freedom f"
    ],
    "symbols": [
      "f = 3 (monoatomic): Cv = 3/2 R, Cp = 5/2 R, γ = 1.67",
      "f = 5 (diatomic): Cv = 5/2 R, Cp = 7/2 R, γ = 1.40"
    ],
    "notes": [
      "Non-linear triatomic (H₂O): f = 6, Cv = 3R, Cp = 4R, γ = 1.33."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: C_p − C_v = R   |   γ = C_p / C_v = 1 + (2 / f)",
    "latex": "C_p - C_v = R \\quad \\Big| \\quad \\gamma = \\frac{C_p}{C_v} = 1 + \\frac{2}{f}"
  },
  {
    "id": "third_law_thermodynamics",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Third Law of Thermodynamics & Absolute Entropy",
    "expr": "lim(T→0 K) S = 0   (for a perfectly crystalline substance)",
    "keys": [
      "third law thermodynamics",
      "absolute entropy",
      "residual entropy"
    ],
    "symbols": [
      "S_T = ∫₀^T (C_p / T) dT"
    ],
    "notes": [
      "CO, N₂O, NO have residual entropy at 0 K due to random molecular orientations in crystal lattice."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: lim(T→0 K) S = 0   (for a perfectly crystalline substance)",
    "latex": "\\lim_{T \\to 0\\text{ K}} S = 0 \\quad (\\text{for a perfectly crystalline substance})"
  },
  {
    "id": "vant_hoff_isotherm_isobar",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "van 't Hoff Reaction Isotherm & Isobar",
    "expr": "Isotherm: ΔG° = −RT ln K_eq   |   Isobar: ln(K₂ / K₁) = (ΔH° / R) · [ 1/T₁ − 1/T₂ ]",
    "keys": [
      "vant hoff isotherm",
      "vant hoff isobar",
      "equilibrium constant temperature",
      "delta g standard"
    ],
    "symbols": [
      "K_eq: thermodynamic equilibrium constant (dimensionless, based on activities)",
      "ΔH°: standard reaction enthalpy",
      "R = 8.314 J K⁻¹ mol⁻¹"
    ],
    "notes": [
      "For endothermic reactions (ΔH° > 0): K increases with temperature.",
      "For exothermic reactions (ΔH° < 0): K decreases with temperature.",
      "Slope of ln K vs 1/T plot is −ΔH°/R."
    ],
    "example": "If K = 1.0 at 300 K and ΔH° = +57.4 kJ mol⁻¹:\nAt 310 K: ln(K₂/1) = (57400/8.314) × [10/(300×310)] ≈ 6904 × 0.0001075 = 0.742 => K₂ ≈ 2.10.",
    "latex": "\\Delta G^\\circ = -R T \\ln K_{\\text{eq}}, \\quad \\ln\\frac{K_2}{K_1} = \\frac{\\Delta H^\\circ}{R}\\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)"
  },
  {
    "id": "adiabatic_work_formula",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Work Done in Reversible Adiabatic Process",
    "expr": "w_ad = ΔU = n C_v (T₂ − T₁) = (P₂ V₂ − P₁ V₁) / (γ − 1) = n R (T₂ − T₁) / (γ − 1)",
    "keys": [
      "adiabatic work",
      "temperature change adiabatic",
      "pv work adiabatic"
    ],
    "symbols": [
      "w_ad: work done in adiabatic process (since q = 0)",
      "C_v: molar heat capacity at constant volume = R / (γ − 1)"
    ],
    "notes": [
      "For an irreversible adiabatic expansion against P_ext: n C_v (T₂ − T₁) = −P_ext (V₂ − V₁). Use this to find final T₂."
    ],
    "example": "2 mol of diatomic gas (C_v = 5/2 R, γ = 1.4) cools from 400 K to 300 K adiabatically:\nw = 2 × (5/2 × 8.314) × (300 − 400) = 5 × 8.314 × (−100) = −4157 J = −4.16 kJ.",
    "latex": "w_{\\text{ad}} = \\Delta U = n C_v (T_2 - T_1) = \\frac{P_2 V_2 - P_1 V_1}{\\gamma - 1} = \\frac{n R (T_2 - T_1)}{\\gamma - 1}"
  },
  {
    "id": "isothermal_reversible_work",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "Work in Isothermal Reversible Expansion",
    "expr": "w_rev = −2.303 n R T log(V₂ / V₁) = −2.303 n R T log(P₁ / P₂)",
    "keys": [
      "isothermal work",
      "reversible expansion",
      "maximum work",
      "pv work"
    ],
    "symbols": [
      "w_rev: maximum work obtained from isothermal expansion",
      "n: moles of ideal gas",
      "R = 8.314 J K⁻¹ mol⁻¹",
      "T: constant absolute temperature",
      "V₁, V₂: initial and final volumes"
    ],
    "notes": [
      "For isothermal expansion of an ideal gas, ΔT = 0 => ΔU = 0, so q_rev = −w_rev = +2.303 nRT log(V₂/V₁).",
      "Reversible expansion work is always greater in magnitude than irreversible expansion work."
    ],
    "example": "1 mol ideal gas expands reversibly at 300 K from 10 L to 100 L:\nw = −2.303 × 1 × 8.314 × 300 × log(100/10) = −5744 × 1 = −5744 J = −5.744 kJ.",
    "latex": "w_{\\text{rev}} = -2.303 n R T \\log_{10}\\left(\\frac{V_2}{V_1}\\right) = -2.303 n R T \\log_{10}\\left(\\frac{P_1}{P_2}\\right)"
  },
  {
    "id": "gibbsk",
    "branch": "Physical",
    "chapter": "Thermodynamics",
    "title": "ΔG° and the equilibrium constant",
    "expr": "ΔG° = −RT ln K = −2.303 RT log K = −nFE°",
    "keys": [
      "equilibrium constant",
      "standard gibbs"
    ],
    "symbols": [
      "ΔG°: standard Gibbs energy change",
      "K: thermodynamic equilibrium constant",
      "E°: standard cell potential, n and F as in the Nernst equation"
    ],
    "notes": [
      "ΔG° < 0 means K > 1; ΔG° > 0 means K < 1.",
      "ΔG° tells you about K, while ΔG (not ΔG°) decides spontaneity under non-standard conditions.",
      "Use R = 8.314 J K⁻¹ mol⁻¹ so ΔG° comes out in J mol⁻¹."
    ],
    "latex": "\\Delta G^\\circ = -R T \\ln K = -2.303 R T \\log_{10} K = -n F E^\\circ"
  },
  {
    "id": "clapeyron_clausius",
    "branch": "Physical",
    "chapter": "Thermodynamics & Equilibrium",
    "title": "Clausius–Clapeyron Equation",
    "expr": "log (P₂ / P₁) = (ΔH_vap / 2.303 R) · (1/T₁ − 1/T₂)",
    "keys": [
      "clausius",
      "clapeyron",
      "vapour pressure temperature"
    ],
    "symbols": [
      "P₁, P₂: vapour pressures at temperatures T₁ and T₂ (kelvin)",
      "ΔH_vap: enthalpy of vaporisation (J mol⁻¹)",
      "R = 8.314 J K⁻¹ mol⁻¹"
    ],
    "notes": [
      "Gives the temperature dependence of vapour pressure or boiling point.",
      "Analogous to the van 't Hoff equation for equilibrium constants."
    ],
    "example": "Water boils at 373 K at 1 atm. At a mountain summit where P = 0.5 atm, its boiling point drops significantly.",
    "latex": "\\log_{10}\\left(\\frac{P_2}{P_1}\\right) = \\frac{\\Delta H_{\\text{vap}}}{2.303 R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)"
  },
  {
    "id": "formalcharge",
    "branch": "Inorganic",
    "chapter": "Chemical bonding",
    "title": "Formal charge",
    "expr": "FC = V − N − B/2",
    "keys": [
      "formal charge"
    ],
    "symbols": [
      "V: valence electrons of the free atom",
      "N: non-bonding (lone-pair) electrons",
      "B: bonding electrons (shared)"
    ],
    "notes": [
      "The best Lewis structure has formal charges closest to zero, with negative charge on the more electronegative atom."
    ],
    "latex": "\\text{FC} = V - L - \\frac{1}{2} B"
  },
  {
    "id": "hybrid",
    "branch": "Inorganic",
    "chapter": "Chemical bonding",
    "title": "Hybridisation number",
    "expr": "H = ½ (V + M − C + A)",
    "keys": [
      "hybridisation number",
      "hybridization number"
    ],
    "symbols": [
      "V: valence electrons of the central atom",
      "M: number of monovalent atoms attached",
      "C: cation charge, A: anion charge"
    ],
    "notes": [
      "H = 2 sp, 3 sp², 4 sp³, 5 sp³d, 6 sp³d², 7 sp³d³.",
      "Use it for simple molecules and ions with monovalent ligands only."
    ],
    "example": "SF₄: V = 6, M = 4, so H = ½(6 + 4) = 5, which is sp³d (see-saw).\nXeF₄: V = 8, M = 4, so H = 6, which is sp³d² (square planar).\nNH₄⁺: ½(5 + 4 − 1) = 4, which is sp³.",
    "latex": "H = \\frac{1}{2}(V + M - C + A)"
  },
  {
    "id": "bents_rule_orbital_character",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Bent's Rule & Hybrid Orbital s/p-Character",
    "expr": "More electronegative substituents prefer hybrid orbitals having LESS s-character (MORE p-character)",
    "keys": [
      "bents rule",
      "s character",
      "bond angles",
      "axial equatorial bonds",
      "pcl5 sf4"
    ],
    "symbols": [
      "cos θ = −s / (1 − s) = (p − 1) / p: relation between bond angle θ and s-fraction in hybrid orbital"
    ],
    "notes": [
      "Lone pairs and electropositive groups prefer orbitals with GREATER s-character.",
      "In PCl₃F₂ (trigonal bipyramidal, sp³d): the more electronegative F atoms occupy AXIAL positions (pure dp-hybridization, 0% s), while Cl atoms occupy EQUATORIAL positions (sp²-hybridization, 33% s)."
    ],
    "example": "In CH₂F₂, the F–C–F angle is smaller than tetrahedral (108.3°) because C–F bonds use more p-character, leaving more s-character for C–H bonds (H–C–H angle = 111.9°).",
    "latex": "\\text{Bent's Rule: More electronegative substituents prefer hybrid orbitals having LESS } s\\text{-character (MORE } p\\text{-character)}"
  },
  {
    "id": "born_lande",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Born–Landé Lattice Energy Equation",
    "expr": "U₀ = − (N_A · M · z₊ · z₋ · e²) / (4πε₀ r₀) · (1 − 1/n)",
    "keys": [
      "born lande",
      "lattice energy",
      "madelung constant",
      "born-lande"
    ],
    "symbols": [
      "U₀: lattice energy of ionic crystal (negative means exothermic lattice formation)",
      "N_A: Avogadro constant",
      "M: Madelung constant (depends on crystal geometry: 1.748 for NaCl, 1.763 for CsCl)",
      "z₊, z₋: charges on ions",
      "r₀ = r₊ + r₋: interionic equilibrium distance",
      "n: Born exponent (typically 7–10)"
    ],
    "notes": [
      "Kapustinskii equation (no crystal geometry needed): U₀ = − (1202.5 · ν · z₊ · z₋) / (r₊ + r₋) · [1 − 34.5 / (r₊ + r₋)] kJ mol⁻¹.",
      "Lattice energy increases directly with ionic charges (z₊ z₋) and inversely with ion size (r₊ + r₋)."
    ],
    "example": "Lattice energy order: MgO (z₊z₋ = 4) >> NaCl (z₊z₋ = 1). MgO has much higher melting point (2852 °C vs 801 °C).",
    "latex": "U_0 = -\\frac{N_A M z_+ z_- e^2}{4\\pi\\varepsilon_0 r_0} \\left( 1 - \\frac{1}{n} \\right)"
  },
  {
    "id": "dipole_ionic",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Dipole Moment & % Ionic Character",
    "expr": "μ = q × d   ,   % Ionic Character = (μ_obs / μ_theo) × 100 = 16 |Δχ| + 3.5 |Δχ|²",
    "keys": [
      "dipole moment",
      "ionic character",
      "hannay smith"
    ],
    "symbols": [
      "μ: dipole moment (1 Debye = 10⁻¹⁸ esu cm = 3.336 × 10⁻³⁰ C m)",
      "q: partial charge",
      "d: bond distance",
      "Δχ = |χ_A − χ_B|: electronegativity difference (Hannay–Smith equation)"
    ],
    "notes": [
      "Symmetrical molecules (CO₂, BF₃, CCl₄, SF₆, trans-alkenes) have vector sum μ_net = 0.",
      "Lone pairs contribute strongly to dipole moment (e.g. NH₃ has μ = 1.47 D, while NF₃ has only 0.24 D because N–F bond dipoles oppose the lone pair)."
    ],
    "example": "HCl has observed μ = 1.03 D and bond length d = 1.27 Å:\nTheoretical 100% ionic μ = 4.8 × 10⁻¹⁰ esu × 1.27 × 10⁻⁸ cm = 6.10 D.\n% Ionic character = (1.03 / 6.10) × 100 ≈ 16.9%.",
    "latex": "\\mu = q \\times d, \\quad \\text{\\% Ionic} = 16|\\Delta\\chi| + 3.5(\\Delta\\chi)^2"
  },
  {
    "id": "dipole_moment_nh3_nf3",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Dipole Moment Comparison: NH₃ vs NF₃",
    "expr": "μ(NH₃) = 1.47 D   >>   μ(NF₃) = 0.24 D",
    "keys": [
      "nh3 vs nf3 dipole moment",
      "lone pair dipole",
      "vector cancellation"
    ],
    "symbols": [
      "In NH₃: orbital dipole of lone pair points in SAME direction as resultant of N–H bond dipoles (additive)",
      "In NF₃: highly electronegative F atoms pull dipole away, OPPOSING the lone pair dipole (subtractive)"
    ],
    "notes": [
      "Classic JEE favourite testing vector addition in chemistry."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: μ(NH₃) = 1.47 D   >>   μ(NF₃) = 0.24 D",
    "latex": "\\mu(\\ce{NH3}) = 1.47\\text{ D} \\gg \\mu(\\ce{NF3}) = 0.24\\text{ D}"
  },
  {
    "id": "electronegativity_scales",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Electronegativity Scales (Pauling & Mulliken)",
    "expr": "Pauling: |χ_A − χ_B| = 0.208 √(Δ) (kcal) = 0.102 √(Δ) (kJ)   |   Mulliken: χ_M = (IE + EA) / 2",
    "keys": [
      "electronegativity",
      "pauling",
      "mulliken",
      "allred rochow"
    ],
    "symbols": [
      "Δ = E_AB − √(E_AA × E_BB): resonance ionic resonance energy",
      "IE, EA: ionisation energy and electron affinity in eV"
    ],
    "notes": [
      "Conversion: χ_Pauling ≈ χ_Mulliken / 2.8 (when IE and EA are in eV).",
      "Allred–Rochow scale: χ_AR = 0.359 (Z* / r²) + 0.744 (electrostatic attraction at covalent radius).",
      "Fluorine has the highest Pauling electronegativity: 4.0."
    ],
    "example": "If IE = 12.0 eV and EA = 2.0 eV:\nχ_Mulliken = (12.0 + 2.0) / 2 = 7.0  =>  χ_Pauling ≈ 7.0 / 2.8 = 2.5.",
    "latex": "\\text{Pauling: } |\\chi_A - \\chi_B| = 0.208\\sqrt{\\Delta} \\; (\\text{kcal}) = 0.102\\sqrt{\\Delta} \\; (\\text{kJ}) \\quad \\Big| \\quad \\text{Mulliken: } \\chi_M = \\frac{\\text{IE} + \\text{EA}}{2}"
  },
  {
    "id": "fajans_rules_covalency",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Fajan's Rules for Covalent Character in Ionic Compounds",
    "expr": "Polarising Power of Cation ϕ = (Charge) / (Radius)   |   Covalency ∝ ϕ · (Polarisability of Anion)",
    "keys": [
      "fajans rules",
      "covalent character in ionic",
      "polarising power",
      "pseudo inert gas"
    ],
    "symbols": [
      "ϕ: ionic potential",
      "High covalent character favoured by: Small cation, Large anion, High charge on both, and Pseudo-noble gas configuration (18 e⁻ valence shell: Cu⁺, Ag⁺)"
    ],
    "notes": [
      "CuCl is far more covalent and less soluble than NaCl because Cu⁺ (3s² 3p⁶ 3d¹⁰) has higher polarising power than Na⁺ (2s² 2p⁶) due to poor 3d shielding.",
      "Higher covalent character lowers melting points and increases solubility in organic solvents."
    ],
    "example": "Melting point order: BeCl₂ (405 °C) < MgCl₂ (714 °C) < CaCl₂ (782 °C) < BaCl₂ (963 °C) because Be²⁺ is smallest, having highest polarising power and covalency.",
    "latex": "\\text{Polarising Power } \\phi = \\frac{\\text{Cation Charge}}{\\text{Cation Radius}}, \\quad \\text{Covalency} \\propto \\phi \\cdot (\\text{Anion Polarisability})"
  },
  {
    "id": "formal_charge_formula",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Formal Charge Calculation on Lewis Structures",
    "expr": "FC = V − L − (B / 2)",
    "keys": [
      "formal charge",
      "lewis structure",
      "resonance structures stability"
    ],
    "symbols": [
      "V: valence electrons in free isolated atom",
      "L: total non-bonding (lone pair) electrons",
      "B: total bonding (shared) electrons (each single bond counts as 2)"
    ],
    "notes": [
      "The most stable Lewis structure has formal charges closest to zero, with negative formal charges residing on the most electronegative atoms.",
      "Sum of formal charges on all atoms in an ion equals the ion's overall charge."
    ],
    "example": "Central oxygen in ozone O₃ (one double bond, one coordinate single bond, one lone pair):\nV = 6, L = 2, B = 6.\nFC = 6 − 2 − (6 / 2) = 6 − 2 − 3 = +1.",
    "latex": "\\text{FC} = V - L - \\frac{1}{2} B"
  },
  {
    "id": "hannay_smith_percent_ionic",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Hannay–Smith Equation for Percentage Ionic Character",
    "expr": "% Ionic Character = 16 |χ_A − χ_B| + 3.5 (χ_A − χ_B)²",
    "keys": [
      "percentage ionic character",
      "hannay smith",
      "dipole moment ionic character",
      "electronegativity difference"
    ],
    "symbols": [
      "|χ_A − χ_B| = Δχ: absolute difference in Pauling electronegativities between bonded atoms"
    ],
    "notes": [
      "When Δχ = 1.7, % ionic character is approximately 50%. Bonds with Δχ > 1.7 are predominantly ionic; Δχ < 1.7 are predominantly covalent.",
      "Alternative from dipole moment: % Ionic Character = (μ_observed / μ_theoretical) × 100, where μ_theor = q × d."
    ],
    "example": "For HF (χ_F = 4.0, χ_H = 2.1, Δχ = 1.9):\n% Ionic = 16(1.9) + 3.5(1.9)² = 30.4 + 3.5(3.61) = 30.4 + 12.6 = 43%.",
    "latex": "\\text{\\% Ionic} = 16|\\chi_A - \\chi_B| + 3.5(\\chi_A - \\chi_B)^2"
  },
  {
    "id": "hydrogen_bonding_boiling_points",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Hydrogen Bonding & Anomalous Hydride Boiling Points",
    "expr": "Boiling Points: H₂O (100 °C) >> H₂Te (−2 °C) > H₂Se (−41 °C) > H₂S (−60 °C)",
    "keys": [
      "hydrogen bonding boiling point",
      "h2o vs h2s",
      "hf vs hcl"
    ],
    "symbols": [
      "Strong intermolecular H-bonds present in H₂O, HF, and NH₃"
    ],
    "notes": [
      "H₂O has 2 H and 2 lone pairs per molecule, forming a 3D network with 4 H-bonds per molecule (higher bp than HF with only 2)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Boiling Points: H₂O (100 °C) >> H₂Te (−2 °C) > H₂Se (−41 °C) > H₂S (−60 °C)",
    "latex": "\\text{Boiling Points: } \\ce{H2O (100^\\circ C) \\gg H2Te (-2^\\circ C) > H2Se (-41^\\circ C) > H2S (-60^\\circ C)}"
  },
  {
    "id": "dipole_moment_geometry_vector",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Molecular Dipole Moment Vector Addition",
    "expr": "μ_net = √[ μ₁² + μ₂² + 2 μ₁ μ₂ cos θ ]",
    "keys": [
      "dipole moment vector",
      "debye",
      "polar nonpolar geometry"
    ],
    "symbols": [
      "1 Debye = 10⁻¹⁸ esu cm = 3.336 × 10⁻³⁰ C m"
    ],
    "notes": [
      "Symmetric molecules (CO₂, BF₃, CCl₄, trans-dichloroethene) have μ_net = 0."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: μ_net = √[ μ₁² + μ₂² + 2 μ₁ μ₂ cos θ ]",
    "latex": "\\mu_{\\text{net}} = \\sqrt{\\mu_1^2 + \\mu_2^2 + 2\\mu_1 \\mu_2 \\cos\\theta}"
  },
  {
    "id": "mot_bond_order_formula",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Molecular Orbital Theory (MOT) Bond Order & Magnetism",
    "expr": "Bond Order = ½ (N_b − N_a)   |   Magnetic Moment μ = √[ n(n + 2) ] BM",
    "keys": [
      "mot bond order",
      "molecular orbital theory",
      "paramagnetic diamagnetic",
      "o2 n2 bond order"
    ],
    "symbols": [
      "N_b: number of electrons in bonding molecular orbitals (σ, π)",
      "N_a: number of electrons in antibonding molecular orbitals (σ*, π*)",
      "n: number of unpaired electrons"
    ],
    "notes": [
      "For ≤ 14 electrons (B₂, C₂, N₂): π2p_x = π2p_y < σ2p_z < π*2p_x = π*2p_y < σ*2p_z.",
      "For > 14 electrons (O₂, F₂): σ2p_z < π2p_x = π2p_y < π*2p_x = π*2p_y < σ*2p_z.",
      "Bond order ∝ 1 / Bond length ∝ Bond dissociation energy."
    ],
    "example": "For O₂ (16 electrons): N_b = 10, N_a = 6.\nBond Order = ½(10 − 6) = 2.0. Two unpaired electrons in π*2p_x and π*2p_y => Paramagnetic (μ = √8 ≈ 2.83 BM).",
    "latex": "\\text{Bond Order} = \\frac{N_b - N_a}{2}, \\quad \\mu = \\sqrt{n(n + 2)}\\,\\mu_B"
  },
  {
    "id": "back_bonding_lewis_acidity",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "pπ–pπ Back Bonding & Boron Trihalide Lewis Acidity",
    "expr": "Lewis Acidity Order: BF₃ < BCl₃ < BBr₃ < BI₃",
    "keys": [
      "back bonding",
      "boron trihalides lewis acid",
      "ppi ppi overlap"
    ],
    "symbols": [
      "In BF₃, 2p(F) overlaps efficiently with empty 2p(B), partially satisfying electron deficiency",
      "In BCl₃/BBr₃/BI₃, 3p/4p/5p orbitals are larger, overlap poorly with 2p(B), leaving B more electron deficient"
    ],
    "notes": [
      "Counterintuitive trend: BI₃ is the STRONGEST Lewis acid."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Lewis Acidity Order: BF₃ < BCl₃ < BBr₃ < BI₃",
    "latex": "\\text{Lewis Acidity Order: } \\ce{BF3 < BCl3 < BBr3 < BI3} \\; (2p\\pi\\text{--}2p\\pi \\text{ back-bonding in } \\ce{BF3})"
  },
  {
    "id": "hybrid_vsepr",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Steric Number & Hybridisation Formula",
    "expr": "H = ½ (V + M − C + A)   ,   Steric Number = (Bond Pairs) + (Lone Pairs)",
    "keys": [
      "steric number",
      "hybridisation",
      "vsepr shape",
      "lone pairs"
    ],
    "symbols": [
      "V: valence electrons of central atom",
      "M: monovalent atoms attached (H, F, Cl, Br, I)",
      "C: cationic positive charge",
      "A: anionic negative charge"
    ],
    "notes": [
      "H = 2: sp (Linear, 180°)",
      "H = 3: sp² (Trigonal planar, 120°)",
      "H = 4: sp³ (Tetrahedral, 109.5°)",
      "H = 5: sp³d (Trigonal bipyramidal; lone pairs enter equatorial positions first: SF₄ see-saw, ClF₃ T-shaped, XeF₂ linear)",
      "H = 6: sp³d² (Octahedral; XeF₄ square planar, BrF₅ square pyramidal)",
      "H = 7: sp³d³ (Pentagonal bipyramidal; IF₇, XeF₆ distorted octahedral)."
    ],
    "example": "For I₃⁻: central I has V=7, M=2, C=0, A=1  =>  H = ½(7 + 2 + 1) = 5 (sp³d, 3 lone pairs in equatorial positions  =>  Linear shape).",
    "latex": "H = \\frac{1}{2}(V + M - C + A), \\quad \\text{Steric Number} = (\\text{Bond Pairs}) + (\\text{Lone Pairs})"
  },
  {
    "id": "steric_number_hybridisation",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding",
    "title": "Steric Number & Orbital Hybridisation",
    "expr": "SN = ½ [ V + M − C + A ]   =   (Number of σ-bonds) + (Number of Lone Pairs)",
    "keys": [
      "steric number",
      "hybridisation",
      "vsepr",
      "lone pairs count"
    ],
    "symbols": [
      "V: valence electrons of central atom",
      "M: number of monovalent surrounding atoms (H, F, Cl, Br, I)",
      "C: charge of cation",
      "A: charge of anion",
      "SN = 2: sp",
      "SN = 3: sp²",
      "SN = 4: sp³",
      "SN = 5: sp³d",
      "SN = 6: sp³d²",
      "SN = 7: sp³d³"
    ],
    "notes": [
      "Divalent atoms (O, S) are NOT counted in M.",
      "For XeF₄: SN = ½[8 + 4 − 0 + 0] = 6 => sp³d² with 4 bonding pairs + 2 lone pairs = Square Planar."
    ],
    "example": "For SF₄: SN = ½[6 + 4 − 0 + 0] = 5 => sp³d (4 σ bonds + 1 lone pair = See-saw shape).",
    "latex": "\\text{SN} = \\frac{1}{2}[V + M - C + A] = (\\text{Number of } \\sigma\\text{-bonds}) + (\\text{Number of Lone Pairs})"
  },
  {
    "id": "bondorder",
    "branch": "Inorganic",
    "chapter": "Chemical bonding (MOT)",
    "title": "Bond order from MOT",
    "expr": "Bond order = ½ (Nb − Na)",
    "keys": [
      "bond order"
    ],
    "symbols": [
      "Nb: electrons in bonding molecular orbitals",
      "Na: electrons in antibonding molecular orbitals"
    ],
    "notes": [
      "Higher bond order means a shorter, stronger bond.",
      "Bond order 0 means the species does not exist.",
      "O₂: ½(10 − 6) = 2.   O₂⁺: 2.5.   O₂⁻: 1.5."
    ],
    "latex": "\\text{Bond Order} = \\frac{N_b - N_a}{2}"
  },
  {
    "id": "mot_bond_order",
    "branch": "Inorganic",
    "chapter": "Chemical Bonding (MOT)",
    "title": "Molecular Orbital Theory (MOT) Bond Order",
    "expr": "Bond Order = ½ (N_b − N_a)",
    "keys": [
      "mot",
      "bond order",
      "molecular orbital",
      "magnetic nature"
    ],
    "symbols": [
      "N_b: number of electrons in bonding molecular orbitals (σ, π)",
      "N_a: number of electrons in antibonding orbitals (σ*, π*)"
    ],
    "notes": [
      "For ≤ 14 electrons (B₂, C₂, N₂): π2p_x = π2p_y < σ2p_z (due to s-p mixing).",
      "For > 14 electrons (O₂, F₂, Ne₂): σ2p_z < π2p_x = π2p_y.",
      "Bond order 0 means molecule does not exist (He₂, Be₂).",
      "Paramagnetic if any unpaired electrons exist in MOs (e.g. O₂ has 2 unpaired electrons in π*2p)."
    ],
    "example": "O₂ (16 electrons): N_b = 10, N_a = 6  =>  B.O. = ½(10 − 6) = 2.0 (Paramagnetic).\nO₂⁺: B.O. = 2.5, O₂⁻ (superoxide): B.O. = 1.5, O₂²⁻ (peroxide): B.O. = 1.0.",
    "latex": "\\text{Bond Order} = \\frac{N_b - N_a}{2}"
  },
  {
    "id": "diagonal_relationship_lithium_magnesium",
    "branch": "Inorganic",
    "chapter": "Classification of Elements",
    "title": "Diagonal Relationship: Lithium & Magnesium Similarities",
    "expr": "Similar ionic potential ϕ = z/r explains identical chemical behaviors of Li⁺ and Mg²⁺",
    "keys": [
      "diagonal relationship",
      "lithium and magnesium",
      "be and al"
    ],
    "symbols": [
      "Both carbonates decompose on heating (Li₂CO₃ → Li₂O + CO₂)",
      "Both form normal oxides (Li₂O, MgO), NOT peroxides/superoxides"
    ],
    "notes": [
      "Both nitrates decompose to give NO₂ + O₂: 4LiNO₃ → 2Li₂O + 4NO₂ + O₂."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Similar ionic potential ϕ = z/r explains identical chemical behaviors of Li⁺ and Mg²⁺",
    "latex": "\\text{Ionic Potential } \\phi = \\frac{z}{r}: \\; \\phi(\\ce{Li+}) \\approx \\phi(\\ce{Mg^2+})"
  },
  {
    "id": "electron_gain_enthalpy_anomalies",
    "branch": "Inorganic",
    "chapter": "Classification of Elements",
    "title": "Electron Gain Enthalpy Trends & Anomalies",
    "expr": "Order: Cl > F > Br > I   and   S > Se > Te > O",
    "keys": [
      "electron gain enthalpy",
      "chlorine vs fluorine",
      "oxygen vs sulfur"
    ],
    "symbols": [
      "Negative value represents energy released on adding electron"
    ],
    "notes": [
      "F has lower electron affinity than Cl (−328 vs −349 kJ mol⁻¹) due to strong interelectronic repulsion in compact 2p subshell."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Order: Cl > F > Br > I   and   S > Se > Te > O",
    "latex": "\\text{Electron Gain Enthalpy: } \\ce{Cl > F > Br > I} \\quad \\text{and} \\quad \\ce{S > Se > Te > O}"
  },
  {
    "id": "inert_pair_effect_stability",
    "branch": "Inorganic",
    "chapter": "Classification of Elements",
    "title": "Inert Pair Effect & Lower Oxidation State Stability",
    "expr": "Group 13: Tl⁺ > Tl³⁺   |   Group 14: Pb²⁺ > Pb⁴⁺   |   Group 15: Bi³⁺ > Bi⁵⁺",
    "keys": [
      "inert pair effect",
      "relativity contraction",
      "thallium lead bismuth"
    ],
    "symbols": [
      "Reluctance of valence s-electrons to participate in bonding due to poor d and f shielding"
    ],
    "notes": [
      "PbO₂ and Bi₂O₅ are powerful oxidising agents because Pb⁴⁺ and Bi⁵⁺ readily reduce to stable Pb²⁺ and Bi³⁺."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Group 13: Tl⁺ > Tl³⁺   |   Group 14: Pb²⁺ > Pb⁴⁺   |   Group 15: Bi³⁺ > Bi⁵⁺",
    "latex": "\\text{Group 13: } \\ce{Tl+ > Tl^3+} \\quad \\Big| \\quad \\text{Group 14: } \\ce{Pb^2+ > Pb^4+} \\quad \\Big| \\quad \\text{Group 15: } \\ce{Bi^3+ > Bi^5+}"
  },
  {
    "id": "ionisation_enthalpy_nitrogen_oxygen",
    "branch": "Inorganic",
    "chapter": "Classification of Elements",
    "title": "Ionisation Enthalpy Anomaly: N > O and Be > B",
    "expr": "IE₁(N: 1402 kJ) > IE₁(O: 1314 kJ)   |   IE₁(Be: 899 kJ) > IE₁(B: 801 kJ)",
    "keys": [
      "ionisation enthalpy anomaly",
      "half filled p3 stability",
      "penetrating s orbital"
    ],
    "symbols": [
      "N has stable half-filled 2p³ configuration",
      "Be has stable fully-filled 2s² configuration"
    ],
    "notes": [
      "O has 2p⁴ configuration; removing one electron leaves a stable half-filled 2p³ ion (O⁺)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: IE₁(N: 1402 kJ) > IE₁(O: 1314 kJ)   |   IE₁(Be: 899 kJ) > IE₁(B: 801 kJ)",
    "latex": "\\text{IE}_1(\\ce{N: 1402 kJ}) > \\text{IE}_1(\\ce{O: 1314 kJ}) \\quad \\Big| \\quad \\text{IE}_1(\\ce{Be: 899 kJ}) > \\text{IE}_1(\\ce{B: 801 kJ})"
  },
  {
    "id": "pauling_electronegativity_scale",
    "branch": "Inorganic",
    "chapter": "Classification of Elements",
    "title": "Pauling's Electronegativity Formula",
    "expr": "χ_A − χ_B = 0.208 · √Δ   (Δ in kcal mol⁻¹)   =   0.102 · √Δ   (Δ in kJ mol⁻¹)",
    "keys": [
      "paulings electronegativity",
      "ionic resonance energy",
      "electronegativity difference"
    ],
    "symbols": [
      "χ_A, χ_B: electronegativities of atoms A and B (arbitrary reference: χ_F = 4.0)",
      "Δ = E_actual(A−B) − √[ E(A−A) · E(B−B) ]: resonance energy in kJ mol⁻¹ or kcal mol⁻¹"
    ],
    "notes": [
      "Mulliken scale: χ_M = (IE + EA) / 2 in eV; Pauling value χ_P ≈ χ_M / 2.8.",
      "Allred–Rochow scale: χ_AR = 0.359 (Z_eff / r²) + 0.744."
    ],
    "example": "If bond energies are E(H−H) = 436, E(F−F) = 155, E(H−F) = 565 kJ mol⁻¹:\nΔ = 565 − √(436 × 155) = 565 − 260 = 305 kJ mol⁻¹.\nχ_F − χ_H = 0.102 × √305 = 0.102 × 17.46 ≈ 1.78. Since χ_H = 2.20, χ_F ≈ 3.98 ≈ 4.0.",
    "latex": "\\chi_A - \\chi_B = 0.208 \\sqrt{\\Delta} \\; (\\text{kcal/mol}) = 0.102 \\sqrt{\\Delta} \\; (\\text{kJ/mol})"
  },
  {
    "id": "slater_rules",
    "branch": "Inorganic",
    "chapter": "Classification of Elements",
    "title": "Slater's Rules & Effective Nuclear Charge",
    "expr": "Z* = Z − σ",
    "keys": [
      "slater",
      "effective nuclear charge",
      "shielding constant"
    ],
    "symbols": [
      "Z*: effective nuclear charge felt by electron",
      "Z: atomic number",
      "σ: screening / shielding constant"
    ],
    "notes": [
      "For an electron in ns or np: other electrons in same shell contribute 0.35 each; (n−1) shell contributes 0.85 each; deeper shells contribute 1.00 each.",
      "Explains why 4s fills before 3d, and explains the d-block and lanthanide contractions."
    ],
    "example": "For valence 4s electron of Zn (Z = 30, [Ar] 3d¹⁰ 4s²):\nσ = (1 × 0.35) + (18 × 0.85) + (10 × 1.00) = 0.35 + 15.30 + 10.0 = 25.65.\nZ* = 30 − 25.65 = 4.35.",
    "latex": "Z^* = Z - \\sigma"
  },
  {
    "id": "slater_rules_zeff",
    "branch": "Inorganic",
    "chapter": "Classification of Elements",
    "title": "Slater's Rules for Effective Nuclear Charge (Zeff)",
    "expr": "Z_eff = Z − σ   |   For ns/np electron: σ = 0.35(n−1_same) + 0.85(n−1) + 1.0(n−2_lower)",
    "keys": [
      "slaters rules",
      "effective nuclear charge",
      "screening constant",
      "shielding constant"
    ],
    "symbols": [
      "Z: actual atomic number (nuclear charge)",
      "σ: screening / shielding constant",
      "Z_eff: effective nuclear charge experienced by valence electron"
    ],
    "notes": [
      "For d and f electrons: electrons in same group contribute 0.35; all electrons in lower groups contribute 1.00.",
      "Increasing Z_eff across a period explains decrease in atomic radius and increase in ionisation enthalpy."
    ],
    "example": "Calculate Z_eff for 4s electron in Zinc (Z = 30: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s²):\nσ = (1 × 0.35) + (18 × 0.85) + (10 × 1.00) = 0.35 + 15.3 + 10.0 = 25.65.\nZ_eff = 30 − 25.65 = 4.35.",
    "latex": "Z_{\\text{eff}} = Z - \\sigma \\quad \\Big| \\quad \\text{For } ns/np \\text{ electrons}: \\sigma = 0.35(n - 1)_{\\text{same}} + 0.85(n - 1) + 1.0(n - 2)_{\\text{lower}}"
  },
  {
    "id": "ean",
    "branch": "Inorganic",
    "chapter": "Coordination compounds",
    "title": "Effective atomic number (EAN)",
    "expr": "EAN = Z − (oxidation state) + 2 × (coordination number)",
    "keys": [
      "effective atomic number",
      "ean"
    ],
    "symbols": [
      "Z: atomic number of the metal"
    ],
    "notes": [
      "Stable metal carbonyls and many complexes reach the next noble-gas value (36, 54, 86).",
      "[Fe(CN)₆]⁴⁻: 26 − 2 + 12 = 36 (krypton)."
    ],
    "latex": "\\text{EAN} = Z - (\\text{Oxidation State}) + 2 \\times (\\text{Coordination Number})"
  },
  {
    "id": "spinonly",
    "branch": "Inorganic",
    "chapter": "Coordination compounds",
    "title": "Spin-only magnetic moment",
    "expr": "μ = √[n(n + 2)] BM",
    "keys": [
      "spin only",
      "spin-only",
      "magnetic moment"
    ],
    "symbols": [
      "n: number of unpaired electrons",
      "BM: Bohr magneton"
    ],
    "notes": [
      "n = 1: 1.73, n = 2: 2.83, n = 3: 3.87, n = 4: 4.90, n = 5: 5.92 BM.",
      "Decide high/low spin from the ligand field strength before counting n."
    ],
    "latex": "\\mu_s = \\sqrt{n(n + 2)} \\; \\mu_B \\; (\\text{B.M.})"
  },
  {
    "id": "chelate_effect_thermodynamics",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Chelate Effect & Macrocyclic Thermodynamic Stability",
    "expr": "ΔG° = ΔH° − T ΔS°   (where ΔS° >> 0 due to release of multiple monodentate solvent molecules)",
    "keys": [
      "chelate effect",
      "bidentate polydentate ligands",
      "thermodynamic stability",
      "edta stability"
    ],
    "symbols": [
      "Chelation: formation of 5- or 6-membered chelate rings with central metal by polydentate ligands (en, ox²⁻, EDTA⁴⁻)"
    ],
    "notes": [
      "Replacement of 6 monodentate H₂O ligands by 3 bidentate ethylenediamine molecules increases the total number of free particles from 4 to 7, creating a large positive entropy change (ΔS° > 0).",
      "EDTA⁴⁻ forms exceptionally stable octadentate complexes (used in water softening and lead poisoning treatment)."
    ],
    "example": "[Ni(H₂O)₆]²⁺ + 3 en ⇌ [Ni(en)₃]²⁺ + 6 H₂O: 4 reactant species generate 7 product species; net +3 species increases entropy enormously.",
    "latex": "\\Delta G^\\circ = \\Delta H^\\circ - T \\Delta S^\\circ \\quad (\\Delta S^\\circ \\gg 0 \\text{ due to release of monodentate ligands})"
  },
  {
    "id": "cfse_octahedral_formula",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Crystal Field Splitting Energy (CFSE) in Octahedral Complexes",
    "expr": "CFSE_oct = [ −0.4 · n(t_2g) + 0.6 · n(e_g) ] · Δ_o + m · P",
    "keys": [
      "cfse octahedral",
      "crystal field theory",
      "t2g and eg",
      "pairing energy",
      "high spin low spin"
    ],
    "symbols": [
      "Δ_o: octahedral crystal field splitting parameter",
      "n(t_2g): electrons in lower t_2g set (d_xy, d_yz, d_zx)",
      "n(e_g): electrons in higher e_g set (d_x²−y², d_z²)",
      "P: mean electron pairing energy in same orbital",
      "m: number of extra electron pairs compared to free ion"
    ],
    "notes": [
      "Strong field ligands (CN⁻, CO, NO₂⁻, en): Δ_o > P => Low-spin complex (electrons pair up in t_2g first).",
      "Weak field ligands (I⁻, Br⁻, Cl⁻, F⁻, H₂O): Δ_o < P => High-spin complex.",
      "d⁰, d³ (high & low spin), d⁵ (high spin), d⁶ (low spin), d⁸, d¹⁰ have symmetric orbital fillings."
    ],
    "example": "For d⁴ ion: High spin (t_2g³ e_g¹): CFSE = [−0.4(3) + 0.6(1)] Δ_o = −0.6 Δ_o.\nLow spin (t_2g⁴ e_g⁰): CFSE = [−0.4(4) + 0] Δ_o + P = −1.6 Δ_o + P.",
    "latex": "\\text{CFSE}_{\\text{oct}} = [ -0.4 \\cdot n(t_{2g}) + 0.6 \\cdot n(e_g) ] \\Delta_o + m \\cdot P"
  },
  {
    "id": "cfse_oct_tet",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Crystal Field Stabilization Energy (CFSE)",
    "expr": "Octahedral: CFSE = (−0.4 n_t2g + 0.6 n_eg) Δ_o + mP   |   Tetrahedral: Δ_t = (4/9) Δ_o",
    "keys": [
      "cfse",
      "crystal field stabilization",
      "crystal field splitting"
    ],
    "symbols": [
      "n_t2g: electrons in t₂g set",
      "n_eg: electrons in eg set",
      "Δ_o: octahedral splitting energy",
      "P: pairing energy",
      "m: extra electron pairs formed relative to free ion"
    ],
    "notes": [
      "Spectrochemical series: I⁻ < Br⁻ < S²⁻ < SCN⁻ < Cl⁻ < F⁻ < OH⁻ < C₂O₄²⁻ < H₂O < NCS⁻ < EDTA⁴⁻ < NH₃ < en < NO₂⁻ < CN⁻ < CO.",
      "If Δ_o > P: strong field, low-spin complex.",
      "If Δ_o < P: weak field, high-spin complex.",
      "Tetrahedral complexes are almost always high-spin because Δ_t is small (only 4/9 of Δ_o)."
    ],
    "example": "Low-spin d⁶ (e.g. [Co(NH₃)₆]³⁺, t₂g⁶ eg⁰):\nCFSE = (−0.4 × 6) Δ_o + 2P = −2.4 Δ_o + 2P.",
    "latex": "\\text{Octahedral: } \\text{CFSE} = (-0.4 n_{t_{2g}} + 0.6 n_{e_g})\\Delta_o + m P \\quad \\Big| \\quad \\text{Tetrahedral: } \\Delta_t = \\frac{4}{9}\\Delta_o"
  },
  {
    "id": "ean_rule",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Effective Atomic Number (EAN / Sidgwick Rule)",
    "expr": "EAN = Z − (Oxidation State) + 2 × (Coordination Number)",
    "keys": [
      "ean",
      "effective atomic number",
      "sidgwick"
    ],
    "symbols": [
      "Z: atomic number of central metal",
      "Each mono-dentate ligand donates 2 electrons to the metal"
    ],
    "notes": [
      "If EAN equals the atomic number of the next noble gas (36 for Kr, 54 for Xe, 86 for Rn), the complex displays exceptional thermodynamic stability.",
      "Homoleptic metal carbonyls (e.g. Ni(CO)₄, Fe(CO)₅, Cr(CO)₆) strictly follow the 18-electron / EAN rule."
    ],
    "example": "[Fe(CN)₆]⁴⁻: Fe(II) has Z = 26, O.S. = +2, C.N. = 6:\nEAN = 26 − 2 + (2 × 6) = 24 + 12 = 36 (Krypton configuration).",
    "latex": "\\text{EAN} = Z - (\\text{Oxidation State}) + 2 \\times (\\text{Coordination Number})"
  },
  {
    "id": "geometrical_isomerism_octahedral",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Fac–Mer Geometrical Isomerism in Octahedral [MA₃B₃]",
    "expr": "Fac (facial): three identical ligands occupy same face of octahedron   |   Mer (meridional): three ligands form arc around meridian",
    "keys": [
      "fac mer isomerism",
      "ma3b3",
      "facial meridional",
      "geometrical isomerism octahedral"
    ],
    "symbols": [
      "Fac-isomer has C₃ symmetry axis",
      "Mer-isomer has C₂ symmetry plane"
    ],
    "notes": [
      "Neither fac nor mer isomer exhibits optical activity (both possess planes of symmetry)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Fac (facial): three identical ligands occupy same face of octahedron   |   Mer (meridional): three ligands form arc around meridian",
    "latex": "\\text{Fac (facial): 3 identical ligands occupy same octahedral face} \\quad \\Big| \\quad \\text{Mer (meridional): 3 ligands form meridian arc}"
  },
  {
    "id": "ferrocene_sandwich_structure",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Ferrocene: Bis(cyclopentadienyl) Iron(II) Sandwich",
    "expr": "Fe(η⁵−C₅H₅)₂   |   Total Valence Electrons = 6 (Fe²⁺) + 2 × 6 (Cp⁻) = 18 e⁻",
    "keys": [
      "ferrocene",
      "metallocene",
      "sandwich compound",
      "18 electron rule"
    ],
    "symbols": [
      "Fe²⁺ sandwiched between two parallel planar aromatic cyclopentadienyl (Cp⁻) rings",
      "Each ring donates 6 π electrons in an η⁵ mode"
    ],
    "notes": [
      "Obeys 18-electron rule: extraordinarily stable, sublimes easily at 100 °C, resistant to air and heat up to 400 °C.",
      "Undergoes electrophilic aromatic substitution (Friedel–Crafts acylation) millions of times faster than benzene."
    ],
    "example": "Ferrocene undergoes Friedel–Crafts monoacylation with acetyl chloride and AlCl₃ to yield acetylferrocene.",
    "latex": "\\ce{Fe(\\eta^5-C5H5)2}, \\quad \\text{Valence } e^- = 6(\\ce{Fe^2+}) + 2 \\times 6(\\ce{Cp-}) = 18 e^-"
  },
  {
    "id": "jahn_teller_distortion_d9",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Jahn–Teller Distortion in Octahedral Complexes",
    "expr": "Any non-linear molecular system in a degenerate electronic state distorts to lower its symmetry and remove degeneracy",
    "keys": [
      "jahn teller distortion",
      "cu2+ d9 distortion",
      "z out elongation"
    ],
    "symbols": [
      "Most pronounced in d⁹ (Cu²⁺) and high-spin d⁴ (Cr²⁺, Mn³⁺) with asymmetric e_g electrons"
    ],
    "notes": [
      "Tetragonal elongation (z-out): two axial bonds are significantly LONGER than four equatorial bonds."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Any non-linear molecular system in a degenerate electronic state distorts to lower its symmetry and remove degeneracy",
    "latex": "\\text{Jahn--Teller: Any non-linear molecule in a degenerate electronic ground state distorts to remove degeneracy (e.g. } d^9 \\; \\ce{Cu^2+})"
  },
  {
    "id": "pi_acid_synergy",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Metal–Carbonyl Synergic Bonding",
    "expr": "Synergic Bond = (Ligand σ-donation L → M) + (Metal d-orbital π-backdonation M → L π*)",
    "keys": [
      "synergic bonding",
      "pi acid ligands",
      "metal carbonyl",
      "infrared frequency"
    ],
    "symbols": [
      "L: CO, NO⁺, CN⁻, C₂H₄",
      "M: low-oxidation-state transition metal with filled d-orbitals"
    ],
    "notes": [
      "Electron donation from filled metal d-orbital into vacant π* antibonding orbital of CO weakens the C–O triple bond and strengthens the M–C bond.",
      "As negative charge on metal complex increases (e.g. [V(CO)₆]⁻ vs [Cr(CO)₆] vs [Mn(CO)₆]⁺), π-backbonding INCREASES: M–C bond shortens, and C–O stretching frequency ν_CO in IR DECREASES."
    ],
    "example": "C–O IR stretching frequency order: Free CO (2143 cm⁻¹) > [Mn(CO)₆]⁺ (2090 cm⁻¹) > [Cr(CO)₆] (2000 cm⁻¹) > [V(CO)₆]⁻ (1860 cm⁻¹).",
    "latex": "\\text{Synergic Bond} = (\\text{Ligand } \\sigma\\text{-donation } L \\to M) + (\\text{Metal } d\\text{-orbital } \\pi\\text{-backdonation } M \\to L \\pi^*)"
  },
  {
    "id": "effective_atomic_number_ean",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Sidgwick's Effective Atomic Number (EAN) Rule",
    "expr": "EAN = Z − (Oxidation State) + 2 × (Coordination Number)",
    "keys": [
      "ean rule",
      "effective atomic number",
      "sidgwick",
      "noble gas configuration"
    ],
    "symbols": [
      "Z: atomic number of central transition metal",
      "Coordination Number: total electron pairs donated by ligands (monodentate=1, bidentate=2)"
    ],
    "notes": [
      "Complexes obeying EAN rule have EAN equal to the atomic number of the next noble gas (Kr=36, Xe=54, Rn=86) and possess heightened kinetic stability.",
      "Metal carbonyls generally obey EAN rule: Fe(CO)₅ (EAN = 26 − 0 + 10 = 36 = Kr); Ni(CO)₄ (EAN = 28 − 0 + 8 = 36 = Kr)."
    ],
    "example": "In [Fe(CN)₆]⁴⁻: Fe is in +2 state (Z = 26). CN⁻ donates 6 pairs = 12 electrons.\nEAN = 26 − 2 + 12 = 36 (Krypton configuration).",
    "latex": "\\text{EAN} = Z - (\\text{Oxidation State}) + 2 \\times (\\text{Coordination Number})"
  },
  {
    "id": "spectrochemical_series_order",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Spectrochemical Series of Ligands",
    "expr": "I⁻ < Br⁻ < S²⁻ < SCN⁻ < Cl⁻ < N₃⁻ < F⁻ < OH⁻ < C₂O₄²⁻ ≈ H₂O < NCS⁻ < edta⁴⁻ < NH₃ < en < NO₂⁻ < PPh₃ < CN⁻ < CO",
    "keys": [
      "spectrochemical series",
      "ligand field strength",
      "strong field weak field",
      "crystal field splitting"
    ],
    "symbols": [
      "Halide donors (weakest) < Oxygen donors < Nitrogen donors < Carbon donors (strongest: CO, CN⁻)"
    ],
    "notes": [
      "Ligands to the right of H₂O are generally strong field; ligands to the left are weak field.",
      "CO has the highest field strength due to synergic π-backbonding (M(d_π) → CO(π*))."
    ],
    "example": "In [Fe(H₂O)₆]²⁺ (H₂O weak): high-spin d⁶ (4 unpaired electrons). In [Fe(CN)₆]⁴⁻ (CN⁻ strong): low-spin d⁶ (0 unpaired electrons, diamagnetic).",
    "latex": "\\ce{I- < Br- < S^2- < SCN- < Cl- < F- < OH- < C2O4^2- \\approx H2O < NCS- < edta^4- < NH3 < en < NO2- < CN- < CO}"
  },
  {
    "id": "isomerism_types_coordination",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Structural Isomerism in Coordination Complexes",
    "expr": "Ionisation: [Co(NH₃)₅Br]SO₄ vs [Co(NH₃)₅SO₄]Br   |   Linkage: M−NO₂ (nitro) vs M−ONO (nitrito)",
    "keys": [
      "isomerism coordination",
      "linkage isomerism",
      "hydrate isomerism",
      "ambidentate ligand"
    ],
    "symbols": [
      "Ambidentate ligands (NO₂⁻, SCN⁻, CN⁻) give linkage isomerism"
    ],
    "notes": [
      "Hydrate isomerism: [Cr(H₂O)₆]Cl₃ (violet) vs [Cr(H₂O)₅Cl]Cl₂·H₂O (grey-green)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Ionisation: [Co(NH₃)₅Br]SO₄ vs [Co(NH₃)₅SO₄]Br   |   Linkage: M−NO₂ (nitro) vs M−ONO (nitrito)",
    "latex": "\\text{Ionisation: } [\\ce{Co(NH3)5Br}]\\ce{SO4} \\text{ vs } [\\ce{Co(NH3)5SO4}]\\ce{Br} \\quad \\Big| \\quad \\text{Linkage: } \\ce{M-NO2} \\text{ (nitro) vs } \\ce{M-ONO} \\text{ (nitrito)}"
  },
  {
    "id": "cfse_tetrahedral_relation",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Tetrahedral Splitting (Δt) & CFSE",
    "expr": "Δ_t = (4 / 9) · Δ_o   |   CFSE_tet = [ −0.6 · n(e) + 0.4 · n(t_2) ] · Δ_t",
    "keys": [
      "cfse tetrahedral",
      "delta t vs delta o",
      "tetrahedral splitting",
      "inverted d orbitals"
    ],
    "symbols": [
      "Δ_t: tetrahedral splitting parameter",
      "e set (lower): d_x²−y², d_z²",
      "t_2 set (higher): d_xy, d_yz, d_zx"
    ],
    "notes": [
      "Tetrahedral splitting is small (Δ_t << P), so tetrahedral complexes are ALWAYS high-spin; low-spin tetrahedral complexes are virtually non-existent.",
      "There is no center of inversion in a tetrahedron, so the 'g' (gerade) subscript is omitted."
    ],
    "example": "If Δ_o for a metal ion is 18,000 cm⁻¹:\nΔ_t = (4/9) × 18,000 = 8,000 cm⁻¹.",
    "latex": "\\Delta_t = \\frac{4}{9} \\Delta_o \\quad \\Big| \\quad \\text{CFSE}_{\\text{tet}} = [ -0.6 \\cdot n(e) + 0.4 \\cdot n(t_2) ] \\Delta_t"
  },
  {
    "id": "trans_effect_series",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Trans Effect in Square Planar Complexes",
    "expr": "CN⁻ ≈ CO ≈ C₂H₄ > PR₃ ≈ H⁻ > CH₃⁻ > NO₂⁻ ≈ I⁻ ≈ SCN⁻ > Br⁻ > Cl⁻ > py > NH₃ > OH⁻ > H₂O",
    "keys": [
      "trans effect",
      "square planar substitution",
      "cisplatin synthesis"
    ],
    "symbols": [
      "Trans effect: ability of a coordinated ligand to direct an incoming substituent to the position trans to itself in square planar Pt(II) complexes"
    ],
    "notes": [
      "Operates via two mechanisms: trans-influence (ground state thermodynamic weakening of trans bond via σ-donation) and trans-effect (transition state kinetic stabilisation via π-acceptance).",
      "Crucial for synthesizing cis-diamminedichloroplatinum(II) [Cisplatin] vs trans-isomer."
    ],
    "example": "To synthesize Cisplatin: react [PtCl₄]²⁻ with NH₃ (Cl⁻ has stronger trans effect than NH₃, directing second NH₃ cis to first).\n[Pt(NH₃)₄]²⁺ + 2Cl⁻ yields the trans-isomer.",
    "latex": "\\ce{CN- \\approx CO \\approx C2H4 > PR3 \\approx H- > CH3- > NO2- \\approx I- \\approx SCN- > Br- > Cl- > py > NH3 > OH- > H2O}"
  },
  {
    "id": "zeises_salt_structure",
    "branch": "Inorganic",
    "chapter": "Coordination Compounds",
    "title": "Zeise's Salt: First Organometallic Alkene Complex",
    "expr": "K[PtCl₃(η²−C₂H₄)] · H₂O   (Platinum(II) Square Planar)",
    "keys": [
      "zeises salt",
      "organometallic complex",
      "synergic bonding",
      "dewar chatt duncanson"
    ],
    "symbols": [
      "Pt(II) coordinated to 3 chloride ligands and 1 ethene molecule in an η² (hapto-2) mode",
      "C=C bond axis is PERPENDICULAR to the PtCl₃ coordination plane"
    ],
    "notes": [
      "Dewar–Chatt–Duncanson model: 1) σ-donation from filled π(C=C) into empty Pt 5d orbital; 2) π-backdonation from filled Pt 5d orbital into empty π*(C=C) antibonding orbital.",
      "Backbonding weakens C=C bond: length increases from 1.34 Å in free ethene to 1.37 Å in Zeise's salt."
    ],
    "example": "Heating K₂[PtCl₄] with ethanol yields yellow crystals of Zeise's salt.",
    "latex": "\\ce{K[PtCl3(\\eta^2-C2H4)] \\cdot H2O} \\quad (\\text{Platinum(II) Square Planar Organometallic Complex})"
  },
  {
    "id": "chromyl_chloride_test_eq",
    "branch": "Inorganic",
    "chapter": "d- and f-Block Elements",
    "title": "Chromyl Chloride Test for Chloride Ions",
    "expr": "K₂Cr₂O₇ + 4 NaCl + 6 H₂SO₄(conc) → 2 CrO₂Cl₂↑ (deep red vapour) + 2 KHSO₄ + 4 NaHSO₄ + 3 H₂O",
    "keys": [
      "chromyl chloride test",
      "chloride detection",
      "cro2cl2",
      "lead chromate yellow precipitate"
    ],
    "symbols": [
      "CrO₂Cl₂: chromyl chloride (deep red vapour, condensed to red liquid)",
      "Confirmatory step: CrO₂Cl₂ + 4 NaOH → Na₂CrO₄ (yellow) + 2 NaCl + 2 H₂O",
      "Yellow solution + CH₃COOH + (CH₃COO)₂Pb → PbCrO₄↓ (yellow precipitate of lead chromate)"
    ],
    "notes": [
      "Fails for covalent chlorides (Hg₂Cl₂, HgCl₂, AgCl, PbCl₂, SnCl₂) because they do not release free Cl⁻ ions.",
      "Bromides and iodides do not form volatile chromyl compounds (liberate Br₂ and I₂ vapours instead)."
    ],
    "example": "Red vapour passed into NaOH gives a yellow solution that confirms chloride upon forming yellow PbCrO₄ with lead acetate.",
    "latex": "\\ce{K2Cr2O7 + 4NaCl + 6H2SO4(conc) -> 2CrO2Cl2 ^ \\text{ (deep red)} + 2KHSO4 + 4NaHSO4 + 3H2O}"
  },
  {
    "id": "lanthanide_contraction",
    "branch": "Inorganic",
    "chapter": "d- and f-Block Elements",
    "title": "Lanthanide Contraction & Pair Equivalence",
    "expr": "Radius(Zr⁴⁺) ≈ Radius(Hf⁴⁺) ≈ 160 pm   ,   Radius(Nb⁵⁺) ≈ Radius(Ta⁵⁺) ≈ 146 pm",
    "keys": [
      "lanthanide contraction",
      "4f shielding",
      "consecutive atomic radii",
      "zirconium hafnium"
    ],
    "symbols": [
      "Cause: poor shielding of the nuclear charge by diffuse, buried 4f electrons across the 14 lanthanide elements (La to Lu)"
    ],
    "notes": [
      "Z increases by 14 units while 4f electrons shield poorly (shielding: s > p > d > f), pulling valence electrons tighter.",
      "Consequence: 2nd and 3rd transition series elements (4d and 5d) of the same group possess virtually identical covalent and ionic radii.",
      "Explains why Zr and Hf, Nb and Ta, Mo and W occur together in nature and are extremely difficult to separate."
    ],
    "example": "Zr (Z=40, 4d) radius = 160 pm; Hf (Z=72, 5d) radius = 159 pm.",
    "latex": "r(\\ce{Zr^4+}) \\approx r(\\ce{Hf^4+}) \\approx 160\\text{ pm}, \\quad r(\\ce{Nb^5+}) \\approx r(\\ce{Ta^5+}) \\approx 146\\text{ pm}"
  },
  {
    "id": "lanthanide_contraction_consequences",
    "branch": "Inorganic",
    "chapter": "d- and f-Block Elements",
    "title": "Lanthanide Contraction & Pairs with Identical Radii",
    "expr": "Cumulative contraction across 14 4f elements: r(4d series) ≈ r(5d series)",
    "keys": [
      "lanthanide contraction",
      "4f shielding",
      "zr and hf identical size",
      "5d elements radius"
    ],
    "symbols": [
      "Poor shielding effect of 4f electrons causes effective nuclear charge Z_eff to increase steadily, pulling electron shells inward"
    ],
    "notes": [
      "Zr (4d, 160 pm) and Hf (5d, 159 pm) have virtually IDENTICAL covalent and ionic radii.",
      "Nb (146 pm) and Ta (146 pm), Mo (139 pm) and W (139 pm) also have identical radii.",
      "Makes separation of Zr and Hf extremely difficult.",
      "Basic strength of lanthanide hydroxides DECREASES: La(OH)₃ (most basic) to Lu(OH)₃ (least basic)."
    ],
    "example": "Hf has atomic number 72 while Zr is 40, yet both have identical metallic radius (159–160 pm) due to the intervention of the 14 lanthanide elements.",
    "latex": "\\text{14 } 4f\\text{-electron contraction: } r(4d \\text{ series}) \\approx r(5d \\text{ series}) \\implies \\text{Nearly identical properties}"
  },
  {
    "id": "potassium_dichromate_redox_eq",
    "branch": "Inorganic",
    "chapter": "d- and f-Block Elements",
    "title": "Potassium Dichromate (K₂Cr₂O₇) Redox Half-Equation",
    "expr": "Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ → 2 Cr³⁺ + 7 H₂O   (E° = +1.33 V   ,   n-factor = 6)",
    "keys": [
      "potassium dichromate",
      "cr2o7 2-",
      "equivalent weight dichromate",
      "orange to green"
    ],
    "symbols": [
      "Chromium drops from +6 in orange Cr₂O₇²⁻ to +3 in green Cr³⁺",
      "Equivalent Mass = (Molar Mass of K₂Cr₂O₇) / 6 = 294.18 / 6 = 49.03 g equiv⁻¹"
    ],
    "notes": [
      "In alkaline medium, dichromate converts to yellow chromate without redox: Cr₂O₇²⁻ (orange) + 2OH⁻ ⇌ 2CrO₄²⁻ (yellow) + H₂O.",
      "Primary standard in volumetric titrations because it is obtained in high purity and is stable in air."
    ],
    "example": "Titration against Mohr's salt: 1 mol Cr₂O₇²⁻ oxidises 6 mol Fe²⁺ to Fe³⁺.",
    "latex": "\\ce{Cr2O7^2- + 14H+ + 6e- -> 2Cr^3+ + 7H2O} \\quad (E^\\circ = +1.33\\text{ V}, \\; n\\text{-factor} = 6)"
  },
  {
    "id": "potassium_permanganate_media",
    "branch": "Inorganic",
    "chapter": "d- and f-Block Elements",
    "title": "Potassium Permanganate (KMnO₄) Redox in Acidic, Neutral & Alkaline Media",
    "expr": "Acidic: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O (n=5)   |   Neutral: MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻ (n=3)   |   Strongly Alkaline: MnO₄⁻ + e⁻ → MnO₄²⁻ (n=1)",
    "keys": [
      "potassium permanganate",
      "kmno4 n factor",
      "acidic basic neutral redox",
      "mno4- to mn2+"
    ],
    "symbols": [
      "Acidic medium: Mn(+7) → Mn(+2) (colourless), n-factor = 5, E = M / 5 = 158 / 5 = 31.6",
      "Neutral / faintly alkaline: Mn(+7) → Mn(+4) (brown MnO₂ ppt), n-factor = 3, E = M / 3 = 52.67",
      "Strongly alkaline: Mn(+7) → Mn(+6) (dark green manganate MnO₄²⁻), n-factor = 1, E = M"
    ],
    "notes": [
      "H₂SO₄ is the only acid used to acidify KMnO₄; HCl cannot be used because KMnO₄ oxidises Cl⁻ to Cl₂; HNO₃ cannot be used because it is an oxidising agent itself.",
      "KMnO₄ acts as its own self-indicator (first excess drop imparts permanent faint pink colour)."
    ],
    "example": "In acidic medium, 1 mol KMnO₄ oxidises 5 mol Fe²⁺ or 2.5 mol C₂O₄²⁻ (oxalate).",
    "latex": "\\text{Acidic: } \\ce{MnO4- + 8H+ + 5e- -> Mn^2+ + 4H2O} \\; (n=5) \\quad \\Big| \\quad \\text{Neutral: } \\ce{MnO4- + 2H2O + 3e- -> MnO2 + 4OH-} \\; (n=3) \\quad \\Big| \\quad \\text{Alkaline: } \\ce{MnO4- + e- -> MnO4^2-} \\; (n=1)"
  },
  {
    "id": "spin_only_magnetic_moment",
    "branch": "Inorganic",
    "chapter": "d- and f-Block Elements",
    "title": "Spin-Only Magnetic Moment Formula",
    "expr": "μ_s = √[ n(n + 2) ] Bohr Magnetons (BM)   |   1 BM = (e · h) / (4π · m_e) = 9.274 × 10⁻²⁴ J T⁻¹",
    "keys": [
      "spin only magnetic moment",
      "unpaired electrons",
      "paramagnetism",
      "bohr magneton table"
    ],
    "symbols": [
      "n: number of unpaired d-electrons",
      "n = 1: μ = √3 ≈ 1.73 BM",
      "n = 2: μ = √8 ≈ 2.83 BM",
      "n = 3: μ = √15 ≈ 3.87 BM",
      "n = 4: μ = √24 ≈ 4.90 BM",
      "n = 5: μ = √35 ≈ 5.92 BM"
    ],
    "notes": [
      "Diamagnetic species have n = 0, so μ = 0 BM.",
      "For 3d transition metals, orbital angular momentum is quenched by the crystal field of ligands, making the spin-only formula remarkably accurate."
    ],
    "example": "Fe³⁺ ion has [Ar] 3d⁵ configuration (5 unpaired electrons in high-spin field):\nμ = √[ 5(5 + 2) ] = √35 ≈ 5.92 BM.",
    "latex": "\\mu_s = \\sqrt{n(n + 2)} \\; \\mu_B \\; (\\text{B.M.})"
  },
  {
    "id": "disproportionation_redox",
    "branch": "Inorganic",
    "chapter": "d- and f-Block Elements & Redox",
    "title": "Disproportionation Equilibria (Frost & Latimer)",
    "expr": "3 MnO₄²⁻ (green) + 4 H⁺ → 2 MnO₄⁻ (purple) + MnO₂ (brown) + 2 H₂O",
    "keys": [
      "disproportionation",
      "latimer diagram",
      "frost diagram",
      "manganate permanganate"
    ],
    "symbols": [
      "Disproportionation: a species in an intermediate oxidation state simultaneously undergoes self-oxidation and self-reduction"
    ],
    "notes": [
      "Manganate(VI) MnO₄²⁻ is stable only in strongly alkaline solution (pH > 11); in neutral or acidic media it disproportionates rapidly into Mn(VII) and Mn(IV).",
      "Cu⁺ in aqueous solution disproportionates spontaneously: 2 Cu⁺(aq) → Cu²⁺(aq) + Cu(s) (E°_cell = +0.36 V).",
      "On a Latimer diagram, a species disproportionates if its potential to the right is MORE positive than its potential to the left (E°_right > E°_left)."
    ],
    "example": "2 Cu⁺ → Cu²⁺ + Cu(s): E°(Cu⁺/Cu) = +0.52 V, E°(Cu²⁺/Cu⁺) = +0.16 V  =>  E°_cell = 0.52 − 0.16 = +0.36 V > 0 (spontaneous).",
    "latex": "\\ce{3MnO4^2- \\text{ (green)} + 4H+ -> 2MnO4- \\text{ (purple)} + MnO2 v + 2H2O}"
  },
  {
    "id": "acid_rain_chemistry",
    "branch": "Inorganic",
    "chapter": "Environmental Chemistry",
    "title": "Acid Rain Formation Chemistry",
    "expr": "2 SO₂ + O₂ + 2 H₂O → 2 H₂SO₄   |   4 NO₂ + O₂ + 2 H₂O → 4 HNO₃   |   pH < 5.6",
    "keys": [
      "acid rain",
      "so2 no2",
      "ph of rain",
      "taj mahal corrosion"
    ],
    "symbols": [
      "Normal rain has pH ≈ 5.6 due to dissolved atmospheric CO₂: CO₂ + H₂O ⇌ H₂CO₃",
      "When rain pH falls below 5.6, it is classified as acid rain"
    ],
    "notes": [
      "Corrodes marble monuments (Taj Mahal): CaCO₃ + H₂SO₄ → CaSO₄ + H₂O + CO₂ (Marble cancer)."
    ],
    "example": "Industrial sulfur dioxide and nitrogen oxide emissions produce rain with pH as low as 3.5 to 4.5.",
    "latex": "\\ce{2SO2 + O2 + 2H2O -> 2H2SO4} \\quad \\Big| \\quad \\ce{4NO2 + O2 + 2H2O -> 4HNO3} \\quad (\\text{pH} < 5.6)"
  },
  {
    "id": "photochemical_smog_reactions",
    "branch": "Inorganic",
    "chapter": "Environmental Chemistry",
    "title": "Photochemical Smog Chain Reactions (PAN & Ozone)",
    "expr": "NO₂ + hν (λ < 380 nm) → NO + O·   |   O· + O₂ → O₃   |   Hydrocarbons + O₃ + NO₂ → CH₃CO−OO−NO₂ (PAN)",
    "keys": [
      "photochemical smog",
      "pan",
      "peroxyacetyl nitrate",
      "ozone secondary pollutant",
      "los angeles smog"
    ],
    "symbols": [
      "PAN: peroxyacetyl nitrate (powerful eye irritant and plant toxin)",
      "Photochemical smog occurs in warm, dry, sunny climates; oxidizing in nature (high O₃ and NO₂)"
    ],
    "notes": [
      "Classical / London smog occurs in cool, humid climates, contains SO₂ and smoke particles, and is REDUCING in nature."
    ],
    "example": "Intense solar UV radiation splits NO₂ to initiate the free radical cascade producing photochemical smog.",
    "latex": "\\ce{NO2 + h\\nu (\\lambda < 380 nm) -> NO + O^.} \\quad \\Big| \\quad \\ce{O^. + O2 -> O3} \\quad \\Big| \\quad \\ce{Hydrocarbons + O3 + NO2 -> PAN}"
  },
  {
    "id": "ozone_depletion_cfc_mechanism",
    "branch": "Inorganic",
    "chapter": "Environmental Chemistry",
    "title": "Stratospheric Ozone Depletion by Chlorofluorocarbons (CFCs)",
    "expr": "CF₂Cl₂ + hν → CF₂Cl· + Cl·   |   Cl· + O₃ → ClO· + O₂   |   ClO· + O· → Cl· + O₂   (Catalytic Chain)",
    "keys": [
      "ozone depletion",
      "cfc",
      "freon",
      "chlorine free radical",
      "polar stratospheric clouds"
    ],
    "symbols": [
      "A single Cl· radical can catalytically destroy over 100,000 ozone (O₃) molecules before being deactivated"
    ],
    "notes": [
      "Nitric acid trihydrate in Polar Stratospheric Clouds (PSCs) over Antarctica converts inactive reservoir chlorine (HCl, ClONO₂) into reactive Cl₂ and HOCl in polar winter."
    ],
    "example": "Spring sunlight photolyses Cl₂ into Cl· radicals, causing massive seasonal ozone hole over Antarctica.",
    "latex": "\\ce{CF2Cl2 + h\\nu -> CF2Cl^. + Cl^.} \\quad \\Big| \\quad \\ce{Cl^. + O3 -> ClO^. + O2} \\quad \\Big| \\quad \\ce{ClO^. + O^. -> Cl^. + O2}"
  },
  {
    "id": "blast_furnace_slag_formation",
    "branch": "Inorganic",
    "chapter": "General Principles of Metallurgy",
    "title": "Blast Furnace Slag Formation & Flux Chemistry",
    "expr": "CaCO₃ —heat (1070 K)→ CaO + CO₂   |   CaO (Basic Flux) + SiO₂ (Acidic Gangue) → CaSiO₃ (Molten Slag)",
    "keys": [
      "blast furnace",
      "slag formation",
      "calcium silicate",
      "basic flux",
      "metallurgy of iron"
    ],
    "symbols": [
      "CaO: basic flux derived from limestone",
      "SiO₂: acidic impurity (gangue) present in haematite ore",
      "CaSiO₃: calcium silicate (molten slag, lighter than molten iron, floats on top)"
    ],
    "notes": [
      "Slag layer prevents oxidation of molten iron (sponge iron) by incoming hot air blast at the bottom of the blast furnace."
    ],
    "example": "Molten slag floats above pig iron and is tapped off through a separate slag notch.",
    "latex": "\\ce{CaCO3 ->[1070\\text{ K}] CaO + CO2 ^} \\quad \\Big| \\quad \\ce{CaO \\text{ (Basic Flux)} + SiO2 \\text{ (Acidic Gangue)} -> CaSiO3 \\text{ (Slag)}}"
  },
  {
    "id": "roasting_vs_calcination",
    "branch": "Inorganic",
    "chapter": "General Principles of Metallurgy",
    "title": "Calcination vs Roasting of Ores",
    "expr": "Calcination (No/Limited Air): ZnCO₃ —heat→ ZnO + CO₂   |   Roasting (Excess Air): 2 ZnS + 3 O₂ —heat→ 2 ZnO + 2 SO₂",
    "keys": [
      "calcination vs roasting",
      "carbonate ore",
      "sulfide ore",
      "reverberatory furnace"
    ],
    "symbols": [
      "Calcination: thermal decomposition of carbonate/hydrated oxide ores below melting point in absence/limited air (removes CO₂ and moisture, making ore porous)",
      "Roasting: heating sulfide ores with excess air to convert them into oxides and release volatile SO₂ gas"
    ],
    "notes": [
      "SO₂ gas evolved during roasting is captured and used to manufacture sulfuric acid by the Contact process."
    ],
    "example": "Calamine (ZnCO₃) is calcined to ZnO; Zinc blende (ZnS) is roasted to ZnO.",
    "latex": "\\text{Calcination (No air): } \\ce{ZnCO3 ->[\\Delta] ZnO + CO2 ^} \\quad \\Big| \\quad \\text{Roasting (Excess air): } \\ce{2ZnS + 3O2 ->[\\Delta] 2ZnO + 2SO2 ^}"
  },
  {
    "id": "ellingham_thermo",
    "branch": "Inorganic",
    "chapter": "General Principles of Metallurgy",
    "title": "Ellingham Diagram Thermodynamics",
    "expr": "ΔG° = ΔH° − TΔS°   =>   Slope = −ΔS°",
    "keys": [
      "ellingham diagram",
      "metallurgy",
      "reduction of oxides",
      "carbon reduction"
    ],
    "symbols": [
      "Plot: standard Gibbs free energy of formation of metal oxides (ΔG° per mole of O₂) against absolute temperature T (K)"
    ],
    "notes": [
      "Most metal oxidation curves have positive slope because 2M(s) + O₂(g) → 2MO(s) consumes gas (ΔS° < 0  =>  slope = −ΔS° > 0).",
      "Abrupt slope increase marks phase change (melting or boiling of metal) due to larger negative ΔS°.",
      "Any metal will reduce the oxide of other metals lying ABOVE it on the diagram (e.g. Al reduces Cr₂O₃ in thermite).",
      "The curve 2C(s) + O₂(g) → 2CO(g) slopes DOWNWARD because ΔS° > 0; above ~983 K, carbon becomes a more powerful reducing agent than CO."
    ],
    "example": "At blast furnace temperatures (> 1000 K), line for 2C + O₂ → 2CO lies below Fe/FeO, so C reduces FeO to Fe spontaneously.",
    "latex": "\\Delta G^\\circ = \\Delta H^\\circ - T \\Delta S^\\circ \\implies \\text{Slope} = -\\Delta S^\\circ"
  },
  {
    "id": "ellingham_diagram_slopes",
    "branch": "Inorganic",
    "chapter": "General Principles of Metallurgy",
    "title": "Ellingham Diagram Thermodynamics & Reducing Agent Selection",
    "expr": "ΔG° = ΔH° − T · ΔS°   |   Slope = −ΔS°",
    "keys": [
      "ellingham diagram",
      "pyrometallurgy",
      "carbon as reducing agent",
      "reduction of metal oxides"
    ],
    "symbols": [
      "ΔG° vs T plot for oxide formation reactions: 2M + O₂ → 2MO",
      "Most metal oxide lines slope UPWARDS because gas (O₂) is consumed (ΔS° < 0 => slope −ΔS° > 0)"
    ],
    "notes": [
      "Any metal whose oxide line lies LOWER can reduce the oxide of a metal lying HIGHER at that temperature.",
      "C + O₂ → CO₂: horizontal line (Δn_g = 0, ΔS° ≈ 0, zero slope).",
      "2C + O₂ → 2CO: slopes DOWNWARDS (ΔS° > 0, negative slope), so at high temperatures (> 983 K), carbon reduces almost any metal oxide."
    ],
    "example": "Above 1073 K, the line for 2C + O₂ → 2CO lies below 2Fe + O₂ → 2FeO, so carbon reduces FeO to Fe in the blast furnace.",
    "latex": "\\Delta G^\\circ = \\Delta H^\\circ - T \\Delta S^\\circ \\quad \\Big| \\quad \\text{Slope} = -\\Delta S^\\circ"
  },
  {
    "id": "froth_floatation_collectors_frothers",
    "branch": "Inorganic",
    "chapter": "General Principles of Metallurgy",
    "title": "Froth Flotation Chemistry: Collectors, Frothers & Depressants",
    "expr": "Mineral Sulfide Ore (wetted by pine oil) Floats in Froth   |   Gangue (wetted by water) Sinks in Pulp",
    "keys": [
      "froth floatation",
      "collectors",
      "frothers",
      "depressants",
      "sodium ethyl xanthate",
      "zns pbs separation"
    ],
    "symbols": [
      "Collectors: Sodium ethyl xanthate, potassium amyl xanthate (attach polar head to sulfide particle and point non-polar hydrophobic tail outward, making ore water-repellent)",
      "Frothers: Pine oil, eucalyptus oil, cresol, camphor (stabilise air bubbles in froth)",
      "Depressants: NaCN selectively depresses ZnS by forming soluble complex Na₂[Zn(CN)₄], allowing PbS to float first"
    ],
    "notes": [
      "After PbS is separated, CuSO₄ (activator) is added to activate ZnS and float it in a second stage: ZnS + CuSO₄ → CuS + ZnSO₄."
    ],
    "example": "Galena (PbS) and Zinc Blende (ZnS) are separated cleanly using NaCN as depressant.",
    "latex": "\\text{Collector (Pine Oil/Xanthates): wets Sulfide Ore} \\implies \\text{Floats in Froth} \\quad \\Big| \\quad \\text{Water: wets Gangue} \\implies \\text{Sinks}"
  },
  {
    "id": "hall_heroult_aluminium_electrolysis",
    "branch": "Inorganic",
    "chapter": "General Principles of Metallurgy",
    "title": "Hall–Héroult Electrolytic Extraction of Aluminium",
    "expr": "Cathode: Al³⁺ + 3e⁻ → Al(l)   |   Anode: C(s) + 2 O²⁻ → CO₂(g) + 4e⁻   |   Overall: 2 Al₂O₃ + 3 C → 4 Al + 3 CO₂",
    "keys": [
      "hall heroult process",
      "cryolite role",
      "fluorspar",
      "aluminium extraction",
      "carbon anode consumption"
    ],
    "symbols": [
      "Electrolyte: purified Al₂O₃ (2–8%) dissolved in molten Cryolite (Na₃AlF₆) + Fluorspar (CaF₂)",
      "Temperature: ~1220 K (950 °C)"
    ],
    "notes": [
      "Role of Cryolite (Na₃AlF₆) and Fluorspar (CaF₂): 1) Lowers melting point of alumina from 2320 K to ~1220 K; 2) Increases electrical conductivity of the molten melt.",
      "Carbon anodes are gradually burned away by evolving oxygen to form CO and CO₂, requiring ~0.5 kg of carbon anode per kg of aluminium produced."
    ],
    "example": "Each metric ton of aluminium metal produced consumes about half a ton of graphite anode blocks.",
    "latex": "\\text{Cathode: } \\ce{Al^3+ + 3e- -> Al(l)}, \\quad \\text{Anode: } \\ce{C(s) + 2O^2- -> CO2(g) + 4e-}, \\quad \\ce{2Al2O3 + 3C -> 4Al + 3CO2}"
  },
  {
    "id": "cyanide_extraction_silver_gold",
    "branch": "Inorganic",
    "chapter": "General Principles of Metallurgy",
    "title": "MacArthur–Forrest Cyanide Extraction of Gold and Silver",
    "expr": "4 Au + 8 NaCN + 2 H₂O + O₂ → 4 Na[Au(CN)₂] (Soluble Complex) + 4 NaOH   |   2 Na[Au(CN)₂] + Zn → Na₂[Zn(CN)₄] + 2 Au↓",
    "keys": [
      "macarthur forrest",
      "cyanide process",
      "leaching gold silver",
      "zinc displacement"
    ],
    "symbols": [
      "O₂ from atmospheric air acts as oxidising agent to oxidise Au⁰ to Au⁺",
      "Zinc is a stronger reducing agent (E°(Zn²⁺/Zn) = −0.76 V vs E°(Au⁺/Au) = +1.69 V) and displaces gold quantitatively"
    ],
    "notes": [
      "Hydrometallurgical extraction process: avoids high-temperature smelting for low-grade ores."
    ],
    "example": "Fine gold dust is recovered from cyanide leach liquor by filtering out the precipitated gold following zinc dust addition.",
    "latex": "\\ce{4Au + 8NaCN + 2H2O + O2 -> 4Na[Au(CN)2] + 4NaOH} \\quad \\Big| \\quad \\ce{2Na[Au(CN)2] + Zn -> Na2[Zn(CN)4] + 2Au v}"
  },
  {
    "id": "mond_van_arkel_refining",
    "branch": "Inorganic",
    "chapter": "General Principles of Metallurgy",
    "title": "Mond Process & van Arkel–de Boer Refining Reactions",
    "expr": "Mond (Ni): Ni + 4CO (330–350 K) → Ni(CO)₄ —450–470 K→ Ni + 4CO   |   van Arkel (Zr/Ti): Zr + 2I₂ (870 K) → ZrI₄ —2075 K (W filament)→ Zr + 2I₂",
    "keys": [
      "mond process",
      "van arkel de boer",
      "vapour phase refining",
      "nickel refining",
      "zirconium titanium"
    ],
    "symbols": [
      "Volatile compound formed at low temperature decomposes into pure metal at higher temperature"
    ],
    "notes": [
      "Both methods rely on Vapour Phase Refining: the metal forms a volatile, unstable compound with the reagent, while impurities remain non-volatile."
    ],
    "example": "Zirconium iodide vapour decomposes on an electrically heated tungsten filament at 2075 K to deposit ultrapure Zr metal.",
    "latex": "\\textbf{Mond: } \\ce{Ni + 4CO ->[330\\text{--}350\\text{ K}] Ni(CO)4 ^ ->[450\\text{--}470\\text{ K}] Ni + 4CO ^} \\quad \\Big| \\quad \\textbf{van Arkel: } \\ce{Zr + 2I2 ->[870\\text{ K}] ZrI4 ->[2075\\text{ K}] Zr + 2I2}"
  },
  {
    "id": "zone_refining_semiconductors",
    "branch": "Inorganic",
    "chapter": "General Principles of Metallurgy",
    "title": "Zone Refining (Fractional Crystallisation)",
    "expr": "Segregation Coefficient k = C_solid / C_liquid < 1   (Impurities are more soluble in the molten melt)",
    "keys": [
      "zone refining",
      "ultrapure silicon germanium",
      "semiconductor refining",
      "fractional crystallisation"
    ],
    "symbols": [
      "Circular mobile heater slowly moves along an impure metal rod in an inert atmosphere (Ar/N₂)",
      "Pure metal recrystallises behind the heater; molten zone carries concentrated impurities to the end, which is cut off"
    ],
    "notes": [
      "Used to produce ultrapure (99.9999% purity) semiconductors: Silicon (Si), Germanium (Ge), Gallium (Ga), Indium (In), Boron (B)."
    ],
    "example": "Multiple passes of the induction heater produce semiconductor-grade silicon.",
    "latex": "\\text{Fractional crystallisation based on higher solubility of impurities in molten state than solid state}"
  },
  {
    "id": "clarks_method_softening",
    "branch": "Inorganic",
    "chapter": "Hydrogen",
    "title": "Clark's Lime Method for Temporary Hardness",
    "expr": "Ca(HCO₃)₂ + Ca(OH)₂ → 2 CaCO₃↓ + 2 H₂O   |   Mg(HCO₃)₂ + 2 Ca(OH)₂ → 2 CaCO₃↓ + Mg(OH)₂↓ + 2 H₂O",
    "keys": [
      "clarks method",
      "lime water softening",
      "slaked lime",
      "temporary hardness removal"
    ],
    "symbols": [
      "Ca(OH)₂: slaked lime added in calculated quantity"
    ],
    "notes": [
      "Excess lime must be strictly avoided; excess Ca(OH)₂ would introduce artificial hardness into the water."
    ],
    "example": "Calculated lime precipitates soluble bicarbonates as insoluble calcium carbonate and magnesium hydroxide.",
    "latex": "\\ce{Ca(HCO3)2 + Ca(OH)2 -> 2CaCO3 v + 2H2O} \\quad \\Big| \\quad \\ce{Mg(HCO3)2 + 2Ca(OH)2 -> 2CaCO3 v + Mg(OH)2 v + 2H2O}"
  },
  {
    "id": "white_vs_red_phosphorus",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Allotropes of Phosphorus: White vs Red Phosphorus",
    "expr": "White P₄ (Discrete Tetrahedra, 60° angle, ignites at 303 K)   |   Red P₄ (Polymeric Chain, non-toxic, ignites at 533 K)",
    "keys": [
      "white phosphorus",
      "red phosphorus",
      "allotropes of phosphorus",
      "chemiluminescence"
    ],
    "symbols": [
      "White P: discrete P₄ tetrahedral molecules, severe ring strain (P–P–P angle 60° instead of 109.5°)",
      "Red P: chain of P₄ tetrahedra formed by heating white P at 573 K in inert atmosphere"
    ],
    "notes": [
      "White P is soft, waxy, poisonous, glows in dark (chemiluminescence), insoluble in water but soluble in CS₂.",
      "Red P is an odorless, non-poisonous, insoluble iron-grey solid."
    ],
    "example": "White phosphorus catches fire spontaneously in air, so it is preserved submerged in water.",
    "latex": "\\text{White } \\ce{P4} \\; (T_d, 60^\\circ, T_{\\text{ignite}} = 303\\text{ K}, \\text{toxic}) \\quad \\Big| \\quad \\text{Red } \\ce{P4} \\; (\\text{polymeric chain, non-toxic}, T_{\\text{ignite}} = 533\\text{ K})"
  },
  {
    "id": "boric_acid_lewis_acidity",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Boric Acid (H₃BO₃) as Monobasic Lewis Acid",
    "expr": "B(OH)₃ + 2 H₂O ⇌ [B(OH)₄]⁻ + H₃O⁺   (pK_a = 9.25)",
    "keys": [
      "boric acid",
      "monobasic lewis acid",
      "polyol titration",
      "mannitol cis diol"
    ],
    "symbols": [
      "Boric acid does NOT release protons from its own molecule; it accepts OH⁻ from water, releasing H₃O⁺"
    ],
    "notes": [
      "Cannot be titrated directly with NaOH because it is too weak (pK_a = 9.25, end point not sharp).",
      "Addition of cis-diols (mannitol, glycerol, sorbitol) forms stable bidentate chelate complex with [B(OH)₄]⁻, increasing its acidity enormously and allowing sharp titration with phenolphthalein."
    ],
    "example": "Boric acid behaves as a strong monobasic acid in the presence of excess mannitol.",
    "latex": "\\ce{B(OH)3 + 2H2O <=> [B(OH)4]- + H3O+} \\quad (\\text{monobasic Lewis acid, accepts } \\ce{OH-})"
  },
  {
    "id": "brown_ring_test_chemistry",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Brown Ring Test Chemistry for Nitrate Ions",
    "expr": "NO₃⁻ + 3Fe²⁺ + 4H⁺ → 3Fe³⁺ + NO + 2H₂O   |   [Fe(H₂O)₆]²⁺ + NO → [Fe(H₂O)₅(NO)]²⁺ (Brown Ring) + H₂O",
    "keys": [
      "brown ring test",
      "nitrate test",
      "nitrosonium complex",
      "fe oxidation state"
    ],
    "symbols": [
      "In brown ring complex [Fe(H₂O)₅(NO)]²⁺, NO transfers 1 electron to Fe³⁺, so Fe is in +1 oxidation state and NO is NO⁺ (nitrosonium)",
      "Unpaired electrons = 3, magnetic moment μ = √15 ≈ 3.87 BM"
    ],
    "notes": [
      "Iconic JEE problem on transition metal oxidation states."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: NO₃⁻ + 3Fe²⁺ + 4H⁺ → 3Fe³⁺ + NO + 2H₂O   |   [Fe(H₂O)₆]²⁺ + NO → [Fe(H₂O)₅(NO)]²⁺ (Brown Ring) + H₂O",
    "latex": "\\ce{NO3- + 3Fe^2+ + 4H+ -> 3Fe^3+ + NO + 2H2O}, \\quad \\ce{[Fe(H2O)6]^2+ + NO -> [Fe(H2O)5(NO)]^2+ \\text{ (Brown Ring)} + H2O}"
  },
  {
    "id": "fullerene_c60_geometry",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Buckminsterfullerene (C₆₀) Truncated Icosahedron Structure",
    "expr": "C₆₀: 20 Six-Membered Rings (Hexagons)   +   12 Five-Membered Rings (Pentagons)",
    "keys": [
      "fullerene c60",
      "buckminsterfullerene",
      "truncated icosahedron",
      "buckyball"
    ],
    "symbols": [
      "All 60 carbon atoms are sp² hybridized",
      "Contains single bonds (1.43 Å) and double bonds (1.38 Å)"
    ],
    "notes": [
      "Hexagons fuse with both hexagons and pentagons; pentagons fuse ONLY with hexagons (isolated pentagon rule).",
      "Aromatic, reacts with alkali metals to form superconducting fullerides like K₃C₆₀."
    ],
    "example": "C₆₀ forms dark magenta/purple solutions in non-polar organic solvents like toluene.",
    "latex": "\\ce{C60}: 20 \\text{ Six-Membered Rings (Hexagons)} + 12 \\text{ Five-Membered Rings (Pentagons)}"
  },
  {
    "id": "catenation_group14_trend",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Catenation Tendency & Bond Energies in Group 14",
    "expr": "Catenation Order: C >> Si > Ge ≈ Sn > Pb   |   Bond Enthalpy: C−C (348) > Si−Si (297) > Ge−Ge (260) > Sn−Sn (240 kJ mol⁻¹)",
    "keys": [
      "catenation group 14",
      "carbon catenation",
      "single bond energy"
    ],
    "symbols": [
      "Catenation: ability of atoms of same element to form long stable chains and rings"
    ],
    "notes": [
      "Carbon exhibits the highest catenation due to strong C–C bond energy and small atomic size.",
      "Lead (Pb) does not exhibit catenation."
    ],
    "example": "Carbon forms millions of organic compounds based on chains and rings of C–C bonds.",
    "latex": "\\text{Catenation: } \\ce{C \\gg Si > Ge \\approx Sn > Pb} \\quad \\Big| \\quad \\text{Bond Enthalpy: } \\ce{C-C (348)} > \\ce{Si-Si (297)} > \\ce{Ge-Ge (260)} > \\ce{Sn-Sn (240\\text{ kJ/mol})}"
  },
  {
    "id": "contact_process_sulfuric_acid",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Contact Process for Sulfuric Acid (H₂SO₄) Manufacture",
    "expr": "2SO₂ + O₂ ⇌ 2SO₃ (V₂O₅ catalyst, 720 K, 2 bar)   |   SO₃ + H₂SO₄ → H₂S₂O₇ (Oleum) —H₂O→ 2H₂SO₄",
    "keys": [
      "contact process",
      "sulfuric acid manufacture",
      "oleum",
      "v2o5 catalyst"
    ],
    "symbols": [
      "Key step: 2SO₂ + O₂ ⇌ 2SO₃ is exothermic (ΔH = −196.6 kJ)"
    ],
    "notes": [
      "Direct absorption of SO₃ in water is avoided because it forms a dense, uncontrollable fog of sulfuric acid mist."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: 2SO₂ + O₂ ⇌ 2SO₃ (V₂O₅ catalyst, 720 K, 2 bar)   |   SO₃ + H₂SO₄ → H₂S₂O₇ (Oleum) —H₂O→ 2H₂SO₄",
    "latex": "\\ce{2SO2 + O2 ->[\\ce{V2O5}][720\\text{ K}, 2\\text{ bar}] 2SO3}, \\quad \\ce{SO3 + H2SO4 -> H2S2O7 \\text{ (Oleum)}}, \\quad \\ce{H2S2O7 + H2O -> 2H2SO4}"
  },
  {
    "id": "diborane_banana_bonding",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Diborane (B₂H₆) 3-Centre 2-Electron Banana Bonds",
    "expr": "B₂H₆: 4 Terminal 2c−2e B−H Bonds (1.19 Å)   +   2 Bridge 3c−2e B−H−B Bonds (1.33 Å)",
    "keys": [
      "diborane",
      "banana bond",
      "3c 2e bond",
      "electron deficient hydride",
      "boron bonding"
    ],
    "symbols": [
      "Each Boron is sp³ hybridized",
      "Bridge B–H–B angle ≈ 83°; Terminal H–B–H angle ≈ 121°",
      "Total valence electrons = (2 × 3) + (6 × 1) = 12 electrons"
    ],
    "notes": [
      "Diborane is electron-deficient; cleaves with Lewis bases: soft/bulky bases (CO, Me₃N) give symmetrical cleavage (2 BH₃·L); hard/small bases (NH₃ at low temp) give unsymmetrical cleavage ([H₂B(NH₃)₂]⁺ [BH₄]⁻)."
    ],
    "example": "Heating B₂H₆ with excess NH₃ at 450 K gives Inorganic Benzene (Borazine, B₃N₃H₆).",
    "latex": "\\ce{B2H6}: 4 \\text{ Terminal } 2c\\text{--}2e \\text{ B--H (1.19 \\AA)} + 2 \\text{ Bridge } 3c\\text{--}2e \\text{ B--H--B (1.33 \\AA, banana bonds)}"
  },
  {
    "id": "xenon_fluorides_hydrolysis",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Hydrolysis Equations of Xenon Fluorides",
    "expr": "2XeF₂ + 2H₂O → 2Xe + 4HF + O₂   |   6XeF₄ + 12H₂O → 2XeO₃ + 4Xe + 3O₂ + 24HF   |   XeF₆ + 3H₂O → XeO₃ + 6HF",
    "keys": [
      "xenon fluorides",
      "hydrolysis of xef2 xef4 xef6",
      "noble gas chemistry",
      "disproportionation"
    ],
    "symbols": [
      "XeF₂ hydrolysis: redox (Xe²⁺ is reduced to Xe, H₂O is oxidised to O₂)",
      "XeF₄ hydrolysis: DISPROPORTIONATION (Xe⁴⁺ goes to Xe⁰ and Xe⁶⁺ in XeO₃)",
      "XeF₆ complete hydrolysis: non-redox (Xe remains +6 in XeO₃)",
      "XeF₆ partial hydrolysis: XeF₆ + H₂O → XeOF₄ + 2HF; XeF₆ + 2H₂O → XeO₂F₂ + 4HF"
    ],
    "notes": [
      "XeO₃ is a colourless, dangerously explosive solid with pyramidal shape.",
      "XeF₆ CANNOT be stored in glass or silica vessels: 2XeF₆ + SiO₂ → 2XeOF₄ + SiF₄."
    ],
    "example": "Partial hydrolysis of XeF₆ with 1 equivalent of water produces xenon oxytetrafluoride (XeOF₄).",
    "latex": "\\ce{6XeF4 + 12H2O -> 4Xe + 2XeO3 + 24HF + 3O2} \\quad \\Big| \\quad \\ce{XeF6 + 3H2O -> XeO3 + 6HF}"
  },
  {
    "id": "inert_pair_effect",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Inert Pair Effect & Lower Oxidation State Stability",
    "expr": "Stability of lower O.S. (Group − 2): Tl⁺ > Tl³⁺   ,   Pb²⁺ > Pb⁴⁺   ,   Bi³⁺ > Bi⁵⁺",
    "keys": [
      "inert pair effect",
      "oxidation state stability",
      "thallium lead bismuth"
    ],
    "symbols": [
      "Inert pair effect: reluctance of the valence ns² electrons to participate in bonding in heavier post-transition p-block elements"
    ],
    "notes": [
      "Originates from high effective nuclear charge and relativistic contraction of 6s electrons in period 6 elements.",
      "TlCl is a stable ionic compound, while TlCl₃ decomposes on heating.",
      "PbO₂ and BiO₃⁻ are powerful oxidising agents because Pb(IV) and Bi(V) readily accept 2 electrons to attain the stable +2 and +3 states."
    ],
    "example": "PbO₂ + 4 HCl → PbCl₂ + Cl₂ + 2 H₂O (Pb⁴⁺ oxidises Cl⁻ to Cl₂ gas).",
    "latex": "\\text{Stability of Lower O.S.: } \\ce{Tl+ > Tl^3+}, \\quad \\ce{Pb^2+ > Pb^4+}, \\quad \\ce{Bi^3+ > Bi^5+}"
  },
  {
    "id": "interhalogen_compounds_geometry",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Interhalogen Compounds (XX'n) Structures",
    "expr": "XX' (linear) , XX'₃ (T-shaped, sp³d) , XX'₅ (square pyramidal, sp³d²) , XX'₇ (pentagonal bipyramidal, sp³d³)",
    "keys": [
      "interhalogen compounds",
      "if7",
      "clf3",
      "brf5"
    ],
    "symbols": [
      "Central halogen X is larger than surrounding X'"
    ],
    "notes": [
      "IF₇ is the only interhalogen of type XX'₇ due to maximum size difference between I and F."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: XX' (linear) , XX'₃ (T-shaped, sp³d) , XX'₅ (square pyramidal, sp³d²) , XX'₇ (pentagonal bipyramidal, sp³d³)",
    "latex": "\\ce{XX'} \\; (\\text{linear}) \\quad \\Big| \\quad \\ce{XX'_3} \\; (\\text{T-shaped, } sp^3d) \\quad \\Big| \\quad \\ce{XX'_5} \\; (\\text{sq. pyramidal, } sp^3d^2) \\quad \\Big| \\quad \\ce{XX'_7} \\; (\\text{pentagonal bipyramidal, } sp^3d^3)"
  },
  {
    "id": "ostwald_nitric_acid_reactions",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Ostwald Process for Nitric Acid (HNO₃) Manufacture",
    "expr": "4NH₃ + 5O₂ —Pt/Rh (1050 K)→ 4NO + 6H₂O   |   2NO + O₂ → 2NO₂   |   3NO₂ + H₂O → 2HNO₃ + NO",
    "keys": [
      "ostwald process",
      "nitric acid manufacture",
      "catalytic oxidation ammonia"
    ],
    "symbols": [
      "Overall: NH₃ + 2O₂ → HNO₃ + H₂O"
    ],
    "notes": [
      "Catalyst: Pt–Rh gauge at 1050 K and 5 bar."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: 4NH₃ + 5O₂ —Pt/Rh (1050 K)→ 4NO + 6H₂O   |   2NO + O₂ → 2NO₂   |   3NO₂ + H₂O → 2HNO₃ + NO",
    "latex": "\\ce{4NH3 + 5O2 ->[\\text{Pt-Rh}][1100\\text{ K}] 4NO + 6H2O}, \\quad \\ce{2NO + O2 -> 2NO2}, \\quad \\ce{3NO2 + H2O -> 2HNO3 + NO}"
  },
  {
    "id": "oxoacids_phosphorus",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Oxoacids of Phosphorus & Reducing Power",
    "expr": "H₃PO₂ (Hypophosphorous, 1 P–OH, 2 P–H)   |   H₃PO₃ (Phosphorous, 2 P–OH, 1 P–H)   |   H₃PO₄ (Phosphoric, 3 P–OH, 0 P–H)",
    "keys": [
      "oxoacids of phosphorus",
      "reducing property",
      "basicity of acid",
      "p-h bond"
    ],
    "symbols": [
      "Basicity = number of ionisable P–OH bonds",
      "Reducing power = presence of direct P–H bonds"
    ],
    "notes": [
      "H₃PO₂ is MONOBASIC and a powerful reducing agent (e.g. reduces AgNO₃ to metallic Ag, and reduces diazonium salts ArN₂⁺ to arenes ArH).",
      "H₃PO₃ is DIBASIC and moderately reducing.",
      "H₃PO₄ is TRIBASIC and has NO reducing properties (0 P–H bonds)."
    ],
    "example": "H₃PO₂ + 4 AgNO₃ + 2 H₂O → 4 Ag(s) + H₃PO₄ + 4 HNO₃.",
    "latex": "\\ce{H3PO2} \\; (1 \\text{ P--OH, monobasic}) \\quad \\Big| \\quad \\ce{H3PO3} \\; (2 \\text{ P--OH, dibasic}) \\quad \\Big| \\quad \\ce{H3PO4} \\; (3 \\text{ P--OH, tribasic})"
  },
  {
    "id": "phosphorus_oxoacids_basicity",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Oxoacids of Phosphorus: Basicity & Reducing Power",
    "expr": "Basicity = Number of P−OH Bonds   |   Reducing Power = Number of P−H Bonds",
    "keys": [
      "oxoacids of phosphorus",
      "hypophosphorous acid",
      "phosphorous acid",
      "orthophosphoric acid",
      "basicity"
    ],
    "symbols": [
      "Hypophosphorous (H₃PO₂): +1, Monobasic (1 P–OH), 2 P–H bonds => Strong reducing agent",
      "Phosphorous (H₃PO₃): +3, Dibasic (2 P–OH), 1 P–H bond => Good reducing agent",
      "Orthophosphoric (H₃PO₄): +5, Tribasic (3 P–OH), 0 P–H bonds => Non-reducing",
      "Pyrophosphoric (H₄P₂O₇): +5, Tetrabasic (4 P–OH), 0 P–H bonds, contains P–O–P bridge"
    ],
    "notes": [
      "P–H bonds reduce heavy metal salts: H₃PO₂ + 4 AgNO₃ + 2 H₂O → 4 Ag↓ + H₃PO₄ + 4 HNO₃.",
      "Only H atoms attached to O (P–OH) are ionisable in aqueous solution."
    ],
    "example": "H₃PO₂ is monobasic because its structure is O=P(H)₂(OH); only the single OH proton ionises.",
    "latex": "\\ce{H3PO2} \\; (\\text{reducing, 2 P--H}) \\quad \\Big| \\quad \\ce{H3PO3} \\; (\\text{reducing, 1 P--H}) \\quad \\Big| \\quad \\ce{H3PO4} \\; (\\text{non-reducing, 0 P--H})"
  },
  {
    "id": "sulfur_oxoacids_peroxo_links",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Oxoacids of Sulfur & Peroxo-Bonds",
    "expr": "Caro's Acid: H₂SO₅ (O=S(=O)(OH)(O−OH))   |   Marshall's Acid: H₂S₂O₈ (HO−SO₂−O−O−SO₂−OH)",
    "keys": [
      "caros acid",
      "marshalls acid",
      "peroxomonosulfuric acid",
      "peroxodisulfuric acid",
      "oxidation state of sulfur"
    ],
    "symbols": [
      "Caro's acid: peroxomonosulfuric acid (one peroxo –O–O– bond)",
      "Marshall's acid: peroxodisulfuric acid (one peroxo bridge)",
      "Oleum: H₂S₂O₇ (pyrosulfuric acid, S–O–S bridge, no peroxo link)"
    ],
    "notes": [
      "Calculated oxidation state of S in H₂SO₅ appears +8, but maximum covalency of S is 6; true oxidation state is +6 because two oxygens form a peroxo bond (−1 each).",
      "Oxidation state of S in Marshall's acid H₂S₂O₈ is also +6."
    ],
    "example": "In H₂SO₅: 2(+1) + S + 3(−2) + 2(−1) = 0 => S = +6.",
    "latex": "\\ce{H2SO5} \\text{ (Caro's acid: 1 peroxo link)} \\quad \\Big| \\quad \\ce{H2S2O8} \\text{ (Marshall's acid: 1 peroxo link } \\ce{-O-O-})"
  },
  {
    "id": "silicates_classification_formula",
    "branch": "Inorganic",
    "chapter": "p-Block Elements",
    "title": "Silicate Mineral Classification & Formula Frameworks",
    "expr": "General Unit: [SiO₄]⁴⁻ Tetrahedron   |   Sharing n corners gives formula: [Si_x O_y]^(2y − 4x)−",
    "keys": [
      "silicates classification",
      "orthosilicate",
      "pyrosilicate",
      "chain silicate",
      "sheet silicate",
      "zeolites"
    ],
    "symbols": [
      "0 corners shared: Orthosilicate [SiO₄]⁴⁻ (e.g. Zircon ZrSiO₄, Forsterite Mg₂SiO₄)",
      "1 corner shared: Pyrosilicate / Sorosilicate [Si₂O₇]⁶⁻ (e.g. Thortveitite Sc₂Si₂O₇)",
      "2 corners shared (cyclic): [(SiO₃)_n]²ⁿ⁻ (e.g. Beryl Be₃Al₂(SiO₃)₆)",
      "2 corners shared (single chain / pyroxenes): [(SiO₃)_n]²ⁿ⁻ (e.g. Enstatite MgSiO₃)",
      "2.5 corners shared (double chain / amphiboles): [(Si₄O₁₁)⁴⁻]_n (e.g. Asbestos)",
      "3 corners shared (sheet / phyllosilicates): [(Si₂O₅)²⁻]_n (e.g. Talc, Mica, Clay)",
      "4 corners shared (3D framework / tectosilicates): [SiO₂]_n (e.g. Quartz, Feldspar, Zeolites)"
    ],
    "notes": [
      "Zeolites are microporous aluminosilicates (Al³⁺ replaces Si⁴⁺, requiring cations like Na⁺, Ca²⁺ to balance charge; used as shape-selective catalysts like ZSM-5)."
    ],
    "example": "In beryl Be₃Al₂Si₆O₁₈, the silicate unit is cyclic [Si₆O₁₈]¹²⁻ formed by sharing 2 corners of 6 tetrahedra.",
    "latex": "\\text{General Unit: } [\\ce{SiO4}]^{4-}, \\quad \\text{Sharing } n \\text{ corners: } [\\ce{Si}_x\\ce{O}_y]^{(2y - 4x)-}"
  },
  {
    "id": "borax_bead_test",
    "branch": "Inorganic",
    "chapter": "p-Block Elements & Salt Analysis",
    "title": "Borax Bead Test Chemistry",
    "expr": "Na₂B₄O₇·10H₂O —heat→ 2 NaBO₂ + B₂O₃ (glassy bead)   =>   CoO + B₂O₃ → Co(BO₂)₂ (Deep Blue)",
    "keys": [
      "borax bead test",
      "metaborate",
      "qualitative analysis",
      "cobalt metaborate"
    ],
    "symbols": [
      "B₂O₃: acidic boric anhydride melts into a transparent glassy bead with sodium metaborate NaBO₂"
    ],
    "notes": [
      "Co: Deep Blue bead in both oxidising and reducing flames.",
      "Cu: Light Blue in oxidising flame, Red opaque in reducing flame (due to metallic Cu).",
      "Cr: Dark Green bead in both flames.",
      "Ni: Brown in oxidising flame, Grey opaque in reducing flame (Ni metal)."
    ],
    "example": "Co²⁺ salt on a platinum loop with borax gives a deep blue bead of cobalt metaborate Co(BO₂)₂.",
    "latex": "\\ce{Na2B4O7 \\cdot 10H2O ->[\\Delta] Na2B4O7 ->[\\Delta] 2NaBO2 + B2O3 \\text{ (glassy bead)}}, \\quad \\ce{CuO + B2O3 -> Cu(BO2)2 \\text{ (blue bead)}}"
  },
  {
    "id": "borax_bead_test_reactions",
    "branch": "Inorganic",
    "chapter": "Qualitative Analysis",
    "title": "Borax Bead Test Chemistry & Transition Metal Colours",
    "expr": "Na₂B₄O₇ · 10H₂O —heat→ 2 NaBO₂ + B₂O₃ (Glassy Bead)   |   B₂O₃ + CuO —oxidising flame→ Cu(BO₂)₂ (Sky Blue Bead)",
    "keys": [
      "borax bead test",
      "metaborates",
      "transition metal beads",
      "glassy bead"
    ],
    "symbols": [
      "B₂O₃: basic boric anhydride in transparent glassy bead",
      "Forms characteristic coloured transition metal metaborates"
    ],
    "notes": [
      "Copper (Cu²⁺): Sky blue in oxidising flame; red opaque (Cu) in reducing flame.",
      "Cobalt (Co²⁺): Intense deep blue in BOTH oxidising and reducing flames (due to Co(BO₂)₂).",
      "Chromium (Cr³⁺): Dark green in both oxidising and reducing flames.",
      "Iron (Fe³⁺): Yellowish-brown in oxidising flame; dirty green (Fe²⁺) in reducing flame.",
      "Nickel (Ni²⁺): Brownish-red in oxidising flame; grey-black in reducing flame."
    ],
    "example": "Cobalt salt gives an intense, unmistakable blue bead in both oxidising and reducing flames.",
    "latex": "\\ce{Na2B4O7 \\cdot 10H2O ->[\\Delta] 2NaBO2 + B2O3 \\text{ (Glassy Bead)}} \\quad \\Big| \\quad \\ce{B2O3 + CuO ->[\\Delta] Cu(BO2)2 \\text{ (Sky Blue Bead)}}"
  },
  {
    "id": "flame_test_emission_colours",
    "branch": "Inorganic",
    "chapter": "Qualitative Analysis",
    "title": "Flame Test Characteristic Atomic Emission Colours",
    "expr": "Excited valence electrons de-excite to emit characteristic visible light photons: ΔE = h · c / λ",
    "keys": [
      "flame test colours",
      "alkali metal flames",
      "alkaline earth flames",
      "platinum wire"
    ],
    "symbols": [
      "Lithium (Li⁺): Crimson Red (670.8 nm)",
      "Sodium (Na⁺): Persistent Golden Yellow (589 nm)",
      "Potassium (K⁺): Lilac / Violet (seen through cobalt blue glass as pink)",
      "Rubidium (Rb⁺): Reddish Violet",
      "Caesium (Cs⁺): Sky Blue",
      "Calcium (Ca²⁺): Brick Red",
      "Strontium (Sr²⁺): Crimson Red",
      "Barium (Ba²⁺): Apple Green",
      "Copper (Cu²⁺): Blue-Green"
    ],
    "notes": [
      "Beryllium (Be) and Magnesium (Mg) do NOT give flame tests because their valence electrons are tightly held by high nuclear charge; excitation energy lies outside the visible region.",
      "Cobalt blue glass absorbs yellow light from sodium contamination, allowing potassium lilac flame to be observed."
    ],
    "example": "A salt paste with conc. HCl gives an apple green flame on clean platinum wire: confirmed Barium (Ba²⁺).",
    "latex": "\\text{De-excitation of excited valence electrons: } \\Delta E = \\frac{h c}{\\lambda} \\implies \\text{Characteristic flame colour}"
  },
  {
    "id": "nessler_reagent_ammonia",
    "branch": "Inorganic",
    "chapter": "Qualitative Analysis",
    "title": "Nessler's Reagent Test for Ammonium (NH₄⁺) Ions",
    "expr": "2 K₂[HgI₄] + NH₃ + 3 KOH → H₂N−Hg−O−Hg−I↓ (Iodide of Millon's Base, Brown ppt) + 7 KI + 2 H₂O",
    "keys": [
      "nesslers reagent",
      "ammonium test",
      "millons base",
      "brown precipitate ammonia"
    ],
    "symbols": [
      "K₂[HgI₄]: alkaline potassium tetraiodomercurate(II) (Nessler's reagent)",
      "Product: Iodide of Millon's base (characteristic reddish-brown precipitate)"
    ],
    "notes": [
      "Extremely sensitive: even trace ppm concentrations of ammonia or ammonium salts give unmistakable brown precipitate or yellow coloration."
    ],
    "example": "Heating ammonium chloride with NaOH releases NH₃ gas, which turns filter paper dipped in Nessler's reagent instant brown.",
    "latex": "\\ce{2K2[HgI4] + NH3 + 3KOH -> H2N-Hg-O-Hg-I v \\text{ (Iodide of Millon's Base, Brown ppt)} + 7KI + 2H2O}"
  },
  {
    "id": "salt_analysis_group_reagents",
    "branch": "Inorganic",
    "chapter": "Qualitative Analysis",
    "title": "Systematic Group Reagents for Cation Analysis (Groups 0 to VI)",
    "expr": "Group Reagent Table for Qualitative Cation Separation",
    "keys": [
      "qualitative analysis cations",
      "group reagents",
      "solubility product precipitation",
      "ksp separation"
    ],
    "symbols": [
      "Group 0: NH₄⁺ — heated with NaOH => NH₃ gas (turns moist red litmus blue, gives dense white fumes with HCl)",
      "Group I: Pb²⁺, Ag⁺, Hg₂²⁺ — dilute HCl => insoluble chlorides (PbCl₂, AgCl, Hg₂Cl₂)",
      "Group II: Pb²⁺, Cu²⁺, Bi³⁺, Cd²⁺, As³⁺, Sb³⁺, Sn²⁺ — H₂S gas in dilute acidic medium (0.3 M HCl) => insoluble sulfides with very low Ksp",
      "Group III: Fe³⁺, Al³⁺, Cr³⁺ — NH₄OH in presence of NH₄Cl => insoluble hydroxides (Fe(OH)₃ reddish brown, Al(OH)₃ gelatinous white, Cr(OH)₃ green)",
      "Group IV: Co²⁺, Ni²⁺, Mn²⁺, Zn²⁺ — H₂S gas in alkaline medium (NH₄OH + NH₄Cl) => sulfides with moderate Ksp (NiS/CoS black, MnS buff/flesh, ZnS white)",
      "Group V: Ba²⁺, Sr²⁺, Ca²⁺ — (NH₄)₂CO₃ in presence of NH₄OH and NH₄Cl => insoluble carbonates (BaCO₃, SrCO₃, CaCO₃ white)",
      "Group VI: Mg²⁺ — Na₂HPO₄ in presence of NH₄OH => white crystalline precipitate of magnesium ammonium phosphate Mg(NH₄)PO₄"
    ],
    "notes": [
      "Why HCl in Group II: Common ion effect of H⁺ suppresses ionisation of H₂S, keeping [S²⁻] very low so only Group II sulfides (extremely small Ksp) precipitate.",
      "Why NH₄Cl in Group III: Common ion effect of NH₄⁺ suppresses [OH⁻], so only Group III hydroxides precipitate; Group IV, V, VI hydroxides (larger Ksp) remain in solution.",
      "Why NH₄OH in Group IV: Neutralises H⁺, shifting H₂S ⇌ 2H⁺ + S²⁻ forward, raising [S²⁻] sufficiently to precipitate Group IV sulfides."
    ],
    "example": "Adding dilute HCl to an unknown solution precipitates a white solid that dissolves in hot water: confirmed Group I Pb²⁺ (PbCl₂ is soluble in hot water).",
    "latex": "\\text{Group Reagents: } \\text{I: dil. } \\ce{HCl} \\quad \\Big| \\quad \\text{II: } \\ce{H2S / dil. HCl} \\quad \\Big| \\quad \\text{III: } \\ce{NH4OH / NH4Cl} \\quad \\Big| \\quad \\text{IV: } \\ce{H2S / NH4OH}"
  },
  {
    "id": "brown_ring_test",
    "branch": "Inorganic",
    "chapter": "Qualitative Inorganic Analysis",
    "title": "Brown Ring Test for Nitrate (NO₃⁻)",
    "expr": "NO₃⁻ + 3 Fe²⁺ + 4 H⁺ → NO + 3 Fe³⁺ + 2 H₂O   =>   [Fe(H₂O)₆]²⁺ + NO → [Fe(H₂O)₅(NO)]²⁺ (Brown Ring)",
    "keys": [
      "brown ring test",
      "nitrate test",
      "iron nitrosyl",
      "oxidation state of iron"
    ],
    "symbols": [
      "[Fe(H₂O)₅(NO)]²⁺: pentaaquanitrosyliron(I) sulfate complex"
    ],
    "notes": [
      "Oxidation state of Fe in the brown ring complex is +1 (d⁷ system), with NO coordinated as a nitrosonium cation NO⁺.",
      "The complex has 3 unpaired electrons (μ_s ≈ 3.87 BM) due to electron transfer from NO to Fe²⁺.",
      "Test is performed by adding freshly prepared FeSO₄ to nitrate solution, followed by trickling conc. H₂SO₄ down the test tube walls."
    ],
    "example": "Concentrated H₂SO₄ added along the walls of the tube forms a distinct dark brown ring at the interface.",
    "latex": "\\ce{NO3- + 3Fe^2+ + 4H+ -> NO + 3Fe^3+ + 2H2O}, \\quad \\ce{[Fe(H2O)6]^2+ + NO -> [Fe(H2O)5(NO)]^2+ \\text{ (Brown Ring)} + H2O}"
  },
  {
    "id": "plaster_of_paris_gypsum_reactions",
    "branch": "Inorganic",
    "chapter": "s-Block Elements",
    "title": "Plaster of Paris & Gypsum Setting Reactions",
    "expr": "CaSO₄ · 2H₂O (Gypsum) —393 K→ CaSO₄ · ½H₂O (POP) + 1½ H₂O   |   > 393 K: Dead Burnt Plaster (CaSO₄)",
    "keys": [
      "plaster of paris",
      "gypsum",
      "setting of plaster",
      "dead burnt plaster",
      "calcium compounds"
    ],
    "symbols": [
      "CaSO₄ · ½H₂O: calcium sulfate hemihydrate (POP)",
      "CaSO₄ · 2H₂O: calcium sulfate dihydrate (Gypsum)",
      "Anhydrous CaSO₄ formed above 393 K is dead burnt plaster and does not set readily with water."
    ],
    "notes": [
      "Setting of POP is an exothermic hydration reaction accompanied by a slight expansion in volume (ideal for making casts and statues)."
    ],
    "example": "Mixing POP with water: CaSO₄·½H₂O + 1.5 H₂O → CaSO₄·2H₂O (hard monoclinic gypsum crystals form within 10–15 min).",
    "latex": "\\ce{CaSO4 \\cdot 2H2O \\text{ (Gypsum)} ->[393\\text{ K}] CaSO4 \\cdot \\frac{1}{2}H2O \\text{ (POP)} + 1\\frac{1}{2}H2O ^} \\xrightarrow{>393\\text{ K}} \\ce{CaSO4 \\text{ (Dead Burnt)}}"
  },
  {
    "id": "thermal_stability_carbonates_sulfates",
    "branch": "Inorganic",
    "chapter": "s-Block Elements",
    "title": "Thermal Stability Trends of Group 1 & 2 Carbonates and Nitrates",
    "expr": "Thermal Stability ∝ 1 / (Ionic Potential ϕ of Cation) ∝ (Cation Size / Cation Charge)",
    "keys": [
      "thermal stability",
      "carbonates decomposition",
      "s block trends",
      "lattice energy vs hydration"
    ],
    "symbols": [
      "ϕ = z / r: polarising power of cation",
      "Decomposition: MCO₃ → MO + CO₂"
    ],
    "notes": [
      "Large polarisable oxyanions (CO₃²⁻, SO₄²⁻, NO₃⁻) are decomposed by small, highly polarising cations (polarisation distorts C–O bond into O²⁻ + CO₂).",
      "Group 2 stability order: BeCO₃ < MgCO₃ < CaCO₃ < SrCO₃ < BaCO₃.",
      "Group 1 carbonates (except Li₂CO₃) do NOT decompose on normal heating because alkali metal cations have low polarising power."
    ],
    "example": "Li₂CO₃ decomposes on gentle heating like MgCO₃ (diagonal relationship), while Na₂CO₃ melts without decomposing even at 1000 °C.",
    "latex": "\\text{Thermal Stability} \\propto \\frac{1}{\\text{Ionic Potential } \\phi} \\propto \\frac{\\text{Cation Size}}{\\text{Cation Charge}}"
  },
  {
    "id": "ether_cleavage_hi",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Cleavage of Ethers by Hydrogen Iodide (HI)",
    "expr": "R−O−R' + HI(excess) —heat→ R−I + R'−I + H₂O",
    "keys": [
      "cleavage of ethers",
      "ether hi mechanism",
      "zeisel method",
      "anisole cleavage"
    ],
    "symbols": [
      "With 1 equivalent of HI:",
      "If one alkyl group is 3° or benzyl/trityl: reaction proceeds by S_N1 at the 3° carbon, forming 3° alkyl iodide and 1° alcohol",
      "If both groups are 1° or 2°: reaction proceeds by S_N2 at the LESS HINDERED carbon"
    ],
    "notes": [
      "Alkyl aryl ethers (e.g. Anisole, C₆H₅OCH₃) with HI ALWAYS give Phenol (C₆H₅OH) and Alkyl Iodide (CH₃I) because the Ar–O bond has partial double bond character due to resonance and cannot be cleaved."
    ],
    "example": "(CH₃)₃C–O–CH₃ + HI → (CH₃)₃C–I (3° iodide via S_N1) + CH₃OH.",
    "latex": "\\ce{R-O-R' + HI(excess) ->[\\Delta] R-I + R'-I + H2O}"
  },
  {
    "id": "cumene_phenol_process",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Cumene Hydroperoxide Process for Industrial Phenol",
    "expr": "C₆H₅−CH(CH₃)₂ + O₂ → C₆H₅−C(CH₃)₂−OOH —dil. H₂SO₄→ C₆H₅OH + CH₃COCH₃",
    "keys": [
      "cumene process",
      "phenol preparation",
      "cumene hydroperoxide",
      "acetone byproduct"
    ],
    "symbols": [
      "Cumene: isopropylbenzene (prepared by Friedel–Crafts alkylation of benzene with propene)",
      "Byproduct: acetone (propanone), valuable industrial solvent"
    ],
    "notes": [
      "Rearrangement step involves phenyl migration to electron-deficient oxygen with loss of water."
    ],
    "example": "Most of the world's phenol is manufactured by this route because of the high commercial value of the acetone co-product.",
    "latex": "\\ce{C6H5-CH(CH3)2 + O2 -> C6H5-C(CH3)2-OOH} \\xrightarrow{\\text{dil. } \\ce{H2SO4}} \\ce{C6H5OH + CH3COCH3}"
  },
  {
    "id": "cleavage_oxiranes_acid_base",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Epoxide (Oxirane) Ring Opening: Acidic vs Basic Media",
    "expr": "Acidic: Nu attacks MORE substituted carbon (partial carbocation)   |   Basic: Nu⁻ attacks LESS substituted carbon (S_N2)",
    "keys": [
      "epoxide cleavage",
      "oxirane ring opening",
      "regioselective epoxide",
      "acid vs base cleavage"
    ],
    "symbols": [
      "Acidic (H⁺ + NuH): protonation of epoxide oxygen creates partial carbocation on the carbon best able to stabilize positive charge",
      "Basic (Nu⁻): standard S_N2 backside attack driven by steric accessibility"
    ],
    "notes": [
      "Reaction is stereospecifically ANTI (trans-1,2-diol derivative formed)."
    ],
    "example": "2,2-dimethyloxirane with CH₃OH/H⁺ gives 2-methoxy-2-methylpropan-1-ol; with CH₃O⁻/CH₃OH it gives 1-methoxy-2-methylpropan-2-ol.",
    "latex": "\\text{Acidic: Nu attacks more substituted C (carbocation)} \\quad \\Big| \\quad \\text{Basic: } \\ce{Nu-} \\text{ attacks less substituted C } (\\text{S}_\\text{N}2)"
  },
  {
    "id": "duas_phenol_neutral_fecl3",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Ferric Chloride (FeCl₃) Test for Phenolic Group",
    "expr": "6 C₆H₅OH + FeCl₃ → [Fe(OC₆H₅)₆]³⁻ (Violet/Purple Complex) + 3 H⁺ + 3 HCl",
    "keys": [
      "fecl3 test",
      "ferric chloride test",
      "phenolic oh",
      "violet complex"
    ],
    "symbols": [
      "Neutral FeCl₃ reacts with enols and phenols to form intensely coloured coordination complexes (violet, purple, green, or blue)",
      "[Fe(OAr)₆]³⁻: hexa-phenoxy ferrate(III) ion"
    ],
    "notes": [
      "Aliphatic alcohols (methanol, ethanol) do NOT give this colour reaction.",
      "Enols (like acetoacetic ester) also give violet coloration due to =C–OH group."
    ],
    "example": "Phenol and salicylic acid both give intense violet colour with neutral FeCl₃; benzoic acid gives a buff precipitate of ferric benzoate.",
    "latex": "\\ce{6 C6H5OH + FeCl3 -> [Fe(OC6H5)6]^3- \\text{ (Violet Complex)} + 3H+ + 3HCl}"
  },
  {
    "id": "fries_rearrangement",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Fries Rearrangement of Phenolic Esters",
    "expr": "C₆H₅−O−COCH₃ (Phenyl Acetate) —anhyd. AlCl₃ (heat)→ o- & p-Hydroxyacetophenone",
    "keys": [
      "fries rearrangement",
      "phenyl ester to hydroxy ketone",
      "ortho para isomers",
      "kinetic vs thermodynamic"
    ],
    "symbols": [
      "Lewis acid AlCl₃ coordinates with ester oxygen, cleaving acylium ion CH₃C≡O⁺ which attacks ring"
    ],
    "notes": [
      "Low temperature (333 K, 60 °C) favours PARA isomer (kinetic control).",
      "High temperature (433 K, 160 °C) favours ORTHO isomer (thermodynamic control, stabilized by intramolecular H-bonding)."
    ],
    "example": "Heating phenyl acetate with AlCl₃ at 160 °C yields o-hydroxyacetophenone as major product.",
    "latex": "\\ce{C6H5OCOCH3 ->[\\text{anhyd. } \\ce{AlCl3}][\\Delta] \\textit{o}- \\& \\textit{p}-hydroxyacetophenone}"
  },
  {
    "id": "libermann_nitroso_phenol",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Liebermann's Nitroso Reaction for Phenol",
    "expr": "Phenol + NaNO₂ / conc. H₂SO₄ → p-nitrosophenol ⇌ Indophenol (Deep Green/Blue) —dilute with water→ Red —add NaOH→ Deep Blue",
    "keys": [
      "liebermann nitroso test",
      "phenol test",
      "indophenol blue",
      "deep green to red to blue"
    ],
    "symbols": [
      "Specific diagnostic reaction for phenols having free para position"
    ],
    "notes": [
      "Mnemonic for colour sequence: Blue/Green → Red → Blue."
    ],
    "example": "Phenol warmed with NaNO₂ and conc. H₂SO₄ produces green colour, turns red on pouring into water, and deep blue on making alkaline.",
    "latex": "\\ce{Phenol + NaNO2 + conc. H2SO4 -> \\textit{p}-nitrosophenol <=> Indophenol} \\xrightarrow{\\ce{H2O}} \\text{Red} \\xrightarrow{\\ce{NaOH}} \\text{Deep Blue}"
  },
  {
    "id": "lucas_test_kinetics",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Lucas Test for Distinguishing 1°, 2°, and 3° Alcohols",
    "expr": "R−OH + conc. HCl / anhyd. ZnCl₂ → R−Cl↓ (turbidity) + H₂O",
    "keys": [
      "lucas test",
      "lucas reagent",
      "alcohol classification",
      "turbidity"
    ],
    "symbols": [
      "Lucas reagent: equimolar mixture of conc. HCl and anhydrous ZnCl₂ (Lewis acid catalyst)",
      "Turbidity due to insoluble alkyl chloride formation via carbocation intermediate (S_N1)"
    ],
    "notes": [
      "3° Alcohols: Instant turbidity at room temperature (within seconds).",
      "2° Alcohols: Turbidity appears in 5 minutes.",
      "1° Alcohols: Solution remains clear at room temperature; turbidity appears only upon heating.",
      "Allyl and benzyl alcohols are 1° but react instantly like 3° alcohols due to resonance-stabilized carbocations."
    ],
    "example": "tert-butanol reacts instantly with Lucas reagent, while 1-butanol remains clear.",
    "latex": "\\ce{R-OH + conc. HCl ->[\\text{anhyd. } \\ce{ZnCl2}] R-Cl v \\text{ (turbidity)} + H2O}"
  },
  {
    "id": "oxymercuration_demercuration",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Oxymercuration–Demercuration (Markovnikov Hydration Without Rearrangement)",
    "expr": "R−CH=CH₂ + Hg(OAc)₂ / H₂O → R−CH(OH)−CH₂−HgOAc —NaBH₄ / OH⁻→ R−CH(OH)−CH₃",
    "keys": [
      "oxymercuration demercuration",
      "markovnikov alcohol",
      "mercurinium ion",
      "anti addition"
    ],
    "symbols": [
      "Step 1: cyclic mercurinium ion intermediate prevents carbocation rearrangement",
      "Step 2: reduction with sodium borohydride replaces –HgOAc with –H"
    ],
    "notes": [
      "Gives pure Markovnikov alcohol without skeletal rearrangement.",
      "If an alcohol R'OH is used instead of H₂O (solvomercuration), ethers are formed."
    ],
    "example": "3,3-dimethylbut-1-ene gives 3,3-dimethylbutan-2-ol (Markovnikov, no rearrangement).",
    "latex": "\\ce{R-CH=CH2 + Hg(OAc)2/H2O -> R-CH(OH)-CH2-HgOAc} \\xrightarrow{\\ce{NaBH4 / OH-}} \\ce{R-CH(OH)-CH3} \\; (\\text{Markovnikov, no rearrangement})"
  },
  {
    "id": "pcc_vs_jones_reagent",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "PCC vs Jones Reagent: Controlled Alcohol Oxidation",
    "expr": "PCC (in CH₂Cl₂): 1° Alcohol → Aldehyde (Stops here)   |   Jones (CrO₃ / aq. H₂SO₄ / Acetone): 1° Alcohol → Carboxylic Acid",
    "keys": [
      "pcc",
      "jones reagent",
      "pyridinium chlorochromate",
      "alcohol oxidation control"
    ],
    "symbols": [
      "PCC: Pyridinium chlorochromate [C₅H₅NH⁺][CrO₃Cl⁻] anhydrous",
      "Jones reagent contains water, which hydrates the aldehyde into gem-diol, allowing further oxidation to carboxylic acid"
    ],
    "notes": [
      "In absence of water (dry CH₂Cl₂), PCC cannot form gem-diol, so oxidation terminates cleanly at the aldehyde.",
      "Collins reagent (CrO₃·2Py in CH₂Cl₂) acts identically to PCC."
    ],
    "example": "Ethanol + PCC gives ethanal; ethanol + Jones reagent gives acetic acid.",
    "latex": "\\textbf{PCC: } 1^\\circ \\text{ Alcohol} \\to \\text{Aldehyde} \\quad \\Big| \\quad \\textbf{Jones: } 1^\\circ \\text{ Alcohol} \\to \\text{Carboxylic Acid}"
  },
  {
    "id": "pinacol_pinacolone_rearrangement",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Pinacol–Pinacolone Rearrangement",
    "expr": "(CH₃)₂C(OH)−C(OH)(CH₃)₂ (Pinacol) + conc. H₂SO₄ —heat→ CH₃−CO−C(CH₃)₃ (Pinacolone) + H₂O",
    "keys": [
      "pinacol pinacolone",
      "vicinal diol rearrangement",
      "carbocation migration",
      "migratory aptitude"
    ],
    "symbols": [
      "Protonation of one –OH followed by loss of water forms a 3° carbocation",
      "1,2-migration of an alkyl/aryl group is driven by the formation of an exceptionally stable oxonium ion (>C=O⁺–H)"
    ],
    "notes": [
      "Migratory aptitude in unsymmetrical pinacols: p-anisyl > p-tolyl > phenyl > 3° alkyl > 2° alkyl > 1° alkyl > methyl."
    ],
    "example": "2,3-dimethylbutane-2,3-diol (pinacol) treated with acid yields 3,3-dimethylbutan-2-one (pinacolone).",
    "latex": "\\ce{(CH3)2C(OH)-C(OH)(CH3)2 ->[\\ce{H2SO4}][\\Delta] (CH3)3C-CO-CH3 \\text{ (Pinacolone)} + H2O}"
  },
  {
    "id": "sharpless_epoxidation",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Sharpless Asymmetric Epoxidation of Allylic Alcohols",
    "expr": "Allylic Alcohol + t-BuOOH + Ti(O-i-Pr)₄ + (+)-DET or (−)-DET → Enantiopure Chiral Epoxide (>90% ee)",
    "keys": [
      "sharpless epoxidation",
      "asymmetric synthesis",
      "chiral epoxide",
      "diethyl tartrate det"
    ],
    "symbols": [
      "DET: chiral diethyl tartrate ligand determines which enantiotopic face is oxygenated",
      "Delivers oxygen selectively to the top or bottom face of the double bond"
    ],
    "notes": [
      "Nobel Prize in Chemistry (2001) for asymmetric catalytic oxidation.",
      "Works with extraordinary enantioselectivity on allylic alcohols."
    ],
    "example": "Using (+)-DET delivers oxygen from the bottom face; (−)-DET delivers oxygen from the top face.",
    "latex": "\\text{Allylic Alcohol} + t\\text{-BuOOH} \\xrightarrow{\\ce{Ti(O-}i\\ce{-Pr)4}, \\; (\\pm)\\text{-DET}} \\text{Chiral Epoxide } (>90\\% \\text{ ee})"
  },
  {
    "id": "swern_oxidation_alcohols",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Swern Mild Oxidation of Alcohols",
    "expr": "R−CH₂OH + (COCl)₂ + DMSO + Et₃N (−78 °C) → R−CHO + (CH₃)₂S + CO + CO₂ + Et₃NH⁺ Cl⁻",
    "keys": [
      "swern oxidation",
      "dmso oxalyl chloride",
      "mild alcohol oxidation",
      "no overoxidation"
    ],
    "symbols": [
      "Oxalyl chloride (COCl)₂ and dimethyl sulfoxide (DMSO) generate dimethylchlorosulfonium chloride at −78 °C",
      "Addition of triethylamine (Et₃N) initiates base-promoted fragmentation"
    ],
    "notes": [
      "Extremely mild: stops cleanly at the aldehyde without over-oxidation to carboxylic acid.",
      "Tolerates acid-sensitive protecting groups."
    ],
    "example": "Primary alcohols oxidise to aldehydes; secondary alcohols oxidise to ketones in near-quantitative yields.",
    "latex": "\\ce{R-CH2OH + (COCl)2 + DMSO + Et3N ->[-78^\\circ\\text{C}] R-CHO + (CH3)2S + CO + CO2 + Et3NH+Cl-}"
  },
  {
    "id": "victor_meyer_alcohol_test",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Victor Meyer Test: Red, Blue, White Sequence",
    "expr": "1° Alcohol → Nitroalkane → Nitrolic Acid —alkali→ BLOOD RED   |   2° Alcohol → Pseudonitrol —alkali→ BLUE   |   3° Alcohol → No reaction → COLOURLESS",
    "keys": [
      "victor meyer test",
      "red blue white",
      "alcohol distinction",
      "pseudonitrol",
      "nitrolic acid"
    ],
    "symbols": [
      "Step 1: R–OH + P/I₂ → R–I",
      "Step 2: R–I + AgNO₂ → R–NO₂",
      "Step 3: R–NO₂ + HNO₂ (NaNO₂/HCl)",
      "Step 4: make alkaline with NaOH/KOH"
    ],
    "notes": [
      "Mnemonic: RBC (Red for 1°, Blue for 2°, Colourless for 3°).",
      "3° nitroalkanes have no α-hydrogen, so they do not react with nitrous acid."
    ],
    "example": "Ethanol gives blood-red colour with alkali; isopropanol gives blue colour; tert-butanol gives colourless solution.",
    "latex": "1^\\circ \\to \\text{Blood Red (Nitrolic Acid)} \\quad \\Big| \\quad 2^\\circ \\to \\text{Blue (Pseudonitrol)} \\quad \\Big| \\quad 3^\\circ \\to \\text{Colourless}"
  },
  {
    "id": "williamson_ether_synthesis_limits",
    "branch": "Organic",
    "chapter": "Alcohols, Phenols and Ethers",
    "title": "Williamson Ether Synthesis & Substrate Limitations",
    "expr": "R−O⁻ Na⁺ + R'−X → R−O−R' + NaX   (R' must be 1° or methyl)",
    "keys": [
      "williamson ether synthesis",
      "sn2 ether preparation",
      "alkoxide",
      "elimination competition"
    ],
    "symbols": [
      "Mechanism: S_N2 displacement of halide ion by nucleophilic alkoxide",
      "R–O⁻: can be 1°, 2°, 3°, or phenoxide (C₆H₅O⁻)"
    ],
    "notes": [
      "If a 3° alkyl halide is used (e.g. (CH₃)₃C–Br + CH₃ONa), the strongly basic alkoxide causes exclusive E2 ELIMINATION, producing an alkene (isobutene) instead of an ether."
    ],
    "example": "To make tert-butyl ethyl ether: use (CH₃)₃C–O⁻ Na⁺ + CH₃CH₂Br (correct). Using CH₃CH₂O⁻ Na⁺ + (CH₃)₃C–Br yields 2-methylpropene + ethanol.",
    "latex": "\\ce{R-O- Na+ + R'-X -> R-O-R' + NaX} \\quad (R' \\text{ must be } 1^\\circ \\text{ or methyl})"
  },
  {
    "id": "dnp_carbonyl_test",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "2,4-DNP (Brady's Reagent) Test for Aldehydes & Ketones",
    "expr": ">C=O + 2,4-(NO₂)₂C₆H₃−NHNH₂ → >C=N−NH−C₆H₃(NO₂)₂ (Yellow/Orange Precipitate) + H₂O",
    "keys": [
      "2 4 dnp test",
      "bradys reagent",
      "carbonyl test",
      "yellow orange precipitate 24 dnp"
    ],
    "symbols": [
      "2,4-Dinitrophenylhydrazine (Brady's reagent)",
      "Product: 2,4-dinitrophenylhydrazone (bright yellow, orange, or red crystalline solid with sharp melting point)"
    ],
    "notes": [
      "Universal test for both aldehydes and ketones (aliphatic and aromatic).",
      "Carboxylic acids, esters, and amides do NOT give this test because resonance donation diminishes carbonyl electrophilicity."
    ],
    "example": "Both acetaldehyde and acetone instantly form yellow-orange crystalline precipitates with 2,4-DNP.",
    "latex": "\\ce{>C=O + 2,4-(NO2)2C6H3-NHNH2 -> >C=N-NH-C6H3(NO2)2 v \\text{ (Orange/Yellow ppt)} + H2O}"
  },
  {
    "id": "aldol_cannizzaro",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Aldol & Cannizzaro Reaction Principles",
    "expr": "Aldol (with α-H): Carbonyl + dil. base → β-hydroxy carbonyl → α,β-unsaturated carbonyl   |   Cannizzaro (no α-H): 2 RCHO + 50% KOH → RCH₂OH + RCOOK",
    "keys": [
      "aldol",
      "cannizzaro",
      "alpha hydrogen",
      "disproportionation"
    ],
    "symbols": [
      "Aldol: needs at least one α-hydrogen atom (e.g. CH₃CHO, CH₃COCH₃)",
      "Cannizzaro: requires NO α-hydrogen (e.g. HCHO, PhCHO, (CH₃)₃CCHO)"
    ],
    "notes": [
      "Cross-Aldol between two different aldehydes with α-H gives a mixture of 4 products.",
      "Cross-Cannizzaro: HCHO is preferentially oxidised to formate HCOO⁻, reducing the other aldehyde to alcohol.",
      "Intramolecular aldol of 1,4- and 1,6-diketones forms stable 5-membered rings; 1,5- and 1,7-diketones form 6-membered rings."
    ],
    "example": "Benzaldehyde + conc. NaOH → Benzyl alcohol + Sodium benzoate (Cannizzaro disproportionation).",
    "latex": "\\textbf{Aldol: } \\ce{Carbonyl + dil. base -> \\beta-hydroxy carbonyl -> \\alpha,\\beta-unsaturated} \\quad \\Big| \\quad \\textbf{Cannizzaro: } \\ce{2 RCHO + 50\\% KOH -> RCH2OH + RCOOK}"
  },
  {
    "id": "aldol_condensation",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Aldol & Cross-Aldol Condensation",
    "expr": "2 R–CH₂–CHO + dil. NaOH ⇌ β-hydroxyaldehyde −H₂O → α,β-unsaturated aldehyde",
    "keys": [
      "aldol",
      "cross aldol",
      "alpha hydrogen",
      "enolate"
    ],
    "symbols": [
      "Requires carbonyl compounds with at least one acidic α-hydrogen",
      "Enolate nucleophile attacks carbonyl electrophile"
    ],
    "notes": [
      "Cross-aldol between two different aldehydes with α-H gives 4 distinct products (2 self + 2 cross).",
      "Intramolecular aldol of 1,4- and 1,6-diketones forms stable 5-membered rings; 1,5- and 1,7-diketones form 6-membered rings.",
      "Ketones require Ba(OH)₂ and give lower equilibrium yields due to steric crowding."
    ],
    "example": "Ethanal (CH₃CHO) + dil. NaOH → 3-hydroxybutanal (aldol) —heat→ But-2-enal (crotonaldehyde, CH₃CH=CHCHO).",
    "latex": "\\ce{2 R-CH2-CHO + dil. NaOH <=> \\beta-hydroxyaldehyde ->[-H2O] \\alpha,\\beta-unsaturated aldehyde}"
  },
  {
    "id": "baeyer_villiger_oxidation",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Baeyer–Villiger Carbonyl Oxidation to Esters / Lactones",
    "expr": "R−CO−R' + Peroxy Acid (mCPBA / CF₃COOOH) → R−COO−R' (Ester)",
    "keys": [
      "baeyer villiger",
      "mcpba",
      "ketone to ester",
      "migratory aptitude"
    ],
    "symbols": [
      "Oxygen inserts between carbonyl carbon and the more electron-rich migrating group",
      "Migratory aptitude: H > 3° alkyl > 2° alkyl ≈ phenyl > 1° alkyl > methyl"
    ],
    "notes": [
      "Cyclic ketones undergo ring expansion to form cyclic esters (Lactones).",
      "Retention of stereochemical configuration is observed at the migrating center."
    ],
    "example": "Acetophenone (C₆H₅COCH₃) + mCPBA yields phenyl acetate (CH₃COOC₆H₅) because phenyl migrates preferentially over methyl.",
    "latex": "\\ce{R-CO-R' + R''COOOH \\text{ (mCPBA)} -> R-COO-R' \\text{ (Ester)} + R''COOH}"
  },
  {
    "id": "beckmann_rearrangement",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Beckmann Rearrangement of Oximes to Amides",
    "expr": "Ketoxime (R R' C=N−OH) + H₂SO₄ / PCl₅ / SOCl₂ → N-substituted Amide (R−CO−NH−R')",
    "keys": [
      "beckmann rearrangement",
      "ketoxime to amide",
      "anti migration",
      "caprolactam"
    ],
    "symbols": [
      "The group ANTI (trans) to the –OH group migrates stereospecifically to the nitrogen atom with retention of configuration"
    ],
    "notes": [
      "Industrial application: Beckmann rearrangement of cyclohexanone oxime with concentrated H₂SO₄ produces Caprolactam, the monomer for Nylon 6."
    ],
    "example": "Cyclohexanone oxime heated with H₂SO₄ gives ε-caprolactam.",
    "latex": "\\ce{R2C=N-OH \\text{ (Ketoxime)} ->[\\ce{H2SO4} \\text{ or } \\ce{PCl5}] R-CO-NH-R \\; (N\\text{-substituted amide})}"
  },
  {
    "id": "benzoin_condensation_cyanide",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Benzoin Condensation Catalysed by Cyanide Ion",
    "expr": "2 C₆H₅CHO —aq. alc. KCN (heat)→ C₆H₅−CH(OH)−CO−C₆H₅ (Benzoin)",
    "keys": [
      "benzoin condensation",
      "cyanide catalyst",
      "alpha hydroxy ketone"
    ],
    "symbols": [
      "Cyanide ion (CN⁻) acts as unique catalyst: good nucleophile, good electron-withdrawing group, and excellent leaving group"
    ],
    "notes": [
      "Oxidation of benzoin with conc. HNO₃ yields Benzil (C₆H₅COCOC₆H₅)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: 2 C₆H₅CHO —aq. alc. KCN (heat)→ C₆H₅−CH(OH)−CO−C₆H₅ (Benzoin)",
    "latex": "\\ce{2C6H5CHO ->[\\text{aq. alc. } \\ce{KCN}][\\Delta] C6H5-CH(OH)-CO-C6H5 \\text{ (Benzoin)}}"
  },
  {
    "id": "cannizzaro_reaction",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Cannizzaro Disproportionation",
    "expr": "2 R–CHO (no α-H) + 50% KOH → R–CH₂OH + R–COOK",
    "keys": [
      "cannizzaro",
      "disproportionation",
      "hydride transfer",
      "redox"
    ],
    "symbols": [
      "Substrates: HCHO, C₆H₅CHO, (CH₃)₃C–CHO, furfural",
      "Hydride ion (:H⁻) transfers from gem-diolate intermediate to second aldehyde"
    ],
    "notes": [
      "Cross-Cannizzaro with formaldehyde: Formaldehyde is ALWAYS oxidised to sodium formate (HCOONa), reducing the other aldehyde to alcohol.",
      "Intramolecular Cannizzaro (e.g. glyoxal or benzil) forms α-hydroxy acids."
    ],
    "example": "C₆H₅CHO + HCHO + conc. NaOH → C₆H₅CH₂OH (benzyl alcohol) + HCOONa (sodium formate).",
    "latex": "\\ce{2 R-CHO + 50\\% KOH -> R-CH2OH + R-COOK}"
  },
  {
    "id": "clemmensen_wolff",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Carbonyl Reductions to Hydrocarbons",
    "expr": "Clemmensen: >C=O + Zn-Hg / conc. HCl → >CH₂   |   Wolff–Kishner: >C=O + NH₂NH₂ / KOH / glycol → >CH₂",
    "keys": [
      "clemmensen",
      "wolff kishner",
      "carbonyl reduction"
    ],
    "symbols": [
      "Clemmensen: acidic condition; ideal for base-sensitive compounds",
      "Wolff–Kishner: basic condition; ideal for acid-sensitive compounds"
    ],
    "notes": [
      "Avoid Clemmensen if molecule contains acid-sensitive groups (–OH, –OR, C=C).",
      "Avoid Wolff–Kishner if molecule contains base-sensitive groups (halides, esters).",
      "Mozingo reduction: >C=O + HS(CH₂)₂SH / Raney Ni (neutral condition)."
    ],
    "example": "Acetophenone PhCOCH₃ + Zn-Hg/conc. HCl → Ethylbenzene PhCH₂CH₃.",
    "latex": "\\textbf{Clemmensen: } \\ce{>C=O + Zn-Hg/conc. HCl -> >CH2} \\quad \\Big| \\quad \\textbf{Wolff--Kishner: } \\ce{>C=O + NH2NH2/KOH/glycol -> >CH2}"
  },
  {
    "id": "clemmensen_vs_wolff_kishner",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Carbonyl to Methylene Reduction: Clemmensen vs Wolff–Kishner",
    "expr": "Clemmensen (Acidic): >C=O + Zn−Hg / conc. HCl → >CH₂   |   Wolff–Kishner (Basic): >C=O + NH₂NH₂ / KOH , glycol —heat→ >CH₂ + N₂↑",
    "keys": [
      "clemmensen reduction",
      "wolff kishner reduction",
      "carbonyl to alkane",
      "acid sensitive base sensitive"
    ],
    "symbols": [
      "Clemmensen: Zinc amalgam in concentrated hydrochloric acid (suitable for base-sensitive compounds)",
      "Wolff–Kishner: Hydrazine followed by heating with KOH in ethylene glycol at 450 K (suitable for acid-sensitive compounds)"
    ],
    "notes": [
      "If substrate contains an acid-sensitive group (e.g. –OH, acetal), use Wolff–Kishner.",
      "If substrate contains a base-sensitive group (e.g. –Cl, ester), use Clemmensen."
    ],
    "example": "Reduction of acetophenone (C₆H₅COCH₃) by either method yields ethylbenzene (C₆H₅CH₂CH₃).",
    "latex": "\\textbf{Clemmensen (Acid): } \\ce{>C=O + Zn-Hg/HCl -> >CH2} \\quad \\Big| \\quad \\textbf{Wolff--Kishner (Base): } \\ce{>C=O + NH2NH2/KOH ->[\\Delta] >CH2 + N2 ^}"
  },
  {
    "id": "claisen_ester_condensation",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Claisen Ester Condensation",
    "expr": "2 R−CH₂−COOR' + NaOR' —reflux→ R−CH₂−CO−CH(R)−COOR' (β-Keto Ester) + R'OH",
    "keys": [
      "claisen condensation",
      "beta keto ester",
      "acetoacetic ester",
      "ester enolate"
    ],
    "symbols": [
      "Base must match the ester alkoxy group (NaOEt for ethyl ester) to prevent transesterification",
      "Requires at least TWO α-hydrogens on the ester: one to form the enolate, and a second to drive the reaction to completion via deprotonation of the acidic β-keto ester"
    ],
    "notes": [
      "Intramolecular Claisen condensation of diesters to form 5- or 6-membered cyclic β-keto esters is called the Dieckmann Condensation."
    ],
    "example": "2 ethyl acetate (CH₃COOCH₂CH₃) + NaOCH₂CH₃ followed by acidification yields ethyl acetoacetate (acetoacetic ester).",
    "latex": "\\ce{2R-CH2-COOR' + NaOR' ->[\\text{reflux}] R-CH2-CO-CH(R)-COOR' \\text{ (\\(\\beta\\)-Keto Ester)} + R'OH}"
  },
  {
    "id": "aldol_cross_aldol_products",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Cross-Aldol Condensation Product Count",
    "expr": "Two different aldehydes, each with α-H, yield FOUR distinct aldol products on basic condensation",
    "keys": [
      "cross aldol condensation",
      "four products",
      "self aldol vs cross aldol"
    ],
    "symbols": [
      "2 self-condensation products + 2 cross-condensation products"
    ],
    "notes": [
      "To obtain a single clean product, use one aldehyde without α-H (e.g. benzaldehyde or formaldehyde) in excess."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Two different aldehydes, each with α-H, yield FOUR distinct aldol products on basic condensation",
    "latex": "\\text{Two different aldehydes with } \\alpha\\text{-H} \\xrightarrow{\\text{dil. base}} \\text{4 Distinct Aldol Products (2 self + 2 cross)}"
  },
  {
    "id": "cannizzaro_cross_formaldehyde",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Cross-Cannizzaro Reaction with Formaldehyde",
    "expr": "Ar−CHO + HCHO + conc. NaOH → Ar−CH₂OH + HCOONa",
    "keys": [
      "cross cannizzaro",
      "formaldehyde oxidation",
      "benzyl alcohol",
      "sodium formate"
    ],
    "symbols": [
      "Formaldehyde is exceptionally susceptible to nucleophilic attack by OH⁻ due to lack of electron-donating alkyl groups and minimal steric hindrance"
    ],
    "notes": [
      "Formaldehyde is ALWAYS oxidized to sodium formate, reducing the other aldehyde to alcohol."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Ar−CHO + HCHO + conc. NaOH → Ar−CH₂OH + HCOONa",
    "latex": "\\ce{Ar-CHO + HCHO + conc. NaOH -> Ar-CH2OH + HCOONa}"
  },
  {
    "id": "etard_reaction_benzaldehyde",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Étard Reaction for Benzaldehyde Preparation",
    "expr": "C₆H₅−CH₃ + 2 CrO₂Cl₂ (in CS₂ or CCl₄) → C₆H₅−CH(OCrOHCl₂)₂ (Brown Complex) —H₃O⁺→ C₆H₅−CHO + 2 Cr(OH)₂Cl₂",
    "keys": [
      "etard reaction",
      "chromyl chloride",
      "toluene to benzaldehyde",
      "brown chromium complex"
    ],
    "symbols": [
      "CrO₂Cl₂: chromyl chloride reagent",
      "Intermediate: brown insoluble gem-diolate chromium complex"
    ],
    "notes": [
      "Prevents over-oxidation of the methyl group to benzoic acid.",
      "If CrO₃ in acetic anhydride is used, benzylidene diacetate intermediate is isolated."
    ],
    "example": "Toluene cleanly converts to benzaldehyde with chromyl chloride.",
    "latex": "\\ce{C6H5-CH3 + 2CrO2Cl2 ->[\\ce{CS2}] C6H5-CH(OCrOHCl2)2 \\text{ (Brown Complex)}} \\xrightarrow{\\ce{H3O+}} \\ce{C6H5-CHO + 2Cr(OH)2Cl2}"
  },
  {
    "id": "favorskii_rearrangement",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Favorskii Rearrangement of α-Haloketones",
    "expr": "α-Haloketone + Base (RO⁻ / OH⁻) → Cyclopropanone Intermediate → Ester / Carboxylic Acid",
    "keys": [
      "favorskii rearrangement",
      "alpha haloketone",
      "cyclopropanone intermediate",
      "ring contraction"
    ],
    "symbols": [
      "Base abstracts α'-hydrogen to form enolate, which internally displaces halide to yield a strained cyclopropanone intermediate",
      "Nucleophile attacks carbonyl carbon, followed by cyclopropanone ring opening to give rearranged ester"
    ],
    "notes": [
      "Useful for stereospecific ring contractions (e.g. 2-chlorocyclohexanone contracts to cyclopentanecarboxylic acid)."
    ],
    "example": "2-chlorocyclohexanone treated with sodium methoxide yields methyl cyclopentanecarboxylate.",
    "latex": "\\ce{\\alpha-Haloketone + Base (RO- / OH-) -> Cyclopropanone Intermediate -> Ester / Carboxylic Acid}"
  },
  {
    "id": "silver_mirror_formic_acid",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Formic Acid (HCOOH) Anomalous Reducing Action",
    "expr": "HCOOH + 2 [Ag(NH₃)₂]⁺ + 2 OH⁻ → 2 Ag↓ (Silver Mirror) + CO₂↑ + 4 NH₃ + 2 H₂O",
    "keys": [
      "formic acid reducing",
      "tollens test formic acid",
      "unique carboxylic acid",
      "silver mirror"
    ],
    "symbols": [
      "HCOOH contains both a carboxylic acid group (–COOH) and an aldehyde group (–CH=O)"
    ],
    "notes": [
      "Formic acid is the ONLY carboxylic acid that reduces Tollens' reagent, Fehling's solution, and acidified KMnO₄.",
      "Acetic acid and all other carboxylic acids do NOT give these tests."
    ],
    "example": "Formic acid decolourises acidified KMnO₄ with brisk effervescence of CO₂ gas.",
    "latex": "\\ce{HCOOH + 2[Ag(NH3)2]+ + 2OH- -> 2Ag v \\text{ (Silver Mirror)} + CO2 ^ + 4NH3 + 2H2O}"
  },
  {
    "id": "gattermann_koch_formylation",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Gattermann–Koch Formylation of Benzene",
    "expr": "C₆H₆ + CO + HCl —anhyd. AlCl₃ / CuCl (high P)→ C₆H₅−CHO + HCl",
    "keys": [
      "gattermann koch",
      "formylation of benzene",
      "carbon monoxide",
      "formyl chloride equivalent"
    ],
    "symbols": [
      "CO + HCl in presence of AlCl₃/CuCl generates transient formyl cation [H–C≡O⁺]",
      "Electrophilic aromatic substitution of benzene"
    ],
    "notes": [
      "Does not work on aromatic rings with strong activating groups like –OH, –NH₂ (they complex with AlCl₃), nor on strongly deactivated rings."
    ],
    "example": "Benzene reacts with CO/HCl in presence of AlCl₃/CuCl to give benzaldehyde in good yield.",
    "latex": "\\ce{C6H6 + CO + HCl ->[\\text{anhyd. } \\ce{AlCl3} / \\ce{CuCl}][\\text{high } P] C6H5-CHO + HCl}"
  },
  {
    "id": "hvz_reaction",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Hell–Volhard–Zelinsky (HVZ) Reaction",
    "expr": "R–CH₂–COOH + X₂ / red P → R–CH(X)–COOH + HX   (X = Cl, Br)",
    "keys": [
      "hvz",
      "hell volhard zelinsky",
      "alpha halogenation",
      "carboxylic acid"
    ],
    "symbols": [
      "red P: phosphorus catalyst converts acid to acyl halide RCH₂COX which enolises rapidly",
      "X₂: Br₂ or Cl₂"
    ],
    "notes": [
      "Introduces halogen specifically at the α-position of aliphatic carboxylic acids.",
      "α-Halocarboxylic acids undergo nucleophilic substitution with NH₃ to yield α-amino acids, or with aq. KOH to yield α-hydroxy acids."
    ],
    "example": "CH₃CH₂COOH + Br₂ / red P → CH₃CH(Br)COOH (2-bromopropanoic acid).",
    "latex": "\\ce{R-CH2-COOH + X2 ->[\\text{red P}] R-CH(X)-COOH + HX} \\quad (X = \\ce{Cl, Br})"
  },
  {
    "id": "hunsdiecker_reaction_decarboxylation",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Hunsdiecker Reaction (Decarboxylative Halogenation)",
    "expr": "R−COOAg + Br₂ —CCl₄ (reflux)→ R−Br + CO₂↑ + AgBr↓",
    "keys": [
      "hunsdiecker reaction",
      "silver carboxylate",
      "decarboxylative bromination"
    ],
    "symbols": [
      "Prepares alkyl bromides containing ONE LESS carbon than the starting carboxylic acid"
    ],
    "notes": [
      "Yield order: 1° > 2° > 3° alkyl halide; using I₂ yields ester (Birnbaum–Simonini reaction: 2 RCOOAg + I₂ → RCOOR + CO₂ + 2 AgI)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: R−COOAg + Br₂ —CCl₄ (reflux)→ R−Br + CO₂↑ + AgBr↓",
    "latex": "\\ce{R-COOAg + Br2 ->[\\ce{CCl4}, \\Delta] R-Br + CO2 ^ + AgBr v}"
  },
  {
    "id": "hell_volhard_zelinsky_mechanism",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "HVZ Reaction Intermediate: Enolisation of Acyl Halide",
    "expr": "R−CH₂−COOH + PCl₃ / PBr₃ → R−CH₂−COX ⇌ R−CH=C(OH)X —X₂→ R−CH(X)−COX —RCH₂COOH→ R−CH(X)−COOH + RCH₂COX",
    "keys": [
      "hvz mechanism",
      "red phosphorus catalyst",
      "alpha halogenation",
      "acyl halide enol"
    ],
    "symbols": [
      "Carboxylic acids do not enolise easily, but acyl halides enolise readily; red P converts catalytic amount of acid into acyl halide to initiate rapid α-halogenation"
    ],
    "notes": [
      "Only aliphatic acids with at least one α-hydrogen undergo HVZ reaction (formic acid, trimethylacetic acid do not react)."
    ],
    "example": "Propanoic acid + Br₂/P yields 2-bromopropanoic acid.",
    "latex": "\\ce{R-CH2-COOH + PBr3 -> R-CH2-COBr <=> R-CH=C(OH)Br} \\xrightarrow{\\ce{Br2}} \\ce{R-CH(Br)-COOH}"
  },
  {
    "id": "haloform_iodoform_test",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Iodoform (Haloform) Test for Methyl Carbonyls & Carbinols",
    "expr": "CH₃−C(=O)−R + 3 I₂ + 4 NaOH → CHI₃↓ (yellow ppt) + R−COONa + 3 NaI + 3 H₂O",
    "keys": [
      "iodoform test",
      "haloform reaction",
      "methyl ketone",
      "yellow precipitate chi3"
    ],
    "symbols": [
      "CHI₃: triiodomethane (iodoform), characteristic yellow crystalline solid with antiseptic odour (mp 119 °C)",
      "Substrates giving positive test: Compounds containing CH₃–C=O group OR CH₃–CH(OH)– group (oxidised to methyl ketone by I₂)"
    ],
    "notes": [
      "Acetaldehyde (CH₃CHO) is the ONLY aldehyde that gives a positive iodoform test.",
      "Ethanol (CH₃CH₂OH) gives a positive test; methanol (CH₃OH) does NOT."
    ],
    "example": "Pentan-2-one gives a positive iodoform test (yellow CHI₃); pentan-3-one does not.",
    "latex": "\\ce{CH3-CO-R + 3I2 + 4NaOH -> CHI3 v \\text{ (yellow ppt)} + R-COONa + 3NaI + 3H2O}"
  },
  {
    "id": "michael_conjugate_addition",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Michael 1,4-Conjugate Addition",
    "expr": "Active Methylene Enolate (Donor) + α,β-Unsaturated Carbonyl (Acceptor) —base→ 1,5-Dicarbonyl Adduct",
    "keys": [
      "michael addition",
      "conjugate addition",
      "1 4 addition",
      "soft nucleophile"
    ],
    "symbols": [
      "Michael donor: stabilized carbanion (diethyl malonate, acetoacetic ester, nitroalkanes)",
      "Michael acceptor: α,β-unsaturated compound (methyl vinyl ketone, acrolein, acrylonitrile, ethyl acrylate)"
    ],
    "notes": [
      "Soft nucleophiles (resonance-stabilized enolates) add 1,4 to the β-carbon; hard nucleophiles (Grignard reagents, organolithiums) add 1,2 directly to the carbonyl group."
    ],
    "example": "Diethyl malonate anion adds cleanly to the β-position of methyl vinyl ketone.",
    "latex": "\\text{Active Methylene Donor} + \\alpha,\\beta\\text{-Unsaturated Acceptor} \\xrightarrow{\\text{base}} \\text{1,5-Dicarbonyl Adduct}"
  },
  {
    "id": "acid_derivatives_reactivity_order",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Nucleophilic Acyl Substitution: Relative Reactivity of Acid Derivatives",
    "expr": "Acyl Chloride (RCOCl) > Acid Anhydride ((RCO)₂O) > Ester (RCOOR') > Amide (RCONH₂)",
    "keys": [
      "nucleophilic acyl substitution",
      "acid derivatives reactivity",
      "leaving group ability"
    ],
    "symbols": [
      "Leaving group ability: Cl⁻ (pKa of HCl = −7) > RCOO⁻ (pKa ≈ 4.8) > RO⁻ (pKa ≈ 16) > NH₂⁻ (pKa ≈ 38)"
    ],
    "notes": [
      "A more reactive derivative can be converted easily into a less reactive one, but the reverse requires activation.",
      "Amides are the least reactive due to strong resonance donation from nitrogen lone pair into the carbonyl carbon."
    ],
    "example": "Acetyl chloride reacts violently with water at room temperature to form acetic acid, whereas acetamide requires prolonged boiling with acid or base to hydrolyse.",
    "latex": "\\text{Reactivity: } \\ce{RCOCl} > (\\ce{RCO})_2\\ce{O} > \\ce{RCOOR'} > \\ce{RCONH2}"
  },
  {
    "id": "carboxylic_acid_ortho_effect",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Ortho Effect in Substituted Benzoic Acids",
    "expr": "Ortho-substituted benzoic acids are STRONGER acids than benzoic acid, REGARDLESS of the electronic nature (+I/+M or −I/−M) of the substituent",
    "keys": [
      "ortho effect",
      "benzoic acid acidity",
      "steric inhibition of resonance",
      "sir effect"
    ],
    "symbols": [
      "Steric crowding forces the –COOH group out of the plane of the benzene ring",
      "Ring π-electrons can no longer conjugate with –C=O, allowing full resonance stabilization of carboxylate –COO⁻ by equivalent resonance structures"
    ],
    "notes": [
      "Acidity order: o-nitrobenzoic acid > m-nitrobenzoic acid > p-nitrobenzoic acid > benzoic acid.",
      "Even o-toluic acid (with +I, +H methyl group) is stronger than benzoic acid (pK_a = 3.91 vs 4.20)."
    ],
    "example": "o-hydroxybenzoic acid (salicylic acid, pK_a = 2.98) is much stronger than benzoic acid due to ortho effect plus intramolecular H-bonding in salicylate ion.",
    "latex": "\\text{\\textit{ortho}-Substituted benzoic acids are stronger acids than benzoic acid regardless of electronic nature}"
  },
  {
    "id": "perkin_cinnamic_acid",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Perkin Reaction for Cinnamic Acid Synthesis",
    "expr": "C₆H₅CHO + (CH₃CO)₂O —CH₃COONa (450 K)→ C₆H₅−CH=CH−COOH (Cinnamic Acid) + CH₃COOH",
    "keys": [
      "perkin reaction",
      "cinnamic acid",
      "benzaldehyde acetic anhydride"
    ],
    "symbols": [
      "Condensation of aromatic aldehyde with anhydride in presence of weak sodium salt of the acid"
    ],
    "notes": [
      "Yields α,β-unsaturated aromatic carboxylic acid."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: C₆H₅CHO + (CH₃CO)₂O —CH₃COONa (450 K)→ C₆H₅−CH=CH−COOH (Cinnamic Acid) + CH₃COOH",
    "latex": "\\ce{C6H5CHO + (CH3CO)2O ->[\\ce{CH3COONa}][450\\text{ K}] C6H5-CH=CH-COOH \\text{ (Cinnamic Acid)} + CH3COOH}"
  },
  {
    "id": "reformatsky_reaction",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Reformatsky Reaction with Organozinc Reagents",
    "expr": "R₂C=O + Br−CH₂−COOR' + Zn (dry ether) → R₂C(OH)−CH₂−COOR' (β-Hydroxy Ester)",
    "keys": [
      "reformatsky reaction",
      "organozinc",
      "alpha halo ester",
      "beta hydroxy ester"
    ],
    "symbols": [
      "Organozinc intermediate: BrZn–CH₂COOR' (Reformatsky reagent)",
      "Organozinc reagents are less nucleophilic than Grignard reagents, so they add selectively to aldehydes and ketones without attacking the ester carbonyl"
    ],
    "notes": [
      "Subsequent dehydration of β-hydroxy ester yields α,β-unsaturated esters."
    ],
    "example": "Benzaldehyde + ethyl bromoacetate + Zn yields ethyl 3-hydroxy-3-phenylpropanoate.",
    "latex": "\\ce{R2C=O + Br-CH2-COOEt + Zn ->[\\text{ether}] [R2C(OZnBr)-CH2-COOEt]} \\xrightarrow{\\ce{H3O+}} \\ce{R2C(OH)-CH2-COOEt \\; (\\beta\\text{-hydroxy ester})}"
  },
  {
    "id": "robinson_annulation_cascade",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Robinson Annulation (Ring-Forming Cascade)",
    "expr": "Ketone + Methyl Vinyl Ketone —base (Michael Addition)→ 1,5-Diketone —base (Intramolecular Aldol)→ 2-Cyclohexenone",
    "keys": [
      "robinson annulation",
      "steroid synthesis",
      "annulated ring",
      "cyclohexenone"
    ],
    "symbols": [
      "Two-step cascade: 1) Michael conjugate addition followed by 2) Intramolecular aldol condensation with dehydration"
    ],
    "notes": [
      "Powerhouse reaction in total synthesis of steroids, terpenoids, and polycyclic natural products."
    ],
    "example": "Cyclohexanone + methyl vinyl ketone in basic medium yields bicyclic fused enone.",
    "latex": "\\text{Cyclohexanone} + \\text{Methyl Vinyl Ketone} \\xrightarrow[\\text{Michael}]{\\text{base}} \\text{1,5-Diketone} \\xrightarrow[\\text{Intramolecular Aldol}]{\\text{base}} \\text{2-Cyclohexenone}"
  },
  {
    "id": "rosenmund_reduction",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Rosenmund Catalytic Reduction of Acyl Chlorides",
    "expr": "R−COCl + H₂ —Pd / BaSO₄ , quinoline / S (poison)→ R−CHO + HCl",
    "keys": [
      "rosenmund reduction",
      "acyl chloride to aldehyde",
      "lindlar style catalyst",
      "poisoned catalyst"
    ],
    "symbols": [
      "Pd supported on BaSO₄ (low surface area)",
      "Poisoned with quinoline or sulfur to partially deactivate the catalyst"
    ],
    "notes": [
      "The catalyst poison prevents further reduction of the aldehyde to primary alcohol.",
      "Formaldehyde cannot be prepared by this method because formyl chloride (HCOCl) is unstable at room temperature."
    ],
    "example": "Benzoyl chloride (C₆H₅COCl) + H₂ / Pd–BaSO₄ → Benzaldehyde (C₆H₅CHO) + HCl.",
    "latex": "\\ce{R-COCl + H2 ->[\\ce{Pd-BaSO4} / \\text{quinoline}] R-CHO + HCl}"
  },
  {
    "id": "schiff_reagent_test",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Schiff's Test for Aldehydes",
    "expr": "R−CHO + Schiff's Reagent (decolourised rosaniline hydrochloride) → Restoration of Intense Magenta / Pink Colour",
    "keys": [
      "schiffs reagent",
      "schiff test",
      "rosaniline hydrochloride",
      "magenta colour"
    ],
    "symbols": [
      "Schiff's reagent: p-rosaniline hydrochloride (magenta dye) decolourised by passing sulfur dioxide (SO₂) gas"
    ],
    "notes": [
      "Aldehydes restore the pink/magenta colour instantly without heating.",
      "Ketones do not restore the colour under normal conditions (acetone reacts extremely slowly)."
    ],
    "example": "Formaldehyde and benzaldehyde immediately turn Schiff's reagent bright magenta.",
    "latex": "\\ce{R-CHO} + \\text{Schiff's Reagent (decolourised rosaniline)} \\longrightarrow \\text{Restoration of Magenta/Pink Colour}"
  },
  {
    "id": "silver_salt_method_acids",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Silver Salt Method for Carboxylic Acid Basicity & Molar Mass",
    "expr": "Equivalent Mass of Acid = [ (108 · Mass of Silver Salt) / (Mass of Residue Ag) ] − 107",
    "keys": [
      "silver salt method",
      "carboxylic acid equivalent weight",
      "silver residue"
    ],
    "symbols": [
      "Silver salts of carboxylic acids (RCOOAg) decompose quantitatively on ignition to leave a residue of pure metallic silver"
    ],
    "notes": [
      "Molar mass of acid = Equivalent Mass × Basicity."
    ],
    "example": "0.410 g silver salt leaves 0.216 g pure silver on ignition:\nE = (108 × 0.410 / 0.216) − 107 = 205 − 107 = 98.",
    "latex": "E_{\\text{acid}} = \\left[ \\frac{108 \\times \\text{Mass of Silver Salt}}{\\text{Mass of Residue Ag}} \\right] - 107"
  },
  {
    "id": "stephen_reduction_nitriles",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Stephen Reduction of Nitriles to Aldehydes",
    "expr": "R−C≡N + SnCl₂ + 2 HCl —ether→ R−CH=NH · HCl (Aldimine) —H₃O⁺→ R−CHO + NH₄Cl",
    "keys": [
      "stephen reduction",
      "nitrile to aldehyde",
      "aldimine hydrochloride",
      "tin chloride"
    ],
    "symbols": [
      "Reducing agent: anhydrous stannous chloride (SnCl₂) saturated with dry HCl gas in ether",
      "Hydrolysis of the precipitated aldimine salt yields the corresponding aldehyde"
    ],
    "notes": [
      "Alternative modern reagent for nitriles and esters: DIBAL-H (diisobutylaluminium hydride) at 195 K (−78 °C) cleanly yields aldehydes."
    ],
    "example": "Acetonitrile (CH₃CN) + SnCl₂/HCl followed by steam distillation gives ethanal (CH₃CHO).",
    "latex": "\\ce{R-C#N + SnCl2 + 2HCl ->[\\text{ether}] R-CH=NH \\cdot HCl} \\xrightarrow{\\ce{H3O+}} \\ce{R-CHO + NH4Cl}"
  },
  {
    "id": "stork_enamine_synthesis",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Stork Enamine Alkylation & Acylation of Carbonyls",
    "expr": "Ketone + 2° Amine (Pyrrolidine) —H⁺ (−H₂O)→ Enamine —R−X / RCOCl→ Alkylated / Acylated Enamine —H₃O⁺→ α-Substituted Ketone",
    "keys": [
      "stork enamine",
      "pyrrolidine",
      "alpha alkylation ketone",
      "monoalkylation clean"
    ],
    "symbols": [
      "Enamines act as neutral nucleophiles at the β-carbon",
      "Avoids the polyalkylation and self-condensation traps of direct ketone enolates"
    ],
    "notes": [
      "Readily hydrolysed by aqueous acid back to ketone and recovers the secondary amine catalyst."
    ],
    "example": "Cyclohexanone + pyrrolidine gives enamine; alkylation with methyl iodide followed by hydrolysis yields 2-methylcyclohexanone cleanly.",
    "latex": "\\ce{Ketone + 2^\\circ \\text{ amine} -> Enamine} \\xrightarrow{\\ce{R'-X}} \\text{Alkylated Enamine} \\xrightarrow{\\ce{H3O+}} \\text{\\(\\alpha\\)-substituted ketone}"
  },
  {
    "id": "tollens_fehling_tests",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Tollens' & Fehling's Tests for Aldehydes",
    "expr": "Tollens: R−CHO + 2 [Ag(NH₃)₂]⁺ + 3 OH⁻ → R−COO⁻ + 2 Ag↓ (silver mirror) + 4 NH₃ + 2 H₂O   |   Fehling: R−CHO + 2 Cu²⁺ + 5 OH⁻ → R−COO⁻ + Cu₂O↓ (red ppt) + 3 H₂O",
    "keys": [
      "tollens test",
      "fehlings test",
      "silver mirror",
      "reducing sugar",
      "red precipitate cu2o"
    ],
    "symbols": [
      "Tollens reagent: ammoniacal silver nitrate solution [Ag(NH₃)₂]⁺",
      "Fehling solution: Fehling A (aq. CuSO₄) + Fehling B (alkaline sodium potassium tartrate / Rochelle salt)"
    ],
    "notes": [
      "Tollens oxidises BOTH aliphatic and aromatic aldehydes (benzaldehyde gives silver mirror).",
      "Fehling oxidises ALIPHATIC aldehydes only; aromatic aldehydes (benzaldehyde) do NOT reduce Fehling's solution.",
      "Formic acid (HCOOH) and α-hydroxy ketones (fructose) also give positive Tollens and Fehling tests."
    ],
    "example": "Distinguish ethanal from benzaldehyde using Fehling's test: ethanal gives red Cu₂O ppt; benzaldehyde does not.",
    "latex": "\\text{Tollens: } \\ce{R-CHO + 2[Ag(NH3)2]+ + 3OH- -> R-COO- + 2Ag v + 4NH3 + 2H2O} \\quad \\Big| \\quad \\text{Fehling: } \\ce{R-CHO + 2Cu^2+ + 5OH- -> R-COO- + Cu2O v + 3H2O}"
  },
  {
    "id": "wittig_reaction_alkenes",
    "branch": "Organic",
    "chapter": "Aldehydes, Ketones & Carboxylic Acids",
    "title": "Wittig Reaction (Carbonyl to Alkene via Phosphonium Ylide)",
    "expr": ">C=O + Ph₃P=CH−R (Phosphonium Ylide) → >C=CH−R (Alkene) + Ph₃P=O (Triphenylphosphine Oxide)",
    "keys": [
      "wittig reaction",
      "phosphonium ylide",
      "oxaphosphetane",
      "regiospecific alkene"
    ],
    "symbols": [
      "Phosphonium ylide prepared by: Ph₃P + R–CH₂–X → Ph₃P⁺–CH₂R X⁻ —n-BuLi or NaH→ Ph₃P=CHR",
      "Mechanism involves 4-membered cyclic oxaphosphetane intermediate"
    ],
    "notes": [
      "Driven by the formation of the extraordinarily strong phosphorus-oxygen double bond in Ph₃P=O (P=O bond energy ≈ 540 kJ mol⁻¹).",
      "Completely regiospecific: the C=C double bond forms exactly where the C=O was, without double-bond migration."
    ],
    "example": "Cyclohexanone + Ph₃P=CH₂ yields methylenecyclohexane cleanly.",
    "latex": "\\ce{>C=O + Ph3P=CH-R \\text{ (Phosphonium Ylide)} -> >C=CH-R \\text{ (Alkene)} + Ph3P=O}"
  },
  {
    "id": "amine_basicity_phases",
    "branch": "Organic",
    "chapter": "Amines",
    "title": "Aliphatic Amine Basicity: Gas Phase vs Aqueous Solution",
    "expr": "Gas Phase: 3° > 2° > 1° > NH₃   |   Aqueous with Methyl: 2° > 1° > 3° > NH₃   |   Aqueous with Ethyl: 2° > 3° > 1° > NH₃",
    "keys": [
      "amine basicity",
      "inductive vs hydration",
      "steric hindrance",
      "aliphatic amines pkb"
    ],
    "symbols": [
      "Gas phase order governed solely by +I inductive effect: (CH₃)₃N > (CH₃)₂NH > CH₃NH₂ > NH₃",
      "Aqueous phase governed by three competing factors: Inductive (+I), Hydration energy (H-bonding with H₂O), and Steric hindrance"
    ],
    "notes": [
      "For methyl group: steric hindrance is small, so hydration makes 1° > 3°; net order: (CH₃)₂NH (2°) > CH₃NH₂ (1°) > (CH₃)₃N (3°) > NH₃ (213 order).",
      "For ethyl group: larger size enhances inductive over hydration; net order: (C₂H₅)₂NH (2°) > (C₂H₅)₃N (3°) > C₂H₅NH₂ (1°) > NH₃ (231 order)."
    ],
    "example": "Dimethylamine is a stronger base in water (pK_b = 3.27) than trimethylamine (pK_b = 4.22) due to steric hindrance in the trimethylammonium ion.",
    "latex": "\\text{Gas: } 3^\\circ > 2^\\circ > 1^\\circ > \\ce{NH3} \\quad \\Big| \\quad \\text{Aqueous (Me): } 2^\\circ > 1^\\circ > 3^\\circ > \\ce{NH3} \\quad \\Big| \\quad \\text{Aqueous (Et): } 2^\\circ > 3^\\circ > 1^\\circ > \\ce{NH3}"
  },
  {
    "id": "carbylamine_isocyanide_test",
    "branch": "Organic",
    "chapter": "Amines",
    "title": "Carbylamine (Isocyanide) Test for Primary Amines",
    "expr": "R−NH₂ + CHCl₃ + 3 KOH(alc) —warm→ R−NC (isocyanide) + 3 KCl + 3 H₂O",
    "keys": [
      "carbylamine test",
      "isocyanide test",
      "primary amine detection",
      "foul smelling"
    ],
    "symbols": [
      "R–NH₂: aliphatic OR aromatic primary amine (e.g. aniline)",
      "R–NC: carbylamine / isocyanide (extremely foul, nauseating smell)",
      "Reactive intermediate: dichlorocarbene (:CCl₂)"
    ],
    "notes": [
      "Secondary and tertiary amines do NOT give this test.",
      "Extremely sensitive test: even trace amounts of 1° amine produce unmistakable odour."
    ],
    "example": "Aniline warmed with chloroform and alcoholic KOH gives phenyl isocyanide (C₆H₅NC).",
    "latex": "\\ce{R-NH2 + CHCl3 + 3KOH ->[\\Delta] R-NC \\text{ (foul smell)} + 3KCl + 3H2O}"
  },
  {
    "id": "curtius_rearrangement",
    "branch": "Organic",
    "chapter": "Amines",
    "title": "Curtius Rearrangement of Acyl Azides",
    "expr": "R−COCl + NaN₃ → R−CO−N₃ (Acyl Azide) —heat (−N₂)→ R−N=C=O (Isocyanate) —H₂O→ R−NH₂ + CO₂",
    "keys": [
      "curtius rearrangement",
      "acyl azide",
      "isocyanate",
      "loss of carbon amine"
    ],
    "symbols": [
      "Acyl azide thermally decomposes with loss of N₂ gas into an alkyl isocyanate via concerted migration of R group to nitrogen with retention"
    ],
    "notes": [
      "Milder than Hofmann degradation; works cleanly without harsh basic reagents.",
      "Trapping isocyanate with alcohol (R'OH) produces a Carbamate (Urethane: R–NH–COOR')."
    ],
    "example": "Benzoyl azide heated in benzene releases N₂ gas to form phenyl isocyanate, which hydrolyses to aniline.",
    "latex": "\\ce{R-COCl + NaN3 -> R-CO-N3 \\text{ (Acyl Azide)} ->[\\Delta][-\\ce{N2}] R-N=C=O \\text{ (Isocyanate)} ->[\\ce{H2O}] R-NH2 + CO2 ^}"
  },
  {
    "id": "diazotisation_temperature_limit",
    "branch": "Organic",
    "chapter": "Amines",
    "title": "Diazotisation Reaction Temperature Condition",
    "expr": "Ar−NH₂ + NaNO₂ + 2 HCl —273–278 K (0–5 °C)→ Ar−N₂⁺ Cl⁻ + NaCl + 2 H₂O",
    "keys": [
      "diazotisation",
      "ice cold temperature",
      "arenediazonium salt stability"
    ],
    "symbols": [
      "Temperature must be kept strictly below 5 °C (278 K)"
    ],
    "notes": [
      "Above 5 °C, benzenediazonium chloride decomposes violently in water, hydrolysing into Phenol and releasing N₂ gas: C₆H₅N₂⁺ + H₂O → C₆H₅OH + N₂↑ + H⁺."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Ar−NH₂ + NaNO₂ + 2 HCl —273–278 K (0–5 °C)→ Ar−N₂⁺ Cl⁻ + NaCl + 2 H₂O",
    "latex": "\\ce{Ar-NH2 + NaNO2 + 2HCl ->[273\\text{--}278\\text{ K}] Ar-N2+Cl- + NaCl + 2H2O}"
  },
  {
    "id": "gabriel_phthalimide",
    "branch": "Organic",
    "chapter": "Amines",
    "title": "Gabriel Phthalimide Synthesis",
    "expr": "Phthalimide + KOH → Potassium Phthalimide + R–X → N-alkylphthalimide + H₂O/H⁺ or N₂H₄ → R–NH₂ (1° amine)",
    "keys": [
      "gabriel phthalimide",
      "primary amine synthesis",
      "phthalic acid"
    ],
    "symbols": [
      "R–X: 1° alkyl halide (S_N2 attack by phthalimide anion)",
      "Hydrazinolysis with hydrazine (NH₂NH₂) releases pure 1° amine rapidly"
    ],
    "notes": [
      "Yields PURE 1° aliphatic amines without contamination from 2° or 3° amines.",
      "CANNOT be used to prepare aromatic 1° amines (aniline) because aryl halides do not undergo S_N2 displacement."
    ],
    "example": "Potassium phthalimide + CH₃CH₂Br followed by hydrazinolysis yields pure ethylamine (CH₃CH₂NH₂).",
    "latex": "\\ce{Phthalimide + KOH -> Potassium Phthalimide} \\xrightarrow{\\ce{R-X}} \\ce{N-alkylphthalimide} \\xrightarrow{\\ce{N2H4}} \\ce{R-NH2} \\; (1^\\circ\\text{ aliphatic only})"
  },
  {
    "id": "gabriel_phthalimide_limitations",
    "branch": "Organic",
    "chapter": "Amines",
    "title": "Gabriel Phthalimide Synthesis Scope & Limitations",
    "expr": "Phthalimide + KOH → Potassium Salt —R−X (S_N2)→ N-alkylphthalimide —N₂H₄ / H⁺→ R−NH₂ (Pure 1° Amine)",
    "keys": [
      "gabriel phthalimide",
      "pure primary amine",
      "no aryl amine"
    ],
    "symbols": [
      "Gives strictly pure 1° aliphatic amines free from 2° or 3° amine contamination"
    ],
    "notes": [
      "CANNOT be used to prepare aromatic 1° amines (aniline) because aryl halides (C₆H₅Cl) do not undergo S_N2 displacement with phthalimide anion."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Phthalimide + KOH → Potassium Salt —R−X (S_N2)→ N-alkylphthalimide —N₂H₄ / H⁺→ R−NH₂ (Pure 1° Amine)",
    "latex": "\\ce{Phthalimide + KOH -> Potassium Phthalimide} \\xrightarrow{\\ce{R-X} \\;(S_N2)} \\ce{N-alkylphthalimide} \\xrightarrow{\\ce{N2H4}} \\ce{R-NH2} \\; (1^\\circ\\text{ aliphatic only})"
  },
  {
    "id": "hinsberg_test_amines",
    "branch": "Organic",
    "chapter": "Amines",
    "title": "Hinsberg's Test for Distinguishing 1°, 2°, and 3° Amines",
    "expr": "Reagent: Benzenesulfonyl Chloride (C₆H₅SO₂Cl)",
    "keys": [
      "hinsberg test",
      "benzenesulfonyl chloride",
      "distinguishing amines",
      "sulfonamide"
    ],
    "symbols": [
      "1° Amine: forms N-alkylbenzenesulfonamide containing acidic N–H => SOLUBLE in alkali (NaOH)",
      "2° Amine: forms N,N-dialkylbenzenesulfonamide with no N–H => INSOLUBLE in alkali",
      "3° Amine: does NOT react with Hinsberg reagent (remains insoluble in alkali, dissolves in acid)"
    ],
    "notes": [
      "Modern variant uses p-toluenesulfonyl chloride (tosyl chloride)."
    ],
    "example": "An unknown amine reacts with Hinsberg's reagent to give a clear alkaline solution that precipitates upon acidification: confirmed 1° amine.",
    "latex": "1^\\circ \\to \\text{Soluble in } \\ce{KOH} \\quad \\Big| \\quad 2^\\circ \\to \\text{Insoluble in } \\ce{KOH} \\quad \\Big| \\quad 3^\\circ \\to \\text{No reaction with } \\ce{PhSO2Cl}"
  },
  {
    "id": "hofmann_bromamide_degradation",
    "branch": "Organic",
    "chapter": "Amines",
    "title": "Hofmann's Bromamide Degradation of Primary Amides",
    "expr": "R−CONH₂ + Br₂ + 4 KOH → R−NH₂ (primary amine) + K₂CO₃ + 2 KBr + 2 H₂O",
    "keys": [
      "hofmann bromamide",
      "degradation of amide",
      "loss of carbon",
      "isocyanate intermediate"
    ],
    "symbols": [
      "R–CONH₂: primary amide (1° amide only; 2° and 3° amides do not react)",
      "Product R–NH₂ contains ONE LESS carbon atom than the starting amide",
      "Key intermediate: acyl nitrene / alkyl isocyanate (R–N=C=O) undergoing intramolecular rearrangement"
    ],
    "notes": [
      "Migration of group R to nitrogen occurs with COMPLETE RETENTION of stereochemical configuration at the migrating carbon.",
      "Cannot be used to prepare amines with tertiary alkyl groups efficiently."
    ],
    "example": "Propanamide (CH₃CH₂CONH₂, 3 carbons) + Br₂/KOH yields ethylamine (CH₃CH₂NH₂, 2 carbons).",
    "latex": "\\ce{R-CONH2 + Br2 + 4KOH -> R-NH2 + K2CO3 + 2KBr + 2H2O}"
  },
  {
    "id": "platinic_chloride_base_method",
    "branch": "Organic",
    "chapter": "Amines",
    "title": "Platinic Chloride Method for Organic Base Molar Mass",
    "expr": "Molar Mass of Monoacidic Base = ½ · [ (195 · Mass of Salt) / (Mass of Residue Pt) − 410 ]",
    "keys": [
      "platinic chloride method",
      "organic base equivalent mass",
      "chloroplatinate salt"
    ],
    "symbols": [
      "Organic bases form chloroplatinate salts: B₂ · H₂PtCl₆",
      "Ignition decomposes the salt to leave pure metallic platinum (Pt = 195 g mol⁻¹)"
    ],
    "notes": [
      "Standard gravimetric method for determination of equivalent weights of alkaloids and amines."
    ],
    "example": "Chloroplatinate salt ignited to constant weight yields exact mass of platinum.",
    "latex": "M_{\\text{base}} = \\frac{1}{2} \\left[ \\frac{195 \\times \\text{Mass of Salt}}{\\text{Mass of Residue Pt}} - 410 \\right]"
  },
  {
    "id": "sandmeyer_vs_gattermann",
    "branch": "Organic",
    "chapter": "Amines",
    "title": "Sandmeyer vs Gattermann Reactions Comparison",
    "expr": "Sandmeyer: Ar−N₂⁺ Cl⁻ + CuCl/HCl → Ar−Cl + N₂   |   Gattermann: Ar−N₂⁺ Cl⁻ + Cu powder / HCl → Ar−Cl + N₂",
    "keys": [
      "sandmeyer reaction",
      "gattermann reaction",
      "copper catalyst",
      "aryl halide synthesis"
    ],
    "symbols": [
      "Sandmeyer uses copper(I) salt (CuCl or CuBr)",
      "Gattermann uses finely divided metallic copper powder in halogen acid"
    ],
    "notes": [
      "Sandmeyer reaction gives significantly higher percentage yields than Gattermann reaction."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Sandmeyer: Ar−N₂⁺ Cl⁻ + CuCl/HCl → Ar−Cl + N₂   |   Gattermann: Ar−N₂⁺ Cl⁻ + Cu powder / HCl → Ar−Cl + N₂",
    "latex": "\\textbf{Sandmeyer: } \\ce{Ar-N2+Cl- + CuCl/HCl -> Ar-Cl + N2 ^} \\quad \\Big| \\quad \\textbf{Gattermann: } \\ce{Ar-N2+Cl- + Cu/HCl -> Ar-Cl + N2 ^}"
  },
  {
    "id": "azo_coupling_reactions",
    "branch": "Organic",
    "chapter": "Amines & Diazonium Salts",
    "title": "Azo Coupling Reactions of Arenediazonium Salts",
    "expr": "Phenol (pH 9–10): Ar−N₂⁺ + C₆H₅OH → p-hydroxyazobenzene (Orange Dye)   |   Aniline (pH 4–5): Ar−N₂⁺ + C₆H₅NH₂ → p-aminoazobenzene (Yellow Dye)",
    "keys": [
      "azo coupling",
      "diazonium salt",
      "azo dye",
      "electrophilic aromatic coupling"
    ],
    "symbols": [
      "Electrophile: benzenediazonium cation (weak electrophile)",
      "Coupling occurs exclusively at the PARA position (or ortho if para is blocked)"
    ],
    "notes": [
      "With phenol, alkaline pH (9–10) converts phenol to phenoxide ion (much more activated for electrophilic attack).",
      "With aniline, mildly acidic pH (4–5) prevents diazonium decomposition while leaving free amine nucleophile unprotonated."
    ],
    "example": "Benzene diazonium chloride + phenol in alkaline medium produces bright orange p-hydroxyazobenzene.",
    "latex": "\\ce{Ar-N2+Cl- + C6H5OH ->[\\text{pH } 9\\text{--}10] Ar-N=N-C6H4-OH \\text{ (Orange Dye)}} \\quad \\Big| \\quad \\ce{Ar-N2+Cl- + C6H5NH2 ->[\\text{pH } 4\\text{--}5] Yellow Dye}"
  },
  {
    "id": "balz_schiemann_fluorination",
    "branch": "Organic",
    "chapter": "Amines & Diazonium Salts",
    "title": "Balz–Schiemann Fluorination of Arenes",
    "expr": "Ar−N₂⁺ Cl⁻ + HBF₄ → Ar−N₂⁺ BF₄⁻↓ (Insoluble Fluoroborate) —dry heat→ Ar−F + BF₃↑ + N₂↑",
    "keys": [
      "balz schiemann",
      "fluorobenzene preparation",
      "fluoroborate salt",
      "diazonium fluoride"
    ],
    "symbols": [
      "HBF₄: fluoroboric acid",
      "Ar–N₂⁺ BF₄⁻: stable, insoluble crystalline precipitate that can be filtered and dried safely"
    ],
    "notes": [
      "The ONLY reliable method for preparing pure aryl fluorides (direct fluorination explodes; CuF does not give Sandmeyer reaction).",
      "Heating Ar–N₂⁺ BF₄⁻ with NaNO₂ in presence of copper powder gives nitroarene (Ar–NO₂)."
    ],
    "example": "Benzene diazonium fluoroborate gently heated decomposes into fluorobenzene, BF₃ gas, and N₂.",
    "latex": "\\ce{Ar-N2+Cl- + HBF4 -> Ar-N2+BF4- v} \\xrightarrow{\\Delta} \\ce{Ar-F + BF3 ^ + N2 ^}"
  },
  {
    "id": "diazotisation_sandmeyer",
    "branch": "Organic",
    "chapter": "Amines & Diazonium Salts",
    "title": "Diazotisation & Sandmeyer Reactions",
    "expr": "Ar–NH₂ + NaNO₂ + 2HCl (0–5 °C) → Ar–N₂⁺ Cl⁻   =>   Sandmeyer: CuCl/CuBr/CuCN → Ar–Cl/Ar–Br/Ar–CN",
    "keys": [
      "diazotisation",
      "sandmeyer",
      "diazonium salt",
      "gattermann"
    ],
    "symbols": [
      "Ar: aromatic ring",
      "In situ nitrous acid generation: NaNO₂ + HCl → HNO₂ + NaCl (temperature maintained at 273–278 K)"
    ],
    "notes": [
      "Gattermann reaction uses Cu powder/HX instead of CuX.",
      "KI directly gives Ar–I without copper catalyst.",
      "HBF₄ followed by heating gives Ar–F (Balz–Schiemann reaction).",
      "H₃PO₂ (hypophosphorous acid) or ethanol reduces Ar–N₂⁺ to arene Ar–H."
    ],
    "example": "Aniline diazotised at 0–5 °C followed by CuCN/KCN yields benzonitrile Ph–CN.",
    "latex": "\\ce{Ar-NH2 + NaNO2 + 2HCl ->[0\\text{--}5^\\circ\\text{C}] Ar-N2+Cl-} \\implies \\text{Sandmeyer: } \\ce{CuX -> Ar-X + N2 ^}"
  },
  {
    "id": "sandmeyer_reaction_cyanide",
    "branch": "Organic",
    "chapter": "Amines & Diazonium Salts",
    "title": "Sandmeyer Cyano Substitution & Carboxylic Acid Route",
    "expr": "Ar−N₂⁺ Cl⁻ + CuCN / KCN → Ar−CN + N₂↑   —H₃O⁺ (complete hydrolysis)→ Ar−COOH + NH₄⁺",
    "keys": [
      "sandmeyer nitrile",
      "benzonitrile to benzoic acid",
      "aromatic nitrile",
      "partial hydrolysis amide"
    ],
    "symbols": [
      "CuCN / KCN provides copper(I) cyanide catalyst for radical substitution"
    ],
    "notes": [
      "Partial hydrolysis with alkaline H₂O₂ or conc. HCl yields primary aromatic amide Ar–CONH₂.",
      "Reduction with LiAlH₄ or H₂/Ni yields primary benzylamine Ar–CH₂NH₂."
    ],
    "example": "Benzenediazonium chloride with CuCN yields benzonitrile; boiling with dilute acid yields benzoic acid.",
    "latex": "\\ce{Ar-N2+Cl- + CuCN/KCN -> Ar-CN + N2 ^} \\xrightarrow{\\ce{H3O+}} \\ce{Ar-COOH + NH4+}"
  },
  {
    "id": "benzyne_mechanism_elimination_addition",
    "branch": "Organic",
    "chapter": "Aromatic Compounds",
    "title": "Benzyne (Elimination–Addition) Mechanism in Aryl Halides",
    "expr": "Chlorobenzene + KNH₂ / liq. NH₃ (196 K) → [Benzyne intermediate] → Aniline",
    "keys": [
      "benzyne mechanism",
      "cine substitution",
      "elimination addition",
      "knh2 liquid ammonia"
    ],
    "symbols": [
      "Intermediate: Benzyne (dehydrobenzene) containing strained triple bond (sp² overlapping in ring plane)",
      "Attacking NH₂⁻ at either carbon of triple bond gives cine-substitution products"
    ],
    "notes": [
      "o-chlorotoluene yields mixture of o-toluidine and m-toluidine."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Chlorobenzene + KNH₂ / liq. NH₃ (196 K) → [Benzyne intermediate] → Aniline",
    "latex": "\\ce{C6H5Cl + KNH2 / liq. NH3 ->[196\\text{ K}] [C6H4 \\text{ (Benzyne)}] -> C6H5NH2 \\text{ (Aniline)}}"
  },
  {
    "id": "friedel_crafts_acylation_clean",
    "branch": "Organic",
    "chapter": "Aromatic Compounds",
    "title": "Friedel–Crafts Acylation (No Rearrangement & Monoacylation)",
    "expr": "Ar−H + R−COCl + AlCl₃ → Ar−CO−R (Aromatic Ketone) + HCl",
    "keys": [
      "friedel crafts acylation",
      "acylium ion",
      "monoacylation",
      "no rearrangement"
    ],
    "symbols": [
      "Electrophile: resonance-stabilised acylium ion R–C≡O⁺",
      "No carbocation rearrangement occurs"
    ],
    "notes": [
      "Product ketone is deactivated, so polyacylation DOES NOT occur; clean single-product reaction."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Ar−H + R−COCl + AlCl₃ → Ar−CO−R (Aromatic Ketone) + HCl",
    "latex": "\\ce{Ar-H + R-COCl ->[\\text{anhyd. } \\ce{AlCl3}] Ar-CO-R \\text{ (Aromatic Ketone)} + HCl}"
  },
  {
    "id": "friedel_crafts_alkylation_traps",
    "branch": "Organic",
    "chapter": "Aromatic Compounds",
    "title": "Friedel–Crafts Alkylation Limitations & Carbocation Rearrangement",
    "expr": "Ar−H + R−Cl + AlCl₃ → Ar−R' + HCl   (Rearrangement occurs if R⁺ can form more stable ion)",
    "keys": [
      "friedel crafts alkylation",
      "carbocation rearrangement",
      "polyalkylation trap",
      "deactivated ring failure"
    ],
    "symbols": [
      "Benzene + 1-chloropropane gives ISOPROPYLBENZENE (cumene) as major product via 1,2-hydride shift (1° → 2° cation)",
      "Polyalkylation: monoalkylated product is more reactive than benzene, leading to polyalkylated side products"
    ],
    "notes": [
      "Reaction FAILS completely on strongly deactivated rings (−NO₂, −CN, −COOH) and on anilines (−NH₂ complexes with AlCl₃ catalyst)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Ar−H + R−Cl + AlCl₃ → Ar−R' + HCl   (Rearrangement occurs if R⁺ can form more stable ion)",
    "latex": "\\ce{Ar-H + R-Cl + AlCl3 -> Ar-R' + HCl} \\quad (\\text{Carbocation rearrangement occurs if } \\ce{R+} \\text{ forms more stable ion})"
  },
  {
    "id": "biuret_peptide_test",
    "branch": "Organic",
    "chapter": "Biomolecules",
    "title": "Biuret Test for Peptide Bonds & Proteins",
    "expr": "Protein + 10% NaOH + 1% CuSO₄ → [Cu(Peptide)₄]²⁻ (Violet / Purple Complex)",
    "keys": [
      "biuret test",
      "peptide bond detection",
      "protein test",
      "violet copper complex"
    ],
    "symbols": [
      "Requires at least TWO peptide (–CONH–) bonds separated by a single carbon or nitrogen",
      "Cu²⁺ coordinates with four amide nitrogens in a square planar geometry"
    ],
    "notes": [
      "Free amino acids (except histidine) and dipeptides give a NEGATIVE test (they lack two adjacent peptide links).",
      "Biuret itself (H₂N–CO–NH–CO–NH₂, formed on heating urea) gives a positive test."
    ],
    "example": "Egg albumin or gelatin mixed with alkaline CuSO₄ turns deep violet.",
    "latex": "\\text{Protein} + 10\\% \\ce{NaOH} + 1\\% \\ce{CuSO4} \\rightarrow [\\ce{Cu(Peptide)4}]^{2-} \\; (\\text{Violet Complex})"
  },
  {
    "id": "dna_chargaff_rules",
    "branch": "Organic",
    "chapter": "Biomolecules",
    "title": "Chargaff's Rules of DNA Base Pairing",
    "expr": "[A] = [T]   ,   [G] = [C]   |   [A + G] = [T + C]   (Purines = Pyrimidines)   |   A=T (2 H-bonds) , G≡C (3 H-bonds)",
    "keys": [
      "chargaffs rule",
      "dna base pairing",
      "purines pyrimidines",
      "double helix"
    ],
    "symbols": [
      "A: Adenine, T: Thymine (Purine = Pyrimidine, paired by 2 hydrogen bonds)",
      "G: Guanine, C: Cytosine (Purine = Pyrimidine, paired by 3 hydrogen bonds)",
      "Total purines [A + G] / Total pyrimidines [T + C] = 1.0 in double-stranded DNA"
    ],
    "notes": [
      "The ratio [A + T] / [G + C] is species-specific and varies widely, but [A]/[T] and [G]/[C] are always 1.0.",
      "DNA melting temperature (T_m) increases with higher G–C content due to the 3 hydrogen bonds per pair."
    ],
    "example": "If a double-stranded DNA sample contains 20% Adenine:\nThymine = 20%. Remaining 60% is shared equally: Guanine = 30%, Cytosine = 30%.",
    "latex": "[\\ce{A}] = [\\ce{T}], \\quad [\\ce{G}] = [\\ce{C}] \\quad \\Big| \\quad [\\ce{A + G}] = [\\ce{T + C}] \\quad (\\text{Purines} = \\text{Pyrimidines})"
  },
  {
    "id": "inversion_of_cane_sugar",
    "branch": "Organic",
    "chapter": "Biomolecules",
    "title": "Inversion of Cane Sugar (Sucrose Hydrolysis)",
    "expr": "Sucrose [α = +66.5°] + H₂O —H⁺ / Invertase→ D-(+)-Glucose [+52.5°] + D-(−)-Fructose [−92.4°]   =>   Invert Sugar [α = −19.9°]",
    "keys": [
      "inversion of cane sugar",
      "sucrose optical rotation",
      "invert sugar",
      "fructose glucose"
    ],
    "symbols": [
      "Sucrose is dextrorotatory (+66.5°)",
      "Equimolar hydrolysed mixture has net levorotation (−19.9°) because levorotation of fructose (−92.4°) dominates dextrorotation of glucose (+52.5°)"
    ],
    "notes": [
      "The process is called 'inversion' because the sign of optical rotation changes from (+) to (−).",
      "Sucrose is a non-reducing disaccharide (both anomeric carbons participate in α-1,2-glycosidic linkage); invert sugar is strongly reducing."
    ],
    "example": "Honey is primarily natural invert sugar (glucose + fructose), which is sweeter than sucrose.",
    "latex": "\\ce{Sucrose} \\; ([\\alpha] = +66.5^\\circ) + \\ce{H2O} \\xrightarrow{\\ce{H+}} \\ce{D-(+)-Glucose} \\; (+52.5^\\circ) + \\ce{D-(-)-Fructose} \\; (-92.4^\\circ) \\implies [\\alpha]_{\\text{mix}} = -19.9^\\circ"
  },
  {
    "id": "amino_acid_isoelectric_point",
    "branch": "Organic",
    "chapter": "Biomolecules",
    "title": "Isoelectric Point (pI) of Amino Acids",
    "expr": "Neutral: pI = ½ (pK_a1 + pK_a2)   |   Acidic: pI = ½ (pK_a1 + pK_aR)   |   Basic: pI = ½ (pK_aR + pK_a2)",
    "keys": [
      "isoelectric point",
      "zwitterion",
      "amino acid electrophoresis",
      "pi calculation"
    ],
    "symbols": [
      "pI: pH at which the amino acid carries no net electrical charge and does not migrate in an electric field",
      "pK_a1: α-COOH dissociation",
      "pK_a2: α-NH₃⁺ dissociation",
      "pK_aR: side-chain ionisation"
    ],
    "notes": [
      "At pH < pI, amino acid exists predominantly as a CATION and migrates to cathode.",
      "At pH > pI, amino acid exists as an ANION and migrates to anode.",
      "Solubility of proteins is MINIMAL at their isoelectric point."
    ],
    "example": "For Glycine (pK_a1 = 2.34, pK_a2 = 9.60):\npI = ½ (2.34 + 9.60) = ½ (11.94) = 5.97.",
    "latex": "\\text{Neutral: } \\text{p}I = \\frac{\\text{p}K_{a1} + \\text{p}K_{a2}}{2} \\quad \\Big| \\quad \\text{Acidic: } \\text{p}I = \\frac{\\text{p}K_{a1} + \\text{p}K_{a\\text{R}}}{2} \\quad \\Big| \\quad \\text{Basic: } \\text{p}I = \\frac{\\text{p}K_{a\\text{R}} + \\text{p}K_{a2}}{2}"
  },
  {
    "id": "molisch_carbohydrate_test",
    "branch": "Organic",
    "chapter": "Biomolecules",
    "title": "Molisch's General Test for Carbohydrates",
    "expr": "Carbohydrate + conc. H₂SO₄ —dehydration→ Furfural / 5-HMF + α-Naphthol → Purple / Violet Ring at Interface",
    "keys": [
      "molisch test",
      "carbohydrate detection",
      "alpha naphthol",
      "purple ring interface"
    ],
    "symbols": [
      "Conc. H₂SO₄ dehydrates pentoses to furfural and hexoses to 5-hydroxymethylfurfural (5-HMF)",
      "Furfural condenses with 2 molecules of α-naphthol to form a purple triphenylmethane dye"
    ],
    "notes": [
      "Universal test given by ALL carbohydrates (monosaccharides, disaccharides, polysaccharides).",
      "Reagent must be added gently down the side of the test tube without shaking to form two distinct layers."
    ],
    "example": "Glucose solution mixed with ethanolic α-naphthol forms a distinctive purple ring at the junction when conc. H₂SO₄ is layered beneath.",
    "latex": "\\text{Carbohydrate} \\xrightarrow{\\text{conc. } \\ce{H2SO4}} \\text{Furfural / 5-HMF} \\xrightarrow{\\alpha\\text{-naphthol}} \\text{Purple/Violet Ring at Interface}"
  },
  {
    "id": "mutarotation_glucose_equilibrium",
    "branch": "Organic",
    "chapter": "Biomolecules",
    "title": "Mutarotation Equilibrium of D-Glucose Anomers",
    "expr": "α-D-Glucopyranose [+112°] (36%) ⇌ Open Chain Form [0.02%] ⇌ β-D-Glucopyranose [+19°] (64%)   =>   Equilibrium [α = +52.7°]",
    "keys": [
      "mutarotation",
      "alpha beta glucose",
      "anomers",
      "anomeric carbon"
    ],
    "symbols": [
      "Mutarotation: spontaneous change in specific optical rotation of an optically active hemiacetal solution until equilibrium is reached",
      "Anomeric carbon is C-1 in glucose (C-2 in fructose)"
    ],
    "notes": [
      "β-anomer is more stable and abundant (64%) because all bulky substituents (−OH and −CH₂OH) occupy equatorial positions in the chair conformation.",
      "Mutarotation is catalysed by both acids and bases (amphiprotic solvents)."
    ],
    "example": "Freshly prepared solution of α-D-glucose has [α] = +112°; on standing, it falls steadily to +52.7°.",
    "latex": "\\ce{\\alpha-D-Glucopyranose} \\; (36\\%) \\rightleftharpoons \\ce{Open Chain} \\; (0.02\\%) \\rightleftharpoons \\ce{\\beta-D-Glucopyranose} \\; (64\\%) \\implies [\\alpha] = +52.7^\\circ"
  },
  {
    "id": "ninhydrin_amino_acid_test",
    "branch": "Organic",
    "chapter": "Biomolecules",
    "title": "Ninhydrin Test for α-Amino Acids",
    "expr": "α-Amino Acid + 2 Ninhydrin → Ruhemann's Purple (Diketohydrindylidene-diketohydrindamine) + R−CHO + CO₂ + NH₄⁺",
    "keys": [
      "ninhydrin test",
      "ruhemanns purple",
      "alpha amino acid",
      "proline yellow"
    ],
    "symbols": [
      "Ruhemann's purple: intense blue-violet chromophore formed by all α-amino acids with primary amino groups"
    ],
    "notes": [
      "Proline and hydroxyproline are secondary amines (imino acids) and give a characteristic YELLOW colour instead of purple.",
      "Used for visualizing latent fingerprints on paper."
    ],
    "example": "Alanine heated with dilute ninhydrin solution yields intense Ruhemann's purple.",
    "latex": "\\alpha\\text{-Amino Acid} + 2\\text{ Ninhydrin} \\rightarrow \\text{Ruhemann's Purple} + \\ce{R-CHO + CO2 ^ + NH4+}"
  },
  {
    "id": "xanthoproteic_test_aromatic_amino_acids",
    "branch": "Organic",
    "chapter": "Biomolecules",
    "title": "Xanthoproteic Test for Aromatic Amino Acids",
    "expr": "Protein with Phenyl Ring (Tyr, Trp, Phe) + conc. HNO₃ —heat→ Yellow Nitro Derivative —add alkali (NaOH)→ ORANGE",
    "keys": [
      "xanthoproteic test",
      "aromatic amino acids",
      "tyrosine tryptophan phenylalanine",
      "nitration of protein"
    ],
    "symbols": [
      "Nitration of benzene rings in tyrosine, tryptophan, and phenylalanine produces yellow nitro compounds",
      "Alkali converts nitrophenols into orange quinonoid phenoxide salts"
    ],
    "notes": [
      "Explains why concentrated nitric acid turns human skin yellow on accidental contact."
    ],
    "example": "Adding conc. HNO₃ to egg albumin produces a yellow precipitate that turns deep orange upon addition of excess NaOH.",
    "latex": "\\text{Aromatic Protein (Tyr, Trp, Phe)} + \\text{conc. } \\ce{HNO3} \\xrightarrow{\\Delta} \\text{Yellow} \\xrightarrow{\\ce{NaOH}} \\text{Orange}"
  },
  {
    "id": "antiseptics_vs_disinfectants",
    "branch": "Organic",
    "chapter": "Chemistry in Everyday Life",
    "title": "Antiseptics vs Disinfectants Concentration Dependence",
    "expr": "Phenol: 0.2% aqueous solution = Antiseptic   |   1.0% aqueous solution = Disinfectant",
    "keys": [
      "antiseptic vs disinfectant",
      "phenol concentration",
      "dettol composition",
      "bithionol",
      "tincture of iodine"
    ],
    "symbols": [
      "Antiseptics: applied to living tissues (wounds, cuts, skin) without causing cell death",
      "Disinfectants: applied to inanimate objects (floors, drains, instruments) to kill microorganisms",
      "Dettol: mixture of Chloroxylenol + Terpineol",
      "Bithionol: added to soaps to impart antiseptic properties",
      "Tincture of iodine: 2–3% solution of I₂ in alcohol-water mixture"
    ],
    "notes": [
      "Chlorine in concentrations of 0.2 to 0.4 ppm in aqueous solution makes water fit for drinking."
    ],
    "example": "Dilute 0.2% phenol protects living skin, while 1% phenol sterilises hospital floors.",
    "latex": "\\text{Phenol: } 0.2\\% \\; (\\text{Antiseptic}) \\quad \\Big| \\quad 1.0\\% \\; (\\text{Disinfectant})"
  },
  {
    "id": "artificial_sweeteners_comparison",
    "branch": "Organic",
    "chapter": "Chemistry in Everyday Life",
    "title": "Artificial Sweeteners Relative Sweetness Scale",
    "expr": "Aspartame (100×) < Saccharin (550×) < Sucralose (600×) < Alitame (2000×)   (relative to cane sugar = 1)",
    "keys": [
      "artificial sweeteners",
      "aspartame",
      "saccharin",
      "sucralose",
      "alitame"
    ],
    "symbols": [
      "Aspartame: methyl ester of dipeptide (aspartic acid + phenylalanine); UNSTABLE at cooking temperature (cold foods/soft drinks only)",
      "Saccharin: o-sulfobenzimide; first artificial sweetener (1879), excreted unchanged in urine",
      "Sucralose: trichloro derivative of sucrose; stable at cooking temperature, zero calories",
      "Alitame: high potency dipeptide; difficult to control sweetness"
    ],
    "notes": [
      "Aspartame must be avoided by phenylketonuric patients due to phenylalanine accumulation."
    ],
    "example": "Sucralose tastes like sugar and remains stable during baking.",
    "latex": "\\text{Aspartame (100}\\times\\text{)} < \\text{Saccharin (550}\\times\\text{)} < \\text{Sucralose (600}\\times\\text{)} < \\text{Alitame (2000}\\times\\text{)}"
  },
  {
    "id": "soap_saponification_cleansing",
    "branch": "Organic",
    "chapter": "Chemistry in Everyday Life",
    "title": "Saponification & Cleansing Action of Soap",
    "expr": "Fat / Oil (Triglyceride) + 3 NaOH → Glycerol + 3 R−COONa (Soap)   |   Hard Water: 2 RCOO⁻ + Ca²⁺ → (RCOO)₂Ca↓ (Curd)",
    "keys": [
      "saponification",
      "soap cleansing action",
      "micelle",
      "hard water scum",
      "synthetic detergents"
    ],
    "symbols": [
      "R–COONa: sodium salt of higher fatty acid (stearate C₁₇H₃₅COO⁻, palmitate C₁₅H₃₁COO⁻, oleate C₁₇H₃₃COO⁻)",
      "Hydrophobic tail (R–) dissolves in grease/oil droplet; hydrophilic head (–COO⁻) interacts with water, forming spherical micelles"
    ],
    "notes": [
      "Soaps do NOT work in hard water because Ca²⁺ and Mg²⁺ ions precipitate insoluble calcium and magnesium stearates (scum/curd).",
      "Synthetic detergents (e.g. sodium lauryl sulfate CH₃(CH₂)₁₁OSO₃⁻ Na⁺) form soluble calcium salts and work efficiently even in hard water."
    ],
    "example": "Saponification of glyceryl tristearate with sodium hydroxide yields glycerol and 3 molecules of sodium stearate.",
    "latex": "\\text{Triglyceride} + 3\\ce{NaOH} \\rightarrow \\text{Glycerol} + 3\\ce{R-COONa} \\; (\\text{Soap}) \\quad \\Big| \\quad \\ce{2RCOO- + Ca^2+ -> (RCOO)2Ca v}"
  },
  {
    "id": "aspirin_synthesis_equation",
    "branch": "Organic",
    "chapter": "Chemistry in Everyday Life",
    "title": "Synthesis of Aspirin (Acetylsalicylic Acid)",
    "expr": "C₆H₄(OH)COOH (Salicylic Acid) + (CH₃CO)₂O (Acetic Anhydride) —conc. H₂SO₄→ C₆H₄(OCOCH₃)COOH (Aspirin) + CH₃COOH",
    "keys": [
      "aspirin",
      "acetylsalicylic acid",
      "analgesic antipyretic",
      "blood thinner",
      "salicylic acid acetylation"
    ],
    "symbols": [
      "Aspirin: non-narcotic analgesic, antipyretic, anti-inflammatory, and anti-platelet agent"
    ],
    "notes": [
      "Inhibits cyclooxygenase (COX) enzymes, suppressing prostaglandin synthesis (which cause pain and fever).",
      "Acts as blood thinner by inhibiting blood clotting (used to prevent heart attacks)."
    ],
    "example": "Salicylic acid acetylated with excess acetic anhydride yields white needle-like crystals of aspirin.",
    "latex": "\\ce{C6H4(OH)COOH + (CH3CO)2O ->[\\text{conc. } \\ce{H2SO4}] C6H4(OCOCH3)COOH \\text{ (Aspirin)} + CH3COOH}"
  },
  {
    "id": "paracetamol_synthesis",
    "branch": "Organic",
    "chapter": "Chemistry in Everyday Life",
    "title": "Synthesis of Paracetamol (Acetaminophen)",
    "expr": "p-aminophenol (HO−C₆H₄−NH₂) + (CH₃CO)₂O → p-acetamidophenol (HO−C₆H₄−NHCOCH₃) + CH₃COOH",
    "keys": [
      "paracetamol",
      "acetaminophen",
      "antipyretic",
      "p aminophenol"
    ],
    "symbols": [
      "–NH₂ group is acetylated selectively because nitrogen is more nucleophilic than phenolic –OH group"
    ],
    "notes": [
      "Antipyretic (reduces fever) and mild analgesic; unlike aspirin, it does NOT irritate stomach lining nor cause anti-inflammatory action."
    ],
    "example": "Selective N-acetylation of p-aminophenol produces paracetamol.",
    "latex": "\\ce{\\textit{p}-aminophenol + (CH3CO)2O -> \\textit{p}-acetamidophenol \\text{ (Paracetamol)} + CH3COOH}"
  },
  {
    "id": "dbe",
    "branch": "Organic",
    "chapter": "General organic chemistry",
    "title": "Degree of unsaturation",
    "expr": "DBE = (2C + 2 + N − H − X) / 2",
    "keys": [
      "degree of unsaturation",
      "dbe",
      "double bond equivalent"
    ],
    "symbols": [
      "C, H, N, X: number of carbon, hydrogen, nitrogen and halogen atoms",
      "Oxygen and sulfur are ignored"
    ],
    "notes": [
      "Each ring or π bond counts 1; a triple bond counts 2.",
      "A benzene ring has DBE = 4."
    ],
    "example": "C₆H₆: DBE = (12 + 2 − 6)/2 = 4 (one ring + three C=C).",
    "latex": "\\text{DBE} = C + 1 - \\frac{H}{2} + \\frac{N}{2} - \\frac{X}{2} = \\frac{2C + 2 + N - H - X}{2}"
  },
  {
    "id": "carbocation_stability_aromatic_ions",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Aromatic Carbocations: Tropylium & Cyclopropenyl",
    "expr": "Cyclopropenyl Cation (C₃H₃⁺, 2 π e⁻, n=0): AROMATIC   |   Tropylium Cation (C₇H₇⁺, 6 π e⁻, n=1): AROMATIC",
    "keys": [
      "tropylium cation",
      "cyclopropenyl cation",
      "aromatic ions",
      "silver bromide precipitation"
    ],
    "symbols": [
      "Cyclopropenyl cation has 2 π electrons delocalized over 3 carbons (4n+2 with n=0)",
      "Tropylium cation (cycloheptatrienyl) has 6 π electrons delocalized over 7 carbons (4n+2 with n=1)"
    ],
    "notes": [
      "Tropylium bromide (C₇H₇Br) is completely ionic and water-soluble, instantly precipitating AgBr with aqueous AgNO₃.",
      "Cyclooctatetraenyl dianion (COT²⁻) has 10 π electrons (n=2) and is planar aromatic."
    ],
    "example": "Cycloheptatrienol treated with acid readily loses OH⁻ to form the stable yellow tropylium fluoroborate salt.",
    "latex": "\\text{Cyclopropenyl } (\\ce{C3H3+}, 2\\pi e^-, n=0) \\text{ and Tropylium } (\\ce{C7H7+}, 6\\pi e^-, n=1): \\; \\text{Aromatic and exceptionally stable}"
  },
  {
    "id": "stereoisomers_calculation_formula",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Calculation of Optical & Geometrical Isomers",
    "expr": "Dissimilar ends: Optically Active = 2^n , Meso = 0   |   Similar ends (even n): Active = 2^(n−1) , Meso = 2^(n/2 − 1)",
    "keys": [
      "number of optical isomers",
      "stereoisomers formula",
      "chiral carbons",
      "meso compounds"
    ],
    "symbols": [
      "n: number of chiral carbon atoms",
      "Similar ends (odd n): Active = 2^(n−1) − 2^((n−1)/2) , Meso = 2^((n−1)/2)"
    ],
    "notes": [
      "Tartaric acid has n = 2 with similar ends: Active = 2^(2−1) = 2 (d- and l-); Meso = 2^(1−1) = 1; Total optical isomers = 3."
    ],
    "example": "For CH₃–CH(OH)–CH(OH)–CH₃ (n = 2, similar ends):\nActive = 2¹ = 2, Meso = 2⁰ = 1. Total stereoisomers = 3.",
    "latex": "\\text{Dissimilar ends: } 2^n \\; (\\text{meso} = 0) \\quad \\Big| \\quad \\text{Similar ends (even } n\\text{): } a = 2^{n-1}, \\; m = 2^{(n/2)-1}"
  },
  {
    "id": "carbocation_stability_hierarchy",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Carbocation Stability Hierarchy & Rearrangements",
    "expr": "Stability: Tropylium > Cyclopropenyl > Trityl (Ph₃C⁺) > Benzyl ≈ Allyl > 3° > 2° > 1° > Methyl > Vinyl > Phenyl",
    "keys": [
      "carbocation stability",
      "1 2 hydride shift",
      "1 2 methyl shift",
      "ring expansion",
      "hyperconjugation"
    ],
    "symbols": [
      "Stability governed by: Aromaticity > Resonance delocalization > Hyperconjugation (α-H) > Inductive effect (+I)"
    ],
    "notes": [
      "Rearrangements occur via 1,2-hydride, 1,2-methyl, or 1,2-phenyl shifts to form a more stable carbocation.",
      "4-membered rings expand to 5-membered rings; 5-membered rings expand to 6-membered rings to relieve ring strain."
    ],
    "example": "Neopentyl cation (CH₃)₃C–CH₂⁺ (1°, 0 α-H) undergoes an instantaneous 1,2-methyl shift to form 2-methylbutan-2-yl cation (3°, 8 α-H).",
    "latex": "\\text{Stability: } \\text{Tropylium} > \\text{Cyclopropenyl} > \\text{Trityl} > \\text{Benzyl} \\approx \\text{Allyl} > 3^\\circ > 2^\\circ > 1^\\circ > \\ce{CH3+}"
  },
  {
    "id": "free_radical_stability_bond_dissociation",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Carbon Free Radical Stability & C–H Bond Dissociation Energy",
    "expr": "Stability: 3° > 2° > 1° > Methyl   |   C–H Bond Energy: 3° (381 kJ) < 2° (401 kJ) < 1° (422 kJ) < CH₄ (435 kJ)",
    "keys": [
      "free radical stability",
      "ch bond dissociation energy",
      "hyperconjugation radicals"
    ],
    "symbols": [
      "Weakest C–H bond is easiest to homolytically cleave to form radical"
    ],
    "notes": [
      "Explains high selectivity of free radical bromination at 3° positions."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Stability: 3° > 2° > 1° > Methyl   |   C–H Bond Energy: 3° (381 kJ) < 2° (401 kJ) < 1° (422 kJ) < CH₄ (435 kJ)",
    "latex": "\\text{Stability: } 3^\\circ > 2^\\circ > 1^\\circ > \\ce{^.CH3} \\quad \\Big| \\quad \\text{C--H Bond Energy: } 3^\\circ (381) < 2^\\circ (401) < 1^\\circ (422) < \\ce{CH4} (435\\,\\text{kJ})"
  },
  {
    "id": "hyperconjugation_carbocation_heat",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Heat of Hydrogenation vs Alkene Substitution",
    "expr": "Heat of Hydrogenation (ΔH_hydrog) is INVERSELY proportional to alkene stability",
    "keys": [
      "heat of hydrogenation",
      "alkene stability",
      "cis vs trans alkene stability"
    ],
    "symbols": [
      "More substituted alkenes release LESS heat upon catalytic hydrogenation (more stable ground state)"
    ],
    "notes": [
      "Measuring ΔH_hydrog experimentally confirms relative thermodynamic stabilities."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Heat of Hydrogenation (ΔH_hydrog) is INVERSELY proportional to alkene stability",
    "latex": "\\Delta H_{\\text{hydrog}} \\propto \\frac{1}{\\text{Alkene Stability}} \\propto \\frac{1}{\\alpha\\text{-H Count}}"
  },
  {
    "id": "huckel_aromaticity_criteria",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Hückel's Rule of Aromaticity & Antiaromaticity",
    "expr": "Aromatic: (4n + 2) π electrons   |   Antiaromatic: 4n π electrons   (n = 0, 1, 2, 3... in planar cyclic conjugated ring)",
    "keys": [
      "huckels rule",
      "aromaticity",
      "antiaromaticity",
      "non aromatic",
      "annulenes"
    ],
    "symbols": [
      "n: non-negative integer (0, 1, 2...)",
      "Cyclic, planar, fully conjugated (sp² or sp at every ring atom)"
    ],
    "notes": [
      "n=0 (2 π e⁻): Cyclopropenyl cation (stable aromatic).",
      "n=1 (6 π e⁻): Benzene, Cyclopentadienyl anion, Tropylium cation, Pyridine, Pyrrole, Furan, Thiophene.",
      "n=2 (10 π e⁻): Naphthalene, Azulene, Cyclooctatetraenyl dianion (COT²⁻).",
      "Antiaromatic (4n π e⁻): Cyclobutadiene (4 π), Cyclopentadienyl cation (4 π) — highly unstable.",
      "Cyclooctatetraene (COT, 8 π e⁻) adopts a non-planar tub conformation to avoid antiaromaticity; it is NON-AROMATIC."
    ],
    "example": "Tropylium cation (C₇H₇⁺) has 7 carbons and 6 π electrons (n = 1), making it an extraordinarily stable aromatic carbocation.",
    "latex": "\\text{Aromatic: } (4n + 2)\\pi \\text{ electrons}, \\quad \\text{Anti-Aromatic: } 4n\\pi \\text{ electrons} \\; (n = 0, 1, 2, \\dots)"
  },
  {
    "id": "hyperconjugation_stability_order",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Hyperconjugation (Baker–Nathan Effect) & Alkene Stability",
    "expr": "Number of Hyperconjugable Structures = Number of α-Hydrogens   |   Heat of Hydrogenation ∝ 1 / (Number of α-H)",
    "keys": [
      "hyperconjugation",
      "baker nathan",
      "no bond resonance",
      "alkene stability",
      "alpha hydrogen"
    ],
    "symbols": [
      "σ(C–H) → p-orbital or π* overlap",
      "Stability order of alkenes: Tetrasubstituted (12 α-H) > Trisubstituted (9 α-H) > Disubstituted (6 α-H) > Monosubstituted (3 α-H) > Ethene (0 α-H)"
    ],
    "notes": [
      "Trans-alkenes are more stable than cis-alkenes due to steric relief, having lower heat of hydrogenation.",
      "Exception: for but-2-ene isomers, isobutene (2-methylpropene, 6 α-H on same carbon) has the lowest heat of combustion."
    ],
    "example": "2,3-dimethylbut-2-ene has 12 α-hydrogens; it is the most stable isomer of C₆H₁₂ and has the lowest heat of hydrogenation.",
    "latex": "\\text{Hyperconjugable Structures} = \\text{Number of } \\alpha\\text{-Hydrogens}, \\quad \\text{Heat of Hydrogenation} \\propto \\frac{1}{\\text{Number of } \\alpha\\text{-H}}"
  },
  {
    "id": "inductive_effect_ranking",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Inductive Effect (−I and +I) Relative Orders",
    "expr": "−I: −NF₃⁺ > −NR₃⁺ > −NO₂ > −CN > −SO₃H > −CHO > −COOH > −F > −Cl > −Br > −I > −OR > −OH > −NH₂ > −C₆H₅ > −H   |   +I: −O⁻ > −COO⁻ > −C(CH₃)₃ > −CH(CH₃)₂ > −CH₂CH₃ > −CH₃ > −T > −D > −H",
    "keys": [
      "inductive effect",
      "minus i plus i",
      "substituent constant",
      "electronegativity sigma"
    ],
    "symbols": [
      "−I: electron-withdrawing through σ-bonds",
      "+I: electron-donating through σ-bonds"
    ],
    "notes": [
      "Falls off rapidly with distance; virtually negligible beyond 3 carbon atoms.",
      "Deuterium (−D) and Tritium (−T) have stronger +I effect than protium (−H) due to shorter, tighter C–D/C–T bonds."
    ],
    "example": "Fluoroacetic acid (pK_a = 2.59) is much stronger than chloroacetic acid (pK_a = 2.87) because −F has stronger −I than −Cl.",
    "latex": "-I: \\ce{-NF3+ > -NR3+ > -NO2 > -CN > -SO3H > -CHO > -COOH > -F > -Cl > -Br > -I > -OR > -OH > -NH2 > -Ph > -H} \\quad \\Big| \\quad +I: \\ce{-O- > -COO- > -C(CH3)3 > -CH(CH3)2 > -CH2CH3 > -CH3 > -T > -D > -H}"
  },
  {
    "id": "tautomerism_enol_content",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Keto–Enol Tautomerism Factors Governing Enol Content",
    "expr": "Enol content increased by: Aromatisation > Extended Conjugation > Intramolecular H-Bonding",
    "keys": [
      "keto enol tautomerism",
      "enol content",
      "acetylacetone",
      "phenol tautomerism"
    ],
    "symbols": [
      "Simple acetone: enol content < 0.001% (keto far more stable)",
      "Acetylacetone (CH₃COCH₂COCH₃): enol content ≈ 76% due to 6-membered intramolecular H-bonded ring",
      "Phenol: enol content > 99.999% due to aromatic resonance stabilization"
    ],
    "notes": [
      "Crucial organic topic tested frequently in JEE Advanced."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Enol content increased by: Aromatisation > Extended Conjugation > Intramolecular H-Bonding",
    "latex": "\\text{Enol Content Factor: Aromatisation} > \\text{Extended Conjugation} > \\text{Intramolecular H-Bonding}"
  },
  {
    "id": "lassaigne_nitrogen_sulfur_together",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Lassaigne's Blood-Red Test for N and S Together",
    "expr": "Na + C + N + S —fusion (insufficient Na)→ NaSCN   |   3 NaSCN + FeCl₃ → Fe(SCN)₃ (Blood-Red Solution) + 3 NaCl",
    "keys": [
      "blood red ferric thiocyanate",
      "nitrogen and sulfur together",
      "thiocyanate",
      "iron thiocyanate"
    ],
    "symbols": [
      "NaSCN: sodium thiocyanate (forms when insufficient sodium is used during fusion)",
      "Fe(SCN)₃ or [Fe(H₂O)₅(SCN)]²⁺ gives characteristic deep blood-red coloration"
    ],
    "notes": [
      "If excess sodium is used in fusion, NaSCN decomposes into NaCN and Na₂S, which gives Prussian blue and nitroprusside tests separately."
    ],
    "example": "Thiourea fused with sodium gives blood red colour with FeCl₃.",
    "latex": "\\ce{Na + C + N + S ->[\\Delta] NaSCN}, \\quad \\ce{3NaSCN + FeCl3 -> Fe(SCN)3 \\text{ (Blood-Red Solution)} + 3NaCl}"
  },
  {
    "id": "lassaigne_nitrogen_test",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Lassaigne's Test for Nitrogen (Prussian Blue)",
    "expr": "Na + C + N —fusion→ NaCN   |   6 NaCN + FeSO₄ → Na₄[Fe(CN)₆] + Na₂SO₄   |   3 Na₄[Fe(CN)₆] + 4 FeCl₃ → Fe₄[Fe(CN)₆]₃↓ (Prussian Blue) + 12 NaCl",
    "keys": [
      "lassaigne test",
      "prussian blue",
      "nitrogen detection",
      "sodium fusion extract"
    ],
    "symbols": [
      "Sodium fusion converts covalent organic nitrogen into ionic sodium cyanide",
      "Fe₄[Fe(CN)₆]₃: ferric ferrocyanide (Prussian blue precipitate confirms nitrogen)"
    ],
    "notes": [
      "Hydrazine (NH₂NH₂) and hydroxylamine (NH₂OH) do NOT give Lassaigne's nitrogen test because they contain no carbon to form NaCN.",
      "Diazo compounds and nitro compounds DO give the test."
    ],
    "example": "Organic sample containing N fused with Na gives intense Prussian blue with FeSO₄ and FeCl₃.",
    "latex": "\\ce{6NaCN + FeSO4 -> Na4[Fe(CN)6]}, \\quad \\ce{3Na4[Fe(CN)6] + 4FeCl3 -> Fe4[Fe(CN)6]3 v \\text{ (Prussian Blue)} + 12NaCl}"
  },
  {
    "id": "lassaigne_sulfur_nitroprusside",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Lassaigne's Test for Sulfur (Sodium Nitroprusside)",
    "expr": "2 Na + S —fusion→ Na₂S   |   Na₂S + Na₂[Fe(CN)₅NO] → Na₄[Fe(CN)₅NOS] (Deep Violet Complex)",
    "keys": [
      "sulfur detection",
      "sodium nitroprusside",
      "deep violet",
      "lassaigne sulfur"
    ],
    "symbols": [
      "Na₂[Fe(CN)₅NO]: sodium nitroprusside",
      "Na₄[Fe(CN)₅NOS]: sodium thionitroprusside (intense violet coloration confirms sulfur)"
    ],
    "notes": [
      "Lead acetate test for sulfur: Na₂S + (CH₃COO)₂Pb → PbS↓ (black precipitate) + 2 CH₃COONa."
    ],
    "example": "Fusion extract of sulfur-containing organic compound turns brilliant purple on adding a few drops of freshly prepared sodium nitroprusside.",
    "latex": "\\ce{2Na + S ->[\\Delta] Na2S}, \\quad \\ce{Na2S + Na2[Fe(CN)5NO] -> Na4[Fe(CN)5NOS] \\text{ (Deep Violet Complex)}}"
  },
  {
    "id": "mesomeric_effect_ranking",
    "branch": "Organic",
    "chapter": "General Organic Chemistry",
    "title": "Mesomeric / Resonance (+M and −M) Relative Orders",
    "expr": "+M: −O⁻ > −NH₂ > −NHR > −OH > −OR > −NHCOR > −OCOR > −Ph > −X   |   −M: −NO₂ > −CN > −SO₃H > −CHO > −COR > −COOH > −COOR > −CONH₂",
    "keys": [
      "mesomeric effect",
      "resonance effect",
      "plus m minus m",
      "conjugation"
    ],
    "symbols": [
      "+M (electron donating via lone pair conjugation)",
      "−M (electron withdrawing via conjugated multiple bonds)"
    ],
    "notes": [
      "Mesomeric effect does NOT depend on distance within a conjugated π-system.",
      "Halogens (−F, −Cl, −Br, −I) are −I but +M; the −I effect dominates overall reactivity (deactivates ring), but +M determines ortho/para orientation."
    ],
    "example": "Aniline reacts instantly with bromine water to give 2,4,6-tribromoaniline because −NH₂ is an extremely powerful +M activating group.",
    "latex": "+M: \\ce{-O- > -NH2 > -NHR > -OH > -OR > -NHCOR > -OCOR > -Ph > -X} \\quad \\Big| \\quad -M: \\ce{-NO2 > -CN > -SO3H > -CHO > -COR > -COOH > -COOR > -CONH2}"
  },
  {
    "id": "saytzeff_hofmann",
    "branch": "Organic",
    "chapter": "Haloalkanes & Elimination",
    "title": "Saytzeff vs Hofmann Elimination Regiochemistry",
    "expr": "Saytzeff (Zaitsev): More substituted alkene   |   Hofmann: Less substituted alkene",
    "keys": [
      "saytzeff",
      "zaitsev",
      "hofmann elimination",
      "regiochemistry"
    ],
    "symbols": [
      "Saytzeff: favoured by unhindered bases (alc. KOH, EtO⁻) and good leaving groups (Br⁻, I⁻, OTs⁻)",
      "Hofmann: favoured by bulky hindered bases (t-BuO⁻K⁺, LDA) OR poor leaving groups (–N⁺Me₃, –S⁺Me₂, –F)"
    ],
    "notes": [
      "Saytzeff product is thermodynamically more stable due to greater hyperconjugation and alkyl substitution.",
      "Hofmann product forms because bulky base preferentially abstracts the more accessible, less sterically hindered acidic proton."
    ],
    "example": "2-Bromobutane + alcoholic KOH → But-2-ene (major, 81%, Saytzeff) + But-1-ene (minor, 19%).\nWith potassium tert-butoxide (t-BuOK), But-1-ene becomes the major product (Hofmann).",
    "latex": "\\text{Saytzeff (Zaitsev): More substituted alkene} \\quad \\Big| \\quad \\text{Hofmann: Less substituted alkene}"
  },
  {
    "id": "finkelstein_swarts_reactions",
    "branch": "Organic",
    "chapter": "Haloalkanes and Haloarenes",
    "title": "Finkelstein & Swarts Halogen Exchange Reactions",
    "expr": "Finkelstein: R−Cl / R−Br + NaI —acetone→ R−I + NaCl / NaBr↓   |   Swarts: R−Cl / R−Br + AgF / SbF₃ / Hg₂F₂ → R−F",
    "keys": [
      "finkelstein reaction",
      "swarts reaction",
      "halogen exchange",
      "alkyl iodide",
      "alkyl fluoride"
    ],
    "symbols": [
      "Finkelstein driven by Le Chatelier principle: NaCl and NaBr are INSOLUBLE in dry acetone and precipitate out, while NaI is soluble"
    ],
    "notes": [
      "Swarts reaction is the best standard synthetic method for preparing alkyl fluorides (direct fluorination of alkanes is too explosive)."
    ],
    "example": "CH₃CH₂Br + NaI (in acetone) → CH₃CH₂I + NaBr↓ (white ppt).",
    "latex": "\\textbf{Finkelstein: } \\ce{R-X + NaI ->[\\text{acetone}] R-I + NaX v} \\quad \\Big| \\quad \\textbf{Swarts: } \\ce{R-X + AgF -> R-F + AgX v}"
  },
  {
    "id": "sn1_sn2_summary",
    "branch": "Organic",
    "chapter": "Haloalkanes and Haloarenes",
    "title": "S_N1 vs S_N2 Kinetic Rate Laws & Stereochemistry",
    "expr": "S_N1: Rate = k [R−X] (Racemisation)   |   S_N2: Rate = k [R−X][Nu⁻] (Walden Inversion)",
    "keys": [
      "sn1",
      "sn2",
      "nucleophilic substitution",
      "walden inversion"
    ],
    "symbols": [
      "S_N1: two-step mechanism via planar carbocation; favored by 3° > 2° alkyl halides and polar protic solvents (H₂O, EtOH)",
      "S_N2: one-step concerted backside attack; favored by methyl > 1° > 2° alkyl halides, polar aprotic solvents (acetone, DMF, DMSO), and strong nucleophiles"
    ],
    "notes": [
      "Neopentyl halide (CH₃)₃C–CH₂–X is 1° but essentially unreactive by S_N2 due to massive steric crowding.",
      "Allylic and benzylic halides react very rapidly by BOTH S_N1 (resonance-stabilised carbocation) and S_N2 (conjugation in transition state).",
      "Vinyl and aryl halides (CH₂=CH–Cl, Ph–Cl) are completely inert to both S_N1 and S_N2 under normal conditions."
    ],
    "example": "(R)-2-Bromobutane + aqueous NaOH gives racemic butan-2-ol via S_N1; with NaSH in acetone it gives (S)-butan-2-thiol via S_N2.",
    "latex": "\\textbf{S}_\\text{N}1\\text{: } \\text{Rate} = k [\\ce{R-X}] \\; (\\text{Racemisation}) \\quad \\Big| \\quad \\textbf{S}_\\text{N}2\\text{: } \\text{Rate} = k [\\ce{R-X}][\\ce{Nu-}] \\; (\\text{Walden Inversion})"
  },
  {
    "id": "sn1_vs_sn2_rate_laws",
    "branch": "Organic",
    "chapter": "Haloalkanes and Haloarenes",
    "title": "S_N1 vs S_N2 Nucleophilic Substitution Mechanisms",
    "expr": "S_N1: Rate = k [R−X]   (2 steps, carbocation, racemisation)   |   S_N2: Rate = k [R−X] [Nu⁻]   (1 step, backside attack, Walden inversion)",
    "keys": [
      "sn1 vs sn2",
      "nucleophilic substitution",
      "walden inversion",
      "racemisation",
      "carbocation intermediate"
    ],
    "symbols": [
      "S_N1 reactivity: 3° > 2° > 1° > CH₃ (favoured by polar protic solvents: H₂O, EtOH)",
      "S_N2 reactivity: CH₃ > 1° > 2° > 3° (favoured by polar aprotic solvents: DMSO, DMF, acetone)"
    ],
    "notes": [
      "Allyl and benzyl halides undergo BOTH S_N1 (resonance-stabilised carbocation) and S_N2 (unhindered orbital overlap) at exceptionally high rates.",
      "Vinyl and aryl halides do NOT undergo either S_N1 or S_N2 under normal conditions."
    ],
    "example": "Optically active (R)-2-bromobutane with aq. KOH (S_N2) gives (S)-butan-2-ol with complete Walden inversion.",
    "latex": "\\textbf{S}_\\text{N}1\\text{: } \\text{Rate} = k [\\ce{R-X}] \\; (2\\text{ steps, carbocation, polar protic}) \\quad \\Big| \\quad \\textbf{S}_\\text{N}2\\text{: } \\text{Rate} = k [\\ce{R-X}][\\ce{Nu-}] \\; (1\\text{ step, backside attack, polar aprotic})"
  },
  {
    "id": "haloalkane_elimination_saytzeff_hofmann",
    "branch": "Organic",
    "chapter": "Haloalkanes and Haloarenes",
    "title": "Saytzeff vs Hofmann Elimination Regioselectivity",
    "expr": "Saytzeff (Small base, good leaving group Br⁻/I⁻): More Substituted Alkene   |   Hofmann (Bulky base t-BuO⁻ or poor leaving group F⁻/−NR₃⁺): Less Substituted Alkene",
    "keys": [
      "saytzeff rule",
      "hofmann elimination",
      "regioselectivity",
      "bulky base"
    ],
    "symbols": [
      "Saytzeff product is thermodynamically more stable (more hyperconjugative α-hydrogens)",
      "Hofmann product is kinetically favoured when steric hindrance prevents removal of more hindered internal proton"
    ],
    "notes": [
      "Elimination of quaternary ammonium hydroxides [R–N⁺(CH₃)₃ OH⁻] on heating gives HOFMANN alkene.",
      "Elimination of 2-fluorobutane gives but-1-ene (Hofmann major) because F has strong −I effect, making terminal C-1 hydrogens most acidic."
    ],
    "example": "2-bromobutane with alcoholic KOH gives but-2-ene (81% Saytzeff); with potassium tert-butoxide, it gives but-1-ene (72% Hofmann).",
    "latex": "\\text{Saytzeff (small base, good LG): More Substituted} \\quad \\Big| \\quad \\text{Hofmann (bulky base } t\\text{-BuO}^- \\text{ or poor LG } \\ce{F-}\\text{): Less Substituted}"
  },
  {
    "id": "specific_rotation_equation",
    "branch": "Organic",
    "chapter": "Haloalkanes and Haloarenes",
    "title": "Specific Optical Rotation Formula",
    "expr": "[α]_D^T = α_observed / (l · c)",
    "keys": [
      "specific rotation",
      "optical activity",
      "polarimeter",
      "enantiomeric excess"
    ],
    "symbols": [
      "[α]_D^T: specific rotation at temperature T using sodium D-line (589 nm)",
      "α_observed: measured optical rotation in degrees",
      "l: path length in decimetres (dm, 1 dm = 10 cm)",
      "c: concentration in g mL⁻¹ (or g cm⁻³)"
    ],
    "notes": [
      "Enantiomeric excess (% ee) = (Observed specific rotation / Specific rotation of pure enantiomer) × 100% = |d − l| / (d + l) × 100%."
    ],
    "example": "1.0 g of chiral compound dissolved in 20 mL solution (c = 0.05 g mL⁻¹) in a 2 dm polarimeter tube rotates plane of light by +2.5°:\n[α] = +2.5 / (2 × 0.05) = +2.5 / 0.1 = +25°.",
    "latex": "[\\alpha]_D^T = \\frac{\\alpha_{\\text{obs}}}{l \\times c}"
  },
  {
    "id": "wurtz_fittig",
    "branch": "Organic",
    "chapter": "Haloalkanes and Haloarenes",
    "title": "Wurtz, Fittig & Wurtz–Fittig Reactions",
    "expr": "Wurtz: 2 R–X + 2 Na (dry ether) → R–R   |   Fittig: 2 Ar–X + 2 Na → Ar–Ar   |   Wurtz–Fittig: R–X + Ar–X + 2 Na → Ar–R",
    "keys": [
      "wurtz",
      "fittig",
      "wurtz fittig",
      "alkane coupling"
    ],
    "symbols": [
      "Reagents: metallic sodium in dry ether (moisture decomposes Na violently)"
    ],
    "notes": [
      "Suitable only for symmetrical alkanes with an EVEN number of carbons. Mixing two different alkyl halides gives a complex mixture of 3 alkanes.",
      "Frankland reaction uses Zinc powder instead of Na: 2 R–X + Zn → R–R + ZnX₂."
    ],
    "example": "Bromobenzene + methyl bromide + 2 Na (dry ether) → Toluene (methylbenzene) + 2 NaBr.",
    "latex": "\\textbf{Wurtz: } \\ce{2R-X + 2Na -> R-R} \\quad \\Big| \\quad \\textbf{Fittig: } \\ce{2Ar-X + 2Na -> Ar-Ar} \\quad \\Big| \\quad \\textbf{Wurtz--Fittig: } \\ce{R-X + Ar-X + 2Na -> Ar-R}"
  },
  {
    "id": "baeyer_reagent_oxidation",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Baeyer's Test for Unsaturation (Cold Alkaline KMnO₄)",
    "expr": "R−CH=CH₂ + cold dil. KMnO₄ (alkaline) → R−CH(OH)−CH₂(OH) (Syn-1,2-Diol)",
    "keys": [
      "baeyers reagent",
      "test for unsaturation",
      "pink to brown mno2",
      "syn dihydroxylation"
    ],
    "symbols": [
      "Purple colour of KMnO₄ disappears, brown precipitate of MnO₂ forms"
    ],
    "notes": [
      "Adds two –OH groups to the SAME face (syn-dihydroxylation via cyclic manganate ester)."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: R−CH=CH₂ + cold dil. KMnO₄ (alkaline) → R−CH(OH)−CH₂(OH) (Syn-1,2-Diol)",
    "latex": "\\ce{R-CH=CH2 + cold dil. KMnO4(alkaline) -> R-CH(OH)-CH2OH} \\quad (\\textit{syn}\\text{-1,2-diol})"
  },
  {
    "id": "cope_claisen_sigmatropic",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Cope & Claisen [3,3]-Sigmatropic Rearrangements",
    "expr": "Cope: 1,5-Diene —heat (300 °C)→ Isomeric 1,5-Diene   |   Claisen: Allyl Vinyl Ether —heat (200 °C)→ γ,δ-Unsaturated Carbonyl",
    "keys": [
      "cope rearrangement",
      "claisen rearrangement",
      "3 3 sigmatropic",
      "pericyclic chair transition"
    ],
    "symbols": [
      "Concerted pericyclic rearrangement proceeding through a 6-membered chair-like transition state"
    ],
    "notes": [
      "Aromatic Claisen rearrangement: Allyl phenyl ether heated to 200 °C rearranges cleanly into ortho-allylphenol via [3,3]-shift followed by enolisation.",
      "If both ortho positions are blocked, the allyl group migrates to the PARA position via two successive [3,3]-shifts."
    ],
    "example": "Allyl phenyl ether on heating gives 2-allylphenol.",
    "latex": "\\textbf{Cope: } \\text{1,5-Diene} \\xrightarrow{300^\\circ\\text{C}} \\text{Isomeric 1,5-Diene} \\quad \\Big| \\quad \\textbf{Claisen: } \\text{Allyl Vinyl Ether} \\xrightarrow{200^\\circ\\text{C}} \\gamma,\\delta\\text{-Unsaturated Carbonyl}"
  },
  {
    "id": "corey_house_synthesis",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Corey–House Synthesis of Unsymmetrical Alkanes",
    "expr": "R₂CuLi (Gilman Reagent) + R'−X → R−R' + R−Cu + LiX",
    "keys": [
      "corey house synthesis",
      "gilman reagent",
      "unsymmetrical alkane",
      "dialkylcopper lithium"
    ],
    "symbols": [
      "Preparation of Gilman reagent: R–X + 2 Li → R–Li; 2 R–Li + CuI → R₂CuLi + LiI",
      "R'–X: 1° alkyl halide (or methyl/allyl/benzyl/aryl); 2° and 3° alkyl halides give elimination"
    ],
    "notes": [
      "Superior to Wurtz reaction because it gives PURE unsymmetrical alkanes in high yield without coupling mixtures."
    ],
    "example": "(CH₃)₂CuLi + CH₃(CH₂)₄Br → CH₃(CH₂)₄CH₃ (n-hexane) in excellent yield.",
    "latex": "\\ce{R2CuLi \\text{ (Gilman)} + R'-X -> R-R' + R-Cu + LiX} \\quad (R' \\text{ may be } 1^\\circ, 2^\\circ, \\text{allyl, or aryl})"
  },
  {
    "id": "diels_alder_cycloaddition",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Diels–Alder [4+2] Cycloaddition",
    "expr": "Conjugated Diene (4 π e⁻, s-cis) + Dienophile (2 π e⁻) —heat→ Cyclohexene Adduct",
    "keys": [
      "diels alder",
      "cycloaddition",
      "4 plus 2",
      "s cis conformation",
      "pericyclic reaction"
    ],
    "symbols": [
      "Diene: must adopt s-cis conformation (cyclic dienes like cyclopentadiene are locked in s-cis and react fastest)",
      "Dienophile: activated by electron-withdrawing groups (–CHO, –COR, –CN, –COOR, maleic anhydride)",
      "Concerted pericyclic mechanism (no carbocation/radical intermediate)"
    ],
    "notes": [
      "Stereospecific: stereochemistry of both diene and dienophile is preserved in the product (cis-dienophile gives cis-cyclohexene).",
      "Endo rule: electron-withdrawing group on dienophile preferentially adopts the endo position due to secondary orbital interaction."
    ],
    "example": "Cyclopentadiene + maleic anhydride react exothermically at room temperature to give endo-norbornene anhydride.",
    "latex": "\\text{Diene (4}\\pi e^-, s\\text{-}\\textit{cis}\\text{)} + \\text{Dienophile (2}\\pi e^-\\text{)} \\xrightarrow{\\Delta} \\text{Cyclohexene Adduct [4+2]}"
  },
  {
    "id": "free_radical_halogenation_selectivity",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Free Radical Halogenation Reactivity-Selectivity Ratio",
    "expr": "Chlorination at 300 K: 3° : 2° : 1° = 5.0 : 3.8 : 1.0   |   Bromination at 400 K: 3° : 2° : 1° = 1600 : 82 : 1",
    "keys": [
      "alkane halogenation",
      "chlorination vs bromination",
      "reactivity selectivity principle"
    ],
    "symbols": [
      "Chlorine is highly reactive, non-selective; gives mixture of all monochloro isomers",
      "Bromine is unreactive, highly selective; gives exclusively 3° bromoalkane as major product"
    ],
    "notes": [
      "In isobutane: bromination gives >99% 2-bromo-2-methylpropane."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: Chlorination at 300 K: 3° : 2° : 1° = 5.0 : 3.8 : 1.0   |   Bromination at 400 K: 3° : 2° : 1° = 1600 : 82 : 1",
    "latex": "\\text{Chlorination (300 K): } 3^\\circ : 2^\\circ : 1^\\circ = 5.0 : 3.8 : 1.0 \\quad \\Big| \\quad \\text{Bromination (400 K): } 1600 : 82 : 1"
  },
  {
    "id": "hydroboration_oxidation_alkenes",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Hydroboration–Oxidation of Alkenes (Anti-Markovnikov Syn-Hydration)",
    "expr": "3 R−CH=CH₂ + BH₃ · THF → (RCH₂CH₂)₃B —H₂O₂ / OH⁻→ 3 R−CH₂−CH₂OH + B(OH)₃",
    "keys": [
      "hydroboration oxidation",
      "anti markovnikov alcohol",
      "syn addition",
      "no carbocation rearrangement"
    ],
    "symbols": [
      "BH₃ adds across double bond in a concerted 4-membered cyclic transition state",
      "B adds to less substituted carbon, H adds to more substituted carbon on the SAME face (syn addition)"
    ],
    "notes": [
      "Delivers Anti-Markovnikov net addition of H and OH.",
      "NO carbocation is formed, so NO skeleton rearrangements occur."
    ],
    "example": "3,3-dimethylbut-1-ene + B₂H₆ followed by alkaline H₂O₂ yields pure 3,3-dimethylbutan-1-ol without rearrangement (acid hydration would rearrange to 2,3-dimethylbutan-2-ol).",
    "latex": "\\ce{3 R-CH=CH2 + BH3 \\cdot THF -> (RCH2CH2)3B} \\xrightarrow{\\ce{H2O2 / OH-}} \\ce{3 R-CH2CH2OH} + \\ce{B(OH)3} \\; (\\textit{syn}\\text{-addition, anti-Markovnikov})"
  },
  {
    "id": "kolbe_electrolysis_anion_discharge",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Kolbe Electrolysis: Saturated vs Unsaturated Products",
    "expr": "Monocarboxylate: 2 RCOO⁻ → R−R + 2 CO₂   |   Succinates: −OOC−(CH₂)₂−COO⁻ → CH₂=CH₂ (Ethene)   |   Maleate: −OOC−CH=CH−COO⁻ → CH≡CH (Ethyne)",
    "keys": [
      "kolbe electrolysis variants",
      "sodium succinate ethene",
      "sodium maleate ethyne",
      "dicarboxylic acid electrolysis"
    ],
    "symbols": [
      "Electrolysis of potassium salts of dicarboxylic acids yields alkenes or alkynes"
    ],
    "notes": [
      "Potassium succinate produces ethene at the anode; potassium maleate or fumarate produces ethyne."
    ],
    "example": "Electrolysing aqueous potassium succinate produces ethene gas and carbon dioxide at the anode.",
    "latex": "\\textbf{Mono: } \\ce{2RCOO- -> R-R + 2CO2} \\quad \\Big| \\quad \\textbf{Succinate: } \\ce{^-OOC-(CH2)2-COO- -> CH2=CH2} \\quad \\Big| \\quad \\textbf{Maleate: } \\ce{HC#CH}"
  },
  {
    "id": "kolbe_electrolytic_synthesis",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Kolbe's Electrolytic Decarboxylation",
    "expr": "2 R−COOK + 2 H₂O —electrolysis→ R−R + 2 CO₂ (anode)   +   H₂ + 2 KOH (cathode)",
    "keys": [
      "kolbe electrolytic",
      "anode cathode products",
      "free radical decarboxylation",
      "alkane synthesis"
    ],
    "symbols": [
      "Anode reaction: 2 RCOO⁻ − 2e⁻ → 2 RCOO· → 2 R· + 2 CO₂; R· + R· → R–R",
      "Cathode reaction: 2 H₂O + 2e⁻ → H₂ + 2 OH⁻"
    ],
    "notes": [
      "pH of solution increases during electrolysis as basic KOH accumulates.",
      "Using sodium succinate yields ethene; sodium maleate/fumarate yields ethyne."
    ],
    "example": "Electrolysis of potassium acetate (CH₃COOK) produces ethane (C₂H₆) and CO₂ at the anode, and H₂ gas at the cathode.",
    "latex": "\\ce{2 R-COOK + 2H2O ->[\\text{electrolysis}] R-R + 2CO2 ^ \\text{ (anode)} + H2 ^ + 2KOH \\text{ (cathode)}}"
  },
  {
    "id": "kucherov_reaction_alkynes",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Kucherov Hydration of Alkynes to Carbonyls",
    "expr": "R−C≡CH + H₂O —1% HgSO₄ / 20% H₂SO₄ (333 K)→ [R−C(OH)=CH₂] (enol) → R−COCH₃ (Methyl Ketone)",
    "keys": [
      "kucherov reaction",
      "hydration of alkynes",
      "hgso4 h2so4",
      "ethyne to ethanal"
    ],
    "symbols": [
      "Ethyne (HC≡CH) is the ONLY alkyne that yields an ALDEHYDE (ethanal)",
      "All other terminal and internal alkynes yield KETONES"
    ],
    "notes": [
      "Proceeds via enol intermediate which tautomerises to stable carbonyl."
    ],
    "example": "Formula and quantitative application for JEE/CBSE exams: R−C≡CH + H₂O —1% HgSO₄ / 20% H₂SO₄ (333 K)→ [R−C(OH)=CH₂] (enol) → R−COCH₃ (Methyl Ketone)",
    "latex": "\\ce{R-C#CH + H2O ->[1\\% \\ce{HgSO4} / 20\\% \\ce{H2SO4}][333\\text{ K}] [R-C(OH)=CH2] -> R-COCH3 \\text{ (Methyl Ketone)}}"
  },
  {
    "id": "markovnikov_peroxide",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Markovnikov & Anti-Markovnikov (Kharasch Effect)",
    "expr": "Ionic: CH₃CH=CH₂ + HX → CH₃CH(X)CH₃   |   Peroxide (HBr only): CH₃CH=CH₂ + HBr → CH₃CH₂CH₂Br",
    "keys": [
      "markovnikov",
      "anti markovnikov",
      "peroxide effect",
      "kharasch effect"
    ],
    "symbols": [
      "Markovnikov: electrophilic addition via more stable carbocation intermediate (3° > 2° > 1°)",
      "Anti-Markovnikov (Kharasch): free radical addition via more stable carbon radical (3° > 2° > 1°)"
    ],
    "notes": [
      "The peroxide effect works ONLY with HBr. For HCl, the H–Cl bond is too strong (step 1 endothermic). For HI, I–I formation is preferred over radical addition (step 2 endothermic).",
      "Carbocation rearrangements (hydride/methyl shifts) can occur in Markovnikov addition but NEVER in free radical addition."
    ],
    "example": "3,3-Dimethylbut-1-ene + HBr (no peroxide) gives 2-bromo-2,3-dimethylbutane as major product via carbocation rearrangement.",
    "latex": "\\textbf{Ionic: } \\ce{CH3CH=CH2 + HX -> CH3CH(X)CH3} \\quad \\Big| \\quad \\textbf{Peroxide (}\\ce{HBr}\\text{ only): } \\ce{CH3CH=CH2 + HBr ->[\\text{peroxide}] CH3CH2CH2Br}"
  },
  {
    "id": "markovnikov_peroxide_addition",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Markovnikov's Rule vs Kharasch Peroxide Effect",
    "expr": "Normal: R−CH=CH₂ + HX → R−CH(X)−CH₃   |   Peroxide (HBr only): R−CH=CH₂ + HBr / R₂O₂ → R−CH₂−CH₂Br",
    "keys": [
      "markovnikov rule",
      "peroxide effect",
      "kharasch effect",
      "anti markovnikov",
      "free radical addition"
    ],
    "symbols": [
      "Markovnikov: electrophilic addition via more stable carbocation intermediate (H⁺ attacks first)",
      "Peroxide effect: free radical mechanism (Br· attacks first to yield more stable 2° carbon radical)"
    ],
    "notes": [
      "The peroxide effect works ONLY with HBr; it fails for HF, HCl, and HI because one of the propagation steps is endothermic (H–Cl bond too strong to cleave; I· radicals dimerize to I₂ instead of attacking double bond)."
    ],
    "example": "Propene + HBr → 2-bromopropane (Markovnikov major).\nPropene + HBr + benzoyl peroxide → 1-bromopropane (anti-Markovnikov major).",
    "latex": "\\textbf{Normal: } \\ce{R-CH=CH2 + HX -> R-CH(X)-CH3} \\quad \\Big| \\quad \\textbf{Peroxide (}\\ce{HBr}\\text{ only): } \\ce{R-CH=CH2 + HBr ->[\\ce{R2O2}] R-CH2-CH2Br}"
  },
  {
    "id": "ozonolysis_cleavage_alkenes",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Ozonolysis of Alkenes (Reductive vs Oxidative Cleavage)",
    "expr": "Reductive (Zn/H₂O or Me₂S): C=C → C=O + O=C   |   Oxidative (H₂O₂): Aldehyde RCHO oxidised to RCOOH",
    "keys": [
      "ozonolysis",
      "reductive ozonolysis",
      "oxidative ozonolysis",
      "locating double bond"
    ],
    "symbols": [
      "Ozone adds across double bond to form molozonide, which rearranges into stable ozonide",
      "Reductive cleavage preserves aldehydes (RCHO); oxidative cleavage converts RCHO to carboxylic acids (RCOOH); ketones (R₂C=O) remain ketones in both"
    ],
    "notes": [
      "Primary diagnostic tool for determining the exact position of double and triple bonds in unknown hydrocarbons."
    ],
    "example": "Reductive ozonolysis of 2-methylbut-2-ene (CH₃–C(CH₃)=CH–CH₃) yields acetone (CH₃COCH₃) and ethanal (CH₃CHO).",
    "latex": "\\textbf{Reductive (}\\ce{Zn/H2O}\\text{): } \\ce{>C=C< -> >C=O + O=C<} \\quad \\Big| \\quad \\textbf{Oxidative (}\\ce{H2O2}\\text{): } \\ce{R-CHO -> R-COOH}"
  },
  {
    "id": "alkyne_reduction_stereospecific",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Stereospecific Reduction of Alkynes to Cis and Trans Alkenes",
    "expr": "Cis (Z): R−C≡C−R' + H₂ / Pd−CaCO₃ (Lindlar) → Cis-Alkene   |   Trans (E): R−C≡C−R' + Na / liq. NH₃ (Birch) → Trans-Alkene",
    "keys": [
      "lindlars catalyst",
      "birch reduction alkynes",
      "cis alkene",
      "trans alkene",
      "stereoselective reduction"
    ],
    "symbols": [
      "Lindlar's catalyst: Pd deactivated with CaCO₃ and poisoned with quinoline or lead acetate; delivers syn-addition of H₂",
      "Birch reduction: Na in liquid NH₃ at 240 K delivers anti-addition of electrons and protons via trans-radical anion intermediate"
    ],
    "notes": [
      "Terminal alkynes (RC≡CH) do NOT reduce with Na/liq. NH₃ (undergo acid-base deprotonation to give sodium acetylide RC≡C⁻ Na⁺ and H₂)."
    ],
    "example": "But-2-yne + H₂/Lindlar → cis-but-2-ene.\nBut-2-yne + Na/liq. NH₃ → trans-but-2-ene.",
    "latex": "\\textbf{\\textit{Cis} (Z): } \\ce{R-C#C-R' + H2 ->[\\text{Lindlar}] \\textit{cis}-alkene} \\quad \\Big| \\quad \\textbf{\\textit{Trans} (E): } \\ce{R-C#C-R' + Na/liq. NH3 -> \\textit{trans}-alkene}"
  },
  {
    "id": "wurtz_coupling_alkanes",
    "branch": "Organic",
    "chapter": "Hydrocarbons",
    "title": "Wurtz Reaction Coupling & Symmetrical Alkanes",
    "expr": "2 R−X + 2 Na —dry ether→ R−R + 2 NaX",
    "keys": [
      "wurtz reaction",
      "symmetrical alkane",
      "free radical coupling",
      "sodium dry ether"
    ],
    "symbols": [
      "R–X: primary alkyl halide preferred (methyl, ethyl, propyl)",
      "Mechanism: involves organosodium intermediate (R⁻ Na⁺) or free radicals (R·)"
    ],
    "notes": [
      "Cannot be used to prepare unsymmetrical alkanes efficiently (mixing R–X and R'–X gives a mixture of 3 alkanes: R–R, R'–R', and R–R', difficult to separate).",
      "Methane (CH₄) CANNOT be prepared by Wurtz reaction.",
      "3° alkyl halides undergo elimination (E2) to give alkenes instead of coupling."
    ],
    "example": "2 CH₃CH₂Br + 2 Na → CH₃CH₂CH₂CH₃ (n-butane) + 2 NaBr.",
    "latex": "\\ce{2 R-X + 2Na ->[\\text{dry ether}] R-R + 2NaX}"
  },
  {
    "id": "huckel_aromaticity",
    "branch": "Organic",
    "chapter": "Hydrocarbons & GOC",
    "title": "Hückel's Rule of Aromaticity",
    "expr": "Aromatic: (4n + 2) π electrons   |   Anti-Aromatic: 4n π electrons   (n = 0, 1, 2, 3...)",
    "keys": [
      "huckel rule",
      "aromaticity",
      "antiaromatic",
      "cyclooctatetraene"
    ],
    "symbols": [
      "Conditions: 1. Cyclic, 2. Planar, 3. Complete conjugation (delocalised π system), 4. Hückel electron count"
    ],
    "notes": [
      "Aromatic (exceptionally stable): 2 (n=0: cyclopropenyl cation), 6 (n=1: benzene, cyclopentadienyl anion, tropylium cation, pyridine, pyrrole), 10 (n=2: naphthalene, azulene), 14 (n=3: anthracene, phenanthrene).",
      "Anti-aromatic (exceptionally unstable): 4 (cyclobutadiene), 8 (cyclooctatetraene escapes planarity by adopting a tub shape to become non-aromatic).",
      "Stability order: Aromatic >> Non-aromatic >> Anti-aromatic."
    ],
    "example": "Cyclopentadiene is unusually acidic (pKa ≈ 16) because deprotonation produces the 6 π-electron aromatic cyclopentadienyl anion.",
    "latex": "\\text{Aromatic: } (4n + 2)\\pi \\text{ electrons}, \\quad \\text{Anti-Aromatic: } 4n\\pi \\text{ electrons} \\; (n = 0, 1, 2, \\dots)"
  },
  {
    "id": "kolbe_schmitt",
    "branch": "Organic",
    "chapter": "Phenols",
    "title": "Kolbe–Schmitt Carboxylation of Phenol",
    "expr": "Sodium Phenoxide + CO₂ (400 K, 4–7 atm) → Sodium Salicylate —H⁺→ Salicylic Acid",
    "keys": [
      "kolbe schmitt",
      "salicylic acid",
      "aspirin precursor",
      "carboxylation"
    ],
    "symbols": [
      "Electrophile: carbon dioxide (CO₂), a weak linear electrophile",
      "Nucleophile: phenoxide ion (strongly activated ring)"
    ],
    "notes": [
      "Salicylic acid is acetylated with acetic anhydride (Ac₂O) and conc. H₂SO₄ to produce Aspirin (acetylsalicylic acid).",
      "Potassium phenoxide gives predominantly the para isomer (p-hydroxybenzoic acid) instead of ortho."
    ],
    "example": "Sodium phenoxide + CO₂ (125 °C, 6 atm) followed by acidification gives salicylic acid.",
    "latex": "\\ce{C6H5ONa + CO2 ->[400\\text{ K}][4\\text{--}7\\text{ atm}] C6H4(OH)COONa} \\xrightarrow{\\ce{H+}} \\ce{C6H4(OH)COOH \\text{ (Salicylic Acid)}}"
  },
  {
    "id": "reimer_tiemann",
    "branch": "Organic",
    "chapter": "Phenols",
    "title": "Reimer–Tiemann Formylation of Phenol",
    "expr": "C₆H₅OH + CHCl₃ + 3 NaOH (340 K) → Salicylaldehyde (o-hydroxybenzaldehyde) + 3 NaCl + 2 H₂O",
    "keys": [
      "reimer tiemann",
      "salicylaldehyde",
      "dichlorocarbene",
      "phenol formylation"
    ],
    "symbols": [
      "Electrophile: dichlorocarbene (:CCl₂), a neutral 6-electron reactive intermediate generated by α-elimination from CHCl₃ in base"
    ],
    "notes": [
      "Ortho isomer is the major product due to intramolecular hydrogen bonding in salicylaldehyde and 6-membered chelate transition state.",
      "Using CCl₄ instead of CHCl₃ yields salicylic acid (o-hydroxybenzoic acid)."
    ],
    "example": "Phenol + CHCl₃ + 3 aq. NaOH at 60 °C gives 2-hydroxybenzaldehyde (salicylaldehyde) as major product.",
    "latex": "\\ce{C6H5OH + CHCl3 + 3NaOH ->[340\\text{ K}] C6H4(OH)CHO \\text{ (Salicylaldehyde)} + 3NaCl + 2H2O}"
  },
  {
    "id": "polymer_molar_mass",
    "branch": "Organic",
    "chapter": "Polymers",
    "title": "Average Molecular Weights of Polymers",
    "expr": "M_n = (Σ N_i M_i) / (Σ N_i)   ,   M_w = (Σ N_i M_i²) / (Σ N_i M_i)   ,   PDI = M_w / M_n",
    "keys": [
      "polymers",
      "number average molecular weight",
      "weight average",
      "pdi"
    ],
    "symbols": [
      "M_n: number-average molecular weight (measured by colligative properties like osmotic pressure)",
      "M_w: weight-average molecular weight (measured by ultracentrifugation / light scattering)",
      "PDI: Polydispersity Index"
    ],
    "notes": [
      "For monodisperse natural polymers (pure proteins, DNA): PDI = 1 (M_w = M_n).",
      "For synthetic polymers: PDI > 1 (M_w > M_n)."
    ],
    "example": "Equal numbers of molecules with M₁ = 10,000 and M₂ = 30,000:\nM_n = (10000 + 30000)/2 = 20,000.\nM_w = (10000² + 30000²) / (10000 + 30000) = (10⁸ + 9×10⁸) / 40000 = 25,000.\nPDI = 25000 / 20000 = 1.25.",
    "latex": "\\bar{M}_n = \\frac{\\sum N_i M_i}{\\sum N_i}, \\quad \\bar{M}_w = \\frac{\\sum N_i M_i^2}{\\sum N_i M_i}, \\quad \\text{PDI} = \\frac{\\bar{M}_w}{\\bar{M}_n}"
  },
  {
    "id": "bakelite_phenol_formaldehyde",
    "branch": "Organic",
    "chapter": "Polymers",
    "title": "Bakelite (Phenol–Formaldehyde Thermosetting Polymer)",
    "expr": "Phenol + HCHO —acid or base→ o- & p-Hydroxymethylphenols —condense→ Novolac (Linear) —heat with HCHO (Urotropine)→ Bakelite (3D Cross-linked Network)",
    "keys": [
      "bakelite",
      "novolac",
      "phenol formaldehyde",
      "thermosetting polymer",
      "cross linked polymer"
    ],
    "symbols": [
      "Novolac: linear polymer used in paints and lacquers",
      "Bakelite: heavily cross-linked 3D infusible, insoluble thermosetting network connected by methylene (–CH₂–) bridges"
    ],
    "notes": [
      "Once molded and set by heat, thermosetting plastics CANNOT be remelted or reshaped because cross-links are permanent covalent bonds.",
      "Used for making electrical switches, plugs, handles of utensils, and phonograph records."
    ],
    "example": "Heating novolac with formaldehyde creates a rigid 3D infusible polymer (Bakelite).",
    "latex": "\\text{Phenol} + \\ce{HCHO} \\to \\text{Novolac (linear)} \\xrightarrow[\\text{Urotropine}]{\\Delta} \\text{Bakelite (3D cross-linked)}"
  },
  {
    "id": "gutta_percha_trans_rubber",
    "branch": "Organic",
    "chapter": "Polymers",
    "title": "Gutta-Percha: All-Trans-1,4-Polyisoprene",
    "expr": "Natural Rubber = All-Cis-1,4-Polyisoprene (Elastic)   |   Gutta-Percha = All-Trans-1,4-Polyisoprene (Non-Elastic, Crystalline)",
    "keys": [
      "gutta percha",
      "trans polyisoprene",
      "rubber stereochemistry",
      "root canal filling"
    ],
    "symbols": [
      "Trans isomer chains pack tightly together in regular crystalline arrays, preventing elasticity and conferring hardness"
    ],
    "notes": [
      "Thermoplastic, hard, water-resistant, and biologically inert; standard material used for filling root canals in dental surgery."
    ],
    "example": "Trans double bonds in gutta-percha eliminate the coiled spring morphology of natural cis-rubber.",
    "latex": "\\text{Natural Rubber} = \\textit{all-cis}\\text{-1,4-polyisoprene} \\quad \\Big| \\quad \\text{Gutta-Percha} = \\textit{all-trans}\\text{-1,4-polyisoprene}"
  },
  {
    "id": "nylon_66_reaction",
    "branch": "Organic",
    "chapter": "Polymers",
    "title": "Nylon 6,6 Condensation Polymerisation",
    "expr": "n HOOC−(CH₂)₄−COOH (Adipic Acid) + n H₂N−(CH₂)₆−NH₂ (Hexamethylenediamine) —553 K, high P→ [−CO−(CH₂)₄−CO−NH−(CH₂)₆−NH−]_n + (2n−1) H₂O",
    "keys": [
      "nylon 66",
      "adipic acid",
      "hexamethylenediamine",
      "polyamide",
      "step growth polymerisation"
    ],
    "symbols": [
      "Designation 6,6 signifies that BOTH monomers contain 6 carbon atoms each",
      "Forms strong intermolecular hydrogen bonds between amide groups (>C=O···H–N<), conferring high tensile strength and fiber-forming properties"
    ],
    "notes": [
      "Nylon 6 is prepared from a single monomer, Caprolactam, by heating with water at 533–543 K: [–CO–(CH₂)₅–NH–]_n.",
      "Extensively used in making bristles for brushes, tyre cords, and textile fabrics."
    ],
    "example": "Equimolar adipic acid and hexamethylenediamine first form 'nylon salt' which on heating polymerises with water elimination.",
    "latex": "n \\ce{HOOC-(CH2)4-COOH} + n \\ce{H2N-(CH2)6-NH2} \\xrightarrow[\\text{high } P]{553\\text{ K}} \\ce{[-CO-(CH2)4-CO-NH-(CH2)6-NH-]_n} + (2n-1)\\ce{H2O}"
  },
  {
    "id": "biodegradable_phbv_copolymer",
    "branch": "Organic",
    "chapter": "Polymers",
    "title": "PHBV: Biodegradable Aliphatic Polyester",
    "expr": "3-hydroxybutanoic acid + 3-hydroxypentanoic acid → Poly(β-hydroxybutyrate-co-β-hydroxyvalerate) (PHBV) + H₂O",
    "keys": [
      "phbv",
      "biodegradable polymer",
      "polyhydroxybutyrate",
      "controlled drug release"
    ],
    "symbols": [
      "Monomers: CH₃–CH(OH)–CH₂–COOH and CH₃CH₂–CH(OH)–CH₂–COOH",
      "Degraded by bacterial enzymes in the environment into CO₂ and H₂O"
    ],
    "notes": [
      "Used in specialty packaging, orthopedic devices, and controlled drug release capsules.",
      "Another important biodegradable polymer is Nylon 2-nylon 6 (polyamide of glycine + amino caproic acid)."
    ],
    "example": "PHBV drug capsules degrade harmlessly in the human body without producing toxic residues.",
    "latex": "\\text{3-Hydroxybutanoic acid} + \\text{3-Hydroxypentanoic acid} \\to \\text{PHBV} + \\ce{H2O}"
  },
  {
    "id": "polymer_pdi_molecular_mass",
    "branch": "Organic",
    "chapter": "Polymers",
    "title": "Polydispersity Index (PDI) & Polymer Molar Masses",
    "expr": "PDI = M_w / M_n   |   M_n = (Σ N_i M_i) / (Σ N_i)   |   M_w = (Σ N_i M_i²) / (Σ N_i M_i)",
    "keys": [
      "polydispersity index",
      "number average molar mass",
      "weight average molar mass",
      "pdi"
    ],
    "symbols": [
      "M_n: number-average molecular mass (measured by colligative properties, especially osmotic pressure)",
      "M_w: weight-average molecular mass (measured by light scattering or ultracentrifugation)",
      "N_i: number of molecules with molecular mass M_i"
    ],
    "notes": [
      "For monodisperse natural polymers (pure proteins, natural DNA), M_w = M_n, so PDI = 1.0.",
      "For all synthetic polymers, M_w > M_n, so PDI > 1."
    ],
    "example": "A sample has 100 molecules of mass 10,000 and 100 molecules of mass 20,000:\nM_n = (100×10000 + 100×20000)/200 = 15,000.\nM_w = (100×10000² + 100×20000²)/(100×10000 + 100×20000) = (10¹⁰ + 4×10¹⁰)/3×10⁶ ≈ 16,667.\nPDI = 16,667 / 15,000 ≈ 1.11.",
    "latex": "\\text{PDI} = \\frac{\\bar{M}_w}{\\bar{M}_n} \\quad \\Big| \\quad \\bar{M}_n = \\frac{\\sum N_i M_i}{\\sum N_i} \\quad \\Big| \\quad \\bar{M}_w = \\frac{\\sum N_i M_i^2}{\\sum N_i M_i}"
  },
  {
    "id": "rubber_types_neoprene_buna",
    "branch": "Organic",
    "chapter": "Polymers",
    "title": "Synthetic Rubbers: Neoprene, Buna-S, and Buna-N",
    "expr": "Neoprene: [−CH₂−C(Cl)=CH−CH₂−]_n (Chloroprene)   |   Buna-S: 1,3-Butadiene + Styrene   |   Buna-N: 1,3-Butadiene + Acrylonitrile",
    "keys": [
      "synthetic rubbers",
      "neoprene",
      "buna s",
      "buna n",
      "chloroprene"
    ],
    "symbols": [
      "Buna designation: Bu = Butadiene, Na = Sodium polymerisation catalyst, S = Styrene, N = Nitrile (Acrylonitrile)"
    ],
    "notes": [
      "Neoprene is resistant to vegetable and mineral oils; used for manufacturing conveyor belts, gaskets, and hoses.",
      "Buna-N is resistant to petrol, lubricating oil, and organic solvents; used for oil seals and tank linings."
    ],
    "example": "Polymerisation of 2-chloro-1,3-butadiene (chloroprene) yields neoprene.",
    "latex": "\\text{Neoprene: } \\ce{[-CH2-C(Cl)=CH-CH2-]_n} \\quad \\Big| \\quad \\text{Buna-S: Butadiene + Styrene} \\quad \\Big| \\quad \\text{Buna-N: Butadiene + Acrylonitrile}"
  },
  {
    "id": "terylene_dacron_esterification",
    "branch": "Organic",
    "chapter": "Polymers",
    "title": "Terylene / Dacron Polyester Condensation",
    "expr": "n HOOC−C₆H₄−COOH (Terephthalic Acid) + n HO−CH₂CH₂−OH (Ethylene Glycol) —420–460 K, Zn-Sb catalyst→ [−CO−C₆H₄−CO−O−CH₂CH₂−O−]_n + (2n−1) H₂O",
    "keys": [
      "terylene",
      "dacron",
      "polyester",
      "terephthalic acid",
      "ethylene glycol"
    ],
    "symbols": [
      "Catalyst: zinc acetate – antimony trioxide",
      "Contains recurring ester (–COO–) linkages throughout the polymer backbone"
    ],
    "notes": [
      "Crease-resistant, high tensile strength, resistant to biological degradation; blended with cotton to make terycot and wool to make terywool."
    ],
    "example": "Commercial Dacron fiber is produced by continuous melt spinning of molten poly(ethylene terephthalate) (PET).",
    "latex": "n \\ce{HOOC-C6H4-COOH} + n \\ce{HO-CH2CH2-OH} \\xrightarrow[\\text{Zn-Sb catalyst}]{420\\text{--}460\\text{ K}} \\ce{[-CO-C6H4-CO-O-CH2CH2-O-]_n} + (2n-1)\\ce{H2O}"
  },
  {
    "id": "vulcanisation_natural_rubber",
    "branch": "Organic",
    "chapter": "Polymers",
    "title": "Vulcanisation of Natural Rubber (cis-1,4-Polyisoprene)",
    "expr": "[−CH₂−C(CH₃)=CH−CH₂−]_n + 3–5% Sulfur —373–415 K→ Polyisoprene Chains Cross-linked with −S_x− Bridges",
    "keys": [
      "vulcanisation",
      "natural rubber",
      "cis 1 4 polyisoprene",
      "sulfur cross links",
      "gutta percha"
    ],
    "symbols": [
      "Natural rubber: all-cis-1,4-polyisoprene (soft, sticky at high temp, brittle at low temp, high water absorption)",
      "Gutta-percha: all-trans-1,4-polyisoprene (non-elastic, rigid, crystalline)",
      "Vulcanisation: introduces disulfide (–S–S–) cross-links at allylic carbons"
    ],
    "notes": [
      "Vulcanisation confers high elasticity, tensile strength, resistance to organic solvents, and wide usable temperature range (−40 to 100 °C).",
      "Tyre rubber contains ~5% sulfur; ebonite (hard battery cases) contains ~30% sulfur."
    ],
    "example": "Sulfur bridges prevent adjacent polymer chains from permanently slipping past each other when stretched.",
    "latex": "\\ce{[-CH2-C(CH3)=CH-CH2-]_n} + 3\\text{--}5\\% \\text{ Sulfur} \\xrightarrow{373\\text{--}415\\text{ K}} \\text{Cross-linked Polyisoprene with } -\\ce{S}_x- \\text{ bridges}"
  },
  {
    "id": "distinguishing_tests",
    "branch": "Organic",
    "chapter": "Practical Organic Chemistry",
    "title": "Diagnostic Organic Functional Group Tests",
    "expr": "Lucas: 3° (fast), 2° (5 min), 1° (heat)   |   Carbylamine: 1° R-NH₂ + CHCl₃ + KOH → R-NC foul odour",
    "keys": [
      "lucas test",
      "carbylamine test",
      "hinsberg test",
      "tollens test",
      "iodoform test"
    ],
    "symbols": [
      "Lucas reagent: conc. HCl + anhydrous ZnCl₂ (tests alcohols)",
      "Hinsberg reagent: C₆H₅SO₂Cl (distinguishes 1°, 2°, 3° amines)",
      "Tollens reagent: ammoniacal AgNO₃ (silver mirror for aldehydes)",
      "Iodoform: I₂ + NaOH gives yellow CHI₃ precipitate for CH₃CO– and CH₃CH(OH)– groups"
    ],
    "notes": [
      "Fehling's solution oxidises aliphatic aldehydes but does NOT oxidise benzaldehyde.",
      "1° amines dissolve in Hinsberg alkali test because N–H proton is acidic; 2° amines form insoluble precipitate without acidic proton; 3° amines do not react."
    ],
    "example": "Propan-2-ol gives a positive iodoform test (yellow precipitate of CHI₃, m.p. 119 °C); propan-1-ol does not.",
    "latex": "\\textbf{Lucas: } 3^\\circ \\; (\\text{fast}), \\; 2^\\circ \\; (5\\text{ min}), \\; 1^\\circ \\; (\\Delta) \\quad \\Big| \\quad \\textbf{Carbylamine: } \\ce{1^\\circ R-NH2 + CHCl3 + KOH -> R-NC}"
  },
  {
    "id": "elemental",
    "branch": "Organic",
    "chapter": "Purification and analysis",
    "title": "Liebig and Kjeldahl estimations",
    "expr": "%C = (12/44)(m_CO₂/m)×100   ,   %H = (2/18)(m_H₂O/m)×100   ,   %N = 1.4 × N × V / m",
    "keys": [
      "kjeldahl",
      "liebig",
      "percentage of carbon"
    ],
    "symbols": [
      "m: mass of organic compound (g)",
      "m_CO₂, m_H₂O: masses of CO₂ and H₂O formed (g)",
      "Kjeldahl: N = normality of the acid, V = volume of acid neutralised by NH₃ (mL)"
    ],
    "notes": [
      "Kjeldahl's method does not work for nitro, azo compounds or nitrogen in a ring (pyridine); Dumas' method does."
    ],
    "latex": "\\%C = \\frac{12}{44}\\frac{m_{\\ce{CO2}}}{m}\\times 100, \\quad \\%H = \\frac{2}{18}\\frac{m_{\\ce{H2O}}}{m}\\times 100, \\quad \\%N = \\frac{1.4 \\times N \\times V}{m}"
  },
  {
    "id": "elemental_analysis",
    "branch": "Organic",
    "chapter": "Quantitative Organic Analysis",
    "title": "Quantitative Elemental Estimation Formulas",
    "expr": "Liebig: %C = (12/44)(m_CO₂/m)×100 , %H = (2/18)(m_H₂O/m)×100   |   Kjeldahl: %N = 1.4 × N × V / m",
    "keys": [
      "kjeldahl",
      "dumas",
      "carius",
      "elemental analysis",
      "percentage of nitrogen"
    ],
    "symbols": [
      "m: mass of organic compound taken (g)",
      "Dumas Method: %N = (28 / 22400) × (V_STP / m) × 100",
      "Carius Halogen: %X = (At. mass X / Mol. mass AgX) × (m_AgX / m) × 100",
      "Carius Sulfur: %S = (32 / 233) × (m_BaSO₄ / m) × 100",
      "Phosphorus: %P = (62 / 222) × (m_Mg₂P₂O₇ / m) × 100"
    ],
    "notes": [
      "Kjeldahl's method is NOT applicable to compounds containing nitrogen in nitro (–NO₂), azo (–N=N–), or heterocyclic rings (pyridine), because nitrogen is not converted quantitatively to (NH₄)₂SO₄."
    ],
    "example": "0.50 g organic compound digested by Kjeldahl method neutralised 20 mL of 0.25 N H₂SO₄:\n%N = (1.4 × 0.25 × 20) / 0.50 = 7.0 / 0.50 = 14%.",
    "latex": "\\text{Liebig: } \\%C = \\frac{12}{44}\\frac{m_{\\ce{CO2}}}{m}\\times 100, \\; \\%H = \\frac{2}{18}\\frac{m_{\\ce{H2O}}}{m}\\times 100 \\quad \\Big| \\quad \\text{Kjeldahl: } \\%N = \\frac{1.4 \\times N \\times V}{m}"
  },
  {
    "id": "stereoisomer_counts",
    "branch": "Organic",
    "chapter": "Stereochemistry",
    "title": "Formulas for Counting Stereoisomers",
    "expr": "Unsymmetrical: Total = 2ⁿ   |   Symmetrical (even n): Optically Active = 2ⁿ⁻¹ , Meso = 2^(n/2 − 1) , Total = 2ⁿ⁻¹ + 2^(n/2 − 1)",
    "keys": [
      "stereoisomer counting",
      "number of optical isomers",
      "meso isomers"
    ],
    "symbols": [
      "n: number of chiral centres (asymmetric carbons)"
    ],
    "notes": [
      "For symmetrical molecule with ODD number of chiral centres (n = odd):\nOptically Active = 2ⁿ⁻¹ − 2^((n−1)/2), Meso = 2^((n−1)/2), Total = 2ⁿ⁻¹.",
      "Geometrical isomers for molecule with n double bonds: 2ⁿ (unsymmetrical); for symmetrical with even double bonds: 2ⁿ⁻¹ + 2^(n/2 − 1)."
    ],
    "example": "Tartaric acid CH(OH)COOH−CH(OH)COOH (symmetrical, n = 2 even):\nOptically Active = 2²⁻¹ = 2 (d and l), Meso = 2^(1−1) = 1. Total = 3 stereoisomers.",
    "latex": "\\text{Unsymmetrical: } N = 2^n \\quad \\Big| \\quad \\text{Symmetrical (even } n\\text{): } a = 2^{n-1}, \\; m = 2^{(n/2)-1}, \\; \\text{Total} = 2^{n-1} + 2^{(n/2)-1}"
  },
  {
    "id": "optical_rotation",
    "branch": "Organic",
    "chapter": "Stereochemistry",
    "title": "Specific Rotation & Enantiomeric Excess",
    "expr": "[α]_D^T = α_obs / (l · c)   ,   %ee = Optical Purity = (|R − S| / (R + S)) × 100 = ([α]_obs / [α]_pure) × 100",
    "keys": [
      "specific rotation",
      "enantiomeric excess",
      "optical purity",
      "chiral"
    ],
    "symbols": [
      "[α]_D^T: specific rotation at temperature T and sodium D line (589 nm)",
      "α_obs: observed rotation in polarimeter (degrees)",
      "l: path length in decimetres (1 dm = 10 cm)",
      "c: concentration in g mL⁻¹"
    ],
    "notes": [
      "Racemic mixture: equal amounts of (d) and (l) enantiomers; %ee = 0%; optically inactive by external compensation.",
      "Meso compound: possesses internal symmetry plane or inversion centre; optically inactive by internal compensation."
    ],
    "example": "Sample with 75% (R) and 25% (S):\n%ee = 75 − 25 = 50%. If pure (R) has [α] = +20°, observed [α] = +10°.",
    "latex": "[\\alpha]_D^T = \\frac{\\alpha_{\\text{obs}}}{l \\times c}, \\quad \\text{\\% ee} = \\frac{|R - S|}{R + S} \\times 100\\%"
  },
  {
    "id": "optical",
    "branch": "Organic",
    "chapter": "Stereochemistry",
    "title": "Specific rotation and optical purity",
    "expr": "[α] = α_obs / (l·c)   ,   %ee = |R − S| / (R + S) × 100",
    "keys": [
      "specific rotation",
      "optical purity",
      "enantiomeric excess"
    ],
    "symbols": [
      "α_obs: observed rotation (degrees)",
      "l: tube length in dm",
      "c: concentration in g mL⁻¹",
      "R, S: amounts of each enantiomer"
    ],
    "notes": [
      "A racemic mixture has 0% ee and zero net rotation.",
      "The sign (+/−) of rotation is measured, and is not predicted from R/S."
    ],
    "latex": "[\\alpha] = \\frac{\\alpha_{\\text{obs}}}{l \\times c}, \\quad \\text{\\% ee} = \\frac{|R - S|}{R + S} \\times 100\\%"
  }
],

  /* ---------------- Theory topics for offline quick-reviews ---------------- */
  topics: [
    { id: "sn1", title: "SN1 mechanism", match: "\\bsn[\\s-]?1\\b|unimolecular nucleophilic",
      answer: "**SN1 mechanism (step by step)**\n1. **Ionisation (slow, rate-determining):** the C–X bond breaks and a planar carbocation forms.\n2. **Nucleophilic attack (fast):** the nucleophile attacks the carbocation from either face.\n3. **Deprotonation:** if the nucleophile was neutral (H₂O, ROH), a proton is lost to give the product.\n\n**Rate law:** rate = k[substrate]. It is first order and independent of the nucleophile.\n\n**Factors that favour SN1**\n- Substrate: 3° > 2° (stable carbocation); benzylic and allylic also work well.\n- Solvent: polar protic (water, alcohols) stabilise the ions and the leaving group.\n- Leaving group: I⁻ > Br⁻ > Cl⁻ (weak bases leave best).\n- Weak nucleophiles are fine because they enter after the slow step.\n\n**Stereochemistry:** attack on a planar carbocation gives racemisation (often with slight inversion excess from ion pairs).\n**Watch for:** carbocation rearrangements (hydride or methyl shifts) and competing E1." },
    { id: "sn2", title: "SN2 mechanism", match: "\\bsn[\\s-]?2\\b|bimolecular nucleophilic",
      answer: "**SN2 mechanism**\nOne concerted step: the nucleophile attacks from the side opposite the leaving group, through a pentacoordinate transition state, while the leaving group departs.\n\n**Rate law:** rate = k[substrate][nucleophile] (second order).\n**Stereochemistry:** complete inversion of configuration (Walden inversion).\n\n**Factors that favour SN2**\n- Substrate: methyl > 1° > 2° >> 3° (steric hindrance at the backside).\n- Nucleophile: strong and unhindered (I⁻, CN⁻, RS⁻, OH⁻).\n- Solvent: polar aprotic (DMSO, DMF, acetone) leaves the nucleophile \"naked\".\n- Leaving group: I⁻ > Br⁻ > Cl⁻ >> F⁻.\n\n**Exam trap:** neopentyl halides are 1°, but are extremely slow in SN2 because of the bulky adjacent tert-butyl group." },
    { id: "exceptions", title: "Coordination compound exceptions", match: "(coordination|complex).*(exception|trap)|(exception|trap).*(coordination|complex)|inorganic.*exception|exception.*inorganic",
      answer: "**Coordination compounds: commonly tested exceptions**\n\n| Complex | What is unexpected | Reason |\n|---|---|---|\n| [Ni(CN)₄]²⁻ vs [NiCl₄]²⁻ | Same Ni²⁺ (d⁸), different geometry and magnetism | CN⁻ is strong field: pairs electrons, giving square planar (dsp²), diamagnetic. Cl⁻ is weak field: tetrahedral (sp³), 2 unpaired e⁻ |\n| [Ni(CO)₄] | Ni(0) is d⁸s², yet it is diamagnetic and tetrahedral | CO is a strong π-acceptor; the s electrons move to d, giving d¹⁰ and sp³ |\n| [Fe(CN)₆]³⁻ vs [FeF₆]³⁻ | Same Fe³⁺ (d⁵): 1 vs 5 unpaired e⁻ | CN⁻ gives low spin (d²sp³); F⁻ gives high spin (sp³d²) |\n| [Co(NH₃)₆]³⁺ vs [CoF₆]³⁻ | Same Co³⁺ (d⁶): diamagnetic vs 4 unpaired e⁻ | Δo > pairing energy only for NH₃ |\n| [PtCl₄]²⁻, [Pd(CN)₄]²⁻ | Square planar even with weak-field Cl⁻ | 4d/5d metals have a large Δ, so d⁸ always favours square planar |\n| [Cu(NH₃)₄]²⁺ | d⁹ is paramagnetic (1 unpaired e⁻) yet square planar | NCERT explains this as dsp² with one electron promoted to 4p; CFT attributes it to Jahn–Teller distortion |\n| [Fe(CO)₅] | Neutral Fe(0), diamagnetic | Strong-field CO pairs the electrons; dsp³ trigonal bipyramidal |\n\n**Exam traps:** tetrahedral complexes are almost always high spin because Δt ≈ (4/9)Δo. Always decide the ligand field strength first, then count the unpaired electrons." },
    { id: "vsepr", title: "VSEPR, shape and hybridisation", match: "vsepr|hybridi[sz]ation|(shape|geometry) of|bond angle",
      answer: "**VSEPR in four steps**\n1. Count electron pairs on the central atom (bond pairs + lone pairs). Use H = ½(V + M − C + A).\n2. The pair count gives the electron geometry and hybridisation.\n3. Place lone pairs where repulsion is least.\n4. Read off the molecular shape from the atoms only.\n\n| Electron pairs | Hybridisation | Electron geometry | Examples (molecular shape) |\n|---|---|---|---|\n| 2 | sp | Linear | CO₂, BeCl₂ |\n| 3 | sp² | Trigonal planar | BF₃; SO₂ (bent) |\n| 4 | sp³ | Tetrahedral | CH₄; NH₃ (pyramidal); H₂O (bent) |\n| 5 | sp³d | Trigonal bipyramidal | PCl₅; SF₄ (see-saw); ClF₃ (T-shaped); XeF₂ (linear) |\n| 6 | sp³d² | Octahedral | SF₆; BrF₅ (square pyramidal); XeF₄ (square planar) |\n\n**Repulsion order:** lp–lp > lp–bp > bp–bp, so lone pairs squeeze bond angles (CH₄ 109.5°, NH₃ 107°, H₂O 104.5°).\n**Trigonal bipyramid rule:** lone pairs take equatorial positions first.\n\nOpen **3D Molecules** to rotate each of these and toggle the lone pairs." },
    { id: "markovnikov", title: "Markovnikov's rule", match: "markovnikov|hbr.*propene|propene.*hbr|electrophilic addition",
      answer: "**Markovnikov's rule**\nIn the ionic addition of HX to an unsymmetrical alkene, the hydrogen goes to the carbon that already has more hydrogens, and X goes to the more substituted carbon. The reason is that the more stable carbocation forms.\n\n**Example:** CH₃CH=CH₂ + HBr → CH₃CHBrCH₃ (2-bromopropane), via the secondary carbocation.\n\n**Anti-Markovnikov (peroxide effect):** with HBr only, and in the presence of peroxides, the reaction becomes free-radical, giving CH₃CH₂CH₂Br. It does not occur with HCl or HI.\n\n**Watch for:** carbocation rearrangements, which can change the product, and hydration of alkenes (acid-catalysed) which also follows Markovnikov." },
    { id: "eas", title: "Electrophilic aromatic substitution", match: "electrophilic aromatic|directing (group|effect)|ortho.{0,12}para|nitration of benzene",
      answer: "**Electrophilic aromatic substitution (EAS)**\nMechanism: the electrophile attacks the π system to form an arenium (σ-complex) ion, then loses H⁺ to restore aromaticity.\n\n**Typical electrophiles**\n- Nitration: NO₂⁺ from conc. HNO₃ + conc. H₂SO₄\n- Sulfonation: SO₃ (fuming H₂SO₄)\n- Halogenation: X⁺ from X₂ + FeX₃ or AlX₃\n- Friedel–Crafts: R⁺ or RCO⁺ from RCl/RCOCl + AlCl₃\n\n**Directing effects**\n- Activating, ortho/para: –OH, –NH₂, –OR, –R, –NHCOR\n- Deactivating, meta: –NO₂, –CN, –CHO, –COR, –COOH, –SO₃H, –NR₃⁺\n- Halogens: deactivating (–I) but ortho/para directing (+M)\n\n**Traps:** Friedel–Crafts fails on strongly deactivated rings and on rings carrying –NH₂ (it complexes with AlCl₃). Anilines are often acetylated first to control reactivity." },
    { id: "analytics", title: "PYQ analytics design", match: "(pyq|previous[\\s-]?year).*(analy|trend|design)|analy.*(pyq|previous[\\s-]?year)",
      answer: "**How previous-year-question (PYQ) analytics should work**\n\n1. **Source data:** collect official question papers and answer keys (for example the JEE and CBSE papers published by the conducting bodies). Keep the paper, year, shift and question number for every item.\n2. **Tag each question:** chapter, sub-topic, question type (MCQ, numerical, matrix, assertion–reason), difficulty (use a stated rule, not a guess) and concepts tested.\n3. **Metrics to compute:** chapter-wise question counts and marks share per year, type mix, and your own accuracy and time per chapter.\n4. **Show uncertainty:** with only a handful of papers, frequency is weak evidence of what will be asked. Show counts, not confident predictions.\n5. **Never invent statistics.** If a number does not come from tagged data, do not display it.\n\nThis app now does the whole loop for real: import your own questions from the official papers into the **PYQ Bank** (JSON or CSV), practise them, and get a chapter-by-year frequency table with a small-sample warning. The **Study Analytics** panel tracks your own accuracy, and both are stored on this device only." }
  ]
};
