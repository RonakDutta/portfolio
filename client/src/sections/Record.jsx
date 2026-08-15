import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "../components/ui/SectionHeader";
import { record } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * One entry in the chronology. Bronze milestone node, engraved rule.
 *
 * `as` keeps the outline contiguous: a group with its own heading nests its
 * entries a level deeper, an untitled group sits directly under the section.
 */
function Entry({ period, title, org, detail, as: Heading = "h4" }) {
  return (
    <li className="record-entry relative pl-9 sm:pl-12">
      <span
        aria-hidden="true"
        className="absolute top-[0.55rem] left-0 flex h-3.5 w-3.5 rotate-45 items-center
          justify-center border border-bronze/80 bg-void"
      >
        <span className="h-1 w-1 bg-bronze-lit" />
      </span>

      <p className="font-mono text-[0.65rem] tracking-[0.22em] text-bronze uppercase">
        {period}
      </p>

      <Heading className="mt-3 font-display text-[clamp(1.1rem,2.4vw,1.45rem)] leading-snug font-bold text-bone">
        {title}
      </Heading>

      <p className="mt-1.5 text-[0.95rem] text-parchment/85">{org}</p>

      {detail ? (
        <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed">
          {detail}
        </p>
      ) : null}
    </li>
  );
}

function Group({ title, entries }) {
  return (
    <div className="record-group">
      {title ? (
        <h3 className="font-mono text-[0.62rem] tracking-[0.34em] text-smoke uppercase">
          {title}
        </h3>
      ) : null}

      <ol className={`relative space-y-10 ${title ? "mt-8" : ""}`}>
        <span
          aria-hidden="true"
          className="record-spine absolute inset-y-1.5 left-[6px] w-px
            bg-gradient-to-b from-bronze/55 via-bronze-dim/45 to-transparent"
        />
        {entries.map((entry) => (
          <Entry key={entry.title} {...entry} as={title ? "h4" : "h3"} />
        ))}
      </ol>
    </div>
  );
}

function Record({ env }) {
  const section = useRef(null);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".record-rise", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 74%" },
      });

      gsap.utils.toArray(".record-group").forEach((group) => {
        gsap.from(group.querySelectorAll(".record-entry"), {
          y: 20,
          opacity: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 86%" },
        });

        gsap.from(group.querySelector(".record-spine"), {
          scaleY: 0,
          transformOrigin: "50% 0%",
          ease: "none",
          scrollTrigger: {
            trigger: group,
            start: "top 84%",
            end: "bottom 70%",
            scrub: 0.4,
          },
        });
      });

      gsap.from(".record-cert", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: ".record-certs", start: "top 88%" },
      });
    }, section);

    return () => ctx.revert();
  }, [env.reducedMotion]);

  return (
    <section
      id="chronicle"
      ref={section}
      aria-labelledby="record-title"
      className="relative isolate overflow-x-clip py-28 sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(74% 60% at 50% 45%, rgba(5,4,9,0.96) 0%, rgba(5,4,9,0.87) 56%, rgba(5,4,9,0.46) 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-4xl px-6">
        <SectionHeader
          id="record-title"
          index={record.index}
          label={record.label}
          title={record.title}
          lede={record.lede}
          itemClass="record-rise"
        />

        <div className="mt-16 space-y-16 sm:mt-20">
          <Group entries={record.experience} />
          <Group title={record.educationTitle} entries={record.education} />
        </div>

        <div className="record-certs mt-20">
          <h3 className="font-mono text-[0.62rem] tracking-[0.34em] text-smoke uppercase">
            {record.certificationsTitle}
          </h3>

          <ul className="mt-8 grid gap-px border border-iron bg-iron sm:grid-cols-3">
            {record.certifications.map((item) => (
              <li key={item.name} className="record-cert bg-obsidian p-6">
                <p className="text-engraved font-display text-[0.95rem] leading-snug font-bold text-bone">
                  {item.name}
                </p>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-parchment/85">
                  {item.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default memo(Record);
