import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { CTAButton } from '@/components/CTAButton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  Search, 
  Zap, 
  Shield, 
  Smartphone, 
  FileText, 
  Code, 
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  MapPin,
  Share2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  AlertOctagon,
  Info,
  Download,
  DollarSign,
  Rocket,
  Target,
  Calculator,
  Coins,
  Timer,
  Skull,
  HeartCrack,
  CircleDollarSign,
  Sparkles,
  Crown,
  Loader2,
  Phone,
  PhoneMissed,
  UserMinus,
  BarChart3,
  Calendar,
  CheckCircle2,
  Wrench,
  Lightbulb,
  Play
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';

// Types
interface TopLeak {
  id: string;
  title: string;
  description: string;
  estimated_loss: number;
}

interface Scenario {
  leads_per_month: number;
  close_rate: number;
  jobs_per_month: number;
  revenue_per_month: number;
}

interface CostLeak {
  id: string;
  title: string;
  consequence: string;
  monthly_loss: number;
  icon: string;
}

interface TopFix {
  rank: number;
  title: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'S' | 'M' | 'L';
  days_to_live: string;
  why_important: string;
  if_not_done: string;
}

interface BacklogIssue {
  title: string;
  severity: 'critical' | 'warning' | 'info';
  hours_to_fix: number;
  monthly_loss: number;
}

interface BacklogCategory {
  id: string;
  name: string;
  total_issues: number;
  critical_issues: number;
  issues: BacklogIssue[];
}

interface PackageOption {
  id: string;
  name: string;
  price: number;
  price_type: string;
  time_to_live: string;
}

interface RoadmapPhase {
  phase: string;
  title: string;
  tasks: string[];
}

interface Outcome {
  icon: string;
  title: string;
  description: string;
}

interface Consequence {
  icon: string;
  title: string;
  description: string;
}

interface ReportCategories {
  legacy_categories?: any[];
  score_bucket?: 'red' | 'yellow' | 'green';
  recommended_route?: 'launch_sprint' | 'growth' | 'scale';
  top_3_leaks?: TopLeak[];
  business_inputs?: {
    leads_per_month_now?: number;
    close_rate_now?: number;
    avg_order_value?: number;
    capacity_jobs_per_month?: number;
  };
  scenarios?: {
    conservative?: Scenario;
    realistic?: Scenario;
    ambitious?: Scenario;
  };
  current_state?: Scenario;
  cost_of_inaction?: {
    leaks?: CostLeak[];
    total_monthly_loss?: number;
  };
  top_10_fixes?: TopFix[];
  backlog_categories?: BacklogCategory[];
  effort_comparison?: {
    diy?: {
      total_hours: number;
      complexity: string;
      risk: string;
      hourly_rate_default: number;
    };
    done_for_you?: {
      recommended_package: string;
      package_options: PackageOption[];
    };
  };
  roadmap_14_days?: RoadmapPhase[];
  outcomes?: Outcome[];
}

interface AnalysisReport {
  id: string;
  token: string;
  site_name: string;
  overall_score: number;
  total_issues: number;
  critical_issues: number;
  warning_issues: number;
  info_issues: number;
  total_hours: number;
  hourly_rate: number;
  monthly_loss: number;
  current_revenue: number;
  projected_revenue: number;
  categories: ReportCategories;
  consequences: Consequence[];
  created_at: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Zap,
  Smartphone,
  Shield,
  Users,
  FileText,
  MapPin,
  Code,
  TrendingUp,
  TrendingDown,
  Share2,
  HeartCrack,
  Skull,
  Target,
  Clock,
  BarChart3,
  PhoneMissed,
  UserMinus,
  DollarSign,
  AlertTriangle,
  Phone,
  Coins
};

const AnalysisReportPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<'conservative' | 'realistic' | 'ambitious'>('realistic');
  const [expandedBacklog, setExpandedBacklog] = useState<string[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      if (!token) {
        setError('No token provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke('get-analysis-report', {
          body: { token }
        });

        if (fnError) {
          console.error('Function error:', fnError);
          setError('Failed to load report');
          setLoading(false);
          return;
        }

        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }

        setReport(data.report);
        if (data.report?.categories?.backlog_categories?.length > 0) {
          setExpandedBacklog([data.report.categories.backlog_categories[0].id]);
        }
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [token]);

  const content = {
    // Executive Summary
    headline: language === 'de' ? 'Dini Scorecard – das kostet di aktuell Umsatz.' : 'Your Scorecard – this is costing you revenue.',
    subline: language === 'de' ? 'Basierend uf dine Inputs. Im Voll-Audit chömed no manuelle Checks dazu.' : 'Based on your inputs. Manual checks are included in the full audit.',
    assumptionLabel: language === 'de' ? 'Schätzung basierend uf dine Inputs' : 'Estimate based on your inputs',
    
    // Sections
    section2Title: language === 'de' ? 'Was passiert, wenn mer d\'Leaks stopft?' : 'What happens when we fix the leaks?',
    section2Micro: language === 'de' ? 'Du gsehsch 3 Szenarien. Du chasch dine Zahlene aapasse.' : 'You see 3 scenarios. You can adjust your numbers.',
    
    section3Title: language === 'de' ? 'Was du verlürsch, wenn du\'s laufe lahsch.' : 'What you lose if you let it run.',
    section3Micro: language === 'de' ? 'Das sind Opportunity Costs. Je länger du wartisch, desto meh summiert sich\'s.' : 'These are opportunity costs. The longer you wait, the more it adds up.',
    
    section4Title: language === 'de' ? 'Top 10 Fixes – priorisiert' : 'Top 10 Fixes – prioritized',
    
    section5Title: language === 'de' ? 'Vollständiger Backlog' : 'Complete Backlog',
    
    section6Title: language === 'de' ? 'Aufwand & Kosten' : 'Effort & Cost',
    diyTitle: language === 'de' ? 'Selber machen' : 'DIY',
    doneForYouTitle: language === 'de' ? 'Mir mached\'s für di' : 'We do it for you',
    
    section7Title: language === 'de' ? '14-Tage Roadmap' : '14-Day Roadmap',
    
    section8Title: language === 'de' ? 'Wenn du\'s nöd machsch...' : 'If you don\'t do it...',
    
    section9Title: language === 'de' ? 'Was du gewinnsch' : 'What you gain',
    
    section10Title: language === 'de' ? 'Du hesch zwei Optionen' : 'You have two options',
    diyButtonLabel: language === 'de' ? 'Ich mach\'s selber' : 'I\'ll do it myself',
    doneForYouButtonLabel: language === 'de' ? 'Macht ihr\'s für mich' : 'Do it for me',
    diyMicro: language === 'de' ? 'Wenn du\'s selber machsch: super. Wenn du\'s richtig & schnell wotsch: mir übernehmed.' : 'If you do it yourself: great. If you want it done right & fast: we take over.',
    
    // Labels
    now: language === 'de' ? 'Jetzt' : 'Now',
    optimized: language === 'de' ? 'Optimiert' : 'Optimized',
    leadsMonth: language === 'de' ? 'Leads/Monat' : 'Leads/Month',
    closeRate: language === 'de' ? 'Abschlussquote' : 'Close Rate',
    jobsMonth: language === 'de' ? 'Gebuchte Jobs/Monat' : 'Booked Jobs/Month',
    revenueMonth: language === 'de' ? 'Umsatz/Monat' : 'Revenue/Month',
    conservative: language === 'de' ? 'Konservativ' : 'Conservative',
    realistic: language === 'de' ? 'Realistisch' : 'Realistic',
    ambitious: language === 'de' ? 'Ambitioniert' : 'Ambitious',
    impact: language === 'de' ? 'Impact' : 'Impact',
    effort: language === 'de' ? 'Aufwand' : 'Effort',
    timeToLive: language === 'de' ? 'Zeit bis live' : 'Time to live',
    whyImportant: language === 'de' ? 'Warum wichtig' : 'Why important',
    ifNotDone: language === 'de' ? 'Wenn nöd gmacht' : 'If not done',
    downloadPdf: language === 'de' ? 'Report als PDF' : 'Download PDF',
    notFound: language === 'de' ? 'Report nicht gefunden' : 'Report not found',
    notFoundDesc: language === 'de' ? 'Der angeforderte Analyse-Report existiert nicht oder ist abgelaufen.' : 'The requested analysis report does not exist or has expired.',
    startNew: language === 'de' ? 'Neue Analyse starten' : 'Start New Analysis',
    high: language === 'de' ? 'Hoch' : 'High',
    medium: language === 'de' ? 'Mittel' : 'Medium',
    low: language === 'de' ? 'Tief' : 'Low',
    hours: language === 'de' ? 'Stunden' : 'Hours',
    complexity: language === 'de' ? 'Komplexität' : 'Complexity',
    risk: language === 'de' ? 'Risiko' : 'Risk',
    price: language === 'de' ? 'Preis' : 'Price',
    monthly: language === 'de' ? 'monatlich' : 'monthly',
    oneTime: language === 'de' ? 'einmalig' : 'one-time',
    recommended: language === 'de' ? 'Empfohlen' : 'Recommended',
    findings: language === 'de' ? 'Findings' : 'Findings',
    critical: language === 'de' ? 'kritisch' : 'critical',
    perMonth: language === 'de' ? '/Monat' : '/Month',
  };

  const getScoreBucketColor = (bucket: string) => {
    switch (bucket) {
      case 'red': return 'bg-destructive text-destructive-foreground';
      case 'yellow': return 'bg-yellow-500 text-yellow-950';
      case 'green': return 'bg-green-500 text-white';
      default: return 'bg-muted';
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-destructive';
    if (score < 50) return 'text-yellow-500';
    if (score < 70) return 'text-orange-400';
    return 'text-green-500';
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">{content.high}</Badge>;
      case 'medium': return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">{content.medium}</Badge>;
      case 'low': return <Badge variant="outline">{content.low}</Badge>;
      default: return null;
    }
  };

  const getEffortBadge = (effort: string) => {
    return <Badge variant="secondary" className="font-mono">{effort}</Badge>;
  };

  const generatePDF = () => {
    if (!report) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(24);
    doc.setTextColor(220, 38, 38);
    doc.text('Website-Analyse Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(report.site_name, pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(48);
    doc.setTextColor(220, 38, 38);
    doc.text(`${report.overall_score}/100`, pageWidth / 2, 55, { align: 'center' });
    
    // Top 3 Leaks
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Top 3 Leaks:', 20, 75);
    
    const leaks = report.categories.top_3_leaks || [];
    leaks.forEach((leak, i) => {
      doc.setFontSize(11);
      doc.text(`${i + 1}. ${leak.title}: CHF ${leak.estimated_loss}/Mo`, 25, 85 + (i * 8));
    });
    
    // Top 10 Fixes
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Top 10 Fixes', 20, 20);
    
    const fixes = report.categories.top_10_fixes || [];
    const fixesData = fixes.map(fix => [
      `#${fix.rank}`,
      fix.title,
      fix.impact,
      fix.effort,
      fix.days_to_live
    ]);
    
    autoTable(doc, {
      startY: 30,
      head: [['#', 'Fix', 'Impact', 'Effort', 'Zeit']],
      body: fixesData,
      theme: 'striped',
      headStyles: { fillColor: [220, 38, 38] },
    });
    
    doc.save(`analyse-report-${report.site_name}.pdf`);
    toast.success(language === 'de' ? 'PDF heruntergeladen!' : 'PDF downloaded!');
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <SEOHead title="Loading..." description="Loading analysis report..." />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              {language === 'de' ? 'Report wird geladen...' : 'Loading report...'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error/Not found state
  if (error || !report) {
    return (
      <Layout>
        <SEOHead title={content.notFound} description={content.notFoundDesc} />
        <div className="min-h-screen flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <AlertOctagon className="h-16 w-16 text-destructive mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">{content.notFound}</h1>
            <p className="text-muted-foreground mb-8">{content.notFoundDesc}</p>
            <CTAButton href="/ultimate-package" size="lg">
              {content.startNew}
            </CTAButton>
          </div>
        </div>
      </Layout>
    );
  }

  const categories = report.categories || {};
  const scenarios = categories.scenarios || {};
  const currentState = categories.current_state || { leads_per_month: 50, close_rate: 15, jobs_per_month: 7, revenue_per_month: report.current_revenue };
  const costOfInaction = categories.cost_of_inaction || { leaks: [], total_monthly_loss: report.monthly_loss };
  const topFixes = categories.top_10_fixes || [];
  const backlogCategories = categories.backlog_categories || [];
  const effortComparison = categories.effort_comparison || {};
  const roadmap = categories.roadmap_14_days || [];
  const outcomes = categories.outcomes || [];
  const consequences = report.consequences || [];
  const topLeaks = categories.top_3_leaks || [];
  const scoreBucket = categories.score_bucket || 'yellow';
  const recommendedRoute = categories.recommended_route || 'growth';

  const selectedScenario = scenarios[activeScenario] || scenarios.realistic || { leads_per_month: 70, close_rate: 22, jobs_per_month: 15, revenue_per_month: report.projected_revenue };

  return (
    <Layout>
      <SEOHead
        title={`${content.headline} - ${report.site_name}`}
        description={content.subline}
        canonical={`/analyse/${token}`}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* ===== SECTION 1: Executive Summary ===== */}
          <ScrollReveal>
            <section className="mb-12">
              <div className="text-center mb-8">
                <Badge className={`mb-4 ${getScoreBucketColor(scoreBucket)}`}>
                  {scoreBucket === 'red' ? '🔴' : scoreBucket === 'yellow' ? '🟡' : '🟢'} Score: {report.overall_score}/100
                </Badge>
                <h1 className="text-2xl md:text-4xl font-bold mb-3">{content.headline}</h1>
                <p className="text-muted-foreground mb-4">{content.subline}</p>
                <p className="text-xs text-muted-foreground/70 inline-flex items-center gap-1">
                  <Info className="h-3 w-3" /> {content.assumptionLabel}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Score Card */}
                <Card className="border-destructive/30 bg-gradient-to-br from-destructive/5 to-background">
                  <CardContent className="p-6 text-center">
                    <div className={`text-7xl font-bold mb-2 ${getScoreColor(report.overall_score)}`}>
                      {report.overall_score}
                    </div>
                    <p className="text-muted-foreground text-sm">von 100 Punkten</p>
                    <div className="mt-4 flex justify-center gap-2">
                      <Badge variant="destructive">{report.critical_issues} {content.critical}</Badge>
                      <Badge className="bg-yellow-500/20 text-yellow-600">{report.warning_issues} Warnungen</Badge>
                      <Badge variant="outline">{report.info_issues} Info</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Top 3 Leaks */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      {language === 'de' ? 'Grösste 3 Leaks' : 'Top 3 Leaks'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {topLeaks.slice(0, 3).map((leak, index) => (
                      <div key={leak.id || index} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{leak.title}</p>
                          <p className="text-xs text-muted-foreground">{leak.description}</p>
                        </div>
                        <Badge variant="destructive" className="ml-2 shrink-0">
                          CHF {leak.estimated_loss?.toLocaleString()}{content.perMonth}
                        </Badge>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Empfohlene Route:' : 'Recommended route:'}{' '}
                        <Badge className="ml-1" variant="secondary">
                          {recommendedRoute === 'launch_sprint' ? 'Launch Sprint' : recommendedRoute === 'growth' ? 'Growth' : 'Scale'}
                        </Badge>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 text-center">
                <Button onClick={generatePDF} variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  {content.downloadPdf}
                </Button>
              </div>
            </section>
          </ScrollReveal>

          {/* ===== SECTION 2: Now vs Optimized (3 Scenarios) ===== */}
          <ScrollReveal delay={0.1}>
            <section className="mb-12">
              <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-background">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-center flex items-center justify-center gap-2">
                    <Rocket className="h-6 w-6 text-green-500" />
                    {content.section2Title}
                  </CardTitle>
                  <p className="text-center text-muted-foreground text-sm">{content.section2Micro}</p>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeScenario} onValueChange={(v) => setActiveScenario(v as typeof activeScenario)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="conservative">{content.conservative}</TabsTrigger>
                      <TabsTrigger value="realistic">{content.realistic}</TabsTrigger>
                      <TabsTrigger value="ambitious">{content.ambitious}</TabsTrigger>
                    </TabsList>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Now */}
                      <div className="p-5 rounded-xl bg-destructive/5 border border-destructive/20">
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingDown className="h-5 w-5 text-destructive" />
                          <h3 className="font-bold">{content.now} (Ist)</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{content.leadsMonth}</span>
                            <span className="font-medium">{currentState.leads_per_month}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{content.closeRate}</span>
                            <span className="font-medium">{currentState.close_rate}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{content.jobsMonth}</span>
                            <span className="font-medium">{currentState.jobs_per_month}</span>
                          </div>
                          <div className="flex justify-between text-sm border-t pt-2">
                            <span className="text-muted-foreground">{content.revenueMonth}</span>
                            <span className="font-bold">CHF {currentState.revenue_per_month?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Optimized */}
                      <div className="p-5 rounded-xl bg-green-500/5 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <h3 className="font-bold text-green-600">{content.optimized} (Soll)</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{content.leadsMonth}</span>
                            <span className="font-medium text-green-600">{selectedScenario.leads_per_month}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{content.closeRate}</span>
                            <span className="font-medium text-green-600">{selectedScenario.close_rate}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{content.jobsMonth}</span>
                            <span className="font-medium text-green-600">{selectedScenario.jobs_per_month}</span>
                          </div>
                          <div className="flex justify-between text-sm border-t pt-2">
                            <span className="text-muted-foreground">{content.revenueMonth}</span>
                            <span className="font-bold text-green-600">CHF {selectedScenario.revenue_per_month?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                      <Sparkles className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">{language === 'de' ? 'Potenzielle Steigerung' : 'Potential increase'}</p>
                      <div className="text-3xl font-bold text-green-500">
                        +CHF {((selectedScenario.revenue_per_month || 0) - (currentState.revenue_per_month || 0)).toLocaleString()}{content.perMonth}
                      </div>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </section>
          </ScrollReveal>

          {/* ===== SECTION 3: Cost of Inaction ===== */}
          <ScrollReveal delay={0.15}>
            <section className="mb-12">
              <Card className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-center flex items-center justify-center gap-2">
                    <CircleDollarSign className="h-6 w-6 text-destructive" />
                    {content.section3Title}
                  </CardTitle>
                  <p className="text-center text-muted-foreground text-sm">{content.section3Micro}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {(costOfInaction.leaks || []).slice(0, 3).map((leak, index) => {
                      const IconComponent = iconMap[leak.icon] || AlertTriangle;
                      return (
                        <Card key={leak.id || index} className="bg-destructive/5 border-destructive/20">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-destructive/10">
                                <IconComponent className="h-5 w-5 text-destructive" />
                              </div>
                              <h4 className="font-bold text-sm">{leak.title}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{leak.consequence}</p>
                            <div className="text-lg font-bold text-destructive">
                              CHF {leak.monthly_loss?.toLocaleString()}{content.perMonth}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="p-5 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
                    <Skull className="h-10 w-10 text-destructive mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">{language === 'de' ? 'Total geschätzter Verlust' : 'Total estimated loss'}</p>
                    <div className="text-4xl font-bold text-destructive">
                      CHF {(costOfInaction.total_monthly_loss || report.monthly_loss).toLocaleString()}{content.perMonth}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      = CHF {((costOfInaction.total_monthly_loss || report.monthly_loss) * 12).toLocaleString()} {language === 'de' ? 'pro Jahr' : 'per year'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </ScrollReveal>

          {/* ===== SECTION 4: Top 10 Fixes ===== */}
          <ScrollReveal delay={0.2}>
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                <Wrench className="h-6 w-6 text-primary" />
                {content.section4Title}
              </h2>
              
              <div className="space-y-3">
                {topFixes.map((fix) => (
                  <Card key={fix.rank} className={fix.rank <= 3 ? 'border-primary/30 bg-primary/5' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          fix.rank <= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {fix.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2 mb-1">
                            <h4 className="font-bold text-sm">{fix.title}</h4>
                            {getImpactBadge(fix.impact)}
                            {getEffortBadge(fix.effort)}
                            <Badge variant="outline" className="text-xs">{fix.days_to_live}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            <span className="font-medium">{content.whyImportant}:</span> {fix.why_important}
                          </p>
                          <p className="text-xs text-destructive/80">
                            <span className="font-medium">{content.ifNotDone}:</span> {fix.if_not_done}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* ===== SECTION 5: Full Backlog ===== */}
          <ScrollReveal delay={0.25}>
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
                <FileText className="h-6 w-6 text-muted-foreground" />
                {content.section5Title}
              </h2>
              <p className="text-center text-muted-foreground text-sm mb-6">
                {language === 'de' 
                  ? `Du hesch insgesamt ${report.total_issues} Optimier-Punkte. Davon sind ${report.critical_issues} direkt Umsatz-relevant.`
                  : `You have a total of ${report.total_issues} optimization points. ${report.critical_issues} are directly revenue-relevant.`
                }
              </p>

              <Accordion type="multiple" value={expandedBacklog} onValueChange={setExpandedBacklog}>
                {backlogCategories.map((category) => (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-medium text-left">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {category.total_issues} {content.findings}
                          </Badge>
                          {category.critical_issues > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {category.critical_issues} {content.critical}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2">
                        {(category.issues || []).map((issue, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 text-sm">
                            <div className="flex items-center gap-2">
                              {issue.severity === 'critical' && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                              {issue.severity === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />}
                              {issue.severity === 'info' && <Info className="h-4 w-4 text-blue-500 shrink-0" />}
                              <span>{issue.title}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{issue.hours_to_fix}h</span>
                              <span className="text-destructive font-medium">CHF {issue.monthly_loss}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </ScrollReveal>

          {/* ===== SECTION 6: DIY vs Done-for-You ===== */}
          <ScrollReveal delay={0.3}>
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                <Calculator className="h-6 w-6 text-muted-foreground" />
                {content.section6Title}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* DIY */}
                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{content.diyTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">{language === 'de' ? 'Geschätzte Stunden' : 'Estimated hours'}</span>
                      <span className="font-bold">{effortComparison.diy?.total_hours || report.total_hours}h</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">{content.complexity}</span>
                      <Badge variant="secondary">{effortComparison.diy?.complexity || 'hoch'}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-destructive/10">
                      <span className="text-sm text-muted-foreground">{content.risk}</span>
                      <span className="text-xs text-destructive max-w-[150px] text-right">{effortComparison.diy?.risk || 'Tracking falsch = falsche Entscheide'}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">DIY-Kosten (à CHF {effortComparison.diy?.hourly_rate_default || report.hourly_rate}/h)</span>
                        <span className="text-xl font-bold">
                          CHF {((effortComparison.diy?.total_hours || report.total_hours) * (effortComparison.diy?.hourly_rate_default || report.hourly_rate)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Done-for-You */}
                <Card className="border-primary/30 bg-primary/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {content.doneForYouTitle}
                      <Badge className="bg-primary">{content.recommended}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(effortComparison.done_for_you?.package_options || []).map((pkg) => (
                      <div 
                        key={pkg.id} 
                        className={`p-4 rounded-lg border ${
                          pkg.id === effortComparison.done_for_you?.recommended_package 
                            ? 'border-primary bg-primary/10' 
                            : 'border-muted bg-muted/30'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold">{pkg.name}</h4>
                            <p className="text-xs text-muted-foreground">{pkg.time_to_live}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">CHF {pkg.price.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">{pkg.price_type === 'monatlich' ? content.monthly : content.oneTime}</div>
                          </div>
                        </div>
                        {pkg.id === effortComparison.done_for_you?.recommended_package && (
                          <Badge className="mt-2 bg-green-500">{content.recommended}</Badge>
                        )}
                      </div>
                    ))}
                    <div className="pt-2 text-center">
                      <p className="text-xs text-muted-foreground">
                        {language === 'de' 
                          ? 'Anti-Knebel: Domains, Ads-Konten & Daten gehören dir.'
                          : 'No lock-in: Domains, ad accounts & data belong to you.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </ScrollReveal>

          {/* ===== SECTION 7: 14-Day Roadmap ===== */}
          <ScrollReveal delay={0.35}>
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                <Calendar className="h-6 w-6 text-muted-foreground" />
                {content.section7Title}
              </h2>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/30 md:left-1/2 md:-ml-0.5" />
                
                <div className="space-y-6">
                  {roadmap.map((phase, index) => (
                    <div key={index} className="relative pl-10 md:pl-0 md:grid md:grid-cols-2 md:gap-8">
                      <div className={`md:text-right ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                        <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center md:left-1/2 md:-ml-2.5">
                          <span className="text-[10px] font-bold text-primary-foreground">{index + 1}</span>
                        </div>
                        <Card className={index % 2 === 1 ? '' : 'md:ml-8'}>
                          <CardContent className="p-4">
                            <Badge variant="outline" className="mb-2">{phase.phase}</Badge>
                            <h4 className="font-bold mb-2">{phase.title}</h4>
                            <ul className="space-y-1">
                              {phase.tasks.map((task, taskIdx) => (
                                <li key={taskIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* ===== SECTION 8: Consequences ===== */}
          <ScrollReveal delay={0.4}>
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                {content.section8Title}
              </h2>

              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {consequences.slice(0, 3).map((item, index) => {
                      const IconComponent = iconMap[item.icon] || AlertTriangle;
                      return (
                        <div key={index} className="text-center p-4">
                          <IconComponent className="h-8 w-8 text-destructive mx-auto mb-3" />
                          <h4 className="font-bold mb-2">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </section>
          </ScrollReveal>

          {/* ===== SECTION 9: Outcomes ===== */}
          <ScrollReveal delay={0.45}>
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-green-500" />
                {content.section9Title}
              </h2>

              <Card className="bg-green-500/5 border-green-500/20">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {outcomes.slice(0, 3).map((item, index) => {
                      const IconComponent = iconMap[item.icon] || Target;
                      return (
                        <div key={index} className="text-center p-4">
                          <IconComponent className="h-8 w-8 text-green-500 mx-auto mb-3" />
                          <h4 className="font-bold mb-2">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Mini projection reminder */}
              <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                <p className="text-sm text-muted-foreground mb-1">{language === 'de' ? 'Szenario: Realistisch' : 'Scenario: Realistic'}</p>
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{content.now}</p>
                    <p className="font-bold">CHF {currentState.revenue_per_month?.toLocaleString()}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">{content.optimized}</p>
                    <p className="font-bold text-green-600">CHF {(scenarios.realistic?.revenue_per_month || report.projected_revenue)?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* ===== SECTION 10: One-Click Decision ===== */}
          <ScrollReveal delay={0.5}>
            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">{content.section10Title}</h2>
              <p className="text-center text-muted-foreground mb-8">{content.diyMicro}</p>

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* DIY Button */}
                <Card className="border-muted hover:border-muted-foreground/50 transition-colors cursor-pointer group" 
                      onClick={() => {
                        toast.info(language === 'de' ? 'Checklist wird erstellt...' : 'Creating checklist...');
                        generatePDF();
                      }}>
                  <CardContent className="p-6 text-center">
                    <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4 group-hover:text-primary transition-colors" />
                    <h3 className="text-xl font-bold mb-3">{content.diyButtonLabel}</h3>
                    <ul className="text-sm text-muted-foreground text-left space-y-2 mb-4">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        {language === 'de' ? 'Action Plan als Checklist' : 'Action plan as checklist'}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        {language === 'de' ? 'Prioritäten (Top 10)' : 'Priorities (Top 10)'}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        {language === 'de' ? 'PDF Export' : 'PDF Export'}
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full group-hover:bg-muted">
                      <Download className="h-4 w-4 mr-2" />
                      {language === 'de' ? 'Checklist downloaden' : 'Download checklist'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Done-for-You Button */}
                <Card className="border-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group"
                      onClick={() => navigate('/call')}>
                  <CardContent className="p-6 text-center">
                    <Play className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-3">{content.doneForYouButtonLabel}</h3>
                    <ul className="text-sm text-muted-foreground text-left space-y-2 mb-4">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        {language === 'de' ? 'Alles us einere Hand' : 'Everything from one source'}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        {language === 'de' ? '48h Onboarding möglich' : '48h onboarding possible'}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        {language === 'de' ? 'Anti-Knebel Garantie' : 'No lock-in guarantee'}
                      </li>
                    </ul>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Rocket className="h-4 w-4 mr-2" />
                      {language === 'de' ? 'Umsetzung starten' : 'Start implementation'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>
          </ScrollReveal>

        </div>
      </div>
    </Layout>
  );
};

export default AnalysisReportPage;
