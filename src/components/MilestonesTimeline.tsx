import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  Circle,
  XCircle,
  Clock,
  Ship,
  Plane,
  Truck,
  Package,
  FileText,
  Anchor,
  MapPin,
  ShieldCheck,
  ClipboardList,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  generateMilestonesForShipment,
  detectLOB,
  type GeneratedMilestone,
  type LOB
} from '../data/milestoneTemplates';

interface MilestonesTimelineProps {
  shipmentNo: string;
  shipmentData?: any;
}

const LOB_COLORS: Record<LOB, { bg: string; text: string; border: string; accent: string }> = {
  'Sea Export': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-600' },
  'Air Export': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', accent: 'bg-cyan-600' },
  'Air Import': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', accent: 'bg-teal-600' },
  'Road Domestic': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', accent: 'bg-amber-600' },
};

const LOB_ICONS: Record<LOB, React.ReactNode> = {
  'Sea Export': <Ship className="w-4 h-4" />,
  'Air Export': <Plane className="w-4 h-4" />,
  'Air Import': <Plane className="w-4 h-4" />,
  'Road Domestic': <Truck className="w-4 h-4" />,
};

function getMilestoneIcon(name: string): React.ReactNode {
  const lower = name.toLowerCase();
  if (lower.includes('booking') || lower.includes('order') || lower.includes('purchase'))
    return <ClipboardList className="w-3.5 h-3.5" />;
  if (lower.includes('cargo') || lower.includes('container') || lower.includes('loaded') || lower.includes('stuffing'))
    return <Package className="w-3.5 h-3.5" />;
  if (lower.includes('customs') || lower.includes('clearance'))
    return <ShieldCheck className="w-3.5 h-3.5" />;
  if (lower.includes('document') || lower.includes('bill') || lower.includes('awb') || lower.includes('vgm'))
    return <FileText className="w-3.5 h-3.5" />;
  if (lower.includes('vessel') || lower.includes('aircraft') || lower.includes('departed') || lower.includes('dispatch'))
    return <Anchor className="w-3.5 h-3.5" />;
  if (lower.includes('transit'))
    return <Clock className="w-3.5 h-3.5" />;
  if (lower.includes('arrived') || lower.includes('destination') || lower.includes('delivered') || lower.includes('released') || lower.includes('checkpoint'))
    return <MapPin className="w-3.5 h-3.5" />;
  if (lower.includes('vehicle'))
    return <Truck className="w-3.5 h-3.5" />;
  return <Circle className="w-3.5 h-3.5" />;
}

const MilestonesTimeline: React.FC<MilestonesTimelineProps> = ({ shipmentNo, shipmentData }) => {
  const [milestones, setMilestones] = useState<GeneratedMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  const lob = detectLOB(shipmentNo);
  const colors = LOB_COLORS[lob];

  useEffect(() => {
    loadMilestones();
  }, [shipmentNo]);

  const loadMilestones = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('shipment_number', shipmentNo)
        .order('milestone_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setMilestones(data as GeneratedMilestone[]);
      } else {
        const mockStatus = shipmentData?.shipment_status || shipmentData?.status;
        const etd = shipmentData?.ETD || shipmentData?.etd;
        const eta = shipmentData?.ETA || shipmentData?.eta;
        const generated = generateMilestonesForShipment(shipmentNo, mockStatus, etd, eta);
        setMilestones(generated);
      }
    } catch {
      const mockStatus = shipmentData?.shipment_status || shipmentData?.status;
      const generated = generateMilestonesForShipment(shipmentNo, mockStatus);
      setMilestones(generated);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const skippedCount = milestones.filter(m => m.status === 'skipped').length;
  const totalCount = milestones.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`${colors.bg} rounded-xl border ${colors.border} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${colors.accent} rounded-lg flex items-center justify-center text-white`}>
              {LOB_ICONS[lob]}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Shipment Milestones</h2>
              <p className={`text-sm ${colors.text} font-medium`}>{lob}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">{progressPercent}%</span>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
        </div>

        <div className="w-full bg-white/80 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${colors.accent}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-600">{completedCount} Completed</span>
            </div>
            {skippedCount > 0 && (
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">{skippedCount} Skipped</span>
              </div>
            )}
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600">{totalCount - completedCount - skippedCount} Pending</span>
            </div>
          </div>
          <span className="text-xs text-gray-500">{totalCount} total milestones</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Timeline</h3>
        </div>

        <div className="p-5">
          <div className="relative">
            {milestones.map((milestone, index) => {
              const isLast = index === milestones.length - 1;
              const isCompleted = milestone.status === 'completed';
              const isSkipped = milestone.status === 'skipped';
              const isPending = milestone.status === 'pending';

              const nextCompleted = !isLast && milestones[index + 1]?.status === 'completed';
              const lineColor = isCompleted && nextCompleted
                ? 'bg-emerald-400'
                : isCompleted && !isLast
                  ? 'bg-gradient-to-b from-emerald-400 to-gray-200'
                  : 'bg-gray-200';

              return (
                <div key={milestone.id} className="flex group">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                      isCompleted
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-600'
                        : isSkipped
                          ? 'bg-red-100 border-red-400 text-red-500'
                          : 'bg-gray-50 border-gray-300 text-gray-400'
                    } ${!isPending ? '' : 'group-hover:border-gray-400 group-hover:bg-gray-100'}`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : isSkipped ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        getMilestoneIcon(milestone.milestone_name)
                      )}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 min-h-[40px] ${lineColor}`} />
                    )}
                  </div>

                  <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
                    <div className={`rounded-lg border p-3.5 transition-all duration-200 ${
                      isCompleted
                        ? 'bg-emerald-50/50 border-emerald-200 hover:shadow-sm'
                        : isSkipped
                          ? 'bg-red-50/50 border-red-200 hover:shadow-sm'
                          : 'bg-gray-50/50 border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              isCompleted ? 'text-emerald-600' : isSkipped ? 'text-red-500' : 'text-gray-400'
                            }`}>
                              Step {milestone.milestone_order}
                            </span>
                            {isCompleted && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-700 rounded uppercase">
                                Done
                              </span>
                            )}
                            {isSkipped && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-100 text-red-700 rounded uppercase">
                                Skipped
                              </span>
                            )}
                            {isPending && index === completedCount + skippedCount && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-100 text-blue-700 rounded uppercase animate-pulse">
                                Next
                              </span>
                            )}
                          </div>
                          <h4 className={`text-sm font-medium mt-1 ${
                            isCompleted ? 'text-gray-900' : isSkipped ? 'text-red-800' : 'text-gray-500'
                          }`}>
                            {milestone.milestone_name}
                          </h4>
                        </div>
                        {isCompleted && milestone.completed_date && (
                          <div className="text-right ml-4 flex-shrink-0">
                            <p className="text-xs font-semibold text-emerald-700">{formatDate(milestone.completed_date)}</p>
                            <p className="text-[10px] text-emerald-600">{formatTime(milestone.completed_date)}</p>
                          </div>
                        )}
                        {isSkipped && (
                          <div className="text-right ml-4 flex-shrink-0">
                            <p className="text-xs font-medium text-red-600">Not applicable</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestonesTimeline;
