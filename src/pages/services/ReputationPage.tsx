import { Shield } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ServiceDetailPage } from '@/components/ServiceDetailPage';
import reputationServiceImg from '@/assets/services/reputation-service.jpg';

export default function ReputationPage() {
  const { isEnglish } = useLanguage();

  const features = isEnglish ? [
    { title: 'Review Management', description: 'Monitor, respond to, and generate positive reviews across all platforms.' },
    { title: 'Brand Monitoring', description: 'Real-time alerts for brand mentions across the web and social media.' },
    { title: 'Crisis Response', description: 'Rapid response protocols to address negative publicity and protect your brand.' },
    { title: 'Review Generation', description: 'Automated systems to encourage happy customers to leave positive reviews.' },
    { title: 'Sentiment Analysis', description: 'AI-powered analysis of customer sentiment across all touchpoints.' },
    { title: 'Competitor Intelligence', description: 'Monitor competitor reviews and reputation for strategic insights.' },
  ] : [
    { title: 'Bewertungsmanagement', description: 'Überwachen, beantworten und positive Bewertungen auf allen Plattformen generieren.' },
    { title: 'Markenüberwachung', description: 'Echtzeit-Benachrichtigungen für Markenerwähnungen im Web und Social Media.' },
    { title: 'Krisenreaktion', description: 'Schnelle Reaktionsprotokolle zur Bewältigung negativer Publicity und Markenschutz.' },
    { title: 'Bewertungsgenerierung', description: 'Automatisierte Systeme zur Ermutigung zufriedener Kunden, positive Bewertungen zu hinterlassen.' },
    { title: 'Sentiment-Analyse', description: 'KI-gestützte Analyse der Kundenstimmung über alle Touchpoints.' },
    { title: 'Wettbewerber-Intelligence', description: 'Überwachung von Wettbewerber-Bewertungen und Reputation für strategische Insights.' },
  ];

  const benefits = isEnglish ? [
    'Higher trust and conversion rates',
    'Protection from negative publicity',
    'Increased customer loyalty',
    'Better search engine visibility',
    'Competitive advantage through social proof',
    'Early warning system for issues',
  ] : [
    'Höheres Vertrauen und Konversionsraten',
    'Schutz vor negativer Publicity',
    'Erhöhte Kundenloyalität',
    'Bessere Suchmaschinen-Sichtbarkeit',
    'Wettbewerbsvorteil durch Social Proof',
    'Frühwarnsystem für Probleme',
  ];

  const caseStudies = isEnglish ? [
    { metric: '4.8★', result: 'Average rating achieved', industry: 'Healthcare' },
    { metric: '+180%', result: 'Positive review increase', industry: 'Hospitality' },
    { metric: '24h', result: 'Crisis response time', industry: 'Retail' },
  ] : [
    { metric: '4.8★', result: 'Durchschnittliche erreichte Bewertung', industry: 'Gesundheitswesen' },
    { metric: '+180%', result: 'Steigerung positiver Bewertungen', industry: 'Gastgewerbe' },
    { metric: '24h', result: 'Krisenreaktionszeit', industry: 'Einzelhandel' },
  ];

  const relatedServices = isEnglish ? [
    { title: 'Social Media', path: '/en/services/social-media' },
    { title: 'Brand Deployment', path: '/en/services/brand-deployment' },
    { title: 'AI Implementation', path: '/en/services/ai-implementation' },
  ] : [
    { title: 'Social Media', path: '/services/social-media' },
    { title: 'Brand Deployment', path: '/services/brand-deployment' },
    { title: 'KI-Implementierung', path: '/services/ki-implementierung' },
  ];

  return (
    <ServiceDetailPage
      icon={Shield}
      title={isEnglish ? 'Reputation Management' : 'Reputation Management'}
      subtitle={isEnglish 
        ? 'Protect and enhance your brand\'s online presence. Build trust at scale.'
        : 'Schützen und verbessern Sie Ihre Online-Präsenz. Vertrauen skalierbar aufbauen.'}
      description={isEnglish
        ? 'Your online reputation can make or break your business. We provide comprehensive reputation management that protects your brand, amplifies positive sentiment, and turns satisfied customers into vocal advocates. Our AI-powered monitoring ensures you\'re always aware of what\'s being said about your brand.'
        : 'Ihre Online-Reputation kann Ihr Geschäft machen oder brechen. Wir bieten umfassendes Reputation Management, das Ihre Marke schützt, positive Stimmung verstärkt und zufriedene Kunden zu Fürsprechern macht. Unsere KI-gestützte Überwachung stellt sicher, dass Sie immer wissen, was über Ihre Marke gesagt wird.'}
      features={features}
      benefits={benefits}
      caseStudies={caseStudies}
      relatedServices={relatedServices}
      heroImage={reputationServiceImg}
    />
  );
}