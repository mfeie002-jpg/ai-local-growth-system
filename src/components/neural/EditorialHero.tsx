/**
 * EditorialHero — the canonical hero shape for Neural Editorial pages.
 * Asymmetric 12-col grid: 8-col headline + lede + CTA, 4-col annotation column.
 *
 * Pages compose this with their own copy + CTAs to keep tone consistent.
 */
import { ReactNode } from 'react';
import { AIAnnotation } from './AIAnnotation';

interface EditorialHeroProps {
  eyebrow?: string;          // mono micro-label, e.g. "01 / 06 · Manifesto"
  title: ReactNode;          // serif display headline (mix in <em> for italics)
  lede?: ReactNode;          // body lede beneath the headline
  cta?: ReactNode;           // primary CTA (and optional secondary)
  annotation?: ReactNode;    // text shown in the right "AI margin"
  meta?: ReactNode;          // bottom-row meta (trust signals etc.)
  children?: ReactNode;      // optional extra slot below the lede
}

export function EditorialHero({
  eyebrow,
  title,
  lede,
  cta,
  annotation,
  meta,
  children,
}: EditorialHeroProps) {
  return (
    <section className="relative pt-28 md:pt-36 lg:pt-44 pb-24 md:pb-32">
      <div className="container-section">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          {/* Left — editorial body, 8 cols */}
          <div className="col-span-12 lg:col-span-8">
            {eyebrow && (
              <div className="flex items-center gap-3 mb-10">
                <span className="signal-dot" aria-hidden />
                <span className="section-marker">{eyebrow}</span>
              </div>
            )}
            <h1 className="text-balance">{title}</h1>
            {lede && (
              <p className="mt-8 max-w-2xl text-lg md:text-xl text-foreground/75 leading-[1.55]">
                {lede}
              </p>
            )}
            {children}
            {cta && <div className="mt-12 flex flex-wrap gap-4">{cta}</div>}
            {meta && (
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {meta}
              </div>
            )}
          </div>

          {/* Right — annotation column, 4 cols, sticky on lg */}
          <div className="hidden lg:flex col-span-4 lg:col-start-9 flex-col gap-6 pt-2">
            <div className="rule-hairline w-12" />
            {annotation && <AIAnnotation>{annotation}</AIAnnotation>}
          </div>
        </div>
      </div>
    </section>
  );
}
