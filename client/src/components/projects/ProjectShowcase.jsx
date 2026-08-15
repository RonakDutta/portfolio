import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectPlate from "./ProjectPlate";
import Action from "../ui/Action";
import Magnetic from "../fx/Magnetic";
import { work } from "../../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * One project, set as a case sheet.
 *
 * The previous layout mirrored image and text left/right on alternating rows,
 * which is the single most recognisable portfolio template there is. This runs
 * every project through the same masthead → capture → detail band, and gets
 * its variety from where the sheet sits on the page instead: odd projects are
 * inset from the left, even ones from the right, so the column edge moves as
 * you scroll without the content ever reshuffling.
 */
function ProjectShowcase({ project, index, env }) {
  const root = useRef(null);

  const {
    slug,
    name,
    category,
    year,
    featured,
    image,
    imageAlt,
    description,
    highlights,
    stack,
    liveUrl,
    githubUrl,
  } = project;

  const headingId = `project-${slug}`;
  const number = String(index + 1).padStart(2, "0");
  const inset = index % 2 === 0 ? "lg:pr-[6%]" : "lg:pl-[6%]";

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 76%" } })
        .from(".show-line", {
          y: 24,
          opacity: 0,
          duration: 1,
          stagger: 0.07,
          ease: "expo.out",
        })
        .fromTo(
          ".plate-wipe",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out" },
          0.15,
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

  return (
    <article ref={root} aria-labelledby={headingId} className={`relative ${inset}`}>
      <div className="show-line flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.92rem]">
        <span className="font-mono text-[0.78rem] text-brass">{number}</span>
        <span className="text-sand/80">{category}</span>
        {featured ? <span className="text-brass-lit">Featured</span> : null}
        <span className="ml-auto font-mono text-[0.78rem] text-mute">{year}</span>
      </div>

      <h3
        id={headingId}
        className="show-line mt-4 font-display text-[clamp(2.1rem,6vw,4rem)] leading-[1.02]
          font-normal tracking-[-0.03em] text-ivory sm:mt-5"
      >
        {name}
      </h3>

      <p className="show-line mt-5 max-w-[52ch] text-[1.02rem] leading-relaxed text-sand/85">
        {description}
      </p>

      <div className="mt-9 sm:mt-12">
        {liveUrl ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Open live"
            aria-label={`${name}, open the live site`}
            className="block"
          >
            {plate}
          </a>
        ) : (
          plate
        )}
      </div>

      {/* Detail band. Two columns that do not mirror: the build notes carry the
          weight, the stack and the links sit under them in the margin. */}
      <div className="mt-10 grid gap-9 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] lg:gap-16">
        <div className="show-line">
          {stack?.length ? (
            <>
              <p className="font-display text-[1.05rem] text-brass/85">Built with</p>
              <ul className="mt-4 flex flex-wrap gap-x-2.5 gap-y-2.5">
                {stack.map((tech) => (
                  <li
                    key={tech}
                    className="border border-brass/20 px-3 py-1.5 font-mono text-[0.68rem]
                      tracking-[0.08em] text-sand/90 transition-colors duration-500
                      hover:border-brass/50 hover:text-brass-lit"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {liveUrl || githubUrl ? (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {liveUrl ? (
                <Magnetic active={env.pointerFx}>
                  <Action
                    variant="solid"
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {work.openLabel}
                  </Action>
                </Magnetic>
              ) : null}
              {githubUrl ? (
                <Magnetic active={env.pointerFx}>
                  <Action href={githubUrl} target="_blank" rel="noopener noreferrer">
                    {work.sourceLabel}
                  </Action>
                </Magnetic>
              ) : null}
            </div>
          ) : null}
        </div>

        {highlights?.length ? (
          <div className="show-line">
            <p className="font-display text-[1.05rem] text-brass/85">How it was built</p>
            <ul className="mt-4 space-y-4">
              {highlights.map((line, i) => (
                <li
                  key={line}
                  className="flex gap-4 text-[0.96rem] leading-relaxed text-sand/85"
                >
                  <span
                    aria-hidden="true"
                    className="shrink-0 pt-[0.35em] font-mono text-[0.66rem] text-brass/60"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default memo(ProjectShowcase);
