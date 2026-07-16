# Advanced Graphics Patterns

Code patterns for creating advanced Deloitte-branded graphics using python-pptx, based on the Advanced Graphics Timesaver library (~350 slide designs). These are all built from shapes — use on any content slide layout from the main template.

All patterns place content within the standard content safe zone (x=0.50", y=1.84", w=12.33", h=5.12") unless otherwise noted. Use `Inches()` for positioning, `Pt()` for font sizes, and the brand colors from SKILL.md.

## Table of Contents

1. [Shared Utilities](#shared-utilities)
2. [Numbered / Icon Card Layouts](#numbered-icon-card-layouts)
3. [Chevron Process Flows](#chevron-process-flows)
4. [Circular Flows & Cycles](#circular-flows--cycles)
5. [Gear Diagrams](#gear-diagrams)
6. [Venn Diagrams](#venn-diagrams)
7. [Roadmap / Winding Path](#roadmap--winding-path)
8. [Horizontal Timelines](#horizontal-timelines)
9. [Vertical Timelines](#vertical-timelines)
10. [Funnel Diagrams](#funnel-diagrams)
11. [Comparison / Versus Layouts](#comparison--versus-layouts)
12. [Pentagon / Shield Content Boxes](#pentagon--shield-content-boxes)
13. [Speech Bubble Quotes](#speech-bubble-quotes)
14. [Stat Dashboard / KPI Grid](#stat-dashboard--kpi-grid)
15. [Pictograph / Icon Stats](#pictograph--icon-stats)
16. [Staircase / Steps](#staircase--steps)
17. [Network / Mind Map](#network--mind-map)
18. [Layered Arrows](#layered-arrows)
19. [Matrix / 2x2 Grid](#matrix--2x2-grid)
20. [Progress / Completion Bars](#progress--completion-bars)

---

## Shared Utilities

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
import math

# Brand colors
DELOITTE_GREEN = RGBColor(0x86, 0xBC, 0x25)
MID_GREEN = RGBColor(0x26, 0x89, 0x0D)
DEEP_GREEN = RGBColor(0x04, 0x6A, 0x38)
ACCESSIBLE_TEAL = RGBColor(0x0D, 0x83, 0x90)
TEAL_6 = RGBColor(0x00, 0x76, 0x80)
BLUE_3 = RGBColor(0x00, 0xA3, 0xE0)
DARK_GRAY = RGBColor(0x28, 0x27, 0x28)
COOL_GRAY_11 = RGBColor(0x53, 0x56, 0x5A)
COOL_GRAY_7 = RGBColor(0x97, 0x99, 0x9B)
LIGHT_GRAY = RGBColor(0xE6, 0xE6, 0xE6)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
BLACK = RGBColor(0x00, 0x00, 0x00)
CARD_BG = RGBColor(0xFF, 0xFF, 0xFF)  # White card — matches slide background
CARD_BORDER = RGBColor(0xD0, 0xD0, 0xD0)  # Light gray outline

# Color sequences for multi-item layouts
SEQ_GREENS = [DELOITTE_GREEN, MID_GREEN, DEEP_GREEN]
SEQ_MIXED = [DELOITTE_GREEN, ACCESSIBLE_TEAL, BLUE_3, MID_GREEN, TEAL_6]
SEQ_DARK = [DARK_GRAY, COOL_GRAY_11, COOL_GRAY_7]

def hex_to_rgb(h):
    return RGBColor(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))

def add_textbox(slide, x, y, w, h, text, font_size=10, bold=False,
                color=BLACK, align=PP_ALIGN.LEFT, font_name='Aptos',
                word_wrap=True, valign=MSO_ANCHOR.TOP):
    """Utility to add a styled text box."""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = word_wrap
    try:
        tf.auto_size = None
    except:
        pass
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = font_name
    return tb

def add_circle(slide, cx, cy, diameter, fill_color, text='', 
               text_color=WHITE, font_size=12, bold=True):
    """Add a circle with centered text."""
    r = diameter / 2
    shape = slide.shapes.add_shape(
        MSO_SHAPE.OVAL,
        Inches(cx - r), Inches(cy - r), Inches(diameter), Inches(diameter)
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    shape.line.fill.background()
    if text:
        tf = shape.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = text
        run.font.size = Pt(font_size)
        run.font.bold = bold
        run.font.color.rgb = text_color
        run.font.name = 'Aptos'
    return shape

def add_rect(slide, x, y, w, h, fill_color, text='', text_color=WHITE,
             font_size=10, bold=False, rounded=False):
    """Add a rectangle (optionally rounded) with centered text."""
    shape_type = MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE
    shape = slide.shapes.add_shape(
        shape_type, Inches(x), Inches(y), Inches(w), Inches(h)
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    shape.line.fill.background()
    if text:
        tf = shape.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = text
        run.font.size = Pt(font_size)
        run.font.bold = bold
        run.font.color.rgb = text_color
        run.font.name = 'Aptos'
    return shape

def add_line(slide, x1, y1, x2, y2, color=COOL_GRAY_7, width=1.5):
    """Add a connector line between two points."""
    left = Inches(min(x1, x2))
    top = Inches(min(y1, y2))
    w = Inches(abs(x2 - x1)) if abs(x2 - x1) > 0.01 else Inches(0.01)
    h = Inches(abs(y2 - y1)) if abs(y2 - y1) > 0.01 else Inches(0.01)
    shape = slide.shapes.add_shape(MSO_SHAPE.LINE, left, top, w, h)
    shape.line.color.rgb = color
    shape.line.width = Pt(width)
    return shape
```

---

## Numbered / Icon Card Layouts

Based on slides 28-120. The most common pattern: numbered circles or icon badges + title + description arranged in columns or rows.

### 3-Column Icon Cards (light background)

```python
def add_numbered_cards_3col(slide, items, y_start=2.0):
    """
    items: list of 3 dicts with 'number', 'title', 'description'
    Pattern: circle with number on top, title, description below
    """
    positions = [(0.5, 4.0), (4.73, 4.0), (8.95, 4.0)]
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL, MID_GREEN]
    
    for i, (x, w) in enumerate([(0.5, 3.88), (4.73, 3.88), (8.95, 3.88)]):
        item = items[i]
        # Number circle
        add_circle(slide, x + w/2, y_start + 0.4, 0.7, colors[i],
                   text=item['number'], font_size=18)
        # Title
        add_textbox(slide, x, y_start + 1.0, w, 0.35, item['title'],
                    font_size=12, bold=True, align=PP_ALIGN.CENTER)
        # Description
        add_textbox(slide, x, y_start + 1.4, w, 2.0, item['description'],
                    font_size=9, color=COOL_GRAY_11, align=PP_ALIGN.CENTER)
```

### 4-Column Icon Cards

```python
def add_numbered_cards_4col(slide, items, y_start=2.0):
    """items: list of 4 dicts with 'number'/'icon', 'title', 'description'"""
    cols = [(0.5, 2.94), (3.63, 2.94), (6.76, 2.94), (9.90, 2.94)]
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL, MID_GREEN, TEAL_6]
    
    for i, (x, w) in enumerate(cols):
        item = items[i]
        add_circle(slide, x + w/2, y_start + 0.4, 0.65, colors[i],
                   text=item.get('number', str(i+1)), font_size=16)
        add_textbox(slide, x, y_start + 1.0, w, 0.3, item['title'],
                    font_size=11, bold=True, align=PP_ALIGN.CENTER)
        add_textbox(slide, x, y_start + 1.35, w, 2.5, item['description'],
                    font_size=9, color=COOL_GRAY_11, align=PP_ALIGN.CENTER)
```

### 5-6 Column Mini Cards (icon grid)

```python
def add_icon_grid(slide, items, cols=5, y_start=2.0):
    """Smaller cards for 5-6 items. items: list of dicts with 'label', 'value'"""
    gap = 0.25
    total_w = 12.33
    card_w = (total_w - gap * (cols - 1)) / cols
    
    for i, item in enumerate(items):
        col = i % cols
        row = i // cols
        x = 0.5 + col * (card_w + gap)
        y = y_start + row * 2.2
        
        # Card background
        add_rect(slide, x, y, card_w, 1.8, CARD_BG, rounded=True, border=CARD_BORDER)
        # Accent bar on top
        add_rect(slide, x, y, card_w, 0.06, DELOITTE_GREEN)
        # Value (big number)
        add_textbox(slide, x, y + 0.2, card_w, 0.6, item.get('value', ''),
                    font_size=24, bold=True, color=DELOITTE_GREEN,
                    align=PP_ALIGN.CENTER)
        # Label
        add_textbox(slide, x, y + 0.8, card_w, 0.8, item.get('label', ''),
                    font_size=9, align=PP_ALIGN.CENTER, color=COOL_GRAY_11)
```

---

## Chevron Process Flows

Based on slides 110, 113, 301-303. Horizontal arrow/chevron chains showing process steps.

```python
def add_chevron_flow(slide, steps, y_center=4.0):
    """
    steps: list of dicts with 'title' and optional 'description'
    Creates connected chevron arrows.
    """
    n = len(steps)
    total_w = 12.33
    chev_w = total_w / n
    chev_h = 0.8
    y = y_center - chev_h / 2
    colors = [DELOITTE_GREEN, MID_GREEN, DEEP_GREEN, ACCESSIBLE_TEAL, TEAL_6]
    
    for i, step in enumerate(steps):
        x = 0.5 + i * chev_w
        
        # Chevron shape
        shape = slide.shapes.add_shape(
            MSO_SHAPE.CHEVRON,
            Inches(x), Inches(y), Inches(chev_w - 0.05), Inches(chev_h)
        )
        shape.fill.solid()
        shape.fill.fore_color.rgb = colors[i % len(colors)]
        shape.line.fill.background()
        
        # Title inside chevron
        tf = shape.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = step['title']
        run.font.size = Pt(9)
        run.font.bold = True
        run.font.color.rgb = WHITE
        run.font.name = 'Aptos'
        
        # Description below
        if 'description' in step:
            add_textbox(slide, x, y + chev_h + 0.15, chev_w - 0.1, 1.5,
                        step['description'], font_size=8, color=COOL_GRAY_11,
                        align=PP_ALIGN.CENTER)
```

---

## Circular Flows & Cycles

Based on slides 33, 35, 72, 85, 229, 231. Circular arrangement of steps showing cyclical processes.

```python
def add_circular_flow(slide, items, cx=6.66, cy=4.4, radius=2.2):
    """
    items: list of dicts with 'title' and optional 'description'
    Arranges items in a circle with connecting arrows.
    """
    n = len(items)
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL, MID_GREEN, TEAL_6, BLUE_3, DEEP_GREEN]
    node_r = 0.45
    
    for i, item in enumerate(items):
        angle = (2 * math.pi * i / n) - math.pi / 2  # Start from top
        nx = cx + radius * math.cos(angle)
        ny = cy + radius * math.sin(angle)
        
        # Node circle
        add_circle(slide, nx, ny, node_r * 2, colors[i % len(colors)],
                   text=item['title'], font_size=8, bold=True)
        
        # Arrow to next node (curved conceptually, straight line here)
        next_i = (i + 1) % n
        next_angle = (2 * math.pi * next_i / n) - math.pi / 2
        ax = cx + (radius - 0.5) * math.cos((angle + next_angle) / 2)
        ay = cy + (radius - 0.5) * math.sin((angle + next_angle) / 2)
    
    # Center label
    add_circle(slide, cx, cy, 1.2, DARK_GRAY, text='Process\nCycle',
               font_size=10, bold=True)
```

---

## Gear Diagrams

Based on slides 15, 18, 63, 86-89. Interlocking gears representing interconnected processes.

```python
def add_gear_diagram(slide, items, cx=6.66, cy=4.0):
    """
    items: list of 2-4 dicts with 'title' and 'description'
    Simulates interlocking gears using circles with labels.
    """
    positions = {
        2: [(-1.5, 0), (1.5, 0)],
        3: [(-1.8, -0.8), (1.8, -0.8), (0, 1.2)],
        4: [(-1.8, -1.0), (1.8, -1.0), (-1.8, 1.2), (1.8, 1.2)],
    }
    n = min(len(items), 4)
    offsets = positions[n]
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL, MID_GREEN, TEAL_6]
    sizes = [1.6, 1.4, 1.3, 1.2]
    
    for i, item in enumerate(items[:n]):
        ox, oy = offsets[i]
        gx, gy = cx + ox, cy + oy
        diameter = sizes[i]
        
        # Outer ring (gear teeth simulated with slightly larger circle)
        add_circle(slide, gx, gy, diameter + 0.15, colors[i % len(colors)])
        # Inner circle
        add_circle(slide, gx, gy, diameter - 0.15, DARK_GRAY if i % 2 else colors[i],
                   text=item['title'], font_size=9, bold=True)
        
        # Description beside gear
        desc_x = gx + diameter/2 + 0.2 if ox >= 0 else gx - diameter/2 - 2.2
        add_textbox(slide, desc_x, gy - 0.3, 2.0, 0.8, item.get('description', ''),
                    font_size=8, color=COOL_GRAY_11)
```

---

## Venn Diagrams

Based on slides 71, 85, 91, 304-305. Overlapping circles showing relationships.

```python
def add_venn_2(slide, labels, center_text='', cx=6.66, cy=4.0):
    """Two overlapping circles."""
    r = 1.6
    offset = 0.9
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL]
    
    for i, (dx, label) in enumerate(zip([-offset, offset], labels)):
        shape = add_circle(slide, cx + dx, cy, r * 2, colors[i],
                           text=label, font_size=10, bold=True)
        shape.fill.fore_color.rgb = colors[i]
        # Make semi-transparent
        shape.fill.fore_color.brightness = 0.0
    
    if center_text:
        add_textbox(slide, cx - 0.8, cy - 0.2, 1.6, 0.4, center_text,
                    font_size=9, bold=True, align=PP_ALIGN.CENTER,
                    color=WHITE)

def add_venn_3(slide, labels, cx=6.66, cy=4.2):
    """Three overlapping circles."""
    r = 1.3
    angles = [-math.pi/2, math.pi/6, 5*math.pi/6]
    offset = 0.7
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL, MID_GREEN]
    
    for i, (angle, label) in enumerate(zip(angles, labels)):
        x = cx + offset * math.cos(angle)
        y = cy + offset * math.sin(angle)
        add_circle(slide, x, y, r * 2, colors[i], text=label,
                   font_size=9, bold=True)
```

---

## Roadmap / Winding Path

Based on slides 268-276. A winding road with milestone markers.

```python
def add_roadmap(slide, milestones, y_start=2.2):
    """
    milestones: list of dicts with 'title', 'description'
    Creates a horizontal winding path with numbered stops.
    """
    n = len(milestones)
    path_y = y_start + 1.5
    segment_w = 12.33 / n
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL, MID_GREEN, TEAL_6, BLUE_3]
    
    # Draw path line
    add_rect(slide, 0.5, path_y - 0.04, 12.33, 0.08, COOL_GRAY_7)
    
    for i, ms in enumerate(milestones):
        x = 0.5 + segment_w * i + segment_w / 2
        above = (i % 2 == 0)  # Alternate above/below path
        
        # Milestone dot on path
        add_circle(slide, x, path_y, 0.35, colors[i % len(colors)],
                   text=str(i + 1), font_size=10, bold=True)
        
        # Vertical connector
        conn_y1 = path_y - 0.3 if above else path_y + 0.3
        conn_y2 = path_y - 1.0 if above else path_y + 1.0
        add_line(slide, x, conn_y1, x, conn_y2, color=colors[i % len(colors)])
        
        # Text box
        text_y = path_y - 2.0 if above else path_y + 0.6
        add_textbox(slide, x - segment_w/2 + 0.1, text_y, segment_w - 0.2, 0.3,
                    ms['title'], font_size=10, bold=True, align=PP_ALIGN.CENTER,
                    color=colors[i % len(colors)])
        add_textbox(slide, x - segment_w/2 + 0.1, text_y + 0.3, segment_w - 0.2, 0.7,
                    ms.get('description', ''), font_size=8,
                    align=PP_ALIGN.CENTER, color=COOL_GRAY_11)
```

---

## Horizontal Timelines

Based on slides 282-298. Timelines with connected nodes along a horizontal axis.

```python
def add_horizontal_timeline(slide, events, y_center=4.2):
    """
    events: list of dicts with 'date', 'title', 'description'
    """
    n = len(events)
    start_x = 1.0
    end_x = 12.3
    span = end_x - start_x
    step = span / (n - 1) if n > 1 else span
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL, MID_GREEN, TEAL_6, BLUE_3, DEEP_GREEN]
    
    # Horizontal line
    add_rect(slide, start_x, y_center - 0.03, span, 0.06, COOL_GRAY_7)
    
    for i, event in enumerate(events):
        x = start_x + i * step
        above = (i % 2 == 0)
        
        # Node
        add_circle(slide, x, y_center, 0.3, colors[i % len(colors)],
                   text=str(i + 1), font_size=9)
        
        # Connector line
        if above:
            add_line(slide, x, y_center - 0.2, x, y_center - 0.8,
                     color=colors[i % len(colors)])
            ty = y_center - 1.8
        else:
            add_line(slide, x, y_center + 0.2, x, y_center + 0.8,
                     color=colors[i % len(colors)])
            ty = y_center + 0.5
        
        # Date label
        add_textbox(slide, x - 0.6, ty, 1.2, 0.25,
                    event.get('date', ''), font_size=9, bold=True,
                    align=PP_ALIGN.CENTER, color=colors[i % len(colors)])
        # Title
        add_textbox(slide, x - 0.6, ty + 0.25, 1.2, 0.25,
                    event['title'], font_size=8, bold=True,
                    align=PP_ALIGN.CENTER)
        # Description
        add_textbox(slide, x - 0.6, ty + 0.5, 1.2, 0.6,
                    event.get('description', ''), font_size=7,
                    align=PP_ALIGN.CENTER, color=COOL_GRAY_11)
```

---

## Vertical Timelines

Based on slides 61-62, 67, 284-285. Top-to-bottom timeline with alternating sides.

```python
def add_vertical_timeline(slide, events, x_center=6.66):
    """
    events: list of dicts with 'date', 'title', 'description'
    """
    n = len(events)
    y_start = 2.0
    y_end = 6.5
    step = (y_end - y_start) / max(n - 1, 1)
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL, MID_GREEN, TEAL_6]
    
    # Vertical line
    add_rect(slide, x_center - 0.02, y_start, 0.04, y_end - y_start, COOL_GRAY_7)
    
    for i, event in enumerate(events):
        y = y_start + i * step
        left = (i % 2 == 0)
        
        # Dot on line
        add_circle(slide, x_center, y, 0.25, colors[i % len(colors)])
        
        # Text placement
        if left:
            tx = x_center - 5.5
            tw = 5.0
            ta = PP_ALIGN.RIGHT
        else:
            tx = x_center + 0.5
            tw = 5.0
            ta = PP_ALIGN.LEFT
        
        add_textbox(slide, tx, y - 0.15, tw, 0.3,
                    f"{event.get('date', '')}  {event['title']}",
                    font_size=10, bold=True, align=ta, color=colors[i % len(colors)])
        add_textbox(slide, tx, y + 0.15, tw, 0.5,
                    event.get('description', ''), font_size=8,
                    align=ta, color=COOL_GRAY_11)
```

---

## Funnel Diagrams

Based on slides 194, 200, 240. Tapering funnel showing stage-by-stage filtering.

```python
def add_funnel(slide, stages, cx=6.66, y_start=2.0, total_h=4.5):
    """
    stages: list of dicts with 'label', 'value' (optional), in order from widest to narrowest
    """
    n = len(stages)
    max_w = 8.0
    min_w = 2.5
    row_h = total_h / n
    colors = [DELOITTE_GREEN, MID_GREEN, DEEP_GREEN, ACCESSIBLE_TEAL, TEAL_6]
    
    for i, stage in enumerate(stages):
        pct = 1 - (i / max(n - 1, 1))
        w = min_w + (max_w - min_w) * pct
        x = cx - w / 2
        y = y_start + i * row_h
        
        add_rect(slide, x, y, w, row_h - 0.08, colors[i % len(colors)],
                 rounded=True)
        
        # Label centered in bar
        label = stage['label']
        if 'value' in stage:
            label = f"{stage['value']}  —  {label}"
        add_textbox(slide, x, y + 0.08, w, row_h - 0.16, label,
                    font_size=11, bold=True, color=WHITE,
                    align=PP_ALIGN.CENTER)
```

---

## Comparison / Versus Layouts

Based on slides 31, 93, 221. Side-by-side comparison with a divider.

```python
def add_comparison(slide, left, right, y_start=2.0):
    """
    left/right: dicts with 'title', 'points' (list of strings), optional 'color'
    """
    lc = left.get('color', DELOITTE_GREEN)
    rc = right.get('color', ACCESSIBLE_TEAL)
    
    # Left header bar
    add_rect(slide, 0.5, y_start, 5.8, 0.5, lc,
             text=left['title'], text_color=WHITE, font_size=14, bold=True)
    # Right header bar
    add_rect(slide, 7.0, y_start, 5.83, 0.5, rc,
             text=right['title'], text_color=WHITE, font_size=14, bold=True)
    
    # Center "VS" circle
    add_circle(slide, 6.66, y_start + 0.25, 0.5, DARK_GRAY,
               text='VS', font_size=10, bold=True)
    
    # Left bullet points
    for i, pt in enumerate(left['points']):
        add_textbox(slide, 0.7, y_start + 0.7 + i * 0.45, 5.4, 0.4,
                    f"•  {pt}", font_size=9, color=DARK_GRAY)
    
    # Right bullet points
    for i, pt in enumerate(right['points']):
        add_textbox(slide, 7.2, y_start + 0.7 + i * 0.45, 5.4, 0.4,
                    f"•  {pt}", font_size=9, color=DARK_GRAY)
```

---

## Pentagon / Shield Content Boxes

Based on slides 217, 220, 223. Pentagon-shaped containers for grouped content.

```python
def add_pentagon_boxes(slide, items, y_start=2.0):
    """
    items: list of 3-4 dicts with 'title', 'points' (list)
    Pentagon header + content body.
    """
    n = len(items)
    gap = 0.25
    col_w = (12.33 - gap * (n - 1)) / n
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL, MID_GREEN, TEAL_6]
    
    for i, item in enumerate(items):
        x = 0.5 + i * (col_w + gap)
        
        # Pentagon header
        shape = slide.shapes.add_shape(
            MSO_SHAPE.PENTAGON,
            Inches(x), Inches(y_start), Inches(col_w), Inches(0.7)
        )
        shape.fill.solid()
        shape.fill.fore_color.rgb = colors[i % len(colors)]
        shape.line.fill.background()
        shape.rotation = 180.0  # Point downward
        
        tf = shape.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = item['title']
        run.font.size = Pt(10)
        run.font.bold = True
        run.font.color.rgb = WHITE
        run.font.name = 'Aptos'
        
        # Content box below
        add_rect(slide, x, y_start + 0.75, col_w, 3.5, CARD_BG, border=CARD_BORDER)
        
        for j, point in enumerate(item.get('points', [])):
            add_textbox(slide, x + 0.15, y_start + 0.9 + j * 0.4,
                        col_w - 0.3, 0.35, f"•  {point}",
                        font_size=8, color=DARK_GRAY)
```

---

## Speech Bubble Quotes

Based on slides 266-267.

```python
def add_speech_quotes(slide, quotes, y_start=2.2):
    """
    quotes: list of dicts with 'text', 'author'
    """
    n = len(quotes)
    col_w = (12.33 - 0.3 * (n - 1)) / n
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL, MID_GREEN]
    
    for i, q in enumerate(quotes):
        x = 0.5 + i * (col_w + 0.3)
        
        # Bubble rectangle
        add_rect(slide, x, y_start, col_w, 2.5, colors[i % len(colors)],
                 rounded=True)
        
        # Quote text
        add_textbox(slide, x + 0.2, y_start + 0.2, col_w - 0.4, 1.8,
                    f'"{q["text"]}"', font_size=10, color=WHITE)
        
        # Author
        add_textbox(slide, x + 0.2, y_start + 2.0, col_w - 0.4, 0.3,
                    f"— {q['author']}", font_size=8, bold=True, color=WHITE)
        
        # Triangle pointer below bubble
        tri = slide.shapes.add_shape(
            MSO_SHAPE.ISOSCELES_TRIANGLE,
            Inches(x + 0.5), Inches(y_start + 2.5),
            Inches(0.4), Inches(0.3)
        )
        tri.fill.solid()
        tri.fill.fore_color.rgb = colors[i % len(colors)]
        tri.line.fill.background()
        tri.rotation = 180.0
```

---

## Stat Dashboard / KPI Grid

Based on slides 14, 23, 26, 189, 195, 225. Grid of key metrics with large numbers.

```python
def add_kpi_dashboard(slide, kpis, cols=4, y_start=2.0):
    """
    kpis: list of dicts with 'value', 'label', optional 'trend' (+/-), 'color'
    """
    gap = 0.2
    col_w = (12.33 - gap * (cols - 1)) / cols
    row_h = 2.2
    
    for i, kpi in enumerate(kpis):
        col = i % cols
        row = i // cols
        x = 0.5 + col * (col_w + gap)
        y = y_start + row * row_h
        color = kpi.get('color', DELOITTE_GREEN)
        
        # Card background
        add_rect(slide, x, y, col_w, row_h - 0.15, CARD_BG, rounded=True, border=CARD_BORDER)
        # Top accent line
        add_rect(slide, x, y, col_w, 0.06, color)
        
        # Big value
        add_textbox(slide, x, y + 0.3, col_w, 0.8, kpi['value'],
                    font_size=32, bold=True, color=color,
                    align=PP_ALIGN.CENTER)
        # Label
        add_textbox(slide, x + 0.1, y + 1.1, col_w - 0.2, 0.6,
                    kpi['label'], font_size=9, align=PP_ALIGN.CENTER,
                    color=COOL_GRAY_11)
        # Trend indicator
        if 'trend' in kpi:
            trend_color = DELOITTE_GREEN if kpi['trend'].startswith('+') else hex_to_rgb('DA291C')
            add_textbox(slide, x, y + 1.6, col_w, 0.3, kpi['trend'],
                        font_size=10, bold=True, color=trend_color,
                        align=PP_ALIGN.CENTER)
```

---

## Pictograph / Icon Stats

Based on slides 186, 195, 198-199. Visual statistics using filled/unfilled shapes.

```python
def add_pictograph_bar(slide, items, y_start=2.2):
    """
    items: list of dicts with 'label', 'pct' (0-100), optional 'value_text'
    Horizontal progress bars with percentage fill.
    """
    bar_h = 0.35
    gap = 0.6
    max_bar_w = 8.0
    label_w = 3.5
    
    for i, item in enumerate(items):
        y = y_start + i * (bar_h + gap)
        
        # Label
        add_textbox(slide, 0.5, y, label_w, bar_h, item['label'],
                    font_size=10, bold=True, color=DARK_GRAY)
        
        # Bar background
        bar_x = 0.5 + label_w + 0.2
        add_rect(slide, bar_x, y, max_bar_w, bar_h, LIGHT_GRAY, rounded=True)
        
        # Filled portion
        fill_w = max_bar_w * (item['pct'] / 100)
        if fill_w > 0.1:
            add_rect(slide, bar_x, y, fill_w, bar_h, DELOITTE_GREEN, rounded=True)
        
        # Percentage text
        pct_text = item.get('value_text', f"{item['pct']}%")
        add_textbox(slide, bar_x + max_bar_w + 0.15, y, 1.0, bar_h,
                    pct_text, font_size=10, bold=True, color=DELOITTE_GREEN)
```

---

## Staircase / Steps

Based on slides 66, 240, 271. Ascending steps showing progression.

```python
def add_staircase(slide, steps, y_bottom=6.5, x_start=0.8):
    """steps: list of dicts with 'title', 'description' (ascending order)"""
    n = len(steps)
    step_w = 11.0 / n
    step_h = 3.5 / n
    colors = [DELOITTE_GREEN, MID_GREEN, DEEP_GREEN, ACCESSIBLE_TEAL, TEAL_6]
    
    for i, step in enumerate(steps):
        x = x_start + i * step_w
        y = y_bottom - (i + 1) * step_h
        h = (i + 1) * step_h
        
        add_rect(slide, x, y, step_w - 0.1, h, colors[i % len(colors)],
                 text=step['title'], text_color=WHITE, font_size=9, bold=True)
        
        add_textbox(slide, x, y - 0.5, step_w - 0.1, 0.4,
                    step.get('description', ''), font_size=7,
                    align=PP_ALIGN.CENTER, color=COOL_GRAY_11)
```

---

## Layered Arrows

Based on slides 301-303. Large arrows with labels showing direction/flow.

```python
def add_layered_arrows(slide, layers, direction='right', y_start=2.2):
    """
    layers: list of dicts with 'title', 'points' (list of callout labels)
    Large converging arrows with milestone labels.
    """
    n = len(layers)
    total_h = 4.0
    row_h = total_h / n
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL, MID_GREEN, TEAL_6]
    
    for i, layer in enumerate(layers):
        y = y_start + i * row_h
        
        shape = slide.shapes.add_shape(
            MSO_SHAPE.RIGHT_ARROW if direction == 'right' else MSO_SHAPE.LEFT_ARROW,
            Inches(0.5), Inches(y), Inches(12.33), Inches(row_h - 0.1)
        )
        shape.fill.solid()
        shape.fill.fore_color.rgb = colors[i % len(colors)]
        shape.line.fill.background()
        
        tf = shape.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = layer['title']
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = WHITE
        run.font.name = 'Aptos'
```

---

## Matrix / 2x2 Grid

Based on slides 91, 93, 120. Quadrant layouts for categorization.

```python
def add_2x2_matrix(slide, quadrants, axis_labels=None, y_start=2.0):
    """
    quadrants: list of 4 dicts (TL, TR, BL, BR) with 'title', 'description'
    axis_labels: optional dict with 'top', 'bottom', 'left', 'right'
    """
    gap = 0.15
    qw = (12.33 - gap) / 2
    qh = (4.8 - gap) / 2
    positions = [
        (0.5, y_start),                # Top-left
        (0.5 + qw + gap, y_start),     # Top-right
        (0.5, y_start + qh + gap),     # Bottom-left
        (0.5 + qw + gap, y_start + qh + gap),  # Bottom-right
    ]
    colors = [DELOITTE_GREEN, ACCESSIBLE_TEAL, MID_GREEN, TEAL_6]
    
    for i, (x, y) in enumerate(positions):
        q = quadrants[i]
        
        # Quadrant background
        add_rect(slide, x, y, qw, qh, CARD_BG, rounded=True, border=CARD_BORDER)
        # Accent bar
        add_rect(slide, x, y, qw, 0.06, colors[i])
        
        # Title
        add_textbox(slide, x + 0.15, y + 0.15, qw - 0.3, 0.3,
                    q['title'], font_size=11, bold=True, color=colors[i])
        # Description
        add_textbox(slide, x + 0.15, y + 0.5, qw - 0.3, qh - 0.7,
                    q.get('description', ''), font_size=9, color=COOL_GRAY_11)
```

---

## Progress / Completion Bars

Based on slides 25, 186. Multiple labeled progress bars.

```python
def add_progress_bars(slide, items, y_start=2.5, show_labels=True):
    """
    items: list of dicts with 'label', 'pct', optional 'color'
    """
    n = len(items)
    bar_h = 0.4
    spacing = 0.7
    bar_w = 8.0
    label_x = 0.5
    bar_x = 4.0
    
    for i, item in enumerate(items):
        y = y_start + i * spacing
        color = item.get('color', DELOITTE_GREEN)
        
        if show_labels:
            add_textbox(slide, label_x, y + 0.05, 3.2, bar_h,
                        item['label'], font_size=10, bold=True,
                        color=DARK_GRAY, align=PP_ALIGN.RIGHT)
        
        # Track
        add_rect(slide, bar_x, y, bar_w, bar_h, LIGHT_GRAY, rounded=True)
        # Fill
        fill = max(bar_w * item['pct'] / 100, 0.1)
        add_rect(slide, bar_x, y, fill, bar_h, color, rounded=True)
        # Value
        add_textbox(slide, bar_x + bar_w + 0.15, y + 0.05, 0.8, bar_h,
                    f"{item['pct']}%", font_size=11, bold=True, color=color)
```
