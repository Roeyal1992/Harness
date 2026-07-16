---
name: deloitte-pptx-node
description: "Create Deloitte-branded PowerPoint presentations (.pptx files) using Node.js and pptxgenjs. Use this skill when the task requires producing a Deloitte-branded PPTX artifact AND Python is unavailable. Prefer the deloitte-pptx (Python) skill when Python is installed — it supports the official Deloitte template with 57 layouts. Use this skill on managed machines where Python is blocked (e.g. Deloitte corporate environments) or when Node.js is the confirmed runtime."
---

# Deloitte PPTX Node Skill

Create professional Deloitte-branded presentations using Node.js + pptxgenjs. Slides are built from scratch at 13.33" × 7.50" (16:9). No Office template is loaded — all layout is freeform.

## When to Use This Skill vs the Python Skill

| Condition | Use |
|---|---|
| Python available | **deloitte-pptx** (Python) — supports official template, 57 layouts, charts |
| Python blocked / unavailable | **deloitte-pptx-node** (this skill) |
| Node.js confirmed installed | **deloitte-pptx-node** |
| Need pptxgenjs chart API | **deloitte-pptx-node** |

## Quick Start

```bash
# One-time setup in the project directory
npm install pptxgenjs

# For the validator (optional)
npm install adm-zip
```

```js
const { newPres, rect, txt, footer, zoneHeader } = require('./lib/helpers');
const { C, LAYOUT } = require('./lib/constants');

const pres  = newPres();            // 13.33" × 7.50", RTL
const slide = pres.addSlide();

// Add shapes
rect(slide, 0.5, 0.5, 3.0, 0.5, C.teal);
txt(slide, "כותרת", 0.5, 0.5, 3.0, 0.5, { sz: 14, bold: true, col: C.white });
footer(slide, { pageNum: 1 });

pres.writeFile({ fileName: "output.pptx" })
    .then(() => console.log("Done"));
```

## Library Reference

### `lib/constants.js`

```js
const { C, HEADERS, CHARTS, LAYOUT, FONT, SZ } = require('./lib/constants');
```

**`C`** — Brand palette (hex strings, no `#`):
- `C.teal`, `C.deepGreen`, `C.deloitteGreen`, `C.midGreen`
- `C.darkGray`, `C.gray11`, `C.gray7`, `C.ltGray`, `C.white`
- Functional (RAG only): `C.red`, `C.orange`, `C.yellow`

**`LAYOUT`** — Slide dimensions:
- `LAYOUT.slideW/H` — 13.33 / 7.50"
- `LAYOUT.margin` — 0.50" (left/right)
- `LAYOUT.contentX/W` — 0.50" / 12.33"
- `LAYOUT.contentY/H` — 1.84" / 5.12" (below header)
- `LAYOUT.footerY` — 6.54"
- `LAYOUT.sourceCutoff` — 6.40" (nothing non-footnote below this)

**`HEADERS`** — Card header color sequences:
- `HEADERS.two` — [deloitteGreen, teal]
- `HEADERS.three` — [deloitteGreen, teal, blue5]

**`SZ`** — Font size floors:
- `SZ.body.min` = 10pt (HARD FLOOR — never go below)
- `SZ.source.min` = 7pt

### `lib/helpers.js`

#### `newPres()`
Returns a new `PptxGenJS` instance pre-configured for 16:9 RTL.

#### `rect(slide, x, y, w, h, fill, [line], [lw])`
Add a filled rectangle. `fill` and `line` are hex strings. Omit `line` for no border.

#### `txt(slide, text, x, y, w, h, [opts])`
Add a text box. RTL is on by default.

| Option | Default | Notes |
|---|---|---|
| `sz` | 11 | Font size in pt. 10pt HARD FLOOR. |
| `bold` | false | |
| `italic` | false | |
| `col` | `C.darkGray` | Text color hex |
| `align` | `"right"` | RTL default |
| `rtl` | true | Paragraph RTL direction |
| `valign` | `"top"` | |

#### `footer(slide, { left, copyright, pageNum })`
Renders the standard three-part footer with separator rule.
- `left` — default `"ניתוח דלויט"`
- `copyright` — default 2026 Deloitte string
- `pageNum` — slide number

