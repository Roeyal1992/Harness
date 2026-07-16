# Plugin Code Patterns
## figma-build — Reusable Figma Plugin API Scaffolds

Copy-paste starting points. Adapt colors, dimensions, and text to the project's design spec.
All patterns assume fonts are loaded and the correct page is active (see SKILL.md §1 pre-flight).

---

## Color Object Template

Define once per script. Replace values from the project's design spec.
All values are 0–1 range (not 0–255).

```javascript
const C = {
  // Surfaces
  bgScreen:    { r: 0.953, g: 0.953, b: 0.961 }, // light gray screen background
  white:       { r: 1,     g: 1,     b: 1     },
  // Navigation bars
  navDark:     { r: 0.133, g: 0.173, b: 0.278 }, // status bar / dark header
  navMid:      { r: 0.176, g: 0.220, b: 0.345 }, // secondary header bar
  // Text
  textPrimary: { r: 0.133, g: 0.133, b: 0.165 },
  textSecondary:{ r: 0.50, g: 0.50,  b: 0.55  },
  textOnDark:  { r: 1,     g: 1,     b: 1     },
  // Interactive
  blue:        { r: 0.086, g: 0.463, b: 0.949 }, // primary / selected state
  red:         { r: 0.85,  g: 0.22,  b: 0.22  }, // error / destructive
  // Structure
  borderGray:  { r: 0.70,  g: 0.70,  b: 0.73  },
  divider:     { r: 0.90,  g: 0.90,  b: 0.92  },
  colHeaderBg: { r: 0.94,  g: 0.94,  b: 0.96  },
};
```

---

## mkText Helper

```javascript
function mkText(chars, size, style, color, align) {
  // style: 'Regular' | 'Medium' | 'Bold' (must match loaded font)
  // align: 'LEFT' | 'CENTER' | 'RIGHT'
  const t = figma.createText();
  t.fontName = { family: 'Rubik', style };
  t.fontSize = size;
  t.characters = chars;
  t.fills = [{ type: 'SOLID', color }];
  t.textAlignHorizontal = align || 'RIGHT';
  t.textAutoResize = 'HEIGHT';
  return t;
}
```

For wrapping text (multi-line), set an explicit width before appending:
```javascript
const t = mkText('long text...', 14, 'Regular', C.textSecondary, 'RIGHT');
t.resize(256, 10); // width fixed; height auto via textAutoResize='HEIGHT'
```

---

## Wrapper / Scrim / Modal Overlay

Protocol anatomy: wrapper (no auto-layout) → bg content → scrim → modal card (absolute).

```javascript
// ── Wrapper (full screen frame, no auto-layout) ──
const wrapper = figma.createFrame();
wrapper.name = 'ScreenName';
wrapper.resize(320, 560);       // adjust height to content
wrapper.clipsContent = true;
wrapper.fills = [{ type: 'SOLID', color: C.bgScreen }];
parentSection.appendChild(wrapper);
wrapper.x = /* canvas x */; wrapper.y = /* canvas y */;

// ── Status bar ──
const statusBar = figma.createFrame();
statusBar.name = 'StatusBar';
statusBar.resize(320, 44);
statusBar.fills = [{ type: 'SOLID', color: C.navDark }];
wrapper.appendChild(statusBar);
// add time text etc. inside statusBar

// ── Header bar ──
const hdr = figma.createFrame();
hdr.name = 'Header';
hdr.resize(320, 56);
hdr.fills = [{ type: 'SOLID', color: C.navMid }];
wrapper.appendChild(hdr);
hdr.x = 0; hdr.y = 44;
// add title + nav actions inside hdr

// ── Background content (below header, y=100) ──
const contentBg = figma.createFrame();
contentBg.name = 'bg-content';
contentBg.resize(320, 460);      // 560 - 100 header
contentBg.fills = [{ type: 'SOLID', color: C.bgScreen }];
wrapper.appendChild(contentBg);
contentBg.x = 0; contentBg.y = 100;

// ── Scrim (covers content area only, not header) ──
const scrim = figma.createFrame();
scrim.name = 'scrim';
scrim.resize(320, 460);
scrim.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.42 }];
wrapper.appendChild(scrim);
scrim.x = 0; scrim.y = 100;

// ── Modal card (auto-layout VERTICAL, 288px, absolute on wrapper) ──
const modal = figma.createAutoLayout('VERTICAL');
modal.name = 'ModalCard';
modal.fills = [{ type: 'SOLID', color: C.white }];
modal.cornerRadius = 12;
modal.paddingTop = 44;          // space for absolute × button
modal.paddingBottom = 20;
modal.paddingLeft = 16;
modal.paddingRight = 16;
modal.itemSpacing = 6;
modal.resize(288, 200);         // width FIXED; height becomes AUTO after next lines
modal.primaryAxisSizingMode = 'AUTO';
modal.counterAxisSizingMode = 'FIXED';
modal.effects = [{
  type: 'DROP_SHADOW',
  color: { r: 0, g: 0, b: 0, a: 0.18 },
  offset: { x: 0, y: 4 },
  radius: 16, spread: 0,
  visible: true, blendMode: 'NORMAL'
}];
wrapper.appendChild(modal);
modal.x = 16;   // (320 - 288) / 2
modal.y = 96;   // just below header
```

