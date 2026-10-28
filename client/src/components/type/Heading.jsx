import { memo } from "react";

/**
 * Section titles: one word whispered, one word struck.
 *
 * The first is set condensed and light; the second expanded, black and in
 * foil, sized so it always fills the measure on a single line whatever its
 * length (container query units against the heading's own width). The struck
 * word arrives condensed and opens out to full width as it is revealed.
 */
function Heading({ id, index, kicker, title, accent, tone = "dark", align = "left", className = "" }) {
  const letters = Math.max(accent.length, 4);
  const onGold = tone === "gold";

  return (
    <div className={className}>
      {kicker ? (
        <p
          data-reveal="up"
          className={`label flex items-center gap-3 ${onGold ? "text-ink/70" : "text-gold"} ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          {index ? <span>{index}</span> : null}
          <span aria-hidden="true" className={`h-px w-8 ${onGold ? "bg-ink/40" : "bg-gold/50"}`} />
          <span>{kicker}</span>
        </p>
      ) : null}

      <h2 id={id} className={`mt-5 [container-type:inline-size] ${align === "center" ? "text-center" : ""}`}>
        {title ? (
          <span data-reveal="slot" className="block">
            <span className="slot">
              <span
                className={`narrow block text-[clamp(2.4rem,9cqi,7.5rem)] leading-[0.92] font-[250] tracking-[-0.01em] uppercase ${
                  onGold ? "text-ink" : "text-ivory"
                }`}
              >
                {title}
              </span>
            </span>{" "}
          </span>
        ) : null}
        <span
          data-reveal="stretch"
          className={`wide block pb-[0.04em] leading-[0.86] font-[850] tracking-[-0.035em] uppercase ${
            onGold ? "text-ink" : "foil"
          }`}
          style={{ fontSize: `min(12.5rem, ${(100 / (letters * 0.93)).toFixed(2)}cqi)` }}
        >
          {accent}
        </span>
      </h2>
    </div>
  );
}

export default memo(Heading);
