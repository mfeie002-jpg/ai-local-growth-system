import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { corsHeaders } from "../_shared/audit-utils.ts";
import { runSignals, computeScore } from "../_shared/audit-signals.ts";
import { fetchSiteSignals } from "../_shared/fetch-site-signals.ts";
import { enrichDomain, buildVisibilitySignal } from "../_shared/semrush.ts";
import { makeCacheAdapter, makeUsageAdapter } from "../_shared/semrush-adapters.ts";

async function deliverReportEmail(
  projectUrl: string,
  serviceKey: string,
  auditId: string,
): Promise<void> {
  try {
    const response = await fetch(`${projectUrl}/functions/v1/send-report-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ audit_id: auditId }),
    });
    if (!response.ok) {
      console.error(`send-report-email returned ${response.status}`);
    }
  } catch (error) {
    console.error("send-report-email request failed:", error);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (req.headers.get("authorization") !== `Bearer ${serviceKey}`) {
    return json({ error: "unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    serviceKey,
  );

  try {
    const { audit_id } = await req.json();
    if (!audit_id) return json({ error: "audit_id required" }, 400);

    const { data: audit, error: fetchErr } = await supabase
      .from("audit_requests")
      .select("id, lead_id, website_url, normalized_domain, language, email, first_name, audit_type, status")
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
      // Public scanning was unavailable. Preserve a transparent preliminary
      // result instead of inventing measurements.
      const { error: partialUpdateError } = await supabase
        .from("audit_requests")
        .update({
          status: "partial",
          error: fetchError ?? "unknown fetch error",
          signals: [],
          top_actions: [{
            rank: 1,
            signal_id: "manual_review_required",
            category: "technical",
            title: audit.language === "en"
              ? "Manual website review required"
              : "Manuelle Website-Prüfung erforderlich",
            recommendation: audit.language === "en"
              ? "The public scan could not reach enough evidence. Continue with an expert review before acting on a score."
              : "Der öffentliche Scan konnte nicht genügend Evidenz abrufen. Vor Massnahmen ist eine Expertenprüfung nötig.",
            impact: 0,
          }],
          fetch_meta: { partial: true, message: fetchError, evidence_state: "unavailable" },
          completed_at: new Date().toISOString(),
        })
        .eq("id", audit_id);
      if (partialUpdateError) {
        console.error("partial audit update failed:", partialUpdateError);
        return json({ error: "partial_result_persistence_failed" }, 500);
      }
      const { error: partialEventError } = await supabase.from("audit_events").insert({
        audit_id,
        event_type: "report_ready",
        metadata: { stage: "fetch", error: fetchError },
      });
      if (partialEventError) {
        console.error("partial report_ready event failed:", partialEventError);
      }
      await deliverReportEmail(
        Deno.env.get("SUPABASE_URL")!,
        serviceKey,
        audit_id,
      );
      return json({ ok: true, status: "partial", reason: fetchError }, 200);
    }

    await supabase.from("audit_events").insert({
      audit_id,
      event_type: "fetch_complete",
      metadata: { status: ctx.status, responseTimeMs: ctx.responseTimeMs, sizeBytes: ctx.sizeBytes },
    });

    await supabase.from("audit_requests").update({ status: "scoring" }).eq("id", audit_id);

    const signals = runSignals(ctx, audit.language === "en" ? "en" : "de");
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
      database: "ch",
    }).catch((e) => {
      console.warn("[semrush] enrichment threw:", (e as Error).message);
      return null;
    });

    // Append a non-scoring visibility signal (marked unavailable if needed).
    const visibility = buildVisibilitySignal(enrichment, audit.language === "en" ? "en" : "de");
    const signalsWithVisibility = [...signals, visibility];

    await supabase.from("audit_events").insert({
      audit_id,
      event_type: "scoring_complete",
      metadata: {
        overall_score: score.overall_score,
        score_version: score.score_version,
        audit_type: audit.audit_type,
        semrush_status: enrichment?.status ?? "skipped_disabled",
        semrush_calls: enrichment?.calls?.length ?? 0,
      },
    });

    if (audit.lead_id) {
      const { error: leadUpdateError } = await supabase
        .from("leads")
        .update({ lead_score: score.overall_score, status: "scored" })
        .eq("id", audit.lead_id);
      if (leadUpdateError) console.error("lead score update failed:", leadUpdateError);
    }

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
          partial: Boolean(partial),
          fetch_warning: fetchError ?? null,
          has_sitemap: ctx.hasSitemap,
          has_robots: ctx.hasRobots,
          audit_type: audit.audit_type,
          scoring_scope: "public_homepage_signals_only",
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

    // Complete the delivery attempt before the function exits. The email
    // handler records sent/skipped/failed states and is idempotent per audit.
    await deliverReportEmail(
      Deno.env.get("SUPABASE_URL")!,
      serviceKey,
      audit_id,
    );

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

const STOP = new Set([
  "und","oder","der","die","das","den","dem","des","ein","eine","einen","mit","für","auf","aus","bei","von","zu","im","in","am","an","als","ist","sind","wir","sie","ihr","auch","nicht","the","and","for","with","from","this","that","your","you","our","are","was","were","have","has","its","have","been","which","will","just","not"
]);

/**
 * Extract up to N reasonable keyword candidates from the site's HTML
 * (title + H1 + H2). Deterministic; visitors cannot influence this.
 */
export function deriveKeywords(html: string): string[] {
  const parts: string[] = [];
  const push = (re: RegExp) => {
    const m = html.match(re);
    if (m && m[1]) parts.push(m[1]);
  };
  push(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1s = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) ?? [];
  const h2s = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) ?? [];
  for (const h of [...h1s, ...h2s].slice(0, 5)) {
    const inner = h.replace(/<[^>]+>/g, " ").trim();
    if (inner) parts.push(inner);
  }
  const text = parts.join(" ").toLowerCase().replace(/[^a-zäöüß0-9\s\-]/g, " ");
  const tokens = text.split(/\s+/).filter((w) => w.length >= 4 && !STOP.has(w));

  // 2-word phrases first, then unique single tokens.
  const phrases: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    phrases.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of [...phrases, ...tokens]) {
    if (!seen.has(p)) { seen.add(p); out.push(p); }
    if (out.length >= 5) break;
  }
  return out;
}
