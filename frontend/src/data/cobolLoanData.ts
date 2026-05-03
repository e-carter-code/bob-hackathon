// Real COBOL Loan Approval System Data
// Extracted from loan-approvals-COBOL project

export interface CobolRule {
  id: string;
  name: string;
  type: 'hard-decline' | 'conditional' | 'calculation' | 'nested';
  condition: string;
  action: string;
  sourceFile: string;
  lineRange: string;
  decisionCode?: string;
  reasonText?: string;
}

export interface CobolLogicNode {
  id: string;
  name: string;
  type: 'program' | 'section' | 'rule' | 'calculation';
  sourceFile: string;
  children?: CobolLogicNode[];
  rules?: CobolRule[];
}

// Hard Decline Rules (6 rules from LNRULES.cbl)
export const hardDeclineRules: CobolRule[] = [
  {
    id: 'rule-001',
    name: 'Minimum Credit Score',
    type: 'hard-decline',
    condition: 'APPL-CREDIT-SCORE < 580',
    action: 'DECLINE',
    sourceFile: 'LNRULES.cbl',
    lineRange: '62-63',
    decisionCode: 'D001',
    reasonText: 'DECLINED - CREDIT SCORE BELOW POLICY MINIMUM',
  },
  {
    id: 'rule-002',
    name: 'Maximum Debt-to-Income Ratio',
    type: 'hard-decline',
    condition: 'CALC-DTI-PCT > 43.00',
    action: 'DECLINE',
    sourceFile: 'LNRULES.cbl',
    lineRange: '65-66',
    decisionCode: 'D002',
    reasonText: 'DECLINED - DEBT TO INCOME ABOVE 43%',
  },
  {
    id: 'rule-003',
    name: 'Maximum Loan-to-Income Ratio',
    type: 'hard-decline',
    condition: 'CALC-LTI-RATIO > 5.00',
    action: 'DECLINE',
    sourceFile: 'LNRULES.cbl',
    lineRange: '68-69',
    decisionCode: 'D004',
    reasonText: 'DECLINED - LOAN AMOUNT EXCEEDS INCOME MULTIPLE',
  },
  {
    id: 'rule-004',
    name: 'Minimum Employment History',
    type: 'hard-decline',
    condition: 'APPL-EMP-MONTHS < 24',
    action: 'DECLINE',
    sourceFile: 'LNRULES.cbl',
    lineRange: '71-72',
    decisionCode: 'D005',
    reasonText: 'DECLINED - EMPLOYMENT HISTORY BELOW 24 MONTHS',
  },
  {
    id: 'rule-005',
    name: 'Bankruptcy Lookback Period',
    type: 'hard-decline',
    condition: 'APPL-BANKRUPT-YEARS < 7',
    action: 'DECLINE',
    sourceFile: 'LNRULES.cbl',
    lineRange: '74-75',
    decisionCode: 'D006',
    reasonText: 'DECLINED - BANKRUPTCY WITHIN LAST 7 YEARS',
  },
  {
    id: 'rule-006',
    name: 'Maximum Recent Delinquencies',
    type: 'hard-decline',
    condition: 'APPL-DELINQ-COUNT > 2',
    action: 'DECLINE',
    sourceFile: 'LNRULES.cbl',
    lineRange: '77-78',
    decisionCode: 'D007',
    reasonText: 'DECLINED - TOO MANY RECENT DELINQUENCIES',
  },
];

