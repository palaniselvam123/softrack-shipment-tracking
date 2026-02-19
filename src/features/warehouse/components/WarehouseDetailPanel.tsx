import React, { useEffect, useState } from 'react';
import { ArrowLeft, Package, ArrowRightLeft, MapPin, Phone, Mail, User, Building2 } from 'lucide-react';
import { Warehouse, WarehouseInventory, WarehouseMovement } from '../types/warehouse';
import { fetchInventoryByWarehouse, fetchMovementsByWarehouse } from '../services/warehouseService';
import InventoryTable from './InventoryTable';
import MovementsLog from './MovementsLog';

interface WarehouseDetailPanelProps {
  warehouse: Warehouse;
  onBack: () => void;
}

const tabs = [
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'movements', label: 'Movements', icon: ArrowRightLeft },
];

const statusConfig = {
  active: { label: 'Active', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  inactive: { label: 'Inactive', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  maintenance: { label: 'Maintenance', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
};

const WarehouseDetailPanel: React.FC<WarehouseDetailPanelProps> = ({ warehouse, onBack }) => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState<WarehouseInventory[]>([]);
  const [movements, setMovements] = useState<WarehouseMovement[]>([]);
  const [loadingInv, setLoadingInv] = useState(true);
  const [loadingMov, setLoadingMov] = useState(true);

  const utilization = warehouse.capacity_sqm > 0
    ? Math.round((warehouse.used_sqm / warehouse.capacity_sqm) * 100)
    : 0;

  const status = statusConfig[warehouse.status] || statusConfig.inactive;

  useEffect(() => {
    setLoadingInv(true);
    fetchInventoryByWarehouse(warehouse.id)
      .then(setInventory)
      .finally(() => setLoadingInv(false));

    setLoadingMov(true);
    fetchMovementsByWarehouse(warehouse.id)
      .then(setMovements)
      .finally(() => setLoadingMov(false));
  }, [warehouse.id]);

  const availableCount = inventory.filter(i => i.status === 'available').length;
  const reservedCount = inventory.filter(i => i.status === 'reserved').length;
  const issueCount = inventory.filter(i => i.status === 'damaged' || i.status === 'quarantine').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Warehouses
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-bold text-gray-400 tracking-wider">{warehouse.code}</span>
                <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full ${status.bg}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  <span className={`text-xs font-semibold ${status.text}`}>{status.label}</span>
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{warehouse.name}</h1>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {warehouse.location}, {warehouse.country}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 lg:min-w-[400px]">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-gray-900">{utilization}%</div>
              <div className="text-xs text-gray-500 mt-0.5">Utilization</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">{availableCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Available SKUs</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-amber-600">{issueCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Issues</div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 text-gray-400" />
            <span>{warehouse.contact_name || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{warehouse.contact_email || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{warehouse.contact_phone || '—'}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">Space: {warehouse.used_sqm.toLocaleString()} / {warehouse.capacity_sqm.toLocaleString()} m²</span>
            <span className="text-xs font-semibold text-gray-700">{utilization}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${utilization >= 90 ? 'bg-red-500' : utilization >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${utilization}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 pt-4">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'inventory' && (
          <InventoryTable inventory={inventory} loading={loadingInv} />
        )}
        {activeTab === 'movements' && (
          <MovementsLog movements={movements} loading={loadingMov} />
        )}
      </div>
    </div>
  );
};

export default WarehouseDetailPanel;
