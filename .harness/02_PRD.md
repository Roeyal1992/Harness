# Product Requirements Document
## AI-Assisted Artifact Operating System
## Version 1.5

---

# 1. Product Summary

The Harness is a governing instrument for AI-assisted project work.

When applied to a host project, it deposits a `.harness/` directory — the project's knowledge cartridge — containing the active project memory, product intent, and build mechanics. The master index lives at the project root as `HARNESS.md`: the document an AI reads first when entering any Harness-governed project.

The `.harness/` directory is the artifact the Harness lays. It captures the project's evolving context across sessions, allowing AI collaboration to resume without relying on chat memory.

This repo is itself a governed instance of the Harness. The `.harness/` directory here tracks the development of the Harness itself — a recursive application that both proves the concept and maintains the instrument's own continuity.

The standard artifact set:

- `HARNESS.md` — master index, at the host project root
- `.harness/01_PROJECT.md` — active project memory
- `.harness/02_PRD.md` — stable product intent
- `.harness/03_BUILD.md` — stable build mechanics

The system is designed to make AI-assisted project work easier to restart, revise, govern, validate, and hand off — and less dependent on chat transcripts.

---

# 2. Problem Statement

AI-assisted project work often becomes difficult to maintain across sessions because important decisions, current state, requirements, and build instructions become scattered across chat history.

Common problems include: the AI forgets prior decisions, the operator has to restate project context repeatedly, requirements and implementation guidance become mixed together, temporary notes become mistaken for durable truth, old artifacts remain ambiguously authoritative, and restart instructions live only in chat.

The Harness solves this by creating a small, structured artifact package that separates protocol, project memory, product intent, and build mechanics — and by depositing that package onto any project it governs.

---

# 3. Target Users

Primary users:

- operators managing multi-session AI-assisted projects
- builders using AI to generate or revise structured project artifacts
- product owners using AI to maintain PRDs, build specs, and related materials
- consultants or analysts who need reusable artifact packages for repeatable work

Secondary users:

- reviewers who need to understand current project state quickly
- future AI sessions that need to resume from files rather than chat memory
- collaborators inheriting a partially completed artifact package

---

# 4. User Needs

Users need the system to:

1. preserve project continuity across AI sessions without relying on chat memory
2. separate reusable collaboration rules from project-specific content
3. separate current state from durable product and build truth
4. make artifact roles and authority rules clear
5. make artifacts easy to update directly — targeted edits by default, full rewrites for significant restructures
6. maintain a visible promotion queue for decisions ready to move into durable artifacts
7. allow the package to remain lightweight unless complexity justifies extensions
8. provide confidence that revised artifacts are complete and correct before adopting them
9. enable a future session or collaborator to resume from files alone

---

# 5. Product Goals

The product should:

- provide a reusable artifact structure for AI collaboration
- make restart and handoff practical without chat transcripts
- keep the artifact package small by default
- make current project state easy to find
- make stable product intent easy to distinguish from build mechanics
- make artifacts easy to update directly
- reduce ambiguity around file ownership and authority
- allow optional expansion without making optional files mandatory
- remain useful without tooling, automation, or a custom application

---

# 6. Product Principles

1. clarity over cleverness
2. artifact roles over monolithic documents
3. durable truth over chat memory
4. targeted edits by default; full rewrites for significant restructures
5. explicit authority over implicit precedence
6. promotion before duplication
7. pruning before accumulation
8. restartability over transcript dependence
9. optional expansion over default sprawl
10. usable output over technically correct but burdensome output

---

# 7. MVP Scope

The MVP is a four-artifact package with a defined deployment topology.

| File | Location | Role |
|---|---|---|
| `HARNESS.md` | Project root | Master index |
| `01_PROJECT.md` | `.harness/` | Active project memory |
| `02_PRD.md` | `.harness/` | Stable product intent |
| `03_BUILD.md` | `.harness/` | Stable build mechanics |

`HARNESS.md` is reusable and project-agnostic. The `.harness/` directory is project-specific and evolves with the project.

---

# 8. Out of Scope for MVP

The MVP does not require: a software application, a database, automated linting, automated schema validation, document synchronization, source-control hooks, role-based access control, formal approval workflows, a separate execution prompt, a separate changelog, a separate decisions log, or a separate test-case artifact.

Optional artifacts may be added later only when they reduce complexity more than they add maintenance overhead.

---

# 9. Functional Requirements

## 9.1 Artifact structure

The system must define a canonical artifact set with a clear deployment topology: `HARNESS.md` at the project root and the three project-specific artifacts inside `.harness/`. Each artifact must have a distinct role. Optional artifacts must be clearly extensions, not defaults.

## 9.2 Session continuity

The system must preserve project context across AI sessions without relying on chat memory. Project state must live in artifacts, not only in chat.

## 9.3 Artifact revision

