import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  TrendingDown,
  Rocket,
  Target,
  Ban,
  Calculator,
  Coins,
  Timer,
  Skull,
  HeartCrack,
  CircleDollarSign,
  Sparkles,
  Crown,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  impact: string;
  effort: 'low' | 'medium' | 'high';
  hoursToFix: number;
  costIfIgnored: number;
}

interface Category {
  id: string;
  name: string;
  iconName: string;
  score: number;
  issues: Issue[];
  color: string;
}

interface Consequence {
  iconName: string;
  title: string;
  description: string;
  loss: string;
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
  categories: Category[];
  consequences: Consequence[];
  created_at: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
  Smartphone: <Smartphone className="h-5 w-5" />,
  Shield: <Shield className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  MapPin: <MapPin className="h-5 w-5" />,
  Code: <Code className="h-5 w-5" />,
  TrendingUp: <TrendingUp className="h-5 w-5" />,
  Share2: <Share2 className="h-5 w-5" />,
  TrendingDown: <TrendingDown className="h-8 w-8" />,
  HeartCrack: <HeartCrack className="h-8 w-8" />,
  Skull: <Skull className="h-8 w-8" />,
  Ban: <Ban className="h-8 w-8" />,
};

const AnalysisReportPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { language } = useLanguage();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

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
        // Expand first two categories by default
        if (data.report?.categories?.length > 0) {
          setExpandedCategories(data.report.categories.slice(0, 2).map((c: Category) => c.id));
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
    title: language === 'de' ? 'Analyse-Ergebnis' : 'Analysis Results',
    subtitle: language === 'de' ? 'Vollständiger Report für' : 'Complete Report for',
    scoreLabel: language === 'de' ? 'Gesamt-Score' : 'Overall Score',
    issuesFound: language === 'de' ? 'Probleme gefunden' : 'Issues Found',
    critical: language === 'de' ? 'Kritisch' : 'Critical',
    warnings: language === 'de' ? 'Warnungen' : 'Warnings',
    improvements: language === 'de' ? 'Verbesserungen' : 'Improvements',
    impactLabel: language === 'de' ? 'Auswirkung' : 'Impact',
    effortLabel: language === 'de' ? 'Aufwand' : 'Effort',
    hoursLabel: language === 'de' ? 'Stunden' : 'Hours',
    costLabel: language === 'de' ? 'Monatlicher Verlust' : 'Monthly Loss',
    effortLevels: {
      low: language === 'de' ? 'Gering' : 'Low',
      medium: language === 'de' ? 'Mittel' : 'Medium',
      high: language === 'de' ? 'Hoch' : 'High'
    },
    downloadPdf: language === 'de' ? 'Report als PDF' : 'Download PDF',
    costTimeTitle: language === 'de' ? 'Der wahre Preis des Nichtstuns' : 'The True Cost of Inaction',
    costTimeSubtitle: language === 'de' 
      ? 'Jeder Tag ohne Optimierung kostet Sie bares Geld. Hier ist die Rechnung:'
      : 'Every day without optimization costs you real money. Here\'s the calculation:',
    consequencesTitle: language === 'de' ? 'Was passiert, wenn Sie nichts tun?' : 'What happens if you do nothing?',
    consequencesSubtitle: language === 'de' 
      ? 'Die Konkurrenz schläft nicht. Ohne Optimierung verlieren Sie täglich:'
      : 'Your competition never sleeps. Without optimization, you\'re losing daily:',
    projectionTitle: language === 'de' ? 'Ihr Business: Vorher vs. Nachher' : 'Your Business: Before vs. After',
    projectionSubtitle: language === 'de' 
      ? 'Basierend auf unseren Analysen und Erfahrungswerten:'
      : 'Based on our analysis and experience:',
    finalCtaTitle: language === 'de' ? 'Sie haben zwei Optionen' : 'You have two options',
    option1Title: language === 'de' ? 'Selbst machen' : 'Do it yourself',
    option2Title: language === 'de' ? 'Wir machen alles für Sie' : 'We do everything for you',
    notFound: language === 'de' ? 'Report nicht gefunden' : 'Report not found',
    notFoundDesc: language === 'de' 
      ? 'Der angeforderte Analyse-Report existiert nicht oder ist abgelaufen.'
      : 'The requested analysis report does not exist or has expired.',
    startNew: language === 'de' ? 'Neue Analyse starten' : 'Start New Analysis',
  };

  const getSeverityIcon = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="text-xs">{content.critical}</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 text-xs">{content.warnings}</Badge>;
      case 'info':
        return <Badge variant="outline" className="text-xs">{content.improvements}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-destructive';
    if (score < 50) return 'text-yellow-500';
    if (score < 70) return 'text-orange-400';
    return 'text-green-500';
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
    doc.text(`Analysiert am ${new Date(report.created_at).toLocaleDateString('de-CH')}`, pageWidth / 2, 38, { align: 'center' });
    
    doc.setFontSize(48);
    doc.setTextColor(220, 38, 38);
    doc.text(`${report.overall_score}/100`, pageWidth / 2, 60, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Gesamt-Score', pageWidth / 2, 68, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`${report.total_issues} Verbesserungspunkte gefunden`, 20, 85);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`${report.critical_issues} Kritisch | ${report.warning_issues} Warnungen | ${report.info_issues} Verbesserungen`, 20, 92);
    
    doc.setFontSize(12);
    doc.setTextColor(220, 38, 38);
    doc.text(`Geschätzter monatlicher Verlust: CHF ${report.monthly_loss.toLocaleString()}`, 20, 105);
    doc.text(`Geschätzte Implementierungszeit: ${report.total_hours} Stunden`, 20, 112);
    
    let yPosition = 130;
    
    report.categories.forEach((category) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(`${category.name} (Score: ${category.score}/100)`, 20, yPosition);
      yPosition += 8;
      
      const tableData = category.issues.map(issue => [
        issue.severity === 'critical' ? '🔴' : issue.severity === 'warning' ? '🟡' : '🔵',
        issue.title,
        `${issue.hoursToFix}h`,
        `CHF ${issue.costIfIgnored}`
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['', 'Problem', 'Zeit', 'Verlust/Monat']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [220, 38, 38] },
        margin: { left: 20, right: 20 },
        styles: { fontSize: 9 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
    });
    
    doc.addPage();
    doc.setFontSize(20);
    doc.setTextColor(0);
    doc.text('Zusammenfassung', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Aktuelle geschätzte monatliche Einnahmen: CHF ${report.current_revenue.toLocaleString()}`, 20, 50);
    doc.setTextColor(34, 197, 94);
    doc.text(`Projizierte monatliche Einnahmen nach Optimierung: CHF ${report.projected_revenue.toLocaleString()}`, 20, 60);
    doc.setTextColor(0);
    doc.text(`Potenzielle Steigerung: +${Math.round((report.projected_revenue - report.current_revenue) / report.current_revenue * 100)}%`, 20, 70);
    
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text('Kontaktieren Sie uns für die Implementierung!', pageWidth / 2, 100, { align: 'center' });
    
    doc.save(`website-analyse-${report.site_name}.pdf`);
    toast.success(language === 'de' ? 'PDF wurde heruntergeladen!' : 'PDF downloaded!');
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <SEOHead title={content.title} description="Loading analysis report..." />
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

  return (
    <Layout>
      <SEOHead
        title={`${content.title} - ${report.site_name}`}
        description={`Vollständiger Website-Analyse-Report für ${report.site_name}`}
        canonical={`/analyse/${token}`}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-8">
              <p className="text-muted-foreground mb-2">{content.subtitle}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {report.site_name}
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'de' ? 'Analysiert am' : 'Analyzed on'} {new Date(report.created_at).toLocaleDateString('de-CH')}
              </p>
              <Button onClick={generatePDF} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                {content.downloadPdf}
              </Button>
            </div>
          </ScrollReveal>

          {/* Score Overview */}
          <ScrollReveal delay={0.1}>
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <Card className="md:col-span-1 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">{content.scoreLabel}</p>
                  <div className={`text-6xl font-bold ${getScoreColor(report.overall_score)}`}>
                    {report.overall_score}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">von 100</p>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{content.issuesFound}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-destructive/10">
                      <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                      <div className="text-3xl font-bold text-destructive">{report.critical_issues}</div>
                      <p className="text-sm text-muted-foreground">{content.critical}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-yellow-500/10">
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-yellow-500">{report.warning_issues}</div>
                      <p className="text-sm text-muted-foreground">{content.warnings}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-500/10">
                      <Info className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-blue-500">{report.info_issues}</div>
                      <p className="text-sm text-muted-foreground">{content.improvements}</p>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {report.total_issues} {language === 'de' ? 'Verbesserungspunkte insgesamt' : 'improvement points total'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>

          {/* Cost Section */}
          <ScrollReveal delay={0.15}>
            <Card className="mb-12 border-destructive/30 bg-gradient-to-br from-destructive/5 to-background">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-center flex items-center justify-center gap-3">
                  <Calculator className="h-8 w-8 text-destructive" />
                  {content.costTimeTitle}
                </CardTitle>
                <p className="text-center text-muted-foreground">{content.costTimeSubtitle}</p>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-6 rounded-xl bg-destructive/10 border border-destructive/20">
                    <Timer className="h-10 w-10 text-destructive mx-auto mb-3" />
                    <div className="text-4xl font-bold text-destructive mb-2">{report.total_hours}</div>
                    <p className="text-sm text-muted-foreground">{language === 'de' ? 'Arbeitsstunden benötigt' : 'Work hours needed'}</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <Coins className="h-10 w-10 text-yellow-600 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-yellow-600 mb-2">CHF {(report.total_hours * report.hourly_rate).toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">{language === 'de' ? `DIY-Kosten (à CHF ${report.hourly_rate}/h)` : `DIY cost (at CHF ${report.hourly_rate}/h)`}</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <Clock className="h-10 w-10 text-orange-500 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-orange-500 mb-2">{Math.ceil(report.total_hours / 40)}</div>
                    <p className="text-sm text-muted-foreground">{language === 'de' ? 'Wochen Vollzeit-Arbeit' : 'Weeks of full-time work'}</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-red-600/10 border border-red-600/20">
                    <CircleDollarSign className="h-10 w-10 text-red-600 mx-auto mb-3" />
                    <div className="text-4xl font-bold text-red-600 mb-2">CHF {report.monthly_loss.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">{language === 'de' ? 'Monatlicher Verlust ohne Änderung' : 'Monthly loss without change'}</p>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-xl bg-muted/50 border">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    {language === 'de' ? 'Die harte Wahrheit' : 'The hard truth'}
                  </h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      {language === 'de' 
                        ? 'Diese Probleme verschwinden nicht von alleine. Sie werden schlimmer.'
                        : 'These problems don\'t go away on their own. They get worse.'}
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      {language === 'de' 
                        ? 'Jeder Tag Verzögerung = verlorene Kunden an die Konkurrenz.'
                        : 'Every day of delay = lost customers to competitors.'}
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      {language === 'de' 
                        ? `In 12 Monaten ohne Änderung: CHF ${(report.monthly_loss * 12).toLocaleString()} verloren.`
                        : `In 12 months without change: CHF ${(report.monthly_loss * 12).toLocaleString()} lost.`}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Consequences */}
          {report.consequences && report.consequences.length > 0 && (
            <ScrollReveal delay={0.2}>
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">{content.consequencesTitle}</h2>
                <p className="text-center text-muted-foreground mb-8">{content.consequencesSubtitle}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {report.consequences.map((item, index) => (
                    <Card key={index} className="border-destructive/20 hover:border-destructive/40 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-destructive/10 text-destructive flex-shrink-0">
                            {iconMap[item.iconName] || <AlertTriangle className="h-8 w-8" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive font-bold">
                              <TrendingDown className="h-4 w-4" />
                              {item.loss}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 p-6 rounded-2xl bg-destructive/10 border border-destructive/30 text-center">
                  <Skull className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    {language === 'de' ? 'Gesamter geschätzter Verlust' : 'Total Estimated Loss'}
                  </h3>
                  <div className="text-5xl font-bold text-destructive mb-2">
                    CHF {report.monthly_loss.toLocaleString()}/Monat
                  </div>
                  <p className="text-muted-foreground">
                    = CHF {(report.monthly_loss * 12).toLocaleString()} {language === 'de' ? 'pro Jahr' : 'per year'}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Business Projection */}
          <ScrollReveal delay={0.25}>
            <Card className="mb-12 border-green-500/30 bg-gradient-to-br from-green-500/5 to-background">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-center flex items-center justify-center gap-3">
                  <Rocket className="h-8 w-8 text-green-500" />
                  {content.projectionTitle}
                </CardTitle>
                <p className="text-center text-muted-foreground">{content.projectionSubtitle}</p>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Before */}
                  <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-destructive/10">
                        <TrendingDown className="h-6 w-6 text-destructive" />
                      </div>
                      <h3 className="text-xl font-bold">{language === 'de' ? 'JETZT (ohne Optimierung)' : 'NOW (without optimization)'}</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">{language === 'de' ? 'Umsatz/Monat' : 'Revenue/Month'}</span>
                        <span className="font-bold">CHF {report.current_revenue.toLocaleString()}</span>
                      </li>
                      <li className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                        <span className="text-destructive font-medium">{language === 'de' ? 'Google-Ranking' : 'Google Ranking'}</span>
                        <span className="font-bold text-destructive">{language === 'de' ? 'Seite 3-5' : 'Page 3-5'}</span>
                      </li>
                    </ul>
                  </div>

                  {/* After */}
                  <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-green-500/10">
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold">{language === 'de' ? 'NACHHER (mit Optimierung)' : 'AFTER (with optimization)'}</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <span className="text-muted-foreground">{language === 'de' ? 'Umsatz/Monat' : 'Revenue/Month'}</span>
                        <span className="font-bold text-green-500">
                          CHF {report.projected_revenue.toLocaleString()} 
                          <span className="text-xs ml-1">(+{Math.round((report.projected_revenue - report.current_revenue) / report.current_revenue * 100)}%)</span>
                        </span>
                      </li>
                      <li className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                        <span className="text-green-600 font-medium">{language === 'de' ? 'Google-Ranking' : 'Google Ranking'}</span>
                        <span className="font-bold text-green-500">Top 3</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-green-500/10 border border-green-500/30 text-center">
                  <Sparkles className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    {language === 'de' ? 'Potenzielle Umsatzsteigerung' : 'Potential Revenue Increase'}
                  </h3>
                  <div className="text-5xl font-bold text-green-500 mb-2">
                    +CHF {(report.projected_revenue - report.current_revenue).toLocaleString()}/Monat
                  </div>
                  <p className="text-muted-foreground">
                    = +CHF {((report.projected_revenue - report.current_revenue) * 12).toLocaleString()} {language === 'de' ? 'pro Jahr' : 'per year'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Category Scores */}
          <ScrollReveal delay={0.3}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {report.categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        const element = document.getElementById(`category-${category.id}`);
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}>
                  <CardContent className="p-4 text-center">
                    <div className={`${category.color} mb-2 flex justify-center`}>
                      {iconMap[category.iconName] || <Search className="h-5 w-5" />}
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                      {category.score}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{category.name}</p>
                    <div className="mt-2">
                      <Progress value={category.score} className="h-1" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {category.issues.length} {language === 'de' ? 'Probleme' : 'Issues'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>

          {/* Detailed Issues */}
          <ScrollReveal delay={0.35}>
            <div className="space-y-6 mb-16">
              {report.categories.map((category) => (
                <Card key={category.id} id={`category-${category.id}`}>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => setExpandedCategories(prev => 
                                prev.includes(category.id) 
                                  ? prev.filter(id => id !== category.id)
                                  : [...prev, category.id]
                              )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-muted ${category.color}`}>
                          {iconMap[category.iconName] || <Search className="h-5 w-5" />}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {category.issues.filter(i => i.severity === 'critical').length} kritisch, {' '}
                            {category.issues.filter(i => i.severity === 'warning').length} Warnungen, {' '}
                            {category.issues.filter(i => i.severity === 'info').length} Verbesserungen
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <span className="text-sm text-muted-foreground">
                            {category.issues.reduce((sum, i) => sum + i.hoursToFix, 0)}h | CHF {category.issues.reduce((sum, i) => sum + i.costIfIgnored, 0).toLocaleString()}/Mo
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                            {category.score}/100
                          </span>
                        </div>
                        {expandedCategories.includes(category.id) 
                          ? <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          : <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        }
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedCategories.includes(category.id) && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {category.issues.map((issue) => (
                          <div 
                            key={issue.id} 
                            className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="mt-1">
                              {getSeverityIcon(issue.severity)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-medium">{issue.title}</h4>
                                {getSeverityBadge(issue.severity)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                              <div className="flex flex-wrap gap-4 text-xs">
                                <span className="text-muted-foreground">
                                  <strong>{content.impactLabel}:</strong> {issue.impact}
                                </span>
                                <span className="text-muted-foreground">
                                  <strong>{content.effortLabel}:</strong> {content.effortLevels[issue.effort]}
                                </span>
                                <span className="text-orange-500 font-medium">
                                  <strong>{content.hoursLabel}:</strong> {issue.hoursToFix}h
                                </span>
                                <span className="text-destructive font-medium">
                                  <strong>{content.costLabel}:</strong> CHF {issue.costIfIgnored}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </ScrollReveal>

          {/* Final CTA */}
          <ScrollReveal delay={0.4}>
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{content.finalCtaTitle}</h2>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Option 1: DIY */}
                <Card className="border-muted hover:border-muted-foreground/30 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-muted" />
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-center">{content.option1Title}</h3>
                    
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="h-5 w-5 flex-shrink-0" />
                        <span>{report.total_hours} {language === 'de' ? 'Stunden Arbeit' : 'hours of work'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-muted-foreground">
                        <DollarSign className="h-5 w-5 flex-shrink-0" />
                        <span>CHF {(report.total_hours * report.hourly_rate).toLocaleString()} {language === 'de' ? 'Opportunitätskosten' : 'opportunity cost'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-muted-foreground">
                        <Timer className="h-5 w-5 flex-shrink-0" />
                        <span>{Math.ceil(report.total_hours / 40)}+ {language === 'de' ? 'Wochen Vollzeit' : 'weeks full-time'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-muted-foreground">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                        <span>{language === 'de' ? 'Lernkurve & Fehlerrisiko' : 'Learning curve & error risk'}</span>
                      </li>
                      <li className="flex items-center gap-3 text-muted-foreground">
                        <Ban className="h-5 w-5 flex-shrink-0" />
                        <span>{language === 'de' ? 'Keine Garantie' : 'No guarantee'}</span>
                      </li>
                    </ul>

                    <Button variant="outline" className="w-full" size="lg" onClick={generatePDF}>
                      <Download className="mr-2 h-5 w-5" />
                      {language === 'de' ? 'Report herunterladen & selbst starten' : 'Download report & start yourself'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Option 2: Done for you */}
                <Card className="border-primary/50 hover:border-primary transition-colors relative overflow-hidden shadow-lg shadow-primary/10">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-green-500" />
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Crown className="h-3 w-3 mr-1" />
                      {language === 'de' ? 'Empfohlen' : 'Recommended'}
                    </Badge>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-center">{content.option2Title}</h3>
                    
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{language === 'de' ? 'Alles in 2-4 Wochen erledigt' : 'Everything done in 2-4 weeks'}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{language === 'de' ? 'Experten-Implementierung' : 'Expert implementation'}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{language === 'de' ? 'Keine Fehler, keine Lernkurve' : 'No errors, no learning curve'}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{language === 'de' ? 'Garantierte Resultate' : 'Guaranteed results'}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{language === 'de' ? 'Laufende Optimierung inkl.' : 'Ongoing optimization incl.'}</span>
                      </li>
                    </ul>

                    <CTAButton size="lg" href="/call" className="w-full text-lg">
                      <Target className="mr-2 h-5 w-5" />
                      {language === 'de' ? 'Kostenloses Beratungsgespräch' : 'Free consultation call'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </CTAButton>
                    
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {language === 'de' ? '15 Min. Gespräch • Unverbindlich • Individuelles Angebot' : '15 min call • No obligation • Custom quote'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <p className="text-center text-muted-foreground mt-8 max-w-2xl mx-auto">
                {language === 'de' 
                  ? `Die Frage ist nicht OB Sie optimieren sollten — die Analyse zeigt klar, dass Sie müssen. Die Frage ist nur: Wie lange können Sie es sich leisten, CHF ${report.monthly_loss.toLocaleString()} pro Monat zu verlieren?`
                  : `The question is not IF you should optimize — the analysis clearly shows you must. The question is: How long can you afford to lose CHF ${report.monthly_loss.toLocaleString()} per month?`}
              </p>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </Layout>
  );
};

export default AnalysisReportPage;
