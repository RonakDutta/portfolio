import { useEffect } from "react";
import { useEnvironment } from "./lib/useEnvironment";
import { useSmoothScroll } from "./lib/useSmoothScroll";
import { initPointer } from "./lib/store";
import HellCanvas from "./components/HellCanvas";
import Gates from "./sections/Gates";
import Fallen from "./sections/Fallen";
import Arsenal from "./sections/Arsenal";
import Chambers from "./sections/Chambers";
import Chronicle from "./sections/Chronicle";
import Summoning from "./sections/Summoning";

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
        <Chambers env={env} />
        <Chronicle env={env} />
        <Summoning env={env} />
      </main>
    </>
  );
}
