import { memo, useCallback, useRef } from "react";

/**
 * 24K Hardware Luxury Button
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
      className={`group relative isolate inline-flex min-h-12 items-center justify-center gap-3.5
        overflow-hidden rounded-xl px-7 py-3.5 eyebrow-sm font-semibold transition-all
        duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform cursor-pointer
        ${
          solid
            ? "border border-gold-white/40 text-void shadow-[0_0_24px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(255,217,102,0.55)]"
            : "border border-gold-dark/45 bg-carbon/70 text-champagne backdrop-blur-md hover:border-gold-metal hover:text-gold-white hover:shadow-[0_0_24px_rgba(212,175,55,0.2)]"
        }
        ${className}`}
      {...rest}
    >
      {/* Core Gradient */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background: solid
            ? "linear-gradient(135deg, #fff8dc 0%, #f3e5ab 20%, #e5be48 55%, #d4af37 80%, #b38628 100%)"
            : "linear-gradient(180deg, rgba(24,26,36,0.85), rgba(12,13,18,0.95))",
        }}
      />

      {/* Light Sweep Reflection */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-full -z-10 w-2/3 -skew-x-12
          transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:translate-x-[250%] group-focus-visible:translate-x-[250%]"
        style={{
          background: solid
            ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)"
            : "linear-gradient(90deg, transparent, rgba(243,229,171,0.3), transparent)",
        }}
      />

      <span className="relative tracking-[0.2em]">{children}</span>

      <span
        aria-hidden="true"
        className={`h-px w-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:w-7 ${solid ? "bg-void/60" : "bg-gold-metal"}`}
      />
    </Tag>
  );
}

export default memo(LuxuryButton);
