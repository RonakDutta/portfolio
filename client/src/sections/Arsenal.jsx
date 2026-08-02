import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ForgedTag from "../components/arsenal/ForgedTag";
import SectionMark from "../components/ui/SectionMark";
import { arsenal } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section III: Arsenal.
 *
 * Five racks, sized so the grid resolves into two clean rows on a wide screen
 * rather than leaving an orphan in a third. The spans are presentation, so they
 * live here and not in the content file.
 */
const SPANS = [
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
];

function Arsenal({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".arsenal-rise", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 70%" },
      });

      // Racks emerge from the dark one at a time as they come into view.
      gsap.utils.toArray(".arsenal-rack").forEach((rack) => {
        gsap
          .timeline({ scrollTrigger: { trigger: rack, start: "top 88%" } })
          .from(rack, { y: 56, opacity: 0, duration: 0.9, ease: "expo.out" })
          .from(
            rack.querySelectorAll(".arsenal-tag"),
            { y: 14, opacity: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" },
            0.25,
          );
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="arsenal"
      ref={section}
      aria-labelledby="arsenal-title"
      className="relative isolate flex min-h-screen items-center py-28 sm:py-36"
    >
      {/* Copy floor, same job as in section II: the lava behind runs hot and
          small caps need a darker ground than a heading does. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 65% at 50% 50%, rgba(5,3,10,0.95) 0%, rgba(5,3,10,0.82) 55%, rgba(5,3,10,0.4) 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <SectionMark
            roman="III"
            label="Arsenal"
            className="arsenal-rise justify-center"
          />

          <h2 id="arsenal-title" className="mt-7">
            <span className="text-molten arsenal-rise block font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] font-black">
              {arsenal.headline}
            </span>
            <span className="arsenal-rise mt-3 block font-blackletter text-[clamp(1.35rem,3vw,2rem)] leading-none text-brimstone/85">
              {arsenal.headlineSub}
            </span>
          </h2>

          <p className="arsenal-rise mx-auto mt-6 max-w-md text-parchment/85">{arsenal.lede}</p>
        </header>

        {/* items-start so each rack hugs its own contents. Stretching them to a
            shared height leaves Back-End, which holds two tags, half empty. */}
        <div className="mt-16 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {arsenal.racks.map((rack, i) => (
            <article
              key={rack.name}
              className={`arsenal-rack clip-plaque relative border border-iron/70
                bg-gradient-to-b from-[#15111c]/95 to-[#0a0710]/95 p-6 ${SPANS[i]}`}
            >
              {/* The rail the tags hang from. */}
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-[0.7rem] font-bold tracking-[0.32em] text-hellfire uppercase">
                  {rack.name}
                </h3>
                <span aria-hidden="true" className="font-display text-[0.65rem] text-smoke">
                  {String(rack.items.length).padStart(2, "0")}
                </span>
              </div>

              <div
                aria-hidden="true"
                className="mt-4 h-px w-full bg-gradient-to-r from-ember/60 via-ember/20 to-transparent"
              />

              <ul className="mt-5 flex flex-wrap gap-2.5">
                {rack.items.map((item) => (
                  <ForgedTag key={item} label={item} className="arsenal-tag" />
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Arsenal);
