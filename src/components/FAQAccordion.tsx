import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: readonly FAQItem[];
  className?: string;
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className={cn('divide-y divide-border/60 border-y border-border/60', className)}
    >
      {items.map((item, index) => {
        const num = String(index + 1).padStart(2, '0');
        return (
          <AccordionPrimitive.Item
            key={index}
            value={`item-${index}`}
            className="group relative overflow-hidden transition-colors data-[state=open]:bg-card/40"
          >
            {/* Aurora glow on open */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-data-[state=open]:opacity-100">
              <div className="absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
            </div>

            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="group/trigger relative flex flex-1 items-start justify-between gap-6 py-6 sm:py-8 text-left transition-colors [&[data-state=open]>div>svg]:rotate-45 [&[data-state=open]_.faq-num]:text-aurora">
                <div className="flex items-start gap-4 sm:gap-8 flex-1 min-w-0">
                  <span className="faq-num font-editorial text-xs sm:text-sm font-semibold tracking-[0.2em] text-muted-foreground/70 pt-2 sm:pt-3 transition-colors flex-shrink-0">
                    {num}
                  </span>
                  <span className="font-editorial text-xl sm:text-2xl md:text-3xl font-semibold leading-tight text-foreground group-hover/trigger:text-aurora transition-colors pr-2">
                    {item.question}
                  </span>
                </div>
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full border border-border/80 bg-card/60 transition-all duration-300 group-hover/trigger:border-primary/60 group-hover/trigger:shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-foreground transition-transform duration-300" />
                </div>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="pl-0 sm:pl-[calc(2rem+2rem)] pr-12 sm:pr-16 pb-8 max-w-3xl">
                <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        );
      })}
    </AccordionPrimitive.Root>
  );
}
