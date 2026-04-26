/**
 * ScoreCard — circular score visual with the one allowed gradient halo.
 * Used in the analysis report and as a teaser elsewhere.
 *
 * `score` is 0–100. `verdict` is a single-sentence interpretation.
 */
interface ScoreCardProps {
  score: number;
  label?: string;
  verdict?: string;
  size?: number; // px diameter
  className?: string;
}

export function ScoreCard({
  score,
  label = 'Score',
  verdict,
  size = 220,
  className = '',
}: ScoreCardProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Halo */}
        <div
          className="absolute inset-0 score-halo rounded-full"
          aria-hidden
        />
        {/* Ring */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="relative"
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        {/* Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-editorial text-6xl font-light tracking-tight text-foreground">
            {clamped}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
            {label}
          </div>
        </div>
      </div>
      {verdict && (
        <p className="mt-6 text-center text-base text-foreground/80 max-w-sm text-balance">
          {verdict}
        </p>
      )}
    </div>
  );
}
