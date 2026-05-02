import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  useReactFlow,
  NodeProps,
  useViewport,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface RuleTreeNode {
  id: string;
  name: string;
  children?: RuleTreeNode[];
}

interface TestResult {
  id: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  name: string;
}

interface FlowNodeData extends Record<string, unknown> {
  label: string;
  type: 'start' | 'domain' | 'decision' | 'action' | 'output';
  childFlowId?: string;
  description?: string;
}

// Custom Business Node Component
function BusinessNode({ data, selected }: NodeProps<Node<FlowNodeData>>) {
  const nodeData = data as FlowNodeData;
  const typeColors = {
    start: 'border-accent-blue bg-accent-blue/10',
    domain: 'border-accent-purple bg-accent-purple/10',
    decision: 'border-warning-yellow bg-warning-yellow/10',
    action: 'border-success-green bg-success-green/10',
    output: 'border-text-muted bg-panel-bg-secondary',
  };

  const typeLabels = {
    start: 'START',
    domain: 'DOMAIN',
    decision: 'DECISION',
    action: 'ACTION',
    output: 'OUTPUT',
  };

  return (
    <div
      className={`min-w-[200px] max-w-[240px] rounded border-2 transition-all ${
        typeColors[nodeData.type]
      } ${selected ? 'ring-2 ring-accent-blue shadow-lg' : ''}`}
    >
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-text-subtle uppercase tracking-wide">
            {typeLabels[nodeData.type]}
          </span>
          {nodeData.childFlowId && (
            <span className="text-[10px] text-accent-blue font-medium">▸ OPEN</span>
          )}
        </div>
        <div className="text-[13px] font-medium text-text-strong leading-tight">
          {nodeData.label}
        </div>
        {nodeData.childFlowId && selected && (
          <div className="mt-2 pt-2 border-t border-accent-blue/30">
            <div className="text-[10px] text-text-subtle">
              Double-click or zoom deeply to reveal child flow
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const nodeTypes = {
  business: BusinessNode,
};

const mockRuleTree: RuleTreeNode = {
  id: 'root',
  name: 'Credit Decision Engine',
  children: [
    { id: 'applicant', name: 'Applicant Eligibility' },
    {
      id: 'risk',
      name: 'Risk Assessment',
      children: [
        { id: 'credit-score', name: 'Credit Score Evaluation' },
        { id: 'debt-ratio', name: 'Debt-to-Income Ratio' },
        { id: 'fraud', name: 'Fraud Signal Check' },
      ],
    },
    { id: 'pricing', name: 'Pricing & Offer Calculation' },
    { id: 'routing', name: 'Final Decision Routing' },
  ],
};

// Flow definitions
const flowDefinitions: Record<string, { nodes: Node<FlowNodeData>[]; edges: Edge[] }> = {
  root: {
    nodes: [
      {
        id: 'n1',
        type: 'business',
        position: { x: 400, y: 50 },
        data: { label: 'Application Received', type: 'start' },
      },
      {
        id: 'n2',
        type: 'business',
        position: { x: 400, y: 180 },
        data: { label: 'Applicant Eligibility', type: 'action' },
      },
      {
        id: 'n3',
        type: 'business',
        position: { x: 400, y: 310 },
        data: { label: 'Risk Assessment', type: 'domain', childFlowId: 'risk' },
      },
      {
        id: 'n4',
        type: 'business',
        position: { x: 400, y: 440 },
        data: { label: 'Pricing & Offer Calculation', type: 'action' },
      },
      {
        id: 'n5',
        type: 'business',
        position: { x: 400, y: 570 },
        data: { label: 'Final Decision Routing', type: 'decision' },
      },
      {
        id: 'n6',
        type: 'business',
        position: { x: 400, y: 700 },
        data: { label: 'Decision Output', type: 'output' },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', type: 'smoothstep', animated: true, style: { stroke: '#0f62fe', strokeWidth: 2 } },
      { id: 'e2-3', source: 'n2', target: 'n3', type: 'smoothstep', animated: true, style: { stroke: '#0f62fe', strokeWidth: 2 } },
      { id: 'e3-4', source: 'n3', target: 'n4', type: 'smoothstep', animated: true, style: { stroke: '#0f62fe', strokeWidth: 2 } },
      { id: 'e4-5', source: 'n4', target: 'n5', type: 'smoothstep', animated: true, style: { stroke: '#0f62fe', strokeWidth: 2 } },
      { id: 'e5-6', source: 'n5', target: 'n6', type: 'smoothstep', animated: true, style: { stroke: '#0f62fe', strokeWidth: 2 } },
    ],
  },
  risk: {
    nodes: [
      {
        id: 'r1',
        type: 'business',
        position: { x: 400, y: 50 },
        data: { label: 'Start Risk Assessment', type: 'start' },
      },
      {
        id: 'r2',
        type: 'business',
        position: { x: 400, y: 180 },
        data: { label: 'Credit Score Evaluation', type: 'domain', childFlowId: 'credit-score' },
      },
      {
        id: 'r3',
        type: 'business',
        position: { x: 400, y: 310 },
        data: { label: 'Debt-to-Income Ratio Check', type: 'action' },
      },
      {
        id: 'r4',
        type: 'business',
        position: { x: 400, y: 440 },
        data: { label: 'Fraud Signal Check', type: 'action' },
      },
      {
        id: 'r5',
        type: 'business',
        position: { x: 400, y: 570 },
        data: { label: 'Risk Tier Assignment', type: 'action' },
      },
      {
        id: 'r6',
        type: 'business',
        position: { x: 400, y: 700 },
        data: { label: 'Manual Review Trigger?', type: 'decision' },
      },
      {
        id: 'r7',
        type: 'business',
        position: { x: 200, y: 830 },
        data: { label: 'Send to Manual Review', type: 'output' },
      },
      {
        id: 'r8',
        type: 'business',
        position: { x: 600, y: 830 },
        data: { label: 'Continue to Pricing', type: 'output' },
      },
    ],
    edges: [
      { id: 'er1-2', source: 'r1', target: 'r2', type: 'smoothstep', animated: true, style: { stroke: '#0f62fe', strokeWidth: 2 } },
      { id: 'er2-3', source: 'r2', target: 'r3', type: 'smoothstep', animated: true, style: { stroke: '#0f62fe', strokeWidth: 2 } },
      { id: 'er3-4', source: 'r3', target: 'r4', type: 'smoothstep', animated: true, style: { stroke: '#0f62fe', strokeWidth: 2 } },
      { id: 'er4-5', source: 'r4', target: 'r5', type: 'smoothstep', animated: true, style: { stroke: '#0f62fe', strokeWidth: 2 } },
      { id: 'er5-6', source: 'r5', target: 'r6', type: 'smoothstep', animated: true, style: { stroke: '#0f62fe', strokeWidth: 2 } },
      { id: 'er6-7', source: 'r6', target: 'r7', type: 'smoothstep', label: 'Yes', animated: true, style: { stroke: '#f1c21b', strokeWidth: 2 } },
      { id: 'er6-8', source: 'r6', target: 'r8', type: 'smoothstep', label: 'No', animated: true, style: { stroke: '#24a148', strokeWidth: 2 } },
    ],
  },
  'credit-score': {
    nodes: [
      {
        id: 'c1',
        type: 'business',
        position: { x: 400, y: 50 },
        data: { label: 'Read Credit Score', type: 'start' },
      },
      {
        id: 'c2',
        type: 'business',
        position: { x: 400, y: 180 },
        data: { label: 'Score Missing?', type: 'decision' },
      },
      {
        id: 'c3',
        type: 'business',
        position: { x: 200, y: 310 },
        data: { label: 'Manual Review', type: 'output' },
      },
      {
        id: 'c4',
        type: 'business',
        position: { x: 600, y: 310 },
        data: { label: 'Score >= 700?', type: 'decision' },
      },
      {
        id: 'c5',
        type: 'business',
        position: { x: 400, y: 440 },
        data: { label: 'High Risk Tier', type: 'output' },
      },
      {
        id: 'c6',
        type: 'business',
        position: { x: 800, y: 440 },
        data: { label: 'Score >= 760?', type: 'decision' },
      },
      {
        id: 'c7',
        type: 'business',
        position: { x: 1000, y: 570 },
        data: { label: 'Preferred Risk Tier', type: 'output' },
      },
      {
        id: 'c8',
        type: 'business',
        position: { x: 600, y: 570 },
        data: { label: 'Standard Risk Tier', type: 'output' },
      },
    ],
    edges: [
      { id: 'ec1-2', source: 'c1', target: 'c2', type: 'smoothstep', animated: true, style: { stroke: '#0f62fe', strokeWidth: 2 } },
      { id: 'ec2-3', source: 'c2', target: 'c3', type: 'smoothstep', label: 'Yes', animated: true, style: { stroke: '#da1e28', strokeWidth: 2 } },
      { id: 'ec2-4', source: 'c2', target: 'c4', type: 'smoothstep', label: 'No', animated: true, style: { stroke: '#0f62fe', strokeWidth: 2 } },
      { id: 'ec4-5', source: 'c4', target: 'c5', type: 'smoothstep', label: 'No', animated: true, style: { stroke: '#da1e28', strokeWidth: 2 } },
      { id: 'ec4-6', source: 'c4', target: 'c6', type: 'smoothstep', label: 'Yes', animated: true, style: { stroke: '#24a148', strokeWidth: 2 } },
      { id: 'ec6-7', source: 'c6', target: 'c7', type: 'smoothstep', label: 'Yes', animated: true, style: { stroke: '#24a148', strokeWidth: 2 } },
      { id: 'ec6-8', source: 'c6', target: 'c8', type: 'smoothstep', label: 'No', animated: true, style: { stroke: '#f1c21b', strokeWidth: 2 } },
    ],
  },
};

const mockTests: TestResult[] = [
  { id: 't1', status: 'PASS', name: 'Approve applicant with score 760' },
  { id: 't2', status: 'PASS', name: 'Approve applicant at threshold 680' },
  { id: 't3', status: 'FAIL', name: 'Reject applicant with fraud flag' },
  { id: 't4', status: 'WARN', name: 'Pricing test needs rerun' },
];

function EditorPageInner() {
  const [currentFlowId, setCurrentFlowId] = useState<string>('root');
  const [breadcrumb, setBreadcrumb] = useState<Array<{ id: string; name: string }>>([
    { id: 'root', name: 'Credit Decision Engine' },
  ]);
  
  const currentFlow = flowDefinitions[currentFlowId] || flowDefinitions.root;
  const [nodes, setNodes, onNodesChange] = useNodesState(currentFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentFlow.edges);
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>('root');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [activeTestTab, setActiveTestTab] = useState<string>('all');
  const [expandedTreeIds, setExpandedTreeIds] = useState<Set<string>>(
    new Set(['root', 'risk'])
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const semanticZoomTriggeredRef = useRef(false);

  const { fitView } = useReactFlow();
  const { zoom } = useViewport();

  const SEMANTIC_ZOOM_THRESHOLD = 1.65;

  // Update nodes/edges when flow changes
  useEffect(() => {
    const flow = flowDefinitions[currentFlowId] || flowDefinitions.root;
    setNodes(flow.nodes);
    setEdges(flow.edges);
    setIsTransitioning(true);
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
      setTimeout(() => {
        setIsTransitioning(false);
        semanticZoomTriggeredRef.current = false;
      }, 350);
    }, 50);
  }, [currentFlowId, setNodes, setEdges, fitView]);

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

  const navigateToFlow = (flowId: string, flowName: string) => {
    if (flowDefinitions[flowId]) {
      setCurrentFlowId(flowId);
      const newBreadcrumb = [...breadcrumb];
      const existingIndex = newBreadcrumb.findIndex((b) => b.id === flowId);
      if (existingIndex >= 0) {
        newBreadcrumb.splice(existingIndex + 1);
      } else {
        newBreadcrumb.push({ id: flowId, name: flowName });
      }
      setBreadcrumb(newBreadcrumb);
      setSelectedNodeId(null);
    }
  };

  const handleTreeClick = (node: RuleTreeNode) => {
    setSelectedTreeId(node.id);
    setSelectedNodeId(null);

    // Navigate to flow if it exists
    if (flowDefinitions[node.id]) {
      navigateToFlow(node.id, node.name);
    } else {
      // Focus on node in current flow
      const graphNode = nodes.find((n) => {
        const nodeData = n.data as FlowNodeData;
        return nodeData.label.toLowerCase().includes(node.name.toLowerCase());
      });
      if (graphNode) {
        setSelectedNodeId(graphNode.id);
      }
    }
  };

  const renderTreeNode = (node: RuleTreeNode, depth: number = 0): JSX.Element => {
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

  const getSelectedInfo = () => {
    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (node) {
        const nodeData = node.data as FlowNodeData;
        return {
          name: nodeData.label,
          flow: breadcrumb[breadcrumb.length - 1].name,
          type: nodeData.type,
          description: nodeData.description || 'Business logic node in the decision flow.',
          childFlowId: nodeData.childFlowId,
          sourceFiles: ['CreditService.java', 'business-rules.xml'],
          status: 'Active',
        };
      }
    }
    if (selectedTreeId && selectedTreeId !== 'root') {
      const findNode = (tree: RuleTreeNode): RuleTreeNode | null => {
        if (tree.id === selectedTreeId) return tree;
        if (tree.children) {
          for (const child of tree.children) {
            const found = findNode(child);
            if (found) return found;
          }
        }
        return null;
      };
      const treeNode = findNode(mockRuleTree);
      if (treeNode) {
        return {
          name: treeNode.name,
          flow: breadcrumb[breadcrumb.length - 1].name,
          type: 'domain',
          description: 'Business logic domain containing multiple decision rules.',
          childFlowId: flowDefinitions[treeNode.id] ? treeNode.id : undefined,
          sourceFiles: ['RuleService.java', 'domain-rules.xml'],
          status: 'Mapped',
        };
      }
    }
    return null;
  };

  const selectedInfo = getSelectedInfo();

  return (
    <div className="h-screen flex flex-col bg-panel-bg">
      {/* Top Toolbar */}
      <div className="bg-panel-bg-secondary border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-text-strong">
            {breadcrumb.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center gap-2">
                {index > 0 && <span className="text-text-subtle">/</span>}
                <button
                  className={`font-medium hover:text-accent-blue transition-colors ${
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
          <div className="flex gap-2">
            {breadcrumb.length > 1 && (
              <button
                className="btn-secondary text-sm px-3 py-1"
                onClick={() => {
                  const parent = breadcrumb[breadcrumb.length - 2];
                  navigateToFlow(parent.id, parent.name);
                }}
              >
                Back
              </button>
            )}
            <button
              className="btn-secondary text-sm px-3 py-1 font-semibold"
              onClick={() => {
                const reactFlow = useReactFlow();
                reactFlow.zoomIn({ duration: 300 });
              }}
              title="Zoom In"
            >
              Zoom In
            </button>
            <button
              className="btn-secondary text-sm px-3 py-1 font-semibold"
              onClick={() => {
                const reactFlow = useReactFlow();
                reactFlow.zoomOut({ duration: 300 });
              }}
              title="Zoom Out"
            >
              Zoom Out
            </button>
            <button
              className="btn-secondary text-sm px-3 py-1 font-semibold"
              onClick={() => fitView({ padding: 0.2, duration: 300 })}
              title="Fit View"
            >
              Fit View
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm px-3 py-1">Run Tests</button>
          <a href="/report" className="btn-primary text-sm px-3 py-1">
            Generate Report
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Rule Tree */}
        <div className="w-64 bg-panel-bg-secondary border-r border-border overflow-y-auto">
          <div className="p-3">
            <h3 className="text-sm font-semibold text-text-strong mb-2">
              Rule Hierarchy
            </h3>
            <div className="space-y-0.5">{renderTreeNode(mockRuleTree)}</div>
          </div>
        </div>

        {/* Center: Graph Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => {
              setSelectedNodeId(node.id);
              setSelectedTreeId(null);
            }}
            onNodeDoubleClick={(_, node) => {
              const nodeData = node.data as FlowNodeData;
              const childFlowId = nodeData.childFlowId;
              if (childFlowId && flowDefinitions[childFlowId]) {
                navigateToFlow(childFlowId, nodeData.label);
              }
            }}
            nodeTypes={nodeTypes}
            fitView
            className="bg-panel-bg"
          >
            <Controls className="bg-panel-bg-secondary border border-border" />
            <Background className="bg-panel-bg" />
            <MiniMap
              className="bg-panel-bg-secondary border border-border"
              nodeColor="#0f62fe"
            />
          </ReactFlow>
        </div>

        {/* Right Pane: Inspector */}
        <div className="w-80 bg-panel-bg-secondary border-l border-border overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-text-strong mb-3">
              Inspector
            </h3>
            {selectedInfo ? (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-text-subtle mb-1">Name</div>
                  <div className="text-sm font-medium text-text-strong">
                    {selectedInfo.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-subtle mb-1">Flow</div>
                  <div className="text-sm text-text-strong">
                    {selectedInfo.flow}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-subtle mb-1">Type</div>
                  <div className="text-sm text-text-strong uppercase">
                    {selectedInfo.type}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-subtle mb-1">Description</div>
                  <div className="text-sm text-text-muted">
                    {selectedInfo.description}
                  </div>
                </div>
                {selectedInfo.childFlowId && (
                  <div className="p-2 bg-accent-blue/10 border border-accent-blue rounded">
                    <div className="text-xs text-accent-blue font-medium">
                      💡 Double-click node to open child flow
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-text-subtle mb-1">Status</div>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-success-green/20 text-success-green rounded">
                    {selectedInfo.status}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-text-subtle mb-2">
                    Source Files
                  </div>
                  <div className="space-y-1">
                    {selectedInfo.sourceFiles.map((file) => (
                      <div
                        key={file}
                        className="text-xs text-text-strong bg-panel-bg px-2 py-1 rounded font-mono"
                      >
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-text-muted">
                Select a node to inspect business logic.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Test Runner */}
      <div className="h-48 bg-panel-bg-secondary border-t border-border flex flex-col">
        <div className="flex items-center gap-4 px-4 py-2 border-b border-border">
          {['all', 'impacted', 'failed', 'regression'].map((tab) => (
            <button
              key={tab}
              className={`text-sm px-3 py-1 rounded transition-colors ${
                activeTestTab === tab
                  ? 'bg-accent-blue text-white'
                  : 'text-text-muted hover:text-text-strong'
              }`}
              onClick={() => setActiveTestTab(tab)}
            >
              {tab === 'all' && 'All Tests'}
              {tab === 'impacted' && 'Impacted Tests'}
              {tab === 'failed' && 'Failed Tests'}
              {tab === 'regression' && 'Regression Tests'}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          <div className="space-y-1">
            {mockTests.map((test) => (
              <div
                key={test.id}
                className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors ${
                  selectedTestId === test.id
                    ? 'bg-accent-blue/20 border border-accent-blue'
                    : 'hover:bg-panel-bg'
                }`}
                onClick={() => setSelectedTestId(test.id)}
              >
                <span
                  className={`text-xs font-bold ${
                    test.status === 'PASS'
                      ? 'text-success-green'
                      : test.status === 'FAIL'
                      ? 'text-error-red'
                      : 'text-warning-yellow'
                  }`}
                >
                  {test.status}
                </span>
                <span className="text-sm text-text-strong">{test.name}</span>
              </div>
            ))}
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

// Made with Bob

export default function EditorPage() {
  return (
    <ReactFlowProvider>
      <EditorPageInner />
    </ReactFlowProvider>
  );
}

// Made with Bob
