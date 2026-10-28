import { memo } from "react";
import Words from "./Words";

/**
 * Section masthead: the title, and its cursive accent.
 *
 * Nothing else. Every section used to open with a numbered, letter-spaced,
 * all-caps label trailing a short rule, and six of those down a page is a
 * template tell rather than a design. The titles say what the sections are.
 */
function SectionTitle({
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
      <h2
        id={id}
        className={`font-display font-normal ${
          size === "xl"
            ? "text-[clamp(3rem,9vw,6.5rem)]"
            : "text-[clamp(2.5rem,6.5vw,4.8rem)]"
        } leading-[1.02] tracking-[-0.02em]`}
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
            className={`script inline-block pr-[0.12em] align-baseline text-[1.34em] leading-[0.9] ${
              paper ? "text-brass-deep" : "text-leaf"
            }`}
          >
            {script}
          </span>
        ) : null}
      </h2>
    </header>
  );
}

export default memo(SectionTitle);
