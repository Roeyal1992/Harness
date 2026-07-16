---
name: deloitte-pptx
description: "Create or edit Deloitte-branded PowerPoint presentations (.pptx files) using the official 16:9 onscreen template. Use this skill when the task requires producing or modifying a Deloitte-branded PowerPoint artifact — strategy decks, client pitches, status reports, org charts, or any consulting deliverable. Triggers on explicit requests to create a deck, slides, or .pptx file in a Deloitte context. Do NOT trigger for presentation coaching, outline brainstorming, or slide design advice without file generation. For brand voice and messaging guidelines, also read the deloitte-brand skill."
---

# Deloitte PPTX Skill

Create professional Deloitte-branded presentations using the official 16:9 onscreen template (13.33" × 7.50") with python-pptx.

## Before You Start

1. **Read `references/creation-workflow.md`** for storyline planning, slide blueprints, title rules, visual selection, and accuracy guidelines
2. **Optionally read the deloitte-brand skill** for full voice, messaging, and visual identity guidelines
3. **Read `references/layouts.md`** for the full layout catalog with placeholder mappings
4. **Read `references/charts-and-graphics.md`** for chart, table, and graphic slide patterns
5. **Read `references/advanced-graphics.md`** for complex infographic patterns
6. **Read `references/pmo-patterns.md`** for SteerCo, RAID tables, scorecards, and pipeline trackers
7. **Read `references/consulting-patterns.md`** for hero statements, maturity models, comparison matrices, and duration lists
8. Template files:
   - `assets/template.pptx` — Official 16:9 onscreen template with 57 layouts across 4 color themes
   - `assets/advanced-graphics-library.pptx` — ~350 advanced graphic slide designs for visual reference

### Content Rules (always apply)

- **Never fabricate facts.** Use `[placeholder]` when data is missing. Never invent metrics, dates, or sources.
- **Source footnotes required** on every slide with quantitative claims (7–8pt, gray)
- **No 3+ consecutive slides** with the same layout structure

**Audience-dependent rules** (flex based on deck type):

| Rule | Executive briefing | Client pitch / marketing | Training / enablement |
|---|---|---|---|
| Title style | **Assertive conclusions required** | Descriptive or provocative OK | Instructional OK |
| Bullet density | Max 5 per slide | Max 5, but multi-section layouts OK | More detail acceptable |
| Visual complexity | Clean, minimal | **Rich compositions encouraged** | Progressive builds |
| Layout freedom | Template layouts preferred | **Freeform custom compositions welcome** | Structured templates |

### Brand Essentials (self-contained — brand skill is optional)

- **Tone:** Confident, direct, human. Write like a senior partner speaking to a peer.
- **Visual ambition:** Don't default to the safest layout. Build rich, custom compositions when the content warrants it — asymmetric layouts, decorative motifs, mixed typography, dark themes. The best Deloitte decks feel designed, not generated.
- **Photos** on title/divider slides. **Diagrams** for qualitative logic. **Charts** only for quantitative data.
- **Colors:** Greens (primary), teals, blues (supporting). Red/orange/yellow only for RAG status. **Never use off-palette colors** (pink, red tints, etc.) in matrix cells or card backgrounds — use on-palette severity gradients (see `consulting-patterns.md`).
- **Font:** Aptos throughout. **Body text 10pt minimum — HARD FLOOR, no exceptions.** Source citations 7pt minimum. If content doesn't fit at 10pt, split across slides rather than shrinking below 10pt. The 9pt and 9.5pt font sizes that python-pptx allows are NEVER acceptable for body text.
- **Dark themes:** Black (layout 48–56) and dark green backgrounds create premium, high-impact slides. Use them for title slides, hero statements, and pitch decks — not just dividers.

## Quick Start

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import copy

prs = Presentation("path/to/skill/assets/template.pptx")

# CRITICAL: Delete all existing slides first
while len(prs.slides) > 0:
    rId = prs.slides._sldIdLst[0].rId
    prs.part.drop_rel(rId)
    del prs.slides._sldIdLst[0]

# Add slides from layouts
slide = prs.slides.add_slide(prs.slide_layouts[0])  # Title slide
```

## Card and Shape Fill Rules (CRITICAL — read before building any cards)

**Default: cards MUST match the slide background with an outline, NOT use a colored fill.** The most common visual defect in generated decks is every card, tile, and box having a pale green fill — this makes the deck look auto-generated instead of designed.

⚠️ **Use `make_card()` for ALL rectangular content containers:** card bodies, KPI tiles, timeline phase cards, comparison cells, quote blocks, bullet containers. This is not optional — it prevents the green-fill default.

```python
def make_card(slide, x, y, w, h, dark=False):
    """Create a card shape with correct background-matching defaults.
    
    ALWAYS use this instead of add_shape/add_rounded_rect + manual fill.
    Applies to: card bodies, KPI tiles, timeline cards, bullet containers.
    dark=False: white fill + gray outline (for white/light slides)
    dark=True: dark gray fill, no border (for black slides)
    """
    card = slide.shapes.add_shape(5, Inches(x), Inches(y), Inches(w), Inches(h))
    card.fill.solid()
    if dark:
        card.fill.fore_color.rgb = RGBColor(0x2D, 0x2D, 0x2D)
        card.line.fill.background()
    else:
        card.fill.fore_color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        card.line.color.rgb = RGBColor(0xD0, 0xD0, 0xD0)
        card.line.width = Pt(0.75)
    return card

# KPI tile example — accent bar on top, WHITE tile body
add_rect(slide, x, y, tile_w, 0.06, DELOITTE_GREEN)     # colored accent bar
make_card(slide, x, y + 0.06, tile_w, tile_h - 0.06)    # white tile with outline
add_textbox(slide, x + 0.2, y + 0.15, tile_w - 0.4, 0.5, "33%", ...)  # big number

# Timeline phase card — same pattern
make_card(slide, x, card_y, phase_w, card_h)  # white with outline
```

### White background slides (layouts 23–31)

| Element | Fill | Border | When to use colored fill |
|---|---|---|---|
| Card body | **White** `FFFFFF` | Light gray `D0D0D0`, 0.75pt | Never use colored fill by default |
| KPI tile | **White** `FFFFFF` | Light gray `D0D0D0`, 0.75pt | Use brand accent bar on TOP of tile instead |
| Comparison cell | **White** `FFFFFF` | Light gray `E0E0E0`, 0.5pt | Only for severity/RAG matrices |
| Header bar | Brand color (solid fill) | None | Always — headers ARE filled |
| Takeaway bar | Deep green (solid fill) | None | Always — callout bars ARE filled |

### Dark background slides (layouts 48–56, freeform dark)

| Element | Fill | Border | Notes |
|---|---|---|---|
| Card body | **Dark gray** `2D2D2D` | None or subtle `404040` | Match the slide tone |
| Contrast box | **Darker gray** `1A1A1A` | None | For secondary info inside cards |

### When colored fills ARE appropriate

- **Header bars** on top of cards (Deloitte Green, teal, blue — these differentiate the card)
- **Accent color bars** (thin 0.04–0.06" rectangles above or left of a card)
- **Takeaway/callout bars** at the bottom of the slide (deep green background)
- **Status/RAG indicators** (red, yellow, green severity cells in RAID tables)
- **KPI big-number backgrounds** — use a thin accent bar on top of a white tile, not a filled tile

**Never use pale green (`F1F6E4`) as the default card body.** Only use it as an intentional design choice when you specifically want a tinted background for visual grouping.

```python
# GOOD: White card with outline on a white slide
card = slide.shapes.add_shape(5, Inches(x), Inches(y), Inches(w), Inches(h))
card.fill.solid()
card.fill.fore_color.rgb = RGBColor(0xFF, 0xFF, 0xFF)  # matches white slide bg
card.line.color.rgb = RGBColor(0xD0, 0xD0, 0xD0)
card.line.width = Pt(0.75)

