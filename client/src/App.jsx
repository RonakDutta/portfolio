import { useEffect } from "react";
import { useEnvironment } from "./lib/useEnvironment";
import { useSmoothScroll } from "./lib/useSmoothScroll";
import { initReveals } from "./lib/reveal";
import Atmosphere from "./components/atmosphere/Atmosphere";
import Curtain from "./components/Curtain";
import Cursor from "./components/fx/Cursor";
import ScrollProgress from "./components/ui/ScrollProgress";
import SiteNav from "./components/brand/SiteNav";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Work from "./sections/Work";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";

export default function App() {
  const env = useEnvironment();
  useSmoothScroll(env);

  useEffect(
    () => initReveals({ reducedMotion: env.reducedMotion }),
    [env.reducedMotion],
  );

  return (
    <>
      <Curtain env={env} />
      <Cursor enabled={env.pointerFx} />
      <ScrollProgress />

      <a
        href="#hero"
        className="sr-focusable inline-flex min-h-11 items-center border border-brass
          bg-ink px-5 text-sm text-ivory"
      >
        Skip to content
      </a>

      <SiteNav />
      <Atmosphere env={env} />

      <main className="relative z-10">
        <Hero env={env} />
        <About />
        <Work env={env} />
        <Skills />
        <Experience />
        {/* Achievements has no nav entry; the spy holds on Experience through
            it, which is where it sits in the reading order. */}
        <Achievements />
        <Contact />
      </main>
    </>
  );
}
