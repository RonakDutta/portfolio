/**
 * State for the gate that covers the page on a cold load.
 *
 * The markup lives in index.html so the parser paints it before any script
 * runs; this module is only the wiring around it. Two things need to talk to
 * it from a long way off:
 *
 *   - the scene, three levels down inside a lazy chunk, reports that it has
 *     actually put pixels on the canvas, so the gate never opens onto an
 *     unrendered black rectangle;
 *   - the hero waits for the gate to part before playing its entrance, since
 *     an entrance performed behind a closed door is an entrance nobody sees.
 *
 * `crossed` starts true when there is no gate in the document at all. Anything
 * waiting on it then runs immediately rather than waiting forever, which is
 * what makes the 404 page and any future entry point work without special
 * casing.
 */

const SESSION_KEY = "descent:crossed";

let crossed =
  typeof document === "undefined" || !document.getElementById("threshold");

const crossWaiters = new Set();

/** Fires when the page is revealed. Runs at once if it already has been. */
export function onCrossed(fn) {
  if (crossed) {
    fn();
    return () => {};
  }
  crossWaiters.add(fn);
  return () => crossWaiters.delete(fn);
}

export function markCrossed() {
  if (crossed) return;
  crossed = true;
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Private mode, or storage disabled. The gate simply plays again.
  }
  for (const fn of crossWaiters) fn();
  crossWaiters.clear();
}

/**
 * Once per tab, not once per load. Someone reloading to look at a detail
 * should not have to sit through the door a second time, but someone arriving
 * fresh tomorrow should still get it.
 */
export function alreadyCrossed() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

let sceneReady = false;
const sceneWaiters = new Set();

/** Called from inside the canvas once a frame has genuinely been drawn. */
export function markSceneReady() {
  if (sceneReady) return;
  sceneReady = true;
  for (const fn of sceneWaiters) fn();
  sceneWaiters.clear();
}

export function onSceneReady(fn) {
  if (sceneReady) {
    fn();
    return () => {};
  }
  sceneWaiters.add(fn);
  return () => sceneWaiters.delete(fn);
}
