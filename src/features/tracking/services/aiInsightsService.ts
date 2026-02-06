export interface CustomerInsight {
  status: "On track" | "Minor delay" | "Delayed";
  summary: string;
  observations: string[];
  external_factors: string[];
  forecast: string;
}

function deriveStatus(route: any): CustomerInsight["status"] {
  if (route.DelayDays > 0 || route.WasRolled) return "Minor delay";
  if (route.PortCongestion >= 7) return "Delayed";
  return "On track";
}

export async function getRouteInsights(route: any): Promise<CustomerInsight> {
  const res = await fetch("http://localhost:3001/api/ai-insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(route)
  });

  const { structured } = await res.json();

  return {
    status: deriveStatus(route),
    summary: structured.summary,
    observations: structured.reasons ?? [],
    external_factors: structured.external_factors ?? [],
    forecast: structured.forecast
  };
}

export async function getShipmentSummary(
  shipmentNo: string,
  legs: CustomerInsight[]
): Promise<CustomerInsight> {
  const res = await fetch("http://localhost:3001/api/ai-insights-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shipmentNumber: shipmentNo, legs })
  });

  const { structured } = await res.json();

  return {
    status: "On track",
    summary: structured.summary,
    observations: [],
    external_factors: [],
    forecast: structured.forecast
  };
}
