// deno-lint-ignore-file no-import-prefix
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2/cors'
import { acceptsTransitionalInternalAuth } from '../_shared/public-contracts.ts'

const privateHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json',
  'Cache-Control': 'private, no-store',
  'Pragma': 'no-cache',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: privateHeaders,
    });
  }

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const legacyPublicEnabled =
    Deno.env.get('LEGACY_PUBLIC_SCANNER_ENABLED') === 'true';
  if (
    !serviceKey ||
    !acceptsTransitionalInternalAuth(
      req.headers.get('authorization'),
      req.headers.get('apikey'),
      {
        serviceKey,
        publicKeys: [
          Deno.env.get('SUPABASE_ANON_KEY'),
          Deno.env.get('SUPABASE_PUBLISHABLE_KEY'),
        ],
        legacyPublicEnabled,
      },
    )
  ) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: privateHeaders,
    });
  }

  try {
    const { token } = await req.json();

    if (!token || typeof token !== 'string') {
      return new Response(JSON.stringify({ error: 'token is required' }), {
        status: 400,
        headers: privateHeaders,
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      serviceKey,
    );

    const { data, error } = await supabase
      .from('analysis_reports')
      .select('scan_status, checks_passed, checks_total, overall_score')
      .eq('token', token)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Report not found' }), {
        status: 404,
        headers: privateHeaders,
      });
    }

    // Map internal statuses to frontend-friendly ones
    let frontendStatus = data.scan_status;
    if (data.scan_status === 'evidence_collected') frontendStatus = 'normalizing';
    if (data.scan_status === 'scored') frontendStatus = 'interpreting';

    return new Response(JSON.stringify({
      scan_status: frontendStatus,
      checks_passed: data.checks_passed,
      checks_total: data.checks_total,
      overall_score: data.overall_score,
    }), {
      status: 200,
      headers: privateHeaders,
    });
  } catch (err) {
    console.error('Status error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: privateHeaders,
    });
  }
});
