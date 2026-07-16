# Skill: Assess
## Review Artifacts for Over-Engineering and Role Drift

---

## Purpose

Scan the artifact package and identify over-engineering, scope drift, and role violations — without flagging necessary nuance or elaboration.

---

## When to use

- When artifacts feel heavy or hard to navigate
- Before initiating a pruning pass
- After significant artifact growth or a major development session
- When a new operator needs to evaluate the health of an inherited package

---

## Procedure

1. Read all four canonical artifacts
2. For each file, check for the following patterns:

   **Completed-work preservation**: detailed records of finished work that no longer affect future decisions — session diaries, resolved decision lists, completed promotion tables, milestone logs

   **Formal modeling of informal processes**: data types, schema definitions, severity taxonomies, or field-level contracts applied to what is essentially a text file system

   **Wrong-layer content**: build mechanics in the PRD, product rationale in the Build Spec, stable decisions living permanently in project memory

   **Cross-file duplication**: the same rule, contract, or governance block stated in more than one file without adding clarity

   **Self-governance overhead**: acceptance criteria for the acceptance criteria, governance sections governing the governance document itself

3. Report findings organized by file, then by pattern — state what it is, why it is over-engineered, and whether it should be removed, compressed, or moved
4. Do not flag content that earns its length — detailed protocols with clear operational value are not over-engineering

---

## Notes

- Assessment is a read-only pass — do not prune during assessment
- Lead with the highest-impact findings; do not aim for exhaustiveness
- Related skill: `skills/prune.md`
