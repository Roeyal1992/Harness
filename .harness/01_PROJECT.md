# Project Memory
## AI-Assisted Artifact Operating System
## Version 1.12

---

# 1. Purpose

This file is the active project memory and navigation layer for the Harness.

It tracks current project state, artifact status, active work, open decisions, promotion queue, guardrails, and next recommended actions.

It exists so a future operator or AI session can resume the project without relying on chat history.

---

# 2. Current Project Snapshot

The Harness is a governing instrument for AI-assisted project work. When applied to a host project, it deposits a `.harness/` directory — the project's knowledge cartridge — containing the active project memory, product intent, and build mechanics. `HARNESS.md` lives at the project root as the master index.

This repo is itself a governed instance of the Harness. The `.harness/` directory here is the Harness's own egg, tracking the development of the instrument itself. The recursive application is intentional.

The current standard artifact set:

- `HARNESS.md` — master index, at the project root
- `.harness/01_PROJECT.md` — active project memory
- `.harness/02_PRD.md` — stable product intent
- `.harness/03_BUILD.md` — stable build mechanics

Current status:

- `HARNESS.md` is stable at Version 2.0 (lean master index).
- `.harness/01_PROJECT.md` is active at Version 1.12.
- `.harness/02_PRD.md` is stable at Version 1.4.
- `.harness/03_BUILD.md` is stable at Version 1.4.

---

# 3. Artifact Map

| Artifact | Status | Role | Notes |
|---|---|---|---|
| `HARNESS.md` | v2.0 stable | Master index | Lean orientation and navigation layer. Protocol depth lives in `.harness/02_PRD.md` and `.harness/03_BUILD.md`. |
| `.harness/01_PROJECT.md` | v1.12 active | Active project memory | Owns current state, restart context, open decisions, guardrails, and next actions. |
| `.harness/02_PRD.md` | v1.4 stable | Stable product intent | Owns governing instrument framing, egg deployment model, users, needs, goals, MVP scope, functional requirements, non-goals, risks, assumptions, and future expansion areas including skills directory. |
| `.harness/03_BUILD.md` | v1.4 stable | Stable build mechanics | Owns canonical file map, deployment topology, artifact contracts, lifecycle mechanics, validation rules, editing discipline, changelog mechanics, optional artifact extension rules including skills directory, migration mechanics, and acceptance gates. |
| `.harness/04_METHOD.md` | v1.1 stable | Operator working method | Owns stable working conventions and collaboration discipline: layer navigation, default artifacts, structural edit process, governance standards. §7 Protocol-First Build Discipline added 2026-07-13. §8 Document Governance renumbered. |
| `.harness/05_IMPROVE.md` | v1.0 active | Improvement backlog | Staged observations (friction / feedback / success / meta) awaiting operator review. Evidence-accumulation model — one observation, many evidence items. Human-gated. |

---

# 4. Studio Projects

Active projects governed by the Harness. This map is the authoritative list — update it when a project is added, renamed, or retired.

## Formats in Use

| Format | File | Status |
|---|---|---|
| Strategic Deck | `formats/strategic-deck/FORMAT.md` | Active — v1.9, renamed + numbered layers |
| Product Design | `formats/product-design.md` | Active |

## Poalim Engagement

| Layer | Artifact | Status |
|---|---|---|
| L2 — Design system | `Poalim/design.md` | WIP |
| L3 — Matab / AI messaging | `Poalim/Domains/Matab/matab-ai/PRD-messaging.md` | Active |
| L3 — Matab / AI messaging | `Poalim/Domains/Matab/matab-ai/mockup-התכתבות.html` | Active |
| L3 — Matab / AI messaging | `Poalim/Domains/Matab/matab-ai/strings.js` | Active |
| L3 — Retail / Mifgash | `Poalim/Domains/Retail/Mifgash/PRD-mifgash.md` | WIP |
| L3 — Retail / Mifgash | `Poalim/Domains/Retail/Mifgash/mockup-מפגש.html` | Active |
| L3 — Retail / Mifgash | `Poalim/Domains/Retail/Mifgash/strings.js` | Active |
| L3 — Sales / Proposals | `Poalim/Domains/Sales/Proposals/PRD-sales.md` | WIP |
| L3 — Sales / Proposals | `Poalim/Domains/Sales/Proposals/mockup-מכירה-יוזמת.html` | Active |
| Component | `Poalim/Components/salesforce-top-nav/` | Active — v2.0 |
| Component | `Poalim/Components/customer-panel/` | Active |
| L3 — Mortgages / Manual pre-approval | `Poalim/Domains/Mortrages/manual-pre-approval/PRD.md` | Active |
| L3 — Mortgages / Manual pre-approval | `Poalim/Domains/Mortrages/manual-pre-approval/wireframes/banker-pre-approval-workspace-v2.html` | Active |
| Reference — Mortgages | `Poalim/Domains/Mortrages/regulatory-baskets-reference.md` | Active |

