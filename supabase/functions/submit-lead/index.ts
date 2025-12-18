import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadSubmission {
  language: "de" | "en";
  lead_type: "free_audit" | "free_call";
  industry: string;
  service_area: string;
  website_url?: string;
  budget_range?: string;
  capacity_range?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferred_times?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  referrer?: string;
  user_agent?: string;
  honeypot?: string;
}

// Generate random hex token
function generateToken(bytes: number = 16): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Calculate pre-score from form data
function calculatePreScore(data: LeadSubmission): { score: number; bucket: 'red' | 'yellow' | 'green' } {
  let score = 50;

  // Budget scoring
  const budget = data.budget_range?.toLowerCase() || '';
  if (budget.includes('7k') || budget.includes('7000') || budget.includes('10k') || budget.includes('10000')) {
    score += 10;
  } else if (budget.includes('3k') || budget.includes('3000') || budget.includes('5k') || budget.includes('5000')) {
    score += 5;
  } else if (budget.includes('<1k') || budget.includes('unter 1') || budget.includes('500') || budget === '') {
    score -= 10;
  }

  // Capacity scoring
  const capacity = data.capacity_range?.toLowerCase() || '';
  if (capacity.includes('30') || capacity.includes('20') || capacity.includes('16')) {
    score += 10;
  } else if (capacity.includes('10') || capacity.includes('15')) {
    score += 5;
  } else if (capacity.includes('1-5') || capacity.includes('1 -') || capacity.includes('0-5')) {
    score -= 10;
  }

  // Website scoring
  if (data.website_url) {
    if (data.website_url.startsWith('https://')) {
      score += 5;
    } else if (data.website_url.startsWith('http://')) {
      score += 2;
    }
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine bucket
  let bucket: 'red' | 'yellow' | 'green';
  if (score < 40) {
    bucket = 'red';
  } else if (score < 75) {
    bucket = 'yellow';
  } else {
    bucket = 'green';
  }

  return { score, bucket };
}

// Hash IP for privacy
async function hashIP(ip: string): Promise<string> {
  const salt = Deno.env.get("IP_HASH_SALT") || "itsfeierabend-default-salt";
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Normalize website URL
function normalizeUrl(url: string | undefined): string | null {
  if (!url) return null;
  let normalized = url.trim();
  if (!normalized) return null;
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = "https://" + normalized;
  }
  return normalized;
}

// Validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate URL
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: LeadSubmission = await req.json();

    // Honeypot check - spam protection
    if (body.honeypot && body.honeypot.trim() !== "") {
      console.log("Honeypot triggered - rejecting submission");
      return new Response(
        JSON.stringify({ success: true }), // Fake success to fool bots
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    const ipHash = await hashIP(clientIP);

    // Rate limiting: max 3 submissions per IP per 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    const { count: recentSubmissions } = await supabase
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", tenMinutesAgo);

    if (recentSubmissions !== null && recentSubmissions >= 3) {
      console.log(`Rate limit exceeded for IP hash: ${ipHash.substring(0, 8)}...`);
      return new Response(
        JSON.stringify({ 
          error: body.language === "de" 
            ? "Zu viele Versuche. Bitte warte kurz." 
            : "Too many attempts. Please wait a moment.",
          code: "rate_limit"
        }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validation
    const errors: Record<string, string> = {};
    const isDE = body.language === "de";

    if (!body.name?.trim()) {
      errors.name = isDE ? "Bitte ausfüllen." : "Please fill this in.";
    }

    if (!body.email?.trim()) {
      errors.email = isDE ? "Bitte ausfüllen." : "Please fill this in.";
    } else if (!isValidEmail(body.email)) {
      errors.email = isDE ? "Bitte prüfe deine E-Mail-Adresse." : "Please check your email.";
    }

    if (!body.industry?.trim()) {
      errors.industry = isDE ? "Bitte ausfüllen." : "Please fill this in.";
    }

    if (!body.service_area?.trim()) {
      errors.service_area = isDE ? "Bitte ausfüllen." : "Please fill this in.";
    }

    // Audit-specific validation
    if (body.lead_type === "free_audit") {
      const normalizedUrl = normalizeUrl(body.website_url);
      if (!normalizedUrl) {
        errors.website_url = isDE ? "Bitte ausfüllen." : "Please fill this in.";
      } else if (!isValidUrl(normalizedUrl)) {
        errors.website_url = isDE ? "Bitte eine gültige URL eingeben." : "Please enter a valid URL.";
      }
      body.website_url = normalizedUrl || undefined;

      if (!body.budget_range?.trim()) {
        errors.budget_range = isDE ? "Bitte ausfüllen." : "Please fill this in.";
      }

      if (!body.capacity_range?.trim()) {
        errors.capacity_range = isDE ? "Bitte ausfüllen." : "Please fill this in.";
      }
    }

    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({ errors, code: "validation_error" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Record rate limit entry
    await supabase.from("rate_limits").insert({ ip_hash: ipHash });

    // Generate public token and pre-score for audits
    let publicToken: string | null = null;
    let preScoreTotal: number | null = null;
    let preScoreBucket: string | null = null;

    if (body.lead_type === "free_audit") {
      publicToken = generateToken(16);
      const preScore = calculatePreScore(body);
      preScoreTotal = preScore.score;
      preScoreBucket = preScore.bucket;
    }

    // Insert lead
    const { data: lead, error: insertError } = await supabase
      .from("leads")
      .insert({
        language: body.language,
        lead_type: body.lead_type,
        industry: body.industry.trim(),
        service_area: body.service_area.trim(),
        website_url: body.website_url || null,
        budget_range: body.budget_range?.trim() || null,
        capacity_range: body.capacity_range?.trim() || null,
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone?.trim() || null,
        message: body.message?.trim() || null,
        preferred_times: body.preferred_times?.trim() || null,
        utm_source: body.utm_source || null,
        utm_medium: body.utm_medium || null,
        utm_campaign: body.utm_campaign || null,
        utm_term: body.utm_term || null,
        utm_content: body.utm_content || null,
        gclid: body.gclid || null,
        referrer: body.referrer || null,
        user_agent: body.user_agent || null,
        ip_hash: ipHash,
        public_token: publicToken,
        pre_score_total: preScoreTotal,
        pre_score_bucket: preScoreBucket,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ 
          error: isDE 
            ? "Das hat grad nicht geklappt. Bitte nochmals versuchen." 
            : "Something went wrong. Please try again.",
          code: "server_error"
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Lead created successfully: ${lead.id} (${body.lead_type})`);

    // Optional: Send confirmation email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey && body.lead_type === "free_audit") {
      try {
        const emailSubject = isDE ? "Wir haben dein Audit erhalten" : "We got your audit";
        const reportUrl = isDE 
          ? `https://itsfeierabend.ch/gratis-audit/report/${publicToken}`
          : `https://itsfeierabend.ch/en/free-audit/report/${publicToken}`;
        const callUrl = isDE ? "https://itsfeierabend.ch/gratis-call" : "https://itsfeierabend.ch/en/free-call";
        const privacyUrl = isDE ? "https://itsfeierabend.ch/datenschutz" : "https://itsfeierabend.ch/en/privacy";
        
        const emailHtml = isDE ? `
          <h2>Danke für deine Audit-Anfrage, ${body.name}!</h2>
          <p>Wir haben deine Anfrage erhalten.</p>
          <p><a href="${reportUrl}">Hier findest du deinen Vorab-Score</a></p>
          <p>Das vollständige Audit mit manueller Prüfung erhältst du innerhalb von 48 Stunden.</p>
          <p>Wenn du willst, kannst du schon jetzt einen <a href="${callUrl}">Gratis Call buchen</a>.</p>
          <br>
          <p>Beste Grüsse,<br>Das itsFeierabend.ch Team</p>
          <hr>
          <p style="font-size: 12px; color: #666;"><a href="${privacyUrl}">Datenschutz</a></p>
        ` : `
          <h2>Thanks for your audit request, ${body.name}!</h2>
          <p>We've received your request.</p>
          <p><a href="${reportUrl}">View your pre-score here</a></p>
          <p>You'll receive the full audit with manual review within 48 hours.</p>
          <p>If you'd like, you can already <a href="${callUrl}">book a free call</a>.</p>
          <br>
          <p>Best regards,<br>The itsFeierabend.ch Team</p>
          <hr>
          <p style="font-size: 12px; color: #666;"><a href="${privacyUrl}">Privacy Policy</a></p>
        `;

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "itsFeierabend.ch <noreply@itsfeierabend.ch>",
            to: [body.email],
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        if (emailResponse.ok) {
          console.log(`Confirmation email sent to ${body.email}`);
        } else {
          console.error("Email send failed:", await emailResponse.text());
        }
      } catch (emailError) {
        console.error("Email error:", emailError);
      }
    } else if (!resendApiKey) {
      console.log("Email disabled - RESEND_API_KEY not set");
    }

    // Clean up old rate limit entries (older than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    await supabase.from("rate_limits").delete().lt("created_at", oneHourAgo);

    // Build response with report URL for audits
    const response: Record<string, any> = { 
      success: true, 
      lead_id: lead.id,
    };

    if (body.lead_type === "free_audit" && publicToken) {
      response.reportUrl = isDE 
        ? `/gratis-audit/report/${publicToken}`
        : `/en/free-audit/report/${publicToken}`;
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Something went wrong. Please try again.",
        code: "server_error"
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
