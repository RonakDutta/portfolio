import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectFrame from "./ProjectFrame";

gsap.registerPlugin(ScrollTrigger);

/**
 * One project as an editorial case study.
 *
 * Three compositions, chosen by position rather than configured per project:
 *   featured — full-measure plate, copy in two columns beneath it
 *   even     — plate right, copy left
 *   odd      — plate left, copy right
 *
 * Below `lg` all three collapse to plate-then-copy, which keeps the screenshot
 * at full content width on a phone instead of reducing it to a thumbnail.
 * Source order is always plate first, so only the desktop column order flips
 * and the reading order stays correct.
 */
function ProjectCase({ project, index, env }) {
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
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        })
        // The plate wipes up rather than sliding: heavier, and it keeps the
        // reserved box perfectly still.
        .fromTo(
          ".case-plate",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out" },
        )
        .from(
          ".case-line",
          { y: 20, opacity: 0, duration: 0.9, stagger: 0.06, ease: "expo.out" },
          0.25,
        );
    }, root);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  const plate = (
    <ProjectFrame
      className="case-plate"
      src={image}
      alt={imageAlt}
      label={name}
      ratio={featured ? "16/9" : "16/10"}
      priority={Boolean(featured)}
      interactive={!env.coarsePointer}
    />
  );

  const head = (
    <div>
      <p className="case-line flex items-center gap-4 eyebrow-sm text-gold">
        <span>{number}</span>
        <span aria-hidden="true" className="h-px w-8 bg-gold/40" />
        <span className="text-stone">{category}</span>
      </p>

      <h3
        id={headingId}
        className={`case-line mt-5 font-display font-light text-ivory ${
          featured
            ? "text-[clamp(2.4rem,6vw,5rem)] leading-[0.95]"
            : "text-[clamp(2rem,4vw,3.25rem)] leading-[1]"
        }`}
      >
        {name}
      </h3>

      <p className="case-line mt-6 max-w-prose text-pearl/80">{description}</p>

      {stack?.length ? (
        <p className="case-line mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 eyebrow-sm text-stone">
          {stack.map((tech, i) => (
            <span key={tech} className="flex items-center gap-3">
              {i > 0 ? (
                <span aria-hidden="true" className="text-gold-deep">
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
          <h4 className="case-line eyebrow-sm text-mute">
            Engineering Highlights
          </h4>
          <ul className="case-line mt-6 space-y-5">
            {highlights.map((line) => (
              <li key={line} className="border-t border-line pt-5 text-[0.95rem]">
                {line}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <Links live={liveUrl} github={githubUrl} name={name} />
    </div>
  );

  return (
    <article ref={root} aria-labelledby={headingId} className="relative">
      {variant === "featured" ? (
        <div className="space-y-12 sm:space-y-16">
          {plate}
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-24">
            {head}
            {detail}
          </div>
        </div>
      ) : (
        <div
          className={`grid gap-12 lg:items-center lg:gap-20 ${
            variant === "left"
              ? "lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
              : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]"
          }`}
        >
          <div className={variant === "right" ? "lg:order-2" : ""}>{plate}</div>
          <div className={`space-y-12 ${variant === "right" ? "lg:order-1" : ""}`}>
            {head}
            {detail}
          </div>
        </div>
      )}
    </article>
  );
}

function Links({ live, github, name }) {
  const links = [
    live ? { label: "View Project", href: live } : null,
    github ? { label: "GitHub", href: github } : null,
  ].filter(Boolean);

  if (!links.length) return null;

  return (
    <div className="case-line mt-10 flex flex-wrap gap-x-10 gap-y-4">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer noopener"
          className="link-rule group/link inline-flex min-h-11 items-center gap-3 eyebrow-sm
            text-ivory transition-colors duration-500 hover:text-gold-pale"
        >
          {link.label}
          <span className="sr-only"> — {name} (opens in a new tab)</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            className="h-2.5 w-2.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
              group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
          >
            <path
              d="M2 10 10 2M4 2h6v6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </a>
      ))}
    </div>
  );
}

export default memo(ProjectCase);
