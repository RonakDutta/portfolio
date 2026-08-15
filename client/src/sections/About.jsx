import { memo } from "react";
import SectionTitle from "../components/typography/SectionTitle";
import GoldGeometry from "../components/atmosphere/GoldGeometry";
import { about } from "../data/content";

function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative isolate overflow-x-clip py-24 sm:py-32 lg:py-44"
    >
      <GoldGeometry
        variant="frame"
        className="pointer-events-none top-[4%] -left-[26%] aspect-square w-[76vmin] opacity-40
          lg:-left-[10%] lg:w-[46vmin]"
      />

      <div className="relative mx-auto w-full max-w-[102rem] px-6 sm:px-9">
        <SectionTitle
          id="about-title"
          title={about.title}
          script={about.script}
        />

        <div className="mt-14 grid gap-14 sm:mt-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-24">
          <div>
            {about.body.map((para, i) => (
              <p
                key={i}
                data-reveal
                style={{ transitionDelay: `${i * 90}ms` }}
                className={`max-w-[46ch] text-[1.08rem] leading-[1.8] lg:text-[1.25rem] lg:leading-[1.75] ${
                  i === 0 ? "text-pearl" : "mt-7 text-sand/85"
                }`}
              >
                {para}
              </p>
            ))}

            <p
              data-reveal
              aria-hidden="true"
              className="script mt-10 text-[2.6rem] leading-none text-brass/70"
            >
              {about.signature}
            </p>
          </div>

          {/* Facts as a plain ledger: label above value, no card and no rule
              between rows. The spacing separates them. */}
          <dl className="grid grid-cols-1 gap-x-10 gap-y-9 self-start sm:grid-cols-2 lg:grid-cols-1 lg:gap-y-8">
            {about.facts.map((fact, i) => (
              <div key={fact.term} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <dt className="text-[0.88rem] text-brass/80">{fact.term}</dt>
                <dd className="mt-2.5 font-display text-[1.3rem] leading-snug text-ivory lg:text-[1.45rem]">
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
