/**
 * Visual editor graph for **loan-approvals-COBOL** — same hierarchy and domains as Analysis
 * (`analysisLoanApprovalsCobol.ts`). Root flow = seven domains (LNMAIN → LNRULES → LNRATE path);
 * each domain flow = linear chain of hierarchy leaves.
 */

import type { Node, Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';
import {
  LOAN_APPROVALS_DOMAIN_DETAILS,
  LOAN_APPROVALS_HIERARCHY_BASE,
  type AnalysisLogicNode,
} from './analysisLoanApprovalsCobol';
import {
  EDITOR_PRESCREEN_GATES,
  getEditorEditableGateByNodeId,
  prescreenGateLabel,
} from './editorPrescreenRules';

export type EditorFlowNodeData = {
  label: string;
  type: 'start' | 'domain' | 'decision' | 'action' | 'output';
  childFlowId?: string;
  description?: string;
  isEditable?: boolean;
  ruleId?: string;
  isModified?: boolean;
  /**
   * Prescreen graph only: split sources so “Yes” (bottom) and “No” (left) edges do not overlap at the handle.
   */
  prescreenHandleLayout?: 'gate' | 'decline-in' | 'pass-in';
};

/** Light flow edges — root + domain chains match; reads clearly on dark graph background */
const edgeFlowStroke = 'rgba(148, 184, 214, 0.82)';
const edgeStyle = { stroke: edgeFlowStroke, strokeWidth: 1.5 };
const edgeMarker = { type: MarkerType.ArrowClosed, color: 'rgba(186, 210, 232, 0.95)' } as const;

/** Vertical gap tuned for ~280px-wide nodes with wrapped labels (see `BusinessNode`). */
const DOMAIN_LEAF_ROW_HEIGHT = 168;
const ROOT_DOMAIN_ROW_HEIGHT = 156;

function chainEdges(ids: string[]): Edge[] {
  const out: Edge[] = [];
  for (let i = 0; i < ids.length - 1; i++) {
    const a = ids[i]!;
    const b = ids[i + 1]!;
    out.push({
      id: `e-${a}-${b}`,
      source: a,
      sourceHandle: 'out',
      target: b,
      targetHandle: 'in',
      type: 'smoothstep',
      animated: true,
      style: { ...edgeStyle },
      markerEnd: edgeMarker,
      pathOptions: {
        borderRadius: 14,
        offset: i % 2 === 0 ? 10 : -10,
      },
    } as Edge);
  }
  return out;
}

function findDomainChildren(root: AnalysisLogicNode, domainId: string): AnalysisLogicNode[] {
  const walk = (n: AnalysisLogicNode): AnalysisLogicNode[] | null => {
    if (n.id === domainId) return n.children ?? [];
    for (const c of n.children ?? []) {
      const r = walk(c);
      if (r) return r;
    }
    return null;
  };
  return walk(root) ?? [];
}

const DOMAIN_ORDER = [
  'batch-io',
  'eligibility',
  'hard-decline',
  'down-payment',
  'risk-grade',
  'final-decision',
  'apr-pricing',
] as const;

function buildRootFlow(): { nodes: Node<EditorFlowNodeData>[]; edges: Edge[] } {
  const y0 = 32;
  const dy = ROOT_DOMAIN_ROW_HEIGHT;
  const x = 300;
  const nodes: Node<EditorFlowNodeData>[] = DOMAIN_ORDER.map((id, i) => {
    const d = LOAN_APPROVALS_DOMAIN_DETAILS[id];
    return {
      id,
      type: 'business',
      position: { x, y: y0 + i * dy },
      draggable: false,
      data: {
        label: d?.name ?? id,
        type: 'domain',
        childFlowId: id,
        description: '',
      },
    };
  });
  const edges = chainEdges([...DOMAIN_ORDER]);
  return { nodes, edges };
}

function nodeTypeForLeaf(domainId: string, leafId: string, index: number): EditorFlowNodeData['type'] {
  if (index === 0) return 'start';
  if (domainId === 'hard-decline' && leafId.startsWith('rule-')) return 'decision';
  if (domainId === 'final-decision') return 'decision';
  if (domainId === 'risk-grade') return 'decision';
  return 'action';
}

/**
 * Hard prescreen: single main column + aligned decline column (same row y per gate)
 * so “No” edges are short horizontals; generous `rowHeight` avoids stacked node overlap.
 */
const HD_ROW_HEIGHT = 152;
const HD_X_MAIN = 400;
const HD_X_DECLINE = 40;
const HD_Y0 = 36;

/** Yes / No flow matching the nested IF ladder in `3000-HARD-DECLINE-RULES`. */
function buildHardDeclineFlow(): { nodes: Node<EditorFlowNodeData>[]; edges: Edge[] } {
  const rowHeight = HD_ROW_HEIGHT;
  const xMain = HD_X_MAIN;
  const xDecline = HD_X_DECLINE;
  const y0 = HD_Y0;
  const nodes: Node<EditorFlowNodeData>[] = [];
  const edges: Edge[] = [];

  const passStyle = { stroke: 'rgba(110, 231, 183, 0.85)', strokeWidth: 1.5 };
  const failStyle = { stroke: 'rgba(251, 168, 182, 0.9)', strokeWidth: 1.5 };
  const passMarker = { type: MarkerType.ArrowClosed, color: 'rgba(167, 243, 208, 0.95)' } as const;
  const failMarker = { type: MarkerType.ArrowClosed, color: 'rgba(254, 202, 202, 0.95)' } as const;

  EDITOR_PRESCREEN_GATES.forEach((g, i) => {
    const y = y0 + i * rowHeight;
    nodes.push({
      id: g.nodeId,
      type: 'business',
      position: { x: xMain, y },
      draggable: false,
      data: {
        label: prescreenGateLabel(g.ruleId, g.originalThreshold),
        type: 'decision',
        isEditable: true,
        ruleId: g.ruleId,
        isModified: false,
        prescreenHandleLayout: 'gate',
      },
    });
    const failId = `hd-fail-${g.nodeId}`;
    nodes.push({
      id: failId,
      type: 'business',
      position: { x: xDecline, y },
      draggable: false,
      data: {
        label: 'No → decline',
        type: 'output',
        prescreenHandleLayout: 'decline-in',
      },
    });
    edges.push({
      id: `e-no-${g.nodeId}`,
      source: g.nodeId,
      sourceHandle: 'no',
      target: failId,
      targetHandle: 'in',
      type: 'smoothstep',
      animated: true,
      label: 'No',
      labelShowBg: false,
      labelStyle: {
        fill: 'rgba(254, 202, 202, 0.98)',
        fontWeight: 700,
        fontSize: 11,
        textShadow: '0 0 6px rgba(1, 9, 30, 0.95), 0 1px 2px rgba(1, 9, 30, 0.9)',
      },
      style: failStyle,
      markerEnd: failMarker,
      pathOptions: {
        borderRadius: 12,
        offset: i % 2 === 0 ? 6 : -6,
      },
    } as Edge);
  });

  for (let i = 0; i < EDITOR_PRESCREEN_GATES.length - 1; i++) {
    const a = EDITOR_PRESCREEN_GATES[i]!.nodeId;
    const b = EDITOR_PRESCREEN_GATES[i + 1]!.nodeId;
    edges.push({
      id: `e-yes-${a}-${b}`,
      source: a,
      sourceHandle: 'yes',
      target: b,
      targetHandle: 'in',
      type: 'smoothstep',
      animated: true,
      label: 'Yes',
      labelShowBg: false,
      labelStyle: {
        fill: 'rgba(167, 243, 208, 0.98)',
        fontWeight: 700,
        fontSize: 11,
        textShadow: '0 0 6px rgba(1, 9, 30, 0.95), 0 1px 2px rgba(1, 9, 30, 0.9)',
      },
      style: passStyle,
      markerEnd: passMarker,
      pathOptions: {
        borderRadius: 16,
        offset: i % 2 === 0 ? 12 : -12,
      },
    } as Edge);
  }

  const last = EDITOR_PRESCREEN_GATES[EDITOR_PRESCREEN_GATES.length - 1]!.nodeId;
  nodes.push({
    id: 'hard-prescreen-pass',
    type: 'business',
    position: { x: xMain, y: y0 + EDITOR_PRESCREEN_GATES.length * rowHeight },
    draggable: false,
    data: {
      label: 'All gates passed',
      type: 'output',
      prescreenHandleLayout: 'pass-in',
    },
  });
  edges.push({
    id: `e-yes-${last}-pass`,
    source: last,
    sourceHandle: 'yes',
    target: 'hard-prescreen-pass',
    targetHandle: 'in',
    type: 'smoothstep',
    animated: true,
    label: 'Yes',
    labelShowBg: false,
    labelStyle: {
      fill: 'rgba(167, 243, 208, 0.98)',
      fontWeight: 700,
      fontSize: 11,
      textShadow: '0 0 6px rgba(1, 9, 30, 0.95), 0 1px 2px rgba(1, 9, 30, 0.9)',
    },
    style: passStyle,
    markerEnd: passMarker,
    pathOptions: { borderRadius: 16, offset: 0 },
  } as Edge);

  return { nodes, edges };
}

function buildDomainFlow(domainId: string): { nodes: Node<EditorFlowNodeData>[]; edges: Edge[] } {
  if (domainId === 'hard-decline') {
    return buildHardDeclineFlow();
  }

  const leaves = findDomainChildren(LOAN_APPROVALS_HIERARCHY_BASE, domainId);
  const x = 260;
  const y0 = 28;
  const rowHeight = DOMAIN_LEAF_ROW_HEIGHT;
  const nodes: Node<EditorFlowNodeData>[] = leaves.map((leaf, i) => {
    const editableSeed = getEditorEditableGateByNodeId(leaf.id);
    const data: EditorFlowNodeData = {
      label: editableSeed
        ? prescreenGateLabel(editableSeed.ruleId, editableSeed.originalThreshold)
        : leaf.name,
      type: nodeTypeForLeaf(domainId, leaf.id, i),
      description: '',
      ...(editableSeed
        ? { isEditable: true as const, ruleId: editableSeed.ruleId, isModified: false }
        : {}),
    };
    const base: Node<EditorFlowNodeData> = {
      id: leaf.id,
      type: 'business',
      position: { x, y: y0 + i * rowHeight },
      draggable: false,
      data,
    };
    return base;
  });
  const ids = leaves.map((l) => l.id);
  const edges = chainEdges(ids);
  return { nodes, edges };
}

const rootFlow = buildRootFlow();
const domainFlows: Record<string, { nodes: Node<EditorFlowNodeData>[]; edges: Edge[] }> = {};
for (const id of DOMAIN_ORDER) {
  domainFlows[id] = buildDomainFlow(id);
}

/** All editor flows: top-level domain chain + one subgraph per domain (same ids as Analysis). */
export const EDITOR_LOAN_APPROVALS_FLOW_DEFINITIONS: Record<
  string,
  { nodes: Node<EditorFlowNodeData>[]; edges: Edge[] }
> = {
  root: rootFlow,
  ...domainFlows,
};
