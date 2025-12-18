import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Loader2, 
  LogOut, 
  ArrowLeft,
  Mail, 
  Phone, 
  Globe,
  Copy,
  Check,
  ExternalLink,
  Save,
  Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LeadDetail {
  id: string;
  created_at: string;
  language: string;
  lead_type: string;
  industry: string;
  service_area: string;
  website_url: string | null;
  budget_range: string | null;
  capacity_range: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  preferred_times: string | null;
  status: string;
  notes_internal: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  public_token: string | null;
  pre_score_total: number | null;
  pre_score_bucket: string | null;
  is_duplicate: boolean | null;
  duplicate_of: string | null;
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

const bucketLabels: Record<string, string> = {
  red: 'Rot – Fundament kritisch',
  yellow: 'Gelb – Solide Basis, Hebel offen',
  green: 'Grün – Starkes Fundament',
};

export default function AdminLeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, isLoading: authLoading, signOut } = useAuth();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin && id) {
      fetchLead();
    }
  }, [isAdmin, id]);

  const fetchLead = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching lead:', error);
        toast.error('Lead konnte nicht geladen werden.');
      } else if (data) {
        setLead(data);
        setNotes(data.notes_internal || '');
        setStatus(data.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lead) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          status,
          notes_internal: notes || null,
        })
        .eq('id', lead.id);

      if (error) {
        console.error('Error updating lead:', error);
        toast.error('Änderungen konnten nicht gespeichert werden.');
      } else {
        toast.success('Änderungen gespeichert.');
        setLead({ ...lead, status, notes_internal: notes || null });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast.success('Kopiert');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const getReportUrl = () => {
    if (!lead?.public_token) return null;
    return `https://itsfeierabend.ch/gratis-audit/report/${lead.public_token}`;
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Lead nicht gefunden.</p>
          <Link to="/admin/leads">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const InfoRow = ({ label, value }: { label: string; value: string | null }) => {
    if (!value) return null;
    return (
      <div className="py-3 border-b border-border last:border-0">
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <dd className="text-foreground mt-1">{value}</dd>
      </div>
    );
  };

  const reportUrl = getReportUrl();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/admin/leads">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
                </Button>
              </Link>
            </div>
            
            <Button variant="outline" onClick={signOut} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {/* Header Card */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">{lead.name}</h1>
                  <Badge className={cn('font-normal', statusColors[lead.status])}>
                    {statusLabels[lead.status] || lead.status}
                  </Badge>
                  {lead.is_duplicate && (
                    <Badge variant="outline" className="text-muted-foreground">
                      Duplikat
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {lead.lead_type === 'free_audit' ? 'Gratis Audit' : 'Gratis Call'} • {' '}
                  {format(new Date(lead.created_at), "dd. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })}
                </p>
              </div>
              
              <div className="flex gap-2">
                <a href={`mailto:${lead.email}`}>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    E-Mail
                  </Button>
                </a>
                {lead.phone && (
                  <a href={`tel:${lead.phone}`}>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Anrufen
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Pre-Score Card (for audits) */}
          {lead.lead_type === 'free_audit' && lead.pre_score_bucket && (
            <div className="bg-background border border-border rounded-lg p-6">
              <h2 className="font-semibold text-foreground mb-4">Vorab-Score</h2>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-foreground">{lead.pre_score_total}</div>
                <div>
                  <Badge className={cn('font-normal', bucketColors[lead.pre_score_bucket])}>
                    {bucketLabels[lead.pre_score_bucket]}
                  </Badge>
                </div>
              </div>

              {reportUrl && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground truncate flex-1">{reportUrl}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(reportUrl, 'report')}
                  >
                    {copiedField === 'report' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <a href={reportUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4">Kontaktdaten</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <span className="text-sm text-muted-foreground">E-Mail</span>
                  <p className="text-foreground">{lead.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(lead.email, 'email')}
                >
                  {copiedField === 'email' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {lead.phone && (
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <span className="text-sm text-muted-foreground">Telefon</span>
                    <p className="text-foreground">{lead.phone}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(lead.phone!, 'phone')}
                  >
                    {copiedField === 'phone' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}

              {lead.website_url && (
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Website</span>
                    <p className="text-foreground">{lead.website_url}</p>
                  </div>
                  <a href={lead.website_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Lead Details */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4">Lead Details</h2>
            
            <dl>
              <InfoRow label="Branche" value={lead.industry} />
              <InfoRow label="Ort / Einsatzgebiet" value={lead.service_area} />
              <InfoRow label="Monatsbudget" value={lead.budget_range} />
              <InfoRow label="Kapazität (Jobs/Woche)" value={lead.capacity_range} />
              <InfoRow label="Nachricht" value={lead.message} />
              <InfoRow label="Bevorzugte Zeiten" value={lead.preferred_times} />
              <InfoRow label="Sprache" value={lead.language === 'de' ? 'Deutsch' : 'English'} />
            </dl>
          </div>

          {/* Tracking Info */}
          {(lead.utm_source || lead.utm_medium || lead.utm_campaign || lead.referrer) && (
            <div className="bg-background border border-border rounded-lg p-6">
              <h2 className="font-semibold text-foreground mb-4">Tracking</h2>
              
              <dl>
                <InfoRow label="UTM Source" value={lead.utm_source} />
                <InfoRow label="UTM Medium" value={lead.utm_medium} />
                <InfoRow label="UTM Campaign" value={lead.utm_campaign} />
                <InfoRow label="Referrer" value={lead.referrer} />
              </dl>
            </div>
          )}

          {/* Duplicate Info */}
          {lead.is_duplicate && lead.duplicate_of && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="font-semibold text-yellow-800 mb-2">Duplikat</h2>
              <p className="text-yellow-700 text-sm">
                Dieser Lead ist ein Duplikat eines früheren Leads.
              </p>
              <Link to={`/admin/leads/${lead.duplicate_of}`}>
                <Button variant="outline" size="sm" className="mt-2">
                  Original anzeigen
                </Button>
              </Link>
            </div>
          )}

          {/* Status & Notes */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4">Status & Notizen</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Neu</SelectItem>
                    <SelectItem value="reviewing">In Bearbeitung</SelectItem>
                    <SelectItem value="scored">Bewertet</SelectItem>
                    <SelectItem value="contacted">Kontaktiert</SelectItem>
                    <SelectItem value="closed">Abgeschlossen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Interne Notizen</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notizen zu diesem Lead..."
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Änderungen speichern
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
