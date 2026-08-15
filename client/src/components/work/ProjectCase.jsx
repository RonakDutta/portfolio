import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectFrame from "./ProjectFrame";

gsap.registerPlugin(ScrollTrigger);

/**
 * One project, presented as a case study rather than a card.
 *
 * The screenshot is the anchor in every layout: full-bleed above the copy
 * when featured, and a 3:2 majority of the row otherwise. Below `lg` every
 * variant collapses to the same stack — image first, then copy — so the
 * screenshot stays large on a phone instead of shrinking to a thumbnail.
 */
function ProjectCase({ project, index, env }) {
  const root = useRef(null);

  const {
    name,
    kind,
    featured,
    image,
    imageAlt,
    summary,
    highlights,
    stack,
    live,
    github,
  } = project;

  // 0: image above copy (featured) · 1: image left · 2: image right · repeat
  const variant = featured ? "stacked" : index % 2 === 1 ? "left" : "right";
  const number = String(index + 1).padStart(2, "0");
  const headingId = `project-${project.slug}`;

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        })
        .from(".case-frame", {
          y: 44,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
        })
        .from(
          ".case-line",
          { y: 18, opacity: 0, duration: 0.7, stagger: 0.05, ease: "power3.out" },
          0.2,
        );
    }, root);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  const frame = (
    <ProjectFrame
      className="case-frame"
      src={image}
      alt={imageAlt}
      label={name}
      priority={Boolean(featured)}
      interactive={!env.coarsePointer}
    />
  );

  /* Split in two so the featured layout can set them side by side beneath a
     full-width screenshot, while the narrower layouts stack them. */
  const head = (
    <div>
      <p className="case-line flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.65rem] tracking-[0.28em] text-bronze uppercase">
        <span>Project {number}</span>
        <span aria-hidden="true" className="h-px w-6 bg-bronze/40" />
        <span className="text-parchment/70 normal-case tracking-[0.1em]">
          {kind}
        </span>
      </p>

      <h3
        id={headingId}
        className={`case-line mt-4 font-display leading-[1.02] font-bold text-bone ${
          featured
            ? "text-[clamp(1.9rem,4.4vw,3rem)]"
            : "text-[clamp(1.6rem,3.2vw,2.25rem)]"
        }`}
      >
        {name}
      </h3>

      <p className="case-line mt-5 max-w-prose text-parchment">{summary}</p>

      {stack?.length ? (
        <ul className="case-line mt-6 flex flex-wrap gap-x-2 gap-y-2">
          {stack.map((tech) => (
            <li
              key={tech}
              className="border border-iron px-2.5 py-1 font-mono text-[0.65rem]
                tracking-[0.04em] text-parchment/85"
            >
              {tech}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  const detail = (
    <div>
      {highlights?.length ? (
        <div className="case-line">
          <h4 className="font-mono text-[0.6rem] tracking-[0.3em] text-smoke uppercase">
            Engineering highlights
          </h4>
          <ul className="mt-4 space-y-3 border-l border-iron pl-5">
            {highlights.map((line) => (
              <li key={line} className="text-[0.95rem] leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ProjectLinks live={live} github={github} name={name} />
    </div>
  );

  return (
    <article ref={root} aria-labelledby={headingId} className="relative">
      {variant === "stacked" ? (
        <div className="space-y-10 sm:space-y-14">
          {frame}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            {head}
            {detail}
          </div>
        </div>
      ) : (
        <div
          className={`grid gap-10 lg:items-start lg:gap-14 ${
            variant === "left"
              ? "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
              : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]"
          }`}
        >
          {/* Source order is always image-then-copy; only the desktop column
              swaps, so the reading order stays correct for screen readers. */}
          <div className={variant === "right" ? "lg:order-2" : ""}>{frame}</div>
          <div className={`space-y-8 ${variant === "right" ? "lg:order-1" : ""}`}>
            {head}
            {detail}
          </div>
        </div>
      )}
    </article>
  );
}

function ProjectLinks({ live, github, name }) {
  const links = [
    live ? { label: "Live Demo", href: live } : null,
    github ? { label: "GitHub", href: github } : null,
  ].filter(Boolean);

  if (!links.length) return null;

  return (
    <div className="case-line mt-9 flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer noopener"
          className="group/link inline-flex min-h-11 items-center gap-2.5 border border-iron
            px-5 py-2.5 font-mono text-[0.68rem] tracking-[0.18em] text-bone uppercase
            transition-colors duration-300 hover:border-bronze/55 hover:text-bronze-lit"
        >
          {link.label}
          <span className="sr-only"> — {name} (opens in a new tab)</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            className="h-2.5 w-2.5 transition-transform duration-300
              group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          >
            <path
              d="M2 10 10 2M4 2h6v6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="square"
            />
          </svg>
        </a>
      ))}
    </div>
  );
}

export default memo(ProjectCase);
