import { useEnvironment } from "./lib/useEnvironment";
import { useSmoothScroll } from "./lib/useSmoothScroll";
import Atmosphere from "./components/Atmosphere";
import Curtain from "./components/Curtain";
import Nav from "./components/nav/Nav";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Work from "./sections/Work";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Recognition from "./sections/Recognition";
import Contact from "./sections/Contact";

export default function App() {
  const env = useEnvironment();
  useSmoothScroll(env);

  return (
    <>
      <Curtain env={env} />

      <a
        href="#hero"
        className="sr-focusable inline-flex min-h-11 items-center border border-gold/50
          bg-ink px-5 text-sm text-ivory"
      >
        Skip to content
      </a>

      <Nav />
      <Atmosphere env={env} />

      <main className="relative z-10">
        <Hero env={env} />
        <About env={env} />
        <Work env={env} />
        <Skills env={env} />
        <Experience env={env} />
        {/* Recognition has no nav entry; the spy holds on Experience through
            it, which is the correct reading of where it belongs. */}
        <Recognition env={env} />
        <Contact env={env} />
      </main>
    </>
  );
}
