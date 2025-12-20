-- Create table for detailed analysis reports
CREATE TABLE public.analysis_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  site_name TEXT NOT NULL,
  overall_score INTEGER NOT NULL DEFAULT 0,
  total_issues INTEGER NOT NULL DEFAULT 0,
  critical_issues INTEGER NOT NULL DEFAULT 0,
  warning_issues INTEGER NOT NULL DEFAULT 0,
  info_issues INTEGER NOT NULL DEFAULT 0,
  total_hours INTEGER NOT NULL DEFAULT 0,
  hourly_rate INTEGER NOT NULL DEFAULT 150,
  monthly_loss INTEGER NOT NULL DEFAULT 0,
  current_revenue INTEGER NOT NULL DEFAULT 0,
  projected_revenue INTEGER NOT NULL DEFAULT 0,
  categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  consequences JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  viewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;

-- Public can view reports by token
CREATE POLICY "Public can view reports by token"
ON public.analysis_reports
FOR SELECT
USING (token = current_setting('request.headers', true)::json->>'x-report-token');

-- Admins can manage all reports
CREATE POLICY "Admins can view all reports"
ON public.analysis_reports
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert reports"
ON public.analysis_reports
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports"
ON public.analysis_reports
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reports"
ON public.analysis_reports
FOR DELETE
USING (has_role(auth.uid(), 'admin'));