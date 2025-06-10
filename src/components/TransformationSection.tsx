
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap } from 'lucide-react';

const TransformationSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
          <Zap className="w-4 h-4 mr-2" />
          The Transformation
        </Badge>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          From Cost Chaos to 
          <br />
          <span className="text-yellow-300">Strategic Optimization</span>
        </h2>
        
        <p className="text-xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
          Imagine having complete visibility into your AI costs, automated optimization recommendations, 
          and intelligent workflow management that reduces expenses by up to 60% while improving performance.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Analyze</h3>
            <p className="text-blue-100">AI agents analyze your current setup and identify optimization opportunities</p>
          </div>
          
          <div className="text-center">
            <ArrowRight className="h-8 w-8 mx-auto mb-8 text-yellow-300" />
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Optimize</h3>
            <p className="text-blue-100">Build custom workflows that automatically optimize costs and performance</p>
          </div>
          
          <div className="text-center">
            <ArrowRight className="h-8 w-8 mx-auto mb-8 text-yellow-300" />
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Scale</h3>
            <p className="text-blue-100">Monitor and continuously improve your AI operations with intelligent insights</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationSection;
