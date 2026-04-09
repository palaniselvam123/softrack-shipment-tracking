import React from 'react';
import { Ship, Plane, Truck, Brain as Train, MapPin, Calendar, Package, FileText, User, ArrowRight } from 'lucide-react';
import { BookingData } from './bookingData';

const modeIcons: Record<string, React.FC<{ className?: string }>> = {
  sea: Ship, air: Plane, road: Truck, rail: Train,
};

const modeLabels: Record<string, string> = {
  sea: 'Sea Freight', air: 'Air Freight', road: 'Road Transport', rail: 'Rail Transport',
};

interface Props {
  data: BookingData;
  onChange: (field: string, value: unknown) => void;
}

export default function StepReview({ data, onChange }: Props) {
  const ModeIcon = modeIcons[data.transportMode] || Truck;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/60 rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-4 mb-5">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-sky-200">
            <ModeIcon className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{data.serviceProvider || 'No provider selected'}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{modeLabels[data.transportMode] || '--'}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>{data.shipmentType || '--'}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>{data.movementType || '--'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/80 rounded-xl p-4 border border-sky-100">
          <MapPin className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-900">{data.originLocation || '--'}</span>
          <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-900">{data.destinationLocation || '--'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SummaryCard
          icon={User}
          title="Consignee"
          items={[
            { label: 'Name', value: data.consigneeName },
            { label: 'Contact', value: data.consigneeContact },
            { label: 'Email', value: data.consigneeEmail },
          ]}
        />
        <SummaryCard
          icon={Calendar}
          title="Schedule"
          items={[
            { label: 'Pickup', value: data.pickupDate ? new Date(data.pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '--' },
            { label: 'Delivery', value: data.deliveryDate ? new Date(data.deliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '--' },
          ]}
        />
        <SummaryCard
          icon={Package}
          title="Cargo"
          items={[
            { label: 'Type', value: data.cargoType },
            { label: 'Items', value: `${data.goods.length} item${data.goods.length !== 1 ? 's' : ''}` },
            { label: 'Total weight', value: `${data.goods.reduce((s, g) => s + g.weight, 0).toLocaleString()} kg` },
          ]}
        />
        <SummaryCard
          icon={FileText}
          title="Documents"
          items={[
            { label: 'Uploaded', value: `${data.documents.length} document${data.documents.length !== 1 ? 's' : ''}` },
            ...(data.services.length > 0 ? [{ label: 'Services', value: data.services.join(', ') }] : []),
          ]}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Remarks</label>
        <textarea
          value={data.remarks}
          onChange={e => onChange('remarks', e.target.value)}
          rows={3}
          placeholder="Enter any special instructions, notes, or requests..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 focus:bg-white resize-none transition-colors"
        />
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, title, items }: { icon: React.FC<{ className?: string }>; title: string; items: { label: string; value: string }[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-gray-400" />
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h4>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-start">
            <span className="text-xs text-gray-500">{item.label}</span>
            <span className="text-sm font-medium text-gray-900 text-right max-w-[60%] truncate">{item.value || '--'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
