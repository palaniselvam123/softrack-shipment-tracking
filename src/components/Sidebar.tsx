import React, { useState } from 'react';
import {
  LayoutDashboard, Ship, Map, BookOpen, FileSearch,
  ScrollText, Briefcase, Building2, PackageSearch,
  User, MessageSquare, FileText, TicketCheck, Webhook,
  Code2, ChevronDown, X
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  isOpen: boolean;
  onClose: () => void;
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
  onWarehouseClick?: () => void;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
  matchViews?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView, isOpen, onClose,
  onDashboardClick, onShipmentsClick, onBookingsClick, onBookingClick,
  onMapViewClick, onInvoicesClick, onCommunicationClick, onTicketsClick,
  onWebhooksClick, onWebhookDocsClick, onCustomsClick, onInquiryClick,
  onLeadsClick, onQuotationClick, onWarehouseClick,
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (label: string) => {
    const next = new Set(collapsedGroups);
    next.has(label) ? next.delete(label) : next.add(label);
    setCollapsedGroups(next);
  };

  const navGroups: NavGroup[] = [
    { label: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, onClick: onDashboardClick },
    ]},
    { label: 'Operations', items: [
      { id: 'shipments', label: 'Shipments', icon: Ship, onClick: onShipmentsClick, matchViews: ['table', 'details'] },
      { id: 'map-view', label: 'Map View', icon: Map, onClick: onMapViewClick },
      { id: 'bookings', label: 'Bookings', icon: BookOpen, onClick: onBookingsClick },
      { id: 'booking', label: 'New Booking', icon: Briefcase, onClick: onBookingClick },
      { id: 'quotation', label: 'Quote & Book', icon: FileSearch, onClick: onQuotationClick },
      { id: 'customs', label: 'Customs', icon: ScrollText, onClick: onCustomsClick },
      { id: 'warehouse', label: 'Warehouse', icon: Building2, onClick: onWarehouseClick },
    ]},
    { label: 'Commercial', items: [
      { id: 'invoices', label: 'Invoices', icon: FileText, onClick: onInvoicesClick },
      { id: 'inquiry', label: 'Inquiries', icon: PackageSearch, onClick: onInquiryClick },
      { id: 'leads', label: 'Leads', icon: User, onClick: onLeadsClick },
    ]},
    { label: 'Support', items: [
      { id: 'communication', label: 'Messages', icon: MessageSquare, onClick: onCommunicationClick },
      { id: 'tickets', label: 'Tickets', icon: TicketCheck, onClick: onTicketsClick },
    ]},
    { label: 'Developer', items: [
      { id: 'webhooks', label: 'Webhooks', icon: Webhook, onClick: onWebhooksClick },
      { id: 'webhook-docs', label: 'API Docs', icon: Code2, onClick: onWebhookDocsClick },
    ]},
  ];

  const isActive = (item: NavItem) => {
    if (item.matchViews) return item.matchViews.includes(currentView);
    return currentView === item.id;
  };

  const handleItemClick = (item: NavItem) => {
    item.onClick?.();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-16 left-0 bottom-0 w-60 bg-white border-r border-gray-200/80 z-30 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 lg:hidden">
          <span className="text-sm font-semibold text-gray-700">Navigation</span>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {navGroups.map((group) => {
            const isCollapsed = collapsedGroups.has(group.label);
            return (
              <div key={group.label} className="mb-1">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item);
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group relative ${
                            active
                              ? 'bg-sky-50 text-sky-700 font-semibold'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sky-500 rounded-r-full" />
                          )}
                          <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${
                            active ? 'text-sky-600' : 'text-gray-400 group-hover:text-gray-600'
                          }`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-xl p-3.5">
            <p className="text-xs font-bold text-gray-700">LogiTRACK Enterprise</p>
            <p className="text-[11px] text-gray-400 mt-0.5">v2.4.0 -- Customer Portal</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
