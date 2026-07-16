# Skill: render-html
## Produce a Fully Self-Contained HTML File

---

## Purpose

Take a source HTML file and produce a dependency-free clone in a `rendered/` sibling folder — all external CSS, fonts, scripts, and images inlined so the file renders identically in any context: offline, sandboxed iframe, copy-pasted string.

---

## When to use

- Before pasting an HTML mockup into a tool that can't resolve external paths (e.g. the Figma Bridge plugin paste flow)
- When you need a portable snapshot of a mockup at a point in time
- When sharing a single-file HTML artifact with no surrounding project context

Do not maintain the rendered file manually. It is always regenerated from the source — edit the source, re-run the skill.

---

## Procedure

1. Identify the source HTML file (passed as argument, or the currently active file in the IDE)
2. Determine the output path: `<source-dir>/rendered/<filename>.html`
3. Run the implementation script:
   ```
   node "<harness-root>/skills/render-html.js" "<source.html>" ["<output-base-dir>"]
   ```
   `output-base-dir` is optional. If provided, `rendered/` is created there instead of next to the source file. Use this to centralise all rendered files under the project root rather than scattering them across initiative folders.
4. Report: what was inlined, output path, any items skipped or failed

---

## What the script inlines

| Source type | Action |
|---|---|
| `<link rel="stylesheet">` — local file | Read and replace with `<style>` block |
| `<link rel="stylesheet">` — CDN / Google Fonts | Fetch CSS; for each `url()` font ref, fetch binary and base64-encode |
| `url()` refs inside `<style>` blocks | Fetch or read; base64-encode fonts and images |
| `<script src="">` | Read or fetch; replace with inline `<script>` |
| `<img src="">` (non-data URI) | Read or fetch; replace src with base64 data URI |

Items that fail to resolve (network error, file not found) are left as-is and logged as warnings. The script never aborts on a single failure.

---

## Output convention

```
Proposals/
  mockup-example.html          ← source (edit here)
  rendered/
    mockup-example.html        ← generated (never edit directly)
```

---

## Notes

- The rendered file is ephemeral — generated output, not a maintained artifact
- CSS `@import` inside fetched stylesheets is not recursively resolved in this version; files using deep import chains may need a manual pass
- The script requires Node.js; no npm dependencies
- Google Fonts is the most common external dependency in mockups — the script handles it fully (fetches CSS, fetches each `.woff2`, embeds base64)
