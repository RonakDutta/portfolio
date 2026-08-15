import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../components/ui/SectionHeading";
import { experience } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Annual-report chronology. The year is set oversized in display serif and
 * carries the eye down the left edge; the entry sits beside it across a
 * hairline. No dots, no connector spine, no timeline furniture.
 */
function Entry({ year, period, title, org, detail, as: Heading = "h4" }) {
  return (
    <li className="exp-entry relative grid gap-4 border-t border-line py-10 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-14 sm:py-12">
      <p
        aria-hidden="true"
        className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-[0.9] font-light text-ash"
      >
        {year}
      </p>

      <div>
        <p className="eyebrow-sm text-gold">{period}</p>

        <Heading className="mt-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight font-light text-ivory">
          {title}
        </Heading>

        <p className="mt-2 text-pearl/75">{org}</p>

        {detail ? (
          <p className="mt-5 max-w-prose text-[0.95rem]">{detail}</p>
        ) : null}
      </div>
    </li>
  );
}

function Experience({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".exp-rise", {
        y: 24,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 76%" },
      });

      gsap.utils.toArray(".exp-entry").forEach((entry) => {
        gsap.from(entry, {
          y: 22,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: entry, start: "top 88%" },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="experience"
      ref={section}
      aria-labelledby="experience-title"
      className="relative isolate overflow-x-clip py-28 sm:py-40 lg:py-48"
    >
      <div className="mx-auto w-full max-w-[104rem] px-6 sm:px-10">
        <SectionHeading
          id="experience-title"
          index={experience.index}
          label={experience.label}
          title={experience.title}
          itemClass="exp-rise"
        />

        <ol className="mt-20 sm:mt-28">
          {experience.roles.map((role) => (
            <Entry key={role.title} {...role} as="h3" />
          ))}
        </ol>

        <h3 className="exp-rise mt-20 flex items-center gap-5 eyebrow text-gold-light sm:mt-24">
          <span aria-hidden="true" className="h-px w-14 bg-gold/40" />
          {experience.educationTitle}
        </h3>

        <ol className="mt-10">
          {experience.education.map((item) => (
            <Entry key={item.title} {...item} />
          ))}
          <li aria-hidden="true" className="h-px w-full bg-line" />
        </ol>
      </div>
    </section>
  );
}

export default memo(Experience);
