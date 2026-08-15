import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/typography/SectionTitle";
import { achievements } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

function Achievements({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".ac-rise", {
        y: 24,
        opacity: 0,
        duration: 0.95,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 80%" },
      });

      gsap.from(".ac-card", {
        y: 22,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ac-grid", start: "top 88%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="achievements"
      ref={section}
      aria-labelledby="achievements-title"
      className="relative isolate overflow-x-clip pb-28 sm:pb-40 lg:pb-48"
    >
      <div className="mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle
          id="achievements-title"
          index={achievements.index}
          label={achievements.label}
          title={achievements.title}
          accent={achievements.accent}
          itemClass="ac-rise"
        />

        <div className="ac-grid mt-16 grid gap-6 sm:mt-24 lg:grid-cols-3">
          {achievements.items.map((item, i) => (
            <div
              key={item.name}
              className="ac-card group relative flex flex-col justify-between rounded-2xl border border-gold-dark/25 bg-carbon/60 p-7 sm:p-8 backdrop-blur-md transition-all duration-500 hover:border-gold-metal/50 hover:bg-carbon/90 hover:shadow-[0_0_28px_rgba(212,175,55,0.14)]"
            >
              {/* Gold Top Light Filament */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px transition-opacity duration-500 opacity-60 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(229,190,72,0.85) 50%, transparent)",
                }}
              />

              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold-dark/30 bg-coal/80 px-3 py-1 text-[0.68rem] font-medium tracking-[0.2em] uppercase text-champagne">
                    <span className="h-1 w-1 rounded-full bg-gold-metal" />
                    {item.org}
                  </span>

                  <span className="font-mono text-xs font-semibold text-gold-dark/70 group-hover:text-gold-metal">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-[1.4rem] font-semibold leading-snug text-ivory group-hover:text-gold-white transition-colors">
                  {item.name}
                </h3>

                <p className="mt-3.5 text-[0.94rem] leading-relaxed text-sand/85">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Achievements);
