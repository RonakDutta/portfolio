import { memo } from "react";

/**
 * The one button on the site.
 *
 * Square corners, a mono label and a fill that wipes up from the baseline on
 * hover. The previous version was a rounded gradient slab with a diagonal
 * shine sweeping across it on a timer — the most copied button on the internet
 * and the loudest thing on the page.
 */
function Action({
  children,
  href,
  onClick,
  variant = "ghost",
  arrow = "right",
  className = "",
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const solid = variant === "solid";

  return (
    <Tag
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      className={`group relative isolate inline-flex min-h-12 items-center justify-center gap-3
        overflow-hidden px-7 py-3.5 eyebrow-sm transition-colors duration-500
        ease-[cubic-bezier(0.16,1,0.3,1)]
        ${
          solid
            ? "bg-brass text-ink hover:text-ink"
            : "border border-brass/35 text-brass-lit hover:border-brass hover:text-ink"
        }
        ${className}`}
      {...rest}
    >
      {/* The wipe. Origin at the baseline so it reads as filling up. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 transition-transform
          duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:scale-y-100 group-focus-visible:scale-y-100"
        style={{ background: solid ? "#ecd7a3" : "#c8a45c" }}
      />

      <span className="relative">{children}</span>

      {arrow ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 14 12"
          className={`relative h-2.5 w-3 transition-transform duration-500
            ease-[cubic-bezier(0.16,1,0.3,1)] ${
              arrow === "down"
                ? "rotate-90 group-hover:translate-y-0.5"
                : "group-hover:translate-x-1"
            }`}
        >
          <path
            d="M0 6h12M8 1.5 12.5 6 8 10.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
      ) : null}
    </Tag>
  );
}

export default memo(Action);
