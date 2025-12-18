-- Create the updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Voice Agent tables for Retell AI integration

-- Create calls table for inbound/outbound call records
CREATE TABLE public.calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  retell_call_id text UNIQUE NOT NULL,
  agent_id text,
  direction text CHECK (direction IN ('inbound', 'outbound')),
  from_number text,
  to_number text,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  status text,
  start_timestamp bigint,
  end_timestamp bigint,
  duration_ms bigint,
  disconnection_reason text,
  transfer_destination text,
  consent_recording boolean DEFAULT false,
  consent_transcript boolean DEFAULT false,
  transcript text,
  transcript_object jsonb,
  transcript_with_tool_calls jsonb,
  call_analysis jsonb,
  recording_url text,
  recording_multi_channel_url text,
  public_log_url text,
  data_storage_setting text,
  metadata jsonb
);

-- Enable RLS
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admins can view calls"
ON public.calls FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update calls"
ON public.calls FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete calls"
ON public.calls FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create callback_requests table
CREATE TABLE public.callback_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  report_token text,
  language text NOT NULL CHECK (language IN ('de', 'en')),
  phone text NOT NULL,
  preferred_time text,
  consent_ai_call boolean DEFAULT false,
  consent_recording boolean DEFAULT false,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'calling', 'done', 'failed', 'cancelled')),
  retell_call_id text,
  error text
);

-- Enable RLS
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admins can view callback_requests"
ON public.callback_requests FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update callback_requests"
ON public.callback_requests FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete callback_requests"
ON public.callback_requests FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create do_not_call table
CREATE TABLE public.do_not_call (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  phone text UNIQUE NOT NULL,
  reason text
);

-- Enable RLS
ALTER TABLE public.do_not_call ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admins can view do_not_call"
ON public.do_not_call FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update do_not_call"
ON public.do_not_call FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete do_not_call"
ON public.do_not_call FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger for calls
CREATE TRIGGER update_calls_updated_at
BEFORE UPDATE ON public.calls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for phone lookups
CREATE INDEX idx_calls_from_number ON public.calls(from_number);
CREATE INDEX idx_calls_lead_id ON public.calls(lead_id);
CREATE INDEX idx_callback_requests_status ON public.callback_requests(status);
CREATE INDEX idx_do_not_call_phone ON public.do_not_call(phone);