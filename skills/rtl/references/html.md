# RTL in HTML

> Read [`SKILL.md`](../SKILL.md) for the core RTL principles before this file.

---

## Set the Base Direction on the Document

```html
<html dir="rtl" lang="he">
```

This single attribute flips the default reading direction for the entire document. Most CSS properties with a directional meaning (`text-align`, `float`, `margin-inline-start`, etc.) respect `dir` automatically. Set it once on the root — do not re-declare it on every child element.

---

## Use Logical CSS Properties

Prefer `margin-inline-start` / `margin-inline-end` over `margin-left` / `margin-right`. Logical properties are direction-aware and require no separate RTL overrides.

| Physical | Logical equivalent |
|---|---|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `border-left` | `border-inline-start` |
| `text-align: left` | `text-align: start` |
| `text-align: right` | `text-align: end` |
| `float: left` | `float: inline-start` |

When working with an existing LTR stylesheet (logical properties not in use), override directional properties with a `[dir="rtl"]` block rather than touching the original declarations:

```css
[dir="rtl"] .sidebar {
  margin-left: 0;
  margin-right: 16px;
}
```

---

## Default Text Alignment

With `dir="rtl"`, the browser defaults text to right-aligned. Setting `text-align: right` on every element is unnecessary. Override with `text-align: center` only where intentional.

---

## Flexbox and Grid

With `dir="rtl"`, flexbox `row` direction reverses automatically — `flex-start` becomes the right edge, `flex-end` becomes the left edge. Grid column placement follows the same logic.

**Do not use `flex-direction: row-reverse` as an RTL workaround.** It double-flips when `dir="rtl"` is also set. Remove it.

---

## LTR Islands Within RTL Pages

Numbers, code, email fields, phone inputs, URLs, and product identifiers should stay LTR even inside an RTL document:

```html
<span dir="ltr">03-123-4567</span>
<input type="email" dir="ltr">
<pre dir="ltr"><code>...</code></pre>
```

Or in CSS for structural elements that always contain LTR content:

```css
.amount, .phone, .code-block, code, pre {
  direction: ltr;
  unicode-bidi: embed;
}
```

---

## Directional Icons

For CSS-generated icons (borders, pseudo-elements, background-image arrows) that imply direction, flip them in RTL context:

```css
[dir="rtl"] .chevron-right {
  transform: scaleX(-1);
}
```

For inline SVG icons, mirror on the SVG root or the relevant path:

```html
<!-- Wrap in a container and flip it -->
<span style="display:inline-block; transform: scaleX(-1);">
  <!-- SVG here -->
</span>
```

Or apply `transform` directly on the `<svg>` element — use `transform-origin: center` to avoid position drift.

---

## Input Fields

Text inputs for Hebrew content must be explicitly set to RTL:

```html
<input type="text" dir="rtl" placeholder="חיפוש...">
<textarea dir="rtl"></textarea>
```

They do not inherit `dir` from the parent reliably in all browsers for user-typed content. Set it explicitly.

---

## Scrollbars

With `dir="rtl"`, the browser moves the scrollbar to the left. This is correct behavior — do not override it with CSS unless there is an explicit design reason.

---

## Checklist

- [ ] `<html dir="rtl" lang="he">` set on the root element
- [ ] Logical CSS properties used (`margin-inline-*`, `padding-inline-*`) — or `[dir="rtl"]` overrides for LTR-based stylesheets
- [ ] No `flex-direction: row-reverse` used as an RTL workaround
- [ ] LTR islands (`numbers`, `code`, `email`, `phone`) marked with `dir="ltr"` or `direction: ltr; unicode-bidi: embed`
- [ ] Directional icons mirrored via `scaleX(-1)`
- [ ] Text `<input>` and `<textarea>` fields for Hebrew content have `dir="rtl"` set explicitly
- [ ] Action buttons sit at the **left edge** of their container
