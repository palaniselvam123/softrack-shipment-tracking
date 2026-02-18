import React, { useState, useEffect, useRef } from 'react';
import { User, MapPin, ArrowRight, ChevronDown, Search, Plus, X, Check } from 'lucide-react';
import { Quotation, BookingFormData } from '../types/quotation';
import { supabase } from '../../../lib/supabase';

interface Contact {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  country_code: string;
  contact: string;
  email: string;
  is_indian: boolean;
  type: string;
}

interface BookingFormProps {
  quotation: Quotation;
  onSubmit: (data: BookingFormData) => void;
  onBack: () => void;
  submitting?: boolean;
}

const INCOTERMS = ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];

const FALLBACK_CONTACTS: Contact[] = [
  { id: '1', type: 'shipper', name: 'Textile Exports India Ltd', address: 'Plot 45, MIDC Industrial Area', city: 'Pune', country: 'India', country_code: 'IN', contact: '+91 20 2765 4321', email: 'exports@textileindiaexports.com', is_indian: true },
  { id: '2', type: 'shipper', name: 'Electronics Manufacturing Co', address: 'B-12, SEZ Phase 2', city: 'Chennai', country: 'India', country_code: 'IN', contact: '+91 44 2678 9900', email: 'shipping@emcelectronics.in', is_indian: true },
  { id: '3', type: 'shipper', name: 'Pharmaceutical Exports Ltd', address: 'Survey No 45, Andheri East', city: 'Mumbai', country: 'India', country_code: 'IN', contact: '+91 22 4567 8901', email: 'exports@pharmaexportsltd.com', is_indian: true },
  { id: '4', type: 'shipper', name: 'Spices & Condiments Export', address: 'Kerala Spice Park, NH-66', city: 'Kochi', country: 'India', country_code: 'IN', contact: '+91 484 234 5678', email: 'trade@spicesexport.in', is_indian: true },
  { id: '5', type: 'shipper', name: 'ANL Industries Pvt Ltd', address: '123 Industrial Area, Sector 15', city: 'Mumbai', country: 'India', country_code: 'IN', contact: '+91 98765 43210', email: 'logistics@anlindustries.com', is_indian: true },
  { id: '6', type: 'shipper', name: 'Kalpataru Logistics Solutions', address: '456 Export House, MIDC Area', city: 'Pune', country: 'India', country_code: 'IN', contact: '+91 87654 32109', email: 'operations@kalpatarulogistics.com', is_indian: true },
  { id: '7', type: 'shipper', name: 'Global Trading Company', address: '789 Trade Center, BKC', city: 'Mumbai', country: 'India', country_code: 'IN', contact: '+91 76543 21098', email: 'shipping@globaltradingco.in', is_indian: true },
  { id: '8', type: 'shipper', name: 'Steel Manufacturing Ltd', address: 'Industrial Zone, Sector 5', city: 'Mundra', country: 'India', country_code: 'IN', contact: '+91 2838 255 000', email: 'exports@steelmfgltd.com', is_indian: true },
  { id: '9', type: 'shipper', name: 'Leather Goods Manufacturer', address: 'Leather Complex, Dharavi', city: 'Mumbai', country: 'India', country_code: 'IN', contact: '+91 22 2411 5566', email: 'export@leathermfg.in', is_indian: true },
  { id: '10', type: 'shipper', name: 'Karnataka Agricultural Co-op', address: 'Agri Bhavan, KR Road', city: 'Bangalore', country: 'India', country_code: 'IN', contact: '+91 80 2234 5678', email: 'trade@karagricoop.in', is_indian: true },
  { id: '11', type: 'consignee', name: 'European Fashion House', address: 'Große Bleichen 23', city: 'Hamburg', country: 'Germany', country_code: 'DE', contact: '+49 40 3456 7890', email: 'imports@europefashion.de', is_indian: false },
  { id: '12', type: 'consignee', name: 'South Asia Trading Company', address: 'Plot 15, Industrial Zone', city: 'Mumbai', country: 'India', country_code: 'IN', contact: '+91 22 3456 7890', email: 'imports@southasiatrading.in', is_indian: true },
  { id: '13', type: 'consignee', name: 'Tech Solutions Dubai', address: 'Dubai Silicon Oasis, Block A', city: 'Dubai', country: 'UAE', country_code: 'AE', contact: '+971 4 567 8900', email: 'logistics@techsolutionsdxb.com', is_indian: false },
  { id: '14', type: 'consignee', name: 'HealthCare International', address: 'Jebel Ali Free Zone, Unit 5A', city: 'Dubai', country: 'UAE', country_code: 'AE', contact: '+971 4 890 1234', email: 'supply@healthcareintl.ae', is_indian: false },
  { id: '15', type: 'consignee', name: 'Brazilian Steel Imports', address: 'Porto de Santos, Armazem 12', city: 'Santos', country: 'Brazil', country_code: 'BR', contact: '+55 13 3456 7890', email: 'procurement@brasilsteel.com.br', is_indian: false },
  { id: '16', type: 'consignee', name: 'Australian Fine Wines', address: '88 Wine Valley Road', city: 'East Perth', country: 'Australia', country_code: 'AU', contact: '+61 8 9876 5432', email: 'export@ausfinewines.com.au', is_indian: false },
  { id: '17', type: 'consignee', name: 'American Tech Solutions', address: '500 Fifth Avenue, Suite 800', city: 'New York', country: 'USA', country_code: 'US', contact: '+1 212 456 7890', email: 'logistics@amtechsol.com', is_indian: false },
  { id: '18', type: 'consignee', name: 'Industrial Equipment India', address: 'MIDC Plot 45, Ambernath', city: 'Thane', country: 'India', country_code: 'IN', contact: '+91 251 234 5678', email: 'imports@indequipment.in', is_indian: true },
  { id: '19', type: 'consignee', name: 'European Leather Imports', address: 'Rue du Commerce 45', city: 'Brussels', country: 'Belgium', country_code: 'BE', contact: '+32 2 345 6789', email: 'procurement@euroleather.be', is_indian: false },
  { id: '20', type: 'consignee', name: '3PL Logistics Hub', address: '321 Warehouse District', city: 'Gurgaon', country: 'India', country_code: 'IN', contact: '+91 65432 10987', email: 'bookings@3pllogistics.com', is_indian: true },
];

