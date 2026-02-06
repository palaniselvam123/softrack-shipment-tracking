import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Building, User, Mail, Phone, Package, Ship, Plane, Truck, MapPin } from 'lucide-react';
import LocationSelector from './LocationSelector';

interface InquiryFormProps {
  onBack: () => void;
  onSubmit?: (inquiryId: string) => void;
}

interface InquiryData {
  customer_name: string;
  company_name: string;
  lob: string[];
  primary_lob?: string;
  movement_type: string;
  ports: {
    por: string;
    pol?: string;
    pod?: string;
    fpod: string;
  };
  container_info?: {
    type: string;
    count: number;
  };
  services: string[];
  goods_description: string;
  customs_origin_required: boolean;
  customs_destination_required: boolean;
  ready_date?: string;
  contact_email: string;
  contact_phone: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState<InquiryData>({
    customer_name: '',
    company_name: '',
    lob: [],
    movement_type: '',
    ports: {
      por: '',
      fpod: ''
    },
    services: [],
    goods_description: '',
    customs_origin_required: false,
    customs_destination_required: false,
    contact_email: '',
    contact_phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContainer, setShowContainer] = useState(false);

  // LOB Master Data
  const lobOptions = [
    { code: 'SEA_FCL', label: 'Sea FCL', requiresContainer: true },
    { code: 'SEA_LCL', label: 'Sea LCL', requiresContainer: false },
    { code: 'AIR_FREIGHT', label: 'Air Freight', requiresContainer: false },
    { code: 'ROAD_TRANSPORT', label: 'Road Transport', requiresContainer: false },
    { code: 'LIQUID', label: 'Liquid Transport', requiresContainer: true },
    { code: 'RAIL', label: 'Rail Transport', requiresContainer: false }
  ];

  const movementTypes = [
    { code: 'PORT_TO_PORT', label: 'Port to Port' },
    { code: 'PORT_TO_CFS', label: 'Port to CFS' },
    { code: 'DOOR_TO_DOOR', label: 'Door to Door' },
    { code: 'DOOR_TO_PORT', label: 'Door to Port' }
  ];

  const containerTypes = [
    '20GP', '40GP', '40HC', '45HC', '20RF', '40RF', '20OT', '40OT', '20FR', '40FR'
  ];

  const serviceOptions = [
    { code: 'CUSTOMS', label: 'Customs Clearance' },
    { code: 'TRUCKING', label: 'Trucking' },
    { code: 'WAREHOUSING', label: 'Warehousing' },
    { code: 'INSURANCE', label: 'Insurance' },
    { code: 'DOCUMENTATION', label: 'Documentation' }
  ];

  // Check if container block should be shown
  useEffect(() => {
    const requiresContainer = formData.lob.some(lobCode => 
      lobOptions.find(lob => lob.code === lobCode)?.requiresContainer
    );
    setShowContainer(requiresContainer);
    
    // Clear container info if not required
    if (!requiresContainer) {
      setFormData(prev => ({ ...prev, container_info: undefined }));
    }
  }, [formData.lob]);

  const handleLobChange = (lobCode: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      lob: checked 
        ? [...prev.lob, lobCode]
        : prev.lob.filter(code => code !== lobCode)
    }));
  };

  const handleServiceChange = (serviceCode: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, serviceCode]
        : prev.services.filter(code => code !== serviceCode)
    }));
  };

  const getPortRequirements = (movementType: string) => {
    switch (movementType) {
      case 'PORT_TO_PORT':
        return { por: true, pol: false, pod: false, fpod: true };
      case 'PORT_TO_CFS':
        return { por: true, pol: true, pod: true, fpod: true };
      case 'DOOR_TO_DOOR':
        return { por: true, pol: false, pod: false, fpod: true };
      case 'DOOR_TO_PORT':
        return { por: true, pol: true, pod: false, fpod: true };
      default:
        return { por: true, pol: false, pod: false, fpod: true };
    }
  };

  const portRequirements = getPortRequirements(formData.movement_type);

  const validateForm = () => {
    if (formData.lob.length === 0) return false;
    if (!formData.movement_type) return false;
    if (!formData.ports.por) return false;
    if (!formData.ports.fpod) return false;
    if (portRequirements.pol && !formData.ports.pol) return false;
    if (portRequirements.pod && !formData.ports.pod) return false;
    if (showContainer && (!formData.container_info?.type || !formData.container_info?.count)) return false;
    if (!formData.customer_name || !formData.company_name) return false;
    if (!formData.contact_email || !formData.contact_phone) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Generate inquiry ID
      const inquiryId = `IQ-${Date.now().toString().slice(-6)}`;
      
      const payload = {
        inquiry_id: inquiryId,
        customer_id: `CUST-${Date.now().toString().slice(-6)}`,
        ...formData,
        branch: null
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Inquiry submitted:', payload);
      
      // Show success and redirect
      alert(`Inquiry submitted successfully!\nInquiry ID: ${inquiryId}\nStatus: Submitted`);
      
      if (onSubmit) {
        onSubmit(inquiryId);
      }
      
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Error submitting inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Create New Inquiry</h1>
                <p className="text-sm text-gray-600 mt-1">Submit your shipping requirements for quotation</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Customer Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 inline mr-1" />
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Line of Business */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Line of Business *</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lobOptions.map((lob) => (
                  <label key={lob.code} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.lob.includes(lob.code)}
                      onChange={(e) => handleLobChange(lob.code, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">{lob.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Movement Type */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Movement Type *</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movementTypes.map((type) => (
                  <label key={type.code} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="movement_type"
                      value={type.code}
                      checked={formData.movement_type === type.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, movement_type: e.target.value }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ports */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Route Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LocationSelector
                  label="Port of Receipt (POR)"
                  value={formData.ports.por}
                  onChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    ports: { ...prev.ports, por: value }
                  }))}
                  required={portRequirements.por}
                  transportMode="all"
                />
                
                {portRequirements.pol && (
                  <LocationSelector
                    label="Port of Loading (POL)"
                    value={formData.ports.pol || ''}
                    onChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      ports: { ...prev.ports, pol: value }
                    }))}
                    required={portRequirements.pol}
                    transportMode="sea"
                  />
                )}
                
                {portRequirements.pod && (
                  <LocationSelector
                    label="Port of Discharge (POD)"
                    value={formData.ports.pod || ''}
                    onChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      ports: { ...prev.ports, pod: value }
                    }))}
                    required={portRequirements.pod}
                    transportMode="sea"
                  />
                )}
                
                <LocationSelector
                  label="Final Port of Delivery (FPOD)"
                  value={formData.ports.fpod}
                  onChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    ports: { ...prev.ports, fpod: value }
                  }))}
                  required={portRequirements.fpod}
                  transportMode="all"
                />
              </div>
            </div>

            {/* Container Information (Conditional) */}
            {showContainer && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Container Information *</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Container Type *</label>
                    <select
                      value={formData.container_info?.type || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        container_info: { 
                          ...prev.container_info, 
                          type: e.target.value,
                          count: prev.container_info?.count || 1
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Container Type</option>
                      {containerTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Container Count *</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.container_info?.count || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        container_info: { 
                          ...prev.container_info, 
                          type: prev.container_info?.type || '',
                          count: parseInt(e.target.value) || 1
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional Services */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {serviceOptions.map((service) => (
                  <label key={service.code} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.code)}
                      onChange={(e) => handleServiceChange(service.code, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">{service.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Customs Requirements */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customs Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.customs_origin_required}
                    onChange={(e) => setFormData(prev => ({ ...prev, customs_origin_required: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Customs Clearance at Origin</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.customs_destination_required}
                    onChange={(e) => setFormData(prev => ({ ...prev, customs_destination_required: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Customs Clearance at Destination</span>
                </label>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goods Description</label>
                  <textarea
                    value={formData.goods_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, goods_description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the goods to be shipped..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ready Date</label>
                  <input
                    type="date"
                    value={formData.ready_date || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, ready_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!validateForm() || isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;