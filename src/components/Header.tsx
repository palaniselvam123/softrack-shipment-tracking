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
  icon: React.ElementType;
  onClick?: () => void;
  highlight?: boolean;
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
      className={`relative flex items-center gap-0 overflow-hidden transition-all duration-300 ease-in-out rounded-lg
        px-2.5 py-2
        max-w-[38px] hover:max-w-[160px]
        group
        ${isActive
          ? 'text-sky-700 bg-sky-50 shadow-sm max-w-[160px]'
          : item.highlight
          ? 'text-sky-700 bg-sky-50 border border-sky-200 hover:bg-sky-100 font-semibold'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
      `}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className={`
        text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out
        ml-0 group-hover:ml-2
        max-w-0 group-hover:max-w-[120px]
        opacity-0 group-hover:opacity-100
        ${isActive ? 'ml-2 max-w-[120px] opacity-100' : ''}
      `}>
        {item.label}
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, onClick: onDashboardClick },
    { id: 'shipments', label: 'Shipments', icon: Ship, onClick: onShipmentsClick },
    { id: 'map', label: 'Map View', icon: Map, onClick: onMapViewClick },
    { id: 'bookings', label: 'Bookings', icon: BookOpen, onClick: onBookingsClick },
    { id: 'quotation', label: 'Quote & Book', icon: FileSearch, onClick: onQuotationClick, highlight: true },
    { id: 'customs', label: 'Customs', icon: ScrollText, onClick: onCustomsClick },
    { id: 'booking', label: 'Book', icon: Briefcase, onClick: onBookingClick },
    { id: 'warehouse', label: 'Warehouse', icon: Building2, onClick: onWarehouseClick },
    { id: 'inquiry', label: 'Inquiry', icon: PackageSearch, onClick: onInquiryClick },
    { id: 'leads', label: 'Leads', icon: User, onClick: onLeadsClick },
    { id: 'communication', label: 'Messages', icon: MessageSquare, onClick: onCommunicationClick },
    { id: 'invoices', label: 'Invoice', icon: FileText, onClick: onInvoicesClick },
    { id: 'tickets', label: 'Tickets', icon: TicketCheck, onClick: onTicketsClick },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook, onClick: onWebhooksClick },
    { id: 'webhook-docs', label: 'API Docs', icon: Code2, onClick: onWebhookDocsClick },
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
