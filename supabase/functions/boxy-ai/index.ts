import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "npm:openai@4.56.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are Boxy, an intelligent AI assistant built into LogiTRACK — an enterprise freight forwarding and logistics management platform.

You have deep knowledge of the entire LogiTRACK system:

SYSTEM MODULES:
- Dashboard: Overview of shipment stats, alerts, recent activity, KPIs
- Shipments: Track FCL, LCL, air freight, sea freight shipments. Statuses: In Transit, At Port, Customs Hold, Delivered, Delayed
- Map View: Interactive map showing all active shipment locations
- Bookings: Create and manage freight bookings with vessel, carrier, cargo details
- Quote & Book: Multi-step quotation engine — search schedules, compare carrier rates, add cargo details, confirm booking
- Customs: Manage customs clearance documents, HS codes, duties, compliance status
- Invoice: View and manage freight invoices, payment status, line items
- Communication Hub: Message threads with clients, agents, carriers — real-time chat
- Tickets: Support ticketing system for issue tracking and resolution
- Leads: CRM lead management for sales pipeline
- Inquiry: Customer inquiry forms for new business
- Webhooks: Configure outbound webhooks and view API documentation
- Live Tracking: Real-time AIS vessel tracking with weather intelligence

LOGISTICS EXPERTISE:
- FCL (Full Container Load): 20ft, 40ft, 40HC containers
- LCL (Less than Container Load): Shared container shipments
- Incoterms: EXW, FOB, CIF, DDP, DAP, FCA, CPT, CIP
- Documents: Bill of Lading (B/L), Packing List, Commercial Invoice, Certificate of Origin, Customs Entry
- Ports: Major global ports and their codes (USLAX, CNSHA, SGSIN, GBFXT, DEHAM, etc.)
- Carriers: Maersk, MSC, CMA CGM, COSCO, Evergreen, Hapag-Lloyd
- Shipping terms, freight rates, transit times, demurrage, detention

BEHAVIOR:
- Be concise, professional, and helpful
- For system navigation questions, tell users exactly which section to use
- For logistics questions, provide accurate industry knowledge
- Proactively suggest related features when relevant
- Keep responses focused and actionable
- When shipment data is provided in context, use it to give precise, factual answers
- If you don't know something specific to this user's data, say so and guide them to the right module
- ALWAYS maintain context from earlier in the conversation
- NEVER say "0 shipments" unless the database context explicitly confirms zero results

FORMATTING RULES — ALWAYS follow these:
- Use emojis to make responses visually clear and scannable
- For shipment/booking lookups, always present data as a neat card-style block using this format:

📦 **Shipment Details**
━━━━━━━━━━━━━━━━━━━━
🔖 **Reference:** [shipmentNo]
📍 **Status:** [status]
🛫 **Origin:** [origin]
🛬 **Destination:** [destination]
🚛 **Mode:** [mode]
👤 **Shipper:** [shipper]
📬 **Consignee:** [consignee]
📅 **ETD:** [etd]
📅 **ETA:** [eta]

For booking lookups use this format:
📋 **Booking Details**
━━━━━━━━━━━━━━━━━━━━
🔖 **Booking No:** [bookingNo]
🗂️ **Job Order:** [jobOrderNo]
📅 **Date:** [date]
🚢 **Mode:** [transportMode]
🏢 **Service Provider:** [serviceProvider]
📊 **Status:** [status]
👤 **Shipper:** [shipper]
📬 **Consignee:** [consignee]

