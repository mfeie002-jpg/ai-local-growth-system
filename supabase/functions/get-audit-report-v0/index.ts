import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { corsHeaders, clientIp, hashIp } from "../_shared/audit-utils.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!(req.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
    return json({ error: "unsupported_media_type" }, 415);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > 2_000) {
      return json({ error: "request_too_large" }, 413);
    }
    let body: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(raw);
      body = parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed as Record<string, unknown>
        : {};
    } catch {
      return json({ error: "invalid_json" }, 400);
    }
    const token = typeof body.token === "string" ? body.token : null;
    const event = typeof body.event === "string" ? body.event : null;

    if (!token || !/^[0-9a-f-]{36}$/i.test(token)) {
      return json({ error: "invalid token" }, 400);
    }

    const { data: audit, error } = await supabase
      .from("audit_requests")
      .select("id, token, website_url, normalized_domain, language, audit_type, status, overall_score, category_scores, signals, top_actions, score_version, completed_at, created_at, fetch_meta, error")
      .eq("token", token)
      .maybeSingle();

    if (error || !audit) {
      return json({ error: "not found" }, 404);
    }

    // Track events
    const ip = clientIp(req);
    const ipHash = await hashIp(ip);
    const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;

    if (event === "view" && (audit.status === "ready" || audit.status === "partial")) {
      const { data: viewed, error: viewError } = await supabase
        .from("audit_requests")
        .update({ report_viewed_at: new Date().toISOString() })
        .eq("id", audit.id)
        .is("report_viewed_at", null)
        .select("id")
        .maybeSingle();
      if (viewError) console.error("report view update failed:", viewError);
      if (viewed) {
        const { error: viewEventError } = await supabase.from("audit_events").insert({
          audit_id: audit.id,
          event_type: "report_viewed",
          ip_hash: ipHash,
          user_agent: userAgent,
        });
        if (viewEventError) console.error("report view event failed:", viewEventError);
      }
    } else if (
      event === "cta_click" &&
      (audit.status === "ready" || audit.status === "partial")
    ) {
      const { data: clicked, error: clickError } = await supabase
        .from("audit_requests")
        .update({ cta_clicked_at: new Date().toISOString() })
        .eq("id", audit.id)
        .is("cta_clicked_at", null)
        .select("id")
        .maybeSingle();
      if (clickError) console.error("report CTA update failed:", clickError);
      if (clicked) {
        const { error: clickEventError } = await supabase.from("audit_events").insert({
          audit_id: audit.id,
          event_type: "cta_clicked",
          ip_hash: ipHash,
          user_agent: userAgent,
        });
        if (clickEventError) console.error("report CTA event failed:", clickEventError);
      }
    }

    // Don't leak email; return only what UI needs.
    return json({
      token: audit.token,
      website_url: audit.website_url,
      normalized_domain: audit.normalized_domain,
      language: audit.language,
      audit_type: audit.audit_type,
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
    console.error("get-audit-report internal failure:", e);
    return json({ error: "internal_error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "private, no-store",
      "Pragma": "no-cache",
    },
  });
}
