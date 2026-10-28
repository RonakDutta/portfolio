import { memo, useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * The torch, and what it finds in the walls.
 *
 * A warm pool of light follows the pointer around the dark stage, and inside
 * it a guilloché is engraved into the room: the interlaced turned lattice cut
 * into banknotes and watch dials. It is invisible everywhere the light is
 * not, so it reads as something discovered rather than as a pattern laid over
 * the page.
 *
 * Every frame is two transforms and nothing else. The outer lens moves with
 * the pointer and carries a static radial mask; the engraving inside it is
 * moved by exactly the opposite amount, so it stays pinned to the viewport
 * while the window onto it slides. The engraving is drawn once onto a canvas
 * (and again only if the viewport changes size), and no blend mode is
 * involved.
 *
 * Mounted only for a real pointer that has not asked for less motion.
 */

const LENS = 560;
const RING_STEP = 28;
const WAVELENGTH = 96;
const AMPLITUDE = 24;
const ACCENT_EVERY = 4;

/**
 * Each ring is a pair of sine waves in antiphase around a circle, with the
 * petal count scaled to the radius so the wavelength stays the same from the
 * centre outwards. Neighbouring rings overlap by more than their spacing,
 * which is what interlaces them into a lattice instead of a set of
 * concentric wiggles. Every fourth radius gets a plain turned line.
 */
function engrave(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  // Off centre, toward the upper right, so the rosette's eye sits behind the
  // portrait on the first screen and never dead centre behind a paragraph.
  const cx = w * 0.64;
  const cy = h * 0.46;
  const reach = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) + AMPLITUDE;

  for (let k = 0, R = 110; R < reach; k += 1, R += RING_STEP) {
    const petals = Math.max(6, Math.round((2 * Math.PI * R) / WAVELENGTH));
    const steps = petals * 16;

    for (const phase of [0, Math.PI]) {
      ctx.beginPath();
      for (let s = 0; s <= steps; s += 1) {
        const t = (s / steps) * Math.PI * 2;
        const r = R + AMPLITUDE * Math.sin(petals * t + phase);
        const x = cx + r * Math.cos(t);
        const y = cy + r * Math.sin(t);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(200,164,92,0.42)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    if (k % ACCENT_EVERY === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(236,215,163,0.5)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }
}

function Engraving() {
  const lens = useRef(null);
  const plate = useRef(null);

  useEffect(() => {
    const lensEl = lens.current;
    const plateEl = plate.current;
    if (!lensEl || !plateEl) return;

    engrave(plateEl);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let redraw = 0;
    const onResize = () => {
      if (window.innerWidth === width && Math.abs(window.innerHeight - height) < 80) return;
      clearTimeout(redraw);
      redraw = setTimeout(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        engrave(plateEl);
      }, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight * 0.4 };
    const toX = gsap.quickTo(pos, "x", { duration: 0.9, ease: "power3" });
    const toY = gsap.quickTo(pos, "y", { duration: 0.9, ease: "power3" });

    let lastX = NaN;
    let lastY = NaN;
    const paint = () => {
      if (pos.x === lastX && pos.y === lastY) return;
      lastX = pos.x;
      lastY = pos.y;
      const x = pos.x - LENS / 2;
      const y = pos.y - LENS / 2;
      lensEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      plateEl.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
    };
    gsap.ticker.add(paint);

    let shown = false;
    const move = (e) => {
      toX(e.clientX);
      toY(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(lensEl, { opacity: 1, duration: 1.2, ease: "power2.out" });
      }
    };
    const leave = () => {
      shown = false;
      gsap.to(lensEl, { opacity: 0, duration: 0.8, ease: "power2.out" });
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);

    return () => {
      clearTimeout(redraw);
      gsap.ticker.remove(paint);
      gsap.killTweensOf(lensEl);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, []);

  const mask =
    "radial-gradient(closest-side, #000 0%, rgba(0,0,0,0.6) 45%, transparent 100%)";

  return (
    <div
      ref={lens}
      aria-hidden="true"
      className="absolute top-0 left-0 overflow-hidden rounded-full opacity-0"
      style={{
        width: LENS,
        height: LENS,
        willChange: "transform",
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      {/* The light itself. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,240,205,0.11) 0%, rgba(200,164,92,0.06) 42%, transparent 100%)",
        }}
      />

      {/* The engraving, held still against the viewport. */}
      <canvas
        ref={plate}
        className="absolute top-0 left-0 h-screen w-screen"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}

export default memo(Engraving);
