import { memo } from "react";

/**
 * A circle engraved into the floor. Geometry rather than occultism: two
 * concentric rings, a ring of tick marks, one ring of simple glyphs and two
 * inscribed triangles. It turns slowly enough that you notice it only if you
 * stop and look, and not at all under reduced motion.
 */
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

const GLYPHS = [
  "M5,0 V20 M5,4 L10,9",
  "M5,0 V20 M5,10 L10,4",
  "M0,0 L5,10 L0,20 M5,10 H10",
  "M0,0 V20 M0,0 L10,10 L0,20",
  "M5,0 V20 M0,5 L10,5",
  "M0,20 L5,0 L10,20",
];

function Ticks({ radius, count, length }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <line
          key={i}
          x1="0"
          y1={-radius}
          x2="0"
          y2={-radius + length}
          transform={`rotate(${(360 / count) * i})`}
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  );
}

function GlyphRing({ radius, count, opacity = 0.55 }) {
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }, (_, i) => (
        <g
          key={i}
          transform={`rotate(${(360 / count) * i}) translate(0 ${-radius}) scale(0.8)`}
        >
          <path
            d={GLYPHS[i % GLYPHS.length]}
            transform="translate(-5 -10)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
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
          <stop offset="0%" stopColor="#dcae74" stopOpacity="0.18" />
          <stop offset="52%" stopColor="#b98a52" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#b98a52" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Torchlight resting in the middle of the circle. */}
      <circle r="150" fill="url(#sc-core)" className="animate-pulse-glow" />

      <g className="text-bronze">
        {reducedMotion ? null : <Spin seconds={180} />}
        <circle r="188" fill="none" stroke="currentColor" strokeOpacity="0.42" strokeWidth="1" />
        <circle r="176" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
        <Ticks radius={188} count={72} length={7} />
      </g>

      <g className="text-bronze-lit">
        {reducedMotion ? null : <Spin seconds={120} reverse />}
        <circle r="122" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
        <circle r="98" fill="none" stroke="currentColor" strokeOpacity="0.24" strokeWidth="1" />
        <GlyphRing radius={110} count={6} />

        <path
          d="M0,-92 L79.7,46 L-79.7,46 Z"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="1"
        />
        <path
          d="M0,92 L79.7,-46 L-79.7,-46 Z"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1"
        />
      </g>

      <circle r="64" fill="none" stroke="#dcae74" strokeOpacity="0.4" strokeWidth="1" />
    </svg>
  );
}

export default memo(SummoningCircle);
