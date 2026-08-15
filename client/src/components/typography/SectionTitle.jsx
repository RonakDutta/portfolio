import { memo } from "react";

/**
 * Section masthead. A numbered gold filament, then the title in display serif
 * with an optional second line struck in foil — the same two-tone move the
 * hero makes, so every section is recognisably part of the same publication.
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
        className={`${itemClass} flex items-center gap-5 eyebrow text-champagne ${
          centred ? "justify-center" : ""
        }`}
      >
        {index ? <span className="text-gold-dark">{index}</span> : null}
        <span
          aria-hidden="true"
          className="h-px w-12"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,175,55,0.9), rgba(140,101,8,0))",
          }}
        />
        <span className="text-sand">{label}</span>
      </p>

      {title ? (
        <h2
          id={id}
          className={`${itemClass} mt-7 font-display font-light ${centred ? "text-center" : ""} ${
            size === "xl"
              ? "text-[clamp(3rem,10vw,8rem)] leading-[0.9]"
              : "text-[clamp(2.5rem,6.4vw,5rem)] leading-[0.94]"
          }`}
        >
          <span className="text-ivory-lit block">{title}</span>{" "}
          {accent ? (
            <span className="text-foil animate-foil block italic">{accent}</span>
          ) : null}
        </h2>
      ) : null}
    </header>
  );
}

export default memo(SectionTitle);
