import { Bot } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ServiceDetailPage } from '@/components/ServiceDetailPage';
import aiServiceImg from '@/assets/ai-service.jpg';

export default function AIImplementationPage() {
  const { isEnglish } = useLanguage();

  const features = isEnglish ? [
    { title: 'AI Chatbots & Virtual Assistants', description: 'Intelligent conversational AI that handles customer inquiries 24/7, qualifies leads, and books appointments automatically.' },
    { title: 'Process Automation', description: 'Streamline repetitive tasks with AI-powered workflows that save hours of manual work every day.' },
    { title: 'Predictive Analytics', description: 'Leverage machine learning to forecast trends, customer behavior, and business outcomes.' },
    { title: 'Custom AI Solutions', description: 'Tailored AI models and integrations designed specifically for your business challenges.' },
    { title: 'AI Content Generation', description: 'Automated content creation for marketing, emails, and customer communications at scale.' },
    { title: 'Intelligent Data Processing', description: 'Extract insights from documents, images, and data using advanced AI recognition.' },
  ] : [
    { title: 'KI-Chatbots & Virtuelle Assistenten', description: 'Intelligente Konversations-KI, die Kundenanfragen 24/7 bearbeitet, Leads qualifiziert und automatisch Termine bucht.' },
    { title: 'Prozessautomatisierung', description: 'Optimieren Sie wiederkehrende Aufgaben mit KI-gestützten Workflows, die täglich Stunden manueller Arbeit sparen.' },
    { title: 'Predictive Analytics', description: 'Nutzen Sie Machine Learning, um Trends, Kundenverhalten und Geschäftsergebnisse vorherzusagen.' },
    { title: 'Individuelle KI-Lösungen', description: 'Massgeschneiderte KI-Modelle und Integrationen, die speziell für Ihre Geschäftsanforderungen entwickelt wurden.' },
    { title: 'KI-Content-Generierung', description: 'Automatisierte Content-Erstellung für Marketing, E-Mails und Kundenkommunikation in grossem Massstab.' },
    { title: 'Intelligente Datenverarbeitung', description: 'Gewinnen Sie Erkenntnisse aus Dokumenten, Bildern und Daten mit fortschrittlicher KI-Erkennung.' },
  ];

  const benefits = isEnglish ? [
    'Reduce operational costs by up to 60%',
    'Handle unlimited customer inquiries simultaneously',
    'Available 24/7, 365 days a year',
    'Consistent quality in every interaction',
    'Scale without adding headcount',
    'Data-driven decision making',
    'Competitive advantage through innovation',
    'Faster response times than competitors',
  ] : [
    'Betriebskosten um bis zu 60% reduzieren',
    'Unbegrenzte Kundenanfragen gleichzeitig bearbeiten',
    '24/7, 365 Tage im Jahr verfügbar',
    'Konstante Qualität bei jeder Interaktion',
    'Skalieren ohne Personalaufbau',
    'Datenbasierte Entscheidungsfindung',
    'Wettbewerbsvorteil durch Innovation',
    'Schnellere Reaktionszeiten als Mitbewerber',
  ];

  const caseStudies = isEnglish ? [
    { metric: '85%', result: 'Reduction in response time', industry: 'E-Commerce' },
    { metric: '3x', result: 'Lead qualification rate', industry: 'Real Estate' },
    { metric: '50%', result: 'Less manual data entry', industry: 'Financial Services' },
  ] : [
    { metric: '85%', result: 'Reduktion der Antwortzeit', industry: 'E-Commerce' },
    { metric: '3x', result: 'Lead-Qualifizierungsrate', industry: 'Immobilien' },
    { metric: '50%', result: 'Weniger manuelle Dateneingabe', industry: 'Finanzdienstleistungen' },
  ];

  const relatedServices = isEnglish ? [
    { title: 'SEO', path: '/en/services/seo' },
    { title: 'Design & Development', path: '/en/services/design-development' },
    { title: 'Social Media', path: '/en/services/social-media' },
  ] : [
    { title: 'SEO', path: '/services/seo' },
    { title: 'Design & Entwicklung', path: '/services/design-entwicklung' },
    { title: 'Social Media', path: '/services/social-media' },
  ];

  return (
    <ServiceDetailPage
      icon={Bot}
      title={isEnglish ? 'AI Implementation' : 'KI-Implementierung'}
      subtitle={isEnglish 
        ? 'Transform your business with intelligent automation and machine learning solutions.'
        : 'Transformieren Sie Ihr Geschäft mit intelligenter Automatisierung und Machine-Learning-Lösungen.'}
      description={isEnglish
        ? 'Our core specialty. We don\'t just consult on AI — we build, deploy, and optimize AI systems that integrate seamlessly with your existing workflows. From customer-facing chatbots to internal process automation, we help you harness the full power of artificial intelligence to gain a competitive edge.'
        : 'Unser Kerngeschäft. Wir beraten nicht nur zu KI — wir bauen, deployen und optimieren KI-Systeme, die sich nahtlos in Ihre bestehenden Workflows integrieren. Von kundenorientierten Chatbots bis zur internen Prozessautomatisierung helfen wir Ihnen, die volle Kraft der künstlichen Intelligenz zu nutzen.'}
      features={features}
      benefits={benefits}
      caseStudies={caseStudies}
      relatedServices={relatedServices}
      isAI
    />
  );
}