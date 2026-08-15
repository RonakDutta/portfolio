import { memo, useEffect, useRef } from "react";

/**
 * Metallic dust — the specks you see hanging in a studio spotlight.
 *
 * Deliberately sparse and slow. A canvas rather than DOM nodes so the whole
 * field is one composited element, and the loop is suspended whenever the tab
 * is hidden or the field scrolls out of view, so it never burns battery for
 * something nobody is looking at.
 */
function GoldDust({ count = 46, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    // Dust is soft by nature; there is nothing here worth a retina buffer.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let w = 0;
    let h = 0;
    let motes = [];

    const seed = () => {
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.5,
        // Drifting up and slightly across, like warm air in a lit room.
        vx: (Math.random() - 0.5) * 0.08,
        vy: -0.05 - Math.random() * 0.14,
        a: 0.1 + Math.random() * 0.5,
        // Each mote breathes on its own cycle so the field never pulses as one.
        phase: Math.random() * Math.PI * 2,
        speed: 0.0004 + Math.random() * 0.0011,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let running = false;

    const frame = (t) => {
      ctx.clearRect(0, 0, w, h);

      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;

        if (m.y < -4) {
          m.y = h + 4;
          m.x = Math.random() * w;
        }
        if (m.x < -4) m.x = w + 4;
        if (m.x > w + 4) m.x = -4;

        const twinkle = 0.55 + 0.45 * Math.sin(t * m.speed + m.phase);
        const alpha = m.a * twinkle;

        // A tiny halo under each speck: without it they read as flat dots
        // rather than as motes catching a light source.
        const halo = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
        halo.addColorStop(0, `rgba(255,246,222,${alpha})`);
        halo.addColorStop(0.4, `rgba(200,164,92,${alpha * 0.4})`);
        halo.addColorStop(1, "rgba(200,164,92,0)");

        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

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
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}

export default memo(GoldDust);
