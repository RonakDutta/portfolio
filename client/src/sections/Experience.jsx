import { memo } from "react";
import SectionTitle from "../components/typography/SectionTitle";
import { experience } from "../data/content";

/**
 * The chronology, hung off one vertical line.
 *
 * Every entry used to be separated by its own horizontal rule, so the section
 * read as a stack of dividers with text between them. One line down the left
 * with a node per entry does the same job once instead of six times.
 */
function Entry({ year, period, title, org, detail, as: Heading = "h4" }) {
  return (
    <li data-reveal className="group relative pl-8 pb-12 last:pb-0 sm:pl-12">
      <span
        aria-hidden="true"
        className="absolute top-[0.6rem] left-0 h-2 w-2 -translate-x-1/2 rotate-45
          border border-brass bg-ink transition-colors duration-500 group-hover:bg-brass"
      />

      <p className="text-[0.88rem] text-brass/85">{period}</p>

      <Heading className="mt-3 font-display text-[clamp(1.4rem,3.4vw,2.05rem)] leading-tight font-normal text-ivory">
        {title}
      </Heading>

      <p className="mt-1.5 text-[0.98rem] text-sand/80">{org}</p>

      {detail ? (
        <p className="mt-4 max-w-[54ch] text-[0.96rem] leading-relaxed text-sand/70">
          {detail}
        </p>
      ) : null}

      <span aria-hidden="true" className="sr-only">
        {year}
      </span>
    </li>
  );
}

function Timeline({ children }) {
  return (
    <ol className="relative">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-px"
        style={{
          background:
            "linear-gradient(to bottom, rgba(200,164,92,0.55), rgba(200,164,92,0.18) 65%, transparent)",
        }}
      />
      {children}
    </ol>
  );
}

function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative isolate overflow-x-clip py-24 sm:py-32 lg:py-44"
    >
      <div className="mx-auto w-full max-w-[102rem] px-6 sm:px-9">
        <SectionTitle
          id="experience-title"
          title={experience.title}
          script={experience.script}
        />

        <div className="mt-14 grid gap-14 sm:mt-20 lg:grid-cols-2 lg:gap-24">
          <div>
            <p data-reveal className="mb-8 font-display text-[1.1rem] text-sand/70">
              {experience.workTitle}
            </p>
            <Timeline>
              {experience.roles.map((role) => (
                <Entry key={role.title} {...role} as="h3" />
              ))}
            </Timeline>
          </div>

          <div>
            <p data-reveal className="mb-8 font-display text-[1.1rem] text-sand/70">
              {experience.educationTitle}
            </p>
            <Timeline>
              {experience.education.map((item) => (
                <Entry key={item.title} {...item} as="h3" />
              ))}
            </Timeline>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Experience);
