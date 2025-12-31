import { useEffect, useState } from 'react';
import { 
  FileSearch, 
  Phone, 
  TrendingUp,
  Globe,
  MousePointer,
  Megaphone,
  Mail,
  Search,
  Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface FunnelStats {
  lead_type: string;
  count: number;
  converted: number;
  sources: Record<string, number>;
}

interface SourceStats {
  source: string;
  count: number;
  medium?: string;
}

const FUNNEL_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  free_audit: { label: 'Website Audit', icon: FileSearch, color: 'bg-purple-500' },
  free_call: { label: 'Beratungsgespräch', icon: Phone, color: 'bg-blue-500' },
  free_analysis: { label: 'AI-Analyse', icon: TrendingUp, color: 'bg-green-500' },
};

const SOURCE_ICONS: Record<string, React.ElementType> = {
  google: Search,
  facebook: Globe,
  instagram: Globe,
  linkedin: Globe,
  email: Mail,
  newsletter: Mail,
  direct: MousePointer,
  referral: Users,
  ads: Megaphone,
};

export default function FunnelOverview() {
  const [funnelStats, setFunnelStats] = useState<FunnelStats[]>([]);
  const [sourceStats, setSourceStats] = useState<SourceStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('id, lead_type, status, utm_source, utm_medium, utm_campaign, created_at');

      if (error) throw error;

      const leadsList = leads || [];
      setTotalLeads(leadsList.length);

      // Group by lead_type
      const funnelMap: Record<string, FunnelStats> = {};
      const sourceMap: Record<string, number> = {};

      leadsList.forEach((lead) => {
        const type = lead.lead_type || 'unknown';
        if (!funnelMap[type]) {
          funnelMap[type] = { lead_type: type, count: 0, converted: 0, sources: {} };
        }
        funnelMap[type].count++;
        
        // Check if converted (status = contacted or closed)
        if (lead.status === 'contacted' || lead.status === 'closed') {
          funnelMap[type].converted++;
        }

        // Track sources
        const source = lead.utm_source || 'direct';
        funnelMap[type].sources[source] = (funnelMap[type].sources[source] || 0) + 1;
        sourceMap[source] = (sourceMap[source] || 0) + 1;
      });

      setFunnelStats(Object.values(funnelMap).sort((a, b) => b.count - a.count));
      
      const sourcesArr = Object.entries(sourceMap)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
      setSourceStats(sourcesArr);

    } catch (error) {
      console.error('Error fetching funnel stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfig = (leadType: string) => {
    return FUNNEL_CONFIG[leadType] || { 
      label: leadType, 
      icon: TrendingUp, 
      color: 'bg-gray-500' 
    };
  };

  const getSourceIcon = (source: string) => {
    const normalizedSource = source.toLowerCase();
    return SOURCE_ICONS[normalizedSource] || Globe;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Lade Funnel-Daten...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Funnel Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Funnel Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {funnelStats.map((funnel) => {
              const config = getConfig(funnel.lead_type);
              const Icon = config.icon;
              const percentage = totalLeads > 0 ? Math.round((funnel.count / totalLeads) * 100) : 0;
              const conversionRate = funnel.count > 0 ? Math.round((funnel.converted / funnel.count) * 100) : 0;

              return (
                <div key={funnel.lead_type} className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{config.label}</h4>
                        <p className="text-sm text-muted-foreground">{funnel.count} Leads</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {percentage}% Anteil
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {conversionRate}% Conversion
                      </p>
                    </div>
                  </div>
                  
                  <Progress value={percentage} className="h-2 mb-3" />
                  
                  {/* Top sources for this funnel */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(funnel.sources)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 4)
                      .map(([source, count]) => (
                        <Badge 
                          key={source} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {source}: {count}
                        </Badge>
                      ))}
                  </div>
                </div>
              );
            })}

            {funnelStats.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Noch keine Leads vorhanden
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Traffic-Quellen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sourceStats.map((source) => {
              const Icon = getSourceIcon(source.source);
              const percentage = totalLeads > 0 ? Math.round((source.count / totalLeads) * 100) : 0;

              return (
                <div 
                  key={source.source}
                  className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground capitalize">
                      {source.source}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{source.count}</span>
                    <span className="text-sm text-muted-foreground">({percentage}%)</span>
                  </div>
                </div>
              );
            })}

            {sourceStats.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-4">
                Keine Traffic-Daten vorhanden
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
