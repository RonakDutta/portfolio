import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PortraitNiche from "../components/fallen/PortraitNiche";
import SectionMark from "../components/ui/SectionMark";
import { identity, fallen } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section II: The Fallen One.
 *
 * The portrait section, and the first place the descent stops moving long
 * enough to read. Copy sits right of the niche on desktop and below it on
 * mobile, where a portrait competing with a paragraph for width helps nobody.
 */
function Fallen({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".fallen-rise", {
        y: 44,
        opacity: 0,
        duration: 1.1,
        stagger: 0.09,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 68%" },
      });

      gsap.from(".fallen-fact", {
        opacity: 0,
        x: -18,
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: ".fallen-facts", start: "top 85%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="fallen"
      ref={section}
      aria-labelledby="fallen-title"
      className="relative isolate flex min-h-screen items-center py-28 sm:py-36 overflow-x-clip"
    >
      {/* Copy floor. The lava runs hot behind this section too, and body text
          needs a darker ground than a heading does to stay comfortable. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(78% 62% at 50% 50%, rgba(5,3,10,0.94) 0%, rgba(5,3,10,0.8) 55%, rgba(5,3,10,0.35) 100%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:gap-30">
        <div className="fallen-rise">
          <PortraitNiche
            src={fallen.portrait}
            alt={fallen.portraitAlt}
            initials={identity.initials}
            reducedMotion={env.reducedMotion}
          />
        </div>

        <div>
          <SectionMark
            roman="II"
            label="The Fallen One"
            className="fallen-rise"
          />

          <h2 id="fallen-title" className="mt-7">
            <span className="text-molten fallen-rise block font-display text-[clamp(2.25rem,5.5vw,4rem)] leading-[0.95] font-black">
              {fallen.headline}
            </span>
            <span className="fallen-rise mt-3 block font-blackletter text-[clamp(1.5rem,3.2vw,2.25rem)] leading-none text-brimstone/85">
              {fallen.headlineSub}
            </span>
          </h2>

          <div className="mt-8 space-y-5">
            {fallen.body.map((para) => (
              <p
                key={para.slice(0, 24)}
                className="fallen-rise max-w-prose text-parchment/90"
              >
                {para}
              </p>
            ))}
          </div>

          <dl className="fallen-facts mt-11 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {fallen.facts.map((fact) => (
              <div
                key={fact.term}
                className="fallen-fact border-l border-ember/35 pl-4"
              >
                <dt className="font-display text-[0.6rem] tracking-[0.32em] text-ember/85 uppercase">
                  {fact.term}
                </dt>
                <dd className="mt-1.5 text-bone">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default memo(Fallen);
