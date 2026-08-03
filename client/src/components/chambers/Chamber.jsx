import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/**
 * One chamber: a project, presented as a sealed room you are shown into.
 *
 * The reveal is the "emerge from darkness" beat. A void-coloured shroud sits
 * over the whole card and lifts as it enters view, which is cheaper than
 * animating a filter and reads far heavier than a plain fade, because the card
 * resolves out of black rather than sliding in from transparent.
 *
 * Every field except name, kind and summary is optional, so a half-filled
 * project still renders as a complete-looking card rather than an empty shell.
 */
function Chamber({ project, index, reducedMotion = false }) {
  const root = useRef(null);
  const shroud = useRef(null);

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top 82%" },
        })
        .from(root.current, { y: 64, duration: 1.1, ease: "expo.out" }, 0)
        // fromTo, not to. The shroud rests transparent in CSS so that skipping
        // this effect leaves a readable card instead of a black rectangle;
        // GSAP paints the darkness in and then lifts it.
        .fromTo(shroud.current, { opacity: 1 }, { opacity: 0, duration: 1.2, ease: "power2.out" }, 0)
        .from(
          root.current.querySelectorAll(".chamber-line"),
          { y: 18, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" },
          0.35,
        );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  const { name, kind, summary, work, stack, links } = project;

  return (
    <article
      ref={root}
      className="clip-plaque group relative isolate overflow-hidden border border-iron/70
        bg-gradient-to-br from-[#15111c]/95 to-[#09060e]/95
        transition-[border-color,box-shadow] duration-500
        hover:border-ember/45 hover:shadow-[0_0_60px_-24px_rgba(255,77,0,0.85)]"
    >
      {/* Light under the door. Widens as the chamber warms to you. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-transparent
          via-ember to-transparent opacity-60 transition-all duration-500
          group-hover:w-[6px] group-hover:opacity-100"
      />

      {/* The chamber's number, set large and cold behind everything. Arabic
          rather than roman here: an outlined "I" at this size is two bare
          strokes and reads as a stray bar, not as a numeral. */}
      <span
        aria-hidden="true"
        className="text-outline-ember pointer-events-none absolute -top-8 right-4
          font-display text-[8rem] leading-none font-black opacity-[0.09] select-none
          sm:text-[12rem]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-12">
        <div>
          <p className="chamber-line font-display text-[0.7rem] tracking-[0.28em] text-ember uppercase sm:text-[0.6rem] sm:tracking-[0.36em]">
            Chamber {ROMAN[index] ?? index + 1}
          </p>

          <h3 className="chamber-line mt-4 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.02] font-black text-bone">
            {name}
          </h3>

          <p className="chamber-line mt-2 font-blackletter text-lg text-brimstone/85">{kind}</p>

          {stack?.length ? (
            <ul className="chamber-line mt-6 flex flex-wrap gap-x-3 gap-y-2">
              {stack.map((tech) => (
                <li
                  key={tech}
                  className="border border-iron/80 px-2.5 py-1 font-display text-[0.6rem]
                    tracking-[0.16em] text-parchment uppercase"
                >
                  {tech}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <p className="chamber-line text-parchment/90">{summary}</p>

          {work?.length ? (
            <ul className="mt-6 space-y-3">
              {work.map((line) => (
                <li key={line} className="chamber-line flex gap-3 text-parchment/80">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-ember" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {links?.length ? (
            <div className="chamber-line mt-7 flex flex-wrap gap-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/link relative inline-flex min-h-11 items-center
                    font-display text-[0.68rem] font-bold tracking-[0.24em] text-hellfire
                    uppercase transition-colors hover:text-bone"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2 left-0 h-px w-full origin-left scale-x-100
                      bg-ember transition-transform duration-300 group-hover/link:scale-x-0"
                  />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* The darkness the chamber resolves out of. */}
      <span
        ref={shroud}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-void opacity-0"
      />
    </article>
  );
}

export default memo(Chamber);
