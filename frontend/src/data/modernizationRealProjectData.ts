import type { LegacyToModernEntry } from './modernizationTypes';

import legacyLnmain from '../../../loan-approvals-COBOL/src/LNMAIN.cbl?raw';
import legacyLnrules from '../../../loan-approvals-COBOL/src/LNRULES.cbl?raw';
import legacyLnrate from '../../../loan-approvals-COBOL/src/LNRATE.cbl?raw';
import legacyApplicant from '../../../loan-approvals-COBOL/copy/APPLICANT.cpy?raw';
import legacyDecision from '../../../loan-approvals-COBOL/copy/DECISION.cpy?raw';

import readmeMd from '../../../loan-approval-service/README.md?raw';
import pomXml from '../../../loan-approval-service/pom.xml?raw';
import javaBatchRowResult from '../../../loan-approval-service/src/main/java/com/legacylogic/loan/batch/BatchRowResult.java?raw';
import javaLoanBatchProcessor from '../../../loan-approval-service/src/main/java/com/legacylogic/loan/batch/LoanBatchProcessor.java?raw';
import javaLoanBatchRunner from '../../../loan-approval-service/src/main/java/com/legacylogic/loan/batch/LoanBatchRunner.java?raw';
import javaCobolDecimal from '../../../loan-approval-service/src/main/java/com/legacylogic/loan/cobol/CobolDecimal.java?raw';
import javaApplicantCalc from '../../../loan-approval-service/src/main/java/com/legacylogic/loan/model/ApplicantCalc.java?raw';
import javaApplicantRecord from '../../../loan-approval-service/src/main/java/com/legacylogic/loan/model/ApplicantRecord.java?raw';
import javaDecisionRecord from '../../../loan-approval-service/src/main/java/com/legacylogic/loan/model/DecisionRecord.java?raw';
import javaRuleFlags from '../../../loan-approval-service/src/main/java/com/legacylogic/loan/model/RuleFlags.java?raw';
import javaApplicantLineParser from '../../../loan-approval-service/src/main/java/com/legacylogic/loan/parser/ApplicantLineParser.java?raw';
import javaLnRateEngine from '../../../loan-approval-service/src/main/java/com/legacylogic/loan/rate/LnRateEngine.java?raw';
import javaLnRulesEngine from '../../../loan-approval-service/src/main/java/com/legacylogic/loan/rules/LnRulesEngine.java?raw';
import javaRatioCalculator from '../../../loan-approval-service/src/main/java/com/legacylogic/loan/rules/RatioCalculator.java?raw';
import javaGoldenTest from '../../../loan-approval-service/src/test/java/com/legacylogic/loan/GoldenCobolParityTest.java?raw';

export const DEFAULT_LEGACY_PATH = 'src/LNRULES.cbl';
export const DEFAULT_MODERN_PATH =
  'src/main/java/com/legacylogic/loan/rules/LnRulesEngine.java';
/** When a legacy file has no mapping entry, show this modern artifact */
export const FALLBACK_MODERN_PATH = 'README.md';

export const legacyFileContents: Record<string, string> = {
  'src/LNMAIN.cbl': legacyLnmain,
  'src/LNRULES.cbl': legacyLnrules,
  'src/LNRATE.cbl': legacyLnrate,
  'copy/APPLICANT.cpy': legacyApplicant,
  'copy/DECISION.cpy': legacyDecision,
};

export const modernFileContents: Record<string, string> = {
  'README.md': readmeMd,
  'pom.xml': pomXml,
  'src/main/java/com/legacylogic/loan/batch/BatchRowResult.java': javaBatchRowResult,
  'src/main/java/com/legacylogic/loan/batch/LoanBatchProcessor.java': javaLoanBatchProcessor,
  'src/main/java/com/legacylogic/loan/batch/LoanBatchRunner.java': javaLoanBatchRunner,
  'src/main/java/com/legacylogic/loan/cobol/CobolDecimal.java': javaCobolDecimal,
  'src/main/java/com/legacylogic/loan/model/ApplicantCalc.java': javaApplicantCalc,
  'src/main/java/com/legacylogic/loan/model/ApplicantRecord.java': javaApplicantRecord,
  'src/main/java/com/legacylogic/loan/model/DecisionRecord.java': javaDecisionRecord,
  'src/main/java/com/legacylogic/loan/model/RuleFlags.java': javaRuleFlags,
  'src/main/java/com/legacylogic/loan/parser/ApplicantLineParser.java': javaApplicantLineParser,
  'src/main/java/com/legacylogic/loan/rate/LnRateEngine.java': javaLnRateEngine,
  'src/main/java/com/legacylogic/loan/rules/LnRulesEngine.java': javaLnRulesEngine,
  'src/main/java/com/legacylogic/loan/rules/RatioCalculator.java': javaRatioCalculator,
  'src/test/java/com/legacylogic/loan/GoldenCobolParityTest.java': javaGoldenTest,
};

