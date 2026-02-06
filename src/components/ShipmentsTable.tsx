import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Settings, Star, Truck, Plane, Ship, MessageCircle, Loader2 } from 'lucide-react';
import { supabase, type SupabaseShipment } from '../lib/supabase';
import ColumnCustomizer from './ColumnCustomizer';

interface ShipmentsTableProps {
  onViewShipment: (shipmentNo: string) => void;
}

interface Column {
  key: string;
  label: string;
  visible: boolean;
  width?: string;
}

interface Shipment {
  shipmentNo: string;
  containerNo?: string;
  shipper: string;
  shipperRef?: string;
  consignee: string;
  customer?: string;
  transport: string;
  departure: string;
  arrivalPort: string;
  type: string;
  status: string;
  etd: string;
  eta?: string;
}

const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ onViewShipment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [columns, setColumns] = useState<Column[]>([
    { key: 'shipmentNo', label: 'Shipment No', visible: true },
    { key: 'containerNo', label: 'Container No', visible: true },
    { key: 'shipper', label: 'Shipper', visible: true },
    { key: 'shipperRef', label: 'Shipper Ref. No', visible: true },
    { key: 'consignee', label: 'Consignee', visible: true },
    { key: 'customer', label: 'Customer', visible: true },
    { key: 'transport', label: 'Transport', visible: true },
    { key: 'departure', label: 'Departure', visible: true },
    { key: 'arrivalPort', label: 'Arrival Port', visible: true },
    { key: 'type', label: 'Type', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'etd', label: 'ETD', visible: true }
  ]);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mappedShipments: Shipment[] = (data as SupabaseShipment[]).map(ship => ({
        shipmentNo: ship['Shipment Number'],
        containerNo: ship.job_ref || undefined,
        shipper: ship['Shipper'] || 'N/A',
        shipperRef: ship['Sales Rep'] || undefined,
        consignee: ship['Consignee'] || 'N/A',
        customer: ship['Shipper'] || undefined,
        transport: ship['Transport Mode'] || 'N/A',
        departure: ship['Origin'] || 'N/A',
        arrivalPort: ship['Destination'] || 'N/A',
        type: ship['Direction'] || ship['Shipment Type'] || 'N/A',
        status: ship.shipment_status || 'In Transit',
        etd: ship['ETD'] ? new Date(ship['ETD']).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
        eta: ship['ETA'] ? new Date(ship['ETA']).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : undefined
      }));

      setShipments(mappedShipments);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (shipmentNo: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(shipmentNo)) {
      newFavorites.delete(shipmentNo);
    } else {
      newFavorites.add(shipmentNo);
    }
    setFavorites(newFavorites);
  };

  const getTransportIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'road':
        return <Truck className="w-4 h-4 text-gray-600" />;
      case 'air':
        return <Plane className="w-4 h-4 text-gray-600" />;
      case 'sea':
        return <Ship className="w-4 h-4 text-gray-600" />;
      default:
        return <Truck className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransportColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'road':
        return 'bg-green-100 text-green-800';
      case 'air':
        return 'bg-pink-100 text-pink-800';
      case 'sea':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'export':
        return 'bg-blue-100 text-blue-800';
      case 's/b filed':
        return <Plane className="w-4 h-4 text-pink-600" />;
      case 'billing':
        return 'bg-amber-100 text-amber-800';
      case 'can sent':
        return 'bg-cyan-100 text-cyan-800';
      case 'goods r...':
      case 'goods received':
        return 'bg-green-100 text-green-800';
      case 'loaded ...':
      case 'loaded':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredShipments = shipments.filter(shipment =>
    Object.values(shipment).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const downloadExcel = () => {
    // Create CSV content
    const headers = [
      'Shipment No', 'Container No', 'Shipper', 'Shipper Ref', 'Consignee', 
      'Customer', 'Transport', 'Departure', 'Arrival Port', 'Type', 'Status', 'ETD'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredShipments.map(shipment => [
        shipment.shipmentNo,
        shipment.containerNo,
        shipment.shipper,
        shipment.shipperRef,
        shipment.consignee,
        shipment.customer,
        shipment.transport,
        shipment.departure,
        shipment.arrivalPort,
        shipment.type,
        shipment.status,
        shipment.etd
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `shipments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedShipments = [...filteredShipments].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField as keyof typeof a] || '';
    const bValue = b[sortField as keyof typeof b] || '';
    
    if (sortDirection === 'asc') {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  const visibleColumns = columns.filter(col => col.visible);

  const renderCellContent = (shipment: any, columnKey: string) => {
    switch (columnKey) {
      case 'shipmentNo':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(shipment.shipmentNo);
              }}
              className="text-gray-300 hover:text-gray-500 transition-colors"
            >
              <Star
                className={`w-4 h-4 ${
                  favorites.has(shipment.shipmentNo)
                    ? 'fill-gray-900 text-gray-900'
                    : ''
                }`}
              />
            </button>
            <span className="text-sm text-gray-900">{shipment.shipmentNo}</span>
          </div>
        );
      case 'transport':
        return (
          <div className="flex items-center space-x-1">
            {getTransportIcon(shipment.transport)}
            <span className="text-sm text-gray-700">{shipment.transport}</span>
          </div>
        );
      case 'status':
        return (
          <span className={`text-sm ${shipment.status.toLowerCase() === 'delayed' ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
            {shipment.status}
          </span>
        );
      case 'shipper':
      case 'consignee':
      case 'customer':
        return <span className="text-sm text-logitrack-blue-600">{shipment[columnKey] || ''}</span>;
      default:
        return <span className="text-sm text-gray-700">{shipment[columnKey] || ''}</span>;
    }
  };
  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
        </div>
        <div className="card">
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-sky-600 animate-spin mx-auto mb-6" />
              <p className="text-gray-600 font-medium">Loading shipments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
        </div>
        <div className="card">
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-red-600 text-3xl font-bold">!</span>
              </div>
              <p className="text-red-600 font-bold mb-2 text-lg">Error loading shipments</p>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={fetchShipments}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Shipments</h1>
          <p className="text-gray-600 mt-2 text-lg">Track and manage all your shipments in one place</p>
        </div>

        <div className="card shadow-xl border border-gray-200/50">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12 shadow-sm"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={downloadExcel}
                  className="btn-secondary flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 shadow-sm hover:shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setSortField('')}
                  className="btn-secondary flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 shadow-sm hover:shadow-md"
                >
                  <span>Sort</span>
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold border-2 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md ${
                    showFilters
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-600 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                <button
                  onClick={() => setShowColumnCustomizer(true)}
                  className="btn-secondary flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 shadow-sm hover:shadow-md"
                >
                  <Settings className="w-4 h-4" />
                  <span>Columns</span>
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="px-6 py-5 border-b border-gray-100 bg-sky-50/30 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Transport Mode</label>
                  <select className="input-field">
                    <option value="">All Modes</option>
                    <option value="sea">Sea</option>
                    <option value="air">Air</option>
                    <option value="road">Road</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select className="input-field">
                    <option value="">All Statuses</option>
                    <option value="export">Export</option>
                    <option value="billing">Billing</option>
                    <option value="loaded">Loaded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select className="input-field">
                    <option value="">All Types</option>
                    <option value="export">Export</option>
                    <option value="import">Import</option>
                    <option value="domestic">Domestic</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="btn-primary w-full">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-b-lg">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-b-2 border-indigo-700">
                <tr>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-indigo-700/50 transition-all duration-200 group"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-2">
                        {column.key === 'shipmentNo' && <Star className="w-3.5 h-3.5 text-blue-200 group-hover:text-white" />}
                        <span>{column.label}</span>
                        {sortField === column.key && (
                          <span className="text-yellow-300 font-bold">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sortedShipments.map((shipment) => (
                  <tr
                    key={shipment.shipmentNo}
                    className={`cursor-pointer transition-all duration-200 ${
                      shipment.status.toLowerCase() === 'delayed'
                        ? 'bg-yellow-50/30 hover:bg-yellow-50 border-l-4 border-yellow-500 hover:shadow-md'
                        : 'hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 hover:shadow-sm'
                    }`}
                    onClick={() => onViewShipment(shipment.shipmentNo)}
                  >
                    {visibleColumns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                        {renderCellContent(shipment, column.key)}
                      </td>
                    ))}
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

export default ShipmentsTable;