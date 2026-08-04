import { memo, useMemo } from "react";

/**
 * Embers drifting up through a section, in DOM rather than WebGL.
 *
 * The canvas behind the page already carries the scene; these are local
 * atmosphere for one section, and a dozen absolutely positioned dots on CSS
 * keyframes cost far less than another particle system and stay in the page's
 * stacking order, so they can sit between the scrim and the content.
 *
 * Positions are derived from the index rather than Math.random, so the layout
 * is identical on every render and no ember jumps when React re-renders.
 */
function EmberField({
  count = 14,
  className = "",
  reducedMotion = false,
  isMobile = false,
}) {
  // Halved on a phone. Each ember carries a box-shadow and an infinite
  // transform animation, so each one is its own composited layer; three
  // sections' worth is forty-odd layers for a handful of pixels of glow, on
  // the device least able to spare them. The pattern is index-derived, so
  // taking half still spreads across the section rather than clumping.
  const total = isMobile ? Math.ceil(count / 2) : count;

  const embers = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        // Coprime multipliers spread these out without clumping.
        left: `${(i * 37) % 100}%`,
        bottom: `${(i * 23) % 40}%`,
        delay: `${((i * 137) % 90) / 10}s`,
        duration: `${9 + ((i * 7) % 9)}s`,
        dx: `${(((i * 53) % 70) - 35) / 1}px`,
        rise: `${-260 - ((i * 61) % 320)}px`,
        size: i % 4 === 0 ? 3 : 2,
        peak: i % 3 === 0 ? 0.9 : 0.55,
      })),
    [total],
  );

  // Nothing decorative should move for someone who asked for stillness.
  if (reducedMotion) return null;

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
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
            boxShadow: `0 0 ${e.size * 3}px ${e.size}px rgba(255,138,31,0.55)`,
          }}
        />
      ))}
    </div>
  );
}

export default memo(EmberField);
