import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Paperclip,
  Calendar,
  Star,
  Eye,
  Edit,
  Trash2,
  X,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft
} from 'lucide-react';
import TicketDetailModal, { type TicketData } from './TicketDetailModal';

const INITIAL_TICKETS: TicketData[] = [
  {
    id: 'TKT-2025-001',
    title: 'Container Damage Report - MEDU6997206',
    description: 'Container arrived with visible damage to the exterior. Need immediate inspection and damage assessment.',
    priority: 'high',
    status: 'open',
    category: 'Damage Claim',
    assignee: 'John Smith',
    reporter: 'Sarah Johnson',
    created: '2025-11-20 09:30',
    updated: '2025-11-20 14:45',
    dueDate: '2025-11-22',
    shipmentRef: 'MUM/SE/SHP/0001',
    attachments: 3,
    comments: 5
  },
  {
    id: 'TKT-2025-002',
    title: 'Missing Documentation - Bill of Lading',
    description: 'Original Bill of Lading not received for shipment. Customer requesting duplicate.',
    priority: 'medium',
    status: 'in-progress',
    category: 'Documentation',
    assignee: 'Mike Chen',
    reporter: 'Emma Wilson',
    created: '2025-11-19 15:20',
    updated: '2025-11-20 10:15',
    dueDate: '2025-11-23',
    shipmentRef: 'MUM/AE/SHP/0009',
    attachments: 1,
    comments: 3
  },
  {
    id: 'TKT-2025-003',
    title: 'Customs Clearance Delay',
    description: 'Shipment held at customs due to incomplete documentation. Need to provide additional certificates.',
    priority: 'urgent',
    status: 'open',
    category: 'Customs',
    assignee: 'David Brown',
    reporter: 'Lisa Garcia',
    created: '2025-11-20 11:45',
    updated: '2025-11-20 16:30',
    dueDate: '2025-11-21',
    shipmentRef: 'MUM/AI/SHP/0001',
    attachments: 2,
    comments: 8
  },
  {
    id: 'TKT-2025-004',
    title: 'Invoice Discrepancy',
    description: 'Customer reporting incorrect charges on invoice IDDEC026748. Need to review and adjust.',
    priority: 'medium',
    status: 'resolved',
    category: 'Billing',
    assignee: 'Anna Martinez',
    reporter: 'Robert Taylor',
    created: '2025-11-18 13:20',
    updated: '2025-11-19 09:45',
    dueDate: '2025-11-25',
    attachments: 4,
    comments: 6
  },
  {
    id: 'TKT-2025-005',
    title: 'Delivery Address Change Request',
    description: 'Customer requesting change of delivery address for shipment in transit. Need to coordinate with carrier.',
    priority: 'high',
    status: 'in-progress',
    category: 'Delivery',
    assignee: 'James Anderson',
    reporter: 'Maria Rodriguez',
    created: '2025-11-19 08:15',
    updated: '2025-11-20 12:30',
    dueDate: '2025-11-22',
    shipmentRef: 'MUM/SE/SHP/0020',
    attachments: 0,
    comments: 4
  },
  {
    id: 'TKT-2025-006',
    title: 'System Access Issue',
    description: 'User unable to access tracking portal. Password reset not working.',
    priority: 'low',
    status: 'closed',
    category: 'Technical',
    assignee: 'Kevin Lee',
    reporter: 'Jennifer White',
    created: '2025-11-17 16:45',
    updated: '2025-11-18 14:20',
    dueDate: '2025-11-24',
    attachments: 1,
    comments: 2
  }
];

const CATEGORY_OPTIONS = ['Damage Claim', 'Documentation', 'Customs', 'Billing', 'Delivery', 'Technical', 'General'];
const ASSIGNEE_OPTIONS = ['John Smith', 'Mike Chen', 'David Brown', 'Anna Martinez', 'James Anderson', 'Kevin Lee', 'Sarah Johnson'];

interface TicketingPortalProps {
  onBack: () => void;
}

