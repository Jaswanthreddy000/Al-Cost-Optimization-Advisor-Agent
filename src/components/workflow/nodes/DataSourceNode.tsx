
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Globe, Search } from 'lucide-react';

const DataSourceNode = ({ data }: { data: any }) => {
  const getIcon = () => {
    switch (data.subtype) {
      case 'file': return <FileText className="h-4 w-4" />;
      case 'api': return <Globe className="h-4 w-4" />;
      case 'scraper': return <Search className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="min-w-[200px] border-blue-200 bg-blue-50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-blue-600">
            {getIcon()}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            Data Source
          </Badge>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          {data.subtype === 'file' && (
            <div>Types: {data.config?.acceptedTypes?.join(', ')}</div>
          )}
          {data.subtype === 'api' && (
            <div>Method: {data.config?.method || 'GET'}</div>
          )}
          {data.subtype === 'scraper' && (
            <div>Frequency: {data.config?.frequency || 'daily'}</div>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default DataSourceNode;