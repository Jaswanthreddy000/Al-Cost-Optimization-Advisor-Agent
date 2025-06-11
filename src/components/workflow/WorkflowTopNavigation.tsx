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
  FolderOpen,
  Trash2,
  Edit
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Node, Edge } from '@xyflow/react';
import { useWorkflows } from '@/hooks/useWorkflows';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import jsPDF from 'jspdf';

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
  const { workflows, loading, deleteWorkflow } = useWorkflows();
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
        { 
          id: 'resume-parser', 
          type: 'dataSource', 
          data: { label: 'File Upload', subtype: 'file' }, 
          position: { x: 100, y: 100 } 
        },
        { 
          id: 'skill-extractor', 
          type: 'aiModel', 
          data: { label: 'OpenAI', subtype: 'openai', provider: 'openai' }, 
          position: { x: 300, y: 100 } 
        },
        { 
          id: 'candidate-db', 
          type: 'database', 
          data: { label: 'PostgreSQL', subtype: 'postgres' }, 
          position: { x: 500, y: 100 } 
        },
        { 
          id: 'email-notify', 
          type: 'output', 
          data: { label: 'Email', subtype: 'email' }, 
          position: { x: 700, y: 100 } 
        }
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
        { 
          id: 'invoice-upload', 
          type: 'dataSource', 
          data: { label: 'File Upload', subtype: 'file' }, 
          position: { x: 100, y: 100 } 
        },
        { 
          id: 'ocr-processor', 
          type: 'aiModel', 
          data: { label: 'OpenAI', subtype: 'openai', provider: 'openai' }, 
          position: { x: 300, y: 100 } 
        },
        { 
          id: 'expense-categorizer', 
          type: 'logic', 
          data: { label: 'Filter', subtype: 'filter' }, 
          position: { x: 500, y: 100 } 
        },
        { 
          id: 'financial-db', 
          type: 'database', 
          data: { label: 'PostgreSQL', subtype: 'postgres' }, 
          position: { x: 700, y: 100 } 
        },
        { 
          id: 'report-generator', 
          type: 'output', 
          data: { label: 'PDF Generator', subtype: 'pdf' }, 
          position: { x: 900, y: 100 } 
        }
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
        { 
          id: 'content-brief', 
          type: 'dataSource', 
          data: { label: 'API Gateway', subtype: 'api' }, 
          position: { x: 100, y: 100 } 
        },
        { 
          id: 'content-generator', 
          type: 'aiModel', 
          data: { label: 'OpenAI', subtype: 'openai', provider: 'openai' }, 
          position: { x: 300, y: 100 } 
        },
        { 
          id: 'image-generator', 
          type: 'aiModel', 
          data: { label: 'OpenAI', subtype: 'openai', provider: 'openai' }, 
          position: { x: 500, y: 100 } 
        },
        { 
          id: 'social-scheduler', 
          type: 'output', 
          data: { label: 'Slack', subtype: 'slack' }, 
          position: { x: 700, y: 100 } 
        }
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
            const workflowName = workflow.metadata?.name;
            toast({
              title: "Workflow Imported",
              description: `Imported workflow: ${typeof workflowName === 'string' ? workflowName : 'Unnamed'}`,
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

  const handleDeleteWorkflow = async (workflowId: string, workflowName: string) => {
    if (window.confirm(`Are you sure you want to delete "${workflowName}"? This action cannot be undone.`)) {
      try {
        await deleteWorkflow(workflowId);
        toast({
          title: "Success",
          description: `Workflow "${workflowName}" deleted successfully`,
        });
      } catch (error) {
        console.error('Delete workflow error:', error);
        toast({
          title: "Error",
          description: "Failed to delete workflow. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleExportPDF = () => {
    if (nodes.length === 0) {
      toast({
        title: "No Components",
        description: "Please add some workflow components before exporting PDF.",
        variant: "destructive",
      });
      return;
    }

    try {
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AI Workflow Diagram', 20, 25);
      
      // Add metadata
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
      pdf.text(`Components: ${nodes.length} | Connections: ${edges.length}`, 20, 42);
      
      // Calculate workflow bounds
      const minX = Math.min(...nodes.map(n => n.position.x));
      const maxX = Math.max(...nodes.map(n => n.position.x + 200));
      const minY = Math.min(...nodes.map(n => n.position.y));
      const maxY = Math.max(...nodes.map(n => n.position.y + 100));
      
      const workflowWidth = maxX - minX;
      const workflowHeight = maxY - minY;
      
      // Scale to fit page
      const availableWidth = pageWidth - 40;
      const availableHeight = pageHeight - 80;
      const scale = Math.min(availableWidth / workflowWidth, availableHeight / workflowHeight, 1);
      
      // Draw nodes
      nodes.forEach((node) => {
        const x = 20 + (node.position.x - minX) * scale;
        const y = 60 + (node.position.y - minY) * scale;
        const width = 50 * scale;
        const height = 25 * scale;
        
        // Node background
        pdf.setFillColor(240, 240, 240);
        pdf.rect(x, y, width, height, 'F');
        
        // Node border with type-specific colors
        switch (node.type) {
          case 'dataSource':
            pdf.setDrawColor(59, 130, 246);
            break;
          case 'aiModel':
            pdf.setDrawColor(139, 92, 246);
            break;
          case 'database':
            pdf.setDrawColor(16, 185, 129);
            break;
          case 'logic':
            pdf.setDrawColor(245, 158, 11);
            break;
          case 'output':
            pdf.setDrawColor(239, 68, 68);
            break;
          case 'cloud':
            pdf.setDrawColor(6, 182, 212);
            break;
          default:
            pdf.setDrawColor(107, 114, 128);
        }
        pdf.setLineWidth(0.5);
        pdf.rect(x, y, width, height);
        
        // Node text
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        const text = String(node.data?.label || node.type || '');
        const textWidth = pdf.getTextWidth(text);
        const textX = x + (width - textWidth) / 2;
        const textY = y + height / 2 + 1;
        pdf.text(text, textX, textY);
      });
      
      // Draw edges
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.3);
      edges.forEach((edge) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          const sourceX = 20 + (sourceNode.position.x - minX) * scale + (25 * scale);
          const sourceY = 60 + (sourceNode.position.y - minY) * scale + (12.5 * scale);
          const targetX = 20 + (targetNode.position.x - minX) * scale + (25 * scale);
          const targetY = 60 + (targetNode.position.y - minY) * scale + (12.5 * scale);
          
          pdf.line(sourceX, sourceY, targetX, targetY);
          
          // Add arrow head
          const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
          const arrowLength = 3 * scale;
          const arrowAngle = 0.5;
          
          pdf.line(
            targetX, targetY,
            targetX - arrowLength * Math.cos(angle - arrowAngle),
            targetY - arrowLength * Math.sin(angle - arrowAngle)
          );
          pdf.line(
            targetX, targetY,
            targetX - arrowLength * Math.cos(angle + arrowAngle),
            targetY - arrowLength * Math.sin(angle + arrowAngle)
          );
        }
      });
      
      // Add legend
      const legendY = pageHeight - 30;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Legend:', 20, legendY);
      
      const legendItems = [
        { type: 'Data Sources', color: [59, 130, 246] },
        { type: 'AI Models', color: [139, 92, 246] },
        { type: 'Databases', color: [16, 185, 129] },
        { type: 'Logic', color: [245, 158, 11] },
        { type: 'Outputs', color: [239, 68, 68] },
        { type: 'Cloud', color: [6, 182, 212] }
      ];
      
      legendItems.forEach((item, index) => {
        const x = 60 + (index * 40);
        pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
        pdf.rect(x, legendY - 5, 5, 3, 'F');
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.text(item.type, x + 7, legendY - 2);
      });
      
      // Save PDF
      const fileName = `workflow-diagram-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "PDF Exported",
        description: "Workflow diagram saved as PDF successfully",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left Section - Logo and Main Menu */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
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

          {/* Edit Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">Edit</MenubarTrigger>
            <MenubarContent>
              {workflows.length > 0 ? (
                <>
                  <MenubarItem disabled className="font-medium">
                    <Edit className="h-4 w-4 mr-2" />
                    Manage Workflows
                  </MenubarItem>
                  {workflows.map((workflow) => (
                    <MenubarItem 
                      key={workflow.id}
                      onClick={() => handleDeleteWorkflow(workflow.id, workflow.name)}
                      className="pl-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <div>
                        <div className="font-medium">Delete {workflow.name}</div>
                        <div className="text-xs text-gray-500">Remove this workflow permanently</div>
                      </div>
                    </MenubarItem>
                  ))}
                </>
              ) : (
                <MenubarItem disabled>
                  No workflows to manage
                </MenubarItem>
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
              <MenubarItem onClick={handleExportPDF}>
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
