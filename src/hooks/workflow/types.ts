
import { Node, Edge } from '@xyflow/react';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface WorkflowNode {
  id: string;
  workflow_id: string;
  node_id: string;
  node_type: string;
  subtype?: string;
  label: string;
  position_x: number;
  position_y: number;
  config: Record<string, any>;
  style: Record<string, any>;
  created_at: string;
}

export interface WorkflowEdge {
  id: string;
  workflow_id: string;
  edge_id: string;
  source_node_id: string;
  target_node_id: string;
  source_handle?: string;
  target_handle?: string;
  edge_type: string;
  style: Record<string, any>;
  created_at: string;
}

export interface SaveWorkflowParams {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  workflowId?: string;
}

export interface LoadWorkflowResult {
  workflow: Workflow;
  nodes: Node[];
  edges: Edge[];
}