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
          .from(".gate-rise", { yPercent: 120, opacity: 0, duration: 1.6, stagger: 0.12 })
          .from(".gate-ghost", { opacity: 0, scale: 1.12, duration: 2.2 }, 0.1)
          .from(".gate-rule", { scaleX: 0, duration: 1.4 }, 0.5);
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
          maskImage: "linear-gradient(to bottom, #000 0%, #000 70%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 70%, transparent 95%)",
        }}
      >
        <div ref={arch} className="absolute inset-x-0 -top-[8%] -bottom-[26%]">
          <GateArch />
        </div>
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
        className="relative mx-auto w-full max-w-3xl px-6 pb-20 text-center sm:pb-24"
      >
        <div className="overflow-hidden">
          <p className="gate-rise font-blackletter text-brimstone/85 text-base sm:text-xl">
            {gates.eyebrow}
          </p>
        </div>

        <div className="gate-rule mx-auto my-6 flex max-w-md items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-ember/60" />
          <span aria-hidden="true" className="rotate-45 border border-ember/70 p-1" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-ember/60" />
        </div>

        {/* The lockup. The ghost word sits behind it for depth. */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="gate-ghost text-outline-ember-strong pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[19vw] leading-none font-black tracking-[0.08em] opacity-55 select-none"
          >
            {gates.ghost}
          </span>

          <h1 id="gates-title" className="relative">
            {/* One clean string for assistive tech; the split lines below are
                decorative so a screen reader never hears the name twice. */}
            <span className="sr-only">
              {identity.name}, {identity.role} from {identity.region}
            </span>
            <span aria-hidden="true" className="block overflow-hidden">
              <span className="gate-rise text-molten block font-display text-[clamp(2.4rem,10vw,12rem)] leading-[0.86] font-black tracking-[-0.01em]">
                {identity.given}
              </span>
            </span>
            <span aria-hidden="true" className="block overflow-hidden">
              <span className="gate-rise text-molten block font-display text-[clamp(2.4rem,10vw,12rem)] leading-[0.86] font-black tracking-[-0.01em]">
                {identity.family}
              </span>
            </span>
          </h1>
        </div>

        <div className="overflow-hidden">
          <p className="gate-rise mt-7 font-display text-[0.7rem] tracking-[0.42em] text-parchment uppercase sm:text-xs">
            {identity.role}
            <span aria-hidden="true" className="mx-3 text-ember">
              ✦
            </span>
            {identity.location}
          </p>
        </div>

        <p className="gate-rise mx-auto mt-6 max-w-xl text-balance text-parchment/85">
          {gates.tagline}
        </p>

        <div className="gate-rise mt-10 flex flex-wrap items-center justify-center gap-4">
          <MoltenButton
            reducedMotion={env.reducedMotion}
            onClick={() => scrollToSection(gates.cta.target)}
          >
            {gates.cta.label}
          </MoltenButton>
          <MoltenButton
            variant="ghost"
            reducedMotion={env.reducedMotion}
            onClick={() => scrollToSection(gates.secondary.target)}
          >
            {gates.secondary.label}
          </MoltenButton>
        </div>
      </div>

      {/* Scroll cue. CSS-only animation, so no JS runs to keep this alive. */}
      <div
        ref={cue}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
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
