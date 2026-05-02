# ui-style.md — Visual Style Rules for Legacy Logic Studio

## Purpose

This file teaches IBM Bob and Cursor the exact UI style direction for **Legacy Logic Studio**.

Use this file together with:

- `docs/frontend.md`
- `docs/bob-rules.md`

The goal is to make the product look like a polished enterprise AI platform, not a basic hackathon prototype.

---

## 1. Final Recommended Style

Use this combined visual style:

# Dark IBM Enterprise Command Center

The UI should feel like:

- IBM Carbon-style enterprise clarity
- VS Code-style technical workspace
- Linear-style polished SaaS interface
- MATLAB/Simulink-style visual flow exploration
- AI command center for legacy modernization

The product must look:

- serious
- technical
- enterprise-ready
- premium
- easy to understand in a 3-minute demo

Do not make it look:

- playful
- cartoonish
- like a basic CRUD app
- like a simple student project
- like a plain Tailwind template

---

## 2. Design References

Use these references conceptually:

## IBM Carbon

Use Carbon-style clarity:

- strong visual hierarchy
- limited metrics
- consistent color assignments
- whitespace for clarity
- enterprise dashboard structure

## VS Code

Use VS Code-style workspace logic:

- left-side hierarchy/navigation
- main content/editor area
- panels for inspection and output
- technical density without chaos

## Linear

Use Linear-style polish:

- reduced visual noise
- strong alignment
- high-quality spacing
- calm navigation
- refined panels and headers

## React Flow / Visual Editor

Use React Flow-style node editor:

- nested graphs
- expandable/collapsible parent nodes
- clear 2D directed flows
- readable graph canvas
- visual test traces

---

## 3. Global Visual Personality

The product should feel like:

```txt
Enterprise AI modernization command center
```

Not:

```txt
Simple dashboard
```

Not:

```txt
Toy graph editor
```

Not:

```txt
Generic SaaS landing page
```

The best mental model is:

```txt
VS Code + IBM Carbon dashboard + Linear polish + visual workflow debugger
```

---

## 4. Color Palette

Use a dark enterprise palette.

### Base colors

```txt
App background:
#0B1020

Alternative background:
#0F172A

Main panel background:
#111827

Secondary panel background:
#111C2E

Elevated card background:
#172033

Input background:
#0F172A

Graph canvas background:
#0B1220

Border:
#263244

Soft border:
#334155
```

### Text colors

```txt
Primary text:
#E5E7EB

Strong text:
#F8FAFC

Muted text:
#94A3B8

Subtle text:
#64748B

Disabled text:
#475569
```

### Accent colors

```txt
Primary IBM blue:
#0F62FE

Modern blue:
#2563EB

AI / generated purple:
#8B5CF6

Success green:
#22C55E

Warning amber:
#F59E0B

Error red:
#EF4444

Manual review orange:
#F97316

Inactive gray:
#64748B
```

---

## 5. Color Meaning

Use colors only when they carry meaning.

```txt
Blue:
domain nodes, structure, primary actions

Purple:
AI-generated output, modified logic, modernization artifact

Green:
passed tests, successful execution path, approved output

Red:
failed tests, failed node, rejected output, errors

Yellow / Amber:
warnings, impacted tests, needs rerun

Orange:
manual review, risk path, attention needed

Gray:
inactive path, not executed, helper logic
```

Do not randomly use colors for decoration.

---

## 6. Typography

Use one clean modern sans-serif.

Preferred fonts:

```txt
IBM Plex Sans
Inter
system-ui fallback
```

Use monospace only for:

- code snippets
- technical expressions
- file paths
- JSON-like data
- test names when needed

Recommended typography:

```txt
Hero headline:
48px–64px, bold, tight line-height

Page title:
28px–36px, semibold

Section heading:
18px–24px, semibold

Panel heading:
14px–16px, semibold

Body text:
14px–16px

Small labels:
11px–13px

Graph labels:
12px–14px, readable

Code / technical text:
13px–14px monospace
```

Do not use tiny unreadable graph labels.

---

## 7. Spacing and Density

The UI should be dense but readable.

Use:

```txt
Page padding:
24px–32px

Card padding:
16px–24px

Panel padding:
12px–16px

Small component gap:
8px

Section gap:
24px–40px

Dashboard grid gap:
16px–24px
```

Rules:

- Use whitespace to create hierarchy.
- Do not cram everything together.
- Do not make the interface too empty.
- Visual Editor can be denser than homepage.
- Report page should have more breathing room.

---

## 8. Component Style

### Cards

Cards should use:

```txt
background: #111827 or #172033
border: 1px solid #263244
border-radius: 16px or 20px
shadow: subtle only
padding: 16px–24px
```

Hover state:

```txt
border-color: #334155 or #0F62FE
background slightly lighter
```

### Buttons

Primary button:

```txt
background: #0F62FE
text: white
border-radius: 10px–12px
height: 40px–44px
font-weight: 600
```

