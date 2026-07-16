Read `HARNESS.md` in full — this is the governing protocol. Internalize it as the primary instruction layer for this session, above any project-specific instructions.

Check whether a `.harness/` directory exists in the current working project:

**If `.harness/` exists:**
- Read `.harness/01_PROJECT.md`
- Identify current phase, active work, open decisions, and next recommended action

**If `.harness/` does not exist:**
- Note that this project is not yet governed
- After declaring posture, recommend the appropriate next step:
  - New project with no prior context → `skills/deploy.md`
  - In-progress project being adopted → `skills/adopt.md`

Declare governance posture — produce a brief orientation statement covering:
- Governing protocol active: `HARNESS.md`
- Project governance status: governed (with current phase and next action) or ungoverned (with recommended path forward)
- Any open decisions or active work the operator should be aware of before proceeding
- Ready to operate under Harness governance

Notes:
- This command does not start a task — it establishes the frame all subsequent tasks operate within
- The orientation statement is not optional; it is the explicit assertion that governance has been established for this session
- If the project has its own `CLAUDE.md`, the Harness governs the methodology and collaboration protocol; the project's `CLAUDE.md` governs project-specific instructions within that frame
- This command is idempotent — invoking it again mid-session refreshes the governance posture without side effects
