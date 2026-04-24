import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead, OrganizationSchema } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { ServicesSection } from '@/components/ServicesSection';
import { UltimatePackageSection } from '@/components/UltimatePackageSection';
import { AIChatbotDemo } from '@/components/AIChatbotDemo';
import { SocialProofSection } from '@/components/SocialProofSection';
import { PricingCard } from '@/components/PricingCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion/ScrollReveal';
import { siteConfig } from '@/config/site';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Play,
  Bot,
  Zap,
  Target,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import heroHumanAI from '@/assets/hero-human-ai-enhanced.jpg';
import aiCollaborationImg from '@/assets/ai-collaboration.jpg';
import servicesOverviewImg from '@/assets/services-overview.jpg';

// Process step images
import discoveryImg from '@/assets/process/discovery.jpg';
import aiStrategyImg from '@/assets/process/ai-strategy.jpg';
import implementationImg from '@/assets/process/implementation.jpg';
import optimizationImg from '@/assets/process/optimization.jpg';

export default function HomePage() {
  const { t, isEnglish } = useLanguage();
  const [audioState, setAudioState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [audioExists, setAudioExists] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Value pillars (no fabricated metrics — methodology-based)
  const pillars = isEnglish ? [
    { icon: Bot, label: 'AI-First', sub: 'Built into every layer' },
    { icon: Target, label: 'Measurable', sub: 'Evidence-based scoring' },
    { icon: Zap, label: 'Fast', sub: 'Weeks, not quarters' },
    { icon: Users, label: 'Human', sub: 'Machine meets craft' },
  ] : [
    { icon: Bot, label: 'KI-First', sub: 'In jeder Ebene verankert' },
    { icon: Target, label: 'Messbar', sub: 'Evidenzbasiertes Scoring' },
    { icon: Zap, label: 'Schnell', sub: 'Wochen, keine Quartale' },
    { icon: Users, label: 'Menschlich', sub: 'Maschine trifft Handwerk' },
  ];

  // Process steps with images
  const processSteps = isEnglish ? [
    { 
      image: discoveryImg, 
      title: 'Discovery & Analysis', 
      description: 'We dive deep into your business, analyzing your current digital presence, competitors, and market opportunities.',
      details: ['Complete website & SEO audit', 'Competitor analysis', 'Market opportunity mapping', 'Goal definition workshop'],
      href: '/en/free-audit'
    },
    { 
      image: aiStrategyImg, 
      title: 'AI Strategy', 
      description: 'We design custom AI-powered solutions tailored to your specific business needs and growth objectives.',
      details: ['Custom AI solution design', 'Technology stack selection', 'Integration planning', 'ROI projections'],
      href: '/en/services/ai-implementation'
    },
    { 
      image: implementationImg, 
      title: 'Rapid Implementation', 
      description: 'Our expert team deploys your digital marketing and AI systems with speed and precision.',
      details: ['Agile development sprints', 'Quality assurance testing', 'Staff training & onboarding', 'Go-live support'],
      href: '/en/services/design-development'
    },
    { 
      image: optimizationImg, 
      title: 'Continuous Optimization', 
      description: 'We continuously improve performance using data analytics and machine learning insights.',
      details: ['A/B testing campaigns', 'Performance monitoring', 'Monthly strategy reviews', 'Scaling recommendations'],
      href: '/en/services/seo'
    },
  ] : [
    { 
      image: discoveryImg, 
      title: 'Discovery & Analyse', 
      description: 'Wir tauchen tief in Ihr Geschäft ein und analysieren Ihre digitale Präsenz, Wettbewerber und Marktchancen.',
      details: ['Komplettes Website- & SEO-Audit', 'Wettbewerbsanalyse', 'Marktchancen-Mapping', 'Zieldefinitions-Workshop'],
      href: '/gratis-audit'
    },
    { 
      image: aiStrategyImg, 
      title: 'KI-Strategie', 
      description: 'Wir entwickeln maßgeschneiderte KI-gestützte Lösungen für Ihre spezifischen Geschäftsanforderungen.',
      details: ['Individuelle KI-Lösungsgestaltung', 'Technologie-Stack Auswahl', 'Integrationsplanung', 'ROI-Prognosen'],
      href: '/services/ki-implementierung'
    },
    { 
      image: implementationImg, 
      title: 'Schnelle Implementierung', 
      description: 'Unser Expertenteam setzt Ihre digitalen Marketing- und KI-Systeme schnell und präzise um.',
      details: ['Agile Entwicklungssprints', 'Qualitätssicherungstests', 'Mitarbeiterschulung', 'Go-Live Support'],
      href: '/services/design-entwicklung'
    },
    { 
      image: optimizationImg, 
      title: 'Kontinuierliche Optimierung', 
      description: 'Wir verbessern kontinuierlich die Leistung durch Datenanalyse und Machine-Learning-Erkenntnisse.',
      details: ['A/B-Testing Kampagnen', 'Performance-Monitoring', 'Monatliche Strategie-Reviews', 'Skalierungsempfehlungen'],
      href: '/services/seo'
    },
  ];

  // Why choose us
  const whyUs = isEnglish ? [
    { icon: Bot, title: 'AI-First Expertise', description: 'AI isn\'t an afterthought — it\'s our foundation.' },
    { icon: Award, title: 'Proven Results', description: 'Data-driven strategies that deliver measurable ROI.' },
    { icon: Users, title: 'Dedicated Team', description: 'Your success is powered by specialists, not generalists.' },
    { icon: Zap, title: 'Fast Execution', description: 'From strategy to launch in weeks, not months.' },
  ] : [
    { icon: Bot, title: 'KI-First Expertise', description: 'KI ist kein Nachgedanke — sie ist unser Fundament.' },
    { icon: Award, title: 'Bewiesene Ergebnisse', description: 'Datengetriebene Strategien mit messbarem ROI.' },
    { icon: Users, title: 'Dediziertes Team', description: 'Ihr Erfolg wird von Spezialisten angetrieben.' },
    { icon: Zap, title: 'Schnelle Umsetzung', description: 'Von Strategie bis Launch in Wochen, nicht Monaten.' },
  ];

  // FAQ items
  const faqItems = [
    ...t.faq.items,
    ...(isEnglish ? [
      { question: 'How is AI integrated into your services?', answer: 'AI powers everything we do — from automated campaign optimization to intelligent chatbots and predictive analytics.' },
      { question: 'Do I need technical knowledge?', answer: 'Absolutely not. We handle all the technical complexity. You focus on your business.' },
    ] : [
      { question: 'Wie wird KI in Ihre Dienste integriert?', answer: 'KI treibt alles an — von automatisierter Kampagnenoptimierung bis hin zu intelligenten Chatbots und Predictive Analytics.' },
      { question: 'Brauche ich technisches Wissen?', answer: 'Absolut nicht. Wir kümmern uns um die gesamte technische Komplexität. Sie konzentrieren sich auf Ihr Geschäft.' },
    ]),
  ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'AI-Powered Digital Marketing Agency' : 'KI-gestützte Digital Marketing Agentur'}
        description={isEnglish 
          ? 'We help businesses grow with AI-powered digital marketing. SEO, SEA, brand management, design, and more — all enhanced by artificial intelligence.'
          : 'Wir helfen Unternehmen mit KI-gestütztem digitalem Marketing zu wachsen. SEO, SEA, Markenmanagement, Design und mehr — alles verstärkt durch künstliche Intelligenz.'}
      />
      <OrganizationSchema description={t.siteDescription} />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 gradient-mesh" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        {/* Hero background image - enhanced visibility */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroHumanAI} 
            alt={isEnglish ? "Human-AI connection" : "Mensch-KI-Verbindung"} 
            className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
          />
          {/* Gradient overlays - lighter for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-ai/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <SectionContainer padding="large" background="none" className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 animate-fade-in">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {isEnglish ? 'AI-Powered Growth Partner' : 'KI-gestützter Wachstumspartner'}
                </span>
              </div>
              
              {/* Main headline */}
              <h1 className="mb-6 animate-fade-in font-display" style={{ animationDelay: '100ms' }}>
                {isEnglish ? (
                  <>
                    <span className="block text-foreground">Digital Marketing</span>
                    <span className="block text-gradient-ai">Supercharged by AI</span>
                  </>
                ) : (
                  <>
                    <span className="block text-foreground">Digital Marketing</span>
                    <span className="block text-gradient-ai">verstärkt durch KI</span>
                  </>
                )}
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-fade-in leading-relaxed" style={{ animationDelay: '200ms' }}>
                {isEnglish 
                  ? 'We combine SEO, SEA, social media, and brand management with cutting-edge AI to deliver results that matter.'
                  : 'Wir kombinieren SEO, SEA, Social Media und Markenmanagement mit modernster KI für Ergebnisse, die zählen.'}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in mb-10" style={{ animationDelay: '300ms' }}>
                <CTAButton
                  variant="primary"
                  size="lg"
                  href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                  location="hero"
                  className="text-lg px-8 py-4 glow-primary hover:-translate-y-0.5 transition-all"
                >
                  {isEnglish ? 'Get Free AI Audit' : 'Gratis KI-Audit'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </CTAButton>
                <CTAButton
                  variant="secondary"
                  size="lg"
                  href={isEnglish ? '/en/demo' : '/demo'}
                  location="hero"
                  className="text-lg px-8 py-4 bg-secondary/50 backdrop-blur-sm hover:-translate-y-0.5 transition-all"
                >
                  <Play className="mr-2 w-5 h-5" />
                  {isEnglish ? 'See AI in Action' : 'KI in Aktion sehen'}
                </CTAButton>
              </div>
              
              {/* Trust signals */}
              <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '400ms' }}>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {isEnglish ? 'No commitment' : 'Keine Verpflichtung'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {isEnglish ? 'Results in 48h' : 'Ergebnisse in 48h'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {isEnglish ? 'AI-powered insights' : 'KI-gestützte Insights'}
                </span>
              </div>
            </div>
            
            {/* Right side - Stats */}
            <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-2xl bg-card/50 backdrop-blur-md border border-border/50 hover:border-primary/30 transition-all duration-300 group"
                    style={{ animationDelay: `${500 + index * 100}ms` }}
                  >
                    <div className="text-4xl font-bold font-display text-gradient mb-2 group-hover:scale-105 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 lg:hidden animate-fade-in" style={{ animationDelay: '500ms' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="text-2xl font-bold font-display text-gradient mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Ultimate Package - Our Core USP */}
      <UltimatePackageSection />

      {/* Social Proof - Logos & Testimonials */}
      <SocialProofSection />

      {/* How We Work Section */}
      <SectionContainer id="process" background="muted" className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="relative">
          <ScrollReveal>
            <SectionHeader 
              title={isEnglish ? 'How We Work' : 'Wie wir arbeiten'}
              subtitle={isEnglish 
                ? 'A proven 4-step process that delivers results faster with AI acceleration.'
                : 'Ein bewährter 4-Schritte-Prozess, der mit KI-Beschleunigung schneller Ergebnisse liefert.'}
            />
          </ScrollReveal>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8" staggerDelay={0.15}>
            {processSteps.map((step, index) => (
              <StaggerItem key={index}>
                <Link 
                  to={step.href}
                  className="group block rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                    
                    {/* Step number badge */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold font-display text-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-display mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Details list */}
                    <ul className="space-y-2 mb-4">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Learn more link */}
                    <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span>{isEnglish ? 'Learn More' : 'Mehr erfahren'}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </SectionContainer>

      {/* Why Choose Us */}
      <SectionContainer background="muted" className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        
        <div className="relative">
          <ScrollReveal>
            <SectionHeader 
              title={isEnglish ? 'Why Choose Us' : 'Warum uns wählen'}
              subtitle={isEnglish 
                ? 'We\'re not just another agency. We\'re your AI-powered growth partner.'
                : 'Wir sind nicht nur eine weitere Agentur. Wir sind Ihr KI-gestützter Wachstumspartner.'}
            />
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {whyUs.map((item, index) => (
              <StaggerItem key={index}>
                <div 
                  className="p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold font-display mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </SectionContainer>

      {/* AI Chatbot Demo Section */}
      <SectionContainer className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <div className="relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-ai/10 border border-ai/30">
                <Bot className="w-4 h-4 text-ai" />
                <span className="text-sm font-medium text-ai">
                  {isEnglish ? 'Live AI Demo' : 'Live KI-Demo'}
                </span>
              </div>
              
              <h2 className="mb-4 font-display">
                {isEnglish ? 'See Our AI in Action' : 'Sehen Sie unsere KI in Aktion'}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {isEnglish 
                  ? 'Watch how our AI assistant handles customer inquiries, qualifies leads, and provides instant support — all with natural, human-like conversation.'
                  : 'Sehen Sie, wie unser KI-Assistent Kundenanfragen bearbeitet, Leads qualifiziert und sofortigen Support bietet — alles mit natürlicher, menschlicher Konversation.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <CTAButton
                  variant="primary"
                  size="lg"
                  href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                  location="chatbot-demo"
                  className="glow-ai"
                >
                  {isEnglish ? 'Get AI for Your Business' : 'KI für Ihr Geschäft'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </CTAButton>
              </div>
            </div>
            
            {/* Right - Chatbot Demo */}
            <div>
              <AIChatbotDemo />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Pricing Section */}
      <SectionContainer id="pricing" background="muted">
        <SectionHeader 
          title={t.pricing.sectionTitle}
          subtitle={isEnglish 
            ? 'Flexible packages designed for businesses of all sizes.'
            : 'Flexible Pakete für Unternehmen jeder Grösse.'}
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
            duration={isEnglish ? '90 days (then monthly)' : '90 Tage (danach monatlich)'}
            forWhom={t.pricing.growth.forWhom}
            price={t.pricing.growth.price}
            features={t.pricing.growth.features}
            highlighted
            highlightLabel={isEnglish ? 'Most Popular' : 'Am beliebtesten'}
          />
          <PricingCard
            name={t.pricing.leader.name}
            duration={t.pricing.leader.duration}
            forWhom={t.pricing.leader.forWhom}
            price={t.pricing.leader.price}
            priceNote={isEnglish ? '(+ performance bonus)' : '(+ Performance-Bonus)'}
            features={t.pricing.leader.features}
          />
        </div>
        
        <div className="max-w-2xl mx-auto text-center text-sm text-muted-foreground">
          <p>{t.pricing.templateNote}</p>
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
      <SectionContainer className="gradient-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 border border-white/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isEnglish ? 'Start Your AI Journey' : 'Starten Sie Ihre KI-Reise'}
            </span>
          </div>
          
          <h2 className="text-primary-foreground mb-4 font-display">
            {isEnglish ? 'Ready to Transform Your Business?' : 'Bereit, Ihr Geschäft zu transformieren?'}
          </h2>
          <p className="text-primary-foreground/80 text-xl mb-10">
            {isEnglish
              ? 'Get a free AI-powered audit and discover your growth potential.'
              : 'Erhalten Sie ein kostenloses KI-gestütztes Audit und entdecken Sie Ihr Wachstumspotenzial.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              variant="secondary"
              size="lg"
              href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
              location="footer-cta"
              className="bg-white text-primary hover:bg-white/90 shadow-xl"
            >
              {t.cta.getAudit}
              <ArrowRight className="ml-2 w-5 h-5" />
            </CTAButton>
            <CTAButton
              variant="ghost"
              size="lg"
              href={isEnglish ? '/en/free-call' : '/gratis-call'}
              location="footer-cta"
              className="text-primary-foreground border-white/30 hover:bg-white/10"
            >
              {t.cta.bookCall}
            </CTAButton>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}