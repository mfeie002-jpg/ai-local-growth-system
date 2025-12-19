import { Palette } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ServiceDetailPage } from '@/components/ServiceDetailPage';
import designServiceImg from '@/assets/services/design-service.jpg';

export default function DesignDevelopmentPage() {
  const { isEnglish } = useLanguage();

  const features = isEnglish ? [
    { title: 'Website Design', description: 'Beautiful, conversion-optimized websites that reflect your brand and drive results.' },
    { title: 'UX/UI Design', description: 'User-centered design that makes complex processes feel simple and intuitive.' },
    { title: 'Web Development', description: 'Fast, responsive, and secure websites built with modern technologies.' },
    { title: 'Landing Pages', description: 'High-converting landing pages designed for specific campaigns and offers.' },
    { title: 'E-Commerce Development', description: 'Online stores that provide seamless shopping experiences and maximize sales.' },
    { title: 'Maintenance & Support', description: 'Ongoing updates, security patches, and performance optimization.' },
  ] : [
    { title: 'Website Design', description: 'Schöne, conversion-optimierte Websites, die Ihre Marke widerspiegeln und Ergebnisse liefern.' },
    { title: 'UX/UI Design', description: 'Nutzerzentriertes Design, das komplexe Prozesse einfach und intuitiv macht.' },
    { title: 'Web-Entwicklung', description: 'Schnelle, responsive und sichere Websites mit modernen Technologien.' },
    { title: 'Landing Pages', description: 'Hochkonvertierende Landing Pages für spezifische Kampagnen und Angebote.' },
    { title: 'E-Commerce Entwicklung', description: 'Online-Shops mit nahtlosen Einkaufserlebnissen und maximierten Verkäufen.' },
    { title: 'Wartung & Support', description: 'Laufende Updates, Sicherheits-Patches und Performance-Optimierung.' },
  ];

  const benefits = isEnglish ? [
    'Professional brand representation online',
    'Higher conversion rates from better UX',
    'Fast loading speeds for better SEO',
    'Mobile-first, responsive design',
    'Scalable architecture for growth',
    'Reduced development and maintenance costs',
  ] : [
    'Professionelle Markenrepräsentation online',
    'Höhere Konversionsraten durch bessere UX',
    'Schnelle Ladezeiten für besseres SEO',
    'Mobile-first, responsives Design',
    'Skalierbare Architektur für Wachstum',
    'Reduzierte Entwicklungs- und Wartungskosten',
  ];

  const caseStudies = isEnglish ? [
    { metric: '+85%', result: 'Conversion rate improvement', industry: 'SaaS' },
    { metric: '0.8s', result: 'Page load time achieved', industry: 'E-Commerce' },
    { metric: '40%', result: 'Bounce rate reduction', industry: 'Professional Services' },
  ] : [
    { metric: '+85%', result: 'Verbesserung der Konversionsrate', industry: 'SaaS' },
    { metric: '0.8s', result: 'Erreichte Seitenladezeit', industry: 'E-Commerce' },
    { metric: '40%', result: 'Reduktion der Absprungrate', industry: 'Professionelle Dienstleistungen' },
  ];

  const relatedServices = isEnglish ? [
    { title: 'Brand Deployment', path: '/en/services/brand-deployment' },
    { title: 'SEO', path: '/en/services/seo' },
    { title: 'AI Implementation', path: '/en/services/ai-implementation' },
  ] : [
    { title: 'Brand Deployment', path: '/services/brand-deployment' },
    { title: 'SEO', path: '/services/seo' },
    { title: 'KI-Implementierung', path: '/services/ki-implementierung' },
  ];

  return (
    <ServiceDetailPage
      icon={Palette}
      title={isEnglish ? 'Design & Development' : 'Design & Entwicklung'}
      subtitle={isEnglish 
        ? 'Beautiful, conversion-optimized websites and digital products that perform.'
        : 'Schöne, conversion-optimierte Websites und digitale Produkte, die performen.'}
      description={isEnglish
        ? 'We don\'t just build websites — we create digital experiences that convert. Our design and development team combines aesthetic excellence with conversion science to build digital products that look stunning and drive real business results. Every project is built with performance, accessibility, and scalability in mind.'
        : 'Wir bauen nicht nur Websites — wir schaffen digitale Erlebnisse, die konvertieren. Unser Design- und Entwicklungsteam kombiniert ästhetische Exzellenz mit Conversion-Wissenschaft, um digitale Produkte zu bauen, die atemberaubend aussehen und echte Geschäftsergebnisse liefern.'}
      features={features}
      benefits={benefits}
      caseStudies={caseStudies}
      relatedServices={relatedServices}
      heroImage={designServiceImg}
    />
  );
}