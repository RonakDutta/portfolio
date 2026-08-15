import { memo, useCallback, useRef, useState } from "react";

/**
 * The screenshot, shot like product photography.
 *
 * A black reflective bezel holds the capture; gold sits on the inside edge as
 * a rim light rather than as a border, and a soft aurora pools behind the
 * whole thing so the plate looks lit rather than pasted on.
 *
 * Space is reserved from a fixed ratio — 2.104:1, matching the source
 * captures, so nothing is cropped on desktop and nothing on the page shifts
 * when an image decodes. Phones drop to 4:3, where a 2:1 band is too short to
 * read as a product shot.
 *
 * Two interactions, both cursor-only: the image takes a 1.5% zoom and a
 * champagne highlight tracks the pointer across the glass. Touch gets the
 * capture clean and static. The project UI is never obscured.
 */
function ProjectPlate({
  src,
  alt,
  label,
  priority = false,
  interactive = true,
  className = "",
}) {
  const glass = useRef(null);
  const [broken, setBroken] = useState(false);
  const [lit, setLit] = useState(false);

  const track = useCallback((event) => {
    const node = glass.current;
    if (!node) return;
    const r = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${event.clientX - r.left}px`);
    node.style.setProperty("--my", `${event.clientY - r.top}px`);
  }, []);

  const hasImage = Boolean(src) && !broken;

  return (
    <figure className={`group/plate relative ${className}`}>
      {/* Aurora behind the frame. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[6%] -inset-y-[22%] -z-10 blur-[70px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(212,175,55,0.2) 0%, rgba(140,101,8,0.09) 46%, transparent 76%)",
        }}
      />

      {/* Bezel */}
      <div
        className="relative p-[3px]"
        style={{
          background:
            "linear-gradient(150deg, rgba(255,245,199,0.5) 0%, rgba(140,101,8,0.28) 26%, rgba(10,10,10,1) 54%, rgba(111,71,0,0.3) 82%, rgba(240,213,138,0.35) 100%)",
        }}
      >
        <div
          ref={glass}
          onPointerMove={interactive ? track : undefined}
          onPointerEnter={interactive ? () => setLit(true) : undefined}
          onPointerLeave={interactive ? () => setLit(false) : undefined}
          className="relative aspect-4/3 w-full overflow-hidden bg-carbon sm:aspect-[2.104/1]"
        >
          {hasImage ? (
            <img
              src={src}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "low"}
              decoding="async"
              onError={() => setBroken(true)}
              className={`absolute inset-0 h-full w-full object-cover object-top
                transition-transform duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                ${interactive ? "group-hover/plate:scale-[1.015]" : ""}`}
            />
          ) : (
            <Placeholder label={label} />
          )}

          {interactive ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: lit ? 1 : 0,
                background:
                  "radial-gradient(24rem 24rem at var(--mx, 50%) var(--my, 50%), rgba(255,245,199,0.14), transparent 66%)",
              }}
            />
          ) : null}

          {/* Glass surface: a sheen along the top, shadow gathering at the
              corners. Kept light so it never dirties a bright product UI. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,249,236,0.05) 0%, transparent 16%)",
              boxShadow: "inset 0 0 70px 4px rgba(1,1,1,0.24)",
            }}
          />
        </div>
      </div>

      {/* Reflection under the bezel, and the shadow that grounds it. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 -bottom-10 -z-10 h-20 blur-3xl"
        style={{
          background:
            "radial-gradient(64% 100% at 50% 0%, rgba(1,1,1,0.95) 0%, transparent 74%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[18%] -bottom-px h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,245,199,0.55), transparent)",
        }}
      />
    </figure>
  );
}

/**
 * Shown until a real capture exists. States what it is rather than faking a
 * product UI — a fabricated screenshot would misrepresent the work.
 */
function Placeholder({ label }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-carbon">
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 80% at 50% 30%, rgba(140,101,8,0.14) 0%, transparent 70%)",
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(198,161,91,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(198,161,91,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {[
        "top-4 left-4 border-t border-l",
        "top-4 right-4 border-t border-r",
        "bottom-4 left-4 border-b border-l",
        "bottom-4 right-4 border-b border-r",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`absolute h-6 w-6 border-gold-dark/60 ${pos}`}
        />
      ))}

      <p className="relative eyebrow-sm text-champagne/70">Project Preview</p>
      {label ? (
        <p className="relative max-w-[28ch] px-6 text-center font-display text-[1.15rem] font-light text-mute italic">
          {label}
        </p>
      ) : null}
    </div>
  );
}

export default memo(ProjectPlate);
