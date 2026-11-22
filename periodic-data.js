(function (root) {
  "use strict";

  const CATEGORIES = {
    "alkali": { label: "Alkali Metal", short: "Alkali" },
    "alkaline": { label: "Alkaline Earth Metal", short: "Alkaline Earth" },
    "transition": { label: "Transition Metal", short: "Transition" },
    "post-transition": { label: "Post-Transition Metal", short: "Post-Trans." },
    "metalloid": { label: "Metalloid", short: "Metalloid" },
    "reactive-nonmetal": { label: "Reactive Nonmetal", short: "Nonmetal" },
    "noble-gas": { label: "Noble Gas", short: "Noble Gas" },
    "lanthanoid": { label: "Lanthanoid (4f)", short: "Lanthanoid" },
    "actinoid": { label: "Actinoid (5f)", short: "Actinoid" }
  };

  // Compact tuple schema per element for fast zero-dependency offline loading:
  // [z, sym, name, mass, period, group, block, cat, state, ie1, ea, en, radius, mp, bp, ox, core, valenceLatex, expectedValenceLatexOrNull]
  // For f-block (La..Lu = 57..71, Ac..Lr = 89..103): group is 3, and period distinguishes row 6 (4f) vs row 7 (5f).
  const RAW_ELEMENTS = [
    [1, "H", "Hydrogen", "1.008", 1, 1, "s", "reactive-nonmetal", "Gas", 1312, -73, 2.20, 31, 14, 20, "+1, -1", "", "1s^1", null],
    [2, "He", "Helium", "4.0026", 1, 18, "s", "noble-gas", "Gas", 2372, 48, null, 28, 1, 4, "0", "", "1s^2", null],

    [3, "Li", "Lithium", "6.94", 2, 1, "s", "alkali", "Solid", 520, -60, 0.98, 128, 454, 1615, "+1", "He", "2s^1", null],
    [4, "Be", "Beryllium", "9.0122", 2, 2, "s", "alkaline", "Solid", 899, 66, 1.57, 96, 1560, 2742, "+2", "He", "2s^2", null],
    [5, "B", "Boron", "10.81", 2, 13, "p", "metalloid", "Solid", 801, -27, 2.04, 84, 2349, 4200, "+3", "He", "2s^2\\,2p^1", null],
    [6, "C", "Carbon", "12.011", 2, 14, "p", "reactive-nonmetal", "Solid", 1086, -122, 2.55, 76, 3823, 4300, "+4, +2, -4", "He", "2s^2\\,2p^2", null],
    [7, "N", "Nitrogen", "14.007", 2, 15, "p", "reactive-nonmetal", "Gas", 1402, 7, 3.04, 71, 63, 77, "-3\\text{ to }+5", "He", "2s^2\\,2p^3", null],
    [8, "O", "Oxygen", "15.999", 2, 16, "p", "reactive-nonmetal", "Gas", 1314, -141, 3.44, 66, 54, 90, "-2, -1, (+2\\text{ in }\\ce{OF2})", "He", "2s^2\\,2p^4", null],
    [9, "F", "Fluorine", "18.998", 2, 17, "p", "reactive-nonmetal", "Gas", 1681, -328, 3.98, 57, 53, 85, "-1", "He", "2s^2\\,2p^5", null],
    [10, "Ne", "Neon", "20.180", 2, 18, "p", "noble-gas", "Gas", 2081, 116, null, 58, 25, 27, "0", "He", "2s^2\\,2p^6", null],

    [11, "Na", "Sodium", "22.990", 3, 1, "s", "alkali", "Solid", 496, -53, 0.93, 166, 371, 1156, "+1", "Ne", "3s^1", null],
    [12, "Mg", "Magnesium", "24.305", 3, 2, "s", "alkaline", "Solid", 738, 40, 1.31, 141, 923, 1363, "+2", "Ne", "3s^2", null],
    [13, "Al", "Aluminium", "26.982", 3, 13, "p", "post-transition", "Solid", 578, -42, 1.61, 121, 933, 2792, "+3", "Ne", "3s^2\\,3p^1", null],
    [14, "Si", "Silicon", "28.085", 3, 14, "p", "metalloid", "Solid", 787, -134, 1.90, 111, 1687, 3538, "+4, -4", "Ne", "3s^2\\,3p^2", null],
    [15, "P", "Phosphorus", "30.974", 3, 15, "p", "reactive-nonmetal", "Solid", 1012, -72, 2.19, 107, 317, 554, "-3, +3, +5", "Ne", "3s^2\\,3p^3", null],
    [16, "S", "Sulfur", "32.06", 3, 16, "p", "reactive-nonmetal", "Solid", 1000, -200, 2.58, 105, 388, 718, "-2, +4, +6", "Ne", "3s^2\\,3p^4", null],
    [17, "Cl", "Chlorine", "35.45", 3, 17, "p", "reactive-nonmetal", "Gas", 1251, -349, 3.16, 102, 172, 239, "-1, +1, +3, +5, +7", "Ne", "3s^2\\,3p^5", null],
    [18, "Ar", "Argon", "39.948", 3, 18, "p", "noble-gas", "Gas", 1521, 96, null, 106, 84, 87, "0", "Ne", "3s^2\\,3p^6", null],

    [19, "K", "Potassium", "39.098", 4, 1, "s", "alkali", "Solid", 419, -48, 0.82, 203, 337, 1032, "+1", "Ar", "4s^1", null],
    [20, "Ca", "Calcium", "40.078", 4, 2, "s", "alkaline", "Solid", 590, -2, 1.00, 176, 1115, 1757, "+2", "Ar", "4s^2", null],
    [21, "Sc", "Scandium", "44.956", 4, 3, "d", "transition", "Solid", 633, -18, 1.36, 170, 1814, 3109, "+3", "Ar", "3d^1\\,4s^2", null],
    [22, "Ti", "Titanium", "47.867", 4, 4, "d", "transition", "Solid", 659, -8, 1.54, 160, 1941, 3560, "+4, +3, +2", "Ar", "3d^2\\,4s^2", null],
    [23, "V", "Vanadium", "50.942", 4, 5, "d", "transition", "Solid", 651, -51, 1.63, 153, 2183, 3680, "+5, +4, +3, +2", "Ar", "3d^3\\,4s^2", null],
    [24, "Cr", "Chromium", "51.996", 4, 6, "d", "transition", "Solid", 653, -65, 1.66, 139, 2180, 2944, "+6, +3, +2", "Ar", "3d^5\\,4s^1", "3d^4\\,4s^2"],
    [25, "Mn", "Manganese", "54.938", 4, 7, "d", "transition", "Solid", 717, 0, 1.55, 139, 1519, 2334, "+7, +4, +2", "Ar", "3d^5\\,4s^2", null],
    [26, "Fe", "Iron", "55.845", 4, 8, "d", "transition", "Solid", 762, -15, 1.83, 132, 1811, 3134, "+3, +2, (+6)", "Ar", "3d^6\\,4s^2", null],
    [27, "Co", "Cobalt", "58.933", 4, 9, "d", "transition", "Solid", 760, -64, 1.88, 126, 1768, 3200, "+3, +2", "Ar", "3d^7\\,4s^2", null],
    [28, "Ni", "Nickel", "58.693", 4, 10, "d", "transition", "Solid", 737, -112, 1.91, 124, 1728, 3186, "+2, (+3, +4)", "Ar", "3d^8\\,4s^2", null],
    [29, "Cu", "Copper", "63.546", 4, 11, "d", "transition", "Solid", 745, -119, 1.90, 132, 1358, 2835, "+2, +1", "Ar", "3d^{10}\\,4s^1", "3d^9\\,4s^2"],
    [30, "Zn", "Zinc", "65.38", 4, 12, "d", "transition", "Solid", 906, 58, 1.65, 122, 693, 1180, "+2", "Ar", "3d^{10}\\,4s^2", null],
    [31, "Ga", "Gallium", "69.723", 4, 13, "p", "post-transition", "Solid", 579, -29, 1.81, 122, 303, 2477, "+3, (+1)", "Ar", "3d^{10}\\,4s^2\\,4p^1", null],
    [32, "Ge", "Germanium", "72.630", 4, 14, "p", "metalloid", "Solid", 762, -119, 2.01, 120, 1211, 3106, "+4, +2", "Ar", "3d^{10}\\,4s^2\\,4p^2", null],
    [33, "As", "Arsenic", "74.922", 4, 15, "p", "metalloid", "Solid", 947, -78, 2.18, 119, 1090, 887, "-3, +3, +5", "Ar", "3d^{10}\\,4s^2\\,4p^3", null],
    [34, "Se", "Selenium", "78.971", 4, 16, "p", "reactive-nonmetal", "Solid", 941, -195, 2.55, 120, 494, 958, "-2, +4, +6", "Ar", "3d^{10}\\,4s^2\\,4p^4", null],
    [35, "Br", "Bromine", "79.904", 4, 17, "p", "reactive-nonmetal", "Liquid", 1140, -325, 2.96, 120, 266, 332, "-1, +1, +3, +5", "Ar", "3d^{10}\\,4s^2\\,4p^5", null],
    [36, "Kr", "Krypton", "83.798", 4, 18, "p", "noble-gas", "Gas", 1351, 96, 3.00, 116, 116, 120, "0, (+2\\text{ in }\\ce{KrF2})", "Ar", "3d^{10}\\,4s^2\\,4p^6", null],

    [37, "Rb", "Rubidium", "85.468", 5, 1, "s", "alkali", "Solid", 403, -47, 0.82, 220, 312, 961, "+1", "Kr", "5s^1", null],
    [38, "Sr", "Strontium", "87.62", 5, 2, "s", "alkaline", "Solid", 550, -5, 0.95, 195, 1050, 1655, "+2", "Kr", "5s^2", null],
    [39, "Y", "Yttrium", "88.906", 5, 3, "d", "transition", "Solid", 600, -30, 1.22, 190, 1799, 3609, "+3", "Kr", "4d^1\\,5s^2", null],
    [40, "Zr", "Zirconium", "91.224", 5, 4, "d", "transition", "Solid", 640, -41, 1.33, 175, 2128, 4682, "+4", "Kr", "4d^2\\,5s^2", null],
    [41, "Nb", "Niobium", "92.906", 5, 5, "d", "transition", "Solid", 652, -88, 1.60, 164, 2750, 5017, "+5, +3", "Kr", "4d^4\\,5s^1", "4d^3\\,5s^2"],
    [42, "Mo", "Molybdenum", "95.95", 5, 6, "d", "transition", "Solid", 684, -72, 2.16, 154, 2896, 4912, "+6, +4, +2", "Kr", "4d^5\\,5s^1", "4d^4\\,5s^2"],
    [43, "Tc", "Technetium", "[98]", 5, 7, "d", "transition", "Solid", 702, -53, 1.90, 147, 2430, 4538, "+7, +4", "Kr", "4d^5\\,5s^2", null],
    [44, "Ru", "Ruthenium", "101.07", 5, 8, "d", "transition", "Solid", 710, -101, 2.20, 146, 2607, 4423, "+8, +4, +3", "Kr", "4d^7\\,5s^1", "4d^6\\,5s^2"],
    [45, "Rh", "Rhodium", "102.91", 5, 9, "d", "transition", "Solid", 720, -110, 2.28, 142, 2237, 3968, "+3, +1", "Kr", "4d^8\\,5s^1", "4d^7\\,5s^2"],
    [46, "Pd", "Palladium", "106.42", 5, 10, "d", "transition", "Solid", 804, -54, 2.20, 139, 1828, 3236, "+2, +4, 0", "Kr", "4d^{10}\\,5s^0", "4d^8\\,5s^2"],
    [47, "Ag", "Silver", "107.87", 5, 11, "d", "transition", "Solid", 731, -126, 1.93, 145, 1235, 2435, "+1, (+2)", "Kr", "4d^{10}\\,5s^1", "4d^9\\,5s^2"],
    [48, "Cd", "Cadmium", "112.41", 5, 12, "d", "transition", "Solid", 868, 68, 1.69, 144, 594, 1040, "+2", "Kr", "4d^{10}\\,5s^2", null],
    [49, "In", "Indium", "114.82", 5, 13, "p", "post-transition", "Solid", 558, -37, 1.78, 142, 430, 2345, "+3, +1", "Kr", "4d^{10}\\,5s^2\\,5p^1", null],
    [50, "Sn", "Tin", "118.71", 5, 14, "p", "post-transition", "Solid", 709, -107, 1.96, 139, 505, 2875, "+4, +2", "Kr", "4d^{10}\\,5s^2\\,5p^2", null],
    [51, "Sb", "Antimony", "121.76", 5, 15, "p", "metalloid", "Solid", 834, -101, 2.05, 139, 904, 1860, "-3, +3, +5", "Kr", "4d^{10}\\,5s^2\\,5p^3", null],
    [52, "Te", "Tellurium", "127.60", 5, 16, "p", "metalloid", "Solid", 869, -190, 2.10, 138, 723, 1261, "-2, +4, +6", "Kr", "4d^{10}\\,5s^2\\,5p^4", null],
    [53, "I", "Iodine", "126.90", 5, 17, "p", "reactive-nonmetal", "Solid", 1008, -295, 2.66, 139, 387, 457, "-1, +1, +5, +7", "Kr", "4d^{10}\\,5s^2\\,5p^5", null],
    [54, "Xe", "Xenon", "131.29", 5, 18, "p", "noble-gas", "Gas", 1170, 83, 2.60, 140, 161, 165, "0, +2, +4, +6, +8", "Kr", "4d^{10}\\,5s^2\\,5p^6", null],

    [55, "Cs", "Caesium", "132.91", 6, 1, "s", "alkali", "Solid", 376, -46, 0.79, 244, 302, 944, "+1", "Xe", "6s^1", null],
    [56, "Ba", "Barium", "137.33", 6, 2, "s", "alkaline", "Solid", 503, -14, 0.89, 215, 1000, 2170, "+2", "Xe", "6s^2", null],
    [57, "La", "Lanthanum", "138.91", 6, 3, "f", "lanthanoid", "Solid", 538, -45, 1.10, 207, 1193, 3737, "+3", "Xe", "5d^1\\,6s^2", "4f^1\\,6s^2"],
    [58, "Ce", "Cerium", "140.12", 6, 3, "f", "lanthanoid", "Solid", 534, -55, 1.12, 204, 1068, 3716, "+3, +4", "Xe", "4f^1\\,5d^1\\,6s^2", "4f^2\\,6s^2"],
    [59, "Pr", "Praseodymium", "140.91", 6, 3, "f", "lanthanoid", "Solid", 527, -93, 1.13, 203, 1208, 3793, "+3, (+4)", "Xe", "4f^3\\,6s^2", null],
    [60, "Nd", "Neodymium", "144.24", 6, 3, "f", "lanthanoid", "Solid", 533, -185, 1.14, 201, 1297, 3347, "+3", "Xe", "4f^4\\,6s^2", null],
    [61, "Pm", "Promethium", "[145]", 6, 3, "f", "lanthanoid", "Solid", 540, -12, 1.13, 199, 1315, 3273, "+3", "Xe", "4f^5\\,6s^2", null],
    [62, "Sm", "Samarium", "150.36", 6, 3, "f", "lanthanoid", "Solid", 545, -16, 1.17, 198, 1345, 2067, "+3, +2", "Xe", "4f^6\\,6s^2", null],
    [63, "Eu", "Europium", "151.96", 6, 3, "f", "lanthanoid", "Solid", 547, -11, 1.20, 198, 1099, 1802, "+3, +2", "Xe", "4f^7\\,6s^2", null],
    [64, "Gd", "Gadolinium", "157.25", 6, 3, "f", "lanthanoid", "Solid", 593, -13, 1.20, 196, 1585, 3546, "+3", "Xe", "4f^7\\,5d^1\\,6s^2", "4f^8\\,6s^2"],
    [65, "Tb", "Terbium", "158.93", 6, 3, "f", "lanthanoid", "Solid", 566, -112, 1.20, 194, 1629, 3503, "+3, (+4)", "Xe", "4f^9\\,6s^2", null],
    [66, "Dy", "Dysprosium", "162.50", 6, 3, "f", "lanthanoid", "Solid", 573, -34, 1.22, 192, 1680, 2840, "+3", "Xe", "4f^{10}\\,6s^2", null],
    [67, "Ho", "Holmium", "164.93", 6, 3, "f", "lanthanoid", "Solid", 581, -33, 1.23, 192, 1734, 2993, "+3", "Xe", "4f^{11}\\,6s^2", null],
    [68, "Er", "Erbium", "167.26", 6, 3, "f", "lanthanoid", "Solid", 589, -30, 1.24, 189, 1802, 3141, "+3", "Xe", "4f^{12}\\,6s^2", null],
    [69, "Tm", "Thulium", "168.93", 6, 3, "f", "lanthanoid", "Solid", 597, -99, 1.25, 190, 1818, 2223, "+3, (+2)", "Xe", "4f^{13}\\,6s^2", null],
    [70, "Yb", "Ytterbium", "173.05", 6, 3, "f", "lanthanoid", "Solid", 603, 2, 1.10, 187, 1097, 1469, "+3, +2", "Xe", "4f^{14}\\,6s^2", null],
    [71, "Lu", "Lutetium", "174.97", 6, 3, "d", "lanthanoid", "Solid", 524, -33, 1.27, 187, 1925, 3675, "+3", "Xe", "4f^{14}\\,5d^1\\,6s^2", null],
    [72, "Hf", "Hafnium", "178.49", 6, 4, "d", "transition", "Solid", 659, -17, 1.30, 175, 2506, 4876, "+4", "Xe", "4f^{14}\\,5d^2\\,6s^2", null],
    [73, "Ta", "Tantalum", "180.95", 6, 5, "d", "transition", "Solid", 761, -31, 1.50, 170, 3290, 5731, "+5", "Xe", "4f^{14}\\,5d^3\\,6s^2", null],
    [74, "W", "Tungsten", "183.84", 6, 6, "d", "transition", "Solid", 770, -79, 2.36, 162, 3695, 5828, "+6, +4", "Xe", "4f^{14}\\,5d^4\\,6s^2", null],
    [75, "Re", "Rhenium", "186.21", 6, 7, "d", "transition", "Solid", 760, -6, 1.90, 151, 3459, 5869, "+7, +4", "Xe", "4f^{14}\\,5d^5\\,6s^2", null],
    [76, "Os", "Osmium", "190.23", 6, 8, "d", "transition", "Solid", 840, -106, 2.20, 144, 3306, 5285, "+8, +4", "Xe", "4f^{14}\\,5d^6\\,6s^2", null],
    [77, "Ir", "Iridium", "192.22", 6, 9, "d", "transition", "Solid", 880, -151, 2.20, 141, 2719, 4701, "+4, +3", "Xe", "4f^{14}\\,5d^7\\,6s^2", null],
    [78, "Pt", "Platinum", "195.08", 6, 10, "d", "transition", "Solid", 870, -205, 2.28, 136, 2041, 4098, "+4, +2", "Xe", "4f^{14}\\,5d^9\\,6s^1", "4f^{14}\\,5d^8\\,6s^2"],
    [79, "Au", "Gold", "196.97", 6, 11, "d", "transition", "Solid", 890, -223, 2.54, 136, 1337, 3129, "+3, +1", "Xe", "4f^{14}\\,5d^{10}\\,6s^1", "4f^{14}\\,5d^9\\,6s^2"],
    [80, "Hg", "Mercury", "200.59", 6, 12, "d", "transition", "Liquid", 1007, 48, 2.00, 132, 234, 630, "+2, +1\\;(\\ce{Hg2^{2+}})", "Xe", "4f^{14}\\,5d^{10}\\,6s^2", null],
    [81, "Tl", "Thallium", "204.38", 6, 13, "p", "post-transition", "Solid", 589, -36, 1.62, 145, 577, 1746, "+1, +3", "Xe", "4f^{14}\\,5d^{10}\\,6s^2\\,6p^1", null],
    [82, "Pb", "Lead", "207.2", 6, 14, "p", "post-transition", "Solid", 716, -35, 2.33, 146, 601, 2022, "+2, +4", "Xe", "4f^{14}\\,5d^{10}\\,6s^2\\,6p^2", null],
    [83, "Bi", "Bismuth", "208.98", 6, 15, "p", "post-transition", "Solid", 703, -91, 2.02, 148, 545, 1837, "+3, (+5)", "Xe", "4f^{14}\\,5d^{10}\\,6s^2\\,6p^3", null],
    [84, "Po", "Polonium", "[209]", 6, 16, "p", "post-transition", "Solid", 812, -136, 2.00, 140, 527, 1235, "+2, +4", "Xe", "4f^{14}\\,5d^{10}\\,6s^2\\,6p^4", null],
    [85, "At", "Astatine", "[210]", 6, 17, "p", "metalloid", "Solid", 899, -233, 2.20, 150, 575, 610, "-1, +1, +5", "Xe", "4f^{14}\\,5d^{10}\\,6s^2\\,6p^5", null],
    [86, "Rn", "Radon", "[222]", 6, 18, "p", "noble-gas", "Gas", 1037, 68, 2.20, 150, 202, 211, "0, (+2\\text{ in }\\ce{RnF2})", "Xe", "4f^{14}\\,5d^{10}\\,6s^2\\,6p^6", null],

    [87, "Fr", "Francium", "[223]", 7, 1, "s", "alkali", "Solid", 380, -47, 0.70, 260, 300, 950, "+1", "Rn", "7s^1", null],
    [88, "Ra", "Radium", "[226]", 7, 2, "s", "alkaline", "Solid", 509, -10, 0.90, 221, 973, 2010, "+2", "Rn", "7s^2", null],
    [89, "Ac", "Actinium", "[227]", 7, 3, "f", "actinoid", "Solid", 499, -34, 1.10, 215, 1323, 3471, "+3", "Rn", "6d^1\\,7s^2", "5f^1\\,7s^2"],
    [90, "Th", "Thorium", "232.04", 7, 3, "f", "actinoid", "Solid", 587, -59, 1.30, 206, 2115, 5061, "+4", "Rn", "6d^2\\,7s^2", "5f^2\\,7s^2"],
    [91, "Pa", "Protactinium", "231.04", 7, 3, "f", "actinoid", "Solid", 568, -53, 1.50, 200, 1841, 4300, "+5, +4", "Rn", "5f^2\\,6d^1\\,7s^2", "5f^3\\,7s^2"],
    [92, "U", "Uranium", "238.03", 7, 3, "f", "actinoid", "Solid", 598, -30, 1.38, 196, 1405, 4404, "+6, +4, +3", "Rn", "5f^3\\,6d^1\\,7s^2", "5f^4\\,7s^2"],
    [93, "Np", "Neptunium", "[237]", 7, 3, "f", "actinoid", "Solid", 605, -46, 1.36, 190, 917, 4273, "+5, +6, +4, +3", "Rn", "5f^4\\,6d^1\\,7s^2", "5f^5\\,7s^2"],
    [94, "Pu", "Plutonium", "[244]", 7, 3, "f", "actinoid", "Solid", 585, 48, 1.28, 187, 912, 3501, "+4, +3, +5, +6", "Rn", "5f^6\\,7s^2", null],
    [95, "Am", "Americium", "[243]", 7, 3, "f", "actinoid", "Solid", 578, -10, 1.30, 180, 1449, 2880, "+3, (+4, +5, +6)", "Rn", "5f^7\\,7s^2", null],
    [96, "Cm", "Curium", "[247]", 7, 3, "f", "actinoid", "Solid", 581, -27, 1.30, 169, 1613, 3383, "+3", "Rn", "5f^7\\,6d^1\\,7s^2", "5f^8\\,7s^2"],
    [97, "Bk", "Berkelium", "[247]", 7, 3, "f", "actinoid", "Solid", 601, 160, 1.30, 168, 1259, 2900, "+3, +4", "Rn", "5f^9\\,7s^2", null],
    [98, "Cf", "Californium", "[251]", 7, 3, "f", "actinoid", "Solid", 608, 94, 1.30, 168, 1173, 1743, "+3", "Rn", "5f^{10}\\,7s^2", null],
    [99, "Es", "Einsteinium", "[252]", 7, 3, "f", "actinoid", "Solid", 619, 29, 1.30, 165, 1133, 1269, "+3", "Rn", "5f^{11}\\,7s^2", null],
    [100, "Fm", "Fermium", "[257]", 7, 3, "f", "actinoid", "Solid", 627, -34, 1.30, 167, 1800, null, "+3", "Rn", "5f^{12}\\,7s^2", null],
    [101, "Md", "Mendelevium", "[258]", 7, 3, "f", "actinoid", "Solid", 635, -94, 1.30, 173, 1100, null, "+3, +2", "Rn", "5f^{13}\\,7s^2", null],
    [102, "No", "Nobelium", "[259]", 7, 3, "f", "actinoid", "Solid", 642, 224, 1.30, 176, 1100, null, "+2, +3", "Rn", "5f^{14}\\,7s^2", null],
    [103, "Lr", "Lawrencium", "[266]", 7, 3, "d", "actinoid", "Solid", 473, 30, 1.30, 161, 1900, null, "+3", "Rn", "5f^{14}\\,7s^2\\,7p^1", "5f^{14}\\,6d^1\\,7s^2"],

    [104, "Rf", "Rutherfordium", "[267]", 7, 4, "d", "transition", "Solid", 580, null, null, 157, 2400, 5800, "+4", "Rn", "5f^{14}\\,6d^2\\,7s^2", null],
    [105, "Db", "Dubnium", "[268]", 7, 5, "d", "transition", "Solid", 665, null, null, 149, null, null, "+5", "Rn", "5f^{14}\\,6d^3\\,7s^2", null],
    [106, "Sg", "Seaborgium", "[269]", 7, 6, "d", "transition", "Solid", 757, null, null, 143, null, null, "+6", "Rn", "5f^{14}\\,6d^4\\,7s^2", null],
    [107, "Bh", "Bohrium", "[270]", 7, 7, "d", "transition", "Solid", 740, null, null, 141, null, null, "+7", "Rn", "5f^{14}\\,6d^5\\,7s^2", null],
    [108, "Hs", "Hassium", "[277]", 7, 8, "d", "transition", "Solid", 730, null, null, 134, null, null, "+8", "Rn", "5f^{14}\\,6d^6\\,7s^2", null],
    [109, "Mt", "Meitnerium", "[278]", 7, 9, "d", "transition", "Solid", 800, null, null, 129, null, null, "+3, +1", "Rn", "5f^{14}\\,6d^7\\,7s^2", null],
    [110, "Ds", "Darmstadtium", "[281]", 7, 10, "d", "transition", "Solid", 960, null, null, 128, null, null, "+2, +4", "Rn", "5f^{14}\\,6d^8\\,7s^2", null],
    [111, "Rg", "Roentgenium", "[282]", 7, 11, "d", "transition", "Solid", 1020, -151, null, 121, null, null, "+3, +1, -1", "Rn", "5f^{14}\\,6d^9\\,7s^2", null],
    [112, "Cn", "Copernicium", "[285]", 7, 12, "d", "transition", "Liquid", 1155, null, null, 122, null, 357, "+2", "Rn", "5f^{14}\\,6d^{10}\\,7s^2", null],
    [113, "Nh", "Nihonium", "[286]", 7, 13, "p", "post-transition", "Solid", 705, -66, null, 136, 700, 1430, "+1, +3", "Rn", "5f^{14}\\,6d^{10}\\,7s^2\\,7p^1", null],
    [114, "Fl", "Flerovium", "[289]", 7, 14, "p", "post-transition", "Solid", 824, null, null, 143, 284, 380, "+2", "Rn", "5f^{14}\\,6d^{10}\\,7s^2\\,7p^2", null],
    [115, "Mc", "Moscovium", "[290]", 7, 15, "p", "post-transition", "Solid", 538, -35, null, 162, 670, 1400, "+1, +3", "Rn", "5f^{14}\\,6d^{10}\\,7s^2\\,7p^3", null],
    [116, "Lv", "Livermorium", "[293]", 7, 16, "p", "post-transition", "Solid", 664, -74, null, 175, 708, 1085, "+2", "Rn", "5f^{14}\\,6d^{10}\\,7s^2\\,7p^4", null],
    [117, "Ts", "Tennessine", "[294]", 7, 17, "p", "metalloid", "Solid", 743, -165, null, 165, 723, 883, "-1, +1, +3", "Rn", "5f^{14}\\,6d^{10}\\,7s^2\\,7p^5", null],
    [118, "Og", "Oganesson", "[294]", 7, 18, "p", "noble-gas", "Solid", 860, -5, null, 157, 325, 450, "0, (+2, +4)", "Rn", "5f^{14}\\,6d^{10}\\,7s^2\\,7p^6", null]
  ];

  // Authoritative CBSE / JEE Main / JEE Advanced chemical exceptions & periodic traps per Z
  const EXCEPTIONS_BY_Z = {
    1: [
      { tag: "Dual Periodicity", title: "Group 1 vs. Group 17 Dilemma", body: "With $1s^1$, $\\ce{H}$ loses $1e^-$ like alkali metals to give $\\ce{H+}$ yet gains $1e^-$ like halogens ($\\Delta_{\\text{eg}}H^\\circ = -73\\text{ kJ mol}^{-1}$) to give hydride $\\ce{H-}$. However, its high $\\text{IE}_1 = 1312\\text{ kJ mol}^{-1}$ makes $\\ce{H+}$ unstable bare: it exists hydrated as $\\ce{H3O+}$ / $\\ce{H9O4+}$." },
      { tag: "Isotope Kinetic Effect", title: "Ortho–Para Hydrogen & D₂O Traps", body: "Protium ($^1\\ce{H}$), Deuterium ($^2\\ce{H}$), and Tritium ($^3\\ce{H}$, $\\beta^-$ emitter, $t_{1/2} = 12.33\\text{ yr}$) show marked kinetic isotope effects: $\\ce{D2O}$ freezes at $3.8^\\circ\\text{C}$ and reacts slower than $\\ce{H2O}$." }
    ],
    2: [
      { tag: "s-Block Placed in Group 18", title: "Electronic Configuration $1s^2$ vs. $np^6$", body: "Although Helium ends in $1s^2$ (technically **$s$-block** by differentiating electron), it sits in **Group 18** due to a completely filled valence $K$-shell ($n=1$), highest $\\text{IE}_1$ in the entire periodic table ($2372\\text{ kJ mol}^{-1}$), and endothermic $\\Delta_{\\text{eg}}H^\\circ > 0$." }
    ],
    3: [
      { tag: "Diagonal Relationship", title: "Li Resembles Mg & Anomalous Reductant Strength", body: "Despite having the **highest** $\\text{IE}_1$ ($520\\text{ kJ mol}^{-1}$) among alkali metals, $\\ce{Li}$ has the most negative standard electrode potential ($E^\\circ_{\\ce{Li+/Li}} = -3.04\\text{ V}$) in aqueous solution because tiny $\\ce{Li+}$ has overwhelming **hydration enthalpy** ($\\Delta_{\\text{hyd}}H^\\circ \\approx -520\\text{ kJ mol}^{-1}$)." },
      { tag: "Covalent & Thermal Traps", title: "Solubility of LiF & Decomposition of LiNO₃ / Li₂CO₃", body: "$\\ce{LiF}$ is sparingly soluble in water (very high lattice energy), whereas $\\ce{LiCl}$ dissolves in pyridine/acetone. $\\ce{4LiNO3 ->[\\Delta] 2Li2O + 4NO2 + O2}$ (like $\\ce{Mg(NO3)2}$, unlike other Group 1 nitrates which give $\\ce{MNO2}$)." }
    ],
    4: [
      { tag: "IE₁ Reversal Trap", title: "IE₁(Be) > IE₁(B) Despite Lower Z", body: "$\\ce{Be}$ ($1s^2\\,2s^2$, $899\\text{ kJ mol}^{-1}$) has higher $\\text{IE}_1$ than $\\ce{B}$ ($1s^2\\,2s^2\\,2p^1$, $801\\text{ kJ mol}^{-1}$) because penetrating, symmetrically filled **$2s^2$** electrons experience stronger nuclear attraction than the single **$2p^1$** electron shielded by $2s^2$." },
      { tag: "Amphoteric & Diagonal Trap", title: "Be Resembles Al; Endothermic Electron Gain", body: "$\\ce{Be}$ has positive (endothermic) $\\Delta_{\\text{eg}}H^\\circ$ due to filled $2s^2$. Like $\\ce{Al}$, $\\ce{Be(OH)2}$ is **amphoteric**, forms polymeric bridging $(\\ce{BeCl2})_n$ ($sp^3$) in solid state vs. dimer $\\ce{Be2Cl4}$ in vapour, and $\\ce{Be2C + 4H2O -> 2Be(OH)2 + CH4}$." }
    ],
    5: [
      { tag: "Back-Bonding Exception", title: "Lewis Acidity Reversal: BF₃ < BCl₃ < BBr₃ < BI₃", body: "Opposite to inductive electronegativity expectations, $\\ce{BF3}$ is the **weakest** Lewis acid among boron trihalides because effective **$2p\\pi\\text{–}2p\\pi$ back-bonding** from $\\ce{F}$ lone pairs fills Boron's vacant $2p_z$ orbital." },
      { tag: "3c–2e⁻ Bonding & Boric Acid", title: "Diborane Banana Bonds & H₃BO₃ Monobasic Acid", body: "$\\ce{B2H6}$ contains two $3c\\text{–}2e^-$ $\\ce{B-H-B}$ bridges ($sp^3$ Boron). Orthoboric acid $\\ce{B(OH)3}$ is a weak **monobasic Lewis acid** (not proton donor): $\\ce{B(OH)3 + 2H2O <=> [B(OH)4]- + H3O+}$." }
    ],
    6: [
      { tag: "MOT Bond Order Trap", title: "C₂ Molecule Contains Two π Bonds & Zero σ Bonds", body: "Via $s\\text{–}p$ mixing ($12\\,e^-$), $\\ce{C2}$ has configuration $(\\sigma_{2s})^2(\\sigma^*_{2s})^2(\\pi_{2p_x})^2(\\pi_{2p_y})^2$: **Bond Order $= 2$**, **diamagnetic**, with **both bonds purely $\\pi$**." },
      { tag: "Alkali Hydrolysis & Fullerenes", title: "Carbides & CO₂ vs. SiO₂ Lattice Contrast", body: "$\\ce{CO2}$ is a monomeric gas ($sp$, $p\\pi\\text{–}p\\pi$) while $\\ce{SiO2}$ is a 3D covalent network ($sp^3$) because $\\ce{Si}$ resists $3p\\pi\\text{–}2p\\pi$ overlap." }
    ],
    7: [
      { tag: "IE₁ & EA Double Trap", title: "IE₁(N) > IE₁(O) & Endothermic Δ_egH°", body: "Half-filled **$2p^3$** exchange symmetry gives $\\ce{N}$ higher $\\text{IE}_1$ ($1402 > 1314\\text{ kJ mol}^{-1}$) than $\\ce{O}$, and positive $\\Delta_{\\text{eg}}H_1^\\circ \\approx +7\\text{ kJ mol}^{-1}$." },
      { tag: "Hydrolysis & Covalency Cap", title: "Max Covalency 4; NCl₃ vs. PCl₃ Hydrolysis", body: "Without $2d$ orbitals, $\\ce{N}$ cannot exceed covalency $4$ (no $\\ce{NCl5}$). Because $\\ce{N}$ lacks $d$-orbitals, $\\ce{H2O}$ attacks Cl in $\\ce{NCl3}$: $\\ce{NCl3 + 3H2O -> NH3 + 3HOCl}$ (opposite to $\\ce{PCl3 + 3H2O -> H3PO3 + 3HCl}$)." }
    ],
    8: [
      { tag: "MOT Paramagnetism & EA Trap", title: "O₂ Paramagnetism & S More Exothermic EA than O", body: "$\\ce{O2}$ ($16\\,e^-$) has two unpaired electrons in $\\pi^{*1}_{2p_x}\\,\\pi^{*1}_{2p_y}$ (paramagnetic, B.O. $=2$). Adding $1e^-$ to compact $2p$ of $\\ce{O}$ causes strong inter-electronic repulsion ($\\Delta_{\\text{eg}}H_1^\\circ = -141$ vs $\\ce{S} = -200\\text{ kJ mol}^{-1}$), and $\\ce{O -> O^{2-}}$ overall is strongly endothermic ($\\Delta_{\\text{eg}}H_2^\\circ = +780\\text{ kJ mol}^{-1}$)." },
      { tag: "Positive Oxidation State", title: "O Exhibits +2 and +1 ONLY with Fluorine", body: "In $\\ce{OF2}$ (bent, $\\approx 103^\\circ$), $\\text{O.N.}(\\ce{O}) = +2$; in $\\ce{O2F2}$, $\\text{O.N.}(\\ce{O}) = +1$; in peroxides ($\\ce{H2O2, CrO5}$) $\\text{O-O}$ bond gives $-1$; in superoxides ($\\ce{KO2}$) it is $-\\tfrac{1}{2}$ (paramagnetic!)." }
    ],
    9: [
      { tag: "Halogen Anomaly", title: "Why F₂ is a Stronger Oxidant than Cl₂ Despite Cl > F EA", body: "Even though $\\ce{Cl}$ has a more exothermic $\\Delta_{\\text{eg}}H^\\circ$ ($-349$ vs $-328\\text{ kJ mol}^{-1}$) due to $2p$ repulsion, $\\ce{F2}$ has an exceptionally weak $\\ce{F-F}$ bond ($158\\text{ kJ mol}^{-1}$ from lone-pair repulsion) and enormous hydration enthalpy of tiny $\\ce{F-}$ ($-515\\text{ kJ mol}^{-1}$)." },
      { tag: "Unusual Water & Acid Behaviour", title: "Oxidation of Water & Weak HF vs. Strong HI", body: "$\\ce{2F2 + 2H2O -> 4HF + O2}$ (no disproportionation unlike $\\ce{Cl2}$!). Dilute $\\ce{HF}$ is a weak acid ($K_a \\approx 6.8\\times 10^{-4}$), and concentrated $\\ce{HF}$ forms $\\ce{[HF2]-}$ via symmetric H-bonding, making $\\ce{KHF2}$ exist while $\\ce{KHCl2}$ does not." }
    ],
    10: [
      { tag: "Radius Jump Trap", title: "van der Waals Radius Makes r(Ne) Appear Larger Than r(F)", body: "In Period 2, covalent radius decreases $\\ce{Li -> F}$ ($128 \\to 57\\text{ pm}$), then jumps sharply at $\\ce{Ne}$ ($154\\text{ pm}$ vdW / $58\\text{ pm}$ covalent) because noble gases are measured via non-bonded **van der Waals** contacts." }
    ],
    11: [
      { tag: "Liquid Ammonia & Oxides", title: "Birch Reduction Medium & Peroxide Formation", body: "$\\ce{Na}$ reacts with $\\ce{O2}$ to form **peroxide** $\\ce{Na2O2}$ (diamagnetic yellow solid), whereas $\\ce{Li}$ forms monoxide $\\ce{Li2O}$ and $\\ce{K/Rb/Cs}$ form superoxides $\\ce{MO2}$. Dissolving $\\ce{Na}$ in liquid $\\ce{NH3}$ produces deep blue paramagnetic ammoniated electrons $[e(\\ce{NH3})_y]^-$." }
    ],
    12: [
      { tag: "IE₁ Anomaly", title: "IE₁(Mg) > IE₁(Al) ($3s^2$ vs. $3p^1$)", body: "Just like $\\ce{Be > B}$, $\\ce{Mg}$ ($738\\text{ kJ mol}^{-1}$) exceeds $\\ce{Al}$ ($578\\text{ kJ mol}^{-1}$) due to filled, penetrating $3s^2$ subshell shielding the $3p^1$ electron." }
    ],
    13: [
      { tag: "d-Block Contraction & Period 3/4 Trap", title: "r(Al) > r(Ga) & Group 13 IE₁ Sawtooth Pattern", body: "Poor $3d^{10}$ shielding pulls $\\ce{Ga}$'s $4p^1$ inward so **$r(\\ce{Ga}) \\approx 122\\text{ pm} < r(\\ce{Al}) \\approx 121\\text{–}143\\text{ pm}$** (metallic radius $\\ce{Ga}=135 < \\ce{Al}=143\\text{ pm}$) and $\\text{IE}_1(\\ce{Ga}) > \\text{IE}_1(\\ce{Al})$! Full Group 13 $\\text{IE}_1$ order: $\\ce{B} > \\ce{Tl} > \\ce{Ga} > \\ce{Al} > \\ce{In}$." },
      { tag: "Halide Dimer Trap", title: "Anhydrous Al₂Cl₆ Covalent Dimer vs. Hexaaqua Ion", body: "$\\ce{AlCl3}$ is covalent and sublimes as bridged dimer $\\ce{Al2Cl6}$ ($3c\\text{–}4e^-$ chlorobridge), yet hydrolyses exothermically in excess water into ionic $[\\ce{Al(H2O)6}]^{3+} + 3\\ce{Cl-}$. Note $\\ce{Al}$ is **passive** toward conc. $\\ce{HNO3}$." }
    ],
    14: [
      { tag: "Silane & Back-Bonding Contrast", title: "Trisilylamine N(SiH₃)₃ Planarity ($sp^2$)", body: "Unlike pyramidal $\\ce{N(CH3)3}$ ($sp^3$), $\\ce{N(SiH3)3}$ is **trigonal planar** ($sp^2$, $\\angle \\ce{Si-N-Si} = 120^\\circ$) because N's lone pair delocalises into vacant $3d$ orbitals of $\\ce{Si}$ ($p\\pi\\text{–}d\\pi$ back-bonding), reducing its basicity. Also $\\ce{SiCl4}$ hydrolyses readily while $\\ce{CCl4}$ is inert." }
    ],
    15: [
      { tag: "Oxoacid Basicity Trap", title: "Basicity of H₃PO₂ (1), H₃PO₃ (2), H₃PO₄ (3)", body: "Only $-\\ce{OH}$ hydrogens ionise; $\\ce{P-H}$ hydrogens are reducing and non-acidic! Hence **$\\ce{H3PO2}$** has $1\\,(\\ce{OH}), 2\\,(\\ce{P-H}) \\implies$ monobasic; **$\\ce{H3PO3}$** is dibasic; **$\\ce{H3PO4}$** is tribasic. Also $\\ce{PCl5}$ exists as $[\\ce{PCl4}]+[\\ce{PCl6}]-$ in the solid state!" },
      { tag: "Drago's Rule & White Phosphorus", title: "PH₃ Near-90° Angle & P₄ Reactivity", body: "In $\\ce{PH3}$ ($\\angle \\approx 93.5^\\circ$), minimal hybridisation (**Drago's rule**) leaves the lone pair in an almost pure $3s$ orbital, making $\\ce{PH3}$ far less basic than $\\ce{NH3}$ ($107.8^\\circ$). Also $\\text{IE}_1(\\ce{P}) > \\text{IE}_1(\\ce{S})$." }
    ],
    16: [
      { tag: "Group 16 EA Champion Anomaly", title: "Sulfur Has More Exothermic Δ_egH° Than Oxygen", body: "$\\Delta_{\\text{eg}}H_1^\\circ(\\ce{S}) = -200\\text{ kJ mol}^{-1}$ vs. $\\ce{O} = -141\\text{ kJ mol}^{-1}$. Across Group 16 ($\\ce{S > Se > Te > Po > O}$), **Oxygen** has the **least** negative electron gain enthalpy!" },
      { tag: "Kinetic & Paramagnetic Traps", title: "SF₆ Kinetic Inertness & Paramagnetic S₂", body: "$\\ce{SF6}$ is sterically shielded against $\\ce{H2O}$ attack (unlike $\\ce{SF4}$ or $\\ce{TeF6}$). At $\\sim 1000\\text{ K}$, vapour $\\ce{S2}$ (like $\\ce{O2}$) is **paramagnetic** with $2$ unpaired $\\pi^*$ electrons!" }
    ],
    17: [
      { tag: "Most Exothermic EA in Periodic Table", title: "Chlorine Leads Electron Gain Enthalpy: Cl > F > Br > I", body: "$\\Delta_{\\text{eg}}H_1^\\circ(\\ce{Cl}) = -349\\text{ kJ mol}^{-1}$ is the most negative in the entire periodic table because its larger $3p$ subshell avoids the severe electron-electron crowding of Fluorine's $2p$ orbital." },
      { tag: "Hydrolysis & Oxyacid Acid Strength", title: "HClO < HClO₂ < HClO₃ < HClO₄ & Hot/Cold NaOH", body: "Acid strength & thermal stability rise with chlorine oxidation state ($+1 \\to +7$), while oxidising power follows the **reverse** trend ($\\ce{HClO}$ most oxidising). With hot conc. $\\ce{NaOH}$, $\\ce{Cl2 -> Cl- + ClO3-}$; cold dil. $\\ce{NaOH}$ gives $\\ce{Cl- + ClO-}$." }
    ],
    18: [
      { tag: "Mendeleev Mass Inversion", title: "Atomic Mass Ar (39.95) > K (39.10)", body: "Argon ($Z=18$) weighs more than Potassium ($Z=19$), which challenged Mendeleev's atomic-weight ordering until Moseley established atomic number ($Z$) periodicity." }
    ],
    19: [
      { tag: "Superoxide & Mass Inversion", title: "KO₂ Paramagnetic Superoxide; K Lighter Mass Than Ar", body: "$\\ce{KO2}$ contains superoxide ion $\\ce{O2-}$ (Bond Order $= 1.5$, **1 unpaired electron**, yellow/orange paramagnetic). Note $\\ce{K}$ ($39.10\\text{ u}$) < $\\ce{Ar}$ ($39.95\\text{ u}$)." }
    ],
    24: [
      { tag: "Aufbau Configuration Exception", title: "Observed [Ar] 3d⁵ 4s¹ vs. Expected [Ar] 3d⁴ 4s²", body: "Chromium promotes one $4s$ electron to gain a **half-filled $3d^5$** subshell: maximizing quantum **exchange energy** ($\\binom{5}{2} = 10$ parallel spin pairs) and minimizing pairing energy." },
      { tag: "Cr²⁺, CrO₅ & Chromyl Chloride Traps", title: "Cr²⁺ Strong Reductant (t₂g³) & CrO₅ (+6 Peroxo)", body: "$\\ce{Cr^{2+}}$ ($d^4$) rapidly reduces to stable $t_{2g}^3$ $\\ce{Cr^{3+}}$ in water ($E^\\circ = -0.41\\text{ V}$). In butterfly $\\ce{CrO5}$, two peroxo ($\\text{-O-O-}$) links keep $\\text{Cr}$ at **$+6$** (not $+10$). $\\ce{CrO2Cl2}$ test fails for $\\ce{HgCl2/AgCl}$ covalent chlorides." }
    ],
    25: [
      { tag: "d-Block Trend Anomaly", title: "Mn Abnormal Metallic Radius & High Mn³⁺ Oxidising Power", body: "Half-filled $3d^5\\,4s^2$ holds electrons tightly, yielding weaker metallic bonding, lower melting point ($1519\\text{ K}$ vs $\\ce{Cr}\\,2180\\text{ K}$), and negative $E^\\circ_{\\ce{Mn^{2+}/Mn}}$ anomaly. $\\ce{Mn^{3+}}$ ($d^4$) strongly oxidises back to $d^5$ $\\ce{Mn^{2+}}$, while $\\ce{Mn^{2+}}$ lacks $d\\text{–}d$ intensity (pale pink)." }
    ],
    26: [
      { tag: "Brown Ring & Prussian Blue Traps", title: "Fe⁺¹ in [Fe(H₂O)₅(NO)]²⁺ & Spin-State Contrast", body: "In the brown-ring complex $[\\ce{Fe(H2O)5(NO)}]SO_4$, nitric oxide binds as $\\ce{NO+}$ ($\\mu = 3.87\\text{ B.M.}$, $n=3$ unpaired $e^-$), making $\\ce{Fe} = +1$ ($d^7$ high-spin). Also $\\ce{Fe^{3+}}$ with $\\ce{H2O}$/$\\ce{NH3}$ stays high-spin ($n=5$), whereas $[\\ce{Fe(CN)6}]^{3-}$ is low-spin ($n=1$)." }
    ],
    27: [
      { tag: "CFT Spin Crossover & Co/Ni Mass", title: "[Co(C₂O₄)₃]³⁻ and [Co(H₂O)₆]³⁺ Are Low-Spin Diamagnetic (n=0)", body: "High $Z_{\\text{eff}}$ of $\\ce{Co^{3+}}$ ($d^6$) makes $\\Delta_o > P$ even with moderate-weak $\\ce{H2O}$ & oxalate ligands (exception: $[\\ce{CoF6}]^{3-}$ is high-spin paramagnetic, $n=4$). Also **Mendeleev mass inversion**: $A_r(\\ce{Co}) = 58.93 > A_r(\\ce{Ni}) = 58.69$!" }
    ],
    28: [
      { tag: "Square Planar d⁸ vs. Tetrahedral", title: "[Ni(CN)₄]²⁻ Diamagnetic vs. [NiCl₄]²⁻ Paramagnetic; Mond's Ni(CO)₄", body: "All $\\ce{Ni^{2+}}$ ($d^8$) tetrahedral complexes ($[\\ce{NiCl4}]^{2-}$) have $n=2$ ($\\mu = 2.83\\text{ B.M.}$), whereas strong-field $[\\ce{Ni(CN)4}]^{2-}$ is square planar $dsp^2$ ($n=0$). Zero-valent $\\ce{Ni(CO)4}$ is $sp^3$ tetrahedral & diamagnetic ($3d^{10}$ rearrangement)." }
    ],
    29: [
      { tag: "Aufbau Exception + Cu⁺ Disproportionation", title: "Observed [Ar] 3d¹⁰ 4s¹ & Positive E°(Cu²⁺/Cu) = +0.34 V", body: "Full $3d^{10}$ stability favours $3d^{10}\\,4s^1$ over $3d^9\\,4s^2$. Copper is the ONLY $3d$ metal with **positive** $E^\\circ_{\\ce{M^{2+}/M}} = +0.34\\text{ V}$ (cannot liberate $\\ce{H2}$ from dilute acids). In water, $\\ce{Cu+}$ disproportionates ($\\ce{2Cu+ -> Cu^{2+} + Cu}$) due to high $\\Delta_{\\text{hyd}}H(\\ce{Cu^{2+}})$—though $\\ce{CuI}$ & $[\\ce{Cu(CN)2}]-$ stabilise $\\ce{Cu+}$!" }
    ],
    30: [
      { tag: "Non-Transition d-Block Trap", title: "Zn, Cd, Hg Are d-Block But NOT Transition Elements", body: "Both elemental $\\ce{Zn}$ ($3d^{10}\\,4s^2$) and $\\ce{Zn^{2+}}$ ($3d^{10}$) have completely filled $d$ shells, so $\\ce{Zn}$ shows no variable oxidation state, zero $d\\text{–}d$ colour, low m.p. ($693\\text{ K}$), and negative $E^\\circ = -0.76\\text{ V}$." }
    ],
    31: [
      { tag: "d-Block Contraction Anomaly", title: "Ga Smaller Radius & Higher IE₁ Than Al; Liquid Near Room Temp", body: "Intervention of ten poorly shielding $3d$ electrons contracts $\\ce{Ga}$ ($r_{\\text{met}} = 135\\text{ pm} < \\ce{Al} = 143\\text{ pm}$) and lifts $\\text{IE}_1(\\ce{Ga}) = 579 > \\ce{Al} = 578\\text{ kJ mol}^{-1}$. Gallium melts at $302.9\\text{ K}$ ($29.8^\\circ\\text{C}$) yet boils at $2477\\text{ K}$!" }
    ],
    35: [
      { tag: "Standard Liquid Nonmetal", title: "Only Nonmetal Liquid at 298 K (1 atm)", body: "$\\ce{Br2}$ is the **sole liquid nonmetal** at STP (dark reddish-brown). $\\text{Cl}$ has more negative $\\Delta_{\\text{eg}}H^\\circ$ than both $\\ce{F}$ and $\\ce{Br}$." }
    ],
    36: [
      { tag: "Radius Jump & Noble Compound", title: "Forms KrF₂ (sp³d Linear) at Cryogenic Temps", body: "Like $\\ce{Xe}$, Krypton reacts with $\\ce{F2}$ under electric discharge ($\\approx 85\\text{ K}$) to form colourless $\\ce{KrF2}$ (far less stable than $\\ce{XeF2}$)." }
    ],
    40: [
      { tag: "Lanthanoid Contraction Twin", title: "Zr ≈ Hf Identical Atomic & Ionic Radii (160 pm vs. 159 pm)", body: "Because $14$ poorly shielding $4f$ electrons precede $\\ce{Hf}$ ($Z=72$), $\\ce{Zr}$ ($4d$) and $\\ce{Hf}$ ($5d$) possess **nearly identical covalent/ionic radii** ($\\ce{Zr^{4+}} \\approx 72\\text{ pm},\\;\\ce{Hf^{4+}} \\approx 71\\text{ pm}$) and coexist inseparably in nature." }
    ],
    41: [
      { tag: "Aufbau Exception", title: "Observed [Kr] 4d⁴ 5s¹ vs. Expected [Kr] 4d³ 5s²", body: "Unlike $3d$ $\\ce{V}$ ($3d^3\\,4s^2$), $4d$ orbital contraction narrows the $4d\\text{–}5s$ gap so $\\ce{Nb}$ adopts $4d^4\\,5s^1$. Also $\\ce{Nb}$ and $\\ce{Ta}$ act as chemical twins via lanthanoid contraction." }
    ],
    42: [
      { tag: "Aufbau Exception", title: "Observed [Kr] 4d⁵ 5s¹ vs. Expected [Kr] 4d⁴ 5s²", body: "Follows its congener $\\ce{Cr}$ by stabilising a half-filled $4d^5$ shell with $5s^1$. Unlike $\\ce{Cr(VI)}$ strong oxidant, $\\ce{Mo(VI)}$ in $\\ce{MoO3}$ / molybdates is much stabler." }
    ],
    44: [
      { tag: "Aufbau Exception & +8 State", title: "Observed [Kr] 4d⁷ 5s¹ & Highest Common +8 in RuO₄", body: "Preferential $4d$ spin pairing drops $5s$ occupancy to $5s^1$. $\\ce{RuO4}$ exhibits the $+8$ group oxidation state." }
    ],
    45: [
      { tag: "Aufbau Exception", title: "Observed [Kr] 4d⁸ 5s¹ vs. Expected [Kr] 4d⁷ 5s²", body: "$4d^8\\,5s^1$ minimizes $5s\\text{–}5s$ repulsion and gains $4d$ exchange stabilization. All $\\ce{Rh}$ ($4d$) complexes are low-spin." }
    ],
    46: [
      { tag: "Unique Double-Promotion Aufbau Exception!", title: "Pd Has ZERO 5s Electrons: [Kr] 4d¹⁰ 5s⁰", body: "Palladium ($Z=46$) is the **ONLY ground-state element in the periodic table** to promote BOTH outer $s$-electrons into $d$, achieving a closed $[\\mathrm{Kr}]\\,4d^{10}\\,5s^0$ shell! Note $\\ce{Pt}$ ($5d$) below it is $5d^9\\,6s^1$, NOT $5d^{10}$!" }
    ],
    47: [
      { tag: "Aufbau Exception & Photography Salt", title: "Observed [Kr] 4d¹⁰ 5s¹ & Pseudohalide Behaviour", body: "Closed $4d^{10}$ shell plus $5s^1$. Unlike $\\ce{Cu+}$, $\\ce{Ag+}$ resists oxidation/disproportionation in water and forms linear $sp$ $[\\ce{Ag(NH3)2}]+$ & $[\\ce{Ag(CN)2}]-$." }
    ],
    52: [
      { tag: "Mendeleev Mass Inversion", title: "Atomic Mass Te (127.60) > I (126.90)", body: "Classic Mendeleev reversal: Tellurium ($Z=52$) has higher standard atomic weight than Iodine ($Z=53$); Mendeleev placed $\\ce{I}$ after $\\ce{Te}$ to preserve chemical periodicity." }
    ],
    53: [
      { tag: "Metallic Lustre & Starch/Thiosulfate Test", title: "Only Halogen With Metallic Lustre; Iodometry vs. Iodimetry", body: "Large polarisable $5p$ electron cloud gives solid $\\ce{I2}$ a violet-black metallic sheen and slight conductance. Iodine forms deep-blue triiodide-amylose complex and oxidises $\\ce{S2O3^{2-}}$ to tetrathionate $\\ce{S4O6^{2-}}$ ($n=2$ per $\\ce{I2}$)." }
    ],
    54: [
      { tag: "First Noble Gas Chemistry & VSEPR Traps", title: "XeF₂, XeF₄, XeF₆ & XeO₃ Hydrolysis", body: "$\\ce{XeF2}$: $sp^3d$ linear ($3$ LP); $\\ce{XeF4}$: $sp^3d^2$ square planar ($2$ LP); $\\ce{XeF6}$: **distorted octahedral** ($sp^3d^3$, $1$ stereochemically active LP!). Partial hydrolysis: $\\ce{XeF6 + H2O -> XeOF4 + 2HF}$ ($sp^3d^2$ square pyramidal); complete hydrolysis gives explosive $\\ce{XeO3}$ ($sp^3$ trigonal pyramidal) and $\\ce{XeF4 + H2O}$ disproportionates!" }
    ],
    57: [
      { tag: "Aufbau $5d^1$ vs. $4f^1$ Anomaly", title: "Observed [Xe] 5d¹ 6s² (Zero 4f Electrons!)", body: "At $Z=57$, the $5d$ orbital lies slightly lower in energy than $4f$, so Lanthanum's differentiating electron enters **$5d$** ($[\\mathrm{Xe}]\\,5d^1\\,6s^2$) rather than $4f$!" }
    ],
    58: [
      { tag: "Aufbau Exception & +4 Oxidant", title: "Observed [Xe] 4f¹ 5d¹ 6s² & Strong Oxidant Ce⁴⁺", body: "$4f$ and $5d$ lie nearly degenerate at $Z=58$, leaving $5d^1$ occupied. $\\ce{Ce^{4+}}$ ($4f^0$ noble-gas core, $E^\\circ_{\\ce{Ce^{4+}/Ce^{3+}}} = +1.74\\text{ V}$) is a premier one-electron volumetric oxidant (slowly oxidises water kinetically)." }
    ],
    63: [
      { tag: "Abnormal Radius & Reductant Trap", title: "Eu²⁺ Stability ($4f^7$) Causes Metallic Radius Spike", body: "$\\ce{Eu}$ ($[\\mathrm{Xe}]\\,4f^7\\,6s^2$) donates only $2$ bonding electrons ($\\ce{Eu^{2+}}$ core) in its metallic lattice instead of $3$, causing an anomalous **upward atomic radius spike** alongside $\\ce{Yb}$. $\\ce{Eu^{2+}}$ is a strong reducing agent reverting to $\\ce{Eu^{3+}}$." }
    ],
    64: [
      { tag: "Aufbau Half-Filled Exception", title: "Observed [Xe] 4f⁷ 5d¹ 6s² Instead of 4f⁸ 6s²", body: "Putting the 8th electron into **$5d^1$** preserves the extraordinarily stable **half-filled $4f^7$** core (7 parallel spins, high exchange energy, $S = \\tfrac{7}{2}$)." }
    ],
    70: [
      { tag: "Full $4f^{14}$ Core & Radius Spike", title: "Yb²⁺ Stability Causes Metallic Radius Anomaly", body: "Like $\\ce{Eu}$ ($4f^7$), $\\ce{Yb}$ ($[\\mathrm{Xe}]\\,4f^{14}\\,6s^2$) prefers divalent $\\ce{Yb^{2+}}$ metallic bonding, creating the second metallic radius spike in the lanthanoid series and making $\\ce{Yb^{2+}}$ a classic reducing ion." }
    ],
    71: [
      { tag: "End of Lanthanoid Contraction", title: "Smallest Ln³⁺ Ion & Weakest Base Lu(OH)₃", body: "Lanthanoid contraction shrinks $r(\\ce{La^{3+}}) = 103\\text{ pm} \\to r(\\ce{Lu^{3+}}) = 86\\text{ pm}$, raising covalent character via Fajans' rule so **$\\ce{Lu(OH)3}$ is the weakest base** (and $\\ce{La(OH)3}$ strongest) across all lanthanoids." }
    ],
    72: [
      { tag: "Lanthanoid Contraction Hallmark", title: "Hf Almost Identical Size & IE Behaviour to Zr", body: "Poor $4f^{14}$ shielding shrinks $\\ce{Hf}$ ($159\\text{ pm}$) right onto $\\ce{Zr}$ ($160\\text{ pm}$), raising $\\ce{Hf}$'s density to double $\\ce{Zr}$'s and keeping both strictly $+4$ in almost identical chemistry." }
    ],
    78: [
      { tag: "Aufbau Exception & 5d Square Planar Rule", title: "Observed [Xe] 4f¹⁴ 5d⁹ 6s¹ & Always Low-Spin d⁸ Complexes", body: "Relativistic $6s$ contraction pulls $6s$ down yet $5d^9\\,6s^1$ remains lower than $5d^8\\,6s^2$. **ALL $\\ce{Pt^{2+}}$ ($5d^8$) complexes** (even $[\\ce{PtCl4}]^{2-}$ with weak-field $\\ce{Cl-}$!) are **square planar $dsp^2$ and diamagnetic** because $5d$ $\\Delta_o$ splitting is $\\sim 2\\times$ that of $3d$!" }
    ],
    79: [
      { tag: "Aufbau Exception + Relativistic Color", title: "Observed [Xe] 4f¹⁴ 5d¹⁰ 6s¹; Why Gold Is Yellow & Dissolved by Aqua Regia", body: "Relativistic contraction lowers Gold's $6s$ energy and expands $5d$, shrinking the $5d \\to 6s$ gap into **blue light absorption** (~$2.4\\text{ eV}$), reflecting lustrous **yellow** (unlike white $\\ce{Ag}$). Also explains $\\ce{Au-}$ auride ($\\ce{CsAu}$) and high $\\text{IE}_1 = 890\\text{ kJ mol}^{-1}$." }
    ],
    80: [
      { tag: "Relativistic Liquid Metal & Mercurous Dimer", title: "Liquid at 298 K & Dimeric [Hg–Hg]²⁺ Ion", body: "Strong relativistic stabilization shrinks and inert-pairs Mercury's **$6s^2$** electrons, weakening $\\ce{Hg–Hg}$ metallic bonds so it melts at **$234.3\\text{ K}$**! In $+1$ state, mercury forms covalent **diamagnetic dimer $\\ce{Hg2^{2+}}$** ($\\ce{[Hg-Hg]^{2+}}$) rather than paramagnetic $\\ce{Hg+}$." }
    ],
    81: [
      { tag: "Inert Pair Effect Champion (Group 13)", title: "Tl⁺ More Stable Than Tl³⁺; TlI₃ Is Tl⁺(I₃⁻)!", body: "Due to poor $4f^{14}\\,5d^{10}$ shielding + relativistic $6s^2$ contraction, $6s^2$ resists unpairing: $\\ce{Tl+}$ ($E^\\circ_{\\ce{Tl^{3+}/Tl+}} = +1.25\\text{ V}$) dominates and $\\ce{TlOH}$ is a strong soluble base. Classic trap: **$\\ce{TlI3}$** is **thallium(I) triiodide** ($\\ce{Tl+ I3-}$), NOT a $\\ce{Tl^{3+}}$ salt!" }
    ],
    82: [
      { tag: "Inert Pair Effect (Group 14)", title: "Pb²⁺ Stabler Than Pb⁴⁺; PbO₂ Strong Oxidant; No PbI₄", body: "$6s^2$ inert pair makes $\\ce{Pb^{4+}}$ strongly oxidising ($\\ce{PbO2}$ oxidises $\\ce{HCl -> Cl2}$ and $\\ce{Mn^{2+} -> MnO4-}$ in $\\ce{HNO3}$). **$\\ce{PbI4}$ does NOT exist** because $\\ce{Pb^{4+}}$ immediately oxidises $\\ce{I-}$ to $\\ce{I2}$, leaving $\\ce{PbI2}$!" }
    ],
    83: [
      { tag: "Inert Pair Effect (Group 15)", title: "Bi³⁺ Strongly Favoured; BiF₅ Is Only Stable Bi(V) Halide", body: "$\\ce{Bi^{5+}}$ ($\\ce{NaBiO3}$) is one of the fiercest oxidants in aqueous chemistry (even oxidises $\\ce{Mn^{2+}}$ to $\\ce{MnO4-}$ in cold acid!). Unlike $\\ce{PCl5/SbCl5}$, **$\\ce{BiF5}$** is the **only** well-characterised pentahalide of Bismuth; $\\ce{Bi^{3+}}$ hydrolyses to insoluble white $\\ce{BiOCl}$!" }
    ],
    89: [
      { tag: "Aufbau Exception", title: "Observed [Rn] 6d¹ 7s² (Zero 5f Electrons)", body: "Like $\\ce{La}$, Actinium begins the series by placing its differentiating electron in **$6d^1$** before $5f$ energy drops below $6d$." }
    ],
    90: [
      { tag: "Notable Double-6d Exception", title: "Observed [Rn] 6d² 7s² — Zero 5f Electrons Even at Z=90!", body: "Thorium ($Z=90$) violates $5f$ filling completely: BOTH extra valence electrons occupy **$6d^2$** ($[\\mathrm{Rn}]\\,6d^2\\,7s^2$), explaining why $\\ce{Th}$ exclusively exhibits $+4$ like a Group 4 transition metal ($\\ce{Zr/Hf}$)!" }
    ],
    91: [
      { tag: "Aufbau Exception", title: "Observed [Rn] 5f² 6d¹ 7s²", body: "Close energy between $5f$ and $6d$ keeps one electron in $6d^1$ alongside $5f^2$, contributing to rich $+5/+4$ chemistry." }
    ],
    92: [
      { tag: "Aufbau Exception & Wider Oxidation Range", title: "Observed [Rn] 5f³ 6d¹ 7s² & Linear Uranyl UO₂²⁺", body: "$5f, 6d, 7s$ orbitals lie closer in energy than $4f, 5d, 6s$ of lanthanoids, enabling actinoids like $\\ce{U}$ to span $+3, +4, +5, +6$ (forming linear $[\\ce{O=U=O}]^{2+}$)." }
    ],
    93: [
      { tag: "Aufbau Exception", title: "Observed [Rn] 5f⁴ 6d¹ 7s²", body: "Retains one $6d^1$ electron and displays oxidation states from $+3$ all the way to $+7$." }
    ],
    96: [
      { tag: "Aufbau Half-Filled 5f⁷ Exception", title: "Observed [Rn] 5f⁷ 6d¹ 7s² (Actinoid Analogue of Gd)", body: "Matches Gadolinium ($4f^7\\,5d^1\\,6s^2$): placing the 8th electron into $6d^1$ preserves the symmetrical, exchange-stabilised **half-filled $5f^7$** core." }
    ],
    103: [
      { tag: "Relativistic Aufbau Exception (IUPAC 2015)", title: "Observed [Rn] 5f¹⁴ 7s² 7p¹ Instead of 6d¹!", body: "Contrary to older textbooks writing $6d^1$, spin–orbit and **relativistic contraction** stabilise the $7p_{1/2}$ orbital below $6d$, making Lawrencium's ground state $[\\mathrm{Rn}]\\,5f^{14}\\,7s^2\\,7p^1$!" }
    ]
  };

  // Canonical 3D molecules in window.NEMO_MOLECULES mapped to key elements for 1-click "View in 3D"
  const ELEMENT_TO_3D = {
    1: "water", 5: "bf3", 6: "benzene", 7: "nh3", 8: "water", 9: "sf6",
    11: "nacl", 14: "sio2", 15: "pcl5", 16: "sf6", 17: "clf3",
    24: "crh2o6", 26: "fecn6", 27: "conh36", 28: "nicn4", 29: "cuh2o6",
    53: "if7", 54: "xef4", 78: "ptcl4"
  };

  function computeQuantumNumbers(el) {
    // Parse last subshell from valenceLatex (ignore s0)
    const parts = String(el.valence || "").split("\\,").map((s) => s.trim()).filter((s) => s && !/\^\{?0\}?$/.test(s));
    const target = parts[0] || el.valence;
    // Differentiating electron sits in highest-energy incomplete subshell:
    // d-block matches d^k (or falls back to last subshell e.g. 7p^1 in Lr);
    // f-block matches f^k (or falls back to d^k for La/Ac/Th).
    let pick = parts[parts.length - 1] || target;
    if (el.block === "d") {
      const dSub = parts.find((p) => /d\^/.test(p));
      if (dSub) pick = dSub;
    } else if (el.block === "f") {
      const fSub = parts.find((p) => /f\^/.test(p));
      const dSub = parts.find((p) => /d\^/.test(p));
      if (fSub) pick = fSub;
      else if (dSub) pick = dSub;
    }
    const m = pick.match(/^(\d)([spdf])\^\{?(\d+)\}?$/);
    if (!m) return { n: el.period, l: 0, ml: 0, ms: "+\\tfrac{1}{2}", subshell: pick };
    const n = Number(m[1]);
    const lMap = { s: 0, p: 1, d: 2, f: 3 };
    const l = lMap[m[2]] || 0;
    const eCount = Number(m[3]) || 1;
    const maxPerSpin = 2 * l + 1;
    const ml = -l + ((eCount - 1) % maxPerSpin);
    const ms = eCount <= maxPerSpin ? "+\\tfrac{1}{2}" : "-\\tfrac{1}{2}";
    return { n, l, ml, ms, subshell: `${n}${m[2]}^{${eCount}}` };
  }

  const ELEMENTS = RAW_ELEMENTS.map((row) => {
    const [z, sym, name, mass, period, group, block, cat, state, ie1, ea, en, radius, mp, bp, ox, core, valence, expectedValence] = row;
    const configLatex = core ? `[\\mathrm{${core}}]\\,${valence}` : valence;
    const expectedLatex = expectedValence ? (core ? `[\\mathrm{${core}}]\\,${expectedValence}` : expectedValence) : null;
    const obj = {
      z,
      sym,
      name,
      mass,
      period,
      group,
      block,
      cat,
      catLabel: (CATEGORIES[cat] && CATEGORIES[cat].label) || cat,
      state,
      ie1,
      ea,
      en,
      radius,
      mp,
      bp,
      ox,
      core,
      valence,
      configLatex,
      expectedLatex,
      anomalousConfig: Boolean(expectedValence),
      hasCuratedExceptions: Boolean(EXCEPTIONS_BY_Z[z]),
      molHint: ELEMENT_TO_3D[z] || null
    };
    obj.qn = computeQuantumNumbers(obj);
    return obj;
  });

  function getElementExceptions(el) {
    if (!el) return [];
    const list = EXCEPTIONS_BY_Z[el.z] ? EXCEPTIONS_BY_Z[el.z].slice() : [];
    if (list.length > 0) return list;

    // Fallback curated chemistry notes by series/block (exact periodic science, zero stubs)
    if (el.cat === "lanthanoid") {
      list.push({
        tag: "4f Lanthanoid Contraction",
        title: "Dominant +3 State & Ln³⁺ Ionic Shrinkage",
        body: `$\\ce{${el.sym}}$ adopts a characteristic **$+3$** oxidation state with shielded inner $4f$ electrons. Across $\\ce{La^{3+} -> Lu^{3+}}$, imperfect $4f$ screening causes **lanthanoid contraction**, steadily decreasing $r(\\ce{Ln^{3+}})$ and basicity of $\\ce{Ln(OH)3}$ while matching $4d/5d$ congener radii.`
      });
    } else if (el.cat === "actinoid") {
      list.push({
        tag: "5f Actinoid Contraction & Radioactivity",
        title: "Broader Oxidation Range & Stronger 5f Relativistic Screening",
        body: `In $\\ce{${el.sym}}$ ($Z=${el.z}$), $5f$ orbitals experience weaker nuclear shielding and lie closer in energy to $6d/7s$ than lanthanoid $4f$ orbitals, enabling broader oxidation variability (for early actinoids) and stronger complexing tendency.`
      });
    } else if (el.z >= 104) {
      list.push({
        tag: "Superheavy & Relativistic Effects",
        title: "Transactinide Group Placement & Spin–Orbit Splitting",
        body: `For superheavy $\\ce{${el.sym}}$ ($Z=${el.z}$), relativistic contraction lowers $7s$ and $7p_{1/2}$ energies strongly while expanding $6d/5f$, modifying expected IUPAC Group ${el.group} reactivity and predicted volatility.`
      });
    } else if (el.block === "d") {
      list.push({
        tag: `${el.period === 5 ? "4d" : "5d"} Heavy Transition Series`,
        title: "Always Low-Spin Complexes & Higher State Stability",
        body: `Unlike $3d$ metals, heavy transition $\\ce{${el.sym}}$ exhibits crystal field splitting $\\Delta_o \\gg P$ (all octahedral complexes **low-spin**) and prefers higher oxidation states (stable up to Group ${el.group}).`
      });
    } else {
      list.push({
        tag: `Period ${el.period} · Group ${el.group}`,
        title: `Periodic Trend Profile for ${el.name}`,
        body: `$\\ce{${el.sym}}$ has ground-state configuration $${el.configLatex}$ in the **${el.block}-block** with oxidation state(s) $${el.ox}$ and first ionisation enthalpy $\\text{IE}_1 = ${el.ie1 != null ? el.ie1 + "\\text{ kJ mol}^{-1}" : "\\text{N/A}"}$.`
      });
    }
    return list;
  }

  root.NEMO_PERIODIC = {
    ELEMENTS,
    CATEGORIES,
    EXCEPTIONS_BY_Z,
    getElementExceptions,
    byZ(z) { return ELEMENTS.find((e) => e.z === Number(z)) || ELEMENTS[0]; }
  };
})(typeof window !== "undefined" ? window : globalThis);
