import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/audit-utils.ts";
import { fetchSiteSignals } from "../_shared/fetch-site-signals.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceKey || req.headers.get("authorization") !== `Bearer ${serviceKey}`) {
    return json({ error: "unauthorized" }, 401);
  }

  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > 2_000) {
      return json({ error: "request_too_large" }, 413);
    }
    const body = JSON.parse(raw) as { url?: unknown };
    if (!body.url || typeof body.url !== "string") {
      return json({ error: "url required" }, 400);
    }
    return json(await fetchSiteSignals(body.url));
  } catch (error) {
    console.error("fetch-site-signals internal failure:", error);
    return json({ error: "internal_error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
