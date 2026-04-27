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
      sizeRef.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Particle density: ~1 per 14k px², capped for mobile/desktop
      const target = Math.min(120, Math.max(35, Math.floor((w * h) / 14000)));
      const arr: Particle[] = [];
      for (let i = 0; i < target; i++) {
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 0.8 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = arr;
    };

    setup();
    window.addEventListener('resize', setup);

    let last = performance.now();
    let running = true;

    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min(40, now - last);
      last = now;
      const { w, h } = sizeRef.current;
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, w, h);

      // 1) Connection lines (neural net)
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CONNECT_DIST * CONNECT_DIST) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / CONNECT_DIST) * 0.28;
            // Cobalt-leaning lines
            ctx.strokeStyle = `hsla(224, 84%, 48%, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 2) Particles (atoms) with subtle pulse
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!reduced) {
          p.x += p.vx * (dt / 16);
          p.y += p.vy * (dt / 16);
          p.phase += 0.02;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
        const pulse = 0.65 + Math.sin(p.phase) * 0.35;
        // Halo
        ctx.fillStyle = `hsla(28, 95%, 52%, ${0.08 * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
        // Core dot
        ctx.fillStyle = `hsla(224, 84%, 48%, ${0.55 * pulse})`;
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
      {/* Layer A: slow color glow orbs (CSS only, very cheap) */}
      <div className="absolute inset-0">
        <div
          className="absolute -top-40 -left-40 h-[60vmin] w-[60vmin] rounded-full opacity-60 animate-orb-a"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, hsl(224 84% 48% / 0.55), transparent 65%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-[30%] -right-32 h-[70vmin] w-[70vmin] rounded-full opacity-55 animate-orb-b"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, hsl(28 95% 52% / 0.45), transparent 65%)',
            filter: 'blur(70px)',
          }}
        />
        <div
          className="absolute -bottom-40 left-[20%] h-[65vmin] w-[65vmin] rounded-full opacity-50 animate-orb-c"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, hsl(264 70% 55% / 0.40), transparent 65%)',
            filter: 'blur(65px)',
          }}
        />
      </div>

      {/* Layer B: neural net + particles canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Layer C: paper veil — keeps editorial readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, hsl(var(--background) / 0.62) 0%, hsl(var(--background) / 0.78) 50%, hsl(var(--background) / 0.62) 100%)',
        }}
      />
    </div>
  );
}
