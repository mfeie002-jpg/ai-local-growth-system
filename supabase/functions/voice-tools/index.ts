import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-voice-tool-secret",
};

// Verify tool secret
function verifyToolSecret(req: Request): boolean {
  const secret = Deno.env.get("VOICE_TOOL_SECRET");
  if (!secret) {
    console.log("VOICE_TOOL_SECRET not configured - allowing request");
    return true;
  }
  return req.headers.get("x-voice-tool-secret") === secret;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify secret
  if (!verifyToolSecret(req)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized", code: "unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const toolName = pathParts[pathParts.length - 1];

    console.log("Voice tool called:", toolName);

    const body = await req.json();

    switch (toolName) {
      case "send_sms_link": {
        const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
        const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
        const twilioFrom = Deno.env.get("TWILIO_SMS_FROM") || Deno.env.get("TWILIO_MESSAGING_SERVICE_SID");

        if (!twilioAccountSid || !twilioAuthToken || !twilioFrom) {
          console.log("SMS disabled - Twilio not configured");
          return new Response(
            JSON.stringify({ success: false, error: "sms_disabled" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { phone, language, type, url: customUrl } = body;

        if (!phone) {
          return new Response(
            JSON.stringify({ error: "Phone number required", code: "missing_phone" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Determine URL to send
        let linkUrl = customUrl;
        if (!linkUrl) {
          if (type === "audit") {
            linkUrl = language === "en"
              ? "https://itsfeierabend.ch/en/free-audit"
              : "https://itsfeierabend.ch/gratis-audit";
          } else {
            const bookingUrlDE = Deno.env.get("BOOKING_URL_DE");
            const bookingUrlEN = Deno.env.get("BOOKING_URL_EN");
            linkUrl = language === "en"
              ? (bookingUrlEN || "https://itsfeierabend.ch/en/free-call")
              : (bookingUrlDE || "https://itsfeierabend.ch/gratis-call");
          }
        }

        const messageBody = language === "en"
          ? `Here's the link: ${linkUrl}`
          : `Hier ist der Link: ${linkUrl}`;

        // Send SMS via Twilio
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

        const formData = new URLSearchParams();
        formData.append("To", phone);
        formData.append("Body", messageBody);

        if (twilioFrom.startsWith("MG")) {
          formData.append("MessagingServiceSid", twilioFrom);
        } else {
          formData.append("From", twilioFrom);
        }

        const twilioResponse = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });

        const twilioData = await twilioResponse.json();

        if (!twilioResponse.ok) {
          console.error("Twilio error:", twilioData);
          return new Response(
            JSON.stringify({ success: false, error: twilioData.message || "SMS failed" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log("SMS sent successfully:", twilioData.sid);
        return new Response(
          JSON.stringify({ success: true, message_sid: twilioData.sid }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "create_lead_note": {
        const { lead_id, phone, note, fields } = body;

        if (!note) {
          return new Response(
            JSON.stringify({ error: "Note content required", code: "missing_note" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        let targetLeadId = lead_id;

        // If no lead_id, try to find by phone
        if (!targetLeadId && phone) {
          const phoneNormalized = phone.replace(/[\s\-\(\)]/g, "");
          const { data: matchedLead } = await supabase
            .from("leads")
            .select("id")
            .or(`phone.ilike.%${phoneNormalized}%,phone.ilike.%${phone}%`)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (matchedLead) {
            targetLeadId = matchedLead.id;
          }
        }

        if (!targetLeadId) {
          return new Response(
            JSON.stringify({ success: false, error: "Lead not found" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Append note to existing notes
        const { data: existingLead } = await supabase
          .from("leads")
          .select("notes_internal")
          .eq("id", targetLeadId)
          .single();

        const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");
        const newNote = `[${timestamp} via Voice] ${note}`;
        const updatedNotes = existingLead?.notes_internal
          ? `${existingLead.notes_internal}\n\n${newNote}`
          : newNote;

        const updateData: Record<string, any> = { notes_internal: updatedNotes };

        // Add any additional fields if provided
        if (fields) {
          Object.assign(updateData, fields);
        }

        await supabase
          .from("leads")
          .update(updateData)
          .eq("id", targetLeadId);

        console.log("Lead note added:", targetLeadId);
        return new Response(
          JSON.stringify({ success: true, lead_id: targetLeadId }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "set_do_not_call": {
        const { phone, reason } = body;

        if (!phone) {
          return new Response(
            JSON.stringify({ error: "Phone number required", code: "missing_phone" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error } = await supabase
          .from("do_not_call")
          .upsert({
            phone: phone.replace(/[\s\-\(\)]/g, ""),
            reason: reason || "User requested during call",
          }, { onConflict: "phone" });

        if (error) {
          console.error("Error adding to do_not_call:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log("Added to do_not_call list:", phone);
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Unknown tool", code: "unknown_tool" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

  } catch (error) {
    console.error("Voice tool error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", code: "server_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
