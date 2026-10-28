import { memo } from "react";

/**
 * The house button. Rounded, brass or ink, and two things happen on hover:
 *
 * - The label rolls. The word slides up out of its slot and a second copy
 *   rises in under it, the way a split-flap board turns.
 * - Solid: one band of light crosses the brass, the way it would catch a
 *   lamp as you tilt it. Outline: brass pours up from the bottom and the
 *   label turns to ink.
 *
 * Both are hover-only (Tailwind 4 gates `hover:` to real pointers), are
 * transforms, and reset the moment the pointer leaves. On touch the button
 * is simply the button.
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
    sm: "min-h-9 px-5 py-1.5 text-[0.82rem]",
    md: "min-h-11 px-6 py-2.5 text-[0.88rem]",
    lg: "min-h-12 px-7 py-3 text-[0.94rem]",
  }[size] || "min-h-11 px-6 py-2.5 text-[0.88rem]";

  const variantClasses = isSolid
    ? `bg-gradient-to-r from-brass-lit via-brass to-brass text-ink font-semibold
       shadow-[0_2px_16px_-2px_rgba(200,164,92,0.38),0_0_0_1px_rgba(236,215,163,0.4)]
       hover:shadow-[0_8px_28px_-4px_rgba(200,164,92,0.6),0_0_0_1px_rgba(255,246,222,0.75)]`
    : `bg-carbon/80 text-pearl font-medium hover:text-ink
       border border-brass/30 hover:border-brass
       shadow-[0_2px_12px_-2px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(200,164,92,0.15)]
       hover:shadow-[0_6px_24px_-4px_rgba(200,164,92,0.4)]`;

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
      className={`group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden
        rounded-full font-sans tracking-[-0.01em] transition-[color,border-color,box-shadow,translate,scale]
        duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none hover:-translate-y-0.5
        active:translate-y-0 active:scale-[0.97] ${sizeClasses} ${variantClasses} ${className}`}
      {...rest}
    >
      {isSolid ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2 -translate-x-full skew-x-[-20deg]
            bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition-[translate,opacity]
            duration-0 group-hover:translate-x-[420%] group-hover:opacity-100 group-hover:duration-[900ms]
            group-hover:ease-[cubic-bezier(0.65,0,0.35,1)]"
        />
      ) : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 translate-y-[101%] rounded-[inherit]
            bg-gradient-to-r from-brass-lit via-brass to-brass transition-transform duration-500
            ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
        />
      )}

      <span className="relative flex items-center gap-3">
        <span className="relative block overflow-hidden">
          <span
            className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
              group-hover:-translate-y-full"
          >
            {children}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-full block transition-transform duration-500
              ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
          >
            {children}
          </span>
        </span>
        {renderIcon()}
      </span>
    </Tag>
  );
}

export default memo(Action);
