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
 *  - IntersectionObserver pauses the loop when no [data-neural-zone]
 *    element is on screen (e.g. user scrolled past content into footer).
 *  - Scroll-driven intensity boost while a zone is centered in viewport.
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
          // Visible drift — atoms slowly float across the universe
          vx: (Math.random() - 0.5) * (isMobile ? 0.18 : 0.32),
          vy: (Math.random() - 0.5) * (isMobile ? 0.18 : 0.32),
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

      // 1) Connection lines (neural net) — sichtbar, lebendig
      ctx.lineWidth = 0.8;
      const maxAlpha = isMobile ? 0.22 : 0.38;
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
            // alternate cobalt + warm signal hue based on pair index for variety
            const hue = (i + j) % 3 === 0 ? 28 : 224;
            const sat = hue === 28 ? 85 : 70;
            ctx.strokeStyle = `hsla(${hue}, ${sat}%, 50%, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 2) Particles (atoms) with pulse — lebendig sichtbar
      const dotAlpha = isMobile ? 0.55 : 0.75;
      const haloAlpha = isMobile ? 0.10 : 0.18;
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
        // Halo (warm signal, sichtbar)
        ctx.fillStyle = `hsla(28, 90%, 55%, ${haloAlpha * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2);
        ctx.fill();
        // Core dot (cobalt, kräftig)
        ctx.fillStyle = `hsla(224, 85%, 50%, ${dotAlpha * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    // Pause only when tab is hidden — the background must always live.
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      acc = 0;
      rafRef.current = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener('visibilitychange', onVis);
    const zoneObserver: IntersectionObserver | null = null;


    return () => {
      stop();
      window.removeEventListener('resize', setup);
      document.removeEventListener('visibilitychange', onVis);
      if (zoneObserver) zoneObserver.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Layer A: slow color glow orbs — bold, sichtbar */}
      <div className="absolute inset-0">
        <div
          className="absolute -top-40 -left-40 h-[60vmin] w-[60vmin] rounded-full opacity-60 md:opacity-80 animate-orb-a"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, hsl(224 85% 55% / 0.75), transparent 65%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-[30%] -right-32 h-[70vmin] w-[70vmin] rounded-full opacity-55 md:opacity-75 animate-orb-b"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, hsl(28 90% 55% / 0.65), transparent 65%)',
            filter: 'blur(70px)',
          }}
        />
        <div
          className="absolute -bottom-40 left-[20%] h-[65vmin] w-[65vmin] rounded-full opacity-55 md:opacity-70 animate-orb-c"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, hsl(264 75% 55% / 0.60), transparent 65%)',
            filter: 'blur(65px)',
          }}
        />
      </div>

      {/* Layer B: neural net + particles canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Layer C: paper veil — very light so the motion breathes through */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, hsl(var(--background) / 0.15) 0%, hsl(var(--background) / 0.25) 50%, hsl(var(--background) / 0.35) 100%)',
        }}
      />

    </div>
  );
}
