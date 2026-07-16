# Skills
## Harness Skill Catalog
## Version 1.0

---

# 1. What Skills Are

Skills are named, invokable procedures the AI can execute within a Harness-governed project. They are stored as individual markdown files in the `skills/` directory and are not loaded by default — they are retrieved only when the relevant scenario arises.

This keeps `HARNESS.md` lean. It introduces the system and defines core behavior. Skills carry the procedure detail for specific operations.

---

# 2. Skill Format Contract

Every skill file must contain:

1. **Purpose** — one sentence describing what the skill does
2. **When to use** — trigger conditions; when should this skill be retrieved?
3. **Procedure** — step-by-step instructions the AI follows when the skill is invoked
4. **Notes** (optional) — edge cases, caveats, related skills

---

# 3. Skill Catalog

| Skill | File | Purpose | When to use |
|---|---|---|---|
| Deploy | `skills/deploy.md` | Apply the Harness to a new, blank-slate host project | Starting a greenfield project with no prior context or artifacts |
| Adopt | `skills/adopt.md` | Retroactively apply the Harness to an in-progress project | A project is already underway and needs a governance layer added to it |
| Assess | `skills/assess.md` | Review artifacts for over-engineering and role drift | Before a pruning pass, after significant artifact growth, or when files feel heavy |
| Prune | `skills/prune.md` | Remove or compress content that no longer improves future decisions | After an assessment, or when an artifact has grown too long to be useful |
| Promote | `skills/promote.md` | Move stable decisions from project memory into durable artifacts | When a decision in `.harness/01_PROJECT.md` is stable enough to treat as truth |
| Wrap-Up | `skills/wrapup.md` | Close out a session and leave the package restart-safe | At the end of any meaningful working session, or before handing off to another session |
| Migrate | `skills/migrate.md` | Move, split, merge, or reconsolidate content across artifacts without silent loss | Any restructure, promotion, or reorganization where a source artifact will be retired or significantly altered |
| Gather | `skills/gather.md` | Populate a document by interviewing the operator section by section, capturing answers in-place, treating the draft as WIP until complete | Any document that needs to be populated from tacit knowledge — Briefs, author.md, specs, strategy docs |
| Deloitte PPTX | `skills/deloitte-pptx/SKILL.md` | Create Deloitte-branded .pptx files using python-pptx and the official 16:9 template | Any task requiring generation or editing of a Deloitte-branded PowerPoint file |
| FigJam | `skills/figjam/SKILL.md` | FigJam visual collaboration — board setup, page structure, grouping standards, and operational procedures | Any work on a FigJam board: page setup, section migration, flowchart organization, or visual ideation |
| render-html | `skills/render-html.md` | Produce a fully self-contained HTML file with all external CSS, fonts, scripts, and images inlined | Before pasting an HTML mockup into any context that can't resolve external paths (sandboxed iframe, plugin paste flow, portable sharing) |
| New Component | `skills/new-component.md` | Create a standard UI component as a four-file package (CSS, JS, preview, spec) and wire it into its host mockup | When a UI element needs to be extracted from inline code or built fresh as a reusable, independently previewable component |
| Preview Server | `skills/preview-server/SKILL.md` | Serve a project's HTML mockups from one lightweight Node server with a live-updating, tree-view landing page | Setting up or improving local mockup previewing for a project, or wiring a `.claude/launch.json` dev-server entry |
| Translate RTL | `skills/translate-rtl.md` | Detach a Figma component, translate text to Hebrew, apply Rubik font, and reorganize layout for RTL | When translating a Salesforce/Lightning component from English to Hebrew RTL in Figma |
| Transcript Ingestion | `skills/transcript-ingestion/SKILL.md` | Ingest meeting transcripts, extract product decisions and open questions, reconcile against an existing Discovery Log and PRD without overwriting established knowledge, and stage confirmed findings for PRD promotion | When one or more meeting transcripts need to be absorbed into a governed project's artifact set |

---

# 4. Adding a New Skill

1. Create a markdown file in `skills/` named after the operation (e.g., `skills/migrate.md`)
2. Follow the skill format contract in Section 2
3. Add a row to the catalog in Section 3 of this file
4. Reference the new skill in `HARNESS.md` if it affects core orientation

Add a skill only when a procedure is complex enough, reusable enough, and scenario-specific enough to justify a named file. Do not add a skill for every task.
