---
name: transcript-ingestion
description: This skill should be used when one or more meeting transcripts need to be ingested into a governed project — extracting product decisions, open questions, business rules, and contradictions, then reconciling them against an existing Discovery Log and PRD. Handles both new initiatives (no prior artifacts) and existing ones (artifacts already in place).
---

# Transcript Ingestion

## Purpose

To extract structured insight from meeting transcripts and reconcile it with an existing Discovery Log and PRD — without overwriting established knowledge or silently resolving contradictions.

The skill produces two outputs:
1. An updated (or newly created) **Discovery Log** — the intermediate staging artifact that accumulates all session insights in chronological order
2. A list of **PRD-ready promotions** — confirmed findings the operator can push to the PRD using the promote skill

## Core safety rule

A transcript is a partial, moment-in-time record. It does not contain everything ever established — only what happened to be discussed that day. The skill must never treat a new transcript as the authority over prior documented knowledge.

Specifically:
- **Silence is not retraction.** If existing content is absent from the new transcript, leave it untouched.
- **New does not mean correct.** If a transcript contradicts existing documented content, surface it — do not resolve it automatically.
- **Only the operator resolves contradictions.** No finding may be written to the Discovery Log or PRD until the operator has reviewed and confirmed any conflicts.

## Operating modes

Before doing anything, determine which mode applies:

**Mode A — New initiative:** No Discovery Log and no PRD exist yet.
- Create both artifacts from scratch using the templates in `references/`
- All extracted findings go directly to the Discovery Log as uncontested new content
- No reconciliation pass needed — skip to Write step

**Mode B — Existing initiative:** A Discovery Log, a PRD, or both already exist.
- Run the full reconciliation pass before writing anything
- Operator review gate is mandatory before any write

To determine mode: check for the existence of a `discovery-log.md` and `PRD.md` (or equivalent) in the project's `.harness/` or designated artifacts directory. If neither exists, use Mode A. If either exists, use Mode B.

## Step 1: Locate and read transcripts

Identify all transcript files provided or referenced by the operator. Read each one.

For format-specific handling (HTML with Windows-1255 encoding, PDF, DOCX, etc.), follow the procedures in `references/format-handling.md`.

Preferred format is plain UTF-8 `.txt`. If the operator has not yet converted the transcript, recommend doing so (Word → Save As → Plain Text → UTF-8).

## Step 2: Extract findings

From each transcript, extract the following finding types:

| Type | Definition |
|---|---|
| **Decision** | A product, UX, or business rule stated as settled by the participants |
| **Constraint** | A technical or regulatory limit that shapes the design |
| **Open question** | Something explicitly raised but not resolved in the session |
| **Contradiction** | A claim that conflicts with something in the Discovery Log or PRD |
| **Nuance** | A refinement or clarification of something already documented |
| **Deferred item** | Something acknowledged but explicitly pushed to a later session or phase |

For each finding, record:
- The finding type
- The substance of the finding (plain language, not a transcript quote)
- Attribution: who stated it and which session (date)
- Confidence level: **confirmed** (clear agreement in transcript) or **proposed** (raised but not fully agreed)

Do not extract conversational filler, technical problems (dropped connections, screen share failures), or tangential exchanges.

## Step 3: Reconcile (Mode B only)

Compare each extracted finding against the existing Discovery Log and PRD.

Classify each finding as one of:

| Classification | Condition | Action |
|---|---|---|
| **New** | Not present anywhere in existing artifacts | Queue for Discovery Log |
| **Confirming** | Consistent with existing content | Note confirmation; no rewrite needed |
| **Contradicting** | Conflicts with existing documented content | Flag for operator review — do not write |
| **Silent** | Existing content not mentioned in transcript | Leave untouched — do not delete or modify |

Build a contradiction list before writing anything. If contradictions exist, surface them to the operator (Step 4). If there are none, proceed directly to Step 5.

## Step 4: Operator review gate (Mode B, contradictions present)

Present contradictions clearly. For each:
- State what the existing artifact says
- State what the new transcript says
- State why they conflict
- Ask the operator to resolve: keep existing / accept new / flag as genuinely unresolved

Do not proceed to write until every contradiction has been resolved or explicitly flagged as unresolved by the operator.

Unresolved contradictions are written to the Discovery Log as open questions, not as decisions.

## Step 5: Write to Discovery Log

Update the Discovery Log with:
- A new session entry (date, participants, session title if available)
- All **new** findings, organized by type
- Any **confirming** findings worth noting (brief — just reference the existing item and note confirmation)
- All **unresolved contradictions** recorded as open questions

Follow the Discovery Log structure in `references/discovery-log-template.md`. For a new initiative, create the file from the template first.

Do not write to the PRD at this step.

## Step 6: Identify PRD-ready promotions

Review the updated Discovery Log for findings that are:
- Confirmed (not proposed)
- Not contradicted by anything unresolved
- Substantive enough to belong in the PRD (decisions, constraints, business rules — not conversational nuances)

Present these to the operator as a promotion candidate list. For each, indicate which PRD section it belongs in.

Ask the operator to confirm which items to promote. Then use the promote skill to execute the writes.
