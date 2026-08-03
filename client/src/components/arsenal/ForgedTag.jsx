import { memo } from "react";

/**
 * One tool, struck as an iron tag hanging on a rack.
 *
 * Hover states are plain CSS transitions rather than Framer. There are twenty
 * of these on screen at once, and twenty motion components each subscribing to
 * their own state is real overhead for what is a colour change and a two-pixel
 * lift.
 *
 * The metal comes from three cheap things stacked: an inset highlight along the
 * top edge and shadow along the bottom (so it reads as struck rather than
 * drawn), text cut into the face rather than sitting on it, and a rivet at each
 * end. The sheen sweeping across on hover is what stops it looking like a chip.
 *
 * Not focusable, deliberately. These are labels, not controls: making them tab
 * stops would put nineteen dead stops between the visitor and the next real
 * link, which costs a keyboard user far more than the sheen gives them.
 */
function ForgedTag({ label, className = "" }) {
  return (
    <li
      className={`${className} clip-tag surface-forged group/tag relative isolate overflow-hidden
        border border-iron/90 bg-gradient-to-b from-[#2b232f] via-[#191320] to-[#0d0913]
        py-2 pr-4 pl-6 transition-[transform,border-color,box-shadow] duration-300
        hover:-translate-y-[3px] hover:border-brimstone/80
        hover:shadow-[0_0_22px_-2px_rgba(255,77,0,0.75),inset_0_1px_0_rgba(255,235,205,0.18)]`}
    >
      {/* Rivet. Sits in the pl-6 gutter so it never crowds the label. */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-2.5 h-1 w-1 -translate-y-1/2 rounded-full
          bg-smoke/70 shadow-[inset_0_-1px_0_rgba(0,0,0,0.9)]
          transition-colors duration-300 group-hover/tag:bg-hellfire"
      />

      {/* Heat coming up into the tag from the forge below. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ember/55 via-ember/10 to-transparent
          opacity-0 transition-opacity duration-300 group-hover/tag:opacity-100"
      />

      {/* Sheen, parked left and swept across on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -left-full -z-10 w-full -skew-x-12
          bg-gradient-to-r from-transparent via-white/25 to-transparent
          transition-transform duration-700 ease-out group-hover/tag:translate-x-[200%]"
      />

      <span
        className="text-engraved font-display text-[0.68rem] font-bold tracking-[0.14em]
          text-bone uppercase transition-colors duration-300 group-hover/tag:text-hellfire"
      >
        {label}
      </span>
    </li>
  );
}

export default memo(ForgedTag);