---

## Absolute × Close Button

Always top-LEFT in modals/dialogs (RTL convention).
Place immediately after `wrapper.appendChild(modal)`.

```javascript
const closeBtn = mkText('×', 20, 'Regular', C.textPrimary, 'LEFT');
closeBtn.resize(24, 24);
modal.appendChild(closeBtn);
closeBtn.layoutPositioning = 'ABSOLUTE'; // works because modal has auto-layout
closeBtn.x = 10;
closeBtn.y = 10;
```

---

## Radio Row (RTL)

RTL layout: label fills width (right-aligned text), radio circle fixed at the rightmost edge (reading start).
Append label first (leftmost visual), circle last (rightmost visual).

```javascript
function makeRadioRow(labelText, isSelected, rowWidth) {
  rowWidth = rowWidth || 256; // typically modal inner width (288 - 32 padding)

  const row = figma.createAutoLayout('HORIZONTAL');
  row.name = 'RadioRow: ' + labelText;
  row.counterAxisAlignItems = 'CENTER';
  row.itemSpacing = 10;
  row.fills = [];
  row.paddingTop = 6; row.paddingBottom = 6;
  row.resize(rowWidth, 32);
  row.primaryAxisSizingMode = 'FIXED';
  row.counterAxisSizingMode = 'AUTO';

  // Label — FILL (set AFTER appendChild)
  const label = mkText(labelText, 14, 'Regular', C.textPrimary, 'RIGHT');
  row.appendChild(label);
  label.layoutSizingHorizontal = 'FILL';

  // Radio circle — FIXED 20×20, rightmost
  const circle = figma.createEllipse();
  circle.resize(20, 20);
  circle.fills    = isSelected ? [{ type: 'SOLID', color: C.blue }] : [];
  circle.strokes  = [{ type: 'SOLID', color: isSelected ? C.blue : C.borderGray }];
  circle.strokeWeight = 2;
  row.appendChild(circle);
  circle.layoutSizingHorizontal = 'FIXED';
  circle.layoutSizingVertical   = 'FIXED';

  return row;
}

// After appending row to its parent, set it to FILL:
modal.appendChild(row);
row.layoutSizingHorizontal = 'FILL';
```

---

## Column Table Row (RTL)

RTL column order: rightmost = primary identifier, leftmost = secondary/status.
Append columns in visual left→right order (leftmost first).

