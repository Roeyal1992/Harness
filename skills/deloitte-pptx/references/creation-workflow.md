# Deck Creation Workflow

Read this before building any new deck. The order is: **decision → message → evidence → visual → layout**.

## Step 1: Clarify the Objective

- **What decision should this deck support?** (e.g., "approve the investment", "align on priorities", "understand the new process")
- **Who is the audience?** Classify as one of:
  - **Board/executive** → fewer words, stronger assertions, cleaner visuals
  - **Client-facing** → polished narrative, more explanatory labels, formal tone
  - **Internal leadership** → more detail, operating metrics, action-oriented
  - **Working session** → dense, editable, discussion-ready
  - **Training/enablement** → instructional structure, progressive builds, examples
- **Is this a new deck, an edit, or a slide expansion?**

## Step 2: Build a Slide Blueprint

**Create an internal planning table before rendering any slides.** This prevents the most common failure mode — generating attractive slides with weak claims.

```
| Slide | Purpose          | Takeaway title                                      | Supporting evidence         | Visual type     | Layout  | Source         |
|-------|------------------|----------------------------------------------------|-----------------------------|-----------------|---------|----------------|
| 1     | Title            | [Deck title]                                       | —                           | Title + photo   | 6       | —              |
| 2     | Context          | "Growth is concentrated in two priority segments"  | Revenue by segment, 3yr     | Bar chart       | 24      | FY25 financials|
| 3     | Problem          | "The current model will not scale without automation"| Cost per transaction trend | Line chart      | 24      | Ops dashboard  |
| 4     | Divider          | Recommended Approach                               | —                           | —               | 21      | —              |
| 5     | Recommendation   | "Three investments unlock 40% capacity"            | Investment vs. impact       | 2x2 matrix      | 23      | Business case  |
| ...   | ...              | ...                                                | ...                         | ...             | ...     | ...            |
```

**Rules for the blueprint:**
- Every content slide MUST have a takeaway title that expresses a conclusion, not a topic
- Every slide with quantitative claims MUST have a source column entry
- If evidence is missing, mark it as `[data needed]` — do NOT fabricate
- The storyline must be coherent when you read the takeaway titles in sequence

## Step 3: Title Rule

Title style depends on audience:

**Executive briefings / board decks:** Titles MUST be assertive conclusions, not topic labels.

| ❌ Weak | ✅ Strong |
|---|---|
| Market Overview | Growth is concentrated in two priority segments |
| Financial Performance | Operating margin improved despite flat revenue |
| Recommendations | Three targeted investments unlock $2M in annual savings |

**Client pitches / marketing:** Descriptive, provocative, or question-based titles are encouraged.

| ✅ Acceptable for pitches |
|---|
| Questions We Help You Answer |
| How It Works |
| What Sets Us Apart |

**Test for exec decks:** Can someone understand the slide's point by reading ONLY the title?
**Test for pitches:** Does the title create curiosity or frame the conversation?

## Step 4: Match Evidence to Visual Form

Choose visuals based on communication logic, not aesthetics:

| Message type | Best visual | Avoid |
|---|---|---|
| Comparison across categories | Bar chart (horizontal or vertical) | Pie chart with >5 segments |
| Trend over time | Line chart | Bar chart (obscures trend) |
| Share / composition | Stacked bar or donut (only when parts matter) | 3D pie |
| Process / sequence | Timeline, chevron, or roadmap | Bullet list |
| Option tradeoffs | Matrix or comparison table | Side-by-side paragraphs |
| KPI status | Scorecard tiles / KPI dashboard | Dense table |
| Qualitative synthesis | 3-column cards or pentagon boxes | Fake chart with made-up numbers |
| Org / relationship structure | Org chart or Venn diagram | Bullet list |

## Step 5: Content Density Rules

| Rule | Limit |
|---|---|
| Main messages per slide | **1** |
| Primary visuals per slide | **1** (unless a true comparison requires 2) |
| Supporting bullets | **3–5 max** |
| Bullet style | Fragments, not sentences or paragraphs |
| Readability target | Slide should read in **under 20 seconds** |
| Consecutive slides with same layout | **2 max** before varying |

## Step 6: Accuracy Rules

**Never fabricate facts to complete a slide.**

- **Never invent** metrics, dates, percentages, company names, logos, or sources
- **Never imply** quantitative precision without provided evidence
- **Never create** comparisons without a stated basis
- When data is missing: use explicit placeholders like `[insert metric]`, `[source required]`, or `[data needed — ask client]`
- Any slide with quantitative claims **MUST** include a source footnote
- Any slide with company-specific logos/benchmarks **MUST** come from provided inputs or approved assets
- Clearly distinguish **analysis** (your synthesis) from **fact** (sourced data)

## Step 7: Source Trace Convention

- **Quantitative slides** → source footnote required (7–8pt, gray, bottom of content area)
- **Synthesized conclusions** → mark as "Deloitte analysis" or "Based on [input document]"
- **Client-specific data** → attribute to the provided source document
- **General knowledge** → no source needed, but do not present opinions as facts
