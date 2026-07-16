---
name: layered-deck
description: "Govern the production of structured knowledge artifacts — decks, reports, proposals, frameworks — using a layered document model. Use when a project produces a client-facing or stakeholder-facing structured deliverable that requires argument-level decisions to be locked before execution begins. Instantiates the universal layered deliverable governance in .harness/02_PRD.md §16 for the deck format."
---

# Format: Layered Deck
## Structured Knowledge Artifact Production

This format governs any project producing a structured knowledge artifact — a deck, a report, a proposal, a framework. It defines the cartridge structure, layer model, governance rules, and AI behavior for this type of work.

It instantiates the universal principles in `.harness/02_PRD.md §16`. Those principles govern; this file provides the deck-specific mechanics.

---

## Cartridge Structure

The `.harness/` directory for a layered deck project contains:

| Artifact | File | Holds |
|---|---|---|
| Active memory | `01_PROJECT.md` | Current phase, open decisions, next actions, change trail |
| Project intent | `02_INTENT.md` | Project purpose, deliverable scope, key intellectual commitments. Pointer to the full Brief (anchor layer). |
| Layer map | `03_LAYERS.md` | Layer file map, governance protocol reference, build tool reference, CX-specific overrides |

### 01_PROJECT.md — Active Memory
Current phase, what layers are complete, what decisions are open, what the next action is. The restart-safe state of the project. Universal across all formats — always present.

### 02_INTENT.md — Project Intent
A lean orientation document: what this project is, who it is for, and a pointer to the Brief as the authoritative source of product intent. Does not duplicate the Brief — it points to it.

### 03_LAYERS.md — Layer Map
A navigational reference: where the layer files live, what format skill governs them, what build tool is used for execution, and any project-specific overrides to the format defaults.

> **Note on existing projects:** Projects initialized before this standard was set may use `02_PRD.md` and `03_BUILD.md` instead. These are functionally equivalent — the vocabulary is different, not the intent.

### resources/ — Input Material
A directory at the project root (not inside `.harness/`) holding input material that feeds the Brief and Rationale. Contains two types of artifacts:

- **`author.md`** — the author's own tacit knowledge, framings, examples, and perspective on the topic. Gathered before drafting the Rationale, anchored loosely to the arc from the Brief. Archived once Layer 2 is complete.
- **Knowledge artifacts** — external sources: reading notes, research summaries, source audits. Named `[ProjectCode]_[SourceName]_ReadingNotes.md`.

Both types inform the Brief and Rationale but do not govern them.

---

## The Layer Model

Every deck project produces documents across multiple levels of abstraction. The core model has three layers; projects that produce client-facing content in a language other than the working language, or that require visual validation before build, will expand to five or six layers.

| Layer | Name | Language | File type | Role |
|---|---|---|---|---|
| 1 | Brief | English | `.md` | **Anchor layer** — consensus-gated |
| 2 | Rationale | English | `.md` | Argument structure and narrative logic |
| 2.5 | Content Normalization *(conditional)* | Client language | `.md` | Language adaptation; vocabulary lock |
| 3 | Design Conventions *(conditional)* | English | `.md` | Visual grammar before build |
| 3.5 | Slide Spec *(conditional)* | Client language + English | `.html` | Layout validation before execution |
| 4 | Execution | Client language | `.pptx` | The actual deliverable |

Layers 2.5, 3, and 3.5 are optional for simple projects but become essential when: the client-facing language differs from the working language; a brand system with specific constraints applies; or visual layout validation is needed before committing to a full build.

---

## Layer Descriptions

### Layer 1 — The Brief (Anchor Layer)

**What it is:** The why and the what. The situation, the intellectual anchor, the scope of deliverables, the non-negotiable conceptual commitments, and the open questions.

**What it does not do:** Describe slides, sections, or execution details.

**The test:** Can someone read this and know exactly what we are trying to accomplish, why it matters, and what the guardrails are — without knowing anything about the execution?

**Governance:** Consensus-gated. No change is made unilaterally. Changes require explicit alignment and are logged in the brief's revision log.

**File naming:** `[ProjectCode]_Brief.md`

---

### Layer 2 — The Rationale

**What it is:** The how and in what order. A slide-by-slide or section-by-section narrative logic document. Describes why each unit exists, what argument it makes, and why it earns the next one. Includes theoretical framework attribution and consolidated source links.

**What it does not do:** Design visuals, write final copy, or make positional commitments not already established in the brief.

**The test:** Can someone read this and reconstruct the argument of the deck without seeing a single slide? Does each unit justify the next?

**Governance:** Owned by the project lead. Can be updated more fluidly than the brief, but any update that implicitly changes a positional commitment must trigger a brief review.

**File naming:** `[ProjectCode]_Rationale.md`

