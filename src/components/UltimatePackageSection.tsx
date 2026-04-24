import { useLanguage } from '@/i18n/LanguageContext';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { 
  FileInput, 
  Bot, 
  FileOutput, 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  BarChart3,
  Lightbulb
} from 'lucide-react';

export function UltimatePackageSection() {
  const { isEnglish } = useLanguage();

  const content = isEnglish ? {
    badge: 'Our Core Innovation',
    title: 'The Ultimate Package',
    subtitle: 'One analysis. One file. Complete optimization blueprint for your online presence.',
    description: 'We built an AI-powered analysis system that transforms how businesses optimize their digital presence. Input your website — get a complete, actionable improvement roadmap.',
    
    howItWorks: 'How It Works',
    steps: [
      {
        icon: Globe,
        title: 'Input Your Website',
        description: 'Simply provide your website URL and basic business information.',
      },
      {
        icon: Bot,
        title: 'AI Deep Analysis',
        description: 'Our proprietary analyzer scans everything: SEO, UX, conversion paths, competitors, and market opportunities.',
      },
      {
        icon: FileOutput,
        title: 'Get Your Blueprint',
        description: 'Receive a comprehensive file with prioritized improvements, implementation prompts, and all supporting data.',
      },
    ],

    whatYouGet: 'What\'s Included',
    deliverables: [
      'Complete SEO audit with prioritized fixes',
      'Conversion optimization recommendations',
      'Competitor analysis & market positioning',
      'Content strategy with AI-ready prompts',
      'Technical implementation roadmap',
      'Design & UX improvement suggestions',
    ],

    showcase: {
      title: 'See It In Action',
      description: 'This website was built entirely using our Ultimate Package. Every page, every optimization, every piece of content — generated from our AI analysis system.',
      cta: 'Get Your Analysis',
    },

    usps: [
      { icon: Zap, text: 'Results in 48 hours' },
      { icon: Lightbulb, text: 'Actionable insights' },
      { icon: BarChart3, text: 'Data-driven decisions' },
    ],
  } : {
    badge: 'Unsere Kerninnovation',
    title: 'Das Ultimate Package',
    subtitle: 'Eine Analyse. Ein File. Kompletter Optimierungs-Blueprint für deine Online-Präsenz.',
    description: 'Wir haben ein KI-gestütztes Analysesystem entwickelt, das die Optimierung digitaler Präsenzen revolutioniert. Gib deine Website ein — erhalte eine komplette, umsetzbare Verbesserungs-Roadmap.',
    
    howItWorks: 'So funktioniert\'s',
    steps: [
      {
        icon: Globe,
        title: 'Website eingeben',
        description: 'Einfach deine Website-URL und grundlegende Geschäftsinformationen angeben.',
      },
      {
        icon: Bot,
        title: 'KI-Tiefenanalyse',
        description: 'Unser proprietärer Analyzer scannt alles: SEO, UX, Conversion-Pfade, Wettbewerber und Marktchancen.',
      },
      {
        icon: FileOutput,
        title: 'Blueprint erhalten',
        description: 'Erhalte ein umfassendes File mit priorisierten Verbesserungen, Implementierungs-Prompts und allen Daten.',
      },
    ],

    whatYouGet: 'Was enthalten ist',
    deliverables: [
      'Komplettes SEO-Audit mit priorisierten Fixes',
      'Conversion-Optimierungs-Empfehlungen',
      'Wettbewerbsanalyse & Marktpositionierung',
      'Content-Strategie mit KI-fertigen Prompts',
      'Technische Implementierungs-Roadmap',
      'Design- & UX-Verbesserungsvorschläge',
    ],

    showcase: {
      title: 'Sieh es in Aktion',
      description: 'Diese Website wurde vollständig mit unserem Ultimate Package erstellt. Jede Seite, jede Optimierung, jeder Content — generiert aus unserem KI-Analysesystem.',
      cta: 'Deine Analyse holen',
    },

    usps: [
      { icon: Zap, text: 'Ergebnisse in 48 Stunden' },
      { icon: Lightbulb, text: 'Umsetzbare Insights' },
      { icon: BarChart3, text: 'Datenbasierte Entscheidungen' },
    ],
  };

  return (
    <SectionContainer id="ultimate-package" background="default" className="relative overflow-hidden noise-overlay">
      {/* Layered background */}
      <div className="absolute inset-0 grid-pattern opacity-[0.12]" />
      <div className="absolute top-1/4 -left-40 w-[42rem] h-[42rem] rounded-full blur-3xl opacity-30"
           style={{ background: 'radial-gradient(circle, hsl(var(--ai-accent) / 0.4), transparent 70%)' }} />
      <div className="absolute -bottom-40 -right-20 w-[38rem] h-[38rem] rounded-full blur-3xl opacity-30"
           style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse-glow"
           style={{ background: 'radial-gradient(circle, hsl(190 90% 50% / 0.5), transparent 70%)' }} />

      <div className="relative">
        {/* Editorial Header — left-aligned, asymmetric */}
        <ScrollReveal>
          <div className="max-w-4xl mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-panel border-aurora">
              <Sparkles className="w-4 h-4 text-ai" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">{content.badge}</span>
            </div>

            <h2 className="font-editorial font-light text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-8">
              {isEnglish ? (
                <>The <span className="italic text-aurora">Ultimate</span><br />Package.</>
              ) : (
                <>Das <span className="italic text-aurora">Ultimate</span><br />Package.</>
              )}
            </h2>

            <p className="text-2xl md:text-3xl text-foreground/90 font-editorial font-light max-w-3xl mb-6 leading-snug">
              {content.subtitle}
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {content.description}
            </p>
          </div>
        </ScrollReveal>

        {/* How It Works — vertical numbered timeline */}
        <ScrollReveal>
          <div className="mb-24">
            <div className="flex items-baseline gap-4 mb-12">
              <span className="text-6xl font-editorial font-light text-aurora leading-none">01</span>
              <h3 className="text-2xl md:text-3xl font-editorial font-semibold tracking-tight">{content.howItWorks}</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              {/* Aurora connection line (desktop) */}
              <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px"
                   style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), hsl(var(--ai-accent) / 0.6), transparent)' }} />

              {content.steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="glass-panel rounded-3xl p-8 hover:-translate-y-1 hover:shadow-glow-intense transition-all duration-500 group h-full">
                    {/* Step number */}
                    <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-gradient-aurora text-primary-foreground font-bold text-xs tracking-widest shadow-glow z-10">
                      STEP {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-aurora flex items-center justify-center mb-6 mt-2 shadow-glow group-hover:scale-110 transition-transform">
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </div>

                    <h4 className="text-2xl font-editorial font-semibold mb-3 tracking-tight">{step.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>

                  {index < content.steps.length - 1 && (
                    <div className="flex justify-center my-4 md:hidden">
                      <ArrowRight className="w-6 h-6 text-ai rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Two Column: Deliverables + Showcase */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* What You Get — 2 cols */}
          <ScrollReveal className="lg:col-span-2">
            <div className="glass-panel rounded-3xl p-8 h-full">
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-5xl font-editorial font-light text-aurora leading-none">02</span>
                <h3 className="text-xl font-editorial font-semibold tracking-tight">{content.whatYouGet}</h3>
              </div>

              <ul className="space-y-4">
                {content.deliverables.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-gradient-aurora flex items-center justify-center flex-shrink-0 mt-0.5 shadow-glow group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <span className="text-foreground/90 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-border/30">
                <div className="flex flex-wrap gap-4">
                  {content.usps.map((usp, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <usp.icon className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{usp.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Showcase — 3 cols, hero card with aurora border */}
          <ScrollReveal className="lg:col-span-3">
            <div className="border-aurora rounded-3xl p-8 md:p-10 flex flex-col justify-between h-full relative overflow-hidden"
                 style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.8), hsl(var(--background) / 0.6))' }}>
              {/* Inner glow */}
              <div className="absolute inset-0 opacity-30 pointer-events-none"
                   style={{ background: 'radial-gradient(circle at 30% 20%, hsl(var(--ai-accent) / 0.3), transparent 60%)' }} />

              <div className="relative">
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-5xl font-editorial font-light text-aurora leading-none">03</span>
                  <h3 className="text-xl font-editorial font-semibold tracking-tight">{content.showcase.title}</h3>
                </div>

                <p className="text-lg text-foreground/85 mb-8 leading-relaxed font-editorial font-light">
                  {content.showcase.description}
                </p>

                {/* Process visualization */}
                <div className="glass-panel rounded-2xl p-5 mb-8">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-sm">
                      <FileInput className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">Website URL</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ai" />
                    <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-gradient-aurora shadow-glow">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                      <span className="text-primary-foreground font-semibold">AI Analyzer</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ai" />
                    <div className="flex items-center gap-2 text-sm">
                      <FileOutput className="w-5 h-5 text-primary" />
                      <span className="text-primary font-semibold">Blueprint</span>
                    </div>
                  </div>
                </div>
              </div>

              <CTAButton
                variant="primary"
                size="lg"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location="ultimate-package"
                className="relative w-full justify-center text-lg shadow-glow-intense hover:-translate-y-0.5 transition-all"
              >
                {content.showcase.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SectionContainer>
  );
}
