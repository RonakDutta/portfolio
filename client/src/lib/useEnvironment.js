import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

/**
 * Reactive `matchMedia`, as an external store rather than state plus an effect.
 *
 * matchMedia is exactly what useSyncExternalStore is for: a value that lives
 * outside React and notifies on change. Reading it into state and syncing in an
 * effect costs a second render on every mount and can tear during a concurrent
 * render. This has neither problem, and needs no effect at all.
 */
function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // Server snapshot: assume the roomier branch, since a desktop layout
  // degrades more gracefully on a phone than the reverse.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function useEnvironment() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const coarsePointer = useMediaQuery("(pointer: coarse)");

  const [tier] = useState(() => {
    if (typeof navigator === "undefined") return "high";
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = navigator.deviceMemory ?? 4;
    if (cores <= 4 || memory <= 4) return "low";
    if (cores <= 8) return "mid";
    return "high";
  });

  const quality = reducedMotion
    ? "low"
    : isMobile && tier === "high"
      ? "mid"
      : tier;

  // The lava fragment shader is where a phone actually spends its frame, and
  // the reason is worth stating plainly: the noise hash is sin-based, so one
  // gnoise costs around twenty-four transcendentals, and the full shader
  // evaluates ten of them per pixel. Everything below is aimed at that number.
  const lean = isMobile || quality === "low";

  return useMemo(
    () => ({
      reducedMotion,
      isMobile,
      coarsePointer,
      quality,
      enable3D: !reducedMotion,
      // 0.85 rather than 1.0 on a phone. The surface is slow organic noise
      // under a heavy vignette, so a 28% cut in pixels shaded is invisible on
      // a 6in screen and is the cheapest frame time on offer here.
      dpr:
        isMobile
          ? [0.7, 0.85]
          : quality === "low"
            ? [1, 1]
            : quality === "mid"
              ? [1, 1.25]
              : [1, 1.5],
      emberCount: isMobile ? 180 : quality === "low" ? 260 : quality === "mid" ? 700 : 1600,
      lavaSegments: isMobile ? 40 : quality === "low" ? 32 : quality === "mid" ? 64 : 96,
      fbmOctaves: isMobile ? 2 : quality === "low" ? 2 : quality === "mid" ? 3 : 4,

      // Drops the two detail layers, worth four of the ten noise evaluations.
      // They are a fine secondary fracture network and a soot speckle, and
      // both are sub-pixel detail at arm's length on a phone.
      lavaDetail: lean ? "plain" : "rich",

      // The lava churns slowly by design; rendering it twice as often as it
      // visibly changes is the other half of the phone's frame budget. Scroll,
      // DOM animation and touch handling stay at full rate, since those are
      // what actually feel laggy when they are not.
      canvasFps: isMobile ? 30 : 0,
    }),
    [reducedMotion, isMobile, coarsePointer, quality, lean],
  );
}
