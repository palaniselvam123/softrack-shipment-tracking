import React, { useState, useEffect } from 'react';
import {
  Users, Plus, Search, Edit2, Trash2, Shield, ShieldOff,
  CheckCircle, XCircle, Clock, MoreVertical, Mail, Building2,
  Phone, UserCog, ChevronDown, X, Save, Eye, EyeOff
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminUser, UserStatus, UserType, USER_TYPE_LABELS } from './types';

interface UserFormData {
  email: string;
  password: string;
  full_name: string;
  company: string;
  phone: string;
  role: 'admin' | 'user';
  user_type: UserType;
  status: UserStatus;
}

const STATUS_CONFIG: Record<UserStatus, { label: string; color: string; icon: React.FC<{ className?: string }> }> = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: Clock },
  suspended: { label: 'Suspended', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

const TYPE_COLORS: Record<UserType, string> = {
  internal: 'bg-sky-100 text-sky-700 border-sky-200',
  customer: 'bg-blue-100 text-blue-700 border-blue-200',
  shipper: 'bg-amber-100 text-amber-700 border-amber-200',
  consignee: 'bg-teal-100 text-teal-700 border-teal-200',
  agent: 'bg-violet-100 text-violet-700 border-violet-200',
};

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<UserType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const defaultForm: UserFormData = {
    email: '',
    password: '',
    full_name: '',
    company: '',
    phone: '',
    role: 'user',
    user_type: 'internal',
    status: 'active',
  };
  const [form, setForm] = useState<UserFormData>(defaultForm);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setUsers(data as AdminUser[]);
    setLoading(false);
  }

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.company || '').toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || u.user_type === filterType;
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  function openCreate() {
    setEditingUser(null);
    setForm(defaultForm);
    setError(null);
    setShowModal(true);
  }

  function openEdit(user: AdminUser) {
    setEditingUser(user);
    setForm({
      email: user.email,
      password: '',
      full_name: user.full_name || '',
      company: user.company || '',
      phone: user.phone || '',
      role: user.role,
      user_type: user.user_type || 'internal',
      status: user.status || 'active',
    });
    setError(null);
    setShowModal(true);
    setOpenMenuId(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    if (!editingUser) {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            full_name: form.full_name,
            company: form.company,
            phone: form.phone,
            role: form.role,
            user_type: form.user_type,
            status: form.status,
          }),
        }
      );

      const result = await res.json();
      if (!res.ok || result.error) {
        setError(result.error || 'Failed to create user');
        setSaving(false);
        return;
      }
    } else {
      const { error: updateError } = await supabase.from('profiles').update({
        full_name: form.full_name,
        company: form.company,
        phone: form.phone,
        role: form.role,
        user_type: form.user_type,
        status: form.status,
        updated_at: new Date().toISOString(),
      }).eq('id', editingUser.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    }

    await fetchUsers();
    setShowModal(false);
    setSaving(false);
  }

  async function handleStatusToggle(user: AdminUser, newStatus: UserStatus) {
    await supabase.from('profiles').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', user.id);
    await fetchUsers();
    setOpenMenuId(null);
  }

  async function handleRoleToggle(user: AdminUser) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await supabase.from('profiles').update({ role: newRole, updated_at: new Date().toISOString() }).eq('id', user.id);
    await fetchUsers();
    setOpenMenuId(null);
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    customers: users.filter(u => u.user_type === 'customer').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.total, color: 'from-sky-500 to-sky-600', icon: Users },
          { label: 'Active', value: stats.active, color: 'from-emerald-500 to-emerald-600', icon: CheckCircle },
          { label: 'Admins', value: stats.admins, color: 'from-amber-500 to-amber-600', icon: Shield },
          { label: 'Customers', value: stats.customers, color: 'from-teal-500 to-teal-600', icon: Building2 },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-wrap flex-1">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as UserType | 'all')}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white"
            >
              <option value="all">All Types</option>
              {Object.entries(USER_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as UserStatus | 'all')}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add User
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
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(user => {
                  const statusCfg = STATUS_CONFIG[user.status || 'active'];
                  const StatusIcon = statusCfg.icon;
                  const typeColor = TYPE_COLORS[user.user_type || 'internal'];
                  const initials = (user.full_name || user.email).substring(0, 2).toUpperCase();
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{user.full_name || '—'}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${typeColor}`}>
                          {USER_TYPE_LABELS[user.user_type || 'internal']}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${user.role === 'admin' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserCog className="w-3 h-3" />}
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusCfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{user.company || '—'}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                          {openMenuId === user.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1.5">
                              <button onClick={() => openEdit(user)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <Edit2 className="w-3.5 h-3.5" /> Edit User
                              </button>
                              <button onClick={() => handleRoleToggle(user)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                {user.role === 'admin' ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              {user.status !== 'active' && (
                                <button onClick={() => handleStatusToggle(user, 'active')} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-emerald-600 hover:bg-gray-50">
                                  <CheckCircle className="w-3.5 h-3.5" /> Activate
                                </button>
                              )}
                              {user.status !== 'suspended' && (
                                <button onClick={() => handleStatusToggle(user, 'suspended')} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                                  <XCircle className="w-3.5 h-3.5" /> Suspend
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                  <input
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Company</label>
                  <input
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
                    placeholder="Acme Ltd"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    disabled={!!editingUser}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="user@company.com"
                  />
                </div>
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full px-3.5 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
                      placeholder="Min 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Role</label>
                  <select
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value as 'admin' | 'user' }))}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">User Type</label>
                  <select
                    value={form.user_type}
                    onChange={e => setForm(f => ({ ...f, user_type: e.target.value as UserType }))}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white"
                  >
                    {Object.entries(USER_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as UserStatus }))}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
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
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {openMenuId && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
      )}
    </div>
  );
}