const lnrulesRelated = [
  'src/main/java/com/legacylogic/loan/rules/RatioCalculator.java',
  'src/main/java/com/legacylogic/loan/model/ApplicantRecord.java',
  'src/main/java/com/legacylogic/loan/model/ApplicantCalc.java',
  'src/main/java/com/legacylogic/loan/model/DecisionRecord.java',
  'src/main/java/com/legacylogic/loan/model/RuleFlags.java',
  'src/main/java/com/legacylogic/loan/cobol/CobolDecimal.java',
];

const lnmainRelated = [
  'src/main/java/com/legacylogic/loan/batch/LoanBatchRunner.java',
  'src/main/java/com/legacylogic/loan/batch/BatchRowResult.java',
  'src/main/java/com/legacylogic/loan/parser/ApplicantLineParser.java',
  'src/main/java/com/legacylogic/loan/rules/LnRulesEngine.java',
  'src/main/java/com/legacylogic/loan/rate/LnRateEngine.java',
  'src/main/java/com/legacylogic/loan/model/ApplicantCalc.java',
  'src/main/java/com/legacylogic/loan/model/DecisionRecord.java',
  'src/main/java/com/legacylogic/loan/model/RuleFlags.java',
];

export const legacyToModernMap: Record<string, LegacyToModernEntry> = {
  'src/LNRULES.cbl': {
    primaryModernFile: 'src/main/java/com/legacylogic/loan/rules/LnRulesEngine.java',
    relatedModernFiles: lnrulesRelated,
    ruleMapping: {
      legacyParagraph: '3000-HARD-DECLINE-RULES',
      legacyRule: 'IF APPL-CREDIT-SCORE < 580; IF CALC-DTI-PCT > 43.00',
      visualEdit: 'Visual prescreen graph (same thresholds as LNRULES)',
      modernMethod: 'LnRulesEngine.applyRules → paragraph3000HardDeclineRules',
      modernRule: 'if (a.applCreditScore() < 580)',
    },
  },
  'src/LNRATE.cbl': {
    primaryModernFile: 'src/main/java/com/legacylogic/loan/rate/LnRateEngine.java',
    relatedModernFiles: [
      'src/main/java/com/legacylogic/loan/model/ApplicantRecord.java',
      'src/main/java/com/legacylogic/loan/cobol/CobolDecimal.java',
    ],
    ruleMapping: {
      legacyParagraph: '1000-BASE-RATE / 2000-RISK-ADJUSTMENT',
      legacyRule: 'WS-BASE-RATE by loan type; LK-DTI-PCT > 38.00 adds 0.50',
      visualEdit: 'Rate edges in visual editor',
      modernMethod: 'LnRateEngine.computeApprovedApr',
      modernRule: 'lkDtiPct.compareTo(CobolDecimal.bd("38.00")) > 0',
    },
  },
  'src/LNMAIN.cbl': {
    primaryModernFile: 'src/main/java/com/legacylogic/loan/batch/LoanBatchProcessor.java',
    relatedModernFiles: lnmainRelated,
    ruleMapping: {
      legacyParagraph: '4000-PROCESS-APPLICATION',
      legacyRule: 'CALL "LNRULES" … CALL "LNRATE" when DECISION-APPROVED',
      visualEdit: 'Batch flow nodes',
      modernMethod: 'LoanBatchProcessor.processLine',
      modernRule: 'LnRulesEngine.applyRules then LnRateEngine.computeApprovedApr',
    },
  },
  'copy/APPLICANT.cpy': {
    primaryModernFile: 'src/main/java/com/legacylogic/loan/model/ApplicantRecord.java',
    relatedModernFiles: [
      'src/main/java/com/legacylogic/loan/model/ApplicantCalc.java',
      'src/main/java/com/legacylogic/loan/parser/ApplicantLineParser.java',
    ],
    ruleMapping: {
      legacyParagraph: 'APPLICANT-REC / APPLICANT-CALC',
      legacyRule: 'PIC layouts for applicant line and calculated ratios',
      visualEdit: 'Applicant / ratio nodes',
      modernMethod: 'ApplicantRecord, ApplicantCalc, ApplicantLineParser.parse',
      modernRule: '64-char line → ApplicantRecord (APPLICANT.cpy)',
    },
  },
  'copy/DECISION.cpy': {
    primaryModernFile: 'src/main/java/com/legacylogic/loan/model/DecisionRecord.java',
    relatedModernFiles: ['src/main/java/com/legacylogic/loan/model/RuleFlags.java'],
    ruleMapping: {
      legacyParagraph: 'DECISION-REC / RULE-FLAGS',
      legacyRule: '88-level DECISION-APPROVED, HARD-DECLINE, etc.',
      visualEdit: 'Decision outcome nodes',
      modernMethod: 'DecisionRecord, RuleFlags',
      modernRule: 'Same codes as COBOL 88-levels',
    },
  },
};

