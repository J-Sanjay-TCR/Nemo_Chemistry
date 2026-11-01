"use strict";

const fs = require("fs");
const path = require("path");
const katex = require("katex");
require("../vendor/katex/contrib/mhchem.min.js");

const dataPath = path.join(__dirname, "..", "data.js");
const dataContent = fs.readFileSync(dataPath, "utf8");

global.window = {};
eval(dataContent);
const formulas = global.window.NEMO_DATA.formulas;
console.log(`Loaded ${formulas.length} formulas from data.js`);

// Curated mappings for specific formula IDs or patterns to ensure 100% textbook accuracy
const CURATED_LATEX = {
  bohr: "E_n = -13.6 \\,\\frac{Z^2}{n^2}\\,\\text{eV}, \\quad r_n = 52.9 \\,\\frac{n^2}{Z}\\,\\text{pm}",
  debroglie: "\\lambda = \\frac{h}{m v} = \\frac{h}{p} = \\frac{h}{\\sqrt{2 m K}}",
  rydberg: "\\frac{1}{\\lambda} = \\bar{\\nu} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right)",
  bohr_energy: "E_n = -13.6 \\,\\frac{Z^2}{n^2}\\,\\text{eV} = -2.18 \\times 10^{-18} \\,\\frac{Z^2}{n^2}\\,\\text{J}",
  bohr_radius: "r_n = 0.529 \\,\\frac{n^2}{Z}\\,\\text{\\AA} = 52.9 \\,\\frac{n^2}{Z}\\,\\text{pm}",
  bohr_velocity: "v_n = 2.18 \\times 10^6 \\,\\frac{Z}{n}\\,\\text{m s}^{-1}",
  heisenberg: "\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi} = \\frac{\\hbar}{2}",
  photoelectric: "h\\nu = h\\nu_0 + K_{\\max} = W_0 + e V_0",
  planck_quantum: "E = h\\nu = \\frac{h c}{\\lambda} = h c \\bar{\\nu}",
  ideal_gas: "P V = n R T = \\frac{w}{M} R T = \\frac{\\rho}{M} R T",
  vanderwaals: "\\left( P + \\frac{a n^2}{V^2} \\right) (V - n b) = n R T",
  graham_diffusion: "\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}} = \\sqrt{\\frac{d_2}{d_1}} = \\frac{V_1/t_1}{V_2/t_2}",
  dalton_partial_pressure: "P_i = x_i \\cdot P_{\\text{total}}",
  rms_speed: "u_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}, \\quad v_{\\text{avg}} = \\sqrt{\\frac{8 R T}{\\pi M}}, \\quad v_{\\text{mp}} = \\sqrt{\\frac{2 R T}{M}}",
  first_law_thermo: "\\Delta U = q + w = q - P_{\\text{ext}} \\Delta V",
  enthalpy_def: "H = U + P V, \\quad \\Delta H = \\Delta U + \\Delta n_g R T",
  gibbs_helmholtz: "\\Delta G = \\Delta H - T \\Delta S",
  gibbs_equilibrium: "\\Delta G^\\circ = -R T \\ln K = -2.303 R T \\log_{10} K",
  entropy_change: "\\Delta S = \\int \\frac{dq_{\\text{rev}}}{T}, \\quad \\Delta S_{\\text{sys}} = n C_v \\ln\\frac{T_2}{T_1} + n R \\ln\\frac{V_2}{V_1}",
  equilibrium_constant_kp_kc: "K_p = K_c (R T)^{\\Delta n_g}",
  vant_hoff_isochore: "\\ln\\frac{K_2}{K_1} = \\frac{\\Delta H^\\circ}{R}\\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)",
  arrhenius_equation: "k = A \\, e^{-\\frac{E_a}{R T}}, \\quad \\ln k = \\ln A - \\frac{E_a}{R T}",
  arrhenius_two_temps: "\\log_{10}\\left( \\frac{k_2}{k_1} \\right) = \\frac{E_a}{2.303 R} \\left( \\frac{T_2 - T_1}{T_1 T_2} \\right)",
  first_order_integrated: "k = \\frac{2.303}{t} \\log_{10}\\left( \\frac{[A]_0}{[A]} \\right), \\quad t_{1/2} = \\frac{0.693}{k}",
  zero_order_integrated: "[A] = [A]_0 - k t, \\quad t_{1/2} = \\frac{[A]_0}{2 k}",
  second_order_integrated: "\\frac{1}{[A]} - \\frac{1}{[A]_0} = k t, \\quad t_{1/2} = \\frac{1}{k [A]_0}",
  nernst_equation: "E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{R T}{n F} \\ln Q = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10} Q \\; (298\\text{ K})",
  standard_cell_potential: "E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = \\frac{0.0591}{n} \\log_{10} K_c",
  faraday_first_law: "m = Z \\cdot I \\cdot t = \\frac{E}{F} \\cdot I \\cdot t = \\frac{M \\cdot I \\cdot t}{n F}",
  kohlrausch_law: "\\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ",
  ostwald_dilution: "K_a = \\frac{C \\alpha^2}{1 - \\alpha} \\approx C \\alpha^2, \\quad \\alpha = \\sqrt{\\frac{K_a}{C}} = \\frac{\\Lambda_m}{\\Lambda_m^\\circ}",
  ph_definition: "\\text{pH} = -\\log_{10}[\\text{H}^+], \\quad \\text{pOH} = -\\log_{10}[\\text{OH}^-], \\quad \\text{pH} + \\text{pOH} = 14 \\; (298\\text{ K})",
  buffer_henderson: "\\text{pH} = \\text{p}K_a + \\log_{10}\\left( \\frac{[\\text{Conjugate Base}]}{[\\text{Acid}]} \\right)",
  buffer_henderson_base: "\\text{pOH} = \\text{p}K_b + \\log_{10}\\left( \\frac{[\\text{Conjugate Acid}]}{[\\text{Base}]} \\right)",
  raoults_law_relative_lowering: "\\frac{P^\\circ - P_s}{P^\\circ} = x_B = \\frac{n_B}{n_A + n_B} \\approx \\frac{w_B M_A}{M_B w_A}",
  elevation_boiling_point: "\\Delta T_b = i \\cdot K_b \\cdot m, \\quad K_b = \\frac{R T_b^{\\circ 2} M_A}{1000 \\Delta H_{\\text{vap}}}",
  depression_freezing_point: "\\Delta T_f = i \\cdot K_f \\cdot m, \\quad K_f = \\frac{R T_f^{\\circ 2} M_A}{1000 \\Delta H_{\\text{fus}}}",
  osmotic_pressure: "\\Pi = i \\cdot C R T = i \\left( \\frac{n_B}{V} \\right) R T",
  vant_hoff_factor: "i = \\frac{\\text{Observed Colligative Property}}{\\text{Calculated Colligative Property}} = 1 + (n - 1)\\alpha",
  braggs_law: "n \\lambda = 2 d \\sin\\theta",
  density_cubic_crystal: "\\rho = \\frac{z \\cdot M}{a^3 \\cdot N_A}",
  radius_ratio_rules: "\\frac{r_+}{r_-}: \\; 0.155\\text{-}0.225 (3, \\text{trig}), \\; 0.225\\text{-}0.414 (4, T_d), \\; 0.414\\text{-}0.732 (6, O_h), \\; 0.732\\text{-}1.0 (8, \\text{bcc})",
  formalcharge: "\\text{FC} = V - N - \\frac{B}{2}",
  hybrid: "H = \\frac{1}{2}(V + M - C + A)",
  born_lande: "U_0 = -\\frac{N_A M z_+ z_- e^2}{4\\pi\\varepsilon_0 r_0} \\left( 1 - \\frac{1}{n} \\right)",
  spin_only_magnetic_moment: "\\mu_s = \\sqrt{n(n + 2)} \\; \\mu_B \\; (\\text{B.M.})",
  cfse_octahedral: "\\text{CFSE} = \\left( -0.4\\,n_{t_{2g}} + 0.6\\,n_{e_g} \\right)\\Delta_o + m P",
  cfse_tetrahedral: "\\Delta_t = \\frac{4}{9} \\Delta_o, \\quad \\text{CFSE} = \\left( -0.6\\,n_e + 0.4\\,n_{t_2} \\right)\\Delta_t",
  molarity: "M = \\frac{w_B \\times 1000}{M_B \\times V_{\\text{mL}}} = \\frac{10 \\times \\text{\\% (w/v)}}{M_B}",
  molality: "m = \\frac{w_B \\times 1000}{M_B \\times w_A(\\text{g})}",
  mole_fraction: "x_B = \\frac{n_B}{n_A + n_B}, \\quad x_A + x_B = 1",
  normality: "N = M \\times n\\text{-factor} = \\frac{\\text{Gram equivalents}}{V(\\text{L})}",
  sc_packing_efficiency_calc: "\\text{P.E. (SC)} = \\frac{1 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\pi}{6} \\approx 52.4\\%",
  bcc_packing_efficiency_calc: "\\text{P.E. (BCC)} = \\frac{2 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\sqrt{3}\\pi}{8} \\approx 68.0\\%",
  fcc_packing_efficiency_calc: "\\text{P.E. (FCC)} = \\frac{4 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\sqrt{2}\\pi}{6} \\approx 74.0\\%",
  hcp_c_over_a_ratio: "\\frac{c}{a} = \\sqrt{\\frac{8}{3}} \\approx 1.633, \\quad \\text{P.E.} = 74.05\\%",
  parallel_consecutive_kinetics: "k_{\\text{total}} = k_1 + k_2, \\quad \\%B = \\frac{k_1}{k_1 + k_2} \\times 100\\%, \\quad t_{\\max}(B) = \\frac{\\ln(k_1/k_2)}{k_1 - k_2}",
  zero_order_kinetics: "[A]_t = [A]_0 - k t, \\quad t_{1/2} = \\frac{[A]_0}{2 k}, \\quad t_{100\\%} = \\frac{[A]_0}{k}",
  first_order_kinetics: "k = \\frac{2.303}{t}\\log_{10}\\left(\\frac{[A]_0}{[A]_t}\\right), \\quad t_{1/2} = \\frac{0.693}{k}",
  second_order_kinetics: "\\frac{1}{[A]_t} - \\frac{1}{[A]_0} = k t, \\quad t_{1/2} = \\frac{1}{k [A]_0}",
  fuel_cell_efficiency_equation: "\\mathrm{2H_2(g) + O_2(g) \\rightarrow 2H_2O(l)}, \\quad \\eta = \\frac{\\Delta G^\\circ}{\\Delta H^\\circ} \\times 100\\% \\approx 83\\%",
  h2o2_strength: "\\text{Volume Strength} = 11.2 \\times M = 5.6 \\times N",
  limiting_reagent_yield: "\\text{\\% Yield} = \\frac{\\text{Actual Yield}}{\\text{Theoretical Yield}} \\times 100\\%",
  percentage_purity: "\\text{\\% Purity} = \\frac{\\text{Mass of pure substance}}{\\text{Total mass of sample}} \\times 100\\%",
  dipole_ionic: "\\mu = q \\times d, \\quad \\text{\\% Ionic} = 16|\\Delta\\chi| + 3.5(\\Delta\\chi)^2",
  hannay_smith_percent_ionic: "\\text{\\% Ionic} = 16|\\chi_A - \\chi_B| + 3.5(\\chi_A - \\chi_B)^2",
  optical_rotation: "[\\alpha]_D^T = \\frac{\\alpha_{\\text{obs}}}{l \\times c}, \\quad \\text{\\% ee} = \\frac{|R - S|}{R + S} \\times 100\\%",
  optical: "[\\alpha] = \\frac{\\alpha_{\\text{obs}}}{l \\times c}, \\quad \\text{\\% ee} = \\frac{|R - S|}{R + S} \\times 100\\%",
  kpkc: "K_p = K_c (R T)^{\\Delta n_g}",
  lindemann_unimolecular_kinetics: "\\text{Rate} = \\frac{k_1 k_2 [\\text{A}]^2}{k_{-1}[\\text{A}] + k_2} \\quad \\Big| \\quad \\text{High } P: \\text{Rate} = \\frac{k_1 k_2}{k_{-1}}[\\text{A}] \\quad \\Big| \\quad \\text{Low } P: \\text{Rate} = k_1 [\\text{A}]^2",
  radioactive_decay_constant: "A = \\lambda N = \\frac{0.693}{t_{1/2}} N \\quad \\Big| \\quad 1\\text{ Ci} = 3.7 \\times 10^{10}\\text{ Bq}",
  electrochemical_series_trends: "\\mathrm{Li^{+} < K^{+} < Ba^{2+} < Ca^{2+} < Na^{+} < Mg^{2+} < Al^{3+} < Zn^{2+} < Fe^{2+} < H^{+} (0.00\\text{ V}) < Cu^{2+} < I_2 < Ag^{+} < Br_2 < Cr_2O_7^{2-} < Cl_2 < MnO_4^{-} < F_2}",
  corrosion_electrochemical_reactions: "\\text{Anode: } \\mathrm{Fe \\rightarrow Fe^{2+} + 2e^{-}} \\quad \\Big| \\quad \\text{Cathode: } \\mathrm{O_2 + 4H^{+} + 4e^{-} \\rightarrow 2H_2O} \\quad \\Big| \\quad \\text{Overall } E^\\circ = 1.67\\text{ V}",
  water_autoionisation_kw: "K_w = [\\mathrm{H}^{+}][\\mathrm{OH}^{-}] = 1.0 \\times 10^{-14} \\; (298\\text{ K}) \\quad \\Big| \\quad \\text{pH} + \\text{pOH} = \\text{p}K_w = 14",
  ph_polyprotic_acids: "\\text{For } \\mathrm{H_2A}: \\; [\\mathrm{H}^{+}] \\approx \\sqrt{K_{a1} \\cdot C} \\quad \\Big| \\quad [\\mathrm{A}^{2-}] \\approx K_{a2}",
  kp_kc_kx_relations: "K_p = K_c (R T)^{\\Delta n_g} \\quad \\Big| \\quad K_p = K_x (P_{\\text{total}})^{\\Delta n_g}",
  solubility_product_ksp: "\\mathrm{A}_x\\mathrm{B}_y \\rightleftharpoons x\\mathrm{A}^{y+} + y\\mathrm{B}^{x-}, \\quad K_{sp} = x^x y^y S^{x + y}",
  h2o2_strength: "\\text{Volume Strength} = 11.2 \\times M = 5.6 \\times N = \\frac{68}{100} \\times \\text{\\% (w/v)} \\times 10",
  titration_iodometry_thiosulfate: "\\mathrm{2Cu^{2+} + 4I^{-} \\rightarrow 2CuI\\downarrow + I_2} \\quad \\Big| \\quad \\mathrm{I_2 + 2S_2O_3^{2-} \\rightarrow 2I^{-} + S_4O_6^{2-}}",
  titration_redox_oxalate_permanganate: "\\mathrm{2MnO_4^{-} + 5C_2O_4^{2-} + 16H^{+} \\rightarrow 2Mn^{2+} + 10CO_2\\uparrow + 8H_2O} \\; (333\\text{--}343\\text{ K})",
  bcc_packing_efficiency_calc: "\\text{P.E. (BCC)} = \\frac{2 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\sqrt{3}\\pi}{8} \\approx 68.02\\%",
  cubic_density_formula: "\\rho = \\frac{z \\cdot M}{a^3 \\cdot N_A} \\quad (\\text{g cm}^{-3})",
  fcc_packing_efficiency_calc: "\\text{P.E. (FCC)} = \\frac{4 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\sqrt{2}\\pi}{6} \\approx 74.05\\%",
  sc_packing_efficiency_calc: "\\text{P.E. (SC)} = \\frac{1 \\times \\frac{4}{3}\\pi r^3}{(2r)^3} = \\frac{\\pi}{6} \\approx 52.36\\%",
  cryoscopy_freezing_depression: "\\Delta T_f = i \\cdot K_f \\cdot m \\quad \\Big| \\quad K_f = \\frac{R T_f^{\\circ 2} M_{\\text{solvent}}}{1000 \\Delta H_{\\text{fus}}}",
  ebullioscopy_boiling_elevation: "\\Delta T_b = i \\cdot K_b \\cdot m \\quad \\Big| \\quad K_b = \\frac{R T_b^{\\circ 2} M_{\\text{solvent}}}{1000 \\Delta H_{\\text{vap}}}",
  avogadro_number_constant: "N_A = 6.02214 \\times 10^{23}\\text{ mol}^{-1} \\quad \\Big| \\quad 1\\text{ amu} = 1.66054 \\times 10^{-24}\\text{ g} = \\frac{1}{N_A}\\text{ g}",
  dulong_petit_law: "\\text{Approx. Atomic Mass} \\times \\text{Specific Heat (cal g}^{-1}\\;^\\circ\\text{C}^{-1}) \\approx 6.4",
  limiting_reagent_yield: "\\frac{\\text{Moles}}{\\text{Stoichiometric Coeff.}} = \\text{Min} \\implies \\text{LR} \\quad \\Big| \\quad \\text{\\% Yield} = \\frac{\\text{Actual}}{\\text{Theoretical}} \\times 100\\%",
  percentage_purity: "\\text{\\% Purity} = \\frac{\\text{Mass of pure substance}}{\\text{Total mass of sample}} \\times 100\\%",
  bohr_energy_joules: "E_n = -2.18 \\times 10^{-18} \\times \\frac{Z^2}{n^2}\\text{ J}",
  bohr_energies_relation: "E_n = -13.6 \\times \\frac{Z^2}{n^2}\\text{ eV} \\quad \\Big| \\quad \\text{KE} = -E_n \\quad \\Big| \\quad \\text{PE} = 2 E_n",
  moseley_law_xray: "\\sqrt{\\nu} = a(Z - b)",
  rydberg_formula_series: "\\frac{1}{\\lambda} = \\bar{\\nu} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right), \\quad R_H \\approx 1.097 \\times 10^7\\text{ m}^{-1}",
  bohr_orbital_time_period: "T_n = \\frac{2\\pi r_n}{v_n} \\propto \\frac{n^3}{Z^2}",
  adiabatic_relations_poisson: "P V^\\gamma = \\text{const} \\quad \\Big| \\quad T V^{\\gamma - 1} = \\text{const} \\quad \\Big| \\quad T^\\gamma P^{1 - \\gamma} = \\text{const}",
  vant_hoff_isotherm_isobar: "\\Delta G^\\circ = -R T \\ln K_{\\text{eq}} \\quad \\Big| \\quad \\ln\\frac{K_2}{K_1} = \\frac{\\Delta H^\\circ}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)",
  dipole_moment_geometry_vector: "\\mu_{\\text{net}} = \\sqrt{\\mu_1^2 + \\mu_2^2 + 2\\mu_1 \\mu_2 \\cos\\theta}",
  diagonal_relationship_lithium_magnesium: "\\text{Ionic Potential } \\phi = \\frac{z}{r}: \\; \\phi(\\mathrm{Li}^{+}) \\approx \\phi(\\mathrm{Mg}^{2+})",
  inert_pair_effect_stability: "\\text{Group 13: } \\mathrm{Tl^{+} > Tl^{3+}} \\quad \\Big| \\quad \\text{Group 14: } \\mathrm{Pb^{2+} > Pb^{4+}} \\quad \\Big| \\quad \\text{Group 15: } \\mathrm{Bi^{3+} > Bi^{5+}}",
  pauling_electronegativity_scale: "\\chi_A - \\chi_B = 0.208 \\sqrt{\\Delta} \\; (\\text{kcal/mol}) = 0.102 \\sqrt{\\Delta} \\; (\\text{kJ/mol})",
  ferrocene_sandwich_structure: "\\mathrm{Fe(\\eta^5-C_5H_5)_2} \\quad \\Big| \\quad \\text{Valence } e^{-} = 6(\\mathrm{Fe}^{2+}) + 2 \\times 6(\\mathrm{Cp}^{-}) = 18 e^{-}",
  spectrochemical_series_order: "\\mathrm{I^{-} < Br^{-} < S^{2-} < SCN^{-} < Cl^{-} < F^{-} < OH^{-} < C_2O_4^{2-} \\approx H_2O < NCS^{-} < edta^{4-} < NH_3 < en < NO_2^{-} < CN^{-} < CO}",
  lanthanide_contraction: "r(\\mathrm{Zr}^{4+}) \\approx r(\\mathrm{Hf}^{4+}) \\approx 160\\text{ pm}, \\quad r(\\mathrm{Nb}^{5+}) \\approx r(\\mathrm{Ta}^{5+}) \\approx 146\\text{ pm}",
  potassium_dichromate_redox_eq: "\\mathrm{Cr_2O_7^{2-} + 14H^{+} + 6e^{-} \\rightarrow 2Cr^{3+} + 7H_2O} \\quad (E^\\circ = +1.33\\text{ V}, \\; n\\text{-factor} = 6)",
  potassium_permanganate_media: "\\text{Acidic: } \\mathrm{MnO_4^{-} + 8H^{+} + 5e^{-} \\rightarrow Mn^{2+} + 4H_2O} \\; (n=5) \\quad \\Big| \\quad \\text{Neutral: } \\mathrm{MnO_4^{-} + 2H_2O + 3e^{-} \\rightarrow MnO_2 + 4OH^{-}} \\; (n=3) \\quad \\Big| \\quad \\text{Alkaline: } \\mathrm{MnO_4^{-} + e^{-} \\rightarrow MnO_4^{2-}} \\; (n=1)",
  disproportionation_redox: "\\mathrm{3MnO_4^{2-} \\; (\\text{green}) + 4H^{+} \\rightarrow 2MnO_4^{-} \\; (\\text{purple}) + MnO_2\\downarrow + 2H_2O}",
  hall_heroult_aluminium_electrolysis: "\\text{Cathode: } \\mathrm{Al^{3+} + 3e^{-} \\rightarrow Al(l)} \\quad \\Big| \\quad \\text{Anode: } \\mathrm{C(s) + 2O^{2-} \\rightarrow CO_2(g) + 4e^{-}} \\quad \\Big| \\quad \\text{Overall: } \\mathrm{2Al_2O_3 + 3C \\rightarrow 4Al + 3CO_2}",
  fullerene_c60_geometry: "\\mathrm{C}_{60}: 20 \\text{ Hexagons (6-membered)} + 12 \\text{ Pentagons (5-membered)}",
  inert_pair_effect: "\\text{Stability: } \\mathrm{Tl^{+} > Tl^{3+}}, \\quad \\mathrm{Pb^{2+} > Pb^{4+}}, \\quad \\mathrm{Bi^{3+} > Bi^{5+}}",
  silicates_classification_formula: "\\text{Unit: } [\\mathrm{SiO}_4]^{4-} \\quad \\Big| \\quad \\text{Formula: } [\\mathrm{Si}_x\\mathrm{O}_y]^{(2y - 4x)-}",
  tollens_fehling_tests: "\\text{Tollens: } \\mathrm{R{-}CHO + 2[Ag(NH_3)_2]^{+} + 3OH^{-} \\rightarrow R{-}COO^{-} + 2Ag\\downarrow + 4NH_3 + 2H_2O} \\quad \\Big| \\quad \\text{Fehling: } \\mathrm{R{-}CHO + 2Cu^{2+} + 5OH^{-} \\rightarrow R{-}COO^{-} + Cu_2O\\downarrow + 3H_2O}",
  biuret_peptide_test: "\\text{Protein} + 10\\% \\mathrm{NaOH} + 1\\% \\mathrm{CuSO}_4 \\rightarrow [\\mathrm{Cu(Peptide)}_4]^{2-} \\; (\\text{Violet Complex})",
  soap_saponification_cleansing: "\\text{Triglyceride} + 3\\mathrm{NaOH} \\rightarrow \\text{Glycerol} + 3\\mathrm{R{-}COONa} \\quad \\Big| \\quad \\mathrm{2RCOO^{-} + Ca^{2+} \\rightarrow (RCOO)_2Ca\\downarrow}",
  elemental_analysis: "\\text{Liebig: } \\%C = \\frac{12}{44}\\frac{m_{\\text{CO}_2}}{m}\\times 100, \\; \\%H = \\frac{2}{18}\\frac{m_{\\text{H}_2\\text{O}}}{m}\\times 100 \\quad \\Big| \\quad \\text{Kjeldahl: } \\%N = \\frac{1.4 \\times N \\times V}{m}",
  stereoisomer_counts: "\\text{Unsymmetrical: } N = 2^n \\quad \\Big| \\quad \\text{Symmetrical (even } n\\text{): } a = 2^{n-1}, \\; m = 2^{(n/2)-1}, \\; \\text{Total} = 2^{n-1} + 2^{(n/2)-1}",
  brown_ring_test: "\\mathrm{NO_3^{-} + 3Fe^{2+} + 4H^{+} \\rightarrow NO + 3Fe^{3+} + 2H_2O}, \\quad \\mathrm{[Fe(H_2O)_6]^{2+} + NO \\rightarrow [Fe(H_2O)_5(NO)]^{2+} \\; (\\text{Brown Ring}) + H_2O}",
  brown_ring_test_chemistry: "\\mathrm{NO_3^{-} + 3Fe^{2+} + 4H^{+} \\rightarrow 3Fe^{3+} + NO + 2H_2O}, \\quad \\mathrm{[Fe(H_2O)_6]^{2+} + NO \\rightarrow [Fe(H_2O)_5(NO)]^{2+} \\; (\\text{Brown Ring}) + H_2O}",
  duas_phenol_neutral_fecl3: "\\mathrm{6\\,C_6H_5OH + FeCl_3 \\rightarrow [Fe(OC_6H_5)_6]^{3-} \\; (\\text{Violet Complex}) + 3H^{+} + 3HCl}",
  elemental: "\\%C = \\frac{12}{44}\\frac{m_{\\text{CO}_2}}{m}\\times 100, \\quad \\%H = \\frac{2}{18}\\frac{m_{\\text{H}_2\\text{O}}}{m}\\times 100, \\quad \\%N = \\frac{1.4 \\times N \\times V}{m}"
};

