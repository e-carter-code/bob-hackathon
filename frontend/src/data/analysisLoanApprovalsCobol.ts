/**
 * Analysis dashboard facts for the repo sample **loan-approvals-COBOL/**
 * (README + src/LNMAIN.cbl, LNRULES.cbl, LNRATE.cbl, copybooks, data).
 */

export interface AnalysisLogicNode {
  id: string;
  name: string;
  children?: AnalysisLogicNode[];
}

export interface AnalysisDomainDetails {
  name: string;
  /** Short lines for the details panel (maps hierarchy domain → COBOL). */
  technicalTraceLines?: string[];
  complexity: 'High' | 'Medium' | 'Low';
  nestedDepth: number;
  /** Count of README “business rules” attributed to this domain (all domains sum to 8). */
  rulesFound: number;
  editableRules: number;
  sourceFiles: string[];
}

/**
 * Hierarchy mirrors LNRULES PERFORM chain + LNMAIN batch + LNRATE pricing
 * (see README mermaid and paragraph names in .cbl sources).
 */
export const LOAN_APPROVALS_HIERARCHY_BASE: AnalysisLogicNode = {
  id: 'root',
  name: 'loan-approvals-COBOL',
  children: [
    {
      id: 'batch-io',
      name: 'Batch intake & reporting',
      children: [
        { id: 'lnmain-open', name: 'Open and close applicant file' },
        { id: 'lnmain-read', name: 'Read each application record' },
        { id: 'lnmain-call', name: 'Run rules, then rate if approved' },
        { id: 'lnmain-print', name: 'Print each decision and batch totals' },
      ],
    },
    {
      id: 'eligibility',
      name: 'Capacity & prescreen metrics',
      children: [
        { id: 'calc-income', name: 'Estimate monthly income' },
        { id: 'calc-dti', name: 'Debt-to-income check' },
        { id: 'calc-lti', name: 'Loan size vs annual income' },
        { id: 'calc-down', name: 'Down payment vs loan amount' },
      ],
    },
    {
      id: 'hard-decline',
      name: 'Hard prescreen rules',
      children: [
        { id: 'rule-credit', name: 'Minimum credit score' },
        { id: 'rule-dti', name: 'Maximum debt-to-income' },
        { id: 'rule-lti', name: 'Loan cannot exceed income multiple' },
        { id: 'rule-emp', name: 'Minimum employment history' },
        { id: 'rule-bk', name: 'Recent bankruptcy window' },
        { id: 'rule-del', name: 'Delinquency count limit' },
      ],
    },
    {
      id: 'down-payment',
      name: 'Down payment by loan type',
      children: [
        { id: 'dp-mt', name: 'Mortgage: very low down payment declines; borderline goes to review' },
        { id: 'dp-au', name: 'Auto: low down payment may trigger review' },
        { id: 'dp-pl', name: 'Personal loan: down payment as compensating factor' },
      ],
    },
    {
      id: 'risk-grade',
      name: 'Credit risk grade',
      children: [
        { id: 'rg-a', name: 'Strong applicant band (A / B)' },
        { id: 'rg-b', name: 'Standard applicant band (B / C)' },
        { id: 'rg-c', name: 'Elevated risk: grade C, manual review, or decline' },
      ],
    },
    {
      id: 'final-decision',
      name: 'Final decision',
      children: [
        { id: 'fd-hard', name: 'Declined with policy reason' },
        { id: 'fd-review', name: 'Sent to manual underwriting' },
        { id: 'fd-appr', name: 'Approved under bank policy' },
      ],
    },
    {
      id: 'apr-pricing',
      name: 'Interest rate (APR)',
      children: [
        { id: 'rate-base', name: 'Base rate by product (mortgage, auto, personal)' },
        { id: 'rate-addon', name: 'Extra rate by risk grade' },
        { id: 'rate-dti', name: 'Additional bump when debt-to-income is high' },
      ],
    },
  ],
};

