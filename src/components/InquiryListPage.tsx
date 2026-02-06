import React, { useState } from 'react';
import { Search, Download, Filter, Settings, Plus, Eye, Edit, Calendar, User, Package, MapPin } from 'lucide-react';
import ColumnCustomizer from './ColumnCustomizer';
import InquiryForm from './InquiryForm';

interface Inquiry {
  id: string;
  inquiry_id: string;
  customer_id: string;
  customer_name: string;
  company_name: string;
  lob: string[];
  status: 'New' | 'Submitted' | 'Under Review' | 'Quoted' | 'Accepted' | 'Rejected';
  created_at: string;
  updated_at: string;
  movement_type: string;
  origin: string;
  destination: string;
  contact_email: string;
  contact_phone: string;
}

interface Column {
  key: string;
  label: string;
  visible: boolean;
  width?: string;
}

const InquiryListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const [columns, setColumns] = useState<Column[]>([
    { key: 'inquiry_id', label: 'Inquiry ID', visible: true },
    { key: 'customer', label: 'Customer', visible: true },
    { key: 'lob', label: 'LOB', visible: true },
    { key: 'route', label: 'Route', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'movement_type', label: 'Movement Type', visible: true },
    { key: 'contact', label: 'Contact', visible: true },
    { key: 'created_at', label: 'Created', visible: true },
    { key: 'updated_at', label: 'Updated', visible: true }
  ]);

  const mockInquiries: Inquiry[] = [
    {
      id: '1',
      inquiry_id: 'IQ-000123',
      customer_id: 'CUST-001',
      customer_name: 'ACME Exports',
      company_name: 'ACME Group',
      lob: ['SEA_FCL'],
      status: 'Quoted',
      created_at: '2025-11-20',
      updated_at: '2025-11-21',
      movement_type: 'PORT_TO_CFS',
      origin: 'Mumbai, IN',
      destination: 'Singapore, SG',
      contact_email: 'john@acme.com',
      contact_phone: '+91-98765-43210'
    },
    {
      id: '2',
      inquiry_id: 'IQ-000124',
      customer_id: 'CUST-002',
      customer_name: 'Global Trading Co',
      company_name: 'Global Trading International',
      lob: ['AIR_FREIGHT'],
      status: 'New',
      created_at: '2025-11-21',
      updated_at: '2025-11-21',
      movement_type: 'DOOR_TO_DOOR',
      origin: 'Delhi, IN',
      destination: 'New York, US',
      contact_email: 'contact@global.com',
      contact_phone: '+91-98765-12345'
    },
    {
      id: '3',
      inquiry_id: 'IQ-000125',
      customer_id: 'CUST-003',
      customer_name: 'Tech Solutions Ltd',
      company_name: 'Tech Solutions Private Limited',
      lob: ['SEA_LCL', 'AIR_FREIGHT'],
      status: 'Under Review',
      created_at: '2025-11-19',
      updated_at: '2025-11-20',
      movement_type: 'PORT_TO_PORT',
      origin: 'Chennai, IN',
      destination: 'Hamburg, DE',
      contact_email: 'info@techsolutions.com',
      contact_phone: '+91-98765-67890'
    },
    {
      id: '4',
      inquiry_id: 'IQ-000126',
      customer_id: 'CUST-004',
      customer_name: 'Fashion Retail Inc',
      company_name: 'Fashion Retail International',
      lob: ['SEA_FCL'],
      status: 'Accepted',
      created_at: '2025-11-18',
      updated_at: '2025-11-22',
      movement_type: 'DOOR_TO_PORT',
      origin: 'Bangalore, IN',
      destination: 'Los Angeles, US',
      contact_email: 'orders@fashionretail.com',
      contact_phone: '+91-98765-11111'
    },
    {
      id: '5',
      inquiry_id: 'IQ-000127',
      customer_id: 'CUST-005',
      customer_name: 'Automotive Parts Co',
      company_name: 'Automotive Parts Manufacturing',
      lob: ['ROAD_TRANSPORT'],
      status: 'Rejected',
      created_at: '2025-11-15',
      updated_at: '2025-11-20',
      movement_type: 'DOOR_TO_DOOR',
      origin: 'Pune, IN',
      destination: 'Delhi, IN',
      contact_email: 'logistics@autoparts.com',
      contact_phone: '+91-98765-22222'
    },
    {
      id: '6',
      inquiry_id: 'IQ-000128',
      customer_id: 'CUST-006',
      customer_name: 'Electronics Hub',
      company_name: 'Electronics Hub Pvt Ltd',
      lob: ['AIR_FREIGHT'],
      status: 'Submitted',
      created_at: '2025-11-22',
      updated_at: '2025-11-22',
      movement_type: 'PORT_TO_PORT',
      origin: 'Mumbai, IN',
      destination: 'Dubai, AE',
      contact_email: 'sales@electronichub.com',
      contact_phone: '+91-98765-33333'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Submitted':
        return 'bg-cyan-100 text-cyan-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Quoted':
        return 'bg-purple-100 text-purple-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLobBadgeColor = (lob: string) => {
    switch (lob) {
      case 'SEA_FCL':
        return 'bg-blue-100 text-blue-800';
      case 'SEA_LCL':
        return 'bg-cyan-100 text-cyan-800';
      case 'AIR_FREIGHT':
        return 'bg-pink-100 text-pink-800';
      case 'ROAD_TRANSPORT':
        return 'bg-green-100 text-green-800';
      case 'LIQUID':
        return 'bg-teal-100 text-teal-800';
      case 'RAIL':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInquiries = mockInquiries.filter(inquiry => {
    const matchesSearch = Object.values(inquiry).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = !statusFilter || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const downloadExcel = () => {
    const headers = [
      'Inquiry ID', 'Customer', 'Company', 'LOB', 'Status', 'Movement Type',
      'Origin', 'Destination', 'Contact Email', 'Contact Phone', 'Created', 'Updated'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredInquiries.map(inquiry => [
        inquiry.inquiry_id,
        inquiry.customer_name,
        inquiry.company_name,
        inquiry.lob.join(';'),
        inquiry.status,
        inquiry.movement_type,
        inquiry.origin,
        inquiry.destination,
        inquiry.contact_email,
        inquiry.contact_phone,
        inquiry.created_at,
        inquiry.updated_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusCounts = {
    total: mockInquiries.length,
    new: mockInquiries.filter(i => i.status === 'New').length,
    submitted: mockInquiries.filter(i => i.status === 'Submitted').length,
    quoted: mockInquiries.filter(i => i.status === 'Quoted').length,
    accepted: mockInquiries.filter(i => i.status === 'Accepted').length
  };

  if (showInquiryForm) {
    return (
      <InquiryForm
        onBack={() => {
          setShowInquiryForm(false);
          setSelectedInquiry(null);
        }}
        onSubmit={(inquiryId) => {
          setShowInquiryForm(false);
          setSelectedInquiry(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Inquiry Management</h1>
              <p className="text-sm text-gray-600 mt-1">View and manage customer inquiries</p>
            </div>
            <button
              onClick={() => setShowInquiryForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Inquiry</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-semibold text-gray-900">{statusCounts.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">New</p>
                  <p className="text-xl font-semibold text-blue-600">{statusCounts.new}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="text-xl font-semibold text-cyan-600">{statusCounts.submitted}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quoted</p>
                  <p className="text-xl font-semibold text-purple-600">{statusCounts.quoted}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Accepted</p>
                  <p className="text-xl font-semibold text-green-600">{statusCounts.accepted}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={downloadExcel}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-md transition-colors ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={() => setShowColumnCustomizer(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="New">New</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="flex items-end col-span-2">
                <button
                  onClick={() => {
                    setStatusFilter('');
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.filter(col => col.visible).map((column) => (
                  <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                  {columns.filter(col => col.visible).map((column) => {
                    switch (column.key) {
                      case 'inquiry_id':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Package className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-600">{inquiry.inquiry_id}</span>
                            </div>
                          </td>
                        );
                      case 'customer':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{inquiry.customer_name}</div>
                                <div className="text-xs text-gray-500">{inquiry.company_name}</div>
                              </div>
                            </div>
                          </td>
                        );
                      case 'lob':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {inquiry.lob.map((lobItem, index) => (
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
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-900">{inquiry.origin} → {inquiry.destination}</div>
                              </div>
                            </div>
                          </td>
                        );
                      case 'status':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
                              {inquiry.status}
                            </span>
                          </td>
                        );
                      case 'movement_type':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{inquiry.movement_type.replace('_', ' ')}</span>
                          </td>
                        );
                      case 'contact':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900">{inquiry.contact_email}</div>
                              <div className="text-xs text-gray-500">{inquiry.contact_phone}</div>
                            </div>
                          </td>
                        );
                      case 'created_at':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{inquiry.created_at}</span>
                            </div>
                          </td>
                        );
                      case 'updated_at':
                        return (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{inquiry.updated_at}</span>
                            </div>
                          </td>
                        );
                      default:
                        return null;
                    }
                  })}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          console.log('View inquiry:', inquiry.inquiry_id);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setShowInquiryForm(true);
                        }}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Edit Inquiry"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredInquiries.length} of {mockInquiries.length} inquiries
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
    </div>
  );
};

export default InquiryListPage;
