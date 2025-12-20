import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion/ScrollReveal';
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
  Lightbulb,
  Search,
  Code,
  Palette,
  TrendingUp,
  Users,
  Shield,
  Clock,
  Target,
  Layers,
  ExternalLink,
  Play,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { AIScannerDemo } from '@/components/AIScannerDemo';

export default function UltimatePackagePage() {
  const { isEnglish } = useLanguage();

  const content = isEnglish ? {
    hero: {
      badge: 'The Future of Digital Optimization',
      title: 'Ultimate Package',
      subtitle: 'One AI analysis. One complete blueprint. Transform your entire online presence.',
      description: 'Our proprietary AI system analyzes your website and generates a comprehensive optimization blueprint — including implementation prompts, prioritized actions, and all the data you need.',
      cta1: 'Get Your Analysis',
      cta2: 'See Demo',
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'From input to actionable blueprint in 3 simple steps.',
      steps: [
        {
          icon: Globe,
          title: 'Input Your Website',
          description: 'Provide your website URL and basic business information. Our system handles the rest.',
          details: ['No technical knowledge required', 'Works with any website', '2 minutes to complete'],
        },
        {
          icon: Bot,
          title: 'AI Deep Analysis',
          description: 'Our proprietary analyzer performs a comprehensive scan of your digital presence.',
          details: ['50+ ranking factors analyzed', 'Competitor benchmarking', 'Market opportunity detection'],
        },
        {
          icon: FileOutput,
          title: 'Receive Your Blueprint',
          description: 'Get a complete optimization file with implementation-ready prompts and prioritized actions.',
          details: ['Actionable recommendations', 'AI-ready prompts included', 'Priority-ranked tasks'],
        },
      ],
    },
    features: {
      title: 'What\'s Analyzed',
      subtitle: 'A comprehensive deep-dive into every aspect of your online presence.',
      categories: [
        {
          icon: Search,
          title: 'SEO Analysis',
          items: ['Technical SEO audit', 'Keyword opportunity mapping', 'Content gap analysis', 'Backlink profile review', 'Local SEO optimization'],
        },
        {
          icon: Palette,
          title: 'UX & Design',
          items: ['User experience evaluation', 'Mobile responsiveness', 'Page speed optimization', 'Visual hierarchy analysis', 'Conversion path mapping'],
        },
        {
          icon: Code,
          title: 'Technical Stack',
          items: ['Performance metrics', 'Core Web Vitals', 'Security assessment', 'Structured data review', 'Accessibility compliance'],
        },
        {
          icon: TrendingUp,
          title: 'Conversion',
          items: ['CTA effectiveness', 'Trust signal placement', 'Form optimization', 'Sales funnel analysis', 'A/B testing opportunities'],
        },
        {
          icon: Users,
          title: 'Competition',
          items: ['Competitor benchmarking', 'Market positioning', 'Content comparison', 'Feature gap analysis', 'Pricing intelligence'],
        },
        {
          icon: Target,
          title: 'Strategy',
          items: ['Growth opportunity roadmap', 'Quick wins identification', 'Long-term initiatives', 'Resource prioritization', 'Implementation timeline'],
        },
      ],
    },
    deliverables: {
      title: 'What You Receive',
      subtitle: 'Everything you need to transform your online presence.',
      items: [
        { icon: FileOutput, title: 'Complete Analysis File', description: 'Comprehensive report with all findings, metrics, and recommendations.' },
        { icon: Lightbulb, title: 'AI Implementation Prompts', description: 'Ready-to-use prompts to implement every recommendation using AI tools.' },
        { icon: Layers, title: 'Priority Action Plan', description: 'Tasks ranked by impact and effort for maximum ROI optimization.' },
        { icon: BarChart3, title: 'Benchmark Data', description: 'How you compare to competitors with specific improvement targets.' },
        { icon: Clock, title: '90-Day Roadmap', description: 'Week-by-week implementation schedule for sustainable growth.' },
        { icon: Shield, title: 'Technical Specifications', description: 'Developer-ready specs for all technical implementations.' },
      ],
    },
    pricing: {
      title: 'Pricing',
      subtitle: 'Choose the package that fits your needs.',
      packages: [
        {
          name: 'Starter Analysis',
          price: 'CHF 490',
          description: 'Perfect for small businesses getting started with optimization.',
          features: [
            'Core SEO audit',
            'Basic competitor analysis',
            'Top 10 priority fixes',
            'Implementation guide',
            'Email delivery',
          ],
          cta: 'Get Started',
          popular: false,
        },
        {
          name: 'Ultimate Package',
          price: 'CHF 1,490',
          description: 'Complete transformation blueprint for serious businesses.',
          features: [
            'Full 50+ factor analysis',
            'Deep competitor research',
            'AI implementation prompts',
            'Priority action plan',
            '90-day roadmap',
            'Technical specifications',
            'Video walkthrough call',
          ],
          cta: 'Get Ultimate',
          popular: true,
        },
        {
          name: 'Enterprise',
          price: 'On Request',
          description: 'For multi-location businesses and complex digital ecosystems.',
          features: [
            'Everything in Ultimate',
            'Multi-site analysis',
            'Custom integrations',
            'Dedicated analyst',
            'Quarterly updates',
            'Priority support',
          ],
          cta: 'Contact Us',
          popular: false,
        },
      ],
    },
    caseStudies: {
      title: 'Real Results',
      subtitle: 'See how businesses transformed their online presence with our Ultimate Package.',
    },
    demo: {
      title: 'See the AI in Action',
      subtitle: 'Watch how our analyzer scans and evaluates your website in real-time.',
    },
    cta: {
      title: 'Ready to Transform Your Online Presence?',
      subtitle: 'Get your complete optimization blueprint and start seeing results.',
      button: 'Get Your Analysis Now',
    },
  } : {
    hero: {
      badge: 'Die Zukunft der Digital-Optimierung',
      title: 'Ultimate Package',
      subtitle: 'Eine KI-Analyse. Ein kompletter Blueprint. Transformiere deine gesamte Online-Präsenz.',
      description: 'Unser proprietäres KI-System analysiert deine Website und generiert einen umfassenden Optimierungs-Blueprint — inklusive Implementierungs-Prompts, priorisierten Aktionen und allen Daten, die du brauchst.',
      cta1: 'Analyse holen',
      cta2: 'Demo ansehen',
    },
    howItWorks: {
      title: 'So funktioniert\'s',
      subtitle: 'Von der Eingabe zum umsetzbaren Blueprint in 3 einfachen Schritten.',
      steps: [
        {
          icon: Globe,
          title: 'Website eingeben',
          description: 'Gib deine Website-URL und grundlegende Geschäftsinformationen an. Unser System erledigt den Rest.',
          details: ['Kein technisches Wissen nötig', 'Funktioniert mit jeder Website', '2 Minuten zum Ausfüllen'],
        },
        {
          icon: Bot,
          title: 'KI-Tiefenanalyse',
          description: 'Unser proprietärer Analyzer führt einen umfassenden Scan deiner digitalen Präsenz durch.',
          details: ['50+ Ranking-Faktoren analysiert', 'Wettbewerber-Benchmarking', 'Marktchancen-Erkennung'],
        },
        {
          icon: FileOutput,
          title: 'Blueprint erhalten',
          description: 'Erhalte ein komplettes Optimierungs-File mit implementierungsreifen Prompts und priorisierten Aktionen.',
          details: ['Umsetzbare Empfehlungen', 'KI-fertige Prompts enthalten', 'Nach Priorität gerankte Tasks'],
        },
      ],
    },
    features: {
      title: 'Was analysiert wird',
      subtitle: 'Ein umfassender Deep-Dive in jeden Aspekt deiner Online-Präsenz.',
      categories: [
        {
          icon: Search,
          title: 'SEO-Analyse',
          items: ['Technisches SEO-Audit', 'Keyword-Chancen-Mapping', 'Content-Gap-Analyse', 'Backlink-Profil-Review', 'Local SEO-Optimierung'],
        },
        {
          icon: Palette,
          title: 'UX & Design',
          items: ['User Experience-Bewertung', 'Mobile Responsiveness', 'Page Speed-Optimierung', 'Visuelle Hierarchie-Analyse', 'Conversion-Pfad-Mapping'],
        },
        {
          icon: Code,
          title: 'Technischer Stack',
          items: ['Performance-Metriken', 'Core Web Vitals', 'Sicherheits-Assessment', 'Strukturierte Daten-Review', 'Accessibility-Compliance'],
        },
        {
          icon: TrendingUp,
          title: 'Conversion',
          items: ['CTA-Effektivität', 'Trust-Signal-Platzierung', 'Formular-Optimierung', 'Sales-Funnel-Analyse', 'A/B-Testing-Chancen'],
        },
        {
          icon: Users,
          title: 'Wettbewerb',
          items: ['Konkurrenz-Benchmarking', 'Marktpositionierung', 'Content-Vergleich', 'Feature-Gap-Analyse', 'Preis-Intelligence'],
        },
        {
          icon: Target,
          title: 'Strategie',
          items: ['Wachstums-Chancen-Roadmap', 'Quick Wins-Identifikation', 'Langzeit-Initiativen', 'Ressourcen-Priorisierung', 'Implementierungs-Timeline'],
        },
      ],
    },
    deliverables: {
      title: 'Was du erhältst',
      subtitle: 'Alles, was du brauchst, um deine Online-Präsenz zu transformieren.',
      items: [
        { icon: FileOutput, title: 'Komplettes Analyse-File', description: 'Umfassender Report mit allen Erkenntnissen, Metriken und Empfehlungen.' },
        { icon: Lightbulb, title: 'KI-Implementierungs-Prompts', description: 'Sofort einsetzbare Prompts für jede Empfehlung mit KI-Tools.' },
        { icon: Layers, title: 'Prioritäts-Aktionsplan', description: 'Tasks gerankt nach Impact und Aufwand für maximale ROI-Optimierung.' },
        { icon: BarChart3, title: 'Benchmark-Daten', description: 'Wie du im Vergleich zur Konkurrenz stehst mit konkreten Verbesserungszielen.' },
        { icon: Clock, title: '90-Tage-Roadmap', description: 'Woche-für-Woche Implementierungsplan für nachhaltiges Wachstum.' },
        { icon: Shield, title: 'Technische Spezifikationen', description: 'Entwickler-fertige Specs für alle technischen Implementierungen.' },
      ],
    },
    pricing: {
      title: 'Preise',
      subtitle: 'Wähle das Paket, das zu deinen Bedürfnissen passt.',
      packages: [
        {
          name: 'Starter-Analyse',
          price: 'CHF 490',
          description: 'Perfekt für kleine Unternehmen, die mit Optimierung starten.',
          features: [
            'Kern-SEO-Audit',
            'Basis-Konkurrenzanalyse',
            'Top 10 Prioritäts-Fixes',
            'Implementierungs-Guide',
            'E-Mail-Zustellung',
          ],
          cta: 'Jetzt starten',
          popular: false,
        },
        {
          name: 'Ultimate Package',
          price: 'CHF 1\'490',
          description: 'Kompletter Transformations-Blueprint für ernsthafte Unternehmen.',
          features: [
            'Volle 50+ Faktor-Analyse',
            'Tiefe Konkurrenz-Recherche',
            'KI-Implementierungs-Prompts',
            'Prioritäts-Aktionsplan',
            '90-Tage-Roadmap',
            'Technische Spezifikationen',
            'Video-Walkthrough-Call',
          ],
          cta: 'Ultimate holen',
          popular: true,
        },
        {
          name: 'Enterprise',
          price: 'Auf Anfrage',
          description: 'Für Multi-Location-Businesses und komplexe digitale Ökosysteme.',
          features: [
            'Alles aus Ultimate',
            'Multi-Site-Analyse',
            'Custom Integrationen',
            'Dedizierter Analyst',
            'Quartals-Updates',
            'Priority-Support',
          ],
          cta: 'Kontakt',
          popular: false,
        },
      ],
    },
    caseStudies: {
      title: 'Echte Resultate',
      subtitle: 'Sieh, wie Unternehmen ihre Online-Präsenz mit unserem Ultimate Package transformiert haben.',
    },
    demo: {
      title: 'Sieh die KI in Aktion',
      subtitle: 'Beobachte, wie unser Analyzer deine Website in Echtzeit scannt und bewertet.',
    },
    cta: {
      title: 'Bereit, deine Online-Präsenz zu transformieren?',
      subtitle: 'Hol dir deinen kompletten Optimierungs-Blueprint und sieh Resultate.',
      button: 'Jetzt Analyse holen',
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
        ? 'The analysis revealed optimization opportunities we never knew existed. Implementation was straightforward with the provided prompts.'
        : 'Die Analyse deckte Optimierungsmöglichkeiten auf, von denen wir nichts wussten. Die Umsetzung war mit den Prompts unkompliziert.',
    },
    {
      name: 'Zügelhelden.ch',
      url: 'https://zuegelhelden.ch',
      industry: isEnglish ? 'Moving Company' : 'Umzugsfirma',
      improvements: [
        { metric: isEnglish ? 'Google Ranking' : 'Google-Ranking', before: 'Page 3', after: 'Top 3', change: isEnglish ? 'Top 3' : 'Top 3' },
        { metric: isEnglish ? 'Monthly Leads' : 'Monatliche Leads', before: '45', after: '156', change: '+247%' },
        { metric: isEnglish ? 'Cost per Lead' : 'Kosten pro Lead', before: 'CHF 89', after: 'CHF 31', change: '-65%' },
      ],
      testimonial: isEnglish
        ? 'Within 90 days, we tripled our organic leads. The blueprint was like having a senior marketing team.'
        : 'Innerhalb von 90 Tagen haben wir unsere organischen Leads verdreifacht. Der Blueprint war wie ein Senior Marketing Team.',
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
        ? 'The technical specifications alone saved us months of consulting time. Incredible depth of analysis.'
        : 'Allein die technischen Spezifikationen haben uns Monate an Beratungszeit gespart. Unglaubliche Analysetiefe.',
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
        ? 'Our mobile experience was terrible. The blueprint fixed everything and our bookings exploded.'
        : 'Unsere Mobile Experience war schrecklich. Der Blueprint hat alles gefixt und unsere Buchungen sind explodiert.',
    },
    {
      name: 'Umzugexpress.ch',
      url: 'https://umzugexpress.ch',
      industry: isEnglish ? 'Express Moving' : 'Express Umzüge',
      improvements: [
        { metric: isEnglish ? 'Local Pack' : 'Local Pack', before: isEnglish ? 'Not ranked' : 'Nicht gerankt', after: '#1', change: '#1' },
        { metric: isEnglish ? 'Reviews' : 'Bewertungen', before: '23', after: '127', change: '+452%' },
        { metric: isEnglish ? 'Revenue' : 'Umsatz', before: 'CHF 45k', after: 'CHF 112k', change: '+149%' },
      ],
      testimonial: isEnglish
        ? 'From invisible to #1 in local search. The ROI on this package is insane.'
        : 'Von unsichtbar zu #1 in der lokalen Suche. Der ROI dieses Pakets ist wahnsinnig.',
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
        ? 'E-commerce specific insights transformed our funnel. Every recommendation was actionable.'
        : 'E-Commerce-spezifische Insights haben unseren Funnel transformiert. Jede Empfehlung war umsetzbar.',
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
        ? 'Our trust signals were missing. The analysis showed exactly where to place them for maximum impact.'
        : 'Unsere Trust-Signale fehlten. Die Analyse zeigte genau, wo wir sie für maximalen Impact platzieren sollten.',
    },
  ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Ultimate Package - AI-Powered Website Analysis' : 'Ultimate Package - KI-gestützte Website-Analyse'}
        description={isEnglish 
          ? 'Get a complete optimization blueprint for your website. Our AI analyzes 50+ factors and delivers implementation-ready recommendations.'
          : 'Erhalte einen kompletten Optimierungs-Blueprint für deine Website. Unsere KI analysiert 50+ Faktoren und liefert umsetzungsreife Empfehlungen.'}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-ai/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <SectionContainer padding="large" background="none" className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-ai/10 backdrop-blur-sm border border-ai/20 animate-fade-in">
              <Sparkles className="w-4 h-4 text-ai" />
              <span className="text-sm font-medium text-ai">{content.hero.badge}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <span className="text-gradient-ai">{content.hero.title}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {content.hero.subtitle}
            </p>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
              {content.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CTAButton
                variant="primary"
                size="lg"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location="ultimate-hero"
                className="text-lg px-8 py-4 glow-ai"
              >
                {content.hero.cta1}
                <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <CTAButton
                variant="secondary"
                size="lg"
                href="#demo"
                location="ultimate-hero"
                className="text-lg px-8 py-4"
              >
                <Play className="mr-2 w-5 h-5" />
                {content.hero.cta2}
              </CTAButton>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Interactive Demo Section */}
      <SectionContainer id="demo" background="muted" className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
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

      {/* How It Works */}
      <SectionContainer background="default" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative">
          <ScrollReveal>
            <SectionHeader 
              title={content.howItWorks.title}
              subtitle={content.howItWorks.subtitle}
            />
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/50 via-ai/50 to-primary/50" />
            
            {content.howItWorks.steps.map((step, index) => (
              <ScrollReveal key={index}>
                <div className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-ai/30 transition-all duration-300 group">
                  {/* Step number */}
                  <div className="absolute -top-4 w-10 h-10 rounded-full bg-ai text-ai-foreground flex items-center justify-center font-bold z-10">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-ai/20 flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform">
                    <step.icon className="w-10 h-10 text-ai" />
                  </div>
                  
                  <h3 className="text-xl font-bold font-display mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-6">{step.description}</p>
                  
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-ai flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
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
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {content.deliverables.items.map((item, index) => (
              <StaggerItem key={index}>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-ai/30 transition-all duration-300 group">
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Pricing */}
      <SectionContainer background="default" className="relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative">
          <ScrollReveal>
            <SectionHeader 
              title={content.pricing.title}
              subtitle={content.pricing.subtitle}
            />
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {content.pricing.packages.map((pkg, index) => (
              <ScrollReveal key={index}>
                <div className={cn(
                  "p-8 rounded-2xl border transition-all duration-300 flex flex-col h-full relative",
                  pkg.popular 
                    ? "bg-gradient-to-br from-ai/10 to-primary/10 border-ai/30 scale-105 shadow-xl shadow-ai/10" 
                    : "bg-card border-border/50 hover:border-primary/30"
                )}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-ai text-ai-foreground text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {isEnglish ? 'Most Popular' : 'Beliebteste'}
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold font-display mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold font-display text-gradient mb-2">{pkg.price}</div>
                  <p className="text-sm text-muted-foreground mb-6">{pkg.description}</p>
                  
                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className={cn(
                          "w-4 h-4 flex-shrink-0",
                          pkg.popular ? "text-ai" : "text-primary"
                        )} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <CTAButton
                    variant={pkg.popular ? 'primary' : 'secondary'}
                    href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                    location="ultimate-pricing"
                    className={cn("w-full justify-center", pkg.popular && "glow-ai")}
                  >
                    {pkg.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </CTAButton>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Final CTA */}
      <SectionContainer background="muted" className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        
        <div className="relative text-center max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              {content.cta.title}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {content.cta.subtitle}
            </p>
            <CTAButton
              variant="primary"
              size="lg"
              href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
              location="ultimate-final-cta"
              className="text-lg px-10 py-5 glow-primary"
            >
              {content.cta.button}
              <ArrowRight className="ml-2 w-5 h-5" />
            </CTAButton>
          </ScrollReveal>
        </div>
      </SectionContainer>
    </Layout>
  );
}
