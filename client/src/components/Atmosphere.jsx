import { memo, useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * The room the eclipse hangs in.
 *
 * Underneath: the dark, faintly warmer toward the floor so the black has a
 * bottom to it. Over everything: film grain, which is what keeps a lit black
 * from banding into rings. And for a real pointer, the visitor's own aura: a
 * wide, low warm light that follows them around the dark.
 */
function Atmosphere({ env }) {
  const aura = useRef(null);

  useEffect(() => {
    const el = aura.current;
    if (!el || !env.pointerFx) return undefined;

    const xTo = gsap.quickTo(el, "x", { duration: 1.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 1.4, ease: "power3" });
    let shown = false;

    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(el, { opacity: 1, duration: 1.6, ease: "power2.out" });
      }
    };
    const leave = () => {
      shown = false;
      gsap.to(el, { opacity: 0, duration: 0.9, ease: "power2.out" });
    };

    gsap.set(el, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(el);
    };
  }, [env.pointerFx]);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[100lvh] overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 70% at 50% 118%, rgba(138,109,51,0.12) 0%, transparent 60%), radial-gradient(90% 60% at 50% -20%, rgba(29,26,34,0.9) 0%, transparent 70%)",
          }}
        />
        {env.pointerFx ? (
          <div
            ref={aura}
            className="absolute top-0 left-0 h-[46rem] w-[46rem] opacity-0 will-change-transform"
            style={{
              marginLeft: "-23rem",
              marginTop: "-23rem",
              background:
                "radial-gradient(closest-side, rgba(236,215,163,0.075) 0%, rgba(200,164,92,0.035) 45%, transparent 100%)",
            }}
          />
        ) : null}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] opacity-[0.11]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />
    </>
  );
}

export default memo(Atmosphere);