// Nested Down Payment Rule (Rule 7 from README)
export const downPaymentRules: CobolRule[] = [
  {
    id: 'rule-007a',
    name: 'Mortgage Down Payment - Hard Decline',
    type: 'nested',
    condition: 'LOAN-MORTGAGE AND CALC-DOWN-PCT < 5.00',
    action: 'DECLINE',
    sourceFile: 'LNRULES.cbl',
    lineRange: '87-92',
    decisionCode: 'D003',
    reasonText: 'DECLINED - MORTGAGE DOWN PAYMENT BELOW 5%',
  },
  {
    id: 'rule-007b',
    name: 'Mortgage Down Payment - Manual Review',
    type: 'nested',
    condition: 'LOAN-MORTGAGE AND CALC-DOWN-PCT < 20.00',
    action: 'MANUAL REVIEW',
    sourceFile: 'LNRULES.cbl',
    lineRange: '94-98',
    decisionCode: 'R101',
    reasonText: 'REVIEW - MORTGAGE DOWN PAYMENT BELOW 20%',
  },
  {
    id: 'rule-007c',
    name: 'Auto Down Payment - Manual Review',
    type: 'nested',
    condition: 'LOAN-AUTO AND CALC-DOWN-PCT < 10.00',
    action: 'MANUAL REVIEW',
    sourceFile: 'LNRULES.cbl',
    lineRange: '101-106',
    decisionCode: 'R102',
    reasonText: 'REVIEW - AUTO DOWN PAYMENT BELOW 10%',
  },
];

// Nested Risk Grade Rule (Rule 8 from README)
export const riskGradeRules: CobolRule[] = [
  {
    id: 'rule-008a',
    name: 'Risk Grade A',
    type: 'nested',
    condition: 'APPL-CREDIT-SCORE >= 740 AND CALC-DTI-PCT <= 30.00',
    action: 'ASSIGN GRADE A',
    sourceFile: 'LNRULES.cbl',
    lineRange: '112-114',
  },
  {
    id: 'rule-008b',
    name: 'Risk Grade B (High Credit)',
    type: 'nested',
    condition: 'APPL-CREDIT-SCORE >= 740 AND CALC-DTI-PCT > 30.00',
    action: 'ASSIGN GRADE B',
    sourceFile: 'LNRULES.cbl',
    lineRange: '115-116',
  },
  {
    id: 'rule-008c',
    name: 'Risk Grade B (Medium Credit)',
    type: 'nested',
    condition: 'APPL-CREDIT-SCORE >= 680 AND CALC-DTI-PCT <= 36.00',
    action: 'ASSIGN GRADE B',
    sourceFile: 'LNRULES.cbl',
    lineRange: '119-121',
  },
  {
    id: 'rule-008d',
    name: 'Risk Grade C (Medium Credit)',
    type: 'nested',
    condition: 'APPL-CREDIT-SCORE >= 680 AND CALC-DTI-PCT > 36.00',
    action: 'ASSIGN GRADE C',
    sourceFile: 'LNRULES.cbl',
    lineRange: '122-123',
  },
  {
    id: 'rule-008e',
    name: 'Risk Grade C (Lower Credit)',
    type: 'nested',
    condition: 'APPL-CREDIT-SCORE >= 620 AND CALC-DTI-PCT <= 40.00',
    action: 'ASSIGN GRADE C',
    sourceFile: 'LNRULES.cbl',
    lineRange: '126-128',
  },
  {
    id: 'rule-008f',
    name: 'Risk Grade R - Manual Review',
    type: 'nested',
    condition: 'APPL-CREDIT-SCORE >= 620 AND CALC-DTI-PCT > 40.00',
    action: 'MANUAL REVIEW',
    sourceFile: 'LNRULES.cbl',
    lineRange: '129-133',
    decisionCode: 'R201',
    reasonText: 'REVIEW - BORDERLINE CREDIT AND DTI',
  },
  {
    id: 'rule-008g',
    name: 'Risk Grade D - Decline',
    type: 'nested',
    condition: 'APPL-CREDIT-SCORE < 620',
    action: 'DECLINE',
    sourceFile: 'LNRULES.cbl',
    lineRange: '135-137',
    decisionCode: 'D001',
    reasonText: 'DECLINED - CREDIT SCORE BELOW POLICY MINIMUM',
  },
];

