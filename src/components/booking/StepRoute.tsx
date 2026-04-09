import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { BookingData } from './bookingData';
import LocationSelector from '../LocationSelector';

interface Props {
  data: BookingData;
  onChange: (field: string, value: unknown) => void;
}

export default function StepRoute({ data, onChange }: Props) {
  const transportFilter = data.transportMode === 'air' ? 'air' : data.transportMode === 'sea' ? 'sea' : 'all';

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Route</h3>
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/60 rounded-2xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-4 items-start">
            <div>
              <LocationSelector
                value={data.originLocation}
                onChange={value => onChange('originLocation', value)}
                label="Origin"
                placeholder="Search origin port or city..."
                transportMode={transportFilter}
                required
              />
            </div>
            <div className="hidden lg:flex items-center justify-center pt-8">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-sky-200 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-sky-500" />
              </div>
            </div>
            <div>
              <LocationSelector
                value={data.destinationLocation}
                onChange={value => onChange('destinationLocation', value)}
                label="Destination"
                placeholder="Search destination port or city..."
                transportMode={transportFilter}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {data.movementType === 'Door-to-Door' && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Pickup & Delivery Locations</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <LocationSelector
              value={data.pickupLocation || ''}
              onChange={value => onChange('pickupLocation', value)}
              label="Pickup Location"
              placeholder="Select pickup address"
              transportMode="all"
              required
            />
            <LocationSelector
              value={data.deliveryLocation || ''}
              onChange={value => onChange('deliveryLocation', value)}
              label="Delivery Location"
              placeholder="Select delivery address"
              transportMode="all"
              required
            />
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Schedule</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Requested Pickup Date</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={data.pickupDate}
                onChange={e => onChange('pickupDate', e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Delivery Date</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={data.deliveryDate}
                onChange={e => onChange('deliveryDate', e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
