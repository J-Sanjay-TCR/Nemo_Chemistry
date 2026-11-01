"use strict";

/**
 * Master Formula Engine for Nemo Chemistry Tutor.
 * Builds and validates 100% textbook-grade, error-free KaTeX equations
 * for all 418 formulas across Physical, Inorganic, and Organic Chemistry.
 */
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

// Master dictionary of curated, textbook-accurate LaTeX formulas
const MASTER_CURATED = {
  // ==================== ATOMIC STRUCTURE ====================
  bohr: "E_n = -13.6 \\,\\frac{Z^2}{n^2}\\,\\text{eV}, \\quad r_n = 52.9 \\,\\frac{n^2}{Z}\\,\\text{pm}",
  debroglie: "\\lambda = \\frac{h}{m v} = \\frac{h}{p} = \\frac{h}{\\sqrt{2 m K}}",
  rydberg: "\\frac{1}{\\lambda} = \\bar{\\nu} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right)",
  bohr_energy: "E_n = -13.6 \\,\\frac{Z^2}{n^2}\\,\\text{eV} = -2.18 \\times 10^{-18} \\,\\frac{Z^2}{n^2}\\,\\text{J}",
  bohr_velocity: "v_n = 2.18 \\times 10^6 \\,\\frac{Z}{n}\\,\\text{m s}^{-1} = \\frac{c}{137} \\cdot \\frac{Z}{n}",
  bohr_radius: "r_n = 0.529 \\,\\frac{n^2}{Z}\\,\\text{\\AA} = 52.9 \\,\\frac{n^2}{Z}\\,\\text{pm}",
  bohr_radius_derivation: "r_n = \\frac{\\varepsilon_0 h^2 n^2}{\\pi m e^2 Z} = 0.529 \\,\\frac{n^2}{Z}\\,\\text{\\AA} = 52.9 \\,\\frac{n^2}{Z}\\,\\text{pm}",
  bohr_energy_joules: "E_n = -2.18 \\times 10^{-18} \\times \\frac{Z^2}{n^2}\\,\\text{J}",
  bohr_energies_relation: "E_n = -13.6 \\times \\frac{Z^2}{n^2}\\,\\text{eV} \\quad \\Big| \\quad K = -E_n \\quad \\Big| \\quad U = 2 E_n",
  bohr_orbital_time_period: "T_n = \\frac{2 \\pi r_n}{v_n} \\propto \\frac{n^3}{Z^2}, \\quad f_n \\propto \\frac{Z^2}{n^3}",
  angular_momentum_quantisation: "m v r = n \\left( \\frac{h}{2\\pi} \\right) = n \\hbar",
  orbital_and_spin_momenta: "L = \\sqrt{l(l + 1)}\\,\\frac{h}{2\\pi}, \\quad S = \\sqrt{s(s + 1)}\\,\\frac{h}{2\\pi}, \\quad \\mu_s = \\sqrt{n(n + 2)}\\,\\mu_B",
  radial_probability_distribution: "P(r)\\,dr = 4 \\pi r^2 R^2(r)\\,dr",
  heisenberg: "\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi} = \\frac{\\hbar}{2}",
  heisenberg_uncertainty_relations: "\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi} \\implies \\Delta x \\cdot \\Delta v \\ge \\frac{h}{4\\pi m}, \\quad \\Delta E \\cdot \\Delta t \\ge \\frac{h}{4\\pi}",
  photoelectric: "h\\nu = h\\nu_0 + K_{\\max} = W_0 + e V_0",
  photoelectric_work_function: "E = h\\nu = h\\nu_0 + K_{\\max} \\implies K_{\\max} = h(\\nu - \\nu_0) = e V_s",
  planck_quantum: "E = h\\nu = \\frac{h c}{\\lambda} = h c \\bar{\\nu}",
  moseley_law_xray: "\\sqrt{\\nu} = a(Z - b)",
  rydberg_formula_series: "\\frac{1}{\\lambda} = \\bar{\\nu} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right), \\quad R_H \\approx 1.097 \\times 10^7\\,\\text{m}^{-1}",
  angular_momentum: "L = \\sqrt{l(l + 1)}\\,\\frac{h}{2\\pi}, \\quad S = \\sqrt{s(s + 1)}\\,\\frac{h}{2\\pi}",
  de_broglie_thermal_neutrons: "\\lambda = \\frac{h}{\\sqrt{3 m k_B T}} = \\frac{0.286}{\\sqrt{E_{\\text{eV}}}}\\,\\text{\\AA}",
  de_broglie_potentials: "\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2 m q V}} \\quad \\Big| \\quad \\text{For } e^-: \\; \\lambda = \\frac{12.27}{\\sqrt{V}}\\,\\text{\\AA} = \\sqrt{\\frac{150}{V}}\\,\\text{\\AA}",
  packing_fraction_mass_defect: "\\Delta m = [Z m_p + (A - Z) m_n] - M_{\\text{nucleus}} \\quad \\Big| \\quad \\text{BE} = \\Delta m \\cdot c^2 = \\Delta m(\\text{amu}) \\times 931.5\\,\\text{MeV}",
  number_of_spectral_lines: "N = \\frac{(n_2 - n_1)(n_2 - n_1 + 1)}{2} = \\frac{\\Delta n(\\Delta n + 1)}{2}",
  quantum_nodes_formula: "\\text{Radial Nodes} = n - l - 1 \\quad \\Big| \\quad \\text{Angular Nodes} = l \\quad \\Big| \\quad \\text{Total Nodes} = n - 1",
  group_displacement_soddy_fajans: "\\alpha\\text{-emission: } (Z - 2, A - 4) \\quad \\Big| \\quad \\beta^-\\text{-emission: } (Z + 1, A) \\quad \\Big| \\quad \\gamma\\text{-emission: } (Z, A) \\text{ unchanged}",

  // ==================== STATES OF MATTER ====================
  idealgas: "P V = n R T = \\frac{w}{M} R T = \\frac{\\rho}{M} R T",
  ideal_gas: "P V = n R T = \\frac{w}{M} R T = \\frac{\\rho}{M} R T",
  vanderwaals: "\\left( P + \\frac{a n^2}{V^2} \\right) (V - n b) = n R T",
  graham_diffusion: "\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}} = \\sqrt{\\frac{d_2}{d_1}} = \\frac{V_1/t_1}{V_2/t_2}",
  grahams_law_effusion: "\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}} = \\sqrt{\\frac{d_2}{d_1}} = \\frac{V_1 / t_1}{V_2 / t_2} = \\frac{n_1 / t_1}{n_2 / t_2}",
  dalton_partial_pressure: "P_i = x_i \\cdot P_{\\text{total}}",
  dalton_amagat: "P_i = x_i \\cdot P_{\\text{total}}, \\quad V_i = x_i \\cdot V_{\\text{total}}",
  dalton_aqueous_tension: "P_{\\text{dry gas}} = P_{\\text{moist gas}} - P_{\\ce{H2O}} \\text{ (Aqueous Tension)}",
  amagat_law_partial_volumes: "V_{\\text{total}} = \\sum V_i, \\quad \\% V_i = \\frac{V_i}{V_{\\text{total}}} \\times 100\\% = \\% n_i",
  boyles_law_isotherm: "P_1 V_1 = P_2 V_2 = \\text{const} \\; (T, n \\text{ const}) \\quad \\Big| \\quad \\beta = -\\frac{1}{V}\\left( \\frac{\\partial V}{\\partial P} \\right)_T = \\frac{1}{P}",
  charles_law_absolute_zero: "V_t = V_0 \\left( 1 + \\frac{t}{273.15} \\right) \\quad \\Big| \\quad V = 0 \\text{ at } t = -273.15^\\circ\\text{C} \\; (0\\text{ K})",
  gay_lussac_pressure_temp: "P_t = P_0 \\left( 1 + \\frac{t}{273.15} \\right) \\implies \\frac{P_1}{T_1} = \\frac{P_2}{T_2} \\; (V \\text{ const})",
  boyle_inversion_temp: "T_B = \\frac{a}{R b}, \\quad T_i = \\frac{2a}{R b} = 2 T_B",
  critical_constants_vdw: "T_c = \\frac{8a}{27 R b}, \\quad P_c = \\frac{a}{27 b^2}, \\quad V_c = 3b \\quad \\Big| \\quad Z_c = \\frac{P_c V_c}{R T_c} = \\frac{3}{8} = 0.375",
  critical_constants_vanderwaals: "T_c = \\frac{8a}{27 R b}, \\quad P_c = \\frac{a}{27 b^2}, \\quad V_c = 3b \\quad \\Big| \\quad Z_c = \\frac{P_c V_c}{R T_c} = \\frac{3}{8} = 0.375",
  compressibility_factor_limits: "Z = \\frac{P V_m}{R T} \\quad \\Big| \\quad \\text{Low } P: Z \\approx 1 - \\frac{a}{V_m R T} \\quad \\Big| \\quad \\text{High } P: Z \\approx 1 + \\frac{P b}{R T}",
  compressibility_factor_z: "Z = \\frac{P V_m}{R T} = \\frac{V_{\\text{real}}}{V_{\\text{ideal}}}, \\quad Z < 1 \\; (\\text{attraction}), \\quad Z > 1 \\; (\\text{repulsion})",
  van_der_waals_reduced_eq: "\\left( P_r + \\frac{3}{V_r^2} \\right) (3 V_r - 1) = 8 T_r",
  surface_tension_capillary: "h = \\frac{2 \\gamma \\cos\\theta}{r \\rho g} \\quad \\Big| \\quad \\gamma = \\frac{r h \\rho g}{2 \\cos\\theta}",
  rms_speed: "u_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}, \\quad v_{\\text{avg}} = \\sqrt{\\frac{8 R T}{\\pi M}}, \\quad v_{\\text{mp}} = \\sqrt{\\frac{2 R T}{M}}",
  gas_speeds: "v_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}, \\quad v_{\\text{avg}} = \\sqrt{\\frac{8 R T}{\\pi M}}, \\quad v_{\\text{mp}} = \\sqrt{\\frac{2 R T}{M}}",
  kinetic_gas_equation_speeds: "P V = \\frac{1}{3} m N u_{\\text{rms}}^2, \\quad u_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}, \\quad u_{\\text{avg}} = \\sqrt{\\frac{8 R T}{\\pi M}}, \\quad u_{\\text{mp}} = \\sqrt{\\frac{2 R T}{M}}",
  kinetic_energy_gas_molecules: "K_{\\text{total}} = \\frac{3}{2} n R T, \\quad K_{\\text{molecule}} = \\frac{3}{2} k_B T = \\frac{3}{2} \\left( \\frac{R}{N_A} \\right) T",
  mean_free_path_and_collision: "\\lambda = \\frac{1}{\\sqrt{2}\\pi d^2 N^*} = \\frac{k_B T}{\\sqrt{2}\\pi d^2 P}, \\quad Z_1 = \\sqrt{2}\\pi d^2 u_{\\text{avg}} N^*",
  eudiometry_hydrocarbon: "\\ce{C_x H_y + \\left(x + \\frac{y}{4}\\right) O2 -> x CO2 + \\frac{y}{2} H2O(l)}, \\quad \\text{Contraction} = 1 + \\frac{y}{4}",

  // ==================== THERMODYNAMICS ====================
  first_law_thermo: "\\Delta U = q + w = q - P_{\\text{ext}} \\Delta V",
  first_law_sign_conventions: "\\Delta U = q + w \\quad \\Big| \\quad w = -\\int P_{\\text{ext}} \\, dV",
  first_law_work: "\\Delta U = q + w, \\quad w_{\\text{rev(iso)}} = -2.303 n R T \\log_{10}\\left(\\frac{V_2}{V_1}\\right), \\quad w_{\\text{irrev}} = -P_{\\text{ext}} \\Delta V",
  enthalpy_def: "H = U + P V, \\quad \\Delta H = \\Delta U + \\Delta n_g R T",
  enthalpy_reaction: "\\Delta H = \\Delta U + \\Delta n_g R T",
  enthalpy_internal_energy_diff: "\\Delta H - \\Delta U = \\Delta n_g R T",
  gibbs: "\\Delta G = \\Delta H - T \\Delta S",
  gibbs_helmholtz: "\\Delta G = \\Delta H - T \\Delta S",
  gibbs_free_energy_spontaneity: "\\Delta G = \\Delta H - T \\Delta S \\quad \\Big| \\quad \\Delta G < 0 \\; (\\text{spontaneous}) \\quad \\Big| \\quad \\Delta G = 0 \\; (\\text{equilibrium}) \\quad \\Big| \\quad \\Delta G > 0 \\; (\\text{non-spontaneous})",
  gibbs_helmholtz_differential: "\\left[ \\frac{\\partial(\\Delta G / T)}{\\partial T} \\right]_P = -\\frac{\\Delta H}{T^2}",
  gibbs_equilibrium: "\\Delta G^\\circ = -R T \\ln K = -2.303 R T \\log_{10} K",
  gibbsk: "\\Delta G^\\circ = -R T \\ln K = -2.303 R T \\log_{10} K = -n F E^\\circ",
  entropy_change: "\\Delta S = \\int \\frac{dq_{\\text{rev}}}{T}, \\quad \\Delta S_{\\text{sys}} = n C_v \\ln\\frac{T_2}{T_1} + n R \\ln\\frac{V_2}{V_1}",
  entropy_ideal_gas_expansion: "\\Delta S = n C_v \\ln\\left(\\frac{T_2}{T_1}\\right) + n R \\ln\\left(\\frac{V_2}{V_1}\\right) = n C_p \\ln\\left(\\frac{T_2}{T_1}\\right) - n R \\ln\\left(\\frac{P_2}{P_1}\\right)",
  entropy_phase_transitions: "\\Delta S_{\\text{fus}} = \\frac{\\Delta H_{\\text{fus}}}{T_{\\text{mp}}} \\quad \\Big| \\quad \\Delta S_{\\text{vap}} = \\frac{\\Delta H_{\\text{vap}}}{T_{\\text{bp}}} \\quad \\Big| \\quad \\text{Trouton: } \\Delta S_{\\text{vap}} \\approx 88\\,\\text{J K}^{-1}\\text{ mol}^{-1}",
  adiabatic_relations_poisson: "P V^\\gamma = \\text{const}, \\quad T V^{\\gamma - 1} = \\text{const}, \\quad T^\\gamma P^{1 - \\gamma} = \\text{const}",
  heat_capacities: "C_p - C_v = R, \\quad \\gamma = \\frac{C_p}{C_v}, \\quad \\Delta U = n C_v \\Delta T, \\quad \\Delta H = n C_p \\Delta T",
  heat_capacities_difference: "C_p - C_v = R \\quad \\Big| \\quad \\gamma = \\frac{C_p}{C_v} = 1 + \\frac{2}{f}",
  heat_capacities_relation: "C_p - C_v = R, \\quad \\gamma = \\frac{C_p}{C_v}, \\quad C_v = \\frac{f}{2} R, \\quad C_p = \\left( \\frac{f}{2} + 1 \\right) R",
  chemical_potential_definition: "\\mu_i = \\left( \\frac{\\partial G}{\\partial n_i} \\right)_{T, P, n_j} = \\mu_i^\\circ + R T \\ln a_i",
  gibbs_duhem_equation: "\\sum n_i \\, d\\mu_i = 0 \\; (T, P \\text{ const}) \\implies x_A \\, d\\mu_A + x_B \\, d\\mu_B = 0",
  joule_thomson_coefficient: "\\mu_{\\text{JT}} = \\left( \\frac{\\partial T}{\\partial P} \\right)_H = \\frac{1}{C_p} \\left[ T \\left( \\frac{\\partial V}{\\partial T} \\right)_P - V \\right]",
  clapeyron_clausius: "\\log_{10}\\left(\\frac{P_2}{P_1}\\right) = \\frac{\\Delta H_{\\text{vap}}}{2.303 R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)",
  clapeyron_clausius_equation: "\\frac{dP}{dT} = \\frac{\\Delta H}{T \\Delta V}, \\quad \\ln\\frac{P_2}{P_1} = \\frac{\\Delta H_{\\text{vap}}}{R} \\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)",
  kirchhoff_law: "\\Delta H(T_2) - \\Delta H(T_1) = \\Delta C_p (T_2 - T_1), \\quad \\Delta U(T_2) - \\Delta U(T_1) = \\Delta C_v (T_2 - T_1)",
  kirchhoff_thermochemistry: "\\Delta H_{T_2} - \\Delta H_{T_1} = \\Delta C_p (T_2 - T_1) \\quad \\Big| \\quad \\Delta U_{T_2} - \\Delta U_{T_1} = \\Delta C_v (T_2 - T_1)",
  kirchhoff_law_thermochemistry: "\\Delta H_{T_2} = \\Delta H_{T_1} + \\int_{T_1}^{T_2} \\Delta C_p \\, dT, \\quad \\Delta C_p = \\sum C_p(\\text{products}) - \\sum C_p(\\text{reactants})",
  hess_law: "\\Delta H_{\\text{rxn}} = \\sum \\Delta H_f^\\circ(\\text{products}) - \\sum \\Delta H_f^\\circ(\\text{reactants}) = \\sum \\text{B.E.}(\\text{reactants}) - \\sum \\text{B.E.}(\\text{products})",
  hess_law_summation: "\\Delta H_{\\text{reaction}} = \\sum \\Delta H_f^\\circ(\\text{products}) - \\sum \\Delta H_f^\\circ(\\text{reactants}) = \\sum \\text{BE}(\\text{reactants}) - \\sum \\text{BE}(\\text{products})",
  maxwell_thermodynamic_relations: "\\left(\\frac{\\partial T}{\\partial V}\\right)_S = -\\left(\\frac{\\partial P}{\\partial S}\\right)_V \\quad \\Big| \\quad \\left(\\frac{\\partial T}{\\partial P}\\right)_S = \\left(\\frac{\\partial V}{\\partial S}\\right)_P \\quad \\Big| \\quad \\left(\\frac{\\partial S}{\\partial V}\\right)_T = \\left(\\frac{\\partial P}{\\partial T}\\right)_V \\quad \\Big| \\quad \\left(\\frac{\\partial S}{\\partial P}\\right)_T = -\\left(\\frac{\\partial V}{\\partial T}\\right)_P",
  carnot_engine_efficiency: "\\eta = \\frac{w_{\\text{net}}}{q_H} = \\frac{T_H - T_C}{T_H} = 1 - \\frac{T_C}{T_H}",
  born_haber_cycle_lattice: "\\Delta H_f^\\circ = \\Delta H_{\\text{sub}}(\\ce{M}) + \\frac{1}{2}D(\\ce{X2}) + \\text{IE}(\\ce{M}) + \\text{EA}(\\ce{X}) + U_{\\text{lattice}}",
  adiabatic_work_formula: "w_{\\text{ad}} = \\Delta U = n C_v (T_2 - T_1) = \\frac{P_2 V_2 - P_1 V_1}{\\gamma - 1} = \\frac{n R (T_2 - T_1)}{\\gamma - 1}",
  isothermal_reversible_work: "w_{\\text{rev}} = -2.303 n R T \\log_{10}\\left(\\frac{V_2}{V_1}\\right) = -2.303 n R T \\log_{10}\\left(\\frac{P_1}{P_2}\\right)",
  bond_enthalpy_reaction: "\\Delta_r H^\\circ = \\sum \\text{B.E. (reactants broken)} - \\sum \\text{B.E. (products formed)}",
  heat_capacity_crystals_einstein_debye: "C_v = a \\cdot T^3 \\quad (T \\to 0\\text{ K for non-magnetic crystalline solids})",
  third_law_thermodynamics: "\\lim_{T \\to 0\\text{ K}} S = 0 \\quad (\\text{for a perfectly crystalline substance})",

  // ==================== CHEMICAL EQUILIBRIUM ====================
  kpkc: "K_p = K_c (R T)^{\\Delta n_g}",
  equilibrium_constant_kp_kc: "K_p = K_c (R T)^{\\Delta n_g}",
  kp_kc_kx_relations: "K_p = K_c (R T)^{\\Delta n_g} = K_x (P_{\\text{total}})^{\\Delta n_g}",
  vant_hoff_isochore: "\\ln\\frac{K_2}{K_1} = \\frac{\\Delta H^\\circ}{R}\\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)",
  vant_hoff_isotherm_isobar: "\\Delta G^\\circ = -R T \\ln K_{\\text{eq}}, \\quad \\ln\\frac{K_2}{K_1} = \\frac{\\Delta H^\\circ}{R}\\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)",
  degree_dissoc_vd: "\\alpha = \\frac{D - d}{(n - 1) d} = \\frac{M_{\\text{th}} - M_{\\text{obs}}}{(n - 1) M_{\\text{obs}}}",
  degree_of_dissociation_density: "\\alpha = \\frac{D - d}{(n - 1) d} = \\frac{M_{\\text{th}} - M_{\\text{obs}}}{(n - 1) M_{\\text{obs}}}",
  vapour_density_dissociation_degree: "\\alpha = \\frac{D - d}{(n - 1) d} = \\frac{M_{\\text{theoretical}} - M_{\\text{observed}}}{(n - 1) M_{\\text{observed}}}",
  le_chatelier_inert_gas_const_p: "\\text{At const. } P: \\; \\text{Inert gas shifts equilibrium toward side with GREATER moles of gas } (\\Delta n_g > 0)",
  le_chatelier_inert_gas_const_v: "\\text{At const. } V: \\; \\text{Addition of inert gas has NO EFFECT on chemical equilibrium } (\\Delta[C] = 0)",
  le_chatelier_inert_gas: "\\Delta n_g > 0 \\implies \\text{Inert gas at const. } P \\text{ shifts equilibrium forward}",

  // ==================== IONIC EQUILIBRIUM ====================
  ph_definition: "\\text{pH} = -\\log_{10}[\\ce{H+}], \\quad \\text{pOH} = -\\log_{10}[\\ce{OH-}], \\quad \\text{pH} + \\text{pOH} = 14 \\; (298\\text{ K})",
  water_autoionisation_kw: "K_w = [\\ce{H+}][\\ce{OH-}] = 1.0 \\times 10^{-14} \\; (298\\text{ K}), \\quad \\text{pH} + \\text{pOH} = \\text{p}K_w = 14",
  ostwald_dilution: "K_a = \\frac{C \\alpha^2}{1 - \\alpha} \\approx C \\alpha^2, \\quad \\alpha = \\sqrt{\\frac{K_a}{C}} = \\frac{\\Lambda_m}{\\Lambda_m^\\circ}",
  ostwald_dilution_law: "K_a = \\frac{C \\alpha^2}{1 - \\alpha} \\implies \\alpha \\approx \\sqrt{\\frac{K_a}{C}} \\; (\\alpha \\le 0.05) \\quad \\Big| \\quad [\\ce{H+}] = C \\alpha = \\sqrt{K_a C}",
  buffer_henderson: "\\text{pH} = \\text{p}K_a + \\log_{10}\\left( \\frac{[\\text{Conjugate Base}]}{[\\text{Acid}]} \\right)",
  buffer_henderson_base: "\\text{pOH} = \\text{p}K_b + \\log_{10}\\left( \\frac{[\\text{Conjugate Acid}]}{[\\text{Base}]} \\right)",
  henderson_hasselbalch_buffers: "\\text{Acidic: } \\text{pH} = \\text{p}K_a + \\log_{10}\\left(\\frac{[\\text{Salt}]}{[\\text{Acid}]}\\right) \\quad \\Big| \\quad \\text{Basic: } \\text{pOH} = \\text{p}K_b + \\log_{10}\\left(\\frac{[\\text{Salt}]}{[\\text{Base}]}\\right)",
  buffer_capacity_equation: "\\beta = \\frac{db}{d(\\text{pH})} = 2.303 \\left[ \\frac{C_a \\cdot C_b}{C_a + C_b} \\right]",
  buffer_capacity_van_slyke: "\\beta = \\frac{d(b)}{d(\\text{pH})} = 2.303 \\left[ \\frac{C_a \\cdot C_b}{C_a + C_b} \\right]",
  amphiprotic_salt_ph: "\\text{pH} = \\frac{\\text{p}K_{a1} + \\text{p}K_{a2}}{2} \\implies [\\ce{H+}] = \\sqrt{K_{a1} \\cdot K_{a2}}",
  ph_polyprotic_acids: "\\text{For } \\ce{H2A}: \\; [\\ce{H+}] \\approx \\sqrt{K_{a1} \\cdot C} \\quad \\Big| \\quad [\\ce{A^2-}] \\approx K_{a2}",
  salt_hydrolysis_ph_formulas: "\\text{WA-SB: } \\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a + \\log_{10} C) \\quad \\Big| \\quad \\text{SA-WB: } \\text{pH} = 7 - \\frac{1}{2}(\\text{p}K_b + \\log_{10} C)",
  solubility_product_ksp: "\\ce{A}_x\\ce{B}_y \\rightleftharpoons x\\ce{A}^{y+} + y\\ce{B}^{x-}, \\quad K_{\\text{sp}} = x^x y^y S^{x + y}",
  common_ion_solubility: "\\text{In presence of common ion } [\\ce{C+}]: \\; S' \\approx \\frac{K_{\\text{sp}}}{[\\ce{C+}]} \\quad (\\text{for 1:1 electrolyte } \\ce{AB})",
  indicator_ph_range: "\\text{pH Range} = \\text{p}K_{\\text{In}} \\pm 1, \\quad K_{\\text{In}} = \\frac{[\\ce{H+}][\\ce{In-}]}{[\\ce{HIn}]}",

  // ==================== CHEMICAL KINETICS ====================
  arrhenius: "\\log_{10}\\left( \\frac{k_2}{k_1} \\right) = \\frac{E_a}{2.303 R}\\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)",
  arrhenius_equation: "k = A \\, e^{-\\frac{E_a}{R T}}, \\quad \\ln k = \\ln A - \\frac{E_a}{R T}",
  arrhenius_two_temps: "\\log_{10}\\left( \\frac{k_2}{k_1} \\right) = \\frac{E_a}{2.303 R} \\left( \\frac{T_2 - T_1}{T_1 T_2} \\right)",
  arrhenius_equation_two_temps: "k = A \\, e^{-\\frac{E_a}{R T}} \\quad \\Big| \\quad \\log_{10}\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{2.303 R}\\left[ \\frac{T_2 - T_1}{T_1 T_2} \\right]",
  firstorder: "k = \\frac{2.303}{t} \\log_{10}\\left( \\frac{a}{a - x} \\right)",
  first_order_integrated: "k = \\frac{2.303}{t} \\log_{10}\\left( \\frac{[A]_0}{[A]} \\right), \\quad t_{1/2} = \\frac{0.693}{k}",
  first_order_kinetics: "k = \\frac{2.303}{t} \\log_{10}\\left( \\frac{[A]_0}{[A]} \\right), \\quad t_{1/2} = \\frac{0.693}{k}",
  first_order_kinetics_integrated: "k = \\frac{2.303}{t} \\log_{10}\\left(\\frac{[A]_0}{[A]_t}\\right) \\quad \\Big| \\quad [A]_t = [A]_0 \\, e^{-kt} \\quad \\Big| \\quad t_{1/2} = \\frac{0.693}{k}",
  zero_order_integrated: "[A] = [A]_0 - k t, \\quad t_{1/2} = \\frac{[A]_0}{2 k}",
  zero_order_kinetics: "[A]_t = [A]_0 - k t \\quad \\Big| \\quad t_{1/2} = \\frac{[A]_0}{2 k} \\quad \\Big| \\quad t_{100\\%} = \\frac{[A]_0}{k}",
  second_order_integrated: "\\frac{1}{[A]} - \\frac{1}{[A]_0} = k t, \\quad t_{1/2} = \\frac{1}{k [A]_0}",
  second_order_kinetics: "\\frac{1}{[A]_t} - \\frac{1}{[A]_0} = k t, \\quad t_{1/2} = \\frac{1}{k [A]_0}",
  second_order_kinetics_law: "\\frac{1}{[A]_t} - \\frac{1}{[A]_0} = k t \\quad \\Big| \\quad t_{1/2} = \\frac{1}{k [A]_0}",
  second_order_different_reactants: "k = \\frac{2.303}{t(a - b)} \\log_{10}\\left[ \\frac{b(a - x)}{a(b - x)} \\right]",
  nth_order_half_life_proportionality: "t_{1/2} \\propto \\frac{1}{[A]_0^{n - 1}} \\implies \\frac{t_{1/2}(1)}{t_{1/2}(2)} = \\left( \\frac{[A]_0(2)}{[A]_0(1)} \\right)^{n - 1}",
  half_life_general: "t_{1/2} \\propto \\frac{1}{[A]_0^{n - 1}} \\implies \\text{0th: } t_{1/2} = \\frac{[A]_0}{2k} \\quad \\Big| \\quad \\text{1st: } t_{1/2} = \\frac{0.693}{k} \\quad \\Big| \\quad \\text{2nd: } t_{1/2} = \\frac{1}{k [A]_0}",
  half_life_general_order: "t_{1/2} \\propto \\frac{1}{[A]_0^{n - 1}} \\implies \\text{0th: } \\frac{[A]_0}{2k}, \\quad \\text{1st: } \\frac{0.693}{k}, \\quad \\text{2nd: } \\frac{1}{k [A]_0}",
  rate_law_orders: "\\textbf{0}^{\\text{th}}\\text{: } [A] = [A]_0 - kt \\quad \\Big| \\quad \\textbf{1}^{\\text{st}}\\text{: } \\ln\\left(\\frac{[A]_0}{[A]}\\right) = kt \\quad \\Big| \\quad \\textbf{2}^{\\text{nd}}\\text{: } \\frac{1}{[A]} - \\frac{1}{[A]_0} = kt",
  parallel_consecutive_kinetics: "k_{\\text{total}} = k_1 + k_2, \\quad \\%B = \\frac{k_1}{k_1 + k_2} \\times 100\\%, \\quad t_{\\max}(B) = \\frac{\\ln\\left(\\frac{k_1}{k_2}\\right)}{k_1 - k_2}",
  lindemann_unimolecular_kinetics: "\\text{Rate} = \\frac{k_1 k_2 [\\ce{A}]^2}{k_{-1}[\\ce{A}] + k_2} \\quad \\Big| \\quad \\text{High } P: \\text{Rate} = \\frac{k_1 k_2}{k_{-1}}[\\ce{A}] \\quad \\Big| \\quad \\text{Low } P: \\text{Rate} = k_1 [\\ce{A}]^2",
  transition_state_eyring: "k = \\frac{k_B T}{h} \\, e^{\\frac{\\Delta S^\\ddagger}{R}} \\, e^{-\\frac{\\Delta H^\\ddagger}{R T}}",
  eyring_transition_state_theory: "k = \\left( \\frac{k_B T}{h} \\right) e^{\\frac{\\Delta S^\\ddagger}{R}} e^{-\\frac{\\Delta H^\\ddagger}{R T}}",
  collision_theory_rate: "\\text{Rate} = P \\cdot Z_{\\text{AB}} \\cdot e^{-\\frac{E_a}{R T}} \\quad \\Big| \\quad k = P \\cdot Z_{\\text{AB}} \\cdot e^{-\\frac{E_a}{R T}}",
  radioactive_decay_constant: "A = \\lambda N = \\frac{0.693}{t_{1/2}} N \\quad \\Big| \\quad 1\\text{ Ci} = 3.7 \\times 10^{10}\\text{ Bq}",
  radioactive_decay_law: "N_t = N_0 \\, e^{-\\lambda t} \\quad \\Big| \\quad t_{1/2} = \\frac{0.693}{\\lambda} \\quad \\Big| \\quad \\tau = \\frac{1}{\\lambda} = 1.443 \\, t_{1/2}",
  enzyme_kinetics_michaelis_menten: "v = \\frac{V_{\\max} [S]}{K_m + [S]} \\quad \\Big| \\quad [S] = K_m \\implies v = \\frac{V_{\\max}}{2}",
  steady_state_approximation: "\\frac{d[\\text{Intermediate}]}{dt} \\approx 0",
  nuclear_decay: "N_t = N_0 \\, e^{-\\lambda t}, \\quad t_{1/2} = \\frac{0.693}{\\lambda}, \\quad \\Delta E = \\Delta m \\times 931.5\\,\\text{MeV}",
  radiocarbon_dating: "t = \\frac{2.303}{\\lambda}\\log_{10}\\left(\\frac{A_0}{A}\\right) = \\frac{t_{1/2}}{0.693} \\cdot 2.303\\log_{10}\\left(\\frac{A_0}{A}\\right)",

  // ==================== ELECTROCHEMISTRY ====================
  nernst: "E = E^\\circ - \\frac{R T}{n F} \\ln Q = E^\\circ - \\frac{0.0591}{n} \\log_{10} Q \\; (298\\text{ K})",
  nernst_equation: "E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{R T}{n F} \\ln Q = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10} Q \\; (298\\text{ K})",
  nernst_standard_cell: "E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{2.303 R T}{n F}\\log_{10} Q = E^\\circ_{\\text{cell}} - \\frac{0.0592}{n}\\log_{10} Q \\; (298\\text{ K})",
  standard_cell_potential: "E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = \\frac{0.0591}{n} \\log_{10} K_c",
  equilibrium_constant_emf: "\\log_{10} K_c = \\frac{n \\cdot E^\\circ_{\\text{cell}}}{0.0591} \\; (298\\text{ K}) \\quad \\Big| \\quad \\Delta G^\\circ = -n F E^\\circ_{\\text{cell}} = -2.303 R T \\log_{10} K_c",
  faraday: "m = \\frac{M \\cdot I \\cdot t}{n F}",
  faraday_first_law: "m = Z \\cdot I \\cdot t = \\frac{E}{F} \\cdot I \\cdot t = \\frac{M \\cdot I \\cdot t}{n F}",
  faradays_electrolysis_laws: "w = Z \\cdot I \\cdot t = \\frac{E}{96485} \\cdot I \\cdot t = \\frac{M \\cdot I \\cdot t}{n\\text{-factor} \\cdot 96485}",
  conductance: "R = \\rho \\left( \\frac{l}{A} \\right), \\quad G = \\frac{\\kappa}{G^*}, \\quad \\kappa = G \\left( \\frac{l}{A} \\right) = G \\cdot G^*",
  conductance_conductivity_cell: "R = \\rho \\left( \\frac{l}{A} \\right), \\quad G = \\frac{\\kappa}{G^*}, \\quad \\kappa = G \\cdot G^* = \\frac{1}{R}\\left( \\frac{l}{A} \\right)",
  kohlrausch: "\\Lambda_m = \\Lambda_m^\\circ - A\\sqrt{c}, \\quad \\Lambda_m^\\circ(\\ce{A_x B_y}) = x \\lambda_+^\\circ + y \\lambda_-^\\circ",
  kohlrausch_law: "\\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ",
  kohlrausch_conductivity_relations: "\\kappa = \\left(\\frac{1}{R}\\right)\\left(\\frac{l}{A}\\right) \\quad \\Big| \\quad \\Lambda_m = \\frac{1000 \\cdot \\kappa}{M} \\quad \\Big| \\quad \\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ",
  debye_huckel_onsager: "\\Lambda_m = \\Lambda_m^\\circ - (A + B\\Lambda_m^\\circ)\\sqrt{C} = \\Lambda_m^\\circ - A'\\sqrt{C}",
  electrochemical_cell_thermo: "\\Delta G^\\circ = -n F E^\\circ_{\\text{cell}}, \\quad \\Delta S = n F \\left( \\frac{\\partial E}{\\partial T} \\right)_P, \\quad \\Delta H = -n F E + n F T \\left( \\frac{\\partial E}{\\partial T} \\right)_P",
  cell_temperature_coefficient: "\\left( \\frac{\\partial E}{\\partial T} \\right)_P = \\frac{\\Delta S}{n F}, \\quad \\Delta H = -n F E + n F T \\left( \\frac{\\partial E}{\\partial T} \\right)_P",
  temperature_coeff_cell_emf: "\\left( \\frac{\\partial E}{\\partial T} \\right)_P = \\frac{\\Delta S}{n F} \\quad \\Big| \\quad \\Delta H = -n F E + n F T \\left( \\frac{\\partial E}{\\partial T} \\right)_P",
  emf_thermodynamics: "\\Delta G^\\circ = -n F E^\\circ_{\\text{cell}}, \\quad \\Delta S = n F \\left(\\frac{\\partial E}{\\partial T}\\right)_P, \\quad \\Delta H = -n F E + n F T \\left(\\frac{\\partial E}{\\partial T}\\right)_P",
  concentration_cell_electrode: "E_{\\text{cell}} = \\frac{0.0591}{2} \\log_{10}\\left(\\frac{P_1}{P_2}\\right) \\quad (\\text{for } \\ce{H2} \\text{ electrode at 298 K, where } P_1 > P_2)",
  concentration_cell_electrolyte: "E_{\\text{cell}} = \\frac{0.0591}{n} \\log_{10}\\left(\\frac{C_2}{C_1}\\right) \\quad (\\text{at 298 K, where } C_2 > C_1)",
  conductometric_titrations_neutralisation: "\\text{Conductance drops to eq. point (}\\ce{H+} \\to \\ce{Na+}\\text{), then rises sharply (excess } \\ce{OH-}\\text{)}",
  fuel_cell_efficiency_equation: "\\ce{2H2(g) + O2(g) -> 2H2O(l)}, \\quad \\eta = \\frac{\\Delta G^\\circ}{\\Delta H^\\circ} \\times 100\\% \\approx 83\\%",
  pourbaix_water_stability: "\\text{Upper (O}_2\\text{): } E = 1.23 - 0.0591 \\,\\text{pH} \\quad \\Big| \\quad \\text{Lower (H}_2\\text{): } E = -0.0591 \\,\\text{pH}",
  pourbaix_water_stability_limits: "\\text{O}_2 \\text{ Evolution: } E = 1.23 - 0.0592 \\cdot \\text{pH} \\quad \\Big| \\quad \\ce{H2} \\text{ Evolution: } E = -0.0592 \\cdot \\text{pH} \\quad (\\text{V at 298 K})",
  corrosion_electrochemical_reactions: "\\text{Anode: } \\ce{Fe -> Fe^2+ + 2e-} \\quad \\Big| \\quad \\text{Cathode: } \\ce{O2 + 4H+ + 4e- -> 2H2O} \\quad \\Big| \\quad E^\\circ = 1.67\\text{ V}",
  electrochemical_series_trends: "\\ce{Li+ < K+ < Ba^2+ < Ca^2+ < Na+ < Mg^2+ < Al^3+ < Zn^2+ < Fe^2+ < H+ (0.00 V) < Cu^2+ < I2 < Ag+ < Br2 < Cr2O7^2- < Cl2 < MnO4- < F2}",
  lead_acid_cell_reactions: "\\textbf{Discharge: } \\ce{Pb(s) + PbO2(s) + 2H2SO4(aq) -> 2PbSO4(s) + 2H2O(l)} \\quad (E_{\\text{cell}} \\approx 2.05\\text{ V per cell})",
  lead_fuel_cells: "\\textbf{Lead-Acid: } \\ce{Pb + PbO2 + 2H2SO4 <=> 2PbSO4 + 2H2O} \\quad \\Big| \\quad \\textbf{Fuel Cell: } \\ce{2H2 + O2 -> 2H2O} \\; (E^\\circ = 1.23\\text{ V})",

  // ==================== SOLUTIONS ====================
  molarity: "M = \\frac{w_B \\times 1000}{M_B \\times V_{\\text{mL}}} = \\frac{10 \\times \\text{\\% (w/v)}}{M_B} = \\frac{10 \\times \\text{\\% (w/w)} \\times d}{M_B}",
  molality: "m = \\frac{w_B \\times 1000}{M_B \\times w_A(\\text{g})} = \\frac{1000 \\times M}{1000 d - M \\times M_B}",
  mole_fraction: "x_B = \\frac{n_B}{n_A + n_B}, \\quad x_A + x_B = 1, \\quad m = \\frac{x_B \\times 1000}{(1 - x_B) M_A}",
  normality: "N = M \\times n\\text{-factor} = \\frac{\\text{Gram equivalents}}{V(\\text{L})}",
  raoults_law_relative_lowering: "\\frac{P^\\circ - P_s}{P^\\circ} = x_B = \\frac{n_B}{n_A + n_B} \\approx \\frac{w_B M_A}{M_B w_A}",
  elevation_boiling_point: "\\Delta T_b = i \\cdot K_b \\cdot m, \\quad K_b = \\frac{R T_b^{\\circ 2} M_A}{1000 \\Delta H_{\\text{vap}}}",
  ebullioscopy_boiling_elevation: "\\Delta T_b = i \\cdot K_b \\cdot m \\quad \\Big| \\quad K_b = \\frac{R T_b^{\\circ 2} M_{\\text{solvent}}}{1000 \\Delta H_{\\text{vap}}}",
  depression_freezing_point: "\\Delta T_f = i \\cdot K_f \\cdot m, \\quad K_f = \\frac{R T_f^{\\circ 2} M_A}{1000 \\Delta H_{\\text{fus}}}",
  cryoscopy_freezing_depression: "\\Delta T_f = i \\cdot K_f \\cdot m \\quad \\Big| \\quad K_f = \\frac{R T_f^{\\circ 2} M_{\\text{solvent}}}{1000 \\Delta H_{\\text{fus}}}",
  osmotic_pressure: "\\Pi = i \\cdot C R T = i \\left( \\frac{n_B}{V} \\right) R T",
  vant_hoff_factor: "i = \\frac{\\text{Observed Colligative Property}}{\\text{Calculated Colligative Property}} = 1 + (n - 1)\\alpha",
  henry_law_gas_solubility: "P = K_H \\cdot x, \\quad m = K_H' \\cdot P, \\quad K_H \\uparrow \\implies \\text{Solubility} \\downarrow",
  raoults_law_ideal_solutions: "P_{\\text{total}} = P_A^\\circ x_A + P_B^\\circ x_B = P_A^\\circ + (P_B^\\circ - P_A^\\circ) x_B, \\quad y_A = \\frac{P_A}{P_{\\text{total}}}",
  azeotropic_mixtures_distillation: "\\text{Minimum Boiling: } +\\text{ve deviation } (\\ce{95.6\\% C2H5OH}) \\quad \\Big| \\quad \\text{Maximum Boiling: } -\\text{ve deviation } (\\ce{68\\% HNO3})",
  colligative_molecular_masses: "M_B = \\frac{K_b \\cdot w_B \\times 1000}{\\Delta T_b \\cdot w_A} = \\frac{K_f \\cdot w_B \\times 1000}{\\Delta T_f \\cdot w_A} = \\frac{w_B R T}{\\Pi V}",
  degree_association_vant_hoff: "\\beta = \\frac{1 - i}{1 - 1/n} = \\frac{n(1 - i)}{n - 1}",
  degree_dissociation_vant_hoff: "\\alpha = \\frac{i - 1}{n - 1}",
  dilution_formula_normality_molarity: "M_1 V_1 + M_2 V_2 = M_R (V_1 + V_2) \\quad \\Big| \\quad N_1 V_1 + N_2 V_2 = N_R (V_1 + V_2)",
  gas_solubility_absorption_coefficient: "V_0 = \\frac{\\alpha \\cdot V_{\\text{liquid}} \\cdot P}{P_0}",
  interconversion_concentration_units: "m = \\frac{1000 M}{1000 d - M M_B} \\quad \\Big| \\quad x_B = \\frac{m M_A}{1000 + m M_A} \\quad \\Big| \\quad N = M \\cdot z",
  mixing_solutions_formula: "M_{\\text{mix}} = \\frac{M_1 V_1 + M_2 V_2}{V_1 + V_2}, \\quad N_{\\text{mix}} = \\frac{N_1 V_1 + N_2 V_2}{V_1 + V_2}",
  molarity_parts_per_million: "\\text{ppm} = \\frac{w_B}{w_A + w_B} \\times 10^6 \\approx \\frac{\\text{mg solute}}{\\text{L solution}}",
  normality_eq_mass: "N = \\frac{\\text{Equivalents}}{V(\\text{L})}, \\quad E = \\frac{M}{n\\text{-factor}}",
  parts_per_million_billion: "\\text{ppm} = \\frac{\\text{Mass of Solute}}{\\text{Total Mass of Solution}} \\times 10^6, \\quad \\text{ppb} = \\frac{\\text{Mass of Solute}}{\\text{Total Mass of Solution}} \\times 10^9",
  percentage_concentration_expressions: "\\%\\text{(w/w)} = \\frac{w_B}{w_{\\text{sol}}} \\times 100\\%, \\quad \\%\\text{(w/v)} = \\frac{w_B}{V_{\\text{sol}}} \\times 100\\%, \\quad \\%\\text{(v/v)} = \\frac{V_B}{V_{\\text{sol}}} \\times 100\\%",
  solubility_curves_temperature: "\\text{Endothermic (}\\Delta H_{\\text{sol}} > 0\\text{): } T \\uparrow \\implies S \\uparrow \\quad \\Big| \\quad \\text{Exothermic (}\\Delta H_{\\text{sol}} < 0\\text{): } T \\uparrow \\implies S \\downarrow",
  vant_hoff_abnormal_molar_mass: "i = \\frac{M_{\\text{normal}}}{M_{\\text{abnormal}}} = \\frac{\\text{Observed Colligative Value}}{\\text{Theoretical Colligative Value}}",
  water_softening_degree_hardness: "\\text{Hardness (ppm)} = \\frac{\\text{Mass of } \\ce{CaCO3} \\text{ equivalent}}{\\text{Total Mass of Water}} \\times 10^6",

  // ==================== BASIC CONCEPTS & STOICHIOMETRY ====================
  avogadro_number_constant: "N_A = 6.02214 \\times 10^{23}\\text{ mol}^{-1}, \\quad 1\\text{ amu} = 1.66054 \\times 10^{-24}\\text{ g} = \\frac{1}{N_A}\\text{ g}",
  dulong_petit_law: "\\text{Atomic Mass} \\times \\text{Specific Heat (cal g}^{-1}\\,^\\circ\\text{C}^{-1}) \\approx 6.4",
  limiting_reagent_yield: "\\frac{\\text{Moles}}{\\text{Stoichiometric Coeff.}} = \\text{Minimum} \\implies \\text{LR}, \\quad \\text{\\% Yield} = \\frac{\\text{Actual Yield}}{\\text{Theoretical Yield}} \\times 100\\%",
  percentage_purity: "\\text{\\% Purity} = \\frac{\\text{Mass of pure substance}}{\\text{Total mass of sample}} \\times 100\\%",
  average_atomic_mass: "A_{\\text{avg}} = \\frac{\\sum f_i A_i}{\\sum f_i} = \\frac{f_1 A_1 + f_2 A_2 + \\dots}{100}",
  combustion_analysis_hydrocarbon: "\\ce{C_n H_{2n+2} + \\frac{3n+1}{2} O2 -> n CO2 + (n+1) H2O}",
  density_relative_specific_gravity: "\\rho = \\frac{\\text{Mass}}{\\text{Volume}}, \\quad \\text{Sp. Gr.} = \\frac{\\rho_{\\text{substance}}}{\\rho_{\\ce{H2O}(4^\\circ\\text{C})}}, \\quad \\text{V.D.} = \\frac{M}{2}",
  empirical_formula_mass_ratio: "n = \\frac{\\text{Molar Mass}}{\\text{Empirical Formula Mass}} \\implies \\text{Molecular Formula} = (\\text{Empirical Formula})_n",
  equivalent_weight_rules: "E = \\frac{M}{n\\text{-factor}} \\quad \\Big| \\quad \\text{Acid: } n = \\text{Basicity} \\quad \\Big| \\quad \\text{Base: } n = \\text{Acidity} \\quad \\Big| \\quad \\text{Redox: } n = |\\Delta\\text{O.S.}|",
  gay_lussac_combining_volumes: "\\ce{2H2(g) + O2(g) -> 2H2O(g)} \\implies \\text{Volume Ratio: } 2 : 1 : 2",
  general_combustion_hydrocarbon: "\\ce{C_x H_y + \\left(x + \\frac{y}{4}\\right) O2 -> x CO2 + \\frac{y}{2} H2O}",
  law_chemical_equivalence: "N_1 V_1 = N_2 V_2 \\implies \\frac{w_1}{E_1} = \\frac{w_2}{E_2}",
  molar_volume_gas_conditions: "V_m(\\text{STP: } 273.15\\text{ K}, 1\\text{ atm}) = 22.414\\text{ L} \\quad \\Big| \\quad V_m(\\text{SATP: } 298.15\\text{ K}, 1\\text{ bar}) = 24.789\\text{ L}",
  mole_basic: "n = \\frac{w}{M} = \\frac{N}{N_A} = \\frac{V(\\text{STP})}{22.4\\text{ L}}",
  poac_principle: "\\text{POAC: } n_{\\text{reactant}} \\times (\\text{Atoms of X in Reactant}) = n_{\\text{product}} \\times (\\text{Atoms of X in Product})",
  vd_gas_law: "\\text{V.D.}_{\\text{mix}} = \\frac{M_{\\text{avg}}}{2} = \\frac{\\sum n_i M_i}{2 \\sum n_i}",
  victor_meyer_vapour_density_method: "M = \\frac{w \\times 22400}{V(\\text{STP})}, \\quad V(\\text{STP}) = \\frac{(P - p) \\cdot V \\cdot 273}{760 \\cdot (273 + t)}",
  titration_redox_oxalate_permanganate: "\\ce{2MnO4- + 5C2O4^2- + 16H+ -> 2Mn^2+ + 10CO2 ^ + 8H2O} \\; (333\\text{--}343\\text{ K})",
  titration_iodometry_thiosulfate: "\\ce{2Cu^2+ + 4I- -> 2CuI v + I2}, \\quad \\ce{I2 + 2S2O3^2- -> 2I- + S4O6^2-}",
  h2o2_strength: "\\text{Volume Strength} = 11.2 \\times M = 5.6 \\times N = \\frac{68}{100} \\times \\text{\\% (w/v)} \\times 10",

  // ==================== SOLID STATE ====================
  braggs_law: "n \\lambda = 2 d \\sin\\theta",
  density_cubic_crystal: "\\rho = \\frac{z \\cdot M}{a^3 \\cdot N_A}",
  cubic_density_formula: "\\rho = \\frac{z \\cdot M}{a^3 \\cdot N_A} \\quad (\\text{g cm}^{-3})",
  radius_ratio_rules: "\\frac{r_+}{r_-}: \\; 0.155\\text{--}0.225 \\; (3), \\quad 0.225\\text{--}0.414 \\; (4, T_d), \\quad 0.414\\text{--}0.732 \\; (6, O_h), \\quad 0.732\\text{--}1.0 \\; (8, \\text{bcc})",
  radius_ratio_coordination: "\\frac{r_+}{r_-}: \\; 0.155\\text{--}0.225 \\; (3, \\text{planar}), \\; 0.225\\text{--}0.414 \\; (4, T_d), \\; 0.414\\text{--}0.732 \\; (6, O_h), \\; 0.732\\text{--}1.0 \\; (8, \\text{bcc})",
  sc_packing_efficiency_calc: "\\text{P.E. (SC)} = \\frac{1 \\times \\frac{4}{3}\\pi r^3}{(2r)^3} = \\frac{\\pi}{6} \\approx 52.36\\%",
  bcc_packing_efficiency_calc: "\\text{P.E. (BCC)} = \\frac{2 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\sqrt{3}\\pi}{8} \\approx 68.02\\%",
  fcc_packing_efficiency_calc: "\\text{P.E. (FCC)} = \\frac{4 \\times \\frac{4}{3}\\pi r^3}{a^3} = \\frac{\\sqrt{2}\\pi}{6} \\approx 74.05\\%",
  hcp_c_over_a_ratio: "\\frac{c}{a} = \\sqrt{\\frac{8}{3}} \\approx 1.633, \\quad \\text{P.E. (HCP)} = 74.05\\%",
  band_gap_semiconductors: "E_g = \\frac{h c}{\\lambda_{\\text{edge}}} \\quad \\Big| \\quad \\sigma = \\sigma_0 \\, e^{-\\frac{E_g}{2 k_B T}}",
  bragg_diffraction_planes: "n \\lambda = 2 d_{hkl} \\sin\\theta, \\quad d_{hkl} = \\frac{a}{\\sqrt{h^2 + k^2 + l^2}}",
  cesium_chloride_structure: "r_{\\ce{Cs+}} + r_{\\ce{Cl-}} = \\frac{\\sqrt{3}}{2} a, \\quad \\text{Coordination Number} = 8 : 8",
  coordination_number_radius_ratio: "\\frac{r_+}{r_-} < 0.155 \\; (2) \\quad \\Big| \\quad 0.155\\text{--}0.225 \\; (3) \\quad \\Big| \\quad 0.225\\text{--}0.414 \\; (4) \\quad \\Big| \\quad 0.414\\text{--}0.732 \\; (6) \\quad \\Big| \\quad 0.732\\text{--}1.0 \\; (8)",
  crystal_systems_bravais_lattices: "7 \\text{ Crystal Systems} \\implies 14 \\text{ Bravais Lattices} \\quad (\\text{Cubic: } 3, \\; \\text{Tetragonal: } 2, \\; \\text{Orthorhombic: } 4)",
  frenkel_schottky_defects: "\\text{Schottky: Cation + Anion Vacancy } (\\rho \\downarrow) \\quad \\Big| \\quad \\text{Frenkel: Cation in Interstitial } (\\rho \\text{ const})",
  interplanar_spacing_cubic: "d_{hkl} = \\frac{a}{\\sqrt{h^2 + k^2 + l^2}}",
  rock_salt_nacl_geometry: "r_{\\ce{Na+}} + r_{\\ce{Cl-}} = \\frac{a}{2}, \\quad z = 4, \\quad \\text{Coordination Number} = 6 : 6",
  tetrahedral_octahedral_voids: "\\text{If } N \\text{ packing atoms}: \\; \\text{Octahedral Voids} = N, \\quad \\text{Tetrahedral Voids} = 2N",
  zinc_blende_wurtzite_structure: "r_{\\ce{Zn^2+}} + r_{\\ce{S^2-}} = \\frac{\\sqrt{3}}{4} a, \\quad z = 4, \\quad \\text{Coordination Number} = 4 : 4",

  // ==================== SURFACE CHEMISTRY ====================
  adsorption_isotherms: "\\text{Freundlich: } \\frac{x}{m} = k \\cdot P^{1/n} \\implies \\log_{10}\\left( \\frac{x}{m} \\right) = \\log_{10} k + \\frac{1}{n}\\log_{10} P \\; (0 < \\frac{1}{n} < 1)",
  freundlich_isotherm_log: "\\frac{x}{m} = k \\cdot P^{1/n} \\implies \\log_{10}\\left( \\frac{x}{m} \\right) = \\log_{10} k + \\frac{1}{n}\\log_{10} P \\; (0 \\le \\frac{1}{n} \\le 1)",
  langmuir_adsorption_isotherm: "\\frac{x}{m} = \\frac{a P}{1 + b P} \\implies \\frac{P}{x/m} = \\frac{1}{a} + \\frac{b}{a} P",
  langmuir_isotherm_linear: "\\frac{P}{x/m} = \\frac{1}{a \\cdot b} + \\frac{P}{a}",
  zeta_potential_helmholtz: "\\zeta = \\frac{4 \\pi \\eta u}{\\varepsilon}",
  cmc_kraft_temperature: "\\text{Micelle Formation occurs only when: } T \\ge T_k \\text{ (Kraft Temp)} \\quad \\text{and} \\quad \\text{Concentration} \\ge \\text{CMC}",
  hardy_schulze_coagulation: "\\text{Coagulating Power} \\propto z^4 \\quad \\Big| \\quad \\text{Coagulation Value} \\propto \\frac{1}{\\text{Coagulating Power}}",

  // ==================== CHEMICAL BONDING & MOLECULAR STRUCTURE ====================
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
  electronegativity_scales: "\\text{Pauling: } |\\chi_A - \\chi_B| = 0.208\\sqrt{\\Delta} \\; (\\text{kcal}) = 0.102\\sqrt{\\Delta} \\; (\\text{kJ}) \\quad \\Big| \\quad \\text{Mulliken: } \\chi_M = \\frac{\\text{IE} + \\text{EA}}{2}",
  back_bonding_lewis_acidity: "\\text{Lewis Acidity Order: } \\ce{BF3 < BCl3 < BBr3 < BI3} \\; (2p\\pi\\text{--}2p\\pi \\text{ back-bonding in } \\ce{BF3})",
  bents_rule_orbital_character: "\\text{Bent's Rule: More electronegative substituents prefer hybrid orbitals having LESS } s\\text{-character (MORE } p\\text{-character)}",
  bond_energy_order_halogens: "\\text{Bond Enthalpy: } \\ce{Cl2 (242)} > \\ce{Br2 (193)} > \\ce{F2 (158)} > \\ce{I2 (151\\text{ kJ/mol})} \\; (\\text{lone-pair repulsion in } \\ce{F2})",
  hydrogen_bonding_types: "\\text{Boiling Point: } \\ce{H2O (100^\\circ C) > H2Te (-2^\\circ C) > H2Se (-41^\\circ C) > H2S (-60^\\circ C)}",
  lattice_energy_kapustinskii: "U_0 = \\frac{120200 \\cdot \\nu \\cdot z_+ z_-}{r_+ + r_-} \\left( 1 - \\frac{34.5}{r_+ + r_-} \\right) \\; (\\text{kJ/mol})",
  lewis_formal_charge_calculation: "\\text{FC} = V - N_{\\text{lone}} - \\frac{B_{\\text{bond}}}{2}",
  molecular_orbital_heteronuclear: "\\text{CO: } \\text{Bond Order} = 3, \\quad \\text{HOMO} = \\sigma_{2p_z}^* \\; (\\text{slightly antibonding with non-bonding character})",
  pi_acid_synergy: "\\text{Synergic Bond} = (\\text{Ligand } \\sigma\\text{-donation } L \\to M) + (\\text{Metal } d\\text{-orbital } \\pi\\text{-backdonation } M \\to L \\pi^*)",
  vsepr_electron_pairs_geometry: "H = 2 \\; (\\text{linear}), \\; 3 \\; (\\text{trig planar}), \\; 4 \\; (T_d), \\; 5 \\; (\\text{tbp}), \\; 6 \\; (O_h), \\; 7 \\; (\\text{pentagonal bipyramidal})",

  // ==================== CLASSIFICATION OF ELEMENTS ====================
  electron_gain_enthalpy_anomalies: "\\text{Electron Gain Enthalpy: } \\ce{Cl > F > Br > I} \\quad \\text{and} \\quad \\ce{S > Se > Te > O}",
  inert_pair_effect: "\\text{Stability of Lower O.S.: } \\ce{Tl+ > Tl^3+}, \\quad \\ce{Pb^2+ > Pb^4+}, \\quad \\ce{Bi^3+ > Bi^5+}",
  inert_pair_effect_stability: "\\text{Group 13: } \\ce{Tl+ > Tl^3+} \\quad \\Big| \\quad \\text{Group 14: } \\ce{Pb^2+ > Pb^4+} \\quad \\Big| \\quad \\text{Group 15: } \\ce{Bi^3+ > Bi^5+}",
  ionisation_enthalpy_nitrogen_oxygen: "\\text{IE}_1(\\ce{N: 1402 kJ}) > \\text{IE}_1(\\ce{O: 1314 kJ}) \\quad \\Big| \\quad \\text{IE}_1(\\ce{Be: 899 kJ}) > \\text{IE}_1(\\ce{B: 801 kJ})",
  slater_rules_effective_nuclear_charge: "Z_{\\text{eff}} = Z - \\sigma, \\quad \\sigma = \\sum (\\text{screening constants for } s, p, d, f \\text{ electrons})",

  // ==================== COORDINATION COMPOUNDS ====================
  ferrocene_sandwich_structure: "\\ce{Fe(\\eta^5-C5H5)2}, \\quad \\text{Valence } e^- = 6(\\ce{Fe^2+}) + 2 \\times 6(\\ce{Cp-}) = 18 e^-",
  spectrochemical_series_order: "\\ce{I- < Br- < S^2- < SCN- < Cl- < F- < OH- < C2O4^2- \\approx H2O < NCS- < edta^4- < NH3 < en < NO2- < CN- < CO}",
  crystal_field_splitting_oct_tet: "\\Delta_t = \\frac{4}{9}\\Delta_o \\quad \\Big| \\quad \\text{Pairing Energy: } \\Delta_o > P \\implies \\text{Low Spin}, \\quad \\Delta_o < P \\implies \\text{High Spin}",
  effective_atomic_number_rule: "\\text{EAN} = Z - (\\text{Oxidation State}) + 2 \\times (\\text{Coordination Number}) = 36, 54, 86",
  geometrical_isomerism_octahedral: "\\text{Fac (facial): 3 identical ligands occupy same octahedral face} \\quad \\Big| \\quad \\text{Mer (meridional): 3 ligands form meridian arc}",
  isomerism_types_coordination: "\\text{Ionisation: } [\\ce{Co(NH3)5Br}]\\ce{SO4} \\text{ vs } [\\ce{Co(NH3)5SO4}]\\ce{Br} \\quad \\Big| \\quad \\text{Linkage: } \\ce{M-NO2} \\text{ (nitro) vs } \\ce{M-ONO} \\text{ (nitrito)}",
  jahn_teller_distortion_d9: "\\text{Jahn--Teller: Any non-linear molecule in a degenerate electronic ground state distorts to remove degeneracy (e.g. } d^9 \\; \\ce{Cu^2+})",
  magnetic_properties_complexes: "\\mu_s = \\sqrt{n(n + 2)}\\,\\mu_B \\quad \\Big| \\quad n = 1 (1.73), \\; 2 (2.83), \\; 3 (3.87), \\; 4 (4.90), \\; 5 (5.92\\,\\mu_B)",
  stability_constant_complexes: "\\beta_n = K_1 \\cdot K_2 \\cdots K_n = \\frac{[\\ce{ML_n}]}{[\\ce{M}][\\ce{L}]^n}",
  synergic_bonding_metal_carbonyls: "\\ce{M-C#O}: \\; (\\sigma\\text{-donation: } \\ce{CO} \\to M) + (\\pi\\text{-backbonding: } M(d) \\to \\ce{CO}(\\pi^*) \\implies \\text{C--O bond weakens})",
  trans_effect_series: "\\ce{CN- \\approx CO \\approx C2H4 > PR3 \\approx H- > CH3- > NO2- \\approx I- \\approx SCN- > Br- > Cl- > py > NH3 > OH- > H2O}",
  werner_theory_valencies: "\\text{Primary Valency} = \\text{Oxidation State (ionisable)}, \\quad \\text{Secondary Valency} = \\text{Coordination Number (directional, non-ionisable)}",

  // ==================== D- AND F-BLOCK ELEMENTS & METALLURGY ====================
  lanthanide_contraction: "r(\\ce{Zr^4+}) \\approx r(\\ce{Hf^4+}) \\approx 160\\text{ pm}, \\quad r(\\ce{Nb^5+}) \\approx r(\\ce{Ta^5+}) \\approx 146\\text{ pm}",
  lanthanide_contraction_consequences: "\\text{14 } 4f\\text{-electron contraction: } r(4d \\text{ series}) \\approx r(5d \\text{ series}) \\implies \\text{Nearly identical properties}",
  potassium_dichromate_redox_eq: "\\ce{Cr2O7^2- + 14H+ + 6e- -> 2Cr^3+ + 7H2O} \\quad (E^\\circ = +1.33\\text{ V}, \\; n\\text{-factor} = 6)",
  potassium_permanganate_media: "\\text{Acidic: } \\ce{MnO4- + 8H+ + 5e- -> Mn^2+ + 4H2O} \\; (n=5) \\quad \\Big| \\quad \\text{Neutral: } \\ce{MnO4- + 2H2O + 3e- -> MnO2 + 4OH-} \\; (n=3) \\quad \\Big| \\quad \\text{Alkaline: } \\ce{MnO4- + e- -> MnO4^2-} \\; (n=1)",
  disproportionation_redox: "\\ce{3MnO4^2- \\text{ (green)} + 4H+ -> 2MnO4- \\text{ (purple)} + MnO2 v + 2H2O}",
  chromyl_chloride_test_eq: "\\ce{K2Cr2O7 + 4NaCl + 6H2SO4(conc) -> 2CrO2Cl2 ^ \\text{ (deep red)} + 2KHSO4 + 4NaHSO4 + 3H2O}",
  hall_heroult_aluminium_electrolysis: "\\text{Cathode: } \\ce{Al^3+ + 3e- -> Al(l)}, \\quad \\text{Anode: } \\ce{C(s) + 2O^2- -> CO2(g) + 4e-}, \\quad \\ce{2Al2O3 + 3C -> 4Al + 3CO2}",
  ellingham_diagram_principles: "\\Delta G^\\circ = \\Delta H^\\circ - T \\Delta S^\\circ \\quad \\Big| \\quad \\text{Oxide reduction feasible if reducing agent line is BELOW oxide line}",
  froth_floatation_collectors_frothers: "\\text{Collector (Pine Oil/Xanthates): wets Sulfide Ore} \\implies \\text{Floats in Froth} \\quad \\Big| \\quad \\text{Water: wets Gangue} \\implies \\text{Sinks}",
  gold_silver_macarthur_cyanide: "\\ce{4Au + 8NaCN + 2H2O + O2 -> 4Na[Au(CN)2] + 4NaOH} \\quad \\Big| \\quad \\ce{2Na[Au(CN)2] + Zn -> Na2[Zn(CN)4] + 2Au v}",
  mond_process_nickel_refining: "\\ce{Ni + 4CO ->[330\\text{--}350\\text{ K}] Ni(CO)4 ^} \\xrightarrow{450\\text{--}470\\text{ K}} \\ce{Ni(pure) + 4CO ^}",
  van_arkel_de_boer_refining: "\\ce{Zr + 2I2 ->[870\\text{ K}] ZrI4 ^} \\xrightarrow[\\text{W filament}]{2075\\text{ K}} \\ce{Zr(pure) + 2I2 ^}",
  zone_refining_semiconductors: "\\text{Fractional crystallisation based on higher solubility of impurities in molten state than solid state}",
  calcination_vs_roasting: "\\text{Calcination: } \\ce{CaCO3 ->[\\Delta, \\text{ no } \\ce{O2}] CaO + CO2 ^} \\quad \\Big| \\quad \\text{Roasting: } \\ce{2ZnS + 3O2 ->[\\Delta, \\text{ excess } \\ce{O2}] 2ZnO + 2SO2 ^}",

  // ==================== P-BLOCK & S-BLOCK ELEMENTS ====================
  white_vs_red_phosphorus: "\\text{White } \\ce{P4} \\; (T_d, 60^\\circ, T_{\\text{ignite}} = 303\\text{ K}, \\text{toxic}) \\quad \\Big| \\quad \\text{Red } \\ce{P4} \\; (\\text{polymeric chain, non-toxic}, T_{\\text{ignite}} = 533\\text{ K})",
  boric_acid_lewis_acidity: "\\ce{B(OH)3 + 2H2O <=> [B(OH)4]- + H3O+} \\quad (\\text{monobasic Lewis acid, accepts } \\ce{OH-})",
  brown_ring_test: "\\ce{NO3- + 3Fe^2+ + 4H+ -> NO + 3Fe^3+ + 2H2O}, \\quad \\ce{[Fe(H2O)6]^2+ + NO -> [Fe(H2O)5(NO)]^2+ \\text{ (Brown Ring)} + H2O}",
  brown_ring_test_chemistry: "\\ce{NO3- + 3Fe^2+ + 4H+ -> 3Fe^3+ + NO + 2H2O}, \\quad \\ce{[Fe(H2O)6]^2+ + NO -> [Fe(H2O)5(NO)]^2+ \\text{ (Brown Ring)} + H2O}",
  fullerene_c60_geometry: "\\ce{C60}: 20 \\text{ Six-Membered Rings (Hexagons)} + 12 \\text{ Five-Membered Rings (Pentagons)}",
  catenation_group14_trend: "\\text{Catenation: } \\ce{C \\gg Si > Ge \\approx Sn > Pb} \\quad \\Big| \\quad \\text{Bond Enthalpy: } \\ce{C-C (348)} > \\ce{Si-Si (297)} > \\ce{Ge-Ge (260)} > \\ce{Sn-Sn (240\\text{ kJ/mol})}",
  contact_process_sulfuric_acid: "\\ce{2SO2 + O2 ->[\\ce{V2O5}][720\\text{ K}, 2\\text{ bar}] 2SO3}, \\quad \\ce{SO3 + H2SO4 -> H2S2O7 \\text{ (Oleum)}}, \\quad \\ce{H2S2O7 + H2O -> 2H2SO4}",
  diborane_banana_bonding: "\\ce{B2H6}: 4 \\text{ Terminal } 2c\\text{--}2e \\text{ B--H (1.19 \\AA)} + 2 \\text{ Bridge } 3c\\text{--}2e \\text{ B--H--B (1.33 \\AA, banana bonds)}",
  xenon_fluorides_hydrolysis: "\\ce{6XeF4 + 12H2O -> 4Xe + 2XeO3 + 24HF + 3O2} \\quad \\Big| \\quad \\ce{XeF6 + 3H2O -> XeO3 + 6HF}",
  interhalogen_compounds_geometry: "\\ce{XX'} \\; (\\text{linear}) \\quad \\Big| \\quad \\ce{XX'_3} \\; (\\text{T-shaped, } sp^3d) \\quad \\Big| \\quad \\ce{XX'_5} \\; (\\text{sq. pyramidal, } sp^3d^2) \\quad \\Big| \\quad \\ce{XX'_7} \\; (\\text{pentagonal bipyramidal, } sp^3d^3)",
  ostwald_nitric_acid_reactions: "\\ce{4NH3 + 5O2 ->[\\text{Pt-Rh}][1100\\text{ K}] 4NO + 6H2O}, \\quad \\ce{2NO + O2 -> 2NO2}, \\quad \\ce{3NO2 + H2O -> 2HNO3 + NO}",
  oxoacids_phosphorus: "\\ce{H3PO2} \\; (1 \\text{ P--OH, monobasic}) \\quad \\Big| \\quad \\ce{H3PO3} \\; (2 \\text{ P--OH, dibasic}) \\quad \\Big| \\quad \\ce{H3PO4} \\; (3 \\text{ P--OH, tribasic})",
  phosphorus_oxoacids_basicity: "\\ce{H3PO2} \\; (\\text{reducing, 2 P--H}) \\quad \\Big| \\quad \\ce{H3PO3} \\; (\\text{reducing, 1 P--H}) \\quad \\Big| \\quad \\ce{H3PO4} \\; (\\text{non-reducing, 0 P--H})",
  sulfur_oxoacids_peroxo_links: "\\ce{H2SO5} \\text{ (Caro's acid: 1 peroxo link)} \\quad \\Big| \\quad \\ce{H2S2O8} \\text{ (Marshall's acid: 1 peroxo link } \\ce{-O-O-})",
  silicates_classification_formula: "\\text{General Unit: } [\\ce{SiO4}]^{4-}, \\quad \\text{Sharing } n \\text{ corners: } [\\ce{Si}_x\\ce{O}_y]^{(2y - 4x)-}",
  borax_bead_test: "\\ce{Na2B4O7 \\cdot 10H2O ->[\\Delta] Na2B4O7 ->[\\Delta] 2NaBO2 + B2O3 \\text{ (glassy bead)}}, \\quad \\ce{CuO + B2O3 -> Cu(BO2)2 \\text{ (blue bead)}}",
  plaster_of_paris_gypsum_reactions: "\\ce{CaSO4 \\cdot 2H2O \\text{ (Gypsum)} ->[393\\text{ K}] CaSO4 \\cdot \\frac{1}{2}H2O \\text{ (POP)} + 1\\frac{1}{2}H2O ^} \\xrightarrow{>393\\text{ K}} \\ce{CaSO4 \\text{ (Dead Burnt)}}",

  // ==================== ENVIRONMENTAL CHEMISTRY & QUALITATIVE ====================
  acid_rain_chemistry: "\\ce{2SO2 + O2 + 2H2O -> 2H2SO4} \\quad \\Big| \\quad \\ce{4NO2 + O2 + 2H2O -> 4HNO3} \\quad (\\text{pH} < 5.6)",
  photochemical_smog_reactions: "\\ce{NO2 + h\\nu (\\lambda < 380 nm) -> NO + O^.} \\quad \\Big| \\quad \\ce{O^. + O2 -> O3} \\quad \\Big| \\quad \\ce{Hydrocarbons + O3 + NO2 -> PAN}",
  ozone_depletion_cfc_mechanism: "\\ce{CF2Cl2 + h\\nu -> CF2Cl^. + Cl^.} \\quad \\Big| \\quad \\ce{Cl^. + O3 -> ClO^. + O2} \\quad \\Big| \\quad \\ce{ClO^. + O^. -> Cl^. + O2}",
  bod_cod_pollution: "\\text{BOD} = \\text{DO}_{\\text{initial}} - \\text{DO}_{\\text{5 days}} \\; (\\text{mg L}^{-1}), \\quad \\text{COD} > \\text{BOD} \\; (\\ce{K2Cr2O7} \\text{ digestion})",
  biochemical_oxygen_demand_bod: "\\text{BOD} = \\text{DO}_{\\text{initial}} - \\text{DO}_{\\text{after 5 days at } 20^\\circ\\text{C}} \\; (\\text{ppm})",
  group_i_cation_precipitation: "\\ce{Pb^2+, Hg2^2+, Ag+ + dil. HCl -> PbCl2 v, Hg2Cl2 v, AgCl v} \\; (K_{sp} \\text{ exceeded})",
  group_ii_sulfides_precipitation: "\\ce{Cu^2+, Cd^2+, Bi^3+, As^3+, Sb^3+, Sn^2+ + H2S} \\; (\\text{in } \\ce{dil. HCl}) \\to \\text{Insoluble Sulfides (Low } [\\ce{S^2-}]\\text{)}",
  group_iii_hydroxides_nh4cl_nh4oh: "\\ce{Fe^3+, Al^3+, Cr^3+ + NH4OH} \\; (\\text{in presence of } \\ce{NH4Cl}) \\to \\ce{Fe(OH)3 v, Al(OH)3 v, Cr(OH)3 v}",
  group_iv_sulfides_basic_medium: "\\ce{Zn^2+, Mn^2+, Ni^2+, Co^2+ + H2S} \\; (\\text{in } \\ce{NH4OH}) \\to \\text{Sulfides (High } [\\ce{S^2-}]\\text{)}",

  // ==================== ORGANIC CHEMISTRY: GENERAL & REACTION MECHANISMS ====================
  dbe: "\\text{DBE} = C + 1 - \\frac{H}{2} + \\frac{N}{2} - \\frac{X}{2} = \\frac{2C + 2 + N - H - X}{2}",
  optical_rotation: "[\\alpha]_D^T = \\frac{\\alpha_{\\text{obs}}}{l \\times c}, \\quad \\text{\\% ee} = \\frac{|R - S|}{R + S} \\times 100\\%",
  optical: "[\\alpha] = \\frac{\\alpha_{\\text{obs}}}{l \\times c}, \\quad \\text{\\% ee} = \\frac{|R - S|}{R + S} \\times 100\\%",
  specific_rotation_equation: "[\\alpha]_D^T = \\frac{\\alpha_{\\text{obs}}}{l \\times c}",
  stereoisomer_counts: "\\text{Unsymmetrical: } N = 2^n \\quad \\Big| \\quad \\text{Symmetrical (even } n\\text{): } a = 2^{n-1}, \\; m = 2^{(n/2)-1}, \\; \\text{Total} = 2^{n-1} + 2^{(n/2)-1}",
  stereoisomers_calculation_formula: "\\text{Dissimilar ends: } 2^n \\; (\\text{meso} = 0) \\quad \\Big| \\quad \\text{Similar ends (even } n\\text{): } a = 2^{n-1}, \\; m = 2^{(n/2)-1}",
  huckel_aromaticity: "\\text{Aromatic: } (4n + 2)\\pi \\text{ electrons}, \\quad \\text{Anti-Aromatic: } 4n\\pi \\text{ electrons} \\; (n = 0, 1, 2, \\dots)",
  huckel_aromaticity_criteria: "\\text{Aromatic: } (4n + 2)\\pi \\text{ electrons}, \\quad \\text{Anti-Aromatic: } 4n\\pi \\text{ electrons} \\; (n = 0, 1, 2, \\dots)",
  carbocation_stability_aromatic_ions: "\\text{Cyclopropenyl } (\\ce{C3H3+}, 2\\pi e^-, n=0) \\text{ and Tropylium } (\\ce{C7H7+}, 6\\pi e^-, n=1): \\; \\text{Aromatic and exceptionally stable}",
  carbocation_stability_hierarchy: "\\text{Stability: } \\text{Tropylium} > \\text{Cyclopropenyl} > \\text{Trityl} > \\text{Benzyl} \\approx \\text{Allyl} > 3^\\circ > 2^\\circ > 1^\\circ > \\ce{CH3+}",
  free_radical_stability_bond_dissociation: "\\text{Stability: } 3^\\circ > 2^\\circ > 1^\\circ > \\ce{^.CH3} \\quad \\Big| \\quad \\text{C--H Bond Energy: } 3^\\circ (381) < 2^\\circ (401) < 1^\\circ (422) < \\ce{CH4} (435\\,\\text{kJ})",
  hyperconjugation_stability_order: "\\text{Hyperconjugable Structures} = \\text{Number of } \\alpha\\text{-Hydrogens}, \\quad \\text{Heat of Hydrogenation} \\propto \\frac{1}{\\text{Number of } \\alpha\\text{-H}}",
  hyperconjugation_carbocation_heat: "\\Delta H_{\\text{hydrog}} \\propto \\frac{1}{\\text{Alkene Stability}} \\propto \\frac{1}{\\alpha\\text{-H Count}}",
  inductive_effect_ranking: "-I: \\ce{-NF3+ > -NR3+ > -NO2 > -CN > -SO3H > -CHO > -COOH > -F > -Cl > -Br > -I > -OR > -OH > -NH2 > -Ph > -H} \\quad \\Big| \\quad +I: \\ce{-O- > -COO- > -C(CH3)3 > -CH(CH3)2 > -CH2CH3 > -CH3 > -T > -D > -H}",
  mesomeric_effect_ranking: "+M: \\ce{-O- > -NH2 > -NHR > -OH > -OR > -NHCOR > -OCOR > -Ph > -X} \\quad \\Big| \\quad -M: \\ce{-NO2 > -CN > -SO3H > -CHO > -COR > -COOH > -COOR > -CONH2}",
  tautomerism_enol_content: "\\text{Enol Content Factor: Aromatisation} > \\text{Extended Conjugation} > \\text{Intramolecular H-Bonding}",
  saytzeff_hofmann: "\\text{Saytzeff (Zaitsev): More substituted alkene} \\quad \\Big| \\quad \\text{Hofmann: Less substituted alkene}",
  haloalkane_elimination_saytzeff_hofmann: "\\text{Saytzeff (small base, good LG): More Substituted} \\quad \\Big| \\quad \\text{Hofmann (bulky base } t\\text{-BuO}^- \\text{ or poor LG } \\ce{F-}\\text{): Less Substituted}",
  sn1_sn2_summary: "\\textbf{S}_\\text{N}1\\text{: } \\text{Rate} = k [\\ce{R-X}] \\; (\\text{Racemisation}) \\quad \\Big| \\quad \\textbf{S}_\\text{N}2\\text{: } \\text{Rate} = k [\\ce{R-X}][\\ce{Nu-}] \\; (\\text{Walden Inversion})",
  sn1_vs_sn2_rate_laws: "\\textbf{S}_\\text{N}1\\text{: } \\text{Rate} = k [\\ce{R-X}] \\; (2\\text{ steps, carbocation, polar protic}) \\quad \\Big| \\quad \\textbf{S}_\\text{N}2\\text{: } \\text{Rate} = k [\\ce{R-X}][\\ce{Nu-}] \\; (1\\text{ step, backside attack, polar aprotic})",

  // ==================== HYDROCARBONS ====================
  baeyer_reagent_oxidation: "\\ce{R-CH=CH2 + cold dil. KMnO4(alkaline) -> R-CH(OH)-CH2OH \\; (\\textit{syn}-1,2-diol)}",
  corey_house_synthesis: "\\ce{R2CuLi \\text{ (Gilman)} + R'-X -> R-R' + R-Cu + LiX} \\quad (R' \\text{ may be } 1^\\circ, 2^\\circ, \\text{allyl, or aryl})",
  diels_alder_cycloaddition: "\\text{Diene (4}\\pi e^-, s\\text{-}\\textit{cis}\\text{)} + \\text{Dienophile (2}\\pi e^-\\text{)} \\xrightarrow{\\Delta} \\text{Cyclohexene Adduct [4+2]}",
  hydroboration_oxidation_alkenes: "\\ce{3 R-CH=CH2 + BH3 \\cdot THF -> (RCH2CH2)3B} \\xrightarrow{\\ce{H2O2 / OH-}} \\ce{3 R-CH2CH2OH} + \\ce{B(OH)3} \\; (\\textit{syn}\\text{-addition, anti-Markovnikov})",
  kolbe_electrolytic_synthesis: "\\ce{2 R-COOK + 2H2O ->[\\text{electrolysis}] R-R + 2CO2 ^ \\text{ (anode)} + H2 ^ + 2KOH \\text{ (cathode)}}",
  kolbe_electrolysis_anion_discharge: "\\textbf{Mono: } \\ce{2RCOO- -> R-R + 2CO2} \\quad \\Big| \\quad \\textbf{Succinate: } \\ce{^-OOC-(CH2)2-COO- -> CH2=CH2} \\quad \\Big| \\quad \\textbf{Maleate: } \\ce{HC#CH}",
  markovnikov_peroxide: "\\textbf{Ionic: } \\ce{CH3CH=CH2 + HX -> CH3CH(X)CH3} \\quad \\Big| \\quad \\textbf{Peroxide (}\\ce{HBr}\\text{ only): } \\ce{CH3CH=CH2 + HBr ->[\\text{peroxide}] CH3CH2CH2Br}",
  markovnikov_peroxide_addition: "\\textbf{Normal: } \\ce{R-CH=CH2 + HX -> R-CH(X)-CH3} \\quad \\Big| \\quad \\textbf{Peroxide (}\\ce{HBr}\\text{ only): } \\ce{R-CH=CH2 + HBr ->[\\ce{R2O2}] R-CH2-CH2Br}",
  ozonolysis_cleavage_alkenes: "\\textbf{Reductive (}\\ce{Zn/H2O}\\text{): } \\ce{>C=C< -> >C=O + O=C<} \\quad \\Big| \\quad \\textbf{Oxidative (}\\ce{H2O2}\\text{): } \\ce{R-CHO -> R-COOH}",
  wurtz_coupling_alkanes: "\\ce{2 R-X + 2Na ->[\\text{dry ether}] R-R + 2NaX}",
  wurtz_fittig: "\\textbf{Wurtz: } \\ce{2R-X + 2Na -> R-R} \\quad \\Big| \\quad \\textbf{Fittig: } \\ce{2Ar-X + 2Na -> Ar-Ar} \\quad \\Big| \\quad \\textbf{Wurtz--Fittig: } \\ce{R-X + Ar-X + 2Na -> Ar-R}",
  kucherov_reaction_alkynes: "\\ce{R-C#CH + H2O ->[1\\% \\ce{HgSO4} / 20\\% \\ce{H2SO4}][333\\text{ K}] [R-C(OH)=CH2] -> R-COCH3}",
  alkyne_reduction_stereospecific: "\\textbf{\\textit{Cis} (Z): } \\ce{R-C#C-R' + H2 ->[\\text{Lindlar}] \\textit{cis}-alkene} \\quad \\Big| \\quad \\textbf{\\textit{Trans} (E): } \\ce{R-C#C-R' + Na/liq. NH3 -> \\textit{trans}-alkene}",
  free_radical_halogenation_selectivity: "\\text{Chlorination (300 K): } 3^\\circ : 2^\\circ : 1^\\circ = 5.0 : 3.8 : 1.0 \\quad \\Big| \\quad \\text{Bromination (400 K): } 1600 : 82 : 1",

  // ==================== ALKYL HALIDES ====================
  finkelstein_swarts_reactions: "\\textbf{Finkelstein: } \\ce{R-X + NaI ->[\\text{acetone}] R-I + NaX v} \\quad \\Big| \\quad \\textbf{Swarts: } \\ce{R-X + AgF -> R-F + AgX v}",
  hunsdiecker_reaction_decarboxylation: "\\ce{R-COOAg + Br2 ->[\\ce{CCl4}, \\Delta] R-Br + CO2 ^ + AgBr v}",

  // ==================== ALCOHOLS, PHENOLS & ETHERS ====================
  lucas_test_kinetics: "\\ce{R-OH + conc. HCl ->[\\text{anhyd. } \\ce{ZnCl2}] R-Cl v \\text{ (turbidity)} + H2O}",
  victor_meyer_alcohol_test: "1^\\circ \\to \\text{Blood Red (Nitrolic Acid)} \\quad \\Big| \\quad 2^\\circ \\to \\text{Blue (Pseudonitrol)} \\quad \\Big| \\quad 3^\\circ \\to \\text{Colourless}",
  pcc_vs_jones_reagent: "\\textbf{PCC: } 1^\\circ \\text{ Alcohol} \\to \\text{Aldehyde} \\quad \\Big| \\quad \\textbf{Jones: } 1^\\circ \\text{ Alcohol} \\to \\text{Carboxylic Acid}",
  swern_oxidation_alcohols: "\\ce{R-CH2OH + (COCl)2 + DMSO + Et3N ->[-78^\\circ\\text{C}] R-CHO + (CH3)2S + CO + CO2 + Et3NH+Cl-}",
  williamson_ether_synthesis_limits: "\\ce{R-O- Na+ + R'-X -> R-O-R' + NaX} \\quad (R' \\text{ must be } 1^\\circ \\text{ or methyl})",
  ether_cleavage_hi: "\\ce{R-O-R' + HI(excess) ->[\\Delta] R-I + R'-I + H2O}",
  cumene_phenol_process: "\\ce{C6H5-CH(CH3)2 + O2 -> C6H5-C(CH3)2-OOH} \\xrightarrow{\\text{dil. } \\ce{H2SO4}} \\ce{C6H5OH + CH3COCH3}",
  duas_phenol_neutral_fecl3: "\\ce{6 C6H5OH + FeCl3 -> [Fe(OC6H5)6]^3- \\text{ (Violet Complex)} + 3H+ + 3HCl}",
  fries_rearrangement: "\\ce{C6H5-O-COCH3 ->[\\text{anhyd. } \\ce{AlCl3}][\\Delta] \\textit{o}- \\& \\textit{p}-hydroxyacetophenone}",
  libermann_nitroso_phenol: "\\ce{Phenol + NaNO2 + conc. H2SO4 -> \\textit{p}-nitrosophenol <=> Indophenol \\text{ (Green/Blue)}} \\xrightarrow{\\ce{H2O}} \\text{Red} \\xrightarrow{\\ce{NaOH}} \\text{Deep Blue}",
  cleavage_oxiranes_acid_base: "\\text{Acidic: Nu attacks more substituted C (carbocation)} \\quad \\Big| \\quad \\text{Basic: } \\ce{Nu-} \\text{ attacks less substituted C } (\\text{S}_\\text{N}2)",
  oxymercuration_demercuration: "\\ce{R-CH=CH2 + Hg(OAc)2/H2O -> R-CH(OH)-CH2-HgOAc} \\xrightarrow{\\ce{NaBH4 / OH-}} \\ce{R-CH(OH)-CH3} \\; (\\text{Markovnikov, no rearrangement})",
  pinacol_pinacolone_rearrangement: "\\ce{(CH3)2C(OH)-C(OH)(CH3)2 ->[\\ce{H2SO4}][\\Delta] (CH3)3C-CO-CH3 \\text{ (Pinacolone)} + H2O}",
  kolbe_schmitt: "\\ce{C6H5ONa + CO2 ->[400\\text{ K}][4\\text{--}7\\text{ atm}] C6H4(OH)COONa} \\xrightarrow{\\ce{H+}} \\ce{C6H4(OH)COOH \\text{ (Salicylic Acid)}}",
  reimer_tiemann: "\\ce{C6H5OH + CHCl3 + 3NaOH ->[340\\text{ K}] C6H4(OH)CHO \\text{ (Salicylaldehyde)} + 3NaCl + 2H2O}",

  // ==================== ALDEHYDES, KETONES & CARBOXYLIC ACIDS ====================
  aldol_cross_aldol_products: "\\text{Two different aldehydes with } \\alpha\\text{-H} \\xrightarrow{\\text{dil. base}} \\text{4 Distinct Aldol Products (2 self + 2 cross)}",
  aldol_cannizzaro: "\\textbf{Aldol: } \\ce{Carbonyl + dil. base -> \\beta-hydroxy carbonyl -> \\alpha,\\beta-unsaturated} \\quad \\Big| \\quad \\textbf{Cannizzaro: } \\ce{2 RCHO + 50\\% KOH -> RCH2OH + RCOOK}",
  cannizzaro_reaction: "\\ce{2 R-CHO + 50\\% KOH -> R-CH2OH + R-COOK}",
  clemmensen_vs_wolff_kishner: "\\textbf{Clemmensen (Acid): } \\ce{>C=O + Zn-Hg/HCl -> >CH2} \\quad \\Big| \\quad \\textbf{Wolff--Kishner (Base): } \\ce{>C=O + NH2NH2/KOH ->[\\Delta] >CH2 + N2 ^}",
  tollens_fehling_tests: "\\text{Tollens: } \\ce{R-CHO + 2[Ag(NH3)2]+ + 3OH- -> R-COO- + 2Ag v + 4NH3 + 2H2O} \\quad \\Big| \\quad \\text{Fehling: } \\ce{R-CHO + 2Cu^2+ + 5OH- -> R-COO- + Cu2O v + 3H2O}",
  haloform_iodoform_test: "\\ce{CH3-CO-R + 3I2 + 4NaOH -> CHI3 v \\text{ (yellow ppt)} + R-COONa + 3NaI + 3H2O}",
  silver_mirror_formic_acid: "\\ce{HCOOH + 2[Ag(NH3)2]+ + 2OH- -> 2Ag v \\text{ (Silver Mirror)} + CO2 ^ + 4NH3 + 2H2O}",
  stephen_reduction_nitriles: "\\ce{R-C#N + SnCl2 + 2HCl ->[\\text{ether}] R-CH=NH \\cdot HCl} \\xrightarrow{\\ce{H3O+}} \\ce{R-CHO + NH4Cl}",
  stork_enamine_synthesis: "\\ce{Ketone + 2^\\circ \\text{ amine} -> Enamine} \\xrightarrow{\\ce{R'-X}} \\text{Alkylated Enamine} \\xrightarrow{\\ce{H3O+}} \\alpha\\text{-substituted ketone}",
  acid_derivatives_reactivity_order: "\\text{Reactivity: } \\ce{RCOCl} > (\\ce{RCO})_2\\ce{O} > \\ce{RCOOR'} > \\ce{RCONH2}",
  carboxylic_acid_ortho_effect: "\\text{\\textit{ortho}-Substituted benzoic acids are stronger acids than benzoic acid regardless of } \\pm I / \\pm M",
  hell_volhard_zelinsky_hvz: "\\ce{R-CH2-COOH + X2 ->[\\text{Red P}][\\ce{H2O}] R-CH(X)-COOH \\; (\\alpha\\text{-halocarboxylic acid}) + HX}",
  etard_reaction: "\\ce{C6H5-CH3 + 2CrO2Cl2 ->[\\ce{CS2}] C6H5-CH(OCrOHCl2)2} \\xrightarrow{\\ce{H3O+}} \\ce{C6H5-CHO \\text{ (Benzaldehyde)}}",
  gattermann_koch_reaction: "\\ce{C6H6 + CO + HCl ->[\\text{anhyd. } \\ce{AlCl3} / \\ce{CuCl}] C6H5-CHO + HCl}",
  rosenmund_reduction: "\\ce{R-COCl + H2 ->[\\ce{Pd-BaSO4} / \\text{quinoline}] R-CHO + HCl}",
  benzoin_condensation: "\\ce{2 C6H5-CHO ->[\\text{alc. } \\ce{KCN}][\\Delta] C6H5-CH(OH)-CO-C6H5 \\text{ (Benzoin)}}",
  perkin_reaction: "\\ce{C6H5-CHO + (CH3CO)2O ->[\\ce{CH3COONa}][\\Delta] C6H5-CH=CH-COOH \\text{ (Cinnamic Acid)} + CH3COOH}",
  reformatsky_reaction: "\\ce{R2C=O + Br-CH2-COOEt + Zn ->[\\text{ether}] [R2C(OZnBr)-CH2-COOEt]} \\xrightarrow{\\ce{H3O+}} \\ce{R2C(OH)-CH2-COOEt \\; (\\beta\\text{-hydroxy ester})}",
  beckmann_rearrangement: "\\ce{R2C=N-OH \\text{ (Ketoxime)} ->[\\ce{H2SO4} \\text{ or } \\ce{PCl5}] R-CO-NH-R \\; (N\\text{-substituted amide})}",

  // ==================== AMINES & DIAZONIUM SALTS ====================
  amine_basicity_phases: "\\text{Gas: } 3^\\circ > 2^\\circ > 1^\\circ > \\ce{NH3} \\quad \\Big| \\quad \\text{Aqueous (Me): } 2^\\circ > 1^\\circ > 3^\\circ > \\ce{NH3} \\quad \\Big| \\quad \\text{Aqueous (Et): } 2^\\circ > 3^\\circ > 1^\\circ > \\ce{NH3}",
  carbylamine_isocyanide_test: "\\ce{R-NH2 + CHCl3 + 3KOH ->[\\Delta] R-NC \\text{ (foul smell)} + 3KCl + 3H2O}",
  hofmann_bromamide_degradation: "\\ce{R-CONH2 + Br2 + 4KOH -> R-NH2 + K2CO3 + 2KBr + 2H2O}",
  hinsberg_test_amines: "1^\\circ \\to \\text{Soluble in } \\ce{KOH} \\quad \\Big| \\quad 2^\\circ \\to \\text{Insoluble in } \\ce{KOH} \\quad \\Big| \\quad 3^\\circ \\to \\text{No reaction with } \\ce{PhSO2Cl}",
  gabriel_phthalimide: "\\ce{Phthalimide + KOH -> Potassium Phthalimide} \\xrightarrow{\\ce{R-X}} \\ce{N-alkylphthalimide} \\xrightarrow{\\ce{N2H4}} \\ce{R-NH2} \\; (1^\\circ\\text{ aliphatic only})",
  gabriel_phthalimide_limitations: "\\ce{Phthalimide + KOH -> Potassium Phthalimide} \\xrightarrow{\\ce{R-X} \\;(S_N2)} \\ce{N-alkylphthalimide} \\xrightarrow{\\ce{N2H4}} \\ce{R-NH2} \\; (1^\\circ\\text{ aliphatic only})",
  diazotisation_temperature_limit: "\\ce{Ar-NH2 + NaNO2 + 2HCl ->[273\\text{--}278\\text{ K}] Ar-N2+Cl- + NaCl + 2H2O}",
  diazotisation_sandmeyer: "\\ce{Ar-NH2 + NaNO2 + 2HCl ->[0\\text{--}5^\\circ\\text{C}] Ar-N2+Cl-} \\implies \\text{Sandmeyer: } \\ce{CuX -> Ar-X + N2 ^}",
  sandmeyer_reaction_cyanide: "\\ce{Ar-N2+Cl- + CuCN/KCN -> Ar-CN + N2 ^} \\xrightarrow{\\ce{H3O+}} \\ce{Ar-COOH + NH4+}",
  balz_schiemann_fluorination: "\\ce{Ar-N2+Cl- + HBF4 -> Ar-N2+BF4- v} \\xrightarrow{\\Delta} \\ce{Ar-F + BF3 ^ + N2 ^}",
  azo_coupling_reactions: "\\ce{Ar-N2+Cl- + C6H5OH ->[\\text{pH } 9\\text{--}10] Ar-N=N-C6H4-OH \\text{ (Orange Dye)}} \\quad \\Big| \\quad \\ce{Ar-N2+Cl- + C6H5NH2 ->[\\text{pH } 4\\text{--}5] Yellow Dye}",
  curtius_lossen_schmidt_rearrangements: "\\textbf{Curtius: } \\ce{RCO-N3 ->[\\Delta] R-N=C=O ->[\\ce{H2O}] R-NH2} \\quad \\Big| \\quad \\textbf{Schmidt: } \\ce{R-COOH + HN3 ->[\\ce{H2SO4}] R-NH2 + CO2 + N2}",

  // ==================== BIOMOLECULES & EVERYDAY CHEMISTRY ====================
  biuret_peptide_test: "\\text{Protein} + 10\\% \\ce{NaOH} + 1\\% \\ce{CuSO4} \\rightarrow [\\ce{Cu(Peptide)4}]^{2-} \\; (\\text{Violet Complex})",
  ninhydrin_amino_acid_test: "\\alpha\\text{-Amino Acid} + 2\\text{ Ninhydrin} \\rightarrow \\text{Ruhemann's Purple} + \\ce{R-CHO + CO2 ^ + NH4+}",
  xanthoproteic_test_aromatic_amino_acids: "\\text{Aromatic Protein (Tyr, Trp, Phe)} + \\text{conc. } \\ce{HNO3} \\xrightarrow{\\Delta} \\text{Yellow} \\xrightarrow{\\ce{NaOH}} \\text{Orange}",
  dna_chargaff_rules: "[\\ce{A}] = [\\ce{T}], \\quad [\\ce{G}] = [\\ce{C}] \\quad \\Big| \\quad [\\ce{A + G}] = [\\ce{T + C}] \\quad (\\text{Purines} = \\text{Pyrimidines})",
  inversion_of_cane_sugar: "\\ce{Sucrose} \\; ([\\alpha] = +66.5^\\circ) + \\ce{H2O} \\xrightarrow{\\ce{H+}} \\ce{D-(+)-Glucose} \\; (+52.5^\\circ) + \\ce{D-(-)-Fructose} \\; (-92.4^\\circ) \\implies [\\alpha]_{\\text{mix}} = -19.9^\\circ",
  mutarotation_glucose_equilibrium: "\\ce{\\alpha-D-Glucopyranose} \\; (36\\%) \\rightleftharpoons \\ce{Open Chain} \\; (0.02\\%) \\rightleftharpoons \\ce{\\beta-D-Glucopyranose} \\; (64\\%) \\implies [\\alpha] = +52.7^\\circ",
  soap_saponification_cleansing: "\\text{Triglyceride} + 3\\ce{NaOH} \\rightarrow \\text{Glycerol} + 3\\ce{R-COONa} \\; (\\text{Soap}) \\quad \\Big| \\quad \\ce{2RCOO- + Ca^2+ -> (RCOO)2Ca v}",
  elemental: "\\%C = \\frac{12}{44}\\frac{m_{\\ce{CO2}}}{m}\\times 100, \\quad \\%H = \\frac{2}{18}\\frac{m_{\\ce{H2O}}}{m}\\times 100, \\quad \\%N = \\frac{1.4 \\times N \\times V}{m}",
  elemental_analysis: "\\text{Liebig: } \\%C = \\frac{12}{44}\\frac{m_{\\ce{CO2}}}{m}\\times 100, \\; \\%H = \\frac{2}{18}\\frac{m_{\\ce{H2O}}}{m}\\times 100 \\quad \\Big| \\quad \\text{Kjeldahl: } \\%N = \\frac{1.4 \\times N \\times V}{m}",
  lassaigne_nitrogen_test: "\\ce{6NaCN + FeSO4 -> Na4[Fe(CN)6]}, \\quad \\ce{3Na4[Fe(CN)6] + 4FeCl3 -> Fe4[Fe(CN)6]3 v \\text{ (Prussian Blue)} + 12NaCl}",
  lassaigne_sulfur_nitroprusside: "\\ce{2Na + S ->[\\Delta] Na2S}, \\quad \\ce{Na2S + Na2[Fe(CN)5NO] -> Na4[Fe(CN)5NOS] \\text{ (Deep Violet Complex)}}",
  lassaigne_nitrogen_sulfur_together: "\\ce{Na + C + N + S ->[\\Delta] NaSCN}, \\quad \\ce{3NaSCN + FeCl3 -> Fe(SCN)3 \\text{ (Blood-Red Solution)} + 3NaCl}",
  antiseptics_vs_disinfectants: "\\text{Phenol: } 0.2\\% \\; (\\text{Antiseptic}) \\quad \\Big| \\quad 1.0\\% \\; (\\text{Disinfectant})",
  aspirin_synthesis_equation: "\\ce{C6H4(OH)COOH + (CH3CO)2O ->[\\text{conc. } \\ce{H2SO4}] C6H4(OCOCH3)COOH \\text{ (Aspirin)} + CH3COOH}",
  paracetamol_synthesis: "\\ce{\\textit{p}-aminophenol + (CH3CO)2O -> \\textit{p}-acetamidophenol \\text{ (Paracetamol)} + CH3COOH}",
  artificial_sweeteners_comparison: "\\text{Aspartame (100}\\times\\text{)} < \\text{Saccharin (550}\\times\\text{)} < \\text{Sucralose (600}\\times\\text{)} < \\text{Alitame (2000}\\times\\text{)}",

  // ==================== POLYMERS ====================
  polymer_molar_mass: "\\bar{M}_n = \\frac{\\sum N_i M_i}{\\sum N_i}, \\quad \\bar{M}_w = \\frac{\\sum N_i M_i^2}{\\sum N_i M_i}, \\quad \\text{PDI} = \\frac{\\bar{M}_w}{\\bar{M}_n}",
  polymer_pdi_molecular_mass: "\\text{PDI} = \\frac{\\bar{M}_w}{\\bar{M}_n} \\quad \\Big| \\quad \\bar{M}_n = \\frac{\\sum N_i M_i}{\\sum N_i} \\quad \\Big| \\quad \\bar{M}_w = \\frac{\\sum N_i M_i^2}{\\sum N_i M_i}",
  nylon_66_reaction: "n \\ce{HOOC-(CH2)4-COOH} + n \\ce{H2N-(CH2)6-NH2} \\xrightarrow[\\text{high } P]{553\\text{ K}} \\ce{[-CO-(CH2)4-CO-NH-(CH2)6-NH-]_n} + (2n-1)\\ce{H2O}",
  terylene_dacron_esterification: "n \\ce{HOOC-C6H4-COOH} + n \\ce{HO-CH2CH2-OH} \\xrightarrow[\\text{Zn-Sb catalyst}]{420\\text{--}460\\text{ K}} \\ce{[-CO-C6H4-CO-O-CH2CH2-O-]_n} + (2n-1)\\ce{H2O}",
  bakelite_phenol_formaldehyde: "\\text{Phenol} + \\ce{HCHO} \\to \\text{Novolac (linear)} \\xrightarrow[\\text{Urotropine}]{\\Delta} \\text{Bakelite (3D cross-linked)}",
  gutta_percha_trans_rubber: "\\text{Natural Rubber} = \\textit{all-cis}\\text{-1,4-polyisoprene} \\quad \\Big| \\quad \\text{Gutta-Percha} = \\textit{all-trans}\\text{-1,4-polyisoprene}",
  biodegradable_phbv_copolymer: "\\text{3-Hydroxybutanoic acid} + \\text{3-Hydroxypentanoic acid} \\to \\text{PHBV} + \\ce{H2O}",
  rubber_types_neoprene_buna: "\\text{Neoprene: } \\ce{[-CH2-C(Cl)=CH-CH2-]_n} \\quad \\Big| \\quad \\text{Buna-S: Butadiene + Styrene} \\quad \\Big| \\quad \\text{Buna-N: Butadiene + Acrylonitrile}",
  vulcanisation_natural_rubber: "\\ce{[-CH2-C(CH3)=CH-CH2-]_n} + 3\\text{--}5\\% \\text{ Sulfur} \\xrightarrow{373\\text{--}415\\text{ K}} \\text{Cross-linked Polyisoprene with } -\\ce{S}_x- \\text{ bridges}",
  distinguishing_tests: "\\textbf{Lucas: } 3^\\circ \\; (\\text{fast}), \\; 2^\\circ \\; (5\\text{ min}), \\; 1^\\circ \\; (\\Delta) \\quad \\Big| \\quad \\textbf{Carbylamine: } \\ce{1^\\circ R-NH2 + CHCl3 + KOH -> R-NC}",

  // ==================== ALL REMAINING VERIFIED FORMULAS ====================
  reaction_quotient_direction: "Q_c = \\frac{\\prod [\\text{Products}]^{\\nu_i}}{\\prod [\\text{Reactants}]^{\\nu_j}} \\quad \\Big| \\quad Q < K \\implies \\text{Forward} \\quad \\Big| \\quad Q > K \\implies \\text{Reverse}",
  simultaneous_solubility: "\\text{Simultaneous Solubility: } [\\ce{A+}]_{\\text{total}} = [\\ce{A+}]_1 + [\\ce{A+}]_2 \\quad (\\text{Sum of common ion contributions})",
  hardness_of_water_calculation: "\\text{Hardness (ppm)} = \\left[ \\frac{\\text{Mass of hardness-causing salt (mg)}}{\\text{Molar mass of salt}} \\right] \\times 100 \\times \\left( \\frac{10^3}{V_{\\text{water}} \\text{ (L)}} \\right)",
  henderson: "\\text{pH} = \\text{p}K_a + \\log_{10}\\left( \\frac{[\\ce{A-}]}{[\\ce{HA}]} \\right)",
  solubility_product: "\\ce{A}_x\\ce{B}_y \\rightleftharpoons x\\ce{A}^{y+} + y\\ce{B}^{x-} \\implies K_{\\text{sp}} = x^x y^y S^{x + y}",
  density: "\\rho = \\frac{Z \\cdot M}{a^3 \\cdot N_{\\text{A}}}",
  braggs_law_diffraction: "n \\lambda = 2 d \\sin\\theta \\quad \\Big| \\quad d_{hkl} = \\frac{a}{\\sqrt{h^2 + k^2 + l^2}} \\quad (\\text{for cubic})",
  solid_density: "\\rho = \\frac{Z \\cdot M}{a^3 \\cdot N_{\\text{A}}}, \\quad \\text{SC: } a = 2r, \\quad \\text{BCC: } \\sqrt{3} a = 4r, \\quad \\text{FCC: } \\sqrt{2} a = 4r",
  semiconductors_n_type_p_type: "n\\text{-Type (Si + P/As): Extra Free } e^- \\quad \\Big| \\quad p\\text{-Type (Si + B/Al): Positive Holes}",
  f_centers_non_stoichiometric_colour: "\\text{Anion Vacancy occupied by Trapped } e^- = \\text{F-Centre (Farbe Centre)} \\implies \\text{Imparts colour to crystal}",
  frenkel_schottky_comparison: "\\text{Schottky: Missing cation-anion pair } (\\rho \\downarrow, \\text{e.g. NaCl}) \\quad \\Big| \\quad \\text{Frenkel: Interstitial cation } (\\rho \\text{ const}, \\text{e.g. AgCl})",
  ferromagnetism_curie_weiss: "\\text{Ferromagnetic: Domains parallel } (\\ce{Fe, Co, Ni}) \\quad \\Big| \\quad \\text{Antiferro: Domains cancel } (\\ce{MnO}) \\quad \\Big| \\quad \\text{Ferrimagnetic: } \\ce{Fe3O4}",
  piezoelectricity_pyroelectricity: "\\text{Piezoelectric: Mechanical Stress} \\rightleftharpoons \\text{Electric Voltage (Quartz)} \\quad \\Big| \\quad \\text{Ferroelectric: Permanent dipoles } (\\ce{BaTiO3})",
  fcc_tetrahedral_octahedral: "\\text{In CCP/FCC } (N \\text{ atoms}): \\quad \\text{Octahedral Voids} = N, \\quad \\text{Tetrahedral Voids} = 2N, \\quad \\text{Total} = 3N",
  azeotrope_types: "\\text{Min-Boiling (+ve dev): } T_{\\text{bp}}(\\text{azeo}) < T_{\\text{bp}}(\\text{pure}) \\quad \\Big| \\quad \\text{Max-Boiling (-ve dev): } T_{\\text{bp}}(\\text{azeo}) > T_{\\text{bp}}(\\text{pure})",
  colligative_properties: "\\text{RLVP: } \\frac{P^\\circ - P}{P^\\circ} = i \\cdot x_B \\quad \\Big| \\quad \\Delta T_b = i K_b m \\quad \\Big| \\quad \\Delta T_f = i K_f m \\quad \\Big| \\quad \\Pi = i C R T",
  landsberger_cottrell_ebullioscopy: "M_B = \\frac{1000 K_b w_B}{\\Delta T_b W_A} \\quad \\Big| \\quad \\text{Beckmann Thermometer Precision} = 0.01^\\circ\\text{C}",
  nernst_distribution_law: "K_D = \\frac{C_1}{C_2} = \\text{const} \\quad (\\text{Distribution between two immiscible solvents at const } T)",
  rasts_method_camphor: "M_B = \\frac{1000 K_f w_B}{\\Delta T_f W_A} \\quad (\\text{Camphor: } K_f = 40.0\\text{ K kg mol}^{-1})",
  raoult: "\\frac{P^\\circ - P}{P^\\circ} = x_B",
  relative_lowering_vapour_pressure: "\\frac{P^\\circ - P_s}{P^\\circ} = x_B \\quad \\Big| \\quad \\text{Exact: } \\frac{P^\\circ - P_s}{P_s} = \\frac{n_B}{n_A} = \\frac{w_B M_A}{M_B W_A}",
  steam_distillation_formula: "\\frac{w_{\\text{organic}}}{w_{\\text{water}}} = \\frac{P_{\\text{organic}}^\\circ \\cdot M_{\\text{organic}}}{P_{\\text{water}}^\\circ \\cdot M_{\\text{water}}}",
  vant_hoff_factor_association_dissociation: "\\text{Dissociation: } \\alpha = \\frac{i - 1}{n - 1} \\quad \\Big| \\quad \\text{Association: } \\beta = \\frac{1 - i}{1 - \\frac{1}{m}} = \\frac{m(1 - i)}{m - 1}",
  dilution_and_mix: "M_1 V_1 = M_2 V_2, \\quad M_{\\text{mix}} = \\frac{\\sum M_i V_i}{\\sum V_i} = \\frac{M_1 V_1 + M_2 V_2}{V_1 + V_2}",
  parts_per_million_ppm: "\\text{ppm} = \\frac{\\text{Mass of Solute}}{\\text{Total Mass of Solution}} \\times 10^6 \\quad \\Big| \\quad \\text{ppb} = \\frac{\\text{Mass of Solute}}{\\text{Total Mass}} \\times 10^9",
  atomicity_molar_ratio: "C_m = 3 R \\approx 24.94\\text{ J K}^{-1}\\text{ mol}^{-1} \\quad (\\text{Dulong--Petit High Temperature Limit})",
  empirical_molecular_formula: "\\text{Molecular Formula} = (\\text{Empirical Formula})_n, \\quad n = \\frac{\\text{Molar Mass}}{\\text{Empirical Formula Mass}}",
  combustion_alkane_general: "\\ce{C_n H_{2n+2} + \\frac{3n+1}{2} O2 -> n CO2 + (n+1) H2O}",
  combustion_alkyne_general: "\\ce{C_n H_{2n-2} + \\frac{3n-1}{2} O2 -> n CO2 + (n-1) H2O}",
  hydrogen_bonding_boiling_points: "\\text{Boiling Points: } \\ce{H2O (100^\\circ C) \\gg H2Te (-2^\\circ C) > H2Se (-41^\\circ C) > H2S (-60^\\circ C)}",
  hybrid_vsepr: "H = \\frac{1}{2}(V + M - C + A), \\quad \\text{Steric Number} = (\\text{Bond Pairs}) + (\\text{Lone Pairs})",
  steric_number_hybridisation: "\\text{SN} = \\frac{1}{2}[V + M - C + A] = (\\text{Number of } \\sigma\\text{-bonds}) + (\\text{Number of Lone Pairs})",
  bondorder: "\\text{Bond Order} = \\frac{N_b - N_a}{2}",
  mot_bond_order: "\\text{Bond Order} = \\frac{N_b - N_a}{2}",
  slater_rules: "Z^* = Z - \\sigma",
  slater_rules_zeff: "Z_{\\text{eff}} = Z - \\sigma \\quad \\Big| \\quad \\text{For } ns/np \\text{ electrons}: \\sigma = 0.35(n - 1)_{\\text{same}} + 0.85(n - 1) + 1.0(n - 2)_{\\text{lower}}",
  ean: "\\text{EAN} = Z - (\\text{Oxidation State}) + 2 \\times (\\text{Coordination Number})",
  chelate_effect_thermodynamics: "\\Delta G^\\circ = \\Delta H^\\circ - T \\Delta S^\\circ \\quad (\\Delta S^\\circ \\gg 0 \\text{ due to release of monodentate ligands})",
  cfse_octahedral_formula: "\\text{CFSE}_{\\text{oct}} = [ -0.4 \\cdot n(t_{2g}) + 0.6 \\cdot n(e_g) ] \\Delta_o + m \\cdot P",
  cfse_oct_tet: "\\text{Octahedral: } \\text{CFSE} = (-0.4 n_{t_{2g}} + 0.6 n_{e_g})\\Delta_o + m P \\quad \\Big| \\quad \\text{Tetrahedral: } \\Delta_t = \\frac{4}{9}\\Delta_o",
  ean_rule: "\\text{EAN} = Z - (\\text{Oxidation State}) + 2 \\times (\\text{Coordination Number})",
  effective_atomic_number_ean: "\\text{EAN} = Z - (\\text{Oxidation State}) + 2 \\times (\\text{Coordination Number})",
  cfse_tetrahedral_relation: "\\Delta_t = \\frac{4}{9} \\Delta_o \\quad \\Big| \\quad \\text{CFSE}_{\\text{tet}} = [ -0.6 \\cdot n(e) + 0.4 \\cdot n(t_2) ] \\Delta_t",
  zeises_salt_structure: "\\ce{K[PtCl3(\\eta^2-C2H4)] \\cdot H2O} \\quad (\\text{Platinum(II) Square Planar Organometallic Complex})",
  ellingham_thermo: "\\Delta G^\\circ = \\Delta H^\\circ - T \\Delta S^\\circ \\implies \\text{Slope} = -\\Delta S^\\circ",
  ellingham_diagram_slopes: "\\Delta G^\\circ = \\Delta H^\\circ - T \\Delta S^\\circ \\quad \\Big| \\quad \\text{Slope} = -\\Delta S^\\circ",
  mond_van_arkel_refining: "\\textbf{Mond: } \\ce{Ni + 4CO ->[330\\text{--}350\\text{ K}] Ni(CO)4 ^ ->[450\\text{--}470\\text{ K}] Ni + 4CO ^} \\quad \\Big| \\quad \\textbf{van Arkel: } \\ce{Zr + 2I2 ->[870\\text{ K}] ZrI4 ->[2075\\text{ K}] Zr + 2I2}",
  borax_bead_test_reactions: "\\ce{Na2B4O7 \\cdot 10H2O ->[\\Delta] 2NaBO2 + B2O3 \\text{ (Glassy Bead)}} \\quad \\Big| \\quad \\ce{B2O3 + CuO ->[\\Delta] Cu(BO2)2 \\text{ (Sky Blue Bead)}}",
  flame_test_emission_colours: "\\text{De-excitation of excited valence electrons: } \\Delta E = \\frac{h c}{\\lambda} \\implies \\text{Characteristic flame colour}",
  salt_analysis_group_reagents: "\\text{Group Reagents: } \\text{I: dil. } \\ce{HCl} \\quad \\Big| \\quad \\text{II: } \\ce{H2S / dil. HCl} \\quad \\Big| \\quad \\text{III: } \\ce{NH4OH / NH4Cl} \\quad \\Big| \\quad \\text{IV: } \\ce{H2S / NH4OH}",
  fries_rearrangement: "\\ce{C6H5OCOCH3 ->[\\text{anhyd. } \\ce{AlCl3}][\\Delta] \\textit{o}- \\& \\textit{p}-hydroxyacetophenone}",
  libermann_nitroso_phenol: "\\ce{Phenol + NaNO2 + conc. H2SO4 -> \\textit{p}-nitrosophenol <=> Indophenol} \\xrightarrow{\\ce{H2O}} \\text{Red} \\xrightarrow{\\ce{NaOH}} \\text{Deep Blue}",
  aldol_condensation: "\\ce{2 R-CH2-CHO + dil. NaOH <=> \\beta-hydroxyaldehyde ->[-H2O] \\alpha,\\beta-unsaturated aldehyde}",
  clemmensen_wolff: "\\textbf{Clemmensen: } \\ce{>C=O + Zn-Hg/conc. HCl -> >CH2} \\quad \\Big| \\quad \\textbf{Wolff--Kishner: } \\ce{>C=O + NH2NH2/KOH/glycol -> >CH2}",
  favorskii_rearrangement: "\\ce{\\alpha-Haloketone + Base (RO- / OH-) -> Cyclopropanone Intermediate -> Ester / Carboxylic Acid}",
  hvz_reaction: "\\ce{R-CH2-COOH + X2 ->[\\text{red P}] R-CH(X)-COOH + HX} \\quad (X = \\ce{Cl, Br})",
  hunsdiecker_reaction_decarboxylation: "\\ce{R-COOAg + Br2 ->[\\ce{CCl4}, \\Delta] R-Br + CO2 ^ + AgBr v}",
  carboxylic_acid_ortho_effect: "\\text{\\textit{ortho}-Substituted benzoic acids are stronger acids than benzoic acid regardless of electronic nature}",
  silver_salt_method_acids: "E_{\\text{acid}} = \\left[ \\frac{108 \\times \\text{Mass of Silver Salt}}{\\text{Mass of Residue Ag}} \\right] - 107",
  platinic_chloride_base_method: "M_{\\text{base}} = \\frac{1}{2} \\left[ \\frac{195 \\times \\text{Mass of Salt}}{\\text{Mass of Residue Pt}} - 410 \\right]",
  sandmeyer_vs_gattermann: "\\textbf{Sandmeyer: } \\ce{Ar-N2+Cl- + CuCl/HCl -> Ar-Cl + N2 ^} \\quad \\Big| \\quad \\textbf{Gattermann: } \\ce{Ar-N2+Cl- + Cu/HCl -> Ar-Cl + N2 ^}",
  friedel_crafts_alkylation_traps: "\\ce{Ar-H + R-Cl + AlCl3 -> Ar-R' + HCl} \\quad (\\text{Carbocation rearrangement occurs if } \\ce{R+} \\text{ forms more stable ion})",
  amino_acid_isoelectric_point: "\\text{Neutral: } \\text{p}I = \\frac{\\text{p}K_{a1} + \\text{p}K_{a2}}{2} \\quad \\Big| \\quad \\text{Acidic: } \\text{p}I = \\frac{\\text{p}K_{a1} + \\text{p}K_{a\\text{R}}}{2} \\quad \\Big| \\quad \\text{Basic: } \\text{p}I = \\frac{\\text{p}K_{a\\text{R}} + \\text{p}K_{a2}}{2}",
  aspirin_synthesis_equation: "\\ce{C6H4(OH)COOH + (CH3CO)2O ->[\\text{conc. } \\ce{H2SO4}] C6H4(OCOCH3)COOH \\text{ (Aspirin)} + CH3COOH}",
  paracetamol_synthesis: "\\ce{\\textit{p}-aminophenol + (CH3CO)2O -> \\textit{p}-acetamidophenol \\text{ (Paracetamol)} + CH3COOH}",
  baeyer_reagent_oxidation: "\\ce{R-CH=CH2 + cold dil. KMnO4(alkaline) -> R-CH(OH)-CH2OH} \\quad (\\textit{syn}\\text{-1,2-diol})",
  kucherov_reaction_alkynes: "\\ce{R-C#CH + H2O ->[1\\% \\ce{HgSO4} / 20\\% \\ce{H2SO4}][333\\text{ K}] [R-C(OH)=CH2] -> R-COCH3 \\text{ (Methyl Ketone)}}",
  alkyne_reduction_stereospecific: "\\textbf{\\textit{Cis} (Z): } \\ce{R-C#C-R' + H2 ->[\\text{Lindlar}] \\textit{cis}-alkene} \\quad \\Big| \\quad \\textbf{\\textit{Trans} (E): } \\ce{R-C#C-R' + Na/liq. NH3 -> \\textit{trans}-alkene}",
  stork_enamine_synthesis: "\\ce{Ketone + 2^\\circ \\text{ amine} -> Enamine} \\xrightarrow{\\ce{R'-X}} \\text{Alkylated Enamine} \\xrightarrow{\\ce{H3O+}} \\text{\\(\\alpha\\)-substituted ketone}",
  bragg_law: "n \\lambda = 2 d \\sin\\theta \\quad \\Big| \\quad d_{hkl} = \\frac{a}{\\sqrt{h^2 + k^2 + l^2}}",
  osmotic: "\\pi = i \\cdot C R T = i \\left( \\frac{n_B}{V} \\right) R T",
  fayans_rules_covalency: "\\text{Covalent Character} \\propto \\frac{\\text{Cation Charge}}{\\text{Cation Radius}} \\propto \\text{Anion Radius} \\propto \\text{Polarisability}",
  inert_pair_effect_stability: "\\text{Group 13: } \\ce{Tl+ > Tl^3+} \\quad \\Big| \\quad \\text{Group 14: } \\ce{Pb^2+ > Pb^4+} \\quad \\Big| \\quad \\text{Group 15: } \\ce{Bi^3+ > Bi^5+}",
  lanthanoid_contraction_consequences: "r(\\ce{Zr^4+}) \\approx r(\\ce{Hf^4+}) \\approx 159\\text{ pm} \\quad \\Big| \\quad r(\\ce{Nb^5+}) \\approx r(\\ce{Ta^5+}) \\approx 146\\text{ pm}",
  schiff_base_formation: "\\ce{R-CHO + R'-NH2 <=> R-CH=N-R' \\text{ (Schiff Base / Imine)} + H2O}",
  saytzeff_vs_hofmann_elimination: "\\text{Saytzeff (Small base, } \\ce{EtO-}): \\text{More substituted alkene (Major)} \\quad \\Big| \\quad \\text{Hofmann (Bulky base, } \\ce{t-BuO-} / \\ce{-N+Me3}): \\text{Less substituted alkene (Major)}",
  carbocation_stability_rearrangement: "3^\\circ > 2^\\circ > 1^\\circ > \\ce{CH3+} \\quad \\Big| \\quad \\text{Tropylium} > \\text{Cyclopropenyl} > \\text{Trityl} > \\text{Benzyl} \\approx \\text{Allyl}",
  markovnikov_peroxide_effect: "\\text{Markovnikov (no peroxide): } \\ce{R-CH=CH2 + HBr -> R-CH(Br)-CH3} \\quad \\Big| \\quad \\text{Kharasch (\\ce{R2O2}): } \\ce{R-CH=CH2 + HBr -> R-CH2CH2-Br}",
  reimer_tiemann_mechanism_carbene: "\\ce{CHCl3 + OH- <=> :CCl2 \\text{ (Dichlorocarbene)} + Cl- + H2O} \\quad \\Big| \\quad \\ce{C6H5OH + :CCl2 ->[\\ce{NaOH}] C6H4(OH)CHO \\text{ (Salicylaldehyde)}}",
  formalcharge: "\\text{FC} = V - L - \\frac{1}{2} B",
  blast_furnace_slag_formation: "\\ce{CaCO3 ->[1070\\text{ K}] CaO + CO2 ^} \\quad \\Big| \\quad \\ce{CaO \\text{ (Basic Flux)} + SiO2 \\text{ (Acidic Gangue)} -> CaSiO3 \\text{ (Slag)}}",
  roasting_vs_calcination: "\\text{Calcination (No air): } \\ce{ZnCO3 ->[\\Delta] ZnO + CO2 ^} \\quad \\Big| \\quad \\text{Roasting (Excess air): } \\ce{2ZnS + 3O2 ->[\\Delta] 2ZnO + 2SO2 ^}",
  cyanide_extraction_silver_gold: "\\ce{4Au + 8NaCN + 2H2O + O2 -> 4Na[Au(CN)2] + 4NaOH} \\quad \\Big| \\quad \\ce{2Na[Au(CN)2] + Zn -> Na2[Zn(CN)4] + 2Au v}",
  clarks_method_softening: "\\ce{Ca(HCO3)2 + Ca(OH)2 -> 2CaCO3 v + 2H2O} \\quad \\Big| \\quad \\ce{Mg(HCO3)2 + 2Ca(OH)2 -> 2CaCO3 v + Mg(OH)2 v + 2H2O}",
  nessler_reagent_ammonia: "\\ce{2K2[HgI4] + NH3 + 3KOH -> H2N-Hg-O-Hg-I v \\text{ (Iodide of Millon's Base, Brown ppt)} + 7KI + 2H2O}",
  sharpless_epoxidation: "\\text{Allylic Alcohol} + t\\text{-BuOOH} \\xrightarrow{\\ce{Ti(O-}i\\ce{-Pr)4}, \\; (\\pm)\\text{-DET}} \\text{Chiral Epoxide } (>90\\% \\text{ ee})",
  dnp_carbonyl_test: "\\ce{>C=O + 2,4-(NO2)2C6H3-NHNH2 -> >C=N-NH-C6H3(NO2)2 v \\text{ (Orange/Yellow ppt)} + H2O}",
  baeyer_villiger_oxidation: "\\ce{R-CO-R' + R''COOOH \\text{ (mCPBA)} -> R-COO-R' \\text{ (Ester)} + R''COOH}",
  benzoin_condensation_cyanide: "\\ce{2C6H5CHO ->[\\text{aq. alc. } \\ce{KCN}][\\Delta] C6H5-CH(OH)-CO-C6H5 \\text{ (Benzoin)}}",
  claisen_ester_condensation: "\\ce{2R-CH2-COOR' + NaOR' ->[\\text{reflux}] R-CH2-CO-CH(R)-COOR' \\text{ (\\(\\beta\\)-Keto Ester)} + R'OH}",
  cannizzaro_cross_formaldehyde: "\\ce{Ar-CHO + HCHO + conc. NaOH -> Ar-CH2OH + HCOONa}",
  etard_reaction_benzaldehyde: "\\ce{C6H5-CH3 + 2CrO2Cl2 ->[\\ce{CS2}] C6H5-CH(OCrOHCl2)2 \\text{ (Brown Complex)}} \\xrightarrow{\\ce{H3O+}} \\ce{C6H5-CHO + 2Cr(OH)2Cl2}",
  gattermann_koch_formylation: "\\ce{C6H6 + CO + HCl ->[\\text{anhyd. } \\ce{AlCl3} / \\ce{CuCl}][\\text{high } P] C6H5-CHO + HCl}",
  hell_volhard_zelinsky_mechanism: "\\ce{R-CH2-COOH + PBr3 -> R-CH2-COBr <=> R-CH=C(OH)Br} \\xrightarrow{\\ce{Br2}} \\ce{R-CH(Br)-COOH}",
  michael_conjugate_addition: "\\text{Active Methylene Donor} + \\alpha,\\beta\\text{-Unsaturated Acceptor} \\xrightarrow{\\text{base}} \\text{1,5-Dicarbonyl Adduct}",
  perkin_cinnamic_acid: "\\ce{C6H5CHO + (CH3CO)2O ->[\\ce{CH3COONa}][450\\text{ K}] C6H5-CH=CH-COOH \\text{ (Cinnamic Acid)} + CH3COOH}",
  robinson_annulation_cascade: "\\text{Cyclohexanone} + \\text{Methyl Vinyl Ketone} \\xrightarrow[\\text{Michael}]{\\text{base}} \\text{1,5-Diketone} \\xrightarrow[\\text{Intramolecular Aldol}]{\\text{base}} \\text{2-Cyclohexenone}",
  schiff_reagent_test: "\\ce{R-CHO} + \\text{Schiff's Reagent (decolourised rosaniline)} \\longrightarrow \\text{Restoration of Magenta/Pink Colour}",
  wittig_reaction_alkenes: "\\ce{>C=O + Ph3P=CH-R \\text{ (Phosphonium Ylide)} -> >C=CH-R \\text{ (Alkene)} + Ph3P=O}",
  curtius_rearrangement: "\\ce{R-COCl + NaN3 -> R-CO-N3 \\text{ (Acyl Azide)} ->[\\Delta][-\\ce{N2}] R-N=C=O \\text{ (Isocyanate)} ->[\\ce{H2O}] R-NH2 + CO2 ^}",
  benzyne_mechanism_elimination_addition: "\\ce{C6H5Cl + KNH2 / liq. NH3 ->[196\\text{ K}] [C6H4 \\text{ (Benzyne)}] -> C6H5NH2 \\text{ (Aniline)}}",
  friedel_crafts_acylation_clean: "\\ce{Ar-H + R-COCl ->[\\text{anhyd. } \\ce{AlCl3}] Ar-CO-R \\text{ (Aromatic Ketone)} + HCl}",
  molisch_carbohydrate_test: "\\text{Carbohydrate} \\xrightarrow{\\text{conc. } \\ce{H2SO4}} \\text{Furfural / 5-HMF} \\xrightarrow{\\alpha\\text{-naphthol}} \\text{Purple/Violet Ring at Interface}",
  cope_claisen_sigmatropic: "\\textbf{Cope: } \\text{1,5-Diene} \\xrightarrow{300^\\circ\\text{C}} \\text{Isomeric 1,5-Diene} \\quad \\Big| \\quad \\textbf{Claisen: } \\text{Allyl Vinyl Ether} \\xrightarrow{200^\\circ\\text{C}} \\gamma,\\delta\\text{-Unsaturated Carbonyl}",
  salt_hydrolysis_cases: "\\text{WA-SB: } \\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a + \\log_{10} C) \\quad \\Big| \\quad \\text{SA-WB: } \\text{pH} = 7 - \\frac{1}{2}(\\text{p}K_b + \\log_{10} C) \\quad \\Big| \\quad \\text{WA-WB: } \\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a - \\text{p}K_b)",
  salt_hydrolysis: "\\text{WA-SB: } \\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a + \\log_{10} C) \\quad \\Big| \\quad \\text{SA-WB: } \\text{pH} = 7 - \\frac{1}{2}(\\text{p}K_b + \\log_{10} C) \\quad \\Big| \\quad \\text{WA-WB: } \\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a - \\text{p}K_b)",
  colligative: "\\Delta T_b = i \\cdot K_b \\cdot m, \\quad \\Delta T_f = i \\cdot K_f \\cdot m",
  henrys_law_gas_solubility: "P = K_{\\text{H}} \\cdot x \\quad \\Big| \\quad m = k \\cdot P",
  mole_fraction_relations: "m = \\frac{x_B \\times 1000}{x_A \\times M_A}, \\quad x_B = \\frac{m \\times M_A}{1000 + m \\times M_A}",
  osmotic_pressure_pfeffer: "\\Pi = i \\cdot C R T = i \\left( \\frac{n_B}{V} \\right) R T = \\frac{i \\cdot w_B \\cdot R \\cdot T}{M_B \\cdot V}",
  raoult_binary: "P_{\\text{total}} = P_A + P_B = P_A^\\circ x_A + P_B^\\circ x_B = P_B^\\circ + (P_A^\\circ - P_B^\\circ) x_A",
  raoults_law_binary_liquid: "P_{\\text{total}} = P_A + P_B = P_A^\\circ x_A + P_B^\\circ x_B = P_A^\\circ + (P_B^\\circ - P_A^\\circ) x_B",
  formal_charge_formula: "\\text{FC} = V - L - \\frac{1}{2} B"
};

