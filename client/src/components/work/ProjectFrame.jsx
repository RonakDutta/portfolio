import { memo, useCallback, useRef, useState } from "react";

/**
 * The screenshot frame: a forged slab with a bronze bead around the reveal.
 *
 * The container reserves its space from a fixed 16:10 aspect ratio, so the
 * page never shifts when an image decodes — and never shifts when a
 * placeholder is later swapped for a real screenshot either.
 *
 * One interaction, cursor-only: a soft spotlight tracks the pointer across
 * the glass. No tilt, no parallax, no border animation. Touch devices get a
 * clean static image, which is what they should get.
 */
function ProjectFrame({
  src,
  alt,
  label,
  priority = false,
  interactive = true,
  className = "",
}) {
  const surface = useRef(null);
  const [broken, setBroken] = useState(false);
  const [lit, setLit] = useState(false);

  const track = useCallback((event) => {
    const node = surface.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    node.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);

  const showImage = Boolean(src) && !broken;

  return (
    <figure className={`group/frame relative ${className}`}>
      {/* Outer slab: the metal the reveal is cut into. */}
      <div className="surface-slab edge-bronze relative p-2 sm:p-2.5">
        <div
          ref={surface}
          onPointerMove={interactive ? track : undefined}
          onPointerEnter={interactive ? () => setLit(true) : undefined}
          onPointerLeave={interactive ? () => setLit(false) : undefined}
          className="relative aspect-16/10 w-full overflow-hidden bg-[#0a0810]"
        >
          {showImage ? (
            <img
              src={src}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "low"}
              decoding="async"
              onError={() => setBroken(true)}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <Placeholder label={label} />
          )}

          {/* Cursor spotlight. Painted above the image, below nothing else. */}
          {interactive ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: lit ? 1 : 0,
                background:
                  "radial-gradient(20rem 20rem at var(--mx, 50%) var(--my, 50%), rgba(255,203,150,0.13), transparent 68%)",
              }}
            />
          ) : null}

          {/* Glass: a faint sheen down the top edge, and shadow in the corners. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(228,220,207,0.05) 0%, transparent 22%)",
              boxShadow: "inset 0 0 60px 8px rgba(5,4,9,0.55)",
            }}
          />
        </div>
      </div>

      {/* Torchlight pooling under the slab. Grounds it instead of floating it. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 -bottom-6 -z-10 h-12 blur-2xl"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(185,138,82,0.2), transparent 72%)",
        }}
      />
    </figure>
  );
}

/**
 * Shown until a real screenshot exists. Deliberately says what it is rather
 * than faking a UI — a fabricated screenshot would misrepresent the work.
 */
function Placeholder({ label }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0c0a11]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(185,138,82,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(185,138,82,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* Registration marks at the corners: the frame reads as prepared for a
          plate, rather than as something that failed to load. */}
      {[
        "top-3 left-3 border-t border-l",
        "top-3 right-3 border-t border-r",
        "bottom-3 left-3 border-b border-l",
        "bottom-3 right-3 border-b border-r",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`absolute h-5 w-5 border-bronze/30 ${pos}`}
        />
      ))}

      <span
        aria-hidden="true"
        className="relative h-8 w-8 rotate-45 border border-bronze/35"
      />
      <p className="relative font-mono text-[0.62rem] tracking-[0.34em] text-parchment/75 uppercase">
        Project preview
      </p>
      {label ? (
        <p className="relative max-w-[26ch] px-6 text-center font-mono text-[0.6rem] tracking-[0.12em] text-smoke">
          {label}
        </p>
      ) : null}
    </div>
  );
}

export default memo(ProjectFrame);
