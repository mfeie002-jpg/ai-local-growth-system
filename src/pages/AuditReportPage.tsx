import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { CallbackRequestForm } from '@/components/forms/CallbackRequestForm';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

interface LeadReport {
  id: string;
  name: string;
  industry: string;
  service_area: string;
  pre_score_total: number | null;
  pre_score_bucket: string | null;
}

export default function AuditReportPage() {
  const { token } = useParams<{ token: string }>();
  const { isEnglish } = useLanguage();
  const [lead, setLead] = useState<LeadReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const isDE = !isEnglish;

  useEffect(() => {
    if (token) {
      fetchReport();
    }
  }, [token]);

  const fetchReport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-audit-report', {
        body: { token },
      });

      if (error || !data?.lead) {
        setNotFound(true);
      } else {
        setLead(data.lead);
        track('report_view', {
          lead_type: 'free_audit',
          score_bucket: data.lead.pre_score_bucket || 'unknown',
          page_path: window.location.pathname,
        });
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getBucketInfo = (bucket: string | null) => {
    switch (bucket) {
      case 'red':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50 border-red-200',
          label: isDE ? 'Fundament kritisch' : 'Critical foundation',
          description: isDE 
            ? 'Es gibt grundlegende Bereiche, die dringend optimiert werden sollten.'
            : 'There are fundamental areas that urgently need optimization.',
        };
      case 'yellow':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50 border-yellow-200',
          label: isDE ? 'Solide Basis, aber Hebel offen' : 'Solid base, but opportunities open',
          description: isDE
            ? 'Gute Grundlage vorhanden. Mit gezielten Massnahmen lässt sich noch mehr rausholen.'
            : 'Good foundation in place. Targeted measures can unlock more potential.',
        };
      case 'green':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-50 border-green-200',
          label: isDE ? 'Starkes Fundament. Bereit zum Skalieren.' : 'Strong foundation. Ready to scale.',
          description: isDE
            ? 'Du hast bereits vieles richtig gemacht. Zeit für den nächsten Schritt.'
            : 'You have already done a lot right. Time for the next step.',
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted border-border',
          label: isDE ? 'Wird analysiert' : 'Being analyzed',
          description: isDE ? 'Deine Daten werden geprüft.' : 'Your data is being reviewed.',
        };
    }
  };

  const checklist = isDE ? [
    'Tracking Setup (GA4, Events, Call-Tracking)',
    'Google Business Profil optimieren',
    'Landingpage für Hauptangebot',
    'Offer & Value Proposition schärfen',
    'Lead Response Zeit unter 5 Minuten',
    'Follow-up Sequenz einrichten',
    'Review-Strategie definieren',
    'CRM Pipeline aufsetzen',
    'Conversion-Tracking testen',
    'Wettbewerber-Analyse',
  ] : [
    'Tracking Setup (GA4, Events, Call-Tracking)',
    'Optimize Google Business Profile',
    'Landing page for main offer',
    'Sharpen Offer & Value Proposition',
    'Lead response time under 5 minutes',
    'Set up follow-up sequence',
    'Define review strategy',
    'Set up CRM pipeline',
    'Test conversion tracking',
    'Competitor analysis',
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (notFound || !lead) {
    return (
      <Layout>
        <SEOHead
          title={isDE ? 'Report nicht gefunden | itsFeierabend.ch' : 'Report not found | itsFeierabend.ch'}
          description={isDE ? 'Der angeforderte Report wurde nicht gefunden.' : 'The requested report was not found.'}
          noIndex
        />
        <SectionContainer className="pt-24 sm:pt-32 pb-16">
          <div className="max-w-lg mx-auto text-center">
            <XCircle className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {isDE ? 'Report nicht gefunden' : 'Report not found'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {isDE 
                ? 'Dieser Link ist ungültig oder abgelaufen.'
                : 'This link is invalid or expired.'
              }
            </p>
            <CTAButton
              variant="primary"
              href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
              location="report-not-found"
            >
              {isDE ? 'Neues Audit starten' : 'Start new audit'}
            </CTAButton>
          </div>
        </SectionContainer>
      </Layout>
    );
  }

  const bucketInfo = getBucketInfo(lead.pre_score_bucket);
  const BucketIcon = bucketInfo.icon;

  return (
    <Layout>
      <SEOHead
        title={isDE ? 'Dein Vorab-Score | itsFeierabend.ch' : 'Your Pre-Score | itsFeierabend.ch'}
        description={isDE
          ? 'Dein Vorab-Score basierend auf deiner Audit-Anfrage.'
          : 'Your pre-score based on your audit request.'
        }
        noIndex
      />

      <SectionContainer className="pt-24 sm:pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {isDE ? 'Hier ist dein Vorab-Score' : 'Here is your pre-score'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isDE 
                ? 'Basierend auf deiner Eingabe. Das echte Audit enthält zusätzlich eine manuelle Prüfung.'
                : 'Based on your input. The full audit includes additional manual review.'
              }
            </p>
          </div>

          {/* Score Card */}
          <div className={cn(
            'border rounded-xl p-8 mb-12 text-center',
            bucketInfo.bgColor
          )}>
            <div className="flex justify-center mb-4">
              <BucketIcon className={cn('w-16 h-16', bucketInfo.color)} />
            </div>
            
            {lead.pre_score_total !== null && (
              <div className="text-5xl font-bold text-foreground mb-2">
                {lead.pre_score_total}
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
            )}
            
            <h2 className={cn('text-xl font-semibold mb-2', bucketInfo.color)}>
              {bucketInfo.label}
            </h2>
            
            <p className="text-muted-foreground max-w-md mx-auto">
              {bucketInfo.description}
            </p>
          </div>

          {/* Next Best Action */}
          <div className="bg-card border border-border rounded-xl p-8 mb-12">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
              {isDE ? 'Nächster Schritt' : 'Next Step'}
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {lead.pre_score_bucket === 'green' ? (
                <CTAButton
                  variant="primary"
                  href={isEnglish ? '/en/free-call' : '/gratis-call'}
                  location="report-cta-green"
                >
                  {isDE ? '20-Minuten Call buchen' : 'Book 20-minute call'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </CTAButton>
              ) : (
                <>
                  <CTAButton
                    variant="primary"
                    href={isEnglish ? '/en/free-call' : '/gratis-call'}
                    location="report-cta"
                  >
                    {isDE ? 'Gratis Orientierungsgespräch' : 'Free orientation call'}
                  </CTAButton>
                  <a href="#checklist" className="inline-block">
                    <CTAButton
                      variant="secondary"
                      location="report-checklist"
                    >
                      {isDE ? 'Checkliste anzeigen' : 'View checklist'}
                    </CTAButton>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div id="checklist" className="bg-muted/30 rounded-xl p-8 mb-12">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              {isDE ? 'Digitaler Neustart: Checkliste' : 'Digital restart: Checklist'}
            </h3>
            
            <ul className="grid sm:grid-cols-2 gap-3">
              {checklist.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Callback Request Section */}
          {siteConfig.voiceCallbackEnabled && token && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
                {isDE ? 'Rückruf vom AI-Assistenten' : 'AI Assistant Callback'}
              </h3>
              <CallbackRequestForm 
                token={token} 
                language={isDE ? 'de' : 'en'} 
              />
            </div>
          )}

          {/* Transparency Note */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              {isDE 
                ? 'Wenn später Voice-Assistenz genutzt wird, erfolgt ein transparenter Hinweis (inkl. Aufzeichnung).'
                : 'If voice assistance is used later, there will be a transparent notice (including recording).'}
            </p>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
