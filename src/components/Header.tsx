import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';
import { CTAButton } from './CTAButton';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';

/**
 * Header — Neural Editorial slim chrome.
 * Nav: Audit · Lösungen (dropdown) · Ultimate Package · Pakete + language switch + CTA.
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const { isEnglish } = useLanguage();
  const location = useLocation();
  const solutionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSolutionsOpen(false);
  }, [location.pathname]);

  // Click-outside for desktop dropdown
  useEffect(() => {
    if (!solutionsOpen) return;
    const onClick = (e: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [solutionsOpen]);

  const auditPath = isEnglish ? '/en/audit' : '/audit';

  const solutions = isEnglish
    ? [
        { label: 'Website Audit', path: '/en/website-audit', desc: 'Speed, tech, indexability' },
        { label: 'SEO Analysis', path: '/en/seo-analysis', desc: 'Rank higher on Google' },
        { label: 'AI Visibility', path: '/en/ai-visibility', desc: 'Be found in ChatGPT & AI search' },
        { label: 'For SMBs', path: '/en/for-smb', desc: 'Growth playbook for Swiss SMEs' },
        { label: 'Partner Program', path: '/en/partner', desc: 'White-label & referrals' },
      ]
    : [
        { label: 'Website-Audit', path: '/website-audit', desc: 'Speed, Technik, Indexierung' },
        { label: 'SEO-Analyse', path: '/seo-analyse', desc: 'Höhere Google-Rankings' },
        { label: 'AI-Visibility', path: '/ai-visibility', desc: 'In ChatGPT & KI-Suche sichtbar' },
        { label: 'Für KMU', path: '/fuer-kmu', desc: 'Growth-Playbook für Schweizer KMU' },
        { label: 'Partner-Programm', path: '/partner', desc: 'White-Label & Empfehlung' },
      ];

  const navLinks = [
    { label: isEnglish ? 'Audit' : 'Audit', path: auditPath },
    { label: isEnglish ? 'Ultimate Package' : 'Ultimate Package', path: isEnglish ? '/en/ultimate-package' : '/ultimate-package' },
    { label: isEnglish ? 'Pricing' : 'Pakete', path: isEnglish ? '/en/pricing' : '/pakete' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isSolutionActive = solutions.some((s) => location.pathname === s.path);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors duration-300',
        scrolled
          ? 'bg-background/85 backdrop-blur-md border-b border-border'
          : 'bg-transparent border-b border-transparent',
      )}
    >
      <div className="container-section">
        <div className="flex h-[var(--header-height)] items-center justify-between gap-6">
          <Link to={isEnglish ? '/en' : '/'} className="shrink-0" aria-label="itsFeierabend home">
            <Logo size="md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Audit */}
            <Link
              to={navLinks[0].path}
              className={cn(
                'relative px-4 py-2 text-sm transition-colors',
                'after:content-[""] after:absolute after:left-4 after:right-4 after:bottom-1 after:h-px after:bg-foreground after:scale-x-0 after:origin-left after:transition-transform after:duration-300',
                isActive(navLinks[0].path)
                  ? 'text-foreground after:scale-x-100'
                  : 'text-foreground/65 hover:text-foreground hover:after:scale-x-100',
              )}
            >
              {navLinks[0].label}
            </Link>

            {/* Lösungen dropdown */}
            <div className="relative" ref={solutionsRef}>
              <button
                type="button"
                onClick={() => setSolutionsOpen((s) => !s)}
                aria-expanded={solutionsOpen}
                aria-haspopup="menu"
                className={cn(
                  'inline-flex items-center gap-1 px-4 py-2 text-sm transition-colors',
                  isSolutionActive || solutionsOpen
                    ? 'text-foreground'
                    : 'text-foreground/65 hover:text-foreground',
                )}
              >
                {isEnglish ? 'Solutions' : 'Lösungen'}
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', solutionsOpen && 'rotate-180')} />
              </button>
              {solutionsOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full mt-2 w-[340px] bg-background border border-border rounded-md shadow-xl overflow-hidden animate-fade-in"
                >
                  {solutions.map((s) => (
                    <Link
                      key={s.path}
                      to={s.path}
                      role="menuitem"
                      className="block px-4 py-3 border-b border-border/60 last:border-b-0 hover:bg-foreground/5 transition-colors"
                    >
                      <div className="text-sm font-medium text-foreground">{s.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Ultimate + Pricing */}
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative px-4 py-2 text-sm transition-colors',
                  'after:content-[""] after:absolute after:left-4 after:right-4 after:bottom-1 after:h-px after:bg-foreground after:scale-x-0 after:origin-left after:transition-transform after:duration-300',
                  isActive(link.path)
                    ? 'text-foreground after:scale-x-100'
                    : 'text-foreground/65 hover:text-foreground hover:after:scale-x-100',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <LanguageSwitch />
            <CTAButton variant="primary" size="sm" href={auditPath} location="header">
              {isEnglish ? 'Free Audit →' : 'Gratis Audit →'}
            </CTAButton>
          </div>

          <button
            className="lg:hidden p-2 -mr-2 text-foreground rounded-md hover:bg-foreground/5"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-1 mt-4">
              <Link
                to={navLinks[0].path}
                className={cn(
                  'px-3 py-3 text-base rounded-md transition-colors',
                  isActive(navLinks[0].path) ? 'text-foreground bg-foreground/5' : 'text-foreground/80 hover:bg-foreground/5',
                )}
              >
                {navLinks[0].label}
              </Link>

              <div className="px-3 pt-3 pb-1">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {isEnglish ? 'Solutions' : 'Lösungen'}
                </div>
              </div>
              {solutions.map((s) => (
                <Link
                  key={s.path}
                  to={s.path}
                  className="px-3 py-2 text-sm rounded-md text-foreground/75 hover:bg-foreground/5"
                >
                  {s.label}
                </Link>
              ))}
              <div className="h-px bg-border my-3 mx-3" />

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-3 py-3 text-base rounded-md transition-colors',
                    isActive(link.path) ? 'text-foreground bg-foreground/5' : 'text-foreground/80 hover:bg-foreground/5',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex justify-start"><LanguageSwitch /></div>
              <CTAButton variant="primary" href={auditPath} location="header-mobile">
                {isEnglish ? 'Free Audit →' : 'Gratis Audit →'}
              </CTAButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
