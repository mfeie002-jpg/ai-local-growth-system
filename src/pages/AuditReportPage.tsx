import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, CheckCircle, AlertTriangle, XCircle, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
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
    if (token) fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchReport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-audit-report', { body: { token } });
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

  // Positive-framing labels per brand rule
  const getBucketInfo = (bucket: string | null) => {
    switch (bucket) {
      case 'red':
        return {
          icon: Sparkles,
          accent: 'text-aurora',
          label: isDE ? 'Grosses Wachstumspotenzial' : 'Significant growth potential',
          description: isDE
            ? 'Mehrere Hebel sind noch ungenutzt — die Ausgangslage für schnelle Fortschritte ist hervorragend.'
            : 'Several levers are still untapped — the starting point for rapid progress is excellent.',
        };
      case 'yellow':
        return {
          icon: AlertTriangle,
          accent: 'text-aurora',
          label: isDE ? 'Solide Basis, klare Hebel' : 'Solid base, clear levers',
          description: isDE
            ? 'Gute Grundlage vorhanden. Mit gezielten Massnahmen lässt sich noch deutlich mehr rausholen.'
            : 'Good foundation in place. Targeted measures can unlock significantly more potential.',
        };
      case 'green':
        return {
          icon: CheckCircle,
          accent: 'text-aurora',
          label: isDE ? 'Starkes Fundament. Bereit zum Skalieren.' : 'Strong foundation. Ready to scale.',
          description: isDE
            ? 'Du hast bereits vieles richtig gemacht. Zeit für den nächsten Schritt.'
            : 'You have already done a lot right. Time for the next step.',
        };
      default:
        return {
          icon: Sparkles,
          accent: 'text-aurora',
          label: isDE ? 'Wird analysiert' : 'Being analysed',
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
    'Optimise Google Business Profile',
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
          <Loader2 className="w-8 h-8 animate-spin text-aurora" />
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
        <section className="relative overflow-hidden min-h-[70vh] flex items-center py-20">
          <div className="absolute inset-0 grid-pattern opacity-20" aria-hidden />
          <div className="absolute inset-0 noise-overlay" aria-hidden />
          <SectionContainer>
            <div className="max-w-2xl mx-auto text-center">
              <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                {isDE ? '— 404' : '— 404'}
              </span>
              <h1 className="mt-6 font-editorial font-semibold leading-[0.95] text-5xl sm:text-7xl">
                {isDE ? (<>Link <span className="italic text-aurora">abgelaufen.</span></>) : (<>Link <span className="italic text-aurora">expired.</span></>)}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                {isDE ? 'Dieser Link ist ungültig oder abgelaufen.' : 'This link is invalid or expired.'}
              </p>
              <div className="mt-10">
                <CTAButton variant="primary" size="lg" href={isEnglish ? '/en/free-audit' : '/gratis-audit'} location="report-not-found">
                  {isDE ? 'Neues Audit starten' : 'Start new audit'}
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </CTAButton>
              </div>
            </div>
          </SectionContainer>
        </section>
      </Layout>
    );
  }

  const bucketInfo = getBucketInfo(lead.pre_score_bucket);
  const BucketIcon = bucketInfo.icon;

  return (
    <Layout>
      <SEOHead
        title={isDE ? 'Dein Vorab-Score | itsFeierabend.ch' : 'Your Pre-Score | itsFeierabend.ch'}
        description={isDE ? 'Dein Vorab-Score basierend auf deiner Audit-Anfrage.' : 'Your pre-score based on your audit request.'}
        noIndex
      />

      {/* Hero — Editorial */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />
        <div className="absolute inset-0 noise-overlay" aria-hidden />
        <div
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)' }}
          aria-hidden
        />

        <SectionContainer padding="large">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <aside className="lg:col-span-4 order-2 lg:order-1 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8" style={{ background: 'var(--gradient-aurora)' }} />
                <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  {isDE ? '§ Report / Pre-Score' : '§ Report / Pre-Score'}
                </span>
              </div>

              {/* Score panel */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                    {isDE ? 'Score' : 'Score'}
                  </span>
                  <BucketIcon className={cn('w-6 h-6', bucketInfo.accent)} />
                </div>
                {lead.pre_score_total !== null ? (
                  <div className="font-editorial leading-none">
                    <span className="text-7xl text-aurora italic font-semibold">{lead.pre_score_total}</span>
                    <span className="text-2xl text-muted-foreground">/100</span>
                  </div>
                ) : (
                  <div className="font-editorial text-3xl text-muted-foreground italic">—</div>
                )}
                <p className={cn('font-editorial text-lg leading-snug', bucketInfo.accent)}>
                  {bucketInfo.label}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {bucketInfo.description}
                </p>
              </div>
            </aside>

            <div className="lg:col-span-8 order-1 lg:order-2">
              <h1 className="font-editorial font-semibold leading-[0.9] tracking-tight text-5xl sm:text-7xl md:text-8xl">
                <span className="block text-foreground">{isDE ? 'Dein' : 'Your'}</span>
                <span className="block italic text-aurora">{isDE ? 'Vorab-Score.' : 'pre-score.'}</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {isDE
                  ? 'Basierend auf deiner Eingabe. Das vollständige Audit ergänzt eine manuelle Tiefenprüfung.'
                  : 'Based on your input. The full audit adds a manual deep-dive review.'}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {isDE ? `Hallo ${lead.name} — danke für die Anfrage aus ${lead.service_area}.` : `Hi ${lead.name} — thanks for the request from ${lead.service_area}.`}
              </p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Next Step CTA */}
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
              {isDE ? '— Next step' : '— Next step'}
            </span>
            <h2 className="mt-4 font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
              {isDE ? (<>Lass uns das <span className="italic text-aurora">aktivieren.</span></>) : (<>Let's <span className="italic text-aurora">activate this.</span></>)}
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
            {lead.pre_score_bucket === 'green' ? (
              <CTAButton variant="primary" size="lg" href={isEnglish ? '/en/free-call' : '/gratis-call'} location="report-cta-green">
                {isDE ? '20-Minuten Call buchen' : 'Book 20-minute call'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </CTAButton>
            ) : (
              <>
                <CTAButton variant="primary" size="lg" href={isEnglish ? '/en/free-call' : '/gratis-call'} location="report-cta">
                  {isDE ? 'Gratis Orientierungsgespräch' : 'Free orientation call'}
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </CTAButton>
                <a href="#checklist">
                  <CTAButton variant="secondary" size="lg" location="report-checklist">
                    {isDE ? 'Checkliste ansehen' : 'View checklist'}
                  </CTAButton>
                </a>
              </>
            )}
          </div>
        </div>
      </SectionContainer>

      {/* Checklist */}
      <section id="checklist" className="relative">
        <div className="absolute inset-0 noise-overlay opacity-50" aria-hidden />
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                {isDE ? '— Checkliste' : '— Checklist'}
              </span>
              <h2 className="mt-4 font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
                {isDE ? (<>Digitaler <span className="italic text-aurora">Neustart.</span></>) : (<>Digital <span className="italic text-aurora">restart.</span></>)}
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {isDE ? 'Die zehn Hebel, die wir bei jedem ersten Sprint adressieren.' : 'The ten levers we tackle in every first sprint.'}
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="divide-y divide-border/60">
                {checklist.map((item, index) => (
                  <li key={index} className="flex items-start gap-5 py-4">
                    <span className="font-editorial text-aurora text-sm tracking-widest pt-1">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <CheckCircle className="w-5 h-5 text-aurora mt-1 flex-shrink-0" />
                    <span className="text-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Callback */}
      {siteConfig.voiceCallbackEnabled && token && (
        <SectionContainer>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                {isDE ? '— Optional' : '— Optional'}
              </span>
              <h3 className="mt-4 font-editorial text-3xl sm:text-4xl font-semibold leading-tight">
                {isDE ? (<>Rückruf vom <span className="italic text-aurora">AI-Assistenten.</span></>) : (<>Callback from the <span className="italic text-aurora">AI assistant.</span></>)}
              </h3>
            </div>
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <CallbackRequestForm token={token} language={isDE ? 'de' : 'en'} />
            </div>
          </div>
        </SectionContainer>
      )}

      {/* Transparency */}
      <SectionContainer>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            {isDE
              ? 'Wenn später Voice-Assistenz genutzt wird, erfolgt ein transparenter Hinweis (inkl. Aufzeichnung).'
              : 'If voice assistance is used later, there will be a transparent notice (including recording).'}
          </p>
        </div>
      </SectionContainer>
    </Layout>
  );
}
