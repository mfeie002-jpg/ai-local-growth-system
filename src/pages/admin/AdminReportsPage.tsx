import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Check,
  Clipboard,
  Eye,
  FileCheck2,
  Loader2,
  MailCheck,
  MousePointerClick,
  RefreshCw,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { NoIndex } from '@/components/NoIndex';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AuditRequest {
  id: string;
  token: string;
  normalized_domain: string;
  company_name: string | null;
  language: string;
  audit_type: string;
  status: string;
  overall_score: number | null;
  score_version: string | null;
  report_viewed_at: string | null;
  cta_clicked_at: string | null;
  email_sent_at: string | null;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  pending: 'Ausstehend',
  fetching: 'Abruf',
  scoring: 'Bewertung',
  ready: 'Bereit',
  partial: 'Teilresultat',
  failed: 'Fehlgeschlagen',
};

const statusStyles: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-700',
  fetching: 'bg-blue-100 text-blue-700',
  scoring: 'bg-violet-100 text-violet-700',
  ready: 'bg-emerald-100 text-emerald-700',
  partial: 'bg-amber-100 text-amber-800',
  failed: 'bg-red-100 text-red-700',
};

export default function AdminReportsPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [audits, setAudits] = useState<AuditRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchAudits = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_requests')
        .select(
          'id, token, normalized_domain, company_name, language, audit_type, status, overall_score, score_version, report_viewed_at, cta_clicked_at, email_sent_at, created_at',
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAudits(data ?? []);
    } catch (error) {
      console.error('Error fetching canonical audit requests:', error);
      toast.error('Audits konnten nicht geladen werden.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) void fetchAudits();
  }, [fetchAudits, isAdmin]);

  const filteredAudits = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return audits.filter((audit) => {
      const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
      const matchesSearch =
        !query ||
        audit.normalized_domain.toLowerCase().includes(query) ||
        (audit.company_name ?? '').toLowerCase().includes(query) ||
        audit.audit_type.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [audits, searchQuery, statusFilter]);

  const kpis = useMemo(() => {
    const scored = audits.filter((audit) => audit.overall_score !== null);
    return {
      total: audits.length,
      ready: audits.filter((audit) => audit.status === 'ready').length,
      viewed: audits.filter((audit) => audit.report_viewed_at).length,
      ctaClicks: audits.filter((audit) => audit.cta_clicked_at).length,
      emailed: audits.filter((audit) => audit.email_sent_at).length,
      averageScore:
        scored.length > 0
          ? Math.round(
              scored.reduce((sum, audit) => sum + (audit.overall_score ?? 0), 0) /
                scored.length,
            )
          : null,
    };
  }, [audits]);

  const copyResultUrl = async (audit: AuditRequest) => {
    const languagePrefix = audit.language === 'en' ? '/en' : '';
    const resultUrl = `${window.location.origin}${languagePrefix}/audit/r/${audit.token}`;
    try {
      await navigator.clipboard.writeText(resultUrl);
      setCopiedId(audit.id);
      window.setTimeout(() => setCopiedId(null), 2_000);
    } catch {
      toast.error('Resultat-Link konnte nicht kopiert werden.');
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <AdminLayout
      title="Audits"
      subtitle="Kanonische Quick-Audit-Pipeline – ohne geschätzte Umsatz- oder Verlustwerte"
    >
      <NoIndex />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: 'Gestartet', value: kpis.total, icon: FileCheck2 },
          { label: 'Bereit', value: kpis.ready, icon: Check },
          { label: 'Angesehen', value: kpis.viewed, icon: Eye },
          { label: 'CTA-Klicks', value: kpis.ctaClicks, icon: MousePointerClick },
          { label: 'E-Mail versandt', value: kpis.emailed, icon: MailCheck },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{item.value}</p>
              </div>
              <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Domain, Firma oder Audit-Typ"
            className="pl-9"
            aria-label="Audits durchsuchen"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48" aria-label="Audit-Status filtern">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => void fetchAudits()} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Aktualisieren
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-14">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : filteredAudits.length === 0 ? (
            <p className="px-6 py-14 text-center text-sm text-muted-foreground">
              Keine passenden Audits vorhanden.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Firma / Domain</th>
                    <th className="px-4 py-3 font-medium">Typ</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Funnel</th>
                    <th className="px-4 py-3 font-medium">Erstellt</th>
                    <th className="px-4 py-3 text-right font-medium">Resultat</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudits.map((audit) => (
                    <tr key={audit.id} className="border-b last:border-0">
                      <td className="px-4 py-4">
                        <p className="max-w-[260px] truncate font-medium text-foreground">
                          {audit.company_name || audit.normalized_domain}
                        </p>
                        {audit.company_name && (
                          <p className="max-w-[260px] truncate text-xs text-muted-foreground">
                            {audit.normalized_domain}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">{audit.audit_type}</td>
                      <td className="px-4 py-4">
                        <Badge className={statusStyles[audit.status] ?? 'bg-slate-100 text-slate-700'}>
                          {statusLabels[audit.status] ?? audit.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        {audit.overall_score === null ? (
                          <span className="text-muted-foreground">–</span>
                        ) : (
                          <span title={audit.score_version ?? undefined}>
                            {audit.overall_score}/100
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 text-muted-foreground">
                          <Eye
                            className={`h-4 w-4 ${audit.report_viewed_at ? 'text-emerald-600' : ''}`}
                            aria-label={audit.report_viewed_at ? 'Resultat angesehen' : 'Nicht angesehen'}
                          />
                          <MousePointerClick
                            className={`h-4 w-4 ${audit.cta_clicked_at ? 'text-emerald-600' : ''}`}
                            aria-label={audit.cta_clicked_at ? 'CTA geklickt' : 'CTA nicht geklickt'}
                          />
                          <MailCheck
                            className={`h-4 w-4 ${audit.email_sent_at ? 'text-emerald-600' : ''}`}
                            aria-label={audit.email_sent_at ? 'E-Mail versandt' : 'E-Mail nicht versandt'}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {format(new Date(audit.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => void copyResultUrl(audit)}
                          aria-label={`Resultat-Link für ${audit.normalized_domain} kopieren`}
                        >
                          {copiedId === audit.id ? (
                            <Check className="mr-2 h-4 w-4" />
                          ) : (
                            <Clipboard className="mr-2 h-4 w-4" />
                          )}
                          {copiedId === audit.id ? 'Kopiert' : 'Link'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">
        Durchschnittlicher technischer Quick-Audit-Score:{' '}
        {kpis.averageScore === null ? 'noch keine Daten' : `${kpis.averageScore}/100`}. Der Score
        basiert ausschliesslich auf den ausgewiesenen Regeln und verfügbaren Website-Signalen.
      </p>
    </AdminLayout>
  );
}
