import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'muted' | 'accent';
  padding?: 'default' | 'large' | 'small' | 'none';
}

export function SectionContainer({
  children,
  className,
  id,
  background = 'default',
  padding = 'default',
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn(
        'w-full',
        {
          'bg-background': background === 'default',
          'bg-muted': background === 'muted',
          'bg-accent': background === 'accent',
          'py-16 sm:py-20 md:py-24': padding === 'default',
          'py-20 sm:py-28 md:py-32': padding === 'large',
          'py-8 sm:py-12': padding === 'small',
          'py-0': padding === 'none',
        },
        className
      )}
    >
      <div className="container-section">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        {
          'text-center': centered,
        },
        className
      )}
    >
      <h2 className="text-balance">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
