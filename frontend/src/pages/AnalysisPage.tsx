import { useState } from 'react';

interface LogicNode {
  id: string;
  name: string;
  children?: LogicNode[];
}

interface DomainDetails {
  name: string;
  complexity: string;
  nestedDepth: number;
  rulesFound: number;
  editableRules: number;
  testsCovering: number;
  sourceFiles: string[];
}

const mockHierarchy: LogicNode = {
  id: 'root',
  name: 'Credit Decision Engine',
  children: [
    {
      id: 'applicant',
      name: 'Applicant Eligibility',
      children: [
        { id: 'identity', name: 'Identity Verification' },
        { id: 'age', name: 'Age Requirement' },
        { id: 'residency', name: 'Residency Rule' },
      ],
    },
    {
      id: 'risk',
      name: 'Risk Assessment',
      children: [
        { id: 'credit-score', name: 'Credit Score Evaluation' },
        { id: 'debt-ratio', name: 'Debt-to-Income Ratio' },
        { id: 'fraud', name: 'Fraud Signal Check' },
        { id: 'manual-review', name: 'Manual Review Trigger' },
      ],
    },
    {
      id: 'pricing',
      name: 'Pricing & Offer Calculation',
      children: [
        { id: 'base-apr', name: 'Base APR Calculation' },
        { id: 'risk-adj', name: 'Risk Adjustment' },
        { id: 'loyalty', name: 'Loyalty Discount' },
      ],
    },
    {
      id: 'routing',
      name: 'Final Decision Routing',
      children: [
        { id: 'approval', name: 'Approval Path' },
        { id: 'rejection', name: 'Rejection Path' },
        { id: 'manual', name: 'Manual Review Path' },
      ],
    },
  ],
};

const domainDetailsMap: Record<string, DomainDetails> = {
  risk: {
    name: 'Risk Assessment',
    complexity: 'High',
    nestedDepth: 3,
    rulesFound: 12,
    editableRules: 4,
    testsCovering: 5,
    sourceFiles: [
      'CreditApprovalService.java',
      'RiskScoringService.java',
      'FraudCheckService.java',
      'credit-rules.xml',
    ],
  },
  applicant: {
    name: 'Applicant Eligibility',
    complexity: 'Low',
    nestedDepth: 2,
    rulesFound: 8,
    editableRules: 3,
    testsCovering: 3,
    sourceFiles: ['ApplicantService.java', 'eligibility-rules.xml'],
  },
  pricing: {
    name: 'Pricing & Offer Calculation',
    complexity: 'Medium',
    nestedDepth: 2,
    rulesFound: 10,
    editableRules: 2,
    testsCovering: 4,
    sourceFiles: ['PricingService.java', 'pricing-rules.xml'],
  },
  routing: {
    name: 'Final Decision Routing',
    complexity: 'Low',
    nestedDepth: 2,
    rulesFound: 8,
    editableRules: 1,
    testsCovering: 2,
    sourceFiles: ['DecisionRouter.java', 'routing-rules.xml'],
  },
};

export default function AnalysisPage() {
  const [selectedId, setSelectedId] = useState<string>('risk');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(['root', 'applicant', 'risk', 'pricing', 'routing'])
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

  const renderNode = (node: LogicNode, depth: number = 0): JSX.Element => {
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
            {node.children!.map((child) => renderNode(child, depth + 1))}
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
          Nested business logic hierarchy and complexity analysis
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Files Scanned</div>
          <div className="text-3xl font-bold text-text-strong">143</div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Logic Domains</div>
          <div className="text-3xl font-bold text-text-strong">5</div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Rules</div>
          <div className="text-3xl font-bold text-text-strong">38</div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Nested Flows</div>
          <div className="text-3xl font-bold text-text-strong">9</div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Tests Detected</div>
          <div className="text-3xl font-bold text-success-green">7</div>
        </div>
      </div>

      {/* Main Content: Hierarchy + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Hierarchy */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold text-text-strong mb-4">
            Business Logic Hierarchy
          </h2>
          <div className="space-y-1">{renderNode(mockHierarchy)}</div>
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
                Risk Assessment
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Medium Complexity</span>
              <span className="text-sm font-medium text-accent-blue">
                Pricing & Offer Calculation
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Low Complexity</span>
              <span className="text-sm font-medium text-success-green">
                Applicant Eligibility
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
              <span className="text-sm text-text-muted">Tests Detected</span>
              <span className="text-sm font-medium text-text-strong">7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Passing</span>
              <span className="text-sm font-medium text-success-green">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Failing</span>
              <span className="text-sm font-medium text-error-red">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Warning</span>
              <span className="text-sm font-medium text-warning-yellow">1</span>
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
              <span className="text-sm text-text-muted">Rule Extraction</span>
              <span className="text-sm font-medium text-success-green">
                Ready
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Visual Flow</span>
              <span className="text-sm font-medium text-success-green">
                Ready
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Editable Rules</span>
              <span className="text-sm font-medium text-accent-blue">4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Report Generation</span>
              <span className="text-sm font-medium text-success-green">
                Ready
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
