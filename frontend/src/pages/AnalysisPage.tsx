import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import PageHeader from '../components/workflow/PageHeader';
import { useWorkflow } from '../workflow/WorkflowContext';
import {
  BLTM_PROJECT_CHANGED,
  projectDisplayName,
  readProjectSession,
} from '../workflow/projectSession';
import SyntaxCodeViewer from '../components/modernization/SyntaxCodeViewer';
import { LOAN_APPROVALS_LEAF_SNIPPETS } from '../data/analysisLeafSnippets';
import {
  LOAN_APPROVALS_DEFAULT_EXPANDED,
  LOAN_APPROVALS_DOMAIN_DETAILS,
  LOAN_APPROVALS_EDITABLE_RULES_TOTAL,
  LOAN_APPROVALS_HIERARCHY_BASE,
  LOAN_APPROVALS_LEAF_TO_DOMAIN,
  LOAN_APPROVALS_SUMMARY,
} from '../data/analysisLoanApprovalsCobol';

interface LogicNode {
  id: string;
  name: string;
  children?: LogicNode[];
}

interface DomainDetails {
  name: string;
  technicalTraceLines?: string[];
  complexity: string;
  nestedDepth: number;
  rulesFound: number;
  editableRules: number;
  sourceFiles: string[];
}

function resolveDomainDetails(selectedId: string): DomainDetails | undefined {
  const direct = LOAN_APPROVALS_DOMAIN_DETAILS[selectedId];
  if (direct) return direct;
  const parent = LOAN_APPROVALS_LEAF_TO_DOMAIN[selectedId];
  if (parent && LOAN_APPROVALS_DOMAIN_DETAILS[parent]) {
    return LOAN_APPROVALS_DOMAIN_DETAILS[parent];
  }
  return undefined;
}

function findNodeLabelById(tree: LogicNode, id: string): string | null {
  if (tree.id === id) return tree.name;
  for (const ch of tree.children ?? []) {
    const found = findNodeLabelById(ch, id);
    if (found) return found;
  }
  return null;
}

export default function AnalysisPage() {
  const [projectName, setProjectName] = useState(() => projectDisplayName(readProjectSession()));
  const [selectedId, setSelectedId] = useState<string>('hard-decline');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(LOAN_APPROVALS_DEFAULT_EXPANDED),
  );

  const hierarchy = useMemo<LogicNode>(
    () => ({ ...LOAN_APPROVALS_HIERARCHY_BASE, name: projectName }),
    [projectName],
  );

  useEffect(() => {
    const resetView = () => {
      setProjectName(projectDisplayName(readProjectSession()));
      setSelectedId('hard-decline');
      setExpandedIds(new Set(LOAN_APPROVALS_DEFAULT_EXPANDED));
    };
    window.addEventListener(BLTM_PROJECT_CHANGED, resetView);
    return () => window.removeEventListener(BLTM_PROJECT_CHANGED, resetView);
  }, []);

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

  const selectedDetails = resolveDomainDetails(selectedId);
  const navigate = useNavigate();
  const { unlockTo } = useWorkflow();

  const goToEditor = () => {
    unlockTo(3);
    navigate('/editor');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analysis dashboard"
        tagline={`Discovery for project ${projectName}—domains, depth, and readiness before the visual editor.`}
        Icon={LayoutDashboard}
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Files Scanned</div>
          <div className="text-3xl font-bold text-text-strong">{LOAN_APPROVALS_SUMMARY.filesScanned}</div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Logic Domains</div>
          <div className="text-3xl font-bold text-text-strong">{LOAN_APPROVALS_SUMMARY.logicDomains}</div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Policy rules</div>
          <div className="text-3xl font-bold text-text-strong">{LOAN_APPROVALS_SUMMARY.rulesFound}</div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Nested Flows</div>
          <div className="text-3xl font-bold text-text-strong">{LOAN_APPROVALS_SUMMARY.nestedFlows}</div>
        </div>
      </div>

      {/* Main Content: Hierarchy + Details (50/50 on large screens) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card min-w-0">
          <h2 className="text-xl font-semibold text-text-strong mb-4">
            Business Logic Hierarchy
          </h2>
          <div className="space-y-1">{renderNode(hierarchy)}</div>
        </div>

        <div className="card min-w-0">
          {(() => {
            const leafSnippet = LOAN_APPROVALS_LEAF_SNIPPETS[selectedId];
            const isDomainRow = Boolean(LOAN_APPROVALS_DOMAIN_DETAILS[selectedId]);
            const stepLabel = findNodeLabelById(hierarchy, selectedId);
            const parentId = LOAN_APPROVALS_LEAF_TO_DOMAIN[selectedId];
            const parentName =
              parentId && LOAN_APPROVALS_DOMAIN_DETAILS[parentId]
                ? LOAN_APPROVALS_DOMAIN_DETAILS[parentId].name
                : null;
            const showLeafExcerpt = Boolean(leafSnippet && stepLabel && !isDomainRow);

            if (showLeafExcerpt && leafSnippet && stepLabel) {
              return (
                <>
                  <h2 className="text-xl font-semibold text-text-strong mb-1">Source excerpt</h2>
                  {parentName ? (
                    <p className="mb-3 text-xs text-text-subtle">
                      Part of domain: <span className="font-medium text-text-muted">{parentName}</span>
                    </p>
                  ) : (
                    <div className="mb-3" />
                  )}
                  <div className="flex min-h-[280px] min-w-0 flex-1 flex-col">
                    <SyntaxCodeViewer
                      title={stepLabel}
                      filePath={leafSnippet.sourcePath}
                      content={leafSnippet.code}
                      snippetStartingFileLine={leafSnippet.sourceFirstLine}
                      highlightLineRange={{
                        start: leafSnippet.highlightStartLine,
                        end: leafSnippet.highlightEndLine,
                      }}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-text-subtle">
                    Line numbers match the sample repo files; highlighted ranges map each hierarchy step to COBOL
                    (excerpts may omit surrounding lines).
                  </p>
                </>
              );
            }

            if (selectedDetails) {
              return (
                <>
                  <h2 className="text-xl font-semibold text-text-strong mb-4">
                    Domain details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-text-subtle mb-1">Domain</div>
                      <div className="text-lg font-semibold text-text-strong">
                        {selectedDetails.name}
                      </div>
                      {selectedDetails.technicalTraceLines && selectedDetails.technicalTraceLines.length > 0 ? (
                        <div className="mt-3 rounded-md border border-border bg-panel-bg-secondary/80 px-3 py-3">
                          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-subtle">
                            Where this lives in COBOL
                          </div>
                          <ul className="list-disc space-y-1.5 pl-4 text-sm leading-snug text-text-primary">
                            {selectedDetails.technicalTraceLines.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-text-subtle mb-1">Complexity</div>
                        <div
                          className={`font-semibold ${
                            selectedDetails.complexity === 'High'
                              ? 'text-live-sky'
                              : selectedDetails.complexity === 'Medium'
                                ? 'text-accent-blue'
                                : 'text-success-green'
                          }`}
                        >
                          {selectedDetails.complexity}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-text-subtle mb-1">Nested depth</div>
                        <div className="font-semibold text-text-strong">
                          {selectedDetails.nestedDepth} levels
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-text-subtle mb-1">Rules found</div>
                        <div className="font-semibold text-text-strong">{selectedDetails.rulesFound}</div>
                      </div>
                      <div>
                        <div className="text-sm text-text-subtle mb-1">Editable rules</div>
                        <div className="font-semibold text-accent-blue">{selectedDetails.editableRules}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-text-subtle mb-2">Source files</div>
                      <div className="space-y-1">
                        {selectedDetails.sourceFiles.map((file) => (
                          <div
                            key={file}
                            className="rounded bg-panel-bg-secondary px-2 py-1 font-mono text-sm text-text-strong"
                          >
                            {file}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              );
            }

            return (
              <div className="text-text-muted text-sm">
                Select a domain or step in the hierarchy to view details or source.
              </div>
            );
          })()}
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complexity Map */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-strong mb-3">
            Complexity Map
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">High Complexity</span>
              <span className="text-sm font-medium text-live-sky">
                Hard prescreen, down payment, risk grade
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Medium Complexity</span>
              <span className="text-sm font-medium text-accent-blue">
                Final decision, interest rate (APR)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Low Complexity</span>
              <span className="text-sm font-medium text-success-green">
                Batch intake & reporting, prescreen metrics
              </span>
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
              <span className="text-sm font-medium text-accent-blue">
                {LOAN_APPROVALS_EDITABLE_RULES_TOTAL}
              </span>
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

      <div className="text-center">
        <button type="button" className="btn-primary inline-block" onClick={goToEditor}>
          Open visual editor
        </button>
      </div>
    </div>
  );
}

// Made with Bob
