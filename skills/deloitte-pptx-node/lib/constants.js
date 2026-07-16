/**
 * Deloitte PPTX Node — Shared Constants
 * Brand palette, layout dimensions, and font settings for pptxgenjs.
 * All dimensions in inches. All colors as hex strings (no #).
 */

// ─── BRAND PALETTE ────────────────────────────────────────────────────────────

const C = {
  // Primary
  deloitteGreen: "86BC25",
  black:         "000000",

  // Extended Greens
  midGreen:      "26890D",
  deepGreen:     "046A38",
  darkGreenBg:   "1C3D26",
  paleGreen:     "F1F6E4",   // slide backgrounds ONLY — never card/tile fill

  // Teals
  teal:          "0D8390",   // Accessible Teal
  teal6:         "007680",
  teal5:         "0097A9",

  // Blues
  blue5:         "005587",
  blue4:         "0076A8",
  blue:          "00A3E0",

  // Grays
  darkGray:      "282728",
  gray11:        "53565A",
  gray7:         "97999B",
  ltGray:        "D0D0D0",
  white:         "FFFFFF",

  // Functional (RAG / status only — never card headers or decorative elements)
  red:           "DA2910",
  orange:        "ED8B00",
  yellow:        "FFCD00",
};

// ─── CARD HEADER COLOR SEQUENCES ──────────────────────────────────────────────
// Use these instead of picking colors manually — prevents off-palette choices.

const HEADERS = {
  two:   [C.deloitteGreen, C.teal],
  three: [C.deloitteGreen, C.teal, C.blue5],
  four:  [C.deloitteGreen, C.midGreen, C.teal, C.blue5],
  multi: [C.deloitteGreen, C.midGreen, C.deepGreen, C.teal, C.blue5, C.blue4],
};

// ─── CHART COLOR SEQUENCES ────────────────────────────────────────────────────

const CHARTS = {
  greens: ["86BC25", "26890D", "046A38", "43B02A", "009A44", "C4D600"],
  teals:  ["0D8390", "007680", "0097A9", "00ABAB", "6FC2B4", "9DD4CF"],
  blues:  ["005587", "0076A8", "00A3E0", "62B5E5", "A0DCFF"],
  mixed:  ["86BC25", "0D8390", "00A3E0", "26890D", "0076A8", "C4D600"],
};

// ─── LAYOUT DIMENSIONS ────────────────────────────────────────────────────────

const LAYOUT = {
  slideW:       13.33,  // inches
  slideH:        7.50,
  margin:        0.50,  // left/right content margin
  contentX:      0.50,
  contentW:     12.33,  // slideW - 2 * margin
  contentY:      1.84,  // below header area
  contentH:      5.12,  // to bottom safe area (y=6.96)
  footerY:       6.54,  // footer zone start
  sourceCutoff:  6.40,  // nothing non-footnote below this
};

// ─── FONT ─────────────────────────────────────────────────────────────────────
// pptxgenjs builds from scratch — no Office template loaded.
// Arial is the safe fallback for RTL Hebrew without a custom font embed.
// If Rubik or Noto Sans Hebrew is confirmed installed on the target machine,
// set FONT to that name — it will render natively in PowerPoint on that machine.

const FONT = "Arial";

// Font size minimums — same floor as Python skill
const SZ = {
  title:   { min: 20, default: 24, max: 28 },
  subtitle:{ min: 14, default: 16 },
  header:  { min: 11, default: 12, max: 14 },
  body:    { min: 10, default: 11 },   // 10pt HARD FLOOR
  source:  { min:  7, default:  7 },   // 7pt minimum
};

module.exports = { C, HEADERS, CHARTS, LAYOUT, FONT, SZ };
