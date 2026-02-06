import { useEffect, useState, useMemo } from 'react';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  DollarSign,
  Globe2,
  ClipboardList,
  Shield,
  Users,
  Truck,
  FileCheck,
  ChevronRight,
  Zap,
  BarChart3,
  Anchor
} from 'lucide-react';
import { supabase, SupabaseShipment } from '../lib/supabase';
import { computeCEOInsights, CEOInsights, RiskFactor, ActionItem } from '../services/shipmentInsightsEngine';

interface Props {
  shipment: SupabaseShipment;
}

const PRIORITY_CONFIG: Record<ActionItem['priority'], { color: string; bg: string; border: string; label: string }> = {
  urgent: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', label: 'URGENT' },
  high: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: 'HIGH' },
  medium: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', label: 'MEDIUM' },
  low: { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', label: 'LOW' }
};

const CATEGORY_ICONS: Record<ActionItem['category'], typeof Truck> = {
  operations: Truck,
  finance: DollarSign,
  customer: Users,
  compliance: FileCheck
};

const LEVEL_COLORS: Record<RiskFactor['level'], { bar: string; text: string; bg: string }> = {
  low: { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  moderate: { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  high: { bar: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
  critical: { bar: 'bg-red-600', text: 'text-red-700', bg: 'bg-red-50' }
};

function ConfidenceGauge({ score, trend }: { score: number; trend: CEOInsights['confidenceTrend'] }) {
  const radius = 70;
  const arcLength = Math.PI * radius;
  const offset = arcLength * (1 - score / 100);
  const color = score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626';

  const TrendIcon = trend === 'improving' ? TrendingUp : trend === 'declining' ? TrendingDown : Minus;
  const trendColor = trend === 'improving' ? 'text-emerald-600' : trend === 'declining' ? 'text-red-600' : 'text-slate-500';
  const trendLabel = trend === 'improving' ? 'Improving' : trend === 'declining' ? 'Declining' : 'Stable';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-44 h-28">
        <path
          d="M 20 105 A 80 80 0 0 1 180 105"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 20 105 A 80 80 0 0 1 180 105"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <text x="100" y="88" textAnchor="middle" fontSize="36" fontWeight="700" fill={color}>
          {score}
        </text>
        <text x="100" y="108" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="500">
          CONFIDENCE
        </text>
      </svg>
      <div className={`flex items-center gap-1.5 mt-1 ${trendColor}`}>
        <TrendIcon className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">{trendLabel}</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sublabel, level }: { label: string; value: string; sublabel: string; level?: string }) {
  const levelColor = level === 'critical' ? 'text-red-600' : level === 'high' ? 'text-amber-600' : level === 'medium' ? 'text-blue-600' : 'text-slate-700';
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between min-h-[88px]">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-lg font-bold mt-1 ${level ? levelColor : 'text-slate-800'}`}>{value}</p>
      <p className="text-[11px] text-slate-400 mt-0.5">{sublabel}</p>
    </div>
  );
}

export default function ShipmentInsightsPanel({ shipment }: Props) {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('routes')
          .select('*')
          .eq('shipment_number', shipment['Shipment Number'])
          .order('LegNumber', { ascending: true });
        setRoutes(data || []);
      } catch {
        setRoutes([]);
      } finally {
        setLoaded(true);
      }
    })();
  }, [shipment]);

  const insights = useMemo(
    () => (loaded ? computeCEOInsights(shipment, routes) : null),
    [shipment, routes, loaded]
  );

  if (!insights) {
    return (
      <div className="mt-6 p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-5 animate-in fade-in">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
            Intelligence Brief
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{insights.summary}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-center">
          <ConfidenceGauge score={insights.confidenceScore} trend={insights.confidenceTrend} />
        </div>
        <MetricCard
          label="Cargo Exposure"
          value={insights.financial.estimatedExposure}
          sublabel="Freight + demurrage"
          level={insights.financial.impactLevel}
        />
        <MetricCard
          label="Demurrage Risk"
          value={insights.financial.demurrageRisk}
          sublabel={insights.financial.impactLevel !== 'low' ? 'Action recommended' : 'Within tolerance'}
          level={insights.financial.impactLevel}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-slate-500" />
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Risk Factors</h4>
        </div>
        <div className="space-y-3">
          {insights.riskFactors.map((risk, i) => {
            const colors = LEVEL_COLORS[risk.level];
            return (
              <div key={i} className={`rounded-lg p-3 ${colors.bg} border border-opacity-50`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-800">{risk.label}</span>
                  <span className={`text-xs font-semibold ${colors.text} uppercase`}>{risk.level}</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1.5 mb-2">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${colors.bar}`}
                    style={{ width: `${risk.score * 10}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{risk.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe2 className="w-4 h-4 text-slate-500" />
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Trade Lane Intelligence</h4>
        </div>
        <div className="flex gap-4 mb-4">
          <LaneBadge label="Congestion" value={insights.tradeLane.congestionLevel} />
          <LaneBadge label="Season" value={insights.tradeLane.seasonalRisk} />
          <LaneBadge label="Complexity" value={insights.tradeLane.complexity} />
        </div>
        <div className="space-y-2.5">
          {insights.tradeLane.points.map((pt, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <Anchor className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed">{pt}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="w-4 h-4 text-slate-500" />
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Recommended Actions</h4>
        </div>
        <p className="text-[11px] text-slate-400 mb-4 ml-6">Prioritized by business impact</p>
        <div className="space-y-3">
          {insights.actions.map((action, i) => {
            const cfg = PRIORITY_CONFIG[action.priority];
            const Icon = CATEGORY_ICONS[action.category];
            return (
              <div key={i} className={`rounded-lg border ${cfg.border} ${cfg.bg} p-3.5`}>
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded ${cfg.bg} ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold ${cfg.color} px-1.5 py-0.5 rounded ${cfg.bg} border ${cfg.border}`}>
                        {cfg.label}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">{action.category}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 mb-1">{action.action}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{action.rationale}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-cyan-600" />
          <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wide">Financial Outlook</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{insights.financial.insight}</p>
      </div>

      <p className="text-[10px] text-slate-400 text-center pb-2">
        Insights generated from live shipment data, port intelligence, and trade lane analytics
      </p>
    </div>
  );
}

function LaneBadge({ label, value }: { label: string; value: string }) {
  const colorMap: Record<string, string> = {
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    moderate: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-red-100 text-red-700 border-red-200',
    severe: 'bg-red-200 text-red-800 border-red-300',
    direct: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    complex: 'bg-red-100 text-red-700 border-red-200'
  };
  const cls = colorMap[value] || 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</span>
      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cls}`}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
    </div>
  );
}
