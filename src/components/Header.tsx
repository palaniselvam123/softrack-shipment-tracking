import React, { useState, useRef, useEffect } from 'react';
import {
  User, Bell, LogOut, Settings, ChevronDown, Search, Menu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onDashboardClick: () => void;
  onShipmentsClick: () => void;
  onBookingsClick: () => void;
  onBookingClick: () => void;
  onMapViewClick?: () => void;
  onInvoicesClick?: () => void;
  onCommunicationClick?: () => void;
  onTicketsClick?: () => void;
  onWebhooksClick?: () => void;
  onWebhookDocsClick?: () => void;
  onCustomsClick?: () => void;
  onInquiryClick?: () => void;
  onLeadsClick?: () => void;
  onQuotationClick?: () => void;
  onAdminClick?: () => void;
  onWarehouseClick?: () => void;
  currentView?: string;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onDashboardClick,
  onAdminClick,
  onToggleSidebar,
  currentView
}) => {
  const { user, signOut, isAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'Shipment MUM/SE/SHP/0020 delayed', time: '2h ago', unread: true },
    { id: 2, title: 'New customs regulation for EU', time: '4h ago', unread: true },
    { id: 3, title: 'Invoice IDDEC026748 overdue', time: '6h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={onDashboardClick}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:block">
            <span className="text-gray-900">Logi</span>
            <span className="text-sky-600">TRACK</span>
          </span>
        </div>

        <div className="hidden md:flex items-center ml-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search shipments, bookings, invoices..."
              className="w-80 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${n.unread ? 'bg-sky-50/40' : ''}`}>
                    <div className="flex items-start gap-3">
                      {n.unread && <div className="w-2 h-2 bg-sky-500 rounded-full mt-1.5 flex-shrink-0" />}
                      <div className={n.unread ? '' : 'ml-5'}>
                        <p className="text-sm text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-sm text-sky-600 font-medium hover:text-sky-700">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <div ref={userMenuRef} className="relative">
          <button
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-700 max-w-[140px] truncate">{user?.email}</p>
              <p className="text-[11px] text-gray-400">{isAdmin ? 'Administrator' : 'User'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Signed in as</p>
                <p className="text-sm text-gray-900 font-semibold truncate mt-0.5">{user?.email}</p>
              </div>
              {isAdmin && onAdminClick && (
                <button
                  onClick={() => { setShowUserMenu(false); onAdminClick(); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span>Admin Portal</span>
                </button>
              )}
              <button
                onClick={() => { setShowUserMenu(false); signOut(); }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
