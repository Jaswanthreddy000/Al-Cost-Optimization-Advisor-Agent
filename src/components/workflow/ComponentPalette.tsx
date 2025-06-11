
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Database, 
  FileText, 
  Globe, 
  Search,
  Bot,
  Brain,
  Cpu,
  Filter,
  CheckCircle,
  Shuffle,
  FileOutput,
  Mail,
  Webhook,
  HardDrive,
  Cloud,
  Zap
} from 'lucide-react';

interface ComponentPaletteProps {
  onAddNode: (nodeType: string, subtype: string, label: string) => void;
}

const ComponentPalette = ({ onAddNode }: ComponentPaletteProps) => {
  const componentCategories = [
    {
      title: "Data Sources",
      type: "dataSource",
      color: "text-blue-600",
      components: [
        { subtype: "file", label: "File Upload", icon: FileText },
        { subtype: "api", label: "API Source", icon: Globe },
        { subtype: "scraper", label: "Web Scraper", icon: Search },
      ]
    },
    {
      title: "AI Models",
      type: "aiModel",
      color: "text-purple-600",
      components: [
        { subtype: "gpt4", label: "GPT-4", icon: Bot },
        { subtype: "claude", label: "Claude", icon: Brain },
        { subtype: "mistral", label: "Mistral", icon: Cpu },
      ]
    },
    {
      title: "Databases",
      type: "database",
      color: "text-green-600",
      components: [
        { subtype: "postgres", label: "PostgreSQL", icon: Database },
        { subtype: "pinecone", label: "Pinecone", icon: Cloud },
        { subtype: "redis", label: "Redis", icon: HardDrive },
      ]
    },
    {
      title: "Logic Components",
      type: "logic",
      color: "text-amber-600",
      components: [
        { subtype: "filter", label: "Filter", icon: Filter },
        { subtype: "validate", label: "Validate", icon: CheckCircle },
        { subtype: "transform", label: "Transform", icon: Shuffle },
      ]
    },
    {
      title: "Output Targets",
      type: "output",
      color: "text-red-600",
      components: [
        { subtype: "pdf", label: "PDF Export", icon: FileOutput },
        { subtype: "email", label: "Email", icon: Mail },
        { subtype: "webhook", label: "Webhook", icon: Webhook },
      ]
    }
  ];

  return (
    <div className="space-y-4 p-4">
      {componentCategories.map((category) => (
        <Card key={category.type} className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${category.color}`}>
              {category.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {category.components.map((component) => {
              const IconComponent = component.icon;
              return (
                <Button
                  key={component.subtype}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-auto p-2 hover:bg-gray-50"
                  onClick={() => onAddNode(category.type, component.subtype, component.label)}
                >
                  <IconComponent className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">{component.label}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ComponentPalette;