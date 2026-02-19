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
  bgColor: string;
  activeBgColor: string;
}

const NavButton: React.FC<{
  item: NavItem;
  isActive: boolean;
}> = ({ item, isActive }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={item.onClick}
      style={{
        backgroundColor: isActive ? item.activeBgColor : item.bgColor,
        boxShadow: isActive ? `0 2px 0 0 ${item.iconColor}` : 'none',
      }}
      className="relative flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 rounded-xl flex-shrink-0 transition-all duration-200 hover:scale-105 hover:brightness-95 min-w-[48px]"
    >
      <Icon
        style={{ color: item.iconColor }}
        className="w-5 h-5 flex-shrink-0"
      />
      <span
        style={{ color: item.iconColor }}
        className="text-[10px] font-bold whitespace-nowrap leading-none"
      >
        {item.shortLabel}
      </span>
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
    { id: 'dashboard',     label: 'Dashboard',    shortLabel: 'Home',      icon: LayoutDashboard, onClick: onDashboardClick,     iconColor: '#0369a1', bgColor: '#e0f2fe', activeBgColor: '#bae6fd' },
    { id: 'shipments',     label: 'Shipments',    shortLabel: 'Ships',     icon: Ship,            onClick: onShipmentsClick,     iconColor: '#1d4ed8', bgColor: '#dbeafe', activeBgColor: '#bfdbfe' },
    { id: 'map',           label: 'Map View',     shortLabel: 'Map',       icon: Map,             onClick: onMapViewClick,       iconColor: '#0f766e', bgColor: '#ccfbf1', activeBgColor: '#99f6e4' },
    { id: 'bookings',      label: 'Bookings',     shortLabel: 'Books',     icon: BookOpen,        onClick: onBookingsClick,      iconColor: '#047857', bgColor: '#d1fae5', activeBgColor: '#a7f3d0' },
    { id: 'quotation',     label: 'Quote & Book', shortLabel: 'Quote',     icon: FileSearch,      onClick: onQuotationClick,     iconColor: '#0e7490', bgColor: '#cffafe', activeBgColor: '#a5f3fc' },
    { id: 'customs',       label: 'Customs',      shortLabel: 'Customs',   icon: ScrollText,      onClick: onCustomsClick,       iconColor: '#c2410c', bgColor: '#ffedd5', activeBgColor: '#fed7aa' },
    { id: 'booking',       label: 'Book',         shortLabel: 'Book',      icon: Briefcase,       onClick: onBookingClick,       iconColor: '#15803d', bgColor: '#dcfce7', activeBgColor: '#bbf7d0' },
    { id: 'warehouse',     label: 'Warehouse',    shortLabel: 'Store',     icon: Building2,       onClick: onWarehouseClick,     iconColor: '#b45309', bgColor: '#fef3c7', activeBgColor: '#fde68a' },
    { id: 'inquiry',       label: 'Inquiry',      shortLabel: 'Inquiry',   icon: PackageSearch,   onClick: onInquiryClick,       iconColor: '#4d7c0f', bgColor: '#ecfccb', activeBgColor: '#d9f99d' },
    { id: 'leads',         label: 'Leads',        shortLabel: 'Leads',     icon: User,            onClick: onLeadsClick,         iconColor: '#be123c', bgColor: '#ffe4e6', activeBgColor: '#fecdd3' },
    { id: 'communication', label: 'Messages',     shortLabel: 'Msgs',      icon: MessageSquare,   onClick: onCommunicationClick, iconColor: '#6d28d9', bgColor: '#ede9fe', activeBgColor: '#ddd6fe' },
    { id: 'invoices',      label: 'Invoice',      shortLabel: 'Invoice',   icon: FileText,        onClick: onInvoicesClick,      iconColor: '#a16207', bgColor: '#fef9c3', activeBgColor: '#fef08a' },
    { id: 'tickets',       label: 'Tickets',      shortLabel: 'Tickets',   icon: TicketCheck,     onClick: onTicketsClick,       iconColor: '#b91c1c', bgColor: '#fee2e2', activeBgColor: '#fecaca' },
    { id: 'webhooks',      label: 'Webhooks',     shortLabel: 'Hooks',     icon: Webhook,         onClick: onWebhooksClick,      iconColor: '#a21caf', bgColor: '#fae8ff', activeBgColor: '#f5d0fe' },
    { id: 'webhook-docs',  label: 'API Docs',     shortLabel: 'API',       icon: Code2,           onClick: onWebhookDocsClick,   iconColor: '#334155', bgColor: '#f1f5f9', activeBgColor: '#e2e8f0' },
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
