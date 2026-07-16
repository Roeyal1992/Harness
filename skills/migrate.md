# Skill: Migrate
## Move, Split, Merge, or Reconsolidate Content Across Artifacts

---

## Purpose

Govern any procedure that moves content from one artifact to another — whether restructuring, splitting a file into multiple destinations, merging files, or promoting content up the governance hierarchy. Ensures nothing is silently lost or distorted in the process.

---

## When to use

- Moving content from one artifact to another (restructure, reorganization)
- Splitting a file into multiple destinations (e.g. promoting universal principles to a shared protocol while extracting format-specific mechanics into a skill)
- Merging multiple artifacts into one
- Promoting content up the governance hierarchy (e.g. from project memory into a durable artifact)
- Any time the source file will be deleted or significantly altered after the move

Do NOT use for simple edits within a single file. This skill applies when a source artifact will be retired or significantly changed as a result of the operation.

---

## Procedure

### Phase 1 — Plan

Before touching any files:

1. Identify the source artifact(s) and destination artifact(s)
2. Map every meaningful section or principle in the source to its destination — explicitly, not implicitly
3. Flag any content that does not have a clear destination; resolve ambiguity before proceeding
4. Confirm the plan with the operator before executing

### Phase 2 — Move

1. Create the destination artifacts (or update existing ones) with the migrated content
2. At this point **both versions exist simultaneously** — this is intentional
3. Do not delete or alter the source yet
4. Update all cross-references in other artifacts that point to the source

### Phase 3 — Audit

Before deleting the source, compare the new construct against it section by section. Ask for every meaningful piece of content in the source:

- **Where did it land?** Name the destination file and section.
- **Is it faithfully represented?** Check for compression, distortion, or reframing that changes the meaning.
- **Is anything missing entirely?** Scan for content that has no destination.

Report the audit as a table:

| Source section | Destination | Faithful? | Notes |
|---|---|---|---|
| ... | ... | Yes / Partial / No | ... |

The audit is not complete until every row is accounted for and all gaps or distortions are resolved.

### Phase 4 — Resolve gaps

If the audit surfaces missing or distorted content:

1. Fix the gaps before proceeding — do not delete the source with known omissions outstanding
2. Re-check the affected sections after fixing

### Phase 5 — Clean up (only after audit passes)

1. Delete the source artifact
2. Confirm all references to the source have been updated
3. Record the migration in the relevant change trail

---

## Notes

**The primary failure mode is silent loss.** Restructuring always involves editorial judgment — what to keep, where it belongs, how to phrase it in a new context. That judgment can silently drop things that were load-bearing. The audit step makes loss visible before it becomes permanent.

**Both versions must coexist during the move.** Do not delete the source during Phase 2. The source is the ground truth until the audit passes.

**Intentional architectural changes are not distortions.** If content is deliberately abstracted, renamed, or restructured as part of the migration (e.g. format-specific details promoted to universal principles), this is acceptable — but it must be noted explicitly in the audit, not silently treated as faithful.

**Related skills:** `skills/promote.md` (for moving stable decisions into durable artifacts), `skills/prune.md` (for removing content that no longer serves its purpose).
