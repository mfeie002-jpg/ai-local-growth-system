import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate unique token
function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// AI Analysis prompt for comprehensive report
const ANALYSIS_PROMPT = `Du bist ein Website-Analyse-Experte für Schweizer KMU. Analysiere die folgende Website-URL und erstelle einen umfassenden Geschäfts-Report.

Website URL: {URL}

Erstelle eine JSON-Analyse mit folgendem exakten Format. Sei REALISTISCH und KRITISCH:

{
  "site_name": "Domain-Name der Website",
  "overall_score": [Zahl 25-85, meistens 40-60],
  "score_bucket": "red|yellow|green",
  "recommended_route": "launch_sprint|growth|scale",
  
  "top_3_leaks": [
    {
      "id": "lost_calls",
      "title": "Verlorene Anrufe",
      "description": "Warm Leads verlore, bevor es überhaupt e Offerte git.",
      "estimated_loss": 2500
    },
    {
      "id": "tracking_blind",
      "title": "Tracking blind",
      "description": "Du zahlisch für Klicks, aber weisch nöd was konvertiert.",
      "estimated_loss": 1500
    },
    {
      "id": "conversion_friction",
      "title": "LP konvertiert schlecht",
      "description": "Form zu lang, Trust fehlt, mobile Probleme.",
      "estimated_loss": 2000
    }
  ],
  
  "business_inputs": {
    "leads_per_month_now": 50,
    "close_rate_now": 15,
    "avg_order_value": 2500,
    "capacity_jobs_per_month": 25
  },
  
  "scenarios": {
    "conservative": {
      "leads_per_month": 55,
      "close_rate": 18,
      "jobs_per_month": 10,
      "revenue_per_month": 25000
    },
    "realistic": {
      "leads_per_month": 70,
      "close_rate": 22,
      "jobs_per_month": 15,
      "revenue_per_month": 37500
    },
    "ambitious": {
      "leads_per_month": 90,
      "close_rate": 28,
      "jobs_per_month": 25,
      "revenue_per_month": 62500
    }
  },
  
  "current_state": {
    "leads_per_month": 50,
    "close_rate": 15,
    "jobs_per_month": 7,
    "revenue_per_month": 17500
  },
  
  "cost_of_inaction": {
    "leaks": [
      {
        "id": "lost_calls",
        "title": "Verlorene Anrufe",
        "consequence": "Warm Leads verlore, bevor es überhaupt e Offerte git.",
        "monthly_loss": 2500,
        "icon": "PhoneMissed"
      },
      {
        "id": "wasted_ad_spend",
        "title": "Wasted Ad Spend",
        "consequence": "Du zahlisch für Klicks, aber weisch nöd was konvertiert.",
        "monthly_loss": 1500,
        "icon": "TrendingDown"
      },
      {
        "id": "conversion_friction",
        "title": "Conversion Friction",
        "consequence": "Form zu lang / Trust fehlt / mobile Problem → weniger Anfragen.",
        "monthly_loss": 2000,
        "icon": "UserMinus"
      }
    ],
    "total_monthly_loss": 6000
  },
  
  "top_10_fixes": [
    {
      "rank": 1,
      "title": "Tracking-Fundament (GA4 Events + Call Tracking)",
      "impact": "high",
      "effort": "M",
      "days_to_live": "1-2 Tage",
      "why_important": "Ohne Daten optimierst du im Blindflug.",
      "if_not_done": "Du weisst nie, was wirklich funktioniert."
    },
    {
      "rank": 2,
      "title": "Mobile Ladezeit optimieren",
      "impact": "high",
      "effort": "S",
      "days_to_live": "1 Tag",
      "why_important": "70% der Besucher kommen via Mobile.",
      "if_not_done": "Bounce Rate bleibt hoch, Leads gehen verloren."
    },
    {
      "rank": 3,
      "title": "CTA Above-the-Fold",
      "impact": "high",
      "effort": "S",
      "days_to_live": "1 Tag",
      "why_important": "Besucher müssen sofort wissen, was der nächste Schritt ist.",
      "if_not_done": "Verwirrung = Absprung."
    },
    {
      "rank": 4,
      "title": "Trust-Elemente hinzufügen",
      "impact": "high",
      "effort": "S",
      "days_to_live": "1-2 Tage",
      "why_important": "Ohne Trust = kein Vertrauen = keine Anfrage.",
      "if_not_done": "Conversion Rate bleibt tief."
    },
    {
      "rank": 5,
      "title": "Formular vereinfachen",
      "impact": "medium",
      "effort": "S",
      "days_to_live": "1 Tag",
      "why_important": "Jedes Feld weniger = mehr Abschlüsse.",
      "if_not_done": "Besucher brechen ab."
    },
    {
      "rank": 6,
      "title": "Google Business Profil optimieren",
      "impact": "medium",
      "effort": "M",
      "days_to_live": "2-3 Tage",
      "why_important": "Lokale Sichtbarkeit = lokale Kunden.",
      "if_not_done": "Konkurrenz erscheint zuerst."
    },
    {
      "rank": 7,
      "title": "Meta-Descriptions optimieren",
      "impact": "medium",
      "effort": "M",
      "days_to_live": "2-3 Tage",
      "why_important": "Bessere CTR in Google = mehr Traffic.",
      "if_not_done": "Traffic-Potenzial verschenkt."
    },
    {
      "rank": 8,
      "title": "Review-Strategie aufbauen",
      "impact": "medium",
      "effort": "L",
      "days_to_live": "7+ Tage",
      "why_important": "5-Sterne-Reviews = automatischer Trust.",
      "if_not_done": "Konkurrenz mit mehr Reviews gewinnt."
    },
    {
      "rank": 9,
      "title": "Follow-up Automation",
      "impact": "high",
      "effort": "L",
      "days_to_live": "5-7 Tage",
      "why_important": "Viele Leads brauchen 2-3 Touchpoints.",
      "if_not_done": "Du verlierst warme Leads an schnellere Konkurrenz."
    },
    {
      "rank": 10,
      "title": "Landingpage für Hauptangebot",
      "impact": "high",
      "effort": "L",
      "days_to_live": "5-7 Tage",
      "why_important": "Fokussierte LP konvertiert besser als Homepage.",
      "if_not_done": "Du sendest Traffic auf die falsche Seite."
    }
  ],
  
  "backlog_categories": [
    {
      "id": "traffic",
      "name": "Traffic (Ads/Local SEO/Google Business)",
      "total_issues": 12,
      "critical_issues": 3,
      "issues": [
        {
          "title": "Google Business Profil unvollständig",
          "severity": "critical",
          "hours_to_fix": 4,
          "monthly_loss": 800
        },
        {
          "title": "Keine lokalen Keywords",
          "severity": "warning",
          "hours_to_fix": 8,
          "monthly_loss": 400
        }
      ]
    },
    {
      "id": "conversion",
      "name": "Conversion (Landingpage, Form, Trust, Mobile UX)",
      "total_issues": 15,
      "critical_issues": 5,
      "issues": [
        {
          "title": "Kein Trust-Element sichtbar",
          "severity": "critical",
          "hours_to_fix": 2,
          "monthly_loss": 1200
        },
        {
          "title": "Form hat zu viele Felder",
          "severity": "warning",
          "hours_to_fix": 2,
          "monthly_loss": 600
        }
      ]
    },
    {
      "id": "ops",
      "name": "Ops (CRM, Follow-ups, Reviews, Reporting)",
      "total_issues": 8,
      "critical_issues": 2,
      "issues": [
        {
          "title": "Kein strukturiertes Follow-up",
          "severity": "critical",
          "hours_to_fix": 12,
          "monthly_loss": 1500
        },
        {
          "title": "Keine Review-Strategie",
          "severity": "warning",
          "hours_to_fix": 6,
          "monthly_loss": 400
        }
      ]
    }
  ],
  
  "effort_comparison": {
    "diy": {
      "total_hours": 280,
      "complexity": "high",
      "risk": "Tracking falsch → falschi Entscheide",
      "hourly_rate_default": 85
    },
    "done_for_you": {
      "recommended_package": "growth",
      "package_options": [
        {
          "id": "launch_sprint",
          "name": "Launch Sprint",
          "price": 1990,
          "price_type": "einmalig",
          "time_to_live": "48h Onboarding"
        },
        {
          "id": "growth",
          "name": "Growth",
          "price": 3900,
          "price_type": "monatlich",
          "time_to_live": "2 Wochen Setup"
        },
        {
          "id": "scale",
          "name": "Scale",
          "price": 6900,
          "price_type": "monatlich",
          "time_to_live": "2 Wochen Setup"
        }
      ]
    }
  },
  
  "roadmap_14_days": [
    {
      "phase": "Tag 0-2",
      "title": "Foundation",
      "tasks": ["Tracking/Measurement Plan", "Quick Fixes", "Call Routing Setup"]
    },
    {
      "phase": "Tag 3-7",
      "title": "Conversion",
      "tasks": ["Landingpage optimieren", "Offer klar machen", "Form vereinfachen", "Trust-Elemente"]
    },
    {
      "phase": "Tag 8-14",
      "title": "Growth",
      "tasks": ["Ads/Local SEO Setup", "Automationen", "Reporting Dashboard"]
    }
  ],
  
  "consequences_of_inaction": [
    {
      "icon": "TrendingDown",
      "title": "D'Leaks bliibed",
      "description": "D'Opportunity Costs summiered sich monatlich."
    },
    {
      "icon": "Users",
      "title": "Konkurrenz gewinnt",
      "description": "Konkurrenz sammlet Reviews, baut Sichtbarkeit, optimiert Funnels."
    },
    {
      "icon": "DollarSign",
      "title": "Zahlsch für nüt",
      "description": "Du zahlisch für Traffic, aber d'Conversion bleibt d'Limit."
    }
  ],
  
  "outcomes": [
    {
      "icon": "Target",
      "title": "Meh qualifizierte Jobs",
      "description": "Nöd eifach meh Traffic - meh echti Aufträge."
    },
    {
      "icon": "Clock",
      "title": "Weniger Admin",
      "description": "Follow-ups, Routing, Reporting läuft automatisch."
    },
    {
      "icon": "BarChart3",
      "title": "Planbarkeit",
      "description": "Du gsehsch, wo Leads herchömed & was funktioniert."
    }
  ],
  
  "categories": [
    {
      "name": "SEO & Sichtbarkeit",
      "score": 45,
      "icon": "Search",
      "issues": [
        {
          "title": "Fehlende Meta-Descriptions",
          "description": "Detaillierte Beschreibung des Problems",
          "severity": "critical",
          "hoursToFix": 4,
          "costIfIgnored": 500
        }
      ]
    }
  ]
}

WICHTIG:
- Erstelle 10 relevante Top-Fixes für diese spezifische Website
- Generiere 3 Backlog-Kategorien mit je 3-8 Issues
- Berechne realistische Szenarien (konservativ/realistisch/ambitioniert)
- Alle Texte auf Schweizerdeutsch/DE-CH
- Gib realistische Zahlen basierend auf Branche und Website-Typ
- Antworte NUR mit dem JSON, kein anderer Text`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteUrl, leadId } = await req.json();

    if (!websiteUrl) {
      return new Response(
        JSON.stringify({ error: 'Website URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating comprehensive analysis report for:', websiteUrl);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Call Lovable AI to analyze the website
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: ANALYSIS_PROMPT.replace('{URL}', websiteUrl)
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No content received from AI');
    }

    console.log('AI response received, parsing...');

    // Parse the JSON from AI response
    let analysisData;
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      analysisData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('AI content:', aiContent);
      throw new Error('Failed to parse AI analysis');
    }

    // Calculate totals from categories
    let totalIssues = 0;
    let criticalIssues = 0;
    let warningIssues = 0;
    let infoIssues = 0;

    // Count from backlog_categories
    for (const category of analysisData.backlog_categories || []) {
      for (const issue of category.issues || []) {
        totalIssues++;
        if (issue.severity === 'critical') criticalIssues++;
        else if (issue.severity === 'warning') warningIssues++;
        else infoIssues++;
      }
    }

    // Also count from categories (legacy support)
    for (const category of analysisData.categories || []) {
      for (const issue of category.issues || []) {
        totalIssues++;
        if (issue.severity === 'critical') criticalIssues++;
        else if (issue.severity === 'warning') warningIssues++;
        else infoIssues++;
      }
    }

    // Generate unique token
    const token = generateToken();

    // Connect to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate values from analysis
    const totalMonthlyLoss = analysisData.cost_of_inaction?.total_monthly_loss || 6000;
    const diyHours = analysisData.effort_comparison?.diy?.total_hours || 280;
    const currentRevenue = analysisData.current_state?.revenue_per_month || 17500;
    const projectedRevenue = analysisData.scenarios?.realistic?.revenue_per_month || 37500;

    // Prepare comprehensive report data
    const reportData = {
      token,
      lead_id: leadId || null,
      site_name: analysisData.site_name || new URL(websiteUrl).hostname,
      overall_score: analysisData.overall_score || 50,
      total_issues: totalIssues,
      critical_issues: criticalIssues,
      warning_issues: warningIssues,
      info_issues: infoIssues,
      total_hours: diyHours,
      hourly_rate: analysisData.effort_comparison?.diy?.hourly_rate_default || 85,
      monthly_loss: totalMonthlyLoss,
      current_revenue: currentRevenue,
      projected_revenue: projectedRevenue,
      // Store all the new comprehensive data in categories JSON field
      categories: {
        // Legacy format for backward compatibility
        legacy_categories: analysisData.categories || [],
        // New comprehensive data
        score_bucket: analysisData.score_bucket || 'yellow',
        recommended_route: analysisData.recommended_route || 'growth',
        top_3_leaks: analysisData.top_3_leaks || [],
        business_inputs: analysisData.business_inputs || {},
        scenarios: analysisData.scenarios || {},
        current_state: analysisData.current_state || {},
        cost_of_inaction: analysisData.cost_of_inaction || {},
        top_10_fixes: analysisData.top_10_fixes || [],
        backlog_categories: analysisData.backlog_categories || [],
        effort_comparison: analysisData.effort_comparison || {},
        roadmap_14_days: analysisData.roadmap_14_days || [],
        outcomes: analysisData.outcomes || []
      },
      consequences: analysisData.consequences_of_inaction || analysisData.consequences || [],
    };

    const { data: report, error: insertError } = await supabase
      .from('analysis_reports')
      .insert(reportData)
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to save report');
    }

    console.log('Comprehensive report saved with token:', token);

    // Update lead with public_token if provided
    if (leadId) {
      await supabase
        .from('leads')
        .update({ public_token: token })
        .eq('id', leadId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        token,
        reportUrl: `/analyse/${token}`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
