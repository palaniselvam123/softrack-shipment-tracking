import React, { useState } from 'react';
import { User, MapPin, ArrowRight } from 'lucide-react';
import { Quotation, BookingFormData } from '../types/quotation';

interface BookingFormProps {
  quotation: Quotation;
  onSubmit: (data: BookingFormData) => void;
  onBack: () => void;
  submitting?: boolean;
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

const Field: React.FC<FieldProps> = ({ label, value, onChange, placeholder, required, type = 'text' }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-sky-500 focus:outline-none transition-all"
    />
  </div>
);

const INCOTERMS = ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];

const BookingForm: React.FC<BookingFormProps> = ({ quotation, onSubmit, onBack, submitting }) => {
  const isExport = quotation.schedule.direction === 'export';

  const [form, setForm] = useState<BookingFormData>({
    shipperName: '',
    shipperAddress: '',
    shipperCity: '',
    shipperCountry: isExport ? 'India' : '',
    shipperContact: '',
    shipperEmail: '',
    consigneeName: '',
    consigneeAddress: '',
    consigneeCity: '',
    consigneeCountry: isExport ? '' : 'India',
    consigneeContact: '',
    consigneeEmail: '',
    notifyParty: '',
    cargoDescription: quotation.cargoDetails.commodity,
    hsCode: quotation.cargoDetails.hsCode,
    marksNumbers: '',
    specialInstructions: '',
    incoterm: quotation.cargoDetails.incoterm,
  });
  const [error, setError] = useState('');

  const update = (field: keyof BookingFormData) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.shipperName.trim()) { setError('Shipper name is required'); return; }
    if (!form.consigneeName.trim()) { setError('Consignee name is required'); return; }
    if (!form.cargoDescription.trim()) { setError('Cargo description is required'); return; }
    onSubmit(form);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-5 py-4 flex items-center gap-2">
              <User className="w-5 h-5 text-white" />
              <h3 className="font-bold text-white">Shipper Details</h3>
              <span className="ml-auto text-xs text-sky-100 bg-sky-700 px-2 py-0.5 rounded-full">
                {isExport ? 'India' : 'Overseas'}
              </span>
            </div>
            <div className="p-5 space-y-3">
              <Field label="Company / Shipper Name" value={form.shipperName} onChange={update('shipperName')} placeholder="Enter shipper name" required />
              <Field label="Address Line" value={form.shipperAddress} onChange={update('shipperAddress')} placeholder="Street address" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" value={form.shipperCity} onChange={update('shipperCity')} placeholder="City" />
                <Field label="Country" value={form.shipperCountry} onChange={update('shipperCountry')} placeholder="Country" />
              </div>
              <Field label="Contact / Phone" value={form.shipperContact} onChange={update('shipperContact')} placeholder="+91 XXXXX XXXXX" type="tel" />
              <Field label="Email" value={form.shipperEmail} onChange={update('shipperEmail')} placeholder="shipper@company.com" type="email" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-white" />
              <h3 className="font-bold text-white">Consignee Details</h3>
              <span className="ml-auto text-xs text-emerald-100 bg-emerald-700 px-2 py-0.5 rounded-full">
                {isExport ? 'Overseas' : 'India'}
              </span>
            </div>
            <div className="p-5 space-y-3">
              <Field label="Company / Consignee Name" value={form.consigneeName} onChange={update('consigneeName')} placeholder="Enter consignee name" required />
              <Field label="Address Line" value={form.consigneeAddress} onChange={update('consigneeAddress')} placeholder="Street address" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" value={form.consigneeCity} onChange={update('consigneeCity')} placeholder="City" />
                <Field label="Country" value={form.consigneeCountry} onChange={update('consigneeCountry')} placeholder="Country" />
              </div>
              <Field label="Contact / Phone" value={form.consigneeContact} onChange={update('consigneeContact')} placeholder="+1 XXX XXX XXXX" type="tel" />
              <Field label="Email" value={form.consigneeEmail} onChange={update('consigneeEmail')} placeholder="consignee@company.com" type="email" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-900">Cargo & Shipping Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Notify Party <span className="text-gray-400 font-normal">(if different from consignee)</span>
              </label>
              <input
                type="text"
                value={form.notifyParty}
                onChange={e => update('notifyParty')(e.target.value)}
                placeholder="Enter notify party name and address"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <Field label="Cargo Description" value={form.cargoDescription} onChange={update('cargoDescription')} placeholder="Detailed cargo description for Bill of Lading" required />
            </div>
            <Field label="HS Code" value={form.hsCode} onChange={update('hsCode')} placeholder="Harmonized System Code" />
            <Field label="Marks & Numbers" value={form.marksNumbers} onChange={update('marksNumbers')} placeholder="Shipping marks on packages" />
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-2">Incoterm</label>
              <div className="flex flex-wrap gap-2">
                {INCOTERMS.map(it => (
                  <button
                    key={it}
                    type="button"
                    onClick={() => update('incoterm')(it)}
                    className={`py-1.5 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                      form.incoterm === it
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-200 text-gray-600 hover:border-sky-300'
                    }`}
                  >
                    {it}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Special Instructions</label>
              <textarea
                value={form.specialInstructions}
                onChange={e => update('specialInstructions')(e.target.value)}
                rows={3}
                placeholder="Any special handling instructions, temperature requirements, etc."
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-sky-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-xl px-5 py-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-sky-900 text-sm">Booking Summary</div>
              <div className="text-xs text-sky-700 mt-1">
                {quotation.schedule.originPortName} → {quotation.schedule.destinationPortName} · {quotation.schedule.carrierName}
                <br />
                ETD: {quotation.schedule.etd.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · ETA: {quotation.schedule.eta.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-sky-600">Total</div>
              <div className="font-black text-sky-900 text-lg">USD {quotation.totalAmountUsd.toFixed(2)}</div>
              <div className="text-xs text-sky-600">≈ ₹{quotation.totalAmountInr.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
        )}

        <div className="flex gap-3 pb-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-60"
          >
            {submitting ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Confirming Booking...</span>
            ) : (
              <><ArrowRight className="w-5 h-5" /> Confirm Booking</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
