import { memo, useId } from "react";

/**
 * The RD mark.
 *
 * Drawn rather than set: an R and a D sharing one stem inside a thin gold
 * lozenge, so it reads as a maker's mark on metal rather than as two letters
 * in a box. The bowl of the R and the bowl of the D are the same curve at
 * different scales, which is what keeps it looking designed instead of typed.
 */
function Monogram({ className = "", title }) {
  const uid = useId().replace(/:/g, "");
  const ramp = `mg-${uid}`;
  const rim = `mr-${uid}`;

  return (
    <svg
      viewBox="0 0 56 56"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
      fill="none"
    >
      <defs>
        <linearGradient id={ramp} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff5c7" />
          <stop offset="34%" stopColor="#f0d58a" />
          <stop offset="64%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8c6508" />
        </linearGradient>
        <linearGradient id={rim} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#f0d58a" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#8c6508" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#6f4700" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Lozenge: a rectangle with two opposing corners cut, which reads as a
          stamped bezel at 28px as well as at 200px. */}
      <path
        d="M12 1.5 H54.5 V44 L44 54.5 H1.5 V12 Z"
        stroke={`url(#${rim})`}
        strokeWidth="1.1"
      />

      <g stroke={`url(#${ramp})`} strokeWidth="2.6" strokeLinecap="square">
        {/* Shared stem. */}
        <path d="M17 15.5 V40.5" />
        {/* R: bowl, then the leg kicking out from the waist. */}
        <path d="M17 15.5 H24.5 A6.2 6.2 0 0 1 24.5 28 H17" />
        <path d="M23.5 28 L29.5 40.5" />
        {/* D: the same bowl, taller, hung off the second stem. */}
        <path d="M33.5 15.5 V40.5" />
        <path d="M33.5 15.5 H37.5 A12.5 12.5 0 0 1 37.5 40.5 H33.5" />
      </g>
    </svg>
  );
}

export default memo(Monogram);
