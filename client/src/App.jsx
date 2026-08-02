import { useEffect } from "react";
import { useEnvironment } from "./lib/useEnvironment";
import { useSmoothScroll } from "./lib/useSmoothScroll";
import { initPointer, SECTIONS } from "./lib/store";
import HellCanvas from "./components/HellCanvas";
import Gates from "./sections/Gates";
import Fallen from "./sections/Fallen";
import Arsenal from "./sections/Arsenal";

export default function App() {
  const env = useEnvironment();
  useSmoothScroll(env);

  useEffect(() => initPointer(), []);

  return (
    <>
      <a href="#gates" className="sr-focusable bg-obsidian text-bone px-4 py-2 font-display">
        Skip to content
      </a>

      <HellCanvas env={env} />

      <main id="descent" className="relative z-10">
        <Gates env={env} />
        <Fallen env={env} />
        <Arsenal env={env} />

        {/* Sections IV-VI still placeholders. */}
        {SECTIONS.slice(3).map((s) => (
          <section
            key={s.id}
            id={s.id}
            aria-label={s.label}
            className="flex min-h-screen items-center justify-center"
          >
            <h2 className="font-display text-molten text-6xl">{s.label}</h2>
          </section>
        ))}
      </main>
    </>
  );
}
