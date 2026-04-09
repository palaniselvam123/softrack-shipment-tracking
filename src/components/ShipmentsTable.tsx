import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Settings, Star, Truck, Plane, Ship, Loader2, ArrowLeft, Lock, ChevronUp, ChevronDown } from 'lucide-react';
import { supabase, type SupabaseShipment } from '../lib/supabase';
import ColumnCustomizer from './ColumnCustomizer';
import { useAuth } from '../contexts/AuthContext';

interface ShipmentsTableProps {
  onViewShipment: (shipmentNo: string) => void;
  onBack: () => void;
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

const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ onViewShipment, onBack }) => {
  const { isAdmin } = useAuth();
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
    if (newFavorites.has(shipmentNo)) newFavorites.delete(shipmentNo);
    else newFavorites.add(shipmentNo);
    setFavorites(newFavorites);
  };

  const getTransportIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'road': return <Truck className="w-3.5 h-3.5 text-gray-500" />;
      case 'air': return <Plane className="w-3.5 h-3.5 text-gray-500" />;
      case 'sea': return <Ship className="w-3.5 h-3.5 text-gray-500" />;
      default: return <Truck className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const filteredShipments = shipments.filter(shipment =>
    Object.values(shipment).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const downloadExcel = () => {
    const headers = ['Shipment No', 'Container No', 'Shipper', 'Shipper Ref', 'Consignee', 'Customer', 'Transport', 'Departure', 'Arrival Port', 'Type', 'Status', 'ETD'];
    const csvContent = [
      headers.join(','),
      ...filteredShipments.map(s => [s.shipmentNo, s.containerNo, s.shipper, s.shipperRef, s.consignee, s.customer, s.transport, s.departure, s.arrivalPort, s.type, s.status, s.etd].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `shipments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: string) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const sortedShipments = [...filteredShipments].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField as keyof typeof a] || '';
    const bValue = b[sortField as keyof typeof b] || '';
    return sortDirection === 'asc'
      ? aValue.toString().localeCompare(bValue.toString())
      : bValue.toString().localeCompare(aValue.toString());
  });

  const visibleColumns = columns.filter(col => col.visible);

  const renderCellContent = (shipment: any, columnKey: string) => {
    switch (columnKey) {
      case 'shipmentNo':
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(shipment.shipmentNo); }}
              className="text-gray-300 hover:text-amber-400 transition-colors"
            >
              <Star className={`w-3.5 h-3.5 ${favorites.has(shipment.shipmentNo) ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <span className="text-sm font-medium text-sky-600">{shipment.shipmentNo}</span>
          </div>
        );
      case 'transport':
        return (
          <div className="flex items-center gap-1.5">
            {getTransportIcon(shipment.transport)}
            <span className="text-sm text-gray-700">{shipment.transport}</span>
          </div>
        );
      case 'status': {
        const st = shipment.status.toLowerCase();
        const statusStyle =
          st === 'delayed' ? 'bg-red-50 text-red-700' :
          st.includes('transit') || st === 'departed' || st === 'loaded' ? 'bg-blue-50 text-blue-700' :
          st === 'delivered' || st === 'arrived' ? 'bg-emerald-50 text-emerald-700' :
          st === 'customs hold' ? 'bg-amber-50 text-amber-700' :
          st === 'pending' ? 'bg-gray-100 text-gray-600' :
          'bg-gray-100 text-gray-600';
        return (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${statusStyle}`}>
            {shipment.status}
          </span>
        );
      }
      case 'shipper':
      case 'consignee':
      case 'customer':
        return <span className="text-sm text-gray-700">{shipment[columnKey] || ''}</span>;
      default:
        return <span className="text-sm text-gray-600">{shipment[columnKey] || ''}</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl flex items-center justify-center py-24">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading shipments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-xl font-bold">!</span>
            </div>
            <p className="text-sm text-red-600 font-medium mb-1">Error loading shipments</p>
            <p className="text-xs text-gray-500 mb-4 max-w-sm">{error}</p>
            <button onClick={fetchShipments} className="btn-primary text-sm">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all your shipments</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={downloadExcel} className="btn-secondary flex items-center gap-1.5 text-sm">
                  <Download className="w-4 h-4" /><span>Export</span>
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    showFilters ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4" /><span>Filters</span>
                </button>
                <button onClick={() => setShowColumnCustomizer(true)} className="btn-secondary flex items-center gap-1.5 text-sm">
                  <Settings className="w-4 h-4" /><span>Columns</span>
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Transport Mode</label>
                  <select className="input-field text-sm"><option value="">All Modes</option><option value="sea">Sea</option><option value="air">Air</option><option value="road">Road</option></select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
                  <select className="input-field text-sm"><option value="">All Statuses</option><option value="export">Export</option><option value="billing">Billing</option><option value="loaded">Loaded</option></select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Type</label>
                  <select className="input-field text-sm"><option value="">All Types</option><option value="export">Export</option><option value="import">Import</option></select>
                </div>
                <div className="flex items-end">
                  <button className="btn-primary w-full text-sm">Apply</button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.key}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors select-none"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center gap-1">
                        <span>{column.label}</span>
                        {sortField === column.key && (
                          sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-sky-500" /> : <ChevronDown className="w-3 h-3 text-sky-500" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedShipments.length === 0 && !loading && (
                  <tr>
                    <td colSpan={visibleColumns.length} className="px-4 py-16 text-center">
                      {!isAdmin ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                            <Lock className="w-5 h-5 text-amber-500" />
                          </div>
                          <p className="text-sm text-gray-700 font-medium">No shipments assigned</p>
                          <p className="text-xs text-gray-500 max-w-sm">Your administrator needs to map your account to the relevant parties before shipments appear here.</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No shipments found.</p>
                      )}
                    </td>
                  </tr>
                )}
                {sortedShipments.map((shipment) => (
                  <tr
                    key={shipment.shipmentNo}
                    className={`cursor-pointer transition-colors ${
                      shipment.status.toLowerCase() === 'delayed'
                        ? 'bg-amber-50/30 hover:bg-amber-50/60 border-l-2 border-l-amber-400'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onViewShipment(shipment.shipmentNo)}
                  >
                    {visibleColumns.map((column) => (
                      <td key={column.key} className="px-4 py-3 whitespace-nowrap">
                        {renderCellContent(shipment, column.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-500">
              Showing {sortedShipments.length} of {shipments.length} shipments
            </p>
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
