/**
 * SignalStream — animated horizontal pipeline visual.
 * Shows tokens flowing through 4 stages of the scoring engine.
 * Pure CSS transforms; respects prefers-reduced-motion via global rule.
 */
import { useMemo } from 'react';

interface SignalStreamProps {
  stages: string[]; // e.g. ['Collect', 'Normalize', 'Score', 'Interpret']
  className?: string;
}

export function SignalStream({ stages, className = '' }: SignalStreamProps) {
  // Fewer pulses + simpler positions = lighter main thread on mobile
  const pulses = useMemo(
    () => Array.from({ length: 3 }, (_, i) => ({ delay: i * 0.9, top: 30 + i * 20 })),
    []
  );

  return (
    <div className={`relative w-full ${className}`}>
      {/* Stage markers row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stages.map((s, i) => (
          <div key={s} className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="signal-dot" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="font-mono text-sm text-foreground">{s}</div>
          </div>
        ))}
      </div>

      {/* The stream rail */}
      <div
        className="relative h-24 rounded-md border border-border bg-card overflow-hidden"
        aria-hidden
      >
        {/* Center rail line */}
        <div
          className="absolute left-0 right-0 top-1/2 h-px"
          style={{ background: 'hsl(var(--foreground) / 0.12)' }}
        />
        {/* Streaming pulses */}
        {pulses.map((p, i) => (
          <div
            key={i}
            className="absolute h-1 w-16 rounded-full animate-stream"
            style={{
              top: `${p.top}%`,
              background: `linear-gradient(90deg, transparent, hsl(var(--signal) / 0.85), transparent)`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
        {/* Stage tick marks */}
        <div className="absolute inset-0 grid grid-cols-4">
          {stages.map((_, i) => (
            <div
              key={i}
              className="border-r border-border/60 last:border-r-0 flex items-center justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-foreground/70" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
