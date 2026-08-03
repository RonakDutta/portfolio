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
/**
 * The opening, as a share of the frame.
 *
 * Wider on a phone. The opening is a fixed percentage of the viewport, so 45%
 * of a 1900px screen is generous and 45% of a 390px one is 175px, which is
 * narrower than the name set at any size worth reading. The piers give up the
 * width because at that size there is no pier detail to see anyway.
 */
const OPENINGS = {
  wide: { l: 440, r: 1160 },
  narrow: { l: 300, r: 1300 },
};

/**
 * Smooth round arch geometry: One continuous semi-circular arc connecting the piers
 * without any pointed apex or merging seams.
 */
function geometry({ l, r }) {
  const radius = (r - l) / 2;
  const springY = 410;
  const arc = `A${radius},${radius} 0 0,1 ${r},${springY}`;

  return {
    wall: `M0,0 H${W} V${H} H0 Z M${l},${H} V${springY} ${arc} V${H} Z`,
    reveal: `M${l},${H} V${springY} ${arc} V${H}`,
  };
}

const PATHS = {
  wide: geometry(OPENINGS.wide),
  narrow: geometry(OPENINGS.narrow),
};

function GateArch({ className = "", narrow = false }) {
  const { wall: WALL, reveal: REVEAL } = PATHS[narrow ? "narrow" : "wide"];
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
        <g
          mask={`url(#m-${uid})`}
          stroke="#000"
          strokeOpacity="0.7"
          strokeWidth="2.5"
        >
          {COURSES.map((f) => (
            <line
              key={f}
              x1="0"
              y1={H * f}
              x2={W}
              y2={H * f}
              vectorEffect="non-scaling-stroke"
            />
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
