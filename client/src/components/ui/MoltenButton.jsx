import { memo } from "react";
import { motion } from "framer-motion";

/**
 * Cold iron until you touch it.
 *
 * The ignite state is a variant rather than a `:hover` rule so keyboard focus
 * lights it identically — a hover-only effect would leave keyboard users with a
 * dead-looking button. Both states clear 4.5:1 against their own background:
 * bone on near-black cold, void on brimstone hot.
 *
 * Only opacity and transform animate. The glow is a pre-rendered shadow on its
 * own layer whose opacity is tweened, because animating box-shadow directly
 * repaints the element every frame.
 */

const fill = {
  cold: { scaleY: 0, opacity: 0 },
  hot: { scaleY: 1, opacity: 1 },
};

const glow = { cold: { opacity: 0 }, hot: { opacity: 1 } };
const label = { cold: { color: "#ddd3c4" }, hot: { color: "#0b0810" } };
const body = { cold: { y: 0 }, hot: { y: -2 } };

const SPRING = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 };

function MoltenButton({
  children,
  onClick,
  href,
  variant = "primary",
  reducedMotion = false,
  className = "",
  ...rest
}) {
  const Tag = href ? motion.a : motion.button;
  const ghost = variant === "ghost";
  const transition = reducedMotion ? { duration: 0 } : SPRING;

  return (
    <Tag
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      initial="cold"
      whileHover="hot"
      whileFocus="hot"
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      variants={body}
      transition={transition}
      className={`group relative isolate inline-flex items-center gap-3 overflow-hidden px-8 py-4
        font-display text-xs font-bold tracking-[0.28em] uppercase
        ${ghost ? "border border-iron/90" : "border border-ember/45"}
        ${className}`}
      {...rest}
    >
      {/* Cold body. Slight top sheen reads as a bevelled iron face. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-gradient-to-b from-obsidian to-[#0a070d]"
      />

      {/* Molten fill, rising from the base like metal reaching temperature. */}
      <motion.span
        aria-hidden="true"
        variants={fill}
        transition={transition}
        style={{ originY: 1 }}
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#ff2d00] via-ember to-brimstone"
      />

      {/* Heat haze. Opacity-only, so it composites instead of repainting. */}
      <motion.span
        aria-hidden="true"
        variants={glow}
        transition={transition}
        className="pointer-events-none absolute inset-0 -z-30"
        style={{ boxShadow: "0 0 34px 6px rgba(255,77,0,0.55)" }}
      />

      <motion.span variants={label} transition={transition} className="relative">
        {children}
      </motion.span>

      {/* Arrow doubles as a descent cue; it drops rather than points right. */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 12 16"
        className="relative h-3.5 w-3"
        variants={reducedMotion ? undefined : { cold: { y: 0 }, hot: { y: 3 } }}
        transition={transition}
      >
        <path
          d="M6 0v13M1 8l5 6 5-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="text-brimstone group-hover:text-void group-focus-visible:text-void"
        />
      </motion.svg>
    </Tag>
  );
}

export default memo(MoltenButton);
