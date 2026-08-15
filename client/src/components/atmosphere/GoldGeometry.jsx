import { memo, useId } from "react";

/**
 * The house geometry: thin gold arcs and orbital curves, drawn at three
 * opacities so some are almost subliminal and one or two clearly catch the
 * light. Placed per-section rather than globally, because the point of it is
 * to frame a composition — a background that had it everywhere would just be
 * a texture.
 *
 * `variant` picks the arrangement; all of them share the same stroke language
 * so the site reads as one identity.
 */
function GoldGeometry({ variant = "orbit", className = "" }) {
  const uid = useId().replace(/:/g, "");
  const stroke = `gg-${uid}`;
  const faint = `ggf-${uid}`;

  return (
    <svg
      aria-hidden="true"
      viewBox="-200 -200 400 400"
      fill="none"
      className={`pointer-events-none absolute ${className}`}
    >
      <defs>
        <linearGradient id={stroke} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff6de" stopOpacity="0.85" />
          <stop offset="34%" stopColor="#c8a45c" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#8a6d33" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#5e4a20" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={faint} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#c8a45c" stopOpacity="0" />
          <stop offset="50%" stopColor="#c8a45c" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#c8a45c" stopOpacity="0" />
        </linearGradient>
      </defs>

      {variant === "orbit" ? (
        <>
          {/* Three open arcs on different rotations: an orbital diagram, not
              a set of concentric rings. */}
          {[188, 152, 116].map((r, i) => {
            const c = 2 * Math.PI * r;
            return (
              <circle
                key={r}
                r={r}
                stroke={i === 0 ? `url(#${stroke})` : `url(#${faint})`}
                strokeWidth={i === 0 ? 1.2 : 0.8}
                strokeDasharray={`${c * (0.36 + i * 0.14)} ${c}`}
                transform={`rotate(${-52 + i * 71})`}
              />
            );
          })}
          <circle r="196" stroke={`url(#${faint})`} strokeWidth="0.6" />
          <line
            x1="-200"
            y1="0"
            x2="200"
            y2="0"
            stroke={`url(#${faint})`}
            strokeWidth="0.8"
          />
        </>
      ) : null}

      {variant === "frame" ? (
        <>
          {/* An architectural corner bracket plus one long arc sweeping out
              of it. Used where a composition needs anchoring, not encircling. */}
          <path
            d="M-190,-140 L-190,-190 L-120,-190"
            stroke={`url(#${stroke})`}
            strokeWidth="1.2"
          />
          <path
            d="M190,140 L190,190 L120,190"
            stroke={`url(#${stroke})`}
            strokeWidth="1.2"
          />
          <path
            d="M-190,120 C-60,190 90,150 190,-40"
            stroke={`url(#${faint})`}
            strokeWidth="0.9"
          />
          <circle
            r="150"
            stroke={`url(#${faint})`}
            strokeWidth="0.7"
            strokeDasharray="180 760"
            transform="rotate(28)"
          />
        </>
      ) : null}

      {variant === "beam" ? (
        <>
          {/* Vertical light structure: thin beams with one bright leader. */}
          {[-150, -80, 0, 80, 150].map((x, i) => (
            <line
              key={x}
              x1={x}
              y1="-200"
              x2={x}
              y2="200"
              stroke={i === 2 ? `url(#${stroke})` : `url(#${faint})`}
              strokeWidth={i === 2 ? 1 : 0.6}
            />
          ))}
          <circle
            r="120"
            stroke={`url(#${stroke})`}
            strokeWidth="1"
            strokeDasharray="300 460"
            transform="rotate(-30)"
          />
        </>
      ) : null}
    </svg>
  );
}

export default memo(GoldGeometry);