#### `zoneHeader(slide, { badgeLabel, badgeColor, badgeTextCol, title, subtitle, ruleColor })`
Renders the Type F slide header: badge pill + title + rule + subtitle.
Physical layout: badge on left (RTL reading-start), title on right.

## Content Rules (same as Python skill)

- **Never fabricate facts.** Use `[placeholder]` when data is missing.
- **Source footnotes required** on every slide with quantitative claims (7pt, gray).
- **No 3+ consecutive slides** with the same layout structure.
- **Body text 10pt minimum — HARD FLOOR.** Never below 10pt for body content.
- **Source citations 7pt minimum.**

## Brand Essentials

- **Colors:** Greens (primary), teals, blues (supporting). See `C` in constants.js.
- **Card headers:** Use `HEADERS.two/three/four` — never pick freely to avoid off-palette choices.
- **Functional colors** (red/orange/yellow): RAG status only. Never card headers or decoration.
- **Font:** Arial (safe fallback for RTL Hebrew). Replace with Rubik or Noto Sans Hebrew if confirmed installed on the target machine.
- **Card bodies:** White fill + light gray border on white slides. Never pale green by default.

## Font Note

This skill uses **Arial**, not Aptos. The Python skill loads the official Deloitte template which embeds Aptos. Since this skill builds from scratch, Aptos may not render correctly on machines that do not have Office installed with Aptos present. Arial is the safe RTL fallback.

If the output will only be opened on machines with Office 365 + Aptos installed, replace `FONT = "Arial"` with `FONT = "Aptos"` in `lib/constants.js`.

## RTL Layout — Physical vs Visual

pptxgenjs positions elements by physical (screen) coordinates, not reading direction.
In RTL Hebrew slides:

| Visual direction | Physical position |
|---|---|
| Reading-start (right) | x closer to `LAYOUT.slideW` (physical right) |
| Reading-end (left) | x closer to 0 (physical left) |

For 3-column RTL needs tables:
```
Physical layout:        [amplify LEFT]  [noviolate CENTRE]  [needs RIGHT]
Visual reading order:   [needs RIGHT]   [noviolate CENTRE]  [amplify LEFT]
```

Always define column positions explicitly by physical x. Never rely on pptxgenjs RTL auto-layout for multi-column tables.

## What This Skill Does Not Support

| Feature | Status | Alternative |
|---|---|---|
| Official Deloitte template (57 layouts) | Not available | Use Python skill |
| Aptos font embed | Not available | Arial fallback; or use Python skill |
| python-pptx chart API | N/A | pptxgenjs has its own chart API (see pptxgenjs docs) |
| Template placeholder fills | N/A | Build all elements with rect() + txt() |

## QA — Validator

```bash
node scripts/validate_pptx.js output.pptx
node scripts/validate_pptx.js output.pptx --strict   # font issues become errors
node scripts/validate_pptx.js output.pptx --json     # machine-readable output
```

Checks: boilerplate text, font sizes below floor, out-of-bounds shapes, slide count.
Exit code 0 = PASS, 1 = FAIL.

## QA Checklist

Before delivering:
- [ ] `validate_pptx.js` reports 0 errors
- [ ] No font size below 10pt for body text
- [ ] No font size below 7pt for source citations
- [ ] Footer on every slide (pageNum, copyright, left label)
- [ ] Brand colors only — no off-palette fills
- [ ] Functional colors (red/orange/yellow) only for RAG status
- [ ] No content below y=6.40" (source cutoff)
- [ ] RTL column order verified visually — physical left ≠ reading-start

## Examples

- `examples/build_slide07.js` — Type F Amplifier Stage slide (היחשפות) with story box and needs table

## Dependencies

```bash
npm install pptxgenjs      # required
npm install adm-zip        # required for validator only
```

## Relation to Python Skill

This skill and `skills/deloitte-pptx/` share the same brand rules, color palette, layout dimensions, and content standards. They diverge at the implementation layer:

| Layer | Python skill | Node skill |
|---|---|---|
| Runtime | python-pptx | pptxgenjs |
| Template | `assets/template.pptx` (57 layouts) | None — freeform only |
| Font | Aptos (via template) | Arial (fallback) |
| Charts | python-pptx chart API | pptxgenjs chart API |
| Async | Synchronous | Promise-based |

The Node skill is the fallback for managed corporate environments. When Python is available, the Python skill should be preferred for template-based decks.
