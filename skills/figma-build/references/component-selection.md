# Component Selection and Scavenging
## figma-build — Library-First Decision Discipline

Before writing any plugin code, survey what the library already provides and classify each needed element. Building from scratch is the last resort, not the default.

---

## The Decision Triage

Run this for every distinct element in the spec before touching the Plugin API.

| Tier | When to use | Action |
|---|---|---|
| **AS-IS** | Component matches the spec structurally and visually — only content differs | `sourceComp.createInstance()` — no detach |
| **Detach + modify** | Component is structurally close but needs layout changes, section removal, or content rewriting | `createInstance()` → `detachInstance()` → strip → modify |
| **Build from scratch** | Nothing in the library provides the structural shell | `figma.createFrame()` / `createAutoLayout()` |

Commit to the classification before writing the first script. Do not start building and decide mid-call.

---

## Scavenging: Finding the Pattern, Not the Name

The most reusable library component is often not the one named after what you need. Search by **visual structure and behavior**, not by label.

**How to scavenge:**

1. Identify the visual pattern you need — not the component name. Example: "gray inset pocket with a header and a 2-column data grid" — not "Card" or "Panel."
2. Search across all component categories in the library. Complex compound components (Popovers, Tiles, Page Headers) often contain sub-sections that are exactly the shell you need.
3. Inspect at multiple levels. A sub-frame inside a Popover record may be more useful than the Popover itself. A Record section's gray background at `rgb(243,243,243)` is the "gray pocket" — even though it's not named that anywhere in the library.
4. When a compound component contains your target structure, repurpose the whole component and strip what you don't need — it's faster than extracting the sub-frame.

**Scavenging precedent — Poalim popover (2026-07):**
- Needed: a gray inset pocket for customer financial data
- Searched for: "Box", "Well", "Panel", "Card with background" — found nothing standalone
- Found: the Record section inside `📝 Popover/Record preview` — gray `rgb(243,243,243)`, already containing a 2-col label+value grid
- Approach: repurposed the full Popover, stripped nubbins and unused sections, remapped the Record sections to the target content

---

## Repurpose Workflow

When a library component is structurally close but needs modification:

```javascript
// 1. Locate the source component in the library
const sourceComp = figma.getNodeById('SOURCE_COMPONENT_ID');

// 2. Create a fresh instance — never operate on a user-placed node
const inst = sourceComp.createInstance();
figma.currentPage.appendChild(inst);

// 3. Detach to get a mutable frame
const frame = inst.detachInstance();

// 4. Strip sections you don't need
frame.findOne(n => n.name === 'Section to remove')?.remove();

// 5. Modify remaining content
const title = figma.getNodeById('KNOWN_TEXT_NODE_ID');
title.characters = 'New content';
```

Strip before modifying. Less structure in scope = fewer compound ID resolution failures.

---

## The Operator-Placed-Node Rule

**A component the operator places on the canvas is never touched.**

When the operator places a component as a reference or example, it is a signal — not a working copy. Always derive the working copy independently:

```javascript
// WRONG — operates on the node the operator placed
const placed = figma.getNodeById('OPERATOR_PLACED_NODE_ID');
placed.detachInstance(); // ← destroys the reference

// CORRECT — leaves the operator's node intact
const sourceComp = figma.getNodeById('SOURCE_COMPONENT_ID');
const workingCopy = sourceComp.createInstance(); // fresh instance
figma.currentPage.appendChild(workingCopy);
const frame = workingCopy.detachInstance();      // operate on this
```

If you need to inspect the operator's node to understand its structure, read its IDs and children — do not mutate it. Treat it as read-only.

---

## Content Structure Principles

Principles derived from the Poalim popover iteration (2026-07). Apply to information-dense card or modal layouts.

**Narrative before contextual data.** Sections that explain *why* (criterion, rationale, action guidance) go above sections that show *who or what* (customer profile, financial data). The reader needs context before data.

```
✓  Why → Who          Criterion / Activity / Highlights → Customer Block
✗  Who → Why          Customer Block → Criterion / Activity / Highlights
```

**Unified pocket over split meta.** When a customer block and associated meta rows (calls made, last call date) both relate to the same entity, place them inside the same gray pocket — not as separate sections below it. One card = one entity's context.

**Section labels as lightweight structure.** A muted label + icon prefix (e.g. `⚡ Criterion — why this proposal was matched`) followed by value text is sufficient structure for content sections. A 2-column label/value grid is warranted only for tabular financial data where parallel comparison matters.

**Badge in the header row.** Domain or type badges sit in the header alongside the title — top-right (LTR) / top-left (RTL). Not as a standalone row below the title.
