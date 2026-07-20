# Harness
## Workspace Governance — Master Index

This file loads into every session via `CLAUDE.md`. Its job is orientation and navigation — not documentation. For protocol depth, follow the ecosystem map below to the right artifact.

---

## What This Workspace Is

The Harness is a governing instrument for AI-assisted project work. It deposits a `.harness/` knowledge cartridge onto any project it governs — containing active memory, product intent, and build mechanics.

This repo is itself a governed instance. The `.harness/` directory here tracks the development of the Harness instrument itself — a recursive demonstration of the concept.

---

## Governance Model

Three levels, each governed by its own artifacts:

| Level | Description | Governed by |
|---|---|---|
| **Workspace** | This repo — the instrument itself | This file + `.harness/` cartridge |
| **Project / Domain** | A client engagement or domain of work | A `.harness/` cartridge in the project folder |
| **Initiative** | A specific deliverable within a domain | A format file from `formats/` |

Formats instantiate the universal governance model for specific deliverable types. Skills are operational procedures — retrieved when a specific operation is needed, not loaded by default.

---

## Ecosystem Map

### Core Artifacts

| Artifact | Location | Role |
|---|---|---|
| Master index | `HARNESS.md` | This file |
| Active memory | `.harness/01_PROJECT.md` | Current Harness development state |
| Product intent | `.harness/02_PRD.md` | What the Harness is and what it solves |
| Build mechanics | `.harness/03_BUILD.md` | How the Harness is structured and deployed |
| Working method | `.harness/04_METHOD.md` | Operator working conventions and collaboration discipline |
| Improvement backlog | `.harness/05_IMPROVE.md` | Staged observations (friction/feedback/success) awaiting operator review |
| Session entry | `.claude/commands/harness.md` | `/harness` slash command |
| Session handoff | `SESSION_HANDOFF.md` | Next-session restart context and immediate next action |

### Formats

| Format | File | Use for |
|---|---|---|
| Strategic Deck | `formats/strategic-deck/FORMAT.md` | Decks, reports, proposals, frameworks |
| Product Design | `formats/product-design.md` | HTML mockups, wireframes, Figma-ready screens |

### References

| Reference | File | Contents |
|---|---|---|
| Figma MCP | `references/figma-mcp.md` | Config location, OAuth auth model, fix for missing connection |

### Skills

| Skill | File | Use for |
|---|---|---|
| Deploy | `skills/deploy.md` | Apply Harness to a new greenfield project |
| Adopt | `skills/adopt.md` | Bring an in-progress project under Harness governance |
| Assess | `skills/assess.md` | Audit a governed project's artifact health |
| Promote | `skills/promote.md` | Move content from current-state to durable artifacts |
| Prune | `skills/prune.md` | Remove stale content from artifacts |
| Wrap-up | `skills/wrapup.md` | Close out a session with a restart-safe artifact state |
| Migrate | `skills/migrate.md` | Move a project between formats |
| Gather | `skills/gather.md` | Populate a document from tacit knowledge |
| New Component | `skills/new-component.md` | Create a standard UI component |
| Render HTML | `skills/render-html.md` | Produce a fully self-contained HTML file |
| RTL | `skills/rtl/` | Apply RTL layout rules and convert components to Hebrew RTL (Figma and HTML) |
| Preview Server | `skills/preview-server/` | Serve HTML mockups locally with an auto-generated tree-view index |
| FigJam | `skills/figjam/` | FigJam board setup, page structure, grouping standards, and visual collaboration |
| Figma Roundtrip | `skills/figma-roundtrip/` | Transfer UI components between HTML/CSS and Figma |
| UX Expert | `skills/ux-expert/` | Review designs and audit UIs grounded in the 30 Laws of UX |
| Skill Creator | `skills/skill-creator/` | Create or update a skill file |
| Transcript Ingestion | `skills/transcript-ingestion/` | Extract decisions, constraints, and open questions from meeting transcripts and reconcile against existing artifacts |
| Deloitte PPTX | `skills/deloitte-pptx/` | Create Deloitte-branded PowerPoint files using the official template (Python / python-pptx) |
| Deloitte PPTX Node | `skills/deloitte-pptx-node/` | Create Deloitte-branded PowerPoint files using Node.js / pptxgenjs (when Python is unavailable) |
| Figma Build | `skills/figma-build/` | Translate a visual design spec into Figma screens via the Plugin API — pre-flight, incremental build workflow, and reusable code patterns |
| Figma Borrow | `skills/figma-borrow/` | Locate, subscribe, and instance a UI atom component (radio, checkbox, input, etc.) from an indexed design library — library-agnostic, per-project index file |

### Studio Projects

Active governed projects are tracked in `.harness/01_PROJECT.md`.

---

## How to Navigate

- **Starting a session** — run `/harness`. It reads active memory and confirms project state.
- **Working on a structured deliverable** — load the relevant format file from `formats/`.
- **Performing a specific operation** — load the relevant skill from `skills/`.
- **Deeper protocol or build detail** — read `.harness/02_PRD.md` or `.harness/03_BUILD.md`.

---

## Operating Rules

These apply to all governed projects.

### Output format
- Default to plain `.md` files for analysis, comparisons, and reports. Do not use interactive widgets, artifacts, or rich visualizations unless explicitly requested. Token efficiency matters.

### Product discipline
- **Product decisions → PRD:** Product decisions made in a session must be written into the relevant PRD before closing. Do not leave decisions only in conversation context.
- **Open questions belong in the PRD.** Flag them explicitly — never leave them implicit or assume they'll be resolved later without being recorded.
- **Concept before spec:** Present concepts at the level of detail needed to open a productive client conversation — not at full specification. Over-specifying before the client has reacted closes down the discussion. Details get filled in through the conversation, not before it.
- **Recommendations vs. requirements:** If something arises from analysis but has not been explicitly requested by the client, do not design it in as an assumption. Log it as an open question in the relevant PRD and return to it when the client can confirm.
