import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ForgedTag from "../components/arsenal/ForgedTag";
import SectionMark from "../components/ui/SectionMark";
import EmberField from "../components/ui/EmberField";
import { arsenal } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section III: Arsenal.
 *
 * An inventory, not a card grid. The grid version put five panels of unequal
 * height into two ragged rows, and with the tag counts running from two to
 * five, nothing lined up with anything: it read as scattered boxes rather than
 * a rack wall.
 *
 * Rows fix that. Every group label sits in the same fixed left column, every
 * set of tags starts on the same x, and the rule between rows carries the eye
 * straight down. Alignment is what makes an armoury look kept.
 */
function Arsenal({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      // An armoury is hung, so this section arrives from above rather than
      // below: the header drops and settles with a little weight behind it,
      // which is the opposite of every other heading on the page and reads
      // that way even though the distance is small.
      gsap.from(".arsenal-rise", {
        y: -34,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: section.current, start: "top 70%" },
      });

      // The forge line burns downward as the rack comes into view.
      gsap.from(".arsenal-spine", {
        scaleY: 0,
        transformOrigin: "50% 0%",
        ease: "none",
        scrollTrigger: {
          trigger: ".arsenal-rows",
          start: "top 82%",
          end: "bottom 65%",
          scrub: 0.5,
        },
      });

      gsap.utils.toArray(".arsenal-rack").forEach((rack) => {
        gsap
          .timeline({ scrollTrigger: { trigger: rack, start: "top 88%" } })
          .from(rack, { x: -24, opacity: 0, duration: 0.7, ease: "expo.out" })
          // Tags settle onto the rail, each a moment after the last. Straight
          // down and square: an earlier version rotated them in from -5deg,
          // and a row of hard-edged plates caught mid-tilt reads as a layout
          // fault rather than as motion. On a rack, things hang level.
          .from(
            rack.querySelectorAll(".arsenal-tag"),
            {
              y: -12,
              opacity: 0,
              duration: 0.45,
              stagger: 0.045,
              ease: "power2.out",
            },
            0.18,
          );
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="arsenal"
      ref={section}
      aria-labelledby="arsenal-title"
      className="relative isolate flex min-h-screen items-center py-28 sm:py-36 overflow-x-clip"
    >
      {/* Copy floor. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(80% 65% at 50% 50%, rgba(5,3,10,0.96) 0%, rgba(5,3,10,0.85) 55%, rgba(5,3,10,0.42) 100%)",
        }}
      />

      {/* The forge itself, banked under the rack and breathing. */}
      <div
        aria-hidden="true"
        className="animate-pulse-glow pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-1/2"
        style={{
          background:
            "radial-gradient(58% 100% at 50% 118%, rgba(255,77,0,0.34) 0%, rgba(139,15,22,0.16) 42%, transparent 72%)",
        }}
      />

      <EmberField
        count={16}
        reducedMotion={env.reducedMotion}
        isMobile={env.isMobile}
        className="-z-10"
      />

      <div className="relative mx-auto w-full max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <SectionMark roman="III" label="Arsenal" className="arsenal-rise justify-center" />

          <h2 id="arsenal-title" className="mt-7">
            <span className="text-molten arsenal-rise block font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] font-black">
              {arsenal.headline}
            </span>
            <span className="arsenal-rise mt-3 block font-blackletter text-[clamp(1.35rem,3vw,2rem)] leading-none text-brimstone/85">
              {arsenal.headlineSub}
            </span>
          </h2>

          <p className="arsenal-rise mx-auto mt-6 max-w-md text-parchment">{arsenal.lede}</p>
        </header>

        <div className="arsenal-rows relative mt-16 sm:mt-20">
          {/* Molten spine down the left of the whole rack. */}
          <span
            aria-hidden="true"
            className="arsenal-spine absolute inset-y-0 left-0 hidden w-px
              bg-gradient-to-b from-ember via-ember/45 to-transparent sm:block"
          />

          <div className="border-t border-iron/60 sm:pl-8">
            {arsenal.racks.map((rack) => (
              <div
                key={rack.name}
                className="arsenal-rack grid items-start gap-4 border-b border-iron/60 py-6
                  sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-8 sm:py-7"
              >
                <div className="flex items-baseline gap-3 sm:pt-2.5">
                  {/* Rune struck on the rack rail. */}
                  <span
                    aria-hidden="true"
                    className="mt-1 h-1.5 w-1.5 shrink-0 rotate-45 border border-ember/80 bg-ember/25"
                  />
                  <h3 className="font-display text-[0.72rem] font-bold tracking-[0.3em] text-hellfire uppercase">
                    {rack.name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="font-display text-[0.6rem] tracking-widest text-smoke"
                  >
                    {String(rack.items.length).padStart(2, "0")}
                  </span>
                </div>

                <ul className="flex flex-wrap gap-2.5">
                  {rack.items.map((item) => (
                    <ForgedTag key={item} label={item} className="arsenal-tag" />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Arsenal);
