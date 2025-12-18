import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { Zap, Target, Bot, ArrowRight, Check } from 'lucide-react';

export default function SystemPage() {
  const { t, isEnglish } = useLanguage();

  const pillars = [
    {
      icon: Zap,
      title: t.system.traffic.title,
      description: t.system.traffic.description,
      outputs: t.system.traffic.outputs,
      color: 'primary',
    },
    {
      icon: Target,
      title: t.system.conversion.title,
      description: t.system.conversion.description,
      outputs: t.system.conversion.outputs,
      color: 'primary',
    },
    {
      icon: Bot,
      title: t.system.aiOps.title,
      description: t.system.aiOps.description,
      outputs: t.system.aiOps.outputs,
      color: 'primary',
    },
  ];

  return (
    <Layout showDemoTeaser showPromo>
      <SEOHead
        title={t.system.heroTitle}
        description={t.system.heroSubtitle}
      />

      {/* Hero */}
      <section className="relative hero-pattern">
        <SectionContainer padding="large">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">{t.system.heroTitle}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.system.heroSubtitle}
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* Flow Visualization */}
      <SectionContainer background="muted">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12">
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-medium">Traffic</span>
          </div>
          <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border">
            <Target className="w-5 h-5 text-primary" />
            <span className="font-medium">Conversion</span>
          </div>
          <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border">
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-medium">AI Ops</span>
          </div>
        </div>
      </SectionContainer>

      {/* Pillars Detail */}
      {pillars.map((pillar, index) => (
        <SectionContainer key={index} background={index % 2 === 0 ? 'default' : 'muted'}>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary">
                  <pillar.icon className="w-8 h-8" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">{pillar.title}</h2>
                <p className="text-lg text-muted-foreground mb-6">{pillar.description}</p>
                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                    {isEnglish ? 'Typical Outputs' : 'Typische Outputs'}
                  </h4>
                  <ul className="space-y-3">
                    {pillar.outputs.map((output, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{output}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
      ))}

      {/* CTA */}
      <SectionContainer className="gradient-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-primary-foreground mb-4">
            {isEnglish ? 'Ready to implement the system?' : 'Bereit das System zu implementieren?'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            {isEnglish
              ? 'Start with a free audit to see where you stand.'
              : 'Starte mit einem Gratis Audit um zu sehen, wo du stehst.'}
          </p>
          <CTAButton
            variant="secondary"
            size="lg"
            href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
            location="system-cta"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            {t.cta.getAudit}
            <ArrowRight className="ml-2 w-5 h-5" />
          </CTAButton>
        </div>
      </SectionContainer>
    </Layout>
  );
}
