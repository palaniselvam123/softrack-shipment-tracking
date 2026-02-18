import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, FileText, ChevronDown, Filter, Settings2, Truck, Plane, Ship, ArrowLeft, RefreshCw } from 'lucide-react';
import ColumnCustomizer from './ColumnCustomizer';
import { getUserBookings } from '../features/quotation/services/quotationService';

interface BookingsListProps {
  onViewBooking: (bookingNo: string) => void;
  onNewBooking: () => void;
  onBack: () => void;
}

interface Column {
  key: string;
  label: string;
  visible: boolean;
}

interface Booking {
  bookingNo: string;
  date: string;
  jobOrderNo: string;
  serviceProvider: string;
  transportMode: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Confirmed';
  shipper: string;
  cosignee: string;
  source?: 'live' | 'mock';
  route?: string;
}

const mockBookings: Booking[] = [
  { bookingNo: 'SE-S//0036//10.2', date: '8th Aug 2024', jobOrderNo: '69595583', serviceProvider: 'UPS India Pvt Ltd', transportMode: 'Sea Import', status: 'Pending', shipper: 'Stark Private Limited', cosignee: '14square Private Limited', source: 'mock' },
  { bookingNo: 'SE-S//0037//11.3', date: '9th Aug 2024', jobOrderNo: '69595584', serviceProvider: 'Maersk India Ltd', transportMode: 'Sea Import', status: 'Pending', shipper: 'Global Traders Inc', cosignee: 'Mumbai Imports Ltd', source: 'mock' },
  { bookingNo: 'SE-S//0038//12.1', date: '10th Aug 2024', jobOrderNo: '69595585', serviceProvider: 'MSC India Pvt Ltd', transportMode: 'Sea Import', status: 'Pending', shipper: 'Continental Exports', cosignee: 'Bangalore Trading Co', source: 'mock' },
  { bookingNo: 'SE-S//0036//10.2', date: '8th Aug 2024', jobOrderNo: '69595583', serviceProvider: 'KLN India Pvt Ltd', transportMode: 'Sea Export', status: 'Approved', shipper: 'Transhipper Private Limited', cosignee: 'Stark Private Limited', source: 'mock' },
  { bookingNo: 'SE-S//0039//13.2', date: '11th Aug 2024', jobOrderNo: '69595586', serviceProvider: 'CMA CGM India', transportMode: 'Sea Export', status: 'Pending', shipper: 'Export Masters Ltd', cosignee: 'International Trading Co', source: 'mock' },
  { bookingNo: 'SE-S//0040//14.5', date: '12th Aug 2024', jobOrderNo: '69595587', serviceProvider: 'Hapag Lloyd India', transportMode: 'Sea Export', status: 'Pending', shipper: 'Maritime Exports Pvt Ltd', cosignee: 'Global Logistics Singapore', source: 'mock' },
  { bookingNo: 'SE-S//0036//10.2', date: '8th Aug 2024', jobOrderNo: '69595583', serviceProvider: 'UPS India Pvt Ltd', transportMode: 'Air Import', status: 'Rejected', shipper: 'Square Space worldwide Private Limited', cosignee: 'Tranship Limited', source: 'mock' },
  { bookingNo: 'AI//0041//15.1', date: '13th Aug 2024', jobOrderNo: '69595588', serviceProvider: 'DHL Express India', transportMode: 'Air Import', status: 'Pending', shipper: 'European Electronics GmbH', cosignee: 'Tech Solutions India', source: 'mock' },
  { bookingNo: 'AI//0042//16.3', date: '14th Aug 2024', jobOrderNo: '69595589', serviceProvider: 'FedEx India', transportMode: 'Air Import', status: 'Pending', shipper: 'American Auto Parts Inc', cosignee: 'Chennai Motors Ltd', source: 'mock' },
  { bookingNo: 'SE-S//0036//10.2', date: '8th Aug 2024', jobOrderNo: '69595583', serviceProvider: 'UPS India Pvt Ltd', transportMode: 'Air Export', status: 'Approved', shipper: 'Square Space worldwide Private Limited', cosignee: 'Tranship Limited', source: 'mock' },
  { bookingNo: 'AE//0043//17.2', date: '15th Aug 2024', jobOrderNo: '69595590', serviceProvider: 'Emirates SkyCargo', transportMode: 'Air Export', status: 'Pending', shipper: 'Pharma Exports India Ltd', cosignee: 'Healthcare Dubai LLC', source: 'mock' },
  { bookingNo: 'AE//0044//18.4', date: '16th Aug 2024', jobOrderNo: '69595591', serviceProvider: 'Qatar Airways Cargo', transportMode: 'Air Export', status: 'Pending', shipper: 'Fresh Foods Exports', cosignee: 'Middle East Grocers', source: 'mock' },
  { bookingNo: 'SE-S//0036//10.2', date: '8th Aug 2024', jobOrderNo: '69595583', serviceProvider: 'UPS India Pvt Ltd', transportMode: 'Land Import', status: 'Approved', shipper: 'Square Space worldwide Private Limited', cosignee: 'Tranship Limited', source: 'mock' },
  { bookingNo: 'LI//0045//19.1', date: '17th Aug 2024', jobOrderNo: '69595592', serviceProvider: 'VRL Logistics', transportMode: 'Land Import', status: 'Pending', shipper: 'Nepal Trading Co', cosignee: 'Delhi Distributors Pvt Ltd', source: 'mock' },
  { bookingNo: 'LE//0047//21.2', date: '19th Aug 2024', jobOrderNo: '69595594', serviceProvider: 'Blue Dart Express', transportMode: 'Land Export', status: 'Pending', shipper: 'Bangalore Tech Solutions', cosignee: 'Sri Lanka Electronics', source: 'mock' },
];

