// Server-side Semrush enrichment for audits.
// - Runs strictly server-side (edge function context).
// - Never exposes credentials or raw provider errors: callers receive a
//   sanitized `{ status, data, calls }` shape and a short opaque reason.
// - Caches per normalized domain for CACHE_TTL_MS (default 30 days).
// - Enforces a configurable daily fresh-domain limit.
// - Per-call timeout + quota-error handling; if the whole enrichment
//   fails, the caller can still complete the audit with deterministic
//   signals only.

export const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const DEFAULT_TIMEOUT_MS = 8_000;
export const DEFAULT_DAILY_FRESH_LIMIT = 50;

const GATEWAY = "https://connector-gateway.lovable.dev/semrush";

export type SemrushCallType =
  | "domain_overview"
  | "top_keywords"
  | "top_competitors"
  | "backlinks_overview"
  | "keyword_metrics";

export type SemrushStatus =
  | "ok"
  | "partial"
  | "cached"
  | "skipped_disabled"
  | "skipped_daily_limit"
  | "quota_exceeded"
  | "timeout"
  | "unavailable";

export interface CallRecord {
  type: SemrushCallType;
  ok: boolean;
  ms: number;
  cached?: boolean;
  reason?: string; // opaque, no provider payload
}

export interface DomainOverview {
  authority_score: number | null;
  organic_traffic: number | null;
  organic_keywords: number | null;
  backlinks: number | null;
  referring_domains: number | null;
}

export interface KeywordRow {
  keyword: string;
  position: number | null;
  volume: number | null;
  cpc: number | null;
  difficulty: number | null;
}

export interface CompetitorRow {
  domain: string;
  common_keywords: number | null;
}

export interface BacklinksOverview {
  total_backlinks: number | null;
  referring_domains: number | null;
  follow_ratio: number | null;
}

export interface EnrichmentData {
  domain: string;
  database: string;
  overview: DomainOverview | null;
  top_keywords: KeywordRow[];
  top_competitors: CompetitorRow[];
  backlinks: BacklinksOverview | null;
  recommended_keyword_metrics: KeywordRow[];
  // Which parts failed vs succeeded (opaque reasons only).
  parts: Record<SemrushCallType, "ok" | "unavailable">;
}

export interface EnrichmentResult {
  status: SemrushStatus;
  data: EnrichmentData | null;
  calls: CallRecord[];
  fetched_at: string;
  reason?: string;
}

export interface CacheAdapter {
  get(domain: string): Promise<{ data: EnrichmentData; status: SemrushStatus; calls: CallRecord[]; fetched_at: string } | null>;
  set(domain: string, entry: { data: EnrichmentData; status: SemrushStatus; calls: CallRecord[] }): Promise<void>;
}

export interface UsageAdapter {
  /** Increments today's fresh-domain counter and returns the new count. */
  incrementFresh(): Promise<number>;
  /** Increments today's cache-hit counter. */
  incrementCachedHit(): Promise<void>;
  /** Returns today's fresh-domain count without modifying it. */
  getFreshCount(): Promise<number>;
}

export interface EnrichOptions {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  dailyFreshLimit?: number;
  database?: string;
  // Recommendation keywords are derived from the audit; capped to 5.
  recommendedKeywords?: string[];
  cache: CacheAdapter;
  usage: UsageAdapter;
  lovableApiKey: string | undefined;
  semrushApiKey: string | undefined;
}

// Sanitize any provider error surface into an opaque short reason.
function toOpaqueReason(status: number | undefined, bodyText: string | undefined): string {
  if (bodyText && /TOTAL LIMIT EXCEEDED/i.test(bodyText)) return "quota_exceeded";
  if (status === 401 || status === 403) return "auth_error";
  if (status === 429) return "rate_limited";
  if (status && status >= 500) return "provider_error";
  if (status && status >= 400) return "bad_request";
  return "unavailable";
}

interface GatewayCallOk<T> { ok: true; value: T; ms: number; }
interface GatewayCallErr { ok: false; reason: string; ms: number; quota?: boolean; }
type GatewayCall<T> = GatewayCallOk<T> | GatewayCallErr;

