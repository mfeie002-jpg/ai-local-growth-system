import { Link } from 'react-router-dom';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Logo } from '@/components/Logo';
import { siteConfig } from '@/config/site';

/**
 * Footer — Neural Editorial. Hairline-bordered, paper canvas, mono labels.
 * No glass / glow / aurora chrome.
 */
export function Footer() {
  const { t, isEnglish } = useLanguage();
  const year = new Date().getFullYear();

  const exploreLinks = [
    { label: isEnglish ? 'AI Business Audit' : 'AI Business Audit', path: isEnglish ? '/en/ai-business-audit' : '/ai-business-audit' },
    { label: isEnglish ? 'Website Audit' : 'Website Audit', path: isEnglish ? '/en/website-audit' : '/website-audit' },
    { label: isEnglish ? 'SEO Analysis' : 'SEO-Analyse', path: isEnglish ? '/en/seo-analysis' : '/seo-analyse' },
    { label: 'AI Visibility', path: isEnglish ? '/en/ai-visibility' : '/ai-visibility' },
    { label: isEnglish ? 'Automation' : 'Automatisierung', path: isEnglish ? '/en/automation' : '/automation' },
    { label: isEnglish ? 'Services' : 'Leistungen', path: isEnglish ? '/en/services' : '/leistungen' },
    { label: isEnglish ? 'Case Studies' : 'Fallstudien', path: isEnglish ? '/en/case-studies' : '/fallstudien' },
  ];

  const referenceLinks = [
    { label: isEnglish ? 'For SMEs' : 'Für KMU', path: isEnglish ? '/en/for-smes' : '/fuer-kmu' },
    { label: isEnglish ? 'Partners' : 'Partner', path: isEnglish ? '/en/partners' : '/partner' },
    { label: isEnglish ? 'Insights' : 'Insights', path: isEnglish ? '/en/insights' : '/insights' },
    { label: isEnglish ? 'About' : 'Über uns', path: isEnglish ? '/en/about' : '/ueber-uns' },
    { label: isEnglish ? 'Contact' : 'Kontakt', path: isEnglish ? '/en/contact' : '/kontakt' },
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
                ? <>AI Business Audits and <em>growth intelligence</em> for Swiss SMEs.</>
                : <>AI Business Audits und <em>Growth Intelligence</em> für Schweizer KMU.</>}
            </p>

            <div className="mt-8 flex flex-col gap-3 font-mono text-xs">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors w-fit"
              >
                <Mail className="w-3.5 h-3.5" />
                {siteConfig.email}
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
                    className="group inline-flex min-h-11 items-center gap-1.5 text-base text-foreground/75 transition-colors hover:text-foreground"
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
                  <Link to={link.path} className="inline-flex min-h-11 items-center text-base text-foreground/75 transition-colors hover:text-foreground">
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
                  <Link to={link.path} className="inline-flex min-h-11 items-center text-base text-foreground/75 transition-colors hover:text-foreground">
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
            {isEnglish ? 'Measured by rules · interpreted with AI' : 'Regelbasiert gemessen · mit KI interpretiert'}
          </p>
        </div>
      </div>
    </footer>
  );
}