function modeLabel(mode: string, direction: string): string {
  const dir = direction === 'import' ? 'Import' : 'Export';
  if (mode === 'air') return `Air ${dir}`;
  if (mode === 'sea_lcl') return `Sea LCL ${dir}`;
  return `Sea ${dir}`;
}

const BookingsList: React.FC<BookingsListProps> = ({ onViewBooking, onNewBooking, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);
  const [liveBookings, setLiveBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [columns, setColumns] = useState<Column[]>([
    { key: 'source', label: 'Source', visible: true },
    { key: 'bookingNo', label: 'Booking No', visible: true },
    { key: 'date', label: 'Date', visible: true },
    { key: 'route', label: 'Route', visible: true },
    { key: 'serviceProvider', label: 'Service Provider', visible: true },
    { key: 'transportMode', label: 'Transport Mode', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'shipper', label: 'Shipper', visible: true },
    { key: 'cosignee', label: 'Consignee', visible: true },
  ]);

  const loadLiveBookings = async () => {
    setLoading(true);
    const data = await getUserBookings();
    const mapped: Booking[] = data.map((b: any) => ({
      bookingNo: b.booking_no,
      date: new Date(b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      jobOrderNo: b.id?.slice(0, 8).toUpperCase() || '—',
      serviceProvider: b.quotations?.carrier_name || '—',
      transportMode: b.quotations ? modeLabel(b.quotations.mode, b.quotations.direction) : '—',
      status: b.status === 'confirmed' ? 'Confirmed' : 'Pending',
      shipper: b.shipper_name || '—',
      cosignee: b.consignee_name || '—',
      route: b.quotations ? `${b.quotations.origin_port} → ${b.quotations.destination_port}` : undefined,
      source: 'live' as const,
    }));
    setLiveBookings(mapped);
    setLoading(false);
  };

  useEffect(() => {
    loadLiveBookings();
  }, []);

  const allBookings = [...liveBookings, ...mockBookings];

  const getTransportIcon = (mode: string) => {
    if (mode.includes('Sea')) return <Ship className="w-4 h-4" />;
    if (mode.includes('Air')) return <Plane className="w-4 h-4" />;
    if (mode.includes('Land')) return <Truck className="w-4 h-4" />;
    return null;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-semibold';
      case 'Approved': return 'bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-semibold';
      case 'Rejected': return 'bg-red-100 text-red-800 px-3 py-1 rounded text-xs font-semibold';
      case 'Confirmed': return 'bg-sky-100 text-sky-800 px-3 py-1 rounded text-xs font-semibold';
      default: return 'bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs font-semibold';
    }
  };

  const filteredBookings = allBookings.filter(b =>
    Object.values(b).some(v => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const visibleColumns = columns.filter(c => c.visible);

  const renderCell = (booking: Booking, key: string) => {
    switch (key) {
      case 'source':
        return booking.source === 'live'
          ? <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">Live</span>
          : <span className="text-xs text-gray-400">—</span>;
      case 'bookingNo':
        return <span className="text-sm text-blue-600 font-medium">{booking.bookingNo}</span>;
      case 'date':
        return <span className="text-sm text-gray-900">{booking.date}</span>;
      case 'route':
        return <span className="text-sm text-gray-700 font-medium">{booking.route || '—'}</span>;
      case 'jobOrderNo':
        return <span className="text-sm text-gray-900">{booking.jobOrderNo}</span>;
      case 'serviceProvider':
        return <span className="text-sm text-gray-900">{booking.serviceProvider}</span>;
      case 'transportMode':
        return (
          <div className="flex items-center gap-2">
            {getTransportIcon(booking.transportMode)}
            <span className="text-sm text-gray-900">{booking.transportMode}</span>
          </div>
        );
      case 'status':
        return <span className={getStatusBadgeClass(booking.status)}>{booking.status}</span>;
      case 'shipper':
        return <span className="text-sm text-gray-900">{booking.shipper}</span>;
      case 'cosignee':
        return <span className="text-sm text-gray-900">{booking.cosignee}</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col p-4 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                {liveBookings.length > 0 && (
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full">
                    {liveBookings.length} live booking{liveBookings.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button
                onClick={loadLiveBookings}
                disabled={loading}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search bookings..."
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
                  <span className="text-lg leading-none">+</span>
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
                  <span>Sort</span>
                  <ChevronDown className="w-4 h-4" />
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
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {visibleColumns.map((col) => (
                    <th key={col.key} className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && liveBookings.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="px-6 py-10 text-center text-sm text-gray-400">
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="px-6 py-10 text-center text-sm text-gray-400">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, idx) => (
                    <tr
                      key={idx}
                      onClick={() => onViewBooking(booking.bookingNo)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${booking.source === 'live' ? 'bg-sky-50/30' : ''}`}
                    >
                      {visibleColumns.map((col) => (
                        <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                          {renderCell(booking, col.key)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && (
            <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-4">
              <span>{filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} shown</span>
              {liveBookings.length > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
                  {liveBookings.length} from your account
                </span>
              )}
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
