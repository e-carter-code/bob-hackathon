/** Report + PDF copy aligned with repo `loan-approvals-COBOL` and `loan-approval-service` (not the old demo credit package). */

export const REPORT_PROJECT = {
  legacy: 'loan-approvals-COBOL',
  modern: 'loan-approval-service (Java 17, Maven)',
  generatedAt: () =>
    new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date()),
};

export const productTagline =
  'We map real COBOL batch flow (LNMAIN → LNRULES → LNRATE) and copybooks into a behavioral Java port, with analysis excerpts and golden tests tied to expected-output.txt.';

/** Section 4 heading (web + PDF) — not a fictional “DTI 43→45” edit; real ladder trace */
export const representativeRuleSectionTitle = 'Representative rule trace (legacy → modern)';

/** Section 1 — Executive summary */
export const executiveSummaryItems: { label: string; value: string }[] = [
  {
    label: 'Legacy project analyzed',
    value: 'loan-approvals-COBOL — LNMAIN.cbl, LNRULES.cbl, LNRATE.cbl, copy/APPLICANT.cpy, copy/DECISION.cpy, data/applicants.dat',
  },
  {
    label: 'Modernization result',
    value: 'loan-approval-service — LoanBatchProcessor / LnRulesEngine / LnRateEngine, 64-char ApplicantLineParser, GoldenCobolParityTest',
  },
  {
    label: 'Analysis alignment',
    value:
      'Visual editor and Analysis page excerpts use the same program names and paragraphs as the repo (e.g. 3000-HARD-DECLINE-RULES, 2000-CALCULATE-RATIOS).',
  },
  {
    label: 'Verification',
    value:
      'Golden tests assert each applicant id matches COBOL expected-output.txt for decision code, DTI, and APR; batch counts 2 approved / 1 review / 5 declined on the sample file.',
  },
  {
    label: 'Modernization confidence',
    value: 'High — parity is enforced in code (JUnit) against the bundled legacy expected file, not hand-waved.',
  },
];

/** Section 3 — Visual business logic summary (matches analysis discovery / batch shape) */
export const businessLogicTreeLines = [
  'loan-approvals-COBOL (analysis + visual map)',
  '├── src/LNMAIN.cbl',
  '│   └── Read applicants.dat → CALL LNRULES → CALL LNRATE if approved',
  '├── src/LNRULES.cbl',
  '│   ├── 2000-CALCULATE-RATIOS (DTI, LTI, down %)',
  '│   ├── 3000-HARD-DECLINE-RULES (580 / 43% / 5.0x / emp / BK / delinq)',
  '│   ├── 4000-DOWN-PAYMENT-RULE · 5000-RISK-GRADE-RULE · 6000-FINAL-DECISION',
  '├── src/LNRATE.cbl',
  '│   └── Base APR by product + risk add-on + DTI > 38% bump',
  '├── copy/APPLICANT.cpy',
  '└── copy/DECISION.cpy',
];

/** Section 4 — Real COBOL / Java excerpt (same thresholds as repo) */
export const changedRuleDetail = {
  ruleName: 'Hard-decline ladder — DTI above 43%',
  legacySource: 'src/LNRULES.cbl → 3000-HARD-DECLINE-RULES',
  beforeCobol: `       3000-HARD-DECLINE-RULES.
           IF APPL-CREDIT-SCORE < 580
               PERFORM 9100-DECLINE-CREDIT
           ELSE
               IF CALC-DTI-PCT > 43.00
                   PERFORM 9200-DECLINE-DTI
               ELSE
                   IF CALC-LTI-RATIO > 5.00
                       PERFORM 9300-DECLINE-LTI
                   ELSE
                       IF APPL-EMP-MONTHS < 24
                           PERFORM 9400-DECLINE-EMPLOYMENT`,
  visualEdit:
    'Prescreen / analysis leaves reference these same lines (e.g. rule-dti, rule-credit); thresholds match repo COBOL.',
  modernJava: `  private static void paragraph3000HardDeclineRules(
      ApplicantRecord a, ApplicantCalc c, DecisionRecord d, RuleFlags f) {
    if (a.applCreditScore() < 580) {
      paragraph9100DeclineCredit(d, f);
    } else if (c.getCalcDtiPct().compareTo(CobolDecimal.bd("43.00")) > 0) {
      paragraph9200DeclineDti(d, f);
    } else if (c.getCalcLtiRatio().compareTo(CobolDecimal.bd("5.00")) > 0) {
      paragraph9300DeclineLti(d, f);
    } else if (a.applEmpMonths() < 24) {
      paragraph9400DeclineEmployment(d, f);
    }`,
};

/** Section 5 — Project tree (matches downloadable loan-approval-service layout) */
export const modernizedProjectTreeLines = [
  'loan-approval-service',
  '├── README.md',
  '├── pom.xml',
  '└── src',
  '    ├── main/java/com/legacylogic/loan',
  '    │   ├── batch/',
  '    │   │   ├── BatchRowResult.java',
  '    │   │   ├── LoanBatchProcessor.java',
  '    │   │   └── LoanBatchRunner.java',
  '    │   ├── cobol/CobolDecimal.java',
  '    │   ├── model/',
  '    │   │   ├── ApplicantCalc.java',
  '    │   │   ├── ApplicantRecord.java',
  '    │   │   ├── DecisionRecord.java',
  '    │   │   └── RuleFlags.java',
  '    │   ├── parser/ApplicantLineParser.java',
  '    │   ├── rate/LnRateEngine.java',
  '    │   └── rules/LnRulesEngine.java, RatioCalculator.java',
  '    └── test/java/com/legacylogic/loan/GoldenCobolParityTest.java',
];

export const downloadablePackageLabel = 'Downloadable package: loan-approval-service.zip';

/** Section 6 — Traceability */
export const traceabilityHeaders = [
  'Legacy asset',
  'Business rule',
  'Analysis / visual',
  'Modern artifact',
  'Verification',
] as const;

export const traceabilityRows: [string, string, string, string, string][] = [
  [
    'LNMAIN.cbl',
    'Batch read / CALL LNRULES / LNRATE',
    'lnmain-call, lnmain-read leaves',
    'LoanBatchProcessor.java, LoanBatchRunner.java',
    'Golden batch counts',
  ],
  [
    'LNRULES.cbl',
    '2000 ratios; 3000 hard declines; 4000–6000',
    'calc-dti, rule-credit, dp-mt, rg-a leaves',
    'LnRulesEngine.java, RatioCalculator.java',
    'eachApplicantMatchesExpectedOutput',
  ],
  [
    'LNRATE.cbl',
    'Base rate + risk + DTI bump',
    'Analysis rate path',
    'LnRateEngine.java',
    'APR vs expected-output',
  ],
  [
    'APPLICANT.cpy',
    'Record + calc working storage',
    'Applicant / ratio nodes',
    'ApplicantRecord.java, ApplicantCalc.java, ApplicantLineParser.java',
    '64-char line layout',
  ],
  [
    'DECISION.cpy',
    'Decision + rule flags',
    'Decision outcome nodes',
    'DecisionRecord.java, RuleFlags.java',
    'Decision codes + reasons',
  ],
];

export const finalModernizationStatement =
  'This report describes a parity-first port: legacy paths and analysis snippets line up with the real COBOL tree, and the Java module is what you download and test against expected-output.txt.';

/* ---------- PDF helpers ---------- */

export const ruleChangeCallout = {
  title: 'Representative rule (summary)',
  legacy: 'IF CALC-DTI-PCT > 43.00 (LNRULES 3000)',
  modern: 'c.getCalcDtiPct().compareTo(CobolDecimal.bd("43.00")) > 0',
  files: 'src/LNRULES.cbl -> LnRulesEngine.paragraph3000HardDeclineRules',
};
