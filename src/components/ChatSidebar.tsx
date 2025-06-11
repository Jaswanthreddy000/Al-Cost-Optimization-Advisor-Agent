
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Trash2, Edit2, Check, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/hooks/use-toast";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

const ChatSidebar = ({ currentSessionId, onSessionSelect, onNewChat }: ChatSidebarProps) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  // Add real-time listener for sessions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('chat_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // console.log('Session change:', payload);
          fetchSessions(); // Refresh sessions when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      // console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(sessions.filter(s => s.id !== sessionId));
      
      if (currentSessionId === sessionId) {
        onNewChat();
      }

      toast({
        title: "Session deleted",
        description: "Chat session has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditTitle = async (sessionId: string) => {
    if (!editTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title: editTitle.trim(), updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(sessions.map(s => 
        s.id === sessionId 
          ? { ...s, title: editTitle.trim(), updated_at: new Date().toISOString() }
          : s
      ));

      setEditingSession(null);
      setEditTitle('');

      toast({
        title: "Title updated",
        description: "Session title has been changed.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating title",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startEditing = (session: ChatSession) => {
    setEditingSession(session.id);
    setEditTitle(session.title);
  };

  const cancelEditing = () => {
    setEditingSession(null);
    setEditTitle('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 1 week
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-8 border-b border-gray-200">
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sessions.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No chat sessions yet</p>
            <p className="text-sm">Start a new conversation!</p>
          </div>
        ) : (
          sessions.map((session) => (
            <Card
              key={session.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md group ${
                currentSessionId === session.id
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1 min-w-0"
                    onClick={() => editingSession !== session.id && onSessionSelect(session.id)}
                  >
                    {editingSession === session.id ? (
                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-8 text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleEditTitle(session.id);
                            } else if (e.key === 'Escape') {
                              cancelEditing();
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTitle(session.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelEditing}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          {session.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(session.updated_at)}
                        </p>
                      </>
                    )}
                  </div>
                  
                  {editingSession !== session.id && (
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(session);
                        }}
                        className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>

                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Badge variant="secondary" className="w-full justify-center bg-green-100 text-green-700 border-green-200">
          🟢 AI Agent Online
        </Badge>
      </div>
    </div>
  );
};

export default ChatSidebar;
