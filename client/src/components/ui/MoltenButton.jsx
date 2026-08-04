import { memo } from "react";
import { motion } from "framer-motion";

const fill = {
  cold: { scaleY: 0, opacity: 0 },
  hot: { scaleY: 1, opacity: 1 },
};

const glow = { cold: { opacity: 0 }, hot: { opacity: 1 } };
const label = { cold: { color: "#ddd3c4" }, hot: { color: "#0b0810" } };
const body = { cold: { y: 0 }, hot: { y: -2 } };

const SPRING = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 };

const SPARKS = [
  { left: "14%", dx: "-9px", delay: "0s", dur: "1.35s" },
  { left: "31%", dx: "6px", delay: "0.32s", dur: "1.6s" },
  { left: "52%", dx: "-4px", delay: "0.66s", dur: "1.25s" },
  { left: "71%", dx: "10px", delay: "0.18s", dur: "1.75s" },
  { left: "88%", dx: "-7px", delay: "0.85s", dur: "1.45s" },
];

const FLAMES = [
  {
    tile: 36,
    height: 22,
    duration: "1.9s",
    direction: "normal",
    opacity: 0.85,
    stops: "#fff3d6 0%, rgba(255,196,90,0.72) 42%, transparent 70%",
    fade: "46%",
  },
  {
    tile: 23,
    height: 14,
    duration: "2.9s",
    direction: "reverse",
    opacity: 0.7,
    stops: "#fffaf0 0%, rgba(255,222,150,0.6) 38%, transparent 68%",
    fade: "34%",
  },
];

const IGNITE =
  "opacity-0 [animation-play-state:paused] transition-opacity duration-200 " +
  "group-hover:[animation-play-state:running] group-focus-visible:[animation-play-state:running]";

function MoltenButton({
  children,
  onClick,
  href,
  variant = "primary",
  reducedMotion = false,
  showArrow = true,
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
      className={`group relative isolate inline-flex items-center gap-3 px-8 py-4
        font-display text-xs font-bold tracking-[0.28em] uppercase
        ${ghost ? "border border-iron/90" : "border border-ember/45"}
        ${className}`}
      {...rest}
    >
      {}
      <span aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        {}
        <span className="absolute inset-0 bg-gradient-to-b from-obsidian to-[#0a070d]" />

        {}
        <motion.span
          variants={fill}
          transition={transition}
          style={{ originY: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-[#ff2d00] via-ember to-brimstone"
        />

        {}
        {FLAMES.map((f) => (
          <span
            key={f.tile}
            className={`animate-flame-drift absolute bottom-0 left-0 h-full ${IGNITE} group-hover:opacity-(--lit) group-focus-visible:opacity-(--lit)`}
            style={{
              "--tile": `${f.tile}px`,
              "--lit": f.opacity,
              width: `calc(100% + ${f.tile}px)`,
              animationDuration: f.duration,
              animationDirection: f.direction,
              backgroundImage: `radial-gradient(ellipse ${f.tile * 0.3}px ${f.height}px at 50% 100%, ${f.stops})`,
              backgroundSize: `${f.tile}px 100%`,
              backgroundRepeat: "repeat-x",
              maskImage: `linear-gradient(to top, #000 0%, #000 10%, transparent ${f.fade})`,
              WebkitMaskImage: `linear-gradient(to top, #000 0%, #000 10%, transparent ${f.fade})`,
            }}
          />
        ))}
      </span>

      {}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-0">
        {SPARKS.map((s) => (
          <span
            key={s.left}
            className={`animate-ember-rise absolute h-1 w-1 rounded-full bg-hellfire ${IGNITE} group-hover:opacity-100 group-focus-visible:opacity-100`}
            style={{
              left: s.left,
              animationDelay: s.delay,
              animationDuration: s.dur,
              "--dx": s.dx,
              boxShadow: "0 0 6px 2px rgba(255,138,31,0.75)",
            }}
          />
        ))}
      </span>

      {}
      <motion.span
        aria-hidden="true"
        variants={glow}
        transition={transition}
        className="pointer-events-none absolute inset-0 -z-20 group-hover:animate-flicker group-focus-visible:animate-flicker"
        style={{ boxShadow: "0 0 34px 6px rgba(255,77,0,0.55)" }}
      />

      <motion.span variants={label} transition={transition} className="relative">
        {children}
      </motion.span>

      {showArrow ? (
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
      ) : null}
    </Tag>
  );
}

export default memo(MoltenButton);
