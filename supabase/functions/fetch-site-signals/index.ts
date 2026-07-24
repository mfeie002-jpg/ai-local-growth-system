import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, normalizeDomain, resolvePublicIps } from "../_shared/audit-utils.ts";
import type { SiteContext } from "../_shared/audit-signals.ts";

const FETCH_TIMEOUT_MS = 12000;
const MAX_HTML_BYTES = 1_500_000; // 1.5 MB
const MAX_REDIRECTS = 5;

async function safeFetch(
  targetUrl: string,
  init?: RequestInit,
  timeoutMs = FETCH_TIMEOUT_MS,
): Promise<{ res: Response; finalUrl: string } | { error: string }> {
  const seen = new Set<string>();
  let current = targetUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    // Validate URL + hostname on every hop (SSRF guard)
    const norm = normalizeDomain(current);
    if ("error" in norm) return { error: `bad_url:${norm.error}` };
    const resolved = await resolvePublicIps(new URL(current).hostname);
    if (!resolved.ok) return { error: `blocked:${resolved.reason}` };

    if (seen.has(current)) return { error: "redirect_loop" };
    seen.add(current);

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    let res: Response;
    try {
      res = await fetch(current, { ...init, redirect: "manual", signal: ctrl.signal });
    } catch (e) {
      clearTimeout(timer);
      return { error: `fetch_error:${(e as Error).message}` };
    }
    clearTimeout(timer);

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return { res, finalUrl: current };
      try {
        current = new URL(loc, current).toString();
      } catch {
        return { error: "bad_redirect_target" };
      }
      // Drain the redirect body to free the connection
      try { await res.body?.cancel(); } catch { /* ignore */ }
      continue;
    }
    return { res, finalUrl: current };
  }
  return { error: "too_many_redirects" };
}

async function probe(url: string): Promise<boolean> {
  const r = await safeFetch(url, {
    method: "GET",
    headers: { "User-Agent": "itsFeierabendAuditBot/0.1" },
  }, 5000);
  if ("error" in r) return false;
  try { await r.res.body?.cancel(); } catch { /* ignore */ }
  return r.res.ok;
}

export async function fetchSiteSignals(
  url: string,
): Promise<{ ctx: SiteContext | null; error?: string; partial?: boolean }> {
  const started = Date.now();
  const result = await safeFetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; itsFeierabendAuditBot/0.1; +https://itsfeierabend.ch)",
      "Accept": "text/html,application/xhtml+xml",
      "Accept-Language": "de-CH,de;q=0.9,en;q=0.8",
    },
  });
  if ("error" in result) return { ctx: null, error: result.error, partial: true };

  const { res, finalUrl } = result;
  const responseTimeMs = Date.now() - started;

  const reader = res.body?.getReader();
  let received = 0;
  const chunks: Uint8Array[] = [];
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        received += value.length;
        if (received > MAX_HTML_BYTES) {
          try { await reader.cancel(); } catch { /* ignore */ }
          break;
        }
        chunks.push(value);
      }
    }
  }
  const buf = new Uint8Array(received);
  let offset = 0;
  for (const c of chunks) { buf.set(c, offset); offset += c.length; }
  const html = new TextDecoder("utf-8", { fatal: false }).decode(buf);

  const headers: Record<string, string> = {};
  res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });

  const base = new URL(finalUrl);
  const origin = `${base.protocol}//${base.host}`;
  const [hasSitemap, hasRobots] = await Promise.all([
    probe(`${origin}/sitemap.xml`),
    probe(`${origin}/robots.txt`),
  ]);

  const ctx: SiteContext = {
    url,
    finalUrl,
    status: res.status,
    html,
    headers,
    responseTimeMs,
    sizeBytes: received,
    hasSitemap,
    hasRobots,
  };
  return { ctx };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "url required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const result = await fetchSiteSignals(url);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