# GOOD: Dark card on a dark slide
card = slide.shapes.add_shape(5, Inches(x), Inches(y), Inches(w), Inches(h))
card.fill.solid()
card.fill.fore_color.rgb = RGBColor(0x2D, 0x2D, 0x2D)  # matches dark slide tone
card.line.fill.background()  # no border on dark — borders look cheap

# BAD: Pale green card on a white slide (makes everything look generated)
# card.fill.fore_color.rgb = RGBColor(0xF1, 0xF6, 0xE4)  # ← DON'T DO THIS BY DEFAULT
```

## Slide Initialization: Two Patterns (choose ONE per slide)

Every slide falls into one of two categories. Using the wrong pattern is the most common source of missing titles and text overlap.

### Pattern A: Content Slides (MOST slides) — fill the title placeholder

Use when the slide has a title + structured content below it. This is the default for 90% of slides.

```python
# Pattern A: Content slide — fill_title, then add content
slide = prs.slides.add_slide(prs.slide_layouts[23])  # White Title Only
fill_title(slide, "Your assertive title goes here")
# Content starts at y=1.50" (below title area)
```

**⚠️ EVERY content slide MUST call `fill_title()`.** If the title is empty, the slide looks broken. If you're adding shapes below a title, you are building a content slide — use Pattern A.

### Pattern B: Freeform Slides (hero statements, full-bleed photos) — clear placeholders

Use ONLY when you are building a fully custom composition with NO template title — e.g., hero statements, full-bleed photo slides, or dark marketing layouts where you add your own title textbox.

```python
# Pattern B: Freeform — clear placeholders, then build everything custom
slide = prs.slides.add_slide(prs.slide_layouts[48])  # Black Title Only
clear_unused_placeholders(slide)  # ← removes ALL placeholders including title
# You MUST add your own title textbox manually
add_textbox(slide, 0.50, 0.40, 12.33, 0.50, "Custom Title", size=22, bold=True, color=WHITE)
```

**⚠️ NEVER call `clear_unused_placeholders()` on a content slide that should have a title.** This is the #1 cause of missing titles in generated decks.

### Decision rule

| Slide type | Pattern | Title method |
|---|---|---|
| Numbered cards below a title | **A** | `fill_title()` |
| Comparison table below a title | **A** | `fill_title()` |
| Timeline/roadmap below a title | **A** | `fill_title()` |
| Any slide with `fill_title()` | **A** | Placeholder |
| Hero statement with photo overlay | **B** | Custom textbox |
| Dark marketing/pitch hero | **B** | Custom textbox |
| Full-bleed photo divider | **B** | Custom textbox |

```python
def clear_unused_placeholders(slide, keep_idx=None):
    """Remove unused placeholders from a slide to prevent overlap.
    ⚠️ ONLY for Pattern B (freeform) slides. Never on content slides.
    """
    if keep_idx is None: keep_idx = set()
    from pptx.oxml.ns import qn
    spTree = slide.shapes._spTree
    for ph in list(slide.placeholders):
        if ph.placeholder_format.idx not in keep_idx:
            spTree.remove(ph._element)
```

## Mandatory Post-Generation Cleanup (run BEFORE saving)

**CRITICAL: The Deloitte template contains master-inherited boilerplate text in footer zones on every content slide.** These are NOT removed by simply filling placeholders — they persist from the slide master. You MUST strip them programmatically after building the deck, before saving.

```python
import re

BOILERPLATE_PATTERNS = [
    r'(?i)member\s*firms.*DTTL',
    r'(?i)insert\s+appropriate\s+copyright',
    r'(?i)\[to\s+edit.*slide\s+master\]',
    r'(?i)presentation\s+title',
    r'(?i)click\s+view.*slide\s+master',
]

def strip_template_boilerplate(prs, deck_title="", copyright_text=""):
    """Remove all master-inherited boilerplate from every slide.
    
    Call this AFTER all slides are built, BEFORE prs.save().
    Replaces 'Presentation title' footers with deck_title if provided.
    Replaces copyright placeholders with copyright_text if provided.
    """
    for slide in prs.slides:
        for shape in slide.shapes:
            if not shape.has_text_frame:
                continue
            # Only check shapes in the footer zone (y > 6.0")
            if shape.top and shape.top / 914400 < 6.0:
                continue
            full_text = shape.text_frame.text.strip()
            if not full_text:
                continue
            for pattern in BOILERPLATE_PATTERNS:
                if re.search(pattern, full_text):
                    # Replace with appropriate content or clear
                    if 'presentation title' in full_text.lower() and deck_title:
                        for para in shape.text_frame.paragraphs:
                            for run in para.runs:
                                if re.search(r'(?i)presentation\s+title', run.text):
                                    run.text = deck_title
                    elif 'insert appropriate copyright' in full_text.lower() and copyright_text:
                        for para in shape.text_frame.paragraphs:
                            for run in para.runs:
                                if re.search(r'(?i)insert\s+appropriate\s+copyright', run.text):
                                    run.text = copyright_text
                    else:
                        # Clear the text entirely
                        for para in shape.text_frame.paragraphs:
                            for run in para.runs:
                                for bp in BOILERPLATE_PATTERNS:
                                    if re.search(bp, run.text):
                                        run.text = ""
                    break

# Usage — call this right before prs.save():
strip_template_boilerplate(
    prs,
    deck_title="Your Deck Title",
    copyright_text="Copyright © 2026 Deloitte Development LLC. All rights reserved."
)
prs.save("output.pptx")
```

**This is NOT optional.** Every deck generated from this template will have leftover boilerplate on content slides if this step is skipped. The QA validator will catch it, but prevention is better than remediation.

## Template Architecture

### Slide Dimensions
- **Width**: 13.33" (12192000 EMU)
- **Height**: 7.50" (6858000 EMU)
- **Content margins**: 0.50" left/right
- **Content area starts**: y=1.84" (below title/subtitle header)
- **Content area height**: 5.12"

### Color Themes

The template provides identical layout structures across 4 background themes:

| Theme | Title Slides | Dividers | Content Slides | End Slide |
|-------|-------------|----------|---------------|-----------|
| **White** | 0-5 | — | 23-30 | 31 |
| **Light Gray** | — | — | 32-39 | — |
| **Pale Green** | 2-5 | 15, 17 | 40-47 | — |
| **Black** | 6-11 | 19, 21 | 48-56 | 56 |
| **Dark Green** | 8-9 | 18 | — | — |
| **Gradient** | 4-5, 10-11 | 17, 19 | — | — |
| **Special** | 12 (full-bleed) | 13-14 (glow/united), 22 (image) | — | — |

### Layout Categories

| Category | White | Light Gray | Pale Green | Black |
|----------|-------|------------|------------|-------|
| Title only | 23 | 32 | 40 | 48 |
| Title + subtitle | 24 | 33 | 41 | 49 |
| Title + subtitle + 1 col | 25 | 34 | 42 | 50 |
| Title + subtitle + 2 col | 26 | 35 | 43 | 51 |
| Title + subtitle + 3 col | 27 | 36 | 44 | 52 |
| Title + subtitle + 4 col | 28 | 37 | 45 | 53 |
| Team profile (2×2) | 29 | 38 | 46 | 54 |
| Qualifications (2×1) | 30 | 39 | 47 | 55 |

## Core Patterns

### Filling Title Slides (Layouts 0-12)

**IMPORTANT: Title slide picture placeholders.** Most title layouts (0-12) include a large circular picture placeholder at `idx=11`. If you do not have a specific image to fill it, you MUST either:
1. **Fill it with a default photo** from `assets/photos/` (the green motif sphere `GettyImages-1456548142.jpg` works universally), OR
2. **Use a layout without a picture placeholder** (e.g., layout 6 for black, layout 2 for pale green without the motif area)

**NEVER leave a picture placeholder empty** — it creates a large blank void that makes the slide look unfinished.

```python
import os

