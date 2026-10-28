import { memo } from "react";
import Heading from "../components/type/Heading";
import LitText from "../components/type/LitText";
import LitPortrait from "../components/media/LitPortrait";
import { about, hero, identity } from "../data/content";

/**
 * Opened inside the moon. The hero's eclipse has swallowed the screen by the
 * time this arrives, so the first light the reader sees again is the portrait,
 * a sun of its own.
 */
function About({ env }) {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative pt-28 pb-28 sm:pt-40 lg:pt-[28vh] lg:pb-44"
    >
      <div className="mx-auto grid w-full max-w-[112rem] gap-x-10 gap-y-20 px-5 sm:px-9 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:pt-6">
          <div className="lg:sticky lg:top-[18vh]">
            <div data-reveal="up" className="mx-auto w-[min(68vw,24rem)] lg:w-[min(30vw,28rem)]">
              <LitPortrait portrait={hero.portrait} initials={identity.initials} env={env} />
            </div>
            <p data-reveal="up" className="label mt-[22%] text-center text-ash lg:mt-[24%]">
              <span className="text-gold">{identity.name}</span>
              <span aria-hidden="true" className="mx-2">
                /
              </span>
              {env.pointerFx ? "Move your light across" : identity.region}
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Heading id="about-title" index="01" kicker="About" title={about.title} accent={about.script} />

          <LitText
            text={about.body[0]}
            still={env.reducedMotion}
            className="mt-14 text-[clamp(1.4rem,1.05rem+1.3vw,2.25rem)] leading-[1.22] font-[480] tracking-[-0.018em] text-ivory sm:mt-20"
          />
          <p
            data-reveal="up"
            className="mt-8 max-w-[38rem] text-[1.05rem] leading-relaxed text-bone/80 sm:text-[1.12rem]"
          >
            {about.body[1]}
          </p>

          <dl className="mt-16 grid gap-px overflow-hidden rounded-[1.5rem] bg-gold/12 sm:grid-cols-2">
            {about.facts.map((fact, i) => (
              <div
                key={fact.term}
                data-reveal="up"
                style={{ transitionDelay: `${i * 70}ms` }}
                className="bg-ink p-6 sm:p-7"
              >
                <dt className="label text-gold">{fact.term}</dt>
                <dd className="mt-3 text-[1.12rem] leading-snug font-[560] text-ivory [font-stretch:108%]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <p data-reveal="up" className="mt-12 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-gold/50" />
            <span className="foil wide text-[1.9rem] leading-none font-[800] tracking-[-0.03em]">
              {about.signature}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default memo(About);
