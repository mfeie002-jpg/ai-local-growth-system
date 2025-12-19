import { Search } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ServiceDetailPage } from '@/components/ServiceDetailPage';

export default function SEOPage() {
  const { isEnglish } = useLanguage();

  const features = isEnglish ? [
    { title: 'Technical SEO Audit', description: 'Comprehensive analysis of your website\'s technical health, speed, and crawlability.' },
    { title: 'Keyword Strategy', description: 'Research and targeting of high-intent keywords that drive qualified traffic.' },
    { title: 'Content Optimization', description: 'Strategic content creation and optimization for search engines and users.' },
    { title: 'Local SEO', description: 'Dominate local search results with Google Business optimization and local citations.' },
    { title: 'Link Building', description: 'Ethical, high-quality backlink acquisition to boost domain authority.' },
    { title: 'Performance Tracking', description: 'Real-time dashboards showing rankings, traffic, and conversions.' },
  ] : [
    { title: 'Technisches SEO-Audit', description: 'Umfassende Analyse der technischen Gesundheit, Geschwindigkeit und Crawlability Ihrer Website.' },
    { title: 'Keyword-Strategie', description: 'Recherche und Targeting von High-Intent-Keywords, die qualifizierten Traffic bringen.' },
    { title: 'Content-Optimierung', description: 'Strategische Content-Erstellung und Optimierung für Suchmaschinen und Nutzer.' },
    { title: 'Local SEO', description: 'Dominieren Sie lokale Suchergebnisse mit Google Business-Optimierung und lokalen Citations.' },
    { title: 'Linkbuilding', description: 'Ethischer, hochwertiger Backlink-Aufbau zur Steigerung der Domain-Autorität.' },
    { title: 'Performance-Tracking', description: 'Echtzeit-Dashboards mit Rankings, Traffic und Conversions.' },
  ];

  const benefits = isEnglish ? [
    'Sustainable, long-term traffic growth',
    'Higher quality leads from organic search',
    'Reduced dependency on paid advertising',
    'Improved brand credibility and trust',
    'Better user experience and site performance',
    'Competitive advantage in search results',
  ] : [
    'Nachhaltiges, langfristiges Traffic-Wachstum',
    'Höherwertige Leads aus organischer Suche',
    'Geringere Abhängigkeit von bezahlter Werbung',
    'Verbesserte Markenglaubwürdigkeit und Vertrauen',
    'Bessere Nutzererfahrung und Site-Performance',
    'Wettbewerbsvorteil in Suchergebnissen',
  ];

  const caseStudies = isEnglish ? [
    { metric: '340%', result: 'Organic traffic increase', industry: 'Professional Services' },
    { metric: '#1', result: 'Google ranking for 15 keywords', industry: 'Local Business' },
    { metric: '60%', result: 'Reduction in cost per lead', industry: 'B2B SaaS' },
  ] : [
    { metric: '340%', result: 'Steigerung des organischen Traffics', industry: 'Professionelle Dienstleistungen' },
    { metric: '#1', result: 'Google-Ranking für 15 Keywords', industry: 'Lokales Unternehmen' },
    { metric: '60%', result: 'Reduktion der Kosten pro Lead', industry: 'B2B SaaS' },
  ];

  const relatedServices = isEnglish ? [
    { title: 'SEA / PPC', path: '/en/services/sea' },
    { title: 'Content & Social Media', path: '/en/services/social-media' },
    { title: 'AI Implementation', path: '/en/services/ai-implementation' },
  ] : [
    { title: 'SEA / PPC', path: '/services/sea' },
    { title: 'Content & Social Media', path: '/services/social-media' },
    { title: 'KI-Implementierung', path: '/services/ki-implementierung' },
  ];

  return (
    <ServiceDetailPage
      icon={Search}
      title="SEO"
      subtitle={isEnglish 
        ? 'Dominate search results with data-driven SEO strategies that deliver sustainable growth.'
        : 'Dominieren Sie Suchergebnisse mit datengetriebenen SEO-Strategien für nachhaltiges Wachstum.'}
      description={isEnglish
        ? 'We don\'t chase algorithm updates — we build SEO strategies that stand the test of time. Our approach combines technical excellence, strategic content, and authoritative link building to help you rank for the keywords that actually drive revenue. Enhanced by AI-powered insights for faster, smarter optimization.'
        : 'Wir jagen keine Algorithmus-Updates — wir bauen SEO-Strategien, die den Test der Zeit bestehen. Unser Ansatz kombiniert technische Exzellenz, strategischen Content und autoritatives Linkbuilding, um Sie für Keywords zu ranken, die tatsächlich Umsatz bringen. Verstärkt durch KI-gestützte Insights für schnellere, smartere Optimierung.'}
      features={features}
      benefits={benefits}
      caseStudies={caseStudies}
      relatedServices={relatedServices}
    />
  );
}