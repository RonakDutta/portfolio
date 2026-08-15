import { memo, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Sparkles from "../fx/Sparkles";

gsap.registerPlugin(ScrollTrigger);

/**
 * The portrait.
 *
 * Two earlier attempts at this both failed for the same reason. Framing the
 * photograph in a bordered, vignetted, gold-washed plate put a second dark edge
 * inside a dark edge and laid a warm cast across one side of the face; trying
 * to dissolve all four edges into the page instead just moved the problem,
 * because the set it was shot on is a different black from the one this page is
 * lit in, so a rectangle stayed visible whichever way the values fell.
 *
 * So the edge is deliberate now. An arch, the shape a portrait has hung in
 * since long before websites, with a single brass hairline along it, and the
 * foot of it dissolving into the page so the subject is standing in the room
 * rather than sitting in a box. The only grade left is a touch of contrast; no
 * tint over skin.
 */
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
      // Drift inside a fixed frame. Never far enough to clear the crown.
      gsap.fromTo(
        image.current,
        { yPercent: -2 },
        {
          yPercent: 4,
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

  const dissolve =
    "linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0.55) 82%, transparent 99%)";

  return (
    <figure ref={root} className={`relative isolate ${className}`}>
      {/* The light the subject is standing in. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[14%] -z-10 blur-[64px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(200,164,92,0.26) 0%, rgba(138,109,51,0.1) 54%, transparent 80%)",
        }}
      />

      <div
        className="relative aspect-4/5 w-full overflow-hidden rounded-t-full"
        style={{ maskImage: dissolve, WebkitMaskImage: dissolve }}
      >
        {failed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-carbon">
            <span className="font-display text-[5rem] font-light tracking-[0.14em] text-slate">
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
              className="absolute inset-0 h-full w-full object-cover object-top"
              style={{ filter: "contrast(1.06) brightness(1.03)" }}
            />
          </picture>
        )}

        {/* The hairline, drawn inside the arch so it follows the curve. It is
            brightest at the top left, where the key light is. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-t-full border border-brass/35"
          style={{
            maskImage:
              "linear-gradient(160deg, #000 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)",
            WebkitMaskImage:
              "linear-gradient(160deg, #000 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)",
          }}
        />
      </div>

      <Sparkles count={9} seed={31} scale={0.85} className="-z-10" />
    </figure>
  );
}

export default memo(PortraitPlate);
