import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCase from "../components/work/ProjectCase";
import SectionHeader from "../components/ui/SectionHeader";
import { work } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

function Work({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".work-rise", {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 76%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="chambers"
      ref={section}
      aria-labelledby="work-title"
      className="relative isolate overflow-x-clip py-28 sm:py-36"
    >
      {/* Darkest section on the page: the screenshots are the only light. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 62% at 50% 40%, rgba(5,4,9,0.985) 0%, rgba(5,4,9,0.94) 58%, rgba(5,4,9,0.6) 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeader
          id="work-title"
          index={work.index}
          label={work.label}
          title={work.title}
          lede={work.lede}
          itemClass="work-rise"
        />

        <div className="mt-20 space-y-28 sm:mt-24 sm:space-y-36">
          {work.projects.map((project, i) => (
            <ProjectCase
              key={project.slug}
              project={project}
              index={i}
              env={env}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Work);
