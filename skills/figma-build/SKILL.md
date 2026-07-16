---
name: figma-build
description: Workflow skill for building Figma screens from code using the Plugin API. This skill should be used when translating a visual design spec into a Figma file by writing use_figma calls — bridging from "what to build" to "how to build it in code." Covers pre-flight setup, incremental build workflow, and links to reusable plugin code patterns.
---

# figma-build

Workflow for translating a design spec into working Figma screens via the Plugin API.

---

## 1. Pre-flight (mandatory before the first use_figma call)

**a. Load the figma-use MCP skill.** It owns the Plugin API rules and the pre-flight checklist. Without it, common failures go unexplained.

```
ReadMcpResourceTool: server="claude.ai Figma", uri="skill://figma/figma-use/SKILL.md"
```

**b. Load the tool schemas** if not already in context:

```
ToolSearch: query="select:mcp__claude_ai_Figma__use_figma,mcp__claude_ai_Figma__get_screenshot"
```

**c. Orient from the project's design spec — not from Figma.** Before inspecting any Figma file, read whatever document governs the target design: component library node IDs, hard constraints (width, font, direction), color palette, anatomy rules. If that document is current, skip the Figma inspect step entirely.

**d. Identify the exact placement node** — the section or parent frame in Figma where the new screen should be appended. Use a prior `get_metadata` call or the project's section map if available.

---

## 2. Incremental Build Workflow

Every screen is built in **3 calls**. More than 4 is a signal that the screen is over-complicated or the structure wasn't clear before starting.

### Call 1 — Structure

Create the outer wrapper and all background layers. No content yet.

Typical contents: wrapper frame, status bar, header bar, background fill (content hint), scrim, modal card shell (empty auto-layout, no children).

**Return:** `{ wrapperId: "...", modalId: "..." }` — top-level IDs needed by subsequent calls.

### Call 2 — Content

Fill the primary body: labels, radio rows, form fields, table rows. Retrieve the container node by ID from Call 1's return value.

**Return:** `{ createdNodeIds: [...] }`

### Call 3 — Finalize and verify

Add remaining elements (filter rows, summary rows, CTAs, spacers). End the call with `await wrapper.screenshot()` inline and inspect the result before declaring the screen done.

**Return:** `{ createdNodeIds: [...], screenshot }`

---

## 3. Rules That Apply to Every Call

The most common failure points — check before submitting any script:

| Rule | Why it matters |
|---|---|
| Load ALL fonts at the top (`await figma.loadFontAsync(...)`) | Any text mutation on an unloaded font throws |
| Switch to the target page at the top (`await figma.setCurrentPageAsync(...)`) | Page context resets to page 1 between calls |
| Set `layoutSizingHorizontal/Vertical = 'FILL'` **after** `parent.appendChild(child)` | The property is rejected until the node is inside an auto-layout parent |
| Call `resize()` before setting `primaryAxisSizingMode` / `counterAxisSizingMode` | `resize()` resets sizing modes to FIXED — set them after |
| Paint opacity at the paint level, never in the color object | `{ type: 'SOLID', color: {r,g,b}, opacity: 0.4 }` — no `a` key in `color` |
| Return ALL created/mutated node IDs in every call | Required for subsequent calls to reference or verify nodes |

---

## 4. Reusable Code Patterns

Load `references/plugin-patterns.md` for copy-paste scaffolds. Do not re-derive these from scratch.

Patterns available:
- Color object template
- `mkText` helper
- Wrapper / scrim / modal overlay
- Radio row (HORIZONTAL auto-layout — FILL label, FIXED circle, RTL order)
- Column table row
- Column header / filter row
- Absolute × close button

Adapt dimensions and colors to the project's design spec. The patterns assume nothing about the project.

---

## 5. Component Selection and Scavenging

Load `references/component-selection.md` before deciding how to build any element.

Covers:
- Decision triage: AS-IS instance / detach+modify / build from scratch — classify before writing any script
- Scavenging method: search for the visual pattern, not the component name; sub-sections of compound components are often the right shell
- Repurpose workflow: `createInstance() → detachInstance() → strip → modify`
- Operator-placed-node rule: a user-placed component is read-only — always derive the working copy from `sourceComp.createInstance()`
- Content structure principles: narrative ordering, unified pockets, section label patterns, badge placement