// APR Calculation Rules from LNRATE.cbl
export const aprCalculationRules: CobolRule[] = [
  {
    id: 'rate-001',
    name: 'Mortgage Base Rate',
    type: 'calculation',
    condition: 'LOAN-MORTGAGE',
    action: 'SET BASE RATE = 6.75%',
    sourceFile: 'LNRATE.cbl',
    lineRange: '26-27',
  },
  {
    id: 'rate-002',
    name: 'Auto Loan Base Rate',
    type: 'calculation',
    condition: 'LOAN-AUTO',
    action: 'SET BASE RATE = 7.50%',
    sourceFile: 'LNRATE.cbl',
    lineRange: '29-30',
  },
  {
    id: 'rate-003',
    name: 'Personal Loan Base Rate',
    type: 'calculation',
    condition: 'LOAN-PERSONAL',
    action: 'SET BASE RATE = 11.25%',
    sourceFile: 'LNRATE.cbl',
    lineRange: '32-33',
  },
  {
    id: 'rate-004',
    name: 'Risk Grade A Adjustment',
    type: 'calculation',
    condition: 'RISK-GRADE = "A"',
    action: 'ADD 0.00% TO BASE RATE',
    sourceFile: 'LNRATE.cbl',
    lineRange: '38-39',
  },
  {
    id: 'rate-005',
    name: 'Risk Grade B Adjustment',
    type: 'calculation',
    condition: 'RISK-GRADE = "B"',
    action: 'ADD 1.25% TO BASE RATE',
    sourceFile: 'LNRATE.cbl',
    lineRange: '40-41',
  },
  {
    id: 'rate-006',
    name: 'Risk Grade C Adjustment',
    type: 'calculation',
    condition: 'RISK-GRADE = "C"',
    action: 'ADD 2.75% TO BASE RATE',
    sourceFile: 'LNRATE.cbl',
    lineRange: '42-43',
  },
  {
    id: 'rate-007',
    name: 'High DTI Penalty',
    type: 'calculation',
    condition: 'CALC-DTI-PCT > 38.00',
    action: 'ADD 0.50% TO RATE',
    sourceFile: 'LNRATE.cbl',
    lineRange: '47-48',
  },
];

