import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { alreadyCrossed, markCrossed, onSceneReady } from "../lib/threshold";

gsap.registerPlugin(ScrollTrigger);

const WEIGHT = { boot: 0.14, fonts: 0.3, scene: 0.42, floor: 0.14 };

const FLOOR_MS = 1500;

const CEILING_MS = 6000;

export default function Threshold({ env }) {
  useLayoutEffect(() => {
    const gate = document.getElementById("threshold");
    if (!gate) return;

    const fill = gate.querySelector("#th-fill");
    const core = gate.querySelector(".th-core");
    const seam = gate.querySelector("#th-seam");
    const halves = gate.querySelectorAll(".th-half");
    const sigil = gate.querySelector(".th-sigil");

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
        duration: env.reducedMotion ? 0.2 : 0.4,
        ease: "power2.out",
        onComplete: teardown,
      });
      return;
    }

document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);
    window.__lenis?.stop();

    const reached = { boot: true, fonts: false, scene: false, floor: false };
    let shown = 0;
    let raf = 0;

    const target = () =>
      Object.keys(WEIGHT).reduce(
        (sum, key) => sum + (reached[key] ? WEIGHT[key] : 0),
        0,
      );

    const paint = () => {
      gsap.set(fill, { scaleX: shown });
    };

try {
      const creep = new DOMMatrixReadOnly(getComputedStyle(fill).transform).a;
      if (Number.isFinite(creep)) shown = creep;
    } catch {
      shown = 0;
    }
    fill.style.animation = "none";
    paint();

    const open = () => {
      cancelAnimationFrame(raf);

      const tl = gsap.timeline({ onComplete: teardown });

      tl.to(fill, { scaleX: 1, duration: 0.3, ease: "power2.out" })
        
        .to(
          sigil,
          { scale: 1.22, opacity: 0, duration: 0.55, ease: "power2.in" },
          0.15,
        )
        .to(
          core,
          { opacity: 0, y: -14, duration: 0.45, ease: "power2.in" },
          0.28,
        )
        
        .fromTo(
          seam,
          { opacity: 0.5, scaleX: 1 },
          { opacity: 1, scaleX: 26, duration: 0.5, ease: "power2.out" },
          0.4,
        )
        .to(seam, { opacity: 0, duration: 0.5, ease: "power2.in" }, 0.75)
        .to(
          halves[0],
          { xPercent: -100, duration: 1.15, ease: "power3.inOut" },
          0.55,
        )
        .to(
          halves[1],
          { xPercent: 100, duration: 1.15, ease: "power3.inOut" },
          0.55,
        )

.add(markCrossed, 0.9);
    };

    const started = performance.now();

    const tick = () => {
      const elapsed = performance.now() - started;
      if (elapsed >= FLOOR_MS) reached.floor = true;
      if (elapsed >= CEILING_MS) {
        reached.fonts = true;
        reached.scene = true;
      }

      const to = target();

shown += (to - shown) * 0.08;
      paint();

      if (to >= 1 && elapsed >= FLOOR_MS) {
        open();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

const fonts = document.fonts?.ready ?? Promise.resolve();
    fonts.then(() => {
      reached.fonts = true;
    });

const stopWaiting = env.enable3D
      ? onSceneReady(() => {
          reached.scene = true;
        })
      : ((reached.scene = true), () => {});

    return () => {
      cancelAnimationFrame(raf);
      stopWaiting();

if (!done) {
        document.documentElement.style.removeProperty("overflow");
        window.__lenis?.start();
      }
    };
  }, [env.reducedMotion, env.enable3D]);

  return null;
}
