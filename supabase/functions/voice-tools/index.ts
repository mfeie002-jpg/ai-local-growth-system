import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://itsfeierabend.ch",
  "Access-Control-Allow-Headers": "content-type, x-voice-tool-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.replace(/[\s\-().]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(normalized) ? normalized : null;
}

function safeText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

function isUuid(value: unknown): value is string {
  return typeof value === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function approvedLink(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.origin !== "https://itsfeierabend.ch") return null;
    const allowed = ["/audit", "/en/audit", "/kontakt", "/en/contact"];
    return allowed.includes(url.pathname) ? url.toString() : null;
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return response({ error: "method_not_allowed" }, 405);
  if (!req.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return response({ error: "json_required" }, 415);
  }

  const secret = Deno.env.get("VOICE_TOOL_SECRET");
  if (!secret) {
    console.error("voice-tools misconfigured: secret missing");
    return response({ error: "service_misconfigured" }, 503);
  }
  if (req.headers.get("x-voice-tool-secret") !== secret) {
    return response({ error: "unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return response({ error: "service_misconfigured" }, 503);
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const toolName = new URL(req.url).pathname.split("/").filter(Boolean).at(-1);
    const body = await req.json();

    if (toolName === "send_sms_link") {
      const phone = normalizePhone(body?.phone);
      if (!phone) return response({ error: "invalid_phone" }, 400);

      const language = body?.language === "en" ? "en" : "de";
      const type = body?.type === "audit" ? "audit" : "contact";
      let link = body?.url ? approvedLink(body.url) : null;
      if (body?.url && !link) return response({ error: "unapproved_url" }, 400);
      if (!link) {
        link = type === "audit"
          ? (language === "en" ? "https://itsfeierabend.ch/en/audit" : "https://itsfeierabend.ch/audit")
          : (language === "en" ? "https://itsfeierabend.ch/en/contact" : "https://itsfeierabend.ch/kontakt");
      }

      const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
      const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
      const sender = Deno.env.get("TWILIO_SMS_FROM") || Deno.env.get("TWILIO_MESSAGING_SERVICE_SID");
      if (!accountSid || !authToken || !sender) {
        return response({ error: "sms_provider_unavailable" }, 503);
      }

      const form = new URLSearchParams();
      form.set("To", phone);
      form.set("Body", language === "en" ? `Your link: ${link}` : `Ihr Link: ${link}`);
      if (sender.startsWith("MG")) form.set("MessagingServiceSid", sender);
      else form.set("From", sender);

      const twilioResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: form,
        },
      );
      const payload = await twilioResponse.json().catch(() => ({})) as { sid?: string };
      if (!twilioResponse.ok || !payload.sid) {
        console.error("voice-tools sms provider error", twilioResponse.status);
        return response({ error: "sms_provider_error" }, 502);
      }
      return response({ success: true, message_sid: payload.sid });
    }

    if (toolName === "create_lead_note") {
      const note = safeText(body?.note, 2000);
      if (!note) return response({ error: "invalid_note" }, 400);

      let leadId = isUuid(body?.lead_id) ? body.lead_id : null;
      if (!leadId && body?.phone) {
        const phone = normalizePhone(body.phone);
        if (!phone) return response({ error: "invalid_phone" }, 400);
        const { data, error } = await supabase
          .from("leads")
          .select("id")
          .eq("phone", phone)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) return response({ error: "lead_lookup_failed" }, 500);
        leadId = data?.id || null;
      }
      if (!leadId) return response({ error: "lead_not_found" }, 404);

      const { data: existing, error: fetchError } = await supabase
        .from("leads")
        .select("notes_internal")
        .eq("id", leadId)
        .maybeSingle();
      if (fetchError || !existing) return response({ error: "lead_not_found" }, 404);

      const timestamp = new Date().toISOString();
      const newNote = `[${timestamp} via Voice] ${note}`;
      const notes = existing.notes_internal
        ? `${existing.notes_internal}\n\n${newNote}`
        : newNote;
      const { error: updateError } = await supabase
        .from("leads")
        .update({ notes_internal: notes.slice(-20_000) })
        .eq("id", leadId);
      if (updateError) return response({ error: "lead_update_failed" }, 500);

      return response({ success: true, lead_id: leadId });
    }

    if (toolName === "set_do_not_call") {
      const phone = normalizePhone(body?.phone);
      if (!phone) return response({ error: "invalid_phone" }, 400);
      const reason = safeText(body?.reason, 500) || "User requested during call";
      const { error } = await supabase
        .from("do_not_call")
        .upsert({ phone, reason }, { onConflict: "phone" });
      if (error) return response({ error: "do_not_call_update_failed" }, 500);
      return response({ success: true });
    }

    return response({ error: "unknown_tool" }, 400);
  } catch (error) {
    console.error("voice-tools error", error instanceof Error ? error.message : "unknown");
    return response({ error: "internal_error" }, 500);
  }
});
