import { supabase } from '../../../lib/supabase';

const API_KEY = import.meta.env.VITE_DATALASTIC_API_KEY;

export interface VesselPosition {
  lat: number;
  lon: number;
  speed?: number;
  course?: number;
  timestamp?: string;
}

export async function fetchLiveAISByVesselName(
  vesselName: string
): Promise<VesselPosition | null> {
  if (!vesselName) return null;

  // 1️⃣ Get IMO from vessels table
  const { data: vessel, error } = await supabase
    .from('vessels')
    .select('imo_number')
    .ilike('vessel_name', vesselName)
    .maybeSingle();

  if (error || !vessel?.imo_number) {
    console.warn('IMO not found for vessel:', vesselName);
    return null;
  }

  const imo = vessel.imo_number;

  // 2️⃣ Call Datalastic
  const url = `https://api.datalastic.com/api/v0/vessel?api-key=${API_KEY}&imo=${imo}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const json = await res.json();
  const pos = json?.data?.position;

  if (!pos?.lat || !pos?.lon) return null;

  return {
    lat: Number(pos.lat),
    lon: Number(pos.lon),
    speed: pos.speed,
    course: pos.course,
    timestamp: pos.timestamp
  };
}
