import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CallbackRequest {
  phone: string;
  language: "de" | "en";
  preferred_time?: string;
  consent_ai_call: boolean;
  consent_recording?: boolean;
  lead_id?: string;
  report_token?: string;
}

// Validate E.164-ish phone format
function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  return /^\+?[1-9]\d{7,14}$/.test(cleaned);
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const retellApiKey = Deno.env.get("RETELL_API_KEY");
    const callbackEnabled = Deno.env.get("VOICE_CALLBACK_ENABLED") === "true";
    const voiceDataStorageSetting = Deno.env.get("VOICE_DATA_STORAGE_SETTING") || "everything_except_pii";
    const voiceSignedUrls = Deno.env.get("VOICE_SIGNED_URLS") === "true";

    // Check if callback feature is enabled
    if (!callbackEnabled) {
      return new Response(
        JSON.stringify({
          error: "Callback feature is currently disabled",
          code: "callback_disabled",
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!retellApiKey) {
      console.error("RETELL_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Voice service not configured", code: "not_configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: CallbackRequest = await req.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate required fields
    if (!body.phone || !isValidPhone(body.phone)) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number", code: "invalid_phone" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!body.consent_ai_call) {
      return new Response(
        JSON.stringify({ error: "AI call consent is required", code: "consent_required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["de", "en"].includes(body.language)) {
      return new Response(
        JSON.stringify({ error: "Invalid language", code: "invalid_language" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check do_not_call list
    const phoneNormalized = body.phone.replace(/[\s\-\(\)]/g, "");
    const { data: blocked } = await supabase
      .from("do_not_call")
      .select("id")
      .or(`phone.eq.${body.phone},phone.eq.${phoneNormalized}`)
      .limit(1)
      .maybeSingle();

    if (blocked) {
      return new Response(
        JSON.stringify({ error: "This number has opted out of calls", code: "do_not_call" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create callback request record
    const { data: callbackReq, error: insertError } = await supabase
      .from("callback_requests")
      .insert({
        phone: body.phone,
        language: body.language,
        preferred_time: body.preferred_time || null,
        consent_ai_call: body.consent_ai_call,
        consent_recording: body.consent_recording || false,
        lead_id: body.lead_id || null,
        report_token: body.report_token || null,
        status: "queued",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating callback request:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create callback request", code: "insert_error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Select agent ID based on language
    const agentId = body.language === "en"
      ? Deno.env.get("RETELL_AGENT_ID_EN")
      : Deno.env.get("RETELL_AGENT_ID_DE");

    const fromNumber = Deno.env.get("RETELL_FROM_NUMBER");

    if (!agentId || !fromNumber) {
      console.error("Agent ID or from number not configured for language:", body.language);
      await supabase
        .from("callback_requests")
        .update({ status: "failed", error: "Agent not configured" })
        .eq("id", callbackReq.id);

      return new Response(
        JSON.stringify({ error: "Voice agent not configured", code: "agent_not_configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Retell API to create outbound call
    const retellPayload: Record<string, any> = {
      agent_id: agentId,
      from_number: fromNumber,
      to_number: body.phone,
      metadata: {
        callback_request_id: callbackReq.id,
        lead_id: body.lead_id,
        report_token: body.report_token,
        consent_recording: body.consent_recording || false,
        consent_transcript: body.consent_ai_call,
        preferred_time: body.preferred_time,
        language: body.language,
      },
    };

    // Add data storage setting
    if (voiceDataStorageSetting) {
      retellPayload.data_storage_setting = voiceDataStorageSetting;
    }

    if (voiceSignedUrls) {
      retellPayload.opt_in_signed_url = true;
    }

    console.log("Creating Retell outbound call:", retellPayload);

    const retellResponse = await fetch("https://api.retellai.com/v2/create-phone-call", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${retellApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(retellPayload),
    });

    const retellData = await retellResponse.json();

    if (!retellResponse.ok) {
      console.error("Retell API error:", retellData);
      await supabase
        .from("callback_requests")
        .update({ status: "failed", error: retellData.message || "Retell API error" })
        .eq("id", callbackReq.id);

      return new Response(
        JSON.stringify({ error: "Failed to initiate callback", code: "retell_error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update callback request with Retell call ID
    await supabase
      .from("callback_requests")
      .update({
        status: "calling",
        retell_call_id: retellData.call_id,
      })
      .eq("id", callbackReq.id);

    console.log("Callback initiated successfully:", retellData.call_id);

    return new Response(
      JSON.stringify({
        success: true,
        callback_request_id: callbackReq.id,
        message: body.language === "de"
          ? "Rückruf wird initiiert. Du erhältst in Kürze einen Anruf."
          : "Callback initiated. You will receive a call shortly.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Callback error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", code: "server_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
