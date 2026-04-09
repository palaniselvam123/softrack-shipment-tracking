import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, FileText, Filter, Settings2, Truck, Plane, Ship, ArrowLeft, ChevronUp, ChevronDown, Loader2, Plus } from 'lucide-react';
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
    if (sortKey === key) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const getTransportIcon = (mode: string) => {
    if (mode.toLowerCase().includes('sea')) return <Ship className="w-3.5 h-3.5 text-gray-500" />;
    if (mode.toLowerCase().includes('air')) return <Plane className="w-3.5 h-3.5 text-gray-500" />;
    if (mode.toLowerCase().includes('land') || mode.toLowerCase().includes('road')) return <Truck className="w-3.5 h-3.5 text-gray-500" />;
    return null;
  };

  const normalizeStatus = (status: string): string => {
    const map: Record<string, string> = { pending: 'Pending', confirmed: 'Approved', cancelled: 'Rejected', completed: 'Approved' };
    return map[status?.toLowerCase()] || status;
  };

  const getStatusClass = (status: string) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'Pending': return 'bg-amber-50 text-amber-700';
      case 'Approved': return 'bg-emerald-50 text-emerald-700';
      case 'Rejected': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
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
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
              <p className="text-sm text-gray-500 mt-1">Manage all your booking records</p>
            </div>
            <button onClick={onNewBooking} className="btn-primary flex items-center gap-1.5">
              <Plus className="w-4 h-4" /><span>New Booking</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary flex items-center gap-1.5 text-sm">
                  <FileSpreadsheet className="w-4 h-4" /><span>Excel</span>
                </button>
                <button className="btn-secondary flex items-center gap-1.5 text-sm">
                  <FileText className="w-4 h-4" /><span>PDF</span>
                </button>
                <button className="btn-secondary flex items-center gap-1.5 text-sm">
                  <Filter className="w-4 h-4" /><span>Filters</span>
                </button>
                <button onClick={() => setShowColumnCustomizer(true)} className="btn-secondary flex items-center gap-1.5 text-sm">
                  <Settings2 className="w-4 h-4" /><span>Columns</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-sky-500 mr-2" />
                <span className="text-sm text-gray-500">Loading bookings...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-sm text-red-500 mb-2">{error}</p>
                <button onClick={fetchBookings} className="text-sm text-sky-600 hover:underline">Retry</button>
              </div>
            ) : sortedBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-sm text-gray-500">No bookings found.</p>
                <button onClick={onNewBooking} className="mt-2 text-sm text-sky-600 hover:underline">Create your first booking</button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {visibleColumns.map((column) => (
                      <th
                        key={column.key}
                        onClick={() => handleSort(column.key as keyof Booking)}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>{column.label}</span>
                          {sortKey === column.key && (
                            sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-sky-500" /> : <ChevronDown className="w-3 h-3 text-sky-500" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedBookings.map((booking, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onViewBooking(booking.bookingNo)}
                    >
                      {visibleColumns.map((column) => {
                        if (column.key === 'bookingNo') return (
                          <td key={column.key} className="px-4 py-3 whitespace-nowrap">
                            <span className="text-sm font-medium text-sky-600">{booking.bookingNo}</span>
                          </td>
                        );
                        if (column.key === 'transportMode') return (
                          <td key={column.key} className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              {getTransportIcon(booking.transportMode)}
                              <span className="text-sm text-gray-700">{booking.transportMode}</span>
                            </div>
                          </td>
                        );
                        if (column.key === 'status') return (
                          <td key={column.key} className="px-4 py-3 whitespace-nowrap">
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${getStatusClass(booking.status)}`}>
                              {normalizeStatus(booking.status)}
                            </span>
                          </td>
                        );
                        return (
                          <td key={column.key} className="px-4 py-3 whitespace-nowrap">
                            <span className="text-sm text-gray-700">{booking[column.key as keyof Booking] || ''}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && !error && sortedBookings.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/30">
              <p className="text-xs text-gray-500">
                Showing {sortedBookings.length} of {bookings.length} bookings
              </p>
            </div>
          )}
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
