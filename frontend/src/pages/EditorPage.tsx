import { useState, useCallback } from 'react';
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
    { id: 'pricing', name: 'Pricing Calculation' },
    { id: 'routing', name: 'Final Decision Routing' },
  ],
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 50, y: 200 },
    data: { label: 'Application Received' },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 250, y: 200 },
    data: { label: 'Applicant Eligibility' },
  },
  {
    id: '3',
    type: 'default',
    position: { x: 450, y: 200 },
    data: { label: 'Risk Assessment' },
  },
  {
    id: '4',
    type: 'default',
    position: { x: 650, y: 200 },
    data: { label: 'Pricing Calculation' },
  },
  {
    id: '5',
    type: 'default',
    position: { x: 850, y: 200 },
    data: { label: 'Final Decision' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
  { id: 'e4-5', source: '4', target: '5', animated: true },
];

const mockTests: TestResult[] = [
  { id: 't1', status: 'PASS', name: 'Approve applicant with score 760' },
  { id: 't2', status: 'PASS', name: 'Approve applicant at threshold 680' },
  { id: 't3', status: 'FAIL', name: 'Reject applicant with fraud flag' },
  { id: 't4', status: 'WARN', name: 'Pricing test needs rerun' },
];

export default function EditorPage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [activeTestTab, setActiveTestTab] = useState<string>('all');
  const [expandedTreeIds, setExpandedTreeIds] = useState<Set<string>>(
    new Set(['root', 'risk'])
  );

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
            setSelectedTreeId(node.id);
            setSelectedNodeId(null);
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
      return {
        name: node?.data.label || 'Unknown',
        type: 'Graph Node',
        complexity: 'Medium',
        sourceFiles: ['CreditService.java', 'business-rules.xml'],
        status: 'Active',
      };
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
          type: 'Business Logic Domain',
          complexity: treeNode.id === 'risk' ? 'High' : 'Medium',
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
          <div className="text-text-strong font-medium">
            Credit Decision Engine
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm px-3 py-1">Back</button>
            <button className="btn-secondary text-sm px-3 py-1">
              Expand All
            </button>
            <button className="btn-secondary text-sm px-3 py-1">
              Collapse All
            </button>
            <button className="btn-secondary text-sm px-3 py-1">Fit View</button>
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
                    {String(selectedInfo.name)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-subtle mb-1">Type</div>
                  <div className="text-sm text-text-strong">
                    {selectedInfo.type}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-subtle mb-1">Complexity</div>
                  <div
                    className={`text-sm font-medium ${
                      selectedInfo.complexity === 'High'
                        ? 'text-warning-yellow'
                        : 'text-accent-blue'
                    }`}
                  >
                    {selectedInfo.complexity}
                  </div>
                </div>
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
        <div className="flex-1 overflow-y-auto px-4 py-2">
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

// Made with Bob
