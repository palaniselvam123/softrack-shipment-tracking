import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

import MapDisplay from './MapDisplay';
import AIInsightsPanel from './AIInsightsPanel';

interface VesselTrackerProps {
  shipmentNo: string;
}

const DATALASTIC_API_KEY = import.meta.env.VITE_DATALASTIC_API_KEY;

const VesselTracker = ({ shipmentNo }: VesselTrackerProps) => {
  const [vessels, setVessels] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [nearbyVessels] = useState<any[]>([]); // reserved for future use
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shipmentNo) return;
    loadTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipmentNo]);

  const loadTracking = async () => {
    setLoading(true);
    setError(null);

    try {
      /* 1️⃣ Load route legs */
      const { data: routeRows, error: routeErr } = await supabase
        .from('routes')
        .select(`
          "Route No",
          shipment_number,
          vessel_name,
          "ETD",
          "ETA",
          "LegNumber",
          "WasRolled",
          "PaymentStatus",
          "DocumentSubmitted",
          "WeatherSeverity",
          "PortCongestion",
          "Transit Days",
          "Estimated Transit Days",
          "Delay Days"
        `)
        .eq('shipment_number', shipmentNo)
        .order('LegNumber', { ascending: true });

      if (routeErr) throw routeErr;

      setRoutes(routeRows || []);

      if (!routeRows || routeRows.length === 0) {
        setVessels([]);
        return;
      }

      /* 2️⃣ Resolve IMO numbers */
      const vesselNames = routeRows
        .map(r => r.vessel_name)
        .filter(Boolean);

      if (vesselNames.length === 0) {
        setVessels([]);
        return;
      }

      const { data: vesselRows } = await supabase
        .from('vessels')
        .select('vessel_name, imo_number')
        .in('vessel_name', vesselNames);

      if (!vesselRows || vesselRows.length === 0) {
        setVessels([]);
        return;
      }

      const imoMap = new Map(
        vesselRows.map(v => [v.vessel_name, String(v.imo_number)])
      );

      /* 3️⃣ Fetch AIS tracks per leg */
      const allTracks: any[] = [];

      for (const r of routeRows) {
        const imo = imoMap.get(r.vessel_name);
        if (!imo || !r.ETD || !r.ETA) continue;

        const from = new Date(r.ETD).toISOString().slice(0, 10);
        const to = new Date(r.ETA).toISOString().slice(0, 10);

        const url =
          `https://api.datalastic.com/api/v0/vessel_history` +
          `?api-key=${DATALASTIC_API_KEY}` +
          `&imo=${imo}` +
          `&from=${from}` +
          `&to=${to}`;

        const res = await fetch(url);
        if (!res.ok) continue;

        const json = await res.json();
        if (!json?.data?.positions?.length) continue;

        allTracks.push({
          imo,
          name: r.vessel_name,
          leg: r.LegNumber,
          positions: json.data.positions.map((p: any) => ({
            lat: Number(p.lat),
            lon: Number(p.lon),
            timestamp: p.timestamp,
            speed: p.speed,
          })),
        });
      }

      setVessels(allTracks);
    } catch (e: any) {
      console.error('VesselTracker error:', e);
      setError(e.message || 'Tracking failed');
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  if (loading) {
    return <div className="text-sm text-gray-500">Loading live AIS data…</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* 🗺 MAP (show even if no AIS yet) */}
      <MapDisplay
        vessels={vessels}
        nearbyVessels={nearbyVessels}
      />

      {/* 🤖 CUSTOMER AI INSIGHTS */}
      <AIInsightsPanel
        shipmentNo={shipmentNo}
        routes={routes}
      />

      {/* Fallback message if AIS not available */}
      {vessels.length === 0 && (
        <div className="text-sm text-gray-400">
          Live vessel position is currently unavailable.
        </div>
      )}
    </div>
  );
};

export default VesselTracker;
