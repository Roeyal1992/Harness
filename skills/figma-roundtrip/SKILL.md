---
name: figma-roundtrip
description: >
  Transfer UI components between HTML/CSS and Figma via the use_figma MCP tool.
  Eliminates AI reasoning on CSS-to-Figma property translation by codifying it as a
  deterministic mapping table. Use this skill whenever the user wants to push an HTML
  mockup or component to Figma, pull a Figma frame into HTML, sync changes between the
  two environments, or mentions any HTML-to-Figma or Figma-to-HTML conversion — even if
  they don't say "bridge" or "teleport." Also trigger when the user is iterating on a
  component in both environments and you notice repeated CSS-to-Figma reasoning.
---

# Figma ↔ HTML Bridge

Push and pull UI components between HTML/CSS (in Claude Code) and Figma (via `use_figma`), using a deterministic mapping table instead of AI reasoning.

---

## Glossary

These terms mean different things to different people and to the Figma API. This skill uses them as follows:

| Term | In this skill | NOT |
|------|--------------|-----|
| **component** | A subtree of frames, text nodes, and rectangles — a logical UI element | A Figma Component (reusable, with variants). This skill produces plain frames. |
| **frame** | An auto-layout container with content inside it | An empty Figma Frame node with nothing in it |
| **element** | A single node in the tree (text, rectangle, frame) | A DOM element specifically — the word is used for both sides |
| **push** | Transfer from HTML/CSS → Figma | Export, publish, or sync |
| **pull** | Transfer from Figma → HTML/CSS | Import, download, or clone |

When communicating with the operator, adopt their vocabulary — but internally, resolve it to these definitions before acting.

---

## Principle: Code Over Reasoning

Every property mapping that is finite and deterministic must be handled by lookup, not AI reasoning.

`border-radius: 4px` → `cornerRadius = 4` is a table entry. It costs zero tokens, runs correctly every time, and never needs a screenshot to verify. When the AI reasons about this same mapping, it costs ~200 tokens, is non-deterministic, and occasionally hallucinates.

**The boundary:** Code owns the *translation layer* (known CSS ↔ Figma property mappings, and property parking via `spec.json`). AI owns the *decision layer* (what to translate, how to handle gaps, what to name things, where to place the result in the Figma file — informed by `spec.md`).

**Where code breaks down:**
- CSS that has no Figma equivalent (`box-shadow`, `transform`, `calc()`, pseudo-elements, CSS Grid, `z-index`) — these are *parked* in `spec.json`, not lost
- Semantic interpretation: deciding component boundaries, naming, grouping
- Layout ambiguity: absolute positioning, overlapping elements, table layouts
- Font resolution: CSS font stacks → Figma's `{ family, style }` requires checking availability
- Structural extraction: reading a `render{Name}()` function to understand the DOM tree it produces
- **Layout mode detection on pull:** determining whether a Figma subtree uses auto-layout or Groups with absolute positioning — and deciding whether to infer flex or preserve as `position: absolute`

When the code hits something outside the mapping table, it parks the property in `spec.json` and moves on. The AI handles judgment calls informed by `spec.md`.

---

## Component Package — File Responsibilities

Each file in the component folder has one job. Understanding these roles is essential — the bridge reads from and writes to specific files based on what they own, not based on what's convenient to parse.

| File | Owns | Bridge role |
|------|------|-------------|
| `{name}.css` | **Visual truth** — all styles, design tokens, layout properties | **Source** for push (style extraction). **Target** for pull (style generation). |
| `{name}.js` | **Structural truth** — the DOM template, config API, render logic | **Source** for push (the AI reads this to understand what the component *is* and what it produces). **Target** for pull (generate the render function). |
| `spec.json` | **Translation metadata** — parked properties, Figma node IDs, design tokens | **Sidecar** managed by code. On push: properties with no Figma equivalent are parked here. On pull: parked properties are restored to CSS. Also stores the Figma file key and node ID for round-trip identity. |
| `spec.md` | **Semantic context** — intent, behavior, content rules, design rationale, config API docs | **AI context file.** The AI reads this when making judgment calls: naming frames, deciding groupings, resolving layout ambiguity, understanding what the component means. |
| `preview.html` | **Nothing. It is a consumer.** | **Verification harness** — open it in a browser to check the result. Never parsed as source. Never generated first. |
| `assets/` | Binary assets (icons, images, fonts) | Referenced by name. Push creates placeholder rectangles in Figma with the asset's file name. |

