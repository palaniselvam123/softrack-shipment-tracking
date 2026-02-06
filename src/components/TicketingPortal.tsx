import React, { useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  Settings, 
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

const TicketingPortal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['TKT-2026-001', 'TKT-2026-005']));

  const tickets: TicketData[] = [
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
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = Object.values(ticket).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = !selectedStatus || ticket.status === selectedStatus;
    const matchesPriority = !selectedPriority || ticket.priority === selectedPriority;
    const matchesCategory = !selectedCategory || ticket.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const categories = [...new Set(tickets.map(ticket => ticket.category))];
  const statuses = ['open', 'in-progress', 'resolved', 'closed'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Ticketing Portal</h1>
              <p className="text-sm text-gray-600 mt-1">Manage support tickets and customer issues</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-md transition-colors ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tickets List */}
        <div className="divide-y divide-gray-200">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <button
                    onClick={() => toggleFavorite(ticket.id)}
                    className="text-gray-400 hover:text-yellow-500 transition-colors mt-1"
                  >
                    <Star 
                      className={`w-4 h-4 ${
                        favorites.has(ticket.id) 
                          ? 'fill-yellow-400 text-yellow-400' 
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
                          <span className="font-mono text-blue-600">{ticket.id}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">Category:</span>
                          <span className="text-gray-900">{ticket.category}</span>
                        </div>
                        {ticket.shipmentRef && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">Shipment:</span>
                            <span className="text-blue-600 font-medium">{ticket.shipmentRef}</span>
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
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {filteredTickets.length} of {tickets.length} tickets</p>
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">‹ Previous</button>
              <span className="px-3 py-1 text-sm">Page 1 of 1</span>
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Next ›</button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketingPortal;