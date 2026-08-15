import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/typography/SectionTitle";
import { achievements } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Three ruled columns. Deliberately the quietest section on the page: gold is
 * limited to the issuing organisation, so this supports Work and Experience
 * rather than competing with them.
 */
function Achievements({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".ac-rise", {
        y: 24,
        opacity: 0,
        duration: 0.95,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 80%" },
      });

      gsap.from(".ac-item", {
        y: 20,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ac-list", start: "top 88%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="achievements"
      ref={section}
      aria-labelledby="achievements-title"
      className="relative isolate overflow-x-clip pb-28 sm:pb-40 lg:pb-48"
    >
      <div className="mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle
          id="achievements-title"
          index={achievements.index}
          label={achievements.label}
          title={achievements.title}
          accent={achievements.accent}
          itemClass="ac-rise"
        />

        <ul className="ac-list mt-16 grid gap-x-14 gap-y-12 sm:mt-20 lg:grid-cols-3">
          {achievements.items.map((item) => (
            <li key={item.name} className="ac-item relative border-t border-line pt-6">
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 h-px w-10"
                style={{
                  background: "linear-gradient(90deg, #d4af37, rgba(140,101,8,0))",
                }}
              />
              <p className="eyebrow-sm text-gold-dark">{item.org}</p>
              <h3 className="mt-4 font-display text-[1.6rem] leading-tight font-light text-ivory">
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

export default memo(Achievements);
