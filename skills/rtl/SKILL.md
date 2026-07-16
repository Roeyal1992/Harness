---
name: rtl
description: This skill should be used when building or reviewing any screen intended for a right-to-left language (Hebrew, Arabic), or when converting an existing LTR design to RTL. It covers universal RTL layout principles and routes to tool-specific implementation rules for Figma and HTML.
version: 1.0.0
---

# RTL — Right-to-Left Layout

## Purpose

Apply correct layout, alignment, and element order to screens targeting right-to-left languages (Hebrew, Arabic). Covers medium-agnostic principles here; tool-specific rules live in `references/`.

## When to Use

- Building a new screen in Hebrew or Arabic
- Converting an existing LTR design to RTL
- Debugging RTL alignment issues in Figma or HTML
- Reviewing a screen for RTL compliance before sharing with a client

## Tool-Specific Rules

Load the relevant reference file for the medium in use:

- **Figma (and FigJam)** → `references/figma.md`
- **HTML** → `references/html.md`

---

## Core RTL Principles

These apply regardless of medium.

### 1. Reading direction governs layout

The page starts at the **right edge** and flows left. "First" means rightmost. "Last" means leftmost. Every layout decision — element order, alignment, grouping — must reflect this.

### 2. Default alignment is right

All text and content defaults to right-aligned. Left-align only when explicitly justified (e.g., a numeric column aligned with its peers). Leave center-aligned content centered.

### 3. Element order mirrors reading direction

In a horizontal row, the most important or first-read element sits at the **right**. Secondary elements follow to the left. Action buttons move to the **left edge** — they are the last thing read, even when visually prominent.

### 4. Directional icons must flip

Icons implying a reading direction — arrows, chevrons, breadcrumb separators, forward/back indicators — must be horizontally mirrored.

Do not flip: Close (×), plus (+), checkboxes, status indicators, brand logos, non-directional decorative icons.

### 5. Numbers and code stay LTR

Numerals, currency amounts, phone numbers, dates, URLs, and code always render LTR regardless of surrounding RTL context. The Unicode Bidirectional Algorithm handles this automatically when the base direction is set correctly. Do not manually reverse them.

### 6. Spacing is directional, not symmetric

If a left-side padding of 16px is correct in LTR, the RTL equivalent is a right-side padding of 16px. Padding, margin, and indentation are directional and must flip — they are not mirrored automatically unless the tool or property handles it.
