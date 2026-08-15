import { memo, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/typography/SectionTitle";
import GoldGeometry from "../components/atmosphere/GoldGeometry";
import GoldAurora from "../components/atmosphere/GoldAurora";
import LuxuryButton from "../components/ui/LuxuryButton";
import { scrollToSection } from "../lib/useSmoothScroll";
import { SECTIONS } from "../lib/store";
import { contact, identity } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

const stripScheme = (href) =>
  href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * The closing frame. The largest type on the page after the hero, a second
 * aurora local to this section so the gold visibly gathers at the end, and the
 * channels as a ruled list. The geometry returns here and nowhere in between,
 * which is what makes it read as a bookend rather than as wallpaper.
 */
function Contact({ env }) {
  const section = useRef(null);
  const [copied, setCopied] = useState("");

  // Rows without an href are dropped, so an unset LinkedIn URL simply does not
  // render rather than becoming a dead link.
  const channels = contact.channels.filter((c) => c.href);

  useLayoutEffect(() => {
    if (env.reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: section.current, start: "top 70%" } })
        .from(".ct-rise", { y: 28, opacity: 0, duration: 1.15, stagger: 0.08, ease: "expo.out" })
        .from(".ct-geo", { opacity: 0, duration: 2.2, ease: "power2.out" }, 0)
        .from(".ct-row", { y: 18, opacity: 0, duration: 0.85, stagger: 0.07, ease: "power3.out" }, 0.45);
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
      id="contact"
      ref={section}
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden py-28 sm:py-40 lg:py-52"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <GoldAurora still={env.reducedMotion} intensity={env.lightweight ? 0.5 : 0.85} />
      </div>

      <GoldGeometry
        variant="orbit"
        className="ct-geo top-1/2 left-1/2 aspect-square w-[150vmin] -translate-x-1/2 -translate-y-1/2 opacity-55 lg:w-[96vmin]"
      />

      <div className="relative mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle index={contact.index} label={contact.label} itemClass="ct-rise" />

        <h2
          id="contact-title"
          className="ct-rise mt-10 font-display text-[clamp(3rem,12vw,10rem)] leading-[0.88] font-light sm:mt-12"
        >
          <span className="text-ivory-lit block">{contact.title}</span>{" "}
          <span className="text-foil animate-foil block italic sm:pl-[0.12em]">
            {contact.accent}
          </span>
        </h2>

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-24">
          <div>
            <p className="ct-rise max-w-md text-pearl/85">{contact.lede}</p>
            <div className="ct-rise mt-10">
              <LuxuryButton variant="gold" href={contact.cta.href} magnetic={env.pointerFx}>
                {contact.cta.label}
              </LuxuryButton>
            </div>
          </div>

          <ul>
            {channels.map((channel) => {
              const external = channel.href.startsWith("http");
              const value = channel.value || stripScheme(channel.href);

              return (
                /* Label above the value below `sm`: at 320px a label column, an
                   address and a copy button do not share a line without
                   truncating the address. */
                <li
                  key={channel.label}
                  className="ct-row border-t border-line py-4 sm:flex sm:items-center sm:gap-8 sm:py-3"
                >
                  <span className="block eyebrow-sm text-champagne sm:w-24 sm:shrink-0">
                    {channel.label}
                  </span>

                  <div className="flex items-center gap-3 sm:min-w-0 sm:flex-1">
                    <a
                      href={channel.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer noopener" : undefined}
                      className="flex min-h-11 min-w-0 flex-1 items-center truncate font-display
                        text-[1.05rem] font-light text-ivory transition-colors duration-500
                        hover:text-gold-white min-[360px]:text-[1.2rem] sm:text-[1.4rem]"
                    >
                      {value}
                      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                    </a>

                    {channel.copy ? (
                      <button
                        type="button"
                        onClick={() => copy(channel.value)}
                        className="flex min-h-11 min-w-11 shrink-0 items-center justify-center
                          eyebrow-sm text-mute transition-colors duration-500 hover:text-gold-white"
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
            <li aria-hidden="true" className="h-px w-full bg-line" />
          </ul>
        </div>

        <p aria-live="polite" className="sr-only">
          {copied ? "Copied to clipboard" : ""}
        </p>

        <footer className="ct-rise mt-24 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="eyebrow-sm text-mute">
            {contact.closing}
            <span aria-hidden="true" className="mx-3 text-line">/</span>
            {new Date().getFullYear()}
          </p>

          <button
            type="button"
            onClick={() => scrollToSection(SECTIONS[0].id)}
            className="gold-underline group inline-flex min-h-11 items-center gap-3 eyebrow-sm
              text-sand transition-colors duration-500 hover:text-ivory"
          >
            {contact.backToTop}
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className="h-2.5 w-2.5 text-gold-metal transition-transform duration-500 group-hover:-translate-y-1"
            >
              <path d="M6 11V1M2 5l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>

          <p className="sr-only">
            {identity.name}, {identity.role} in {identity.region}. Contact by email at{" "}
            {identity.email}.
          </p>
        </footer>
      </div>
    </section>
  );
}

export default memo(Contact);
