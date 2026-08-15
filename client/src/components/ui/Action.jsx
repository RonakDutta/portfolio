import { memo } from "react";

/**
 * The one button on the site.
 *
 * Two opposing corners are cut, which is the same shape the RD monogram sits
 * in, so the button belongs to the mark rather than to a component library.
 * The outline is a one-pixel plate showing through from behind rather than a
 * border, because a border cannot follow a clip path.
 *
 * On hover the fill rises from the baseline and the label rolls up out of the
 * way while a second copy of it rolls in from below.
 */
const NOTCH =
  "polygon(0.72rem 0, 100% 0, 100% calc(100% - 0.72rem), calc(100% - 0.72rem) 100%, 0 100%, 0 0.72rem)";

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
      className={`group relative inline-block p-px transition-colors duration-500
        ${solid ? "bg-brass-lit" : "bg-brass/40 hover:bg-brass"} ${className}`}
      style={{ clipPath: NOTCH }}
      {...rest}
    >
      <span
        className={`relative flex min-h-12 items-center justify-center gap-3 overflow-hidden
          px-7 py-3.5 eyebrow-sm transition-colors duration-500
          ease-[cubic-bezier(0.16,1,0.3,1)]
          ${solid ? "bg-brass text-ink" : "bg-ink text-brass-lit group-hover:text-ink"}`}
        style={{ clipPath: NOTCH }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500
            ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100
            group-focus-visible:scale-y-100"
          style={{ background: solid ? "#ecd7a3" : "#c8a45c" }}
        />

        {/* The label rides up; its double rides in behind it. */}
        <span className="relative block overflow-hidden">
          <span
            className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
              group-hover:-translate-y-[130%] group-focus-visible:-translate-y-[130%]"
          >
            {children}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 block translate-y-[130%] transition-transform duration-500
              ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0
              group-focus-visible:translate-y-0"
          >
            {children}
          </span>
        </span>

        {arrow ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 14 12"
            className={`relative h-2.5 w-3 shrink-0 transition-transform duration-500
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
      </span>
    </Tag>
  );
}

export default memo(Action);
