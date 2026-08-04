import { memo } from "react";

function Spin({ seconds, reverse = false }) {
  return (
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="rotate"
      from={reverse ? "360 0 0" : "0 0 0"}
      to={reverse ? "0 0 0" : "360 0 0"}
      dur={`${seconds}s`}
      repeatCount="indefinite"
    />
  );
}

const RUNES = [
  "M5,0 V20 M5,4 L10,9 M5,12 L10,17",
  "M5,0 V20 M5,10 L10,4 M5,10 L10,16",
  "M0,0 L5,10 L0,20 M5,10 H10",
  "M0,0 V20 M0,0 L10,10 L0,20",
  "M5,0 V20 M0,5 L10,5",
  "M0,0 L10,20 M10,0 L0,20",
  "M0,0 V20 M10,0 V20 M0,6 L10,14",
  "M5,0 V20 M0,4 L5,9 M10,4 L5,9",
  "M0,20 L5,0 L10,20",
  "M0,0 H10 M5,0 V20",
  "M5,0 V20 M0,20 L5,12 L10,20",
  "M0,0 V20 M0,10 L10,4 M0,10 L10,16",
];

function RuneRing({ radius, count, size = 1, opacity = 0.75 }) {
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i;
        return (
          <g key={i} transform={`rotate(${angle}) translate(0 ${-radius}) scale(${size})`}>
            <path
              d={RUNES[i % RUNES.length]}
              transform="translate(-5 -10)"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </g>
  );
}

function SummoningCircle({ className = "", reducedMotion = false }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="-200 -200 400 400"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <radialGradient id="sc-core">
          <stop offset="0%" stopColor="#ffe2a8" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#ff4d00" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ff4d00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {}
      <circle r="150" fill="url(#sc-core)" className="animate-pulse-glow" />

      {}
      <g className="text-brimstone">
        {reducedMotion ? null : <Spin seconds={110} />}
        <circle r="188" fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.4" />
        <circle r="158" fill="none" stroke="currentColor" strokeOpacity="0.42" strokeWidth="1.1" />
        <RuneRing radius={173} count={24} size={0.85} opacity={0.85} />
      </g>

      {}
      <g className="text-ember">
        {reducedMotion ? null : <Spin seconds={74} reverse />}
        <circle r="120" fill="none" stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.3" />
        <circle r="96" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.1" />
        <RuneRing radius={108} count={12} size={1.05} opacity={0.75} />

        {}
        <path
          d="M0,-92 L79.7,46 L-79.7,46 Z"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.1"
        />
        <path
          d="M0,92 L79.7,-46 L-79.7,-46 Z"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.32"
          strokeWidth="1.1"
        />
      </g>

      <circle r="66" fill="none" stroke="#ffb347" strokeOpacity="0.75" strokeWidth="1.2" />
    </svg>
  );
}

export default memo(SummoningCircle);
