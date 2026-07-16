# RTL in Figma (and FigJam)

> Read [`SKILL.md`](../SKILL.md) for the core RTL principles before this file.

---

## The Key Insight: HUG-Width Nodes Ignore `textAlignHorizontal`

When a text node is set to **HUG** width (sized to its content), there is no internal space for text alignment to have a visual effect — the node is exactly as wide as its text. Visual position is controlled entirely by the **parent frame's alignment properties**, not by the text node itself.

Setting `textAlignHorizontal = 'RIGHT'` on a HUG text node does nothing visible. The fix is always on the parent frame.

For text nodes that should right-align within a VERTICAL auto-layout frame, **promote them to FILL** so `textAlignHorizontal` takes effect:

```js
for (const t of node.findAll(n => n.type === 'TEXT')) {
  const p = t.parent;
  if (!p || p.type !== 'FRAME' || p.layoutMode !== 'VERTICAL') continue;
  t.layoutSizingHorizontal = 'FILL';
  t.textAutoResize = 'HEIGHT';  // required alongside FILL so text wraps instead of truncating
  t.textAlignHorizontal = 'RIGHT';
}
```

Do not apply this to text nodes inside HORIZONTAL frames — their visual position is controlled by the frame, not their own width.

---

## VERTICAL Auto-Layout Frames

Children in a `VERTICAL` auto-layout frame are positioned horizontally by `counterAxisAlignItems`.

| Value | Children land at |
|---|---|
| `'MIN'` (Figma default) | Left edge — **wrong for RTL** |
| `'CENTER'` | Center — keep if intentional |
| `'MAX'` | Right edge — **correct for Hebrew/Arabic** |

Set `counterAxisAlignItems = 'MAX'` on all VERTICAL auto-layout frames, unless explicitly center-aligned by design.

```js
const vertFrames = node.findAll(n =>
  n.type === 'FRAME' && n.layoutMode === 'VERTICAL'
);
for (const f of vertFrames) {
  if (f.counterAxisAlignItems === 'MIN') {
    f.counterAxisAlignItems = 'MAX';
  }
}
```

---

## HORIZONTAL Auto-Layout Frames

Element order in a HORIZONTAL frame encodes reading direction. In Hebrew, the first-read element must sit at the right edge. Since Figma renders children left-to-right in canvas order, **the last child appended is the rightmost**.

**When building from scratch:** append the most-important (first-read in Hebrew) element last.

**When converting LTR to RTL:** reverse the child order.

```js
const children = [...node.children];
for (const child of children) node.insertChild(0, child);
```

Also check `primaryAxisAlignItems`: if set to `'MIN'`, set to `'MAX'` so content groups from the right edge rather than the left.

For `SPACE_BETWEEN` rows (two groups at opposite edges): position 0 (leftmost) = last thing read in Hebrew (typically action buttons), position 1 (rightmost) = first thing read (typically primary content or label).

---

## Canvas Append Order Encodes RTL

When building rows with fixed-width cells, append in canvas left-to-right order — but design the sequence so the Hebrew first-read element is **appended last** (lands rightmost).

```
// Example: mortgage calculator track row
// Canvas append order:   [action] [payment] [rate] [margin] [amount] [track-name]
// Hebrew reading order:  track-name | amount | margin | rate | payment | action
// → append track-name last so it sits at the right (Hebrew first-read)
```

---

## `textAlignHorizontal` (FILL-Width and Multi-Line Text)

For text nodes that are already **FILL** width or wrap across multiple lines, `textAlignHorizontal` does affect appearance. Set to `'RIGHT'` unless the text is intentionally centered.

```js
const allText = node.findAll(n => n.type === 'TEXT');
for (const t of allText) {
  const p = t.parent;
  const isCenter = p && p.type === 'FRAME'
    && p.layoutMode === 'HORIZONTAL'
    && p.primaryAxisAlignItems === 'CENTER';
  t.textAlignHorizontal = isCenter ? 'CENTER' : 'RIGHT';
}
```

**`textAutoResize` must be set alongside FILL.** When you promote a HUG text node to FILL, also set `textAutoResize = 'HEIGHT'`. Without it, the node width fills but the height stays fixed and text clips instead of wrapping.

---

## Directional Icons

Flip icons that imply a reading direction — arrows, chevrons, breadcrumb separators, carets — horizontally.

- Chevrons: `>` becomes `<` (collapsed state); `v` stays (expanded/down state)
- Arrows pointing left/right: flip horizontally
- Breadcrumb separators: flip horizontally

Do not flip: Close (×), plus (+), checkboxes, status indicators, brand logos.

```js
icon.rescale(-1, 1); // horizontal mirror
// Or if rescale isn't available, apply scaleX on the transform matrix
```

---

## Font

**For new screens:** use **Rubik** — it covers the Hebrew Unicode range with correct optical weight. Inter and other Latin-primary fonts will render Hebrew but lack the tuning.

**For existing project files:** check what Hebrew fonts are already loaded before defaulting to Rubik. The project may use a different Hebrew font (e.g. IBM Plex Sans Hebrew, Noto Sans Hebrew) and switching to Rubik will break the visual system.

