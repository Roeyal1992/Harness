/**
 * Example: Slide 7 — Stage 1: היחשפות (Type F — Amplifier Stage)
 * CX Appendix — Israeli Ministry of Digital Services, Deloitte
 *
 * Demonstrates:
 *  - newPres() / zoneHeader() / footer() helpers
 *  - RTL needs table with 3 physical columns
 *  - Shani story box (Zone B)
 *
 * Run: node examples/build_slide07.js
 */

const path = require("path");
const { newPres, rect, txt, footer, zoneHeader } = require("../lib/helpers");
const { C, LAYOUT } = require("../lib/constants");

const OUT = path.join(__dirname, "slide07_test.pptx");
const M   = LAYOUT.margin;
const P   = 0.08;  // cell inner padding

// Needs table — physical RTL column positions (reading-start = physical RIGHT)
const COL_N = { x: 10.22, w: 2.61 };  // צרכים וציפיות     (right, narrow)
const COL_V = { x:  5.60, w: 4.52 };  // כיצד לא לפגוע     (centre)
const COL_A = { x:  0.50, w: 5.00 };  // כיצד הסוכן מעצים  (left, wide)

const pres  = newPres();
const slide = pres.addSlide();

// ── ZONE A — HEADER ──────────────────────────────────────────────────────────

zoneHeader(slide, {
  badgeLabel: "1 — היחשפות",
  badgeColor: C.teal,
  title:      "הרגע הראשון",
  subtitle:   "האזרח מגיע עם צורך — המערכת פוגשת אותו שם, בשפה שלו, ללא צורך לדעת איזה משרד.",
});

// ── ZONE B — SHANI STORY BOX ─────────────────────────────────────────────────

const SY = 1.28, SH = 1.85;
const IX = M + 0.12, IW = LAYOUT.contentW - 0.18;

rect(slide, M,    SY, LAYOUT.contentW, SH, C.storyBg || "E8F7F8", C.teal, 0.5);
rect(slide, M,    SY, 0.05,            SH, C.teal);  // accent bar

txt(slide, "בשעה טובה! נולד לשני ילד",
  IX, SY + 0.08, IW, 0.28, { sz: 11, bold: true, col: C.teal });

txt(slide,
  "שני בת 31, ילדה לפני שלוש שעות. שוכבת בחדר השחרור. המחשבה הראשונה: יש הרבה דברים שצריך לסדר — ואני לא יודעת מאיפה להתחיל.",
  IX, SY + 0.39, IW, 0.45, { sz: 10 });

txt(slide,
  "ברגע הזה שני מקבלת הודעת PUSH מהסוכן הממשלתי לגבי רישום התינוק.",
  IX, SY + 0.88, IW, 0.28, { sz: 10, bold: true });

txt(slide,
  "האם ניתנה לשני האפשרות לבחור אם לשתף מידע — או שהוא עבר אוטומטית? האם ההודעה מרגישה חמימה ואנושית? האם ברור לה מה הצעד הבא?",
  IX, SY + 1.20, IW, 0.55, { sz: 10, italic: true, col: C.gray11 });

// ── ZONE C — NEEDS TABLE ─────────────────────────────────────────────────────

const TY  = SY + SH + 0.08;
const TH  = 6.28 - TY;
const RHH = 0.42;
const RDH = (TH - RHH) / 3;

// Header row
rect(slide, COL_N.x, TY, COL_N.w, RHH, C.teal);
rect(slide, COL_V.x, TY, COL_V.w, RHH, C.gray11);
rect(slide, COL_A.x, TY, COL_A.w, RHH, C.deepGreen);

txt(slide, "צרכים וציפיות",
  COL_N.x + P, TY + P, COL_N.w - 2*P, RHH - 2*P, { sz: 10, bold: true, col: C.white });
txt(slide, "כיצד לא לפגוע בהם",
  COL_V.x + P, TY + P, COL_V.w - 2*P, RHH - 2*P, { sz: 10, bold: true, col: C.white });
txt(slide, "כיצד הסוכן מעצים את האזרח.ית",
  COL_A.x + P, TY + P, COL_A.w - 2*P, RHH - 2*P, { sz: 10, bold: true, col: C.white });

// Data rows
const ROWS = [
  {
    need:      "שקיפות ומובנות",
    noviolate: "אם שני מקבלת הודעה אבל לא ברור לה מה קורה, מה נדרש ממנה ומתי — ההודעה מוסיפה חרדה, לא מפחיתה אותה",
    amplify:   "הסוכן מסביר: מה קרה, מה הצעד הבא ומה אפשר לדחות. שני יוצאת עם מפת דרכים ברורה — לא עם שאלה פתוחה",
  },
  {
    need:      "שליטה ועצמאות",
    noviolate: "אם המידע הרפואי עבר אוטומטית — שני לא נשאלה, לא ידעה, לא בחרה. גם אם התוצאה טובה, הדרך מרגישה כמו חדירה",
    amplify:   "המערכת מבקשת אישור מפורש לפני שהמידע עובר. שני יודעת שהיא בחרה — לא שנחשפה",
  },
  {
    need:      "הכרה ומענה אנושי",
    noviolate: "הודעה קרה — 'הלידה נרשמה, יש למלא טופס 506' — מחמיצה את הרגע. שני לא מרגישה שמישהו ראה אותה",
    amplify:   "הסוכן מכיר ברגע תחילה — 'מזל טוב, שני' — ורק אחר כך מציע עזרה. הרגע האנושי קודם לתהליך",
  },
];

ROWS.forEach((row, i) => {
  const RY = TY + RHH + i * RDH;
  if (i > 0) rect(slide, M, RY, LAYOUT.contentW, 0.01, C.ltGray);

  rect(slide, COL_N.x, RY, COL_N.w, RDH, "F0F9FA", C.ltGray);
  rect(slide, COL_V.x, RY, COL_V.w, RDH, C.white,  C.ltGray);
  rect(slide, COL_A.x, RY, COL_A.w, RDH, C.white,  C.ltGray);

  txt(slide, row.need,
    COL_N.x + P, RY + P, COL_N.w - 2*P, RDH - 2*P, { sz: 10, bold: true, col: C.teal });
  txt(slide, row.noviolate,
    COL_V.x + P, RY + P, COL_V.w - 2*P, RDH - 2*P, { sz: 10 });
  txt(slide, row.amplify,
    COL_A.x + P, RY + P, COL_A.w - 2*P, RDH - 2*P, { sz: 10 });
});

// ── FOOTER ───────────────────────────────────────────────────────────────────

footer(slide, { pageNum: 7 });

// ─── SAVE ─────────────────────────────────────────────────────────────────────

pres.writeFile({ fileName: OUT })
  .then(() => console.log(`Saved → ${OUT}`))
  .catch(err => console.error("Error:", err));
