import { memo } from "react";

/** An outbound link with a drawn gold rule and a lifting arrow. */
function GoldLink({ href, children, context, className = "" }) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className={`gold-underline group inline-flex min-h-11 items-center gap-3 eyebrow-sm
        text-ivory transition-colors duration-500 hover:text-gold-white ${className}`}
    >
      {children}
      {context ? <span className="sr-only"> — {context}</span> : null}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="h-2.5 w-2.5 text-gold-metal transition-transform duration-500
          ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
      >
        <path d="M2 10 10 2M4 2h6v6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </a>
  );
}

export default memo(GoldLink);
