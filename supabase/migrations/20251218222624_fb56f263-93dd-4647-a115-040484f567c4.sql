-- Create leads table
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  language text NOT NULL CHECK (language IN ('de', 'en')),
  lead_type text NOT NULL CHECK (lead_type IN ('free_audit', 'free_call')),
  industry text NOT NULL,
  service_area text NOT NULL,
  website_url text NULL,
  budget_range text NULL,
  capacity_range text NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NULL,
  message text NULL,
  preferred_times text NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'scored', 'contacted', 'closed')),
  notes_internal text NULL,
  utm_source text NULL,
  utm_medium text NULL,
  utm_campaign text NULL,
  utm_term text NULL,
  utm_content text NULL,
  gclid text NULL,
  referrer text NULL,
  user_agent text NULL,
  ip_hash text NULL
);

-- Create indexes for performance
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX idx_leads_status ON public.leads (status);
CREATE INDEX idx_leads_email ON public.leads (email);

-- Create rate limiting table for spam protection
CREATE TABLE public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_rate_limits_ip_hash ON public.rate_limits (ip_hash);
CREATE INDEX idx_rate_limits_created_at ON public.rate_limits (created_at);

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for leads table (admin only)
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update leads" 
ON public.leads 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leads" 
ON public.leads 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- No public insert policy - inserts go through edge function with service role

-- RLS Policies for user_roles (admin only)
CREATE POLICY "Admins can view roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Rate limits: service role only (no public access)
-- Edge function will use service role key