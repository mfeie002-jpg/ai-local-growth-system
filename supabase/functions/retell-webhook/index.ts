import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-retell-signature",
};

// Verify Retell webhook signature using Web Crypto API
async function verifyRetellSignature(body: string, signature: string, apiKey: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(apiKey);
    const messageData = encoder.encode(body);
    
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
    
    return signature === expectedSignature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

// Send Slack notification
async function sendSlackNotification(message: string): Promise<void> {
  const slackWebhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");
  if (!slackWebhookUrl) return;

  try {
    await fetch(slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
  } catch (err) {
    console.error("Slack notification error:", err);
  }
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
    const webhookSecret = Deno.env.get("RETELL_WEBHOOK_PATH_SECRET");
    const voiceStoreTranscripts = Deno.env.get("VOICE_STORE_TRANSCRIPTS") === "true";
    const voiceStoreRecordings = Deno.env.get("VOICE_STORE_RECORDINGS") === "true";

    if (!retellApiKey) {
      console.error("RETELL_API_KEY not configured");
      return new Response(null, { status: 500 });
    }

    // Verify path secret if configured
    const url = new URL(req.url);
    const pathSecret = url.pathname.split("/").pop();
    if (webhookSecret && pathSecret !== webhookSecret) {
      console.log("Invalid webhook path secret");
      return new Response(null, { status: 403 });
    }

    // Get body and signature
    const body = await req.text();
    const signature = req.headers.get("x-retell-signature") || "";

    // Verify signature
    if (!await verifyRetellSignature(body, signature, retellApiKey)) {
      console.log("Invalid Retell signature");
      return new Response(null, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("Retell webhook event:", event.event, event.call?.call_id);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different event types
    switch (event.event) {
      case "call_started": {
        const call = event.call;
        if (!call?.call_id) break;

        const { error } = await supabase.from("calls").upsert({
          retell_call_id: call.call_id,
          agent_id: call.agent_id,
          direction: call.direction || null,
          from_number: call.from_number || null,
          to_number: call.to_number || null,
          status: "started",
          start_timestamp: call.start_timestamp || null,
          metadata: call.metadata || null,
          consent_recording: call.metadata?.consent_recording === true,
          consent_transcript: call.metadata?.consent_transcript === true,
        }, { onConflict: "retell_call_id" });

        if (error) {
          console.error("Error inserting call_started:", error);
        } else {
          console.log("Call started recorded:", call.call_id);
        }
        break;
      }

      case "call_ended": {
        const call = event.call;
        if (!call?.call_id) break;

        // Determine consent from stored call or metadata
        const { data: existingCall } = await supabase
          .from("calls")
          .select("consent_recording, consent_transcript")
          .eq("retell_call_id", call.call_id)
          .maybeSingle();

        const consentRecording = existingCall?.consent_recording || call.metadata?.consent_recording === true;
        const consentTranscript = existingCall?.consent_transcript || call.metadata?.consent_transcript === true;

        // Build update object
        const updateData: Record<string, any> = {
          status: "ended",
          end_timestamp: call.end_timestamp || null,
          duration_ms: call.duration_ms || null,
          disconnection_reason: call.disconnection_reason || null,
          transfer_destination: call.transfer_destination || null,
          public_log_url: call.public_log_url || null,
          data_storage_setting: call.data_storage_setting || null,
        };

        // Only store transcript if consent given AND config allows
        if (consentTranscript && voiceStoreTranscripts) {
          updateData.transcript = call.transcript || null;
          updateData.transcript_object = call.transcript_object || null;
          updateData.transcript_with_tool_calls = call.transcript_with_tool_calls || null;
        }

        // Only store recording URL if consent given AND config allows
        if (consentRecording && voiceStoreRecordings) {
          updateData.recording_url = call.recording_url || null;
          updateData.recording_multi_channel_url = call.recording_multi_channel_url || null;
        }

        // Update call record
        const { error: updateError } = await supabase
          .from("calls")
          .update(updateData)
          .eq("retell_call_id", call.call_id);

        if (updateError) {
          console.error("Error updating call_ended:", updateError);
        }

        // Try to link to existing lead by phone
        if (call.from_number) {
          const phoneNormalized = call.from_number.replace(/\D/g, "");
          const { data: matchedLead } = await supabase
            .from("leads")
            .select("id")
            .or(`phone.ilike.%${phoneNormalized}%,phone.ilike.%${call.from_number}%`)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (matchedLead) {
            await supabase
              .from("calls")
              .update({ lead_id: matchedLead.id })
              .eq("retell_call_id", call.call_id);
            console.log("Call linked to lead:", matchedLead.id);
          }
        }

        // Send Slack notification (no transcript content)
        const direction = call.direction === "inbound" ? "📞 Inbound" : "📲 Outbound";
        await sendSlackNotification(
          `${direction} call ended | From: ${call.from_number || "unknown"} | Duration: ${Math.round((call.duration_ms || 0) / 1000)}s | Reason: ${call.disconnection_reason || "unknown"}`
        );

        console.log("Call ended recorded:", call.call_id);
        break;
      }

      case "call_analyzed": {
        const call = event.call;
        if (!call?.call_id) break;

        const { error } = await supabase
          .from("calls")
          .update({ call_analysis: call.call_analysis || null })
          .eq("retell_call_id", call.call_id);

        if (error) {
          console.error("Error updating call_analyzed:", error);
        } else {
          console.log("Call analysis recorded:", call.call_id);
        }
        break;
      }

      default:
        console.log("Unknown event type:", event.event);
    }

    // Respond quickly
    return new Response(null, { status: 204 });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(null, { status: 500 });
  }
});
