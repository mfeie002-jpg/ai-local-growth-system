import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { PricingCard } from '@/components/PricingCard';
import { CTAButton } from '@/components/CTAButton';
import { ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const { t, isEnglish } = useLanguage();

  return (
    <Layout showDemoTeaser>
      <SEOHead
        title={t.pricing.sectionTitle}
        description={t.pricing.disclaimer}
      />

      {/* Hero */}
      <section className="relative hero-pattern">
        <SectionContainer padding="large">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">{t.pricing.sectionTitle}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.pricing.disclaimer}
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* Pricing Cards */}
      <SectionContainer background="muted">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          <PricingCard
            name={t.pricing.launch.name}
            duration={t.pricing.launch.duration}
            forWhom={t.pricing.launch.forWhom}
            price={t.pricing.launch.price}
            features={t.pricing.launch.features}
            isMonthly={false}
          />
          <PricingCard
            name={t.pricing.growth.name}
            duration={t.pricing.growth.duration}
            forWhom={t.pricing.growth.forWhom}
            price={t.pricing.growth.price}
            features={t.pricing.growth.features}
            highlighted
          />
          <PricingCard
            name={t.pricing.leader.name}
            duration={t.pricing.leader.duration}
            forWhom={t.pricing.leader.forWhom}
            price={t.pricing.leader.price}
            priceNote={t.pricing.leader.priceNote}
            features={t.pricing.leader.features}
          />
        </div>

        {/* Disclaimer */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-6 rounded-xl bg-card border border-border">
            <p className="text-muted-foreground">{t.pricing.templateNote}</p>
          </div>
        </div>
      </SectionContainer>

      {/* What's Included */}
      <SectionContainer>
        <SectionHeader 
          title={isEnglish ? 'What\'s not included?' : 'Was ist nicht inklusive?'}
        />
        <div className="max-w-2xl mx-auto">
          <div className="bg-accent rounded-xl p-6 sm:p-8 border border-border">
            <h3 className="font-semibold mb-4">Ad Spend</h3>
            <p className="text-muted-foreground mb-4">
              {isEnglish
                ? 'Ad spend is paid directly to Google/Meta by you. This gives you full control and transparency over your advertising budget.'
                : 'Ad Spend zahlst du direkt an Google/Meta. Das gibt dir volle Kontrolle und Transparenz über dein Werbebudget.'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isEnglish
                ? 'Typical monthly ad spend for local services: CHF 1,000 – CHF 5,000'
                : 'Typisches monatliches Ad Spend für Local Services: CHF 1\'000 – CHF 5\'000'}
            </p>
          </div>
        </div>
      </SectionContainer>

      {/* CTA */}
      <SectionContainer className="gradient-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-primary-foreground mb-4">
            {isEnglish ? 'Not sure which package?' : 'Unsicher welches Paket?'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            {isEnglish
              ? 'Start with a free audit. We\'ll recommend the right approach for your situation.'
              : 'Starte mit einem Gratis Audit. Wir empfehlen den richtigen Ansatz für deine Situation.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              variant="secondary"
              size="lg"
              href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
              location="pricing-cta"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              {t.cta.getAudit}
              <ArrowRight className="ml-2 w-5 h-5" />
            </CTAButton>
            <CTAButton
              variant="ghost"
              size="lg"
              href={isEnglish ? '/en/free-call' : '/gratis-call'}
              location="pricing-cta"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              {t.cta.bookCall}
            </CTAButton>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
