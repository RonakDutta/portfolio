import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../components/ui/SectionHeading";
import { skills } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * A specification sheet, not a badge cloud. Each group is a ruled row: the
 * category set small and gold on the left, the entries listed as plain type
 * on the right. Nothing is boxed, nothing is a pill, nothing claims a
 * percentage.
 */
function Skills({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".skills-rise", {
        y: 24,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 76%" },
      });

      gsap.utils.toArray(".skills-row").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 90%" } })
          .from(row.querySelector(".skills-rule"), {
            scaleX: 0,
            transformOrigin: "0% 50%",
            duration: 1.1,
            ease: "expo.out",
          })
          .from(
            row.querySelectorAll(".skills-item"),
            {
              y: 14,
              opacity: 0,
              duration: 0.7,
              stagger: 0.045,
              ease: "power3.out",
            },
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
      <div className="mx-auto w-full max-w-[104rem] px-6 sm:px-10">
        <SectionHeading
          id="skills-title"
          index={skills.index}
          label={skills.label}
          title={skills.title}
          itemClass="skills-rise"
        />

        <dl className="mt-20 sm:mt-28">
          {skills.groups.map((group) => (
            <div key={group.name} className="skills-row relative pt-8 pb-10 sm:pt-10 sm:pb-12">
              <span
                aria-hidden="true"
                className="skills-rule absolute inset-x-0 top-0 h-px bg-line"
              />

              <div className="grid gap-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-14">
                <dt className="flex items-baseline gap-4">
                  <span aria-hidden="true" className="h-px w-6 bg-gold/50" />
                  <span className="eyebrow text-gold-light">{group.name}</span>
                </dt>

                <dd>
                  <ul className="flex flex-wrap gap-x-10 gap-y-3">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="skills-item font-display text-[1.35rem] leading-tight
                          font-light text-pearl sm:text-[1.6rem]"
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
