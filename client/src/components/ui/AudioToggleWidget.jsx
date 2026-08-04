import { memo, useState } from "react";
import { infernalAudio } from "../../lib/infernalAudio";

const BARS = [
  { x: 3, h: 8, delay: "0s" },
  { x: 7.5, h: 13, delay: "0.19s" },
  { x: 12, h: 10.5, delay: "0.41s" },
  { x: 16.5, h: 6, delay: "0.62s" },
];

function AudioToggleWidget() {
  const [active, setActive] = useState(false);
  const [available, setAvailable] = useState(true);

  const toggle = () => {
    const next = infernalAudio.toggle();
    setActive(next);

if (!next && !infernalAudio.ready) setAvailable(false);
  };

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      className={`group fixed right-6 bottom-6 z-40 flex h-11 w-11 items-center justify-center
        rounded-full border transition-colors duration-500 ${
          active
            ? "border-ember/80 bg-[#140b12]/90 shadow-[0_0_22px_rgba(255,77,0,0.38)]"
            : "border-iron/70 bg-[#0d0912]/85 hover:border-ember/60"
        }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 22 20"
        className="h-[18px] w-[19px] overflow-visible"
      >
        {BARS.map((bar) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={16 - bar.h}
            width="2.4"
            height={bar.h}
            rx="0.6"

className={
              active
                ? "animate-ember-bar origin-bottom fill-ember"
                : "fill-smoke transition-colors duration-300 group-hover:fill-parchment"
            }
            style={
              active
                ? { animationDelay: bar.delay, transformBox: "fill-box" }
                : undefined
            }
          />
        ))}

        {}
        <line
          x1="1"
          y1="17.5"
          x2="21"
          y2="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`origin-center text-smoke transition-opacity duration-300 ${
            active ? "opacity-0" : "opacity-100"
          }`}
        />
      </svg>

      <span className="sr-only">Ambient sound</span>
    </button>
  );
}

export default memo(AudioToggleWidget);
