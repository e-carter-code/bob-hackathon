# Legacy Logic Studio

**Legacy Logic Studio — Business Logic Time Machine** is a web application for exploring, analyzing, and modernizing legacy business logic. The UI walks through discovery, rule editing, modernization, and reporting, with the loan-approval COBOL system and its Java 17 + Maven counterpart bundled for a consistent end-to-end experience.

## Repository layout

| Path | Role |
|------|------|
| `frontend/` | React + TypeScript + Vite SPA: workflow, COBOL/Java viewers, editor, modernization, PDF report |
| `backend/` | FastAPI service: health checks, versioned JSON APIs for the SPA, **IBM watsonx.ai** integration for AI-assisted modernization |
| `loan-approvals-COBOL/` | Legacy COBOL sources, copybooks, and batch inputs used by the UI and parity tests |
| `loan-approval-service/` | Modern Java 17 + Maven service aligned with the COBOL rules (build with `mvn verify`) |

## Frontend

The SPA is built with **Vite** and **React**. It provides:

- **Guided workflow** — upload and project context, dependency and logic analysis, rule editing with before/after snapshots, modernization preview, and a structured report with optional PDF export.
- **Bundled legacy and modern sources** — COBOL programs and copybooks from `loan-approvals-COBOL/`, and Java sources from `loan-approval-service/`, are exposed to the client as static modules so navigation, search, and side-by-side comparison work without a separate asset server.
- **Client-side session state** — uploads and in-progress edits are held in the browser (e.g. session storage) so refreshes and multi-step flows stay coherent.

Run locally:

```bash
cd frontend
npm install
npm run dev
```

The dev server defaults to `http://localhost:5173` (Vite). Point the SPA at the backend base URL via environment variable when you wire API calls (e.g. `VITE_API_BASE_URL=http://127.0.0.1:8000`).

## Backend

**FastAPI** backs the SPA with CORS enabled for local Vite origins. The service is structured so the frontend can call stable, versioned endpoints and grow into full modernization orchestration.

### Directory structure

```
backend/
├── requirements.txt
└── app/
    ├── main.py                 # FastAPI app, CORS, router mount
    ├── api/
    │   └── routes.py           # HTTP routes under /api/v1
    ├── schemas/
    │   └── frontend_contracts.py   # Request/response models shared with the SPA
    └── services/
        └── watsonx_modernization.py  # IBM watsonx.ai (Granite / code models) for legacy → modern suggestions
```

### IBM watsonx.ai

Modernization assistance uses **IBM watsonx.ai** as the model layer: foundation models (for example Granite code-oriented models) interpret COBOL fragments and project context, then produce suggested modern code, explanations, or refactor hints. Configure credentials and project settings via environment variables (see `backend/app/services/watsonx_modernization.py` and [watsonx.ai documentation](https://www.ibm.com/products/watsonx-ai)). Until credentials are set, the API returns a clear configuration response so the UI can still be developed and tested.

### API surface (v1)

| Method | Path | Purpose |
|--------|------|--------|
| `GET` | `/health` | Liveness |
| `GET` | `/` | Service metadata |
| `POST` | `/api/v1/modernize/suggest` | Body: COBOL snippet + options → suggested modern code / stub when watsonx is not configured |

Run locally:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open `http://127.0.0.1:8000/docs` for interactive OpenAPI.

## Legacy COBOL batch (optional)

From `loan-approvals-COBOL/`, run the GnuCOBOL batch driver if you want to regenerate golden outputs or validate parity outside the UI.

## License

Use and modify under the license terms that apply to your distribution of this repository.
