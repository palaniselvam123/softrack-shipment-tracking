import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const azureEndpoint = Deno.env.get("AZURE_WHISPER_ENDPOINT");
    const azureApiKey = Deno.env.get("AZURE_WHISPER_API_KEY");
    const azureDeployment = Deno.env.get("AZURE_WHISPER_DEPLOYMENT") || "whisper";
    const azureApiVersion = Deno.env.get("AZURE_WHISPER_API_VERSION") || "2024-06-01";

    if (!azureEndpoint || !azureApiKey) {
      return new Response(
        JSON.stringify({ error: "Azure Whisper not configured. Please set AZURE_WHISPER_ENDPOINT and AZURE_WHISPER_API_KEY." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: "No audio file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const azureFormData = new FormData();
    azureFormData.append("file", audioFile, audioFile.name || "audio.webm");
    azureFormData.append("response_format", "json");

    const url = `${azureEndpoint}/openai/deployments/${azureDeployment}/audio/transcriptions?api-version=${azureApiVersion}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "api-key": azureApiKey,
      },
      body: azureFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: `Azure Whisper error: ${response.status} - ${errorText}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({ text: result.text || "" }),
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
