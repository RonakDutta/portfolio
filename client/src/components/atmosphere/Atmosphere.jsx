import { memo } from "react";
import GoldAurora from "./GoldAurora";
import GoldRibbons from "./GoldRibbons";
import GoldDust from "./GoldDust";

/**
 * The world the site sits in. One fixed stack behind every section, so the
 * page reads as a single continuous environment rather than as a run of
 * sections that each brought their own background.
 *
 * Bottom to top:
 *   1  near-black foundation
 *   2  graphite depth, off-centre so the frame is not evenly lit
 *   3  a large blurred key light
 *   4  the aurora
 *   5  light ribbons
 *   6  metallic dust
 *   7  bloom over the lower half
 *   8  vignette + film grain
 *
 * Reduced motion keeps every layer and stops all of them: the room still
 * looks lit, it just stops moving. Low-tier devices drop the dust and the
 * ribbons, which are the only two layers with a real cost.
 */
function Atmosphere({ env }) {
  const still = env.reducedMotion;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-void" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 78% at 24% 10%, #0f0f0f 0%, #070707 42%, #010101 76%)",
        }}
      />

      <div
        className={`absolute -top-[24%] left-[46%] aspect-square w-[120vmax] -translate-x-1/2 blur-[100px] ${
          still ? "" : "animate-glow-breathe"
        }`}
        style={{
          background:
            "radial-gradient(closest-side, rgba(212,175,55,0.12) 0%, rgba(111,71,0,0.05) 44%, transparent 74%)",
        }}
      />

      <GoldAurora still={still} intensity={env.lightweight ? 0.7 : 1} />

      {env.lightweight ? null : <GoldRibbons still={still} />}

      {env.lightweight || still ? null : (
        <GoldDust count={env.isMobile ? 22 : 46} className="opacity-70" />
      )}

      {/* Volumetric bloom pooling low in the frame — it gives the black a
          floor and stops the lower half reading as empty. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55vh] blur-[70px]"
        style={{
          background:
            "radial-gradient(70% 100% at 50% 120%, rgba(198,161,91,0.1) 0%, rgba(111,71,0,0.04) 44%, transparent 76%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(128% 92% at 50% 40%, transparent 28%, rgba(1,1,1,0.86) 100%)",
        }}
      />

      {/* Grain. Kills banding across the large black fields, which is what
          separates a lit black from a flat #000. */}
      <div
        className="absolute inset-0 opacity-[0.42] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.34'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />
    </div>
  );
}

export default memo(Atmosphere);
