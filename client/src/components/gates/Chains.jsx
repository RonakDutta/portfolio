import { memo, useId, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Chains hanging across the gate, which snap as you scroll past.
 *
 * Each chain is split into two groups at its break point. Scrolling scrubs a
 * timeline that first loads the chain with tension, then drops the lower half.
 * Because it's scrubbed rather than fired, scrolling back up re-forges it — a
 * one-shot break would leave the hero permanently wrecked for anyone who
 * scrolls up, which is exactly what people do on a site like this.
 */

const PITCH = 26; // vertical spacing between link centres
const RY = 18; // link half-height; > PITCH/2 so links interlock

/** One chain link. Alternating links turn 90deg, as real chain does. */
function Link({ y, edgeOn, stroke }) {
  return (
    <ellipse
      cx="0"
      cy={y}
      rx={edgeOn ? 4.5 : 11}
      ry={RY}
      fill="none"
      stroke={stroke}
      strokeWidth={edgeOn ? 6 : 5}
    />
  );
}

function Chain({ x, links, breakAt, drift, scale = 1, registry }) {
  const uid = useId().replace(/:/g, "");
  const iron = `iron-${uid}`;
  const upper = useRef(null);
  const lower = useRef(null);
  const spark = useRef(null);

  // Hand the refs up so the parent can build one timeline for every chain.
  useLayoutEffect(() => {
    const entry = { upper: upper.current, lower: lower.current, spark: spark.current, drift };
    registry.current.push(entry);
    return () => {
      const i = registry.current.indexOf(entry);
      if (i > -1) registry.current.splice(i, 1);
    };
  }, [registry, drift]);

  const above = Array.from({ length: breakAt }, (_, i) => i);
  const below = Array.from({ length: links - breakAt }, (_, i) => i + breakAt);

  return (
    <g transform={`translate(${x} 0) scale(${scale})`}>
      <defs>
        <linearGradient id={iron} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#15111a" />
          <stop offset="35%" stopColor="#6b6270" />
          <stop offset="55%" stopColor="#8d8494" />
          <stop offset="100%" stopColor="#1b1620" />
        </linearGradient>
      </defs>

      <g ref={upper}>
        {above.map((i) => (
          <Link key={i} y={i * PITCH} edgeOn={i % 2 === 1} stroke={`url(#${iron})`} />
        ))}
      </g>

      {/* Sparks at the fracture, revealed for a few frames as it gives. */}
      <g ref={spark} opacity="0">
        <circle cx="0" cy={breakAt * PITCH} r="16" fill="#ffb347" opacity="0.5" />
        <circle cx="0" cy={breakAt * PITCH} r="6" fill="#fff3d6" />
      </g>

      <g ref={lower}>
        {below.map((i) => (
          <Link key={i} y={i * PITCH} edgeOn={i % 2 === 1} stroke={`url(#${iron})`} />
        ))}
      </g>
    </g>
  );
}

/** x position, link count, where it snaps, and which way the tail swings. */
const CHAINS = [
  { x: 90, links: 15, breakAt: 8, drift: -70, scale: 1 },
  { x: 215, links: 11, breakAt: 6, drift: -40, scale: 0.82 },
  { x: 985, links: 14, breakAt: 7, drift: 65, scale: 0.94 },
  { x: 1110, links: 10, breakAt: 5, drift: 95, scale: 0.76 },
];

function Chains({ triggerRef, reducedMotion }) {
  const registry = useRef([]);
  const root = useRef(null);

  useLayoutEffect(() => {
    // Reduced motion: the chains simply hang, intact and still.
    if (reducedMotion || !triggerRef.current) return;

    const ctx = gsap.context(() => {
      const chains = registry.current;
      chains.forEach(({ upper, lower }) => {
        gsap.set([upper, lower], { transformOrigin: "50% 0%" });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      chains.forEach(({ upper, lower, spark, drift }, i) => {
        const sway = drift > 0 ? 4 : -4;
        const at = 0.3 + i * 0.06; // stagger so they don't all give at once

        // Tension: the whole chain leans, and the lower half sags away.
        tl.to(upper, { rotation: sway, ease: "none", duration: at }, 0);
        tl.to(lower, { rotation: sway * 1.6, ease: "none", duration: at }, 0);

        // The break.
        tl.to(spark, { opacity: 1, duration: 0.04, ease: "none" }, at);
        tl.to(spark, { opacity: 0, duration: 0.16, ease: "none" }, at + 0.04);
        tl.to(
          lower,
          {
            y: 780,
            x: drift,
            rotation: drift > 0 ? 34 : -34,
            opacity: 0,
            ease: "power2.in",
            duration: 0.42,
          },
          at,
        );
        // Freed of the weight, the stub recoils the other way.
        tl.to(upper, { rotation: -sway * 2.2, ease: "power2.out", duration: 0.5 }, at);
      });
    }, root);

    return () => ctx.revert();
  }, [triggerRef, reducedMotion]);

  return (
    <svg
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] w-full"
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMin slice"
    >
      {CHAINS.map((c) => (
        <Chain key={c.x} {...c} registry={registry} />
      ))}
    </svg>
  );
}

export default memo(Chains);
