# frontend.md — Legacy Logic Studio Frontend Build Spec

## 0. Project Summary

Build a polished web product called **Legacy Logic Studio**.

The product lets a user upload a full legacy software project, then shows an AI-assisted modernization experience:

1. Upload a legacy project ZIP.
2. Run analysis.
3. Show nested business-logic hierarchy.
4. Open a visual 2D workflow editor.
5. Expand/collapse parent flows.
6. Step into child flows.
7. Edit business rules from the visual graph.
8. Run visual tests.
9. Show test execution paths directly on the graph.
10. Generate a visual modernization report.
11. Download the report and analysis assets.

This is a frontend-first hackathon demo. Use realistic mock/sample data so the UI looks fully functional even before real backend integration.

Do **not** build a production backend yet.

Do **not** show IBM Bob as a runtime product API. IBM Bob is the development partner used to build the product. The product itself runs its own analysis workflow and may later connect to watsonx.ai or another model.

---

## 1. Product Positioning

### Product name

**Legacy Logic Studio**

### Tagline

**Upload legacy projects. Discover hidden business logic. Visualize, edit, test, and report modernization changes.**

### Core promise

Legacy systems often hide important business decisions inside complex nested code. This product turns those hidden decisions into a visual, editable, testable workflow.

### Target users

- Developers modernizing legacy systems
- Solution architects
- Business analysts
- Engineering leads
- QA / test engineers
- Cloud migration teams

### Core demo story

A user uploads a full legacy Java project. The app analyzes the project, discovers nested business logic, displays a hierarchical flow graph, lets the user edit a rule, runs visual tests, and generates a downloadable visual report.

---

## 2. Tech Stack

Use the following frontend stack:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand or React Context for global state
- React Flow for the 2D nested graph editor
- Monaco Editor for optional code preview snippets
- Lucide React for icons
- html-to-image for exporting graph snapshots
- Optional: Mermaid for report-friendly diagrams
- Optional: jsPDF or browser print-to-PDF for report export

Do not overbuild. The first version should run from mock data.

---

## 3. Application Routes

Use these routes:

```txt
/
  Homepage

/upload
  Project upload page

/analysis
  Analysis dashboard page

/editor
  Visual logic editor + visual test runner

/report
  Visual report page
```

Remove these as separate pages:

```txt
/workspace
/legacy-vs-modern
```

Do not create separate Workspace or Legacy vs Modern pages. If code preview is needed, place it inside side panels or report sections.

---

## 4. Main User Flow

```txt
Homepage
  ↓
Upload Project
  ↓
Analysis Dashboard
  ↓
Visual Logic Editor + Test Runner
  ↓
Visual Report
  ↓
Download Report / Assets
```

The flow should be clear and demo-friendly.

---

## 5. Global Layout

Use a clean SaaS layout.

### Top navigation

Display on all pages:

```txt
Legacy Logic Studio        Home | Upload | Analysis | Visual Editor | Report
```

Right side of top nav:

```txt
[Use Sample Project] [Export]
```

### Visual style

Use:

- Dark mode or high-contrast dark SaaS style.
- Clean cards.
- Rounded corners.
- Subtle borders.
- Good spacing.
- Clear typography.
- Modern dashboard feeling.

Recommended visual tone:

```txt
VS Code + React Flow canvas + enterprise modernization dashboard
```

### Color semantics

Use consistent visual status colors:

```txt
Blue       = domain / subsystem / parent flow
Purple     = AI-extracted rule / generated artifact
Yellow     = editable rule / warning / impacted
Green      = passed test / approved path
Red        = failed test / rejected path / error
Orange     = manual review / risk path
Gray       = inactive / not executed / helper logic
```

---

## 6. Page 1 — Homepage

### Goal

Explain what the product does and quickly start the demo.

### Hero section

Content:

```txt
Legacy Logic Studio

Upload legacy projects.
Discover hidden business logic.
Visualize nested workflows.
Edit rules safely.
Run visual tests.
Generate visual modernization reports.

[Start Demo] [Upload Project]
```

### Problem section

```txt
Legacy systems hide critical business decisions inside complex, nested, hard-to-change code.
Teams struggle to understand which files contain real business rules, what changes are safe, and which tests prove the logic still works.
```

### Solution section

```txt
Legacy Logic Studio converts uploaded legacy projects into a visual logic map.
It shows nested business flows, editable rules, source impact, test traces, and downloadable reports.
```

