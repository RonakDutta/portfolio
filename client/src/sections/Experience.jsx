import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/typography/SectionTitle";
import { experience } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

function Entry({ year, period, title, org, detail, as: Heading = "h4" }) {
  return (
    <li className="xp-entry group relative rounded-2xl border border-gold-dark/20 bg-carbon/50 p-6 sm:p-8 backdrop-blur-sm transition-all duration-500 hover:border-gold-metal/50 hover:bg-carbon/80">
      {/* Lit top edge */}
      <span
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-px transition-opacity duration-500 opacity-50 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(229,190,72,0.7) 50%, transparent)",
        }}
      />

      <div className="grid gap-6 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-10 sm:items-start">
        <div className="flex flex-col">
          <span className="font-display text-[clamp(2.5rem,5vw,3.8rem)] font-bold leading-none tracking-tight text-transparent [-webkit-text-stroke:1.2px_rgba(212,175,55,0.4)] group-hover:[-webkit-text-stroke:1.2px_rgba(255,217,102,0.9)] transition-all">
            {year}
          </span>
          <span className="mt-2 font-mono text-[0.68rem] tracking-[0.2em] uppercase text-champagne/90">
            {period}
          </span>
        </div>

        <div>
          <Heading className="font-display text-[clamp(1.4rem,2.8vw,2rem)] leading-snug font-semibold text-ivory group-hover:text-gold-white transition-colors">
            {title}
          </Heading>

          <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-gold-metal/90">
            <span className="h-1.5 w-1.5 rotate-45 bg-gold-metal" />
            {org}
          </p>

          {detail ? (
            <p className="mt-4 max-w-prose text-[0.98rem] leading-relaxed text-sand/85">
              {detail}
            </p>
          ) : null}
        </div>
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

        <div className="mt-16 sm:mt-24">
          <ol className="space-y-6">
            {experience.roles.map((role) => (
              <Entry key={role.title} {...role} as="h3" />
            ))}
          </ol>
        </div>

        <div className="mt-20 sm:mt-28">
          <p className="xp-rise mb-6 flex items-center gap-3 eyebrow-sm text-gold-bright">
            <span className="h-1.5 w-1.5 rotate-45 bg-gold-metal" />
            {experience.educationTitle}
          </p>

          <ol className="space-y-6">
            {experience.education.map((item) => (
              <Entry key={item.title} {...item} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default memo(Experience);
