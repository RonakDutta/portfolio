import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/typography/SectionTitle";
import GoldGeometry from "../components/atmosphere/GoldGeometry";
import { about } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Editorial spread. The statement runs the full measure in display serif with
 * its closing clause struck in foil; the biography and the metadata sit below
 * across two unequal columns. No portrait here — the hero carries it, and a
 * second one would halve the first's impact.
 */
function About({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: section.current, start: "top 72%" } })
        .from(".ab-rise", { y: 26, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" })
        .from(".ab-mask > *", { yPercent: 106, duration: 1.5, stagger: 0.09, ease: "expo.out" }, 0.1)
        .from(".ab-rule", { scaleX: 0, duration: 1.3, ease: "expo.out" }, 0.55);

      gsap.from(".ab-fact", {
        y: 18,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ab-facts", start: "top 88%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="about"
      ref={section}
      aria-labelledby="about-title"
      className="relative isolate overflow-x-clip py-28 sm:py-40 lg:py-48"
    >
      <GoldGeometry
        variant="frame"
        className="pointer-events-none top-[6%] -left-[22%] aspect-square w-[70vmin] opacity-50 lg:-left-[8%] lg:w-[46vmin]"
      />

      <div className="relative mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle index={about.index} label={about.label} itemClass="ab-rise" />

        <h2
          id="about-title"
          className="ab-mask mt-12 max-w-5xl font-display text-[clamp(2rem,5.2vw,4.4rem)] leading-[1.1] font-light sm:mt-16"
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="text-ivory-lit block">{about.statement}</span>
          </span>
        </h2>

        <div aria-hidden="true" className="ab-rule mt-16 h-px w-full origin-left bg-line sm:mt-20" />

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-24">
          <div className="space-y-6">
            {about.body.map((para) => (
              <p key={para.slice(0, 24)} className="ab-rise max-w-prose">
                {para}
              </p>
            ))}
          </div>

          <dl className="ab-facts space-y-8">
            {about.facts.map((fact) => (
              <div key={fact.term} className="ab-fact border-t border-line pt-5">
                <dt className="eyebrow-sm text-champagne">{fact.term}</dt>
                <dd className="mt-3 font-display text-[1.35rem] leading-snug font-light text-ivory sm:text-[1.5rem]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default memo(About);
