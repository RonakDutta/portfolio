import { memo, useRef } from "react";
import gsap from "gsap";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

/** A struck seal: a sunburst of rays around the numeral. */
function Seal({ index }) {
  const rays = Array.from({ length: 48 }, (_, i) => i);
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className="h-20 w-20 overflow-visible sm:h-24 sm:w-24">
      <defs>
        <radialGradient id={`seal-${index}`}>
          <stop offset="0" stopColor="#fff6de" />
          <stop offset="0.6" stopColor="#ecd7a3" />
          <stop offset="1" stopColor="#a8843f" />
        </radialGradient>
      </defs>
      <g className="origin-center transition-transform duration-[1600ms] ease-[var(--ease-cine)] group-hover:rotate-[60deg]">
        {rays.map((i) => {
          const a = (i / rays.length) * Math.PI * 2;
          const long = i % 2 === 0;
          const r1 = 31;
          const r2 = long ? 48 : 41;
          return (
            <line
              key={i}
              x1={50 + Math.cos(a) * r1}
              y1={50 + Math.sin(a) * r1}
              x2={50 + Math.cos(a) * r2}
              y2={50 + Math.sin(a) * r2}
              stroke="#c8a45c"
              strokeOpacity={long ? 0.7 : 0.35}
              strokeWidth={long ? 0.9 : 0.6}
            />
          );
        })}
      </g>
      <circle cx="50" cy="50" r="27" fill={`url(#seal-${index})`} />
      <circle cx="50" cy="50" r="23.5" fill="none" stroke="#07060a" strokeOpacity="0.35" strokeWidth="0.6" />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#07060a"
        style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 15, fontStretch: "125%" }}
      >
        {NUMERALS[index] ?? index + 1}
      </text>
    </svg>
  );
}

/**
 * A card that behaves like a piece of struck metal in the hand: it tips toward
 * the pointer and a highlight slides across its face.
 */
function Medal({ item, index, env }) {
  const card = useRef(null);

  const move = (e) => {
    const el = card.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    gsap.to(el, {
      rotateY: (px - 0.5) * 12,
      rotateX: (0.5 - py) * 10,
      duration: 0.8,
      ease: "power3.out",
      overwrite: "auto",
    });
  };
  const leave = () => {
    gsap.to(card.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.6)",
      overwrite: "auto",
    });
  };

  return (
    <div className="h-full [perspective:1000px]">
      <article
        ref={card}
        onPointerMove={env.pointerFx ? move : undefined}
        onPointerLeave={env.pointerFx ? leave : undefined}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 [transform-style:preserve-3d] sm:p-9"
        style={{
          background: "linear-gradient(160deg, #1a1620 0%, #0e0c12 55%, #0a090d 100%)",
          boxShadow: "inset 0 0 0 1px rgba(236,215,163,0.16), 0 30px 60px -30px rgba(0,0,0,0.9)",
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(28rem 20rem at var(--mx, 50%) var(--my, 0%), rgba(236,215,163,0.16), transparent 65%), linear-gradient(115deg, transparent 30%, rgba(255,246,222,0.06) 48%, transparent 62%)",
          }}
        />

        <Seal index={index} />

        <h3 className="mt-12 text-[1.45rem] leading-[1.12] font-[720] tracking-[-0.02em] text-ivory [font-stretch:112%] sm:text-[1.6rem]">
          {item.name}
        </h3>
        <p className="label mt-4 text-gold">{item.org}</p>
        <p className="mt-5 text-[0.98rem] leading-relaxed text-bone/75">{item.note}</p>
      </article>
    </div>
  );
}

export default memo(Medal);
