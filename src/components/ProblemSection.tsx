
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Clock, DollarSign } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: DollarSign,
      title: "Escalating AI Costs",
      description: "Companies spend 40-60% more than necessary on AI infrastructure due to poor optimization",
      stat: "60% overspend"
    },
    {
      icon: Clock,
      title: "Manual Analysis Takes Forever",
      description: "Teams waste weeks manually analyzing AI costs and performance across different providers",
      stat: "2-3 weeks"
    },
    {
      icon: TrendingUp,
      title: "No Clear ROI Visibility",
      description: "Organizations struggle to justify AI investments without transparent cost-benefit analysis",
      stat: "70% uncertain"
    },
    {
      icon: AlertTriangle,
      title: "Complex Decision Making",
      description: "Choosing the right AI models and deployment strategies becomes overwhelming",
      stat: "100+ options"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-red-100 text-red-700 border-red-200">
            <AlertTriangle className="w-4 h-4 mr-2" />
            The Problem
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            AI Costs Are Spiraling Out of Control
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Organizations are struggling with unpredictable AI expenses, lack of optimization insights, 
            and complex decision-making processes that lead to significant budget overruns.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => {
            const IconComponent = problem.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-600 mb-2">{problem.stat}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{problem.title}</h3>
                  <p className="text-gray-600 text-sm">{problem.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
