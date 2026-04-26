import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';
import { CTAButton } from './CTAButton';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';

/**
 * Header — Neural Editorial slim chrome.
 * 4 nav items + language switch + single CTA. No mega-menu.
 * Sits on a hairline rule when scrolled.
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isEnglish } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const auditPath = isEnglish ? '/en/free-audit' : '/gratis-audit';

  const navLinks = [
    {
      label: isEnglish ? 'Audit' : 'Audit',
      path: auditPath,
    },
    {
      label: isEnglish ? 'Ultimate Package' : 'Ultimate Package',
      path: isEnglish ? '/en/ultimate-package' : '/ultimate-package',
    },
    {
      label: isEnglish ? 'Services' : 'Services',
      // Service hub doesn't exist yet — link to AI Implementation as the anchor service.
      path: isEnglish ? '/en/services/ai-implementation' : '/services/ki-implementierung',
    },
    {
      label: isEnglish ? 'Pricing' : 'Pakete',
      path: isEnglish ? '/en/pricing' : '/pakete',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors duration-300',
        scrolled
          ? 'bg-background/85 backdrop-blur-md border-b border-border'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="container-section">
        <div className="flex h-[var(--header-height)] items-center justify-between gap-6">
          {/* Logo */}
          <Link
            to={isEnglish ? '/en' : '/'}
            className="shrink-0"
            aria-label="itsFeierabend home"
          >
            <Logo size="md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative px-4 py-2 text-sm transition-colors',
                  'after:content-[""] after:absolute after:left-4 after:right-4 after:bottom-1 after:h-px after:bg-foreground after:scale-x-0 after:origin-left after:transition-transform after:duration-300',
                  isActive(link.path)
                    ? 'text-foreground after:scale-x-100'
                    : 'text-foreground/65 hover:text-foreground hover:after:scale-x-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <LanguageSwitch />
            <CTAButton
              variant="primary"
              size="sm"
              href={auditPath}
              location="header"
            >
              {isEnglish ? 'Free Audit →' : 'Gratis Audit →'}
            </CTAButton>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 -mr-2 text-foreground rounded-md hover:bg-foreground/5"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-1 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-3 py-3 text-base rounded-md transition-colors',
                    isActive(link.path)
                      ? 'text-foreground bg-foreground/5'
                      : 'text-foreground/80 hover:bg-foreground/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex justify-start"><LanguageSwitch /></div>
              <CTAButton
                variant="primary"
                href={auditPath}
                location="header-mobile"
              >
                {isEnglish ? 'Free Audit →' : 'Gratis Audit →'}
              </CTAButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
