# Skill: Promote
## Move Stable Decisions from Project Memory into Durable Artifacts

---

## Purpose

Transfer a decision, rule, or insight from `.harness/01_PROJECT.md` into the correct durable artifact once it is stable enough to treat as truth.

---

## When to use

- When a decision in `.harness/01_PROJECT.md` has been stable across multiple sessions
- When the same note keeps being referenced but never moves
- When `.harness/01_PROJECT.md` is carrying content that belongs in the PRD or Build Spec

---

## Procedure

1. Identify the promotion candidate in `.harness/01_PROJECT.md`
2. Classify it by destination:
   - reusable protocol → `HARNESS.md`
   - product intent → `.harness/02_PRD.md`
   - build mechanics → `.harness/03_BUILD.md`
   - current state (stays) → `.harness/01_PROJECT.md`
   - host-project-specific (studio standards, domain conventions, team rules) → flag for the host project's own governance layer, not a Harness artifact
3. Add the content to the destination artifact in the correct section
4. Update the destination artifact's version
5. Remove or compress the source note from `.harness/01_PROJECT.md` — do not keep duplicates
6. Record the promotion in `.harness/01_PROJECT.md` recent trail: date, what was promoted, destination

---

## Notes

- Promotion is not copying — the source note must be removed or compressed after the move
- If the decision is still evolving, it is not ready to promote; leave it in project memory
- Related skill: `skills/prune.md`
