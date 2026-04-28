// Spoke → Hub Webhook Sender. Signs payload with HUB_WEBHOOK_SECRET (HMAC-SHA256).
// BRAND for this spoke (itsfeierabend.ch)
const BRAND = "itsfeierabend";

const HUB_RECEIVER_URL =
  "https://vgitgdvxanodfgokokix.supabase.co/functions/v1/spoke-webhook-receiver";

// Hub anon key (publishable, safe to embed). Required so the receiver accepts the request at the gateway.
const HUB_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4";

const ALLOWED_EVENTS = new Set([
  "lead_submitted",
  "form_started",
  "form_completed",
  "page_view",
  "error",
  "build_completed",
  "custom",
]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function hmacHex(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const secret = Deno.env.get("HUB_WEBHOOK_SECRET");
    if (!secret) throw new Error("HUB_WEBHOOK_SECRET not configured on this spoke");

    const input = await req.json().catch(() => ({}));
    const event_type = input.event_type ?? "custom";
    if (!ALLOWED_EVENTS.has(event_type)) {
      return new Response(JSON.stringify({ error: "invalid event_type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = JSON.stringify({
      brand: BRAND,
      event_type,
      source_url: input.source_url ?? null,
      payload: input.payload ?? {},
    });

    const signature = await hmacHex(secret, body);

    const r = await fetch(HUB_RECEIVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": HUB_ANON_KEY,
        "Authorization": `Bearer ${HUB_ANON_KEY}`,
        "x-spoke-signature": signature,
      },
      body,
    });

    const text = await r.text();
    let json: unknown = text;
    try { json = JSON.parse(text); } catch { /* keep text */ }

    return new Response(
      JSON.stringify({ forwarded: true, hub_status: r.status, hub_response: json }),
      {
        status: r.ok ? 200 : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    console.error("report-event error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
