/**
 * Deloitte PPTX Node — Slide Helpers
 * Thin wrappers over pptxgenjs that enforce brand defaults.
 * Import via: const { newPres, rect, txt, footer } = require('./helpers');
 */

const PptxGenJS = require("pptxgenjs");
const { C, LAYOUT, FONT, SZ } = require("./constants");

// ─── PRESENTATION ─────────────────────────────────────────────────────────────

/**
 * Create a new presentation pre-configured for Deloitte 16:9 RTL slides.
 * Always use this instead of `new PptxGenJS()` directly.
 */
function newPres() {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";   // 13.33" × 7.50"
  pres.rtlMode = true;
  return pres;
}

// ─── SHAPES ───────────────────────────────────────────────────────────────────

/**
 * Add a filled rectangle.
 * @param {object} slide  - pptxgenjs slide
 * @param {number} x,y    - position in inches
 * @param {number} w,h    - size in inches
 * @param {string} fill   - hex color (no #)
 * @param {string} [line] - border hex color; omit for no border
 * @param {number} [lw]   - border width in pt (default 0.5)
 */
function rect(slide, x, y, w, h, fill, line, lw = 0.5) {
  slide.addShape(slide.pres ? slide.pres.ShapeType.rect : _shapeType(slide), {
    x, y, w, h,
    fill: { color: fill },
    line: line
      ? { color: line, width: lw }
      : { color: fill, width: 0 },
  });
}

/**
 * Add a text box.
 * @param {object} slide
 * @param {string} text
 * @param {number} x,y,w,h - inches
 * @param {object} [opts]
 *   sz      {number}  font size in pt (default 10 — brand floor)
 *   bold    {boolean}
 *   italic  {boolean}
 *   col     {string}  text hex color (default dark gray)
 *   align   {string}  "right" | "center" | "left" (default "right" for RTL)
 *   rtl     {boolean} true = enable RTL paragraph direction (default true)
 *   valign  {string}  "top" | "middle" | "bottom" (default "top")
 */
function txt(slide, text, x, y, w, h, opts = {}) {
  const sz = opts.sz || SZ.body.default;
  if (sz < SZ.body.min && !opts._allowSmall) {
    console.warn(`[deloitte-pptx-node] Font size ${sz}pt below 10pt floor — use opts._allowSmall:true only for source citations`);
  }
  slide.addText(text, {
    x, y, w, h,
    fontFace: FONT,
    fontSize: sz,
    bold:     opts.bold    || false,
    italic:   opts.italic  || false,
    color:    opts.col     || C.darkGray,
    align:    opts.align   || "right",
    rtlMode:  opts.rtl     !== false,
    valign:   opts.valign  || "top",
    wrap:     true,
  });
}

// ─── ZONES ────────────────────────────────────────────────────────────────────

/**
 * Render the standard slide footer.
 *   left  — "ניתוח דלויט" (or custom)
 *   center — copyright line
 *   right  — page number
 * The thin separator rule above the footer is included.
 */
function footer(slide, { left = "ניתוח דלויט", copyright, pageNum } = {}) {
  const fy = LAYOUT.footerY;
  const cx = copyright || "© 2026 Deloitte Consulting Pty Ltd. All rights reserved.";

  // Separator rule
  rect(slide, LAYOUT.margin, fy - 0.02, LAYOUT.contentW, 0.01, C.ltGray);

  txt(slide, left,   LAYOUT.margin, fy, 2.00, 0.28,
    { sz: SZ.source.default, col: C.gray7, align: "right",  rtl: true,  _allowSmall: true });
  txt(slide, cx,     3.50,          fy, 6.33, 0.28,
    { sz: SZ.source.default, col: C.gray7, align: "center", rtl: false, _allowSmall: true });
  txt(slide, String(pageNum || ""), 12.33, fy, 0.50, 0.28,
    { sz: SZ.source.default, col: C.gray7, align: "left",   rtl: false, _allowSmall: true });
}

/**
 * Render Zone A — the standard slide header (title + badge + subtitle).
 * Used by Type F (Amplifier Stage) slides and any badge-header pattern.
 *
 * @param {object} slide
 * @param {object} opts
 *   badgeLabel  {string}  e.g. "1 — היחשפות"
 *   badgeColor  {string}  hex
 *   badgeTextCol{string}  hex (default white)
 *   title       {string}
 *   subtitle    {string}
 *   ruleColor   {string}  hex for the separator rule (default teal)
 */
function zoneHeader(slide, { badgeLabel, badgeColor, badgeTextCol, title, subtitle, ruleColor } = {}) {
  const M = LAYOUT.margin;

  // Badge pill (physical left = RTL reading-start)
  rect(slide, M, 0.22, 1.90, 0.44, badgeColor || C.teal);
  txt(slide, badgeLabel || "", M + 0.04, 0.28, 1.82, 0.32, {
    sz: 10, bold: true, col: badgeTextCol || C.white, align: "center", rtl: false,
  });

  // Title (physical right)
  txt(slide, title || "", 2.55, 0.17, 10.28, 0.58, {
    sz: SZ.title.default, bold: true, col: C.darkGray,
  });

  // Separator rule
  rect(slide, M, 0.77, LAYOUT.contentW, 0.03, ruleColor || C.teal);

  // Subtitle
  if (subtitle) {
    txt(slide, subtitle, M, 0.82, LAYOUT.contentW, 0.38, {
      sz: 10, italic: true, col: C.gray11,
    });
  }
}

// ─── INTERNAL ─────────────────────────────────────────────────────────────────

// pptxgenjs stores ShapeType on the pres instance. When called via slide.pres
// it's accessible; otherwise fall back to the numeric type directly.
function _shapeType(slide) {
  try {
    return slide._slideObject ? slide._slideObject.pres.ShapeType.rect : "rect";
  } catch {
    return "rect";
  }
}

// Patch rect() to use the string "rect" which pptxgenjs also accepts
function _rectFixed(slide, x, y, w, h, fill, line, lw = 0.5) {
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: fill },
    line: line ? { color: line, width: lw } : { color: fill, width: 0 },
  });
}

module.exports = { newPres, rect: _rectFixed, txt, footer, zoneHeader };
