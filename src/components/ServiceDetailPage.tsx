import { ReactNode } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { 
  ArrowRight, 
  Check, 
  Sparkles,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceFeature {
  title: string;
  description: string;
}

interface CaseStudy {
  industry: string;
  result: string;
  metric: string;
}

interface ServicePageProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  features: ServiceFeature[];
  benefits: string[];
  caseStudies: CaseStudy[];
  isAI?: boolean;
  relatedServices?: { title: string; path: string }[];
  heroImage?: string;
}

export function ServiceDetailPage({
  icon: Icon,
  title,
  subtitle,
  description,
  features,
  benefits,
  caseStudies,
  isAI,
  relatedServices = [],
  heroImage
}: ServicePageProps) {
  const { t, isEnglish } = useLanguage();

  return (
    <Layout>
      <SEOHead title={title} description={subtitle} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        {/* Hero background image */}
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <img 
              src={heroImage} 
              alt={title}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
          </div>
        )}
        
        {/* Decorative orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        {isAI && (
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-ai/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        )}
        
        <SectionContainer background="none" className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            {isAI && (
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-ai/10 border border-ai/30 animate-fade-in">
                <Sparkles className="w-4 h-4 text-ai" />
                <span className="text-sm font-medium text-ai">
                  {isEnglish ? 'AI-Powered Service' : 'KI-gestützter Service'}
                </span>
              </div>
            )}
            
            {/* Icon */}
            <div className={cn(
              "inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 animate-fade-in",
              isAI 
                ? "bg-gradient-to-br from-primary/20 to-ai/20 text-ai" 
                : "bg-primary/10 text-primary"
            )}>
              <Icon className="w-10 h-10" />
            </div>
            
            {/* Title */}
            <h1 className="mb-6 font-display animate-fade-in" style={{ animationDelay: '100ms' }}>
              {isAI ? (
                <span className="text-gradient-ai">{title}</span>
              ) : (
                title
              )}
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in leading-relaxed" style={{ animationDelay: '200ms' }}>
              {subtitle}
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '300ms' }}>
              <CTAButton
                variant="primary"
                size="lg"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location={`service-${title.toLowerCase()}-hero`}
                className={isAI ? "glow-ai" : "glow-primary"}
              >
                {isEnglish ? 'Get Free Consultation' : 'Gratis Beratung'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <CTAButton
                variant="secondary"
                size="lg"
                href={isEnglish ? '/en/free-call' : '/gratis-call'}
                location={`service-${title.toLowerCase()}-hero`}
                className="bg-secondary/50 backdrop-blur-sm"
              >
                {t.cta.bookCall}
              </CTAButton>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Description Section */}
      <SectionContainer background="muted">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
            {description}
          </p>
        </div>
      </SectionContainer>

      {/* Features Grid */}
      <SectionContainer>
        <SectionHeader
          title={isEnglish ? 'What We Deliver' : 'Was wir liefern'}
          subtitle={isEnglish 
            ? 'Comprehensive solutions tailored to your business needs.'
            : 'Umfassende Lösungen, massgeschneidert für Ihre Geschäftsanforderungen.'}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="service-card animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-lg font-bold font-display mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Benefits Section */}
      <SectionContainer background="muted" className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        
        <div className="relative">
          <SectionHeader
            title={isEnglish ? 'Why Choose This Service' : 'Warum diesen Service wählen'}
          />
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    isAI ? "bg-ai/20 text-ai" : "bg-primary/20 text-primary"
                  )}>
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Case Studies */}
      <SectionContainer>
        <SectionHeader
          title={isEnglish ? 'Results That Speak' : 'Ergebnisse, die sprechen'}
          subtitle={isEnglish 
            ? 'Real outcomes from real clients.'
            : 'Echte Ergebnisse von echten Kunden.'}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl font-bold font-display text-gradient mb-2">
                {study.metric}
              </div>
              <p className="text-foreground font-medium mb-1">{study.result}</p>
              <p className="text-sm text-muted-foreground">{study.industry}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <CTAButton
            variant="secondary"
            href={isEnglish ? '/en/free-call' : '/gratis-call'}
            location={`service-${title.toLowerCase()}-cases`}
          >
            {isEnglish ? 'Discuss Your Goals' : 'Besprechen Sie Ihre Ziele'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </CTAButton>
        </div>
      </SectionContainer>

      {/* Process Preview */}
      <SectionContainer background="muted">
        <SectionHeader
          title={isEnglish ? 'How It Works' : 'So funktioniert es'}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: Target, title: isEnglish ? 'Discovery Call' : 'Discovery Call', desc: isEnglish ? 'We understand your goals and challenges.' : 'Wir verstehen Ihre Ziele und Herausforderungen.' },
            { icon: Clock, title: isEnglish ? 'Strategy & Setup' : 'Strategie & Setup', desc: isEnglish ? 'Custom plan and rapid implementation.' : 'Individueller Plan und schnelle Umsetzung.' },
            { icon: TrendingUp, title: isEnglish ? 'Launch & Optimize' : 'Launch & Optimieren', desc: isEnglish ? 'Go live and continuously improve.' : 'Live gehen und kontinuierlich verbessern.' },
          ].map((step, index) => (
            <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                <step.icon className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold font-display mb-2">{step.title}</h4>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <SectionContainer>
          <SectionHeader
            title={isEnglish ? 'Related Services' : 'Verwandte Services'}
          />
          <div className="flex flex-wrap justify-center gap-4">
            {relatedServices.map((service, index) => (
              <CTAButton
                key={index}
                variant="secondary"
                href={service.path}
                location="related-services"
                className="bg-secondary/50"
              >
                {service.title}
              </CTAButton>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* Final CTA */}
      <SectionContainer className="gradient-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-primary-foreground mb-4 font-display">
            {isEnglish ? `Ready to Get Started with ${title}?` : `Bereit für ${title}?`}
          </h2>
          <p className="text-primary-foreground/80 text-xl mb-10">
            {isEnglish
              ? 'Get a free consultation and discover how we can help you grow.'
              : 'Erhalten Sie eine kostenlose Beratung und entdecken Sie, wie wir Ihnen helfen können.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              variant="secondary"
              size="lg"
              href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
              location={`service-${title.toLowerCase()}-footer`}
              className="bg-white text-primary hover:bg-white/90 shadow-xl"
            >
              {t.cta.getAudit}
              <ArrowRight className="ml-2 w-5 h-5" />
            </CTAButton>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}