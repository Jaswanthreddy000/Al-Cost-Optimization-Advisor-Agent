import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle, Zap, Cloud, Cpu, Database, Users, Calendar, Activity, FileText, BarChart3 } from 'lucide-react';
import TableChart from './TableChart';
import { detectTablesInText } from '@/utils/tableDetector';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface DashboardSection {
  title: string;
  content: string;
  type: 'section' | 'calculation' | 'assumptions' | 'strategies';
  subsections?: DashboardSection[];
  cards?: InsightCard[];
  charts?: ChartData[];
  tables?: any[];
}

interface InsightCard {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
  category?: string;
}

interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: any[];
  xAxis: string;
  yAxis: string[];
  description?: string;
}

interface Recommendation {
  text: string;
  priority: 'high' | 'medium' | 'low';
  savings?: string;
  category?: string;
}

interface Callout {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
}

const iconMap: { [key: string]: any } = {
  'dollar': DollarSign,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'target': Target,
  'cloud': Cloud,
  'cpu': Cpu,
  'database': Database,
  'zap': Zap,
  'users': Users,
  'calendar': Calendar,
  'activity': Activity,
};

const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#ffb347'];

const DashboardRenderer = ({ content }: { content: string }) => {
  const parsedData = parseStructuredContent(content);

  if (!parsedData || parsedData.sections.length === 0) {
    return (
      <div className="prose max-w-none text-sm leading-relaxed">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ node, ...props }) => <h1 className="mt-4 mb-2 text-xl font-bold" {...props} />,
            h2: ({ node, ...props }) => <h2 className="mt-4 mb-2 text-lg font-semibold" {...props} />,
            h3: ({ node, ...props }) => <h3 className="mt-4 mb-2 text-base font-medium" {...props} />,
            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Render structured sections */}
      {parsedData.sections.map((section, index) => (
        <DashboardSection key={index} section={section} />
      ))}

      {/* Global recommendations if any */}
      {parsedData.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Actionable Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {parsedData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="prose max-w-none text-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {rec.text}
                      </ReactMarkdown>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={
                        rec.priority === 'high' ? 'destructive' :
                        rec.priority === 'medium' ? 'default' : 'secondary'
                      } className="text-xs">
                        {rec.priority} priority
                      </Badge>
                      {rec.savings && (
                        <Badge variant="outline" className="text-green-600 text-xs">
                          {rec.savings} savings
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Global callouts if any */}
      {parsedData.callouts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parsedData.callouts.map((callout, index) => (
            <Card key={index} className={`border-l-4 ${
              callout.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
              callout.type === 'success' ? 'border-l-green-500 bg-green-50' :
              'border-l-blue-500 bg-blue-50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {callout.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />}
                  {callout.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />}
                  {callout.type === 'info' && <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{callout.title}</h4>
                    <div className="prose max-w-none text-sm mt-1">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {callout.description}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const DashboardSection = ({ section }: { section: DashboardSection }) => {
  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'calculation': return <DollarSign className="h-5 w-5" />;
      case 'assumptions': return <FileText className="h-5 w-5" />;
      case 'strategies': return <Target className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center text-gray-900">
          {getSectionIcon(section.type)}
          <span className="ml-2">{section.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section content with markdown */}
        {section.content && (
          <div className="prose max-w-none text-sm leading-relaxed">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ node, ...props }) => <h1 className="mt-4 mb-2 text-lg font-bold" {...props} />,
                h2: ({ node, ...props }) => <h2 className="mt-4 mb-2 text-base font-semibold" {...props} />,
                h3: ({ node, ...props }) => <h3 className="mt-4 mb-2 text-sm font-medium" {...props} />,
                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
              }}
            >
              {section.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Cards within section */}
        {section.cards && section.cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.cards.map((card, index) => {
              const IconComponent = iconMap[card.icon] || DollarSign;
              return (
                <Card key={index} className="bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{card.title}</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{card.value}</p>
                        {card.change && (
                          <div className={`flex items-center mt-1 text-sm ${
                            card.trend === 'up' ? 'text-green-600' : 
                            card.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {card.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                            {card.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                            <span className="font-medium">{card.change}</span>
                          </div>
                        )}
                      </div>
                      <div className={`p-2 rounded-lg ${card.color} flex-shrink-0`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Charts within section */}
        {section.charts && section.charts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {section.charts.map((chart, index) => (
              <Card key={index} className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{chart.title}</CardTitle>
                  {chart.description && (
                    <p className="text-sm text-gray-600">{chart.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    {chart.type === 'bar' ? (
                      <BarChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={chart.xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {chart.yAxis.map((axis, i) => (
                          <Bar key={axis} dataKey={axis} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </BarChart>
                    ) : chart.type === 'line' ? (
                      <LineChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={chart.xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {chart.yAxis.map((axis, i) => (
                          <Line key={axis} type="monotone" dataKey={axis} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} />
                        ))}
                      </LineChart>
                    ) : chart.type === 'area' ? (
                      <AreaChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={chart.xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {chart.yAxis.map((axis, i) => (
                          <Area key={axis} type="monotone" dataKey={axis} stackId="1" stroke={CHART_COLORS[i % CHART_COLORS.length]} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </AreaChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={chart.data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chart.data.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tables within section */}
        {section.tables && section.tables.length > 0 && (
          <div className="space-y-4">
            {section.tables.map((table, index) => (
              <TableChart key={index} table={table} index={index} />
            ))}
          </div>
        )}

        {/* Subsections */}
        {section.subsections && section.subsections.length > 0 && (
          <div className="space-y-4 border-l-2 border-gray-200 pl-4">
            {section.subsections.map((subsection, index) => (
              <DashboardSection key={index} section={subsection} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const parseStructuredContent = (content: string) => {
  const lines = content.split('\n');
  const sections: DashboardSection[] = [];
  const globalRecommendations: Recommendation[] = [];
  const globalCallouts: Callout[] = [];
  
  // Detect tables using existing utility
  const tables = detectTablesInText(content);
  
  let currentSection: DashboardSection | null = null;
  let currentSubsection: DashboardSection | null = null;
  let usedLineIndices = new Set<number>();
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Detect main sections (h1, h2 headers or strong patterns)
    if (line.match(/^#+\s+/) || line.match(/^\*\*[^*]+\*\*$/) || 
        line.match(/^[A-Z][A-Za-z\s]+:$/) || line.match(/^## /)) {
      
      // Save previous section
      if (currentSection) {
        sections.push(currentSection);
      }
      
      const sectionTitle = line.replace(/^#+\s*/, '').replace(/^\*\*|\*\*$/g, '').replace(/:$/, '').trim();
      const sectionType = getSectionType(sectionTitle, line);
      
      currentSection = {
        title: sectionTitle,
        content: '',
        type: sectionType,
        subsections: [],
        cards: [],
        charts: [],
        tables: []
      };
      currentSubsection = null;
      usedLineIndices.add(i);
      continue;
    }
    
    // Detect subsections (h3, h4 or nested patterns)
    if (currentSection && (line.match(/^###\s+/) || line.match(/^\d+\.\s+[A-Z]/) || 
        line.match(/^[A-Z][A-Za-z\s&()]+:$/))) {
      
      const subsectionTitle = line.replace(/^###\s*/, '').replace(/^\d+\.\s*/, '').replace(/:$/, '').trim();
      
      currentSubsection = {
        title: subsectionTitle,
        content: '',
        type: getSectionType(subsectionTitle, line),
        cards: [],
        charts: [],
        tables: []
      };
      
      if (currentSection.subsections) {
        currentSection.subsections.push(currentSubsection);
      }
      usedLineIndices.add(i);
      continue;
    }
    
    // Parse specific patterns for cards, but group related content
    if (line.match(/^[🟦💸🚀📊💰⚡🔥📈📉🎯⭐👥📅💡⚙️🏢]/)) {
      const target = currentSubsection || currentSection;
      if (target) {
        const card = parseInsightCard(line);
        if (card && target.cards) {
          target.cards.push(card);
        }
      }
      usedLineIndices.add(i);
      continue;
    }
    
    // Parse recommendations
    if (line.match(/^[✅✓•-]\s/)) {
      const rec = parseRecommendation(line);
      if (rec) {
        globalRecommendations.push(rec);
      }
      usedLineIndices.add(i);
      continue;
    }
    
    // Parse callouts
    if (line.match(/^[⚠️🚨✅🎉📢💡]/)) {
      const callout = parseCallout(line, lines, i);
      if (callout) {
        globalCallouts.push(callout);
        if (callout.description && i + 1 < lines.length) {
          usedLineIndices.add(i + 1);
        }
      }
      usedLineIndices.add(i);
      continue;
    }
    
    // Add remaining content to current section/subsection
    if (!usedLineIndices.has(i)) {
      const target = currentSubsection || currentSection;
      if (target) {
        target.content += (target.content ? '\n' : '') + line;
      }
    }
  }
  
  // Add the last section
  if (currentSection) {
    sections.push(currentSection);
  }
  
  // Distribute tables to relevant sections
  distributeTablesIntoSections(sections, tables);
  
  // Collect remaining unprocessed text
  const remainingLines = lines.filter((_, index) => !usedLineIndices.has(index) && lines[index].trim().length > 0);
  const remainingText = remainingLines.join('\n').trim();
  
  return {
    sections,
    recommendations: globalRecommendations,
    callouts: globalCallouts,
    remainingText: remainingText.length > 0 ? remainingText : undefined
  };
};

const getSectionType = (title: string, line: string): 'section' | 'calculation' | 'assumptions' | 'strategies' => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('cost') && (lowerTitle.includes('calculation') || lowerTitle.includes('breakdown'))) return 'calculation';
  if (lowerTitle.includes('assumption')) return 'assumptions';
  if (lowerTitle.includes('strategy') || lowerTitle.includes('optimization') || lowerTitle.includes('recommendation')) return 'strategies';
  return 'section';
};

const parseInsightCard = (line: string): InsightCard | null => {
  const parts = line.split(':');
  if (parts.length >= 2) {
    const title = parts[0].replace(/^[🟦💸🚀📊💰⚡🔥📈📉🎯⭐👥📅💡⚙️🏢]\s*/, '').trim();
    const value = parts.slice(1).join(':').trim();
    
    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    let change = '';
    
    const changeMatch = value.match(/\(([^)]+)\)/);
    if (changeMatch) {
      change = changeMatch[1];
      trend = change.includes('↑') || change.includes('+') || change.toLowerCase().includes('increase') ? 'up' : 
             change.includes('↓') || change.includes('-') || change.toLowerCase().includes('decrease') ? 'down' : 'neutral';
    }
    
    return {
      title,
      value: value.replace(/\([^)]+\)/, '').trim(),
      change,
      trend,
      icon: getIconForTitle(title),
      color: getColorForTitle(title)
    };
  }
  return null;
};

const parseRecommendation = (line: string): Recommendation | null => {
  const text = line.replace(/^[✅✓•-]\s*/, '').trim();
  const priority = text.toLowerCase().includes('critical') || text.toLowerCase().includes('urgent') ? 'high' :
                  text.toLowerCase().includes('important') ? 'medium' : 'low';
  
  const savingsMatch = text.match(/\$[\d,]+|\d+%/);
  const savings = savingsMatch ? savingsMatch[0] : undefined;
  
  return {
    text: text.replace(/\([^)]*savings[^)]*\)/i, '').trim(),
    priority,
    savings
  };
};

const parseCallout = (line: string, lines: string[], index: number): Callout | null => {
  const type = line.startsWith('⚠️') || line.startsWith('🚨') ? 'warning' :
               line.startsWith('✅') || line.startsWith('🎉') ? 'success' : 'info';
  
  const title = line.replace(/^[⚠️🚨✅🎉📢💡]\s*/, '').trim();
  let description = '';
  
  if (index + 1 < lines.length && !lines[index + 1].match(/^[🟦💸🚀📊💰⚡🔥📈📉🎯⭐✅✓•-⚠️🚨🎉📢💡👥📅⚙️🏢]/)) {
    description = lines[index + 1].trim();
  }
  
  return { type, title, description };
};

const distributeTablesIntoSections = (sections: DashboardSection[], tables: any[]) => {
  // Simple distribution - add tables to the first section or create a data section
  if (tables.length > 0) {
    if (sections.length > 0) {
      sections[0].tables = tables;
    } else {
      sections.push({
        title: 'Data Tables',
        content: '',
        type: 'section',
        tables: tables
      });
    }
  }
};

const getIconForTitle = (title: string): string => {
  const lower = title.toLowerCase();
  if (lower.includes('cost') || lower.includes('spend') || lower.includes('price')) return 'dollar';
  if (lower.includes('savings') || lower.includes('optimization')) return 'trending-down';
  if (lower.includes('growth') || lower.includes('increase')) return 'trending-up';
  if (lower.includes('target') || lower.includes('goal')) return 'target';
  if (lower.includes('cloud') || lower.includes('provider')) return 'cloud';
  if (lower.includes('cpu') || lower.includes('compute')) return 'cpu';
  if (lower.includes('database') || lower.includes('storage')) return 'database';
  if (lower.includes('performance') || lower.includes('speed')) return 'zap';
  if (lower.includes('user') || lower.includes('team')) return 'users';
  if (lower.includes('time') || lower.includes('date')) return 'calendar';
  return 'activity';
};

const getColorForTitle = (title: string): string => {
  const lower = title.toLowerCase();
  if (lower.includes('cost') || lower.includes('spend')) return 'bg-red-500';
  if (lower.includes('savings')) return 'bg-green-500';
  if (lower.includes('cloud')) return 'bg-blue-500';
  if (lower.includes('performance')) return 'bg-purple-500';
  if (lower.includes('user')) return 'bg-indigo-500';
  return 'bg-gray-500';
};

export default DashboardRenderer;