## Masa Engagement

| Layer | Artifact | Status |
|---|---|---|
| Cartridge | `Masa/proposal_deck/.harness/01_PROJECT.md` | Active — initialized 2026-07-19 |
| Cartridge | `Masa/proposal_deck/.harness/02_INTENT.md` | Active |
| Cartridge | `Masa/proposal_deck/.harness/03_LAYERS.md` | Active |
| L1 — Brief | `Masa/proposal_deck/MASA_Brief.md` | v1.0 — drafted, pending operator review |
| L3 — Design Conventions | `Masa/proposal_deck/MASA_Design.md` | v1.0 — complete, extracted from Figma 2026-07-19 |
| Source input | `Masa/proposal_deck/resources/slide_summary.md` | Complete |

## Isracard Engagement

| Layer | Artifact | Status |
|---|---|---|
| Initiative — Zebra Screen Adaptation | `Isracard/Zebra Screen Adaptation/.harness/01_PROJECT.md` | Active |
| Initiative — Zebra Screen Adaptation | `Isracard/Zebra Screen Adaptation/.harness/02_PRD.md` | Active |
| Initiative — Zebra Screen Adaptation | `Isracard/Zebra Screen Adaptation/protocol.md` | Active |

## Studio Skills

| Skill | File | Status |
|---|---|---|
| Component extraction | `Projects/_skills/component-extraction.md` | Active |
| Strings setup | `Projects/_skills/strings-setup.md` | Active |

## Harness Skills

| Skill | File | Status |
|---|---|---|
| Deploy | `skills/deploy.md` | Active |
| Adopt | `skills/adopt.md` | Active |
| Assess | `skills/assess.md` | Active |
| Promote | `skills/promote.md` | Active |
| Prune | `skills/prune.md` | Active |
| Wrap-up | `skills/wrapup.md` | Active |
| Migrate | `skills/migrate.md` | Active |
| Gather | `skills/gather.md` | Active |
| New Component | `skills/new-component.md` | Active |
| Render HTML | `skills/render-html.md` | Active |
| RTL | `skills/rtl/` | Active |
| Preview Server | `skills/preview-server/` | Active |
| FigJam | `skills/figjam/` | Active |
| Figma Roundtrip | `skills/figma-roundtrip/` | Active |
| UX Expert | `skills/ux-expert/` | Active |
| Skill Creator | `skills/skill-creator/` | Active |
| Transcript Ingestion | `skills/transcript-ingestion/` | Active |
| Deloitte PPTX | `skills/deloitte-pptx/` | Active |
| Deloitte PPTX Node | `skills/deloitte-pptx-node/` | Active |
| Figma Build | `skills/figma-build/` | Active |

---

# 5. Current Path Forward

The current path forward is maintenance and use, with ongoing consolidation to reduce governance fragmentation.

Default next action:

Use the package as the stable governing instrument for future AI-assisted project work.

If the operator says "continue" in a future session, the AI should:

1. read `HARNESS.md`
2. read this `.harness/01_PROJECT.md`
3. confirm the package is stable
4. ask what artifact or downstream project the operator wants to work on next
5. avoid reopening completed work unless the operator explicitly requests it

---

# 6. Active Work in Progress

No active work items.

Future work should begin only if the operator asks to:

- use the package to govern a new or in-progress project
- revise one of the four canonical artifacts
- add a new skill to `skills/`
- create a downstream implementation package

---

# 7. Recent Trail

