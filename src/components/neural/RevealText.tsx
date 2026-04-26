/**
 * RevealText — gentle fade-in on scroll into view.
 *
 * Mobile/CWV note: we do NOT translate the element. The wrapper reserves its
 * natural height from first paint, so revealing only opacity avoids any
 * cumulative layout shift (CLS). Respects prefers-reduced-motion by showing
 * content immediately.
 */
import { ReactNode, useEffect, useRef, useState } from 'react';

interface RevealTextProps {
  children: ReactNode;
  delay?: number; // ms
  className?: string;
}

export function RevealText({ children, delay = 0, className = '' }: RevealTextProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Honor reduced motion + ensure content is visible if IO not supported
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-opacity duration-500 ease-out motion-reduce:transition-none`}
      style={{
        opacity: visible ? 1 : 0,
        transitionDelay: `${delay}ms`,
        // Reserve space; opacity-only animation = no layout shift
        willChange: visible ? 'auto' : 'opacity',
      }}
    >
      {children}
    </div>
  );
}
