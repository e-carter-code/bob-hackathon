# bob-hackathon

## Projects

| Directory | Role |
|-----------|------|
| `loan-approvals-COBOL/` | Sample legacy COBOL batch (GNUCOBOL) — source of truth for analysis and the visual editor. |
| `loan-approval-service/` | **Java port of `loan-approvals-COBOL`** (LNMAIN / LNRULES / LNRATE + copybooks): same batch rules, ratios, and APR logic; golden-tested against `loan-approvals-COBOL/data/expected-output.txt`. |

To refresh `loan-approval-service/` from the frontend demo data:

```bash
cd frontend && npm run materialize-loan-service
```