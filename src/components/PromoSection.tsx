import { ArrowRight, Sparkles, Zap, Target, Bot } from 'lucide-react';
import { SectionContainer, SectionHeader } from './SectionContainer';
import { CTAButton } from './CTAButton';
import { useLanguage } from '@/i18n/LanguageContext';

export function PromoSection() {
  const { isEnglish } = useLanguage();

  const features = isEnglish ? [
    {
      icon: Zap,
      title: 'High-Intent Traffic',
      description: 'Google Ads + Local SEO targeting people actively searching for your services.',
    },
    {
      icon: Target,
      title: 'Conversion Optimized',
      description: 'Landing pages and funnels designed to turn visitors into booked jobs.',
    },
    {
      icon: Bot,
      title: 'AI Automations',
      description: 'Lead follow-ups, review requests, and reporting on autopilot.',
    },
  ] : [
    {
      icon: Zap,
      title: 'High-Intent Traffic',
      description: 'Google Ads + Local SEO für Menschen, die aktiv nach deinen Services suchen.',
    },
    {
      icon: Target,
      title: 'Conversion Optimiert',
      description: 'Landingpages und Funnels, die Besucher in gebuchte Jobs verwandeln.',
    },
    {
      icon: Bot,
      title: 'AI Automationen',
      description: 'Lead Follow-ups, Review-Anfragen und Reporting auf Autopilot.',
    },
  ];

  return (
    <SectionContainer className="gradient-subtle">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4" />
            {isEnglish ? 'Full Growth System' : 'Full Growth System'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {isEnglish 
              ? 'Everything you need to grow your local business'
              : 'Alles, was du brauchst, um dein lokales Business zu wachsen'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isEnglish
              ? 'From first click to booked job — we handle the entire customer journey.'
              : 'Vom ersten Klick bis zum gebuchten Job — wir kümmern uns um die gesamte Customer Journey.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:border-primary/30"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CTAButton
            variant="primary"
            size="lg"
            href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
            location="promo-section"
          >
            {isEnglish ? 'Start your free audit' : 'Gratis Audit starten'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </CTAButton>
          <CTAButton
            variant="secondary"
            size="lg"
            href={isEnglish ? '/en/demo' : '/demo'}
            location="promo-section"
          >
            {isEnglish ? 'Listen to the demo' : 'Demo anhören'}
          </CTAButton>
        </div>
      </div>
    </SectionContainer>
  );
}
