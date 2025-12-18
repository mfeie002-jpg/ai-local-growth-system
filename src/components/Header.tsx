import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Play } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';
import { CTAButton } from './CTAButton';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isEnglish } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { label: t.nav.system, path: isEnglish ? '/en/system' : '/system' },
    { label: t.nav.audit, path: isEnglish ? '/en/free-audit' : '/gratis-audit' },
    { label: t.nav.pricing, path: isEnglish ? '/en/pricing' : '/pakete' },
    { label: t.nav.faq, path: isEnglish ? '/en/faq' : '/faq' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-section">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Logo */}
          <Link
            to={isEnglish ? '/en' : '/'}
            className="flex items-center gap-2 font-bold text-lg sm:text-xl text-foreground hover:text-primary transition-colors"
          >
            <span className="text-primary">its</span>
            <span>Feierabend</span>
            <span className="text-primary">.ch</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive(link.path)
                    ? 'text-primary bg-accent'
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
              {isEnglish ? 'Demo' : 'Demo'}
            </CTAButton>
            <CTAButton
              variant="primary"
              size="sm"
              href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
              location="header"
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
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 text-base font-medium rounded-md transition-colors',
                    isActive(link.path)
                      ? 'text-primary bg-accent'
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
