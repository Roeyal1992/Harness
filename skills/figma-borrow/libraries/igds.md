---
library-name: IGDS Design System File 2.0 new updated (Community)
library-key: lk-0723482d93d1c37daaaef327a111fdf520c620ecaf5d239c4ed015948f4c280878a5e54b6809b84a73849ea115b5a0a009de9ab319696f27d4a0e4a33aa98b09
rtl-native: true
source: community
language: Hebrew
last-verified: 2026-07-13
---

# IGDS Design System — Component Index

Israeli Government Design System (מערכת העיצוב הממשלתית). RTL-native, Hebrew-first. Built for government/enterprise use cases with RTL layout baked in. No RTL transformation needed for standard atoms.

---

## Component Index

| atom | component-name | component-key | notes |
|---|---|---|---|
| radio | Radio Button | dd0d81fb208462a204d81424a8acb0e10f8dcb40 | Component set with state variants |
| checkbox | Checkbox | 55059d675e175567935cff44dbaca80585a56404 | Component set |
| checkbox-list-v | Vertical Checkbox List | 9342a2b9ad59677614a25776a8bcd448738d707a | Pre-composed vertical group |
| checkbox-list-h | Horizontal Checkbox List | 9f88d157635239ee36d4e27560feab356d60ce58 | Pre-composed horizontal group |
| checkbox-card | Checkbox card | 0489a643d939569d1ea11ef4c5e01eb2837d475c | Card-style selection component |
| calendar | Calendar Picker | 5bb004d5058dc5dbe0e28623cca3a33dd1bd5905 | Full calendar picker |

---

## Exclusion Rules

Skip any component prefixed with `⛔` or `🚧` — these are internal atoms marked with the Hebrew annotation:
> "לא לגעת, זה רק חלק מתוך הקומפוננטה המלאה" (don't touch — internal part of full component)

Use only top-level named components without these prefixes.

---

## Subscription

Community library. To subscribe in Figma:
**Main menu → Libraries → search "IGDS Design System File 2.0 new updated" → Add to file**

To verify subscription: call `get_libraries` on the file. The `library-key` above should appear in `libraries_added_to_file`.
