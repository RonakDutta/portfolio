import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GateArch from "../components/gates/GateArch";
import Chains from "../components/gates/Chains";
import MoltenButton from "../components/ui/MoltenButton";
import { scrollToSection } from "../lib/useSmoothScroll";
import { identity, gates } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section I: Gates of Hell.
 *
 * Depth is built from four layers moving at different rates: lava (WebGL, moves
 * with the camera), the stone gate, the chains, and the type. The gate lags the
 * type on scroll, which is what makes you feel like you're passing through the
 * opening rather than sliding a background behind it.
 */
function Gates({ env }) {
  const section = useRef(null);
  const arch = useRef(null);
  const content = useRef(null);
  const cue = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ── Entrance ────────────────────────────────────────────────────────
      if (!env.reducedMotion) {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(".gate-rise", {
            yPercent: 120,
            opacity: 0,
            duration: 1.6,
            stagger: 0.12,
          })
          .from(".gate-ghost", { opacity: 0, scale: 1.12, duration: 2.2 }, 0.1)
          .from(".gate-rule", { scaleX: 0, duration: 1.4 }, 0.5)
          .from(".gate-rail", { opacity: 0, duration: 1.8 }, 0.6);
      }

      // ── Parallax ────────────────────────────────────────────────────────
      // The gate is heavy and drags; the type is light and leaves first.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // GSAP owns this transform outright. A Tailwind `scale-*` class on the
      // same element would be clobbered the moment the tween writes.
      gsap.set(arch.current, { scale: 1.06, transformOrigin: "50% 42%" });
      tl.to(arch.current, { yPercent: 12, scale: 1.14, ease: "none" }, 0);
      tl.to(content.current, { yPercent: -38, opacity: 0, ease: "none" }, 0);
      tl.to(cue.current, { opacity: 0, duration: 0.2, ease: "none" }, 0);
      tl.to(".gate-rail", { opacity: 0, ease: "none" }, 0);
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="gates"
      ref={section}
      aria-labelledby="gates-title"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
    >
      {/* Architecture, in two nested layers on purpose.
          Outer is static and carries the fade, so the wall always dissolves at
          the same point in the *section*. The section clips at its own bottom
          edge, and an opaque wall meeting bright lava there reads as a seam.
          Inner is what parallaxes; a fade baked into the moving layer would
          slide out of position as it travels. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 70%, transparent 95%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 70%, transparent 95%)",
        }}
      >
        <div ref={arch} className="absolute inset-x-0 -top-[2%] -bottom-[30%]">
          <GateArch narrow={env.isMobile} />
        </div>
      </div>

      {/* Carved into the piers, running bottom to top. This is where the
          ghost word went: the piers are the one part of the frame that is
          empty at every viewport, so an inscription here never has to fight
          the lockup for width the way full-width type behind it did. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center sm:left-6"
      >
        <span className="gate-rail flex flex-col items-center gap-3">
          <span className="h-10 w-px bg-gradient-to-b from-transparent to-ember/50 sm:h-16" />
          <span className="text-engraved rotate-180 font-display text-[0.6rem] font-bold tracking-[0.55em] text-brimstone/60 uppercase [writing-mode:vertical-rl] sm:text-[0.72rem]">
            {gates.ghost}
          </span>
          <span className="h-10 w-px bg-gradient-to-t from-transparent to-ember/50 sm:h-16" />
        </span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-3 z-10 flex items-center sm:right-6"
      >
        <span className="gate-rail flex flex-col items-center gap-3">
          <span className="h-10 w-px bg-gradient-to-b from-transparent to-ember/50 sm:h-16" />
          <span className="text-engraved font-display text-[0.6rem] font-bold tracking-[0.55em] text-brimstone/60 uppercase [writing-mode:vertical-rl] sm:text-[0.72rem]">
            {gates.mark}
          </span>
          <span className="h-10 w-px bg-gradient-to-t from-transparent to-ember/50 sm:h-16" />
        </span>
      </div>

      <Chains triggerRef={section} reducedMotion={env.reducedMotion} />

      {/* Local scrim. The lava behind runs to white-hot, and centred type needs
          its own floor of darkness to stay readable over it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 42% at 50% 52%, rgba(5,3,10,0.92) 0%, rgba(5,3,10,0.72) 45%, transparent 78%)",
        }}
      />

      {/* max-w-3xl keeps the lockup inside the arch springers, and the bottom
          padding stops centred content colliding with the scroll cue on
          short viewports. */}
      <div
        ref={content}
        className="relative mx-auto w-full max-w-3xl px-6 pt-16 sm:pt-24 lg:pt-28 pb-20 text-center sm:pb-24"
      >
        <div className="overflow-hidden">
          <p className="gate-rise font-blackletter text-brimstone/85 text-base sm:text-xl">
            {gates.eyebrow}
          </p>
        </div>

        <div className="gate-rule mx-auto my-6 flex max-w-md items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-ember/60" />
          <span
            aria-hidden="true"
            className="rotate-45 border border-ember/70 p-1"
          />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-ember/60" />
        </div>

        {/* The lockup. Nothing is set behind it any more: a full-width ghost
            word has no width left to give once the viewport narrows, so it ends
            up printed through the name. The word moved to the piers instead,
            where there is always empty stone and never a collision. */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="gate-bloom pointer-events-none absolute inset-0 -z-10 scale-150"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(255,77,0,0.20) 0%, rgba(255,77,0,0.07) 45%, transparent 72%)",
            }}
          />

          <h1 id="gates-title" className="relative">
            {/* One clean string for assistive tech; the split lines below are
                decorative so a screen reader never hears the name twice. */}
            <span className="sr-only">
              {identity.name}, {identity.role} from {identity.region}
            </span>
            <span aria-hidden="true" className="block overflow-hidden">
              <span className="gate-rise text-molten block font-display text-[clamp(3.2rem,9vw,11rem)] leading-[0.86] font-black tracking-[-0.01em]">
                {identity.given}
              </span>
            </span>
            <span aria-hidden="true" className="block overflow-hidden">
              <span className="gate-rise text-molten block font-display text-[clamp(3.2rem,9vw,11rem)] leading-[0.86] font-black tracking-[-0.01em]">
                {identity.family}
              </span>
            </span>
          </h1>
        </div>

        {/* Two lines on a phone. Set on one line at this tracking, the phrase
            wraps wherever it runs out of room and splits "New Delhi" in half. */}
        <div className="overflow-hidden">
          <p className="gate-rise mt-6 flex flex-col items-center gap-1 font-display text-[0.62rem] tracking-[0.3em] text-parchment uppercase sm:mt-7 sm:flex-row sm:justify-center sm:gap-0 sm:text-xs sm:tracking-[0.42em]">
            <span>{identity.role}</span>
            <span
              aria-hidden="true"
              className="hidden text-ember sm:mx-3 sm:inline"
            >
              ✦
            </span>
            <span>{identity.location}</span>
          </p>
        </div>

        <p className="gate-rise mx-auto mt-6 max-w-xl text-balance text-parchment/85">
          {gates.tagline}
        </p>

        <div className="gate-rise mx-auto mt-8 flex w-full max-w-xs flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <MoltenButton
            className="justify-center"
            reducedMotion={env.reducedMotion}
            onClick={() => scrollToSection(gates.cta.target)}
          >
            {gates.cta.label}
          </MoltenButton>
          <MoltenButton
            className="justify-center"
            variant="ghost"
            showArrow={false}
            href={gates.secondary.href || "/resume.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            reducedMotion={env.reducedMotion}
          >
            {gates.secondary.label}
          </MoltenButton>
        </div>
      </div>

      {/* Scroll cue. CSS-only animation, so no JS runs to keep this alive. */}
      <div
        ref={cue}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 [@media(max-height:860px)]:hidden"
      >
        <span className="font-display text-[0.6rem] tracking-[0.4em] text-parchment/60 uppercase">
          {gates.scrollCue}
        </span>
        <span className="relative block h-14 w-px bg-gradient-to-b from-transparent via-ember/50 to-transparent">
          <span className="animate-ember-fall absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-hellfire shadow-[0_0_10px_3px_rgba(255,138,31,0.7)]" />
        </span>
      </div>
    </section>
  );
}

export default memo(Gates);
