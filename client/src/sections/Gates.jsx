import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GateArch from "../components/gates/GateArch";
import Chains from "../components/gates/Chains";
import MoltenButton from "../components/ui/MoltenButton";
import { scrollToSection } from "../lib/useSmoothScroll";
import { identity, gates } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

function Gates({ env }) {
  const section = useRef(null);
  const arch = useRef(null);
  const content = useRef(null);
  const cue = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
          .from(".gate-rule", { scaleX: 0, duration: 1.4 }, 0.5);
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
      <div
        className="absolute inset-0 -z-10"
        style={{
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 70%, transparent 95%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 70%, transparent 95%)",
        }}
      >
        <div ref={arch} className="absolute inset-x-0 -top-[8%] -bottom-[26%]">
          <GateArch />
        </div>
      </div>

      <Chains triggerRef={section} reducedMotion={env.reducedMotion} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 42% at 50% 52%, rgba(5,3,10,0.92) 0%, rgba(5,3,10,0.72) 45%, transparent 78%)",
        }}
      />

      <div
        ref={content}
        className="relative mx-auto w-full max-w-5xl px-6 text-center"
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

        <div className="relative">
          <span
            aria-hidden="true"
            className="gate-ghost text-outline-ember pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[22vw] leading-none font-black tracking-[0.08em] opacity-25 select-none"
          >
            {gates.ghost}
          </span>

          <h1 id="gates-title" className="relative">
            <span className="sr-only">
              {identity.name} — {identity.role}
            </span>
            <span aria-hidden="true" className="block overflow-hidden">
              <span className="gate-rise text-molten block font-display text-[clamp(2.75rem,12vw,10rem)] leading-[0.86] font-black tracking-[-0.01em]">
                {identity.given}
              </span>
            </span>
            <span aria-hidden="true" className="block overflow-hidden">
              <span className="gate-rise text-molten block font-display text-[clamp(2.75rem,12vw,10rem)] leading-[0.86] font-black tracking-[-0.01em]">
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
            {identity.disciplines[1]}
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
