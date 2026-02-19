import React from 'react';
import { MapPin, Phone, Mail, Package, TrendingUp } from 'lucide-react';
import { Warehouse } from '../types/warehouse';

interface WarehouseCardProps {
  warehouse: Warehouse;
  onSelect: (warehouse: Warehouse) => void;
}

const statusConfig = {
  active: { label: 'Active', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  inactive: { label: 'Inactive', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  maintenance: { label: 'Maintenance', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
};

const typeConfig = {
  owned: { label: 'Owned', bg: 'bg-sky-100', text: 'text-sky-700' },
  leased: { label: 'Leased', bg: 'bg-blue-100', text: 'text-blue-700' },
  '3pl': { label: '3PL', bg: 'bg-teal-100', text: 'text-teal-700' },
};

const WarehouseCard: React.FC<WarehouseCardProps> = ({ warehouse, onSelect }) => {
  const utilization = warehouse.capacity_sqm > 0
    ? Math.round((warehouse.used_sqm / warehouse.capacity_sqm) * 100)
    : 0;
  const status = statusConfig[warehouse.status] || statusConfig.inactive;
  const type = typeConfig[warehouse.type] || typeConfig.owned;

  const utilizationColor =
    utilization >= 90 ? 'bg-red-500' :
    utilization >= 70 ? 'bg-amber-500' :
    'bg-emerald-500';

  return (
    <button
      onClick={() => onSelect(warehouse)}
      className="bg-white rounded-2xl border border-gray-200 p-6 text-left hover:shadow-lg hover:border-sky-200 transition-all duration-200 group w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-400 tracking-wider">{warehouse.code}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${type.bg} ${type.text}`}>
              {type.label}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-900 group-hover:text-sky-700 transition-colors">
            {warehouse.name}
          </h3>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          <span className={`text-xs font-semibold ${status.text}`}>{status.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{warehouse.location}, {warehouse.country}</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 font-medium">Space Utilization</span>
          <span className={`text-xs font-bold ${utilization >= 90 ? 'text-red-600' : utilization >= 70 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {utilization}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${utilizationColor}`}
            style={{ width: `${utilization}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">{warehouse.used_sqm.toLocaleString()} m² used</span>
          <span className="text-xs text-gray-400">{warehouse.capacity_sqm.toLocaleString()} m² total</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Mail className="w-3 h-3" />
          <span className="truncate">{warehouse.contact_email || '—'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Phone className="w-3 h-3" />
          <span className="truncate">{warehouse.contact_phone || '—'}</span>
        </div>
      </div>
    </button>
  );
};

export default WarehouseCard;