```js
const available = await figma.listAvailableFontsAsync();
const hebrewFonts = available.filter(f =>
  ['Rubik', 'IBM Plex Sans Hebrew', 'Noto Sans Hebrew', 'Frank Ruhl Libre'].includes(f.fontName.family)
);
// Use hebrewFonts[0].fontName.family if a match is found, else fall back to 'Rubik'
```

Pre-load all variants you plan to use before touching any text node:

```js
await figma.loadFontAsync({ family: 'Rubik', style: 'Regular' });
await figma.loadFontAsync({ family: 'Rubik', style: 'Medium' });
await figma.loadFontAsync({ family: 'Rubik', style: 'SemiBold' });
await figma.loadFontAsync({ family: 'Rubik', style: 'Bold' });
```

When applying to existing text nodes, preserve the original weight — map the source font style to the nearest equivalent rather than resetting everything to Regular.

---

## Converting a Clone: Normalize Fonts Before Appending

When cloning a frame that contains text using non-loadable fonts (Tahoma, Arial, Segoe UI), normalize all text nodes to Inter before appending to the page:

```js
const clone = sourceFrame.clone();
const allText = clone.findAll(n => n.type === 'TEXT');
for (const t of allText) {
  try {
    const fn = t.fontName === figma.mixed ? null : t.fontName;
    if (!fn || fn.family !== 'Inter') {
      const style = fn
        ? (fn.style.toLowerCase().includes('semi') ? 'Semi Bold'
           : fn.style.toLowerCase().includes('bold') ? 'Bold'
           : 'Regular')
        : 'Regular';
      t.fontName = { family: 'Inter', style };
    }
  } catch(e) {
    try { t.fontName = { family: 'Inter', style: 'Regular' }; } catch(_) {}
  }
}
figma.currentPage.appendChild(clone); // safe now
```

---

## Conversion Workflow: LTR Component → Hebrew RTL

Use this procedure when converting an existing Figma component or frame to Hebrew RTL in place (not building from scratch).

### 1. View the thumbnail first

Read the selected layer's thumbnail to understand the visual structure before writing any code. Do not skip this — the structure determines the detach and reorder strategy.

### 2. Detach all instances (top-down)

Detach in top-down order — parent before children. Detaching a parent reassigns new IDs to all its children; a bottom-up pass will fail with "node not found" errors on those now-stale IDs. Detach before any child reordering — Figma blocks `insertChild` inside instances.

```js
async function detachTopDown(node) {
  if (node.type === 'INSTANCE') {
    node = node.detachInstance();
  }
  if ('children' in node) {
    for (const child of [...node.children]) {
      await detachTopDown(child);
    }
  }
}
await detachTopDown(rootNode);
```

### 3. Build a translation map

Ask the user for specific translations if not provided, or infer from visible text. Common UI strings:

| English | Hebrew |
|---|---|
| Save | שמירה |
| Cancel | ביטול |
| Delete | מחיקה |
| Edit | עריכה |
| Search... | חיפוש... |
| Name | שם |
| Account Name | שם חשבון |
| Plain text | טקסט רגיל |
| Row label | תווית שורה |

### 4. Apply translations, Rubik font, and alignment

For each TEXT node:
- Load the node's existing font before modifying `characters`
- Replace matched strings using the translation map
- Set `fontName` to `{ family: 'Rubik', style }` — preserve the weight
- Set `textAlignHorizontal = 'RIGHT'` unless already `'CENTER'`

### 5. Apply RTL layout rules

Run the HORIZONTAL child reversal, VERTICAL `counterAxisAlignItems = 'MAX'`, and icon flips from the sections above.

### 6. Verify child order and visual output

**Batch layout property changes can silently reorder children.** Figma's auto-layout engine occasionally moves nodes in the z-order when layout properties (especially `counterAxisAlignItems`) are mutated in a `findAll` loop. After applying batch RTL fixes, read the parent frame's child order and compare it against the expected sequence.

```js
// Verify and restore order after batch fixes
const expected = ['nodeId-title', 'nodeId-tag', 'nodeId-block', ...]; // known correct order
const actual = parentFrame.children.map(c => c.id);
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  for (let i = 0; i < expected.length; i++) {
    const node = parentFrame.findOne(n => n.id === expected[i]);
    if (node) parentFrame.insertChild(i, node);
  }
}
```

Then take a screenshot and review. Action buttons at the left edge is correct — not a bug.

---

## Checklist

- [ ] All VERTICAL auto-layout frames: `counterAxisAlignItems = 'MAX'` (unless center)
- [ ] All HORIZONTAL auto-layout frames: child order reflects Hebrew reading direction
- [ ] HORIZONTAL frames: `primaryAxisAlignItems` not stuck at `'MIN'`
- [ ] HUG text nodes in VERTICAL frames: promoted to FILL + `textAutoResize = 'HEIGHT'`
- [ ] FILL-width and multi-line text: `textAlignHorizontal = 'RIGHT'` (unless center)
- [ ] Child order verified after batch layout property changes — reorder if scrambled
- [ ] Directional icons flipped horizontally
- [ ] Hebrew font confirmed: check available fonts in the file before defaulting to Rubik
- [ ] Action buttons sit at the **left edge** of their container
- [ ] If cloning: fonts normalized before `appendChild`
- [ ] If converting: instances detached top-down before any reordering
