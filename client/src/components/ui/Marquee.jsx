import { memo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * A slow ticker of the things I actually build with.
 *
 * The row is rendered twice and translated by exactly -50%, which is what makes
 * the loop seamless: at the end of the cycle copy two is sitting precisely
 * where copy one started.
 *
 * It answers the scroll. A flick of the wheel throws the row forward and it
 * coasts back to its resting pace, which is what makes it feel like part of
 * the page rather than a GIF pinned to it. Hovering slows it to a stop. It is
 * paused outright while off screen, and reduced motion leaves a legible
 * static row.
 */
function Marquee({ items, duration = 46, still = false, className = "" }) {
  const track = useRef(null);
  const run = [...items, ...items];

  useEffect(() => {
    const el = track.current;
    if (!el || still) return;

    const loop = gsap.to(el, {
      xPercent: -50,
      duration,
      ease: "none",
      repeat: -1,
    });

    let rest = 1;
    const coast = (to, d = 1.4) =>
      gsap.to(loop, { timeScale: to, duration: d, ease: "power3.out", overwrite: true });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: ({ isActive }) => (isActive ? loop.resume() : loop.pause()),
      onUpdate: (self) => {
        const v = Math.abs(self.getVelocity());
        if (v < 40 || rest === 0) return;
        const boost = Math.min(1 + v / 260, 7);
        // Only ever throw it harder, never cut a coast short, and only build
        // a new coast when the throw actually changed.
        if (boost <= loop.timeScale() + 0.25) return;
        loop.timeScale(boost);
        coast(rest);
      },
    });

    const host = el.parentElement;
    const hold = () => {
      rest = 0;
      coast(0, 0.9);
    };
    const free = () => {
      rest = 1;
      coast(1, 1.1);
    };
    host.addEventListener("pointerenter", hold);
    host.addEventListener("pointerleave", free);

    return () => {
      host.removeEventListener("pointerenter", hold);
      host.removeEventListener("pointerleave", free);
      st.kill();
      gsap.killTweensOf(loop);
      loop.kill();
      gsap.set(el, { clearProps: "transform" });
    };
  }, [duration, still]);

  return (
    <div
      className={`relative flex overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <ul
        ref={track}
        className="flex w-max shrink-0 items-center gap-10 pr-10 will-change-transform sm:gap-16 sm:pr-16"
      >
        {run.map((item, i) => (
          <li
            key={`${item}-${i}`}
            aria-hidden={i >= items.length ? "true" : undefined}
            className="flex shrink-0 items-center gap-10 sm:gap-16"
          >
            <span className="font-display text-[1.4rem] leading-none font-normal whitespace-nowrap text-pearl/70 sm:text-[1.9rem]">
              {item}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-2.5 w-2.5 shrink-0 fill-brass/70"
            >
              <path d="M8 0 Q 8.9 7.1 16 8 Q 8.9 8.9 8 16 Q 7.1 8.9 0 8 Q 7.1 7.1 8 0 Z" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(Marquee);
