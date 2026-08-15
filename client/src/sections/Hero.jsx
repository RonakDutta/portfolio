import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import PortraitPlate from "../components/media/PortraitPlate";
import GoldGeometry from "../components/atmosphere/GoldGeometry";
import LuxuryButton from "../components/ui/LuxuryButton";
import { scrollToSection } from "../lib/useSmoothScroll";
import { onCrossed } from "../lib/threshold";
import { identity, hero } from "../data/content";

function Hero({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    let release = () => {};

    const ctx = gsap.context(() => {
      if (env.reducedMotion) return;

      const intro = gsap
        .timeline({ defaults: { ease: "expo.out" }, paused: true })
        .from(".hero-eyebrow", { opacity: 0, y: 14, duration: 1.2 })
        .from(".hero-mask > *", { yPercent: 110, duration: 1.8, stagger: 0.12 }, 0.1)
        .fromTo(
          ".hero-plate",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 2 },
          0.2,
        )
        .from(".hero-geo", { opacity: 0, duration: 2.6 }, 0.4)
        .from(".hero-rule", { scaleX: 0, duration: 1.5 }, 0.7)
        .from(
          ".hero-fade",
          { opacity: 0, y: 20, duration: 1.2, stagger: 0.1 },
          0.85,
        );

      release = onCrossed(() => intro.play());
    }, section);

    return () => {
      release();
      ctx.revert();
    };
  }, [env.reducedMotion]);

  return (
    <section
      id="hero"
      ref={section}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden
        pt-20 pb-10 sm:pt-28 lg:pt-20 lg:pb-8"
    >
      <GoldGeometry
        variant="orbit"
        className="hero-geo top-1/2 right-[-26%] aspect-square w-[104vmin] -translate-y-1/2
          opacity-80 lg:right-[-6%] lg:w-[70vmin]"
      />

      <div className="mx-auto grid w-full max-w-[108rem] items-center gap-0 px-6 sm:px-10 lg:grid-cols-12">
        {/* Plate */}
        <div
          className="hero-plate relative order-1 -mx-6 sm:-mx-10 mb-8 sm:mb-12 lg:order-2 lg:col-span-5
            lg:col-start-8 lg:row-start-1 lg:mx-0 lg:w-full lg:max-w-[28rem] lg:mb-0
            lg:justify-self-end xl:max-w-[31rem]"
        >
          <PortraitPlate
            portrait={hero.portrait}
            initials={identity.initials}
            reducedMotion={env.reducedMotion}
            priority
          />
        </div>

        {/* Type */}
        <div className="relative z-10 order-2 mt-0 sm:mt-0 lg:order-1 lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:self-center">
          <p className="hero-eyebrow flex items-center gap-4 eyebrow text-champagne">
            <span
              aria-hidden="true"
              className="h-px w-10 sm:w-14"
              style={{
                background:
                  "linear-gradient(90deg, rgba(229,190,72,0.95), rgba(179,134,40,0))",
              }}
            />
            <span>{hero.role}</span>
          </p>

          {/* Big Statement Headline */}
          <h1 id="hero-title" className="mt-5">
            <span className="sr-only">
              {hero.headline.line1} {hero.headline.line2} {hero.headline.line3} {identity.name}, {hero.role} in {hero.location}.
            </span>

            <span
              aria-hidden="true"
              className="hero-mask block overflow-hidden pb-[0.04em]"
            >
              <span className="text-ivory-lit block font-display text-[clamp(2.4rem,5.6vw,5rem)] leading-[1.03] font-semibold tracking-[0.01em]">
                {hero.headline.line1}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="hero-mask -mt-1 block overflow-hidden pb-[0.06em] sm:-mt-2"
            >
              <span className="text-foil animate-foil block font-accent italic text-[clamp(2.5rem,5.8vw,5.2rem)] leading-[1.08] font-normal tracking-tight">
                {hero.headline.line2}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="hero-mask -mt-1 block overflow-hidden pb-[0.08em] sm:-mt-2"
            >
              <span className="text-ivory-lit block font-display text-[clamp(2.4rem,5.6vw,5rem)] leading-[1.03] font-semibold tracking-[0.01em]">
                {hero.headline.line3}
              </span>
            </span>
          </h1>

          <div
            aria-hidden="true"
            className="hero-rule rule-gold mt-6 h-px w-full max-w-sm origin-left lg:mt-7"
          />

          {/* Intro Subtitle */}
          <p className="hero-fade mt-5 max-w-xl text-[1.05rem] sm:text-[1.18rem] leading-relaxed text-sand/90 font-light">
            {hero.introGreeting}{" "}
            <strong className="font-semibold text-ivory">{identity.name}</strong>,{" "}
            {hero.introRole}
          </p>

          <div className="hero-fade mt-8 flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-center sm:gap-5">
            <LuxuryButton
              variant="gold"
              onClick={() => scrollToSection(hero.primary.target)}
            >
              {hero.primary.label}
            </LuxuryButton>
            <LuxuryButton
              href={hero.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hero.secondary.label}
            </LuxuryButton>
          </div>
        </div>
      </div>

      {/* Footer rail. The name and location moved up into the composition, so
          all that is left down here is the address and the scroll cue. */}
      <div className="hero-fade mx-auto mt-12 flex w-full max-w-[108rem] flex-wrap items-end justify-between gap-5 px-6 sm:px-10 lg:mt-10">
        <a
          href={`mailto:${identity.email}`}
          className="gold-underline inline-flex min-h-11 items-center eyebrow-sm text-sand
            transition-colors duration-500 hover:text-gold-white"
        >
          {identity.email}
        </a>

        <span
          aria-hidden="true"
          className="hidden shrink-0 items-center gap-4 eyebrow-sm text-mute sm:flex"
        >
          {hero.scrollCue}
          <span className="relative block h-10 w-px overflow-hidden bg-line">
            <span className="animate-cue-fall absolute inset-0 bg-gold-metal" />
          </span>
        </span>
      </div>
    </section>
  );
}

export default memo(Hero);
