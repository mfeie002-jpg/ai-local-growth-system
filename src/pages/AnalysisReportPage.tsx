import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { CTAButton } from '@/components/CTAButton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, CheckCircle, Search, Shield, Target, Zap, 
  Gauge, AlertOctagon, Info, Loader2, ArrowRight, Sparkles,
  ExternalLink, ChevronDown, ChevronUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-destructive';
}

function getScoreBg(score: number) {
  if (score >= 80) return 'from-green-500/10 to-green-500/5 border-green-500/20';
  if (score >= 60) return 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20';
  if (score >= 40) return 'from-orange-500/10 to-orange-500/5 border-orange-500/20';
  return 'from-destructive/10 to-destructive/5 border-destructive/20';
}

function getScoreBucket(score: number): string {
  if (score >= 75) return 'green';
  if (score >= 50) return 'yellow';
  return 'red';
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

  const isDE = language === 'de';

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
        <SEOHead title="Loading..." description="Loading analysis report..." />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Error
  if (error || !report) {
    return (
      <Layout>
        <SEOHead title={isDE ? 'Report nicht gefunden' : 'Report not found'} description="" />
        <div className="min-h-screen flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <AlertOctagon className="h-16 w-16 text-destructive mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">{isDE ? 'Report nicht gefunden' : 'Report not found'}</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <CTAButton href="/scan" size="lg">
              {isDE ? 'Neue Analyse starten' : 'Start New Analysis'}
            </CTAButton>
          </div>
        </div>
      </Layout>
    );
  }

  const ai = report.ai_interpretation;
  const categories: CategoryScore[] = report.scoring_details?.categories || [];
  const signals: Signal[] = report.normalized_signals || [];
  const bucket = getScoreBucket(report.overall_score);
  const isComplete = report.scan_status === 'complete' || report.scan_status === 'complete_no_ai';

  return (
    <Layout>
      <SEOHead
        title={`${report.site_name} — ${report.overall_score}/100`}
        description={ai?.headline || `Analysis report for ${report.site_name}`}
        canonical={`/analyse/${token}`}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* ===== HERO SCORE ===== */}
          <ScrollReveal>
            <section className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-ai/10 border border-ai/20">
                <Sparkles className="w-3.5 h-3.5 text-ai" />
                <span className="text-xs font-medium text-ai">{isDE ? 'Digitaler Reifegrad-Check' : 'Digital Maturity Check'}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
                {report.site_name}
              </h1>

              {ai?.headline && (
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                  {ai.headline}
                </p>
              )}

              {/* Score Ring */}
              <div className={cn(
                'inline-flex flex-col items-center p-8 rounded-3xl border bg-gradient-to-br',
                getScoreBg(report.overall_score)
              )}>
                <div className={cn('text-7xl font-bold font-display', getScoreColor(report.overall_score))}>
                  {report.overall_score}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{isDE ? 'Digitaler Reifegrad' : 'Digital Maturity Score'}</p>
                <div className="flex gap-2 mt-4">
                  <Badge className="bg-primary/20 text-primary border-primary/30">{report.critical_issues} {isDE ? 'Top-Potenziale' : 'Top Potentials'}</Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">{report.warning_issues} {isDE ? 'Verbesserungen' : 'Improvements'}</Badge>
                  <Badge variant="outline">{report.info_issues} {isDE ? 'Gut aufgestellt' : 'Well set up'}</Badge>
                </div>
              </div>

              {/* Data sources */}
              <div className="flex items-center justify-center gap-3 mt-4 text-xs text-muted-foreground">
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
            </section>
          </ScrollReveal>

          {/* ===== AI SUMMARY ===== */}
          {ai?.summary && (
            <ScrollReveal delay={0.05}>
              <Card className="mb-8 border-ai/20 bg-gradient-to-br from-ai/5 to-background">
                <CardContent className="p-6">
                  <p className="text-base leading-relaxed">{ai.summary}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          )}

          {/* ===== TOP 3 OPPORTUNITIES ===== */}
          {ai?.top_3_opportunities && ai.top_3_opportunities.length > 0 && (
            <ScrollReveal delay={0.1}>
              <section className="mb-10">
                <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-ai" />
                  {isDE ? 'Grösste Chancen' : 'Biggest Opportunities'}
                </h2>
                <div className="grid gap-4">
                  {ai.top_3_opportunities.map((opp, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                    >
                      <Card className="border-ai/10 hover:border-ai/30 transition-colors">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-7 h-7 rounded-full bg-ai/10 text-ai flex items-center justify-center text-sm font-bold">{i + 1}</span>
                                <h3 className="font-semibold">{opp.title}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground">{opp.why}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Badge className={cn(
                                opp.impact === 'high' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                                opp.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' :
                                'bg-muted'
                              )}>
                                {opp.impact === 'high' ? (isDE ? 'Hoch' : 'High') : opp.impact === 'medium' ? (isDE ? 'Mittel' : 'Medium') : (isDE ? 'Niedrig' : 'Low')}
                              </Badge>
                              <Badge variant="secondary" className="font-mono">{opp.effort}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}

          {/* ===== CATEGORY SCORES ===== */}
          <ScrollReveal delay={0.15}>
            <section className="mb-10">
              <h2 className="text-xl font-bold font-display mb-4">
                {isDE ? 'Digitaler Reifegrad nach Bereich' : 'Digital Maturity by Area'}
              </h2>
              <div className="grid gap-3">
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat.id] || Search;
                  const isExpanded = expandedCategories.includes(cat.id);
                  return (
                    <Card key={cat.id} className="overflow-hidden">
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                          cat.score >= 70 ? 'bg-green-500/10 text-green-500' :
                          cat.score >= 40 ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-destructive/10 text-destructive'
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{cat.name}</span>
                            <span className={cn('font-bold text-lg', getScoreColor(cat.score))}>{cat.score}</span>
                          </div>
                          <Progress value={cat.score} className="h-1.5" />
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          {cat.criticalCount > 0 && (
                            <Badge variant="destructive" className="text-xs">{cat.criticalCount}</Badge>
                          )}
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>

                      {isExpanded && cat.signals && (
                        <div className="border-t px-4 pb-4">
                          <div className="space-y-2 mt-3">
                            {cat.signals.map((signal) => (
                              <div key={signal.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 text-sm">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  {signal.score >= 70 ? (
                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                  ) : signal.score >= 30 ? (
                                    <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                                  )}
                                  <span className="truncate">{signal.label}</span>
                                  {signal.details && (
                                    <span className="text-xs text-muted-foreground hidden md:inline truncate">— {signal.details}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  <Badge variant="outline" className="text-xs">{getSourceLabel(signal.source)}</Badge>
                                  <span className={cn('font-mono text-xs font-bold', getScoreColor(signal.score))}>{signal.score}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          </ScrollReveal>

          {/* ===== STRENGTHS ===== */}
          {ai?.strengths && ai.strengths.length > 0 && (
            <ScrollReveal delay={0.2}>
              <Card className="mb-8 border-green-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {isDE ? 'Was bereits gut läuft' : 'What\'s already working well'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {ai.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          )}

          {/* ===== RISK IF IGNORED ===== */}
          {ai?.risk_if_ignored && (
            <ScrollReveal delay={0.25}>
              <Card className="mb-8 border-ai/20 bg-gradient-to-br from-ai/5 to-background">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-ai" />
                    {isDE ? 'Was sich verändert, wenn du handelst' : 'What changes when you act'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{ai.risk_if_ignored}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          )}

          {/* ===== CTA ===== */}
          <ScrollReveal delay={0.3}>
            <section className="text-center py-10">
              <Card className="border-ai/20 bg-gradient-to-br from-ai/5 to-primary/5 p-8">
                <h2 className="text-2xl font-bold font-display mb-3">
                  {isDE ? 'Bereit für den nächsten Schritt?' : 'Ready for the next step?'}
                </h2>
                {ai?.recommended_action_reason && (
                  <p className="text-muted-foreground mb-6 max-w-lg mx-auto">{ai.recommended_action_reason}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <CTAButton href={isDE ? '/gratis-call' : '/en/free-call'} size="lg" className="glow-ai">
                    {isDE ? 'Kostenloses Beratungsgespräch' : 'Free Consultation Call'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </CTAButton>
                  <Button variant="outline" size="lg" onClick={() => navigate(isDE ? '/ultimate-package' : '/en/ultimate-package')}>
                    {isDE ? 'Ultimate Package entdecken' : 'Discover Ultimate Package'}
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </section>
          </ScrollReveal>

          {/* ===== META FOOTER ===== */}
          <div className="text-center text-xs text-muted-foreground/50 pb-8">
            <p>
              {isDE ? 'Erstellt am' : 'Generated'} {new Date(report.created_at).toLocaleDateString(isDE ? 'de-CH' : 'en-US')}
              {' · '}Version {report.scan_version || 'v1.0'}
              {' · '}{signals.length} Signals
              {' · '}{report.data_sources_used?.length || 0} {isDE ? 'Datenquellen' : 'data sources'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalysisReportPage;
