import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectPlate from "./ProjectPlate";
import GoldLink from "../ui/GoldLink";

gsap.registerPlugin(ScrollTrigger);

/**
 * A project presented as a product launch.
 *
 * Three compositions, chosen by position rather than configured per project:
 *   featured — full-measure plate under a large masthead, copy in two columns
 *   even     — plate right, copy left
 *   odd      — plate left, copy right
 *
 * Below `lg` all three collapse to plate-then-copy, so the capture keeps the
 * full content width on a phone. Source order is always plate first; only the
 * desktop column order flips, so reading order stays correct.
 */
function ProjectShowcase({ project, index, env }) {
  const root = useRef(null);

  const {
    slug,
    name,
    category,
    featured,
    image,
    imageAlt,
    description,
    highlights,
    stack,
    liveUrl,
    githubUrl,
  } = project;

  const variant = featured ? "featured" : index % 2 === 0 ? "right" : "left";
  const headingId = `project-${slug}`;
  const number = String(index + 1).padStart(2, "0");

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 78%" } })
        // The plate wipes up rather than sliding: heavier, and the reserved
        // box never moves.
        .fromTo(
          ".plate-wipe",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.out" },
        )
        .from(
          ".show-line",
          { y: 22, opacity: 0, duration: 1, stagger: 0.06, ease: "expo.out" },
          0.28,
        );
    }, root);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  const plate = (
    <ProjectPlate
      className="plate-wipe"
      src={image}
      alt={imageAlt}
      label={name}
      priority={Boolean(featured)}
      interactive={!env.coarsePointer}
    />
  );

  const masthead = (
    <div>
      <p className="show-line flex items-center gap-4 eyebrow-sm text-champagne">
        <span className="text-gold-dark">{number}</span>
        <span
          aria-hidden="true"
          className="h-px w-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,175,55,0.9), rgba(140,101,8,0))",
          }}
        />
        <span className="text-sand">{category}</span>
      </p>

      <h3
        id={headingId}
        className={`show-line mt-5 font-display font-light ${
          featured
            ? "text-[clamp(2.6rem,7vw,6rem)] leading-[0.94]"
            : "text-[clamp(2.1rem,4.4vw,3.6rem)] leading-[1]"
        }`}
      >
        <span className={featured ? "text-foil animate-foil" : "text-ivory-lit"}>
          {name}
        </span>
      </h3>
    </div>
  );

  const body = (
    <div>
      <p className="show-line max-w-prose text-pearl/80">{description}</p>

      {stack?.length ? (
        <p className="show-line mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 eyebrow-sm text-sand">
          {stack.map((tech, i) => (
            <span key={tech} className="flex items-center gap-3">
              {i > 0 ? (
                <span aria-hidden="true" className="text-gold-dark">
                  ·
                </span>
              ) : null}
              {tech}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );

  const detail = (
    <div>
      {highlights?.length ? (
        <>
          <h4 className="show-line eyebrow-sm text-mute">Engineering</h4>
          <ul className="show-line mt-6 space-y-5">
            {highlights.map((line) => (
              <li
                key={line}
                className="border-t border-line pt-5 text-[0.95rem] leading-relaxed"
              >
                {line}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {liveUrl || githubUrl ? (
        <div className="show-line mt-10 flex flex-wrap gap-x-10 gap-y-4">
          {liveUrl ? (
            <GoldLink href={liveUrl} context={name}>
              View Project
            </GoldLink>
          ) : null}
          {githubUrl ? (
            <GoldLink href={githubUrl} context={name}>
              GitHub
            </GoldLink>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  if (variant === "featured") {
    return (
      <article ref={root} aria-labelledby={headingId} className="relative">
        <div className="mb-12 sm:mb-16">{masthead}</div>
        {plate}
        <div className="mt-14 grid gap-12 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
          {body}
          {detail}
        </div>
      </article>
    );
  }

  return (
    <article ref={root} aria-labelledby={headingId} className="relative">
      <div
        className={`grid gap-12 lg:items-center lg:gap-20 ${
          variant === "left"
            ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
            : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]"
        }`}
      >
        <div className={variant === "right" ? "lg:order-2" : ""}>{plate}</div>
        <div className={`space-y-10 ${variant === "right" ? "lg:order-1" : ""}`}>
          {masthead}
          {body}
          {detail}
        </div>
      </div>
    </article>
  );
}

export default memo(ProjectShowcase);
