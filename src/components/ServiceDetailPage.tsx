import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead, ServiceSchema } from '@/components/SEOHead';
import { SectionContainer } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
  TrendingUp,
  Clock,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceFeature {
  title: string;
  description: string;
}

interface CaseStudy {
  industry: string;
  result: string;
  metric: string;
}

interface ServicePageProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  features: ServiceFeature[];
  benefits: string[];
  caseStudies: CaseStudy[];
  isAI?: boolean;
  relatedServices?: { title: string; path: string }[];
  heroImage?: string;
}

export function ServiceDetailPage({
  icon: Icon,
  title,
  subtitle,
  description,
  features,
  benefits,
  caseStudies,
  isAI,
  relatedServices = [],
  heroImage,
}: ServicePageProps) {
  const { t, isEnglish } = useLanguage();

  return (
    <Layout>
      <SEOHead title={title} description={subtitle} />
      <ServiceSchema name={title} description={description || subtitle} />

      {/* ============ HERO — Editorial / Maximalist ============ */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-32">
        {/* Aurora orbs */}
        <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-60 animate-float"
             style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)' }} />
        <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-50 animate-float"
             style={{ background: `radial-gradient(circle, hsl(var(--${isAI ? 'ai' : 'primary'}) / 0.35), transparent 70%)`, animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-40 animate-pulse"
             style={{ background: 'radial-gradient(circle, hsl(190 90% 60% / 0.3), transparent 70%)' }} />

        {/* Texture */}
        <div className="absolute inset-0 noise-overlay opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-10" />

        {/* Hero image — luminosity blend */}
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-20 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          </div>
        )}

        <SectionContainer background="none" className="relative z-10">
          {/* Asymmetric 12-col grid */}
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
            {/* LEFT — Editorial title block */}
            <div className="col-span-12 lg:col-span-8">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8 animate-fade-in">
                <div className={cn(
                  'inline-flex items-center justify-center w-12 h-12 rounded-2xl glass-panel',
                  isAI ? 'text-ai' : 'text-primary'
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                {isAI && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ai/10 border border-ai/30">
                    <Sparkles className="w-3.5 h-3.5 text-ai" />
                    <span className="text-xs font-medium tracking-wider uppercase text-ai">
                      {isEnglish ? 'Core Service' : 'Kernservice'}
                    </span>
                  </div>
                )}
                <span className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground">
                  {isEnglish ? 'Service' : 'Leistung'}
                </span>
              </div>

              {/* Editorial headline */}
              <h1 className="font-editorial text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-8 animate-fade-in"
                  style={{ animationDelay: '100ms' }}>
                <span className="text-foreground">{title.split(' ')[0]}</span>{' '}
                {title.split(' ').slice(1).join(' ') && (
                  <span className="italic text-aurora">
                    {title.split(' ').slice(1).join(' ')}
                  </span>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed mb-10 animate-fade-in"
                 style={{ animationDelay: '200ms' }}>
                {subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <CTAButton
                  variant="primary"
                  size="lg"
                  href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                  location={`service-${title.toLowerCase()}-hero`}
                  className={isAI ? 'glow-ai' : 'glow-primary'}
                >
                  {isEnglish ? 'Get Free Consultation' : 'Gratis Beratung'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </CTAButton>
                <CTAButton
                  variant="secondary"
                  size="lg"
                  href={isEnglish ? '/en/free-call' : '/gratis-call'}
                  location={`service-${title.toLowerCase()}-hero`}
                  className="glass-panel"
                >
                  {t.cta.bookCall}
                </CTAButton>
              </div>
            </div>

            {/* RIGHT — Numbered marker + meta */}
            <div className="col-span-12 lg:col-span-4 lg:pb-4">
              <div className="hidden lg:block">
                <div className="font-editorial text-[10rem] leading-none text-aurora opacity-30 select-none">
                  ◆
                </div>
                <div className="mt-6 space-y-3 text-sm text-muted-foreground border-l-2 border-primary/30 pl-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-foreground/50 mb-1">
                      {isEnglish ? 'Approach' : 'Ansatz'}
                    </div>
                    <div className="text-foreground">{isEnglish ? 'AI-First, Measurable' : 'AI-First, messbar'}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-foreground/50 mb-1">
                      {isEnglish ? 'Timeline' : 'Zeitrahmen'}
                    </div>
                    <div className="text-foreground">{isEnglish ? 'Weeks, not months' : 'Wochen, nicht Monate'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ============ DESCRIPTION — Editorial pull-quote style ============ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-30" />
        <SectionContainer background="none" className="relative">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-start gap-6 md:gap-10">
              <span className="font-editorial text-7xl md:text-9xl leading-none text-aurora opacity-60 select-none">
                "
              </span>
              <p className="font-editorial text-2xl md:text-4xl lg:text-5xl leading-tight text-foreground/90 italic pt-4">
                {description}
              </p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ============ FEATURES — Bento grid ============ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full blur-3xl opacity-30"
             style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.3), transparent 70%)' }} />
        <SectionContainer background="none" className="relative">
          <div className="mb-16 grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-7">
              <div className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground mb-4">
                01 — {isEnglish ? 'Deliverables' : 'Leistungen'}
              </div>
              <h2 className="font-editorial text-4xl md:text-6xl leading-[0.95] tracking-tight">
                {isEnglish ? 'What we ' : 'Was wir '}
                <span className="italic text-aurora">{isEnglish ? 'deliver' : 'liefern'}</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-5">
              <p className="text-muted-foreground text-lg">
                {isEnglish
                  ? 'Comprehensive solutions tailored to your business needs.'
                  : 'Umfassende Lösungen, massgeschneidert für Ihre Anforderungen.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative glass-panel rounded-3xl p-7 hover:shadow-glow-intense transition-all duration-500 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{ background: 'radial-gradient(circle at top right, hsl(var(--primary) / 0.15), transparent 60%)' }} />
                <div className="relative">
                  <div className="text-xs font-mono text-muted-foreground/60 mb-3">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-editorial text-2xl mb-3 group-hover:text-aurora transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ============ BENEFITS — Two-col asymmetric ============ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-30" />
        <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-40"
             style={{ background: `radial-gradient(circle, hsl(var(--${isAI ? 'ai' : 'primary'}) / 0.3), transparent 70%)` }} />

        <SectionContainer background="none" className="relative">
          <div className="grid grid-cols-12 gap-8 lg:gap-16">
            <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
              <div className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground mb-4">
                02 — {isEnglish ? 'Why' : 'Warum'}
              </div>
              <h2 className="font-editorial text-4xl md:text-6xl leading-[0.95] tracking-tight mb-6">
                {isEnglish ? 'Why this ' : 'Warum dieser '}
                <span className="italic text-aurora">{isEnglish ? 'matters' : 'Service'}</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {isEnglish
                  ? 'Concrete outcomes that compound over time — not just deliverables.'
                  : 'Konkrete Resultate, die sich über die Zeit potenzieren — nicht nur Liefergegenstände.'}
              </p>
            </div>

            <div className="col-span-12 lg:col-span-7">
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 p-5 rounded-2xl glass-panel hover:border-primary/40 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110',
                      isAI ? 'bg-ai/20 text-ai' : 'bg-primary/20 text-primary'
                    )}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-foreground text-base md:text-lg leading-snug pt-1">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ============ CASE STUDIES — Bold metrics ============ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <SectionContainer background="none" className="relative">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <div className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground mb-4">
              03 — {isEnglish ? 'Outcomes' : 'Ergebnisse'}
            </div>
            <h2 className="font-editorial text-4xl md:text-6xl leading-[0.95] tracking-tight mb-4">
              {isEnglish ? 'Results that ' : 'Ergebnisse, die '}
              <span className="italic text-aurora">{isEnglish ? 'compound' : 'sprechen'}</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {isEnglish ? 'Real outcomes from real clients.' : 'Echte Ergebnisse von echten Kunden.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {caseStudies.map((study, index) => (
              <div
                key={index}
                className="group relative glass-panel rounded-3xl p-8 md:p-10 text-center hover:shadow-glow-intense transition-all duration-500 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{ background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.15), transparent 70%)' }} />
                <div className="relative">
                  <div className="font-editorial text-6xl md:text-7xl text-aurora leading-none mb-4">
                    {study.metric}
                  </div>
                  <p className="text-foreground font-medium mb-2 text-lg">{study.result}</p>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{study.industry}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <CTAButton
              variant="secondary"
              href={isEnglish ? '/en/free-call' : '/gratis-call'}
              location={`service-${title.toLowerCase()}-cases`}
              className="glass-panel"
            >
              {isEnglish ? 'Discuss Your Goals' : 'Besprechen Sie Ihre Ziele'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </CTAButton>
          </div>
        </SectionContainer>
      </section>

      {/* ============ PROCESS — How it works ============ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-30" />
        <SectionContainer background="none" className="relative">
          <div className="mb-16">
            <div className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground mb-4">
              04 — {isEnglish ? 'Process' : 'Prozess'}
            </div>
            <h2 className="font-editorial text-4xl md:text-6xl leading-[0.95] tracking-tight">
              {isEnglish ? 'How it ' : 'So '}
              <span className="italic text-aurora">{isEnglish ? 'works' : 'funktioniert es'}</span>
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Aurora connecting line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px"
                 style={{ background: 'linear-gradient(to right, transparent, hsl(var(--primary) / 0.5), hsl(var(--ai) / 0.5), transparent)' }} />

            {[
              { icon: Target, title: isEnglish ? 'Discovery Call' : 'Discovery Call', desc: isEnglish ? 'We understand your goals and challenges.' : 'Wir verstehen Ihre Ziele und Herausforderungen.' },
              { icon: Clock, title: isEnglish ? 'Strategy & Setup' : 'Strategie & Setup', desc: isEnglish ? 'Custom plan and rapid implementation.' : 'Individueller Plan und schnelle Umsetzung.' },
              { icon: TrendingUp, title: isEnglish ? 'Launch & Optimize' : 'Launch & Optimieren', desc: isEnglish ? 'Go live and continuously improve.' : 'Live gehen und kontinuierlich verbessern.' },
            ].map((step, index) => (
              <div key={index} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl glass-panel mb-6">
                  <step.icon className="w-10 h-10 text-aurora" />
                  <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-background border border-primary/30 text-xs font-mono text-primary">
                    0{index + 1}
                  </div>
                </div>
                <h4 className="font-editorial text-2xl mb-2">{step.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ============ RELATED SERVICES ============ */}
      {relatedServices.length > 0 && (
        <section className="relative py-20 md:py-28 overflow-hidden">
          <SectionContainer background="none" className="relative">
            <div className="mb-12">
              <div className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground mb-4">
                {isEnglish ? 'Explore further' : 'Weitere Services'}
              </div>
              <h2 className="font-editorial text-3xl md:text-5xl leading-[0.95] tracking-tight">
                {isEnglish ? 'Related ' : 'Verwandte '}
                <span className="italic text-aurora">{isEnglish ? 'services' : 'Leistungen'}</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedServices.map((service, index) => (
                <a
                  key={index}
                  href={service.path}
                  className="group flex items-center justify-between p-6 rounded-2xl glass-panel hover:border-primary/40 hover:shadow-glow transition-all duration-300"
                >
                  <span className="font-editorial text-xl">{service.title}</span>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-aurora group-hover:rotate-12 transition-all" />
                </a>
              ))}
            </div>
          </SectionContainer>
        </section>
      )}

      {/* ============ FINAL CTA — Editorial maximalist ============ */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-50 animate-float"
             style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)' }} />
        <div className="absolute -bottom-20 right-1/4 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-40 animate-float"
             style={{ background: `radial-gradient(circle, hsl(var(--${isAI ? 'ai' : 'primary'}) / 0.4), transparent 70%)`, animationDelay: '2s' }} />
        <div className="absolute inset-0 noise-overlay opacity-30" />

        <SectionContainer background="none" className="relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground mb-6">
              {isEnglish ? 'Get started' : 'Jetzt starten'}
            </div>
            <h2 className="font-editorial text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-8">
              {isEnglish ? 'Ready for ' : 'Bereit für '}
              <span className="italic text-aurora">{title}</span>
              <span className="text-aurora">?</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              {isEnglish
                ? 'Get a free consultation and discover how we can help you grow.'
                : 'Erhalten Sie eine kostenlose Beratung und entdecken Sie, wie wir Ihnen helfen können.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                variant="primary"
                size="lg"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location={`service-${title.toLowerCase()}-footer`}
                className={isAI ? 'glow-ai' : 'glow-primary'}
              >
                {t.cta.getAudit}
                <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <CTAButton
                variant="secondary"
                size="lg"
                href={isEnglish ? '/en/free-call' : '/gratis-call'}
                location={`service-${title.toLowerCase()}-footer`}
                className="glass-panel"
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
