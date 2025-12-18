-- Add columns for pre-score and public token
ALTER TABLE leads ADD COLUMN IF NOT EXISTS public_token text UNIQUE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS pre_score_total int;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS pre_score_bucket text CHECK (pre_score_bucket IN ('red', 'yellow', 'green'));

-- Create index for public_token lookups
CREATE INDEX IF NOT EXISTS idx_leads_public_token ON public.leads (public_token);

-- Add RLS policy for public report access (read-only via token)
CREATE POLICY "Public can view leads by token" 
ON public.leads 
FOR SELECT 
TO anon
USING (public_token IS NOT NULL AND public_token = current_setting('request.headers', true)::json->>'x-report-token');