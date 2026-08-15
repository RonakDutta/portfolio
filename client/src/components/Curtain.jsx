import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { alreadyCrossed, markCrossed } from "../lib/threshold";

gsap.registerPlugin(ScrollTrigger);

const FLOOR_MS = 1100;
const CEILING_MS = 4000;

/**
 * Drives the curtain that `index.html` painted, then removes it.
 *
 * It holds until fonts are ready, so the display serif never swaps in front of
 * the visitor, and it opens once per session — a returning visitor gets a plain
 * fade rather than the performance again.
 */
export default function Curtain({ env }) {
  useLayoutEffect(() => {
    const gate = document.getElementById("curtain");
    if (!gate) return;

    const fill = gate.querySelector("#cu-fill");
    const core = gate.querySelector(".cu-core");
    const seam = gate.querySelector("#cu-seam");
    const halves = gate.querySelectorAll(".cu-half");

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    let done = false;

    const teardown = () => {
      if (done) return;
      done = true;
      gate.remove();
      document.documentElement.style.removeProperty("overflow");
      window.__lenis?.start();
      markCrossed();
      ScrollTrigger.refresh();
    };

    if (alreadyCrossed() || env.reducedMotion) {
      gsap.to(gate, {
        opacity: 0,
        duration: env.reducedMotion ? 0.2 : 0.35,
        ease: "power2.out",
        onComplete: teardown,
      });
      return;
    }

    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);
    window.__lenis?.stop();

    let raf = 0;
    let shown = 0;
    let fontsReady = false;

    try {
      const creep = new DOMMatrixReadOnly(getComputedStyle(fill).transform).a;
      if (Number.isFinite(creep)) shown = creep;
    } catch {
      shown = 0;
    }
    fill.style.animation = "none";
    gsap.set(fill, { scaleX: shown });

    const open = () => {
      cancelAnimationFrame(raf);

      gsap
        .timeline({ onComplete: teardown })
        .to(fill, { scaleX: 1, duration: 0.35, ease: "power2.out" })
        .to(core, { opacity: 0, y: -10, duration: 0.5, ease: "power2.in" }, 0.2)
        .fromTo(
          seam,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" },
          0.4,
        )
        .to(seam, { opacity: 0, duration: 0.6, ease: "power2.in" }, 0.85)
        // Heavy, slow parting. The whole tone of the site is set here.
        .to(halves[0], { xPercent: -100, duration: 1.5, ease: "expo.inOut" }, 0.6)
        .to(halves[1], { xPercent: 100, duration: 1.5, ease: "expo.inOut" }, 0.6)
        .add(markCrossed, 1.1);
    };

    const started = performance.now();

    const tick = () => {
      const elapsed = performance.now() - started;
      const target = fontsReady || elapsed >= CEILING_MS ? 1 : 0.55;

      shown += (target - shown) * 0.07;
      gsap.set(fill, { scaleX: shown });

      if (target === 1 && elapsed >= FLOOR_MS) {
        open();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      fontsReady = true;
    });

    return () => {
      cancelAnimationFrame(raf);
      if (!done) {
        document.documentElement.style.removeProperty("overflow");
        window.__lenis?.start();
      }
    };
  }, [env.reducedMotion]);

  return null;
}
