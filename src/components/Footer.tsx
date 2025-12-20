import { Link } from 'react-router-dom';
import { MapPin, Mail } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Logo } from '@/components/Logo';

export function Footer() {
  const { t, isEnglish } = useLanguage();
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { label: t.footer.links.imprint, path: isEnglish ? '/en/imprint' : '/impressum' },
    { label: t.footer.links.privacy, path: isEnglish ? '/en/privacy' : '/datenschutz' },
    { label: t.footer.links.faq, path: isEnglish ? '/en/faq' : '/faq' },
  ];

  return (
    <footer className="w-full border-t border-border bg-muted/30">
      <div className="container-section py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to={isEnglish ? '/en' : '/'} className="inline-block mb-4">
              <Logo size="md" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.siteDescription}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${t.footer.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {t.footer.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {t.footer.location}
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Links</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.nav.system}</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to={isEnglish ? '/en/system' : '/system'}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.nav.system}
                </Link>
              </li>
              <li>
                <Link
                  to={isEnglish ? '/en/free-audit' : '/gratis-audit'}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.nav.audit}
                </Link>
              </li>
              <li>
                <Link
                  to={isEnglish ? '/en/investors' : '/investoren'}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isEnglish ? 'Investors & Partners' : 'Investoren & Partner'}
                </Link>
              </li>
              <li>
                <Link
                  to={isEnglish ? '/en/pricing' : '/pakete'}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.nav.pricing}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            {t.footer.copyright.replace('{year}', currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
}
