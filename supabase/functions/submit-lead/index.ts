// deno-lint-ignore-file no-import-prefix
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import {
  clientIp,
  corsHeaders as sharedCorsHeaders,
  hashIp,
  isValidEmail,
  normalizeDomain,
} from "../_shared/audit-utils.ts";

declare const EdgeRuntime:
  | { waitUntil: (promise: Promise<unknown>) => void }
  | undefined;

const MAX_BODY_BYTES = 30_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const DUPLICATE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const RATE_LIMIT_SCOPE = "lead_form";
const DEFAULT_CONSENT_VERSION = "2026-07-25";

const corsHeaders = {
  ...sharedCorsHeaders,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

type PublicLeadType = "contact" | "partner_application";
type StoredLeadType = "contact" | "partner";

interface SanitizedLead {
  language: "de" | "en";
  publicLeadType: PublicLeadType;
  storedLeadType: StoredLeadType;
  name: string;
  companyName: string;
  email: string;
  phone: string | null;
  message: string;
  websiteUrl: string | null;
  industry: string | null;
  serviceArea: string;
  region: string | null;
  primaryGoal: string | null;
  primaryLeadSource: string | null;
  systems: string | null;
  landingPage: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  consentMarketing: boolean;
  consentVersion: string;
}

interface NotificationLead {
  publicLeadType: PublicLeadType;
  isDuplicate: boolean;
}

type JsonReadResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: number; code: string };

function json(
  payload: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

function text(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return normalized.slice(0, maxLength);
}

async function readJsonBody(req: Request): Promise<JsonReadResult> {
  const rawLength = req.headers.get("content-length");
  if (rawLength !== null) {
    const declaredLength = Number(rawLength);
    if (!Number.isInteger(declaredLength) || declaredLength < 0) {
      return { ok: false, status: 400, code: "invalid_content_length" };
    }
    if (declaredLength > MAX_BODY_BYTES) {
      return { ok: false, status: 413, code: "request_too_large" };
    }
  }

  if (!req.body) return { ok: false, status: 400, code: "invalid_json" };

  const reader = req.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let raw = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel("request_too_large");
        return { ok: false, status: 413, code: "request_too_large" };
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
  } catch {
    return { ok: false, status: 400, code: "invalid_body" };
  } finally {
    reader.releaseLock();
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, status: 400, code: "invalid_json_object" };
    }
    return { ok: true, body: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400, code: "invalid_json" };
  }
}

function validateAndSanitize(body: Record<string, unknown>):
  | { ok: true; lead: SanitizedLead }
  | { ok: false; language: "de" | "en"; errors: Record<string, string> } {
  const language = body.language === "en" ? "en" : "de";
  const isDE = language === "de";
  const errors: Record<string, string> = {};

  if (body.language !== "de" && body.language !== "en") {
    errors.language = isDE ? "Ungültige Sprache." : "Invalid language.";
  }

  const publicLeadType = body.lead_type === "contact" ||
      body.lead_type === "partner_application"
    ? body.lead_type
    : null;
  if (!publicLeadType) {
    errors.lead_type = isDE
      ? "Dieser Anfrage-Typ wird nicht unterstützt."
      : "This enquiry type is not supported.";
  }

  const name = text(body.name, 120);
  const companyName = text(body.company_name, 160);
  const email = text(body.email, 254)?.toLowerCase() ?? null;
  const message = text(body.message, 4_000);
  const consentProcessing = body.consent_processing === true;

  if (!name || name.length < 2) {
    errors.name = isDE
      ? "Bitte geben Sie Ihren Namen ein."
      : "Please enter your name.";
  }
  if (!companyName || companyName.length < 2) {
    errors.company_name = isDE
      ? "Bitte geben Sie den Firmennamen ein."
      : "Please enter the company name.";
  }
  if (!email || !isValidEmail(email)) {
    errors.email = isDE
      ? "Bitte geben Sie eine gültige E-Mail-Adresse ein."
      : "Please enter a valid email address.";
  }
  if (!message || message.length < 10) {
    errors.message = isDE
      ? "Bitte beschreiben Sie die Anfrage etwas genauer."
      : "Please add a little more context.";
  }
  if (!consentProcessing) {
    errors.consent_processing = isDE
      ? "Einwilligung zur Verarbeitung ist erforderlich."
      : "Processing consent is required.";
  }

  let websiteUrl: string | null = null;
  const websiteInput = text(body.website_url, 500);
  if (websiteInput) {
    const normalized = normalizeDomain(websiteInput);
    if ("error" in normalized) {
      errors.website_url = isDE
        ? "Bitte geben Sie eine gültige öffentliche Website-URL ein."
        : "Please enter a valid public website URL.";
    } else {
      websiteUrl = normalized.url;
    }
  }

  if (
    !publicLeadType ||
    !name ||
    !companyName ||
    !email ||
    !message ||
    Object.keys(errors).length > 0
  ) {
    return { ok: false, language, errors };
  }

  const serviceArea = text(body.service_area, 120) ??
    (publicLeadType === "partner_application"
      ? "partner_application"
      : "contact");

  return {
    ok: true,
    lead: {
      language,
      publicLeadType,
      storedLeadType: publicLeadType === "partner_application"
        ? "partner"
        : "contact",
      name,
      companyName,
      email,
      phone: text(body.phone, 60),
      message,
      websiteUrl,
      industry: text(body.industry, 120),
      serviceArea,
      region: text(body.region, 120),
      primaryGoal: text(body.primary_goal, 160),
      primaryLeadSource: text(body.primary_lead_source, 120),
      systems: text(body.systems, 500),
      landingPage: text(body.landing_page, 500),
      referrer: text(body.referrer, 1_000),
      utmSource: text(body.utm_source, 200),
      utmMedium: text(body.utm_medium, 200),
      utmCampaign: text(body.utm_campaign, 300),
      utmTerm: text(body.utm_term, 300),
      utmContent: text(body.utm_content, 300),
      gclid: text(body.gclid, 300),
      consentMarketing: body.consent_marketing === true,
      // Policy version is server-authoritative; the caller cannot rewrite the
      // consent record by supplying an arbitrary version string.
      consentVersion: DEFAULT_CONSENT_VERSION,
    },
  };
}

