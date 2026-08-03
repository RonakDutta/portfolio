import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Chamber from "../components/chambers/Chamber";
import SectionMark from "../components/ui/SectionMark";
import { chambers } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section IV: Chambers.
 *
 * A stacked list rather than a grid. These carry real detail, and a
 * three-across grid would either crop the work down to a sentence or leave
 * three columns of ragged text. Stacked, each project gets full width to
 * separate what it is from what was done to build it.
 *
 * Length is whatever `chambers.projects` holds. Nothing here counts to three.
 */
function Chambers({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".chambers-rise", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 72%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="chambers"
      ref={section}
      aria-labelledby="chambers-title"
      className="relative isolate py-28 sm:py-36 overflow-x-clip"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(72% 58% at 50% 40%, rgba(5,3,10,0.96) 0%, rgba(5,3,10,0.86) 55%, rgba(5,3,10,0.45) 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <SectionMark roman="IV" label="Chambers" className="chambers-rise justify-center" />

          <h2 id="chambers-title" className="mt-7">
            <span className="text-molten chambers-rise block font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] font-black">
              {chambers.headline}
            </span>
            <span className="chambers-rise mt-3 block font-blackletter text-[clamp(1.35rem,3vw,2rem)] leading-none text-brimstone/85">
              {chambers.headlineSub}
            </span>
          </h2>

          <p className="chambers-rise mx-auto mt-6 max-w-md text-parchment/85">{chambers.lede}</p>
        </header>

        <div className="mt-16 space-y-8 sm:mt-20 sm:space-y-10">
          {chambers.projects.map((project, i) => (
            <Chamber
              key={project.name}
              project={project}
              index={i}
              reducedMotion={env.reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Chambers);
