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
        pt-28 pb-10 sm:pt-32 lg:pt-20 lg:pb-8"
    >
      <GoldGeometry
        variant="orbit"
        className="hero-geo top-1/2 right-[-26%] aspect-square w-[104vmin] -translate-y-1/2
          opacity-80 lg:right-[-6%] lg:w-[70vmin]"
      />

      <div className="mx-auto grid w-full max-w-[108rem] items-center gap-0 px-6 sm:px-10 lg:grid-cols-12">
        {/* Plate */}
        <div
          className="hero-plate relative order-1 -mx-6 sm:-mx-10 lg:order-2 lg:col-span-5
            lg:col-start-8 lg:row-start-1 lg:mx-0 lg:w-full lg:max-w-[28rem]
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
        <div className="relative z-10 order-2 -mt-16 sm:-mt-24 lg:order-1 lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:self-center">
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

          {/* Greeting small, name large. The size jump is what stops this
              reading as the centred "Hello, I'm ___" template — it is a person
              introducing themselves, with the name as the visual anchor. */}
          <h1 id="hero-title" className="mt-6">
            <span className="sr-only">
              {identity.name}, {hero.role} in {hero.location}.
            </span>

            <span
              aria-hidden="true"
              className="hero-mask block overflow-hidden pb-[0.08em]"
            >
              <span className="block font-display text-[clamp(1.6rem,4vw,3rem)] leading-[1] font-light text-sand/85 italic">
                {hero.greeting}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="hero-mask -mt-1 block overflow-hidden pb-[0.08em] sm:-mt-2"
            >
              <span className="text-foil animate-foil block font-display text-[clamp(3rem,10.5vw,8.5rem)] leading-[0.94] font-semibold tracking-[0.01em]">
                {hero.name}
              </span>
            </span>
          </h1>

          <div
            aria-hidden="true"
            className="hero-rule rule-gold mt-7 h-px w-full max-w-sm origin-left lg:mt-9"
          />

          <p className="hero-fade mt-6 eyebrow-sm text-sand/75">
            {hero.location}
          </p>

          <div className="hero-fade mt-9 flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-center sm:gap-5">
            <LuxuryButton
              variant="gold"
              magnetic={env.pointerFx}
              onClick={() => scrollToSection(hero.primary.target)}
            >
              {hero.primary.label}
            </LuxuryButton>
            <LuxuryButton
              href={hero.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              magnetic={env.pointerFx}
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
