import React, { useState } from 'react';
import { X, Mail, Send, Paperclip, User, AtSign } from 'lucide-react';

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
}

interface SendMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

const SendMailModal: React.FC<SendMailModalProps> = ({ isOpen, onClose, invoice }) => {
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    message: ''
  });

  React.useEffect(() => {
    if (invoice) {
      const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('id-ID', {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(amount);
      };

      setEmailData({
        to: '',
        cc: '',
        bcc: '',
        subject: `Invoice ${invoice.invoiceRef} - ${formatCurrency(invoice.amount, invoice.currency)} ${invoice.currency}`,
        message: `Dear Sir/Madam,

Please find attached the invoice details:

Invoice Reference: ${invoice.invoiceRef}
Invoice Date: ${invoice.invoiceDate}
Amount: ${formatCurrency(invoice.amount, invoice.currency)} ${invoice.currency}
Due Date: ${invoice.dueDate}
Shipment Reference: ${invoice.shipmentRef}

Description: ${invoice.description}

Payment Terms: ${invoice.paymentTerms}

Please process the payment by the due date. If you have any questions, please don't hesitate to contact us.

Best regards,
LogiTRACK Team`
      });
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const handleSend = () => {
    // In a real application, this would send the email via API
    console.log('Sending email:', emailData);
    
    // For demo purposes, open default email client
    const mailtoLink = `mailto:${emailData.to}?cc=${emailData.cc}&bcc=${emailData.bcc}&subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.message)}`;
    window.open(mailtoLink);
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-navy-950/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-surface-line">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-surface-tile rounded-md flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-navy-900">Send Invoice Email</h2>
                <p className="text-gray-600">Invoice: {invoice.invoiceRef}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form className="space-y-6">
            {/* To Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <AtSign className="w-4 h-4" />
                  <span>To *</span>
                </div>
              </label>
              <input
                type="email"
                value={emailData.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
                placeholder="recipient@example.com"
                className="w-full px-3 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                required
              />
            </div>

            {/* CC Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>CC</span>
                </div>
              </label>
              <input
                type="email"
                value={emailData.cc}
                onChange={(e) => handleInputChange('cc', e.target.value)}
                placeholder="cc@example.com"
                className="w-full px-3 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
              />
            </div>

            {/* BCC Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>BCC</span>
                </div>
              </label>
              <input
                type="email"
                value={emailData.bcc}
                onChange={(e) => handleInputChange('bcc', e.target.value)}
                placeholder="bcc@example.com"
                className="w-full px-3 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
              />
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                required
              />
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={emailData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-surface-line rounded-md focus:ring-1 focus:ring-brand-600 focus:border-brand-600"
                required
              />
            </div>

            {/* Attachment Info */}
            <div className="bg-surface-tile border border-surface-line rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Paperclip className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-medium text-navy-900">Attachment</span>
              </div>
              <p className="text-sm text-brand-700 mt-1">
                Invoice PDF ({invoice.invoiceRef}.pdf) will be automatically attached
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-line bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Email will be sent with invoice attachment
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-surface-line text-navy-900 rounded-md hover:bg-surface-head transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!emailData.to || !emailData.subject || !emailData.message}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMailModal;