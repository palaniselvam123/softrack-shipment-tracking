import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const WEATHER_API_KEY = Deno.env.get("WEATHER_API_KEY") || "";

interface WeatherResult {
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
  severity: "calm" | "moderate" | "severe";
}

function classifySeverity(code: number | null): WeatherResult["severity"] {
  if (!code) return "calm";
  if (code >= 200 && code < 300) return "severe";
  if (code >= 500 && code < 600) return "severe";
  if (code >= 600 && code < 700) return "moderate";
  if (code >= 700 && code < 800) return "moderate";
  if (code >= 300 && code < 400) return "moderate";
  return "calm";
}

function windDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

async function fetchWeather(location: string): Promise<WeatherResult> {
  const fallback: WeatherResult = {
    location,
    temp_c: null,
    description: "Weather data unavailable",
    icon: "01d",
    humidity: null,
    wind_speed: null,
    wind_dir: "",
    feels_like: null,
    visibility: null,
    conditions_code: null,
    severity: "calm",
  };

  try {
    if (!WEATHER_API_KEY) return fallback;

    const cleanLocation = location
      .replace(/\b(port|terminal|hub|zone|free zone)\b/gi, "")
      .replace(/,\s*(mh|au|in|uk|us|de|ae|sg|br|bd|vn|be|fr)\s*$/i, (_, code) => {
        const map: Record<string, string> = {
          mh: ",IN", au: ",AU", in: ",IN", uk: ",GB", us: ",US",
          de: ",DE", ae: ",AE", sg: ",SG", br: ",BR", bd: ",BD",
          vn: ",VN", be: ",BE", fr: ",FR",
        };
        return map[code.toLowerCase()] || `,${code}`;
      })
      .trim();

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanLocation)}&appid=${WEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);

    if (!res.ok) return fallback;

    const data = await res.json();

    return {
      location,
      temp_c: Math.round(data.main?.temp ?? 0),
      description: data.weather?.[0]?.description || "Unknown",
      icon: data.weather?.[0]?.icon || "01d",
      humidity: data.main?.humidity ?? null,
      wind_speed: data.wind?.speed ? Math.round(data.wind.speed * 3.6) : null,
      wind_dir: data.wind?.deg ? windDirection(data.wind.deg) : "",
      feels_like: data.main?.feels_like ? Math.round(data.main.feels_like) : null,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : null,
      conditions_code: data.weather?.[0]?.id ?? null,
      severity: classifySeverity(data.weather?.[0]?.id ?? null),
    };
  } catch {
    return fallback;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { origin, destination } = await req.json();

    const [originWeather, destinationWeather] = await Promise.all([
      origin ? fetchWeather(origin) : Promise.resolve(null),
      destination ? fetchWeather(destination) : Promise.resolve(null),
    ]);

    return new Response(
      JSON.stringify({ origin: originWeather, destination: destinationWeather }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
