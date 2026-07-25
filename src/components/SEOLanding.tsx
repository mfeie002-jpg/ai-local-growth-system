import { ReactNode } from 'react';
import { Layout } from '@/components/Layout';
import { SEOHead, ServiceSchema, FAQSchema } from '@/components/SEOHead';
import { CTAButton } from '@/components/CTAButton';
import { EditorialHero, SectionMarker, RevealText } from '@/components/neural';
import { Check, ArrowRight } from 'lucide-react';

export interface SEOLandingFAQ {
  question: string;
  answer: string;
}

export interface SEOLandingProps {
  /** SEO */
  metaTitle: string;
  metaDescription: string;
  serviceSchemaName?: string;
  serviceSchemaDescription?: string;
  /** Hero */
  eyebrow: string;
  headline: ReactNode;
  lede: string;
  primaryCta: { label: string; href: string; location: string };
  secondaryCta?: { label: string; href: string; location: string };
  annotation?: string;
  /** Problem section */
  problemLabel: string;
  problemHeadline: string;
  problemPoints: string[];
  /** What we analyze / deliver */
  analysisLabel: string;
  analysisHeadline: string;
  analysisItems: { num: string; title: string; body: string }[];
  /** Process */
  processLabel: string;
  processSteps: { num: string; title: string; body: string }[];
  /** FAQ (visible + JSON-LD synced) */
  faqLabel?: string;
  faqItems?: SEOLandingFAQ[];
  /** Final CTA */
  finalHeadline: ReactNode;
  finalBody: string;
}

/**
 * Shared SEO landing template for /website-audit, /seo-analyse, /ai-visibility,
 * /fuer-kmu, /partner. All copy comes from props — no fabricated metrics.
 */
export function SEOLanding(props: SEOLandingProps) {
  const {
    metaTitle,
    metaDescription,
    serviceSchemaName,
    serviceSchemaDescription,
    eyebrow,
    headline,
    lede,
    primaryCta,
    secondaryCta,
    annotation,
    problemLabel,
    problemHeadline,
    problemPoints,
    analysisLabel,
    analysisHeadline,
    analysisItems,
    processLabel,
    processSteps,
    faqLabel,
    faqItems,
    finalHeadline,
    finalBody,
  } = props;

  return (
    <Layout>
      <SEOHead title={metaTitle} description={metaDescription} />
      {serviceSchemaName && serviceSchemaDescription && (
        <ServiceSchema name={serviceSchemaName} description={serviceSchemaDescription} />
      )}
      {faqItems && faqItems.length > 0 && (
        <FAQSchema items={faqItems.map((f) => ({ question: f.question, answer: f.answer }))} />
      )}

      <EditorialHero
        eyebrow={eyebrow}
        title={headline}
        lede={lede}
        cta={
          <div className="flex flex-wrap gap-3">
            <CTAButton variant="primary" size="lg" href={primaryCta.href} location={primaryCta.location}>
              {primaryCta.label} <ArrowRight className="ml-2 h-4 w-4" />
            </CTAButton>
            {secondaryCta && (
              <CTAButton variant="ghost" size="lg" href={secondaryCta.href} location={secondaryCta.location}>
                {secondaryCta.label}
              </CTAButton>
            )}
          </div>
        }
        annotation={annotation}
      />

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Problem */}
      <section className="section-padding">
        <div className="container-section">
          <SectionMarker index={1} total={4} label={problemLabel} />
          <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-start">
            <div className="col-span-12 lg:col-span-5">
              <RevealText>
                <h2 className="text-balance">{problemHeadline}</h2>
              </RevealText>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <ul className="space-y-4">
                {problemPoints.map((point, i) => (
                  <li key={i} className="flex gap-4 border-b border-border/40 pb-4">
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-signal shrink-0 pt-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-foreground/85 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Analysis / Deliverables */}
      <section className="section-padding bg-secondary/40">
        <div className="container-section">
          <SectionMarker index={2} total={4} label={analysisLabel} />
          <RevealText>
            <h2 className="text-balance max-w-3xl mb-10">{analysisHeadline}</h2>
          </RevealText>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {analysisItems.map((item) => (
              <div key={item.num} className="card-paper p-6 sm:p-8">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-signal mb-3">
                  {item.num}
                </div>
                <h3 className="font-editorial text-2xl font-light text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-foreground/75 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Process */}
      <section className="section-padding">
        <div className="container-section">
          <SectionMarker index={3} total={4} label={processLabel} />
          <ol className="space-y-6 max-w-3xl">
            {processSteps.map((step) => (
              <li key={step.num} className="flex gap-6 border-t border-border/40 pt-6">
                <span className="font-mono text-sm uppercase tracking-[0.2em] text-signal shrink-0 pt-1 w-10">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-editorial text-xl text-foreground mb-2">{step.title}</h3>
                  <p className="text-foreground/75 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      {faqItems && faqItems.length > 0 && (
        <>
          <div className="container-section"><div className="rule-hairline" /></div>
          <section className="section-padding bg-secondary/30">
            <div className="container-section">
              <SectionMarker index={4} total={4} label={faqLabel || 'FAQ'} />
              <div className="space-y-3 max-w-3xl">
                {faqItems.map((faq, i) => (
                  <details key={i} className="group card-paper p-5 sm:p-6">
                    <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                      <span className="font-editorial text-lg text-foreground">
                        {faq.question}
                      </span>
                      <span className="font-mono text-xs text-signal shrink-0 mt-1.5 group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-foreground/75 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <div className="container-section"><div className="rule-hairline" /></div>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container-section">
          <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-8">
              <RevealText>
                <h2 className="text-balance">{finalHeadline}</h2>
                <p className="mt-6 text-lg text-foreground/75 max-w-2xl">{finalBody}</p>
              </RevealText>
            </div>
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 lg:items-end">
              <CTAButton variant="primary" size="lg" href={primaryCta.href} location={`${primaryCta.location}-final`}>
                {primaryCta.label} <ArrowRight className="ml-2 h-4 w-4" />
              </CTAButton>
              {secondaryCta && (
                <CTAButton variant="ghost" size="lg" href={secondaryCta.href} location={`${secondaryCta.location}-final`}>
                  {secondaryCta.label}
                </CTAButton>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