### Why preview.html is not a source

`preview.html` calls `render{Name}(config)` with one specific set of sample data and displays the result. Parsing it as source means:
- You push one rendering of the component, not the component itself — losing the config API, variants, and conditional logic
- You create a false authority — if the CSS changes, the preview reflects it automatically, but treating preview as source might read stale inline styles or miss that the real change is in the CSS file

The structural source of truth is the JS file. The visual source of truth is the CSS file. preview.html is downstream of both.

### spec.json — property parking

Properties that can't cross the bridge are parked, not lost. The converter writes them to `spec.json` on push and restores them on pull. This is handled by code — the AI never reasons about parked properties.

```json
{
  "figma": {
    "fileKey": "WpjJgZZEz03Z6GaQmIoLxV",
    "nodeId": "5291:3486",
    "lastPush": "2026-07-05"
  },
  "parked": {
    ".card": {
      "box-shadow": "0 2px 4px rgba(0,0,0,0.1)",
      "transition": "all 0.3s ease"
    },
    ".badge::before": {
      "content": "'●'",
      "margin-inline-end": "4px"
    }
  },
  "tokens": {
    "--color-primary": "#0070D2",
    "--color-ai-primary": "#7B61FF"
  }
}
```

- `figma` — round-trip identity. Stores the target file and node so future push/pull operations know where to go.
- `parked` — CSS properties with no Figma equivalent, keyed by selector. Restored to CSS on pull.
- `tokens` — design token values extracted from the `:root` block. Preserved across round trips so token names survive even if Figma flattens them to raw values.

### spec.md — the AI's brief

`spec.md` is not documentation for humans — it's context for the AI's judgment calls. It should contain the things the mapping table can't encode:

- What this component *is* and what it's *for* (so the AI names Figma frames meaningfully)
- Layout invariants ("sidebar anchors right — this is structural, not just flex order")
- Color semantics ("purple means AI-generated, don't remap as accent")
- Content context ("Hebrew banking CRM, RTL-first, Salesforce Lightning chrome")
- Config API documentation (so the AI understands which parts of the structure are variable)
- Design rationale for non-obvious decisions

---

## Operations

### Push (HTML → Figma)

**Input:** A component folder + target Figma file + target page/frame.

**Procedure:**

1. **Read the sources.** Open `{name}.js` (structural truth) and `{name}.css` (visual truth). Read `spec.md` for semantic context. Read `spec.json` if it exists (for existing Figma node reference).

2. **Understand the structure.** Read the `render{Name}()` function in the JS file. Identify:
   - The DOM tree it produces (the `innerHTML` template or `createElement` calls)
   - Which parts are static structure vs. config-driven content
   - The nesting hierarchy
   
   This step is inherently interpretive — the AI reads JavaScript and determines the output DOM. This is a legitimate AI task (structural extraction), not property translation.

3. **Identify the scope.** If the operator specified a subtree (e.g., "push just the header row"), limit the walk to that portion of the structure. If no scope is specified, push the entire component output.

4. **Walk the structure depth-first.** For each element:
   - Look up every relevant CSS property in the **Mapping Table** below
   - If found → add the corresponding Figma API call to the output script
   - If not found → park the property in `spec.json` under its selector, and continue
   - Determine the node type: elements with only text content → `createText()`, elements with children → `createFrame()` with auto-layout, leaf elements with no text → `createRectangle()`
   - Name each Figma frame meaningfully, guided by CSS class names and `spec.md` context

5. **Build a component tree as data.** Express the DOM tree as a JSON-like structure using the converter's node format:
   ```
   { tag: 'frame'|'text'|'rect', name: string, css: {...}, children: [...] }
   ```
   - `css` uses standard CSS property names (`flex-direction`, `align-items`, `gap`, `padding`, `background`, `border`, `border-radius`, `font-size`, `color`, etc.)
   - `tag: 'text'` also takes `content` (string) and optional `font` (`'Family:Style'`)
   - `tag: 'rect'` uses `css.width`/`css.height` for dimensions (default 24×24)
   - Special CSS values: `width: '100%'` or `flex: '1'` → FILL, `width: 'hug'` → HUG
   
   Define per-component **data helpers** (functions that return tree nodes) to compress repeated patterns — e.g., `icon(name, w, h)`, `divider()`, `tab(label, opts)`. These produce data, not Figma API calls.

