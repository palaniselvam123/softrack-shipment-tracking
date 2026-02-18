import React, { useState } from 'react';
import { Ship, Plane, ArrowRight, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Schedule } from '../types/quotation';
import { getMinRate } from '../data/charges';

interface CarrierRateComparisonProps {
  schedules: Schedule[];
  onSelect: (schedule: Schedule) => void;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

interface GroupedSchedule {
  etdKey: string;
  etdDate: Date;
  schedules: Schedule[];
}

function groupByEtdWindow(schedules: Schedule[]): GroupedSchedule[] {
  const groups: Record<string, GroupedSchedule> = {};
  for (const s of schedules) {
    const d = s.etd;
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    if (!groups[key]) {
      groups[key] = { etdKey: key, etdDate: s.etd, schedules: [] };
    }
    groups[key].schedules.push(s);
    if (s.etd < groups[key].etdDate) groups[key].etdDate = s.etd;
  }
  return Object.values(groups).sort((a, b) => a.etdDate.getTime() - b.etdDate.getTime());
}

const CarrierRateComparison: React.FC<CarrierRateComparisonProps> = ({ schedules, onSelect }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set([Object.values(groupByEtdWindow(schedules))[0]?.etdKey || '']));

  const groups = groupByEtdWindow(schedules);
  const allContainerTypes = Array.from(new Set(schedules.flatMap(s => s.freightRates.map(r => r.containerType))));
  const isFCL = schedules[0]?.mode === 'sea_fcl';
  const isAir = schedules[0]?.mode === 'air';

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {groups.map(group => {
        const isExpanded = expandedGroups.has(group.etdKey);
        const cheapest = [...group.schedules].sort((a, b) => {
          const aMin = Math.min(...a.freightRates.map(r => r.amount));
          const bMin = Math.min(...b.freightRates.map(r => r.amount));
          return aMin - bMin;
        })[0];

        return (
          <div key={group.etdKey} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleGroup(group.etdKey)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[80px]">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ETD Week</div>
                  <div className="font-bold text-gray-900 text-sm mt-0.5">{formatShortDate(group.etdDate)}</div>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="flex items-center gap-2 flex-wrap">
                  {group.schedules.map(s => (
                    <div
                      key={s.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: s.carrierColor }}
                    >
                      <span>{s.carrierCode}</span>
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-400">{group.schedules.length} carrier{group.schedules.length > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-gray-400">Best Rate From</div>
                  <div className="font-black text-gray-900 text-base">
                    {getMinRate(cheapest).currency} {getMinRate(cheapest).amount.toLocaleString()}
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100 overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Carrier</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ETD → ETA</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transit</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Routing</th>
                      {isFCL ? allContainerTypes.map(ct => (
                        <th key={ct} className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{ct}</th>
                      )) : (
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {isAir ? 'Per KG' : 'Per CBM'}
                        </th>
                      )}
                      <th className="py-3 px-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {group.schedules.map((s, idx) => {
                      const isLowest = s.id === cheapest.id;
                      return (
                        <tr
                          key={s.id}
                          className={`border-b border-gray-50 last:border-0 hover:bg-sky-50/40 transition-colors ${isLowest ? 'bg-emerald-50/30' : ''}`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                                style={{ backgroundColor: s.carrierColor }}
                              >
                                {s.carrierCode.slice(0, 3)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-sm leading-tight">{s.carrierName}</div>
                                <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                  {isAir ? <Plane className="w-3 h-3" /> : <Ship className="w-3 h-3" />}
                                  {isAir ? s.flightNo : `${s.vesselName}`}
                                </div>
                              </div>
                              {isLowest && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">Best</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-sm">
                              <span className="font-semibold text-gray-900">{formatShortDate(s.etd)}</span>
                              <ArrowRight className="w-3 h-3 text-gray-300" />
                              <span className="font-semibold text-gray-900">{formatShortDate(s.eta)}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="font-semibold">{s.transitDays}d</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {s.isDirect ? (
                              <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                                <CheckCircle className="w-3 h-3" />Direct
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                                <AlertCircle className="w-3 h-3" />Via {s.transitPortName}
                              </span>
                            )}
                          </td>
                          {isFCL ? allContainerTypes.map(ct => {
                            const rate = s.freightRates.find(r => r.containerType === ct);
                            const isMin = rate && rate.amount === Math.min(...s.freightRates.map(r => r.amount));
                            return (
                              <td key={ct} className="py-3.5 px-4 text-right">
                                {rate ? (
                                  <div>
                                    <div className={`font-bold text-sm ${isMin ? 'text-sky-700' : 'text-gray-800'}`}>
                                      ${rate.amount.toLocaleString()}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-300 text-sm">—</span>
                                )}
                              </td>
                            );
                          }) : (
                            <td className="py-3.5 px-4 text-right">
                              <div className="font-bold text-sm text-sky-700">
                                {s.freightRates[0]?.currency} {s.freightRates[0]?.amount.toLocaleString()}
                              </div>
                            </td>
                          )}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => onSelect(s)}
                              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm whitespace-nowrap"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CarrierRateComparison;
