import { useLanguage } from '@/i18n/LanguageContext';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { 
  Search, 
  MousePointerClick, 
  Shield, 
  Palette, 
  Rocket, 
  Share2,
  Bot,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  isAI?: boolean;
  delay?: number;
}

function ServiceCard({ icon: Icon, title, description, features, isAI, delay = 0 }: ServiceCardProps) {
  return (
    <div 
      className={cn(
        "service-card group animate-fade-in-up",
        isAI && "border-ai/30 hover:border-ai/60"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* AI Badge */}
      {isAI && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-ai/10 border border-ai/30">
          <Sparkles className="w-3 h-3 text-ai" />
          <span className="text-xs font-medium text-ai">AI-Powered</span>
        </div>
      )}
      
      {/* Icon */}
      <div className={cn(
        "w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110",
        isAI 
          ? "bg-gradient-to-br from-primary/20 to-ai/20 text-ai" 
          : "bg-primary/10 text-primary group-hover:bg-primary/20"
      )}>
        <Icon className="w-7 h-7" />
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-bold mb-3 font-display">{title}</h3>
      <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
      
      {/* Features */}
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              isAI ? "bg-ai" : "bg-primary"
            )} />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServicesSection() {
  const { isEnglish } = useLanguage();

  const services = isEnglish ? [
    {
      icon: Bot,
      title: 'AI Implementation',
      description: 'Our core specialty. We integrate AI into your business processes to maximize efficiency and results.',
      features: ['AI Chatbots & Assistants', 'Process Automation', 'Predictive Analytics', 'Custom AI Solutions'],
      isAI: true,
    },
    {
      icon: Search,
      title: 'SEO',
      description: 'Organic visibility that drives qualified traffic. Rank for keywords that convert.',
      features: ['Technical SEO', 'Content Strategy', 'Local SEO', 'Link Building'],
    },
    {
      icon: MousePointerClick,
      title: 'SEA / PPC',
      description: 'Paid advertising that delivers ROI. Every click is optimized for conversions.',
      features: ['Google Ads', 'Social Ads', 'Retargeting', 'Conversion Tracking'],
    },
    {
      icon: Shield,
      title: 'Reputation Management',
      description: 'Protect and enhance your brand\'s online presence. Build trust at scale.',
      features: ['Review Management', 'Crisis Response', 'Brand Monitoring', 'PR Strategy'],
    },
    {
      icon: Palette,
      title: 'Design & Development',
      description: 'Beautiful, conversion-optimized websites and digital products that perform.',
      features: ['Web Design', 'UX/UI Design', 'Development', 'Landing Pages'],
    },
    {
      icon: Rocket,
      title: 'Brand Deployment',
      description: 'Launch your brand across all channels with consistency and impact.',
      features: ['Brand Strategy', 'Visual Identity', 'Brand Guidelines', 'Multi-Channel Launch'],
    },
    {
      icon: Share2,
      title: 'Social Media',
      description: 'Build community and drive engagement with strategic social presence.',
      features: ['Content Creation', 'Community Management', 'Influencer Marketing', 'Analytics'],
    },
  ] : [
    {
      icon: Bot,
      title: 'AI-Implementierung',
      description: 'Unser Kerngeschäft. Wir integrieren KI in Ihre Geschäftsprozesse für maximale Effizienz und Ergebnisse.',
      features: ['KI-Chatbots & Assistenten', 'Prozessautomatisierung', 'Predictive Analytics', 'Individuelle KI-Lösungen'],
      isAI: true,
    },
    {
      icon: Search,
      title: 'SEO',
      description: 'Organische Sichtbarkeit, die qualifizierten Traffic bringt. Rankings für Keywords, die konvertieren.',
      features: ['Technisches SEO', 'Content-Strategie', 'Local SEO', 'Linkbuilding'],
    },
    {
      icon: MousePointerClick,
      title: 'SEA / PPC',
      description: 'Bezahlte Werbung mit ROI. Jeder Klick ist auf Conversions optimiert.',
      features: ['Google Ads', 'Social Ads', 'Retargeting', 'Conversion Tracking'],
    },
    {
      icon: Shield,
      title: 'Reputation Management',
      description: 'Schützen und verbessern Sie Ihre Online-Präsenz. Vertrauen skalierbar aufbauen.',
      features: ['Bewertungsmanagement', 'Krisenreaktion', 'Brand Monitoring', 'PR-Strategie'],
    },
    {
      icon: Palette,
      title: 'Design & Entwicklung',
      description: 'Schöne, conversion-optimierte Websites und digitale Produkte, die performen.',
      features: ['Webdesign', 'UX/UI Design', 'Entwicklung', 'Landing Pages'],
    },
    {
      icon: Rocket,
      title: 'Brand Deployment',
      description: 'Lancieren Sie Ihre Marke konsistent und wirkungsvoll über alle Kanäle.',
      features: ['Markenstrategie', 'Visuelle Identität', 'Brand Guidelines', 'Multi-Channel Launch'],
    },
    {
      icon: Share2,
      title: 'Social Media',
      description: 'Community aufbauen und Engagement steigern mit strategischer sozialer Präsenz.',
      features: ['Content-Erstellung', 'Community Management', 'Influencer Marketing', 'Analytics'],
    },
  ];

  return (
    <SectionContainer id="services" background="muted" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-ai/5 rounded-full blur-3xl" />
      
      <div className="relative">
        <SectionHeader 
          title={isEnglish ? 'Full-Service Digital Excellence' : 'Full-Service Digital Excellence'}
          subtitle={isEnglish 
            ? 'Everything you need to dominate digital — powered by AI innovation.'
            : 'Alles, was Sie brauchen, um digital zu dominieren — powered by KI-Innovation.'}
        />
        
        {/* AI Focus Banner */}
        <div className="max-w-3xl mx-auto mb-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-ai/10 to-accent/10 border border-ai/20 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-ai/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-ai" />
            </div>
            <div>
              <h4 className="font-bold font-display text-lg mb-1">
                {isEnglish ? 'AI-First Approach' : 'AI-First Ansatz'}
              </h4>
              <p className="text-muted-foreground text-sm">
                {isEnglish 
                  ? 'We don\'t just offer AI as an add-on. Every service we deliver is enhanced by intelligent automation and machine learning.'
                  : 'Wir bieten KI nicht nur als Add-on an. Jeder Service wird durch intelligente Automatisierung und Machine Learning verstärkt.'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              {...service} 
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}