// Complete Logic Hierarchy
export const cobolLogicHierarchy: CobolLogicNode = {
  id: 'root',
  name: 'Legacy Bank Loan Approval System',
  type: 'program',
  sourceFile: 'LNMAIN.cbl',
  children: [
    {
      id: 'input-processing',
      name: 'Input Processing',
      type: 'section',
      sourceFile: 'LNMAIN.cbl',
      children: [
        {
          id: 'file-read',
          name: 'Read Fixed-Width Applicant File',
          type: 'rule',
          sourceFile: 'LNMAIN.cbl',
        },
        {
          id: 'parse-record',
          name: 'Parse 64-Character Record',
          type: 'rule',
          sourceFile: 'LNMAIN.cbl',
        },
      ],
    },
    {
      id: 'ratio-calculations',
      name: 'Financial Ratio Calculations',
      type: 'section',
      sourceFile: 'LNRULES.cbl',
      children: [
        {
          id: 'calc-dti',
          name: 'Calculate Debt-to-Income Ratio',
          type: 'calculation',
          sourceFile: 'LNRULES.cbl',
          rules: [
            {
              id: 'calc-001',
              name: 'DTI Calculation',
              type: 'calculation',
              condition: 'CALC-MONTHLY-INCOME > 0',
              action: 'DTI = (MONTHLY-DEBT / MONTHLY-INCOME) * 100',
              sourceFile: 'LNRULES.cbl',
              lineRange: '42-46',
            },
          ],
        },
        {
          id: 'calc-lti',
          name: 'Calculate Loan-to-Income Ratio',
          type: 'calculation',
          sourceFile: 'LNRULES.cbl',
          rules: [
            {
              id: 'calc-002',
              name: 'LTI Calculation',
              type: 'calculation',
              condition: 'APPL-ANNUAL-INCOME > 0',
              action: 'LTI = LOAN-AMOUNT / ANNUAL-INCOME',
              sourceFile: 'LNRULES.cbl',
              lineRange: '48-52',
            },
          ],
        },
        {
          id: 'calc-down',
          name: 'Calculate Down Payment Percentage',
          type: 'calculation',
          sourceFile: 'LNRULES.cbl',
          rules: [
            {
              id: 'calc-003',
              name: 'Down Payment % Calculation',
              type: 'calculation',
              condition: 'APPL-LOAN-AMOUNT > 0',
              action: 'DOWN-PCT = (DOWN-PAYMENT / LOAN-AMOUNT) * 100',
              sourceFile: 'LNRULES.cbl',
              lineRange: '54-58',
            },
          ],
        },
      ],
    },
    {
      id: 'hard-decline-rules',
      name: 'Hard Decline Rules',
      type: 'section',
      sourceFile: 'LNRULES.cbl',
      rules: hardDeclineRules,
    },
    {
      id: 'down-payment-rule',
      name: 'Down Payment Rule (Nested)',
      type: 'section',
      sourceFile: 'LNRULES.cbl',
      children: [
        {
          id: 'mortgage-down',
          name: 'Mortgage Down Payment Logic',
          type: 'rule',
          sourceFile: 'LNRULES.cbl',
          rules: [downPaymentRules[0], downPaymentRules[1]],
        },
        {
          id: 'auto-down',
          name: 'Auto Loan Down Payment Logic',
          type: 'rule',
          sourceFile: 'LNRULES.cbl',
          rules: [downPaymentRules[2]],
        },
      ],
    },
    {
      id: 'risk-grade-rule',
      name: 'Risk Grade Rule (Nested)',
      type: 'section',
      sourceFile: 'LNRULES.cbl',
      children: [
        {
          id: 'excellent-credit',
          name: 'Excellent Credit (740+)',
          type: 'rule',
          sourceFile: 'LNRULES.cbl',
          rules: [riskGradeRules[0], riskGradeRules[1]],
        },
        {
          id: 'good-credit',
          name: 'Good Credit (680-739)',
          type: 'rule',
          sourceFile: 'LNRULES.cbl',
          rules: [riskGradeRules[2], riskGradeRules[3]],
        },
        {
          id: 'fair-credit',
          name: 'Fair Credit (620-679)',
          type: 'rule',
          sourceFile: 'LNRULES.cbl',
          rules: [riskGradeRules[4], riskGradeRules[5]],
        },
        {
          id: 'poor-credit',
          name: 'Poor Credit (<620)',
          type: 'rule',
          sourceFile: 'LNRULES.cbl',
          rules: [riskGradeRules[6]],
        },
      ],
    },
    {
      id: 'final-decision',
      name: 'Final Decision Logic',
      type: 'section',
      sourceFile: 'LNRULES.cbl',
      children: [
        {
          id: 'approval-path',
          name: 'Approval Path',
          type: 'rule',
          sourceFile: 'LNRULES.cbl',
          rules: [
            {
              id: 'final-001',
              name: 'Approve Application',
              type: 'conditional',
              condition: 'NO-HARD-DECLINE AND NO-MANUAL-REVIEW',
              action: 'SET DECISION-APPROVED',
              sourceFile: 'LNRULES.cbl',
              lineRange: '154-156',
              decisionCode: 'A001',
              reasonText: 'APPROVED - MEETS BANK CREDIT POLICY',
            },
          ],
        },
        {
          id: 'review-path',
          name: 'Manual Review Path',
          type: 'rule',
          sourceFile: 'LNRULES.cbl',
          rules: [
            {
              id: 'final-002',
              name: 'Route to Manual Review',
              type: 'conditional',
              condition: 'NO-HARD-DECLINE AND MANUAL-REVIEW',
              action: 'SET DECISION-REVIEW',
              sourceFile: 'LNRULES.cbl',
              lineRange: '147-152',
              decisionCode: 'R999',
              reasonText: 'REVIEW - POLICY EXCEPTION REQUIRED',
            },
          ],
        },
        {
          id: 'decline-path',
          name: 'Decline Path',
          type: 'rule',
          sourceFile: 'LNRULES.cbl',
          rules: [
            {
              id: 'final-003',
              name: 'Decline Application',
              type: 'conditional',
              condition: 'HARD-DECLINE',
              action: 'SET DECISION-DECLINED',
              sourceFile: 'LNRULES.cbl',
              lineRange: '144-145',
            },
          ],
        },
      ],
    },
    {
      id: 'apr-calculation',
      name: 'APR Calculation',
      type: 'section',
      sourceFile: 'LNRATE.cbl',
      children: [
        {
          id: 'base-rate',
          name: 'Base Rate by Loan Type',
          type: 'calculation',
          sourceFile: 'LNRATE.cbl',
          rules: [aprCalculationRules[0], aprCalculationRules[1], aprCalculationRules[2]],
        },
        {
          id: 'risk-adjustment',
          name: 'Risk Grade Adjustment',
          type: 'calculation',
          sourceFile: 'LNRATE.cbl',
          rules: [
            aprCalculationRules[3],
            aprCalculationRules[4],
            aprCalculationRules[5],
            aprCalculationRules[6],
          ],
        },
      ],
    },
    {
      id: 'output-formatting',
      name: 'Output Formatting',
      type: 'section',
      sourceFile: 'LNMAIN.cbl',
      children: [
        {
          id: 'print-decision',
          name: 'Print Decision Line',
          type: 'rule',
          sourceFile: 'LNMAIN.cbl',
        },
        {
          id: 'print-summary',
          name: 'Print Batch Summary',
          type: 'rule',
          sourceFile: 'LNMAIN.cbl',
        },
      ],
    },
  ],
};

