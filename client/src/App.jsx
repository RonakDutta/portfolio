import { useEffect } from "react";
import { useEnvironment } from "./lib/useEnvironment";
import { useSmoothScroll } from "./lib/useSmoothScroll";
import { initPointer, SECTIONS } from "./lib/store";

export default function App() {
  const env = useEnvironment();
  useSmoothScroll(env);

  useEffect(() => initPointer(), []);

  return (
    <>
      <a
        href="#gates"
        className="sr-focusable bg-obsidian text-bone px-4 py-2 font-display"
      >
        Skip to content
      </a>

      <main id="descent" className="relative z-10">
        {SECTIONS.map((s) => (
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
