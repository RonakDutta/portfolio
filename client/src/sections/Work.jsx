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
      className="relative isolate overflow-x-clip py-28 sm:py-40 lg:py-48"
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

        <div className="mt-16 sm:mt-24">
          <div data-reveal className="mb-10 flex items-center gap-3">
            <span className="h-2 w-2 rotate-45 bg-gold-metal" />
            <span className="eyebrow-sm text-gold-bright tracking-[0.24em]">
              {work.featuredLabel}
            </span>
            <span
              aria-hidden="true"
              className="h-px flex-1 max-w-xs"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,217,102,0.9), rgba(179,134,40,0))",
              }}
            />
          </div>
          <ProjectShowcase project={featured} index={0} env={env} />
        </div>

        <div className="mt-20 space-y-20 sm:mt-28 sm:space-y-28">
          {rest.map((project, i) => (
            <ProjectShowcase key={project.slug} project={project} index={i + 1} env={env} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Work);
