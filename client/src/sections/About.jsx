import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PortraitNiche from "../components/about/PortraitNiche";
import SectionHeader from "../components/ui/SectionHeader";
import { identity, about } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

function About({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: section.current, start: "top 70%" },
        })
        .from(
          ".about-frame",
          { y: 32, opacity: 0, duration: 1.1, ease: "expo.out" },
          0,
        )
        .from(
          ".about-rise",
          { y: 24, opacity: 0, duration: 0.9, stagger: 0.07, ease: "expo.out" },
          0.15,
        );

      gsap.from(".about-fact", {
        opacity: 0,
        y: 14,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-facts", start: "top 88%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="fallen"
      ref={section}
      aria-labelledby="about-title"
      className="relative isolate overflow-x-clip py-28 sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(76% 60% at 50% 50%, rgba(5,4,9,0.95) 0%, rgba(5,4,9,0.82) 56%, rgba(5,4,9,0.4) 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-6">
        <div
          className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:gap-20"
        >
          <div className="about-frame lg:sticky lg:top-28">
            <PortraitNiche
              portrait={about.portrait}
              alt={about.portraitAlt}
              initials={identity.initials}
              reducedMotion={env.reducedMotion}
            />
          </div>

          <div>
            <SectionHeader
              id="about-title"
              index={about.index}
              label={about.label}
              title={about.title}
              lede={about.lede}
              itemClass="about-rise"
            />

            <div className="mt-9 space-y-5">
              {about.body.map((para) => (
                <p key={para.slice(0, 24)} className="about-rise max-w-prose">
                  {para}
                </p>
              ))}
            </div>

            <dl className="about-facts mt-12 grid gap-px border border-iron/70 bg-iron/70 sm:grid-cols-2">
              {about.facts.map((fact) => (
                <div key={fact.term} className="about-fact bg-obsidian px-5 py-4">
                  <dt className="font-mono text-[0.62rem] tracking-[0.24em] text-bronze uppercase">
                    {fact.term}
                  </dt>
                  <dd className="mt-2 text-[0.95rem] leading-relaxed text-bone">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(About);
