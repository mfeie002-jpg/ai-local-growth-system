import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', dot: 'text-xs' },
    md: { icon: 'w-10 h-10', text: 'text-xl', dot: 'text-sm' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', dot: 'text-base' },
    xl: { icon: 'w-20 h-20', text: 'text-4xl', dot: 'text-lg' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-3 group', className)}>
      {/* Icon Mark - Bold sunset with AI pulse */}
      <div className={cn(s.icon, 'relative flex-shrink-0')}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer glow ring */}
          <circle
            cx="24"
            cy="24"
            r="22"
            className="stroke-primary/20"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Main circle - gradient feel with solid color */}
          <circle
            cx="24"
            cy="24"
            r="20"
            className="fill-primary"
          />
          
          {/* Horizon line - the "Feierabend" sunset line */}
          <path
            d="M8 26 H40"
            stroke="hsl(0 0% 100% / 0.4)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Setting sun - larger, more prominent */}
          <circle
            cx="24"
            cy="20"
            r="8"
            className="fill-primary-foreground"
          />
          
          {/* Clock hands - representing "Feierabend" (end of work day) */}
          <path
            d="M24 15 L24 20 L28 23"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* AI network dots below horizon */}
          <circle cx="14" cy="34" r="2.5" className="fill-primary-foreground" />
          <circle cx="24" cy="36" r="2.5" className="fill-primary-foreground" />
          <circle cx="34" cy="34" r="2.5" className="fill-primary-foreground" />
          
          {/* Connection lines - representing AI network */}
          <path
            d="M17 28 L14 34 M24 28 L24 36 M31 28 L34 34"
            stroke="hsl(0 0% 100% / 0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M14 34 L24 36 L34 34"
            stroke="hsl(0 0% 100% / 0.3)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Pulse animation ring on hover */}
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-110" />
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
          <span className={cn(s.dot, 'text-muted-foreground ml-0.5 font-semibold')}>
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
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-10 h-10', className)}
    >
      <circle cx="24" cy="24" r="20" className="fill-primary" />
      <path d="M8 26 H40" stroke="hsl(0 0% 100% / 0.4)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="20" r="8" className="fill-primary-foreground" />
      <path d="M24 15 L24 20 L28 23" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="34" r="2.5" className="fill-primary-foreground" />
      <circle cx="24" cy="36" r="2.5" className="fill-primary-foreground" />
      <circle cx="34" cy="34" r="2.5" className="fill-primary-foreground" />
      <path d="M17 28 L14 34 M24 28 L24 36 M31 28 L34 34" stroke="hsl(0 0% 100% / 0.6)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
