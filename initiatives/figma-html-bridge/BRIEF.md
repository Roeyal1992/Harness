# Figma ↔ HTML Teleport
## A cheap, lossless bridge for component round-trips between Claude Code and Figma

**Status:** Scoping
**Origin:** Observed token waste during Claude Code + Figma hybrid workflow (2026-07-02)

---

## 1. The Problem

When you iterate on the same UI component in both Claude Code (HTML/CSS) and Figma, every transfer between the two environments is expensive. The AI re-derives the mapping between CSS properties and Figma node properties from scratch — inspecting, reasoning, scripting, debugging, screenshotting — burning thousands of tokens on decisions that are identical every time.

`border-radius: 4px` always means `cornerRadius = 4`. There is nothing to reason about.

---

## 2. The Mental Model

The component is not "an HTML file" or "a Figma frame." It is **one thing** that lives in two editing surfaces:

```
┌──────────────────┐         teleport         ┌──────────────────┐
│   Claude Code    │  ────── push ──────────→  │      Figma       │
│                  │  ←───── pull ───────────  │                  │
│  Structure       │                           │  Visual tuning   │
│  Data binding    │                           │  Spacing/type    │
│  Logic           │                           │  Stakeholder     │
│  Rapid iteration │                           │  review          │
└──────────────────┘                           └──────────────────┘
```

You work here, push to Figma, refine there, pull back. Like `git push` / `git pull` — not export/import. The component's identity survives the round trip.

**The teleport should be nearly free.** The mapping between HTML/CSS and Figma's node model is finite, deterministic, and mechanical. An AI should never spend tokens on it.

---

## 3. Why It's Currently Expensive

A typical AI-driven transfer follows this loop, repeated per element:

1. Read the source representation (HTML or Figma node tree)
2. **Reason** about the equivalent in the target representation — this is the waste
3. Write the translation (Plugin API script or HTML)
4. Execute
5. Screenshot / verify
6. Debug mismatches, repeat 3–5

Steps 2, 5, and 6 are where the tokens burn. A correct, codified mapping eliminates all three.

### Real examples of wasted reasoning

| What the AI did | What a converter would do | Tokens saved |
|-----------------|--------------------------|-------------|
| "This div has `display: flex; flex-direction: column; gap: 8px` — I should use `createAutoLayout('VERTICAL', { itemSpacing: 8 })`" | Look up `flex-direction: column` → `VERTICAL`, `gap` → `itemSpacing`. Emit. | ~200 per element |
| "The bar fill is 3500px — I need to inspect the parent, discover it's not auto-layout, realize resize happened before append..." | Rule: append to parent before resize. Compute `width = percentage * parent.width`. | ~1500 per debug cycle |
| "Let me take a screenshot to see if it looks right" | Mapping is correct by construction. No verification needed. | ~300 per screenshot |

---

## 4. The Mapping

### Core properties (the translation table)

The mapping between CSS and Figma is a lookup table, not a reasoning problem.

#### Layout
| CSS | Figma | Notes |
|-----|-------|-------|
| `display: flex` | `createAutoLayout()` | |
| `flex-direction: column` | `layoutMode = 'VERTICAL'` | |
| `flex-direction: row` | `layoutMode = 'HORIZONTAL'` | |
| `gap: N` | `itemSpacing = N` | |
| `padding: T R B L` | `paddingTop/Right/Bottom/Left` | |
| `flex: 1` (child) | `layoutSizingHorizontal = 'FILL'` | Append to parent first |
| `width: Npx` | `resize(N, h)` | |
| `align-items: center` | `counterAxisAlignItems = 'CENTER'` | |
| `justify-content: space-between` | `primaryAxisAlignItems = 'SPACE_BETWEEN'` | |

#### Visual
| CSS | Figma | Notes |
|-----|-------|-------|
| `background: #hex` | `fills = [{ type: 'SOLID', color }]` | Colors 0–1 range |
| `border: Wpx solid #hex` | `strokes = [...]; strokeWeight = W` | Clone array, reassign |
| `border-radius: N` | `cornerRadius = N` | |
| `opacity: N` | `opacity = N` | |
| `overflow: hidden` | `clipsContent = true` | |

#### Text
| CSS | Figma | Notes |
|-----|-------|-------|
| `font-family` | `fontName = { family, style }` | Must `loadFontAsync` first |
| `font-size` | `fontSize = N` | |
| `font-weight` | `fontName.style` | Map 400→Regular, 500→Medium, 700→Bold |
| `color` | Text node `fills` | |
| `text-align` | `textAlignHorizontal` | |

#### Sizing (the tricky one)
| CSS context | Figma | Precondition |
|-------------|-------|-------------|
| Fixed width | `resize(w, h)` + `layoutSizing* = 'FIXED'` | Always works |
| `width: auto` / hug content | `layoutSizing* = 'HUG'` | Must be auto-layout frame or text child |
| `flex: 1` / fill parent | `layoutSizing* = 'FILL'` | Must be child of auto-layout; **append first** |

### Ordering rules (the bugs you'll never hit twice)

These are the critical sequencing constraints. A correct converter encodes them once:

1. **Append before sizing:** `FILL`/`HUG` fail on unparented nodes. Always `appendChild` first.
2. **Load font before text edit:** Any text mutation needs `loadFontAsync` first. Read the node's actual font, don't hardcode.
3. **Resize after structure:** In non-auto-layout frames, child dimensions depend on parent dimensions being set first.
4. **Fills/strokes are immutable:** Clone the array, modify the clone, reassign. Never mutate in place.
5. **Page context resets:** Each `use_figma` call starts on page 0. Always switch page at the top of the script.

### RTL rules (if applicable)

| Rule | Implementation |
|------|---------------|
| Reverse horizontal child order | `for (child of [...children]) parent.insertChild(0, child)` |
| Right-align vertical containers | `counterAxisAlignItems = 'MAX'` |
| Flip directional icons | Mirror chevrons/arrows horizontally, leave status icons alone |

---

## 5. The Skill Design

### Two operations

**`push` — HTML → Figma**
- Input: HTML file (or node subtree) + target Figma file + target location
- Process: Parse DOM → apply mapping table → emit Plugin API calls → execute
- Output: Figma frame with matching structure, return node ID

**`pull` — Figma → HTML**
- Input: Figma file key + node ID
- Process: Read node tree → apply reverse mapping → emit HTML + CSS
- Output: Self-contained HTML file

### What the skill is NOT

- Not a pixel-perfect renderer — it transfers structure, layout, and tokens
- Not a Figma plugin — it runs through Claude Code's `use_figma` MCP tool
- Not project-specific — no design system assumptions, no governance framework dependency
- Not a two-way sync engine — it's a manual push/pull, like git

### Scope for v1

**In:**
- Auto-layout frames (flex containers)
- Text nodes with font/size/weight/color/alignment
- Rectangles with fills, strokes, corner radius
- Nesting (arbitrary depth)
- Padding, gap, sizing modes

**Out:**
- Images/assets (placeholder rectangles with name)
- Effects (shadows, blurs)
- Figma components/variants (plain frames only)
- Interactive behavior (JS)
- Gradients, blend modes

---

## 6. Implementation Path

### Phase 1: Skill (AI-guided, procedural)

Write a markdown skill that the AI follows step by step. The mapping table is in the skill; the AI's job is to apply it mechanically, not reason about it.

**Why start here:** Validates the mapping table with real components. Easy to iterate — edit the markdown, test again. No tooling to build.

**Success metric:** Transfer a component in 1-2 `use_figma` calls instead of 8-12. Token cost drops 70%+.

### Phase 2: Script (deterministic, zero AI tokens)

Graduate the mapping to a JavaScript function that runs inside `use_figma`. The AI calls it with a structured description of the HTML; the script emits all Figma API calls without reasoning.

**Why this matters:** The mapping cost goes to zero. The AI's only job is deciding *what* to transfer, not *how*.

### Phase 3: Round-trip identity

Add a lightweight manifest that tracks which HTML elements map to which Figma node IDs. This enables true push/pull — edit in Figma, pull back, and the diff is meaningful (not a full re-export).

---

## 7. Evidence from origin session

The following concrete round-trips were performed manually during the session. They serve as test cases for the skill:

| Component | Direction | What happened | Calls used |
|-----------|-----------|---------------|------------|
| Sidebar metrics card (progress bars, bar charts, hot count) | HTML → Figma | Created auto-layout frames, text nodes, rectangles. Hit bar-fill sizing bug (3500px). | 8+ use_figma calls |
| Lightning Activity Timeline | Figma → Figma (translate RTL) | Detached 93 instances, translated 36 text nodes, flipped 48 horizontal layouts, mirrored 5 chevrons. | 5 use_figma calls |
| Activity Timeline | Figma → HTML | Inspected node tree, manually wrote matching HTML/CSS, extracted to component. | 2 use_figma + manual HTML authoring |

Each of these should be achievable in 1-2 calls with a correct skill.

---

## 8. Open Questions

- [ ] How to handle CSS that has no Figma equivalent (pseudo-elements, box-shadow, transforms)?
- [ ] Should the mapping table be a separate structured file (JSON) or inline in the skill?
- [ ] What's the minimum viable "manifest" for round-trip identity — node IDs? element names? data attributes?
- [ ] How does this compose with the Figma MCP `figma-generate-design` skill — complement or overlap?
- [ ] Should `pull` output a component structure (CSS + JS + preview + spec) or just raw HTML?
