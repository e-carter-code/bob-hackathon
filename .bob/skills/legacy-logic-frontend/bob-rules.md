# bob-rules.md — IBM Bob Working Rules for Legacy Logic Studio

## Purpose

This file gives IBM Bob repeatable project instructions.

Bob must use these rules whenever helping with this repository.

The goal is to make Bob behave consistently, avoid misunderstanding the product, and create clean Bob task history for hackathon judging.

---

## Project

Project name: **Legacy Logic Studio**

Legacy Logic Studio is a web product that helps users upload a legacy software project, analyze nested business logic, visualize that logic as editable workflows, run visual tests, and generate a visual modernization report.

---

## Critical Rule: Bob Is Not Runtime

IBM Bob is NOT a runtime API inside this product.

Do not create code that calls Bob from the web app.
Do not create backend routes that call Bob.
Do not create hidden Bob API integration.
Do not label UI buttons as “Analyze with Bob”.

Correct wording:

> Built with IBM Bob as the AI development partner.

The product runtime should use its own frontend state, mock data, analyzers, and optional watsonx.ai/LLM integration later.

---

## Product Runtime Flow

The product should show this flow:

1. User opens homepage.
2. User uploads a legacy project ZIP or chooses sample project.
3. Product runs a modernization scan.
4. Product shows analysis dashboard with nested business-logic hierarchy.
5. User opens visual editor.
6. User explores parent and child flows.
7. User edits an editable business rule.
8. Product marks impacted flows and tests.
9. User runs visual tests.
10. Product shows colored graph paths for test results.
11. Product generates visual report.
12. User downloads Markdown, JSON, graph image, or report package.

---

## Required Pages

Build only these pages:

1. Home
2. Upload
3. Analysis
4. Visual Editor
5. Report

Do not create a separate Workspace page.
Do not create a separate Legacy vs Modern page.

---

## Main UI Layout

The Visual Editor is the most important screen.

It must use this structure:

- Left pane: hierarchical rule tree
- Center pane: 2D nested visual graph
- Right pane: inspector / editable rule panel
- Bottom pane: visual test runner

The app should feel like:

> VS Code + MATLAB/Simulink-style logic explorer + visual test runner + modernization report generator

---

## Visual Graph Rules

The graph must support complex nested business logic.

Do not build only a simple flat flowchart.

Use levels:

- Level 1: System-level workflow
- Level 2: Domain-level workflow
- Level 3: Rule-level workflow

Example hierarchy:

Credit Decision Engine
├── Applicant Eligibility
│   ├── Identity Verification
│   ├── Age Requirement
│   └── Residency Rule
├── Risk Assessment
│   ├── Credit Score Evaluation
│   ├── Debt-to-Income Ratio
│   ├── Fraud Signal Check
│   └── Manual Review Trigger
├── Pricing & Offer Calculation
│   ├── Base APR Calculation
│   ├── Risk Adjustment
│   └── Loyalty Discount
└── Final Decision Routing
    ├── Approval Path
    ├── Rejection Path
    └── Manual Review Path

---

## Visual Graph Interactions

Users should be able to:

- single click a node to inspect it
- double click a parent node to step into a child flow
- expand/collapse parent nodes
- use breadcrumbs to move back to parent flows
- click editable rule nodes
- edit rule values in the right pane
- run tests
- click tests to highlight execution paths
- generate a visual report from current state

---

## Rule Editing Rules

When user clicks an editable node, show this in the right pane:

- Rule name
- Parent flow
- Business meaning
- Technical expression
- Editable value
- Source locations
- Impact preview
- Buttons:
  - Preview Impact
  - Run Impacted Tests
  - Apply Change
  - Revert

Example rule:

Rule name:
Minimum Credit Score

Before:
creditScore >= 700

After:
creditScore >= 680

When applied:

- update graph node label to `Score >= 680?`
- mark node as modified
- mark parent flows as impacted
- mark related tests as warning / needs rerun
- update report data

