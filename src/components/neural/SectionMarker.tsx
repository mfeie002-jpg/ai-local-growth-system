/**
 * Numbered section marker — e.g. "03 / 06 · The Engine"
 * Uses mono "machine voice" type. Sits flush left above section headlines.
 */
interface SectionMarkerProps {
  index: number;
  total: number;
  label: string;
  className?: string;
}

export function SectionMarker({ index, total, label, className = '' }: SectionMarkerProps) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    <div className={`flex items-center gap-3 mb-8 ${className}`}>
      <span className="signal-dot" aria-hidden />
      <span className="section-marker">
        {pad(index)} / {pad(total)} · {label}
      </span>
    </div>
  );
}
