import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2/cors'

// ── AI Interpretation Layer ────────────────────────────────────────
// Rules from Source of Truth v1.2:
// - AI MAY: translate signals to business language, prioritize top 3 opportunities,
//   sort fixes by impact/effort, recommend DIY/Deep Scan/Done-for-you
// - AI MAY NOT: invent scores, present revenue as fact, cite data not in input,
//   hallucinate competitors/market sizes/tool facts
// - Temperature: 0.3

function buildPrompt(siteName: string, scoring: any, signals: any[], language: string): string {
  const lang = language === 'en' ? 'English' : 'Schweizerdeutsch/DE-CH'

  const signalSummary = signals.map((s: any) =>
    `- ${s.label}: ${s.value} (Score: ${s.score}/100, ${s.confidence}, via ${s.source})${s.details ? ` — ${s.details}` : ''}`
  ).join('\n')

  const categorySummary = scoring.categories.map((c: any) =>
    `- ${c.name}: ${c.score}/100 (${c.issueCount} Issues, ${c.criticalCount} kritisch)`
  ).join('\n')

  return `Du bist ein pragmatischer Digital-Marketing-Berater für Schweizer KMU.
Deine Aufgabe: Interpretiere die folgenden ECHTEN Analyse-Ergebnisse für "${siteName}" und erstelle eine Business-Narrative.

STRIKTE REGELN:
- Verwende NUR die unten aufgeführten Daten. Erfinde KEINE zusätzlichen Metriken.
- Gib KEINE konkreten Umsatzzahlen an — du kennst den Umsatz nicht.
- Sage NICHT "Ihr verliert X CHF pro Monat" — das weisst du nicht.
- Nenne KEINE Konkurrenten, Marktgrössen oder Tool-Fakten.
- Formuliere Chancen und Risiken, KEINE Garantien.
- Sprache: ${lang}

DATEN:

Overall Score: ${scoring.overall}/100

Kategorien:
${categorySummary}

Alle ${signals.length} Signals:
${signalSummary}

Erstelle ein JSON mit diesem EXAKTEN Format:
{
  "headline": "Ein knackiger Satz, der den Zustand zusammenfasst",
  "summary": "2-3 Sätze Business-Kontext: Was bedeutet dieser Score für den Betrieb?",
  "top_3_opportunities": [
    {
      "title": "Kurzer Titel",
      "why": "Warum ist das wichtig (1-2 Sätze, basierend auf den Signals)",
      "impact": "high|medium|low",
      "effort": "S|M|L",
      "signal_ids": ["welche signal IDs belegen das"]
    }
  ],
  "strengths": ["Was läuft gut (basierend auf hohen Scores)"],
  "risk_if_ignored": "Was passiert wenn nichts geändert wird (1-2 Sätze, keine erfundenen Zahlen)",
  "recommended_action": "diy|deep_scan|done_for_you",
  "recommended_action_reason": "Warum diese Empfehlung (1 Satz)"
}

Antworte NUR mit dem JSON.`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()
    if (!token || typeof token !== 'string') {
      return new Response(JSON.stringify({ error: 'token is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Fetch scored report
    const { data: report, error: fetchError } = await supabase
      .from('analysis_reports')
      .select('site_name, normalized_signals, scoring_details, scan_status, language')
      .eq('token', token)
      .single()

    if (fetchError || !report) {
      return new Response(JSON.stringify({ error: 'Report not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (report.scan_status !== 'scored') {
      return new Response(JSON.stringify({ error: `Cannot interpret: status is ${report.scan_status}` }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Update status
    await supabase.from('analysis_reports').update({ scan_status: 'interpreting' }).eq('token', token)

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured')

    const prompt = buildPrompt(
      report.site_name,
      report.scoring_details,
      report.normalized_signals as any[],
      report.language || 'de',
    )

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(30_000),
    })

    if (!aiResponse.ok) {
      const errText = await aiResponse.text()
      console.error(`AI API error: ${aiResponse.status} ${errText}`)
      // Non-fatal: mark as scored (usable without AI)
      await supabase.from('analysis_reports').update({ scan_status: 'complete_no_ai' }).eq('token', token)
      return new Response(JSON.stringify({ error: 'AI interpretation failed', fallback: true }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const aiData = await aiResponse.json()
    const aiContent = aiData.choices?.[0]?.message?.content

    if (!aiContent) {
      await supabase.from('analysis_reports').update({ scan_status: 'complete_no_ai' }).eq('token', token)
      return new Response(JSON.stringify({ error: 'Empty AI response', fallback: true }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Parse AI JSON
    let interpretation: any
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON in AI response')
      interpretation = JSON.parse(jsonMatch[0])
    } catch (parseErr) {
      console.error('AI parse error:', parseErr, 'Content:', aiContent.substring(0, 500))
      await supabase.from('analysis_reports').update({ scan_status: 'complete_no_ai' }).eq('token', token)
      return new Response(JSON.stringify({ error: 'Failed to parse AI response', fallback: true }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Validate: AI must not have invented scores
    if (interpretation.monthly_loss || interpretation.revenue || interpretation.projected_revenue) {
      delete interpretation.monthly_loss
      delete interpretation.revenue
      delete interpretation.projected_revenue
      console.warn('Stripped invented revenue numbers from AI interpretation')
    }

    // Store interpretation
    const { error: updateError } = await supabase
      .from('analysis_reports')
      .update({
        ai_interpretation: interpretation,
        scan_status: 'complete',
      })
      .eq('token', token)

    if (updateError) {
      console.error('Update error:', updateError)
      throw new Error('Failed to store interpretation')
    }

    console.log(`AI interpretation stored for ${token}: ${interpretation.headline?.substring(0, 60)}`)

    return new Response(JSON.stringify({
      success: true,
      headline: interpretation.headline,
      recommended_action: interpretation.recommended_action,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Interpretation error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
