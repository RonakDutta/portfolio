import { memo } from "react";
import { motion } from "framer-motion";

const fillVariants = {
  cold: { scaleY: 0, opacity: 0 },
  hot: { scaleY: 1, opacity: 1 },
};

const glowVariants = {
  cold: { opacity: 0 },
  hot: { opacity: 1 },
};

const labelVariants = {
  cold: { color: "#ddd3c4" },
  hot: { color: "#05030a" },
};

const containerVariants = {
  cold: { y: 0 },
  hot: { y: -3 },
};

const SPRING = { type: "spring", stiffness: 500, damping: 25, mass: 0.5 };

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
  const isGhost = variant === "ghost";
  const transition = reducedMotion ? { duration: 0 } : SPRING;

  return (
    <Tag
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      initial="cold"
      whileHover="hot"
      whileFocus="hot"
      whileTap={reducedMotion ? undefined : { scale: 0.95 }}
      variants={containerVariants}
      transition={transition}
      className={`group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden px-10 py-5
        font-display text-xs font-black tracking-[0.35em] uppercase transition-colors duration-300 rounded-sm cursor-pointer
        ${isGhost ? "border border-iron/90 hover:border-ember" : "border border-ember/70 hover:border-hellfire"}
        ${className}`}
      {...rest}
    >
      {/* Dark cold iron base */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-gradient-to-b from-[#1c1524] via-obsidian to-[#08050e]"
      />

      {/* Fiery molten lava fill rising from the bottom */}
      <motion.span
        aria-hidden="true"
        variants={fillVariants}
        transition={transition}
        style={{ originY: 1 }}
        className="animate-fire-lava absolute inset-0 -z-10 bg-gradient-to-tr from-[#8a0f16] via-[#ff4d00] to-[#ffc061]"
      />

      {/* Intense infernal glow shadow surrounding the button */}
      <motion.span
        aria-hidden="true"
        variants={glowVariants}
        transition={transition}
        className="pointer-events-none absolute inset-0 -z-30 rounded-sm"
        style={{
          boxShadow:
            "0 0 50px 12px rgba(255, 77, 0, 0.85), 0 0 100px 30px rgba(255, 192, 97, 0.4), inset 0 0 25px rgba(255, 255, 255, 0.6)",
        }}
      />

      {/* Inner glowing fire border frame */}
      <motion.span
        aria-hidden="true"
        variants={glowVariants}
        transition={transition}
        className="pointer-events-none absolute inset-0 border-2 border-hellfire opacity-0 group-hover:opacity-100 transition-opacity"
      />

      {/* Floating sparks/embers floating up on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1 left-4 h-1.5 w-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 group-hover:animate-spark"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 right-6 h-2 w-2 rounded-full bg-hellfire opacity-0 group-hover:opacity-100 group-hover:animate-spark"
        style={{ animationDelay: "0.3s" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-1 w-1 rounded-full bg-ember opacity-0 group-hover:opacity-100 group-hover:animate-spark"
        style={{ animationDelay: "0.6s" }}
      />

      {/* Gothic Corner Notch Accents */}
      <span aria-hidden="true" className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-brimstone group-hover:border-void" />
      <span aria-hidden="true" className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-brimstone group-hover:border-void" />
      <span aria-hidden="true" className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-brimstone group-hover:border-void" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-brimstone group-hover:border-void" />

      {/* Button Text with Hot Illumination */}
      <motion.span
        variants={labelVariants}
        transition={transition}
        className="relative z-10 font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
      >
        {children}
      </motion.span>

      {/* Descent Arrow Icon */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 12 16"
        className="relative z-10 h-4 w-3.5"
        variants={reducedMotion ? undefined : { cold: { y: 0, scale: 1 }, hot: { y: 4, scale: 1.3 } }}
        transition={transition}
      >
        <path
          d="M6 0v13M1 8l5 6 5-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          className="text-brimstone group-hover:text-void transition-colors"
        />
      </motion.svg>
    </Tag>
  );
}

export default memo(MoltenButton);
