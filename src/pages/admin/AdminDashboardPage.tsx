import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Loader2, 
  Users, 
  Phone, 
  FileText,
  TrendingUp,
  Eye,
  Target,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import FunnelOverview from '@/components/admin/FunnelOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { NoIndex } from '@/components/NoIndex';

interface DashboardStats {
  totalLeads: number;
  recentLeads: number;
  totalCalls: number;
  recentCalls: number;
  totalReports: number;
  viewedReports: number;
  viewRate: number;
  callbacksFromReports: number;
  conversionRate: number;
}

interface RecentLead {
  id: string;
  name: string;
  email: string;
  lead_type: string;
  status: string;
  created_at: string;
}

interface RecentCall {
  id: string;
  direction: string;
  from_number: string;
  status: string;
  duration_ms: number;
  created_at: string;
}

export default function AdminDashboardPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [leadsRes, callsRes, reportsRes, callbacksRes] = await Promise.all([
        supabase.from('leads').select('id, name, email, lead_type, status, created_at').order('created_at', { ascending: false }),
        supabase.from('calls').select('id, direction, from_number, status, duration_ms, created_at').order('created_at', { ascending: false }),
        supabase.from('analysis_reports').select('id, token, viewed_at, created_at'),
        supabase.from('callback_requests').select('id, report_token')
      ]);

      const leads = leadsRes.data || [];
      const calls = callsRes.data || [];
      const reports = reportsRes.data || [];
      const callbacks = callbacksRes.data || [];

      // Calculate stats
      const recentLeadsCount = leads.filter(l => new Date(l.created_at) > weekAgo).length;
      const recentCallsCount = calls.filter(c => new Date(c.created_at) > weekAgo).length;
      const viewedReports = reports.filter(r => r.viewed_at).length;
      const viewRate = reports.length > 0 ? Math.round((viewedReports / reports.length) * 100) : 0;
      
      const reportTokens = new Set(reports.map(r => r.token));
      const callbacksFromReports = callbacks.filter(c => c.report_token && reportTokens.has(c.report_token)).length;
      const conversionRate = viewedReports > 0 ? Math.round((callbacksFromReports / viewedReports) * 100) : 0;

      setStats({
        totalLeads: leads.length,
        recentLeads: recentLeadsCount,
        totalCalls: calls.length,
        recentCalls: recentCallsCount,
        totalReports: reports.length,
        viewedReports,
        viewRate,
        callbacksFromReports,
        conversionRate
      });

      setRecentLeads(leads.slice(0, 5));
      setRecentCalls(calls.slice(0, 5));

      // Build chart data (last 14 days)
      const today = startOfDay(new Date());
      const fourteenDaysAgo = subDays(today, 13);
      const days = eachDayOfInterval({ start: fourteenDaysAgo, end: today });

      const chartDataArr = days.map(day => {
        const dayStart = startOfDay(day);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const dayLeads = leads.filter(l => {
          const date = new Date(l.created_at);
          return date >= dayStart && date < dayEnd;
        }).length;

        const dayCalls = calls.filter(c => {
          const date = new Date(c.created_at);
          return date >= dayStart && date < dayEnd;
        }).length;

        const dayReports = reports.filter(r => {
          const date = new Date(r.created_at);
          return date >= dayStart && date < dayEnd;
        }).length;

        return {
          date: format(day, 'dd.MM', { locale: de }),
          leads: dayLeads,
          calls: dayCalls,
          reports: dayReports
        };
      });

      setChartData(chartDataArr);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return '-';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    reviewing: 'bg-yellow-100 text-yellow-800',
    scored: 'bg-purple-100 text-purple-800',
    contacted: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
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

  if (isLoading || !stats) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard" subtitle="Übersicht aller wichtigen Kennzahlen">
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="funnels">Funnels & Traffic</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads gesamt</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalLeads}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+{stats.recentLeads}</span> diese Woche
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Calls gesamt</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalCalls}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+{stats.recentCalls}</span> diese Woche
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reports</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalReports}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-primary">{stats.viewedReports}</span> angesehen
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">View-Rate</p>
                <p className="text-3xl font-bold text-foreground">{stats.viewRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Report Views
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion</p>
                <p className="text-3xl font-bold text-foreground">{stats.conversionRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  View → Callback
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Aktivität der letzten 14 Tage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(271, 91%, 65%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(271, 91%, 65%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="leads" name="Leads" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="calls" name="Calls" stroke="hsl(221, 83%, 53%)" fillOpacity={1} fill="url(#colorCalls)" />
                <Area type="monotone" dataKey="reports" name="Reports" stroke="hsl(271, 91%, 65%)" fillOpacity={1} fill="url(#colorReports)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Neueste Leads
            </CardTitle>
            <Link to="/admin/leads">
              <Button variant="ghost" size="sm">
                Alle anzeigen
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <Link 
                  key={lead.id} 
                  to={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{lead.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={statusColors[lead.status] || 'bg-gray-100'}>
                      {lead.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(lead.created_at), 'dd.MM.', { locale: de })}
                    </span>
                  </div>
                </Link>
              ))}
              {recentLeads.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Keine Leads vorhanden</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Calls */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Neueste Calls
            </CardTitle>
            <Link to="/admin/calls">
              <Button variant="ghost" size="sm">
                Alle anzeigen
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCalls.map((call) => (
                <Link 
                  key={call.id} 
                  to={`/admin/calls/${call.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${call.direction === 'inbound' ? 'bg-green-100' : 'bg-blue-100'}`}>
                      <Phone className={`w-4 h-4 ${call.direction === 'inbound' ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{call.from_number || 'Unbekannt'}</p>
                      <p className="text-sm text-muted-foreground">{call.direction}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{formatDuration(call.duration_ms)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(call.created_at), 'dd.MM.', { locale: de })}
                    </span>
                  </div>
                </Link>
              ))}
              {recentCalls.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Keine Calls vorhanden</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>
        
        <TabsContent value="funnels" className="mt-6">
          <FunnelOverview />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
