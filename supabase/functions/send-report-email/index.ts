import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { corsHeaders } from "../_shared/audit-utils.ts";

const SITE_URL = "https://itsfeierabend.ch";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { audit_id } = await req.json();
    if (!audit_id) return json({ error: "audit_id required" }, 400);

    const { data: audit, error } = await supabase
      .from("audit_requests")
      .select("id, token, first_name, email, language, normalized_domain, overall_score, status")
      .eq("id", audit_id)
      .maybeSingle();

    if (error || !audit) return json({ error: "audit not found" }, 404);
    if (audit.status !== "ready" && audit.status !== "partial") {
      return json({ error: "audit not ready" }, 400);
    }

    const lang = audit.language === "en" ? "en" : "de";
    const path = lang === "en"
      ? `/en/audit/result/${audit.token}`
      : `/audit/ergebnis/${audit.token}`;
    const link = `${SITE_URL}${path}`;

    const subject = lang === "en"
      ? `Your website audit for ${audit.normalized_domain} is ready`
      : `Dein Website-Audit für ${audit.normalized_domain} ist bereit`;

    const bodyText = lang === "en"
      ? `Hi ${audit.first_name},\n\nyour free website audit for ${audit.normalized_domain} is ready.\n\nOverall score: ${audit.overall_score}/100\n\nView the full report here (private link):\n${link}\n\nThis link is only for you. Do not share it.\n\n— itsFeierabend.ch`
      : `Hallo ${audit.first_name},\n\ndein kostenloser Website-Audit für ${audit.normalized_domain} ist bereit.\n\nGesamt-Score: ${audit.overall_score}/100\n\nHier findest du den vollständigen Report (privater Link):\n${link}\n\nDer Link ist nur für dich bestimmt. Bitte nicht weitergeben.\n\n— itsFeierabend.ch`;

    // Store email as event; actual delivery is a follow-up step (requires provider secret).
    // If a mail provider is later wired (Resend / Lovable Emails), plug it in here.
    await supabase.from("audit_events").insert({
      audit_id,
      event_type: "email_sent",
      metadata: { subject, link, delivered: false, note: "no mail provider wired yet — link available in dashboard" },
    });

    await supabase
      .from("audit_requests")
      .update({ email_sent_at: new Date().toISOString() })
      .eq("id", audit_id);

    return json({ ok: true, link, subject, preview: bodyText.slice(0, 120) }, 200);
  } catch (e) {
    console.error("send-report-email error:", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
