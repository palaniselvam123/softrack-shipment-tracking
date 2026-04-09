import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Building, User, Mail, Phone, Package, Ship, Plane, Truck, MapPin, CheckCircle } from 'lucide-react';
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
    ports: { por: '', fpod: '' },
    services: [],
    goods_description: '',
    customs_origin_required: false,
    customs_destination_required: false,
    contact_email: '',
    contact_phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContainer, setShowContainer] = useState(false);

  const lobOptions = [
    { code: 'SEA_FCL', label: 'Sea FCL', icon: Ship, requiresContainer: true },
    { code: 'SEA_LCL', label: 'Sea LCL', icon: Ship, requiresContainer: false },
    { code: 'AIR_FREIGHT', label: 'Air Freight', icon: Plane, requiresContainer: false },
    { code: 'ROAD_TRANSPORT', label: 'Road Transport', icon: Truck, requiresContainer: false },
    { code: 'LIQUID', label: 'Liquid Transport', icon: Package, requiresContainer: true },
    { code: 'RAIL', label: 'Rail Transport', icon: Truck, requiresContainer: false }
  ];

  const movementTypes = [
    { code: 'PORT_TO_PORT', label: 'Port to Port', desc: 'Terminal to terminal' },
    { code: 'PORT_TO_CFS', label: 'Port to CFS', desc: 'Terminal to container station' },
    { code: 'DOOR_TO_DOOR', label: 'Door to Door', desc: 'Pickup to delivery' },
    { code: 'DOOR_TO_PORT', label: 'Door to Port', desc: 'Pickup to terminal' }
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

  useEffect(() => {
    const requiresContainer = formData.lob.some(lobCode =>
      lobOptions.find(lob => lob.code === lobCode)?.requiresContainer
    );
    setShowContainer(requiresContainer);
    if (!requiresContainer) {
      setFormData(prev => ({ ...prev, container_info: undefined }));
    }
  }, [formData.lob]);

  const handleLobChange = (lobCode: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      lob: checked ? [...prev.lob, lobCode] : prev.lob.filter(code => code !== lobCode)
    }));
  };

  const handleServiceChange = (serviceCode: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked ? [...prev.services, serviceCode] : prev.services.filter(code => code !== serviceCode)
    }));
  };

  const getPortRequirements = (movementType: string) => {
    switch (movementType) {
      case 'PORT_TO_PORT': return { por: true, pol: false, pod: false, fpod: true };
      case 'PORT_TO_CFS': return { por: true, pol: true, pod: true, fpod: true };
      case 'DOOR_TO_DOOR': return { por: true, pol: false, pod: false, fpod: true };
      case 'DOOR_TO_PORT': return { por: true, pol: true, pod: false, fpod: true };
      default: return { por: true, pol: false, pod: false, fpod: true };
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
      const inquiryId = `IQ-${Date.now().toString().slice(-6)}`;
      const payload = {
        inquiry_id: inquiryId,
        customer_id: `CUST-${Date.now().toString().slice(-6)}`,
        ...formData,
        branch: null
      };
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Inquiry submitted:', payload);
      alert(`Inquiry submitted successfully!\nInquiry ID: ${inquiryId}\nStatus: Submitted`);
      if (onSubmit) onSubmit(inquiryId);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Error submitting inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all bg-white placeholder:text-gray-400";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Inquiries</span>
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Inquiry</h1>
        <p className="text-sm text-gray-500 mt-1">Submit your shipping requirements for quotation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
            <div className="w-7 h-7 bg-sky-50 rounded-lg flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-sky-600" />
            </div>
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Customer Name *</label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                className={inputClass}
                placeholder="Enter customer name"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Company Name *</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                className={inputClass}
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Contact Email *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  className={`${inputClass} pl-11`}
                  placeholder="email@company.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Contact Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                  className={`${inputClass} pl-11`}
                  placeholder="+91-XXXXX-XXXXX"
                  required
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-blue-600" />
            </div>
            Line of Business *
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lobOptions.map((lob) => {
              const Icon = lob.icon;
              const isSelected = formData.lob.includes(lob.code);
              return (
                <label
                  key={lob.code}
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'border-sky-300 bg-sky-50/60 ring-1 ring-sky-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleLobChange(lob.code, e.target.checked)}
                    className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${isSelected ? 'text-sky-800' : 'text-gray-700'}`}>{lob.label}</span>
                </label>
              );
            })}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            Movement Type *
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {movementTypes.map((type) => {
              const isSelected = formData.movement_type === type.code;
              return (
                <label
                  key={type.code}
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'border-sky-300 bg-sky-50/60 ring-1 ring-sky-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="movement_type"
                    value={type.code}
                    checked={isSelected}
                    onChange={(e) => setFormData(prev => ({ ...prev, movement_type: e.target.value }))}
                    className="text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <div>
                    <span className={`text-sm font-medium ${isSelected ? 'text-sky-800' : 'text-gray-700'}`}>{type.label}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
            </div>
            Route Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <LocationSelector
              label="Port of Receipt (POR)"
              value={formData.ports.por}
              onChange={(value) => setFormData(prev => ({ ...prev, ports: { ...prev.ports, por: value } }))}
              required={portRequirements.por}
              transportMode="all"
            />
            {portRequirements.pol && (
              <LocationSelector
                label="Port of Loading (POL)"
                value={formData.ports.pol || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, ports: { ...prev.ports, pol: value } }))}
                required={portRequirements.pol}
                transportMode="sea"
              />
            )}
            {portRequirements.pod && (
              <LocationSelector
                label="Port of Discharge (POD)"
                value={formData.ports.pod || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, ports: { ...prev.ports, pod: value } }))}
                required={portRequirements.pod}
                transportMode="sea"
              />
            )}
            <LocationSelector
              label="Final Port of Delivery (FPOD)"
              value={formData.ports.fpod}
              onChange={(value) => setFormData(prev => ({ ...prev, ports: { ...prev.ports, fpod: value } }))}
              required={portRequirements.fpod}
              transportMode="all"
            />
          </div>
        </section>

        {showContainer && (
          <section className="bg-white border border-gray-200 rounded-2xl p-6 animate-fade-in">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
              <div className="w-7 h-7 bg-cyan-50 rounded-lg flex items-center justify-center">
                <Package className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              Container Information *
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Container Type *</label>
                <select
                  value={formData.container_info?.type || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    container_info: { ...prev.container_info, type: e.target.value, count: prev.container_info?.count || 1 }
                  }))}
                  className={inputClass}
                  required
                >
                  <option value="">Select Container Type</option>
                  {containerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Container Count *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.container_info?.count || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    container_info: { ...prev.container_info, type: prev.container_info?.type || '', count: parseInt(e.target.value) || 1 }
                  }))}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </section>
        )}

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
            </div>
            Additional Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {serviceOptions.map((service) => {
              const isSelected = formData.services.includes(service.code);
              return (
                <label
                  key={service.code}
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-300 bg-teal-50/60 ring-1 ring-teal-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleServiceChange(service.code, e.target.checked)}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span className={`text-sm font-medium ${isSelected ? 'text-teal-800' : 'text-gray-700'}`}>{service.label}</span>
                </label>
              );
            })}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Customs Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'customs_origin_required' as const, label: 'Customs Clearance at Origin' },
              { key: 'customs_destination_required' as const, label: 'Customs Clearance at Destination' }
            ].map(item => {
              const isSelected = formData[item.key];
              return (
                <label
                  key={item.key}
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'border-sky-300 bg-sky-50/60 ring-1 ring-sky-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => setFormData(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <span className={`text-sm font-medium ${isSelected ? 'text-sky-800' : 'text-gray-700'}`}>{item.label}</span>
                </label>
              );
            })}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Goods Description</label>
              <textarea
                value={formData.goods_description}
                onChange={(e) => setFormData(prev => ({ ...prev, goods_description: e.target.value }))}
                rows={3}
                className={inputClass}
                placeholder="Describe the goods to be shipped..."
              />
            </div>
            <div>
              <label className={labelClass}>Ready Date</label>
              <input
                type="date"
                value={formData.ready_date || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ready_date: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-2 pb-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!validateForm() || isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
  );
};

export default InquiryForm;
