import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Maximize2, Minimize2, Workflow } from 'lucide-react';
import PageHeader from '../components/workflow/PageHeader';
import { useWorkflow } from '../workflow/WorkflowContext';
import {
  BLTM_PROJECT_CHANGED,
  projectDisplayName,
  readProjectSession,
} from '../workflow/projectSession';
import {
  LOAN_APPROVALS_DEFAULT_EXPANDED,
  LOAN_APPROVALS_DOMAIN_DETAILS,
  LOAN_APPROVALS_HIERARCHY_BASE,
  LOAN_APPROVALS_LEAF_TO_DOMAIN,
  type AnalysisLogicNode,
} from '../data/analysisLoanApprovalsCobol';
import {
  EDITOR_LOAN_APPROVALS_FLOW_DEFINITIONS,
  type EditorFlowNodeData,
} from '../data/editorLoanApprovalsGraph';
import { EDITOR_DOMAIN_DESCRIPTION, EDITOR_LEAF_BUSINESS_MEANING } from '../data/editorInspectorCopy';
import {
  buildEditorEditableRulesInitial,
  prescreenGateLabel,
  technicalExpressionFor,
  type EditorEditableRule,
} from '../data/editorPrescreenRules';
import {
  ReactFlow,
  Node,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  useReactFlow,
  NodeProps,
  Handle,
  Position,
  ReactFlowProvider,
  useViewport,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

type FlowNodeData = EditorFlowNodeData;
type EditableRule = EditorEditableRule;

function mergeEditableRuleLabels(
  nodeList: Node<FlowNodeData>[],
  rules: Record<string, EditableRule>,
): Node<FlowNodeData>[] {
  return nodeList.map((node) => {
    const d = node.data as FlowNodeData;
    if (!d.ruleId) return node;
    const rule = rules[d.ruleId];
    if (!rule) return node;
    return {
      ...node,
      data: {
        ...d,
        label: prescreenGateLabel(rule.id, rule.threshold),
        isModified: rule.threshold !== rule.originalThreshold,
      },
    };
  });
}

function thresholdFieldLabel(ruleId: string): string {
  switch (ruleId) {
    case 'gate-dti':
      return 'Editable threshold (%)';
    case 'gate-credit':
    case 'gate-risk-floor':
      return 'Editable threshold (minimum score)';
    case 'gate-lti':
      return 'Editable threshold (max multiple × income)';
    case 'gate-emp':
      return 'Editable threshold (months)';
    case 'gate-bk':
      return 'Editable threshold (years)';
    case 'gate-del':
      return 'Editable threshold (max count)';
    case 'gate-down-mt':
      return 'Editable threshold (%, mortgage minimum down)';
    default:
      return 'Editable threshold';
  }
}

/** Human-readable role for the pill on each graph node (internal `type` drives styling only). */
function nodeRoleLabel(kind: FlowNodeData['type']): string {
  switch (kind) {
    case 'domain':
      return 'Domain';
    case 'start':
      return 'Start';
    case 'decision':
      return 'Check';
    case 'output':
      return 'Outcome';
    default:
      return 'Step';
  }
}

/** Bright border + tint per semantic type; pill uses matching accent so type reads at a glance. */
function nodeTypeChrome(
  kind: FlowNodeData['type'],
  nodeId: string,
): { card: string; pill: string } {
  if (kind === 'output' && nodeId.startsWith('hd-fail-')) {
    return {
      card: 'border-2 border-live-rose bg-live-rose/[0.12] shadow-[0_0_14px_-3px_rgba(251,113,133,0.55)]',
      pill: 'font-semibold uppercase tracking-wide text-live-rose',
    };
  }
  if (kind === 'output') {
    return {
      card: 'border-2 border-success-green bg-success-green/[0.12] shadow-[0_0_14px_-3px_rgba(34,197,94,0.45)]',
      pill: 'font-semibold uppercase tracking-wide text-success-green',
    };
  }
  switch (kind) {
    case 'domain':
      return {
        card: 'border-2 border-live-violet bg-live-violet/[0.12] shadow-[0_0_14px_-3px_rgba(192,132,252,0.45)]',
        pill: 'font-semibold uppercase tracking-wide text-live-violet',
      };
    case 'start':
      return {
        card: 'border-2 border-ibm-blue bg-ibm-blue/[0.14] shadow-[0_0_14px_-3px_rgba(15,98,254,0.5)]',
        pill: 'font-semibold uppercase tracking-wide text-live-sky',
      };
    case 'decision':
      return {
        card: 'border-2 border-live-cyan bg-live-cyan/[0.11] shadow-[0_0_14px_-3px_rgba(34,211,238,0.5)]',
        pill: 'font-semibold uppercase tracking-wide text-live-cyan',
      };
    case 'action':
    default:
      return {
        card: 'border-2 border-review-orange bg-review-orange/[0.11] shadow-[0_0_14px_-3px_rgba(249,115,22,0.45)]',
        pill: 'font-semibold uppercase tracking-wide text-review-orange',
      };
  }
}

type EditorInspectorPanel =
  | {
      mode: 'domain';
      name: string;
      flow: string;
      typeLabel: string;
      description: string;
    }
  | {
      mode: 'step';
      name: string;
      parentName: string;
      flow: string;
      typeLabel: string;
      businessMeaning: string;
    };

const handleClass = '!h-2.5 !w-2.5 !border-0 !bg-live-sky';

// Custom graph node: handles + width tuned so labels can wrap (domain flows use long leaf titles).
function BusinessNode({ id, data, selected }: NodeProps<Node<FlowNodeData>>) {
  const nodeData = data as FlowNodeData;
  const role = nodeRoleLabel(nodeData.type);
  const { card: tone, pill: pillClass } = nodeTypeChrome(nodeData.type, id);
  const layout = nodeData.prescreenHandleLayout;

  const handles =
    layout === 'decline-in' ? (
      <Handle id="in" type="target" position={Position.Right} className={handleClass} />
    ) : layout === 'pass-in' ? (
      <Handle id="in" type="target" position={Position.Top} className={handleClass} />
    ) : layout === 'gate' ? (
      <>
        <Handle id="in" type="target" position={Position.Top} className={handleClass} />
        <Handle id="yes" type="source" position={Position.Bottom} className={handleClass} />
        <Handle
          id="no"
          type="source"
          position={Position.Left}
          className={`${handleClass} !left-0 !top-1/2 !-translate-y-1/2`}
        />
      </>
    ) : (
      <>
        <Handle id="in" type="target" position={Position.Top} className={handleClass} />
        <Handle id="out" type="source" position={Position.Bottom} className={handleClass} />
      </>
    );

  return (
    <div
      className={`relative box-border min-h-[58px] w-[280px] max-w-[280px] rounded-lg shadow-sm transition-[box-shadow,ring] ${tone} ${
        selected ? 'z-10 ring-2 ring-live-cyan ring-offset-2 ring-offset-panel-bg' : ''
      }`}
      title={nodeData.childFlowId ? 'Double-click or zoom in to open this area' : undefined}
    >
      {handles}
      <div className="flex min-h-[42px] flex-col px-2.5 py-1.5">
        <div className="flex shrink-0 items-center justify-between gap-1">
          <span className={`truncate text-[10px] ${pillClass}`}>{role}</span>
          <div className="flex shrink-0 items-center gap-1">
            {nodeData.isModified ? (
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-live-sky"
                title="Rule changed from original"
                aria-label="Modified"
              />
            ) : null}
            {nodeData.childFlowId ? (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-live-sky opacity-90" aria-hidden />
            ) : null}
          </div>
        </div>
        <div className="mt-0.5 whitespace-normal break-words text-left text-[12px] font-medium leading-snug text-text-strong">
          {nodeData.label}
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  business: BusinessNode,
};

const flowDefinitions = EDITOR_LOAN_APPROVALS_FLOW_DEFINITIONS;

function EditorPageInner() {
  const navigate = useNavigate();
  const { unlockTo } = useWorkflow();
  const [projectName, setProjectName] = useState(() => projectDisplayName(readProjectSession()));
  const [currentFlowId, setCurrentFlowId] = useState<string>('root');
  const [breadcrumb, setBreadcrumb] = useState<Array<{ id: string; name: string }>>(() => [
    { id: 'root', name: projectDisplayName(readProjectSession()) },
  ]);

  const ruleTree = useMemo<AnalysisLogicNode>(
    () => ({ ...LOAN_APPROVALS_HIERARCHY_BASE, name: projectName }),
    [projectName],
  );
  
  const currentFlow = flowDefinitions[currentFlowId] || flowDefinitions.root;
  const [nodes, setNodes, onNodesChange] = useNodesState(currentFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentFlow.edges);
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>('root');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [expandedTreeIds, setExpandedTreeIds] = useState<Set<string>>(
    () => new Set(LOAN_APPROVALS_DEFAULT_EXPANDED),
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const semanticZoomTriggeredRef = useRef(false);
  
  // Rule editing state — eight keys aligned with Analysis `editableRules` (6 + 1 + 1)
  const [editableRules, setEditableRules] = useState<Record<string, EditableRule>>(() =>
    buildEditorEditableRulesInitial(),
  );
  const editableRulesRef = useRef(editableRules);
  editableRulesRef.current = editableRules;
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loanRuleAppliedForDemo, setLoanRuleAppliedForDemo] = useState(false);

  const { fitView } = useReactFlow();
  const { zoom } = useViewport();

  const SEMANTIC_ZOOM_THRESHOLD = 1.65;

  useEffect(() => {
    const resetEditorForNewProject = () => {
      const name = projectDisplayName(readProjectSession());
      setProjectName(name);
      setCurrentFlowId('root');
      setBreadcrumb([{ id: 'root', name }]);
      setSelectedTreeId('root');
      setSelectedNodeId(null);
      setExpandedTreeIds(new Set(LOAN_APPROVALS_DEFAULT_EXPANDED));
      setEditableRules(buildEditorEditableRulesInitial());
      setLoanRuleAppliedForDemo(false);
      setSuccessMessage('');
    };
    window.addEventListener(BLTM_PROJECT_CHANGED, resetEditorForNewProject);
    return () => window.removeEventListener(BLTM_PROJECT_CHANGED, resetEditorForNewProject);
  }, []);

  // Update nodes/edges when flow changes (merge rule labels from ref so keys match graph `ruleId`s)
  useEffect(() => {
    const flow = flowDefinitions[currentFlowId] || flowDefinitions.root;
    setNodes(mergeEditableRuleLabels(flow.nodes, editableRulesRef.current));
    setEdges(flow.edges);
    setIsTransitioning(true);
    setTimeout(() => {
      fitView({ padding: 0.28, duration: 300 });
      setTimeout(() => {
        setIsTransitioning(false);
        semanticZoomTriggeredRef.current = false;
      }, 350);
    }, 50);
  }, [currentFlowId, setNodes, setEdges, fitView]);

  // Live-update labels when thresholds change (without re-running fitView)
  useEffect(() => {
    setNodes((nds) => mergeEditableRuleLabels(nds, editableRules));
  }, [editableRules, setNodes]);

  useEffect(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === selectedNodeId })));
  }, [selectedNodeId, setNodes]);

  // Semantic zoom behavior
  useEffect(() => {
    if (isTransitioning || semanticZoomTriggeredRef.current) return;
    if (zoom < SEMANTIC_ZOOM_THRESHOLD) {
      semanticZoomTriggeredRef.current = false;
      return;
    }

    // Only trigger if selected node has childFlowId
    if (selectedNodeId) {
      const selectedNode = nodes.find((n) => n.id === selectedNodeId);
      if (selectedNode) {
        const nodeData = selectedNode.data as FlowNodeData;
        if (nodeData.childFlowId && flowDefinitions[nodeData.childFlowId]) {
          semanticZoomTriggeredRef.current = true;
          navigateToFlow(nodeData.childFlowId, nodeData.label);
        }
      }
    }
  }, [zoom, selectedNodeId, nodes, isTransitioning]);

  // Reset semantic zoom trigger when selection changes
  useEffect(() => {
    semanticZoomTriggeredRef.current = false;
  }, [selectedNodeId]);

  useEffect(() => {
    if (!isEditorMaximized) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isEditorMaximized]);

  useEffect(() => {
    if (!isEditorMaximized) return;
    const id = window.setTimeout(() => {
      fitView({ padding: 0.18, duration: 250 });
    }, 80);
    return () => window.clearTimeout(id);
  }, [isEditorMaximized, fitView]);

  useEffect(() => {
    if (!isEditorMaximized) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsEditorMaximized(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isEditorMaximized]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const toggleTreeExpand = (id: string) => {
    const newExpanded = new Set(expandedTreeIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTreeIds(newExpanded);
  };

  const navigateToFlow = (flowId: string, flowName: string, selectNodeId?: string | null) => {
    if (!flowDefinitions[flowId]) return;
    setCurrentFlowId(flowId);
    const newBreadcrumb = [...breadcrumb];
    const existingIndex = newBreadcrumb.findIndex((b) => b.id === flowId);
    if (existingIndex >= 0) {
      newBreadcrumb.splice(existingIndex + 1);
    } else {
      newBreadcrumb.push({ id: flowId, name: flowName });
    }
    setBreadcrumb(newBreadcrumb);
    if (selectNodeId) {
      setSelectedNodeId(selectNodeId);
      setSelectedTreeId(selectNodeId);
    } else {
      setSelectedNodeId(null);
      setSelectedTreeId(flowId === 'root' ? 'root' : flowId);
    }
  };

  const updateRuleThreshold = (ruleId: string, newThreshold: number) => {
    setEditableRules((prev) => ({
      ...prev,
      [ruleId]: {
        ...prev[ruleId],
        threshold: newThreshold,
        technicalExpression: technicalExpressionFor(ruleId, newThreshold),
      },
    }));
  };

  const applyRuleChange = (ruleId: string) => {
    const rule = editableRules[ruleId];
    if (!rule) return;

    setSuccessMessage(
      `${rule.name}: threshold ${rule.originalThreshold} → ${rule.threshold} (${rule.technicalExpression})`,
    );
    if (ruleId === 'gate-dti') {
      setLoanRuleAppliedForDemo(true);
    }
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const revertRuleChange = (ruleId: string) => {
    const rule = editableRules[ruleId];
    if (!rule) return;

    const orig = rule.originalThreshold;
    setEditableRules((prev) => ({
      ...prev,
      [ruleId]: {
        ...prev[ruleId],
        threshold: orig,
        technicalExpression: technicalExpressionFor(ruleId, orig),
      },
    }));

    setSuccessMessage('');
    if (ruleId === 'gate-dti') {
      setLoanRuleAppliedForDemo(false);
    }
  };

  const handleTreeClick = (node: AnalysisLogicNode) => {
    setSelectedTreeId(node.id);

    if (flowDefinitions[node.id]) {
      navigateToFlow(node.id, node.name);
      return;
    }

    const parentDomain = LOAN_APPROVALS_LEAF_TO_DOMAIN[node.id];
    if (parentDomain && flowDefinitions[parentDomain]) {
      const parentName = LOAN_APPROVALS_DOMAIN_DETAILS[parentDomain]?.name ?? parentDomain;
      if (currentFlowId !== parentDomain) {
        navigateToFlow(parentDomain, parentName, node.id);
      } else {
        setSelectedNodeId(node.id);
        setSelectedTreeId(node.id);
      }
      return;
    }

    setSelectedNodeId(null);
  };

  const renderTreeNode = (node: AnalysisLogicNode, depth: number = 0): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedTreeIds.has(node.id);
    const isSelected = selectedTreeId === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors text-sm ${
            isSelected
              ? 'bg-accent-blue/20 border border-accent-blue'
              : 'hover:bg-panel-bg-secondary'
          }`}
          style={{ paddingLeft: `${depth * 1 + 0.5}rem` }}
          onClick={() => {
            if (hasChildren) {
              toggleTreeExpand(node.id);
            }
            handleTreeClick(node);
          }}
        >
          {hasChildren && (
            <span className="text-text-subtle text-xs w-3">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          {!hasChildren && <span className="w-3" />}
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
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const getInspectorPanel = (): EditorInspectorPanel | null => {
    const findTreeNode = (tree: AnalysisLogicNode, id: string): AnalysisLogicNode | null => {
      if (tree.id === id) return tree;
      for (const c of tree.children ?? []) {
        const f = findTreeNode(c, id);
        if (f) return f;
      }
      return null;
    };

    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (!node) return null;
      const nodeData = node.data as FlowNodeData;
      const isEditableHere = Boolean(nodeData.isEditable && nodeData.ruleId);

      if (currentFlowId === 'hard-decline' && selectedNodeId.startsWith('hd-fail-')) {
        const leafId = selectedNodeId.replace(/^hd-fail-/, '');
        const pd = LOAN_APPROVALS_DOMAIN_DETAILS['hard-decline'];
        const meaning =
          (EDITOR_LEAF_BUSINESS_MEANING[leafId] ?? '') +
          ' On the graph, the red “No” edge from this check leads here: the batch records a hard decline for this reason.';
        return {
          mode: 'step',
          name: nodeData.label,
          parentName: pd?.name ?? 'Hard prescreen rules',
          flow: projectName,
          typeLabel: 'Outcome',
          businessMeaning: meaning.trim() || 'Decline path for this prescreen gate.',
        };
      }

      if (selectedNodeId === 'hard-prescreen-pass') {
        const pd = LOAN_APPROVALS_DOMAIN_DETAILS['hard-decline'];
        return {
          mode: 'step',
          name: nodeData.label,
          parentName: pd?.name ?? 'Hard prescreen rules',
          flow: projectName,
          typeLabel: 'Outcome',
          businessMeaning:
            'Every prescreen gate answered Yes in order, so the sample program continues to down payment, risk grade, and final decision (see LNRULES after `3000-HARD-DECLINE-RULES`).',
        };
      }

      if (currentFlowId === 'root' && LOAN_APPROVALS_DOMAIN_DETAILS[selectedNodeId]) {
        const d = LOAN_APPROVALS_DOMAIN_DETAILS[selectedNodeId];
        return {
          mode: 'domain',
          name: d.name,
          flow: projectName,
          typeLabel: 'Logic domain',
          description:
            EDITOR_DOMAIN_DESCRIPTION[selectedNodeId] ??
            'Part of the loan-approval batch in the sample legacy project.',
        };
      }

      if (currentFlowId !== 'root' && !isEditableHere) {
        const pd = LOAN_APPROVALS_DOMAIN_DETAILS[currentFlowId];
        const parentName = pd?.name ?? currentFlowId;
        const meaning =
          EDITOR_LEAF_BUSINESS_MEANING[selectedNodeId] ??
          'Standard step in this area of the policy path for the sample program.';
        return {
          mode: 'step',
          name: nodeData.label,
          parentName,
          flow: projectName,
          typeLabel: nodeRoleLabel(nodeData.type),
          businessMeaning: meaning,
        };
      }

      return null;
    }

    if (selectedTreeId && selectedTreeId !== 'root') {
      const domainD = LOAN_APPROVALS_DOMAIN_DETAILS[selectedTreeId];
      if (domainD) {
        return {
          mode: 'domain',
          name: domainD.name,
          flow: projectName,
          typeLabel: 'Logic domain',
          description:
            EDITOR_DOMAIN_DESCRIPTION[selectedTreeId] ??
            'Part of the loan-approval batch in the sample legacy project.',
        };
      }

      const leafParent = LOAN_APPROVALS_LEAF_TO_DOMAIN[selectedTreeId];
      const treeNode = findTreeNode(ruleTree, selectedTreeId);
      if (treeNode && leafParent) {
        const pd = LOAN_APPROVALS_DOMAIN_DETAILS[leafParent];
        return {
          mode: 'step',
          name: treeNode.name,
          parentName: pd?.name ?? leafParent,
          flow: projectName,
          typeLabel: 'Business step',
          businessMeaning:
            EDITOR_LEAF_BUSINESS_MEANING[selectedTreeId] ??
            'Standard step in this area of the policy path for the sample program.',
        };
      }
    }
    return null;
  };

  const inspectorPanel = getInspectorPanel();

  const cardShellClass = isEditorMaximized
    ? 'flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border-0 bg-panel-bg shadow-none'
    : 'flex min-h-[720px] h-[min(96dvh,calc(100dvh-12rem))] max-h-[calc(100dvh-7rem)] flex-col overflow-hidden rounded-xl border border-border bg-panel-bg shadow-sm';

  return (
    <div
      className={
        isEditorMaximized
          ? 'fixed inset-0 z-[1000] flex min-h-0 flex-col bg-app-bg'
          : 'flex flex-col gap-6'
      }
    >
      {!isEditorMaximized && (
        <PageHeader
          title="Visual business logic editor"
          tagline={`${projectName}—same logic hierarchy as Analysis (LNMAIN, LNRULES, LNRATE); tune the eight policy thresholds, then Modernize.`}
          Icon={Workflow}
        />
      )}
      <div className={cardShellClass}>
        <div className="shrink-0 border-b border-border bg-panel-bg-secondary">
          {isEditorMaximized ? (
            <h1 className="px-4 pt-4 pb-1 text-2xl font-bold tracking-tight text-text-strong sm:text-3xl">
              Visual business logic editor
            </h1>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <div
              className="flex min-w-0 flex-1 flex-wrap items-center gap-2 text-text-strong"
              aria-label="Location in hierarchy"
            >
              {breadcrumb.map((crumb, index) => (
                <div key={crumb.id} className="flex items-center gap-2">
                  {index > 0 && <span className="text-text-subtle">/</span>}
                  <button
                    type="button"
                    className={`font-medium transition-colors hover:text-accent-blue ${
                      index === breadcrumb.length - 1 ? 'text-accent-blue' : ''
                    }`}
                    onClick={() => {
                      if (index < breadcrumb.length - 1) {
                        navigateToFlow(crumb.id, crumb.name);
                      }
                    }}
                  >
                    {crumb.name}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {isEditorMaximized ? (
                <>
                  <button
                    type="button"
                    className="btn-primary px-3 py-1.5 text-sm"
                    onClick={() => {
                      unlockTo(4);
                      navigate('/modernization');
                    }}
                    title="Open modernization workspace"
                  >
                    Modernize
                  </button>
                  <button
                    type="button"
                    className="btn-secondary inline-flex items-center gap-2 px-3 py-1.5 text-sm"
                    onClick={() => setIsEditorMaximized(false)}
                    title="Exit fullscreen"
                  >
                    <Minimize2 className="h-4 w-4 shrink-0" aria-hidden />
                    Return
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-secondary inline-flex items-center justify-center p-2"
                  onClick={() => setIsEditorMaximized(true)}
                  title="Maximize editor"
                  aria-label="Maximize editor"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          {!isEditorMaximized && (
            <div className="flex flex-wrap items-center gap-2 border-t border-border/60 px-4 py-3">
              <button
                type="button"
                className="btn-primary px-3 py-1 text-sm"
                onClick={() => {
                  unlockTo(4);
                  navigate('/modernization');
                }}
                title="Open modernization workspace"
              >
                Modernize
              </button>
            </div>
          )}
        </div>

      {/* Main Content Area */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left Pane: Rule Tree */}
        <div className="w-64 overflow-y-auto border-r border-border bg-panel-bg-secondary custom-scrollbar">
          <div className="p-3">
            <h3 className="text-sm font-semibold text-text-strong mb-2">
              Business logic hierarchy
            </h3>
            <div className="space-y-0.5">{renderTreeNode(ruleTree)}</div>
          </div>
        </div>

        {/* Center: Graph Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            defaultEdgeOptions={{ labelShowBg: false }}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => {
              setSelectedNodeId(node.id);
              setSelectedTreeId(node.id);
            }}
            onNodeDoubleClick={(_, node) => {
              const nodeData = node.data as FlowNodeData;
              const childFlowId = nodeData.childFlowId;
              if (childFlowId && flowDefinitions[childFlowId]) {
                navigateToFlow(childFlowId, nodeData.label);
              }
            }}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            fitView
            className="bg-panel-bg"
            proOptions={{ hideAttribution: true }}
          >
            <Background className="bg-panel-bg" />
            <MiniMap
              className="bg-panel-bg-secondary border border-border"
              nodeColor="#0f62fe"
            />
          </ReactFlow>
        </div>

        {/* Right Pane: Inspector / Rule Editor */}
        <div className="w-80 overflow-y-auto border-l border-border bg-panel-bg-secondary custom-scrollbar">
          <div className="p-4">
            {(() => {
              // Check if selected node is editable
              const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
              const nodeData = selectedNode?.data as FlowNodeData | undefined;
              const isEditableNode = nodeData?.isEditable && nodeData?.ruleId;
              const rule = isEditableNode ? editableRules[nodeData.ruleId!] : null;

              if (isEditableNode && rule) {
                return (
                  <>
                    <h3 className="text-sm font-semibold text-text-strong mb-3">Rule</h3>
                    <div className="mb-3 rounded-md border border-accent-blue/30 bg-accent-blue/10 px-3 py-2 text-xs text-accent-blue">
                      This rule is the <span className="font-semibold">highlighted</span> node in the graph
                      {selectedNodeId ? ` (“${nodeData?.label ?? selectedNodeId}”).` : '.'}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-text-subtle mb-1">Name</div>
                        <div className="text-sm font-semibold text-text-strong">{rule.name}</div>
                      </div>

                      <div>
                        <div className="text-xs text-text-subtle mb-1">Parent</div>
                        <div className="text-sm text-text-muted">{rule.parentFlow}</div>
                      </div>

                      <div>
                        <div className="text-xs text-text-subtle mb-1">Business meaning</div>
                        <div className="text-sm leading-relaxed text-text-muted">{rule.businessMeaning}</div>
                      </div>

                      <div>
                        <div className="text-xs text-text-subtle mb-1">Technical expression</div>
                        <div className="text-xs font-mono bg-panel-bg px-2 py-1.5 rounded text-accent-blue">
                          {rule.technicalExpression}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-text-subtle mb-1 block">{thresholdFieldLabel(rule.id)}</label>
                        <input
                          type="number"
                          value={rule.threshold}
                          onChange={(e) => updateRuleThreshold(rule.id, parseInt(e.target.value, 10) || 0)}
                          className="w-full px-3 py-2 bg-panel-bg border border-border rounded text-sm text-text-strong focus:outline-none focus:border-accent-blue"
                        />
                      </div>

                      {loanRuleAppliedForDemo && rule.id === 'gate-dti' && rule.threshold === 45 && (
                        <div className="rounded-lg border border-live-sky/35 bg-live-sky/10 p-3 text-xs text-text-strong">
                          Max DTI is at demo value <strong>45%</strong>. Exit fullscreen if needed, then use{' '}
                          <strong>Modernize</strong> below the breadcrumb to continue.
                        </div>
                      )}

                      <div className="space-y-2 pt-2">
                        <button
                          className="w-full btn-primary text-sm py-2"
                          onClick={() => applyRuleChange(rule.id)}
                          disabled={rule.threshold === rule.originalThreshold}
                        >
                          Apply change
                        </button>
                        <button
                          className="w-full btn-secondary text-sm py-2"
                          onClick={() => revertRuleChange(rule.id)}
                          disabled={rule.threshold === rule.originalThreshold}
                        >
                          Revert
                        </button>
                      </div>

                      {successMessage ? (
                        <div className="p-3 bg-success-green/20 border border-success-green rounded">
                          <div className="text-xs text-success-green font-medium">✓ {successMessage}</div>
                        </div>
                      ) : null}
                    </div>
                  </>
                );
              }

              if (inspectorPanel?.mode === 'domain') {
                return (
                  <>
                    <h3 className="text-sm font-semibold text-text-strong mb-3">Inspector</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-text-subtle mb-1">Name</div>
                        <div className="text-sm font-medium text-text-strong">{inspectorPanel.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-subtle mb-1">Flow</div>
                        <div className="text-sm text-text-strong">{inspectorPanel.flow}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-subtle mb-1">Type</div>
                        <div className="text-sm text-text-strong">{inspectorPanel.typeLabel}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-subtle mb-1">Description</div>
                        <div className="text-sm leading-relaxed text-text-muted">{inspectorPanel.description}</div>
                      </div>
                    </div>
                  </>
                );
              }

              if (inspectorPanel?.mode === 'step') {
                return (
                  <>
                    <h3 className="text-sm font-semibold text-text-strong mb-3">Inspector</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-text-subtle mb-1">Name</div>
                        <div className="text-sm font-medium text-text-strong">{inspectorPanel.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-subtle mb-1">Parent</div>
                        <div className="text-sm text-text-muted">{inspectorPanel.parentName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-subtle mb-1">Flow</div>
                        <div className="text-sm text-text-strong">{inspectorPanel.flow}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-subtle mb-1">Type</div>
                        <div className="text-sm text-text-strong">{inspectorPanel.typeLabel}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-subtle mb-1">Business meaning</div>
                        <div className="text-sm leading-relaxed text-text-muted">
                          {inspectorPanel.businessMeaning}
                        </div>
                      </div>
                    </div>
                  </>
                );
              }

              return (
                <>
                  <h3 className="text-sm font-semibold text-text-strong mb-3">Inspector</h3>
                  <div className="text-sm text-text-muted">
                    Select a domain or step in the hierarchy or on the graph.
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <ReactFlowProvider>
      <EditorPageInner />
    </ReactFlowProvider>
  );
}