Secondary button:

```txt
background: transparent or #111827
border: #334155
text: #E5E7EB
```

Danger button:

```txt
red accent only when truly destructive
```

Avoid large neon buttons.

### Badges

Use pill badges.

Badge examples:

```txt
Editable
Modified
Impacted
Passed
Failed
Warning
Generated
AI Assisted
High Complexity
```

Badge colors:

```txt
Editable = blue
Modified = purple
Impacted = amber
Passed = green
Failed = red
Warning = amber
Generated = purple
High Complexity = red/orange
```

---

## 9. Page Style Rules

## Homepage

The homepage should feel premium and product-led.

Use:

- dark hero background
- large headline
- subtle gradient glow
- graph preview image/card
- clean feature cards
- strong CTA
- no clutter

Hero content:

```txt
Visualize and modernize hidden legacy business logic.

Upload a legacy project, map nested decision flows, edit rules safely,
run visual tests, and generate modernization reports.
```

Homepage layout:

```txt
Top nav
Hero section
Problem section
Solution section
How it works stepper
IBM/Bob development partner note
CTA section
```

The hero should include a small visual preview of a graph/editor card.

---

## Upload Page

The upload page should feel simple and confident.

Use:

- centered upload card
- large drag/drop zone
- supported file badges
- sample project CTA
- detected project summary after upload

Do not show too many options.

After upload, show a polished detection summary:

```txt
Project uploaded: legacy-credit-platform.zip

143 files
37 Java files
8 XML config files
6 service classes
4 controllers
11 test files
```

Use compact metric chips.

---

## Analysis Dashboard

This page should feel like IBM Carbon-style enterprise analytics.

Use:

- metric summary cards
- nested hierarchy card
- selected domain detail panel
- complexity cards
- test coverage card
- clear CTA to Visual Editor

Visual style:

```txt
dark dashboard
consistent metrics
strong hierarchy
limited metrics
clean whitespace
```

Do not overload with 30 different metrics.

Use a hierarchy tree like:

```txt
Credit Decision Engine
├── Applicant Eligibility
├── Risk Assessment
│   ├── Credit Score Evaluation
│   ├── Debt-to-Income Ratio
│   └── Fraud Signal Check
├── Pricing & Offer Calculation
└── Final Decision Routing
```

Make selected item clearly highlighted.

---

## Visual Editor

This is the most important page.

It must look like a professional visual engineering workspace.

Layout:

```txt
Top toolbar
Left hierarchy pane
Center graph canvas
Right inspector/editor
Bottom test runner
```

Visual Editor style:

```txt
Dark IDE-like workspace
Dense but readable
Graph canvas as center focus
Subtle grid background
Crisp node cards
Strong selected node state
Clear colored test traces
```

Do not make this page look like a normal dashboard.
It should feel like a specialized tool.

---

## Report Page

The report page should feel like an executive technical report.

Use:

- clean report header
- visual logic map
- nested rule hierarchy
- changed rule cards
- test result summary
- source impact map
- generated assets section
- download buttons

The report should be more spacious than the editor.

It should feel shareable with:

- engineering leadership
- architects
- business analysts
- QA teams

---

## 10. Visual Editor Detailed Style

### Layout dimensions

Suggested proportions:

```txt
Left pane:
260px–320px

Center graph:
flex-grow

Right pane:
320px–380px

Bottom test runner:
220px–280px height
```

### Top toolbar

Use compact toolbar with:

```txt
Breadcrumb
Back
Expand All
Collapse All
Fit View
Run Tests
Generate Report
```

Breadcrumb example:

```txt
Credit Decision Engine / Risk Assessment / Credit Score Evaluation
```

Breadcrumb style:

- muted text for parent
- bright text for current flow
- slash separator
- clickable parent segments

---

## 11. Graph Canvas Style

Use a dark graph canvas.

Canvas:

```txt
background: #0B1220
subtle grid dots or lines
minimap in bottom-right
controls in top-right or bottom-right
```

Graph nodes must be readable.

### Domain / parent node

Large card style:

```txt
┌─────────────────────────────┐
│ ▸ Risk Assessment           │
│ 4 child flows · 12 rules     │
│ 3 source files · High risk   │
└─────────────────────────────┘
```

Style:

```txt
background: rgba(15, 98, 254, 0.12)
border: #0F62FE
text: #E5E7EB
rounded: 16px
```

### Decision node

Example:

```txt
Score >= 700?
Editable
```

Style:

```txt
background: #172033
border: #8B5CF6 if editable
border: #F59E0B if impacted
border: #8B5CF6 glow if modified
```

### Action node

Example:

```txt
Send to Manual Review
```

Style:

```txt
background: #111827
border: #334155
```

### Output node

Examples:

```txt
Approved
Rejected
Manual Review
```

Style:

```txt
Approved = green border
Rejected = red border
Manual Review = orange border
```

