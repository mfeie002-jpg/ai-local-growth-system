import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/audit-utils.ts";
import type { SiteContext } from "../_shared/audit-signals.ts";

const FETCH_TIMEOUT_MS = 12000;
const MAX_HTML_BYTES = 1_500_000; // 1.5 MB cap

async function fetchWithTimeout(url: string, init?: RequestInit, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, redirect: "follow" });
  } finally {
    clearTimeout(timer);
  }
}

async function probe(url: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(url, { method: "GET", headers: { "User-Agent": "itsFeierabendAuditBot/0.1" } }, 5000);
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchSiteSignals(url: string): Promise<{ ctx: SiteContext | null; error?: string; partial?: boolean }> {
  const started = Date.now();
  try {
    const res = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; itsFeierabendAuditBot/0.1; +https://itsfeierabend.ch)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "de-CH,de;q=0.9,en;q=0.8",
      },
    });
    const responseTimeMs = Date.now() - started;

    // Read body but cap
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

    const base = new URL(res.url || url);
    const origin = `${base.protocol}//${base.host}`;
    const [hasSitemap, hasRobots] = await Promise.all([
      probe(`${origin}/sitemap.xml`),
      probe(`${origin}/robots.txt`),
    ]);

    const ctx: SiteContext = {
      url,
      finalUrl: res.url || url,
      status: res.status,
      html,
      headers,
      responseTimeMs,
      sizeBytes: received,
      hasSitemap,
      hasRobots,
    };
    return { ctx };
  } catch (e) {
    const err = (e as Error).message;
    return { ctx: null, error: err, partial: true };
  }
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
