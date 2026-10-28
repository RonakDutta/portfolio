import { memo } from "react";
import Heading from "../components/type/Heading";
import ProjectCase from "../components/work/ProjectCase";
import { work } from "../data/content";

const LABELS = { open: "View live", how: "How it was built", stack: "Built with" };

function Work({ env }) {
  return (
    <section id="work" aria-labelledby="work-title" className="relative pt-16 pb-32 sm:pt-24 lg:pb-48">
      <div className="mx-auto w-full max-w-[112rem] px-5 sm:px-9">
        <Heading
          id="work-title"
          index="02"
          kicker="Projects, 2025 to 2026"
          title={work.title}
          accent={work.script}
        />

        <div className="mt-24 space-y-36 sm:mt-32 lg:space-y-52">
          {work.projects.map((project, i) => (
            <ProjectCase
              key={project.slug}
              project={project}
              index={i}
              total={work.projects.length}
              labels={{ ...LABELS, open: work.openLabel || LABELS.open }}
              env={env}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Work);
