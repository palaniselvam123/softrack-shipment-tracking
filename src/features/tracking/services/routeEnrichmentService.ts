// routeEnrichmentService.ts
// Attaches LIVE weather + news to a route object

export async function enrichRoute(route: any): Promise<any> {
  const enriched = { ...route };

  /* ---------------- WEATHER ---------------- */
  try {
    if (route["Load Port"]) {
      const res = await fetch(
        `/api/weather?port=${encodeURIComponent(route["Load Port"])}`
      );

      if (res.ok) {
        enriched.weather = await res.json();
      }
    }
  } catch (err) {
    console.warn("Weather fetch failed", err);
  }

  /* ---------------- NEWS ---------------- */
  try {
    const region =
      route["Load Port"] || route["Discharge Port"] || "";

    if (region) {
      const res = await fetch(
        `/api/news?query=${encodeURIComponent(region)}`
      );

      if (res.ok) {
        enriched.news = await res.json();
      }
    }
  } catch (err) {
    console.warn("News fetch failed", err);
  }

  return enriched;
}
