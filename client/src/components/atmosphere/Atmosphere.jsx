import { memo } from "react";
import GoldAurora from "./GoldAurora";
import GoldRibbons from "./GoldRibbons";
import GoldDust from "./GoldDust";
import Sparkles from "../fx/Sparkles";

/**
 * The world the site sits in. One fixed stack behind every section, so the
 * page reads as a single continuous environment rather than as a run of
 * sections that each brought their own background.
 *
 * Bottom to top:
 *   1  warm near-black foundation
 *   2  graphite depth, off-centre so the frame is not evenly lit
 *   3  a large blurred key light
 *   4  the aurora
 *   5  light ribbons
 *   6  metallic dust and glints
 *   7  bloom pooling low in the frame
 *   8  vignette + film grain
 *
 * Reduced motion keeps every layer and stops all of them: the room still looks
 * lit, it just stops moving. Phones get a thinner dust field, which is the only
 * layer with a real per-frame cost.
 */
function Atmosphere({ env }) {
  const still = env.reducedMotion;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-ink" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(118% 80% at 22% 8%, #16131c 0%, #0a0810 44%, #07060a 78%)",
        }}
      />

      <div
        className={`absolute -top-[26%] left-[46%] aspect-square w-[120vmax] -translate-x-1/2 ${
          still ? "" : "animate-glow-breathe"
        }`}
        style={{
          background:
            "radial-gradient(closest-side, rgba(200,164,92,0.13) 0%, rgba(138,109,51,0.05) 46%, transparent 74%)",
        }}
      />

      <GoldAurora still={still} intensity={0.9} />

      {/* Ribbons at a quarter strength. At full opacity they drew two bright
          gold curves straight across the headline and the portrait, which is
          the first thing that made the page look decorated rather than lit. */}
      <GoldRibbons still={still} className="opacity-25" />

      {still ? null : (
        <>
          <GoldDust count={env.isMobile ? 18 : 40} className="opacity-70" />
          <Sparkles count={env.isMobile ? 10 : 22} seed={101} className="opacity-70" />
        </>
      )}

      {/* Volumetric bloom pooling low in the frame — it gives the black a floor
          and stops the lower half reading as empty. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55vh]"
        style={{
          background:
            "radial-gradient(70% 100% at 50% 120%, rgba(200,164,92,0.11) 0%, rgba(138,109,51,0.04) 44%, transparent 76%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(126% 92% at 50% 40%, transparent 26%, rgba(7,6,10,0.9) 100%)",
        }}
      />

      {/* Grain. Kills banding across the large black fields, which is what
          separates a lit black from a flat #000. */}
      <div
        className="absolute inset-0 opacity-[0.4] mix-blend-overlay"
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
