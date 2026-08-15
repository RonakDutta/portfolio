import { useCallback, useMemo, useSyncExternalStore } from "react";

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

  return useMemo(
    () => ({
      reducedMotion,
      isMobile,
      coarsePointer,
      // Pointer-driven flourishes: only where there is a real cursor and the
      // visitor has not asked for less movement.
      pointerFx: !coarsePointer && !reducedMotion,
      lightweight: reducedMotion,
    }),
    [reducedMotion, isMobile, coarsePointer],
  );
}
