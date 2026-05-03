// Mock report data for the modernization report
export interface ReportData {
  projectName: string;
  analysisDate: string;
  summary: {
    filesScanned: number;
    logicDomains: number;
    rulesFound: number;
    editableRules: number;
    rulesModified: number;
    testsDetected: number;
    testsPassing: number;
    testsFailing: number;
    testsWarning: number;
  };
  logicHierarchy: {
    name: string;
    domains: Array<{
      name: string;
      complexity: string;
      rulesCount: number;
      editableCount: number;
    }>;
  };
  changedRules: Array<{
    id: string;
    name: string;
    domain: string;
    originalValue: string;
    newValue: string;
    impactedFlows: string[];
    impactedTests: number;
    sourceFiles: string[];
  }>;
  testResults: {
    total: number;
    passed: number;
    failed: number;
    warning: number;
    details: Array<{
      name: string;
      status: 'PASS' | 'FAIL' | 'WARN';
      domain: string;
      duration: string;
    }>;
  };
  sourceImpact: Array<{
    file: string;
    linesChanged: number;
    rulesAffected: number;
    complexity: string;
  }>;
}

export const mockReportData: ReportData = {
  projectName: 'Credit Decision Engine',
  analysisDate: new Date().toISOString().split('T')[0],
  summary: {
    filesScanned: 143,
    logicDomains: 5,
    rulesFound: 38,
    editableRules: 10,
    rulesModified: 1,
    testsDetected: 7,
    testsPassing: 5,
    testsFailing: 1,
    testsWarning: 1,
  },
  logicHierarchy: {
    name: 'Credit Decision Engine',
    domains: [
      {
        name: 'Applicant Eligibility',
        complexity: 'Low',
        rulesCount: 8,
        editableCount: 3,
      },
      {
        name: 'Risk Assessment',
        complexity: 'High',
        rulesCount: 12,
        editableCount: 4,
      },
      {
        name: 'Pricing & Offer Calculation',
        complexity: 'Medium',
        rulesCount: 10,
        editableCount: 2,
      },
      {
        name: 'Final Decision Routing',
        complexity: 'Low',
        rulesCount: 8,
        editableCount: 1,
      },
    ],
  },
  changedRules: [
    {
      id: 'credit-score-rule',
      name: 'Minimum Credit Score',
      domain: 'Risk Assessment',
      originalValue: 'creditScore >= 700',
      newValue: 'creditScore >= 680',
      impactedFlows: ['Risk Assessment', 'Final Decision Routing'],
      impactedTests: 3,
      sourceFiles: [
        'CreditApprovalService.java',
        'RiskScoringService.java',
        'credit-rules.xml',
      ],
    },
  ],
  testResults: {
    total: 7,
    passed: 5,
    failed: 1,
    warning: 1,
    details: [
      {
        name: 'High Credit Score Approval',
        status: 'PASS',
        domain: 'Risk Assessment',
        duration: '120ms',
      },
      {
        name: 'Low Credit Score Rejection',
        status: 'WARN',
        domain: 'Risk Assessment',
        duration: '95ms',
      },
      {
        name: 'Borderline Credit Score',
        status: 'FAIL',
        domain: 'Risk Assessment',
        duration: '110ms',
      },
      {
        name: 'Identity Verification Pass',
        status: 'PASS',
        domain: 'Applicant Eligibility',
        duration: '80ms',
      },
      {
        name: 'Age Requirement Check',
        status: 'PASS',
        domain: 'Applicant Eligibility',
        duration: '75ms',
      },
      {
        name: 'Pricing Calculation',
        status: 'PASS',
        domain: 'Pricing & Offer Calculation',
        duration: '130ms',
      },
      {
        name: 'Final Routing Logic',
        status: 'PASS',
        domain: 'Final Decision Routing',
        duration: '90ms',
      },
    ],
  },
  sourceImpact: [
    {
      file: 'CreditApprovalService.java',
      linesChanged: 3,
      rulesAffected: 1,
      complexity: 'Medium',
    },
    {
      file: 'RiskScoringService.java',
      linesChanged: 2,
      rulesAffected: 1,
      complexity: 'Low',
    },
    {
      file: 'credit-rules.xml',
      linesChanged: 1,
      rulesAffected: 1,
      complexity: 'Low',
    },
  ],
};

// Generate Markdown report
export function generateMarkdownReport(data: ReportData): string {
  return `# Legacy Logic Studio - Modernization Report

## Project: ${data.projectName}
**Analysis Date:** ${data.analysisDate}

---

## Executive Summary

This report summarizes the modernization analysis and changes made to the ${data.projectName} legacy application.

### Key Metrics

- **Files Scanned:** ${data.summary.filesScanned}
- **Logic Domains Identified:** ${data.summary.logicDomains}
- **Business Rules Found:** ${data.summary.rulesFound}
- **Editable Rules:** ${data.summary.editableRules}
- **Rules Modified:** ${data.summary.rulesModified}

### Test Results

- **Total Tests:** ${data.summary.testsDetected}
- **Passing:** ${data.summary.testsPassing} ✓
- **Failing:** ${data.summary.testsFailing} ✗
- **Warning:** ${data.summary.testsWarning} ⚠

---

## Logic Hierarchy

### ${data.logicHierarchy.name}

${data.logicHierarchy.domains
  .map(
    (domain) =>
      `#### ${domain.name}
- **Complexity:** ${domain.complexity}
- **Rules Found:** ${domain.rulesCount}
- **Editable Rules:** ${domain.editableCount}`
  )
  .join('\n\n')}

---

## Changed Rules

${
  data.changedRules.length > 0
    ? data.changedRules
        .map(
          (rule) =>
            `### ${rule.name}

**Domain:** ${rule.domain}

**Original Expression:**
\`\`\`
${rule.originalValue}
\`\`\`

**New Expression:**
\`\`\`
${rule.newValue}
\`\`\`

**Impact:**
- Impacted Flows: ${rule.impactedFlows.join(', ')}
- Tests Need Rerun: ${rule.impactedTests}

**Source Files:**
${rule.sourceFiles.map((file) => `- ${file}`).join('\n')}`
        )
        .join('\n\n---\n\n')
    : 'No rules have been modified yet.'
}

---

## Test Results Detail

${data.testResults.details
  .map(
    (test) =>
      `### ${test.name}
- **Status:** ${test.status === 'PASS' ? '✓ PASS' : test.status === 'FAIL' ? '✗ FAIL' : '⚠ WARNING'}
- **Domain:** ${test.domain}
- **Duration:** ${test.duration}`
  )
  .join('\n\n')}

---

## Source Impact Analysis

${data.sourceImpact
  .map(
    (impact) =>
      `### ${impact.file}
- **Lines Changed:** ${impact.linesChanged}
- **Rules Affected:** ${impact.rulesAffected}
- **Complexity:** ${impact.complexity}`
  )
  .join('\n\n')}

---

## Recommendations

1. **Review Failed Tests:** Address the failing test case to ensure rule changes don't break existing functionality.
2. **Update Documentation:** Document the credit score threshold change and its business rationale.
3. **Regression Testing:** Run full regression suite before deploying to production.
4. **Stakeholder Review:** Have business stakeholders review and approve the modified credit score threshold.

---

*Report generated by Legacy Logic Studio*
*Built with IBM Bob - AI-powered development assistant*
`;
}

// Generate JSON report
export function generateJSONReport(data: ReportData): string {
  return JSON.stringify(data, null, 2);
}

// Made with Bob
