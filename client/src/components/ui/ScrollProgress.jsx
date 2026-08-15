import { useEffect, useRef } from "react";

/**
 * A brass hairline across the very top of the viewport that fills as the page
 * is read. Scroll events only ever schedule a frame, so a fast wheel never
 * queues more work than the compositor can take.
 */
export default function ScrollProgress() {
  const bar = useRef(null);

  useEffect(() => {
    let raf = 0;

    const paint = () => {
      raf = 0;
      const doc = document.documentElement;
      const span = doc.scrollHeight - window.innerHeight;
      const ratio = span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${ratio})`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px bg-transparent"
    >
      <span
        ref={bar}
        className="block h-full w-full origin-left scale-x-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(138,109,51,0), #c8a45c 40%, #ecd7a3 100%)",
        }}
      />
    </div>
  );
}
