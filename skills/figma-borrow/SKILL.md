---
name: figma-borrow
description: Locate, subscribe, and instance a UI atom component from an indexed design library into a Figma file. Library-agnostic — points at a per-project library index file. Covers component lookup, subscription check, Plugin API instancing, and RTL verification.
---

# figma-borrow

Workflow for finding and instancing an atomic UI component (radio, checkbox, input, toggle, etc.) from an indexed design library into a Figma file via the Plugin API.

---

## 1. Inputs

| Input | Source | Example |
|---|---|---|
| Atom type | Caller | `"radio"`, `"checkbox"`, `"input"` |
| Target frame | Caller | Node ID where the instance should be placed |
| Library index | Project `.harness/` or `protocol.md` — default: `libraries/awesome-ds.md` | `libraries/awesome-ds.md` |

---

## 2. Workflow

### Step 1 — Load the library index

Read the library index file for the project (or the default). Extract:
- `library-key` — needed for scoped search and subscription check
- `rtl-native` — determines whether RTL skill is needed post-instance
- Component table — for direct key lookup

### Step 2 — Look up the component key

Check the index table for the requested atom type.

**If found:** use the component key directly → skip to Step 4.

**If not found:** walk the fallback chain:

1. Live search within the current library: `search_design_system: query="<atom type>", includeLibraryKeys=["<library-key>"]`
2. If still not found and the current library is Awesome DS → try IGDS (`libraries/igds.md`) for RTL-native Hebrew atoms
3. If still not found → run `search_design_system` across all available org libraries

Filter out results prefixed with `⛔` or `🚧` (internal atoms — not for direct use). Present the best match and confirm before proceeding.

If a component is found in a fallback library and proves stable, add it to the primary index — and consider publishing an equivalent to Awesome DS to close the gap.

### Step 3 — Check library subscription

The library must be enabled in the Figma file before `importComponentByKeyAsync` will succeed.

Verify via `get_libraries` on the file. If the library key appears in `libraries_added_to_file`, proceed.

If not subscribed, surface this to the caller:

> ⚠ Library not subscribed. In Figma: Main menu → Libraries → find "[library-name]" → Add to file. Then re-run.

### Step 4 — Instance via Plugin API

```javascript
// Switch to the target page
await figma.setCurrentPageAsync(figma.pages.find(p => p.id === 'TARGET_PAGE_ID'));

// Import and instance
const component = await figma.importComponentByKeyAsync('COMPONENT_KEY');
const instance = component.createInstance();

// Append to target frame
const parent = await figma.getNodeByIdAsync('TARGET_FRAME_ID');
parent.appendChild(instance);

// If parent is auto-layout, set sizing after appendChild
instance.layoutSizingHorizontal = 'FILL'; // adjust to layout needs
```

Return the instance node ID for the caller to verify or position.

### Step 5 — RTL verification

**If `rtl-native: true`:** spot-check that text alignment and layout direction match project conventions. No active transformation needed in most cases.

**If `rtl-native: false`:** apply the RTL skill to the instance before use.

---

## 3. Library Indexes

Available indexes in `libraries/`:

| File | Library | RTL native | Coverage | Role |
|---|---|---|---|---|
| `libraries/awesome-ds.md` | Awesome DS (org) | No — apply RTL skill | Button, Checkbox, Nav, Pagination + page map of unpublished components | **Default** |
| `libraries/igds.md` | IGDS Design System File 2.0 new updated (Community) | Yes | Radio, Checkbox, Calendar | RTL fallback for Hebrew projects |

Add new library index files to `libraries/` as needed. Each follows the format defined in `libraries/awesome-ds.md`.

To override the default for a project, add this line to the project's `protocol.md` or `.harness/02_PRD.md`:

```
Figma borrow library: skills/figma-borrow/libraries/igds.md
```
