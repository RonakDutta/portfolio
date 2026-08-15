import { useEnvironment } from "./lib/useEnvironment";
import { useSmoothScroll } from "./lib/useSmoothScroll";
import Atmosphere from "./components/atmosphere/Atmosphere";
import Curtain from "./components/Curtain";
import LuxuryNav from "./components/brand/LuxuryNav";
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

  return (
    <>
      <Curtain env={env} />

      <a
        href="#hero"
        className="sr-focusable inline-flex min-h-11 items-center border border-gold-metal
          bg-void px-5 text-sm text-ivory"
      >
        Skip to content
      </a>

      <LuxuryNav />
      <Atmosphere env={env} />

      <main className="relative z-10">
        <Hero env={env} />
        <About env={env} />
        <Work env={env} />
        <Skills env={env} />
        <Experience env={env} />
        {/* Achievements has no nav entry; the spy holds on Experience through
            it, which is where it sits in the reading order. */}
        <Achievements env={env} />
        <Contact env={env} />
      </main>
    </>
  );
}
