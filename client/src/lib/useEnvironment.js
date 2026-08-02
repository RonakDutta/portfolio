import { useEffect, useState } from "react";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
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

  return {
    reducedMotion,
    isMobile,
    coarsePointer,
    quality,
    enable3D: !reducedMotion,
    dpr: quality === "low" ? [1, 1] : quality === "mid" ? [1, 1.35] : [1, 1.75],
    emberCount: quality === "low" ? 260 : quality === "mid" ? 900 : 2200,
    lavaSegments: quality === "low" ? 32 : quality === "mid" ? 72 : 128,
    fbmOctaves: quality === "low" ? 2 : quality === "mid" ? 3 : 5,
  };
}
