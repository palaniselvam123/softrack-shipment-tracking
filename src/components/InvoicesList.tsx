import React, { useState } from 'react';
import { Receipt, Download, Eye, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import InvoiceDetailModal from './InvoiceDetailModal';

interface Invoice {
  id: string;
  invoiceRef: string;
  invoiceStatus: string;
  invoiceDate: string;
  amount: number;
  currency: string;
  dueDate: string;
  shipmentRef: string;
  vendor: string;
  description: string;
  paymentTerms: string;
  createdBy: string;
  lastUpdated: string;
  pol: string;
  pod: string;
  containerNumbers: string[];
  shipper: string;
  consignee: string;
  poRefNo: string;
  vessel: string;
  voyage: string;
}

interface InvoicesListProps {
  shipmentNo: string;
}

const InvoicesList: React.FC<InvoicesListProps> = ({ shipmentNo }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceRef: 'INV-2025-001',
      invoiceStatus: 'PAID',
      invoiceDate: '10-NOV-2025',
      amount: 2450.00,
      currency: 'USD',
      dueDate: '10-DEC-2025',
      shipmentRef: shipmentNo,
      vendor: 'Maersk Line',
      description: 'Ocean freight charges for container BKSU9898988',
      paymentTerms: '30 Days',
      createdBy: 'System',
      lastUpdated: '2025-11-08 10:30',
      pol: 'INMAA (Chennai)',
      pod: 'USLAX (Los Angeles)',
      containerNumbers: ['BKSU9898988'],
      shipper: 'Textile Exports India Ltd',
      consignee: 'US Import Corp',
      poRefNo: 'PO-2025-001234',
      vessel: 'MAERSK ALABAMA',
      voyage: 'MA234E'
    },
    {
      id: '2',
      invoiceRef: 'INV-2025-002',
      invoiceStatus: 'OPEN',
      invoiceDate: '12-NOV-2025',
      amount: 1200.00,
      currency: 'USD',
      dueDate: '27-NOV-2025',
      shipmentRef: shipmentNo,
      vendor: 'US Customs',
      description: 'Import duty and taxes for shipment clearance',
      paymentTerms: '15 Days',
      createdBy: 'System',
      lastUpdated: '2025-11-12 14:15',
      pol: 'INMAA (Chennai)',
      pod: 'USLAX (Los Angeles)',
      containerNumbers: ['BKSU9898988'],
      shipper: 'Textile Exports India Ltd',
      consignee: 'US Import Corp',
      poRefNo: 'PO-2025-001234',
      vessel: 'MAERSK ALABAMA',
      voyage: 'MA234E'
    }
  ];

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'open':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices.filter(inv => inv.invoiceStatus === 'PAID').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Invoices ({invoices.length})</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
              Generate Invoice
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalAmount, 'USD')}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Paid Amount</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(paidAmount, 'USD')}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Amount</p>
                  <p className="text-lg font-semibold text-yellow-600">{formatCurrency(pendingAmount, 'USD')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleInvoiceClick(invoice)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{invoice.invoiceRef}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.invoiceStatus)}`}>
                        {invoice.invoiceStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{invoice.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Vendor: <span className="text-gray-900">{invoice.vendor}</span></p>
                        <p className="text-gray-500">Amount: <span className="text-gray-900 font-semibold">{formatCurrency(invoice.amount, invoice.currency)}</span></p>
                      </div>
                      <div>
                        <p className="text-gray-500">Invoice Date: <span className="text-gray-900">{invoice.invoiceDate}</span></p>
                        <p className="text-gray-500">Due Date: <span className="text-gray-900">{invoice.dueDate}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(invoice.invoiceStatus)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInvoiceClick(invoice);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {invoices.length === 0 && (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-500">Invoices will appear here once they are generated.</p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {invoices.length} invoices</p>
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">&#8249; Previous</button>
              <span className="px-3 py-1 text-sm">Page 1 of 1</span>
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Next &#8250;</button>
            </nav>
          </div>
        </div>
      </div>

      <InvoiceDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        invoice={selectedInvoice}
      />
    </>
  );
};

export default InvoicesList;