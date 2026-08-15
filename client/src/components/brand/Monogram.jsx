import { memo, useId } from "react";

/**
 * The RD mark.
 *
 * Drawn rather than set: an R and a D as two stems with the same bowl curve
 * at two scales, inside a cut lozenge.
 *
 * Everything is laid out against a 56x56 box whose centre is (28, 28), and
 * both the lozenge and the letter group are centred on it:
 *
 *   lozenge   x 2 -> 54,  y 2 -> 54    centre 28, 28
 *   letters   x 14 -> 42, y 17 -> 39   centre 28, 28
 *
 * The previous version had the letter group sitting at x 17 -> 46, which put
 * it 3.5 units right of centre, visible as an off-centre mark in the nav.
 * If you edit the glyphs, keep the group symmetric about x = 28.
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
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="32%" stopColor="#f3e5ab" />
          <stop offset="64%" stopColor="#e5be48" />
          <stop offset="100%" stopColor="#b38628" />
        </linearGradient>
        <linearGradient id={rim} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#f3e5ab" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#b38628" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6f4700" stopOpacity="0.65" />
        </linearGradient>
      </defs>

      {/* Lozenge: a square with two opposing corners cut, centred on 28,28. */}
      <path
        d="M13 2 H54 V43 L43 54 H2 V13 Z"
        stroke={`url(#${rim})`}
        strokeWidth="1.1"
      />

      <g
        stroke={`url(#${ramp})`}
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        {/* R: stem, bowl, leg. */}
        <path d="M14 17 V39" />
        <path d="M14 17 H21 A5 5 0 0 1 21 27 H14" />
        <path d="M20 27 L26 39" />

        {/* D: stem and the same bowl curve, taller. */}
        <path d="M30 17 V39" />
        <path d="M30 17 H33 A9 11 0 0 1 33 39 H30" />
      </g>
    </svg>
  );
}

export default memo(Monogram);
