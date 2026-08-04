import { memo } from "react";

function SectionMark({ roman, label, className = "" }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-4 ${className}`}>
      <span className="font-display text-sm font-bold tracking-[0.3em] text-ember">{roman}</span>
      <span className="h-px w-10 bg-gradient-to-r from-ember/70 to-transparent" />
      <span className="font-display text-[0.65rem] tracking-[0.42em] text-parchment/85 uppercase">
        {label}
      </span>
    </div>
  );
}

export default memo(SectionMark);
