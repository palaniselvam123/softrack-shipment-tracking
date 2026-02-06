import { useEffect, useState } from "react";
import {
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  MapPin,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { TrackedShipment } from "../types/tracking";
import { fetchWeatherForRoute, WeatherResult } from "../services/externalDataService";

interface Props {
  shipments: TrackedShipment[];
}

const SEVERITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  calm: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  moderate: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  severe: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

function WeatherCard({ data, label }: { data: WeatherResult | null; label: string }) {
  if (!data) {
    return (
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
        <div className="flex items-center gap-1.5 mb-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">{label}</span>
        </div>
        <p className="text-xs text-slate-400">No weather data</p>
      </div>
    );
  }

  const sev = SEVERITY_STYLES[data.severity] || SEVERITY_STYLES.calm;

  return (
    <div className={`rounded-lg p-3 border ${sev.bg} ${sev.border}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-medium text-slate-700">{label}</span>
        </div>
        <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${sev.text} ${sev.bg}`}>
          {data.severity}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Thermometer className="w-4 h-4 text-slate-500" />
        <span className="text-lg font-semibold text-slate-800">
          {data.temp_c !== null ? `${data.temp_c}\u00B0C` : '--'}
        </span>
        <span className="text-xs text-slate-500 capitalize">{data.description}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <Droplets className="w-3 h-3" />
          <span>{data.humidity !== null ? `${data.humidity}%` : '--'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3" />
          <span>{data.wind_speed !== null ? `${data.wind_speed} km/h ${data.wind_dir}` : '--'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          <span>{data.visibility !== null ? `${data.visibility} km` : '--'}</span>
        </div>
      </div>
    </div>
  );
}

function ShipmentStatusBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s.includes('delay')) {
    return (
      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
        <AlertTriangle className="w-3 h-3" /> Delayed
      </span>
    );
  }
  if (s.includes('transit') || s.includes('active')) {
    return (
      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
        <Clock className="w-3 h-3" /> In Transit
      </span>
    );
  }
  if (s.includes('deliver')) {
    return (
      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="w-3 h-3" /> Delivered
      </span>
    );
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
      {status}
    </span>
  );
}

interface ShipmentWeather {
  origin: WeatherResult | null;
  destination: WeatherResult | null;
}

export default function AIInsightsPanel({ shipments }: Props) {
  const [weatherMap, setWeatherMap] = useState<Record<string, ShipmentWeather>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shipments.length) return;

    setLoading(true);

    (async () => {
      const results: Record<string, ShipmentWeather> = {};

      const fetches = shipments.slice(0, 10).map(async (s) => {
        const originLoc = s.origin_lat && s.origin_lng
          ? { lat: s.origin_lat, lon: s.origin_lng, name: s.origin }
          : null;
        const destLoc = s.dest_lat && s.dest_lng
          ? { lat: s.dest_lat, lon: s.dest_lng, name: s.destination }
          : null;

        const weather = await fetchWeatherForRoute(originLoc, destLoc);
        results[s.id] = weather;
      });

      await Promise.all(fetches);
      setWeatherMap(results);
      setLoading(false);
    })();
  }, [shipments]);

  if (!shipments.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <CloudSun className="w-5 h-5 text-teal-600" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Weather & Insights
          </h3>
        </div>
        <p className="text-sm text-slate-500">No active shipments to show weather for.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <CloudSun className="w-5 h-5 text-teal-600" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-700">
          Route Weather Conditions
        </h3>
        {loading && <Loader2 className="w-4 h-4 text-teal-500 animate-spin ml-2" />}
      </div>

      <div className="divide-y divide-slate-100">
        {shipments.slice(0, 10).map((s) => {
          const weather = weatherMap[s.id];

          return (
            <div key={s.id} className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-800">
                    {s.shipment_number}
                  </span>
                  <span className="text-xs text-slate-500">
                    {s.origin} &rarr; {s.destination}
                  </span>
                </div>
                <ShipmentStatusBadge status={s.shipment_status} />
              </div>

              {!weather && loading ? (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading weather...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <WeatherCard
                    data={weather?.origin ?? null}
                    label={`Origin - ${s.origin}`}
                  />
                  <WeatherCard
                    data={weather?.destination ?? null}
                    label={`Dest - ${s.destination}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