// Sample test data from applicants.dat
export const sampleApplicants = [
  {
    id: '10001',
    name: 'ALICE MARTIN',
    loanType: 'MT',
    annualIncome: 95000,
    loanAmount: 320000,
    monthlyDebt: 900,
    creditScore: 780,
    empMonths: 60,
    bankruptYears: 99,
    delinqCount: 0,
    downPayment: 100000,
    expectedDecision: 'APPROVED',
    expectedAPR: 6.75,
    expectedReason: 'APPROVED - MEETS BANK CREDIT POLICY',
  },
  {
    id: '10002',
    name: 'BRIAN CHEN',
    loanType: 'AU',
    annualIncome: 62000,
    loanAmount: 28000,
    monthlyDebt: 1200,
    creditScore: 710,
    empMonths: 36,
    bankruptYears: 99,
    delinqCount: 0,
    downPayment: 2000,
    expectedDecision: 'REVIEW',
    expectedAPR: 0.0,
    expectedReason: 'REVIEW - AUTO DOWN PAYMENT BELOW 10%',
  },
  {
    id: '10003',
    name: 'CARLA DIAZ',
    loanType: 'PL',
    annualIncome: 48000,
    loanAmount: 45000,
    monthlyDebt: 2300,
    creditScore: 650,
    empMonths: 48,
    bankruptYears: 12,
    delinqCount: 0,
    downPayment: 0,
    expectedDecision: 'DECLINED',
    expectedAPR: 0.0,
    expectedReason: 'DECLINED - DEBT TO INCOME ABOVE 43%',
  },
];

// Summary statistics
export const cobolSystemSummary = {
  projectName: 'Legacy Bank Loan Approval System',
  language: 'COBOL',
  programs: 3,
  sourceFiles: ['LNMAIN.cbl', 'LNRULES.cbl', 'LNRATE.cbl'],
  copybooks: ['APPLICANT.cpy', 'DECISION.cpy'],
  totalRules: 8,
  hardDeclineRules: 6,
  nestedRules: 2,
  calculationRules: 10,
  maxNestingDepth: 3,
  loanTypes: ['Mortgage', 'Auto', 'Personal'],
  decisionTypes: ['Approved', 'Manual Review', 'Declined'],
  riskGrades: ['A', 'B', 'C', 'R', 'D'],
};

// Made with Bob
