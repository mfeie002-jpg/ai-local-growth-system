import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion/ScrollReveal';
import { AnalysisRequestForm } from '@/components/forms/AnalysisRequestForm';
import { CTAButton } from '@/components/CTAButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  Rocket,
  Target,
  ExternalLink,
  TrendingUp,
  Users,
  Shield,
  Zap,
  BarChart3,
  Bot,
  Globe,
  FileCheck,
  Volume2,
  Pause,
  Play,
  Crown,
  Handshake,
  Building,
  Code,
  Lock,
  Brain,
  Layers,
  LineChart
} from 'lucide-react';
import { AIScannerDemo } from '@/components/AIScannerDemo';
import { useState, useRef } from 'react';

export default function InvestorPage() {
  const { isEnglish } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const content = isEnglish ? {
    hero: {
      badge: 'AI-First Growth System',
      title: 'itsFeierabend.ch',
      subtitle: 'AI-powered growth system for local Swiss service providers',
      description: 'More orders with less administrative effort. Data-driven automation system with Swiss precision.',
    },
    vision: {
      title: 'What is the Ultimate Package?',
      items: [
        { icon: Bot, title: 'Automated Website Analysis', description: 'AI analyzes content, SEO performance, usability, and conversion strength - in minutes instead of hours.' },
        { icon: FileCheck, title: 'Audit Report & Score', description: 'System generates a report with overall score and concrete recommendations for all identified improvement areas.' },
        { icon: Rocket, title: 'Implementation', description: 'Our team implements all recommended measures - from design & copy to SEO, tracking, performance, automation.' },
        { icon: Lock, title: 'Data Ownership', description: 'All data, results, prompts, and created assets remain with the customer - never used for training other AI models.' },
      ],
    },
    pricing: {
      title: 'Pricing Models',
      subtitle: 'Transparent pricing in CHF',
      plans: [
        {
          name: 'Start',
          price: "1'990",
          period: 'one-time',
          description: 'Entry package with initial website analysis, audit report, and implementation of key optimizations.',
          features: ['Initial AI Website Analysis', 'Comprehensive Audit Report', 'Top 10 Quick Fixes', 'Implementation Support'],
          highlight: false,
        },
        {
          name: 'Growth',
          price: "3'900",
          period: '/month',
          description: 'Continuous optimization subscription with monthly audits and ongoing updates.',
          features: ['Monthly AI Audits', 'Continuous SEO/Content Updates', 'Performance Tuning', 'Regular Reports', 'Priority Support'],
          highlight: true,
        },
        {
          name: 'Scale',
          price: "6'900",
          period: '/month',
          description: 'Full-scale growth solution for scaling businesses.',
          features: ['All Growth Features', 'Retargeting Campaigns', 'CRM Integration', 'Slack Notifications', 'Review Engine', 'Dedicated Success Manager'],
          highlight: false,
        },
      ],
    },
    caseStudies: {
      title: 'Success Stories 🚀',
      subtitle: 'Real results from real Swiss businesses',
    },
    technical: {
      title: 'Technical Edge',
      items: [
        { icon: Brain, title: 'Individual Optimization Bot', description: 'Each customer gets their own AI bot trained with their individual project data. Learning improves with every launch.' },
        { icon: Shield, title: 'Unique in Switzerland', description: 'No other provider combines AI analysis, copywriting, implementation, and data protection compliance in one integrated solution.' },
      ],
    },
    strategic: {
      title: 'Strategic Positioning',
      items: [
        { icon: Layers, title: 'AI-first Marketing Infrastructure', description: 'Built from the ground up as AI-centric. Continuous AI pipeline from audit to content creation to implementation.' },
        { icon: Building, title: 'Product, not Agency', description: 'Standardized modules and processes instead of ad-hoc services. Same core system, individually configured.' },
        { icon: LineChart, title: 'Learning Pipeline', description: 'Every project trains our models further. Cost-per-result decreases over time as AI becomes smarter.' },
      ],
    },
    cta: {
      title: 'Investment & Partnership Opportunities',
      subtitle: 'Join us in revolutionizing local service marketing',
      invest: {
        title: 'For Investors',
        description: 'Early-stage investment opportunity in an AI-first company with product focus. Looking for smart capital and strategic partners.',
      },
      partner: {
        title: 'For Partners',
        description: 'Co-selling partnerships, API usage for tech partners, and white-label options available.',
      },
    },
  } : {
    hero: {
      badge: 'KI-gestütztes Growth-System',
      title: 'itsFeierabend.ch',
      subtitle: 'KI-gestütztes Growth-System für lokale Schweizer Dienstleister',
      description: 'Mehr Aufträge bei weniger Administrationsaufwand. Datengetriebenes Automatisierungssystem mit Schweizer Präzision.',
    },
    vision: {
      title: 'Was ist das Ultimate Package?',
      items: [
        { icon: Bot, title: 'Automatisierte Website-Analyse', description: 'KI analysiert Inhalt, SEO-Performance, Usability und Conversion-Stärke — in Minuten statt Stunden.' },
        { icon: FileCheck, title: 'Audit-Report & Score', description: 'System generiert Report mit Gesamtscore und konkreten Handlungsempfehlungen für alle Verbesserungsfelder.' },
        { icon: Rocket, title: 'Umsetzung der Empfehlungen', description: 'Unser Team setzt alle Massnahmen um — von Design & Copy über SEO, Tracking, Performance bis Automatisierung.' },
        { icon: Lock, title: 'Datenhoheit beim Kunden', description: 'Alle Daten, Ergebnisse, Prompts und Assets verbleiben beim Kunden — keine Nutzung für Training anderer KI-Modelle.' },
      ],
    },
    pricing: {
      title: 'Pricing-Modelle',
      subtitle: 'Transparente Preise in CHF',
      plans: [
        {
          name: 'Start',
          price: "1'990",
          period: 'einmalig',
          description: 'Einsteiger-Paket mit initialer Website-Analyse, Audit-Report und Umsetzung der wichtigsten Optimierungen.',
          features: ['Initiale KI-Website-Analyse', 'Umfassender Audit-Report', 'Top 10 Quick Fixes', 'Implementierungs-Support'],
          highlight: false,
        },
        {
          name: 'Growth',
          price: "3'900",
          period: '/Monat',
          description: 'Kontinuierliches Optimierungs-Abo mit monatlichen Audits und laufenden Updates.',
          features: ['Monatliche KI-Audits', 'Laufende SEO/Content-Updates', 'Performance-Tuning', 'Regelmässige Reports', 'Prioritäts-Support'],
          highlight: true,
        },
        {
          name: 'Scale',
          price: "6'900",
          period: '/Monat',
          description: 'Vollumfängliche Wachstums-Lösung für skalierende Unternehmen.',
          features: ['Alle Growth-Leistungen', 'Retargeting-Kampagnen', 'CRM-Integration', 'Slack-Benachrichtigungen', 'Review-Engine', 'Dedicated Success Manager'],
          highlight: false,
        },
      ],
    },
    caseStudies: {
      title: 'Erfolgsbeispiele 🚀',
      subtitle: 'Echte Resultate von echten Schweizer Unternehmen',
    },
    technical: {
      title: 'Technischer Mehrwert',
      items: [
        { icon: Brain, title: 'Individueller Optimierungs-Bot', description: 'Jeder Kunde erhält seinen eigenen AI-Bot, trainiert mit den individuellen Daten seines Projekts. Mit jedem Launch lernt das System.' },
        { icon: Shield, title: 'Einzigartig in der Schweiz', description: 'Kein anderer Anbieter verbindet KI-Analyse, Copywriting, Implementation und Datenschutzkonformität in einer integrierten Lösung.' },
      ],
    },
    strategic: {
      title: 'Strategische Positionierung',
      items: [
        { icon: Layers, title: 'AI-first Marketing-Infrastruktur', description: 'Von Grund auf AI-zentriert. Durchgängige KI-Pipeline — vom Audit über Content-Erstellung bis zur Umsetzung.' },
        { icon: Building, title: 'Produkt- statt Agentur-Modell', description: 'Standardisierte Module und Prozesse statt ad-hoc Services. Gleiches Kernsystem, individuell konfiguriert.' },
        { icon: LineChart, title: 'Lernende Pipeline', description: 'Jedes Projekt trainiert unsere Modelle weiter. Cost-per-Result sinkt mit der Zeit, da KI stetig smarter wird.' },
      ],
    },
    cta: {
      title: 'Investment & Partner-Möglichkeiten',
      subtitle: 'Gemeinsam lokales Service-Marketing revolutionieren',
      invest: {
        title: 'Für Investoren',
        description: 'Frühphasen-Investment in ein AI-first Unternehmen mit Produktfokus. Gesucht: Smart Capital und strategische Partner.',
      },
      partner: {
        title: 'Für Partner',
        description: 'Co-Selling-Partnerschaften, API-Nutzung für Tech-Partner und White-Label-Optionen verfügbar.',
      },
    },
  };

  // Case Studies data
  const caseStudies = [
    {
      name: 'umzugscheck.ch',
      improvements: '20+ Optimierungen',
      metrics: [
        { label: 'PageSpeed', before: '72', after: '91' },
        { label: 'Leads/Quartal', change: '+28%' },
      ],
    },
    {
      name: 'reride.ch',
      improvements: 'UX/UI-Redesign + SEO',
      metrics: [
        { label: 'Ladezeit', change: '-40%' },
        { label: 'Conversion-Rate', change: '+18%' },
        { label: 'Org. Traffic', change: '+46%' },
      ],
    },
    {
      name: 'itsfeierabend.ch',
      improvements: 'Showcase-Optimierung',
      metrics: [
        { label: 'Lighthouse Desktop', after: '99' },
        { label: 'Lighthouse Mobile', after: '90' },
        { label: 'Demo-Anfragen', change: '×2' },
      ],
    },
    {
      name: 'feierabend-umzug.ch',
      improvements: 'Lokale SEO + Funnel',
      metrics: [
        { label: 'Ranking "Umzug Offerte Zürich"', after: '#1' },
        { label: 'Ladezeit', change: '-50%' },
        { label: 'Conversion-Rate', change: '×2' },
      ],
    },
    {
      name: 'zuegelhelden.ch',
      improvements: 'Komplett-Relaunch',
      metrics: [
        { label: 'Org. Besucher', change: '+150%' },
        { label: 'Bounce Rate', change: '-30%' },
      ],
    },
    {
      name: 'gentlehands.ch',
      improvements: 'Struktur & Copywriting',
      metrics: [
        { label: 'SEO-Sichtbarkeit', change: '+40%' },
        { label: 'Anfragen', change: '↑↑' },
      ],
    },
  ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Investors & Partners - itsFeierabend.ch' : 'Investoren & Partner - itsFeierabend.ch'}
        description={content.hero.description}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-ai/10 rounded-full blur-3xl animate-float" />
        
        <SectionContainer padding="large" background="none" className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-ai/10 backdrop-blur-sm border border-ai/20 animate-fade-in">
              <Sparkles className="w-4 h-4 text-ai" />
              <span className="text-sm font-medium text-ai">{content.hero.badge}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <span className="text-gradient-ai">{content.hero.title}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {content.hero.subtitle}
            </p>
            
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
              {content.hero.description}
            </p>

            <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CTAButton href="#demo" size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                {isEnglish ? 'See Demo' : 'Demo ansehen'}
              </CTAButton>
              <Button variant="outline" size="lg" asChild>
                <a href="#contact">
                  <Handshake className="w-4 h-4 mr-2" />
                  {isEnglish ? 'Partner with us' : 'Partnerschaft anfragen'}
                </a>
              </Button>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* What is Ultimate Package */}
      <SectionContainer background="muted">
        <ScrollReveal>
          <SectionHeader 
            title={content.vision.title}
          />
        </ScrollReveal>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.vision.items.map((item, index) => (
            <ScrollReveal key={index}>
              <Card className="h-full hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </SectionContainer>

      {/* Interactive Demo */}
      <SectionContainer id="demo" background="default">
        <ScrollReveal>
          <SectionHeader 
            title={isEnglish ? 'See the AI in Action' : 'Sieh die KI in Aktion'}
            subtitle={isEnglish ? 'Watch how our analyzer scans websites in real-time.' : 'Beobachte, wie unser Analyzer Websites in Echtzeit scannt.'}
          />
        </ScrollReveal>
        
        <ScrollReveal>
          <AIScannerDemo />
        </ScrollReveal>
      </SectionContainer>

      {/* Audio Demo */}
      <SectionContainer background="muted">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              {isEnglish ? '🎧 Hear Our Vision' : '🎧 Höre unsere Vision'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isEnglish 
                ? 'A 30-second overview of how we transform local service businesses.'
                : 'Ein 30-Sekunden-Überblick, wie wir lokale Dienstleister transformieren.'}
            </p>
            
            <div className="p-6 rounded-2xl bg-card border border-border/50 inline-flex items-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-16 h-16"
                onClick={toggleAudio}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              <div className="text-left">
                <p className="font-medium">{isEnglish ? 'Ultimate Package Pitch' : 'Ultimate Package Pitch'}</p>
                <p className="text-sm text-muted-foreground">0:30 • {isEnglish ? 'Click to play' : 'Klicken zum Abspielen'}</p>
              </div>
            </div>
            
            {/* Hidden audio element - would need actual audio file */}
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)}>
              <source src="/audio/investor-pitch.mp3" type="audio/mpeg" />
            </audio>
            
            <p className="text-xs text-muted-foreground mt-4">
              {isEnglish 
                ? 'Audio plays only on user interaction (GDPR compliant)'
                : 'Audio startet nur bei Nutzerinteraktion (DSGVO-konform)'}
            </p>
          </div>
        </ScrollReveal>
      </SectionContainer>

      {/* Pricing Cards */}
      <SectionContainer background="default">
        <ScrollReveal>
          <SectionHeader 
            title={content.pricing.title}
            subtitle={content.pricing.subtitle}
          />
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {content.pricing.plans.map((plan, index) => (
            <ScrollReveal key={index}>
              <Card className={`h-full relative ${plan.highlight ? 'border-primary shadow-lg shadow-primary/20' : ''}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">
                      <Crown className="w-3 h-3 mr-1" />
                      {isEnglish ? 'Most Popular' : 'Beliebteste'}
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">CHF {plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${plan.highlight ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.highlight ? 'default' : 'outline'}
                  >
                    {isEnglish ? 'Get Started' : 'Jetzt starten'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </SectionContainer>

      {/* Case Studies */}
      <SectionContainer background="muted">
        <ScrollReveal>
          <SectionHeader 
            title={content.caseStudies.title}
            subtitle={content.caseStudies.subtitle}
          />
        </ScrollReveal>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caseStudies.map((study, index) => (
            <ScrollReveal key={index}>
              <Card className="h-full hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold">{study.name}</h3>
                    <a href={`https://${study.name}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{study.improvements}</p>
                  <div className="space-y-2">
                    {study.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className="font-bold text-primary">
                          {metric.change || (metric.before ? `${metric.before} → ${metric.after}` : metric.after)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </SectionContainer>

      {/* Technical & Strategic */}
      <SectionContainer background="default">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Technical */}
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Code className="w-6 h-6 text-primary" />
              {content.technical.title}
            </h2>
            <div className="space-y-4">
              {content.technical.items.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>

          {/* Strategic */}
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-ai" />
              {content.strategic.title}
            </h2>
            <div className="space-y-4">
              {content.strategic.items.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-ai/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-ai" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </SectionContainer>

      {/* Investor & Partner CTA */}
      <SectionContainer id="contact" background="muted">
        <ScrollReveal>
          <SectionHeader 
            title={content.cta.title}
            subtitle={content.cta.subtitle}
          />
        </ScrollReveal>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Investors */}
          <ScrollReveal>
            <Card className="h-full border-primary/30 bg-gradient-to-br from-primary/5 to-background">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{content.cta.invest.title}</h3>
                <p className="text-muted-foreground mb-6">{content.cta.invest.description}</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {isEnglish ? 'AI-first product company' : 'AI-first Produktunternehmen'}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {isEnglish ? 'Proven Swiss market traction' : 'Bewährte Schweizer Markt-Traktion'}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {isEnglish ? 'Scalable SaaS model' : 'Skalierbares SaaS-Modell'}
                  </li>
                </ul>
                <Button className="w-full" size="lg">
                  {isEnglish ? 'Schedule Investor Call' : 'Investoren-Call buchen'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Partners */}
          <ScrollReveal>
            <Card className="h-full border-ai/30 bg-gradient-to-br from-ai/5 to-background">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-ai/10 flex items-center justify-center mb-4">
                  <Handshake className="w-7 h-7 text-ai" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{content.cta.partner.title}</h3>
                <p className="text-muted-foreground mb-6">{content.cta.partner.description}</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {isEnglish ? 'Co-selling partnerships' : 'Co-Selling-Partnerschaften'}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {isEnglish ? 'API integration' : 'API-Integration'}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {isEnglish ? 'White-label options' : 'White-Label-Optionen'}
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-ai text-ai hover:bg-ai/10" size="lg">
                  {isEnglish ? 'Become a Partner' : 'Partner werden'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            {isEnglish 
              ? "Let's innovate local services together! 🚀"
              : "Lass uns gemeinsam lokale Dienstleistungen revolutionieren! 🚀"}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="link">
              <Globe className="w-4 h-4 mr-2" />
              itsfeierabend.ch
            </Button>
            <Button variant="link">
              {isEnglish ? 'Contact: hello@itsfeierabend.ch' : 'Kontakt: hello@itsfeierabend.ch'}
            </Button>
          </div>
        </div>
      </SectionContainer>

      {/* Final CTA Form */}
      <SectionContainer background="default">
        <div className="max-w-xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">
                {isEnglish ? 'Try the Ultimate Package Now' : 'Ultimate Package jetzt testen'}
              </h2>
              <p className="text-muted-foreground">
                {isEnglish ? 'Start your free website analysis today.' : 'Starte jetzt deine kostenlose Website-Analyse.'}
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal>
            <AnalysisRequestForm />
          </ScrollReveal>
        </div>
      </SectionContainer>
    </Layout>
  );
}
