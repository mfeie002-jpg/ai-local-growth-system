import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { corsHeaders, normalizeDomain, isValidEmail, hashIp, clientIp } from "../_shared/audit-utils.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

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
    } = body ?? {};

    // Server-side validation
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
    const norm = normalizeDomain(website_url);
    if (!norm) {
      return json({ error: "Ungültige Website-URL", code: "invalid_url" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const ip = clientIp(req);
    const ipHash = await hashIp(ip);
    const userAgent = req.headers.get("user-agent") ?? null;

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

    await supabase.from("audit_events").insert({
      audit_id: audit.id,
      event_type: "submitted",
      metadata: { language: lang, domain: norm.domain },
      ip_hash: ipHash,
      user_agent: userAgent,
    });

    // Fire and forget: kick off report generation
    const projectUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Don't await — return the token immediately
    fetch(`${projectUrl}/functions/v1/generate-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ audit_id: audit.id }),
    }).catch((e) => console.error("generate-report kick failed:", e));

    return json({
      success: true,
      token: audit.token,
      redirect_path: lang === "en" ? `/en/audit/result/${audit.token}` : `/audit/ergebnis/${audit.token}`,
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
