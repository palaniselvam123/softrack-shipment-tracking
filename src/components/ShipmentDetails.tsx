import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase, type SupabaseShipment } from '../lib/supabase';
import SideMenu from './SideMenu';
import ShipmentOverview from './ShipmentOverview';
import TrackingTimeline from './TrackingTimeline';
import DocumentsList from './DocumentsList';
import NotesList from './NotesList';
import InvoicesList from './InvoicesList';
import ActivityList from './ActivityList';

interface ShipmentDetailsProps {
  shipmentNo: string;
  onBack: () => void;
}

const statusTone = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('deliver') || s.includes('complete')) return 'badge-success';
  if (s.includes('delay') || s.includes('hold')) return 'badge-danger';
  if (s.includes('pending') || s.includes('await')) return 'badge-warning';
  return 'badge-info';
};

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipmentNo, onBack }) => {
  const [shipment, setShipment] = useState<SupabaseShipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchShipment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('shipments')
        .select('*')
        .eq('Shipment Number', shipmentNo)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!data) {
        setShipment(null);
        setError(`No shipment found for ${shipmentNo}.`);
        return;
      }

      setShipment(data as SupabaseShipment);
    } catch (err) {
      console.error('Error fetching shipment:', err);
      setError(err instanceof Error ? err.message : 'Failed to load this shipment');
    } finally {
      setLoading(false);
    }
  }, [shipmentNo]);

  useEffect(() => {
    fetchShipment();
  }, [fetchShipment]);

  const renderTab = () => {
    if (!shipment) return null;

    switch (activeTab) {
      case 'documents':
        return <DocumentsList shipmentNo={shipmentNo} />;
      case 'notes':
        return <NotesList shipmentNo={shipmentNo} />;
      case 'invoices':
        return <InvoicesList shipmentNo={shipmentNo} />;
      case 'activity':
        return <ActivityList shipmentNo={shipmentNo} />;
      default:
        return (
          <div className="space-y-4">
            <ShipmentOverview shipmentNo={shipmentNo} shipmentData={shipment} />
            <div className="card p-4">
              <h2 className="card-title mb-4">Tracking</h2>
              <TrackingTimeline />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="page">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-md text-gray-500 hover:text-navy-900 hover:bg-surface-head transition-colors duration-150"
          aria-label="Back to shipments"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <h1 className="page-title truncate">{shipmentNo}</h1>
          {shipment && (
            <p className="text-field text-gray-500 truncate">
              {shipment['Origin'] || 'N/A'} → {shipment['Destination'] || 'N/A'}
            </p>
          )}
        </div>
        {shipment?.shipment_status && (
          <span className={`badge ${statusTone(shipment.shipment_status)} ml-1`}>
            {shipment.shipment_status}
          </span>
        )}
      </div>

      {loading && (
        <div className="card">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 className="w-7 h-7 text-navy-600 animate-spin mx-auto mb-3" />
              <p className="text-field text-gray-500">Loading shipment...</p>
            </div>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="card">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-10 h-10 bg-red-50 rounded-md flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 text-lg font-semibold">!</span>
              </div>
              <p className="text-navy-900 font-semibold mb-1">Could not load this shipment</p>
              <p className="text-field text-gray-500 mb-4 max-w-md mx-auto">{error}</p>
              <div className="flex items-center justify-center gap-2">
                <button onClick={fetchShipment} className="btn-primary">Retry</button>
                <button onClick={onBack} className="btn-secondary">Back to list</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && shipment && (
        <div className="card flex items-stretch overflow-hidden">
          <SideMenu activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 min-w-0 bg-surface-page p-4">{renderTab()}</div>
        </div>
      )}
    </div>
  );
};

export default ShipmentDetails;
