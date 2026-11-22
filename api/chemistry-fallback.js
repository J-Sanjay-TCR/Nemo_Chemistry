"use strict";

/**
 * Autonomous Chemistry Knowledge Engine
 * Provides instant, high-rigor, verified chemistry explanations with KaTeX formatting
 * when live AI models are offline, rate-limited, or recovering from connection interruptions.
 */

const TOPICS = [
  {
    patterns: [/\bcr\s*-?\s*7\b|\bcristiano\b|\bronaldo\b|\b(favou?rite|fav)\s+(football(?:er)?|soccer\s+player|player|athlete)\b/i],
    title: "CR7 Fan Club: Nemo AI & J.Sanjay",
    content: `### ⚽ SIUUU! Yes — 100% a CR7 Fan!

**Yes, absolutely!** I completely agree — I am a huge fan of **Cristiano Ronaldo (CR7)**! His discipline, relentless work ethic, and winning mindset are legendary.

And **J.Sanjay** (my creator and founder of Nemo AI) is also a huge **CR7 fan**! 🐐⚡`
  },
  {
    patterns: [/\btwin\s+complex|\bdouble\s+salts?|\bcomplex\s+salts?|\bmagnus'?s?\s+(?:green\s+)?salt|\bmohr'?s?\s+salt|\bcarnallite|\bpotash\s+alum|\bcoordination\s+isomer(?:ism)?|\bwerner'?s?\s+theory/i],
    title: "Twin Complex Salts vs. Double Salts vs. Simple Complex Salts",
    content: `### ✦ Coordination Salts: Twin Complex Salts vs. Double Salts vs. Simple Complex Salts

**Important Exam Clarification (NCERT & IUPAC):** **Twin complex salts** are **NOT** double salts. Mixing two simple salts in stoichiometric proportions produces crystal lattices belonging to distinct classes based on whether complex ions exist and retain their identity in aqueous solution:

---

#### 1. Core Definitions & Classic Examples
* **Twin Complex Salts (Cationic–Anionic Complex Salts):** Coordination compounds of general formula $[\\text{M}_1(\\text{L}_1)_n]^{q+}[\\text{M}_2(\\text{L}_2)_m]^{p-}$ in which **BOTH the cation AND the anion are discrete coordination complex ions**. Both spheres retain their identity in aqueous solution (provided ligands do not exchange).
  * **Magnus's Green Salt:** $\\ce{[Pt(NH3)4][PtCl4]}$ (contains square planar $\\ce{[Pt(NH3)4]^{2+}}$ cation + square planar $\\ce{[PtCl4]^{2-}}$ anion; empirical formula $\\text{Pt(NH}_3)_2\\text{Cl}_2$, a *polymerisation isomer* of cisplatin/transplatin).
  * **Other Classic Examples:** $\\ce{[Co(NH3)6][Cr(CN)6]}$, $\\ce{[Cr(NH3)6][Co(CN)6]}$, $\\ce{[Co(NH3)6][Fe(CN)6]}$, $\\ce{[Ag(NH3)2][Ag(CN)2]}$, $\\ce{[Cu(NH3)4][PtCl4]}$.
* **Double Salts:** Stoichiometric addition compounds that exist **only in the solid crystalline state** and **dissociate completely into simple hydrated ions** in aqueous solution (losing their identity and giving positive analytical tests for every constituent simple ion).
  * Examples: **Mohr's Salt** $\\ce{FeSO4.(NH4)2SO4.6H2O}$, **Carnallite** $\\ce{KCl.MgCl2.6H2O}$, **Potash Alum** $\\ce{K2SO4.Al2(SO4)3.24H2O}$.
* **Simple Complex Salts:** Compounds having **one** coordination sphere paired with simple non-coordinated counter-ions (e.g., $\\ce{K4[Fe(CN)6]}$, $\\ce{[Co(NH3)6]Cl3}$).

---

#### 2. Aqueous Dissociation Behaviour (Display Equations)
* **Twin Complex Salt** (retains both complex ions; produces **2 moles of ions** per mole, $i \\approx 2$):
  $$\\ce{[Pt(NH3)4][PtCl4](s) ->[H2O] [Pt(NH3)4]^{2+}(aq) + [PtCl4]^{2-}(aq)}$$
  *(Gives **no** precipitate with $\\ce{AgNO3}$ because $\\ce{Cl^-}$ is locked inside the inner coordination sphere.)*
* **Double Salt** (complete breakdown into simple ions; Mohr's salt produces **5 moles of ions** per mole):
  $$\\ce{FeSO4.(NH4)2SO4.6H2O(s) ->[H2O] Fe^{2+}(aq) + 2NH4+(aq) + 2SO4^{2-}(aq) + 6H2O}$$

---

#### 3. Side-by-Side Comparison Table
| Criterion | Double Salt | Simple Complex Salt | Twin Complex Salt (Cationic–Anionic) |
|:---|:---|:---|:---|
| **Constituent Ions** | Only simple cations & simple anions | One complex ion + simple counter-ions | **Both cation AND anion are complex ions** |
| **Identity in Water** | **Completely lost** (full dissociation) | Complex ion retained; counter-ions free | **Both complex spheres retained** |
| **Analytical Ion Tests** | Gives tests for **all** constituent ions | Fails tests for ligands inside $[\\dots]$ | Fails simple-ion tests for both central metals/ligands |
| **Coordination Isomerism** | Not applicable | Not possible alone | **Exhibits Coordination Isomerism** by ligand swap |
| **Classic Examples** | Mohr's salt, Carnallite, Potash alum | $\\ce{K4[Fe(CN)6]}$, $\\ce{[Co(NH3)6]Cl3}$ | $\\ce{[Pt(NH3)4][PtCl4]}$, $\\ce{[Co(NH3)6][Cr(CN)6]}$ |

---

#### 4. Verified JEE Traps: Oxidation States, Coordination Isomerism & Magnetism
1. **Charge-Balance Sign Check:** For $[\\text{Co(NH}_3)_6][\\text{Cr(CN)}_6]$ with oxidation states $x$ (Co) and $y$ (Cr):
   $$x + 6(0) + y + 6(-1) = 0 \\implies x + y = +6 \\quad (x = 6 - y)$$
   Here both metals are in the $+3$ state ($\\ce{Co^{3+}}$ and $\\ce{Cr^{3+}}$).
2. **Coordination Isomerism Magnetic Moment Trap:**
   * Compare $\\ce{[Co(NH3)6][Cr(CN)6]}$ vs $\\ce{[Cr(NH3)6][Co(CN)6]}$: $\\ce{Co^{3+}}$ ($3d^6$) is **low-spin ($n = 0$)** with both $\\ce{NH3}$ and $\\ce{CN^-}$, while $\\ce{Cr^{3+}}$ ($3d^3$) ALWAYS has $t_{2g}^3$ (**$n = 3$**) regardless of ligand strength! Hence **BOTH isomers have the exact same spin-only magnetic moment** $\\mu = \\sqrt{3(3+2)} = \\sqrt{15} \\approx 3.87\\text{ B.M.}$
   * Contrast with $\\ce{[Co(NH3)6][Fe(CN)6]}$ vs $\\ce{[Fe(NH3)6][Co(CN)6]}$: Here the spin state of $\\ce{Fe^{3+}}$ ($3d^5$) changes from **low-spin ($n = 1, \\mu \\approx 1.73\\text{ B.M.}$)** in $\\ce{[Fe(CN)6]^{3-}}$ to **high-spin ($n = 5, \\mu \\approx 5.92\\text{ B.M.}$)** in $\\ce{[Fe(NH3)6]^{3+}}$ (remember $\\ce{Co^{3+}}$ with $\\ce{NH3}$ is low-spin $d^6, n=0$, whereas $\\ce{Fe^{3+}}$ with $\\ce{NH3}$ stays high-spin $d^5$!).
3. **Authoritative Sources:** **NCERT Class XII Chemistry, Part I, Unit: Coordination Compounds**; **IUPAC Red Book (Nomenclature of Inorganic Chemistry)**.`
  },
  {
    patterns: [/\belectronegativit(y|ies)\b|\bpauling\s+scale\b/i],
    title: "Pauling Electronegativity Table (NCERT & CRC Reference)",
    content: `### ✦ Electronegativity Table (Pauling / Allred Scale)

**Electronegativity ($\\chi$)** is the dimensionless relative tendency of an atom in a chemical bond to attract shared bonding electrons toward itself. Values below follow the **revised Pauling (Allred, 1961)** scale alongside standard **NCERT** approximations.

| Element | Symbol ($Z$) | Group / Period | Pauling $\\chi$ | Key Chemical Classification & Trend Note |
|:---|:---:|:---:|---:|:---|
| **Hydrogen** | $\\text{H}$ (1) | Grp 1 · P1 | 2.20 | Reference non-metal ($\\approx 2.1$ in older Pauling text); slightly above $\\text{B}$ and $\\text{P}$ |
| **Lithium** | $\\text{Li}$ (3) | Grp 1 · P2 | 0.98 | Alkali metal; forms polar covalent organolithium bonds ($\\text{R-Li}$) |
| **Beryllium** | $\\text{Be}$ (4) | Grp 2 · P2 | 1.57 | Alkaline earth metal; high polarising power (Fajans' rule) $\\rightarrow$ covalent $\\text{BeCl}_2$ |
| **Boron** | $\\text{B}$ (5) | Grp 13 · P2 | 2.04 | Metalloid; electron-deficient covalent compounds ($\\text{BF}_3$) |
| **Carbon** | $\\text{C}$ (6) | Grp 14 · P2 | 2.55 | Backbone of organic chemistry; rises with $s$-character ($sp^3\\ 2.55 < sp^2\\ 2.75 < sp\\ 3.29$) |
| **Nitrogen** | $\\text{N}$ (7) | Grp 15 · P2 | 3.04 | Strong $\\text{H}$-bond acceptor/donor; $3^{\\text{rd}}$ most electronegative common non-metal |
| **Oxygen** | $\\text{O}$ (8) | Grp 16 · P2 | 3.44 | $2^{\\text{nd}}$ highest electronegativity; positive oxidation state only in $\\text{OF}_2$ ($+2$) & $\\text{O}_2\\text{F}_2$ ($+1$) |
| **Fluorine** | $\\text{F}$ (9) | Grp 17 · P2 | 3.98 | **Highest** electronegativity of all elements ($\\approx 4.0$); always $-1$ in compounds |
| **Sodium** | $\\text{Na}$ (11) | Grp 1 · P3 | 0.93 | Strong electropositive alkali metal; forms predominantly ionic salts |
| **Magnesium** | $\\text{Mg}$ (12) | Grp 2 · P3 | 1.31 | Polar covalent character in Grignard reagents ($\\text{R}^{\\delta-}-\\text{Mg}^{\\delta+}\\text{X}$) |
| **Aluminium** | $\\text{Al}$ (13) | Grp 13 · P3 | 1.61 | Amphoteric metal oxide ($\\text{Al}_2\\text{O}_3$); covalent anhydrous $\\text{AlCl}_3$ dimer |
| **Silicon** | $\\text{Si}$ (14) | Grp 14 · P3 | 1.90 | Metalloid semiconductor; forms strong $\\text{Si-O}$ siloxane bonds |
| **Phosphorus** | $\\text{P}$ (15) | Grp 15 · P3 | 2.19 | Slightly lower than $\\text{H}$ ($2.20$); $\\text{P-H}$ bond has very weak polarity |
| **Sulfur** | $\\text{S}$ (16) | Grp 16 · P3 | 2.58 | Comparable to $\\text{C}$ ($2.55$); weak/absent hydrogen bonding in $\\text{H}_2\\text{S}$ |
| **Chlorine** | $\\text{Cl}$ (17) | Grp 17 · P3 | 3.16 | Higher Pauling $\\chi$ than $\\text{N}$ ($3.04$), though $\\text{N}$ shows stronger $\\text{H}$-bonding due to smaller size |
| **Potassium** | $\\text{K}$ (19) | Grp 1 · P4 | 0.82 | Highly reactive alkali metal; lower ionisation enthalpy and $\\chi$ than $\\text{Na}$ |
| **Calcium** | $\\text{Ca}$ (20) | Grp 2 · P4 | 1.00 | Alkaline earth metal; forms predominantly ionic $\\text{CaO}, \\text{CaCl}_2$ |
| **Iron** | $\\text{Fe}$ (26) | Grp 8 · P4 | 1.83 | $d$-block metal; effective $\\chi$ rises with oxidation state ($\\text{Fe}^{3+} > \\text{Fe}^{2+}$) |
| **Bromine** | $\\text{Br}$ (35) | Grp 17 · P4 | 2.96 | Liquid halogen; moderate oxidising agent |
| **Iodine** | $\\text{I}$ (53) | Grp 17 · P5 | 2.66 | Least electronegative stable halogen; $\\text{I}^-$ is an excellent leaving group & soft nucleophile |
| **Caesium** | $\\text{Cs}$ (55) | Grp 1 · P6 | 0.79 | **Lowest** electronegativity among stable metals ($\\text{Fr} \\approx 0.70$ is radioactive) |

---

#### Key Trends, Exceptions & Legitimate Sources:
* **Periodic Trend:** $\\chi$ **increases left → right** across a period (smaller radius, higher $Z_{\\text{eff}}$) and **decreases top → bottom** down a group (larger radius, stronger shielding).
* **Not an Invariant Constant:** Electronegativity increases with **positive oxidation state** ($\\text{Fe}^{3+} > \\text{Fe}^{2+}$) and **$s$-orbital character** ($\\text{C}_{sp} = 3.29 > \\text{C}_{sp^2} = 2.75 > \\text{C}_{sp^3} = 2.55$).
* **$\\text{Cl}$ vs $\\text{N}$ Trap:** On the Allred-Pauling scale $\\text{Cl} (3.16) > \\text{N} (3.04)$, yet $\\text{NH}_3$ forms strong hydrogen bonds whereas $\\text{HCl}$ does not, because chlorine's $3p$ lone pairs are much larger and more diffuse.
* **Authoritative Sources:** L. Pauling (*The Nature of the Chemical Bond*); A. L. Allred (*J. Inorg. Nucl. Chem.*, 1961, 17, 215); **CRC Handbook of Chemistry and Physics**; **IUPAC Gold Book**; **NCERT Class XI Chemistry, Unit 3**.`
  },
  {
    patterns: [/\bamines?\b.*\breagents?\b|\breagents?\b.*\bamines?\b|\btable\b.*\bamines?\b|\bamines?\b.*\btable\b/i],
    title: "Organic Reagents in Amines Chapter (NCERT Class XII)",
    content: `### ✦ Organic Reagents & Reactions in Amines (NCERT Class XII)

Complete summary of preparation, chemical tests, electrophilic substitution, and diazonium transformations in the **Amines** chapter:

| Reagent & Conditions | Reaction / Name | Primary Product & Scope | Critical Exam Exception / Trap |
|:---|:---|:---|:---|
| $\\text{H}_2/\\text{Pd}$ (ethanol) or $\\text{Sn}/\\text{HCl}$ or $\\text{Fe}/\\text{HCl}$ | Reduction of Nitro Compounds | $\\text{R-NO}_2$ or $\\text{Ar-NO}_2 \\rightarrow \\text{R-NH}_2 / \\text{Ar-NH}_2$ | **$\\text{Fe}/\\text{HCl}$ is preferred industrially** because $\\text{FeCl}_2$ formed hydrolyses to regenerate $\\text{HCl}$ (only catalytic $\\text{HCl}$ needed) |
| Excess $\\text{NH}_3$ (ethanolic) + $\\text{R-X}$, $373\\text{ K}$ (sealed tube) | Ammonolysis of Alkyl Halides | Mainly $1^\\circ$ amine when $\\text{NH}_3$ is in excess | Equimolar amounts give a mixture of $1^\\circ, 2^\\circ, 3^\\circ$ amines + $4^\\circ$ salt ($\\text{R}_4\\text{N}^+\\text{X}^-$); reactivity $\\text{RI} > \\text{RBr} > \\text{RCl}$ |
| $\\text{LiAlH}_4$ or $\\text{H}_2/\\text{Ni}$ or $\\text{Na(Hg)}/\\text{C}_2\\text{H}_5\\text{OH}$ | Reduction of Nitriles & Amides | $\\text{R-CN} \\rightarrow \\text{R-CH}_2\\text{NH}_2$; $\\text{R-CONH}_2 \\rightarrow \\text{R-CH}_2\\text{NH}_2$ | Step-up from $\\text{R-X} \\rightarrow \\text{R-CN} \\rightarrow \\text{R-CH}_2\\text{NH}_2$ adds **one carbon** |
| 1. alc. $\\text{KOH}$  2. $\\text{R-X}$ ($1^\\circ$)  3. aq. $\\text{NaOH}$ (on phthalimide) | Gabriel Phthalimide Synthesis | Pure **$1^\\circ$ aliphatic amines** free of $2^\\circ/3^\\circ$ contamination | **Fails for aromatic amines** ($\\text{Ar-NH}_2$) because $\\text{Ar-X}$ does not undergo $S_N2$ with potassium phthalimide |
| $\\text{Br}_2 + \\text{NaOH}$ (or alc. $\\text{KOH}$, 4 eq.) | Hoffmann Bromamide Degradation | $\\text{R-CONH}_2 \\rightarrow \\text{R-NH}_2 + \\text{Na}_2\\text{CO}_3$ | **Step-down reaction**: amine has **1 carbon fewer** than parent amide; proceeds with **retention** of migrating group configuration |
| $\\text{R'COCl}$ or $(\\text{R'CO})_2\\text{O}$ / Pyridine | Acylation of Amines | $1^\\circ / 2^\\circ$ amines $\\rightarrow$ substituted amides ($\\text{R-NHCOR'}$) | **$3^\\circ$ amines do not react** (no replaceable $\\text{N-H}$); pyridine neutralises $\\text{HCl}$ to drive equilibrium forward |
| $\\text{CHCl}_3 + \\text{alc. KOH}$, $\\Delta$ | Carbylamine Reaction (Isocyanide Test) | Foul-smelling isocyanide ($\\text{R-NC}$ or $\\text{Ar-NC}$) | **Positive ONLY for $1^\\circ$ amines** (aliphatic & aromatic); $2^\\circ$ and $3^\\circ$ amines give no reaction |
| $\\text{NaNO}_2 + \\text{HCl}$ ($\\text{HNO}_2$), $273\\text{–}278\\text{ K}$ | Nitrous Acid Test & Diazotisation | $1^\\circ$ aliphatic $\\rightarrow$ $\\text{ROH} + \\text{N}_2\\uparrow$; $1^\\circ$ aromatic $\\rightarrow$ $\\text{ArN}_2^+\\text{Cl}^-$ | Alkyl diazonium salts are unstable even at $0^\\circ\\text{C}$; $2^\\circ$ amines give yellow oily $N$-nitrosoamines |
| $\\text{C}_6\\text{H}_5\\text{SO}_2\\text{Cl}$ + aq. $\\text{KOH}$ | Hinsberg's Reagent ($1^\\circ/2^\\circ/3^\\circ$ Test) | $1^\\circ \\rightarrow$ sulfonamide (**soluble in $\\text{KOH}$**); $2^\\circ \\rightarrow$ **insoluble** | $1^\\circ$ sulfonamide retains an acidic $\\text{N-H}$ so it dissolves in alkali; $3^\\circ$ amine **does not react** |
| $\\text{Br}_2/\\text{H}_2\\text{O}$ (room temp.) on Aniline | Bromination of Aniline | Immediate white ppt. of **2,4,6-tribromoaniline** | For **monobromo** ($p$-bromoaniline), protect $-\\text{NH}_2$ as acetanilide using $(\\text{CH}_3\\text{CO})_2\\text{O}$/pyridine, brominate, then hydrolyse |
| Conc. $\\text{HNO}_3 + \\text{H}_2\\text{SO}_4$, $288\\text{ K}$ on Aniline | Direct Nitration of Aniline | **$51\\%$ *para*, $47\\%$ *meta*, $2\\%$ *ortho*** nitroaniline | High ***meta*** yield ($47\\%$) occurs because strong acid protonates aniline to meta-directing $-\\text{NH}_3^+$! |
| $\\text{Cu}_2\\text{Cl}_2/\\text{HCl}$, $\\text{Cu}_2\\text{Br}_2/\\text{HBr}$, $\\text{CuCN}/\\text{KCN}$ (or $\\text{Cu}/\\text{HCl}$) | Sandmeyer & Gattermann Reactions | $\\text{ArN}_2^+\\text{X}^- \\rightarrow \\text{Ar-Cl}, \\text{Ar-Br}, \\text{Ar-CN}$ | Use **$\\text{KI}$ (warm)** for $\\text{Ar-I}$, **$\\text{HBF}_4/\\Delta$** for $\\text{Ar-F}$, and **$\\text{H}_3\\text{PO}_2 + \\text{H}_2\\text{O}$** (or $\\text{EtOH}$) for $\\text{Ar-H}$ |
| Phenol ($\\text{OH}^-$, pH $9\\text{–}10$) or Aniline ($\\text{H}^+$, pH $4\\text{–}5$) | Azo Coupling with $\\text{ArN}_2^+\\text{Cl}^-$ | $p$-Hydroxyazobenzene (**orange dye**) / $p$-Aminoazobenzene (**yellow dye**) | Diazonium ion ($\\text{ArN}_2^+$) acts as a weak **electrophile** attacking at the *para* position |

---

#### Key Exceptions & Authoritative Source:
* **Friedel–Crafts Failure:** Aniline **does not** undergo Friedel–Crafts alkylation or acylation because basic $-\\text{NH}_2$ reacts with Lewis acid catalyst $\\text{AlCl}_3$ to form an insoluble salt ($\\text{C}_6\\text{H}_5\\text{NH}_2^+\\text{AlCl}_3^-$), strongly deactivating the ring.
* **Authoritative Source:** **NCERT Class XII Chemistry, Part II, Unit: Amines** & **IUPAC Compendium of Chemical Terminology**.`
  },
  {
    patterns: [/\b(organic|inorganic)\b.*\b(inorganic|organic)\b.*\b(differ(?:ence|ences)?|compar(?:e|ison)|versus|vs\.?|distinguish|contrast)\b|\b(differ(?:ence|ences)?|compar(?:e|ison)|versus|vs\.?|distinguish|contrast)\b.*\b(organic|inorganic)\b/i],
    title: "Organic vs. Inorganic Elements & Compounds (IUPAC & NCERT)",
    content: `### ✦ Important Differences: Organic vs. Inorganic Chemistry (Elements & Compounds)

**Important Scientific Clarification (IUPAC):** Individual **chemical elements themselves are NOT inherently "organic" or "inorganic."** All 118 elements are physical chemical elements of the Periodic Table—a carbon atom in calcium carbonate ($\\text{CaCO}_3$) is physically identical to a carbon atom in glucose ($\\text{C}_6\\text{H}_{12}\\text{O}_6$). As demonstrated by **Wöhler's synthesis (1828)** of urea from inorganic ammonium cyanate, the distinction lies in **chemical structure and bonding**, not in different "types" of atoms.

---

#### 1. Elements Associated with Organic vs. Inorganic Chemistry
| Feature | Elements in Organic Chemistry | Elements in Inorganic Chemistry |
|:---|:---|:---|
| **Scope of Periodic Table** | Centered overwhelmingly on a **small set of non-metals** ($\\approx 6\\text{–}10$ core elements) | Encompasses **all 118 elements** (metals, metalloids, non-metals, noble gases, lanthanoids, actinoids) |
| **Primary Backbone Element** | **Carbon ($\\text{C}$)** via catenation ($\\text{C-C}$ chains/rings) + covalent $\\text{C-H}$ bonds | Diverse central atoms (alkali/alkaline earth metals, $d$/$f$-block metals, $\\text{Si}, \\text{P}, \\text{S}, \\text{B}$, halogens) |
| **Common Accompanying Elements** | $\\text{H}, \\text{O}, \\text{N}$ plus heteroatoms $\\text{S}, \\text{P}, \\text{F}, \\text{Cl}, \\text{Br}, \\text{I}$ (and metals in organometallics) | Every group of the periodic table, forming oxides, halides, sulfates, silicates, coordination complexes |
| **Typical Bonding & Hybridisation** | Predominantly **directional covalent** bonds ($sp^3, sp^2, sp$) | **Ionic, metallic, covalent, and coordinate ($d$-orbital)** bonding ($dsp^2, sp^3d^2$, etc.) |

---

#### 2. Key Differences Between Organic and Inorganic Compounds
| Property | Organic Compounds | Inorganic Compounds |
|:---|:---|:---|
| **Chemical Definition** | Carbon compounds containing $\\text{C-H}$ bonds or hydrocarbon frameworks | Compounds of all other elements plus **inorganic carbon exceptions** ($\\text{CO}, \\text{CO}_2, \\text{CO}_3^{2-}, \\text{HCO}_3^-, \\text{CN}^-, \\text{CaC}_2$) |
| **Dominant Bonding** | Almost always **covalent** ($\\sigma$ and $\\pi$ shared electron pairs) | Commonly **ionic** ($\\text{NaCl}$), **metallic**, or **coordinate covalent** ($[\\text{Fe(CN)}_6]^{4-}$) |
| **Melting & Boiling Points** | Generally **low** (weak intermolecular forces: London, dipole-dipole, $\\text{H}$-bonding) | Generally **high** (strong electrostatic lattice forces in ionic solids / metallic lattices) |
| **Solubility** | Mostly soluble in **non-polar / organic solvents** (ether, benzene, $\\text{CHCl}_3$); insoluble in water unless polar/$\\text{H}$-bonding (e.g. ethanol) | Mostly soluble in **polar solvents** like water ($\\text{H}_2\\text{O}$); largely insoluble in non-polar solvents |
| **Electrical Conductivity** | Generally **non-conductors** (non-electrolytes), except organic acids/salts in water | **Good conductors** in molten state or aqueous solution (strong electrolytes) |
| **Reaction Rate & Nature** | **Slow, molecular** reactions requiring activation energy; often give side products | **Fast, nearly instantaneous ionic** reactions in aqueous solution |
| **Isomerism** | Very **widespread** (structural + stereoisomerism due to tetravalence & directional covalent bonds) | **Less common**, mainly seen in **coordination complexes** (geometrical, optical, linkage) |
| **Thermal Stability / Combustion** | Typically **combustible** and decompose at lower temperatures ($< 400^\\circ\\text{C}$) | Mostly **non-combustible** and thermally stable to high temperatures |

---

#### Legitimate Sources & Key Exam Exceptions:
* **Carbon Inorganic Exceptions (IUPAC Red Book):** Elemental carbon allotropes (diamond, graphite), oxides ($\\text{CO}, \\text{CO}_2$), carbonates ($\\text{CaCO}_3$), bicarbonates, carbides ($\\text{CaC}_2$), and simple cyanides ($\\text{NaCN}$) are classified as **inorganic** by convention, whereas urea ($\\text{NH}_2\\text{CONH}_2$), $\\text{CCl}_4$, and $\\text{CH}_4$ are **organic**.
* **Organometallic Bridge:** Compounds with direct metal–carbon bonds (e.g. Grignard $\\text{R-MgX}$, ferrocene, $\\text{Ni(CO)}_4$) sit at the interface of both disciplines.
* **Authoritative Sources:** **IUPAC Compendium of Chemical Terminology (Gold Book)**; **IUPAC Nomenclature of Inorganic Chemistry (Red Book)**; **NCERT Class XI & XII Chemistry**.`
  },
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
  $$\\chemfig{H_3C-[1]CH=CH_2} + \\ce{H-Br} \\longrightarrow \\chemfig{H_3C-[1]CH(-[2]Br)-[7]CH_3}$$
* **Mechanistic Basis:** Electrophilic attack by $\\text{H}^+$ forms the more substituted (more stable) secondary carbocation ($2^\\circ$ stabilized by 6 hyperconjugative $\\alpha$-hydrogens) rather than a primary carbocation ($1^\\circ$, only 2 $\\alpha$-hydrogens).
* **Rearrangements:** Because a discrete carbocation is formed, rearrangements (1,2-hydride or methyl shifts) can occur if a more stable $3^\\circ$ carbocation is accessible!

---

#### 2. Anti-Markovnikov's Rule (Peroxide / Kharasch Effect)
* **Conditions:** Specific to **$\\text{HBr}$ only** in the presence of organic peroxides ($\\text{R-O-O-R}$ or benzoyl peroxide) under light or heat:
  $$\\chemfig{H_3C-[1]CH=CH_2} + \\ce{HBr} \\xrightarrow{\\text{Peroxide (R}_2\\text{O}_2\\text{)}} \\chemfig{H_3C-[1]CH_2-[7]CH_2-[1]Br}$$
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
* **Reaction Scheme (Ethanal $\\to$ Crotonaldehyde):**
  $$2\\chemfig{H_3C-C(=[2]O)-H} \\xrightarrow{\\text{dil. } \\ce{NaOH},\\ \\Delta} \\chemfig{H_3C-[1]CH=[7]CH-[1]C(=[2]O)-[7]H} + \\ce{H2O}$$
* **Mechanism:**
  1. Enolate generation by $\\alpha$-deprotonation:
     $$\\text{CH}_3\\text{CHO} + \\text{OH}^- \\rightleftharpoons [\\bar{\\text{C}}\\text{H}_2-\\text{CHO} \\leftrightarrow \\text{CH}_2=\\text{CH}-\\text{O}^-] + \\text{H}_2\\text{O}$$
  2. Nucleophilic addition of enolate to another carbonyl molecule:
     $$\\bar{\\text{C}}\\text{H}_2\\text{CHO} + \\text{CH}_3\\text{CHO} \\longrightarrow \\text{CH}_3-\\text{CH(O}^-)-\\text{CH}_2-\\text{CHO}$$
  3. Protonation yields $\\beta$-hydroxy aldehyde (Aldol), which undergoes E1cB dehydration upon heating to conjugated crotonaldehyde.

---

#### 2. Cannizzaro Reaction (Self-Redox Disproportionation)
* **Requirement:** Aldehydes with **NO $\\alpha$-hydrogens** (e.g., Formaldehyde $\\text{HCHO}$, Benzaldehyde $\\text{C}_6\\text{H}_5\\text{CHO}$, Trimethylacetaldehyde $\\text{(CH}_3)_3\\text{C-CHO}$).
* **Reagent:** Concentrated alkali ($50\\%\\text{ NaOH}$ or $\\text{KOH}$).
* **Reaction (2 Benzaldehyde $\\to$ Benzyl alcohol + Benzoate):**
  $$2\\chemfig{*6(=-=-(-CHO)=-)} \\xrightarrow{50\\%\\ \\ce{KOH}} \\chemfig{*6(=-=-(-CH_2OH)=-)} + \\chemfig{*6(=-=-(-COO^-K^+)=-)}$$
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
| **6** | $sp^3d^2$ | 6 | 0 | **Octahedral** | $90^\\circ$ | $\\text{SF}_6, \\text{PF}_6^-, [\\text{FeF}_6]^{3-}$ |
| **6** | $sp^3d^2$ | 5 | 1 | **Square Pyramidal** | $< 90^\\circ$ | $\\text{BrF}_5, \\text{IF}_5, \\text{XeOF}_4$ |
| **6** | $sp^3d^2$ | 4 | 2 | **Square Planar** | $90^\\circ$ | $\\text{XeF}_4, \\text{ICl}_4^-$ |

> **Exam Note (VSEPR vs Coordination Hybridisation):** $\\ce{[Fe(CN)6]^{3-}}$ is an **inner-orbital ($d^2sp^3$)** octahedral complex, while $d^8$ complexes such as $\\ce{[PtCl4]^{2-}}$ and $\\ce{[Ni(CN)4]^{2-}}$ are **SN = 4 ($dsp^2$)** square planar — not $sp^3d^2$.`
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
  },
  {
    patterns: [/\bthermodynamic|enthalpy|entropy|\bgibbs\b|hess'?s?\s+law|first\s+law|reversible\s+expansion/i],
    title: "Chemical Thermodynamics: IUPAC Sign Conventions, Work & Spontaneity",
    content: `### ✦ Chemical Thermodynamics (IUPAC Sign Conventions & Core Laws)

---

#### 1. First Law & Work (Strict IUPAC Sign Convention)
$$\\Delta U = q + w$$
* **$q > 0$**: Heat absorbed *by* the system | **$w > 0$**: Work done *on* the system (compression)
* **Irreversible Work:** $w_{\\text{irrev}} = -P_{\\text{ext}}\\Delta V$
* **Isothermal Reversible Ideal Gas Expansion ($\\Delta U = 0$):**
  $$w_{\\text{rev}} = -nRT \\ln\\left(\\frac{V_2}{V_1}\\right) = -2.303\\,nRT\\log_{10}\\left(\\frac{P_1}{P_2}\\right), \\quad q = -w_{\\text{rev}}$$
* **Enthalpy–Internal Energy Relation:**
  $$\\Delta H = \\Delta U + \\Delta n_g RT \\quad (\\Delta n_g = n_{\\text{g,products}} - n_{\\text{g,reactants}},\\text{ gases ONLY})$$

---

#### 2. Second Law, Gibbs Free Energy & Equilibrium
$$\\Delta G = \\Delta H - T\\Delta S$$
$$\\Delta G^\\circ = -RT \\ln K = -2.303\\,RT\\log_{10} K = -nFE^\\circ_{\\text{cell}}$$

| $\\Delta H$ | $\\Delta S$ | Spontaneity ($\\Delta G < 0$) |
|:---:|:---:|:---|
| **$-\\ (\\text{exothermic})$** | **$+$** | Spontaneous at **all temperatures** |
| **$+\\ (\\text{endothermic})$** | **$-$** | Non-spontaneous at **all temperatures** |
| **$-\\ (\\text{exothermic})$** | **$-$** | Spontaneous at **low $T$** ($T < \\Delta H / \\Delta S$) |
| **$+\\ (\\text{endothermic})$** | **$+$** | Spontaneous at **high $T$** ($T > \\Delta H / \\Delta S$) |

* **Exam Trap:** $E^\\circ$ is an **intensive** property, whereas $\\Delta G^\\circ$ is **extensive**. Never add two half-cell $E^\\circ$ values directly — always combine via $\\Delta G^\\circ_3 = \\Delta G^\\circ_1 + \\Delta G^\\circ_2 \\implies n_3 E^\\circ_3 = n_1 E^\\circ_1 + n_2 E^\\circ_2$.`
  },
  {
    patterns: [/\bionic\s+equilib|\bchemical\s+equilib|\bbuffer\b|\bhenderson|\bsolubility\s+product|\bksp\b|\bcommon\s+ion|\bostwald|\ble\s+chatelier|\bph\b\s+of\b/i],
    title: "Chemical & Ionic Equilibrium: Dilute pH Traps, Buffers & Ksp",
    content: `### ✦ Chemical & Ionic Equilibrium: Core Laws & Exam Traps

---

#### 1. Dilute Strong Acid pH Trap (Water Auto-Ionisation)
* **Critical Trap:** What is the pH of $10^{-8}\\text{ M } \\ce{HCl}$ at $298\\text{ K}$? **NEVER answer 8!** An aqueous acid solution cannot be basic ($\text{pH} < 7$).
* Include $\\ce{H2O}$ auto-ionisation ($K_w = 1.0 \\times 10^{-14}$ at $298\\text{ K}$):
  $$[\\text{H}^+] = 10^{-8} + [\\text{OH}^-] \\implies [\\text{H}^+]^2 - 10^{-8}[\\text{H}^+] - 10^{-14} = 0$$
  $$[\\text{H}^+] \\approx 1.05 \\times 10^{-7}\\text{ M} \\implies \\text{pH} \\approx \\mathbf{6.98}$$

---

#### 2. Weak Electrolytes, Buffers & Solubility Product
* **Ostwald Dilution Law:** $K_a = \\frac{C\\alpha^2}{1 - \\alpha}$. Use $[\\text{H}^+] \\approx \\sqrt{K_a C}$ **only** when $\\alpha < 0.05$ ($5\\%$); otherwise solve $C\\alpha^2 + K_a\\alpha - K_a = 0$.
* **Henderson–Hasselbalch Equation:**
  $$\\text{Acidic Buffer: } \\text{pH} = \\text{p}K_a + \\log_{10}\\frac{[\\text{A}^-]}{[\\text{HA}]}, \\qquad \\text{Basic Buffer: } \\text{pOH} = \\text{p}K_b + \\log_{10}\\frac{[\\text{BH}^+]}{[\\text{B}]}$$
* **Amphiprotic Salt ($\\ce{NaHCO3}, \\ce{NaHS}$):** $\\text{pH} \\approx \\frac{1}{2}(\\text{p}K_{a1} + \\text{p}K_{a2})$.
* **Solubility Product ($\\ce{A_x B_y(s) <=> xA^{y+} + yB^{x-}}$):**
  $$K_{sp} = x^x y^y S^{x+y}$$

---

#### 3. $K_p$ vs $K_c$ & Le Chatelier Inert Gas Trap
* $K_p = K_c(RT)^{\\Delta n_g}$ (include gaseous species only; pure solids/liquids have unit activity).
* **Inert Gas Addition at Constant Volume:** **No shift** in equilibrium (partial pressures of reacting gases stay unchanged).
* **Inert Gas Addition at Constant Pressure:** Total volume increases $\\implies$ shifts toward the side with **more moles of gas** ($\\Delta n_g > 0$).`
  },
  {
    patterns: [/\belectrophilic aromatic|\beas\b|\bbenzene\b|\bnaphthalene\b|\bphenol\b|\baniline\b|\bnitration\b|\bfriedel[- ]crafts\b|\bdirecting (?:group|effect)/i],
    title: "Benzene, Electrophilic Aromatic Substitution (EAS) & Directing Effects",
    content: `### ✦ Electrophilic Aromatic Substitution (EAS) & Aromatic Ring 2D Gallery

**Benzene** ($\\text{C}_6\\text{H}_6$, $6\\pi$ electrons) resists addition and instead undergoes **Electrophilic Aromatic Substitution** through a resonance-stabilised arenium ($\\sigma$-complex) intermediate to preserve its $\\approx 150\\text{ kJ mol}^{-1}$ aromatic stabilisation energy.

$$\\chemfig{*6(=-=-=-)} + \\ce{E+} \\longrightarrow [\\text{Arenium } \\sigma\\text{-complex}]^+ \\xrightarrow{-\\ce{H+}} \\chemfig{*6(=-=-(-E)=-)}$$

---

#### 1. Flagship EAS Reactions of Benzene
* **Nitration ($\\ce{NO2+}$ electrophile):**
  $$\\chemfig{*6(=-=-=-)} + \\ce{HNO3} \\xrightarrow{\\text{Conc. } \\ce{H2SO4},\\ 323\\text{ K}} \\chemfig{*6(=-=-(-NO_2)=-)} + \\ce{H2O}$$
* **Friedel–Crafts Acylation (No Carbocation Rearrangement):**
  $$\\chemfig{*6(=-=-=-)} + \\ce{CH3COCl} \\xrightarrow{\\text{Anhy. } \\ce{AlCl3}} \\chemfig{*6(=-=-(-C(=[2]O)-CH_3)=-)} + \\ce{HCl}$$

---

#### 2. Key Substituted Arenes & Ring Directing Rules
| Substituent | Electronic Effect | Ring Reactivity | Orientation | Classic Trap |
|:---|:---|:---|:---|:---|
| $-\\text{OH}, -\\text{NH}_2, -\\text{OR}$ | $+M > -I$ | **Strongly Activating** | ***ortho / para*** | Direct nitration of aniline forms $-\\text{NH}_3^+$ $\\implies 47\\%$ ***meta*** |
| $-\\text{Cl}, -\\text{Br}, -\\text{I}$ | $-I > +M$ | **Weakly Deactivating** | ***ortho / para*** | $-I$ controls rate, whereas $+M$ resonance controls orientation |
| $-\\text{NO}_2, -\\text{CHO}, -\\text{COOH}$ | $-M, -I$ | **Strongly Deactivating** | ***meta*** | Nitrobenzene **does NOT** undergo Friedel–Crafts reactions |

$$\\chemfig{*6(=-=-(-OH)=-)} \\qquad \\chemfig{*6(=-=-(-NH_2)=-)} \\qquad \\chemfig{*6(=-*6(-=-=-)=-=)}$$

* **Aniline & Phenol Friedel–Crafts Trap:** Aniline complexes directly with Lewis acid $\\ce{AlCl3}$ ($\\ce{C6H5NH2+ AlCl3-}$), arresting reaction completely; phenol similarly coordinates with $\\ce{AlCl3}$.`
  },
  {
    patterns: [/\baromatic|\bhuckel|\bantiaromatic|\bortho\s+effect|\bsir\b|\bbasicity\s+of\s+(?:[a-z]*amines?|aniline)|\bacidic\s+strength|\bcarbocation\s+stability|\bbredt'?s?\s+rule|\b(?:methyl|ethyl)?amines?\b.*\bbasic(?:ity)?\b/i],
    title: "General Organic Chemistry (GOC): Aromaticity, Acidity & Basicity",
    content: `### ✦ Core GOC: Electronic Effects, Aromaticity & Structural Traps

---

#### 1. Hückel Aromaticity Rules (Planar, Cyclic, Fully Conjugated)
$$\\chemfig{*6(=-=-=-)} \\qquad \\chemfig{*6(=-*6(-=-=-)=-=)} \\qquad \\chemfig{*6(=-N=-=)}$$

* **Aromatic ($4n + 2$ $\\pi$ electrons):** Extraordinarily stabilised (e.g. Benzene $6\\pi$, Naphthalene $10\\pi$, Cyclopropenyl cation $2\\pi$, Tropylium cation $6\\pi$, Cyclopentadienyl anion $6\\pi$).
* **Antiaromatic ($4n$ $\\pi$ electrons, planar):** Strongly destabilised (e.g. Cyclobutadiene $4\\pi$, Cyclopentadienyl cation $4\\pi$).
* **Non-Aromatic Trap:** Cyclooctatetraene ($\\text{COT}$, $8\\pi$) escapes antiaromaticity by puckering into a **non-planar tub shape**, making it **non-aromatic**!

---

#### 2. Aqueous vs Gas-Phase Amine Basicity (NCERT XII)
* **Gas Phase (Pure $+I$ Inductive Effect):** $3^\\circ > 2^\\circ > 1^\\circ > \\ce{NH3}$
* **Aqueous Phase (Solvation $\\text{H}$-bonding + $+I$ + Steric Hindrance):**
  * Ethylamines: $\\ce{(C2H5)2NH}\\ (2^\\circ) > \\ce{(C2H5)3N}\\ (3^\\circ) > \\ce{C2H5NH2}\\ (1^\\circ) > \\ce{NH3}$
  * Methylamines: $\\ce{(CH3)2NH}\\ (2^\\circ) > \\ce{CH3NH2}\\ (1^\\circ) > \\ce{(CH3)3N}\\ (3^\\circ) > \\ce{NH3}$

---

#### 3. Ortho-Effect, SIR & Bredt's Rule
* **Ortho-Effect in Benzoic Acids:** Nearly all *ortho*-substituted benzoic acids are **stronger acids** than benzoic acid (irrespective of $+I/+M$ or $-I/-M$) because steric twist of $-\\text{COOH}$ out of the ring plane suppresses cross-conjugation in the acid and improves resonance/solvation of $-\\text{COO}^-$.
* **SIR (Steric Inhibition of Resonance):** Bulky *ortho* groups twist $-\\text{NO}_2$ or $-\\text{NR}_2$ out of plane (e.g. $N,N$-dimethyl-2,6-dimethylaniline is far **more basic** than $N,N$-dimethylaniline because the $\\text{N}$ lone pair cannot delocalise into the ring).
* **Bredt's Rule:** Double bonds or planar $sp^2$ carbocations cannot stably form at bridgehead positions of small bridged bicyclic systems (like bicyclo[2.2.1]heptane).`
  },
  {
    patterns: [/\bmot\b|\bmolecular\s+orbital|\bbond\s+order|\bback[- ]bonding|\b(?:bf3|bcl3|bbr3)\b|\bdrago'?s?\s+rule|\bbent'?s?\s+rule|\boxoacids?\s+of\s+phosphorus|\bh3po[234]\b|\bcro5\b|\binert\s+pair/i],
    title: "Inorganic Core Principles: MOT, Back-Bonding & Periodic Anomalies",
    content: `### ✦ Core Inorganic Principles & Exam Anomalies (NCERT & IUPAC)

---

#### 1. Molecular Orbital Theory (MOT) — $s$–$p$ Mixing Crossover
* **Up to $14\\ e^-$ ($\\ce{B2, C2, N2}$):** $s$–$p$ mixing pushes $\\sigma_{2p_z}$ **above** $\\pi_{2p_x} = \\pi_{2p_y}$:
  $$\\sigma_{1s} < \\sigma^*_{1s} < \\sigma_{2s} < \\sigma^*_{2s} < (\\pi_{2p_x} = \\pi_{2p_y}) < \\sigma_{2p_z} < (\\pi^*_{2p_x} = \\pi^*_{2p_y}) < \\sigma^*_{2p_z}$$
  * **Trap:** $\\ce{B2}$ ($10\\ e^-$) is **paramagnetic** ($n=2$ in $\\pi_{2p}^1\\pi_{2p}^1$), whereas $\\ce{C2}$ ($12\\ e^-$) is **diamagnetic** with a double bond consisting of **two $\\pi$ bonds** and zero $\\sigma_{2p}$ bond!
* **From $15\\ e^-$ onward ($\\ce{O2, F2, Ne2}$):** Negligible $s$–$p$ mixing $\\implies \\sigma_{2p_z} < (\\pi_{2p_x} = \\pi_{2p_y})$. $\\ce{O2}$ ($16\\ e^-$) has $\\text{Bond Order} = 2$ and $n = 2$ unpaired electrons in $\\pi^*_{2p}$ (**paramagnetic**).

---

#### 2. Back-Bonding, Bent's Rule & Drago's Rule
* **Boron Halide Lewis Acidity:** $\\ce{BF3 < BCl3 < BBr3 < BI3}$ (NOT $\\ce{BF3}$ strongest!). Efficient $2p\\text{–}2p$ $\\pi$-back-bonding from $\\ce{F}$ into vacant $\\text{B}(2p)$ strongly reduces $\\text{BF}_3$'s electron deficiency.
* **Trisilylamine vs Trimethylamine:** $\\ce{N(SiH3)3}$ is **trigonal planar ($sp^2$)** due to $2p\\pi\\text{–}3d\\pi$ back-bonding into empty $\\text{Si}(3d)$ orbitals, whereas $\\ce{N(CH3)3}$ is **pyramidal ($sp^3$)**.
* **Bent's Rule:** More electronegative substituents prefer orbitals with **lower $s$-character** (hence axial $\\text{P–Cl}$ bonds in $\\ce{PCl5}$ are longer and weaker than equatorial $\\text{P–Cl}$ bonds).
* **Drago's Rule:** Heavy $p$-block hydrides with central electronegativity $\\le 2.5$ ($\\ce{PH3, AsH3, H2S, H2Se}$) show negligible $s$–$p$ hybridisation and bond angles near **$90^\\circ$** ($\\approx 92^\\circ\\text{–}93.6^\\circ$).

---

#### 3. High-Yield Oxidation State & Oxoacid Traps
* **$\\ce{CrO5}$ (Chromium Pentoxide):** Butterfly structure with **two peroxo ($\\text{-O-O-}$) linkages** ($4 \\times -1$) + one oxo ($-2$) $\\implies$ $\\mathbf{\\ce{Cr} = +6}$ (NOT $+10$!).
* **Oxoacids of Phosphorus:** Basicity equals the count of ionisable **$\\text{P–OH}$** groups:
  * $\\ce{H3PO2}$ (hypophosphorous): $1\\ \\text{P–OH}, 2\\ \\text{P–H} \\implies$ **monobasic**, strong reducing agent.
  * $\\ce{H3PO3}$ (phosphorous): $2\\ \\text{P–OH}, 1\\ \\text{P–H} \\implies$ **dibasic**.
  * $\\ce{H3PO4}$ (phosphoric): $3\\ \\text{P–OH} \\implies$ **tribasic**.
* **Inert Pair Effect (Groups 13–15):** Lower oxidation states become progressively more stable down the group ($\\ce{Tl+ > Tl^{3+}}$, $\\ce{Pb^{2+} > Pb^{4+}}$, $\\ce{Bi^{3+} > Bi^{5+}}$), making $\\ce{PbO2}$ and $\\ce{NaBiO3}$ powerful **oxidising agents**.`
  }
];

