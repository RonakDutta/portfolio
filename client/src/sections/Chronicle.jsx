import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionMark from "../components/ui/SectionMark";
import EmberField from "../components/ui/EmberField";
import { chronicle } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section V: Infernal Chronicle.
 *
 * A timeline whose spine is molten and fills downward as you scroll, so the
 * page's own descent is what writes the record. The scrub is tied to the
 * entries container rather than the whole section, so the line finishes at the
 * last entry instead of trailing off through the footer.
 *
 * Entries run down one side rather than alternating. Alternating looks lively
 * in a mockup and reads badly in practice: the eye has to cross the spine on
 * every row, and it collapses to a single column on mobile anyway, so the
 * desktop layout ends up being the odd one out.
 */
function Chronicle({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".chronicle-rise", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 72%" },
      });

      // The title of a record is written, so it is wiped in from the left
      // rather than moved. fromTo, because a `from` on clip-path has to
      // interpolate out of `none`, which is not a shape and lands as a jump.
      // The end inset is slack on three sides: clipping flush to the border
      // box shaves the molten gradient off the descenders.
      gsap.fromTo(
        ".chronicle-write",
        { clipPath: "inset(-14% 100% -22% 0%)" },
        {
          clipPath: "inset(-14% -6% -22% 0%)",
          duration: 1.15,
          stagger: 0.14,
          ease: "power3.inOut",
          scrollTrigger: { trigger: section.current, start: "top 72%" },
        },
      );

      gsap.from(".chronicle-spine", {
        scaleY: 0,
        transformOrigin: "50% 0%",
        ease: "none",
        scrollTrigger: {
          trigger: ".chronicle-entries",
          start: "top 78%",
          end: "bottom 72%",
          scrub: 0.4,
        },
      });

      // One timeline for the whole record, not one per entry. Per-entry
      // triggers fired each row in isolation, so what you saw was three
      // unrelated arrivals; struck as a sequence, the nodes light down the
      // spine in order and the record reads as being written.
      //
      // The nodes lead their own text by a beat: the mark is set on the spine
      // first, and the entry it belongs to follows out of it.
      // The body moves, not the whole row. The node is positioned against the
      // row, so translating the row would carry the mark off the spine with
      // it, which is the one thing that has to stay put.
      const entries = gsap.utils.toArray(".chronicle-entry");
      const nodes = entries.map((entry) => entry.querySelector(".chronicle-node"));
      const bodies = entries.map((entry) => entry.querySelector(".chronicle-body"));

      gsap
        .timeline({
          scrollTrigger: { trigger: ".chronicle-entries", start: "top 76%" },
        })
        .from(nodes, {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          stagger: 0.16,
          ease: "back.out(3)",
        })
        .from(
          bodies,
          {
            x: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.16,
            ease: "expo.out",
          },
          0.14,
        );

      gsap.from(".chronicle-sigil", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: ".chronicle-sigils", start: "top 88%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="chronicle"
      ref={section}
      aria-labelledby="chronicle-title"
      className="relative isolate py-28 sm:py-36 overflow-x-clip"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(74% 60% at 50% 45%, rgba(5,3,10,0.96) 0%, rgba(5,3,10,0.86) 55%, rgba(5,3,10,0.45) 100%)",
        }}
      />

      <EmberField count={12} reducedMotion={env.reducedMotion} className="-z-10" />

      <div className="relative mx-auto w-full max-w-4xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <SectionMark
            roman="V"
            label="Infernal Chronicle"
            className="chronicle-rise justify-center"
          />

          <h2 id="chronicle-title" className="mt-7">
            <span className="text-molten chronicle-write block font-display text-[clamp(2rem,5.4vw,4rem)] leading-[0.95] font-black">
              {chronicle.headline}
            </span>
            <span className="chronicle-write mt-3 block font-blackletter text-[clamp(1.35rem,3vw,2rem)] leading-none text-brimstone/85">
              {chronicle.headlineSub}
            </span>
          </h2>

          <p className="chronicle-rise mx-auto mt-6 max-w-md text-parchment">{chronicle.lede}</p>
        </header>

        <ol className="chronicle-entries relative mt-16 space-y-10 sm:mt-20 sm:space-y-12">
          {/* Molten spine, written downward by the scroll. */}
          <span
            aria-hidden="true"
            className="chronicle-spine absolute inset-y-2 left-[7px] w-px
              bg-gradient-to-b from-hellfire via-ember to-blood sm:left-[9px]"
          />

          {chronicle.entries.map((entry) => (
            <li key={entry.title} className="chronicle-entry relative pl-10 sm:pl-14">
              {/* Node struck on the spine. */}
              <span
                aria-hidden="true"
                className="chronicle-node absolute top-1.5 left-0 flex h-4 w-4 rotate-45
                  items-center justify-center border border-brimstone bg-void
                  shadow-[0_0_14px_2px_rgba(255,77,0,0.6)] sm:h-5 sm:w-5"
              >
                <span className="h-1.5 w-1.5 bg-ember" />
              </span>

              <div className="chronicle-body">
                <p className="font-display text-[0.7rem] tracking-[0.28em] text-ember uppercase sm:text-[0.62rem] sm:tracking-[0.32em]">
                  {entry.period}
                  <span aria-hidden="true" className="mx-2 text-iron">
                    /
                  </span>
                  <span className="text-smoke">{entry.kind}</span>
                </p>

                <h3 className="mt-3 font-display text-[clamp(1.15rem,2.6vw,1.6rem)] leading-tight font-bold text-bone">
                  {entry.title}
                </h3>

                {/* Display, not blackletter. "University School of Automation
                    and Robotics, GGSIPU" set in blackletter is decoration at
                    the expense of anyone actually reading it. */}
                <p className="mt-1.5 font-display text-[0.9rem] tracking-[0.06em] text-brimstone/85">
                  {entry.org}
                </p>

                {entry.detail ? (
                  <p className="mt-3 max-w-prose text-parchment">{entry.detail}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        {/* Undated honours, kept out of the timeline so the spine stays honest. */}
        <div className="chronicle-sigils mt-20">
          <h3 className="font-display text-[0.65rem] tracking-[0.4em] text-hellfire uppercase">
            {chronicle.honoursTitle}
          </h3>
          <div
            aria-hidden="true"
            className="mt-4 h-px w-full bg-gradient-to-r from-ember/60 via-ember/15 to-transparent"
          />

          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {chronicle.honours.map((honour) => (
              <li
                key={honour.name}
                className="chronicle-sigil clip-tag surface-forged group relative border
                  border-iron/80 bg-gradient-to-b from-[#1a1421] to-[#0b0810] p-5
                  transition-[border-color,transform] duration-300
                  hover:-translate-y-0.5 hover:border-ember/60"
              >
                {/* Seal pressed into the corner. */}
                <span
                  aria-hidden="true"
                  className="absolute top-4 right-4 h-2 w-2 rotate-45 border border-ember/70
                    transition-colors duration-300 group-hover:bg-ember/70"
                />
                <p className="text-engraved pr-6 font-display text-[0.72rem] font-bold tracking-[0.16em] text-bone uppercase">
                  {honour.name}
                </p>
                <p className="mt-2.5 text-sm text-parchment">{honour.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default memo(Chronicle);
