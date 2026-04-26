import { Link } from 'react-router-dom';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Logo } from '@/components/Logo';

/**
 * Footer — Neural Editorial. Hairline-bordered, paper canvas, mono labels.
 * No glass / glow / aurora chrome.
 */
export function Footer() {
  const { t, isEnglish } = useLanguage();
  const year = new Date().getFullYear();

  const exploreLinks = [
    { label: t.nav.audit, path: isEnglish ? '/en/free-audit' : '/gratis-audit' },
    { label: isEnglish ? 'Ultimate Package' : 'Ultimate Package', path: isEnglish ? '/en/ultimate-package' : '/ultimate-package' },
    { label: isEnglish ? 'Services' : 'Services', path: isEnglish ? '/en/services/ai-implementation' : '/services/ki-implementierung' },
    { label: isEnglish ? 'Case Studies' : 'Fallstudien', path: isEnglish ? '/en/case-studies' : '/fallstudien' },
    { label: t.nav.pricing, path: isEnglish ? '/en/pricing' : '/pakete' },
    { label: isEnglish ? 'System' : 'System', path: isEnglish ? '/en/system' : '/system' },
  ];

  const referenceLinks = [
    { label: t.nav.faq, path: isEnglish ? '/en/faq' : '/faq' },
    { label: isEnglish ? 'Blog' : 'Blog', path: isEnglish ? '/en/blog' : '/blog' },
    { label: isEnglish ? 'Demo' : 'Demo', path: isEnglish ? '/en/demo' : '/demo' },
    { label: isEnglish ? 'Investors' : 'Investoren', path: isEnglish ? '/en/investors' : '/investoren' },
  ];

  const legalLinks = [
    { label: t.footer.links.imprint, path: isEnglish ? '/en/imprint' : '/impressum' },
    { label: t.footer.links.privacy, path: isEnglish ? '/en/privacy' : '/datenschutz' },
  ];

  return (
    <footer className="relative w-full border-t border-border bg-background">
      <div className="container-section py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          {/* Brand */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <Link to={isEnglish ? '/en' : '/'} className="inline-block mb-6">
              <Logo size="md" />
            </Link>
            <p className="font-editorial text-2xl md:text-3xl leading-snug text-foreground/85 max-w-md">
              {isEnglish
                ? <>Digital growth, <em>orchestrated by AI</em>. Built for Swiss service businesses.</>
                : <>Digitales Wachstum, <em>von KI orchestriert</em>. Für Schweizer Dienstleister.</>}
            </p>

            <div className="mt-8 flex flex-col gap-3 font-mono text-xs">
              <a
                href={`mailto:${t.footer.email}`}
                className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors w-fit"
              >
                <Mail className="w-3.5 h-3.5" />
                {t.footer.email}
              </a>
              <span className="inline-flex items-center gap-2 text-foreground/55">
                <MapPin className="w-3.5 h-3.5" />
                {t.footer.location}
              </span>
            </div>
          </div>

          {/* Explore */}
          <div className="col-span-6 md:col-span-3 lg:col-span-3">
            <div className="section-marker mb-5">Explore</div>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-1.5 text-base text-foreground/75 hover:text-foreground transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reference */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            <div className="section-marker mb-5">Reference</div>
            <ul className="space-y-3">
              {referenceLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-base text-foreground/75 hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-12 md:col-span-12 lg:col-span-2">
            <div className="section-marker mb-5">Legal</div>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-base text-foreground/75 hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom rule + meta */}
        <div className="mt-20 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/55">
            © {year} · itsFeierabend.ch
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/55">
            {isEnglish ? 'Made with AI · Crafted by humans' : 'Mit KI gemacht · von Menschen gestaltet'}
          </p>
        </div>
      </div>
    </footer>
  );
}
