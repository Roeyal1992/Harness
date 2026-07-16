# Skill: Wrap-Up
## Close Out a Session and Leave the Package Restart-Safe

---

## Purpose

Capture what happened during a session, ensure artifacts reflect the current state, resolve any drift introduced during the session, and leave the package in a condition where a future session can resume from files alone.

---

## When to use

- At the end of any meaningful working session before closing chat
- Before handing off to another operator or AI session
- When a session ends mid-task and the next session needs to resume cleanly

---

## Procedure

### Phase 1 — Capture session output

1. Review what happened this session: decisions made, artifacts changed, assumptions confirmed or surfaced, open questions that emerged
2. Write a trail entry in `.harness/01_PROJECT.md`:
   - date
   - what changed and why
   - artifact versions bumped, if any
3. Update active work in `.harness/01_PROJECT.md`:
   - mark completed items done or remove them
   - add any new work that emerged during the session
4. Update open decisions:
   - close any that were resolved; record the resolution briefly
   - add any new ones that surfaced and are not yet resolved

---

### Phase 2 — Check durable artifacts for drift

5. For each artifact changed this session, confirm the change is correctly recorded in that file
6. For each decision made this session, confirm it lives in the right artifact — not only in chat memory
7. Identify any artifact that is now stale because of changes made elsewhere during the session; flag it for update or note it in the promotion queue if not resolved now

---

### Phase 3 — Promote if ready

8. Check the promotion queue in `.harness/01_PROJECT.md` — if anything became stable enough during this session, promote it now rather than carrying it forward as an unresolved note
9. After promoting, prune the source note per `skills/promote.md`
10. If the host project has its own governance layer, identify any session observations that are host-project-specific — studio standards, domain conventions, team rules — and flag them for that layer rather than depositing them in Harness artifacts
11. **Check the improvement backlog** in `.harness/05_IMPROVE.md` — review any `captured` entries. For each: promote it (make the revision, mark `promoted`, move to Archive) or dismiss it (mark `dismissed`, move to Archive). If a full review would derail wrap-up, defer by flagging it as the first action of the next session.
12. **Meta-check — scan the pipeline itself:** did anything about the improvement process feel awkward or off during this session — the capture flow, the entry format, the wrapup steps, the command behavior? If yes, log a `meta` entry in the backlog before closing. This is the AI's responsibility to surface; do not wait for the operator to notice it.

---

### Phase 4 — Verify restart-safety

11. Confirm `.harness/01_PROJECT.md` states:
    - current phase
    - active work
    - open decisions
    - next recommended action
12. Confirm a future session could resume from the files alone without needing this chat transcript

---

## Wrap-Up Checklist

Before declaring the session closed:

- [ ] trail entry written in `.harness/01_PROJECT.md`
- [ ] active work is current
- [ ] open decisions are current — resolved ones closed, new ones added
- [ ] no decision from this session exists only in chat
- [ ] no artifact is stale due to unrecorded changes from this session
- [ ] promotion queue is current
- [ ] host-project-specific observations flagged for the host project's governance layer (if applicable)
- [ ] improvement backlog reviewed — entries promoted, dismissed, or explicitly deferred to next session
- [ ] meta-check done — pipeline friction from this session surfaced and logged if present
- [ ] next recommended action is stated in `.harness/01_PROJECT.md`
- [ ] package is restart-safe from files alone

---

## Notes

- Wrap-up is not a pruning pass — do not remove content during wrap-up unless it is clearly obsolete; note bloat for a future `skills/prune.md` pass instead
- If significant drift or over-engineering is found during wrap-up, add it to open decisions or the promotion queue rather than derailing the wrap-up into an unplanned refactor
- Related skills: `skills/promote.md`, `skills/assess.md`
