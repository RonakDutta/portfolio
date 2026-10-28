import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * A paragraph that is read into the light. Every word starts in shadow and
 * comes up as the reader's scroll passes over it, so the line you are on is
 * always the brightest thing on the page.
 */
function LitText({ text, as: Tag = "p", still = false, className = "" }) {
  const root = useRef(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    if (still) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.current.querySelectorAll("[data-w]"),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: root.current,
            start: "top 82%",
            end: "bottom 52%",
            scrub: 0.4,
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, [still, text]);

  return (
    <Tag ref={root} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span data-w>{w}</span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </Tag>
  );
}

export default memo(LitText);
