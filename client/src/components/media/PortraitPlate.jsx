import { memo, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The campaign portrait.
 *
 * The source is a composite: the subject stands in front of a painted fantasy
 * landscape. Rather than invent a different photograph, the plate crops hard
 * to head and shoulders and desaturates almost fully, then relights it —
 * champagne rim from the upper right, cold bounce from the lower left, and a
 * studio falloff that takes everything but the face to black. What survives
 * of the background reads as a dark set.
 *
 * Geometry, derived from the source (1000x1250, head spanning ~30-68% of the
 * frame height): scaling by CROP about ORIGIN lands a window on roughly
 * y 262-1225 / x 115-885. The vignette below is centred on where the face
 * lands in that window — change CROP and the vignette has to move with it.
 */
const CROP = 1.0;
const ORIGIN = "50% 50%";

function PortraitPlate({
  portrait,
  initials = "",
  reducedMotion = false,
  priority = false,
  className = "",
}) {
  const root = useRef(null);
  const image = useRef(null);
  const [failed, setFailed] = useState(!portrait?.fallback);

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Drift inside a fixed frame. Never negative enough to clip the crown.
      gsap.fromTo(
        image.current,
        { yPercent: -1 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <figure ref={root} className={`relative isolate ${className}`}>
      {/* Backlight: the aurora reads as if it is coming from behind the
          subject rather than from behind the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[18%] -inset-y-[10%] -z-10 blur-[48px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(212,175,55,0.34) 0%, rgba(140,101,8,0.16) 46%, transparent 76%)",
        }}
      />

      <div
        className="relative aspect-4/5 w-full overflow-hidden rounded-2xl border border-gold-dark/30 bg-carbon shadow-[0_0_40px_rgba(0,0,0,0.6)]"
      >
        {failed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-coal">
            <span className="font-display text-[6rem] font-light tracking-[0.2em] text-slate">
              {initials}
            </span>
          </div>
        ) : (
          <picture>
            <source
              type="image/webp"
              sizes={portrait.sizes}
              srcSet={portrait.webp.map((s) => `${s.src} ${s.width}w`).join(", ")}
            />
            <img
              ref={image}
              src={portrait.fallback}
              alt={portrait.alt}
              width="1000"
              height="1250"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full scale-[var(--crop)] object-cover"
              style={{
                "--crop": CROP,
                transformOrigin: ORIGIN,
                filter: "contrast(1.08) brightness(0.96) saturate(1.04)",
              }}
            />
          </picture>
        )}

        {/* Subtle warm champagne key-light overlay */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(225deg, rgba(255,245,199,0.35) 0%, rgba(212,175,55,0.08) 25%, transparent 55%)",
          }}
        />

        {/* Delicate cinematic corner vignette: softly darkens perimeter while keeping subject bright */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 38%, transparent 45%, rgba(3,3,4,0.35) 75%, rgba(3,3,4,0.7) 100%)",
          }}
        />
      </div>

      {/* A single gold filament down the lit edge of the plate. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-[8%] right-0 w-px"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(255,245,199,0.75) 34%, rgba(212,175,55,0.4) 62%, transparent)",
        }}
      />
    </figure>
  );
}

export default memo(PortraitPlate);
