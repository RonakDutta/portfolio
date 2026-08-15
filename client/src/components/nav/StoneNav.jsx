import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, subscribe, frame } from "../../lib/store";
import { scrollToSection } from "../../lib/useSmoothScroll";
import Sigil from "../ui/Sigil";
import { identity } from "../../data/content";

/** A dressed stone lintel: courses, joints, and a shadow along the underside. */
const STONE = {
  backgroundImage: [
    "linear-gradient(to bottom, rgba(228,220,207,0.05) 0 1px, transparent 1px)",
    "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.18))",
    "repeating-linear-gradient(90deg, rgba(0,0,0,0.38) 0 1px, transparent 1px 96px)",
    "linear-gradient(to bottom, #16131c 0%, #100d15 55%, #14101a 100%)",
  ].join(","),
};

function ChapterLink({ section, active, onSelect, compact = false }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(section.id)}
        aria-current={active ? "true" : undefined}
        className={`group relative flex min-h-11 items-center px-3 py-2 font-mono
          text-[0.68rem] tracking-[0.18em] transition-colors duration-300
          ${compact ? "w-full justify-start gap-3 text-[0.8rem]" : ""}
          ${active ? "text-bone" : "text-parchment/70 hover:text-bone"}`}
      >
        {compact ? (
          <span
            aria-hidden="true"
            className={active ? "text-bronze" : "text-slate"}
          >
            {section.num}
          </span>
        ) : null}

        <span>{section.label}</span>

        <span
          aria-hidden="true"
          className={`absolute inset-x-3 -bottom-px h-px origin-left bg-bronze
            transition-transform duration-500 ${active ? "scale-x-100" : "scale-x-0"}`}
        />
      </button>
    </li>
  );
}

function StoneNav() {
  const [active, setActive] = useState(frame.section);
  const [lit, setLit] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const gauge = useRef(null);

  useEffect(() => subscribe(setActive), []);

  useEffect(() => {
    const onScroll = () => {
      setLit(window.scrollY > window.innerHeight * 0.5);

      const doc = document.documentElement;
      const travel = doc.scrollHeight - window.innerHeight;
      const depth = travel > 0 ? Math.min(1, window.scrollY / travel) : 0;
      if (gauge.current) gauge.current.style.transform = `scaleX(${depth})`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
        className={`relative border-b transition-colors duration-500 ${
          lit ? "border-bronze/22" : "border-white/5"
        } ${open ? "bg-[#100d15]/95 backdrop-blur-md" : ""}`}
        style={{
          ...STONE,
          backgroundColor: open ? "rgba(16, 13, 21, 0.95)" : "#100d15",
          boxShadow: lit
            ? "0 10px 30px -18px rgba(0,0,0,0.9), inset 0 -1px 0 rgba(185,138,82,0.16)"
            : "0 8px 24px -20px rgba(0,0,0,0.8)",
        }}
      >
        {/* Reading progress, drawn as a bronze inlay along the bottom edge. */}
        <span
          ref={gauge}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left"
          style={{
            transform: "scaleX(0)",
            background:
              "linear-gradient(90deg, rgba(109,82,48,0.7), rgba(185,138,82,0.9) 60%, rgba(220,174,116,1))",
          }}
        />

        <nav
          aria-label="Sections"
          className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6"
        >
          <button
            type="button"
            onClick={() => select(SECTIONS[0].id)}
            className="group -ml-2 flex min-h-11 items-center gap-2.5 px-2.5 font-display
              text-[0.78rem] font-bold tracking-[0.2em] text-bone uppercase"
          >
            <span
              aria-hidden="true"
              className="relative flex h-7 w-7 shrink-0 items-center justify-center"
            >
              <Sigil className="h-full w-full transition-[filter] duration-500 group-hover:drop-shadow-[0_0_8px_rgba(220,174,116,0.5)]" />
            </span>
            <span className="hidden sm:inline">{identity.family}</span>
            <span className="sr-only">Back to the top</span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {SECTIONS.map((section, i) => (
              <ChapterLink
                key={section.id}
                section={section}
                active={i === active}
                onSelect={select}
              />
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {/* Résumé stays reachable from every scroll position. */}
            <a
              href={identity.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-11 items-center border border-iron px-4 font-mono
                text-[0.66rem] tracking-[0.18em] text-parchment uppercase
                transition-colors duration-300 hover:border-bronze/50 hover:text-bone sm:inline-flex"
            >
              Résumé
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="section-panel"
              className="flex min-h-11 items-center gap-2.5 border border-iron px-3.5 py-2
                font-mono text-[0.66rem] tracking-[0.18em] text-parchment uppercase
                transition-colors duration-300 hover:border-bronze/50 hover:text-bone lg:hidden"
            >
              {open ? "Close" : "Menu"}
              <span aria-hidden="true" className="flex flex-col gap-[3px]">
                <span
                  className={`block h-px w-4 bg-current transition-transform duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`}
                />
                <span
                  className={`block h-px w-4 bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-px w-4 bg-current transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </nav>

        <div
          id="section-panel"
          inert={!open}
          className={`overflow-hidden border-t backdrop-blur-md transition-[max-height,opacity] duration-400 lg:hidden ${
            open
              ? "max-h-[30rem] border-iron opacity-100"
              : "max-h-0 border-transparent opacity-0"
          }`}
        >
          <ul className="mx-auto flex w-full max-w-6xl flex-col px-3 py-2 sm:px-4">
            {SECTIONS.map((section, i) => (
              <ChapterLink
                key={section.id}
                section={section}
                active={i === active}
                onSelect={select}
                compact
              />
            ))}
            <li className="mt-2 border-t border-iron/70 pt-2">
              <a
                href={identity.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3 px-3 font-mono text-[0.8rem]
                  tracking-[0.18em] text-parchment/70 transition-colors hover:text-bone"
              >
                <span aria-hidden="true" className="text-slate">
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

export default memo(StoneNav);
