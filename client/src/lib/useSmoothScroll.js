import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { frame, setSection, SECTIONS } from "./store";

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll({ reducedMotion, isMobile }) {
  useEffect(() => {
    if (reducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: isMobile ? 0.9 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.95,
    });

    lenis.on("scroll", (e) => {
      frame.scroll = e.progress ?? 0;
      frame.velocity = e.velocity ?? 0;
      ScrollTrigger.update();
    });

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reducedMotion, isMobile]);

  useEffect(() => {
    const triggers = SECTIONS.map((section, i) =>
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: ({ isActive }) => isActive && setSection(i),
      }),
    );

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(onLoad);

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("load", onLoad);
    };
  }, []);
}

/**
 * Height of the fixed chapter rail, measured rather than hard-coded, so the
 * offset stays right if the bar's padding or type size ever changes.
 */
function navOffset() {
  const bar = document.querySelector("header nav");
  return bar ? -Math.round(bar.getBoundingClientRect().height) - 8 : 0;
}

/**
 * Scroll to a section and hand it focus.
 *
 * The offset matters: landing a section flush with the viewport top puts its
 * heading underneath the fixed rail. The focus matters more. Without it a
 * keyboard user who activates a chapter link is moved visually but their tab
 * position stays back in the nav, so the next Tab returns them to where they
 * started instead of into the section they asked for.
 */
export function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  if (window.__lenis) window.__lenis.scrollTo(target, { offset: navOffset(), duration: 1.4 });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });

  // preventScroll, or the browser jumps to the element and undoes the tween.
  if (target.tabIndex < 0) target.tabIndex = -1;
  target.focus({ preventScroll: true });
}
