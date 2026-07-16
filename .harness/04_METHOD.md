# Method
## Operator Working Conventions
## Version 1.0

---

# 1. Purpose

This file captures how this operator works with AI in this workspace. It is the methodology layer — stable conventions that apply across all projects and sessions.

It does not own project state, product intent, or build mechanics. It owns collaboration discipline: what the AI should do by default, how sessions are structured, and what to avoid.

A convention belongs here when it is stable enough to apply across multiple projects and specific enough to be actionable without context.

---

# 2. Layer Navigation — Invisible by Default

The operator does not identify which layer to update. Any note — design, content, strategic, copy — triggers automatic layer identification, fetch, targeted edit, and downstream propagation check.

**Why:** The layered model is an internal discipline, not a UX burden. The governance system should be invisible in practice.

**How to apply:**
- Receive a note → immediately identify which layer it belongs to
- Fetch the correct artifact and make the targeted edit
- After any edit, check whether downstream layers are now stale — update them or flag the dependency explicitly
- Never ask the operator to navigate the layer stack; navigate it for them

This convention is promoted into `HARNESS.md` (orientation) and `formats/layered-deck.md §AI Behavior` — it applies to all Harness-governed layered projects.

---

# 3. HTML Wireframes — Default Discussion Artifact

After any screen, layout, or flow is agreed on — even partially — produce a single-file HTML wireframe before anything else. Do not ask first, just build it.

**Why:** The operator established this as the working mode for design sessions. A shared visual accelerates layout and content discussion faster than description alone.

**How to apply:**
- Low fidelity is correct — speed over polish
- Single file with embedded CSS and JS
- RTL layout where the project requires it
- Placeholder gray blocks for chrome; real content where it matters (labels, table data, sidebar content)
- Enough interactivity to support the discussion (toggles, popovers) but no more
- The wireframe is a discussion artifact, not a deliverable

This convention is promoted into `formats/product-design.md §AI Behavior`.

---

# 4. Structural Edits — Write New, Audit, Replace, Delete

When a change is structural — affecting multiple sections, renaming files, or reorganizing artifacts — never direct-edit. Follow the four-step process:

1. **Write new** — create the replacement file alongside the original (`_NEW` suffix)
2. **Audit** — compare new against old; confirm nothing durable was lost
3. **Replace** — archive the original as `_OLD`, promote `_NEW` to the canonical name
4. **Delete** — remove `_OLD` once the replacement is confirmed clean

**Why:** Direct structural edits risk losing durable decisions silently. The four-step process makes the change inspectable and reversible at every stage.

**How to apply:**
- Targeted edits (single section, single file) may be made directly
- Structural changes (multiple sections, file renames, reorganizations) always follow the four-step process
- Never skip the audit step — it is where broken references and lost content surface

---

# 5. Directory Ownership — `.claude/` vs `.harness/`

`.claude/` owns Claude Code tooling: hooks, commands, settings, and any scripts that support them. `.harness/` owns governance artifacts only: project memory, product intent, build mechanics, working method, improvement backlog.

**Why:** Placing tooling files in `.harness/` mixes operational infrastructure with governance content, making both harder to navigate and maintain.

**How to apply:**
- Hook scripts, slash commands, settings → `.claude/`
- Project state, PRD, build mechanics, method, improvement backlog → `.harness/`
- When creating a new file, ask: is this a governance artifact or a Claude Code operational file?

---

# 7. Context Management — Harness Only

Never write to Claude Code's auto-memory directory (`~/.claude/projects/.../memory/`) for any Harness-governed project or session.

**Why:** The operator manages all context through Harness artifacts. The hidden memory folder is an opaque, uncontrolled parallel store — it competes with the Harness and causes context decay over time.

**How to apply:**
- Persistent reference → add to `01_PROJECT.md` (current state) or a `references/` file in the Harness
- Working conventions → add to this file (`04_METHOD.md`)
- Session continuity → update `SESSION_HANDOFF.md` in the Harness root
- Never call `Write` on a path inside `~/.claude/projects/` for Harness-governed work

---

# 8. Governance Artifacts — Lean by Default

`CLAUDE.md` is an orientation layer, not a documentation layer. Any `CLAUDE.md` that grows beyond ~10 lines is a signal that documentation has leaked into the wrong layer.

**Why:** Loading full governance docs into every session burns context window before any work starts and creates competing authority between Claude Code's native instruction layer and the project's own governance system.

**How to apply:**
- `CLAUDE.md` → one `@` reference to `HARNESS.md`
- `HARNESS.md` → lean master index: workspace identity, ecosystem map, navigation guide
- Protocol depth → `.harness/02_PRD.md`, `.harness/03_BUILD.md`
- Format mechanics → `formats/`
- Operational procedures → `skills/`
- When a governance artifact grows monumental, treat it as a repatriation signal — not an editing task

---

# 9. Protocol-First Build Discipline

When working on a governed project that has a `protocol.md` or `02_PRD.md`, documented decisions are final — take them, do not re-derive.

**Why:** Re-deriving documented decisions (colors, component IDs, modal widths, layout rules) generates large reasoning overhead before any work starts, burning tokens and slowing delivery. The protocol exists precisely to prevent this.

**How to apply:**
- Read the protocol → take its answers as given. If it says "all modals 288px," that is the answer.
- Start from the nearest existing component before building anything custom. The operation is `createInstance() → detach() → modify`, not build from scratch.
- If something the protocol does not cover comes up, surface it as a single question to the operator. Do not internally design around the gap.
- The only legitimate pre-build question: "Is there a component I should start from?"

---

# 8. Document Governance

## 6.1 This file owns

Stable working conventions: layer navigation behavior, default discussion artifacts, structural edit process discipline, and governance artifact standards.

## 6.2 This file does not own

- Current project state → `.harness/01_PROJECT.md`
- Product intent → `.harness/02_PRD.md`
- Build mechanics → `.harness/03_BUILD.md`
- Operational skill procedures → `skills/`

## 6.3 Update this file when

A working convention is established, refined, or retired — typically at the end of a session where a new pattern emerged and proved itself.

## 6.4 Do not update this file when

Only project state, product scope, or build mechanics changed.

## 6.5 Conflict behavior

For working conventions, this file has authority. Defers to direct operator instruction for the current session.
