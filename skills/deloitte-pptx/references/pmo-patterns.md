# PMO & SteerCo Reporting Patterns

Patterns for program management, SteerCo pre-reads, status reports, and operational dashboards.

## RAID / Risk Register Table

6–7 columns, 5–8 rows. Header in Deloitte Green. Severity column uses conditional color fills (red=Critical, yellow=High, orange=Medium, green=Low). These are functional colors — RAG status is the one context where red/orange/yellow ARE appropriate.

**Bold key phrases** in the description column so executives can scan without reading full sentences. Max 7–8 risks per slide.

## Status Pipeline (Deployment Funnel)

Horizontal pipeline: Identified → Intake → Development → Beta → Deployed. Each stage shows a count with delta annotation (↑4, ↓2, --). Colors progress from light blue (not started) through teal to deep green (deployed).

Place a summary header above: "46 USE CASES (↑9)" with total and net change.

## Scorecard Grid (Plan vs. Forecast with Donuts)

Grid layout showing metrics by function/EA. Each row: function label | donut charts for % completion | KPI tiles (processes, hours, savings) for Plan and Forecast | notes column.

Use `XL_CHART_TYPE.DOUGHNUT` for two-color donuts (brand green + light gray). Keep donuts small (1.2" × 1.2").

## Plan / Forecast / Actual Bar Charts

Three-series grouped bar charts across fiscal years. Colors: Plan = deep green, Forecast = Deloitte green, Actual = blue. Y-axis format: $#,##0 for savings, #,##0 for hours, 0% for percentages.

## Progress Tracker Table

Use case tracker with phase status columns. Phase cells get color fills: Intake = blue, Development = green, Deployment = deep green, Ready for Launch = teal. Merge "Enabling Area" cells vertically when multiple use cases share one EA.

## Recurring Footer Label

Colored bar at the very bottom (y=7.15", h=0.35") categorizing the slide type. Common labels:

| Label | Color | When |
|---|---|---|
| Standard Bi-Weekly Update | Teal | Recurring status slides |
| Decision Required | Deloitte Green | Slides needing SteerCo action |
| Deep Dive | Deep Green | Detailed analysis slides |
| Appendix | Dark Gray | Reference/backup slides |

## Narrative with Inline Icons

"What We're Seeing" slides: icon images or colored circles next to each finding. Bold the core insight in each finding. End with a pale green or dark green takeaway bar.

## Quarterly Timeline

Q1/Q2/Q3/Q4 nodes on a horizontal line. Each node: circle with quarter label, big value below (24pt bold), description (9pt gray). Connect nodes with a teal horizontal line.

## Pattern Selection for SteerCo Pre-Reads

| Slide Purpose | Pattern |
|---|---|
| Executive summary / observations | Narrative with inline icons |
| Use case pipeline status | Status pipeline + quarterly timeline |
| Risk & issues register | RAID table |
| Impact / scorecard | Scorecard grid with donuts |
| Multi-year projections | Plan/Forecast/Actual bar charts |
| Use case progress detail | Progress tracker table |
| Decisions needed | 2-column: decision + options |
