import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2/cors'

// ── Types ──────────────────────────────────────────────────────────
type Confidence = 'observed' | 'inferred' | 'estimated'

interface Signal {
  id: string
  category: string
  label: string
  value: number | boolean | string
  score: number          // 0-100
  confidence: Confidence
  source: string
  details?: string
}

interface CategoryScore {
  id: string
  name: string
  weight: number
  score: number         // 0-100
  signals: Signal[]
  issueCount: number
  criticalCount: number
}

interface ScoringResult {
  categories: CategoryScore[]
  overall: number
  totalIssues: number
  criticalIssues: number
  warningIssues: number
  infoIssues: number
}

// ── Signal Extractors ──────────────────────────────────────────────

function extractPageSpeedSignals(ps: any): Signal[] {
  const signals: Signal[] = []
  if (!ps) return signals

  const mobile = ps.mobile?.lighthouseResult
  const desktop = ps.desktop?.lighthouseResult

  if (mobile?.categories) {
    const cats = mobile.categories
    if (cats.performance?.score != null) {
      const s = Math.round(cats.performance.score * 100)
      signals.push({
        id: 'ps_mobile_performance', category: 'technical', label: 'Mobile Performance Score',
        value: s, score: s, confidence: 'observed', source: 'pagespeed',
        details: s < 50 ? 'Kritisch langsam auf Mobile' : s < 75 ? 'Verbesserungspotenzial' : 'Gut'
      })
    }
    if (cats.seo?.score != null) {
      const s = Math.round(cats.seo.score * 100)
      signals.push({
        id: 'ps_mobile_seo', category: 'visibility', label: 'Mobile SEO Score',
        value: s, score: s, confidence: 'observed', source: 'pagespeed',
        details: s < 80 ? 'SEO-Grundlagen fehlen' : 'SEO-Basics vorhanden'
      })
    }
    if (cats.accessibility?.score != null) {
      const s = Math.round(cats.accessibility.score * 100)
      signals.push({
        id: 'ps_accessibility', category: 'trust', label: 'Accessibility Score',
        value: s, score: s, confidence: 'observed', source: 'pagespeed',
        details: s < 70 ? 'Barrierefreiheit mangelhaft' : 'Akzeptabel'
      })
    }
    if (cats['best-practices']?.score != null) {
      const s = Math.round(cats['best-practices'].score * 100)
      signals.push({
        id: 'ps_best_practices', category: 'technical', label: 'Best Practices Score',
        value: s, score: s, confidence: 'observed', source: 'pagespeed',
      })
    }
  }

  if (desktop?.categories?.performance?.score != null) {
    const s = Math.round(desktop.categories.performance.score * 100)
    signals.push({
      id: 'ps_desktop_performance', category: 'technical', label: 'Desktop Performance Score',
      value: s, score: s, confidence: 'observed', source: 'pagespeed',
    })
  }

  // Extract specific audits from mobile
  const audits = mobile?.audits || {}

  // Speed metrics
  if (audits['first-contentful-paint']?.numericValue != null) {
    const ms = audits['first-contentful-paint'].numericValue
    const score = ms < 1800 ? 100 : ms < 3000 ? 70 : ms < 4500 ? 40 : 15
    signals.push({
      id: 'ps_fcp', category: 'technical', label: 'First Contentful Paint',
      value: `${(ms / 1000).toFixed(1)}s`, score, confidence: 'observed', source: 'pagespeed',
      details: `${(ms / 1000).toFixed(1)}s (Mobile)`
    })
  }

  if (audits['largest-contentful-paint']?.numericValue != null) {
    const ms = audits['largest-contentful-paint'].numericValue
    const score = ms < 2500 ? 100 : ms < 4000 ? 70 : ms < 6000 ? 40 : 15
    signals.push({
      id: 'ps_lcp', category: 'technical', label: 'Largest Contentful Paint',
      value: `${(ms / 1000).toFixed(1)}s`, score, confidence: 'observed', source: 'pagespeed',
    })
  }

  if (audits['cumulative-layout-shift']?.numericValue != null) {
    const cls = audits['cumulative-layout-shift'].numericValue
    const score = cls < 0.1 ? 100 : cls < 0.25 ? 70 : 30
    signals.push({
      id: 'ps_cls', category: 'conversion', label: 'Cumulative Layout Shift',
      value: cls.toFixed(3), score, confidence: 'observed', source: 'pagespeed',
      details: cls > 0.25 ? 'Instabiles Layout — Besucher verlieren Orientierung' : undefined
    })
  }

  // HTTPS
  if (audits['is-on-https']) {
    const isHttps = audits['is-on-https'].score === 1
    signals.push({
      id: 'ps_https', category: 'trust', label: 'HTTPS aktiv',
      value: isHttps, score: isHttps ? 100 : 0, confidence: 'observed', source: 'pagespeed',
      details: isHttps ? undefined : 'Kein HTTPS — Browser zeigt Warnung'
    })
  }

  // Viewport
  if (audits['viewport']) {
    const hasVP = audits['viewport'].score === 1
    signals.push({
      id: 'ps_viewport', category: 'conversion', label: 'Mobile Viewport konfiguriert',
      value: hasVP, score: hasVP ? 100 : 0, confidence: 'observed', source: 'pagespeed',
    })
  }

  // Meta description
  if (audits['meta-description']) {
    const hasMD = audits['meta-description'].score === 1
    signals.push({
      id: 'ps_meta_desc', category: 'visibility', label: 'Meta Description vorhanden',
      value: hasMD, score: hasMD ? 100 : 20, confidence: 'observed', source: 'pagespeed',
      details: hasMD ? undefined : 'Fehlende Meta Description — Google zeigt zufälligen Text'
    })
  }

  // Document title
  if (audits['document-title']) {
    const hasTitle = audits['document-title'].score === 1
    signals.push({
      id: 'ps_title', category: 'visibility', label: 'Seitentitel vorhanden',
      value: hasTitle, score: hasTitle ? 100 : 10, confidence: 'observed', source: 'pagespeed',
    })
  }

  // Robots
  if (audits['robots-txt']) {
    const ok = audits['robots-txt'].score === 1
    signals.push({
      id: 'ps_robots', category: 'visibility', label: 'robots.txt korrekt',
      value: ok, score: ok ? 100 : 30, confidence: 'observed', source: 'pagespeed',
    })
  }

  // Crawlable links
  if (audits['crawlable-anchors']) {
    const ok = audits['crawlable-anchors'].score === 1
    signals.push({
      id: 'ps_crawlable', category: 'visibility', label: 'Links crawlbar',
      value: ok, score: ok ? 100 : 40, confidence: 'observed', source: 'pagespeed',
    })
  }

  return signals
}

