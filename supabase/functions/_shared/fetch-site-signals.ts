import { normalizeDomain, resolvePublicIps } from "./audit-utils.ts";
import type { SiteContext } from "./audit-signals.ts";

const FETCH_TIMEOUT_MS = 12_000;
const MAX_HTML_BYTES = 1_500_000;
const MAX_REDIRECTS = 5;

async function safeFetch(
  targetUrl: string,
  init?: RequestInit,
  timeoutMs = FETCH_TIMEOUT_MS,
): Promise<{ res: Response; finalUrl: string } | { error: string }> {
  const seen = new Set<string>();
  let current = targetUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const normalized = normalizeDomain(current);
    if ("error" in normalized) return { error: `bad_url:${normalized.error}` };
    const resolved = await resolvePublicIps(new URL(current).hostname);
    if (!resolved.ok) return { error: `blocked:${resolved.reason}` };

    if (seen.has(current)) return { error: "redirect_loop" };
    seen.add(current);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response: Response;
    try {
      response = await fetch(current, {
        ...init,
        redirect: "manual",
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timer);
      return { error: `fetch_error:${(error as Error).message}` };
    }
    clearTimeout(timer);

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return { res: response, finalUrl: current };
      try {
        current = new URL(location, current).toString();
      } catch {
        return { error: "bad_redirect_target" };
      }
      try {
        await response.body?.cancel();
      } catch {
        // Connection cleanup is best effort.
      }
      continue;
    }
    return { res: response, finalUrl: current };
  }
  return { error: "too_many_redirects" };
}

async function probe(url: string): Promise<boolean | null> {
  const result = await safeFetch(
    url,
    {
      method: "GET",
      headers: { "User-Agent": "itsFeierabendAuditBot/0.1" },
    },
    5_000,
  );
  if ("error" in result) return null;
  try {
    await result.res.body?.cancel();
  } catch {
    // Connection cleanup is best effort.
  }
  if (result.res.ok) return true;
  if (result.res.status === 404 || result.res.status === 410) return false;
  return null;
}

export async function fetchSiteSignals(
  url: string,
): Promise<{ ctx: SiteContext | null; error?: string; partial?: boolean }> {
  const started = Date.now();
  const result = await safeFetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; itsFeierabendAuditBot/0.1; +https://itsfeierabend.ch)",
      "Accept": "text/html,application/xhtml+xml",
      "Accept-Language": "de-CH,de;q=0.9,en;q=0.8",
    },
  });
  if ("error" in result) {
    return { ctx: null, error: result.error, partial: true };
  }

  const { res, finalUrl } = result;
  const responseTimeMs = Date.now() - started;
  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  if (
    [401, 403, 429].includes(res.status) ||
    (contentType &&
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml"))
  ) {
    try {
      await res.body?.cancel();
    } catch {
      // Connection cleanup is best effort.
    }
    return {
      ctx: null,
      error:
        `public_html_unavailable:${res.status}:${contentType || "unknown_content_type"}`,
      partial: true,
    };
  }

  const reader = res.body?.getReader();
  let received = 0;
  let truncated = false;
  const chunks: Uint8Array[] = [];
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      const remaining = MAX_HTML_BYTES - received;
      if (value.length > remaining) {
        if (remaining > 0) chunks.push(value.subarray(0, remaining));
        received += Math.max(remaining, 0);
        truncated = true;
        try {
          await reader.cancel();
        } catch {
          // Connection cleanup is best effort.
        }
        break;
      }
      chunks.push(value);
      received += value.length;
    }
  }

  const buffer = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  const html = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  if (html.trim().length < 80) {
    return {
      ctx: null,
      error: `public_html_unavailable:${res.status}:empty_or_too_short`,
      partial: true,
    };
  }

  const headers: Record<string, string> = {};
  res.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  const base = new URL(finalUrl);
  const origin = `${base.protocol}//${base.host}`;
  const [hasSitemap, hasRobots] = await Promise.all([
    probe(`${origin}/sitemap.xml`),
    probe(`${origin}/robots.txt`),
  ]);

  return {
    ctx: {
      url,
      finalUrl,
      status: res.status,
      html,
      headers,
      responseTimeMs,
      sizeBytes: received,
      hasSitemap,
      hasRobots,
    },
    partial: truncated || res.status < 200 || res.status >= 300,
    error: truncated ? "html_truncated_at_1500000_bytes" : undefined,
  };
}
