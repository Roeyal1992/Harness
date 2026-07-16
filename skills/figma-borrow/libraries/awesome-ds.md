---
library-name: Awesome DS
library-key: lk-f6994310c89d4e32090eb39dcd4060cab523f996848f9478cb6da9ee96b5bfebdc22c17d17bb3335256da5083336e9b89d18d0cee485d9353362cbb0b3a41f71
rtl-native: false
source: organization
language: LTR-default (apply RTL skill for Hebrew projects)
figma-file: Fch7Xd38Zkg5WALCF8Xzih
last-verified: 2026-07-13
---

# Awesome DS — Component Index

AwesomeTLV Studio design system. Clone of Figma's Simple Design System, customized for studio projects. Intended as the growing studio default for wireframing and early UX design.

**Status:** Many components exist visually but are not yet published to the library. Published components can be instanced directly via component key. Unpublished ones must be published first — a natural expansion path as the library matures.

---

## Published Components (borrowable now)

| atom | component-name | component-key | notes |
|---|---|---|---|
| button | Button | 928c368b076f7555e8e0765250513584b324f613 | Primary/Secondary variants, Default/Hover/Active states |
| button-danger | Button Danger | e0d5a9d12ab39662730e5b3aa3062906c2559bf2 | Destructive action |
| button-icon | Icon Button | 38e53ae6f4f7d62e3942542a1d9a3dfa5fcbc55c | Icon-only button |
| button-group | Button Group | 092fa8d2c7c0abfe6ba37a8959470bc2148d10db | Grouped button row |
| nav-button | Navigation Button | e4f6a141ce2020b18986a974129abb3bd8beb73b | Single nav item with icon |
| nav-button-list | Navigation Button List | e37d0c10d1240f926394d8fd54e7db66576b776f | Menu item list |
| pagination | Pagination | 5d056f2590c532b2e7f86210bf47d567ced6479e | Full pagination bar |
| pagination-gap | Pagination Gap | fcac711d81f5ccc96d38197096d7db80035614a3 | Ellipsis gap atom |
| checkbox-field | Checkbox Field | 872ce98074da5907e4600cdcacc786e5db80cb79 | Checkbox with label |

---

## File Page Map (all components — published and unpublished)

| Page | Node ID | Components visible | Published? |
|---|---|---|---|
| Foundations | 9762:187 | Color tokens, type scale | n/a |
| Icons | 7809:18809 | Full icon library (hundreds) | unknown |
| Accordion | 128:10528 | Expand/collapse, Closed/Open states | ✗ |
| Avatar | 128:10526 | Circle/Square × S/M/L, Image/Initial, AvatarGroup (Spaced/Overlap) | ✗ |
| Button | 128:10284 | Button, Button Danger, Icon Button, Button Group | ✓ (all 4) |
| Card | 2143:13485 | Content card, Pricing card (light + dark) | ✗ |
| Form / Input | 128:10421 | Text input, Textarea, Toggle/Switch, form layout examples | ✗ |
| Banner / Alert | 128:10423 | Message (neutral) + Alert (red), × close, CTA button | ✗ |
| Navigation | 87:18810 | Navigation Button, Navigation Button List, menu heading | ✓ (nav items) |
| Rating | 516:12822 | Star rating S/M, Row/Column, Default/Hover/Active | ✗ |
| Pagination | 128:10527 | Pagination bar, Pagination Gap | ✓ |
| Checkbox / Switch | 128:10525 | Checkbox Field, Toggle/Switch, form examples | ✓ (checkbox) |
| Tag / Badge | 128:11109 | Tag (Brand/Danger/Positive/Warning/Neutral) × Primary/Secondary, Filter chip Active/Inactive | ✗ |
| Tooltip | 128:10523 | Top/Bottom/Left/Right positioning | ✗ |
| Typography | 370:5433 | Heading, Title, Subtitle, text components | ✗ |
| Examples | 7641:2142 | Full page layout examples (not components) | n/a |
| Examples — Dark | 368:11410 | Light + dark full page mockups (not components) | n/a |

---

## Fallback

When the needed atom is not published in Awesome DS, fall back to the IGDS library index (`libraries/igds.md`) for RTL-native Hebrew atoms, or run a live `search_design_system` call.

After a successful borrow from a fallback library, consider publishing the equivalent component in Awesome DS to expand studio coverage.

---

## Subscription

This is an organization library — no manual subscription needed for Deloitte Studios org members. It should appear in `libraries_added_to_file` automatically, or can be enabled via Figma → Main menu → Libraries → Awesome DS.