## 2026-05-28 — Initial package development

All four canonical artifacts were drafted, a legacy instruction review was completed, and the package was declared stable at versions 1.1–1.3.

## 2026-06-09 — Governing instrument reframe

The governing instrument concept, `.harness/` egg deployment model, recursive self-hosting logic, and skills directory were introduced across all four artifacts. Versions bumped: `HARNESS.md` → v1.3, `01_PROJECT.md` → v1.4, `02_PRD.md` → v1.2, `03_BUILD.md` → v1.2.

## 2026-06-09 — Pruning pass complete

Over-engineering identified and pruned across all four files. Completed promotions tables, detailed session trails, resolved decisions, consistency pass records, the conceptual data model, and software-specific language removed. All artifacts tightened to essential content. Versions: `HARNESS.md` v1.4, `01_PROJECT.md` v1.5, `02_PRD.md` v1.3, `03_BUILD.md` v1.3.

## 2026-06-09 — Skills directory introduced

`skills/` directory created at project root. Skill format contract and catalog established in `skills/README.md`. Initial skills: `deploy.md`, `assess.md`, `prune.md`, `promote.md`. `HARNESS.md` thinned to pointer model — promotion/pruning detail moved to skills, Section 18 introduces the skills directory. `HARNESS.md` bumped to v1.5.

## 2026-06-10 — Responsibility boundaries resolved with studio CLAUDE.md

Studio `Projects/CLAUDE.md` analyzed for responsibility competition with `HARNESS.md`. Determined pure split: CLAUDE.md owns studio work product and knowledge architecture; HARNESS.md owns AI collaboration methodology. Three items transferred: session close-out mechanics, promotion mechanics, and "Decisions Must Be Captured" principle. CLAUDE.md revised to v1.4. The two documents were declared independent and non-competing. HARNESS.md bumped to v1.8.

## 2026-06-14 — Operator-speaks-freely principle promoted to protocol

New principle added to `HARNESS.md §19.4` and `formats/layered-deck.md`: the operator speaks in terms of the work, not the layer stack. `HARNESS.md` bumped to v1.9; `layered-deck.md` bumped to v1.3.

## 2026-06-11 — Deployment model clarified: cartridge only

`HARNESS.md` has exactly one home — the Harness repo, where it self-governs. Any governed project gets only a `.harness/` cartridge. `skills/deploy.md` and `skills/adopt.md` patched.

## 2026-06-10 — Claude Code wiring complete

`CLAUDE.md` created at repo root (`@HARNESS.md`). `/harness` slash command created at `.claude/commands/harness.md`.

## 2026-06-10 — Governing protocol renamed

`00_INSTRUCTIONS.md` renamed to `HARNESS.md`. All references updated across all artifacts and skills.

## 2026-06-09 — Skills directory expanded

`adopt.md` and `wrapup.md` added. `skills/README.md` updated.

## 2026-06-09 — Direct-edit fix pass complete

All paste-it-in remnants removed across all files and `skills/prune.md`.

## 2026-06-28 — Governance consolidation: single source of truth

`HARNESS.md` rewritten as lean master index (v2.0) — 22-section protocol replaced with orientation layer, ecosystem map, and navigation guide. Protocol depth remains in `.harness/02_PRD.md` and `.harness/03_BUILD.md`. `formats/product-design.md` updated to v1.2 — File Classification and Figma Export Protocol sections added, promoted from `Projects/CLAUDE.md`. Studio ecosystem map promoted from `Projects/CLAUDE.md` into this file (Section 4). `Projects/CLAUDE.md` reduced to `@HARNESS.md` — single source of truth established.

## 2026-07-12 — Skills registry audit: 11 unregistered skills surfaced and registered

Discovered that `HARNESS.md` skills table and `01_PROJECT.md` were significantly out of date — 11 skills existed on disk but were not registered anywhere: gather, new-component, render-html, preview-server, figjam, figma-roundtrip, ux-expert, skill-creator, transcript-ingestion, deloitte-pptx, deloitte-pptx-node. All registered in `HARNESS.md` skills table and `01_PROJECT.md`. Root cause: no enforcement mechanism ensures that skill creation (a write to `skills/`) is always paired with a registration write.

