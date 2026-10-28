import { memo } from "react";

const PATHS = {
  right: "M1 7h12M8 2l5 5-5 5",
  down: "M7 1v12M2 8l5 5 5-5",
  up: "M7 13V1M2 6l5-5 5 5",
  out: "M3 11L11 3M4.5 3H11v6.5",
  download: "M7 1v9M3 6.5l4 4 4-4M1.5 13h11",
};

const NUDGE = {
  right: "group-hover:translate-x-0.5",
  down: "group-hover:translate-y-0.5",
  up: "group-hover:-translate-y-0.5",
  out: "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
  download: "group-hover:translate-y-0.5",
};

export function Arrow({ dir = "right", className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 14 14"
      className={`h-3 w-3 shrink-0 transition-transform duration-500 ease-[var(--ease-cine)] ${NUDGE[dir]} ${className}`}
    >
      <path
        d={PATHS[dir]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The two actions on the page, each carrying a small eclipse.
 *
 * `gold` is a bar of light with a moon riding at its end; on hover the moon
 * swells until it has eclipsed the whole bar, and the label turns to gold in
 * the dark. `line` is the reverse: a dark bar with a sun at its end that rises
 * to flood it.
 */
function Button({ href, variant = "gold", arrow = "right", size = "md", className = "", children, ...rest }) {
  const Tag = href ? "a" : "button";
  const gold = variant === "gold";
  const pad = size === "lg" ? "h-[3.6rem] pl-7 pr-2" : "h-[3.1rem] pl-6 pr-1.5";
  const disc = size === "lg" ? "h-11 w-11" : "h-10 w-10";

  return (
    <Tag
      href={href}
      type={href ? undefined : rest.type || "button"}
      className={`group relative isolate inline-flex ${pad} items-center justify-between gap-6 overflow-hidden rounded-full
        text-[0.98rem] font-[560] tracking-[-0.005em] select-none
        transition-[color,box-shadow,transform] duration-700 ease-[var(--ease-cine)] active:scale-[0.98] ${
          gold
            ? "bg-[linear-gradient(110deg,#a8843f_0%,#d9b974_30%,#f3e2b6_55%,#c8a45c_100%)] text-ink shadow-[0_14px_44px_-14px_rgba(200,164,92,0.65)] hover:text-gold-lit"
            : "bg-ink/40 text-ivory ring-1 ring-inset ring-gold/35 hover:text-ink"
        } ${className}`}
      {...rest}
    >
      <span className="relative z-10">{children}</span>

      <span className={`relative grid ${disc} shrink-0 place-items-center`}>
        {/* The body that swells to cover the bar. */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-full transition-transform duration-[900ms] ease-[var(--ease-cine)] group-hover:scale-[16] ${
            gold ? "bg-ink" : "bg-[radial-gradient(circle,#fff6de_0%,#ecd7a3_45%,#c8a45c_100%)]"
          }`}
        />
        <Arrow dir={arrow} className={`relative z-10 ${gold ? "text-gold-lit" : "text-ink"}`} />
      </span>
    </Tag>
  );
}

export default memo(Button);
