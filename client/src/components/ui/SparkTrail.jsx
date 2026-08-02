import { useEffect, useRef } from "react";

/**
 * Lightweight canvas particle trail that leaves floating ember sparks
 * behind the mouse cursor as it glides across cards and buttons.
 */
export default function SparkTrail({ disabled = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });

    const MAX_PARTS = 40;
    const particles = [];

    const spawnSpark = (x, y) => {
      if (particles.length >= MAX_PARTS) {
        particles.shift();
      }
      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -0.6 - Math.random() * 1.4,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.9,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02,
      });
    };

    let lastX = 0;
    let lastY = 0;

    const onMouseMove = (e) => {
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 6) {
        spawnSpark(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let animId;
    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life * 0.85;
        ctx.fillStyle = `rgba(255, ${120 + Math.floor(p.life * 100)}, 20, ${alpha})`;
        ctx.shadowColor = "rgba(255, 90, 0, 0.8)";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden="true"
    />
  );
}
