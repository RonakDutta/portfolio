import { memo } from "react";

/**
 * Golden aurora, the signature layer.
 *
 * Three very large, very soft gradient fields on independent slow cycles.
 * Each runs the full ramp (bronze -> gold -> champagne -> white-gold) from its
 * core outward, so where two fields overlap the value climbs and you get the
 * bright fold you see in illuminated silk. Heavy blur plus `screen` blending
 * is what turns three ellipses into smoke rather than three ellipses.
 *
 * Pure CSS: no canvas, no shader. It composites on the GPU and costs nothing
 * on the main thread, which is the only reason it can run for the whole page.
 *
 * These blend normally rather than with `screen`. Over a near-black stage the
 * two are almost indistinguishable, and `screen` on a full-viewport layer
 * makes the compositor re-read the backdrop on every frame the fields move,
 * which measured at roughly one dropped frame per scroll tick on a throttled
 * phone.
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
        "radial-gradient(closest-side, rgba(255,246,222,0.22) 0%, rgba(200,164,92,0.13) 26%, rgba(138,109,51,0.06) 52%, transparent 76%)",
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
        "radial-gradient(closest-side, rgba(236,215,163,0.17) 0%, rgba(200,164,92,0.09) 30%, rgba(112,88,40,0.05) 58%, transparent 78%)",
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
        "radial-gradient(closest-side, rgba(236,215,163,0.11) 0%, rgba(138,109,51,0.06) 38%, transparent 72%)",
    },
  },
];

function GoldAurora({ still = false, intensity = 1 }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{ opacity: intensity }}
    >
      {/* No blur filter here on purpose. These are radial gradients that
          already fade to transparent well inside their own box, so a 130px
          CSS blur added nothing visually and forced a very large surface to
          re-rasterise on every animation frame. `will-change` promotes each
          field to its own layer so the transform is composited, not painted. */}
      {FIELDS.map((f, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${still ? "" : f.cls}`}
          style={{
            ...f.style,
            willChange: still ? undefined : "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}

export default memo(GoldAurora);
