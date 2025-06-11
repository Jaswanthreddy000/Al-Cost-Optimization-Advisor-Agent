
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, CheckCircle, Shuffle } from 'lucide-react';

const LogicNode = ({ data }: { data: any }) => {
  const getIcon = () => {
    switch (data.subtype) {
      case 'filter': return <Filter className="h-4 w-4" />;
      case 'validate': return <CheckCircle className="h-4 w-4" />;
      case 'transform': return <Shuffle className="h-4 w-4" />;
      default: return <Filter className="h-4 w-4" />;
    }
  };

  return (
    <Card className="min-w-[200px] border-amber-200 bg-amber-50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-amber-600">
            {getIcon()}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            Logic
          </Badge>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          {data.subtype === 'filter' && (
            <div>Operator: {data.config?.operator || 'AND'}</div>
          )}
          {data.subtype === 'validate' && (
            <div>Strict: {data.config?.strict ? 'Yes' : 'No'}</div>
          )}
          {data.subtype === 'transform' && (
            <div>Language: {data.config?.language || 'javascript'}</div>
          )}
        </div>

        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-amber-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-amber-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default LogicNode;