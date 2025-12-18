-- Add dedupe fields to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS is_duplicate boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS duplicate_of uuid REFERENCES public.leads(id) ON DELETE SET NULL;