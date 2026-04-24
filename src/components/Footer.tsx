import { Link } from 'react-router-dom';
import { MapPin, Mail, ArrowUpRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Logo } from '@/components/Logo';
import { CTAButton } from '@/components/CTAButton';

export function Footer() {
  const { t, isEnglish } = useLanguage();
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { label: t.footer.links.imprint, path: isEnglish ? '/en/imprint' : '/impressum' },
    { label: t.footer.links.privacy, path: isEnglish ? '/en/privacy' : '/datenschutz' },
    { label: t.footer.links.faq, path: isEnglish ? '/en/faq' : '/faq' },
  ];

  const quickLinks = [
    { label: t.nav.system, path: isEnglish ? '/en/system' : '/system' },
    { label: t.nav.audit, path: isEnglish ? '/en/free-audit' : '/gratis-audit' },
    { label: isEnglish ? 'Investors & Partners' : 'Investoren & Partner', path: isEnglish ? '/en/investors' : '/investoren' },
    { label: t.nav.pricing, path: isEnglish ? '/en/pricing' : '/pakete' },
  ];

  return (
    <footer className="relative w-full overflow-hidden border-t border-border/40 bg-background noise-overlay">
      {/* Aurora background accents */}
      <div className="absolute inset-0 grid-pattern opacity-[0.08]" />
      <div className="absolute -top-40 left-1/4 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-25"
           style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)' }} />
      <div className="absolute -bottom-40 right-1/4 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-20"
           style={{ background: 'radial-gradient(circle, hsl(var(--ai-accent) / 0.4), transparent 70%)' }} />

      <div className="relative">
        {/* CTA Strip — editorial statement + CTA */}
        <div className="container-section py-20 md:py-28 border-b border-border/30">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-panel">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  {isEnglish ? 'Ready to start?' : 'Bereit loszulegen?'}
                </span>
              </div>
              <h2 className="font-editorial font-light text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
                {isEnglish ? (
                  <>Let's build your <span className="italic text-aurora">growth engine</span>.</>
                ) : (
                  <>Lass uns deine <span className="italic text-aurora">Wachstums-Engine</span> bauen.</>
                )}
              </h2>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <CTAButton
                variant="primary"
                size="lg"
                href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                location="footer"
                className="text-lg px-8 py-4 shadow-glow-intense hover:-translate-y-0.5 transition-all"
              >
                {isEnglish ? 'Start Free Audit' : 'Gratis Audit starten'}
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </CTAButton>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="container-section py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Brand — wide */}
            <div className="sm:col-span-2 lg:col-span-5">
              <Link to={isEnglish ? '/en' : '/'} className="inline-block mb-6">
                <Logo size="md" />
              </Link>
              <p className="text-base text-muted-foreground leading-relaxed max-w-md mb-6">
                {t.siteDescription}
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${t.footer.email}`}
                  className="group inline-flex items-center gap-2.5 text-sm text-foreground/80 hover:text-aurora transition-colors w-fit"
                >
                  <div className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center group-hover:shadow-glow transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  {t.footer.email}
                </a>
                <div className="inline-flex items-center gap-2.5 text-sm text-muted-foreground w-fit">
                  <div className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  {t.footer.location}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-4 lg:col-start-7">
              <h4 className="font-editorial font-semibold text-lg mb-5 tracking-tight">
                {isEnglish ? 'Explore' : 'Entdecken'}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-1.5 text-base text-foreground/75 hover:text-aurora transition-all"
                    >
                      {link.label}
                      <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="lg:col-span-3">
              <h4 className="font-editorial font-semibold text-lg mb-5 tracking-tight">
                {isEnglish ? 'Legal' : 'Rechtliches'}
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-base text-foreground/75 hover:text-aurora transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="container-section py-6 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {t.footer.copyright.replace('{year}', currentYear.toString())}
            </p>
            <p className="text-xs text-muted-foreground/70 uppercase tracking-[0.2em]">
              {isEnglish ? 'Made with AI · Crafted by humans' : 'Gemacht mit KI · gestaltet von Menschen'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
