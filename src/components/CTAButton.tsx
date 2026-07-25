import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { trackCTAClick } from '@/lib/analytics';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface CTAButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'lg' | 'sm';
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  location?: string;
  external?: boolean;
  disabled?: boolean;
}

/**
 * CTAButton — Neural Editorial buttons.
 * Primary  = solid ink primary on bone, hairline shadow.
 * Secondary = bone with ink hairline border, inverts on hover.
 * Ghost    = no chrome, mono-style underline on hover.
 */
export function CTAButton({
  variant = 'primary',
  size = 'default',
  href,
  onClick,
  children,
  className,
  location: ctaLocation = 'unknown',
  external = false,
  disabled = false,
}: CTAButtonProps) {
  const { language } = useLanguage();
  const pageLocation = useLocation();

  const handleClick = () => {
    trackCTAClick({
      language,
      page_path: pageLocation.pathname,
      cta_text: typeof children === 'string' ? children : 'CTA',
      cta_location: ctaLocation,
    });
    if (href?.includes('/kontakt') || href?.includes('/contact')) {
      track('consultation_cta_click', {
        page_path: pageLocation.pathname,
        cta_location: ctaLocation,
      });
    }
    if (
      ctaLocation.includes('pricing') ||
      ctaLocation.includes('offer') ||
      href?.includes('/preise') ||
      href?.includes('/pricing')
    ) {
      track('pricing_cta_click', {
        page_path: pageLocation.pathname,
        cta_location: ctaLocation,
      });
    }
    onClick?.();
  };

  const baseStyles = cn(
    'inline-flex min-h-11 items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 rounded-full',
    {
      'px-4 py-2 text-xs tracking-wide': size === 'sm',
      'px-6 py-3 text-sm tracking-wide': size === 'default',
      'px-8 py-4 text-base tracking-wide': size === 'lg',
      'bg-foreground text-background hover:bg-foreground/90 shadow-button':
        variant === 'primary',
      'bg-transparent border border-foreground/40 text-foreground hover:border-foreground hover:bg-foreground hover:text-background':
        variant === 'secondary',
      'bg-transparent text-foreground hover:bg-foreground/5':
        variant === 'ghost',
    },
    className
  );

  if (href) {
    // In-page hash anchor → native <a> so browser handles scroll
    if (href.startsWith('#')) {
      return (
        <a href={href} onClick={handleClick} className={baseStyles}>
          {children}
        </a>
      );
    }
    if (external) {
      return (
        <a
          href={href}
          onClick={handleClick}
          className={baseStyles}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link to={href} onClick={handleClick} className={baseStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={handleClick} className={baseStyles} disabled={disabled}>
      {children}
    </button>
  );
}
