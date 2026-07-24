
-- Semrush enrichment support for audits
ALTER TABLE public.audit_requests
  ADD COLUMN IF NOT EXISTS semrush_data JSONB,
  ADD COLUMN IF NOT EXISTS semrush_fetched_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS semrush_status TEXT,
  ADD COLUMN IF NOT EXISTS semrush_calls JSONB;

CREATE TABLE IF NOT EXISTS public.semrush_domain_cache (
  normalized_domain TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  status TEXT NOT NULL,
  calls JSONB NOT NULL DEFAULT '[]'::jsonb,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.semrush_domain_cache TO service_role;
GRANT ALL ON public.semrush_domain_cache TO service_role;
ALTER TABLE public.semrush_domain_cache ENABLE ROW LEVEL SECURITY;
-- No policies: only service role (edge functions) can read/write.

CREATE TABLE IF NOT EXISTS public.semrush_daily_usage (
  day DATE PRIMARY KEY,
  fresh_domains INTEGER NOT NULL DEFAULT 0,
  cached_hits INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.semrush_daily_usage TO service_role;
ALTER TABLE public.semrush_daily_usage ENABLE ROW LEVEL SECURITY;
-- No policies: only service role.

CREATE INDEX IF NOT EXISTS semrush_domain_cache_fetched_at_idx
  ON public.semrush_domain_cache (fetched_at);
