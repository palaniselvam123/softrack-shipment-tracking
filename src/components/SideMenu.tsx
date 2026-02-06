import React from 'react';
import { Grid3X3, FileText, StickyNote, Receipt, Activity } from 'lucide-react';

interface SideMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Grid3X3
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: StickyNote
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: Receipt
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: Activity
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 min-h-screen border-r border-gray-700/50 shadow-2xl">
      <nav className="py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3.5 text-left transition-all duration-200 rounded-xl group ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                isActive
                  ? 'bg-white/20'
                  : 'bg-gray-700/50 group-hover:bg-gray-600/50'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SideMenu;