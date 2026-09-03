import React from 'react';
import { FileText, Download, Eye, Calendar, User } from 'lucide-react';

interface DocumentsListProps {
  shipmentNo: string;
}

const DocumentsList: React.FC<DocumentsListProps> = ({ shipmentNo }) => {
  const documents = [
    {
      id: 1,
      name: 'Bill of Lading',
      type: 'BOL',
      size: '2.4 MB',
      uploadedBy: 'John Smith',
      uploadedDate: '2026-11-15',
      status: 'Approved',
      description: 'Original Bill of Lading for container BKSU9898988'
    },
    {
      id: 2,
      name: 'Commercial Invoice',
      type: 'INV',
      size: '1.8 MB',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '2026-11-14',
      status: 'Pending Review',
      description: 'Commercial invoice for shipment value $45,230.00'
    },
    {
      id: 3,
      name: 'Packing List',
      type: 'PKL',
      size: '956 KB',
      uploadedBy: 'Mike Chen',
      uploadedDate: '2026-11-14',
      status: 'Approved',
      description: 'Detailed packing list with 260 packages'
    },
    {
      id: 4,
      name: 'Certificate of Origin',
      type: 'COO',
      size: '1.2 MB',
      uploadedBy: 'Emma Wilson',
      uploadedDate: '2026-11-13',
      status: 'Approved',
      description: 'Certificate of Origin - Made in India'
    },
    {
      id: 5,
      name: 'Insurance Certificate',
      type: 'INS',
      size: '2.1 MB',
      uploadedBy: 'David Brown',
      uploadedDate: '2026-11-13',
      status: 'Approved',
      description: 'Marine cargo insurance certificate'
    },
    {
      id: 6,
      name: 'Export License',
      type: 'EXP',
      size: '1.5 MB',
      uploadedBy: 'Lisa Garcia',
      uploadedDate: '2026-11-12',
      status: 'Approved',
      description: 'Export license for restricted goods'
    },
    {
      id: 7,
      name: 'Customs Declaration',
      type: 'CUS',
      size: '3.2 MB',
      uploadedBy: 'Robert Taylor',
      uploadedDate: '2026-11-12',
      status: 'Processing',
      description: 'Customs declaration form with duty calculations'
    },
    {
      id: 8,
      name: 'Shipping Instructions',
      type: 'SHI',
      size: '890 KB',
      uploadedBy: 'Anna Martinez',
      uploadedDate: '2026-11-11',
      status: 'Approved',
      description: 'Detailed shipping instructions for carrier'
    },
    {
      id: 9,
      name: 'Freight Invoice',
      type: 'FRT',
      size: '1.3 MB',
      uploadedBy: 'James Anderson',
      uploadedDate: '2026-11-11',
      status: 'Paid',
      description: 'Freight charges invoice from Maersk Line'
    },
    {
      id: 10,
      name: 'Delivery Receipt',
      type: 'DEL',
      size: '756 KB',
      uploadedBy: 'Maria Rodriguez',
      uploadedDate: '2026-11-10',
      status: 'Pending',
      description: 'Delivery receipt at destination port'
    },
    {
      id: 11,
      name: 'Quality Certificate',
      type: 'QUA',
      size: '2.8 MB',
      uploadedBy: 'Kevin Lee',
      uploadedDate: '2026-11-10',
      status: 'Approved',
      description: 'Quality inspection certificate'
    },
    {
      id: 12,
      name: 'Phytosanitary Certificate',
      type: 'PHY',
      size: '1.7 MB',
      uploadedBy: 'Jennifer White',
      uploadedDate: '2026-11-09',
      status: 'Approved',
      description: 'Plant health certificate for agricultural products'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-50 text-green-700';
      case 'pending review':
      case 'pending':
        return 'bg-amber-50 text-amber-700';
      case 'processing':
        return 'bg-surface-tile text-brand-700';
      case 'paid':
        return 'bg-surface-tile text-navy-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'BOL': 'bg-surface-tile text-brand-700',
      'INV': 'bg-green-50 text-green-700',
      'PKL': 'bg-amber-50 text-amber-700',
      'COO': 'bg-surface-tile text-navy-700',
      'INS': 'bg-red-50 text-red-700',
      'EXP': 'bg-surface-tile text-navy-700',
      'CUS': 'bg-amber-50 text-amber-700',
      'SHI': 'bg-surface-tile text-navy-700',
      'FRT': 'bg-surface-tile text-navy-700',
      'DEL': 'bg-surface-tile text-navy-700',
      'QUA': 'bg-lime-100 text-lime-800',
      'PHY': 'bg-surface-tile text-navy-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-surface-line">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-navy-900">Documents ({documents.length})</h2>
          <button className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors text-sm">
            Upload Document
          </button>
        </div>
      </div>

      <div className="divide-y divide-surface-soft">
        {documents.map((doc) => (
          <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-surface-tile rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-brand-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{doc.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(doc.type)}`}>
                      {doc.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{doc.uploadedBy}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{doc.uploadedDate}</span>
                    </div>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-surface-tile rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-surface-line">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {documents.length} documents</p>
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">‹ Previous</button>
            <span className="px-3 py-1 text-sm">Page 1 of 1</span>
            <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Next ›</button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DocumentsList;