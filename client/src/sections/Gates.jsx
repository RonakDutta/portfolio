import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GateArch from "../components/gates/GateArch";
import Chains from "../components/gates/Chains";
import MoltenButton from "../components/ui/MoltenButton";
import { scrollToSection } from "../lib/useSmoothScroll";
import { onCrossed } from "../lib/threshold";
import { identity, gates } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

function Gates({ env }) {
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
          .from(".gate-rise", {
            yPercent: 120,
            opacity: 0,
            duration: 1.6,
            stagger: 0.12,
          })
          .from(".gate-ghost", { opacity: 0, scale: 1.12, duration: 2.2 }, 0.1)
          .from(".gate-rule", { scaleX: 0, duration: 1.4 }, 0.5)
          .from(".gate-rail", { opacity: 0, duration: 1.8 }, 0.6);

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
      tl.to(arch.current, { yPercent: 12, scale: 1.14, ease: "none" }, 0);
      tl.to(content.current, { yPercent: -38, opacity: 0, ease: "none" }, 0);
      tl.to(cue.current, { opacity: 0, duration: 0.2, ease: "none" }, 0);
      tl.to(".gate-rail", { opacity: 0, ease: "none" }, 0);
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
      aria-labelledby="gates-title"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
    >
      {}
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

      {}
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

      {}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 42% at 50% 52%, rgba(5,3,10,0.92) 0%, rgba(5,3,10,0.72) 45%, transparent 78%)",
        }}
      />

      {}
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

        {}
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
            {}
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

        {}
        <div className="overflow-hidden">
          <p className="gate-rise mt-6 flex flex-col items-center gap-1 font-display text-[0.68rem] tracking-[0.26em] text-parchment uppercase sm:mt-7 sm:flex-row sm:justify-center sm:gap-0 sm:text-xs sm:tracking-[0.42em]">
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

        <p className="gate-rise mx-auto mt-6 max-w-xl text-balance text-parchment">
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

      {}
      <div
        ref={cue}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 [@media(max-height:860px)]:hidden"
      >
        <span className="font-display text-[0.6rem] tracking-[0.4em] text-parchment/80 uppercase">
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
