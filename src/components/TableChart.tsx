
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Table } from 'lucide-react';
import { TableData, prepareChartData, isNumericData } from '@/utils/tableDetector';
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface TableChartProps {
  table: TableData;
  index: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

const TableChart = ({ table, index }: TableChartProps) => {
  const [chartType, setChartType] = React.useState<'table' | 'bar' | 'line' | 'pie'>('table');
  
  const chartData = prepareChartData(table);
  const hasNumericData = isNumericData(table.rows);
  
  const renderTableCell = (content: string) => {
    return (
      <div className="prose max-w-none text-sm">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
          components={{
            p: ({ node, ...props }) => <span {...props} />,
            strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
            em: ({ node, ...props }) => <em className="italic" {...props} />,
            code: ({ node, ...props }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };
  
  const renderChart = () => {
    if (!hasNumericData || chartType === 'table') {
      return (
        <div className="max-h-96 overflow-auto">
          <UITable>
            <TableHeader>
              <TableRow>
                {table.headers.map((header, i) => (
                  <TableHead key={i}>{renderTableCell(header)}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.map((row, i) => (
                <TableRow key={i}>
                  {row.map((cell, j) => (
                    <TableCell key={j}>{renderTableCell(cell)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </UITable>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {table.headers.slice(1).map((header, i) => (
                <Bar key={header} dataKey={header} fill={COLORS[i % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {table.headers.slice(1).map((header, i) => (
                <Line key={header} type="monotone" dataKey={header} stroke={COLORS[i % COLORS.length]} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        // For pie chart, use the first numeric column
        const firstNumericHeader = table.headers.slice(1).find(header => {
          return table.rows.some(row => {
            const cellIndex = table.headers.indexOf(header);
            return !isNaN(parseFloat(row[cellIndex]));
          });
        });
        
        if (firstNumericHeader) {
          const pieData = chartData.map(item => ({
            name: item.name,
            value: item[firstNumericHeader]
          })).filter(item => !isNaN(item.value));
          
          return (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          );
        }
        return <div className="text-center text-gray-500 py-8">No numeric data available for pie chart</div>;
      
      default:
        return null;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Data Table {index + 1}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={chartType === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('table')}
            >
              <Table className="h-4 w-4" />
            </Button>
            {hasNumericData && (
              <>
                <Button
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === 'line' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('line')}
                >
                  <LineChartIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === 'pie' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('pie')}
                >
                  <PieChartIcon className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default TableChart;
