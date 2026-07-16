# Stock Photo Library

Pre-approved photos bundled in `assets/photos/` for use on title slides, dividers, full-bleed backgrounds, and content accents. Each image is tagged by theme so the skill can select the best match for a given presentation topic.

## Catalog

| File | Tags | Description | Best For |
|------|------|-------------|----------|
| `GettyImages-1456548142.jpg` | `brand, motif, abstract, dark` | Glowing green swirl sphere on black background — brand circular motif | Title slides (dark theme), brand-forward dividers, cover imagery |
| `GettyImages-2216589222.jpg` | `collaboration, people, business, outdoor` | Man and woman reviewing tablet outside office buildings — authentic professional interaction | Collaboration slides, team intro, client engagement, about-us |
| `HBPTWX.jpg` | `telecom, 5G, network, technology` | 5G speedometer gauge showing wireless generation progression | Telecom industry, 5G/6G topics, network transformation, connectivity |
| `ind_tmt_glb_ho_2171.jpg` | `technology, control room, monitors, operations` | Operations control room with schematic wall display and monitor array | Technology operations, command centers, monitoring, infrastructure |
| `shutterstock_157885577.jpg` | `network, fiber, infrastructure, data center` | Fiber optic cables plugged into network switch — green and blue tones | Networking, data centers, infrastructure, connectivity, cloud |
| `shutterstock_382804891.jpg` | `finance, markets, data, trading` | Stock market data display with candlestick charts — blue tones | Financial services, market analysis, trading, fintech, data |
| `shutterstock_1538502440.jpg` | `data science, analytics, team, screens` | Team of analysts working at monitors with data visualizations | Data analytics, AI/ML, research teams, technology operations |
| `Technology_Hero_Image.JPG` | `individual, work, laptop, creative` | Woman working with laptop and tablet in bright office setting | Individual contributor, creative work, digital workplace, productivity |
| `GettyImages-1148091793.jpg` | `abstract, digital, network, futuristic` | Colorful digital light beams and particles — teal/cyan tones on dark | Digital transformation, innovation, futuristic tech, AI, cyber |

## Tag Reference

Use these tags to match images to presentation topics:

| Topic Area | Recommended Tags | Top Picks |
|------------|-----------------|-----------|
| **AI / Digital transformation** | `abstract, digital, futuristic, technology` | `GettyImages-1148091793.jpg`, `GettyImages-1456548142.jpg` |
| **Financial services / Markets** | `finance, markets, data, trading` | `shutterstock_382804891.jpg` |
| **Technology / TMT** | `technology, control room, monitors, network` | `ind_tmt_glb_ho_2171.jpg`, `shutterstock_157885577.jpg` |
| **Telecom / Connectivity** | `telecom, 5G, network, infrastructure` | `HBPTWX.jpg`, `shutterstock_157885577.jpg` |
| **Data & Analytics** | `data science, analytics, screens` | `shutterstock_1538502440.jpg` |
| **Collaboration / People** | `collaboration, people, business` | `GettyImages-2216589222.jpg` |
| **Productivity / Work** | `individual, work, laptop, creative` | `Technology_Hero_Image.JPG` |
| **Brand / Conceptual** | `brand, motif, abstract, dark` | `GettyImages-1456548142.jpg` |
| **General business** | `collaboration, business, people` | `GettyImages-2216589222.jpg`, `Technology_Hero_Image.JPG` |

## How to Use

### On Title Slides (Layout 0–12)

Title layouts have a picture placeholder at `idx=11` (6.06" circular area at x=6.52", y=0.76"). You can fill it directly:

```python
import os
from pptx.util import Inches

PHOTOS_DIR = 'path/to/skill/assets/photos'

slide = prs.slides.add_slide(prs.slide_layouts[6])  # Black title with tagline

# Fill the picture placeholder
for shape in slide.shapes:
    try:
        pf = shape.placeholder_format
        if pf and pf.idx == 11:  # Picture placeholder
            shape.insert_picture(os.path.join(PHOTOS_DIR, 'GettyImages-1456548142.jpg'))
            break
    except (ValueError, AttributeError):
        continue
```

### As Full-Bleed Backgrounds

Use layout 12 (full-bleed image title) or add manually to any slide. Add the image FIRST so content layers render on top:

```python
slide = prs.slides.add_slide(prs.slide_layouts[24])  # Title + subtitle

# Add photo as background (behind everything)
slide.shapes.add_picture(
    os.path.join(PHOTOS_DIR, 'GettyImages-1148091793.jpg'),
    Inches(0), Inches(0),
    width=Inches(13.33), height=Inches(7.50)
)

# Then add a semi-transparent overlay for text readability
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

overlay = slide.shapes.add_shape(
    MSO_SHAPE.RECTANGLE,
    Inches(0), Inches(0), Inches(13.33), Inches(7.50)
)
overlay.fill.solid()
overlay.fill.fore_color.rgb = RGBColor(0x00, 0x00, 0x00)
# Set transparency via the fill element
from pptx.oxml.ns import qn
solidFill = overlay.fill._fill
srgbClr = solidFill.find(qn('a:srgbClr'))
if srgbClr is not None:
    alpha = srgbClr.makeelement(qn('a:alpha'), {})
    alpha.set('val', '50000')  # 50% transparent
    srgbClr.append(alpha)
overlay.line.fill.background()

# Now add text on top — it will be readable against the darkened image
```

### As Half-Slide Images (Split Layout)

Place the image on one side, content on the other:

```python
# Right-side image with left-side content
slide.shapes.add_picture(
    os.path.join(PHOTOS_DIR, 'GettyImages-2216589222.jpg'),
    Inches(6.84), Inches(1.84),
    width=Inches(6.01), height=Inches(5.12)
)
# Add text content on the left side (x=0.5, w=6.0)
```

### On Divider Slides (Layout 22 — Full-Bleed Image Divider)

```python
slide = prs.slides.add_slide(prs.slide_layouts[22])  # Full-bleed image divider

for shape in slide.shapes:
    try:
        pf = shape.placeholder_format
        if pf and pf.idx == 11:  # Picture placeholder (full slide)
            shape.insert_picture(os.path.join(PHOTOS_DIR, 'shutterstock_382804891.jpg'))
        elif pf and pf.type == 1:  # Title
            shape.text = "Section Title"
    except (ValueError, AttributeError):
        continue
```

## Selection Guidelines

When choosing a photo for a slide, match by:

1. **Topic first** — use the tag reference table above
2. **Background type** — dark images (`GettyImages-1456548142.jpg`, `GettyImages-1148091793.jpg`, `shutterstock_382804891.jpg`) work best on dark-theme title slides; bright images (`GettyImages-2216589222.jpg`, `Technology_Hero_Image.JPG`) work on light themes
3. **Composition** — images with open space on one side (left or right) work well for half-slide layouts where text goes on the opposite side
4. **Don't repeat** — use each image at most once per deck to keep it visually fresh
