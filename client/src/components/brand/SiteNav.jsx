import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, subscribe, frame } from "../../lib/store";
import { scrollToSection } from "../../lib/useSmoothScroll";
import Monogram from "./Monogram";
import PhaseMark from "./PhaseMark";
import { Arrow } from "../ui/Button";
import { identity } from "../../data/content";

/**
 * The bar, and the full-screen index it opens into on small screens.
 *
 * Set entirely in the mono, small and spaced, so it reads as the instrument
 * panel and never competes with the type on the page. The active section is
 * lit and underscored; the eclipse at the right edge is the reading progress.
 */
function SiteNav() {
  const [active, setActive] = useState(frame.section);
  const [lifted, setLifted] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => subscribe(setActive), []);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      setLifted(y > 40);
      if (y < 120) setTucked(false);
      else if (y - last > 8) setTucked(true);
      else if (last - y > 8) setTucked(false);
      else return;
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
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
    requestAnimationFrame(() => scrollToSection(id));
  }, []);

  const socials = [
    { label: "Email", href: `mailto:${identity.email}` },
    { label: "GitHub", href: identity.github },
    { label: "LinkedIn", href: identity.linkedin },
    { label: "Resume", href: identity.resume },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-[70]">
      <div
        className={`relative transition-[translate,background-color] duration-700 ease-[var(--ease-cine)] focus-within:translate-y-0 ${
          tucked && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-[150%] bg-gradient-to-b from-ink via-ink/80 to-transparent
            transition-opacity duration-700 ${lifted && !open ? "opacity-100" : "opacity-0"}`}
        />
        <nav
          aria-label="Primary"
          className="relative mx-auto flex h-16 w-full max-w-[112rem] items-center justify-between gap-6 px-5 sm:h-20 sm:px-9"
        >
          <button
            type="button"
            onClick={() => select(SECTIONS[0].id)}
            className="group -ml-1 flex min-h-11 items-center gap-3 px-1"
          >
            <Monogram className="h-8 w-8 group-hover:rotate-[-8deg]" />
            <span className="sr-only">{identity.name}, back to the top</span>
            <span
              aria-hidden="true"
              className="hidden text-[0.95rem] font-[650] tracking-[-0.01em] text-ivory [font-stretch:112%] sm:block"
            >
              {identity.name}
            </span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {SECTIONS.slice(1).map((section) => {
              const i = SECTIONS.indexOf(section);
              const isActive = i === active;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => select(section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`group relative flex min-h-11 items-baseline gap-1.5 px-3.5 text-[0.9rem] font-[520] transition-colors duration-500 ${
                      isActive ? "text-gold-lit" : "text-bone/65 hover:text-ivory"
                    }`}
                  >
                    <span className={`font-mono text-[0.6rem] ${isActive ? "text-gold" : "text-ash/60"}`}>
                      {section.num}
                    </span>
                    <span>{section.label}</span>
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3.5 bottom-1.5 h-px origin-left bg-gold-lit transition-transform duration-700 ease-[var(--ease-cine)] ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-4 sm:gap-6">
            <PhaseMark className="h-6 w-6" />
            <a
              href={identity.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden min-h-11 items-center gap-2 text-[0.9rem] font-[560] text-ivory transition-colors duration-500 hover:text-gold-lit sm:inline-flex"
            >
              <span className="link-line">Resume</span>
              <Arrow dir="out" className="text-gold" />
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-panel"
              className="flex min-h-11 min-w-11 items-center justify-end gap-3 text-[0.92rem] font-[560] text-ivory lg:hidden"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-px w-full bg-gold-lit transition-transform duration-500 ${
                    open ? "top-1.5 rotate-45" : "top-0.5"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-gold-lit transition-transform duration-500 ${
                    open ? "top-1.5 -rotate-45" : "top-2.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </div>

      <div
        id="nav-panel"
        ref={panelRef}
        inert={!open ? true : undefined}
        className={`fixed inset-0 -z-10 overflow-y-auto overscroll-contain bg-ink px-5 pt-24 pb-8 transition-[opacity,clip-path]
          duration-700 ease-[var(--ease-swing)] sm:px-9 lg:hidden ${
            open
              ? "pointer-events-auto opacity-100 [clip-path:circle(150%_at_100%_0%)]"
              : "pointer-events-none opacity-0 [clip-path:circle(0%_at_100%_0%)]"
          }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[30vw] -bottom-[30vw] aspect-square w-[90vw] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(200,164,92,0.22) 0%, rgba(138,109,51,0.08) 50%, transparent 100%)",
          }}
        />
        <div className="relative flex min-h-full flex-col justify-between gap-10">
          <ul className="flex flex-col">
            {SECTIONS.map((section, i) => (
              <li key={section.id} className="overflow-hidden border-b border-gold/10">
                <button
                  type="button"
                  onClick={() => select(section.id)}
                  aria-current={i === active ? "true" : undefined}
                  className="flex w-full items-baseline justify-between gap-5 py-3 text-left"
                  style={{
                    transitionDelay: open ? `${160 + i * 50}ms` : "0ms",
                    transform: open ? "none" : "translateY(100%)",
                    transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <span
                    className={`wide text-[clamp(1.9rem,9vw,3.4rem)] leading-none font-[800] tracking-[-0.035em] uppercase ${
                      i === active ? "foil" : "text-ivory"
                    }`}
                  >
                    {section.label}
                  </span>
                  <span className="label text-gold">{section.num}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") || link.href.endsWith(".pdf") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="link-line inline-flex min-h-11 items-center text-[0.95rem] text-bone hover:text-gold-lit"
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
