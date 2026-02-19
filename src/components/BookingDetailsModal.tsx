import React, { useState, useEffect } from 'react';
import { X, Edit, Download, Clock, MapPin, Package, FileText, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BookingDetailsProps {
  bookingNo: string;
  onClose: () => void;
  onEdit: () => void;
}

interface BookingDetail {
  booking_no: string;
  status: string;
  created_at: string;
  job_order_no: string;
  service_provider: string;
  transport_mode: string;
  shipper_name: string;
  consignee_name: string;
  shipper_address: string;
  shipper_contact: string;
  shipper_email: string;
  consignee_address: string;
  consignee_contact: string;
  consignee_email: string;
  origin_location: string;
  destination_location: string;
  pickup_date: string;
  delivery_date: string;
  goods_description: any;
  shipment_type: string;
  movement_type: string;
  incoterm: string;
  special_instructions: string;
  remarks: string;
}

const BookingDetailsModal: React.FC<BookingDetailsProps> = ({ bookingNo, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('bookings_from_quotes')
        .select('*')
        .eq('booking_no', bookingNo)
        .maybeSingle();
      setBooking(data);
      setLoading(false);
    };
    fetchBooking();
  }, [bookingNo]);

  const normalizeStatus = (status: string) => {
    const map: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Approved',
      cancelled: 'Rejected',
      completed: 'Approved',
    };
    return map[status?.toLowerCase()] || status;
  };

  const getStatusColor = (status: string) => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl p-10 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
          <span className="text-gray-500 text-sm">Loading booking...</span>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Booking Not Found</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600">No booking found with number: {bookingNo}</p>
        </div>
      </div>
    );
  }

  const goodsDescription = typeof booking.goods_description === 'string'
    ? booking.goods_description
    : (booking.goods_description ? JSON.stringify(booking.goods_description) : '—');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl my-8">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{booking.booking_no}</h2>
              <p className="text-sm text-gray-600 mt-1">Job Order: {booking.job_order_no || '—'}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
              {normalizeStatus(booking.status)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          {['overview', 'documents'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium border-b-2 capitalize ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p className="text-blue-700">Created: <span className="font-semibold">{formatDate(booking.created_at)}</span></p>
                  <p className="text-blue-700">Incoterm: <span className="font-semibold">{booking.incoterm || '—'}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Service Details</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Provider:</span> <span className="font-medium">{booking.service_provider || '—'}</span></p>
                    <p><span className="text-gray-600">Transport Mode:</span> <span className="font-medium">{booking.transport_mode || '—'}</span></p>
                    <p><span className="text-gray-600">Shipment Type:</span> <span className="font-medium">{booking.shipment_type || '—'}</span></p>
                    <p><span className="text-gray-600">Movement Type:</span> <span className="font-medium">{booking.movement_type || '—'}</span></p>
                    <p><span className="text-gray-600">Goods:</span> <span className="font-medium">{goodsDescription}</span></p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Route</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Origin:</span> <span className="font-medium">{booking.origin_location || '—'}</span></p>
                    <p><span className="text-gray-600">Destination:</span> <span className="font-medium">{booking.destination_location || '—'}</span></p>
                    <p><span className="text-gray-600">Pickup Date:</span> <span className="font-medium">{formatDate(booking.pickup_date)}</span></p>
                    <p><span className="text-gray-600">Delivery Date:</span> <span className="font-medium">{formatDate(booking.delivery_date)}</span></p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Shipper</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{booking.shipper_name || '—'}</p>
                    {booking.shipper_address && <p className="text-gray-600">{booking.shipper_address}</p>}
                    {booking.shipper_contact && <p className="text-gray-600">{booking.shipper_contact}</p>}
                    {booking.shipper_email && <p className="text-blue-600">{booking.shipper_email}</p>}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Consignee</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{booking.consignee_name || '—'}</p>
                    {booking.consignee_address && <p className="text-gray-600">{booking.consignee_address}</p>}
                    {booking.consignee_contact && <p className="text-gray-600">{booking.consignee_contact}</p>}
                    {booking.consignee_email && <p className="text-blue-600">{booking.consignee_email}</p>}
                  </div>
                </div>
              </div>

              {(booking.special_instructions || booking.remarks) && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
                  {booking.special_instructions && (
                    <p className="text-sm text-blue-900"><span className="font-semibold">Special Instructions:</span> {booking.special_instructions}</p>
                  )}
                  {booking.remarks && (
                    <p className="text-sm text-blue-900"><span className="font-semibold">Remarks:</span> {booking.remarks}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No documents uploaded</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Booking</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
