import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/audit-utils.ts";
import { runSignals, computeScore, type SiteContext } from "../_shared/audit-signals.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { context } = await req.json();
    if (!context) {
      return new Response(JSON.stringify({ error: "context required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const signals = runSignals(context as SiteContext);
    const score = computeScore(signals);
    return new Response(JSON.stringify({ signals, ...score }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
