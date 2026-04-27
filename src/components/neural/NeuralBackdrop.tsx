/**
 * NeuralBackdrop — global living background.
 * Three layered visuals on a single fixed canvas:
 *   1. Drifting atom particles (soft signal-tinted dots)
 *   2. Neural net (nodes + connecting lines that pulse when close)
 *   3. Slow color-shifting glow orbs (CSS, behind canvas)
 *
 * Performance:
 *  - Single requestAnimationFrame loop, capped DPR to 1.5
 *  - Particle count scales with viewport area (mobile gets less)
 *  - Pauses when tab is hidden; respects prefers-reduced-motion
 *  - z-index 0; content layers above with relative positioning
 */
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number; // for pulse
}

const CONNECT_DIST = 140;

export function NeuralBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 768;
      sizeRef.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density: ~1 / 22k px² desktop, ~1 / 38k px² mobile (much sparser)
      const divisor = isMobile ? 38000 : 22000;
      const max = isMobile ? 32 : 80;
      const min = isMobile ? 14 : 28;
      const target = Math.min(max, Math.max(min, Math.floor((w * h) / divisor)));
      const arr: Particle[] = [];
      for (let i = 0; i < target; i++) {
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          // Slower drift, especially on mobile
          vx: (Math.random() - 0.5) * (isMobile ? 0.06 : 0.11),
          vy: (Math.random() - 0.5) * (isMobile ? 0.06 : 0.11),
          r: 0.6 + Math.random() * 1.2,
          phase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = arr;
    };

    setup();
    window.addEventListener('resize', setup);

    let last = performance.now();
    let running = true;
    // Mobile: throttle to ~30fps to halve main-thread work
    const isMobile = window.innerWidth < 768;
    const minFrameMs = isMobile ? 33 : 0;
    let acc = 0;

    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min(40, now - last);
      last = now;
      acc += dt;
      if (acc < minFrameMs) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      acc = 0;

      const { w, h } = sizeRef.current;
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, w, h);

      // 1) Connection lines (neural net) — dezent: lower alpha, thinner
      ctx.lineWidth = 0.6;
      const maxAlpha = isMobile ? 0.08 : 0.14;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CONNECT_DIST * CONNECT_DIST) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / CONNECT_DIST) * maxAlpha;
            ctx.strokeStyle = `hsla(224, 60%, 35%, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 2) Particles (atoms) with subtle pulse — dezent
      const dotAlpha = isMobile ? 0.22 : 0.32;
      const haloAlpha = isMobile ? 0.03 : 0.05;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!reduced) {
          p.x += p.vx * (dt / 16);
          p.y += p.vy * (dt / 16);
          p.phase += 0.012;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
        const pulse = 0.65 + Math.sin(p.phase) * 0.35;
        // Halo (warm signal, very subtle)
        ctx.fillStyle = `hsla(28, 80%, 50%, ${haloAlpha * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Core dot (cobalt, dezent)
        ctx.fillStyle = `hsla(224, 70%, 40%, ${dotAlpha * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      } else if (!running) {
        running = true;
        last = performance.now();
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', setup);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Layer A: slow color glow orbs (CSS only, very cheap).
          Dimmed on mobile via the `md:` opacity bumps to keep things calm. */}
      <div className="absolute inset-0">
        <div
          className="absolute -top-40 -left-40 h-[60vmin] w-[60vmin] rounded-full opacity-25 md:opacity-45 animate-orb-a"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, hsl(224 70% 45% / 0.45), transparent 65%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-[30%] -right-32 h-[70vmin] w-[70vmin] rounded-full opacity-20 md:opacity-40 animate-orb-b"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, hsl(28 80% 50% / 0.35), transparent 65%)',
            filter: 'blur(70px)',
          }}
        />
        <div
          className="absolute -bottom-40 left-[20%] h-[65vmin] w-[65vmin] rounded-full opacity-20 md:opacity-35 animate-orb-c"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, hsl(264 60% 50% / 0.30), transparent 65%)',
            filter: 'blur(65px)',
          }}
        />
      </div>

      {/* Layer B: neural net + particles canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Layer C: paper veil — keeps editorial readability dominant */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, hsl(var(--background) / 0.78) 0%, hsl(var(--background) / 0.86) 50%, hsl(var(--background) / 0.78) 100%)',
        }}
      />
    </div>
  );
}
