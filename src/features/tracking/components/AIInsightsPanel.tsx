import { useEffect, useState } from "react";
import {
  getRouteInsights,
  getShipmentSummary,
  CustomerInsight
} from "../services/aiInsightsService";
import { getWeatherIcon } from "./weatherIcons";

interface Props {
  shipmentNo: string;
  routes: any[];
}

const badge: Record<CustomerInsight["status"], string> = {
  "On track": "bg-green-100 text-green-700",
  "Minor delay": "bg-yellow-100 text-yellow-700",
  "Delayed": "bg-red-100 text-red-700"
};

export default function AIInsightsPanel({ shipmentNo, routes }: Props) {
  const [legs, setLegs] = useState<CustomerInsight[]>([]);
  const [summary, setSummary] = useState<CustomerInsight | null>(null);

  useEffect(() => {
    if (!routes?.length) return;

    (async () => {
      const legInsights = await Promise.all(
        routes.map(r => getRouteInsights(r))
      );

      setLegs(legInsights);
      setSummary(await getShipmentSummary(shipmentNo, legInsights));
    })();
  }, [routes, shipmentNo]);

  if (!legs.length) return null;

  return (
    <div className="mt-8 space-y-6">
      {summary && (
        <div className="border rounded p-4 bg-white">
          <h3 className="font-semibold mb-1">Shipment status overview</h3>
          <p className="text-sm">{summary.summary}</p>
          <p className="text-xs italic mt-1 text-slate-500">
            {summary.forecast}
          </p>
        </div>
      )}

      {legs.map((l, i) => {
        const weather = l.external_factors.find(f =>
          f.toLowerCase().includes("weather")
        );

        const news = l.external_factors.filter(f =>
          f.toLowerCase().includes("news")
        );

        return (
          <div key={i} className="border rounded p-4 bg-slate-50">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Route segment {i + 1}</span>
              <span className={`px-2 py-1 text-xs rounded ${badge[l.status]}`}>
                {l.status}
              </span>
            </div>

            <p className="text-sm mb-2">{l.summary}</p>

            {weather && (
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                {getWeatherIcon(weather)}
                <span>{weather}</span>
              </div>
            )}

            {news.length > 0 && (
              <ul className="list-disc ml-5 text-xs text-slate-600 space-y-1">
                {news.map((n, idx) => (
                  <li key={idx}>{n}</li>
                ))}
              </ul>
            )}

            <p className="text-xs italic mt-2 text-slate-500">
              {l.forecast}
            </p>
          </div>
        );
      })}
    </div>
  );
}
