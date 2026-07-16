# Consulting Slide Patterns

High-impact slide structures for strategy, transformation, and client-facing engagements. These go beyond standard card/chart layouts into the visual language consultants actually use.

## 1. Hero Statement Slide

Full-bleed photo with semi-transparent dark overlay, category label, mixed-format headline, and supporting facts. Maximum impact, minimum elements.

**Structure:** Full-bleed photo → dark overlay → small-caps category label with green accent → large mixed-format headline → key facts below.

### Overlay Opacity Rules

The overlay darkness must match the photo busyness. This is the most common failure — too transparent and the text is unreadable.

| Photo type | Alpha (opacity) | Example |
|---|---|---|
| Dark, simple (night sky, dark gradients) | 30–40% | Minimal overlay needed |
| Medium complexity (architecture, people) | 50–60% | Standard — most photos |
| Busy/high-contrast (data screens, crowds, cityscapes) | **65–75%** | Heavy overlay required |
| Very busy (stock tickers, dashboards, dense scenes) | **75–85%** | Nearly opaque — photo is texture only |

**Rule of thumb:** If you can still read numbers or details in the background photo through the overlay, it's too transparent. The photo should be a mood/texture, not a competing visual.

```python
def set_shape_alpha(shp, opacity_pct):
    """Set opacity on a filled shape. opacity_pct: 0=fully transparent, 100=fully opaque."""
    from pptx.oxml.ns import qn
    spPr = shp._element.spPr
    solidFill = spPr.find(qn('a:solidFill'))
    if solidFill is not None:
        srgbClr = solidFill.find(qn('a:srgbClr'))
        if srgbClr is not None:
            alpha = srgbClr.makeelement(qn('a:alpha'), {})
            alpha.set('val', str(opacity_pct * 1000))
            srgbClr.append(alpha)

# STANDARD HERO SLIDE SEQUENCE:
slide = prs.slides.add_slide(prs.slide_layouts[48])
clear_unused_placeholders(slide)  # ← MUST call before adding any shapes
# 1. Photo background
# 2. Dark overlay with set_shape_alpha()
# 3. Category label + accent bar
# 4. Mixed-format headline
# 5. Supporting facts

# Overlay: match opacity to photo busyness
overlay = add_rect(slide, 0, 0, 13.33, 7.50, BLACK)
set_shape_alpha(overlay, 70)  # 70% opaque for busy photo
```

### Mixed-Format Headlines

Use `add_run()` to combine styles in a single paragraph:

```python
hero_tb = slide.shapes.add_textbox(Inches(0.60), Inches(1.80), Inches(11.0), Inches(2.50))
hero_tf = hero_tb.text_frame
hero_tf.word_wrap = True
hero_p = hero_tf.paragraphs[0]

parts = [
    ("The US and Israel launched the ", WHITE, False),
    ("largest joint military operation since 2003", DELOITTE_GREEN, True),
    (", killing Iran's Supreme Leader", WHITE, False),
]
for text, color, bold in parts:
    run = hero_p.add_run()
    run.text = text
    run.font.size = Pt(28)
    run.font.color.rgb = color
    run.font.bold = bold
    run.font.name = 'Aptos'
```

**When to use:** Program kick-offs, vision statements, transformation ambitions, proposal hero pages, geopolitical briefing openers.


## 2. Maturity Model Grid

Stages as chevrons across the top, capability dimensions down rows, activity cells in a matrix with service-type badges (A=Advise, I=Implement, O=Operate).

**Structure:** 3–5 stage headers → row labels for capabilities → activity cells with optional badges → legend row.

Stage colors should progress in intensity: light blue → teal → deep green (least mature to most mature). Add a "most are here" callout pointing to the current-state column.

**When to use:** Capability assessments, digital maturity reviews, technology roadmaps, service offering positioning.


## 3. Numbered Use Case Table

Circle-numbered rows with use case name, description, and category tags. Column headers in deep green. Alternating row backgrounds. Dynamic row heights based on description length.

**Row limit:** 8–9 per slide at 8.5pt. For longer lists, split with "Continued" in the title.

**When to use:** MVP scoping, backlogs, requirements inventories, feature prioritization.


## 4. Dotted-Line Duration List

Workstream labels left, dotted leaders across, bold duration values right. Cleaner than a Gantt when the only information is "what takes how long."

Optional split layout: duration list (left 55%) + relevant image or mockup (right 45%).

**When to use:** Implementation timelines, project phase durations, engagement scoping.


## 5. Solution Comparison Matrix

