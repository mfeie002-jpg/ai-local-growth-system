import { useEffect, useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Loader2, 
  LogOut, 
  FileText,
  Filter,
  ChevronDown,
  RefreshCw,
  Search,
  Download,
  Copy,
  Check,
  Eye,
  EyeOff,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
}

const scoreColors = (score: number) => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export default function AdminReportsPage() {
  const { isAdmin, isLoading: authLoading, signOut } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('analysis_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (viewFilter === 'viewed') {
        query = query.not('viewed_at', 'is', null);
      } else if (viewFilter === 'not_viewed') {
        query = query.is('viewed_at', null);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reports:', error);
        toast.error('Fehler beim Laden der Reports');
      } else {
        setReports(data || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchReports();
    }
  }, [isAdmin, viewFilter]);

  // Filter reports by search query
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;
    
    const query = searchQuery.toLowerCase();
    return reports.filter(report => 
      report.site_name.toLowerCase().includes(query)
    );
  }, [reports, searchQuery]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const total = reports.length;
    const viewed = reports.filter(r => r.viewed_at).length;
    const viewRate = total > 0 ? Math.round((viewed / total) * 100) : 0;
    const avgScore = total > 0 ? Math.round(reports.reduce((sum, r) => sum + r.overall_score, 0) / total) : 0;
    const totalMonthlyLoss = reports.reduce((sum, r) => sum + r.monthly_loss, 0);
    const totalCriticalIssues = reports.reduce((sum, r) => sum + r.critical_issues, 0);
    
    // Reports from last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentReports = reports.filter(r => new Date(r.created_at) > weekAgo).length;

    return { total, viewed, viewRate, avgScore, totalMonthlyLoss, totalCriticalIssues, recentReports };
  }, [reports]);

  // Export to CSV
  const exportCSV = () => {
    const headers = ['Datum', 'Website', 'Score', 'Kritisch', 'Warnung', 'Info', 'Monatl. Verlust', 'Angesehen'];
    const rows = filteredReports.map(report => [
      format(new Date(report.created_at), 'yyyy-MM-dd HH:mm'),
      report.site_name,
      report.overall_score,
      report.critical_issues,
      report.warning_issues,
      report.info_issues,
      report.monthly_loss,
      report.viewed_at ? 'Ja' : 'Nein',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reports-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success(`${filteredReports.length} Reports exportiert`);
  };

  // Copy report link
  const copyReportLink = async (token: string) => {
    const url = `https://itsfeierabend.ch/analyse/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Link kopiert');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-primary font-bold">its</span>
                <span className="font-bold text-foreground">Feierabend</span>
                <span className="text-primary font-bold">.ch</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="font-semibold">Admin</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/admin/leads">
                <Button variant="ghost" size="sm">Leads</Button>
              </Link>
              <Link to="/admin/calls">
                <Button variant="ghost" size="sm">Calls</Button>
              </Link>
              <Button variant="outline" onClick={signOut} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-xs">Gesamt</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.total}</p>
          </div>
          
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Letzte 7 Tage</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.recentReports}</p>
          </div>
          
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs">View-Rate</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.viewRate}%</p>
            <p className="text-xs text-muted-foreground">{kpis.viewed} angesehen</p>
          </div>
          
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs">Ø Score</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.avgScore}</p>
          </div>
          
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-xs">Kritische Issues</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{kpis.totalCriticalIssues}</p>
          </div>
          
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs">Potenzial/Monat</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              CHF {kpis.totalMonthlyLoss.toLocaleString('de-CH')}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">
              {filteredReports.length} Report{filteredReports.length !== 1 ? 's' : ''} gefunden
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Website suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>

            <Select value={viewFilter} onValueChange={setViewFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Ansicht" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="viewed">Angesehen</SelectItem>
                <SelectItem value="not_viewed">Nicht angesehen</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={fetchReports} disabled={isLoading}>
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>

            <Button variant="outline" onClick={exportCSV} disabled={filteredReports.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-background border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Keine Reports gefunden.</p>
          </div>
        ) : (
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Datum</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Website</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Score</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Issues</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Potenzial/Monat</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Angesehen</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(report.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {report.site_name}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn('font-bold text-sm', scoreColors(report.overall_score))}>
                          {report.overall_score}/100
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {report.critical_issues > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {report.critical_issues} kritisch
                            </Badge>
                          )}
                          {report.warning_issues > 0 && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              {report.warning_issues} Warnung
                            </Badge>
                          )}
                          {report.info_issues > 0 && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              {report.info_issues} Info
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        CHF {report.monthly_loss.toLocaleString('de-CH')}
                      </td>
                      <td className="px-4 py-3">
                        {report.viewed_at ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <Eye className="w-4 h-4" />
                            <span className="text-xs">
                              {format(new Date(report.viewed_at), 'dd.MM. HH:mm', { locale: de })}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <EyeOff className="w-4 h-4" />
                            <span className="text-xs">Nein</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => copyReportLink(report.token)}
                          >
                            {copiedId === report.token ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                          <a 
                            href={`/analyse/${report.token}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="sm">
                              Öffnen
                              <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                            </Button>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
