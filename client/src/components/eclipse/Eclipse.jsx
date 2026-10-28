import { memo, useEffect, useId, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerEclipse } from "../../lib/eclipse";

gsap.registerPlugin(ScrollTrigger);

/**
 * An eclipse anchor. The DOM owns the moon, so its limb is pin sharp at any
 * pixel density; EclipseField paints the corona around it.
 *
 * The visitor steers it. The moon slides away from the pointer, so the sun
 * breaks through on the side the pointer is on and throws a diamond ring
 * toward it, and the streamers lean the same way. Far from the eclipse it
 * settles back into totality. A click anywhere near it sets off a flare.
 *
 * Without a real pointer it wanders on its own, slowly enough that the
 * diamond ring only catches now and then.
 *
 * `zoom` hands the anchor to the scroll: leaving its section, the eclipse holds
 * its place in the viewport and swells until the moon is all there is, so the
 * next section opens inside it.
 */
function Eclipse({ env, primary = false, ring = null, zoom = false, className = "" }) {
  const outer = useRef(null);
  const lens = useRef(null);
  const moon = useRef(null);
  const ringRef = useRef(null);
  const bead = useRef(null);
  const entryRef = useRef(null);

  useEffect(() => {
    const moonEl = moon.current;
    const entry = {
      anchor: lens.current,
      moon: moonEl,
      lean: { x: 0, y: 0 },
      burst: 0,
      calm: 1,
      glow: 1,
      visible: true,
      primary,
    };
    entryRef.current = entry;
    const unregister = registerEclipse(entry);

    // Everything below runs per frame or per pointer move, so it stands down
    // while this eclipse is nowhere near the screen, and reads its size from
    // an observer rather than from layout.
    const io = new IntersectionObserver(([e]) => (entry.visible = e.isIntersecting), {
      rootMargin: "60% 0px",
    });
    io.observe(outer.current);
    let half = outer.current.offsetWidth / 2;
    const ro = new ResizeObserver(([e]) => (half = e.contentRect.width / 2));
    ro.observe(outer.current);
    const base = () => half;
    const stop = () => {
      unregister();
      io.disconnect();
      ro.disconnect();
    };

    if (env.reducedMotion) return stop;

    // The bead of sunlight that breaks round the limb. It sits on the limb
    // point furthest from the moon and brightens with how far the moon has
    // slipped, so it always agrees with what the corona is doing.
    const beadEl = bead.current;
    let shown = "0";
    const placeBead = () => {
      if (!entry.visible) return;
      const b = base();
      const x = gsap.getProperty(moonEl, "x");
      const y = gsap.getProperty(moonEl, "y");
      const off = Math.hypot(x, y) / b;
      const show = Math.min(1, Math.max(0, (off - 0.018) / 0.05));
      const next = show <= 0.001 ? "0" : show.toFixed(3);
      if (next !== shown) beadEl.style.opacity = shown = next;
      if (next === "0") return;
      const ux = -x / (off * b);
      const uy = -y / (off * b);
      beadEl.style.transform = `translate(${(ux * b * 1.005).toFixed(1)}px, ${(uy * b * 1.005).toFixed(1)}px) scale(${(0.55 + show * 0.45).toFixed(3)})`;
    };
    gsap.ticker.add(placeBead);
    const xTo = gsap.quickTo(moonEl, "x", { duration: 1.3, ease: "power3" });
    const yTo = gsap.quickTo(moonEl, "y", { duration: 1.3, ease: "power3" });
    const lx = gsap.quickTo(entry.lean, "x", { duration: 1.6, ease: "power2" });
    const ly = gsap.quickTo(entry.lean, "y", { duration: 1.6, ease: "power2" });

    const flare = () =>
      gsap.fromTo(entry, { burst: 1 }, { burst: 0, duration: 2.6, ease: "power2.out", overwrite: true });

    const near = (x, y, k) => {
      const r = lens.current.getBoundingClientRect();
      const R = r.width / 2;
      return Math.hypot(x - (r.left + R), y - (r.top + r.height / 2)) < R * k;
    };

    const down = (e) => {
      if (entry.visible && near(e.clientX, e.clientY, 2.6)) flare();
    };
    window.addEventListener("pointerdown", down, { passive: true });

    if (env.pointerFx) {
      const move = (e) => {
        if (!entry.visible) return;
        const r = lens.current.getBoundingClientRect();
        const R = r.width / 2;
        const dx = e.clientX - (r.left + R);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const prox = Math.exp(-Math.max(dist / R - 1.1, 0) * 0.42);
        const amt = 0.1 * prox * entry.calm;
        xTo((-dx / dist) * amt * base());
        yTo((-dy / dist) * amt * base());
        lx((dx / dist) * 0.75 * prox * entry.calm);
        ly((-dy / dist) * 0.75 * prox * entry.calm);
      };
      const rest = () => {
        xTo(0);
        yTo(0);
        lx(0);
        ly(0);
      };
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", rest);

      return () => {
        stop();
        gsap.ticker.remove(placeBead);
        window.removeEventListener("pointerdown", down);
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", rest);
        gsap.killTweensOf([moonEl, entry, entry.lean]);
      };
    }

    // No pointer: a slow wander.
    const wander = (time) => {
      if (!entry.visible) return;
      const a = time * 0.21;
      const amt = (0.035 + 0.035 * Math.sin(time * 0.33)) * entry.calm;
      gsap.set(moonEl, {
        x: Math.cos(a) * amt * base(),
        y: Math.sin(a) * amt * base(),
      });
      entry.lean.x = -Math.cos(a) * 0.5 * entry.calm;
      entry.lean.y = Math.sin(a) * 0.5 * entry.calm;
    };
    gsap.ticker.add(wander);

    return () => {
      stop();
      gsap.ticker.remove(wander);
      gsap.ticker.remove(placeBead);
      window.removeEventListener("pointerdown", down);
      gsap.killTweensOf([moonEl, entry]);
    };
  }, [env.pointerFx, env.reducedMotion, primary]);

  useLayoutEffect(() => {
    if (!zoom || env.reducedMotion) return undefined;
    const section = outer.current.closest("section");
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            onUpdate: (self) => {
              const entry = entryRef.current;
              if (!entry) return;
              const p = self.progress;
              entry.calm = Math.max(0, 1 - p * 6);
              // By here the moon covers the whole screen. Put the corona out
              // before its far rim can sweep back into view further down.
              entry.glow = 1 - Math.min(1, Math.max(0, (p - 0.7) / 0.2));
            },
          },
        })
        .to(lens.current, { scale: 12, ease: "power2.in", duration: 1 }, 0)
        .to(lens.current, { y: () => section.offsetHeight * 0.92, ease: "none", duration: 1 }, 0)
        .to(ringRef.current, { opacity: 0, ease: "none", duration: 0.35 }, 0);
    });
    return () => ctx.revert();
  }, [zoom, env.reducedMotion]);

  return (
    <div ref={outer} aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div ref={lens} className="relative h-full w-full">
        {/* Only painted when WebGL is unavailable. */}
        <div className="ecl-fallback absolute -inset-[70%] hidden rounded-full" />

        {ring ? <Ring innerRef={ringRef} items={ring} still={env.reducedMotion} /> : <span ref={ringRef} />}

        <div
          ref={moon}
          data-eclipse-moon
          className="absolute inset-0 rounded-full bg-ink"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,246,222,0.04)" }}
        />

        <div
          ref={bead}
          data-eclipse-bead
          className="pointer-events-none absolute top-1/2 left-1/2 -mt-[30%] -ml-[30%] h-[60%] w-[60%] opacity-0"
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, #ffffff 0%, rgba(255,251,240,0.97) 11%, rgba(255,236,190,0.55) 25%, rgba(236,215,163,0.16) 50%, transparent 72%)",
            }}
          />
          <span
            className="absolute top-1/2 left-1/2 h-[2px] w-[300%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent 15%, rgba(255,246,222,0.12) 35%, rgba(255,252,240,0.8) 50%, rgba(255,246,222,0.12) 65%, transparent 85%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * An inscription turned around the corona. The words are fitted to the full
 * circumference with `textLength`, so the ring always closes on itself.
 */
const Ring = memo(function Ring({ items, still, innerRef }) {
  const id = useId().replace(/:/g, "");
  const line = items.map((s) => s.toUpperCase()).join("  /  ") + "  /  ";
  const circumference = 2 * Math.PI * 74;
  const repeat = Math.max(1, Math.round(circumference / (line.length * 3.1)));

  return (
    <div
      ref={innerRef}
      data-eclipse-ring
      className="absolute top-1/2 left-1/2 aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2"
    >
      {/* The turn is on a wrapper, not on the <svg>: a transform animation
          on a plain box runs on the compositor, one on an svg root may not. */}
      <div className={`h-full w-full ${still ? "" : "animate-orbit will-change-transform"}`}>
        <svg viewBox="0 0 300 300" className="h-full w-full overflow-visible">
          <defs>
            <path id={`ring-${id}`} d="M150,150 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
          </defs>
          <text
            className="fill-ivory/75 font-mono uppercase"
            style={{ fontSize: "4.1px", letterSpacing: "0.06em" }}
          >
            <textPath href={`#ring-${id}`} textLength={circumference - 2} lengthAdjust="spacing">
              {line.repeat(repeat)}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
});

export default memo(Eclipse);
