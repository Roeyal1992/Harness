---
name: figma-standards
description: "Durable conventions and decisions for FigJam board structure, naming, and grouping. Load before making any structural decision on a board."
---

# FigJam Collaboration Standards

## Board Role

FigJam boards are the visual collaboration portal — the shared working surface for ideation, user journey mapping, flowcharting, and domain-level coordination across projects. They are infrastructure, not deliverables.

---

## Page Structure

**One page per domain.** Each domain in a project gets its own dedicated page, named exactly after the domain.

Page names are singular, match the project's domain vocabulary exactly, and are set in the project's working language.

**Example — Poalim project (channel domains):**
- Matab
- Retail
- Sales
- Mortgages

Do not create sub-pages, numbered variants, or duplicate a domain across pages.

**Constraint:** `figma.createPage()` is blocked in FigJam. New pages must be added manually in the FigJam UI. The AI can rename existing pages via the Plugin API, but cannot create them programmatically.

---

## Grouping: Sections Over Rectangles

**Always use FigJam Sections to group related content — never bare rectangles.**

| Pattern | Status | Reason |
|---|---|---|
| FigJam Section | ✓ Correct | Native container; nodes are structurally parented inside it; carries a title label; recognized by FigJam navigation |
| Rectangle as group boundary | ✗ Incorrect | Visual overlap only; no structural relationship between rectangle and the nodes it appears to contain; no title; FigJam-unaware |

A rectangle drawn around nodes looks like a group but is not one. Sections are semantic containers — content placed inside is actually parented to the section in the node hierarchy.

When auditing a board and finding rectangles used as zone boundaries, migrate them to sections. See `procedures.md`.

---

## Section Naming

Section names should be full, descriptive labels — not codes or abbreviations.

- ✓ `אזור 1 — מסע המשתמש (ציר ראשי)`
- ✗ `Zone 1`

The section name replaces any floating text label that previously served as the zone title. Remove the text label after creating the section.

---

## Connectors

Connectors that span section boundaries belong at the page level — not inside either section. FigJam connectors reference nodes by ID and render correctly regardless of whether the endpoint nodes are inside sections or on the canvas root.

Move intra-section connectors (those connecting nodes entirely within one section) inside that section. Leave cross-section connectors at the page level.

**Do not move existing page-level connectors into a section via `appendChild`.** This recalculates their bounding box in the section's coordinate space and can stretch the section to thousands of pixels. If connectors need to live inside a section, delete them and recreate them with `section.appendChild(connector)` from the start.

---

## Plugin API: Page Management

**Always confirm the active page before creating content.** `figma.currentPage` defaults to whichever page the plugin context last used — it is not guaranteed to be the page the user is viewing. Failing to check this is the most common cause of content appearing on the wrong page.

**Pattern — switch to target page:**
```javascript
const targetPage = figma.root.children.find(p => p.name === 'Mortgages');
await figma.setCurrentPageAsync(targetPage);
// now create content
```

**Never use `figma.currentPage = page`.** Synchronous assignment is not supported and throws. Always use `await figma.setCurrentPageAsync(page)`.

---

## Coordinate System

**Get canvas-level coordinates from the canvas, not from the node directly.**

`get_figjam` called on a child node (e.g. a section) can return coordinates in a different reference frame than `get_figjam` called on the parent canvas. When you need the true canvas position of a node — to place something next to it — query the parent canvas node and read the coordinates from there.

```
✓ get_figjam(canvasNodeId)  →  section at x=374, y=2777   ← use this for placement
✗ get_figjam(sectionNodeId) →  section at x=128, y=2960   ← reference frame unclear
```

When creating a node next to an existing one, always derive the placement offset from the canvas-level query.

**Use `absoluteTransform` for runtime position checks.** Inside a plugin script, `node.absoluteTransform[0][2]` and `node.absoluteTransform[1][2]` give the true canvas X and Y regardless of parent nesting.

---

## Section Coordinate System

After `section.appendChild(node)`, `node.x` and `node.y` are relative to the section — not the canvas. Set positions after appending, not before, to avoid confusion:

```javascript
section.appendChild(node);
node.x = relativeX;   // relative to section origin
node.y = relativeY;
```

Do not add `section.x` and `section.y` to these values — the section handles the offset automatically.

---

## Verification After Creation

After creating content programmatically, always screenshot the **parent canvas node** (not just the section) to confirm placement relative to the rest of the board. A section screenshot only shows what is structurally inside that section — connectors at the page level and sibling sections will not appear in it.
