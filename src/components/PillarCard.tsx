import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PillarCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function PillarCard({ icon: Icon, title, description, className }: PillarCardProps) {
  return (
    <div
      className={cn(
        'group relative p-6 sm:p-8 rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20',
        className
      )}
    >
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{description}</p>
    </div>
  );
}

interface AutomationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function AutomationCard({ icon: Icon, title, description, className }: AutomationCardProps) {
  return (
    <div
      className={cn(
        'flex gap-4 p-5 rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-md hover:border-primary/20',
        className
      )}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-accent-foreground">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
