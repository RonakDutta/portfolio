import { memo, useCallback, useRef } from "react";

/**
 * Luxury hardware control.
 *
 * A black core inside a gold bezel. On hover a band of light sweeps across the
 * face once — the reflection you get running a finger over a polished surface.
 * With a real cursor it also takes a small magnetic pull, capped at 7px so it
 * reads as weight rather than as a toy.
 *
 * `gold` fills solid and inverts the label; `outline` stays black and warms.
 */
function LuxuryButton({
  children,
  href,
  onClick,
  variant = "outline",
  magnetic = false,
  className = "",
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const node = useRef(null);
  const solid = variant === "gold";

  const pull = useCallback(
    (event) => {
      if (!magnetic || !node.current) return;
      const r = node.current.getBoundingClientRect();
      const clamp = (v) => Math.max(-7, Math.min(7, v));
      const x = clamp((event.clientX - (r.left + r.width / 2)) * 0.16);
      const y = clamp((event.clientY - (r.top + r.height / 2)) * 0.2);
      node.current.style.transform = `translate(${x}px, ${y}px)`;
    },
    [magnetic],
  );

  const release = useCallback(() => {
    if (node.current) node.current.style.transform = "";
  }, []);

  return (
    <Tag
      ref={node}
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      onPointerMove={magnetic ? pull : undefined}
      onPointerLeave={magnetic ? release : undefined}
      onBlur={magnetic ? release : undefined}
      className={`group relative isolate inline-flex min-h-13 items-center justify-center gap-4
        overflow-hidden px-9 py-4 eyebrow-sm transition-[transform,color,border-color]
        duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform
        ${
          solid
            ? "border border-champagne text-void"
            : "border border-gold-dark/70 text-champagne hover:border-gold-metal hover:text-gold-white"
        }
        ${className}`}
      {...rest}
    >
      {/* Core */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background: solid
            ? "linear-gradient(140deg, #fff5c7 0%, #f0d58a 26%, #d4af37 58%, #8c6508 100%)"
            : "linear-gradient(180deg, rgba(16,16,16,0.9), rgba(5,5,5,0.95))",
        }}
      />

      {/* Single light sweep across the face on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-full -z-10 w-2/3 -skew-x-12
          transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:translate-x-[250%] group-focus-visible:translate-x-[250%]"
        style={{
          background: solid
            ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)"
            : "linear-gradient(90deg, transparent, rgba(240,213,138,0.22), transparent)",
        }}
      />

      <span className="relative">{children}</span>

      <span
        aria-hidden="true"
        className={`h-px w-5 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:w-8 ${solid ? "bg-void/50" : "bg-gold-metal"}`}
      />
    </Tag>
  );
}

export default memo(LuxuryButton);