slide = prs.slides.add_slide(prs.slide_layouts[0])  # White with tagline lockup
PHOTOS = 'path/to/skill/assets/photos'

for shape in slide.shapes:
    if hasattr(shape, 'placeholder_format'):
        idx = shape.placeholder_format.idx
        if idx == 0:   # Title (CENTER_TITLE)
            shape.text = "Your Headline Here"
        elif idx == 10: # Subtitle
            shape.text = "Subtitle, date or author"
        elif idx == 11: # Picture placeholder (circular motif area)
            # ALWAYS fill — use a default photo if no specific image
            shape.insert_picture(os.path.join(PHOTOS, 'GettyImages-1456548142.jpg'))
```

**Title slide placeholders:**
- `idx=0` → Title at y=5.67" (bottom-left, 4.91" wide)
- `idx=10` → Subtitle at y=6.96"
- `idx=11` → Picture/motif area at x=6.52", y=0.76" (6.06" circle)

### Filling Content Slides (Layouts 23-55)

**White content slides use this header pattern:**
- `idx=0` (TITLE) → Page title at y=0.38", h=0.37"
- `idx=13` (BODY) → Subtitle at y=0.75", h=0.83"

**Light Gray and Pale Green use a different header pattern:**
- `idx=15` (BODY) → Page subtitle label at y=0.38", h=0.29"
- `idx=27` (BODY) → Page title at y=0.67", h=0.44"

**Black content slides:**
- `idx=0` (TITLE) → Page title at y=0.38"
- `idx=13` (BODY) → Subtitle at y=0.75"

```python
# Example: White 1-column content slide (layout 25)
slide = prs.slides.add_slide(prs.slide_layouts[25])
for shape in slide.shapes:
    if hasattr(shape, 'placeholder_format'):
        idx = shape.placeholder_format.idx
        ptype = shape.placeholder_format.type
        if ptype == 1:  # TITLE
            shape.text = "Executive Summary"
        elif idx == 13:  # Subtitle
            shape.text = "Q3 2025 Performance Review"
        elif idx == 1:   # Content body (OBJECT type)
            tf = shape.text_frame
            tf.paragraphs[0].text = "Key Findings"
            tf.paragraphs[0].level = 0
            items = [
                ("Revenue grew 40% year-over-year", 1),
                ("Client satisfaction at 94%", 1),
                ("Three new market expansions completed", 1),
            ]
            for text, level in items:
                p = tf.add_paragraph()
                p.text = text
                p.level = level
```

### Content Area for Custom Elements

When adding charts, tables, or custom shapes (not using placeholder text), place them within:

```
Content safe zone:
  x: 0.50"  (left margin)
  y: 1.84"  (below header)
  w: 12.33" (full width minus margins)
  h: 5.12"  (to bottom safe area)
```

**Vertical space budget:** No content element should extend below **y=6.4"** on the slide. The zone from 6.4"–6.96" is reserved for source citations, and 6.96"–7.5" for template footers. If your content pushes past this boundary, reduce font sizes, remove an item, or split across two slides. Common offenders: horizontal bar charts with many categories, tall tables, and multi-row card layouts.

### Dynamic Card Height Sizing (REQUIRED for card/box layouts)

**NEVER use static heights for card rectangles.** This is the single most common visual defect in generated decks. Cards with fixed heights and short text create large empty colored blocks that look unfinished and unprofessional.

**THE ANTI-PATTERN (what goes wrong):**
A slide has 3 cards, each with 4 bullet points (~4 lines of text). The code sets all cards to height=3.5". The text fills 1.2" of the 3.5" card, leaving 2.3" of empty space below each bullet list. This wastes 65% of the card area, pushes subsequent content (timelines, takeaway boxes) into a cramped zone at the bottom of the slide, and looks like the card was designed for different content.

**THE FIX:** Always calculate card height from the actual text content, then use the maximum across the row for uniform alignment.

```python
def estimate_card_height(text, box_width_in, font_size_pt=10, 
                         title_lines=1, top_pad=0.15, bot_pad=0.25):
    """Estimate the required card height for a text block.
    
    Args:
        text: The body text content for the card
        box_width_in: Width of the text area in inches
        font_size_pt: Font size in points (default 10pt — the minimum)
        title_lines: Number of lines reserved for the card title
        top_pad: Padding above title in inches
        bot_pad: Padding below text in inches
    
    Returns:
        Estimated height in inches (clamped to min 1.2", max 4.5")
    """
    # Aptos average chars-per-inch at given font size
    cpi = {8: 14.5, 9: 13.0, 10: 12.0, 11: 11.0, 12: 10.0, 14: 8.5}
    chars_per_in = cpi.get(font_size_pt, 12.0)
    chars_per_line = int(box_width_in * chars_per_in)
    
    # Estimate wrapped line count
    words = text.split()
    lines = 1
    current_len = 0
    for word in words:
        if current_len + len(word) + 1 > chars_per_line:
            lines += 1
            current_len = len(word)
        else:
            current_len += len(word) + 1
    
    # Line height in inches (roughly 1.2x font size)
    line_height = (font_size_pt / 72) * 1.35
    title_height = title_lines * (14 / 72) * 1.35  # titles at ~14pt
    
    total = top_pad + title_height + 0.10 + (lines * line_height) + bot_pad
    return max(1.2, min(total, 4.5))


def make_card_column(slide, x, y, width, title, body, header_color,
                     body_bg_color=None, font_size=10):
    """Create a card with dynamically-sized height.
    
    Creates a header rectangle + body rectangle sized to content.
    Returns the bottom y-position for alignment reference.
    """
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
    
    header_h = Inches(0.50)
    text_width = width - Inches(0.20)  # padding
    body_h_in = estimate_card_height(body, text_width / 914400, font_size)
    body_h = Inches(body_h_in)
    
    # Header rectangle
    hdr = slide.shapes.add_shape(1, x, y, width, header_h)  # MSO_SHAPE.RECTANGLE
    hdr.fill.solid()
    hdr.fill.fore_color.rgb = header_color
    hdr.line.fill.background()
    htf = hdr.text_frame
    htf.paragraphs[0].text = title
    for run in htf.paragraphs[0].runs:
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        run.font.size = Pt(11)
        run.font.bold = True
    
    # Body rectangle — default to slide-background-matching with outline, NOT colored fill
    body_rect = slide.shapes.add_shape(
        1, x, y + header_h, width, body_h
    )
    if body_bg_color:
        body_rect.fill.solid()
        body_rect.fill.fore_color.rgb = body_bg_color
        body_rect.line.fill.background()
    else:
        # Default: white fill with light gray outline (matches white slide backgrounds)
        body_rect.fill.solid()
        body_rect.fill.fore_color.rgb = RGBColor(0xFF, 0xFF, 0xFF)  # white — same as slide bg
        body_rect.line.color.rgb = RGBColor(0xD0, 0xD0, 0xD0)  # light gray outline
        body_rect.line.width = Pt(0.75)
    
    # Body text box (inside the rectangle)
    tx = slide.shapes.add_textbox(
        x + Inches(0.10), y + header_h + Inches(0.10),
        text_width, body_h - Inches(0.15)
    )
    tf = tx.text_frame
    tf.word_wrap = True
    tf.paragraphs[0].text = body
    for run in tf.paragraphs[0].runs:
        run.font.size = Pt(font_size)
        run.font.name = 'Aptos'
    
    return y + header_h + body_h  # return bottom position
```

**When building multi-card layouts (numbered cards, comparison panels, region cards):**
1. Calculate heights for ALL cards first using `estimate_card_height()`
2. Use the **maximum** height across the row so cards align evenly
3. If the max height exceeds available space, reduce bullet count or split across slides
4. **VERIFY:** If `max(heights) < 0.5 * static_height_you_were_going_to_use`, you were about to create the anti-pattern. Use the fitted height.

```python
# Example: uniform card heights across 3 columns
texts = [text_1, text_2, text_3]
heights = [estimate_card_height(t, 3.5, font_size=10) for t in texts]
uniform_h = max(heights)  # all cards same height, but FITTED to content
```

### Multi-Section Slides (Cards + Timeline, Cards + Takeaway)

When a slide has **two vertical sections** (e.g., cards on top, timeline on bottom), you MUST budget the vertical space explicitly. Do NOT let the top section consume all available space and then squeeze the bottom section.

**Space budget for a two-section slide:**

```
Total content area: y=1.84" to y=6.30" = 4.46" available

