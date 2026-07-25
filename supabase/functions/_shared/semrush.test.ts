// Deno tests for the Semrush enrichment module.
// Runs offline: injects a fake fetch and in-memory cache/usage adapters.
//
// Run: deno test supabase/functions/_shared/semrush.test.ts --allow-env

import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  enrichDomain,
  buildVisibilitySignal,
  DEFAULT_DAILY_FRESH_LIMIT,
  type CacheAdapter,
  type UsageAdapter,
} from "./semrush.ts";

function makeMemoryCache(): CacheAdapter & { store: Map<string, unknown> } {
  const store = new Map<string, unknown>();
  return {
    store,
    async get(domain) {
      // deno-lint-ignore no-explicit-any
      return (store.get(domain) as any) ?? null;
    },
    async set(domain, entry) {
      store.set(domain, { ...entry, fetched_at: new Date().toISOString() });
    },
  };
}

function makeMemoryUsage(initial = 0): UsageAdapter & { fresh: number; cached: number } {
  const state = { fresh: initial, cached: 0 };
  return {
    get fresh() { return state.fresh; },
    get cached() { return state.cached; },
    async incrementFresh() { state.fresh += 1; return state.fresh; },
    async incrementCachedHit() { state.cached += 1; },
    async getFreshCount() { return state.fresh; },
  };
}

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

// Semrush-shape helpers
function rows(cols: string[], rows: (string | number | null)[][]) {
  return { data: { columnNames: cols, rows }, status: 200 };
}

function makeSuccessFetch(): { fetch: typeof fetch; called: string[] } {
  const called: string[] = [];
  const fn: typeof fetch = async (input) => {
    const url = typeof input === "string" ? input : (input as URL).toString();
    called.push(url);
    if (url.includes("/domains/domain_ranks")) {
      return jsonRes(rows(["Dn","Rank","Or","Ot","BackLinks","Domains"], [["example.com", 48, 1200, 4500, 320, 55]]));
    }
    if (url.includes("/domains/domain_organic")) {
      return jsonRes(rows(["Ph","Po","Nq","Cp","Kd","Tr"], [
        ["ai marketing", 3, 4400, 5.2, 61, 12.3],
        ["ki agentur", 5, 1900, 6.1, 55, 6.7],
      ]));
    }
    if (url.includes("/domains/domain_domains")) {
      return jsonRes(rows(["Dn","Cr","Np","Or","Ot"], [
        ["rival-a.com", 220, 12, 900, 3300],
        ["rival-b.com", 180, 9, 800, 2600],
      ]));
    }
    if (url.includes("/backlinks/backlinks_overview")) {
      return jsonRes(rows(["total","domains_num","follows_num","nofollows_num"], [[3400, 210, 2800, 600]]));
    }
    if (url.includes("/keywords/phrase_these")) {
      return jsonRes(rows(["Ph","Nq","Cp","Kd"], [
        ["ai marketing", 4400, 5.2, 61],
        ["ki agentur", 1900, 6.1, 55],
      ]));
    }
    return jsonRes({ error: "unknown" }, 404);
  };
  return { fetch: fn, called };
}

Deno.test("successful enrichment records all 5 call types and caches result", async () => {
  const cache = makeMemoryCache();
  const usage = makeMemoryUsage();
  const { fetch: fakeFetch, called } = makeSuccessFetch();

  const result = await enrichDomain("example.com", {
    cache, usage,
    fetchImpl: fakeFetch,
    lovableApiKey: "lk", semrushApiKey: "sk",
    recommendedKeywords: ["ai marketing", "ki agentur"],
  });

  assertEquals(result.status, "ok");
  assertEquals(result.calls.length, 5);
  assert(result.calls.every((c) => c.ok));
  const types = result.calls.map((c) => c.type).sort();
  assertEquals(types, ["backlinks_overview","domain_overview","keyword_metrics","top_competitors","top_keywords"]);
  assertEquals(result.data?.overview?.organic_traffic, 4500);
  assertEquals(result.data?.top_keywords.length, 2);
  assertEquals(result.data?.top_competitors.length, 2);
  assertEquals(usage.fresh, 1);
  assertEquals(cache.store.size, 1);
  assert(called.length === 5, `expected 5 gateway calls, got ${called.length}`);
});

Deno.test("second call for same domain reuses cache and does not increment fresh counter", async () => {
  const cache = makeMemoryCache();
  const usage = makeMemoryUsage();
  const { fetch: fakeFetch } = makeSuccessFetch();
  const opts = {
    cache, usage,
    fetchImpl: fakeFetch,
    lovableApiKey: "lk", semrushApiKey: "sk",
    recommendedKeywords: ["ai marketing"],
  };
  await enrichDomain("example.com", opts);
  const second = await enrichDomain("example.com", opts);
  assertEquals(second.status, "cached");
  assertEquals(usage.fresh, 1);
  assertEquals(usage.cached, 1);
  assert(second.calls.every((c) => c.cached === true));
});

