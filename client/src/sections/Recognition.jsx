import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../components/ui/SectionHeading";
import { recognition } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Deliberately the quietest section on the page. Three ruled columns, no
 * boxes and no gold beyond the issuing organisation — it should support
 * Work and Experience, not compete with them.
 */
function Recognition({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".rec-rise", {
        y: 22,
        opacity: 0,
        duration: 0.95,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 80%" },
      });

      gsap.from(".rec-item", {
        y: 18,
        opacity: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: ".rec-list", start: "top 88%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="recognition"
      ref={section}
      aria-labelledby="recognition-title"
      className="relative isolate overflow-x-clip pb-28 sm:pb-40 lg:pb-48"
    >
      <div className="mx-auto w-full max-w-[104rem] px-6 sm:px-10">
        <SectionHeading
          id="recognition-title"
          index={recognition.index}
          label={recognition.label}
          title={recognition.title}
          itemClass="rec-rise"
        />

        <ul className="rec-list mt-14 grid gap-x-14 gap-y-12 sm:mt-16 lg:grid-cols-3">
          {recognition.items.map((item) => (
            <li key={item.name} className="rec-item border-t border-line pt-6">
              <p className="eyebrow-sm text-gold-deep">{item.org}</p>
              <h3 className="mt-4 font-display text-[1.5rem] leading-tight font-light text-ivory">
                {item.name}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed">{item.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default memo(Recognition);
