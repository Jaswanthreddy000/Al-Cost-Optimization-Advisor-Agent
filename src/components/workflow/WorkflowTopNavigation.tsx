import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { 
  FileText, 
  Save, 
  Download, 
  Calculator,
  Upload,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FolderOpen
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Node, Edge } from '@xyflow/react';
import { useWorkflows } from '@/hooks/useWorkflows';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface WorkflowTopNavigationProps {
  nodes: Node[];
  edges: Edge[];
  onNewWorkflow: () => void;
  onSaveWorkflow: (name: string, description: string) => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
  onRunCostEstimation: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onLoadWorkflow: (workflowData: any) => void;
  onLoadWorkflowFromDB: (workflowId: string) => void;
}

const WorkflowTopNavigation = ({
  nodes,
  edges,
  onNewWorkflow,
  onSaveWorkflow,
  onExportJSON,
  onExportPDF,
  onRunCostEstimation,
  onZoomIn,
  onZoomOut,
  onFitView,
  onLoadWorkflow,
  onLoadWorkflowFromDB
}: WorkflowTopNavigationProps) => {
  const { workflows, loading } = useWorkflows();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveAsTemplateDialogOpen, setSaveAsTemplateDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [templates] = useState([
    { 
      id: 'hr-automation', 
      name: 'HR Automation Pipeline', 
      description: 'Resume screening, candidate matching, and interview scheduling',
      nodes: [
        { id: 'resume-parser', type: 'dataSource', subtype: 'file', label: 'Resume Parser', position: { x: 100, y: 100 } },
        { id: 'skill-extractor', type: 'aiModel', subtype: 'openai', label: 'Skill Extractor', provider: 'openai', config: { model: 'gpt-4', maxTokens: 2000 }, position: { x: 300, y: 100 } },
        { id: 'candidate-db', type: 'database', subtype: 'postgres', label: 'Candidate Database', position: { x: 500, y: 100 } },
        { id: 'email-notify', type: 'output', subtype: 'email', label: 'Email Notification', position: { x: 700, y: 100 } }
      ],
      edges: [
        { id: 'e1', source: 'resume-parser', target: 'skill-extractor' },
        { id: 'e2', source: 'skill-extractor', target: 'candidate-db' },
        { id: 'e3', source: 'candidate-db', target: 'email-notify' }
      ]
    },
    { 
      id: 'finance-analysis', 
      name: 'Finance Analysis Workflow', 
      description: 'Invoice processing, expense categorization, and financial reporting',
      nodes: [
        { id: 'invoice-upload', type: 'dataSource', subtype: 'file', label: 'Invoice Upload', position: { x: 100, y: 100 } },
        { id: 'ocr-processor', type: 'aiModel', subtype: 'openai', label: 'OCR Processor', provider: 'openai', config: { model: 'gpt-4', maxTokens: 1500 }, position: { x: 300, y: 100 } },
        { id: 'expense-categorizer', type: 'logic', subtype: 'filter', label: 'Expense Categorizer', position: { x: 500, y: 100 } },
        { id: 'financial-db', type: 'database', subtype: 'postgres', label: 'Financial Database', position: { x: 700, y: 100 } },
        { id: 'report-generator', type: 'output', subtype: 'pdf', label: 'Report Generator', position: { x: 900, y: 100 } }
      ],
      edges: [
        { id: 'e1', source: 'invoice-upload', target: 'ocr-processor' },
        { id: 'e2', source: 'ocr-processor', target: 'expense-categorizer' },
        { id: 'e3', source: 'expense-categorizer', target: 'financial-db' },
        { id: 'e4', source: 'financial-db', target: 'report-generator' }
      ]
    },
    { 
      id: 'marketing-automation', 
      name: 'Marketing Content Pipeline', 
      description: 'Content generation, social media automation, and performance tracking',
      nodes: [
        { id: 'content-brief', type: 'dataSource', subtype: 'api', label: 'Content Brief API', position: { x: 100, y: 100 } },
        { id: 'content-generator', type: 'aiModel', subtype: 'openai', label: 'Content Generator', provider: 'openai', config: { model: 'gpt-4', maxTokens: 3000 }, position: { x: 300, y: 100 } },
        { id: 'image-generator', type: 'aiModel', subtype: 'openai', label: 'Image Generator', provider: 'openai', config: { model: 'dall-e-3', maxTokens: 1000 }, position: { x: 500, y: 100 } },
        { id: 'social-scheduler', type: 'output', subtype: 'webhook', label: 'Social Scheduler', position: { x: 700, y: 100 } }
      ],
      edges: [
        { id: 'e1', source: 'content-brief', target: 'content-generator' },
        { id: 'e2', source: 'content-generator', target: 'image-generator' },
        { id: 'e3', source: 'image-generator', target: 'social-scheduler' }
      ]
    }
  ]);

  const handleNewWorkflow = () => {
    onNewWorkflow();
    toast({
      title: "New Workflow",
      description: "Started a new workflow canvas",
    });
  };

  const handleSaveWorkflow = async () => {
    if (!workflowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workflow name",
        variant: "destructive",
      });
      return;
    }

    if (nodes.length === 0) {
      toast({
        title: "Error",
        description: "Cannot save an empty workflow. Please add some components first.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSaveWorkflow(workflowName, workflowDescription);
      setSaveDialogOpen(false);
      setWorkflowName('');
      setWorkflowDescription('');
      toast({
        title: "Success",
        description: "Workflow saved successfully",
      });
    } catch (error) {
      console.error('Save workflow error:', error);
      toast({
        title: "Error",
        description: "Failed to save workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAsTemplate = () => {
    if (!workflowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive",
      });
      return;
    }

    if (nodes.length === 0) {
      toast({
        title: "Error",
        description: "Cannot save an empty workflow as template. Please add some components first.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Template Saved",
      description: `Template "${workflowName}" saved successfully`,
    });
    setSaveAsTemplateDialogOpen(false);
    setWorkflowName('');
    setWorkflowDescription('');
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workflow = JSON.parse(e.target?.result as string);
            if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
              throw new Error('Invalid workflow format: missing nodes array');
            }
            onLoadWorkflow(workflow);
            toast({
              title: "Workflow Imported",
              description: `Imported workflow: ${workflow.metadata?.name || 'Unnamed'}`,
            });
          } catch (error) {
            console.error('Import error:', error);
            toast({
              title: "Import Error",
              description: "Invalid workflow file format",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onLoadWorkflow({
        nodes: template.nodes,
        edges: template.edges,
        metadata: {
          name: template.name,
          description: template.description
        }
      });
      toast({
        title: "Template Loaded",
        description: `Loaded ${template.name} template`,
      });
    }
  };

  const handleExportTerraform = () => {
    const terraformConfig = generateTerraformConfig(nodes, edges);
    
    const blob = new Blob([terraformConfig], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow-infrastructure.tf';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Terraform Generated",
      description: "Infrastructure-as-code configuration downloaded",
    });
  };

  const generateTerraformConfig = (nodes: Node[], edges: Edge[]) => {
    let config = `# Generated Terraform configuration for AI Workflow
# Provider configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "gcp_project_id" {
  description = "GCP project ID"
  type        = string
}

variable "gcp_region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

`;

    // Generate resources based on nodes
    nodes.forEach((node, index) => {
      switch (node.type) {
        case 'dataSource':
          if (node.data.subtype === 'aws-lambda') {
            config += `
# Lambda function for ${node.data.label}
resource "aws_lambda_function" "${node.id.replace('-', '_')}" {
  filename         = "function.zip"
  function_name    = "${node.id}"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "python3.9"
  
  tags = {
    Name = "${node.data.label}"
    Type = "DataSource"
  }
}
`;
          }
          break;
        case 'database':
          if (node.data.subtype === 'postgres') {
            config += `
# RDS PostgreSQL instance for ${node.data.label}
resource "aws_db_instance" "${node.id.replace('-', '_')}" {
  identifier     = "${node.id}"
  engine         = "postgres"
  engine_version = "14.9"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  
  db_name  = "workflow_db"
  username = "admin"
  password = var.db_password
  
  tags = {
    Name = "${node.data.label}"
    Type = "Database"
  }
}
`;
          }
          break;
      }
    });

    config += `
# IAM role for Lambda functions
resource "aws_iam_role" "lambda_role" {
  name = "workflow_lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Output values
output "workflow_info" {
  value = {
    node_count = ${nodes.length}
    edge_count = ${edges.length}
    created_at = timestamp()
  }
}
`;

    return config;
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left Section - Logo and Main Menu */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div> */}
          <span className="text-lg font-semibold text-gray-900">Workflow Builder</span>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>

        <Menubar className="border-none bg-transparent">
          {/* File Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleNewWorkflow}>
                New Workflow
                <MenubarShortcut>Ctrl+N</MenubarShortcut>
              </MenubarItem>
              
              <MenubarSeparator />
              
              <MenubarItem onClick={() => setSaveDialogOpen(true)}>
                Save to Supabase
                <MenubarShortcut>Ctrl+S</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => setSaveAsTemplateDialogOpen(true)}>
                Save As Template
              </MenubarItem>
              
              <MenubarSeparator />
              
              <MenubarItem onClick={handleImportJSON}>
                Import JSON
              </MenubarItem>
              
              {/* Open Workflow submenu */}
              {workflows.length > 0 && (
                <>
                  <MenubarSeparator />
                  <MenubarItem disabled className="font-medium">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Open Workflow
                  </MenubarItem>
                  {workflows.map((workflow) => (
                    <MenubarItem 
                      key={workflow.id}
                      onClick={() => onLoadWorkflowFromDB(workflow.id)}
                      className="pl-6"
                    >
                      <div>
                        <div className="font-medium">{workflow.name}</div>
                        <div className="text-xs text-gray-500">{workflow.description}</div>
                      </div>
                    </MenubarItem>
                  ))}
                </>
              )}
            </MenubarContent>
          </MenubarMenu>

          {/* Templates Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">Templates</MenubarTrigger>
            <MenubarContent>
              {templates.map((template) => (
                <MenubarItem 
                  key={template.id}
                  onClick={() => handleLoadTemplate(template.id)}
                >
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </div>
                </MenubarItem>
              ))}
              <MenubarSeparator />
              <MenubarItem>
                Browse Community Templates
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {/* Export Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">Export</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={onExportJSON}>
                <Download className="h-4 w-4 mr-2" />
                JSON Configuration
              </MenubarItem>
              <MenubarItem onClick={onExportPDF}>
                PDF Report
              </MenubarItem>
              <MenubarItem onClick={handleExportTerraform}>
                Terraform (IaC)
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Right Section - Quick Actions */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onFitView}>
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onRunCostEstimation}>
          <Calculator className="h-4 w-4 mr-1" />
          Estimate
        </Button>
      </div>

      {/* Save Workflow Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Workflow to Supabase</DialogTitle>
            <DialogDescription>
              Save your workflow to the database for future use and collaboration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter workflow name"
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Enter workflow description (optional)"
                rows={3}
                disabled={isSaving}
              />
            </div>
            <Button 
              onClick={handleSaveWorkflow} 
              className="w-full"
              disabled={isSaving || !workflowName.trim()}
            >
              {isSaving ? "Saving..." : "Save Workflow"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save As Template Dialog */}
      <Dialog open={saveAsTemplateDialogOpen} onOpenChange={setSaveAsTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save As Template</DialogTitle>
            <DialogDescription>
              Save your workflow as a reusable template that can be shared with others.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Template Name</label>
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter template name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Enter template description"
                rows={3}
              />
            </div>
            <Button 
              onClick={handleSaveAsTemplate} 
              className="w-full"
              disabled={!workflowName.trim()}
            >
              Save Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowTopNavigation;