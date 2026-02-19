import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuditLog as AuditLogType } from './types';

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchLogs(); }, []);

  async function fetchLogs() {
    setLoading(true);
    const { data } = await supabase
      .from('admin_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (data) setLogs(data as AuditLogType[]);
    setLoading(false);
  }

  const filtered = logs.filter(l =>
    !search ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.admin_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search audit log..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
          />
        </div>
        <button onClick={fetchLogs} className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No audit log entries</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {filtered.map(log => (
            <div key={log.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{log.action}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Admin: {log.admin_id.substring(0, 8)}...
                  {log.target_user_id && ` → Target: ${log.target_user_id.substring(0, 8)}...`}
                </p>
                {Object.keys(log.details || {}).length > 0 && (
                  <pre className="text-xs text-gray-400 mt-1 font-mono truncate max-w-md">
                    {JSON.stringify(log.details)}
                  </pre>
                )}
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {new Date(log.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
