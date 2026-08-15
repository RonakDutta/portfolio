import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCase from "../components/work/ProjectCase";
import SectionHeading from "../components/ui/SectionHeading";
import { work } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

function Work({ env }) {
  const section = useRef(null);
  const [featured, ...rest] = work.projects;

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".work-rise", {
        y: 24,
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
      <div className="mx-auto w-full max-w-[104rem] px-6 sm:px-10">
        <SectionHeading
          id="work-title"
          index={work.index}
          label={work.label}
          title={work.title}
          itemClass="work-rise"
        />

        {/* The flagship gets the full measure and its own masthead line. */}
        <div className="mt-20 sm:mt-28">
          <p className="work-rise mb-10 flex items-center gap-5 eyebrow-sm text-gold-light sm:mb-12">
            <span aria-hidden="true" className="h-px w-14 bg-gold/40" />
            {work.featuredLabel}
          </p>
          <ProjectCase project={featured} index={0} env={env} />
        </div>

        <div className="mt-32 space-y-32 sm:mt-44 sm:space-y-44">
          {rest.map((project, i) => (
            <ProjectCase
              key={project.slug}
              project={project}
              index={i + 1}
              env={env}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Work);
