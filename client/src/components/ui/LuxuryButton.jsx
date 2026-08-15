import { memo, useRef } from "react";

/**
 * 24K Hardware Luxury Button
 */
function LuxuryButton({
  children,
  href,
  onClick,
  variant = "outline",
  className = "",
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const node = useRef(null);
  const solid = variant === "gold";

  return (
    <Tag
      ref={node}
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      className={`group relative isolate inline-flex min-h-12 items-center justify-center gap-3.5
        overflow-hidden rounded-xl px-7 py-3.5 eyebrow-sm font-semibold transition-all
        duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer
        ${
          solid
            ? "border border-gold-white/40 text-void shadow-[0_0_18px_rgba(212,175,55,0.22)] hover:shadow-[0_0_26px_rgba(255,217,102,0.34)]"
            : "border border-gold-dark/45 bg-carbon/90 text-champagne hover:border-gold-metal hover:text-gold-white hover:shadow-[0_0_24px_rgba(212,175,55,0.2)]"
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
    </Tag>
  );
}

export default memo(LuxuryButton);