Deno.test("partial: some calls fail but at least one succeeds", async () => {
  const cache = makeMemoryCache();
  const usage = makeMemoryUsage();
  let n = 0;
  const fakeFetch: typeof fetch = async (input) => {
    n++;
    const url = typeof input === "string" ? input : (input as URL).toString();
    if (url.includes("/domains/domain_ranks")) {
      return jsonRes(rows(["Dn","Rank","Or","Ot","BackLinks","Domains"], [["ex.com", 20, 100, 400, 20, 5]]));
    }
    // fail everything else with a provider 500
    return jsonRes({ error: "boom" }, 500);
  };
  const result = await enrichDomain("ex.com", {
    cache, usage, fetchImpl: fakeFetch,
    lovableApiKey: "lk", semrushApiKey: "sk",
    recommendedKeywords: ["x"],
  });
  assertEquals(result.status, "partial");
  assertEquals(result.data?.parts.domain_overview, "ok");
  assertEquals(result.data?.parts.top_keywords, "unavailable");
  assert(n >= 5);
});

Deno.test("timeout on every call surfaces status=timeout, no cache write", async () => {
  const cache = makeMemoryCache();
  const usage = makeMemoryUsage();
  const fakeFetch: typeof fetch = (_input, init) => {
    return new Promise((_res, rej) => {
      const signal = (init as RequestInit | undefined)?.signal;
      signal?.addEventListener("abort", () => {
        const err = new Error("aborted");
        err.name = "AbortError";
        rej(err);
      });
    });
  };
  const result = await enrichDomain("slow.com", {
    cache, usage, fetchImpl: fakeFetch,
    lovableApiKey: "lk", semrushApiKey: "sk",
    timeoutMs: 25,
    recommendedKeywords: ["x"],
  });
  assertEquals(result.status, "timeout");
  assertEquals(result.data, null);
  assertEquals(cache.store.size, 0);
  assert(result.calls.every((c) => !c.ok));
  // Every failing call reason is opaque — no provider payload leaks.
  for (const c of result.calls) {
    assert(c.reason === "timeout" || c.reason === "quota_exceeded");
  }
});

Deno.test("quota exceeded on first call short-circuits remaining calls", async () => {
  const cache = makeMemoryCache();
  const usage = makeMemoryUsage();
  let live = 0;
  const fakeFetch: typeof fetch = async (input) => {
    live++;
    const url = typeof input === "string" ? input : (input as URL).toString();
    if (url.includes("/domains/domain_ranks")) {
      return jsonRes({ error: "ERROR 134 :: TOTAL LIMIT EXCEEDED", status: 403 }, 403);
    }
    return jsonRes(rows(["x"], [[1]]));
  };
  const result = await enrichDomain("quota.com", {
    cache, usage, fetchImpl: fakeFetch,
    lovableApiKey: "lk", semrushApiKey: "sk",
    recommendedKeywords: ["x"],
  });
  assertEquals(result.status, "quota_exceeded");
  assertEquals(live, 1, "no further gateway calls after quota trip");
  assertEquals(cache.store.size, 0);
  for (const c of result.calls) {
    if (!c.ok) assertEquals(c.reason, "quota_exceeded");
  }
});

Deno.test("skipped when daily fresh-domain limit reached", async () => {
  const cache = makeMemoryCache();
  const usage = makeMemoryUsage(DEFAULT_DAILY_FRESH_LIMIT);
  let called = 0;
  const fakeFetch: typeof fetch = async () => { called++; return jsonRes({}); };
  const result = await enrichDomain("new.com", {
    cache, usage, fetchImpl: fakeFetch,
    lovableApiKey: "lk", semrushApiKey: "sk",
    recommendedKeywords: [],
  });
  assertEquals(result.status, "skipped_daily_limit");
  assertEquals(called, 0);
  assertEquals(cache.store.size, 0);
});

Deno.test("skipped cleanly when credentials missing (no leakage)", async () => {
  const cache = makeMemoryCache();
  const usage = makeMemoryUsage();
  const result = await enrichDomain("nocred.com", {
    cache, usage,
    fetchImpl: (async () => new Response("", { status: 500 })) as typeof fetch,
    lovableApiKey: undefined, semrushApiKey: undefined,
    recommendedKeywords: [],
  });
  assertEquals(result.status, "skipped_disabled");
  assertEquals(result.reason, "disabled");
});

Deno.test("visibility signal is marked unavailable when enrichment failed", () => {
  const sig = buildVisibilitySignal(null);
  assertEquals(sig.unavailable, true);
  assertEquals(sig.max_score, 0);
  assertEquals(sig.score, 0);
});

Deno.test("visibility signal reports traffic when overview succeeded", () => {
  const sig = buildVisibilitySignal({
    status: "ok",
    fetched_at: new Date().toISOString(),
    calls: [],
    data: {
      domain: "example.com", database: "us",
      overview: { authority_score: 40, organic_traffic: 2000, organic_keywords: 500, backlinks: 100, referring_domains: 30 },
      top_keywords: [], top_competitors: [], backlinks: null, recommended_keyword_metrics: [],
      parts: { domain_overview: "ok", top_keywords: "ok", top_competitors: "ok", backlinks_overview: "ok", keyword_metrics: "ok" },
    },
  });
  assertEquals(sig.unavailable, false);
  assertEquals(sig.value, 2000);
  assertEquals(sig.passed, true);
  assertEquals(sig.state, "estimated");
  assertEquals(sig.confidence, "medium");
});