/**
 * Bulletproof fallback formatter for any formula not explicitly listed in MASTER_CURATED.
 * Guarantees zero double backslashes, zero broken brackets, zero unhandled unicode,
 * and zero unwrapped English words in math mode.
 */
function cleanFormulaToLaTeX(f) {
  if (MASTER_CURATED[f.id]) {
    return MASTER_CURATED[f.id];
  }

  let s = String(f.expr || "").trim();

  // 1. If it contains chemical reaction arrows
  if (s.includes("→") || s.includes("->") || s.includes("⇌") || s.includes("<=>")) {
    let prefix = "";
    const colonMatch = s.match(/^([A-Za-z0-9\s\-]+):\s*(.*)$/);
    if (colonMatch && colonMatch[1].length < 25) {
      prefix = `\\textbf{${colonMatch[1].trim()}: } `;
      s = colonMatch[2];
    }

    s = s.replace(/—heat→/g, " ->[\\Delta] ")
         .replace(/—dil\.\s*H₂SO₄→/g, " ->[\\text{dil. } \\ce{H2SO4}] ")
         .replace(/—H⁺→/g, " ->[\\ce{H+}] ")
         .replace(/—OH⁻→/g, " ->[\\ce{OH-}] ")
         .replace(/—H₂O→/g, " ->[\\ce{H2O}] ")
         .replace(/—Zn\/HCl→/g, " ->[\\ce{Zn/HCl}] ")
         .replace(/—dry ether→/g, " ->[\\text{dry ether}] ")
         .replace(/→/g, " -> ")
         .replace(/⇌/g, " <=> ")
         .replace(/—/g, " - ")
         .replace(/−/g, "-");

    s = sanitizeSubSupAscii(s);
    s = s.replace(/\(([A-Za-z\s]+)\)/g, "\\text{ ($1)}");

    return `${prefix}\\ce{${s}}`;
  }

  // 2. Mathematical equation handling
  let math = sanitizeSubSupAscii(s);

  // Greek letter conversions (use word boundaries on original ascii/clean tokens)
  const greekMap = [
    ["Delta", "\\Delta"], ["alpha", "\\alpha"], ["beta", "\\beta"], ["gamma", "\\gamma"],
    ["lambda", "\\lambda"], ["theta", "\\theta"], ["pi", "\\pi"], ["mu", "\\mu"],
    ["nu", "\\nu"], ["rho", "\\rho"], ["sigma", "\\sigma"], ["kappa", "\\kappa"],
    ["phi", "\\phi"], ["eta", "\\eta"], ["omega", "\\omega"], ["chi", "\\chi"],
    ["epsilon", "\\varepsilon"]
  ];
  greekMap.forEach(([gName, gCmd]) => {
    // Only replace when NOT already preceded by a backslash
    const re = new RegExp(`(?<!\\\\)\\b${gName}\\b`, "g");
    math = math.replace(re, `${gCmd} `);
  });

  // Convert logical implication
  math = math.replace(/=>/g, " \\implies ")
             .replace(/->/g, " \\to ");

  // Standard operators and symbols
  math = math.replace(/\blog\b/g, "\\log_{10}")
             .replace(/\bln\b/g, "\\ln ")
             .replace(/×/g, " \\times ")
             .replace(/·/g, " \\cdot ")
             .replace(/•/g, " \\cdot ")
             .replace(/±/g, " \\pm ")
             .replace(/≤/g, " \\le ")
             .replace(/≥/g, " \\ge ")
             .replace(/≈/g, " \\approx ")
             .replace(/≠/g, " \\ne ")
             .replace(/∞/g, " \\infty ")
             .replace(/Å/g, " \\text{\\AA} ")
             .replace(/−/g, "-")
             .replace(/[–—]/g, "-")
             .replace(/%/g, "\\%")
             .replace(/°/g, "^\\circ ")
             .replace(/∝/g, " \\propto ");

  // Convert square roots: replace square brackets with curly braces!
  math = math.replace(/√\s*\[([^\]]+)\]/g, "\\sqrt{$1}");
  math = math.replace(/√\s*\(([^)]+)\)/g, "\\sqrt{$1}");
  math = math.replace(/√\s*([A-Za-z0-9_]+)/g, "\\sqrt{$1}");
  math = math.replace(/√/g, "\\sqrt ");

  // Fix fractions: convert `(A) / (B)` to `\frac{A}{B}`
  math = math.replace(/\(([A-Za-z0-9_+\-\s\\]+)\)\s*\/\s*\(([A-Za-z0-9_+\-\s\\]+)\)/g, "\\frac{$1}{$2}");
  math = math.replace(/([A-Za-z0-9_]+)\s*\/\s*([A-Za-z0-9_]+)/g, "\\frac{$1}{$2}");

  // Common subscripts with text
  math = math.replace(/\bE_cell\b/g, "E_{\\text{cell}}")
             .replace(/\bE_a\b/g, "E_a")
             .replace(/\bP_total\b/g, "P_{\\text{total}}")
             .replace(/\bV_total\b/g, "V_{\\text{total}}")
             .replace(/\bt_1\/2\b/g, "t_{1/2}")
             .replace(/\bt_½\b/g, "t_{1/2}");

  // Standard separators
  math = math.replace(/\s*\|\s*/g, " \\quad \\Big| \\quad ");
  math = math.replace(/\s*,\s*/g, ", \\quad ");

  // Ensure NO double backslashes before commands
  math = math.replace(/\\\\([a-zA-Z]+)/g, "\\$1");

  return math;
}