Approach 1: Cards (60%) + Timeline (40%)
  Cards:    y=1.84", max height = 2.50"
  Gap:      0.20"
  Timeline: y=4.54", height = 1.76"

Approach 2: Cards (50%) + Timeline (50%)
  Cards:    y=1.84", max height = 2.00"
  Gap:      0.25"
  Timeline: y=4.09", height = 2.21"
```

**Steps:**
1. Decide your section split BEFORE building either section
2. Calculate card heights — if they exceed the budget, reduce content or font
3. Build cards within the budgeted height
4. Build the secondary section starting at `cards_bottom + gap`
5. Place source line relative to the bottom of the LAST section, not at a fixed y

For split layouts:
```
Left half:   x=0.50", w=6.00"
Right half:  x=6.84", w=6.01"
Gap between: 0.34"

Three columns: w=3.88" each, x=0.50", 4.73", 8.95"
Four columns:  w=2.94" each, x=0.50", 3.63", 6.76", 9.90"
```

### Single-Column Quote and Callout Blocks

Full-width quote blocks, callout boxes, and pull-quote rectangles follow the same dynamic sizing rules as multi-column cards. A full-width gray or dark rectangle behind 3 lines of text should NOT be 2.9" tall — it should be ~0.8–1.0".

**Apply `estimate_card_height()` to single-column blocks too:**

```python
# BAD: static height for a quote block
quote_rect = slide.shapes.add_shape(1, Inches(0.50), y, Inches(12.33), Inches(2.9))

# GOOD: dynamic height based on content
quote_text = "The printing press changed what we could share..."
quote_h = estimate_card_height(quote_text, 11.5, font_size_pt=14)
quote_rect = slide.shapes.add_shape(1, Inches(0.50), y, Inches(12.33), Inches(quote_h))
```

This applies to any full-width background rectangle that wraps a text box: quote blocks, takeaway bars, callout panels, and highlight strips.

### Header Color Semantic Rules

When using two-column comparison layouts (e.g., "AI Handles" vs "You Own", "Before" vs "After"), choose header colors deliberately:

**Rules:**
- **Both headers should use brand-palette colors** from the green/teal/blue families by default
- **Gray headers** imply the content is secondary, disabled, or de-emphasized. Only use gray if you intentionally want to create a visual hierarchy where one column is subordinate.
- For **neutral comparisons** (no hierarchy intended), use two distinct brand colors at similar visual weight — e.g., Deloitte Green + Accessible Teal, or Deep Green + Blue
- For **intentional hierarchy** (one side matters more), use a bold brand color for the primary column and a lighter shade (light gray, pale green) for the secondary. But be explicit that this is a design choice.

```python
# Neutral comparison — equal weight
left_header_color = DELOITTE_GREEN      # Both are strong brand colors
right_header_color = ACCESSIBLE_TEAL

# Intentional hierarchy — "You Own" is emphasized
left_header_color = RGBColor(0x75, 0x78, 0x7B)   # Gray = secondary
right_header_color = DELOITTE_GREEN               # Green = primary
# ↑ Only if the design intent is to de-emphasize the left column
```

### Divider Slides (Layouts 13-22)

**CRITICAL: Section divider consistency rule.** When a deck has multiple section dividers, use the SAME layout for ALL of them. Pick one approach and commit:

| Approach | Recommended Layout | Text Color |
|----------|-------------------|------------|
| **Dark background** (preferred) | 21 (Black) or 19 (Dark gradient) | White |
| **Pale Green** (secondary) | 15 (Pale Green) | Dark green |
| **Deloitte Green** (limited use) | 16 (Deloitte Green) | White |

**Divider hierarchy by content type:**
- **Executive briefings, strategy decks, serious/sensitive topics** → Use **black (layout 21)** or **dark gradient (layout 19)**. These convey authority and gravitas.
- **General consulting deliverables, status reports** → Use **pale green (layout 15)** for a lighter, approachable feel.
- **Brand moments, external marketing, celebratory content** → **Deloitte Green (layout 16)** is appropriate here but use sparingly. The bright lime-green is visually aggressive and dominates the slide — it should NOT be the default for internal or executive content.

**AVOID using Deloitte Green (layout 16) for executive briefings or sensitive topics.** The bright green reads as loud and promotional, which clashes with serious analytical content. When in doubt, default to black.

**NEVER mix photo-backed dividers with solid-color dividers in the same deck.** Inconsistent divider designs look unpolished and break visual rhythm.

**NEVER place raw text directly on a busy image.** If you use layout 22 (full-bleed image divider), you MUST add a semi-transparent dark overlay behind the text area to guarantee readability:

```python
# CORRECT: Divider with consistent solid background
slide = prs.slides.add_slide(prs.slide_layouts[21])  # Black divider
for shape in slide.shapes:
    try:
        pf = shape.placeholder_format
        if pf and pf.type == 1:
            shape.text = "Section Title"
    except (ValueError, AttributeError):
        continue

# CORRECT: If you MUST use an image divider (layout 22), add overlay
slide = prs.slides.add_slide(prs.slide_layouts[22])
# ... fill picture placeholder ...
# Add dark overlay for text readability
overlay = slide.shapes.add_shape(
    MSO_SHAPE.RECTANGLE,
    Inches(0), Inches(0), Inches(13.33), Inches(7.50)
)
overlay.fill.solid()
overlay.fill.fore_color.rgb = RGBColor(0x00, 0x00, 0x00)
from pptx.oxml.ns import qn
solidFill = overlay.fill._fill
srgbClr = solidFill.find(qn('a:srgbClr'))
if srgbClr is not None:
    alpha = srgbClr.makeelement(qn('a:alpha'), {})
    alpha.set('val', '40000')  # 60% opaque
    srgbClr.append(alpha)
overlay.line.fill.background()
# THEN fill title placeholder (renders on top of overlay)
```

### End Slides (Layouts 31, 56)

**MANDATORY: The end slide MUST include a copyright line.** The text placeholder (`idx=13`) should contain the copyright notice. Do not leave it with just the deck title or empty.

```python
slide = prs.slides.add_slide(prs.slide_layouts[31])  # White end slide
for shape in slide.shapes:
    if hasattr(shape, 'placeholder_format'):
        if shape.placeholder_format.idx == 13:
            # Set copyright — REQUIRED, never omit
            shape.text = "Copyright © 2026 Deloitte Development LLC. All rights reserved."
```

If you also want the deck title on the end slide, place it ABOVE the copyright in the same text frame or use a separate text box:

```python
# Option: Title + copyright in same placeholder
tf = shape.text_frame
tf.paragraphs[0].text = "Your Deck Title"
p = tf.add_paragraph()
p.text = "Copyright © 2026 Deloitte Development LLC. All rights reserved."
for run in p.runs:
    run.font.size = Pt(8)
    run.font.color.rgb = RGBColor(0x75, 0x78, 0x7B)
```

## Adding Charts (python-pptx native charts)

Use python-pptx's chart capabilities within the content safe zone. See `references/charts-and-graphics.md` for detailed patterns.

```python
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE

# Add a bar chart to a content slide
slide = prs.slides.add_slide(prs.slide_layouts[24])  # Title + subtitle
# Fill title/subtitle...

chart_data = CategoryChartData()
chart_data.categories = ['Q1', 'Q2', 'Q3', 'Q4']
chart_data.add_series('Revenue', (4.5, 5.5, 6.2, 7.1))

