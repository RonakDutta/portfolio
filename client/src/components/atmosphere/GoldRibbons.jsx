import { memo, useId } from "react";

/**
 * Gold light ribbons — long-exposure light trails crossing the frame.
 *
 * Each ribbon is a single wide bezier stroked with a gradient that fades to
 * nothing at both ends, so it reads as light passing through rather than as a
 * line with two cut ends. They sway on a slow shear (see `ribbon-sway`), which
 * looks like silk moving; translating them instead would look like something
 * sliding past the camera.
 *
 * SVG rather than canvas: four paths, no per-frame JavaScript at all.
 */
const RIBBONS = [
  {
    d: "M-120,520 C240,300 520,660 900,360 C1180,140 1360,420 1620,240",
    width: 2.2,
    dur: "19s",
    delay: "0s",
    lo: 0.4,
    hi: 1,
    blur: 0.4,
  },
  {
    d: "M-120,700 C300,540 600,820 980,520 C1240,320 1420,560 1620,420",
    width: 1.1,
    dur: "27s",
    delay: "-6s",
    lo: 0.26,
    hi: 0.72,
    blur: 0,
  },
  {
    d: "M-120,300 C260,120 540,400 880,180 C1160,0 1380,240 1620,80",
    width: 3.4,
    dur: "33s",
    delay: "-13s",
    lo: 0.16,
    hi: 0.5,
    blur: 2.4,
  },
  {
    d: "M-120,880 C320,760 640,980 1020,720 C1280,540 1460,760 1620,640",
    width: 1.6,
    dur: "23s",
    delay: "-3s",
    lo: 0.22,
    hi: 0.62,
    blur: 1,
  },
];

function GoldRibbons({ still = false, className = "" }) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 h-full w-full mix-blend-screen ${className}`}
    >
      <defs>
        <linearGradient id={`rb-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5e4a20" stopOpacity="0" />
          <stop offset="18%" stopColor="#8a6d33" stopOpacity="0.7" />
          <stop offset="42%" stopColor="#c8a45c" stopOpacity="1" />
          <stop offset="56%" stopColor="#fff6de" stopOpacity="1" />
          <stop offset="74%" stopColor="#c8a45c" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#5e4a20" stopOpacity="0" />
        </linearGradient>
      </defs>

      {RIBBONS.map((r) => (
        <path
          key={r.d}
          d={r.d}
          fill="none"
          stroke={`url(#rb-${uid})`}
          strokeWidth={r.width}
          strokeLinecap="round"
          className={still ? undefined : "animate-ribbon"}
          style={{
            "--lo": r.lo,
            "--hi": r.hi,
            opacity: still ? r.lo : undefined,
            animationDuration: r.dur,
            animationDelay: r.delay,
            transformOrigin: "50% 50%",
            willChange: still ? undefined : "transform, opacity",
          }}
        />
      ))}
    </svg>
  );
}

export default memo(GoldRibbons);
