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

  return useMemo(
    () => ({
      reducedMotion,
      isMobile,
      coarsePointer,
      quality,
      enable3D: !reducedMotion,
      dpr:
        isMobile
          ? [0.85, 1.0]
          : quality === "low"
            ? [1, 1]
            : quality === "mid"
              ? [1, 1.25]
              : [1, 1.5],
      emberCount: isMobile ? 180 : quality === "low" ? 260 : quality === "mid" ? 700 : 1600,
      lavaSegments: isMobile ? 40 : quality === "low" ? 32 : quality === "mid" ? 64 : 96,
      fbmOctaves: isMobile ? 2 : quality === "low" ? 2 : quality === "mid" ? 3 : 4,
    }),
    [reducedMotion, isMobile, coarsePointer, quality],
  );
}