chart = slide.shapes.add_chart(
    XL_CHART_TYPE.COLUMN_CLUSTERED,
    Inches(0.5), Inches(1.84), Inches(12.33), Inches(5.12),
    chart_data
).chart

# Apply Deloitte brand colors
DELOITTE_GREENS = ['86BC25', '26890D', '046A38', '43B02A', '009A44', 'C4D600']
DELOITTE_TEALS  = ['0D8390', '007680', '0097A9', '00ABAB', '6FC2B4']
DELOITTE_BLUES  = ['005587', '0076A8', '00A3E0', '62B5E5', 'A0DCFF']
```

## Adding Tables

```python
from pptx.util import Inches, Pt

rows, cols = 5, 4
tbl = slide.shapes.add_table(
    rows, cols,
    Inches(0.5), Inches(1.84), Inches(12.33), Inches(4.0)
).table

# Style header row with Deloitte Green
for cell in tbl.rows[0].cells:
    cell.fill.solid()
    cell.fill.fore_color.rgb = RGBColor(0x86, 0xBC, 0x25)
    for paragraph in cell.text_frame.paragraphs:
        for run in paragraph.runs:
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            run.font.bold = True
```

## Brand Color Constants

```python
# Primary
DELOITTE_GREEN = RGBColor(0x86, 0xBC, 0x25)
BLACK = RGBColor(0x00, 0x00, 0x00)

# Secondary
NEON_GREEN = RGBColor(0x86, 0xEB, 0x22)
BLUE = RGBColor(0x00, 0xA3, 0xE0)
DARK_GRAY = RGBColor(0x28, 0x27, 0x28)
LIGHT_GRAY = RGBColor(0xE6, 0xE6, 0xE6)

# Extended Greens
MID_GREEN = RGBColor(0x26, 0x89, 0x0D)
DEEP_GREEN = RGBColor(0x04, 0x6A, 0x38)
DARK_GREEN_BG = RGBColor(0x1C, 0x3D, 0x26)
BRIGHT_GREEN = RGBColor(0x0D, 0xF2, 0x00)
PALE_GREEN = RGBColor(0xF1, 0xF6, 0xE4)  # ⚠️ SLIDE BACKGROUNDS ONLY — never use as card/tile fill

# Extended Teals
ACCESSIBLE_TEAL = RGBColor(0x0D, 0x83, 0x90)
TEAL_6 = RGBColor(0x00, 0x76, 0x80)
TEAL_5 = RGBColor(0x00, 0x97, 0xA9)

# Extended Blues
BLUE_5 = RGBColor(0x00, 0x55, 0x87)
BLUE_4 = RGBColor(0x00, 0x76, 0xA8)

# Chart color sequences (hex strings for chart APIs)
CHART_GREENS = ['86BC25', '26890D', '046A38', '43B02A', '009A44', 'C4D600']
CHART_TEALS = ['0D8390', '007680', '0097A9', '00ABAB', '6FC2B4', '9DD4CF']
CHART_BLUES = ['005587', '0076A8', '00A3E0', '62B5E5', 'A0DCFF']
CHART_MIXED = ['86BC25', '0D8390', '00A3E0', '26890D', '0076A8', 'C4D600']

# Functional colors (limited use)
RED = RGBColor(0xDA, 0x29, 0x10)
ORANGE = RGBColor(0xED, 0x8B, 0x00)
YELLOW = RGBColor(0xFF, 0xCD, 0x00)
```

### Functional Color Rules (CRITICAL)

**Red, orange, and yellow are RESTRICTED to semantic/status uses only.** They must NEVER be used as default card header colors, column backgrounds, or decorative elements.

**Allowed uses for functional colors:**
- RAG status indicators (Red = at risk, Amber/Orange = caution, Green = on track)
- Explicit warnings or alerts
- Heatmap cells where color encodes a specific value
- Traffic-light dashboards

**Forbidden uses for functional colors:**
- Card header backgrounds in multi-column layouts
- Section divider accents
- Chart series colors (use green/teal/blue families instead)
- Decorative bars or borders

**Why this matters:** On sensitive or geopolitical content, colored card headers carry accidental editorial meaning. Red on an "Israel" card or orange on "UAE" implies judgment. On any content, red/orange headers make the deck look like a warning dashboard rather than a professional deliverable.

**Default card header color sequences (use these instead):**

```python
# For 2-column layouts
HEADER_2COL = [DELOITTE_GREEN, ACCESSIBLE_TEAL]

# For 3-column layouts
HEADER_3COL = [DELOITTE_GREEN, ACCESSIBLE_TEAL, BLUE_5]

# For 4-column layouts
HEADER_4COL = [DELOITTE_GREEN, MID_GREEN, ACCESSIBLE_TEAL, BLUE_5]

# For 5+ column layouts (use mixed sequence)
HEADER_MULTI = [DELOITTE_GREEN, MID_GREEN, DEEP_GREEN, ACCESSIBLE_TEAL, BLUE_5, BLUE_4]
```

## Illustrations

The skill includes 14 Deloitte-branded illustrations (PNG) from the GIG Avatars Scenario Library — factories, construction, automation, logistics, sustainability, and more. Read `references/illustrations.md` for the full catalog with keyword tags and placement patterns.

```python
import os
ILLUST_DIR = 'path/to/skill/assets/illustrations'

# Add as full-bleed background (add BEFORE text so it renders behind)
slide.shapes.add_picture(
    os.path.join(ILLUST_DIR, 'industry-08.png'),
    Inches(0), Inches(0), width=Inches(13.33), height=Inches(7.50)
)
# Then add text, charts, shapes on top
```

| Illustration | Best For |
|---|---|
| `industry-02/03` | Factory icons, manufacturing overviews |
| `industry-04/05` | Construction, real estate, infrastructure |
| `industry-06` | Assembly line parts, IoT, Industry 4.0 |
| `industry-07/08` | Warehouse, production line, operations |
| `industry-09/10` | Automation, robotics, digital transformation |
| `industry-11` | Tech professional, workforce, digital |
| `industry-12` | Smart city, sustainability, ESG, renewables |
| `industry-13` | Construction workers, site safety |
| `industry-14` | Logistics, warehousing, supply chain |
| `industry-15` | Agriculture, greenhouse, agtech |

Use 1–3 per deck. See `references/illustrations.md` for placement patterns (full-bleed, right-half, bottom accent, inset).

## Adding Stock Photos

The skill bundles 9 pre-approved photos in `assets/photos/`, tagged by topic. Read `references/photos.md` for the full catalog, tag reference, and placement patterns.

```python
import os
PHOTOS = 'path/to/skill/assets/photos'

# Fill a title slide picture placeholder (layouts 0-12, idx=11)
for shape in slide.shapes:
    try:
        pf = shape.placeholder_format
        if pf and pf.idx == 11:
            shape.insert_picture(os.path.join(PHOTOS, 'GettyImages-1456548142.jpg'))
            break
    except (ValueError, AttributeError):
        continue

