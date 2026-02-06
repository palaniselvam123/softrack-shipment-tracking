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
        return 'bg-blue-100 text-blue-800';
      case 'Attended':
        return 'bg-yellow-100 text-yellow-800';
      case 'Quoted':
        return 'bg-purple-100 text-purple-800';
      case 'Quote Accepted':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLobBadgeColor = (lob: string) => {
    switch (lob) {
      case 'SEA_FCL':
        return 'bg-blue-100 text-blue-800';
      case 'SEA_LCL':
        return 'bg-cyan-100 text-cyan-800';
      case 'AIR_FREIGHT':
        return 'bg-pink-100 text-pink-800';
      case 'ROAD_TRANSPORT':
        return 'bg-green-100 text-green-800';
      case 'LIQUID':
        return 'bg-teal-100 text-teal-800';
      case 'RAIL':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Lead Details</h2>
            <p className="text-sm text-gray-600 mt-1">{lead.lead_id}</p>
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
                  <p className="text-sm font-medium text-blue-600">{lead.customer_id}</p>
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
                  <p className="text-sm font-medium text-blue-600">{lead.lead_id}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Inquiry ID</label>
                  <p className="text-sm font-medium text-blue-600">{lead.inquiry_id}</p>
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
                <p className="text-lg font-semibold text-gray-900">
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

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Convert to Booking
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Create Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
