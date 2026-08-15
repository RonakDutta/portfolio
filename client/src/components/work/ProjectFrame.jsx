import { memo, useCallback, useRef, useState } from "react";

/**
 * The screenshot plate — treated as product photography, not as a card.
 *
 * Space is reserved from a fixed ratio — 2.104:1, matching the source
 * captures, so nothing is cropped on desktop and nothing on the page moves
 * when an image decodes. Phones drop to 4:3, where a 2:1 band would be too
 * short to read as a product shot.
 *
 * Two effects, both cursor-only and both small: the image takes a 1.5% zoom,
 * and a soft champagne highlight follows the pointer across the glass. Touch
 * devices get the plate clean and static.
 */
function ProjectFrame({
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
      <div
        ref={glass}
        onPointerMove={interactive ? track : undefined}
        onPointerEnter={interactive ? () => setLit(true) : undefined}
        onPointerLeave={interactive ? () => setLit(false) : undefined}
        className="edge-gold relative aspect-4/3 w-full overflow-hidden bg-jet sm:aspect-[2.104/1]"
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
              transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]
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
                "radial-gradient(22rem 22rem at var(--mx, 50%) var(--my, 50%), rgba(225,196,135,0.1), transparent 66%)",
            }}
          />
        ) : null}

        {/* Glass: a sheen along the top edge and shadow gathering in the
            corners, so the plate has a surface. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(245,242,234,0.045) 0%, transparent 18%)",
            boxShadow: "inset 0 0 70px 4px rgba(2,2,2,0.26)",
          }}
        />
      </div>

      {/* Cast shadow. Grounds the plate rather than letting it float. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 -bottom-8 -z-10 h-16 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(2,2,2,0.95), transparent 74%)",
        }}
      />
    </figure>
  );
}

/**
 * Shown until a real capture exists. It states what it is instead of faking a
 * product UI — a fabricated screenshot would misrepresent the work.
 */
function Placeholder({ label }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-coal">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(176,141,69,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(176,141,69,0.045) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* Registration marks: the plate reads as prepared for an image rather
          than as one that failed to load. */}
      {[
        "top-4 left-4 border-t border-l",
        "top-4 right-4 border-t border-r",
        "bottom-4 left-4 border-b border-l",
        "bottom-4 right-4 border-b border-r",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`absolute h-6 w-6 border-gold/25 ${pos}`}
        />
      ))}

      <p className="relative eyebrow-sm text-stone">Project Preview</p>
      {label ? (
        <p className="relative max-w-[28ch] px-6 text-center font-display text-[1.1rem] font-light text-mute italic">
          {label}
        </p>
      ) : null}
    </div>
  );
}

export default memo(ProjectFrame);
