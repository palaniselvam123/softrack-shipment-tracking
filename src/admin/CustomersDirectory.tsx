import React, { useState, useEffect } from 'react';
import {
  Search, Building2, Truck, Package, UserCheck, Link2, AlertTriangle,
  ChevronDown, X, Save, CheckCircle, Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminUser, CustomerMapping, MappingType, MAPPING_TYPE_LABELS } from './types';

interface EntityRecord {
  entity_name: string;
  entity_type: 'shipper' | 'consignee';
  shipment_count: number;
  mapped_to: CustomerMapping[];
}

const TYPE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  shipper: Truck,
  consignee: Package,
  customer: Building2,
  agent: UserCheck,
};

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  shipper: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  consignee: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700 border-teal-200' },
};

interface QuickMapModalProps {
  entity: EntityRecord;
  users: AdminUser[];
  onClose: () => void;
  onSave: (entityName: string, userId: string, mappingType: MappingType) => Promise<void>;
}

function QuickMapModal({ entity, users, onClose, onSave }: QuickMapModalProps) {
  const [selectedUser, setSelectedUser] = useState('');
  const [mappingType, setMappingType] = useState<MappingType>(entity.entity_type as MappingType);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedUser) return;
    setSaving(true);
    await onSave(entity.entity_name, selectedUser, mappingType);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Map Entity to User</h3>
            <p className="text-sm text-gray-500 mt-0.5">{entity.entity_name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${TYPE_COLORS[entity.entity_type].bg} ${TYPE_COLORS[entity.entity_type].border} border`}>
              {React.createElement(TYPE_ICONS[entity.entity_type], { className: `w-5 h-5 ${TYPE_COLORS[entity.entity_type].text}` })}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{entity.entity_name}</p>
              <p className="text-xs text-gray-500">{entity.shipment_count} shipments as {entity.entity_type}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Assign to User</label>
            <div className="relative">
              <select
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white appearance-none"
              >
                <option value="">-- Select user --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || u.email}{u.company ? ` (${u.company})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mapping Type</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(MAPPING_TYPE_LABELS) as MappingType[]).map(type => {
                const Icon = TYPE_ICONS[type];
                return (
                  <button
                    key={type}
                    onClick={() => setMappingType(type)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                      mappingType === type
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {MAPPING_TYPE_LABELS[type]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedUser}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Mapping...' : 'Create Mapping'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomersDirectory() {
  const [entities, setEntities] = useState<EntityRecord[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [mappings, setMappings] = useState<CustomerMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'shipper' | 'consignee'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'mapped' | 'unmapped'>('all');
  const [quickMapEntity, setQuickMapEntity] = useState<EntityRecord | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [usersRes, mappingsRes, shippersRes, consigneesRes] = await Promise.all([
      supabase.from('profiles').select('*').order('full_name'),
      supabase.from('customer_mappings').select('*'),
      supabase.from('shipments').select('"Shipper"'),
      supabase.from('shipments').select('"Consignee"'),
    ]);

    if (usersRes.data) setUsers(usersRes.data as AdminUser[]);
    const allMappings = (mappingsRes.data || []) as CustomerMapping[];
    setMappings(allMappings);

    const shipperCounts: Record<string, number> = {};
    const consigneeCounts: Record<string, number> = {};

    (shippersRes.data || []).forEach((row: Record<string, string>) => {
      const name = row['Shipper'];
      if (name) shipperCounts[name] = (shipperCounts[name] || 0) + 1;
    });

    (consigneesRes.data || []).forEach((row: Record<string, string>) => {
      const name = row['Consignee'];
      if (name) consigneeCounts[name] = (consigneeCounts[name] || 0) + 1;
    });

    const entityRecords: EntityRecord[] = [];

    Object.entries(shipperCounts).forEach(([name, count]) => {
      entityRecords.push({
        entity_name: name,
        entity_type: 'shipper',
        shipment_count: count,
        mapped_to: allMappings.filter(m => m.entity_name === name && m.is_active),
      });
    });

    Object.entries(consigneeCounts).forEach(([name, count]) => {
      entityRecords.push({
        entity_name: name,
        entity_type: 'consignee',
        shipment_count: count,
        mapped_to: allMappings.filter(m => m.entity_name === name && m.is_active),
      });
    });

    entityRecords.sort((a, b) => a.entity_name.localeCompare(b.entity_name));
    setEntities(entityRecords);
    setLoading(false);
  }

  async function handleQuickMap(entityName: string, userId: string, mappingType: MappingType) {
    const now = new Date().toISOString();
    await supabase.from('customer_mappings').insert({
      user_id: userId,
      mapping_type: mappingType,
      entity_name: entityName,
      entity_code: '',
      notes: '',
      is_active: true,
      created_at: now,
      updated_at: now,
    });
    await loadData();
  }

  const getUserLabel = (userId: string) => {
    const u = users.find(u => u.id === userId);
    return u ? (u.full_name || u.email) : userId.substring(0, 8) + '...';
  };

  const filtered = entities.filter(e => {
    const matchSearch = !search || e.entity_name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || e.entity_type === filterType;
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'mapped' && e.mapped_to.length > 0) ||
      (filterStatus === 'unmapped' && e.mapped_to.length === 0);
    return matchSearch && matchType && matchStatus;
  });

  const stats = {
    total: entities.length,
    shippers: entities.filter(e => e.entity_type === 'shipper').length,
    consignees: entities.filter(e => e.entity_type === 'consignee').length,
    mapped: entities.filter(e => e.mapped_to.length > 0).length,
    unmapped: entities.filter(e => e.mapped_to.length === 0).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total Entities', value: stats.total, icon: Building2, gradient: 'from-sky-500 to-sky-600' },
          { label: 'Shippers', value: stats.shippers, icon: Truck, gradient: 'from-amber-500 to-amber-600' },
          { label: 'Consignees', value: stats.consignees, icon: Package, gradient: 'from-teal-500 to-teal-600' },
          { label: 'Mapped', value: stats.mapped, icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600' },
          { label: 'Unmapped', value: stats.unmapped, icon: AlertTriangle, gradient: 'from-red-500 to-red-600' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-11 h-11 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {stats.unmapped > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {stats.unmapped} {stats.unmapped === 1 ? 'entity is' : 'entities are'} not mapped to any user
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Non-admin users will not see shipments for unmapped entities. Use the "Map" button to assign them.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-wrap flex-1">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search entities..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as 'all' | 'shipper' | 'consignee')}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white"
            >
              <option value="all">All Types</option>
              <option value="shipper">Shippers</option>
              <option value="consignee">Consignees</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as 'all' | 'mapped' | 'unmapped')}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white"
            >
              <option value="all">All Status</option>
              <option value="mapped">Mapped</option>
              <option value="unmapped">Unmapped</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shipments</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mapping Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mapped Users</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(entity => {
                  const colors = TYPE_COLORS[entity.entity_type];
                  const Icon = TYPE_ICONS[entity.entity_type];
                  const isMapped = entity.mapped_to.length > 0;
                  return (
                    <tr key={`${entity.entity_type}-${entity.entity_name}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colors.bg} ${colors.border}`}>
                            <Icon className={`w-4 h-4 ${colors.text}`} />
                          </div>
                          <span className="font-semibold text-sm text-gray-900">{entity.entity_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${colors.badge}`}>
                          {entity.entity_type === 'shipper' ? 'Shipper' : 'Consignee'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
                          {entity.shipment_count}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {isMapped ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            Mapped
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                            <AlertTriangle className="w-3 h-3" />
                            Unmapped
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {isMapped ? (
                          <div className="flex flex-wrap gap-1.5">
                            {entity.mapped_to.map(m => (
                              <span
                                key={m.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-medium rounded-md"
                              >
                                <Users className="w-3 h-3" />
                                {getUserLabel(m.user_id)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No users assigned</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setQuickMapEntity(entity)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isMapped
                              ? 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                              : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm'
                          }`}
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          {isMapped ? 'Add Mapping' : 'Map Now'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No entities found</p>
              </div>
            )}
          </div>
        )}

        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/30">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} of {entities.length} entities
          </p>
        </div>
      </div>

      {quickMapEntity && (
        <QuickMapModal
          entity={quickMapEntity}
          users={users}
          onClose={() => setQuickMapEntity(null)}
          onSave={handleQuickMap}
        />
      )}
    </div>
  );
}