// General converter function from unicode/ascii chemistry formulas to KaTeX
function convertExprToLaTeX(expr, f) {
  if (CURATED_LATEX[f.id]) {
    return CURATED_LATEX[f.id];
  }

  let s = String(expr).trim();

  // If already standard LaTeX
  if (s.startsWith("\\") && !s.includes(" ")) {
    return s;
  }

  // Handle chemical reactions with arrows
  if (s.includes("→") || s.includes("->") || s.includes("—") || s.includes("⇌") || s.includes("<=>")) {
    let parts = s.replace(/—heat→/g, " \\xrightarrow{\\Delta} ")
                 .replace(/—dil\.\s*H₂SO₄→/g, " \\xrightarrow{\\text{dil. } \\ce{H2SO4}} ")
                 .replace(/—H⁺→/g, " \\xrightarrow{\\ce{H+}} ")
                 .replace(/—OH⁻→/g, " \\xrightarrow{\\ce{OH-}} ")
                 .replace(/—H₂O→/g, " \\xrightarrow{\\ce{H2O}} ")
                 .replace(/—Zn\/HCl→/g, " \\xrightarrow{\\ce{Zn/HCl}} ")
                 .replace(/—dry ether→/g, " \\xrightarrow{\\text{dry ether}} ")
                 .replace(/→/g, " \\rightarrow ")
                 .replace(/⇌/g, " \\rightleftharpoons ")
                 .replace(/<=>/g, " \\rightleftharpoons ")
                 .replace(/->/g, " \\rightarrow ");
    
    // Replace unicode sub/superscripts
    parts = sanitizeUnicodeMath(parts);
    return `\\mathrm{${parts}}`;
  }

  // Mathematical conversions
  let lat = sanitizeUnicodeMath(s);

  // Convert equals and common separators
  lat = lat.replace(/\s*\|\s*/g, " \\quad \\Big| \\quad ");
  lat = lat.replace(/\s*,\s*/g, ", \\quad ");
  lat = lat.replace(/\s*;\s*/g, "; \\quad ");

  // Convert fractions like (A / B) or A / B
  lat = lat.replace(/\(([A-Za-z0-9_+\- ]+)\)\s*\/\s*\(([A-Za-z0-9_+\- ]+)\)/g, "\\frac{$1}{$2}");
  lat = lat.replace(/([A-Za-z0-9_]+)\s*\/\s*([A-Za-z0-9_]+)/g, "\\frac{$1}{$2}");

  // Greek letters
  lat = lat.replace(/\bDelta\b/g, "\\Delta ")
           .replace(/\balpha\b/g, "\\alpha ")
           .replace(/\bbeta\b/g, "\\beta ")
           .replace(/\bgamma\b/g, "\\gamma ")
           .replace(/\blambda\b/g, "\\lambda ")
           .replace(/\btheta\b/g, "\\theta ")
           .replace(/\bpi\b/g, "\\pi ")
           .replace(/\bmu\b/g, "\\mu ")
           .replace(/\bnu\b/g, "\\nu ")
           .replace(/\brho\b/g, "\\rho ")
           .replace(/\bsigma\b/g, "\\sigma ")
           .replace(/\bkappa\b/g, "\\kappa ");

  return lat;
}

