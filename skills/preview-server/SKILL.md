---
name: preview-server
description: This skill should be used when a project contains HTML mockups that need a lightweight local preview server with an auto-generated, always-current index. It detects every .html mockup under a target directory, serves them as static files, and renders a tree-view landing page grouped by folder with human-readable titles and light/dark support. Use this when setting up mockup previewing for a project, wiring a dev-server config for Claude Preview, or asked to make it easier to browse a growing set of HTML mockups without hand-maintaining a list.
---

# Preview Server

## Purpose

Serve every HTML mockup under a project directory from one lightweight Node server, with a landing page that lists them as a collapsible tree — grouped by folder, titled from folder/file names, live-updating on every request (no build step, no cache, no manual index to maintain).

## When to use

- A project has, or is starting to accumulate, multiple HTML mockups scattered across subfolders
- The project needs a `.claude/launch.json` entry so Claude Preview (or a teammate) can start a dev server and browse mockups
- An existing ad-hoc static file server for mockups needs a browsable index instead of requiring exact file paths to be known in advance

Do not use this for a project that already has its own dev server (e.g. a Vite/Next app) — this skill is for plain static HTML mockups with no build step.

## Procedure

1. Locate the shared implementation script at `<harness-root>/skills/preview-server/scripts/serve.js`. Do not copy it into the target project — reference it in place, so future improvements apply everywhere it is used.
2. Identify the target directory to scan and serve — the folder containing (or containing subfolders of) the project's `.html` mockups. This does not need to be the project root; pick the narrowest folder that covers all mockups to avoid pulling in unrelated `.html` files.
3. Pick a port. Default to `5555` unless it is already in use by another registered server in the same project's `launch.json`.
4. Add or update an entry in the target project's `.claude/launch.json`:
   ```json
   {
     "version": "0.0.1",
     "configurations": [
       {
         "name": "preview-server",
         "runtimeExecutable": "node",
         "runtimeArgs": ["<path-to-harness>/skills/preview-server/scripts/serve.js", "<target-dir>", "<port>"],
         "port": <port>
       }
     ]
   }
   ```
   `<path-to-harness>` should be a path to the Harness root reachable from wherever the project's dev server gets launched (relative if the project sits alongside Harness, absolute otherwise). `<target-dir>` is relative to the project's working directory, or absolute.
5. Start it via the Claude Preview tool's server-start mechanism, or directly with `node <path-to-serve.js> <target-dir> <port>`.
6. Visiting `http://localhost:<port>/` renders the tree index. Each entry links to two views:
   - The **titled link** opens the mockup inside the device-preview toolbar (`/__preview?src=<path>`) — the default browsing experience.
   - The small **`raw`** link opens the file directly at its real path (`/<path>`), unwrapped.

## How the index behaves

- Rebuilt from the filesystem on every request to `/` — adding, removing, or renaming an `.html` file (or its containing folder) is reflected on next refresh, no server restart needed.
- Folder and file names are titleized (dashes/underscores → spaces, word-capitalized) for display; Hebrew names are left as-is rather than mangled.
- Root-level folders render expanded by default; deeper levels start collapsed, using native `<details>`/`<summary>` (no JS required for the tree itself).
- Follows `prefers-color-scheme` for light/dark, tuned for readable contrast in both.

## The device-preview toolbar

`/__preview?src=<path>` wraps any mockup in a toolbar with device-resolution controls, without ever touching the mockup's own HTML source:

- Loads the raw mockup in an `<iframe>`, sized to the selected device's width/height, and applies a two-axis scale-to-fit transform to the iframe's wrapper so it always fits the available stage regardless of the toolbar window's own size.
- Ships with three presets (Desktop 1440×900, Tablet 1024×768, Mobile 390×844) plus custom width/height inputs.
- Because the mockup is untouched and just framed at a chosen size, this works for both kinds of mockups already found in a typical project: ones with genuinely responsive CSS (which will reflow at each size) and ones authored against one fixed resolution (which will simply appear scaled, exposing that they were never meant to be resized — this is itself a useful signal, not a bug in the toolbar).
- Iframe isolation is deliberate over rewriting the mockup's HTML in place: some mockups already carry their own body-level `overflow`/positioning assumptions, and an iframe avoids the toolbar's own layout fighting with the mockup's.
- This is a first slice — resolution/device presets were the first control added. Expect more toolbar controls (e.g. rulers, orientation toggle, persisted device choice) to be added over time; extend `DEVICE_PRESETS` and the toolbar markup/script in `serve.js` rather than starting a new mechanism.

## Notes

- Requires Node.js on the machine running the server; no npm dependencies.
- This is a local dev tool, not hardened for untrusted input — do not expose the port beyond localhost.
- If a mockup's landing page is reached via a link from the tree index, its own relative asset paths resolve correctly because the browser URL matches the file's real path. Do not add a "default file at `/`" redirect — that was the earlier bug this skill's index replaces (relative asset links break when the browser URL doesn't match the served file's actual path).
- Only `.html` files are indexed. Supporting files (`.css`, `.js`, `.svg`, images) are served on request but not listed.
- **Tooling that needs the literal document (not the toolbar-wrapped view) must keep using the raw path.** Any process that reads or renders a mockup outside the browser — Figma Bridge, Chrome-headless print/PDF export for a Slide Spec, `render-html.js` — must point at `/<path>` directly, never `/__preview?src=<path>`. This is a hard requirement, not a preference: the toolbar route serves a wrapper document, not the mockup itself.
- Related: `render-html.md` for producing a dependency-free single-file export of one mockup, which is a different need (portability) from this skill's need (browsable local preview of many).
