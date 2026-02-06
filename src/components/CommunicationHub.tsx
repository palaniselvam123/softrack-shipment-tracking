import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Search,
  Bell,
  Settings,
  User,
  Clock,
  MapPin,
  Package,
  Calendar,
  ChevronDown,
  Paperclip,
  X,
  Image,
  Smile,
  Check,
  CheckCheck
} from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  status: 'active' | 'escalated' | 'resolved';
  shipmentId: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  priority: 'high' | 'medium' | 'low';
  participants: string[];
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'system';
  isOwn?: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface ShipmentDetails {
  id: string;
  status: string;
  priority: string;
  trackingNumber: string;
  route: {
    origin: string;
    destination: string;
  };
  deliverySchedule: string;
}

const AUTO_REPLIES: { [key: string]: string[] } = {
  conv1: [
    'Thank you for your message. Let me check the latest status of your shipment.',
    'I can confirm the package has cleared the last checkpoint. It should arrive on schedule.',
    'Is there anything else I can help you with regarding this shipment?'
  ],
  conv2: [
    'We have escalated this to the logistics team. They are reviewing it now.',
    'The customs documentation has been resubmitted. We expect clearance within 24 hours.',
    'I will keep you updated on any progress.'
  ],
  conv3: [
    'Glad to hear the delivery was satisfactory!',
    'We appreciate your feedback. Is there anything else we can assist with?',
    'Thank you for choosing FreightFlow for your shipping needs.'
  ]
};