---

### Layer 2.5 — Content Normalization *(conditional)*

**What it is:** The rationale translated and adapted into the client-facing language, with an explicit controlled vocabulary section. Fixes terminology before any design work begins — so word choices can be edited without touching the argument.

**What it does not do:** Introduce new positions, reorder slides, or change conceptual commitments. Any such change must flow upward to the rationale first.

**The test:** Can someone edit a word choice in this document without inadvertently changing the argument?

**Governance:** Vocabulary section is editable by the project lead. Argument-level changes require rationale review first. Open questions are declared explicitly and tracked until resolved.

**File naming:** `[ProjectCode]_Content_[LanguageCode].md`

---

### Layer 3 — Design Conventions *(conditional)*

**What it is:** The visual grammar of the deliverable, established before any slide is built. Color assignments per concept, layout types, typography hierarchy, recurring structural elements, and a slide blueprint table.

**What it does not do:** Write content, make argument decisions, or substitute for the rationale.

**The test:** Can any new slide added to the deck be designed correctly using only this document and the slide spec?

**Governance:** Owned by the project lead. Open questions are declared explicitly. Conventions added mid-project are noted in the revision log.

**File naming:** `[ProjectCode]_Design.md`

---

### Layer 3.5 — Slide Spec *(conditional)*

**What it is:** An HTML file rendering all slides at correct proportions, with actual content strings in the client-facing language. It sits between the content and design layers and the execution build — serving three distinct functions that make it worth maintaining as its own layer.

**The three functions of the Slide Spec:**

1. **Layout validation** — confirms content fits containers, column logic works, and no element is obviously too long or short, before any PPTX build begins.
2. **Review artifact** — Chrome Headless renders the HTML to a one-slide-per-page PDF via print CSS. Reviewers see the deck without opening PowerPoint. No toolchain required on the reviewer's end.
3. **Build source of truth** — PPTX generation scripts read from or are authored directly from the Spec: content strings, layout positions, color assignments, and column structure. The Spec is the contract between content intent and build execution.

A fourth benefit: hyperlinks embedded in the Spec survive as clickable references in a way that PPTX footnotes do not. Source citations with live URLs belong in the Spec, not only in the final build.

**What it does not do:** Apply full brand design, embed brand fonts, or substitute for the final deliverable. It is layout-correct but not brand-complete.

**The test:** Can a reviewer confirm — (a) content is correct, (b) layout logic holds, (c) no element is obviously misfit — before a single line of PPTX code is written?

**Editing rule:** Do not edit the Spec directly when a change implies an argument or content decision. In that case: update the upstream MD layer first, then propagate to the Spec. Direct edits to the Spec are appropriate only for execution-layer changes — hyperlink updates, source citations, copy tweaks — that do not imply an upstream decision.

**Pilot-first rule:** When transitioning from Spec to PPTX build, always build one representative slide first. Validate layout fidelity, font rendering, and RTL behavior before scaling to the full deck. A failed pilot on slide 1 is cheap; discovering the same issue on slide 10 is not.

**PDF generation:** Use Chrome Headless with print CSS (`page-break-after: always` per `.slide-section`, `@page` set to slide dimensions). This requires no Python or Office installation — only Chrome, which is available on most corporate machines.

**Governance:** The Spec is a derived artifact — it is always downstream of the MD layers. When content changes, the Spec follows. When the Spec surfaces a layout problem, the fix is evaluated at the correct upstream layer before propagating down.

**File naming:** `[ProjectCode]_SlideSpec.html`

---

### Layer 4 — The Execution

**What it is:** The actual deliverable — slides, pages, screens.

**What it does not do:** Introduce new arguments, positional commitments, or framings not present in the rationale and traceable to the brief.

**The test:** Can every slide or section be justified by pointing to a specific entry in the rationale?

**Governance:** Most fluid layer. Changes that affect argument or position must flow upward before flowing downward.

---

## Deck-Specific Governance Rules

### Positional commitments belong in the brief, not just in the rationale

If a sequencing or framing decision reflects a genuine intellectual position — not just a design preference — it belongs in the brief. A decision that lives only in the rationale is vulnerable to drift.

### The brief is the only layer that is consensus-gated

The rationale and execution can be updated by the project lead without formal consensus. The brief cannot. This is what makes the brief trustworthy as a north star.

---

## AI Behavior in This Format

These rules extend and specialize the universal behavior defined in `.harness/02_PRD.md §16.4`.

**The operator speaks freely; the AI routes.** The operator makes notes about any aspect of the deck — a strategic concern, a content adjustment, a copy preference, a design call — without naming a layer. The AI identifies the correct layer, fetches it, makes the targeted edit, and checks whether downstream layers are now stale. Layer navigation is never the operator's job.

