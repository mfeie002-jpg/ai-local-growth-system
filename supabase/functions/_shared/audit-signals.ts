// Deterministic signal definitions for the v0.1 audit engine.
// Each signal has a max score contribution; the total is normalized to 100.

export const SCORE_VERSION = "v0.1";

export type SignalCategory =
  | "technical"
  | "content"
  | "trust"
  | "conversion"
  | "automation";

export interface SignalResult {
  id: string;
  category: SignalCategory;
  name: string;
  value: string | number | boolean | null;
  evidence: string;
  score: number;
  max_score: number;
  recommendation: string;
  passed: boolean;
}

export interface SiteContext {
  url: string;
  finalUrl: string;
  status: number;
  html: string;
  headers: Record<string, string>;
  responseTimeMs: number;
  sizeBytes: number;
  hasSitemap: boolean;
  hasRobots: boolean;
}

// Utility: extract text between tags (rough — no JSDOM in edge)
function match(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? (m[1] ?? m[0]) : null;
}
function countMatches(html: string, re: RegExp): number {
  const m = html.match(re);
  return m ? m.length : 0;
}
function has(html: string, re: RegExp): boolean {
  return re.test(html);
}

// ---- TECHNICAL (5 signals) ----
function sigHttps(ctx: SiteContext): SignalResult {
  const isHttps = ctx.finalUrl.startsWith("https://");
  return {
    id: "https",
    category: "technical",
    name: "HTTPS aktiv",
    value: isHttps,
    evidence: `Final URL: ${ctx.finalUrl}`,
    score: isHttps ? 5 : 0,
    max_score: 5,
    recommendation: isHttps ? "OK" : "Aktiviere HTTPS mit einem gültigen SSL-Zertifikat.",
    passed: isHttps,
  };
}
function sigStatus(ctx: SiteContext): SignalResult {
  const ok = ctx.status >= 200 && ctx.status < 300;
  return {
    id: "http_status",
    category: "technical",
    name: "HTTP-Status",
    value: ctx.status,
    evidence: `Statuscode: ${ctx.status}`,
    score: ok ? 5 : 0,
    max_score: 5,
    recommendation: ok ? "OK" : "Beheben: Homepage antwortet nicht mit 2xx.",
    passed: ok,
  };
}
function sigResponseTime(ctx: SiteContext): SignalResult {
  const fast = ctx.responseTimeMs < 2000;
  const medium = ctx.responseTimeMs < 4000;
  const score = fast ? 5 : medium ? 3 : 1;
  return {
    id: "response_time",
    category: "technical",
    name: "Antwortzeit",
    value: ctx.responseTimeMs,
    evidence: `${ctx.responseTimeMs} ms Time-to-First-Byte gemessen.`,
    score,
    max_score: 5,
    recommendation: fast
      ? "OK"
      : "Reduziere TTFB durch Caching, CDN und Server-Optimierung.",
    passed: fast,
  };
}
function sigCompression(ctx: SiteContext): SignalResult {
  const enc = (ctx.headers["content-encoding"] || "").toLowerCase();
  const ok = enc.includes("gzip") || enc.includes("br") || enc.includes("deflate");
  return {
    id: "compression",
    category: "technical",
    name: "Kompression",
    value: enc || "keine",
    evidence: `content-encoding: ${enc || "not set"}`,
    score: ok ? 3 : 0,
    max_score: 3,
    recommendation: ok ? "OK" : "Aktiviere gzip oder brotli am Webserver / CDN.",
    passed: ok,
  };
}
function sigDoctype(ctx: SiteContext): SignalResult {
  const ok = /^\s*<!doctype\s+html>/i.test(ctx.html);
  return {
    id: "doctype",
    category: "technical",
    name: "HTML5-Doctype",
    value: ok,
    evidence: ok ? "<!DOCTYPE html> gefunden" : "kein Doctype gefunden",
    score: ok ? 2 : 0,
    max_score: 2,
    recommendation: ok ? "OK" : "Setze <!DOCTYPE html> an den Anfang des HTML.",
    passed: ok,
  };
}
function sigViewport(ctx: SiteContext): SignalResult {
  const ok = /<meta[^>]+name=["']viewport["'][^>]*>/i.test(ctx.html);
  return {
    id: "mobile_viewport",
    category: "technical",
    name: "Mobile Viewport",
    value: ok,
    evidence: ok ? "viewport meta tag vorhanden" : "kein viewport meta",
    score: ok ? 3 : 0,
    max_score: 3,
    recommendation: ok ? "OK" : "Ergänze <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.",
    passed: ok,
  };
}

// ---- CONTENT & SEARCH INTENT (6 signals) ----
function sigTitle(ctx: SiteContext): SignalResult {
  const raw = match(ctx.html, /<title[^>]*>([\s\S]*?)<\/title>/i)?.trim() || "";
  const len = raw.length;
  const good = len >= 20 && len <= 65;
  const score = raw ? (good ? 5 : 3) : 0;
  return {
    id: "title",
    category: "content",
    name: "Title Tag",
    value: raw.slice(0, 120),
    evidence: `Länge: ${len} Zeichen`,
    score,
    max_score: 5,
    recommendation: !raw
      ? "Füge einen aussagekräftigen <title> hinzu."
      : good
      ? "OK"
      : "Optimiere den Title auf 20–65 Zeichen mit Kernkeyword.",
    passed: good,
  };
}
function sigMetaDescription(ctx: SiteContext): SignalResult {
  const raw = match(ctx.html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || "";
  const len = raw.length;
  const good = len >= 70 && len <= 160;
  const score = raw ? (good ? 4 : 2) : 0;
  return {
    id: "meta_description",
    category: "content",
    name: "Meta Description",
    value: raw.slice(0, 200),
    evidence: `Länge: ${len} Zeichen`,
    score,
    max_score: 4,
    recommendation: !raw
      ? "Ergänze eine Meta Description (70–160 Zeichen)."
      : good
      ? "OK"
      : "Optimiere die Meta Description auf 70–160 Zeichen.",
    passed: good,
  };
}
function sigH1(ctx: SiteContext): SignalResult {
  const count = countMatches(ctx.html, /<h1\b/gi);
  const ok = count === 1;
  return {
    id: "h1",
    category: "content",
    name: "H1-Struktur",
    value: count,
    evidence: `${count} <h1>-Tags gefunden`,
    score: ok ? 4 : count === 0 ? 0 : 2,
    max_score: 4,
    recommendation: ok
      ? "OK"
      : count === 0
      ? "Ergänze genau eine <h1> mit dem Hauptthema der Seite."
      : "Reduziere auf genau eine <h1> pro Seite.",
    passed: ok,
  };
}
function sigCanonical(ctx: SiteContext): SignalResult {
  const ok = has(ctx.html, /<link[^>]+rel=["']canonical["']/i);
  return {
    id: "canonical",
    category: "content",
    name: "Canonical URL",
    value: ok,
    evidence: ok ? "canonical link gefunden" : "kein canonical link",
    score: ok ? 3 : 0,
    max_score: 3,
    recommendation: ok ? "OK" : "Setze einen <link rel=\"canonical\" href=\"...\"> im <head>.",
    passed: ok,
  };
}
function sigLang(ctx: SiteContext): SignalResult {
  const lang = match(ctx.html, /<html[^>]+lang=["']([^"']+)["']/i);
  const ok = !!lang;
  return {
    id: "html_lang",
    category: "content",
    name: "HTML lang Attribut",
    value: lang || "-",
    evidence: ok ? `lang=\"${lang}\"` : "kein lang-Attribut auf <html>",
    score: ok ? 2 : 0,
    max_score: 2,
    recommendation: ok ? "OK" : "Ergänze lang=\"de\" oder passende Sprache am <html>-Tag.",
    passed: ok,
  };
}
function sigContentLength(ctx: SiteContext): SignalResult {
  // strip tags roughly
  const text = ctx.html.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  const good = words >= 300;
  const okish = words >= 150;
  const score = good ? 3 : okish ? 2 : 0;
  return {
    id: "content_length",
    category: "content",
    name: "Textmenge Homepage",
    value: words,
    evidence: `${words} Wörter Fließtext auf der Startseite`,
    score,
    max_score: 3,
    recommendation: good
      ? "OK"
      : "Erweitere den Fließtext auf mindestens 300 Wörter mit Kundennutzen.",
    passed: good,
  };
}

// ---- TRUST (4 signals) ----
function sigImprint(ctx: SiteContext): SignalResult {
  const ok = has(ctx.html, /(impressum|imprint|legal[-_]?notice)/i);
  return {
    id: "imprint",
    category: "trust",
    name: "Impressum / Legal Notice",
    value: ok,
    evidence: ok ? "Link auf Impressum gefunden" : "kein Impressum-Link",
    score: ok ? 4 : 0,
    max_score: 4,
    recommendation: ok ? "OK" : "Verlinke ein rechtskonformes Impressum im Footer.",
    passed: ok,
  };
}
function sigPrivacy(ctx: SiteContext): SignalResult {
  const ok = has(ctx.html, /(datenschutz|privacy|dsg[-_]?vo|gdpr)/i);
  return {
    id: "privacy",
    category: "trust",
    name: "Datenschutz / Privacy",
    value: ok,
    evidence: ok ? "Datenschutz-Link gefunden" : "kein Datenschutz-Link",
    score: ok ? 4 : 0,
    max_score: 4,
    recommendation: ok ? "OK" : "Verlinke eine aktuelle Datenschutzerklärung.",
    passed: ok,
  };
}
function sigContactInfo(ctx: SiteContext): SignalResult {
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(ctx.html);
  const hasPhone = /(tel:|\+\d{1,3}[\s\d\-\(\)]{6,})/i.test(ctx.html);
  const score = (hasEmail ? 2 : 0) + (hasPhone ? 2 : 0);
  const ok = score >= 2;
  return {
    id: "contact_info",
    category: "trust",
    name: "Kontaktinfo sichtbar",
    value: `email:${hasEmail} phone:${hasPhone}`,
    evidence: `E-Mail: ${hasEmail ? "ja" : "nein"} · Telefon: ${hasPhone ? "ja" : "nein"}`,
    score,
    max_score: 4,
    recommendation: ok
      ? (score === 4 ? "OK" : "Ergänze die noch fehlende Kontaktoption (E-Mail oder Telefon).")
      : "Zeige mindestens eine E-Mail-Adresse oder Telefonnummer prominent auf der Startseite.",
    passed: score === 4,
  };
}
function sigSocial(ctx: SiteContext): SignalResult {
  const platforms = ["facebook.com","instagram.com","linkedin.com","tiktok.com","youtube.com","x.com","twitter.com"];
  const found = platforms.filter((p) => ctx.html.toLowerCase().includes(p));
  const ok = found.length >= 1;
  return {
    id: "social_profiles",
    category: "trust",
    name: "Social Profile verlinkt",
    value: found.join(", ") || "-",
    evidence: found.length
      ? `Gefunden: ${found.join(", ")}`
      : "keine Social-Profile verlinkt",
    score: found.length >= 2 ? 3 : found.length === 1 ? 2 : 0,
    max_score: 3,
    recommendation: ok
      ? (found.length >= 2 ? "OK" : "Verlinke mindestens ein zweites Social-Profil.")
      : "Verlinke die relevanten Social-Profile im Footer.",
    passed: found.length >= 2,
  };
}

// ---- CONVERSION (5 signals) ----
function sigCta(ctx: SiteContext): SignalResult {
  const patterns = /(kontakt|contact|termin|book|jetzt|start|anfrage|angebot|offerte|beratung|demo|call|kostenlos|kaufen|buy|get\s+started)/i;
  const buttons = ctx.html.match(/<(a|button)\b[^>]*>[\s\S]{1,120}?<\/(a|button)>/gi) || [];
  const cta = buttons.find((b) => patterns.test(b.replace(/<[^>]+>/g, " ")));
  const ok = !!cta;
  return {
    id: "primary_cta",
    category: "conversion",
    name: "Primärer CTA",
    value: ok,
    evidence: cta ? `CTA-Beispiel: ${cta.replace(/<[^>]+>/g, " ").trim().slice(0, 80)}` : "kein eindeutiger CTA gefunden",
    score: ok ? 5 : 0,
    max_score: 5,
    recommendation: ok ? "OK" : "Ergänze einen klaren primären CTA (z.B. \"Termin buchen\" oder \"Angebot anfragen\").",
    passed: ok,
  };
}
function sigForm(ctx: SiteContext): SignalResult {
  const ok = /<form\b/i.test(ctx.html);
  return {
    id: "contact_form",
    category: "conversion",
    name: "Kontaktformular",
    value: ok,
    evidence: ok ? "<form>-Element gefunden" : "kein Formular auf Startseite",
    score: ok ? 3 : 0,
    max_score: 3,
    recommendation: ok ? "OK" : "Biete ein Kontakt- oder Anfrageformular auf der Startseite.",
    passed: ok,
  };
}
function sigTel(ctx: SiteContext): SignalResult {
  const ok = /href=["']tel:/i.test(ctx.html);
  return {
    id: "tel_link",
    category: "conversion",
    name: "Klickbare Telefonnummer",
    value: ok,
    evidence: ok ? "tel:-Link gefunden" : "kein tel:-Link",
    score: ok ? 2 : 0,
    max_score: 2,
    recommendation: ok ? "OK" : "Verlinke die Telefonnummer als <a href=\"tel:...\"> für Mobile-Klicks.",
    passed: ok,
  };
}
function sigMailto(ctx: SiteContext): SignalResult {
  const ok = /href=["']mailto:/i.test(ctx.html);
  return {
    id: "mailto_link",
    category: "conversion",
    name: "Klickbare E-Mail",
    value: ok,
    evidence: ok ? "mailto:-Link gefunden" : "kein mailto:-Link",
    score: ok ? 2 : 0,
    max_score: 2,
    recommendation: ok ? "OK" : "Verlinke die E-Mail-Adresse als <a href=\"mailto:...\">.",
    passed: ok,
  };
}
function sigTrustBadges(ctx: SiteContext): SignalResult {
  const patterns = /(bewertung|review|testimonial|kunden(?:stimmen|meinung)|proven expert|trustpilot|google\s+reviews?)/i;
  const ok = patterns.test(ctx.html);
  return {
    id: "social_proof",
    category: "conversion",
    name: "Social Proof / Bewertungen",
    value: ok,
    evidence: ok ? "Hinweise auf Kundenbewertungen gefunden" : "keine sichtbaren Bewertungen",
    score: ok ? 3 : 0,
    max_score: 3,
    recommendation: ok ? "OK" : "Zeige echte Kundenstimmen, Bewertungen oder Case-Studies auf der Startseite.",
    passed: ok,
  };
}

// ---- AUTOMATION READINESS (5 signals) ----
function sigJsonLd(ctx: SiteContext): SignalResult {
  const ok = /<script[^>]+type=["']application\/ld\+json["']/i.test(ctx.html);
  return {
    id: "json_ld",
    category: "automation",
    name: "Structured Data (JSON-LD)",
    value: ok,
    evidence: ok ? "JSON-LD Script gefunden" : "keine strukturierten Daten",
    score: ok ? 4 : 0,
    max_score: 4,
    recommendation: ok
      ? "OK"
      : "Ergänze JSON-LD (Organization, LocalBusiness, Service) für bessere KI-Sichtbarkeit.",
    passed: ok,
  };
}
function sigOpenGraph(ctx: SiteContext): SignalResult {
  const count = countMatches(ctx.html, /<meta[^>]+property=["']og:[^"']+["']/gi);
  const ok = count >= 3;
  return {
    id: "open_graph",
    category: "automation",
    name: "Open Graph Tags",
    value: count,
    evidence: `${count} og:*-Tags gefunden`,
    score: ok ? 3 : count > 0 ? 1 : 0,
    max_score: 3,
    recommendation: ok
      ? "OK"
      : "Ergänze mindestens og:title, og:description und og:image für Link-Previews.",
    passed: ok,
  };
}
function sigSitemap(ctx: SiteContext): SignalResult {
  return {
    id: "sitemap",
    category: "automation",
    name: "sitemap.xml",
    value: ctx.hasSitemap,
    evidence: ctx.hasSitemap ? "erreichbar unter /sitemap.xml" : "keine sitemap.xml gefunden",
    score: ctx.hasSitemap ? 3 : 0,
    max_score: 3,
    recommendation: ctx.hasSitemap ? "OK" : "Publiziere eine sitemap.xml unter der Domain-Root.",
    passed: ctx.hasSitemap,
  };
}
function sigRobots(ctx: SiteContext): SignalResult {
  return {
    id: "robots",
    category: "automation",
    name: "robots.txt",
    value: ctx.hasRobots,
    evidence: ctx.hasRobots ? "erreichbar unter /robots.txt" : "keine robots.txt gefunden",
    score: ctx.hasRobots ? 2 : 0,
    max_score: 2,
    recommendation: ctx.hasRobots ? "OK" : "Lege eine robots.txt mit Verweis auf die sitemap.xml an.",
    passed: ctx.hasRobots,
  };
}
function sigFavicon(ctx: SiteContext): SignalResult {
  const ok = /<link[^>]+rel=["'](?:shortcut )?icon["']/i.test(ctx.html);
  return {
    id: "favicon",
    category: "automation",
    name: "Favicon",
    value: ok,
    evidence: ok ? "favicon Link gefunden" : "kein favicon Link",
    score: ok ? 2 : 0,
    max_score: 2,
    recommendation: ok ? "OK" : "Ergänze ein <link rel=\"icon\"> im <head>.",
    passed: ok,
  };
}

const SIGNAL_FNS: Array<(ctx: SiteContext) => SignalResult> = [
  // technical
  sigHttps, sigStatus, sigResponseTime, sigCompression, sigDoctype, sigViewport,
  // content
  sigTitle, sigMetaDescription, sigH1, sigCanonical, sigLang, sigContentLength,
  // trust
  sigImprint, sigPrivacy, sigContactInfo, sigSocial,
  // conversion
  sigCta, sigForm, sigTel, sigMailto, sigTrustBadges,
  // automation
  sigJsonLd, sigOpenGraph, sigSitemap, sigRobots, sigFavicon,
];

export function runSignals(ctx: SiteContext): SignalResult[] {
  return SIGNAL_FNS.map((fn) => {
    try {
      return fn(ctx);
    } catch (e) {
      return {
        id: fn.name,
        category: "technical" as const,
        name: fn.name,
        value: null,
        evidence: `error: ${(e as Error).message}`,
        score: 0,
        max_score: 0,
        recommendation: "Signal konnte nicht ausgewertet werden.",
        passed: false,
      };
    }
  });
}

export function computeScore(signals: SignalResult[]) {
  const categories: SignalCategory[] = ["technical","content","trust","conversion","automation"];
  const category_scores: Record<string, { score: number; max: number; percent: number }> = {};
  let totalScore = 0;
  let totalMax = 0;

  for (const cat of categories) {
    const catSignals = signals.filter((s) => s.category === cat);
    const catScore = catSignals.reduce((a, s) => a + s.score, 0);
    const catMax = catSignals.reduce((a, s) => a + s.max_score, 0);
    category_scores[cat] = {
      score: catScore,
      max: catMax,
      percent: catMax > 0 ? Math.round((catScore / catMax) * 100) : 0,
    };
    totalScore += catScore;
    totalMax += catMax;
  }

  const overall = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  // Top 3 actions: worst-passing signals with highest max_score impact
  const failing = signals
    .filter((s) => !s.passed && s.max_score > 0)
    .sort((a, b) => (b.max_score - b.score) - (a.max_score - a.score))
    .slice(0, 3);

  const top_actions = failing.map((s, i) => ({
    rank: i + 1,
    signal_id: s.id,
    category: s.category,
    title: s.name,
    recommendation: s.recommendation,
    impact: s.max_score - s.score,
  }));

  return {
    score_version: SCORE_VERSION,
    overall_score: overall,
    total_score: totalScore,
    total_max: totalMax,
    category_scores,
    top_actions,
  };
}
