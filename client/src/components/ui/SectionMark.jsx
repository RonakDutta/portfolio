import { memo } from "react";

/**
 * The chapter mark that opens every chamber: roman numeral, rule, label.
 *
 * Decorative as a unit (the real heading is the <h2> that follows it), so the
 * whole thing is hidden from assistive tech rather than read out as a stray
 * "II" before every section title.
 */
function SectionMark({ roman, label, className = "" }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-4 ${className}`}>
      <span className="font-display text-sm font-bold tracking-[0.3em] text-ember">{roman}</span>
      <span className="h-px w-10 bg-gradient-to-r from-ember/70 to-transparent" />
      <span className="font-display text-[0.65rem] tracking-[0.42em] text-parchment/70 uppercase">
        {label}
      </span>
    </div>
  );
}

export default memo(SectionMark);
