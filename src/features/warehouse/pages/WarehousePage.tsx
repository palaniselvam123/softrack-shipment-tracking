import React, { useEffect, useState } from 'react';
import { Building2, Package, TrendingUp, AlertTriangle, ArrowLeft, Search, Filter } from 'lucide-react';
import { Warehouse } from '../types/warehouse';
import { fetchWarehouses } from '../services/warehouseService';
import WarehouseCard from '../components/WarehouseCard';
import WarehouseDetailPanel from '../components/WarehouseDetailPanel';

interface WarehousePageProps {
  onBack: () => void;
}

const WarehousePage: React.FC<WarehousePageProps> = ({ onBack }) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchWarehouses()
      .then(setWarehouses)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (selectedWarehouse) {
    return (
      <WarehouseDetailPanel
        warehouse={selectedWarehouse}
        onBack={() => setSelectedWarehouse(null)}
      />
    );
  }

  const filtered = warehouses.filter(wh => {
    const matchesSearch =
      wh.name.toLowerCase().includes(search.toLowerCase()) ||
      wh.code.toLowerCase().includes(search.toLowerCase()) ||
      wh.location.toLowerCase().includes(search.toLowerCase()) ||
      wh.country.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || wh.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || wh.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalCapacity = warehouses.reduce((s, w) => s + w.capacity_sqm, 0);
  const totalUsed = warehouses.reduce((s, w) => s + w.used_sqm, 0);
  const overallUtil = totalCapacity > 0 ? Math.round((totalUsed / totalCapacity) * 100) : 0;
  const activeCount = warehouses.filter(w => w.status === 'active').length;
  const maintenanceCount = warehouses.filter(w => w.status === 'maintenance').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Warehouse Management</h1>
              <p className="text-sm text-gray-500">{warehouses.length} facilities across {[...new Set(warehouses.map(w => w.country))].length} countries</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-xl p-4 border border-sky-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-sky-600 uppercase tracking-wide">Total Facilities</span>
              <Building2 className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-bold text-sky-700">{warehouses.length}</div>
            <div className="text-xs text-sky-600 mt-1">{activeCount} active</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Total Capacity</span>
              <Package className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-700">{(totalCapacity / 1000).toFixed(1)}k</div>
            <div className="text-xs text-emerald-600 mt-1">m² across all sites</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">Avg Utilization</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-700">{overallUtil}%</div>
            <div className="text-xs text-amber-600 mt-1">{(totalUsed / 1000).toFixed(1)}k m² used</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4 border border-red-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-red-600 uppercase tracking-wide">Maintenance</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-700">{maintenanceCount}</div>
            <div className="text-xs text-red-600 mt-1">facilities offline</div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search warehouses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
            />
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
          >
            <option value="all">All Types</option>
            <option value="owned">Owned</option>
            <option value="leased">Leased</option>
            <option value="3pl">3PL</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No warehouses found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(wh => (
              <WarehouseCard key={wh.id} warehouse={wh} onSelect={setSelectedWarehouse} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehousePage;
