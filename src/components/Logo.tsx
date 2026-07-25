import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const sizes = {
  sm: { icon: 'h-8 w-8', text: 'text-lg', dot: 'text-xs' },
  md: { icon: 'h-10 w-10', text: 'text-xl', dot: 'text-sm' },
  lg: { icon: 'h-14 w-14', text: 'text-2xl', dot: 'text-base' },
  xl: { icon: 'h-20 w-20', text: 'text-4xl', dot: 'text-lg' },
};

function DiagnosticMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" className="stroke-primary/30" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="20" className="fill-primary" />
      <path
        d="M14 33V26 M21 33V21 M28 33V16 M35 33V23"
        className="stroke-primary-foreground"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12 36H37"
        className="stroke-primary-foreground"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="35" cy="14" r="2.5" className="fill-primary-foreground" />
    </svg>
  );
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const selected = sizes[size];

  return (
    <div className={cn('group flex items-center gap-3', className)}>
      <div className={cn(selected.icon, 'relative shrink-0')}>
        <DiagnosticMark className="h-full w-full" />
        <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-primary/30 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {showText && (
        <div className="flex items-baseline" aria-label="itsFeierabend.ch">
          <span className={cn(selected.text, 'font-bold tracking-tight text-foreground')}>its</span>
          <span className={cn(selected.text, 'font-bold tracking-tight text-primary')}>Feierabend</span>
          <span className={cn(selected.dot, 'ml-0.5 font-semibold text-muted-foreground')}>.ch</span>
        </div>
      )}
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return <DiagnosticMark className={cn('h-10 w-10', className)} />;
}
