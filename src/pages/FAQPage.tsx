import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead, FAQSchema } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { FAQAccordion } from '@/components/FAQAccordion';
import { CTAButton } from '@/components/CTAButton';
import { ArrowRight, MessageCircleQuestion } from 'lucide-react';

export default function FAQPage() {
  const { t, isEnglish } = useLanguage();

  const allFAQItems = [...t.faq.items, ...t.faq.auditItems];

  return (
    <Layout showPromo>
      <SEOHead
        title={isEnglish ? 'FAQ | Frequently Asked Questions' : 'FAQ | Häufig gestellte Fragen'}
        description={isEnglish
          ? 'Frequently asked questions about our AI growth system for local services in Switzerland. Learn about pricing, process, and results.'
          : 'Häufig gestellte Fragen zu unserem AI Growth System für Local Services in der Schweiz. Erfahren Sie mehr über Preise, Prozesse und Ergebnisse.'}
      />
      <FAQSchema items={allFAQItems} />

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
            {/* Meta sidebar */}
            <aside className="lg:col-span-3 order-2 lg:order-1 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-aurora" style={{ background: 'var(--gradient-aurora)' }} />
                <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  {isEnglish ? '§ 04 / Support' : '§ 04 / Support'}
                </span>
              </div>
              <div className="glass-panel rounded-2xl p-5 space-y-3">
                <MessageCircleQuestion className="h-6 w-6 text-aurora" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isEnglish
                    ? `${allFAQItems.length} curated answers — distilled from hundreds of conversations with founders and operators.`
                    : `${allFAQItems.length} kuratierte Antworten — destilliert aus hunderten Gesprächen mit Gründern und Operators.`}
                </p>
              </div>
            </aside>

            {/* Hero copy */}
            <div className="lg:col-span-9 order-1 lg:order-2">
              <h1 className="font-editorial font-semibold leading-[0.9] tracking-tight text-5xl sm:text-7xl md:text-8xl">
                <span className="block text-foreground">{isEnglish ? 'Questions,' : 'Fragen,'}</span>
                <span className="block italic text-aurora">{isEnglish ? 'answered.' : 'beantwortet.'}</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {isEnglish
                  ? 'Everything you need to know before working with us. No fluff, no sales script — just clear answers.'
                  : 'Alles was du wissen musst, bevor wir zusammenarbeiten. Kein Fluff, kein Verkaufsskript — nur klare Antworten.'}
              </p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* FAQ list */}
      <section className="relative">
        <div className="absolute inset-0 noise-overlay opacity-50" aria-hidden />
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-32 space-y-4">
                <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  {isEnglish ? 'Index' : 'Index'}
                </span>
                <h2 className="font-editorial text-3xl font-semibold leading-tight">
                  {isEnglish ? (
                    <>The most asked, <span className="italic text-aurora">unfiltered.</span></>
                  ) : (
                    <>Die meistgestellten, <span className="italic text-aurora">ungefiltert.</span></>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isEnglish
                    ? 'Tap any question to expand. Still missing something? Book a free call below.'
                    : 'Klicke eine Frage zum Aufklappen. Fehlt etwas? Buche unten einen Gratis Call.'}
                </p>
              </div>
            </aside>
            <div className="lg:col-span-9">
              <FAQAccordion items={allFAQItems} />
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{ background: 'var(--gradient-sunset)' }}
          aria-hidden
        />
        <div className="absolute inset-0 noise-overlay" aria-hidden />
        <SectionContainer>
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
              {isEnglish ? '— Still curious?' : '— Noch neugierig?'}
            </span>
            <h2 className="mt-6 font-editorial font-semibold leading-[0.95] tracking-tight text-4xl sm:text-6xl md:text-7xl">
              {isEnglish ? (
                <>Let's talk it <span className="italic text-aurora">through.</span></>
              ) : (
                <>Reden wir <span className="italic text-aurora">drüber.</span></>
              )}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              {isEnglish
                ? 'Book a free call and we\'ll answer everything personally — no obligations.'
                : 'Buche einen Gratis Call und wir beantworten alles persönlich — unverbindlich.'}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                variant="primary"
                size="lg"
                href={isEnglish ? '/en/free-call' : '/gratis-call'}
                location="faq-cta"
              >
                {t.cta.bookCall}
                <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <CTAButton
                variant="secondary"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location="faq-cta"
              >
                {t.cta.getAudit}
              </CTAButton>
            </div>
          </div>
        </SectionContainer>
      </section>
    </Layout>
  );
}