Options across columns, evaluation criteria down rows, with color-gradient cells and a key takeaways row at the bottom.

### On-Palette Severity Gradients (CRITICAL)

**Never use off-palette colors (pink, red tints, orange backgrounds) in matrix cells.** The Deloitte palette does not include pink. When you need to express severity or escalation across columns, use these on-palette progressions:

| Progression type | Left (mild) | Middle | Right (severe) |
|---|---|---|---|
| **Green severity** | Pale green `F1F6E4` | Light teal `E0F4F4` | Dark gray `E0E0E0` |
| **Teal gradient** | `B2DFE5` (light teal) | `62B5E5` (mid blue) | `005587` (dark blue, white text) |
| **Neutral escalation** | Pale green `F1F6E4` | Light gray `F0F0F0` | Medium gray `D0D0D0` |
| **Brand escalation** | Deloitte Green bg | Teal bg | Deep Green bg (white text) |

```python
# GOOD: On-palette escalation gradient
SCENARIO_BG = [
    RGBColor(0xF1, 0xF6, 0xE4),  # Pale green (contained)
    RGBColor(0xE0, 0xF4, 0xF4),  # Light teal (partial)
    RGBColor(0xE0, 0xE0, 0xE0),  # Light gray (escalation)
]

# BAD: Off-palette pink/red
# RGBColor(0xF4, 0xE0, 0xE0)  ← Not in Deloitte palette. Never use.
```

**Header colors** should also use the brand palette: Deloitte Green → Accessible Teal → Deep Green for mild → moderate → severe scenarios.

**When to use:** Technology option evaluation, vendor comparison, operating model alternatives, scenario analysis.


## Content Positioning: Filling the Bottom Half

When card/content blocks only fill the top 40–60% of the slide, the bottom becomes dead whitespace. This is the most common visual problem across all patterns.

### Strategy 1: Pull Content Up

Start content at y=1.50" instead of 1.90". Reduce the gap between the title and first content element. This is the simplest fix and works when the content just needs a tighter frame.

### Strategy 2: Add a Takeaway Bar (anchored to bottom)

Place a dark green callout bar with a bold summary statement. **Position it at y=5.80–6.00" regardless of where content ends** — this anchors the visual weight at the bottom of the safe zone and eliminates dead space.

```python
def add_takeaway_bar(slide, text, anchor_y=5.85):
    """Add a takeaway/callout bar anchored near the bottom of the content zone.
    
    anchor_y: Fixed position — use 5.85" for standard slides.
    Do NOT position relative to content_bottom — that leaves gaps.
    """
    add_rect(slide, 0.50, anchor_y, 12.33, 0.50, DARK_GREEN_BG)
    add_textbox(slide, 0.65, anchor_y + 0.07, 12.03, 0.38,
                text, size=10, bold=True, color=WHITE)
    return anchor_y + 0.50
```

**Key insight:** Positioning the takeaway bar relative to `content_bottom + 0.20` creates a gap between the content and the bar. Instead, anchor it at a fixed y-position near the bottom of the safe zone (y=5.85"). The bar fills the visual gap regardless of how high the content sits.

### Strategy 3: Add Supporting Data

Below the primary cards, add 2–3 KPI stat boxes, a mini chart, or a "bottom line" summary with 2–3 key metrics. This transforms dead space into additional value.

### Strategy 4: Use a More Compact Layout

Switch from separate header bars + card bodies to inline accent-border cards (thin colored left-border instead of full header). This typically saves 0.5–0.8" per card row.

### When to Apply

| Content ends above... | Action required |
|---|---|
| y=3.5" (3.0"+ of whitespace) | **Must act** — add takeaway bar, supporting data, or tighten |
| y=4.0" (2.4" of whitespace) | **Should act** — tighten or add a supporting element |
| y=4.5" (1.9" of whitespace) | Acceptable — source line and breathing room |
| y=5.0" or below | Good — content fills the space well |


## Pattern Selection Guide

| Slide need | Pattern | Key signal |
|---|---|---|
| Vision, ambition, "what we believe" | Hero Statement | Emotional impact; one big idea |
| "Where are we on the journey" | Maturity Model Grid | Multiple dimensions × multiple stages |
| Backlog, requirements, capability list | Numbered Use Case Table | Structured items needing numbers + descriptions |
| "How long will each phase take" | Dotted-Line Duration List | Simple duration without Gantt complexity |
| "Which option should we pick" | Solution Comparison Matrix | Multiple options × evaluation criteria |
