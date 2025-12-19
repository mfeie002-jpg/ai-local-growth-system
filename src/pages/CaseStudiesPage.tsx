import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { CTAButton } from '@/components/CTAButton';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion/ScrollReveal';
import { 
  ArrowRight,
  TrendingUp,
  Users,
  Clock,
  Target,
  BarChart3,
  Zap,
  Award
} from 'lucide-react';
import aiCollaborationImg from '@/assets/ai-collaboration.jpg';
import servicesOverviewImg from '@/assets/services-overview.jpg';

interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  results: { metric: string; label: string; icon: React.ElementType }[];
  testimonial?: { quote: string; author: string; role: string };
  image: string;
  services: string[];
}

export default function CaseStudiesPage() {
  const { isEnglish } = useLanguage();

  const caseStudies: CaseStudy[] = isEnglish ? [
    {
      id: 'techcorp-ai',
      title: 'TechCorp: AI-Powered Customer Service Revolution',
      industry: 'Technology / SaaS',
      challenge: 'TechCorp was struggling with high customer service costs and slow response times. Their support team was overwhelmed with repetitive inquiries, leading to customer frustration and churn.',
      solution: 'We implemented an AI chatbot solution that handles 80% of common inquiries automatically, integrated with their CRM for personalized responses, and deployed a lead qualification system that prioritizes high-value prospects.',
      results: [
        { metric: '85%', label: 'Faster response time', icon: Clock },
        { metric: '60%', label: 'Cost reduction in support', icon: TrendingUp },
        { metric: '45%', label: 'Increase in customer satisfaction', icon: Users },
      ],
      testimonial: {
        quote: "Their AI implementation transformed our customer service. We're now able to handle 3x the volume with the same team.",
        author: "Sarah M.",
        role: "CEO, TechCorp"
      },
      image: aiCollaborationImg,
      services: ['AI Implementation', 'Process Automation']
    },
    {
      id: 'swissfinance-seo',
      title: 'SwissFinance: From Page 3 to #1 on Google',
      industry: 'Financial Services',
      challenge: 'SwissFinance had a beautiful website but virtually no organic traffic. They were spending heavily on paid ads with diminishing returns and needed a sustainable growth strategy.',
      solution: 'We executed a comprehensive SEO overhaul including technical fixes, content strategy targeting high-intent keywords, and a strategic link-building campaign. We also optimized their Google Business profiles for local search.',
      results: [
        { metric: '#1', label: 'Google ranking for 15 keywords', icon: Target },
        { metric: '340%', label: 'Increase in organic traffic', icon: BarChart3 },
        { metric: '60%', label: 'Reduction in cost per lead', icon: TrendingUp },
      ],
      testimonial: {
        quote: "We went from page 3 to #1 on Google in just 4 months. The ROI on their SEO work has been incredible.",
        author: "Thomas K.",
        role: "Marketing Director, SwissFinance"
      },
      image: servicesOverviewImg,
      services: ['SEO', 'Content Strategy', 'Local SEO']
    },
    {
      id: 'medicare-ppc',
      title: 'MediCare Plus: 5x ROAS with Smart PPC',
      industry: 'Healthcare',
      challenge: 'MediCare Plus was burning through ad budget with poor targeting and generic messaging. Their cost per acquisition was unsustainably high, threatening their growth plans.',
      solution: 'We restructured their entire Google Ads account, implemented AI-powered bidding strategies, created highly targeted ad copy for different patient segments, and built conversion-optimized landing pages.',
      results: [
        { metric: '5.2x', label: 'Return on ad spend', icon: Zap },
        { metric: '280%', label: 'Increase in qualified leads', icon: Users },
        { metric: '45%', label: 'Lower cost per acquisition', icon: TrendingUp },
      ],
      testimonial: {
        quote: "The team doesn't just run campaigns — they understand our business. Our lead quality improved dramatically while costs went down.",
        author: "Maria L.",
        role: "Founder, MediCare Plus"
      },
      image: aiCollaborationImg,
      services: ['SEA / PPC', 'Landing Page Optimization', 'Conversion Rate Optimization']
    },
    {
      id: 'retailmax-brand',
      title: 'RetailMax: Complete Brand Transformation',
      industry: 'E-Commerce / Retail',
      challenge: 'RetailMax had an outdated brand identity that didn\'t resonate with their target millennial audience. Their online presence felt inconsistent and failed to convey their premium positioning.',
      solution: 'We conducted extensive brand research, developed a fresh visual identity, redesigned their website with conversion optimization in mind, and launched a coordinated social media strategy to build brand awareness.',
      results: [
        { metric: '200%', label: 'Increase in brand awareness', icon: Award },
        { metric: '180%', label: 'Boost in website conversions', icon: BarChart3 },
        { metric: '3.8x', label: 'Social media engagement growth', icon: Users },
      ],
      image: servicesOverviewImg,
      services: ['Brand Deployment', 'Design & Development', 'Social Media Marketing']
    },
  ] : [
    {
      id: 'techcorp-ai',
      title: 'TechCorp: KI-gestützte Kundenservice-Revolution',
      industry: 'Technologie / SaaS',
      challenge: 'TechCorp kämpfte mit hohen Kundenservice-Kosten und langsamen Antwortzeiten. Ihr Support-Team war mit repetitiven Anfragen überfordert, was zu Kundenfrustration und Abwanderung führte.',
      solution: 'Wir implementierten eine KI-Chatbot-Lösung, die 80% der häufigen Anfragen automatisch bearbeitet, mit ihrem CRM für personalisierte Antworten integriert ist, und ein Lead-Qualifizierungssystem, das hochwertige Interessenten priorisiert.',
      results: [
        { metric: '85%', label: 'Schnellere Antwortzeit', icon: Clock },
        { metric: '60%', label: 'Kostenreduktion im Support', icon: TrendingUp },
        { metric: '45%', label: 'Steigerung der Kundenzufriedenheit', icon: Users },
      ],
      testimonial: {
        quote: "Ihre KI-Implementierung hat unseren Kundenservice transformiert. Wir können jetzt das 3-fache Volumen mit dem gleichen Team bewältigen.",
        author: "Sarah M.",
        role: "CEO, TechCorp"
      },
      image: aiCollaborationImg,
      services: ['KI-Implementierung', 'Prozessautomatisierung']
    },
    {
      id: 'swissfinance-seo',
      title: 'SwissFinance: Von Seite 3 auf Platz 1 bei Google',
      industry: 'Finanzdienstleistungen',
      challenge: 'SwissFinance hatte eine schöne Website, aber praktisch keinen organischen Traffic. Sie gaben viel für bezahlte Anzeigen mit sinkenden Erträgen aus und brauchten eine nachhaltige Wachstumsstrategie.',
      solution: 'Wir führten eine umfassende SEO-Überarbeitung durch, einschließlich technischer Korrekturen, Content-Strategie für High-Intent-Keywords und eine strategische Linkbuilding-Kampagne. Wir optimierten auch ihre Google Business-Profile für lokale Suche.',
      results: [
        { metric: '#1', label: 'Google-Ranking für 15 Keywords', icon: Target },
        { metric: '340%', label: 'Steigerung des organischen Traffics', icon: BarChart3 },
        { metric: '60%', label: 'Reduktion der Kosten pro Lead', icon: TrendingUp },
      ],
      testimonial: {
        quote: "Wir sind in nur 4 Monaten von Seite 3 auf Platz 1 bei Google gestiegen. Der ROI ihrer SEO-Arbeit war unglaublich.",
        author: "Thomas K.",
        role: "Marketing Director, SwissFinance"
      },
      image: servicesOverviewImg,
      services: ['SEO', 'Content-Strategie', 'Local SEO']
    },
    {
      id: 'medicare-ppc',
      title: 'MediCare Plus: 5x ROAS mit smartem PPC',
      industry: 'Gesundheitswesen',
      challenge: 'MediCare Plus verbrannte Werbebudget mit schlechtem Targeting und generischen Botschaften. Ihre Kosten pro Akquisition waren unhaltbar hoch und gefährdeten ihre Wachstumspläne.',
      solution: 'Wir strukturierten ihr gesamtes Google Ads-Konto um, implementierten KI-gestützte Gebotsstrategien, erstellten hochgradig zielgerichtete Anzeigentexte für verschiedene Patientensegmente und bauten konversionsoptimierte Landing Pages.',
      results: [
        { metric: '5.2x', label: 'Return on Ad Spend', icon: Zap },
        { metric: '280%', label: 'Steigerung qualifizierter Leads', icon: Users },
        { metric: '45%', label: 'Niedrigere Kosten pro Akquisition', icon: TrendingUp },
      ],
      testimonial: {
        quote: "Das Team führt nicht nur Kampagnen durch — sie verstehen unser Geschäft. Unsere Lead-Qualität hat sich dramatisch verbessert, während die Kosten sanken.",
        author: "Maria L.",
        role: "Gründerin, MediCare Plus"
      },
      image: aiCollaborationImg,
      services: ['SEA / PPC', 'Landing-Page-Optimierung', 'Conversion-Rate-Optimierung']
    },
    {
      id: 'retailmax-brand',
      title: 'RetailMax: Komplette Markentransformation',
      industry: 'E-Commerce / Retail',
      challenge: 'RetailMax hatte eine veraltete Markenidentität, die bei ihrer millennial Zielgruppe nicht ankam. Ihre Online-Präsenz wirkte inkonsistent und vermittelte nicht ihre Premium-Positionierung.',
      solution: 'Wir führten umfangreiche Markenforschung durch, entwickelten eine frische visuelle Identität, redesignten ihre Website mit Fokus auf Conversion-Optimierung und starteten eine koordinierte Social-Media-Strategie zum Aufbau der Markenbekanntheit.',
      results: [
        { metric: '200%', label: 'Steigerung der Markenbekanntheit', icon: Award },
        { metric: '180%', label: 'Boost bei Website-Conversions', icon: BarChart3 },
        { metric: '3.8x', label: 'Wachstum des Social-Media-Engagements', icon: Users },
      ],
      image: servicesOverviewImg,
      services: ['Brand Deployment', 'Design & Entwicklung', 'Social Media Marketing']
    },
  ];

  return (
    <Layout>
      <SEOHead 
        title={isEnglish ? 'Case Studies | Client Success Stories' : 'Fallstudien | Kundenerfolgsstories'}
        description={isEnglish 
          ? 'Explore our client success stories. See real results from real businesses with detailed before/after metrics and testimonials.'
          : 'Entdecken Sie unsere Kundenerfolgsstories. Sehen Sie echte Ergebnisse von echten Unternehmen mit detaillierten Vorher/Nachher-Metriken und Testimonials.'}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-ai/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <SectionContainer background="none" className="relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="mb-6 font-display">
                {isEnglish ? (
                  <>
                    <span className="block text-foreground">Real Results from</span>
                    <span className="block text-gradient-ai">Real Businesses</span>
                  </>
                ) : (
                  <>
                    <span className="block text-foreground">Echte Ergebnisse von</span>
                    <span className="block text-gradient-ai">echten Unternehmen</span>
                  </>
                )}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
                {isEnglish 
                  ? 'Explore how we\'ve helped businesses like yours achieve extraordinary growth with AI-powered digital marketing.'
                  : 'Entdecken Sie, wie wir Unternehmen wie Ihres geholfen haben, außergewöhnliches Wachstum mit KI-gestütztem Digital Marketing zu erreichen.'}
              </p>
              <CTAButton
                variant="primary"
                size="lg"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location="case-studies-hero"
                className="glow-primary"
              >
                {isEnglish ? 'Get Your Free Audit' : 'Gratis Audit erhalten'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
            </div>
          </ScrollReveal>
        </SectionContainer>
      </section>

      {/* Case Studies */}
      {caseStudies.map((study, index) => (
        <SectionContainer 
          key={study.id} 
          background={index % 2 === 0 ? 'default' : 'muted'}
          className="relative overflow-hidden"
        >
          {index % 2 === 1 && <div className="absolute inset-0 gradient-mesh opacity-30" />}
          
          <div className="relative">
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Image */}
              <ScrollReveal direction={index % 2 === 0 ? 'left' : 'right'} delay={0.1}>
                <div className="relative rounded-2xl overflow-hidden">
                  <img 
                    src={study.image} 
                    alt={study.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                      {study.industry}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
              
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-first' : ''}>
                <ScrollReveal delay={0.2}>
                  <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">
                    {study.title}
                  </h2>
                </ScrollReveal>
                
                <ScrollReveal delay={0.3}>
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                      {isEnglish ? 'The Challenge' : 'Die Herausforderung'}
                    </h3>
                    <p className="text-muted-foreground">{study.challenge}</p>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={0.4}>
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                      {isEnglish ? 'Our Solution' : 'Unsere Lösung'}
                    </h3>
                    <p className="text-muted-foreground">{study.solution}</p>
                  </div>
                </ScrollReveal>
                
                {/* Results Grid */}
                <StaggerContainer className="grid grid-cols-3 gap-4 mb-6" staggerDelay={0.1}>
                  {study.results.map((result, resultIndex) => (
                    <StaggerItem key={resultIndex}>
                      <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                        <result.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold font-display text-gradient">
                          {result.metric}
                        </div>
                        <div className="text-xs text-muted-foreground">{result.label}</div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                
                {/* Services Used */}
                <ScrollReveal delay={0.5}>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {study.services.map((service, serviceIndex) => (
                      <span 
                        key={serviceIndex}
                        className="px-3 py-1 rounded-full bg-secondary/50 text-sm text-muted-foreground"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </ScrollReveal>
                
                {/* Testimonial */}
                {study.testimonial && (
                  <ScrollReveal delay={0.6}>
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                      "{study.testimonial.quote}"
                      <footer className="mt-2 text-sm not-italic font-medium text-foreground">
                        — {study.testimonial.author}, {study.testimonial.role}
                      </footer>
                    </blockquote>
                  </ScrollReveal>
                )}
              </div>
            </div>
          </div>
        </SectionContainer>
      ))}

      {/* CTA Section */}
      <SectionContainer className="gradient-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <ScrollReveal>
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-primary-foreground mb-4 font-display">
              {isEnglish ? 'Ready to Be Our Next Success Story?' : 'Bereit, unsere nächste Erfolgsgeschichte zu werden?'}
            </h2>
            <p className="text-primary-foreground/80 text-xl mb-10">
              {isEnglish
                ? 'Get a free consultation and discover how we can help you achieve similar results.'
                : 'Erhalten Sie eine kostenlose Beratung und entdecken Sie, wie wir Ihnen helfen können, ähnliche Ergebnisse zu erzielen.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                variant="secondary"
                size="lg"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location="case-studies-footer"
                className="bg-white text-primary hover:bg-white/90 shadow-xl"
              >
                {isEnglish ? 'Get Free AI Audit' : 'Gratis KI-Audit erhalten'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <CTAButton
                variant="secondary"
                size="lg"
                href={isEnglish ? '/en/free-call' : '/gratis-call'}
                location="case-studies-footer"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
              >
                {isEnglish ? 'Book a Call' : 'Call buchen'}
              </CTAButton>
            </div>
          </div>
        </ScrollReveal>
      </SectionContainer>
    </Layout>
  );
}