import { useCallback, useRef } from "react";
import gsap from "gsap";

/**
 * Pulls its child a little way toward the pointer, then lets it spring back.
 *
 * The wrapper is `inline-block` so it never changes the layout of whatever it
 * is put around, and every listener is skipped when `active` is false — touch
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

  const move = useCallback(
    (e) => {
      const node = host.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);

      gsap.to(node, {
        x: dx * strength * radius,
        y: dy * strength * radius,
        duration: 0.7,
        ease: "power3.out",
      });
    },
    [strength, radius],
  );

  const reset = useCallback(() => {
    gsap.to(host.current, {
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
