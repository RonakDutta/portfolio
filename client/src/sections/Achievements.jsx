import { memo } from "react";
import SectionTitle from "../components/typography/SectionTitle";
import { achievements } from "../data/content";

/**
 * The quietest section on the page by design: it supports Work and Experience
 * rather than competing with them. No cards, no glow, no rules: an index
 * number, the issuing body, and the thing itself.
 */
function Achievements() {
  return (
    <section
      id="achievements"
      aria-labelledby="achievements-title"
      className="relative isolate overflow-x-clip pb-20 sm:pb-24 lg:pb-32"
    >

      <div className="relative mx-auto w-full max-w-[102rem] px-6 sm:px-9">
        <SectionTitle
          id="achievements-title"
          title={achievements.title}
          script={achievements.script}
        />

        <ul className="mt-14 grid gap-x-14 gap-y-12 sm:mt-20 lg:grid-cols-3">
          {achievements.items.map((item, i) => (
            <li
              key={item.name}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
              className="group relative"
            >
              <h3 className=" font-display text-[1.45rem] leading-snug font-normal text-ivory transition-colors duration-500 group-hover:text-brass-lit sm:text-[1.6rem]">
                {item.name}
              </h3>

              <p className="mt-2 text-[0.88rem] text-brass/75">{item.org}</p>

              <p className="mt-4 max-w-[36ch] text-[0.95rem] leading-relaxed text-sand/75">
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
