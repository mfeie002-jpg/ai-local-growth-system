import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { FAQAccordion } from '@/components/FAQAccordion';
import { CTAButton } from '@/components/CTAButton';
import { ArrowRight } from 'lucide-react';

export default function FAQPage() {
  const { t, isEnglish } = useLanguage();

  // Combine main FAQ items with audit-specific ones for the full FAQ page
  const allFAQItems = [...t.faq.items, ...t.faq.auditItems];

  return (
    <Layout>
      <SEOHead
        title={t.faq.sectionTitle}
        description={isEnglish 
          ? 'Frequently asked questions about our AI growth system for local services in Switzerland.'
          : 'Häufig gestellte Fragen zu unserem AI Growth System für Local Services in der Schweiz.'}
      />

      {/* Hero */}
      <section className="relative hero-pattern">
        <SectionContainer padding="large">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">{t.faq.sectionTitle}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              {isEnglish
                ? 'Everything you need to know about working with us.'
                : 'Alles was du über die Zusammenarbeit mit uns wissen musst.'}
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* FAQ */}
      <SectionContainer background="muted">
        <div className="max-w-3xl mx-auto">
          <FAQAccordion items={allFAQItems} />
        </div>
      </SectionContainer>

      {/* Still have questions? */}
      <SectionContainer>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="mb-4">
            {isEnglish ? 'Still have questions?' : 'Noch Fragen?'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isEnglish
              ? 'Book a free call and we\'ll answer everything personally.'
              : 'Buche einen Gratis Call und wir beantworten alles persönlich.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
    </Layout>
  );
}
