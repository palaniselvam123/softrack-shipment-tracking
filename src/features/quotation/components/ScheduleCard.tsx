import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Ship, Plane, Clock, ArrowRight, Anchor, AlertCircle } from 'lucide-react';
import { Schedule } from '../types/quotation';
import { getMinRate } from '../data/charges';

interface ScheduleCardProps {
  schedule: Schedule;
  onSelect: (schedule: Schedule) => void;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function formatDayOfWeek(date: Date): string {
  return date.toLocaleDateString('en-IN', { weekday: 'short' });
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const minRate = getMinRate(schedule);
  const isAir = schedule.mode === 'air';

  const carrierInitials = schedule.carrierCode.slice(0, 3).toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm flex-shrink-0"
              style={{ backgroundColor: schedule.carrierColor }}
            >
              {carrierInitials}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 text-sm truncate">{schedule.carrierName}</div>
              <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                {isAir ? (
                  <><Plane className="w-3 h-3" />{schedule.flightNo}</>
                ) : (
                  <><Ship className="w-3 h-3" />{schedule.vesselName} · {schedule.voyageNo}</>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-1 justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{formatShortDate(schedule.etd)}</div>
              <div className="text-xs text-gray-500">{formatDayOfWeek(schedule.etd)}</div>
              <div className="text-xs font-semibold text-sky-700 mt-0.5">{schedule.originPort}</div>
            </div>

            <div className="flex flex-col items-center gap-1 flex-1 min-w-0 max-w-[180px]">
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                <Clock className="w-3 h-3" />
                {schedule.transitDays} days
              </div>
              <div className="relative w-full flex items-center">
                <div className="h-0.5 w-full bg-gradient-to-r from-sky-300 via-sky-400 to-sky-300"></div>
                {!schedule.isDirect && (
                  <div className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white shadow-sm"></div>
                )}
              </div>
              <div className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                schedule.isDirect
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {schedule.isDirect ? 'Direct' : `Via ${schedule.transitPortName}`}
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{formatShortDate(schedule.eta)}</div>
              <div className="text-xs text-gray-500">{formatDayOfWeek(schedule.eta)}</div>
              <div className="text-xs font-semibold text-sky-700 mt-0.5">{schedule.destinationPort}</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="text-xs text-gray-400">From</div>
              <div className="text-xl font-black text-gray-900">
                {minRate.currency} {minRate.amount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                {schedule.mode === 'air' ? 'per kg' : schedule.mode === 'sea_lcl' ? 'per CBM' : 'per container'}
              </div>
            </div>
            <button
              onClick={() => onSelect(schedule)}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 transition-all duration-200 shadow-sm hover:shadow-sky-200 hover:shadow-md"
            >
              Select <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Anchor className="w-3 h-3" />
              {schedule.originPortName} → {schedule.destinationPortName}
            </span>
            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">{schedule.frequency}</span>
            {schedule.mode === 'sea_fcl' && (
              <span className="text-gray-500">
                {schedule.freightRates.map(r => `${r.containerType}`).join(' · ')}
              </span>
            )}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-semibold transition-colors"
          >
            {expanded ? <><ChevronUp className="w-3.5 h-3.5" />Hide legs</> : <><ChevronDown className="w-3.5 h-3.5" />View legs & details</>}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-5">
          <div className="space-y-3 mb-4">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Route Details</div>
            {schedule.legs.map((leg, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700 text-xs font-bold">
                    {idx + 1}
                  </div>
                  {idx < schedule.legs.length - 1 && (
                    <div className="w-0.5 h-8 bg-sky-200 mt-1"></div>
                  )}
                </div>
                <div className="flex-1 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{leg.fromPortName}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-bold text-gray-900 text-sm">{leg.toPortName}</span>
                    </div>
                    <span className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-semibold">
                      {leg.transitDays} days
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>ETD: <strong className="text-gray-700">{formatDate(leg.etd)}</strong></span>
                    <span>ETA: <strong className="text-gray-700">{formatDate(leg.eta)}</strong></span>
                    {isAir ? (
                      <span>Flight: <strong className="text-gray-700">{leg.flightNo}</strong></span>
                    ) : (
                      <span>Vessel: <strong className="text-gray-700">{leg.vesselName} · {leg.voyageNo}</strong></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Freight Rates</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {schedule.freightRates.map(rate => (
                <div key={rate.containerType} className="bg-white rounded-xl p-3 border border-gray-100 text-center shadow-sm">
                  <div className="text-xs font-bold text-gray-500">{rate.containerType}</div>
                  <div className="text-base font-black text-gray-900 mt-0.5">
                    {rate.currency} {rate.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">{rate.unit.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>

          {schedule.cutoffDate && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Cargo Cut-off: <strong>{formatDate(schedule.cutoffDate)}</strong> — Document Cut-off: <strong>{formatDate(schedule.cutoffDate)}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;
