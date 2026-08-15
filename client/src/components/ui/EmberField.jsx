import { memo, useMemo } from "react";

/**
 * Sparse embers drifting up out of frame. Deliberately few and deliberately
 * dim: this is meant to read as air above something hot, not as a particle
 * effect. Deterministic placement, so it never reflows between renders.
 */
function EmberField({
  count = 10,
  className = "",
  reducedMotion = false,
  isMobile = false,
}) {
  const total = isMobile ? Math.ceil(count / 2) : count;

  const embers = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        bottom: `${(i * 23) % 40}%`,
        delay: `${((i * 137) % 90) / 10}s`,
        duration: `${12 + ((i * 7) % 10)}s`,
        dx: `${(((i * 53) % 70) - 35) / 1}px`,
        rise: `${-260 - ((i * 61) % 320)}px`,
        size: i % 4 === 0 ? 2 : 1,
        peak: i % 3 === 0 ? 0.5 : 0.3,
      })),
    [total],
  );

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {embers.map((e, i) => (
        <span
          key={i}
          className="animate-ember-float absolute rounded-full bg-hellfire"
          style={{
            left: e.left,
            bottom: e.bottom,
            width: e.size,
            height: e.size,
            animationDelay: e.delay,
            animationDuration: e.duration,
            "--dx": e.dx,
            "--rise": e.rise,
            "--peak": e.peak,
            boxShadow: `0 0 ${e.size * 4}px ${e.size}px rgba(255,148,72,0.3)`,
          }}
        />
      ))}
    </div>
  );
}

export default memo(EmberField);
