import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

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

return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function useEnvironment() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const coarsePointer = useMediaQuery("(pointer: coarse)");
  const saveData =
    typeof navigator !== "undefined" && Boolean(navigator.connection?.saveData);

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

const lean = isMobile || quality === "low";

  return useMemo(
    () => ({
      reducedMotion,
      isMobile,
      coarsePointer,
      quality,
      saveData,
      enable3D: !reducedMotion && !saveData && !(isMobile && quality === "low"),

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

lavaDetail: lean ? "plain" : "rich",

canvasFps: isMobile ? 30 : 0,
    }),
    [reducedMotion, isMobile, coarsePointer, quality, lean, saveData],
  );
}
