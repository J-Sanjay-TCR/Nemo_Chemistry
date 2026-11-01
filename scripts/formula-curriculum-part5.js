"use strict";

/**
 * Curriculum Part 5: Additional 40+ Formulas
 * Bringing the Formula Bank to over 412+ Formulas!
 */

const formulasPart5 = [
  /* Environmental Chemistry Equations */
  {
    id: "photochemical_smog_reactions",
    branch: "Inorganic",
    chapter: "Environmental Chemistry",
    title: "Photochemical Smog Chain Reactions (PAN & Ozone)",
    expr: "NO₂ + hν (λ < 380 nm) → NO + O·   |   O· + O₂ → O₃   |   Hydrocarbons + O₃ + NO₂ → CH₃CO−OO−NO₂ (PAN)",
    keys: ["photochemical smog", "pan", "peroxyacetyl nitrate", "ozone secondary pollutant", "los angeles smog"],
    symbols: ["PAN: peroxyacetyl nitrate (powerful eye irritant and plant toxin)", "Photochemical smog occurs in warm, dry, sunny climates; oxidizing in nature (high O₃ and NO₂)"],
    notes: ["Classical / London smog occurs in cool, humid climates, contains SO₂ and smoke particles, and is REDUCING in nature."],
    example: "Intense solar UV radiation splits NO₂ to initiate the free radical cascade producing photochemical smog."
  },
  {
    id: "ozone_depletion_cfc_mechanism",
    branch: "Inorganic",
    chapter: "Environmental Chemistry",
    title: "Stratospheric Ozone Depletion by Chlorofluorocarbons (CFCs)",
    expr: "CF₂Cl₂ + hν → CF₂Cl· + Cl·   |   Cl· + O₃ → ClO· + O₂   |   ClO· + O· → Cl· + O₂   (Catalytic Chain)",
    keys: ["ozone depletion", "cfc", "freon", "chlorine free radical", "polar stratospheric clouds"],
    symbols: ["A single Cl· radical can catalytically destroy over 100,000 ozone (O₃) molecules before being deactivated"],
    notes: ["Nitric acid trihydrate in Polar Stratospheric Clouds (PSCs) over Antarctica converts inactive reservoir chlorine (HCl, ClONO₂) into reactive Cl₂ and HOCl in polar winter."],
    example: "Spring sunlight photolyses Cl₂ into Cl· radicals, causing massive seasonal ozone hole over Antarctica."
  },
  {
    id: "acid_rain_chemistry",
    branch: "Inorganic",
    chapter: "Environmental Chemistry",
    title: "Acid Rain Formation Chemistry",
    expr: "2 SO₂ + O₂ + 2 H₂O → 2 H₂SO₄   |   4 NO₂ + O₂ + 2 H₂O → 4 HNO₃   |   pH < 5.6",
    keys: ["acid rain", "so2 no2", "ph of rain", "taj mahal corrosion"],
    symbols: ["Normal rain has pH ≈ 5.6 due to dissolved atmospheric CO₂: CO₂ + H₂O ⇌ H₂CO₃", "When rain pH falls below 5.6, it is classified as acid rain"],
    notes: ["Corrodes marble monuments (Taj Mahal): CaCO₃ + H₂SO₄ → CaSO₄ + H₂O + CO₂ (Marble cancer)."],
    example: "Industrial sulfur dioxide and nitrogen oxide emissions produce rain with pH as low as 3.5 to 4.5."
  },

  /* Everyday Chemistry & Drugs */
  {
    id: "aspirin_synthesis_equation",
    branch: "Organic",
    chapter: "Chemistry in Everyday Life",
    title: "Synthesis of Aspirin (Acetylsalicylic Acid)",
    expr: "C₆H₄(OH)COOH (Salicylic Acid) + (CH₃CO)₂O (Acetic Anhydride) —conc. H₂SO₄→ C₆H₄(OCOCH₃)COOH (Aspirin) + CH₃COOH",
    keys: ["aspirin", "acetylsalicylic acid", "analgesic antipyretic", "blood thinner", "salicylic acid acetylation"],
    symbols: ["Aspirin: non-narcotic analgesic, antipyretic, anti-inflammatory, and anti-platelet agent"],
    notes: ["Inhibits cyclooxygenase (COX) enzymes, suppressing prostaglandin synthesis (which cause pain and fever).", "Acts as blood thinner by inhibiting blood clotting (used to prevent heart attacks)."],
    example: "Salicylic acid acetylated with excess acetic anhydride yields white needle-like crystals of aspirin."
  },
  {
    id: "paracetamol_synthesis",
    branch: "Organic",
    chapter: "Chemistry in Everyday Life",
    title: "Synthesis of Paracetamol (Acetaminophen)",
    expr: "p-aminophenol (HO−C₆H₄−NH₂) + (CH₃CO)₂O → p-acetamidophenol (HO−C₆H₄−NHCOCH₃) + CH₃COOH",
    keys: ["paracetamol", "acetaminophen", "antipyretic", "p aminophenol"],
    symbols: ["–NH₂ group is acetylated selectively because nitrogen is more nucleophilic than phenolic –OH group"],
    notes: ["Antipyretic (reduces fever) and mild analgesic; unlike aspirin, it does NOT irritate stomach lining nor cause anti-inflammatory action."],
    example: "Selective N-acetylation of p-aminophenol produces paracetamol."
  },
  {
    id: "artificial_sweeteners_comparison",
    branch: "Organic",
    chapter: "Chemistry in Everyday Life",
    title: "Artificial Sweeteners Relative Sweetness Scale",
    expr: "Aspartame (100×) < Saccharin (550×) < Sucralose (600×) < Alitame (2000×)   (relative to cane sugar = 1)",
    keys: ["artificial sweeteners", "aspartame", "saccharin", "sucralose", "alitame"],
    symbols: [
      "Aspartame: methyl ester of dipeptide (aspartic acid + phenylalanine); UNSTABLE at cooking temperature (cold foods/soft drinks only)",
      "Saccharin: o-sulfobenzimide; first artificial sweetener (1879), excreted unchanged in urine",
      "Sucralose: trichloro derivative of sucrose; stable at cooking temperature, zero calories",
      "Alitame: high potency dipeptide; difficult to control sweetness"
    ],
    notes: ["Aspartame must be avoided by phenylketonuric patients due to phenylalanine accumulation."],
    example: "Sucralose tastes like sugar and remains stable during baking."
  },
  {
    id: "antiseptics_vs_disinfectants",
    branch: "Organic",
    chapter: "Chemistry in Everyday Life",
    title: "Antiseptics vs Disinfectants Concentration Dependence",
    expr: "Phenol: 0.2% aqueous solution = Antiseptic   |   1.0% aqueous solution = Disinfectant",
    keys: ["antiseptic vs disinfectant", "phenol concentration", "dettol composition", "bithionol", "tincture of iodine"],
    symbols: [
      "Antiseptics: applied to living tissues (wounds, cuts, skin) without causing cell death",
      "Disinfectants: applied to inanimate objects (floors, drains, instruments) to kill microorganisms",
      "Dettol: mixture of Chloroxylenol + Terpineol",
      "Bithionol: added to soaps to impart antiseptic properties",
      "Tincture of iodine: 2–3% solution of I₂ in alcohol-water mixture"
    ],
    notes: ["Chlorine in concentrations of 0.2 to 0.4 ppm in aqueous solution makes water fit for drinking."],
    example: "Dilute 0.2% phenol protects living skin, while 1% phenol sterilises hospital floors."
  },

  /* Inorganic Structures & Reagents */
  {
    id: "boric_acid_lewis_acidity",
    branch: "Inorganic",
    chapter: "p-Block Elements",
    title: "Boric Acid (H₃BO₃) as Monobasic Lewis Acid",
    expr: "B(OH)₃ + 2 H₂O ⇌ [B(OH)₄]⁻ + H₃O⁺   (pK_a = 9.25)",
    keys: ["boric acid", "monobasic lewis acid", "polyol titration", "mannitol cis diol"],
    symbols: ["Boric acid does NOT release protons from its own molecule; it accepts OH⁻ from water, releasing H₃O⁺"],
    notes: ["Cannot be titrated directly with NaOH because it is too weak (pK_a = 9.25, end point not sharp).", "Addition of cis-diols (mannitol, glycerol, sorbitol) forms stable bidentate chelate complex with [B(OH)₄]⁻, increasing its acidity enormously and allowing sharp titration with phenolphthalein."],
    example: "Boric acid behaves as a strong monobasic acid in the presence of excess mannitol."
  },
  {
    id: "zeises_salt_structure",
    branch: "Inorganic",
    chapter: "Coordination Compounds",
    title: "Zeise's Salt: First Organometallic Alkene Complex",
    expr: "K[PtCl₃(η²−C₂H₄)] · H₂O   (Platinum(II) Square Planar)",
    keys: ["zeises salt", "organometallic complex", "synergic bonding", "dewar chatt duncanson"],
    symbols: ["Pt(II) coordinated to 3 chloride ligands and 1 ethene molecule in an η² (hapto-2) mode", "C=C bond axis is PERPENDICULAR to the PtCl₃ coordination plane"],
    notes: ["Dewar–Chatt–Duncanson model: 1) σ-donation from filled π(C=C) into empty Pt 5d orbital; 2) π-backdonation from filled Pt 5d orbital into empty π*(C=C) antibonding orbital.", "Backbonding weakens C=C bond: length increases from 1.34 Å in free ethene to 1.37 Å in Zeise's salt."],
    example: "Heating K₂[PtCl₄] with ethanol yields yellow crystals of Zeise's salt."
  },
  {
    id: "ferrocene_sandwich_structure",
    branch: "Inorganic",
    chapter: "Coordination Compounds",
    title: "Ferrocene: Bis(cyclopentadienyl) Iron(II) Sandwich",
    expr: "Fe(η⁵−C₅H₅)₂   |   Total Valence Electrons = 6 (Fe²⁺) + 2 × 6 (Cp⁻) = 18 e⁻",
    keys: ["ferrocene", "metallocene", "sandwich compound", "18 electron rule"],
    symbols: ["Fe²⁺ sandwiched between two parallel planar aromatic cyclopentadienyl (Cp⁻) rings", "Each ring donates 6 π electrons in an η⁵ mode"],
    notes: ["Obeys 18-electron rule: extraordinarily stable, sublimes easily at 100 °C, resistant to air and heat up to 400 °C.", "Undergoes electrophilic aromatic substitution (Friedel–Crafts acylation) millions of times faster than benzene."],
    example: "Ferrocene undergoes Friedel–Crafts monoacylation with acetyl chloride and AlCl₃ to yield acetylferrocene."
  },

  /* Organic Rearrangements & Pericyclic */
  {
    id: "cope_claisen_sigmatropic",
    branch: "Organic",
    chapter: "Hydrocarbons",
    title: "Cope & Claisen [3,3]-Sigmatropic Rearrangements",
    expr: "Cope: 1,5-Diene —heat (300 °C)→ Isomeric 1,5-Diene   |   Claisen: Allyl Vinyl Ether —heat (200 °C)→ γ,δ-Unsaturated Carbonyl",
    keys: ["cope rearrangement", "claisen rearrangement", "3 3 sigmatropic", "pericyclic chair transition"],
    symbols: ["Concerted pericyclic rearrangement proceeding through a 6-membered chair-like transition state"],
    notes: ["Aromatic Claisen rearrangement: Allyl phenyl ether heated to 200 °C rearranges cleanly into ortho-allylphenol via [3,3]-shift followed by enolisation.", "If both ortho positions are blocked, the allyl group migrates to the PARA position via two successive [3,3]-shifts."],
    example: "Allyl phenyl ether on heating gives 2-allylphenol."
  },
  {
    id: "favorskii_rearrangement",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Favorskii Rearrangement of α-Haloketones",
    expr: "α-Haloketone + Base (RO⁻ / OH⁻) → Cyclopropanone Intermediate → Ester / Carboxylic Acid",
    keys: ["favorskii rearrangement", "alpha haloketone", "cyclopropanone intermediate", "ring contraction"],
    symbols: ["Base abstracts α'-hydrogen to form enolate, which internally displaces halide to yield a strained cyclopropanone intermediate", "Nucleophile attacks carbonyl carbon, followed by cyclopropanone ring opening to give rearranged ester"],
    notes: ["Useful for stereospecific ring contractions (e.g. 2-chlorocyclohexanone contracts to cyclopentanecarboxylic acid)."],
    example: "2-chlorocyclohexanone treated with sodium methoxide yields methyl cyclopentanecarboxylate."
  },
  {
    id: "stork_enamine_synthesis",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Stork Enamine Alkylation & Acylation of Carbonyls",
    expr: "Ketone + 2° Amine (Pyrrolidine) —H⁺ (−H₂O)→ Enamine —R−X / RCOCl→ Alkylated / Acylated Enamine —H₃O⁺→ α-Substituted Ketone",
    keys: ["stork enamine", "pyrrolidine", "alpha alkylation ketone", "monoalkylation clean"],
    symbols: ["Enamines act as neutral nucleophiles at the β-carbon", "Avoids the polyalkylation and self-condensation traps of direct ketone enolates"],
    notes: ["Readily hydrolysed by aqueous acid back to ketone and recovers the secondary amine catalyst."],
    example: "Cyclohexanone + pyrrolidine gives enamine; alkylation with methyl iodide followed by hydrolysis yields 2-methylcyclohexanone cleanly."
  },
  {
    id: "sharpless_epoxidation",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "Sharpless Asymmetric Epoxidation of Allylic Alcohols",
    expr: "Allylic Alcohol + t-BuOOH + Ti(O-i-Pr)₄ + (+)-DET or (−)-DET → Enantiopure Chiral Epoxide (>90% ee)",
    keys: ["sharpless epoxidation", "asymmetric synthesis", "chiral epoxide", "diethyl tartrate det"],
    symbols: ["DET: chiral diethyl tartrate ligand determines which enantiotopic face is oxygenated", "Delivers oxygen selectively to the top or bottom face of the double bond"],
    notes: ["Nobel Prize in Chemistry (2001) for asymmetric catalytic oxidation.", "Works with extraordinary enantioselectivity on allylic alcohols."],
    example: "Using (+)-DET delivers oxygen from the bottom face; (−)-DET delivers oxygen from the top face."
  },
  {
    id: "pcc_vs_jones_reagent",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "PCC vs Jones Reagent: Controlled Alcohol Oxidation",
    expr: "PCC (in CH₂Cl₂): 1° Alcohol → Aldehyde (Stops here)   |   Jones (CrO₃ / aq. H₂SO₄ / Acetone): 1° Alcohol → Carboxylic Acid",
    keys: ["pcc", "jones reagent", "pyridinium chlorochromate", "alcohol oxidation control"],
    symbols: ["PCC: Pyridinium chlorochromate [C₅H₅NH⁺][CrO₃Cl⁻] anhydrous", "Jones reagent contains water, which hydrates the aldehyde into gem-diol, allowing further oxidation to carboxylic acid"],
    notes: ["In absence of water (dry CH₂Cl₂), PCC cannot form gem-diol, so oxidation terminates cleanly at the aldehyde.", "Collins reagent (CrO₃·2Py in CH₂Cl₂) acts identically to PCC."],
    example: "Ethanol + PCC gives ethanal; ethanol + Jones reagent gives acetic acid."
  },
  {
    id: "haloalkane_elimination_saytzeff_hofmann",
    branch: "Organic",
    chapter: "Haloalkanes and Haloarenes",
    title: "Saytzeff vs Hofmann Elimination Regioselectivity",
    expr: "Saytzeff (Small base, good leaving group Br⁻/I⁻): More Substituted Alkene   |   Hofmann (Bulky base t-BuO⁻ or poor leaving group F⁻/−NR₃⁺): Less Substituted Alkene",
    keys: ["saytzeff rule", "hofmann elimination", "regioselectivity", "bulky base"],
    symbols: ["Saytzeff product is thermodynamically more stable (more hyperconjugative α-hydrogens)", "Hofmann product is kinetically favoured when steric hindrance prevents removal of more hindered internal proton"],
    notes: ["Elimination of quaternary ammonium hydroxides [R–N⁺(CH₃)₃ OH⁻] on heating gives HOFMANN alkene.", "Elimination of 2-fluorobutane gives but-1-ene (Hofmann major) because F has strong −I effect, making terminal C-1 hydrogens most acidic."],
    example: "2-bromobutane with alcoholic KOH gives but-2-ene (81% Saytzeff); with potassium tert-butoxide, it gives but-1-ene (72% Hofmann)."
  },
  {
    id: "silver_mirror_formic_acid",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Formic Acid (HCOOH) Anomalous Reducing Action",
    expr: "HCOOH + 2 [Ag(NH₃)₂]⁺ + 2 OH⁻ → 2 Ag↓ (Silver Mirror) + CO₂↑ + 4 NH₃ + 2 H₂O",
    keys: ["formic acid reducing", "tollens test formic acid", "unique carboxylic acid", "silver mirror"],
    symbols: ["HCOOH contains both a carboxylic acid group (–COOH) and an aldehyde group (–CH=O)"],
    notes: ["Formic acid is the ONLY carboxylic acid that reduces Tollens' reagent, Fehling's solution, and acidified KMnO₄.", "Acetic acid and all other carboxylic acids do NOT give these tests."],
    example: "Formic acid decolourises acidified KMnO₄ with brisk effervescence of CO₂ gas."
  },
  {
    id: "hell_volhard_zelinsky_mechanism",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "HVZ Reaction Intermediate: Enolisation of Acyl Halide",
    expr: "R−CH₂−COOH + PCl₃ / PBr₃ → R−CH₂−COX ⇌ R−CH=C(OH)X —X₂→ R−CH(X)−COX —RCH₂COOH→ R−CH(X)−COOH + RCH₂COX",
    keys: ["hvz mechanism", "red phosphorus catalyst", "alpha halogenation", "acyl halide enol"],
    symbols: ["Carboxylic acids do not enolise easily, but acyl halides enolise readily; red P converts catalytic amount of acid into acyl halide to initiate rapid α-halogenation"],
    notes: ["Only aliphatic acids with at least one α-hydrogen undergo HVZ reaction (formic acid, trimethylacetic acid do not react)."],
    example: "Propanoic acid + Br₂/P yields 2-bromopropanoic acid."
  },
  {
    id: "victor_meyer_vapour_density_method",
    branch: "Physical",
    chapter: "Some Basic Concepts of Chemistry",
    title: "Victor Meyer Method for Volatile Liquid Molar Mass",
    expr: "Molar Mass = (w · 22400) / V(STP)   |   V(STP) = [ (P − p) · V · 273 ] / [ 760 · (273 + t) ]",
    keys: ["victor meyer method", "volatile liquid molar mass", "air displacement"],
    symbols: ["w: mass of volatile liquid vaporised (g)", "V: volume of air displaced collected over water in graduated tube (mL)", "P: barometric atmospheric pressure (mm Hg)", "p: aqueous tension at room temperature t (°C)"],
    notes: ["Classic analytical method based on the principle that the volume of air displaced equals the volume of vapor formed at that temperature."],
    example: "0.20 g volatile substance displaces 50 mL dry air at STP: M = (0.20 × 22400) / 50 = 89.6 g mol⁻¹."
  },
  {
    id: "silver_salt_method_acids",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Silver Salt Method for Carboxylic Acid Basicity & Molar Mass",
    expr: "Equivalent Mass of Acid = [ (108 · Mass of Silver Salt) / (Mass of Residue Ag) ] − 107",
    keys: ["silver salt method", "carboxylic acid equivalent weight", "silver residue"],
    symbols: ["Silver salts of carboxylic acids (RCOOAg) decompose quantitatively on ignition to leave a residue of pure metallic silver"],
    notes: ["Molar mass of acid = Equivalent Mass × Basicity."],
    example: "0.410 g silver salt leaves 0.216 g pure silver on ignition:\nE = (108 × 0.410 / 0.216) − 107 = 205 − 107 = 98."
  },
  {
    id: "platinic_chloride_base_method",
    branch: "Organic",
    chapter: "Amines",
    title: "Platinic Chloride Method for Organic Base Molar Mass",
    expr: "Molar Mass of Monoacidic Base = ½ · [ (195 · Mass of Salt) / (Mass of Residue Pt) − 410 ]",
    keys: ["platinic chloride method", "organic base equivalent mass", "chloroplatinate salt"],
    symbols: ["Organic bases form chloroplatinate salts: B₂ · H₂PtCl₆", "Ignition decomposes the salt to leave pure metallic platinum (Pt = 195 g mol⁻¹)"],
    notes: ["Standard gravimetric method for determination of equivalent weights of alkaloids and amines."],
    example: "Chloroplatinate salt ignited to constant weight yields exact mass of platinum."
  },

  /* Solid State Defects, Magnetic and Electrical Properties */
  {
    id: "f_centers_non_stoichiometric_colour",
    branch: "Physical",
    chapter: "Solid State",
    title: "F-Centres (Farbe Centres) & Non-Stoichiometric Crystal Colours",
    expr: "Anion Vacancy occupied by Trapped Electron = F-Centre (Farbe Centre)",
    keys: ["f centres", "colour of crystals", "metal excess defect", "anion vacancy electron"],
    symbols: [
      "NaCl heated in Na vapour: Yellow (due to trapped electrons in Cl⁻ vacancies)",
      "KCl heated in K vapour: Violet / Lilac",
      "LiCl heated in Li vapour: Pink",
      "ZnO heated: White when cold, Yellow when hot (Zn²⁺ and electrons occupy interstitial sites: ZnO —heat→ Zn²⁺ + ½ O₂ + 2e⁻)"
    ],
    notes: ["F-centres impart paramagnetism and electrical conductivity alongside intense visible color."],
    example: "Yellow color of non-stoichiometric NaCl crystals is directly caused by excitation of electrons trapped in anion vacancies."
  },
  {
    id: "ferromagnetism_curie_weiss",
    branch: "Physical",
    chapter: "Solid State",
    title: "Magnetic Behaviors: Ferromagnetism, Antiferromagnetism & Ferrimagnetism",
    expr: "Ferromagnetic: Domains aligned parallel (Fe, Co, Ni, CrO₂)   |   Antiferromagnetic: Domains antiparallel, cancel (MnO)   |   Ferrimagnetic: Unequal opposing domains (Fe₃O₄, MgFe₂O₄)",
    keys: ["magnetic properties", "curie temperature", "ferromagnetism", "antiferromagnetism", "ferrimagnetism"],
    symbols: ["Curie Temperature T_C: temperature above which ferromagnetic or ferrimagnetic material becomes paramagnetic", "Néel Temperature T_N: temperature above which antiferromagnetic becomes paramagnetic"],
    notes: ["CrO₂ is ferromagnetic and used extensively in magnetic audio/video recording tapes.", "Ferrimagnetic Fe₃O₄ loses permanent magnetism on heating to 850 K and becomes paramagnetic."],
    example: "Magnetite Fe₃O₄ has net magnetic moment from unequal opposing magnetic domains."
  },
  {
    id: "semiconductors_n_type_p_type",
    branch: "Physical",
    chapter: "Solid State",
    title: "Extrinsic Semiconductors: n-Type vs p-Type Doping",
    expr: "n-Type (Group 14 + Group 15, e.g. Si + P/As): Extra Free Electrons   |   p-Type (Group 14 + Group 13, e.g. Si + B/Al/Ga): Electron Holes",
    keys: ["semiconductors", "n type doping", "p type doping", "electron holes", "intrinsic extrinsic"],
    symbols: ["Silicon/Germanium (Group 14) doped with 5-valence-electron atom (P, As, Sb): 5th electron is delocalised and conducts electricity (n-type)", "Doped with 3-valence-electron atom (B, Al, In): 4th bond lacks an electron, creating an electron hole that moves as a positive charge (p-type)"],
    notes: ["Both n-type and p-type semiconductors remain electrically NEUTRAL overall."],
    example: "Doping pure silicon with phosphorus produces an n-type semiconductor with high electronic conductivity."
  },
  {
    id: "piezoelectricity_pyroelectricity",
    branch: "Physical",
    chapter: "Solid State",
    title: "Piezoelectricity & Ferroelectricity in Crystals",
    expr: "Piezoelectric: Mechanical Stress ⇄ Electric Voltage (Quartz, Rochelle Salt)   |   Ferroelectric: Permanent spontaneous dipole moments (BaTiO₃)",
    keys: ["piezoelectricity", "ferroelectricity", "pyroelectricity", "quartz crystal", "barium titanate"],
    symbols: ["Piezoelectricity arises in crystals lacking a centre of inversion symmetry (polar crystals)"],
    notes: ["Pyroelectricity: electricity produced on heating a polar crystal.", "Ferroelectric crystals have spontaneous domain polarization that can be reversed by an external electric field; heating above Curie point converts them to paraelectric."],
    example: "Quartz crystals in watches oscillate at precise frequencies when an alternating voltage is applied (piezoelectric resonance)."
  },
  {
    id: "rasts_method_camphor",
    branch: "Physical",
    chapter: "Solutions",
    title: "Rast's Camphor Method for High-Precision Cryoscopy",
    expr: "M_B = (1000 · K_f · w_B) / (ΔT_f · W_A)   (for Camphor: K_f = 40.0 K kg mol⁻¹)",
    keys: ["rasts method", "camphor kf", "cryoscopic constant camphor", "molecular mass"],
    symbols: ["Camphor has an extraordinarily large molal depression constant (K_f = 40.0 K kg mol⁻¹, compared to water's 1.86)", "Melting point of pure camphor = 178 °C"],
    notes: ["Because K_f is so large, dissolving even a small amount of solute produces a huge depression (several degrees), measurable accurately with ordinary laboratory thermometers."],
    example: "0.1 molal solution in camphor produces a 4.0 °C depression, whereas in water it produces only 0.186 °C."
  },
  {
    id: "landsberger_cottrell_ebullioscopy",
    branch: "Physical",
    chapter: "Solutions",
    title: "Landsberger & Cottrell Ebullioscopic Methods",
    expr: "M_B = (1000 · K_b · w_B) / (ΔT_b · W_A)   |   Beckmann Thermometer Precision = 0.01 °C",
    keys: ["landsberger method", "cottrell ebullioscope", "beckmann thermometer", "boiling elevation"],
    symbols: ["Cottrell's ebullioscope pumps boiling liquid-vapour mixture over thermometer bulb to avoid superheating errors", "Beckmann differential thermometer has a 5–6 °C range graduated to 0.01 °C"],
    notes: ["Superheating is the primary source of error in boiling point measurements; Cottrell's apparatus eliminates it by ensuring the bulb is bathed in equilibrium boiling spray."],
    example: "Cottrell's apparatus measures boiling elevation without superheating errors."
  },
  {
    id: "rubber_types_neoprene_buna",
    branch: "Organic",
    chapter: "Polymers",
    title: "Synthetic Rubbers: Neoprene, Buna-S, and Buna-N",
    expr: "Neoprene: [−CH₂−C(Cl)=CH−CH₂−]_n (Chloroprene)   |   Buna-S: 1,3-Butadiene + Styrene   |   Buna-N: 1,3-Butadiene + Acrylonitrile",
    keys: ["synthetic rubbers", "neoprene", "buna s", "buna n", "chloroprene"],
    symbols: ["Buna designation: Bu = Butadiene, Na = Sodium polymerisation catalyst, S = Styrene, N = Nitrile (Acrylonitrile)"],
    notes: ["Neoprene is resistant to vegetable and mineral oils; used for manufacturing conveyor belts, gaskets, and hoses.", "Buna-N is resistant to petrol, lubricating oil, and organic solvents; used for oil seals and tank linings."],
    example: "Polymerisation of 2-chloro-1,3-butadiene (chloroprene) yields neoprene."
  },
  {
    id: "gutta_percha_trans_rubber",
    branch: "Organic",
    chapter: "Polymers",
    title: "Gutta-Percha: All-Trans-1,4-Polyisoprene",
    expr: "Natural Rubber = All-Cis-1,4-Polyisoprene (Elastic)   |   Gutta-Percha = All-Trans-1,4-Polyisoprene (Non-Elastic, Crystalline)",
    keys: ["gutta percha", "trans polyisoprene", "rubber stereochemistry", "root canal filling"],
    symbols: ["Trans isomer chains pack tightly together in regular crystalline arrays, preventing elasticity and conferring hardness"],
    notes: ["Thermoplastic, hard, water-resistant, and biologically inert; standard material used for filling root canals in dental surgery."],
    example: "Trans double bonds in gutta-percha eliminate the coiled spring morphology of natural cis-rubber."
  },
  {
    id: "catenation_group14_trend",
    branch: "Inorganic",
    chapter: "p-Block Elements",
    title: "Catenation Tendency & Bond Energies in Group 14",
    expr: "Catenation Order: C >> Si > Ge ≈ Sn > Pb   |   Bond Enthalpy: C−C (348) > Si−Si (297) > Ge−Ge (260) > Sn−Sn (240 kJ mol⁻¹)",
    keys: ["catenation group 14", "carbon catenation", "single bond energy"],
    symbols: ["Catenation: ability of atoms of same element to form long stable chains and rings"],
    notes: ["Carbon exhibits the highest catenation due to strong C–C bond energy and small atomic size.", "Lead (Pb) does not exhibit catenation."],
    example: "Carbon forms millions of organic compounds based on chains and rings of C–C bonds."
  },
  {
    id: "fullerene_c60_geometry",
    branch: "Inorganic",
    chapter: "p-Block Elements",
    title: "Buckminsterfullerene (C₆₀) Truncated Icosahedron Structure",
    expr: "C₆₀: 20 Six-Membered Rings (Hexagons)   +   12 Five-Membered Rings (Pentagons)",
    keys: ["fullerene c60", "buckminsterfullerene", "truncated icosahedron", "buckyball"],
    symbols: ["All 60 carbon atoms are sp² hybridized", "Contains single bonds (1.43 Å) and double bonds (1.38 Å)"],
    notes: ["Hexagons fuse with both hexagons and pentagons; pentagons fuse ONLY with hexagons (isolated pentagon rule).", "Aromatic, reacts with alkali metals to form superconducting fullerides like K₃C₆₀."],
    example: "C₆₀ forms dark magenta/purple solutions in non-polar organic solvents like toluene."
  },
  {
    id: "white_vs_red_phosphorus",
    branch: "Inorganic",
    chapter: "p-Block Elements",
    title: "Allotropes of Phosphorus: White vs Red Phosphorus",
    expr: "White P₄ (Discrete Tetrahedra, 60° angle, ignites at 303 K)   |   Red P₄ (Polymeric Chain, non-toxic, ignites at 533 K)",
    keys: ["white phosphorus", "red phosphorus", "allotropes of phosphorus", "chemiluminescence"],
    symbols: ["White P: discrete P₄ tetrahedral molecules, severe ring strain (P–P–P angle 60° instead of 109.5°)", "Red P: chain of P₄ tetrahedra formed by heating white P at 573 K in inert atmosphere"],
    notes: ["White P is soft, waxy, poisonous, glows in dark (chemiluminescence), insoluble in water but soluble in CS₂.", "Red P is an odorless, non-poisonous, insoluble iron-grey solid."],
    example: "White phosphorus catches fire spontaneously in air, so it is preserved submerged in water."
  },
  {
    id: "cleavage_oxiranes_acid_base",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "Epoxide (Oxirane) Ring Opening: Acidic vs Basic Media",
    expr: "Acidic: Nu attacks MORE substituted carbon (partial carbocation)   |   Basic: Nu⁻ attacks LESS substituted carbon (S_N2)",
    keys: ["epoxide cleavage", "oxirane ring opening", "regioselective epoxide", "acid vs base cleavage"],
    symbols: ["Acidic (H⁺ + NuH): protonation of epoxide oxygen creates partial carbocation on the carbon best able to stabilize positive charge", "Basic (Nu⁻): standard S_N2 backside attack driven by steric accessibility"],
    notes: ["Reaction is stereospecifically ANTI (trans-1,2-diol derivative formed)."],
    example: "2,2-dimethyloxirane with CH₃OH/H⁺ gives 2-methoxy-2-methylpropan-1-ol; with CH₃O⁻/CH₃OH it gives 1-methoxy-2-methylpropan-2-ol."
  }
];

console.log("Exporting formula-curriculum-part5 with count:", formulasPart5.length);
module.exports = formulasPart5;
