---
name: product-design
description: "Govern initiative-level product design work where the deliverable is a mockup — low or high fidelity. Use when an initiative produces a visual, interactive, or navigable artifact representing a product, interface, or user flow. Distinct from production engineering: the deliverable is a design artifact, not working software."
---

# Format: Product Design
## Interface, Flow, and Mockup Work

This format governs initiatives that produce design artifacts — low-fidelity wireframes, interactive HTML mockups, or Figma-ready screens. The deliverable is something that represents how a product looks and behaves, not something that runs in production.

It replaces `product-mockup.md`, which conflated design work with production engineering. This format scopes to the design phase only.

---

## Cartridge Structure

The `.harness/` directory for a product design initiative contains:

| Artifact | File | Holds |
|---|---|---|
| Active memory | `01_PROJECT.md` | Current phase, open decisions, next actions, change trail |
| Product intent | `PRD-[initiative].md` | Problem statement, target users, goals, data model, roles, open questions |
| Logic and flow | `flow-[initiative].html` | Visual flowchart: state map, user journeys, interaction triggers, screen hierarchy |

### 01_PROJECT.md — Active Memory
Current phase, what has been decided, what is open, what is blocked, what the next action is. Universal across all formats — always present.

### PRD-[initiative].md — Product Intent
The what and the why. Who is this for, what problem does it solve, what does success look like, what is explicitly out of scope. Includes data model, role definitions, and open questions. Stable — changes here should be deliberate and logged.

### flow-[initiative].html — Logic and Flow
A visual HTML flowchart. The bridge between intent and implementation. Maps states, triggers, decisions, and loops before any wireframe is built. This layer is the primary defense against logic errors surfacing late in the wireframe. It is a living artifact — updated when the flow changes, not when the wireframe changes.

---

## Layer Model

Product design work follows a **progressive commitment model** with four layers. Authority flows downward; questions flow upward.

| # | Layer | Artifact | Question it answers |
|---|---|---|---|
| 1 | **Intent** | `PRD-[initiative].md` | What are we building and for whom? |
| 2 | **Flow** | `flow-[initiative].html` | What happens when? What triggers what? |
| 3 | **Wireframe** | `mockup-[initiative]-v[N].html` | Does the layout and content work? |
| 4 | **Design** | Figma | What does it look like? |

Layer 1 is the anchor — most stable, consensus-gated. Layers 2–4 are progressively more volatile and can be updated without full consensus. Changes to a higher layer propagate downward; a lower layer cannot introduce commitments not present above it.

---

## Regression Rule

When a problem surfaces at layer N, do not patch it at layer N.

1. Identify which layer owns the decision behind the problem.
2. Fix it at that layer.
3. Propagate the correction downward through all affected layers.

Patching at the wrong layer produces drift — the wireframe diverges from the flow, the flow diverges from the PRD — and the next session inherits the inconsistency. A correct layer 2 decision prevents the next five wireframe fixes.

---

## Artifact Naming

All initiative artifacts follow the same convention: lowercase, hyphenated, no numbers, no capitals. Type prefix, then initiative name, then version suffix where applicable.

| Artifact | Convention | Example |
|---|---|---|
| Product intent | `PRD-[initiative].md` | `PRD-proposals.md` |
| Logic and flow | `flow-[initiative].html` | `flow-proposals.html` |
| Wireframe iteration | `mockup-[initiative]-v[N].html` | `mockup-proposals-v2.html` |
| Static export | `screen-[N]-[state].html` | `screen-2-drawer.html` |

Wireframe versions are preserved — each iteration is a distinct file. The PRD and flow are not versioned in this way; they are updated in place as the single source of truth. Folder hierarchy is introduced only when a version has multiple companion files; two files do not justify a folder.

---

## File Classification

Every HTML file in a design initiative is one of two types:

| Type | Description | JavaScript | Source of truth |
|---|---|---|---|
| **Interactive** | Working mockup with full interactions | Yes | Yes — the stable master file |
| **Static** | Snapshot for Figma import or presentation | No | No — generated on demand |

Static files are ephemeral. They are generated from the interactive master and never independently maintained. Do not register static exports as stable artifacts and do not commit to keeping them current.

---

## Figma Export Protocol

When exporting screens for Figma import:

1. Start from the current interactive master — confirm it is the latest version.
2. Agree on which states to export before generating files.
3. Produce one static HTML file per state.
4. Set `html, body { width: 1920px; height: 1080px; overflow: hidden; }` — this is the team standard; do not use other resolutions unless explicitly requested.
5. Remove all JavaScript — static files have no interactions.
6. Name files per the static export convention in Artifact Naming above.
7. Do not modify or strip the HTML structure before export — the html-to-figma plugin handles full HTML correctly; simplifying markup degrades fidelity.
8. Do not register exported files as stable artifacts.

Export states should represent meaningful moments in the user journey, not arbitrary snapshots.

---

## AI Behavior in This Format

**Treat `PRD-[initiative].md` as the intent anchor.** Ambiguity about what to design resolves by reading the PRD. If the PRD is silent, surface the question rather than resolving it unilaterally.

**Treat `flow-[initiative].html` as the logic authority.** Before building a wireframe for any new screen or interaction, verify the flow covers it. If it doesn't, populate the flow first. A wireframe built without a flow is a guess.

**Apply the regression rule proactively.** When a wireframe revision reveals a logic problem, name the layer it belongs to before fixing it: *"This is a flow-layer issue — I'll fix the flow first, then update the wireframe."*

**Produce an HTML wireframe as the default discussion artifact.** After any screen or flow is agreed on — even partially — produce a low-fidelity single-file HTML wireframe. RTL where the project requires it. Embedded CSS and JS. Real content where it matters, placeholder blocks elsewhere. The wireframe is a shared visual for layout and content discussion, not a deliverable.

**Flag scope creep proactively.** If a request implies a new user role, a new screen type, or a behavior not present in the PRD, name it before proceeding.

**Keep `01_PROJECT.md` current.** After any meaningful session, record what changed, what decisions were made, and what the next action is.

---

## Format History

| Version | Date | What changed |
|---|---|---|
| v1.0 | 2026-06-24 | Created from redesign of `product-mockup.md`. Removed BUILD and Validation layers (production engineering concerns). Added Flow layer between Intent and Implementation. Formalized regression rule. Scoped to initiative-level design work. |
| v1.1 | 2026-06-24 | Flow artifact renamed from `03_FLOW.md` to `flow-[initiative].html` — HTML flowchart, not markdown. Unified naming convention section added. PRD artifact renamed from `02_PRD.md` to `PRD-[initiative].md`. Layer model and AI behavior rules updated to match. |
| v1.2 | 2026-06-28 | Added File Classification section (Interactive vs Static). Added Figma Export Protocol section. Added static export to Artifact Naming table. Promoted from `Projects/CLAUDE.md` — these were universal conventions living outside the Harness. |
