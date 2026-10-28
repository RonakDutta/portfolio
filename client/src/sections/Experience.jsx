import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/typography/SectionTitle";
import { experience } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * The chronology, hung off one vertical line.
 *
 * Every entry used to be separated by its own horizontal rule, so the section
 * read as a stack of dividers with text between them. One line down the left
 * with a node per entry does the same job once instead of six times.
 */
function Entry({ year, period, title, org, detail, as: Heading = "h4" }) {
  return (
    <li data-reveal className="group relative pl-8 pb-12 last:pb-0 sm:pl-12">
      <span
        aria-hidden="true"
        className="tl-node absolute top-[0.6rem] left-0 h-2 w-2 -translate-x-1/2 rotate-45
          border border-brass bg-ink group-hover:scale-150"
      />

      <p className="text-[0.88rem] text-brass/85">{period}</p>

      <Heading className="mt-3 font-display text-[clamp(1.4rem,3.4vw,2.05rem)] leading-tight font-normal text-ivory">
        {title}
      </Heading>

      <p className="mt-1.5 text-[0.98rem] text-sand/80">{org}</p>

      {detail ? (
        <p className="mt-4 max-w-[54ch] text-[0.96rem] leading-relaxed text-sand/70">
          {detail}
        </p>
      ) : null}

      <span aria-hidden="true" className="sr-only">
        {year}
      </span>
    </li>
  );
}

/**
 * The spine is drawn as the reader goes down it, with a spark riding the tip,
 * and each node lights as the line arrives (see `.tl-node`). The faint full
 * line underneath is always there, so nothing is missing before the scrub
 * has caught up.
 */
function Timeline({ children, still }) {
  const root = useRef(null);
  const line = useRef(null);
  const spark = useRef(null);

  useLayoutEffect(() => {
    if (still) return;

    const ctx = gsap.context(() => {
      const scrollTrigger = {
        trigger: root.current,
        start: "top 72%",
        end: "bottom 62%",
        scrub: 0.6,
        invalidateOnRefresh: true,
      };
      gsap.fromTo(line.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger });
      gsap.fromTo(
        spark.current,
        { y: 0 },
        { y: () => root.current.offsetHeight, ease: "none", scrollTrigger },
      );
    }, root);

    return () => ctx.revert();
  }, [still]);

  return (
    <ol ref={root} className="relative">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-px bg-brass/15"
      />
      <span
        ref={line}
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-px origin-top will-change-transform"
        style={{
          background:
            "linear-gradient(to bottom, rgba(236,215,163,0.85), rgba(200,164,92,0.45) 70%, rgba(200,164,92,0.2))",
        }}
      />
      {still ? null : (
        <span
          ref={spark}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,246,222,1) 0%, rgba(236,215,163,0.55) 28%, rgba(200,164,92,0) 100%)",
          }}
        />
      )}
      {children}
    </ol>
  );
}

function Experience({ env }) {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative isolate overflow-x-clip py-24 sm:py-32 lg:py-44"
    >
      <div className="mx-auto w-full max-w-[102rem] px-6 sm:px-9">
        <SectionTitle
          id="experience-title"
          title={experience.title}
          script={experience.script}
        />

        <div className="mt-14 grid gap-14 sm:mt-20 lg:grid-cols-2 lg:gap-24">
          <div>
            <p data-reveal className="mb-8 font-display text-[1.1rem] text-sand/70">
              {experience.workTitle}
            </p>
            <Timeline still={env.reducedMotion}>
              {experience.roles.map((role) => (
                <Entry key={role.title} {...role} as="h3" />
              ))}
            </Timeline>
          </div>

          <div>
            <p data-reveal className="mb-8 font-display text-[1.1rem] text-sand/70">
              {experience.educationTitle}
            </p>
            <Timeline still={env.reducedMotion}>
              {experience.education.map((item) => (
                <Entry key={item.title} {...item} as="h3" />
              ))}
            </Timeline>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Experience);
