import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { alreadyCrossed, markCrossed } from "../lib/threshold";

gsap.registerPlugin(ScrollTrigger);

const FLOOR_MS = 1200;
const CEILING_MS = 4000;

/**
 * Drives the overture that `index.html` painted, then removes it.
 *
 * It holds until the display faces are ready, so Fraunces and Ephesis never
 * swap in front of the visitor, and it performs once per session. A returning
 * visitor gets a plain fade instead of the whole show again.
 *
 * The exit is a single upward wipe rather than two halves parting: the sheet
 * leaves the way a page turns, and the hero is already sitting behind it.
 */
export default function Curtain({ env }) {
  useLayoutEffect(() => {
    const gate = document.getElementById("curtain");
    if (!gate) return;

    const fill = gate.querySelector("#cu-fill");
    const core = gate.querySelector(".cu-core");
    const count = gate.querySelector("#cu-count");

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

    // Pick up wherever the CSS creep animation had reached, so the bar never
    // jumps backwards at the moment JS takes over.
    try {
      const creep = new DOMMatrixReadOnly(getComputedStyle(fill).transform).a;
      if (Number.isFinite(creep)) shown = creep;
    } catch {
      shown = 0;
    }
    fill.style.animation = "none";
    gsap.set(fill, { scaleX: shown });

    const paint = (value) => {
      gsap.set(fill, { scaleX: value });
      count.textContent = String(Math.round(value * 100)).padStart(2, "0");
    };

    const open = () => {
      cancelAnimationFrame(raf);
      paint(1);

      gsap
        .timeline({ onComplete: teardown, defaults: { ease: "expo.inOut" } })
        .to(core, { yPercent: 60, opacity: 0, duration: 0.9, ease: "power2.in" })
        .fromTo(
          gate,
          { clipPath: "inset(0% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 100% 0%)", duration: 1.25 },
          0.15,
        )
        .add(markCrossed, 0.8);
    };

    const started = performance.now();

    const tick = () => {
      const elapsed = performance.now() - started;
      const target = fontsReady || elapsed >= CEILING_MS ? 1 : 0.62;

      shown += (target - shown) * 0.06;
      paint(shown);

      if (target === 1 && elapsed >= FLOOR_MS && shown > 0.985) {
        open();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      fontsReady = true;
      core.classList.add("is-ready");
    });
    // If the font API never settles, still show the name rather than an empty
    // sheet with a counter on it.
    const nameFallback = setTimeout(() => core.classList.add("is-ready"), 900);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(nameFallback);
      if (!done) {
        document.documentElement.style.removeProperty("overflow");
        window.__lenis?.start();
      }
    };
  }, [env.reducedMotion]);

  return null;
}
