# Backend Implementation Context

## Project

Project name: **Legacy Logic Studio / Business Logic Time Machine**

Hackathon goal: Build a demo-ready modernization tool that helps users understand, edit, and report on legacy business logic.

The frontend already has a working demo flow. The backend should support that existing flow with a minimal, stable API.

---

## Current Frontend Flow

The current frontend flow is:

```text
Home -> Upload -> Analysis -> Editor -> Report
```

Current frontend status:

- React/Vite frontend under `frontend/`
- Report page is already implemented
- Mock report data exists in `frontend/src/data/reportData.ts`
- Report UI exists in `frontend/src/pages/ReportPage.tsx`
- Editor flow supports changing a credit score rule from `700` to `680`
- The backend should match and support the frontend, not redesign it

---

## Backend Goal

Build a minimal FastAPI backend that supports the existing frontend demo.

The backend should provide:

1. A health check endpoint
2. A sample project/session creation endpoint
3. A project analysis endpoint
4. A rules endpoint
5. A rule update endpoint
6. A report endpoint

The backend should be demo-stable and deterministic.

Do **not** add a real database yet.

Use JSON file storage under:

```text
backend/data/sessions/
```

---

## Recommended Backend Stack

Use:

```text
FastAPI
Pydantic
Uvicorn
JSON file storage
```

Do not add:

```text
Postgres
Docker
Celery
Redis
Authentication
Complex background workers
```

unless explicitly requested later.

---

## Backend Folder Structure

Create or use this structure:

```text
backend/
  requirements.txt
  app/
    main.py
    models.py
    storage.py
    sample_data.py
    report_generator.py
  data/
    sessions/
```

Keep it simple. Do not over-engineer.

---

## Required API Endpoints

### 1. Health Check

```http
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

---

### 2. Create Sample Project Session

```http
POST /api/projects/sample
```

Purpose:

Create a new demo session for the sample legacy credit decision project.

Expected response:

```json
{
  "session_id": "demo-session-id",
  "project_name": "Credit Score Evaluation",
  "status": "created"
}
```

---

### 3. Analyze Project

```http
POST /api/projects/{session_id}/analyze
```

Purpose:

Return deterministic sample analysis data for the demo.

Expected response should include:

- session id
- project name
- domains
- rules
- source files
- complexity indicators

Example shape:

```json
{
  "session_id": "demo-session-id",
  "project_name": "Credit Score Evaluation",
  "status": "analyzed",
  "domains": [
    {
      "id": "credit-risk",
      "name": "Credit Risk",
      "complexity": "High",
      "rule_count": 4,
      "rules": [
        {
          "id": "credit-score-threshold",
          "name": "Minimum Credit Score",
          "condition": "score >= 700",
          "source_file": "credit_decision.py",
          "line": 42,
          "editable": true
        }
      ]
    }
  ]
}
```

---

### 4. Get Rules

```http
GET /api/projects/{session_id}/rules
```

Purpose:

Return editable business rules for the Editor page.

Expected response:

```json
[
  {
    "id": "credit-score-threshold",
    "name": "Minimum Credit Score",
    "description": "Applicant must have credit score greater than or equal to 700.",
    "operator": ">=",
    "current_value": 700,
    "editable": true,
    "source_file": "credit_decision.py",
    "domain": "Credit Risk"
  }
]
```

---

### 5. Update Rule

```http
PATCH /api/projects/{session_id}/rules/{rule_id}
```

Request body:

```json
{
  "new_value": 680
}
```

Purpose:

Update the selected business rule and store the change in the session JSON.

Expected response:

```json
{
  "rule_id": "credit-score-threshold",
  "name": "Minimum Credit Score",
  "old_value": 700,
  "new_value": 680,
  "status": "modified",
  "before": "score >= 700",
  "after": "score >= 680",
  "impact": {
    "affected_flows": ["Credit Score Evaluation"],
    "estimated_risk": "Medium",
    "tests_to_run": ["test_credit_score_threshold"]
  }
}
```

---

### 6. Generate Report

```http
GET /api/projects/{session_id}/report
```

Purpose:

Generate report data from the current session state.

Expected report should support the existing Report page and include:

- executive summary
- visual logic map/domain data
- changed rules
- test results
- source impact analysis
- recommendations

Example shape:

```json
{
  "executive_summary": {
    "files_scanned": 12,
    "domains": 3,
    "rules_detected": 18,
    "rules_modified": 1
  },
  "changed_rules": [
    {
      "id": "credit-score-threshold",
      "name": "Minimum Credit Score",
      "before": "score >= 700",
      "after": "score >= 680",
      "source_file": "credit_decision.py",
      "impact": "More applicants may qualify under the updated threshold."
    }
  ],
  "test_results": {
    "total": 8,
    "passing": 7,
    "warning": 1,
    "failing": 0
  }
}
```

---

## CORS Requirements

Allow the Vite frontend origins:

```text
http://localhost:5173
http://localhost:5174
http://127.0.0.1:5173
http://127.0.0.1:5174
```

---

## Implementation Rules for Bob

Follow these rules carefully:

- Read this file first.
- Do not scan the whole repo unless explicitly asked.
- Do not redesign the frontend.
- Do not rewrite unrelated files.
- Do not add database or Docker.
- Keep the backend small and hackathon-demo-focused.
- Prefer deterministic sample data over AI calls for the live demo.
- Use simple JSON file storage.
- Make one small step at a time.
- After coding, provide only:
  - changed files
  - run commands
  - short summary, max 3 bullets

---

## Demo Strategy

The live demo should be stable and repeatable.

Recommended behavior:

```text
Frontend selects sample project
Backend creates session
Backend returns predefined analysis
User edits credit score rule 700 -> 680
Backend stores the edit
Backend generates report from stored session state
```

This is stronger than relying on unpredictable AI output during the live demo.

---

## Presentation Language

You can describe the backend like this:

> The backend uses a deterministic analysis pipeline for the hackathon demo so the flow is stable and repeatable. The architecture is designed so Bob or an LLM-powered extraction step can later replace the sample analyzer, while the frontend and report workflow stay the same.

---

## Low Bobcoin Prompt Pattern

Use small prompts like this:

```text
Read backend.md only.

Task:
Create minimal FastAPI backend skeleton.

Add:
- backend/requirements.txt
- backend/app/main.py
- GET /health
- CORS for Vite frontend

Rules:
- Do not modify frontend.
- Do not add database.
- Keep code minimal.
- Answer only with changed files and run commands.
```

Then continue one step at a time:

```text
Read backend.md only. Add JSON session storage helper. No frontend changes.
```

```text
Read backend.md only. Add POST /api/projects/sample using JSON storage. No frontend changes.
```

```text
Read backend.md only. Add analyze endpoint using deterministic sample data. No frontend changes.
```

```text
Read backend.md only. Add GET and PATCH rules endpoints. No frontend changes.
```

```text
Read backend.md only. Add report endpoint generated from session state. No frontend changes.
```

---

## Backend Build Order

Use this order:

1. FastAPI skeleton and `/health`
2. JSON storage helper
3. Sample project session endpoint
4. Analyze endpoint
5. Rules GET/PATCH endpoints
6. Report endpoint
7. Frontend API integration

Do not skip ahead unless the previous step works.
