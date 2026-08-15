import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setSection, SECTIONS } from "./store";

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll({ reducedMotion, isMobile }) {
  useEffect(() => {
    if (reducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: isMobile ? 0.9 : 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.95,
    });

    lenis.on("scroll", ScrollTrigger.update);

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

function navOffset() {
  const bar = document.querySelector("header nav");
  return bar ? -Math.round(bar.getBoundingClientRect().height) - 8 : 0;
}

export function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  if (window.__lenis) window.__lenis.scrollTo(target, { offset: navOffset(), duration: 1.4 });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });

if (target.tabIndex < 0) target.tabIndex = -1;
  target.focus({ preventScroll: true });
}
