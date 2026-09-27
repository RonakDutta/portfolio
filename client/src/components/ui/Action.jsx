import { memo } from "react";

/**
 * Editorial, tactile Action button component.
 *
 * Designed with bespoke craft:
 * - Fluid pill geometry with layered ambient lighting.
 * - Tactile lift and press states (smooth scale + micro-depth).
 * - Refined typography in Instrument Sans with optical balance.
 * - Dynamic context-aware glyphs (arrow-right, arrow-down, up-right, download, code).
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
    sm: "min-h-9 px-4 py-1.5 text-[0.8rem]",
    md: "min-h-11 px-6 py-2.5 text-[0.875rem]",
    lg: "min-h-12 px-7 py-3 text-[0.92rem]",
  }[size] || "min-h-11 px-6 py-2.5 text-[0.875rem]";

  const variantClasses = isSolid
    ? `bg-gradient-to-r from-brass-lit via-brass to-brass text-ink font-semibold
       shadow-[0_2px_16px_-2px_rgba(200,164,92,0.38),0_0_0_1px_rgba(236,215,163,0.4)]
       hover:shadow-[0_6px_24px_-2px_rgba(200,164,92,0.55),0_0_0_1px_rgba(255,246,222,0.7)]
       hover:brightness-105 active:brightness-95`
    : `bg-carbon/80 text-pearl font-medium backdrop-blur-md
       border border-brass/30 hover:border-brass/75 hover:bg-brass/[0.12] hover:text-ivory
       shadow-[0_2px_12px_-2px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(200,164,92,0.15)]
       hover:shadow-[0_4px_20px_-2px_rgba(200,164,92,0.22),inset_0_1px_0_0_rgba(200,164,92,0.3)]`;

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
            d="M3.5 1.5h7v7M10.5 1.5l-9 9"
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
          viewBox="0 0 12 12"
          className="h-3 w-3 shrink-0 transition-transform duration-300 ease-out group-hover:translate-y-0.5"
        >
          <path
            d="M6 1.5v9M2 6.5l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (arrow === "download") {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className="h-3 w-3 shrink-0 transition-transform duration-300 ease-out group-hover:translate-y-0.5"
        >
          <path
            d="M6 1.5v6.5M3.5 5.5 6 8l2.5-2.5M1.5 10.5h9"
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
            d="M4 2.5 1 6l3 3.5M10 2.5l3 3.5-3 3.5M8.5 1.5l-3 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    // Default: right arrow
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
      className={`group relative inline-flex items-center justify-center gap-2.5 rounded-full
        font-sans tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        select-none active:scale-[0.97] hover:-translate-y-0.5 active:translate-y-0
        ${sizeClasses} ${variantClasses} ${className}`}
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-2.5">
        <span>{children}</span>
        {renderIcon()}
      </span>
    </Tag>
  );
}

export default memo(Action);
