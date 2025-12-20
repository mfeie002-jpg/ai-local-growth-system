import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Play, ChevronDown, Bot, Search, MousePointerClick, Shield, Palette, Rocket, Share2 } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';
import { CTAButton } from './CTAButton';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { t, isEnglish } = useLanguage();
  const location = useLocation();

  const services = isEnglish ? [
    { icon: Bot, label: 'AI Implementation', path: '/en/services/ai-implementation', highlight: true },
    { icon: Search, label: 'SEO', path: '/en/services/seo' },
    { icon: MousePointerClick, label: 'SEA / PPC', path: '/en/services/sea' },
    { icon: Shield, label: 'Reputation Management', path: '/en/services/reputation' },
    { icon: Palette, label: 'Design & Development', path: '/en/services/design-development' },
    { icon: Rocket, label: 'Brand Deployment', path: '/en/services/brand-deployment' },
    { icon: Share2, label: 'Social Media', path: '/en/services/social-media' },
  ] : [
    { icon: Bot, label: 'KI-Implementierung', path: '/services/ki-implementierung', highlight: true },
    { icon: Search, label: 'SEO', path: '/services/seo' },
    { icon: MousePointerClick, label: 'SEA / PPC', path: '/services/sea' },
    { icon: Shield, label: 'Reputation Management', path: '/services/reputation' },
    { icon: Palette, label: 'Design & Entwicklung', path: '/services/design-entwicklung' },
    { icon: Rocket, label: 'Brand Deployment', path: '/services/brand-deployment' },
    { icon: Share2, label: 'Social Media', path: '/services/social-media' },
  ];

  const navLinks = [
    { label: isEnglish ? 'Ultimate Package' : 'Ultimate Package', path: isEnglish ? '/en/ultimate-package' : '/ultimate-package', highlight: true },
    { label: t.nav.audit, path: isEnglish ? '/en/free-audit' : '/gratis-audit' },
    { label: isEnglish ? 'Case Studies' : 'Fallstudien', path: isEnglish ? '/en/case-studies' : '/fallstudien' },
    { label: isEnglish ? 'Investors' : 'Investoren', path: isEnglish ? '/en/investors' : '/investoren' },
    { label: t.nav.pricing, path: isEnglish ? '/en/pricing' : '/pakete' },
    { label: t.nav.faq, path: isEnglish ? '/en/faq' : '/faq' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isServiceActive = services.some(s => location.pathname === s.path);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container-section">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Logo */}
          <Link
            to={isEnglish ? '/en' : '/'}
            className="transition-transform hover:scale-[1.02]"
          >
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className={cn(
                  'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  isServiceActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {isEnglish ? 'Services' : 'Services'}
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  servicesOpen && "rotate-180"
                )} />
              </button>
              
              {/* Dropdown Menu */}
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 py-2 rounded-xl bg-card border border-border shadow-xl z-50 animate-fade-in">
                  {services.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                        isActive(service.path)
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:bg-muted",
                        service.highlight && "border-l-2 border-ai"
                      )}
                    >
                      <service.icon className={cn(
                        "w-4 h-4",
                        service.highlight ? "text-ai" : "text-muted-foreground"
                      )} />
                      <span className={service.highlight ? "font-medium" : ""}>
                        {service.label}
                      </span>
                      {service.highlight && (
                        <span className="ml-auto text-xs bg-ai/10 text-ai px-1.5 py-0.5 rounded">
                          Core
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'highlight' in link && link.highlight
                      ? 'text-ai hover:text-ai hover:bg-ai/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs & Language */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitch />
            <CTAButton
              variant="ghost"
              size="sm"
              href={isEnglish ? '/en/demo' : '/demo'}
              location="header"
            >
              <Play className="w-4 h-4 mr-1" />
              Demo
            </CTAButton>
            <CTAButton
              variant="primary"
              size="sm"
              href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
              location="header"
              className="glow-primary"
            >
              {t.cta.freeAudit}
            </CTAButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            {/* Services Section */}
            <div className="mb-4">
              <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Services
              </p>
              <nav className="flex flex-col gap-1">
                {services.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 text-base rounded-md transition-colors',
                      isActive(service.path)
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground hover:bg-muted',
                      service.highlight && "border-l-2 border-ai ml-2"
                    )}
                  >
                    <service.icon className={cn(
                      "w-5 h-5",
                      service.highlight ? "text-ai" : "text-muted-foreground"
                    )} />
                    {service.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Other Links */}
            <nav className="flex flex-col gap-1 mb-4 border-t border-border pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 text-base font-medium rounded-md transition-colors',
                    isActive(link.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            <div className="flex flex-col gap-3 px-4 pt-4 border-t border-border">
              <div className="flex justify-center mb-2">
                <LanguageSwitch />
              </div>
              <CTAButton
                variant="secondary"
                href={isEnglish ? '/en/demo' : '/demo'}
                location="header-mobile"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Play className="w-4 h-4 mr-1" />
                {isEnglish ? 'Listen to Demo' : 'Demo anhören'}
              </CTAButton>
              <CTAButton
                variant="primary"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location="header-mobile"
                onClick={() => setMobileMenuOpen(false)}
                className="glow-primary"
              >
                {t.cta.freeAudit}
              </CTAButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