---

## Visual Test Runner Rules

The bottom test panel must include tabs:

- All Tests
- Impacted Tests
- Failed Tests
- Regression Tests

Each test must show:

- status
- test name
- flow covered
- duration
- impacted badge

When user clicks a test:

- highlight the graph execution path
- show test detail in the right pane
- show expected path
- show actual path
- show failure node if failed
- show reason

Graph path colors:

- Green = passed executed path
- Red = failed node/path
- Yellow = warning or impacted path
- Gray = not part of selected test

---

## Report Page Rules

The report page must be visual, not just text.

It must include:

1. Executive summary
2. Visual logic map / flowchart
3. Nested rule hierarchy
4. Changed rules
5. Test result visual summary
6. Source impact map
7. Generated assets
8. Download buttons

Download buttons:

- PDF Report
- Markdown Report
- JSON Analysis
- Graph Image
- Modernization Package

For MVP:

- Markdown download must work
- JSON download must work
- PDF can use browser print or simple mock export
- Graph image can be mocked or exported if easy

---

## Design Rules

Use polished enterprise SaaS design.

Prefer:

- dark mode
- clean cards
- rounded corners
- subtle borders
- good spacing
- readable graph labels
- consistent color semantics
- professional dashboard style

Avoid:

- plain HTML look
- cluttered panels
- tiny unreadable labels
- messy graph edges
- unclear status colors
- disconnected pages

---

## Tech Stack

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Flow
- Zustand or React Context
- Lucide React icons
- html-to-image if graph export is needed
- Monaco Editor only if a code snippet preview is needed

---

## Mock Data First

Use mock data first.

Create:

- `src/data/sampleProject.ts`
- `src/data/sampleFlows.ts`
- `src/data/sampleTests.ts`
- `src/data/sampleReport.ts`

The MVP must work end-to-end without backend.

---

## Implementation Order

Implement in phases.

### Phase 1

- App shell
- Routing
- Top navigation
- Empty pages

### Phase 2

- Homepage
- Upload page
- sample project loading

### Phase 3

- Analysis dashboard
- summary cards
- nested hierarchy
- domain details panel

### Phase 4

- Visual editor layout
- left rule tree
- center graph
- right inspector
- bottom test runner

### Phase 5

- editable rule node
- change 700 to 680
- update graph and state
- mark impacted tests

### Phase 6

- test runner
- clickable tests
- graph path highlighting
- expected vs actual path details

### Phase 7

- visual report
- report downloads
- graph/map summary

---

## Acceptance Criteria

The UI is complete when:

1. Homepage explains product clearly.
2. Upload page loads sample project.
3. Analysis dashboard shows nested business logic.
4. Visual editor shows nested 2D graph.
5. User can step into child flows.
6. User can click editable rule.
7. User can edit 700 to 680.
8. Graph updates node label.
9. Impacted flows/tests are marked.
10. Test runner shows pass/fail/warning.
11. Clicking a test highlights graph path.
12. Right pane explains test result.
13. Report page shows visual flowchart and summary.
14. Markdown and JSON downloads work.
15. App is demo-ready for a 3-minute hackathon presentation.

---

## Bob Behavior Rules

When helping with implementation, Bob must:

1. Read `docs/frontend.md` and this file first.
2. Summarize understanding before coding.
3. Implement one phase at a time.
4. Avoid changing unrelated files.
5. Use mock data before backend.
6. Keep code modular and readable.
7. Explain what changed after each task.
8. Prefer minimal working implementation over overengineering.
9. Do not invent runtime Bob API integration.
10. Preserve the required UI flow.

---

## First Bob Prompt

Use this prompt first:

Read these files:

- docs/frontend.md
- docs/bob-rules.md

Understand the product, UI flow, constraints, and implementation rules.

Do not write code yet.

Return:

1. concise product summary
2. required pages
3. core visual editor layout
4. implementation phases
5. any missing clarification before implementation
