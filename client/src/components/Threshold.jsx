import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { alreadyCrossed, markCrossed, onSceneReady } from "../lib/threshold";

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives the gate declared in index.html, then takes it down.
 *
 * This component renders nothing. The nodes it animates were painted by the
 * HTML parser before React existed, which is the only way to be certain there
 * is no black frame between the browser showing the document and the app
 * mounting. Adopting them costs one querySelector; rendering our own copy
 * would cost exactly the flash we are here to prevent.
 *
 * What it waits for is real work, not a timer dressed up as one: the webfonts
 * resolving and the canvas reporting a drawn frame. The floor exists only so a
 * warm cache does not flash the door open in 200 ms, and the ceiling exists so
 * a machine with no WebGL at all is never held behind it.
 */

/** How much of the bar each milestone is worth. */
const WEIGHT = { boot: 0.14, fonts: 0.3, scene: 0.42, floor: 0.14 };

/** Shortest the gate may stay shut, so the sigil finishes striking. */
const FLOOR_MS = 1500;

/** Longest it may stay shut, whatever has or has not reported in. */
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

    // A reload part-way down the page should still start at the gate rather
    // than opening onto chamber four.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    let done = false;

    const teardown = () => {
      if (done) return;
      done = true;
      gate.remove();
      document.documentElement.style.removeProperty("overflow");
      window.__lenis?.start();
      markCrossed();
      // Fonts and the removed gate both move the document; every trigger on
      // the page was measured against the old layout.
      ScrollTrigger.refresh();
    };

    // Been through this tab already, or motion is unwelcome: take the door
    // down rather than perform it.
    if (alreadyCrossed() || env.reducedMotion) {
      gsap.to(gate, {
        opacity: 0,
        duration: env.reducedMotion ? 0.2 : 0.4,
        ease: "power2.out",
        onComplete: teardown,
      });
      return;
    }

    // Nothing scrolls while the gate is shut. Lenis is started by its own
    // effect and may not exist yet, so the overflow lock is what actually
    // holds; stopping Lenis is belt and braces for when it arrives first.
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

    // The CSS creep in the head has been running since first paint. Hand its
    // current value to GSAP before killing the animation, or the bar snaps
    // back to zero the moment we take over.
    //
    // Guarded, because DOMMatrix throws on "none" rather than returning an
    // identity, and a throw inside a layout effect takes the whole app down
    // with it. Starting the bar from zero is a cosmetic loss; failing to
    // mount is not.
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
        // The mark flares and is gone, the way a seal breaks.
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
        // Heat escaping the join a beat before the leaves actually move.
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
        // Released while the leaves are still travelling, not after they have
        // gone. The hero's entrance takes about a second; starting it when the
        // gap is a third open means the name is rising into the widening gap
        // instead of appearing in an empty frame the doors have already left.
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
      // Ease toward the milestone rather than jumping to it, so the bar reads
      // as something filling up instead of a set of steps.
      shown += (to - shown) * 0.08;
      paint();

      if (to >= 1 && elapsed >= FLOOR_MS) {
        open();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    // ── Milestones ────────────────────────────────────────────────────────
    const fonts = document.fonts?.ready ?? Promise.resolve();
    fonts.then(() => {
      reached.fonts = true;
    });

    // With no canvas coming there is nothing to wait on, and holding the gate
    // for a scene that will never report would strand reduced-motion and
    // WebGL-less visitors behind it for the full ceiling.
    const stopWaiting = env.enable3D
      ? onSceneReady(() => {
          reached.scene = true;
        })
      : ((reached.scene = true), () => {});

    return () => {
      cancelAnimationFrame(raf);
      stopWaiting();
      // StrictMode remounts this in development. Leaving the lock on would
      // freeze the page against a gate that is no longer being driven.
      if (!done) {
        document.documentElement.style.removeProperty("overflow");
        window.__lenis?.start();
      }
    };
  }, [env.reducedMotion, env.enable3D]);

  return null;
}
