import React, { useState } from 'react';
import { Search, Filter, Eye, User, Building, Calendar, Package, DollarSign, Star, Settings, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
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

interface LeadListProps {
  onBack: () => void;
}

type SortDirection = 'asc' | 'desc';

const LeadList: React.FC<LeadListProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

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
      created_at: '2025-11-20',
      updated_at: '2025-11-21',
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
      created_at: '2025-11-21',
      updated_at: '2025-11-21',
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
      created_at: '2025-11-19',
      updated_at: '2025-11-20',
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
      created_at: '2025-11-18',
      updated_at: '2025-11-22',
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
      created_at: '2025-11-15',
      updated_at: '2025-11-20',
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
        return 'bg-sky-100 text-sky-700';
      case 'Attended':
        return 'bg-amber-100 text-amber-700';
      case 'Quoted':
        return 'bg-blue-100 text-blue-700';
      case 'Quote Accepted':
        return 'bg-emerald-100 text-emerald-700';
      case 'Closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-amber-100 text-amber-700';
      case 'Low':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getLobBadgeColor = (lob: string) => {
    switch (lob) {
      case 'SEA_FCL':
        return 'bg-blue-100 text-blue-700';
      case 'SEA_LCL':
        return 'bg-cyan-100 text-cyan-700';
      case 'AIR_FREIGHT':
        return 'bg-rose-100 text-rose-700';
      case 'ROAD_TRANSPORT':
        return 'bg-emerald-100 text-emerald-700';
      case 'LIQUID':
        return 'bg-teal-100 text-teal-700';
      case 'RAIL':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronUp className="w-3 h-3 text-gray-300 ml-1" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-sky-600 ml-1" />
      : <ChevronDown className="w-3 h-3 text-sky-600 ml-1" />;
  };

  const getSortValue = (lead: Lead, key: string): string => {
    switch (key) {
      case 'customer': return lead.customer_name;
      case 'route': return `${lead.origin} ${lead.destination}`;
      case 'lob': return lead.lob.join(',');
      case 'estimated_value': return String(lead.estimated_value ?? 0);
      default: return String((lead as Record<string, unknown>)[key] ?? '');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = Object.values(lead).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesPriority = !priorityFilter || lead.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedLeads = sortKey
    ? [...filteredLeads].sort((a, b) => {
        const aVal = getSortValue(a, sortKey);
        const bVal = getSortValue(b, sortKey);
        const numA = parseFloat(aVal);
        const numB = parseFloat(bVal);
        const cmp = !isNaN(numA) && !isNaN(numB)
          ? numA - numB
          : aVal.localeCompare(bVal);
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filteredLeads;

  const statusCounts = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    attended: leads.filter(l => l.status === 'Attended').length,
    quoted: leads.filter(l => l.status === 'Quoted').length,
    accepted: leads.filter(l => l.status === 'Quote Accepted').length
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" /><span>Back</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage leads generated from customer inquiries</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Sales View</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total Leads', value: statusCounts.total, icon: Package, bg: 'bg-gray-100', iconColor: 'text-gray-600', valueColor: 'text-gray-900' },
              { label: 'New', value: statusCounts.new, icon: Star, bg: 'bg-sky-100', iconColor: 'text-sky-600', valueColor: 'text-sky-600' },
              { label: 'Attended', value: statusCounts.attended, icon: Eye, bg: 'bg-amber-100', iconColor: 'text-amber-600', valueColor: 'text-amber-600' },
              { label: 'Quoted', value: statusCounts.quoted, icon: DollarSign, bg: 'bg-blue-100', iconColor: 'text-sky-600', valueColor: 'text-sky-600' },
              { label: 'Accepted', value: statusCounts.accepted, icon: DollarSign, bg: 'bg-emerald-100', iconColor: 'text-emerald-600', valueColor: 'text-emerald-600' },
            ].map(({ label, value, icon: Icon, bg, iconColor, valueColor }) => (
              <div key={label} className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                    <p className={`text-lg font-bold ${valueColor}`}>{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-md transition-colors ${
                  showFilters ? 'bg-sky-50 border-sky-300 text-sky-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={() => setShowColumnCustomizer(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Customize Columns</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
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
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
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
            <thead className="bg-gray-50">
              <tr>
                {columns.filter(col => col.visible).map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center">
                      {column.label}
                      <SortIcon colKey={column.key} />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  {columns.filter(col => col.visible).map((column) => {
                    switch (column.key) {
                      case 'lead_id':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Package className="w-4 h-4 text-sky-600" />
                              <span className="text-sm font-medium text-sky-600">{lead.lead_id}</span>
                            </div>
                            <div className="text-xs text-gray-500">Inquiry: {lead.inquiry_id}</div>
                          </td>
                        );
                      case 'customer':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
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
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
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
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.origin} → {lead.destination}</div>
                            <div className="text-xs text-gray-500">{lead.movement_type.replace('_', ' ')}</div>
                          </td>
                        );
                      case 'status':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                        );
                      case 'priority':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(lead.priority)}`}>
                              {lead.priority}
                            </span>
                          </td>
                        );
                      case 'assigned_to':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-sky-600" />
                              </div>
                              <span className="text-sm text-gray-900">{lead.assigned_to}</span>
                            </div>
                          </td>
                        );
                      case 'estimated_value':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
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
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowDetailModal(true);
                      }}
                      className="text-sky-600 hover:text-blue-800 transition-colors"
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
        <div className="px-6 py-4 border-t border-gray-200">
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