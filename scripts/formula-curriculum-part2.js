"use strict";

/**
 * Curriculum Part 2: Additional 150+ Formulas
 * Covering Advanced Physical, Inorganic Salt Analysis, Organic Tests, Biomolecules, Polymers & Everyday Chemistry.
 */

const formulasPart2 = [
  /* Practical Organic Chemistry & Tests */
  {
    id: "lassaigne_nitrogen_test",
    branch: "Organic",
    chapter: "General Organic Chemistry",
    title: "Lassaigne's Test for Nitrogen (Prussian Blue)",
    expr: "Na + C + N —fusion→ NaCN   |   6 NaCN + FeSO₄ → Na₄[Fe(CN)₆] + Na₂SO₄   |   3 Na₄[Fe(CN)₆] + 4 FeCl₃ → Fe₄[Fe(CN)₆]₃↓ (Prussian Blue) + 12 NaCl",
    keys: ["lassaigne test", "prussian blue", "nitrogen detection", "sodium fusion extract"],
    symbols: ["Sodium fusion converts covalent organic nitrogen into ionic sodium cyanide", "Fe₄[Fe(CN)₆]₃: ferric ferrocyanide (Prussian blue precipitate confirms nitrogen)"],
    notes: ["Hydrazine (NH₂NH₂) and hydroxylamine (NH₂OH) do NOT give Lassaigne's nitrogen test because they contain no carbon to form NaCN.", "Diazo compounds and nitro compounds DO give the test."],
    example: "Organic sample containing N fused with Na gives intense Prussian blue with FeSO₄ and FeCl₃."
  },
  {
    id: "lassaigne_sulfur_nitroprusside",
    branch: "Organic",
    chapter: "General Organic Chemistry",
    title: "Lassaigne's Test for Sulfur (Sodium Nitroprusside)",
    expr: "2 Na + S —fusion→ Na₂S   |   Na₂S + Na₂[Fe(CN)₅NO] → Na₄[Fe(CN)₅NOS] (Deep Violet Complex)",
    keys: ["sulfur detection", "sodium nitroprusside", "deep violet", "lassaigne sulfur"],
    symbols: ["Na₂[Fe(CN)₅NO]: sodium nitroprusside", "Na₄[Fe(CN)₅NOS]: sodium thionitroprusside (intense violet coloration confirms sulfur)"],
    notes: ["Lead acetate test for sulfur: Na₂S + (CH₃COO)₂Pb → PbS↓ (black precipitate) + 2 CH₃COONa."],
    example: "Fusion extract of sulfur-containing organic compound turns brilliant purple on adding a few drops of freshly prepared sodium nitroprusside."
  },
  {
    id: "lassaigne_nitrogen_sulfur_together",
    branch: "Organic",
    chapter: "General Organic Chemistry",
    title: "Lassaigne's Blood-Red Test for N and S Together",
    expr: "Na + C + N + S —fusion (insufficient Na)→ NaSCN   |   3 NaSCN + FeCl₃ → Fe(SCN)₃ (Blood-Red Solution) + 3 NaCl",
    keys: ["blood red ferric thiocyanate", "nitrogen and sulfur together", "thiocyanate", "iron thiocyanate"],
    symbols: ["NaSCN: sodium thiocyanate (forms when insufficient sodium is used during fusion)", "Fe(SCN)₃ or [Fe(H₂O)₅(SCN)]²⁺ gives characteristic deep blood-red coloration"],
    notes: ["If excess sodium is used in fusion, NaSCN decomposes into NaCN and Na₂S, which gives Prussian blue and nitroprusside tests separately."],
    example: "Thiourea fused with sodium gives blood red colour with FeCl₃."
  },
  {
    id: "victor_meyer_alcohol_test",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "Victor Meyer Test: Red, Blue, White Sequence",
    expr: "1° Alcohol → Nitroalkane → Nitrolic Acid —alkali→ BLOOD RED   |   2° Alcohol → Pseudonitrol —alkali→ BLUE   |   3° Alcohol → No reaction → COLOURLESS",
    keys: ["victor meyer test", "red blue white", "alcohol distinction", "pseudonitrol", "nitrolic acid"],
    symbols: ["Step 1: R–OH + P/I₂ → R–I", "Step 2: R–I + AgNO₂ → R–NO₂", "Step 3: R–NO₂ + HNO₂ (NaNO₂/HCl)", "Step 4: make alkaline with NaOH/KOH"],
    notes: ["Mnemonic: RBC (Red for 1°, Blue for 2°, Colourless for 3°).", "3° nitroalkanes have no α-hydrogen, so they do not react with nitrous acid."],
    example: "Ethanol gives blood-red colour with alkali; isopropanol gives blue colour; tert-butanol gives colourless solution."
  },
  {
    id: "duas_phenol_neutral_fecl3",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "Ferric Chloride (FeCl₃) Test for Phenolic Group",
    expr: "6 C₆H₅OH + FeCl₃ → [Fe(OC₆H₅)₆]³⁻ (Violet/Purple Complex) + 3 H⁺ + 3 HCl",
    keys: ["fecl3 test", "ferric chloride test", "phenolic oh", "violet complex"],
    symbols: ["Neutral FeCl₃ reacts with enols and phenols to form intensely coloured coordination complexes (violet, purple, green, or blue)", "[Fe(OAr)₆]³⁻: hexa-phenoxy ferrate(III) ion"],
    notes: ["Aliphatic alcohols (methanol, ethanol) do NOT give this colour reaction.", "Enols (like acetoacetic ester) also give violet coloration due to =C–OH group."],
    example: "Phenol and salicylic acid both give intense violet colour with neutral FeCl₃; benzoic acid gives a buff precipitate of ferric benzoate."
  },
  {
    id: "libermann_nitroso_phenol",
    branch: "Organic",
    chapter: "Alcohols, Phenols and Ethers",
    title: "Liebermann's Nitroso Reaction for Phenol",
    expr: "Phenol + NaNO₂ / conc. H₂SO₄ → p-nitrosophenol ⇌ Indophenol (Deep Green/Blue) —dilute with water→ Red —add NaOH→ Deep Blue",
    keys: ["liebermann nitroso test", "phenol test", "indophenol blue", "deep green to red to blue"],
    symbols: ["Specific diagnostic reaction for phenols having free para position"],
    notes: ["Mnemonic for colour sequence: Blue/Green → Red → Blue."],
    example: "Phenol warmed with NaNO₂ and conc. H₂SO₄ produces green colour, turns red on pouring into water, and deep blue on making alkaline."
  },
  {
    id: "dnp_carbonyl_test",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "2,4-DNP (Brady's Reagent) Test for Aldehydes & Ketones",
    expr: ">C=O + 2,4-(NO₂)₂C₆H₃−NHNH₂ → >C=N−NH−C₆H₃(NO₂)₂ (Yellow/Orange Precipitate) + H₂O",
    keys: ["2 4 dnp test", "bradys reagent", "carbonyl test", "yellow orange precipitate 24 dnp"],
    symbols: ["2,4-Dinitrophenylhydrazine (Brady's reagent)", "Product: 2,4-dinitrophenylhydrazone (bright yellow, orange, or red crystalline solid with sharp melting point)"],
    notes: ["Universal test for both aldehydes and ketones (aliphatic and aromatic).", "Carboxylic acids, esters, and amides do NOT give this test because resonance donation diminishes carbonyl electrophilicity."],
    example: "Both acetaldehyde and acetone instantly form yellow-orange crystalline precipitates with 2,4-DNP."
  },
  {
    id: "schiff_reagent_test",
    branch: "Organic",
    chapter: "Aldehydes, Ketones & Carboxylic Acids",
    title: "Schiff's Test for Aldehydes",
    expr: "R−CHO + Schiff's Reagent (decolourised rosaniline hydrochloride) → Restoration of Intense Magenta / Pink Colour",
    keys: ["schiffs reagent", "schiff test", "rosaniline hydrochloride", "magenta colour"],
    symbols: ["Schiff's reagent: p-rosaniline hydrochloride (magenta dye) decolourised by passing sulfur dioxide (SO₂) gas"],
    notes: ["Aldehydes restore the pink/magenta colour instantly without heating.", "Ketones do not restore the colour under normal conditions (acetone reacts extremely slowly)."],
    example: "Formaldehyde and benzaldehyde immediately turn Schiff's reagent bright magenta."
  },
  {
    id: "biuret_peptide_test",
    branch: "Organic",
    chapter: "Biomolecules",
    title: "Biuret Test for Peptide Bonds & Proteins",
    expr: "Protein + 10% NaOH + 1% CuSO₄ → [Cu(Peptide)₄]²⁻ (Violet / Purple Complex)",
    keys: ["biuret test", "peptide bond detection", "protein test", "violet copper complex"],
    symbols: ["Requires at least TWO peptide (–CONH–) bonds separated by a single carbon or nitrogen", "Cu²⁺ coordinates with four amide nitrogens in a square planar geometry"],
    notes: ["Free amino acids (except histidine) and dipeptides give a NEGATIVE test (they lack two adjacent peptide links).", "Biuret itself (H₂N–CO–NH–CO–NH₂, formed on heating urea) gives a positive test."],
    example: "Egg albumin or gelatin mixed with alkaline CuSO₄ turns deep violet."
  },
  {
    id: "ninhydrin_amino_acid_test",
    branch: "Organic",
    chapter: "Biomolecules",
    title: "Ninhydrin Test for α-Amino Acids",
    expr: "α-Amino Acid + 2 Ninhydrin → Ruhemann's Purple (Diketohydrindylidene-diketohydrindamine) + R−CHO + CO₂ + NH₄⁺",
    keys: ["ninhydrin test", "ruhemanns purple", "alpha amino acid", "proline yellow"],
    symbols: ["Ruhemann's purple: intense blue-violet chromophore formed by all α-amino acids with primary amino groups"],
    notes: ["Proline and hydroxyproline are secondary amines (imino acids) and give a characteristic YELLOW colour instead of purple.", "Used for visualizing latent fingerprints on paper."],
    example: "Alanine heated with dilute ninhydrin solution yields intense Ruhemann's purple."
  },
  {
    id: "xanthoproteic_test_aromatic_amino_acids",
    branch: "Organic",
    chapter: "Biomolecules",
    title: "Xanthoproteic Test for Aromatic Amino Acids",
    expr: "Protein with Phenyl Ring (Tyr, Trp, Phe) + conc. HNO₃ —heat→ Yellow Nitro Derivative —add alkali (NaOH)→ ORANGE",
    keys: ["xanthoproteic test", "aromatic amino acids", "tyrosine tryptophan phenylalanine", "nitration of protein"],
    symbols: ["Nitration of benzene rings in tyrosine, tryptophan, and phenylalanine produces yellow nitro compounds", "Alkali converts nitrophenols into orange quinonoid phenoxide salts"],
    notes: ["Explains why concentrated nitric acid turns human skin yellow on accidental contact."],
    example: "Adding conc. HNO₃ to egg albumin produces a yellow precipitate that turns deep orange upon addition of excess NaOH."
  },
  {
    id: "molisch_carbohydrate_test",
    branch: "Organic",
    chapter: "Biomolecules",
    title: "Molisch's General Test for Carbohydrates",
    expr: "Carbohydrate + conc. H₂SO₄ —dehydration→ Furfural / 5-HMF + α-Naphthol → Purple / Violet Ring at Interface",
    keys: ["molisch test", "carbohydrate detection", "alpha naphthol", "purple ring interface"],
    symbols: ["Conc. H₂SO₄ dehydrates pentoses to furfural and hexoses to 5-hydroxymethylfurfural (5-HMF)", "Furfural condenses with 2 molecules of α-naphthol to form a purple triphenylmethane dye"],
    notes: ["Universal test given by ALL carbohydrates (monosaccharides, disaccharides, polysaccharides).", "Reagent must be added gently down the side of the test tube without shaking to form two distinct layers."],
    example: "Glucose solution mixed with ethanolic α-naphthol forms a distinctive purple ring at the junction when conc. H₂SO₄ is layered beneath."
  },
  {
    id: "inversion_of_cane_sugar",
    branch: "Organic",
    chapter: "Biomolecules",
    title: "Inversion of Cane Sugar (Sucrose Hydrolysis)",
    expr: "Sucrose [α = +66.5°] + H₂O —H⁺ / Invertase→ D-(+)-Glucose [+52.5°] + D-(−)-Fructose [−92.4°]   =>   Invert Sugar [α = −19.9°]",
    keys: ["inversion of cane sugar", "sucrose optical rotation", "invert sugar", "fructose glucose"],
    symbols: ["Sucrose is dextrorotatory (+66.5°)", "Equimolar hydrolysed mixture has net levorotation (−19.9°) because levorotation of fructose (−92.4°) dominates dextrorotation of glucose (+52.5°)"],
    notes: ["The process is called 'inversion' because the sign of optical rotation changes from (+) to (−).", "Sucrose is a non-reducing disaccharide (both anomeric carbons participate in α-1,2-glycosidic linkage); invert sugar is strongly reducing."],
    example: "Honey is primarily natural invert sugar (glucose + fructose), which is sweeter than sucrose."
  },
  {
    id: "mutarotation_glucose_equilibrium",
    branch: "Organic",
    chapter: "Biomolecules",
    title: "Mutarotation Equilibrium of D-Glucose Anomers",
    expr: "α-D-Glucopyranose [+112°] (36%) ⇌ Open Chain Form [0.02%] ⇌ β-D-Glucopyranose [+19°] (64%)   =>   Equilibrium [α = +52.7°]",
    keys: ["mutarotation", "alpha beta glucose", "anomers", "anomeric carbon"],
    symbols: ["Mutarotation: spontaneous change in specific optical rotation of an optically active hemiacetal solution until equilibrium is reached", "Anomeric carbon is C-1 in glucose (C-2 in fructose)"],
    notes: ["β-anomer is more stable and abundant (64%) because all bulky substituents (−OH and −CH₂OH) occupy equatorial positions in the chair conformation.", "Mutarotation is catalysed by both acids and bases (amphiprotic solvents)."],
    example: "Freshly prepared solution of α-D-glucose has [α] = +112°; on standing, it falls steadily to +52.7°."
  },

  /* Polymers & Everyday Chemistry */
  {
    id: "nylon_66_reaction",
    branch: "Organic",
    chapter: "Polymers",
    title: "Nylon 6,6 Condensation Polymerisation",
    expr: "n HOOC−(CH₂)₄−COOH (Adipic Acid) + n H₂N−(CH₂)₆−NH₂ (Hexamethylenediamine) —553 K, high P→ [−CO−(CH₂)₄−CO−NH−(CH₂)₆−NH−]_n + (2n−1) H₂O",
    keys: ["nylon 66", "adipic acid", "hexamethylenediamine", "polyamide", "step growth polymerisation"],
    symbols: ["Designation 6,6 signifies that BOTH monomers contain 6 carbon atoms each", "Forms strong intermolecular hydrogen bonds between amide groups (>C=O···H–N<), conferring high tensile strength and fiber-forming properties"],
    notes: ["Nylon 6 is prepared from a single monomer, Caprolactam, by heating with water at 533–543 K: [–CO–(CH₂)₅–NH–]_n.", "Extensively used in making bristles for brushes, tyre cords, and textile fabrics."],
    example: "Equimolar adipic acid and hexamethylenediamine first form 'nylon salt' which on heating polymerises with water elimination."
  },
  {
    id: "terylene_dacron_esterification",
    branch: "Organic",
    chapter: "Polymers",
    title: "Terylene / Dacron Polyester Condensation",
    expr: "n HOOC−C₆H₄−COOH (Terephthalic Acid) + n HO−CH₂CH₂−OH (Ethylene Glycol) —420–460 K, Zn-Sb catalyst→ [−CO−C₆H₄−CO−O−CH₂CH₂−O−]_n + (2n−1) H₂O",
    keys: ["terylene", "dacron", "polyester", "terephthalic acid", "ethylene glycol"],
    symbols: ["Catalyst: zinc acetate – antimony trioxide", "Contains recurring ester (–COO–) linkages throughout the polymer backbone"],
    notes: ["Crease-resistant, high tensile strength, resistant to biological degradation; blended with cotton to make terycot and wool to make terywool."],
    example: "Commercial Dacron fiber is produced by continuous melt spinning of molten poly(ethylene terephthalate) (PET)."
  },
  {
    id: "bakelite_phenol_formaldehyde",
    branch: "Organic",
    chapter: "Polymers",
    title: "Bakelite (Phenol–Formaldehyde Thermosetting Polymer)",
    expr: "Phenol + HCHO —acid or base→ o- & p-Hydroxymethylphenols —condense→ Novolac (Linear) —heat with HCHO (Urotropine)→ Bakelite (3D Cross-linked Network)",
    keys: ["bakelite", "novolac", "phenol formaldehyde", "thermosetting polymer", "cross linked polymer"],
    symbols: ["Novolac: linear polymer used in paints and lacquers", "Bakelite: heavily cross-linked 3D infusible, insoluble thermosetting network connected by methylene (–CH₂–) bridges"],
    notes: ["Once molded and set by heat, thermosetting plastics CANNOT be remelted or reshaped because cross-links are permanent covalent bonds.", "Used for making electrical switches, plugs, handles of utensils, and phonograph records."],
    example: "Heating novolac with formaldehyde creates a rigid 3D infusible polymer (Bakelite)."
  },
  {
    id: "vulcanisation_natural_rubber",
    branch: "Organic",
    chapter: "Polymers",
    title: "Vulcanisation of Natural Rubber (cis-1,4-Polyisoprene)",
    expr: "[−CH₂−C(CH₃)=CH−CH₂−]_n + 3–5% Sulfur —373–415 K→ Polyisoprene Chains Cross-linked with −S_x− Bridges",
    keys: ["vulcanisation", "natural rubber", "cis 1 4 polyisoprene", "sulfur cross links", "gutta percha"],
    symbols: ["Natural rubber: all-cis-1,4-polyisoprene (soft, sticky at high temp, brittle at low temp, high water absorption)", "Gutta-percha: all-trans-1,4-polyisoprene (non-elastic, rigid, crystalline)", "Vulcanisation: introduces disulfide (–S–S–) cross-links at allylic carbons"],
    notes: ["Vulcanisation confers high elasticity, tensile strength, resistance to organic solvents, and wide usable temperature range (−40 to 100 °C).", "Tyre rubber contains ~5% sulfur; ebonite (hard battery cases) contains ~30% sulfur."],
    example: "Sulfur bridges prevent adjacent polymer chains from permanently slipping past each other when stretched."
  },
  {
    id: "biodegradable_phbv_copolymer",
    branch: "Organic",
    chapter: "Polymers",
    title: "PHBV: Biodegradable Aliphatic Polyester",
    expr: "3-hydroxybutanoic acid + 3-hydroxypentanoic acid → Poly(β-hydroxybutyrate-co-β-hydroxyvalerate) (PHBV) + H₂O",
    keys: ["phbv", "biodegradable polymer", "polyhydroxybutyrate", "controlled drug release"],
    symbols: ["Monomers: CH₃–CH(OH)–CH₂–COOH and CH₃CH₂–CH(OH)–CH₂–COOH", "Degraded by bacterial enzymes in the environment into CO₂ and H₂O"],
    notes: ["Used in specialty packaging, orthopedic devices, and controlled drug release capsules.", "Another important biodegradable polymer is Nylon 2-nylon 6 (polyamide of glycine + amino caproic acid)."],
    example: "PHBV drug capsules degrade harmlessly in the human body without producing toxic residues."
  },
  {
    id: "soap_saponification_cleansing",
    branch: "Organic",
    chapter: "Chemistry in Everyday Life",
    title: "Saponification & Cleansing Action of Soap",
    expr: "Fat / Oil (Triglyceride) + 3 NaOH → Glycerol + 3 R−COONa (Soap)   |   Hard Water: 2 RCOO⁻ + Ca²⁺ → (RCOO)₂Ca↓ (Curd)",
    keys: ["saponification", "soap cleansing action", "micelle", "hard water scum", "synthetic detergents"],
    symbols: ["R–COONa: sodium salt of higher fatty acid (stearate C₁₇H₃₅COO⁻, palmitate C₁₅H₃₁COO⁻, oleate C₁₇H₃₃COO⁻)", "Hydrophobic tail (R–) dissolves in grease/oil droplet; hydrophilic head (–COO⁻) interacts with water, forming spherical micelles"],
    notes: ["Soaps do NOT work in hard water because Ca²⁺ and Mg²⁺ ions precipitate insoluble calcium and magnesium stearates (scum/curd).", "Synthetic detergents (e.g. sodium lauryl sulfate CH₃(CH₂)₁₁OSO₃⁻ Na⁺) form soluble calcium salts and work efficiently even in hard water."],
    example: "Saponification of glyceryl tristearate with sodium hydroxide yields glycerol and 3 molecules of sodium stearate."
  },

  /* Inorganic Salt Analysis & Cation Schemes */
  {
    id: "salt_analysis_group_reagents",
    branch: "Inorganic",
    chapter: "Qualitative Analysis",
    title: "Systematic Group Reagents for Cation Analysis (Groups 0 to VI)",
    expr: "Group Reagent Table for Qualitative Cation Separation",
    keys: ["qualitative analysis cations", "group reagents", "solubility product precipitation", "ksp separation"],
    symbols: [
      "Group 0: NH₄⁺ — heated with NaOH => NH₃ gas (turns moist red litmus blue, gives dense white fumes with HCl)",
      "Group I: Pb²⁺, Ag⁺, Hg₂²⁺ — dilute HCl => insoluble chlorides (PbCl₂, AgCl, Hg₂Cl₂)",
      "Group II: Pb²⁺, Cu²⁺, Bi³⁺, Cd²⁺, As³⁺, Sb³⁺, Sn²⁺ — H₂S gas in dilute acidic medium (0.3 M HCl) => insoluble sulfides with very low Ksp",
      "Group III: Fe³⁺, Al³⁺, Cr³⁺ — NH₄OH in presence of NH₄Cl => insoluble hydroxides (Fe(OH)₃ reddish brown, Al(OH)₃ gelatinous white, Cr(OH)₃ green)",
      "Group IV: Co²⁺, Ni²⁺, Mn²⁺, Zn²⁺ — H₂S gas in alkaline medium (NH₄OH + NH₄Cl) => sulfides with moderate Ksp (NiS/CoS black, MnS buff/flesh, ZnS white)",
      "Group V: Ba²⁺, Sr²⁺, Ca²⁺ — (NH₄)₂CO₃ in presence of NH₄OH and NH₄Cl => insoluble carbonates (BaCO₃, SrCO₃, CaCO₃ white)",
      "Group VI: Mg²⁺ — Na₂HPO₄ in presence of NH₄OH => white crystalline precipitate of magnesium ammonium phosphate Mg(NH₄)PO₄"
    ],
    notes: [
      "Why HCl in Group II: Common ion effect of H⁺ suppresses ionisation of H₂S, keeping [S²⁻] very low so only Group II sulfides (extremely small Ksp) precipitate.",
      "Why NH₄Cl in Group III: Common ion effect of NH₄⁺ suppresses [OH⁻], so only Group III hydroxides precipitate; Group IV, V, VI hydroxides (larger Ksp) remain in solution.",
      "Why NH₄OH in Group IV: Neutralises H⁺, shifting H₂S ⇌ 2H⁺ + S²⁻ forward, raising [S²⁻] sufficiently to precipitate Group IV sulfides."
    ],
    example: "Adding dilute HCl to an unknown solution precipitates a white solid that dissolves in hot water: confirmed Group I Pb²⁺ (PbCl₂ is soluble in hot water)."
  },
  {
    id: "flame_test_emission_colours",
    branch: "Inorganic",
    chapter: "Qualitative Analysis",
    title: "Flame Test Characteristic Atomic Emission Colours",
    expr: "Excited valence electrons de-excite to emit characteristic visible light photons: ΔE = h · c / λ",
    keys: ["flame test colours", "alkali metal flames", "alkaline earth flames", "platinum wire"],
    symbols: [
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
    notes: ["Beryllium (Be) and Magnesium (Mg) do NOT give flame tests because their valence electrons are tightly held by high nuclear charge; excitation energy lies outside the visible region.", "Cobalt blue glass absorbs yellow light from sodium contamination, allowing potassium lilac flame to be observed."],
    example: "A salt paste with conc. HCl gives an apple green flame on clean platinum wire: confirmed Barium (Ba²⁺)."
  },
  {
    id: "borax_bead_test_reactions",
    branch: "Inorganic",
    chapter: "Qualitative Analysis",
    title: "Borax Bead Test Chemistry & Transition Metal Colours",
    expr: "Na₂B₄O₇ · 10H₂O —heat→ 2 NaBO₂ + B₂O₃ (Glassy Bead)   |   B₂O₃ + CuO —oxidising flame→ Cu(BO₂)₂ (Sky Blue Bead)",
    keys: ["borax bead test", "metaborates", "transition metal beads", "glassy bead"],
    symbols: ["B₂O₃: basic boric anhydride in transparent glassy bead", "Forms characteristic coloured transition metal metaborates"],
    notes: [
      "Copper (Cu²⁺): Sky blue in oxidising flame; red opaque (Cu) in reducing flame.",
      "Cobalt (Co²⁺): Intense deep blue in BOTH oxidising and reducing flames (due to Co(BO₂)₂).",
      "Chromium (Cr³⁺): Dark green in both oxidising and reducing flames.",
      "Iron (Fe³⁺): Yellowish-brown in oxidising flame; dirty green (Fe²⁺) in reducing flame.",
      "Nickel (Ni²⁺): Brownish-red in oxidising flame; grey-black in reducing flame."
    ],
    example: "Cobalt salt gives an intense, unmistakable blue bead in both oxidising and reducing flames."
  },
  {
    id: "nessler_reagent_ammonia",
    branch: "Inorganic",
    chapter: "Qualitative Analysis",
    title: "Nessler's Reagent Test for Ammonium (NH₄⁺) Ions",
    expr: "2 K₂[HgI₄] + NH₃ + 3 KOH → H₂N−Hg−O−Hg−I↓ (Iodide of Millon's Base, Brown ppt) + 7 KI + 2 H₂O",
    keys: ["nesslers reagent", "ammonium test", "millons base", "brown precipitate ammonia"],
    symbols: ["K₂[HgI₄]: alkaline potassium tetraiodomercurate(II) (Nessler's reagent)", "Product: Iodide of Millon's base (characteristic reddish-brown precipitate)"],
    notes: ["Extremely sensitive: even trace ppm concentrations of ammonia or ammonium salts give unmistakable brown precipitate or yellow coloration."],
    example: "Heating ammonium chloride with NaOH releases NH₃ gas, which turns filter paper dipped in Nessler's reagent instant brown."
  }
];

module.exports = formulasPart2;
