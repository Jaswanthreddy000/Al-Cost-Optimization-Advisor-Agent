
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO",
      company: "TechFlow Inc.",
      content: "AI Cost Optimizer helped us reduce our AI infrastructure costs by 55% in just 3 months. The workflow builder is incredibly intuitive and the insights are actionable.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Engineering",
      company: "DataStream Corp",
      content: "The AI agent orchestration is game-changing. We went from spending weeks on cost analysis to getting comprehensive reports in minutes.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Thompson",
      role: "VP of Operations",
      company: "CloudScale Solutions",
      content: "ROI tracking and multi-cloud optimization features have transformed how we approach AI investments. Highly recommended for any AI-driven company.",
      rating: 5,
      avatar: "ET"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200">
            <Quote className="w-4 h-4 mr-2" />
            Customer Success
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Trusted by Leading Companies
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how organizations like yours are saving thousands on AI costs and 
            optimizing their operations with our platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="text-lg font-semibold">Trusted by 500+ companies</div>
            <div>•</div>
            <div className="text-lg font-semibold">$2M+ saved monthly</div>
            <div>•</div>
            <div className="text-lg font-semibold">99.9% uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
