import React from 'react';
import { X, Download, FileText, Calendar, DollarSign, User, Building, Package, Globe, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface CustomsDeclaration {
  id: string;
  declarationNo: string;
  shipmentRef: string;
  status: 'pending' | 'submitted' | 'under-review' | 'cleared' | 'hold' | 'rejected' | 'delayed';
  declarationType: 'import' | 'export';
  submissionDate: string;
  clearanceDate?: string;
  dutyAmount: number;
  currency: string;
  shipper: string;
  consignee: string;
  origin: string;
  destination: string;
  commodityCode: string;
  commodityDescription: string;
  value: number;
  weight: number;
  customsOfficer?: string;
  remarks?: string;
}

interface CustomsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  declaration: CustomsDeclaration | null;
}

const CustomsDetailModal: React.FC<CustomsDetailModalProps> = ({ isOpen, onClose, declaration }) => {
  if (!isOpen || !declaration) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleared':
        return 'bg-green-50 text-green-700';
      case 'submitted':
        return 'bg-surface-tile text-brand-700';
      case 'under-review':
        return 'bg-amber-50 text-amber-700';
      case 'pending':
        return 'bg-gray-50 text-gray-700';
      case 'hold':
        return 'bg-amber-50 text-amber-700';
      case 'rejected':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'cleared':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'submitted':
      case 'under-review':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'hold':
      case 'rejected':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'import' ? 'bg-surface-tile text-brand-700' : 'bg-green-50 text-green-700';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleDownloadDeclaration = () => {
    // Generate and download declaration PDF
    const content = `Customs Declaration: ${declaration.declarationNo}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customs_declaration_${declaration.declarationNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-navy-950/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-surface-line">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-surface-tile rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h2 className="page-title">Customs Declaration</h2>
                <p className="text-gray-600">{declaration.declarationNo}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadDeclaration}
                className="flex items-center space-x-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
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
          {/* Status and Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-surface-tile rounded-md p-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(declaration.status)}
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(declaration.status)}`}>
                    {declaration.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-surface-tile rounded-md p-4">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getTypeColor(declaration.declarationType)}`}>
                    {declaration.declarationType.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-surface-tile rounded-md p-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-500">Duty Amount</p>
                  <p className="text-[14px] font-semibold text-navy-900">
                    {formatCurrency(declaration.dutyAmount, declaration.currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Declaration Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-[14px] font-semibold text-navy-900 mb-4">Declaration Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Declaration Number</p>
                    <p className="font-medium text-gray-900">{declaration.declarationNo}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Shipment Reference</p>
                    <p className="font-medium text-brand-600">{declaration.shipmentRef}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Submission Date</p>
                    <p className="font-medium text-gray-900">{declaration.submissionDate}</p>
                  </div>
                </div>
                {declaration.clearanceDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Clearance Date</p>
                      <p className="font-medium text-green-600">{declaration.clearanceDate}</p>
                    </div>
                  </div>
                )}
                {declaration.customsOfficer && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Customs Officer</p>
                      <p className="font-medium text-gray-900">{declaration.customsOfficer}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-[14px] font-semibold text-navy-900 mb-4">Party Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Shipper</p>
                    <p className="font-medium text-gray-900">{declaration.shipper}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Consignee</p>
                    <p className="font-medium text-gray-900">{declaration.consignee}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Origin</p>
                    <p className="font-medium text-gray-900">{declaration.origin}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="font-medium text-gray-900">{declaration.destination}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commodity Information */}
          <div className="mt-8">
            <h3 className="text-[14px] font-semibold text-navy-900 mb-4">Commodity Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-tile rounded-md p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Commodity Code (HS Code)</p>
                    <p className="font-mono text-[14px] font-semibold text-navy-900">{declaration.commodityCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium text-gray-900">{declaration.commodityDescription}</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-tile rounded-md p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Declared Value</p>
                    <p className="text-[14px] font-semibold text-navy-900">
                      {formatCurrency(declaration.value, declaration.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium text-gray-900">{declaration.weight} kg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Remarks */}
          {declaration.remarks && (
            <div className="mt-8">
              <h3 className="text-[14px] font-semibold text-navy-900 mb-4">Remarks</h3>
              <div className="bg-surface-tile rounded-md p-4">
                <p className="text-gray-700">{declaration.remarks}</p>
              </div>
            </div>
          )}

          {/* Processing Timeline */}
          <div className="mt-8">
            <h3 className="text-[14px] font-semibold text-navy-900 mb-4">Processing Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-surface-tile rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Declaration Submitted</p>
                  <p className="text-sm text-gray-500">{declaration.submissionDate}</p>
                </div>
              </div>
              {declaration.status !== 'pending' && (
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Under Review</p>
                    <p className="text-sm text-gray-500">Processing by customs authority</p>
                  </div>
                </div>
              )}
              {declaration.clearanceDate && (
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cleared</p>
                    <p className="text-sm text-gray-500">{declaration.clearanceDate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-line bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Declaration submitted on {declaration.submissionDate}
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-surface-line text-navy-900 rounded-md hover:bg-surface-head transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownloadDeclaration}
                className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors"
              >
                Download Declaration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomsDetailModal;