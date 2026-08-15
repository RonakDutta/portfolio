import { memo, useEffect, useRef } from "react";

/**
 * The particle field: metallic dust, and the glints hanging in it.
 *
 * Both used to be separate things. The dust was this canvas; the glints were
 * around sixty individually CSS-animated SVG stars spread over five sections.
 * Every one of those became its own composited layer, and profiling a scroll
 * on a throttled phone put them level with the canvas as the most expensive
 * thing on the page. They are one canvas now, which is one layer.
 *
 * Two sprites are baked once at mount and stamped with `drawImage`: a soft
 * halo for the dust, a four-point star for the glints. Building a fresh
 * gradient per particle per frame, which is what this did before, was pure
 * waste.
 *
 * The backing store is deliberately smaller than the element: 0.75 canvas
 * pixels per CSS pixel, and no device-pixel multiplier at all. A full-screen
 * surface that changes every frame is uploaded to the compositor every frame,
 * and at 2x that is seven times the bytes for a field of soft specks nobody is
 * going to inspect.
 */

const RES = 0.75;

function bakeHalo(size) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,246,222,1)");
  g.addColorStop(0.4, "rgba(200,164,92,0.4)");
  g.addColorStop(1, "rgba(200,164,92,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}

function bakeStar(size) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const h = size / 2;

  // Four concave arms. Drawn as a path rather than a polygon so it reads as a
  // glint catching light instead of as a sticker.
  ctx.beginPath();
  ctx.moveTo(h, 0);
  ctx.quadraticCurveTo(h * 1.12, h * 0.88, size, h);
  ctx.quadraticCurveTo(h * 1.12, h * 1.12, h, size);
  ctx.quadraticCurveTo(h * 0.88, h * 1.12, 0, h);
  ctx.quadraticCurveTo(h * 0.88, h * 0.88, h, 0);
  ctx.closePath();

  const g = ctx.createRadialGradient(h, h, 0, h, h, h);
  g.addColorStop(0, "rgba(255,250,236,1)");
  g.addColorStop(0.35, "rgba(240,222,175,0.95)");
  g.addColorStop(0.75, "rgba(200,164,92,0.5)");
  g.addColorStop(1, "rgba(200,164,92,0)");
  ctx.fillStyle = g;
  ctx.fill();
  return c;
}

function GoldDust({ motes = 36, glints = 16, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const halo = bakeHalo(64);
    const star = bakeStar(64);

    let w = 0;
    let h = 0;
    let field = [];

    const seed = () => {
      field = [
        ...Array.from({ length: motes }, () => ({
          star: false,
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1.6 + Math.random() * 6,
          // Drifting up and slightly across, like warm air in a lit room.
          vx: (Math.random() - 0.5) * 0.08,
          vy: -0.05 - Math.random() * 0.14,
          a: 0.1 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0004 + Math.random() * 0.0011,
        })),
        ...Array.from({ length: glints }, () => ({
          star: true,
          x: Math.random() * w,
          y: Math.random() * h,
          r: 3 + Math.random() * 6,
          vx: (Math.random() - 0.5) * 0.03,
          vy: -0.01 - Math.random() * 0.04,
          a: 0.4 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          // Glints breathe more slowly than dust, so the field never pulses
          // as one.
          speed: 0.0003 + Math.random() * 0.0007,
        })),
      ];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.round(rect.width * RES);
      h = Math.round(rect.height * RES);
      canvas.width = w;
      canvas.height = h;
      seed();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let running = false;

    const frame = (t) => {
      ctx.clearRect(0, 0, w, h);

      for (const p of field) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -8) {
          p.y = h + 8;
          p.x = Math.random() * w;
        }
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;

        const twinkle = p.star
          ? Math.max(0, Math.sin(t * p.speed + p.phase)) ** 2
          : 0.55 + 0.45 * Math.sin(t * p.speed + p.phase);

        const alpha = p.a * twinkle;
        if (alpha < 0.01) continue;

        const d = p.star ? p.r * 2 : p.r * 4;
        ctx.globalAlpha = alpha;
        ctx.drawImage(p.star ? star : halo, p.x - d / 2, p.y - d / 2, d, d);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { rootMargin: "10%" },
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motes, glints]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}

export default memo(GoldDust);
