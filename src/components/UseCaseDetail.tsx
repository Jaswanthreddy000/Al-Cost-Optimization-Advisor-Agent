
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, DollarSign, CheckCircle, Zap, Users, Building2 } from 'lucide-react';

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
}

interface UseCaseDetailProps {
  useCase: UseCase;
  onBack: () => void;
  onDeploy: (workflowId: string) => void;
}

const UseCaseDetail: React.FC<UseCaseDetailProps> = ({ useCase, onBack, onDeploy }) => {
  const processSteps = [
    {
      step: 1,
      title: "Data Input",
      description: "Documents, emails, or data are automatically ingested from your existing systems."
    },
    {
      step: 2,
      title: "AI Processing",
      description: "Advanced AI models analyze and extract key information with high accuracy."
    },
    {
      step: 3,
      title: "Validation & Quality Check",
      description: "Built-in validation ensures accuracy and flags any items requiring human review."
    },
    {
      step: 4,
      title: "Output & Integration",
      description: "Processed results are automatically sent to your downstream systems or workflows."
    }
  ];

  const costBreakdown = [
    { item: "AI Model Usage", cost: "$0.015 per document" },
    { item: "Data Processing", cost: "$0.003 per document" },
    { item: "Quality Validation", cost: "$0.002 per document" },
    { item: "Total Cost", cost: useCase.estimatedCost, highlighted: true }
  ];

  const roiMetrics = [
    { label: "Time Savings", value: "85%", description: "Reduce manual processing time" },
    { label: "Accuracy Improvement", value: "99%", description: "Consistent AI-driven accuracy" },
    { label: "Cost Reduction", value: "70%", description: "Lower operational costs" },
    { label: "Scalability", value: "10x", description: "Handle 10x more volume" }
  ];

  const recommendedModels = [
    { name: "GPT-4", version: "2024-04-09", provider: "OpenAI", useCase: "Document understanding" },
    { name: "Claude-3", version: "Sonnet", provider: "Anthropic", useCase: "Data extraction" },
    { name: "Gemini Pro", version: "1.5", provider: "Google", useCase: "Classification" }
  ];

  const caseStudies = [
    {
      company: "TechCorp Inc.",
      industry: "SaaS",
      result: "Reduced invoice processing time from 4 hours to 15 minutes per batch",
      savings: "$45,000 annually"
    },
    {
      company: "Global Finance Ltd.",
      industry: "Finance",
      result: "Improved accuracy from 85% to 99.2% while processing 5x more volume",
      savings: "$120,000 annually"
    }
  ];

  const handleDeployWorkflow = () => {
    if (useCase.workflowId) {
      onDeploy(useCase.workflowId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>
                Use Cases
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{useCase.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Use Cases
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{useCase.title}</h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl">{useCase.summary}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Industries:</span>
              {useCase.industries.map((industry) => (
                <Badge key={industry} variant="secondary">
                  {industry}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Functions:</span>
              {useCase.functions.map((func) => (
                <Badge key={func} variant="outline">
                  {func}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Process Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  How It Works
                </CardTitle>
                <CardDescription>
                  Step-by-step automation process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {processSteps.map((step, index) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Models */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended AI Models</CardTitle>
                <CardDescription>
                  Optimal models and APIs for this use case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedModels.map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">{model.name}</h4>
                        <p className="text-sm text-gray-600">{model.provider} • {model.version}</p>
                      </div>
                      <Badge variant="outline">{model.useCase}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Case Studies */}
            <Card>
              <CardHeader>
                <CardTitle>Success Stories</CardTitle>
                <CardDescription>
                  Real customer examples and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {caseStudies.map((study, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-6 py-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{study.company}</h4>
                        <Badge variant="secondary">{study.industry}</Badge>
                      </div>
                      <p className="text-gray-700 mb-2">{study.result}</p>
                      <div className="flex items-center gap-2 text-green-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold">{study.savings}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cost & ROI */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Cost & ROI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cost Breakdown */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h4>
                  <div className="space-y-2">
                    {costBreakdown.map((item, index) => (
                      <div key={index} className={`flex justify-between text-sm ${item.highlighted ? 'font-semibold border-t pt-2' : ''}`}>
                        <span className="text-gray-600">{item.item}</span>
                        <span className="text-gray-900">{item.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROI Metrics */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Expected Impact</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {roiMetrics.map((metric, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                        <div className="text-xs text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Badge className="w-full justify-center bg-green-50 text-green-700 border-green-200">
                  {useCase.impactTag}
                </Badge>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleDeployWorkflow}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Deploy This Workflow
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Ready-to-deploy workflow templates with pre-configured AI models and integrations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCaseDetail;
