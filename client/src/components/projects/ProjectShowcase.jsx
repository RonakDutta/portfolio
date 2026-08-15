import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectPlate from "./ProjectPlate";
import LuxuryButton from "../ui/LuxuryButton";

gsap.registerPlugin(ScrollTrigger);

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
      <div className="show-line flex items-center gap-3.5">
        <span className="font-mono text-xs font-semibold text-gold-metal">
          #{number}
        </span>
        <span
          aria-hidden="true"
          className="h-px w-8"
          style={{
            background:
              "linear-gradient(90deg, rgba(229,190,72,0.9), rgba(179,134,40,0))",
          }}
        />
        <span className="eyebrow-sm text-sand">{category}</span>
      </div>

      <h3
        id={headingId}
        className={`show-line mt-4 font-display font-semibold tracking-[0.03em] uppercase ${
          featured
            ? "text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[0.98]"
            : "text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.02]"
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
      <p className="show-line max-w-prose text-[1.02rem] leading-relaxed text-sand/90">
        {description}
      </p>

      {stack?.length ? (
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 eyebrow-sm text-sand">
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
        <div>
          <h4 className="eyebrow-sm text-mute">Engineering</h4>
          <ul className="mt-6">
            {highlights.map((line) => (
              <li
                key={line}
                className="border-t border-gold-dark/20 py-4 text-[0.95rem] leading-relaxed text-sand/85"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {liveUrl || githubUrl ? (
        <div className="show-line mt-8 flex flex-wrap items-center gap-4">
          {liveUrl ? (
            <LuxuryButton
              variant="gold"
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              magnetic={env.pointerFx}
            >
              Live Demo ↗
            </LuxuryButton>
          ) : null}
          {githubUrl ? (
            <LuxuryButton
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              magnetic={env.pointerFx}
            >
              GitHub ↗
            </LuxuryButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  if (variant === "featured") {
    return (
      <article
        ref={root}
        aria-labelledby={headingId}
        className="relative"
      >
        <div className="mb-8 sm:mb-12">{masthead}</div>
        {plate}
        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          {body}
          {detail}
        </div>
      </article>
    );
  }

  return (
    <article
      ref={root}
      aria-labelledby={headingId}
      className="relative"
    >
      <div
        className={`grid gap-10 lg:items-center lg:gap-16 ${
          variant === "left"
            ? "lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
            : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
        }`}
      >
        <div className={variant === "right" ? "lg:order-2" : ""}>{plate}</div>
        <div className={`space-y-8 ${variant === "right" ? "lg:order-1" : ""}`}>
          {masthead}
          {body}
          {detail}
        </div>
      </div>
    </article>
  );
}

export default memo(ProjectShowcase);
