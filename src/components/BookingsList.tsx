import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, FileText, Filter, Settings2, Truck, Plane, Ship, ArrowLeft, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import ColumnCustomizer from './ColumnCustomizer';
import { supabase } from '../lib/supabase';

interface BookingsListProps {
  onViewBooking: (bookingNo: string) => void;
  onNewBooking: () => void;
  onBack: () => void;
}

interface Column {
  key: string;
  label: string;
  visible: boolean;
  width?: string;
}

interface Booking {
  bookingNo: string;
  date: string;
  jobOrderNo: string;
  serviceProvider: string;
  transportMode: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'pending' | 'confirmed' | 'cancelled' | 'completed';
  shipper: string;
  cosignee: string;
}

type SortDirection = 'asc' | 'desc';

const BookingsList: React.FC<BookingsListProps> = ({ onViewBooking, onNewBooking, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);
  const [sortKey, setSortKey] = useState<keyof Booking | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [columns, setColumns] = useState<Column[]>([
    { key: 'bookingNo', label: 'Booking No', visible: true },
    { key: 'date', label: 'Date', visible: true },
    { key: 'jobOrderNo', label: 'Job Order No', visible: true },
    { key: 'serviceProvider', label: 'Service Provider', visible: true },
    { key: 'transportMode', label: 'Transport Mode', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'shipper', label: 'Shipper', visible: true },
    { key: 'cosignee', label: 'Consignee', visible: true }
  ]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('bookings_from_quotes')
      .select('booking_no, created_at, job_order_no, service_provider, transport_mode, status, shipper_name, consignee_name')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const mapped: Booking[] = (data || []).map(row => ({
      bookingNo: row.booking_no,
      date: new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      jobOrderNo: row.job_order_no || '',
      serviceProvider: row.service_provider || '',
      transportMode: row.transport_mode || '',
      status: row.status as Booking['status'],
      shipper: row.shipper_name || '',
      cosignee: row.consignee_name || '',
    }));

    setBookings(mapped);
    setLoading(false);
  };

  const handleSort = (key: keyof Booking) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronUp className="w-3 h-3 text-gray-300 ml-1" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-gray-700 ml-1" />
      : <ChevronDown className="w-3 h-3 text-gray-700 ml-1" />;
  };

  const getTransportIcon = (mode: string) => {
    if (mode.toLowerCase().includes('sea')) return <Ship className="w-4 h-4" />;
    if (mode.toLowerCase().includes('air')) return <Plane className="w-4 h-4" />;
    if (mode.toLowerCase().includes('land') || mode.toLowerCase().includes('road')) return <Truck className="w-4 h-4" />;
    return null;
  };

  const normalizeStatus = (status: string): string => {
    const map: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Approved',
      cancelled: 'Rejected',
      completed: 'Approved',
    };
    return map[status?.toLowerCase()] || status;
  };

  const getStatusBadgeClass = (status: string) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-medium';
      case 'Approved': return 'bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium';
      case 'Rejected': return 'bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-medium';
      default: return 'bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm font-medium';
    }
  };

  const filtered = bookings.filter(booking =>
    Object.values(booking).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedBookings = sortKey
    ? [...filtered].sort((a, b) => {
        const aVal = a[sortKey] ?? '';
        const bVal = b[sortKey] ?? '';
        const cmp = aVal.toString().localeCompare(bVal.toString());
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  const visibleColumns = columns.filter(col => col.visible);

  return (
    <>
      <div className="flex flex-col p-4 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onNewBooking}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <span className="text-lg">+</span>
                  <span>New Booking</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Excel</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                  <FileText className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm">
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                <button
                  onClick={() => setShowColumnCustomizer(true)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                >
                  <Settings2 className="w-4 h-4" />
                  <span>Customise Columns</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                <span className="text-gray-500 text-sm">Loading bookings...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-red-500 text-sm mb-3">{error}</p>
                <button onClick={fetchBookings} className="text-sm text-blue-600 hover:underline">Retry</button>
              </div>
            ) : sortedBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-gray-500 text-sm">No bookings found.</p>
                <button onClick={onNewBooking} className="mt-3 text-sm text-blue-600 hover:underline">Create your first booking</button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {visibleColumns.map((column) => (
                      <th
                        key={column.key}
                        onClick={() => handleSort(column.key as keyof Booking)}
                        className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                      >
                        <div className="flex items-center">
                          {column.label}
                          <SortIcon colKey={column.key} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBookings.map((booking, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onViewBooking(booking.bookingNo)}
                    >
                      {visibleColumns.map((column) => {
                        if (column.key === 'bookingNo') return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-blue-600 font-medium">{booking.bookingNo}</span>
                          </td>
                        );
                        if (column.key === 'date') return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{booking.date}</span>
                          </td>
                        );
                        if (column.key === 'jobOrderNo') return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{booking.jobOrderNo}</span>
                          </td>
                        );
                        if (column.key === 'serviceProvider') return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{booking.serviceProvider}</span>
                          </td>
                        );
                        if (column.key === 'transportMode') return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {getTransportIcon(booking.transportMode)}
                              <span className="text-sm text-gray-900">{booking.transportMode}</span>
                            </div>
                          </td>
                        );
                        if (column.key === 'status') return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusBadgeClass(booking.status)}>{normalizeStatus(booking.status)}</span>
                          </td>
                        );
                        if (column.key === 'shipper') return (
                          <td key={column.key} className="px-6 py-4">
                            <span className="text-sm text-gray-900">{booking.shipper}</span>
                          </td>
                        );
                        if (column.key === 'cosignee') return (
                          <td key={column.key} className="px-6 py-4">
                            <span className="text-sm text-gray-900">{booking.cosignee}</span>
                          </td>
                        );
                        return null;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <ColumnCustomizer
        isOpen={showColumnCustomizer}
        onClose={() => setShowColumnCustomizer(false)}
        columns={columns}
        onColumnsChange={setColumns}
      />
    </>
  );
};

export default BookingsList;
