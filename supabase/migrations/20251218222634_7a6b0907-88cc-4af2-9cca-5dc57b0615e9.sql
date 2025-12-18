-- Add policy for rate_limits - only service role can access (edge function)
-- This is a dummy policy that returns false for all authenticated users
-- The edge function uses service role which bypasses RLS
CREATE POLICY "No direct access to rate_limits" 
ON public.rate_limits 
FOR ALL 
TO authenticated
USING (false);