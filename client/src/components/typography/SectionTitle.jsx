import { memo } from "react";
import Words from "./Words";

/**
 * Section masthead: a mono index line, then the title with its cursive accent.
 *
 * There is no rule under it. Every section used to open with the same hairline
 * and the page ended up looking ruled rather than designed — the space below
 * the title does that job now.
 */
function SectionTitle({
  index,
  label,
  title,
  script,
  id,
  tone = "ink",
  size = "lg",
  className = "",
}) {
  const paper = tone === "paper";

  return (
    <header className={className}>
      <p
        data-reveal
        className={`flex items-center gap-3.5 eyebrow ${
          paper ? "text-espresso-soft" : "text-brass"
        }`}
      >
        {index ? <span className="font-medium">{index}</span> : null}
        <span
          aria-hidden="true"
          className="h-px w-8 sm:w-12"
          style={{
            background: paper
              ? "linear-gradient(90deg, rgba(74,66,55,0.7), rgba(74,66,55,0))"
              : "linear-gradient(90deg, rgba(200,164,92,0.9), rgba(200,164,92,0))",
          }}
        />
        <span className={paper ? "text-espresso/70" : "text-sand/80"}>{label}</span>
      </p>

      {title || script ? (
        <h2
          id={id}
          className={`mt-5 font-display font-normal ${
            size === "xl"
              ? "text-[clamp(2.9rem,9vw,6.5rem)]"
              : "text-[clamp(2.4rem,6.5vw,4.6rem)]"
          } leading-[1.02] tracking-[-0.02em] sm:mt-6`}
        >
          {title ? (
            <Words
              text={title}
              className={paper ? "text-espresso" : "text-ivory-lit"}
            />
          ) : null}
          {title && script ? " " : null}
          {script ? (
            <span
              data-reveal
              style={{ transitionDelay: "140ms" }}
              className={`script inline-block pr-[0.12em] text-[1.34em] leading-[0.9] align-baseline ${
                paper ? "text-brass-deep" : "text-leaf"
              }`}
            >
              {script}
            </span>
          ) : null}
        </h2>
      ) : null}
    </header>
  );
}

export default memo(SectionTitle);
