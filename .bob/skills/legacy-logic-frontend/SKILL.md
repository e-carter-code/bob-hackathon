---
name: legacy-logic-frontend
description: Build the Legacy Logic Studio frontend using the approved product rules, UI flow, visual style, and global Git workflow
---

# Legacy Logic Frontend Skill

You are helping build the frontend for **Legacy Logic Studio**.

This skill is the source-of-truth workflow for implementing the frontend. Use it whenever the user asks for frontend work, UI implementation, visual editor work, report work, styling, or demo polish.

---

## 1. Supporting Files To Read First

Before coding, read these supporting files in this skill directory:

- `frontend.md`
- `bob-rules.md`
- `ui-style.md`

Also obey the global Git rules:

- `.bob/rules/git-workflow-rules.md`

If the same files also exist under `docs/`, treat the `docs/` versions as human-readable copies. The skill-local files are the immediate skill context.

---

## 2. Critical Product Rule

IBM Bob is **not** a runtime API inside this product.

Do not implement hidden Bob API calls.
Do not create backend code that calls Bob.
Do not create UI labels such as:

```txt
Analyze with Bob
```

Use this instead:

```txt
Run Modernization Scan
```

Correct product wording:

```txt
Built with IBM Bob as the AI development partner.
```

Bob helps build the product. The product itself runs its own modernization workflow and can later use watsonx.ai or another approved model for runtime AI tasks.

---

## 3. Product Summary

Legacy Logic Studio is a web product that lets users:

1. Upload a full legacy software project.
2. Run a modernization scan.
3. See nested business-logic hierarchy.
4. Explore logic as a hierarchical 2D visual graph.
5. Step into parent/child flows.
6. Edit business rules visually.
7. Run visual tests.
8. See colored execution paths on the graph.
9. Generate a visual modernization report.
10. Download Markdown, JSON, graph image, or report package.

This is a frontend-first hackathon demo. Use realistic mock data first.

---

## 4. Required Pages

Build only these pages:

1. Home
2. Upload
3. Analysis
4. Visual Editor
5. Report

Do **not** create a separate Workspace page.
Do **not** create a separate Legacy vs Modern page.

If code preview is needed, place it inside the Analysis page, Visual Editor side panel, or Report page.

---

## 5. Main App Flow

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

---

## 6. Required Visual Editor Layout

The Visual Editor is the most important screen.

It must use this structure:

```txt
Top toolbar:
- breadcrumb
- Back
- Expand All
- Collapse All
- Fit View
- Run Tests
- Generate Report

Left pane:
- hierarchical rule tree

Center pane:
- nested 2D graph canvas

Right pane:
- inspector / editable rule panel

Bottom pane:
- visual test runner
```

Layout rule:

```txt
Left = hierarchy / rules
Center = graph
Right = inspector / editor
Bottom = visual test runner
```

---

## 7. Visual Style Direction

Use the style defined in `ui-style.md`.

Short version:

```txt
Dark IBM Enterprise Command Center
```

The UI should feel like:

- IBM Carbon-style enterprise clarity
- VS Code-style technical workspace
- Linear-style polished SaaS interface
- MATLAB/Simulink-style visual flow exploration
- AI command center for legacy modernization

Do not make it playful, cartoonish, or like a basic CRUD app.

Use mostly dark neutral colors, then use colors only for meaning:

```txt
Blue = structure / domain / primary action
Purple = AI-generated / modified / modernization artifact
Green = passed test / successful path
Red = failed test / rejected path
Yellow = impacted / warning / needs rerun
Orange = manual review / risk
Gray = inactive / not executed
```

---

## 8. Graph Requirements

The graph must support complex nested business logic.

Do not build only a simple flat flowchart.

Support three levels:

```txt
Level 1: System-level workflow
Level 2: Domain-level workflow
Level 3: Rule-level workflow
```

Example hierarchy:

```txt
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

Required graph behavior:

- single click node → select and inspect
- double click parent node → step into child flow
- expand/collapse parent flows
- breadcrumb navigation
- selected node highlight
- readable node labels
- directional edges
- edge labels for conditions
- visual test path highlighting

---

## 9. Rule Editing Requirements

When user clicks an editable node, show this in the right pane:

- rule name
- parent flow
- business meaning
- technical expression
- editable value
- source locations
- impact preview
- buttons:
  - Preview Impact
  - Run Impacted Tests
  - Apply Change
  - Revert

Demo editable rule:

```txt
Rule:
Minimum Credit Score

Before:
creditScore >= 700

After:
creditScore >= 680
```

When applied:

- update graph node label from `Score >= 700?` to `Score >= 680?`
- mark node as `modified`
- mark parent flows as `impacted`
- mark related tests as `warning` / `needs rerun`
- update report state
- show success toast

---

## 10. Visual Test Runner Requirements

The bottom panel must include tabs:

- All Tests
- Impacted Tests
- Failed Tests
- Regression Tests

Each test row must show:

- status
- test name
- flow covered
- duration
- impacted badge if relevant

When user clicks a test:

- select the test
- highlight execution path on graph
- update right pane to test details

Graph path colors:

```txt
Green = passed executed path
Red = failed node/path
Yellow = warning or impacted path
Gray = not part of selected test
```

Right pane test details must include:

- expected path
- actual path
- failure node
- reason
- controls:
  - Play
  - Pause
  - Next Step
  - Previous Step
  - Reset Trace

Use mock data first.

---

## 11. Report Page Requirements

The Report page must be visual, not just text.

It must include:

1. Executive summary
2. Visual logic map / flowchart
3. Nested rule hierarchy
4. Changed rule summary
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

MVP behavior:

- Markdown download must work
- JSON download must work
- PDF can use `window.print()`
- Graph image can be mocked or exported if easy
- Modernization package can be a mock JSON/ZIP placeholder if needed

---

## 12. Tech Stack

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
- Monaco Editor only if code preview is needed

Do not add unnecessary libraries.

---

## 13. Mock Data First

Use mock data first.

Create data files under:

```txt
src/data/
  sampleProject.ts
  sampleFlows.ts
  sampleTests.ts
  sampleReport.ts