---

## 12. Edge Style

Use directed edges.

Default edge:

```txt
gray line
small arrow
subtle label
```

Selected or test path edge:

```txt
green thick line = passed
red thick line = failed
yellow thick line = warning
gray faded line = inactive
```

Edge labels should be small pills:

```txt
Yes
No
score >= 700
risk = HIGH
```

Do not put long explanations on edges.
Long explanations belong in the right inspector.

---

## 13. Right Inspector Style

Right pane should feel like a property inspector.

Use sections:

```txt
Selected Node
Business Meaning
Technical Expression
Source Locations
Editable Rule
Impact Preview
Actions
```

Editable rule form:

```txt
Current:
creditScore >= 700

New threshold:
[680]

[Preview Impact] [Run Impacted Tests]
[Apply Change] [Revert]
```

Use compact form controls.

When a node is selected:

- highlight node in graph
- highlight matching item in left tree
- show source locations
- show test coverage

---

## 14. Bottom Test Runner Style

The test runner should feel like a visual debugger.

Tabs:

```txt
All Tests
Impacted Tests
Failed Tests
Regression Tests
```

Test list row:

```txt
PASS   Approve applicant with score 760        42ms
PASS   Approve applicant at threshold 680      39ms
FAIL   Reject applicant with fraud flag        51ms
WARN   Pricing test needs rerun                -
```

Use:

- green status dot for pass
- red status dot for fail
- amber status dot for warning
- selected row background
- small flow coverage label

When test selected:

- graph highlights path
- right pane changes to test detail
- bottom row selected

---

## 15. Visual Report Style

Report page should contain visual cards.

Sections:

```txt
Executive Summary
Visual Logic Map
Nested Rule Hierarchy
Changed Rules
Test Visual Summary
Source Impact Map
Generated Assets
Downloads
```

### Visual Logic Map card

Use a simplified flowchart:

```txt
Credit Decision Engine
        ↓
Applicant Eligibility
        ↓
Risk Assessment
        ↓
Pricing & Offer Calculation
        ↓
Final Decision Routing
        ↓
Decision Output
```

### Changed Rule card

```txt
Minimum Credit Score

Before:
creditScore >= 700

After:
creditScore >= 680

Affected:
Credit Score Evaluation
Risk Tier Assignment
Final Decision Routing
```

### Test Summary card

```txt
7 total tests
5 passed
1 failed
1 warning
```

Show a mini path:

```txt
Application → Risk Assessment → Score >= 680 → Approved
```

---

## 16. Animation and Interaction

Use subtle animations only.

Good animations:

- page fade-in
- card hover lift
- graph node selected glow
- test path animated edge
- upload progress
- analysis progress steps
- toast notifications

Avoid:

- bouncing
- flashy effects
- excessive gradients
- too much motion in graph

---

## 17. Responsive Behavior

Desktop first.

The product is complex and should be optimized for laptop/desktop.

Minimum supported width:

```txt
1280px
```

For smaller screens:

- collapse left pane
- hide bottom test runner behind tab
- keep graph readable
- report page becomes single column

Do not spend too much time perfecting mobile for hackathon.

---

## 18. Copywriting Style

Use short, clear, confident product copy.

Tone:

```txt
technical
enterprise
clear
not hype-heavy
```

Use:

```txt
Run Modernization Scan
Open Visual Editor
Preview Impact
Run Impacted Tests
Generate Report
Download Report
```

Avoid:

```txt
Magic Analyze
Ask Bob
AI Miracle
One-click replace everything
```

---

## 19. IBM / Bob Wording

Correct:

```txt
Built with IBM Bob as the AI development partner.
```

Correct:

```txt
IBM Bob accelerated development of this prototype.
```

Correct:

```txt
The product can use AI to summarize, explain, and generate modernization artifacts.
```

Incorrect:

```txt
Analyze with Bob
```

Incorrect:

```txt
Bob API scans uploaded projects.
```

Incorrect:

```txt
Bob runs inside production.
```

---

## 20. Final Style Acceptance Criteria

The UI style is correct when:

1. It feels like an enterprise AI command center.
2. It has dark professional polish.
3. The Visual Editor feels like a real engineering tool.
4. The graph is readable and not chaotic.
5. Status colors are meaningful and consistent.
6. Homepage feels premium, not generic.
7. Analysis dashboard feels clear and data-driven.
8. Report page feels executive-shareable.
9. UI is strong enough for a 3-minute hackathon video.
10. The product looks like it could become a real SaaS platform.

---

## 21. Implementation Reminder for Bob

When implementing UI, follow this priority:

1. Clarity before decoration.
2. Readability before animation.
3. Meaningful color before colorful design.
4. Consistent layout before creative layout.
5. Demo reliability before advanced features.

The goal is not just “beautiful UI.”

The goal is:

```txt
A visual product that instantly communicates:
legacy code → nested business logic → editable flow → visual tests → visual report
```
