import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BoxyAI from './components/BoxyAI';
import { supabase } from './lib/supabase';
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

import TrackingPage from './features/tracking/pages/TrackingPage';
import QuotationPage from './features/quotation/pages/QuotationPage';

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
  | 'quotation';

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
}

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
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
        setDashboardStats({
          totalShipments: shipments.length,
          inTransit: byStatus['in transit'] || byStatus['in_transit'] || 0,
          delayed: byStatus['delayed'] || 0,
          delivered: byStatus['delivered'] || 0,
          pendingBookings,
          approvedBookings,
          totalBookings: bookings?.length ?? 0,
          byStatus,
          byMode,
        });
      }
    }
    fetchStats();
  }, []);

  React.useEffect(() => {
    const path = window.location.pathname;

    if (path === '/tracking') {
      setCurrentView('tracking');
    } else if (path === '/quotation' || path === '/quote') {
      setCurrentView('quotation');
    } else if (path === '/book') {
      setCurrentView('booking');
    } else if (path === '/bookings') {
      setCurrentView('bookings');
    } else if (path === '/dashboard') {
      setCurrentView('dashboard');
    } else if (path === '/shipments') {
      setCurrentView('table');
    } else if (path === '/shipments/map') {
      setCurrentView('map-view');
    } else if (path === '/invoices') {
      setCurrentView('invoices');
    } else if (path === '/communication') {
      setCurrentView('communication');
    } else if (path === '/tickets') {
      setCurrentView('tickets');
    } else if (path === '/webhooks') {
      setCurrentView('webhooks');
    } else if (path === '/webhook-docs') {
      setCurrentView('webhook-docs');
    } else if (path === '/customs') {
      setCurrentView('customs');
    } else if (path === '/inquiry') {
      setCurrentView('inquiry');
    } else if (path === '/leads') {
      setCurrentView('leads');
    } else {
      setCurrentView('dashboard');
    }
  }, []);

  /* 🔹 NAVIGATION HANDLERS */

  const handleTrackingNavigation = () => {
    setCurrentView('tracking');
    window.history.pushState({}, '', '/tracking');
  };

  const handleQuotationNavigation = () => {
    setCurrentView('quotation');
    window.history.pushState({}, '', '/quotation');
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

  const handleBookingNavigation = () => {
    setSelectedBooking(null);
    setCurrentView('booking');
    window.history.pushState({}, '', '/book');
  };

  const handleBookingsNavigation = () => {
    setCurrentView('bookings');
    window.history.pushState({}, '', '/bookings');
  };

  const handleDashboardNavigation = () => {
    setCurrentView('dashboard');
    window.history.pushState({}, '', '/dashboard');
  };

  const handleShipmentsNavigation = () => {
    setCurrentView('table');
    window.history.pushState({}, '', '/shipments');
  };

  const handleMapViewNavigation = () => {
    setCurrentView('map-view');
    window.history.pushState({}, '', '/shipments/map');
  };

  const handleInvoicesNavigation = () => {
    setCurrentView('invoices');
    window.history.pushState({}, '', '/invoices');
  };

  const handleCommunicationNavigation = () => {
    setCurrentView('communication');
    window.history.pushState({}, '', '/communication');
  };

  const handleTicketsNavigation = () => {
    setCurrentView('tickets');
    window.history.pushState({}, '', '/tickets');
  };

  const handleWebhooksNavigation = () => {
    setCurrentView('webhooks');
    window.history.pushState({}, '', '/webhooks');
  };

  const handleWebhookDocsNavigation = () => {
    setCurrentView('webhook-docs');
    window.history.pushState({}, '', '/webhook-docs');
  };

  const handleCustomsNavigation = () => {
    setCurrentView('customs');
    window.history.pushState({}, '', '/customs');
  };

  const handleInquiryNavigation = () => {
    setCurrentView('inquiry');
    window.history.pushState({}, '', '/inquiry');
  };

  const handleLeadsNavigation = () => {
    setCurrentView('leads');
    window.history.pushState({}, '', '/leads');
  };

  /* 🔹 AUTH STATES */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  /* 🔹 MAIN RENDER */

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onDashboardClick={handleDashboardNavigation}
        onShipmentsClick={handleShipmentsNavigation}
        onBookingsClick={handleBookingsNavigation}
        onBookingClick={handleBookingNavigation}
        onMapViewClick={handleMapViewNavigation}
        onInvoicesClick={handleInvoicesNavigation}
        onCommunicationClick={handleCommunicationNavigation}
        onTicketsClick={handleTicketsNavigation}
        onWebhooksClick={handleWebhooksNavigation}
        onWebhookDocsClick={handleWebhookDocsNavigation}
        onCustomsClick={handleCustomsNavigation}
        onInquiryClick={handleInquiryNavigation}
        onLeadsClick={handleLeadsNavigation}
        onQuotationClick={handleQuotationNavigation}
        currentView={currentView}
      />

      {currentView === 'dashboard' ? (
        <Dashboard
          onViewShipments={handleShipmentsNavigation}
          onNewBooking={handleBookingNavigation}
          liveStats={dashboardStats}
        />
      ) : currentView === 'booking' ? (
        <BookingWizard
          bookingNo={selectedBooking || undefined}
          onBack={handleDashboardNavigation}
        />
      ) : currentView === 'bookings' ? (
        <BookingsList
          onViewBooking={(bookingNo) => {
            setSelectedBooking(bookingNo);
            setShowBookingDetails(true);
          }}
          onNewBooking={handleBookingNavigation}
          onBack={handleDashboardNavigation}
        />
      ) : currentView === 'table' ? (
        <ShipmentsTable onViewShipment={handleViewShipment} onBack={handleDashboardNavigation} />
      ) : currentView === 'map-view' ? (
        <ShipmentsMapView onViewShipment={handleViewShipment} onBack={handleDashboardNavigation} />
      ) : currentView === 'quotation' ? (
        <QuotationPage onBack={handleDashboardNavigation} />
      ) : currentView === 'tracking' ? (
        <TrackingPage onBack={handleDashboardNavigation} />
      ) : currentView === 'invoices' ? (
        <InvoiceListPage onBack={handleDashboardNavigation} />
      ) : currentView === 'communication' ? (
        <CommunicationHub onBack={handleDashboardNavigation} />
      ) : currentView === 'tickets' ? (
        <TicketingPortal onBack={handleDashboardNavigation} />
      ) : currentView === 'webhooks' ? (
        <WebhookManager onBack={handleDashboardNavigation} />
      ) : currentView === 'webhook-docs' ? (
        <WebhookDocumentation onBack={handleDashboardNavigation} />
      ) : currentView === 'customs' ? (
        <CustomsPage onBack={handleDashboardNavigation} />
      ) : currentView === 'inquiry' ? (
        <InquiryForm onBack={handleDashboardNavigation} />
      ) : currentView === 'leads' ? (
        <LeadList onBack={handleDashboardNavigation} />
      ) : (
        <ShipmentDetails
          shipmentNo={selectedShipment!}
          onBack={handleBackToTable}
        />
      )}

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
