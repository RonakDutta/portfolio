import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/typography/SectionTitle";
import { skills } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * A technical index, set like the specification page of a catalogue: numbered
 * groups, a gold filament that draws itself across each row, entries as plain
 * display type. Nothing is boxed, nothing is a pill, nothing claims a level.
 */
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

      gsap.utils.toArray(".sk-row").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 90%" } })
          .from(row.querySelector(".sk-rule"), {
            scaleX: 0,
            transformOrigin: "0% 50%",
            duration: 1.2,
            ease: "expo.out",
          })
          .from(
            row.querySelectorAll(".sk-item"),
            { y: 16, opacity: 0, duration: 0.75, stagger: 0.05, ease: "power3.out" },
            0.15,
          );
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

        <dl className="mt-20 sm:mt-28">
          {skills.groups.map((group, i) => (
            <div key={group.name} className="sk-row relative pt-8 pb-10 sm:pt-10 sm:pb-12">
              <span
                aria-hidden="true"
                className="sk-rule absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(212,175,55,0.55), rgba(43,38,32,1) 34%, rgba(43,38,32,1))",
                }}
              />

              <div className="grid gap-6 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-14">
                <dt className="flex items-baseline gap-5">
                  <span aria-hidden="true" className="eyebrow-sm text-gold-dark">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="eyebrow text-champagne">{group.name}</span>
                </dt>

                <dd>
                  <ul className="flex flex-wrap gap-x-10 gap-y-3">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="sk-item font-display text-[1.4rem] leading-tight font-light text-pearl sm:text-[1.7rem]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </div>
          ))}
          <div aria-hidden="true" className="h-px w-full bg-line" />
        </dl>
      </div>
    </section>
  );
}

export default memo(Skills);
