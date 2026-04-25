import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { FAQAccordion } from '@/components/FAQAccordion';
import { AuditFormStepper } from '@/components/forms/AuditFormStepper';
import { Check, Zap, Target, Settings, ArrowRight, ArrowUpRight, ClipboardCheck } from 'lucide-react';

export default function AuditPage() {
  const { t, isEnglish } = useLanguage();
  const navigate = useNavigate();

  const checkItems = [
    { icon: Zap, label: t.audit.whatWeCheck.traffic, num: '01' },
    { icon: Target, label: t.audit.whatWeCheck.conversion, num: '02' },
    { icon: Settings, label: t.audit.whatWeCheck.ops, num: '03' },
  ];

  const steps = [t.audit.steps.step1, t.audit.steps.step2, t.audit.steps.step3];

  return (
    <Layout showDemoTeaser>
      <SEOHead
        title={t.audit.heroTitle}
        description={t.audit.heroSubtitle}
      />

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
            <aside className="lg:col-span-3 order-2 lg:order-1 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8" style={{ background: 'var(--gradient-aurora)' }} />
                <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  {isEnglish ? '§ 01 / Free Audit' : '§ 01 / Gratis Audit'}
                </span>
              </div>
              <div className="glass-panel rounded-2xl p-5 space-y-3">
                <ClipboardCheck className="h-6 w-6 text-aurora" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.audit.trustLine}
                </p>
              </div>
            </aside>

            <div className="lg:col-span-9 order-1 lg:order-2">
              <h1 className="font-editorial font-semibold leading-[0.9] tracking-tight text-5xl sm:text-7xl md:text-8xl">
                <span className="block text-foreground">{t.audit.heroTitle.split(' ').slice(0, -1).join(' ') || t.audit.heroTitle}</span>
                <span className="block italic text-aurora">{t.audit.heroTitle.split(' ').slice(-1)[0]}</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {t.audit.heroSubtitle}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
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
          </div>
        </SectionContainer>
      </section>

      {/* Audit Form */}
      <section id="audit-form" className="relative">
        <div className="absolute inset-0 noise-overlay opacity-50" aria-hidden />
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-32 space-y-4">
                <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  {isEnglish ? '— Step 01' : '— Schritt 01'}
                </span>
                <h2 className="font-editorial text-4xl font-semibold leading-tight">
                  {isEnglish ? (
                    <>Tell us about <span className="italic text-aurora">your business.</span></>
                  ) : (
                    <>Erzähle uns von <span className="italic text-aurora">deinem Business.</span></>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isEnglish ? 'Takes about 2-5 minutes. No credit card. No follow-up spam.' : 'Dauert ca. 2-5 Minuten. Keine Kreditkarte. Kein Spam.'}
                </p>
              </div>
            </aside>
            <div className="lg:col-span-8">
              <div className="glass-panel rounded-2xl p-6 sm:p-10">
                <AuditFormStepper />
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Deliverables */}
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
              {isEnglish ? '— Deliverables' : '— Was du bekommst'}
            </span>
            <h2 className="mt-4 font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
              {t.audit.deliverables.title}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-border/60">
              {t.audit.deliverables.items.map((item, index) => (
                <li key={index} className="flex items-start gap-5 py-5">
                  <span className="font-editorial text-aurora text-sm tracking-widest pt-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Check className="w-5 h-5 text-aurora mt-1 flex-shrink-0" />
                  <span className="text-foreground text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionContainer>

      {/* What We Check */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-60" aria-hidden />
        <SectionContainer>
          <div className="mb-12 max-w-3xl">
            <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
              {isEnglish ? '— Scope' : '— Umfang'}
            </span>
            <h2 className="mt-4 font-editorial text-4xl sm:text-6xl font-semibold leading-tight">
              {t.audit.whatWeCheck.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-border/60">
            {checkItems.map(({ icon: Icon, label, num }) => (
              <div key={num} className="border-b md:border-b-0 md:border-r last:md:border-r-0 border-border/60 p-8 group hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-8">
                  <span className="font-editorial text-aurora text-sm tracking-widest">{num}</span>
                  <Icon className="w-8 h-8 text-aurora" />
                </div>
                <p className="font-editorial text-2xl text-foreground leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* Steps */}
      <SectionContainer>
        <div className="mb-12 max-w-3xl">
          <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
            {isEnglish ? '— Process' : '— Ablauf'}
          </span>
          <h2 className="mt-4 font-editorial text-4xl sm:text-6xl font-semibold leading-tight">
            {t.audit.steps.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="font-editorial text-7xl text-aurora italic leading-none mb-6">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="font-editorial text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Pricing Teaser — Sunset CTA */}
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
              {isEnglish ? '— Ready to commit?' : '— Bereit für mehr?'}
            </span>
            <h2 className="mt-6 font-editorial font-semibold leading-[0.95] tracking-tight text-4xl sm:text-6xl md:text-7xl">
              {isEnglish ? (
                <>See our <span className="italic text-aurora">packages.</span></>
              ) : (
                <>Unsere <span className="italic text-aurora">Pakete.</span></>
              )}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              {isEnglish ? 'From one-time sprints to ongoing retainers.' : 'Von einmaligen Sprints bis zu laufenden Retainern.'}
            </p>
            <div className="mt-10">
              <CTAButton
                variant="primary"
                size="lg"
                href={isEnglish ? '/en/pricing' : '/pakete'}
                location="audit-pricing-teaser"
              >
                {isEnglish ? 'View pricing' : 'Pakete ansehen'}
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </CTAButton>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* FAQ */}
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-4">
              <span className="font-editorial text-xs tracking-[0.25em] uppercase text-muted-foreground">
                {isEnglish ? '— FAQ' : '— FAQ'}
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
                {t.faq.sectionTitle}
              </h2>
            </div>
          </aside>
          <div className="lg:col-span-8">
            <FAQAccordion items={t.faq.auditItems} />
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
