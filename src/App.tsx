import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BoxyAI from './components/BoxyAI';
import { supabase } from './lib/supabase';
import { mockInvoices } from './data/mockData';
import ShipmentsTable from './components/ShipmentsTable';
import ShipmentDetails from './components/ShipmentDetails';
import BookingWizard from './components/BookingWizard';
import BookingsList from './components/BookingsList';
import BookingDetailsModal from './components/BookingDetailsModal';
import Dashboard from './components/Dashboard';
import ShipmentsMapView from './components/ShipmentsMapView';
import InvoiceListPage from './components/InvoiceListPage';
import CommunicationHub from './components/CommunicationHub';
import TicketingPortal from './components/TicketingPortal';
import WebhookManager from './components/WebhookManager';
import WebhookDocumentation from './components/WebhookDocumentation';
import CustomsPage from './components/CustomsPage';
import InquiryForm from './components/InquiryForm';
import LeadList from './components/LeadList';
import LoginPage from './components/LoginPage';
import { useAuth } from './contexts/AuthContext';
import AdminPortal from './admin/AdminPortal';

import TrackingPage from './features/tracking/pages/TrackingPage';
import QuotationPage from './features/quotation/pages/QuotationPage';
import WarehousePage from './features/warehouse/pages/WarehousePage';

type ViewType =
  | 'dashboard'
  | 'table'
  | 'details'
  | 'booking'
  | 'bookings'
  | 'map-view'
  | 'tracking'
  | 'invoices'
  | 'communication'
  | 'tickets'
  | 'webhooks'
  | 'webhook-docs'
  | 'customs'
  | 'inquiry'
  | 'leads'
  | 'quotation'
  | 'warehouse'
  | 'admin';

export interface InvoiceStats {
  total: number;
  open: number;
  overdue: number;
  paid: number;
  processing: number;
  disputed: number;
  cancelled: number;
  totalOutstandingIDR: number;
  invoices: Array<{ ref: string; status: string; amount: number; currency: string; vendor: string; shipmentRef: string; dueDate: string }>;
}

