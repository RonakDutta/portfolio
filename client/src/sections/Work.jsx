import { memo } from "react";
import ProjectShowcase from "../components/projects/ProjectShowcase";
import SectionTitle from "../components/typography/SectionTitle";
import { work } from "../data/content";

function Work({ env }) {
  const [featured, ...rest] = work.projects;


  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="relative isolate overflow-x-clip py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle
          id="work-title"
          index={work.index}
          label={work.label}
          title={work.title}
          accent={work.accent}
          itemClass="reveal"
        />

        <div className="mt-14 sm:mt-20 space-y-24 sm:space-y-32">
          <ProjectShowcase project={featured} index={0} env={env} />
          {rest.map((project, i) => (
            <ProjectShowcase key={project.slug} project={project} index={i + 1} env={env} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Work);
