# Improvement Backlog
## Harness Self-Improvement System
## Version 1.0

---

## Purpose

Staging buffer between Capture (observation) and Revision (artifact change). Entries are human-gated — nothing promotes automatically.

**This file, the `/self-improve` command, the capture flow, and the wrapup step are themselves valid observation targets.** `meta` observations about the pipeline are the AI's responsibility to surface — not the operator's job to catch.

The four modes:

| Mode | Who acts | What happens |
|---|---|---|
| **WORK** | AI | Operates under governance. Friction, feedback, or success is noticed. |
| **CAPTURE** | AI | Checks existing observations for a match. Appends evidence or opens a new entry. |
| **REVIEW** | Operator | Reads entries, weighs evidence, decides scope and intervention. Marks `reviewing`. |
| **REVISION** | AI + Operator | Artifact updated. Entry marked `promoted` and moved to Archive. |

---

## Entry Structure

Each entry is a section, not a table row — so evidence items can be appended over time.

```
## IMP-NNN · <type> · <status>
**Observation:** generalized pattern — what class of behavior this represents
**Proposed outcome:** target experience or flow — what better looks like (not the fix)
**Improvement proposal:** specific intervention — which artifact, what type of change

**Evidence:**
1. YYYY-MM-DD — concrete occurrence: what exactly happened
2. YYYY-MM-DD — another occurrence (appended when a new event matches this observation)
```

**Types:** `friction` · `feedback` · `success` · `meta` (observation about the improvement pipeline or Harness governance system itself)  
**Status:** `captured` → `reviewing` → `promoted` / `dismissed`

A single evidence item is a hunch. Multiple items across different sessions or contexts is a pattern — and a much stronger basis for a well-calibrated improvement proposal.

---

## Backlog

---

## IMP-009 · feedback · captured

**Observation:** When the operator places a component on the canvas as a reference, the AI treats it as the working copy — detaching or removing it — rather than creating a fresh instance from the source component to operate on.

**Proposed outcome:** A component the operator places is never touched. The AI always derives its working copy from the source component independently, leaving the operator's placed instance intact as a reference.

**Improvement proposal:** Add a rule to the figma-build skill and to `04_METHOD.md`: when a user-placed component is used for inspection or as a pattern to follow, create a new `sourceComp.createInstance()` as the working copy. Never call `detachInstance()` or `remove()` on a node the operator placed.

**Evidence:**
1. 2026-07-14 — Operator placed `📝 Popover/Record preview` (`1161:66506`) as a reference. Called `detachInstance()` on it and later `remove()`d the detached frame. Operator: "bad decision to remove the component I placed - didn't ask for it."
2. 2026-07-14 — Operator's restored copy (`1180:4990`) was consumed the same way in the next build pass. Operator: "again with deleting the original component."

---

## IMP-004 · friction · captured

**Observation:** Figma plugin API and Figma MCP tool calls get confused — MCP capabilities are attempted from inside plugin script code.

**Proposed outcome:** Plugin API and MCP boundaries are always correctly distinguished — cross-boundary calls don't happen and don't require a TypeError to diagnose.

**Improvement proposal:** Add a "plugin API vs MCP boundary" note to the figma-use skill: anything on the `figma` global is plugin API (runs inside the Figma sandbox); `get_screenshot`, `get_figjam`, `get_design_context` are MCP tools called at the orchestration layer, not inside `use_figma` scripts.

**Evidence:**
1. 2026-07-14 — Called `figma.getScreenshot()` at the end of a `use_figma` build script. Got `TypeError: no such property 'getScreenshot'`. The correct tool is the MCP `get_screenshot`, called as a separate tool call after the script completes.

---

## IMP-008 · meta · captured

**Observation:** Section-style backlog edits are prone to duplication when inserting a new entry near an existing one — the edit target is too narrow and the new content lands alongside rather than replacing.

**Proposed outcome:** Backlog edits are clean first-time — no duplicate entries require a correction pass.

**Improvement proposal:** When writing to `05_IMPROVE.md`, always read the full Backlog section before editing. Insert new entries at the top of the Backlog (after the section header), not near an existing entry with a similar ID.

**Evidence:**
1. 2026-07-14 — During wrapup, inserted IMP-004 by targeting the IMP-003 heading as the edit anchor. IMP-004 landed before IMP-003 but the original IMP-004 (already in the file) remained, creating a duplicate. Required a correction pass.

