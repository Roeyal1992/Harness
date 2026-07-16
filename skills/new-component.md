# Skill: new-component
## Create a Standard UI Component

---

## Purpose

Create a reusable UI component as a self-contained four-file package — CSS, JS, preview, and spec — and wire it into its host mockup.

---

## When to use

- A UI element appears in more than one mockup and should be maintained in one place
- An inline implementation is complex enough to isolate for independent editing and preview
- A new screen element needs to be built from scratch

This skill targets **mockup-first projects using vanilla HTML/CSS/JS** — a deliberate methodology choice for speed and portability. Do not apply it to framework-based projects (React, Vue, etc.) without adaptation.

---

## The standard

Every component is a directory containing exactly four files:

| File | Role |
|---|---|
| `{name}.css` | All styles. Includes a `:root` design token block. No logic. |
| `{name}.js` | One `render{Name}(config)` function. Returns a handle. No globals. No CSS injection. |
| `preview.html` | Standalone harness. Loads CSS + JS exactly as host mockups do. Auto-opens with realistic data. |
| `spec.md` | API table, design rationale, variants, open questions, document history. |

**Before starting:** read the most mature existing component in the project as a reference implementation. Its `preview.html` and `spec.md` set the bar.

---

## Procedure

**1. Determine placement**
- Domain-specific components: `{Domain}/{Area}/components/{name}/`
- Shared components (used across domains): `components/{name}/`
- Ask if unsure — placement is structural and hard to change later.

**2. Create the directory**
```
{target-path}/components/{name}/
```

**3. Write `{name}.css`**
- Open with a file-level comment: component name, description, host project, layer (shared or domain-specific)
- Include a `:root` token block containing only the tokens this component actually uses — for self-containment
- Group rules by visual area using `/* ── SECTION NAME ── */` comments
- No JavaScript, no logic

**4. Write `{name}.js`**
- One function: `render{Name}(config)`, where config is a plain object
- Destructure config at the top
- Inject component HTML via `innerHTML` + `appendChild` — never inject CSS here
- Wire all events via `addEventListener` — no `onclick="..."` attributes in HTML template strings
- Return a handle object (e.g. `{ open, close }` for overlays; `{ update }` for panels)
- No `window.*` globals

**5. Write `preview.html`**
- Load CSS via `<link rel="stylesheet" href="{name}.css">` and JS via `<script src="{name}.js"></script>` — same relative paths the host mockup uses
- Auto-open or auto-render on load — opening the file in a browser shows the component immediately
- Use realistic data: real names, real amounts, real dates — no "foo/bar" placeholders
- If the component depends on CSS classes defined in the host (e.g. domain tags, status badges), redeclare them in a `<style>` block in the preview
- Add toggle controls if the component has variants (e.g. queue vs. catalog mode)

**6. Write `spec.md`**

Required sections in order:

| Section | Content |
|---|---|
| Purpose & Scope | What it is, what it is not, when to use, when not to use |
| Design Rationale | One subsection per non-obvious decision — lead with the decision, then explain why |
| Config API | Property tables for `render{Name}(config)` and all sub-objects; include type, required/optional, default, description |
| Usage | File path convention, initialization snippet, common call patterns |
| Variants | Table: variant → how to achieve |
| Open Questions | Checklist of unresolved design decisions |
| Document History | Version / date / change table |

Design rationale is the most important section — capture *why* each decision was made. Without it, solved problems get re-litigated in future sessions.

**7. Wire into the host mockup**
- Add `<link rel="stylesheet" href=".../components/{name}/{name}.css">` to `<head>`
- Add `<script src=".../components/{name}/{name}.js"></script>` to `<body>` before the main script
- Initialize: `const {handle} = render{Name}({ ... })`
- Update all trigger handlers (clicks, etc.) to use the handle: `element.onclick = () => handle.open({ ... })`
- Remove inline CSS, HTML, and JS that the component now owns
- Delete any interim preview files created outside the component directory

---

## Notes

**The four non-negotiables — things that make a component a component:**
- CSS is always a separate file (never injected as a JS string)
- JS exposes exactly one render function per component
- The render function returns a handle — not globals
- No `onclick="..."` attributes in HTML template strings

**On `preview.html`:** it is both a development tool and a living contract. If it breaks, the component is broken. If it renders correctly, the component is correct. Keep it accurate.

**On open questions in `spec.md`:** track them explicitly. A silently resolved design decision is a future regression waiting to happen.

**Related skills:** `render-html` — use after the component is complete to produce a dependency-free snapshot for sharing or embedding.
