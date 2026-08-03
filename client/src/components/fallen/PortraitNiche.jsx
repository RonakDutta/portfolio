import { memo, useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * A portrait set into a carved stone niche.
 *
 * The arch is a `clip-path` in objectBoundingBox units, so one path definition
 * scales to any frame size without recomputing, and the same gothic point that
 * cuts the gate upstairs cuts this, which is what ties the two sections
 * together visually.
 *
 * The emerge-from-darkness reveal is an opacity tween on a black overlay, not a
 * `filter: brightness()` tween on the image. Filters repaint the whole element
 * every frame; overlay opacity composites. Same look, a fraction of the cost.
 *
 * With no photo present it degrades to a carved slab bearing the initials, so
 * the layout is never broken by a missing file.
 */

/**
 * Lancet arch in 0-1 space.
 *
 * Cubics, not quadratics: the point only reads if the tangent at the apex is
 * steep, which means the trailing control handle has to sit almost directly
 * below it. Quadratic handles at the corners give a rounded rectangle instead.
 */
const ARCH = "M0,1 L0,0.58 C0,0.30 0.34,0.12 0.5,0 C0.66,0.12 1,0.30 1,0.58 L1,1 Z";

function PortraitNiche({ src, alt, initials = "", reducedMotion = false }) {
  const uid = useId().replace(/:/g, "");
  const clip = `arch-${uid}`;
  const root = useRef(null);
  const image = useRef(null);
  const shroud = useRef(null);

  // No src, or a src that 404s, both fall through to the carved slab.
  const [failed, setFailed] = useState(!src);

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Emerging from the dark as the niche enters the viewport. fromTo, not
      // to: the shroud's resting state in CSS has to be transparent so that
      // skipping this effect leaves the portrait visible rather than blacked
      // out. GSAP paints it back in on mount and clears it on scroll.
      gsap.fromTo(shroud.current, { opacity: 1 }, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          end: "top 35%",
          scrub: 0.6,
        },
      });

      // The portrait drifts inside its frame. The stone is fixed, the face
      // is not, which keeps the niche from feeling like a flat pasted rectangle.
      gsap.fromTo(
        image.current,
        { yPercent: -4, scale: 1.1 },
        {
          yPercent: 4,
          scale: 1.02,
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
    // Narrowed on small screens so the -inset-5 surround still clears the
    // section padding instead of bleeding off the edge of the viewport.
    <div ref={root} className="relative mx-auto w-[84%] max-w-sm lg:w-full lg:max-w-md">
      {/* One path, reused by the frame and the portrait. */}
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          <clipPath id={clip} clipPathUnits="objectBoundingBox">
            <path d={ARCH} />
          </clipPath>
        </defs>
      </svg>

      {/* Carved surround. Three stacked shapes, each slightly tighter than the
          last, so the jamb reads as depth cut into the wall rather than a
          border drawn around a picture. Light enough to actually separate from
          the background. A dark-on-dark frame is the same as no frame. */}
      <div
        aria-hidden="true"
        className="absolute -inset-5 bg-gradient-to-b from-[#3a323f] via-[#221c2a] to-[#3d2419]"
        style={{ clipPath: `url(#${clip})` }}
      />
      {/* Shadowed reveal between the outer stone and the opening. */}
      <div
        aria-hidden="true"
        className="absolute -inset-2.5 bg-gradient-to-b from-[#0b0810] to-[#160d10]"
        style={{ clipPath: `url(#${clip})` }}
      />
      {/* Heat catching the inner edge of the stone. */}
      <div
        aria-hidden="true"
        className="absolute -inset-1 bg-gradient-to-t from-brimstone/70 via-ember/20 to-transparent"
        style={{ clipPath: `url(#${clip})` }}
      />

      <div
        className="relative aspect-4/5 overflow-hidden bg-obsidian"
        style={{ clipPath: `url(#${clip})` }}
      >
        {failed ? (
          // Carved slab: what the niche holds until a photo is dropped in.
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#15101a] to-[#241511]">
            <span className="text-carved font-display text-7xl font-black tracking-widest">
              {initials}
            </span>
          </div>
        ) : (
          <img
            ref={image}
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
            // Bright, clear and vibrant portrait grading.
            style={{ filter: "brightness(1.05) contrast(1.08) sepia(0.10)" }}
          />
        )}

        {/* Soft warm uplight from the lava below. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background:
              "linear-gradient(to top, rgba(255,77,0,0.25) 0%, rgba(255,138,31,0.08) 22%, transparent 50%)",
          }}
        />

        {/* Soft shadow in upper arch corners. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 100%, transparent 60%, rgba(5,3,10,0.35) 100%)",
          }}
        />

        {/* The darkness it emerges from. */}
        <div
          ref={shroud}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-void opacity-0"
        />
      </div>
    </div>
  );
}

export default memo(PortraitNiche);