function generateChemistryFallback(query) {
  const lower = query.toLowerCase();

  for (const topic of TOPICS) {
    if (topic.patterns.some((p) => p.test(lower))) {
      return {
        answer: `${topic.content}\n\n---\n*✦ Answered with full NCERT/JEE precision via Nemo's Autonomous Knowledge Core.*`,
        title: topic.title,
        badge: "Autonomous Core",
        matched: true
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
   * **Electronic Configurations & Periodic Trends:** Reactivity is driven by effective nuclear charge ($Z_{\\text{eff}}$), shielding/screening effects ($\\sigma$), and achieving stable half-filled or fully filled valence subshells ($d^5, d^{10}, p^6$).

3. **Problem-Solving Framework:**
   * **Identify the Reaction / System Class:** Organic functional group, aqueous ionic equilibrium, coordination complex, or gas-phase thermodynamic system.
   * **List Given Quantities & Target Variable:** Convert all temperatures to Kelvin ($T = \\theta + 273.15$), check pressure units ($1\\text{ atm} = 101.325\\text{ kPa} = 760\\text{ mmHg}$), and identify the limiting reagent.
   * **Eliminate Common Traps:** Beware of temperature-dependent $K_w$, solvent polarity effects, and carbocation rearrangement possibilities!

---
*✦ Answered via Nemo's Autonomous Chemistry Core. For live generative reasoning, ensure GEMINI_API_KEY is attached in Settings > Secrets.*`,
    title: "Chemistry Solution",
    badge: "Autonomous Core",
    matched: false
  };
}

module.exports = {
  generateChemistryFallback
};