# Or add as a positioned image on any slide
slide.shapes.add_picture(
    os.path.join(PHOTOS, 'GettyImages-2216589222.jpg'),
    Inches(6.84), Inches(1.84),     # Right-side placement
    width=Inches(6.01), height=Inches(5.12)
)
```

**Quick topic reference** — pick the right image:

| Topic | Best Image |
|-------|-----------|
| AI / Digital / Innovation | `GettyImages-1148091793.jpg` (teal light beams) |
| Brand / Conceptual | `GettyImages-1456548142.jpg` (green motif sphere) |
| Financial / Markets | `shutterstock_382804891.jpg` (stock data) |
| Technology / Operations | `ind_tmt_glb_ho_2171.jpg` (control room) |
| Telecom / 5G | `HBPTWX.jpg` (5G speedometer) |
| Data / Analytics | `shutterstock_1538502440.jpg` (analysts at screens) |
| Collaboration / People | `GettyImages-2216589222.jpg` (professionals with tablet) |
| Work / Productivity | `Technology_Hero_Image.JPG` (woman at laptop) |
| Infrastructure / Network | `shutterstock_157885577.jpg` (fiber optic cables) |

## Typography

The template uses **Aptos** as the required font for Microsoft Office applications:
- **Aptos** — Regular body text
- **Aptos Bold** — Headers, emphasis
- **Aptos Italic** — Accent emphasis (one word per headline)
- **Aptos Bold Italic** — Strong accent

### Font Size Hierarchy (REQUIRED minimums)

| Element | Size | Notes |
|---------|------|-------|
| Slide title | 20–28pt | Consistent across all content slides |
| Slide subtitle | 14–18pt | Below title, above content |
| Section headers / card titles | 11–14pt | Bold |
| Body text / bullet items | **10–12pt** | **10pt HARD FLOOR. Never use 9pt or 9.5pt.** If text doesn't fit at 10pt, split across slides. Default to 11pt when space allows. |
| Card body text | **10–11pt** | Inside card/box layouts. Same 10pt floor — no exceptions. |
| KPI big numbers | 24–36pt | Bold, in accent color |
| KPI descriptors | 10–11pt | Below the big number |
| Source citations | **7–8pt** | Gray (#757575 or lighter). **NEVER below 7pt.** |
| Footnotes | 7–8pt | Same rules as source citations |

**Why 10pt not 9pt?** Deloitte presentations are projected in conference rooms, shared on Teams calls at 70% zoom, and printed as handouts. At 9pt on a 13.33" wide slide, text becomes a strain. 10pt is the threshold where body text remains comfortable across all viewing contexts. The 1pt difference is significant at projection scale.

**The 7pt floor for source citations is non-negotiable.** The validator will warn at 6pt, but the skill should prevent it from ever being generated at 6pt in the first place.

```python
from pptx.util import Pt

# When adding custom text boxes
run.font.name = 'Aptos'
run.font.size = Pt(11)       # Body text (DEFAULT — use this)
run.font.size = Pt(10)       # Body text (MINIMUM — only if space-constrained)
run.font.size = Pt(14)       # Section headers
run.font.size = Pt(18)       # Slide subtitles
run.font.size = Pt(24)       # Slide titles
run.font.size = Pt(7)        # Source citations (MINIMUM — never lower)
```

**When space is tight:** If content doesn't fit at 10pt, do NOT drop to 9pt. Instead: split across two slides, reduce the number of bullets (consolidate or cut), or switch to a more space-efficient layout (table, card grid). Shrinking font below 10pt is always the wrong answer for exec content.

## Recommended Deck Structure

A typical Deloitte presentation follows this flow:

1. **Title slide** (layout 0 or 6) — with tagline lockup for external; **fill picture placeholder**
2. **Agenda/divider** (layout 15-17) — section breaks; **use same layout for ALL dividers**
3. **Content slides** (layouts 25-28) — analysis, findings
4. **Chart/data slides** — built on title+subtitle layouts with custom charts
5. **Advanced graphic slides** — infographics, timelines, roadmaps (see below); **no repeated patterns**
6. **Team profile** (layout 29) — if team intro needed
7. **End/legal slide** (layout 31) — **MUST include copyright line**
8. **Run `strip_template_boilerplate()`** before saving — removes master-inherited footers
9. **Run `validate_pptx.py`** and fix any errors

## Advanced Graphics Catalog

For complex infographic slides, read `references/advanced-graphics.md`. Available patterns:

| Category | Use For | Pattern |
|----------|---------|---------|
| **Numbered Cards** (3/4/5/6-col) | Feature highlights, capabilities, steps | Icon circles + title + description |
| **Chevron Process** | Phase flows, methodology steps | Connected chevron arrows |
| **Circular Flow** | Cyclical processes, feedback loops | Nodes in a ring with center label |
| **Gear Diagram** | Interconnected systems, dependencies | Interlocking gear circles |
| **Venn Diagram** (2/3 circles) | Overlapping concepts, intersections | Overlapping circles with labels |
| **Roadmap** | Strategic journeys, milestones | Winding path with numbered stops |
| **Horizontal Timeline** | Chronological events, project phases | Nodes on horizontal axis, alt above/below |
| **Vertical Timeline** | Step-by-step narratives | Dots on vertical axis, alt left/right |
| **Funnel** | Pipeline, stage conversion | Tapering bars top-to-bottom |
| **Comparison** | Pros/cons, option A vs B | Side-by-side panels with VS divider |
| **Pentagon Boxes** | Grouped categories, pillars | Pentagon headers + content cards |
| **Speech Bubble Quotes** | Client testimonials, stakeholder quotes | Colored bubbles with attribution |
| **KPI Dashboard** | Metrics, performance summary | Grid of big-number cards with trends |
| **Pictograph Bars** | Survey results, benchmarks | Labeled horizontal fill bars |
| **Staircase** | Maturity models, progression | Ascending step blocks |
| **Layered Arrows** | Workstreams, parallel tracks | Stacked horizontal arrows |
| **2x2 Matrix** | Prioritization, categorization | Quadrant grid with accent bars |
| **Progress Bars** | Completion status, RAG tracking | Horizontal bars with percentage fill |

## Content Layout Variety (REQUIRED)

**NEVER use the same content layout structure more than twice in one deck.** This applies to BOTH advanced graphic patterns AND basic content layouts. Three slides with the same two-column header-bar + bullet list structure makes a deck look auto-generated.

### Basic Content Layout Tracking

Track not just advanced graphic patterns, but also basic content structures:

| Layout Structure | Description | Track As |
|---|---|---|
| 2-col header + bullets | Colored header bars over two bullet columns | `two_col_bullets` |
| 3-col header + bullets | Three header bars over bullet columns | `three_col_bullets` |
| 2-col header + cards | Header bars over card panels with body text | `two_col_cards` |
| 3-col header + cards | Three cards with headers | `three_col_cards` |
| Full-width bullets | Single column bullet list | `full_width_bullets` |
| Split text + visual | Text on one side, chart/image on other | `split_text_visual` |
| Table layout | Structured table with header row | `table_layout` |

```python
# Extend the pattern tracker to include basic layouts
used_layouts = set()

def select_content_layout(purpose, candidates):
    """Pick an unused content layout. Falls back to least-used."""
    for candidate in candidates:
        if candidate not in used_layouts:
            used_layouts.add(candidate)
            return candidate
    # All used — allow up to 2 of same type but warn
    return candidates[0]

# Example: three slides all need categorized info
layout_1 = select_content_layout('categories', 
    ['three_col_cards', 'two_col_bullets', 'table_layout', 'pentagon_boxes'])
layout_2 = select_content_layout('categories',
    ['three_col_cards', 'two_col_bullets', 'table_layout', 'pentagon_boxes'])
layout_3 = select_content_layout('categories',
    ['three_col_cards', 'two_col_bullets', 'table_layout', 'pentagon_boxes'])
