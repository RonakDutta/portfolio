/**
 * Scroll reveals.
 *
 * The previous approach hid every section's content with `gsap.from({opacity:0})`
 * and relied on a ScrollTrigger firing to bring it back. When a trigger did not
 * fire — stale positions after the curtain changed the document height, a
 * scroll the smooth-scroller did not emit for — the content stayed at opacity 0
 * permanently. Several sections shipped invisible.
 *
 * This inverts the failure mode. Content is visible in CSS by default. The
 * hidden state is only applied once JS has confirmed it can observe elements,
 * and a failsafe reveals everything unconditionally after a few seconds. Any
 * failure now leaves the page readable rather than blank.
 */
const HIDE_CLASS = "js-reveal";
const IN_CLASS = "is-in";
const FAILSAFE_MS = 3000;

export function initReveals({ reducedMotion = false } = {}) {
  const root = document.documentElement;
  const nodes = () => document.querySelectorAll("[data-reveal]");

  const showAll = () => {
    for (const el of nodes()) el.classList.add(IN_CLASS);
  };

  // No animation wanted, or no observer available: render everything at rest.
  if (reducedMotion || typeof IntersectionObserver === "undefined") {
    root.classList.remove(HIDE_CLASS);
    showAll();
    return () => {};
  }

  root.classList.add(HIDE_CLASS);

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add(IN_CLASS);
        observer.unobserve(entry.target);
      }
    },
    // Fire a little before the element reaches the viewport so the motion has
    // finished by the time it is properly in view.
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
  );

  for (const el of nodes()) observer.observe(el);

  // Anything still hidden after this has failed to be observed for some
  // reason. Content wins over choreography.
  const failsafe = setTimeout(showAll, FAILSAFE_MS);

  return () => {
    clearTimeout(failsafe);
    observer.disconnect();
    root.classList.remove(HIDE_CLASS);
  };
}

/** Stagger helper: turns an index into a transition-delay style object. */
export const revealDelay = (i, step = 70) => ({
  transitionDelay: `${i * step}ms`,
});
