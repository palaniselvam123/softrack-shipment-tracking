import React, { useState } from 'react';
import { 
  Ticket, 
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
  Trash2
} from 'lucide-react';

interface TicketData {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: string;
  assignee: string;
  reporter: string;
  created: string;
  updated: string;
  dueDate: string;
  shipmentRef?: string;
  attachments: number;
  comments: number;
}

interface TicketEditorProps {
  mode: 'view' | 'edit' | 'create';
  ticket: TicketData;
  onClose: () => void;
  onSave: (ticket: TicketData) => void;
}

const TicketEditor: React.FC<TicketEditorProps> = ({ mode, ticket, onClose, onSave }) => {
  const [draft, setDraft] = useState<TicketData>(ticket);
  const readOnly = mode === 'view';
  const set = (key: keyof TicketData, value: string) =>
    setDraft(prev => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 bg-navy-950/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-card border border-surface-line shadow-pop w-full max-w-lg">
        <header className="px-4 py-3 border-b border-surface-line flex items-center justify-between">
          <h2 className="card-title">
            {mode === 'create' ? 'New Ticket' : mode === 'edit' ? 'Edit ' + draft.id : draft.id}
          </h2>
          <button onClick={onClose} className="btn-ghost px-2" aria-label="Close">×</button>
        </header>

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="field-label">Title</label>
            <input
              className="input-field"
              value={draft.title}
              readOnly={readOnly}
              onChange={e => set('title', e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea
              className="input-field h-24 resize-none"
              value={draft.description}
              readOnly={readOnly}
              onChange={e => set('description', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Priority</label>
              <select
                className="select-field"
                value={draft.priority}
                disabled={readOnly}
                onChange={e => set('priority', e.target.value)}
              >
                {['low', 'medium', 'high', 'urgent'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Status</label>
              <select
                className="select-field"
                value={draft.status}
                disabled={readOnly}
                onChange={e => set('status', e.target.value)}
              >
                {['open', 'in-progress', 'resolved', 'closed'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Category</label>
              <input
                className="input-field"
                value={draft.category}
                readOnly={readOnly}
                onChange={e => set('category', e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Assignee</label>
              <input
                className="input-field"
                value={draft.assignee}
                readOnly={readOnly}
                onChange={e => set('assignee', e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Due date</label>
              <input
                type="date"
                className="input-field"
                value={draft.dueDate}
                readOnly={readOnly}
                onChange={e => set('dueDate', e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Shipment Ref.</label>
              <input
                className="input-field"
                value={draft.shipmentRef || ''}
                readOnly={readOnly}
                onChange={e => set('shipmentRef', e.target.value)}
              />
            </div>
          </div>
        </div>

        <footer className="px-4 py-3 border-t border-surface-line flex items-center justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">
            {readOnly ? 'Close' : 'Cancel'}
          </button>
          {!readOnly && (
            <button
              onClick={() => onSave(draft)}
              disabled={!draft.title.trim()}
              className="btn-primary"
            >
              Save
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

const TicketingPortal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['TKT-2026-001', 'TKT-2026-005']));
  const [page, setPage] = useState(1);
  /* view = read-only detail, edit = existing ticket, create = blank ticket */
  const [editor, setEditor] = useState<{ mode: 'view' | 'edit' | 'create'; ticket: TicketData } | null>(null);
  const PAGE_SIZE = 5;

  const seedTickets: TicketData[] = [
    {
      id: 'TKT-2026-001',
      title: 'Container Damage Report - MEDU6997206',
      description: 'Container arrived with visible damage to the exterior. Need immediate inspection and damage assessment.',
      priority: 'high',
      status: 'open',
      category: 'Damage Claim',
      assignee: 'John Smith',
      reporter: 'Sarah Johnson',
      created: '2026-11-20 09:30',
      updated: '2026-11-20 14:45',
      dueDate: '2026-11-22',
      shipmentRef: 'MUM/SE/SHP/0001',
      attachments: 3,
      comments: 5
    },
    {
      id: 'TKT-2026-002',
      title: 'Missing Documentation - Bill of Lading',
      description: 'Original Bill of Lading not received for shipment. Customer requesting duplicate.',
      priority: 'medium',
      status: 'in-progress',
      category: 'Documentation',
      assignee: 'Mike Chen',
      reporter: 'Emma Wilson',
      created: '2026-11-19 15:20',
      updated: '2026-11-20 10:15',
      dueDate: '2026-11-23',
      shipmentRef: 'MUM/AE/SHP/0009',
      attachments: 1,
      comments: 3
    },
    {
      id: 'TKT-2026-003',
      title: 'Customs Clearance Delay',
      description: 'Shipment held at customs due to incomplete documentation. Need to provide additional certificates.',
      priority: 'urgent',
      status: 'open',
      category: 'Customs',
      assignee: 'David Brown',
      reporter: 'Lisa Garcia',
      created: '2026-11-20 11:45',
      updated: '2026-11-20 16:30',
      dueDate: '2026-11-21',
      shipmentRef: 'MUM/AI/SHP/0001',
      attachments: 2,
      comments: 8
    },
    {
      id: 'TKT-2026-004',
      title: 'Invoice Discrepancy',
      description: 'Customer reporting incorrect charges on invoice IDDEC026748. Need to review and adjust.',
      priority: 'medium',
      status: 'resolved',
      category: 'Billing',
      assignee: 'Anna Martinez',
      reporter: 'Robert Taylor',
      created: '2026-11-18 13:20',
      updated: '2026-11-19 09:45',
      dueDate: '2026-11-25',
      attachments: 4,
      comments: 6
    },
    {
      id: 'TKT-2026-005',
      title: 'Delivery Address Change Request',
      description: 'Customer requesting change of delivery address for shipment in transit. Need to coordinate with carrier.',
      priority: 'high',
      status: 'in-progress',
      category: 'Delivery',
      assignee: 'James Anderson',
      reporter: 'Maria Rodriguez',
      created: '2026-11-19 08:15',
      updated: '2026-11-20 12:30',
      dueDate: '2026-11-22',
      shipmentRef: 'MUM/SE/SHP/0020',
      attachments: 0,
      comments: 4
    },
    {
      id: 'TKT-2026-006',
      title: 'System Access Issue',
      description: 'User unable to access tracking portal. Password reset not working.',
      priority: 'low',
      status: 'closed',
      category: 'Technical',
      assignee: 'Kevin Lee',
      reporter: 'Jennifer White',
      created: '2026-11-17 16:45',
      updated: '2026-11-18 14:20',
      dueDate: '2026-11-24',
      attachments: 1,
      comments: 2
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-surface-tile text-brand-700';
      case 'in-progress':
        return 'bg-amber-50 text-amber-700';
      case 'resolved':
        return 'bg-green-50 text-green-700';
      case 'closed':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="w-4 h-4 text-brand-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Ticket className="w-4 h-4 text-gray-600" />;
    }
  };

  const toggleFavorite = (ticketId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(ticketId)) {
      newFavorites.delete(ticketId);
    } else {
      newFavorites.add(ticketId);
    }
    setFavorites(newFavorites);
  };

  const [tickets, setTickets] = useState<TicketData[]>(seedTickets);

  const blankTicket = (): TicketData => ({
    id: 'TKT-' + new Date().getFullYear() + '-' + String(tickets.length + 1).padStart(3, '0'),
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    category: 'General',
    assignee: '',
    reporter: '',
    created: new Date().toISOString().slice(0, 16).replace('T', ' '),
    updated: new Date().toISOString().slice(0, 16).replace('T', ' '),
    dueDate: '',
    attachments: 0,
    comments: 0
  });

  const saveTicket = (ticket: TicketData) => {
    setTickets(prev =>
      prev.some(t => t.id === ticket.id)
        ? prev.map(t => (t.id === ticket.id ? { ...ticket, updated: new Date().toISOString().slice(0, 16).replace('T', ' ') } : t))
        : [ticket, ...prev]
    );
    setEditor(null);
  };

  const deleteTicket = (id: string) => {
    if (!window.confirm('Delete ticket ' + id + '? This cannot be undone.')) return;
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = Object.values(ticket).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = !selectedStatus || ticket.status === selectedStatus;
    const matchesPriority = !selectedPriority || ticket.priority === selectedPriority;
    const matchesCategory = !selectedCategory || ticket.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedTickets = filteredTickets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const categories = [...new Set(tickets.map(ticket => ticket.category))];
  const statuses = ['open', 'in-progress', 'resolved', 'closed'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  return (
    <div className="page">
      <div className="card">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-line">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title">Ticketing Portal</h1>
              <p className="text-field text-gray-500 mt-0.5">Manage support tickets and customer issues</p>
            </div>
            <button
              onClick={() => setEditor({ mode: 'create', ticket: blankTicket() })}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-surface-line">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tickets..."
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

            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-surface-tile rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                >
                  <option value="">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select 
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                >
                  <option value="">All Priorities</option>
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    setSelectedStatus('');
                    setSelectedPriority('');
                    setSelectedCategory('');
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

        {/* Tickets List */}
        <div className="divide-y divide-surface-soft">
          {pagedTickets.map((ticket) => (
            <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <button
                    onClick={() => toggleFavorite(ticket.id)}
                    className="text-gray-400 hover:text-amber-500 transition-colors mt-1"
                  >
                    <Star 
                      className={`w-4 h-4 ${
                        favorites.has(ticket.id) 
                          ? 'fill-yellow-400 text-amber-400' 
                          : ''
                      }`} 
                    />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(ticket.status)}
                      <h3 className="text-lg font-medium text-gray-900">{ticket.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">ID:</span>
                          <span className="font-mono text-brand-600">{ticket.id}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">Category:</span>
                          <span className="text-gray-900">{ticket.category}</span>
                        </div>
                        {ticket.shipmentRef && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">Shipment:</span>
                            <span className="text-brand-600 font-medium">{ticket.shipmentRef}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-500">Assigned to:</span>
                          <span className="text-gray-900">{ticket.assignee}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-500">Due:</span>
                          <span className="text-gray-900">{ticket.dueDate}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          {ticket.attachments > 0 && (
                            <div className="flex items-center space-x-1">
                              <Paperclip className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{ticket.attachments}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{ticket.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setEditor({ mode: 'view', ticket })}
                    aria-label={'View ' + ticket.id}
                    className="p-2 text-gray-400 hover:text-navy-900 hover:bg-surface-head rounded-md transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditor({ mode: 'edit', ticket })}
                    aria-label={'Edit ' + ticket.id}
                    className="p-2 text-gray-400 hover:text-navy-900 hover:bg-surface-head rounded-md transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTicket(ticket.id)}
                    aria-label={'Delete ' + ticket.id}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editor && (
          <TicketEditor
            mode={editor.mode}
            ticket={editor.ticket}
            onClose={() => setEditor(null)}
            onSave={saveTicket}
          />
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-line">
          <div className="flex items-center justify-between">
            <p className="text-field text-gray-500">
              Showing {pagedTickets.length} of {filteredTickets.length} tickets
            </p>
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="btn-secondary px-3 py-1"
              >
                Previous
              </button>
              <span className="text-field text-gray-600">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="btn-secondary px-3 py-1"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketingPortal;