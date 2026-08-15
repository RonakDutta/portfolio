import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, subscribe, frame } from "../../lib/store";
import { scrollToSection } from "../../lib/useSmoothScroll";
import Monogram from "./Monogram";
import { identity, hero } from "../../data/content";

/**
 * The bar, and the sheet it opens into on small screens.
 *
 * The old mobile menu was a max-height accordion that pushed a cramped list
 * under the bar. This opens a full sheet instead: the links are set at a size
 * you can actually hit, the page underneath is locked, and focus and Escape
 * behave the way a dialog should.
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

  // Lock the page behind the sheet, including the smooth scroller, which does
  // not care about `overflow: hidden` on its own.
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
          className="mx-auto flex w-full max-w-[102rem] items-center justify-between gap-6 px-5 py-4 sm:px-9"
        >
          <button
            type="button"
            onClick={() => select(SECTIONS[0].id)}
            data-cursor="Top"
            className="group -ml-1 flex min-h-11 items-center gap-3 px-1"
          >
            <Monogram className="h-9 w-9 transition-transform duration-500 group-hover:scale-105" />
            <span className="sr-only">{identity.name}, back to the top</span>
            <span className="hidden font-display text-[0.95rem] tracking-tight text-pearl sm:block">
              {identity.family}
            </span>
          </button>

          <ul className="hidden items-center gap-8 lg:flex">
            {SECTIONS.map((section, i) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => select(section.id)}
                  aria-current={i === active ? "true" : undefined}
                  className={`group relative flex min-h-11 items-center gap-2 eyebrow-sm
                    transition-colors duration-[400ms] ${
                      i === active
                        ? "text-ivory"
                        : "text-sand/70 hover:text-ivory"
                    }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1 w-1 rotate-45 bg-brass transition-all duration-500 ${
                      i === active ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
                  />
                  {section.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <span className="hidden eyebrow-sm text-sand/60 xl:block">
              {hero.status}
            </span>

            <a
              href={identity.resume}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Open PDF"
              className="hidden min-h-11 items-center border border-brass/30 px-5 eyebrow-sm
                text-brass-lit transition-colors duration-500 hover:border-brass
                hover:bg-brass hover:text-ink sm:inline-flex"
            >
              Resume
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-panel"
              className="flex min-h-11 min-w-11 items-center justify-end gap-3 eyebrow-sm
                text-sand transition-colors duration-500 hover:text-ivory lg:hidden"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
                <span
                  className={`block h-px w-full bg-brass transition-transform duration-500 ${
                    open ? "translate-y-[3px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-px w-full bg-brass transition-transform duration-500 ${
                    open ? "-translate-y-[3px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* The sheet. Kept mounted and inert when closed so the transition runs
          both ways and nothing inside is reachable while it is shut. */}
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
                  className="flex w-full items-baseline gap-5 py-3 text-left"
                  style={{
                    transitionDelay: open ? `${120 + i * 45}ms` : "0ms",
                    transform: open ? "none" : "translateY(120%)",
                    opacity: open ? 1 : 0,
                    transition:
                      "transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.7s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <span className="eyebrow-sm text-brass/70">{section.num}</span>
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

          <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-brass/10">
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
                className="link-underline min-h-11 eyebrow-sm text-sand transition-colors
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
