import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Settings, Star, Truck, Plane, Ship, MessageCircle, Loader2 } from 'lucide-react';
import { supabase, type SupabaseShipment } from '../lib/supabase';
import ColumnCustomizer from './ColumnCustomizer';
import TableScrollSlider from './TableScrollSlider';

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
  const tableScrollRef = React.useRef<HTMLDivElement>(null);
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
        return 'bg-green-50 text-green-700';
      case 'air':
        return 'bg-surface-tile text-navy-700';
      case 'sea':
        return 'bg-surface-tile text-navy-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'export':
        return 'bg-surface-tile text-brand-700';
      case 's/b filed':
        return <Plane className="w-4 h-4 text-navy-700" />;
      case 'billing':
        return 'bg-amber-50 text-amber-700';
      case 'can sent':
        return 'bg-surface-tile text-navy-700';
      case 'goods r...':
      case 'goods received':
        return 'bg-green-50 text-green-700';
      case 'loaded ...':
      case 'loaded':
        return 'bg-surface-tile text-navy-700';
      default:
        return 'bg-gray-50 text-gray-700';
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
                    ? 'fill-amber-400 text-amber-400'
                    : ''
                }`}
              />
            </button>
            <span className="text-field font-medium text-navy-900">{shipment.shipmentNo}</span>
          </div>
        );
      case 'transport':
        return (
          <div className="flex items-center space-x-1">
            {getTransportIcon(shipment.transport)}
            <span className="text-field text-gray-700">{shipment.transport}</span>
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
        return <span className="text-field text-brand-600">{shipment[columnKey] || ''}</span>;
      default:
        return <span className="text-field text-gray-700">{shipment[columnKey] || ''}</span>;
    }
  };
  if (loading) {
    return (
      <div className="page">
        <h1 className="page-title mb-4">Shipments</h1>
        <div className="card">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 className="w-7 h-7 text-navy-600 animate-spin mx-auto mb-3" />
              <p className="text-field text-gray-500">Loading shipments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1 className="page-title mb-4">Shipments</h1>
        <div className="card">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-10 h-10 bg-red-50 rounded-md flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 text-lg font-semibold">!</span>
              </div>
              <p className="text-navy-900 font-semibold mb-1">Error loading shipments</p>
              <p className="text-field text-gray-500 mb-4 max-w-md mx-auto">{error}</p>
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
      <div className="page">
        <div className="mb-4">
          <h1 className="page-title">Shipments</h1>
          <p className="text-field text-gray-500 mt-0.5">Track and manage all your shipments in one place</p>
        </div>

        <div className="card">
          <div className="px-4 py-3 border-b border-surface-line">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={downloadExcel} className="btn-secondary">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button onClick={() => setSortField('')} className="btn-secondary">
                  <span>Sort</span>
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? 'btn-primary' : 'btn-secondary'}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                <button onClick={() => setShowColumnCustomizer(true)} className="btn-secondary">
                  <Settings className="w-4 h-4" />
                  <span>Columns</span>
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="px-4 py-4 border-b border-surface-line bg-surface-head animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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

          <div ref={tableScrollRef} className="overflow-x-auto scrollbar-hide">
            <table className="data-table">
              <thead>
                <tr>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.key}
                      className="cursor-pointer hover:bg-surface-soft transition-colors duration-100 group"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center gap-1.5">
                        {column.key === 'shipmentNo' && <Star className="w-3 h-3 text-gray-400 group-hover:text-navy-600" />}
                        <span>{column.label}</span>
                        {sortField === column.key && (
                          <span className="text-navy-600">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedShipments.map((shipment) => (
                  <tr
                    key={shipment.shipmentNo}
                    className={`cursor-pointer ${
                      shipment.status.toLowerCase() === 'delayed'
                        ? 'bg-amber-50/60 hover:bg-amber-50'
                        : ''
                    }`}
                    onClick={() => onViewShipment(shipment.shipmentNo)}
                  >
                    {visibleColumns.map((column) => (
                      <td key={column.key} className="whitespace-nowrap">
                        {renderCellContent(shipment, column.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <TableScrollSlider targetRef={tableScrollRef} deps={visibleColumns.length} />
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