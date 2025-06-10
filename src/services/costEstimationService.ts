

import { Node, Edge } from '@xyflow/react';

export interface WorkflowData {
  nodes: Array<{
    id: string;
    type: string;
    subtype?: string;
    provider?: string;
    label: string;
    config: any;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }>;
}

export interface CostEstimationRequest {
  workflow_description: string;
  estimationType: 'monthly' | 'per_request' | 'hourly';
  expectedVolume?: {
    requests_per_month?: number;
    data_processed_gb?: number;
    storage_gb?: number;
  };
}

export interface NodeCostBreakdown {
  nodeId: string;
  nodeName: string;
  type: string;
  provider?: string;
  service?: string;
  cost: number;
  costUnit: string;
  breakdown: {
    compute?: number;
    storage?: number;
    network?: number;
    api_calls?: number;
    tokens?: number;
  };
}

export interface CostEstimationResponse {
  totalCost: number;
  costUnit: string;
  estimationType: 'monthly' | 'per_request' | 'hourly';
  currency: 'USD';
  nodeBreakdown: NodeCostBreakdown[];
  summary: {
    totalCompute: number;
    totalStorage: number;
    totalNetwork: number;
    totalApiCalls: number;
    totalTokens: number;
  };
  optimizationSuggestions: Array<{
    nodeId: string;
    suggestion: string;
    potentialSavings: number;
    alternativeProvider?: string;
    alternativeService?: string;
  }>;
  timestamp: string;
}

// Helper function to safely check if config has a property
const hasProperty = (obj: unknown, prop: string): boolean => {
  return obj !== null && obj !== undefined && typeof obj === 'object' && prop in obj;
};

// Helper function to safely get a property from config
const getConfigProperty = (config: unknown, prop: string): any => {
  if (hasProperty(config, prop)) {
    return (config as any)[prop];
  }
  return undefined;
};

export const createWorkflowDescription = (nodes: Node[]): string => {
  if (nodes.length === 0) {
    return "Empty workflow with no components.";
  }

  let description = "AI Workflow Pipeline containing: ";
  const components: string[] = [];

  nodes.forEach(node => {
    const nodeType = node.type || 'unknown';
    const provider = typeof node.data?.provider === 'string' ? node.data.provider : undefined;
    const subtype = typeof node.data?.subtype === 'string' ? node.data.subtype : undefined;
    const label = typeof node.data?.label === 'string' ? node.data.label : node.id;
    const config = node.data?.config || {};

    switch (nodeType) {
      case 'cloud':
        const service = getConfigProperty(config, 'service');
        if (provider && service) {
          components.push(`${provider.toUpperCase()} cloud service (${service})`);
        } else if (provider) {
          components.push(`${provider.toUpperCase()} cloud provider`);
        } else {
          components.push('Cloud provider service');
        }
        break;

      case 'aiModel':
        const model = getConfigProperty(config, 'model');
        const maxTokens = getConfigProperty(config, 'maxTokens');
        if (provider && model && maxTokens) {
          components.push(`${provider} AI model with ${model} and ${maxTokens} max tokens`);
        } else if (provider && model) {
          components.push(`${provider} AI model with ${model}`);
        } else if (provider) {
          components.push(`${provider} AI model`);
        } else {
          components.push('AI language model');
        }
        break;

      case 'dataSource':
        if (subtype) {
          components.push(`${subtype} data source`);
        } else {
          components.push('Data source component');
        }
        break;

      case 'database':
        if (subtype) {
          components.push(`${subtype} database`);
        } else {
          components.push('Database component');
        }
        break;

      case 'logic':
        if (subtype) {
          components.push(`${subtype} logic component`);
        } else {
          components.push('Logic processing component');
        }
        break;

      case 'output':
        if (subtype) {
          components.push(`${subtype} output target`);
        } else {
          components.push('Output component');
        }
        break;

      default:
        components.push(`${label} component`);
    }
  });

  description += components.join(", ");
  description += `. Total components: ${nodes.length}. Please estimate the monthly costs for this workflow.`;

  return description;
};

export const estimateWorkflowCost = async (
  nodes: Node[], 
  edges: Edge[], 
  options: {
    estimationType?: 'monthly' | 'per_request' | 'hourly';
    expectedVolume?: {
      requests_per_month?: number;
      data_processed_gb?: number;
      storage_gb?: number;
    };
  } = {}
): Promise<CostEstimationResponse> => {
  const workflowDescription = createWorkflowDescription(nodes);
  
  const requestData: CostEstimationRequest = {
    workflow_description: workflowDescription,
    estimationType: options.estimationType || 'monthly',
    expectedVolume: options.expectedVolume || {
      requests_per_month: 10000,
      data_processed_gb: 1,
      storage_gb: 0.1
    }
  };

  try {
    console.log('Sending cost estimation request:', requestData.workflow_description);
    
    const response = await fetch(import.meta.env.VITE_WORKFLOW_API_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_WORKFLOW_API_KEY
      },
      body: JSON.stringify({
          user_id: import.meta.env.VITE_WORKFLOW_USER_ID,
          agent_id: import.meta.env.VITE_WORKFLOW_AGENT_ID,
          session_id: import.meta.env.VITE_WORKFLOW_SESSION_ID,
          message: JSON.stringify(requestData)
      })
  });
    console.log(response);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    const responseJson = await response.json();
    const costData: CostEstimationResponse = JSON.parse(responseJson.response); 
    return costData;
  } catch (error) {
    console.error('Cost estimation API error:', error);
    console.log('Using mock data for development');
    
    // Return mock data for development/testing
    return generateMockCostEstimation(nodes, edges);
  }
};

// Mock data generator for development
const generateMockCostEstimation = (nodes: Node[], edges: Edge[]): CostEstimationResponse => {
  const nodeBreakdown: NodeCostBreakdown[] = nodes.map(node => {
    const baseCost = Math.random() * 50 + 5;
    const type = node.type || 'unknown';
    const provider = typeof node.data?.provider === 'string' ? node.data.provider : undefined;
    const subtype = typeof node.data?.subtype === 'string' ? node.data.subtype : undefined;
    const config = node.data?.config || {};
    
    let cost = baseCost;
    let costUnit = 'USD/month';
    
    // Adjust cost based on node type and configuration
    switch (type) {
      case 'aiModel':
        const maxTokens = getConfigProperty(config, 'maxTokens');
        if (maxTokens && typeof maxTokens === 'number') {
          cost = (maxTokens / 1000) * 0.002; // Simple token-based pricing
        } else {
          cost = Math.random() * 100 + 20;
        }
        break;
      case 'cloud':
        cost = Math.random() * 30 + 10;
        break;
      case 'database':
        cost = Math.random() * 25 + 8;
        break;
      case 'dataSource':
        cost = Math.random() * 15 + 3;
        break;
      case 'output':
        cost = Math.random() * 10 + 2;
        break;
    }

    return {
      nodeId: node.id,
      nodeName: typeof node.data?.label === 'string' ? node.data.label : node.id,
      type,
      provider,
      service: subtype,
      cost: parseFloat(cost.toFixed(2)),
      costUnit,
      breakdown: {
        compute: parseFloat((cost * 0.6).toFixed(2)),
        storage: parseFloat((cost * 0.2).toFixed(2)),
        network: parseFloat((cost * 0.1).toFixed(2)),
        api_calls: parseFloat((cost * 0.1).toFixed(2))
      }
    };
  });

  const totalCost = nodeBreakdown.reduce((sum, node) => sum + node.cost, 0);

  return {
    totalCost: parseFloat(totalCost.toFixed(2)),
    costUnit: 'USD/month',
    estimationType: 'monthly',
    currency: 'USD',
    nodeBreakdown,
    summary: {
      totalCompute: parseFloat((totalCost * 0.6).toFixed(2)),
      totalStorage: parseFloat((totalCost * 0.2).toFixed(2)),
      totalNetwork: parseFloat((totalCost * 0.1).toFixed(2)),
      totalApiCalls: parseFloat((totalCost * 0.1).toFixed(2)),
      totalTokens: Math.floor(Math.random() * 100000)
    },
    optimizationSuggestions: [
      {
        nodeId: nodeBreakdown[0]?.nodeId || '',
        suggestion: 'Consider using a smaller model variant to reduce token costs by 30%',
        potentialSavings: parseFloat((totalCost * 0.3).toFixed(2)),
        alternativeProvider: 'anthropic',
        alternativeService: 'claude-3-haiku'
      },
      {
        nodeId: nodeBreakdown[1]?.nodeId || '',
        suggestion: 'Implement caching to reduce API calls by 40%',
        potentialSavings: parseFloat((totalCost * 0.4).toFixed(2))
      }
    ],
    timestamp: new Date().toISOString()
  };
};
