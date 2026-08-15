import { useEffect } from "react";
import { useEnvironment } from "./lib/useEnvironment";
import { useSmoothScroll } from "./lib/useSmoothScroll";
import { initPointer } from "./lib/store";
import HellCanvas from "./components/HellCanvas";
import Threshold from "./components/Threshold";
import StoneNav from "./components/nav/StoneNav";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Work from "./sections/Work";
import Skills from "./sections/Skills";
import Record from "./sections/Record";
import Contact from "./sections/Contact";

export default function App() {
  const env = useEnvironment();
  useSmoothScroll(env);

  useEffect(() => initPointer(), []);

  return (
    <>
      <Threshold env={env} />

      <a
        href="#gates"
        className="sr-focusable inline-flex min-h-11 items-center border border-bronze/50
          bg-obsidian px-4 font-mono text-sm text-bone"
      >
        Skip to content
      </a>

      <StoneNav />

      <HellCanvas env={env} />

      {/* Work sits directly after About: it is the thing most visitors came
          for, and burying it behind the skills list helps nobody. */}
      <main id="descent" className="relative z-10">
        <Hero env={env} />
        <About env={env} />
        <Work env={env} />
        <Skills env={env} />
        <Record env={env} />
        <Contact env={env} />
      </main>
    </>
  );
}
