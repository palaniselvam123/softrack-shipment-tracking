import React, { useState } from 'react';
import { Search, Filter, Eye, User, Building, Calendar, Package, DollarSign, Star, Settings } from 'lucide-react';
import ColumnCustomizer from './ColumnCustomizer';
import LeadDetailModal from './LeadDetailModal';

interface Lead {
  id: string;
  lead_id: string;
  inquiry_id: string;
  customer_id: string;
  customer_name: string;
  company_name: string;
  lob: string[];
  status: 'New' | 'Attended' | 'Quoted' | 'Quote Accepted' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  assigned_to: string;
  created_at: string;
  updated_at: string;
  movement_type: string;
  origin: string;
  destination: string;
  estimated_value?: number;
  currency?: string;
}

interface Column {
  key: string;
  label: string;
  visible: boolean;
  width?: string;
}

const LeadList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [columns, setColumns] = useState<Column[]>([
    { key: 'lead_id', label: 'Lead ID', visible: true },
    { key: 'customer', label: 'Customer', visible: true },
    { key: 'lob', label: 'LOB', visible: true },
    { key: 'route', label: 'Route', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'priority', label: 'Priority', visible: true },
    { key: 'assigned_to', label: 'Assigned To', visible: true },
    { key: 'estimated_value', label: 'Est. Value', visible: true },
    { key: 'created_at', label: 'Created', visible: true }
  ]);

  // Mock leads data
  const leads: Lead[] = [
    {
      id: '1',
      lead_id: 'LD-000123',
      inquiry_id: 'IQ-000123',
      customer_id: 'CUST-001',
      customer_name: 'ACME Exports',
      company_name: 'ACME Group',
      lob: ['SEA_FCL'],
      status: 'Quoted',
      priority: 'High',
      assigned_to: 'Sarah Johnson',
      created_at: '2026-11-20',
      updated_at: '2026-11-21',
      movement_type: 'PORT_TO_CFS',
      origin: 'Mumbai, IN',
      destination: 'Singapore, SG',
      estimated_value: 15000,
      currency: 'USD'
    },
    {
      id: '2',
      lead_id: 'LD-000124',
      inquiry_id: 'IQ-000124',
      customer_id: 'CUST-002',
      customer_name: 'Global Trading Co',
      company_name: 'Global Trading International',
      lob: ['AIR_FREIGHT'],
      status: 'New',
      priority: 'Medium',
      assigned_to: 'Mike Chen',
      created_at: '2026-11-21',
      updated_at: '2026-11-21',
      movement_type: 'DOOR_TO_DOOR',
      origin: 'Delhi, IN',
      destination: 'New York, US',
      estimated_value: 8500,
      currency: 'USD'
    },
    {
      id: '3',
      lead_id: 'LD-000125',
      inquiry_id: 'IQ-000125',
      customer_id: 'CUST-003',
      customer_name: 'Tech Solutions Ltd',
      company_name: 'Tech Solutions Private Limited',
      lob: ['SEA_LCL', 'AIR_FREIGHT'],
      status: 'Attended',
      priority: 'High',
      assigned_to: 'Emma Wilson',
      created_at: '2026-11-19',
      updated_at: '2026-11-20',
      movement_type: 'PORT_TO_PORT',
      origin: 'Chennai, IN',
      destination: 'Hamburg, DE',
      estimated_value: 22000,
      currency: 'USD'
    },
    {
      id: '4',
      lead_id: 'LD-000126',
      inquiry_id: 'IQ-000126',
      customer_id: 'CUST-004',
      customer_name: 'Fashion Retail Inc',
      company_name: 'Fashion Retail International',
      lob: ['SEA_FCL'],
      status: 'Quote Accepted',
      priority: 'Medium',
      assigned_to: 'David Brown',
      created_at: '2026-11-18',
      updated_at: '2026-11-22',
      movement_type: 'DOOR_TO_PORT',
      origin: 'Bangalore, IN',
      destination: 'Los Angeles, US',
      estimated_value: 35000,
      currency: 'USD'
    },
    {
      id: '5',
      lead_id: 'LD-000127',
      inquiry_id: 'IQ-000127',
      customer_id: 'CUST-005',
      customer_name: 'Automotive Parts Co',
      company_name: 'Automotive Parts Manufacturing',
      lob: ['ROAD_TRANSPORT'],
      status: 'Closed',
      priority: 'Low',
      assigned_to: 'Lisa Garcia',
      created_at: '2026-11-15',
      updated_at: '2026-11-20',
      movement_type: 'DOOR_TO_DOOR',
      origin: 'Pune, IN',
      destination: 'Delhi, IN',
      estimated_value: 5000,
      currency: 'USD'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-surface-tile text-brand-700';
      case 'Attended':
        return 'bg-amber-50 text-amber-700';
      case 'Quoted':
        return 'bg-surface-tile text-navy-700';
      case 'Quote Accepted':
        return 'bg-green-50 text-green-700';
      case 'Closed':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700';
      case 'Medium':
        return 'bg-amber-50 text-amber-700';
      case 'Low':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getLobBadgeColor = (lob: string) => {
    switch (lob) {
      case 'SEA_FCL':
        return 'bg-surface-tile text-brand-700';
      case 'SEA_LCL':
        return 'bg-surface-tile text-navy-700';
      case 'AIR_FREIGHT':
        return 'bg-surface-tile text-navy-700';
      case 'ROAD_TRANSPORT':
        return 'bg-green-50 text-green-700';
      case 'LIQUID':
        return 'bg-surface-tile text-navy-700';
      case 'RAIL':
        return 'bg-surface-tile text-navy-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = Object.values(lead).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesPriority = !priorityFilter || lead.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusCounts = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    attended: leads.filter(l => l.status === 'Attended').length,
    quoted: leads.filter(l => l.status === 'Quoted').length,
    accepted: leads.filter(l => l.status === 'Quote Accepted').length
  };

  return (
    <div className="page">
      <div className="card">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-line">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title">Lead Management</h1>
              <p className="text-field text-gray-500 mt-0.5">Manage leads generated from customer inquiries</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sales View</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 py-4 border-b border-surface-line bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-surface-tile rounded-md flex items-center justify-center">
                  <Package className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Leads</p>
                  <p className="text-[15px] font-semibold text-navy-900">{statusCounts.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-surface-tile rounded-md flex items-center justify-center">
                  <Star className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">New</p>
                  <p className="text-xl font-semibold text-brand-600">{statusCounts.new}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-surface-tile rounded-md flex items-center justify-center">
                  <Eye className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Attended</p>
                  <p className="text-xl font-semibold text-amber-600">{statusCounts.attended}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-surface-tile rounded-md flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-navy-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quoted</p>
                  <p className="text-[15px] font-semibold text-navy-900">{statusCounts.quoted}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-surface-tile rounded-md flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Accepted</p>
                  <p className="text-xl font-semibold text-green-600">{statusCounts.accepted}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-surface-line">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-md transition-colors ${
                  showFilters ? 'bg-surface-tile border-surface-line text-brand-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={() => setShowColumnCustomizer(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-surface-line rounded-md hover:bg-surface-head transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Customize Columns</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-tile rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                >
                  <option value="">All Status</option>
                  <option value="New">New</option>
                  <option value="Attended">Attended</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Quote Accepted">Quote Accepted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select 
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    setStatusFilter('');
                    setPriorityFilter('');
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-2 border border-surface-line text-navy-900 rounded-md hover:bg-surface-head transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-head border-b border-surface-line">
              <tr>
                {columns.filter(col => col.visible).map((column) => (
                  <th key={column.key} className="px-4 py-2.5 text-left text-label font-semibold text-navy-900">
                    {column.label}
                  </th>
                ))}
                <th className="px-4 py-2.5 text-left text-label font-semibold text-navy-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-soft">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  {columns.filter(col => col.visible).map((column) => {
                    switch (column.key) {
                      case 'lead_id':
                        return (
                          <td key={column.key} className="px-4 py-2.5 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Package className="w-4 h-4 text-brand-600" />
                              <span className="text-sm font-medium text-brand-600">{lead.lead_id}</span>
                            </div>
                            <div className="text-xs text-gray-500">Inquiry: {lead.inquiry_id}</div>
                          </td>
                        );
                      case 'customer':
                        return (
                          <td key={column.key} className="px-4 py-2.5 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{lead.customer_name}</div>
                                <div className="text-xs text-gray-500">{lead.company_name}</div>
                              </div>
                            </div>
                          </td>
                        );
                      case 'lob':
                        return (
                          <td key={column.key} className="px-4 py-2.5 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {lead.lob.map((lobItem, index) => (
                                <span key={index} className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLobBadgeColor(lobItem)}`}>
                                  {lobItem.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </td>
                        );
                      case 'route':
                        return (
                          <td key={column.key} className="px-4 py-2.5 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.origin} → {lead.destination}</div>
                            <div className="text-xs text-gray-500">{lead.movement_type.replace('_', ' ')}</div>
                          </td>
                        );
                      case 'status':
                        return (
                          <td key={column.key} className="px-4 py-2.5 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                        );
                      case 'priority':
                        return (
                          <td key={column.key} className="px-4 py-2.5 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(lead.priority)}`}>
                              {lead.priority}
                            </span>
                          </td>
                        );
                      case 'assigned_to':
                        return (
                          <td key={column.key} className="px-4 py-2.5 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-surface-tile rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-brand-600" />
                              </div>
                              <span className="text-sm text-gray-900">{lead.assigned_to}</span>
                            </div>
                          </td>
                        );
                      case 'estimated_value':
                        return (
                          <td key={column.key} className="px-4 py-2.5 whitespace-nowrap">
                            {lead.estimated_value && (
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">
                                  {formatCurrency(lead.estimated_value, lead.currency || 'USD')}
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      case 'created_at':
                        return (
                          <td key={column.key} className="px-4 py-2.5 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{lead.created_at}</span>
                            </div>
                          </td>
                        );
                      default:
                        return null;
                    }
                  })}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowDetailModal(true);
                      }}
                      className="text-brand-600 hover:text-navy-900 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-line">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredLeads.length} of {leads.length} leads
            </p>
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">‹ Previous</button>
              <span className="px-3 py-1 text-sm">Page 1 of 1</span>
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Next ›</button>
            </nav>
          </div>
        </div>
      </div>

      <ColumnCustomizer
        isOpen={showColumnCustomizer}
        onClose={() => setShowColumnCustomizer(false)}
        columns={columns}
        onColumnsChange={setColumns}
      />

      <LeadDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        lead={selectedLead}
      />
    </div>
  );
};

export default LeadList;