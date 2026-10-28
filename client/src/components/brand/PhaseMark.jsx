import { memo, useEffect, useRef } from "react";

/**
 * Reading progress, told as an eclipse. At the top of the page the sun is
 * bare; the moon slides across it as you read, and the page closes in
 * totality, where the corona ring lights.
 */
function PhaseMark({ className = "" }) {
  const moon = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (moon.current) moon.current.setAttribute("cx", (-9 + p * 21).toFixed(2));
      if (ring.current) ring.current.style.opacity = String(Math.max(0, (p - 0.9) * 10));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`overflow-visible ${className}`}>
      <defs>
        <radialGradient id="pm-sun">
          <stop offset="0" stopColor="#fff6de" />
          <stop offset="0.7" stopColor="#ecd7a3" />
          <stop offset="1" stopColor="#c8a45c" />
        </radialGradient>
        <clipPath id="pm-clip">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <circle
        ref={ring}
        cx="12"
        cy="12"
        r="9.6"
        fill="none"
        stroke="#ecd7a3"
        strokeWidth="1.2"
        style={{ opacity: 0, filter: "drop-shadow(0 0 3px rgba(236,215,163,0.9))" }}
      />
      <circle cx="12" cy="12" r="8" fill="url(#pm-sun)" />
      <g clipPath="url(#pm-clip)">
        <circle ref={moon} cx="-9" cy="12" r="8.2" fill="#07060a" />
      </g>
    </svg>
  );
}

export default memo(PhaseMark);
