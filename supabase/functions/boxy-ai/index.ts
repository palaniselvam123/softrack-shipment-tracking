import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "npm:openai@4.56.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MOCK_SHIPMENTS = [
  { shipmentNo: 'MUM/SE/SHP/0001', containerNo: 'MEDU6997206', shipper: 'Australian Fine Wines Pty Ltd', consignee: 'South Asia Trading Company', transport: 'Sea', departure: 'East Perth, AU', arrivalPort: 'Nhava Sheva Port, MH', type: 'Export', status: 'Pending', etd: '09-Oct-2025', eta: '29-Nov-2025', masterNo: 'MEDUQL0H0829', houseNo: 'S0000154J' },
  { shipmentNo: 'MUM/SE/SHP/0002', containerNo: 'BKSU9898988', shipper: 'Textile Exports India Ltd', consignee: 'European Fashion House', transport: 'Sea', departure: 'Nhava Sheva Port, MH', arrivalPort: 'Hamburg Port, Germany', type: 'Export', status: 'Delayed', etd: '15-Oct-2025', eta: '18-Nov-2025', masterNo: 'MAEU8547321', houseNo: 'INTL/2127' },
  { shipmentNo: 'MUM/SE/SHP/0020', containerNo: 'CCU98765543', shipper: 'Steel Manufacturing Ltd', consignee: 'Brazilian Steel Imports', transport: 'Sea', departure: 'Nhava Sheva Port, MH', arrivalPort: 'Santos Port, Brazil', type: 'Export', status: 'Delayed', etd: '25-Nov-2025', eta: '28-Dec-2025', masterNo: 'MAEU9876543', houseNo: 'STEEL/BR/889' },
  { shipmentNo: 'MUM/SE/SHP/0023', containerNo: 'BKSU9898988', shipper: 'Chemical Industries Pvt Ltd', consignee: 'US Chemical Distributors', transport: 'Sea', departure: 'Nhava Sheva Port, MH', arrivalPort: 'New York Port, NY', type: 'Export', status: 'Loaded on Vessel', etd: '28-Nov-2025', eta: '15-Dec-2025', masterNo: 'MAEU8547321', houseNo: 'CHEM/US/556' },
  { shipmentNo: 'MUM/SE/SHP/0024', containerNo: 'MULTIPLE', shipper: 'Automotive Parts Export', consignee: 'Global Auto Components', transport: 'Sea', departure: 'Nhava Sheva Port, MH', arrivalPort: 'New York Port, NY', type: 'Export', status: 'Billing', etd: '30-Nov-2025', eta: '18-Dec-2025', masterNo: 'HLCUBO9876', houseNo: 'AUTO/INTL/778' },
  { shipmentNo: 'DEL/SE/SHP/0005', containerNo: 'TEMU4567890', shipper: 'Rice Export Corporation', consignee: 'Middle East Food Trading', transport: 'Sea', departure: 'Kandla Port, Gujarat', arrivalPort: 'Jebel Ali Port, Dubai', type: 'Export', status: 'Delayed', etd: '28-Nov-2025', eta: '05-Dec-2025', masterNo: 'OOLU7654321', houseNo: 'RICE/ME/445' },
  { shipmentNo: 'MUM/AE/SHP/0009', containerNo: '', shipper: 'Electronics Manufacturing Co', consignee: 'Tech Solutions Dubai', transport: 'Air', departure: 'Mumbai Airport, MH', arrivalPort: 'Dubai International Airport, AE', type: 'Export', status: 'Delayed', etd: '20-Nov-2025', eta: '21-Nov-2025', masterNo: 'EK-542', houseNo: 'AIR/2026/1156' },
  { shipmentNo: 'MUM/AE/SHP/0012', containerNo: '', shipper: 'Pharmaceutical Exports Ltd', consignee: 'HealthCare International', transport: 'Air', departure: 'Mumbai Airport, MH', arrivalPort: 'Dubai International Airport, AE', type: 'Export', status: 'Delayed', etd: '21-Nov-2025', eta: '22-Nov-2025', masterNo: 'AI-127', houseNo: 'MED/INTL/889' },
  { shipmentNo: 'MUM/AI/SHP/0001', containerNo: '', shipper: 'American Tech Solutions', consignee: 'Indian Technology Hub', transport: 'Air', departure: 'John F Kennedy Airport, NY', arrivalPort: 'Mumbai Airport, MH', type: 'Import', status: 'Delayed', etd: '18-Nov-2025', eta: '20-Nov-2025', masterNo: 'UA-887', houseNo: 'TECH/IMP/334' },
  { shipmentNo: 'MUM/AI/SHP/0002', containerNo: '', shipper: 'German Machinery Exports', consignee: 'Industrial Equipment India', transport: 'Air', departure: 'Frankfurt Airport, Germany', arrivalPort: 'Mumbai Airport, MH', type: 'Import', status: 'Billing', etd: '18-Nov-2025', eta: '20-Nov-2025', masterNo: 'LH-125-155', houseNo: 'MACH-2026-445' },
];

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
- If you don't know something specific to this user's data, say so and guide them to the right module`;

function isTrackingQuery(text: string): boolean {
  const lower = text.toLowerCase();
  const trackingKeywords = ['track', 'status', 'where is', 'shipment', 'container', 'booking', 'reference', 'check', 'find', 'lookup', 'locate', 'eta', 'etd', 'delivery'];
  const hasKeyword = trackingKeywords.some(k => lower.includes(k));
  const hasRefPattern = /[A-Z0-9]{3,}[\/\-][A-Z0-9\/\-]{2,}/i.test(text) ||
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

  const looseSepPattern = /\b[A-Z]{2,6}[-\/]+[A-Z0-9][-\/A-Z0-9\.]{3,20}\b/gi;
  const looseMatches = text.match(looseSepPattern);
  if (looseMatches) terms.push(...looseMatches.map(m => m.toUpperCase()));

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

function lookupMockShipments(terms: string[], rawText: string) {
  const results: typeof MOCK_SHIPMENTS = [];

  const addIfNew = (s: typeof MOCK_SHIPMENTS[0]) => {
    if (!results.some(r => r.shipmentNo === s.shipmentNo)) results.push(s);
  };

  for (const term of terms) {
    const normTerm = normRef(term);
    for (const s of MOCK_SHIPMENTS) {
      if (
        normRef(s.containerNo) === normTerm ||
        normRef(s.shipmentNo) === normTerm ||
        normRef(s.masterNo) === normTerm ||
        normRef(s.houseNo) === normTerm ||
        normRef(s.containerNo).includes(normTerm) ||
        normRef(s.shipmentNo).includes(normTerm) ||
        normRef(s.masterNo).includes(normTerm) ||
        normRef(s.houseNo).includes(normTerm) ||
        normTerm.includes(normRef(s.containerNo)) ||
        normTerm.includes(normRef(s.shipmentNo))
      ) {
        addIfNew(s);
      }
    }
  }

  if (results.length === 0 && rawText.length >= 4) {
    const normRaw = normRef(rawText.replace(/[^A-Z0-9\/\-\.]/gi, ' ').trim());
    for (const s of MOCK_SHIPMENTS) {
      if (
        normRaw.includes(normRef(s.containerNo)) ||
        normRaw.includes(normRef(s.shipmentNo).slice(0, 8)) ||
        normRef(s.shipmentNo).includes(normRaw.slice(0, 8))
      ) {
        addIfNew(s);
      }
    }
  }

  return results;
}

function formatShipmentContext(shipments: typeof MOCK_SHIPMENTS): string {
  if (shipments.length === 0) return '';
  const lines = shipments.map(s => {
    return `Shipment: ${s.shipmentNo} | Container: ${s.containerNo || 'N/A (Air/Road)'} | Status: ${s.status} | Route: ${s.departure} → ${s.arrivalPort} | Mode: ${s.transport} | Type: ${s.type} | Shipper: ${s.shipper} | Consignee: ${s.consignee} | ETD: ${s.etd} | ETA: ${s.eta} | MBL: ${s.masterNo} | HBL: ${s.houseNo}`;
  });
  return `\n\n[LIVE SHIPMENT DATA FROM LOGITRACK DATABASE]\n${lines.join('\n')}`;
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

    const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === 'user');
    const userText = lastUserMsg ? lastUserMsg.content : '';

    const searchTerms = extractSearchTerms(userText);
    const couldBeTracking = isTrackingQuery(userText);
    let shipmentContext = '';

    let injectedAssistantMsg: { role: string; content: string } | null = null;
    let notFoundReply: string | null = null;

    if (couldBeTracking || searchTerms.length > 0) {
      const mockResults = lookupMockShipments(searchTerms, userText);
      if (mockResults.length > 0) {
        shipmentContext = formatShipmentContext(mockResults);
        injectedAssistantMsg = {
          role: 'assistant',
          content: `I found the following shipment data in LogiTRACK:\n${formatShipmentContext(mockResults).replace('[LIVE SHIPMENT DATA FROM LOGITRACK DATABASE]\n', '')}\n\nLet me answer your question based on this data.`
        };
      } else {
        let dbFound = false;
        try {
          const supabaseUrl = Deno.env.get("SUPABASE_URL");
          const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
          if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const dbResults: Array<Record<string, unknown>> = [];

            const allTerms = searchTerms.length > 0 ? searchTerms : [userText.trim()];
            for (const term of allTerms) {
              const { data } = await supabase
                .from('shipments')
                .select('"Shipment Number", "Shipper", "Consignee", "Origin", "Destination", "Transport Mode", "Shipment Type", "ETD", "ETA", shipment_status, job_ref')
                .or(`"Shipment Number".ilike.%${term}%,job_ref.ilike.%${term}%`)
                .limit(5);
              if (data && data.length > 0) dbResults.push(...data);
            }

            if (dbResults.length > 0) {
              dbFound = true;
              const seen = new Set<string>();
              const unique = dbResults.filter(s => {
                const key = String(s['Shipment Number']);
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
              });
              const dbLines = unique.map((s: Record<string, unknown>) =>
                `Shipment: ${s['Shipment Number']} | Status: ${s['shipment_status'] || 'N/A'} | Route: ${s['Origin']} → ${s['Destination']} | Mode: ${s['Transport Mode']} | Shipper: ${s['Shipper']} | Consignee: ${s['Consignee']} | ETD: ${s['ETD']} | ETA: ${s['ETA']}`
              );
              shipmentContext = `\n\n[LIVE SHIPMENT DATA FROM LOGITRACK DATABASE]\n${dbLines.join('\n')}`;
              injectedAssistantMsg = {
                role: 'assistant',
                content: `I found the following shipment data in LogiTRACK:\n${dbLines.join('\n')}\n\nLet me answer your question based on this data.`
              };
            }
          }
        } catch {
          // fall through
        }

        if (!dbFound) {
          const ref = searchTerms.length > 0 ? searchTerms[0] : userText.trim();
          notFoundReply = `No shipment, container, or booking matching **"${ref}"** was found in LogiTRACK.\n\nPlease double-check the reference number. You can try:\n- Container number (e.g. MEDU6997206)\n- Shipment number (e.g. MUM/SE/SHP/0001)\n- Bill of Lading number\n\nIf you believe this is an error, contact your freight coordinator or check the Shipments page directly.`;
        }
      }
    }

    if (notFoundReply) {
      return new Response(
        JSON.stringify({ reply: notFoundReply, foundShipments: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemWithContext = SYSTEM_PROMPT + shipmentContext;

    const openai = new OpenAI({ apiKey });

    const messagesForAI = [
      { role: "system", content: systemWithContext },
      ...messages,
    ];

    if (injectedAssistantMsg) {
      const lastUserIdx = messagesForAI.map(m => m.role).lastIndexOf('user');
      if (lastUserIdx >= 0) {
        messagesForAI.splice(lastUserIdx, 0, injectedAssistantMsg);
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messagesForAI as Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
      max_tokens: 700,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return new Response(
      JSON.stringify({ reply, foundShipments: searchTerms.length > 0 }),
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
