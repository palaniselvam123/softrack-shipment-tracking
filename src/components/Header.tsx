import React, { useState } from 'react';
import { User, Bell, LogOut } from 'lucide-react';
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
  currentView?: string;
}

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
  currentView
}) => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const getMenuItemStyle = (itemName: string, isActive: boolean) => {
    if (isActive) {
      return `text-gray-900 font-semibold border-b-2 border-logitrack-blue-600`;
    } else {
      return `text-gray-600 hover:text-gray-900`;
    }
  };
  const menuItems = [
    { name: 'Dashboard', active: currentView === 'dashboard', onClick: onDashboardClick },
    { name: 'Shipments', active: currentView === 'table' || currentView === 'details', onClick: onShipmentsClick },
    { name: 'Map View', active: currentView === 'map-view', onClick: onMapViewClick },
    { name: 'Bookings', active: currentView === 'bookings', onClick: onBookingsClick },
    { name: 'Quote & Book', active: currentView === 'quotation', onClick: onQuotationClick, highlight: true },
    { name: 'Customs', active: currentView === 'customs', onClick: onCustomsClick },
    { name: 'Book', active: currentView === 'booking', onClick: onBookingClick },
    { name: 'Inquiry', active: currentView === 'inquiry', onClick: onInquiryClick },
    { name: 'Leads', active: currentView === 'leads', onClick: onLeadsClick },
    { name: 'Communication', active: currentView === 'communication', onClick: onCommunicationClick },
    { name: 'Invoice', active: currentView === 'invoices', onClick: onInvoicesClick },
    { name: 'Tickets', active: currentView === 'tickets', onClick: onTicketsClick },
    { name: 'Webhooks', active: currentView === 'webhooks', onClick: onWebhooksClick },
    { name: 'API Docs', active: currentView === 'webhook-docs', onClick: onWebhookDocsClick }
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span className="text-gray-800">Logi</span>
                <span className="bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">TRACK</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-1">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  onClick={(e) => {
                      e.preventDefault();
                      if (item.onClick) {
                        item.onClick();
                      }
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    item.active
                      ? 'text-sky-700 bg-sky-50 shadow-sm'
                      : (item as { highlight?: boolean }).highlight
                      ? 'text-sky-700 bg-sky-50 border border-sky-200 hover:bg-sky-100 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 group">
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-sky-600 transition-colors" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></div>
            </button>
            <div className="relative">
              <button
                className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all duration-200"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-sky-700 rounded-lg flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium hidden sm:block max-w-[150px] truncate">
                  {user?.email}
                </span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Signed in as</p>
                    <p className="text-sm text-gray-900 font-semibold truncate mt-1">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center space-x-3 transition-all duration-200 mt-1"
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