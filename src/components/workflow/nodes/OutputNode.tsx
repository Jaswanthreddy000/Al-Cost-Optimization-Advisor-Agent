
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileOutput, Mail, MessageSquare, Send } from 'lucide-react';

const OutputNode = ({ data }: { data: any }) => {
  const getIcon = () => {
    switch (data.subtype) {
      case 'pdf': return <FileOutput className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'slack': return <MessageSquare className="h-4 w-4" />;
      case 'webhook': return <Send className="h-4 w-4" />;
      default: return <FileOutput className="h-4 w-4" />;
    }
  };

  const getDisplayInfo = () => {
    switch (data.subtype) {
      case 'pdf':
        return { label: 'Format', value: data.config?.format || 'A4' };
      case 'email':
        return { label: 'Subject', value: data.config?.subject || 'Not set' };
      case 'slack':
        return { label: 'Channel', value: data.config?.channel || 'Not set' };
      case 'webhook':
        return { label: 'Method', value: data.config?.method || 'POST' };
      default:
        return { label: 'Type', value: data.subtype || 'Unknown' };
    }
  };

  const displayInfo = getDisplayInfo();

  return (
    <Card className="min-w-[180px] max-w-[200px] border-red-200 bg-red-50 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-red-600 flex-shrink-0">
            {getIcon()}
          </div>
          <span className="font-medium text-sm text-gray-900 truncate flex-1">{data.label}</span>
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            Output
          </Badge>
        </div>
        
        <div className="text-xs text-gray-600">
          <div className="truncate">
            <span className="font-medium">{displayInfo.label}:</span> {displayInfo.value}
          </div>
        </div>

        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-red-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default OutputNode;
