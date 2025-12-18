import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { trackCTAClick } from '@/lib/analytics';
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
}

export function CTAButton({
  variant = 'primary',
  size = 'default',
  href,
  onClick,
  children,
  className,
  location: ctaLocation = 'unknown',
  external = false,
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
    onClick?.();
  };

  const baseStyles = cn(
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
      // Sizes
      'px-4 py-2 text-sm rounded-md': size === 'sm',
      'px-6 py-3 text-base rounded-lg': size === 'default',
      'px-8 py-4 text-lg rounded-lg': size === 'lg',
      // Variants
      'bg-primary text-primary-foreground hover:bg-primary-hover shadow-button': variant === 'primary',
      'bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background': variant === 'secondary',
      'bg-transparent text-foreground hover:bg-muted': variant === 'ghost',
    },
    className
  );

  if (href) {
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
    <button onClick={handleClick} className={baseStyles}>
      {children}
    </button>
  );
}
