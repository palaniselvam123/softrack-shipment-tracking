const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface WeatherResult {
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

export interface WeatherPair {
  origin: WeatherResult | null;
  destination: WeatherResult | null;
}

export async function fetchWeatherForRoute(
  origin: { lat: number; lon: number; name: string } | null,
  destination: { lat: number; lon: number; name: string } | null
): Promise<WeatherPair> {
  const fallback: WeatherPair = { origin: null, destination: null };

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return fallback;
  if (!origin && !destination) return fallback;

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/weather-data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ origin, destination }),
    });

    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}
