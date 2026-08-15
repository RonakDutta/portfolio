import { memo } from "react";
import SectionTitle from "../components/typography/SectionTitle";
import { achievements } from "../data/content";

/**
 * Three ruled columns. The quietest section on the page by design: it should
 * support Work and Experience, not compete with them, so there is no card,
 * no glow and no gold beyond the issuing organisation.
 */
function Achievements() {
  return (
    <section
      id="achievements"
      aria-labelledby="achievements-title"
      className="relative isolate overflow-x-clip pb-28 sm:pb-40 lg:pb-48"
    >
      <div className="mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle
          id="achievements-title"
          index={achievements.index}
          label={achievements.label}
          title={achievements.title}
          accent={achievements.accent}
        />

        <ul className="mt-16 grid gap-x-14 gap-y-12 sm:mt-20 lg:grid-cols-3">
          {achievements.items.map((item) => (
            <li
              key={item.name}
              data-reveal
              className="relative border-t border-gold-dark/25 pt-6"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 h-px w-12"
                style={{
                  background:
                    "linear-gradient(90deg, #e5be48, rgba(140,101,8,0))",
                }}
              />
              <p className="eyebrow-sm text-gold-dark">{item.org}</p>
              <h3 className="mt-4 font-display text-[1.6rem] leading-tight font-normal text-ivory">
                {item.name}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-sand/85">
                {item.note}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default memo(Achievements);
