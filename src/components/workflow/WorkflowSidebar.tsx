import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Save, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Download,
  Calendar,
  Layers
} from 'lucide-react';
import { useWorkflows, Workflow } from '@/hooks/useWorkflows';
import { Node, Edge } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";

interface WorkflowSidebarProps {
  nodes: Node[];
  edges: Edge[];
  currentWorkflowId?: string;
  onLoadWorkflow: (nodes: Node[], edges: Edge[], workflowId: string) => void;
  onNewWorkflow: () => void;
}

const WorkflowSidebar = ({ 
  nodes, 
  edges, 
  currentWorkflowId, 
  onLoadWorkflow, 
  onNewWorkflow 
}: WorkflowSidebarProps) => {
  const { workflows, loading, saveWorkflow, loadWorkflow, deleteWorkflow } = useWorkflows();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  const handleSaveWorkflow = async () => {
    if (!workflowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workflow name",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveWorkflow({
        name: workflowName,
        description: workflowDescription,
        nodes,
        edges,
        workflowId: currentWorkflowId
      });
      setSaveDialogOpen(false);
      setWorkflowName('');
      setWorkflowDescription('');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleLoadWorkflow = async (workflowId: string) => {
    try {
      const result = await loadWorkflow(workflowId);
      if (result) {
        onLoadWorkflow(result.nodes, result.edges, workflowId);
        toast({
          title: "Success",
          description: `Loaded workflow: ${result.workflow.name}`,
        });
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleDeleteWorkflow = async (workflowId: string, workflowName: string) => {
    if (confirm(`Are you sure you want to delete "${workflowName}"?`)) {
      await deleteWorkflow(workflowId);
    }
  };

  const exportWorkflow = () => {
    const workflow = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      })),
      metadata: {
        name: 'AI Workflow Export',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        description: 'AI agent pipeline workflow'
      }
    };

    const blob = new Blob([JSON.stringify(workflow, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-workflow.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Workflow Exported",
      description: "Workflow saved as JSON file",
    });
  };

  return (
    <div className="space-y-4">
      {/* Workflow Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Workflow Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="sm">
                <Save className="h-4 w-4 mr-2" />
                {currentWorkflowId ? 'Update' : 'Save'} Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {currentWorkflowId ? 'Update' : 'Save'} Workflow
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="Enter workflow name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    placeholder="Enter workflow description (optional)"
                    rows={3}
                  />
                </div>
                <Button onClick={handleSaveWorkflow} className="w-full">
                  {currentWorkflowId ? 'Update' : 'Save'} Workflow
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={onNewWorkflow} variant="outline" className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>

          <Button onClick={exportWorkflow} variant="outline" className="w-full" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </CardContent>
      </Card>

      {/* Saved Workflows */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Saved Workflows
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-sm text-gray-500">Loading...</div>
          ) : workflows.length === 0 ? (
            <div className="text-center text-sm text-gray-500">No saved workflows</div>
          ) : (
            <div className="space-y-2">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="bg-gray-50 border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{workflow.name}</h4>
                        {workflow.description && (
                          <p className="text-xs text-gray-600 truncate">{workflow.description}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs ml-2">
                        v{workflow.version}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(workflow.updated_at).toLocaleDateString()}
                      <Layers className="h-3 w-3 ml-2" />
                      {workflow.metadata?.nodeCount || 0} nodes
                    </div>

                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleLoadWorkflow(workflow.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 h-7 text-xs"
                      >
                        Load
                      </Button>
                      <Button
                        onClick={() => handleDeleteWorkflow(workflow.id, workflow.name)}
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowSidebar;