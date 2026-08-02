import { memo, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SummoningCircle from "../components/summoning/SummoningCircle";
import MoltenButton from "../components/ui/MoltenButton";
import SectionMark from "../components/ui/SectionMark";
import EmberField from "../components/ui/EmberField";
import { summoning, identity } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section VI: Summoning Circle. The end of the descent.
 *
 * The portal is the transition into it: three rings scrubbed from nothing out
 * past the edge of the frame, so scrolling in reads as passing through
 * something rather than arriving at the next block of text. It is tied to the
 * approach, not to the section, which is why it is driven off the section's top
 * edge crossing the bottom of the viewport.
 *
 * The shake lands on the same beat and is deliberately small. Two pixels sold
 * as weight; any more and it reads as a broken transform.
 *
 * No contact form. A form with nothing behind it looks like it sent and did
 * not, and that is a worse first impression than a plain link.
 */
function Summoning({ env }) {
  const section = useRef(null);
  const stage = useRef(null);
  const [copied, setCopied] = useState("");

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      // The portal opening: rings rushing out past the viewer.
      gsap.fromTo(
        ".portal-ring",
        { scale: 0.05, opacity: 0 },
        {
          scale: 3.4,
          opacity: 0,
          ease: "none",
          stagger: 0.12,
          keyframes: { opacity: [0, 0.75, 0] },
          scrollTrigger: {
            trigger: section.current,
            start: "top bottom",
            end: "top 30%",
            scrub: 0.5,
          },
        },
      );

      // A short shake as it opens, then it settles.
      gsap
        .timeline({
          scrollTrigger: { trigger: section.current, start: "top 62%" },
        })
        .to(stage.current, {
          keyframes: { x: [0, -3, 3, -2, 2, 0], y: [0, 2, -2, 1, -1, 0] },
          duration: 0.5,
          ease: "power2.out",
        });

      gsap.from(".summon-rise", {
        y: 44,
        opacity: 0,
        duration: 1.1,
        stagger: 0.09,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 65%" },
      });

      gsap.from(".summon-circle", {
        scale: 0.72,
        opacity: 0,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 70%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      // Clipboard can be blocked by permissions or a non-secure origin. The
      // address is selectable text either way, so there is nothing to recover.
    }
  };

  return (
    <section
      id="summoning"
      ref={section}
      aria-labelledby="summoning-title"
      className="relative isolate flex min-h-[85svh] flex-col items-center justify-center overflow-hidden pt-10 sm:pt-14 pb-10 sm:pb-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          // Deeper than the other sections on purpose. The circle is drawn in thin
          // ember strokes, and over a lit lava surface it reads as scattered arcs
          // rather than as a figure. It needs near-black to sit on.
          background:
            "radial-gradient(88% 78% at 50% 50%, rgba(5,3,10,0.99) 0%, rgba(5,3,10,0.95) 48%, rgba(5,3,10,0.62) 100%)",
        }}
      />

      <EmberField count={18} reducedMotion={env.reducedMotion} className="-z-10" />

      <div ref={stage} className="relative mx-auto w-full max-w-3xl px-6 pt-14 sm:pt-20">
        <div className="relative text-center">
          <SectionMark
            roman="VI"
            label="Summoning Circle"
            className="summon-rise justify-center mb-8 sm:mb-10"
          />

          <h2 id="summoning-title" className="mt-4">
            <span className="text-molten summon-rise block font-display text-[clamp(2rem,5.4vw,4rem)] leading-[0.95] font-black">
              {summoning.headline}
            </span>
            <span className="summon-rise mt-3 block font-blackletter text-[clamp(1.35rem,3vw,2rem)] leading-none text-brimstone/85">
              {summoning.headlineSub}
            </span>
          </h2>

          <p className="summon-rise mx-auto mt-6 max-w-md text-parchment/90">{summoning.lede}</p>

          <div className="summon-rise relative mt-10 flex justify-center">
            {/* The portal rings, rushing past on the way in, perfectly concentric with the circle! */}
            <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute top-1/2 left-1/2 aspect-square w-[52vmin]
                    -translate-x-1/2 -translate-y-1/2"
                >
                  <span
                    className="portal-ring block h-full w-full rounded-full border-2
                      border-ember opacity-0 shadow-[0_0_60px_10px_rgba(255,77,0,0.45)]"
                  />
                </span>
              ))}
            </div>

            {/* The BIG circle sits centered directly behind the SEND WORD button. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(108vw,36rem)] sm:w-[38rem]
                -translate-x-1/2 -translate-y-1/2"
            >
              <div className="summon-circle relative h-full w-full">
                <SummoningCircle reducedMotion={env.reducedMotion} />
              </div>
            </div>

            <MoltenButton href={summoning.cta.href} reducedMotion={env.reducedMotion}>
              {summoning.cta.label}
            </MoltenButton>
          </div>

          <ul className="summon-rise mx-auto mt-12 flex max-w-lg flex-col gap-3">
            {summoning.channels.map((channel) => (
              <li
                key={channel.label}
                className="surface-forged flex items-center justify-between gap-4 border
                  border-iron/80 bg-obsidian/70 px-4 py-3 text-left"
              >
                <span className="font-display text-[0.58rem] tracking-[0.3em] text-ember uppercase">
                  {channel.label}
                </span>

                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="flex-1 truncate text-right text-bone transition-colors hover:text-hellfire"
                >
                  {channel.value}
                </a>

                {channel.copy ? (
                  <button
                    type="button"
                    onClick={() => copy(channel.value)}
                    className="font-display text-[0.55rem] tracking-[0.2em] text-parchment/70
                      uppercase transition-colors hover:text-hellfire"
                  >
                    {/* Announced politely so a screen reader hears it happened. */}
                    <span aria-hidden="true">{copied === channel.value ? "Copied" : "Copy"}</span>
                    <span className="sr-only">
                      {copied === channel.value
                        ? "Address copied to clipboard"
                        : `Copy ${channel.label.toLowerCase()} address`}
                    </span>
                  </button>
                ) : null}
              </li>
            ))}
          </ul>

          <p aria-live="polite" className="sr-only">
            {copied ? "Copied to clipboard" : ""}
          </p>

          <p className="summon-rise mt-14 font-display text-[0.6rem] tracking-[0.36em] text-smoke uppercase">
            {summoning.closing}
            <span aria-hidden="true" className="mx-3 text-ember">
              ✦
            </span>
            {new Date().getFullYear()}
          </p>

          <p className="sr-only">
            {identity.name}, {identity.role}. Contact by email at {identity.email}.
          </p>
        </div>
      </div>
    </section>
  );
}

export default memo(Summoning);
