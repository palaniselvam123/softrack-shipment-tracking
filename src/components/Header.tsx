import React, { useState } from 'react';
import {
  User, Bell, LogOut, Settings,
  LayoutDashboard, Ship, Map, BookOpen, FileSearch,
  ScrollText, Briefcase, MessageSquare, FileText,
  TicketCheck, Webhook, Code2, PackageSearch,
  Building2
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
}

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  onClick?: () => void;
  iconColor: string;
  gradient: string;
  activeGradient: string;
  labelColor: string;
  shadowColor: string;
}

const NavButton: React.FC<{
  item: NavItem;
  isActive: boolean;
}> = ({ item, isActive }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={item.onClick}
      title={item.label}
      className="relative flex flex-col items-center justify-center gap-1.5 px-1.5 py-2 flex-shrink-0 transition-all duration-200 hover:scale-105 min-w-[56px] group"
      style={{ background: 'transparent' }}
    >
      <div
        className="flex items-center justify-center w-11 h-11 transition-all duration-200"
        style={{
          borderRadius: '14px',
          background: isActive ? item.activeGradient : item.gradient,
          boxShadow: isActive
            ? `0 6px 16px -2px ${item.shadowColor}, 0 2px 4px -1px ${item.shadowColor}`
            : `0 3px 8px -2px ${item.shadowColor}`,
          transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
        }}
      >
        <Icon className="w-5 h-5" style={{ color: '#ffffff', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.15))' }} />
      </div>
      <span
        className="text-[9px] font-semibold whitespace-nowrap leading-none tracking-wide transition-colors duration-200"
        style={{ color: isActive ? item.iconColor : '#6b7280' }}
      >
        {item.shortLabel}
      </span>
      {isActive && (
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
          style={{ background: item.iconColor }}
        />
      )}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({
  onDashboardClick,
  onShipmentsClick,
  onBookingsClick,
  onBookingClick,
  onMapViewClick,
  onInvoicesClick,
  onCommunicationClick,
  onTicketsClick,
  onWebhooksClick,
  onWebhookDocsClick,
  onCustomsClick,
  onInquiryClick,
  onLeadsClick,
  onQuotationClick,
  onAdminClick,
  onWarehouseClick,
  currentView
}) => {
  const { user, signOut, isAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard',     label: 'Dashboard',    shortLabel: 'Home',    icon: LayoutDashboard, onClick: onDashboardClick,     iconColor: '#0284c7', gradient: 'linear-gradient(145deg, #38bdf8 0%, #0284c7 100%)',   activeGradient: 'linear-gradient(145deg, #0ea5e9 0%, #0369a1 100%)',   labelColor: '#0284c7', shadowColor: 'rgba(2,132,199,0.40)' },
    { id: 'shipments',     label: 'Shipments',    shortLabel: 'Ships',   icon: Ship,            onClick: onShipmentsClick,     iconColor: '#2563eb', gradient: 'linear-gradient(145deg, #93c5fd 0%, #2563eb 100%)',   activeGradient: 'linear-gradient(145deg, #60a5fa 0%, #1d4ed8 100%)',   labelColor: '#2563eb', shadowColor: 'rgba(37,99,235,0.38)' },
    { id: 'map',           label: 'Map View',     shortLabel: 'Map',     icon: Map,             onClick: onMapViewClick,       iconColor: '#0d9488', gradient: 'linear-gradient(145deg, #5eead4 0%, #0d9488 100%)',   activeGradient: 'linear-gradient(145deg, #2dd4bf 0%, #0f766e 100%)',   labelColor: '#0d9488', shadowColor: 'rgba(13,148,136,0.38)' },
    { id: 'bookings',      label: 'Bookings',     shortLabel: 'Books',   icon: BookOpen,        onClick: onBookingsClick,      iconColor: '#059669', gradient: 'linear-gradient(145deg, #6ee7b7 0%, #059669 100%)',   activeGradient: 'linear-gradient(145deg, #34d399 0%, #047857 100%)',   labelColor: '#059669', shadowColor: 'rgba(5,150,105,0.38)' },
    { id: 'quotation',     label: 'Quote & Book', shortLabel: 'Quote',   icon: FileSearch,      onClick: onQuotationClick,     iconColor: '#0891b2', gradient: 'linear-gradient(145deg, #67e8f9 0%, #0891b2 100%)',   activeGradient: 'linear-gradient(145deg, #22d3ee 0%, #0e7490 100%)',   labelColor: '#0891b2', shadowColor: 'rgba(8,145,178,0.38)' },
    { id: 'customs',       label: 'Customs',      shortLabel: 'Customs', icon: ScrollText,      onClick: onCustomsClick,       iconColor: '#ea580c', gradient: 'linear-gradient(145deg, #fdba74 0%, #ea580c 100%)',   activeGradient: 'linear-gradient(145deg, #fb923c 0%, #c2410c 100%)',   labelColor: '#ea580c', shadowColor: 'rgba(234,88,12,0.38)' },
    { id: 'booking',       label: 'Book',         shortLabel: 'Book',    icon: Briefcase,       onClick: onBookingClick,       iconColor: '#16a34a', gradient: 'linear-gradient(145deg, #86efac 0%, #16a34a 100%)',   activeGradient: 'linear-gradient(145deg, #4ade80 0%, #15803d 100%)',   labelColor: '#16a34a', shadowColor: 'rgba(22,163,74,0.38)' },
    { id: 'warehouse',     label: 'Warehouse',    shortLabel: 'Store',   icon: Building2,       onClick: onWarehouseClick,     iconColor: '#d97706', gradient: 'linear-gradient(145deg, #fde68a 0%, #d97706 100%)',   activeGradient: 'linear-gradient(145deg, #fbbf24 0%, #b45309 100%)',   labelColor: '#d97706', shadowColor: 'rgba(217,119,6,0.38)' },
    { id: 'inquiry',       label: 'Inquiry',      shortLabel: 'Inquiry', icon: PackageSearch,   onClick: onInquiryClick,       iconColor: '#65a30d', gradient: 'linear-gradient(145deg, #bef264 0%, #65a30d 100%)',   activeGradient: 'linear-gradient(145deg, #a3e635 0%, #4d7c0f 100%)',   labelColor: '#65a30d', shadowColor: 'rgba(101,163,13,0.38)' },
    { id: 'leads',         label: 'Leads',        shortLabel: 'Leads',   icon: User,            onClick: onLeadsClick,         iconColor: '#e11d48', gradient: 'linear-gradient(145deg, #fda4af 0%, #e11d48 100%)',   activeGradient: 'linear-gradient(145deg, #fb7185 0%, #be123c 100%)',   labelColor: '#e11d48', shadowColor: 'rgba(225,29,72,0.38)' },
    { id: 'communication', label: 'Messages',     shortLabel: 'Msgs',    icon: MessageSquare,   onClick: onCommunicationClick, iconColor: '#0369a1', gradient: 'linear-gradient(145deg, #7dd3fc 0%, #0369a1 100%)',   activeGradient: 'linear-gradient(145deg, #38bdf8 0%, #075985 100%)',   labelColor: '#0369a1', shadowColor: 'rgba(3,105,161,0.38)' },
    { id: 'invoices',      label: 'Invoice',      shortLabel: 'Invoice', icon: FileText,        onClick: onInvoicesClick,      iconColor: '#ca8a04', gradient: 'linear-gradient(145deg, #fef08a 0%, #ca8a04 100%)',   activeGradient: 'linear-gradient(145deg, #fde047 0%, #a16207 100%)',   labelColor: '#ca8a04', shadowColor: 'rgba(202,138,4,0.38)' },
    { id: 'tickets',       label: 'Tickets',      shortLabel: 'Tickets', icon: TicketCheck,     onClick: onTicketsClick,       iconColor: '#dc2626', gradient: 'linear-gradient(145deg, #fca5a5 0%, #dc2626 100%)',   activeGradient: 'linear-gradient(145deg, #f87171 0%, #b91c1c 100%)',   labelColor: '#dc2626', shadowColor: 'rgba(220,38,38,0.38)' },
    { id: 'webhooks',      label: 'Webhooks',     shortLabel: 'Hooks',   icon: Webhook,         onClick: onWebhooksClick,      iconColor: '#db2777', gradient: 'linear-gradient(145deg, #f9a8d4 0%, #db2777 100%)',   activeGradient: 'linear-gradient(145deg, #f472b6 0%, #be185d 100%)',   labelColor: '#db2777', shadowColor: 'rgba(219,39,119,0.38)' },
    { id: 'webhook-docs',  label: 'API Docs',     shortLabel: 'API',     icon: Code2,           onClick: onWebhookDocsClick,   iconColor: '#475569', gradient: 'linear-gradient(145deg, #cbd5e1 0%, #475569 100%)',   activeGradient: 'linear-gradient(145deg, #94a3b8 0%, #334155 100%)',   labelColor: '#475569', shadowColor: 'rgba(71,85,105,0.38)' },
  ];

  const isActive = (id: string) => {
    if (id === 'shipments') return currentView === 'table' || currentView === 'details';
    if (id === 'map') return currentView === 'map-view';
    if (id === 'quotation') return currentView === 'quotation';
    if (id === 'invoices') return currentView === 'invoices';
    if (id === 'webhook-docs') return currentView === 'webhook-docs';
    return currentView === id;
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-xl font-bold hidden sm:block">
                <span className="text-gray-800">Logi</span>
                <span className="bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">TRACK</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-0.5 flex-nowrap overflow-x-auto scrollbar-hide">
              {navItems.map(item => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={isActive(item.id)}
                />
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 group">
              <Bell className="w-4 h-4 text-gray-600 group-hover:text-sky-600 transition-colors" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white" />
            </button>

            <div className="relative">
              <button
                className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-gray-50 rounded-lg transition-all duration-200"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-700 rounded-lg flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium hidden sm:block max-w-[120px] truncate">
                  {user?.email}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Signed in as</p>
                    <p className="text-sm text-gray-900 font-semibold truncate mt-1">{user?.email}</p>
                  </div>
                  {isAdmin && onAdminClick && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onAdminClick();
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-3 transition-all duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="font-medium">Admin Portal</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
