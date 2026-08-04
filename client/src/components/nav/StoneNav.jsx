import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, subscribe, frame } from "../../lib/store";
import { scrollToSection } from "../../lib/useSmoothScroll";
import Sigil from "../ui/Sigil";
import { identity } from "../../data/content";

const STONE = {
  backgroundImage: [
    "linear-gradient(to bottom, rgba(255,235,205,0.07) 0 1px, transparent 1px)",
    "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.2))",
    "repeating-linear-gradient(90deg, rgba(0,0,0,0.42) 0 1px, transparent 1px 92px)",
    "linear-gradient(to bottom, #191320 0%, #120d18 55%, #1c1218 100%)",
  ].join(","),
};

function ChapterButton({ section, active, onSelect, compact = false }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(section.id)}
        aria-current={active ? "true" : undefined}
        className={`group relative flex min-h-11 items-center gap-2 px-3 py-2 font-display
          text-[0.6rem] font-bold tracking-[0.24em] uppercase transition-colors duration-300
          ${compact ? "w-full justify-start text-[0.72rem]" : ""}
          ${active ? "text-hellfire" : "text-parchment/85 hover:text-bone"}`}
      >
        <span
          aria-hidden="true"
          className={`text-[0.55rem] tracking-normal transition-colors duration-300
            ${active ? "text-ember" : "text-smoke group-hover:text-ember/70"}`}
        >
          {section.roman}
        </span>
        <span>{section.label}</span>

        <span
          aria-hidden="true"
          className={`absolute inset-x-2 -bottom-px h-px origin-left bg-gradient-to-r
            from-ember to-transparent transition-transform duration-500
            ${active ? "scale-x-100" : "scale-x-0"}`}
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
        className={`relative border-b transition-all duration-500 ${
          lit ? "border-ember/25" : "border-white/5"
        } ${open ? "backdrop-blur-md bg-[#120d18]/90" : ""}`}
        style={{
          ...STONE,
          backgroundColor: open ? "rgba(18, 13, 24, 0.90)" : "#120d18",
          boxShadow: lit
            ? "0 10px 30px -18px rgba(0,0,0,0.9), inset 0 -1px 0 rgba(255,77,0,0.18)"
            : "0 8px 24px -20px rgba(0,0,0,0.8)",
        }}
      >
        <span
          ref={gauge}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left"
          style={{
            transform: "scaleX(0)",
            background:
              "linear-gradient(90deg, rgba(255,77,0,0.5), rgba(255,138,31,0.85) 60%, rgba(255,240,214,0.95))",
            boxShadow: "0 0 10px rgba(255,77,0,0.55)",
          }}
        />

        <nav
          aria-label="Chapters"
          className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6"
        >
          <button
            type="button"
            onClick={() => select(SECTIONS[0].id)}
            className="group -ml-2 flex min-h-11 items-center gap-2.5 px-2.5 font-display text-[0.7rem] font-black tracking-[0.22em] text-bone uppercase"
          >
            <span
              aria-hidden="true"
              className="relative flex h-7 w-7 shrink-0 items-center justify-center"
            >
              <Sigil className="h-full w-full drop-shadow-[0_0_6px_rgba(255,77,0,0.35)] transition-[filter] duration-500 group-hover:drop-shadow-[0_0_11px_rgba(255,138,31,0.75)]" />
            </span>
            <span className="hidden sm:inline">{identity.family}</span>
            <span className="sr-only">Back to the top</span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {SECTIONS.map((section, i) => (
              <ChapterButton
                key={section.id}
                section={section}
                active={i === active}
                onSelect={select}
              />
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="hidden font-display text-[0.58rem] tracking-[0.3em] text-smoke uppercase sm:inline"
            >
              {SECTIONS[active]?.roman ?? "I"}
              <span className="mx-1 text-iron">/</span>
              {SECTIONS.length}
            </span>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="chapter-panel"
              className="flex min-h-11 items-center gap-2 border border-iron/80 px-3.5 py-2 font-display
                text-[0.6rem] font-bold tracking-[0.24em] text-parchment uppercase
                transition-colors duration-300 hover:border-ember/60 hover:text-hellfire lg:hidden"
            >
              {open ? "Close" : "Chapters"}
              <span aria-hidden="true" className="flex flex-col gap-[3px]">
                <span
                  className={`block h-px w-4 bg-current transition-transform duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`}
                />
                <span className={`block h-px w-4 bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
                <span
                  className={`block h-px w-4 bg-current transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </nav>

        <div
          id="chapter-panel"
          inert={!open}
          className={`overflow-hidden border-t transition-[max-height,opacity] duration-400 lg:hidden backdrop-blur-md ${
            open ? "max-h-[26rem] border-iron/60 opacity-100 bg-[#120d18]/90" : "max-h-0 border-transparent opacity-0"
          }`}
        >
          <ul className="mx-auto flex w-full max-w-6xl flex-col px-3 py-2 sm:px-4">
            {SECTIONS.map((section, i) => (
              <ChapterButton
                key={section.id}
                section={section}
                active={i === active}
                onSelect={select}
                compact
              />
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default memo(StoneNav);