export interface DashboardStats {
  totalShipments: number;
  inTransit: number;
  delayed: number;
  delivered: number;
  pendingBookings: number;
  approvedBookings: number;
  totalBookings: number;
  byStatus: Record<string, number>;
  byMode: Record<string, number>;
  invoiceStats?: InvoiceStats;
}

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function fetchStats() {
      const { data: shipments } = await supabase
        .from('shipments')
        .select('shipment_status, "Transport Mode"');

      const { data: bookings } = await supabase
        .from('bookings_from_quotes')
        .select('status');

      if (shipments) {
        const byStatus: Record<string, number> = {};
        const byMode: Record<string, number> = {};
        for (const s of shipments) {
          const st = (s['shipment_status'] || 'Unknown').toLowerCase();
          byStatus[st] = (byStatus[st] || 0) + 1;
          const m = s['Transport Mode'] || 'Unknown';
          byMode[m] = (byMode[m] || 0) + 1;
        }
        const pendingBookings = bookings?.filter(b => b.status === 'pending' || b.status === 'Pending').length ?? 0;
        const approvedBookings = bookings?.filter(b => b.status === 'confirmed' || b.status === 'Confirmed').length ?? 0;
        const openInvoices = mockInvoices.filter(i => i.invoiceStatus === 'OPEN');
        const overdueInvoices = mockInvoices.filter(i => i.invoiceStatus === 'OVERDUE');
        const outstandingInvoices = [...openInvoices, ...overdueInvoices];
        const totalOutstandingIDR = outstandingInvoices.reduce((sum, i) => sum + i.amount, 0);

        const invoiceStats: InvoiceStats = {
          total: mockInvoices.length,
          open: openInvoices.length,
          overdue: overdueInvoices.length,
          paid: mockInvoices.filter(i => i.invoiceStatus === 'PAID').length,
          processing: mockInvoices.filter(i => i.invoiceStatus === 'PROCESSING').length,
          disputed: mockInvoices.filter(i => i.invoiceStatus === 'DISPUTED').length,
          cancelled: mockInvoices.filter(i => i.invoiceStatus === 'CANCELLED').length,
          totalOutstandingIDR,
          invoices: mockInvoices.map(i => ({ ref: i.invoiceRef, status: i.invoiceStatus, amount: i.amount, currency: i.currency, vendor: i.vendor, shipmentRef: i.shipmentRef, dueDate: i.dueDate })),
        };

        const activeInTransit = (byStatus['in transit'] || 0) + (byStatus['departed'] || 0) + (byStatus['loaded'] || 0) + (byStatus['customs hold'] || 0) + (byStatus['arrived'] || 0) + (byStatus['pending'] || 0);
        setDashboardStats({
          totalShipments: shipments.length,
          inTransit: activeInTransit,
          delayed: byStatus['delayed'] || 0,
          delivered: byStatus['delivered'] || 0,
          pendingBookings,
          approvedBookings,
          totalBookings: bookings?.length ?? 0,
          byStatus,
          byMode,
          invoiceStats,
        });
      }
    }
    fetchStats();
  }, [user]);

  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === '/tracking') setCurrentView('tracking');
    else if (path === '/quotation' || path === '/quote') setCurrentView('quotation');
    else if (path === '/book') setCurrentView('booking');
    else if (path === '/bookings') setCurrentView('bookings');
    else if (path === '/dashboard') setCurrentView('dashboard');
    else if (path === '/shipments') setCurrentView('table');
    else if (path === '/shipments/map') setCurrentView('map-view');
    else if (path === '/invoices') setCurrentView('invoices');
    else if (path === '/communication') setCurrentView('communication');
    else if (path === '/tickets') setCurrentView('tickets');
    else if (path === '/webhooks') setCurrentView('webhooks');
    else if (path === '/webhook-docs') setCurrentView('webhook-docs');
    else if (path === '/customs') setCurrentView('customs');
    else if (path === '/inquiry') setCurrentView('inquiry');
    else if (path === '/leads') setCurrentView('leads');
    else if (path === '/warehouse') setCurrentView('warehouse');
    else setCurrentView('dashboard');
  }, []);

  const navigate = (view: ViewType, path: string) => {
    setCurrentView(view);
    window.history.pushState({}, '', path);
  };

  const handleViewShipment = (shipmentNo: string) => {
    setSelectedShipment(shipmentNo);
    setCurrentView('details');
    window.history.pushState({}, '', `/shipments/${shipmentNo}`);
  };

  const handleBackToTable = () => {
    setCurrentView('table');
    setSelectedShipment(null);
    window.history.pushState({}, '', '/shipments');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-gray-200 border-t-sky-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (currentView === 'admin') {
    return <AdminPortal onBack={() => navigate('dashboard', '/dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onDashboardClick={() => navigate('dashboard', '/dashboard')}
        onShipmentsClick={() => navigate('table', '/shipments')}
        onBookingsClick={() => navigate('bookings', '/bookings')}
        onBookingClick={() => { setSelectedBooking(null); navigate('booking', '/book'); }}
        onMapViewClick={() => navigate('map-view', '/shipments/map')}
        onInvoicesClick={() => navigate('invoices', '/invoices')}
        onCommunicationClick={() => navigate('communication', '/communication')}
        onTicketsClick={() => navigate('tickets', '/tickets')}
        onWebhooksClick={() => navigate('webhooks', '/webhooks')}
        onWebhookDocsClick={() => navigate('webhook-docs', '/webhook-docs')}
        onCustomsClick={() => navigate('customs', '/customs')}
        onInquiryClick={() => navigate('inquiry', '/inquiry')}
        onLeadsClick={() => navigate('leads', '/leads')}
        onQuotationClick={() => navigate('quotation', '/quotation')}
        onAdminClick={() => navigate('admin', '/admin')}
        onWarehouseClick={() => navigate('warehouse', '/warehouse')}
        currentView={currentView}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <Sidebar
        currentView={currentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onDashboardClick={() => navigate('dashboard', '/dashboard')}
        onShipmentsClick={() => navigate('table', '/shipments')}
        onBookingsClick={() => navigate('bookings', '/bookings')}
        onBookingClick={() => { setSelectedBooking(null); navigate('booking', '/book'); }}
        onMapViewClick={() => navigate('map-view', '/shipments/map')}
        onInvoicesClick={() => navigate('invoices', '/invoices')}
        onCommunicationClick={() => navigate('communication', '/communication')}
        onTicketsClick={() => navigate('tickets', '/tickets')}
        onWebhooksClick={() => navigate('webhooks', '/webhooks')}
        onWebhookDocsClick={() => navigate('webhook-docs', '/webhook-docs')}
        onCustomsClick={() => navigate('customs', '/customs')}
        onInquiryClick={() => navigate('inquiry', '/inquiry')}
        onLeadsClick={() => navigate('leads', '/leads')}
        onQuotationClick={() => navigate('quotation', '/quotation')}
        onWarehouseClick={() => navigate('warehouse', '/warehouse')}
      />

      <main className="lg:ml-60 min-h-[calc(100vh-4rem)]">
        {currentView === 'dashboard' ? (
          <Dashboard
            onViewShipments={() => navigate('table', '/shipments')}
            onNewBooking={() => { setSelectedBooking(null); navigate('booking', '/book'); }}
            onViewBookings={() => navigate('bookings', '/bookings')}
            onViewCommunication={() => navigate('communication', '/communication')}
            onViewTickets={() => navigate('tickets', '/tickets')}
            liveStats={dashboardStats}
          />
        ) : currentView === 'booking' ? (
          <BookingWizard
            bookingNo={selectedBooking || undefined}
            onBack={() => navigate('dashboard', '/dashboard')}
          />
        ) : currentView === 'bookings' ? (
          <BookingsList
            onViewBooking={(bookingNo) => {
              setSelectedBooking(bookingNo);
              setShowBookingDetails(true);
            }}
            onNewBooking={() => { setSelectedBooking(null); navigate('booking', '/book'); }}
            onBack={() => navigate('dashboard', '/dashboard')}
          />
        ) : currentView === 'table' ? (
          <ShipmentsTable onViewShipment={handleViewShipment} onBack={() => navigate('dashboard', '/dashboard')} />
        ) : currentView === 'map-view' ? (
          <ShipmentsMapView onViewShipment={handleViewShipment} onBack={() => navigate('dashboard', '/dashboard')} />
        ) : currentView === 'quotation' ? (
          <QuotationPage onBack={() => navigate('dashboard', '/dashboard')} />
        ) : currentView === 'tracking' ? (
          <TrackingPage onBack={() => navigate('dashboard', '/dashboard')} />
        ) : currentView === 'invoices' ? (
          <InvoiceListPage onBack={() => navigate('dashboard', '/dashboard')} />
        ) : currentView === 'communication' ? (
          <CommunicationHub onBack={() => navigate('dashboard', '/dashboard')} />
        ) : currentView === 'tickets' ? (
          <TicketingPortal onBack={() => navigate('dashboard', '/dashboard')} />
        ) : currentView === 'webhooks' ? (
          <WebhookManager onBack={() => navigate('dashboard', '/dashboard')} />
        ) : currentView === 'webhook-docs' ? (
          <WebhookDocumentation onBack={() => navigate('dashboard', '/dashboard')} />
        ) : currentView === 'customs' ? (
          <CustomsPage onBack={() => navigate('dashboard', '/dashboard')} />
        ) : currentView === 'inquiry' ? (
          <InquiryForm onBack={() => navigate('dashboard', '/dashboard')} />
        ) : currentView === 'leads' ? (
          <LeadList onBack={() => navigate('dashboard', '/dashboard')} />
        ) : currentView === 'warehouse' ? (
          <WarehousePage onBack={() => navigate('dashboard', '/dashboard')} />
        ) : (
          <ShipmentDetails
            shipmentNo={selectedShipment!}
            onBack={handleBackToTable}
          />
        )}
      </main>

      {showBookingDetails && selectedBooking && (
        <BookingDetailsModal
          bookingNo={selectedBooking}
          onClose={() => {
            setShowBookingDetails(false);
            setSelectedBooking(null);
          }}
          onEdit={() => {
            setShowBookingDetails(false);
            setCurrentView('booking');
          }}
        />
      )}

      <BoxyAI currentView={currentView} dashboardStats={dashboardStats} />
    </div>
  );
}

export default App;
