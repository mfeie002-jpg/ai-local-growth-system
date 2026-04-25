import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { PricingCard } from '@/components/PricingCard';
import { CTAButton } from '@/components/CTAButton';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export default function PricingPage() {
  const { t, isEnglish } = useLanguage();

  return (
    <Layout showDemoTeaser>
      <SEOHead title={t.pricing.sectionTitle} description={t.pricing.disclaimer} />

      {/* Hero — editorial */}
      <section className="relative overflow-hidden border-b border-border/50">
        {/* Background layers */}
        <div className="absolute inset-0 grid-pattern opacity-[0.15]" />
        <div className="noise-overlay absolute inset-0" />
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, hsl(var(--ai-accent) / 0.5), transparent 70%)' }}
        />

        <SectionContainer padding="large" className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Meta sidebar */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground">
                  ◆ 00 / Pricing
                </span>
                <div className="h-px w-16 bg-gradient-to-r from-primary to-transparent" />
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {isEnglish
                    ? 'Transparent packages. No hidden fees. Built for ambitious local brands.'
                    : 'Transparente Pakete. Keine versteckten Kosten. Für ambitionierte lokale Brands.'}
                </p>
              </div>
            </div>

            {/* Headline */}
            <div className="lg:col-span-9 order-1 lg:order-2">
              <h1 className="font-editorial text-5xl sm:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight mb-8">
                {isEnglish ? (
                  <>
                    Investment that <br />
                    <span className="text-aurora italic">compounds.</span>
                  </>
                ) : (
                  <>
                    Investition, die <br />
                    <span className="text-aurora italic">sich potenziert.</span>
                  </>
                )}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {t.pricing.disclaimer}
              </p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Pricing Cards */}
      <section className="relative overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, hsl(var(--accent) / 0.4), transparent 70%)' }}
        />
        <SectionContainer className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 pt-4">
            <PricingCard
              index={0}
              name={t.pricing.launch.name}
              duration={t.pricing.launch.duration}
              forWhom={t.pricing.launch.forWhom}
              price={t.pricing.launch.price}
              features={t.pricing.launch.features}
              isMonthly={false}
            />
            <PricingCard
              index={1}
              name={t.pricing.growth.name}
              duration={t.pricing.growth.duration}
              forWhom={t.pricing.growth.forWhom}
              price={t.pricing.growth.price}
              features={t.pricing.growth.features}
              highlighted
              highlightLabel={isEnglish ? 'Most Popular' : 'Am Beliebtesten'}
            />
            <PricingCard
              index={2}
              name={t.pricing.leader.name}
              duration={t.pricing.leader.duration}
              forWhom={t.pricing.leader.forWhom}
              price={t.pricing.leader.price}
              priceNote={t.pricing.leader.priceNote}
              features={t.pricing.leader.features}
            />
          </div>

          {/* Disclaimer */}
          <div className="max-w-2xl mx-auto">
            <div className="glass-panel p-6 sm:p-8 text-center">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground block mb-3">
                ◇ Note
              </span>
              <p className="text-muted-foreground leading-relaxed">{t.pricing.templateNote}</p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* What's NOT included — asymmetric */}
      <section className="relative border-t border-border/50">
        <div className="noise-overlay absolute inset-0 opacity-50" />
        <SectionContainer className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground block mb-4">
                ◆ 01 / Transparency
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
                {isEnglish ? (
                  <>
                    What's <span className="text-aurora italic">not</span> included?
                  </>
                ) : (
                  <>
                    Was ist <span className="text-aurora italic">nicht</span> inklusive?
                  </>
                )}
              </h2>
            </div>

            <div className="lg:col-span-7">
              <div className="glass-panel p-8 sm:p-10 relative overflow-hidden">
                <div
                  className="absolute -top-20 -right-20 w-64 h-64 blur-3xl opacity-30"
                  style={{ background: 'radial-gradient(circle, hsl(var(--ai-accent) / 0.5), transparent 70%)' }}
                />
                <div className="relative">
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary block mb-3">
                    ◇ Ad Spend
                  </span>
                  <h3 className="font-editorial text-3xl font-semibold mb-5 leading-tight">
                    {isEnglish ? 'You pay platforms directly.' : 'Du zahlst Plattformen direkt.'}
                  </h3>
                  <p className="text-foreground/80 mb-6 leading-relaxed">
                    {isEnglish
                      ? 'Ad spend is paid directly to Google/Meta by you. This gives you full control and transparency over your advertising budget.'
                      : 'Ad Spend zahlst du direkt an Google/Meta. Das gibt dir volle Kontrolle und Transparenz über dein Werbebudget.'}
                  </p>
                  <div className="flex items-center gap-3 pt-6 border-t border-border/50">
                    <ArrowUpRight className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {isEnglish
                        ? 'Typical monthly: CHF 1,000 – CHF 5,000'
                        : 'Typisch monatlich: CHF 1\'000 – CHF 5\'000'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* CTA — high-impact */}
      <section className="relative overflow-hidden border-t border-border/50">
        <div className="absolute inset-0 grid-pattern opacity-[0.15]" />
        <div className="noise-overlay absolute inset-0" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at top left, hsl(var(--primary) / 0.3), transparent 60%), radial-gradient(ellipse at bottom right, hsl(var(--ai-accent) / 0.3), transparent 60%)',
          }}
        />
        <SectionContainer className="relative">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground block mb-6">
              ◆ 02 / Next Step
            </span>
            <h2 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight mb-6">
              {isEnglish ? (
                <>
                  Unsure which <br />
                  <span className="text-aurora italic">package?</span>
                </>
              ) : (
                <>
                  Unsicher welches <br />
                  <span className="text-aurora italic">Paket?</span>
                </>
              )}
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {isEnglish
                ? "Start with a free audit. We'll recommend the right approach for your situation."
                : 'Starte mit einem Gratis Audit. Wir empfehlen den richtigen Ansatz für deine Situation.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                variant="primary"
                size="lg"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location="pricing-cta"
                className="shadow-glow-intense"
              >
                {t.cta.getAudit}
                <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <CTAButton
                variant="secondary"
                size="lg"
                href={isEnglish ? '/en/free-call' : '/gratis-call'}
                location="pricing-cta"
              >
                {t.cta.bookCall}
              </CTAButton>
            </div>
          </div>
        </SectionContainer>
      </section>
    </Layout>
  );
}
