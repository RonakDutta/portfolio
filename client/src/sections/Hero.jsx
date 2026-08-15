import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import PortraitPlate from "../components/media/PortraitPlate";
import GoldGeometry from "../components/atmosphere/GoldGeometry";
import Sparkles from "../components/fx/Sparkles";
import Magnetic from "../components/fx/Magnetic";
import Marquee from "../components/ui/Marquee";
import Action from "../components/ui/Action";
import { scrollToSection } from "../lib/useSmoothScroll";
import { onCrossed } from "../lib/threshold";
import { identity, hero } from "../data/content";

function Hero({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    let release = () => {};

    const ctx = gsap.context(() => {
      if (env.reducedMotion) return;

      // Held paused until the overture is off the screen, so the entrance is
      // never performed behind it.
      const intro = gsap
        .timeline({ defaults: { ease: "expo.out" }, paused: true })
        .from(".hero-status", { opacity: 0, y: 12, duration: 1.1 })
        .from(
          ".hero-mask > *",
          { yPercent: 108, duration: 1.6, stagger: 0.11 },
          0.06,
        )
        .fromTo(
          ".hero-portrait",
          { opacity: 0, scale: 1.06 },
          { opacity: 1, scale: 1, duration: 2.2 },
          0.15,
        )
        .from(".hero-geo", { opacity: 0, duration: 2.4 }, 0.4)
        .from(
          ".hero-fade",
          { opacity: 0, y: 18, duration: 1.1, stagger: 0.09 },
          0.7,
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
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden
        pt-24 pb-6 sm:pt-28 lg:pt-24"
    >
      <GoldGeometry
        variant="orbit"
        className="hero-geo top-[46%] right-[-30%] aspect-square w-[110vmin] -translate-y-1/2
          opacity-70 lg:right-[-8%] lg:w-[68vmin]"
      />
      <Sparkles count={16} seed={3} className="-z-10 opacity-80" />

      <div
        className="mx-auto grid w-full max-w-[102rem] flex-1 items-center gap-8 px-6
          sm:px-9 lg:grid-cols-12 lg:gap-4"
      >
        {/* Portrait */}
        <div
          className="hero-portrait relative order-1 mx-auto w-[min(56vw,16.5rem)] sm:w-[min(50vw,20rem)]
            lg:order-2 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mx-0 lg:w-full
            lg:max-w-[25rem] lg:justify-self-end xl:max-w-[27rem]"
        >
          <PortraitPlate
            portrait={hero.portrait}
            initials={identity.initials}
            reducedMotion={env.reducedMotion}
            priority
          />
        </div>

        {/* Type */}
        <div className="relative z-10 order-2 lg:order-1 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:self-center">
          <p className="hero-status text-[0.95rem] text-sand/70">
            {hero.status}
            <span aria-hidden="true" className="mx-2.5 text-brass/50">
              /
            </span>
            {hero.location}
          </p>

          <h1 id="hero-title" className="mt-6 sm:mt-7">
            <span className="sr-only">
              {hero.headline.line1} {hero.headline.script} {hero.headline.line2}{" "}
              {identity.name}, {hero.role} in {hero.location}.
            </span>

            <span aria-hidden="true" className="hero-mask block overflow-hidden">
              <span className="text-ivory-lit block font-display text-[clamp(2.3rem,7.4vw,5rem)] leading-[1.04] font-normal tracking-[-0.025em]">
                {hero.headline.line1}
              </span>
            </span>

            <span
              aria-hidden="true"
              className="hero-mask -mt-[0.12em] block overflow-hidden pb-[0.1em]"
            >
              <span className="script text-leaf block text-[clamp(3.1rem,10.2vw,6.9rem)] leading-[1.02]">
                {hero.headline.script}
              </span>
            </span>

            <span
              aria-hidden="true"
              className="hero-mask -mt-[0.18em] block overflow-hidden"
            >
              <span className="text-ivory-lit block font-display text-[clamp(2.3rem,7.4vw,5rem)] leading-[1.04] font-normal tracking-[-0.025em]">
                {hero.headline.line2}
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-7 max-w-lg text-[1.02rem] leading-relaxed text-sand/85 sm:text-[1.1rem]">
            {hero.introGreeting}{" "}
            <strong className="font-medium text-ivory">{identity.name}</strong>,{" "}
            {hero.introRole}
          </p>

          <div className="hero-fade mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Magnetic active={env.pointerFx}>
              <Action
                variant="solid"
                onClick={() => scrollToSection(hero.primary.target)}
                arrow="down"
                className="w-full sm:w-auto"
              >
                {hero.primary.label}
              </Action>
            </Magnetic>

            <Magnetic active={env.pointerFx}>
              <Action
                href={hero.secondary.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Open PDF"
                className="w-full sm:w-auto"
              >
                {hero.secondary.label}
              </Action>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Ticker + scroll cue. Full bleed on purpose: it is the line that tells
          you the page keeps going. */}
      <div className="hero-fade relative mt-14 lg:mt-20">
        <Marquee items={hero.ticker} duration={48} />

        <div className="mx-auto mt-6 flex w-full max-w-[102rem] items-end justify-between gap-5 px-6 sm:px-9">
          <a
            href={`mailto:${identity.email}`}
            data-cursor="Write"
            className="link-underline inline-flex min-h-11 items-center eyebrow-sm text-sand
              transition-colors duration-500 hover:text-brass-lit"
          >
            {identity.email}
          </a>

          <span
            aria-hidden="true"
            className="hidden shrink-0 items-center gap-4 eyebrow-sm text-mute sm:flex"
          >
            {hero.scrollCue}
            <span className="relative block h-9 w-px overflow-hidden bg-brass/20">
              <span className="animate-cue-fall absolute inset-0 bg-brass" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);
