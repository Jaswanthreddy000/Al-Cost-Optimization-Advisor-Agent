
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  Cloud,
  Bot,
  Database,
  FileText,
  Cog,
  Send,
  DollarSign,
  ChevronLeft,
  Mail,
  FileOutput,
  MessageSquare
} from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  type: string;
  subtype: string;
  provider?: string;
  cost?: string;
  description: string;
  icon?: React.ReactNode;
}

interface ComponentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: ComponentItem[];
  expanded: boolean;
}

interface EnhancedComponentPaletteProps {
  onAddNode: (nodeType: string, subtype: string, label: string, provider?: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const EnhancedComponentPalette = ({ onAddNode, isCollapsed, onToggle }: EnhancedComponentPaletteProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<ComponentCategory[]>([
    {
      id: 'cloud',
      name: 'Cloud Providers',
      icon: <Cloud className="h-4 w-4" />,
      expanded: false,
      items: [
        { id: 'aws', name: 'AWS', type: 'cloud', subtype: 'aws', provider: 'aws', description: 'Amazon Web Services' },
        { id: 'gcp', name: 'Google Cloud', type: 'cloud', subtype: 'gcp', provider: 'gcp', description: 'Google Cloud Platform' },
        { id: 'azure', name: 'Microsoft Azure', type: 'cloud', subtype: 'azure', provider: 'azure', description: 'Microsoft Azure Cloud' },
        { id: 'oracle', name: 'Oracle Cloud', type: 'cloud', subtype: 'oracle', provider: 'oracle', description: 'Oracle Cloud Infrastructure' }
      ]
    },
    {
      id: 'ai-providers',
      name: 'AI Providers',
      icon: <Bot className="h-4 w-4" />,
      expanded: false,
      items: [
        { id: 'openai', name: 'OpenAI', type: 'aiModel', subtype: 'openai', provider: 'openai', description: 'OpenAI language models' },
        { id: 'anthropic', name: 'Anthropic', type: 'aiModel', subtype: 'anthropic', provider: 'anthropic', description: 'Claude AI models' },
        { id: 'mistral', name: 'Mistral AI', type: 'aiModel', subtype: 'mistral', provider: 'mistral', description: 'Mistral language models' },
        { id: 'google', name: 'Google AI', type: 'aiModel', subtype: 'google', provider: 'google', description: 'Google Gemini models' },
        { id: 'meta', name: 'Meta', type: 'aiModel', subtype: 'meta', provider: 'meta', description: 'Meta Llama models' }
      ]
    },
    {
      id: 'data-sources',
      name: 'Data Sources',
      icon: <FileText className="h-4 w-4" />,
      expanded: false,
      items: [
        { id: 'file-upload', name: 'File Upload', type: 'dataSource', subtype: 'file', description: 'Upload documents, images, data files' },
        { id: 'api-gateway', name: 'API Gateway', type: 'dataSource', subtype: 'api', description: 'Connect to external APIs' },
        { id: 'web-scraper', name: 'Web Scraper', type: 'dataSource', subtype: 'scraper', description: 'Extract data from websites' }
      ]
    },
    {
      id: 'databases',
      name: 'Databases',
      icon: <Database className="h-4 w-4" />,
      expanded: false,
      items: [
        { id: 'postgresql', name: 'PostgreSQL', type: 'database', subtype: 'postgres', description: 'Relational database' },
        { id: 'pinecone', name: 'Pinecone', type: 'database', subtype: 'pinecone', description: 'Vector database' },
        { id: 'redis', name: 'Redis', type: 'database', subtype: 'redis', description: 'In-memory cache' }
      ]
    },
    {
      id: 'logic',
      name: 'Logic',
      icon: <Cog className="h-4 w-4" />,
      expanded: false,
      items: [
        { id: 'filter', name: 'Filter', type: 'logic', subtype: 'filter', description: 'Filter data based on conditions' },
        { id: 'branch', name: 'Branch', type: 'logic', subtype: 'branch', description: 'Conditional workflow branching' },
        { id: 'python', name: 'Custom Python', type: 'logic', subtype: 'python', description: 'Execute custom Python code' }
      ]
    },
    {
      id: 'outputs',
      name: 'Outputs',
      icon: <Send className="h-4 w-4" />,
      expanded: false,
      items: [
        { id: 'email', name: 'Email', type: 'output', subtype: 'email', description: 'Send email notifications', icon: <Mail className="h-4 w-4" /> },
        { id: 'slack', name: 'Slack', type: 'output', subtype: 'slack', description: 'Send Slack messages', icon: <MessageSquare className="h-4 w-4" /> },
        { id: 'pdf', name: 'PDF Generator', type: 'output', subtype: 'pdf', description: 'Generate PDF reports', icon: <FileOutput className="h-4 w-4" /> }
      ]
    }
  ]);

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
    ));
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => searchTerm === '' || category.items.length > 0);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-2 border-b border-gray-200 flex justify-center">
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center py-4 space-y-4">
          <Cloud className="h-5 w-5 text-gray-600" />
          <Bot className="h-5 w-5 text-gray-600" />
          <FileText className="h-5 w-5 text-gray-600" />
          <Database className="h-5 w-5 text-gray-600" />
          <Cog className="h-5 w-5 text-gray-600" />
          <Send className="h-5 w-5 text-gray-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Component Palette</h2>
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="bg-white shadow-sm">
            <Collapsible open={category.expanded}>
              <CollapsibleTrigger 
                onClick={() => toggleCategory(category.id)}
                className="w-full"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {category.icon}
                      {category.name}
                    </div>
                    {category.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:bg-gray-100 transition-colors"
                      draggable
                      onClick={() => onAddNode(item.type, item.subtype, item.name, item.provider)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2 mb-1">
                            {item.icon && <span className="text-gray-600">{item.icon}</span>}
                            <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                          </div>
                          <p className="text-xs text-gray-600 break-words">{item.description}</p>
                          {item.cost && (
                            <div className="flex items-center gap-1 mt-2">
                              <DollarSign className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">{item.cost}</span>
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnhancedComponentPalette;
