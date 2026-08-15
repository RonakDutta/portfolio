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
const CROP = 1.3;
const ORIGIN = "50% 91%";

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
        className="pointer-events-none absolute -inset-x-[18%] -inset-y-[10%] -z-10 blur-[70px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(212,175,55,0.34) 0%, rgba(140,101,8,0.16) 46%, transparent 76%)",
        }}
      />

      <div
        className="relative aspect-4/5 w-full overflow-hidden bg-carbon"
        style={{
          maskImage:
            "radial-gradient(104% 104% at 66% 36%, #000 30%, rgba(0,0,0,0.55) 68%, transparent 97%)",
          WebkitMaskImage:
            "radial-gradient(104% 104% at 66% 36%, #000 30%, rgba(0,0,0,0.55) 68%, transparent 97%)",
        }}
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
                filter:
                  "grayscale(0.96) contrast(1.2) brightness(1.03) sepia(0.16)",
              }}
            />
          </picture>
        )}

        {/* Champagne rim from the upper right. Soft-light keeps it on the skin
            instead of laying a colour wash over the whole plate. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(248deg, rgba(255,245,199,0.85) 0%, rgba(212,175,55,0.3) 18%, transparent 44%)",
          }}
        />

        {/* A second, weaker bounce low and left, so the lighting has two
            sources and the shadow side does not go completely dead. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(28deg, rgba(198,161,91,0.3) 0%, transparent 34%)",
          }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(52% 47% at 50% 36%, transparent 24%, rgba(1,1,1,0.74) 58%, rgba(1,1,1,0.99) 100%)",
          }}
        />

        {/* Dissolve into the page on the two edges that meet the type, so the
            plate never reads as a rectangle pasted onto the background. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4"
          style={{
            background: "linear-gradient(to top, #010101 0%, transparent 100%)",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
          style={{
            background: "linear-gradient(to right, #010101 0%, transparent 100%)",
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
