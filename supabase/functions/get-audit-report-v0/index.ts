import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { corsHeaders, clientIp, hashIp } from "../_shared/audit-utils.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const url = new URL(req.url);
    let token: string | null = url.searchParams.get("token");
    let event: string | null = null;

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      token = token ?? body.token;
      event = body.event ?? null;
    }

    if (!token || !/^[0-9a-f-]{36}$/i.test(token)) {
      return json({ error: "invalid token" }, 400);
    }

    const { data: audit, error } = await supabase
      .from("audit_requests")
      .select("id, token, website_url, normalized_domain, first_name, last_name, email, language, status, overall_score, category_scores, signals, top_actions, score_version, completed_at, created_at, fetch_meta, error")
      .eq("token", token)
      .maybeSingle();

    if (error || !audit) {
      return json({ error: "not found" }, 404);
    }

    // Track events
    const ip = clientIp(req);
    const ipHash = await hashIp(ip);
    const userAgent = req.headers.get("user-agent") ?? null;

    if (event === "view" && (audit.status === "ready" || audit.status === "partial")) {
      await supabase
        .from("audit_requests")
        .update({ report_viewed_at: new Date().toISOString() })
        .eq("id", audit.id)
        .is("report_viewed_at", null);
      await supabase.from("audit_events").insert({
        audit_id: audit.id,
        event_type: "report_viewed",
        ip_hash: ipHash,
        user_agent: userAgent,
      });
    } else if (event === "cta_click") {
      await supabase
        .from("audit_requests")
        .update({ cta_clicked_at: new Date().toISOString() })
        .eq("id", audit.id);
      await supabase.from("audit_events").insert({
        audit_id: audit.id,
        event_type: "cta_clicked",
        ip_hash: ipHash,
        user_agent: userAgent,
      });
    }

    // Don't leak email; return only what UI needs.
    return json({
      token: audit.token,
      website_url: audit.website_url,
      normalized_domain: audit.normalized_domain,
      first_name: audit.first_name,
      language: audit.language,
      status: audit.status,
      overall_score: audit.overall_score,
      category_scores: audit.category_scores,
      signals: audit.signals,
      top_actions: audit.top_actions,
      score_version: audit.score_version,
      completed_at: audit.completed_at,
      created_at: audit.created_at,
      fetch_meta: audit.fetch_meta,
      error: audit.error,
    }, 200);
  } catch (e) {
    console.error("get-audit-report error:", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
