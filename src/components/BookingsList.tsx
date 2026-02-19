import React, { useState } from 'react';
import { Search, FileSpreadsheet, FileText, Filter, Settings2, Truck, Plane, Ship, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import ColumnCustomizer from './ColumnCustomizer';

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
  status: 'Pending' | 'Approved' | 'Rejected';
  shipper: string;
  cosignee: string;
}

type SortDirection = 'asc' | 'desc';

const BookingsList: React.FC<BookingsListProps> = ({ onViewBooking, onNewBooking, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);
  const [sortKey, setSortKey] = useState<keyof Booking | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const [columns, setColumns] = useState<Column[]>([
    { key: 'bookingNo', label: 'Booking No', visible: true },
    { key: 'date', label: 'Date', visible: true },
    { key: 'jobOrderNo', label: 'Job Order No', visible: true },
    { key: 'serviceProvider', label: 'Service Provider', visible: true },
    { key: 'transportMode', label: 'Transport Mode', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'shipper', label: 'Shipper', visible: true },
    { key: 'cosignee', label: 'Cosignee', visible: true }
  ]);

  const serviceProviders = [
    'UPS India Pvt Ltd', 'Maersk India Ltd', 'MSC India Pvt Ltd', 'KLN India Pvt Ltd',
    'CMA CGM India', 'Hapag Lloyd India', 'DHL Express India', 'FedEx India',
    'Emirates SkyCargo', 'Qatar Airways Cargo', 'VRL Logistics', 'TCI Freight',
    'Blue Dart Express', 'Gati KWE', 'OOCL India', 'Evergreen India',
    'Yang Ming India', 'PIL India', 'Wan Hai India', 'Sinotrans India'
  ];
  const shippers = [
    'Stark Private Limited', 'Global Traders Inc', 'Continental Exports', 'Transhipper Private Limited',
    'Export Masters Ltd', 'Maritime Exports Pvt Ltd', 'European Electronics GmbH', 'American Auto Parts Inc',
    'Pharma Exports India Ltd', 'Fresh Foods Exports', 'Nepal Trading Co', 'Bangladesh Textiles Ltd',
    'Bangalore Tech Solutions', 'Chennai Manufacturing Ltd', 'Delhi Auto Components', 'Pune Engineering Works',
    'Hyderabad Pharma Ltd', 'Kolkata Jute Mills', 'Ahmedabad Textile Co', 'Surat Diamond Exporters',
    'Coimbatore Machinery Ltd', 'Nagpur Agro Exports', 'Kochi Spice Traders', 'Vizag Steel Exports',
    'Jaipur Handicrafts', 'Ludhiana Garments Ltd', 'Amritsar Silk House', 'Kanpur Leather Works'
  ];
  const cosignees = [
    '14square Private Limited', 'Mumbai Imports Ltd', 'Bangalore Trading Co', 'Stark Private Limited',
    'International Trading Co', 'Global Logistics Singapore', 'Tech Solutions India', 'Chennai Motors Ltd',
    'Healthcare Dubai LLC', 'Middle East Grocers', 'Delhi Distributors Pvt Ltd', 'Mumbai Fashion House',
    'Sri Lanka Electronics', 'Colombo Trading Co', 'Hong Kong Trade Ltd', 'Singapore Imports Co',
    'Dubai Logistics LLC', 'London Wholesale Ltd', 'Frankfurt Auto GmbH', 'Shanghai Trading Co',
    'New York Imports Inc', 'Tokyo Electronics Ltd', 'Sydney Commerce Pty', 'Toronto Goods Inc',
    'Paris Distribution SA', 'Amsterdam Traders BV', 'Seoul Electronics Co', 'Bangkok Commerce Ltd'
  ];
  const transportModes = ['Sea Import', 'Sea Export', 'Air Import', 'Air Export', 'Land Import', 'Land Export'];
  const statuses: Booking['status'][] = ['Pending', 'Approved', 'Rejected'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const modePrefix: Record<string, string> = {
    'Sea Import': 'SE-S', 'Sea Export': 'SE-E', 'Air Import': 'AI', 'Air Export': 'AE', 'Land Import': 'LI', 'Land Export': 'LE'
  };

  const generateBookings = (): Booking[] => {
    const seed = (n: number) => {
      let x = Math.sin(n) * 10000;
      return x - Math.floor(x);
    };
    const pick = <T,>(arr: T[], n: number): T => arr[Math.floor(seed(n) * arr.length)];
    const generated: Booking[] = [];
    for (let i = 0; i < 200; i++) {
      const mode = pick(transportModes, i * 7 + 1);
      const prefix = modePrefix[mode];
      const num = 49 + i;
      const sub = Math.floor(seed(i * 3 + 2) * 20) + 1;
      const dec = (Math.floor(seed(i * 5 + 3) * 9) + 1);
      const day = Math.floor(seed(i * 11 + 4) * 28) + 1;
      const month = months[Math.floor(seed(i * 13 + 5) * 12)];
      const year = 2023 + Math.floor(seed(i * 17 + 6) * 2);
      const jobNo = 69595596 + i;
      generated.push({
        bookingNo: `${prefix}//${String(num).padStart(4, '0')}//${sub}.${dec}`,
        date: `${day}th ${month} ${year}`,
        jobOrderNo: String(jobNo),
        serviceProvider: pick(serviceProviders, i * 19 + 7),
        transportMode: mode,
        status: pick(statuses, i * 23 + 8),
        shipper: pick(shippers, i * 29 + 9),
        cosignee: pick(cosignees, i * 31 + 10),
      });
    }
    return generated;
  };

  const mockBookings: Booking[] = [
    { bookingNo: 'SE-S//0036//10.2', date: '8th Aug 2024', jobOrderNo: '69595583', serviceProvider: 'UPS India Pvt Ltd', transportMode: 'Sea Import', status: 'Pending', shipper: 'Stark Private Limited', cosignee: '14square Private Limited' },
    { bookingNo: 'SE-S//0037//11.3', date: '9th Aug 2024', jobOrderNo: '69595584', serviceProvider: 'Maersk India Ltd', transportMode: 'Sea Import', status: 'Pending', shipper: 'Global Traders Inc', cosignee: 'Mumbai Imports Ltd' },
    { bookingNo: 'SE-S//0038//12.1', date: '10th Aug 2024', jobOrderNo: '69595585', serviceProvider: 'MSC India Pvt Ltd', transportMode: 'Sea Import', status: 'Pending', shipper: 'Continental Exports', cosignee: 'Bangalore Trading Co' },
    { bookingNo: 'SE-S//0036//10.2', date: '8th Aug 2024', jobOrderNo: '69595583', serviceProvider: 'KLN India Pvt Ltd', transportMode: 'Sea Export', status: 'Approved', shipper: 'Transhipper Private Limited', cosignee: 'Stark Private Limited' },
    { bookingNo: 'SE-S//0039//13.2', date: '11th Aug 2024', jobOrderNo: '69595586', serviceProvider: 'CMA CGM India', transportMode: 'Sea Export', status: 'Pending', shipper: 'Export Masters Ltd', cosignee: 'International Trading Co' },
    { bookingNo: 'SE-S//0040//14.5', date: '12th Aug 2024', jobOrderNo: '69595587', serviceProvider: 'Hapag Lloyd India', transportMode: 'Sea Export', status: 'Pending', shipper: 'Maritime Exports Pvt Ltd', cosignee: 'Global Logistics Singapore' },
    { bookingNo: 'SE-S//0036//10.2', date: '8th Aug 2024', jobOrderNo: '69595583', serviceProvider: 'UPS India Pvt Ltd', transportMode: 'Air Import', status: 'Rejected', shipper: 'Square Space worldwide Private Limited', cosignee: 'Tranship Limited' },
    { bookingNo: 'AI//0041//15.1', date: '13th Aug 2024', jobOrderNo: '69595588', serviceProvider: 'DHL Express India', transportMode: 'Air Import', status: 'Pending', shipper: 'European Electronics GmbH', cosignee: 'Tech Solutions India' },
    { bookingNo: 'AI//0042//16.3', date: '14th Aug 2024', jobOrderNo: '69595589', serviceProvider: 'FedEx India', transportMode: 'Air Import', status: 'Pending', shipper: 'American Auto Parts Inc', cosignee: 'Chennai Motors Ltd' },
    { bookingNo: 'SE-S//0036//10.2', date: '8th Aug 2024', jobOrderNo: '69595583', serviceProvider: 'UPS India Pvt Ltd', transportMode: 'Air Export', status: 'Approved', shipper: 'Square Space worldwide Private Limited', cosignee: 'Tranship Limited' },
    { bookingNo: 'AE//0043//17.2', date: '15th Aug 2024', jobOrderNo: '69595590', serviceProvider: 'Emirates SkyCargo', transportMode: 'Air Export', status: 'Pending', shipper: 'Pharma Exports India Ltd', cosignee: 'Healthcare Dubai LLC' },
    { bookingNo: 'AE//0044//18.4', date: '16th Aug 2024', jobOrderNo: '69595591', serviceProvider: 'Qatar Airways Cargo', transportMode: 'Air Export', status: 'Pending', shipper: 'Fresh Foods Exports', cosignee: 'Middle East Grocers' },
    { bookingNo: 'SE-S//0036//10.2', date: '8th Aug 2024', jobOrderNo: '69595583', serviceProvider: 'UPS India Pvt Ltd', transportMode: 'Land Import', status: 'Approved', shipper: 'Square Space worldwide Private Limited', cosignee: 'Tranship Limited' },
    { bookingNo: 'SE-S//0036//10.2', date: '8th Aug 2024', jobOrderNo: '69595583', serviceProvider: 'UPS India Pvt Ltd', transportMode: 'Land Import', status: 'Pending', shipper: 'Square Space worldwide Private Limited', cosignee: 'Tranship Limited' },
    { bookingNo: 'LI//0045//19.1', date: '17th Aug 2024', jobOrderNo: '69595592', serviceProvider: 'VRL Logistics', transportMode: 'Land Import', status: 'Pending', shipper: 'Nepal Trading Co', cosignee: 'Delhi Distributors Pvt Ltd' },
    { bookingNo: 'LI//0046//20.3', date: '18th Aug 2024', jobOrderNo: '69595593', serviceProvider: 'TCI Freight', transportMode: 'Land Import', status: 'Pending', shipper: 'Bangladesh Textiles Ltd', cosignee: 'Mumbai Fashion House' },
    { bookingNo: 'SE-S//0036//10.2', date: '8th Aug 2024', jobOrderNo: '69595583', serviceProvider: 'UPS India Pvt Ltd', transportMode: 'Land Import', status: 'Rejected', shipper: 'Square Space worldwide Private Limited', cosignee: 'Tranship Limited' },
    { bookingNo: 'LE//0047//21.2', date: '19th Aug 2024', jobOrderNo: '69595594', serviceProvider: 'Blue Dart Express', transportMode: 'Land Export', status: 'Pending', shipper: 'Bangalore Tech Solutions', cosignee: 'Sri Lanka Electronics' },
    { bookingNo: 'LE//0048//22.5', date: '20th Aug 2024', jobOrderNo: '69595595', serviceProvider: 'Gati KWE', transportMode: 'Land Export', status: 'Pending', shipper: 'Chennai Manufacturing Ltd', cosignee: 'Colombo Trading Co' },
    ...generateBookings()
  ];

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
    if (mode.includes('Sea')) return <Ship className="w-4 h-4" />;
    if (mode.includes('Air')) return <Plane className="w-4 h-4" />;
    if (mode.includes('Land')) return <Truck className="w-4 h-4" />;
    return null;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-medium';
      case 'Approved': return 'bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium';
      case 'Rejected': return 'bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-medium';
      default: return 'bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm font-medium';
    }
  };

  const filtered = mockBookings.filter(booking =>
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
                          <span className={getStatusBadgeClass(booking.status)}>{booking.status}</span>
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
