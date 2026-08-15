import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../components/ui/SectionHeading";
import { about } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * An editorial spread. The statement runs across the full measure in display
 * serif; the biography and the metadata sit below it in two unequal columns,
 * separated by a hairline. No portrait here — the hero already carries it,
 * and repeating it would halve its impact.
 */
function About({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: section.current, start: "top 72%" },
        })
        .from(".about-rise", {
          y: 26,
          opacity: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "expo.out",
        })
        .from(
          ".about-statement > *",
          { yPercent: 105, duration: 1.4, stagger: 0.08, ease: "expo.out" },
          0.1,
        )
        .from(".about-rule", { scaleX: 0, duration: 1.2, ease: "expo.out" }, 0.5);

      gsap.from(".about-fact", {
        y: 16,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-facts", start: "top 88%" },
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
      <div className="mx-auto w-full max-w-[104rem] px-6 sm:px-10">
        <SectionHeading
          index={about.index}
          label={about.label}
          itemClass="about-rise"
        />

        {/* The statement, broken by hand so the line endings are deliberate
            rather than whatever the viewport happens to produce. */}
        <h2
          id="about-title"
          className="about-statement mt-12 max-w-5xl font-display text-[clamp(1.9rem,5vw,4rem)] leading-[1.12] font-light text-ivory sm:mt-16"
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="block">{about.statement}</span>
          </span>
        </h2>

        <div
          aria-hidden="true"
          className="about-rule mt-16 h-px w-full origin-left bg-line sm:mt-20"
        />

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-24">
          <div className="space-y-6">
            {about.body.map((para) => (
              <p key={para.slice(0, 24)} className="about-rise max-w-prose">
                {para}
              </p>
            ))}
          </div>

          <dl className="about-facts space-y-8">
            {about.facts.map((fact) => (
              <div
                key={fact.term}
                className="about-fact border-t border-line pt-5"
              >
                <dt className="eyebrow-sm text-gold">{fact.term}</dt>
                <dd className="mt-3 font-display text-[1.3rem] leading-snug font-light text-ivory sm:text-[1.45rem]">
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
