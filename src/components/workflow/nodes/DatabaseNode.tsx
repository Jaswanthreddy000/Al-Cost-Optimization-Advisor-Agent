
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Cloud, HardDrive } from 'lucide-react';

const DatabaseNode = ({ data }: { data: any }) => {
  const getIcon = () => {
    switch (data.subtype) {
      case 'postgres': return <Database className="h-4 w-4" />;
      case 'pinecone': return <Cloud className="h-4 w-4" />;
      case 'redis': return <HardDrive className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  return (
    <Card className="min-w-[200px] border-green-200 bg-green-50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-green-600">
            {getIcon()}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            Database
          </Badge>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          {data.subtype === 'postgres' && (
            <div>Table: {data.config?.table || 'Not set'}</div>
          )}
          {data.subtype === 'pinecone' && (
            <div>Dimension: {data.config?.dimension || 1536}</div>
          )}
          {data.subtype === 'redis' && (
            <div>DB: {data.config?.db || 0}</div>
          )}
        </div>

        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-green-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-green-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default DatabaseNode;