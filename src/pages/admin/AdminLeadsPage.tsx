import { useEffect, useState } from 'react';
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
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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

export default function AdminLeadsPage() {
  const { isAdmin, isLoading: authLoading, signOut } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('id, created_at, lead_type, name, email, phone, industry, service_area, status')
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
              {leads.length} Lead{leads.length !== 1 ? 's' : ''} gefunden
            </p>
          </div>

          <div className="flex items-center gap-3">
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
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : leads.length === 0 ? (
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
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
