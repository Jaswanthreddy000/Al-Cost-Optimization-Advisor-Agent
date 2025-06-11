
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LoadWorkflowResult, WorkflowNode, WorkflowEdge } from './types';
import { convertDatabaseToNodes, convertDatabaseToEdges } from './utils';

export const useWorkflowLoad = () => {
  const [loading, setLoading] = useState(false);

  const loadWorkflow = async (workflowId: string): Promise<LoadWorkflowResult | null> => {
    try {
      setLoading(true);

      // Fetch workflow details
      const { data: workflow, error: workflowError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

      if (workflowError) throw workflowError;

      // Fetch nodes
      const { data: nodesData, error: nodesError } = await supabase
        .from('workflow_nodes')
        .select('*')
        .eq('workflow_id', workflowId);

      if (nodesError) throw nodesError;

      // Fetch edges
      const { data: edgesData, error: edgesError } = await supabase
        .from('workflow_edges')
        .select('*')
        .eq('workflow_id', workflowId);

      if (edgesError) throw edgesError;

      // Convert to React Flow format
      const nodes = convertDatabaseToNodes(nodesData as WorkflowNode[] || []);
      const edges = convertDatabaseToEdges(edgesData as WorkflowEdge[] || []);

      return { workflow, nodes, edges };

    } catch (error) {
      console.error('Error loading workflow:', error);
      toast({
        title: "Error",
        description: "Failed to load workflow",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loadWorkflow, loading };
};