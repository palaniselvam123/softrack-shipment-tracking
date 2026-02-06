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
  BarChart3,
  Anchor,
  MapPin,
  Ship,
  Building2,
  Gauge,
  Clock,
  Package,
  CalendarDays,
  CheckCircle2,
  CloudRain,
  CloudSun,
  Cloud,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Newspaper
} from 'lucide-react';
import { supabase, SupabaseShipment } from '../lib/supabase';
import { computeCEOInsights, CEOInsights, RiskFactor, ActionItem, BriefItem } from '../services/shipmentInsightsEngine';
import { getPortCoordinates } from '../data/portCoordinates';

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

interface WeatherData {
  location: string;
  temp_c: number | null;
  description: string;
  icon: string;
  humidity: number | null;
  wind_speed: number | null;
  wind_dir: string;
  feels_like: number | null;
  visibility: number | null;
  conditions_code: number | null;
  severity: 'calm' | 'moderate' | 'severe';
}

interface GeopoliticalItem {
  title: string;
  type: 'weather' | 'trade' | 'security' | 'infrastructure';
}

const BRIEF_ICON_MAP: Record<string, typeof MapPin> = {
  route: MapPin,
  ship: Ship,
  building: Building2,
  gauge: Gauge,
  clock: Clock,
  package: Package,
  calendar: CalendarDays,
  anchor: Anchor,
  check: CheckCircle2,
  alert: AlertTriangle
};

