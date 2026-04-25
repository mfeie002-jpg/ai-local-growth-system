import { cn } from '@/lib/utils';
import { Check, Sparkles } from 'lucide-react';
import { CTAButton } from './CTAButton';
import { useLanguage } from '@/i18n/LanguageContext';

interface PricingCardProps {
  name: string;
  duration: string;
  forWhom: string;
  price: string;
  priceNote?: string;
  isMonthly?: boolean;
  features: readonly string[];
  highlighted?: boolean;
  highlightLabel?: string;
  index?: number;
  className?: string;
}

export function PricingCard({
  name,
  duration,
  forWhom,
  price,
  priceNote,
  isMonthly = true,
  features,
  highlighted = false,
  highlightLabel,
  index = 0,
  className,
}: PricingCardProps) {
  const { t, isEnglish } = useLanguage();
  const number = String(index + 1).padStart(2, '0');

  return (
    <div
      className={cn(
        'group relative flex flex-col p-8 sm:p-10 rounded-2xl transition-all duration-500',
        highlighted
          ? 'border-aurora bg-card shadow-glow-intense md:scale-[1.04] md:-translate-y-2'
          : 'glass-panel hover:border-primary/40 hover:-translate-y-1',
        className
      )}
    >
      {/* Inner radial glow */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-500',
          highlighted ? 'opacity-100' : 'group-hover:opacity-100'
        )}
        style={{
          background:
            'radial-gradient(ellipse at top, hsl(var(--primary) / 0.18), transparent 65%), radial-gradient(ellipse at bottom right, hsl(var(--ai-accent) / 0.14), transparent 65%)',
        }}
      />

      {highlighted && highlightLabel && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase rounded-full bg-gradient-to-r from-primary via-ai-accent to-accent text-primary-foreground shadow-glow">
            <Sparkles className="w-3 h-3" />
            {highlightLabel}
          </span>
        </div>
      )}

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Marker */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground">
            {number} / Plan
          </span>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border border-border/60 text-muted-foreground">
            {duration}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-editorial text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-tight mb-3">
          {highlighted ? <span className="text-aurora italic">{name}</span> : name}
        </h3>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{forWhom}</p>

        {/* Price */}
        <div className="mb-8 pb-8 border-b border-border/50">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className={cn(
                'font-editorial text-6xl sm:text-7xl font-bold leading-none tracking-tighter',
                highlighted && 'text-aurora'
              )}
            >
              {price}
            </span>
            {priceNote && (
              <span className="text-base text-muted-foreground font-medium">{priceNote}</span>
            )}
          </div>
          <span className="block mt-2 text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground">
            {isMonthly ? t.pricing.perMonth : t.pricing.oneTime}
          </span>
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-10 flex-grow">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span
                className={cn(
                  'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
                  highlighted
                    ? 'bg-gradient-to-br from-primary to-ai-accent shadow-glow'
                    : 'bg-primary/10 ring-1 ring-primary/30'
                )}
              >
                <Check className={cn('w-3 h-3', highlighted ? 'text-primary-foreground' : 'text-primary')} />
              </span>
              <span className="text-sm text-foreground/90 leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <CTAButton
          variant={highlighted ? 'primary' : 'secondary'}
          href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
          location={`pricing-${name.toLowerCase().replace(/\s/g, '-')}`}
          className={cn(
            'w-full justify-center',
            highlighted && 'shadow-glow-intense'
          )}
        >
          {t.cta.getAudit}
        </CTAButton>
      </div>
    </div>
  );
}
