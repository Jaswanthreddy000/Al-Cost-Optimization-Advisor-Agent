
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowRight, DollarSign, Clock, Users } from 'lucide-react';
import UseCaseDetail from './UseCaseDetail';

interface UseCase {
  id: string;
  title: string;
  summary: string;
  industries: string[];
  functions: string[];
  estimatedCost: string;
  savings: string;
  impactTag: string;
  workflowId?: string;
  hoverMetric?: string;
}

const useCases: UseCase[] = [
  {
    id: '1',
    title: 'Automate Invoice Processing',
    summary: 'Extract and categorize invoice data automatically using AI document processing with 99% accuracy.',
    industries: ['Finance', 'SaaS', 'E-commerce'],
    functions: ['Finance Ops', 'Accounting'],
    estimatedCost: '$0.02 per invoice',
    savings: 'Save 85% processing time',
    impactTag: 'Reduces manual work by 90%',
    workflowId: 'invoice-automation',
    hoverMetric: 'Saves 90% time'
  },
  {
    id: '2',
    title: 'Customer Support Ticket Routing',
    summary: 'Automatically categorize and route customer tickets to the right team using AI classification.',
    industries: ['SaaS', 'E-commerce', 'Healthcare'],
    functions: ['Customer Support', 'Operations'],
    estimatedCost: '$0.01 per ticket',
    savings: 'Reduce response time by 60%',
    impactTag: 'Improves customer satisfaction by 40%',
    workflowId: 'ticket-routing',
    hoverMetric: 'Improves satisfaction by 40%'
  },
  {
    id: '3',
    title: 'Contract Analysis & Review',
    summary: 'Scan legal contracts for key terms, risks, and compliance issues using advanced NLP models.',
    industries: ['Legal', 'Finance', 'Real Estate'],
    functions: ['Legal Ops', 'Compliance'],
    estimatedCost: '$0.15 per page',
    savings: 'Save 70% review time',
    impactTag: 'Reduces legal review costs by 65%',
    workflowId: 'contract-analysis',
    hoverMetric: 'Reduces costs by 65%'
  },
  {
    id: '4',
    title: 'HR Resume Screening',
    summary: 'Automatically screen resumes and rank candidates based on job requirements and qualifications.',
    industries: ['HR Tech', 'Recruiting', 'SaaS'],
    functions: ['HR Automation', 'Talent Acquisition'],
    estimatedCost: '$0.05 per resume',
    savings: 'Screen 10x faster',
    impactTag: 'Improves hiring quality by 35%',
    workflowId: 'resume-screening',
    hoverMetric: 'Screen 10x faster'
  },
  {
    id: '5',
    title: 'Social Media Content Moderation',
    summary: 'Detect and flag inappropriate content across social platforms using AI vision and text analysis.',
    industries: ['Social Media', 'Gaming', 'Education'],
    functions: ['Content Moderation', 'Safety'],
    estimatedCost: '$0.001 per post',
    savings: 'Scale moderation 100x',
    impactTag: 'Reduces harmful content by 95%',
    workflowId: 'content-moderation',
    hoverMetric: 'Scale 100x capacity'
  },
  {
    id: '6',
    title: 'Email Campaign Optimization',
    summary: 'Generate personalized email content and optimize send times using AI behavioral analysis.',
    industries: ['Marketing', 'E-commerce', 'SaaS'],
    functions: ['Marketing Automation', 'Growth'],
    estimatedCost: '$0.03 per email',
    savings: 'Increase open rates by 45%',
    impactTag: 'Boosts conversion by 25%',
    workflowId: 'email-optimization',
    hoverMetric: 'Boosts conversion by 25%'
  },
  {
    id: '7',
    title: 'Document Classification',
    summary: 'Automatically categorize and organize documents using machine learning classification models.',
    industries: ['Legal', 'Healthcare', 'Finance'],
    functions: ['Document Management', 'Operations'],
    estimatedCost: '$0.01 per document',
    savings: 'Save 80% sorting time',
    impactTag: 'Improves organization by 95%',
    workflowId: 'document-classification',
    hoverMetric: 'Improves organization by 95%'
  },
  {
    id: '8',
    title: 'Expense Report Processing',
    summary: 'Extract and validate expense data from receipts and forms automatically.',
    industries: ['Finance', 'Corporate', 'SaaS'],
    functions: ['Finance Ops', 'Accounting'],
    estimatedCost: '$0.05 per receipt',
    savings: 'Reduce processing time by 75%',
    impactTag: 'Cuts expense processing costs by 60%',
    workflowId: 'expense-processing',
    hoverMetric: 'Cuts costs by 60%'
  },
  {
    id: '9',
    title: 'Lead Qualification & Scoring',
    summary: 'Score and qualify sales leads automatically using AI analysis of behavior and demographics.',
    industries: ['SaaS', 'Sales', 'Marketing'],
    functions: ['Sales Ops', 'Lead Generation'],
    estimatedCost: '$0.02 per lead',
    savings: 'Increase qualified leads by 50%',
    impactTag: 'Improves conversion rates by 30%',
    workflowId: 'lead-scoring',
    hoverMetric: 'Improves conversion by 30%'
  },
  {
    id: '10',
    title: 'Inventory Management',
    summary: 'Predict inventory needs and automate reordering using demand forecasting AI.',
    industries: ['E-commerce', 'Retail', 'Manufacturing'],
    functions: ['Operations', 'Supply Chain'],
    estimatedCost: '$0.10 per SKU',
    savings: 'Reduce stockouts by 60%',
    impactTag: 'Cuts inventory costs by 25%',
    workflowId: 'inventory-management',
    hoverMetric: 'Cuts costs by 25%'
  },
  {
    id: '11',
    title: 'Quality Control Inspection',
    summary: 'Automate visual quality control using computer vision to detect defects and anomalies.',
    industries: ['Manufacturing', 'Food', 'Automotive'],
    functions: ['Quality Assurance', 'Operations'],
    estimatedCost: '$0.08 per inspection',
    savings: 'Reduce defects by 85%',
    impactTag: 'Improves quality consistency by 90%',
    workflowId: 'quality-control',
    hoverMetric: 'Improves quality by 90%'
  },
  {
    id: '12',
    title: 'Customer Churn Prediction',
    summary: 'Identify customers at risk of churning using behavioral analysis and engagement patterns.',
    industries: ['SaaS', 'Telecom', 'Subscription'],
    functions: ['Customer Success', 'Analytics'],
    estimatedCost: '$0.05 per customer',
    savings: 'Reduce churn by 40%',
    impactTag: 'Increases retention by 35%',
    workflowId: 'churn-prediction',
    hoverMetric: 'Increases retention by 35%'
  },
  {
    id: '13',
    title: 'Medical Record Analysis',
    summary: 'Extract and analyze patient data from medical records for faster diagnosis and treatment.',
    industries: ['Healthcare', 'Medical', 'Insurance'],
    functions: ['Clinical Operations', 'Data Analysis'],
    estimatedCost: '$0.20 per record',
    savings: 'Speed up analysis by 70%',
    impactTag: 'Improves diagnostic accuracy by 80%',
    workflowId: 'medical-analysis',
    hoverMetric: 'Improves accuracy by 80%'
  },
  {
    id: '14',
    title: 'Financial Risk Assessment',
    summary: 'Assess loan and credit risks automatically using AI analysis of financial data.',
    industries: ['Banking', 'Finance', 'Insurance'],
    functions: ['Risk Management', 'Underwriting'],
    estimatedCost: '$0.12 per assessment',
    savings: 'Reduce assessment time by 80%',
    impactTag: 'Improves risk accuracy by 65%',
    workflowId: 'risk-assessment',
    hoverMetric: 'Improves accuracy by 65%'
  },
  {
    id: '15',
    title: 'Product Recommendation Engine',
    summary: 'Generate personalized product recommendations using collaborative filtering and user behavior.',
    industries: ['E-commerce', 'Retail', 'Media'],
    functions: ['Marketing', 'Product Management'],
    estimatedCost: '$0.01 per recommendation',
    savings: 'Increase sales by 35%',
    impactTag: 'Boosts revenue by 25%',
    workflowId: 'product-recommendations',
    hoverMetric: 'Boosts revenue by 25%'
  },
  {
    id: '16',
    title: 'Fraud Detection System',
    summary: 'Detect fraudulent transactions and activities in real-time using pattern recognition.',
    industries: ['Banking', 'E-commerce', 'Insurance'],
    functions: ['Security', 'Risk Management'],
    estimatedCost: '$0.03 per transaction',
    savings: 'Reduce fraud by 90%',
    impactTag: 'Prevents 95% of fraud attempts',
    workflowId: 'fraud-detection',
    hoverMetric: 'Prevents 95% fraud'
  },
  {
    id: '17',
    title: 'Sentiment Analysis for Reviews',
    summary: 'Analyze customer reviews and feedback to understand sentiment and extract insights.',
    industries: ['E-commerce', 'Hospitality', 'SaaS'],
    functions: ['Customer Success', 'Product Management'],
    estimatedCost: '$0.002 per review',
    savings: 'Process 1000x more reviews',
    impactTag: 'Improves product insights by 85%',
    workflowId: 'sentiment-analysis',
    hoverMetric: 'Process 1000x more'
  },
  {
    id: '18',
    title: 'Automated Data Entry',
    summary: 'Convert handwritten forms and documents into structured digital data automatically.',
    industries: ['Healthcare', 'Government', 'Insurance'],
    functions: ['Data Operations', 'Administration'],
    estimatedCost: '$0.04 per form',
    savings: 'Eliminate 95% manual entry',
    impactTag: 'Reduces data entry costs by 85%',
    workflowId: 'data-entry',
    hoverMetric: 'Eliminates 95% manual work'
  },
  {
    id: '19',
    title: 'Supply Chain Optimization',
    summary: 'Optimize supply chain routes and logistics using AI-powered demand and route analysis.',
    industries: ['Logistics', 'Manufacturing', 'Retail'],
    functions: ['Supply Chain', 'Operations'],
    estimatedCost: '$0.25 per route',
    savings: 'Reduce logistics costs by 30%',
    impactTag: 'Improves delivery efficiency by 50%',
    workflowId: 'supply-chain',
    hoverMetric: 'Improves efficiency by 50%'
  },
  {
    id: '20',
    title: 'Content Generation & SEO',
    summary: 'Generate SEO-optimized content and meta descriptions automatically for websites.',
    industries: ['Marketing', 'Media', 'E-commerce'],
    functions: ['Content Marketing', 'SEO'],
    estimatedCost: '$0.50 per article',
    savings: 'Generate content 10x faster',
    impactTag: 'Improves SEO rankings by 40%',
    workflowId: 'content-generation',
    hoverMetric: 'Generate 10x faster'
  },
  {
    id: '21',
    title: 'Meeting Minutes Automation',
    summary: 'Automatically transcribe meetings and generate structured minutes with action items.',
    industries: ['Corporate', 'Consulting', 'Legal'],
    functions: ['Administration', 'Operations'],
    estimatedCost: '$0.15 per meeting',
    savings: 'Save 2 hours per meeting',
    impactTag: 'Eliminates manual note-taking',
    workflowId: 'meeting-minutes',
    hoverMetric: 'Save 2 hours per meeting'
  }
];

