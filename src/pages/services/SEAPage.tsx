import { MousePointerClick } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ServiceDetailPage } from '@/components/ServiceDetailPage';
import seaServiceImg from '@/assets/sea-service.jpg';

export default function SEAPage() {
  const { isEnglish } = useLanguage();

  const features = isEnglish ? [
    { title: 'Google Ads Management', description: 'Expert campaign setup, optimization, and management for maximum ROI.' },
    { title: 'Social Media Advertising', description: 'Targeted ads on Facebook, Instagram, LinkedIn, and TikTok.' },
    { title: 'Retargeting Campaigns', description: 'Re-engage visitors who didn\'t convert the first time.' },
    { title: 'Conversion Tracking', description: 'Comprehensive tracking setup to measure what actually drives revenue.' },
    { title: 'A/B Testing', description: 'Continuous testing of ads, landing pages, and audiences for optimization.' },
    { title: 'AI Bid Optimization', description: 'Machine learning algorithms that maximize your ad spend efficiency.' },
  ] : [
    { title: 'Google Ads Management', description: 'Experten-Kampagnenaufbau, Optimierung und Management für maximalen ROI.' },
    { title: 'Social Media Advertising', description: 'Zielgerichtete Anzeigen auf Facebook, Instagram, LinkedIn und TikTok.' },
    { title: 'Retargeting-Kampagnen', description: 'Erreichen Sie Besucher erneut, die beim ersten Mal nicht konvertiert haben.' },
    { title: 'Conversion Tracking', description: 'Umfassendes Tracking-Setup zur Messung dessen, was tatsächlich Umsatz bringt.' },
    { title: 'A/B Testing', description: 'Kontinuierliches Testen von Anzeigen, Landing Pages und Zielgruppen.' },
    { title: 'KI-Gebotsoptimierung', description: 'Machine-Learning-Algorithmen, die Ihre Werbeausgaben-Effizienz maximieren.' },
  ];

  const benefits = isEnglish ? [
    'Immediate traffic and lead generation',
    'Precise targeting of your ideal customers',
    'Measurable ROI on every dollar spent',
    'Scalable campaigns that grow with you',
    'Flexible budgets with no minimums',
    'Real-time performance insights',
  ] : [
    'Sofortiger Traffic und Lead-Generierung',
    'Präzises Targeting Ihrer Idealkunden',
    'Messbarer ROI auf jeden ausgegebenen Franken',
    'Skalierbare Kampagnen, die mit Ihnen wachsen',
    'Flexible Budgets ohne Mindestbeträge',
    'Echtzeit-Performance-Einblicke',
  ];

  const caseStudies = isEnglish ? [
    { metric: '4.2x', result: 'Return on ad spend (ROAS)', industry: 'E-Commerce' },
    { metric: '-45%', result: 'Cost per acquisition', industry: 'Lead Generation' },
    { metric: '200%', result: 'Qualified leads increase', industry: 'B2B Services' },
  ] : [
    { metric: '4.2x', result: 'Return on Ad Spend (ROAS)', industry: 'E-Commerce' },
    { metric: '-45%', result: 'Kosten pro Akquisition', industry: 'Lead-Generierung' },
    { metric: '200%', result: 'Steigerung qualifizierter Leads', industry: 'B2B-Dienstleistungen' },
  ];

  const relatedServices = isEnglish ? [
    { title: 'SEO', path: '/en/services/seo' },
    { title: 'Design & Development', path: '/en/services/design-development' },
    { title: 'AI Implementation', path: '/en/services/ai-implementation' },
  ] : [
    { title: 'SEO', path: '/services/seo' },
    { title: 'Design & Entwicklung', path: '/services/design-entwicklung' },
    { title: 'KI-Implementierung', path: '/services/ki-implementierung' },
  ];

  return (
    <ServiceDetailPage
      icon={MousePointerClick}
      title="SEA / PPC"
      subtitle={isEnglish 
        ? 'Paid advertising that delivers measurable ROI. Every click is optimized for conversions.'
        : 'Bezahlte Werbung mit messbarem ROI. Jeder Klick ist auf Conversions optimiert.'}
      description={isEnglish
        ? 'We don\'t just run ads — we build profit engines. Our approach combines deep audience research, compelling creative, and relentless optimization to ensure every advertising dollar works as hard as possible. AI-powered bidding and targeting help us outperform the competition while maximizing your budget efficiency.'
        : 'Wir schalten nicht nur Anzeigen — wir bauen Profit-Maschinen. Unser Ansatz kombiniert tiefgreifende Zielgruppenforschung, überzeugende Kreative und unermüdliche Optimierung, um sicherzustellen, dass jeder Werbefranken so hart wie möglich arbeitet. KI-gestützte Gebote und Targeting helfen uns, die Konkurrenz zu übertreffen.'}
      features={features}
      benefits={benefits}
      caseStudies={caseStudies}
      relatedServices={relatedServices}
    />
  );
}