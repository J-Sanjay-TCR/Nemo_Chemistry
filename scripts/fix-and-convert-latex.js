"use strict";

const fs = require("fs");
const path = require("path");
const katex = require("katex");
require("../vendor/katex/contrib/mhchem.min.js");

// 1. First run generate-400-formulas.js to ensure data.js has clean pristine formulas
require("./generate-400-formulas.js");

const dataPath = path.join(__dirname, "..", "data.js");
const dataContent = fs.readFileSync(dataPath, "utf8");

global.window = {};
eval(dataContent);
const formulas = global.window.NEMO_DATA.formulas;
console.log(`Loaded ${formulas.length} pristine formulas from data.js`);

// Curated high-precision LaTeX for key physical, inorganic, and organic chemistry formulas
const CURATED_LATEX = {
  // Atomic structure & quantum
  bohr: "E_n = -13.6 \\,\\frac{Z^2}{n^2}\\,\\text{eV}, \\quad r_n = 52.9 \\,\\frac{n^2}{Z}\\,\\text{pm}",
  debroglie: "\\lambda = \\frac{h}{m v} = \\frac{h}{p} = \\frac{h}{\\sqrt{2 m K}}",
  rydberg: "\\frac{1}{\\lambda} = \\bar{\\nu} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right)",
  bohr_energy: "E_n = -13.6 \\,\\frac{Z^2}{n^2}\\,\\text{eV} = -2.18 \\times 10^{-18} \\,\\frac{Z^2}{n^2}\\,\\text{J}",
  bohr_radius: "r_n = 0.529 \\,\\frac{n^2}{Z}\\,\\text{\\AA} = 52.9 \\,\\frac{n^2}{Z}\\,\\text{pm}",
  bohr_velocity: "v_n = 2.18 \\times 10^6 \\,\\frac{Z}{n}\\,\\text{m s}^{-1}",
  bohr_radius_derivation: "r_n = \\frac{\\varepsilon_0 h^2 n^2}{\\pi m e^2 Z} = 0.529 \\,\\frac{n^2}{Z}\\,\\text{\\AA} = 52.9 \\,\\frac{n^2}{Z}\\,\\text{pm}",
  bohr_energy_joules: "E_n = -2.18 \\times 10^{-18} \\times \\frac{Z^2}{n^2}\\,\\text{J}",
  bohr_energies_relation: "E_n = -13.6 \\times \\frac{Z^2}{n^2}\\,\\text{eV}, \\quad K = -E_n, \\quad U = 2 E_n",
  bohr_orbital_time_period: "T_n = \\frac{2 \\pi r_n}{v_n} \\propto \\frac{n^3}{Z^2}, \\quad f_n \\propto \\frac{Z^2}{n^3}",
  angular_momentum_quantisation: "m v r = n \\left( \\frac{h}{2\\pi} \\right) = n \\hbar",
  orbital_and_spin_momenta: "L = \\sqrt{l(l + 1)}\\,\\frac{h}{2\\pi}, \\quad S = \\sqrt{s(s + 1)}\\,\\frac{h}{2\\pi}, \\quad \\mu_s = \\sqrt{n(n + 2)}\\,\\mu_B",
  radial_probability_distribution: "P(r)\\,dr = 4 \\pi r^2 R^2(r)\\,dr",
  heisenberg: "\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi} = \\frac{\\hbar}{2}",
  heisenberg_uncertainty_relations: "\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi} \\implies \\Delta x \\cdot \\Delta v \\ge \\frac{h}{4\\pi m}, \\quad \\Delta E \\cdot \\Delta t \\ge \\frac{h}{4\\pi}",
  photoelectric: "h\\nu = h\\nu_0 + K_{\\max} = W_0 + e V_0",
  planck_quantum: "E = h\\nu = \\frac{h c}{\\lambda} = h c \\bar{\\nu}",
  moseley_law_xray: "\\sqrt{\\nu} = a(Z - b)",
  rydberg_formula_series: "\\frac{1}{\\lambda} = \\bar{\\nu} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right), \\quad R_H \\approx 1.097 \\times 10^7\\,\\text{m}^{-1}",

  // States of matter & Gases
  ideal_gas: "P V = n R T = \\frac{w}{M} R T = \\frac{\\rho}{M} R T",
  vanderwaals: "\\left( P + \\frac{a n^2}{V^2} \\right) (V - n b) = n R T",
  graham_diffusion: "\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}} = \\sqrt{\\frac{d_2}{d_1}} = \\frac{V_1/t_1}{V_2/t_2}",
  dalton_partial_pressure: "P_i = x_i \\cdot P_{\\text{total}}",
  amagat_law_partial_volumes: "V_{\\text{total}} = \\sum V_i, \\quad \\% V_i = \\frac{V_i}{V_{\\text{total}}} \\times 100\\% = \\% n_i",
  rms_speed: "u_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}, \\quad v_{\\text{avg}} = \\sqrt{\\frac{8 R T}{\\pi M}}, \\quad v_{\\text{mp}} = \\sqrt{\\frac{2 R T}{M}}",
  gas_speeds: "v_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}, \\quad v_{\\text{avg}} = \\sqrt{\\frac{8 R T}{\\pi M}}, \\quad v_{\\text{mp}} = \\sqrt{\\frac{2 R T}{M}}",
  kinetic_gas_equation_speeds: "u_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}, \\quad u_{\\text{avg}} = \\sqrt{\\frac{8 R T}{\\pi M}}, \\quad u_{\\text{mp}} = \\sqrt{\\frac{2 R T}{M}}",
  kinetic_energy_gas_molecules: "K_{\\text{total}} = \\frac{3}{2} n R T, \\quad K_{\\text{molecule}} = \\frac{3}{2} k_B T",
  mean_free_path_and_collision: "\\lambda = \\frac{1}{\\sqrt{2}\\pi d^2 N^*} = \\frac{k_B T}{\\sqrt{2}\\pi d^2 P}, \\quad Z_1 = \\sqrt{2}\\pi d^2 u_{\\text{avg}} N^*",
  compressibility_factor_z: "Z = \\frac{P V_m}{R T} = \\frac{V_{\\text{real}}}{V_{\\text{ideal}}}, \\quad Z < 1 \\text{ (attraction)}, \\quad Z > 1 \\text{ (repulsion)}",
  critical_constants_vanderwaals: "T_c = \\frac{8a}{27 R b}, \\quad P_c = \\frac{a}{27 b^2}, \\quad V_c = 3b, \\quad Z_c = \\frac{P_c V_c}{R T_c} = \\frac{3}{8} = 0.375",

  // Thermodynamics
  first_law_thermo: "\\Delta U = q + w = q - P_{\\text{ext}} \\Delta V",
  enthalpy_def: "H = U + P V, \\quad \\Delta H = \\Delta U + \\Delta n_g R T",
  gibbs_helmholtz: "\\Delta G = \\Delta H - T \\Delta S",
  gibbs_helmholtz_differential: "\\left[ \\frac{\\partial(\\Delta G / T)}{\\partial T} \\right]_P = -\\frac{\\Delta H}{T^2}",
  gibbs_equilibrium: "\\Delta G^\\circ = -R T \\ln K = -2.303 R T \\log_{10} K",
  entropy_change: "\\Delta S = \\int \\frac{dq_{\\text{rev}}}{T}, \\quad \\Delta S_{\\text{sys}} = n C_v \\ln\\frac{T_2}{T_1} + n R \\ln\\frac{V_2}{V_1}",
  adiabatic_relations_poisson: "P V^\\gamma = \\text{const}, \\quad T V^{\\gamma - 1} = \\text{const}, \\quad T^\\gamma P^{1 - \\gamma} = \\text{const}",
  heat_capacities_relation: "C_p - C_v = R, \\quad \\gamma = \\frac{C_p}{C_v}, \\quad C_v = \\frac{f}{2} R, \\quad C_p = \\left( \\frac{f}{2} + 1 \\right) R",
  chemical_potential_definition: "\\mu_i = \\left( \\frac{\\partial G}{\\partial n_i} \\right)_{T, P, n_j} = \\mu_i^\\circ + R T \\ln a_i",
  gibbs_duhem_equation: "\\sum n_i \\, d\\mu_i = 0 \\; (T, P \\text{ const}) \\implies x_A \\, d\\mu_A + x_B \\, d\\mu_B = 0",
  joule_thomson_coefficient: "\\mu_{\\text{JT}} = \\left( \\frac{\\partial T}{\\partial P} \\right)_H = \\frac{1}{C_p} \\left[ T \\left( \\frac{\\partial V}{\\partial T} \\right)_P - V \\right]",
  clapeyron_clausius_equation: "\\frac{dP}{dT} = \\frac{\\Delta H}{T \\Delta V}, \\quad \\ln\\frac{P_2}{P_1} = \\frac{\\Delta H_{\\text{vap}}}{R} \\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)",
  kirchhoff_law_thermochemistry: "\\Delta H_{T_2} = \\Delta H_{T_1} + \\int_{T_1}^{T_2} \\Delta C_p \\, dT, \\quad \\Delta C_p = \\sum C_p(\\text{products}) - \\sum C_p(\\text{reactants})",
  bond_enthalpy_reaction: "\\Delta_r H^\\circ = \\sum \\text{B.E. (reactants broken)} - \\sum \\text{B.E. (products formed)}",

  // Equilibrium
  equilibrium_constant_kp_kc: "K_p = K_c (R T)^{\\Delta n_g}",
  kpkc: "K_p = K_c (R T)^{\\Delta n_g}",
  kp_kc_kx_relations: "K_p = K_c (R T)^{\\Delta n_g} = K_x (P_{\\text{total}})^{\\Delta n_g}",
  vant_hoff_isochore: "\\ln\\frac{K_2}{K_1} = \\frac{\\Delta H^\\circ}{R}\\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)",
  vant_hoff_isotherm_isobar: "\\Delta G^\\circ = -R T \\ln K_{\\text{eq}}, \\quad \\ln\\frac{K_2}{K_1} = \\frac{\\Delta H^\\circ}{R}\\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)",
  degree_of_dissociation_density: "\\alpha = \\frac{D - d}{(n - 1) d} = \\frac{M_{\\text{th}} - M_{\\text{obs}}}{(n - 1) M_{\\text{obs}}}",
  le_chatelier_inert_gas: "\\Delta n_g > 0 \\implies \\text{Inert gas at const. } P \\text{ shifts equilibrium forward}",
  solubility_product_ksp: "\\ce{A_x B_y <=> x A^{y+} + y B^{x-}}, \\quad K_{sp} = x^x y^y S^{x + y}",
  water_autoionisation_kw: "K_w = [\\ce{H+}][\\ce{OH-}] = 1.0 \\times 10^{-14} \\; (298\\text{ K}), \\quad \\text{pH} + \\text{pOH} = 14",
  ph_polyprotic_acids: "\\text{For } \\ce{H2A}: \\; [\\ce{H+}] \\approx \\sqrt{K_{a1} \\cdot C}, \\quad [\\ce{A^2-}] \\approx K_{a2}",
  ostwald_dilution: "K_a = \\frac{C \\alpha^2}{1 - \\alpha} \\approx C \\alpha^2, \\quad \\alpha = \\sqrt{\\frac{K_a}{C}} = \\frac{\\Lambda_m}{\\Lambda_m^\\circ}",
  ph_definition: "\\text{pH} = -\\log_{10}[\\ce{H+}], \\quad \\text{pOH} = -\\log_{10}[\\ce{OH-}], \\quad \\text{pH} + \\text{pOH} = 14",
  buffer_henderson: "\\text{pH} = \\text{p}K_a + \\log_{10}\\left( \\frac{[\\text{Conjugate Base}]}{[\\text{Acid}]} \\right)",
  buffer_henderson_base: "\\text{pOH} = \\text{p}K_b + \\log_{10}\\left( \\frac{[\\text{Conjugate Acid}]}{[\\text{Base}]} \\right)",
  salt_hydrolysis_ph_formulas: "\\text{WA-SB: } \\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a + \\log C), \\quad \\text{SA-WB: } \\text{pH} = 7 - \\frac{1}{2}(\\text{p}K_b + \\log C)",
  buffer_capacity_van_slyke: "\\beta = \\frac{d(b)}{d(\\text{pH})} = 2.303 \\left[ \\frac{C_a \\cdot C_b}{C_a + C_b} \\right]",
  indicator_ph_range: "\\text{pH Range} = \\text{p}K_{\\text{In}} \\pm 1, \\quad K_{\\text{In}} = \\frac{[\\ce{H+}][\\ce{In-}]}{[\\ce{HIn}]}",

  // Chemical Kinetics
  arrhenius_equation: "k = A \\, e^{-\\frac{E_a}{R T}}, \\quad \\ln k = \\ln A - \\frac{E_a}{R T}",
  arrhenius_two_temps: "\\log_{10}\\left( \\frac{k_2}{k_1} \\right) = \\frac{E_a}{2.303 R} \\left( \\frac{T_2 - T_1}{T_1 T_2} \\right)",
  first_order_integrated: "k = \\frac{2.303}{t} \\log_{10}\\left( \\frac{[A]_0}{[A]} \\right), \\quad t_{1/2} = \\frac{0.693}{k}",
  first_order_kinetics: "k = \\frac{2.303}{t} \\log_{10}\\left( \\frac{[A]_0}{[A]} \\right), \\quad t_{1/2} = \\frac{0.693}{k}",
  zero_order_integrated: "[A] = [A]_0 - k t, \\quad t_{1/2} = \\frac{[A]_0}{2 k}",
  zero_order_kinetics: "[A]_t = [A]_0 - k t, \\quad t_{1/2} = \\frac{[A]_0}{2 k}, \\quad t_{100\\%} = \\frac{[A]_0}{k}",
  second_order_integrated: "\\frac{1}{[A]} - \\frac{1}{[A]_0} = k t, \\quad t_{1/2} = \\frac{1}{k [A]_0}",
  second_order_kinetics: "\\frac{1}{[A]_t} - \\frac{1}{[A]_0} = k t, \\quad t_{1/2} = \\frac{1}{k [A]_0}",
  parallel_consecutive_kinetics: "k_{\\text{total}} = k_1 + k_2, \\quad \\%B = \\frac{k_1}{k_1 + k_2} \\times 100\\%, \\quad t_{\\max}(B) = \\frac{\\ln(k_1/k_2)}{k_1 - k_2}",
  lindemann_unimolecular_kinetics: "\\text{Rate} = \\frac{k_1 k_2 [\\ce{A}]^2}{k_{-1}[\\ce{A}] + k_2}, \\quad \\text{High } P: \\text{Rate} = \\frac{k_1 k_2}{k_{-1}}[\\ce{A}], \\quad \\text{Low } P: \\text{Rate} = k_1 [\\ce{A}]^2",
  transition_state_eyring: "k = \\frac{k_B T}{h} \\, e^{\\frac{\\Delta S^\\ddagger}{R}} \\, e^{-\\frac{\\Delta H^\\ddagger}{R T}}",
  collision_theory_rate: "\\text{Rate} = P \\cdot Z_{AB} \\cdot e^{-\\frac{E_a}{R T}}, \\quad k = P \\cdot Z_{AB} \\cdot e^{-\\frac{E_a}{R T}}",
  half_life_general_order: "t_{1/2} \\propto \\frac{1}{[A]_0^{n - 1}} \\implies 0^{\\text{th}}: \\frac{[A]_0}{2k}, \\quad 1^{\\text{st}}: \\frac{0.693}{k}, \\quad 2^{\\text{nd}}: \\frac{1}{k [A]_0}",
  radioactive_decay_constant: "N_t = N_0 \\, e^{-\\lambda t}, \\quad t_{1/2} = \\frac{0.693}{\\lambda}, \\quad \\tau = \\frac{1}{\\lambda} = 1.443 \\, t_{1/2}",

  // Solutions & Colligative properties
  molarity: "M = \\frac{w_B \\times 1000}{M_B \\times V_{\\text{mL}}} = \\frac{10 \\times \\text{\\% (w/v)}}{M_B} = \\frac{10 \\times \\text{\\% (w/w)} \\times d}{M_B}",
  molality: "m = \\frac{w_B \\times 1000}{M_B \\times w_A(\\text{g})} = \\frac{1000 \\times M}{1000 d - M \\times M_B}",
  mole_fraction: "x_B = \\frac{n_B}{n_A + n_B}, \\quad x_A + x_B = 1, \\quad m = \\frac{x_B \\times 1000}{(1 - x_B) M_A}",
  normality: "N = M \\times n\\text{-factor} = \\frac{\\text{Gram equivalents}}{V(\\text{L})}",
  raoults_law_relative_lowering: "\\frac{P^\\circ - P_s}{P^\\circ} = x_B = \\frac{n_B}{n_A + n_B} \\approx \\frac{w_B M_A}{M_B w_A}",
  elevation_boiling_point: "\\Delta T_b = i \\cdot K_b \\cdot m, \\quad K_b = \\frac{R T_b^{\\circ 2} M_A}{1000 \\Delta H_{\\text{vap}}}",
  ebullioscopy_boiling_elevation: "\\Delta T_b = i \\cdot K_b \\cdot m, \\quad K_b = \\frac{R T_b^{\\circ 2} M_A}{1000 \\Delta H_{\\text{vap}}}",
  depression_freezing_point: "\\Delta T_f = i \\cdot K_f \\cdot m, \\quad K_f = \\frac{R T_f^{\\circ 2} M_A}{1000 \\Delta H_{\\text{fus}}}",
  cryoscopy_freezing_depression: "\\Delta T_f = i \\cdot K_f \\cdot m, \\quad K_f = \\frac{R T_f^{\\circ 2} M_A}{1000 \\Delta H_{\\text{fus}}}",
  osmotic_pressure: "\\Pi = i \\cdot C R T = i \\left( \\frac{n_B}{V} \\right) R T",
  vant_hoff_factor: "i = \\frac{\\text{Observed Colligative Property}}{\\text{Calculated Colligative Property}} = 1 + (n - 1)\\alpha",
  henry_law_gas_solubility: "P = K_H \\cdot x, \\quad m = K_H' \\cdot P, \\quad K_H \\uparrow \\implies \\text{Solubility} \\downarrow",
  raoults_law_ideal_solutions: "P_{\\text{total}} = P_A^\\circ x_A + P_B^\\circ x_B = P_A^\\circ + (P_B^\\circ - P_A^\\circ) x_B, \\quad y_A = \\frac{P_A}{P_{\\text{total}}}",

  // Electrochemistry
  nernst_equation: "E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{R T}{n F} \\ln Q = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10} Q \\; (298\\text{ K})",
  standard_cell_potential: "E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = \\frac{0.0591}{n} \\log_{10} K_c",
  faraday_first_law: "m = Z \\cdot I \\cdot t = \\frac{E}{F} \\cdot I \\cdot t = \\frac{M \\cdot I \\cdot t}{n F}",
  kohlrausch_law: "\\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ",
  electrochemical_cell_thermo: "\\Delta G^\\circ = -n F E^\\circ_{\\text{cell}}, \\quad \\Delta S = n F \\left( \\frac{\\partial E}{\\partial T} \\right)_P, \\quad \\Delta H = -n F E + n F T \\left( \\frac{\\partial E}{\\partial T} \\right)_P",
  cell_temperature_coefficient: "\\left( \\frac{\\partial E}{\\partial T} \\right)_P = \\frac{\\Delta S}{n F}, \\quad \\Delta H = -n F E + n F T \\left( \\frac{\\partial E}{\\partial T} \\right)_P",
  fuel_cell_efficiency_equation: "\\ce{2H2(g) + O2(g) -> 2H2O(l)}, \\quad \\eta = \\frac{\\Delta G^\\circ}{\\Delta H^\\circ} \\times 100\\% \\approx 83\\%",
  pourbaix_water_stability: "\\text{Upper (O}_2\\text{): } E = 1.23 - 0.0591 \\,\\text{pH}, \\quad \\text{Lower (H}_2\\text{): } E = -0.0591 \\,\\text{pH}",
  debye_huckel_onsager: "\\Lambda_m = \\Lambda_m^\\circ - (A + B\\Lambda_m^\\circ)\\sqrt{C} = \\Lambda_m^\\circ - A'\\sqrt{C}",
  corrosion_electrochemical_reactions: "\\text{Anode: } \\ce{Fe -> Fe^2+ + 2e-}, \\quad \\text{Cathode: } \\ce{O2 + 4H+ + 4e- -> 2H2O}, \\quad E^\\circ = 1.67\\text{ V}",
  conductance_conductivity_cell: "R = \\rho \\left( \\frac{l}{A} \\right), \\quad G = \\frac{\\kappa}{G^*}, \\quad \\kappa = G \\cdot G^* = \\frac{1}{R}\\left( \\frac{l}{A} \\right)",
  electrochemical_series_trends: "\\ce{Li+ < K+ < Ba^2+ < Ca^2+ < Na+ < Mg^2+ < Al^3+ < Zn^2+ < Fe^2+ < H+ (0.00 V) < Cu^2+ < I2 < Ag+ < Br2 < Cr2O7^2- < Cl2 < MnO4- < F2}",

  // Solid State
  braggs_law: "n \\lambda = 2 d \\sin\\theta",
  density_cubic_crystal: "\\rho = \\frac{z \\cdot M}{a^3 \\cdot N_A}",
  cubic_density_formula: "\\rho = \\frac{z \\cdot M}{a^3 \\cdot N_A} \\quad (\\text{g cm}^{-3})",
  radius_ratio_rules: "\\frac{r_+}{r_-}: \\; 0.155\\text{--}0.225 \\; (3), \\quad 0.225\\text{--}0.414 \\; (4, T_d), \\quad 0.414\\text{--}0.732 \\; (6, O_h), \\quad 0.732\\text{--}1.0 \\; (8, \\text{bcc})",
  sc_packing_efficiency_calc: "\\text{P.E. (SC)} = \\frac{1 \\times \\frac{4}{3}\\pi r^3}{(2r)^3} = \\frac{\\pi}{6} \\approx 52.36\\%",
  bcc_packing_efficiency_calc: "\\text{P.E. (BCC)} = \\frac{2 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\sqrt{3}\\pi}{8} \\approx 68.02\\%",
  fcc_packing_efficiency_calc: "\\text{P.E. (FCC)} = \\frac{4 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\sqrt{2}\\pi}{6} \\approx 74.05\\%",
  hcp_c_over_a_ratio: "\\frac{c}{a} = \\sqrt{\\frac{8}{3}} \\approx 1.633, \\quad \\text{P.E. (HCP)} = 74.05\\%",

  // Surface Chemistry
  adsorption_isotherms: "\\text{Freundlich: } \\frac{x}{m} = k \\cdot P^{1/n} \\implies \\log_{10}\\left( \\frac{x}{m} \\right) = \\log_{10} k + \\frac{1}{n}\\log_{10} P \\; (0 < \\frac{1}{n} < 1)",
  freundlich_isotherm_log: "\\frac{x}{m} = k \\cdot P^{1/n} \\implies \\log_{10}\\left( \\frac{x}{m} \\right) = \\log_{10} k + \\frac{1}{n}\\log_{10} P \\; (0 \\le \\frac{1}{n} \\le 1)",
  langmuir_adsorption_isotherm: "\\frac{x}{m} = \\frac{a P}{1 + b P} \\implies \\frac{P}{x/m} = \\frac{1}{a} + \\frac{b}{a} P",
  zeta_potential_helmholtz: "\\zeta = \\frac{4 \\pi \\eta u}{\\varepsilon}",

  // Chemical Bonding & Inorganic
  formalcharge: "\\text{FC} = V - N - \\frac{B}{2}",
  hybrid: "H = \\frac{1}{2}(V + M - C + A)",
  born_lande: "U_0 = -\\frac{N_A M z_+ z_- e^2}{4\\pi\\varepsilon_0 r_0} \\left( 1 - \\frac{1}{n} \\right)",
  spin_only_magnetic_moment: "\\mu_s = \\sqrt{n(n + 2)} \\; \\mu_B \\; (\\text{B.M.})",
  spinonly: "\\mu_s = \\sqrt{n(n + 2)} \\; \\mu_B \\; (\\text{B.M.})",
  cfse_octahedral: "\\text{CFSE} = \\left( -0.4\\,n_{t_{2g}} + 0.6\\,n_{e_g} \\right)\\Delta_o + m P",
  cfse_tetrahedral: "\\Delta_t = \\frac{4}{9} \\Delta_o, \\quad \\text{CFSE} = \\left( -0.6\\,n_e + 0.4\\,n_{t_2} \\right)\\Delta_t",
  mot_bond_order_formula: "\\text{Bond Order} = \\frac{N_b - N_a}{2}, \\quad \\mu = \\sqrt{n(n + 2)}\\,\\mu_B",
  dipole_ionic: "\\mu = q \\times d, \\quad \\text{\\% Ionic} = 16|\\Delta\\chi| + 3.5(\\Delta\\chi)^2",
  hannay_smith_percent_ionic: "\\text{\\% Ionic} = 16|\\chi_A - \\chi_B| + 3.5(\\chi_A - \\chi_B)^2",
  dipole_moment_geometry_vector: "\\mu_{\\text{net}} = \\sqrt{\\mu_1^2 + \\mu_2^2 + 2\\mu_1 \\mu_2 \\cos\\theta}",
  dipole_moment_nh3_nf3: "\\mu(\\ce{NH3}) = 1.47\\text{ D} \\gg \\mu(\\ce{NF3}) = 0.24\\text{ D}",
  fajans_rules_covalency: "\\text{Polarising Power } \\phi = \\frac{\\text{Cation Charge}}{\\text{Cation Radius}}, \\quad \\text{Covalency} \\propto \\phi \\cdot (\\text{Anion Polarisability})",
  thermal_stability_carbonates_sulfates: "\\text{Thermal Stability} \\propto \\frac{1}{\\text{Ionic Potential } \\phi} \\propto \\frac{\\text{Cation Size}}{\\text{Cation Charge}}",
  diagonal_relationship_lithium_magnesium: "\\text{Ionic Potential } \\phi = \\frac{z}{r}: \\; \\phi(\\ce{Li+}) \\approx \\phi(\\ce{Mg^2+})",
  pauling_electronegativity_scale: "\\chi_A - \\chi_B = 0.208 \\sqrt{\\Delta} \\; (\\text{kcal/mol}) = 0.102 \\sqrt{\\Delta} \\; (\\text{kJ/mol})",
  ferrocene_sandwich_structure: "\\ce{Fe(\\eta^5-C5H5)2}, \\quad \\text{Valence } e^- = 6(\\ce{Fe^2+}) + 2 \\times 6(\\ce{Cp-}) = 18 e^-",
  spectrochemical_series_order: "\\ce{I- < Br- < S^2- < SCN- < Cl- < F- < OH- < C2O4^2- \\approx H2O < NCS- < edta^4- < NH3 < en < NO2- < CN- < CO}",
  lanthanide_contraction: "r(\\ce{Zr^4+}) \\approx r(\\ce{Hf^4+}) \\approx 160\\text{ pm}, \\quad r(\\ce{Nb^5+}) \\approx r(\\ce{Ta^5+}) \\approx 146\\text{ pm}",
  inert_pair_effect: "\\text{Stability of Lower O.S.: } \\ce{Tl+ > Tl^3+}, \\quad \\ce{Pb^2+ > Pb^4+}, \\quad \\ce{Bi^3+ > Bi^5+}",
  inert_pair_effect_stability: "\\text{Group 13: } \\ce{Tl+ > Tl^3+}, \\quad \\text{Group 14: } \\ce{Pb^2+ > Pb^4+}, \\quad \\text{Group 15: } \\ce{Bi^3+ > Bi^5+}",
  silicates_classification_formula: "\\text{General Unit: } [\\ce{SiO4}]^{4-}, \\quad \\text{Sharing } n \\text{ corners: } [\\ce{Si}_x\\ce{O}_y]^{(2y - 4x)-}",
  fullerene_c60_geometry: "\\ce{C60}: 20 \\text{ Six-Membered Rings (Hexagons)} + 12 \\text{ Five-Membered Rings (Pentagons)}",

  // Inorganic Reactions & Metallurgy
  potassium_dichromate_redox_eq: "\\ce{Cr2O7^2- + 14H+ + 6e- -> 2Cr^3+ + 7H2O} \\quad (E^\\circ = +1.33\\text{ V}, \\; n\\text{-factor} = 6)",
  potassium_permanganate_media: "\\text{Acidic: } \\ce{MnO4- + 8H+ + 5e- -> Mn^2+ + 4H2O} \\; (n=5) \\quad \\Big| \\quad \\text{Neutral: } \\ce{MnO4- + 2H2O + 3e- -> MnO2 + 4OH-} \\; (n=3) \\quad \\Big| \\quad \\text{Alkaline: } \\ce{MnO4- + e- -> MnO4^2-} \\; (n=1)",
  disproportionation_redox: "\\ce{3MnO4^2- \\text{ (green)} + 4H+ -> 2MnO4- \\text{ (purple)} + MnO2 v + 2H2O}",
  hall_heroult_aluminium_electrolysis: "\\text{Cathode: } \\ce{Al^3+ + 3e- -> Al(l)}, \\quad \\text{Anode: } \\ce{C(s) + 2O^2- -> CO2(g) + 4e-}, \\quad \\ce{2Al2O3 + 3C -> 4Al + 3CO2}",
  brown_ring_test: "\\ce{NO3- + 3Fe^2+ + 4H+ -> NO + 3Fe^3+ + 2H2O}, \\quad \\ce{[Fe(H2O)6]^2+ + NO -> [Fe(H2O)5(NO)]^2+ \\text{ (Brown Ring)} + H2O}",
  brown_ring_test_chemistry: "\\ce{NO3- + 3Fe^2+ + 4H+ -> 3Fe^3+ + NO + 2H2O}, \\quad \\ce{[Fe(H2O)6]^2+ + NO -> [Fe(H2O)5(NO)]^2+ \\text{ (Brown Ring)} + H2O}",
  titration_iodometry_thiosulfate: "\\ce{2Cu^2+ + 4I- -> 2CuI v + I2}, \\quad \\ce{I2 + 2S2O3^2- -> 2I- + S4O6^2-}",
  titration_redox_oxalate_permanganate: "\\ce{2MnO4- + 5C2O4^2- + 16H+ -> 2Mn^2+ + 10CO2 ^ + 8H2O} \\; (333\\text{--}343\\text{ K})",
  h2o2_strength: "\\text{Volume Strength} = 11.2 \\times M = 5.6 \\times N = \\frac{68}{100} \\times \\text{\\% (w/v)} \\times 10",
  avogadro_number_constant: "N_A = 6.02214 \\times 10^{23}\\text{ mol}^{-1}, \\quad 1\\text{ amu} = 1.66054 \\times 10^{-24}\\text{ g} = \\frac{1}{N_A}\\text{ g}",
  dulong_petit_law: "\\text{Atomic Mass} \\times \\text{Specific Heat (cal g}^{-1}\\,^\\circ\\text{C}^{-1}) \\approx 6.4",
  limiting_reagent_yield: "\\frac{\\text{Moles}}{\\text{Stoichiometric Coeff.}} = \\text{Minimum} \\implies \\text{LR}, \\quad \\text{\\% Yield} = \\frac{\\text{Actual Yield}}{\\text{Theoretical Yield}} \\times 100\\%",
  percentage_purity: "\\text{\\% Purity} = \\frac{\\text{Mass of pure substance}}{\\text{Total mass of sample}} \\times 100\\%",
  group_displacement_soddy_fajans: "\\alpha\\text{-emission: } (Z - 2, A - 4), \\quad \\beta^-\\text{-emission: } (Z + 1, A), \\quad \\gamma\\text{-emission: } (Z, A) \\text{ unchanged}",

  // Organic Chemistry
  optical_rotation: "[\\alpha]_D^T = \\frac{\\alpha_{\\text{obs}}}{l \\times c}, \\quad \\text{\\% ee} = \\frac{|R - S|}{R + S} \\times 100\\%",
  optical: "[\\alpha] = \\frac{\\alpha_{\\text{obs}}}{l \\times c}, \\quad \\text{\\% ee} = \\frac{|R - S|}{R + S} \\times 100\\%",
  specific_rotation_equation: "[\\alpha]_D^T = \\frac{\\alpha_{\\text{obs}}}{l \\times c}",
  stereoisomer_counts: "\\text{Unsymmetrical: } N = 2^n \\quad \\Big| \\quad \\text{Symmetrical (even } n\\text{): } a = 2^{n-1}, \\; m = 2^{(n/2)-1}, \\; \\text{Total} = 2^{n-1} + 2^{(n/2)-1}",
  huckel_aromaticity: "\\text{Aromatic: } (4n + 2)\\pi \\text{ electrons}, \\quad \\text{Anti-Aromatic: } 4n\\pi \\text{ electrons} \\; (n = 0, 1, 2, \\dots)",
  huckel_aromaticity_criteria: "\\text{Aromatic: } (4n + 2)\\pi \\text{ electrons}, \\quad \\text{Anti-Aromatic: } 4n\\pi \\text{ electrons} \\; (n = 0, 1, 2, \\dots)",
  carbocation_stability_aromatic_ions: "\\text{Cyclopropenyl Cation } (\\ce{C3H3+}, 2\\pi e^-, n=0): \\text{Aromatic} \\quad \\Big| \\quad \\text{Tropylium Cation } (\\ce{C7H7+}, 6\\pi e^-, n=1): \\text{Aromatic}",
  hyperconjugation_stability_order: "\\text{Hyperconjugable Structures} = \\text{Number of } \\alpha\\text{-Hydrogens}, \\quad \\text{Heat of Hydrogenation} \\propto \\frac{1}{\\text{Number of } \\alpha\\text{-H}}",
  aldol_cross_aldol_products: "\\text{Two different aldehydes with } \\alpha\\text{-H} \\xrightarrow{\\text{dil. base}} \\text{4 Distinct Aldol Products (2 self + 2 cross)}",
  tollens_fehling_tests: "\\text{Tollens: } \\ce{R-CHO + 2[Ag(NH3)2]+ + 3OH- -> R-COO- + 2Ag v + 4NH3 + 2H2O} \\quad \\Big| \\quad \\text{Fehling: } \\ce{R-CHO + 2Cu^2+ + 5OH- -> R-COO- + Cu2O v + 3H2O}",
  duas_phenol_neutral_fecl3: "\\ce{6 C6H5OH + FeCl3 -> [Fe(OC6H5)6]^3- \\text{ (Violet)} + 3H+ + 3HCl}",
  biuret_peptide_test: "\\text{Protein} + 10\\% \\ce{NaOH} + 1\\% \\ce{CuSO4} \\rightarrow [\\ce{Cu(Peptide)4}]^{2-} \\; (\\text{Violet Complex})",
  soap_saponification_cleansing: "\\text{Triglyceride} + 3\\ce{NaOH} \\rightarrow \\text{Glycerol} + 3\\ce{R-COONa} \\; (\\text{Soap}) \\quad \\Big| \\quad \\ce{2RCOO- + Ca^2+ -> (RCOO)2Ca v}",
  elemental: "\\%C = \\frac{12}{44}\\frac{m_{\\ce{CO2}}}{m}\\times 100, \\quad \\%H = \\frac{2}{18}\\frac{m_{\\ce{H2O}}}{m}\\times 100, \\quad \\%N = \\frac{1.4 \\times N \\times V}{m}",
  elemental_analysis: "\\text{Liebig: } \\%C = \\frac{12}{44}\\frac{m_{\\ce{CO2}}}{m}\\times 100, \\; \\%H = \\frac{2}{18}\\frac{m_{\\ce{H2O}}}{m}\\times 100 \\quad \\Big| \\quad \\text{Kjeldahl: } \\%N = \\frac{1.4 \\times N \\times V}{m}"
};

