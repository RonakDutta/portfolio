import { memo } from "react";

/**
 * Section masthead: a numbered gold rule, then the title in display serif.
 *
 * Left-aligned by default. Every section header being centred is the fastest
 * way to make a site look assembled rather than art-directed.
 */
function SectionHeading({
  index,
  label,
  title,
  id,
  align = "left",
  size = "lg",
  itemClass = "",
  className = "",
}) {
  const centred = align === "center";

  return (
    <header className={className}>
      <p
        className={`${itemClass} flex items-center gap-5 eyebrow text-gold ${
          centred ? "justify-center" : ""
        }`}
      >
        {index ? <span className="text-gold-deep">{index}</span> : null}
        <span aria-hidden="true" className="h-px w-10 bg-gold/40" />
        <span className="text-stone">{label}</span>
      </p>

      {title ? (
        <h2
          id={id}
          className={`${itemClass} mt-7 font-display font-light text-ivory ${
            centred ? "text-center" : ""
          } ${
            size === "xl"
              ? "text-[clamp(3rem,9vw,7.5rem)] leading-[0.92]"
              : "text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95]"
          }`}
        >
          {title}
        </h2>
      ) : null}
    </header>
  );
}

export default memo(SectionHeading);