async function gatewayGet<T>(
  path: string,
  params: Record<string, string>,
  opts: { fetchImpl: typeof fetch; timeoutMs: number; lovableApiKey: string; semrushApiKey: string; parse: (json: unknown) => T },
): Promise<GatewayCall<T>> {
  const url = new URL(`${GATEWAY}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs);
  const started = Date.now();
  try {
    const resp = await opts.fetchImpl(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${opts.lovableApiKey}`,
        "X-Connection-Api-Key": opts.semrushApiKey,
        Accept: "application/json",
      },
      signal: controller.signal,
    });
    const ms = Date.now() - started;
    const text = await resp.text().catch(() => "");
    if (!resp.ok) {
      const reason = toOpaqueReason(resp.status, text);
      // Log server-side only, never returned to callers/UI.
      console.warn(`[semrush] ${path} failed status=${resp.status} reason=${reason}`);
      return { ok: false, reason, ms, quota: reason === "quota_exceeded" };
    }
    let json: unknown = null;
    try { json = text ? JSON.parse(text) : null; } catch { /* ignore */ }
    if (json && typeof json === "object" && "error" in (json as Record<string, unknown>)) {
      const errStr = String((json as Record<string, unknown>).error ?? "");
      const quota = /TOTAL LIMIT EXCEEDED/i.test(errStr);
      console.warn(`[semrush] ${path} payload error quota=${quota}`);
      return { ok: false, reason: quota ? "quota_exceeded" : "unavailable", ms, quota };
    }
    try {
      const value = opts.parse(json);
      return { ok: true, value, ms };
    } catch (e) {
      console.warn(`[semrush] ${path} parse failed: ${(e as Error).message}`);
      return { ok: false, reason: "parse_error", ms };
    }
  } catch (e) {
    const ms = Date.now() - started;
    const aborted = (e as Error).name === "AbortError";
    console.warn(`[semrush] ${path} ${aborted ? "timeout" : "network_error"}`);
    return { ok: false, reason: aborted ? "timeout" : "network_error", ms };
  } finally {
    clearTimeout(timer);
  }
}

// ---------- Semrush response parsers ----------
// Semrush shape: { data: { columnNames: string[], rows: any[][] }, status: number }
function rowsFromResponse(json: unknown): { cols: string[]; rows: (string | number | null)[][] } {
  if (!json || typeof json !== "object") throw new Error("empty");
  const data = (json as Record<string, unknown>).data as Record<string, unknown> | undefined;
  const cols = (data?.columnNames as string[] | undefined) ?? [];
  const rows = (data?.rows as (string | number | null)[][] | undefined) ?? [];
  return { cols, rows };
}
function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function str(v: unknown): string { return v === null || v === undefined ? "" : String(v); }

function parseDomainOverview(json: unknown): DomainOverview {
  const { cols, rows } = rowsFromResponse(json);
  const row = rows[0] ?? [];
  const col = (name: string): unknown => {
    const i = cols.indexOf(name);
    return i >= 0 ? row[i] : null;
  };
  return {
    authority_score: num(col("Rank") ?? col("AS")),
    organic_traffic: num(col("Ot")),
    organic_keywords: num(col("Or")),
    backlinks: num(col("BackLinks")),
    referring_domains: num(col("Domains")),
  };
}
function parseTopKeywords(json: unknown, limit = 10): KeywordRow[] {
  const { cols, rows } = rowsFromResponse(json);
  const idx = (n: string) => cols.indexOf(n);
  return rows.slice(0, limit).map((r) => ({
    keyword: str(r[idx("Ph")]),
    position: num(r[idx("Po")]),
    volume: num(r[idx("Nq")]),
    cpc: num(r[idx("Cp")]),
    difficulty: num(r[idx("Kd")]),
  }));
}
function parseCompetitors(json: unknown, limit = 3): CompetitorRow[] {
  const { cols, rows } = rowsFromResponse(json);
  const dn = cols.indexOf("Dn");
  const cr = cols.indexOf("Cr");
  return rows.slice(0, limit).map((r) => ({
    domain: str(r[dn]),
    common_keywords: num(r[cr]),
  }));
}
function parseBacklinksOverview(json: unknown): BacklinksOverview {
  const { cols, rows } = rowsFromResponse(json);
  const row = rows[0] ?? [];
  const col = (name: string): unknown => {
    const i = cols.indexOf(name);
    return i >= 0 ? row[i] : null;
  };
  const total = num(col("total")) ?? num(col("backlinks_num"));
  const refDomains = num(col("domains_num")) ?? num(col("referring_domains"));
  const follows = num(col("follows_num"));
  const noFollows = num(col("nofollows_num"));
  let followRatio: number | null = null;
  if (follows !== null && noFollows !== null && follows + noFollows > 0) {
    followRatio = follows / (follows + noFollows);
  }
  return { total_backlinks: total, referring_domains: refDomains, follow_ratio: followRatio };
}
function parseKeywordMetrics(json: unknown): KeywordRow[] {
  const { cols, rows } = rowsFromResponse(json);
  const idx = (n: string) => cols.indexOf(n);
  return rows.map((r) => ({
    keyword: str(r[idx("Ph")]),
    position: null,
    volume: num(r[idx("Nq")]),
    cpc: num(r[idx("Cp")]),
    difficulty: num(r[idx("Kd")]),
  }));
}

