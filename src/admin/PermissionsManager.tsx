import React, { useState, useEffect } from 'react';
import { Shield, Search, Save, CheckSquare, Square, Users, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminUser, UserPermission, MODULES } from './types';

interface PermRow {
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_export: boolean;
}

const DEFAULT_PERMS = (module: string): PermRow => ({
  module,
  can_view: false,
  can_create: false,
  can_edit: false,
  can_delete: false,
  can_export: false,
});

const PERM_COLS: { key: keyof Omit<PermRow, 'module'>; label: string; color: string }[] = [
  { key: 'can_view', label: 'View', color: 'text-sky-600' },
  { key: 'can_create', label: 'Create', color: 'text-emerald-600' },
  { key: 'can_edit', label: 'Edit', color: 'text-amber-600' },
  { key: 'can_delete', label: 'Delete', color: 'text-red-600' },
  { key: 'can_export', label: 'Export', color: 'text-teal-600' },
];

export default function PermissionsManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [permissions, setPermissions] = useState<Record<string, PermRow>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('profiles').select('*').order('full_name').then(({ data }) => {
      if (data) setUsers(data as AdminUser[]);
    });
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;
    setLoading(true);
    supabase.from('user_permissions').select('*').eq('user_id', selectedUserId).then(({ data }) => {
      const map: Record<string, PermRow> = {};
      for (const m of MODULES) {
        const existing = data?.find(p => p.module === m.id);
        map[m.id] = existing
          ? { module: m.id, can_view: existing.can_view, can_create: existing.can_create, can_edit: existing.can_edit, can_delete: existing.can_delete, can_export: existing.can_export }
          : DEFAULT_PERMS(m.id);
      }
      setPermissions(map);
      setLoading(false);
    });
  }, [selectedUserId]);

  function toggle(module: string, key: keyof Omit<PermRow, 'module'>) {
    setPermissions(prev => ({
      ...prev,
      [module]: { ...prev[module], [key]: !prev[module][key] },
    }));
  }

  function toggleRow(module: string, val: boolean) {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        module,
        can_view: val,
        can_create: val,
        can_edit: val,
        can_delete: val,
        can_export: val,
      },
    }));
  }

  function toggleCol(key: keyof Omit<PermRow, 'module'>, val: boolean) {
    setPermissions(prev => {
      const next = { ...prev };
      for (const m of filteredModules) {
        next[m.id] = { ...next[m.id], [key]: val };
      }
      return next;
    });
  }

  async function handleSave() {
    if (!selectedUserId) return;
    setSaving(true);
    const rows = Object.values(permissions).map(p => ({
      user_id: selectedUserId,
      module: p.module,
      can_view: p.can_view,
      can_create: p.can_create,
      can_edit: p.can_edit,
      can_delete: p.can_delete,
      can_export: p.can_export,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from('user_permissions').upsert(rows, { onConflict: 'user_id,module' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function applyPreset(preset: 'full' | 'readonly' | 'none') {
    const map: Record<string, PermRow> = {};
    for (const m of MODULES) {
      map[m.id] = {
        module: m.id,
        can_view: preset !== 'none',
        can_create: preset === 'full',
        can_edit: preset === 'full',
        can_delete: preset === 'full',
        can_export: preset !== 'none',
      };
    }
    setPermissions(map);
  }

  const selectedUser = users.find(u => u.id === selectedUserId);
  const filteredModules = MODULES.filter(m => !search || m.label.toLowerCase().includes(search.toLowerCase()));

  const allColChecked = (key: keyof Omit<PermRow, 'module'>) =>
    filteredModules.every(m => permissions[m.id]?.[key]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">Select User</h3>
            <p className="text-sm text-gray-500">Choose a user to manage their module permissions</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white appearance-none"
            >
              <option value="">-- Select a user --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.full_name || u.email} ({u.role})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {selectedUserId && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-sm">
                {(selectedUser?.full_name || selectedUser?.email || '?').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{selectedUser?.full_name || selectedUser?.email}</p>
                <p className="text-xs text-gray-500">{selectedUser?.email}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => applyPreset('none')} className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">No Access</button>
              <button onClick={() => applyPreset('readonly')} className="px-3 py-1.5 text-xs font-semibold border border-sky-200 rounded-lg hover:bg-sky-50 text-sky-600 transition-colors">Read Only</button>
              <button onClick={() => applyPreset('full')} className="px-3 py-1.5 text-xs font-semibold border border-emerald-200 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors">Full Access</button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search modules..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 max-w-xs"
              />
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
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">Module</th>
                    {PERM_COLS.map(col => (
                      <th key={col.key} className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={col.color}>{col.label}</span>
                          <button
                            onClick={() => toggleCol(col.key, !allColChecked(col.key))}
                            className="text-gray-400 hover:text-gray-700 transition-colors"
                            title={`Toggle all ${col.label}`}
                          >
                            {allColChecked(col.key) ? (
                              <CheckSquare className="w-4 h-4 text-sky-500" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </th>
                    ))}
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">All</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredModules.map(m => {
                    const perm = permissions[m.id] || DEFAULT_PERMS(m.id);
                    const rowAll = PERM_COLS.every(c => perm[c.key]);
                    return (
                      <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-sm text-gray-800">{m.label}</span>
                        </td>
                        {PERM_COLS.map(col => (
                          <td key={col.key} className="text-center px-4 py-3.5">
                            <button
                              onClick={() => toggle(m.id, col.key)}
                              className="transition-transform hover:scale-110"
                            >
                              {perm[col.key] ? (
                                <CheckSquare className="w-5 h-5 text-sky-500 mx-auto" />
                              ) : (
                                <Square className="w-5 h-5 text-gray-300 mx-auto" />
                              )}
                            </button>
                          </td>
                        ))}
                        <td className="text-center px-4 py-3.5">
                          <button
                            onClick={() => toggleRow(m.id, !rowAll)}
                            className={`w-8 h-5 rounded-full transition-colors relative ${rowAll ? 'bg-sky-500' : 'bg-gray-200'}`}
                          >
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${rowAll ? 'left-3.5' : 'left-0.5'}`} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-5 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || !selectedUserId}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 ${
                saved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              {saved ? (
                <><CheckSquare className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Permissions'}</>
              )}
            </button>
          </div>
        </div>
      )}

      {!selectedUserId && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <Shield className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Select a user above to manage their permissions</p>
        </div>
      )}
    </div>
  );
}
