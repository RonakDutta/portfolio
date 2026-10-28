import { memo, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Photo({ portrait, srcSet, style, lit = false, onError }) {
  return (
    <picture>
      <source type="image/webp" sizes={portrait.sizes} srcSet={srcSet} />
      <img
        src={portrait.fallback}
        alt={lit ? "" : portrait.alt}
        aria-hidden={lit ? "true" : undefined}
        width="1000"
        height="1250"
        loading="lazy"
        decoding="async"
        onError={onError}
        className="absolute inset-0 h-full w-full object-cover object-[50%_22%]"
        style={style}
      />
    </picture>
  );
}

/**
 * The portrait as the sun after totality: a disc in its own aura.
 *
 * It is shown twice. Underneath, the photograph in shadow; on top, the same
 * photograph in warm light, seen only through a soft pool that follows the
 * pointer. So the visitor lights the face. Without a pointer the pool rests on
 * the face and drifts with the scroll.
 *
 * The pool never repaints. It is a fixed radial mask on a layer that slides
 * under the pointer, and the lit photograph inside it slides back by exactly
 * the same amount, so the photograph stays put while the window onto it moves.
 * Two transforms a frame. The aura is CSS: a slow-turning ring of rays and a
 * soft bloom behind the disc.
 */
function LitPortrait({ portrait, initials = "", env, className = "" }) {
  const root = useRef(null);
  const disc = useRef(null);
  const lens = useRef(null);
  const inner = useRef(null);
  const [failed, setFailed] = useState(!portrait?.fallback);

  useLayoutEffect(() => {
    const el = disc.current;
    if (!el || !lens.current) return undefined;
    const light = { x: 50, y: 36 };
    let size = el.offsetWidth;
    const paint = () => {
      const dx = ((light.x - 50) / 100) * size;
      const dy = ((light.y - 50) / 100) * size;
      lens.current.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      inner.current.style.transform = `translate3d(${(-dx).toFixed(1)}px, ${(-dy).toFixed(1)}px, 0)`;
    };
    paint();
    const ro = new ResizeObserver(() => {
      size = el.offsetWidth;
      paint();
    });
    ro.observe(el);
    if (env.reducedMotion) return () => ro.disconnect();

    const opts = { duration: 0.9, ease: "power3", onUpdate: paint };
    const xTo = gsap.quickTo(light, "x", opts);
    const yTo = gsap.quickTo(light, "y", opts);

    const ctx = gsap.context(() => {
      if (!env.pointerFx) {
        gsap.fromTo(
          light,
          { y: 26, x: 40 },
          {
            y: 56,
            x: 60,
            ease: "none",
            onUpdate: paint,
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      }
    }, root);

    if (!env.pointerFx) {
      return () => {
        ro.disconnect();
        ctx.revert();
      };
    }

    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo(((e.clientX - r.left) / r.width) * 100);
      yTo(((e.clientY - r.top) / r.height) * 100);
    };
    const leave = () => {
      xTo(50);
      yTo(36);
    };
    const host = root.current;
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      ro.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(light);
      ctx.revert();
    };
  }, [env.pointerFx, env.reducedMotion, failed]);

  const mask = "radial-gradient(closest-side, #000 0%, rgba(0,0,0,0.86) 34%, transparent 82%)";
  const srcSet = portrait?.webp?.map((s) => `${s.src} ${s.width}w`).join(", ");

  return (
    <figure ref={root} className={`relative isolate aspect-square ${className}`}>
      {/* Bloom. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[38%] -z-10 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(236,215,163,0.28) 0%, rgba(200,164,92,0.12) 42%, rgba(138,109,51,0.04) 66%, transparent 100%)",
        }}
      />
      {/* Rays. */}
      <div aria-hidden="true" className="pointer-events-none absolute -inset-[26%] -z-10">
        <div
          className={`h-full w-full rounded-full ${env.reducedMotion ? "" : "animate-orbit"}`}
          style={{
            background:
              "repeating-conic-gradient(from 0deg, rgba(255,246,222,0.32) 0deg 0.8deg, transparent 0.8deg 5.2deg, rgba(236,215,163,0.16) 5.2deg 6.4deg, transparent 6.4deg 11deg)",
            maskImage:
              "radial-gradient(closest-side, transparent 64%, #000 70%, rgba(0,0,0,0.4) 84%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(closest-side, transparent 64%, #000 70%, rgba(0,0,0,0.4) 84%, transparent 100%)",
          }}
        />
      </div>

      <div
        ref={disc}
        className="absolute inset-0 overflow-hidden rounded-full bg-coal shadow-[0_0_0_1px_rgba(236,215,163,0.45),0_0_60px_8px_rgba(236,215,163,0.18)]"
      >
        {failed ? (
          <div className="absolute inset-0 grid place-items-center">
            <span className="wide text-[5rem] font-[800] text-smoke">{initials}</span>
          </div>
        ) : (
          <>
            <Photo
              portrait={portrait}
              srcSet={srcSet}
              onError={() => setFailed(true)}
              style={{ filter: "brightness(0.42) contrast(1.15) saturate(0.6)" }}
            />
            <div
              ref={lens}
              className="absolute inset-0 will-change-transform"
              style={{ maskImage: mask, WebkitMaskImage: mask }}
            >
              <div ref={inner} className="absolute inset-0 will-change-transform">
                <Photo
                  lit
                  portrait={portrait}
                  srcSet={srcSet}
                  onError={() => setFailed(true)}
                  style={{ filter: "sepia(0.32) saturate(1.3) brightness(1.1) contrast(1.05)" }}
                />
              </div>
            </div>
          </>
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: "inset 0 0 50px 10px rgba(7,6,10,0.65)" }}
        />
      </div>
    </figure>
  );
}

export default memo(LitPortrait);
