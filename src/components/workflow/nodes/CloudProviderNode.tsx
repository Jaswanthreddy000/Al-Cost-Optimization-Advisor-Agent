
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cloud, Server, Database, Cpu } from 'lucide-react';

const CloudProviderNode = ({ data, id }: { data: any; id: string }) => {
  const [selectedService, setSelectedService] = useState(data.config?.service || '');

  // Update node data when configuration changes
  useEffect(() => {
    if (data.onConfigChange) {
      data.onConfigChange(id, {
        ...data.config,
        service: selectedService
      });
    }
  }, [selectedService, id, data]);

  const getIcon = () => {
    switch (data.provider) {
      case 'aws': return <Cloud className="h-4 w-4 text-orange-500" />;
      case 'gcp': return <Cloud className="h-4 w-4 text-blue-500" />;
      case 'azure': return <Cloud className="h-4 w-4 text-blue-600" />;
      case 'oracle': return <Cloud className="h-4 w-4 text-red-500" />;
      default: return <Cloud className="h-4 w-4" />;
    }
  };

  const getServices = () => {
    switch (data.provider) {
      case 'aws':
        return [
          { value: 'lambda', label: 'Lambda', icon: <Cpu className="h-3 w-3" /> },
          { value: 's3', label: 'S3', icon: <Database className="h-3 w-3" /> },
          { value: 'ec2', label: 'EC2', icon: <Server className="h-3 w-3" /> },
          { value: 'bedrock', label: 'Bedrock', icon: <Cpu className="h-3 w-3" /> },
          { value: 'rds', label: 'RDS', icon: <Database className="h-3 w-3" /> }
        ];
      case 'gcp':
        return [
          { value: 'functions', label: 'Cloud Functions', icon: <Cpu className="h-3 w-3" /> },
          { value: 'storage', label: 'Cloud Storage', icon: <Database className="h-3 w-3" /> },
          { value: 'compute', label: 'Compute Engine', icon: <Server className="h-3 w-3" /> },
          { value: 'vertex', label: 'Vertex AI', icon: <Cpu className="h-3 w-3" /> }
        ];
      case 'azure':
        return [
          { value: 'functions', label: 'Azure Functions', icon: <Cpu className="h-3 w-3" /> },
          { value: 'blob', label: 'Blob Storage', icon: <Database className="h-3 w-3" /> },
          { value: 'vm', label: 'Virtual Machines', icon: <Server className="h-3 w-3" /> },
          { value: 'openai', label: 'Azure OpenAI', icon: <Cpu className="h-3 w-3" /> }
        ];
      case 'oracle':
        return [
          { value: 'functions', label: 'Oracle Functions', icon: <Cpu className="h-3 w-3" /> },
          { value: 'storage', label: 'Object Storage', icon: <Database className="h-3 w-3" /> },
          { value: 'compute', label: 'Compute', icon: <Server className="h-3 w-3" /> }
        ];
      default:
        return [];
    }
  };

  return (
    <Card className="min-w-[250px] border-blue-200 bg-blue-50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-blue-600">
            {getIcon()}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            Cloud
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Service</label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {getServices().map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    <div className="flex items-center gap-2">
                      {service.icon}
                      {service.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedService && (
            <div className="text-xs text-gray-600">
              <div>Provider: {data.provider?.toUpperCase()}</div>
              <div>Service: {getServices().find(s => s.value === selectedService)?.label}</div>
            </div>
          )}
        </div>

        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default CloudProviderNode;