## 2026-07-20 — Self-improvement pipeline overhauled

Four changes: (1) `turn-counter.ps1` switched from terminal stdout to `hookSpecificOutput.additionalContext` — the reminder is now injected into the AI's context, not just displayed in the terminal. (2) Reminder message extracted to `.claude/hooks/capture-reminder.md` so it can be tuned without touching the script. (3) `/self-improve` Step 1 rewritten — AI now scans conversation context for capture signals (corrections, redirections, friction, approval) before asking the operator anything; operator role shifts from reporter to validator. (4) `05_IMPROVE.md` restructured: archive section removed (the changed artifact + trail entry is the record), file reduced to active backlog only. IMP-004 (plugin API/MCP boundary) and IMP-008 (backlog edit duplication) promoted — fixes applied to `figma-build/SKILL.md` and `05_IMPROVE.md` respectively. IMP-009 (operator-placed component rule) confirmed already resolved in `figma-build/references/component-selection.md`. IMP-010 remains open pending live test of `additionalContext` injection.

## 2026-07-14 — Self-improvement pipeline built

New governance organ: the self-improvement pipeline. Four components: `05_IMPROVE.md` (governance backlog with evidence-accumulation model), `/self-improve` slash command (check-first flow — matches existing observation or opens new one), Stop hook with `turn-counter.ps1` (reminder every 4 turns), and wrapup steps 11–12 (backlog review + meta-check). `meta` introduced as a fourth observation type, making the pipeline itself a valid observation target — AI's responsibility to surface, not the operator's. FigJam board `kH9ldALRcqdsmFbwYGD2Yu` visualises the pipeline (mode diagram) and system components (moving parts diagram). Backfilled IMP-001–007 from this session; IMP-003/004 remain open in backlog.

## 2026-07-14 — Isracard Zebra — Credit Payment section closed

S9c (Hyp secure payment page) completed by operator. Credit Payment section (S9a–S9c) now complete. Zebra Screen Adaptation paused.

## 2026-07-13 — figma-build skill added

New Harness skill: `skills/figma-build/` — bridges design spec to Figma Plugin API code. Motivated by friction in the Isracard Zebra Screen Adaptation session: the figma-use MCP skill covers the Plugin API, but nothing covered how to translate a Harness design spec into code without re-deriving patterns each time. Skill owns: pre-flight workflow, 3-call incremental build pattern, and a `references/plugin-patterns.md` with copy-paste scaffolds (color object, mkText, overlay/scrim, radio row, column table row, filter row, × close button). Deliberately project-agnostic — no references to specific file conventions.

## 2026-07-13 — Isracard client added

New client registered: Isracard. Initiative: Zebra Screen Adaptation — adapting Hebrew RTL retailer billing tablet UI to 320px Zebra handheld screens. Harness cartridge created at `Isracard/.harness/`. 9 screens complete (S1–S8); 5 flows remaining. Design system and protocol promoted from Figma into `02_PRD.md`.

## 2026-07-12 — RTL skill added

New global skill: `skills/rtl.md` — covers core RTL principles (medium-agnostic) plus tool-specific implementation sections for Figma and HTML. Key insight documented: in Figma, HUG-width text nodes ignore `textAlignHorizontal`; visual position is controlled by the parent frame's `counterAxisAlignItems`. Registered in `HARNESS.md` skills table. Motivated by Poalim mortgage calculator work where RTL alignment errors on the v4 stacked card frame exposed the need for a single reusable reference.

## 2026-07-01 — Workspace consolidated under `Studio/`; new `preview-server` skill added

