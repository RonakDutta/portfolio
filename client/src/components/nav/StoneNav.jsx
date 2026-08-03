import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, subscribe, frame } from "../../lib/store";
import { scrollToSection } from "../../lib/useSmoothScroll";
import { identity } from "../../data/content";

/**
 * The chapter rail: a slab of carved stone across the top of the descent.
 *
 * The active chapter comes from the store's section index, which the scroll
 * engine already maintains, so this subscribes to *discrete* section changes
 * rather than to scroll. It re-renders six times over the whole page instead of
 * on every frame, which is the entire reason that index exists.
 *
 * The slab itself is drawn with layered gradients rather than an image: a lit
 * top edge, a shadowed base, and a masonry joint pattern in a repeating
 * gradient. No network request, no decode, and it tints with the theme.
 *
 * Every control carries min-h-11. A 34px chapter row is comfortable with a
 * mouse and a coin-toss with a thumb, and this is the one piece of chrome that
 * is on screen for the whole descent.
 */

/** Masonry: a lit top edge, a dark base, and vertical joints struck into it. */
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

        {/* Molten underline, struck only under the chapter you are in. */}
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
  // Seeded from the store rather than 0, so a reload part-way down the page
  // does not light the wrong chapter until the first crossing.
  const [active, setActive] = useState(frame.section);
  const [lit, setLit] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => subscribe(setActive), []);

  // The bar is bare stone over the hero and lights up once you are inside.
  useEffect(() => {
    const onScroll = () => setLit(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the panel and hands focus back to the control that opened it.
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
          lit ? "border-ember/25" : "border-white/5"
        }`}
        style={{
          ...STONE,
          backgroundColor: "#120d18",
          boxShadow: lit
            ? "0 10px 30px -18px rgba(0,0,0,0.9), inset 0 -1px 0 rgba(255,77,0,0.18)"
            : "0 8px 24px -20px rgba(0,0,0,0.8)",
        }}
      >
        {/* Heat creeping along the underside of the slab. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-700
            ${lit ? "opacity-100" : "opacity-0"}`}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,77,0,0.65) 30%, rgba(255,192,97,0.8) 50%, rgba(255,77,0,0.65) 70%, transparent)",
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
              className="flex h-6 w-6 shrink-0 rotate-45 items-center justify-center border border-ember/70
                bg-gradient-to-br from-[#241d29] to-[#0d0913] transition-colors duration-300
                group-hover:border-hellfire"
            >
              <span className="flex h-full w-full -rotate-45 items-center justify-center text-[0.62rem] font-black leading-none text-hellfire select-none">
                {identity.initials}
              </span>
            </span>
            <span className="hidden sm:inline">{identity.family}</span>
            <span className="sr-only">Back to the top</span>
          </button>

          {/* Full rail from lg up. Six chapters do not fit honestly below that. */}
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
            {/* Depth read-out: which chamber, of how many. */}
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

        {/* Panel below lg. Height-animated rather than mounted and unmounted so
            it can open smoothly, and marked inert while closed: a collapsed
            panel is still in the tab order otherwise, and tabbing into buttons
            nobody can see is worse than having no animation at all. */}
        <div
          id="chapter-panel"
          inert={!open}
          className={`overflow-hidden border-t transition-[max-height,opacity] duration-400 lg:hidden ${
            open ? "max-h-[26rem] border-iron/60 opacity-100" : "max-h-0 border-transparent opacity-0"
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