### How it works section

Display a horizontal stepper:

```txt
Upload → Analyze → Visualize → Edit → Test → Report
```

Each step should have a short card.

### IBM / AI story section

Use this exact idea:

```txt
Built with IBM Bob as the AI development partner.
The product can use AI to summarize, explain, and generate modernization artifacts.
IBM Bob is not shown as a hidden runtime API.
```

### CTA buttons

- `Start Demo` navigates to `/upload`
- `Upload Project` navigates to `/upload`

---

## 7. Page 2 — Upload Project

### Goal

Show that the product accepts a full legacy project, not one file.

### Layout

Use a centered upload card.

```txt
Upload Legacy Project

Drag and drop a project ZIP here

Supported:
✓ Java projects
✓ Maven / Gradle
✓ Multi-directory repositories
✓ XML / properties files
✓ Existing tests and docs

[Use Sample Project] [Choose ZIP File]
```

### Upload behavior

For MVP:

- `Use Sample Project` loads mock sample project data.
- `Choose ZIP File` can accept a file but does not need to parse it yet.
- If user chooses a file, show the selected file name.
- Always allow proceeding with sample data.

### After upload

Show this result card:

```txt
Project uploaded: legacy-credit-platform.zip

Detected:
✓ 143 files
✓ 37 Java files
✓ 8 XML config files
✓ Maven project
✓ 6 service classes
✓ 4 controller classes
✓ 11 test files

[Run Analysis]
```

Clicking `Run Analysis` should:

1. show a short loading animation,
2. show staged progress messages,
3. navigate to `/analysis`.

### Loading messages

```txt
Scanning project structure...
Detecting service classes...
Finding business-logic hotspots...
Building nested rule hierarchy...
Preparing visual flow model...
```

---

## 8. Page 3 — Analysis Dashboard

### Goal

Show nested business-logic structure before entering the editor.

### Main summary cards

At top:

```txt
Project: legacy-credit-platform

[143 Files Scanned]
[5 Logic Domains]
[38 Rules]
[9 Nested Flows]
[7 Tests Detected]
```

### Business logic hierarchy panel

Large left/main card:

```txt
Business Logic Hierarchy

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
```

Make this tree interactive:

- Click a domain to select it.
- Highlight selected item.
- Show details in right panel.

### Right details panel

Default selected domain: `Risk Assessment`.

```txt
Selected Domain: Risk Assessment

Complexity: High
Nested Depth: 3 levels
Rules Found: 12
Editable Rules: 4
Tests Covering This Domain: 5

Source Files:
- CreditApprovalService.java
- RiskScoringService.java
- FraudCheckService.java
- credit-rules.xml

[Open Visual Editor]
```

### Additional dashboard sections

#### Complexity map

Cards:

```txt
High Complexity
Risk Assessment

Medium Complexity
Pricing & Offer Calculation

Low Complexity
Applicant Eligibility
```

#### Test coverage card

```txt
Test Coverage

7 tests detected
5 passing
1 failing
1 warning
```

#### Modernization readiness

```txt
Modernization Readiness

Rule extraction: Ready
Visual flow: Ready
Editable rules: 4
Report generation: Ready
```

### Navigation

Clicking `Open Visual Editor` navigates to `/editor`.

---

## 9. Page 4 — Visual Logic Editor + Test Runner

This is the main product screen.

### Goal

Create a power-user screen combining:

- Left rule hierarchy
- Center nested 2D graph
- Right inspector/editor
- Bottom visual test runner

### Layout

```txt
┌────────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Credit Decision Engine / Risk Assessment               │
│ [Back] [Expand All] [Collapse All] [Fit View] [Run Tests] [Report] │
├───────────────┬──────────────────────────────────────┬─────────────┤
│ Rule Tree     │ Visual Flow Canvas                   │ Inspector   │
│               │                                      │ / Editor    │
├───────────────┴──────────────────────────────────────┴─────────────┤
│ Visual Test Runner                                                  │
└────────────────────────────────────────────────────────────────────┘
```

### Editor top bar

Show:

```txt
Credit Decision Engine / Risk Assessment
[Back]
[Expand All]
[Collapse All]
[Fit View]
[Run Tests]
[Generate Report]
```

### Left pane — Rule hierarchy

Show a tree:

