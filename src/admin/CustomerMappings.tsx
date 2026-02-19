import React, { useState, useEffect } from 'react';
import {
  Link, Plus, Search, Edit2, Trash2, X, Save, ChevronDown,
  Building2, Truck, Package, UserCheck, ToggleLeft, ToggleRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminUser, CustomerMapping, MappingType, MAPPING_TYPE_LABELS } from './types';

const TYPE_ICONS: Record<MappingType, React.FC<{ className?: string }>> = {
  customer: Building2,
  shipper: Truck,
  consignee: Package,
  agent: UserCheck,
};

const TYPE_COLORS: Record<MappingType, string> = {
  customer: 'bg-blue-100 text-blue-700 border-blue-200',
  shipper: 'bg-amber-100 text-amber-700 border-amber-200',
  consignee: 'bg-teal-100 text-teal-700 border-teal-200',
  agent: 'bg-violet-100 text-violet-700 border-violet-200',
};

interface FormData {
  user_id: string;
  mapping_type: MappingType;
  entity_name: string;
  entity_code: string;
  notes: string;
  is_active: boolean;
}

export default function CustomerMappings() {
  const [mappings, setMappings] = useState<CustomerMapping[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<MappingType | 'all'>('all');
  const [filterUser, setFilterUser] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CustomerMapping | null>(null);
  const [saving, setSaving] = useState(false);
  const [shipperSuggestions, setShipperSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const defaultForm: FormData = {
    user_id: '',
    mapping_type: 'customer',
    entity_name: '',
    entity_code: '',
    notes: '',
    is_active: true,
  };
  const [form, setForm] = useState<FormData>(defaultForm);

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*').order('full_name'),
      supabase.from('customer_mappings').select('*').order('created_at', { ascending: false }),
    ]).then(([usersRes, mappingsRes]) => {
      if (usersRes.data) setUsers(usersRes.data as AdminUser[]);
      if (mappingsRes.data) setMappings(mappingsRes.data as CustomerMapping[]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!form.entity_name || form.entity_name.length < 2) {
      setShipperSuggestions([]);
      return;
    }
    const field = form.mapping_type === 'consignee' ? 'Consignee' : 'Shipper';
    supabase
      .from('shipments')
      .select(`"${field}"`)
      .ilike(field, `%${form.entity_name}%`)
      .limit(8)
      .then(({ data }) => {
        if (data) {
          const unique = [...new Set(data.map((r: Record<string, string>) => r[field]).filter(Boolean))];
          setShipperSuggestions(unique as string[]);
        }
      });
  }, [form.entity_name, form.mapping_type]);

  async function fetchMappings() {
    const { data } = await supabase.from('customer_mappings').select('*').order('created_at', { ascending: false });
    if (data) setMappings(data as CustomerMapping[]);
  }

  function openCreate() {
    setEditing(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEdit(m: CustomerMapping) {
    setEditing(m);
    setForm({
      user_id: m.user_id,
      mapping_type: m.mapping_type,
      entity_name: m.entity_name,
      entity_code: m.entity_code,
      notes: m.notes,
      is_active: m.is_active,
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.user_id || !form.entity_name) return;
    setSaving(true);
    if (editing) {
      await supabase.from('customer_mappings').update({
        ...form,
        updated_at: new Date().toISOString(),
      }).eq('id', editing.id);
    } else {
      await supabase.from('customer_mappings').insert({
        ...form,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    await fetchMappings();
    setShowModal(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await supabase.from('customer_mappings').delete().eq('id', id);
    await fetchMappings();
  }

  async function handleToggle(m: CustomerMapping) {
    await supabase.from('customer_mappings').update({ is_active: !m.is_active, updated_at: new Date().toISOString() }).eq('id', m.id);
    await fetchMappings();
  }

  const filtered = mappings.filter(m => {
    const matchSearch = !search ||
      m.entity_name.toLowerCase().includes(search.toLowerCase()) ||
      m.entity_code.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || m.mapping_type === filterType;
    const matchUser = !filterUser || m.user_id === filterUser;
    return matchSearch && matchType && matchUser;
  });

  const getUserLabel = (userId: string) => {
    const u = users.find(u => u.id === userId);
    return u ? (u.full_name || u.email) : userId.substring(0, 8) + '...';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {(['customer', 'shipper', 'consignee', 'agent'] as MappingType[]).map(type => {
          const Icon = TYPE_ICONS[type];
          const count = mappings.filter(m => m.mapping_type === type && m.is_active).length;
          return (
            <div key={type} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium capitalize">{MAPPING_TYPE_LABELS[type]}s</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{count}</p>
                </div>
                <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-wrap flex-1">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search entity..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as MappingType | 'all')}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white"
            >
              <option value="all">All Types</option>
              {Object.entries(MAPPING_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={filterUser}
              onChange={e => setFilterUser(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white"
            >
              <option value="">All Users</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
              ))}
            </select>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Mapping
          </button>
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
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mapped User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Active</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(m => {
                  const Icon = TYPE_ICONS[m.mapping_type];
                  return (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${TYPE_COLORS[m.mapping_type]}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-sm text-gray-900">{m.entity_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${TYPE_COLORS[m.mapping_type]}`}>
                          {MAPPING_TYPE_LABELS[m.mapping_type]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700 font-medium">{getUserLabel(m.user_id)}</td>
                      <td className="px-5 py-4 text-sm text-gray-500 font-mono">{m.entity_code || '—'}</td>
                      <td className="px-5 py-4 text-sm text-gray-500 max-w-40 truncate">{m.notes || '—'}</td>
                      <td className="px-5 py-4 text-center">
                        <button onClick={() => handleToggle(m)} className="transition-transform hover:scale-110">
                          {m.is_active ? (
                            <ToggleRight className="w-6 h-6 text-emerald-500 mx-auto" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-gray-300 mx-auto" />
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(m)} className="p-1.5 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors text-gray-400">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(m.id)} className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-gray-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <Link className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No mappings found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit Mapping' : 'Add Customer Mapping'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">User</label>
                <div className="relative">
                  <select
                    value={form.user_id}
                    onChange={e => setForm(f => ({ ...f, user_id: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white appearance-none"
                  >
                    <option value="">-- Select user --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
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
                        onClick={() => setForm(f => ({ ...f, mapping_type: type }))}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                          form.mapping_type === type
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
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Entity Name</label>
                <input
                  value={form.entity_name}
                  onChange={e => {
                    setForm(f => ({ ...f, entity_name: e.target.value }));
                    setShowSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
                  placeholder="e.g. Tata Motors Ltd"
                />
                {showSuggestions && shipperSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-10 mt-1 max-h-48 overflow-y-auto">
                    {shipperSuggestions.map(s => (
                      <button
                        key={s}
                        onMouseDown={() => {
                          setForm(f => ({ ...f, entity_name: s }));
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 border-b border-gray-50 last:border-0"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Entity Code (optional)</label>
                <input
                  value={form.entity_code}
                  onChange={e => setForm(f => ({ ...f, entity_code: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 font-mono"
                  placeholder="e.g. TATA001"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 resize-none"
                  placeholder="Optional notes..."
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className={`w-10 h-6 rounded-full relative transition-colors ${form.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.is_active ? 'left-5' : 'left-1'}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">Active Mapping</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.user_id || !form.entity_name}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Mapping'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
