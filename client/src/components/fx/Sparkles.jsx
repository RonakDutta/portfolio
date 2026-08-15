import { memo, useId, useMemo } from "react";

/**
 * Ambient sparkle field.
 *
 * Four-point stars scattered over a section, each opening and closing on its
 * own cycle. Pure CSS animation on a handful of tiny SVGs: no canvas, no
 * per-frame JavaScript, so it costs nothing on the main thread and can sit
 * behind content for the whole page.
 *
 * Positions are seeded deterministically from `seed` rather than from
 * `Math.random()` at render, so a re-render never teleports the field.
 */
function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GLINT =
  "M12 0C12 6.6 17.4 12 24 12C17.4 12 12 17.4 12 24C12 17.4 6.6 12 0 12C6.6 12 12 6.6 12 0Z";

function Sparkles({ count = 18, seed = 7, className = "", scale = 1 }) {
  const ramp = `sp-${useId().replace(/:/g, "")}`;

  const stars = useMemo(() => {
    const rand = mulberry(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      size: (5 + rand() * 12) * scale,
      delay: `${rand() * 7}s`,
      dur: `${3.4 + rand() * 4.5}s`,
      peak: 0.35 + rand() * 0.55,
    }));
  }, [count, seed, scale]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <radialGradient id={ramp}>
            <stop offset="0%" stopColor="#fff6de" />
            <stop offset="60%" stopColor="#ecd7a3" />
            <stop offset="100%" stopColor="#c8a45c" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>

      {stars.map((s) => (
        <svg
          key={s.id}
          viewBox="0 0 24 24"
          className="animate-twinkle absolute"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            "--delay": s.delay,
            "--dur": s.dur,
            "--peak": s.peak,
          }}
        >
          {/* Drawn from four concave arms: that reads as a glint, where a
              polygon reads as a sticker. */}
          <path d={GLINT} fill={`url(#${ramp})`} />
        </svg>
      ))}
    </div>
  );
}

export default memo(Sparkles);
