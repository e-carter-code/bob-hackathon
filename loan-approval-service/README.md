# loan-approval-service

Java **1:1 behavioral port** of the hackathon sample **`loan-approvals-COBOL`** batch:

| COBOL | Java |
|-------|------|
| `LNMAIN.cbl` (read file → call rules → rate if approved → counts) | `LoanBatchProcessor`, `LoanBatchRunner` |
| `LNRULES.cbl` (ratios, hard decline ladder, down payment, risk grade, final decision) | `RatioCalculator`, `LnRulesEngine` |
| `LNRATE.cbl` (base APR + risk addon + DTI bump) | `LnRateEngine` |
| `copy/APPLICANT.cpy`, `copy/DECISION.cpy` | `ApplicantRecord`, `ApplicantCalc`, `DecisionRecord`, `RuleFlags` |
| 64-char `applicants.dat` lines | `ApplicantLineParser` |

Golden tests in `GoldenCobolParityTest` assert the same **decision, DTI, APR, and batch totals** as `loan-approvals-COBOL/data/expected-output.txt` for the bundled `applicants.dat`.

## Build & test

Requires JDK 17+ and Maven on `PATH`:

```bash
cd loan-approval-service
mvn test
```

## Run batch (console)

From this directory (so the default path resolves):

```bash
mvn -q exec:java -Dexec.mainClass=com.legacylogic.loan.batch.LoanBatchRunner -Dexec.args="../loan-approvals-COBOL/data/applicants.dat"
```

Or compile and:

```bash
java com.legacylogic.loan.batch.LoanBatchRunner ../loan-approvals-COBOL/data/applicants.dat
```

## Frontend Modernization page

The app’s Modernization workspace and **Download modernized project** zip read this directory via Vite `?raw` imports in `frontend/src/data/modernizationRealProjectData.ts`. After editing Java or COBOL here, reload the dev server so the bundle picks up changes.

`npm run materialize-loan-service` (from `frontend/`) only verifies that this tree exists and counts files.
