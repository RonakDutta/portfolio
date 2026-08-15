import { memo } from "react";

/**
 * The signature geometry: a set of concentric hairline arcs in champagne,
 * fading as they travel. Used twice on the page — behind the hero portrait
 * and behind the closing section — and nowhere else.
 *
 * Drawn as strokes rather than filled shapes so it reads as drafting on the
 * black, which is the whole idea: architecture, not ornament.
 */
function GoldArc({ className = "", rings = 3, spin = false }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="-200 -200 400 400"
      className={`pointer-events-none absolute ${className}`}
      fill="none"
    >
      <defs>
        <linearGradient id="ga-fade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e1c487" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#b08d45" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#6f542a" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className={spin ? "animate-breathe" : undefined}>
        {Array.from({ length: rings }, (_, i) => {
          const r = 188 - i * 34;
          // Each ring is an open arc, rotated so the gaps never line up.
          const dash = 2 * Math.PI * r;
          return (
            <circle
              key={r}
              r={r}
              stroke="url(#ga-fade)"
              strokeWidth="1"
              strokeDasharray={`${dash * (0.42 + i * 0.12)} ${dash}`}
              transform={`rotate(${-40 + i * 62})`}
            />
          );
        })}
      </g>

      <line
        x1="-200"
        y1="0"
        x2="200"
        y2="0"
        stroke="url(#ga-fade)"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}

export default memo(GoldArc);
