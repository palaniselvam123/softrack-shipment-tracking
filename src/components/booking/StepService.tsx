import React from 'react';
import { Ship, Plane, Truck, Brain as Train, ChevronDown, Warehouse, FileText, ShieldCheck, PackageCheck, ArrowLeftRight, ClipboardCheck } from 'lucide-react';
import { BookingData, serviceProviders, transportModes, availableServices, movementTypes } from './bookingData';

const modeIcons: Record<string, React.FC<{ className?: string }>> = {
  sea: Ship, air: Plane, road: Truck, rail: Train,
};

const serviceIcons: Record<string, React.FC<{ className?: string }>> = {
  Forwarding: ArrowLeftRight, Warehousing: Warehouse, 'Customs Clearance': ClipboardCheck,
  Transportation: Truck, Insurance: ShieldCheck, Documentation: FileText,
};

interface Props {
  data: BookingData;
  onChange: (field: string, value: unknown) => void;
  onToggleService: (service: string) => void;
}

export default function StepService({ data, onChange, onToggleService }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Transport Mode</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {transportModes.map(mode => {
            const Icon = modeIcons[mode.value] || Truck;
            const active = data.transportMode === mode.value;
            return (
              <button
                key={mode.value}
                onClick={() => onChange('transportMode', mode.value)}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${
                  active
                    ? 'border-sky-500 bg-sky-50 shadow-md shadow-sky-100'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  active ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className={`text-sm font-bold ${active ? 'text-sky-700' : 'text-gray-900'}`}>{mode.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{mode.desc}</p>
                {active && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Service Provider</label>
          <div className="relative">
            <select
              value={data.serviceProvider}
              onChange={e => onChange('serviceProvider', e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 appearance-none transition-colors"
            >
              <option value="">Select a provider</option>
              {serviceProviders.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Shipment Direction</label>
          <div className="flex gap-3">
            {['Export', 'Import'].map(type => (
              <button
                key={type}
                onClick={() => onChange('shipmentType', type)}
                className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                  data.shipmentType === type
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Movement Type</label>
        <div className="relative">
          <select
            value={data.movementType}
            onChange={e => onChange('movementType', e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 appearance-none transition-colors"
          >
            <option value="">Select movement type</option>
            {movementTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Services Required</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {availableServices.map(service => {
            const Icon = serviceIcons[service.id] || PackageCheck;
            const active = data.services.includes(service.id);
            return (
              <button
                key={service.id}
                onClick={() => onToggleService(service.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  active
                    ? 'border-sky-500 bg-sky-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    active ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${active ? 'text-sky-700' : 'text-gray-700'}`}>{service.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{service.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
