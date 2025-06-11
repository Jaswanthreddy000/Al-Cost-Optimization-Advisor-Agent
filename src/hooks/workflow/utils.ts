
import { Node, Edge } from '@xyflow/react';
import { WorkflowNode, WorkflowEdge } from './types';

export const convertNodesToDatabase = (nodes: Node[], workflowId: string): Omit<WorkflowNode, 'id' | 'created_at'>[] => {
  return nodes.map(node => ({
    workflow_id: workflowId,
    node_id: node.id,
    node_type: node.type || 'default',
    subtype: (node.data?.subtype as string) || null,
    label: String(node.data?.label || ''),
    position_x: node.position.x,
    position_y: node.position.y,
    config: node.data?.config || {},
    style: node.style || {}
  }));
};

export const convertEdgesToDatabase = (edges: Edge[], workflowId: string): Omit<WorkflowEdge, 'id' | 'created_at'>[] => {
  return edges.map(edge => ({
    workflow_id: workflowId,
    edge_id: edge.id,
    source_node_id: edge.source,
    target_node_id: edge.target,
    source_handle: edge.sourceHandle || null,
    target_handle: edge.targetHandle || null,
    edge_type: edge.type || 'default',
    style: edge.style || {}
  }));
};

export const convertDatabaseToNodes = (dbNodes: WorkflowNode[]): Node[] => {
  return dbNodes.map(node => ({
    id: node.node_id,
    type: node.node_type,
    position: { x: node.position_x, y: node.position_y },
    data: {
      label: node.label,
      subtype: node.subtype,
      config: node.config
    },
    style: node.style as React.CSSProperties
  }));
};

export const convertDatabaseToEdges = (dbEdges: WorkflowEdge[]): Edge[] => {
  return dbEdges.map(edge => ({
    id: edge.edge_id,
    source: edge.source_node_id,
    target: edge.target_node_id,
    sourceHandle: edge.source_handle,
    targetHandle: edge.target_handle,
    type: edge.edge_type,
    style: edge.style as React.CSSProperties
  }));
};