The system must support targeted, precise artifact edits by default and full file rewrites for net-new files or significant restructures. The AI must identify affected related artifacts after every meaningful update.

## 9.4 Authority clarity

The system must define how to resolve conflicts among artifacts. Reading order and authority order must be explicitly distinguished.

## 9.5 Promotion and pruning

The system must support moving stable decisions from active project memory into the correct durable artifact. It must also support pruning stale or duplicated content after promotion.

## 9.6 Restart and handoff

The system must allow a future user or AI session to resume from artifacts alone. Current phase, next action, open decisions, and do-not-resurrect guardrails must be visible in `.harness/01_PROJECT.md`.

## 9.7 Optional extension

The system must allow optional artifacts when justified without making them mandatory. This includes execution artifacts, changelog artifacts, decisions logs, test cases, and a `skills/` directory.

---

# 10. Core Workflows

## 10.1 Start a new artifact package

Create the four canonical files at the correct locations. Expected outcome: master index exists at project root, knowledge cartridge exists in `.harness/`, restart path is clear.

## 10.2 Resume an existing package

Read `HARNESS.md`, then `.harness/01_PROJECT.md`, then relevant sections of `02_PRD.md` and `03_BUILD.md`. Expected outcome: current state is clear, next action is clear, unresolved decisions are visible.

## 10.3 Revise an artifact

Request an artifact update. Expected outcome: AI identifies the file, makes targeted edits or a full rewrite as appropriate, and flags related artifacts that may need updates.

## 10.4 Apply a targeted edit

Request a specific section update when only part of a file needs changing. Expected outcome: AI makes the targeted edit, states any assumptions, and flags related artifacts that may need updating.

## 10.5 Promote a decision

Move a stable decision from project memory into the correct durable artifact. Expected outcome: the durable artifact is updated, the project memory records the promotion, and stale duplicate detail is pruned.

## 10.6 Retire legacy structure

Migrate useful content from an older artifact package without preserving obsolete structure. Expected outcome: useful content is classified and promoted, obsolete structure is pruned, old files are not ambiguously authoritative.

---

# 11. Success Criteria

The product is successful when:

- a future session can resume without chat history
- artifact roles and authority rules are clear
- the four-artifact package is sufficient for normal use
- artifacts are easy to update directly
- current state is visible in `.harness/01_PROJECT.md`
- product intent is stable in `.harness/02_PRD.md`
- build mechanics are stable in `.harness/03_BUILD.md`
- master index is stable in `HARNESS.md`
- optional artifacts are created only when justified

---

# 12. Non-Goals

The product does not aim to: replace project management software, replace source control, enforce formal governance workflows, automate validation in the MVP, preserve every historical discussion, require a specific AI model or platform, make separate execution or changelog artifacts mandatory, or turn all project history into durable requirements.

---

# 13. Risks and Mitigations

**Artifact sprawl**: the system could grow into too many files. Mitigation: keep four files as the default; require justification for optional artifacts.

**PRD absorbing build mechanics**: the PRD could become overloaded with implementation detail. Mitigation: keep implementation mechanics in `.harness/03_BUILD.md`; use this PRD only for product intent and user-facing requirements.

**Project memory becoming cluttered**: `.harness/01_PROJECT.md` could become too long to be useful. Mitigation: use promotion and pruning rules; keep only current state, recent meaningful trail, open decisions, and restart-relevant history.

---

# 14. Assumptions

1. The product remains markdown-first.
2. The MVP is a four-artifact package with the `.harness/` deployment topology.
3. The operator may use AI across multiple sessions.
4. Chat memory is not reliable enough to be the source of truth.
5. Targeted edits are the default; full rewrites are reserved for significant restructures.
6. Optional artifacts should be added only when they reduce net complexity.
7. Legacy materials may provide useful patterns but should not control the current structure unless intentionally promoted.

---

# 15. Future Expansion Areas

- optional `.harness/04_EXECUTION.md` for implementation-heavy projects
- optional decisions log for long-running projects
- optional changelog for formal traceability
- optional test-case artifact for validation-heavy projects
- `skills/` directory for reusable AI procedures — invokable playbooks the AI can execute within a governed project, analogous to Claude Code's skills system
- markdown templates for each artifact
- automated artifact linting and consistency checker
- source-control integration
- project package generator

These are future expansions, not MVP requirements.

---

# 16. Layered Deliverable Governance

Some projects produce structured deliverables — decks, reports, products, codebases — where work naturally exists at multiple levels of abstraction. These levels are not arbitrary: they exist because different decisions have different volatility and authority, and mixing them creates fragility.

## 16.1 Why layers exist

1. **Decisions have different volatility.** Strategic decisions change rarely; tactical ones change often. Keeping them in separate layers prevents a tactical edit from silently destabilizing a strategic commitment.
2. **Higher-level decisions constrain lower-level ones.** A decision made at the argument layer governs what is permissible at the execution layer. Violating this produces drift.
3. **Each layer owns exactly its scope.** Bleed — where one layer does the job of another — creates confusion about authority and makes the deliverable harder to maintain.

## 16.2 Abstract vocabulary

To reason about any layered deliverable without committing to format-specific names:

- **Anchor layer** — highest authority, most stable. Consensus-gated. Everything below derives from it.
- **Bridge layers** — the derivation chain between anchor and execution. Each inherits from the layer above and constrains the layer below.
- **Execution layer** — most volatile, lowest authority. The actual deliverable. Cannot introduce commitments not present in the layers above it.

## 16.3 Universal governance rules

- **Changes flow downward.** A change to the execution layer does not touch the anchor. A change to the anchor propagates downward through all bridge layers.
- **Questions flow upward.** If execution raises a question that cannot be resolved at that layer, it escalates to the nearest bridge layer, and if necessary to the anchor.
- **Drift is the primary failure mode.** Individual units get added, softened, or reordered under pressure — and nobody notices the anchor commitment has collapsed. With a layered structure, drift becomes visible: if an execution unit cannot be traced to the anchor, name it explicitly rather than papering over it.
- **The anchor layer is the only layer that is consensus-gated.** Bridge layers and the execution layer can be updated by the project lead without formal consensus. This is what makes the anchor trustworthy as a north star.
- **Positional commitments belong in the anchor layer, not just in bridge layers.** If a decision reflects a genuine commitment — not just a tactical or stylistic preference — it belongs in the anchor. A commitment that lives only in a bridge layer is vulnerable to drift.
- **When working and client-facing languages differ, one bridge layer is written in the client-facing language.** All other internal layers remain in the working language. This is the language rule: it isolates translation decisions without contaminating the argument layers.

## 16.4 AI behavior in any layered project

- **The operator speaks in terms of the work, not the layer stack.** The operator makes observations or decisions about any aspect of the deliverable — strategy, argument, content, design — without needing to identify which layer to update. The AI owns layer identification, routing, and update. When a note arrives, the AI identifies the correct layer, fetches it, makes the targeted edit, and checks whether downstream layers are now stale. The operator is never asked to navigate the layer stack.
- Identify which layer is being worked before producing output.
- Flag upward drift proactively — if a request implies a change to a higher layer, name it rather than silently complying.
- Do not produce execution-layer output without a populated anchor and rationale above it.
- Treat the anchor layer as the authoritative source of truth; when layers conflict, the anchor governs.
- Capture decisions at the right layer — do not let execution-level decisions silently become anchor-level commitments.

## 16.5 The formats/ directory

Format-specific instantiations of these principles live in `formats/`. Each file defines the layer model, layer descriptions, governance rules, and AI behavior for a specific deliverable type.

A project producing a structured deliverable should load the relevant format file alongside this file. See `formats/README.md` for the catalog.

---

# 17. Document Governance

## 17.1 This file owns

Stable product intent: product summary, governing instrument framing, problem statement, target users, user needs, product goals, principles, MVP scope, out-of-scope items, functional requirements, workflows, success criteria, non-goals, risks, assumptions, future expansion areas, and universal layered deliverable governance principles.

## 17.2 This file does not own

Reusable orientation and navigation → `HARNESS.md`
Current project state → `.harness/01_PROJECT.md`
Build mechanics and validation detail → `.harness/03_BUILD.md`

## 17.3 Update this file when

Product goals, target users, user needs, MVP scope, functional requirements, success criteria, or universal governance principles change.

## 17.4 Do not update this file when

Only current project status, build validation mechanics, or artifact lifecycle details change.

## 17.5 Conflict behavior

For product intent and universal governance principles, this file has authority over `.harness/01_PROJECT.md` and `.harness/03_BUILD.md`. Defers to `HARNESS.md` for orientation and to direct operator instruction for the current task. If `.harness/01_PROJECT.md` contains a newer product decision, treat it as a promotion candidate.

---

# 18. Acceptance Criteria

This PRD is acceptable when it:

- identifies the Harness as a governing instrument with the `.harness/` egg model
- describes the target users and their problems
- defines product goals and MVP scope
- specifies functional requirements at the capability level, not the implementation level
- identifies non-goals and out-of-scope items
- avoids detailed build mechanics
- states the universal layered deliverable governance principles
- includes local document governance

---

# 19. Final Summary

The Harness is a governing instrument that deposits a `.harness/` knowledge cartridge onto any host project it governs, enabling resumable, structured AI collaboration across sessions.

The MVP is the four-artifact package:

- `HARNESS.md` at the project root
- `.harness/01_PROJECT.md`
- `.harness/02_PRD.md`
- `.harness/03_BUILD.md`

The product succeeds when an operator can resume, revise, validate, and extend structured project artifacts without relying on chat memory. The Harness is its own first demonstration of this: it governs itself recursively through the `.harness/` directory in this repo.
