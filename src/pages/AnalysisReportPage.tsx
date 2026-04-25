import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertTriangle, CheckCircle, Search, Shield, Target, Zap,
  Gauge, AlertOctagon, Loader2, ArrowUpRight, Sparkles,
  ChevronDown, ChevronUp, Download
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────────
interface Signal {
  id: string;
  category: string;
  label: string;
  value: number | boolean | string;
  score: number;
  confidence: string;
  source: string;
  details?: string;
}

interface CategoryScore {
  id: string;
  name: string;
  weight: number;
  score: number;
  signals: Signal[];
  issueCount: number;
  criticalCount: number;
}

interface AIInterpretation {
  headline?: string;
  summary?: string;
  top_3_opportunities?: Array<{
    title: string;
    why: string;
    impact: string;
    effort: string;
    signal_ids?: string[];
  }>;
  strengths?: string[];
  risk_if_ignored?: string;
  recommended_action?: string;
  recommended_action_reason?: string;
}

interface Report {
  id: string;
  token: string;
  site_name: string;
  overall_score: number;
  total_issues: number;
  critical_issues: number;
  warning_issues: number;
  info_issues: number;
  categories: CategoryScore[] | any;
  normalized_signals: Signal[];
  scoring_details: { categories: CategoryScore[]; overall: number } | null;
  ai_interpretation: AIInterpretation | null;
  scan_status: string;
  scan_duration_ms: number | null;
  data_sources_used: string[] | null;
  scan_version: string | null;
  created_at: string;
  checks_passed: number;
  checks_total: number;
}

// ── Helpers ────────────────────────────────────────────────────────
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  visibility: Search,
  trust: Shield,
  conversion: Target,
  technical: Gauge,
  automation: Zap,
};

function getScoreTone(score: number) {
  if (score >= 75) return { text: 'text-aurora', label: 'aurora' };
  if (score >= 50) return { text: 'text-primary', label: 'primary' };
  return { text: 'text-foreground', label: 'foreground' };
}

function getBucketCopy(score: number, isDE: boolean) {
  if (score >= 75) {
    return {
      label: isDE ? 'Starke Basis' : 'Strong foundation',
      description: isDE
        ? 'Solides Fundament — gezielte Hebel bringen schnelle Zuwächse.'
        : 'Solid foundation — targeted levers will unlock fast gains.',
    };
  }
  if (score >= 50) {
    return {
      label: isDE ? 'Klares Wachstumsfeld' : 'Clear growth field',
      description: isDE
        ? 'Gute Ausgangslage mit deutlichem Spielraum nach oben.'
        : 'Good starting point with meaningful upside ahead.',
    };
  }
  return {
    label: isDE ? 'Großes Potenzial' : 'Significant potential',
    description: isDE
      ? 'Viel ungenutztes Potenzial — mit klarem Plan schnell aktivierbar.'
      : 'Plenty of untapped potential — quickly activated with a clear plan.',
  };
}

function getSourceLabel(source: string): string {
  switch (source) {
    case 'pagespeed': return 'PageSpeed';
    case 'observatory': return 'Observatory';
    case 'firecrawl': return 'Firecrawl';
    default: return source;
  }
}

