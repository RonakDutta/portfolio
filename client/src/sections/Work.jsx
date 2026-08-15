import { memo } from "react";
import ProjectShowcase from "../components/projects/ProjectShowcase";
import SectionTitle from "../components/typography/SectionTitle";
import Sparkles from "../components/fx/Sparkles";
import { work } from "../data/content";

function Work({ env }) {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="relative isolate overflow-x-clip py-24 sm:py-32 lg:py-44"
    >
      <Sparkles count={12} seed={19} className="-z-10 opacity-60" />

      <div className="relative mx-auto w-full max-w-[102rem] px-6 sm:px-9">
        <SectionTitle
          id="work-title"
          title={work.title}
          script={work.script}
          size="xl"
        />

        <div className="mt-12 space-y-28 sm:mt-16 sm:space-y-36 lg:space-y-44">
          {work.projects.map((project, i) => (
            <ProjectShowcase
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
