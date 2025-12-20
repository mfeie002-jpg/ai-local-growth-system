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
    <SectionContainer id="ultimate-package" background="default" className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-ai/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-ai/10 backdrop-blur-sm border border-ai/20">
              <Sparkles className="w-4 h-4 text-ai" />
              <span className="text-sm font-medium text-ai">{content.badge}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              <span className="text-gradient-ai">{content.title}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              {content.subtitle}
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              {content.description}
            </p>
          </div>
        </ScrollReveal>

        {/* How It Works - Visual Flow */}
        <ScrollReveal>
          <div className="mb-20">
            <h3 className="text-2xl font-bold font-display text-center mb-10">{content.howItWorks}</h3>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection lines (desktop) */}
              <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/50 via-ai/50 to-primary/50" />
              
              {content.steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-ai/30 transition-all duration-300 group">
                    {/* Step number */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-ai text-ai-foreground flex items-center justify-center font-bold text-sm z-10">
                      {index + 1}
                    </div>
                    
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-ai/20 flex items-center justify-center mb-5 mt-4 group-hover:scale-110 transition-transform">
                      <step.icon className="w-8 h-8 text-ai" />
                    </div>
                    
                    <h4 className="text-lg font-bold font-display mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  
                  {/* Arrow (mobile) */}
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

        {/* Two Column Layout: Deliverables + Showcase */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* What You Get */}
          <ScrollReveal>
            <div className="p-8 rounded-2xl bg-card border border-border/50">
              <h3 className="text-2xl font-bold font-display mb-6 flex items-center gap-3">
                <FileOutput className="w-6 h-6 text-ai" />
                {content.whatYouGet}
              </h3>
              
              <ul className="space-y-4">
                {content.deliverables.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-ai flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              
              {/* USPs */}
              <div className="mt-8 pt-6 border-t border-border/50">
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

          {/* Showcase */}
          <ScrollReveal>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-ai/10 via-primary/10 to-accent/10 border border-ai/20 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold font-display mb-4 flex items-center gap-3">
                  <Bot className="w-6 h-6 text-ai" />
                  {content.showcase.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {content.showcase.description}
                </p>
                
                {/* Visual representation of the process */}
                <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30 mb-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <FileInput className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground">Website URL</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-ai" />
                    <div className="flex items-center gap-2 text-sm">
                      <Bot className="w-5 h-5 text-ai" />
                      <span className="text-ai font-medium">AI Analyzer</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-ai" />
                    <div className="flex items-center gap-2 text-sm">
                      <FileOutput className="w-5 h-5 text-primary" />
                      <span className="text-primary font-medium">Blueprint</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <CTAButton
                variant="primary"
                size="lg"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location="ultimate-package"
                className="w-full justify-center text-lg glow-ai"
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
