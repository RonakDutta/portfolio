import { memo } from "react";
import Heading from "../components/type/Heading";
import { experience } from "../data/content";

function Entry({ item, i }) {
  return (
    <li
      data-reveal="up"
      style={{ transitionDelay: `${i * 90}ms` }}
      className="yr group grid grid-cols-[minmax(0,auto)_1fr] gap-x-6 border-t border-gold/15 py-9 sm:gap-x-10 sm:py-11"
    >
      {/* The year, cut in outline and then filled with light as it arrives. */}
      <span aria-hidden="true" className="relative block">
        <span className="narrow outline-text block text-[clamp(3.4rem,8vw,6.5rem)] leading-[0.8] font-[300] tracking-[-0.03em]">
          {item.year}
        </span>
        <span className="yr-fill foil narrow absolute inset-0 block text-[clamp(3.4rem,8vw,6.5rem)] leading-[0.8] font-[300] tracking-[-0.03em]">
          {item.year}
        </span>
      </span>

      <div className="min-w-0">
        <p className="label text-gold">{item.period}</p>
        <h4 className="mt-3 text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] leading-[1.12] font-[720] tracking-[-0.02em] text-ivory [font-stretch:112%]">
          {item.title}
        </h4>
        <p className="mt-2 text-[1rem] font-[520] text-bone">{item.org}</p>
        <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-relaxed text-bone/70">{item.detail}</p>
      </div>
    </li>
  );
}

/**
 * The dark comes back over the gold the way the moon's limb comes back over the
 * sun: this section's top edge is an arc laid over the end of the toolkit.
 */
function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative z-[1] -mt-[9vw] pt-[9vw]">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 h-[calc(9vw+2px)] w-full overflow-visible"
      >
        <path d="M0,100 Q50,-100 100,100 Z" fill="#07060a" />
        <path
          d="M0,100 Q50,-100 100,100"
          fill="none"
          stroke="rgba(236,215,163,0.28)"
          strokeWidth="5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0,100 Q50,-100 100,100"
          fill="none"
          stroke="#fff6de"
          strokeOpacity="0.9"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative bg-ink pt-20 pb-24 sm:pb-32">
        <div className="mx-auto w-full max-w-[112rem] px-5 sm:px-9">
          <Heading
            id="experience-title"
            index="04"
            kicker="Work and education"
            title={experience.title}
            accent={experience.script}
          />

          <div className="mt-20 grid gap-x-16 gap-y-20 sm:mt-28 lg:grid-cols-2">
            <div>
              <h3
                data-reveal="up"
                className="flex items-center gap-4 text-[1.05rem] font-[650] text-ivory [font-stretch:112%]"
              >
                {experience.workTitle}
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent"
                />
              </h3>
              <ol className="mt-6">
                {experience.roles.map((role, i) => (
                  <Entry key={role.title} item={role} i={i} />
                ))}
              </ol>
            </div>

            <div>
              <h3
                data-reveal="up"
                className="flex items-center gap-4 text-[1.05rem] font-[650] text-ivory [font-stretch:112%]"
              >
                {experience.educationTitle}
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent"
                />
              </h3>
              <ol className="mt-6">
                {experience.education.map((item, i) => (
                  <Entry key={item.title} item={item} i={i} />
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Experience);
