import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { sendChatMessage } from '../utils/api';
import type { ChatMessage } from '../utils/types';

export default function TherapyChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [crisisResources, setCrisisResources] = useState<any>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Start new conversation on mount if no current conversation
  useEffect(() => {
    if (!currentConversationId && !isLoadingConversations) {
      startNewConversation();
    }
  }, [isLoadingConversations]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoadingConversations(false);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/chat/conversations?type=therapy`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const startNewConversation = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // If not authenticated, just show welcome message
        setMessages([
          {
            role: 'assistant',
            content: "Hello! I'm here to listen and support you. This is a safe, judgment-free space where you can share what's on your mind. How are you feeling today?",
            timestamp: new Date().toISOString(),
          },
        ]);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/chat/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: `Therapy Session - ${new Date().toLocaleDateString()}`,
          type: 'therapy'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentConversationId(data._id);
        
        // Add welcome message
        const welcomeMessage: ChatMessage = {
          role: 'assistant' as const,
          content: "Hello! I'm here to listen and support you. This is a safe, judgment-free space where you can share what's on your mind. How are you feeling today?",
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);

        // Save welcome message to database
        await saveMessage(data._id, welcomeMessage);
        
        // Reload conversations list
        await loadConversations();
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/chat/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentConversationId(data._id);
        setMessages(data.messages.map((msg: any) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.timestamp
        })));
        setShowSidebar(false);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const saveMessage = async (conversationId: string, message: ChatMessage) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          role: message.role,
          content: message.content
        }),
      });
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Save user message to database
    if (currentConversationId) {
      await saveMessage(currentConversationId, userMessage);
    }

    try {
      // Prepare conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await sendChatMessage(inputMessage, conversationHistory);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message to database
      if (currentConversationId) {
        await saveMessage(currentConversationId, assistantMessage);
      }

      // Handle crisis detection
      if (response.crisis_detected) {
        setShowCrisisResources(true);
        setCrisisResources(response.crisis_resources);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6">
          {/* Sidebar - Conversation History */}
          <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
            <Card className="p-4 h-[700px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Conversations</h3>
                <button
                  onClick={startNewConversation}
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  + New
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv._id}
                    onClick={() => loadConversation(conv._id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentConversationId === conv._id
                        ? 'bg-primary/20 border border-primary/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-sm font-semibold truncate">{conv.title}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="md:hidden text-primary hover:text-primary/80"
                >
                  {showSidebar ? '✕ Close' : '☰ History'}
                </button>
                <h1 className="text-4xl md:text-5xl font-bold flex-1">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Therapy Chat
                  </span>
                </h1>
                <div className="w-20"></div>
              </div>
              <p className="text-gray-400 text-lg">
                Talk with our AI therapist for personalized support and guidance
              </p>
              <p className="text-sm text-gray-500 mt-2">
                💡 This is a supportive companion, not a replacement for professional therapy
              </p>
            </motion.div>

        {/* Crisis Resources Banner */}
        <AnimatePresence>
          {showCrisisResources && crisisResources && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="bg-red-500/10 border-red-500/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-red-400 font-bold text-lg mb-2">
                      🆘 Crisis Support Resources
                    </h3>
                    <p className="text-gray-300 mb-4">
                      If you're in crisis, please reach out to these resources immediately:
                    </p>
                    <div className="space-y-2">
                      {crisisResources.immediate?.map((resource: any, index: number) => (
                        <div key={index} className="text-sm">
                          <span className="text-white font-semibold">{resource.name}:</span>{' '}
                          <span className="text-primary">{resource.contact}</span>
                          <p className="text-gray-400 text-xs">{resource.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCrisisResources(false)}
                    className="text-gray-400 hover:text-white ml-4"
                  >
                    ✕
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'glass border border-white/10'
                    }`}
                  >
                    <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="glass border border-white/10 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-4">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind... (Press Enter to send)"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="self-end"
              >
                {isLoading ? '...' : 'Send'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Your conversation is private and not stored on our servers
            </p>
          </div>
        </Card>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <Card className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <h3 className="font-semibold mb-1">Empathetic Support</h3>
                <p className="text-sm text-gray-400">
                  Non-judgmental listening and validation
                </p>
              </Card>
              <Card className="text-center">
                <div className="text-3xl mb-2">🧠</div>
                <h3 className="font-semibold mb-1">Evidence-Based</h3>
                <p className="text-sm text-gray-400">
                  Uses CBT and mindfulness techniques
                </p>
              </Card>
              <Card className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold mb-1">Saved to Your Account</h3>
                <p className="text-sm text-gray-400">
                  Your conversations are securely stored
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
