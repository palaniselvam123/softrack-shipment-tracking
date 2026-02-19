import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const speechKey = Deno.env.get("AZURE_SPEECH_KEY");
    const speechRegion = Deno.env.get("AZURE_SPEECH_REGION");

    if (!speechKey || !speechRegion) {
      return new Response(
        JSON.stringify({ error: "Azure Speech not configured. Please set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenUrl = `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": speechKey,
        "Content-Length": "0",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return new Response(
        JSON.stringify({ error: `Azure Speech token error: ${tokenResponse.status} - ${errorText}` }),
        { status: tokenResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = await tokenResponse.text();

    return new Response(
      JSON.stringify({ token, region: speechRegion }),
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
