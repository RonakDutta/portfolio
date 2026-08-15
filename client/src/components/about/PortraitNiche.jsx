import { memo, useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** A round-headed niche cut into the wall. Same arch language as the hero. */
const ARCH = "M0,1 L0,0.58 C0,0.30 0.34,0.12 0.5,0 C0.66,0.12 1,0.30 1,0.58 L1,1 Z";

/**
 * The supplied portrait is a composite: the subject sits in front of a painted
 * hellscape of lava and towers. At full frame that background competes with
 * everything else on the page and reads as a game poster.
 *
 * Rather than fabricate a different photo, the treatment crops in hard on the
 * subject and pulls most of the colour out of what is left, so the remaining
 * background reads as a dark room lit from below. If a cleaner portrait is
 * ever dropped in at `public/portrait.*`, lower CROP back towards 1.
 */
const CROP = 1.5;

function PortraitNiche({ portrait, alt, initials = "", reducedMotion = false }) {
  const uid = useId().replace(/:/g, "");
  const clip = `arch-${uid}`;
  const root = useRef(null);
  const image = useRef(null);

  const [failed, setFailed] = useState(!portrait?.fallback);

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // A little parallax inside the frame. The frame itself does not move.
      // Scale stays above CROP so the tight framing is never undone.
      gsap.fromTo(
        image.current,
        { yPercent: -2.5, scale: CROP + 0.06 },
        {
          yPercent: 2.5,
          scale: CROP,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={root} className="relative mx-auto w-[78%] max-w-xs lg:w-full lg:max-w-sm">
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          <clipPath id={clip} clipPathUnits="objectBoundingBox">
            <path d={ARCH} />
          </clipPath>
        </defs>
      </svg>

      {/* Three nested layers: dressed stone, a shadowed reveal, a bronze bead. */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 bg-gradient-to-b from-[#2b2632] via-[#1a1620] to-[#161219]"
        style={{ clipPath: `url(#${clip})` }}
      />
      <div
        aria-hidden="true"
        className="absolute -inset-[1.125rem] bg-gradient-to-b from-[#08070c] to-[#0e0b12]"
        style={{ clipPath: `url(#${clip})` }}
      />
      <div
        aria-hidden="true"
        className="absolute -inset-[3px] bg-gradient-to-b from-bronze/55 via-bronze-dim/40 to-bronze/25"
        style={{ clipPath: `url(#${clip})` }}
      />

      <div
        className="relative aspect-4/5 overflow-hidden bg-obsidian"
        style={{ clipPath: `url(#${clip})` }}
      >
        {failed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#16121c] to-[#0e0b12]">
            <span className="text-carved font-display text-7xl font-bold tracking-widest">
              {initials}
            </span>
          </div>
        ) : (
          <picture>
            <source
              type="image/webp"
              sizes={portrait.sizes}
              srcSet={portrait.webp
                .map((source) => `${source.src} ${source.width}w`)
                .join(", ")}
            />
            <img
              ref={image}
              src={portrait.fallback}
              alt={alt}
              width="1000"
              height="1250"
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                transform: `scale(${CROP})`,
                transformOrigin: "50% 26%",
                filter:
                  "grayscale(0.62) contrast(1.12) brightness(0.9) sepia(0.14)",
              }}
            />
          </picture>
        )}

        {/* Warm rim light from below — the same torch that lights the stone. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(to top, rgba(220,174,116,0.5) 0%, rgba(185,138,82,0.14) 24%, transparent 52%)",
          }}
        />

        {/* Deep vignette. Pushes whatever survived the crop into shadow so the
            face is unambiguously the subject. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(72% 58% at 50% 36%, transparent 18%, rgba(5,4,9,0.62) 56%, rgba(5,4,9,0.95) 100%)",
          }}
        />
      </div>
    </div>
  );
}

export default memo(PortraitNiche);
