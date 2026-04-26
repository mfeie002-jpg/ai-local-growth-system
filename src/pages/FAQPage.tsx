import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead, FAQSchema } from '@/components/SEOHead';
import { FAQAccordion } from '@/components/FAQAccordion';
import { CTAButton } from '@/components/CTAButton';
import {
  EditorialHero,
  SectionMarker,
  RevealText,
  FunnelNav,
  getFunnelSteps,
} from '@/components/neural';
import { ArrowRight } from 'lucide-react';

/**
 * FAQPage — Funnel step 05 / 05 · Clarify (loop-back).
 * Two CTAs at the end: re-enter via audit (first turn of the loop)
 * or talk via call. Previous step = Call.
 */
export default function FAQPage() {
  const { t, isEnglish } = useLanguage();
  const steps = getFunnelSteps(isEnglish);
  const me = steps[4];
  const prev = steps[3];
  const auditStep = steps[1];

  const allFAQItems = [...t.faq.items, ...t.faq.auditItems];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'FAQ · Frequently Asked Questions' : 'FAQ · Häufige Fragen'}
        description={isEnglish
          ? 'Frequently asked questions about our AI growth system for local services in Switzerland.'
          : 'Häufig gestellte Fragen zu unserem KI-Growth-System für Schweizer Dienstleister.'}
      />
      <FAQSchema items={allFAQItems} />

      {/* Hero */}
      <EditorialHero
        eyebrow={`${me.hint} · ${me.label}`}
        title={
          isEnglish ? (
            <>Questions, <em className="font-editorial">answered.</em></>
          ) : (
            <>Fragen, <em className="font-editorial">beantwortet.</em></>
          )
        }
        lede={isEnglish
          ? `${allFAQItems.length} curated answers — distilled from hundreds of conversations with Swiss founders and operators. No fluff, no sales script.`
          : `${allFAQItems.length} kuratierte Antworten — destilliert aus hunderten Gesprächen mit Schweizer Gründern und Operators. Kein Fluff, kein Verkaufsskript.`}
        annotation={isEnglish
          ? 'Tap any question to expand. Still missing something? Step back to the call.'
          : 'Tippe eine Frage zum Aufklappen. Fehlt etwas? Zurück zum Call.'}
      />

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* FAQ list */}
      <section className="section-padding">
        <div className="container-section">
          <SectionMarker index={1} total={2} label={isEnglish ? 'The questions' : 'Die Fragen'} />
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-28 space-y-6">
                <RevealText>
                  <h2 className="text-balance">
                    {isEnglish ? (
                      <>The most asked, <em className="font-editorial">unfiltered.</em></>
                    ) : (
                      <>Die meistgestellten, <em className="font-editorial">ungefiltert.</em></>
                    )}
                  </h2>
                </RevealText>
                <p className="text-base text-foreground/65 max-w-sm">
                  {isEnglish
                    ? 'If your question isn\'t here, the 20-minute call almost certainly covers it.'
                    : 'Steht deine Frage nicht hier, beantwortet sie der 20-Minuten-Call fast sicher.'}
                </p>
              </div>
            </aside>
            <div className="col-span-12 lg:col-span-8">
              <FAQAccordion items={allFAQItems} />
            </div>
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Loop-back */}
      <section className="section-padding bg-secondary/40">
        <div className="container-section">
          <SectionMarker index={2} total={2} label={isEnglish ? 'Two ways forward' : 'Zwei Wege weiter'} />
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end">
            <RevealText className="col-span-12 lg:col-span-8">
              <h2 className="text-balance">
                {isEnglish ? (
                  <>Now you've read everything. <em className="font-editorial">Pick a door.</em></>
                ) : (
                  <>Jetzt weißt du alles. <em className="font-editorial">Such dir eine Tür aus.</em></>
                )}
              </h2>
              <p className="mt-6 text-lg text-foreground/75 max-w-xl">
                {isEnglish
                  ? 'Run the AI audit and get the score yourself, or talk it through with us first.'
                  : 'Starte das KI-Audit und hol dir den Score, oder besprich es zuerst mit uns.'}
              </p>
            </RevealText>
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 lg:items-end">
              <CTAButton variant="primary" size="lg" href={auditStep.href} location="faq-loop-audit">
                {isEnglish ? 'Run free audit' : 'Gratis-Audit starten'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </CTAButton>
              <CTAButton variant="ghost" size="lg" href={prev.href} location="faq-loop-call">
                ← {prev.label}
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Funnel nav (no next — loops back) */}
      <FunnelNav
        current={{ index: 5, total: 5, label: me.label }}
        prev={prev}
        next={auditStep}
        nextCtaLabel={isEnglish ? 'Run free audit →' : 'Gratis-Audit starten →'}
        copy={isEnglish
          ? 'You\'ve reached the end of the funnel. The audit is the door back in.'
          : 'Du bist am Ende des Funnels. Das Audit ist die Tür zurück.'}
        location="faq"
      />
    </Layout>
  );
}
