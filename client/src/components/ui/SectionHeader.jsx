import { memo } from "react";

/**
 * One header shape for every section: a numbered rule, the title, a single
 * line of lede. Left-aligned by default because a page of centred headers
 * reads as a template.
 */
function SectionHeader({
  index,
  label,
  title,
  lede,
  id,
  align = "left",
  className = "",
  /* Stamped onto each line so the owning section can stagger them in. */
  itemClass = "",
}) {
  const centred = align === "center";

  return (
    <header
      className={`${className} ${centred ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}
    >
      <p
        className={`${itemClass} flex items-center gap-4 font-mono text-[0.65rem]
          tracking-[0.32em] text-bronze uppercase ${centred ? "justify-center" : ""}`}
      >
        <span aria-hidden="true" className="h-px w-8 bg-bronze/45" />
        <span>
          {index}
          <span aria-hidden="true" className="mx-2 text-slate">
            /
          </span>
          <span className="text-parchment/80">{label}</span>
        </span>
      </p>

      <h2
        id={id}
        className={`${itemClass} mt-6 font-display text-[clamp(2rem,4.6vw,3.25rem)]
          leading-[1.04] font-bold text-bone`}
      >
        {title}
      </h2>

      {lede ? (
        <p
          className={`${itemClass} mt-5 max-w-xl text-parchment ${centred ? "mx-auto" : ""}`}
        >
          {lede}
        </p>
      ) : null}
    </header>
  );
}

export default memo(SectionHeader);
