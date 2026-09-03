import React, { useEffect, useRef, useState } from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onDashboardClick: () => void;
  onShipmentsClick: () => void;
  onBookingsClick: () => void;
  onMapViewClick?: () => void;
  onInvoicesClick?: () => void;
  onCommunicationClick?: () => void;
  onTicketsClick?: () => void;
  onWebhooksClick?: () => void;
  onWebhookDocsClick?: () => void;
  onCustomsClick?: () => void;
  onInquiryClick?: () => void;
  onLeadsClick?: () => void;
  currentView?: string;
}

const Header: React.FC<HeaderProps> = ({
  onDashboardClick,
  onShipmentsClick,
  onBookingsClick,
  onMapViewClick,
  onInvoicesClick,
  onCommunicationClick,
  onTicketsClick,
  onWebhooksClick,
  onWebhookDocsClick,
  onCustomsClick,
  onInquiryClick,
  onLeadsClick,
  currentView
}) => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showUserMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const menuItems = [
    { name: 'Dashboard', active: currentView === 'dashboard', onClick: onDashboardClick },
    { name: 'Shipments', active: currentView === 'table' || currentView === 'details', onClick: onShipmentsClick },
    { name: 'Map View', active: currentView === 'map-view', onClick: onMapViewClick },
    { name: 'Bookings', active: currentView === 'bookings', onClick: onBookingsClick },
    { name: 'Customs', active: currentView === 'customs', onClick: onCustomsClick },
    { name: 'Inquiry', active: currentView === 'inquiry', onClick: onInquiryClick },
    { name: 'Leads', active: currentView === 'leads', onClick: onLeadsClick },
    { name: 'Communication', active: currentView === 'communication', onClick: onCommunicationClick },
    { name: 'Invoice', active: currentView === 'invoices', onClick: onInvoicesClick },
    { name: 'Tickets', active: currentView === 'tickets', onClick: onTicketsClick },
    { name: 'Webhooks', active: currentView === 'webhooks', onClick: onWebhooksClick },
    { name: 'API Docs', active: currentView === 'webhook-docs', onClick: onWebhookDocsClick }
  ];

  return (
    <header className="bg-white border-b border-surface-line sticky top-0 z-40">
      <div className="h-14 px-6 flex items-center gap-6">
        {/* Wordmark */}
        <button
          onClick={onDashboardClick}
          className="shrink-0 text-[17px] font-bold tracking-tight"
        >
          <span className="text-brand-600">Logi</span>
          <span className="text-navy-900">TRACK</span>
        </button>

        {/* Primary navigation */}
        {/* The inner row carries `mx-auto` rather than the scroller carrying
            `justify-center`: a centred flex container clips overflow on both
            edges, leaving the first tab unreachable once the nav is too wide. */}
        <nav className="flex-1 min-w-0 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 mx-auto w-max">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`shrink-0 px-3 py-2 text-[13px] rounded-md transition-colors duration-150 ${
                  item.active
                    ? 'text-navy-900 font-semibold'
                    : 'text-gray-500 font-normal hover:text-navy-900 hover:bg-surface-head'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Utilities */}
        <div className="shrink-0 flex items-center gap-1">
          <button
            className="relative p-2 rounded-md text-gray-500 hover:text-navy-900 hover:bg-surface-head transition-colors duration-150"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-md hover:bg-surface-head transition-colors duration-150"
            >
              <span className="w-6 h-6 rounded-full bg-surface-tile border border-surface-line flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-navy-600" />
              </span>
              <span className="text-[10px] leading-none text-gray-500">Profile</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-card border border-surface-line shadow-pop py-1 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-surface-soft">
                  <p className="text-label text-gray-500">Signed in as</p>
                  <p className="text-field font-medium text-navy-900 truncate mt-0.5">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    signOut();
                  }}
                  className="w-full text-left px-4 py-2.5 text-field text-gray-700 hover:bg-surface-head flex items-center gap-2.5 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
