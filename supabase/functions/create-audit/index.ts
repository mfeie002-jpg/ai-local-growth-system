import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import {
  corsHeaders,
  normalizeDomain,
  isValidEmail,
  hashIp,
  clientIp,
  verifyTurnstile,
} from "../_shared/audit-utils.ts";
import { checkLimits, recordLimitHits } from "../_shared/audit-limits.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const ip = clientIp(req);
  const ipHash = await hashIp(ip);
  const userAgent = req.headers.get("user-agent") ?? null;

  const logEvent = (event_type: string, metadata: Record<string, unknown>) =>
    supabase.from("audit_events").insert({
      audit_id: null,
      event_type,
      metadata,
      ip_hash: ipHash,
      user_agent: userAgent,
    }).then(() => {}, (e) => console.error("event log failed:", e));

  try {
    const body = await req.json();
    const {
      website_url,
      first_name,
      last_name,
      email,
      language,
      consent_processing,
      consent_marketing,
      turnstile_token,
    } = body ?? {};

    // 1) Bot check first (cheap fail)
    const verdict = await verifyTurnstile(turnstile_token, ip);
    if (!verdict.ok) {
      await logEvent("bot_check_failed", { reason: verdict.reason });
      return json({ error: "Bot-Check fehlgeschlagen. Bitte lade die Seite neu.", code: "bot_check_failed" }, 400);
    }

    // 2) Field validation
    if (!consent_processing) {
      return json({ error: "Consent für Verarbeitung ist erforderlich.", code: "consent_required" }, 400);
    }
    if (!first_name || typeof first_name !== "string" || first_name.trim().length < 2 || first_name.length > 80) {
      return json({ error: "Ungültiger Vorname", code: "invalid_first_name" }, 400);
    }
    if (!last_name || typeof last_name !== "string" || last_name.trim().length < 2 || last_name.length > 80) {
      return json({ error: "Ungültiger Nachname", code: "invalid_last_name" }, 400);
    }
    if (!isValidEmail(email)) {
      return json({ error: "Ungültige E-Mail-Adresse", code: "invalid_email" }, 400);
    }
    const lang = language === "en" ? "en" : "de";

    // 3) URL validation (protocol, localhost, IP literal, malformed)
    const norm = normalizeDomain(website_url);
    if ("error" in norm) {
      await logEvent("url_rejected", { reason: norm.error, input: String(website_url).slice(0, 200) });
      const msgs: Record<string, string> = {
        empty: "Bitte eine Website-URL angeben.",
        malformed: "Ungültige URL.",
        unsupported_protocol: "Nur http und https werden unterstützt.",
        blocked_host: "Dieser Host ist nicht erlaubt.",
        ip_literal: "IP-Adressen sind nicht erlaubt — bitte Domain angeben.",
        invalid_host: "Ungültige Domain.",
      };
      return json({ error: msgs[norm.error] ?? "Ungültige URL", code: `url_${norm.error}` }, 400);
    }

    // 4) Rate limits + per-domain cooldown
    const limit = await checkLimits(supabase, { ipHash, normalizedDomain: norm.domain });
    if (!limit.ok) {
      await logEvent(
        limit.reason === "domain_recently_audited" ? "domain_throttled" : "rate_limited",
        { reason: limit.reason, domain: norm.domain },
      );
      if (limit.reason === "domain_recently_audited" && limit.existingToken) {
        // Return the existing report link so the user still gets a result.
        return json({
          success: true,
          reused: true,
          token: limit.existingToken,
          redirect_path: lang === "en" ? `/en/audit/r/${limit.existingToken}` : `/audit/r/${limit.existingToken}`,
        }, 200);
      }
      const msg = limit.reason === "per_ip_daily_exceeded"
        ? "Tageslimit für diese IP erreicht. Bitte morgen erneut versuchen."
        : "Wir sind heute stark ausgelastet — bitte morgen erneut versuchen.";
      return json({ error: msg, code: limit.reason }, 429);
    }

    // 5) Insert
    const { data: audit, error } = await supabase
      .from("audit_requests")
      .insert({
        website_url: norm.url,
        normalized_domain: norm.domain,
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim().toLowerCase(),
        language: lang,
        consent_processing: !!consent_processing,
        consent_marketing: !!consent_marketing,
        status: "pending",
        ip_hash: ipHash,
        user_agent: userAgent,
      })
      .select("id, token")
      .single();

    if (error || !audit) {
      console.error("Insert failed:", error);
      return json({ error: "Datenbankfehler", code: "db_error" }, 500);
    }

    await Promise.all([
      recordLimitHits(supabase, ipHash),
      supabase.from("audit_events").insert({
        audit_id: audit.id,
        event_type: "submitted",
        metadata: { language: lang, domain: norm.domain },
        ip_hash: ipHash,
        user_agent: userAgent,
      }),
    ]);

    // Kick off report generation (fire-and-forget).
    const projectUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    fetch(`${projectUrl}/functions/v1/generate-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceKey}` },
      body: JSON.stringify({ audit_id: audit.id }),
    }).catch((e) => console.error("generate-report kick failed:", e));

    return json({
      success: true,
      token: audit.token,
      redirect_path: lang === "en" ? `/en/audit/r/${audit.token}` : `/audit/r/${audit.token}`,
    }, 200);
  } catch (e) {
    console.error("create-audit error:", e);
    return json({ error: "Interner Fehler", code: "server_error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