**Identify the layer before producing output.** Before writing anything, name which layer the output belongs to and confirm it is consistent with the layers above.

**Flag positional drift explicitly.** If a request to update the execution or rationale implies a change to the brief, name it: *"This change implies a shift in our positional commitment to X — should we update the brief before proceeding?"*

**Do not produce execution-layer output without a rationale.** If asked to write slides before a rationale exists, propose building the rationale first. The exception is rapid prototyping clearly labeled as exploratory.

**Capture working session decisions at the right layer.** Distinguish between: execution decisions (stay in the rationale), positional commitments (go in the brief), and open questions (go in the brief's open questions section until resolved).

---

## File Conventions

- All internal working documents are written in **English**, in **Markdown** — with one exception: the Content Normalization layer (2.5) is written in the client-facing language by design.
- DOCX and PPTX are produced only when explicitly requested for client-facing or formal deliverable purposes.
- Each layer has its own file. Layers are never merged.
- The slide spec is a derived artifact — never edited in place.

### File Naming Reference

| Layer | Pattern |
|---|---|
| 1 — Brief | `[ProjectCode]_Brief.md` |
| 2 — Rationale | `[ProjectCode]_Rationale.md` |
| 2.5 — Content Normalization | `[ProjectCode]_Content_[LanguageCode].md` |
| 3 — Design Conventions | `[ProjectCode]_Design.md` |
| 3.5 — Slide Spec | `[ProjectCode]_SlideSpec.html` |
| 4 — Execution | Project-specific (e.g. `[ProjectCode]_Deck.pptx`) |
| Author input | `resources/author.md` |
| Knowledge artifacts | `resources/[ProjectCode]_[SourceName]_ReadingNotes.md` |

---

## Revision Log Protocol

Every Layer 1 and Layer 2 document carries a revision log at the bottom:

| Version | Date | What changed | Triggered by |
|---|---|---|---|
| v1.0 | [date] | Foundation commit | Working session |

"Triggered by" records whether the change came from a client conversation, an internal working session, new research, or a decision to resolve an open question. This makes the document's evolution legible to anyone resuming the project.

---

## Format History

This format was developed through practice, not theory. It should be treated as a living document — update it when the practice reveals something the protocol did not anticipate.

| Version | Date | What changed |
|---|---|---|
| v1.0 | June 2026 | Foundation commit. Original three-layer model (Brief, Rationale, Execution). |
| v1.1 | June 2026 | Expanded to six-layer model: added Layer 2.5 (Content Normalization), Layer 3 (Design Conventions), Layer 3.5 (Slide Spec HTML). Language rule documented. |
| v1.2 | June 2026 | Extracted from `Layered_Document_Governance_Protocol.md` into Harness `formats/` directory. Universal governance principles promoted to `HARNESS.md §19`. Deck-specific mechanics retained here. |
| v1.3 | June 2026 | Added "operator speaks freely; AI routes" principle to AI Behavior section. Reinforces `HARNESS.md §19.4` addition — layer navigation is never the operator's job. |
| v1.4 | June 2026 | Enriched Layer 3.5 (Slide Spec) with three-function model (layout validation / review artifact / build source of truth), editing rule (upstream-first for argument changes, direct-edit OK for execution-layer changes), pilot-first rule for Spec→PPTX transition, and Chrome Headless PDF generation note. Promoted from CX GenAI appendix project practice. |
| v1.5 | June 2026 | Added `resources/` directory to Cartridge Structure. Introduced `author.md` as a named artifact for the author's tacit knowledge, alongside existing knowledge artifacts. Renamed Knowledge Artifacts section to Resources. Updated File Naming Reference. Promoted from CTX Knowledge Share project practice. |
| v1.6 | 2026-06-28 | Updated references from `HARNESS.md §19` to `.harness/02_PRD.md §16` — universal layered governance principles promoted to product intent artifact as part of governance consolidation. |

---

## Resources

Projects maintain a `resources/` directory at the project root for input material that feeds the Brief and Rationale.

### Author Input

`author.md` captures the author's own tacit knowledge — framings, examples, opinions, and perspective on the topic. It is the primary input when the deck's content lives in the author's head rather than in existing documents. Populate it before drafting the Rationale, loosely anchored to the arc already established in the Brief. Archive or retain for reference once Layer 2 is complete.

To populate `author.md` or any other document from tacit knowledge, run `skills/gather.md`.

### Knowledge Artifacts

External sources — reading notes, research summaries, source audits — that inform the Brief and Rationale but do not govern them. Each artifact should include:
- A clear statement of what the source is and its validation status
- A distinction between what can be used freely (frames, concepts) and what requires verification before citation (statistics, specific claims)
- Links to primary sources where available