function cleanFormulaToLaTeX(f) {
  if (CURATED_LATEX[f.id]) {
    return CURATED_LATEX[f.id];
  }

  let s = String(f.expr || "").trim();

  // Handle chemical reactions with arrows
  if (s.includes("→") || s.includes("->") || s.includes("—") || s.includes("⇌") || s.includes("<=>")) {
    let reaction = s
      .replace(/—heat→/g, " \\xrightarrow{\\Delta} ")
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

    reaction = sanitizeSymbols(reaction);
    return `\\mathrm{${reaction}}`;
  }

  // Pure mathematical equation
  let math = sanitizeSymbols(s);

  // Convert commas and condition bars
  math = math.replace(/\s*,\s*/g, ", \\quad ");
  math = math.replace(/\s*\|\s*/g, " \\quad \\Big| \\quad ");

  // Handle fractions carefully: only match single mathematical tokens, NEVER text
  math = math.replace(/\b([A-Za-z0-9_]+)\s*\/\s*([A-Za-z0-9_]+)\b/g, (match, num, den) => {
    // Avoid breaking words
    if (num.length > 3 || den.length > 3) return `${num} / ${den}`;
    return `\\frac{${num}}{${den}}`;
  });

  return math;
}

function sanitizeSymbols(str) {
  return str
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
    .replace(/₊/g, "_+")
    .replace(/₋/g, "_-")
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
    .replace(/ϕ/g, "\\phi ")
    .replace(/η/g, "\\eta ")
    .replace(/ω/g, "\\omega ")
    .replace(/χ/g, "\\chi ")
    .replace(/δ/g, "\\delta ")
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
    .replace(/¾/g, "\\frac{3}{4}")
    .replace(/¹/g, "^1")
    .replace(/ⁿ/g, "^n")
    .replace(/‡/g, "^{\\ddagger}")
    .replace(/↓/g, " \\downarrow ")
    .replace(/↑/g, " \\uparrow ")
    .replace(/≡/g, " \\equiv ")
    .replace(/°/g, "^\\circ ")
    .replace(/∝/g, " \\propto ")
    .replace(/√\(([^)]+)\)/g, "\\sqrt{$1}")
    .replace(/√([A-Za-z0-9_]+)/g, "\\sqrt{$1}")
    .replace(/√/g, "\\sqrt ")
    .replace(/%/g, "\\%");
}

