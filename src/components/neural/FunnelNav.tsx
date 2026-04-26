/**
 * FunnelNav — bottom-of-page navigation strip used across the funnel pages.
 * Renders Previous (subtle, ghost) and Next (primary CTA) with a section marker.
 *
 * The funnel order is:
 *   System → Audit → Pakete → Call → FAQ
 *
 * Each page declares its own prev/next so the user always knows where they are.
 */
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CTAButton } from '@/components/CTAButton';

export interface FunnelStep {
  href: string;
  label: string;          // e.g. "Pakete"
  hint?: string;          // e.g. "Step 03 — Commit"
}

interface FunnelNavProps {
  current: { index: number; total: number; label: string };
  prev?: FunnelStep;
  next?: FunnelStep;
  /** Override the next CTA text (e.g. "Free audit →" instead of "Pakete →") */
  nextCtaLabel?: string;
  /** Optional supporting copy under the marker */
  copy?: string;
  /** Tracking location prefix */
  location?: string;
}

export function FunnelNav({ current, prev, next, nextCtaLabel, copy, location = 'funnel-nav' }: FunnelNavProps) {
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="border-t border-border">
      <div className="container-section py-12 md:py-16">
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-center">
          {/* Marker */}
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="signal-dot" aria-hidden />
              <span className="section-marker">
                {pad(current.index)} / {pad(current.total)} · {current.label}
              </span>
            </div>
            {copy && <p className="text-sm text-foreground/65 max-w-xs">{copy}</p>}
          </div>

          {/* Prev */}
          <div className="col-span-6 md:col-span-4">
            {prev ? (
              <Link
                to={prev.href}
                className="group inline-flex items-start gap-3 text-left"
              >
                <ArrowLeft className="w-4 h-4 mt-1 text-foreground/55 transition-transform group-hover:-translate-x-1" />
                <div>
                  {prev.hint && (
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-1">
                      {prev.hint}
                    </div>
                  )}
                  <div className="font-editorial text-xl text-foreground/85 group-hover:text-foreground transition-colors">
                    {prev.label}
                  </div>
                </div>
              </Link>
            ) : (
              <span className="hidden md:block" />
            )}
          </div>

          {/* Next */}
          <div className="col-span-6 md:col-span-4 md:text-right">
            {next ? (
              <div className="flex flex-col items-start md:items-end gap-3">
                {next.hint && (
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                    {next.hint}
                  </div>
                )}
                <CTAButton
                  variant="primary"
                  size="lg"
                  href={next.href}
                  location={`${location}-next`}
                >
                  {nextCtaLabel ?? next.label}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </CTAButton>
              </div>
            ) : (
              <span className="hidden md:block" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Shared funnel definition. Pages import this so order and labels stay in sync.
 * `getFunnelSteps(isEnglish)` returns the 5-step array; pages pick their own
 * index and the helper provides prev/next.
 */
export function getFunnelSteps(isEnglish: boolean): Array<FunnelStep & { id: string }> {
  return isEnglish
    ? [
        { id: 'system',  href: '/en/system',       label: 'The System',     hint: 'Step 01 — Learn'  },
        { id: 'audit',   href: '/en/free-audit',   label: 'Free AI Audit',  hint: 'Step 02 — Start'  },
        { id: 'pricing', href: '/en/pricing',      label: 'Packages',       hint: 'Step 03 — Commit' },
        { id: 'call',    href: '/en/free-call',    label: 'Free Call',      hint: 'Step 04 — Talk'   },
        { id: 'faq',     href: '/en/faq',          label: 'FAQ',            hint: 'Step 05 — Clarify' },
      ]
    : [
        { id: 'system',  href: '/system',       label: 'Das System',    hint: 'Schritt 01 — Verstehen' },
        { id: 'audit',   href: '/gratis-audit', label: 'Gratis KI-Audit', hint: 'Schritt 02 — Starten'   },
        { id: 'pricing', href: '/pakete',       label: 'Pakete',        hint: 'Schritt 03 — Festlegen'  },
        { id: 'call',    href: '/gratis-call',  label: 'Gratis Call',   hint: 'Schritt 04 — Sprechen'   },
        { id: 'faq',     href: '/faq',          label: 'FAQ',           hint: 'Schritt 05 — Klären'     },
      ];
}
