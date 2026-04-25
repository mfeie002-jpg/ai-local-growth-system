import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Loader2, 
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle,
  AlertCircle,
  Info,
  ExternalLink,
  TrendingUp,
  Clock,
  FileText,
  DollarSign,
  Target,
  Zap,
  Shield,
  Smartphone,
  Users,
  MapPin,
  Search,
  Code,
  Share2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { scoreTextColors } from '@/lib/admin-constants';
import { NoIndex } from '@/components/NoIndex';

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

interface TopFix {
  rank: number;
  title: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'S' | 'M' | 'L';
  days_to_live: string;
  why_important: string;
  if_not_done: string;
}

interface TopLeak {
  id: string;
  title: string;
  description: string;
  estimated_loss: number;
}

interface CostLeak {
  id: string;
  title: string;
  consequence: string;
  monthly_loss: number;
  icon: string;
}

interface Report {
  id: string;
  created_at: string;
  site_name: string;
  token: string;
  overall_score: number;
  total_issues: number;
  critical_issues: number;
  warning_issues: number;
  info_issues: number;
  monthly_loss: number;
  current_revenue: number;
  projected_revenue: number;
  total_hours: number;
  hourly_rate: number;
  viewed_at: string | null;
  lead_id: string | null;
  categories: {
    score_bucket?: 'red' | 'yellow' | 'green';
    top_3_leaks?: TopLeak[];
    top_10_fixes?: TopFix[];
    backlog_categories?: BacklogCategory[];
    cost_of_inaction?: {
      leaks?: CostLeak[];
      total_monthly_loss?: number;
    };
  };
  consequences: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
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
  Share2,
  AlertTriangle,
  DollarSign,
  Target,
  Clock
};


const severityConfig = {
  critical: { color: 'bg-destructive text-destructive-foreground', icon: AlertTriangle, label: 'Kritisch' },
  warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Warnung' },
  info: { color: 'bg-blue-100 text-blue-800', icon: Info, label: 'Info' }
};