```txt
Credit Decision Engine
├── Applicant Eligibility
│   ├── Identity Verification
│   ├── Age Requirement
│   └── Residency Rule
├── Risk Assessment
│   ├── Credit Score Evaluation
│   │   ├── Score Missing Check
│   │   ├── Minimum Score Rule  ● editable
│   │   └── Preferred Score Rule
│   ├── Debt Ratio Check
│   └── Fraud Signal Check
├── Pricing Calculation
└── Final Decision Routing
```

Tree item badges:

```txt
editable
modified
impacted
passed
failed
warning
```

Clicking a tree item should:

- select the corresponding graph node or flow,
- update the right inspector,
- optionally focus graph viewport on that node.

### Center pane — Visual graph

Use React Flow.

The graph must support:

- pan
- zoom
- minimap
- controls
- fit view
- custom nodes
- custom edges
- expandable parent nodes
- step-into child flow
- breadcrumb navigation
- highlighted execution paths for tests

### Graph levels

Support three conceptual levels:

```txt
Level 1: System flow
Level 2: Domain flow
Level 3: Rule-level flow
```

### Level 1 graph

```txt
[Application Received]
        ↓
[Applicant Eligibility ▸]
        ↓
[Risk Assessment ▸]
        ↓
[Pricing & Offer Calculation ▸]
        ↓
[Final Decision Routing ▸]
        ↓
[Decision Output]
```

### Level 2 graph: Risk Assessment

```txt
[Start Risk Assessment]
        ↓
[Credit Score Evaluation ▸]
        ↓
[Debt-to-Income Ratio Check ▸]
        ↓
[Fraud Signal Check ▸]
        ↓
[Risk Tier Assignment]
        ↓
[Manual Review Trigger?]
        ├── Yes → [Send to Manual Review]
        └── No  → [Continue to Pricing]
```

### Level 3 graph: Credit Score Evaluation

```txt
[Read Credit Score]
        ↓
[Score Missing?]
        ├── Yes → [Manual Review]
        └── No
              ↓
        [Score >= 700?]
        ├── No → [High Risk Tier]
        └── Yes
              ↓
        [Score >= 760?]
        ├── Yes → [Preferred Risk Tier]
        └── No  → [Standard Risk Tier]
```

### Node interactions

Implement:

```txt
Single click node
→ select node and show details in right pane

Double click parent node
→ step into child flow

Click expand icon
→ show/hide child nodes inline if possible

Breadcrumb click
→ go back to parent flow

Click editable node
→ show editor form in right pane
```

### Custom node design

Create these custom node types:

#### Domain node

Large rounded rectangle.

```txt
Risk Assessment ▸
4 child flows
12 rules
3 source files
Complexity: High
```

#### Decision node

Question/rule node.

```txt
Score >= 700?
editable
```

#### Action node

```txt
Send to Manual Review
```

#### Output node

```txt
Approved
Rejected
Manual Review
```

#### Data node

```txt
creditScore
income
riskScore
```

### Edge design

Edges must be directional.

Use labels:

```txt
Yes
No
score >= 700
risk = HIGH
manual review
```

Use highlighted edge states:

```txt
normal
executed
passed
failed
warning
inactive
```

### Right pane — Inspector / editor

When no node selected:

```txt
Select a node to inspect business logic, source locations, and test coverage.
```

When selected node is editable:

```txt
Business Rule Editor

Rule:
Minimum Credit Score

Parent Flow:
Risk Assessment / Credit Score Evaluation

Business Meaning:
Applicant must meet the minimum credit score threshold.

Technical Expression:
creditScore >= 700

Editable Value:
[680]

Source Locations:
- RiskScoringService.java: line 42
- credit-rules.xml: line 18
- RiskScoringServiceTest.java: line 73

Impact Preview:
✓ Credit Score Evaluation modified
✓ Risk Tier Assignment impacted
✓ Final Decision Routing impacted
✓ 4 tests need rerun

[Preview Impact] [Run Impacted Tests] [Apply Change] [Revert]
```

### Edit behavior

When user enters `680` and clicks `Apply Change`:

- update selected node label from `Score >= 700?` to `Score >= 680?`
- mark node as `modified`
- mark parent flows as `impacted`
- mark related tests as `warning` or `needs rerun`
- update report data
- show success toast:

```txt
Rule updated: creditScore >= 700 → creditScore >= 680
```

### Bottom panel — Visual test runner

Show below graph.

Tabs:

```txt
[All Tests] [Impacted Tests] [Failed Tests] [Regression Tests]
```

Test list:

```txt
PASS  Approve applicant with score 760
PASS  Approve applicant at new threshold 680
FAIL  Reject applicant with fraud flag
WARN  Pricing test needs rerun
```

Each test item has:

- status
- name
- flow covered
- duration
- impacted badge if impacted by edit

### Test interaction

When clicking a test:

1. Highlight test in bottom panel.
2. Show execution trace on graph.
3. Update right pane to test details.

### Graph visual trace behavior

When a test is selected:

```txt
Green line = passed executed path
Red line = failed node / failed path
Yellow line = warning or impacted
Gray line = not part of this test
```

### Test details in right pane

For failed test:

```txt
Test: Reject applicant with fraud flag

Status: Failed

Expected Path:
Application → Risk Assessment → Fraud Check → Manual Review

Actual Path:
Application → Risk Assessment → Fraud Check → Reject

Failure Node:
Fraud Signal Check

Reason:
Fraud rule triggered rejection before manual review condition.

[Step Through] [Show Assertion] [Open Source]
```

### Test controls

Add controls:

```txt
[Play] [Pause] [Next Step] [Previous Step] [Reset Trace]
```

For MVP, the controls can visually step through mock path data.

### Generate report

Clicking `Generate Report` navigates to `/report`.

---

## 10. Page 5 — Visual Report

### Goal

Create a report page that is visual and downloadable.

This page replaces the removed Legacy vs Modern page.

### Top section

```txt
Modernization Report

Project:
legacy-credit-platform

[Download PDF] [Download Markdown] [Download JSON] [Download Graph Image]
```

### Report section A — Executive summary

```txt
The uploaded project contains nested credit decision logic across Java services and XML configuration.
Legacy Logic Studio identified 5 logic domains, 9 nested flows, 38 business rules, and 7 related tests.
```

### Report section B — Visual logic map

Show a visual flowchart card.

Use either React Flow snapshot or Mermaid-style diagram.

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

Also show nested tree:

```txt
Risk Assessment
├── Credit Score Evaluation
├── Debt-to-Income Ratio Check
├── Fraud Signal Check
└── Manual Review Trigger
```

### Report section C — Changed rules

```txt
Changed Rule:
Minimum Credit Score

Before:
creditScore >= 700

After:
creditScore >= 680

Affected Flows:
- Credit Score Evaluation
- Risk Tier Assignment
- Final Decision Routing
```

### Report section D — Test result visual summary

```txt
Test Results

7 total tests
5 passed
1 failed
1 warning
```

Show a mini visual trace:

```txt
Approve applicant at new threshold 680
[Application] → [Risk Assessment] → [Credit Score >= 680] → [Approved]
```

### Report section E — Source impact map

```txt
Source Impact

RiskScoringService.java
└── Minimum Credit Score Rule modified

credit-rules.xml
└── Threshold configuration updated

RiskScoringServiceTest.java
└── Boundary tests regenerated
```

### Report section F — Generated assets

```txt
Generated Assets:
✓ Visual workflow map
✓ Updated business rule model
✓ Modern service template
✓ Unit test scenarios
✓ Test execution traces
✓ Migration notes
```

### Report section G — Download package

Buttons:

```txt
[PDF Report]
[Markdown Report]
[Graph Image]
[JSON Analysis]
[Modernization Package]
```

### Download behavior

For MVP:

- `Download Markdown` should generate a `.md` file from report state.
- `Download JSON` should generate analysis JSON.
- `Download Graph Image` should export or simulate exporting the graph image.
- `Download PDF` can use `window.print()` or generate a simple PDF if easy.
- `Download Modernization Package` can download a mock zip or JSON file.

---

## 11. Mock Data Requirements

Create mock data files under:

```txt
src/data/
  sampleProject.ts
  sampleFlows.ts
  sampleTests.ts
  sampleReport.ts
```

### sampleProject.ts

Include:

```ts
export const sampleProject = {
  name: "legacy-credit-platform",
  uploadedFile: "legacy-credit-platform.zip",
  stats: {
    files: 143,
    javaFiles: 37,
    xmlFiles: 8,
    serviceClasses: 6,
    controllerClasses: 4,
    testFiles: 11,
  },
  sourceFiles: [
    {
      path: "src/main/java/com/acme/credit/RiskScoringService.java",
      language: "java",
      content: "..."
    },
    {
      path: "src/main/resources/credit-rules.xml",
      language: "xml",
      content: "..."
    }
  ]
};
```

### sampleFlows.ts

