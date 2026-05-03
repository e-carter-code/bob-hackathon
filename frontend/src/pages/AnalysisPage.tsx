import { useState } from 'react';
import {
  cobolLogicHierarchy,
  cobolSystemSummary,
  hardDeclineRules,
  downPaymentRules,
  riskGradeRules,
  aprCalculationRules,
  type CobolLogicNode,
  type CobolRule,
} from '../data/cobolLoanData';

interface DomainDetails {
  name: string;
  complexity: string;
  nestedDepth: number;
  rulesFound: number;
  editableRules: number;
  testsCovering: number;
  sourceFiles: string[];
  rules?: CobolRule[];
}

const domainDetailsMap: Record<string, DomainDetails> = {
  'hard-decline-rules': {
    name: 'Hard Decline Rules',
    complexity: 'High',
    nestedDepth: 1,
    rulesFound: 6,
    editableRules: 6,
    testsCovering: 5,
    sourceFiles: ['LNRULES.cbl'],
    rules: hardDeclineRules,
  },
  'down-payment-rule': {
    name: 'Down Payment Rule (Nested)',
    complexity: 'High',
    nestedDepth: 3,
    rulesFound: 3,
    editableRules: 3,
    testsCovering: 2,
    sourceFiles: ['LNRULES.cbl'],
    rules: downPaymentRules,
  },
  'risk-grade-rule': {
    name: 'Risk Grade Rule (Nested)',
    complexity: 'High',
    nestedDepth: 3,
    rulesFound: 7,
    editableRules: 7,
    testsCovering: 4,
    sourceFiles: ['LNRULES.cbl'],
    rules: riskGradeRules,
  },
  'apr-calculation': {
    name: 'APR Calculation',
    complexity: 'Medium',
    nestedDepth: 2,
    rulesFound: 7,
    editableRules: 7,
    testsCovering: 3,
    sourceFiles: ['LNRATE.cbl'],
    rules: aprCalculationRules,
  },
  'ratio-calculations': {
    name: 'Financial Ratio Calculations',
    complexity: 'Low',
    nestedDepth: 1,
    rulesFound: 3,
    editableRules: 0,
    testsCovering: 3,
    sourceFiles: ['LNRULES.cbl'],
  },
  'final-decision': {
    name: 'Final Decision Logic',
    complexity: 'Medium',
    nestedDepth: 2,
    rulesFound: 3,
    editableRules: 3,
    testsCovering: 3,
    sourceFiles: ['LNRULES.cbl'],
  },
};

