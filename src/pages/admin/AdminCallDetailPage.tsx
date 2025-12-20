import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Loader2, 
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Copy,
  Check,
  ExternalLink,
  CheckCircle,
  XCircle,
  Play
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatDuration } from '@/lib/admin-constants';

interface CallDetail {
  id: string;
  created_at: string;
  updated_at: string;
  retell_call_id: string;
  agent_id: string | null;
  direction: string | null;
  from_number: string | null;
  to_number: string | null;
  lead_id: string | null;
  status: string | null;
  start_timestamp: number | null;
  end_timestamp: number | null;
  duration_ms: number | null;
  disconnection_reason: string | null;
  transfer_destination: string | null;
  consent_recording: boolean;
  consent_transcript: boolean;
  transcript: string | null;
  transcript_object: any;
  call_analysis: any;
  recording_url: string | null;
  public_log_url: string | null;
  data_storage_setting: string | null;
  metadata: any;
}

export default function AdminCallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [call, setCall] = useState<CallDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin && id) {
      fetchCall();
    }
  }, [isAdmin, id]);

  const fetchCall = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching call:', error);
        toast.error('Call konnte nicht geladen werden.');
      } else if (data) {
        setCall(data);
      }
    } finally {
      setIsLoading(false);
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

  if (!call) {
    return (
      <AdminLayout title="Call nicht gefunden">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Call nicht gefunden.</p>
            <Link to="/admin/calls">
              <Button variant="outline">Zurück zu Calls</Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => {
    if (!value) return null;
    return (
      <div className="py-3 border-b border-border last:border-0">
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <dd className="text-foreground mt-1">{value}</dd>
      </div>
    );
  };

  return (
    <AdminLayout 
      title={call.direction === 'inbound' ? 'Inbound Call' : 'Outbound Call'}
      subtitle={format(new Date(call.created_at), "dd. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })}
      breadcrumbs={[
        { label: 'Calls', href: '/admin/calls' },
        { label: call.direction === 'inbound' ? 'Inbound Call' : 'Outbound Call' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6">
          {/* Header Card */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {call.direction === 'inbound' ? (
                    <PhoneIncoming className="w-6 h-6 text-green-600" />
                  ) : (
                    <PhoneOutgoing className="w-6 h-6 text-blue-600" />
                  )}
                  <h1 className="text-2xl font-bold text-foreground">
                    {call.direction === 'inbound' ? 'Inbound Call' : 'Outbound Call'}
                  </h1>
                  <Badge className={call.status === 'ended' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}>
                    {call.status || 'unknown'}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {format(new Date(call.created_at), "dd. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })}
                </p>
              </div>
              
              <div className="flex gap-2">
                {call.from_number && (
                  <a href={`tel:${call.from_number}`}>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Anrufen
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Call Details */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4">Call Details</h2>
            
            <dl>
              <InfoRow label="Retell Call ID" value={call.retell_call_id} />
              <InfoRow label="Agent ID" value={call.agent_id} />
              <InfoRow label="Von" value={call.from_number} />
              <InfoRow label="Nach" value={call.to_number} />
              <InfoRow label="Dauer" value={formatDuration(call.duration_ms)} />
              <InfoRow label="Disconnection Reason" value={call.disconnection_reason} />
              <InfoRow label="Transfer Destination" value={call.transfer_destination} />
              <InfoRow label="Data Storage Setting" value={call.data_storage_setting} />
            </dl>

            {call.lead_id && (
              <div className="mt-4 pt-4 border-t border-border">
                <Link to={`/admin/leads/${call.lead_id}`}>
                  <Button variant="outline" size="sm">
                    Verknüpften Lead anzeigen
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Consent Status */}
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="font-semibold text-foreground mb-4">Consent Status</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                {call.consent_recording ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Recording</p>
                  <p className="text-sm text-muted-foreground">
                    {call.consent_recording ? 'Zugestimmt' : 'Nicht zugestimmt'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                {call.consent_transcript ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Transcript</p>
                  <p className="text-sm text-muted-foreground">
                    {call.consent_transcript ? 'Zugestimmt' : 'Nicht zugestimmt'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recording (only if consent + config allows) */}
          {call.consent_recording && siteConfig.voiceStoreRecordings && call.recording_url && (
            <div className="bg-background border border-border rounded-lg p-6">
              <h2 className="font-semibold text-foreground mb-4">Recording</h2>
              
              <div className="flex items-center gap-4">
                <a href={call.recording_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Recording abspielen
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(call.recording_url!, 'recording')}
                >
                  {copiedField === 'recording' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="ml-2">URL kopieren</span>
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                Hinweis: Recording URLs können zeitlich begrenzt sein.
              </p>
            </div>
          )}

          {/* Transcript (only if consent + config allows) */}
          {call.consent_transcript && siteConfig.voiceStoreTranscripts && call.transcript && (
            <div className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Transcript</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(call.transcript!, 'transcript')}
                >
                  {copiedField === 'transcript' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="ml-2">Kopieren</span>
                </Button>
              </div>
              
              <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">{call.transcript}</pre>
              </div>
            </div>
          )}

          {/* Call Analysis */}
          {call.call_analysis && (
            <div className="bg-background border border-border rounded-lg p-6">
              <h2 className="font-semibold text-foreground mb-4">Call Analysis</h2>
              
              <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {JSON.stringify(call.call_analysis, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Metadata */}
          {call.metadata && (
            <div className="bg-background border border-border rounded-lg p-6">
              <h2 className="font-semibold text-foreground mb-4">Metadata</h2>
              
              <div className="bg-muted rounded-lg p-4 max-h-48 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {JSON.stringify(call.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Public Log URL */}
          {call.public_log_url && (
            <div className="bg-background border border-border rounded-lg p-6">
              <h2 className="font-semibold text-foreground mb-4">Retell Log</h2>
              
              <a href={call.public_log_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Im Retell Dashboard öffnen
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
