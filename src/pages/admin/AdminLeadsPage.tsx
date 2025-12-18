import { useEffect, useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Loader2, 
  LogOut, 
  Mail, 
  Phone, 
  FileText, 
  PhoneCall,
  Filter,
  ChevronDown,
  RefreshCw,
  Search,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Lead {
  id: string;
  created_at: string;
  lead_type: string;
  name: string;
  email: string;
  phone: string | null;
  industry: string;
  service_area: string;
  status: string;
  public_token: string | null;
  pre_score_total: number | null;
  pre_score_bucket: string | null;
  is_duplicate: boolean | null;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  scored: 'bg-purple-100 text-purple-800',
  contacted: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  new: 'Neu',
  reviewing: 'In Bearbeitung',
  scored: 'Bewertet',
  contacted: 'Kontaktiert',
  closed: 'Abgeschlossen',
};

const bucketColors: Record<string, string> = {
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
};

export default function AdminLeadsPage() {
  const { isAdmin, isLoading: authLoading, signOut } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('id, created_at, lead_type, name, email, phone, industry, service_area, status, public_token, pre_score_total, pre_score_bucket, is_duplicate')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.eq('lead_type', typeFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leads:', error);
      } else {
        setLeads(data || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchLeads();
    }
  }, [isAdmin, statusFilter, typeFilter]);

  // Filter leads by search query
  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    
    const query = searchQuery.toLowerCase();
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.industry.toLowerCase().includes(query) ||
      lead.service_area.toLowerCase().includes(query)
    );
  }, [leads, searchQuery]);

  // Export to CSV
  const exportCSV = () => {
    const headers = ['Datum', 'Typ', 'Name', 'Email', 'Telefon', 'Branche', 'Ort', 'Status', 'Score', 'Bucket'];
    const rows = filteredLeads.map(lead => [
      format(new Date(lead.created_at), 'yyyy-MM-dd HH:mm'),
      lead.lead_type === 'free_audit' ? 'Audit' : 'Call',
      lead.name,
      lead.email,
      lead.phone || '',
      lead.industry,
      lead.service_area,
      statusLabels[lead.status] || lead.status,
      lead.pre_score_total?.toString() || '',
      lead.pre_score_bucket || '',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success(`${filteredLeads.length} Leads exportiert`);
  };

  // Copy report link
  const copyReportLink = async (token: string) => {
    const url = `https://itsfeierabend.ch/gratis-audit/report/${token}`;
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
            
            <Button variant="outline" onClick={signOut} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leads</h1>
            <p className="text-muted-foreground">
              {filteredLeads.length} Lead{filteredLeads.length !== 1 ? 's' : ''} gefunden
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="new">Neu</SelectItem>
                <SelectItem value="reviewing">In Bearbeitung</SelectItem>
                <SelectItem value="scored">Bewertet</SelectItem>
                <SelectItem value="contacted">Kontaktiert</SelectItem>
                <SelectItem value="closed">Abgeschlossen</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Typ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Typen</SelectItem>
                <SelectItem value="free_audit">Audit</SelectItem>
                <SelectItem value="free_call">Call</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={fetchLeads} disabled={isLoading}>
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>

            <Button variant="outline" onClick={exportCSV} disabled={filteredLeads.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-background border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Keine Leads gefunden.</p>
          </div>
        ) : (
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Datum</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Typ</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Kontakt</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Branche</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Ort</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Score</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className={cn(
                      "hover:bg-muted/30 transition-colors",
                      lead.is_duplicate && "opacity-60"
                    )}>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(lead.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                      </td>
                      <td className="px-4 py-3">
                        {lead.lead_type === 'free_audit' ? (
                          <div className="flex items-center gap-1 text-sm">
                            <FileText className="w-4 h-4 text-primary" />
                            <span>Audit</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-sm">
                            <PhoneCall className="w-4 h-4 text-green-600" />
                            <span>Call</span>
                          </div>
                        )}
                        {lead.is_duplicate && (
                          <span className="text-xs text-muted-foreground">(Duplikat)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a 
                            href={`mailto:${lead.email}`} 
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          {lead.phone && (
                            <a 
                              href={`tel:${lead.phone}`}
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {lead.industry}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {lead.service_area}
                      </td>
                      <td className="px-4 py-3">
                        {lead.pre_score_bucket ? (
                          <div className="flex items-center gap-2">
                            <Badge className={cn('font-normal text-xs', bucketColors[lead.pre_score_bucket])}>
                              {lead.pre_score_total}
                            </Badge>
                            {lead.public_token && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => copyReportLink(lead.public_token!)}
                              >
                                {copiedId === lead.public_token ? (
                                  <Check className="w-3 h-3 text-green-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn('font-normal', statusColors[lead.status])}>
                          {statusLabels[lead.status] || lead.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/leads/${lead.id}`}>
                          <Button variant="ghost" size="sm">
                            Details
                            <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                          </Button>
                        </Link>
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
