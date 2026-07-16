---
name: figma-procedures
description: "Step-by-step operational playbooks for FigJam board setup and maintenance. Load when executing a specific operation."
---

# FigJam Procedures

## Procedure: Board Inspection

Always run a read-only inspection before making any changes.

```js
const pages = figma.root.children.map(p => ({
  id: p.id, name: p.name, childCount: p.children.length
}));
return { editorType: figma.editorType, pages };
```

To inspect a specific page's content:

```js
const page = figma.root.children.find(p => p.name === 'PageName');
await figma.setCurrentPageAsync(page);
const nodes = page.children.map(n => ({
  id: n.id, name: n.name, type: n.type,
  x: Math.round(n.x), y: Math.round(n.y),
  width: Math.round(n.width), height: Math.round(n.height)
}));
const screenshot = await page.screenshot();
return { childCount: page.children.length, nodes };
```

---

## Procedure: Page Setup

**Rename existing pages** to match domain names. No page switch required — page names can be set directly:

```js
figma.root.children[0].name = 'Domain Name';
figma.root.children[1].name = 'Another Domain';
// etc.
return figma.root.children.map(p => ({ id: p.id, name: p.name }));
```

**Adding pages:** `figma.createPage()` is blocked in FigJam. Ask the operator to add new pages manually in the FigJam UI, then rename them via the API.

---

## Procedure: Migrate Rectangle Groups to Sections

Use when a flowchart or layout uses bare rectangles as zone boundaries.

**Step 1 — Inspect and identify zone rectangles**

Run a board inspection (above). Identify rectangles acting as zone containers by their size, position, and proximity to other content nodes.

**Step 2 — Create sections matching the rectangle bounds**

```js
const page = figma.root.children.find(p => p.name === 'PageName');
await figma.setCurrentPageAsync(page);

const rect = await figma.getNodeByIdAsync('rect-node-id');
const section = figma.createSection();
section.name = 'Full Zone Label';
section.x = rect.x;
section.y = rect.y;
section.resizeWithoutConstraints(rect.width, rect.height);
section.fills = JSON.parse(JSON.stringify(rect.fills)); // preserve zone color
page.appendChild(section);

return { sectionId: section.id };
```

Create all sections before moving any nodes.

**Step 3 — Move nodes into their sections**

```js
const section = await figma.getNodeByIdAsync('section-id');
const node = await figma.getNodeByIdAsync('node-id');
section.appendChild(node);
```

**Critical:** `appendChild` in FigJam does NOT auto-adjust coordinates. After append, `node.x/y` remains whatever it was before — now interpreted as section-local. The node renders at `section.pageAbsX + node.x, section.pageAbsY + node.y`, which places it far outside the section background unless you adjust manually (Step 3b).

Move content nodes (shapes, text). Leave cross-zone connectors at the page level (see Standards).

**Step 3b — Adjust node coordinates to section-local space**

After appending, each node's coordinates must be offset by the section's page-absolute position:

```js
// section is inside an outer container (e.g. another section or frame)
const outerX = outerContainer.x;  // page-absolute x of outer container
const outerY = outerContainer.y;  // page-absolute y of outer container
const sectionPageX = outerX + section.x;
const sectionPageY = outerY + section.y;

// Also add visual padding (40px top for section title bar, 30px elsewhere)
const PAD_TOP = 40;
const PAD_SIDE = 30;

// Determine min x/y across all children (their pre-append page positions)
const minX = Math.min(...section.children.map(c => c.x));
const minY = Math.min(...section.children.map(c => c.y));

for (const child of section.children) {
  child.x = (child.x - minX) + PAD_SIDE;
  child.y = (child.y - minY) + PAD_TOP;
}
```

Then resize the section to contain the repositioned content:

```js
const maxRight = Math.max(...section.children.map(c => c.x + c.width));
const maxBottom = Math.max(...section.children.map(c => c.y + c.height));
section.resizeWithoutConstraints(maxRight + PAD_SIDE, maxBottom + PAD_SIDE);
```

**Step 4 — Remove old rectangles and floating text labels**

```js
const toRemove = ['rect-id', 'label-text-id'];
for (const id of toRemove) {
  const node = await figma.getNodeByIdAsync(id);
  if (node) node.remove();
}
```

The section name replaces the floating text label. Remove the label after confirming the section is named correctly.