async function sendSlackNotification(
  lead: NotificationLead,
  adminUrl: string,
): Promise<void> {
  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");
  if (!webhookUrl) {
    console.log(
      "Slack notification disabled: SLACK_WEBHOOK_URL is not configured",
    );
    return;
  }

  const typeLabel = lead.publicLeadType === "partner_application"
    ? "🤝 Partneranfrage"
    : "✉️ Kontaktanfrage";
  const duplicateLabel = lead.isDuplicate ? " · mögliches Duplikat" : "";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `${typeLabel}${duplicateLabel} · neuer Datensatz im geschützten Admin`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: [
                `*Neue ${typeLabel}*${duplicateLabel}`,
                "Kontaktdaten und Geschäftskontext bleiben im geschützten itsFeierabend.ch-Admin.",
              ].join("\n"),
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "Im Admin öffnen" },
                url: adminUrl,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error(`Slack notification failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Slack notification failed:",
      error instanceof Error ? error.message : "unknown_error",
    );
  }
}

function runAfterResponse(promise: Promise<unknown>): void {
  if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
    EdgeRuntime.waitUntil(promise);
    return;
  }
  void promise;
}

async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json(
      { error: "Method not allowed.", code: "method_not_allowed" },
      405,
      { Allow: "POST, OPTIONS" },
    );
  }

  const contentType = req.headers.get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return json(
      {
        error: "Content-Type must be application/json.",
        code: "unsupported_media_type",
      },
      415,
    );
  }

  const parsed = await readJsonBody(req);
  if (!parsed.ok) {
    return json({ error: parsed.code, code: parsed.code }, parsed.status);
  }

  const body = parsed.body;
  const honeypot = text(body.honeypot, 200);
  if (honeypot) {
    // Deliberately indistinguishable from a successful submission.
    return json({ success: true }, 200);
  }

  const validation = validateAndSanitize(body);
  if (!validation.ok) {
    return json(
      {
        error: validation.language === "de"
          ? "Bitte prüfen Sie die markierten Felder."
          : "Please check the highlighted fields.",
        errors: validation.errors,
        code: "validation_error",
      },
      400,
    );
  }
  const leadInput = validation.lead;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("submit-lead configuration is incomplete");
    return json(
      {
        error: "Service temporarily unavailable.",
        code: "service_unavailable",
      },
      503,
    );
  }

  const ip = clientIp(req);
  const ipHash = await hashIp(ip);
  if (!ipHash) {
    console.error("submit-lead could not determine a client IP");
    return json(
      {
        error: "Service temporarily unavailable.",
        code: "client_ip_unavailable",
      },
      503,
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const rateLimitSince = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)
    .toISOString();
  const { count: recentSubmissions, error: rateLimitReadError } = await supabase
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("scope", RATE_LIMIT_SCOPE)
    .eq("ip_hash", ipHash)
    .gte("created_at", rateLimitSince);

  if (rateLimitReadError) {
    console.error("submit-lead rate-limit check failed");
    return json(
      {
        error: "Service temporarily unavailable.",
        code: "rate_limit_unavailable",
      },
      503,
    );
  }
  if ((recentSubmissions ?? 0) >= RATE_LIMIT_MAX) {
    return json(
      {
        error: leadInput.language === "de"
          ? "Zu viele Versuche. Bitte warten Sie kurz."
          : "Too many attempts. Please wait a moment.",
        code: "rate_limit",
      },
      429,
      { "Retry-After": String(RATE_LIMIT_WINDOW_MS / 1_000) },
    );
  }

  const { error: rateLimitWriteError } = await supabase
    .from("rate_limits")
    .insert({ ip_hash: ipHash, scope: RATE_LIMIT_SCOPE });
  if (rateLimitWriteError) {
    console.error("submit-lead rate-limit record failed");
    return json(
      {
        error: "Service temporarily unavailable.",
        code: "rate_limit_unavailable",
      },
      503,
    );
  }

  const duplicateSince = new Date(Date.now() - DUPLICATE_WINDOW_MS)
    .toISOString();
  const { data: existingLead, error: duplicateReadError } = await supabase
    .from("leads")
    .select("id")
    .eq("email", leadInput.email)
    .eq("lead_type", leadInput.storedLeadType)
    .gte("created_at", duplicateSince)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (duplicateReadError) {
    console.error("submit-lead duplicate check failed");
    return json(
      {
        error: "Service temporarily unavailable.",
        code: "duplicate_check_unavailable",
      },
      503,
    );
  }

  const isDuplicate = Boolean(existingLead?.id);
  const duplicateOf = existingLead?.id ?? null;
  const consentAt = new Date().toISOString();
  const userAgent = text(req.headers.get("user-agent"), 500);

  const { data: insertedLead, error: insertError } = await supabase
    .from("leads")
    .insert({
      language: leadInput.language,
      lead_type: leadInput.storedLeadType,
      industry: leadInput.industry ?? "not_specified",
      service_area: leadInput.serviceArea,
      website_url: leadInput.websiteUrl,
      budget_range: null,
      capacity_range: null,
      name: leadInput.name,
      email: leadInput.email,
      phone: leadInput.phone,
      message: leadInput.message,
      preferred_times: null,
      utm_source: leadInput.utmSource,
      utm_medium: leadInput.utmMedium,
      utm_campaign: leadInput.utmCampaign,
      utm_term: leadInput.utmTerm,
      utm_content: leadInput.utmContent,
      gclid: leadInput.gclid,
      referrer: leadInput.referrer,
      user_agent: userAgent,
      ip_hash: ipHash,
      company_name: leadInput.companyName,
      region: leadInput.region,
      primary_goal: leadInput.primaryGoal,
      primary_lead_source: leadInput.primaryLeadSource,
      challenges: [],
      systems: leadInput.systems,
      landing_page: leadInput.landingPage,
      audit_type: null,
      keyword: leadInput.utmTerm,
      lead_score: null,
      consent_processing: true,
      consent_marketing: leadInput.consentMarketing,
      consent_at: consentAt,
      consent_version: leadInput.consentVersion,
      public_token: null,
      pre_score_total: null,
      pre_score_bucket: null,
      is_duplicate: isDuplicate,
      duplicate_of: duplicateOf,
    })
    .select("id")
    .single();

  if (insertError || !insertedLead?.id) {
    console.error("submit-lead insert failed");
    return json(
      {
        error: leadInput.language === "de"
          ? "Die Anfrage konnte nicht gespeichert werden."
          : "The enquiry could not be saved.",
        code: "lead_db_error",
      },
      500,
    );
  }

  const adminUrl = "https://itsfeierabend.ch/admin/leads";
  runAfterResponse(sendSlackNotification({
    publicLeadType: leadInput.publicLeadType,
    isDuplicate,
  }, adminUrl));

  const cleanupBefore = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  runAfterResponse(
    Promise.resolve(
      supabase
        .from("rate_limits")
        .delete()
        .eq("scope", RATE_LIMIT_SCOPE)
        .lt("created_at", cleanupBefore),
    )
      .then(({ error }) => {
        if (error) console.error("submit-lead rate-limit cleanup failed");
      })
      .catch(() => {
        console.error("submit-lead rate-limit cleanup failed");
      }),
  );

  // Keep the public response deliberately minimal: duplicate status and
  // internal row identifiers must not become an account-enumeration signal.
  return json({ success: true });
}

serve(async (req: Request): Promise<Response> => {
  try {
    return await handleRequest(req);
  } catch (error) {
    console.error(
      "submit-lead unexpected failure:",
      error instanceof Error ? error.message : "unknown_error",
    );
    return json(
      { error: "Service temporarily unavailable.", code: "server_error" },
      500,
    );
  }
});