Triggered by a `Studio/` folder consolidation (Harness and Projects, previously siblings under `Roey - Personal\`, copied under one root so the Claude Code Desktop sidebar renders the full tree). Added `CLAUDE.md` at the `Studio/` root (`@Harness/HARNESS.md`) so governance loads regardless of which subfolder is active. Session-scoped migration detail lives in `Studio/SESSION_HANDOFF.md`, not here — it is transient state, not durable artifact history.

New skill: `skills/preview-server/SKILL.md` (+ `scripts/serve.js`) — serves a project's HTML mockups from one Node server with a live-updating, tree-view index (titleized paths, light/dark, no build step), plus a `/__preview?src=` device-preview toolbar (iframe-isolated, resolution presets, two-axis scale-to-fit). Built iteratively against `Studio/Projects` as the first real consumer; fixed two bugs found along the way (URL-encoded paths 404ing, non-UTF-8 charset causing mojibake on bare-fragment mockups) and one layout bug in the toolbar itself (phantom scrollbar reservation skewing centering — fixed via `overflow: hidden`). A Ctrl+scroll zoom control was attempted and reverted — iframe event isolation means wheel events over mockup content never reach the parent document, so it silently failed in real use despite passing synthetic tests; not worth the injection workaround it would require.

Also consolidated `CX GenAI/appendix/06_SlideSpec_print.html` back into `06_SlideSpec.html` (print CSS folded into the single file's existing stylesheet, fork deleted) — the `layered-deck` format already specifies the Slide Spec should carry its own print CSS for Chrome-headless PDF export; the separate print fork was drift from that, not a deliberate design.

---

# 8. Open Decisions

No open decisions currently block use of the artifact package.

One residual item from the `Studio/` consolidation is tracked in `Studio/SESSION_HANDOFF.md`, not here: an empty, lock-held leftover folder at `Roey - Personal\Harness` needs manual deletion once OneDrive releases its lock. Filesystem cleanup, not a Harness governance decision.

---

# 9. Promotion Queue

No pending promotions remain.

---

# 10. Do Not Resurrect

Do not resurrect the old five-file package as the default artifact model.

Superseded model: `HARNESS.md`, `01_PRD.md`, `02_Build_Spec.md`, `03_Restart_Guide.md`, `04_Execution_Prompt.md`.

Do not treat the legacy Google Apps Script application as current product scope. It is historical source material only.

Do not make `04_EXECUTION.md` mandatory unless implementation complexity justifies it.

Do not create a separate changelog artifact unless change volume, collaboration complexity, or traceability requirements justify it.

Do not let this file become the permanent home for stable product or build truth.

Do not duplicate full governance rules across all artifacts.

Do not load `HARNESS.md` in full as session context — it is a master index, not a protocol dump.

---

# 11. Restart and Resume Protocol

A future session should resume as follows:

1. read `HARNESS.md`
2. read this `.harness/01_PROJECT.md`
3. confirm the package is stable
4. inspect artifact status if needed
5. proceed with the operator's requested artifact or downstream project task

If the operator says "continue," the default response should be:

The artifact package is stable. What would you like to use it for next?

Do not reopen completed work unless the operator explicitly asks.

---

# 12. Document Governance

## 12.1 This file owns

Current project memory and restart context: project snapshot, artifact status, studio projects map, active work, recent trail, open decisions, promotion queue, guardrails, restart protocol, and next actions.

## 12.2 This file does not own

- Reusable collaboration protocol → `.harness/02_PRD.md`
- Stable build mechanics → `.harness/03_BUILD.md`
- Format-specific mechanics → `formats/`
- Skill procedures → `skills/`

## 12.3 Update this file when

Project phase, artifact status, studio project map, active work, open decisions, or promotion queue changes.

## 12.4 Do not update this file when

Only reusable protocol, product intent, or build mechanics change without affecting project state.

## 12.5 Conflict behavior

For current project state, this file has authority over `.harness/02_PRD.md` and `.harness/03_BUILD.md`. Defers to `HARNESS.md` for orientation, and to direct operator instruction for the current task.

---

# 13. Final Summary

The Harness is a governing instrument that deposits a `.harness/` knowledge cartridge onto any host project it governs. This repo is itself a governed instance — the recursive demonstration of the concept.

Current package versions:

- `HARNESS.md` v2.0 (lean master index)
- `CLAUDE.md` (entry point, no version)
- `.claude/commands/harness.md` (slash command, no version)
- `.harness/01_PROJECT.md` v1.12
- `.harness/02_PRD.md` v1.4
- `.harness/03_BUILD.md` v1.4
- `formats/layered-deck.md` v1.5
- `formats/product-design.md` v1.2
- `skills/`: deploy, adopt, assess, prune, promote, wrapup, migrate, gather, render-html, new-component, preview-server, rtl
