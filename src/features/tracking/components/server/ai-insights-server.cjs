/* ============================================================
   AI INSIGHTS SERVER (Customer Safe)
   ============================================================ */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../../../../.env") });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = global.fetch || require("node-fetch");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const WEATHER_KEY = process.env.WEATHER_API_KEY;
const NEWS_KEY = process.env.NEWS_API_KEY;

console.log(
  "OPENAI:", !!OPENAI_KEY,
  "WEATHER:", !!WEATHER_KEY,
  "NEWS:", !!NEWS_KEY
);

// ---------------- helpers ----------------

async function callOpenAI(prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    })
  });

  const json = await res.json();
  return json.choices?.[0]?.message?.content || "";
}

function safeJson(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

// ===================================================
// ROUTE INSIGHTS
// ===================================================
app.post("/api/ai-insights", async (req, res) => {
  const route = req.body || {};

  const prompt = `
Return RAW JSON ONLY:

{
  "summary": "string",
  "reasons": ["string"],
  "forecast": "string"
}

Route:
PortCongestion: ${route.PortCongestion}
DelayDays: ${route.DelayDays}
WasRolled: ${route.WasRolled}
`.trim();

  const aiText = await callOpenAI(prompt);

  const structured = safeJson(aiText, {
    summary: "Route progressing normally.",
    reasons: [],
    forecast: "No major disruption expected."
  });

  // -------- WEATHER (mock-safe fallback) --------
  const weatherText =
    route.WeatherSeverity
      ? `Weather near route reported as ${route.WeatherSeverity}`
      : null;

  // -------- NEWS (already passed from frontend enrichment) --------
  const newsText = route.ExternalNewsImpact
    ? `News: ${route.ExternalNewsImpact}`
    : null;

  structured.external_factors = [
    ...(weatherText ? [weatherText] : []),
    ...(newsText ? [newsText] : [])
  ];

  res.json({ structured });
});

// ===================================================
// SHIPMENT SUMMARY
// ===================================================
app.post("/api/ai-insights-summary", async (req, res) => {
  const { shipmentNumber, legs } = req.body;

  const prompt = `
Summarise shipment ${shipmentNumber}.

Return RAW JSON ONLY:
{
  "summary": "string",
  "forecast": "string"
}
`.trim();

  const text = await callOpenAI(prompt);

  const structured = safeJson(text, {
    summary: "Shipment progressing normally.",
    forecast: "No major delivery disruption expected."
  });

  res.json({ structured });
});

// ===================================================
const PORT = 3001;
app.listen(PORT, () =>
  console.log(`✅ AI server running at http://localhost:${PORT}`)
);