interface ContactPickerProps {
  label: string;
  selectedId: string;
  contacts: Contact[];
  onSelect: (c: Contact) => void;
  onClear: () => void;
  accentColor: string;
  preferIndian?: boolean;
}

const ContactPicker: React.FC<ContactPickerProps> = ({ label, selectedId, contacts, onSelect, onClear, accentColor, preferIndian }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selected = contacts.find(c => c.id === selectedId);

  const sorted = [...contacts].sort((a, b) => {
    if (preferIndian) {
      if (a.is_indian && !b.is_indian) return -1;
      if (!a.is_indian && b.is_indian) return 1;
    } else {
      if (!a.is_indian && b.is_indian) return -1;
      if (a.is_indian && !b.is_indian) return 1;
    }
    return a.name.localeCompare(b.name);
  });

  const filtered = query
    ? sorted.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.country.toLowerCase().includes(query.toLowerCase()) ||
        c.city.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase())
      )
    : sorted;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2.5 border-2 rounded-xl transition-all text-left ${
          selectedId ? `border-${accentColor}-300 bg-${accentColor}-50` : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        {selected ? (
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-${accentColor}-500`}>
              {selected.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 text-sm truncate">{selected.name}</div>
              <div className="text-xs text-gray-500 truncate">{selected.city}, {selected.country}</div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400 text-sm flex items-center gap-1.5">
            <Search className="w-4 h-4" />
            Search or select from address book...
          </span>
        )}
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {selectedId && (
            <span
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-100 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, city, or country..."
              className="w-full text-sm focus:outline-none"
            />
          </div>
          <div className="overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-4 text-sm text-gray-400 text-center">No contacts found</div>
            ) : (
              filtered.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { onSelect(c); setOpen(false); setQuery(''); }}
                  className={`w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 flex items-center gap-3 ${selectedId === c.id ? 'bg-sky-50' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${c.is_indian ? 'bg-emerald-500' : 'bg-sky-500'}`}>
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 text-sm truncate">{c.name}</div>
                    <div className="text-xs text-gray-400 truncate">{c.city}, {c.country} · {c.email}</div>
                  </div>
                  {selectedId === c.id && <Check className="w-4 h-4 text-sky-600 flex-shrink-0" />}
                  {c.is_indian && <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded flex-shrink-0">IN</span>}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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

const BookingForm: React.FC<BookingFormProps> = ({ quotation, onSubmit, onBack, submitting }) => {
  const isExport = quotation.schedule.direction === 'export';
  const [contacts, setContacts] = useState<Contact[]>(FALLBACK_CONTACTS);
  const [selectedShipperId, setSelectedShipperId] = useState('');
  const [selectedConsigneeId, setSelectedConsigneeId] = useState('');

  const [form, setForm] = useState<BookingFormData>({
    shipperName: '', shipperAddress: '', shipperCity: '',
    shipperCountry: isExport ? 'India' : '',
    shipperContact: '', shipperEmail: '',
    consigneeName: '', consigneeAddress: '', consigneeCity: '',
    consigneeCountry: isExport ? '' : 'India',
    consigneeContact: '', consigneeEmail: '',
    notifyParty: '',
    cargoDescription: quotation.cargoDetails.commodity,
    hsCode: quotation.cargoDetails.hsCode,
    marksNumbers: '', specialInstructions: '',
    incoterm: quotation.cargoDetails.incoterm,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('contacts').select('*').eq('is_active', true).order('name');
      if (data && data.length > 0) setContacts(data);
    })();
  }, []);

  const handleSelectShipper = (c: Contact) => {
    setSelectedShipperId(c.id);
    setForm(prev => ({
      ...prev,
      shipperName: c.name,
      shipperAddress: c.address,
      shipperCity: c.city,
      shipperCountry: c.country,
      shipperContact: c.contact,
      shipperEmail: c.email,
    }));
  };

  const handleClearShipper = () => {
    setSelectedShipperId('');
    setForm(prev => ({
      ...prev,
      shipperName: '', shipperAddress: '', shipperCity: '',
      shipperCountry: isExport ? 'India' : '',
      shipperContact: '', shipperEmail: '',
    }));
  };

  const handleSelectConsignee = (c: Contact) => {
    setSelectedConsigneeId(c.id);
    setForm(prev => ({
      ...prev,
      consigneeName: c.name,
      consigneeAddress: c.address,
      consigneeCity: c.city,
      consigneeCountry: c.country,
      consigneeContact: c.contact,
      consigneeEmail: c.email,
    }));
  };

  const handleClearConsignee = () => {
    setSelectedConsigneeId('');
    setForm(prev => ({
      ...prev,
      consigneeName: '', consigneeAddress: '', consigneeCity: '',
      consigneeCountry: isExport ? '' : 'India',
      consigneeContact: '', consigneeEmail: '',
    }));
  };

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

  const shipperContacts = contacts.filter(c => c.type === 'shipper' || c.type === 'both');
  const consigneeContacts = contacts.filter(c => c.type === 'consignee' || c.type === 'both');

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
              <ContactPicker
                label="Select from Address Book"
                selectedId={selectedShipperId}
                contacts={shipperContacts}
                onSelect={handleSelectShipper}
                onClear={handleClearShipper}
                accentColor="sky"
                preferIndian={isExport}
              />
              <div className="border-t border-dashed border-gray-200 pt-3">
                <div className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Or fill manually
                </div>
                <div className="space-y-3">
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
              <ContactPicker
                label="Select from Address Book"
                selectedId={selectedConsigneeId}
                contacts={consigneeContacts}
                onSelect={handleSelectConsignee}
                onClear={handleClearConsignee}
                accentColor="emerald"
                preferIndian={!isExport}
              />
              <div className="border-t border-dashed border-gray-200 pt-3">
                <div className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Or fill manually
                </div>
                <div className="space-y-3">
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
            <Field label="HS Code" value={form.hsCode} onChange={update('hsCode')} placeholder="e.g. 6204.31.00" />
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
