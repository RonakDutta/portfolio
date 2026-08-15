import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GateArch from "../components/gates/GateArch";
import Chains from "../components/gates/Chains";
import EmberField from "../components/ui/EmberField";
import ForgedButton from "../components/ui/ForgedButton";
import { scrollToSection } from "../lib/useSmoothScroll";
import { onCrossed } from "../lib/threshold";
import { identity, hero } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

function Hero({ env }) {
  const section = useRef(null);
  const arch = useRef(null);
  const content = useRef(null);
  const cue = useRef(null);

  useLayoutEffect(() => {
    let release = () => {};

    const ctx = gsap.context(() => {
      if (!env.reducedMotion) {
        const intro = gsap
          .timeline({ defaults: { ease: "expo.out" }, paused: true })
          .from(".hero-rise", {
            yPercent: 110,
            opacity: 0,
            duration: 1.4,
            stagger: 0.1,
          })
          .from(".hero-rule", { scaleX: 0, duration: 1.2 }, 0.45)
          .from(".hero-rail", { opacity: 0, duration: 1.6 }, 0.55);

        release = onCrossed(() => intro.play());
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      gsap.set(arch.current, { scale: 1.06, transformOrigin: "50% 42%" });
      tl.to(arch.current, { yPercent: 10, scale: 1.12, ease: "none" }, 0);
      tl.to(content.current, { yPercent: -32, opacity: 0, ease: "none" }, 0);
      tl.to(cue.current, { opacity: 0, duration: 0.2, ease: "none" }, 0);
      tl.to(".hero-rail", { opacity: 0, ease: "none" }, 0);
    }, section);

    return () => {
      release();
      ctx.revert();
    };
  }, [env.reducedMotion]);

  return (
    <section
      id="gates"
      ref={section}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
    >
      {/* Stone architecture, faded out before it meets the next section. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 68%, transparent 96%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 68%, transparent 96%)",
        }}
      >
        <div ref={arch} className="absolute inset-x-0 -top-[2%] -bottom-[30%]">
          <GateArch narrow={env.isMobile} />
        </div>
      </div>

      <Chains triggerRef={section} reducedMotion={env.reducedMotion} />

      <EmberField
        count={8}
        reducedMotion={env.reducedMotion}
        isMobile={env.isMobile}
        className="-z-10"
      />

      {/* Marginalia set into the walls. Architectural, not decorative. */}
      {[
        { side: "left", text: hero.railLeft, flip: true },
        { side: "right", text: hero.railRight, flip: false },
      ].map(({ side, text, flip }) => (
        <div
          key={side}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 z-10 hidden items-center sm:flex
            ${side === "left" ? "left-6" : "right-6"}`}
        >
          <span className="hero-rail flex flex-col items-center gap-4">
            <span className="h-16 w-px bg-gradient-to-b from-transparent to-bronze/35" />
            <span
              className={`font-mono text-[0.62rem] tracking-[0.42em] text-parchment/45 uppercase
                [writing-mode:vertical-rl] ${flip ? "rotate-180" : ""}`}
            >
              {text}
            </span>
            <span className="h-16 w-px bg-gradient-to-t from-transparent to-bronze/35" />
          </span>
        </div>
      ))}

      {/* Keeps the type off the stone without washing the whole frame out. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(56% 44% at 50% 54%, rgba(5,4,9,0.94) 0%, rgba(5,4,9,0.7) 48%, transparent 80%)",
        }}
      />

      <div
        ref={content}
        className="relative mx-auto w-full max-w-3xl px-6 pt-20 pb-24 text-center sm:pt-24"
      >
        <h1 id="hero-title">
          <span className="sr-only">
            {identity.name} — {identity.role}, {identity.region}
          </span>

          <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
            <span
              className="text-lit hero-rise block font-display
                text-[clamp(2.75rem,10.5vw,8.5rem)] leading-[0.92] font-bold
                tracking-[0.005em] uppercase"
            >
              {identity.given}
            </span>
          </span>
          <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
            <span
              className="text-lit hero-rise block font-display
                text-[clamp(2.75rem,10.5vw,8.5rem)] leading-[0.92] font-bold
                tracking-[0.005em] uppercase"
            >
              {identity.family}
            </span>
          </span>
        </h1>

        <div
          aria-hidden="true"
          className="hero-rule mx-auto mt-8 h-px w-full max-w-sm origin-center
            bg-gradient-to-r from-transparent via-bronze/50 to-transparent"
        />

        <div className="overflow-hidden">
          <p
            aria-hidden="true"
            className="hero-rise mt-6 flex flex-col items-center gap-1.5 font-mono
              text-[0.68rem] tracking-[0.3em] text-bronze-lit uppercase
              sm:flex-row sm:justify-center sm:gap-4 sm:text-[0.72rem]"
          >
            <span>{identity.role}</span>
            <span className="hidden h-3 w-px bg-slate sm:block" />
            <span className="text-parchment/70">{identity.region}</span>
          </p>
        </div>

        <p className="hero-rise mx-auto mt-7 max-w-lg text-balance text-parchment">
          {hero.intro}
        </p>

        <div
          className="hero-rise mx-auto mt-10 flex w-full max-w-xs flex-col items-stretch gap-3
            sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4"
        >
          <ForgedButton onClick={() => scrollToSection(hero.primary.target)}>
            {hero.primary.label}
          </ForgedButton>
          <ForgedButton
            variant="ghost"
            href={hero.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {hero.secondary.label}
          </ForgedButton>
        </div>

        {/* Email in plain sight. A recruiter should never have to scroll for it. */}
        <p className="hero-rise mt-7">
          <a
            href={`mailto:${identity.email}`}
            className="inline-flex min-h-11 items-center font-mono text-[0.72rem]
              tracking-[0.08em] text-parchment/75 underline decoration-bronze/40
              underline-offset-[6px] transition-colors duration-300
              hover:text-bone hover:decoration-bronze"
          >
            {identity.email}
          </a>
        </p>
      </div>

      <div
        ref={cue}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3
          [@media(max-height:800px)]:hidden"
      >
        <span className="font-mono text-[0.6rem] tracking-[0.36em] text-parchment/50 uppercase">
          {hero.scrollCue}
        </span>
        <span className="relative block h-12 w-px bg-gradient-to-b from-transparent via-bronze/40 to-transparent">
          <span className="animate-ember-fall absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-hellfire shadow-[0_0_8px_2px_rgba(255,148,72,0.55)]" />
        </span>
      </div>
    </section>
  );
}

export default memo(Hero);
