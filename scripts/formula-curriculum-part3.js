"use strict";

/**
 * Curriculum Part 3: Additional 90+ Advanced JEE & CBSE Formulas
 * Covers Advanced Name Reactions, Electrochemistry, Nuclear Chemistry, Thermodynamics & Metallurgy.
 */

const formulasPart3 = [
  /* Advanced Organic Name Reactions */
  {
    id: "diels_alder_cycloaddition",
    branch: "Organic",
    chapter: "Hydrocarbons",
    title: "Diels–Alder [4+2] Cycloaddition",
    expr: "Conjugated Diene (4 π e⁻, s-cis) + Dienophile (2 π e⁻) —heat→ Cyclohexene Adduct",
    keys: ["diels alder", "cycloaddition", "4 plus 2", "s cis conformation", "pericyclic reaction"],
    symbols: ["Diene: must adopt s-cis conformation (cyclic dienes like cyclopentadiene are locked in s-cis and react fastest)", "Dienophile: activated by electron-withdrawing groups (–CHO, –COR, –CN, –COOR, maleic anhydride)", "Concerted pericyclic mechanism (no carbocation/radical intermediate)"],
    notes: ["Stereospecific: stereochemistry of both diene and dienophile is preserved in the product (cis-dienophile gives cis-cyclohexene).", "Endo rule: electron-withdrawing group on dienophile preferentially adopts the endo position due to secondary orbital interaction."],
    example: "Cyclopentadiene + maleic anhydride react exothermically at room temperature to give endo-norbornene anhydride."
  },
  {
    id: "claisen_ester_condensation",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Claisen Ester Condensation",
    expr: "2 R−CH₂−COOR' + NaOR' —reflux→ R−CH₂−CO−CH(R)−COOR' (β-Keto Ester) + R'OH",
    keys: ["claisen condensation", "beta keto ester", "acetoacetic ester", "ester enolate"],
    symbols: ["Base must match the ester alkoxy group (NaOEt for ethyl ester) to prevent transesterification", "Requires at least TWO α-hydrogens on the ester: one to form the enolate, and a second to drive the reaction to completion via deprotonation of the acidic β-keto ester"],
    notes: ["Intramolecular Claisen condensation of diesters to form 5- or 6-membered cyclic β-keto esters is called the Dieckmann Condensation."],
    example: "2 ethyl acetate (CH₃COOCH₂CH₃) + NaOCH₂CH₃ followed by acidification yields ethyl acetoacetate (acetoacetic ester)."
  },
  {
    id: "michael_conjugate_addition",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Michael 1,4-Conjugate Addition",
    expr: "Active Methylene Enolate (Donor) + α,β-Unsaturated Carbonyl (Acceptor) —base→ 1,5-Dicarbonyl Adduct",
    keys: ["michael addition", "conjugate addition", "1 4 addition", "soft nucleophile"],
    symbols: ["Michael donor: stabilized carbanion (diethyl malonate, acetoacetic ester, nitroalkanes)", "Michael acceptor: α,β-unsaturated compound (methyl vinyl ketone, acrolein, acrylonitrile, ethyl acrylate)"],
    notes: ["Soft nucleophiles (resonance-stabilized enolates) add 1,4 to the β-carbon; hard nucleophiles (Grignard reagents, organolithiums) add 1,2 directly to the carbonyl group."],
    example: "Diethyl malonate anion adds cleanly to the β-position of methyl vinyl ketone."
  },
  {
    id: "robinson_annulation_cascade",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Robinson Annulation (Ring-Forming Cascade)",
    expr: "Ketone + Methyl Vinyl Ketone —base (Michael Addition)→ 1,5-Diketone —base (Intramolecular Aldol)→ 2-Cyclohexenone",
    keys: ["robinson annulation", "steroid synthesis", "annulated ring", "cyclohexenone"],
    symbols: ["Two-step cascade: 1) Michael conjugate addition followed by 2) Intramolecular aldol condensation with dehydration"],
    notes: ["Powerhouse reaction in total synthesis of steroids, terpenoids, and polycyclic natural products."],
    example: "Cyclohexanone + methyl vinyl ketone in basic medium yields bicyclic fused enone."
  },
  {
    id: "beckmann_rearrangement",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Beckmann Rearrangement of Oximes to Amides",
    expr: "Ketoxime (R R' C=N−OH) + H₂SO₄ / PCl₅ / SOCl₂ → N-substituted Amide (R−CO−NH−R')",
    keys: ["beckmann rearrangement", "ketoxime to amide", "anti migration", "caprolactam"],
    symbols: ["The group ANTI (trans) to the –OH group migrates stereospecifically to the nitrogen atom with retention of configuration"],
    notes: ["Industrial application: Beckmann rearrangement of cyclohexanone oxime with concentrated H₂SO₄ produces Caprolactam, the monomer for Nylon 6."],
    example: "Cyclohexanone oxime heated with H₂SO₄ gives ε-caprolactam."
  },
  {
    id: "baeyer_villiger_oxidation",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Baeyer–Villiger Carbonyl Oxidation to Esters / Lactones",
    expr: "R−CO−R' + Peroxy Acid (mCPBA / CF₃COOOH) → R−COO−R' (Ester)",
    keys: ["baeyer villiger", "mcpba", "ketone to ester", "migratory aptitude"],
    symbols: ["Oxygen inserts between carbonyl carbon and the more electron-rich migrating group", "Migratory aptitude: H > 3° alkyl > 2° alkyl ≈ phenyl > 1° alkyl > methyl"],
    notes: ["Cyclic ketones undergo ring expansion to form cyclic esters (Lactones).", "Retention of stereochemical configuration is observed at the migrating center."],
    example: "Acetophenone (C₆H₅COCH₃) + mCPBA yields phenyl acetate (CH₃COOC₆H₅) because phenyl migrates preferentially over methyl."
  },
  {
    id: "curtius_rearrangement",
    branch: "Organic",
    chapter: "Amines",
    title: "Curtius Rearrangement of Acyl Azides",
    expr: "R−COCl + NaN₃ → R−CO−N₃ (Acyl Azide) —heat (−N₂)→ R−N=C=O (Isocyanate) —H₂O→ R−NH₂ + CO₂",
    keys: ["curtius rearrangement", "acyl azide", "isocyanate", "loss of carbon amine"],
    symbols: ["Acyl azide thermally decomposes with loss of N₂ gas into an alkyl isocyanate via concerted migration of R group to nitrogen with retention"],
    notes: ["Milder than Hofmann degradation; works cleanly without harsh basic reagents.", "Trapping isocyanate with alcohol (R'OH) produces a Carbamate (Urethane: R–NH–COOR')."],
    example: "Benzoyl azide heated in benzene releases N₂ gas to form phenyl isocyanate, which hydrolyses to aniline."
  },
  {
    id: "pinacol_pinacolone_rearrangement",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "Pinacol–Pinacolone Rearrangement",
    expr: "(CH₃)₂C(OH)−C(OH)(CH₃)₂ (Pinacol) + conc. H₂SO₄ —heat→ CH₃−CO−C(CH₃)₃ (Pinacolone) + H₂O",
    keys: ["pinacol pinacolone", "vicinal diol rearrangement", "carbocation migration", "migratory aptitude"],
    symbols: ["Protonation of one –OH followed by loss of water forms a 3° carbocation", "1,2-migration of an alkyl/aryl group is driven by the formation of an exceptionally stable oxonium ion (>C=O⁺–H)"],
    notes: ["Migratory aptitude in unsymmetrical pinacols: p-anisyl > p-tolyl > phenyl > 3° alkyl > 2° alkyl > 1° alkyl > methyl."],
    example: "2,3-dimethylbutane-2,3-diol (pinacol) treated with acid yields 3,3-dimethylbutan-2-one (pinacolone)."
  },
  {
    id: "reformatsky_reaction",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Reformatsky Reaction with Organozinc Reagents",
    expr: "R₂C=O + Br−CH₂−COOR' + Zn (dry ether) → R₂C(OH)−CH₂−COOR' (β-Hydroxy Ester)",
    keys: ["reformatsky reaction", "organozinc", "alpha halo ester", "beta hydroxy ester"],
    symbols: ["Organozinc intermediate: BrZn–CH₂COOR' (Reformatsky reagent)", "Organozinc reagents are less nucleophilic than Grignard reagents, so they add selectively to aldehydes and ketones without attacking the ester carbonyl"],
    notes: ["Subsequent dehydration of β-hydroxy ester yields α,β-unsaturated esters."],
    example: "Benzaldehyde + ethyl bromoacetate + Zn yields ethyl 3-hydroxy-3-phenylpropanoate."
  },
  {
    id: "swern_oxidation_alcohols",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "Swern Mild Oxidation of Alcohols",
    expr: "R−CH₂OH + (COCl)₂ + DMSO + Et₃N (−78 °C) → R−CHO + (CH₃)₂S + CO + CO₂ + Et₃NH⁺ Cl⁻",
    keys: ["swern oxidation", "dmso oxalyl chloride", "mild alcohol oxidation", "no overoxidation"],
    symbols: ["Oxalyl chloride (COCl)₂ and dimethyl sulfoxide (DMSO) generate dimethylchlorosulfonium chloride at −78 °C", "Addition of triethylamine (Et₃N) initiates base-promoted fragmentation"],
    notes: ["Extremely mild: stops cleanly at the aldehyde without over-oxidation to carboxylic acid.", "Tolerates acid-sensitive protecting groups."],
    example: "Primary alcohols oxidise to aldehydes; secondary alcohols oxidise to ketones in near-quantitative yields."
  },

  /* Nuclear Chemistry & Radioactivity */
  {
    id: "radioactive_decay_constant",
    branch: "Physical",
    chapter: "Chemical Kinetics",
    title: "Radioactive Decay Law & Specific Activity",
    expr: "A = λ · N = (0.693 / t_½) · N   |   1 Curie (Ci) = 3.7 × 10¹⁰ Bq (disintegrations s⁻¹)",
    keys: ["radioactivity", "decay constant", "activity becquerel curie", "specific activity"],
    symbols: ["A: activity (rate of disintegration −dN/dt in Bq)", "N: number of radioactive nuclei present", "t_½: half-life in seconds", "1 Becquerel (Bq) = 1 disintegration per second"],
    notes: ["Radioactive decay rate is completely independent of temperature, pressure, chemical state, and external catalysts.", "Carbon-14 dating: t_½ = 5730 years; age t = (2.303/λ) log(A₀/A_t)."],
    example: "1 gram of Radium-226 (t_½ = 1600 years) has activity of exactly 1.0 Curie = 3.7 × 10¹⁰ Bq."
  },
  {
    id: "group_displacement_soddy_fajans",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "Soddy–Fajans Group Displacement Law",
    expr: "α-emission: (Z−2, A−4)   |   β⁻-emission: (Z+1, A)   |   γ-emission: (Z, A) unchanged",
    keys: ["group displacement law", "soddy fajans", "alpha decay", "beta decay"],
    symbols: ["α-particle: ⁴₂He nucleus (mass drops by 4, atomic number drops by 2 => shifts 2 groups left in periodic table)", "β⁻-particle: electron (mass unchanged, atomic number increases by 1 => shifts 1 group right)", "Positron emission (β⁺): atomic number drops by 1"],
    notes: ["Parent and daughter after β-decay are ISOBARS (same mass number A).", "After emitting one α and two β⁻ particles, the product is an ISOTOPE of the original parent element."],
    example: "²³⁸₉₂U emits an α-particle to become ²³⁴₉₀Th (shifts from Group 6 to Group 4)."
  },
  {
    id: "packing_fraction_mass_defect",
    branch: "Physical",
    chapter: "Structure of Atom",
    title: "Mass Defect & Nuclear Binding Energy",
    expr: "Δm = [ Z · m_p + (A − Z) · m_n ] − M_nucleus   |   BE = Δm · c² = Δm(amu) × 931.5 MeV",
    keys: ["mass defect", "binding energy", "einstein mass energy", "nuclear stability"],
    symbols: ["Δm: mass defect (lost mass converted into nuclear binding energy)", "m_p = 1.00728 amu, m_n = 1.00867 amu", "BE / A: binding energy per nucleon (maximum near ⁵⁶Fe ≈ 8.8 MeV/nucleon, representing maximum nuclear stability)"],
    notes: ["Nuclei with low BE/A undergo nuclear fusion (light nuclei) or nuclear fission (heavy nuclei like ²³⁵U) to move toward the stable iron peak."],
    example: "For alpha particle (⁴₂He, mass = 4.0015 amu): Δm = 2(1.00728) + 2(1.00867) − 4.0015 = 0.0304 amu.\nBE = 0.0304 × 931.5 ≈ 28.3 MeV (7.07 MeV/nucleon)."
  },

  /* Advanced Solutions & Phase Equilibria */
  {
    id: "azeotrope_types",
    branch: "Physical",
    chapter: "Solutions",
    title: "Azeotropic Binary Mixtures (Minimum vs Maximum Boiling)",
    expr: "Min-Boiling (Large +ve Deviation from Raoult): T_bp(azeo) < T_bp(pure)   |   Max-Boiling (Large −ve Deviation): T_bp(azeo) > T_bp(pure)",
    keys: ["azeotropes", "minimum boiling azeotrope", "maximum boiling azeotrope", "ethanol water azeotrope", "nitric acid azeotrope"],
    symbols: ["Azeotrope: constant boiling liquid mixture where vapour composition equals liquid composition (y_A = x_A)", "Cannot be separated into pure components by fractional distillation"],
    notes: [
      "Minimum boiling azeotrope: Ethanol (95.6% by mass) + Water (4.4%), boils at 351.15 K (lower than pure ethanol 351.3 K and water 373.15 K).",
      "Maximum boiling azeotrope: Nitric acid (68% by mass) + Water (32%), boils at 393.5 K (higher than water 373.15 K and pure HNO₃ 359 K).",
      "Separated by azeotropic distillation (adding a third entrainer like benzene) or pressure-swing distillation."
    ],
    example: "Standard distillation of fermented wash stops at 95.6% ethanol because the azeotrope boils as a single substance."
  },
  {
    id: "steam_distillation_formula",
    branch: "Physical",
    chapter: "Solutions",
    title: "Steam Distillation Law for Immiscible Liquids",
    expr: "(w_organic / w_water) = (P_organic° · M_organic) / (P_water° · M_water)",
    keys: ["steam distillation", "immiscible liquids", "purification of aniline", "vapour pressure organic"],
    symbols: ["w_organic, w_water: masses of organic compound and water collected in distillate receiver", "P_organic°, P_water°: partial vapour pressures at distillation temperature", "M_organic, M_water (18): respective molar masses"],
    notes: ["Total pressure = P_organic° + P_water° = P_atm; mixture boils BELOW the normal boiling point of either water or the organic liquid.", "Allows purification of high-boiling, temperature-sensitive organic liquids (like aniline, bp 184 °C) below 100 °C without decomposition."],
    example: "At 98 °C, aniline (P° = 43 mm Hg, M = 93) co-distils with water (P° = 717 mm Hg):\nw(aniline)/w(water) = (43 × 93) / (717 × 18) = 3999 / 12906 ≈ 0.31 g aniline per g water."
  },
  {
    id: "nernst_distribution_law",
    branch: "Physical",
    chapter: "Solutions",
    title: "Nernst Distribution / Partition Law",
    expr: "K_D = C₁ / C₂ = constant   (at constant temperature for same molecular species in both immiscible solvents)",
    keys: ["nernst distribution law", "partition coefficient", "solvent extraction", "distribution coefficient"],
    symbols: ["C₁, C₂: equilibrium concentrations of solute in immiscible solvent 1 and solvent 2", "K_D: partition / distribution coefficient"],
    notes: [
      "If solute associates in solvent 2 into n-mers: K_D = C₁ / (ⁿ√C₂).",
      "If solute dissociates in solvent 1: K_D = C₁(1 − α) / C₂.",
      "Multi-step extractions with smaller solvent volumes are far more efficient than a single extraction with the entire volume."
    ],
    example: "Iodine distributing between water and CCl₄ has K_D = C(CCl₄)/C(H₂O) ≈ 85, so shaking aqueous I₂ with CCl₄ extracts over 98% of iodine into the organic layer."
  },

  /* Advanced Electrochemistry & Kinetics */
  {
    id: "joule_thomson_coefficient",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "Joule–Thomson Coefficient & Isenthalpic Expansion",
    expr: "μ_JT = (∂T / ∂P)_H = (1 / C_p) · [ T · (∂V / ∂T)_P − V ]   |   Ideal gas: μ_JT = 0",
    keys: ["joule thomson coefficient", "isenthalpic process", "throttling process", "inversion temperature"],
    symbols: ["μ_JT > 0: gas cools upon expansion (P drops, T drops)", "μ_JT < 0: gas heats upon expansion", "μ_JT = 0: inversion temperature T_i = 2a / (Rb)"],
    notes: ["For an ideal gas, T(∂V/∂T)_P − V = 0, so μ_JT = 0 (no temperature change on expansion).", "H₂ and He have very low T_i (193 K and 40 K); at room temperature, they warm up on expansion through a throttle."],
    example: "Linde process liquefies air by repeated Joule–Thomson expansions below its inversion temperature."
  },
  {
    id: "maxwell_thermodynamic_relations",
    branch: "Physical",
    chapter: "Thermodynamics",
    title: "Maxwell's Fundamental Thermodynamic Relations",
    expr: "(∂T/∂V)_S = −(∂P/∂S)_V   |   (∂T/∂P)_S = (∂V/∂S)_P   |   (∂S/∂V)_T = (∂P/∂T)_V   |   (∂S/∂P)_T = −(∂V/∂T)_P",
    keys: ["maxwell relations", "thermodynamic potentials", "state functions partial derivatives"],
    symbols: ["Derived from exact differentials of thermodynamic potentials:", "dU = T dS − P dV", "dH = T dS + V dP", "dA = −S dT − P dV (Helmholtz)", "dG = −S dT + V dP (Gibbs)"],
    notes: ["Allows unmeasurable quantities like (∂S/∂P)_T to be calculated from easily measurable equation-of-state variables like thermal expansion (∂V/∂T)_P."],
    example: "From dG: (∂G/∂P)_T = V and (∂G/∂T)_P = −S. Taking cross-derivatives proves (∂S/∂P)_T = −(∂V/∂T)_P."
  },
  {
    id: "eyring_transition_state_theory",
    branch: "Physical",
    chapter: "Chemical Kinetics",
    title: "Eyring Equation (Transition State Theory)",
    expr: "k = (k_B · T / h) · e^(ΔS‡ / R) · e^(−ΔH‡ / RT)",
    keys: ["eyring equation", "transition state theory", "entropy of activation", "enthalpy of activation"],
    symbols: ["k_B = 1.38 × 10⁻²³ J K⁻¹ (Boltzmann constant)", "h = 6.626 × 10⁻³⁴ J s (Planck constant)", "k_B T / h: universal frequency factor (≈ 6.2 × 10¹² s⁻¹ at 298 K)", "ΔS‡: standard entropy of activation", "ΔH‡: standard enthalpy of activation = E_a − R T (for liquid solutions)"],
    notes: ["A large negative ΔS‡ indicates an associative, highly ordered transition state (like S_N2 or Diels–Alder).", "A positive ΔS‡ indicates a dissociative transition state (like S_N1)."],
    example: "Comparing Arrhenius and Eyring parameters shows frequency factor A is directly proportional to e^(ΔS‡/R)."
  },
  {
    id: "lindemann_unimolecular_kinetics",
    branch: "Physical",
    chapter: "Chemical Kinetics",
    title: "Lindemann–Hinshelwood Unimolecular Reaction Mechanism",
    expr: "Rate = (k₁ k₂ [A]²) / (k₋₁ [A] + k₂)   |   High P: Rate = (k₁ k₂ / k₋₁) [A] (1st order)   |   Low P: Rate = k₁ [A]² (2nd order)",
    keys: ["lindemann mechanism", "unimolecular gas reaction", "pressure transition order", "apparent rate constant"],
    symbols: ["A + A ⇌ A* + A (activation rate k₁, deactivation k₋₁ via collision)", "A* → Products (reaction rate k₂ via internal vibration)"],
    notes: ["Explains how a unimolecular reaction can be energised by bimolecular collisions yet exhibit overall first-order kinetics at normal pressures."],
    example: "Thermal isomerisation of cyclopropane to propene is 1st order at normal pressure but transitions to 2nd order at very low pressures."
  },

  /* Environmental Chemistry & Metallurgy */
  {
    id: "biochemical_oxygen_demand_bod",
    branch: "Physical",
    chapter: "Environmental Chemistry",
    title: "Biochemical Oxygen Demand (BOD) & Water Quality",
    expr: "BOD = (DO_initial − DO_after 5 days at 20 °C) in mg L⁻¹ (ppm)",
    keys: ["bod", "biochemical oxygen demand", "clean water", "water pollution"],
    symbols: ["DO: dissolved oxygen (pure water at 20 °C has DO ≈ 9 ppm)", "Clean drinking water: BOD < 5 ppm", "Highly polluted water: BOD > 17 ppm"],
    notes: ["Chemical Oxygen Demand (COD) measures total chemical oxidisability using K₂Cr₂O₇ in acid; COD is ALWAYS greater than BOD because it oxidises non-biodegradable matter as well."],
    example: "Domestic sewage has BOD of 100–400 ppm; industrial wastewater can exceed 1000 ppm."
  },
  {
    id: "blast_furnace_slag_formation",
    branch: "Inorganic",
    chapter: "General Principles of Metallurgy",
    title: "Blast Furnace Slag Formation & Flux Chemistry",
    expr: "CaCO₃ —heat (1070 K)→ CaO + CO₂   |   CaO (Basic Flux) + SiO₂ (Acidic Gangue) → CaSiO₃ (Molten Slag)",
    keys: ["blast furnace", "slag formation", "calcium silicate", "basic flux", "metallurgy of iron"],
    symbols: ["CaO: basic flux derived from limestone", "SiO₂: acidic impurity (gangue) present in haematite ore", "CaSiO₃: calcium silicate (molten slag, lighter than molten iron, floats on top)"],
    notes: ["Slag layer prevents oxidation of molten iron (sponge iron) by incoming hot air blast at the bottom of the blast furnace."],
    example: "Molten slag floats above pig iron and is tapped off through a separate slag notch."
  },
  {
    id: "cyanide_extraction_silver_gold",
    branch: "Inorganic",
    chapter: "General Principles of Metallurgy",
    title: "MacArthur–Forrest Cyanide Extraction of Gold and Silver",
    expr: "4 Au + 8 NaCN + 2 H₂O + O₂ → 4 Na[Au(CN)₂] (Soluble Complex) + 4 NaOH   |   2 Na[Au(CN)₂] + Zn → Na₂[Zn(CN)₄] + 2 Au↓",
    keys: ["macarthur forrest", "cyanide process", "leaching gold silver", "zinc displacement"],
    symbols: ["O₂ from atmospheric air acts as oxidising agent to oxidise Au⁰ to Au⁺", "Zinc is a stronger reducing agent (E°(Zn²⁺/Zn) = −0.76 V vs E°(Au⁺/Au) = +1.69 V) and displaces gold quantitatively"],
    notes: ["Hydrometallurgical extraction process: avoids high-temperature smelting for low-grade ores."],
    example: "Fine gold dust is recovered from cyanide leach liquor by filtering out the precipitated gold following zinc dust addition."
  },
  {
    id: "hall_heroult_aluminium_electrolysis",
    branch: "Inorganic",
    chapter: "General Principles of Metallurgy",
    title: "Hall–Héroult Electrolytic Extraction of Aluminium",
    expr: "Cathode: Al³⁺ + 3e⁻ → Al(l)   |   Anode: C(s) + 2 O²⁻ → CO₂(g) + 4e⁻   |   Overall: 2 Al₂O₃ + 3 C → 4 Al + 3 CO₂",
    keys: ["hall heroult process", "cryolite role", "fluorspar", "aluminium extraction", "carbon anode consumption"],
    symbols: ["Electrolyte: purified Al₂O₃ (2–8%) dissolved in molten Cryolite (Na₃AlF₆) + Fluorspar (CaF₂)", "Temperature: ~1220 K (950 °C)"],
    notes: [
      "Role of Cryolite (Na₃AlF₆) and Fluorspar (CaF₂): 1) Lowers melting point of alumina from 2320 K to ~1220 K; 2) Increases electrical conductivity of the molten melt.",
      "Carbon anodes are gradually burned away by evolving oxygen to form CO and CO₂, requiring ~0.5 kg of carbon anode per kg of aluminium produced."
    ],
    example: "Each metric ton of aluminium metal produced consumes about half a ton of graphite anode blocks."
  }
];

module.exports = formulasPart3;
