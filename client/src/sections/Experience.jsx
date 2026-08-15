import { memo } from "react";
import SectionTitle from "../components/typography/SectionTitle";
import { experience } from "../data/content";

/**
 * One entry in the chronology. The year sits oversized in the left margin and
 * carries the eye down the page; a hairline separates entries. No card, no
 * outlined-number trick — the year is set solid so it reads as typography
 * rather than as an effect.
 */
function Entry({ year, period, title, org, detail, as: Heading = "h4" }) {
  return (
    <li
      data-reveal
      className="group relative grid gap-4 border-t border-gold-dark/20 py-10
        sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-14 sm:py-14"
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-px w-16 origin-left transition-transform
          duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-150"
        style={{
          background: "linear-gradient(90deg, #e5be48, rgba(140,101,8,0))",
        }}
      />

      <div>
        <p
          aria-hidden="true"
          className="font-display text-[clamp(2.6rem,6vw,4.2rem)] leading-[0.9] font-normal text-slate
            transition-colors duration-500 group-hover:text-gold-dark"
        >
          {year}
        </p>
        <p className="mt-2 eyebrow-sm text-champagne">{period}</p>
      </div>

      <div>
        <Heading className="font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-tight font-normal text-ivory">
          {title}
        </Heading>

        <p className="mt-2 text-sand/80">{org}</p>

        {detail ? (
          <p className="mt-5 max-w-prose text-[0.95rem] leading-relaxed text-sand/85">
            {detail}
          </p>
        ) : null}
      </div>
    </li>
  );
}

function Experience() {


  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative isolate overflow-x-clip py-28 sm:py-40 lg:py-48"
    >
      <div className="mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle
          id="experience-title"
          index={experience.index}
          label={experience.label}
          title={experience.title}
          accent={experience.accent}
          itemClass="reveal"
        />

        <ol className="mt-16 sm:mt-24">
            {experience.roles.map((role) => (
            <Entry key={role.title} {...role} as="h3" />
          ))}
        </ol>

        <div className="mt-20 sm:mt-28">
          <p data-reveal className="mb-6 flex items-center gap-3 eyebrow-sm text-gold-bright">
            <span className="h-1.5 w-1.5 rotate-45 bg-gold-metal" />
            {experience.educationTitle}
          </p>

          <ol>
            {experience.education.map((item) => (
              <Entry key={item.title} {...item} />
            ))}
            <li aria-hidden="true" className="h-px w-full bg-gold-dark/20" />
          </ol>
        </div>
      </div>
    </section>
  );
}

export default memo(Experience);
