import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/typography/SectionTitle";
import GoldGeometry from "../components/atmosphere/GoldGeometry";
import { about } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

function About({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: section.current, start: "top 72%" } })
        .from(".ab-rise", { y: 26, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" })
        .from(".ab-rule", { scaleX: 0, duration: 1.3, ease: "expo.out" }, 0.35);

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
        <SectionTitle
          id="about-title"
          index={about.index}
          label={about.label}
          title={about.title}
          itemClass="ab-rise"
        />

        <div aria-hidden="true" className="ab-rule mt-10 h-px w-full origin-left rule-gold sm:mt-14" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-20">
          <div className="space-y-6 text-[1.05rem] leading-relaxed text-sand/90 font-normal">
            {about.body.map((para, i) => (
              <p key={i} className="ab-rise max-w-prose">
                {para}
              </p>
            ))}
          </div>

          <dl className="ab-facts grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-1">
            {about.facts.map((fact) => (
              <div
                key={fact.term}
                className="ab-fact group relative rounded-xl border border-gold-dark/25 bg-carbon/60 p-6 backdrop-blur-md transition-all duration-500 hover:border-gold-metal/50 hover:bg-carbon/90"
              >
                <dt className="eyebrow-sm text-gold-metal/90 font-medium tracking-[0.24em]">
                  {fact.term}
                </dt>
                <dd className="mt-2 text-[1.15rem] leading-snug font-medium text-ivory">
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
