# Charts and Graphics Reference

Patterns for creating chart, table, and graphic slide types based on the Deloitte template. All examples use python-pptx and should be placed within the content safe zone (x=0.50", y=1.84", w=12.33", h=5.12").

## Table of Contents

1. [Brand Color Sequences for Charts](#brand-color-sequences)
2. [Bar Charts](#bar-charts)
3. [Line Charts](#line-charts)
4. [Pie / Doughnut Charts](#pie--doughnut-charts)
5. [Scatter Charts](#scatter-charts)
6. [Tables](#tables)
7. [Timelines](#timelines)
8. [Process Flows / Arrows](#process-flows)
9. [Org Charts / Team Structures](#org-charts)
10. [Pyramids](#pyramids)
11. [Icon Cards](#icon-cards)
12. [Quotation Boxes](#quotation-boxes)
13. [Key Statement Slides](#key-statement-slides)
14. [Text + Chart Split Layout](#text--chart-split-layout)
15. [Stat Callouts / KPIs](#stat-callouts)

---

## Brand Color Sequences

Always use Deloitte brand colors for charts. Choose a sequence based on the data's nature:

```python
from pptx.dml.color import RGBColor

# For sequential/related data — use one color family
GREENS = ['86BC25', '26890D', '046A38', '43B02A', '009A44', 'C4D600']
TEALS  = ['0D8390', '007680', '0097A9', '00ABAB', '6FC2B4', '9DD4CF']
BLUES  = ['005587', '0076A8', '00A3E0', '62B5E5', 'A0DCFF']

# For categorical/distinct data — use mixed palette
MIXED  = ['86BC25', '0D8390', '00A3E0', '26890D', '0076A8', 'C4D600', '0097A9']

# For emphasis (1 item highlighted)
EMPHASIS_GREEN = ['86BC25'] + ['D0D0CE'] * 6  # Green + grays

# Functional colors (use sparingly)
RED_AMBER_GREEN = ['DA2910', 'ED8B00', '86BC25']  # RAG status

def hex_to_rgb(hex_str):
    return RGBColor(int(hex_str[0:2], 16), int(hex_str[2:4], 16), int(hex_str[4:6], 16))

def apply_chart_colors(chart, colors):
    """Apply brand colors to chart series."""
    plot = chart.plots[0]
    for i, series in enumerate(plot.series):
        fill = series.format.fill
        fill.solid()
        fill.fore_color.rgb = hex_to_rgb(colors[i % len(colors)])
```

---

## Bar Charts

### Vertical Column Chart (template slide 40 pattern)

```python
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE

def add_bar_chart(slide, title, categories, series_data, 
                  x=0.5, y=1.84, w=12.33, h=5.12,
                  colors=None, stacked=False):
    """
    series_data: dict of {series_name: [values]}
    """
    chart_data = CategoryChartData()
    chart_data.categories = categories
    for name, values in series_data.items():
        chart_data.add_series(name, values)
    
    chart_type = XL_CHART_TYPE.COLUMN_STACKED if stacked else XL_CHART_TYPE.COLUMN_CLUSTERED
    
    chart_frame = slide.shapes.add_chart(
        chart_type,
        Inches(x), Inches(y), Inches(w), Inches(h),
        chart_data
    )
    chart = chart_frame.chart
    chart.has_legend = len(series_data) > 1
    
    if colors:
        apply_chart_colors(chart, colors)
    
    # Add chart title
    chart.has_title = True
    chart.chart_title.text_frame.text = title
    chart.chart_title.text_frame.paragraphs[0].font.size = Pt(11)
    chart.chart_title.text_frame.paragraphs[0].font.name = 'Aptos'
    
    return chart
```

### Horizontal Bar Chart (template slide 45 pattern)

```python
def add_horizontal_bar(slide, title, categories, series_data,
                       x=0.5, y=1.84, w=12.33, h=5.12,
                       colors=None, stacked=False):
    chart_data = CategoryChartData()
    chart_data.categories = categories
    for name, values in series_data.items():
        chart_data.add_series(name, values)
    
    chart_type = XL_CHART_TYPE.BAR_STACKED if stacked else XL_CHART_TYPE.BAR_CLUSTERED
    
    chart_frame = slide.shapes.add_chart(
        chart_type,
        Inches(x), Inches(y), Inches(w), Inches(h),
        chart_data
    )
    chart = chart_frame.chart
    
    if colors:
        apply_chart_colors(chart, colors)
    
    return chart
```

### Tornado Chart (template slide 46 pattern)

A tornado chart is a horizontal bar chart with two series going in opposite directions:

```python
def add_tornado_chart(slide, title, categories, left_values, right_values,
                      left_label="Left", right_label="Right"):
    """Left values should be negative, right values positive."""
    chart_data = CategoryChartData()
    chart_data.categories = categories
    chart_data.add_series(left_label, left_values)
    chart_data.add_series(right_label, right_values)
    
    chart_frame = slide.shapes.add_chart(
        XL_CHART_TYPE.BAR_CLUSTERED,
        Inches(0.5), Inches(1.84), Inches(12.33), Inches(5.12),
        chart_data
    )
    chart = chart_frame.chart
    
    # Color left series one color, right another
    plot = chart.plots[0]
    plot.series[0].format.fill.solid()
    plot.series[0].format.fill.fore_color.rgb = hex_to_rgb('0D8390')
    plot.series[1].format.fill.solid()
    plot.series[1].format.fill.fore_color.rgb = hex_to_rgb('86BC25')
    
    return chart
```

---

## Line Charts

### Multi-series Line Chart (template slide 47 pattern)

```python
from pptx.enum.chart import XL_CHART_TYPE

def add_line_chart(slide, title, categories, series_data,
                   x=0.5, y=1.84, w=12.33, h=5.12,
                   colors=None, smooth=False):
    chart_data = CategoryChartData()
    chart_data.categories = categories
    for name, values in series_data.items():
        chart_data.add_series(name, values)
    
    chart_frame = slide.shapes.add_chart(
        XL_CHART_TYPE.LINE,
        Inches(x), Inches(y), Inches(w), Inches(h),
        chart_data
    )
    chart = chart_frame.chart
    chart.has_legend = True
    
    if colors:
        plot = chart.plots[0]
        for i, series in enumerate(plot.series):
            series.format.line.color.rgb = hex_to_rgb(colors[i % len(colors)])
            series.format.line.width = Pt(2.5)
            series.smooth = smooth
    
    return chart
```

---

## Pie / Doughnut Charts

### Pie Chart (template slide 40 pattern)

```python
from pptx.chart.data import ChartData

def add_pie_chart(slide, title, categories, values,
                  x=0.5, y=1.84, w=5.5, h=5.12,
                  colors=None, is_doughnut=False):
    chart_data = ChartData()
    chart_data.categories = categories
    chart_data.add_series('', values)
    
    chart_type = XL_CHART_TYPE.DOUGHNUT if is_doughnut else XL_CHART_TYPE.PIE
    
    chart_frame = slide.shapes.add_chart(
        chart_type,
        Inches(x), Inches(y), Inches(w), Inches(h),
        chart_data
    )
    chart = chart_frame.chart
    
    # Show percentage labels
    plot = chart.plots[0]
    plot.has_data_labels = True
    data_labels = plot.data_labels
    data_labels.number_format = '0%'
    data_labels.font.size = Pt(10)
    data_labels.font.name = 'Aptos'
    
    if colors:
        # For pie charts, color individual points
        series = plot.series[0]
        for i in range(len(categories)):
            point = series.points[i]
            point.format.fill.solid()
            point.format.fill.fore_color.rgb = hex_to_rgb(colors[i % len(colors)])
    
    return chart
```

### Triple Pie Layout (template slide 41 pattern — 3 pies side by side)

```python
def add_triple_pie(slide, charts_data):
    """
    charts_data: list of 3 dicts with keys: title, categories, values, colors
    """
    positions = [
        (0.5, 1.84, 3.88, 4.5),
        (4.73, 1.84, 3.88, 4.5),
        (8.95, 1.84, 3.88, 4.5),
    ]
    
    for i, (x, y, w, h) in enumerate(positions):
        data = charts_data[i]
        chart_data = ChartData()
        chart_data.categories = data['categories']
        chart_data.add_series('', data['values'])
        
        chart_frame = slide.shapes.add_chart(
            XL_CHART_TYPE.DOUGHNUT,
            Inches(x), Inches(y), Inches(w), Inches(h),
            chart_data
        )
        # Add label above
        slide.shapes.add_textbox(
            Inches(x), Inches(y - 0.3), Inches(w), Inches(0.3)
        ).text_frame.text = data['title']
```

---

## Scatter Charts

### Scatter Chart (template slide 49 pattern)

```python
from pptx.chart.data import XyChartData

def add_scatter_chart(slide, title, series_data,
                      x=0.5, y=1.84, w=12.33, h=5.12, colors=None):
    """
    series_data: dict of {series_name: [(x, y), ...]}
    """
    chart_data = XyChartData()
    for name, points in series_data.items():
        series = chart_data.add_series(name)
        for px, py in points:
            series.add_data_point(px, py)
    
    chart_frame = slide.shapes.add_chart(
        XL_CHART_TYPE.XY_SCATTER,
        Inches(x), Inches(y), Inches(w), Inches(h),
        chart_data
    )
    return chart_frame.chart
```

---

## Tables

### Simple Table (template slide 54 pattern)

```python
def add_branded_table(slide, headers, rows, 
                      x=0.5, y=1.84, w=12.33,
                      row_height=0.4, header_color='86BC25'):
    """Create a Deloitte-branded table with green header."""
    num_rows = len(rows) + 1
    num_cols = len(headers)
    h = row_height * num_rows
    
    table_shape = slide.shapes.add_table(
        num_rows, num_cols,
        Inches(x), Inches(y), Inches(w), Inches(h)
    )
    tbl = table_shape.table
    
    # Set column widths evenly
    col_w = Inches(w / num_cols)
    for i in range(num_cols):
        tbl.columns[i].width = col_w
    
    # Header row
    for i, header in enumerate(headers):
        cell = tbl.cell(0, i)
        cell.text = header
        cell.fill.solid()
        cell.fill.fore_color.rgb = hex_to_rgb(header_color)
        for p in cell.text_frame.paragraphs:
            p.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            p.font.bold = True
            p.font.size = Pt(10)
            p.font.name = 'Aptos'
    
    # Data rows
    for r, row in enumerate(rows):
        for c, val in enumerate(row):
            cell = tbl.cell(r + 1, c)
            cell.text = str(val)
            for p in cell.text_frame.paragraphs:
                p.font.size = Pt(9)
                p.font.name = 'Aptos'
            # Alternating row shading
            if r % 2 == 0:
                cell.fill.solid()
                cell.fill.fore_color.rgb = RGBColor(0xF5, 0xF5, 0xF5)  # Light gray alternating row
    
    return tbl
```

### Data Table with Subtotals (template slide 55 pattern)

```python
def add_data_table(slide, headers, rows, subtotal_rows=None, total_row=None):
    """
    subtotal_rows: list of row indices that are subtotals
    total_row: index of the total row
    """
    tbl = add_branded_table(slide, headers, rows)
    
    if subtotal_rows:
        for r in subtotal_rows:
            for c in range(len(headers)):
                cell = tbl.cell(r + 1, c)
                cell.fill.solid()
                cell.fill.fore_color.rgb = RGBColor(0xDD, 0xEF, 0xE8)  # Teal 1
                for p in cell.text_frame.paragraphs:
                    p.font.bold = True
    
    if total_row is not None:
        for c in range(len(headers)):
            cell = tbl.cell(total_row + 1, c)
            cell.fill.solid()
            cell.fill.fore_color.rgb = hex_to_rgb('0D8390')
            for p in cell.text_frame.paragraphs:
                p.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
                p.font.bold = True
    
    return tbl
```

### Flow Table with Phase Headers (template slide 56 pattern)

```python
def add_flow_table(slide, phases, activities, 
                   x=0.5, y=2.2, w=12.33):
    """
    phases: list of phase names
    activities: list of dicts with 'name' and 'cells' (list per phase)
    """
    num_cols = len(phases) + 1  # +1 for activity label column
    num_rows = len(activities) + 1  # +1 for phase header
    
    tbl_shape = slide.shapes.add_table(
        num_rows, num_cols,
        Inches(x), Inches(y), Inches(w), Inches(0.4 * num_rows)
    )
    tbl = tbl_shape.table
    
    # Phase headers (colored)
    phase_colors = ['86BC25', '26890D', '046A38', '009A44']
    for i, phase in enumerate(phases):
        cell = tbl.cell(0, i + 1)
        cell.text = phase
        cell.fill.solid()
        cell.fill.fore_color.rgb = hex_to_rgb(phase_colors[i % len(phase_colors)])
        for p in cell.text_frame.paragraphs:
            p.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            p.font.bold = True
            p.font.size = Pt(9)
    
    # Activity rows
    for r, activity in enumerate(activities):
        tbl.cell(r + 1, 0).text = activity['name']
        for c, cell_text in enumerate(activity['cells']):
            tbl.cell(r + 1, c + 1).text = cell_text
```

---

## Timelines

### Project Timeline (template slide 57 pattern)

Build timelines using shapes rather than tables for better visual control:

```python
def add_timeline(slide, stages, start_y=2.2):
    """
    stages: list of dicts with 'name', 'start_pct', 'end_pct', 'activities'
    start_pct/end_pct: 0.0 to 1.0 representing timeline position
    """
    timeline_x = 2.5
    timeline_w = 10.0
    bar_h = 0.25
    row_h = 0.5
    
    colors = ['86BC25', '26890D', '046A38', '0D8390', '007680']
    
    for i, stage in enumerate(stages):
        y = start_y + (i * row_h * 2)
        bar_x = timeline_x + (stage['start_pct'] * timeline_w)
        bar_w = (stage['end_pct'] - stage['start_pct']) * timeline_w
        
        # Stage label
        slide.shapes.add_textbox(
            Inches(0.5), Inches(y), Inches(2.0), Inches(bar_h)
        ).text_frame.text = stage['name']
        
        # Bar
        shape = slide.shapes.add_shape(
            1,  # MSO_SHAPE.RECTANGLE
            Inches(bar_x), Inches(y), Inches(bar_w), Inches(bar_h)
        )
        shape.fill.solid()
        shape.fill.fore_color.rgb = hex_to_rgb(colors[i % len(colors)])
        shape.line.fill.background()
```

---

## Process Flows

### Text Boxes with Arrows (template slide 51 pattern)

```python
def add_process_flow(slide, steps, y_start=2.0):
    """
    steps: list of dicts with 'title' and 'description'
    """
    num_steps = len(steps)
    box_w = 2.5
    arrow_w = 0.4
    total_w = (num_steps * box_w) + ((num_steps - 1) * arrow_w)
    start_x = (13.33 - total_w) / 2
    
    for i, step in enumerate(steps):
        x = start_x + i * (box_w + arrow_w)
        
        # Green header bar
        header = slide.shapes.add_shape(
            1, Inches(x), Inches(y_start), Inches(box_w), Inches(0.4)
        )
        header.fill.solid()
        header.fill.fore_color.rgb = hex_to_rgb('86BC25')
        header.line.fill.background()
        
        # Add title text to header
        tf = header.text_frame
        tf.text = step['title']
        tf.paragraphs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        tf.paragraphs[0].font.size = Pt(10)
        tf.paragraphs[0].font.bold = True
        tf.paragraphs[0].font.name = 'Aptos'
        
        # Description box below
        desc = slide.shapes.add_textbox(
            Inches(x), Inches(y_start + 0.5), Inches(box_w), Inches(1.5)
        )
        desc.text_frame.text = step['description']
        desc.text_frame.paragraphs[0].font.size = Pt(9)
        desc.text_frame.paragraphs[0].font.name = 'Aptos'
        
        # Arrow between steps
        if i < num_steps - 1:
            arrow_x = x + box_w + 0.05
            arrow = slide.shapes.add_shape(
                13,  # MSO_SHAPE.RIGHT_ARROW
                Inches(arrow_x), Inches(y_start + 0.5), 
                Inches(arrow_w - 0.1), Inches(0.3)
            )
            arrow.fill.solid()
            arrow.fill.fore_color.rgb = hex_to_rgb('86BC25')
            arrow.line.fill.background()
```

---

## Org Charts

### Organizational Chart (template slide 61 pattern)

```python
def add_org_chart(slide, org_data, y_start=1.84):
    """
    org_data: dict with 'title', 'members', and optional 'children' list
    """
    box_w = 2.0
    box_h = 0.8
    
    def draw_box(x, y, title, names, color='86BC25'):
        shape = slide.shapes.add_shape(
            1, Inches(x), Inches(y), Inches(box_w), Inches(box_h)
        )
        shape.fill.solid()
        shape.fill.fore_color.rgb = hex_to_rgb(color)
        shape.line.fill.background()
        
        tf = shape.text_frame
        tf.word_wrap = True
        tf.paragraphs[0].text = title
        tf.paragraphs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        tf.paragraphs[0].font.size = Pt(9)
        tf.paragraphs[0].font.bold = True
        tf.paragraphs[0].font.name = 'Aptos'
        
        for name in names:
            p = tf.add_paragraph()
            p.text = name
            p.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            p.font.size = Pt(8)
            p.font.name = 'Aptos'
    
    def draw_connector(x1, y1, x2, y2):
        """Draw an L-shaped connector line."""
        line = slide.shapes.add_shape(
            1,  # Use thin rectangle as line
            Inches(min(x1, x2)), Inches(y1),
            Inches(abs(x2 - x1) or 0.02), Inches(abs(y2 - y1) or 0.02)
        )
        line.fill.solid()
        line.fill.fore_color.rgb = RGBColor(0x53, 0x56, 0x5A)
    
    # Position top-level box centered
    center_x = (13.33 - box_w) / 2
    draw_box(center_x, y_start, org_data['title'], org_data.get('members', []))
    
    # Draw children in a row below
    children = org_data.get('children', [])
    if children:
        total_w = len(children) * box_w + (len(children) - 1) * 0.3
        child_start_x = (13.33 - total_w) / 2
        child_y = y_start + box_h + 0.5
        
        for i, child in enumerate(children):
            cx = child_start_x + i * (box_w + 0.3)
            draw_box(cx, child_y, child['title'], child.get('members', []), '26890D')
```

---

## Pyramids

### Pyramid Diagram (template slide 64 pattern)

```python
def add_pyramid(slide, levels, x_center=6.66, y_start=2.0, 
                max_width=5.0, total_height=4.5):
    """
    levels: list of strings from top (narrowest) to bottom (widest)
    """
    num_levels = len(levels)
    level_h = total_height / num_levels
    colors = ['86BC25', '26890D', '046A38', '009A44', 'C4D600']
    
    for i, label in enumerate(levels):
        # Width increases from top to bottom
        pct = (i + 1) / num_levels
        w = max_width * pct
        x = x_center - w / 2
        y = y_start + i * level_h
        
        shape = slide.shapes.add_shape(
            5,  # MSO_SHAPE.ISOSCELES_TRIANGLE (or use TRAPEZOID)
            Inches(x), Inches(y), Inches(w), Inches(level_h - 0.05)
        )
        shape.fill.solid()
        shape.fill.fore_color.rgb = hex_to_rgb(colors[i % len(colors)])
        shape.line.fill.background()
        
        # Add label as separate text box
        tb = slide.shapes.add_textbox(
            Inches(x_center - 1.5), Inches(y + 0.05),
            Inches(3.0), Inches(level_h - 0.1)
        )
        tf = tb.text_frame
        tf.text = label
        tf.paragraphs[0].alignment = PP_ALIGN.CENTER
        tf.paragraphs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        tf.paragraphs[0].font.size = Pt(11)
        tf.paragraphs[0].font.bold = True
        tf.paragraphs[0].font.name = 'Aptos'
```

---

## Icon Cards

### 4-Column Icon Layout (template slide 53 pattern)

```python
def add_icon_cards(slide, cards):
    """
    cards: list of dicts with 'icon_text' (emoji/letter), 'title', 'description'
    Max 4 cards.
    """
    positions = [
        (0.50, 3.88), (4.73, 3.88), 
        (0.50, 3.88), (4.73, 3.88),  # for 2-row layout
    ]
    
    num = len(cards)
    col_w = 12.33 / num - 0.2
    
    for i, card in enumerate(cards):
        x = 0.50 + i * (col_w + 0.27)
        
        # Icon circle
        circle = slide.shapes.add_shape(
            9,  # MSO_SHAPE.OVAL
            Inches(x + col_w/2 - 0.35), Inches(2.0),
            Inches(0.7), Inches(0.7)
        )
        circle.fill.solid()
        circle.fill.fore_color.rgb = hex_to_rgb('86BC25')
        circle.line.fill.background()
        
        # Icon letter/symbol in circle
        tf = circle.text_frame
        tf.text = card.get('icon_text', '•')
        tf.paragraphs[0].alignment = PP_ALIGN.CENTER
        tf.paragraphs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        tf.paragraphs[0].font.size = Pt(18)
        
        # Title
        title_box = slide.shapes.add_textbox(
            Inches(x), Inches(2.9), Inches(col_w), Inches(0.4)
        )
        title_box.text_frame.text = card['title']
        title_box.text_frame.paragraphs[0].font.bold = True
        title_box.text_frame.paragraphs[0].font.size = Pt(11)
        title_box.text_frame.paragraphs[0].font.name = 'Aptos'
        
        # Description
        desc_box = slide.shapes.add_textbox(
            Inches(x), Inches(3.3), Inches(col_w), Inches(3.0)
        )
        desc_box.text_frame.word_wrap = True
        desc_box.text_frame.text = card['description']
        desc_box.text_frame.paragraphs[0].font.size = Pt(9)
        desc_box.text_frame.paragraphs[0].font.name = 'Aptos'
```

---

## Quotation Boxes

### Quote Boxes (template slide 65 pattern)

```python
def add_quote_boxes(slide, quotes, y_start=2.0):
    """
    quotes: list of dicts with 'text' and optional 'attribution'
    """
    box_h = 1.8
    gap = 0.3
    
    for i, quote in enumerate(quotes):
        y = y_start + i * (box_h + gap)
        
        # Green accent bar on left
        bar = slide.shapes.add_shape(
            1, Inches(0.5), Inches(y), Inches(0.08), Inches(box_h)
        )
        bar.fill.solid()
        bar.fill.fore_color.rgb = hex_to_rgb('86BC25')
        bar.line.fill.background()
        
        # Quote text
        tb = slide.shapes.add_textbox(
            Inches(0.8), Inches(y + 0.1), Inches(11.5), Inches(box_h - 0.2)
        )
        tf = tb.text_frame
        tf.word_wrap = True
        
        # Quote in italic
        p = tf.paragraphs[0]
        run = p.add_run()
        run.text = f'"{quote["text"]}"'
        run.font.italic = True
        run.font.size = Pt(12)
        run.font.name = 'Aptos'
        
        if 'attribution' in quote:
            p2 = tf.add_paragraph()
            run2 = p2.add_run()
            run2.text = f"— {quote['attribution']}"
            run2.font.size = Pt(10)
            run2.font.color.rgb = RGBColor(0x53, 0x56, 0x5A)
            run2.font.name = 'Aptos'
```

---

## Key Statement Slides

### Bold Key Statement (template slide 39 pattern)

Use a green-background divider layout with large italic emphasis:

```python
def add_key_statement(slide_layout_idx=17):
    """Use a green gradient divider for key statements."""
    slide = prs.slides.add_slide(prs.slide_layouts[slide_layout_idx])
    for shape in slide.shapes:
        if hasattr(shape, 'placeholder_format'):
            shape.text = "Key insight statement with emphasis on critical words"
    return slide
```

---

## Text + Chart Split Layout

### Left Text, Right Chart (template slides 40, 42, 48 patterns)

```python
def add_text_chart_split(slide, text_content, chart_func):
    """
    Use a 2-column layout, fill left with text, right with chart.
    text_content: list of (text, level) tuples
    chart_func: function(slide, x, y, w, h) that adds a chart
    """
    # Fill left column placeholder with text
    for shape in slide.shapes:
        if hasattr(shape, 'placeholder_format'):
            idx = shape.placeholder_format.idx
            if idx == 10:  # Left column
                fill_content_placeholder(shape, text_content)
    
    # Add chart in right column area
    chart_func(slide, x=6.84, y=1.84, w=6.01, h=5.12)
```

---

## Stat Callouts

### Big Number KPI Cards

```python
def add_stat_callouts(slide, stats, y_start=2.0):
    """
    stats: list of dicts with 'number', 'label', optional 'trend'
    """
    num = len(stats)
    col_w = 12.33 / num
    
    for i, stat in enumerate(stats):
        x = 0.50 + i * col_w
        
        # Big number
        num_box = slide.shapes.add_textbox(
            Inches(x), Inches(y_start), Inches(col_w - 0.2), Inches(1.5)
        )
        p = num_box.text_frame.paragraphs[0]
        run = p.add_run()
        run.text = stat['number']
        run.font.size = Pt(48)
        run.font.bold = True
        run.font.color.rgb = hex_to_rgb('86BC25')
        run.font.name = 'Aptos'
        p.alignment = PP_ALIGN.CENTER
        
        # Label below
        label_box = slide.shapes.add_textbox(
            Inches(x), Inches(y_start + 1.5), Inches(col_w - 0.2), Inches(0.5)
        )
        lp = label_box.text_frame.paragraphs[0]
        lp.text = stat['label']
        lp.font.size = Pt(12)
        lp.font.name = 'Aptos'
        lp.alignment = PP_ALIGN.CENTER
```