function extractObservatorySignals(obs: any): Signal[] {
  const signals: Signal[] = []
  if (!obs?.scan) return signals

  const scan = obs.scan

  if (scan.score != null) {
    // Observatory: 0-100 where 100 is best
    signals.push({
      id: 'obs_score', category: 'trust', label: 'Security Header Score',
      value: scan.score, score: Math.min(100, scan.score), confidence: 'observed', source: 'observatory',
      details: `Grade: ${scan.grade || 'N/A'}`
    })
  }

  // Extract individual test results if available
  if (scan.tests) {
    const tests = scan.tests
    const importantTests: Record<string, { label: string; cat: string }> = {
      'content-security-policy': { label: 'Content Security Policy', cat: 'trust' },
      'strict-transport-security': { label: 'Strict Transport Security (HSTS)', cat: 'trust' },
      'x-content-type-options': { label: 'X-Content-Type-Options', cat: 'technical' },
      'x-frame-options': { label: 'Clickjacking-Schutz', cat: 'trust' },
    }

    for (const [testId, meta] of Object.entries(importantTests)) {
      if (tests[testId]) {
        const passed = tests[testId].pass
        signals.push({
          id: `obs_${testId.replace(/-/g, '_')}`, category: meta.cat, label: meta.label,
          value: passed, score: passed ? 100 : 20, confidence: 'observed', source: 'observatory',
        })
      }
    }
  }

  return signals
}

