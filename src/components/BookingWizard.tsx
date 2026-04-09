import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, X, Copy, Clock, LayoutTemplate, Ship, Plane, Truck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  BookingData, defaultBookingData, preStoredConsignees, steps,
  bookingTemplates, recentBookings, mockBookingLookup,
} from './booking/bookingData';
import StepProgressBar from './booking/StepProgressBar';
import StepService from './booking/StepService';
import StepConsignee from './booking/StepConsignee';
import StepRoute from './booking/StepRoute';
import StepCargo from './booking/StepCargo';
import StepDocuments from './booking/StepDocuments';
import StepReview from './booking/StepReview';

interface BookingWizardProps {
  bookingNo?: string;
  onBack: () => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ bookingNo, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateTab, setTemplateTab] = useState<'templates' | 'recent'>('templates');
  const [bookingData, setBookingData] = useState<BookingData>(defaultBookingData);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const finalBookingNo = urlParams.get('edit') || bookingNo;
    if (finalBookingNo) {
      const existing = mockBookingLookup[finalBookingNo];
      if (existing) setBookingData(prev => ({ ...prev, ...existing }));
    }
  }, [bookingNo]);

  const updateField = (field: string, value: unknown) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleConsigneeSelect = (id: string) => {
    const found = preStoredConsignees.find(c => c.id === id);
    if (found) {
      setBookingData(prev => ({ ...prev, consigneeId: id, consigneeName: found.name, consigneeAddress: found.address, consigneeContact: found.contact, consigneeEmail: found.email }));
    } else if (id === 'new') {
      setBookingData(prev => ({ ...prev, consigneeId: 'new', consigneeName: '', consigneeAddress: '', consigneeContact: '', consigneeEmail: '' }));
    }
  };

  const handleServiceToggle = (service: string) => {
    const services = bookingData.services.includes(service)
      ? bookingData.services.filter(s => s !== service)
      : [...bookingData.services, service];
    updateField('services', services);
  };

  const applyTemplate = (template: { data: Record<string, unknown> }) => {
    setBookingData(prev => ({ ...prev, ...template.data }));
    setShowTemplates(false);
  };

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('You must be logged in to submit a booking.'); return; }

    const modeMap: Record<string, string> = {
      sea: bookingData.shipmentType === 'Import' ? 'Sea Import' : 'Sea Export',
      air: bookingData.shipmentType === 'Import' ? 'Air Import' : 'Air Export',
      land: bookingData.shipmentType === 'Import' ? 'Land Import' : 'Land Export',
    };
    const transportMode = modeMap[bookingData.transportMode] || bookingData.transportMode;
    const prefix: Record<string, string> = { 'Sea Import': 'SE-S', 'Sea Export': 'SE-E', 'Air Import': 'AI', 'Air Export': 'AE', 'Land Import': 'LI', 'Land Export': 'LE' };
    const pre = prefix[transportMode] || 'BK';
    const rand = Math.floor(Math.random() * 9000) + 1000;
    const sub = Math.floor(Math.random() * 20) + 1;
    const dec = Math.floor(Math.random() * 9) + 1;
    const newBookingNo = `${pre}//${String(rand).padStart(4, '0')}//${sub}.${dec}`;

    const payload = {
      booking_no: newBookingNo,
      user_id: user.id,
      service_provider: bookingData.serviceProvider,
      transport_mode: transportMode,
      shipment_type: bookingData.shipmentType,
      movement_type: bookingData.movementType,
      job_order_no: String(Math.floor(Date.now() / 1000)),
      consignee_name: bookingData.consigneeName,
      consignee_address: bookingData.consigneeAddress,
      consignee_contact: bookingData.consigneeContact,
      consignee_email: bookingData.consigneeEmail,
      origin_location: bookingData.originLocation,
      destination_location: bookingData.destinationLocation,
      pickup_date: bookingData.pickupDate || null,
      delivery_date: bookingData.deliveryDate || null,
      cargo_description: bookingData.goods.map(g => g.description).join(', '),
      goods_description: bookingData.goods,
      services: bookingData.services,
      remarks: bookingData.remarks,
      status: 'pending',
    };

    const { error } = await supabase.from('bookings_from_quotes').insert(payload);
    if (error) { alert(`Failed to submit booking: ${error.message}`); return; }
    alert(`Booking ${newBookingNo} submitted successfully!`);
    onBack();
  };

  const editBookingNo = new URLSearchParams(window.location.search).get('edit') || bookingNo;
  const isEditing = !!editBookingNo;

  const modeIconMap: Record<string, React.FC<{ className?: string }>> = { sea: Ship, air: Plane, road: Truck };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="mb-8">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to bookings</span>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? `Edit Booking` : 'New Booking'}
              </h1>
              {isEditing && <p className="text-sm text-gray-500 mt-1">Editing {editBookingNo}</p>}
              {!isEditing && <p className="text-sm text-gray-500 mt-1">Fill in the details below to create a cargo booking</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setTemplateTab('templates'); setShowTemplates(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <LayoutTemplate className="w-4 h-4 text-gray-400" />
                Templates
              </button>
              <button
                onClick={() => { setTemplateTab('recent'); setShowTemplates(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Clock className="w-4 h-4 text-gray-400" />
                Reuse
              </button>
            </div>
          </div>
        </div>

        <StepProgressBar currentStep={currentStep} onStepClick={setCurrentStep} />

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 lg:p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">{steps[currentStep - 1].title}</h2>
            <p className="text-sm text-gray-500">{steps[currentStep - 1].description}</p>
          </div>

          {currentStep === 1 && <StepService data={bookingData} onChange={updateField} onToggleService={handleServiceToggle} />}
          {currentStep === 2 && <StepConsignee data={bookingData} onChange={updateField} onConsigneeSelect={handleConsigneeSelect} />}
          {currentStep === 3 && <StepRoute data={bookingData} onChange={updateField} />}
          {currentStep === 4 && <StepCargo data={bookingData} onChange={updateField} />}
          {currentStep === 5 && <StepDocuments data={bookingData} onChange={updateField} />}
          {currentStep === 6 && <StepReview data={bookingData} onChange={updateField} />}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            <button className="px-5 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
              Save Draft
            </button>
            {currentStep === steps.length ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm shadow-emerald-200"
              >
                <Check className="w-4 h-4" />
                {isEditing ? 'Update Booking' : 'Submit Booking'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm shadow-sky-200"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Quick Start</h2>
              <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setTemplateTab('templates')}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  templateTab === 'templates' ? 'text-sky-600 border-b-2 border-sky-500' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Templates
              </button>
              <button
                onClick={() => setTemplateTab('recent')}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  templateTab === 'recent' ? 'text-sky-600 border-b-2 border-sky-500' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Recent Bookings
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {templateTab === 'templates' ? (
                <div className="space-y-3">
                  {bookingTemplates.map(t => {
                    const MIcon = modeIconMap[t.data.transportMode] || Ship;
                    return (
                      <div key={t.id} className="border border-gray-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm transition-all group">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                              <MIcon className="w-5 h-5 text-sky-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900">{t.name}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {t.data.services.map(s => (
                                  <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-md">{s}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => applyTemplate(t)}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
                          >
                            Use
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map(b => (
                    <div key={b.id} className="border border-gray-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{b.id}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{b.consignee} -- {b.route}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{b.date}</p>
                        </div>
                        <button
                          onClick={() => applyTemplate(b)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
                        >
                          <Copy className="w-3 h-3" />
                          Reuse
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingWizard;
