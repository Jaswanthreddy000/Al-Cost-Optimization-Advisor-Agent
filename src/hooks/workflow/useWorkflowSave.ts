import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SaveWorkflowParams } from './types';
import { convertNodesToDatabase, convertEdgesToDatabase } from './utils';

export const useWorkflowSave = () => {
  const [loading, setLoading] = useState(false);

  const saveWorkflow = async (params: SaveWorkflowParams): Promise<string | null> => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      let workflowId = params.workflowId;

      // Generate a unique name if there's a conflict
      let finalName = params.name;
      let nameCounter = 1;

      while (true) {
        try {
          if (workflowId) {
            // Update existing workflow
            const { error: workflowError } = await supabase
              .from('workflows')
              .update({
                name: finalName,
                description: params.description,
                version: '1.0.0',
                metadata: { nodeCount: params.nodes.length, edgeCount: params.edges.length },
                updated_at: new Date().toISOString()
              })
              .eq('id', workflowId)
              .eq('user_id', user.id);

            if (workflowError) {
              if (workflowError.code === '23505') { // Unique constraint violation
                finalName = `${params.name} (${nameCounter})`;
                nameCounter++;
                continue;
              }
              throw workflowError;
            }
            break;
          } else {
            // Create new workflow
            const { data: workflowData, error: workflowError } = await supabase
              .from('workflows')
              .insert({
                name: finalName,
                description: params.description,
                version: '1.0.0',
                metadata: { nodeCount: params.nodes.length, edgeCount: params.edges.length },
                user_id: user.id
              })
              .select()
              .single();

            if (workflowError) {
              if (workflowError.code === '23505') { // Unique constraint violation
                finalName = `${params.name} (${nameCounter})`;
                nameCounter++;
                continue;
              }
              throw workflowError;
            }
            
            workflowId = workflowData.id;
            break;
          }
        } catch (error: any) {
          if (error.code === '23505') {
            finalName = `${params.name} (${nameCounter})`;
            nameCounter++;
            continue;
          }
          throw error;
        }
      }

      // Delete existing nodes and edges for this workflow
      if (workflowId) {
        await supabase.from('workflow_nodes').delete().eq('workflow_id', workflowId);
        await supabase.from('workflow_edges').delete().eq('workflow_id', workflowId);
      }

      // Insert new nodes
      if (params.nodes.length > 0 && workflowId) {
        const nodeData = convertNodesToDatabase(params.nodes, workflowId);
        const { error: nodesError } = await supabase
          .from('workflow_nodes')
          .insert(nodeData);

        if (nodesError) throw nodesError;
      }

      // Insert new edges
      if (params.edges.length > 0 && workflowId) {
        const edgeData = convertEdgesToDatabase(params.edges, workflowId);
        const { error: edgesError } = await supabase
          .from('workflow_edges')
          .insert(edgeData);

        if (edgesError) throw edgesError;
      }

      toast({
        title: "Success",
        description: `Workflow "${finalName}" saved successfully`,
      });

      return workflowId;

    } catch (error: any) {
      console.error('Error saving workflow:', error);
      
      let errorMessage = "Failed to save workflow";
      if (error.message?.includes('duplicate key')) {
        errorMessage = "A workflow with this name already exists. Please choose a different name.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { saveWorkflow, loading };
};