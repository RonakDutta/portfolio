import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/typography/SectionTitle";
import { skills } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

function Skills({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".sk-rise", {
        y: 26,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 76%" },
      });

      gsap.from(".sk-card", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".sk-grid", start: "top 85%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="skills"
      ref={section}
      aria-labelledby="skills-title"
      className="relative isolate overflow-x-clip py-28 sm:py-40 lg:py-48"
    >
      <div className="mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle
          id="skills-title"
          index={skills.index}
          label={skills.label}
          title={skills.title}
          accent={skills.accent}
          itemClass="sk-rise"
        />

        <div className="sk-grid mt-16 grid gap-6 sm:mt-24 sm:grid-cols-2 lg:grid-cols-3">
          {skills.groups.map((group, i) => (
            <div
              key={group.name}
              className="sk-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gold-dark/25 bg-carbon/60 p-7 sm:p-8 backdrop-blur-md transition-all duration-500 hover:border-gold-metal/50 hover:bg-carbon/90 hover:shadow-[0_0_30px_rgba(212,175,55,0.12)]"
            >
              {/* Gold Top Light Filament */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px transition-opacity duration-500 opacity-60 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(229,190,72,0.8) 50%, transparent)",
                }}
              />

              {/* Card Corner Trim */}
              <div className="absolute top-0 right-0 h-5 w-5 overflow-hidden">
                <div className="h-full w-full origin-bottom-left rotate-45 bg-gold-dark/20 transition-colors group-hover:bg-gold-metal/60" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-gold-metal">
                    0{i + 1}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-dark/40 group-hover:bg-gold-metal" />
                </div>

                <h3 className="mt-4 font-display text-xl font-semibold uppercase tracking-[0.05em] text-ivory transition-colors group-hover:text-gold-white">
                  {group.name}
                </h3>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gold-dark/20 bg-coal/70 px-3.5 py-1.5 text-xs font-medium text-sand/90 transition-all duration-300 group-hover:border-gold-dark/40 hover:!border-gold-metal hover:!text-gold-white hover:!bg-coal"
                    >
                      <span className="h-1 w-1 rounded-full bg-gold-metal/60" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Skills);
