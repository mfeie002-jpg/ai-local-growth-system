import { useLanguage } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight, TrendingUp, Users, Clock, Target, BarChart3, Zap, Award,
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
      title: 'AI-Powered Customer Service Revolution',
      industry: 'Technology / SaaS',
      challenge: 'TechCorp was struggling with high customer service costs and slow response times. Their support team was overwhelmed with repetitive inquiries, leading to customer frustration and churn.',
      solution: 'We implemented an AI chatbot solution that handles 80% of common inquiries automatically, integrated with their CRM for personalized responses, and deployed a lead qualification system that prioritizes high-value prospects.',
      results: [
        { metric: '85%', label: 'Faster response time', icon: Clock },
        { metric: '60%', label: 'Cost reduction in support', icon: TrendingUp },
        { metric: '45%', label: 'Increase in customer satisfaction', icon: Users },
      ],
      testimonial: { quote: "Their AI implementation transformed our customer service. We're now able to handle 3x the volume with the same team.", author: 'Sarah M.', role: 'CEO, TechCorp' },
      image: aiCollaborationImg,
      services: ['AI Implementation', 'Process Automation'],
    },
    {
      id: 'swissfinance-seo',
      title: 'From Page 3 to #1 on Google',
      industry: 'Financial Services',
      challenge: 'SwissFinance had a beautiful website but virtually no organic traffic. They were spending heavily on paid ads with diminishing returns and needed a sustainable growth strategy.',
      solution: 'We executed a comprehensive SEO overhaul including technical fixes, content strategy targeting high-intent keywords, and a strategic link-building campaign. We also optimized their Google Business profiles for local search.',
      results: [
        { metric: '#1', label: 'Google ranking for 15 keywords', icon: Target },
        { metric: '340%', label: 'Increase in organic traffic', icon: BarChart3 },
        { metric: '60%', label: 'Reduction in cost per lead', icon: TrendingUp },
      ],
      testimonial: { quote: 'We went from page 3 to #1 on Google in just 4 months. The ROI on their SEO work has been incredible.', author: 'Thomas K.', role: 'Marketing Director, SwissFinance' },
      image: servicesOverviewImg,
      services: ['SEO', 'Content Strategy', 'Local SEO'],
    },
    {
      id: 'medicare-ppc',
      title: '5x ROAS with Smart PPC',
      industry: 'Healthcare',
      challenge: 'MediCare Plus was burning through ad budget with poor targeting and generic messaging. Their cost per acquisition was unsustainably high, threatening their growth plans.',
      solution: 'We restructured their entire Google Ads account, implemented AI-powered bidding strategies, created highly targeted ad copy for different patient segments, and built conversion-optimized landing pages.',
      results: [
        { metric: '5.2x', label: 'Return on ad spend', icon: Zap },
        { metric: '280%', label: 'Increase in qualified leads', icon: Users },
        { metric: '45%', label: 'Lower cost per acquisition', icon: TrendingUp },
      ],
      testimonial: { quote: "The team doesn't just run campaigns — they understand our business. Our lead quality improved dramatically while costs went down.", author: 'Maria L.', role: 'Founder, MediCare Plus' },
      image: aiCollaborationImg,
      services: ['SEA / PPC', 'Landing Page Optimization', 'CRO'],
    },
    {
      id: 'retailmax-brand',
      title: 'Complete Brand Transformation',
      industry: 'E-Commerce / Retail',
      challenge: "RetailMax had an outdated brand identity that didn't resonate with their target millennial audience. Their online presence felt inconsistent and failed to convey their premium positioning.",
      solution: 'We conducted extensive brand research, developed a fresh visual identity, redesigned their website with conversion optimization in mind, and launched a coordinated social media strategy to build brand awareness.',
      results: [
        { metric: '200%', label: 'Increase in brand awareness', icon: Award },
        { metric: '180%', label: 'Boost in website conversions', icon: BarChart3 },
        { metric: '3.8x', label: 'Social media engagement growth', icon: Users },
      ],
      image: servicesOverviewImg,
      services: ['Brand Deployment', 'Design & Development', 'Social Media'],
    },
  ] : [
    {
      id: 'techcorp-ai',
      title: 'KI-gestützte Kundenservice-Revolution',
      industry: 'Technologie / SaaS',
      challenge: 'TechCorp kämpfte mit hohen Kundenservice-Kosten und langsamen Antwortzeiten. Ihr Support-Team war mit repetitiven Anfragen überfordert.',
      solution: 'Wir implementierten eine KI-Chatbot-Lösung, die 80% der häufigen Anfragen automatisch bearbeitet, mit ihrem CRM integriert ist, und ein Lead-Qualifizierungssystem.',
      results: [
        { metric: '85%', label: 'Schnellere Antwortzeit', icon: Clock },
        { metric: '60%', label: 'Kostenreduktion im Support', icon: TrendingUp },
        { metric: '45%', label: 'Steigerung der Kundenzufriedenheit', icon: Users },
      ],
      testimonial: { quote: 'Ihre KI-Implementierung hat unseren Kundenservice transformiert. Wir bewältigen das 3-fache Volumen mit dem gleichen Team.', author: 'Sarah M.', role: 'CEO, TechCorp' },
      image: aiCollaborationImg,
      services: ['KI-Implementierung', 'Prozessautomatisierung'],
    },
    {
      id: 'swissfinance-seo',
      title: 'Von Seite 3 auf Platz 1 bei Google',
      industry: 'Finanzdienstleistungen',
      challenge: 'SwissFinance hatte eine schöne Website, aber praktisch keinen organischen Traffic. Sie gaben viel für bezahlte Anzeigen mit sinkenden Erträgen aus.',
      solution: 'Wir führten eine umfassende SEO-Überarbeitung durch — technische Korrekturen, Content-Strategie, Linkbuilding und Local-SEO-Optimierung.',
      results: [
        { metric: '#1', label: 'Google-Ranking für 15 Keywords', icon: Target },
        { metric: '340%', label: 'Steigerung des organischen Traffics', icon: BarChart3 },
        { metric: '60%', label: 'Reduktion der Kosten pro Lead', icon: TrendingUp },
      ],
      testimonial: { quote: 'Wir sind in nur 4 Monaten von Seite 3 auf Platz 1 bei Google gestiegen. Der ROI war unglaublich.', author: 'Thomas K.', role: 'Marketing Director, SwissFinance' },
      image: servicesOverviewImg,
      services: ['SEO', 'Content-Strategie', 'Local SEO'],
    },
    {
      id: 'medicare-ppc',
      title: '5x ROAS mit smartem PPC',
      industry: 'Gesundheitswesen',
      challenge: 'MediCare Plus verbrannte Werbebudget mit schlechtem Targeting und generischen Botschaften. Die Kosten pro Akquisition waren unhaltbar hoch.',
      solution: 'Wir strukturierten ihr gesamtes Google Ads-Konto um, implementierten KI-Bidding, erstellten zielgerichtete Anzeigentexte und konversionsoptimierte Landing Pages.',
      results: [
        { metric: '5.2x', label: 'Return on Ad Spend', icon: Zap },
        { metric: '280%', label: 'Steigerung qualifizierter Leads', icon: Users },
        { metric: '45%', label: 'Niedrigere Kosten pro Akquisition', icon: TrendingUp },
      ],
      testimonial: { quote: 'Das Team versteht unser Geschäft. Unsere Lead-Qualität hat sich dramatisch verbessert, während die Kosten sanken.', author: 'Maria L.', role: 'Gründerin, MediCare Plus' },
      image: aiCollaborationImg,
      services: ['SEA / PPC', 'Landing-Page-Optimierung', 'CRO'],
    },
    {
      id: 'retailmax-brand',
      title: 'Komplette Markentransformation',
      industry: 'E-Commerce / Retail',
      challenge: 'RetailMax hatte eine veraltete Markenidentität, die bei der Millennial-Zielgruppe nicht ankam. Ihre Online-Präsenz wirkte inkonsistent.',
      solution: 'Wir entwickelten eine frische visuelle Identität, redesignten die Website mit Conversion-Fokus und starteten eine koordinierte Social-Media-Strategie.',
      results: [
        { metric: '200%', label: 'Steigerung der Markenbekanntheit', icon: Award },
        { metric: '180%', label: 'Boost bei Website-Conversions', icon: BarChart3 },
        { metric: '3.8x', label: 'Wachstum des Social-Media-Engagements', icon: Users },
      ],
      image: servicesOverviewImg,
      services: ['Brand Deployment', 'Design & Entwicklung', 'Social Media'],
    },
  ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Case Studies | Client Success Stories' : 'Fallstudien | Kundenerfolgsstories'}
        description={isEnglish
          ? 'Explore client success stories with detailed before/after metrics and testimonials.'
          : 'Entdecken Sie Kundenerfolgsstories mit detaillierten Vorher/Nachher-Metriken und Testimonials.'}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 grid-pattern opacity-[0.06]" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute inset-0 noise-overlay opacity-[0.04]" />

        <div className="container-section relative">
          <div className="grid grid-cols-12 gap-6 lg:gap-12">
            <aside className="col-span-12 lg:col-span-3 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-foreground/40" />
                <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                  {isEnglish ? 'Proof / 04' : 'Beweis / 04'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {isEnglish
                  ? 'Selected engagements. Real numbers. No vanity metrics.'
                  : 'Ausgewählte Projekte. Echte Zahlen. Keine Vanity-Metriken.'}
              </p>
            </aside>

            <div className="col-span-12 lg:col-span-9">
              <ScrollReveal>
                <h1 className="font-editorial text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
                  {isEnglish ? (
                    <>Outcomes,<br /><em className="italic text-aurora">measured.</em></>
                  ) : (
                    <>Ergebnisse,<br /><em className="italic text-aurora">gemessen.</em></>
                  )}
                </h1>
                <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  {isEnglish
                    ? 'A look behind the curtain at the work — what we built, what shifted, what compounded.'
                    : 'Ein Blick hinter die Kulissen — was wir bauten, was sich änderte, was sich auszahlte.'}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Case studies */}
      {caseStudies.map((study, index) => {
        const num = String(index + 1).padStart(2, '0');
        const reversed = index % 2 === 1;
        return (
          <section key={study.id} className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28 lg:py-32">
            {reversed && <div className="absolute inset-0 noise-overlay opacity-[0.03]" />}
            <div className="container-section relative">
              {/* Top meta strip */}
              <div className="mb-12 flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase block">
                    Case {num} — {study.industry}
                  </span>
                  <h2 className="mt-3 font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight max-w-3xl">
                    {study.title}
                  </h2>
                </div>
              </div>

              <div className={`grid lg:grid-cols-12 gap-8 lg:gap-12 items-start ${reversed ? 'lg:[direction:rtl]' : ''}`}>
                {/* Image */}
                <ScrollReveal direction={reversed ? 'right' : 'left'} delay={0.1} className="lg:col-span-5 lg:[direction:ltr]">
                  <div className="relative overflow-hidden border border-border/60 group">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full aspect-[4/5] object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="font-editorial text-xs font-semibold tracking-[0.3em] uppercase backdrop-blur-md bg-background/40 px-3 py-1.5 inline-block">
                        {study.industry}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Content */}
                <div className="lg:col-span-7 lg:[direction:ltr] space-y-8">
                  <ScrollReveal delay={0.2}>
                    <div>
                      <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                        {isEnglish ? 'The Challenge' : 'Die Herausforderung'}
                      </span>
                      <p className="mt-3 text-lg text-foreground/90 leading-relaxed">{study.challenge}</p>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.3}>
                    <div>
                      <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                        {isEnglish ? 'Our Solution' : 'Unsere Lösung'}
                      </span>
                      <p className="mt-3 text-lg text-foreground/90 leading-relaxed">{study.solution}</p>
                    </div>
                  </ScrollReveal>

                  {/* Results */}
                  <ScrollReveal delay={0.4}>
                    <div className="grid grid-cols-3 gap-px bg-border/60 border border-border/60">
                      {study.results.map((result, i) => (
                        <div key={i} className="bg-card/60 backdrop-blur-sm p-5 sm:p-6 text-center">
                          <result.icon className="w-5 h-5 text-primary mx-auto mb-3 opacity-60" />
                          <div className="font-editorial text-3xl sm:text-5xl font-bold text-aurora leading-none">
                            {result.metric}
                          </div>
                          <div className="text-[11px] text-muted-foreground tracking-wider mt-2 leading-tight">
                            {result.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>

                  {/* Services tags */}
                  <ScrollReveal delay={0.5}>
                    <div className="flex flex-wrap gap-2">
                      {study.services.map((s, i) => (
                        <span key={i} className="px-3 py-1 border border-border/60 text-xs font-editorial tracking-wider uppercase text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                  </ScrollReveal>

                  {/* Testimonial */}
                  {study.testimonial && (
                    <ScrollReveal delay={0.6}>
                      <blockquote className="relative border-l-2 border-aurora pl-6 py-2" style={{ borderImage: 'var(--gradient-aurora) 1' }}>
                        <p className="font-editorial italic text-xl sm:text-2xl leading-snug text-foreground/95">
                          "{study.testimonial.quote}"
                        </p>
                        <footer className="mt-4 text-xs font-editorial tracking-[0.2em] uppercase text-muted-foreground">
                          — {study.testimonial.author} · {study.testimonial.role}
                        </footer>
                      </blockquote>
                    </ScrollReveal>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-sunset)' }} />
        <div className="absolute inset-0 noise-overlay opacity-[0.05]" />
        <div className="container-section relative">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 lg:col-span-8">
              <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                {isEnglish ? 'Your turn' : 'Du bist dran'}
              </span>
              <h2 className="mt-4 font-editorial text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
                {isEnglish ? (
                  <>Be the next <em className="italic text-aurora">case study.</em></>
                ) : (
                  <>Werde die nächste <em className="italic text-aurora">Case Study.</em></>
                )}
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:text-right space-y-3 flex lg:flex-col gap-3 lg:gap-3">
              <Link
                to={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                className="group inline-flex items-center justify-center gap-3 border-aurora bg-background/40 backdrop-blur-md px-6 py-4 font-editorial text-sm font-semibold tracking-[0.2em] uppercase hover:bg-background/60 transition-all"
              >
                {isEnglish ? 'Free AI Audit' : 'Gratis KI-Audit'}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
              </Link>
              <Link
                to={isEnglish ? '/en/free-call' : '/gratis-call'}
                className="group inline-flex items-center justify-center gap-3 border border-foreground/40 px-6 py-4 font-editorial text-sm font-semibold tracking-[0.2em] uppercase hover:border-foreground transition-all"
              >
                {isEnglish ? 'Book a Call' : 'Call buchen'}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