const CommunicationHub: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('conv1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('John Smith (customer)');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyIndex, setReplyIndex] = useState<{ [key: string]: number }>({ conv1: 0, conv2: 0, conv3: 0 });

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv1',
      title: 'Express Shipment Inquiry',
      status: 'active',
      shipmentId: 'SH001',
      lastMessage: 'Hello John! I\'m Sarah from FreightFlow...',
      timestamp: '8:00 PM',
      unreadCount: 3,
      priority: 'high',
      participants: ['John Smith', 'Sarah Johnson']
    },
    {
      id: 'conv2',
      title: 'Shipment Delay Notification',
      status: 'escalated',
      shipmentId: 'SH002',
      lastMessage: 'Hi! I\'m escalating this to our logistics team...',
      timestamp: '10:15 PM',
      unreadCount: 2,
      priority: 'medium',
      participants: ['Mike Chen', 'Support Team']
    },
    {
      id: 'conv3',
      title: 'Delivery Confirmation',
      status: 'resolved',
      shipmentId: 'SH003',
      lastMessage: 'Perfect! Thank you for the excellent service...',
      timestamp: '11:02 PM',
      unreadCount: 1,
      priority: 'low',
      participants: ['Emma Wilson', 'Delivery Team']
    }
  ]);

  const [messagesMap, setMessagesMap] = useState<{ [key: string]: Message[] }>({
    conv1: [
      {
        id: 'msg1',
        sender: 'Sarah Johnson',
        content: 'Hello John! I\'m Sarah from FreightFlow. I apologize for the delay with your express shipment. The weather in the Midwest caused some routing changes, but I\'ve confirmed your package is now on the final delivery truck and will reach you by 5 PM tomorrow.',
        timestamp: '8:00 PM',
        type: 'text',
        status: 'read'
      },
      {
        id: 'msg1b',
        sender: 'Sarah Johnson',
        content: 'I\'ve also applied a 10% discount to your next shipment as a goodwill gesture for the inconvenience.',
        timestamp: '8:02 PM',
        type: 'text',
        status: 'read'
      }
    ],
    conv2: [
      {
        id: 'msg2a',
        sender: 'System',
        content: 'Ticket #SH002 created - Shipment delay reported by Mike Chen',
        timestamp: '10:00 PM',
        type: 'system'
      },
      {
        id: 'msg2',
        sender: 'Mike Chen',
        content: 'Hi, my shipment SH002 seems to be stuck at customs. It was supposed to arrive 3 days ago. Can someone look into this?',
        timestamp: '10:05 PM',
        type: 'text',
        status: 'read'
      },
      {
        id: 'msg2b',
        sender: 'Support Team',
        content: 'Hi Mike! I\'m escalating this to our logistics team. They will review the customs documentation and get back to you shortly.',
        timestamp: '10:15 PM',
        type: 'text',
        status: 'read'
      }
    ],
    conv3: [
      {
        id: 'msg3a',
        sender: 'System',
        content: 'Shipment SH003 marked as delivered',
        timestamp: '10:50 PM',
        type: 'system'
      },
      {
        id: 'msg3',
        sender: 'Emma Wilson',
        content: 'Perfect! Thank you for the excellent service. The delivery was on time and in perfect condition. Very happy with the handling.',
        timestamp: '11:02 PM',
        type: 'text',
        status: 'read'
      }
    ]
  });

  const shipmentDetails: { [key: string]: ShipmentDetails } = {
    SH001: {
      id: 'SH001',
      status: 'in transit',
      priority: 'express',
      trackingNumber: 'FF2025-001-XYZ',
      route: { origin: 'Los Angeles, CA', destination: 'New York, NY' },
      deliverySchedule: '11/25/2025'
    },
    SH002: {
      id: 'SH002',
      status: 'delayed',
      priority: 'standard',
      trackingNumber: 'FF2025-002-ABC',
      route: { origin: 'Chicago, IL', destination: 'Miami, FL' },
      deliverySchedule: '11/28/2025'
    },
    SH003: {
      id: 'SH003',
      status: 'delivered',
      priority: 'standard',
      trackingNumber: 'FF2025-003-DEF',
      route: { origin: 'Seattle, WA', destination: 'Boston, MA' },
      deliverySchedule: '11/20/2025'
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesMap, selectedConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'You',
      content: newMessage.trim(),
      timestamp,
      type: 'text',
      isOwn: true,
      status: 'sent'
    };

    setMessagesMap(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), userMsg]
    }));

    setConversations(prev => prev.map(c =>
      c.id === selectedConversation
        ? { ...c, lastMessage: newMessage.trim(), timestamp }
        : c
    ));

    const sentContent = newMessage.trim();
    setNewMessage('');

    setTimeout(() => {
      setMessagesMap(prev => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map(m =>
          m.id === userMsg.id ? { ...m, status: 'delivered' } : m
        )
      }));
    }, 800);

    setTimeout(() => {
      setMessagesMap(prev => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map(m =>
          m.id === userMsg.id ? { ...m, status: 'read' } : m
        )
      }));
    }, 1500);

    const replies = AUTO_REPLIES[selectedConversation];
    if (replies) {
      const idx = replyIndex[selectedConversation] || 0;
      if (idx < replies.length) {
        setIsTyping(true);
        const delay = 1800 + Math.random() * 1200;
        setTimeout(() => {
          setIsTyping(false);
          const replyTimestamp = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', hour12: true
          });
          const replyMsg: Message = {
            id: `reply_${Date.now()}`,
            sender: selectedConversation === 'conv1' ? 'Sarah Johnson' :
                   selectedConversation === 'conv2' ? 'Support Team' : 'Delivery Team',
            content: replies[idx],
            timestamp: replyTimestamp,
            type: 'text',
            status: 'read'
          };
          setMessagesMap(prev => ({
            ...prev,
            [selectedConversation]: [...(prev[selectedConversation] || []), replyMsg]
          }));
          setConversations(prev => prev.map(c =>
            c.id === selectedConversation
              ? { ...c, lastMessage: replies[idx], timestamp: replyTimestamp }
              : c
          ));
          setReplyIndex(prev => ({ ...prev, [selectedConversation]: idx + 1 }));
        }, delay);
      }
    }
  };

  const handleSelectConversation = (convId: string) => {
    setSelectedConversation(convId);
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, unreadCount: 0 } : c
    ));
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messagesMap[selectedConversation] || [];
  const currentShipment = selectedConv ? shipmentDetails[selectedConv.shipmentId] : null;

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-emerald-100 text-emerald-800';
      case 'express': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShipmentStatusColor = (status: string) => {
    switch (status) {
      case 'in transit': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent': return <Check className="w-3.5 h-3.5 text-gray-400" />;
      case 'delivered': return <CheckCheck className="w-3.5 h-3.5 text-gray-400" />;
      case 'read': return <CheckCheck className="w-3.5 h-3.5 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-8rem)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Communication Hub</h1>
                <p className="text-sm text-gray-500">Freight Forwarding Collaboration Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>John Smith (customer)</option>
                  <option>Sarah Johnson (staff)</option>
                  <option>Mike Chen (admin)</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100%-4.5rem)]">
          <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50/50">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-150 ${
                    selectedConversation === conversation.id
                      ? 'bg-blue-50 border-l-[3px] border-l-blue-600'
                      : 'hover:bg-white border-l-[3px] border-l-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight">{conversation.title}</h3>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ml-2 flex-shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wide ${getStatusColor(conversation.status)}`}>
                      {conversation.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{conversation.shipmentId}</span>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-1">{conversation.lastMessage}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">{conversation.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedConv && (
              <>
                <div className="border-b border-gray-200 px-6 py-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-base font-semibold text-gray-900">{selectedConv.title}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase ${getStatusColor(selectedConv.status)}`}>
                          {selectedConv.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 mt-0.5">
                        <span className="text-xs text-gray-500">Shipment: <span className="text-blue-600 font-medium">{selectedConv.shipmentId}</span></span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-500">{selectedConv.participants.join(', ')}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase ${getPriorityColor(selectedConv.priority)}`}>
                      {selectedConv.priority} priority
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-1 bg-gradient-to-b from-gray-50/50 to-white">
                  {currentMessages.map((message, index) => {
                    const prevMessage = currentMessages[index - 1];
                    const showSender = !prevMessage || prevMessage.sender !== message.sender || prevMessage.type !== message.type;

                    if (message.type === 'system') {
                      return (
                        <div key={message.id} className="flex justify-center py-3">
                          <div className="bg-gray-100 rounded-full px-4 py-1.5">
                            <p className="text-xs text-gray-500">{message.content}</p>
                          </div>
                        </div>
                      );
                    }

                    const isOwn = message.isOwn || message.sender === 'You';

                    return (
                      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${showSender ? 'mt-4' : 'mt-0.5'}`}>
                        <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                          {showSender && !isOwn && (
                            <div className="flex items-center space-x-2 mb-1 ml-1">
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-gray-600" />
                              </div>
                              <span className="text-xs font-medium text-gray-700">{message.sender}</span>
                            </div>
                          )}
                          <div className={`rounded-2xl px-4 py-2.5 ${
                            isOwn
                              ? 'bg-blue-600 text-white rounded-br-md'
                              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                          }`}>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                          <div className={`flex items-center space-x-1 mt-0.5 ${isOwn ? 'justify-end mr-1' : 'ml-1'}`}>
                            <span className="text-[10px] text-gray-400">{message.timestamp}</span>
                            {isOwn && getMessageStatusIcon(message.status)}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {isTyping && (
                    <div className="flex justify-start mt-4">
                      <div className="max-w-[70%]">
                        <div className="flex items-center space-x-2 mb-1 ml-1">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-600" />
                          </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="flex items-end space-x-3">
                    <div className="flex items-center space-x-1">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Image className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={`p-2.5 rounded-xl transition-all duration-150 ${
                        newMessage.trim()
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-72 border-l border-gray-200 bg-gray-50/50 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Shipment Details</h3>
            </div>

            {currentShipment && (
              <div className="p-4 space-y-5">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getShipmentStatusColor(currentShipment.status)}`}>
                    {currentShipment.status}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Priority</label>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getPriorityColor(currentShipment.priority)}`}>
                    {currentShipment.priority}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    <Package className="w-3 h-3 inline mr-1" />
                    Tracking Number
                  </label>
                  <p className="font-mono text-xs text-gray-900 bg-white border border-gray-200 rounded-md px-2.5 py-1.5">{currentShipment.trackingNumber}</p>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    Route
                  </label>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs text-gray-900">{currentShipment.route.origin}</span>
                    </div>
                    <div className="ml-1 border-l-2 border-dashed border-gray-200 h-3"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-900">{currentShipment.route.destination}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Delivery Schedule
                  </label>
                  <p className="text-xs text-gray-900 bg-white border border-gray-200 rounded-md px-2.5 py-1.5">
                    Est. {currentShipment.deliverySchedule}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;
