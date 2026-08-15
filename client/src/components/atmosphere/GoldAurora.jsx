import { memo } from "react";

/**
 * Golden aurora — the signature layer.
 *
 * Three very large, very soft gradient fields on independent slow cycles.
 * Each runs the full ramp (bronze -> gold -> champagne -> white-gold) from its
 * core outward, so where two fields overlap the value climbs and you get the
 * bright fold you see in illuminated silk. Heavy blur plus `screen` blending
 * is what turns three ellipses into smoke rather than three ellipses.
 *
 * Pure CSS: no canvas, no shader. It composites on the GPU and costs nothing
 * on the main thread, which is the only reason it can run for the whole page.
 */
const FIELDS = [
  {
    cls: "animate-aurora-a",
    style: {
      top: "-28%",
      left: "-10%",
      width: "78vw",
      height: "78vw",
      background:
        "radial-gradient(closest-side, rgba(255,245,199,0.22) 0%, rgba(212,175,55,0.13) 26%, rgba(140,101,8,0.06) 52%, transparent 76%)",
    },
  },
  {
    cls: "animate-aurora-b",
    style: {
      top: "6%",
      right: "-22%",
      width: "72vw",
      height: "72vw",
      background:
        "radial-gradient(closest-side, rgba(240,213,138,0.17) 0%, rgba(198,161,91,0.09) 30%, rgba(111,71,0,0.05) 58%, transparent 78%)",
    },
  },
  {
    cls: "animate-aurora-c",
    style: {
      bottom: "-34%",
      left: "18%",
      width: "88vw",
      height: "70vw",
      background:
        "radial-gradient(closest-side, rgba(255,217,102,0.11) 0%, rgba(140,101,8,0.06) 38%, transparent 72%)",
    },
  },
];

function GoldAurora({ still = false, intensity = 1 }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden mix-blend-screen"
      style={{ opacity: intensity }}
    >
      {FIELDS.map((f, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-[90px] sm:blur-[130px] ${still ? "" : f.cls}`}
          style={f.style}
        />
      ))}
    </div>
  );
}

export default memo(GoldAurora);
