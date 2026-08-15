import { memo } from "react";

/**
 * A stamped metal tag. Static — the only state change is the bronze edge
 * warming, and only on devices that actually have a cursor.
 */
function ForgedTag({ label, className = "" }) {
  return (
    <li
      className={`${className} surface-slab edge-bronze border border-iron/90 px-3 py-1.5
        font-mono text-[0.7rem] tracking-[0.06em] text-parchment
        transition-colors duration-300
        [@media(hover:hover)]:hover:border-bronze/45
        [@media(hover:hover)]:hover:text-bone`}
    >
      {label}
    </li>
  );
}

export default memo(ForgedTag);
