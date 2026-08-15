import { memo, useCallback, useRef } from "react";

/**
 * The one button on the site.
 *
 * Solid: champagne fill, ink label — used once per screen at most.
 * Outline: hairline border that warms to gold, label lifts to ivory.
 *
 * With a real cursor it takes on a very small magnetic pull (6px ceiling).
 * That is the entire interaction: no glow, no sheen, no spring overshoot.
 */
function Button({
  children,
  href,
  onClick,
  variant = "outline",
  magnetic = false,
  className = "",
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const node = useRef(null);
  const solid = variant === "solid";

  const pull = useCallback(
    (event) => {
      if (!magnetic || !node.current) return;
      const r = node.current.getBoundingClientRect();
      const x = (event.clientX - (r.left + r.width / 2)) * 0.14;
      const y = (event.clientY - (r.top + r.height / 2)) * 0.18;
      const clamp = (v) => Math.max(-6, Math.min(6, v));
      node.current.style.transform = `translate(${clamp(x)}px, ${clamp(y)}px)`;
    },
    [magnetic],
  );

  const release = useCallback(() => {
    if (node.current) node.current.style.transform = "";
  }, []);

  return (
    <Tag
      ref={node}
      href={href}
      onClick={onClick}
      type={href ? undefined : "button"}
      onPointerMove={magnetic ? pull : undefined}
      onPointerLeave={magnetic ? release : undefined}
      onBlur={magnetic ? release : undefined}
      className={`group relative inline-flex min-h-12 items-center justify-center gap-3
        px-8 py-3.5 eyebrow-sm transition-[transform,background-color,border-color,color]
        duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform
        ${
          solid
            ? "border border-gold-mid bg-gold-mid text-ink hover:border-gold-pale hover:bg-gold-pale"
            : "border border-line text-pearl hover:border-gold/60 hover:text-ivory"
        }
        ${className}`}
      {...rest}
    >
      {children}
      <span
        aria-hidden="true"
        className={`h-px w-4 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:w-6 ${solid ? "bg-ink/60" : "bg-gold/70"}`}
      />
    </Tag>
  );
}

export default memo(Button);
