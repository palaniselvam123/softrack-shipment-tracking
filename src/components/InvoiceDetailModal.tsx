import React from 'react';
import { X, Download, Mail, Copy, Calendar, DollarSign, FileText, User, Building, Clock, AlertTriangle, MapPin, Package, Ship, Anchor } from 'lucide-react';

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

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'disputed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadPDF = () => {
    // Generate and download PDF
    const pdfContent = `Invoice ${invoice.invoiceRef} - ${formatCurrency(invoice.amount, invoice.currency)} ${invoice.currency}`;
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice_${invoice.invoiceRef}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSendMail = () => {
    // Open email client with pre-filled content
    const subject = `Invoice ${invoice.invoiceRef}`;
    const body = `Please find attached invoice ${invoice.invoiceRef} for ${formatCurrency(invoice.amount, invoice.currency)} ${invoice.currency}.`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(invoice.invoiceRef);
    // You could add a toast notification here
  };

  const handleRaiseDispute = () => {
    const confirmed = window.confirm(`Are you sure you want to raise a dispute for invoice ${invoice.invoiceRef}?`);
    if (confirmed) {
      console.log('Raising dispute for invoice:', invoice.invoiceRef);
      alert(`Dispute raised for invoice ${invoice.invoiceRef}. Our team will review it within 24 hours.`);
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Invoice Details</h2>
                <p className="text-gray-600">{invoice.invoiceRef}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={handleSendMail}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </button>
              <button
                onClick={handleCopyReference}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Ref</span>
              </button>
              <button
                onClick={handleRaiseDispute}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Raise Dispute</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.invoiceStatus)}`}>
                    {invoice.invoiceStatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(invoice.amount, invoice.currency)} {invoice.currency}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-lg font-semibold text-gray-900">{invoice.dueDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Invoice Reference</p>
                    <p className="font-medium text-gray-900">{invoice.invoiceRef}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Invoice Date</p>
                    <p className="font-medium text-gray-900">{invoice.invoiceDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Shipment Reference</p>
                    <p className="font-medium text-blue-600">{invoice.shipmentRef}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">PO Reference</p>
                    <p className="font-medium text-gray-900">{invoice.poRefNo}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Terms</p>
                    <p className="font-medium text-gray-900">{invoice.paymentTerms}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Party Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Vendor</p>
                    <p className="font-medium text-gray-900">{invoice.vendor}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Shipper</p>
                    <p className="font-medium text-gray-900">{invoice.shipper}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Consignee</p>
                    <p className="font-medium text-gray-900">{invoice.consignee}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Created By</p>
                    <p className="font-medium text-gray-900">{invoice.createdBy}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium text-gray-900">{invoice.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Route Information</h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Port of Loading (POL)</p>
                    <p className="font-medium text-gray-900">{invoice.pol}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Port of Discharge (POD)</p>
                    <p className="font-medium text-gray-900">{invoice.pod}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Ship className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-medium text-gray-900">Vessel Information</h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Vessel Name</p>
                    <p className="font-medium text-gray-900">{invoice.vessel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Voyage Number</p>
                    <p className="font-medium text-gray-900">{invoice.voyage}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Package className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-gray-900">Container Information</h4>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Container Numbers ({invoice.containerNumbers.length})</p>
                  <div className="space-y-1">
                    {invoice.containerNumbers.map((container, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-mono text-sm text-gray-900">{container}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Description */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{invoice.description}</p>
            </div>
          </div>

          {/* Payment History */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-center">No payment history available</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Invoice created on {invoice.invoiceDate}
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;