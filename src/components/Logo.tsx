import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-7 h-7', text: 'text-base', dot: 'text-[10px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', dot: 'text-xs' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', dot: 'text-sm' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-2 group', className)}>
      {/* Icon Mark - Sunset/Clock hybrid representing "Feierabend" */}
      <div className={cn(s.icon, 'relative flex-shrink-0')}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background circle */}
          <circle
            cx="20"
            cy="20"
            r="18"
            className="fill-primary"
          />
          
          {/* Horizon line */}
          <path
            d="M6 22 H34"
            stroke="hsl(0 0% 100% / 0.3)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Setting sun / AI node */}
          <circle
            cx="20"
            cy="18"
            r="6"
            className="fill-primary-foreground"
          />
          
          {/* Clock hands suggesting time / AI connection lines */}
          <path
            d="M20 15 L20 18 L22 20"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Rays / connection nodes */}
          <circle cx="10" cy="28" r="2" className="fill-primary-foreground/80" />
          <circle cx="20" cy="30" r="2" className="fill-primary-foreground/80" />
          <circle cx="30" cy="28" r="2" className="fill-primary-foreground/80" />
          
          {/* Connection lines to nodes */}
          <path
            d="M15 22 L10 28 M20 24 L20 30 M25 22 L30 28"
            stroke="hsl(0 0% 100% / 0.5)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      </div>

      {/* Wordmark */}
      {showText && (
        <div className="flex items-baseline">
          <span className={cn(s.text, 'font-bold text-foreground tracking-tight')}>
            its
          </span>
          <span className={cn(s.text, 'font-bold text-primary tracking-tight')}>
            Feierabend
          </span>
          <span className={cn(s.dot, 'text-muted-foreground ml-0.5 font-medium')}>
            .ch
          </span>
        </div>
      )}
    </div>
  );
}

// Alternative minimal version for favicon/small contexts
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-8 h-8', className)}
    >
      <circle cx="20" cy="20" r="18" className="fill-primary" />
      <path d="M6 22 H34" stroke="hsl(0 0% 100% / 0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="18" r="6" className="fill-primary-foreground" />
      <path d="M20 15 L20 18 L22 20" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="28" r="2" className="fill-primary-foreground/80" />
      <circle cx="20" cy="30" r="2" className="fill-primary-foreground/80" />
      <circle cx="30" cy="28" r="2" className="fill-primary-foreground/80" />
      <path d="M15 22 L10 28 M20 24 L20 30 M25 22 L30 28" stroke="hsl(0 0% 100% / 0.5)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
