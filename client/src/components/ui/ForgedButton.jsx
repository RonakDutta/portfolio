import { memo } from "react";

/**
 * The one button on the site. Two variants, one effect: torchlight rises
 * across the face on hover and the bronze edge brightens. No flames, no
 * sparks, no spring physics — which is also why framer-motion is gone.
 */
function ForgedButton({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const primary = variant === "primary";

  return (
    <Tag
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      className={`group relative isolate inline-flex min-h-12 items-center justify-center
        overflow-hidden px-7 py-3.5 font-mono text-[0.7rem] font-medium
        tracking-[0.2em] uppercase transition-colors duration-400
        ${
          primary
            ? "border border-bronze/55 text-bone hover:text-void"
            : "border border-iron text-parchment hover:border-bronze/45 hover:text-bone"
        }
        ${className}`}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#16121c] to-[#0b0910]"
      />

      {/* Torchlight wash. Primary fills; ghost only warms slightly. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 origin-bottom scale-y-0 transition-transform
          duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:scale-y-100 group-focus-visible:scale-y-100
          ${
            primary
              ? "bg-gradient-to-t from-[#c98b3f] via-bronze-lit to-[#f0d3a6]"
              : "bg-gradient-to-t from-bronze/16 to-transparent"
          }`}
      />

      <span className="relative">{children}</span>
    </Tag>
  );
}

export default memo(ForgedButton);
