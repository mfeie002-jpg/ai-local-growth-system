import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { corsHeaders } from "../_shared/audit-utils.ts";

const SITE_URL = "https://itsfeierabend.ch";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (req.headers.get("authorization") !== `Bearer ${serviceKey}`) {
    return json({ error: "unauthorized" }, 401);
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);

  try {
    const { audit_id } = await req.json();
    if (!audit_id || typeof audit_id !== "string") {
      return json({ error: "audit_id required" }, 400);
    }

    const { data: audit, error } = await supabase
      .from("audit_requests")
      .select("id, token, first_name, email, language, normalized_domain, overall_score, status, email_sent_at, email_provider_id")
      .eq("id", audit_id)
      .maybeSingle();

    if (error || !audit) return json({ error: "audit not found" }, 404);
    if (audit.status !== "ready" && audit.status !== "partial") {
      return json({ error: "audit not ready" }, 409);
    }
    if (audit.email_sent_at) {
      return json({
        ok: true,
        idempotent: true,
        provider_id: audit.email_provider_id,
      });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      await supabase.from("audit_events").insert({
        audit_id,
        event_type: "email_skipped",
        metadata: { reason: "provider_not_configured" },
      });
      return json({ ok: false, code: "email_provider_unavailable" }, 503);
    }

    const lang = audit.language === "en" ? "en" : "de";
    const path = lang === "en"
      ? `/en/audit/r/${audit.token}`
      : `/audit/r/${audit.token}`;
    const link = `${SITE_URL}${path}`;
    const scoreLine = typeof audit.overall_score === "number"
      ? (lang === "en"
        ? `Overall score: ${audit.overall_score}/100`
        : `Gesamtscore: ${audit.overall_score}/100`)
      : (lang === "en"
        ? "The report is preliminary because some public measurements were unavailable."
        : "Der Report ist vorläufig, weil einzelne öffentliche Messungen nicht verfügbar waren.");

    const subject = lang === "en"
      ? `Your business audit for ${audit.normalized_domain} is ready`
      : `Ihr Business Audit für ${audit.normalized_domain} ist bereit`;
    const greeting = lang === "en"
      ? `Hello ${escapeHtml(audit.first_name)},`
      : `Guten Tag ${escapeHtml(audit.first_name)},`;
    const intro = lang === "en"
      ? `Your private audit report for <strong>${escapeHtml(audit.normalized_domain)}</strong> is ready.`
      : `Ihr privater Audit-Report für <strong>${escapeHtml(audit.normalized_domain)}</strong> ist bereit.`;
    const button = lang === "en" ? "Open private report" : "Privaten Report öffnen";
    const privacy = lang === "en"
      ? "This transactional email was sent because you requested the audit."
      : "Diese Transaktions-E-Mail wurde versendet, weil Sie den Audit angefordert haben.";

    const html = `
      <!doctype html>
      <html lang="${lang}">
        <body style="margin:0;background:#f4f4f5;color:#111827;font-family:Arial,sans-serif">
          <div style="max-width:620px;margin:0 auto;padding:32px 18px">
            <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;padding:32px">
              <p style="margin:0 0 18px">${greeting}</p>
              <p style="margin:0 0 18px;line-height:1.6">${intro}</p>
              <p style="margin:0 0 24px;line-height:1.6">${escapeHtml(scoreLine)}</p>
              <p style="margin:0 0 28px">
                <a href="${link}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;border-radius:999px;padding:14px 22px">${button}</a>
              </p>
              <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5">${privacy}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `audit-report-${audit.id}`,
      },
      body: JSON.stringify({
        from: Deno.env.get("REPORT_EMAIL_FROM") || "itsFeierabend.ch <noreply@itsfeierabend.ch>",
        to: [audit.email],
        subject,
        html,
      }),
    });

    const providerBody = await response.json().catch(() => ({})) as {
      id?: string;
      message?: string;
    };
    if (!response.ok || !providerBody.id) {
      await supabase.from("audit_events").insert({
        audit_id,
        event_type: "email_failed",
        metadata: {
          provider: "resend",
          status: response.status,
          reason: providerBody.message || "provider_error",
        },
      });
      return json({ ok: false, code: "email_provider_error" }, 502);
    }

    const sentAt = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("audit_requests")
      .update({
        email_sent_at: sentAt,
        email_provider_id: providerBody.id,
      })
      .eq("id", audit_id)
      .is("email_sent_at", null);
    if (updateError) {
      console.error("email state update failed:", updateError);
      return json({ ok: false, code: "email_state_update_failed" }, 500);
    }

    await supabase.from("audit_events").insert({
      audit_id,
      event_type: "email_sent",
      metadata: {
        provider: "resend",
        provider_id: providerBody.id,
        delivered: true,
      },
    });

    return json({ ok: true, provider_id: providerBody.id });
  } catch (error) {
    console.error("send-report-email error:", error);
    return json({ error: "internal_error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
