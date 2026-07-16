# Deloitte Template Layout Reference

Complete catalog of all 57 layouts in the 16:9 onscreen template (13.33" × 7.50").

## Table of Contents

1. [Title Slides (0-12)](#title-slides)
2. [Divider Slides (13-22)](#divider-slides)
3. [Content Slides — White (23-31)](#content-slides--white)
4. [Content Slides — Light Gray (32-39)](#content-slides--light-gray)
5. [Content Slides — Pale Green (40-47)](#content-slides--pale-green)
6. [Content Slides — Black (48-56)](#content-slides--black)
7. [Helper Functions](#helper-functions)

---

## Title Slides

All title slides share the same placeholder structure. The visual difference is the background theme and whether the Deloitte tagline lockup is present.

### Placeholder Map (All Title Slides)

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 0 | CENTER_TITLE (3) | x=0.50", y=5.67" | w=4.91", h=0.98" | Headline (bottom-left) |
| 10 | BODY (2) | x=0.50", y=6.96" | w=4.91", h=0.20" | Subtitle / date / author |
| 11 | PICTURE (18) | x=6.52", y=0.76" | w=6.06", h=6.06" | Circular motif / image area |

**Exception**: Layout 12 (Full-bleed image) has the picture at x=0, y=0, w=13.33", h=7.50" (full slide).

### Layout Index

| Index | Name | Notes |
|-------|------|-------|
| 0 | Title slide - White with tagline logo lockup | Default for external presentations |
| 1 | Title slide - White | No tagline lockup |
| 2 | Title slide - Pale Green with tagline logo lockup | |
| 3 | Title slide - Pale Green | |
| 4 | Title slide - Pale-Deloitte Green gradient with tagline | |
| 5 | Title slide - Pale-Deloitte Green gradient | |
| 6 | Title slide - Black with tagline logo lockup | Premium/dark theme |
| 7 | Title slide - Black | |
| 8 | Title slide - Dark Green with tagline logo lockup | |
| 9 | Title slide - Dark Green | |
| 10 | Title slide - Dark-Bright gradient with tagline | |
| 11 | Title slide - Dark-Bright gradient | |
| 12 | Title slide - Full bleed image | Full-bleed background image |

### Code Example

```python
def add_title_slide(prs, title, subtitle, layout_idx=0):
    """Add a title slide. Use even indices for tagline lockup, odd for without."""
    slide = prs.slides.add_slide(prs.slide_layouts[layout_idx])
    for shape in slide.shapes:
        if hasattr(shape, 'placeholder_format'):
            idx = shape.placeholder_format.idx
            if idx == 0:
                shape.text = title
            elif idx == 10:
                shape.text = subtitle
    return slide
```

---

## Divider Slides

Section dividers with large centered text for breaking presentation into sections.

### Layouts 13-14 (Glow / United — special motif backgrounds)

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 1 | BODY (2) | x=0.00", y=3.39" | w=13.33", h=0.72" | Divider text (centered) |

### Layouts 15-22 (Standard dividers)

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 0 | TITLE (1) | x=0.50", y=1.84" | w=12.33", h=1.74" | Divider heading |

### Layout Index

| Index | Name | Background |
|-------|------|------------|
| 13 | Divider - Glow | Dark with dot-pattern glow motif |
| 14 | Divider - United | Dark with connected-circle motif |
| 15 | Divider - Pale Green | Solid pale green |
| 16 | Divider - Deloitte Green | Solid Deloitte green |
| 17 | Divider - Pale-Deloitte Green gradient | Green gradient |
| 18 | Divider - Deloitte Deep Green | Deep green |
| 19 | Divider - Dark-Bright gradient with tagline | Dark gradient + lockup |
| 20 | Divider - Deloitte Accessible Teal | Teal |
| 21 | Divider - Black | Solid black |
| 22 | Divider - Full-bleed image | Image background (idx=11 PICTURE at full slide) |

### Code Example

```python
def add_divider(prs, text, layout_idx=15):
    """Add a section divider slide."""
    slide = prs.slides.add_slide(prs.slide_layouts[layout_idx])
    for shape in slide.shapes:
        if hasattr(shape, 'placeholder_format'):
            ptype = shape.placeholder_format.type
            if ptype in (1, 2):  # TITLE or BODY
                shape.text = text
    return slide
```

---

## Content Slides — White

Standard white background content slides. These are the most commonly used for day-to-day content.

### Header Placeholders (shared across 23-30)

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 0 | TITLE (1) | x=0.50", y=0.38" | w=12.33", h=0.37" | Page title |
| 13 | BODY (2) | x=0.50", y=0.75" | w=12.33", h=0.83" | Page subtitle |

### Layout 23: Title Only
No content placeholders — use for fully custom slides with shapes/charts.

### Layout 24: Title + Subtitle
Header placeholders only. Content area is open for custom elements.

### Layout 25: Title + Subtitle + 1 Column

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 1 | OBJECT (7) | x=0.51", y=1.84" | w=12.33", h=5.12" | Full-width content |

### Layout 26: Title + Subtitle + 2 Columns

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 10 | OBJECT (7) | x=0.50", y=1.84" | w=6.00", h=5.12" | Left column |
| 20 | OBJECT (7) | x=6.84", y=1.84" | w=6.01", h=5.12" | Right column |

### Layout 27: Title + Subtitle + 3 Columns

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 10 | OBJECT (7) | x=0.50", y=1.84" | w=3.88", h=5.12" | Column 1 |
| 17 | OBJECT (7) | x=4.73", y=1.84" | w=3.88", h=5.12" | Column 2 |
| 18 | OBJECT (7) | x=8.95", y=1.84" | w=3.88", h=5.12" | Column 3 |

### Layout 28: Title + Subtitle + 4 Columns

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 10 | OBJECT (7) | x=0.50", y=1.84" | w=2.94", h=5.12" | Column 1 |
| 14 | OBJECT (7) | x=3.63", y=1.84" | w=2.94", h=5.12" | Column 2 |
| 15 | OBJECT (7) | x=6.76", y=1.84" | w=2.94", h=5.12" | Column 3 |
| 16 | OBJECT (7) | x=9.90", y=1.84" | w=2.94", h=5.12" | Column 4 |

### Layout 29: Team Profile (2×2 grid)

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 25 | PICTURE (18) | x=0.50", y=2.06" | w=1.61", h=1.61" | Photo top-left |
| 32 | BODY (2) | x=2.30", y=2.06" | w=4.21", h=2.13" | Bio top-left |
| 27 | PICTURE (18) | x=6.83", y=2.06" | w=1.61", h=1.61" | Photo top-right |
| 33 | BODY (2) | x=8.63", y=2.06" | w=4.21", h=2.13" | Bio top-right |
| 29 | PICTURE (18) | x=0.50", y=4.65" | w=1.61", h=1.61" | Photo bottom-left |
| 34 | BODY (2) | x=2.30", y=4.65" | w=4.21", h=2.13" | Bio bottom-left |
| 31 | PICTURE (18) | x=6.84", y=4.65" | w=1.61", h=1.61" | Photo bottom-right |
| 35 | BODY (2) | x=8.63", y=4.65" | w=4.21", h=2.13" | Bio bottom-right |

### Layout 30: Qualifications (2×1)

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 28 | PICTURE (18) | x=4.90", y=2.06" | w=1.61", h=1.61" | Photo left |
| 29 | PICTURE (18) | x=11.22", y=2.06" | w=1.61", h=1.61" | Photo right |
| 32 | BODY (2) | x=0.50", y=3.83" | w=6.01", h=2.13" | Details left |
| 33 | BODY (2) | x=6.84", y=3.83" | w=6.01", h=2.13" | Details right |

### Layout 31: End Slide

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 13 | BODY (2) | x=0.50", y=4.58" | w=9.37", h=2.37" | Copyright line (default: "Copyright © 2026 Deloitte Development LLC. All rights reserved.") |

---

## Content Slides — Light Gray

Identical structure to White content slides but with light gray background. Header uses a DIFFERENT placeholder pattern:

### Header Placeholders (shared across 32-39)

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 15 | BODY (2) | x=0.50", y=0.38" | w=12.33", h=0.29" | Page subtitle (small label) |
| 27 | BODY (2) | x=0.50", y=0.67" | w=12.33", h=0.44" | Page title (larger) |

**Note**: The title/subtitle are swapped compared to White — subtitle is on top (smaller), title below (larger).

### Layout Index

| Index | Content Area | Column Placeholder idx values |
|-------|-------------|-------------------------------|
| 32 | Title only | — |
| 33 | Title + subtitle | — |
| 34 | 1 column | idx=1 (OBJECT) |
| 35 | 2 columns | idx=10 (left), idx=20 (right) |
| 36 | 3 columns | idx=10, 17, 18 |
| 37 | 4 columns | idx=10, 14, 15, 16 |
| 38 | Team profile | Same as layout 29 + header idx=36/15 |
| 39 | Qualifications | Same as layout 30 + header idx=27/15 |

---

## Content Slides — Pale Green

Same structure as Light Gray with pale green background. Uses the SAME header pattern as Light Gray.

### Header Placeholders (shared across 40-47)

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 15 | BODY (2) | x=0.50", y=0.38" | w=12.33", h=0.29" | Page subtitle |
| 27 | BODY (2) | x=0.50", y=0.67" | w=12.33", h=0.44" | Page title |

### Layout Index

| Index | Content Area | Column Placeholder idx values |
|-------|-------------|-------------------------------|
| 40 | Title only | — |
| 41 | Title + subtitle | — |
| 42 | 1 column | idx=1 (OBJECT) |
| 43 | 2 columns | idx=10 (left), idx=20 (right) |
| 44 | 3 columns | idx=10, 17, 18 |
| 45 | 4 columns | idx=10, 14, 15, 16 |
| 46 | Team profile | Same structure |
| 47 | Qualifications | Same structure |

---

## Content Slides — Black

Dark-themed content slides. Uses the SAME header pattern as White.

### Header Placeholders (shared across 48-56)

| idx | Type | Position | Size | Purpose |
|-----|------|----------|------|---------|
| 0 | TITLE (1) | x=0.50", y=0.38" | w=12.33", h=0.37" | Page title |
| 13 | BODY (2) | x=0.50", y=0.75" | w=12.33", h=0.83" | Page subtitle |

### Layout Index

| Index | Content Area | Column Placeholder idx values |
|-------|-------------|-------------------------------|
| 48 | Title only | — |
| 49 | Title + subtitle | — |
| 50 | 1 column | idx=1 (OBJECT) |
| 51 | 2 columns | idx=10 (left), idx=15 (right) |
| 52 | 3 columns | idx=10, 17, 18 |
| 53 | 4 columns | idx=10, 18, 19, 20 |
| 54 | Team profile | idx=25/27/29/31 (photos), 33-36 (bios) |
| 55 | Qualifications | idx=28/29 (photos), 10/30 (content) |
| 56 | End slide | idx=13 (copyright at y=4.58") |

**Note**: Black 2-col uses idx=10/15 (not 10/20 like White). Black 4-col uses idx=10/18/19/20 (not 10/14/15/16).

---

## Helper Functions

### Universal Content Filler

```python
def fill_content_placeholder(shape, content_items):
    """Fill a content placeholder with hierarchical text.
    
    content_items: list of (text, level) tuples
      level 0 = section header
      level 1 = bullet point
      level 2 = sub-bullet
    """
    tf = shape.text_frame
    # Clear existing paragraphs
    for para in tf.paragraphs:
        para.clear()
    
    tf.paragraphs[0].text = content_items[0][0]
    tf.paragraphs[0].level = content_items[0][1]
    
    for text, level in content_items[1:]:
        p = tf.add_paragraph()
        p.text = text
        p.level = level
```

### Theme-Aware Header Filler

```python
def fill_header(slide, title, subtitle, theme='white'):
    """Fill slide header based on theme.
    
    theme: 'white', 'light_gray', 'pale_green', or 'black'
    """
    for shape in slide.shapes:
        if not hasattr(shape, 'placeholder_format'):
            continue
        idx = shape.placeholder_format.idx
        ptype = shape.placeholder_format.type
        
        if theme in ('white', 'black'):
            if ptype == 1:  # TITLE
                shape.text = title
            elif idx == 13:
                shape.text = subtitle
        elif theme in ('light_gray', 'pale_green'):
            if idx == 27:
                shape.text = title
            elif idx == 15:
                shape.text = subtitle
```

### Layout Selector

```python
def get_content_layout(prs, columns=1, theme='white'):
    """Get the appropriate layout index for content slides.
    
    columns: 0 (title only), 1, 2, 3, or 4
    theme: 'white', 'light_gray', 'pale_green', 'black'
    """
    base = {'white': 23, 'light_gray': 32, 'pale_green': 40, 'black': 48}
    offset = {0: 0, 1: 2, 2: 3, 3: 4, 4: 5}  # 0=title only, etc.
    # Title+subtitle = base+1, 1col = base+2, etc.
    
    layout_map = {
        'white':      {0: 23, 'sub': 24, 1: 25, 2: 26, 3: 27, 4: 28, 'team': 29, 'qual': 30, 'end': 31},
        'light_gray': {0: 32, 'sub': 33, 1: 34, 2: 35, 3: 36, 4: 37, 'team': 38, 'qual': 39},
        'pale_green': {0: 40, 'sub': 41, 1: 42, 2: 43, 3: 44, 4: 45, 'team': 46, 'qual': 47},
        'black':      {0: 48, 'sub': 49, 1: 50, 2: 51, 3: 52, 4: 53, 'team': 54, 'qual': 55, 'end': 56},
    }
    return prs.slide_layouts[layout_map[theme][columns]]
```
