import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { corsHeaders } from "../_shared/audit-utils.ts";
import { runSignals, computeScore } from "../_shared/audit-signals.ts";
import { fetchSiteSignals } from "../fetch-site-signals/index.ts";
import { enrichDomain, buildVisibilitySignal } from "../_shared/semrush.ts";
import { makeCacheAdapter, makeUsageAdapter } from "../_shared/semrush-adapters.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { audit_id } = await req.json();
    if (!audit_id) return json({ error: "audit_id required" }, 400);

    const { data: audit, error: fetchErr } = await supabase
      .from("audit_requests")
      .select("id, website_url, normalized_domain, language, email, first_name, status")
      .eq("id", audit_id)
      .maybeSingle();

    if (fetchErr || !audit) {
      console.error("audit not found:", fetchErr);
      return json({ error: "audit not found" }, 404);
    }

    await supabase.from("audit_requests").update({ status: "fetching" }).eq("id", audit_id);
    await supabase.from("audit_events").insert({ audit_id, event_type: "fetch_started" });

    const { ctx, error: fetchError, partial } = await fetchSiteSignals(audit.website_url);

    if (!ctx) {
      // Failure — record error but still allow partial view
      await supabase
        .from("audit_requests")
        .update({
          status: "failed",
          error: fetchError ?? "unknown fetch error",
          fetch_meta: { partial: true, message: fetchError },
        })
        .eq("id", audit_id);
      await supabase.from("audit_events").insert({
        audit_id,
        event_type: "failed",
        metadata: { stage: "fetch", error: fetchError },
      });
      return json({ ok: false, reason: fetchError }, 200);
    }

    await supabase.from("audit_events").insert({
      audit_id,
      event_type: "fetch_complete",
      metadata: { status: ctx.status, responseTimeMs: ctx.responseTimeMs, sizeBytes: ctx.sizeBytes },
    });

    await supabase.from("audit_requests").update({ status: "scoring" }).eq("id", audit_id);

    const signals = runSignals(ctx);
    const score = computeScore(signals);

    // Derive up to 5 recommended keywords from title + H1 words — never from user input.
    const recommendedKeywords = deriveKeywords(ctx.html).slice(0, 5);

    // Semrush enrichment. Never blocks the audit; failures degrade to null.
    const cache = makeCacheAdapter(supabase);
    const usage = makeUsageAdapter(supabase);
    const dailyLimit = Number(Deno.env.get("SEMRUSH_DAILY_FRESH_LIMIT") ?? "50");
    const enrichment = await enrichDomain(audit.normalized_domain, {
      cache,
      usage,
      lovableApiKey: Deno.env.get("LOVABLE_API_KEY"),
      semrushApiKey: Deno.env.get("SEMRUSH_API_KEY"),
      dailyFreshLimit: Number.isFinite(dailyLimit) ? dailyLimit : 50,
      recommendedKeywords,
      database: audit.language === "en" ? "us" : "de",
    }).catch((e) => {
      console.warn("[semrush] enrichment threw:", (e as Error).message);
      return null;
    });

    // Append a non-scoring visibility signal (marked unavailable if needed).
    const visibility = buildVisibilitySignal(enrichment);
    const signalsWithVisibility = [...signals, visibility];

    await supabase.from("audit_events").insert({
      audit_id,
      event_type: "scoring_complete",
      metadata: {
        overall_score: score.overall_score,
        score_version: score.score_version,
        semrush_status: enrichment?.status ?? "skipped_disabled",
        semrush_calls: enrichment?.calls?.length ?? 0,
      },
    });

    const finalStatus = partial ? "partial" : "ready";

    const { error: updErr } = await supabase
      .from("audit_requests")
      .update({
        status: finalStatus,
        score_version: score.score_version,
        overall_score: score.overall_score,
        category_scores: score.category_scores,
        signals: signalsWithVisibility,
        top_actions: score.top_actions,
        fetch_meta: {
          final_url: ctx.finalUrl,
          status: ctx.status,
          response_time_ms: ctx.responseTimeMs,
          size_bytes: ctx.sizeBytes,
          has_sitemap: ctx.hasSitemap,
          has_robots: ctx.hasRobots,
        },
        semrush_status: enrichment?.status ?? "skipped_disabled",
        semrush_data: enrichment?.data ?? null,
        semrush_calls: enrichment?.calls ?? [],
        semrush_fetched_at: enrichment?.fetched_at ?? null,
        completed_at: new Date().toISOString(),
      })
      .eq("id", audit_id);

    if (updErr) {
      console.error("update failed:", updErr);
      return json({ ok: false, error: updErr.message }, 500);
    }

    await supabase.from("audit_events").insert({
      audit_id,
      event_type: "report_ready",
      metadata: { overall_score: score.overall_score },
    });

    // Fire and forget email
    const projectUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    fetch(`${projectUrl}/functions/v1/send-report-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceKey}` },
      body: JSON.stringify({ audit_id }),
    }).catch((e) => console.error("send-report-email kick failed:", e));

    return json({ ok: true, overall_score: score.overall_score, status: finalStatus }, 200);
  } catch (e) {
    console.error("generate-report error:", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
