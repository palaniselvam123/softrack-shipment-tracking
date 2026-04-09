import React from 'react';
import { TrendingUp, TrendingDown, Package, Ship, Clock, DollarSign, AlertTriangle, CheckCircle, Users, MessageCircle, Ticket, ShieldCheck, ArrowRight, Briefcase, BarChart3 } from 'lucide-react';
import type { DashboardStats } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onViewShipments: () => void;
  onNewBooking: () => void;
  onViewBookings: () => void;
  onViewCommunication: () => void;
  onViewTickets: () => void;
  liveStats?: DashboardStats | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewShipments, onNewBooking, onViewBookings, onViewCommunication, onViewTickets, liveStats }) => {
  const { isAdmin } = useAuth();

  const stats = [
    {
      title: 'Total Shipments',
      value: liveStats ? liveStats.totalShipments.toLocaleString() : '--',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Package,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600',
      onClick: onViewShipments,
    },
    {
      title: 'In Transit',
      value: liveStats ? liveStats.inTransit.toLocaleString() : '--',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Ship,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      onClick: onViewShipments,
    },
    {
      title: 'Delayed',
      value: liveStats ? liveStats.delayed.toLocaleString() : '--',
      change: '-2%',
      changeType: 'negative' as const,
      icon: Clock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      onClick: onViewShipments,
    },
    {
      title: 'Total Bookings',
      value: liveStats ? liveStats.totalBookings.toLocaleString() : '--',
      change: '+18%',
      changeType: 'positive' as const,
      icon: DollarSign,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      onClick: onViewBookings,
    }
  ];

  const recentShipments = [
    { id: 'MUM/SE/SHP/0024', status: 'In Transit', origin: 'Mumbai', destination: 'New York', eta: '2025-11-29', statusColor: 'bg-blue-50 text-blue-700' },
    { id: 'MUM/AE/SHP/0013', status: 'Customs', origin: 'Chennai', destination: 'Hanoi', eta: '2025-11-25', statusColor: 'bg-amber-50 text-amber-700' },
    { id: 'MUM/AI/SHP/0002', status: 'Delivered', origin: 'Frankfurt', destination: 'Mumbai', eta: '2025-11-20', statusColor: 'bg-emerald-50 text-emerald-700' }
  ];

  const recentConversations = [
    { id: 'conv1', title: 'Express Shipment Inquiry', shipmentId: 'MUM/SE/SHP/0001', lastMessage: 'Hello! I\'m Sarah from LogiTRACK. I apologize for the delay...', timestamp: '2h ago', status: 'active', unreadCount: 3 },
    { id: 'conv2', title: 'Customs Clearance Update', shipmentId: 'MUM/AE/SHP/0009', lastMessage: 'Your shipment has cleared customs successfully...', timestamp: '4h ago', status: 'resolved', unreadCount: 0 },
    { id: 'conv3', title: 'Delivery Schedule Change', shipmentId: 'MUM/AI/SHP/0001', lastMessage: 'Due to weather conditions, delivery has been rescheduled...', timestamp: '6h ago', status: 'escalated', unreadCount: 1 }
  ];

  const recentTickets = [
    { id: 'TKT-2025-001', title: 'Container Damage Report', priority: 'high', status: 'open', assignee: 'John Smith', created: '2h ago' },
    { id: 'TKT-2025-002', title: 'Documentation Missing', priority: 'medium', status: 'in-progress', assignee: 'Sarah Johnson', created: '5h ago' },
    { id: 'TKT-2025-003', title: 'Billing Inquiry', priority: 'low', status: 'resolved', assignee: 'Mike Chen', created: '1d ago' }
  ];

  const alerts = [
    { type: 'warning', message: 'Shipment MUM/SE/SHP/0020 requires additional documentation', time: '2 hours ago' },
    { type: 'info', message: 'New customs regulation update for EU imports', time: '4 hours ago' },
    { type: 'success', message: 'Container BKSU9898988 successfully loaded', time: '6 hours ago' }
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Here is your logistics overview.</p>
      </div>

      {!isAdmin && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-sky-50 border border-sky-200 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <p className="text-sm text-sky-800">
            <span className="font-semibold">Scoped access active.</span> You are viewing data assigned to your account only.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={stat.onClick}
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.changeType === 'positive' ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {stat.changeType === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Ship className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Recent Shipments</h2>
            </div>
            <button onClick={onViewShipments} className="text-xs text-sky-600 font-medium hover:text-sky-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentShipments.map((s) => (
              <div key={s.id} onClick={onViewShipments} className="px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-900">{s.id}</span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${s.statusColor}`}>{s.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{s.origin} → {s.destination}</p>
                  <p className="text-xs text-gray-400">ETA: {s.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Recent Conversations</h2>
            </div>
            <button onClick={onViewCommunication} className="text-xs text-sky-600 font-medium hover:text-sky-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentConversations.map((c) => (
              <div key={c.id} onClick={onViewCommunication} className="px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{c.title}</span>
                  {c.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-sky-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{c.unreadCount}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-1">{c.shipmentId}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{c.lastMessage}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-gray-400">{c.timestamp}</span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                    c.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                    c.status === 'escalated' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Recent Tickets</h2>
            </div>
            <button onClick={onViewTickets} className="text-xs text-sky-600 font-medium hover:text-sky-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentTickets.map((t) => (
              <div key={t.id} onClick={onViewTickets} className="px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{t.title}</span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                    t.priority === 'high' ? 'bg-red-50 text-red-700' :
                    t.priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>{t.priority}</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{t.id}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Assigned: {t.assignee}</span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                    t.status === 'open' ? 'bg-sky-50 text-sky-700' :
                    t.status === 'in-progress' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <AlertTriangle className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Alerts & Notifications</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {alerts.map((alert, index) => (
              <div key={index} className="px-5 py-3.5 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  alert.type === 'warning' ? 'bg-amber-400' :
                  alert.type === 'info' ? 'bg-sky-400' : 'bg-emerald-400'
                }`} />
                <div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            <button
              onClick={onNewBooking}
              className="flex items-center gap-3 px-4 py-3.5 border border-gray-200 rounded-lg hover:border-sky-300 hover:bg-sky-50/50 transition-all group"
            >
              <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                <Briefcase className="w-4 h-4 text-sky-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">New Booking</span>
            </button>
            <button
              onClick={onViewShipments}
              className="flex items-center gap-3 px-4 py-3.5 border border-gray-200 rounded-lg hover:border-sky-300 hover:bg-sky-50/50 transition-all group"
            >
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Ship className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Track Shipment</span>
            </button>
            <button
              onClick={onViewCommunication}
              className="flex items-center gap-3 px-4 py-3.5 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
            >
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Messages</span>
            </button>
            <button
              onClick={onViewTickets}
              className="flex items-center gap-3 px-4 py-3.5 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50/50 transition-all group"
            >
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Ticket className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
