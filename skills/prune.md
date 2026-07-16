# Skill: Prune
## Remove or Compress Content That No Longer Improves Future Decisions

---

## Purpose

Reduce artifact bloat by removing completed-work history, compressing over-specified sections, and moving wrong-layer content to the correct file.

---

## When to use

- After an assessment (`skills/assess.md`) has identified specific targets
- When `.harness/01_PROJECT.md` has grown too long to be useful on restart
- When any artifact is materially longer than its content justifies

---

## Procedure

1. Identify the target file — prune one file at a time
2. Apply the following in order:
   - **Remove** completed-work records that no longer affect future decisions: finished promotion tables, resolved decision lists, session-by-session trail entries that add no decision value
   - **Compress** over-specified sections to principles or short lists: formal data models, lengthy acceptance criteria for the artifact itself, verbose sub-sections where a sentence would do
   - **Move** wrong-layer content to the correct artifact: build mechanics in the PRD go to `.harness/03_BUILD.md`; product rationale in the Build Spec goes to `.harness/02_PRD.md`
   - **Remove** content that duplicates another artifact without adding clarity
3. After pruning, verify:
   - the restart sequence still works from the file alone
   - no durable decision was silently removed
   - the do-not-resurrect guardrails in `.harness/01_PROJECT.md` are intact
4. Record the pruning pass in `.harness/01_PROJECT.md` with the date and files affected
5. Bump the version of each pruned file

---

## Notes

- Make targeted edits where possible; use a full rewrite only when coordinated changes across many sections make it cleaner
- Pruning rule: if a future session would not make a worse decision without the content, remove or compress it
- Related skill: `skills/assess.md`
