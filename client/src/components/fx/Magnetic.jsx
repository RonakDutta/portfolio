import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Pulls its child a little way toward the pointer, then lets it spring back.
 *
 * The wrapper is `inline-block` so it never changes the layout of whatever it
 * is put around, and every listener is skipped when `active` is false. Touch
 * has no hover to answer, and it would only fight the tap.
 */
export default function Magnetic({
  children,
  strength = 0.32,
  radius = 1,
  active = true,
  className = "",
}) {
  const host = useRef(null);
  const pull = useRef(null);
  const spring = useRef(null);

  // One pair of quickTo setters per mount instead of a fresh tween on every
  // pointermove event.
  useEffect(() => {
    const node = host.current;
    if (!active || !node) return;
    pull.current = {
      x: gsap.quickTo(node, "x", { duration: 0.7, ease: "power3.out" }),
      y: gsap.quickTo(node, "y", { duration: 0.7, ease: "power3.out" }),
    };
    return () => {
      pull.current = null;
      gsap.killTweensOf(node);
    };
  }, [active]);

  const move = useCallback(
    (e) => {
      const node = host.current;
      if (!node || !pull.current) return;
      spring.current?.kill();
      const r = node.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      pull.current.x(dx * strength * radius);
      pull.current.y(dy * strength * radius);
    },
    [strength, radius],
  );

  const reset = useCallback(() => {
    spring.current = gsap.to(host.current, {
      x: 0,
      y: 0,
      duration: 1.1,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  if (!active) {
    return <span className={`inline-block ${className}`}>{children}</span>;
  }

  return (
    <span
      ref={host}
      onPointerMove={move}
      onPointerLeave={reset}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </span>
  );
}