// ── Component ──────────────────────────────────────────────────────
const AnalysisReportPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);

  const isDE = language === 'de';

  const handleDownloadPDF = useCallback(async () => {
    if (!report) return;
    setPdfLoading(true);
    try {
      const [{ pdf }, { default: ReportPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/report/ReportPDF'),
      ]);
      const blob = await pdf(
        <ReportPDF report={report} isDE={isDE} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.site_name}-reifegrad-check.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(isDE ? 'PDF heruntergeladen' : 'PDF downloaded');
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast.error(isDE ? 'PDF konnte nicht erstellt werden' : 'PDF generation failed');
    } finally {
      setPdfLoading(false);
    }
  }, [report, isDE]);

  useEffect(() => {
    const fetchReport = async () => {
      if (!token) { setError('No token'); setLoading(false); return; }
      try {
        const { data, error: fnError } = await supabase.functions.invoke('get-analysis-report', {
          body: { token }
        });
        if (fnError) throw fnError;
        if (data?.error) { setError(data.error); setLoading(false); return; }
        setReport(data.report);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [token]);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Loading
  if (loading) {
    return (
      <Layout>
        <SEOHead title="Loading..." description="Loading analysis report..." noIndex />
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 noise-overlay" aria-hidden />
          <Loader2 className="w-10 h-10 animate-spin text-aurora" />
        </section>
      </Layout>
    );
  }

  // Error
  if (error || !report) {
    return (
      <Layout>
        <SEOHead title={isDE ? 'Report nicht gefunden' : 'Report not found'} description="" noIndex />
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 noise-overlay" aria-hidden />
          <div
            className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-30"
            style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)' }}
            aria-hidden
          />
          <SectionContainer padding="large">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-8" style={{ background: 'var(--gradient-aurora)' }} />
                <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  § Report / 404
                </span>
              </div>
              <h1 className="mt-6 font-editorial font-semibold leading-[0.95] text-5xl sm:text-7xl">
                {isDE ? (<>Report <span className="italic text-aurora">nicht gefunden.</span></>) : (<>Report <span className="italic text-aurora">not found.</span></>)}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                {error || (isDE ? 'Der Link ist abgelaufen oder ungültig.' : 'The link has expired or is invalid.')}
              </p>
              <div className="mt-8">
                <CTAButton href={isDE ? '/scan' : '/en/scan'} size="lg">
                  {isDE ? 'Neue Analyse starten' : 'Start new analysis'}
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </CTAButton>
              </div>
            </div>
          </SectionContainer>
        </section>
      </Layout>
    );
  }

  const ai = report.ai_interpretation;
  const categories: CategoryScore[] = report.scoring_details?.categories || [];
  const signals: Signal[] = report.normalized_signals || [];
  const bucket = getBucketCopy(report.overall_score, isDE);
  const tone = getScoreTone(report.overall_score);

  return (
    <Layout>
      <SEOHead
        title={`${report.site_name} — ${report.overall_score}/100`}
        description={ai?.headline || `Analysis report for ${report.site_name}`}
        canonical={`/analyse/${token}`}
        noIndex
      />

      {/* ===== HERO — Editorial ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />
        <div className="absolute inset-0 noise-overlay" aria-hidden />
        <div
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)' }}
          aria-hidden
        />

        <SectionContainer padding="large">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Score panel */}
            <aside className="lg:col-span-4 order-2 lg:order-1 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8" style={{ background: 'var(--gradient-aurora)' }} />
                <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  {isDE ? '§ Reifegrad-Check' : '§ Maturity Check'}
                </span>
              </div>

              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                    {isDE ? 'Score' : 'Score'}
                  </span>
                  <Sparkles className="w-5 h-5 text-aurora" />
                </div>
                <div className="font-editorial leading-none">
                  <span className={cn('text-7xl italic font-semibold', tone.text)}>{report.overall_score}</span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <p className={cn('font-editorial text-lg leading-snug', tone.text)}>
                  {bucket.label}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {bucket.description}
                </p>

                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{isDE ? 'Top-Potenziale' : 'Top potentials'}</span>
                    <span className="font-editorial text-aurora">{report.critical_issues}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{isDE ? 'Verbesserungen' : 'Improvements'}</span>
                    <span className="font-editorial text-primary">{report.warning_issues}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{isDE ? 'Gut aufgestellt' : 'Well set up'}</span>
                    <span className="font-editorial">{report.info_issues}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  className="w-full gap-2 text-xs mt-2"
                >
                  {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  {isDE ? 'Als PDF herunterladen' : 'Download as PDF'}
                </Button>
              </div>
            </aside>

            {/* Headline */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <h1 className="font-editorial font-semibold leading-[0.9] tracking-tight text-5xl sm:text-7xl md:text-8xl">
                <span className="block text-foreground">{report.site_name}</span>
                <span className="block italic text-aurora">{isDE ? 'Reifegrad.' : 'maturity.'}</span>
              </h1>
              {ai?.headline && (
                <p className="mt-8 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  {ai.headline}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span>{report.checks_passed}/{report.checks_total} {isDE ? 'Bereiche geprüft' : 'areas checked'}</span>
                <span>·</span>
                <span>{report.data_sources_used?.map(getSourceLabel).join(', ')}</span>
                {report.scan_duration_ms && (
                  <>
                    <span>·</span>
                    <span>{(report.scan_duration_ms / 1000).toFixed(1)}s</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ===== AI SUMMARY ===== */}
      {ai?.summary && (
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                {isDE ? '— Lagebild' : '— Snapshot'}
              </span>
              <h2 className="mt-4 font-editorial text-3xl sm:text-4xl font-semibold leading-tight">
                {isDE ? (<>Was die Daten <span className="italic text-aurora">erzählen.</span></>) : (<>What the data <span className="italic text-aurora">tells us.</span></>)}
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="font-editorial text-xl sm:text-2xl leading-relaxed text-foreground/90">
                {ai.summary}
              </p>
            </div>
          </div>
        </SectionContainer>
      )}

      {/* ===== TOP 3 OPPORTUNITIES ===== */}
      {ai?.top_3_opportunities && ai.top_3_opportunities.length > 0 && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 noise-overlay opacity-50" aria-hidden />
          <SectionContainer>
            <div className="max-w-3xl">
              <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                {isDE ? '— Top 3 Chancen' : '— Top 3 opportunities'}
              </span>
              <h2 className="mt-4 font-editorial text-4xl sm:text-5xl md:text-6xl font-semibold leading-[0.95]">
                {isDE ? (<>Größte <span className="italic text-aurora">Hebel.</span></>) : (<>Biggest <span className="italic text-aurora">levers.</span></>)}
              </h2>
            </div>

            <div className="mt-12 space-y-px">
              {ai.top_3_opportunities.map((opp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group grid grid-cols-12 gap-4 sm:gap-8 py-8 border-t border-border/40 last:border-b"
                >
                  <div className="col-span-2 sm:col-span-1">
                    <span className="font-editorial text-aurora text-sm tracking-widest">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="col-span-10 sm:col-span-8">
                    <h3 className="font-editorial text-2xl sm:text-3xl font-semibold leading-tight">
                      {opp.title}
                    </h3>
                    <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                      {opp.why}
                    </p>
                  </div>
                  <div className="col-span-12 sm:col-span-3 flex sm:flex-col sm:items-end gap-2 sm:gap-3 sm:text-right">
                    <div>
                      <span className="block font-editorial text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{isDE ? 'Wirkung' : 'Impact'}</span>
                      <span className={cn(
                        'font-editorial text-lg italic',
                        opp.impact === 'high' ? 'text-aurora' : opp.impact === 'medium' ? 'text-primary' : 'text-muted-foreground'
                      )}>
                        {opp.impact === 'high' ? (isDE ? 'Hoch' : 'High') : opp.impact === 'medium' ? (isDE ? 'Mittel' : 'Medium') : (isDE ? 'Niedrig' : 'Low')}
                      </span>
                    </div>
                    <div>
                      <span className="block font-editorial text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{isDE ? 'Aufwand' : 'Effort'}</span>
                      <span className="font-editorial text-lg italic text-foreground">{opp.effort}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionContainer>
        </section>
      )}

      {/* ===== CATEGORY SCORES ===== */}
      <SectionContainer>
        <div className="max-w-3xl mb-10">
          <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
            {isDE ? '— Bereiche' : '— Areas'}
          </span>
          <h2 className="mt-4 font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
            {isDE ? (<>Reifegrad nach <span className="italic text-aurora">Bereich.</span></>) : (<>Maturity by <span className="italic text-aurora">area.</span></>)}
          </h2>
        </div>

        <div className="space-y-3">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Search;
            const isExpanded = expandedCategories.includes(cat.id);
            const catTone = getScoreTone(cat.score);
            return (
              <div key={cat.id} className="glass-panel rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full p-5 flex items-center gap-4 text-left hover:bg-muted/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-aurora/10 text-aurora">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-editorial text-base sm:text-lg">{cat.name}</span>
                      <span className={cn('font-editorial italic text-2xl', catTone.text)}>{cat.score}</span>
                    </div>
                    <Progress value={cat.score} className="h-1" />
                  </div>
                  <div className="shrink-0 ml-2 text-muted-foreground">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && cat.signals && (
                  <div className="border-t border-border/40 px-5 pb-5">
                    <div className="space-y-1 mt-3">
                      {cat.signals.map((signal) => (
                        <div key={signal.id} className="flex items-center justify-between py-2.5 text-sm border-b border-border/20 last:border-0">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {signal.score >= 70 ? (
                              <CheckCircle className="w-4 h-4 text-aurora shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-primary shrink-0" />
                            )}
                            <span className="truncate">{signal.label}</span>
                            {signal.details && (
                              <span className="text-xs text-muted-foreground hidden md:inline truncate">— {signal.details}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-2">
                            <Badge variant="outline" className="text-[10px] font-editorial tracking-wider">{getSourceLabel(signal.source)}</Badge>
                            <span className={cn('font-editorial italic text-base', getScoreTone(signal.score).text)}>{signal.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SectionContainer>

      {/* ===== STRENGTHS ===== */}
      {ai?.strengths && ai.strengths.length > 0 && (
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                {isDE ? '— Stärken' : '— Strengths'}
              </span>
              <h2 className="mt-4 font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
                {isDE ? (<>Was bereits <span className="italic text-aurora">trägt.</span></>) : (<>What's already <span className="italic text-aurora">working.</span></>)}
              </h2>
            </div>
            <ul className="lg:col-span-8 space-y-px">
              {ai.strengths.map((s, i) => (
                <li key={i} className="grid grid-cols-12 gap-4 py-5 border-t border-border/40 last:border-b">
                  <span className="col-span-2 sm:col-span-1 font-editorial text-aurora text-sm tracking-widest pt-1">
                    0{i + 1}
                  </span>
                  <div className="col-span-10 sm:col-span-11 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-aurora mt-1 flex-shrink-0" />
                    <span className="font-editorial text-lg sm:text-xl leading-snug">{s}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </SectionContainer>
      )}

      {/* ===== WHAT CHANGES IF YOU ACT ===== */}
      {ai?.risk_if_ignored && (
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                {isDE ? '— Wirkung' : '— Outcome'}
              </span>
              <h2 className="mt-4 font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
                {isDE ? (<>Was sich <span className="italic text-aurora">verändert.</span></>) : (<>What <span className="italic text-aurora">shifts.</span></>)}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="font-editorial text-xl sm:text-2xl leading-relaxed text-foreground/90">
                {ai.risk_if_ignored}
              </p>
            </div>
          </div>
        </SectionContainer>
      )}

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay" aria-hidden />
        <div
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)' }}
          aria-hidden
        />
        <SectionContainer padding="large">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                {isDE ? '— Nächster Schritt' : '— Next step'}
              </span>
              <h2 className="mt-4 font-editorial font-semibold leading-[0.95] text-5xl sm:text-6xl md:text-7xl">
                {isDE ? (<>Lass uns das <span className="italic text-aurora">aktivieren.</span></>) : (<>Let's <span className="italic text-aurora">activate this.</span></>)}
              </h2>
              {ai?.recommended_action_reason && (
                <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                  {ai.recommended_action_reason}
                </p>
              )}
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4">
              <CTAButton href={isDE ? '/gratis-call' : '/en/free-call'} size="lg" location="analysis-report-cta">
                {isDE ? 'Kostenloses Gespräch' : 'Free consultation'}
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(isDE ? '/ultimate-package' : '/en/ultimate-package')}
                className="font-editorial"
              >
                {isDE ? 'Ultimate Package entdecken' : 'Discover Ultimate Package'}
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ===== META FOOTER ===== */}
      <SectionContainer padding="small">
        <div className="text-center text-xs text-muted-foreground/60 font-editorial tracking-wider">
          {isDE ? 'Erstellt am' : 'Generated'} {new Date(report.created_at).toLocaleDateString(isDE ? 'de-CH' : 'en-US')}
          {' · '}Version {report.scan_version || 'v1.0'}
          {' · '}{signals.length} Signals
          {' · '}{report.data_sources_used?.length || 0} {isDE ? 'Datenquellen' : 'data sources'}
        </div>
      </SectionContainer>
    </Layout>
  );
};

export default AnalysisReportPage;
