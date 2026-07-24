-- 1) CREATE TABLE
CREATE TABLE public.audit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  website_url text NOT NULL,
  normalized_domain text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  language text NOT NULL DEFAULT 'de',
  consent_processing boolean NOT NULL DEFAULT false,
  consent_marketing boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  score_version text,
  overall_score integer,
  category_scores jsonb,
  signals jsonb,
  top_actions jsonb,
  fetch_meta jsonb,
  error text,
  ip_hash text,
  user_agent text,
  email_sent_at timestamptz,
  completed_at timestamptz,
  report_viewed_at timestamptz,
  cta_clicked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT audit_requests_language_check CHECK (language IN ('de','en')),
  CONSTRAINT audit_requests_status_check CHECK (status IN ('pending','fetching','scoring','ready','failed','partial')),
  CONSTRAINT audit_requests_score_range CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100))
);

CREATE INDEX audit_requests_token_idx ON public.audit_requests(token);
CREATE INDEX audit_requests_email_idx ON public.audit_requests(email);
CREATE INDEX audit_requests_created_at_idx ON public.audit_requests(created_at DESC);

-- 2) GRANT — only service_role; edge functions handle all access via signed tokens
GRANT ALL ON public.audit_requests TO service_role;

-- 3) ENABLE RLS
ALTER TABLE public.audit_requests ENABLE ROW LEVEL SECURITY;

-- 4) POLICIES — deny all direct client access; service_role bypasses RLS
CREATE POLICY "No direct client access to audit_requests"
  ON public.audit_requests
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- Trigger for updated_at
CREATE TRIGGER audit_requests_set_updated_at
  BEFORE UPDATE ON public.audit_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Audit events table for tracking
CREATE TABLE public.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid REFERENCES public.audit_requests(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  metadata jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT audit_events_type_check CHECK (
    event_type IN ('submitted','fetch_started','fetch_complete','scoring_complete','report_ready','report_viewed','cta_clicked','email_sent','failed')
  )
);

CREATE INDEX audit_events_audit_id_idx ON public.audit_events(audit_id);
CREATE INDEX audit_events_type_idx ON public.audit_events(event_type);

GRANT ALL ON public.audit_events TO service_role;

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct client access to audit_events"
  ON public.audit_events
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);