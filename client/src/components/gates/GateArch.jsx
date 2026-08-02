import { memo, useId } from "react";

/**
 * The gate itself: a stone wall with a pointed arch cut out of it.
 *
 * Drawn as a single evenodd path so the opening is a real hole. The lava
 * canvas shows through it rather than being drawn on top of. That's what turns
 * the background from "a nice shader" into something you are standing before.
 *
 * Stretched to the frame with preserveAspectRatio="none", deliberately. Under
 * "slice" the arch keeps its proportions and the frame crops it, which means
 * the opening's width at a given height depends on the viewport's aspect ratio:
 * on a wide, short screen the lockup ends up under the narrow point instead of
 * between the piers. Stretching gives up exact arch geometry to buy the
 * guarantee that matters more, which is that the opening is always the same
 * share of the frame and the name always sits inside it. Strokes carry
 * vector-effect so the non-uniform scale cannot thin them unevenly.
 *
 * No filters: gradients and strokes only, so it composites on the GPU and costs
 * nothing per frame. It never animates on its own; the parent parallaxes it.
 */

/** Course lines for the masonry, as fractions of the viewBox height. */
const COURSES = [0.13, 0.24, 0.35, 0.46, 0.57, 0.68, 0.79, 0.9];

/** Where the vertical joints fall on each course, alternating like real bond. */
const JOINTS = [
  [0.05, 0.14, 0.23],
  [0.095, 0.185],
  [0.05, 0.14, 0.23],
  [0.095, 0.185],
  [0.05, 0.14, 0.23],
  [0.095, 0.185],
  [0.05, 0.14, 0.23],
  [0.095, 0.185],
];

const W = 1600;
const H = 900;

// The opening, as a share of the frame. 45% wide leaves the lockup room to sit
// between the piers at every viewport this has to hold up on.
const OPEN_L = 440;
const OPEN_R = 1160;
const SPRING = 340; // where the arch leaves the piers
const APEX_Y = 72; // high enough to read as a point, low enough to stay on screen

const APEX_X = (OPEN_L + OPEN_R) / 2;
const HALF = (OPEN_R - OPEN_L) / 2;
const RISE = SPRING - APEX_Y;

/**
 * Two-centred arch. Both centres sit on the springline, offset D either side of
 * the axis: the construction that lets rise and span be chosen independently
 * and still meet at a true point. D falls out of requiring one radius to reach
 * both its own springer and the apex.
 */
const D = (RISE * RISE - HALF * HALF) / (2 * HALF);
const R = HALF + D;

const ARCS = [
  `A${R},${R} 0 0,1 ${APEX_X},${APEX_Y}`,
  `A${R},${R} 0 0,1 ${OPEN_R},${SPRING}`,
].join(" ");

/** Wall with the arch removed. */
const WALL = `M0,0 H${W} V${H} H0 Z M${OPEN_L},${H} V${SPRING} ${ARCS} V${H} Z`;

/** The inner edge of the opening, traced for the glow rim. */
const REVEAL = `M${OPEN_L},${H} V${SPRING} ${ARCS} V${H}`;

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
      preserveAspectRatio="none"
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
            <line key={f} x1="0" y1={H * f} x2={W} y2={H * f} vectorEffect="non-scaling-stroke" />
          ))}
          {COURSES.map((f, row) =>
            JOINTS[row].map((j) => (
              <g key={`${f}-${j}`}>
                {/* Mirrored across the centre line so both piers stay bonded. */}
                <line
                  x1={W * j}
                  y1={H * f}
                  x2={W * j}
                  y2={H * (COURSES[row + 1] ?? 1)}
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1={W * (1 - j)}
                  y1={H * f}
                  x2={W * (1 - j)}
                  y2={H * (COURSES[row + 1] ?? 1)}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            )),
          )}
        </g>
      </g>

      {/* Soot gathering along the top of the wall. */}
      <rect x="0" y="0" width={W} height={H * 0.34} fill={`url(#${grime})`} />

      {/* Heat rim on the cut edge, the only warm line in the whole gate. */}
      <path
        d={REVEAL}
        fill="none"
        stroke={`url(#${rim})`}
        strokeWidth="6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={REVEAL}
        fill="none"
        stroke="#ffb347"
        strokeOpacity="0.22"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default memo(GateArch);