- For follow-up questions about a previously discussed record, answer directly and concisely
- For general questions, use bullet points with relevant emojis
- Use **bold** for key values and labels
- Keep paragraphs short — max 2 sentences
- End responses with a helpful follow-up suggestion when appropriate, prefixed with 💬`;

function isStatsQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return /how many|count|total|number of|how much|overview|summary|stats|statistics|dashboard|breakdown/.test(lower) &&
    /shipment|booking|transit|delayed|pending|delivery|cargo|container|invoice|customs/.test(lower);
}

function isTrackingQuery(text: string): boolean {
  const lower = text.toLowerCase();
  const trackingKeywords = ['track', 'status', 'where is', 'shipment', 'container', 'booking', 'bookings', 'reference', 'check', 'find', 'lookup', 'locate', 'eta', 'etd', 'delivery', 'how many', 'count', 'list', 'show me', 'give me', 'all bookings', 'all shipments', 'shipper', 'consignee', 'invoice', 'documents', 'docs'];
  const hasKeyword = trackingKeywords.some(k => lower.includes(k));
  const hasRefPattern = /[A-Z0-9]{2,}[\/\-]+[A-Z0-9\/\-\.]{2,}/i.test(text) ||
    /\b[A-Z]{4}\d{6,}\b/i.test(text) ||
    /\b[A-Z]{2,6}\d{4,}\b/i.test(text);
  return hasKeyword || hasRefPattern;
}

function extractSearchTerms(text: string): string[] {
  const terms: string[] = [];
  const containerPattern = /\b[A-Z]{4}\d{6,8}\b/gi;
  const containerMatches = text.match(containerPattern);
  if (containerMatches) terms.push(...containerMatches.map(m => m.toUpperCase()));
  const shipmentPattern = /\b[A-Z]{2,5}\/[A-Z]{2}\/SHP\/\d{3,6}\b/gi;
  const shipmentMatches = text.match(shipmentPattern);
  if (shipmentMatches) terms.push(...shipmentMatches.map(m => m.toUpperCase()));
  const bookingPattern = /\b[A-Z]{2}(?:-[A-Z])?\/\/\d{4}\/\/[\d.]+\b/gi;
  const bookingMatches = text.match(bookingPattern);
  if (bookingMatches) terms.push(...bookingMatches.map(m => m.toUpperCase()));
  const alphanumPattern = /\b[A-Z]{2,}[\-\/]?[A-Z0-9]{3,}[\-\/]?[A-Z0-9]*\b/gi;
  const alphaMatches = text.match(alphanumPattern);
  if (alphaMatches) {
    const filtered = alphaMatches
      .map(m => m.toUpperCase())
      .filter(m => m.length >= 5 && /\d/.test(m) && !['STATUS', 'TRACK', 'SHIPMENT', 'CONTAINER', 'BOOKING', 'REFERENCE'].includes(m));
    terms.push(...filtered);
  }
  return [...new Set(terms)];
}

function normRef(s: string): string {
  return s.replace(/[-\/\\\s\.]+/g, '').toUpperCase();
}

function extractEntityName(text: string): string | null {
  const patterns = [
    /(?:for|of|by)\s+([A-Z][a-zA-Z0-9\s&'.,-]{2,50?)(?:\s*\?|$)/i,
    /(?:created\s+for|belongs?\s+to|related\s+to)\s+([A-Z][a-zA-Z0-9\s&'.,-]{2,50?})(?:\s*\?|$)/i,
    /([A-Z][a-zA-Z0-9\s&'.,-]{3,40?})(?:\s+shipments?|\s+bookings?)(?:\s+count|\s+total|\s+summary|\s+stats?)?/i,
    /shipments?\s+(?:of|for|by|from)\s+([A-Z][a-zA-Z0-9\s&'.,-]{2,40?})(?:\s*\?|$)/i,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m && m[1]) {
      const name = m[1].trim().replace(/\s*\?$/, '').replace(/[.,\s]+$/, '');
      if (name.length >= 3 && !/^(how|what|when|where|why|which|the|this|that|these|those|are|is|was|were|has|have)$/i.test(name)) {
        return name;
      }
    }
  }
  const wordsInOrder = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+(?:\s+(?:Ltd|LLP|LLC|Pvt|Co|Corp|Inc|GmbH|Exports?|Imports?|Trading|Industries?|Motors?|Pharma|Tech|Solutions?|Logistics?|Agro|Steel|Textiles?|Chemicals?|Auto|Electronics?|Manufacturing|Traders?|Works?))?)\b/g);
  if (wordsInOrder && wordsInOrder.length > 0) {
    const longest = wordsInOrder.reduce((a, b) => a.length >= b.length ? a : b, '');
    if (longest.length >= 4) return longest;
  }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === 'user');
    const userText = lastUserMsg ? lastUserMsg.content : '';
    const fullConversationText = messages.map((m: { role: string; content: string }) => m.content).join(' ');

    const searchTerms = extractSearchTerms(userText);
    const couldBeStats = isStatsQuery(userText);
    const couldBeTracking = isTrackingQuery(userText);
    let shipmentContext = '';
    let injectedAssistantMsg: { role: string; content: string } | null = null;

    if (couldBeStats) {
      const statsLines: string[] = [];
      const entityName = extractEntityName(userText);

      if (entityName) {
        const { data: shipperRows, error: e1 } = await supabase
          .from('shipments')
          .select('"Shipment Number", "Shipper", "Consignee", "Origin", "Destination", "Transport Mode", "Shipment Type", shipment_status, "ETA"')
          .ilike('"Shipper"', `%${entityName}%`)
          .limit(500);

        const { data: consigneeRows, error: e2 } = await supabase
          .from('shipments')
          .select('"Shipment Number", "Shipper", "Consignee", "Origin", "Destination", "Transport Mode", "Shipment Type", shipment_status, "ETA"')
          .ilike('"Consignee"', `%${entityName}%`)
          .limit(500);

        const { data: bookingShipperRows } = await supabase
          .from('bookings_from_quotes')
          .select('booking_no, shipper_name, consignee_name, transport_mode, status, origin_location, destination_location, created_at')
          .ilike('shipper_name', `%${entityName}%`)
          .limit(500);

        const { data: bookingConsigneeRows } = await supabase
          .from('bookings_from_quotes')
          .select('booking_no, shipper_name, consignee_name, transport_mode, status, origin_location, destination_location, created_at')
          .ilike('consignee_name', `%${entityName}%`)
          .limit(500);

        const seenShipments = new Set<string>();
        const entityShipments = [...(shipperRows || []), ...(consigneeRows || [])].filter(s => {
          const id = s['Shipment Number'];
          if (seenShipments.has(id)) return false;
          seenShipments.add(id);
          return true;
        });

        const seenBookings = new Set<string>();
        const entityBookings = [...(bookingShipperRows || []), ...(bookingConsigneeRows || [])].filter(b => {
          const id = b['booking_no'];
          if (seenBookings.has(id)) return false;
          seenBookings.add(id);
          return true;
        });

        if (entityShipments.length > 0) {
          const byStatus: Record<string, number> = {};
          const byMode: Record<string, number> = {};
          const byType: Record<string, number> = {};
          for (const s of entityShipments) {
            const st = (s['shipment_status'] || 'Unknown').toString();
            byStatus[st] = (byStatus[st] || 0) + 1;
            const m = (s['Transport Mode'] || 'Unknown').toString();
            byMode[m] = (byMode[m] || 0) + 1;
            const t = (s['Shipment Type'] || 'Unknown').toString();
            byType[t] = (byType[t] || 0) + 1;
          }
          statsLines.push(`LIVE SHIPMENT STATS FOR "${entityName}" (total: ${entityShipments.length}):`);
          statsLines.push(`By Status: ${Object.entries(byStatus).map(([k, v]) => `${k}=${v}`).join(', ')}`);
          statsLines.push(`By Transport Mode: ${Object.entries(byMode).map(([k, v]) => `${k}=${v}`).join(', ')}`);
          statsLines.push(`By Shipment Type: ${Object.entries(byType).map(([k, v]) => `${k}=${v}`).join(', ')}`);
          const sample = entityShipments.slice(0, 8);
          statsLines.push(`Sample: ${sample.map(s => `${s['Shipment Number']} (${s['shipment_status'] || 'Unknown'}) ${s['Origin']}→${s['Destination']}`).join('; ')}`);
        } else {
          statsLines.push(`No shipments found in the database for "${entityName}".`);
        }

        if (entityBookings.length > 0) {
          const byStatus: Record<string, number> = {};
          for (const b of entityBookings) {
            const st = (b['status'] || 'Unknown').toString();
            byStatus[st] = (byStatus[st] || 0) + 1;
          }
          statsLines.push(`LIVE BOOKING STATS FOR "${entityName}" (total: ${entityBookings.length}):`);
          statsLines.push(`By Status: ${Object.entries(byStatus).map(([k, v]) => `${k}=${v}`).join(', ')}`);
        } else {
          statsLines.push(`No bookings found for "${entityName}".`);
        }
      } else {
        const { data: shipmentStats } = await supabase
          .from('shipments')
          .select('shipment_status, "Transport Mode", "Shipment Type"');
        const { data: bookingStats } = await supabase
          .from('bookings_from_quotes')
          .select('status');

        if (shipmentStats && shipmentStats.length > 0) {
          const byStatus: Record<string, number> = {};
          const byMode: Record<string, number> = {};
          const byType: Record<string, number> = {};
          for (const s of shipmentStats) {
            const st = (s['shipment_status'] || 'Unknown').toString();
            byStatus[st] = (byStatus[st] || 0) + 1;
            const m = (s['Transport Mode'] || 'Unknown').toString();
            byMode[m] = (byMode[m] || 0) + 1;
            const t = (s['Shipment Type'] || 'Unknown').toString();
            byType[t] = (byType[t] || 0) + 1;
          }
          statsLines.push(`LIVE SHIPMENT STATS (total: ${shipmentStats.length}):`);
          statsLines.push(`By Status: ${Object.entries(byStatus).map(([k, v]) => `${k}=${v}`).join(', ')}`);
          statsLines.push(`By Transport Mode: ${Object.entries(byMode).map(([k, v]) => `${k}=${v}`).join(', ')}`);
          statsLines.push(`By Type: ${Object.entries(byType).map(([k, v]) => `${k}=${v}`).join(', ')}`);
        }
        if (bookingStats && bookingStats.length > 0) {
          const byStatus: Record<string, number> = {};
          for (const b of bookingStats) {
            const st = (b['status'] || 'Unknown').toString();
            byStatus[st] = (byStatus[st] || 0) + 1;
          }
          statsLines.push(`LIVE BOOKING STATS (total: ${bookingStats.length}):`);
          statsLines.push(`By Status: ${Object.entries(byStatus).map(([k, v]) => `${k}=${v}`).join(', ')}`);
        }
      }

      if (statsLines.length > 0) {
        shipmentContext = `\n\n[LIVE STATS FROM LOGITRACK DATABASE]\n${statsLines.join('\n')}`;
        injectedAssistantMsg = {
          role: 'assistant',
          content: `Here is the live data from LogiTRACK:\n${statsLines.join('\n')}\n\nLet me answer your question based on this data.`
        };
      }
    }

    if (!injectedAssistantMsg && (couldBeTracking || searchTerms.length > 0)) {
      const dbLines: string[] = [];
      const allTerms = searchTerms.length > 0 ? searchTerms : [];

      for (const term of allTerms) {
        const { data } = await supabase
          .from('shipments')
          .select('"Shipment Number", "Shipper", "Consignee", "Origin", "Destination", "Transport Mode", "Shipment Type", "ETD", "ETA", shipment_status, job_ref')
          .or(`"Shipment Number".ilike.%${term}%,job_ref.ilike.%${term}%`)
          .limit(5);
        if (data && data.length > 0) {
          dbLines.push(...data.map((s: Record<string, unknown>) =>
            `Shipment: ${s['Shipment Number']} | Status: ${s['shipment_status'] || 'N/A'} | Route: ${s['Origin']} → ${s['Destination']} | Mode: ${s['Transport Mode']} | Shipper: ${s['Shipper']} | Consignee: ${s['Consignee']} | ETD: ${s['ETD']} | ETA: ${s['ETA']}`
          ));
        }
        const { data: bd } = await supabase
          .from('bookings_from_quotes')
          .select('booking_no, shipper_name, consignee_name, transport_mode, service_provider, status, job_order_no, origin_location, destination_location, created_at')
          .ilike('booking_no', `%${term}%`)
          .limit(5);
        if (bd && bd.length > 0) {
          dbLines.push(...bd.map((b: Record<string, unknown>) =>
            `Booking: ${b['booking_no']} | Mode: ${b['transport_mode']} | Status: ${b['status']} | Provider: ${b['service_provider']} | Shipper: ${b['shipper_name']} | Consignee: ${b['consignee_name']} | Origin: ${b['origin_location']} | Destination: ${b['destination_location']}`
          ));
        }
      }

      if (dbLines.length > 0) {
        shipmentContext = `\n\n[LIVE DATA FROM LOGITRACK DATABASE]\n${dbLines.join('\n')}`;
        injectedAssistantMsg = {
          role: 'assistant',
          content: `I found the following data in LogiTRACK:\n${dbLines.join('\n')}\n\nLet me answer your question based on this data.`
        };
      }
    }

    const openai = new OpenAI({ apiKey });
    const systemWithContext = SYSTEM_PROMPT + shipmentContext;

    const messagesForAI = [
      { role: "system", content: systemWithContext },
      ...messages,
    ] as Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;

    if (injectedAssistantMsg) {
      const lastUserIdx = messagesForAI.map(m => m.role).lastIndexOf('user');
      if (lastUserIdx >= 0) {
        messagesForAI.splice(lastUserIdx, 0, injectedAssistantMsg as { role: 'system' | 'user' | 'assistant'; content: string });
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messagesForAI,
      max_tokens: 800,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
