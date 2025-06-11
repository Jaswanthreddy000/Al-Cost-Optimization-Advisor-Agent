
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Bot, Brain, Cpu } from 'lucide-react';

const AIModelNode = ({ data, id }: { data: any; id: string }) => {
  const [selectedModel, setSelectedModel] = useState(data.config?.model || '');
  const [maxTokens, setMaxTokens] = useState(data.config?.maxTokens || 2000);

  // Update node data when configuration changes
  useEffect(() => {
    if (data.onConfigChange) {
      data.onConfigChange(id, {
        ...data.config,
        model: selectedModel,
        maxTokens: maxTokens
      });
    }
  }, [selectedModel, maxTokens, id, data]);

  const getIcon = () => {
    switch (data.provider) {
      case 'openai': return <Bot className="h-4 w-4 text-green-500" />;
      case 'anthropic': return <Brain className="h-4 w-4 text-purple-500" />;
      case 'mistral': return <Cpu className="h-4 w-4 text-orange-500" />;
      case 'google': return <Bot className="h-4 w-4 text-blue-500" />;
      case 'meta': return <Bot className="h-4 w-4 text-blue-600" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getModels = () => {
    switch (data.provider) {
      case 'openai':
        return [
          { value: 'gpt-4', label: 'GPT-4', cost: '$0.03/1k tokens' },
          { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', cost: '$0.01/1k tokens' },
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', cost: '$0.001/1k tokens' }
        ];
      case 'anthropic':
        return [
          { value: 'claude-3-opus', label: 'Claude 3 Opus', cost: '$0.015/1k tokens' },
          { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet', cost: '$0.003/1k tokens' },
          { value: 'claude-3-haiku', label: 'Claude 3 Haiku', cost: '$0.00025/1k tokens' }
        ];
      case 'mistral':
        return [
          { value: 'mixtral-8x7b', label: 'Mixtral 8x7B', cost: '$0.0007/1k tokens' },
          { value: 'mistral-large', label: 'Mistral Large', cost: '$0.008/1k tokens' }
        ];
      case 'google':
        return [
          { value: 'gemini-pro', label: 'Gemini Pro', cost: '$0.0025/1k tokens' },
          { value: 'gemini-ultra', label: 'Gemini Ultra', cost: '$0.01/1k tokens' }
        ];
      case 'meta':
        return [
          { value: 'llama2-70b', label: 'Llama 2 70B', cost: '$0.0008/1k tokens' },
          { value: 'llama2-13b', label: 'Llama 2 13B', cost: '$0.0003/1k tokens' }
        ];
      default:
        return [];
    }
  };

  const selectedModelData = getModels().find(m => m.value === selectedModel);

  return (
    <Card className="min-w-[280px] border-purple-200 bg-purple-50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-purple-600">
            {getIcon()}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            AI Model
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {getModels().map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex flex-col">
                      <span>{model.label}</span>
                      <span className="text-xs text-green-600">{model.cost}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Max Tokens</label>
            <Input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="h-8 text-xs"
              min="1"
              max="32000"
            />
          </div>
          
          {selectedModelData && (
            <div className="text-xs text-gray-600 space-y-1">
              <div>Provider: {data.provider?.charAt(0).toUpperCase() + data.provider?.slice(1)}</div>
              <div>Cost: {selectedModelData.cost}</div>
              <div>Estimated: ${((maxTokens / 1000) * parseFloat(selectedModelData.cost.match(/\$([0-9.]+)/)?.[1] || '0')).toFixed(4)}</div>
            </div>
          )}
        </div>

        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-purple-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-purple-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default AIModelNode;