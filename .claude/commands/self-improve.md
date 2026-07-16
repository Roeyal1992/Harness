# Self-Improve
## Enter Capture Mode — log an observation or append evidence to an existing one

The improvement pipeline itself — this command, the entry format, the capture flow, the wrapup step — is a valid observation target. `meta` observations are first-class. Observing the pipeline's own friction is the AI's responsibility, not the operator's.

---

## Step 1 — Get the occurrence

Ask the operator to describe what just happened in 1–2 sentences. This is the raw event — the specific thing that triggered the capture.

---

## Step 2 — Check existing observations

Read `.harness/05_IMPROVE.md`. Scan the Backlog (and Archive if helpful) for any existing observation whose generalized pattern this event could be evidence for.

Present matches to the operator: "This looks like it could be evidence for IMP-NNN: [observation summary]. Does that fit, or is this a new pattern?"

- **Matches an existing observation** → append a new numbered evidence item to that entry (date + what exactly happened). Do not change the observation, outcome, or proposal unless the operator explicitly asks to revise them.
- **No match** → proceed to Step 3.

---

## Step 3 — Open a new observation (only if no match)

Ask four questions:

1. **Type** — `friction` · `feedback` · `success` · `meta` (observation about the improvement pipeline or Harness governance system itself)
2. **Observation** — what generalized pattern does this event represent? (the class of behavior, not the specific incident)
3. **Proposed outcome** — what does better look like? Describe the target *experience or flow*, not a fix.
4. **Improvement proposal** — what specific change to which artifact would produce that outcome? Write "unclear — needs review" if uncertain.

Write the new entry to the Backlog in `05_IMPROVE.md` using the section format, with the next sequential ID and the occurrence as Evidence item 1.

---

## Step 4 — Self-check (always run this)

After logging the entry, briefly reflect on the capture process itself:

- Did the format accommodate what needed to be said, or did anything feel forced?
- Did the check-for-existing-observation step work smoothly, or was matching awkward?
- Was there friction in this invocation that hasn't been captured yet?

If yes to any — log a `meta` entry for it before closing. Do not skip this step.

---

## Step 5 — Confirm

After appending evidence or creating a new entry:
- "Evidence added to IMP-NNN." — if appended to existing
- "Observation IMP-NNN captured." — if new entry

Do not promote. Do not make any revision. The backlog is a staging area.
