import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Play, ChevronDown, Bot, Search, MousePointerClick, Shield, Palette, Rocket, Share2, Sparkles, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';
import { CTAButton } from './CTAButton';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, isEnglish } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const services = isEnglish ? [
    { icon: Bot, label: 'AI Implementation', desc: 'Voice agents, scanners, autonomous funnels.', path: '/en/services/ai-implementation', highlight: true },
    { icon: Search, label: 'SEO', desc: 'Local rankings & evergreen organic traffic.', path: '/en/services/seo' },
    { icon: MousePointerClick, label: 'SEA / PPC', desc: 'Performance ads with measurable ROAS.', path: '/en/services/sea' },
    { icon: Shield, label: 'Reputation Management', desc: 'Reviews, response systems, trust capital.', path: '/en/services/reputation' },
    { icon: Palette, label: 'Design & Development', desc: 'Sites that convert by construction.', path: '/en/services/design-development' },
    { icon: Rocket, label: 'Brand Deployment', desc: 'Launch identity systems at speed.', path: '/en/services/brand-deployment' },
    { icon: Share2, label: 'Social Media', desc: 'Channels with editorial discipline.', path: '/en/services/social-media' },
  ] : [
    { icon: Bot, label: 'KI-Implementierung', desc: 'Voice-Agents, Scanner, autonome Funnels.', path: '/services/ki-implementierung', highlight: true },
    { icon: Search, label: 'SEO', desc: 'Lokale Rankings & nachhaltiger Traffic.', path: '/services/seo' },
    { icon: MousePointerClick, label: 'SEA / PPC', desc: 'Performance-Ads mit messbarem ROAS.', path: '/services/sea' },
    { icon: Shield, label: 'Reputation Management', desc: 'Bewertungen, Antwortsysteme, Vertrauen.', path: '/services/reputation' },
    { icon: Palette, label: 'Design & Entwicklung', desc: 'Websites, die per Konstruktion konvertieren.', path: '/services/design-entwicklung' },
    { icon: Rocket, label: 'Brand Deployment', desc: 'Identitätssysteme schnell ausgerollt.', path: '/services/brand-deployment' },
    { icon: Share2, label: 'Social Media', desc: 'Kanäle mit redaktioneller Disziplin.', path: '/services/social-media' },
  ];

  const aiService = services.find(s => s.highlight)!;
  const otherServices = services.filter(s => !s.highlight);

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
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-500',
        scrolled
          ? 'border-b border-white/[0.06] bg-background/70 backdrop-blur-2xl shadow-[0_8px_30px_-12px_hsl(225_50%_2%_/_0.6)]'
          : 'border-b border-transparent bg-background/30 backdrop-blur-xl'
      )}
    >
      {/* Top accent line — aurora gradient */}
      <div
        aria-hidden
        className={cn(
          'h-px w-full bg-gradient-aurora opacity-0 transition-opacity duration-500 animate-aurora',
          scrolled && 'opacity-60'
        )}
      />

      <div className="container-section">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to={isEnglish ? '/en' : '/'}
            className="transition-transform hover:scale-[1.02] shrink-0"
            aria-label="itsFeierabend home"
          >
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {/* Services Mega-Menu */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-full transition-all',
                  isServiceActive || servicesOpen
                    ? 'text-foreground bg-white/[0.06]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                )}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                {isEnglish ? 'Services' : 'Services'}
                <ChevronDown className={cn(
                  'w-3.5 h-3.5 transition-transform duration-300',
                  servicesOpen && 'rotate-180'
                )} />
              </button>

              {/* Mega-Menu Panel */}
              {servicesOpen && (
                <div className="mega-menu-panel w-[760px] p-3 animate-fade-in">
                  {/* invisible bridge so hover doesn't drop */}
                  <div aria-hidden className="absolute -top-3 left-0 right-0 h-3" />

                  <div className="grid grid-cols-5 gap-3">
                    {/* Anchor card — AI Implementation */}
                    <Link
                      to={aiService.path}
                      className="col-span-2 relative overflow-hidden rounded-2xl border-aurora p-5 group"
                      style={{
                        background:
                          'linear-gradient(135deg, hsl(217 91% 60% / 0.18) 0%, hsl(270 70% 60% / 0.14) 50%, hsl(190 90% 50% / 0.10) 100%)',
                      }}
                    >
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-background/40 backdrop-blur-sm flex items-center justify-center border border-white/[0.08]">
                            <Sparkles className="w-5 h-5 text-ai" />
                          </div>
                          <span className="text-[10px] uppercase tracking-[0.18em] text-ai font-semibold">
                            Core Service
                          </span>
                        </div>
                        <h3 className="text-lg font-display font-bold text-foreground mb-1.5 leading-tight">
                          {aiService.label}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {aiService.desc}
                        </p>
                        <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-ai transition-colors">
                          {isEnglish ? 'Explore' : 'Entdecken'}
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                      {/* glow blob */}
                      <div
                        aria-hidden
                        className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full opacity-50 blur-3xl"
                        style={{ background: 'hsl(270 70% 60% / 0.5)' }}
                      />
                    </Link>

                    {/* Other services — 3 cols */}
                    <div className="col-span-3 grid grid-cols-2 gap-1">
                      {otherServices.map((service) => (
                        <Link
                          key={service.path}
                          to={service.path}
                          className={cn(
                            'group flex items-start gap-3 p-3 rounded-xl transition-all',
                            isActive(service.path)
                              ? 'bg-white/[0.06]'
                              : 'hover:bg-white/[0.04]'
                          )}
                        >
                          <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 border border-white/[0.05] group-hover:border-primary/30 transition-colors">
                            <service.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-foreground leading-tight">
                              {service.label}
                            </div>
                            <div className="text-xs text-muted-foreground/80 mt-0.5 leading-snug line-clamp-2">
                              {service.desc}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-3.5 py-2 text-sm font-medium rounded-full transition-all',
                  isActive(link.path)
                    ? 'text-foreground bg-white/[0.06]'
                    : 'highlight' in link && link.highlight
                      ? 'text-ai hover:bg-ai/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs & Language */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
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
              className="shadow-glow-intense"
            >
              {t.cta.freeAudit}
            </CTAButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground rounded-lg hover:bg-white/[0.06] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/[0.06] animate-fade-in">
            {/* AI anchor on mobile */}
            <Link
              to={aiService.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block mb-4 p-4 rounded-2xl border-aurora relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, hsl(217 91% 60% / 0.18) 0%, hsl(270 70% 60% / 0.14) 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-1">
                <Sparkles className="w-5 h-5 text-ai" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-ai font-semibold">
                  Core Service
                </span>
              </div>
              <div className="font-display font-bold text-foreground">{aiService.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{aiService.desc}</div>
            </Link>

            {/* Other services */}
            <div className="mb-4">
              <p className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.18em] mb-2">
                Services
              </p>
              <nav className="flex flex-col gap-0.5">
                {otherServices.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-base rounded-xl transition-colors',
                      isActive(service.path)
                        ? 'text-foreground bg-white/[0.06]'
                        : 'text-foreground/90 hover:bg-white/[0.04]'
                    )}
                  >
                    <service.icon className="w-5 h-5 text-muted-foreground" />
                    {service.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Other Links */}
            <nav className="flex flex-col gap-0.5 mb-4 border-t border-white/[0.06] pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-3 py-3 text-base font-medium rounded-xl transition-colors',
                    isActive(link.path)
                      ? 'text-foreground bg-white/[0.06]'
                      : 'text-foreground/90 hover:bg-white/[0.04]'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 px-2 pt-4 border-t border-white/[0.06]">
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
                className="shadow-glow-intense"
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