export default function AdminReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id || !isAdmin) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('analysis_reports')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching report:', error);
          toast.error('Fehler beim Laden des Reports');
        } else if (data) {
          // Cast the JSON fields properly
          setReport({
            ...data,
            categories: (data.categories as Report['categories']) || {},
            consequences: (data.consequences as Report['consequences']) || []
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [id, isAdmin]);

  const copyReportLink = async () => {
    if (!report) return;
    const url = `https://itsfeierabend.ch/analyse/${report.token}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link kopiert');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!report) {
    return (
      <AdminLayout title="Report nicht gefunden">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Report nicht gefunden.</p>
            <Link to="/admin/reports">
              <Button variant="outline">Zurück zu Reports</Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const categories = report.categories || {};
  const topLeaks = categories.top_3_leaks || [];
  const topFixes = categories.top_10_fixes || [];
  const backlogCategories = categories.backlog_categories || [];
  const costOfInaction = categories.cost_of_inaction || { leaks: [], total_monthly_loss: 0 };

  return (
    <AdminLayout 
      title={report.site_name}
      subtitle={`Report vom ${format(new Date(report.created_at), "dd. MMMM yyyy", { locale: de })}`}
      breadcrumbs={[
        { label: 'Reports', href: '/admin/reports' },
        { label: report.site_name }
      ]}
    >
      {/* Action buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={copyReportLink}>
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          Link kopieren
        </Button>
        <a href={`/analyse/${report.token}`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Report öffnen
          </Button>
        </a>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Target className="w-4 h-4" />
                <span className="text-xs">Score</span>
              </div>
              <p className={cn("text-3xl font-bold", scoreTextColors(report.overall_score))}>
                {report.overall_score}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-xs">Issues</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{report.total_issues}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-xs">Kritisch</span>
              </div>
              <p className="text-2xl font-bold text-destructive">{report.critical_issues}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Stunden</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{report.total_hours}h</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-xs">Potenzial/Mo</span>
              </div>
              <p className="text-xl font-bold text-green-600">
                CHF {report.monthly_loss.toLocaleString('de-CH')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                {report.viewed_at ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4" />}
                <span className="text-xs">Angesehen</span>
              </div>
              {report.viewed_at ? (
                <p className="text-sm font-medium text-green-600">
                  {format(new Date(report.viewed_at), 'dd.MM. HH:mm', { locale: de })}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Nein</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top 3 Leaks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-destructive" />
                Top 3 Leaks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topLeaks.length > 0 ? topLeaks.map((leak, index) => (
                <div key={leak.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono">#{index + 1}</Badge>
                        <span className="font-medium">{leak.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{leak.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-destructive">
                        CHF {leak.estimated_loss.toLocaleString('de-CH')}
                      </p>
                      <p className="text-xs text-muted-foreground">/Monat</p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground text-sm">Keine Leaks gefunden</p>
              )}
            </CardContent>
          </Card>

          {/* Top 10 Fixes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Top 10 Fixes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {topFixes.length > 0 ? topFixes.map((fix) => (
                  <div key={fix.rank} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Badge variant="outline" className="font-mono shrink-0">#{fix.rank}</Badge>
                      <span className="text-sm truncate">{fix.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={cn(
                        "text-xs",
                        fix.impact === 'high' ? 'bg-destructive/20 text-destructive' :
                        fix.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {fix.impact}
                      </Badge>
                      <Badge variant="secondary" className="font-mono text-xs">{fix.effort}</Badge>
                    </div>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-sm">Keine Fixes gefunden</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backlog Categories */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Vollständiger Backlog ({report.total_issues} Issues)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {backlogCategories.length > 0 ? (
              <Accordion type="multiple" className="w-full">
                {backlogCategories.map((category) => {
                  const IconComponent = iconMap[category.id] || FileText;
                  return (
                    <AccordionItem key={category.id} value={category.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{category.name}</span>
                          <div className="flex items-center gap-2 ml-auto mr-4">
                            <Badge variant="outline">{category.total_issues} Issues</Badge>
                            {category.critical_issues > 0 && (
                              <Badge variant="destructive">{category.critical_issues} kritisch</Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-11">
                          {category.issues.map((issue, idx) => {
                            const config = severityConfig[issue.severity];
                            const SeverityIcon = config.icon;
                            return (
                              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                                <div className="flex items-center gap-3 flex-1">
                                  <Badge className={cn("text-xs", config.color)}>
                                    <SeverityIcon className="w-3 h-3 mr-1" />
                                    {config.label}
                                  </Badge>
                                  <span className="text-sm">{issue.title}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{issue.hours_to_fix}h</span>
                                  <span className="text-destructive font-medium">
                                    CHF {issue.monthly_loss}/Mo
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <p className="text-muted-foreground text-sm">Keine Backlog-Kategorien gefunden</p>
            )}
          </CardContent>
        </Card>

        {/* Cost of Inaction */}
        {costOfInaction.leaks && costOfInaction.leaks.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-destructive" />
                Kosten der Untätigkeit
                <Badge variant="destructive" className="ml-auto">
                  CHF {(costOfInaction.total_monthly_loss || 0).toLocaleString('de-CH')}/Monat
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {costOfInaction.leaks.map((leak) => {
                  const IconComponent = iconMap[leak.icon] || DollarSign;
                  return (
                    <div key={leak.id} className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                          <IconComponent className="w-5 h-5 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{leak.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{leak.consequence}</p>
                          <p className="text-lg font-bold text-destructive mt-2">
                            CHF {leak.monthly_loss.toLocaleString('de-CH')}/Mo
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meta Info */}
        <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Erstellt:</span>{' '}
              {format(new Date(report.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
            </div>
            <div>
              <span className="font-medium">Token:</span>{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{report.token}</code>
            </div>
            {report.lead_id && (
              <div>
                <span className="font-medium">Lead:</span>{' '}
                <Link to={`/admin/leads/${report.lead_id}`} className="text-primary hover:underline">
                  Details ansehen
                </Link>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }
