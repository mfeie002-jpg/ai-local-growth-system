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
          {/* Outer glow ring with pulse effect */}
          <circle
            cx="24"
            cy="24"
            r="22"
            className="stroke-primary/30"
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Main circle background */}
          <circle
            cx="24"
            cy="24"
            r="20"
            className="fill-primary"
          />
          
          {/* Neural network nodes - outer ring */}
          <circle cx="24" cy="8" r="2.5" className="fill-primary-foreground" />
          <circle cx="38" cy="18" r="2.5" className="fill-primary-foreground" />
          <circle cx="38" cy="32" r="2.5" className="fill-primary-foreground" />
          <circle cx="24" cy="40" r="2.5" className="fill-primary-foreground" />
          <circle cx="10" cy="32" r="2.5" className="fill-primary-foreground" />
          <circle cx="10" cy="18" r="2.5" className="fill-primary-foreground" />
          
          {/* Central AI brain/core */}
          <circle
            cx="24"
            cy="24"
            r="8"
            className="fill-primary-foreground"
          />
          
          {/* AI brain icon inside */}
          <path
            d="M20 22 Q20 20 22 20 L26 20 Q28 20 28 22 L28 26 Q28 28 26 28 L22 28 Q20 28 20 26 Z"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="22" cy="23" r="1" className="fill-primary" />
          <circle cx="26" cy="23" r="1" className="fill-primary" />
          <path
            d="M22 26 Q24 27.5 26 26"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Neural connection lines from center to outer nodes */}
          <path
            d="M24 16 L24 8"
            stroke="hsl(0 0% 100% / 0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M30 19 L38 18"
            stroke="hsl(0 0% 100% / 0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M30 29 L38 32"
            stroke="hsl(0 0% 100% / 0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M24 32 L24 40"
            stroke="hsl(0 0% 100% / 0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M18 29 L10 32"
            stroke="hsl(0 0% 100% / 0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M18 19 L10 18"
            stroke="hsl(0 0% 100% / 0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Interconnecting outer nodes */}
          <path
            d="M24 8 L38 18 L38 32 L24 40 L10 32 L10 18 Z"
            stroke="hsl(0 0% 100% / 0.2)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
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
      <circle cx="24" cy="8" r="2" className="fill-primary-foreground" />
      <circle cx="38" cy="18" r="2" className="fill-primary-foreground" />
      <circle cx="38" cy="32" r="2" className="fill-primary-foreground" />
      <circle cx="24" cy="40" r="2" className="fill-primary-foreground" />
      <circle cx="10" cy="32" r="2" className="fill-primary-foreground" />
      <circle cx="10" cy="18" r="2" className="fill-primary-foreground" />
      <circle cx="24" cy="24" r="7" className="fill-primary-foreground" />
      <circle cx="22" cy="23" r="1" className="fill-primary" />
      <circle cx="26" cy="23" r="1" className="fill-primary" />
      <path d="M24 16 L24 8 M30 19 L38 18 M30 29 L38 32 M24 32 L24 40 M18 29 L10 32 M18 19 L10 18" stroke="hsl(0 0% 100% / 0.5)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
