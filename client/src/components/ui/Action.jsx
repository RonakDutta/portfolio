import { memo } from "react";

/**
 * Clean architectural Action button component.
 *
 * Anti-AI editorial styling:
 * - Crisp, tailored geometry (no generic rounded pills).
 * - Refined Instrument Sans typography with optical balance.
 * - Solid and outline plates with subtle depth and metallic brass borders.
 * - Clean custom SVG directional glyphs.
 */
function Action({
  children,
  href,
  onClick,
  variant = "outline",
  size = "md",
  arrow = "right",
  className = "",
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const isSolid = variant === "solid";

  const sizeClasses = {
    sm: "min-h-9 px-4 py-1.5 text-[0.82rem]",
    md: "min-h-11 px-6 py-2.5 text-[0.88rem]",
    lg: "min-h-12 px-7 py-3 text-[0.94rem]",
  }[size] || "min-h-11 px-6 py-2.5 text-[0.88rem]";

  const variantClasses = isSolid
    ? `bg-brass text-ink font-semibold border border-brass-lit/50
       shadow-[0_2px_12px_rgba(200,164,92,0.22)]
       hover:bg-brass-lit hover:border-white/50 hover:shadow-[0_4px_22px_rgba(200,164,92,0.4)]
       active:bg-brass-deep`
    : `bg-carbon/70 text-pearl font-medium backdrop-blur-sm
       border border-brass/35 hover:border-brass hover:bg-brass/10 hover:text-ivory
       shadow-[0_2px_8px_rgba(0,0,0,0.4)]
       hover:shadow-[0_4px_16px_rgba(200,164,92,0.15)]
       active:bg-brass/20`;

  const renderIcon = () => {
    if (!arrow) return null;

    if (arrow === "up-right") {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className="h-3 w-3 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          <path
            d="M3 1.5h7.5V9M10.5 1.5l-9 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (arrow === "down") {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 12 14"
          className="h-3.5 w-3 shrink-0 transition-transform duration-300 ease-out group-hover:translate-y-0.5"
        >
          <path
            d="M6 0v11.5M1.5 7.5l4.5 4.5 4.5-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (arrow === "code") {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 14 12"
          className="h-3 w-3.5 shrink-0 transition-transform duration-300 ease-out group-hover:scale-110"
        >
          <path
            d="M4 2 1 6l3 4M10 2l3 4-3 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    // Default right arrow
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 14 12"
        className="h-2.5 w-3.5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
      >
        <path
          d="M0 6h11.5M7.5 1.5l4.5 4.5-4.5 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <Tag
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      className={`group relative inline-flex items-center justify-center gap-3
        font-sans tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        select-none active:scale-[0.98] hover:-translate-y-0.5 active:translate-y-0
        ${sizeClasses} ${variantClasses} ${className}`}
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-3">
        <span>{children}</span>
        {renderIcon()}
      </span>
    </Tag>
  );
}

export default memo(Action);
