import React, { useState } from 'react';
import Header from './components/Header';
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

/* 🔹 TRACKING PAGE IMPORT */
import TrackingPage from './features/tracking/pages/TrackingPage';

type ViewType =
  | 'dashboard'
  | 'table'
  | 'details'
  | 'booking'
  | 'bookings'
  | 'map-view'
  | 'tracking'          // ✅ NEW
  | 'invoices'
  | 'communication'
  | 'tickets'
  | 'webhooks'
  | 'webhook-docs'
  | 'customs'
  | 'inquiry'
  | 'leads';

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  /* 🔹 URL → VIEW MAPPING */
  React.useEffect(() => {
    const path = window.location.pathname;

    if (path === '/tracking') {
      setCurrentView('tracking');
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

  const handleViewBooking = (bookingNo: string) => {
    setSelectedBooking(bookingNo);
    setCurrentView('booking');
    window.history.pushState({}, '', `/bookings/${bookingNo}`);
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
      <div className="min-h-screen bg-surface-page flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-surface-line border-t-navy-900 mx-auto"></div>
          <p className="mt-3 text-field text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  /* 🔹 MAIN RENDER */

  return (
    <div className="min-h-screen bg-surface-page">
      <Header
        onDashboardClick={handleDashboardNavigation}
        onShipmentsClick={handleShipmentsNavigation}
        onBookingsClick={handleBookingsNavigation}
        onMapViewClick={handleMapViewNavigation}
        onInvoicesClick={handleInvoicesNavigation}
        onCommunicationClick={handleCommunicationNavigation}
        onTicketsClick={handleTicketsNavigation}
        onWebhooksClick={handleWebhooksNavigation}
        onWebhookDocsClick={handleWebhookDocsNavigation}
        onCustomsClick={handleCustomsNavigation}
        onInquiryClick={handleInquiryNavigation}
        onLeadsClick={handleLeadsNavigation}
        currentView={currentView}
      />

      {currentView === 'dashboard' ? (
        <Dashboard
          onViewShipments={handleShipmentsNavigation}
          onNewBooking={handleBookingNavigation}
        />
      ) : currentView === 'booking' ? (
        <BookingWizard
          bookingNo={selectedBooking || undefined}
          onBack={handleBookingsNavigation}
        />
      ) : currentView === 'bookings' ? (
        <BookingsList
          onViewBooking={handleViewBooking}
          onNewBooking={handleBookingNavigation}
        />
      ) : currentView === 'table' ? (
        <ShipmentsTable onViewShipment={handleViewShipment} />
      ) : currentView === 'map-view' ? (
        <ShipmentsMapView onViewShipment={handleViewShipment} />
      ) : currentView === 'tracking' ? (
        <TrackingPage />        
      ) : currentView === 'invoices' ? (
        <InvoiceListPage />
      ) : currentView === 'communication' ? (
        <CommunicationHub />
      ) : currentView === 'tickets' ? (
        <TicketingPortal />
      ) : currentView === 'webhooks' ? (
        <WebhookManager />
      ) : currentView === 'webhook-docs' ? (
        <WebhookDocumentation />
      ) : currentView === 'customs' ? (
        <CustomsPage />
      ) : currentView === 'inquiry' ? (
        <InquiryForm onBack={handleDashboardNavigation} />
      ) : currentView === 'leads' ? (
        <LeadList />
      ) : currentView === 'details' ? (
        <ShipmentDetails
          shipmentNo={selectedShipment!}
          onBack={handleBackToTable}
        />
      ) : (
        <div />
      )}
    </div>
  );
}

export default App;
