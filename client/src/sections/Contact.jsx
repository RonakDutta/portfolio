import { memo, useState } from "react";
import SectionTitle from "../components/typography/SectionTitle";
import GoldGeometry from "../components/atmosphere/GoldGeometry";
import GoldAurora from "../components/atmosphere/GoldAurora";
import LuxuryButton from "../components/ui/LuxuryButton";
import { scrollToSection } from "../lib/useSmoothScroll";
import { SECTIONS } from "../lib/store";
import { contact, identity } from "../data/content";

const stripScheme = (href) =>
  href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Contact({ env }) {
  const [copied, setCopied] = useState("");

  const channels = contact.channels.filter((c) => c.href);


  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 2200);
    } catch {
      /* Clipboard fallback */
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden py-28 sm:py-40 lg:py-52"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <GoldAurora still={env.reducedMotion} intensity={env.lightweight ? 0.5 : 0.85} />
      </div>

      <GoldGeometry
        variant="orbit"
        data-reveal className="top-1/2 left-1/2 aspect-square w-[150vmin] -translate-x-1/2 -translate-y-1/2 opacity-55 lg:w-[96vmin]"
      />

      <div className="relative mx-auto w-full max-w-[108rem] px-6 sm:px-10">
        <SectionTitle
          id="contact-title"
          index={contact.index}
          label={contact.label}
          title={contact.title}
          itemClass="reveal"
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <p data-reveal className="max-w-md text-[1.08rem] leading-relaxed text-sand/90 font-light">
              {contact.lede}
            </p>
            <div data-reveal className="mt-8">
              <LuxuryButton variant="gold" href={contact.cta.href} magnetic={env.pointerFx}>
                {contact.cta.label} ↗
              </LuxuryButton>
            </div>
          </div>

          <div className="ct-card rounded-2xl border border-gold-dark/25 bg-carbon/85 p-6 sm:p-8">
            <h3 className="eyebrow-sm text-gold-metal mb-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rotate-45 bg-gold-metal" />
              Links & Contact Information
            </h3>

            <ul className="space-y-4">
              {channels.map((channel) => {
                const external = channel.href.startsWith("http");
                const value = channel.value || stripScheme(channel.href);

                return (
                  <li
                    key={channel.label}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gold-dark/15 bg-coal/60 p-4 transition-all duration-300 hover:border-gold-metal/40 hover:bg-coal/90"
                  >
                    <span className="eyebrow-sm text-champagne/90 sm:w-28 sm:shrink-0">
                      {channel.label}
                    </span>

                    <div className="flex items-center justify-between gap-3 sm:min-w-0 sm:flex-1">
                      <a
                        href={channel.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer noopener" : undefined}
                        className="flex min-h-11 min-w-0 flex-1 items-center truncate text-sm font-medium text-ivory transition-colors hover:text-gold-white"
                      >
                        {value}
                        {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                      </a>

                      {channel.copy ? (
                        <button
                          type="button"
                          onClick={() => copy(channel.value)}
                          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-md border border-gold-dark/30 bg-carbon px-3 eyebrow-sm text-[0.62rem] text-sand/80 transition-all hover:border-gold-metal hover:text-gold-white cursor-pointer"
                        >
                          {copied === channel.value ? (
                            <span className="text-gold-bright">Copied</span>
                          ) : (
                            <span>Copy</span>
                          )}
                        </button>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {copied ? "Copied to clipboard" : ""}
        </p>

        <footer data-reveal className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-gold-dark/20 pt-8 sm:flex-row sm:items-center">
          <p className="eyebrow-sm text-mute">
            {contact.closing}
            <span aria-hidden="true" className="mx-3 text-gold-dark/40">/</span>
            {new Date().getFullYear()}
          </p>

          <button
            type="button"
            onClick={() => scrollToSection(SECTIONS[0].id)}
            className="gold-underline group inline-flex min-h-11 items-center gap-3 eyebrow-sm
              text-sand transition-colors duration-500 hover:text-ivory cursor-pointer"
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
