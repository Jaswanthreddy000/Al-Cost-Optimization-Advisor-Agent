
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const faqs = [
    {
      question: "How much can I really save on AI costs?",
      answer: "Most of our customers see 40-60% reduction in AI infrastructure costs within the first 3 months. The exact savings depend on your current setup, but our AI agents identify optimization opportunities across model selection, deployment strategies, and resource allocation."
    },
    {
      question: "What makes your workflow builder different?",
      answer: "Our workflow builder uses intelligent AI agents that can automatically optimize your AI pipelines. Unlike traditional tools, it learns from your usage patterns and continuously suggests improvements while handling complex orchestration tasks automatically."
    },
    {
      question: "Do you support all major cloud providers?",
      answer: "Yes, we support AWS, Google Cloud, Azure, and other major cloud providers. Our multi-cloud optimization ensures you get the best performance and pricing across different platforms."
    },
    {
      question: "How long does it take to see results?",
      answer: "You can start seeing initial insights within minutes of connecting your systems. Significant cost optimizations typically begin showing within 1-2 weeks as our AI agents analyze your patterns and implement recommendations."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption, comply with SOC 2 standards, and never store your sensitive data. All analysis happens in secure, isolated environments with strict access controls."
    },
    {
      question: "Can I integrate with existing tools?",
      answer: "Yes, we offer APIs and integrations with popular tools like Kubernetes, Docker, monitoring solutions, and CI/CD pipelines. Our team can help with custom integrations for enterprise customers."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            <HelpCircle className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Everything You Need to Know
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to common questions about AI cost optimization and our platform.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Button variant="outline" className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50">
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
