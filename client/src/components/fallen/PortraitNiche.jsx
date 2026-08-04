import { memo, useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ARCH = "M0,1 L0,0.58 C0,0.30 0.34,0.12 0.5,0 C0.66,0.12 1,0.30 1,0.58 L1,1 Z";

function PortraitNiche({ portrait, alt, initials = "", reducedMotion = false }) {
  const uid = useId().replace(/:/g, "");
  const clip = `arch-${uid}`;
  const root = useRef(null);
  const image = useRef(null);
  const shroud = useRef(null);

const [failed, setFailed] = useState(!portrait?.fallback);

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {

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

<div ref={root} className="relative mx-auto w-[84%] max-w-sm lg:w-full lg:max-w-md">
      {}
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          <clipPath id={clip} clipPathUnits="objectBoundingBox">
            <path d={ARCH} />
          </clipPath>
        </defs>
      </svg>

      {}
      <div
        aria-hidden="true"
        className="absolute -inset-5 bg-gradient-to-b from-[#3a323f] via-[#221c2a] to-[#3d2419]"
        style={{ clipPath: `url(#${clip})` }}
      />
      {}
      <div
        aria-hidden="true"
        className="absolute -inset-2.5 bg-gradient-to-b from-[#0b0810] to-[#160d10]"
        style={{ clipPath: `url(#${clip})` }}
      />
      {}
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
          
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#15101a] to-[#241511]">
            <span className="text-carved font-display text-7xl font-black tracking-widest">
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
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
              
              style={{ filter: "brightness(1.05) contrast(1.08) sepia(0.10)" }}
            />
          </picture>
        )}

        {}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background:
              "linear-gradient(to top, rgba(255,77,0,0.25) 0%, rgba(255,138,31,0.08) 22%, transparent 50%)",
          }}
        />

        {}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 100%, transparent 60%, rgba(5,3,10,0.35) 100%)",
          }}
        />

        {}
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
