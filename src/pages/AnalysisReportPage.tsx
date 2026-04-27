import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { CTAButton } from '@/components/CTAButton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  CheckCircle, Search, Shield, Target, Zap,
  Gauge, Loader2, ArrowUpRight,
  ChevronDown, ChevronUp, Download, Circle,
  type LucideIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { SectionMarker, ScoreCard, AIAnnotation, ReportSkeleton } from '@/components/neural';

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
const categoryIcons: Record<string, LucideIcon> = {
  visibility: Search,
  trust: Shield,
  conversion: Target,
  technical: Gauge,
  automation: Zap,
};

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

const TOTAL_SECTIONS = 6;

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

  // Loading — skeleton mirrors final hero so no CLS when data lands
  if (loading) {
    return (
      <Layout>
        <SEOHead title="Loading..." description="Loading analysis report..." noIndex />
        <ReportSkeleton marker={isDE ? 'Reifegrad-Check' : 'Maturity Check'} />
      </Layout>
    );
  }

  // Error
  if (error || !report) {
    return (
      <Layout>
        <SEOHead title={isDE ? 'Report nicht gefunden' : 'Report not found'} description="" noIndex />
        <section className="pt-28 md:pt-36 lg:pt-44 pb-24 md:pb-32">
          <div className="container-section">
            <div className="max-w-2xl">
              <SectionMarker index={0} total={6} label="Report / 404" />
              <h1 className="text-balance">
                {isDE ? 'Report ' : 'Report '}
                <span className="font-editorial italic">{isDE ? 'nicht gefunden.' : 'not found.'}</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg md:text-xl text-foreground/75 leading-[1.55]">
                {error || (isDE ? 'Der Link ist abgelaufen oder ungültig.' : 'The link has expired or is invalid.')}
              </p>
              <div className="mt-12">
                <CTAButton href={isDE ? '/scan' : '/en/scan'} size="lg">
                  {isDE ? 'Neue Analyse starten' : 'Start new analysis'}
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </CTAButton>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const ai = report.ai_interpretation;
  const categories: CategoryScore[] = report.scoring_details?.categories || [];
  const signals: Signal[] = report.normalized_signals || [];
  const bucket = getBucketCopy(report.overall_score, isDE);

  return (
    <Layout>
      <SEOHead
        title={`${report.site_name} — ${report.overall_score}/100`}
        description={ai?.headline || `Analysis report for ${report.site_name}`}
        canonical={`/analyse/${token}`}
        noIndex
      />

      {/* ===== 01 · HERO ===== */}
      <section data-neural-zone className="pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <div className="col-span-12 lg:col-span-8">
              <SectionMarker index={1} total={TOTAL_SECTIONS} label={isDE ? 'Reifegrad-Check' : 'Maturity Check'} />
              <h1 className="text-balance">
                <span className="block">{report.site_name}</span>
                <span className="block font-editorial italic text-foreground/85">
                  {isDE ? 'Reifegrad.' : 'maturity.'}
                </span>
              </h1>
              {/* Reserve space so the AI headline doesn't shift the layout
                  when it streams in (or stays empty in fallback). */}
              <div
                className="mt-8 max-w-2xl"
                style={{ minHeight: '64px' }}
              >
                {ai?.headline && (
                  <p className="text-lg md:text-xl text-foreground/75 leading-[1.55]">
                    {ai.headline}
                  </p>
                )}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span>{report.checks_passed}/{report.checks_total} {isDE ? 'Bereiche' : 'areas'}</span>
                {report.data_sources_used && report.data_sources_used.length > 0 && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{report.data_sources_used.map(getSourceLabel).join(' · ')}</span>
                  </>
                )}
                {report.scan_duration_ms && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{(report.scan_duration_ms / 1000).toFixed(1)}s</span>
                  </>
                )}
              </div>
            </div>

            <aside className="col-span-12 lg:col-span-4 lg:col-start-9 flex flex-col gap-6">
              <div className="hidden lg:block rule-hairline w-12" />
              <div className="card-paper p-8 flex flex-col items-center">
                <ScoreCard score={report.overall_score} label={isDE ? 'Reifegrad' : 'Maturity'} size={200} />
                <p className="mt-6 text-center text-base text-foreground text-balance">{bucket.label}</p>
                <p className="mt-3 text-center text-sm text-muted-foreground leading-relaxed text-balance">
                  {bucket.description}
                </p>
                <div className="mt-6 w-full pt-6 border-t border-border/80 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-editorial italic text-2xl text-foreground">{report.critical_issues}</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                      {isDE ? 'Top' : 'Top'}
                    </div>
                  </div>
                  <div>
                    <div className="font-editorial italic text-2xl text-foreground">{report.warning_issues}</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                      {isDE ? 'Hebel' : 'Levers'}
                    </div>
                  </div>
                  <div>
                    <div className="font-editorial italic text-2xl text-foreground">{report.info_issues}</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                      {isDE ? 'Solide' : 'Solid'}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  className="w-full gap-2 text-xs mt-6"
                >
                  {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  {isDE ? 'Als PDF herunterladen' : 'Download as PDF'}
                </Button>
              </div>
              <AIAnnotation>
                {isDE
                  ? `gemini-2.5-flash · ${signals.length} Signale ausgewertet · ${report.scan_version || 'v1.0'}`
                  : `gemini-2.5-flash · ${signals.length} signals interpreted · ${report.scan_version || 'v1.0'}`}
              </AIAnnotation>
            </aside>
          </div>
        </div>
      </section>

      {/* ===== 02 · AI Summary ===== */}
      {ai?.summary && (
        <section className="py-20 md:py-28 border-t border-border/80">
          <div className="container-section">
            <div className="grid grid-cols-12 gap-x-6 gap-y-10">
              <div className="col-span-12 lg:col-span-4">
                <SectionMarker index={2} total={TOTAL_SECTIONS} label={isDE ? 'Lagebild' : 'Snapshot'} />
                <h2 className="text-balance">
                  {isDE ? 'Was die Daten ' : 'What the data '}
                  <span className="font-editorial italic">{isDE ? 'erzählen.' : 'tells us.'}</span>
                </h2>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <p className="font-editorial italic text-2xl md:text-3xl leading-[1.35] text-foreground/90 text-balance">
                  {ai.summary}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== 03 · Top 3 opportunities ===== */}
      {ai?.top_3_opportunities && ai.top_3_opportunities.length > 0 && (
        <section className="py-20 md:py-28 border-t border-border/80">
          <div className="container-section">
            <div className="max-w-3xl mb-12">
              <SectionMarker index={3} total={TOTAL_SECTIONS} label={isDE ? 'Top 3 Chancen' : 'Top 3 opportunities'} />
              <h2 className="text-balance">
                {isDE ? 'Größte ' : 'Biggest '}
                <span className="font-editorial italic">{isDE ? 'Hebel.' : 'levers.'}</span>
              </h2>
            </div>

            <ul className="border-t border-border/80">
              {ai.top_3_opportunities.map((opp, i) => (
                <li
                  key={i}
                  className="grid grid-cols-12 gap-4 sm:gap-6 py-8 border-b border-border/80"
                >
                  <div className="col-span-2 sm:col-span-1">
                    <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="col-span-10 sm:col-span-8">
                    <h3 className="text-balance">{opp.title}</h3>
                    <p className="mt-4 text-base md:text-lg text-foreground/75 leading-relaxed">
                      {opp.why}
                    </p>
                  </div>
                  <div className="col-span-12 sm:col-span-3 flex sm:flex-col sm:items-end gap-6 sm:gap-3 sm:text-right">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {isDE ? 'Wirkung' : 'Impact'}
                      </div>
                      <div className="font-editorial italic text-xl mt-1">
                        {opp.impact === 'high' ? (isDE ? 'Hoch' : 'High') : opp.impact === 'medium' ? (isDE ? 'Mittel' : 'Medium') : (isDE ? 'Niedrig' : 'Low')}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {isDE ? 'Aufwand' : 'Effort'}
                      </div>
                      <div className="font-editorial italic text-xl mt-1">{opp.effort}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ===== 04 · Category Scores ===== */}
      <section className="py-20 md:py-28 border-t border-border/80">
        <div className="container-section">
          <div className="max-w-3xl mb-12">
            <SectionMarker index={4} total={TOTAL_SECTIONS} label={isDE ? 'Bereiche' : 'Areas'} />
            <h2 className="text-balance">
              {isDE ? 'Reifegrad nach ' : 'Maturity by '}
              <span className="font-editorial italic">{isDE ? 'Bereich.' : 'area.'}</span>
            </h2>
          </div>

          <div className="border-t border-border/80">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.id] || Search;
              const isExpanded = expandedCategories.includes(cat.id);
              return (
                <div key={cat.id} className="border-b border-border/80">
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full py-6 grid grid-cols-12 gap-4 items-center text-left hover:bg-secondary/40 transition-colors px-2 -mx-2"
                  >
                    <div className="col-span-1 flex justify-center">
                      <Icon className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
                    </div>
                    <div className="col-span-7 sm:col-span-8">
                      <div className="text-xl md:text-2xl">{cat.name}</div>
                      <div className="mt-3 h-px bg-border relative overflow-hidden">
                        <div
                          className="absolute left-0 bg-foreground"
                          style={{ width: `${cat.score}%`, height: '2px', top: '-0.5px' }}
                        />
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right font-editorial italic text-3xl">
                      {cat.score}
                    </div>
                    <div className="col-span-1 flex justify-end text-muted-foreground">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && cat.signals && (
                    <ul className="pb-6 pl-2 sm:pl-12 pr-2">
                      {cat.signals.map((signal) => (
                        <li
                          key={signal.id}
                          className="flex items-center justify-between py-3 text-sm border-t border-border/60 first:border-t-0"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {signal.score >= 70 ? (
                              <CheckCircle className="w-4 h-4 text-foreground shrink-0" strokeWidth={1.5} />
                            ) : (
                              <Circle className="w-4 h-4 text-[hsl(var(--signal))] shrink-0" strokeWidth={1.5} />
                            )}
                            <span className="truncate">{signal.label}</span>
                            {signal.details && (
                              <span className="text-xs text-muted-foreground hidden md:inline truncate">
                                — {signal.details}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-3">
                            <Badge variant="outline" className="text-[10px] font-mono tracking-wider">
                              {getSourceLabel(signal.source)}
                            </Badge>
                            <span className="font-editorial italic text-base w-8 text-right">
                              {signal.score}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 05 · Strengths ===== */}
      {ai?.strengths && ai.strengths.length > 0 && (
        <section className="py-20 md:py-28 border-t border-border/80">
          <div className="container-section">
            <div className="grid grid-cols-12 gap-x-6 gap-y-10">
              <div className="col-span-12 lg:col-span-4">
                <SectionMarker index={5} total={TOTAL_SECTIONS} label={isDE ? 'Stärken' : 'Strengths'} />
                <h2 className="text-balance">
                  {isDE ? 'Was bereits ' : "What's already "}
                  <span className="font-editorial italic">{isDE ? 'trägt.' : 'working.'}</span>
                </h2>
              </div>
              <ul className="col-span-12 lg:col-span-8 border-t border-border/80">
                {ai.strengths.map((s, i) => (
                  <li key={i} className="grid grid-cols-12 gap-4 py-5 border-b border-border/80">
                    <span className="col-span-1 font-mono text-xs tracking-[0.2em] text-muted-foreground pt-1.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <CheckCircle className="col-span-1 w-5 h-5 text-foreground mt-1" strokeWidth={1.5} />
                    <span className="col-span-10 text-lg md:text-xl leading-snug text-balance">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Outcome — what shifts (no marker, in-flow editorial pull) */}
      {ai?.risk_if_ignored && (
        <section className="py-20 md:py-28 border-t border-border/80">
          <div className="container-section">
            <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-start">
              <div className="col-span-12 lg:col-span-5">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  — {isDE ? 'Wirkung' : 'Outcome'}
                </span>
                <h3 className="mt-4 text-balance">
                  {isDE ? 'Was sich ' : 'What '}
                  <span className="font-editorial italic">{isDE ? 'verändert.' : 'shifts.'}</span>
                </h3>
              </div>
              <div className="col-span-12 lg:col-span-7">
                <p className="font-editorial italic text-2xl md:text-3xl leading-[1.35] text-foreground/90 text-balance">
                  {ai.risk_if_ignored}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== 06 · CTA ===== */}
      <section className="py-24 md:py-32 border-t border-border/80">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end">
            <div className="col-span-12 lg:col-span-7">
              <SectionMarker index={6} total={TOTAL_SECTIONS} label={isDE ? 'Nächster Schritt' : 'Next step'} />
              <h2 className="text-balance">
                {isDE ? "Lass uns das " : "Let's "}
                <span className="font-editorial italic">{isDE ? 'aktivieren.' : 'activate this.'}</span>
              </h2>
              {ai?.recommended_action_reason && (
                <p className="mt-6 max-w-xl text-lg text-foreground/75 leading-relaxed">
                  {ai.recommended_action_reason}
                </p>
              )}
            </div>
            <div className="col-span-12 lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4">
              <CTAButton href={isDE ? '/gratis-call' : '/en/free-call'} size="lg" location="analysis-report-cta">
                {isDE ? 'Kostenloses Gespräch' : 'Free consultation'}
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(isDE ? '/ultimate-package' : '/en/ultimate-package')}
              >
                {isDE ? 'Ultimate Package entdecken' : 'Discover Ultimate Package'}
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Meta footer */}
      <section className="py-8 border-t border-border/80">
        <div className="container-section">
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {isDE ? 'Erstellt' : 'Generated'} {new Date(report.created_at).toLocaleDateString(isDE ? 'de-CH' : 'en-US')}
            {' · '}{report.scan_version || 'v1.0'}
            {' · '}{signals.length} Signals
            {' · '}{report.data_sources_used?.length || 0} {isDE ? 'Quellen' : 'sources'}
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default AnalysisReportPage;
