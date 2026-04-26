import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { CTAButton } from '@/components/CTAButton';
import { AuditFormStepper } from '@/components/forms/AuditFormStepper';
import {
  EditorialHero,
  SectionMarker,
  RevealText,
  AIAnnotation,
  FunnelNav,
  getFunnelSteps,
} from '@/components/neural';
import { ArrowRight } from 'lucide-react';

/**
 * AuditPage — Funnel step 02 / 05 · Start.
 * Editorial framing on the left, form on the right.
 * Previous: System. Next: Pakete (after submission, the report flow takes over).
 */
export default function AuditPage() {
  const { t, isEnglish } = useLanguage();
  const steps = getFunnelSteps(isEnglish);
  const me = steps[1];
  const prev = steps[0];
  const next = steps[2];

  const deliverables = t.audit.deliverables.items;
  const procSteps = [t.audit.steps.step1, t.audit.steps.step2, t.audit.steps.step3];

  return (
    <Layout>
      <SEOHead title={t.audit.heroTitle} description={t.audit.heroSubtitle} />

      {/* Hero */}
      <EditorialHero
        eyebrow={`${me.hint} · ${me.label}`}
        title={
          isEnglish ? (
            <>Hand us your URL. <em className="font-editorial">We'll hand you a score.</em></>
          ) : (
            <>Gib uns deine URL. <em className="font-editorial">Wir geben dir einen Score.</em></>
          )
        }
        lede={t.audit.heroSubtitle}
        cta={
          <CTAButton
            variant="primary"
            size="lg"
            location="audit-hero"
            onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {isEnglish ? 'Start the audit' : 'Audit starten'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </CTAButton>
        }
        annotation={t.audit.trustLine}
        meta={
          <>
            <span>{isEnglish ? '2–5 min' : '2–5 Min'}</span>
            <span aria-hidden>·</span>
            <span>{isEnglish ? 'No credit card' : 'Keine Kreditkarte'}</span>
            <span aria-hidden>·</span>
            <span>{isEnglish ? 'No follow-up spam' : 'Kein Spam'}</span>
          </>
        }
      />

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Form + sticky framing */}
      <section id="audit-form" className="section-padding">
        <div className="container-section">
          <SectionMarker index={1} total={3} label={isEnglish ? 'The Form' : 'Das Formular'} />
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-28 space-y-8">
                <RevealText>
                  <h2 className="text-balance">
                    {isEnglish ? (
                      <>Tell us about <em className="font-editorial">your business.</em></>
                    ) : (
                      <>Erzähl uns von <em className="font-editorial">deinem Business.</em></>
                    )}
                  </h2>
                  <p className="mt-6 text-base text-foreground/70 max-w-sm">
                    {isEnglish
                      ? 'Five short fields. The scanner does the rest in minutes — you can leave the page once submitted.'
                      : 'Fünf kurze Felder. Der Scanner erledigt den Rest in Minuten — du kannst die Seite nach dem Absenden verlassen.'}
                  </p>
                </RevealText>
                <AIAnnotation>
                  {isEnglish
                    ? 'scanner · firecrawl + pagespeed + observatory · partial-result aware'
                    : 'scanner · firecrawl + pagespeed + observatory · liefert auch Teilergebnisse'}
                </AIAnnotation>
              </div>
            </aside>
            <div className="col-span-12 lg:col-span-8">
              <div className="card-paper p-6 sm:p-10">
                <AuditFormStepper />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Deliverables */}
      <section className="section-padding bg-secondary/40">
        <div className="container-section">
          <SectionMarker index={2} total={3} label={isEnglish ? 'What you get' : 'Was du bekommst'} />
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12 lg:col-span-5">
              <RevealText>
                <h2 className="text-balance">
                  {isEnglish ? (
                    <>A real number. <em className="font-editorial">A real next step.</em></>
                  ) : (
                    <>Eine echte Zahl. <em className="font-editorial">Ein echter nächster Schritt.</em></>
                  )}
                </h2>
              </RevealText>
            </div>
            <ul className="col-span-12 lg:col-span-7 lg:border-l lg:border-border lg:pl-10 divide-y divide-border">
              {deliverables.map((item, i) => (
                <li key={i} className="flex items-start gap-5 py-5 first:pt-0">
                  <span className="font-mono text-xs text-foreground/55 mt-2 w-6 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-lg text-foreground/85 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Process */}
      <section className="section-padding">
        <div className="container-section">
          <SectionMarker index={3} total={3} label={isEnglish ? 'The process' : 'Der Ablauf'} />
          <RevealText>
            <h2 className="text-balance max-w-3xl">
              {isEnglish ? (
                <>Three small moves. <em className="font-editorial">One clean report.</em></>
              ) : (
                <>Drei kleine Schritte. <em className="font-editorial">Ein klarer Report.</em></>
              )}
            </h2>
          </RevealText>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {procSteps.map((step, i) => (
              <div key={i} className="bg-background p-8 md:p-10">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/55 mb-4">
                  Step {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-editorial text-2xl md:text-3xl font-light text-foreground">
                  {step.title}
                </h3>
                <p className="mt-4 text-base text-foreground/70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funnel nav */}
      <FunnelNav
        current={{ index: 2, total: 5, label: me.label }}
        prev={prev}
        next={next}
        nextCtaLabel={isEnglish ? 'See packages →' : 'Pakete ansehen →'}
        copy={isEnglish
          ? "Submitted? You'll get the score. Curious what comes after — see the packages."
          : 'Abgeschickt? Du bekommst den Score. Neugierig, was danach folgt — sieh dir die Pakete an.'}
        location="audit"
      />
    </Layout>
  );
}
