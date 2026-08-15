import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/typography/SectionTitle";
import { experience } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Annual-report chronology. The year is set oversized in the left margin and
 * carries the eye down the page; a single lit point marks each entry. No
 * connector spine, no dots-and-line timeline furniture.
 */
function Entry({ year, period, title, org, detail, as: Heading = "h4" }) {
  return (
    <li className="xp-entry relative grid gap-4 border-t border-line py-10 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-14 sm:py-14">
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-px w-16"
        style={{
          background: "linear-gradient(90deg, #ffd966, rgba(140,101,8,0))",
        }}
      />

      <p
        aria-hidden="true"
        className="font-display text-[clamp(2.6rem,6.5vw,4.5rem)] leading-[0.9] font-light text-slate"
      >
        {year}
      </p>

      <div>
        <p className="eyebrow-sm text-champagne">{period}</p>

        <Heading className="mt-4 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] leading-tight font-light text-ivory">
          {title}
        </Heading>

        <p className="mt-2 text-pearl/75">{org}</p>

        {detail ? <p className="mt-5 max-w-prose text-[0.95rem]">{detail}</p> : null}
      </div>
    </li>
  );
}

function Experience({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".xp-rise", {
        y: 26,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 76%" },
      });

      gsap.utils.toArray(".xp-entry").forEach((entry) => {
        gsap.from(entry, {
          y: 24,
          opacity: 0,
          duration: 0.95,
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
      <div className="mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle
          id="experience-title"
          index={experience.index}
          label={experience.label}
          title={experience.title}
          accent={experience.accent}
          itemClass="xp-rise"
        />

        <ol className="mt-20 sm:mt-28">
          {experience.roles.map((role) => (
            <Entry key={role.title} {...role} as="h3" />
          ))}
        </ol>

        <h3 className="xp-rise mt-20 flex items-center gap-5 eyebrow text-gold-bright sm:mt-24">
          <span
            aria-hidden="true"
            className="h-px w-16"
            style={{
              background: "linear-gradient(90deg, rgba(255,217,102,0.95), rgba(140,101,8,0))",
            }}
          />
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
