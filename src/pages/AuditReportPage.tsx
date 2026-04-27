import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, CheckCircle, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { CTAButton } from '@/components/CTAButton';
import { CallbackRequestForm } from '@/components/forms/CallbackRequestForm';
import { SectionMarker, ScoreCard, AIAnnotation, ReportSkeleton } from '@/components/neural';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { track } from '@/lib/analytics';
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
  const getBucketCopy = (bucket: string | null) => {
    switch (bucket) {
      case 'red':
        return {
          label: isDE ? 'Grosses Wachstumspotenzial' : 'Significant growth potential',
          description: isDE
            ? 'Mehrere Hebel sind noch ungenutzt — die Ausgangslage für schnelle Fortschritte ist hervorragend.'
            : 'Several levers are still untapped — the starting point for rapid progress is excellent.',
        };
      case 'yellow':
        return {
          label: isDE ? 'Solide Basis, klare Hebel' : 'Solid base, clear levers',
          description: isDE
            ? 'Gute Grundlage vorhanden. Mit gezielten Massnahmen lässt sich noch deutlich mehr rausholen.'
            : 'Good foundation in place. Targeted measures can unlock significantly more potential.',
        };
      case 'green':
        return {
          label: isDE ? 'Starkes Fundament. Bereit zum Skalieren.' : 'Strong foundation. Ready to scale.',
          description: isDE
            ? 'Du hast bereits vieles richtig gemacht. Zeit für den nächsten Schritt.'
            : 'You have already done a lot right. Time for the next step.',
        };
      default:
        return {
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
        <ReportSkeleton marker={isDE ? 'Vorab-Score' : 'Pre-Score'} />
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
        <section className="pt-28 md:pt-36 lg:pt-44 pb-24 md:pb-32">
          <div className="container-section">
            <div className="max-w-2xl">
              <SectionMarker index={0} total={4} label="Report / 404" />
              <h1 className="text-balance">
                {isDE ? 'Link ' : 'Link '}
                <span className="font-editorial italic">{isDE ? 'abgelaufen.' : 'expired.'}</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-foreground/75 leading-[1.55]">
                {isDE ? 'Dieser Link ist ungültig oder abgelaufen.' : 'This link is invalid or expired.'}
              </p>
              <div className="mt-12">
                <CTAButton variant="primary" size="lg" href={isEnglish ? '/en/free-audit' : '/gratis-audit'} location="report-not-found">
                  {isDE ? 'Neues Audit starten' : 'Start new audit'}
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </CTAButton>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const bucket = getBucketCopy(lead.pre_score_bucket);

  return (
    <Layout>
      <SEOHead
        title={isDE ? 'Dein Vorab-Score | itsFeierabend.ch' : 'Your Pre-Score | itsFeierabend.ch'}
        description={isDE ? 'Dein Vorab-Score basierend auf deiner Audit-Anfrage.' : 'Your pre-score based on your audit request.'}
        noIndex
      />

      {/* ===== 01 · Hero ===== */}
      <section className="pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <div className="col-span-12 lg:col-span-8">
              <SectionMarker index={1} total={4} label={isDE ? 'Vorab-Score' : 'Pre-Score'} />
              <h1 className="text-balance">
                <span className="block">{isDE ? 'Dein' : 'Your'}</span>
                <span className="block font-editorial italic text-foreground/85">
                  {isDE ? 'Vorab-Score.' : 'pre-score.'}
                </span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg md:text-xl text-foreground/75 leading-[1.55]">
                {isDE
                  ? 'Basierend auf deiner Eingabe. Das vollständige Audit ergänzt eine manuelle Tiefenprüfung.'
                  : 'Based on your input. The full audit adds a manual deep-dive review.'}
              </p>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {isDE
                  ? `Hallo ${lead.name} · Anfrage aus ${lead.service_area}`
                  : `Hi ${lead.name} · request from ${lead.service_area}`}
              </p>
            </div>

            <aside className="col-span-12 lg:col-span-4 lg:col-start-9 flex flex-col gap-6">
              <div className="hidden lg:block rule-hairline w-12" />
              <div className="card-paper p-8 flex flex-col items-center">
                {lead.pre_score_total !== null ? (
                  <ScoreCard
                    score={lead.pre_score_total}
                    label={isDE ? 'Pre-Score' : 'Pre-Score'}
                    size={200}
                  />
                ) : (
                  <div className="font-editorial text-5xl italic text-muted-foreground py-12">—</div>
                )}
                <p className="mt-6 text-center text-base text-foreground text-balance">
                  {bucket.label}
                </p>
                <p className="mt-3 text-center text-sm text-muted-foreground leading-relaxed text-balance">
                  {bucket.description}
                </p>
              </div>
              <AIAnnotation>
                {isDE
                  ? 'gemini-2.5-flash · interpretiert deine Eingabe · vollständiges Audit folgt manuell'
                  : 'gemini-2.5-flash · interpreting your input · full audit follows manually'}
              </AIAnnotation>
            </aside>
          </div>
        </div>
      </section>

      {/* ===== 02 · Next step ===== */}
      <section className="py-20 md:py-24 border-t border-border/80">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end">
            <div className="col-span-12 lg:col-span-7">
              <SectionMarker index={2} total={4} label={isDE ? 'Nächster Schritt' : 'Next step'} />
              <h2 className="text-balance">
                {isDE ? 'Lass uns das ' : "Let's "}
                <span className="font-editorial italic">{isDE ? 'aktivieren.' : 'activate this.'}</span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5 flex flex-col sm:flex-row gap-4">
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
        </div>
      </section>

      {/* ===== 03 · Checklist ===== */}
      <section id="checklist" className="py-20 md:py-28 border-t border-border/80">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <div className="col-span-12 lg:col-span-4">
              <SectionMarker index={3} total={4} label={isDE ? 'Checkliste' : 'Checklist'} />
              <h2 className="text-balance">
                {isDE ? 'Digitaler ' : 'Digital '}
                <span className="font-editorial italic">{isDE ? 'Neustart.' : 'restart.'}</span>
              </h2>
              <p className="mt-6 max-w-md text-base text-foreground/75 leading-relaxed">
                {isDE
                  ? 'Die zehn Hebel, die wir bei jedem ersten Sprint adressieren.'
                  : 'The ten levers we tackle in every first sprint.'}
              </p>
            </div>
            <ul className="col-span-12 lg:col-span-8 border-t border-border/80">
              {checklist.map((item, index) => (
                <li key={index} className="grid grid-cols-12 gap-4 py-5 border-b border-border/80 items-start">
                  <span className="col-span-1 font-mono text-xs tracking-[0.2em] text-muted-foreground pt-1.5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <CheckCircle className="col-span-1 w-5 h-5 text-foreground mt-1" strokeWidth={1.5} />
                  <span className="col-span-10 text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== 04 · Optional callback ===== */}
      {siteConfig.voiceCallbackEnabled && token && (
        <section className="py-20 md:py-28 border-t border-border/80">
          <div className="container-section">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex">
                  <SectionMarker index={4} total={4} label={isDE ? 'Optional' : 'Optional'} />
                </div>
                <h3 className="text-balance">
                  {isDE ? 'Rückruf vom ' : 'Callback from the '}
                  <span className="font-editorial italic">{isDE ? 'AI-Assistenten.' : 'AI assistant.'}</span>
                </h3>
              </div>
              <div className="card-paper p-6 sm:p-8">
                <CallbackRequestForm token={token} language={isDE ? 'de' : 'en'} />
              </div>
              <p className="mt-8 text-center text-sm text-muted-foreground">
                {isDE
                  ? 'Wenn Voice-Assistenz genutzt wird, erfolgt ein transparenter Hinweis (inkl. Aufzeichnung).'
                  : 'If voice assistance is used, there will be a transparent notice (including recording).'}
              </p>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
