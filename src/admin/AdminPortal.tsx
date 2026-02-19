import React, { useState } from 'react';
import {
  Users, Shield, Palette, Link, ClipboardList,
  ChevronLeft, Settings, Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserManagement from './UserManagement';
import PermissionsManager from './PermissionsManager';
import CustomerMappings from './CustomerMappings';
import ThemeCustomizer from './ThemeCustomizer';
import AuditLog from './AuditLog';

interface AdminPortalProps {
  onBack: () => void;
}

type TabId = 'users' | 'permissions' | 'mappings' | 'theme' | 'audit';

const TABS: { id: TabId; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
  { id: 'users', label: 'User Management', icon: Users, description: 'Create and manage user accounts' },
  { id: 'permissions', label: 'Permissions', icon: Shield, description: 'Control module access per user' },
  { id: 'mappings', label: 'Customer Mappings', icon: Link, description: 'Map users to shippers, consignees & agents' },
  { id: 'theme', label: 'Theme & Branding', icon: Palette, description: 'Customize colors, fonts & UI elements' },
  { id: 'audit', label: 'Audit Log', icon: ClipboardList, description: 'Track all admin actions' },
];

export default function AdminPortal({ onBack }: AdminPortalProps) {
  const { isAdmin, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('users');

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-6">You need admin privileges to access this portal.</p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const activeTabConfig = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-sm">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-none">Admin Portal</h1>
                <p className="text-xs text-gray-500 mt-0.5">LogiTRACK Administration</p>
              </div>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold">
                <Shield className="w-3 h-3" />
                {profile?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          <div className="w-60 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-start gap-3 px-4 py-4 text-left transition-all border-b border-gray-50 last:border-0 group ${
                      isActive
                        ? 'bg-sky-50 border-l-4 border-l-sky-500 pl-3.5'
                        : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      isActive ? 'bg-sky-500' : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold leading-tight ${isActive ? 'text-sky-700' : 'text-gray-700'}`}>
                        {tab.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{tab.description}</p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">{activeTabConfig.label}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{activeTabConfig.description}</p>
            </div>

            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'permissions' && <PermissionsManager />}
            {activeTab === 'mappings' && <CustomerMappings />}
            {activeTab === 'theme' && <ThemeCustomizer />}
            {activeTab === 'audit' && <AuditLog />}
          </div>
        </div>
      </div>
    </div>
  );
}