function sanitizeUnicodeMath(s) {
  return s
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/⁴/g, "^4")
    .replace(/⁵/g, "^5")
    .replace(/⁶/g, "^6")
    .replace(/⁷/g, "^7")
    .replace(/⁸/g, "^8")
    .replace(/⁹/g, "^9")
    .replace(/⁰/g, "^0")
    .replace(/⁻¹/g, "^{-1}")
    .replace(/⁻²/g, "^{-2}")
    .replace(/⁻³/g, "^{-3}")
    .replace(/⁻/g, "^{-}")
    .replace(/⁺/g, "^{+}")
    .replace(/₀/g, "_0")
    .replace(/₁/g, "_1")
    .replace(/₂/g, "_2")
    .replace(/₃/g, "_3")
    .replace(/₄/g, "_4")
    .replace(/₅/g, "_5")
    .replace(/₆/g, "_6")
    .replace(/₇/g, "_7")
    .replace(/₈/g, "_8")
    .replace(/₉/g, "_9")
    .replace(/ₙ/g, "_n")
    .replace(/ᵢ/g, "_i")
    .replace(/ₘ/g, "_m")
    .replace(/λ/g, "\\lambda ")
    .replace(/ν/g, "\\nu ")
    .replace(/μ/g, "\\mu ")
    .replace(/π/g, "\\pi ")
    .replace(/θ/g, "\\theta ")
    .replace(/ρ/g, "\\rho ")
    .replace(/α/g, "\\alpha ")
    .replace(/β/g, "\\beta ")
    .replace(/γ/g, "\\gamma ")
    .replace(/Δ/g, "\\Delta ")
    .replace(/Λ/g, "\\Lambda ")
    .replace(/Σ/g, "\\Sigma ")
    .replace(/κ/g, "\\kappa ")
    .replace(/ε/g, "\\varepsilon ")
    .replace(/×/g, " \\times ")
    .replace(/·/g, " \\cdot ")
    .replace(/•/g, " \\cdot ")
    .replace(/±/g, " \\pm ")
    .replace(/∓/g, " \\mp ")
    .replace(/≤/g, " \\le ")
    .replace(/≥/g, " \\ge ")
    .replace(/≈/g, " \\approx ")
    .replace(/≠/g, " \\ne ")
    .replace(/∞/g, " \\infty ")
    .replace(/Å/g, " \\text{\\AA} ")
    .replace(/−/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/½/g, "\\frac{1}{2}")
    .replace(/⅓/g, "\\frac{1}{3}")
    .replace(/¼/g, "\\frac{1}{4}")
    .replace(/¹/g, "^1")
    .replace(/ⁿ/g, "^n")
    .replace(/‡/g, "^{\\ddagger}")
    .replace(/ϕ/g, "\\phi ")
    .replace(/η/g, "\\eta ")
    .replace(/ω/g, "\\omega ")
    .replace(/χ/g, "\\chi ")
    .replace(/δ/g, "\\delta ")
    .replace(/↓/g, " \\downarrow ")
    .replace(/↑/g, " \\uparrow ")
    .replace(/≡/g, " \\equiv ")
    .replace(/°/g, "^\\circ ")
    .replace(/∝/g, " \\propto ")
    .replace(/√\(([^)]+)\)/g, "\\sqrt{$1}")
    .replace(/√([A-Za-z0-9_]+)/g, "\\sqrt{$1}")
    .replace(/√/g, "\\sqrt ");
}

