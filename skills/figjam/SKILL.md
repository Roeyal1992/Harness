---
name: figjam
description: "FigJam visual collaboration — board setup, page structure, grouping standards, and operational procedures. Use when working with any FigJam board: setting up pages, converting groupings to sections, or any visual ideation and mapping work."
version: 0.1.0
---

# FigJam Collaboration Skill

FigJam is the visual collaboration portal for cross-project work — ideation, user journey mapping, flowcharting, and domain-level coordination. This skill governs how the AI and operator work together on FigJam boards.

## When to Use

Invoke when:
- Working with any FigJam board (`figma.com/board/...`)
- Setting up or restructuring a board's page layout
- Working with groupings, sections, or flowcharts on a board
- Any FigJam-specific write or inspect operation

## What's in This Directory

| File | Load when |
|---|---|
| `standards.md` | Before making any structural decision — naming, page setup, grouping conventions |
| `procedures.md` | Before executing a specific operation — board setup, section migration, API patterns |

## Before Any Write Operation

Load the `figma-use` skill from the Figma MCP before calling `use_figma`:

```
ReadMcpResourceTool server="claude.ai Figma" uri="skill://figma/figma-use/SKILL.md"
```

Then load whichever file from this directory matches the current task.

## Core Principles

- **FigJam boards are project infrastructure, not deliverables.** They are working surfaces, not outputs.
- **Sections over rectangles.** Always use FigJam Sections to group content — never bare rectangles as visual-only containers.
- **One page per domain.** Each domain in a project gets its own page, named after the domain.
- **The AI handles layer routing.** The operator works in terms of the content and intent. The AI identifies the right structural element (section, page, connector) and executes it.