export const ruleHighlightNeedles: Record<string, string[]> = {
  'src/LNRULES.cbl': ['IF APPL-CREDIT-SCORE < 580', 'IF CALC-DTI-PCT > 43.00', '3000-HARD-DECLINE-RULES'],
  'src/LNRATE.cbl': ['MOVE 6.75 TO WS-BASE-RATE', 'IF LK-DTI-PCT > 38.00', '2000-RISK-ADJUSTMENT'],
  'src/LNMAIN.cbl': ['CALL "LNRULES"', 'CALL "LNRATE"', '4000-PROCESS-APPLICATION'],
  'copy/APPLICANT.cpy': ['APPL-CREDIT-SCORE', 'CALC-DTI-PCT', 'LOAN-MORTGAGE'],
  'copy/DECISION.cpy': ['DECISION-APPROVED', 'HARD-DECLINE', 'APPROVED-APR'],
  'src/main/java/com/legacylogic/loan/rules/LnRulesEngine.java': [
    'paragraph3000HardDeclineRules',
    'applCreditScore() < 580',
    'bd("43.00")',
  ],
  'src/main/java/com/legacylogic/loan/rules/RatioCalculator.java': [
    'calculateRatios',
    'CALC-DTI-PCT',
  ],
  'src/main/java/com/legacylogic/loan/rate/LnRateEngine.java': [
    'paragraph1000BaseRate',
    'bd("38.00")',
    'CobolDecimal.bd("6.75")',
  ],
  'src/main/java/com/legacylogic/loan/batch/LoanBatchProcessor.java': [
    'LnRulesEngine.applyRules',
    'LnRateEngine.computeApprovedApr',
  ],
  'src/main/java/com/legacylogic/loan/batch/LoanBatchRunner.java': [
    'LoanBatchProcessor.processLine',
    'LEGACY BANK LOAN APPROVAL BATCH',
  ],
  'src/main/java/com/legacylogic/loan/parser/ApplicantLineParser.java': ['parse(', '64', 'APPLICANT'],
  'src/main/java/com/legacylogic/loan/model/ApplicantRecord.java': ['record ApplicantRecord', 'applCreditScore'],
  'src/main/java/com/legacylogic/loan/model/DecisionRecord.java': ['isApproved', 'DecisionRecord'],
  'src/main/java/com/legacylogic/loan/model/RuleFlags.java': ['hardDecline', 'RuleFlags'],
  'src/test/java/com/legacylogic/loan/GoldenCobolParityTest.java': ['expected-output', 'GoldenCobolParityTest', '@Test'],
  'README.md': ['LNMAIN', 'LNRULES', 'GoldenCobolParityTest'],
  'pom.xml': ['loan-approval-service', 'junit-jupiter'],
};

/** Paths and contents under loan-approval-service/ in the downloaded zip */
export function getModernZipFileMap(): Record<string, string> {
  return { ...modernFileContents };
}