Use this shape:

```ts
export type LogicFlow = {
  id: string;
  name: string;
  type: "domain" | "workflow" | "subflow" | "rule";
  parentId?: string;
  depth: number;
  sourceFiles: string[];
  complexity: "low" | "medium" | "high";
  summary: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  childFlowIds: string[];
  status: "unchanged" | "modified" | "impacted";
};

export type FlowNode = {
  id: string;
  flowId: string;
  type: "start" | "domain" | "decision" | "action" | "data" | "output";
  label: string;
  businessMeaning?: string;
  technicalExpression?: string;
  sourceLocations?: SourceLocation[];
  childFlowId?: string;
  editable?: boolean;
  status?: "unchanged" | "modified" | "impacted" | "passed" | "failed" | "warning";
};

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
  status?: "normal" | "executed" | "passed" | "failed" | "warning" | "inactive";
};

export type SourceLocation = {
  file: string;
  lineStart: number;
  lineEnd: number;
};
```

Include flows:

```txt
credit-decision-engine
applicant-eligibility
risk-assessment
credit-score-evaluation
debt-ratio-check
fraud-signal-check
pricing-calculation
final-decision-routing
```

### sampleTests.ts

Use this shape:

```ts
export type VisualTest = {
  id: string;
  name: string;
  status: "passed" | "failed" | "warning";
  flowId: string;
  durationMs: number;
  impacted: boolean;
  executedNodeIds: string[];
  executedEdgeIds: string[];
  failedNodeId?: string;
  expectedPath: string[];
  actualPath: string[];
  reason?: string;
};
```

Include tests:

```txt
Approve applicant with score 760
Approve applicant at new threshold 680
Reject applicant with fraud flag
Manual review when score is missing
Debt ratio triggers manual review
Pricing test needs rerun
```

### sampleReport.ts

Use this shape:

```ts
export const sampleReport = {
  projectName: "legacy-credit-platform",
  summary: "...",
  logicDomains: 5,
  nestedFlows: 9,
  businessRules: 38,
  tests: {
    total: 7,
    passed: 5,
    failed: 1,
    warning: 1,
  },
  changedRules: [
    {
      name: "Minimum Credit Score",
      before: "creditScore >= 700",
      after: "creditScore >= 680",
      affectedFlows: [
        "Credit Score Evaluation",
        "Risk Tier Assignment",
        "Final Decision Routing"
      ]
    }
  ]
};
```

---

## 12. Global State

Use Zustand or React Context.

Store:

```ts
type AppState = {
  projectLoaded: boolean;
  analysisComplete: boolean;
  currentFlowId: string;
  selectedNodeId?: string;
  selectedTestId?: string;
  flows: LogicFlow[];
  tests: VisualTest[];
  report: ReportData;
  editedRules: EditedRule[];
};
```

Actions:

```ts
loadSampleProject()
runAnalysis()
openFlow(flowId)
selectNode(nodeId)
editRule(nodeId, newValue)
applyRuleChange()
selectTest(testId)
runTests()
generateReport()
downloadMarkdownReport()
downloadJsonAnalysis()
downloadGraphImage()
```

---

## 13. Components

Create this component structure:

```txt
src/
  App.tsx
  main.tsx
  routes/
    HomePage.tsx
    UploadPage.tsx
    AnalysisPage.tsx
    VisualEditorPage.tsx
    ReportPage.tsx
  components/
    layout/
      AppShell.tsx
      TopNav.tsx
      PageHeader.tsx
      StatusBadge.tsx
    upload/
      UploadDropzone.tsx
      UploadedProjectSummary.tsx
    analysis/
      SummaryCards.tsx
      LogicHierarchyTree.tsx
      DomainDetailsPanel.tsx
      ComplexityCards.tsx
      TestCoverageCard.tsx
    editor/
      VisualEditorLayout.tsx
      RuleTreePane.tsx
      FlowCanvas.tsx
      CustomNodes.tsx
      CustomEdges.tsx
      InspectorPane.tsx
      BusinessRuleEditor.tsx
      TestRunnerPanel.tsx
      TestTraceControls.tsx
    report/
      ReportHeader.tsx
      ExecutiveSummary.tsx
      VisualLogicMap.tsx
      ChangedRulesSummary.tsx
      TestVisualSummary.tsx
      SourceImpactMap.tsx
      ReportDownloads.tsx
  data/
    sampleProject.ts
    sampleFlows.ts
    sampleTests.ts
    sampleReport.ts
  store/
    useAppStore.ts
  utils/
    exportReport.ts
    graphHelpers.ts
```

