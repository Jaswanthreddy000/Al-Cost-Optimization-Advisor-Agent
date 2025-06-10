
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, LogIn, Workflow, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatInterfaceWithSidebar from '@/components/ChatInterfaceWithSidebar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import About from '@/components/About';
import UserMenu from '@/components/UserMenu';
import WorkflowBuilder from './WorkflowBuilder';
import ProblemSection from '@/components/ProblemSection';
import TransformationSection from '@/components/TransformationSection';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import { useAuth } from '@/hooks/useAuth';
import { useFirebaseAnalytics } from '@/hooks/useFirebaseAnalytics';

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { trackEvent } = useFirebaseAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl mb-4 mx-auto w-fit">
            <Bot  className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleGetStarted = () => {
    trackEvent('get_started_clicked', { user_authenticated: !!user });
    if (user) {
      setActiveTab("chat");
    } else {
      navigate('/auth');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    trackEvent('tab_changed', { tab: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Cost Optimizer
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="home">Home</TabsTrigger>
                  <TabsTrigger value="chat">AI Chat</TabsTrigger>
                  <TabsTrigger value="workflow">
                    <Workflow className="h-4 w-4 mr-1" />
                    Workflows
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {user ? (
                <UserMenu user={user} />
              ) : (
                <Button 
                  onClick={() => {
                    trackEvent('sign_in_clicked', { location: 'header' });
                    navigate('/auth');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsContent value="home" className="mt-0">
            <div className="space-y-0 pb-0">
              <Hero onGetStarted={handleGetStarted} />
              <ProblemSection />
              <TransformationSection />
              <Features />
              <PricingSection />
              <TestimonialsSection />
              <FAQSection />
              
              {/* Final CTA Section */}
              <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Ready to Cut Your AI Costs in Half?
                  </h2>
                  <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    Join thousands of companies already saving millions with intelligent AI cost optimization. 
                    Get your free analysis in minutes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      variant="secondary"
                      onClick={() => {
                        trackEvent('final_cta_clicked', { user_authenticated: !!user });
                        if (user) {
                          setActiveTab("chat");
                        } else {
                          navigate('/auth');
                        }
                      }}
                      className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
                    >
                      {user ? "Start Optimizing Now" : "Get Free Analysis"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
                    >
                      Schedule Demo
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            {user ? (
              <ChatInterfaceWithSidebar />
            ) : (
              <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-white/80 backdrop-blur-sm border-2 border-gray-200 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl mb-6 mx-auto w-fit">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Authentication Required
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Please sign in to access the AI Cost Optimization chat interface and start saving on your AI costs.
                    </p>
                    <Button 
                      onClick={() => {
                        trackEvent('auth_required_sign_in_clicked');
                        navigate('/auth');
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In to Continue
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="workflow" className="mt-0">
            {user ? (
              <WorkflowBuilder />
            ) : (
              <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-white/80 backdrop-blur-sm border-2 border-gray-200 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl mb-6 mx-auto w-fit">
                      <Workflow className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Authentication Required
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Please sign in to access the AI Workflow Builder and create your custom AI optimization pipelines.
                    </p>
                    <Button 
                      onClick={() => {
                        trackEvent('workflow_auth_required_clicked');
                        navigate('/auth');
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In to Continue
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer - only show on home tab */}
      {activeTab === "home" && (
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">AI Cost Optimizer</span>
                </div>
                <p className="text-gray-400">
                  Intelligent AI cost optimization through advanced agent orchestration and workflow automation.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">AI Chat Analysis</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Workflow Builder</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cost Dashboard</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">ROI Tracking</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <p className="text-gray-400">support@aicostoptimizer.com</p>
                <p className="text-gray-400">+1 (555) 123-4567</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 AI Cost Optimizer. All rights reserved. Save up to 60% on AI costs with intelligent optimization.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;
