import { memo } from "react";

/**
 * One tool, struck as an iron tag hanging on a rack.
 *
 * Hover states are plain CSS transitions rather than Framer. There are twenty
 * of these on screen at once, and twenty motion components each subscribing to
 * their own state is real overhead for what is a colour change and a two-pixel
 * lift.
 *
 * The sheen is a skewed highlight parked off the left edge that sweeps across
 * on hover, which is what sells it as metal rather than a coloured rectangle.
 *
 * Not focusable, deliberately. These are labels, not controls: making them tab
 * stops would put nineteen dead stops between the visitor and the next real
 * link, which costs a keyboard user far more than the sheen gives them.
 */
function ForgedTag({ label, className = "" }) {
  return (
    <li
      className={`${className} clip-tag group/tag relative isolate overflow-hidden
        border border-iron/80 bg-gradient-to-b from-[#241d29] to-[#100c16]
        px-3.5 py-2 transition-[transform,border-color,box-shadow] duration-300
        hover:-translate-y-0.5 hover:border-ember/70 hover:shadow-[0_0_18px_-2px_rgba(255,77,0,0.55)]`}
    >
      {/* Heat rising into the tag from below. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ember/45 to-transparent
          opacity-0 transition-opacity duration-300 group-hover/tag:opacity-100"
      />
      {/* Sheen, parked left and swept across on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-full -z-10 w-full -skew-x-12
          bg-gradient-to-r from-transparent via-white/22 to-transparent
          transition-transform duration-700 ease-out group-hover/tag:translate-x-[200%]"
      />
      <span
        className="font-display text-[0.68rem] font-bold tracking-[0.14em] text-bone/90
          uppercase transition-colors duration-300 group-hover/tag:text-hellfire"
      >
        {label}
      </span>
    </li>
  );
}

export default memo(ForgedTag);