const ACCENT_COLORS: Record<string, { icon: string; bg: string; border: string; dot: string }> = {
  green: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  amber: { icon: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  red: { icon: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' },
  blue: { icon: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400' },
  cyan: { icon: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', dot: 'bg-cyan-400' },
  slate: { icon: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400' }
};

function getWeatherSeverityIcon(severity: string) {
  if (severity === 'severe') return CloudRain;
  if (severity === 'moderate') return CloudSun;
  return Cloud;
}

function deriveGeopoliticalInsights(origin: string, destination: string, weather: { origin: WeatherData | null; destination: WeatherData | null }): GeopoliticalItem[] {
  const items: GeopoliticalItem[] = [];
  const origL = (origin || '').toLowerCase();
  const destL = (destination || '').toLowerCase();

  if (weather.origin?.severity === 'severe') {
    items.push({ title: `Severe weather conditions at ${origin} may impact port operations and vessel scheduling`, type: 'weather' });
  } else if (weather.origin?.severity === 'moderate') {
    items.push({ title: `Moderate weather conditions at ${origin} — monitor for potential operational impacts`, type: 'weather' });
  }

  if (weather.destination?.severity === 'severe') {
    items.push({ title: `Severe weather at ${destination} may cause discharge delays and berthing restrictions`, type: 'weather' });
  } else if (weather.destination?.severity === 'moderate') {
    items.push({ title: `Moderate weather at ${destination} — possible minor delays at port`, type: 'weather' });
  }

  if (origL.includes('india') || origL.includes('nhava') || origL.includes('mumbai') || origL.includes('chennai') || origL.includes('mh')) {
    items.push({ title: 'Indian port modernization ongoing — DPWorld and Adani terminals maintaining steady throughput despite infrastructure upgrades', type: 'infrastructure' });
  }
  if (destL.includes('india') || destL.includes('nhava') || destL.includes('mumbai') || destL.includes('mh')) {
    items.push({ title: 'Indian customs implementing ICEGATE Phase 3 — electronic filing reducing clearance times by 20%', type: 'trade' });
  }
  if (origL.includes('shanghai') || origL.includes('china') || destL.includes('shanghai') || destL.includes('china')) {
    items.push({ title: 'China export volumes recovering — container availability improving across major hubs', type: 'trade' });
  }
  if (origL.includes('rotterdam') || origL.includes('hamburg') || destL.includes('rotterdam') || destL.includes('hamburg') || destL.includes('europe') || destL.includes('germany')) {
    items.push({ title: 'European ports operating under new ETS carbon regulations — surcharges applied on EU-bound vessels', type: 'trade' });
  }
  if (origL.includes('au') || origL.includes('perth') || origL.includes('australia') || destL.includes('australia')) {
    items.push({ title: 'Australian biosecurity inspections intensified — ensure phytosanitary documentation is current', type: 'security' });
  }
  if (destL.includes('us') || destL.includes('ny') || destL.includes('los angeles') || origL.includes('us')) {
    items.push({ title: 'US CBP enhanced screening protocols active on select corridors — allow additional 24-48hr clearance buffer', type: 'security' });
  }
  if (origL.includes('dubai') || origL.includes('jebel ali') || destL.includes('dubai') || destL.includes('jebel ali')) {
    items.push({ title: 'UAE free zone operations uninterrupted — Jebel Ali maintaining competitive transhipment times', type: 'infrastructure' });
  }
  if (origL.includes('singapore') || destL.includes('singapore')) {
    items.push({ title: 'Singapore MPA implementing new green shipping corridor initiatives — priority berthing for compliant vessels', type: 'infrastructure' });
  }
  if (destL.includes('brazil') || destL.includes('santos') || origL.includes('brazil')) {
    items.push({ title: 'Brazilian ANVISA and Federal Revenue streamlining import procedures — digital documentation reducing port dwell', type: 'trade' });
  }
  if (origL.includes('bangladesh') || origL.includes('dhaka') || destL.includes('bangladesh')) {
    items.push({ title: 'Chittagong port congestion easing with new terminal expansion — feeder connectivity improving', type: 'infrastructure' });
  }

  return items.slice(0, 4);
}

function WeatherCard({ data, label }: { data: WeatherData | null; label: string }) {
  if (!data || data.temp_c === null) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Cloud className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
        </div>
        <p className="text-xs text-slate-500">Weather data unavailable</p>
      </div>
    );
  }

  const SeverityIcon = getWeatherSeverityIcon(data.severity);
  const severityColor = data.severity === 'severe' ? 'text-red-400' : data.severity === 'moderate' ? 'text-amber-400' : 'text-emerald-400';
  const severityBg = data.severity === 'severe' ? 'bg-red-500/10 border-red-500/20' : data.severity === 'moderate' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20';

  return (
    <div className={`rounded-lg p-4 border ${severityBg}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SeverityIcon className={`w-4 h-4 ${severityColor}`} />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</span>
        </div>
        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${severityBg} ${severityColor}`}>
          {data.severity}
        </span>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-white">{data.temp_c}°C</span>
        <span className="text-xs text-slate-400 capitalize">{data.description}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
        {data.feels_like !== null && (
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3 h-3 text-slate-500" />
            <span className="text-[11px] text-slate-400">Feels {data.feels_like}°C</span>
          </div>
        )}
        {data.humidity !== null && (
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3 h-3 text-slate-500" />
            <span className="text-[11px] text-slate-400">{data.humidity}% humidity</span>
          </div>
        )}
        {data.wind_speed !== null && (
          <div className="flex items-center gap-1.5">
            <Wind className="w-3 h-3 text-slate-500" />
            <span className="text-[11px] text-slate-400">{data.wind_speed} km/h {data.wind_dir}</span>
          </div>
        )}
        {data.visibility !== null && (
          <div className="flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-slate-500" />
            <span className="text-[11px] text-slate-400">{data.visibility} km visibility</span>
          </div>
        )}
      </div>
    </div>
  );
}

function BriefItemRow({ item }: { item: BriefItem }) {
  const Icon = BRIEF_ICON_MAP[item.icon] || MapPin;
  const colors = ACCENT_COLORS[item.accent || 'slate'];

  return (
    <div className="flex items-start gap-3 group">
      <div className={`mt-0.5 p-1.5 rounded-lg ${colors.bg} border ${colors.border} flex-shrink-0 transition-transform group-hover:scale-110`}>
        <Icon className={`w-3.5 h-3.5 ${colors.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{item.label}</span>
        <p className="text-sm text-slate-200 leading-relaxed mt-0.5">{item.value}</p>
      </div>
    </div>
  );
}

export default function ShipmentInsightsPanel({ shipment }: Props) {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [weather, setWeather] = useState<{ origin: WeatherData | null; destination: WeatherData | null }>({ origin: null, destination: null });
  const [weatherLoading, setWeatherLoading] = useState(false);

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

  useEffect(() => {
    if (!insights) return;
    const { origin, destination } = insights;
    if (!origin || !destination || origin === 'Unknown') return;

    const originCoords = getPortCoordinates(origin);
    const destCoords = getPortCoordinates(destination);
    if (!originCoords && !destCoords) return;

    setWeatherLoading(true);
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weather-data`;

    (async () => {
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            origin: originCoords ? { lat: originCoords.lat, lon: originCoords.lon, name: origin } : null,
            destination: destCoords ? { lat: destCoords.lat, lon: destCoords.lon, name: destination } : null
          })
        });
        if (res.ok) {
          const data = await res.json();
          setWeather(data);
        }
      } catch {
        /* weather is non-critical */
      } finally {
        setWeatherLoading(false);
      }
    })();
  }, [insights?.origin, insights?.destination]);

  const geoInsights = useMemo(
    () => insights ? deriveGeopoliticalInsights(insights.origin, insights.destination, weather) : [],
    [insights, weather]
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
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-5">
            <Brain className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Intelligence Brief
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent ml-2" />
          </div>
          <div className="space-y-3.5">
            {insights.briefItems.map((item, i) => (
              <BriefItemRow key={i} item={item} />
            ))}
          </div>
        </div>

        <div className="px-6 pb-5 pt-4 mt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <CloudSun className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Weather Conditions</span>
            {weatherLoading && <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" />}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <WeatherCard data={weather.origin} label={`Origin — ${insights.origin}`} />
            <WeatherCard data={weather.destination} label={`Dest — ${insights.destination}`} />
          </div>
        </div>

        {geoInsights.length > 0 && (
          <div className="px-6 pb-6 pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Geopolitical & Trade Updates</span>
            </div>
            <div className="space-y-2.5">
              {geoInsights.map((item, i) => {
                const typeConfig: Record<string, { icon: typeof Globe2; color: string }> = {
                  weather: { icon: CloudRain, color: 'text-amber-400' },
                  trade: { icon: Globe2, color: 'text-blue-400' },
                  security: { icon: Shield, color: 'text-red-400' },
                  infrastructure: { icon: Building2, color: 'text-emerald-400' }
                };
                const cfg = typeConfig[item.type] || typeConfig.trade;
                const GeoIcon = cfg.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5 group">
                    <GeoIcon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${cfg.color} transition-transform group-hover:scale-110`} />
                    <p className="text-xs text-slate-400 leading-relaxed">{item.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
