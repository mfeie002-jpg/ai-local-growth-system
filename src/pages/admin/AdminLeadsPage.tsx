import { useEffect, useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Loader2, 
  Mail, 
  Phone, 
  FileText, 
  PhoneCall,
  Filter,
  ChevronDown,
  RefreshCw,
  Search,
  Download,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { statusColors, statusLabels, bucketColors } from '@/lib/admin-constants';
import { NoIndex } from '@/components/NoIndex';

interface Lead {
  id: string;
  created_at: string;
  lead_type: string;
  name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  industry: string;
  service_area: string;
  region: string | null;
  landing_page: string | null;
  audit_type: string | null;
  lead_score: number | null;
  status: string;
  pre_score_total: number | null;
  pre_score_bucket: string | null;
  is_duplicate: boolean | null;
}

export default function AdminLeadsPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('id, created_at, lead_type, name, company_name, email, phone, industry, service_area, region, landing_page, audit_type, lead_score, status, pre_score_total, pre_score_bucket, is_duplicate')
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

  const exportCSV = () => {
    const headers = ['Datum', 'Typ', 'Firma', 'Name', 'Email', 'Telefon', 'Branche', 'Region', 'Landingpage', 'Audit-Typ', 'Status', 'Score'];
    const rows = filteredLeads.map(lead => [
      format(new Date(lead.created_at), 'yyyy-MM-dd HH:mm'),
      lead.lead_type,
      lead.company_name || '',
      lead.name,
      lead.email,
      lead.phone || '',
      lead.industry,
      lead.region || '',
      lead.landing_page || '',
      lead.audit_type || '',
      statusLabels[lead.status] || lead.status,
      (lead.lead_score ?? lead.pre_score_total)?.toString() || '',
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
    <AdminLayout title="Leads" subtitle={`${filteredLeads.length} Lead${filteredLeads.length !== 1 ? 's' : ''} gefunden`}>
      <NoIndex />
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
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
            <SelectItem value="contact">Kontakt</SelectItem>
            <SelectItem value="partner">Partner</SelectItem>
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Firma / Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Kontakt</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Branche</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Region</th>
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
                      ) : lead.lead_type === 'free_call' ? (
                        <div className="flex items-center gap-1 text-sm">
                          <PhoneCall className="w-4 h-4 text-green-600" />
                          <span>Call</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-4 h-4 text-primary" />
                          <span>{lead.lead_type === 'partner' ? 'Partner' : 'Kontakt'}</span>
                        </div>
                      )}
                      {lead.is_duplicate && (
                        <span className="text-xs text-muted-foreground">(Duplikat)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      <span className="block">{lead.company_name || lead.name}</span>
                      {lead.company_name && <span className="block text-xs font-normal text-muted-foreground">{lead.name}</span>}
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
                      {lead.region || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {(lead.lead_score ?? lead.pre_score_total) != null ? (
                        <Badge className={cn('font-normal text-xs', lead.pre_score_bucket ? bucketColors[lead.pre_score_bucket] : '')}>
                          {lead.lead_score ?? lead.pre_score_total}
                        </Badge>
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
    </AdminLayout>
  );
}
