import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { websiteUrl, leadId, language } = await req.json();

    // Validate input
    if (!websiteUrl || typeof websiteUrl !== 'string') {
      return new Response(JSON.stringify({ error: 'websiteUrl is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Extract site name from URL
    let siteName: string;
    try {
      siteName = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`).hostname;
    } catch {
      siteName = websiteUrl;
    }

    // Generate token
    const token = crypto.randomUUID();

    // Create report row with queued status
    const { error: insertError } = await supabase
      .from('analysis_reports')
      .insert({
        token,
        site_name: siteName,
        lead_id: leadId || null,
        scan_status: 'queued',
        language: language || 'de',
        checks_passed: 0,
        checks_total: 0,
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to create scan job' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Scanner error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
