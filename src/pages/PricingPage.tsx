import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { CTAButton } from '@/components/CTAButton';
import { PricingCard } from '@/components/PricingCard';
import {
  EditorialHero,
  SectionMarker,
  RevealText,
  FunnelNav,
  getFunnelSteps,
} from '@/components/neural';
import { ArrowRight } from 'lucide-react';

/**
 * PricingPage — Funnel step 03 / 05 · Commit.
 * Three packages, transparency on what's NOT included, then push to call.
 * Previous: Audit. Next: Call.
 */
export default function PricingPage() {
  const { t, isEnglish } = useLanguage();
  const steps = getFunnelSteps(isEnglish);
  const me = steps[2];
  const prev = steps[1];
  const next = steps[3];

  return (
    <Layout>
      <SEOHead title={t.pricing.sectionTitle} description={t.pricing.disclaimer} />

      {/* Hero */}
      <EditorialHero
        eyebrow={`${me.hint} · ${me.label}`}
        title={
          isEnglish ? (
            <>Investment that <em className="font-editorial">compounds.</em></>
          ) : (
            <>Investition, die sich <em className="font-editorial">summiert.</em></>
          )
        }
        lede={t.pricing.disclaimer}
        cta={
          <CTAButton variant="primary" size="lg" href={next.href} location="pricing-hero">
            {isEnglish ? 'Talk it through →' : 'Drüber sprechen →'}
          </CTAButton>
        }
        annotation={
          isEnglish
            ? 'Three sizes · Launch Sprint · Growth Retainer · Scale Retainer · ad spend paid by you, directly'
            : 'Drei Grössen · Launch Sprint · Growth Retainer · Scale Retainer · Ad Spend zahlen Sie direkt'
        }
      />

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Pricing cards */}
      <section className="section-padding">
        <div className="container-section">
          <SectionMarker index={1} total={3} label={isEnglish ? 'Three packages' : 'Drei Pakete'} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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

          <div className="mt-12 max-w-2xl mx-auto card-paper p-6 sm:p-8 text-center">
            <div className="section-marker mb-3">{isEnglish ? 'Note' : 'Hinweis'}</div>
            <p className="text-foreground/70 leading-relaxed">{t.pricing.templateNote}</p>
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Not included */}
      <section className="section-padding bg-secondary/40">
        <div className="container-section">
          <SectionMarker index={2} total={3} label={isEnglish ? 'Transparency' : 'Transparenz'} />
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-start">
            <div className="col-span-12 lg:col-span-5">
              <RevealText>
                <h2 className="text-balance">
                  {isEnglish ? (
                    <>What's <em className="font-editorial">not</em> included?</>
                  ) : (
                    <>Was ist <em className="font-editorial">nicht</em> inklusive?</>
                  )}
                </h2>
              </RevealText>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <div className="card-paper p-8 sm:p-10">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-signal mb-4">
                  Ad Spend
                </div>
                <h3 className="font-editorial text-3xl font-light text-foreground">
                  {isEnglish ? 'You pay platforms directly.' : 'Du zahlst Plattformen direkt.'}
                </h3>
                <p className="mt-5 text-foreground/75 leading-relaxed">
                  {isEnglish
                    ? 'Ad spend is paid directly to Google/Meta by you. This gives you full control and transparency over your advertising budget.'
                    : 'Ad Spend zahlst du direkt an Google/Meta. Das gibt dir volle Kontrolle und Transparenz über dein Werbebudget.'}
                </p>
                <div className="mt-8 pt-6 border-t border-border font-mono text-sm text-foreground/65">
                  {isEnglish
                    ? 'Typical monthly: CHF 1,000 – CHF 5,000'
                    : "Typisch monatlich: CHF 1'000 – CHF 5'000"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Decision section */}
      <section className="section-padding">
        <div className="container-section">
          <SectionMarker index={3} total={3} label={isEnglish ? 'Unsure which?' : 'Unsicher welches?'} />
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 items-end">
            <div className="col-span-12 lg:col-span-8">
              <RevealText>
                <h2 className="text-balance">
                  {isEnglish ? (
                    <>Skip the guesswork. <em className="font-editorial">Book a free call.</em></>
                  ) : (
                    <>Schluss mit Raten. <em className="font-editorial">Buch einen Gratis-Call.</em></>
                  )}
                </h2>
                <p className="mt-6 text-lg text-foreground/75 max-w-xl">
                  {isEnglish
                    ? '20 focused minutes. We look at your audit (or run one live) and tell you which package fits — or that none does, yet.'
                    : '20 fokussierte Minuten. Wir schauen auf dein Audit (oder fahren live eines) und sagen dir, welches Paket passt — oder dass noch keines passt.'}
                </p>
              </RevealText>
            </div>
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 lg:items-end">
              <CTAButton variant="primary" size="lg" href={next.href} location="pricing-decision">
                {isEnglish ? 'Book free call' : 'Gratis-Call buchen'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </CTAButton>
              <CTAButton variant="ghost" size="lg" href={prev.href} location="pricing-decision">
                {isEnglish ? '← Back to audit' : '← Zum Audit'}
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Funnel nav */}
      <FunnelNav
        current={{ index: 3, total: 5, label: me.label }}
        prev={prev}
        next={next}
        nextCtaLabel={isEnglish ? 'Talk to a human →' : 'Mit Mensch sprechen →'}
        copy={isEnglish
          ? 'You\'ve seen the shape. A 20-minute call closes the gap from price to plan.'
          : 'Du kennst die Form. Ein 20-Minuten-Call schließt die Lücke von Preis zu Plan.'}
        location="pricing"
      />
    </Layout>
  );
}
