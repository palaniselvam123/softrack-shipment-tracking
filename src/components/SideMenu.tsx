import React from 'react';
import { Grid3X3, FileText, StickyNote, Receipt, Activity } from 'lucide-react';

interface SideMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Grid3X3 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'activity', label: 'Activity', icon: Activity }
  ];

  return (
    <div className="bg-white w-56 shrink-0 min-h-full border-r border-surface-line">
      <nav className="py-3 px-2 space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-md text-field transition-colors duration-150 ${
                isActive
                  ? 'bg-surface-tile text-navy-900 font-semibold'
                  : 'text-gray-600 font-normal hover:bg-surface-head hover:text-navy-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-navy-700' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SideMenu;
