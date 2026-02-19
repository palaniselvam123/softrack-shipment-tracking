import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2, RotateCcw, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface BoxyAIProps {
  currentView?: string;
}

const SUGGESTED_PROMPTS = [
  'How do I create a new booking?',
  'What does shipment status mean?',
  'How to generate a quotation?',
  'Explain Incoterms for shipping',
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const BoxyAI: React.FC<BoxyAIProps> = ({ currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! I'm **Boxy**, your LogiTRACK AI assistant. I can help you navigate the platform, answer logistics questions, and explain any feature. What can I help you with?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const contextNote = currentView
      ? `[User is currently on the "${currentView}" page] `
      : '';

    const historyForAPI = messages
      .filter(m => m.id !== '0')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    historyForAPI.push({ role: 'user', content: contextNote + content.trim() });

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/boxy-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ messages: historyForAPI }),
      });

      const data = await res.json();
      const reply = data.reply || "I'm having trouble responding right now. Please try again.";

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (!isOpen) {
        setHasNewMessage(true);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please check your connection and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: "Hi! I'm **Boxy**, your LogiTRACK AI assistant. I can help you navigate the platform, answer logistics questions, and explain any feature. What can I help you with?",
        timestamp: new Date(),
      },
    ]);
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 group"
          aria-label="Open Boxy AI"
        >
          <Bot className="w-7 h-7 text-white" />
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
          <span className="absolute right-16 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
            Ask Boxy AI
          </span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200/80 transition-all duration-300 overflow-hidden ${
            isMinimized ? 'h-14 w-80' : 'w-96 h-[600px]'
          }`}
          style={{ maxHeight: 'calc(100vh - 80px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-white font-semibold text-sm">Boxy AI</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                </div>
                {!isMinimized && (
                  <span className="text-cyan-100 text-xs">LogiTRACK Assistant</span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {!isMinimized && (
                <button
                  onClick={resetChat}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-white" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Minimize2 className="w-3.5 h-3.5 text-white" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2.5 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'assistant'
                          ? 'bg-gradient-to-br from-sky-500 to-cyan-600'
                          : 'bg-gray-200'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <Bot className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'assistant'
                          ? 'bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-100'
                          : 'bg-gradient-to-br from-sky-500 to-cyan-600 text-white rounded-tr-sm'
                      }`}
                    >
                      {renderContent(msg.content)}
                      <div
                        className={`text-xs mt-1 ${
                          msg.role === 'assistant' ? 'text-gray-400' : 'text-sky-100'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-2.5">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex space-x-1.5 items-center h-4">
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggested prompts (only show initially) */}
                {messages.length === 1 && !isLoading && (
                  <div className="pt-1">
                    <p className="text-xs text-gray-400 font-medium mb-2 px-0.5">Suggested questions</p>
                    <div className="grid grid-cols-2 gap-2">
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          className="text-left text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl px-3 py-2 transition-colors duration-150 leading-snug"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="flex-shrink-0 border-t border-gray-100 px-3 py-3 bg-white">
                <div className="flex items-end space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 transition-all duration-150">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Boxy anything..."
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none max-h-24 leading-5"
                    style={{ minHeight: '20px' }}
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isLoading}
                    className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-lg flex items-center justify-center transition-all duration-150 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">
                  Powered by <span className="font-medium text-sky-600">Boxy AI</span>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default BoxyAI;