const industries = ['All Industries', 'SaaS', 'Finance', 'Healthcare', 'E-commerce', 'Legal', 'HR Tech', 'Marketing', 'Manufacturing', 'Banking', 'Insurance', 'Retail'];
const functions = ['All Functions', 'Finance Ops', 'Customer Support', 'HR Automation', 'Legal Ops', 'Marketing Automation', 'Operations', 'Sales Ops', 'Quality Assurance', 'Risk Management'];

const UseCases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedFunction, setSelectedFunction] = useState('All Functions');
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => prev + 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const filteredUseCases = useCases.filter(useCase => {
    const matchesSearch = useCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         useCase.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All Industries' || 
                           useCase.industries.includes(selectedIndustry);
    const matchesFunction = selectedFunction === 'All Functions' || 
                           useCase.functions.includes(selectedFunction);
    
    return matchesSearch && matchesIndustry && matchesFunction;
  });

  const handleUseCaseClick = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
  };

  const handleBackToOverview = () => {
    setSelectedUseCase(null);
  };

  const handleDeployWorkflow = (workflowId: string) => {
    // Navigate to workflow with the specific template
    console.log(`Deploying workflow: ${workflowId}`);
    // This would typically navigate to the workflow builder with the template loaded
    window.location.href = `/workflow-builder?template=${workflowId}`;
  };

  if (selectedUseCase) {
    return <UseCaseDetail useCase={selectedUseCase} onBack={handleBackToOverview} onDeploy={handleDeployWorkflow} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Automation Use Cases
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover proven AI automation examples that are saving companies millions. 
            Each use case includes cost estimates, ROI projections, and ready-to-deploy workflows.
          </p>
        </div>

        {/* Auto-scrolling Carousel */}
        <div className="mb-8 overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Automations</h2>
          <div className="relative">
            <div 
              className="flex gap-3 transition-transform duration-75 ease-linear"
              style={{
                transform: `translateX(-${(scrollPosition * 1.5) % (useCases.length * 250)}px)`,
                width: `${useCases.length * 500}px`
              }}
            >
              {[...useCases, ...useCases].map((useCase, index) => (
                <CarouselCard 
                  key={`${useCase.id}-${index}`} 
                  useCase={useCase} 
                  onClick={() => {
                    const targetElement = document.getElementById(`use-case-${useCase.id}`);
                    if (targetElement) {
                      targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search use cases (e.g., customer support, finance automation)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full md:w-48 h-11">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedFunction} onValueChange={setSelectedFunction}>
              <SelectTrigger className="w-full md:w-48 h-11">
                <SelectValue placeholder="Function" />
              </SelectTrigger>
              <SelectContent>
                {functions.map(func => (
                  <SelectItem key={func} value={func}>{func}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* All Use Cases Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Use Cases ({filteredUseCases.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUseCases.map((useCase) => (
              <div key={useCase.id} id={`use-case-${useCase.id}`}>
                <UseCaseCard 
                  useCase={useCase} 
                  onClick={() => handleUseCaseClick(useCase)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CarouselCardProps {
  useCase: UseCase;
  onClick: () => void;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ useCase, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex-shrink-0 w-60 h-24 cursor-pointer transition-all duration-300 transform hover:scale-105"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-3 h-full flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{useCase.title}</h3>
          </div>
          
          <div className={`transition-all duration-300 ${isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-1'}`}>
            <div className="bg-blue-50 text-blue-700 rounded px-2 py-1">
              <p className="text-xs font-medium">{useCase.hoverMetric}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface UseCaseCardProps {
  useCase: UseCase;
  onClick: () => void;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase, onClick }) => {
  return (
    <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white border border-gray-200" onClick={onClick}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
          {useCase.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-3">
          {useCase.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Industries */}
        <div>
          <div className="flex flex-wrap gap-1 mb-2">
            {useCase.industries.slice(0, 2).map((industry) => (
              <Badge key={industry} variant="secondary" className="text-xs">
                {industry}
              </Badge>
            ))}
            {useCase.industries.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{useCase.industries.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Functions */}
        <div>
          <div className="flex flex-wrap gap-1 mb-4">
            {useCase.functions.map((func) => (
              <Badge key={func} variant="outline" className="text-xs">
                {func}
              </Badge>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">{useCase.estimatedCost}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">{useCase.savings}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-gray-700">{useCase.impactTag}</span>
          </div>
        </div>

        {/* CTA */}
        <Button className="w-full mt-4" variant="default">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default UseCases;
