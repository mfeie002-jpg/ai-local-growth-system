import { Rocket } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ServiceDetailPage } from '@/components/ServiceDetailPage';
import brandServiceImg from '@/assets/services/brand-service.jpg';

export default function BrandDeploymentPage() {
  const { isEnglish } = useLanguage();

  const features = isEnglish ? [
    { title: 'Brand Strategy', description: 'Define your positioning, voice, and unique value proposition that resonates with your audience.' },
    { title: 'Visual Identity', description: 'Logo, colors, typography, and design system that represents your brand consistently.' },
    { title: 'Brand Guidelines', description: 'Comprehensive documentation ensuring brand consistency across all touchpoints.' },
    { title: 'Multi-Channel Launch', description: 'Coordinated brand deployment across website, social, email, and advertising.' },
    { title: 'Messaging Framework', description: 'Clear, compelling messaging that communicates your value at every stage.' },
    { title: 'Brand Assets', description: 'Complete library of templates, graphics, and materials for your team.' },
  ] : [
    { title: 'Markenstrategie', description: 'Definieren Sie Ihre Positionierung, Stimme und einzigartiges Wertversprechen.' },
    { title: 'Visuelle Identität', description: 'Logo, Farben, Typografie und Designsystem, das Ihre Marke konsistent repräsentiert.' },
    { title: 'Markenrichtlinien', description: 'Umfassende Dokumentation für Markenkonsistenz über alle Touchpoints.' },
    { title: 'Multi-Channel Launch', description: 'Koordinierte Markeneinführung über Website, Social, E-Mail und Werbung.' },
    { title: 'Messaging Framework', description: 'Klare, überzeugende Botschaften, die Ihren Wert in jeder Phase kommunizieren.' },
    { title: 'Marken-Assets', description: 'Komplette Bibliothek von Vorlagen, Grafiken und Materialien für Ihr Team.' },
  ];

  const benefits = isEnglish ? [
    'Consistent brand experience everywhere',
    'Higher brand recognition and recall',
    'Faster marketing execution',
    'Reduced design and approval time',
    'Professional appearance from day one',
    'Clear differentiation from competitors',
  ] : [
    'Konsistentes Markenerlebnis überall',
    'Höhere Markenwiedererkennung',
    'Schnellere Marketing-Ausführung',
    'Reduzierte Design- und Genehmigungszeit',
    'Professionelles Erscheinungsbild ab Tag eins',
    'Klare Differenzierung von Mitbewerbern',
  ];

  const caseStudies = isEnglish ? [
    { metric: '3 weeks', result: 'Full brand launch', industry: 'Tech Startup' },
    { metric: '+65%', result: 'Brand awareness increase', industry: 'Consumer Goods' },
    { metric: '100%', result: 'Team adoption rate', industry: 'Enterprise' },
  ] : [
    { metric: '3 Wochen', result: 'Vollständiger Markenlaunch', industry: 'Tech Startup' },
    { metric: '+65%', result: 'Steigerung der Markenbekanntheit', industry: 'Konsumgüter' },
    { metric: '100%', result: 'Team-Adoptionsrate', industry: 'Enterprise' },
  ];

  const relatedServices = isEnglish ? [
    { title: 'Design & Development', path: '/en/services/design-development' },
    { title: 'Social Media', path: '/en/services/social-media' },
    { title: 'Reputation Management', path: '/en/services/reputation' },
  ] : [
    { title: 'Design & Entwicklung', path: '/services/design-entwicklung' },
    { title: 'Social Media', path: '/services/social-media' },
    { title: 'Reputation Management', path: '/services/reputation' },
  ];

  return (
    <ServiceDetailPage
      icon={Rocket}
      title="Brand Deployment"
      subtitle={isEnglish 
        ? 'Launch your brand across all channels with consistency and impact.'
        : 'Lancieren Sie Ihre Marke konsistent und wirkungsvoll über alle Kanäle.'}
      description={isEnglish
        ? 'A strong brand is more than a logo — it\'s the complete experience people have with your company. We help you define, design, and deploy a brand that resonates with your audience and stands out in the market. From strategy to execution, we ensure your brand makes a lasting impression at every touchpoint.'
        : 'Eine starke Marke ist mehr als ein Logo — es ist das komplette Erlebnis, das Menschen mit Ihrem Unternehmen haben. Wir helfen Ihnen, eine Marke zu definieren, zu gestalten und einzuführen, die bei Ihrer Zielgruppe ankommt und sich im Markt abhebt. Von der Strategie bis zur Umsetzung stellen wir sicher, dass Ihre Marke einen bleibenden Eindruck hinterlässt.'}
      features={features}
      benefits={benefits}
      caseStudies={caseStudies}
      relatedServices={relatedServices}
      heroImage={brandServiceImg}
    />
  );
}