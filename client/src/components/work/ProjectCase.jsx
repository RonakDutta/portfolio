import { memo, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "../ui/Button";

gsap.registerPlugin(ScrollTrigger);

const smooth = (t) => t * t * (3 - 2 * t);

/**
 * One project, revealed through an aperture.
 *
 * The capture starts as a pinhole of light and opens out to the full frame as
 * it rises up the screen, rimmed by a ring of corona light at the edge of the
 * opening, the way the sun comes back round the moon after totality.
 *
 * Built entirely from transforms, so the scrub never repaints: the window is a
 * circle the size of the frame's diagonal, scaled up from a pinhole, and the
 * capture inside it is counter-scaled by the same amount so it holds still
 * while the window grows around it. The ring is a third layer scaled with the
 * window. The pointer light on hover is a moving layer too, not a repainted
 * gradient.
 */
function ProjectCase({ project, index, total, labels, env }) {
  const frame = useRef(null);
  const aperture = useRef(null);
  const plate = useRef(null);
  const ring = useRef(null);
  const light = useRef(null);
  const [broken, setBroken] = useState(false);

  useLayoutEffect(() => {
    const el = frame.current;
    let floor = 0.07;
    let progress = env.reducedMotion ? 1 : 0;

    const apply = (p) => {
      progress = p;
      const t = smooth(p);
      const scale = floor + (1 - floor) * t;
      const zoom = 1.22 - 0.22 * t;
      aperture.current.style.transform = `scale(${scale.toFixed(4)})`;
      plate.current.style.transform = `scale(${(zoom / scale).toFixed(4)})`;
      ring.current.style.transform = `scale(${scale.toFixed(4)})`;
      ring.current.style.opacity = env.reducedMotion
        ? "0"
        : String(Math.max(0, 1 - Math.max(0, t - 0.3) / 0.5).toFixed(3));
    };

    // Sizes are measured once per resize, never per frame.
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const d = Math.ceil(Math.hypot(w, h)) + 4;
      floor = (Math.min(w, h) * 0.14) / d;
      Object.assign(aperture.current.style, { width: `${d}px`, height: `${d}px`, margin: `${-d / 2}px` });
      Object.assign(ring.current.style, {
        width: `${d * 1.12}px`,
        height: `${d * 1.12}px`,
        margin: `${(-d * 1.12) / 2}px`,
      });
      Object.assign(plate.current.style, {
        width: `${w}px`,
        height: `${h}px`,
        margin: `${-h / 2}px ${-w / 2}px`,
      });
      apply(progress);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    if (env.reducedMotion) return () => ro.disconnect();

    const st = ScrollTrigger.create({
      trigger: el,
      start: "center bottom",
      end: "center 52%",
      scrub: 0.5,
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });

    return () => {
      ro.disconnect();
      st.kill();
    };
  }, [env.reducedMotion]);

  useLayoutEffect(() => {
    if (!env.pointerFx) return undefined;
    const el = frame.current;
    const lightEl = light.current;
    const xTo = gsap.quickTo(lightEl, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(lightEl, "y", { duration: 0.7, ease: "power3" });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    el.addEventListener("pointermove", move);
    return () => {
      el.removeEventListener("pointermove", move);
      gsap.killTweensOf(lightEl);
    };
  }, [env.pointerFx]);

  const num = String(index + 1).padStart(2, "0");
  const letters = Math.max(project.name.length, 8);

  return (
    <article aria-labelledby={`${project.slug}-title`} className="relative">
      <header className="grid items-end gap-x-10 gap-y-5 lg:grid-cols-12">
        <div className="[container-type:inline-size] lg:col-span-9">
          <p data-reveal="up" className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-gold">
            <span>
              {num} / {String(total).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold-lit shadow-[0_0_10px_1px_rgba(236,215,163,0.55)]" />
            <span className="text-bone">{project.category}</span>
            {project.featured ? (
              <>
                <span aria-hidden="true" className="text-ash">
                  /
                </span>
                <span className="text-gold-lit">Featured</span>
              </>
            ) : null}
          </p>
          <h3
            id={`${project.slug}-title`}
            data-reveal="slot"
            className="mt-5 leading-[0.86] font-[850] tracking-[-0.04em] text-ivory uppercase"
            style={{ fontSize: `min(7.5rem, ${(100 / (letters * 0.86)).toFixed(2)}cqi)` }}
          >
            <span className="slot">
              <span className="wide">{project.name}</span>
            </span>
          </h3>
        </div>
        <p
          data-reveal="up"
          className="narrow hidden text-right text-[clamp(3rem,6vw,6rem)] leading-[0.8] font-[200] tracking-[-0.02em] text-gold/80 lg:col-span-3 lg:block"
        >
          {project.year}
        </p>
      </header>

      {/* The aperture. The frame keeps the captures' own ratio at every size,
          so nothing is cropped; on a phone it reaches nearly to the screen
          edges to keep the band legible. */}
      <a
        ref={frame}
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${labels.open}: ${project.name}`}
        className="group/frame relative isolate -mx-3 mt-10 block aspect-[2.104/1] overflow-hidden rounded-[0.9rem] sm:mx-0 sm:mt-14 sm:rounded-[1.75rem]"
      >
        <span
          ref={aperture}
          className="absolute top-1/2 left-1/2 block overflow-hidden rounded-full bg-coal will-change-transform"
        >
          <span ref={plate} className="absolute top-1/2 left-1/2 block will-change-transform">
            {!broken ? (
              <picture>
                <source
                  type="image/webp"
                  sizes="(min-width: 1024px) 90vw, 100vw"
                  srcSet={`${project.image}-800.webp 800w, ${project.image}-1600.webp 1600w`}
                />
                <img
                  src={`${project.image}-fallback.png`}
                  alt={project.imageAlt}
                  width="1600"
                  height="760"
                  loading="lazy"
                  decoding="async"
                  onError={() => setBroken(true)}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </picture>
            ) : (
              <span className="absolute inset-0 grid place-items-center text-ash">{project.name}</span>
            )}
          </span>
        </span>

        <span
          ref={ring}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 block rounded-full will-change-transform"
          style={{
            background:
              "radial-gradient(closest-side, transparent 86.5%, rgba(200,164,92,0.16) 88.4%, rgba(255,248,230,0.95) 89.3%, rgba(236,215,163,0.4) 90.6%, rgba(200,164,92,0.12) 94%, transparent 100%)",
          }}
        />

        {env.pointerFx ? (
          <span
            ref={light}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 -mt-[18rem] -ml-[18rem] block h-[36rem] w-[36rem] rounded-full opacity-0 transition-opacity duration-700 will-change-transform group-hover/frame:opacity-100"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,246,222,0.16), rgba(255,246,222,0.05) 55%, transparent)",
            }}
          />
        ) : null}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(236,215,163,0.16), inset 0 0 80px 6px rgba(7,6,10,0.35)",
          }}
        />
      </a>

      <div className="mt-12 grid gap-x-10 gap-y-12 lg:mt-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p
            data-reveal="up"
            className="text-[clamp(1.25rem,1.05rem+0.7vw,1.7rem)] leading-[1.3] font-[480] tracking-[-0.015em] text-ivory"
          >
            {project.description}
          </p>
          <div data-reveal="up" className="mt-9">
            <Button href={project.liveUrl} target="_blank" rel="noopener noreferrer" arrow="out">
              {labels.open}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p data-reveal="up" className="label text-gold">
            {labels.how}
          </p>
          <ol className="mt-5">
            {project.highlights.map((line, i) => (
              <li
                key={i}
                data-reveal="up"
                style={{ transitionDelay: `${i * 80}ms` }}
                className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-gold/12 py-5 text-[1.02rem] leading-relaxed text-bone/85"
              >
                <span className="label pt-1 text-gold/70">{String(i + 1).padStart(2, "0")}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>

          <p data-reveal="up" className="label mt-8 text-gold">
            {labels.stack}
          </p>
          <p
            data-reveal="up"
            className="mt-3 text-[1.05rem] leading-relaxed font-[560] text-ivory [font-stretch:110%]"
          >
            {project.stack.map((s, i) => (
              <span key={s} className="inline-block whitespace-nowrap">
                {s}
                {i < project.stack.length - 1 ? (
                  <span aria-hidden="true" className="mx-2.5 font-[300] text-gold/60">
                    /
                  </span>
                ) : null}
              </span>
            ))}
          </p>
        </div>
      </div>
    </article>
  );
}

export default memo(ProjectCase);
