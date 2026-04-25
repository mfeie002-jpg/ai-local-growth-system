import { useEffect, useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Loader2, 
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  RefreshCw,
  Filter,
  Search,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { callStatusColors, formatDuration } from '@/lib/admin-constants';
import { NoIndex } from '@/components/NoIndex';

interface Call {
  id: string;
  created_at: string;
  retell_call_id: string;
  direction: string | null;
  from_number: string | null;
  to_number: string | null;
  status: string | null;
  duration_ms: number | null;
  disconnection_reason: string | null;
  consent_recording: boolean;
  consent_transcript: boolean;
  lead_id: string | null;
}

export default function AdminCallsPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchCalls = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('calls')
        .select('id, created_at, retell_call_id, direction, from_number, to_number, status, duration_ms, disconnection_reason, consent_recording, consent_transcript, lead_id')
        .order('created_at', { ascending: false });

      if (directionFilter !== 'all') {
        query = query.eq('direction', directionFilter);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching calls:', error);
      } else {
        setCalls(data || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCalls();
    }
  }, [isAdmin, directionFilter, statusFilter]);

  const filteredCalls = useMemo(() => {
    if (!searchQuery.trim()) return calls;
    
    const query = searchQuery.toLowerCase();
    return calls.filter(call => 
      call.from_number?.toLowerCase().includes(query) ||
      call.to_number?.toLowerCase().includes(query) ||
      call.retell_call_id?.toLowerCase().includes(query)
    );
  }, [calls, searchQuery]);

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
    <AdminLayout title="Voice Calls" subtitle={`${filteredCalls.length} Call${filteredCalls.length !== 1 ? 's' : ''} gefunden`}>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Nummer suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-[180px]"
          />
        </div>

        <Select value={directionFilter} onValueChange={setDirectionFilter}>
          <SelectTrigger className="w-[130px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Richtung" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="inbound">Inbound</SelectItem>
            <SelectItem value="outbound">Outbound</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="started">Started</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={fetchCalls} disabled={isLoading}>
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredCalls.length === 0 ? (
        <div className="bg-background border border-border rounded-lg p-12 text-center">
          <Phone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Keine Calls gefunden.</p>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Datum</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Richtung</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Von</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nach</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Dauer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Consent</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(call.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                    </td>
                    <td className="px-4 py-3">
                      {call.direction === 'inbound' ? (
                        <div className="flex items-center gap-1 text-sm">
                          <PhoneIncoming className="w-4 h-4 text-green-600" />
                          <span>Inbound</span>
                        </div>
                      ) : call.direction === 'outbound' ? (
                        <div className="flex items-center gap-1 text-sm">
                          <PhoneOutgoing className="w-4 h-4 text-blue-600" />
                          <span>Outbound</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {call.from_number || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {call.to_number || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDuration(call.duration_ms)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <Badge className={cn('font-normal text-xs', callStatusColors[call.status || ''] || 'bg-gray-100')}>
                          {call.status || 'unknown'}
                        </Badge>
                        {call.disconnection_reason && (
                          <span className="text-xs text-muted-foreground">{call.disconnection_reason}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div title="Recording consent" className="flex items-center gap-1">
                          {call.consent_recording ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-xs">Rec</span>
                        </div>
                        <div title="Transcript consent" className="flex items-center gap-1">
                          {call.consent_transcript ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-xs">Txt</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/calls/${call.id}`}>
                        <Button variant="ghost" size="sm">
                          Details
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
