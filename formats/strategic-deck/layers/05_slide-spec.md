# Layer 3.5 — The Slide Spec *(conditional)*

**What it is:** An HTML file rendering all slides at correct proportions, with actual content strings in the client-facing language. It sits between the content and design layers and the execution build — serving three distinct functions that make it worth maintaining as its own layer.

## The Three Functions of the Slide Spec

1. **Layout validation** — confirms content fits containers, column logic works, and no element is obviously too long or short, before any PPTX build begins.
2. **Review artifact** — Chrome Headless renders the HTML to a one-slide-per-page PDF via print CSS. Reviewers see the deck without opening PowerPoint. No toolchain required on the reviewer's end.
3. **Build source of truth** — PPTX generation scripts read from or are authored directly from the Spec: content strings, layout positions, color assignments, and column structure. The Spec is the contract between content intent and build execution.

A fourth benefit: hyperlinks embedded in the Spec survive as clickable references in a way that PPTX footnotes do not. Source citations with live URLs belong in the Spec, not only in the final build.

**What it does not do:** Apply full brand design, embed brand fonts, or substitute for the final deliverable. It is layout-correct but not brand-complete.

**The test:** Can a reviewer confirm — (a) content is correct, (b) layout logic holds, (c) no element is obviously misfit — before a single line of PPTX code is written?

## Editing Rule

Do not edit the Spec directly when a change implies an argument or content decision. In that case: update the upstream MD layer first, then propagate to the Spec. Direct edits to the Spec are appropriate only for execution-layer changes — hyperlink updates, source citations, copy tweaks — that do not imply an upstream decision.

## Pilot-First Rule

When transitioning from Spec to PPTX build, always build one representative slide first. Validate layout fidelity, font rendering, and RTL behavior before scaling to the full deck. A failed pilot on slide 1 is cheap; discovering the same issue on slide 10 is not.

## PDF Generation

Use Chrome Headless with print CSS (`page-break-after: always` per `.slide-section`, `@page` set to slide dimensions). This requires no Python or Office installation — only Chrome, which is available on most corporate machines.

**Governance:** The Spec is a derived artifact — it is always downstream of the MD layers. When content changes, the Spec follows. When the Spec surfaces a layout problem, the fix is evaluated at the correct upstream layer before propagating down.

**File naming:** `[ProjectCode]_SlideSpec.html`
