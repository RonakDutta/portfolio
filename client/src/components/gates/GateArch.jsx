import { memo, useId } from "react";

/**
 * The gate itself: a stone wall with a pointed arch cut out of it.
 *
 * Drawn as a single evenodd path so the opening is a real hole. The lava
 * canvas shows through it rather than being drawn on top of. That's what turns
 * the background from "a nice shader" into something you are standing before.
 *
 * Pure SVG, no filters: gradients and strokes only, so it composites on the GPU
 * and costs nothing per frame. It never animates on its own; the parent
 * parallaxes it with a transform.
 */

/** Course lines for the masonry, as fractions of the viewBox height. */
const COURSES = [0.13, 0.24, 0.35, 0.46, 0.57, 0.68, 0.79, 0.9];

/** Where the vertical joints fall on each course, alternating like real bond. */
const JOINTS = [
  [0.06, 0.16, 0.26],
  [0.11, 0.21],
  [0.06, 0.16, 0.26],
  [0.11, 0.21],
  [0.06, 0.16, 0.26],
  [0.11, 0.21],
  [0.06, 0.16, 0.26],
  [0.11, 0.21],
];

const W = 1200;
const H = 900;

// Springline where the arch leaves the piers, and the opening's half-width.
const OPEN_L = 340;
const OPEN_R = 860;
const SPRING = 520;
const APEX_Y = 70;
const APEX_X = (OPEN_L + OPEN_R) / 2;
const R = OPEN_R - OPEN_L; // equilateral arch: radius equals the span

/**
 * Wall with the arch removed. Two circular arcs struck from the opposite
 * springer give a true equilateral (gothic) point rather than a round Roman one.
 */
const WALL = [
  `M0,0 H${W} V${H} H0 Z`,
  `M${OPEN_L},${H}`,
  `V${SPRING}`,
  `A${R},${R} 0 0,1 ${APEX_X},${APEX_Y}`,
  `A${R},${R} 0 0,1 ${OPEN_R},${SPRING}`,
  `V${H}`,
  "Z",
].join(" ");

/** The inner edge of the opening, traced for the glow rim. */
const REVEAL = [
  `M${OPEN_L},${H}`,
  `V${SPRING}`,
  `A${R},${R} 0 0,1 ${APEX_X},${APEX_Y}`,
  `A${R},${R} 0 0,1 ${OPEN_R},${SPRING}`,
  `V${H}`,
].join(" ");

function GateArch({ className = "" }) {
  // Scoped ids so a second instance can never steal this one's gradients.
  const uid = useId().replace(/:/g, "");
  const stone = `stone-${uid}`;
  const rim = `rim-${uid}`;
  const grime = `grime-${uid}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Stone is lit from below by the lava, so it warms toward the base. */}
        <linearGradient id={stone} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#08060b" />
          <stop offset="55%" stopColor="#0f0b12" />
          <stop offset="100%" stopColor="#241511" />
        </linearGradient>

        {/* Heat bleeding onto the reveal of the opening. */}
        <linearGradient id={rim} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff7a18" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#ff4d00" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ff4d00" stopOpacity="0.05" />
        </linearGradient>

        <linearGradient id={grime} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* The wall. evenodd punches the arch straight through it. */}
      <path d={WALL} fill={`url(#${stone})`} fillRule="evenodd" />

      {/* Masonry courses, masked to the wall so they never cross the opening. */}
      <g opacity="0.55">
        <mask id={`m-${uid}`}>
          <path d={WALL} fill="#fff" fillRule="evenodd" />
        </mask>
        <g mask={`url(#m-${uid})`} stroke="#000" strokeOpacity="0.7" strokeWidth="2.5">
          {COURSES.map((f) => (
            <line key={f} x1="0" y1={H * f} x2={W} y2={H * f} />
          ))}
          {COURSES.map((f, row) =>
            JOINTS[row].map((j) => (
              <g key={`${f}-${j}`}>
                {/* Mirrored across the centre line so both piers stay bonded. */}
                <line x1={W * j} y1={H * f} x2={W * j} y2={H * (COURSES[row + 1] ?? 1)} />
                <line
                  x1={W * (1 - j)}
                  y1={H * f}
                  x2={W * (1 - j)}
                  y2={H * (COURSES[row + 1] ?? 1)}
                />
              </g>
            )),
          )}
        </g>
      </g>

      {/* Soot gathering along the top of the wall. */}
      <rect x="0" y="0" width={W} height={H * 0.34} fill={`url(#${grime})`} />

      {/* Heat rim on the cut edge, the only warm line in the whole gate. */}
      <path d={REVEAL} fill="none" stroke={`url(#${rim})`} strokeWidth="6" strokeLinecap="round" />
      <path d={REVEAL} fill="none" stroke="#ffb347" strokeOpacity="0.22" strokeWidth="1.5" />
    </svg>
  );
}

export default memo(GateArch);
