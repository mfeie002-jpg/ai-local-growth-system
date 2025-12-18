import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
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
  className,
}: PricingCardProps) {
  const { t, isEnglish } = useLanguage();

  return (
    <div
      className={cn(
        'relative flex flex-col p-6 sm:p-8 rounded-xl border transition-all duration-300',
        {
          'bg-card border-border hover:shadow-lg': !highlighted,
          'bg-foreground text-background border-foreground shadow-xl scale-[1.02]': highlighted,
        },
        className
      )}
    >
      {highlighted && highlightLabel && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
            {highlightLabel}
          </span>
        </div>
      )}
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className={cn('text-xl font-bold', highlighted ? 'text-background' : 'text-foreground')}>
            {name}
          </h3>
          <span className={cn('text-sm px-2 py-1 rounded', highlighted ? 'bg-background/10' : 'bg-muted')}>
            {duration}
          </span>
        </div>
        <p className={cn('text-sm', highlighted ? 'text-background/70' : 'text-muted-foreground')}>
          {forWhom}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className={cn('text-3xl sm:text-4xl font-bold', highlighted ? 'text-background' : 'text-foreground')}>
            {price}
          </span>
          {priceNote && (
            <span className={cn('text-sm', highlighted ? 'text-background/70' : 'text-muted-foreground')}>
              {priceNote}
            </span>
          )}
        </div>
        <span className={cn('text-sm', highlighted ? 'text-background/70' : 'text-muted-foreground')}>
          {isMonthly ? t.pricing.perMonth : t.pricing.oneTime}
        </span>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className={cn('w-5 h-5 mt-0.5 flex-shrink-0', highlighted ? 'text-background' : 'text-primary')} />
            <span className={cn('text-sm', highlighted ? 'text-background/90' : 'text-foreground')}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <CTAButton
        variant={highlighted ? 'secondary' : 'primary'}
        href={isEnglish ? '/en/free-audit' : '/gratis-audit'}
        location={`pricing-${name.toLowerCase().replace(/\s/g, '-')}`}
        className={highlighted ? 'border-background text-background hover:bg-background hover:text-foreground' : ''}
      >
        {t.cta.getAudit}
      </CTAButton>
    </div>
  );
}
