import { memo, useState } from "react";
import { infernalAudio } from "../../lib/infernalAudio";

function AudioToggleWidget() {
  const [active, setActive] = useState(false);

  const toggle = () => {
    const newState = infernalAudio.toggle();
    setActive(newState);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={active ? "Mute ambient audio" : "Unmute ambient audio"}
      className={`group fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 ${
        active
          ? "border-ember/80 bg-[#140b12]/90 text-hellfire shadow-[0_0_20px_rgba(255,77,0,0.4)]"
          : "border-iron/70 bg-[#0d0912]/80 text-smoke hover:border-ember/60 hover:text-parchment"
      }`}
    >
      <span
        aria-hidden="true"
        className={`text-sm transition-transform duration-300 group-hover:scale-110 ${
          active ? "animate-pulse text-ember" : "text-smoke"
        }`}
      >
        {active ? "🔊" : "🔇"}
      </span>

      <span className="sr-only">{active ? "Sound On" : "Sound Off"}</span>
    </button>
  );
}

export default memo(AudioToggleWidget);
