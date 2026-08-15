import { memo } from "react";
import SectionTitle from "../components/typography/SectionTitle";
import Sparkles from "../components/fx/Sparkles";
import { achievements } from "../data/content";

/**
 * The quietest section on the page by design: it supports Work and Experience
 * rather than competing with them. No cards, no glow, no rules — an index
 * number, the issuing body, and the thing itself.
 */
function Achievements() {
  return (
    <section
      id="achievements"
      aria-labelledby="achievements-title"
      className="relative isolate overflow-x-clip pb-24 sm:pb-32 lg:pb-44"
    >
      <Sparkles count={10} seed={57} className="-z-10 opacity-50" />

      <div className="relative mx-auto w-full max-w-[102rem] px-6 sm:px-9">
        <SectionTitle
          id="achievements-title"
          index={achievements.index}
          label={achievements.label}
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
              <span
                aria-hidden="true"
                className="font-mono text-[0.68rem] tracking-[0.2em] text-brass/60"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-4 font-display text-[1.45rem] leading-snug font-normal text-ivory transition-colors duration-500 group-hover:text-brass-lit sm:text-[1.6rem]">
                {item.name}
              </h3>

              <p className="mt-2 eyebrow-sm text-brass/75">{item.org}</p>

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