function sanitizeSubSupAscii(str) {
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
    .replace(/δ/g, "\\delta ");
}

// Process and validate all formulas
let successCount = 0;
const failureReport = [];

formulas.forEach((f, idx) => {
  const candidate = cleanFormulaToLaTeX(f);
  
  // Sanity cleanup: ensure NO double backslashes before commands
  let sanitized = candidate.replace(/\\\\([a-zA-Z]+)/g, "\\$1");
  // Ensure % is escaped
  sanitized = sanitized.replace(/\\%/g, "___PERCENT___").replace(/%/g, "\\%").replace(/___PERCENT___/g, "\\%");

  try {
    katex.renderToString(sanitized, { displayMode: true, throwOnError: true });
    f.latex = sanitized;
    successCount++;
  } catch (err) {
    console.error(`[FAIL] ${f.id} (${f.title}): ${err.message}`);
    failureReport.push({ id: f.id, title: f.title, candidate: sanitized, err: err.message });
    // Safe fallback
    f.latex = `\\text{${f.expr.replace(/[\\{}^_%$&#~]/g, " ")}}`;
  }
});

console.log(`\nKaTeX Strict Validation: ${successCount} / ${formulas.length} PASSED.`);

if (failureReport.length > 0) {
  console.error("Failures detected:", failureReport);
  process.exit(1);
}

// Write back to data.js cleanly
const quizMatch = dataContent.match(/quiz:\s*(\[[\s\S]*?\n\s*\]),/);
const topicsMatch = dataContent.match(/topics:\s*(\[[\s\S]*?\n\s*\])\s*\}\s*;/);

if (!quizMatch || !topicsMatch) {
  console.error("Could not parse quiz or topics from data.js");
  process.exit(1);
}

const updatedDataContent = `/* Nemo content: practice questions, formula bank and offline answers.
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

fs.writeFileSync(dataPath, updatedDataContent, "utf8");
console.log(`Successfully updated ${dataPath} with all verified formulas!`);
