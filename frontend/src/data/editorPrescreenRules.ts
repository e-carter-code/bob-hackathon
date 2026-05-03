/**
 * Editable policy knobs aligned with Analysis `editableRules` totals (6 + 1 + 1 = 8):
 * six hard-prescreen gates (`3000-HARD-DECLINE-RULES`), mortgage down floor (`4000-DOWN-PAYMENT-RULE`),
 * and risk-grade credit floor before D (`5000-RISK-GRADE-RULE`).
 */

/** Same shape as the editor page rule editor state */
export type EditorEditableRule = {
  id: string;
  name: string;
  parentFlow: string;
  businessMeaning: string;
  technicalExpression: string;
  threshold: number;
  originalThreshold: number;
  sourceFiles: string[];
  impactedFlows: string[];
};

export type PrescreenGateSeed = {
  /** Hierarchy / graph node id (Analysis leaf id) */
  nodeId: string;
  /** Key in `editableRules` record */
  ruleId: string;
  name: string;
  parentFlow: string;
  businessMeaning: string;
  /** Initial policy value (COBOL sample) */
  originalThreshold: number;
  /** Shown in technical panel; `%` etc. in name only where relevant */
  technicalExpressionTemplate: string;
  impactedFlows: string[];
  /** Optional per-domain file list; defaults in `buildEditorEditableRulesInitial` if omitted */
  sourceFiles?: string[];
};

export const EDITOR_PRESCREEN_GATES: PrescreenGateSeed[] = [
  {
    nodeId: 'rule-credit',
    ruleId: 'gate-credit',
    name: 'Minimum credit score',
    parentFlow: 'Hard prescreen rules',
    businessMeaning:
      'The bank stops the application if the credit score is below this floor; otherwise the file moves on to the next check.',
    originalThreshold: 580,
    technicalExpressionTemplate: 'APPL-CREDIT-SCORE >= {t}',
    impactedFlows: ['3000-HARD-DECLINE-RULES', '9100-DECLINE-CREDIT'],
  },
  {
    nodeId: 'rule-dti',
    ruleId: 'gate-dti',
    name: 'Maximum debt-to-income',
    parentFlow: 'Hard prescreen rules',
    businessMeaning:
      'If debt-to-income is above this percentage, the program declines with the DTI reason; otherwise it continues down the ladder.',
    originalThreshold: 43,
    technicalExpressionTemplate: 'CALC-DTI-PCT <= {t}',
    impactedFlows: ['3000-HARD-DECLINE-RULES', '9200-DECLINE-DTI'],
  },
  {
    nodeId: 'rule-lti',
    ruleId: 'gate-lti',
    name: 'Loan vs income multiple',
    parentFlow: 'Hard prescreen rules',
    businessMeaning:
      'Declines when the loan is too large compared to annual income (loan-to-income ratio above this multiple).',
    originalThreshold: 5,
    technicalExpressionTemplate: 'CALC-LTI-RATIO <= {t}',
    impactedFlows: ['3000-HARD-DECLINE-RULES', '9300-DECLINE-LTI'],
  },
  {
    nodeId: 'rule-emp',
    ruleId: 'gate-emp',
    name: 'Minimum employment history',
    parentFlow: 'Hard prescreen rules',
    businessMeaning:
      'Requires at least this many months of employment history before the case can pass this gate.',
    originalThreshold: 24,
    technicalExpressionTemplate: 'APPL-EMP-MONTHS >= {t}',
    impactedFlows: ['3000-HARD-DECLINE-RULES', '9400-DECLINE-EMPLOYMENT'],
  },
  {
    nodeId: 'rule-bk',
    ruleId: 'gate-bk',
    name: 'Years since bankruptcy',
    parentFlow: 'Hard prescreen rules',
    businessMeaning:
      'Declines when the borrower’s bankruptcy was too recent—policy needs at least this many years since discharge.',
    originalThreshold: 7,
    technicalExpressionTemplate: 'APPL-BANKRUPT-YEARS >= {t}',
    impactedFlows: ['3000-HARD-DECLINE-RULES', '9500-DECLINE-BANKRUPTCY'],
  },
  {
    nodeId: 'rule-del',
    ruleId: 'gate-del',
    name: 'Delinquency count limit',
    parentFlow: 'Hard prescreen rules',
    businessMeaning:
      'Too many recent delinquencies trigger a decline; this is the maximum count still allowed.',
    originalThreshold: 2,
    technicalExpressionTemplate: 'APPL-DELINQ-COUNT <= {t}',
    impactedFlows: ['3000-HARD-DECLINE-RULES', '9600-DECLINE-DELINQ'],
  },
];