6. **Generate a single `use_figma` call.** Structure it as:
   - Load the converter from `sharedPluginData` (3-line boilerplate — see Mapping Tables section)
   - Define data helper functions specific to this component
   - Call `await conv.render({ page, rtl, fonts, tree })` with the component tree
   - The converter handles all Figma API translation, ordering rules, and RTL reversal
   
   If the converter is not yet stored on this Figma file, run the storage call first (see Mapping Tables section).

7. **Execute via `use_figma`.** The generated code is: loader (3 lines) + data helpers (compact) + render call (compact). Total AI output is ~50–80 lines of data description vs ~300+ lines of hand-written Figma API code.

8. **Update spec.json.** Write/update the `figma` block with file key and node ID. Write any parked properties.

9. **Report.** List: what was pushed, the Figma node ID, and any parked properties. Do not take a verification screenshot unless the operator asks — a correct mapping needs no visual verification.

### Pull (Figma → HTML)

**Input:** Figma file key + node ID (or: component folder with existing `spec.json` containing the Figma reference).

**Procedure:**

1. **Read the Figma node tree.** Use `use_figma` to walk the target node and its children. Capture: node type, name, layout properties, fills, strokes, text content, font info, dimensions.

2. **Detect layout mode.** This is a critical AI decision point. The source Figma frame may use:
   - **Auto-layout** — has `layoutMode` set to `HORIZONTAL` or `VERTICAL`. Apply reverse mapping directly to `display: flex`.
   - **Groups + absolute positioning** — no `layoutMode`, children positioned by `x`/`y` coordinates. **Do not infer `flex` from spatial arrangement.** Preserve as `position: absolute` with calculated offsets.
   - **Mixed** — some subtrees use auto-layout, others don't. Handle each subtree according to its own layout mode.

   This decision is informed by `spec.md` if available. If the operator knows the component *should* be flex-based, they can instruct a re-layout — but the default pull must preserve what Figma actually has, not what it *could* be.

3. **Read existing spec.json** (if pulling into an existing component). Retrieve parked CSS properties for restoration.

4. **Apply reverse mapping.** For each node, use the **Reverse Mapping Table** below:
   - Frame with auto-layout → `<div>` with corresponding `display: flex`, `flex-direction`, `gap`, `padding`
   - Frame without auto-layout → `<div>` with `position: relative`, children get `position: absolute` with `left`/`top` from Figma `x`/`y`
   - Text node → appropriate text element (`<span>`, `<p>`, `<h1-6>` based on font size/weight heuristics and `spec.md` guidance)
   - Rectangle → `<div>` with `background`, `border-radius`, `border`
   - Nested children → recursive descent

5. **Restore parked properties.** Merge parked CSS from `spec.json` back into the generated styles. The parked properties are applied to their original selectors.

6. **Generate output files** following the component folder convention:
   - `{name}.css` — extracted styles, organized with `:root` token block. Restored parked properties included.
   - `{name}.js` — `render{Name}(config)` function. The AI uses `spec.md` to determine which parts of the structure should be configurable vs. static.
   - `preview.html` — standalone preview that loads CSS + JS, auto-renders with realistic data
   - `spec.md` — update the Figma source reference; preserve all existing semantic content
   - `spec.json` — update with any Figma-side properties that have no CSS equivalent (park in reverse)

7. **Report.** List: what was pulled, files written, any Figma properties parked (no CSS equivalent), and any layout mode decisions made (especially non-auto-layout handling).

### Scoped Operations

Both push and pull support scoping to iterate on parts of a component:

| Scope | Push | Pull |
|-------|------|------|
| **Subtree** | "Push just the header row" — walks only that portion of the JS structure | "Pull just node 1234:5678" — reads only that node's subtree |
| **Styles only** | Update fills, strokes, fonts on existing Figma nodes without rebuilding structure | Update CSS values from Figma without regenerating HTML/JS |
| **Structure only** | Rebuild the Figma frame tree without reapplying visual properties | Regenerate JS render function without touching CSS |

