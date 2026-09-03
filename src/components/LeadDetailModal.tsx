import React from 'react';
import { X, Package, User, Building, Calendar, MapPin, DollarSign, Tag, Truck, Ship, Plane } from 'lucide-react';

interface Lead {
  id: string;
  lead_id: string;
  inquiry_id: string;
  customer_id: string;
  customer_name: string;
  company_name: string;
  lob: string[];
  status: 'New' | 'Attended' | 'Quoted' | 'Quote Accepted' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  assigned_to: string;
  created_at: string;
  updated_at: string;
  movement_type: string;
  origin: string;
  destination: string;
  estimated_value?: number;
  currency?: string;
}

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-surface-tile text-brand-700';
      case 'Attended':
        return 'bg-amber-50 text-amber-700';
      case 'Quoted':
        return 'bg-surface-tile text-navy-700';
      case 'Quote Accepted':
        return 'bg-green-50 text-green-700';
      case 'Closed':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700';
      case 'Medium':
        return 'bg-amber-50 text-amber-700';
      case 'Low':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getLobBadgeColor = (lob: string) => {
    switch (lob) {
      case 'SEA_FCL':
        return 'bg-surface-tile text-brand-700';
      case 'SEA_LCL':
        return 'bg-surface-tile text-navy-700';
      case 'AIR_FREIGHT':
        return 'bg-surface-tile text-navy-700';
      case 'ROAD_TRANSPORT':
        return 'bg-green-50 text-green-700';
      case 'LIQUID':
        return 'bg-surface-tile text-navy-700';
      case 'RAIL':
        return 'bg-surface-tile text-navy-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-navy-950/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-surface-line px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="page-title">Lead Details</h2>
            <p className="text-field text-gray-500 mt-0.5">{lead.lead_id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(lead.priority)}`}>
              {lead.priority} Priority
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500">Customer Name</label>
                  <p className="text-sm font-medium text-gray-900">{lead.customer_name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Company Name</label>
                  <p className="text-sm font-medium text-gray-900">{lead.company_name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Customer ID</label>
                  <p className="text-sm font-medium text-brand-600">{lead.customer_id}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Lead Information
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500">Lead ID</label>
                  <p className="text-sm font-medium text-brand-600">{lead.lead_id}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Inquiry ID</label>
                  <p className="text-sm font-medium text-brand-600">{lead.inquiry_id}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Assigned To</label>
                  <p className="text-sm font-medium text-gray-900">{lead.assigned_to}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Shipment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Line of Business</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {lead.lob.map((lobItem, index) => (
                    <span key={index} className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLobBadgeColor(lobItem)}`}>
                      {lobItem.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Movement Type</label>
                <p className="text-sm font-medium text-gray-900">{lead.movement_type.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Origin</label>
                <p className="text-sm font-medium text-gray-900">{lead.origin}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Destination</label>
                <p className="text-sm font-medium text-gray-900">{lead.destination}</p>
              </div>
            </div>
          </div>

          {lead.estimated_value && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Financial Details
              </h3>
              <div>
                <label className="text-xs text-gray-500">Estimated Value</label>
                <p className="text-[14px] font-semibold text-navy-900">
                  {formatCurrency(lead.estimated_value, lead.currency || 'USD')}
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Created At</label>
                <p className="text-sm font-medium text-gray-900">{lead.created_at}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Last Updated</label>
                <p className="text-sm font-medium text-gray-900">{lead.updated_at}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-surface-line">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-surface-line text-navy-900 rounded-md hover:bg-surface-head transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Convert to Booking
            </button>
            <button className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors">
              Create Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