export default function AnalysisPage() {
  const [selectedId, setSelectedId] = useState<string>('hard-decline-rules');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set([
      'root',
      'ratio-calculations',
      'hard-decline-rules',
      'down-payment-rule',
      'risk-grade-rule',
      'final-decision',
      'apr-calculation',
    ])
  );

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderNode = (node: CobolLogicNode, depth: number = 0): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer transition-colors ${
            isSelected
              ? 'bg-accent-blue/20 border border-accent-blue'
              : 'hover:bg-panel-bg-secondary'
          }`}
          style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(node.id);
            }
            if (node.id !== 'root') {
              setSelectedId(node.id);
            }
          }}
        >
          {hasChildren && (
            <span className="text-text-subtle text-sm w-4">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          {!hasChildren && <span className="w-4" />}
          <span
            className={`${
              isSelected ? 'text-accent-blue font-medium' : 'text-text-strong'
            }`}
          >
            {node.name}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child: CobolLogicNode) =>
              renderNode(child, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const selectedDetails = domainDetailsMap[selectedId];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-strong mb-2">
          Analysis Dashboard
        </h1>
        <p className="text-text-muted">
          {cobolSystemSummary.projectName} - COBOL Legacy System Analysis
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">COBOL Programs</div>
          <div className="text-3xl font-bold text-text-strong">
            {cobolSystemSummary.programs}
          </div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Logic Domains</div>
          <div className="text-3xl font-bold text-text-strong">
            {cobolLogicHierarchy.children?.length || 0}
          </div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Business Rules</div>
          <div className="text-3xl font-bold text-text-strong">
            {cobolSystemSummary.totalRules}
          </div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Nested Rules</div>
          <div className="text-3xl font-bold text-text-strong">
            {cobolSystemSummary.nestedRules}
          </div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Max Nesting</div>
          <div className="text-3xl font-bold text-warning-yellow">
            {cobolSystemSummary.maxNestingDepth}
          </div>
        </div>
      </div>

      {/* Main Content: Hierarchy + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Hierarchy */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold text-text-strong mb-4">
            COBOL Business Logic Hierarchy
          </h2>
          <div className="space-y-1">{renderNode(cobolLogicHierarchy)}</div>
        </div>

        {/* Right: Details Panel */}
        <div className="card">
          <h2 className="text-xl font-semibold text-text-strong mb-4">
            Domain Details
          </h2>
          {selectedDetails ? (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-text-subtle mb-1">Domain</div>
                <div className="text-lg font-semibold text-text-strong">
                  {selectedDetails.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-text-subtle mb-1">
                    Complexity
                  </div>
                  <div
                    className={`font-semibold ${
                      selectedDetails.complexity === 'High'
                        ? 'text-warning-yellow'
                        : selectedDetails.complexity === 'Medium'
                        ? 'text-accent-blue'
                        : 'text-success-green'
                    }`}
                  >
                    {selectedDetails.complexity}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-subtle mb-1">
                    Nested Depth
                  </div>
                  <div className="font-semibold text-text-strong">
                    {selectedDetails.nestedDepth} levels
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-text-subtle mb-1">
                    Rules Found
                  </div>
                  <div className="font-semibold text-text-strong">
                    {selectedDetails.rulesFound}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-subtle mb-1">
                    Editable Rules
                  </div>
                  <div className="font-semibold text-accent-blue">
                    {selectedDetails.editableRules}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-text-subtle mb-1">
                  Tests Covering This Domain
                </div>
                <div className="font-semibold text-success-green">
                  {selectedDetails.testsCovering}
                </div>
              </div>

              <div>
                <div className="text-sm text-text-subtle mb-2">
                  Source Files
                </div>
                <div className="space-y-1">
                  {selectedDetails.sourceFiles.map((file) => (
                    <div
                      key={file}
                      className="text-sm text-text-strong bg-panel-bg-secondary px-2 py-1 rounded font-mono"
                    >
                      {file}
                    </div>
                  ))}
                </div>
              </div>

              {selectedDetails.rules && selectedDetails.rules.length > 0 && (
                <div>
                  <div className="text-sm text-text-subtle mb-2">
                    Rules in This Domain
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedDetails.rules.map((rule) => (
                      <div
                        key={rule.id}
                        className="text-xs bg-panel-bg-secondary p-2 rounded"
                      >
                        <div className="font-semibold text-text-strong mb-1">
                          {rule.name}
                        </div>
                        <div className="text-text-muted font-mono">
                          {rule.condition}
                        </div>
                        {rule.reasonText && (
                          <div className="text-text-subtle mt-1 italic">
                            {rule.reasonText}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-text-muted text-sm">
              Select a domain to view details
            </div>
          )}
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Complexity Map */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-strong mb-3">
            Complexity Map
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">High Complexity</span>
              <span className="text-sm font-medium text-warning-yellow">
                Hard Decline Rules, Risk Grade
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Medium Complexity</span>
              <span className="text-sm font-medium text-accent-blue">
                APR Calculation, Final Decision
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Low Complexity</span>
              <span className="text-sm font-medium text-success-green">
                Ratio Calculations
              </span>
            </div>
          </div>
        </div>

        {/* Test Coverage */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-strong mb-3">
            Test Coverage
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Sample Applicants</span>
              <span className="text-sm font-medium text-text-strong">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Approved</span>
              <span className="text-sm font-medium text-success-green">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Manual Review</span>
              <span className="text-sm font-medium text-warning-yellow">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Declined</span>
              <span className="text-sm font-medium text-error-red">5</span>
            </div>
          </div>
        </div>

        {/* Modernization Readiness */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-strong mb-3">
            Modernization Readiness
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">COBOL Programs</span>
              <span className="text-sm font-medium text-text-strong">
                {cobolSystemSummary.programs}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Loan Types</span>
              <span className="text-sm font-medium text-accent-blue">
                {cobolSystemSummary.loanTypes.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Risk Grades</span>
              <span className="text-sm font-medium text-warning-yellow">
                {cobolSystemSummary.riskGrades.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Decision Types</span>
              <span className="text-sm font-medium text-success-green">
                {cobolSystemSummary.decisionTypes.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Open Visual Editor Button */}
      <div className="text-center">
        <a href="/editor" className="btn-primary inline-block">
          Open Visual Editor
        </a>
      </div>
    </div>
  );
}

// Made with Bob
