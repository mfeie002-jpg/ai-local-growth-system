/**
 * AI Annotation — a margin note rendered in mono type with a signal-colored
 * left rule. Reads as if an AI is annotating the page in real time.
 *
 * Usage:
 *   <AIAnnotation>
 *     gemini-2.5-flash · interpreting your audit · 0.3s
 *   </AIAnnotation>
 */
import { ReactNode } from 'react';

interface AIAnnotationProps {
  children: ReactNode;
  className?: string;
}

export function AIAnnotation({ children, className = '' }: AIAnnotationProps) {
  return (
    <aside className={`annotation max-w-xs ${className}`} role="note">
      {children}
    </aside>
  );
}
