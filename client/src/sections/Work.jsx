import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectShowcase from "../components/projects/ProjectShowcase";
import SectionTitle from "../components/typography/SectionTitle";
import { work } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

function Work({ env }) {
  const section = useRef(null);
  const [featured, ...rest] = work.projects;

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".wk-rise", {
        y: 26,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 76%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="work"
      ref={section}
      aria-labelledby="work-title"
      className="relative isolate overflow-x-clip py-28 sm:py-40 lg:py-48"
    >
      <div className="mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle
          id="work-title"
          index={work.index}
          label={work.label}
          title={work.title}
          accent={work.accent}
          itemClass="wk-rise"
        />

        <div className="mt-20 sm:mt-28">
          <p className="wk-rise mb-12 flex items-center gap-5 eyebrow-sm text-gold-bright sm:mb-16">
            <span
              aria-hidden="true"
              className="h-px w-16"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,217,102,0.95), rgba(140,101,8,0))",
              }}
            />
            {work.featuredLabel}
          </p>
          <ProjectShowcase project={featured} index={0} env={env} />
        </div>

        <div className="mt-32 space-y-32 sm:mt-44 sm:space-y-44">
          {rest.map((project, i) => (
            <ProjectShowcase key={project.slug} project={project} index={i + 1} env={env} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Work);
