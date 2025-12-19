import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead, OrganizationSchema } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { PillarCard, AutomationCard } from '@/components/PillarCard';
import { PricingCard } from '@/components/PricingCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { siteConfig } from '@/config/site';
import { 
  Zap, 
  Target, 
  Bot, 
  ArrowRight,
  Play,
  Phone,
  AlertTriangle,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import heroImage1 from '@/assets/hero-image.jpg';
import heroImage2 from '@/assets/hero-image-2.jpg';

const heroImages = [heroImage1, heroImage2];

export default function HomePage() {
  const { t, isEnglish } = useLanguage();
  const [audioState, setAudioState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [audioExists, setAudioExists] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if audio file exists
  useEffect(() => {
    const audio = new Audio('/audio/lead-concierge-demo.mp3');
    audio.addEventListener('error', () => setAudioExists(false));
    audio.addEventListener('canplaythrough', () => setAudioExists(true));
    audioRef.current = audio;
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handlePlayDemo = () => {
    if (!audioRef.current || !audioExists) return;
    
    if (audioState === 'playing') {
      audioRef.current.pause();
      setAudioState('paused');
    } else {
      audioRef.current.play();
      setAudioState('playing');
    }
  };

  // Problem cards data
  const problemCards = isEnglish ? [
    { icon: Phone, title: 'Missed calls', description: 'When no one answers, your competitor wins.' },
    { icon: Clock, title: 'Admin chaos', description: 'Leads come in, but follow-ups happen too late.' },
    { icon: DollarSign, title: 'Expensive ads', description: 'Without funnel and tracking, you pay for noise, not jobs.' },
  ] : [
    { icon: Phone, title: 'Verlorene Anrufe', description: 'Wenn niemand abnimmt, gewinnt die Konkurrenz.' },
    { icon: Clock, title: 'Admin-Chaos', description: 'Leads kommen rein, aber Follow-ups passieren zu spät.' },
    { icon: DollarSign, title: 'Teure Werbung', description: 'Ohne Funnel und Tracking zahlst du für Lärm statt Jobs.' },
  ];

  // Objection handling data
  const objections = isEnglish ? [
    { q: 'Ads are too expensive.', a: 'That\'s why we optimize for lead quality and measure properly.' },
    { q: 'I have no time for follow-ups.', a: 'Exactly: automations + clear pipeline.' },
    { q: 'AI is complicated.', a: 'We set it up. You don\'t need a new tool collection.' },
    { q: 'We don\'t need more leads.', a: 'Then we filter for better jobs, not more.' },
    { q: 'Long-term contracts are suspicious.', a: 'Start with a sprint or 90 days. Flexible after.' },
  ] : [
    { q: 'Ads sind zu teuer.', a: 'Darum optimieren wir auf Lead-Qualität und messen sauber.' },
    { q: 'Ich habe keine Zeit für Follow-ups.', a: 'Genau darum: Automationen + klare Pipeline.' },
    { q: 'KI ist kompliziert.', a: 'Wir richten es ein. Du brauchst keine neue Tool-Sammlung.' },
    { q: 'Wir brauchen keine Leads.', a: 'Dann filtern wir auf bessere Aufträge statt mehr.' },
    { q: 'Langzeitverträge sind suspekt.', a: 'Start mit Sprint oder 90 Tagen. Danach flexibel.' },
  ];

  // Compliance/transparency bullets
  const complianceBullets = isEnglish ? [
    'Analytics only after consent (cookie banner).',
    'Transparent disclosure for voice assistance.',
  ] : [
    'Analytics erst nach Zustimmung (Cookie Banner).',
    'Transparente Hinweise bei Voice-Assistenz.',
  ];

  // FAQ items with new additions
  const faqItems = [
    ...t.faq.items,
    ...(isEnglish ? [
      { question: 'Is the demo recorded?', answer: 'The demo is an example. With real voice assistance, there are transparent disclosures.' },
      { question: 'How does consent/tracking work?', answer: 'Analytics only after consent.' },
    ] : [
      { question: 'Wird die Demo aufgezeichnet?', answer: 'Die Demo ist ein Beispiel. Bei echter Voice-Assistenz gibt es transparente Hinweise.' },
      { question: 'Wie läuft Consent/Tracking?', answer: 'Analytics nur nach Zustimmung.' },
    ]),
  ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'AI Growth System for Local Services' : 'AI Growth System für Local Services'}
        description={t.siteDescription}
      />
      <OrganizationSchema description={t.siteDescription} />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[95vh] flex items-center">
        {/* Hero background images with crossfade */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt={isEnglish ? "Happy business owner enjoying free time" : "Zufriedener Unternehmer geniesst seine Freizeit"} 
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {/* Subtle gradient overlay for text readability - only on left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent lg:via-transparent" />
        </div>
        
        <SectionContainer padding="large" background="none" className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="max-w-2xl">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 mb-8 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 shadow-lg animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">
                  {isEnglish 
                    ? 'Swiss precision + AI efficiency'
                    : 'Schweizer Präzision + KI-Effizienz'}
                </span>
              </div>
              
              {/* Main headline */}
              <h1 className="mb-6 animate-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1] tracking-tight" style={{ animationDelay: '100ms' }}>
                {isEnglish ? (
                  <>
                    <span className="block text-foreground">More <span className="text-primary">jobs</span>,</span>
                    <span className="block text-foreground">less admin.</span>
                  </>
                ) : (
                  <>
                    <span className="block text-foreground">Mehr <span className="text-primary">Aufträge</span>,</span>
                    <span className="block text-foreground">weniger Büro.</span>
                  </>
                )}
              </h1>
              
              {/* Tagline */}
              <p className="text-2xl sm:text-3xl md:text-4xl text-primary font-bold mb-4 animate-fade-in" style={{ animationDelay: '150ms' }}>
                {isEnglish 
                  ? 'AI gives you time back.'
                  : 'Feierabend dank AI.'}
              </p>
              
              {/* Subheadline */}
              <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in leading-relaxed" style={{ animationDelay: '200ms' }}>
                {isEnglish 
                  ? 'We combine high-intent traffic, converting funnels and smart automations. Clicks become booked jobs — automatically.'
                  : 'Wir kombinieren High-Intent Traffic, konvertierende Funnels und smarte Automationen. Klicks werden zu gebuchten Jobs – automatisch.'}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in mb-8" style={{ animationDelay: '300ms' }}>
                <CTAButton
                  variant="primary"
                  size="lg"
                  href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                  location="hero"
                  className="text-lg px-10 py-5 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                >
                  {isEnglish ? 'Start free audit' : 'Gratis Audit starten'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </CTAButton>
                <CTAButton
                  variant="secondary"
                  size="lg"
                  href={isEnglish ? '/en/demo' : '/demo'}
                  location="hero"
                  className="text-lg px-10 py-5 backdrop-blur-sm hover:-translate-y-0.5 transition-all"
                >
                  <Play className="mr-2 w-5 h-5" />
                  {isEnglish ? 'Listen to demo' : 'Demo anhören'}
                </CTAButton>
              </div>
              
              {/* Micro-copy */}
              <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '400ms' }}>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {isEnglish ? 'No credit card' : 'Keine Kreditkarte'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {isEnglish ? '2 min setup' : '2 Min. Setup'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {isEnglish ? 'Personalized insights' : 'Personalisierte Insights'}
                </span>
              </div>
            </div>
            
            {/* Right side - Stats floating cards */}
            <div className="hidden lg:flex flex-col gap-4 items-end animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="p-6 rounded-2xl bg-card/90 backdrop-blur-md border border-border shadow-2xl transform hover:scale-105 transition-transform">
                <div className="text-5xl font-black text-primary mb-1">50%</div>
                <div className="text-base text-muted-foreground font-medium">
                  {isEnglish ? 'Less admin time' : 'Weniger Bürozeit'}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-card/90 backdrop-blur-md border border-border shadow-2xl transform hover:scale-105 transition-transform mr-12">
                <div className="text-5xl font-black text-primary mb-1">24/7</div>
                <div className="text-base text-muted-foreground font-medium">
                  {isEnglish ? 'Lead capture' : 'Lead-Erfassung'}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-card/90 backdrop-blur-md border border-border shadow-2xl transform hover:scale-105 transition-transform">
                <div className="text-5xl font-black text-primary mb-1">&lt;1s</div>
                <div className="text-base text-muted-foreground font-medium">
                  {isEnglish ? 'AI response' : 'KI-Antwort'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile stats row */}
          <div className="grid grid-cols-3 gap-4 mt-12 lg:hidden animate-fade-in" style={{ animationDelay: '500ms' }}>
            <div className="text-center p-4 rounded-xl bg-card/90 backdrop-blur-sm border border-border shadow-lg">
              <div className="text-3xl font-black text-primary mb-1">50%</div>
              <div className="text-xs text-muted-foreground font-medium">
                {isEnglish ? 'Less admin' : 'Weniger Büro'}
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/90 backdrop-blur-sm border border-border shadow-lg">
              <div className="text-3xl font-black text-primary mb-1">24/7</div>
              <div className="text-xs text-muted-foreground font-medium">
                {isEnglish ? 'Lead capture' : 'Lead-Erfassung'}
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/90 backdrop-blur-sm border border-border shadow-lg">
              <div className="text-3xl font-black text-primary mb-1">&lt;1s</div>
              <div className="text-xs text-muted-foreground font-medium">
                {isEnglish ? 'AI response' : 'KI-Antwort'}
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Problem Agitation Grid */}
      <SectionContainer background="muted">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problemCards.map((card, i) => (
            <div 
              key={i} 
              className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <card.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-muted-foreground">{card.description}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* 3 Pillars Section */}
      <SectionContainer id="system">
        <SectionHeader title={t.pillars.sectionTitle} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <PillarCard
            icon={Zap}
            title={t.pillars.traffic.title}
            description={isEnglish 
              ? 'Google Ads + Local SEO (high-intent, no vanity metrics).'
              : 'Google Ads + Local SEO (High-Intent, keine Vanity-Metrics).'}
          />
          <PillarCard
            icon={Target}
            title={t.pillars.conversion.title}
            description={isEnglish 
              ? 'Landing pages, multi-step forms, tracking, call routing, offer & copy.'
              : 'Landingpages, Multi-Step Forms, Tracking, Call-Routing, Offer & Copy.'}
          />
          <PillarCard
            icon={Bot}
            title={t.pillars.aiOps.title}
            description={isEnglish 
              ? 'Lead routing, follow-ups, reviews, reporting. Less chaos.'
              : 'Lead-Routing, Follow-ups, Reviews, Reporting. Weniger Chaos.'}
          />
        </div>
        <div className="text-center">
          <CTAButton
            variant="primary"
            href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
            location="pillars"
          >
            {t.cta.freeAudit}
          </CTAButton>
        </div>
      </SectionContainer>

      {/* Audio Demo Section */}
      {siteConfig.audioDemoEnabled && (
        <SectionContainer background="accent">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">
              {isEnglish ? 'Listen: AI Lead Concierge Demo' : 'Demo anhören: AI Lead Concierge'}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {isEnglish 
                ? 'Example call. The agent clearly identifies as AI and mentions call recording.'
                : 'Beispiel-Gespräch. Der Agent stellt sich transparent als digitaler Assistent vor und erwähnt die Aufzeichnung.'}
            </p>
            
            {siteConfig.voiceSpeedClaimsEnabled && (
              <p className="text-sm text-muted-foreground mb-6">
                {isEnglish ? 'Responds in <1 second.' : 'Reagiert in <1 Sekunde.'}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                variant="primary"
                size="lg"
                onClick={audioExists ? handlePlayDemo : undefined}
                location="audio-demo"
                disabled={!audioExists}
              >
                <Play className="mr-2 w-5 h-5" />
                {!audioExists 
                  ? (isEnglish ? 'Demo is being prepared' : 'Demo wird vorbereitet')
                  : audioState === 'playing' 
                    ? (isEnglish ? 'Pause' : 'Pause') 
                    : (isEnglish ? 'Play demo' : 'Demo abspielen')}
              </CTAButton>
              <CTAButton
                variant="secondary"
                size="lg"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location="audio-demo"
              >
                {t.cta.freeAudit}
              </CTAButton>
            </div>
          </div>
        </SectionContainer>
      )}

      {/* Proof Bar - Compliance Only */}
      <SectionContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteConfig.trustAwardsEnabled && (
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-4">Awards</h4>
              <p className="text-muted-foreground text-sm">[Awards placeholder]</p>
            </div>
          )}
          {siteConfig.trustBrandsEnabled && (
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-4">Brands</h4>
              <p className="text-muted-foreground text-sm">[Brands placeholder]</p>
            </div>
          )}
          <div className={`text-center ${!siteConfig.trustAwardsEnabled && !siteConfig.trustBrandsEnabled ? 'md:col-span-3' : ''}`}>
            <div className="inline-flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">
                {isEnglish ? 'Compliance & Transparency' : 'Compliance & Transparenz'}
              </h4>
            </div>
            <ul className="space-y-2">
              {complianceBullets.map((bullet, i) => (
                <li key={i} className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionContainer>

      {/* Pricing Section */}
      <SectionContainer id="pricing" background="muted">
        <SectionHeader 
          title={t.pricing.sectionTitle}
          subtitle={t.pricing.disclaimer}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
          <PricingCard
            name={t.pricing.launch.name}
            duration={t.pricing.launch.duration}
            forWhom={t.pricing.launch.forWhom}
            price={t.pricing.launch.price}
            features={t.pricing.launch.features}
            isMonthly={false}
          />
          <PricingCard
            name={t.pricing.growth.name}
            duration={isEnglish ? '90 days (then monthly cancellable)' : '90 Tage (danach monatlich kündbar)'}
            forWhom={t.pricing.growth.forWhom}
            price={t.pricing.growth.price}
            features={t.pricing.growth.features}
            highlighted
            highlightLabel={isEnglish ? 'Recommended' : 'Empfohlen'}
          />
          <PricingCard
            name={t.pricing.leader.name}
            duration={t.pricing.leader.duration}
            forWhom={t.pricing.leader.forWhom}
            price={t.pricing.leader.price}
            priceNote={isEnglish ? '(Ad budget extra)' : '(Ad-Budget extra)'}
            features={t.pricing.leader.features}
          />
        </div>
        
        {/* Anti-Knebel + Template note */}
        <div className="max-w-2xl mx-auto space-y-3 text-center text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            {isEnglish 
              ? 'Domains, ad accounts and data stay with the client.'
              : 'Domains, Ads-Konten und Daten bleiben im Besitz des Kunden.'}
          </p>
          <p>{t.pricing.templateNote}</p>
        </div>
      </SectionContainer>

      {/* Objection Handling */}
      <SectionContainer>
        <SectionHeader 
          title={isEnglish ? 'Common objections (answered)' : 'Häufige Einwände (kurz beantwortet)'}
        />
        <div className="max-w-3xl mx-auto grid grid-cols-1 gap-4">
          {objections.map((obj, i) => (
            <div key={i} className="p-4 rounded-lg border border-border bg-card">
              <p className="font-medium text-foreground mb-1">"{obj.q}"</p>
              <p className="text-muted-foreground">→ {obj.a}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Case Studies Section */}
      <SectionContainer background="muted">
        <SectionHeader title={t.caseStudies.sectionTitle} />
        <div className="max-w-xl mx-auto text-center py-12 px-8 rounded-xl border border-border bg-card">
          <p className="text-muted-foreground">{t.caseStudies.noData}</p>
          <CTAButton
            variant="primary"
            href={isEnglish ? '/en/free-call' : '/gratis-call'}
            location="case-studies"
            className="mt-6"
          >
            {t.cta.bookCall}
          </CTAButton>
        </div>
      </SectionContainer>

      {/* FAQ Section */}
      <SectionContainer id="faq">
        <SectionHeader title={t.faq.sectionTitle} />
        <div className="max-w-3xl mx-auto">
          <FAQAccordion items={faqItems} />
        </div>
      </SectionContainer>

      {/* Final CTA */}
      <SectionContainer className="gradient-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-primary-foreground mb-4">
            {isEnglish ? 'Ready to grow?' : 'Bereit zu wachsen?'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            {isEnglish
              ? 'Get your free audit and discover your growth potential.'
              : 'Hol dir dein Gratis Audit und entdecke dein Wachstumspotential.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              variant="secondary"
              size="lg"
              href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
              location="footer-cta"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              {t.cta.getAudit}
            </CTAButton>
            <CTAButton
              variant="ghost"
              size="lg"
              href={isEnglish ? '/en/free-call' : '/gratis-call'}
              location="footer-cta"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              {t.cta.bookCall}
            </CTAButton>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
