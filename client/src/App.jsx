import { useEffect } from "react";
import { useEnvironment } from "./lib/useEnvironment";
import { useSmoothScroll } from "./lib/useSmoothScroll";
import { initReveals } from "./lib/reveal";
import Curtain from "./components/Curtain";
import Atmosphere from "./components/Atmosphere";
import EclipseField from "./components/eclipse/EclipseField";
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

  useEffect(() => initReveals({ reducedMotion: env.reducedMotion }), [env.reducedMotion]);

  return (
    <>
      <Curtain env={env} />

      <a href="#hero" className="sr-focusable label inline-flex min-h-11 items-center bg-gold px-5 text-ink">
        Skip to content
      </a>

      <Atmosphere env={env} />
      <EclipseField env={env} />
      <SiteNav />

      <main className="relative z-10">
        <Hero env={env} />
        <About env={env} />
        <Work env={env} />
        <Skills env={env} />
        <Experience />
        {/* Recognition has no nav entry; the spy holds on Experience through
            it, which is where it sits in the reading order. */}
        <Achievements env={env} />
        <Contact env={env} />
      </main>
    </>
  );
}
