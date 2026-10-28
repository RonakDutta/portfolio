import { Fragment, memo } from "react";

/**
 * Splits a line into words that rise one after another out of their own slot.
 *
 * Each slot carries `data-reveal="mask"`, so it rides the one
 * IntersectionObserver in lib/reveal.js, including its failsafe. If
 * observation fails for any reason the words are simply shown, never left
 * blank.
 *
 * The slot clips and the word inside it translates, so the motion is a single
 * transform per word with no filter and no opacity to blend. `className`
 * lands on the inner span, because a clipped gradient fill has to sit on the
 * element whose glyphs it paints.
 *
 * The spaces between words stay real text nodes, so the line still wraps and
 * still copies as a sentence.
 */
function Words({ text, className = "", step = 70, offset = 0 }) {
  const words = String(text).split(" ");

  return words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span data-reveal="mask" className="word-mask">
        <span
          className={className}
          style={{ transitionDelay: `${offset + i * step}ms` }}
        >
          {word}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </Fragment>
  ));
}

export default memo(Words);