*No open observations.*

---

## Archive

Entries promoted or dismissed are moved here in full, evidence intact.

---

## IMP-003 · friction · promoted

**Observation:** Tooling files get placed in governance artifact directories rather than the appropriate Claude Code directory.

**Proposed outcome:** File placement decisions are made correctly by default — no corrections needed from the operator.

**Improvement proposal:** Add a directory ownership rule to `04_METHOD.md`.

**Evidence:**
1. 2026-07-14 — Placed `turn-counter.ps1` in `.harness/hooks/` instead of `.claude/hooks/`. Took one question from the operator to correct.

**Resolved:** 2026-07-14 — Added §5 Directory Ownership to `04_METHOD.md`.

---

## IMP-005 · friction · dismissed

**Observation:** PowerShell hooks written as inline `-Command "..."` strings break when the script contains `$variables`.

**Proposed outcome:** Hook scripts work correctly from the first attempt.

**Improvement proposal:** *(dismissed)* — The `-File` pattern is already demonstrated in `turn-counter.ps1`. The script is the documentation; a separate rule would add overhead without adding clarity.

**Evidence:**
1. 2026-07-14 — Wrote the Stop hook as `-Command "..."` with `$variables`. Variables expanded to empty strings. Switched to `-File` to fix.

**Dismissed:** 2026-07-14 — Existing script demonstrates the correct pattern. No governance artifact warranted.

---

## IMP-006 · feedback · promoted

**Observation:** Governance backlog entry formats designed as flat tables can't accommodate fields that need to grow over time.

**Proposed outcome:** Any capture format that might accumulate evidence or sub-items starts as a section-style structure, not a flat table row — no format redesign needed mid-build.

**Improvement proposal:** When designing any capture or logging format, check whether any field needs to hold a list before committing to a table. If yes, use section-style entries from the start.

**Evidence:**
1. 2026-07-14 — Designed the initial `05_IMPROVE.md` backlog as a flat markdown table. When evidence accumulation was introduced, the format required a complete structural redesign. The need for multi-item evidence lists was predictable from the concept.

**Resolved:** 2026-07-14 — Redesigned `05_IMPROVE.md` to section-style entries in the same session.

---

## IMP-007 · feedback · promoted

**Observation:** Entry fields conflate two conceptually distinct things when their roles aren't made explicit upfront — "proposed outcome" was mixing experience target with specific intervention.

**Proposed outcome:** Each field in a capture format has a single, named job — what better looks like is always separate from how to get there.

**Improvement proposal:** When designing capture formats, apply the outcome/intervention distinction from the first pass: outcome = target experience or flow; proposal = specific artifact change. Document in `05_IMPROVE.md` entry structure.

**Evidence:**
1. 2026-07-14 — Initial `05_IMPROVE.md` had a single "proposed outcome" field serving two roles. Operator pointed out the conflation; required splitting into "proposed outcome" (experience) and "improvement proposal" (intervention).

**Resolved:** 2026-07-14 — Split into two fields in the same session; distinction documented in entry structure.

---

## IMP-001 · friction · promoted

**Observation:** The AI re-derives decisions already documented in the protocol before acting.

**Proposed outcome:** Protocol decisions are taken immediately without re-derivation — no reasoning overhead before the first call.

**Improvement proposal:** Add a protocol-first build discipline rule to `04_METHOD.md`.

**Evidence:**
1. 2026-07-13 — Before building S9b, spent three turns re-deriving modal width, component IDs, and colors already answered in `protocol.md`. The protocol had all the answers; none were looked up before reasoning began.

**Resolved:** 2026-07-13 — Added §7 Protocol-First Build Discipline to `04_METHOD.md`.

---

## IMP-002 · feedback · promoted

**Observation:** The AI builds UI components from primitives instead of starting from the nearest existing component.

**Proposed outcome:** The AI starts from the nearest existing component without being asked — `createInstance() → detach() → modify`, not build from scratch.

**Improvement proposal:** Add the AlertCard-as-shell pattern to `protocol.md`; codify the component-first principle in `04_METHOD.md §7`.

**Evidence:**
1. 2026-07-13 — Built S9b credit payment modal from scratch using `createAutoLayout` instead of detaching AlertCard `[80:291]`, which already provided the titled header and button footer for free.

**Resolved:** 2026-07-13 — Added form-modal-shell pattern to `protocol.md`; codified in `04_METHOD.md §7`.
