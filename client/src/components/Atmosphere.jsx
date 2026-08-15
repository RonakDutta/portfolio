import { memo } from "react";

/**
 * The room the site sits in. Three fixed layers, no canvas and no WebGL:
 * a slow champagne key light, a vignette, and film grain.
 *
 * This replaces the old three.js scene outright. It costs roughly nothing,
 * runs entirely on the compositor, and reads closer to a lit studio than a
 * shader ever did.
 */
function Atmosphere({ env }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-ink" />

      {/* Key light, high and off-centre. The only warm thing on the page
          besides the gold rules. */}
      <div
        className={`absolute -top-[20%] left-[52%] aspect-square w-[130vmax] -translate-x-1/2
          ${env.reducedMotion ? "" : "animate-light-drift"}`}
        style={{
          background:
            "radial-gradient(closest-side, rgba(176,141,69,0.085) 0%, rgba(111,84,42,0.035) 42%, transparent 72%)",
        }}
      />

      {/* A second, colder bounce low and left, so the frame is not lit from
          one source only. */}
      <div
        className="absolute -bottom-[30%] -left-[10%] aspect-square w-[90vmax]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(232,227,216,0.035) 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 90% at 50% 40%, transparent 34%, rgba(2,2,2,0.72) 100%)",
        }}
      />

      {/* Grain. Static, tiled, and very faint — enough to kill banding in the
          large black fields and to stop them looking like flat #000 fill. */}
      <div
        className="absolute inset-0 opacity-[0.5] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.32'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
        }}
      />
    </div>
  );
}

export default memo(Atmosphere);
