import { memo } from "react";

/**
 * A slow ticker of the things I actually build with.
 *
 * The row is rendered twice and translated by exactly -50%, which is what makes
 * the loop seamless: at the end of the cycle copy two is sitting precisely
 * where copy one started. Hovering pauses it; reduced motion stops it dead and
 * leaves a legible static row.
 */
function Marquee({ items, duration = 46, className = "" }) {
  const run = [...items, ...items];

  return (
    <div
      className={`marquee-host relative flex overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <ul
        className="animate-marquee flex w-max shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16"
        style={{ "--dur": `${duration}s` }}
      >
        {run.map((item, i) => (
          <li
            key={`${item}-${i}`}
            aria-hidden={i >= items.length ? "true" : undefined}
            className="flex shrink-0 items-center gap-10 sm:gap-16"
          >
            <span className="font-display text-[1.4rem] leading-none font-normal whitespace-nowrap text-pearl/70 sm:text-[1.9rem]">
              {item}
            </span>
            <span
              aria-hidden="true"
              className="h-1 w-1 shrink-0 rotate-45 bg-brass/60"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(Marquee);