function extractFirecrawlSignals(fc: any): Signal[] {
  const signals: Signal[] = []
  if (!fc) return signals

  // Site structure from map
  if (fc.map?.links) {
    const pageCount = fc.map.links.length
    signals.push({
      id: 'fc_page_count', category: 'visibility', label: 'Anzahl Seiten',
      value: pageCount,
      score: pageCount < 3 ? 20 : pageCount < 10 ? 50 : pageCount < 30 ? 75 : 90,
      confidence: 'observed', source: 'firecrawl',
      details: `${pageCount} Seiten gefunden`
    })

    // Check for important pages
    const urls = fc.map.links.filter((u: any) => typeof u === 'string').map((u: string) => u.toLowerCase())
    const hasImpressum = urls.some((u: string) => u.includes('impressum') || u.includes('imprint'))
    signals.push({
      id: 'fc_impressum', category: 'trust', label: 'Impressum vorhanden',
      value: hasImpressum, score: hasImpressum ? 100 : 0, confidence: 'observed', source: 'firecrawl',
      details: hasImpressum ? undefined : 'Kein Impressum gefunden — rechtlich problematisch in CH/DE'
    })

    const hasDatenschutz = urls.some((u: string) =>
      u.includes('datenschutz') || u.includes('privacy') || u.includes('dsgvo'))
    signals.push({
      id: 'fc_privacy', category: 'trust', label: 'Datenschutzseite vorhanden',
      value: hasDatenschutz, score: hasDatenschutz ? 100 : 10, confidence: 'observed', source: 'firecrawl',
    })

    const hasKontakt = urls.some((u: string) =>
      u.includes('kontakt') || u.includes('contact'))
    signals.push({
      id: 'fc_contact_page', category: 'conversion', label: 'Kontaktseite vorhanden',
      value: hasKontakt, score: hasKontakt ? 100 : 30, confidence: 'observed', source: 'firecrawl',
    })

    const hasBlog = urls.some((u: string) =>
      u.includes('blog') || u.includes('news') || u.includes('aktuell'))
    signals.push({
      id: 'fc_blog', category: 'visibility', label: 'Blog/News vorhanden',
      value: hasBlog, score: hasBlog ? 80 : 30, confidence: 'observed', source: 'firecrawl',
    })
  }

  // Content analysis from scrape
  const markdown = fc.scrape?.data?.markdown || fc.scrape?.markdown || ''
  if (markdown && typeof markdown === 'string') {
    const contentLen = markdown.length

    signals.push({
      id: 'fc_content_length', category: 'visibility', label: 'Content-Umfang Startseite',
      value: contentLen,
      score: contentLen < 500 ? 20 : contentLen < 2000 ? 50 : contentLen < 5000 ? 80 : 90,
      confidence: 'observed', source: 'firecrawl',
      details: `${Math.round(contentLen / 1000)}k Zeichen auf Startseite`
    })

    // Check for phone number
    const hasPhone = /(\+41|0[1-9]\d)[\s.\-]?\d{2,3}[\s.\-]?\d{2,4}[\s.\-]?\d{2,4}/.test(markdown)
      || /tel:|phone/i.test(markdown)
    signals.push({
      id: 'fc_phone_visible', category: 'conversion', label: 'Telefonnummer sichtbar',
      value: hasPhone, score: hasPhone ? 100 : 20, confidence: 'inferred', source: 'firecrawl',
      details: hasPhone ? undefined : 'Keine Telefonnummer auf Startseite sichtbar'
    })

    // Check for email
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(markdown)
    signals.push({
      id: 'fc_email_visible', category: 'conversion', label: 'E-Mail-Adresse sichtbar',
      value: hasEmail, score: hasEmail ? 80 : 40, confidence: 'inferred', source: 'firecrawl',
    })

    // Check for CTA patterns
    const ctaPatterns = /jetzt|anfragen|kontakt|termin|buchen|offerte|angebot|gratis|kostenlos|free|book|call|get started/i
    const hasCTA = ctaPatterns.test(markdown)
    signals.push({
      id: 'fc_cta_present', category: 'conversion', label: 'Call-to-Action vorhanden',
      value: hasCTA, score: hasCTA ? 90 : 15, confidence: 'inferred', source: 'firecrawl',
      details: hasCTA ? undefined : 'Kein klarer CTA auf Startseite'
    })

    // Check for social proof
    const socialProof = /bewertung|review|referenz|kundenst|testimonial|★|⭐|sterne|google.*bewert/i
    const hasSocialProof = socialProof.test(markdown)
    signals.push({
      id: 'fc_social_proof', category: 'trust', label: 'Social Proof / Bewertungen',
      value: hasSocialProof, score: hasSocialProof ? 85 : 25, confidence: 'inferred', source: 'firecrawl',
    })

    // Check for analytics
    const hasAnalytics = /gtag|google.analytics|ga\(|gtm|tag.manager|_gaq|analytics/i.test(markdown)
      || /facebook.*pixel|fbq|fb.*events/i.test(markdown)
    signals.push({
      id: 'fc_analytics', category: 'automation', label: 'Tracking/Analytics erkannt',
      value: hasAnalytics, score: hasAnalytics ? 90 : 10, confidence: 'inferred', source: 'firecrawl',
      details: hasAnalytics ? undefined : 'Kein Tracking-Code erkannt — Blindflug'
    })

    // Check for form
    const hasForm = /formular|form|submit|absenden|senden|eingabe/i.test(markdown)
      || /<form/i.test(fc.scrape?.data?.html || fc.scrape?.html || '')
    signals.push({
      id: 'fc_form_present', category: 'conversion', label: 'Kontaktformular vorhanden',
      value: hasForm, score: hasForm ? 90 : 20, confidence: 'inferred', source: 'firecrawl',
    })
  }

  return signals
}

// ── Deterministic Scoring Engine ───────────────────────────────────

const CATEGORY_CONFIG = [
  { id: 'visibility', name: 'Sichtbarkeit & Reichweite', weight: 0.25 },
  { id: 'trust', name: 'Vertrauen & Sicherheit', weight: 0.20 },
  { id: 'conversion', name: 'Conversion & Nutzererlebnis', weight: 0.25 },
  { id: 'technical', name: 'Technische Basis', weight: 0.15 },
  { id: 'automation', name: 'Automatisierungsreife', weight: 0.15 },
]

function computeScores(signals: Signal[]): ScoringResult {
  const categories: CategoryScore[] = CATEGORY_CONFIG.map(cfg => {
    const catSignals = signals.filter(s => s.category === cfg.id)
    const avgScore = catSignals.length > 0
      ? Math.round(catSignals.reduce((sum, s) => sum + s.score, 0) / catSignals.length)
      : 50 // neutral if no data

    const issueCount = catSignals.filter(s => s.score < 70).length
    const criticalCount = catSignals.filter(s => s.score < 30).length

    return {
      id: cfg.id,
      name: cfg.name,
      weight: cfg.weight,
      score: avgScore,
      signals: catSignals,
      issueCount,
      criticalCount,
    }
  })

  // Weighted overall score
  let totalWeight = 0
  let weightedSum = 0
  for (const cat of categories) {
    if (cat.signals.length > 0) {
      weightedSum += cat.score * cat.weight
      totalWeight += cat.weight
    }
  }
  const overall = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0

  const totalIssues = categories.reduce((s, c) => s + c.issueCount, 0)
  const criticalIssues = categories.reduce((s, c) => s + c.criticalCount, 0)
  const warningIssues = signals.filter(s => s.score >= 30 && s.score < 70).length
  const infoIssues = signals.filter(s => s.score >= 70 && s.score < 90).length

  return { categories, overall, totalIssues, criticalIssues, warningIssues, infoIssues }
}

// ── Main Handler ───────────────────────────────────────────────────
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

    // Fetch raw evidence
    const { data: report, error: fetchError } = await supabase
      .from('analysis_reports')
      .select('raw_evidence, scan_status, data_sources_used, language')
      .eq('token', token)
      .single()

    if (fetchError || !report) {
      return new Response(JSON.stringify({ error: 'Report not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (report.scan_status !== 'evidence_collected') {
      return new Response(JSON.stringify({ error: `Cannot score: status is ${report.scan_status}` }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const evidence = report.raw_evidence as any

    // Update status
    await supabase.from('analysis_reports').update({ scan_status: 'normalizing' }).eq('token', token)

    // Extract signals from all sources
    const signals: Signal[] = [
      ...extractPageSpeedSignals(evidence?.pagespeed),
      ...extractObservatorySignals(evidence?.observatory),
      ...extractFirecrawlSignals(evidence?.firecrawl),
    ]

    // Compute deterministic scores
    const scoring = computeScores(signals)

    // Build legacy-compatible categories for existing report page
    const legacyCategories = scoring.categories.map(cat => ({
      name: cat.name,
      score: cat.score,
      icon: cat.id === 'visibility' ? 'Search' : cat.id === 'trust' ? 'Shield' : cat.id === 'conversion' ? 'Target' : cat.id === 'technical' ? 'Gauge' : 'Zap',
      issues: cat.signals
        .filter(s => s.score < 70)
        .map(s => ({
          title: s.label,
          description: s.details || `Score: ${s.score}/100`,
          severity: s.score < 30 ? 'critical' : s.score < 70 ? 'warning' : 'info',
          hoursToFix: s.score < 30 ? 4 : 2,
          costIfIgnored: s.score < 30 ? 800 : 300,
        })),
    }))

    // Store results
    const { error: updateError } = await supabase
      .from('analysis_reports')
      .update({
        scan_status: 'scored',
        normalized_signals: signals,
        scoring_details: scoring,
        overall_score: scoring.overall,
        total_issues: scoring.totalIssues,
        critical_issues: scoring.criticalIssues,
        warning_issues: scoring.warningIssues,
        info_issues: scoring.infoIssues,
        categories: legacyCategories,
        checks_passed: signals.filter(s => s.score >= 70).length,
        checks_total: signals.length,
      })
      .eq('token', token)

    if (updateError) {
      console.error('Update error:', updateError)
      throw new Error(`Failed to store scores: ${updateError.message}`)
    }

    console.log(`Scored ${token}: ${scoring.overall}/100, ${signals.length} signals, ${scoring.totalIssues} issues`)

    return new Response(JSON.stringify({
      success: true,
      overall_score: scoring.overall,
      signal_count: signals.length,
      categories: scoring.categories.map(c => ({ id: c.id, name: c.name, score: c.score })),
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Scoring error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
