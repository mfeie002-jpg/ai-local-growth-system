// Supabase-backed adapters for Semrush cache + daily usage.
// Uses service-role client; never invoked from clients directly.

import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import type { CacheAdapter, UsageAdapter, EnrichmentData, SemrushStatus, CallRecord } from "./semrush.ts";

export function makeCacheAdapter(supabase: SupabaseClient): CacheAdapter {
  return {
    async get(domain) {
      const { data, error } = await supabase
        .from("semrush_domain_cache")
        .select("data, status, calls, fetched_at")
        .eq("normalized_domain", domain)
        .maybeSingle();
      if (error || !data) return null;
      return {
        data: data.data as EnrichmentData,
        status: data.status as SemrushStatus,
        calls: (data.calls ?? []) as CallRecord[],
        fetched_at: data.fetched_at as string,
      };
    },
    async set(domain, entry) {
      await supabase.from("semrush_domain_cache").upsert({
        normalized_domain: domain,
        data: entry.data,
        status: entry.status,
        calls: entry.calls,
        fetched_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "normalized_domain" });
    },
  };
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export function makeUsageAdapter(supabase: SupabaseClient): UsageAdapter {
  return {
    async incrementFresh() {
      const day = todayUTC();
      const { data: existing } = await supabase
        .from("semrush_daily_usage")
        .select("fresh_domains")
        .eq("day", day)
        .maybeSingle();
      const next = (existing?.fresh_domains ?? 0) + 1;
      await supabase.from("semrush_daily_usage").upsert({
        day, fresh_domains: next, updated_at: new Date().toISOString(),
      }, { onConflict: "day" });
      return next;
    },
    async incrementCachedHit() {
      const day = todayUTC();
      const { data: existing } = await supabase
        .from("semrush_daily_usage")
        .select("cached_hits")
        .eq("day", day)
        .maybeSingle();
      const next = (existing?.cached_hits ?? 0) + 1;
      await supabase.from("semrush_daily_usage").upsert({
        day, cached_hits: next, updated_at: new Date().toISOString(),
      }, { onConflict: "day" });
    },
    async getFreshCount() {
      const day = todayUTC();
      const { data } = await supabase
        .from("semrush_daily_usage")
        .select("fresh_domains")
        .eq("day", day)
        .maybeSingle();
      return data?.fresh_domains ?? 0;
    },
  };
}
