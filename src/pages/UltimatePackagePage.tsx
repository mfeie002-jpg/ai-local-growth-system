import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion/ScrollReveal';
import { AnalysisRequestForm } from '@/components/forms/AnalysisRequestForm';
import { 
  FileOutput, 
  Bot, 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  Globe,
  BarChart3,
  Lightbulb,
  Search,
  Code,
  Palette,
  TrendingUp,
  Users,
  Target,
  ExternalLink,
  Rocket,
  FileCheck,
  Wrench,
  Eye,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIScannerDemo } from '@/components/AIScannerDemo';
import { CTAButton } from '@/components/CTAButton';

export default function UltimatePackagePage() {
  const { isEnglish } = useLanguage();

  const content = isEnglish ? {
    hero: {
      badge: 'Free Website Analysis',
      title: 'Discover Your Optimization Potential',
      subtitle: 'Our AI reveals every improvement opportunity — for free.',
      description: 'Get a comprehensive analysis of your website with actionable insights. See exactly what\'s holding you back and how to fix it.',
    },
    funnel: {
      title: 'How It Works',
      subtitle: '3 simple steps from analysis to implementation.',
      steps: [
        {
          icon: Search,
          number: '1',
          title: 'Free Analysis',
          subtitle: 'You get',
          description: 'Enter your website URL and receive a complete AI-powered audit within 24-48 hours.',
          highlight: '100% FREE',
          details: ['50+ ranking factors checked', 'Competitor comparison', 'Opportunity detection'],
        },
        {
          icon: FileCheck,
          number: '2',
          title: 'Detailed Results',
          subtitle: 'You receive',
          description: 'A comprehensive report showing every issue, prioritized by impact with clear explanations.',
          highlight: 'OVERWHELMING',
          details: ['Priority-ranked action list', 'Technical specifications', 'Quick wins identified'],
          demoLink: '/en/demo',
        },
        {
          icon: Wrench,
          number: '3',
          title: 'Implementation',
          subtitle: 'We deliver',
          description: 'We implement all the improvements for you. Professional execution, guaranteed results.',
          highlight: 'DONE FOR YOU',
          details: ['Expert implementation', 'Quality assurance', 'Ongoing optimization'],
        },
      ],
    },
    overwhelming: {
      title: 'Why Clients Choose Us',
      subtitle: 'The analysis reveals so much potential — implementation becomes the logical next step.',
      stats: [
        { value: '50+', label: 'Factors Analyzed' },
        { value: '24h', label: 'Analysis Time' },
        { value: '200%', label: 'Avg. Improvement' },
        { value: '100%', label: 'Actionable' },
      ],
      points: [
        { icon: Eye, text: 'See every hidden issue on your website' },
        { icon: AlertTriangle, text: 'Understand what\'s costing you customers' },
        { icon: Target, text: 'Get a clear roadmap to success' },
        { icon: Zap, text: 'Skip the guesswork with expert implementation' },
      ],
    },
    features: {
      title: 'What Gets Analyzed',
      subtitle: 'A deep-dive into every aspect of your online presence.',
      categories: [
        {
          icon: Search,
          title: 'SEO Analysis',
          items: ['Technical SEO audit', 'Keyword opportunities', 'Content gaps', 'Backlink profile', 'Local SEO'],
        },
        {
          icon: Palette,
          title: 'UX & Design',
          items: ['User experience', 'Mobile responsiveness', 'Page speed', 'Visual hierarchy', 'Conversion paths'],
        },
        {
          icon: Code,
          title: 'Technical Stack',
          items: ['Performance metrics', 'Core Web Vitals', 'Security assessment', 'Structured data', 'Accessibility'],
        },
        {
          icon: TrendingUp,
          title: 'Conversion',
          items: ['CTA effectiveness', 'Trust signals', 'Form optimization', 'Sales funnel', 'A/B opportunities'],
        },
        {
          icon: Users,
          title: 'Competition',
          items: ['Competitor benchmarking', 'Market positioning', 'Content comparison', 'Feature gaps', 'Pricing intel'],
        },
        {
          icon: Target,
          title: 'Strategy',
          items: ['Growth roadmap', 'Quick wins', 'Long-term initiatives', 'Resource priorities', 'Timeline'],
        },
      ],
    },
    deliverables: {
      title: 'What You Get',
      subtitle: 'Everything included in your free analysis.',
      items: [
        { icon: FileOutput, title: 'Complete Analysis Report', description: 'All findings, metrics, and recommendations in one document.' },
        { icon: Lightbulb, title: 'AI Implementation Prompts', description: 'Ready-to-use prompts to implement every recommendation.' },
        { icon: BarChart3, title: 'Priority Action Plan', description: 'Tasks ranked by impact for maximum ROI.' },
        { icon: Target, title: 'Competitor Benchmark', description: 'How you compare with specific improvement targets.' },
      ],
    },
    caseStudies: {
      title: 'Real Results',
      subtitle: 'See how businesses transformed their online presence.',
    },
    demo: {
      title: 'See the AI in Action',
      subtitle: 'Watch how our analyzer scans and evaluates websites in real-time.',
    },
    cta: {
      title: 'Ready to See Your Potential?',
      subtitle: 'Start your free analysis today. No credit card required.',
    },
  } : {
    hero: {
      badge: 'Kostenlose Website-Analyse',
      title: 'Entdecke dein Optimierungspotenzial',
      subtitle: 'Unsere KI zeigt jede Verbesserungsmöglichkeit — komplett gratis.',
      description: 'Erhalte eine umfassende Analyse deiner Website mit umsetzbaren Insights. Sieh genau, was dich zurückhält und wie du es beheben kannst.',
    },
    funnel: {
      title: 'So funktioniert\'s',
      subtitle: '3 einfache Schritte von der Analyse zur Umsetzung.',
      steps: [
        {
          icon: Search,
          number: '1',
          title: 'Gratis-Analyse',
          subtitle: 'Du bekommst',
          description: 'Gib deine Website-URL ein und erhalte ein komplettes KI-gestütztes Audit innerhalb von 24-48 Stunden.',
          highlight: '100% GRATIS',
          details: ['50+ Ranking-Faktoren geprüft', 'Konkurrenzvergleich', 'Chancen-Erkennung'],
        },
        {
          icon: FileCheck,
          number: '2',
          title: 'Detaillierte Resultate',
          subtitle: 'Du erhältst',
          description: 'Einen umfassenden Report mit jedem Problem, nach Impact priorisiert mit klaren Erklärungen.',
          highlight: 'ÜBERWÄLTIGEND',
          details: ['Priorisierte Aktionsliste', 'Technische Spezifikationen', 'Quick Wins identifiziert'],
          demoLink: '/demo',
        },
        {
          icon: Wrench,
          number: '3',
          title: 'Implementierung',
          subtitle: 'Wir liefern',
          description: 'Wir implementieren alle Verbesserungen für dich. Professionelle Ausführung, garantierte Resultate.',
          highlight: 'FÜR DICH ERLEDIGT',
          details: ['Experten-Implementierung', 'Qualitätssicherung', 'Laufende Optimierung'],
        },
      ],
    },
    overwhelming: {
      title: 'Warum Kunden uns wählen',
      subtitle: 'Die Analyse zeigt so viel Potenzial — die Implementierung wird zum logischen nächsten Schritt.',
      stats: [
        { value: '50+', label: 'Faktoren analysiert' },
        { value: '24h', label: 'Analyse-Zeit' },
        { value: '200%', label: 'Durchschn. Verbesserung' },
        { value: '100%', label: 'Umsetzbar' },
      ],
      points: [
        { icon: Eye, text: 'Sieh jedes versteckte Problem auf deiner Website' },
        { icon: AlertTriangle, text: 'Versteh, was dich Kunden kostet' },
        { icon: Target, text: 'Erhalte eine klare Roadmap zum Erfolg' },
        { icon: Zap, text: 'Überspring das Rätselraten mit Experten-Implementierung' },
      ],
    },
    features: {
      title: 'Was analysiert wird',
      subtitle: 'Ein Deep-Dive in jeden Aspekt deiner Online-Präsenz.',
      categories: [
        {
          icon: Search,
          title: 'SEO-Analyse',
          items: ['Technisches SEO-Audit', 'Keyword-Chancen', 'Content-Lücken', 'Backlink-Profil', 'Local SEO'],
        },
        {
          icon: Palette,
          title: 'UX & Design',
          items: ['User Experience', 'Mobile Responsiveness', 'Ladezeit', 'Visuelle Hierarchie', 'Conversion-Pfade'],
        },
        {
          icon: Code,
          title: 'Technischer Stack',
          items: ['Performance-Metriken', 'Core Web Vitals', 'Sicherheits-Check', 'Strukturierte Daten', 'Accessibility'],
        },
        {
          icon: TrendingUp,
          title: 'Conversion',
          items: ['CTA-Effektivität', 'Trust-Signale', 'Formular-Optimierung', 'Sales-Funnel', 'A/B-Chancen'],
        },
        {
          icon: Users,
          title: 'Wettbewerb',
          items: ['Konkurrenz-Benchmarking', 'Marktpositionierung', 'Content-Vergleich', 'Feature-Lücken', 'Preis-Intel'],
        },
        {
          icon: Target,
          title: 'Strategie',
          items: ['Wachstums-Roadmap', 'Quick Wins', 'Langzeit-Initiativen', 'Ressourcen-Prioritäten', 'Timeline'],
        },
      ],
    },
    deliverables: {
      title: 'Was du bekommst',
      subtitle: 'Alles inklusive in deiner Gratis-Analyse.',
      items: [
        { icon: FileOutput, title: 'Kompletter Analyse-Report', description: 'Alle Erkenntnisse, Metriken und Empfehlungen in einem Dokument.' },
        { icon: Lightbulb, title: 'KI-Implementierungs-Prompts', description: 'Sofort einsetzbare Prompts für jede Empfehlung.' },
        { icon: BarChart3, title: 'Prioritäts-Aktionsplan', description: 'Tasks nach Impact gerankt für maximalen ROI.' },
        { icon: Target, title: 'Konkurrenz-Benchmark', description: 'Wie du im Vergleich stehst mit konkreten Verbesserungszielen.' },
      ],
    },
    caseStudies: {
      title: 'Echte Resultate',
      subtitle: 'Sieh, wie Unternehmen ihre Online-Präsenz transformiert haben.',
    },
    demo: {
      title: 'Sieh die KI in Aktion',
      subtitle: 'Beobachte, wie unser Analyzer Websites in Echtzeit scannt und bewertet.',
    },
    cta: {
      title: 'Bereit, dein Potenzial zu sehen?',
      subtitle: 'Starte deine Gratis-Analyse heute. Keine Kreditkarte nötig.',
    },
  };

  // Case Studies data
  const caseStudies = [
    {
      name: 'Umzugscheck.ch',
      url: 'https://umzugscheck.ch',
      industry: isEnglish ? 'Moving Services' : 'Umzugsdienstleistungen',
      improvements: [
        { metric: isEnglish ? 'Organic Traffic' : 'Organischer Traffic', before: '1,200', after: '4,800', change: '+300%' },
        { metric: isEnglish ? 'Lead Conversion' : 'Lead-Conversion', before: '2.1%', after: '6.8%', change: '+224%' },
        { metric: isEnglish ? 'Page Speed' : 'Ladezeit', before: '4.2s', after: '1.1s', change: '-74%' },
      ],
      testimonial: isEnglish 
        ? 'The analysis revealed optimization opportunities we never knew existed.'
        : 'Die Analyse deckte Optimierungsmöglichkeiten auf, von denen wir nichts wussten.',
    },
    {
      name: 'Zügelhelden.ch',
      url: 'https://zuegelhelden.ch',
      industry: isEnglish ? 'Moving Company' : 'Umzugsfirma',
      improvements: [
        { metric: isEnglish ? 'Google Ranking' : 'Google-Ranking', before: 'Page 3', after: 'Top 3', change: 'Top 3' },
        { metric: isEnglish ? 'Monthly Leads' : 'Monatliche Leads', before: '45', after: '156', change: '+247%' },
        { metric: isEnglish ? 'Cost per Lead' : 'Kosten pro Lead', before: 'CHF 89', after: 'CHF 31', change: '-65%' },
      ],
      testimonial: isEnglish
        ? 'Within 90 days, we tripled our organic leads.'
        : 'Innerhalb von 90 Tagen haben wir unsere organischen Leads verdreifacht.',
    },
    {
      name: 'SBPI.ch',
      url: 'https://sbpi.ch',
      industry: isEnglish ? 'Business Services' : 'Business Services',
      improvements: [
        { metric: isEnglish ? 'SEO Score' : 'SEO-Score', before: '42/100', after: '91/100', change: '+117%' },
        { metric: isEnglish ? 'Bounce Rate' : 'Absprungrate', before: '68%', after: '34%', change: '-50%' },
        { metric: isEnglish ? 'Avg. Session' : 'Durchschn. Session', before: '1:24', after: '4:12', change: '+196%' },
      ],
      testimonial: isEnglish
        ? 'The technical specifications alone saved us months of consulting time.'
        : 'Allein die technischen Spezifikationen haben uns Monate an Beratungszeit gespart.',
    },
    {
      name: 'Feierabend-Umzug.ch',
      url: 'https://feierabend-umzug.ch',
      industry: isEnglish ? 'Moving Services' : 'Umzugsservice',
      improvements: [
        { metric: isEnglish ? 'Conversion Rate' : 'Conversion-Rate', before: '1.8%', after: '7.2%', change: '+300%' },
        { metric: isEnglish ? 'Mobile Score' : 'Mobile Score', before: '34/100', after: '96/100', change: '+182%' },
        { metric: isEnglish ? 'Call Bookings' : 'Anruf-Buchungen', before: '12/week', after: '41/week', change: '+242%' },
      ],
      testimonial: isEnglish
        ? 'Our mobile experience was terrible. The blueprint fixed everything.'
        : 'Unsere Mobile Experience war schrecklich. Der Blueprint hat alles gefixt.',
    },
    {
      name: 'Reride.ch',
      url: 'https://reride.ch',
      industry: isEnglish ? 'E-Commerce' : 'E-Commerce',
      improvements: [
        { metric: isEnglish ? 'Page Views' : 'Seitenaufrufe', before: '8k', after: '34k', change: '+325%' },
        { metric: isEnglish ? 'Cart Abandonment' : 'Warenkorbabbruch', before: '78%', after: '42%', change: '-46%' },
        { metric: isEnglish ? 'AOV' : 'Durchschn. Bestellwert', before: 'CHF 89', after: 'CHF 156', change: '+75%' },
      ],
      testimonial: isEnglish
        ? 'E-commerce specific insights transformed our funnel.'
        : 'E-Commerce-spezifische Insights haben unseren Funnel transformiert.',
    },
    {
      name: 'Gentlehands.ch',
      url: 'https://gentlehands.ch',
      industry: isEnglish ? 'Wellness & Care' : 'Wellness & Pflege',
      improvements: [
        { metric: isEnglish ? 'Organic Keywords' : 'Organische Keywords', before: '45', after: '312', change: '+593%' },
        { metric: isEnglish ? 'Booking Rate' : 'Buchungsrate', before: '3.2%', after: '11.4%', change: '+256%' },
        { metric: isEnglish ? 'Trust Score' : 'Vertrauens-Score', before: '52/100', after: '94/100', change: '+81%' },
      ],
      testimonial: isEnglish
        ? 'Our trust signals were missing. The analysis showed exactly where to place them.'
        : 'Unsere Trust-Signale fehlten. Die Analyse zeigte genau, wo wir sie platzieren sollten.',
    },
  ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Free Website Analysis - AI-Powered Optimization' : 'Kostenlose Website-Analyse - KI-gestützte Optimierung'}
        description={isEnglish 
          ? 'Get a free comprehensive AI-powered analysis of your website. Discover hidden opportunities and get a clear action plan.'
          : 'Erhalte eine kostenlose umfassende KI-gestützte Analyse deiner Website. Entdecke versteckte Chancen und erhalte einen klaren Aktionsplan.'}
      />

      {/* Hero Section with Form */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-ai/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <SectionContainer padding="large" background="none" className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-ai/10 backdrop-blur-sm border border-ai/20 animate-fade-in">
                <Sparkles className="w-4 h-4 text-ai" />
                <span className="text-sm font-medium text-ai">{content.hero.badge}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <span className="text-gradient-ai">{content.hero.title}</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                {content.hero.subtitle}
              </p>
              
              <p className="text-lg text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
                {content.hero.description}
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-ai" />
                  <span>{isEnglish ? 'No credit card required' : 'Keine Kreditkarte nötig'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-ai" />
                  <span>{isEnglish ? 'Results in 24-48h' : 'Resultate in 24-48h'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-ai" />
                  <span>{isEnglish ? '100% free' : '100% kostenlos'}</span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
              <AnalysisRequestForm variant="hero" />
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* 3-Step Funnel */}
      <SectionContainer background="default" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative">
          <ScrollReveal>
            <SectionHeader 
              title={content.funnel.title}
              subtitle={content.funnel.subtitle}
            />
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-32 left-[20%] right-[20%] h-1 bg-gradient-to-r from-ai via-primary to-ai rounded-full" />
            
            {content.funnel.steps.map((step, index) => (
              <ScrollReveal key={index}>
                <div className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-ai/30 transition-all duration-300 group h-full">
                  {/* Step number badge */}
                  <div className="absolute -top-5 w-12 h-12 rounded-full bg-gradient-to-br from-ai to-primary text-white flex items-center justify-center font-bold text-xl z-10 shadow-lg shadow-ai/30">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-ai/20 flex items-center justify-center mb-4 mt-6 group-hover:scale-110 transition-transform">
                    <step.icon className="w-10 h-10 text-ai" />
                  </div>

                  {/* Highlight badge */}
                  <div className="inline-flex items-center px-3 py-1 mb-3 rounded-full bg-ai/10 border border-ai/20">
                    <span className="text-xs font-bold text-ai">{step.highlight}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1">{step.subtitle}</p>
                  <h3 className="text-xl font-bold font-display mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-6">{step.description}</p>
                  
                  <ul className="space-y-2 mt-auto">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-ai flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Demo Link for Step 2 */}
                  {(step as any).demoLink && (
                    <a 
                      href={(step as any).demoLink}
                      className="mt-4 inline-flex items-center gap-2 text-sm text-ai hover:text-ai/80 transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {isEnglish ? 'See sample report' : 'Beispiel-Report ansehen'}
                    </a>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Why Choose Us / Overwhelming Effect */}
      <SectionContainer background="muted" className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="relative">
          <ScrollReveal>
            <SectionHeader 
              title={content.overwhelming.title}
              subtitle={content.overwhelming.subtitle}
            />
          </ScrollReveal>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {content.overwhelming.stats.map((stat, index) => (
              <ScrollReveal key={index}>
                <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50">
                  <div className="text-4xl md:text-5xl font-bold font-display text-gradient-ai mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Points */}
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {content.overwhelming.points.map((point, index) => (
              <ScrollReveal key={index}>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
                  <div className="w-12 h-12 rounded-xl bg-ai/10 flex items-center justify-center flex-shrink-0">
                    <point.icon className="w-6 h-6 text-ai" />
                  </div>
                  <p className="font-medium">{point.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Interactive Demo Section */}
      <SectionContainer id="demo" background="default" className="relative overflow-hidden">
        <div className="relative">
          <ScrollReveal>
            <SectionHeader 
              title={content.demo.title}
              subtitle={content.demo.subtitle}
            />
          </ScrollReveal>
          
          <ScrollReveal>
            <AIScannerDemo />
          </ScrollReveal>
        </div>
      </SectionContainer>

      {/* What's Analyzed */}
      <SectionContainer background="muted" className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="relative">
          <ScrollReveal>
            <SectionHeader 
              title={content.features.title}
              subtitle={content.features.subtitle}
            />
          </ScrollReveal>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {content.features.categories.map((category, index) => (
              <StaggerItem key={index}>
                <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold font-display">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </SectionContainer>

      {/* What You Receive */}
      <SectionContainer background="default" className="relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-ai/5 rounded-full blur-3xl" />
        
        <div className="relative">
          <ScrollReveal>
            <SectionHeader 
              title={content.deliverables.title}
              subtitle={content.deliverables.subtitle}
            />
          </ScrollReveal>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {content.deliverables.items.map((item, index) => (
              <StaggerItem key={index}>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-ai/30 transition-all duration-300 group h-full">
                  <div className="w-14 h-14 rounded-xl bg-ai/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-ai" />
                  </div>
                  <h3 className="text-lg font-bold font-display mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </SectionContainer>

      {/* Case Studies */}
      <SectionContainer background="muted" className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="relative">
          <ScrollReveal>
            <SectionHeader 
              title={content.caseStudies.title}
              subtitle={content.caseStudies.subtitle}
            />
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study, index) => (
              <ScrollReveal key={index}>
                <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 group h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold font-display group-hover:text-primary transition-colors">{study.name}</h3>
                      <p className="text-xs text-muted-foreground">{study.industry}</p>
                    </div>
                    <a 
                      href={study.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  </div>
                  
                  {/* Metrics */}
                  <div className="space-y-3 mb-4 flex-1">
                    {study.improvements.map((imp, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{imp.metric}</span>
                        <span className="font-bold text-primary">{imp.change}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Testimonial */}
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground italic">"{study.testimonial}"</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Final CTA with Form */}
      <SectionContainer background="default" className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        
        <div className="relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                  {content.cta.title}
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  {content.cta.subtitle}
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-ai" />
                    <span>{isEnglish ? 'Free forever' : 'Für immer gratis'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-ai" />
                    <span>{isEnglish ? 'No obligations' : 'Keine Verpflichtungen'}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <AnalysisRequestForm />
            </ScrollReveal>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
