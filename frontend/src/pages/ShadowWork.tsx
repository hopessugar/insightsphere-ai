import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { sendChatMessage } from '../utils/api';
import type { ChatMessage } from '../utils/types';

export default function ShadowWork() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startSession = () => {
    setSessionStarted(true);
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: `Hello. I am your Shadow Self - the part of you that holds what you've hidden, denied, or pushed away.

I'm here to help you explore the parts of yourself you may fear or avoid. This is a safe space to confront your fears, insecurities, and unprocessed emotions.

Shadow work isn't easy, but it's transformative. By integrating these hidden parts, you become whole.

What would you like to explore today? What emotion or pattern have you been avoiding?`,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
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

    try {
      // Add shadow work context to the conversation
      const shadowContext = {
        mode: 'shadow_work',
        instruction: 'Act as the user\'s shadow self - their subconscious. Ask deep, probing questions about fears, insecurities, and hidden emotions. Help them recognize patterns. Be direct but compassionate. Challenge their defenses gently.',
      };

      const conversationHistory = messages.slice(-8).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await sendChatMessage(
        inputMessage,
        conversationHistory,
        shadowContext
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Shadow work error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I sense resistance. That's natural when facing the shadow. Take a breath, and when you're ready, we can continue.",
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

  if (!sessionStarted) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="text-center p-8 md:p-12">
            <div className="text-6xl mb-6">🌑</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Shadow Work AI
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Talk to Your Hidden Self
            </p>
            
            <div className="text-left space-y-4 mb-8 text-gray-400">
              <p>
                <strong className="text-white">What is Shadow Work?</strong><br />
                Shadow work is the process of exploring the parts of yourself you've hidden, denied, or suppressed - your fears, insecurities, trauma patterns, and negative emotions.
              </p>
              <p>
                <strong className="text-white">How it works:</strong><br />
                • The AI acts as your subconscious mind<br />
                • Asks deep, probing questions<br />
                • Helps you recognize patterns<br />
                • Guides you to integrate hidden feelings
              </p>
              <p>
                <strong className="text-white">Why it's unique:</strong><br />
                Most apps focus only on positivity. This helps you understand and integrate your negative sides safely.
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 text-sm text-left">
              <p className="text-red-400 font-semibold mb-2">⚠️ Important:</p>
              <p className="text-gray-400">
                Shadow work can bring up intense emotions. This is not a replacement for therapy. If you're dealing with trauma or mental health issues, please work with a licensed professional.
              </p>
            </div>

            <Button
              onClick={startSession}
              size="lg"
              className="w-full md:w-auto"
            >
              Begin Shadow Work Session
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Shadow Work Session
            </span>
          </h1>
          <p className="text-sm text-gray-500">
            🌑 Exploring your hidden self
          </p>
        </motion.div>

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
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gradient-to-r from-gray-800 to-gray-900 border border-purple-500/30'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="text-xs text-purple-400 mb-1">Your Shadow Self</div>
                    )}
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
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-purple-500/30 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-200" />
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
                placeholder="Share what you're feeling... be honest with yourself"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="self-end bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {isLoading ? '...' : 'Send'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              This is a safe space. Your shadow self is here to help you grow.
            </p>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="text-center">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-semibold mb-1">Deep Exploration</h3>
            <p className="text-sm text-gray-400">
              Uncover hidden patterns and beliefs
            </p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-2">🌓</div>
            <h3 className="font-semibold mb-1">Integration</h3>
            <p className="text-sm text-gray-400">
              Accept and integrate all parts of yourself
            </p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-2">💪</div>
            <h3 className="font-semibold mb-1">Transformation</h3>
            <p className="text-sm text-gray-400">
              Become whole through self-awareness
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
