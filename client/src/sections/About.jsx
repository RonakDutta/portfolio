import { memo } from "react";
import SectionTitle from "../components/typography/SectionTitle";
import GoldGeometry from "../components/atmosphere/GoldGeometry";
import { about } from "../data/content";

function About() {


  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative isolate overflow-x-clip py-28 sm:py-40 lg:py-48"
    >
      <GoldGeometry
        variant="frame"
        className="pointer-events-none top-[6%] -left-[22%] aspect-square w-[70vmin] opacity-50 lg:-left-[8%] lg:w-[46vmin]"
      />

      <div className="relative mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle
          id="about-title"
          index={about.index}
          label={about.label}
          title={about.title}
          itemClass="reveal"
        />

        <div aria-hidden="true" className="ab-rule mt-10 h-px w-full origin-left rule-gold sm:mt-14" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-20 lg:items-start">
          <div className="space-y-6 text-[1.05rem] leading-relaxed text-sand/90 font-normal lg:space-y-8 lg:text-[1.2rem] lg:leading-[1.85] lg:max-w-2xl">
            {about.body.map((para, i) => (
              <p
                key={i}
                data-reveal
                className={
                  i === 0
                    ? "max-w-prose text-ivory/95 font-light lg:max-w-none"
                    : "max-w-prose text-sand/85 font-light lg:max-w-none"
                }
              >
                {para}
              </p>
            ))}
          </div>

          <dl className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-1">
            {about.facts.map((fact) => (
              <div
                key={fact.term}
                data-reveal
                className="border-t border-gold-dark/25 pt-5"
              >
                <dt className="eyebrow-sm text-gold-metal/90 font-medium tracking-[0.24em]">
                  {fact.term}
                </dt>
                <dd className="mt-2 text-[1.15rem] leading-snug font-medium text-ivory">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default memo(About);
