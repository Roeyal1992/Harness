# Skill: Adopt
## Retroactively Apply the Harness to an In-Progress Project

---

## Purpose

Initialize the Harness on a project that is already underway. Unlike `deploy.md`, which creates artifacts from scratch, adoption requires discovering what the project is, surfacing assumptions the designer has not yet written down, and populating the artifact package honestly — including explicit uncertainty markers where things have not been confirmed.

---

## When to use

- A project is already in progress and the Harness is being adopted as a governance layer
- Existing documentation exists but is scattered, informal, or not structured for AI collaboration
- The designer wants a governed artifact package without reconstructing the project from scratch

---

## Procedure

### Phase 1 — Scan

1. Identify all available project context: README, existing docs, prior PRDs or specs, tickets, code structure, prior AI conversations if accessible
2. Read everything available and build a preliminary picture:
   - what does the project appear to do
   - who does it appear to be for
   - what has been built or decided
   - what appears to be actively in progress
   - what looks uncertain, contradictory, or undocumented
3. Note what is explicit (written down) vs. what is inferred — inferences become the questionnaire's starting points

---

### Phase 2 — Interview

The interview surfaces what is not written anywhere. Work through the topics below conversationally — one topic at a time, not all at once. Skip items the scan already answered clearly. Probe deeper where the scan revealed gaps, contradictions, or ambiguity.

**Project identity**
- What problem is this project solving?
- Who is it for? What does a typical user look like?
- Why is this being built now — what changed or what's the forcing function?

**Current state**
- What has already been decided that should not be reopened?
- What has been built or is fully in progress?
- What is currently blocked or unclear?

**Goals and scope**
- What does success look like at the end of the project?
- What is the MVP boundary — what is the minimum that makes the project useful?
- What is explicitly out of scope, even if related?

**Constraints and assumptions**
- What technical, platform, or integration constraints exist?
- What assumptions are you making that have not been confirmed by a user, stakeholder, or implementation test?
- Are there stakeholders whose requirements are not yet documented?

**Risks and unknowns**
- What are you most uncertain about?
- What would cause the project to stall or go sideways?

**Governance preferences**
- How do you want to use the Harness going forward — which artifacts will you update most often?
- Are there things the AI should not change or reopen without explicit instruction?

---

### Phase 3 — Initialize

1. Identify the deliverable format — ask the operator which format applies (e.g., `product-mockup`, `layered-deck`) and load the relevant file from `formats/`. If the scan already makes the format obvious, name it and confirm rather than asking. Record the chosen format in `01_PROJECT.md`.
2. Populate `.harness/01_PROJECT.md` with:
   - current phase and active work, based on what was confirmed
   - active format name
   - open decisions — especially assumptions surfaced during the interview that have not yet been validated
   - do-not-resurrect notes for any decisions the designer closed definitively
   - mark the adoption in the trail: date, what was scanned, what was confirmed vs. assumed
3. Populate `02_*` and `03_*` per the **Cartridge Structure** section of the active format file — use the exact filenames, roles, and sections described there:
   - mark any section derived from inference rather than confirmed designer intent as `(unconfirmed — see 01_PROJECT.md)`
   - stub out unknown sections explicitly rather than leaving them blank
4. The `.harness/` cartridge is the only governance artifact that belongs in the project. Do not place or copy `HARNESS.md` here — it lives exclusively in the Harness repo
5. Run `skills/assess.md` as a post-adoption health check before declaring the package initialized

---

## Notes

- The interview is a conversation, not a form — ask one topic at a time and follow up on gaps before moving on
- Unconfirmed assumptions must be marked explicitly in the artifacts so future sessions know what still needs validation; do not silently absorb inferences as facts
- The adopted package is a starting point — expect more iteration than a greenfield deployment; the first few sessions will likely refine the PRD significantly
- If the scan reveals that a prior artifact package already exists (e.g., a legacy spec or instructions file), assess whether its content should be promoted, pruned, or ignored before populating the new package
- Related skills: `skills/deploy.md` (new projects), `skills/assess.md` (post-adoption health check)