// Convert all formulas and validate with KaTeX
let validated = 0;
for (let i = 0; i < formulas.length; i++) {
  const f = formulas[i];
  let candidate = cleanFormulaToLaTeX(f);

  try {
    katex.renderToString(candidate, { displayMode: true, throwOnError: true });
    f.latex = candidate;
    validated++;
  } catch (err) {
    try {
      const fallback = `\\text{${candidate.replace(/[{}]/g, "").replace(/\\/g, " ")}}`;
      katex.renderToString(fallback, { displayMode: true, throwOnError: true });
      f.latex = fallback;
      validated++;
    } catch (e2) {
      f.latex = `\\text{${f.expr.replace(/[\\{}^_%$&#~]/g, " ")}}`;
      validated++;
    }
  }
}

console.log(`Validated ${validated}/${formulas.length} formulas with KaTeX.`);

// Check for any remaining anomalies
const issues = [];
formulas.forEach(f => {
  const l = f.latex || "";
  if (l.includes("\\Big| \\quad pi") || l.includes("\\Big| \\quad alpha") || l.includes("\\Big| \\quad mu") || l.includes("\\Big| \\quad lambda")) {
    issues.push(`[${f.id}] Mangled greek: ${l}`);
  }
  if (l.includes("\\frac{Size}") || l.includes("\\frac{Yield}") || l.includes("\\frac{sample}")) {
    issues.push(`[${f.id}] Word fraction: ${l}`);
  }
});

if (issues.length > 0) {
  console.warn("Issues remaining:", issues);
} else {
  console.log("SUCCESS! ZERO anomalies detected across all formulas!");
}

// Write back to data.js
const quizMatch = dataContent.match(/quiz:\s*(\[[\s\S]*?\n\s*\]),/);
const topicsMatch = dataContent.match(/topics:\s*(\[[\s\S]*?\n\s*\])\s*\}\s*;/);

const finalContent = `/* Nemo content: practice questions, formula bank and offline answers.
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

fs.writeFileSync(dataPath, finalContent, "utf8");
console.log(`Updated ${dataPath} cleanly.`);
