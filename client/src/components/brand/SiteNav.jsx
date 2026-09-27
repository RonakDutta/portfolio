import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, subscribe, frame } from "../../lib/store";
import { scrollToSection } from "../../lib/useSmoothScroll";
import Monogram from "./Monogram";
import { identity, hero } from "../../data/content";

/**
 * Site navigation bar and full-screen mobile drawer.
 *
 * Refined editorial design:
 * - Fluid pill tabs with active indicator glow.
 * - Humanist typography in Instrument Sans.
 * - Tactile capsule Resume CTA with micro-interaction.
 * - Live presence status beacon.
 */
function SiteNav() {
  const [active, setActive] = useState(frame.section);
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => subscribe(setActive), []);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the sheet, including the smooth scroller
  useEffect(() => {
    if (!open) return;

    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();

    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);

    panelRef.current?.querySelector("button, a")?.focus({ preventScroll: true });

    return () => {
      document.documentElement.style.removeProperty("overflow");
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = useCallback((id) => {
    document.documentElement.style.removeProperty("overflow");
    window.__lenis?.start();
    setOpen(false);
    requestAnimationFrame(() => {
      scrollToSection(id);
    });
  }, []);

  const solid = lifted && !open;

  return (
    <header className="fixed inset-x-0 top-0 z-[70]">
      <div
        className={`relative transition-colors duration-700 ${
          solid ? "glass-ink" : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex w-full max-w-[102rem] items-center justify-between gap-6 px-5 py-3.5 sm:px-9 sm:py-4"
        >
          {/* Logo / Monogram */}
          <button
            type="button"
            onClick={() => select(SECTIONS[0].id)}
            data-cursor="Top"
            className="group -ml-1 flex min-h-11 items-center gap-3 px-1 rounded-full focus-visible:ring-1 focus-visible:ring-brass"
          >
            <Monogram className="h-9 w-9 transition-transform duration-500 group-hover:scale-105" />
            <span className="sr-only">{identity.name}, back to the top</span>
            <span className="hidden font-display text-[1rem] tracking-tight text-pearl sm:block">
              {identity.family}
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-1.5 rounded-full border border-brass/15 bg-carbon/60 p-1.5 backdrop-blur-md lg:flex">
            {SECTIONS.map((section, i) => {
              const isActive = i === active;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => select(section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`group relative flex items-center gap-2 rounded-full px-4 py-2 font-sans text-[0.875rem]
                      font-medium tracking-[-0.01em] transition-all duration-300 ${
                        isActive
                          ? "bg-brass/15 text-ivory ring-1 ring-brass/30 shadow-[0_0_16px_rgba(200,164,92,0.12)]"
                          : "text-sand/75 hover:bg-white/[0.04] hover:text-ivory"
                      }`}
                  >
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-brass shadow-[0_0_8px_rgba(200,164,92,0.8)]"
                      />
                    ) : null}
                    {section.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right Action Bar */}
          <div className="flex items-center gap-4">
            {/* Status Beacon */}
            <div className="hidden items-center gap-2.5 rounded-full border border-brass/15 bg-carbon/40 px-3.5 py-1.5 font-sans text-[0.8rem] font-normal text-sand/80 xl:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              </span>
              <span>{hero.status}</span>
            </div>

            {/* Resume Capsule */}
            <a
              href={identity.resume}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Open PDF"
              className="group hidden min-h-10 items-center gap-2 rounded-full border border-brass/35 bg-brass/[0.08]
                px-4.5 py-2 font-sans text-[0.82rem] font-medium tracking-tight text-brass-lit shadow-[0_2px_12px_-2px_rgba(200,164,92,0.15)]
                transition-all duration-300 hover:border-brass hover:bg-brass hover:text-ink hover:shadow-[0_2px_18px_rgba(200,164,92,0.35)]
                active:scale-95 sm:inline-flex"
            >
              <span>Resume</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className="h-3 w-3 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 1.5v6.5M3.5 5.5 6 8l2.5-2.5M1.5 10.5h9" />
              </svg>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-panel"
              className="group flex min-h-10 items-center gap-2.5 rounded-full border border-brass/25 bg-carbon/60
                px-4 py-2 font-sans text-[0.84rem] font-medium text-sand transition-all duration-300
                hover:border-brass/50 hover:text-ivory active:scale-95 lg:hidden"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden="true" className="flex w-4 flex-col gap-[4px]">
                <span
                  className={`block h-px w-full bg-brass transition-transform duration-300 ${
                    open ? "translate-y-[2.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-px w-full bg-brass transition-transform duration-300 ${
                    open ? "-translate-y-[2.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Drawer Sheet */}
      <div
        id="nav-panel"
        ref={panelRef}
        inert={!open ? true : undefined}
        className={`fixed inset-0 -z-10 overflow-y-auto overscroll-contain
          bg-ink px-6 pt-28 pb-10 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          lg:hidden ${
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-4 opacity-0"
          }`}
      >
        <div className="flex min-h-full flex-col justify-between gap-8">
          <ul className="flex flex-col">
            {SECTIONS.map((section, i) => (
              <li key={section.id} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => select(section.id)}
                  aria-current={i === active ? "true" : undefined}
                  className="flex w-full items-baseline gap-5 py-3.5 text-left"
                  style={{
                    transitionDelay: open ? `${120 + i * 45}ms` : "0ms",
                    transform: open ? "none" : "translateY(120%)",
                    opacity: open ? 1 : 0,
                    transition:
                      "transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.7s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <span className="font-mono text-[0.78rem] text-brass/70">{section.num}</span>
                  <span
                    className={`font-display text-[2.1rem] leading-tight tracking-tight transition-colors
                      duration-[400ms] ${i === active ? "text-brass-lit" : "text-ivory"}`}
                  >
                    {section.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-brass/10 pt-6">
            {[
              { label: "Email", href: `mailto:${identity.email}` },
              { label: "GitHub", href: identity.github },
              { label: "LinkedIn", href: identity.linkedin },
              { label: "Resume", href: identity.resume },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={() => {
                  if (link.href.startsWith("mailto:")) {
                    setOpen(false);
                  }
                }}
                className="link-underline min-h-11 font-sans text-[0.88rem] font-medium text-sand transition-colors
                  duration-500 hover:text-brass-lit"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(SiteNav);
