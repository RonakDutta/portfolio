import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { alreadyCrossed, markCrossed } from "../lib/threshold";
import { field, primaryEclipse } from "../lib/eclipse";

gsap.registerPlugin(ScrollTrigger);

const FLOOR_MS = 1500;
const CEILING_MS = 4200;

/**
 * Drives the overture `index.html` painted.
 *
 * The moon creeps across a bare sun while the faces load. At totality the last
 * bead of sunlight flares on the limb, the room goes dark around the eclipse,
 * and the eclipse itself flies to wherever the hero has put its own, lands on
 * it exactly, and lets the live corona erupt out of it.
 *
 * Once per session. A returning visitor gets a plain fade.
 */
export default function Curtain({ env }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const gate = document.getElementById("curtain");

    const wake = (duration) => {
      root.classList.remove("ecl-pending");
      gsap.fromTo(field, { awake: 0 }, { awake: 1, duration, ease: "power2.out" });
    };

    if (!gate) {
      root.classList.remove("ecl-pending");
      return undefined;
    }

    const stage = gate.querySelector("#cu-stage");
    const sun = gate.querySelector("#cu-sun");
    const halo = gate.querySelector("#cu-halo");
    const diamond = gate.querySelector("#cu-diamond");
    const count = gate.querySelector("#cu-count");
    const phase = gate.querySelector("#cu-phase");
    const rows = gate.querySelectorAll(".cu-row");

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    let done = false;
    const teardown = () => {
      if (done) return;
      done = true;
      gate.remove();
      root.style.removeProperty("overflow");
      window.__lenis?.start();
      markCrossed();
      ScrollTrigger.refresh();
    };

    if (alreadyCrossed() || env.reducedMotion) {
      wake(env.reducedMotion ? 0.01 : 1.2);
      gsap.to(gate, {
        opacity: 0,
        duration: env.reducedMotion ? 0.2 : 0.45,
        ease: "power2.out",
        onComplete: teardown,
      });
      return undefined;
    }

    field.awake = 0;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);
    window.__lenis?.stop();

    let raf = 0;
    let shown = 0;
    let fontsReady = false;

    // Pick up wherever the CSS creep had reached, so the moon never slides back.
    const creep = parseFloat(getComputedStyle(stage).getPropertyValue("--p"));
    if (Number.isFinite(creep)) shown = creep;
    stage.style.animation = "none";

    const paint = (value) => {
      stage.style.setProperty("--p", value.toFixed(4));
      count.textContent = String(Math.round(value * 100)).padStart(3, "0");
      // The last bead of sunlight on the limb.
      diamond.style.opacity = String(Math.max(0, Math.min(1, (value - 0.86) / 0.1)));
    };
    paint(shown);

    const land = () => {
      const target = primaryEclipse();
      const from = stage.getBoundingClientRect();
      const to = target?.anchor.getBoundingClientRect();
      const tl = gsap.timeline({ onComplete: teardown });

      tl.to(diamond, { scale: 1.6, opacity: 1, duration: 0.18, ease: "power2.out" })
        .to(diamond, { scale: 0.2, opacity: 0, duration: 0.55, ease: "power3.in" })
        .set(sun, { opacity: 0 })
        .add(() => {
          phase.textContent = "Totality";
        }, 0.2)
        .to(rows, { opacity: 0, y: 8, duration: 0.6, ease: "power2.in", stagger: 0.05 }, 0.35)
        .to(gate, { backgroundColor: "rgba(7,6,10,0)", duration: 1.1, ease: "power2.inOut" }, 0.55);

      if (to && to.width) {
        tl.to(
          stage,
          {
            x: to.left + to.width / 2 - (from.left + from.width / 2),
            y: to.top + to.height / 2 - (from.top + from.height / 2),
            scale: to.width / from.width,
            duration: 1.25,
            ease: "expo.inOut",
          },
          0.55,
        );
      }

      // The hero starts arriving while the eclipse is still in flight.
      tl.add(markCrossed, 1.05)
        .add(() => wake(1.9), 1.75)
        .to(halo, { opacity: 0, duration: 1.4, ease: "power2.out" }, 1.75)
        .set(stage, { opacity: 0 }, 1.95);
    };

    const started = performance.now();
    const tick = () => {
      const elapsed = performance.now() - started;
      const target = fontsReady || elapsed >= CEILING_MS ? 1 : 0.7;
      shown += (target - shown) * 0.045;
      if (target === 1 && elapsed >= FLOOR_MS && shown > 0.996) {
        paint(1);
        land();
        return;
      }
      paint(shown);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      fontsReady = true;
    });

    return () => {
      cancelAnimationFrame(raf);
      if (!done) {
        root.style.removeProperty("overflow");
        window.__lenis?.start();
      }
    };
  }, [env.reducedMotion]);

  return null;
}
