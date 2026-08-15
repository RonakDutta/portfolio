import { memo, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The portrait, treated as a fashion-campaign plate.
 *
 * The source photograph is a composite: the subject stands in front of a
 * painted fantasy landscape. Rather than invent a different photo, the
 * treatment crops hard to the head and shoulders and takes the image to
 * near-monochrome. Black and white is doing double duty here — it is the
 * house style for this kind of portrait, and it is what makes the leftover
 * background read as a dark studio rather than a scene.
 *
 * `CROP` and `ORIGIN` are the two dials. With a clean studio photograph,
 * drop CROP towards 1 and cut the grayscale.
 */
/* Source is 1000x1250. The subject's head runs from ~30% to ~68% of the
   frame height, so scaling 1.34x about the lower edge lands a window on
   roughly y 262-1225 / x 115-885: head and shoulders, headroom kept, and the
   painted gate, chains and lava river pushed out of frame at the top and
   sides. */
const CROP = 1.30;
const ORIGIN = "50% 91%";

function Portrait({
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
      // Slow vertical drift inside a fixed frame. The frame never moves.
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
      <div className="relative aspect-4/5 w-full overflow-hidden bg-jet">
        {failed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-coal">
            <span className="font-display text-[6rem] font-light tracking-[0.2em] text-ash">
              {initials}
            </span>
          </div>
        ) : (
          <picture>
            <source
              type="image/webp"
              sizes={portrait.sizes}
              srcSet={portrait.webp
                .map((s) => `${s.src} ${s.width}w`)
                .join(", ")}
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
                  "grayscale(1) contrast(1.16) brightness(1.04) sepia(0.12)",
              }}
            />
          </picture>
        )}

        {/* Champagne rim light down the right edge, as if a single warm source
            sits just outside frame. Soft-light keeps it on the skin rather
            than laying a colour wash over the whole plate. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(252deg, rgba(225,196,135,0.7) 0%, rgba(176,141,69,0.2) 20%, transparent 44%)",
          }}
        />

        {/* Studio falloff: everything but the face goes to black. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(52% 47% at 50% 36%, transparent 24%, rgba(2,2,2,0.74) 58%, rgba(2,2,2,0.99) 100%)",
          }}
        />

        {/* Bottom fade, so the plate dissolves into the page instead of
            ending on a hard horizontal line. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4"
          style={{
            background: "linear-gradient(to top, #020202 0%, transparent 100%)",
          }}
        />
      </div>
    </figure>
  );
}

export default memo(Portrait);
