import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, subscribe, frame } from "../../lib/store";
import { scrollToSection } from "../../lib/useSmoothScroll";
import { identity } from "../../data/content";

const LINKS = SECTIONS.slice(1);

function NavLink({ section, active, onSelect, compact = false }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(section.id)}
        aria-current={active ? "true" : undefined}
        className={`group relative flex min-h-11 items-center eyebrow-sm transition-colors
          duration-500 ${compact ? "w-full justify-start gap-4 py-1 text-[0.72rem]" : "px-4"}
          ${active ? "text-ivory" : "text-stone hover:text-ivory"}`}
      >
        {compact ? (
          <span
            aria-hidden="true"
            className={`text-[0.6rem] ${active ? "text-gold" : "text-mute"}`}
          >
            {section.num}
          </span>
        ) : null}

        <span>{section.label}</span>

        {/* The gold indicator: a hairline that draws out from the centre. */}
        <span
          aria-hidden="true"
          className={`absolute bg-gold transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${
              compact
                ? "top-1/2 -left-4 h-px w-2.5 origin-left"
                : "inset-x-4 -bottom-1.5 h-px origin-center"
            } ${active ? "scale-100" : "scale-0"}`}
        />
      </button>
    </li>
  );
}

function Nav() {
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

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`relative transition-[background-color,backdrop-filter] duration-700 ${
          lifted || open ? "bg-ink/85 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex w-full max-w-[104rem] items-center justify-between gap-6 px-6 py-5 sm:px-10"
        >
          <button
            type="button"
            onClick={() => select(SECTIONS[0].id)}
            className="group -ml-1 flex min-h-11 items-center px-1 font-display text-[0.95rem]
              font-light tracking-[0.34em] text-ivory uppercase sm:text-[1.05rem]"
          >
            <span aria-hidden="true">{identity.name}</span>
            <span className="sr-only">Back to the top</span>
          </button>

          <ul className="hidden items-center lg:flex">
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
              className="link-rule hidden min-h-11 items-center eyebrow-sm text-pearl
                transition-colors duration-500 hover:text-ivory sm:inline-flex"
            >
              Résumé
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-panel"
              className="flex min-h-11 min-w-11 items-center justify-end gap-3 eyebrow-sm
                text-pearl transition-colors duration-500 hover:text-ivory lg:hidden"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
                <span
                  className={`block h-px w-full bg-current transition-transform duration-500 ${open ? "translate-y-[3px] rotate-45" : ""}`}
                />
                <span
                  className={`block h-px w-full bg-current transition-transform duration-500 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </nav>

        <span
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-px bg-line transition-opacity duration-700 ${
            lifted || open ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          id="nav-panel"
          inert={!open}
          className={`overflow-hidden transition-[max-height,opacity] duration-500 lg:hidden ${
            open ? "max-h-[30rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="mx-auto flex w-full max-w-[104rem] flex-col gap-1 px-10 pt-2 pb-8 sm:px-14">
            {LINKS.map((section, i) => (
              <NavLink
                key={section.id}
                section={section}
                active={i + 1 === active}
                onSelect={select}
                compact
              />
            ))}
            <li className="mt-4 border-t border-line pt-4">
              <a
                href={identity.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-4 eyebrow-sm text-stone
                  transition-colors duration-500 hover:text-ivory"
              >
                <span aria-hidden="true" className="text-[0.6rem] text-mute">
                  —
                </span>
                Résumé
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default memo(Nav);