For scoped push/pull to existing nodes, the skill reads the Figma node ID from `spec.json`. If no `spec.json` exists, the operator must provide the node ID.

---

## Mapping Tables & Helpers

All property mappings and color conversion helpers live in `scripts/` — not inline. The AI reads these files as lookup references; in Phase 2 they become programmatically consumable.

| File | Contents |
|------|----------|
| `scripts/mapping-push.json` | CSS → Figma property lookup (layout, sizing, visual, text) |
| `scripts/mapping-pull.json` | Figma → CSS reverse lookup + `fontWeightMap` (style name → weight number) |
| `scripts/helpers.js` | `hexToFigma(hex)` for push scripts, `figmaToHex(color)` for pull scripts |
| `scripts/converter.js` | **Push converter.** Handles all Figma API translation, ordering rules, and RTL reversal. Stored on the Figma file via `sharedPluginData` — loaded at runtime, not pasted into every call. |

**Push (Phase 3 — stored converter):** The converter is stored once on the Figma file via `sharedPluginData('harness.converter', 'code')`. Each push call loads it with 3 lines of boilerplate + the component tree data. The AI produces only the `render()` call — no converter paste needed.

**Loader boilerplate** (3 lines, copy-paste into every push call):
```js
var c=figma.root.getSharedPluginData('harness.converter','code');
var fn=new Function('figma',c+'\nreturn{render:render};');
var conv=fn(figma);
// then: var result = await conv.render({ page, rtl, fonts, tree });
```

**Storing/updating the converter** (once per file, or when converter.js changes):
```js
var converterCode = '...'; // contents of converter.js with single quotes escaped
figma.root.setSharedPluginData('harness.converter', 'code', converterCode);
```

The mapping tables in `mapping-push.json` document the translations the converter performs.

**Pull:** read `mapping-pull.json`. For each Figma node property, find the matching entry and emit the corresponding CSS. Use `fontWeightMap` to convert Figma font style names to CSS `font-weight` numbers. Use `figmaToHex()` from `helpers.js` for color conversion.

---

## Ordering Rules

These are hard sequencing constraints. Violating them produces silent bugs — the script runs without error, but the output is wrong.

1. **Append before sizing.** `FILL` and `HUG` sizing modes fail silently on unparented nodes. Always `parent.appendChild(child)` before setting `layoutSizing*` to FILL or HUG.

2. **Load font before any text mutation.** Any property change on a text node requires `figma.loadFontAsync(textNode.fontName)` first. Read the node's *actual* current font — do not hardcode. If changing the font, load the new font before setting it.

3. **Resize after structure.** In non-auto-layout frames, child dimensions depend on parent dimensions being set first. Build the full tree, then apply sizing top-down.

4. **Fills and strokes are immutable arrays.** Never mutate in place. Clone the array, modify the clone, reassign: `node.fills = [{ ...newFill }]`, not `node.fills[0].color = ...`.

5. **Page context resets per call.** Each `use_figma` call starts on page 0. Always `await figma.setCurrentPageAsync(page)` at the top of every script. Do NOT use `figma.currentPage = page` — it throws.

6. **Create auto-layout before adding children.** Set `layoutMode` on a frame before appending children, or the children won't participate in the layout.

7. **`layoutSizing*` vs `primaryAxisSizingMode` / `counterAxisSizingMode`.** These are different enums. `layoutSizingHorizontal` / `layoutSizingVertical` are per-child properties (FIXED, HUG, FILL). `primaryAxisSizingMode` / `counterAxisSizingMode` are per-frame properties (FIXED, AUTO) controlling whether the frame itself hugs or is fixed. Use `layoutSizing*` on children, `*AxisSizingMode` on the frame itself.

---

## RTL Rules

Apply when the source or target component uses RTL layout.

| Rule | Implementation | Why |
|------|---------------|-----|
| Reverse horizontal child order | `_revH()` — recursive post-build reversal of horizontal frames | Figma has no `direction` property; child order is visual order |
| Right-align vertical containers | `counterAxisAlignItems = 'MAX'` as default when RTL and no explicit `align-items` | CSS `direction: rtl` flips the cross-axis default; Figma doesn't inherit alignment |
| Right-pack horizontal containers | `primaryAxisAlignItems = 'MAX'` as default when RTL and no explicit `justify-content` | After child reversal, content should pack to the right, not left |
| Flip directional icons | Mirror chevrons/arrows horizontally; leave status icons alone | |
| Text alignment | Default to `textAlignHorizontal = 'RIGHT'` for body text | |

**Key insight — no inheritance:** Figma frames do not inherit alignment from parents. Every frame must set its own alignment explicitly. The converter handles this by threading the `rtl` flag through all frame creation — every vertical frame defaults to `counterAxisAlignItems='MAX'`, every horizontal frame defaults to `primaryAxisAlignItems='MAX'`. Explicit values in the tree data are always preserved.

**Tree data convention:** CSS values in the tree data represent **Figma intent** (e.g., `align-items: 'flex-end'` → MAX → right side), not LTR CSS semantics. The RTL defaults only fill in unspecified properties — they never transform explicit values.

---

## Scope — v1

### In scope
- Auto-layout frames (flex containers) at arbitrary nesting depth
- Text nodes with font family, size, weight, color, alignment, line-height
- Rectangles and frames with fills, strokes, corner radius, opacity
- Padding, gap, sizing modes (fixed, hug, fill)
- RTL layout conventions
- Property parking via `spec.json` (lossless round trips for unsupported properties)
- Single-component push/pull and scoped subtree operations
- Pull from non-auto-layout (Groups + absolute positioning) — preserved as `position: absolute`

### Out of scope (park in spec.json, report what was parked)
- Images and assets (create a placeholder rectangle in Figma with the asset's file name)
- Effects: `box-shadow`, `blur`, `filter` (parked, not translated)
- Figma Components and Variants (output is always plain frames)
- Interactive behavior (JS event handlers are not transferred)
- Gradients, blend modes, masks
- CSS Grid layout
- Pseudo-elements (`::before`, `::after`)
- `calc()`, CSS custom property resolution, media queries
- Multi-component batch operations (push/pull one component at a time)

---

## Test Evidence

### Push test — Console Nav row (2026-07-05)

**Source:** `Projects/Poalim/Components/salesforce-top-nav/` (JS + CSS)
**Scope:** Console Nav row (row 2) — app name + 2 tabs (bare "בית", active "יצירה חדשה")
**Result:** Created Figma node `5578:2` in file `WpjJgZZEz03Z6GaQmIoLxV` via a single `use_figma` call.

Script: `scripts/test-console-nav-push.js`

Observations:
- The entire scoped subtree was built in 1 `use_figma` call (vs. 8+ calls without the mapping table)
- All ordering rules held — no silent sizing bugs
- Auto-layout hierarchy correctly mapped from CSS flex properties
- RTL text alignment applied
- Icon placeholders created with asset file names
- Design tokens resolved from CSS `:root` block
- `figma.createAutoLayout()` convenience method worked for frame creation + layoutMode in one step

### Pull test — Console Nav from existing Figma (2026-07-05)

**Source:** Figma node `3655:2770` in file `WpjJgZZEz03Z6GaQmIoLxV`
**Result:** Generated CSS + HTML to `scratchpad/pull-test/`

Key finding — **layout mode detection is critical:**
- The existing Figma nav row uses **Groups + absolute x/y positioning**, not auto-layout
- The reverse mapping correctly preserved this as `position: absolute` with calculated offsets
- Inferring flex from spatial arrangement was considered and rejected — spatial proximity doesn't reliably indicate flex containers
- INSTANCE nodes (icons) → placeholder spans; VECTOR nodes → skipped (parked for spec.json)
- Font "Open Sans" preserved as-is from Figma (differs from the CSS source which uses "Rubik")

This test confirmed that pull must handle non-auto-layout gracefully. The decision to preserve vs. re-layout is an AI judgment call informed by `spec.md`.

### Push test — Full component via Phase 1 hand-written script (2026-07-05)

**Source:** `Projects/Poalim/Components/salesforce-top-nav/` (JS + CSS)
**Scope:** Full component — all 3 rows (Global Header + Console Nav + Subtabs)
**Result:** Created Figma node `5586:2` in file `WpjJgZZEz03Z6GaQmIoLxV`.

Script: `scripts/push-salesforce-nav-full.js` (~320 lines)

Observation: **Extremely token-expensive.** The AI manually walked the mapping table and generated ~320 lines of Figma API calls. Every line required Figma API knowledge. This motivated Phase 2.

### Push test — Full component via Phase 2 converter (2026-07-05)

**Source:** Same component, same scope.
**Result:** Created Figma node `5592:2` — 1306×264px, all 3 rows rendered correctly with RTL.

Code structure:
- `converter.js` pasted at top (~130 lines, copy-paste, zero AI reasoning)
- Data helper functions for repeated patterns (~30 lines)
- Component tree as data (~50 lines)
- Total AI reasoning output: ~80 lines of data description

**Token cost comparison:**
- Phase 1: ~320 lines, every line requires Figma API knowledge
- Phase 2: ~80 lines of data + ~130 lines converter (copy-paste) = **~70% reduction in AI reasoning**

The converter correctly handled: auto-layout, text rendering (Hebrew), RTL reversal, borders (full + per-side), border-radius, padding, gap, sizing modes (FIXED/HUG/FILL), fills, strokes, min/max-width, overflow clipping.

### Push test — Customer Panel via Phase 3 stored converter (2026-07-05)

**Source:** `Projects/Poalim/Components/customer-panel/` (JS + CSS)
**Result:** Created Figma node `5617:273` — 280×420px, full panel with header bar, identity block, 3 data sections + 1 collapsed section.

Code structure:
- 3-line converter loader from `sharedPluginData` (copy-paste)
- Data helper functions: `FR()` (field row), `ER()` (entry row), `Badge()` (~15 lines)
- Component tree (~60 lines)
- Total AI output: **~80 lines** (no converter paste)

**Token cost comparison across phases:**
- Phase 1: ~320 lines, every line requires Figma API knowledge
- Phase 2: ~80 lines data + ~130 lines converter paste = ~210 lines total output
- Phase 3: ~80 lines data + 3 lines loader = **~83 lines total output, ~85% reduction vs Phase 2**

### RTL alignment fix — vertical + horizontal defaults (2026-07-05)

**Problem:** Figma does not inherit alignment from parent frames. Setting `counterAxisAlignItems='MAX'` on a root vertical frame does not right-align children of nested sub-frames.

**First fix (partial):** Threaded `rtl` flag through `_build` → `_frame`. Vertical frames without explicit `align-items` default to `counterAxisAlignItems='MAX'`. Fixed top-level alignment but horizontal sub-frames still packed content to the left.

**Second fix (complete):** Also set `primaryAxisAlignItems='MAX'` on horizontal frames without explicit `justify-content` when RTL. After `_revH` reverses child order, content now packs to the right side of the frame. Explicit values (`space-between`, `center`, `flex-end`) are preserved.

**Verified:** Deep scan of all frames in converter output confirmed correct alignment on every frame. Tested on both salesforce-nav (node `5613:273`) and customer-panel (node `5617:273`).

---

## Phase Roadmap

**Phase 1 (superseded):** The AI reads the JS and CSS source files, consults the mapping table, and emits `use_figma` scripts. All property translation is mechanical lookup but the AI still generates the Figma API code. Works but token-expensive (~320 lines per full component).

**Phase 2 (superseded):** The converter (`scripts/converter.js`) runs inside `use_figma` calls, pasted at the top of every call. The AI only produces a component tree as data — ~70% reduction in AI reasoning. But the converter paste (~130 lines / ~3.5KB) repeats every call.

**Phase 3 (current):** The converter is stored on the Figma file via `sharedPluginData('harness.converter', 'code')`. Each push call loads it with a 3-line boilerplate + tree data. One-time storage cost per file; per-push cost is **~85% lower** than Phase 2 (tree data only, no converter paste). The AI's job per push: (1) read JS/CSS, (2) express as tree, (3) define data helpers, (4) call `conv.render()`.

| Phase | AI output per push | Converter cost |
|-------|-------------------|----------------|
| 1 | ~320 lines Figma API | N/A |
| 2 | ~80 lines data + ~130 lines converter paste | Per call |
| 3 | ~50–80 lines data + 3 lines loader | One-time per file |

**Phase 4 (future):** Extend `spec.json` with element-level identity mapping (CSS selector ↔ Figma node ID). Enables true incremental push/pull — edit one element in either environment, sync just the delta.
