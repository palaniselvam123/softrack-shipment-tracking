import React from 'react';
import { Ship, Plus, Truck, Plane } from 'lucide-react';
import { SupabaseShipment } from '../lib/supabase';

interface ShipmentOverviewProps {
  shipmentNo: string;
  shipmentData: SupabaseShipment;
}

const ShipmentOverview: React.FC<ShipmentOverviewProps> = ({ shipmentNo, shipmentData }) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTransportIcon = (mode: string | null) => {
    if (!mode) return <Ship className="w-5 h-5" />;
    switch (mode.toLowerCase()) {
      case 'road':
        return <Truck className="w-5 h-5" />;
      case 'air':
        return <Plane className="w-5 h-5" />;
      case 'sea':
      case 'ocean':
        return <Ship className="w-5 h-5" />;
      default:
        return <Ship className="w-5 h-5" />;
    }
  };

  const getStatusProgress = () => {
    const status = shipmentData.shipment_status?.toLowerCase();
    if (status?.includes('delivered') || status?.includes('completed')) return 100;
    if (status?.includes('transit')) return 65;
    if (status?.includes('loaded')) return 50;
    if (status?.includes('received')) return 35;
    return 20;
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded text-sm font-medium ${
              shipmentData.shipment_status ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {shipmentData.shipment_status || 'Planning'}
            </div>
            {shipmentData['Transport Mode'] && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                {getTransportIcon(shipmentData['Transport Mode'])}
                <span>{shipmentData['Transport Mode']}</span>
              </div>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${getStatusProgress()}%` }}></div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {shipmentData['ETA'] && `ETA: ${formatDate(shipmentData['ETA'])}`}
          {shipmentData['Destination'] && ` • ${shipmentData['Destination']}`}
          {shipmentData.shipment_status && ` • ${shipmentData.shipment_status}`}
        </div>
      </div>

      {/* Shipment Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Shipment Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Route</p>
            <p className="text-gray-900">
              {shipmentData['Origin'] || 'N/A'} → {shipmentData['Destination'] || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Type</p>
            <p className="text-gray-900">{shipmentData['Shipment Type'] || shipmentData['Direction'] || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Shipper</p>
            <p className="text-gray-900">{shipmentData['Shipper'] || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Consignee</p>
            <p className="text-gray-900">{shipmentData['Consignee'] || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Shipment Number</p>
            <p className="text-gray-900 font-medium">{shipmentData['Shipment Number']}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Job Reference</p>
            <p className="text-gray-900">{shipmentData.job_ref || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Primary Mode</p>
            <p className="text-gray-900">{shipmentData['Transport Mode'] || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Sending Agent</p>
            <p className="text-gray-900">{shipmentData['Sending Agent'] || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Receiving Agent</p>
            <p className="text-gray-900">{shipmentData['Receiving Agent'] || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Sales Representative</p>
            <p className="text-gray-900">{shipmentData['Sales Rep'] || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Incitement</p>
            <p className="text-gray-900">{shipmentData['Incitement'] || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Transit Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Transit Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">ETD (Estimated Departure)</p>
            <p className="text-gray-900 font-medium">{formatDate(shipmentData['ETD'])}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">ETA (Estimated Arrival)</p>
            <p className="text-gray-900 font-medium">{formatDate(shipmentData['ETA'])}</p>
          </div>
        </div>

        {(shipmentData['ATD'] || shipmentData['ATA']) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">ATD (Actual Departure)</p>
              <p className="text-gray-900 font-medium">{formatDate(shipmentData['ATD'])}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">ATA (Actual Arrival)</p>
              <p className="text-gray-900 font-medium">{formatDate(shipmentData['ATA'])}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Transit Days</p>
            <p className="text-gray-900 font-medium">{shipmentData['Total Transit Days'] || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Estimated Transit Days</p>
            <p className="text-gray-900 font-medium">{shipmentData['Total Estimated Transit Days'] || 'N/A'}</p>
          </div>
          {shipmentData['Delay Days'] && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Delay</p>
              <p className={`font-medium ${
                shipmentData['Late/Early'] === 'Late' ? 'text-red-600' : 'text-green-600'
              }`}>
                {shipmentData['Delay Days']} ({shipmentData['Late/Early']})
              </p>
            </div>
          )}
        </div>

        {shipmentData['Transhipments count'] !== null && shipmentData['Transhipments count'] > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500 mb-1">Transhipments</p>
            <p className="text-gray-900 font-medium">{shipmentData['Transhipments count']}</p>
          </div>
        )}
      </div>

      {/* Cargo Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cargo Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total TEU</p>
            <p className="text-gray-900 font-medium">{shipmentData['TEU'] !== null ? shipmentData['TEU'] : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Direction</p>
            <p className="text-gray-900 font-medium">{shipmentData['Direction'] || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentOverview;