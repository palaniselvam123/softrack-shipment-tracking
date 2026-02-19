import React, { useState } from 'react';
import { Search, Package, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { WarehouseInventory } from '../types/warehouse';

interface InventoryTableProps {
  inventory: WarehouseInventory[];
  loading?: boolean;
}

const statusConfig = {
  available: { label: 'Available', icon: CheckCircle, bg: 'bg-emerald-100', text: 'text-emerald-700' },
  reserved: { label: 'Reserved', icon: Clock, bg: 'bg-blue-100', text: 'text-blue-700' },
  damaged: { label: 'Damaged', icon: XCircle, bg: 'bg-red-100', text: 'text-red-700' },
  quarantine: { label: 'Quarantine', icon: AlertTriangle, bg: 'bg-amber-100', text: 'text-amber-700' },
};

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory, loading }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = inventory.filter(item => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.location_code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search SKU, product, category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="damaged">Damaged</option>
          <option value="quarantine">Quarantine</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU / Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lot No.</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Shipment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No inventory items found</p>
                </td>
              </tr>
            ) : (
              filtered.map(item => {
                const st = statusConfig[item.status] || statusConfig.available;
                const Icon = st.icon;
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{item.product_name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.sku}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">{item.quantity.toLocaleString()}</span>
                      <span className="text-gray-400 ml-1 text-xs">{item.unit}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{item.location_code}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{item.lot_number || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                        <Icon className="w-3 h-3" />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-sky-600 font-medium">{item.shipment_ref || '—'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="mt-3 text-xs text-gray-400 text-right">
          Showing {filtered.length} of {inventory.length} items
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
