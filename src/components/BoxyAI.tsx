import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Minimize2, Maximize2, RotateCcw, User, Sparkles, Mic, MicOff, Loader2 } from 'lucide-react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import type { DashboardStats } from '../App';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface BoxyAIProps {
  currentView?: string;
  dashboardStats?: DashboardStats | null;
}

type RecordingState = 'idle' | 'recording' | 'transcribing';

let cachedSpeechToken: { token: string; region: string; expiresAt: number } | null = null;

const SUGGESTED_PROMPTS = [
  'How many shipments for Tata Motors Ltd?',
  'How do I create a new booking?',
  'What does shipment status mean?',
  'Explain Incoterms for shipping',
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const BoxyAI: React.FC<BoxyAIProps> = ({ currentView, dashboardStats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! I'm **Boxy**, your LogiTRACK AI assistant. I can help you navigate the platform, answer logistics questions, and **track shipments by container number or shipment reference**. You can also use the **microphone** to speak your question. What can I help you with?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [micError, setMicError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognizerRef = useRef<SpeechSDK.SpeechRecognizer | null>(null);

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

  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync();
        recognizerRef.current.close();
        recognizerRef.current = null;
      }
    };
  }, []);

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

    let contextNote = currentView ? `[User is currently on the "${currentView}" page] ` : '';

    if (dashboardStats) {
      const statusBreakdown = Object.entries(dashboardStats.byStatus).map(([k, v]) => `${k}: ${v}`).join(', ');
      const modeBreakdown = Object.entries(dashboardStats.byMode).map(([k, v]) => `${k}: ${v}`).join(', ');
      contextNote += `[LIVE LOGITRACK STATS — Total Shipments: ${dashboardStats.totalShipments}, In Transit: ${dashboardStats.inTransit}, Delayed: ${dashboardStats.delayed}, Delivered: ${dashboardStats.delivered}, Total Bookings: ${dashboardStats.totalBookings}, Pending Bookings: ${dashboardStats.pendingBookings}, Confirmed Bookings: ${dashboardStats.approvedBookings}. By Status: ${statusBreakdown}. By Transport Mode: ${modeBreakdown}] `;

      if (dashboardStats.invoiceStats) {
        const inv = dashboardStats.invoiceStats;
        const outstandingAmount = inv.totalOutstandingIDR.toLocaleString('id-ID');
        const invoiceLines = inv.invoices.map(i => `${i.ref} | ${i.status} | ${i.currency} ${i.amount.toLocaleString()} | Due: ${i.dueDate} | Vendor: ${i.vendor} | Shipment: ${i.shipmentRef}`).join('; ');
        contextNote += `[INVOICE DATA — Total Invoices: ${inv.total}, Open: ${inv.open}, Overdue: ${inv.overdue}, Paid: ${inv.paid}, Processing: ${inv.processing}, Disputed: ${inv.disputed}, Cancelled: ${inv.cancelled}. Total Outstanding Amount (Open+Overdue): IDR ${outstandingAmount}. Invoice List: ${invoiceLines}] `;
      }
    }

    const historyForAPI = [
      ...messages.filter(m => m.id !== '0').slice(-20).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: contextNote + content.trim() },
    ];

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
      const reply = data.reply || data.error || "I'm having trouble responding right now. Please try again.";

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }]);

      if (!isOpen) setHasNewMessage(true);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your connection and try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSpeechToken = useCallback(async (): Promise<{ token: string; region: string }> => {
    const now = Date.now();
    if (cachedSpeechToken && cachedSpeechToken.expiresAt > now) {
      return { token: cachedSpeechToken.token, region: cachedSpeechToken.region };
    }
    const res = await fetch(`${SUPABASE_URL}/functions/v1/whisper-transcribe`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    cachedSpeechToken = { token: data.token, region: data.region, expiresAt: now + 8 * 60 * 1000 };
    return { token: data.token, region: data.region };
  }, []);

  const startRecording = useCallback(async () => {
    setMicError(null);
    setRecordingState('transcribing');
    try {
      const { token, region } = await getSpeechToken();
      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechRecognitionLanguage = 'en-US';
      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
      recognizerRef.current = recognizer;

      let interimText = '';

      recognizer.recognizing = (_s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizingSpeech) {
          interimText = e.result.text;
          setInput(interimText);
        }
      };

      recognizer.recognized = (_s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech && e.result.text) {
          setInput(prev => {
            const base = prev.replace(interimText, '').trim();
            return base ? `${base} ${e.result.text}` : e.result.text;
          });
          interimText = e.result.text;
        }
      };

      recognizer.canceled = (_s, e) => {
        if (e.reason === SpeechSDK.CancellationReason.Error) {
          const msg = e.errorDetails || 'Speech recognition error';
          setMicError(msg.includes('key') || msg.includes('auth') ? 'Voice not configured' : 'Speech recognition failed');
        }
        setRecordingState('idle');
        recognizer.close();
        recognizerRef.current = null;
      };

      recognizer.sessionStopped = () => {
        setRecordingState('idle');
        recognizer.close();
        recognizerRef.current = null;
        setTimeout(() => inputRef.current?.focus(), 50);
      };

      recognizer.startContinuousRecognitionAsync(
        () => setRecordingState('recording'),
        (err) => {
          setMicError(String(err).includes('denied') ? 'Microphone access denied' : 'Could not start microphone');
          setRecordingState('idle');
        }
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Microphone error';
      setMicError(msg.includes('not configured') ? 'Voice not configured — set AZURE_SPEECH_KEY & REGION' : msg);
      setRecordingState('idle');
    }
  }, [getSpeechToken]);

  const stopRecording = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync();
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (recordingState === 'idle') startRecording();
    else if (recordingState === 'recording') stopRecording();
  }, [recordingState, startRecording, stopRecording]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: "Hi! I'm **Boxy**, your LogiTRACK AI assistant. I can help you navigate the platform, answer logistics questions, and **track shipments by container number or shipment reference**. You can also use the **microphone** to speak your question. What can I help you with?",
      timestamp: new Date(),
    }]);
  };

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-0.5">
        {lines.map((line, i) => {
          if (line.match(/^━+$/)) return <hr key={i} className="border-gray-200 my-1" />;
          if (line.trim() === '') return <div key={i} className="h-1" />;
          const renderInline = (str: string) => {
            const parts = str.split(/(\*\*[^*]+\*\*)/g);
            return parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
            });
          };
          return <div key={i} className="leading-relaxed">{renderInline(line)}</div>;
        })}
      </div>
    );
  };

  const micButtonColor = recordingState === 'recording'
    ? 'bg-red-500 hover:bg-red-600'
    : recordingState === 'transcribing'
    ? 'bg-amber-500'
    : 'bg-gray-100 hover:bg-gray-200';

  const micIconColor = recordingState === 'recording' || recordingState === 'transcribing'
    ? 'text-white'
    : 'text-gray-500';

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 group overflow-hidden"
          aria-label="Open Boxy AI"
        >
          <img src="/BoxyAi.png" alt="Boxy AI" className="w-12 h-12 object-contain" />
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
          <span className="absolute right-16 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
            Ask Boxy AI
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200/80 transition-all duration-300 overflow-hidden ${
            isMinimized ? 'h-14 w-80' : 'w-96 h-[620px]'
          }`}
          style={{ maxHeight: 'calc(100vh - 80px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center">
                <img src="/BoxyAi.png" alt="Boxy AI" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-white font-semibold text-sm">Boxy AI</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                </div>
                {!isMinimized && <span className="text-cyan-100 text-xs">LogiTRACK Assistant</span>}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {!isMinimized && (
                <button onClick={resetChat} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Reset conversation">
                  <RotateCcw className="w-3.5 h-3.5 text-white" />
                </button>
              )}
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5 text-white" /> : <Minimize2 className="w-3.5 h-3.5 text-white" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-start space-x-2.5 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${msg.role === 'assistant' ? 'bg-gradient-to-br from-sky-500 to-cyan-600' : 'bg-gray-200'}`}>
                      {msg.role === 'assistant'
                        ? <img src="/BoxyAi.png" alt="Boxy AI" className="w-7 h-7 object-contain" />
                        : <User className="w-4 h-4 text-gray-600" />
                      }
                    </div>
                    <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-100' : 'bg-gradient-to-br from-sky-500 to-cyan-600 text-white rounded-tr-sm'}`}>
                      {renderContent(msg.content)}
                      <div className={`text-xs mt-1 ${msg.role === 'assistant' ? 'text-gray-400' : 'text-sky-100'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-2.5">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src="/BoxyAi.png" alt="Boxy AI" className="w-7 h-7 object-contain" />
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

                {messages.length === 1 && !isLoading && (
                  <div className="pt-1">
                    <p className="text-xs text-gray-400 font-medium mb-2 px-0.5">Suggested questions</p>
                    <div className="grid grid-cols-2 gap-2">
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <button key={prompt} onClick={() => sendMessage(prompt)} className="text-left text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl px-3 py-2 transition-colors duration-150 leading-snug">
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Voice recording indicator */}
              {recordingState === 'recording' && (
                <div className="flex-shrink-0 mx-3 mb-1 px-3 py-2 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                  <span className="text-xs text-red-700 font-medium flex-1">Listening... tap mic to stop</span>
                  <div className="flex items-end space-x-0.5 h-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-400 rounded-full animate-bounce"
                        style={{ height: `${6 + (i % 3) * 4}px`, animationDelay: `${i * 80}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {recordingState === 'transcribing' && (
                <div className="flex-shrink-0 mx-3 mb-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2">
                  <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin flex-shrink-0" />
                  <span className="text-xs text-amber-700 font-medium">Connecting to speech service...</span>
                </div>
              )}

              {micError && (
                <div className="flex-shrink-0 mx-3 mb-1 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-red-600">{micError}</span>
                  <button onClick={() => setMicError(null)} className="text-red-400 hover:text-red-600 ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Input area */}
              <div className="flex-shrink-0 border-t border-gray-100 px-3 py-3 bg-white">
                <div className="flex items-end space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 transition-all duration-150">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={recordingState === 'recording' ? 'Listening...' : 'Ask Boxy or enter a container number...'}
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none max-h-24 leading-5"
                    style={{ minHeight: '20px' }}
                    disabled={isLoading || recordingState !== 'idle'}
                  />
                  <button
                    onClick={toggleRecording}
                    disabled={isLoading || recordingState === 'transcribing'}
                    title={recordingState === 'recording' ? 'Stop recording' : 'Start voice input'}
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${micButtonColor}`}
                  >
                    {recordingState === 'transcribing'
                      ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                      : recordingState === 'recording'
                      ? <MicOff className="w-4 h-4 text-white" />
                      : <Mic className={`w-4 h-4 ${micIconColor}`} />
                    }
                  </button>
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isLoading || recordingState !== 'idle'}
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
