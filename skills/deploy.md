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
2. Identify the deliverable format — ask the operator which format applies (e.g., `product-mockup`, `layered-deck`) and load the relevant file from `formats/`. If the operator is unsure, describe the options briefly: *product-mockup* for apps, tools, or systems that run or behave; *layered-deck* for structured knowledge artifacts (decks, reports, proposals). Default to `product-mockup` if still unclear, and record the assumption in `01_PROJECT.md`.
3. Create a `.harness/` directory at the project root
4. Create the following files inside `.harness/`:
   - `01_PROJECT.md` — populate with the project name, active format, initial snapshot, current status as "draft", and a clear next action
   - `02_*` and `03_*` — follow the **Cartridge Structure** section of the active format file for exact filenames, roles, and initial content
5. Verify the package is in place and the restart sequence works
6. Record the initialization in `.harness/01_PROJECT.md` with the date and format name

---

## Notes

- The `.harness/` cartridge is the only governance artifact that belongs in a governed project. `HARNESS.md` lives exclusively in the Harness repo — it is never copied anywhere else.
- The protocol loads because the Harness repo is present in the workspace. The cartridge is what makes a project governed within that context.
- The `.harness/` artifacts are project-specific and must be written fresh for each project — do not copy `.harness/` contents from another project
- The deployed package is a starting point, not a finished artifact; the PRD and Build Spec will grow as the project develops
