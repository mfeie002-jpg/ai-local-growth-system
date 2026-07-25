BEGIN;

-- Create the canonical lead, audit request, first audit event and rate-limit
-- hits in one transaction. The advisory transaction lock makes the daily
-- counters deterministic under concurrent submissions. Only the service role
-- used by the validated Edge Function may execute this function.
CREATE OR REPLACE FUNCTION public.create_audit_with_lead(
  p_website_url text,
  p_normalized_domain text,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_language text,
  p_company_name text,
  p_industry text,
  p_region text,
  p_primary_goal text,
  p_primary_lead_source text,
  p_challenges text[],
  p_systems text,
  p_audit_type text,
  p_landing_page text,
  p_referrer text,
  p_utm_source text,
  p_utm_medium text,
  p_utm_campaign text,
  p_utm_term text,
  p_utm_content text,
  p_gclid text,
  p_consent_marketing boolean,
  p_consent_at timestamptz,
  p_consent_version text,
  p_ip_hash text,
  p_user_agent text,
  p_per_ip_limit integer,
  p_global_limit integer
)
RETURNS TABLE (
  audit_id uuid,
  audit_token uuid,
  lead_id uuid,
  lead_reused boolean,
  limit_reason text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lead_id uuid;
  v_audit_id uuid;
  v_audit_token uuid;
  v_lead_reused boolean := false;
  v_global_count integer;
  v_ip_count integer;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended('itsfeierabend:audit-create', 0));

  SELECT count(*)::integer
    INTO v_global_count
    FROM public.rate_limits
   WHERE scope = 'global'
     AND created_at >= now() - interval '24 hours';

  IF v_global_count >= greatest(coalesce(p_global_limit, 1), 1) THEN
    RETURN QUERY
      SELECT NULL::uuid, NULL::uuid, NULL::uuid, false, 'global_daily_exceeded'::text;
    RETURN;
  END IF;

  IF p_ip_hash IS NOT NULL THEN
    SELECT count(*)::integer
      INTO v_ip_count
      FROM public.rate_limits
     WHERE scope = 'ip'
       AND ip_hash = p_ip_hash
       AND created_at >= now() - interval '24 hours';

    IF v_ip_count >= greatest(coalesce(p_per_ip_limit, 1), 1) THEN
      RETURN QUERY
        SELECT NULL::uuid, NULL::uuid, NULL::uuid, false, 'per_ip_daily_exceeded'::text;
      RETURN;
    END IF;
  END IF;

  SELECT leads.id
    INTO v_lead_id
    FROM public.leads
   WHERE leads.email = p_email
     AND leads.lead_type = 'free_audit'
     AND leads.website_url = p_website_url
     AND leads.created_at >= now() - interval '30 days'
   ORDER BY leads.created_at DESC
   LIMIT 1;

  v_lead_reused := v_lead_id IS NOT NULL;

  IF v_lead_id IS NULL THEN
    INSERT INTO public.leads (
      language,
      lead_type,
      industry,
      service_area,
      website_url,
      name,
      email,
      status,
      company_name,
      region,
      primary_goal,
      primary_lead_source,
      challenges,
      systems,
      landing_page,
      audit_type,
      keyword,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      gclid,
      referrer,
      user_agent,
      ip_hash,
      consent_processing,
      consent_marketing,
      consent_at,
      consent_version,
      is_duplicate
    )
    VALUES (
      p_language,
      'free_audit',
      p_industry,
      p_audit_type,
      p_website_url,
      p_first_name || ' ' || p_last_name,
      p_email,
      'new',
      p_company_name,
      p_region,
      p_primary_goal,
      p_primary_lead_source,
      coalesce(p_challenges, '{}'::text[]),
      p_systems,
      p_landing_page,
      p_audit_type,
      p_utm_term,
      p_utm_source,
      p_utm_medium,
      p_utm_campaign,
      p_utm_term,
      p_utm_content,
      p_gclid,
      p_referrer,
      p_user_agent,
      p_ip_hash,
      true,
      p_consent_marketing,
      p_consent_at,
      p_consent_version,
      false
    )
    RETURNING id INTO v_lead_id;
  END IF;

  INSERT INTO public.audit_requests (
    lead_id,
    website_url,
    normalized_domain,
    first_name,
    last_name,
    email,
    language,
    company_name,
    industry,
    region,
    primary_goal,
    primary_lead_source,
    challenges,
    systems,
    audit_type,
    landing_page,
    referrer,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    gclid,
    consent_processing,
    consent_marketing,
    consent_at,
    consent_version,
    status,
    ip_hash,
    user_agent
  )
  VALUES (
    v_lead_id,
    p_website_url,
    p_normalized_domain,
    p_first_name,
    p_last_name,
    p_email,
    p_language,
    p_company_name,
    p_industry,
    p_region,
    p_primary_goal,
    p_primary_lead_source,
    coalesce(p_challenges, '{}'::text[]),
    p_systems,
    p_audit_type,
    p_landing_page,
    p_referrer,
    p_utm_source,
    p_utm_medium,
    p_utm_campaign,
    p_utm_term,
    p_utm_content,
    p_gclid,
    true,
    p_consent_marketing,
    p_consent_at,
    p_consent_version,
    'pending',
    p_ip_hash,
    p_user_agent
  )
  RETURNING id, token INTO v_audit_id, v_audit_token;

  INSERT INTO public.rate_limits (ip_hash, scope)
  VALUES (coalesce(p_ip_hash, 'anonymous'), 'global');

  IF p_ip_hash IS NOT NULL THEN
    INSERT INTO public.rate_limits (ip_hash, scope)
    VALUES (p_ip_hash, 'ip');
  END IF;

  INSERT INTO public.audit_events (
    audit_id,
    event_type,
    metadata,
    ip_hash,
    user_agent
  )
  VALUES (
    v_audit_id,
    'submitted',
    jsonb_build_object(
      'language', p_language,
      'audit_type', p_audit_type,
      'domain', p_normalized_domain,
      'lead_reused', v_lead_reused
    ),
    p_ip_hash,
    p_user_agent
  );

  RETURN QUERY
    SELECT v_audit_id, v_audit_token, v_lead_id, v_lead_reused, NULL::text;
END;
$$;

REVOKE ALL ON FUNCTION public.create_audit_with_lead(
  text, text, text, text, text, text, text, text, text, text, text,
  text[], text, text, text, text, text, text, text, text, text, text,
  boolean, timestamptz, text, text, text, integer, integer
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_audit_with_lead(
  text, text, text, text, text, text, text, text, text, text, text,
  text[], text, text, text, text, text, text, text, text, text, text,
  boolean, timestamptz, text, text, text, integer, integer
) TO service_role;

COMMIT;
