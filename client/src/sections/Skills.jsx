import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ForgedTag from "../components/ui/ForgedTag";
import SectionHeader from "../components/ui/SectionHeader";
import { skills } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

function Skills({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".skills-rise", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 74%" },
      });

      gsap.utils.toArray(".skills-row").forEach((row) => {
        gsap.from(row, {
          y: 18,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 90%" },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="arsenal"
      ref={section}
      aria-labelledby="skills-title"
      className="relative isolate overflow-x-clip py-28 sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(78% 62% at 50% 50%, rgba(5,4,9,0.96) 0%, rgba(5,4,9,0.86) 56%, rgba(5,4,9,0.45) 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-5xl px-6">
        <SectionHeader
          id="skills-title"
          index={skills.index}
          label={skills.label}
          title={skills.title}
          lede={skills.lede}
          itemClass="skills-rise"
        />

        {/* A ledger, not a badge cloud: label left, contents right, hairline
            between. Readable top to bottom at a glance. */}
        <dl className="mt-16 border-t border-iron sm:mt-20">
          {skills.groups.map((group) => (
            <div
              key={group.name}
              className="skills-row grid items-start gap-4 border-b border-iron py-7
                sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-10"
            >
              <dt className="flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 translate-y-[-0.15rem] rotate-45 border border-bronze/70"
                />
                <span className="font-mono text-[0.72rem] tracking-[0.24em] text-bone uppercase">
                  {group.name}
                </span>
              </dt>

              <dd>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <ForgedTag key={item} label={item} />
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default memo(Skills);
