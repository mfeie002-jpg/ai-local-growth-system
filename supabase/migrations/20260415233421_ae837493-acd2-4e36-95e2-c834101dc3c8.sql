-- Add scanner pipeline columns to analysis_reports
ALTER TABLE public.analysis_reports
  ADD COLUMN IF NOT EXISTS raw_evidence jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS normalized_signals jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS scoring_details jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_interpretation jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS scan_duration_ms integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS scan_version text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS data_sources_used text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS scan_status text DEFAULT 'legacy' NOT NULL,
  ADD COLUMN IF NOT EXISTS language text DEFAULT 'de',
  ADD COLUMN IF NOT EXISTS checks_passed integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS checks_total integer DEFAULT 0;

-- Add RLS policy for service role / edge functions to insert/update via scan_status
-- Edge functions use service role key so they bypass RLS, but we need anon to read status by token
CREATE POLICY "Public can read scan status by token"
  ON public.analysis_reports
  FOR SELECT
  TO anon
  USING (token = ((current_setting('request.headers'::text, true))::json ->> 'x-report-token'::text));