# Returns three DIFFERENT layouts
```

**Alternative treatments when you've already used a layout:**

| Instead of... | Try... |
|---|---|
| Another 2-col bullet slide | A table with category headers |
| Another 3-col card slide | Pentagon boxes or layered arrows |
| Another full-width bullet list | A split layout with key stat callout on one side |
| Another KPI grid | Pictograph bars or progress bars |

### Handling Bullet-Heavy Slides (Anti-Whitespace Rules)

When bullet content fills only the top 40–50% of the content area, the bottom half becomes dead whitespace. This is a common problem with two-column and three-column bullet layouts.

**Rules for managing bullet slide density:**

1. **If bullets end above y=4.0"** (more than 3.4" of whitespace below), you MUST take one of these actions:
   - **Add a "Bottom Line" or "Key Takeaway" callout box** below the bullets — a rounded rectangle with a bold summary statement
   - **Add a supporting data element** — a small 2×3 table, a mini bar chart, or 2–3 KPI stat boxes
   - **Tighten the layout** — reduce the gap between header and first bullet, use a more compact content start position (y=1.60" instead of 2.00")
   - **Switch to a card layout** where the cards are dynamically sized to fill the space

2. **If the same slide has bullets AND you want supporting context**, use a **split layout**: bullets on the left (6"), supporting visual on the right (6"). Never leave the right half empty.

3. **Source citations should float up** to just below the last content element (per the Footnote Positioning rules above), not anchor to y=6.0" with a void above them.

```python
# Example: Add a "Key Takeaway" box below bullet content
def add_takeaway_box(slide, text, content_bottom_y):
    """Add a takeaway callout below the main content."""
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    
    box_y = content_bottom_y + Inches(0.30)
    box = slide.shapes.add_shape(
        5,  # MSO_SHAPE.ROUNDED_RECTANGLE
        Inches(0.50), box_y, Inches(12.33), Inches(0.65)
    )
    box.fill.solid()
    box.fill.fore_color.rgb = RGBColor(0x1C, 0x3D, 0x26)  # Dark green
    box.line.fill.background()
    
    tf = box.text_frame
    tf.word_wrap = True
    tf.paragraphs[0].text = text
    for run in tf.paragraphs[0].runs:
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        run.font.bold = True
        run.font.name = 'Aptos'
    
    return box_y + Inches(0.65)  # return bottom for source line placement
```

All patterns use the Deloitte brand color palette and Aptos typography.

### Numbered Circle Formatting (REQUIRED for numbered cards/steps)

**NEVER zero-pad numbers under 10.** Use "1", "2", "3" — not "01", "02", "03". Zero-padded strings are wider and will wrap to two lines inside standard circles, rendering as "0" on one line and "1" below. This is the most common visual defect in numbered card layouts.

**Circle sizing rules:**

| Numbers | Circle Diameter | Font Size | Notes |
|---------|----------------|-----------|-------|
| 1–9 | 0.55"–0.65" | 16–18pt | Single digit, no padding needed |
| 10–20 | 0.75"–0.85" | 14–16pt | Two digits need wider circle |
| 20+ | 0.90"+ | 12–14pt | Rare; consider using labels instead |

```python
def make_numbered_circle(slide, x, y, number, color, diameter=None, font_size=None):
    """Create a numbered circle with proper sizing.
    
    NEVER pass zero-padded strings. Use int or unpadded str.
    """
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
    
    label = str(int(number))  # Force unpadded: "01" → "1"
    
    # Auto-size based on digit count
    if diameter is None:
        diameter = 0.60 if len(label) == 1 else 0.80
    if font_size is None:
        font_size = 16 if len(label) == 1 else 14
    
    d = Inches(diameter)
    oval = slide.shapes.add_shape(9, x, y, d, d)  # MSO_SHAPE.OVAL
    oval.fill.solid()
    oval.fill.fore_color.rgb = color
    oval.line.fill.background()
    
    tf = oval.text_frame
    tf.word_wrap = False
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    tf.paragraphs[0].text = label
    for run in tf.paragraphs[0].runs:
        run.font.size = Pt(font_size)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        run.font.bold = True
        run.font.name = 'Aptos'
    # Vertical center
    tf.paragraphs[0].space_before = Pt(0)
    tf.paragraphs[0].space_after = Pt(0)
```

### Graphic Pattern Variety (REQUIRED)

**NEVER use the same advanced graphic pattern twice in one deck.** Repeating the same layout (e.g., two 5-column numbered card slides) makes the deck feel template-generated and monotonous.

**Rules:**
1. **Track which patterns you've used.** Before selecting a graphic type, check what's already in the deck.
2. **Alternate between pattern families.** If you used numbered cards for a process, use a chevron flow, horizontal timeline, or staircase for the next sequential/process slide.
3. **Vary color sequences.** If two slides must use the same pattern family (rare — try to avoid), at minimum use a different color sequence (e.g., `CHART_GREENS` on one, `CHART_TEALS` on another).

**Good pattern combinations for common deck structures:**
| Slide Purpose | Option A | Option B | Option C |
|---|---|---|---|
| Process/Steps | Numbered cards | Chevron process | Staircase |
| Timeline | Horizontal timeline | Vertical timeline | Roadmap |
| Comparison | Comparison layout | 2×2 matrix | Pentagon boxes |
| Metrics | KPI dashboard | Pictograph bars | Progress bars |
| Categories | Pentagon boxes | Layered arrows | Numbered cards |

```python
# Track used patterns at the top of your generation script
used_patterns = set()

def select_pattern(purpose, candidates):
    """Pick an unused pattern for a slide purpose."""
    for candidate in candidates:
        if candidate not in used_patterns:
            used_patterns.add(candidate)
            return candidate
    # All candidates used — return first but log warning
    return candidates[0]

# Example usage
timeline_pattern = select_pattern('process', 
    ['numbered_cards', 'chevron_process', 'horizontal_timeline', 'staircase'])
steps_pattern = select_pattern('steps',
    ['numbered_cards', 'chevron_process', 'horizontal_timeline', 'staircase'])
# These will return different patterns
```

### Footnote and Annotation Positioning

**Position footnotes and callout text relative to content, not anchored to the bottom of the safe zone.** When a slide has content that ends at y=3.5" and a footnote at y=6.1", there's a 2.6" void that looks broken.

```python
# BAD: fixed footnote position
footnote_y = Inches(6.10)  # creates a void below content

# GOOD: position relative to content bottom
content_bottom_y = Inches(3.50)  # where your last card/chart ends
footnote_y = content_bottom_y + Inches(0.30)  # small gap, then footnote
```

Track the bottom y-position of your last content element and place annotations 0.20"–0.40" below it. If using the `make_card_column()` helper, it returns the bottom position for exactly this purpose.

## QA — REQUIRED Final Step

**Always run validation after generating a presentation.** Do not deliver without completing this step.

### Step 1: Run the Validator Script

```bash
python path/to/skill/scripts/validate_pptx.py output.pptx
```

The validator checks for:

| Check | Level | What It Catches |
|-------|-------|-----------------|
| **Placeholder text** | ERROR | Leftover "lorem ipsum", "xxxx", "text here", "dummy text", "name surname", template instructions, AND Deloitte template boilerplate: "Insert appropriate copyright", "[To edit, click View > Slide Master]", "Presentation title", "Member firms and DTTL" |
| **Element overlap** | ERROR/WARN | Shapes colliding on the same slide. Text-on-text = ERROR (always unreadable). Text-on-shape = WARNING if >20% covered. Filters out intentional patterns: accent bars, background rectangles, template placeholders |
| **Footer zone intrusion** | WARNING | Non-footnote content extending below y=6.4" into the source citation / footer area. Common with tall charts, many-row tables, and stacked bars |
| **Narrow wrapping** | ERROR/WARN | Text boxes too narrow for their content — causes choppy 2-3 word lines that look broken. Reports words-per-line and suggests widening box, reducing text, or shrinking font |
| **Font legibility** | ERROR/WARN | Font sizes below readability thresholds: <6pt = error, <8pt body = warning, <14pt title = warning. Also flags large fonts in narrow boxes |
| **Text overflow** | WARNING | Text likely too long for its container height (Aptos-calibrated line estimation) |
| **Text density** | WARNING | Too many characters crammed into a small box (chars/sq-in adjusted for font size) |
| **Font size jumps** | WARNING | Jarring size changes within one shape (e.g. 24pt mixed with 8pt in same text box) |
| **Divider consistency** | WARNING | Section dividers using 2+ different layout styles in the same deck |
| **Slide density** | WARNING | Slides with >1500 characters or >12 text shapes — wall-of-text risk |
| **Empty placeholders** | WARNING | Title/body placeholders with no content (missed fills) |
| **Off-palette colors** | WARNING | Fill or text colors not in the Deloitte approved palette |
| **Non-standard fonts** | WARNING | Any font outside Aptos / Open Sans / Stix Two Text / system fallbacks |
| **Out-of-bounds shapes** | WARNING | Shapes extending past slide edges |
| **Low contrast** | WARNING | Text color vs background contrast ratio below 3:1 (WCAG) |
| **Title size consistency** | WARNING | Title font sizes varying across slides |
| **Deck structure** | INFO | Slide count, dimension verification |

**Exit codes**: 0 = PASS, 1 = FAIL (errors found). Errors MUST be fixed; warnings should be reviewed.

Options:
```bash
# Strict mode — treat font issues as errors
python validate_pptx.py output.pptx --strict