```javascript
// Example: 4-column contact row (status | phone | name | radio)
// Total inner width = 256px (288 modal - 32 padding)
// Widths: status=68 | phone=68 | name=FILL | radio=20 | gaps=8×3=24 → 180+FILL=256

const contactRow = figma.createAutoLayout('HORIZONTAL');
contactRow.name = 'ContactRow';
contactRow.counterAxisAlignItems = 'CENTER';
contactRow.itemSpacing = 8;
contactRow.paddingTop = 8; contactRow.paddingBottom = 8;
contactRow.fills = [];
contactRow.resize(256, 36);
contactRow.primaryAxisSizingMode = 'FIXED';
contactRow.counterAxisSizingMode = 'AUTO';

// Status (leftmost, use C.red for error/invalid states)
const statusT = mkText('...invalid', 14, 'Regular', C.red, 'RIGHT');
statusT.resize(68, 10);
contactRow.appendChild(statusT);
statusT.layoutSizingHorizontal = 'FIXED';

// Phone
const phoneT = mkText('...34447', 14, 'Regular', C.textPrimary, 'RIGHT');
phoneT.resize(68, 10);
contactRow.appendChild(phoneT);
phoneT.layoutSizingHorizontal = 'FIXED';

// Name — FILL (set AFTER appendChild)
const nameT = mkText('אייתמר...', 14, 'Regular', C.textPrimary, 'RIGHT');
nameT.resize(80, 10);
contactRow.appendChild(nameT);
nameT.layoutSizingHorizontal = 'FILL';

// Radio (rightmost — RTL selection start)
const radio = figma.createEllipse();
radio.resize(20, 20);
radio.fills = []; radio.strokes = [{ type: 'SOLID', color: C.borderGray }];
radio.strokeWeight = 2;
contactRow.appendChild(radio);
radio.layoutSizingHorizontal = 'FIXED';
radio.layoutSizingVertical   = 'FIXED';

// Append row to parent, then set FILL
modal.appendChild(contactRow);
contactRow.layoutSizingHorizontal = 'FILL';
```

---

## Column Header / Filter Row

Mirrors the column widths of the table row above it.
Append spacer last to align with the table row's radio column.

```javascript
const filterRow = figma.createAutoLayout('HORIZONTAL');
filterRow.name = 'FilterRow';
filterRow.counterAxisAlignItems = 'CENTER';
filterRow.itemSpacing = 8;
filterRow.paddingTop = 6; filterRow.paddingBottom = 6;
filterRow.fills = [{ type: 'SOLID', color: C.colHeaderBg }];
filterRow.cornerRadius = 6;
filterRow.resize(256, 32);
filterRow.primaryAxisSizingMode = 'FIXED';
filterRow.counterAxisSizingMode = 'AUTO';

function mkColHeader(label, w) {
  const chip = figma.createAutoLayout('HORIZONTAL');
  chip.primaryAxisAlignItems = 'CENTER';
  chip.counterAxisAlignItems = 'CENTER';
  chip.fills = [];
  chip.resize(w, 20);
  chip.primaryAxisSizingMode = 'FIXED';
  chip.counterAxisSizingMode = 'AUTO';
  const t = mkText(label + ' ∨', 14, 'Regular', C.textPrimary, 'CENTER');
  chip.appendChild(t);
  t.layoutSizingHorizontal = 'FILL';
  return chip;
}

// Match widths to the data columns (left→right)
filterRow.appendChild(mkColHeader('col1', 68));   // matches status col
filterRow.appendChild(mkColHeader('col2', 68));   // matches phone col
const nameHeader = mkColHeader('col3', 10);       // name col — FILL
filterRow.appendChild(nameHeader);
nameHeader.layoutSizingHorizontal = 'FILL';

// Spacer for radio column (no header text)
const radioSpacer = figma.createFrame();
radioSpacer.resize(20, 20);
radioSpacer.fills = [];
filterRow.appendChild(radioSpacer);
radioSpacer.layoutSizingHorizontal = 'FIXED';

// Append to parent, then set FILL
modal.appendChild(filterRow);
filterRow.layoutSizingHorizontal = 'FILL';
```

---

## Divider Line

```javascript
const divider = figma.createFrame();
divider.name = 'divider';
divider.resize(256, 1);
divider.fills = [{ type: 'SOLID', color: C.divider }];
modal.appendChild(divider);
divider.layoutSizingHorizontal = 'FILL';
```
