import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Eclipse from "../components/eclipse/Eclipse";
import Button from "../components/ui/Button";
import { scrollToSection } from "../lib/useSmoothScroll";
import { onCrossed } from "../lib/threshold";
import { identity, hero } from "../data/content";

// Foil is struck on each letter rather than on the word: a clipped background
// does not reach into children that are moving on their own layers.
function Letters({ word, foil = false, className = "" }) {
  return (
    <span aria-hidden="true" className={`block whitespace-nowrap ${className}`}>
      {[...word].map((ch, i) => (
        <span key={i} className="slot">
          <span
            className={`hero-letter ${foil ? "foil foil-letter" : ""}`}
            style={foil ? { "--n": word.length, "--i": i } : undefined}
          >
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * The first screen: a total eclipse with a name split around it.
 *
 * On a wide screen everything hangs off the eclipse at dead centre, on two
 * rows either side of its horizon: the given name above it to the left, the
 * family name below it to the right, and the statement in the lower left,
 * standing on the same line as the family name. On a phone the same pieces stack, with
 * the eclipse between the two halves of the name.
 *
 * Scrolling away, the halves of the name part outward and the eclipse holds
 * still and swells until the moon covers the screen; the next section is read
 * inside it.
 */
function Hero({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    let release = () => {};
    const ctx = gsap.context(() => {
      if (env.reducedMotion) return;

      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .from(
          ".hero-given .hero-letter",
          { yPercent: 115, duration: 1.5, stagger: 0.05, clearProps: "transform" },
          0,
        )
        .from(
          ".hero-family .hero-letter",
          { yPercent: -115, duration: 1.5, stagger: 0.05, clearProps: "transform" },
          0.12,
        )
        .from(".hero-fade", { opacity: 0, y: 16, duration: 1.2, stagger: 0.08 }, 0.5);
      release = onCrossed(() => intro.play());

      const out = {
        trigger: section.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.4,
      };
      gsap.to(".hero-given", { xPercent: -28, opacity: 0, ease: "power1.in", scrollTrigger: out });
      gsap.to(".hero-family", { xPercent: 28, opacity: 0, ease: "power1.in", scrollTrigger: out });
      gsap.to(".hero-ui", {
        y: -60,
        opacity: 0,
        ease: "power1.in",
        scrollTrigger: { ...out, end: "45% top" },
      });
    }, section);

    return () => {
      release();
      ctx.revert();
    };
  }, [env.reducedMotion]);

  const scriptAt = hero.headline;

  return (
    <section
      id="hero"
      ref={section}
      aria-labelledby="hero-title"
      className="relative isolate flex flex-col overflow-clip px-5 pt-24 pb-8 sm:px-9 lg:block lg:h-[100svh] lg:min-h-[42rem] lg:p-0"
      style={{ "--d": "min(34vmin, 21rem)", "--f": "min(13.4vw, 19svh, 15.5rem)" }}
    >
      <h1 id="hero-title" className="sr-only">
        {identity.name}, {hero.role} in {hero.location}. {scriptAt.line1} {scriptAt.script} {scriptAt.line2}
      </h1>

      <p className="hero-fade hero-ui label order-1 text-gold lg:absolute lg:top-[7.2rem] lg:right-9 lg:text-right">
        {hero.status}
        <span aria-hidden="true" className="mx-2 text-ash">
          /
        </span>
        <span className="text-bone">{hero.location}</span>
      </p>

      {/* The given name, above and left of the eclipse. */}
      <div className="hero-given relative z-[1] order-2 mt-6 will-change-transform lg:absolute lg:bottom-[calc(50%+var(--d)*0.44)] lg:left-9 lg:mt-0">
        <Letters
          word={identity.given.toUpperCase()}
          className="wide text-[clamp(3.6rem,21vw,6.5rem)] leading-[0.82] font-[850] tracking-[-0.045em] text-ivory sm:text-[clamp(4rem,17vw,9rem)] lg:text-[length:var(--f)]"
        />
      </div>

      {/* The eclipse. */}
      <Eclipse
        env={env}
        primary
        zoom
        ring={hero.ticker}
        className="relative z-[2] order-3 mx-auto my-[24vw] aspect-square w-[min(58vw,32svh)] sm:my-[16vw]
          lg:absolute lg:top-1/2 lg:left-1/2 lg:my-0 lg:w-[var(--d)] lg:-translate-x-1/2 lg:-translate-y-1/2"
      />
      <ul className="sr-only">
        {hero.ticker.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      {/* The family name, below and right. */}
      <div className="hero-family relative z-[1] order-4 self-end will-change-transform lg:absolute lg:top-[calc(50%+var(--d)*0.44)] lg:right-9">
        <Letters
          word={identity.family.toUpperCase()}
          foil
          className="wide text-[clamp(3.6rem,21vw,6.5rem)] leading-[0.82] font-[850] tracking-[-0.045em] sm:text-[clamp(4rem,17vw,9rem)] lg:text-[length:var(--f)]"
        />
      </div>

      {/* The statement: under the name on a phone; on a wide screen in the
          lower left, its foot on the family name's line. */}
      <div
        className="hero-ui relative z-[3] order-5 mt-14 max-w-[32rem] lg:absolute lg:bottom-[calc(50%-var(--d)*0.44-var(--f)*0.82)] lg:left-9 lg:mt-0
          lg:w-[clamp(17.5rem,calc(50vw-var(--d)*0.75-4rem),30rem)]"
      >
        <p className="hero-fade text-[clamp(1.45rem,1.1rem+1.3vw,2.15rem)] leading-[1.12] font-[560] lg:text-[clamp(1.35rem,0.4rem+1.6vw,2.15rem)] tracking-[-0.02em] text-ivory [font-stretch:108%]">
          {scriptAt.line1} <span className="foil font-[700]">{scriptAt.script}</span> {scriptAt.line2}
        </p>
        <p className="hero-fade mt-5 max-w-[26rem] text-[0.98rem] leading-relaxed text-bone/80">
          {hero.introGreeting} <span className="text-ivory">{identity.name}</span>, {hero.introRole}
        </p>

        <div className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row lg:flex-wrap">
          <Button
            size="lg"
            arrow="down"
            onClick={() => scrollToSection(hero.primary.target)}
            className="sm:min-w-[12.5rem]"
          >
            {hero.primary.label}
          </Button>
          <Button
            size="lg"
            variant="line"
            arrow="download"
            href={hero.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:min-w-[10rem]"
          >
            {hero.secondary.label}
          </Button>
        </div>
      </div>

      {/* A hint for the one thing on this screen that answers back, upper
          right, on the given name's line. */}
      {env.reducedMotion ? null : (
        <p
          aria-hidden="true"
          className="hero-fade hero-ui pointer-events-none absolute right-9 bottom-[calc(50%+var(--d)*0.44)] z-[3] hidden w-[min(15rem,calc(50vw-var(--d)*0.75-4rem))] text-right lg:block"
        >
          <span className="block text-[0.95rem] leading-snug font-[520] text-bone">
            {env.coarsePointer ? "Tap the sun." : "Bring your cursor close to the sun."}
          </span>
          <span className="label mt-3 block text-gold/80">
            {env.coarsePointer ? "It answers with a flare" : "Click to set off a flare"}
          </span>
        </p>
      )}

      <div className="hero-fade hero-ui relative z-[3] order-6 mt-12 flex items-end justify-between gap-6 lg:absolute lg:inset-x-9 lg:bottom-7 lg:mt-0">
        <span aria-hidden="true" className="label hidden items-center gap-4 text-ash sm:flex">
          <span className="relative block h-px w-14 overflow-hidden bg-gold/20">
            <span className="absolute inset-0 origin-left animate-[cue_2.8s_var(--ease-swing)_infinite] bg-gold-lit" />
          </span>
          {hero.scrollCue}
        </span>
        <a
          href={`mailto:${identity.email}`}
          className="label link-line inline-flex min-h-11 items-center text-bone transition-colors duration-500 hover:text-gold-lit lg:min-h-0"
        >
          {identity.email}
        </a>
      </div>
    </section>
  );
}

export default memo(Hero);