/** One editable threshold each for down-payment and risk-grade domains (matches Analysis counts). */
export const EDITOR_EXTRA_EDITABLE_GATES: PrescreenGateSeed[] = [
  {
    nodeId: 'dp-mt',
    ruleId: 'gate-down-mt',
    name: 'Mortgage minimum down payment',
    parentFlow: 'Down payment by loan type',
    businessMeaning:
      'Mortgage applications below this down-payment percent are hard-declined (D003); a higher band in the sample triggers manual review only.',
    originalThreshold: 5,
    technicalExpressionTemplate: 'CALC-DOWN-PCT >= {t}',
    impactedFlows: ['4000-DOWN-PAYMENT-RULE'],
    sourceFiles: ['src/LNRULES.cbl', 'copy/APPLICANT.cpy'],
  },
  {
    nodeId: 'rg-c',
    ruleId: 'gate-risk-floor',
    name: 'Risk grade — minimum credit (above D)',
    parentFlow: 'Credit risk grade',
    businessMeaning:
      'Scores below this floor receive grade D and the sample performs the credit decline path (see `5000-RISK-GRADE-RULE` in LNRULES).',
    originalThreshold: 620,
    technicalExpressionTemplate: 'APPL-CREDIT-SCORE >= {t}',
    impactedFlows: ['5000-RISK-GRADE-RULE'],
    sourceFiles: ['src/LNRULES.cbl', 'copy/DECISION.cpy'],
  },
];

export const EDITOR_ALL_EDITABLE_GATES: PrescreenGateSeed[] = [
  ...EDITOR_PRESCREEN_GATES,
  ...EDITOR_EXTRA_EDITABLE_GATES,
];

export function getEditorEditableGateByNodeId(nodeId: string): PrescreenGateSeed | undefined {
  return EDITOR_ALL_EDITABLE_GATES.find((g) => g.nodeId === nodeId);
}

export function prescreenGateLabel(ruleId: string, threshold: number): string {
  switch (ruleId) {
    case 'gate-credit':
      return `Credit score at least ${threshold}?`;
    case 'gate-dti':
      return `Debt-to-income at most ${threshold}%?`;
    case 'gate-lti':
      return `Loan-to-income at most ${threshold}×?`;
    case 'gate-emp':
      return `Employment at least ${threshold} months?`;
    case 'gate-bk':
      return `${threshold}+ years since bankruptcy?`;
    case 'gate-del':
      return `Delinquencies at most ${threshold}?`;
    case 'gate-down-mt':
      return `Mortgage down at least ${threshold}%?`;
    case 'gate-risk-floor':
      return `Credit at least ${threshold} (above D grade)?`;
    default:
      return 'Policy check';
  }
}

export function technicalExpressionFor(ruleId: string, threshold: number): string {
  const g = EDITOR_ALL_EDITABLE_GATES.find((x) => x.ruleId === ruleId);
  if (!g) return String(threshold);
  return g.technicalExpressionTemplate.replace('{t}', String(threshold));
}

const DEFAULT_RULE_SOURCE_FILES = ['src/LNRULES.cbl', 'copy/APPLICANT.cpy'];

export function buildEditorEditableRulesInitial(): Record<string, EditorEditableRule> {
  const out: Record<string, EditorEditableRule> = {};
  for (const g of EDITOR_ALL_EDITABLE_GATES) {
    out[g.ruleId] = {
      id: g.ruleId,
      name: g.name,
      parentFlow: g.parentFlow,
      businessMeaning: g.businessMeaning,
      technicalExpression: technicalExpressionFor(g.ruleId, g.originalThreshold),
      threshold: g.originalThreshold,
      originalThreshold: g.originalThreshold,
      sourceFiles: [...(g.sourceFiles ?? DEFAULT_RULE_SOURCE_FILES)],
      impactedFlows: [...g.impactedFlows],
    };
  }
  return out;
}
