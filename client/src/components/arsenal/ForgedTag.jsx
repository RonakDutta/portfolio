import { memo } from "react";

function ForgedTag({ label, className = "" }) {
  return (
    <li
      className={`${className} clip-tag surface-forged group/tag relative isolate overflow-hidden
        border border-iron/90 bg-gradient-to-b from-[#2b232f] via-[#191320] to-[#0d0913]
        py-2 pr-4 pl-6 transition-[transform,border-color,box-shadow] duration-300
        hover:-translate-y-[3px] hover:border-brimstone/80
        hover:shadow-[0_0_22px_-2px_rgba(255,77,0,0.75),inset_0_1px_0_rgba(255,235,205,0.18)]`}
    >
      {}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-2.5 h-1 w-1 -translate-y-1/2 rounded-full
          bg-smoke/70 shadow-[inset_0_-1px_0_rgba(0,0,0,0.9)]
          transition-colors duration-300 group-hover/tag:bg-hellfire"
      />

      {}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ember/55 via-ember/10 to-transparent
          opacity-0 transition-opacity duration-300 group-hover/tag:opacity-100"
      />

      {}
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
