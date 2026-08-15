import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Portrait from "../components/media/Portrait";
import GoldArc from "../components/ui/GoldArc";
import Button from "../components/ui/Button";
import { scrollToSection } from "../lib/useSmoothScroll";
import { onCrossed } from "../lib/threshold";
import { identity, hero } from "../data/content";

/**
 * The campaign plate.
 *
 * On `lg` the name and the portrait share grid cells so the type crosses in
 * front of the image — the layering is what makes it read as art direction
 * rather than two columns side by side. Below `lg` it becomes portrait, then
 * name, then copy, which is the same composition read top to bottom.
 */
function Hero({ env }) {
  const section = useRef(null);
  const portrait = useRef(null);

  useLayoutEffect(() => {
    let release = () => {};

    const ctx = gsap.context(() => {
      if (env.reducedMotion) return;

      // Slow, heavy, and in one direction. Nothing bounces.
      const intro = gsap
        .timeline({ defaults: { ease: "expo.out" }, paused: true })
        .from(".hero-mask > *", {
          yPercent: 108,
          duration: 1.7,
          stagger: 0.11,
        })
        .from(portrait.current, { opacity: 0, duration: 2 }, 0.15)
        .fromTo(
          ".hero-plate",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.9 },
          0.15,
        )
        .from(".hero-rule", { scaleX: 0, duration: 1.4 }, 0.6)
        .from(
          ".hero-fade",
          { opacity: 0, y: 18, duration: 1.1, stagger: 0.09 },
          0.75,
        )
        .from(".hero-arc", { opacity: 0, duration: 2.4 }, 0.4);

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
        pt-28 pb-14 sm:pt-32 lg:pt-24 lg:pb-20"
    >
      <GoldArc
        className="hero-arc top-1/2 right-[-18%] aspect-square w-[86vmin] -translate-y-1/2
          opacity-70 lg:right-[-8%] lg:w-[62vmin]"
        rings={3}
      />

      <div className="mx-auto grid w-full max-w-[104rem] items-center gap-0 px-6 sm:px-10 lg:grid-cols-12">
        {/* The plate. Right of centre on desktop so the type has something to
            cross in front of; full-bleed above `lg`, with the name pulled up
            over its lower edge so the phone gets the same layered composition
            rather than a stack of centred boxes. */}
        <div
          ref={portrait}
          className="hero-plate relative order-1 -mx-6 sm:-mx-10
            lg:order-2 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mx-0
            lg:w-full lg:max-w-[28rem] lg:justify-self-end xl:max-w-[32rem]"
        >
          <Portrait
            portrait={hero.portrait}
            initials={identity.initials}
            reducedMotion={env.reducedMotion}
            priority
          />
        </div>

        {/* Type. Sits above the plate in the stacking order on every size. */}
        <div className="relative z-10 order-2 -mt-16 sm:-mt-24 lg:order-1 lg:col-span-8
            lg:col-start-1 lg:row-start-1 lg:mt-0 lg:self-center">
          <h1 id="hero-title">
            <span className="sr-only">
              {identity.name} — {identity.role}, {identity.region}
            </span>

            {[identity.given, identity.family].map((word, i) => (
              <span
                key={word}
                aria-hidden="true"
                className="hero-mask block overflow-hidden pb-[0.04em]"
              >
                <span
                  className={`text-lit block font-display font-light uppercase
                    text-[clamp(3.4rem,14.5vw,13rem)] leading-[0.82] tracking-[0.005em]
                    ${i === 1 ? "lg:pl-[0.14em]" : ""}`}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <div
            aria-hidden="true"
            className="hero-rule mt-9 h-px w-full max-w-lg origin-left bg-gradient-to-r
              from-gold/60 via-gold/25 to-transparent lg:mt-11"
          />

          <p
            aria-hidden="true"
            className="hero-fade mt-7 flex flex-wrap items-center gap-x-5 gap-y-1 eyebrow text-gold-light"
          >
            <span>{identity.role}</span>
            <span className="h-3 w-px bg-line" />
            <span className="text-stone">{identity.region}</span>
          </p>

          <p className="hero-fade mt-7 max-w-lg text-pearl/85">
            {hero.statement}
          </p>

          <div className="hero-fade mt-10 flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-center sm:gap-5">
            <Button
              variant="solid"
              magnetic={env.pointerFx}
              onClick={() => scrollToSection(hero.primary.target)}
            >
              {hero.primary.label}
            </Button>
            <Button
              href={hero.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              magnetic={env.pointerFx}
            >
              {hero.secondary.label}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer rail: the email in plain sight, and the scroll cue. */}
      <div className="hero-fade mx-auto mt-14 flex w-full max-w-[104rem] items-end justify-between gap-6 px-6 sm:px-10 lg:mt-16">
        <a
          href={`mailto:${identity.email}`}
          className="link-rule min-h-11 eyebrow-sm inline-flex items-center text-stone
            transition-colors duration-500 hover:text-ivory"
        >
          {identity.email}
        </a>

        <span
          aria-hidden="true"
          className="hidden shrink-0 items-center gap-4 eyebrow-sm text-mute sm:flex"
        >
          {hero.scrollCue}
          <span className="relative block h-10 w-px overflow-hidden bg-line">
            <span className="animate-cue-fall absolute inset-0 bg-gold" />
          </span>
        </span>
      </div>
    </section>
  );
}

export default memo(Hero);