# JSON output for programmatic use
python validate_pptx.py output.pptx --json

# Also generate slide images for visual inspection
python validate_pptx.py output.pptx --visual
```

### Step 2: Fix Any Errors

If the validator reports errors:
1. Fix all ❌ ERROR items (placeholder text, structural issues)
2. Review ⚠️ WARNING items — fix any that represent real problems
3. Re-run the validator to confirm fixes

### Step 3: Visual QA

Convert slides to images and visually inspect for overlaps, alignment, and aesthetics:

```bash
# Generate images
python /mnt/skills/public/pptx/scripts/office/soffice.py --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide

# Then visually inspect the slide-*.jpg files
```

Look for:
- Overlapping elements — text rendered on top of other text or shapes at the same position (the validator catches these programmatically, but always visually verify)
- Text cut off at box boundaries
- Uneven spacing (large gaps in one area, cramped in another)
- Elements too close to slide edges (< 0.3")
- Misaligned columns or repeated elements
- Low-contrast text against backgrounds

### Step 4: Template Placeholder Cleanup (MANDATORY)

After generating from ANY Deloitte template, grep for ALL known placeholder patterns. The template contains boilerplate in footers and master-inherited text that must be caught:

```bash
python -m markitdown output.pptx | grep -iE "xxxx|lorem|ipsum|dummy|text here|text runs here|replace|placeholder|insert appropriate|to edit.*click|slide master|presentation title|member firms.*DTTL|click view"
```

**If this returns ANY matches, fix them before delivery.** Common ones the basic grep misses:
- `"Member firms and DTTL: Insert appropriate copyright"` — template footer, replace with actual copyright
- `"[To edit, click View > Slide Master > Slide Master]"` — template instruction, delete
- `"Presentation title"` — bottom-right footer, replace with actual deck title

### QA Summary Checklist

Before delivering, run both **content QA** and **visual/brand QA**:

**C. Content Quality (check FIRST — a polished bad deck is worse than a rough good one)**
- [ ] **Slide blueprint was created** before rendering began
- [ ] **Every content slide has a visible title** — `fill_title()` called on Pattern A slides; custom title textbox on Pattern B slides
- [ ] **Title style matches audience** — assertions for exec briefings; descriptive/provocative OK for pitches
- [ ] **Read the titles in sequence** — do they tell a coherent story?
- [ ] **No fabricated facts** — every number, percentage, date, and company name is sourced or marked `[placeholder]`
- [ ] **Source footnotes present** on every slide with quantitative claims
- [ ] **No more than 5 bullets** on any single slide
- [ ] **No more than 1 primary visual** per slide (unless true comparison)
- [ ] **No 3+ consecutive slides** with the same layout structure
- [ ] **Audience mode is consistent** — density and tone match the deck classification
- [ ] **Each slide has a clear focal point** — reader knows where to look first

**D. Visual/Brand QA (check SECOND)**
- [ ] `strip_template_boilerplate()` was called before saving (footers cleaned)
- [ ] `validate_pptx.py` reports 0 errors
- [ ] All placeholder/template boilerplate removed (run the expanded grep above)
- [ ] Brand colors only (greens, teals, blues, grays from palette)
- [ ] **Functional colors (red/orange/yellow) used ONLY for RAG/status** — never as card headers
- [ ] Aptos font throughout
- [ ] **All font sizes ≥ 7pt** — source citations at 7–8pt, body text at 10pt+
- [ ] Title slide picture placeholder filled (not left blank)
- [ ] Title slide has correct logo lockup (tagline for external, plain for internal)
- [ ] Copyright line on end slide (default: "Copyright © 2026 Deloitte Development LLC. All rights reserved.")
- [ ] **Numbered circles use unpadded digits** (1, 2, 3 — not 01, 02, 03)
- [ ] **No advanced graphic pattern used more than once** in the deck
- [ ] **No basic content layout used more than twice** (e.g., 2-col bullet structure)
- [ ] **All section dividers use the SAME layout** — never mix photo-backed with solid-color
- [ ] **Divider tone matches content** — black for exec/serious, not bright green
- [ ] No text placed directly on images without a dark overlay
- [ ] **No content below y=6.4"** (reserved for source lines and footers)
- [ ] **Card/box heights are fitted to content** — no large empty colored blocks
- [ ] **Card bodies match slide background** — white fill + outline on white slides, dark fill on dark slides. **No pale green fills by default.**
- [ ] **Unused placeholders cleared on freeform slides** — call `clear_unused_placeholders()` to prevent title overlap
- [ ] **No bullet slides with >3" whitespace below content** — add takeaway box or tighten
- [ ] **No bullet slides with >3" whitespace below content** — add takeaway box or tighten
- [ ] **Footnotes positioned near content**, not floating at bottom of safe zone
- [ ] Charts use Deloitte color sequences (not default PowerPoint colors)
- [ ] Chart legends match chart colors exactly (verify dot/segment correspondence)
- [ ] Visual spot-check passed (no overlaps, good alignment)

## Reference Files

- **`references/creation-workflow.md`** — **Read before building any new deck.** Storyline planning, slide blueprints, title rules, visual selection logic, content density, accuracy rules, and source trace conventions
- **`scripts/validate_pptx.py`** — **Run after every deck generation.** Checks overlapping elements, placeholder text, brand colors, fonts, bounds, contrast, text wrapping, legibility, content quality, and consistency
- **`references/layouts.md`** — Complete layout catalog with all 57 layouts, placeholder indices, and positions
- **`references/charts-and-graphics.md`** — Patterns for charts, tables, timelines, org charts, pyramids, process flows, and other graphic slide types
- **`references/advanced-graphics.md`** — 20 advanced infographic patterns: chevron flows, circular cycles, gear diagrams, Venn diagrams, roadmaps, horizontal/vertical timelines, funnels, comparison layouts, pentagon boxes, speech bubble quotes, KPI dashboards, pictographs, staircases, layered arrows, 2x2 matrices, progress bars, and more
- **`references/pmo-patterns.md`** — PMO and SteerCo reporting patterns: RAID tables, status pipelines, scorecard grids, plan/forecast/actual bar charts, progress trackers, footer labels, narrative slides with icons, quarterly timelines
- **`references/consulting-patterns.md`** — Strategy consulting patterns: hero statement slides with overlay opacity rules, maturity model grids, comparison matrices with on-palette severity gradients, numbered use case tables, dotted-line duration lists, and content positioning guidance for bottom-half whitespace
- **`references/illustrations.md`** — Catalog of 14 Deloitte-branded illustrations with keyword tags, decision tree for selection, and placement code patterns
- **`assets/illustrations/`** — Pre-rendered PNG illustrations (industry, construction, automation, logistics, agriculture scenes)
- **`references/photos.md`** — Stock photo catalog with tags, topic-to-image mapping, and placement code patterns (title slides, full-bleed, half-slide, dividers)
- **`assets/photos/`** — 9 pre-approved stock photos tagged by topic (AI, finance, telecom, collaboration, etc.)
- **`assets/template.pptx`** — The official Deloitte 16:9 onscreen template (use for slide creation)
- **`assets/advanced-graphics-library.pptx`** — ~350 advanced graphic designs for visual inspiration (reference only)

## Dependencies

```bash
pip install python-pptx --break-system-packages
pip install "markitdown[pptx]" --break-system-packages  # for QA text extraction
```
