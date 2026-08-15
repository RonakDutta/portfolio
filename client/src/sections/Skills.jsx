import { memo } from "react";
import SectionTitle from "../components/typography/SectionTitle";
import { skills } from "../data/content";

/**
 * A technical index, set like the specification page of a catalogue.
 *
 * Numbered rows, a hairline between each, entries as plain display type. No
 * cards, no pills, no dots — a wall of bordered chips is the single most
 * recognisable "generated portfolio" pattern, and it buries the information
 * under decoration.
 */
function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative isolate overflow-x-clip py-28 sm:py-40 lg:py-48"
    >
      <div className="mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle
          id="skills-title"
          index={skills.index}
          label={skills.label}
          title={skills.title}
          accent={skills.accent}
        />

        <dl className="mt-16 sm:mt-24">
          {skills.groups.map((group, i) => (
            <div
              key={group.name}
              data-reveal
              className="group relative grid gap-5 border-t border-gold-dark/20 py-8
                sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] sm:gap-14 sm:py-10"
            >
              {/* The rule lights up as the row is hovered — the only state
                  change in the section. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform
                  duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,217,102,0.85), rgba(140,101,8,0))",
                }}
              />

              <dt className="flex items-baseline gap-5">
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-gold-dark"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="eyebrow text-champagne">{group.name}</span>
              </dt>

              <dd>
                <ul className="flex flex-wrap gap-x-10 gap-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-display text-[1.45rem] leading-tight font-normal text-pearl
                        transition-colors duration-500 group-hover:text-ivory sm:text-[1.75rem]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
          <div aria-hidden="true" className="h-px w-full bg-gold-dark/20" />
        </dl>
      </div>
    </section>
  );
}

export default memo(Skills);
