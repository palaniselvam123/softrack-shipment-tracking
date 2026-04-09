import React from 'react';
import { TrendingUp, TrendingDown, Package, Ship, Clock, Briefcase, AlertTriangle, CheckCircle, Users, MessageCircle, Ticket, ShieldCheck, ArrowRight, BarChart3, ArrowUpRight, Zap } from 'lucide-react';
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
    { title: 'Total Shipments', value: liveStats ? liveStats.totalShipments.toLocaleString() : '--', change: '+12%', positive: true, icon: Package, gradient: 'from-sky-500 to-cyan-500', bg: 'bg-sky-50', ring: 'ring-sky-100', onClick: onViewShipments },
    { title: 'In Transit', value: liveStats ? liveStats.inTransit.toLocaleString() : '--', change: '+5%', positive: true, icon: Ship, gradient: 'from-blue-500 to-sky-500', bg: 'bg-blue-50', ring: 'ring-blue-100', onClick: onViewShipments },
    { title: 'Delayed', value: liveStats ? liveStats.delayed.toLocaleString() : '--', change: '-2%', positive: false, icon: Clock, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', ring: 'ring-amber-100', onClick: onViewShipments },
    { title: 'Total Bookings', value: liveStats ? liveStats.totalBookings.toLocaleString() : '--', change: '+18%', positive: true, icon: Briefcase, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', ring: 'ring-emerald-100', onClick: onViewBookings },
  ];

  const recentShipments = [
    { id: 'MUM/SE/SHP/0024', status: 'In Transit', origin: 'Mumbai', destination: 'New York', eta: '2025-11-29', statusColor: 'bg-blue-100 text-blue-700' },
    { id: 'MUM/AE/SHP/0013', status: 'Customs', origin: 'Chennai', destination: 'Hanoi', eta: '2025-11-25', statusColor: 'bg-amber-100 text-amber-700' },
    { id: 'MUM/AI/SHP/0002', status: 'Delivered', origin: 'Frankfurt', destination: 'Mumbai', eta: '2025-11-20', statusColor: 'bg-emerald-100 text-emerald-700' },
  ];

  const recentConversations = [
    { id: 'conv1', title: 'Express Shipment Inquiry', shipmentId: 'MUM/SE/SHP/0001', lastMessage: 'Hello! I\'m Sarah from LogiTRACK. I apologize for the delay...', timestamp: '2h ago', status: 'active', unreadCount: 3 },
    { id: 'conv2', title: 'Customs Clearance Update', shipmentId: 'MUM/AE/SHP/0009', lastMessage: 'Your shipment has cleared customs successfully...', timestamp: '4h ago', status: 'resolved', unreadCount: 0 },
    { id: 'conv3', title: 'Delivery Schedule Change', shipmentId: 'MUM/AI/SHP/0001', lastMessage: 'Due to weather conditions, delivery has been rescheduled...', timestamp: '6h ago', status: 'escalated', unreadCount: 1 },
  ];

  const recentTickets = [
    { id: 'TKT-2025-001', title: 'Container Damage Report', priority: 'high', status: 'open', assignee: 'John Smith', created: '2h ago' },
    { id: 'TKT-2025-002', title: 'Documentation Missing', priority: 'medium', status: 'in-progress', assignee: 'Sarah Johnson', created: '5h ago' },
    { id: 'TKT-2025-003', title: 'Billing Inquiry', priority: 'low', status: 'resolved', assignee: 'Mike Chen', created: '1d ago' },
  ];

  const alerts = [
    { type: 'warning', message: 'Shipment MUM/SE/SHP/0020 requires additional documentation', time: '2 hours ago' },
    { type: 'info', message: 'New customs regulation update for EU imports', time: '4 hours ago' },
    { type: 'success', message: 'Container BKSU9898988 successfully loaded', time: '6 hours ago' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Live</span>
        </div>
        <p className="text-sm text-gray-500">Welcome back. Here is your logistics overview.</p>
      </div>

      {!isAdmin && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-sky-50 border border-sky-200 rounded-xl">
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
            <button
              key={index}
              onClick={stat.onClick}
              className="relative bg-white border border-gray-200 rounded-2xl p-5 text-left hover:shadow-md hover:border-gray-300 transition-all duration-300 group overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-full -translate-y-16 translate-x-16 opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                    stat.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{stat.title}</p>
              </div>
              <ArrowUpRight className="absolute bottom-4 right-4 w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'New Booking', icon: Briefcase, color: 'sky', onClick: onNewBooking },
          { label: 'Track Shipment', icon: Ship, color: 'blue', onClick: onViewShipments },
          { label: 'Messages', icon: Users, color: 'emerald', onClick: onViewCommunication },
          { label: 'Support', icon: Ticket, color: 'amber', onClick: onViewTickets },
        ].map((action) => {
          const Icon = action.icon;
          const colorMap: Record<string, { bg: string; hover: string; icon: string; text: string }> = {
            sky: { bg: 'bg-sky-50', hover: 'hover:bg-sky-100/80 hover:border-sky-200', icon: 'text-sky-600', text: 'text-sky-700' },
            blue: { bg: 'bg-blue-50', hover: 'hover:bg-blue-100/80 hover:border-blue-200', icon: 'text-blue-600', text: 'text-blue-700' },
            emerald: { bg: 'bg-emerald-50', hover: 'hover:bg-emerald-100/80 hover:border-emerald-200', icon: 'text-emerald-600', text: 'text-emerald-700' },
            amber: { bg: 'bg-amber-50', hover: 'hover:bg-amber-100/80 hover:border-amber-200', icon: 'text-amber-600', text: 'text-amber-700' },
          };
          const c = colorMap[action.color];
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`flex items-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xl transition-all duration-200 group ${c.hover}`}
            >
              <div className={`w-9 h-9 ${c.bg} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <Icon className={`w-4 h-4 ${c.icon}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{action.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <DashCard
          icon={Ship}
          title="Recent Shipments"
          actionLabel="View all"
          onAction={onViewShipments}
        >
          <div className="divide-y divide-gray-100">
            {recentShipments.map((s) => (
              <div key={s.id} onClick={onViewShipments} className="px-5 py-3.5 hover:bg-gray-50/80 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-gray-900">{s.id}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${s.statusColor}`}>{s.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-medium">{s.origin} &rarr; {s.destination}</p>
                  <p className="text-xs text-gray-400">ETA: {s.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </DashCard>

        <DashCard
          icon={MessageCircle}
          title="Recent Conversations"
          actionLabel="View all"
          onAction={onViewCommunication}
        >
          <div className="divide-y divide-gray-100">
            {recentConversations.map((c) => (
              <div key={c.id} onClick={onViewCommunication} className="px-5 py-3.5 hover:bg-gray-50/80 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">{c.title}</span>
                  {c.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-sky-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">{c.unreadCount}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 font-medium mb-1">{c.shipmentId}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{c.lastMessage}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-gray-400">{c.timestamp}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    c.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    c.status === 'escalated' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </DashCard>

        <DashCard
          icon={Ticket}
          title="Recent Tickets"
          actionLabel="View all"
          onAction={onViewTickets}
        >
          <div className="divide-y divide-gray-100">
            {recentTickets.map((t) => (
              <div key={t.id} onClick={onViewTickets} className="px-5 py-3.5 hover:bg-gray-50/80 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">{t.title}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    t.priority === 'high' ? 'bg-red-100 text-red-700' :
                    t.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>{t.priority}</span>
                </div>
                <p className="text-xs text-gray-400 font-medium mb-1">{t.id}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Assigned: {t.assignee}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    t.status === 'open' ? 'bg-sky-100 text-sky-700' :
                    t.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </DashCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashCard icon={AlertTriangle} title="Alerts & Notifications">
          <div className="divide-y divide-gray-100">
            {alerts.map((alert, index) => (
              <div key={index} className="px-5 py-3.5 flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ring-4 ${
                  alert.type === 'warning' ? 'bg-amber-400 ring-amber-100' :
                  alert.type === 'info' ? 'bg-sky-400 ring-sky-100' : 'bg-emerald-400 ring-emerald-100'
                }`} />
                <div>
                  <p className="text-sm text-gray-700 font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </DashCard>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full translate-y-16 -translate-x-16" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-semibold text-gray-200">Performance Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-3xl font-bold text-white">{liveStats?.delivered?.toLocaleString() || '--'}</p>
                <p className="text-xs text-gray-400 mt-1">Delivered this month</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{liveStats?.pendingBookings || '--'}</p>
                <p className="text-xs text-gray-400 mt-1">Pending bookings</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-300">
                  {liveStats ? `${((liveStats.delivered / (liveStats.totalShipments || 1)) * 100).toFixed(0)}% delivery rate` : 'Calculating...'}
                </span>
              </div>
              <button onClick={onViewShipments} className="text-xs text-sky-400 font-semibold hover:text-sky-300 flex items-center gap-1 transition-colors">
                Details <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function DashCard({ icon: Icon, title, actionLabel, onAction, children }: {
  icon: React.FC<{ className?: string }>;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        </div>
        {actionLabel && onAction && (
          <button onClick={onAction} className="text-xs text-sky-600 font-semibold hover:text-sky-700 flex items-center gap-1 transition-colors">
            {actionLabel} <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export default Dashboard;
