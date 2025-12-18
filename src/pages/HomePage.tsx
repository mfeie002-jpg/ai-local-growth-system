import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead, OrganizationSchema } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { PillarCard, AutomationCard } from '@/components/PillarCard';
import { PricingCard } from '@/components/PricingCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { 
  Zap, 
  Target, 
  Bot, 
  MessageSquare, 
  Mail, 
  Star, 
  BarChart3,
  ArrowRight 
} from 'lucide-react';

// Trust section config - set to true when you have proof elements
const TRUST_ENABLED = false;

export default function HomePage() {
  const { t, isEnglish } = useLanguage();

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'AI Growth System for Local Services' : 'AI Growth System für Local Services'}
        description={t.siteDescription}
      />
      <OrganizationSchema description={t.siteDescription} />

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-pattern">
        <SectionContainer padding="large" className="relative">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-accent text-accent-foreground animate-fade-in">
              {t.hero.trustLine}
            </span>
            <h1 className="text-balance mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              {t.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <CTAButton
                variant="primary"
                size="lg"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location="hero"
              >
                {t.cta.getAudit}
                <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <CTAButton
                variant="secondary"
                size="lg"
                href={isEnglish ? '/en/free-call' : '/gratis-call'}
                location="hero"
              >
                {t.cta.bookCall}
              </CTAButton>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Trust/Proof Section - Only shown if enabled */}
      {TRUST_ENABLED && (
        <SectionContainer background="muted" padding="small">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-2">Awards</h4>
              {/* Award logos would go here */}
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-2">Brands</h4>
              {/* Brand logos would go here */}
            </div>
          </div>
        </SectionContainer>
      )}

      {/* 3 Pillars Section */}
      <SectionContainer id="system">
        <SectionHeader title={t.pillars.sectionTitle} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PillarCard
            icon={Zap}
            title={t.pillars.traffic.title}
            description={t.pillars.traffic.description}
          />
          <PillarCard
            icon={Target}
            title={t.pillars.conversion.title}
            description={t.pillars.conversion.description}
          />
          <PillarCard
            icon={Bot}
            title={t.pillars.aiOps.title}
            description={t.pillars.aiOps.description}
          />
        </div>
      </SectionContainer>

      {/* Gratis Audit Teaser */}
      <SectionContainer background="accent">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-4">{isEnglish ? 'Start with a Free Audit' : 'Starte mit einem Gratis Audit'}</h2>
          <p className="text-lg text-muted-foreground mb-8">
            {isEnglish
              ? 'Get a comprehensive scorecard of your digital presence. No strings attached.'
              : 'Erhalte eine umfassende Scorecard deiner digitalen Präsenz. Ohne Verpflichtung.'}
          </p>
          <CTAButton
            variant="primary"
            size="lg"
            href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
            location="audit-teaser"
          >
            {t.cta.getAudit}
            <ArrowRight className="ml-2 w-5 h-5" />
          </CTAButton>
        </div>
      </SectionContainer>

      {/* Pricing Section */}
      <SectionContainer id="pricing">
        <SectionHeader 
          title={t.pricing.sectionTitle}
          subtitle={t.pricing.disclaimer}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
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
        <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          {t.pricing.templateNote}
        </p>
      </SectionContainer>

      {/* Automations Section */}
      <SectionContainer background="muted" id="automations">
        <SectionHeader title={t.automations.sectionTitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <AutomationCard
            icon={MessageSquare}
            title={t.automations.leadConcierge.title}
            description={t.automations.leadConcierge.description}
          />
          <AutomationCard
            icon={Mail}
            title={t.automations.followUp.title}
            description={t.automations.followUp.description}
          />
          <AutomationCard
            icon={Star}
            title={t.automations.reviewHunter.title}
            description={t.automations.reviewHunter.description}
          />
          <AutomationCard
            icon={BarChart3}
            title={t.automations.reporting.title}
            description={t.automations.reporting.description}
          />
        </div>
      </SectionContainer>

      {/* Case Studies Section */}
      <SectionContainer>
        <SectionHeader title={t.caseStudies.sectionTitle} />
        <div className="max-w-xl mx-auto text-center py-12 px-8 rounded-xl border border-border bg-card">
          <p className="text-muted-foreground">{t.caseStudies.noData}</p>
          <CTAButton
            variant="primary"
            href={isEnglish ? '/en/free-call' : '/gratis-call'}
            location="case-studies"
            className="mt-6"
          >
            {t.cta.bookCall}
          </CTAButton>
        </div>
      </SectionContainer>

      {/* FAQ Section */}
      <SectionContainer background="muted" id="faq">
        <SectionHeader title={t.faq.sectionTitle} />
        <div className="max-w-3xl mx-auto">
          <FAQAccordion items={t.faq.items} />
        </div>
      </SectionContainer>

      {/* Final CTA */}
      <SectionContainer className="gradient-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-primary-foreground mb-4">
            {isEnglish ? 'Ready to grow?' : 'Bereit zu wachsen?'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            {isEnglish
              ? 'Get your free audit and discover your growth potential.'
              : 'Hol dir dein Gratis Audit und entdecke dein Wachstumspotential.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              variant="secondary"
              size="lg"
              href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
              location="footer-cta"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              {t.cta.getAudit}
            </CTAButton>
            <CTAButton
              variant="ghost"
              size="lg"
              href={isEnglish ? '/en/free-call' : '/gratis-call'}
              location="footer-cta"
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