```

The frontend must work end-to-end without a backend.

---

## 14. Implementation Order

Implement one phase at a time.

### Phase 1 — App Shell

- Vite React TypeScript app
- Tailwind setup
- React Router
- top navigation
- empty pages
- shared layout

### Phase 2 — Home + Upload

- polished homepage
- upload page
- sample project loading
- mock upload summary
- navigate to Analysis

### Phase 3 — Analysis Dashboard

- summary cards
- nested hierarchy
- selected domain detail panel
- complexity cards
- test coverage card
- Open Visual Editor button

### Phase 4 — Visual Editor Shell

- top toolbar
- left rule tree
- center React Flow canvas
- right inspector
- bottom test runner shell

### Phase 5 — Nested Graph

- Level 1 system flow
- Risk Assessment child flow
- Credit Score Evaluation child flow
- parent node stepping
- breadcrumbs
- minimap/controls

### Phase 6 — Rule Editing

- editable node
- right pane form
- edit 700 → 680
- update graph label/status
- mark impacted tests/flows

### Phase 7 — Visual Tests

- test runner rows
- click test
- highlight graph path
- expected vs actual details
- step controls

### Phase 8 — Visual Report

- visual logic map
- nested hierarchy
- changed rule summary
- test summary
- source impact map
- downloads

### Phase 9 — Polish

- consistent style
- better spacing
- readable labels
- no broken routes
- no Bob runtime wording
- demo-ready flow

---

## 15. Global Git Workflow

Git workflow is controlled by the global Bob rules in:

```txt
.bob/rules/git-workflow-rules.md
```

Before editing files, follow those rules.

Summary:

1. Start from `staging`.
2. Pull latest `staging`.
3. Create a professional task branch.
4. Make changes only on the task branch.
5. Use Conventional Commit messages.
6. Push the branch.
7. Create a PR into `staging`.
8. Do not commit directly to `main`.
9. Do not commit directly to `staging`.
10. Do not open feature PRs directly into `main`.

Branch examples:

```txt
chore/setup-frontend-shell
feat/add-analysis-dashboard
feat/add-visual-editor
feat/add-rule-editor
feat/add-visual-test-runner
feat/add-visual-report
style/polish-dark-command-center
fix/graph-node-selection
```

Commit examples:

```txt
chore(setup): add frontend app shell
feat(analysis): add nested logic dashboard
feat(editor): add visual rule editor
feat(tests): add visual test runner
feat(report): add visual modernization report
style(editor): polish graph node colors
fix(editor): correct selected node state
```

At the end of each task, report:

```txt
Branch:
Commit:
PR:
Commands run:
Status:
```

---

## 16. Safety Rules

Never commit:

- secrets
- API keys
- passwords
- `.env`
- IBM credentials
- cloud credentials
- node_modules
- local machine paths

Before committing, check:

```bash
git status
git diff
git diff --staged
```

If secrets are detected, stop and warn the user.

---

## 17. Bob Behavior Rules

When using this skill:

1. Read supporting files first.
2. Summarize understanding before coding if this is the first task.
3. Create a branch before editing.
4. Implement one phase or feature at a time.
5. Avoid unrelated changes.
6. Use mock data first.
7. Keep code modular.
8. Keep UI polished and readable.
9. Follow `ui-style.md`.
10. Follow `.bob/rules/git-workflow-rules.md`.
11. Do not invent runtime Bob integration.
12. Explain changed files and testing after each task.

---

## 18. First Prompt To Use With This Skill

Recommended first prompt:

```txt
Use the legacy-logic-frontend skill.

Read:
- .bob/skills/legacy-logic-frontend/SKILL.md
- .bob/skills/legacy-logic-frontend/frontend.md
- .bob/skills/legacy-logic-frontend/bob-rules.md
- .bob/skills/legacy-logic-frontend/ui-style.md
- .bob/rules/git-workflow-rules.md

Do not write code yet.

Return:
1. product summary
2. required pages
3. visual editor layout
4. visual style direction
5. Git workflow rules
6. implementation phases
7. any missing clarification before coding
```

---

## 19. Standard Implementation Prompt

Use this format for every task:

```txt
Use the legacy-logic-frontend skill.

Before making changes, follow the global Git workflow rules.

Create a new branch from staging.

Task:
<describe the task>

After implementation:
1. run verification commands
2. commit with a Conventional Commit message
3. push the branch
4. create a PR into staging
5. summarize branch, commit, PR, commands run, and status
```

---

## 20. Final Acceptance Criteria

The frontend is complete when:

1. Homepage clearly explains the product.
2. Upload page loads sample project.
3. Analysis dashboard shows nested business logic hierarchy.
4. Visual Editor shows a nested 2D graph.
5. User can step into child flows.
6. User can click editable rule.
7. User can edit 700 to 680.
8. Graph updates to 680.
9. Related flows/tests show impacted state.
10. Test runner shows pass/fail/warning.
11. Clicking a test highlights graph execution path.
12. Right pane shows expected vs actual path.
13. Report page shows visual flowchart/map.
14. Report page shows changed rules and test summary.
15. Markdown and JSON downloads work.
16. App has polished dark enterprise style.
17. No page says “Analyze with Bob.”
18. No runtime Bob API is implemented.
19. App is ready for a 3-minute hackathon demo.
