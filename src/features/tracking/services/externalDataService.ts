const WEATHER_API = import.meta.env.VITE_WEATHER_API_URL;
const NEWS_API = import.meta.env.VITE_NEWS_API_URL;

export interface ExternalFacts {
  weather?: {
    description?: string;
    severity?: string;
    temp_c?: number;
  };
  news?: {
    title: string;
    source?: string;
  }[];
}

export async function fetchExternalFacts(route: any): Promise<ExternalFacts> {
  const facts: ExternalFacts = {};

  /* ---------- WEATHER ---------- */
  try {
    if (WEATHER_API && route["Load Port"]) {
      const res = await fetch(
        `${WEATHER_API}?port=${encodeURIComponent(route["Load Port"])}`
      );
      if (res.ok) {
        const w = await res.json();
        facts.weather = {
          description: w.description,
          severity: w.severity,
          temp_c: w.temp_c
        };
      }
    }
  } catch (e) {
    console.warn("Weather fetch failed", e);
  }

  /* ---------- NEWS ---------- */
  try {
    if (NEWS_API && route["Load Port"]) {
      const res = await fetch(
        `${NEWS_API}?q=${encodeURIComponent(route["Load Port"])}`
      );
      if (res.ok) {
        const n = await res.json();
        facts.news = (n.articles || []).slice(0, 3).map((a: any) => ({
          title: a.title,
          source: a.source?.name
        }));
      }
    }
  } catch (e) {
    console.warn("News fetch failed", e);
  }

  return facts;
}
