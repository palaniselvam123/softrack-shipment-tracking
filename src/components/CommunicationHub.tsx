import React, { useState } from 'react';
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
  AlertTriangle,
  CheckCircle,
  Truck,
  Calendar,
  ChevronDown,
  Paperclip,
  X
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

const CommunicationHub: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('conv1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('John Smith (customer)');

  const conversations: Conversation[] = [
    {
      id: 'conv1',
      title: 'Express Shipment Inquiry',
      status: 'active',
      shipmentId: 'SH001',
      lastMessage: 'Hello John! I\'m Sarah from FreightFlow. I apologize for the delay...',
      timestamp: '8:00:00 PM',
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
      timestamp: '10:15:00 PM',
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
      timestamp: '11:02:00 PM',
      unreadCount: 1,
      priority: 'low',
      participants: ['Emma Wilson', 'Delivery Team']
    }
  ];

  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({
    conv1: [
      {
        id: 'msg1',
        sender: 'Sarah Johnson',
        content: 'Hello John! I\'m Sarah from FreightFlow. I apologize for the delay with your express shipment. The weather in the Midwest caused some routing changes, but I\'ve confirmed your package is now on the final delivery truck and will reach you by 5 PM tomorrow.',
        timestamp: '8:00:00 PM',
        type: 'text'
      }
    ],
    conv2: [
      {
        id: 'msg2',
        sender: 'System',
        content: 'Shipment SH002 has been delayed due to customs clearance.',
        timestamp: '10:15:00 PM',
        type: 'system'
      }
    ],
    conv3: [
      {
        id: 'msg3',
        sender: 'Emma Wilson',
        content: 'Perfect! Thank you for the excellent service. The delivery was on time and in perfect condition.',
        timestamp: '11:02:00 PM',
        type: 'text'
      }
    ]
  });

  const shipmentDetails: { [key: string]: ShipmentDetails } = {
    SH001: {
      id: 'SH001',
      status: 'in transit',
      priority: 'express',
      trackingNumber: 'FF2025-001-XYZ',
      route: {
        origin: 'Los Angeles, CA',
        destination: 'New York, NY'
      },
      deliverySchedule: '1/25/2025'
    },
    SH002: {
      id: 'SH002',
      status: 'delayed',
      priority: 'standard',
      trackingNumber: 'FF2025-002-ABC',
      route: {
        origin: 'Chicago, IL',
        destination: 'Miami, FL'
      },
      deliverySchedule: '1/28/2025'
    },
    SH003: {
      id: 'SH003',
      status: 'delivered',
      priority: 'standard',
      trackingNumber: 'FF2025-003-DEF',
      route: {
        origin: 'Seattle, WA',
        destination: 'Boston, MA'
      },
      deliverySchedule: '1/20/2025'
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700';
      case 'escalated':
        return 'bg-red-50 text-red-700';
      case 'resolved':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-surface-tile text-brand-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700';
      case 'medium':
        return 'bg-amber-50 text-amber-700';
      case 'low':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getShipmentStatusColor = (status: string) => {
    switch (status) {
      case 'in transit':
        return 'text-brand-600';
      case 'delayed':
        return 'text-red-600';
      case 'delivered':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add the message to the current conversation
      const newMsg: Message = {
        id: `msg_${Date.now()}`,
        sender: 'You',
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          hour12: true 
        }),
        type: 'text'
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || []), newMsg]
      }));
      setNewMessage('');
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages[selectedConversation] || [];
  const currentShipment = selectedConv ? shipmentDetails[selectedConv.shipmentId] : null;

  return (
    <div className="page">
      <div className="card h-[calc(100vh-8rem)]">
        {/* Communication Hub Header */}
        <div className="px-6 py-4 border-b border-surface-line">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-navy-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">FF</span>
              </div>
              <div>
                <h1 className="text-[15px] font-semibold text-navy-900">Communication Hub</h1>
                <p className="text-sm text-gray-600">Freight Forwarding Collaboration Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select 
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="appearance-none bg-white border border-surface-line rounded-md px-4 py-2 pr-8 focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                >
                  <option>John Smith (customer)</option>
                  <option>Sarah Johnson (staff)</option>
                  <option>Mike Chen (admin)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <Bell className="w-5 h-5 text-gray-500" />
              <Settings className="w-5 h-5 text-gray-500" />
              <div className="w-8 h-8 bg-navy-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100%-5rem)]">
        {/* Conversations List */}
        <div className="w-80 border-r border-surface-line flex flex-col">
          <div className="p-4 border-b border-surface-line">
            <h2 className="text-[14px] font-semibold text-navy-900 mb-4">Conversations</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b border-surface-soft cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-surface-tile border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-brand-600" />
                    <h3 className="font-medium text-gray-900 text-sm">{conversation.title}</h3>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-brand-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(conversation.status)}`}>
                    {conversation.status}
                  </span>
                  <span className="text-xs text-gray-500">{conversation.shipmentId}</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">{conversation.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv && (
            <>
              {/* Chat Header */}
              <div className="border-b border-surface-line p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-semibold text-navy-900">{selectedConv.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">Shipment: {selectedConv.shipmentId}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedConv.status)}`}>
                        {selectedConv.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedConv.priority)}`}>
                        {selectedConv.priority} priority
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConversation('')}
                    aria-label="Close conversation"
                    className="p-1.5 rounded-md text-gray-400 hover:text-navy-900 hover:bg-surface-head transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{message.sender}</span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-gray-800">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-surface-line p-4">
                <div className="flex items-center space-x-3">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-surface-line rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="bg-navy-900 text-white p-2 rounded-lg hover:bg-navy-800 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Shipment Details Sidebar */}
        <div className="w-80 border-l border-gray-200">
          <div className="p-4 border-b border-surface-line">
            <h3 className="text-[14px] font-semibold text-navy-900">Shipment Details</h3>
          </div>
          
          {currentShipment && (
            <div className="p-4 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getShipmentStatusColor(currentShipment.status)}`}>
                  {currentShipment.status}
                </span>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(currentShipment.priority)}`}>
                  {currentShipment.priority}
                </span>
              </div>

              {/* Tracking Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  Tracking Number
                </label>
                <p className="font-mono text-sm text-gray-900">{currentShipment.trackingNumber}</p>
              </div>

              {/* Route */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Route
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">{currentShipment.route.origin}</span>
                  </div>
                  <div className="ml-1 border-l-2 border-gray-200 h-4"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-navy-700 rounded-full"></div>
                    <span className="text-sm text-gray-900">{currentShipment.route.destination}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Delivery Schedule
                </label>
                <p className="text-sm text-gray-900">
                  <span className="text-gray-500">Estimated:</span> {currentShipment.deliverySchedule}
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