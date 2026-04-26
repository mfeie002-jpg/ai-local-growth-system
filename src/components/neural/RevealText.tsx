/**
 * RevealText — wraps content in a gentle fade-up reveal on scroll into view.
 * Lighter than ScrollReveal; uses IntersectionObserver only.
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
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
