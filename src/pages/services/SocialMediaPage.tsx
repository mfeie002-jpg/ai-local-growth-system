import { Share2 } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ServiceDetailPage } from '@/components/ServiceDetailPage';
import socialMediaServiceImg from '@/assets/social-media-service.jpg';

export default function SocialMediaPage() {
  const { isEnglish } = useLanguage();

  const features = isEnglish ? [
    { title: 'Content Strategy', description: 'Strategic content planning aligned with your business goals and audience preferences.' },
    { title: 'Content Creation', description: 'Engaging posts, graphics, videos, and stories that capture attention and drive engagement.' },
    { title: 'Community Management', description: 'Active engagement with your audience to build relationships and brand loyalty.' },
    { title: 'Influencer Marketing', description: 'Strategic partnerships with influencers who align with your brand values.' },
    { title: 'Social Advertising', description: 'Targeted paid campaigns on Facebook, Instagram, LinkedIn, and TikTok.' },
    { title: 'Analytics & Reporting', description: 'Data-driven insights to continuously improve performance and ROI.' },
  ] : [
    { title: 'Content-Strategie', description: 'Strategische Content-Planung abgestimmt auf Ihre Geschäftsziele und Zielgruppenpräferenzen.' },
    { title: 'Content-Erstellung', description: 'Ansprechende Posts, Grafiken, Videos und Stories, die Aufmerksamkeit und Engagement erzeugen.' },
    { title: 'Community Management', description: 'Aktives Engagement mit Ihrer Zielgruppe für Beziehungsaufbau und Markenloyalität.' },
    { title: 'Influencer Marketing', description: 'Strategische Partnerschaften mit Influencern, die zu Ihren Markenwerten passen.' },
    { title: 'Social Advertising', description: 'Zielgerichtete bezahlte Kampagnen auf Facebook, Instagram, LinkedIn und TikTok.' },
    { title: 'Analytics & Reporting', description: 'Datengetriebene Insights zur kontinuierlichen Verbesserung von Performance und ROI.' },
  ];

  const benefits = isEnglish ? [
    'Increased brand awareness and reach',
    'Direct engagement with your audience',
    'Higher website traffic from social',
    'Improved customer relationships',
    'Real-time market insights',
    'Cost-effective brand building',
  ] : [
    'Erhöhte Markenbekanntheit und Reichweite',
    'Direktes Engagement mit Ihrer Zielgruppe',
    'Höherer Website-Traffic aus Social',
    'Verbesserte Kundenbeziehungen',
    'Echtzeit-Markteinblicke',
    'Kosteneffektiver Markenaufbau',
  ];

  const caseStudies = isEnglish ? [
    { metric: '+520%', result: 'Follower growth in 6 months', industry: 'Fashion Brand' },
    { metric: '8.5%', result: 'Average engagement rate', industry: 'Restaurant Chain' },
    { metric: '40%', result: 'Leads from social media', industry: 'B2B Services' },
  ] : [
    { metric: '+520%', result: 'Follower-Wachstum in 6 Monaten', industry: 'Modemarke' },
    { metric: '8.5%', result: 'Durchschnittliche Engagement-Rate', industry: 'Restaurantkette' },
    { metric: '40%', result: 'Leads aus Social Media', industry: 'B2B-Dienstleistungen' },
  ];

  const relatedServices = isEnglish ? [
    { title: 'Reputation Management', path: '/en/services/reputation' },
    { title: 'Brand Deployment', path: '/en/services/brand-deployment' },
    { title: 'AI Implementation', path: '/en/services/ai-implementation' },
  ] : [
    { title: 'Reputation Management', path: '/services/reputation' },
    { title: 'Brand Deployment', path: '/services/brand-deployment' },
    { title: 'KI-Implementierung', path: '/services/ki-implementierung' },
  ];

  return (
    <ServiceDetailPage
      icon={Share2}
      title="Social Media"
      subtitle={isEnglish 
        ? 'Build community and drive engagement with strategic social presence.'
        : 'Community aufbauen und Engagement steigern mit strategischer sozialer Präsenz.'}
      description={isEnglish
        ? 'Social media isn\'t just about posting content — it\'s about building real connections with your audience. We create strategic social media programs that engage your community, amplify your brand, and drive measurable business results. Enhanced by AI for smarter content optimization and audience targeting.'
        : 'Social Media ist nicht nur Content posten — es geht um echte Verbindungen mit Ihrer Zielgruppe. Wir erstellen strategische Social-Media-Programme, die Ihre Community engagieren, Ihre Marke verstärken und messbare Geschäftsergebnisse liefern. Verstärkt durch KI für smartere Content-Optimierung und Zielgruppen-Targeting.'}
      features={features}
      benefits={benefits}
      caseStudies={caseStudies}
      relatedServices={relatedServices}
    />
  );
}