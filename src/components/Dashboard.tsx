import React from 'react';
import { TrendingUp, Package, Ship, Clock, DollarSign, AlertTriangle, CheckCircle, Users, MessageCircle, Ticket } from 'lucide-react';

interface DashboardProps {
  onViewShipments: () => void;
  onNewBooking: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewShipments, onNewBooking }) => {
  const stats = [
    {
      title: 'Total Shipments',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Package,
      color: 'bg-logitrack-blue-600'
    },
    {
      title: 'In Transit',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: Ship,
      color: 'bg-logitrack-blue-600'
    },
    {
      title: 'Pending Bookings',
      value: '12',
      change: '+4%',
      changeType: 'positive',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Revenue (USD)',
      value: '$2.4M',
      change: '+18%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500'
    }
  ];

  const recentShipments = [
    {
      id: 'MUM/SE/SHP/0024',
      status: 'In Transit',
      origin: 'Mumbai',
      destination: 'New York',
      eta: '2025-11-29',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'MUM/AE/SHP/0013',
      status: 'Customs Clearance',
      origin: 'Chennai',
      destination: 'Hanoi',
      eta: '2025-11-25',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'MUM/AI/SHP/0002',
      status: 'Delivered',
      origin: 'Frankfurt',
      destination: 'Mumbai',
      eta: '2025-11-20',
      statusColor: 'bg-green-100 text-green-800'
    }
  ];

  const recentConversations = [
    {
      id: 'conv1',
      title: 'Express Shipment Inquiry',
      shipmentId: 'MUM/SE/SHP/0001',
      lastMessage: 'Hello! I\'m Sarah from LogiTRACK. I apologize for the delay...',
      timestamp: '2 hours ago',
      status: 'active',
      unreadCount: 3
    },
    {
      id: 'conv2',
      title: 'Customs Clearance Update',
      shipmentId: 'MUM/AE/SHP/0009',
      lastMessage: 'Your shipment has cleared customs successfully...',
      timestamp: '4 hours ago',
      status: 'resolved',
      unreadCount: 0
    },
    {
      id: 'conv3',
      title: 'Delivery Schedule Change',
      shipmentId: 'MUM/AI/SHP/0001',
      lastMessage: 'Due to weather conditions, delivery has been rescheduled...',
      timestamp: '6 hours ago',
      status: 'escalated',
      unreadCount: 1
    }
  ];

  const recentTickets = [
    {
      id: 'TKT-2025-001',
      title: 'Container Damage Report',
      priority: 'high',
      status: 'open',
      assignee: 'John Smith',
      created: '2 hours ago'
    },
    {
      id: 'TKT-2025-002',
      title: 'Documentation Missing',
      priority: 'medium',
      status: 'in-progress',
      assignee: 'Sarah Johnson',
      created: '5 hours ago'
    },
    {
      id: 'TKT-2025-003',
      title: 'Billing Inquiry',
      priority: 'low',
      status: 'resolved',
      assignee: 'Mike Chen',
      created: '1 day ago'
    }
  ];

  const alerts = [
    {
      type: 'warning',
      message: 'Shipment MUM/SE/SHP/0020 requires additional documentation',
      time: '2 hours ago'
    },
    {
      type: 'info',
      message: 'New customs regulation update for EU imports',
      time: '4 hours ago'
    },
    {
      type: 'success',
      message: 'Container BKSU9898988 successfully loaded',
      time: '6 hours ago'
    }
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome back! Here's what's happening with your shipments today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card group cursor-pointer shadow-xl border border-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                  stat.changeType === 'positive' ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white' : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">from last month</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shipments */}
        <div className="card card-hover shadow-xl border border-gray-200/50">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-cyan-500">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Ship className="w-5 h-5 text-white" />
              <span>Recent Shipments</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentShipments.map((shipment) => (
                <div key={shipment.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md hover:border-sky-200 transition-all duration-200 group">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-sm font-bold text-gray-900">{shipment.id}</h3>
                      <span className={`badge ${shipment.statusColor}`}>
                        {shipment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <span>{shipment.origin}</span>
                      <span className="text-gray-400">→</span>
                      <span>{shipment.destination}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5">ETA: {shipment.eta}</p>
                  </div>
                  <button className="text-sky-600 hover:text-sky-800 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="card card-hover shadow-xl border border-gray-200/50">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-500 to-teal-500">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-white" />
              <span>Recent Conversations</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentConversations.map((conversation) => (
                <div key={conversation.id} className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-all duration-200 border border-gray-100 hover:shadow-md hover:border-emerald-200 group">
                  <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-gray-900">{conversation.title}</h4>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-sky-600 text-white text-xs rounded-full px-2 py-1 min-w-[24px] text-center flex-shrink-0 font-semibold shadow-sm">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">{conversation.shipmentId}</p>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{conversation.lastMessage}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      <span className={`badge ${
                        conversation.status === 'active' ? 'bg-green-100 text-green-800' :
                        conversation.status === 'escalated' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {conversation.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => window.location.href = '/communication'}
                className="btn-primary w-full"
              >
                View All Conversations
              </button>
            </div>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="card card-hover shadow-xl border border-gray-200/50">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Ticket className="w-5 h-5 text-white" />
              <span>Recent Tickets</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-all duration-200 border border-gray-100 hover:shadow-md hover:border-violet-200 group">
                  <div className="p-2 bg-violet-100 rounded-lg group-hover:bg-violet-200 transition-colors">
                    <Ticket className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-gray-900">{ticket.title}</h4>
                      <span className={`badge flex-shrink-0 ${
                        ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">{ticket.id}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 truncate">Assigned to: {ticket.assignee}</span>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className={`badge ${
                          ticket.status === 'open' ? 'bg-sky-100 text-sky-800' :
                          ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.status}
                        </span>
                        <span className="text-xs text-gray-500">{ticket.created}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => window.location.href = '/tickets'}
                className="btn-primary w-full"
              >
                View All Tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="mt-8 card shadow-xl border border-gray-200/50">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-500 to-amber-500">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-white" />
            <span>Alerts & Notifications</span>
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200">
                <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ring-4 ${
                  alert.type === 'warning' ? 'bg-yellow-500 ring-yellow-100' :
                  alert.type === 'info' ? 'bg-sky-500 ring-sky-100' : 'bg-green-500 ring-green-100'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium leading-relaxed">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={onViewShipments}
              className="btn-primary"
            >
              View All Shipments
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 card shadow-xl border border-gray-200/50">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-blue-600">
          <h2 className="text-lg font-bold text-white">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <button
              onClick={onNewBooking}
              className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-2xl hover:border-sky-400 bg-gradient-to-br from-white to-sky-50/30 hover:to-sky-100 transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 transform"
            >
              <div className="p-4 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl group-hover:scale-110 transition-transform duration-200 mb-4 shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">New Booking</span>
            </button>
            <button
              onClick={onViewShipments}
              className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-2xl hover:border-cyan-400 bg-gradient-to-br from-white to-cyan-50/30 hover:to-cyan-100 transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 transform"
            >
              <div className="p-4 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl group-hover:scale-110 transition-transform duration-200 mb-4 shadow-lg">
                <Ship className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">Track Shipment</span>
            </button>
            <button
              onClick={() => alert('Client Management feature coming soon!')}
              className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-2xl hover:border-emerald-400 bg-gradient-to-br from-white to-emerald-50/30 hover:to-emerald-100 transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 transform"
            >
              <div className="p-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl group-hover:scale-110 transition-transform duration-200 mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">Manage Clients</span>
            </button>
            <button
              onClick={() => alert('Reports feature coming soon!')}
              className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-2xl hover:border-indigo-400 bg-gradient-to-br from-white to-indigo-50/30 hover:to-indigo-100 transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 transform"
            >
              <div className="p-4 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl group-hover:scale-110 transition-transform duration-200 mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;