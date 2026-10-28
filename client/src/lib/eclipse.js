/**
 * The eclipse registry.
 *
 * The page has one WebGL corona (EclipseField) and any number of places it can
 * appear (Eclipse anchors: the hero, the contact). Anchors register here; the
 * field reads them every frame and draws around whichever one is on screen.
 *
 * Each entry is plain mutable state, so pointer handlers and scroll tweens can
 * write to it without React ever rendering.
 */
export const eclipses = new Set();

/**
 * `awake` scales the whole corona. The overture holds it at zero until its own
 * eclipse has landed on the hero, then lets the corona erupt.
 */
export const field = { awake: 1, supported: true };

export function registerEclipse(entry) {
  eclipses.add(entry);
  return () => eclipses.delete(entry);
}

/** The anchor the overture flies its eclipse to. */
export function primaryEclipse() {
  for (const entry of eclipses) if (entry.primary) return entry;
  return null;
}