// ---------- Enrichment orchestrator ----------
export async function enrichDomain(domain: string, opts: EnrichOptions): Promise<EnrichmentResult> {
  const now = new Date();
  const fetchedAt = now.toISOString();
  const fetchImpl = opts.fetchImpl ?? fetch;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const dailyLimit = opts.dailyFreshLimit ?? DEFAULT_DAILY_FRESH_LIMIT;
  const database = opts.database ?? "us";

  // 1) Cache hit → reuse
  const cached = await opts.cache.get(domain);
  if (cached) {
    const age = Date.now() - new Date(cached.fetched_at).getTime();
    if (age < CACHE_TTL_MS) {
      await opts.usage.incrementCachedHit();
      return {
        status: "cached",
        data: cached.data,
        calls: cached.calls.map((c) => ({ ...c, cached: true })),
        fetched_at: cached.fetched_at,
      };
    }
  }

  // 2) Missing creds → skip cleanly (never expose why).
  if (!opts.lovableApiKey || !opts.semrushApiKey) {
    return { status: "skipped_disabled", data: null, calls: [], fetched_at: fetchedAt, reason: "disabled" };
  }

  // 3) Fresh-domain daily limit
  const current = await opts.usage.getFreshCount();
  if (current >= dailyLimit) {
    return { status: "skipped_daily_limit", data: null, calls: [], fetched_at: fetchedAt, reason: "daily_limit" };
  }
  const _newCount = await opts.usage.incrementFresh();

  const calls: CallRecord[] = [];
  const parts: Record<SemrushCallType, "ok" | "unavailable"> = {
    domain_overview: "unavailable",
    top_keywords: "unavailable",
    top_competitors: "unavailable",
    backlinks_overview: "unavailable",
    keyword_metrics: "unavailable",
  };

  const commonGw = {
    fetchImpl,
    timeoutMs,
    lovableApiKey: opts.lovableApiKey,
    semrushApiKey: opts.semrushApiKey,
  };

  let quotaTripped = false;
  let timedOut = false;

  // Call 1: domain overview
  const ov = await gatewayGet("/domains/domain_ranks", {
    domain,
    database,
    export_columns: "Dn,Rank,Or,Ot,Oc,Ad,BackLinks,Domains",
  }, { ...commonGw, parse: parseDomainOverview });
  calls.push({ type: "domain_overview", ok: ov.ok, ms: ov.ms, reason: ov.ok ? undefined : ov.reason });
  if (!ov.ok && ov.quota) quotaTripped = true;
  if (!ov.ok && ov.reason === "timeout") timedOut = true;

  // Call 2: top organic keywords (limit 10)
  const kw = quotaTripped
    ? { ok: false, reason: "quota_exceeded", ms: 0 } as GatewayCallErr
    : await gatewayGet("/domains/domain_organic", {
      domain,
      database,
      display_limit: "10",
      export_columns: "Ph,Po,Nq,Cp,Kd,Tr",
    }, { ...commonGw, parse: (j) => parseTopKeywords(j, 10) });
  calls.push({ type: "top_keywords", ok: kw.ok, ms: kw.ms, reason: kw.ok ? undefined : kw.reason });
  if (!kw.ok && (kw as GatewayCallErr).quota) quotaTripped = true;
  if (!kw.ok && kw.reason === "timeout") timedOut = true;

  // Call 3: top competitors (limit 3)
  const co = quotaTripped
    ? { ok: false, reason: "quota_exceeded", ms: 0 } as GatewayCallErr
    : await gatewayGet("/domains/domain_domains", {
      domain,
      database,
      display_limit: "3",
      export_columns: "Dn,Cr,Np,Or,Ot",
    }, { ...commonGw, parse: (j) => parseCompetitors(j, 3) });
  calls.push({ type: "top_competitors", ok: co.ok, ms: co.ms, reason: co.ok ? undefined : co.reason });
  if (!co.ok && (co as GatewayCallErr).quota) quotaTripped = true;
  if (!co.ok && co.reason === "timeout") timedOut = true;

  // Call 4: backlinks overview
  const bl = quotaTripped
    ? { ok: false, reason: "quota_exceeded", ms: 0 } as GatewayCallErr
    : await gatewayGet("/backlinks/backlinks_overview", {
      target: domain,
      target_type: "root_domain",
    }, { ...commonGw, parse: parseBacklinksOverview });
  calls.push({ type: "backlinks_overview", ok: bl.ok, ms: bl.ms, reason: bl.ok ? undefined : bl.reason });
  if (!bl.ok && (bl as GatewayCallErr).quota) quotaTripped = true;
  if (!bl.ok && bl.reason === "timeout") timedOut = true;

  // Call 5: keyword metrics for up to 5 recommended keywords
  const recommended = (opts.recommendedKeywords ?? []).slice(0, 5).filter(Boolean);
  let km: GatewayCall<KeywordRow[]>;
  if (quotaTripped) {
    km = { ok: false, reason: "quota_exceeded", ms: 0, quota: true };
  } else if (recommended.length === 0) {
    km = { ok: false, reason: "no_keywords", ms: 0 };
  } else {
    km = await gatewayGet("/keywords/phrase_these", {
      phrase: recommended.join(";"),
      database,
      export_columns: "Ph,Nq,Cp,Kd,Co",
    }, { ...commonGw, parse: parseKeywordMetrics });
    if (!km.ok && (km as GatewayCallErr).quota) quotaTripped = true;
    if (!km.ok && km.reason === "timeout") timedOut = true;
  }
  calls.push({
    type: "keyword_metrics",
    ok: km.ok,
    ms: km.ms,
    reason: km.ok ? undefined : (km as GatewayCallErr).reason,
  });

  if (ov.ok) parts.domain_overview = "ok";
  if (kw.ok) parts.top_keywords = "ok";
  if (co.ok) parts.top_competitors = "ok";
  if (bl.ok) parts.backlinks_overview = "ok";
  if (km.ok) parts.keyword_metrics = "ok";

  const anyOk = Object.values(parts).some((v) => v === "ok");
  const allOk = Object.values(parts).every((v) => v === "ok");

  const data: EnrichmentData = {
    domain,
    database,
    overview: ov.ok ? ov.value : null,
    top_keywords: kw.ok ? kw.value : [],
    top_competitors: co.ok ? co.value : [],
    backlinks: bl.ok ? bl.value : null,
    recommended_keyword_metrics: km.ok ? km.value : [],
    parts,
  };

  let status: SemrushStatus;
  if (!anyOk) {
    if (quotaTripped) status = "quota_exceeded";
    else if (timedOut) status = "timeout";
    else status = "unavailable";
  } else if (allOk) {
    status = "ok";
  } else {
    status = "partial";
  }

  const result: EnrichmentResult = { status, data: anyOk ? data : null, calls, fetched_at: fetchedAt };
  if (anyOk) {
    try { await opts.cache.set(domain, { data, status, calls }); } catch (e) {
      console.warn("[semrush] cache set failed:", (e as Error).message);
    }
  }
  return result;
}

