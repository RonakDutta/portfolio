import { memo, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SummoningCircle from "../components/summoning/SummoningCircle";
import ForgedButton from "../components/ui/ForgedButton";
import SectionHeader from "../components/ui/SectionHeader";
import EmberField from "../components/ui/EmberField";
import { scrollToSection } from "../lib/useSmoothScroll";
import { SECTIONS } from "../lib/store";
import { contact, identity } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

const stripScheme = (href) =>
  href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Contact({ env }) {
  const section = useRef(null);
  const [copied, setCopied] = useState("");

  // Rows with no href are dropped, so an unset LinkedIn URL simply does not
  // render rather than producing a dead link.
  const channels = contact.channels.filter((c) => c.href);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".contact-rise", {
        y: 24,
        opacity: 0,
        duration: 0.95,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 72%" },
      });

      gsap.from(".contact-circle", {
        scale: 0.85,
        opacity: 0,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 74%" },
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
      /* Clipboard denied. The address is on screen and selectable anyway. */
    }
  };

  return (
    <section
      id="summoning"
      ref={section}
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden py-28 sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(88% 76% at 50% 46%, rgba(5,4,9,0.97) 0%, rgba(5,4,9,0.9) 52%, rgba(5,4,9,0.6) 100%)",
        }}
      />

      <EmberField
        count={10}
        reducedMotion={env.reducedMotion}
        isMobile={env.isMobile}
        className="-z-10"
      />

      {/* The circle sits behind the whole section, centred on the CTA. */}
      <div
        aria-hidden="true"
        className="contact-circle pointer-events-none absolute top-1/2 left-1/2 -z-10
          aspect-square w-[min(120vw,46rem)] -translate-x-1/2 -translate-y-1/2 opacity-70"
      >
        <SummoningCircle reducedMotion={env.reducedMotion} />
      </div>

      <div className="relative mx-auto w-full max-w-2xl px-6 text-center">
        <SectionHeader
          id="contact-title"
          index={contact.index}
          label={contact.label}
          title={contact.title}
          lede={contact.lede}
          align="center"
          itemClass="contact-rise"
        />

        <div className="contact-rise mt-10 flex justify-center">
          <ForgedButton href={contact.cta.href}>
            {contact.cta.label}
          </ForgedButton>
        </div>

        <ul className="contact-rise mt-14 border-t border-iron text-left">
          {channels.map((channel) => {
            const external = channel.href.startsWith("http");
            const value = channel.value || stripScheme(channel.href);

            return (
              /* Label stacks above the value below `sm`: at 320px there is not
                 enough room for a label column, an address and a copy button
                 on one line without truncating the address. */
              <li
                key={channel.label}
                className="border-b border-iron bg-obsidian/40 px-4 py-2
                  sm:flex sm:items-center sm:gap-4 sm:py-1"
              >
                <span className="block font-mono text-[0.62rem] tracking-[0.24em] text-bronze uppercase sm:w-24 sm:shrink-0">
                  {channel.label}
                </span>

                <div className="flex items-center gap-2 sm:min-w-0 sm:flex-1">
                  <a
                    href={channel.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer noopener" : undefined}
                    className="flex min-h-11 min-w-0 flex-1 items-center truncate text-[0.82rem]
                      text-bone transition-colors duration-300 hover:text-bronze-lit
                      min-[360px]:text-[0.9rem] sm:text-[0.95rem]"
                  >
                    {value}
                    {external ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </a>

                  {channel.copy ? (
                    <button
                      type="button"
                      onClick={() => copy(channel.value)}
                      className="flex min-h-11 min-w-11 shrink-0 items-center justify-center
                        font-mono text-[0.6rem] tracking-[0.18em] text-parchment/70 uppercase
                        transition-colors duration-300 hover:text-bronze-lit"
                    >
                      <span aria-hidden="true">
                        {copied === channel.value ? "Copied" : "Copy"}
                      </span>
                      <span className="sr-only">
                        {copied === channel.value
                          ? "Address copied to clipboard"
                          : `Copy ${channel.label.toLowerCase()} address`}
                      </span>
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        <p aria-live="polite" className="sr-only">
          {copied ? "Copied to clipboard" : ""}
        </p>

        <footer className="contact-rise mt-16">
          <p className="font-mono text-[0.62rem] tracking-[0.26em] text-smoke uppercase">
            {contact.closing}
            <span aria-hidden="true" className="mx-3 text-slate">
              /
            </span>
            {new Date().getFullYear()}
          </p>

          <button
            type="button"
            onClick={() => scrollToSection(SECTIONS[0].id)}
            className="group mx-auto mt-10 flex min-h-11 flex-col items-center gap-3 px-4"
          >
            <span
              aria-hidden="true"
              className="relative block h-12 w-px bg-gradient-to-t from-transparent via-bronze/40 to-transparent"
            >
              <span className="animate-ember-climb absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-hellfire shadow-[0_0_8px_2px_rgba(255,148,72,0.5)]" />
            </span>
            <span className="font-mono text-[0.6rem] tracking-[0.32em] text-parchment/60 uppercase transition-colors duration-300 group-hover:text-bronze-lit">
              {contact.ascend}
            </span>
          </button>

          <p className="sr-only">
            {identity.name}, {identity.role} in {identity.region}. Contact by
            email at {identity.email}.
          </p>
        </footer>
      </div>
    </section>
  );
}

export default memo(Contact);