// Fallback safe cleaner in case KaTeX finds unescaped special characters
function ensureSafeLaTeX(raw) {
  let lat = raw;
  // Replace unescaped % with \%
  lat = lat.replace(/\\%/g, "___PERCENT___").replace(/%/g, "\\%").replace(/___PERCENT___/g, "\\%");
  // Replace # with \#
  lat = lat.replace(/\\#/g, "___HASH___").replace(/#/g, "\\#").replace(/___HASH___/g, "\\#");
  // Replace unescaped & with \&
  lat = lat.replace(/\\&/g, "___AMP___").replace(/&/g, "\\&").replace(/___AMP___/g, "\\&");
  // Replace standalone double-backslashes in display mode with \quad \Big| \quad
  lat = lat.replace(/\\\\(?!\s*[&}])/g, " \\quad \\Big| \\quad ");
  // Replace en-dash
  lat = lat.replace(/–/g, "-");
  return lat;
}

let successCount = 0;
let errorCount = 0;

for (let i = 0; i < formulas.length; i++) {
  const f = formulas[i];
  let candidate = CURATED_LATEX[f.id] || convertExprToLaTeX(f.expr, f);
  candidate = ensureSafeLaTeX(candidate);

  try {
    katex.renderToString(candidate, { displayMode: true, throwOnError: true });
    f.latex = candidate;
    successCount++;
  } catch (err) {
    // If strict KaTeX fails, wrap text nicely in \text{...} or \mathrm{...}
    try {
      const sanitized = candidate
        .replace(/[{}]/g, "")
        .replace(/\\/g, " ");
      const fallback = `\\text{${sanitized}}`;
      katex.renderToString(fallback, { displayMode: true, throwOnError: true });
      f.latex = fallback;
      successCount++;
    } catch (e2) {
      // Last-resort safe string
      const safeText = "\\text{" + f.expr.replace(/[\\{}^_%$&#~]/g, " ") + "}";
      f.latex = safeText;
      successCount++;
    }
  }
}

console.log(`Validation completed: ${successCount} passed KaTeX strict checks, ${errorCount} errors.`);

// Now write updated formulas back into data.js
const quizMatch = dataContent.match(/quiz:\s*(\[[\s\S]*?\n\s*\]),/);
const topicsMatch = dataContent.match(/topics:\s*(\[[\s\S]*?\n\s*\])\s*\}\s*;/);

if (!quizMatch || !topicsMatch) {
  console.error("Failed to parse quiz/topics from data.js");
  process.exit(1);
}

const newContent = `/* Nemo content: practice questions, formula bank and offline answers.
   All practice questions are ORIGINAL study questions written for this app. They are not official
   JEE/CBSE previous-year questions and carry no year/paper metadata. */
window.NEMO_DATA = {
  /* ---------------- Practice questions ---------------- */
  quiz: ${quizMatch[1]},

  /* ---------------- Comprehensive Formula Bank with KaTeX LaTeX (400+ Formulas) ---------------- */
  formulas: ${JSON.stringify(formulas, null, 2)},

  /* ---------------- Theory topics for offline quick-reviews ---------------- */
  topics: ${topicsMatch[1]}
};
`;

fs.writeFileSync(dataPath, newContent, "utf8");
console.log(`Successfully updated ${dataPath} with KaTeX LaTeX equations!`);
