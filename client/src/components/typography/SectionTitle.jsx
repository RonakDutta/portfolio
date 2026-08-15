import { memo } from "react";

/**
 * Section masthead with 24k gold filament, Cinzel display title, and Playfair italic foil accent.
 */
function SectionTitle({
  index,
  label,
  title,
  accent,
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
        className={`${itemClass} flex items-center gap-4 eyebrow text-champagne ${
          centred ? "justify-center" : ""
        }`}
      >
        {index ? (
          <span className="flex items-center gap-2 font-mono text-[0.7rem] font-medium text-gold-metal">
            <span className="h-1.5 w-1.5 rotate-45 bg-gold-metal/80" />
            {index}
          </span>
        ) : null}
        <span
          aria-hidden="true"
          className="h-px w-10 sm:w-14"
          style={{
            background:
              "linear-gradient(90deg, rgba(229,190,72,0.95), rgba(179,134,40,0))",
          }}
        />
        <span className="text-sand/90 font-medium tracking-[0.24em]">{label}</span>
      </p>

      {title ? (
        <h2
          id={id}
          className={`${itemClass} mt-6 font-display ${centred ? "text-center" : ""} ${
            size === "xl"
              ? "text-[clamp(2.8rem,8.5vw,6.5rem)] leading-[0.95] font-semibold tracking-[0.03em] uppercase"
              : "text-[clamp(2.2rem,5.5vw,4.2rem)] leading-[0.98] font-semibold tracking-[0.03em] uppercase"
          }`}
        >
          <span className="text-ivory-lit inline-block">{title}</span>{" "}
          {accent ? (
            <span className="text-foil animate-foil font-accent font-normal italic lowercase sm:pl-2">
              {accent}
            </span>
          ) : null}
        </h2>
      ) : null}
    </header>
  );
}

export default memo(SectionTitle);
