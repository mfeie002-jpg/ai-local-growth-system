import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { AnalysisRequestForm } from '@/components/forms/AnalysisRequestForm';
import { Link } from 'react-router-dom';
import {
  CheckCircle, ArrowUpRight, Rocket, Target, ExternalLink,
  TrendingUp, Shield, Bot, Globe, FileCheck,
  Volume2, Play, Crown, Handshake, Building, Code, Lock, Brain,
  Layers, LineChart,
} from 'lucide-react';
import { AIScannerDemo } from '@/components/AIScannerDemo';
import { useState, useRef } from 'react';

export default function InvestorPage() {
  const { isEnglish } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
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
        { icon: Bot, title: 'Automated Website Analysis', description: 'AI analyzes content, SEO performance, usability, and conversion strength — in minutes instead of hours.' },
        { icon: FileCheck, title: 'Audit Report & Score', description: 'System generates a report with overall score and concrete recommendations for all identified improvement areas.' },
        { icon: Rocket, title: 'Implementation', description: 'Our team implements all recommended measures — from design & copy to SEO, tracking, performance, automation.' },
        { icon: Lock, title: 'Data Ownership', description: 'All data, results, prompts, and assets remain with the customer — never used for training other AI models.' },
      ],
    },
    pricing: {
      title: 'Pricing Models', subtitle: 'Transparent pricing in CHF',
      plans: [
        { name: 'Start', price: "1'990", period: 'one-time', description: 'Entry package with initial website analysis, audit report, and implementation of key optimizations.', features: ['Initial AI Website Analysis', 'Comprehensive Audit Report', 'Top 10 Quick Fixes', 'Implementation Support'], highlight: false },
        { name: 'Growth', price: "3'900", period: '/month', description: 'Continuous optimization subscription with monthly audits and ongoing updates.', features: ['Monthly AI Audits', 'Continuous SEO/Content Updates', 'Performance Tuning', 'Regular Reports', 'Priority Support'], highlight: true },
        { name: 'Scale', price: "6'900", period: '/month', description: 'Full-scale growth solution for scaling businesses.', features: ['All Growth Features', 'Retargeting Campaigns', 'CRM Integration', 'Slack Notifications', 'Review Engine', 'Dedicated Success Manager'], highlight: false },
      ],
    },
    caseStudies: { title: 'Success Stories', subtitle: 'Real results from real Swiss businesses' },
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
      title: 'Investment & Partnership Opportunities', subtitle: 'Join us in revolutionizing local service marketing',
      invest: { title: 'For Investors', description: 'Early-stage investment opportunity in an AI-first company with product focus. Looking for smart capital and strategic partners.' },
      partner: { title: 'For Partners', description: 'Co-selling partnerships, API usage for tech partners, and white-label options available.' },
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
      title: 'Pricing-Modelle', subtitle: 'Transparente Preise in CHF',
      plans: [
        { name: 'Start', price: "1'990", period: 'einmalig', description: 'Einsteiger-Paket mit initialer Website-Analyse, Audit-Report und Umsetzung der wichtigsten Optimierungen.', features: ['Initiale KI-Website-Analyse', 'Umfassender Audit-Report', 'Top 10 Quick Fixes', 'Implementierungs-Support'], highlight: false },
        { name: 'Growth', price: "3'900", period: '/Monat', description: 'Kontinuierliches Optimierungs-Abo mit monatlichen Audits und laufenden Updates.', features: ['Monatliche KI-Audits', 'Laufende SEO/Content-Updates', 'Performance-Tuning', 'Regelmässige Reports', 'Prioritäts-Support'], highlight: true },
        { name: 'Scale', price: "6'900", period: '/Monat', description: 'Vollumfängliche Wachstums-Lösung für skalierende Unternehmen.', features: ['Alle Growth-Leistungen', 'Retargeting-Kampagnen', 'CRM-Integration', 'Slack-Benachrichtigungen', 'Review-Engine', 'Dedicated Success Manager'], highlight: false },
      ],
    },
    caseStudies: { title: 'Erfolgsbeispiele', subtitle: 'Echte Resultate von echten Schweizer Unternehmen' },
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
      title: 'Investment & Partner-Möglichkeiten', subtitle: 'Gemeinsam lokales Service-Marketing revolutionieren',
      invest: { title: 'Für Investoren', description: 'Frühphasen-Investment in ein AI-first Unternehmen mit Produktfokus. Gesucht: Smart Capital und strategische Partner.' },
      partner: { title: 'Für Partner', description: 'Co-Selling-Partnerschaften, API-Nutzung für Tech-Partner und White-Label-Optionen verfügbar.' },
    },
  };

  const caseStudies = [
    { name: 'umzugscheck.ch', improvements: '20+ Optimierungen', metrics: [{ label: 'PageSpeed', before: '72', after: '91' }, { label: 'Leads/Quartal', change: '+28%' }] },
    { name: 'reride.ch', improvements: 'UX/UI-Redesign + SEO', metrics: [{ label: 'Ladezeit', change: '-40%' }, { label: 'Conversion-Rate', change: '+18%' }, { label: 'Org. Traffic', change: '+46%' }] },
    { name: 'itsfeierabend.ch', improvements: 'Showcase-Optimierung', metrics: [{ label: 'Lighthouse Desktop', after: '99' }, { label: 'Lighthouse Mobile', after: '90' }, { label: 'Demo-Anfragen', change: '×2' }] },
    { name: 'feierabend-umzug.ch', improvements: 'Lokale SEO + Funnel', metrics: [{ label: 'Ranking "Umzug Offerte Zürich"', after: '#1' }, { label: 'Ladezeit', change: '-50%' }, { label: 'Conversion-Rate', change: '×2' }] },
    { name: 'zuegelhelden.ch', improvements: 'Komplett-Relaunch', metrics: [{ label: 'Org. Besucher', change: '+150%' }, { label: 'Bounce Rate', change: '-30%' }] },
    { name: 'gentlehands.ch', improvements: 'Struktur & Copywriting', metrics: [{ label: 'SEO-Sichtbarkeit', change: '+40%' }, { label: 'Anfragen', change: '↑↑' }] },
  ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Investors & Partners — itsFeierabend.ch' : 'Investoren & Partner — itsFeierabend.ch'}
        description={content.hero.description}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-32 lg:py-40">
        <div className="absolute inset-0 grid-pattern opacity-[0.06]" />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute inset-0 noise-overlay opacity-[0.04]" />

        <div className="container-section relative">
          <div className="grid grid-cols-12 gap-6 lg:gap-12">
            <aside className="col-span-12 lg:col-span-3 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-foreground/40" />
                <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                  {isEnglish ? 'Capital / 01' : 'Kapital / 01'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {content.hero.badge}
              </p>
            </aside>

            <div className="col-span-12 lg:col-span-9">
              <ScrollReveal>
                <h1 className="font-editorial text-5xl sm:text-7xl lg:text-[8.5rem] font-bold leading-[0.85] tracking-tight">
                  itsFeierabend<em className="italic text-aurora">.ch</em>
                </h1>
                <p className="mt-8 max-w-2xl text-xl sm:text-2xl text-foreground/90 leading-snug font-light">
                  {content.hero.subtitle}
                </p>
                <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {content.hero.description}
                </p>

                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    href="#demo"
                    className="group inline-flex items-center gap-3 border-aurora bg-background/40 backdrop-blur-md px-6 py-4 font-editorial text-sm font-semibold tracking-[0.2em] uppercase hover:bg-background/60 transition-all"
                  >
                    <Play className="w-4 h-4" />
                    {isEnglish ? 'See Demo' : 'Demo ansehen'}
                  </a>
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-3 border border-foreground/40 px-6 py-4 font-editorial text-sm font-semibold tracking-[0.2em] uppercase hover:border-foreground transition-all"
                  >
                    <Handshake className="w-4 h-4" />
                    {isEnglish ? 'Partner with us' : 'Partnerschaft anfragen'}
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="border-b border-border/60 py-20 sm:py-28">
        <div className="container-section">
          <div className="mb-12 max-w-3xl">
            <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              02 — {isEnglish ? 'The product' : 'Das Produkt'}
            </span>
            <h2 className="mt-3 font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight">
              {content.vision.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/60 border border-border/60">
            {content.vision.items.map((item, i) => (
              <ScrollReveal key={i}>
                <div className="bg-card/40 backdrop-blur-sm p-8 h-full group hover:bg-card/60 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <item.icon className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-editorial text-xl font-semibold mb-3 leading-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="border-b border-border/60 py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-[0.03]" />
        <div className="container-section relative">
          <div className="mb-12 max-w-3xl">
            <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              03 — Demo
            </span>
            <h2 className="mt-3 font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight">
              {isEnglish ? <>The AI, <em className="italic text-aurora">in action.</em></> : <>Die KI, <em className="italic text-aurora">live.</em></>}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {isEnglish ? 'Watch our analyzer scan websites in real-time.' : 'Beobachte, wie unser Analyzer Websites in Echtzeit scannt.'}
            </p>
          </div>
          <ScrollReveal>
            <AIScannerDemo />
          </ScrollReveal>
        </div>
      </section>

      {/* Audio Pitch */}
      <section className="border-b border-border/60 py-20 sm:py-28">
        <div className="container-section">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                04 — {isEnglish ? 'Pitch' : 'Pitch'}
              </span>
              <h2 className="mt-3 font-editorial text-4xl sm:text-5xl font-bold leading-tight">
                {isEnglish ? 'Hear our vision.' : 'Höre unsere Vision.'}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {isEnglish ? 'A 30-second Swiss German pitch.' : 'Ein 30-Sekunden Schweizerdeutsch-Pitch.'}
              </p>
            </div>

            <div className="relative overflow-hidden border border-border/60 bg-card/40 backdrop-blur-sm p-8 sm:p-10">
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
              <div className="relative flex flex-col sm:flex-row items-center gap-6">
                <button
                  onClick={toggleAudio}
                  className="flex h-20 w-20 items-center justify-center border-aurora bg-background/60 hover:bg-background/80 transition-colors flex-shrink-0"
                  aria-label="Toggle audio"
                >
                  <Volume2 className="w-7 h-7 text-foreground" />
                </button>
                <div className="text-center sm:text-left flex-1">
                  <p className="font-editorial text-xl font-semibold mb-1">Ultimate Package Pitch</p>
                  <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-3">
                    {isEnglish ? 'Swiss German · 30s' : 'Schweizerdeutsch · 30s'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish ? 'Audio coming soon.' : 'Audio kommt bald.'}
                  </p>
                </div>
              </div>
              <audio ref={audioRef} onEnded={() => setIsPlaying(false)}>
                <source src="/audio/investor-pitch.mp3" type="audio/mpeg" />
              </audio>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-b border-border/60 py-20 sm:py-28">
        <div className="container-section">
          <div className="mb-12 max-w-3xl">
            <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              05 — {isEnglish ? 'Pricing' : 'Pricing'}
            </span>
            <h2 className="mt-3 font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight">
              {content.pricing.title}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">{content.pricing.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {content.pricing.plans.map((plan, i) => (
              <ScrollReveal key={i}>
                <div className={`relative h-full border bg-card/40 backdrop-blur-sm p-8 flex flex-col ${plan.highlight ? 'border-aurora shadow-[0_0_60px_-20px_hsl(var(--primary)/0.5)]' : 'border-border/60'}`}>
                  {plan.highlight && (
                    <div className="absolute -top-3 left-8 inline-flex items-center gap-1 px-3 py-1 bg-background border-aurora">
                      <Crown className="w-3 h-3 text-foreground" />
                      <span className="font-editorial text-[10px] font-semibold tracking-[0.25em] uppercase text-foreground">
                        {isEnglish ? 'Most Popular' : 'Beliebteste'}
                      </span>
                    </div>
                  )}
                  <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-2">
                    {String(i + 1).padStart(2, '0')} / Plan
                  </span>
                  <h3 className="font-editorial text-4xl font-semibold mb-4">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-editorial text-5xl font-bold text-aurora">CHF {plan.price}</span>
                  </div>
                  <span className="text-sm text-muted-foreground tracking-wider uppercase mb-4">{plan.period}</span>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 pb-6 border-b border-border/60">{plan.description}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                    className={`group inline-flex items-center justify-center gap-3 px-6 py-3 font-editorial text-sm font-semibold tracking-[0.2em] uppercase transition-all ${plan.highlight ? 'border-aurora bg-background/40 hover:bg-background/60' : 'border border-foreground/40 hover:border-foreground'}`}
                  >
                    {isEnglish ? 'Get Started' : 'Jetzt starten'}
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="border-b border-border/60 py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-[0.03]" />
        <div className="container-section relative">
          <div className="mb-12 max-w-3xl">
            <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              06 — {isEnglish ? 'Traction' : 'Traktion'}
            </span>
            <h2 className="mt-3 font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight">
              {content.caseStudies.title}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">{content.caseStudies.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 border border-border/60">
            {caseStudies.map((study, i) => (
              <ScrollReveal key={i}>
                <div className="bg-card/40 backdrop-blur-sm p-6 h-full group hover:bg-card/60 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <a href={`https://${study.name}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <h3 className="font-editorial text-lg font-semibold mb-1 group-hover:text-aurora transition-colors">{study.name}</h3>
                  <p className="text-xs text-muted-foreground tracking-wider mb-4">{study.improvements}</p>
                  <div className="space-y-2 pt-4 border-t border-border/60">
                    {study.metrics.map((m, j) => (
                      <div key={j} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground text-xs">{m.label}</span>
                        <span className="font-editorial font-semibold text-aurora">
                          {m.change || (m.before ? `${m.before} → ${m.after}` : m.after)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technical & Strategic */}
      <section className="border-b border-border/60 py-20 sm:py-28">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <ScrollReveal>
                <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase flex items-center gap-2 mb-3">
                  <Code className="w-4 h-4" /> 07 — Technical
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-[0.95] tracking-tight mb-8">
                  {content.technical.title}
                </h2>
                <div className="space-y-4">
                  {content.technical.items.map((item, i) => (
                    <div key={i} className="border border-border/60 bg-card/40 backdrop-blur-sm p-6 flex gap-5 hover:border-primary/60 transition-colors">
                      <div className="flex h-12 w-12 items-center justify-center border border-border/60 flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-editorial text-lg font-semibold mb-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <div>
              <ScrollReveal>
                <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4" /> 08 — Strategic
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-[0.95] tracking-tight mb-8">
                  {content.strategic.title}
                </h2>
                <div className="space-y-4">
                  {content.strategic.items.map((item, i) => (
                    <div key={i} className="border border-border/60 bg-card/40 backdrop-blur-sm p-6 flex gap-5 hover:border-primary/60 transition-colors">
                      <div className="flex h-12 w-12 items-center justify-center border border-border/60 flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-editorial text-lg font-semibold mb-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Investor & Partner CTA */}
      <section id="contact" className="border-b border-border/60 py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-[0.03]" />
        <div className="container-section relative">
          <div className="mb-12 max-w-3xl">
            <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              09 — {isEnglish ? 'Partnership' : 'Partnerschaft'}
            </span>
            <h2 className="mt-3 font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight">
              {content.cta.title}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">{content.cta.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="border-aurora bg-card/40 backdrop-blur-sm p-8 sm:p-10 h-full flex flex-col">
                <div className="flex h-14 w-14 items-center justify-center border border-border/60 mb-6">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-editorial text-3xl font-semibold mb-3">{content.cta.invest.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{content.cta.invest.description}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    isEnglish ? 'AI-first product company' : 'AI-first Produktunternehmen',
                    isEnglish ? 'Proven Swiss market traction' : 'Bewährte Schweizer Markt-Traktion',
                    isEnglish ? 'Scalable SaaS model' : 'Skalierbares SaaS-Modell',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:hello@itsfeierabend.ch?subject=Investor%20Call"
                  className="group inline-flex items-center justify-center gap-3 border-aurora bg-background/40 px-6 py-3 font-editorial text-sm font-semibold tracking-[0.2em] uppercase hover:bg-background/60 transition-all"
                >
                  {isEnglish ? 'Schedule Investor Call' : 'Investoren-Call buchen'}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="border border-border/60 bg-card/40 backdrop-blur-sm p-8 sm:p-10 h-full flex flex-col hover:border-primary/60 transition-colors">
                <div className="flex h-14 w-14 items-center justify-center border border-border/60 mb-6">
                  <Handshake className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-editorial text-3xl font-semibold mb-3">{content.cta.partner.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{content.cta.partner.description}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    isEnglish ? 'Co-selling partnerships' : 'Co-Selling-Partnerschaften',
                    isEnglish ? 'API integration' : 'API-Integration',
                    isEnglish ? 'White-label options' : 'White-Label-Optionen',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:hello@itsfeierabend.ch?subject=Partnership"
                  className="group inline-flex items-center justify-center gap-3 border border-foreground/40 px-6 py-3 font-editorial text-sm font-semibold tracking-[0.2em] uppercase hover:border-foreground transition-all"
                >
                  {isEnglish ? 'Become a Partner' : 'Partner werden'}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                </a>
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-16 text-center space-y-3">
            <p className="font-editorial italic text-2xl sm:text-3xl text-foreground/90">
              {isEnglish ? "Let's innovate local services together." : 'Lass uns gemeinsam lokale Dienstleistungen revolutionieren.'}
            </p>
            <div className="flex flex-wrap gap-6 justify-center text-xs font-editorial tracking-[0.2em] uppercase text-muted-foreground">
              <span className="flex items-center gap-2">
                <Globe className="w-3 h-3" /> itsfeierabend.ch
              </span>
              <a href="mailto:hello@itsfeierabend.ch" className="hover:text-foreground transition-colors">
                hello@itsfeierabend.ch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final Form */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-sunset)' }} />
        <div className="absolute inset-0 noise-overlay opacity-[0.05]" />
        <div className="container-section relative">
          <div className="grid grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            <div className="col-span-12 lg:col-span-6">
              <ScrollReveal>
                <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                  10 — {isEnglish ? 'Try it' : 'Test es'}
                </span>
                <h2 className="mt-4 font-editorial text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tight">
                  {isEnglish ? (
                    <>Test the <em className="italic text-aurora">Ultimate Package.</em></>
                  ) : (
                    <>Teste das <em className="italic text-aurora">Ultimate Package.</em></>
                  )}
                </h2>
                <p className="mt-6 max-w-md text-lg text-muted-foreground">
                  {isEnglish ? 'Start your free website analysis today.' : 'Starte jetzt deine kostenlose Website-Analyse.'}
                </p>
              </ScrollReveal>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <ScrollReveal>
                <div className="border border-border/60 bg-background/60 backdrop-blur-md p-6 sm:p-8">
                  <AnalysisRequestForm />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