export const LOAN_APPROVALS_DOMAIN_DETAILS: Record<string, AnalysisDomainDetails> = {
  'batch-io': {
    name: 'Batch intake & reporting',
    technicalTraceLines: [
      'Main program: LNMAIN',
      '1000-OPEN-FILES — open input',
      '2000-PRINT-HEADER — column headers',
      '3000-READ-APPLICATION — read one fixed-width line',
      '4000-PROCESS-APPLICATION — call LNRULES; if approved, call LNRATE',
      '4100-PRINT-DECISION — print one result line',
      '9000-CLOSE-FILES — close file and print totals',
    ],
    complexity: 'Low',
    nestedDepth: 2,
    rulesFound: 0,
    editableRules: 0,
    sourceFiles: ['src/LNMAIN.cbl', 'data/applicants.dat'],
  },
  eligibility: {
    name: 'Capacity & prescreen metrics',
    technicalTraceLines: [
      'Program: LNRULES',
      'Paragraph 2000-CALCULATE-RATIOS',
      'Computes monthly income, DTI %, loan-to-income ratio, down payment %',
    ],
    complexity: 'Low',
    nestedDepth: 2,
    rulesFound: 0,
    editableRules: 0,
    sourceFiles: ['src/LNRULES.cbl', 'copy/APPLICANT.cpy'],
  },
  'hard-decline': {
    name: 'Hard prescreen rules',
    technicalTraceLines: [
      'Program: LNRULES',
      'Paragraph 3000-HARD-DECLINE-RULES',
      'Six gates (credit, DTI, loan vs income, employment, bankruptcy, delinquencies)',
      'Decline text via 9100–9600 (reason codes D001–D007)',
    ],
    complexity: 'High',
    nestedDepth: 6,
    rulesFound: 6,
    editableRules: 6,
    sourceFiles: ['src/LNRULES.cbl', 'copy/APPLICANT.cpy', 'copy/DECISION.cpy'],
  },
  'down-payment': {
    name: 'Down payment by loan type',
    technicalTraceLines: [
      'Program: LNRULES',
      'Paragraph 4000-DOWN-PAYMENT-RULE',
      'Nested by mortgage (MT), auto (AU), personal (PL)',
    ],
    complexity: 'High',
    nestedDepth: 3,
    rulesFound: 1,
    editableRules: 1,
    sourceFiles: ['src/LNRULES.cbl', 'copy/APPLICANT.cpy'],
  },
  'risk-grade': {
    name: 'Credit risk grade',
    technicalTraceLines: [
      'Program: LNRULES',
      'Paragraph 5000-RISK-GRADE-RULE',
      'Nested credit-score bands with DTI caps → grades A / B / C / R / D',
    ],
    complexity: 'High',
    nestedDepth: 4,
    rulesFound: 1,
    editableRules: 1,
    sourceFiles: ['src/LNRULES.cbl', 'copy/DECISION.cpy'],
  },
  'final-decision': {
    name: 'Final decision',
    technicalTraceLines: [
      'Program: LNRULES',
      'Paragraph 6000-FINAL-DECISION',
      'Sets approve / manual review / decline from flags and reason fields',
    ],
    complexity: 'Medium',
    nestedDepth: 2,
    rulesFound: 0,
    editableRules: 0,
    sourceFiles: ['src/LNRULES.cbl', 'copy/DECISION.cpy'],
  },
  'apr-pricing': {
    name: 'Interest rate (APR)',
    technicalTraceLines: [
      'Program: LNRATE (called from LNMAIN when decision is approved)',
      '1000-BASE-RATE — product type (MT / AU / PL)',
      '2000-RISK-ADJUSTMENT — add-on by risk grade and high DTI bump',
    ],
    complexity: 'Medium',
    nestedDepth: 2,
    rulesFound: 0,
    editableRules: 0,
    sourceFiles: ['src/LNRATE.cbl', 'src/LNMAIN.cbl'],
  },
};

/** Sum of `rulesFound` across domains — matches README “8 business rules” allocation. */
export const LOAN_APPROVALS_POLICY_RULES_TOTAL = Object.values(LOAN_APPROVALS_DOMAIN_DETAILS).reduce(
  (sum, d) => sum + d.rulesFound,
  0,
);

export const LOAN_APPROVALS_EDITABLE_RULES_TOTAL = Object.values(LOAN_APPROVALS_DOMAIN_DETAILS).reduce(
  (sum, d) => sum + d.editableRules,
  0,
);

/** README: “Total files: 8” in documented tree. */
export const LOAN_APPROVALS_SUMMARY = {
  filesScanned: 8,
  logicDomains: 7,
  rulesFound: LOAN_APPROVALS_POLICY_RULES_TOTAL,
  nestedFlows: 2,
};

/** Leaf/detail ids map to their parent domain for the details panel. */
export const LOAN_APPROVALS_LEAF_TO_DOMAIN: Record<string, string> = {
  'lnmain-open': 'batch-io',
  'lnmain-read': 'batch-io',
  'lnmain-call': 'batch-io',
  'lnmain-print': 'batch-io',
  'calc-income': 'eligibility',
  'calc-dti': 'eligibility',
  'calc-lti': 'eligibility',
  'calc-down': 'eligibility',
  'rule-credit': 'hard-decline',
  'rule-dti': 'hard-decline',
  'rule-lti': 'hard-decline',
  'rule-emp': 'hard-decline',
  'rule-bk': 'hard-decline',
  'rule-del': 'hard-decline',
  'dp-mt': 'down-payment',
  'dp-au': 'down-payment',
  'dp-pl': 'down-payment',
  'rg-a': 'risk-grade',
  'rg-b': 'risk-grade',
  'rg-c': 'risk-grade',
  'fd-hard': 'final-decision',
  'fd-review': 'final-decision',
  'fd-appr': 'final-decision',
  'rate-base': 'apr-pricing',
  'rate-addon': 'apr-pricing',
  'rate-dti': 'apr-pricing',
};

export const LOAN_APPROVALS_DEFAULT_EXPANDED = new Set([
  'root',
  'batch-io',
  'eligibility',
  'hard-decline',
  'down-payment',
  'risk-grade',
  'final-decision',
  'apr-pricing',
]);
