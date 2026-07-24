
-- Extend audit_events allowed types
ALTER TABLE public.audit_events DROP CONSTRAINT IF EXISTS audit_events_type_check;
ALTER TABLE public.audit_events ADD CONSTRAINT audit_events_type_check
  CHECK (event_type = ANY (ARRAY[
    'submitted','fetch_started','fetch_complete','scoring_complete',
    'report_ready','report_viewed','cta_clicked','email_sent','failed',
    'bot_check_failed','rate_limited','domain_throttled','url_rejected','ssrf_blocked'
  ]));

-- Rate limit scope (per-ip vs global)
ALTER TABLE public.rate_limits ADD COLUMN IF NOT EXISTS scope text NOT NULL DEFAULT 'ip';
CREATE INDEX IF NOT EXISTS idx_rate_limits_scope_created_at
  ON public.rate_limits (scope, created_at DESC);

-- Fast domain-throttle lookups (last 30d, non-failed)
CREATE INDEX IF NOT EXISTS audit_requests_domain_created_idx
  ON public.audit_requests (normalized_domain, created_at DESC);
