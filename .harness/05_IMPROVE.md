# Improvement Backlog
## Harness Self-Improvement System
## Version 2.0

---

## Purpose

Staging buffer between observation and artifact change. Entries are human-gated — nothing promotes automatically.

When an entry is promoted, it leaves this file. The changed artifact is the record; the `01_PROJECT.md` trail captures what changed and why at the session level.

**This file, the `/self-improve` command, and the capture flow are themselves valid observation targets.** `meta` observations are the AI's responsibility to surface — not the operator's job to catch.

---

## Entry Structure

```
## IMP-NNN · <type> · <status>
**Observation:** generalized pattern — what class of behavior this represents
**Proposed outcome:** target experience or flow — what better looks like (not the fix)
**Improvement proposal:** specific intervention — which artifact, what type of change

**Evidence:**
1. YYYY-MM-DD — concrete occurrence: what exactly happened
```

**Types:** `friction` · `feedback` · `success` · `meta`
**Status:** `captured` → `reviewing` → `promoted` / `dismissed`

A single evidence item is a hunch. Multiple items across sessions is a pattern — and a stronger basis for a well-calibrated proposal.

---

## Backlog

> **Editing rule:** Always insert new entries at the top of this section. Read the full Backlog before editing — prevents duplicate IDs and misplaced insertions.

---

## IMP-010 · meta · captured

**Observation:** The capture reminder fires to terminal stdout only — the AI never sees it. Capture in long sessions depends entirely on the AI proactively noticing and surfacing observations mid-turn, which is a weak and unenforced signal.

**Proposed outcome:** The reminder is visible inside the conversation so the AI is prompted to act on it in the next turn — capture happens without operator intervention.

**Improvement proposal:** Change `turn-counter.ps1` to output the reminder via `hookSpecificOutput.additionalContext` so Claude Code injects it into the AI's context. Wire the message content to a readable `.md` file so it can be tuned without touching the script.

**Evidence:**
1. 2026-07-20 — Long session produced no observations in `05_IMPROVE.md`. Hook fired correctly but AI never saw the reminder. Operator had to manually diagnose the gap.