**Step 5 — Verify**

```js
const screenshot = await page.screenshot();
return { pageChildCount: page.children.length };
```

---

## Utility Functions

These are the programmatic equivalents of two FigJam UI shortcuts that do the same job in the browser:

| UI shortcut | What it does | API equivalent |
|---|---|---|
| **Ctrl+S** (with nodes selected) | Creates a section perfectly fitted to the selected nodes, moves them in, adjusts coordinates | `createSectionFromNodes()` below |
| **Double-click a section corner** | Auto-resizes the section to exactly fit its current children | `autoFitSection()` below |

The UI shortcuts handle coordinate adjustment automatically. The API does not — hence these utilities.

---

### `createSectionFromNodes` — API equivalent of Ctrl+S

Creates a new section sized to the bounding box of the given nodes, moves them in, and adjusts their coordinates to correct section-local space. Equivalent to selecting the nodes and pressing Ctrl+S.

```js
function createSectionFromNodes(nodes, name, fillColor, parent, PAD_TOP = 40, PAD_SIDE = 30) {
  // 1. Compute bounding box in parent coordinate space
  const minX = Math.min(...nodes.map(n => n.x));
  const minY = Math.min(...nodes.map(n => n.y));
  const maxRight  = Math.max(...nodes.map(n => n.x + n.width));
  const maxBottom = Math.max(...nodes.map(n => n.y + n.height));

  // 2. Create section at that bounding box with padding
  const section = figma.createSection();
  section.name = name;
  section.x = minX - PAD_SIDE;
  section.y = minY - PAD_TOP;
  section.resizeWithoutConstraints(
    (maxRight  - minX) + PAD_SIDE * 2,
    (maxBottom - minY) + PAD_TOP + PAD_SIDE
  );
  if (fillColor) section.fills = [{ type: 'SOLID', color: fillColor, opacity: 0.12 }];
  parent.appendChild(section);

  // 3. Move nodes in — appendChild does NOT auto-adjust coordinates
  for (const node of nodes) {
    section.appendChild(node);
  }

  // 4. Manually correct to section-local space
  // After append, node.x/y still hold pre-append parent values; subtract section position to get local
  for (const node of section.children) {
    node.x = (node.x - minX) + PAD_SIDE;
    node.y = (node.y - minY) + PAD_TOP;
  }

  return section;
}
```

---

### `autoFitSection` — API equivalent of double-click corner

Resizes an existing section to exactly fit its current children. Equivalent to double-clicking any corner (except top-left) in the FigJam UI.

**Use after children are already at correct section-local coordinates.**

```js
function autoFitSection(section, PAD_TOP = 40, PAD_SIDE = 30) {
  if (section.children.length === 0) return;
  const maxRight  = Math.max(...section.children.map(c => c.x + c.width));
  const maxBottom = Math.max(...section.children.map(c => c.y + c.height));
  section.resizeWithoutConstraints(maxRight + PAD_SIDE, maxBottom + PAD_SIDE);
}
```

**Note on top-left corner:** The UI's top-left double-click is unreliable (as observed by the operator). The API has the same asymmetry — resizing from the top-left would require shifting all children's y coordinates. `autoFitSection` resizes from the bottom-right only (grows downward and rightward), which is the reliable direction.

---

## API Reference: FigJam Constraints

| Operation | Available | Notes |
|---|---|---|
| `section.appendChild(node)` | ✓ | Works, but does NOT auto-adjust coordinates — node.x/y is kept as-is and interpreted as section-local. Manual offset required (see Step 3b). |
| `figma.createSection()` | ✓ | Works in FigJam |
| `figma.createRectangle()` | ✓ | Works in FigJam |
| `figma.createShapeWithText()` | ✓ | FigJam-native — shape with embedded text node |
| `figma.createText()` | ✓ | Works in FigJam |
| `figma.createPage()` | ✗ | Design files only — blocked in FigJam (`figma.com/board/`) |
| `figma.currentPage = page` | ✗ | Sync setter throws — use `await figma.setCurrentPageAsync(page)` |
| `figma.notify()` | ✗ | Not implemented — use `return` for output |

**Editor type detection** — derive from the URL:
- `figma.com/board/...` → FigJam (`editorType: "figjam"`)
- `figma.com/design/...` → Design (`editorType: "figma"`)