const TicketingPortal: React.FC<TicketingPortalProps> = ({ onBack }) => {
  const [tickets, setTickets] = useState<TicketData[]>(INITIAL_TICKETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['TKT-2025-001', 'TKT-2025-005']));
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [ticketCounter, setTicketCounter] = useState(7);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium' as TicketData['priority'],
    category: 'General',
    assignee: 'John Smith',
    dueDate: '',
    shipmentRef: ''
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-amber-100 text-amber-800';
      case 'resolved': return 'bg-emerald-100 text-emerald-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-amber-600" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'closed': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const toggleFavorite = (e: React.MouseEvent, ticketId: string) => {
    e.stopPropagation();
    const next = new Set(favorites);
    if (next.has(ticketId)) next.delete(ticketId);
    else next.add(ticketId);
    setFavorites(next);
  };

  const handleCreateTicket = () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) return;

    const now = new Date().toLocaleString('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });

    const ticket: TicketData = {
      id: `TKT-2025-${String(ticketCounter).padStart(3, '0')}`,
      title: newTicket.title,
      description: newTicket.description,
      priority: newTicket.priority,
      status: 'open',
      category: newTicket.category,
      assignee: newTicket.assignee,
      reporter: 'You',
      created: now,
      updated: now,
      dueDate: newTicket.dueDate || '2025-12-01',
      shipmentRef: newTicket.shipmentRef || undefined,
      attachments: 0,
      comments: 0
    };

    setTickets(prev => [ticket, ...prev]);
    setTicketCounter(prev => prev + 1);
    setShowCreateForm(false);
    setNewTicket({ title: '', description: '', priority: 'medium', category: 'General', assignee: 'John Smith', dueDate: '', shipmentRef: '' });
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    setShowDeleteConfirm(null);
    favorites.delete(id);
    setFavorites(new Set(favorites));
  };

  const handleUpdateTicket = (updated: TicketData) => {
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelectedTicket(updated);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchTerm || Object.values(ticket).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = !selectedStatus || ticket.status === selectedStatus;
    const matchesPriority = !selectedPriority || ticket.priority === selectedPriority;
    const matchesCategory = !selectedCategory || ticket.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const categories = [...new Set(tickets.map(t => t.category))];
  const statuses = ['open', 'in-progress', 'resolved', 'closed'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  const statusCounts = {
    open: tickets.filter(t => t.status === 'open').length,
    'in-progress': tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length
  };

  const activeFilters = [selectedStatus, selectedPriority, selectedCategory].filter(Boolean).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Open', count: statusCounts.open, color: 'blue', icon: AlertTriangle },
          { label: 'In Progress', count: statusCounts['in-progress'], color: 'amber', icon: Clock },
          { label: 'Resolved', count: statusCounts.resolved, color: 'emerald', icon: CheckCircle },
          { label: 'Closed', count: statusCounts.closed, color: 'gray', icon: CheckCircle }
        ].map(({ label, count, color, icon: Icon }) => (
          <button
            key={label}
            onClick={() => {
              const val = label.toLowerCase().replace(' ', '-');
              setSelectedStatus(selectedStatus === val ? '' : val);
            }}
            className={`bg-white rounded-xl border p-4 transition-all hover:shadow-md ${
              selectedStatus === label.toLowerCase().replace(' ', '-') ? 'border-blue-300 shadow-md ring-1 ring-blue-100' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{count}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-left">{label} Tickets</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Support Tickets</h1>
              <p className="text-sm text-gray-500 mt-0.5">{filteredTickets.length} of {tickets.length} tickets</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tickets by ID, title, assignee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
                showFilters || activeFilters > 0 ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFilters > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
            {activeFilters > 0 && (
              <button
                onClick={() => { setSelectedStatus(''); setSelectedPriority(''); setSelectedCategory(''); }}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priorities</option>
                  {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="divide-y divide-gray-100">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-16">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No tickets match your filters</p>
              <button
                onClick={() => { setSelectedStatus(''); setSelectedPriority(''); setSelectedCategory(''); setSearchTerm(''); }}
                className="mt-2 text-blue-600 text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <button
                    onClick={(e) => toggleFavorite(e, ticket.id)}
                    className="mt-0.5 text-gray-300 hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${favorites.has(ticket.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(ticket.status)}
                      <span className="font-mono text-xs text-blue-600">{ticket.id}</span>
                      <h3 className="text-sm font-medium text-gray-900 truncate">{ticket.title}</h3>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-1 mb-2 ml-6">{ticket.description}</p>

                    <div className="flex items-center flex-wrap gap-2 ml-6">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('-', ' ')}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-600">
                        {ticket.category}
                      </span>

                      <span className="text-gray-300">|</span>

                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{ticket.assignee}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Due {ticket.dueDate}</span>
                      </div>

                      {ticket.shipmentRef && (
                        <span className="text-xs text-blue-600 font-medium">{ticket.shipmentRef}</span>
                      )}

                      <span className="text-gray-300">|</span>

                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        {ticket.attachments > 0 && (
                          <div className="flex items-center space-x-0.5">
                            <Paperclip className="w-3 h-3" />
                            <span>{ticket.attachments}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-0.5">
                          <MessageCircle className="w-3 h-3" />
                          <span>{ticket.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(ticket.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50/50">
          <p className="text-xs text-gray-500">
            Showing {filteredTickets.length} of {tickets.length} tickets
            {activeFilters > 0 && ` (${activeFilters} filter${activeFilters > 1 ? 's' : ''} applied)`}
          </p>
        </div>
      </div>

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdateTicket={handleUpdateTicket}
        />
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-12 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create New Ticket</h2>
              <button onClick={() => setShowCreateForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief summary of the issue"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the issue..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as TicketData['priority'] }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                  <select
                    value={newTicket.assignee}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, assignee: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {ASSIGNEE_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTicket.dueDate}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipment Reference (optional)</label>
                <input
                  type="text"
                  value={newTicket.shipmentRef}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, shipmentRef: e.target.value }))}
                  placeholder="e.g. MUM/SE/SHP/0001"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={!newTicket.title.trim() || !newTicket.description.trim()}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  newTicket.title.trim() && newTicket.description.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Ticket</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete ticket <span className="font-mono font-medium text-blue-600">{showDeleteConfirm}</span>?
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTicket(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketingPortal;
