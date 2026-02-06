import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

import SideMenu from './SideMenu';
import ShipmentOverview from './ShipmentOverview';
import DocumentsList from './DocumentsList';
import NotesList from './NotesList';
import InvoicesList from './InvoicesList';
import ActivityList from './ActivityList';
import ShipmentInsightsPanel from './ShipmentInsightsPanel';

import VesselTracker from '../features/tracking/components/VesselTracker';

interface ShipmentDetailsProps {
  shipmentNo: string;
  onBack: () => void;
}

const ShipmentDetails = ({ shipmentNo, onBack }: ShipmentDetailsProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'notes' | 'invoices' | 'activity'>('overview');
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadShipment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipmentNo]);

  const loadShipment = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('Shipment Number', shipmentNo)
        .single();

      if (error || !data) {
        throw new Error('Shipment not found');
      }

      setShipment(data);
    } catch (err: any) {
      console.error('ShipmentDetails error:', err);
      setError(err.message || 'Failed to load shipment');
    } finally {
      setLoading(false);
    }
  };

  const renderMainContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      );
    }

    if (error || !shipment) {
      return (
        <div className="text-center py-16">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <button
            onClick={loadShipment}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      );
    }

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
        return <ShipmentOverview shipmentNo={shipmentNo} shipmentData={shipment} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Menu */}
      <SideMenu activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main + Map Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center mb-6 gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded hover:bg-slate-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">
              Shipment {shipmentNo}
            </h1>
          </div>

          {renderMainContent()}
        </div>

        <div
          className={
            activeTab === 'overview'
              ? 'w-[65%] p-4 border-l bg-slate-50 overflow-y-auto'
              : 'w-[45%] p-4 border-l bg-slate-50 overflow-y-auto'
          }
        >
          {shipment && (
            <>
              <VesselTracker shipmentNo={shipmentNo} />
              <ShipmentInsightsPanel shipment={shipment} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