---

## 14. Implementation Priorities

Build in this order:

### Phase 1 — App shell and routing

- Vite + React + TypeScript
- Tailwind
- React Router
- Top navigation
- Route pages

### Phase 2 — Homepage and Upload

- Homepage with hero and sections
- Upload page with mock upload
- Load sample project

### Phase 3 — Analysis Dashboard

- Summary cards
- Nested hierarchy tree
- Domain details panel
- Open Visual Editor button

### Phase 4 — Visual Editor

- React Flow canvas
- Mock flows
- Custom nodes
- Custom edges
- Breadcrumb
- Left hierarchy pane
- Right inspector

### Phase 5 — Rule Editing

- Click editable node
- Show editor
- Change 700 → 680
- Update node label/status
- Mark impacted flows/tests

### Phase 6 — Visual Test Runner

- Bottom panel
- Test list
- Click test
- Highlight graph path
- Right pane test detail
- Step controls

### Phase 7 — Visual Report

- Executive summary
- Visual logic map
- Changed rules
- Test summary
- Source impact
- Download buttons

### Phase 8 — Polish

- Animations
- Toasts
- Responsive sizing
- Better empty states
- Demo-ready visual polish

---

## 15. MVP Acceptance Criteria

The frontend is complete when:

1. User can start from homepage.
2. User can load sample project from upload page.
3. Analysis dashboard shows nested business logic.
4. Visual editor shows a hierarchical 2D graph.
5. User can step into Risk Assessment and Credit Score Evaluation.
6. User can click editable node.
7. Right pane allows editing `700` to `680`.
8. Graph updates node label to `Score >= 680?`.
9. Related flows/tests show impacted state.
10. Test runner shows passed/failed/warning tests.
11. Clicking a test highlights directed graph path.
12. Failed test shows expected vs actual path.
13. Report page shows visual logic map and nested hierarchy.
14. Report page shows changed rule and test summary.
15. User can download Markdown and JSON report.
16. App is polished enough for a 3-minute hackathon demo.

---

## 16. Demo Script Alignment

The UI should support this 3-minute demo:

```txt
0:00–0:20
Homepage: explain problem and product.

0:20–0:45
Upload sample legacy project.

0:45–1:10
Show analysis dashboard and nested rule hierarchy.

1:10–1:45
Open visual editor. Step into Risk Assessment and Credit Score Evaluation.

1:45–2:10
Edit Minimum Credit Score from 700 to 680.

2:10–2:35
Run visual tests. Click failed/passed test and show colored execution path.

2:35–3:00
Open visual report. Show flowchart, changed rule, test summary, and download buttons.
```

---

## 17. Important Product Messaging

Use this exact wording in UI when needed:

```txt
IBM Bob was used as the AI development partner to build this prototype faster.
The product itself runs its own modernization workflow and can use AI models for summarization, explanation, and report generation.
```

Do not say:

```txt
Analyze with Bob
```

Use:

```txt
Run Modernization Scan
```

Do not imply a hidden Bob runtime API.

---

## 18. Design Quality Bar

The app must look like a real product.

Avoid:

- plain HTML
- weak spacing
- tiny unreadable graph labels
- too much text in nodes
- messy edge crossings
- unclear status colors
- pages that feel disconnected

Prefer:

- clean SaaS dashboard
- strong visual hierarchy
- high contrast
- readable node labels
- consistent badges
- clear graph controls
- smooth step-by-step demo path

---

## 19. Extra Polish If Time

Add these only after MVP works:

- dark/light toggle
- graph minimap
- graph search
- filter: show only modified nodes
- filter: show only failed test path
- export graph image
- report preview modal
- animated test execution
- source snippet preview in right pane
- mock modernized code card inside report

---

## 20. Final Summary For Cursor

Build a polished React frontend for **Legacy Logic Studio**.

It should have five pages:

```txt
Home
Upload
Analysis
Visual Editor
Report
```

The most important page is **Visual Editor**.

The Visual Editor layout must be:

```txt
Left = hierarchical rule tree
Center = nested 2D graph
Right = inspector / editable rule panel
Bottom = visual test runner
```

The product must show complex nested business logic, not a simple flat flowchart.

The report page must include visual diagrams, not just text.

Use mock data first and make the demo flow work end-to-end.
