import { Fragment, memo } from "react";

/**
 * Splits a line into words that rise and sharpen one after another.
 *
 * Each word carries `data-reveal`, so it rides the one IntersectionObserver in
 * lib/reveal.js — including its failsafe. If observation fails for any reason
 * the words are simply shown, never left blank.
 *
 * Words are inline-block (transformable) but the spaces between them stay real
 * text nodes, so the line still wraps and still copies as a sentence.
 */
function Words({ text, className = "", step = 55, offset = 0 }) {
  const words = String(text).split(" ");

  return words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span
        data-reveal
        className={`inline-block ${className}`}
        style={{ transitionDelay: `${offset + i * step}ms` }}
      >
        {word}
      </span>
      {i < words.length - 1 ? " " : null}
    </Fragment>
  ));
}

export default memo(Words);
