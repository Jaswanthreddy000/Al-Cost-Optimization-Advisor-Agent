import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Send, Bot, User, Loader2, AlertCircle, Brain, BarChart, FileText } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { useChatSession } from '@/hooks/useChatSession';
import ChatSidebar from './ChatSidebar';
import TableChart from './TableChart';
import DashboardRenderer from './DashboardRenderer';
import PdfDownloadControls from './PdfDownloadControls';
import MessageCheckbox from './MessageCheckbox';
import { detectTablesInText } from '@/utils/tableDetector';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';

const ChatInterfaceWithSidebar = () => {
  const { user } = useAuth();
  const {
    currentSessionId,
    messages,
    isLoading: sessionLoading,
    createNewSession,
    loadSession,
    saveMessage,
    updateSessionTitle,
    setMessages,
    clearCurrentSession,
  } = useChatSession();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageViewModes, setMessageViewModes] = useState<{[key: string]: 'text' | 'dashboard'}>({});
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = async () => {
    clearCurrentSession();
    await createNewSession();
  };

  const handleSessionSelect = async (sessionId: string) => {
    clearCurrentSession();
    await loadSession(sessionId);
  };

  const toggleMessageView = (messageId: string) => {
    setMessageViewModes(prev => ({
      ...prev,
      [messageId]: prev[messageId] === 'dashboard' ? 'text' : 'dashboard'
    }));
  };

  const handleMessageToggle = (messageId: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return;

    let sessionId = currentSessionId;
    
    if (!sessionId) {
      sessionId = await createNewSession();
      if (!sessionId) return;
    }

    const userMessageContent = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    await saveMessage(userMessageContent, 'user');

    const nonWelcomeMessages = messages.filter(msg => !msg.id.startsWith('welcome-'));
    const isFirstMessage = nonWelcomeMessages.length <= 1;
    if (isFirstMessage && sessionId) {
      await updateSessionTitle(sessionId, userMessageContent);
    }
    
    try {
      const response = await fetch(import.meta.env.VITE_AGENT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_AGENT_API_KEY
        },
        body: JSON.stringify({
          user_id: import.meta.env.VITE_DEFAULT_USER_EMAIL,
          agent_id: import.meta.env.VITE_AGENT_ID,
          session_id: import.meta.env.VITE_SESSION_ID,
          message: userMessageContent
        })
      });
    

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantResponse = data.response || "I apologize, but I couldn't process your request. Please try again.";

      await saveMessage(assistantResponse, 'assistant');
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please check your connection and try again.');
      
      toast({
        title: "Connection Error",
        description: "Unable to reach the AI agent. Please try again in a moment.",
        variant: "destructive",
      });
      
      const errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
      await saveMessage(errorMessage, 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (message: any) => {
    const viewMode = messageViewModes[message.id] || 'text';
    
    if (viewMode === 'dashboard') {
     
      return <DashboardRenderer content={message.content} />;
    }
    
    // Text view with tables and markdown
    const tables = detectTablesInText(message.content);
    
    if (tables.length > 0) {
      // Split content to show tables separately
      const contentWithoutTables = message.content.split('\n').filter((line: string) => {
        const hasTableMarkers = line.includes('|') || /\s{3,}/.test(line);
        return !hasTableMarkers || line.trim().length === 0;
      }).join('\n');
      
      return (
        <div className="space-y-4">
          {contentWithoutTables.trim() && (
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
                {contentWithoutTables}
              </ReactMarkdown>
            </div>
          )}
          {tables.map((table, index) => (
            <TableChart key={index} table={table} index={index} />
          ))}
        </div>
      );
    }
    
    
    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {message.content}
      </ReactMarkdown>
    </div>
     
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <ChatSidebar
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
       
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-9">
          <div className="flex items-center justify-center space-x-3">
           
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get instant insights on AI costs, ROI analysis, and optimization strategies
              </h1>
             
             
            </div>
          </div>
        </div>

        {/* PDF Download Controls */}
        <PdfDownloadControls 
          messages={messages} 
          sessionId={currentSessionId}
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs lg:max-w-5xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''} relative`}>
                {/* Message Checkbox */}
                <MessageCheckbox
                  messageId={message.id}
                  isSelected={selectedMessages.has(message.id)}
                  onToggle={handleMessageToggle}
                  showCheckboxes={showCheckboxes}
                />

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`rounded-lg p-4 max-w-full w-auto ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                }`}>
                  {/* Toggle Button for AI messages */}
                  {message.sender === 'assistant' && (
                    <div className="flex justify-end mb-3">
                      <Toggle
                        pressed={messageViewModes[message.id] === 'dashboard'}
                        onPressedChange={() => toggleMessageView(message.id)}
                        size="sm"
                        className="h-7 px-3 text-xs"
                      >
                        {messageViewModes[message.id] === 'dashboard' ? (
                          <>
                            <FileText className="w-3 h-3 mr-1" />
                            Text View
                          </>
                        ) : (
                          <>
                            <BarChart className="w-3 h-3 mr-1" />
                            Dashboard View
                          </>
                        )}
                      </Toggle>
                    </div>
                  )}
                  
                  {/* Message Content */}
                  {message.sender === 'user' ? (
                    <div className="prose max-w-none text-sm leading-relaxed">
                      <p className="text-white">{message.content}</p>
                    </div>
                  ) : (
                    renderMessageContent(message)
                  )}
                  
                  <span className={`text-xs mt-3 block ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {!message.id.startsWith('welcome-') ? formatTime(message.created_at) : 'Now'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-xs lg:max-w-2xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Agent is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="flex space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about AI costs, ROI analysis, automation opportunities..."
              className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {['Analyze my AI costs', 'Find cost savings', 'Calculate ROI', 'Automation opportunities'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterfaceWithSidebar;
