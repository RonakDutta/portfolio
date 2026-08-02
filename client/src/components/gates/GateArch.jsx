import { memo, useId } from "react";

const W = 1200;
const H = 900;
const SPRING_Y = 0.58;
const OPEN_R = 0.76;
const OPEN_L = 0.24;
const MID_X = (OPEN_L + OPEN_R) / 2;
const R = OPEN_R - OPEN_L;

const WALL_PATH = [
  `M 0 0`,
  `H ${W}`,
  `V ${H}`,
  `H 0`,
  `Z`,
  `M ${OPEN_L * W} ${H}`,
  `V ${SPRING_Y * H}`,
  `A ${R * W} ${R * H} 0 0 1 ${MID_X * W} ${(SPRING_Y - R * 0.72) * H}`,
  `A ${R * W} ${R * H} 0 0 1 ${OPEN_R * W} ${SPRING_Y * H}`,
  `V ${H}`,
  `Z`,
].join(" ");

const ARCH_RIM_PATH = [
  `M ${OPEN_L * W} ${H}`,
  `V ${SPRING_Y * H}`,
  `A ${R * W} ${R * H} 0 0 1 ${MID_X * W} ${(SPRING_Y - R * 0.72) * H}`,
  `A ${R * W} ${R * H} 0 0 1 ${OPEN_R * W} ${SPRING_Y * H}`,
  `V ${H}`,
].join(" ");

function Course({ y, height, joints, stroke }) {
  return (
    <g>
      <line x1="0" y1={y} x2={OPEN_L * W} y2={y} stroke={stroke} strokeWidth="1.2" />
      <line x1={OPEN_R * W} y1={y} x2={W} y2={y} stroke={stroke} strokeWidth="1.2" />
      {joints.map((x, i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x} y2={y + height} stroke={stroke} strokeWidth="1.2" />
          <line x1={W - x} y1={y} x2={W - x} y2={y + height} stroke={stroke} strokeWidth="1.2" />
        </g>
      ))}
    </g>
  );
}

const COURSES = [
  { y: 60, height: 60, joints: [100, 220] },
  { y: 120, height: 65, joints: [50, 160] },
  { y: 185, height: 60, joints: [110, 230] },
  { y: 245, height: 70, joints: [60, 180] },
  { y: 315, height: 65, joints: [120, 240] },
  { y: 380, height: 70, joints: [70, 190] },
  { y: 450, height: 75, joints: [130, 250] },
  { y: 525, height: 75, joints: [80, 200] },
  { y: 600, height: 80, joints: [140, 260] },
  { y: 680, height: 85, joints: [90, 210] },
  { y: 765, height: 135, joints: [150, 270] },
];

function GateArch() {
  const uid = useId().replace(/:/g, "");
  const wallGrad = `wall-grad-${uid}`;
  const rimGrad = `rim-grad-${uid}`;
  const sootGrad = `soot-grad-${uid}`;
  const wallMask = `wall-mask-${uid}`;

  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={wallGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#08060c" />
          <stop offset="55%" stopColor="#141019" />
          <stop offset="100%" stopColor="#281a17" />
        </linearGradient>

        <linearGradient id={rimGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241d29" />
          <stop offset="45%" stopColor="#ff4d00" stopOpacity="0.45" />
          <stop offset="85%" stopColor="#ff8a1f" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffc061" />
        </linearGradient>

        <linearGradient id={sootGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#05030a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#05030a" stopOpacity="0" />
        </linearGradient>

        <mask id={wallMask}>
          <path d={WALL_PATH} fill="#fff" fillRule="evenodd" />
        </mask>
      </defs>

      <path d={WALL_PATH} fill={`url(#${wallGrad})`} fillRule="evenodd" />

      <g mask={`url(#${wallMask})`}>
        {COURSES.map((c) => (
          <Course key={c.y} {...c} stroke="rgba(255,138,31,0.07)" />
        ))}
      </g>

      <rect x="0" y="0" width={W} height={H * 0.35} fill={`url(#${sootGrad})`} />

      <path
        d={ARCH_RIM_PATH}
        fill="none"
        stroke={`url(#${rimGrad})`}
        strokeWidth="3.5"
      />
    </svg>
  );
}

export default memo(GateArch);
