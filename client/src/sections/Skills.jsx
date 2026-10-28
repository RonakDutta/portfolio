import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Heading from "../components/type/Heading";
import { skills } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * The one sheet of gold on the page.
 *
 * It rises over the dark as a limb of the sun, a long shallow arc that
 * flattens almost straight as it reaches the top of the screen. The type on
 * it is ink. Each row of the index goes dark under the pointer, an eclipse
 * passing over it, and its words come up in gold.
 */
function Skills({ env }) {
  const sheet = useRef(null);
  const arc = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return undefined;
    // The arc is an ink cut-out laid over the sheet's top corners, flattened
    // with a transform, so the scrub never repaints the gold under it.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        arc.current,
        { scaleY: 1 },
        {
          scaleY: 0.12,
          ease: "none",
          scrollTrigger: { trigger: sheet.current, start: "top bottom", end: "top 15%", scrub: 0.4 },
        },
      );
    }, sheet);
    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative">
      <div
        ref={sheet}
        className="relative overflow-hidden pt-28 pb-28 text-ink sm:pt-36 lg:pt-44 lg:pb-40"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 0%, #fbeccb 0%, rgba(251,236,203,0) 60%), linear-gradient(180deg, #e9cf92 0%, #d4b06a 30%, #c39d55 70%, #b38c47 100%)",
        }}
      >
        <svg
          ref={arc}
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 -top-px z-[1] h-[16vw] w-full origin-top overflow-visible"
          style={{ transform: env.reducedMotion ? "scaleY(0.12)" : undefined }}
        >
          <path d="M0,0 L0,100 Q50,-100 100,100 L100,0 Z" fill="#07060a" />
          <path
            d="M0,100 Q50,-100 100,100"
            fill="none"
            stroke="rgba(236,215,163,0.35)"
            strokeWidth="6"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0,100 Q50,-100 100,100"
            fill="none"
            stroke="#fff6de"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Fine turned lines in the metal, like the face of a watch. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 aspect-square w-[180vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.16]"
          style={{
            background:
              "repeating-radial-gradient(circle, rgba(74,58,30,0.55) 0px, rgba(74,58,30,0.55) 1px, transparent 1px, transparent 9px)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[112rem] px-5 sm:px-9">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <Heading
              id="skills-title"
              index="03"
              kicker="What I work with"
              title={skills.title}
              accent={skills.script}
              tone="gold"
              className="lg:col-span-8"
            />
            <p
              data-reveal="up"
              className="max-w-[24rem] text-[1.05rem] leading-relaxed font-[480] text-ink/75 lg:col-span-4 lg:justify-self-end lg:pb-4"
            >
              {skills.note}
            </p>
          </div>

          <ul className="mt-20 border-t border-ink/25 sm:mt-28">
            {skills.groups.map((group, i) => (
              <li
                key={group.name}
                data-reveal="up"
                className="group relative isolate grid gap-3 border-b border-ink/25 py-7 sm:py-9 lg:grid-cols-12 lg:items-baseline lg:gap-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute -inset-x-5 inset-y-0 -z-10 origin-bottom scale-y-0 rounded-[1.25rem] bg-ink transition-transform duration-700
                    ease-[var(--ease-cine)] group-hover:scale-y-100 sm:-inset-x-9"
                />
                <h3 className="label flex items-baseline gap-3 text-ink/70 transition-colors duration-500 group-hover:text-gold lg:col-span-3">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[0.78rem] tracking-[0.04em]">{group.name}</span>
                  <span className="text-ink/45 transition-colors duration-500 group-hover:text-ash">
                    ({group.items.length})
                  </span>
                </h3>
                <p
                  className="text-[clamp(1.6rem,1rem+2.4vw,3.6rem)] leading-[1.08] font-[720] tracking-[-0.03em] text-ink
                    transition-[color,translate] duration-700 ease-[var(--ease-cine)] [font-stretch:115%] group-hover:translate-x-3
                    group-hover:text-gold-lit lg:col-span-9"
                >
                  {group.items.map((item, j) => (
                    <span key={item} className="inline-block whitespace-nowrap">
                      {item}
                      {j < group.items.length - 1 ? (
                        <span
                          aria-hidden="true"
                          className="mx-[0.28em] font-[200] text-ink/35 transition-colors duration-700 group-hover:text-gold/50"
                        >
                          /
                        </span>
                      ) : null}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* The rim light the limb throws on the dark above it, and on itself. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 z-[2] h-80"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 100%, rgba(236,215,163,0.28) 0%, rgba(200,164,92,0.1) 45%, transparent 75%)",
        }}
      />
    </section>
  );
}

export default memo(Skills);
