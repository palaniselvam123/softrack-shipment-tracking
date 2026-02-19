import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "npm:openai@4.56.0";

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
- If you don't know something specific to this user's data, say so and guide them to the right module`;

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

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 600,
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
