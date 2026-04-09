import React from 'react';
import { User, Phone, Mail, MapPin, ChevronDown, CheckCircle, UserPlus } from 'lucide-react';
import { BookingData, preStoredConsignees } from './bookingData';

interface Props {
  data: BookingData;
  onChange: (field: string, value: unknown) => void;
  onConsigneeSelect: (id: string) => void;
}

export default function StepConsignee({ data, onChange, onConsigneeSelect }: Props) {
  const isPreStored = data.consigneeId && data.consigneeId !== 'new';

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Select Consignee</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {preStoredConsignees.map(c => {
            const active = data.consigneeId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onConsigneeSelect(c.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  active ? 'border-sky-500 bg-sky-50 shadow-md shadow-sky-100' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    active ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${active ? 'text-sky-700' : 'text-gray-900'}`}>{c.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{c.contact}</p>
                  </div>
                  {active && <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0 ml-auto" />}
                </div>
              </button>
            );
          })}
          <button
            onClick={() => onConsigneeSelect('new')}
            className={`p-4 rounded-xl border-2 border-dashed text-left transition-all ${
              data.consigneeId === 'new' ? 'border-sky-500 bg-sky-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                data.consigneeId === 'new' ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${data.consigneeId === 'new' ? 'text-sky-700' : 'text-gray-600'}`}>New Consignee</p>
                <p className="text-xs text-gray-400">Enter details manually</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {isPreStored && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700">Details auto-filled from stored records. Select "New Consignee" to enter custom details.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <User className="w-3.5 h-3.5 inline-block mr-1.5 text-gray-400 -mt-0.5" />
            Consignee Name
          </label>
          <input
            type="text"
            value={data.consigneeName}
            onChange={e => onChange('consigneeName', e.target.value)}
            disabled={!!isPreStored}
            placeholder="Enter consignee name"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Phone className="w-3.5 h-3.5 inline-block mr-1.5 text-gray-400 -mt-0.5" />
            Contact Number
          </label>
          <input
            type="tel"
            value={data.consigneeContact}
            onChange={e => onChange('consigneeContact', e.target.value)}
            disabled={!!isPreStored}
            placeholder="Enter contact number"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Mail className="w-3.5 h-3.5 inline-block mr-1.5 text-gray-400 -mt-0.5" />
            Email Address
          </label>
          <input
            type="email"
            value={data.consigneeEmail}
            onChange={e => onChange('consigneeEmail', e.target.value)}
            disabled={!!isPreStored}
            placeholder="Enter email address"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-3.5 h-3.5 inline-block mr-1.5 text-gray-400 -mt-0.5" />
            Complete Address
          </label>
          <textarea
            value={data.consigneeAddress}
            onChange={e => onChange('consigneeAddress', e.target.value)}
            disabled={!!isPreStored}
            rows={3}
            placeholder="Enter complete address"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 disabled:bg-gray-50 disabled:text-gray-500 resize-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
