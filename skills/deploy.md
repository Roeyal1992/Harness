# Skill: Deploy
## Apply the Harness to a New Host Project

---

## Purpose

Initialize a new, blank-slate Harness-governed project by creating the standard artifact set at the correct locations.

---

## When to use

- Starting a greenfield project with no prior context, documentation, or in-progress work
- The project does not yet exist and the artifact package is being created from scratch

For projects already underway, use `skills/adopt.md` instead — adoption requires a discovery phase and an interview to surface assumptions before populating the artifacts.

---

## Procedure

1. Confirm the host project root directory
2. Identify the deliverable format — ask the operator which format applies (e.g., `product-mockup`, `strategic-deck`) and load the relevant file from `formats/`. If the operator is unsure, describe the options briefly: *product-mockup* for apps, tools, or systems that run or behave; *strategic-deck* for structured knowledge artifacts (decks, reports, proposals). Default to `product-mockup` if still unclear, and record the assumption in `01_PROJECT.md`.
3. Create a `.harness/` directory at the project root
4. Create files inside `.harness/` using the composition principle — add a file when it reduces complexity more than it adds maintenance overhead:
   - `01_PROJECT.md` — **required**. Populate with the project name, active format, initial snapshot, current status as "draft", and a clear next action.
   - `README.md` — **recommended** when the cartridge holds more than one file. One line per file, describing what it holds and why it exists.
   - Additional files — use the templates below as starting points. Add what the project warrants; skip what it doesn't.
5. Verify the package is in place and the restart sequence works
6. Record the initialization in `.harness/01_PROJECT.md` with the date and format name

---

## Templates

Templates are proposals — not requirements. Use them, adapt them, or ignore them.

| Template | Purpose |
|---|---|
| `product.md` | Stable product intent: purpose, users, scope, non-goals, success criteria |
| `project.md` | Project-specific state beyond `01_PROJECT.md`: decisions log, open questions, constraints |
| `build.md` | Technical and build mechanics for implementation-heavy projects |
| `protocol.md` | Project-specific collaboration rules or domain conventions |

---

## Notes

- The `.harness/` cartridge is the only governance artifact that belongs in a governed project. `HARNESS.md` lives exclusively in the Harness repo — it is never copied anywhere else.
- The protocol loads because the Harness repo is present in the workspace. The cartridge is what makes a project governed within that context.
- The `.harness/` artifacts are project-specific and must be written fresh for each project — do not copy `.harness/` contents from another project
- The deployed package is a starting point; add files as the project's complexity warrants them, not in anticipation of it
