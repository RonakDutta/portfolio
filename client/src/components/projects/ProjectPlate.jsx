import { memo, useCallback, useRef, useState } from "react";

/**
 * The screenshot, shot like product photography.
 *
 * The frame is now a single hairline and a deep shadow rather than the 3px
 * gradient bezel it had before. That bezel put a bright metallic edge around
 * every capture and was the loudest thing in the section.
 *
 * Space is reserved from a fixed ratio (2.104:1, matching the source captures)
 * so nothing shifts when an image decodes. Phones drop to 4:3, where a 2:1
 * band is too short to read as a product shot.
 *
 * Two cursor-only interactions: a 1.5% zoom, and a champagne highlight that
 * tracks the pointer across the glass. Touch gets the capture clean and still.
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
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[4%] -inset-y-[18%] -z-10 blur-[54px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(200,164,92,0.16) 0%, rgba(138,109,51,0.07) 48%, transparent 76%)",
        }}
      />

      <div
        ref={glass}
        onPointerMove={interactive ? track : undefined}
        onPointerEnter={interactive ? () => setLit(true) : undefined}
        onPointerLeave={interactive ? () => setLit(false) : undefined}
        className="relative aspect-4/3 w-full overflow-hidden bg-carbon
          shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)] ring-1 ring-brass/15
          sm:aspect-[2.104/1]"
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
                "radial-gradient(22rem 22rem at var(--mx, 50%) var(--my, 50%), rgba(255,246,222,0.12), transparent 66%)",
            }}
          />
        ) : null}

        {/* A sheen along the top edge and shadow gathering in the corners.
            Kept light so it never dirties a bright product UI. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,249,236,0.06) 0%, transparent 14%)",
            boxShadow: "inset 0 0 70px 4px rgba(1,1,1,0.22)",
          }}
        />
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[16%] -bottom-px h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(236,215,163,0.4), transparent)",
        }}
      />
    </figure>
  );
}

/**
 * Shown until a real capture exists. States what it is rather than faking a
 * product UI, because a fabricated screenshot would misrepresent the work.
 */
function Placeholder({ label }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-carbon">
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 80% at 50% 30%, rgba(138,109,51,0.16) 0%, transparent 70%)",
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,164,92,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(200,164,92,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <p className="relative text-[0.9rem] text-brass/70">Capture pending</p>
      {label ? (
        <p className="script relative max-w-[24ch] px-6 text-center text-[2rem] leading-none text-mute">
          {label}
        </p>
      ) : null}
    </div>
  );
}

export default memo(ProjectPlate);
