import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AuditFormStepper } from '@/components/forms/AuditFormStepper';
import { Check, Zap, Target, Settings, ArrowRight } from 'lucide-react';

export default function AuditPage() {
  const { t, isEnglish } = useLanguage();
  const navigate = useNavigate();

  return (
    <Layout>
      <SEOHead
        title={t.audit.heroTitle}
        description={t.audit.heroSubtitle}
      />

      {/* Hero */}
      <section className="relative hero-pattern">
        <SectionContainer padding="large">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">{t.audit.heroTitle}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              {t.audit.heroSubtitle}
            </p>
            <p className="text-sm text-muted-foreground mb-8">{t.audit.trustLine}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                variant="primary"
                size="lg"
                onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}
                location="audit-hero"
              >
                {t.cta.startAudit}
                <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <CTAButton
                variant="secondary"
                size="lg"
                href={isEnglish ? '/en/free-call' : '/gratis-call'}
                location="audit-hero"
              >
                {t.cta.bookCall}
              </CTAButton>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Audit Form with Stepper */}
      <SectionContainer id="audit-form" background="muted">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-2 text-center">{t.cta.startAudit}</h2>
            <p className="text-sm text-muted-foreground text-center mb-8">
              {isEnglish ? 'Takes about 2-5 minutes' : 'Dauert ca. 2-5 Minuten'}
            </p>
            <AuditFormStepper />
          </div>
        </div>
      </SectionContainer>

      {/* Deliverables */}
      <SectionContainer>
        <SectionHeader title={t.audit.deliverables.title} />
        <div className="max-w-2xl mx-auto">
          <ul className="space-y-4">
            {t.audit.deliverables.items.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionContainer>

      {/* What We Check */}
      <SectionContainer background="muted">
        <SectionHeader title={t.audit.whatWeCheck.title} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border">
            <Zap className="w-10 h-10 text-primary mb-4" />
            <p className="font-medium text-foreground">{t.audit.whatWeCheck.traffic}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border">
            <Target className="w-10 h-10 text-primary mb-4" />
            <p className="font-medium text-foreground">{t.audit.whatWeCheck.conversion}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border">
            <Settings className="w-10 h-10 text-primary mb-4" />
            <p className="font-medium text-foreground">{t.audit.whatWeCheck.ops}</p>
          </div>
        </div>
      </SectionContainer>

      {/* Steps */}
      <SectionContainer>
        <SectionHeader title={t.audit.steps.title} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[t.audit.steps.step1, t.audit.steps.step2, t.audit.steps.step3].map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Pricing Teaser */}
      <SectionContainer background="accent">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">
            {isEnglish ? 'See our packages' : 'Unsere Pakete'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {isEnglish
              ? 'From one-time sprints to ongoing retainers.'
              : 'Von einmaligen Sprints bis zu laufenden Retainern.'}
          </p>
          <CTAButton
            variant="secondary"
            href={isEnglish ? '/en/pricing' : '/pakete'}
            location="audit-pricing-teaser"
          >
            {isEnglish ? 'View pricing' : 'Pakete ansehen'}
          </CTAButton>
        </div>
      </SectionContainer>

      {/* Audit FAQ */}
      <SectionContainer>
        <SectionHeader title={t.faq.sectionTitle} />
        <div className="max-w-3xl mx-auto">
          <FAQAccordion items={t.faq.auditItems} />
        </div>
      </SectionContainer>
    </Layout>
  );
}
