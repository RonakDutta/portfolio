import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * The cursor.
 *
 * A brass bead with a ring that lags a frame behind it, a label that appears
 * over anything carrying `data-cursor`, a spark burst on click, and a thin
 * trail of sparkles behind the pointer.
 *
 * It only ever runs for a real pointer that has not asked for less motion.
 * Touch keeps the platform's own behaviour, and the native cursor is only
 * hidden (`has-cursor` on <html>) once this is actually on screen, so a
 * failure here can never leave a visitor with no pointer at all.
 */
const TRAIL_MS = 90;
const TRAIL_MIN_PX = 6;
const SPARK_ARMS = 9;

export default function Cursor({ enabled }) {
  const bead = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);
  const layer = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    const beadEl = bead.current;
    const ringEl = ring.current;
    const labelEl = label.current;
    const layerEl = layer.current;

    gsap.set([beadEl, ringEl, labelEl], { xPercent: -50, yPercent: -50 });

    const beadX = gsap.quickTo(beadEl, "x", { duration: 0.12, ease: "power3" });
    const beadY = gsap.quickTo(beadEl, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ringEl, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ringEl, "y", { duration: 0.5, ease: "power3" });
    const labelX = gsap.quickTo(labelEl, "x", { duration: 0.34, ease: "power3" });
    const labelY = gsap.quickTo(labelEl, "y", { duration: 0.34, ease: "power3" });

    let visible = false;
    let lastTrail = 0;
    let lastX = 0;
    let lastY = 0;

    const show = () => {
      if (visible) return;
      visible = true;
      gsap.to([beadEl, ringEl], { opacity: 1, duration: 0.3 });
    };

    const sparkle = (x, y) => {
      const star = document.createElement("span");
      star.className = "cur-sparkle";
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      const size = 4 + Math.random() * 6;
      star.style.setProperty("--s", `${size}px`);
      star.style.setProperty("--r", `${Math.random() * 90 - 45}deg`);
      layerEl.appendChild(star);
      gsap.fromTo(
        star,
        { opacity: 0.9, scale: 0.4 },
        {
          opacity: 0,
          scale: 1.25,
          y: 18 + Math.random() * 16,
          duration: 0.9 + Math.random() * 0.5,
          ease: "power2.out",
          onComplete: () => star.remove(),
        },
      );
    };

    const move = (e) => {
      show();
      beadX(e.clientX);
      beadY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      labelX(e.clientX);
      labelY(e.clientY);

      // Only leave a trail when the pointer is actually travelling. A hand
      // resting on the trackpad used to emit a sparkle, and a tween to drive
      // it, eighteen times a second.
      const now = performance.now();
      const far =
        Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY) > TRAIL_MIN_PX;
      if (far && now - lastTrail > TRAIL_MS) {
        lastTrail = now;
        lastX = e.clientX;
        lastY = e.clientY;
        sparkle(e.clientX, e.clientY);
      }
    };

    // Hover state is resolved from the event target rather than from listeners
    // bound to every control, so anything added later is picked up for free.
    const over = (e) => {
      const hit = e.target.closest?.(
        "a, button, [role='button'], input, textarea, [data-cursor]",
      );
      const tag = hit?.getAttribute?.("data-cursor");

      gsap.to(ringEl, {
        scale: hit ? 1.9 : 1,
        borderColor: hit ? "rgba(236,215,163,0.95)" : "rgba(200,164,92,0.5)",
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(beadEl, { scale: hit ? 0 : 1, duration: 0.3, ease: "power3.out" });

      labelEl.textContent = tag || "";
      gsap.to(labelEl, { opacity: tag ? 1 : 0, duration: 0.3 });
    };

    const leave = () => {
      visible = false;
      gsap.to([beadEl, ringEl, labelEl], { opacity: 0, duration: 0.25 });
    };

    const burst = (e) => {
      const spark = document.createElement("span");
      spark.className = "cur-spark";
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;

      for (let i = 0; i < SPARK_ARMS; i += 1) {
        const arm = document.createElement("i");
        arm.style.transform = `rotate(${(360 / SPARK_ARMS) * i}deg) translateY(-6px)`;
        spark.appendChild(arm);
      }
      layerEl.appendChild(spark);

      gsap.fromTo(
        spark.children,
        { scaleY: 0.3, opacity: 1 },
        {
          scaleY: 1,
          opacity: 0,
          y: -16,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.008,
          onComplete: () => spark.remove(),
        },
      );

      gsap.fromTo(
        ringEl,
        { scale: 0.75 },
        { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
      );
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", burst, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);

    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", burst);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      gsap.killTweensOf([beadEl, ringEl, labelEl]);
      layerEl.replaceChildren();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]">
      <div ref={layer} className="absolute inset-0" />

      <span
        ref={ring}
        className="absolute top-0 left-0 h-9 w-9 rounded-full border opacity-0
          mix-blend-difference"
        style={{ borderColor: "rgba(200,164,92,0.5)" }}
      />
      <span
        ref={bead}
        className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-brass-lit opacity-0"
      />
      <span
        ref={label}
        className="absolute top-0 left-0 mt-9 eyebrow-sm whitespace-nowrap text-brass-lit opacity-0"
      />
    </div>
  );
}
