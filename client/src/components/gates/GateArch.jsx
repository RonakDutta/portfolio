import { memo, useId } from "react";

const COURSES = [0.13, 0.24, 0.35, 0.46, 0.57, 0.68, 0.79, 0.9];

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

const OPENINGS = {
  wide: { l: 440, r: 1160 },
  narrow: { l: 300, r: 1300 },
};

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
        {}
        <linearGradient id={stone} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#08060b" />
          <stop offset="55%" stopColor="#0f0b12" />
          <stop offset="100%" stopColor="#241511" />
        </linearGradient>

        {}
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

      {}
      <path d={WALL} fill={`url(#${stone})`} fillRule="evenodd" />

      {}
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
                {}
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

      {}
      <rect x="0" y="0" width={W} height={H * 0.34} fill={`url(#${grime})`} />

      {}
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
