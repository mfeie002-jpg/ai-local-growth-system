import { Play, PhoneCall, MessageCircle, Star } from 'lucide-react';
import { SectionContainer } from './SectionContainer';
import { CTAButton } from './CTAButton';
import { useLanguage } from '@/i18n/LanguageContext';

export function DemoTeaserSection() {
  const { isEnglish } = useLanguage();

  const demoFeatures = isEnglish ? [
    { icon: PhoneCall, text: 'AI answers calls 24/7' },
    { icon: MessageCircle, text: 'Automated follow-ups' },
    { icon: Star, text: 'Review collection on autopilot' },
  ] : [
    { icon: PhoneCall, text: 'AI beantwortet Anrufe 24/7' },
    { icon: MessageCircle, text: 'Automatisierte Follow-ups' },
    { icon: Star, text: 'Review-Sammlung auf Autopilot' },
  ];

  return (
    <SectionContainer background="accent">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary">
              <Play className="w-3 h-3" />
              {isEnglish ? 'Audio Demo' : 'Audio Demo'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              {isEnglish 
                ? 'Hear how the AI Lead Concierge works'
                : 'Hör wie der AI Lead Concierge funktioniert'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isEnglish
                ? 'Listen to an example conversation. The agent introduces itself as a digital assistant and handles the call professionally.'
                : 'Hör dir ein Beispielgespräch an. Der Agent stellt sich als digitaler Assistent vor und führt das Gespräch professionell.'}
            </p>

            <ul className="space-y-3 mb-8">
              {demoFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground text-sm">{feature.text}</span>
                </li>
              ))}
            </ul>

            <CTAButton
              variant="primary"
              href={isEnglish ? '/en/demo' : '/demo'}
              location="demo-teaser"
            >
              <Play className="w-4 h-4 mr-2" />
              {isEnglish ? 'Listen to the demo' : 'Demo anhören'}
            </CTAButton>
          </div>

          {/* Right: Visual placeholder */}
          <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center min-h-[280px]">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
              <Play className="w-10 h-10 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm text-center">
              {isEnglish 
                ? 'AI Lead Concierge Demo'
                : 'AI Lead Concierge Demo'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {isEnglish ? 'Click to listen' : 'Klicken zum Anhören'}
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