// ---------- Additional derived signal ----------
export interface VisibilitySignal {
  id: "search_visibility";
  category: "content";
  name: string;
  value: string | number | null;
  evidence: string;
  score: 0;
  max_score: 0;
  recommendation: string;
  passed: boolean;
  unavailable: boolean;
}

/**
 * Produces a non-scoring visibility signal that reflects Semrush data.
 * When unavailable, the signal is marked `unavailable: true` and does
 * not contribute zero to the deterministic score.
 */
export function buildVisibilitySignal(enrichment: EnrichmentResult | null): VisibilitySignal {
  if (!enrichment || !enrichment.data || enrichment.data.parts.domain_overview !== "ok") {
    return {
      id: "search_visibility",
      category: "content",
      name: "Sichtbarkeit in Google (Semrush)",
      value: null,
      evidence: "Sichtbarkeitsdaten aktuell nicht verfügbar.",
      score: 0,
      max_score: 0,
      recommendation: "Sichtbarkeitsdaten werden ergänzt, sobald verfügbar.",
      passed: false,
      unavailable: true,
    };
  }
  const ov = enrichment.data.overview!;
  const traffic = ov.organic_traffic;
  const kws = ov.organic_keywords;
  return {
    id: "search_visibility",
    category: "content",
    name: "Sichtbarkeit in Google (Semrush)",
    value: traffic ?? kws ?? null,
    evidence: `Ø ${traffic ?? "?"} organische Besuche/Monat auf ${kws ?? "?"} rankenden Keywords`,
    score: 0,
    max_score: 0,
    recommendation: (traffic ?? 0) > 100
      ? "Solide Basis — mehr Themen mit klarer Suchintention veröffentlichen."
      : "Ranking-Sichtbarkeit ausbauen: Themen-Cluster und Meta-Optimierung.",
    passed: (traffic ?? 0) > 100,
    unavailable: false,
  };
}
