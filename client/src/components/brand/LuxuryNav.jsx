import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, subscribe, frame } from "../../lib/store";
import { scrollToSection } from "../../lib/useSmoothScroll";
import Monogram from "./Monogram";
import { identity } from "../../data/content";

const LINKS = SECTIONS.slice(1);

function NavLink({ section, active, onSelect, compact = false }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(section.id)}
        aria-current={active ? "true" : undefined}
        className={`group relative flex min-h-11 items-center eyebrow-sm transition-all
          duration-300 ${compact ? "w-full justify-start gap-5 py-2 text-[0.78rem]" : "px-4"}
          ${active ? "text-ivory font-semibold" : "text-sand/80 hover:text-ivory"}`}
      >
        {compact ? (
          <span
            aria-hidden="true"
            className={`text-[0.62rem] font-mono ${active ? "text-gold-metal" : "text-mute"}`}
          >
            {section.num}
          </span>
        ) : null}

        <span>{section.label}</span>

        {/* Active indicator: a lit 24k gold filament */}
        <span
          aria-hidden="true"
          className={`absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${
              compact
                ? "top-1/2 -left-4 h-1.5 w-1.5 -translate-y-1/2 rotate-45"
                : "inset-x-3 -bottom-1 h-0.5 origin-center"
            } ${active ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
          style={{
            background:
              compact
                ? "#e5be48"
                : "linear-gradient(90deg, transparent, #ffd966 50%, transparent)",
            boxShadow: active ? "0 0 10px rgba(229,190,72,0.8)" : undefined,
          }}
        />
      </button>
    </li>
  );
}

function LuxuryNav() {
  const [active, setActive] = useState(frame.section);
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => subscribe(setActive), []);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const select = useCallback((id) => {
    setOpen(false);
    scrollToSection(id);
  }, []);

  const solid = lifted || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`relative transition-all duration-700 ${solid ? "glass-black" : "bg-transparent"}`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex w-full max-w-[108rem] items-center justify-between gap-6 px-5 py-4 sm:px-10"
        >
          <button
            type="button"
            onClick={() => select(SECTIONS[0].id)}
            className="group -ml-1 flex min-h-11 items-center px-1"
          >
            <Monogram className="h-9 w-9 transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.7)] group-hover:scale-105 sm:h-10 sm:w-10" />
            <span className="sr-only">{identity.name} — back to the top</span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((section, i) => (
              <NavLink
                key={section.id}
                section={section}
                active={i + 1 === active}
                onSelect={select}
              />
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <a
              href={identity.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-11 items-center rounded-lg border border-gold-dark/60 bg-coal/50 px-5 eyebrow-sm
                text-champagne transition-all duration-300
                hover:border-gold-metal hover:bg-gold-metal hover:text-void hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] sm:inline-flex"
            >
              Résumé ↗
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
                  className={`block h-px w-full bg-gold-metal transition-transform duration-500 ${open ? "translate-y-[3px] rotate-45" : ""}`}
                />
                <span
                  className={`block h-px w-full bg-gold-metal transition-transform duration-500 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </nav>

        <span
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-px transition-opacity duration-700 ${solid ? "opacity-100" : "opacity-0"}`}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.6) 25%, rgba(255,248,220,0.5) 50%, rgba(212,175,55,0.6) 75%, transparent)",
          }}
        />

        <div
          id="nav-panel"
          inert={!open}
          className={`overflow-hidden transition-[max-height,opacity] duration-500 lg:hidden ${
            open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="mx-auto flex w-full max-w-[108rem] flex-col gap-1 px-10 pt-2 pb-8 sm:px-14">
            {LINKS.map((section, i) => (
              <NavLink
                key={section.id}
                section={section}
                active={i + 1 === active}
                onSelect={select}
                compact
              />
            ))}
            <li className="mt-4 border-t border-gold-dark/20 pt-4">
              <a
                href={identity.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-5 eyebrow-sm text-champagne
                  transition-colors duration-500 hover:text-gold-white"
              >
                <span aria-hidden="true" className="text-[0.6rem] font-mono text-mute">
                  06
                </span>
                Résumé ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default memo(LuxuryNav);
