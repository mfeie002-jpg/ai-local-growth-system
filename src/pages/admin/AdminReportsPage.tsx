import { useEffect, useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Loader2, 
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
  Clock,
  Calendar,
  PhoneCall,
  Target,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, FunnelChart, Funnel, LabelList, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { scoreColors } from '@/lib/admin-constants';
import { NoIndex } from '@/components/NoIndex';

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

export default function AdminReportsPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [callbackRequests, setCallbackRequests] = useState<Array<{ id: string; report_token: string | null; lead_id: string | null }>>([]);
  const [leads, setLeads] = useState<Array<{ id: string; status: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch reports
      let reportsQuery = supabase
        .from('analysis_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (viewFilter === 'viewed') {
        reportsQuery = reportsQuery.not('viewed_at', 'is', null);
      } else if (viewFilter === 'not_viewed') {
        reportsQuery = reportsQuery.is('viewed_at', null);
      }

      // Fetch callback requests for conversion tracking
      const callbackQuery = supabase
        .from('callback_requests')
        .select('id, report_token, lead_id');

      // Fetch leads for conversion tracking
      const leadsQuery = supabase
        .from('leads')
        .select('id, status');

      const [reportsResult, callbackResult, leadsResult] = await Promise.all([
        reportsQuery,
        callbackQuery,
        leadsQuery
      ]);

      if (reportsResult.error) {
        console.error('Error fetching reports:', reportsResult.error);
        toast.error('Fehler beim Laden der Reports');
      } else {
        setReports(reportsResult.data || []);
      }

      if (!callbackResult.error) {
        setCallbackRequests(callbackResult.data || []);
      }

      if (!leadsResult.error) {
        setLeads(leadsResult.data || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReports = fetchData;

  useEffect(() => {
    if (isAdmin) {
      fetchData();
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

  // Calculate KPIs including conversion tracking
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

    // Conversion tracking: Reports that led to callback requests
    const reportsWithCallbacks = reports.filter(r => 
      callbackRequests.some(cb => cb.report_token === r.token)
    ).length;
    
    // Conversion rate: viewed reports that converted to callbacks
    const conversionRate = viewed > 0 ? Math.round((reportsWithCallbacks / viewed) * 100) : 0;

    // Leads that converted (status = 'qualified', 'converted', 'won')
    const convertedStatuses = ['qualified', 'converted', 'won'];
    const convertedLeadIds = new Set(leads.filter(l => convertedStatuses.includes(l.status)).map(l => l.id));
    const reportsWithConvertedLeads = reports.filter(r => r.lead_id && convertedLeadIds.has(r.lead_id)).length;
    const leadConversionRate = total > 0 ? Math.round((reportsWithConvertedLeads / total) * 100) : 0;

    return { 
      total, 
      viewed, 
      viewRate, 
      avgScore, 
      totalMonthlyLoss, 
      totalCriticalIssues, 
      recentReports,
      reportsWithCallbacks,
      conversionRate,
      reportsWithConvertedLeads,
      leadConversionRate
    };
  }, [reports, callbackRequests, leads]);

  // Funnel data for visualization
  const funnelData = useMemo(() => {
    return [
      { 
        name: 'Reports erstellt', 
        value: kpis.total, 
        fill: 'hsl(var(--primary))',
        percentage: 100
      },
      { 
        name: 'Angesehen', 
        value: kpis.viewed, 
        fill: 'hsl(var(--chart-2))',
        percentage: kpis.viewRate
      },
      { 
        name: 'Callback angefordert', 
        value: kpis.reportsWithCallbacks, 
        fill: 'hsl(var(--chart-3))',
        percentage: kpis.total > 0 ? Math.round((kpis.reportsWithCallbacks / kpis.total) * 100) : 0
      },
      { 
        name: 'Lead konvertiert', 
        value: kpis.reportsWithConvertedLeads, 
        fill: 'hsl(var(--chart-4))',
        percentage: kpis.leadConversionRate
      },
    ];
  }, [kpis]);

  // Calculate chart data (last 30 days, daily)
  const chartData = useMemo(() => {
    const today = startOfDay(new Date());
    const thirtyDaysAgo = subDays(today, 29);
    
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
    
    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      
      const dayReports = reports.filter(r => {
        const reportDate = new Date(r.created_at);
        return reportDate >= dayStart && reportDate < dayEnd;
      });
      
      const viewedReports = dayReports.filter(r => r.viewed_at);
      
      return {
        date: format(day, 'dd.MM', { locale: de }),
        fullDate: format(day, 'dd.MM.yyyy', { locale: de }),
        reports: dayReports.length,
        viewed: viewedReports.length,
        avgScore: dayReports.length > 0 
          ? Math.round(dayReports.reduce((sum, r) => sum + r.overall_score, 0) / dayReports.length) 
          : 0
      };
    });
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
    <AdminLayout title="Reports" subtitle={`${filteredReports.length} Report${filteredReports.length !== 1 ? 's' : ''} gefunden`}>
      <NoIndex />
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
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
            <p className="text-xl font-bold text-green-600">
              CHF {kpis.totalMonthlyLoss.toLocaleString('de-CH')}
            </p>
          </div>
          
          {/* Conversion Tracking KPIs */}
          <div className="bg-background rounded-lg border border-primary/30 p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <PhoneCall className="w-4 h-4 text-primary" />
              <span className="text-xs">Callbacks</span>
            </div>
            <p className="text-2xl font-bold text-primary">{kpis.reportsWithCallbacks}</p>
            <p className="text-xs text-muted-foreground">aus Reports</p>
          </div>
          
          <div className="bg-background rounded-lg border border-primary/30 p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs">Conversion</span>
            </div>
            <p className="text-2xl font-bold text-primary">{kpis.conversionRate}%</p>
            <p className="text-xs text-muted-foreground">View → Callback</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Funnel Chart */}
          <div className="bg-background rounded-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Conversion Funnel</h2>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${value} (${props.payload.percentage}%)`,
                      name
                    ]}
                  />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                  >
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList 
                      position="center" 
                      fill="hsl(var(--foreground))"
                      stroke="none"
                      dataKey="name"
                      formatter={(value: string) => value}
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {funnelData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-sm" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-muted-foreground text-xs">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground text-xs">
                    {item.value} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart: Reports over time */}
          <div className="bg-background rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Reports der letzten 30 Tage</h2>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Erstellt</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Angesehen</span>
                </div>
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }} 
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }} 
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.fullDate;
                      }
                      return label;
                    }}
                  />
                  <Bar dataKey="reports" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Reports erstellt" />
                  <Bar dataKey="viewed" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Angesehen" />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
                          <Link to={`/admin/reports/${report.id}`}>
                            <Button variant="ghost" size="sm">
                              Details
                              <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                            </Button>
                          </Link>
                          <a 
                            href={`/analyse/${report.token}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="sm">
                              Öffnen
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
    </AdminLayout>
  );
}
